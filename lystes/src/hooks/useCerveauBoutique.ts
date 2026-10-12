import { useEffect, useState } from "react";
import { supabase } from "@lystes/integrations/supabase/client";
import { FILTRE_AVIS_DEFINITIFS } from "@lystes/lib/reviews/authenticity";
import { metierDeFicheDuSecteur } from "@lystes/config/sector-config";
import { resolveSectorKey } from "@lystes/config/sector-resolver";

/* Les trois métiers d'agent que TOUTE fiche produit a, quel que soit le
   secteur : quelqu'un qui conseille, quelqu'un qui référence la page, quelqu'un
   qui anime les avis. L'essayeur ou le diagnostiqueur s'ajoute selon ce que la
   boutique vend, et `apres_achat` n'y figure pas : la contrainte CHECK
   l'autorise, mais aucun code n'écrit jamais cette valeur — le coach à domicile
   vit dans `post_purchase_coaches`, provisionnée par `generate-coach-role`.
   L'afficher produisait un « Coachs à domicile : 0 » faux, juste à côté de la
   famille qui, elle, donne le vrai chiffre. */
const METIERS_UNIVERSELS_FICHE = ["conseil", "seo", "avis"];

/**
 * Ce que le cerveau d'UNE boutique contient réellement.
 *
 * Tout est compté en base, jamais estimé : `count: "exact"` avec
 * `head: true`, qui ne rapatrie aucune ligne. La leçon du 01/08 vaut ici
 * aussi — un total plafonné par une limite de lecture n'est pas un total.
 *
 * Les sujets de conversation portent déjà leur récurrence en base
 * (`mention_count`) et la liste des produits qui les ont fait naître
 * (`product_ids`) : c'est ce qui permet de dessiner un sujet d'autant plus
 * gros qu'il revient, relié aux produits concernés.
 */

export type FicheProduit = {
  id: string;
  nom: string;
  categorie: string | null;
  experts: string[];
};

export type SujetAborde = {
  id: string;
  sujet: string;
  categorie: string | null;
  mentions: number;
  produits: string[];
};

/** L'état d'une connexion boutique : la seule chose qui explique un zéro. */
export type EtatConnexion = {
  plateforme: string;
  boutique: string | null;
  statut: string | null;
  derniereSync: string | null;
  produitsSynchronises: number | null;
  erreur: string | null;
  dernierRunStatut?: string | null;
  commandesSynchronisees?: number | null;
};

export type CerveauBoutique = {
  chargement: boolean;
  erreur: string | null;
  /** Comptages exacts, par famille de connaissance. */
  comptes: Record<string, number>;
  produits: FicheProduit[];
  sujets: SujetAborde[];
  /** Champs de `brand_knowledge` réellement remplis, sur ceux qui existent. */
  marqueRemplis: number;
  marqueTotal: number;
  /** Le détail : quelle information sur l'entreprise est connue, et laquelle
   *  manque. Un compteur ne dit pas à la gérante CE QU'ELLE doit compléter. */
  savoirEntreprise: { cle: string; rempli: boolean }[];
  /** Sources qui n'ont pas répondu. Un zéro muet vaut mieux dit qu'ignoré. */
  sourcesMuettes: string[];
  /** Avis dont la provenance n'est pas traçable (product_reviews sans `source`). */
  avisNonTraces: number;
  /** Shopify, WooCommerce : connectés ? synchronisés ? en erreur ? */
  connexions: EtatConnexion[];
  /** Le détail agrégé des familles qui n'avaient qu'un compteur : avis par
   *  note, commandes par mois, essayages par produit, clientes par pays,
   *  retours par motif. Rendu par `cerveau_boutique_detail`, qui ne renvoie
   *  QUE des libellés de tranche et des comptes — aucun nom, aucun e-mail,
   *  aucune adresse. */
  detail: Record<string, { libelle: string; n: number }[]>;
  /** Un compte par métier autorisé, ZÉRO COMPRIS. Un métier permis par la
   *  base mais jamais provisionné doit se voir : c'est une absence, pas un
   *  vide. */
  metiers: { cle: string; n: number }[];
};

