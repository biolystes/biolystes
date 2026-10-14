/**
 * Workspace Packs — refonte de l'offre en 3 produits orientés usage.
 *
 * Chaque pack contient TOUT ce qu'il faut pour utiliser réellement le cas d'usage.
 * Remplace progressivement le gating par tier (voir `src/config/tier-access.ts`).
 *
 * Phase 1 : source de vérité front (mapping menuId → packs), persistance localStorage.
 * Phase 2/DB : `accounts.subscribed_packs` + `last_active_pack`.
 */

/* 10/09/2026 (JP) : les six métiers de fiche produit prennent chacun leur
   espace, comme les quatre créatifs. Chacun porte son annuaire, son guide
   d'utilisation, son suivi d'activité et sa page de travail. */
export type PackId = "agents" | "savoir" | "manager" | "creative" | "marketing" | "booking" | "formulaires" | "review" | "optimarketing" | "social" | "influenceurs" | "crea" | "ugc" | "spy" | "conversion" | "boutiques" | "compta" | "agences" | "magazines" | "createurs_ugc" | "community_managers_ia" | "agences_marketing_ia" | "agences_seo_geo_ia" | "photographes_ia" | "graphistes_ia" | "experts_produit" | "diagnostiqueurs" | "essayeurs" | "experts_avis" | "managers_ugc" | "experts_seo" | "coachs_domicile" | "experts_geo" | "magazine_marque";

export const PACK_ORDER: PackId[] = ["boutiques", "agents", "savoir", "manager", "conversion", "marketing", "booking", "formulaires", "review", "optimarketing", "social", "influenceurs", "creative", "spy", "crea", "ugc", "compta", "agences", "magazines", "community_managers_ia", "agences_marketing_ia", "agences_seo_geo_ia", "photographes_ia", "graphistes_ia", "createurs_ugc", "experts_produit", "diagnostiqueurs", "essayeurs", "experts_avis", "managers_ugc", "experts_seo", "coachs_domicile", "experts_geo", "magazine_marque"];

/**
 * Les espaces PROPOSÉS au marchand dans le sélecteur.
 *
 * Décision de JP le 20/08/2026 : cinq espaces seulement, le temps de finir les
 * autres. Cachés, PAS supprimés — leurs routes répondent toujours et leurs
 * pages continuent d'être corrigées ; ils ne sont simplement plus offerts dans
 * le sélecteur d'un marchand.
 *
 * Cachés ce jour, avec la raison mesurée le 20/08 :
 *   ventes        les chiffres ne sont pas encore fiables d'une page à l'autre
 *   optimarketing le filtre de période ne fait pas bouger les chiffres
 *   spy           six pages réclamaient des fichiers absents
 *   crea          les neuf pages sont en français, la démo en anglais
 *   ugc           l'espace est entièrement en anglais, menu compris
 *
 * Masquer ici, et NON supprimer de PACK_ORDER : ce tableau sert aussi à valider
 * la valeur mémorisée dans le navigateur et les `subscribed_packs` en base. Un
 * espace retiré de PACK_ORDER deviendrait une valeur invalide, et un compte qui
 * s'y trouvait serait renvoyé de force ailleurs à chaque chargement.
 *
 * Pour rouvrir un espace : le remettre dans cette liste, rien d'autre.
 */
/**
 * GROUPES DU SÉLECTEUR D'ESPACE.
 *
 * Demande de JP le 26/08/2026 : « j'aimerais à terme que les onglets soient
 * groupés pour que ce soit digeste. »
 *
 * Douze espaces en liste plate, on lit le premier et le dernier. Le découpage
 * ci-dessous suit ce qu'une marchande vient FAIRE, pas l'ordre d'écriture du
 * code : ce qui se passe chez elle, ce qui fait venir du monde, ce qu'elle
 * fabrique.
 *
 * ⚠️ CHAQUE ESPACE DOIT APPARAÎTRE ICI, UNE FOIS ET UNE SEULE. Un espace
 * oublié disparaîtrait du sélecteur sans erreur, et personne ne le verrait :
 * le rendu boucle sur les groupes, plus sur PACK_ORDER. Le test
 * `groupes-espaces.test.ts` tient cette règle, et il tombe aussi bien sur un
 * oubli que sur un doublon.
 *
 * Les espaces fermés (voir PACKS_OUVERTS) sont quand même placés : le jour où
 * JP en rouvre un, il apparaît dans le bon groupe sans autre geste.
 */
/**
 * Une entrée d'un sous-panneau : soit un espace du produit, soit un lien direct.
 *
 * Les deux existent parce que les métiers ne sont pas tous au même stade. Les
 * quatre créatifs ont leur espace et leur annuaire ; les métiers de conseil,
 * eux, vivent encore dans `/dashboard/my-team` filtré par métier. Leur donner
 * un espace vide pour l'uniformité coûterait huit espaces qui ne mènent nulle
 * part, et le sélecteur en porte déjà assez.
 */
export interface EntreeSousPanneau {
  /** Un espace déclaré dans PACKS. Exclusif avec `href`. */
  pack?: PackId;
  /** Un lien direct, pour un métier qui n'a pas d'espace à lui. */
  href?: string;
  /**
   * Obligatoire avec `href`. Facultatif avec `pack`, où il SURCHARGE le libellé
   * de l'espace pour cette colonne seulement.
   *
   * JP, 08/09/2026 : « trouver des agences, ce sont en réalité les experts ».
   * Le pack garde son nom partout ailleurs, il ne se présente autrement qu'ici.
   */
  label?: string;
  tagline?: string;
  /** Nom d'un tracé Lucide, résolu par le sélecteur. */
  icone?: string;
}

/** Une colonne d'un sous-panneau : un intertitre, ses entrées. */
export interface ColonneSousPanneau {
  titre: string;
  entrees: readonly EntreeSousPanneau[];
}

export interface GroupeEspaces {
  titre: string;
  packs: readonly PackId[];
  /**
   * Quand il est présent, le groupe ne s'étale plus en liste : il devient UNE
   * ligne qui ouvre ce panneau au survol, à droite.
   *
   * Demande de JP le 08/09/2026. Douze espaces à plat se lisaient mal même
   * groupés : on lit le premier et le dernier. Une ligne par famille, et le
   * détail au survol, rend le menu court sans rien cacher.
   */
  colonnes?: readonly ColonneSousPanneau[];
  /** L'apparence de cette ligne unique, quand `colonnes` est présent. */
  ligne?: { icone: string; tagline: string };
  /**
   * Groupe masque VOLONTAIREMENT, tous ses espaces fermes en meme temps.
   *
   * Sans ce marqueur, un groupe vide et un groupe oublie se ressemblent : les
   * deux disparaissent de l'ecran sans un mot. Le controle
   * `groupes-espaces.test.ts` refuse le second et accepte le premier, a
   * condition qu'il le dise ici.
   */
  masque?: true;
}

/* 09/10/2026 (JP) : LE MENU TIENT EN QUATRE ÉTAGES, sous Cowork qui reste en
   tête et ne bouge pas. Chaque étage est une ligne qui s'ouvre au survol sur
   ses colonnes. L'ordre part de la cliente devant un produit et s'éloigne
   d'elle :

     1. Vos produits      les agents posés sur CHAQUE fiche produit ;
     2. Votre e-commerce  les agents de la boutique ENTIÈRE, la page lystes.ai
                          de la marque, et ce que disent les clientes ;
     3. Votre entreprise  les agences IA, et le pilotage : chiffres,
                          concurrence, compta ;
     4. Votre réseau      les humains : experts, créatrices, partenaires.

   Ce qui range une entrée, c'est ce sur quoi elle travaille : une fiche, la
   boutique, la marque, ou quelqu'un hors de la boutique. La distinction fiche
   ou boutique entière est celle que JP a posée le 12/08/2026 pour la
   latérale (ÉQUIPE IA PRODUIT, ÉQUIPE IA SITE WEB) ; elle gouverne
   maintenant tout le sélecteur.

   Six groupes disparaissent : « Vos équipes IA », « Vos outils IA », « Votre
   réseau d'experts », « Votre réseau de partenaires », « Développer votre
   stratégie », « Développer votre image ». Leurs espaces sont replacés un par
   un, une seule fois. Les espaces fermés (optimarketing, creative, crea, ugc,
   spy, compta, conversion) vont dans l'étage de l'entrée qui les remplace à
   l'écran. Les groupes masqués qui ne servaient qu'à garer un espace partent
   aussi : leurs espaces ont maintenant un étage. Seul reste masqué celui des
   agents, absorbé par Cowork le 01/09.

   Les adresses sont celles d'App.tsx et de la latérale (AdminLayout), relevées
   et non devinées. Une entrée dont l'écran n'existe pas n'est pas posée. */
