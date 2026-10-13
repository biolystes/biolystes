import { BadgeCheck, Leaf, ShieldCheck, PackageX, FileText, Image as IconeImage, Newspaper, Package, Palette, PenTool, ScanSearch, Star, Store, Truck, Bot, type LucideIcon } from "lucide-react";
import showcase1 from "@lystes/assets/showcase-1.mp4.asset.json";
import showcase2 from "@lystes/assets/showcase-2.mp4.asset.json";
import showcasePeau from "@lystes/assets/showcase-peau.jpg.asset.json";
import kaniwaSerum from "@lystes/assets/kaniwa-serum.webp.asset.json";
import chatFiche from "@lystes/assets/chat.mov.asset.json";
import ecrin from "@lystes/assets/magazines/ecrin.jpg.asset.json";
import brume from "@lystes/assets/magazines/brume.jpg.asset.json";
import designPackaging from "@lystes/assets/bio/design-packaging-step.jpg";
import boutiqueKaniwa from "@lystes/assets/bio/ecommerce-step.png";

/**
 * Les étapes de création de marque de /bio (JP, 13/10/2026), dans la section
 * des étages de l'accueil (VisionEtages, secteur « bio ») : même en-tête,
 * mêmes onglets, même liste numérotée, même carrousel sur téléphone. Seul le
 * contenu change. Les titres des onglets restent courts : les cinq tiennent
 * dans la pilule, comme ceux de l’accueil.
 *
 * Visuels : uniquement des photos et des vidéos réelles déjà dans le dépôt,
 * aucune image générée, aucune deux fois sur la page. Une étape sans visuel
 * garde celui de l'étape d'avant.
 *  - showcase-1 et showcase-2 : les vraies vidéos des produits reçus,
 *    Wirtzkin et Sevmylook ;
 *  - showcase-peau : les produits d'une marque, étiquetés ;
 * Jamais le mot « échantillons » (JP, 13/10 : « on vous envoie les produits »).
 *  - design-packaging-step et kaniwa-serum : le packaging Kaniwa
 *    Botanique, l'étui et le packshot ;
 *  - ecommerce-step : la boutique Kaniwa Botanique ;
 *  - chat.mov : l'agent IA qui répond sur une fiche produit Kaniwa ;
 *  - publicite-social.mov : une publication carrée, au format du feed ;
 *  - ecrin et brume : deux magazines beauté du réseau.
 * La boutique de démonstration Lystes & Partners n'existe pas en image dans
 * le dépôt : l'onglet E-commerce montre la vraie boutique Kaniwa Botanique.
 */

