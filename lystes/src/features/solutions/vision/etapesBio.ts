import { BadgeCheck, Leaf, ShieldCheck, PackageX, FileText, Image as IconeImage, Newspaper, Package, PenTool, ScanSearch, Star, Store, Truck, Bot, type LucideIcon } from "lucide-react";
import ecrin from "@lystes/assets/magazines/ecrin.jpg.asset.json";
import brume from "@lystes/assets/magazines/brume.jpg.asset.json";
import boutiqueKaniwa from "@lystes/assets/bio/ecommerce-step.png";

/**
 * Les étapes de création de marque de /bio (JP, 13/10/2026), dans la section
 * des étages de l'accueil (VisionEtages, secteur « bio ») : même en-tête,
 * mêmes onglets, même liste numérotée, même carrousel sur téléphone. Seul le
 * contenu change. Les titres des onglets restent courts : les cinq tiennent
 * dans la pilule, comme ceux de l’accueil.
 *
 * Visuels : uniquement des photos et des vidéos réelles, du dépôt ou
 * fournies par JP, aucune image générée, aucune deux fois sur la page. Une
 * étape sans visuel garde celui de l'étape d'avant ; une étape de type
 * « diapos » fait défiler les siens.
 *  - grille de sélection : packshots du catalogue (public/bio-selection) ;
 *  - fiche INCI : la bergamote et la vraie liste INCI d'un produit ;
 *  - logo et branding : la planche NURA skincare ;
 *  - packaging : quatre photos Cléa Skincare (public/bio-packaging) ;
 *  - envoi : les colis reçus par nos clientes, repris de /biolystes/rdv
 *    (Amarsi, 235th, Jolie Peau) et le colis Éclose ;
 *  - ecommerce-step : la boutique Kaniwa Botanique ;
 *  - fiche : la fiche de démonstration de l'accueil (public/demo-eclose) ;
 *  - feed : le feed Sevmylook de biolystes.com/agence ;
 *  - validation : les produits Lystes & Partners (public/bio-validation) ;
 *  - ecrin et brume : deux magazines beauté du réseau.
 * Jamais le mot « échantillons » (JP, 13/10 : « on vous envoie les produits »).
 * La boutique de démonstration Lystes & Partners n'existe pas en image dans
 * le dépôt : l'onglet E-commerce montre la vraie boutique Kaniwa Botanique.
 */

/* Un produit de la grille de sélection : `valide` reçoit le badge. */
export type ProduitGrille = { image: string; nom: string; valide?: boolean };

/* La fiche INCI posée sur la photo d'un ingrédient (type « inci »). */
export type CarteInci = { photo: string; produit: string; inci: string; surligne: string };

export type MediaEtape = {
  type: "image" | "video" | "grille" | "inci" | "diapos" | "fiche";
  /* Type « grille » : le nombre de colonnes (3 par défaut). */
  colonnes?: number;
  /* Type « diapos » : plusieurs visuels qui défilent, chacun sa légende ;
     `trio` : trois à la fois sur ordinateur, la légende d'ensemble, et le
     nom de chaque visuel écrit dessus. */
  trio?: boolean;
  diapos?: readonly MediaEtape[];
  intervalle?: number;
  src: string;
  /* L'affiche d'une vidéo. */
  affiche?: string;
  /* Type « inci » : la carte posée sur la photo (et, si `src`, une vidéo avant). */
  carte?: CarteInci;
  /* La grille de sélection (type « grille ») : trois produits par rangée. */
  produits?: readonly ProduitGrille[];
  /* Le cadrage dans le cadre (object-position). */
  position?: string;
  /* La légende sous le visuel : la partie en gras, puis la suite. */
  legende: readonly [string, string];
};

export type EtapeBio = {
  nom: string;
  /* La ligne courte de la liste. */
  mission: string;
  /* Le texte de l'encart, sur téléphone. */
  role: string;
  unique: string;
  media?: MediaEtape;
  /* Durée de l'étape, quand elle a deux diapositives (ms). */
  duree?: number;
};

export type OngletBio = {
  id: string;
  titre: string;
  court: string;
  etage: string;
  benefices: readonly (readonly [LucideIcon, string])[];
  accroche: string;
  etapes: EtapeBio[];
};

/* L'en-tête de la section : la phrase-choc, un seul paragraphe centré comme
   sur l'accueil (le texte de JP, mot pour mot ; seuls les apostrophes et les
   insécables sont posés), puis les trois points en carrousel d'une ligne
   (JP, 13/10/2026 : moins de texte). « En moyenne » dans le titre : demandé
   par JP le 13/10. Les « sans » et les certifications des points sont ceux
   que /bio affiche déjà (section « Nos engagements »). */