export const GROUPES_ESPACES: readonly GroupeEspaces[] = [
  {
    /* 09/10/2026 (JP) : l'étage des fiches. Trois colonnes qui suivent la
       cliente devant un produit : elle doute, elle cherche, elle achète.

       10/09/2026 (JP) : les métiers de fiche ont chacun leur espace. Le
       sélecteur ouvre donc l'espace, pas une simple adresse, et la latérale
       suit avec guide, activité et page de travail.

       30/09/2026 (JP) : une équipe par bloc de la fiche. Les lots et le
       conseiller en appel ont déjà leur écran (la latérale, les réglages) :
       un lien direct suffit, sans créer d'espace vide.

       La FAQ produit ouvre la FAQ IA. La page n'a pas d'onglet produit : elle
       rédige déjà la FAQ de chaque produit, à partir des questions posées aux
       IA. La FAQ de la marque, à l'étage du dessous, ouvre la même page. */
    titre: "Vos produits",
    packs: ["experts_produit", "diagnostiqueurs", "essayeurs", "experts_avis",
      "experts_geo", "experts_seo", "managers_ugc", "coachs_domicile"],
    ligne: { icone: "Package", tagline: "Dix agents IA sur chaque fiche" },
    colonnes: [
      {
        titre: "Ils conseillent et rassurent",
        entrees: [
          /* 09/10 : sous-titre raccourci ici seulement, celui de l'espace était
             coupé dans la colonne. */
          { pack: "experts_produit", tagline: "Ils répondent sur la fiche, jour et nuit" },
          { pack: "diagnostiqueurs" },
          { pack: "essayeurs" },
          {
            href: "/dashboard/faq-ia",
            label: "FAQ produit",
            tagline: "Les doutes, répondus d'avance",
            icone: "MessageCircleQuestion",
          },
          { pack: "experts_avis" },
        ],
      },
      {
        titre: "Ils font trouver et donnent envie",
        entrees: [
          { pack: "experts_geo", tagline: "Les actualités du produit, citées par les IA" },
          { pack: "experts_seo", tagline: "Une description qui convertit" },
          { pack: "managers_ugc", tagline: "Des UGC qui ressemblent à vos clientes" },
        ],
      },
      {
        titre: "Au moment d'acheter, et après",
        entrees: [
          {
            href: "/dashboard/settings?tab=general&section=voice-ai",
            label: "Conseiller en appel",
            tagline: "La cliente appelle depuis la fiche",
            icone: "Phone",
          },
          {
            /* Layers et non Package : Package est déjà le pictogramme de
               l'étage et celui des Experts produit. La latérale montre les
               lots sous Layers, le sélecteur dit la même chose. */
            href: "/dashboard/lots",
            label: "Les lots",
            tagline: "Les packs proposés sous le panier",
            icone: "Layers",
          },
          /* L'espace s'affiche « Coachs » ailleurs, pour la largeur. Ici la
             colonne a la place du nom entier. */
          { pack: "coachs_domicile", label: "Coachs à domicile" },
        ],
      },
    ],
  },
  {
    /* 09/10/2026 (JP) : l'étage de la boutique entière. Un agent de cet étage
       connaît tout le catalogue, pas une seule fiche. La page lystes.ai de la
       marque et ce que disent les clientes vivent au même étage.

       Conseiller boutique et « Diagnostic et essayage » ouvrent les onglets de
       l'organigramme, comme la latérale (AdminLayout, section ÉQUIPE IA SITE
       WEB). Les écrans /dashboard/specialistes et /dashboard/agents-produit
       avaient un rendu que JP a perdu le 10/08 : on n'y renvoie pas.

       Newsletter IA n'est pas posée. L'agence e-mails n'a pas d'adresse à
       elle : c'est un panneau en tête des paniers abandonnés. Une entrée
       « Newsletter » qui ouvrirait les paniers promettrait des campagnes que
       l'écran ne montre pas. Elle viendra avec son adresse.

       Blog IA quitte le menu : il écrit dans la même table que le Magazine de
       marque, deux entrées pour un seul contenu. Sa route reste montée et
       rattachée à l'espace marketing (PACK_ROUTE_PREFIXES).

       « Votre boutique » ouvre l'espace des boutiques : catalogue, commandes,
       clientes. Le 08/09 l'avait masqué pour ne pas donner deux noms au même
       écran (« Suivre vos données » et « Insight AI »). Ce n'est plus le cas :
       Insight AI ouvre les performances, à l'étage du pilotage, et cet espace
       revient pour son tableau de bord.

       booking, formulaires, review, marketing et conversion sont rangés ici
       parce que leurs outils s'y affichent, en lien direct : un espace ne
       figure que dans un groupe, et c'est celui où on le trouve. */
    titre: "Votre e-commerce",
    packs: ["boutiques", "conversion", "booking", "formulaires", "review", "marketing", "magazine_marque"],
    ligne: { icone: "Store", tagline: "Les agents de toute la boutique" },
    colonnes: [
      {
        titre: "Sur votre site",
        entrees: [
          {
            href: "/dashboard/agents?tab=boutique",
            label: "Conseiller boutique",
            tagline: "L'orbital : chat, panier, appel",
            /* Le tracé de la latérale pour le même agent. MessagesSquare est
               celui de Cowork, visible au-dessus au même moment. */
            icone: "MessageSquare",
          },
          {
            href: "/dashboard/my-team?tab=specialists",
            label: "Diagnostic et essayage",
            tagline: "La barre flottante, sur chaque page",
            icone: "Wand2",
          },
          {
            href: "/dashboard/vendre-plus",
            label: "Offres IA",
            tagline: "Lots, cadeaux, panier, après-achat",
            icone: "Tag",
          },
          {
            href: "/dashboard/forms",
            label: "Forms IA",
            tagline: "Le formulaire qui bascule dans le chat",
            icone: "FormInput",
          },
          {
            href: "/dashboard/booking",
            label: "Booking IA",
            tagline: "Vos rendez-vous et votre calendrier",
            icone: "CalendarDays",
          },
          {
            href: "/dashboard/devis-ia",
            label: "Devis IA",
            tagline: "Vos tarifs, un devis instantané",
            icone: "FileText",
          },
          {
            href: "/dashboard/pay-ia",
            label: "Pay IA",
            tagline: "Vous encaissez avec un simple lien",
            icone: "CreditCard",
          },
        ],
      },
      {
        titre: "Votre page sur lystes.ai",
        entrees: [
          {
            /* Review IA, côté boutique. Les avis de chaque produit sont à
               l'étage des fiches, avec les Experts avis. */
            href: "/dashboard/review/boutique",
            label: "Avis de la boutique",
            tagline: "Review IA, les avis sur votre marque",
            icone: "MessageSquareQuote",
          },
          {
            href: "/dashboard/faq-ia",
            label: "FAQ de la marque",
            tagline: "FAQ IA, publiée sur votre page",
            icone: "MessageCircleQuestion",
          },
          /* 11/09/2026 (JP) : le magazine est tenu par un trio, journaliste,
             photographe, expert SEO. */
          { pack: "magazine_marque", tagline: "Toutes les actualités produit" },
          {
            href: "/dashboard/multi-link",
            label: "Multi-lien IA",
            tagline: "Tous vos liens sur une seule page",
            icone: "Link2",
          },
          {
            /* ShoppingBag et non Store : Store est le pictogramme de l'étage
               et celui de « Votre boutique », juste à côté. */
            href: "/dashboard/social-shop-ia",
            label: "Social Shop IA",
            tagline: "D'où viennent vos ventes",
            icone: "ShoppingBag",
          },
        ],
      },
      {
        titre: "Ce que vos clientes disent",
        entrees: [
          {
            href: "/dashboard/conversations",
            label: "Conversations",
            tagline: "Tout ce que vos clientes demandent",
            icone: "MessageSquareText",
          },
          {
            href: "/dashboard/insights",
            label: "Préoccupations",
            tagline: "Ce qui freine l'achat",
            icone: "Lightbulb",
          },
          { pack: "boutiques", label: "Votre boutique", tagline: "Catalogue, commandes, clientes" },
        ],
      },
    ],
  },
  {
    /* 09/10/2026 (JP) : l'étage de la marque. Ses agences IA, et ce qui la
       pilote : ses chiffres, ses concurrents, sa compta.

       « Faire tourner vos réseaux » n'a plus d'entrée : la Community Manager
       IA l'absorbe. L'espace `social` reste ouvert et rangé ici, ses routes
       répondent, et un compte qui l'a mémorisé le retrouve tel quel ; il
       n'est simplement plus proposé à part.

       14/09/2026 (JP) : « Agence de com IA » pour que le nom ne soit pas
       coupé. Le pack garde son nom entier partout ailleurs. La page d'origine,
       « Community Managers IA », n'a pas d'espace à elle : c'est un second
       écran de l'agence, d'où le lien direct.

       « Agence SEO et GEO IA » : le libellé de la colonne seulement. Le pack
       garde « Agence SEO/GEO IA », que le contrôle des agences exige.

       Stratège ouvre /dashboard/strategie, l'écran de la stratégie de marque
       (02/10/2026), que la latérale appelle « Votre stratégie ».

       08/09/2026 (JP) : « Insight AI » est le nouveau nom de « Suivre vos
       données ». Concurrents IA et Compta IA gardent le lien direct qu'ils
       avaient dans « Vos outils IA » ; leurs espaces, `spy` et `compta`,
       restent fermés au sélecteur comme depuis le 04/09. */
    titre: "Votre entreprise",
    packs: ["community_managers_ia", "photographes_ia", "graphistes_ia", "createurs_ugc", "social",
      "creative", "crea", "ugc",
      "agences_marketing_ia", "agences_seo_geo_ia", "optimarketing",
      "spy", "compta"],
    ligne: { icone: "Building2", tagline: "Vos agences IA et votre pilotage" },
    colonnes: [
      {
        titre: "Votre communication",
        entrees: [
          { pack: "community_managers_ia", label: "Agence de com IA", tagline: "Ligne éditoriale, réseau par réseau" },
          { href: "/dashboard/community-managers-ia", label: "Community Managers IA", tagline: "Un feed de neuf photos, dans un style", icone: "Images" },
          { pack: "photographes_ia" },
          { pack: "graphistes_ia" },
          { pack: "createurs_ugc", tagline: "Créateurs UGC IA, vidéos produit" },
        ],
      },
      {
        titre: "Vos ventes et votre marketing",
        entrees: [
          { pack: "agences_marketing_ia", tagline: "Pubs, media buying, e-mails" },
          { pack: "agences_seo_geo_ia", label: "Agence SEO et GEO IA", tagline: "Mots-clés, Google et les IA" },
          {
            href: "/dashboard/strategie",
            label: "Stratège",
            tagline: "Votre plan, à partir de votre objectif",
            icone: "Compass",
          },
        ],
      },
      {
        titre: "Votre pilotage",
        entrees: [
          {
            href: "/dashboard/data-insights",
            label: "Insight AI",
            tagline: "Chiffre d'affaires, commandes, clients",
            icone: "Activity",
          },
          {
            href: "/dashboard/spy",
            label: "Concurrents IA",
            tagline: "Ce que font les boutiques d'à côté",
            icone: "Search",
          },
          {
            href: "/dashboard/comptabilite",
            label: "Compta IA",
            tagline: "Journal des ventes, TVA, export FEC",
            icone: "Calculator",
          },
        ],
      },
    ],
  },
  {
    /* 09/10/2026 (JP) : l'étage des humains, tout ce qui se trouve HORS de la
       boutique. Il réunit les deux réseaux du 08/09 (experts, partenaires) et
       les influenceuses, qui attendaient seules en bas de « Développer votre
       stratégie ».

       08/09/2026 (JP) : « trouver des agences, ce sont en réalité les
       experts ». L'entrée le dit, le pack garde son nom ailleurs.

       « Influenceuses et UGC » est l'annuaire des créatrices déjà repérées ou
       inscrites ; « Trouver des influenceuses » lance une recherche sur un
       brief. Deux écrans, deux gestes : les sous-titres les distinguent. */
    titre: "Votre réseau",
    packs: ["agences", "influenceurs", "magazines"],
    ligne: { icone: "Users", tagline: "Des experts et des partenaires humains" },
    colonnes: [
      {
        titre: "Des experts",
        entrees: [
          {
            pack: "agences",
            label: "Experts e-commerce",
            tagline: "Agences et consultants",
          },
          {
            href: "/dashboard/experts-marketing",
            label: "Experts marketing",
            tagline: "SEO, GEO, media buying",
            icone: "Megaphone",
          },
        ],
      },
      {
        titre: "Des créatrices",
        entrees: [
          {
            /* BookUser, l'annuaire : UserSearch est déjà le pictogramme de
               l'espace de recherche posé juste dessous. */
            href: "/dashboard/influenceurs-ugc",
            label: "Influenceuses et UGC",
            tagline: "L'annuaire, avec leurs photos",
            icone: "BookUser",
          },
          { pack: "influenceurs", label: "Trouver des influenceuses", tagline: "Une recherche sur votre brief" },
        ],
      },
      {
        titre: "Des partenaires",
        entrees: [
          { pack: "magazines", label: "Presse et magazines", tagline: "Articles sponsorisés, audience" },
          {
            href: "/dashboard/financement",
            label: "Financement",
            tagline: "Stock, campagnes, factures",
            icone: "Landmark",
          },
        ],
      },
    ],
  },
  {
    /* 31/08/2026 (JP) : regroupage validé en V2. Les agents IA restent
       ensemble : surveiller, savoir, manager.
       01/09/2026 (JP) : ces trois espaces sont absorbés par CoWork :
       Mémoire, Instructions, Suivre l'activité vivent désormais dans la
       latérale CoWork. Le groupe disparaît du sélecteur (`masque: true`),
       mais les espaces RESTENT OUVERTS : leurs routes répondent, « agents »
       reste le tableau de bord par défaut, et les replis documentés dans
       WorkspacePackContext tiennent toujours. Les enlever de PACKS_OUVERTS
       briserait ces replis : on les cache au rendu, pas à l'availability. */
    titre: "Suivre et piloter vos agents IA",
    packs: ["agents", "savoir", "manager"],
    masque: true,
  },
];