const CHAMPS_MARQUE = [
  "brand_description", "brand_values", "target_audience", "products_info",
  "ingredients_policy", "shipping_info", "returns_policy", "promotions_info",
  "support_info", "additional_info",
] as const;

/**
 * Compte exact, sans rapatrier de lignes.
 *
 * Une source qui refuse est ENREGISTRÉE, jamais transformée en zéro
 * silencieux : un zéro se lit « il n'y a rien », alors qu'il peut vouloir dire
 * « je n'ai pas pu regarder ». La différence change tout pour une gérante qui
 * croit son cerveau vide.
 */
async function compte(
  table: string,
  filtre: (q: any) => any,
  muettes: string[],
): Promise<number> {
  try {
    const { count, error } = await filtre(
      supabase.from(table as any).select("*", { count: "exact", head: true }),
    );
    if (error) { muettes.push(`${table} : ${error.message}`); return 0; }
    return count ?? 0;
  } catch (e: any) {
    muettes.push(`${table} : ${e?.message ?? "injoignable"}`);
    return 0;
  }
}

/**
 * Le détail nommé : les fiches, leurs agents, les sujets qui reviennent.
 *
 * Les comptes disent COMBIEN, ces trois lectures disent QUOI. Elles restent
 * côté client dans les deux voies, rapide comme lente : ce sont des listes
 * courtes, et les afficher demande leurs noms, pas leur nombre.
 */
async function echantillons(
  accountId: string,
): Promise<[FicheProduit[], any[], SujetAborde[]]> {
  const { data: prods } = await supabase
    .from("products").select("id, name, category")
    .eq("account_id", accountId).limit(80);

  const idsProduits = (prods ?? []).map((p: any) => p.id);

  // `metier` a été ajoutée le 12/08 ; on la lit sans la rendre obligatoire,
  // pour que la page tienne si la migration manque sur un environnement.
  let experts: any[] = [];
  if (idsProduits.length) {
    const r1 = await supabase.from("product_experts")
      .select("product_id, expert_name, metier")
      .in("product_id", idsProduits).limit(500);
    if (r1.error) {
      const r2 = await supabase.from("product_experts")
        .select("product_id, expert_name")
        .in("product_id", idsProduits).limit(500);
      experts = r2.data ?? [];
    } else {
      experts = r1.data ?? [];
    }
  }

  const { data: sujets } = await supabase
    .from("conversation_topics")
    .select("id, topic, topic_category, mention_count, product_ids")
    .eq("account_id", accountId)
    .order("mention_count", { ascending: false })
    .limit(60);

  const parProduit = new Map<string, string[]>();
  experts.forEach((e: any) => {
    const liste = parProduit.get(e.product_id) ?? [];
    liste.push(e.metier || e.expert_name || "expert");
    parProduit.set(e.product_id, liste);
  });

  return [
    (prods ?? []).map((p: any) => ({
      id: p.id, nom: p.name, categorie: p.category,
      experts: parProduit.get(p.id) ?? [],
    })),
    experts,
    (sujets ?? []).map((s: any) => ({
      id: s.id, sujet: s.topic, categorie: s.topic_category,
      mentions: s.mention_count ?? 1,
      produits: Array.isArray(s.product_ids) ? s.product_ids : [],
    })),
  ];
}

const ETAT_VIDE: CerveauBoutique = {
  chargement: true, erreur: null, comptes: {}, produits: [], sujets: [],
  marqueRemplis: 0, marqueTotal: CHAMPS_MARQUE.length,
  sourcesMuettes: [], avisNonTraces: 0, connexions: [], savoirEntreprise: [],
  metiers: [], detail: {},
};

