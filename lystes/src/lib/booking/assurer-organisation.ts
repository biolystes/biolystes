import { supabase } from "@lystes/integrations/supabase/client";
import { assurerModelesMessages } from "@lystes/lib/booking/modeles-messages";

/**
 * L'organisation de réservation d'un compte.
 *
 * LE VERROU DU MODULE DE RENDEZ-VOUS, levé le 12/08/2026.
 *
 * Quinze écrans sont écrits, routés et alimentés par vingt-quatre tables. Ils
 * affichaient tous ZÉRO, et pas parce qu'il manquait du code : aucun `INSERT`
 * dans `cc_organizations` n'existait nulle part, ni dans le front, ni dans une
 * fonction edge, ni dans une migration. `useOrg` cherchait une ligne
 * `cc_org_members` puis un `owner_id` ; les deux étaient vides pour tous les
 * comptes, donc `orgId` restait indéfini, et les vingt-deux requêtes du module
 * portent `enabled: !!orgId`.
 *
 * La politique d'accès autorise pourtant un membre du compte à la créer :
 * « Account members can manage their organization », FOR ALL, avec
 * `user_can_manage_account(account_id)` en WITH CHECK (migration
 * 20260426203018:138-141). Il ne manquait donc que quelqu'un pour appeler.
 *
 * Deux modèles d'identité coexistent, et c'est ce qui a fait douter : la
 * politique raisonne par COMPTE, le hook par APPARTENANCE. On écrit les deux,
 * `cc_organizations` ET `cc_org_members`, pour que les deux lectures trouvent.
 *
 * Idempotent : deux appels ne créent pas deux organisations.
 */

export interface Organisation {
  id: string;
  slug: string;
  name: string;
}

/** Un identifiant lisible, dérivé du nom de la boutique. */
function slugDepuis(nom: string): string {
  return (
    (nom || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "boutique"
  );
}

async function lireParCompte(accountId: string): Promise<Organisation | null> {
  const { data, error } = await supabase
    .from("cc_organizations")
    .select("id, slug, name")
    .eq("account_id", accountId)
    .maybeSingle();
  if (error) {
    console.error("[booking][organisation] lecture impossible :", error.message);
    return null;
  }
  return (data as Organisation) ?? null;
}

/**
 * Crée l'organisation du compte si elle manque, et rattache l'utilisateur
 * courant. Ne lève jamais : un module de rendez-vous indisponible ne doit pas
 * faire tomber le tableau de bord.
 */
export async function assurerOrganisation(
  accountId: string | null | undefined,
): Promise<Organisation | null> {
  if (!accountId) return null;

  const { data: auth } = await supabase.auth.getUser();
  const utilisateur = auth?.user;
  if (!utilisateur) return null;

  let organisation = await lireParCompte(accountId);

  if (!organisation) {
    /* Le fuseau horaire vient du navigateur du marchand, pas du serveur. C'est
       lui qui décide de l'heure affichée à ses clients, et une confirmation
       rendue en UTC annonce 14 h pour un rendez-vous de 16 h. */
    let fuseau = "Europe/Paris";
    try {
      fuseau = Intl.DateTimeFormat().resolvedOptions().timeZone || fuseau;
    } catch {
      /* navigateur sans base de fuseaux : Paris fait un défaut raisonnable */
    }

    const { data: compte } = await supabase
      .from("accounts")
      .select("name")
      .eq("id", accountId)
      .maybeSingle();

    const nom = ((compte as { name?: string } | null)?.name || "Ma boutique").trim();

    const { data, error } = await supabase
      .from("cc_organizations")
      .insert([
        {
          account_id: accountId,
          owner_id: utilisateur.id,
          name: nom,
          slug: `${slugDepuis(nom)}-${accountId.slice(0, 6)}`,
          timezone: fuseau,
        },
      ])
      .select("id, slug, name")
      .single();

    if (error) {
      /* Course entre deux onglets : si l'autre l'a créée entre-temps, on rend
         la sienne plutôt que de signaler une panne qui n'en est pas une. */
      console.error("[booking][organisation] création impossible :", error.message, error.details ?? "");
      organisation = await lireParCompte(accountId);
      if (!organisation) return null;
    } else {
      organisation = data as Organisation;
    }
  }

  /* Le rattachement, séparé de la création : une organisation peut exister
     sans que CE membre y soit rattaché, par exemple un second collaborateur
     qui ouvre le module pour la première fois. */
  const { data: adhesion } = await supabase
    .from("cc_org_members")
    .select("id")
    .eq("org_id", organisation.id)
    .eq("user_id", utilisateur.id)
    .maybeSingle();

  if (!adhesion) {
    const { error: erreurAdhesion } = await supabase
      .from("cc_org_members")
      .insert([{ org_id: organisation.id, user_id: utilisateur.id, role: "owner" as never }]);
    if (erreurAdhesion) {
      /* Non bloquant : la lecture par `owner_id` prend le relais dans useOrg. */
      console.error("[booking][organisation] rattachement impossible :", erreurAdhesion.message);
    }
  }

  /* Les modèles de messages, dans la foulée : l'écran Notifications ne sait
     que MODIFIER des modèles, jamais en créer. Sans cet amorçage il reste vide
     à vie, et le marchand n'a rien à personnaliser. */
  const poses = await assurerModelesMessages(organisation.id);
  if (poses > 0) {
    console.info(`[booking][organisation] ${poses} modèles de messages posés`);
  }

  return organisation;
}