/* 30/08/2026 (JP) : « tu peux remettre certaines choses qu'on avait cachees
   dans le menu ; ce que tu estimes loin d'etre fini, tu mets en coming soon ».
   Cacher un espace le fait disparaitre de la carte de la plateforme ; le
   montrer avec « Bientot disponible » dit la meme verite sans l'effacer.
   Le tri fini / bientot se lit sur `comingSoon` dans PACKS, pas ici.
   31/08/2026 : regroupage V2 — tous les espaces sont ouverts dans le
   selecteur, les groupes suivent l'usage de la marchande. */
export const PACKS_OUVERTS: readonly PackId[] = [
  "boutiques", "agents", "savoir", "manager",
  "marketing", "booking", "formulaires", "review", "influenceurs",
  "agences", "magazines", "createurs_ugc",
  "community_managers_ia", "agences_marketing_ia", "agences_seo_geo_ia", "photographes_ia", "graphistes_ia",
  /* 10/09/2026 (JP) : les six équipes de fiche produit ont leur espace —
     sans cette ligne, la colonne « Sur vos fiches produit » du sélecteur
     était filtrée et invisible. */
  "experts_produit", "diagnostiqueurs", "essayeurs", "experts_avis",
  "experts_seo", "coachs_domicile", "experts_geo",
  /* 30/09/2026 (JP) : la page d'expert qui manquait. */
  "managers_ugc",
  "magazine_marque",
  /* 06/09/2026 (JP) : « Produire vos visuels » retiré du sélecteur — retiré
     de PACKS_OUVERTS, pas de PACK_ORDER ni de son groupe : la route
     /dashboard/creative-home répond toujours, l'entrée n'est plus proposée.
     Le contenu de l'espace est déjà couvert par les quatre annuaires
     (Photographes IA, Graphistes IA, UGC IA, Community Managers IA). */
  /* 04/09/2026 (JP) : « Sections d'offres » retiré du sélecteur — il est déjà
     proposé dans le menu Outils sous « Offres IA ». La route reste ouverte. */

  /* 04/09/2026 (JP) : « Créer vos visuels IA » et « Créer des UGC IA » retirés
     du sélecteur — retirés de PACKS_OUVERTS, pas de PACK_ORDER : leurs routes
     répondent toujours, ils ne sont plus proposés. */

  /* 09/09/2026 : « Faire tourner vos réseaux » REVIENT. Il avait été retiré le
     04/09 avec les deux autres, alors qu'il n'est pas dans le même état : son
     espace est entièrement construit et branché. Ses trois routes sont montées
     (App.tsx:1169-1171), sa latérale existe (AdminLayout.tsx:583-589), ses
     trois menus ont leur palier (tier-access.ts:185-187), ses trois tables
     existent, et ses écritures passent par des fonctions edge présentes.

     Ce qui le retenait vraiment n'était pas son état, c'était une panne : le
     cron de publication était refusé en 401 depuis le 22 août, faute d'entrée
     dans supabase/config.toml. Corrigé le 09/09 (PR 158). La file repart, donc
     l'espace peut être proposé.

     ⚠️ Une seule liste décide de ce qui est proposé, c'est celle-ci. Le
     démasquage du groupe ci-dessus est nécessaire EN PLUS : ouvrir sans
     démasquer laisse l'espace invisible, et aucun test ne l'attrape.

     09/10/2026 (JP) : l'espace reste ouvert, mais n'a plus d'entrée à lui
     dans le sélecteur. La Community Manager IA l'absorbe, sous « Votre
     entreprise ». Ouvert, ses routes répondent et un compte qui l'a mémorisé
     le retrouve. */
  "social",
];

