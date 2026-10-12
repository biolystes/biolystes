import { LYSTES_ENV } from "@lystes/integrations/supabase/env";
/**
 * Canonical URLs for the Lystes widget.
 *
 * SINGLE SOURCE OF TRUTH — any component that shows an install snippet must
 * import from here. Do NOT hardcode widget URLs elsewhere.
 */

import { lienActivationAgent, lienAjoutChatFiche, lienAjoutLots, SHOPIFY_CLIENT_ID } from "./shopify-app";
import { poseVue } from "../../supabase/functions/_shared/pose-verifiee";

/** Public origin where marketing pages and the widget script are served. */
export const LYSTES_ORIGIN = "https://lystes.ai";

/**
 * Prise de rendez-vous d'accompagnement (30 min, gratuit).
 * Utilisé par tous les écrans qui proposent « être accompagné » ou qui
 * affichent une aide en cas de difficulté. Ne pas dupliquer ce lien.
 */
export const BOOKING_URL = "https://www.cal.eu/lystes/30min";

/**
 * Canonical widget script URL. The file lives in `public/shopify-embed.js`
 * (deployed at the root of `lystes.ai`) and is universal for both Shopify
 * and non-Shopify sites — it detects the platform at runtime.
 */
export const WIDGET_URL = `${LYSTES_ORIGIN}/shopify-embed.js`;

/**
 * Le code à coller, prêt à copier.
 *
 * ═══ JAMAIS DE CODE SANS BOUTIQUE NI AGENT ═══
 *
 * Défaut relevé par l'audit du 26/09/2026. Cette fonction remplissait les
 * trous : sans boutique, elle écrivait un identifiant de remplacement en
 * capitales ; sans agent, elle omettait simplement `data-agent-id`. Les deux
 * codes partaient quand même vers le presse-papier :
 *   - l'identifiant de remplacement est refusé par `widget-ping`, et le
 *     widget ne retrouve personne ;
 *   - sans agent, la garde de `public/shopify-embed.js` pose un encadré ROUGE
 *     sur les fiches produit, visible par toutes les clientes.
 * Le guide Shopify public en distribuait un à toute visiteuse non connectée,
 * avec un bouton Copier actif.
 *
 * La règle vit désormais ICI, à la source, et non dans chaque écran : sans
 * boutique OU sans agent, le code est une chaîne vide. Un écran qui reçoit du
 * vide explique ce qui manque au lieu de montrer un code mort.
 * Règle exécutable : src/test/code-installation-porte-un-agent.test.tsx
 */
export function buildWidgetSnippet(opts: {
  accountId?: string | null;
  agentId?: string | null;
  primaryColor?: string;
  /** Langue forcée du widget (ISO 639-1). À omettre en général : le widget
   *  détecte la langue du site (html lang, locale plateforme, URL). */
  language?: string | null;
}): string {
  const account = (opts.accountId || "").trim();
  const agent = (opts.agentId || "").trim();
  if (!account || !agent) return "";
  const color = opts.primaryColor ?? "#000000";
  const langAttr = opts.language ? `\n  data-language="${opts.language}"` : "";
  return `<!-- Lystes AI Widget -->\n<script\n  src="${WIDGET_URL}"\n  data-account-id="${account}"\n  data-agent-id="${agent}"${langAttr}\n  data-primary-color="${color}"\n  defer></script>`;
}

/**
 * Le script des lots pour une boutique Shopify.
 * À coller dans `theme.liquid`, juste avant `</body>`. Il n'envoie aucun prix :
 * il lit celui de la boutique (voir public/lystes-bundle-shopify.js).
 */
export const LOT_SHOPIFY_URL = `${LYSTES_ORIGIN}/lystes-bundle-shopify.js`;

export function buildLotShopifySnippet(accountId?: string | null): string {
  /* Même règle que le code de l'agent : sans boutique, pas de code. Un
     identifiant de remplacement collé tel quel n'affiche aucun lot, et ne
     le dit pas. */
  const compte = (accountId || "").trim();
  if (!compte) return "";
  return `<!-- Lystes AI, lots -->\n<script\n  src="${LOT_SHOPIFY_URL}"\n  data-compte="${compte}"\n  defer></script>`;
}