export type MediaEtape = {
  type: "image" | "video";
  src: string;
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

/* L'en-tête de la section : la phrase-choc, les paragraphes, puis les trois
   points, à plat. Aucun chiffre sourcé n'existe sur la durée d'un lancement :
   « souvent », jamais « en moyenne ». Les « sans » et les certifications sont
   ceux que /bio affiche déjà (section « Nos engagements »). */
export const ENTETE_BIO = {
  probleme: ["Lancer une gamme cosmétique prend souvent ", "près d’un an", "."] as const,
  paragraphes: [
    "Ce temps-là ne se rattrape pas. Pendant cette année, vous ne construisez ni\u00a0réputation, ni\u00a0communauté, ni\u00a0retours clients, ni\u00a0notoriété.",
    "Le plus gros défaut d’une jeune marque, c’est sa jeunesse : elle manque de recul. Mieux vaut commencer tôt.",
    "Avec Biolystes, votre marque est en place en 10 jours :",
  ],
  /* Une icône au trait devant chaque point, comme les listes d'étapes. */
  icones: [Leaf, ShieldCheck, PackageX] as LucideIcon[],
  points: [
    "une formulation bio et végane, sans parabènes, sans silicones et sans PEG",
    "des certifications reconnues : COSMOS, ECOCERT, ISO 22716, enregistrement CPNP",
    "aucun stock à acheter, aucun minimum de commande",
  ],
};

const VIDEO = (src: string, legende: readonly [string, string], position?: string): MediaEtape => ({ type: "video", src, legende, position });
const PHOTO = (src: string, legende: readonly [string, string], position?: string): MediaEtape => ({ type: "image", src, legende, position });

export const ONGLETS_BIO: OngletBio[] = [
  {
    id: "bio-selection",
    titre: "Sélection",
    court: "Produits",
    etage: "Étape 1 · Sélection des produits",
    benefices: [[ScanSearch, "Des produits choisis pour votre projet"], [FileText, "La fiche INCI de chaque produit"], [Package, "Vos produits envoyés chez vous"]],
    accroche: "Une gamme choisie pour votre projet.",
    etapes: [
      {
        nom: "Sélection des produits",
        mission: "les produits du catalogue adaptés à votre projet",
        role: "Nous sélectionnons dans le catalogue les produits adaptés à votre projet, à votre clientèle et à votre positionnement.",
        unique: "",
        media: PHOTO(showcasePeau.url, ["Des produits", ", étiquetés un par un"], "50% 50%"),
      },
      {
        nom: "Fiche INCI",
        mission: "la liste des ingrédients de chaque produit",
        role: "Nous vous envoyons la fiche INCI de chaque produit retenu : la liste complète de ses ingrédients.",
        unique: "",
      },
      {
        nom: "Envoi à votre adresse",
        mission: "les produits sélectionnés arrivent chez vous",
        role: "Nous envoyons les produits sélectionnés à votre adresse, pour que vous les voyiez et les essayiez.",
        unique: "",
        media: VIDEO(showcase1.url, ["Wirtzkin", ", les produits reçus"]),
      },
    ],
  },
  {
    id: "bio-branding",
    titre: "Logo et branding",
    court: "Logo",
    etage: "Étape 2 · Logo et branding",
    benefices: [[PenTool, "Votre logo, créé ou modernisé"], [Palette, "Une palette et des motifs"], [Package, "Vos produits dessinés"]],
    accroche: "Une identité qui vous ressemble.",
    etapes: [
      {
        nom: "Votre logo",
        mission: "un logo dessiné, ou celui qui existe modernisé",
        role: "Nous dessinons votre logo, ou nous modernisons celui que vous avez déjà.",
        unique: "",
        media: PHOTO(designPackaging, ["Kaniwa Botanique", ", le logo et les motifs"], "50% 40%"),
      },
      {
        nom: "Votre branding",
        mission: "la palette de couleurs et les motifs de la marque",
        role: "Nous composons votre branding : la palette de couleurs et les motifs qui feront reconnaître votre marque.",
        unique: "",
      },
      {
        nom: "Vos produits dessinés",
        mission: "chaque flacon et chaque étui à vos couleurs",
        role: "Nous dessinons vos produits : chaque flacon et chaque étui reçoit votre logo et votre univers.",
        unique: "",
        media: PHOTO(kaniwaSerum.url, ["Kaniwa Botanique", ", le flacon et son étui"], "50% 55%"),
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
        media: VIDEO(showcase2.url, ["Sevmylook", ", le coffret reçu"]),
      },
      {
        nom: "Validation des produits",
        mission: "les produits définitifs, validés après vos tests",
        role: "Après vos tests, nous validons avec vous les produits définitifs de votre gamme.",
        unique: "",
      },
    ],
  },
  {
    id: "bio-ecommerce",
    titre: "E-commerce",
    court: "Site",
    etage: "Étape 4 · E-commerce",
    benefices: [[Store, "Votre boutique en ligne"], [Bot, "Une suite d’agents IA"], [IconeImage, "Un feed Instagram de départ"]],
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
        media: VIDEO(chatFiche.url, ["L’expert produit IA", ", sur une fiche Kaniwa Botanique"], "50% 0%"),
      },
      {
        nom: "Feed Instagram",
        mission: "un feed prêt à publier, pour bien démarrer",
        role: "Nous vous fournissons un feed Instagram prêt à publier, pour que votre compte ne démarre pas vide.",
        unique: "",
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
        media: VIDEO("/videos/publicite-social.mov", ["Une publication", ", au format du feed"]),
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