export interface PackDefinition {
  id: PackId;
  label: string;
  /** Label affiché dans le sélecteur d'espace (optionnel). */
  switcherLabel?: string;
  tagline: string;
  /**
   * Couleur du rond affiché sur le BOUTON FERMÉ du sélecteur.
   * Les cinq espaces ouverts partagent le vert #e1f3c5, celui de la ligne
   * choisie dans le panneau : le bouton fermé EST la sélection, et le menu
   * n'a qu'une couleur. Deux espaces portaient encore un dégradé orange et
   * un gris hérités de l'ancien panneau sombre.
   */
  gradient: string;
  /** Route "accueil" du pack. */
  homeRoute: string;
  /**
   * URL externe : l'espace vit hors du SPA (Lystes Spy est servi par le VPS).
   * Le switcher l'ouvre dans un nouvel onglet au lieu de changer de pack :
   * un iframe http:// serait bloqué en contenu mixte depuis https://lystes.ai.
   */
  externe?: string;
  /**
   * Route du « Tableau de bord » de l'espace : celle que pointe l'entrée
   * ACCUEIL de la latérale. Distincte de `homeRoute` parce qu'un espace peut
   * s'ouvrir sur un outil (Lystes Créa ouvre le générateur d'images) alors que
   * la latérale, elle, doit toujours ramener au tableau de bord de l'espace
   * courant. Tant que cette route valait "/dashboard" pour tout le monde,
   * l'espace ne vivait que dans un état React : au moindre rechargement on
   * retombait sur le tableau de bord d'Agents (constaté par JP le 10/08).
   */
  dashboardRoute: string;
  /** Si true, l'entrée du sélecteur est désactivée et affiche « Bientôt disponible ». */
  comingSoon?: boolean;
}