/**
 * LE CODE D'INSTALLATION SHOPIFY, EN UN SEUL COPIER-COLLER.
 *
 * JP, 04/09/2026 : « il installe juste que ça marche donc groupe le code il
 * faut juste 1 seul copié collé ». Deux encadrés de code sur un écran
 * d'installation posent une question à laquelle la marchande n'a pas de
 * réponse : lequel est obligatoire, lequel peut attendre, faut-il les deux ?
 * Elle en colle un, s'arrête, et ses lots ne s'affichent jamais.
 *
 * Un seul bloc, un seul bouton Copier, une seule question réglée.
 *
 * Charger le script des lots sur toute la boutique ne coûte rien à celle qui
 * n'en a pas encore : `public/lystes-bundle-shopify.js` sort avant tout
 * affichage dès que l'URL n'est pas une fiche produit, et n'affiche rien du
 * tout quand la fiche n'a pas de lot. Pas de cadre vide, pas même sa feuille
 * de style. C'est écrit dans son en-tête, point 1.
 *
 * Le jour où elle crée son premier lot, il n'y a donc rien à recoller.
 */
export function buildSnippetShopifyComplet(opts: {
  accountId?: string | null;
  agentId?: string | null;
  primaryColor?: string;
  language?: string | null;
}): string {
  const sansEnTete = (code: string) => code.replace(/^<!--[^\n]*-->\n/, "");
  const codeAgent = buildWidgetSnippet(opts);
  // Sans agent, pas de code du tout : les lots seuls feraient croire que
  // l'installation est complète alors que personne ne répondra.
  if (!codeAgent) return "";
  const agent = sansEnTete(codeAgent);
  const lots = sansEnTete(buildLotShopifySnippet(opts.accountId));
  return `<!-- Lystes AI -->\n${agent}\n${lots}`;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * L'APPLICATION SHOPIFY ET SON INTERRUPTEUR DANS LE THÈME
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Audit du 26/09/2026, blocage 3 : les guides faisaient coller un script dans
 * `theme.liquid`. C'est ce que l'examen Shopify refuse (exigence 5.1.1 : une
 * application qui modifie le thème passe par une extension de thème) et c'est
 * l'écran où les installations s'arrêtaient.
 *
 * L'extension existe depuis le 24/09 : `shopify-app-config/extensions/
 * lystes-agent`, bloc `agent.liquid` (un APP EMBED, cible `body`) et bloc
 * `lots.liquid` (un APP BLOCK de fiche produit). Shopify ouvre l'éditeur de
 * thème avec l'embed déjà activé par un lien profond. Depuis le 27/09
 * (lot 4), les blocs n'ont plus de champ à remplir : l'identifiant du compte
 * vient d'un metafield app-data. L'identifiant de l'app et les liens vivent
 * dans `src/config/shopify-app.ts` ; ils sont ré-exportés ici sous leurs
 * anciens noms.
 *
 * Le code à coller reste pour les sites hors Shopify.
 */

/** Le `client_id` de l'application publique Lystes (shopify-app-config/shopify.app.toml). */
export const SHOPIFY_APP_CLIENT_ID = SHOPIFY_CLIENT_ID;

/**
 * Le domaine `.myshopify.com` d'une saisie, ou une chaîne vide.
 *
 * Accepte ce que la marchande colle vraiment : « maboutique »,
 * « https://maboutique.myshopify.com/ », ou l'adresse de son admin
 * « admin.shopify.com/store/maboutique ». Refuse un domaine public comme
 * « maboutique.fr » : on ne peut pas en déduire la boutique, et les liens de
 * l'admin construits dessus ouvraient une page d'erreur Shopify.
 */
export function domaineMyshopify(brut?: string | null): string {
  const saisie = (brut ?? "").trim().toLowerCase();
  if (!saisie) return "";
  const admin = saisie.match(/admin\.shopify\.com\/store\/([a-z0-9][a-z0-9-]*)/);
  if (admin) return `${admin[1]}.myshopify.com`;
  const hote = saisie
    .replace(/^[a-z]+:\/\//, "")
    .replace(/[/?#].*$/, "")
    .replace(/^www\./, "");
  if (/^[a-z0-9][a-z0-9-]*$/.test(hote)) return `${hote}.myshopify.com`;
  if (/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(hote)) return hote;
  return "";
}

/** Ouvre l'éditeur de thème avec l'agent Lystes déjà activé. Vide sans boutique. */
export function lienActivationAgentShopify(domaine?: string | null): string {
  return lienActivationAgent(domaineMyshopify(domaine));
}

/** Ouvre le modèle de fiche produit avec le bloc des lots déjà ajouté. */
export function lienBlocLotsShopify(domaine?: string | null): string {
  return lienAjoutLots(domaineMyshopify(domaine));
}

/** Ouvre le modèle de fiche produit avec le bloc « Chat de la fiche » déjà ajouté. */
export function lienBlocChatFicheShopify(domaine?: string | null): string {
  return lienAjoutChatFiche(domaineMyshopify(domaine));
}

/* ═══════════════════════════════════════════════════════════════════════════
 * LA VÉRIFICATION DE LA POSE, ÉCRITE UNE SEULE FOIS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Audit du 26/09/2026, point 4. Les trois écrans d'installation lisaient la
 * table `widget_pings` depuis le navigateur. Sa seule politique est
 * « USING (false) », elle est absente des types régénérés le 19/09, et le
 * script de l'extension WordPress n'y écrit jamais : la vérification ne
 * pouvait réussir sur aucun chemin, et son échec ne disait rien.
 *
 * La fonction `verify-install` existe, elle : elle ouvre la page, reconnaît
 * le script de Shopify comme celui de WordPress, contrôle que c'est le bon
 * compte, et écrit `accounts.install_verified`. Tous les écrans passent
 * désormais par ici.
 *
 * Le client Supabase est passé en paramètre, comme dans
 * `src/config/shopify-examen.ts` : ce fichier de configuration reste
 * importable par les tests sans ouvrir de connexion.
 */

/** Les verdicts de `verify-install`, plus la panne du service lui-même. */
export type DiagnosticPose =
  | "ok"
  | "script_absent"
  | "wrong_account"
  | "page_unreachable"
  | "page_protected"
  | "not_a_product_page"
  | "invalid_url"
  | "service_injoignable";

export interface ResultatVerificationPose {
  /** Vrai seulement quand le script est lu sur la page, avec CE compte. */
  pose: boolean;
  diagnostic: DiagnosticPose;
  /** L'adresse réellement ouverte par la vérification. */
  adresse: string;
  /**
   * Faux quand le serveur a vu le conseiller sans pouvoir l'enregistrer dans
   * l'espace (`persisted: false`) : écriture ratée, ou appelant sans session
   * ni adhésion au compte. Audit du 27/09, point 12 : ce drapeau était rendu
   * et personne ne le lisait, si bien que la page se disait vérifiée et que
   * le tableau de bord redemandait l'installation au rechargement.
   */
  enregistree: boolean;
  /**
   * Les fichiers du conseiller lus sur la page (`woo-product-chat.js` pour
   * l'extension WordPress, `shopify-embed.js` pour le code collé). `null`
   * quand le serveur ne les dit pas : version de `verify-install` antérieure
   * au 27/09, ou vérification qui n'a pas abouti.
   */
  scripts: string[] | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClientSupabase = any;

/**
 * Ouvre la page et dit si le conseiller y est posé.
 *
 * `not_a_product_page` compte comme une pose : `verify-install` ne rend ce
 * verdict qu'APRÈS avoir trouvé le script ET l'identifiant du compte dans la
 * page. Le script est donc bien là ; la page ouverte n'est simplement pas une
 * fiche produit. La règle vit dans `_shared/pose-verifiee.ts`, que
 * `verify-install` lit aussi pour écrire `install_verified` : l'écran
 * n'annonce plus une pose que le guide redemande (contre-revue du 27/09).
 */
export async function verifierPoseDuConseiller(opts: {
  supabase: ClientSupabase;
  accountId: string;
  adresse: string;
}): Promise<ResultatVerificationPose> {
  const { supabase, accountId, adresse } = opts;
  try {
    const { data, error } = await supabase.functions.invoke("verify-install", {
      body: { url: adresse, accountId },
    });
    const diagnostic = (data?.diagnosis as DiagnosticPose | undefined) ?? null;
    if (error || !diagnostic) {
      return { pose: false, diagnostic: "service_injoignable", adresse, enregistree: false, scripts: null };
    }
    return {
      pose: poseVue(diagnostic),
      diagnostic,
      adresse: typeof data?.url === "string" ? data.url : adresse,
      enregistree: data?.persisted !== false,
      scripts: Array.isArray(data?.scripts)
        ? (data.scripts as unknown[]).filter((s): s is string => typeof s === "string")
        : null,
    };
  } catch {
    return { pose: false, diagnostic: "service_injoignable", adresse, enregistree: false, scripts: null };
  }
}

/** Le fichier que seule l'extension WordPress pose sur une fiche produit. */
export const SCRIPT_EXTENSION_WOO = "woo-product-chat.js";

/**
 * Par où le conseiller a été posé sur une boutique WooCommerce, d'après les
 * fichiers que `verify-install` a lus : l'extension (qui a un menu Lystes AI
 * et un bouton « Synchroniser maintenant »), ou le code collé (qui n'a ni
 * l'un ni l'autre, et dont le catalogue passe par l'autorisation
 * WooCommerce). `null` quand le serveur ne l'a pas dit.
 */
export function methodeDePoseWoo(scripts: string[] | null | undefined): "extension" | "code" | null {
  if (!scripts || scripts.length === 0) return null;
  return scripts.includes(SCRIPT_EXTENSION_WOO) ? "extension" : "code";
}

/**
 * Le nombre de produits réels arrivés dans l'espace, fiches de démonstration
 * écartées. `null` quand la lecture est impossible (panne, pas de session) :
 * une lecture ratée n'est pas un catalogue vide.
 *
 * Audit du 27/09/2026, point 12 : le guide WooCommerce disait « Il est en
 * ligne » dès que le script était vu sur la boutique, sans regarder si le
 * catalogue était arrivé. Sans produits, le conseiller ne peut rien
 * recommander.
 */
export async function compterCatalogue(opts: { supabase: ClientSupabase; accountId: string }): Promise<number | null> {
  try {
    const { count, error } = await opts.supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("account_id", opts.accountId)
      .eq("is_demo", false);
    if (error || typeof count !== "number") return null;
    return count;
  } catch {
    return null;
  }
}

/**
 * La page « Réglages » de l'extension WordPress, là où se trouve le bouton
 * « Synchroniser maintenant » (`add_submenu_page('lystes', …, 'lystes-settings')`
 * dans generate-woo-plugin-v2). Chaîne vide sans adresse lisible.
 */
export function lienReglagesExtensionWoo(adresseBoutique: string): string {
  const hote = adresseBoutique
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/[/?#].*$/, "")
    .toLowerCase();
  if (!hote || !hote.includes(".")) return "";
  return `https://${hote}/wp-admin/admin.php?page=lystes-settings`;
}