/* 02/09/2026 — JP : « le cerveau doit être généré en arrière-plan pour que
   quand je clique dessus il soit déjà généré ».
   La lecture coûte une quarantaine de requêtes : on la fait UNE fois, on
   garde le résultat en mémoire (10 minutes) et on la déclenche dès que le
   tableau de bord connaît le compte, avant tout clic. Le modal lit alors le
   cache et s'ouvre déjà peuplé ; il rafraîchit en silence derrière. */
const CACHE_CERVEAU = new Map<string, { horodatage: number; etat: CerveauBoutique }>();
const EN_COURS = new Map<string, Promise<CerveauBoutique>>();
const DUREE_CACHE_MS = 10 * 60 * 1000;

/** Lance (ou réutilise) la lecture du cerveau sans afficher quoi que ce soit. */
export function prechargerCerveau(accountId: string | null | undefined): void {
  if (!accountId) return;
  const enCache = CACHE_CERVEAU.get(accountId);
  if (enCache && Date.now() - enCache.horodatage < DUREE_CACHE_MS) return;
  void chargerCerveauBoutique(accountId).catch(() => {});
}

/** Le cerveau déjà lu, s'il est encore frais. */
export function cerveauEnCache(accountId: string | null | undefined): CerveauBoutique | null {
  if (!accountId) return null;
  const enCache = CACHE_CERVEAU.get(accountId);
  if (!enCache || Date.now() - enCache.horodatage >= DUREE_CACHE_MS) return null;
  return enCache.etat;
}