export const PACKS: Record<PackId, PackDefinition> = {
  /* VENDRE PLUS.
   *
   * Demande de JP le 26/08/2026 : « il faut le mettre dans le menu et grouper
   * ces menus ». Les six ecrans des lots existaient et n appartenaient a AUCUN
   * espace : on ne les atteignait que par l URL. Une page qu on ne trouve pas
   * dans le menu n existe pas pour la marchande.
   *
   * Le nom dit ce qu on y fait, pas ce qu on y trouve. « Modules de
   * conversion » aurait ete le nom du developpeur ; « Vendre plus » est celui
   * de la marchande, et c est elle qui lit le menu. */
  /* COMPTABILITÉ (JP, 02/09/2026). Son propre espace, sa propre latérale :
     la comptabilité n'est pas un onglet du chat, c'est un métier. */
  compta: {
    id: "compta",
    label: "Tenir votre comptabilité",
    switcherLabel: "Comptabilité",
    tagline: "Journal des ventes, TVA collectée, export FEC",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/comptabilite",
    dashboardRoute: "/dashboard/comptabilite",
  },
  conversion: {
    id: "conversion",
    /* 03/09/2026 (JP) : visible dans le selecteur, non cliquable. */
    comingSoon: true,
    label: "Sections d'offres",
    tagline: "Lots, cadeaux, panier, apres-achat",
    gradient: "rgb(225, 243, 197)",
    /* 27/08/2026 (JP) : « est-ce que le bundle peut avoir son propre espace
       avec son dashboard ». Les deux routes valaient /dashboard/lots : ouvrir
       l espace deposait la marchande sur la LISTE de ses lots, donc sur un
       formulaire, jamais sur un etat des lieux. Elles pointent maintenant le
       tableau de bord de l espace, qui dit ce qui tourne, ce qui est pose dans
       la boutique, et ce que ca rapporte. */
    homeRoute: "/dashboard/vendre-plus",
    dashboardRoute: "/dashboard/vendre-plus",
  },
  /* L'ESPACE DES SITES QUE LYSTES CONSTRUIT.

     Demande de JP le 27/08/2026 : « pour le back-office e-commerce aussi,
     isole, pour les sites a la thenecked, dans le menu, isole ».

     Isole VRAIMENT : son propre groupe, et pas une ligne de plus dans
     « Votre boutique ». Ses cinq sites (ritualmoon, solyneparis, lomahair,
     thenecked, summerskyn) ne sont ni des Shopify ni des WooCommerce ; les
     ranger avec les espaces qui pilotent la boutique d'une marchande ferait
     croire qu'il s'agit de la meme chose. */
  boutiques: {
    id: "boutiques",
    label: "Suivre vos données",
    /* 09/10/2026 (JP) : le sélecteur propose cet espace sous « Votre
       boutique » (catalogue, commandes, clientes). Le bouton fermé suit, sinon
       il afficherait un nom que le menu ne montre plus nulle part. L'id ne
       bouge pas, il est écrit dans les droits et en base. */
    switcherLabel: "Votre boutique",
    tagline: "Chiffre d'affaires, commandes, clients",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/boutiques",
    dashboardRoute: "/dashboard/boutiques",
  },
  agents: {
    id: "agents",
    label: "Suivre l’activité",
    tagline: "Conversations, diagnostics, essayages, leads",
    gradient: "rgb(225, 243, 197)",
    /* 30/08/2026 : /dashboard appartient à Cowork. La maison de cet espace,
       c'est le tableau de bord d'activité — sinon le sélecteur affichait
       « Suivre l'activité » alors qu'on était sur Cowork. */
    homeRoute: "/dashboard/activite",
    dashboardRoute: "/dashboard/activite",
  },
  /* Découpe du 19/08/2026 (JP) : la latérale d'Agents portait une trentaine
     d'entrées. Elle est scindée en trois espaces lisibles — surveiller,
     savoir, manager — qui partagent le même tableau de bord. */
  savoir: {
    id: "savoir",
    label: "Donner du contexte",
    tagline: "Le socle commun à tous vos agents",
    gradient: "rgb(225, 243, 197)",
    // 19/08/2026 (JP) : le « Tableau de bord » de la latérale reste LE
    // back-office historique (/dashboard), mais le SÉLECTEUR dépose sur
    // l'accueil propre de l'espace — sinon changer d'espace ne bougeait
    // plus rien à l'écran (« ça reste sur le même onglet »).
    homeRoute: "/dashboard/savoir",
    dashboardRoute: "/dashboard/savoir",
  },
  manager: {
    id: "manager",
    label: "Donner des instructions",
    tagline: "Chaque poste, et ses consignes du moment",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/manager",
    dashboardRoute: "/dashboard/manager",
  },
  /* 22/08/2026 (JP) : le pilote automatique social. Un dépôt du marchand,
     ses réseaux tournent seuls — connexions, calendrier approuvé, file de
     publication, et les échecs affichés en clair. */
  social: {
    id: "social",
    /* 30/08/2026 : visible dans le sélecteur, non cliquable. Voir PACKS_OUVERTS.
       09/09/2026 : cliquable. Ce qui le retenait était une panne de la file de
       publication, pas un manque de l'espace. Panne corrigée, PR 158. */
    label: "Faire tourner vos réseaux",
    switcherLabel: "Faire tourner vos réseaux",
    tagline: "Un mois approuvé, publié tout seul",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/social",
    dashboardRoute: "/dashboard/social",
  },
  /* 23/08/2026 (JP) : trouver des créateurs, relever leur audience, suivre la
     discussion jusqu'au contrat. La découverte est facturée au créateur retenu. */
  influenceurs: {
    id: "influenceurs",
    /* 30/08/2026 : visible dans le selecteur, non cliquable. Voir PACKS_OUVERTS.
       30/09/2026 : cliquable. L'espace fonctionne (recherche publique, liste,
       historique) et montre désormais en tête les créatrices et influenceuses
       inscrites et publiées sur lystes.ai. Plus de « Bientôt ». */
    label: "Trouver des influenceurs",
    switcherLabel: "Trouver des influenceurs",
    tagline: "Créateurs, audience mesurée, prise de contact",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/influenceurs",
    dashboardRoute: "/dashboard/influenceurs",
  },
  agences: {
    id: "agences",
    label: "Trouver des agences",
    switcherLabel: "Trouver des agences",
    tagline: "Agences e-commerce, réalisations, contact",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/agences",
    dashboardRoute: "/dashboard/agences",
  },
  magazines: {
    id: "magazines",
    label: "Trouver des magazines",
    switcherLabel: "Trouver des magazines",
    tagline: "Presse et médias, audience, prise de contact",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/magazines",
    dashboardRoute: "/dashboard/magazines",
  },
  community_managers_ia: {
    id: "community_managers_ia",
    /* Les libellés changent, l'id `community_managers_ia` reste : il est écrit
       dans les droits, les routes et des lignes en base. Renommer une clé pour
       changer un mot à l'écran orpheline ce que les marchandes ont créé. */
    label: "Agence de communication IA",
    switcherLabel: "Agence de communication IA",
    tagline: "Feeds, posts et ligne éditoriale, réseau par réseau",
    gradient: "rgb(225, 243, 197)",
    /* L'espace s'appelle « Agence de communication IA » : son adresse le dit.
       L'ancienne reste servie, avec l'ancienne vue, pour les liens deja poses. */
    homeRoute: "/dashboard/agence-communication-ia",
    dashboardRoute: "/dashboard/agence-communication-ia",
  },
  /* 14/09/2026 (JP) : « exactement le même gabarit que Lucie, sauf que les
     images générées seront plus des images avec un design publicitaire ».
     Même moule, autre sortie : aucun écran n'est dupliqué, l'annuaire est le
     même composant avec une autre discipline. */
  /* 14/09/2026 (JP) : « il faut la meme pour lister aussi les journalistes
     SEO/GEO qui ecrivent des articles avec la meme approche. Contrairement a
     l'agence de communication, l'approche est A LA SEMAINE et pas aujourd'hui. »

     Meme gabarit que les deux autres agences, un seul ecart qui change tout :
     le rythme. On ne publie pas onze articles par jour, on en publie deux ou
     trois par semaine, et chacun se construit. */
  agences_seo_geo_ia: {
    id: "agences_seo_geo_ia",
    label: "Agence SEO/GEO IA",
    switcherLabel: "Agence SEO/GEO IA",
    tagline: "Articles trouves par Google, cites par les IA",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/agences-seo-geo-ia",
    dashboardRoute: "/dashboard/agences-seo-geo-ia",
  },
  agences_marketing_ia: {
    id: "agences_marketing_ia",
    label: "Agence marketing IA",
    switcherLabel: "Agence marketing IA",
    tagline: "Publicités, accroches et appels à l’action",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/agences-marketing-ia",
    dashboardRoute: "/dashboard/agences-marketing-ia",
  },
  photographes_ia: {
    id: "photographes_ia",
    label: "Photographes IA",
    switcherLabel: "Photographes IA",
    tagline: "Shootings produit, styles et cadrages",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/photographes-ia",
    dashboardRoute: "/dashboard/photographes-ia",
  },
  graphistes_ia: {
    id: "graphistes_ia",
    label: "Graphistes IA",
    switcherLabel: "Graphistes IA",
    tagline: "Direction artistique, affiches et visuels",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/graphistes-ia",
    dashboardRoute: "/dashboard/graphistes-ia",
  },
  /* 15/09/2026 (JP) : « Agence de com IA, Agence marketing IA, Agence
     SEO/GEO IA, et maintenant Agence UGC IA ». Seuls les LIBELLES changent :
     l'id `createurs_ugc` reste, il est ecrit dans les droits, les routes et
     des lignes en base. Renommer une cle pour changer un mot a l'ecran
     orpheline ce que les marchandes ont deja cree. */
  createurs_ugc: {
    id: "createurs_ugc",
    /* 05/09/2026 (JP) : aligné sur les trois autres métiers créatifs IA.
       La page est l'annuaire des Créateurs UGC IA, pas la recherche de
       créateurs réels — le libellé précédent (« Trouver des créateurs
       UGC ») induisait en erreur. */
    label: "Agence UGC IA",
    switcherLabel: "Agence UGC IA",
    tagline: "Créateurs UGC IA, vidéos produit tenues en main",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/createurs-ugc",
    dashboardRoute: "/dashboard/createurs-ugc",
  },
  /* 10/09/2026 (JP) : « chaque équipe a sa propre sidebar comme les
     photographes IA ». Les six métiers de fiche produit quittent l'espace
     « manager » et prennent chacun le leur : annuaire, guide, suivi
     d'activité, page de travail. */
  experts_produit: {
    id: "experts_produit",
    label: "Experts produit",
    switcherLabel: "Experts produit",
    tagline: "Ils répondent sur la fiche, produit par produit",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/experts-produit",
    dashboardRoute: "/dashboard/experts-produit",
  },
  diagnostiqueurs: {
    id: "diagnostiqueurs",
    label: "Diagnostiqueurs",
    switcherLabel: "Diagnostiqueurs",
    tagline: "Ils analysent avant de recommander",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/diagnostiqueurs",
    dashboardRoute: "/dashboard/diagnostiqueurs",
  },
  essayeurs: {
    id: "essayeurs",
    label: "Essayeurs",
    switcherLabel: "Essayeurs",
    tagline: "Ils font essayer avant d'acheter",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/essayeurs",
    dashboardRoute: "/dashboard/essayeurs",
  },
  experts_avis: {
    id: "experts_avis",
    label: "Experts avis",
    switcherLabel: "Experts avis",
    tagline: "Ils animent les avis de chaque produit",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/experts-avis",
    dashboardRoute: "/dashboard/experts-avis",
  },
  managers_ugc: {
    id: "managers_ugc",
    label: "Managers UGC",
    switcherLabel: "Managers UGC",
    tagline: "Ils font réaliser les photos UGC de chaque produit",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/managers-ugc",
    dashboardRoute: "/dashboard/managers-ugc",
  },
  experts_seo: {
    id: "experts_seo",
    label: "Experts SEO",
    switcherLabel: "Experts SEO",
    tagline: "Ils lisent les conversations et font trouver la fiche",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/boost-produit",
    dashboardRoute: "/dashboard/boost-produit",
  },
  coachs_domicile: {
    id: "coachs_domicile",
    label: "Coachs à domicile",
    switcherLabel: "Coachs",
    tagline: "Ils suivent la cliente après l'achat",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/coach-domicile",
    dashboardRoute: "/dashboard/coach-domicile",
  },
  experts_geo: {
    id: "experts_geo",
    label: "Experts GEO",
    switcherLabel: "Experts GEO",
    tagline: "Ils font citer la fiche par les IA",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/experts-geo",
    dashboardRoute: "/dashboard/experts-geo",
  },
  magazine_marque: {
    id: "magazine_marque",
    label: "Le magazine de votre marque",
    switcherLabel: "Magazine de marque",
    tagline: "Journaliste, photographe, expert SEO et agent GEO",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/magazine-marque",
    dashboardRoute: "/dashboard/magazine-marque",
  },
  creative: {
    id: "creative",
    label: "Produire vos visuels",
    tagline: "Photographes et graphistes IA",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/creative-home",
    dashboardRoute: "/dashboard/creative-home",
  },
  marketing: {
    id: "marketing",
    label: "Créer vos liens",
    tagline: "Newsletter, publicité, influenceurs, réseaux",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/links-data",
    dashboardRoute: "/dashboard/links-data",
  },
  booking: {
    id: "booking",
    label: "Booking",
    switcherLabel: "Booking",
    tagline: "Rendez-vous, calendrier et clients",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/booking",
    dashboardRoute: "/dashboard/booking",
  },
  formulaires: {
    id: "formulaires",
    label: "Forms",
    switcherLabel: "Forms",
    tagline: "Formulaires, champs et réponses",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/forms",
    dashboardRoute: "/dashboard/forms",
  },
  review: {
    id: "review",
    label: "Review",
    switcherLabel: "Review",
    tagline: "Avis clients et avis par produit",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/review",
    dashboardRoute: "/dashboard/review",
  },
  /* 19/08/2026 (JP) : les quatre écrans de pilotage marketing quittent
     « Optimiser vos trackings » pour leur propre espace. */
  optimarketing: {
    id: "optimarketing",
    /* 30/08/2026 : visible dans le selecteur, non cliquable. Voir PACKS_OUVERTS. */
    comingSoon: true,
    label: "Optimiser votre marketing",
    switcherLabel: "Optimiser votre marketing",
    tagline: "Plan, conseils IA, budget publicitaire et relations presse",
    gradient: "rgb(225, 243, 197)",
    homeRoute: "/dashboard/marketing-home",
    dashboardRoute: "/dashboard/marketing-home",
  },
  /**
   * Arbitrage JP du 02/08 au soir : « Lystes Créa », c'est LE studio — celui
   * de la maquette portée (générateurs d'images et de vidéos, édition,
   * angles…), en espace noir. Le studio de publicités vidéo qui portait ce
   * nom jusqu'ici devient « Lystes UGC », ci-dessous.
   */
  crea: {
    id: "crea",
    /* 30/08/2026 : visible dans le selecteur, non cliquable. Voir PACKS_OUVERTS. */
    comingSoon: true,
    label: "Lystes Créa",
    switcherLabel: "Créer vos visuels IA",
    tagline: "Vous décrivez, vous obtenez une image ou une vidéo",
    gradient: "linear-gradient(135deg, #F97316 0%, #FBBF24 100%)",
    homeRoute: "/dashboard/creative/image-generator",
    dashboardRoute: "/dashboard/creative/image-generator",
  },
  spy: {
    id: "spy",
    /* 30/08/2026 : visible dans le selecteur, non cliquable. Voir PACKS_OUVERTS. */
    comingSoon: true,
    label: "Lystes Spy",
    switcherLabel: "Analyse vos concurrents",
    tagline: "Espionner les boutiques, leurs pubs et leur trafic",
    gradient: "linear-gradient(135deg, #18181b 0%, #52525b 100%)",
    homeRoute: "/dashboard/spy",
    dashboardRoute: "/dashboard/spy",
  },
  ugc: {
    id: "ugc",
    /* 30/08/2026 : visible dans le selecteur, non cliquable. Voir PACKS_OUVERTS. */
    comingSoon: true,
    label: "Lystes UGC",
    switcherLabel: "Créer des UGC IA",
    tagline: "Transformer un produit en publicité vidéo",
    gradient: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 60%, #22D3EE 100%)",
    homeRoute: "/dashboard/crea",
    dashboardRoute: "/dashboard/crea",
  },
};