/**
 * Une fiche produit réelle de la boutique, pour que la vérification regarde
 * là où le conseiller doit apparaître. Les fiches de démonstration sont
 * écartées : elles n'existent pas sur le site. Chaîne vide si rien ne va.
 */
export async function ficheProduitAVerifier(opts: {
  supabase: ClientSupabase;
  accountId: string;
  /** Domaine de la boutique, pour écarter un lien qui pointe ailleurs. */
  domaine?: string | null;
}): Promise<string> {
  const { supabase, accountId } = opts;
  const domaine = (opts.domaine || "").replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
  try {
    const { data } = await supabase
      .from("products")
      .select("purchase_link, woo_permalink, shopify_handle")
      .eq("account_id", accountId)
      .eq("is_demo", false)
      .eq("is_active", true)
      .limit(5);
    for (const ligne of (data ?? []) as Array<Record<string, string | null>>) {
      if (domaine && ligne.shopify_handle) return `https://${domaine}/products/${ligne.shopify_handle}`;
      for (const lien of [ligne.woo_permalink, ligne.purchase_link]) {
        if (!lien || !/^https?:\/\/[^/]+\/.+/.test(lien)) continue;
        const hote = lien.replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
        if (!domaine || hote === domaine || hote.endsWith(`.${domaine}`) || domaine.endsWith(`.${hote}`)) return lien;
      }
    }
  } catch {
    /* Pas de fiche lisible : la vérification ouvrira l'accueil. */
  }
  return "";
}