export const ENTETE_BIO = {
  probleme: ["Lancer une gamme cosmétique prend en moyenne ", "près d’un an", "."] as const,
  texte:
    "Le temps perdu ne se rattrape jamais. Pendant ces 12 mois d’attente, vous ne bâtissez rien\u00a0: ni\u00a0réputation, ni\u00a0communauté, ni\u00a0preuve sociale. " +
    "Le plus grand handicap d’une jeune marque est son manque d’antériorité. Lorsque vous vous lancez enfin, les débuts sont laborieux faute d’historique, ce qui freine considérablement votre progression. " +
    "Avec Biolystes, changez la donne\u00a0: votre marque est opérationnelle en seulement 10\u00a0jours.",
  /* Une ligne chacun à 375 px, une icône au trait devant. */
  icones: [Leaf, ShieldCheck, PackageX] as LucideIcon[],
  points: [
    "Bio et végan, sans parabènes ni silicones",
    "Certifié COSMOS, ECOCERT, ISO\u00a022716",
    "Aucun stock, aucun minimum de commande",
  ],
};

/* La grille de l'étape « Sélection des produits » (JP, 13/10/2026) : des
   produits réels du catalogue, packshots nettoyés sur fond blanc
   (product-images/clean-products, réduits dans public/bio-selection), noms
   exacts du catalogue raccourcis. Aucun ne reprend la grille du catalogue ni
   la conversation animée de /bio. Les produits retenus reçoivent le badge,
   les autres restent tels quels. */
/* Chemins écrits en entier : sync.py (biolystes.com) ne recopie que les
   fichiers publics cités tels quels. */
const GRILLE_SELECTION: ProduitGrille[] = [
  { image: "/bio-selection/brume-visage-prebiotique-microbiome.webp", nom: "Brume prébiotique", valide: true },
  { image: "/bio-selection/creme-contour-des-yeux-apaisante.webp", nom: "Contour des yeux" },
  { image: "/bio-selection/creme-riche-nourrissante.webp", nom: "Crème riche", valide: true },
  { image: "/bio-selection/gel-hydratant-a-la-niacinamide.webp", nom: "Gel niacinamide", valide: true },
  { image: "/bio-selection/huile-visage-tout-en-un.webp", nom: "Huile tout-en-un" },
  { image: "/bio-selection/mousse-nettoyante.webp", nom: "Mousse nettoyante", valide: true },
];

/* La fiche INCI (JP, 13/10/2026) : sa photo de bergamote, sans vidéo avant
   (retirée à sa demande le 13/10), avec une carte
   blanche : la vraie liste INCI d'un produit du catalogue qui en contient,
   le Shampooing volumateur à la kératine (products.ts, champ inci, recopié
   tel quel jusqu'aux notes ➀➁➂). Citrus Aurantium Bergamia Peel Oil est
   surligné. */
const INCI_SHAMPOOING =
  "Aqua/Water, Lauryl Glucoside, Sodium Coco-Sulfate, Cantharellus Cibarius (Chanterelle) Extract, Glycerin, Citric Acid, Disodium Cocoyl Glutamate, PCA Glyceryl Oleate, Sodium PCA, Zinc PCA, Coco-Glucoside, Glyceryl Oleate, Parfum/Fragrance, Sodium Chloride, Caffeine, Benzyl Alcohol, Sodium Cocoyl Glutamate, Sodium Benzoate, Potassium Sorbate, Hydrolyzed Keratin, Leuconostoc/Radish Root Ferment Filtrate, Rosmarinus Officinalis Leaf Oil, Mentha Piperita Oil, Menthol, Limonene, Camphor, Citrus Aurantium Bergamia Peel Oil, Pinene";
const FICHE_INCI: MediaEtape = {
  type: "inci",
  src: "",
  legende: ["La fiche INCI", ", ingrédient par ingrédient"],
  carte: {
    photo: "/bio-selection/bergamote.webp",
    produit: "Shampooing volumateur à la kératine",
    inci: INCI_SHAMPOOING,
    surligne: "Citrus Aurantium Bergamia Peel Oil",
  },
};

const PHOTO = (src: string, legende: readonly [string, string], position?: string): MediaEtape => ({ type: "image", src, legende, position });