/**
 * Espaces inclus pour TOUS les comptes pendant le lancement, quelle que soit
 * la valeur de `accounts.subscribed_packs` en base (les lignes existantes ne
 * connaissent pas ces packs : sans cette union, l'entrée du sélecteur est
 * rendue grise et inerte — constaté en prod le 02/08, compte
 * dreamvirginhair). Le jour où ces espaces deviendront payants, c'est le
 * chantier « Droits d'accès et offres » qui décide du mur, avec une montée
 * en gamme visible — jamais une entrée morte.
 */
export const PACKS_INCLUS_LANCEMENT: readonly PackId[] = ["savoir", "manager", "marketing", "optimarketing", "social", "influenceurs", "creative", "crea", "ugc", "spy"];

/**
 * Menus visibles dans TOUS les packs (transverses / "Configurer").
 * IDs alignés sur les `menuId` déclarés dans `AdminLayout.getNavSections`.
 */
export const SHARED_MENU_IDS: readonly string[] = [
  "dashboard",
  /* La feuille de route vit dans TOUS les espaces : une marchande demande une
     fonctionnalite depuis l ecran ou elle lui a manque, pas depuis un espace
     particulier. La ranger dans un seul l aurait rendue introuvable partout
     ailleurs (JP, 26/08/2026). */
  "feuille-de-route",
  /* Le guide vit dans TOUS les espaces : son contenu suit l'espace actif
     (JP, 21/08/2026). Le déclarer ici évite d'avoir à le répéter dans les
     cinq listes de PACK_MENUS, et d'en oublier une. */
  "guide",
  "installation",
  "integrations",
  "settings",
  "billing",
  "support",
  "profile",
  "notifications",
];

/**
 * Découpe validée avec l'équipe produit.
 * Un menuId peut appartenir à un seul pack (les transverses passent par SHARED_MENU_IDS).
 */
export const PACK_MENUS: Record<PackId, readonly string[]> = {
  /* 27/08/2026 (JP) : l espace n avait qu une entree, son propre accueil, donc
     sa laterale paraissait vide. Le catalogue le rejoint : c est ce qui prouve
     qu un site a vraiment envoye quelque chose. */
  compta: ["comptabilite"],
  boutiques: [
    "boutiques", "boutiques-produits", "boutiques-ventes", "boutiques-cures", "boutiques-connect",
    "boutiques-rapports", "boutiques-performance", "boutiques-top-produits",
    "boutiques-top-ventes", "boutiques-top-clients", "boutiques-paniers",
    "boutiques-conversion", "boutiques-visites", "boutiques-livraison", "boutiques-audit",
    /* 09/10/2026 : DIX ENTRÉES DE LA LATÉRALE NE S'AFFICHAIENT JAMAIS.
       AdminLayout (section VOS BOUTIQUES) déclare Catégories, Stocks, Vos
       clients, Paiements, Taxes, Codes promo, Avis clients, E-mails, Accès et
       rôles, Réglages boutique, avec leurs routes montées dans App.tsx. Leurs
       identifiants manquaient ici, et `isMenuInPack` filtre tout identifiant
       que l'espace actif ne réclame pas : dix écrans écrits, routés, et
       invisibles dans leur propre espace. Leur palier suit celui des voisins
       (tier-access.ts), sinon ils s'ouvriraient sans abonnement. */
    "boutiques-categories", "boutiques-stocks", "boutiques-clients", "boutiques-paiements",
    "boutiques-taxes", "boutiques-coupons", "boutiques-avis", "boutiques-emails",
    "boutiques-acces", "boutiques-reglages",
    /* LES DOUZE IDENTIFIANTS HERITES DE L'ANCIEN ESPACE « ventes » SONT
       PARTIS (31/08/2026, JP : « pourquoi Kaniwa est plein de e-commerce,
       ils ont zero donnee importee »).
       ═══════════════════════════════════════════════════════════════════════
       C'etaient : data-insights, performance, conversion, reports, orders,
       abandoned-carts, generated-sales, statistics, top-clients, top-products,
       customer-avatar, top-collaborators.

       Ils appartiennent a la section « ANALYSER VOS VENTES », dont toutes les
       entrees portent `hidden: true` : quelqu'un les avait volontairement
       masquees. Mais AdminLayout rallume un menu masque des que l'espace
       actif le reclame (la fonction `revele`, ecrite pour l'espace marketing
       qui se lisait comme vide). En les reclamant ici, cet espace rallumait
       donc huit entrees deja cachees.

       Et elles FONT DOUBLON : la section « VOS BOUTIQUES » porte deja ses
       propres Performance, Conversion, Commandes, Visites, Paniers
       abandonnes, Top clients et Top produits. Une marchande voyait vingt-deux
       entrees e-commerce la ou quatorze suffisent, sur un compte qui n'a
       jamais rien importe.

       Les pages restent joignables par leur adresse : rien n'est supprime,
       elles cessent seulement d'etre annoncees deux fois. */
  ],
  /* Les six ecrans de « Vendre plus ». L ordre suit le parcours d une cliente :
     elle voit un lot sur la fiche, un cadeau se debloque, elle arrive au
     panier, puis a la page de remerciement. La bibliotheque range les reglages
     deja ecrits, elle vient donc en dernier. */
  /* LES IDENTIFIANTS SONT CEUX D'AdminLayout, PAS DES NOMS RACCOURCIS.
     ═══════════════════════════════════════════════════════════════════════
     Mesure du 27/08/2026 : cette liste portait "cadeaux", "panier" et
     "bibliotheque", alors que `AdminLayout.getNavSections` declare
     "cadeaux-progressifs", "panier-offres" et "bibliotheque-lots"
     (l.480-484). `isMenuInPack` compare des chaines : trois des cinq entrees
     de « Vendre plus » etaient donc filtrees hors de leur PROPRE espace. La
     marchande qui ouvrait « Vendre plus » y voyait deux lignes sur cinq, et
     les trois autres n'existaient qu'a l'URL.
     "integrations-mcp" est dans le prefixe de route de ce pack : sans lui
     ici, ouvrir cette page rebasculait l'espace actif. */
  conversion: [
    /* 27/08/2026 (JP) : le tableau de bord de l espace, en PREMIERE ligne.
       C est la porte d entree, et la seule page qui reponde a « est-ce que mes
       lots marchent » : la liste, elle, repond a « qu est-ce que j ai cree ». */
    "vendre-plus",
    "lots",
    /* 27/08/2026 : le guide des lots. Sans lui ici, `isMenuInPack` le filtre
       hors de son PROPRE espace, exactement le defaut mesure le matin meme
       sur trois des cinq entrees de « Vendre plus ». */
    "guide-lots",
    "cadeaux-progressifs",
    "panier-offres",
    "post-achat",
    "bibliotheque-lots",
    "integrations-mcp",
  ],
  // Lystes Spy vit désormais entièrement DANS le SPA.
  spy: ["spy-home", "spy-brandtracker", "spy-shops", "spy-ads", "spy-advertisers", "spy-emails", "ad-inspiration"],
  agents: [
    // ACCUEIL
    "cowork",
    /* 30/08/2026 : le tableau de bord historique, sorti de /dashboard que
       Cowork occupe maintenant. */
    "activite",
    /* 13/10/2026 (JP) : l'accueil d'un compte Business (compte-business.ts).
       La latérale ne le crée que pour un Business. */
    "accueil-entreprise",
    /* 12/10/2026 (lot 8) : les ventes assistées par agent. */
    "ventes-assistees",
    /* 24/09/2026 : le guide d'installation, visible jusqu'à 100 %. */
    "mise-en-route",
    /* 11/09/2026 : les trois écrans du copilote n'en font plus qu'un. */
    "copilote",
    /* 02/10/2026 : la stratégie de la marque (Stratège). */
    "strategie",
    "expert-library",
    "mk-integrations",
    "creations",
    // SURVEILLER VOS MÉTRICS
    "historiques",
    "conversations",
    "contact-messages",
    "diagnostics",
    "tryons",
    "sections-vivantes",
    "stream",
    "equipe",
    "insights",
    /* 01/09/2026 (JP) : « et aussi leads ». Les mails captures se lisent au
       meme endroit que les conversations, les essayages et les
       preoccupations : ils sont la trace de la meme visite. */
    "leads",
    /* VENDRE PLUS, DEPLACE ICI LE 27/08/2026 (JP).
       ═══════════════════════════════════════════════════════════════════════
       « deplace ces liens de bundles ici a la place de ca : ANALYTICS / Leads
       captures ». Les six entrees vivaient dans l'espace « Vendre plus », que
       JP ferme dans la foulee : les deplacer AVANT de fermer evite de rendre
       les lots injoignables, alors que c'est la chose sur laquelle il
       travaille.

       « leads » sort en meme temps : c'est le « ANALYTICS / Leads captures »
       qu'il montre du doigt. La route reste ouverte, l'entree quitte la
       laterale. */
    "vendre-plus",
    "lots",
    "guide-lots",
    "cadeaux-progressifs",
    "panier-offres",
    "post-achat",
    "bibliotheque-lots",
    "integrations-mcp",
  ],
  savoir: [
    "cerveau",
    "mk-contexte",
    "catalog",
    "brand-knowledge",
    "knowledge-sources",
    "ephemeral-instructions",
  ],
  manager: [
    "cerveau",
    "my-team",
    // ÉQUIPE IA SITE WEB
    "brand-advisor",
    "specialists-conv",
    "voice-agent",
    "cadeaux-progressifs",
    /* 10/09/2026 (JP) : les six métiers de fiche produit ont quitté cet
       espace pour le leur. Leurs identifiants vivent désormais dans les
       espaces experts_produit, diagnostiqueurs, essayeurs, experts_avis,
       experts_seo et coachs_domicile. */
  ],
  experts_produit: [
    "products-conv", "experts-produit-guide", "experts-produit-activite",
    "experts-produit-conversations", "experts-produit-insights", "experts-produit-avatar",
    "experts-produit-sans-reponse",
  ],
  diagnostiqueurs: [
    "diagnostiqueurs-produit", "diagnostiqueurs-guide", "diagnostiqueurs-activite",
    "diagnostiqueurs-diagnostics", "diagnostiqueurs-insights", "diagnostiqueurs-avatar",
  ],
  essayeurs: [
    "essayeurs-produit", "essayeurs-guide", "essayeurs-activite", "essayeurs-essayages",
    "essayeurs-insights", "essayeurs-avatar",
  ],
  experts_avis: [
    "avis-produit", "experts-avis-guide", "experts-avis-activite", "experts-avis-avis",
    "experts-avis-insights", "experts-avis-avatar", "experts-avis-agence",
  ],
  managers_ugc: [
    "managers-ugc-annuaire", "managers-ugc-guide", "managers-ugc-activite",
  ],
  experts_seo: [
    "boost-produit", "experts-seo-guide", "experts-seo-activite", "experts-seo-optimisations",
    "experts-seo-insights", "experts-seo-avatar",
  ],
  coachs_domicile: [
    "postpurchase-conv", "coachs-domicile-guide", "coachs-domicile-activite",
    "coachs-domicile-conversations", "coachs-domicile-insights", "coachs-domicile-avatar",
  ],
  experts_geo: [
    "experts-geo-annuaire", "experts-geo-guide", "experts-geo-activite",
    "experts-geo-insights", "experts-geo-avatar",
  ],
  magazine_marque: [
    "magazine-marque-articles", "magazine-marque-apercu",
    "magazine-marque-equipes", "magazine-marque-calendrier",
  ],
  creative: [
    "brand-knowledge",
    "ai-photographers",
    "ai-graphistes",
    "ugc-creators",
    "ugc-library",
    "ugc-cosmetique",
    "ugc-perruques",
    "ugc-fashion",
    "ugc-sport",
    "ugc-bien-etre",
    "ugc-bijoux",
    "ugc-tech",
    "ugc-food",
    "ugc-library-vertical",
    "ads-creator",
    "mockup-creator",
    "creative-ugc-images",
    "studio-photo",
    "product-creator",
    "ugc-creator",
    "ugc-photographer",
    "magazine",
  ],
  marketing: [
    // Link Intelligence : multi-lien, influenceurs, campagnes.
    "link-intelligence",
    /* « Ma page publique » : venue de `manager` le 21/08/2026 (JP). L'espace
       s'appelle désormais « Créer vos liens », et cette page est le premier
       lien que le marchand crée. */
    "multi-link",
  ],
  booking: [
    "booking", "booking-espace", "booking-pipeline-config", "booking-equipe",
    "booking-calendar", "booking-clientes-espace", "booking-taches", "booking-paiements-clientes", "booking-tableau-closer", "booking-bookings", "booking-customers", "booking-services",
    "booking-agents", "booking-payments", "booking-invoices", "booking-coupons",
    "booking-addons", "booking-event-types", "booking-notifications",
    "booking-automations", "booking-integrations", "booking-reports", "booking-settings",
  ],
  formulaires: ["forms", "forms-fields", "forms-responses"],
  review: ["review", "review-products", "review-shop"],
  /* 11/09/2026 (JP) : « Retombées » sort de l'onglet caché du pilote.
     L'identifiant de menu et le préfixe de route se déplacent ENSEMBLE
     (voir la ligne des préfixes plus bas) : les séparer fait rebasculer
     l'espace actif tout seul à l'ouverture de la page. */
  social: ["social-pilote", "social-calendrier", "social-retombees", "social-reseaux"],
  /* 23/08/2026 (JP) : la recherche de créateurs, son propre espace — la
     découverte et le suivi des discussions ne sont pas de la publication. */
  influenceurs: ["influenceurs-trouver", "influenceurs-liste", "influenceurs-historique"],
  agences: ["agences-annuaire"],
  magazines: ["magazines-annuaire"],
  createurs_ugc: ["createurs-ugc-annuaire"],
  community_managers_ia: ["agence-communication-ia-annuaire", "community-managers-ia-annuaire", "community-managers-ia-retroplanning"],
  agences_marketing_ia: ["agences-marketing-ia-annuaire"],
  agences_seo_geo_ia: ["agences-seo-geo-ia-annuaire"],
  photographes_ia: ["photographes-ia-annuaire"],
  graphistes_ia: ["graphistes-ia-annuaire", "graphistes-plateforme"],
  optimarketing: ["marketing-plan", "marketing", "budget-simulator", "press-marketplace"],
  // Les outils du studio porté (menu validé par JP, hébergé par la latérale
  // du tableau de bord — « dashboard à gauche, outils studio dedans »).
  crea: [
    "creative-explore",
    "creative-enhancer",
    "creative-image-generator",
    "creative-video-generator",
    "creative-image-editing",
    "creative-angles",
    "creative-space-motion",
    "creative-video-upscaler",
    "creative-modele-photo",
  ],
  ugc: [
    "crea-studio",
    "crea-generations",
    "crea-favorites",
    "crea-product-link",
    "crea-ad-reference",
    "crea-projects",
    "crea-plateforme",
  ],
};