/* ═══════════════════════════════════════════════════════════════════════════
 * UN CONSEILLER QUE LE WIDGET RETROUVE PAR LE SEUL COMPTE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Relecture de la PR 177, le 26/09/2026. L'extension Shopify affiche son champ
 * sous le libellé « Identifiant de l'agent (facultatif) »
 * (`lystes-shopify-config/extensions/lystes-agent/locales/fr.json`). Une
 * marchande le laisse donc vide, et c'est son droit.
 *
 * Sans lui, le widget demande son agent à `get-widget-config?account_id=…`,
 * qui cherche dans cet ordre : l'agent `is_primary_widget`, puis l'agent du
 * type attendu par le secteur du compte, puis un spécialiste
 * (`supabase/functions/get-widget-config/index.ts`, l. 572-673). Un compte
 * créé par un guide n'a ni secteur ni spécialiste, et son conseiller de
 * boutique n'était pas principal : le service rendait la pastille sans
 * agent, et le widget finissait sur `showErrorUI(missing_agent_id)`. Pendant
 * ce temps, `verify-install` voyait le script et le compte, et le guide
 * déclarait la pose vérifiée.
 *
 * Le conseiller que le guide crée ou retrouve devient donc l'agent principal
 * du widget, SI le compte n'en a aucun. Il n'en prend jamais la place : un
 * compte qui a déjà choisi son agent principal le garde (et l'index unique
 * `idx_agents_single_primary_per_account` refuserait un second principal).
 *
 * ═══ UNE PANNE N'EST PAS UNE ABSENCE (relecture du 26/09, second passage) ═══
 *
 * `chercherAgentDuCompte` (EmbedCodeCard.tsx) rend null sur toute erreur :
 * réseau, 5xx, délai. `useCodeInstallation` traduit ce null en « aucun
 * agent ». Sur /dashboard/installation, que visitent des marchandes déjà en
 * ligne, une panne passagère faisait donc créer, puis PROMOUVOIR, le
 * conseiller de boutique d'un compte dont le widget passait par l'agent du
 * secteur (skin_diagnostic, etc.) : le widget changeait d'agent en silence,
 * sans aucun des contrôles de `src/lib/agents/primary-agent-guard.ts`.
 *
 * Désormais :
 *   - `chercherAgentDuWidget` distingue « trouvé », « aucun » et « erreur » ;
 *   - rien n'est créé ni promu sans une absence CONFIRMÉE par le service ;
 *   - `rendreConseillerTrouvable` redemande au service, juste avant d'écrire,
 *     s'il retrouve déjà un agent par le compte seul (principal actif, agent
 *     du type attendu par le secteur, spécialiste actif). Si oui, il n'écrit
 *     rien. C'est le service lui-même qui répond, pas une troisième copie de
 *     sa table des secteurs.
 */