export function chargerCerveauBoutique(accountId: string): Promise<CerveauBoutique> {
  const dejaLance = EN_COURS.get(accountId);
  if (dejaLance) return dejaLance;

  const promesse = (async (): Promise<CerveauBoutique> => {


      /* ————— La voie rapide est REVENUE le 21/08 —————
       *
       * JP, capture à l'appui : « il ne récupère pas les données, il y a des
       * clients, des ventes, des échanges, plein d'avis, plein d'essayages, et
       * ce que je vois en ligne c'est VIDE ».
       *
       * Il avait raison, et la lecture directe ci-dessous en était la cause.
       * Elle interroge les bonnes tables, mais depuis le navigateur, donc sous
       * les politiques de sécurité ligne à ligne. Or elles ne se ressemblent
       * pas d'une table à l'autre :
       *
       *   products, reviews, wig_tryon_sessions  →  account_id = get_user_account_id(auth.uid())
       *   ecommerce_orders, ecommerce_customers  →  account_id IN (les adhésions de l'utilisateur)
       *
       * Un compte qui ne tombe juste sur aucune des deux lit ZÉRO. Pire, le
       * refus n'est pas une erreur : c'est un compte à zéro, indiscernable
       * d'une boutique vide. Mesuré sur Dream Virgin Hair : la carte annonçait
       * 0 commande, 0 avis, 0 cliente, 0 essayage, quand la base en porte
       * 5 011, 2 227, 1 061 et 2 028.
       *
       * `cerveau_boutique` est SECURITY DEFINER : elle compte côté serveur,
       * hors de portée de ces politiques, et garde son propre contrôle d'accès
       * (`cerveau_acces_autorise`). Elle rend les mêmes comptes en un appel au
       * lieu de quarante-deux.
       *
       * CE QUI L'AVAIT FAIT RETIRER LE 17/08, et qu'on ne refait pas : ses noms
       * de champs avaient été DEVINÉS depuis le navigateur. Un seul nom qui ne
       * tombe pas juste et tous les comptes valent zéro, donc plus de familles,
       * plus de pavage, et l'écran annonce « votre cerveau est vide » à une
       * boutique qui a cinq cents produits. Les noms ci-dessous ont été LUS en
       * base avec pg_get_functiondef. Quatre ne suivent pas la casse du front,
       * et c'est exactement là que ça s'était joué :
       *
       *   avis_reels → avisReels · avis_total → avisTotal
       *   rendez_vous → rendezVous · portraits → avatars
       *
       * La lecture directe reste dessous : si la fonction refuse ou n'existe
       * pas sur un environnement, l'écran continue de s'afficher avec ce que
       * le navigateur peut lire. Une optimisation qui vide l'écran n'est pas
       * une optimisation. */
      let comptesServeur: Record<string, number> | null = null;
      /* `muettes` n'est déclaré que plus bas, avec les lectures directes :
         on collecte ici et on fusionne au moment voulu. */
      const muettesServeur: string[] = [];
      try {
        const { data: srv, error: errSrv } = await (supabase as any).rpc(
          "cerveau_boutique",
          { p_account_id: accountId },
        );
        if (errSrv) {
          muettesServeur.push(`cerveau_boutique : ${errSrv.message}`);
        } else if (srv?.comptes) {
          const c = srv.comptes as Record<string, number>;
          const n = (v: unknown) => (typeof v === "number" ? v : 0);
          comptesServeur = {
            produits: n(c.produits), agents: n(c.agents), experts: n(c.experts),
            avisReels: n(c.avis_reels), avisTotal: n(c.avis_total),
            essayages: n(c.essayages), diagnostics: n(c.diagnostics),
            commandes: n(c.commandes), clientes: n(c.clientes),
            avatars: n(c.portraits), sujets: n(c.sujets), paniers: n(c.paniers),
            coachs: n(c.coachs), visites: n(c.visites), contacts: n(c.contacts),
            conversations: n(c.conversations), appris: n(c.appris),
            activite: n(c.activite), rendezVous: n(c.rendez_vous),
            retours: n(c.retours), contenu: n(c.contenu),
          };
        }
      } catch (e: any) {
        muettesServeur.push(`cerveau_boutique : ${e?.message ?? "injoignable"}`);
      }

      /* Le DÉTAIL des familles qui n'avaient qu'un compteur. Ventes, Clients,
         Réputation et Essais montraient trois points sur la carte alors
         qu'elles portent des milliers de lignes : le compteur était juste, mais
         le dessin ne disait rien. Cette seconde fonction rend des tranches —
         avis par note, commandes par mois, essayages par produit, clientes par
         pays — et rien d'autre : aucun nom, aucun e-mail, aucune adresse. */
      let detailServeur: Record<string, { libelle: string; n: number }[]> = {};
      try {
        const { data: det, error: errDet } = await (supabase as any).rpc(
          "cerveau_boutique_detail",
          { p_account_id: accountId },
        );
        if (errDet) {
          muettesServeur.push(`cerveau_boutique_detail : ${errDet.message}`);
        } else if (det) {
          for (const cle of ["avis_par_note", "commandes_par_mois",
                             "essayages_par_produit", "clientes_par_pays",
                             "retours_par_motif"]) {
            const v = det[cle];
            if (Array.isArray(v)) detailServeur[cle] = v;
          }
        }
      } catch (e: any) {
        muettesServeur.push(`cerveau_boutique_detail : ${e?.message ?? "injoignable"}`);
      }

      /* ————— Ce qui suit était la seule voie depuis le 17/08 —————

         `cerveau_boutique`, posée en base le 12/08, rend les mêmes comptes en
         un appel au lieu de quarante-deux. Elle avait été branchée ici le 14.

         Elle a cassé l'écran en production, et JP l'a vu avant moi : les noms
         de champs de sa réponse avaient été DEVINÉS depuis le navigateur, la
         fonction étant écrite en base. Un seul nom qui ne tombe pas juste et
         tous les comptes valent zéro. Aucune famille n'est alors créée, donc
         plus de groupes, plus de couleurs, plus de pavage : le graphe retombe
         en étoile autour du centre, et l'écran annonce « votre cerveau est
         vide » à une boutique qui a cinq cents produits.

         La lecture directe ci-dessous est plus lente et elle FONCTIONNE. La
         voie rapide reviendra quand la forme exacte de la réponse aura été
         lue en base, pas devinée. Une optimisation qui vide l'écran n'est pas
         une optimisation.

      Ce qui reste de l'épisode, et qui vaut d'être gardé : les sources qui
      ne répondent pas sont enregistrées, jamais transformées en zéro muet. */

      /* Résolution du secteur : elle détermine les métiers attendus et les
         sources à ne pas traiter comme muettes si elles ne concernent pas la
         boutique. Sans cette lecture, le cerveau affiche « Diagnostic : 0 » à une
         perruquerie qui n'a jamais promis de diagnostic, ou inversement masque
         l'essayage qu'elle vend pourtant. */
      const { data: compteRow } = await supabase
        .from("accounts")
        .select("sector")
        .eq("id", accountId)
        .maybeSingle();
      const secteur = resolveSectorKey(compteRow?.sector ?? "other") ?? "other";
      const secteurMuet: string[] = secteur === "other" && compteRow?.sector
        ? [`secteur ${compteRow.sector} non reconnu`]
        : [];

      const metierFiche = metierDeFicheDuSecteur(secteur);
      const metiersAttendus = metierFiche
        ? [...METIERS_UNIVERSELS_FICHE, metierFiche]
        : METIERS_UNIVERSELS_FICHE;

      const muettes: string[] = [
        // Le refus de la fonction serveur se dit ici : sans lui, un compte
        // interdit ressemble à une boutique vide.
        ...muettesServeur,
        // Le secteur illisible se dit ici : sans lui, l'essayeur ou le
        // diagnostiqueur disparaît de l'écran sans que rien ne l'explique.
        ...secteurMuet,
      ];
      const parCompte = (q: any) => q.eq("account_id", accountId);

      // `analyses` n'a pas de colonne de compte : on passe par les agents.
      const { data: agents } = await supabase
        .from("agents").select("id").eq("account_id", accountId).limit(500);
      const idsAgents = (agents ?? []).map((a: any) => a.id);
      const parAgent = (q: any) => q.in("agent_id", idsAgents);

      /* Une même notion vit dans PLUSIEURS tables, et n'en interroger qu'une
         revient à annoncer zéro à une boutique qui en a des centaines. Trois
         manques relevés le 12/08, tous corrigés ici :

         - les essayages de perruque vivent dans `wig_tryon_sessions`, jamais
           dans `tryon_sessions`. Une marque de perruques lisait donc
           « Essayages 2 » alors que c'est son métier ;
         - les commandes existent dans deux tables selon la voie d'entrée ;
         - les diagnostics sont éclatés en quatre tables selon le secteur. */

      const [
        nbProduits, nbAgents, nbExperts,
        nbAvisReels, nbAvisTotal, nbAvisProduits,
        nbEssayagesStd, nbEssayagesPerruque,
        nbCommandesBoutique, nbCommandesClientes,
        nbClientes, nbAvatars, nbSujets, nbPaniers, nbCoachs, nbVisites,
        nbAnalyses, nbNutrition, nbMorpho, nbAvantApres,
        nbScans, nbInsights, nbInsightsProduit, nbLeads,
        nbChatbot, nbVoix, nbGpt, nbChatShopify, nbChatWoo, nbChatCoach,
        nbApprisExperts, nbConsignes, nbDocuments, nbSources, nbQna, nbContexte,
        nbVisiteurs, nbVues, nbRdv, nbRetours, nbUgc, nbUgcPublies,
      ] = await Promise.all([
        compte("products", parCompte, muettes),
        compte("agents", parCompte, muettes),
        compte("product_experts", parCompte, muettes),
        compte("reviews", (q) => parCompte(q).or(FILTRE_AVIS_DEFINITIFS), muettes),
        compte("reviews", parCompte, muettes),
        // `product_reviews` n'a pas de colonne `source` : impossible d'y
        // distinguer un avis réel d'un avis de démonstration. On le compte à
        // part et on le signale, plutôt que de le déclarer authentique.
        compte("product_reviews", parCompte, muettes),
        compte("tryon_sessions", parCompte, muettes),
        compte("wig_tryon_sessions", parCompte, muettes),
        compte("ecommerce_orders", parCompte, muettes),
        compte("customer_orders", parCompte, muettes),
        compte("ecommerce_customers", parCompte, muettes),
        compte("customer_avatars", parCompte, muettes),
        compte("conversation_topics", parCompte, muettes),
        compte("abandoned_carts", parCompte, muettes),
        compte("post_purchase_coaches", parCompte, muettes),
        compte("site_visits", parCompte, muettes),
        idsAgents.length ? compte("analyses", parAgent, muettes) : Promise.resolve(0),
        compte("nutrition_diagnostics", parCompte, muettes),
        compte("morpho_reports", parCompte, muettes),
        compte("before_after", parCompte, muettes),
        idsAgents.length ? compte("scans", parAgent, muettes) : Promise.resolve(0),
        compte("conversation_insights", parCompte, muettes),
        compte("product_conversation_insights", parCompte, muettes),
        compte("leads", parCompte, muettes),
        // — Les conversations, éclatées par canal —
        compte("chatbot_conversations", parCompte, muettes),
        compte("voice_conversations", parCompte, muettes),
        compte("my_gpt_conversations", parCompte, muettes),
        compte("shopify_product_chats", parCompte, muettes),
        compte("woocommerce_product_chats", parCompte, muettes),
        compte("post_purchase_coach_chats", parCompte, muettes),
        // — Ce que les agents ont appris, et ce qu'on leur a donné à lire —
        compte("product_expert_learnings", parCompte, muettes),
        compte("agent_learning_instructions", parCompte, muettes),
        compte("agent_documents", parCompte, muettes),
        compte("knowledge_sources", parCompte, muettes),
        compte("qna_pairs", parCompte, muettes),
        compte("business_context", parCompte, muettes),
        // — L'activité du site, les rendez-vous, les retours, le contenu —
        compte("visitors", parCompte, muettes),
        compte("product_views", parCompte, muettes),
        compte("bookings", parCompte, muettes),
        compte("returns", parCompte, muettes),
        compte("ugc_creations", parCompte, muettes),
        compte("ugc_public_posts", parCompte, muettes),
      ]);

      /* Les avis de `product_reviews` SONT comptés, sur décision de JP du
         12/08 : il y a de vrais avis clients dedans et une boutique ne doit
         pas les perdre. Ils n'ont pas de colonne `source`, donc on ne peut
         pas y écarter d'éventuelles lignes de démonstration : c'est dit sous
         le graphe, jamais tu. Cette page ne publie rien, elle montre à la
         gérante ce qu'elle possède — la page publique, elle, continue de
         filtrer par FILTRE_AVIS_DEFINITIFS. */
      const nbAvis = nbAvisReels + nbAvisProduits;

      const nbEssayages = nbEssayagesStd + nbEssayagesPerruque;
      const nbCommandes = nbCommandesBoutique + nbCommandesClientes;
      const nbDiagnostics = nbAnalyses + nbNutrition + nbMorpho + nbAvantApres + nbScans;
      const nbSujetsTotal = nbSujets + nbInsights + nbInsightsProduit;
      const nbConversations =
        nbChatbot + nbVoix + nbGpt + nbChatShopify + nbChatWoo + nbChatCoach;
      const nbAppris = nbApprisExperts + nbConsignes + nbDocuments + nbSources + nbQna;
      const nbActivite = nbVisiteurs + nbVues;
      const nbContenu = nbUgc + nbUgcPublies;

      const { data: prods } = await supabase
        .from("products").select("id, name, category")
        .eq("account_id", accountId).limit(80);

      const idsProduits = (prods ?? []).map((p: any) => p.id);

      // `metier` a été ajoutée le 12/08 ; on la lit sans la rendre obligatoire,
      // pour que la page continue de fonctionner si la migration manque.
      let experts: any[] = [];
      if (idsProduits.length) {
        const r1 = await supabase.from("product_experts")
          .select("product_id, expert_name, metier")
          .in("product_id", idsProduits).limit(500);
        if (r1.error) {
          const r2 = await supabase.from("product_experts")
            .select("product_id, expert_name")
            .in("product_id", idsProduits).limit(500);
          experts = r2.data ?? [];
        } else {
          experts = r1.data ?? [];
        }
      }

      const { data: sujets } = await supabase
        .from("conversation_topics")
        .select("id, topic, topic_category, mention_count, product_ids")
        .eq("account_id", accountId)
        .order("mention_count", { ascending: false })
        .limit(60);

      /* Les six métiers que la base autorise, depuis la contrainte CHECK de
         `product_experts` (élargie le 12/08 à seo et avis). On les compte TOUS,
         y compris ceux à zéro : un métier permis mais jamais provisionné est
         une absence à montrer, pas une donnée à taire. C'est le cas de `seo`
         et `avis` — la migration ouvre la valeur, aucune ligne ne la porte. */
      const metiers = await Promise.all(
        metiersAttendus.map(async (cle) => ({
          cle,
          n: await compte("product_experts", (q) => parCompte(q).eq("metier", cle), muettes),
        })),
      );

      const { data: marque } = await supabase
        .from("brand_knowledge").select("*").eq("account_id", accountId).maybeSingle();

      /* Pourquoi une boutique voit-elle zéro commande ? Trois réponses très
         différentes : elle n'a pas vendu, elle n'est pas connectée, ou sa
         synchronisation échoue. Sans cette lecture, les trois s'affichent
         « 0 » et la gérante conclut la première, qui est souvent fausse. */
      const connexions: EtatConnexion[] = [];

      const lireConnexion = async (
        table: "shopify_connections" | "woocommerce_connections",
        plateforme: string,
        champUrl: string,
      ) => {
        const { data, error } = await supabase
          .from(table as any)
          .select(`${champUrl}, status, last_sync_at, products_count`)
          .eq("account_id", accountId)
          .limit(3);
        if (error) { muettes.push(`${table} : ${error.message}`); return; }
        (data ?? []).forEach((c: any) => {
          connexions.push({
            plateforme,
            boutique: c[champUrl] ?? null,
            statut: c.status ?? null,
            derniereSync: c.last_sync_at ?? null,
            produitsSynchronises: c.products_count ?? null,
            erreur: null,
          });
        });
      };

      await Promise.all([
        lireConnexion("shopify_connections", "Shopify", "shop_domain"),
        lireConnexion("woocommerce_connections", "WooCommerce", "store_url"),
      ]);

      // La dernière synchronisation e-commerce, avec son erreur s'il y en a
      // une : c'est elle qui explique un compte de commandes resté à zéro.
      const { data: dernierRun } = await supabase
        .from("ecommerce_sync_runs")
        .select("source_type, status, completed_at, orders_synced, customers_synced, error_message")
        .eq("account_id", accountId)
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (dernierRun) {
        const c = connexions.find(
          (x) => x.plateforme.toLowerCase() === String(dernierRun.source_type ?? "").toLowerCase(),
        );
        const cible = c ?? connexions[0];
        if (cible) {
          cible.erreur = dernierRun.error_message ?? null;
          cible.dernierRunStatut = dernierRun.status ?? null;
          cible.commandesSynchronisees = dernierRun.orders_synced ?? null;
        }
      }

      const parProduit = new Map<string, string[]>();
      experts.forEach((e: any) => {
        const liste = parProduit.get(e.product_id) ?? [];
        liste.push(e.metier || e.expert_name || "expert");
        parProduit.set(e.product_id, liste);
      });

      const estRempli = (c: string) => {
        if (!marque) return false;
        const v = (marque as any)[c];
        return typeof v === "string" ? v.trim().length > 0 : v != null;
      };
      const savoirEntreprise = CHAMPS_MARQUE.map((c) => ({ cle: c, rempli: estRempli(c) }));
      const remplis = savoirEntreprise.filter((x) => x.rempli).length;

      return {
        chargement: false,
        erreur: null,
        comptes: {
          ...{
            produits: nbProduits, agents: nbAgents, experts: nbExperts,
            avisReels: nbAvis, avisTotal: nbAvisTotal + nbAvisProduits,
            essayages: nbEssayages, diagnostics: nbDiagnostics,
            commandes: nbCommandes, clientes: nbClientes, avatars: nbAvatars,
            sujets: nbSujetsTotal, paniers: nbPaniers, coachs: nbCoachs,
            visites: nbVisites, contacts: nbLeads,
            conversations: nbConversations, appris: nbAppris,
            activite: nbActivite, rendezVous: nbRdv, retours: nbRetours,
            contenu: nbContenu, contexte: nbContexte,
          },
          /* Les comptes de la fonction en base écrasent ceux lus depuis le
             navigateur quand elle a répondu. Voir `comptesServeur` plus haut :
             la lecture directe est bornée par les droits ligne à ligne et rend
             ZÉRO là où la boutique a des milliers de lignes. */
          ...(comptesServeur ?? {}),
        },
        produits: (prods ?? []).map((p: any) => ({
          id: p.id, nom: p.name, categorie: p.category,
          experts: parProduit.get(p.id) ?? [],
        })),
        sujets: (sujets ?? []).map((s: any) => ({
          id: s.id, sujet: s.topic, categorie: s.topic_category,
          mentions: s.mention_count ?? 1,
          produits: Array.isArray(s.product_ids) ? s.product_ids : [],
        })),
        marqueRemplis: remplis,
        marqueTotal: CHAMPS_MARQUE.length,
        sourcesMuettes: muettes,
        avisNonTraces: nbAvisProduits,
        connexions,
        savoirEntreprise,
        metiers,
        detail: detailServeur,
      };
  })();

  EN_COURS.set(accountId, promesse);
  return promesse
    .then((etat) => {
      CACHE_CERVEAU.set(accountId, { horodatage: Date.now(), etat });
      EN_COURS.delete(accountId);
      return etat;
    })
    .catch((err) => {
      EN_COURS.delete(accountId);
      throw err;
    });
}

export function useCerveauBoutique(accountId: string | null): CerveauBoutique {
  const [etat, setEtat] = useState<CerveauBoutique>(
    () => cerveauEnCache(accountId) ?? ETAT_VIDE,
  );

  useEffect(() => {
    if (!accountId) {
      /* 25/08/2026. Couper le chargement sans avoir rien demande faisait
         dessiner une constellation de zeros pendant que le compte se
         resolvait : « votre boutique ne sait rien », alors qu'on n'avait pas
         regarde. On reste en lecture tant qu'il n'y a pas de compte. */
      return;
    }
    let vivant = true;

    // Déjà lu et encore frais : on affiche tout de suite, sans écran d'attente.
    const cache = cerveauEnCache(accountId);
    if (cache) setEtat(cache);
    else setEtat((e) => ({ ...e, chargement: true, erreur: null }));

    chargerCerveauBoutique(accountId)
      .then((resultat) => { if (vivant) setEtat(resultat); })
      .catch((err) => {
        if (vivant && !cache) {
          setEtat((e) => ({ ...e, chargement: false, erreur: String(err?.message ?? err) }));
        }
      });

    return () => { vivant = false; };
  }, [accountId]);

  return etat;
}