/**
 * True si le menu est visible pour le pack actif.
 * Un menuId sans configuration reste visible (fail-open) pour ne pas casser
 * l'UX pendant le rollout.
 */
export function isMenuInPack(menuId: string | undefined, pack: PackId): boolean {
  if (!menuId) return true;
  if (SHARED_MENU_IDS.includes(menuId)) return true;
  return PACK_MENUS[pack].includes(menuId);
}

/** Le pack propriétaire principal d'un menu (ou null si transverse/inconnu). */
export function ownerPackOf(menuId: string): PackId | null {
  if (SHARED_MENU_IDS.includes(menuId)) return null;
  for (const p of PACK_ORDER) {
    if (PACK_MENUS[p].includes(menuId)) return p;
  }
  return null;
}

/**
 * Résout l'espace propriétaire d'une URL du back-office.
 *
 * Cette table est volontairement ordonnée des routes les plus spécifiques vers
 * les plus générales. Elle évite notamment la collision entre `/crea` et
 * `/creative`, et garantit qu'un lien interne ou un rechargement restaure le
 * même espace que celui choisi dans le sélecteur.
 */
const PACK_ROUTE_PREFIXES: readonly [PackId, readonly string[]][] = [
  /* Les sites que Lystes construit. En tete parce que le prefixe est unique :
     aucune autre route ne commence par /dashboard/boutiques. */
  ["boutiques", [
    "/dashboard/boutiques", "/dashboard/data-insights", "/dashboard/performance",
    "/dashboard/conversion", "/dashboard/reports", "/dashboard/orders",
    "/dashboard/abandoned-carts", "/dashboard/generated-sales",
    "/dashboard/statistics", "/dashboard/top-clients", "/dashboard/top-products",
    "/dashboard/customer-avatar", "/dashboard/top-collaborators",
  ]],
  ["compta", ["/dashboard/comptabilite"]],
  ["crea", ["/dashboard/creative"]],
  ["ugc", ["/dashboard/crea"]],
  ["spy", ["/dashboard/spy", "/dashboard/ad-inspiration"]],
  ["marketing", [
    "/dashboard/links-data", "/dashboard/tracking/multi-link", "/dashboard/collaborations",
    "/dashboard/campaign-tracking",
    /* 21/08/2026 : suit « Ma page publique », passée dans cet espace. Sans ce
       déplacement, ouvrir la page depuis « Créer vos liens » rebasculait
       l'espace actif sur « Piloter vos agents » et la latérale changeait sous
       les pieds du marchand — le défaut « l'espace actif change tout seul ». */
    "/dashboard/multi-link",
    /* 04/09/2026 : FAQ IA, Blog IA et Pay IA prolongent la page publique,
       ils vivent dans le meme espace que le multi-lien. */
    "/dashboard/faq-ia", "/dashboard/blog-ia", "/dashboard/pay-ia",
    "/dashboard/social-shop-ia",
    /* 04/09/2026 : le devis instantané et son bilan suivent la page publique. */
    "/dashboard/devis-ia", "/dashboard/bilan-agent-ia",
  ]],
  ["booking", ["/dashboard/booking"]],
  ["formulaires", ["/dashboard/forms"]],
  ["review", ["/dashboard/review"]],
  /* 26/08/2026 : les modules de conversion ont leur propre espace, « Vendre
     plus ». Ces prefixes manquaient, et sans eux `homeRoute` du pack tombait
     sur « Piloter vos agents » : l'espace actif changeait sous les pieds de la
     marchande des qu'elle ouvrait ses lots, le defaut deja paye le 21/08. */
  ["conversion", [
    /* 27/08/2026 : le tableau de bord de l'espace. Il est aussi `homeRoute` :
       sans son prefixe ici, le sélecteur y déposerait la marchande et l'espace
       actif rebasculerait aussitôt sur « Piloter vos agents ». */
    "/dashboard/vendre-plus",
    "/dashboard/lots", "/dashboard/cadeaux", "/dashboard/panier",
    "/dashboard/post-achat", "/dashboard/bibliotheque", "/dashboard/integrations-mcp",
  ]],
  ["social", ["/dashboard/social", "/dashboard/social/calendrier", "/dashboard/social/retombees", "/dashboard/social/reseaux"]],
  ["influenceurs", ["/dashboard/influenceurs", "/dashboard/influenceurs/liste", "/dashboard/influenceurs/historique"]],
  ["agences", ["/dashboard/agences"]],
  ["magazines", ["/dashboard/magazines"]],
  ["createurs_ugc", ["/dashboard/createurs-ugc"]],
  /* Les deux lignes bougent ENSEMBLE. Déclarer le menu sans son préfixe de
     route fait rebasculer l'espace actif tout seul à l'ouverture de la page :
     la latérale change sous les pieds de la marchande, sans erreur. */
  ["community_managers_ia", ["/dashboard/agence-communication-ia", "/dashboard/community-managers-ia", "/dashboard/retroplanning"]],
  ["agences_marketing_ia", ["/dashboard/agences-marketing-ia"]],
  ["agences_seo_geo_ia", ["/dashboard/agences-seo-geo-ia"]],
  ["photographes_ia", ["/dashboard/photographes-ia"]],
  ["graphistes_ia", ["/dashboard/graphistes-ia"]],
  ["optimarketing", [
    "/dashboard/marketing-home", "/dashboard/marketing-plan", "/dashboard/marketing",
    "/dashboard/budget-simulator", "/dashboard/press-marketplace",
  ]],
  ["creative", [
    "/dashboard/creative-home", "/dashboard/ai-photographers", "/dashboard/ai-graphistes",
    "/dashboard/ugc-creators", "/dashboard/ugc-library", "/dashboard/veille-ugc",
    "/dashboard/ads-creator", "/dashboard/mockup-creator", "/dashboard/creative-ugc-images",
    "/dashboard/studio-photo", "/dashboard/product-creator", "/dashboard/ugc-creator",
    "/dashboard/ugc-photographer", "/dashboard/magazine",
  ]],
  ["savoir", [
    "/dashboard/savoir", "/dashboard/catalog", "/dashboard/brand-knowledge",
    "/dashboard/knowledge", "/dashboard/ephemeral-instructions", "/dashboard/mk/contexte",
  ]],
  /* 30/08/2026 : Cowork prend /dashboard. Le tableau de bord historique garde
     une URL propre, et cet espace doit la revendiquer. */
  ["agents", ["/dashboard/activite", "/dashboard/entreprise", "/dashboard/ventes-assistees", "/dashboard/mise-en-route", "/dashboard/copilote", "/dashboard/strategie", "/dashboard/orchestrateur", "/dashboard/plan-action", "/dashboard/taches"]],
  /* 10/09/2026 (JP) : les six métiers de fiche produit AVANT « manager ».
     Le résolveur prend le premier préfixe qui colle ; laissés derrière, ces
     six chemins auraient continué d'ouvrir la latérale de « manager ». */
  ["experts_produit", ["/dashboard/experts-produit"]],
  ["diagnostiqueurs", ["/dashboard/diagnostiqueurs"]],
  ["essayeurs", ["/dashboard/essayeurs"]],
  ["experts_avis", ["/dashboard/experts-avis"]],
  ["managers_ugc", ["/dashboard/managers-ugc"]],
  ["experts_seo", ["/dashboard/boost-produit"]],
  ["coachs_domicile", ["/dashboard/coach-domicile"]],
  ["experts_geo", ["/dashboard/experts-geo"]],
  ["magazine_marque", ["/dashboard/magazine-marque"]],
  ["manager", [
    "/dashboard/manager", "/dashboard/agents", "/dashboard/my-team", "/dashboard/cerveau",
    "/dashboard/booking",
  ]],
];