export const ONGLETS_BIO: OngletBio[] = [
  {
    id: "bio-selection",
    titre: "Sélection",
    court: "Produits",
    etage: "Étape 1 · Sélection des produits",
    /* L'envoi n'est traité que dans l'onglet Envoi (JP, 13/10/2026). */
    benefices: [[ScanSearch, "Des produits choisis pour votre projet"], [FileText, "La fiche INCI de chaque produit"]],
    accroche: "Une gamme choisie pour votre projet.",
    etapes: [
      {
        nom: "Sélection des produits",
        mission: "les produits du catalogue adaptés à votre projet",
        role: "Nous sélectionnons dans le catalogue les produits adaptés à votre projet, à votre clientèle et à votre positionnement.",
        unique: "",
        media: { type: "grille", src: "", produits: GRILLE_SELECTION, legende: ["Votre sélection", ", validée produit par produit"] },
      },
      {
        nom: "Fiche INCI",
        mission: "la liste des ingrédients de chaque produit",
        role: "Nous vous envoyons la fiche INCI de chaque produit retenu : la liste complète de ses ingrédients.",
        unique: "",
        media: FICHE_INCI,
      },
    ],
  },
  {
    id: "bio-branding",
    titre: "Logo et branding",
    court: "Logo",
    etage: "Étape 2 · Logo et branding",
    benefices: [[PenTool, "Votre logo et votre branding"], [Package, "Le design du packaging"]],
    accroche: "Une identité qui vous ressemble.",
    etapes: [
      {
        /* Logo et branding réunis (JP, 13/10/2026) ; le diptyque Skin
           Atelier est retiré. La planche de marque NURA skincare, recomposée
           à l'horizontale sans rien couper : logo, monogramme, photo, deux
           déclinaisons, palette de six couleurs. */
        nom: "Logo et branding",
        mission: "votre logo, créé ou modernisé, et votre palette",
        role: "Nous dessinons votre logo, ou nous modernisons celui que vous avez déjà, et nous composons votre palette et vos motifs.",
        unique: "",
        media: PHOTO("/bio-selection/planche-marque-nura.webp", ["NURA skincare", ", la palette et les déclinaisons"], "50% 50%"),
      },
      {
        nom: "Design du packaging",
        mission: "l’étui et l’étiquette de chaque produit, à vos couleurs",
        role: "Nous dessinons le packaging de chaque produit : l’étui et l’étiquette, à vos couleurs.",
        unique: "",
        /* Les photos Cléa Skincare fournies par JP (13/10/2026) : trois à la
           fois sur ordinateur, une et demie sur téléphone ; elles avancent
           d'une à la fois, la salle de bain en dernier. */
        media: { type: "diapos", src: "", trio: true, intervalle: 3000, legende: ["Cléa Skincare", ", le packaging de la gamme"], diapos: [
          PHOTO("/bio-packaging/clea-mise-en-scene.webp", ["", ""], "50% 55%"),
          PHOTO("/bio-packaging/clea-etui-flacon.webp", ["", ""], "50% 45%"),
          PHOTO("/bio-packaging/clea-contour-yeux.webp", ["", ""], "50% 50%"),
          PHOTO("/bio-packaging/clea-salle-de-bain.webp", ["", ""], "50% 60%"),
        ] },
        duree: 9000,
      },
    ],
  },
  {
    id: "bio-envoi",
    titre: "Envoi",
    court: "Envoi",
    etage: "Étape 3 · Envoi des produits",
    benefices: [[Truck, "Vos produits livrés chez vous"], [Star, "Testés par vous, avant le lancement"], [BadgeCheck, "Validés ensemble"]],
    accroche: "Vos produits testés avant le lancement.",
    etapes: [
      {
        nom: "Envoi des produits",
        mission: "vos produits livrés, pour les tester",
        role: "Nous vous envoyons vos produits, pour que vous les testiez avant le lancement.",
        unique: "",
        /* Les colis reçus par nos clientes (JP, 13/10/2026), au même
           réglage que le packaging. Seuls les visuels nets : photos de
           /biolystes/rdv (Amarsi, 235th, Jolie Peau) et le colis Éclose
           recadré, tous en 3:4 sans couper le produit. Les vidéos Sevmylook
           et Wirtzkin (480 px, molles) sont retirées. La marque est écrite
           sur chaque photo. */
        media: { type: "diapos", src: "", trio: true, intervalle: 3000, legende: ["Les colis reçus", " par nos clientes"], diapos: [
          PHOTO("/bio-colis/eclose-colis-45.webp", ["Éclose Paris", ""], "50% 50%"),
          PHOTO("/bio-colis/amarsi-colis.webp", ["Amarsi", ""], "50% 50%"),
          PHOTO("/bio-colis/235th-colis-45.webp", ["235th", ""], "50% 50%"),
          PHOTO("/bio-colis/jolie-peau-colis.webp", ["Jolie Peau", ""], "50% 50%"),
        ] },
        duree: 9000,
      },
      {
        nom: "Validation des produits",
        mission: "les produits définitifs, validés après vos tests",
        role: "Après vos tests, nous validons avec vous les produits définitifs de votre gamme.",
        unique: "",
        /* La même grille que l'étape Sélection, avec les produits finis à la
           marque de démonstration Lystes & Partners (photos du 11/10/2026,
           ~/Documents/lystes_ai/photos-clients/lystes/2026-10-11-demo-produits-lystes,
           packshots de la boutique). Cinq produits différents seulement
           (huile, nettoyant, concentré AHA, gommage, crème lissante ; le
           coffret est un assemblage) : grille de quatre, deux par rangée. */
        media: { type: "grille", src: "", colonnes: 2, produits: [
          { image: "/bio-validation/huile-omega.webp", nom: "Huile Oméga 6-9", valide: true },
          { image: "/bio-validation/nettoyant-doux.webp", nom: "Nettoyant doux", valide: true },
          { image: "/bio-validation/concentre-aha.webp", nom: "Concentré AHA", valide: true },
          { image: "/bio-validation/exfoliant-volcanique.webp", nom: "Exfoliant volcanique", valide: true },
        ], legende: ["Lystes & Partners", ", vos produits validés"] },
      },
    ],
  },
  {
    id: "bio-ecommerce",
    titre: "E-commerce",
    court: "Site",
    etage: "Étape 4 · E-commerce",
    /* Le feed Instagram n'est plus ici (JP, 13/10 : « ça n'a rien à faire
       là-bas ») : il est traité dans l'onglet Communication. */
    benefices: [[Store, "Votre boutique en ligne"], [Bot, "Une suite d’agents IA"]],
    accroche: "Une boutique prête à vendre.",
    etapes: [
      {
        nom: "Votre boutique",
        mission: "une boutique en ligne à votre marque",
        role: "Nous créons votre boutique en ligne, à votre marque, avec vos produits et vos photos.",
        unique: "",
        media: PHOTO(boutiqueKaniwa, ["Kaniwa Botanique", ", la boutique en ligne"], "50% 0%"),
      },
      {
        nom: "Suite d’agents IA",
        mission: "des agents IA qui répondent à vos clientes, jour et nuit",
        role: "Nous installons notre suite d’agents IA : sur chaque fiche produit, ils répondent à vos clientes jour et nuit, les conseillent et lèvent leurs doutes avant l’achat.",
        unique: "",
        /* La fiche de démonstration de l'onglet « Vos produits » de
           l'accueil (public/demo-eclose), la même, montée en iframe : photo
           de l'huile Lystes & Partners, chat où la conversation se joue,
           diagnostic, « Pourquoi acheter ce soin ? », avis, questions,
           actualités et communauté UGC. */
        media: { type: "fiche", src: "/demo-eclose/index.html", legende: ["L’expert produit IA", ", sur la fiche de votre marque"] },
      },
    ],
  },
  {
    id: "bio-communication",
    titre: "Communication",
    court: "Communication",
    etage: "Étape 5 · Communication",
    benefices: [[IconeImage, "Votre feed Instagram"], [Newspaper, "Des articles de presse"], [Star, "Vos avis visibles sur Google"]],
    accroche: "Une marque visible dès son lancement.",
    etapes: [
      {
        nom: "Feed Instagram",
        mission: "vos publications, prêtes à poster",
        role: "Votre feed Instagram : des publications à vos couleurs, prêtes à poster.",
        unique: "",
        /* Le feed réalisé pour Sevmylook, montré sur biolystes.com/agence
           (biolystes, src/assets/agence-reseaux.jpg) : ses deux premières
           rangées, sans retouche. */
        media: PHOTO("/bio-communication/feed-instagram-sevmylook.webp", ["Sevmylook", ", le feed Instagram"], "50% 50%"),
      },
      {
        nom: "Articles de presse",
        mission: "votre marque dans des magazines beauté",
        role: "Des articles de presse sur votre marque, dans des magazines beauté : qui tape son nom sur Google trouve de vrais articles.",
        unique: "",
        media: PHOTO(ecrin.url, ["Écrin", ", un magazine beauté du réseau"], "50% 0%"),
      },
      {
        nom: "Plateforme d’avis",
        mission: "les avis de vos clientes, avec vos étoiles sur Google",
        role: "Notre plateforme d’avis recueille les avis de vos clientes, produit par produit, et vos étoiles apparaissent sur Google.",
        unique: "",
      },
      {
        nom: "Mag IA",
        mission: "des articles qui amènent des clientes sur votre boutique",
        role: "Le mag IA publie des articles nés des questions de vos clientes, écrits pour Google et pour ChatGPT, avec des boutons qui mènent à l’achat.",
        unique: "",
        media: PHOTO(brume.url, ["Brume", ", un magazine beauté du réseau"], "50% 0%"),
      },
      {
        nom: "Multilien",
        mission: "un seul lien dans votre bio, vers le bon produit",
        role: "Notre multilien : un seul lien dans votre bio Instagram, avec un conseiller IA qui oriente chaque visiteuse vers le bon produit.",
        unique: "",
      },
    ],
  },
];