/** Ce que le service du widget répond pour un compte, sans rien deviner. */
export type RechercheAgentDuWidget =
  | { statut: "trouve"; agentId: string }
  | { statut: "aucun" }
  | { statut: "erreur" };

/**
 * Demande à `get-widget-config?account_id=…` l'agent que le script du site
 * retiendrait, EXACTEMENT comme lui. « aucun » n'est rendu que sur la réponse
 * qui le dit : la configuration « barre de recherche » (`pill_search`), sans
 * `agent_id`. Toute autre réponse, et toute panne, rend « erreur ».
 */
export async function chercherAgentDuWidget(accountId: string): Promise<RechercheAgentDuWidget> {
  const compte = (accountId || "").trim();
  const base = String(LYSTES_ENV.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
  if (!compte || !base) return { statut: "erreur" };
  try {
    const reponse = await fetch(`${base}/functions/v1/get-widget-config?account_id=${encodeURIComponent(compte)}`);
    if (!reponse.ok) return { statut: "erreur" };
    const config = (await reponse.json()) as { agent_id?: unknown; widget_type?: unknown; fallback?: unknown } | null;
    if (typeof config?.agent_id === "string" && config.agent_id.length > 0) {
      // `fallback` : l'agent désigné n'a pas pu être relu. Ni présence sûre, ni absence.
      return config.fallback === true ? { statut: "erreur" } : { statut: "trouve", agentId: config.agent_id };
    }
    return config?.widget_type === "pill_search" ? { statut: "aucun" } : { statut: "erreur" };
  } catch {
    return { statut: "erreur" };
  }
}

/**
 * Où en est le conseiller, vu du widget, après `rendreConseillerTrouvable`.
 *   principal         : il est l'agent principal, le widget le trouve par le compte seul ;
 *   retrouve          : le widget le trouve déjà par le compte seul (agent du secteur) ;
 *   autre_agent       : le widget trouve un AUTRE agent par le compte : on n'y touche pas ;
 *   principal_inactif : un principal désactivé tient la place, personne n'est trouvé
 *                       par le compte seul, l'identifiant de l'agent est indispensable ;
 *   inactif           : le conseiller lui-même est désactivé, aucun widget ne le servira ;
 *   erreur            : une lecture ou l'écriture a échoué, rien n'a été changé.
 */
export type ConseillerTrouvable =
  | "principal"
  | "retrouve"
  | "autre_agent"
  | "principal_inactif"
  | "inactif"
  | "erreur";

export async function rendreConseillerTrouvable(opts: {
  supabase: ClientSupabase;
  accountId: string;
  agentId: string;
}): Promise<ConseillerTrouvable> {
  const { supabase, accountId, agentId } = opts;
  if (!accountId || !agentId) return "erreur";
  try {
    // 1. Le conseiller lui-même : un agent désactivé n'est servi par aucun widget.
    const { data: lignesConseiller, error: erreurConseiller } = await supabase
      .from("agents")
      .select("id, is_active")
      .eq("id", agentId)
      .eq("account_id", accountId)
      .limit(1);
    if (erreurConseiller) return "erreur";
    const conseiller = ((lignesConseiller ?? []) as Array<{ id: string; is_active?: boolean | null }>)[0];
    if (!conseiller) return "erreur";
    if (conseiller.is_active === false) return "inactif";

    // 2. Actifs ou non : l'index unique compte aussi un principal désactivé.
    const { data: principaux, error } = await supabase
      .from("agents")
      .select("id, is_active")
      .eq("account_id", accountId)
      .eq("is_primary_widget", true)
      .limit(2);
    if (error) return "erreur";
    const lignes = (principaux ?? []) as Array<{ id: string; is_active?: boolean | null }>;
    if (lignes.some((l) => l.id === agentId)) return "principal";
    // Un agent principal actif existe : c'est le choix de la marchande.
    if (lignes.some((l) => l.is_active !== false)) return "autre_agent";

    // 3. Le service retrouve-t-il déjà quelqu'un par le compte seul ?
    const recherche = await chercherAgentDuWidget(accountId);
    if (recherche.statut === "erreur") return "erreur";
    if (recherche.statut === "trouve") return recherche.agentId === agentId ? "retrouve" : "autre_agent";
    // Un principal désactivé occupe la place : la promotion serait refusée.
    if (lignes.length > 0) return "principal_inactif";

    // 4. Absence confirmée par le service : le conseiller devient principal.
    const { data, error: erreurMaj } = await supabase
      .from("agents")
      .update({ is_primary_widget: true })
      .eq("id", agentId)
      .eq("account_id", accountId)
      .eq("is_active", true)
      .select("id");
    return !erreurMaj && Array.isArray(data) && data.length > 0 ? "principal" : "erreur";
  } catch {
    return "erreur";
  }
}

/**
 * Ce qu'un écran d'installation obtient quand `useCodeInstallation` ne trouve
 * personne.
 *   pret           : un agent actif répondra, son identifiant va dans le code ;
 *   inactif        : le conseiller existe mais il est désactivé ;
 *   echec_creation : le conseiller n'a pas pu être créé ;
 *   erreur         : le service ou la base n'ont pas répondu, rien n'a été
 *                    créé ni promu. L'écran propose de réessayer.
 */
export type PreparationConseiller =
  | { etat: "pret"; agentId: string }
  | { etat: "inactif"; agentId: string }
  | { etat: "echec_creation" }
  | { etat: "erreur" };

/**
 * LE SEUL CHEMIN PAR LEQUEL UN ÉCRAN CRÉE OU PROMEUT LE CONSEILLER.
 *
 * Les trois écrans d'installation portaient chacun leur copie de cette
 * suite, et chacun ignorait le retour de la promotion : un conseiller
 * désactivé était annoncé « prêt », avec un identifiant qu'aucun widget ne
 * servirait. `assurer` est passé en paramètre (c'est
 * `assurerConseillerBoutique`) pour que ce fichier reste sans client Supabase.
 */
export async function preparerConseillerDuWidget(opts: {
  supabase: ClientSupabase;
  accountId: string;
  assurer: (accountId: string) => Promise<{ id: string } | null>;
}): Promise<PreparationConseiller> {
  const { supabase, accountId, assurer } = opts;
  if (!accountId) return { etat: "erreur" };
  // Une panne n'autorise ni création ni promotion.
  const recherche = await chercherAgentDuWidget(accountId);
  if (recherche.statut === "erreur") return { etat: "erreur" };
  if (recherche.statut === "trouve") return { etat: "pret", agentId: recherche.agentId };

  let conseiller: { id: string } | null = null;
  try {
    conseiller = await assurer(accountId);
  } catch {
    conseiller = null;
  }
  if (!conseiller?.id) return { etat: "echec_creation" };

  const trouvable = await rendreConseillerTrouvable({ supabase, accountId, agentId: conseiller.id });
  if (trouvable === "inactif") return { etat: "inactif", agentId: conseiller.id };
  if (trouvable === "erreur") return { etat: "erreur" };
  return { etat: "pret", agentId: conseiller.id };
}

/* ═══════════════════════════════════════════════════════════════════════════
 * LE CHEMIN D'INSTALLATION SHOPIFY QU'UN ÉCRAN PROPOSE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Relecture de la PR 177, second passage. Tant que l'examen n'est pas passé,
 * `src/config/shopify-examen.ts` établit que, sur une boutique de
 * production, Shopify grise le bouton Installer et que la marchande ne revient
 * pas. Les écrans proposaient pourtant d'abord « Installer l'application » et
 * « Activer l'agent dans mon thème », deux gestes qui supposent l'application.
 *
 *   extension : l'examen est passé, OU l'application est déjà reliée à la
 *               boutique (connexion `oauth`). L'interrupteur du thème existe.
 *   code      : sinon. Le code à coller dans `theme.liquid` est LE chemin de
 *               l'étape, pas un repli caché derrière un lien.
 *
 * Le drapeau est passé en paramètre : importer `shopify-examen.ts` ici
 * lancerait sa redirection au chargement du module.
 */
export type CheminInstallationShopify = "extension" | "code";

export function cheminInstallationShopify(opts: {
  examenPasse: boolean;
  applicationReliee: boolean;
}): CheminInstallationShopify {
  return opts.examenPasse || opts.applicationReliee ? "extension" : "code";
}

/* ═══════════════════════════════════════════════════════════════════════════
 * LA FORMULE QUI FAIT RÉPONDRE LE CONSEILLER
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Relecture de la PR 177, le 26/09/2026 (blocage 5 de l'audit). Une
 * marchande inscrite par `/auth?next=/install/…` a un compte sans formule.
 * Le chat refuse alors de répondre (`guardPlan`, droit
 * `agents.conseillers_produits`, dans `shopify-product-chat`), et le widget
 * dit à ses clientes que le conseiller n'est pas inclus dans l'offre. Les
 * guides lui annonçaient pourtant un conseiller « en ligne ».
 *
 * La règle est celle du serveur, relue à la même source : la RPC
 * `get_entitlements` et le même droit (`_shared/requirePlan.ts`, qui ne
 * regarde que la présence de la ligne). « inconnue » quand la lecture
 * échoue : le serveur laisse passer dans ce cas, l'écran ne réclame donc
 * rien de plus.
 */
export const DROIT_DU_CONSEILLER = "agents.conseillers_produits";

export type FormuleDuConseiller = "incluse" | "absente" | "inconnue";

export async function lireFormuleDuConseiller(opts: {
  supabase: ClientSupabase;
  accountId: string;
}): Promise<FormuleDuConseiller> {
  const { supabase, accountId } = opts;
  if (!accountId) return "inconnue";
  try {
    const { data, error } = await supabase.rpc("get_entitlements", { _account_id: accountId });
    if (error || !Array.isArray(data)) return "inconnue";
    return (data as Array<{ feature_slug?: string }>).some((l) => l?.feature_slug === DROIT_DU_CONSEILLER)
      ? "incluse"
      : "absente";
  } catch {
    return "inconnue";
  }
}

/**
 * Coche « site connecté » dans le parcours, pour que le tableau de bord ne
 * redemande pas l'installation. À n'appeler QU'APRÈS une pose vérifiée :
 * cocher sur simple déclaration affichait « connecté » à des marchandes dont
 * aucune cliente ne voyait le conseiller.
 */
export async function marquerSiteConnecte(opts: {
  supabase: ClientSupabase;
  accountId: string;
}): Promise<boolean> {
  const { supabase, accountId } = opts;
  try {
    const { data, error } = await supabase
      .from("onboarding_progress")
      .upsert(
        { account_id: accountId, site_connected: true, updated_at: new Date().toISOString() },
        { onConflict: "account_id" },
      )
      .select("id");
    return !error && Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}