export function packForDashboardPath(pathname: string): PackId | null {
  for (const [pack, prefixes] of PACK_ROUTE_PREFIXES) {
    if (prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      return pack;
    }
  }
  return pathname === "/dashboard" ? "agents" : null;
}

/* ─────────────────────────────────────────────────────────────────────────
   Rester dans Cowork (JP, 01/09/2026).

   Les liens rapides et la navigation haute de Cowork (Cerveau, Organigramme,
   Équipe IA) pointent vers des pages que d'autres espaces revendiquent :
   cliquer dessus faisait basculer la latérale sur « Piloter vos agents » ou
   « Manager », et le marchand perdait son historique de conversations.
   Ces adresses restent donc rattachées à Cowork : même latérale, même
   navigation en haut à droite, quel que soit le chemin d'arrivée.
   ───────────────────────────────────────────────────────────────────────── */
export const ROUTES_COWORK: readonly string[] = [
  "/dashboard",
  "/dashboard/activite",
  /* 13/10/2026 : l'accueil Business, au même titre que l'activité. */
  "/dashboard/entreprise",
  "/dashboard/ventes-assistees",
  "/dashboard/copilote",
  "/dashboard/strategie",
  "/dashboard/orchestrateur",
  "/dashboard/plan-action",
  "/dashboard/taches",
  "/dashboard/guide",
  "/dashboard/cerveau",
  "/dashboard/conversations",
  "/dashboard/contact-messages",
  "/dashboard/diagnostics",
  "/dashboard/tryons",
  "/dashboard/insights",
  "/dashboard/leads",
  "/dashboard/my-team",
  "/dashboard/agents",
  /* 10/09/2026 (JP) : « /dashboard/boost-produit » quitte Cowork — les
     Experts SEO ont leur espace et leur latérale. */
  /* 04/09/2026 (JP) : « Marketing IA » vit dans Cowork, pas dans un espace.
     Ces adresses gardent donc la latérale Cowork au lieu de rebasculer sur
     l'ancien espace « Optimiser votre marketing ». */
  "/dashboard/marketing-home",
  "/dashboard/marketing-plan",
  "/dashboard/marketing",
  "/dashboard/budget-simulator",
  "/dashboard/press-marketplace",
  /* 04/09/2026 (JP) : « toutes les pages et sous-pages du menu Cowork doivent
     rester sur Cowork sans changer d'espace ». « Mémoire agents IA » ouvre le
     catalogue, la marque, les documents et les consignes éphémères — des
     adresses que l'espace « savoir » revendique ; « Instructions agents IA »
     ouvre les réglages. Sans ces lignes, un clic dans la latérale Cowork
     rebasculait l'espace actif et la latérale changeait sous les pieds du
     marchand. */
  "/dashboard/catalog",
  "/dashboard/brand-knowledge",
  "/dashboard/knowledge",
  "/dashboard/ephemeral-instructions",
  "/dashboard/mk/contexte",
  "/dashboard/settings",
];

export function estRouteCowork(pathname: string): boolean {
  /* « /dashboard » ne vaut que pour lui-même : le traiter comme un préfixe
     rendait TOUT le back-office « Cowork », si bien que la latérale de chaque
     espace (Produire vos visuels, Créer vos liens…) disparaissait au profit
     des liens rapides de Cowork (constaté par JP le 01/09/2026). */
  return ROUTES_COWORK.some((r) =>
    r === "/dashboard" ? pathname === r : pathname === r || pathname.startsWith(`${r}/`),
  );
}


/* ESPACES QUI DÉPENDENT DU CATALOGUE (JP, 26/09/2026).
   Une boutique de perruques fait essayer, elle ne diagnostique pas ; une
   maison de soin diagnostique, elle ne fait rien essayer. Proposer les deux
   partout affichait un espace vide à moitié des comptes — Dream Virgin Hair
   voyait « Diagnostiqueurs » sans un seul diagnostic, Sylla Paris voyait
   « Essayeurs » sans un seul essayage.
   La règle vit ICI, à côté des espaces, et non recopiée dans chaque menu :
   c'est la cause, pas la page. Elle s'appuie sur les mêmes drapeaux de secteur
   que la latérale (`hasDiagnostic`, `hasTryOn`), jamais sur un comptage. */
export function packsSelonSecteur(
  packs: PackId[],
  secteur: { hasDiagnostic: boolean; hasTryOn: boolean; isLoading?: boolean },
): PackId[] {
  /* Tant que le secteur n'est pas lu, on ne retire rien : masquer d'abord puis
     réafficher ferait clignoter le menu. */
  if (secteur.isLoading) return packs;
  return packs.filter((p) => {
    if (p === "diagnostiqueurs") return secteur.hasDiagnostic;
    if (p === "essayeurs") return secteur.hasTryOn;
    return true;
  });
}
