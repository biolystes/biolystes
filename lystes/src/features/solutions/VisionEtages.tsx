import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BadgeCheck, BadgeEuro, BookOpen, Brain, CalendarCheck, CalendarDays, Clock, Compass, Linkedin, Network, Newspaper, FileText, HelpCircle, ShoppingCart, Store, UserCheck, TrendingUp, Filter, Gauge, Link2, ListChecks, MessageCircle, Star, Target, Users, type LucideIcon } from "lucide-react";
import { ScrollRail } from "@lystes/components/shot/ScrollRail";
import { FaceMeshScanner } from "@lystes/features/landing-particuliers/components/diagnostic/FaceMeshScanner";
import diagnosticFace from "@lystes/features/landing-particuliers/pages/diagnostic-agent/assets/diagnostic-face.jpg";
import { demanderMaillage } from "@lystes/lib/mediapipe-sur";
import SafeVideo from "@lystes/components/bio/SafeVideo";
import { ENTETE_BIO, ONGLETS_BIO, type EtapeBio, type MediaEtape } from "./vision/etapesBio";

/**
 * La vision Lystes par étages, sur `/accueil-v2` (09/10/2026, JP) : vos
 * produits, votre e-commerce, votre entreprise (et votre réseau, masqué pour
 * le moment). Les onglets montrent des équipes qui se parlent.
 *
 * Mise en page et textes : les diapos du deck `slides-suite-agents` validé par
 * JP le 09/10 (1, 3, 16, 17 et 19). Chaque étage est une scène : à gauche
 * l'étage, son titre et la liste de ses agents, à droite le visuel (JP : « c'est
 * plutôt cette mise en page »). Pour « Vos produits », le visuel est la fiche
 * Éclose de la diapo 3 (`public/demo-eclose/`), en version ordinateur à toutes
 * les largeurs (JP, 10/10 : « pour que ça soit pas trop long »).
 *
 * La visite guidée (JP, 10/10, après avoir écarté pastilles, voile et cadres) :
 * un point qui pulse sur la zone de l'agent, et à 2 px de lui la pointe d'un
 * encart, comme une bulle de visite d'application. L'encart montre la zone
 * agrandie et vivante (le chat qui converse, l'espace qui tourne), puis le nom
 * de l'agent, son rôle, « En quoi il est unique ? », les points de progression
 * et « Précédent / Suivant ». Sur téléphone (et quand la fiche est trop courte
 * pour porter l'encart), le point pulse sur la fiche et, dessous, viennent la
 * navigation, la ligne d'agents qui glisse et l'encart noir (JP, 10/10). La visite part quand la scène
 * traverse le milieu de l'écran, s'arrête sous la souris, et se pilote au clic.
 *
 * « Vos outils » et « Votre entreprise » (10/10/2026) suivent la mécanique de
 * la boutique, chacun dans son fichier de `vision/` (VisiteOutils,
 * VisiteBackOffice) : un écran par étape, rendu à 1280 × 800 puis réduit. Ils
 * ne se chargent qu'à l'ouverture de leur onglet : ils tirent les vraies pages
 * de marque et le back-office, trop lourds pour l'arrivée sur la page.
 *
 * Français seulement pour l'instant : les autres langues viendront après
 * validation de JP.
 *
 * Les emplacements viennent du gabarit (agents-vision-page.tmpl.html) :
 *   tete       la phrase de la vision et les onglets
 *   scene      la grille de l'étage ouvert (le panneau des onglets)
 *   texte      à gauche : l'étage, son titre, son chapeau
 *   legende    à gauche, dessous : les agents (liste, ou carrousel sur téléphone)
 *   visuel     à droite, sous la fiche : les visuels des autres étages, et
 *              l'encart de la visite sur téléphone
 *   pastilles  calque posé sur la fiche : le point et l'encart de la visite
 *   apres      sous la scène : la page de la marque sur lystes.ai (étage 2)
 * `demo` est le cadre de la fiche : masqué hors de l'onglet 1, jamais démonté,
 * pour que la fiche reprenne là où elle en était.
 */

/* La variante de la section (JP, 12/10/2026) : « ecommerce » sur l'accueil,
   « corporate » sur /business (la bascule « Entreprises » de l'en-tête). Même
   composant, mêmes visites : seuls les onglets, les agents et les données de
   démonstration changent. */
/* « bio » (JP, 13/10/2026) : les étapes de création de marque de /bio, dans
   la même section. Un seul en-tête pour tous les onglets, et chaque étape
   montre un visuel réel (vision/etapesBio.ts) au lieu d'une visite. */
export type Secteur = "ecommerce" | "corporate" | "bio";

type Props = {
  secteur?: Secteur;
  tete: HTMLElement;
  scene: HTMLElement;
  texte: HTMLElement;
  legende: HTMLElement;
  visuel: HTMLElement;
  pastilles: HTMLElement;
  apres: HTMLElement;
  demo: HTMLElement;
};

/* mission : la ligne courte de la liste. role et unique : l'encart de la
   visite, « Son rôle » puis « En quoi il est unique ? » (JP, 10/10). `elle` :
   le poste est féminin (une agence), le titre devient « En quoi elle est
   unique ? ». */
export type Agent = { nom: string; mission: string; role: string; unique: string; elle?: boolean };
export type Rect = { x: number; y: number; w: number; h: number };
export type Point = { x: number; y: number };
/* Où l'encart se pose par rapport au point. */
export type Cote = "gauche" | "droite" | "haut";
/* Où le point se pose sur la zone. */
export type Prise = "gauche" | "droite" | "centre" | "haut";

/* 09/10/2026 (JP) : « pour le moment enlève Votre réseau ». L'onglet et ses
   données restent dans le code ; repasser RESEAU_VISIBLE à true le rouvre. */
const RESEAU_VISIBLE = false;

/* La présentation de la visite (JP, 10/10 nuit : « soit on est sur la
   version mobile, soit sur la version ordi, mais il ne peut pas y avoir
   l'entre-deux »). L'encart se pose à côté du point quand il tient dans le
   cadre du visuel ; sinon, la visite prend la présentation téléphone (encart
   sous le visuel) et toute la scène passe en une colonne, comme sur
   téléphone. Ce qui décide : la vraie hauteur des encarts de l'onglet,
   mesurée sur la page (EncartPose), face à la hauteur du cadre. Avant toute
   mesure, la hauteur la plus grande relevée le 10/10 à 240 px de large,
   loupes comprises. */
export const HAUTEUR_ENCART: Record<string, number> = { produits: 420, ecommerce: 300, outils: 250, entreprise: 250, equipes: 250, reseau: 0, siteweb: 250 };
/* Les encarts posés de l'onglet en cours disent leur hauteur ici. */
export const MesureEncart = createContext<((h: number) => void) | null>(null);
/* La taille du cadre que chaque visuel annonce ; `largeurMin` quand
   l'encart tient dès que le cadre a cette largeur, quelle que soit sa
   hauteur (Vos outils : le téléphone et l'encart côte à côte). */
export type TailleCadre = { w: number; h: number; largeurMin?: number };
/* La colonne de texte et l'écart des deux colonnes (.lyv-scene). */
const COLONNE_TEXTE = 280;
const ECART_COLONNES = 28;

/* Durée d'une étape de la visite. L'Expert produit IA dure plus longtemps :
   son encart déroule une conversation. */
export const DUREE_ETAPE = 6200;

const TOUS_LES_ONGLETS = [
  {
    id: "produits",
    titre: "Vos produits",
    court: "Produits",
    etage: "Étage 1 · Vos produits",
    /* Trois bénéfices à icône, à la place du paragraphe (JP, 12/10 : « plus efficace »). */
    benefices: [[ShoppingCart, "Moins d’abandons d’achat"], [UserCheck, "Clientes rassurées avant l’achat"], [BadgeEuro, "Plus de ventes, à trafic égal"]] as [LucideIcon, string][],
    /* Le titre de la section change avec l'onglet : le problème que l'étage résout (JP, 12/10). */
    probleme: ["En moyenne dans le e-commerce, ", "98 % des visiteurs", " repartent sans acheter."],
    /* Le chapeau est une phrase, sans liste à puces (JP, 13/10 : « pas de
       tabulation, mes phrases »). */
    reponse:
      "Une question sans réponse, et votre client part chez la concurrence. Sur chaque fiche produit, Lystes place une équipe IA qui, jour et nuit, répond tout de suite à vos clients, repère les réponses qui mènent à l’achat, s’améliore à chaque conversation et vous signale ce qui bloque la vente.",
    accroche: "Une équipe de\n10 agents IA par produit,\npour déclencher l’achat.",
    chapeau:
      "Pour chaque produit, des collaborateurs IA disponibles 24 h sur 24 et 7 jours sur 7, qui s’adaptent seuls pour faire vendre davantage.",
  },
  {
    id: "ecommerce",
    titre: "Votre e-commerce",
    court: "E-commerce",
    etage: "Étage 2 · Votre e-commerce",
    /* Trois bénéfices à icône, à la place du paragraphe (JP, 12/10 : « plus efficace »). */
    benefices: [[MessageCircle, "Un conseil sur chaque page"], [Target, "Le bon produit, à chaque besoin"], [Clock, "Une réponse, jour et nuit"]] as [LucideIcon, string][],
    probleme: ["En moyenne, ", "2 visiteurs sur 3", " ont besoin d’un conseil pour acheter."],
    reponse:
      "Sans accompagnement, ils repartent sans savoir quel produit leur convient. Sur toute votre boutique, Lystes place une équipe IA qui, comme une vendeuse, oriente chaque visiteur vers le bon produit, compose la routine ou la tenue adaptée, répond à tout depuis n’importe quelle page et suggère le bon complément au panier.",
    accroche: "Une équipe IA pour toute la boutique, pour guider chaque visiteuse.",
    chapeau:
      "Une barre flottante sur chaque page, et des agents qui connaissent tout votre catalogue. Ajoutez un produit au panier : tous les agents le savent.",
  },
  {
    id: "outils",
    titre: "Vos outils",
    court: "Outils",
    etage: "Étage 3 · Vos outils",
    /* Trois bénéfices à icône, à la place du paragraphe (JP, 12/10 : « plus efficace »). */
    benefices: [[Filter, "Des visiteurs déjà convaincus"], [Star, "Des avis et une FAQ qui vendent"], [Link2, "Chaque lien suivi jusqu’à l’achat"]] as [LucideIcon, string][],
    probleme: ["Un visiteur bien accueilli ", "avant le site", " achète plus."],
    reponse:
      "Instagram, une newsletter, un avis ou ChatGPT\u00a0: vos outils font le premier contact. Sur la page lystes.ai de votre marque, chaque outil a son agent IA, qui préqualifie le visiteur avant votre site, l’amène jusqu’au bon produit, fait de vos avis et de votre FAQ des arguments de vente et suit chaque lien jusqu’à l’achat.",
    accroche: "8 outils pilotés par des agents IA, pour attirer des visiteurs prêts à acheter.",
    chapeau:
      "Multi-lien, avis, magazine, FAQ, paiement et contact, réunis sur la page lystes.ai de votre marque. Chaque outil a son agent, relié aux autres agents de votre espace.",
  },
  {
    id: "entreprise",
    titre: "Votre gestion",
    court: "Gestion",
    etage: "Étage 4 · Votre gestion",
    /* Trois bénéfices à icône, à la place du paragraphe (JP, 12/10 : « plus efficace »). */
    benefices: [[Gauge, "Le chiffre à viser, chaque mois"], [ListChecks, "Un plan d’action chiffré"], [Users, "Les bons experts, en un clic"]] as [LucideIcon, string][],
    probleme: ["Un écosystème de plusieurs équipes IA, ", "en 5 min", "."],
    reponse:
      "Des centaines de collaborateurs IA, autonomes ou semi-autonomes, répartis en équipes qui se parlent. Pour votre entreprise, Lystes réunit des agences IA qui vous donnent chaque mois le chiffre à viser, tirent de vos données un plan d’action chiffré, repèrent dans vos conversations où vos clients bloquent et tiennent vos réseaux, vos campagnes et vos visuels.",
    accroche: "Des agences IA au complet, pour faire grandir votre marque.",
    chapeau:
      "Pour développer vos ventes, votre communication et votre marketing : des équipes IA qui partent du cerveau de votre espace.",
  },
  /* 12/10/2026 (JP) : un 5e étage, l'organigramme des agents et le cerveau
     de la marque (VisiteEquipes). */
  {
    id: "equipes",
    titre: "Vos équipes",
    court: "Équipes",
    etage: "Étage 5 · Vos équipes",
    benefices: [[Network, "Un organigramme par produit"], [Brain, "Un seul cerveau pour tous vos agents"], [BookOpen, "Votre marque expliquée une seule fois"]] as [LucideIcon, string][],
    probleme: ["Un outil IA isolé ", "ne sait rien", " de votre marque."],
    reponse:
      "À chaque nouvel outil, il faut réexpliquer vos produits, vos clientes et votre ton. Lystes range vos agents en équipes qui ont chacune leur directeur, s’organisent produit par produit, lisent toutes le même cerveau de marque (Brand AI) et grandissent avec votre catalogue.",
    accroche: "Des équipes IA organisées comme une entreprise, pour parler de votre marque d’une seule voix.",
    chapeau:
      "Un organigramme qui grandit avec votre catalogue, et Brand AI, le cerveau que tous vos agents consultent.",
  },
  {
    id: "reseau",
    titre: "Votre réseau",
    court: "Réseau",
    etage: "Étage 6 · Votre réseau",
    /* Trois bénéfices à icône, à la place du paragraphe (JP, 12/10 : « plus efficace »). */
    benefices: [[Users, "Les bonnes personnes au bon moment"], [FileText, "Campagnes, articles et financements"], [Target, "Des mises en relation ciblées"]] as [LucideIcon, string][],
    probleme: ["Un écosystème de plusieurs équipes IA, ", "en 5 min", "."],
    reponse:
      "Des centaines de collaborateurs IA, autonomes ou semi-autonomes, répartis en équipes qui se parlent : pour vos produits, votre e-commerce et votre entreprise.",
    accroche: "Des humains pour aller plus loin.",
    chapeau:
      "Quand il faut une campagne, une créatrice, un article ou un financement, votre espace vous met en relation avec les bonnes personnes.",
  },
] as const;

const ONGLETS_ECOMMERCE = TOUS_LES_ONGLETS.filter((o) => RESEAU_VISIBLE || o.id !== "reseau");

type Onglet = {
  id: string;
  titre: string;
  court: string;
  etage: string;
  benefices: readonly (readonly [LucideIcon, string])[];
  probleme: readonly [string, string, string];
  reponse: string;
  /* La liste sous le chapeau, quand il finit par « qui : ». */
  points?: readonly string[];
  accroche: string;
  chapeau: string;
  /* Les étapes de /bio, chacune avec son visuel, à la place des agents. */
  etapes?: EtapeBio[];
};

/* La version « Entreprises » (/business, JP, 12/10/2026) : « c'est la même
   chose, mais adaptée aux entreprises corporate. Il n'y a pas Vos produits.
   Votre e-commerce devient Votre site web, puis Vos outils, Votre gestion,
   Vos équipes. » L'entreprise de démonstration est un cabinet d'architectes
   inventé, Brévan Architectes (vision/demoCorporate.ts). */
const ONGLETS_CORPORATE: Onglet[] = [
  {
    id: "siteweb",
    titre: "Votre site web",
    court: "Site web",
    etage: "Étage 1 · Votre site web",
    benefices: [[MessageCircle, "Une réponse sur chaque page"], [CalendarCheck, "Des rendez-vous pris en ligne"], [Clock, "Un accueil, jour et nuit"]],
    /* Source : Gartner, communiqué du 25/06/2025, enquête auprès de 632
       acheteurs B2B (août-septembre 2024) : « 61 % of B2B buyers prefer an
       overall rep-free buying experience ». */
    probleme: ["En B2B, ", "61 % des acheteurs", " préfèrent avancer sans commercial."],
    reponse:
      "Ils lisent votre site avant de vous appeler, et repartent quand ils n’y trouvent pas leur réponse. Lystes pose sur votre site vitrine des agents IA qui leur répondent, les orientent vers le bon service et leur proposent un rendez-vous.",
    accroche: "Une équipe IA sur tout votre site, pour faire d’une visite un rendez-vous.",
    chapeau: "Un orbital sur chaque page, et des agents qui connaissent vos services, vos références et votre façon de travailler.",
  },
  {
    id: "outils",
    titre: "Vos outils",
    court: "Outils",
    etage: "Étage 2 · Vos outils",
    benefices: [[Linkedin, "Un lien qui oriente depuis LinkedIn"], [Star, "Des avis visibles sur Google"], [CalendarDays, "Un rendez-vous réservé seul"]],
    probleme: ["Votre prochain client ", "vous découvre ailleurs", " que sur votre site."],
    reponse:
      "Sur LinkedIn, dans Google ou dans une réponse de ChatGPT : vos outils font le premier contact, répondent à ses questions et l’amènent jusqu’au rendez-vous.",
    accroche: "6 outils pilotés par des agents IA, pour amener vos prospects jusqu’au rendez-vous.",
    chapeau: "Lien LinkedIn, avis, articles, FAQ, contact et rendez-vous, réunis sur la page lystes.ai de votre entreprise.",
  },
  {
    id: "entreprise",
    titre: "Votre gestion",
    court: "Gestion",
    etage: "Étage 3 · Votre gestion",
    benefices: [[Compass, "Un copilote qui connaît vos clients"], [Newspaper, "Votre nom dans la presse économique"], [TrendingUp, "Vos demandes, lues et expliquées"]],
    probleme: ["Une direction IA au complet, ", "en 5 min", "."],
    reponse:
      "Des collaborateurs IA, autonomes ou semi-autonomes, répartis en équipes qui se parlent : pour votre site, votre communication et votre gestion.",
    accroche: "Des équipes IA au complet, pour faire grandir votre entreprise.",
    chapeau: "Pour piloter et communiquer : des équipes IA qui partent du cerveau de votre espace.",
  },
  {
    id: "equipes",
    titre: "Vos équipes",
    court: "Équipes",
    etage: "Étage 4 · Vos équipes",
    benefices: [[Network, "Un organigramme par métier"], [Brain, "Un seul cerveau pour tous vos agents"], [BookOpen, "Votre entreprise expliquée une fois"]],
    probleme: ["Un outil IA isolé ", "ne sait rien", " de votre entreprise."],
    reponse:
      "À chaque nouvel outil, il faut réexpliquer vos services, vos clients et votre ton. Lystes range vos agents en équipes, chacune avec son directeur, et tous lisent le même cerveau d’entreprise.",
    accroche: "Des équipes IA organisées comme votre entreprise, pour parler d’une seule voix.",
    chapeau: "Un organigramme qui grandit avec vos métiers, et Brand AI, le cerveau que tous vos agents consultent.",
  },
];

/* /bio : le même en-tête sur les cinq onglets. */
const ONGLETS_BIO_VUE: Onglet[] = ONGLETS_BIO.map((o) => ({
  ...o,
  probleme: ENTETE_BIO.probleme,
  reponse: ENTETE_BIO.texte,
  chapeau: "",
}));

/* Le visuel d'une étape de /bio : le sien, sinon celui de l'étape d'avant. */
function mediaEtape(etapes: EtapeBio[], i: number): MediaEtape | undefined {
  for (let k = i; k >= 0; k--) if (etapes[k]?.media) return etapes[k].media;
  return undefined;
}

/* Les dix postes d'une fiche, par ordre d'importance (JP, 09/10). */
const AGENTS_FICHE: Agent[] = [
  { nom: "Expert produit IA", mission: "répond dans le chat, jour et nuit",
    role: "Répondre à chaque question de la cliente sur ce produit, jour et nuit et dans sa langue, pour lever ses doutes et la faire passer à l’achat.",
    unique: "Il voit ce que la cliente a déjà fait sur votre site (panier, produits vus, diagnostic) et appuie ses réponses par des avant-après et des avis. Il s’auto-améliore à chaque conversation et vous remonte ce qui vous fait perdre des ventes." },
  { nom: "Diagnostiqueur ou essayeur IA", mission: "prouve que le produit lui convient, ou le lui fait essayer",
    role: "Prouver à la cliente que ce produit est fait pour elle, par un diagnostic ou un essayage, sans quitter la fiche.",
    unique: "Spécialiste de votre secteur (peau, cheveux, lunettes, vêtements), il rend un conseil sur mesure : à l’issue de l’analyse, il dit en quoi ce produit répond à son cas, au moment même où elle hésite." },
  { nom: "Agent FAQ IA", mission: "répond d’avance aux doutes les plus fréquents",
    role: "Répondre d’avance aux questions qui freinent l’achat, avant même que la cliente les pose.",
    unique: "Nourri par la fiche et par les questions qui reviennent, sur le produit comme sur la livraison. Chaque nouveau frein trouve sa réponse sur la fiche, lue aussi par Google." },
  { nom: "Responsable avis IA", mission: "met en avant les avis qui rassurent",
    role: "Trier parmi vos avis ceux qui sont les plus pertinents pour faire monter votre taux de conversion.",
    unique: "Sur cent avis, tous ne rassurent pas autant. Il choisit en direct ceux qui répondent aux doutes exprimés par la cliente dans la conversation." },
  { nom: "Expert GEO IA", mission: "écrit des articles pour ressortir sur Google et ChatGPT",
    role: "Écrire des articles autour du produit pour qu’il ressorte sur Google et soit cité par ChatGPT, Gemini ou Perplexity, et amener des acheteuses sur la fiche.",
    unique: "Il sait comment ces IA choisissent leurs sources, et écrit pour être cité. Ses sujets viennent des conversations et des diagnostics de vos clientes : il répond à leurs vraies questions." },
  { nom: "Rédacteur SEO IA", mission: "réécrit la description pour qu’elle convertisse mieux",
    role: "Réécrire le titre et la description pour qu’ils fassent acheter et placent la fiche sur Google.",
    unique: "Au-delà des techniques de référencement, il écrit avec les mots de vos clientes et répond à leurs préoccupations dès la description. Quand elles changent, il réécrit la fiche." },
  { nom: "Expert UGC IA", mission: "humanise la marque avec des UGC",
    role: "Montrer le produit utilisé par des personnes qui ressemblent à vos clients, pour qu’ils s’y projettent et achètent.",
    unique: "Il crée une communauté d’acheteurs qui ressemble à vos clients : femmes, hommes, jeunes ou plus âgés, choisis d’après vos diagnostics et votre avatar client. Il sait quel format vend quel produit." },
  { nom: "Photographe IA", mission: "crée des photos du produit en situation, sans shooting",
    role: "Créer des photos du produit en situation qui donnent envie d’acheter.",
    unique: "Des photos du niveau d’un photographe expérimenté, sans le coût d’un shooting. Votre vrai produit, étiquette comprise, dans votre univers, dès son arrivée au catalogue." },
  { nom: "Conseiller téléphonique IA", mission: "reprend la cliente au téléphone et lui parle du produit",
    role: "Parler de vive voix à la cliente qui préfère appeler plutôt qu’écrire, et conclure la vente.",
    unique: "Une voix humaine, empathique et convaincante. Il reprend là où le chat s’est arrêté : il sait déjà ce qui la fait hésiter." },
  { nom: "Coach à domicile IA", mission: "aide à bien utiliser le produit chez soi, et à racheter",
    role: "Accompagner la cliente chez elle après l’achat, pour qu’elle tire le meilleur du produit.",
    unique: "Il a de vrais savoirs (routine, nutrition) et répond à tout moment via un simple QR code. Il fidélise et relance le réachat avec des compléments et des codes promo." },
];

/* Chaque étape de la fiche Éclose : la zone (data-z dans
   public/demo-eclose/eclose.js) où pulse le point, ce que l'encart agrandit,
   où il se pose. Pour la
   FAQ, les avis et les actualités, la visite ouvre aussi le bon onglet de
   l'espace qui tourne. */
type EtapeFiche = {
  z: string;
  zoom: string;
  /* L'encart montre le maillage du visage puis le bouton (Diagnostiqueur IA). */
  diagnostic?: boolean;
  /* L'encart montre le packshot et les photos générées (Photographe IA). */
  studio?: boolean;
  /* La conversation se joue dans l'encart (vue « chat » de la fiche). */
  vivant?: boolean;
  duree?: number;
  prise: Prise;
  cote: Cote;
  onglet?: number;
  centrer?: boolean;
  /* La photo et le QR code gardent l'encart sur la fiche, à côté de ce
     qu'il montre, sans le couvrir (JP, 13/10 : « hors pour le QR code et la
     photo produit ») : sorti à droite, il s'en éloignerait. */
  garde?: boolean;
};
const ETAPES_FICHE: EtapeFiche[] = [
  { z: "chat", zoom: '[data-z="chat"]', prise: "gauche", cote: "gauche", vivant: true, duree: 16000 },
  { z: "bouton", zoom: '[data-z="bouton"]', prise: "gauche", cote: "gauche", diagnostic: true },
  { z: "faq", zoom: '[data-z="faq"]', prise: "gauche", cote: "gauche", onglet: 1 },
  { z: "faq", zoom: '[data-z="faq"]', prise: "gauche", cote: "gauche", onglet: 0 },
  { z: "faq", zoom: '[data-z="faq"]', prise: "gauche", cote: "gauche", onglet: 2 },
  { z: "seo", zoom: '[data-z="seo"]', prise: "gauche", cote: "gauche" },
  { z: "ugc", zoom: '[data-z="ugc"]', prise: "gauche", cote: "gauche" },
  /* Au bord droit de la photo, et plus en son milieu : l'encart couvrait
     la moitié de la photo qu'il présente (13/10). */
  { z: "photo", zoom: '[data-z="photo"]', prise: "droite", cote: "droite", studio: true, garde: true },
  { z: "appel", zoom: ".fiche .chat-carte", prise: "centre", cote: "gauche" },
  { z: "qr", zoom: '[data-z="qr"]', prise: "gauche", cote: "gauche", garde: true },
];

/* Votre e-commerce : la même logique, à l'échelle de toute la boutique. */
const AGENTS_BOUTIQUE: Agent[] = [
  /* Réécrits avec JP le 12/10 : ce que chaque agent fait, puis en quoi il est unique, sans redite. */
  { nom: "Conseiller spécialisé IA", mission: "dit en quoi ce produit vous convient, ou vous le fait essayer",
    role: "Dire à chaque client, depuis la page du produit, en quoi ce produit est fait pour lui, ou le lui faire essayer quand c’est un vêtement.",
    unique: "Avant même d’entrer dans le produit, il s’appuie sur son diagnostic ou son essayage : la réponse vaut pour lui, pas pour tout le monde." },
  { nom: "Expert routine IA", mission: "compose la routine ou la tenue adaptée",
    role: "Trouver les produits les plus adaptés : une routine pour un soin, l’essayage de n’importe quel vêtement du site pour la mode.",
    unique: "La barre flottante l’invite sur toutes les pages : il arrive sans savoir quoi prendre, il repart avec sa routine ou sa tenue." },
  { nom: "Conseiller boutique IA", mission: "un cerveau qui connaît tout le site",
    role: "Répondre à tout, depuis n’importe quelle page : produits, rendez-vous, livraison, conditions de vente.",
    unique: "Une IA branchée sur la base de connaissances de votre site, à jour en temps réel. Il sait aussi ce qu’il y a dans le panier et ce que le client a regardé." },
  { nom: "Responsable avis IA", mission: "recueille les avis de la boutique et de chaque produit",
    role: "Recueillir les avis sur la boutique et sur chaque produit, et les montrer là où ils rassurent.",
    unique: "Il note chaque produit en plus de la marque, et répond à chaque avis en son nom. Les avis ne sont jamais filtrés." },
  { nom: "Expert SEO et GEO IA", mission: "tient l'actualité de la marque, pour Google et les IA",
    role: "Tenir l’actualité de votre marque pour la rendre visible sur Google et dans les IA.",
    unique: "Chaque semaine, il choisit ses sujets parmi les préoccupations et les questions de vos clients. Chaque article mène vers les produits qui y répondent." },
  { nom: "Agent FAQ IA", mission: "les questions de la boutique et de chaque produit",
    role: "Réunir les questions générales (livraison, retours, paiement) et celles de chaque produit.",
    unique: "Elle est dynamique : une préoccupation qui revient souvent dans les conversations rejoint la FAQ, lue par Google et par les IA." },
  { nom: "Formulaire IA", mission: "répond tout de suite, ou range la demande",
    role: "Remplacer vos formulaires de contact par un formulaire qui sait répondre.",
    unique: "Beaucoup de demandes ont une réponse immédiate : il la donne tout de suite et ferme lui-même le ticket dans votre back-office. Votre équipe ne traite que le reste." },
  { nom: "Newsletter IA", mission: "récupère les e-mails, envoie articles et sélections",
    role: "Récupérer les e-mails et envoyer automatiquement vos articles, vos sélections de produits et vos campagnes e-mail.",
    unique: "Chaque e-mail complète la fiche du client avec ses diagnostics et ses achats : il reçoit ce qui le concerne, et vous le connaissez mieux." },
  { nom: "Conseiller téléphonique IA", mission: "l'appel depuis l'orbital, de vive voix",
    role: "Répondre de vive voix depuis n’importe quelle page, sur toute la boutique.",
    unique: "Idéal pour le client pris ou dans les transports. On parle plus vite qu’on n’écrit : il pose plus de questions, et vous comprenez mieux ce qui le préoccupe." },
  { nom: "Upsell IA", mission: "suggère le bon complément au panier",
    role: "À chaque ajout au panier, suggérer les produits qui complètent le choix, avec un bouton pour les ajouter.",
    unique: "Il explique pourquoi ce produit en plus est utile à ce client : un vrai conseil, pas une promotion de plus." },
];

/* Où chaque poste travaille, sur les vraies pages d'Éclose copiées dans
   `public/demo-eclose-boutique/` avec le vrai widget (JP, 10/10/2026 : « l'écran
   doit changer, on doit voir ce dont on parle »). `page` est la page montrée,
   `orbital` dit s'il est ouvert, `vue` le panneau ouvert dans l'orbital, `sel`
   l'élément où pulse le point, `prise` et `cote` comme pour la fiche.
   `scan` : l'encart montre le scan de peau.
   Tout se joue dans l'orbital, panier compris (JP, 10/10/2026) : la copie lui
   donne un vrai panier et les articles d'Éclose. Le multi-lien n'a pas de
   place chez Éclose : son encart se pose au milieu. */
type PageBoutique = "index";
type VueOrbital = "avis" | "actualite" | "faq" | "contact" | "newsletter" | "panier";
type Cible = {
  page: PageBoutique;
  orbital: boolean;
  vue?: VueOrbital;
  sel: string;
  prise: Prise;
  cote: Cote;
  scan?: boolean;
  /* L'appel en cours : la vraie barre d'appel du widget, en mode d'essai
     (ni micro ni session). */
  appel?: boolean;
} | null;
const PAGES_BOUTIQUE: PageBoutique[] = ["index"];
const BOUTON_VUE: Record<VueOrbital, string> = { avis: "reviews", actualite: "articles", faq: "faq", contact: "contact", newsletter: "newsletter", panier: "tab-cart" };
const FENETRE = "#lystes-brandchat";
const ETAPES_BOUTIQUE: Cible[] = [
  { page: "index", orbital: false, sel: "ul.products > li:nth-child(3) .lystes-archive-diagnostic-btn", prise: "gauche", cote: "gauche" },
  { page: "index", orbital: false, sel: "#lystes-widget-btn", prise: "haut", cote: "haut", scan: true },
  { page: "index", orbital: true, sel: ".lystes-bc-field", prise: "gauche", cote: "gauche" },
  { page: "index", orbital: true, vue: "avis", sel: ".lystes-bc-library", prise: "gauche", cote: "gauche" },
  { page: "index", orbital: true, vue: "actualite", sel: ".lystes-bc-library", prise: "gauche", cote: "gauche" },
  { page: "index", orbital: true, vue: "faq", sel: ".lystes-bc-library", prise: "gauche", cote: "gauche" },
  { page: "index", orbital: true, vue: "contact", sel: ".lystes-bc-library", prise: "gauche", cote: "gauche" },
  { page: "index", orbital: true, vue: "newsletter", sel: ".lystes-bc-library", prise: "gauche", cote: "gauche" },
  { page: "index", orbital: false, appel: true, sel: "#lystes-brandcall-ui .lystes-brandcall-pill", prise: "haut", cote: "haut" },
  { page: "index", orbital: true, vue: "panier", sel: ".lystes-bc-cart", prise: "gauche", cote: "gauche" },
];
/* Les pages sont rendues à la taille d'un écran d'ordinateur, puis réduites à
   la largeur du cadre : la même boutique à toutes les largeurs. */
export const ECRAN_BOUTIQUE = { w: 1280, h: 800 };
/* Dans les copies : la page ne défile qu'à la main de la visite (la molette
   reste à lystes.ai) et les liens de la boutique ne quittent pas la
   démonstration. Le voile de l'orbital ouvert reste celui du widget, noir
   (JP, 10/10/2026). */
/* La bulle « Connexion à l'assistante… » de l'appel reste cachée : la
   visite montre la barre d'appel seule (relecture du 11/10). */
const STYLE_BOUTIQUE = "html,body{overflow:hidden!important}#lystes-brandcall-status{display:none!important}";
type ApiOrbital = {
  openChat: () => void;
  closeChat: () => void;
  end?: (raison?: string) => void;
  _debugBoot?: () => void;
  _debugPhase?: (phase: string) => void;
};

type Colonne = { titre: string; cartes: [string, string][] };

const ORGA_ENTREPRISE: Colonne[] = [
  {
    titre: "Communication",
    cartes: [
      ["Agence de com IA", "votre ligne éditoriale"],
      ["Community managers IA", "vos réseaux, publiés seuls"],
      ["Photographes IA", "shootings sans studio"],
      ["Graphistes IA", "affiches et visuels"],
      ["Agence UGC IA", "créatrices et vidéos"],
    ],
  },
  {
    titre: "Ventes et marketing",
    cartes: [
      ["Agence marketing IA", "pubs, media buying, e-mails"],
      ["Agence SEO et GEO IA", "Google et les IA"],
      ["Stratège", "le plan, selon votre objectif"],
    ],
  },
  {
    titre: "Pilotage",
    cartes: [
      ["Insight AI", "vos chiffres, expliqués"],
      ["Concurrents IA", "ce que font les autres"],
      ["Compta IA", "ventes, TVA, export"],
    ],
  },
];

const ORGA_RESEAU: Colonne[] = [
  {
    titre: "Des experts",
    cartes: [
      ["Experts e-commerce", "agences et consultants"],
      ["Experts marketing", "SEO, GEO, media buying"],
    ],
  },
  {
    titre: "Des créatrices",
    cartes: [
      ["Influenceuses et UGC", "audience vérifiée"],
      ["Collaborations suivies", "un lien qui compte les ventes"],
    ],
  },
  {
    titre: "Des partenaires",
    cartes: [
      ["Presse et magazines", "articles sponsorisés"],
      ["Financement", "stock, campagnes, factures"],
      ["Expert-comptable", "TVA, bilan, paie"],
    ],
  },
];


/** Ce que la page parente lit dans l'iframe de la fiche. */
type MesureFiche = { cadre: { w: number; h: number }; boite: Rect; zones: Record<string, Rect>; fenetreOuverte: boolean; plancher: Point | null };

/** Lit, dans l'iframe de la fiche, où se trouve chaque zone, et règle la
    hauteur de l'iframe sur celle de la fiche (écrite par demo.js). */
function mesurerFiche(cadre: HTMLElement): MesureFiche | null {
  const iframe = cadre.querySelector<HTMLIFrameElement>("iframe.lyv-demo-ecran");
  let doc: Document | null = null;
  try {
    doc = iframe?.contentDocument ?? null;
  } catch {
    return null;
  }
  /* Au tout premier instant, l'iframe n'a pas encore de document : on attend
     la mesure suivante au lieu de faire tomber la page. */
  if (!iframe || !doc?.documentElement) return null;
  const hauteurFiche = Number(doc.documentElement.getAttribute("data-hauteur"));
  if (!hauteurFiche) return null;
  if (iframe.style.height !== `${hauteurFiche}px`) {
    iframe.style.height = `${hauteurFiche}px`;
    iframe.style.aspectRatio = "auto";
  }
  const ox = iframe.offsetLeft;
  const oy = iframe.offsetTop;
  const zones: Record<string, Rect> = {};
  for (const e of ETAPES_FICHE) {
    if (zones[e.z]) continue;
    const el = doc.querySelector(`[data-z="${e.z}"]`);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    zones[e.z] = { x: ox + r.left, y: oy + r.top, w: r.width, h: r.height };
  }
  /* Le titre et le prix : l'encart qui mord sur la fiche reste dessous. */
  const prix = doc.querySelector(".prix")?.getBoundingClientRect();
  const titre = doc.querySelector("h1")?.getBoundingClientRect();
  return {
    plancher: prix ? { x: Math.round(ox + Math.max(prix.right, titre?.right ?? 0) + 4), y: Math.round(oy + prix.bottom + 6) } : null,
    cadre: { w: cadre.clientWidth, h: cadre.clientHeight },
    boite: { x: ox, y: oy, w: iframe.clientWidth, h: iframe.clientHeight },
    zones,
    /* « Voir tout » ou « Pourquoi acheter ce soin ? » ouverts dans la fiche :
       la visite s'efface et attend. */
    fenetreOuverte: !!doc.querySelector(".couche"),
  };
}

/* Le point de la zone où pulse le repère. */
export function prise(r: Rect, p: Prise): Point {
  if (p === "centre") return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
  if (p === "haut") return { x: r.x + r.w / 2, y: r.y };
  if (p === "droite") return { x: r.x + r.w, y: r.y + r.h / 2 };
  return { x: r.x, y: r.y + r.h / 2 };
}

/* ---------- L'encart : placement autour du point ---------- */

/* Rayon du point (6) + 2 px d'écart (JP) + pointe (8). */
export const ECART = 16;
export type Pointe = { cote: "gauche" | "droite" | "haut" | "bas"; decalage: number };
export type Placement = { x: number; y: number; pointe: Pointe | null };

export function placer(p: Point | null, cote: Cote, w: number, h: number, cadre: { w: number; h: number }): Placement {
  const borne = (v: number, min: number, max: number) => Math.max(min, Math.min(v, Math.max(min, max)));
  if (!p) return { x: (cadre.w - w) / 2, y: borne((cadre.h - h) / 2, 4, cadre.h - h - 4), pointe: null };
  const ordre: Cote[] = cote === "droite" ? ["droite", "gauche", "haut"] : cote === "haut" ? ["haut", "gauche", "droite"] : ["gauche", "droite", "haut"];
  /* D'abord à 4 px au moins des bords du cadre ; sinon jusqu'au bord, avant
     de passer sous le point : en deux colonnes (cadre de 516 px), un point au
     milieu laissait 2 px de trop des deux côtés, et l'encart, posé dessous,
     sortait du cadre (Réseau de magazines, Expert routine). */
  for (const m of [4, 0]) {
    for (const c of ordre) {
      if (c === "gauche" && p.x - ECART - w >= m) {
        const y = borne(p.y - h / 2, 4, cadre.h - h - 4);
        return { x: p.x - ECART - w, y, pointe: { cote: "droite", decalage: p.y - y } };
      }
      if (c === "droite" && p.x + ECART + w <= cadre.w - m) {
        const y = borne(p.y - h / 2, 4, cadre.h - h - 4);
        return { x: p.x + ECART, y, pointe: { cote: "gauche", decalage: p.y - y } };
      }
      if (c === "haut" && p.y - ECART - h >= m) {
        const x = borne(p.x - w / 2, 4, cadre.w - w - 4);
        return { x, y: p.y - ECART - h, pointe: { cote: "bas", decalage: p.x - x } };
      }
    }
  }
  const x = borne(p.x - w / 2, 4, cadre.w - w - 4);
  return { x, y: p.y + ECART, pointe: { cote: "haut", decalage: p.x - x } };
}

/* ---------- La loupe : la zone agrandie, vivante ---------- */

/* Marge blanche autour de l'endroit reproduit, dans la boîte (JP, 10/10 :
   « le padding beaucoup plus grand »). */
export const MARGE_LOUPE = 20;
/* Sur ordinateur, l'encart est réduit à l'échelle (JP, 10/10 : « réduire les
   pop up en proportion », deux fois) : 240 px au lieu de 380, marges, texte
   et loupe d'autant (~0,64). Le téléphone garde la taille d'origine. */
export const LARGEUR_ENCART = 240;

/* ---------- L'encart dans la marge de droite ----------
   JP, 13/10/2026, sur l'onglet « Vos produits » : l'encart posé sur la fiche
   en cachait la moitié ; « j'ai le max width actuel, mais j'aimerais que,
   quand c'est possible, ça mange moins l'écran ». Sur ordinateur, en deux
   colonnes, l'encart sort du cadre vers la droite, dans la marge blanche de
   la page, à la hauteur de l'élément qu'il commente, relié à lui par un
   trait. La scène garde ses 872 px.
   Mesuré le 13/10 (scène de 872 px, cadre gris de 16 px) :
   - dès 1396 px d'écran : 240 px de large, tout entier dans la marge
     blanche, hors du cadre gris ;
   - de 1272 à 1395 px : resserré de 240 à 200 px, il ne touche plus la
     fiche (au plus le bord du cadre gris) ;
   - de 1100 à 1271 px : 200 px, collé à la gouttière de l'écran (16 px), il
     ne mord que sur le bord droit de la fiche (90 px au plus, à 1100 px),
     jamais au-dessus du titre et du prix (`plancher`), et le point recule
     sur la partie visible de la zone ;
   - sous 1100 px (une colonne, iPad) et sur téléphone : rien ne change.
   La photo et le QR code gardent l'encart sur la fiche (ETAPES_FICHE,
   `garde`). La page ne défile jamais de côté : l'encart s'arrête à la
   gouttière. */
export const LARGEUR_COMPACTE = 200;
/* La gouttière laissée au bord droit de l'écran, et l'écart entre le bord
   du contenu et l'encart sorti. */
export const GOUTTIERE = 16;
export const ECART_BORD = 6;
/* Le bord droit du cadre gris (la fiche ou la visite), dans le repère de
   l'élément où se pose l'encart, et la place libre de ce bord jusqu'à la
   gouttière de l'écran, écart compris ; null quand l'encart ne sort pas.
   L'encart sorti se pose dans la marge blanche, hors du cadre gris : c'est
   là que JP l'a dessiné. */
export function useMargeDroite(ref: { current: HTMLElement | null }, actif: boolean): Hors | null {
  const [hors, setHors] = useState<Hors | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const gris = el?.closest<HTMLElement>(".lyv-cadre, #vision-demo");
    if (!el || !gris || !actif) {
      setHors(null);
      return;
    }
    const maj = () => {
      const g = el.getBoundingClientRect().left;
      const bord = Math.round(gris.getBoundingClientRect().right - g);
      const dispo = Math.floor(document.documentElement.clientWidth - GOUTTIERE - (g + bord) - ECART_BORD);
      setHors((o) => (o && o.bord === bord && o.dispo === dispo ? o : { bord, dispo }));
    };
    maj();
    window.addEventListener("resize", maj);
    const ro = new ResizeObserver(maj);
    ro.observe(el);
    ro.observe(gris);
    return () => {
      window.removeEventListener("resize", maj);
      ro.disconnect();
    };
  }, [ref, actif]);
  return hors;
}
/* `bord` : le bord droit du cadre gris dans le repère de l'encart ;
   `dispo` : useMargeDroite ; `plancher` : l'encart qui mord sur le
   contenu à gauche de ce x ne monte pas au-dessus de ce y (le titre et le
   prix de la fiche). */
export type Hors = { bord: number; dispo: number; plancher?: Point };
/* La largeur de l'encart sorti, et son bord gauche s'il se pose en face de
   `x`. */
const largeurHors = (h: Hors, largeur = LARGEUR_ENCART) => Math.max(LARGEUR_COMPACTE, Math.min(largeur, h.dispo));
const gaucheHors = (h: Hors, x: number, l: number) => Math.min(Math.max(x + ECART, h.bord + ECART_BORD), h.bord + ECART_BORD + h.dispo - l);
/* Le point de l'encart sorti : au bord droit de la zone, au plus près de
   l'encart. Si l'encart, à cheval sur le contenu, couvre ce bord, le point
   recule sur la partie visible de la zone, juste devant la pointe : un long
   trait barrait la zone (relecture du 13/10 à 1180 px). */
/* Le même recul pour un point déjà posé au bord droit de sa cible (Vos
   outils). */
export function pointDevant(p: Point, h: Hors | null | undefined): Point {
  if (!h) return p;
  const g = gaucheHors(h, p.x, largeurHors(h));
  return g >= p.x + ECART ? p : { x: g - ECART, y: p.y };
}
export function pointHors(r: Rect, p: Prise, h: Hors | null | undefined): Point {
  if (!h) return prise(r, p);
  const d = prise(r, "droite");
  const g = gaucheHors(h, d.x, largeurHors(h));
  return g >= d.x + ECART ? d : { x: Math.max(r.x + 6, g - ECART), y: d.y };
}
export const MARGE_LOUPE_ORDI = 13;

const STYLE_LOUPE = `
.loupe{ position:absolute; left:0; top:0; transform-origin:0 0; }
.site{ position:relative !important; transform:none !important; padding-top:14px; background:transparent !important; }
.fiche{ display:block !important; padding:0 !important; }
.fiche > *{ position:relative !important; inset:auto !important; margin:0 !important; }
`;

/* La loupe recopie la zone de la fiche, dans un shadow DOM qui charge les
   styles de la fiche, et la recopie à chaque changement : la conversation,
   l'espace qui tourne, tout y vit comme sur la fiche. */
function LoupeFiche({ iframe, sel, hautMax, centrer, nue, marge = MARGE_LOUPE }: {
  iframe: HTMLIFrameElement | null;
  sel: string;
  hautMax: number;
  centrer?: boolean;
  /* Sans marge ni fond : posée dans une autre loupe. */
  nue?: boolean;
  marge?: number;
}) {
  const hote = useRef<HTMLDivElement>(null);
  const [largeur, setLargeur] = useState(0);
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null);
  useLayoutEffect(() => {
    const el = hote.current;
    if (!el) return;
    setLargeur(el.clientWidth);
    const ro = new ResizeObserver(() => setLargeur(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const el = hote.current;
    if (!el || !iframe) return;
    let doc: Document | null = null;
    try {
      doc = iframe.contentDocument;
    } catch {
      doc = null;
    }
    const src = doc?.querySelector<HTMLElement>(sel);
    if (!src) return;
    const racine = el.shadowRoot ?? el.attachShadow({ mode: "open" });
    const w = src.offsetWidth;
    setNat({ w, h: src.offsetHeight + 14 });
    racine.innerHTML = `<link rel="stylesheet" href="/demo-eclose/eclose.css"><style>${STYLE_LOUPE}</style>`
      + `<div class="loupe"><div class="site" style="width:${w}px"><div class="fiche"></div></div></div>`;
    const dedans = racine.querySelector(".fiche");
    if (!dedans) return;
    const copier = () => { dedans.innerHTML = src.outerHTML; };
    copier();
    let attente = 0;
    const mo = new MutationObserver(() => {
      if (!attente) attente = window.setTimeout(() => { attente = 0; copier(); }, 90);
    });
    mo.observe(src, { subtree: true, childList: true, attributes: true, characterData: true });
    return () => {
      mo.disconnect();
      window.clearTimeout(attente);
    };
  }, [iframe, sel]);
  /* La zone entière tient dans la loupe ; seule la photo, très haute, est
     recadrée sur son milieu. */
  const m = nue ? 0 : marge;
  const utile = Math.max(0, largeur - 2 * m);
  const k = nat && utile ? Math.min(utile / nat.w, centrer ? Infinity : (hautMax - 2 * m) / nat.h, 1.6) : 0;
  const haut = nat ? Math.min(nat.h * k, hautMax - 2 * m) + 2 * m : 0;
  useEffect(() => {
    const l = hote.current?.shadowRoot?.querySelector<HTMLElement>(".loupe");
    if (!l || !nat || !k) return;
    const dx = m + (utile - nat.w * k) / 2;
    const dy = m + (centrer ? -(nat.h * k - (haut - 2 * m)) / 2 : 0);
    l.style.transform = `translate(${dx}px, ${dy}px) scale(${k})`;
  }, [k, nat, utile, haut, centrer, m]);
  return <div className={"lyv-loupe" + (nue ? " nue" : "")} ref={hote} style={{ height: haut || 120 }} aria-hidden="true" />;
}

/* L'Expert produit IA : la conversation se joue dans l'encart, dans la vue
   « chat » de la fiche, chargée à chaque passage pour repartir du bonjour. */
function LoupeChat({ hautMax, marge = MARGE_LOUPE }: { hautMax: number; marge?: number }) {
  const cadre = useRef<HTMLIFrameElement>(null);
  const [h, setH] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      let v = 0;
      try {
        v = Number(cadre.current?.contentDocument?.documentElement.getAttribute("data-hauteur"));
      } catch {
        v = 0;
      }
      if (v) setH(v);
    }, 250);
    return () => window.clearInterval(id);
  }, []);
  return (
    <div className="lyv-loupe" style={{ padding: marge }} aria-hidden="true">
      {/* Avant la première mesure, la hauteur maximale et pas 200 px : plus
          haute, elle faisait relever un encart de 453 px et la scène passait
          en une colonne. */}
      <div style={{ position: "relative", height: h ? Math.min(h, hautMax) : Math.min(200, hautMax), overflow: "hidden" }}>
        <iframe
          ref={cadre}
          src="/demo-eclose/index.html?vue=chat"
          title="Conversation avec l'Expert produit IA"
          tabIndex={-1}
          style={{ position: "absolute", left: 0, bottom: 0, display: "block", width: "100%", height: h || 200, border: 0, pointerEvents: "none" }}
        />
      </div>
    </div>
  );
}

/* Le Diagnostiqueur IA : l'animation de maillage du visage de la page d'accueil,
   avec « Diagnostic en cours », puis le bouton de la fiche dessous (JP, 10/10).
   L'encart reflète image par image le scanner déjà posé sur la page
   (#diagnostic-facemesh-slot) : une seconde instance de MediaPipe sur la même
   page restait bloquée sur « Analyse en cours ». Sans lui, repli sur le
   composant. */
function LoupeDiagnostic({ iframe }: { iframe: HTMLIFrameElement | null }) {
  return (
    <div className="lyv-loupe lyv-loupe-html lyv-diag" aria-hidden="true">
      <MiroirVisage />
      <LoupeFiche iframe={iframe} sel='[data-z="bouton"]' hautMax={80} nue />
    </div>
  );
}

/* Le visage scanné, reflété depuis le scanner de la page (voir plus haut). */
function MiroirVisage() {
  const toile = useRef<HTMLCanvasElement>(null);
  const [miroir, setMiroir] = useState(true);
  useEffect(() => {
    /* Le scanner de la page ne charge MediaPipe qu'à l'approche de l'écran
       (PR 363) : sans cette demande, il restait hors de vue et l'encart
       recopiait la photo sans maillage (JP, 13/10). */
    demanderMaillage();
    let id = 0;
    const pas = () => {
      const source = document.querySelector<HTMLCanvasElement>("#diagnostic-facemesh-slot canvas");
      if (!source) {
        setMiroir(false);
        return;
      }
      const c = toile.current;
      const g = c?.getContext("2d");
      if (c && g && source.width && source.height) {
        const w = Math.round(c.clientWidth * window.devicePixelRatio);
        const h = Math.round(c.clientHeight * window.devicePixelRatio);
        if (c.width !== w) c.width = w;
        if (c.height !== h) c.height = h;
        const k = Math.max(w / source.width, h / source.height);
        g.clearRect(0, 0, w, h);
        g.drawImage(source, (w - source.width * k) / 2, (h - source.height * k) / 2, source.width * k, source.height * k);
      }
      id = requestAnimationFrame(pas);
    };
    pas();
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className="lyv-diag-visage">
      {miroir ? <canvas ref={toile} /> : <FaceMeshScanner imageUrl={diagnosticFace} />}
      <span className="lyv-diag-pilule">Diagnostic en cours</span>
    </div>
  );
}

/* L'Expert routine de la boutique : le visage scanné, comme le pop-up qui
   s'ouvre après « Faire mon diagnostic de peau » (JP, 10/10/2026). Le
   maillage est reflété, comme pour le Diagnostiqueur : un second MediaPipe
   restait figé sur la photo (vu en ligne le 10/10). */
function LoupeScan() {
  return (
    <div className="lyv-loupe lyv-loupe-html lyv-diag" aria-hidden="true">
      <MiroirVisage />
    </div>
  );
}

/* Le Photographe IA : le packshot de la marque, et les photos qu'il en a tirées
   le 09/10 avec lystes.ai/shot, comme la diapo 11 du deck (JP, 10/10). */
const PHOTOS_STUDIO = [1, 4, 3, 9, 8, 6].map((n) => `/demo-eclose/img/shot-${n}.webp`);
function LoupeStudio() {
  return (
    <div className="lyv-loupe lyv-loupe-html lyv-studio" aria-hidden="true">
      <figure>
        <img src="/demo-eclose/img/produit.webp" alt="" />
        <figcaption>Le packshot</figcaption>
      </figure>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#231e1f" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
      <div className="lyv-studio-grille">
        {PHOTOS_STUDIO.map((src) => <img key={src} src={src} alt="" />)}
      </div>
    </div>
  );
}

/* ---------- L'encart de visite ---------- */
export type Pied = {
  actif: number;
  duree: number;
  total: number;
  cle: string;
  lecture: boolean;
  fin: () => void;
  precedent: () => void;
  suivant: () => void;
};
export function Encart({ agent, loupe, pointe, pied, survol, style, enFlux }: {
  agent: Agent;
  loupe: ReactNode;
  pointe: Pointe | null;
  pied: Pied;
  survol: (s: boolean) => void;
  style?: CSSProperties;
  /* Sous la fiche, sur téléphone : sans pointe. */
  enFlux?: boolean;
}) {
  return (
    <div
      className={"lyv-encart" + (enFlux ? " en-flux" : "")}
      style={style}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") survol(true); }}
      onPointerLeave={() => survol(false)}
    >
      {pointe && (
        <span
          className={`lyv-pointe ${pointe.cote}`}
          style={pointe.cote === "gauche" || pointe.cote === "droite" ? { top: pointe.decalage } : { left: pointe.decalage }}
          aria-hidden="true"
        />
      )}
      {loupe}
      <div className="lyv-encart-texte" key={`${pied.cle}-t`} aria-live={enFlux ? "polite" : undefined}>
        <b>{agent.nom}</b>
        <p>{agent.role}</p>
        {/* Les étapes de /bio n'ont que leur texte. */}
        {agent.unique && (
          <>
            <h4>En quoi {agent.elle ? "elle" : "il"} est unique&#8239;?</h4>
            <p>{agent.unique}</p>
          </>
        )}
      </div>
    </div>
  );
}

/* Sur ordinateur, l'encart se pose à côté du point, la pointe vers lui. Sa
   hauteur dépend de la loupe : on la mesure, puis on le place. Sa hauteur
   remonte aussi à la scène (MesureEncart), qui choisit la présentation.
   `poseDirecte` (Vos outils, Votre entreprise) : la première pose se fait à
   la hauteur mesurée, sans glisser depuis la hauteur supposée de 320 px ;
   un encart de 160 px descendait de 80 px à chaque étape (relecture du
   10/10). */
export function EncartPose({ point, cote, cadre, largeur, contenu, poseDirecte, serrer, hors, plancher }: {
  point: Point | null;
  cote: Cote;
  cadre: { w: number; h: number };
  largeur: number;
  contenu: (pointe: Pointe | null, style: CSSProperties) => ReactNode;
  poseDirecte?: boolean;
  /* L'encart reste du côté demandé, quitte à se resserrer jusqu'à `min` et à
     déborder de `deborde` px dans la marge grise du visuel : dans l'orbital,
     basculé à droite, il cachait la vue qu'il présente (relecture du 10/10). */
  serrer?: { min: number; deborde: number };
  /* L'encart sort du cadre vers la droite (voir useMargeDroite). */
  hors?: Hors | null;
  /* Posé sur la fiche (photo, QR code), l'encart ne monte pas sur le titre
     ni sur le prix : il descend sous ce y quand il passe à gauche de ce x. */
  plancher?: Point | null;
}) {
  const boite = useRef<HTMLDivElement>(null);
  const horsRef = useRef(hors);
  horsRef.current = hors;
  const [h, setH] = useState(320);
  const mesure = useContext(MesureEncart);
  const mesureRef = useRef(mesure);
  mesureRef.current = mesure;
  const pleine = Math.min(largeur, cadre.w - 8);
  /* La place du côté demandé, sans puis avec le débord dans la marge grise :
     gauche = du bord au point, droite = du point au bord. S'il manque moins
     que le débord, l'encart reste du côté demandé au lieu de basculer sur le
     contenu (Page FAQ IA : le point au bout des boutons d'en-tête laissait
     moins que sa largeur à droite, l'encart se posait à gauche, sur le titre —
     relecture du 11/10). */
  const normale = !point || !serrer ? Infinity
    : cote === "gauche" ? point.x - ECART - 4
    : cote === "droite" ? cadre.w - 4 - (point.x + ECART)
    : Infinity;
  const serre = !hors && normale < pleine && normale + serrer.deborde >= serrer.min;
  const l = hors ? largeurHors(hors, largeur)
    : serre ? Math.min(Math.floor(normale + serrer.deborde), pleine) : pleine;
  /* Serré, l'encart se place dans le cadre élargi du débord. */
  const poser = (hh: number): Placement => {
    if (hors) return placerHors(point, l, hh, cadre, hors);
    const pl = poserDedans(hh);
    if (!plancher || !pl.pointe || pl.pointe.cote === "haut" || pl.pointe.cote === "bas" || pl.x >= plancher.x || pl.y >= plancher.y) return pl;
    const y = Math.max(pl.y, Math.min(plancher.y, cadre.h - hh - 4));
    return { ...pl, y, pointe: { ...pl.pointe, decalage: pl.pointe.decalage - (y - pl.y) } };
  };
  const poserDedans = (hh: number): Placement => {
    if (!serre || !point || !serrer) return placer(point, cote, l, hh, cadre);
    const d = serrer.deborde;
    if (cote === "gauche") {
      const pl = placer({ x: point.x + d, y: point.y }, cote, l, hh, { w: cadre.w + d, h: cadre.h });
      return { ...pl, x: pl.x - d };
    }
    return placer(point, cote, l, hh, { w: cadre.w + d, h: cadre.h });
  };
  useLayoutEffect(() => {
    const el = boite.current;
    if (!el) return;
    if (poseDirecte) {
      const premiere = poser(el.offsetHeight);
      el.style.transition = "none";
      el.style.left = `${premiere.x}px`;
      el.style.top = `${premiere.y}px`;
      void el.offsetHeight;
      el.style.transition = "";
    }
    /* La hauteur remonte à la scène une fois stable (400 ms) : pendant
       qu'une loupe se charge, l'encart passe un instant par 513 px, et cette
       mesure fugitive faisait basculer la scène en une colonne. */
    let attente = 0;
    const maj = () => {
      setH(el.offsetHeight);
      window.clearTimeout(attente);
      /* Sorti du cadre, l'encart n'a pas à tenir dans sa hauteur. */
      attente = window.setTimeout(() => { if (!horsRef.current) mesureRef.current?.(el.offsetHeight); }, 400);
    };
    maj();
    const ro = new ResizeObserver(maj);
    ro.observe(el);
    return () => {
      ro.disconnect();
      window.clearTimeout(attente);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- la première pose seulement
  const pl = poser(h);
  /* Le trait qui relie le point à la pointe, quand l'encart sorti s'en
     éloigne plus que l'écart ordinaire. */
  const trait = hors && point && pl.pointe ? pl.x - point.x - ECART : 0;
  return (
    <div ref={boite} className={"lyv-encart-pose" + (hors ? " hors" : "") + (hors && l < LARGEUR_ENCART ? " etroit" : "")} style={{ left: pl.x, top: pl.y, width: l }}>
      {trait > 2 && pl.pointe && (
        <span className="lyv-liaison" style={{ left: -(trait + ECART) + 7, width: trait + ECART - 7 - 3, top: pl.pointe.decalage }} aria-hidden="true" />
      )}
      {contenu(pl.pointe, {})}
    </div>
  );
}

/* L'encart sorti : à droite du contenu, dans la marge ; s'il n'y tient
   pas, collé à la gouttière de l'écran, à cheval sur le bord du contenu.
   Toujours à la hauteur du point, la pointe à gauche. */
function placerHors(p: Point | null, l: number, h: number, cadre: { w: number; h: number }, hors: Hors): Placement {
  const borne = (v: number, min: number, max: number) => Math.max(min, Math.min(v, Math.max(min, max)));
  if (!p) return { x: gaucheHors(hors, -Infinity, l), y: borne((cadre.h - h) / 2, 4, cadre.h - h - 4), pointe: null };
  const x = gaucheHors(hors, p.x, l);
  /* À cheval sur le titre et le prix de la fiche : jamais au-dessus du
     plancher, sauf pour rester en face du point. Le bas du cadre passe
     avant : dessous, à droite, il y a les boutons de la visite. */
  const haut = hors.plancher && x < hors.plancher.x ? Math.max(4, Math.min(hors.plancher.y, p.y - 14)) : 4;
  const y = Math.max(4, Math.min(Math.max(p.y - h / 2, haut), cadre.h - h - 4));
  return { x, y, pointe: { cote: "gauche", decalage: Math.max(10, Math.min(p.y - y, h - 10)) } };
}

/* ---------- Les agents : liste sur ordinateur, carrousel sur téléphone ---------- */
export function Liste({ agents, actif, cle, duree, lecture, choisir }: {
  agents: Agent[];
  actif: number;
  cle: string;
  duree: number;
  lecture: boolean;
  choisir: (i: number) => void;
}) {
  const liste = useRef<HTMLOListElement>(null);
  /* Le défilement automatique cale le haut de la zone sur le haut d'un agent,
     jamais au milieu d'un agent : à 1440, « Graphiste IA » sortait tranché en
     haut de la liste (relecture du 10/10). L'agent en cours reste entier. */
  useEffect(() => {
    const ol = liste.current;
    const ligne = ol?.children[actif] as HTMLElement | undefined;
    const zone = ol?.parentElement;
    if (!ol || !ligne || !zone) return;
    const haut = ligne.offsetTop - zone.offsetTop;
    const bas = haut + ligne.offsetHeight;
    if (haut >= zone.scrollTop && bas <= zone.scrollTop + zone.clientHeight) return;
    const hauts = [...ol.children].map((c) => (c as HTMLElement).offsetTop - zone.offsetTop);
    const vise = haut - (zone.clientHeight - ligne.offsetHeight) / 2;
    let top = Math.max(0, ...hauts.filter((h) => h <= vise));
    if (bas > top + zone.clientHeight) top = Math.min(...hauts.filter((h) => h >= bas - zone.clientHeight));
    top = Math.min(top, haut);
    /* Un haut calé au-delà du défilement maximal serait ramené par le
       navigateur au maximum, qui coupe un agent (02 à 1440, relecture du
       11/10) : la marge du bas rend ce haut atteignable. */
    ol.style.paddingBottom = "";
    const max = zone.scrollHeight - zone.clientHeight;
    if (top > max) ol.style.paddingBottom = `${top - max}px`;
    zone.scrollTo({ top, behavior: "smooth" });
  }, [actif]);
  /* Un fondu là où la liste continue : en haut quand elle a défilé, en bas
     tant qu'il reste des agents dessous. */
  useEffect(() => {
    const zone = liste.current?.parentElement;
    if (!zone) return;
    const maj = () => {
      zone.style.setProperty("--lyv-fh", zone.scrollTop > 1 ? "10px" : "0px");
      zone.style.setProperty("--lyv-fb", zone.scrollTop + zone.clientHeight < zone.scrollHeight - 1 ? "28px" : "0px");
    };
    maj();
    zone.addEventListener("scroll", maj, { passive: true });
    const ro = new ResizeObserver(maj);
    ro.observe(zone);
    return () => {
      zone.removeEventListener("scroll", maj);
      ro.disconnect();
    };
  }, []);
  return (
    <ScrollRail className="lyv-liste-zone">
    <ol className="lyv-liste" ref={liste} aria-label="Les agents, un par un">
      {agents.map((a, i) => (
        <li key={a.nom + i}>
          <button
            type="button"
            className={i === actif ? "on" : undefined}
            aria-current={i === actif ? "step" : undefined}
            onClick={() => choisir(i)}
          >
            <span className="lyv-num">{String(i + 1).padStart(2, "0")}</span>
            <span className="lyv-l">
              <b>{a.nom}</b>
              <small>{a.mission}</small>
            </span>
            {i === actif && (
              <i className="lyv-jauge" aria-hidden="true">
                <b key={cle} style={{ animationDuration: `${duree}ms`, animationPlayState: lecture ? "running" : "paused" }} />
              </i>
            )}
          </button>
        </li>
      ))}
    </ol>
    </ScrollRail>
  );
}

/* Sur téléphone (JP, 10/10) : les agents sur une seule ligne, « 01 Expert
   produit IA » et sa barre de progression ; la ligne glisse d'un agent à
   l'autre au fil de la visite. Le défilement reste dans la ligne, jamais dans
   la page. */
export function Defile({ agents, actif, cle, duree, lecture, choisir }: {
  agents: Agent[];
  actif: number;
  cle: string;
  duree: number;
  lecture: boolean;
  choisir: (i: number) => void;
}) {
  const piste = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const p = piste.current;
    const c = p?.children[actif] as HTMLElement | undefined;
    if (!p || !c) return;
    /* Mesuré par rapport à la ligne elle-même : `offsetLeft` partait du bord
       de la page, et dans une scène décalée la ligne défilait trop loin,
       l'agent actif coupé (« n IA », relecture du 10/10). */
    const gauche = c.getBoundingClientRect().left - p.getBoundingClientRect().left + p.scrollLeft;
    p.scrollTo({ left: gauche - 16, behavior: "smooth" });
  }, [actif]);
  return (
    <ol className="lyv-defile" ref={piste} aria-label="Les agents, un par un">
      {agents.map((a, i) => (
        <li key={a.nom + i}>
          <button
            type="button"
            className={i === actif ? "on" : undefined}
            aria-current={i === actif ? "step" : undefined}
            onClick={() => choisir(i)}
          >
            <span className="lyv-num">{String(i + 1).padStart(2, "0")}</span>
            <b>{a.nom}</b>
            {i === actif && (
              <i className="lyv-jauge" aria-hidden="true">
                <b key={cle}
                  style={{ animationDuration: `${duree}ms`, animationPlayState: lecture ? "running" : "paused" }} />
              </i>
            )}
          </button>
        </li>
      ))}
    </ol>
  );
}

/* La navigation de la visite sur téléphone, comme sur la capture de JP du
   10/10 : « 1 / 10 », la jauge, précédent, pause, suivant. Sa jauge cadence
   la visite sur téléphone. */
const Icone = ({ d }: { d: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);
export function Navigation({ pied, enPause, basculer }: { pied: Pied; enPause: boolean; basculer: () => void }) {
  return (
    <div className="lyv-nav">
      <span className="lyv-nav-compte">{pied.actif + 1} / {pied.total}</span>
      <span className="lyv-nav-jauge" aria-hidden="true">
        <b key={pied.cle} onAnimationEnd={pied.fin}
          style={{ animationDuration: `${pied.duree}ms`, animationPlayState: pied.lecture ? "running" : "paused" }} />
      </span>
      <button type="button" onClick={pied.precedent} aria-label="Agent précédent"><Icone d="m15 18-6-6 6-6" /></button>
      <button type="button" onClick={basculer} aria-label={enPause ? "Reprendre la visite" : "Mettre la visite en pause"}>
        {enPause ? <Icone d="M7 4v16l13-8z" /> : <Icone d="M8 5v14M16 5v14" />}
      </button>
      <button type="button" onClick={pied.suivant} aria-label="Agent suivant"><Icone d="m9 18 6-6-6-6" /></button>
    </div>
  );
}

function Organigramme({ tete, sous, cerveau, colonnes, humain }: {
  tete: string;
  sous: string;
  cerveau?: [string, string];
  colonnes: Colonne[];
  humain?: boolean;
}) {
  return (
    <div className={"lyv-orga" + (humain ? " humain" : "")}>
      <div className="lyv-orga-tete">
        <strong>{tete}</strong>
        <span>{sous}</span>
      </div>
      {cerveau && (
        <>
          <span className="lyv-trait" aria-hidden="true" />
          <div className="lyv-cerveau">
            <strong>{cerveau[0]}</strong>
            <span>{cerveau[1]}</span>
          </div>
        </>
      )}
      <span className="lyv-trait" aria-hidden="true" />
      <div className="lyv-cols">
        {colonnes.map((c) => (
          <div className="lyv-col" key={c.titre}>
            <div className="lyv-col-titre">{c.titre}</div>
            {c.cartes.map(([n, d]) => (
              <div className="lyv-carte" key={n}>
                <b>{n}</b>
                <span>{d}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Étage 2 : la boutique et l'orbital ---------- */
function Boutique({ etape, survol, mobile, pied, taille, marge }: {
  etape: number;
  survol: (s: boolean) => void;
  mobile: boolean;
  pied: Pied;
  taille: (t: TailleCadre) => void;
  /* Deux colonnes : l'encart peut sortir dans la marge de droite. */
  marge?: boolean;
}) {
  const boite = useRef<HTMLDivElement>(null);
  const cadres = useRef<Partial<Record<PageBoutique, HTMLIFrameElement | null>>>({});
  const [echelle, setEchelle] = useState(0);
  const [cadre, setCadre] = useState<{ w: number; h: number } | null>(null);
  const [point, setPoint] = useState<Point | null>(null);
  const [prets, setPrets] = useState<Partial<Record<PageBoutique, boolean>>>({});
  const cible = ETAPES_BOUTIQUE[etape];
  const hors = useMargeDroite(boite, !mobile && !!marge);
  /* Lu par la mesure du point, qui tourne à chaque image. */
  const horsRef = useRef(hors);
  horsRef.current = hors;
  /* Sans zone (multi-lien), la page reste celle de l'étape d'avant. */
  const pageVue = useRef<PageBoutique>("index");
  if (cible) pageVue.current = cible.page;
  const page = pageVue.current;
  /* La souris dans une page ne remonte pas jusqu'au cadre : chaque page
     signale elle-même le survol, pour que la visite s'arrête sous la souris. */
  const survolRef = useRef(survol);
  survolRef.current = survol;

  useLayoutEffect(() => {
    const b = boite.current;
    if (!b) return;
    const maj = () => {
      setEchelle(b.clientWidth / ECRAN_BOUTIQUE.w);
      setCadre({ w: b.clientWidth, h: b.clientHeight });
      taille({ w: b.clientWidth, h: b.clientHeight });
    };
    maj();
    const ro = new ResizeObserver(maj);
    ro.observe(b);
    return () => ro.disconnect();
  }, [taille]);

  /* Une fois une page chargée : son style de démonstration, ses liens
     neutralisés (le widget, lui, reste entièrement vivant), son survol. */
  const charge = useCallback((p: PageBoutique) => {
    const doc = cadres.current[p]?.contentDocument;
    if (!doc?.head) return;
    if (!doc.getElementById("lyv-demo-boutique")) {
      const st = doc.createElement("style");
      st.id = "lyv-demo-boutique";
      st.textContent = STYLE_BOUTIQUE;
      doc.head.appendChild(st);
      doc.addEventListener("click", (e) => {
        const t = e.target as Element | null;
        if (t?.closest("a") && !t.closest(FENETRE)) e.preventDefault();
      }, true);
      doc.addEventListener("pointerover", (e) => { if (e.pointerType === "mouse") survolRef.current(true); });
      doc.documentElement.addEventListener("pointerleave", () => survolRef.current(false));
    }
    setPrets((v) => (v[p] ? v : { ...v, [p]: true }));
  }, []);

  /* L'étape met la page en état : orbital ouvert ou fermé, son panneau,
     la page défilée jusqu'à la zone. Puis le point et la zone claire suivent
     l'élément, mesuré dans la page et ramené à l'échelle du cadre. */
  useEffect(() => {
    if (!prets[page]) return;
    const fen = cadres.current[page]?.contentWindow as (Window & { LystesBrandCall?: ApiOrbital }) | null;
    const doc = cadres.current[page]?.contentDocument;
    if (!fen || !doc) return;
    let fini = false;
    const minuteurs: number[] = [];
    const plus_tard = (f: () => void, ms: number) => { minuteurs.push(window.setTimeout(f, ms)); };
    let essais = 0;
    const regler = () => {
      if (fini) return;
      const api = fen.LystesBrandCall;
      if (!api) { if (essais++ < 40) plus_tard(regler, 250); return; }
      if (!cible) {
        if (doc.querySelector("#lystes-brandcall-ui.on")) api.end?.("visite");
        return;
      }
      const fenetre = doc.querySelector(FENETRE);
      const ouvert = !!fenetre?.classList.contains("on");
      /* L'appel : la barre d'appel du widget en mode d'essai, sans micro ni
         session ; elle se referme dès que l'étape change. */
      const appelOuvert = !!doc.querySelector("#lystes-brandcall-ui.on");
      if (cible.appel && !appelOuvert && api._debugBoot) {
        if (ouvert) api.closeChat();
        api._debugBoot();
        plus_tard(() => {
          if (fini) return;
          api._debugPhase?.("live");
          /* _debugPhase("live") n'éteint pas la bulle « Connexion à l'assistante… » */
          doc.getElementById("lystes-brandcall-status")?.classList.remove("on");
        }, 1800);
      } else if (!cible.appel && appelOuvert) {
        api.end?.("visite");
      }
      if (!cible.orbital) {
        if (ouvert) api.closeChat();
      } else {
        if (!ouvert) api.openChat();
        plus_tard(() => {
          if (fini) return;
          /* Chaque étape repart de la discussion : panneau refermé, onglet
             « Discussion » ; puis elle ouvre le sien. */
          if (doc.querySelector(".lystes-bc-library.on")) {
            doc.querySelector<HTMLElement>(".lystes-bc-library-back")?.click();
          }
          if (cible.vue !== "panier" && doc.querySelector(`${FENETRE} [data-bc="tab-cart"].on`)) {
            doc.querySelector<HTMLElement>(`${FENETRE} [data-bc="tab-chat"]`)?.click();
          }
          if (cible.vue) doc.querySelector<HTMLElement>(`${FENETRE} [data-bc="${BOUTON_VUE[cible.vue]}"]`)?.click();
        }, ouvert ? 0 : 450);
      }
      /* La page défile jusqu'à la zone, ou revient en haut. */
      /* Ni l'orbital ni la barre d'appel ne défilent avec la page : elle reste en haut. */
      const el = cible.orbital || cible.appel ? null : doc.querySelector(cible.sel);
      let haut = 0;
      if (el) {
        const r = el.getBoundingClientRect();
        const absolu = r.top + fen.scrollY;
        if (absolu + Math.min(r.height, 200) > ECRAN_BOUTIQUE.h - 40) {
          haut = absolu - Math.max(40, (ECRAN_BOUTIQUE.h - Math.min(r.height, ECRAN_BOUTIQUE.h - 80)) / 2);
        }
      }
      fen.scrollTo({ top: Math.max(0, haut), behavior: "smooth" });
    };
    regler();
    let raf = 0;
    const k = echelle;
    const echelonner = (r: DOMRect): Rect => ({ x: r.left * k, y: r.top * k, w: r.width * k, h: r.height * k });
    const mesurer = () => {
      if (fini) return;
      const el = cible ? doc.querySelector(cible.sel) : null;
      const r = el?.getBoundingClientRect();
      const q = cible && r && r.width > 0 ? pointHors(echelonner(r), cible.prise, horsRef.current) : null;
      /* repeindre seulement quand le point bouge vraiment */
      const proche = (a: number, b: number) => Math.abs(a - b) < 0.5;
      setPoint((p) => (!p && !q) || (p && q && proche(p.x, q.x) && proche(p.y, q.y)) ? p : q);
      raf = window.requestAnimationFrame(mesurer);
    };
    raf = window.requestAnimationFrame(mesurer);
    return () => { fini = true; window.cancelAnimationFrame(raf); minuteurs.forEach((m) => window.clearTimeout(m)); };
  }, [prets, page, cible, echelle]);

  const encart = (pointe: Pointe | null, style: CSSProperties, enFlux?: boolean) => (
    <Encart
      agent={AGENTS_BOUTIQUE[etape]}
      loupe={loupeBoutique(cible)}
      pointe={pointe}
      pied={pied}
      survol={survol}
      style={style}
      enFlux={enFlux}
    />
  );
  return (
    <div
      className={"lyv-boutique" + (mobile ? "" : " lyv-b-deborde")}
      ref={boite}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") survol(true); }}
      onPointerLeave={() => survol(false)}
    >
      {PAGES_BOUTIQUE.map((p) => (
        <iframe
          key={p}
          ref={(n) => { cadres.current[p] = n; }}
          className={"lyv-boutique-page" + (p === page ? " on" : "")}
          src={`/demo-eclose-boutique/${p}.html`}
          title={p === page ? "La boutique Éclose Paris et son orbital" : ""}
          aria-hidden={p === page ? undefined : true}
          tabIndex={p === page ? undefined : -1}
          loading="lazy"
          onLoad={() => charge(p)}
          style={{ width: ECRAN_BOUTIQUE.w, height: ECRAN_BOUTIQUE.h, transform: `scale(${echelle})`,
            borderRadius: echelle && !mobile ? 14 / echelle : undefined }}
        />
      ))}
      {point && <span className="lyv-pouls" style={{ left: point.x, top: point.y }} aria-hidden="true" />}
      {cadre && !mobile && (
        <EncartPose
          key={`b${etape}`}
          point={point}
          cote={cible?.cote ?? "gauche"}
          cadre={cadre}
          largeur={LARGEUR_ENCART}
          serrer={cible?.orbital ? { min: 180, deborde: 24 } : undefined}
          hors={hors}
          contenu={(pointe, style) => encart(pointe, style)}
        />
      )}
    </div>
  );
}

/* La boutique n'a pas de loupe (JP, 10/10/2026 : la vraie page montre déjà
   l'endroit) ; seul l'Expert routine montre le scan de peau. */
function loupeBoutique(cible: Cible): ReactNode {
  return cible?.scan ? <LoupeScan /> : null;
}

/* ---------- Étages 3 et 4 : les visites chargées à la demande ---------- */
type ModuleOutils = typeof import("./vision/VisiteOutils");
type ModuleEntreprise = typeof import("./vision/VisiteBackOffice");
type ModuleEquipes = typeof import("./vision/VisiteEquipes");
type ModuleSite = typeof import("./vision/VisiteSiteVitrine");
type Visites = { outils?: ModuleOutils; entreprise?: ModuleEntreprise; equipes?: ModuleEquipes; siteweb?: ModuleSite };
const CHARGER_VISITE = {
  outils: () => import("./vision/VisiteOutils"),
  entreprise: () => import("./vision/VisiteBackOffice"),
  equipes: () => import("./vision/VisiteEquipes"),
  siteweb: () => import("./vision/VisiteSiteVitrine"),
} as const;
type IdVisite = keyof typeof CHARGER_VISITE;
const estVisite = (id: string): id is IdVisite => id in CHARGER_VISITE;

/* /bio : la fiche de démonstration de l'accueil, en iframe. La fiche écrit
   sa hauteur réduite dans data-hauteur (demo-eclose/demo.js) : le cadre la
   suit, sans bande blanche dessous. */
function FicheDemo({ src }: { src: string }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [hauteur, setHauteur] = useState<number | null>(null);
  useEffect(() => {
    const lire = () => {
      try {
        const h = Number(ref.current?.contentDocument?.documentElement.getAttribute("data-hauteur"));
        if (h > 0) setHauteur((v) => (v === h ? v : h));
      } catch { /* autre origine : le format par défaut reste */ }
    };
    lire();
    const id = window.setInterval(lire, 500);
    return () => window.clearInterval(id);
  }, []);
  return (
    <iframe ref={ref} src={src} className="lyv-fiche-ecran" loading="lazy"
      style={hauteur ? { height: hauteur, aspectRatio: "auto" } : undefined}
      title="Fiche produit de démonstration : l’expert produit IA au travail" />
  );
}

/* /bio : le carrousel d'une étape à plusieurs visuels (JP, 13/10/2026 :
   « un carrousel plutôt »). Les visuels glissent, la suivante dépasse de
   15 % ; des points de pagination ; le doigt fait glisser (défilement natif
   aimanté). L'avance automatique est pilotée par la scène (`index`) ; un
   glissé à la main remonte l'index par `choisir`. Le même composant sert au
   packaging Cléa et aux colis reçus. */
function CarrouselBio({ diapos, index, choisir }: { diapos: readonly MediaEtape[]; index: number; choisir: (i: number) => void }) {
  const piste = useRef<HTMLDivElement>(null);
  const indexRef = useRef(index);
  indexRef.current = index;
  /* L'index change : la piste glisse jusqu'à la diapositive. */
  useEffect(() => {
    const el = piste.current;
    const d = el?.children[index] as HTMLElement | undefined;
    if (!el || !d) return;
    el.scrollTo({ left: d.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, [index]);
  /* Un glissé à la main : l'index suit la diapositive arrivée au bord. */
  useEffect(() => {
    const el = piste.current;
    if (!el) return;
    let t = 0;
    const fin = () => {
      const kids = [...el.children] as HTMLElement[];
      let mieux = 0;
      kids.forEach((k, i) => {
        if (Math.abs(k.offsetLeft - el.offsetLeft - el.scrollLeft) < Math.abs(kids[mieux].offsetLeft - el.offsetLeft - el.scrollLeft)) mieux = i;
      });
      if (mieux !== indexRef.current) choisir(mieux);
    };
    const defile = () => { window.clearTimeout(t); t = window.setTimeout(fin, 140); };
    el.addEventListener("scroll", defile, { passive: true });
    return () => { el.removeEventListener("scroll", defile); window.clearTimeout(t); };
  }, [choisir]);
  return (
    <div className="lyv-carrousel">
      <div className="lyv-carrousel-piste" ref={piste}>
        {diapos.map((d, i) => (
          <div className="lyv-carrousel-diapo" key={d.src + i} style={{ "--lyv-pos": d.position ?? "50% 50%" } as CSSProperties}>
            {d.type === "video"
              ? <SafeVideo src={d.src} poster={d.affiche} className="lyv-carrousel-el" />
              : <img src={d.src} alt={d.legende.join("")} className="lyv-carrousel-el" loading="lazy" decoding="async" />}
          </div>
        ))}
      </div>
      <div className="lyv-carrousel-points" role="tablist" aria-label="Visuels de l’étape">
        {diapos.map((d, i) => (
          <button key={d.src + i} type="button" role="tab" aria-selected={i === index} aria-label={`Visuel ${i + 1} sur ${diapos.length}`}
            className={i === index ? "on" : undefined} onClick={() => choisir(i)} />
        ))}
      </div>
    </div>
  );
}

export default function VisionEtages({ secteur = "ecommerce", tete, scene, texte, legende, visuel, pastilles, apres, demo }: Props) {
  const corpo = secteur === "corporate";
  const bio = secteur === "bio";
  const ONGLETS: readonly Onglet[] = corpo ? ONGLETS_CORPORATE : bio ? ONGLETS_BIO_VUE : ONGLETS_ECOMMERCE;
  const [onglet, setOnglet] = useState(0);
  const [etape, setEtape] = useState(0);
  const [tour, setTour] = useState(0);
  /* Mouvement réduit : la visite ne part pas seule, « Suivant » la mène. */
  const [enPause, setEnPause] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [survol, setSurvol] = useState(false);
  const [vu, setVu] = useState(false);
  const [fiche, setFiche] = useState<MesureFiche | null>(null);
  const [telephone, setMobile] = useState(() => window.matchMedia("(max-width: 720px)").matches);
  /* À partir de 1100 px, la scène peut tenir en deux colonnes. */
  const [largeEcran, setLargeEcran] = useState(() => window.matchMedia("(min-width: 1100px)").matches);
  /* La largeur de la scène et celle de la cellule du visuel. */
  const [geoScene, setGeoScene] = useState<{ scene: number; cellule: number }>({ scene: 0, cellule: 0 });
  /* Le cadre du visuel de l'onglet en cours, annoncé par le visuel lui-même
     (la fiche se mesure à part), et la plus haute hauteur d'encart relevée
     sur chaque onglet. */
  const [tailleVisuel, setTailleVisuel] = useState<{ onglet: string } & TailleCadre | null>(null);
  const [hauteurEncart, setHauteurEncart] = useState<Record<string, number>>({});
  const [visites, setVisites] = useState<Visites>({});
  /* Vos outils et Votre entreprise : la jauge attend que l'écran de l'étape
     soit dessiné et que le point ait trouvé sa cible (relecture du 10/10 :
     elle tournait pendant le chargement, encart seul au milieu). */
  const [pretePour, setPretePour] = useState<string | null>(null);
  /* Au téléphone, la ligne d'agents et l'encart attendent que l'écran de
     l'onglet soit prêt une première fois : l'encart s'affichait sous un cadre
     blanc (relecture du 10/10). Ensuite, ils restent, sans clignoter d'une
     étape à l'autre. */
  const [dejaPrete, setDejaPrete] = useState<Partial<Record<IdVisite, boolean>>>({});
  const boutons = useRef<(HTMLButtonElement | null)[]>([]);
  const dernier = useRef("");
  const refPastilles = useRef<HTMLElement | null>(pastilles);
  refPastilles.current = pastilles;

  const courant = ONGLETS[onglet];
  const idVisite = estVisite(courant.id) ? courant.id : null;
  /* L'encart tient-il à côté du point, dans le cadre tel qu'il est ? */
  const cadreCourant: TailleCadre | null = courant.id === "produits"
    ? fiche?.cadre ?? null
    : tailleVisuel && tailleVisuel.onglet === courant.id ? tailleVisuel : null;
  const encartMax = Math.max(HAUTEUR_ENCART[courant.id] ?? 250, hauteurEncart[courant.id] ?? 0);
  const tientDans = (w: number, h: number) => (cadreCourant?.largeurMin
    ? w >= cadreCourant.largeurMin
    : h >= encartMax + 8 && w >= LARGEUR_ENCART + 8);
  /* Dans le cadre tel qu'il est. */
  const tient = !cadreCourant || !cadreCourant.w || tientDans(cadreCourant.w, cadreCourant.h);
  /* Dans le cadre qu'aurait le visuel en deux colonnes : la cellule du
     visuel y fait la scène moins la colonne de texte et l'écart, le cadre
     garde ses marges et sa proportion. Calculé, pas essayé : la scène ne
     bascule pas d'une présentation à l'autre pendant les mesures. */
  const tientEnDeux = (() => {
    if (!cadreCourant || !cadreCourant.w || !geoScene.scene || !geoScene.cellule) return true;
    const cellule2 = (geoScene.scene - ECART_COLONNES) * 0.7;
    const w2 = cellule2 - (geoScene.cellule - cadreCourant.w);
    return tientDans(w2, (cadreCourant.h * w2) / cadreCourant.w);
  })();
  /* Une colonne sous 1100 px, et dès que l'encart ne tiendrait pas à côté
     du point en deux colonnes : jamais d'encart sous le visuel à côté du
     texte (JP, 10/10 nuit : « jamais d'entre-deux »). */
  const uneColonne = !largeEcran || telephone || !tientEnDeux;
  /* Présentation téléphone : l'encart sous le visuel. */
  const mobile = telephone || !tient;
  const agents = courant.etapes ? courant.etapes : courant.id === "produits" ? AGENTS_FICHE : courant.id === "ecommerce" ? AGENTS_BOUTIQUE
    : courant.id === "outils" ? visites.outils?.agentsOutils(secteur) ?? null
    : courant.id === "entreprise" ? visites.entreprise?.agentsEntreprise(secteur) ?? null
    : courant.id === "equipes" ? visites.equipes?.agentsEquipes(secteur) ?? null
    : courant.id === "siteweb" ? visites.siteweb?.AGENTS_SITE ?? null
    : null;
  const fenetreOuverte = courant.id === "produits" && !!fiche?.fenetreOuverte;
  /* La clé relance la jauge à chaque étape, et à chaque tour complet. */
  const cle = `${courant.id}-${etape}-${tour}`;
  const cleEtape = `${courant.id}-${etape}`;
  const signalerPrete = useCallback((p: boolean) => {
    setPretePour(p ? cleEtape : null);
    if (p && idVisite) setDejaPrete((v) => (v[idVisite] ? v : { ...v, [idVisite]: true }));
  }, [cleEtape, idVisite]);
  const lecture = !!agents && vu && !enPause && !survol && !fenetreOuverte && (!idVisite || pretePour === cleEtape);

  /* /bio : une étape à plusieurs visuels les fait défiler au rythme de la
     jauge (en pause avec elle), et repart du premier à chaque passage. */
  const mediaCourant = courant.etapes ? mediaEtape(courant.etapes, etape) : undefined;
  const nbDiapos = mediaCourant?.type === "diapos" ? mediaCourant.diapos?.length ?? 0 : 0;
  const intervalleDiapos = mediaCourant?.intervalle ?? 3000;
  const [diapo, setDiapo] = useState(0);
  useEffect(() => { setDiapo(0); }, [cle]);
  useEffect(() => {
    if (nbDiapos < 2 || !lecture) return;
    /* Un délai par diapositive : après un glissé au doigt, le compte repart. */
    const id = window.setTimeout(() => setDiapo((d) => (d + 1) % nbDiapos), intervalleDiapos);
    return () => window.clearTimeout(id);
  }, [nbDiapos, lecture, intervalleDiapos, cle, diapo]);

  const ongletId = courant.id;
  const annoncerTaille = useCallback((t: TailleCadre) => {
    setTailleVisuel((o) => (o && o.onglet === ongletId && o.w === t.w && o.h === t.h && o.largeurMin === t.largeurMin ? o : { onglet: ongletId, ...t }));
  }, [ongletId]);
  const mesurerEncart = useCallback((h: number) => {
    if (!h) return;
    setHauteurEncart((v) => (h > (v[ongletId] ?? 0) ? { ...v, [ongletId]: h } : v));
  }, [ongletId]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const large = window.matchMedia("(min-width: 1100px)");
    const maj = () => setMobile(mq.matches);
    const majLarge = () => setLargeEcran(large.matches);
    mq.addEventListener("change", maj);
    large.addEventListener("change", majLarge);
    return () => {
      mq.removeEventListener("change", maj);
      large.removeEventListener("change", majLarge);
    };
  }, []);

  /* La largeur de la scène et de la cellule du visuel, pour savoir si
     l'encart tiendrait en deux colonnes. */
  useEffect(() => {
    const cellule = demo.parentElement ?? visuel;
    const maj = () => setGeoScene((o) => (o.scene === scene.clientWidth && o.cellule === cellule.clientWidth
      ? o : { scene: scene.clientWidth, cellule: cellule.clientWidth }));
    maj();
    const ro = new ResizeObserver(maj);
    ro.observe(scene);
    ro.observe(cellule);
    return () => ro.disconnect();
  }, [scene, demo, visuel]);

  /* La scène suit : une colonne ou deux. */
  useLayoutEffect(() => {
    scene.classList.toggle("lyv-une-colonne", uneColonne);
  }, [scene, uneColonne]);
  useEffect(() => () => scene.classList.remove("lyv-une-colonne"), [scene]);

  /* En deux colonnes, la liste des agents ne descend pas plus bas que le
     visuel : sinon, une grande zone blanche s'ouvrait sous le visuel. */
  useEffect(() => {
    const maj = () => {
      if (uneColonne) {
        scene.style.removeProperty("--lyv-liste-max");
        return;
      }
      /* La hauteur de ce que montre le visuel (la fiche, ou le cadre de
         l'onglet et sa navigation), pas celle de sa cellule, que la liste
         étire. */
      const contenu = (demo.offsetParent ? demo.offsetHeight : 0) + visuel.offsetHeight;
      const reste = contenu - texte.offsetHeight - 24;
      scene.style.setProperty("--lyv-liste-max", `${Math.max(170, Math.min(430, reste))}px`);
    };
    maj();
    const ro = new ResizeObserver(maj);
    ro.observe(demo);
    ro.observe(visuel);
    ro.observe(texte);
    return () => {
      ro.disconnect();
      scene.style.removeProperty("--lyv-liste-max");
    };
  }, [scene, texte, visuel, demo, uneColonne, courant.id]);

  /* La visite d'un onglet se charge avant son ouverture : quand la scène
     approche de l'écran, au survol ou au toucher de l'onglet, et au plus tard
     au clic. Chargée au clic seulement, « Vos outils » laissait son cadre
     vide 3 à 9 s (relecture du 10/10). Un échec de chargement (version
     publiée entre-temps) revient à l'auto-guérison de l'application
     (`vite:preloadError`) ; le geste suivant le retente. */
  const demandees = useRef(new Set<IdVisite>());
  const charger = useCallback((id: IdVisite) => {
    if (demandees.current.has(id)) return;
    demandees.current.add(id);
    const charge = id === "outils"
      ? CHARGER_VISITE.outils().then((m) => setVisites((v) => ({ ...v, outils: m })))
      : id === "equipes"
        ? CHARGER_VISITE.equipes().then((m) => setVisites((v) => ({ ...v, equipes: m })))
        : id === "siteweb"
          ? CHARGER_VISITE.siteweb().then((m) => setVisites((v) => ({ ...v, siteweb: m })))
          : CHARGER_VISITE.entreprise().then((m) => setVisites((v) => ({ ...v, entreprise: m })));
    charge.catch(() => { demandees.current.delete(id); });
  }, []);
  useEffect(() => {
    if (idVisite) charger(idVisite);
  }, [idVisite, charger]);
  useEffect(() => {
    /* /bio n'a aucune visite à charger. */
    if (bio) return;
    let attente = 0;
    const io = new IntersectionObserver((es) => {
      if (!es.some((e) => e.isIntersecting)) return;
      io.disconnect();
      attente = window.setTimeout(() => {
        charger("outils");
        charger("entreprise");
        charger("equipes");
        if (corpo) charger("siteweb");
      }, 400);
    }, { rootMargin: "100% 0px" });
    io.observe(scene);
    return () => {
      io.disconnect();
      window.clearTimeout(attente);
    };
  }, [scene, charger, corpo, bio]);

  /* La loupe affiche la fiche hors de l'iframe : la police de la fiche doit
     aussi être chargée dans la page. */
  useEffect(() => {
    if (document.querySelector("link[data-lyv-jost]")) return;
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap";
    l.setAttribute("data-lyv-jost", "");
    document.head.appendChild(l);
  }, []);

  /* Le cadre de la fiche n'appartient pas à React (il vient du gabarit) : on
     le masque hors de l'onglet 1 sans le démonter. */
  useEffect(() => {
    demo.style.display = courant.id === "produits" ? "" : "none";
  }, [demo, courant.id]);
  useEffect(() => () => {
    demo.style.display = "";
  }, [demo]);

  /* La scène porte le panneau des onglets. Son id vient du gabarit et ne
     change pas : la page la retrouve par lui. */
  useEffect(() => {
    scene.setAttribute("role", "tabpanel");
    scene.setAttribute("aria-labelledby", `lyv-onglet-${courant.id}`);
  }, [scene, courant.id]);

  /* La visite part quand la scène traverse le milieu de l'écran, quelle que
     soit sa hauteur. */
  useEffect(() => {
    const io = new IntersectionObserver((es) => setVu(es[es.length - 1].isIntersecting), {
      rootMargin: "-35% 0px -35% 0px",
      threshold: 0,
    });
    io.observe(scene);
    return () => io.disconnect();
  }, [scene]);

  /* Sous la souris, sur la fiche, on lit : la visite attend. */
  useEffect(() => {
    const entre = (e: PointerEvent) => { if (e.pointerType === "mouse") setSurvol(true); };
    const sort = () => setSurvol(false);
    demo.addEventListener("pointerenter", entre);
    demo.addEventListener("pointerleave", sort);
    return () => {
      demo.removeEventListener("pointerenter", entre);
      demo.removeEventListener("pointerleave", sort);
    };
  }, [demo]);

  /* Les zones suivent la fiche : elle change de taille avec l'écran, et ses
     fenêtres s'ouvrent par-dessus. */
  useEffect(() => {
    if (courant.id !== "produits") return;
    const maj = () => {
      const m = mesurerFiche(demo);
      const k = m
        ? JSON.stringify([m.cadre, m.boite, m.fenetreOuverte, Object.entries(m.zones).map(([z, r]) => [z, Math.round(r.x), Math.round(r.y), Math.round(r.w), Math.round(r.h)])])
        : "";
      if (k !== dernier.current) {
        dernier.current = k;
        setFiche(m);
      }
    };
    maj();
    const id = window.setInterval(maj, 400);
    window.addEventListener("resize", maj);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", maj);
      /* Au retour sur l'onglet, la première mesure doit repasser. */
      dernier.current = "";
    };
  }, [demo, courant.id]);

  /* Pour la FAQ, les avis et les actualités, la visite ouvre le bon onglet de
     l'espace qui tourne ; ailleurs, elle le laisse tourner seul. */
  useEffect(() => {
    if (courant.id !== "produits") return;
    const iframe = demo.querySelector<HTMLIFrameElement>("iframe.lyv-demo-ecran");
    let api: { onglet?: (n: number | null) => void } | undefined;
    try {
      api = (iframe?.contentWindow as (Window & { demoEclose?: { onglet?: (n: number | null) => void } }) | null)?.demoEclose;
    } catch {
      api = undefined;
    }
    api?.onglet?.(ETAPES_FICHE[etape]?.onglet ?? null);
  }, [demo, courant.id, etape, fiche]);

  const aller = useCallback((i: number) => {
    if (!agents) return;
    setEtape(((i % agents.length) + agents.length) % agents.length);
    setTour((t) => t + 1);
  }, [agents]);
  const suivant = useCallback(() => aller(etape + 1), [aller, etape]);
  /* Les gestes (liste, carrousel, précédent, suivant) ramènent le point à
     l'écran ; l'avance automatique, jamais : elle ne fait pas défiler la page. */
  const geste = useRef(false);
  const choisir = useCallback((i: number) => { geste.current = true; aller(i); }, [aller]);
  const suivantGeste = useCallback(() => choisir(etape + 1), [choisir, etape]);
  const precedentGeste = useCallback(() => choisir(etape - 1), [choisir, etape]);
  useEffect(() => {
    if (!geste.current) return;
    geste.current = false;
    if (mobile) return;
    const pouls = document.querySelector<HTMLElement>(".lyv-pouls");
    if (!pouls) return;
    const r = pouls.getBoundingClientRect();
    if (r.top < 8 || r.bottom > window.innerHeight - 8) pouls.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [etape, tour, mobile]);

  /* Sous 768 px, la pilule défile : elle dit de quel côté il reste des
     onglets (le fondu de ses bords). */
  useEffect(() => {
    const barre = boutons.current[0]?.parentElement;
    if (!barre) return;
    const maj = () => {
      const max = barre.scrollWidth - barre.clientWidth;
      barre.classList.toggle("reste-g", max > 1 && barre.scrollLeft > 1);
      barre.classList.toggle("reste-d", max > 1 && barre.scrollLeft < max - 1);
    };
    maj();
    barre.addEventListener("scroll", maj, { passive: true });
    const ro = new ResizeObserver(maj);
    ro.observe(barre);
    return () => { barre.removeEventListener("scroll", maj); ro.disconnect(); };
  }, []);
  /* Sous 768 px, la pilule défile : l'onglet ouvert vient au centre. */
  useEffect(() => {
    const b = boutons.current[onglet];
    const barre = b?.parentElement;
    if (!b || !barre || barre.scrollWidth <= barre.clientWidth) return;
    const rb = b.getBoundingClientRect();
    const rp = barre.getBoundingClientRect();
    const gauche = barre.scrollLeft + rb.left - rp.left - (rp.width - rb.width) / 2;
    barre.scrollTo({ left: Math.max(0, gauche), behavior: "smooth" });
  }, [onglet]);

  const changerOnglet = useCallback((i: number) => {
    setOnglet(i);
    setEtape(0);
    setTour((t) => t + 1);
  }, []);
  const clavier = useCallback((e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const pas = e.key === "ArrowRight" ? 1 : -1;
    const n = (onglet + pas + ONGLETS.length) % ONGLETS.length;
    changerOnglet(n);
    boutons.current[n]?.focus();
  }, [onglet, changerOnglet]);

  const duree = courant.etapes?.[etape]?.duree
    || (courant.id === "produits" && ETAPES_FICHE[etape]?.duree)
    || (courant.id === "outils" && visites.outils?.dureeEtapeOutils(etape, secteur))
    || DUREE_ETAPE;
  const pied: Pied | null = agents && {
    actif: etape,
    duree,
    total: agents.length,
    cle,
    lecture,
    fin: suivant,
    precedent: precedentGeste,
    suivant: suivantGeste,
  };

  /* La visite sur la fiche Éclose. */
  const etapeFiche = ETAPES_FICHE[etape];
  const zoneFiche = fiche && etapeFiche ? fiche.zones[etapeFiche.z] : undefined;
  /* L'encart sort dans la marge de droite : ordinateur, deux colonnes,
     sauf la photo et le QR code. */
  const margeFiche = useMargeDroite(refPastilles, courant.id === "produits" && !mobile && !uneColonne && !!fiche);
  const horsFiche: Hors | null = fiche && margeFiche && etapeFiche && !etapeFiche.garde
    ? { ...margeFiche, plancher: fiche.plancher ?? undefined }
    : null;
  const pointFiche = zoneFiche ? pointHors(zoneFiche, etapeFiche.prise, horsFiche) : null;
  const iframe = demo.querySelector<HTMLIFrameElement>("iframe.lyv-demo-ecran");
  const visiteFiche = courant.id === "produits" && fiche && !fiche.fenetreOuverte && pied;
  /* Sur ordinateur, les loupes de la fiche font 132 et 128 px (152 et 146
     avant) : l'encart le plus haut (453 px) passe à 430 environ et tient à
     côté du point dans la fiche en deux colonnes, haute de 457 px à 1440
     (JP, 10/10 nuit : « jamais d'entre-deux »). */
  const encartFiche = (pointe: Pointe | null, style: CSSProperties, enFlux?: boolean) => pied && (
    <Encart
      agent={AGENTS_FICHE[etape]}
      loupe={etapeFiche.diagnostic ? <LoupeDiagnostic iframe={iframe} /> : etapeFiche.studio ? <LoupeStudio /> : etapeFiche.vivant
        ? <LoupeChat key={`f${etape}-${tour}`} hautMax={mobile ? 240 : 132} marge={mobile ? MARGE_LOUPE : MARGE_LOUPE_ORDI} />
        : <LoupeFiche key={`f${etape}`} iframe={iframe} sel={etapeFiche.zoom} hautMax={mobile ? 250 : 128}
            marge={mobile ? MARGE_LOUPE : MARGE_LOUPE_ORDI} centrer={etapeFiche.centrer} />}
      pointe={pointe}
      pied={pied}
      survol={setSurvol}
      style={style}
      enFlux={enFlux}
    />
  );

  const cibleBoutique = ETAPES_BOUTIQUE[etape];
  const VisiteEnCours = idVisite ? visites[idVisite]?.default : undefined;

  /* Sous le visuel : la navigation, à toutes les largeurs (JP, 10/10) ; sur
     téléphone, la ligne d'agents la suit. */
  const sousVisuel = pied && agents && (
    <>
      <Navigation pied={pied} enPause={enPause} basculer={() => setEnPause((v) => !v)} />
      {mobile && <Defile agents={agents} actif={etape} cle={cle} duree={duree} lecture={lecture} choisir={choisir} />}
    </>
  );

  return (
    <>
      {createPortal(
        <div className="lyv lyv-tete lyv-tete-centre">
          <style>{CSS}</style>
          <h2 className="lyv-titre" aria-live="polite">
            {courant.probleme[0]}<span className="lyv-elu">{courant.probleme[1]}</span>{courant.probleme[2]}
          </h2>
          <p className="lyv-chapeau">{courant.reponse}</p>
          {courant.points && (
            <ul className="lyv-points">
              {courant.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
          )}
          <div className={"lyv-tabs" + (corpo ? " lyv-tabs-4" : "")} role="tablist" aria-label={bio ? "Les étapes de création de votre marque" : "Les étages de Lystes"}>
            {ONGLETS.map((o, i) => (
              <button
                key={o.id}
                ref={(el) => { boutons.current[i] = el; }}
                type="button"
                role="tab"
                id={`lyv-onglet-${o.id}`}
                aria-selected={onglet === i}
                aria-controls={scene.id}
                tabIndex={onglet === i ? 0 : -1}
                className={onglet === i ? "on" : undefined}
                aria-label={o.titre}
                onClick={() => changerOnglet(i)}
                onPointerEnter={() => { if (estVisite(o.id)) charger(o.id); }}
                onPointerDown={() => { if (estVisite(o.id)) charger(o.id); }}
                onFocus={() => { if (estVisite(o.id)) charger(o.id); }}
                onKeyDown={clavier}
              >
                <span className="lyv-tabn" aria-hidden="true">{i + 1}</span>
                <span className="lyv-tabl">{o.titre}</span>
                <span className="lyv-tabc" aria-hidden="true">{o.court}</span>
              </button>
            ))}
          </div>
        </div>,
        tete,
      )}

      {createPortal(
        <div className="lyv">
          <p className="lyv-etage">{courant.etage}</p>
          <h3 className="lyv-accroche">{courant.accroche}</h3>
          <ul className="lyv-benefices">
            {courant.benefices.map(([Icone, texte]) => (
              <li key={texte}><Icone size={20} strokeWidth={1.5} aria-hidden="true" /><span>{texte}</span></li>
            ))}
          </ul>
        </div>,
        texte,
      )}

      {createPortal(
        <div className="lyv">
          {agents && !mobile && <Liste agents={agents} actif={etape} cle={cle} duree={duree} lecture={lecture} choisir={choisir} />}
        </div>,
        legende,
      )}

      {visiteFiche && fiche && createPortal(
        <MesureEncart.Provider value={mesurerEncart}><div className="lyv">
          {pointFiche && <span className="lyv-pouls" style={{ left: pointFiche.x, top: pointFiche.y }} aria-hidden="true" />}
          {!mobile && (
            <EncartPose
              key={`f${etape}`}
              point={pointFiche}
              cote={etapeFiche.cote}
              cadre={fiche.cadre}
              largeur={LARGEUR_ENCART}
              hors={horsFiche}
              /* La photo : l'encart reste à droite de la photo, quitte à perdre
                 quelques px, au lieu de basculer dessus. */
              serrer={etapeFiche.garde && etapeFiche.cote === "droite" ? { min: 220, deborde: 0 } : undefined}
              plancher={fiche.plancher}
              contenu={(pointe, style) => encartFiche(pointe, style)}
            />
          )}
        </div></MesureEncart.Provider>,
        pastilles,
      )}

      {createPortal(
        <MesureEncart.Provider value={mesurerEncart}><div className="lyv">
          {courant.id === "produits" && pied && (
            <div className="lyv-sous-visuel">
              {sousVisuel}
              {mobile && encartFiche(null, {}, true)}
            </div>
          )}
          {courant.id === "ecommerce" && pied && (
            <>
              <div className="lyv-cadre">
                <Boutique etape={etape} survol={setSurvol} mobile={mobile} pied={pied} taille={annoncerTaille} marge={!uneColonne} />
                <p className="lyv-legende-visuel"><b>L'orbital</b>, ouvert sur la boutique</p>
              </div>
              <div className="lyv-sous-visuel">
                {sousVisuel}
                {mobile && (
                  <Encart
                    agent={AGENTS_BOUTIQUE[etape]}
                    loupe={loupeBoutique(cibleBoutique)}
                    pointe={null}
                    pied={pied}
                    survol={setSurvol}
                    enFlux
                  />
                )}
              </div>
            </>
          )}
          {/* Étages 3 et 4 : la visite, comme la boutique. Tant que son fichier
              se charge, la boîte garde sa place. L'organigramme de l'entreprise
              (ORGA_ENTREPRISE) a laissé place à la visite du back-office. */}
          {idVisite && (
            <>
              <div className="lyv-cadre">
                {VisiteEnCours && pied
                  ? <VisiteEnCours key={idVisite} etape={etape} survol={setSurvol} mobile={mobile} pied={pied} taille={annoncerTaille}
                      prete={signalerPrete} secteur={secteur} marge={!uneColonne} />
                  : <div className={idVisite === "outils" ? "lyv-boutique lyv-o lyv-o-attente" : "lyv-boutique"} aria-busy="true" />}
                {idVisite === "outils" ? (
                  <p className="lyv-legende-visuel lyv-legende-outils">
                    <span className="lyv-legende-marque"><b>{visites.outils?.marqueOutils(secteur) ?? (corpo ? "Brévan Architectes" : "Lystes & Partners")}</b>, sur </span>
                    <span className="lyv-legende-adresse">{visites.outils?.adressesOutils(secteur)[etape] ?? (corpo ? "lystes.ai/brevan-architectes" : "lystes.ai/lystes-partners")}</span>
                    {/* Les avis de la marque de démonstration sont des avis de présentation :
                        la légende le dit (relecture du 11/10). */}
                    <span className={"lyv-legende-exemple" + (etape <= 1 ? "" : " vide")} aria-hidden={etape <= 1 ? undefined : true}><span className="lyv-legende-point"> · </span>avis d’exemple</span>
                  </p>
                ) : idVisite === "equipes" ? (
                  <p className="lyv-legende-visuel">{etape === 0
                    ? <><b>L’organigramme</b>, de 10 à 1000 {corpo ? "métiers" : "produits"}</>
                    : <><b>Brand AI</b>, le cerveau de {corpo ? "Brévan Architectes" : visites.equipes?.MARQUE_EQUIPES ?? "Lystes & Partners"}</>}</p>
                ) : idVisite === "siteweb" ? (
                  <p className="lyv-legende-visuel"><b>L’orbital</b>, ouvert sur le site de Brévan Architectes</p>
                ) : (
                  <p className="lyv-legende-visuel">{(() => {
                    const l = visites.entreprise?.legendeEntreprise(etape, secteur);
                    return l ? <><b>{l[0]}</b>{l[1]}</> : <><b>Le back-office</b>, ouvert sur vos équipes IA</>;
                  })()}</p>
                )}
              </div>
              {pied && agents && (
                <div className="lyv-sous-visuel lyv-sous-visite">
                  {mobile && !dejaPrete[idVisite]
                    ? <Navigation pied={pied} enPause={enPause} basculer={() => setEnPause((v) => !v)} />
                    : sousVisuel}
                  {mobile && dejaPrete[idVisite] && <Encart agent={agents[etape]} loupe={null} pointe={null} pied={pied} survol={setSurvol} enFlux />}
                </div>
              )}
            </>
          )}
          {/* /bio : le visuel réel de l'étape, sa légende, puis la navigation ;
              sur téléphone, la ligne d'étapes et l'encart. */}
          {courant.etapes && pied && (() => {
            const m0 = mediaEtape(courant.etapes, etape);
            const m = m0?.type === "diapos" && m0.diapos?.length ? m0.diapos[diapo % m0.diapos.length] : m0;
            return (
              <>
                <div className="lyv-cadre">
                  <div className={m?.type === "fiche" ? "lyv-media lyv-media-fiche" : "lyv-media"} style={{ "--lyv-pos": m?.position ?? "50% 50%" } as CSSProperties}>
                    {m0?.type === "diapos" && m0.diapos?.length
                      ? <CarrouselBio diapos={m0.diapos} index={diapo % m0.diapos.length} choisir={setDiapo} />
                      : m?.type === "grille" && m.produits
                      ? (
                        /* La sélection : trois produits par rangée ; les badges
                           des produits retenus viennent un par un, comme si on
                           cochait (JP, 13/10/2026). Les autres restent tels
                           quels, sans croix. La clé relance l'animation à
                           chaque passage sur l'étape. */
                        <ul className="lyv-grille" key={cle} aria-label="Une sélection de produits"
                          style={{ "--lyv-cols": m.colonnes ?? 3, "--lyv-rangs": Math.ceil(m.produits.length / (m.colonnes ?? 3)) } as CSSProperties}>
                          {m.produits.map((p, i) => {
                            const rang = m.produits!.slice(0, i).filter((x) => x.valide).length;
                            return (
                              <li key={p.image}>
                                <span className="lyv-grille-photo">
                                  <img src={p.image} alt="" loading="lazy" decoding="async" />
                                  {p.valide && (
                                    <span className="lyv-badge" style={{ animationDelay: `${500 + rang * 700}ms` }} aria-label="validé" role="img">
                                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3"
                                        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                                    </span>
                                  )}
                                </span>
                                <span className="lyv-grille-nom">{p.nom}</span>
                              </li>
                            );
                          })}
                        </ul>
                      )
                      : m?.type === "inci" && m.carte
                      ? (
                        /* La fiche INCI : la vidéo, puis la photo de
                           l'ingrédient et sa carte, qui viennent au rythme de
                           la jauge (en pause avec elle). */
                        <>
                          {m.src && <SafeVideo key={m.src} src={m.src} poster={m.affiche} className="lyv-media-el" />}
                          <div className={m.src ? "lyv-inci" : "lyv-inci lyv-inci-direct"} key={cle} style={{ animationPlayState: lecture ? "running" : "paused" }}>
                            <img src={m.carte.photo} alt="" className="lyv-media-el" loading="lazy" decoding="async" />
                            <div className="lyv-inci-carte">
                              <b>Fiche INCI</b>
                              <span className="lyv-inci-produit">{m.carte.produit}</span>
                              <p>
                                {(() => {
                                  const [avant, apres] = m.carte!.inci.split(m.carte!.surligne);
                                  /* Sur un téléphone étroit, la fin de la liste seulement. */
                                  const coupe = avant.lastIndexOf(", ", avant.length - 60);
                                  return (
                                    <>
                                      <span className="lyv-inci-debut">{avant.slice(0, coupe + 2)}</span>
                                      <span className="lyv-inci-points" aria-hidden="true">…&nbsp;</span>
                                      {avant.slice(coupe + 2)}
                                      <mark>{m.carte!.surligne}</mark>
                                      {apres}
                                    </>
                                  );
                                })()}
                              </p>
                            </div>
                          </div>
                        </>
                      )
                      : m?.type === "fiche"
                      ? (
                        /* La fiche de démonstration de l'accueil, la même
                           (public/demo-eclose) : elle se réduit seule à la
                           largeur du cadre et joue sa conversation. */
                        <FicheDemo key={m.src} src={m.src} />
                      )
                      : m?.type === "diptyque" && m.images
                      ? (
                        /* Deux photos côte à côte, de même hauteur (JP, 13/10). */
                        <div className="lyv-diptyque">
                          {m.images.map((src) => <img key={src} src={src} alt="" loading="lazy" decoding="async" />)}
                        </div>
                      )
                      : m?.type === "video"
                      ? <SafeVideo key={m.src} src={m.src} poster={m.affiche} className="lyv-media-el" />
                      : m && <img key={m.src} src={m.src} alt={m.legende.join("")} className="lyv-media-el" loading="lazy" decoding="async" />}
                  </div>
                  {m && <p className="lyv-legende-visuel"><b>{m.legende[0]}</b>{m.legende[1]}</p>}
                </div>
                <div className="lyv-sous-visuel">
                  {sousVisuel}
                  {mobile && <Encart agent={courant.etapes[etape]} loupe={null} pointe={null} pied={pied} survol={setSurvol} enFlux />}
                </div>
              </>
            );
          })()}
          {RESEAU_VISIBLE && courant.id === "reseau" && (
            <div className="lyv-cadre">
              <Organigramme tete="Votre réseau" sous="Des experts et des partenaires humains" colonnes={ORGA_RESEAU} humain />
            </div>
          )}
        </div></MesureEncart.Provider>,
        visuel,
      )}

      {createPortal(
        /* « Étage 2 · Votre page sur lystes.ai » retiré (JP, 10/10/2026) :
           la page de la marque se montre dans l'onglet « Vos outils ». */
        null,
        apres,
      )}
    </>
  );
}

/* Palette de la maison (CHARTE.md, identite-lystes) : blanc, pierre #f3f4f5,
   élu #e1f3c5 (la ligne choisie), gris #777b7f, encre, noir. Aucune ombre,
   boutons au rayon 9. Titres : Bricolage Grotesque en 400, interlettrage
   -0,025em, comme les titres de section du site (JP, 10/10). */
const CSS = `
.lyv{ --lyv-elu:#e1f3c5; --lyv-encre:#1a1a1a; --lyv-gris:rgba(26,26,26,.6); --lyv-pierre:#f3f4f5; --lyv-trait:rgba(35,30,31,.28); --lyv-filet:#e4e5e7; }
.lyv *{ box-sizing:border-box; }
/* Titre, chapeau et liste alignés à gauche, onglets sur toute la largeur
   (JP, 13/10 : la mise en page qu'il a essayée dans son navigateur). */
.lyv-tete{ margin:0; text-align:left; }
/* Accueil : titre et phrase centrés (JP, 13/10) ; /bio garde son alignement à gauche. */
.lyv-tete-centre{ text-align:center; }
.lyv-tete-centre .lyv-chapeau{ max-width:780px; margin-left:auto; margin-right:auto; }
.lyv-tete-centre .lyv-elu{ padding:0 6px; margin:0 -6px; }
.lyv .lyv-titre{ font-family:'Bricolage Grotesque','SF Pro Display',Inter,sans-serif; font-weight:400; font-size:51px; line-height:1.1;
  letter-spacing:-.025em; color:#171717; margin:0; text-wrap:balance; }
.lyv-elu{ background:linear-gradient(transparent 12%, var(--lyv-elu) 12%, var(--lyv-elu) 94%, transparent 94%);
  padding:0 6px 0 0; margin:0 -6px 0 0; border-radius:6px; white-space:nowrap; }
/* Titre à gauche (13/10) : le surlignage part de la marge du titre, sans la
   déborder ; son retrait ne se garde qu'à droite. */
/* Équilibré plutôt que « pretty » : sur 872 px, « équipe IA qui : » restait
   seul sur la seconde ligne. */
.lyv-chapeau{ font-size:15px; line-height:1.6; color:#000; margin:14px 0 14px; max-width:100%; text-wrap:balance; }
/* Ce que fait l'équipe : quatre lignes à plat, séparées d'un filet. Pas un
   accordéon : ni flèche, ni repli, tout se lit. */
.lyv-points{ list-style:none; margin:0; padding:0; }
.lyv-points li{ font-size:15px; line-height:1.5; color:#000; padding:10px 0; border-bottom:1px solid #00000014; text-wrap:pretty; }

/* La bascule, copiée de fiche-produit-demo.html. */
.lyv-tabs{ display:flex; width:100%; gap:4px; padding:6px; margin:24px 0 0; background:#000; border-radius:999px; max-width:100%; }
.lyv-tabs button{ flex:1 1 auto; justify-content:center; display:inline-flex; align-items:center; gap:.5em; white-space:nowrap; height:40px; padding:0 18px;
  border:0; border-radius:999px; background:transparent; color:#a3a3a3; cursor:pointer;
  font-family:'Satoshi',-apple-system,"Helvetica Neue",Arial,sans-serif; font-weight:600; font-size:14px; letter-spacing:-.01em;
  -webkit-font-smoothing:antialiased; transition:background .22s ease, color .22s ease; }
.lyv-tabs button.on{ background:#fff; color:#000; }
.lyv-tabs button:focus-visible{ outline:2px solid var(--lyv-elu); outline-offset:2px; }
.lyv-tabn{ width:20px; height:20px; border-radius:6px; flex:none; display:inline-flex; align-items:center; justify-content:center;
  background:#2b2b2e; color:#a3a3a3; font-size:11px; font-weight:700; font-variant-numeric:tabular-nums; transition:background .22s ease, color .22s ease; }
.lyv-tabs button.on .lyv-tabn{ background:#000; color:#fff; }
.lyv-tabc{ display:none; }

/* La scène d'un étage, composée comme une diapo du deck : le texte et la
   liste à gauche, centrés sur la hauteur du visuel, le visuel à droite
   (JP : « avant, sur la version ordi, c'était à gauche »). Elle a la largeur
   et les bords du bloc de cartes du dessous, 872 px sur ordinateur, jamais
   plus large (JP, 10/10 nuit : « la même largeur que le bloc en dessous »).
   La colonne de texte fait 280 px et l'accroche passe à 28 px : le visuel
   garde le reste, 564 px. */
.lyv-large{ width:auto; margin-left:0; }
/* Sous 1024 px, le bloc de cartes du dessous a de chaque côté la marge de
   son conteneur (px-4 sm:px-6 lg:px-0) que la scène n'a pas : 24 px, puis
   16 px sous 640 px. Mesuré de 320 à 1440 px : mêmes bords. */
@media (max-width:1023.98px){ .lyv-large{ margin-left:24px; margin-right:24px; } }
/* iPad en portrait (768 px) : la pilule des onglets, 638 px, dépassait la
   scène de 624 px et coupait « Votre entreprise ». Boutons resserrés. */
/* Cinq onglets (12/10) : de 768 à 960 px, la pilule perd ses numéros pour
   tenir entière, sans défiler. */
@media (min-width:768px) and (max-width:959.98px){ .lyv-tabs button{ padding:0 14px; } .lyv-tabn{ display:none; } }
@media (max-width:639.98px){ .lyv-large{ margin-left:16px; margin-right:16px; } }
.lyv-scene{ display:grid; grid-template-columns:minmax(0, 3fr) minmax(0, 7fr); grid-template-rows:auto auto 1fr;
  grid-template-areas:"texte visuel" "legende visuel" ". visuel"; column-gap:28px; margin-top:44px; }
.lyv-scene .lyv .lyv-accroche{ font-size:23px; white-space:pre-line; }
/* Une colonne : sous 1100 px, et dès que l'encart ne tient plus à côté du
   point (présentation téléphone) : le texte, le visuel, puis la liste, ou
   sur téléphone la navigation, la ligne d'agents et l'encart (JP, 10/10
   nuit : « jamais d'entre-deux »). */
.lyv-scene.lyv-une-colonne{ grid-template-columns:minmax(0, 1fr); grid-template-rows:auto; row-gap:22px;
  grid-template-areas:"texte" "visuel" "legende"; }
.lyv-scene.lyv-une-colonne .lyv-s-legende{ padding-top:0; }
.lyv-scene.lyv-une-colonne .lyv-liste{ grid-template-columns:1fr 1fr; gap:2px 8px; }
.lyv-s-texte{ grid-area:texte; min-width:0; text-align:left; }
.lyv-s-legende{ grid-area:legende; min-width:0; padding-top:24px; }
.lyv-s-visuel{ grid-area:visuel; min-width:0; }
.lyv-etage{ font-size:8px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:#777b7f; margin:0; }
.lyv .lyv-accroche{ font-family:'Bricolage Grotesque','SF Pro Display',Inter,sans-serif; font-weight:400; font-size:38px; line-height:1.1;
  letter-spacing:-.025em; color:#171717; margin:14px 0 0; text-wrap:balance; }
.lyv-benefices{ list-style:none; margin:18px 0 0; padding:0; display:grid; gap:12px; }
.lyv-benefices li{ display:flex; align-items:center; gap:10px; font-size:13px; line-height:1.35; color:var(--lyv-encre); white-space:nowrap; }
.lyv-benefices svg{ flex:none; color:var(--lyv-encre); width:16px; height:16px; }
.lyv-s-chapeau{ font-size:16px; line-height:1.6; color:var(--lyv-gris); margin:14px 0 0; max-width:48ch; }

/* La liste des agents : une ligne par étape, la ligne en cours en élu. */
.lyv-liste-zone{ max-height:var(--lyv-liste-max, 430px); padding-right:14px;
  -webkit-mask-image:linear-gradient(transparent, #000 var(--lyv-fh, 0px), #000 calc(100% - var(--lyv-fb, 0px)), transparent);
  mask-image:linear-gradient(transparent, #000 var(--lyv-fh, 0px), #000 calc(100% - var(--lyv-fb, 0px)), transparent); }
.lyv-liste{ list-style:none; margin:0; padding:0; display:grid; grid-template-columns:1fr; gap:2px; }
.lyv-liste button{ position:relative; width:100%; display:flex; align-items:flex-start; gap:10px; padding:9px 12px 12px;
  border:0; border-radius:9px; background:transparent; text-align:left; cursor:pointer; font:inherit; color:inherit;
  transition:background .25s ease; }
.lyv-liste button:not(.on):hover{ background:var(--lyv-pierre); }
.lyv-liste button.on{ background:var(--lyv-elu); }
.lyv-liste button:focus-visible{ outline:2px solid #000; outline-offset:2px; }
.lyv-num{ flex:none; width:20px; padding-top:2px; font-size:12px; font-weight:600; font-variant-numeric:tabular-nums; color:#777b7f; }
.lyv-liste button.on .lyv-num{ color:#000; }
.lyv-l{ display:flex; flex-direction:column; gap:2px; min-width:0; }
.lyv-l b{ font-size:14.5px; font-weight:600; line-height:1.3; letter-spacing:-.006em; color:var(--lyv-encre); }
.lyv-l small{ font-size:12.5px; line-height:1.4; color:var(--lyv-gris); text-wrap:balance; }
.lyv-liste button.on .lyv-l small{ color:rgba(26,26,26,.72); }
.lyv-jauge{ position:absolute; left:12px; right:12px; bottom:5px; height:2px; border-radius:1px; background:rgba(0,0,0,.1); overflow:hidden; }
.lyv-jauge b{ display:block; width:100%; height:100%; background:#000; transform-origin:0 50%;
  animation-name:lyv-jauge; animation-timing-function:linear; animation-fill-mode:both; }
@keyframes lyv-jauge{ from{ transform:scaleX(0); } to{ transform:scaleX(1); } }

/* Sous le visuel : la navigation ; sur téléphone, la ligne d'agents et l'encart noir. */
.lyv-sous-visuel{ display:flex; flex-direction:column; gap:14px; margin-top:12px; }
/* Boutons resserrés (JP, 10/10 : « qu'il prenne pas trop de place »). */
.lyv-nav{ display:flex; align-items:center; gap:4px; }
.lyv-nav-compte{ min-width:40px; font-size:12px; font-weight:600; font-variant-numeric:tabular-nums; color:#777b7f; }
.lyv-nav-jauge{ flex:1; height:2px; margin:0 10px; border-radius:1px; background:#e6e6e8; overflow:hidden; }
.lyv-nav-jauge b{ display:block; width:100%; height:100%; background:#000; transform-origin:0 50%;
  animation-name:lyv-jauge; animation-timing-function:linear; animation-fill-mode:both; }
.lyv-nav button{ width:26px; height:24px; padding:0; border:0; border-radius:7px; background:var(--lyv-pierre); color:#000; cursor:pointer;
  display:inline-flex; align-items:center; justify-content:center; transition:background .2s ease; }
.lyv-nav button svg{ width:13px; height:13px; }
/* Au doigt, le bouton touché gardait son fond de survol (relecture du 10/10). */
@media (hover:hover){ .lyv-nav button:hover{ background:#e8e9eb; } }
.lyv-nav button:focus-visible{ outline:2px solid #000; outline-offset:2px; }

.lyv-defile{ list-style:none; margin:0 -16px; padding:0 16px 2px; display:flex; gap:4px; overflow-x:auto;
  scroll-snap-type:x proximity; scrollbar-width:none; overscroll-behavior-x:contain; }
.lyv-defile::-webkit-scrollbar{ display:none; }
.lyv-defile li{ flex:none; scroll-snap-align:start; scroll-margin-left:16px; }
.lyv-defile button{ position:relative; display:flex; align-items:center; gap:9px; height:46px; padding:0 14px 4px; border:0;
  border-radius:9px; background:transparent; white-space:nowrap; cursor:pointer; font:inherit; color:inherit; transition:background .25s ease; }
.lyv-defile button.on{ background:var(--lyv-elu); }
.lyv-defile .lyv-num{ width:auto; padding:0; }
.lyv-defile button.on .lyv-num{ color:#000; }
.lyv-defile b{ font-size:15px; font-weight:600; letter-spacing:-.006em; color:var(--lyv-encre); }
.lyv-defile .lyv-jauge{ left:14px; right:14px; bottom:6px; }
.lyv-defile button:focus-visible{ outline:2px solid #000; outline-offset:2px; }

/* La visite : un point qui pulse sur la zone, et l'encart, sa pointe à
   2 px du point (JP, 10/10). */
/* Le point est dans la couleur élue de la maison (JP, 10/10 : « pulse :
   var(--lyv-elu) ») ; en noir, il se perdait dans la fiche. */
.lyv-pouls{ position:absolute; z-index:4; width:14px; height:14px; margin:-7px 0 0 -7px; border-radius:50%; background:var(--lyv-elu);
  outline:2px solid #fff; pointer-events:none;
  transition:left .5s cubic-bezier(.22,1,.36,1), top .5s cubic-bezier(.22,1,.36,1); }
.lyv-pouls::after{ content:""; position:absolute; inset:-2px; border-radius:50%; background:var(--lyv-elu);
  animation:lyv-pouls 1.6s cubic-bezier(.2,.6,.4,1) infinite; }
@keyframes lyv-pouls{ from{ transform:scale(1); opacity:.9; } to{ transform:scale(3.4); opacity:0; } }
.lyv-encart-pose{ position:absolute; z-index:5; transition:left .5s cubic-bezier(.22,1,.36,1), top .5s cubic-bezier(.22,1,.36,1); }
/* L'encart est noir (JP, 10/10), la loupe reste blanche dedans. */
.lyv-encart{ position:relative; background:#000; color:#fff; border-radius:16px; padding:20px; }
.lyv-encart.en-flux .lyv-encart-texte{ padding-bottom:2px; }
/* Sans loupe, le haut de l'encart garde la marge des côtés, sur tous les
   onglets : elle était de 38 px sur l'onglet 2 et de 22 px sur les onglets 3
   et 4, et sautait d'un onglet à l'autre (relecture du 10/10). */
.lyv-encart.en-flux > .lyv-encart-texte:first-child{ padding-top:2px; }
.lyv-pointe{ position:absolute; width:12px; height:12px; background:#000; border-radius:2px; transform:rotate(45deg); }
.lyv-pointe.droite{ right:-5px; margin-top:-6px; }
.lyv-pointe.gauche{ left:-5px; margin-top:-6px; }
.lyv-pointe.bas{ bottom:-5px; margin-left:-6px; }
.lyv-pointe.haut{ top:-5px; margin-left:-6px; }
/* Le trait du point à l'encart sorti dans la marge (13/10). Liseré blanc :
   il reste lisible sur le voile noir de l'orbital. */
.lyv-liaison{ position:absolute; height:1.5px; margin-top:-.75px; background:#000; border-radius:1px;
  box-shadow:0 0 0 1px rgba(255,255,255,.75); pointer-events:none; }
.lyv-loupe{ position:relative; overflow:hidden; border-radius:11px; background:#fff; }
.lyv-loupe-html{ padding:${MARGE_LOUPE}px; }
.lyv-loupe.nue{ border-radius:0; background:transparent; overflow:visible; }
.lyv-diag{ display:flex; flex-direction:column; gap:14px; }
/* Le visage garde le format de la carte de l'accueil, centré dans la boîte. */
.lyv-diag-visage{ position:relative; height:230px; aspect-ratio:217 / 349; margin:0 auto; border-radius:14px; overflow:hidden; background:#f5f5f4; }
.lyv-diag-visage > *:first-child{ display:block; width:100%; height:100%; }
.lyv-diag-pilule{ position:absolute; left:50%; bottom:10px; transform:translateX(-50%); white-space:nowrap; background:#fff;
  color:#000; border-radius:999px; padding:5px 10px; font-size:7.5px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; }
.lyv-studio{ display:grid; grid-template-columns:30% 16px 1fr; align-items:center; column-gap:8px; }
.lyv-studio figure{ margin:0; display:flex; flex-direction:column; gap:6px; }
.lyv-studio figure img{ width:100%; aspect-ratio:3 / 4; object-fit:cover; border-radius:8px; background:#f3f4f5; display:block; }
.lyv-studio figcaption{ font-size:11px; color:#777b7f; }
.lyv-studio-grille{ display:grid; grid-template-columns:repeat(3, 1fr); gap:5px; }
.lyv-studio-grille img{ width:100%; aspect-ratio:338 / 420; object-fit:cover; border-radius:6px; display:block; }

.lyv-encart-texte{ padding:18px 2px 0; animation:lyv-apparait .35s ease both; }
.lyv-encart-texte b{ display:block; font-family:'Bricolage Grotesque',Inter,sans-serif; font-size:18px; font-weight:500; line-height:1.25;
  letter-spacing:-.02em; color:#fff; }
.lyv-encart-texte p{ margin:6px 0 0; font-size:14px; line-height:1.5; color:#c9c9cc; text-wrap:pretty; }
/* Le second titre, un cran sous le nom de l'agent. */
.lyv-encart-texte h4{ margin:14px 0 0; font-family:'Bricolage Grotesque',Inter,sans-serif; font-size:15px; font-weight:500;
  line-height:1.3; letter-spacing:-.015em; color:#fff; }
/* Sur ordinateur, l'encart posé sur la fiche, réduit à l'échelle (~0,64). */
.lyv-encart-pose .lyv-encart{ border-radius:11px; padding:13px; }
.lyv-encart-pose .lyv-loupe{ border-radius:7px; }
.lyv-encart-pose .lyv-loupe.nue{ border-radius:0; }
.lyv-encart-pose .lyv-loupe-html{ padding:${MARGE_LOUPE_ORDI}px; }
.lyv-encart-pose .lyv-encart-texte{ padding-top:11px; }
.lyv-encart-pose .lyv-encart > .lyv-pointe:first-child + .lyv-encart-texte,
.lyv-encart-pose .lyv-encart > .lyv-encart-texte:first-child{ padding-top:1px; }
.lyv-encart-pose .lyv-encart-texte b{ font-size:12.5px; }
.lyv-encart-pose .lyv-encart-texte p{ margin-top:3px; font-size:10px; line-height:1.45; }
.lyv-encart-pose .lyv-encart-texte h4{ margin-top:9px; font-size:11px; }
.lyv-encart-pose .lyv-pointe{ width:8px; height:8px; }
.lyv-encart-pose .lyv-pointe.droite{ right:-3px; margin-top:-4px; }
.lyv-encart-pose .lyv-pointe.gauche{ left:-3px; margin-top:-4px; }
.lyv-encart-pose .lyv-pointe.bas{ bottom:-3px; margin-left:-4px; }
.lyv-encart-pose .lyv-pointe.haut{ top:-3px; margin-left:-4px; }
.lyv-encart-pose .lyv-diag{ gap:9px; }
/* Le visage un peu plus haut que l'échelle : à 147 px, « Diagnostic en cours »
   débordait de ses 91 px de large. */
.lyv-encart-pose .lyv-diag-visage{ height:160px; border-radius:9px; }
/* Dans la boutique, le cadre ne fait que 323 px de haut en deux colonnes :
   le scan passe en bandeau de 64 px, toute la largeur de l'encart, recadré
   sur le visage, pour que l'encart de l'Expert routine tienne au-dessus de
   la barre flottante (355 px avant, 260 après). Textes inchangés. */
.lyv-boutique .lyv-encart-pose .lyv-diag-visage{ height:64px; width:100%; aspect-ratio:auto; }
/* Sorti et resserré (moins de 240 px) : le visage plus bas, pour que
   l'encart du Diagnostiqueur ne dépasse pas la hauteur de la fiche. */
#vision-demo .lyv-encart-pose.etroit .lyv-diag-visage{ height:118px; width:100%; aspect-ratio:auto; }
.lyv-encart-pose .lyv-diag-pilule{ bottom:7px; padding:3px 7px; font-size:5.6px; letter-spacing:.1em; }
.lyv-encart-pose .lyv-studio figcaption{ font-size:9px; }
/* Les reproductions de la boutique sont du HTML fixe : on les met à l'échelle. */
@keyframes lyv-apparait{ from{ opacity:0; } to{ opacity:1; } }
@media (prefers-reduced-motion:reduce){
  .lyv .lyv-jauge b, .lyv .lyv-nav-jauge b{ animation-duration:${DUREE_ETAPE}ms !important; }
  .lyv-pouls::after{ animation:none; }
  .lyv-pouls, .lyv-encart-pose{ transition:none; }
  .lyv-encart-texte{ animation:none; }
}

/* Le cadre de la fiche Éclose : fond pierre, écran blanc. Avant que la fiche
   ne donne sa hauteur, l'iframe garde ses proportions. */
#vision-demo.lyv-demo{ padding:16px; border-radius:22px; background:#f3f4f5; }
#vision-demo .lyv-demo-ecran{ display:block; width:100%; aspect-ratio:1286 / 1290; border:0; border-radius:14px; background:#fff; }

.lyv-cadre{ background:#f3f4f5; border-radius:22px; padding:24px; }
/* /bio : le visuel réel de l'étape, photo ou vidéo, dans le format de la
   boutique de l'étage 2. */
.lyv-media{ position:relative; aspect-ratio:1280 / 800; border-radius:14px; overflow:hidden; background:#fff; }
/* La fiche INCI : la photo de l'ingrédient vient sur la vidéo à 45 % de
   l'étape, avec sa carte blanche à droite ; l'ingrédient en élu. */
.lyv-inci{ position:absolute; inset:0; opacity:0; animation:lyv-apparait .6s ease 4.5s both; }
/* Sans vidéo (JP, 13/10) : la photo et sa carte tout de suite. */
.lyv-inci.lyv-inci-direct{ opacity:1; animation:none; }
.lyv-inci > img{ object-position:50% 40%; }
.lyv-inci-carte{ position:absolute; top:14px; right:14px; bottom:14px; width:52%; overflow:hidden; background:#fff; border-radius:12px;
  padding:14px 16px; display:flex; flex-direction:column; gap:4px; }
.lyv-inci-carte b{ font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:#777b7f; }
.lyv-inci-produit{ font-family:'Bricolage Grotesque',Inter,sans-serif; font-size:15px; line-height:1.25; letter-spacing:-.015em; color:#171717; }
.lyv-inci-carte p{ margin:6px 0 0; font-size:10.5px; line-height:1.5; color:var(--lyv-gris); }
.lyv-inci-carte mark{ background:var(--lyv-elu); color:#000; font-weight:600; border-radius:3px; padding:0 2px; }
.lyv-inci-points{ display:none; }
@media (prefers-reduced-motion:reduce){ .lyv-inci{ animation-duration:0s; } }
@media (max-width:720px){
  .lyv-inci-carte{ top:10px; right:10px; bottom:10px; width:58%; padding:10px 12px; }
  .lyv-inci-produit{ font-size:12px; }
  .lyv-inci-carte p{ font-size:10px; margin-top:3px; }
  .lyv-inci-debut{ display:none; }
  .lyv-inci-points{ display:inline; }
}
/* La fiche de démonstration : son propre format (1286 × 1290), sans le
   recadrage des photos. */
.lyv-media.lyv-media-fiche{ aspect-ratio:auto; }
.lyv-fiche-ecran{ display:block; width:100%; aspect-ratio:1286 / 1000; border:0; background:#fff; }
/* Le carrousel : la diapositive fait 85 % de la largeur, la suivante
   dépasse ; défilement aimanté, sans barre ; points en bas, au centre. */
.lyv-carrousel{ position:absolute; inset:0; }
.lyv-carrousel-piste{ position:absolute; inset:0; display:flex; gap:8px; overflow-x:auto; scroll-snap-type:x mandatory;
  scrollbar-width:none; overscroll-behavior-x:contain; background:#f3f4f5; }
.lyv-carrousel-piste::-webkit-scrollbar{ display:none; }
.lyv-carrousel-diapo{ position:relative; flex:0 0 85%; height:100%; scroll-snap-align:start; border-radius:14px; overflow:hidden; background:#fff; }
.lyv-carrousel-el{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:var(--lyv-pos, 50% 50%); display:block; }
.lyv-carrousel-points{ position:absolute; left:0; right:15%; bottom:10px; display:flex; justify-content:center; gap:6px; pointer-events:none; }
.lyv-carrousel-points button{ pointer-events:auto; width:7px; height:7px; padding:0; border:0; border-radius:999px; background:rgba(255,255,255,.6);
  box-shadow:0 0 0 1px rgba(0,0,0,.08); cursor:pointer; transition:width .25s ease, background .25s ease; }
.lyv-carrousel-points button.on{ width:18px; background:#fff; }
.lyv-carrousel-points button:focus-visible{ outline:2px solid #000; outline-offset:2px; }
@media (max-width:720px){ .lyv-carrousel-diapo{ border-radius:10px; } .lyv-carrousel-piste{ gap:6px; } }
/* Le diptyque : deux colonnes de même hauteur, petit écart, coins arrondis. */
.lyv-diptyque{ position:absolute; inset:0; display:grid; grid-template-columns:1fr 1fr; gap:8px; padding:0; background:#f3f4f5; }
.lyv-diptyque img{ width:100%; height:100%; object-fit:cover; object-position:50% 45%; border-radius:14px; display:block; min-width:0; }
@media (max-width:720px){ .lyv-diptyque{ gap:6px; } .lyv-diptyque img{ border-radius:10px; } }
/* La grille de sélection : trois colonnes, deux rangées, dans le même cadre
   que les photos. Le badge : rond pistache (l'élu de la maison), coche
   noire, liseré blanc comme le point de la visite. */
.lyv-grille{ position:absolute; inset:0; list-style:none; margin:0; padding:14px; display:grid; grid-template-columns:repeat(var(--lyv-cols, 3), minmax(0, 1fr));
  grid-template-rows:repeat(var(--lyv-rangs, 2), minmax(0, 1fr)); gap:10px; }
.lyv-grille li{ display:flex; flex-direction:column; gap:6px; min-width:0; min-height:0; }
.lyv-grille-photo{ position:relative; flex:1; min-height:0; border-radius:10px; overflow:hidden; background:#f3f4f5; }
.lyv-grille-photo img{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:50% 50%; display:block; }
.lyv-grille-nom{ font-size:12px; line-height:1.25; color:var(--lyv-encre); text-align:center; white-space:nowrap; overflow:hidden; text-overflow:clip; }
.lyv-badge{ position:absolute; top:8px; right:8px; width:24px; height:24px; border-radius:50%; background:var(--lyv-elu); color:#000;
  outline:2px solid #fff; display:flex; align-items:center; justify-content:center;
  animation:lyv-coche .35s cubic-bezier(.22,1,.36,1) both; }
@keyframes lyv-coche{ from{ opacity:0; transform:scale(.6); } to{ opacity:1; transform:scale(1); } }
@media (prefers-reduced-motion:reduce){ .lyv-badge{ animation:none; } }
/* Sur un téléphone étroit, les vignettes seules : les noms ne tiendraient
   pas entiers sous des cases de 100 px. */
@media (max-width:480px){
  .lyv-grille{ padding:10px; gap:8px; }
  .lyv-grille-nom{ display:none; }
  .lyv-badge{ top:6px; right:6px; width:20px; height:20px; }
  .lyv-badge svg{ width:10px; height:10px; }
}
.lyv-media-el{ position:absolute; inset:0; display:block; width:100%; height:100%; object-fit:cover; object-position:var(--lyv-pos, 50% 50%); animation:lyv-apparait .35s ease both; }

/* Étage 2 : la boutique et l'orbital, composés comme la diapo 16. */
.lyv-boutique{ position:relative; aspect-ratio:1280 / 800; border-radius:14px; overflow:hidden; background:#fff; }
/* La boutique sur ordinateur : l'encart peut déborder dans la marge grise ;
   la page garde ses coins arrondis (rayon porté par l'iframe). */
.lyv-boutique.lyv-b-deborde{ overflow:visible; }
/* Vos outils : les pages sont sur un téléphone (VisiteOutils), la boîte
   n'a ni fond ni coins ; sa hauteur suit la présentation. */
.lyv-boutique.lyv-o{ aspect-ratio:auto; height:520px; border-radius:0; overflow:visible; background:transparent; }
@media (max-width:720px){ .lyv-boutique.lyv-o-attente{ height:420px; } }
.lyv-boutique-page{ position:absolute; left:0; top:0; border:0; transform-origin:0 0; background:#fff; display:block;
  opacity:0; visibility:hidden; transition:opacity .45s ease, visibility 0s linear .45s; }
.lyv-boutique-page.on{ opacity:1; visibility:visible; transition:opacity .45s ease; }
.lyv-legende-visuel{ font-size:15px; color:var(--lyv-gris); margin:12px 0 0; }
.lyv-legende-visuel b{ color:var(--lyv-encre); font-weight:600; }
.lyv-legende-exemple{ white-space:nowrap; }
/* « Vos outils » : l'adresse de l'écran. Sur un téléphone étroit, la phrase
   entière passait à la ligne sur l'adresse (315 px pour 311 à 375 px) : il ne
   reste que l'adresse, en gras. */
/* 12/10 : « Lystes & Partners » est plus long qu'« Éclose Paris » : à 430 px,
   l'adresse se coupait à son tiret ; le seuil passe à 480 px. */
@media (max-width:480px){
  .lyv-legende-outils .lyv-legende-marque{ display:none; }
  .lyv-legende-outils .lyv-legende-adresse{ color:var(--lyv-encre); font-weight:600; }
}
/* La mention des avis d'exemple : à la suite sur ordinateur ; au téléphone,
   sur sa propre ligne, réservée à toutes les étapes pour que la navigation
   ne saute pas d'une étape à l'autre. */
.lyv-legende-exemple.vide{ display:none; }
@media (max-width:720px){
  .lyv-legende-outils .lyv-legende-exemple{ display:block; }
  .lyv-legende-outils .lyv-legende-exemple.vide{ visibility:hidden; }
  .lyv-legende-outils .lyv-legende-exemple::first-letter{ text-transform:uppercase; }
  .lyv-legende-outils .lyv-legende-point{ display:none; }
}

/* Diapo 17 : la page de la marque, en scène elle aussi. */
.lyv-scene-page{ margin-top:56px; grid-template-areas:"texte" "visuel"; }
.lyv-points{ list-style:none; margin:20px 0 0; padding:0; }
.lyv-points li{ padding:12px 0; font-size:15px; line-height:1.55; color:var(--lyv-encre); }
.lyv-points li + li{ border-top:1px solid rgba(241,241,241,.75); }
.lyv-page-img{ position:relative; border-radius:14px; overflow:hidden; background:#fff; aspect-ratio:1200 / 750; }
.lyv-page-img img{ width:100%; height:100%; object-fit:cover; display:block; }
.lyv-url{ position:absolute; left:10px; bottom:10px; background:#000; color:#fff; border-radius:8px; padding:5px 9px;
  font-size:12px; font-weight:600; line-height:1.2; }

/* Étages 3 et 4 : organigrammes des diapos 19 et 20. */
.lyv-orga{ display:flex; flex-direction:column; align-items:center; }
.lyv-orga-tete{ background:#000; color:#fff; border-radius:14px; padding:14px 26px; display:flex; flex-direction:column;
  align-items:center; gap:3px; text-align:center; }
.lyv-orga-tete strong{ font-size:18px; font-weight:600; letter-spacing:-.01em; }
.lyv-orga-tete span{ font-size:13px; color:#c9c9cc; }
.lyv-cerveau{ background:var(--lyv-elu); border-radius:12px; padding:10px 20px; display:flex; flex-direction:column; align-items:center;
  gap:2px; text-align:center; }
.lyv-cerveau strong{ font-size:15px; font-weight:600; color:#000; }
.lyv-cerveau span{ font-size:13px; color:var(--lyv-encre); opacity:.75; }
.lyv-trait{ display:block; width:1.6px; height:24px; background:var(--lyv-trait); }
.lyv-cols{ position:relative; width:100%; display:grid; grid-template-columns:repeat(3,1fr); gap:16px; padding-top:24px; align-items:start; }
.lyv-cols::before{ content:""; position:absolute; top:0; height:1.6px; background:var(--lyv-trait);
  left:calc((100% - 32px) / 6); right:calc((100% - 32px) / 6); }
.lyv-col{ position:relative; display:flex; flex-direction:column; gap:8px; }
.lyv-col::before{ content:""; position:absolute; top:-24px; left:50%; width:1.6px; height:24px; margin-left:-.8px; background:var(--lyv-trait); }
.lyv-col-titre{ font-size:11px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:var(--lyv-gris);
  text-align:center; padding:4px 0 4px; }
.lyv-carte{ background:#fff; border-radius:10px; padding:10px 14px; display:flex; flex-direction:column; gap:2px; }
.lyv-orga.humain .lyv-carte{ background:var(--lyv-elu); }
.lyv-carte b{ font-size:15px; font-weight:600; line-height:1.3; letter-spacing:-.01em; color:var(--lyv-encre); }
.lyv-carte span{ font-size:13px; line-height:1.4; color:var(--lyv-gris); }
.lyv-orga.humain .lyv-carte span{ color:var(--lyv-encre); opacity:.7; }

/* Sous 1100 px, la scène passe en une colonne : le titre, le visuel, puis
   la liste, et elle revient dans le conteneur de la page. */
@media (max-width:1099px){
  .lyv .lyv-titre{ font-size:40px; }
  .lyv-s-legende{ padding-top:0; }
  .lyv-liste{ grid-template-columns:1fr 1fr; gap:2px 8px; }
  .lyv-scene{ grid-template-columns:minmax(0, 1fr); grid-template-rows:auto; row-gap:22px;
    grid-template-areas:"texte" "visuel" "legende"; }
}
@media (max-width:720px){
  .lyv .lyv-titre{ font-size:24px; line-height:1.15; }
  .lyv-chapeau{ font-size:15px; line-height:1.6; }
  .lyv .lyv-accroche{ font-size:27px; }
  .lyv-s-chapeau{ font-size:15px; }
  .lyv-benefices li{ font-size:16px; white-space:normal; }
  #vision-demo.lyv-demo{ padding:10px; border-radius:18px; }
  #vision-demo .lyv-demo-ecran{ border-radius:10px; }
  .lyv-cadre{ padding:16px; }
  .lyv-boutique{ border-radius:10px; }
  .lyv-cols{ grid-template-columns:1fr; padding-top:8px; gap:12px; }
  .lyv-cols::before, .lyv-col::before{ display:none; }
  /* Au doigt, un peu plus grands qu'à la souris. */
  .lyv-nav button{ width:30px; height:28px; }
}
/* Sous 768 px, cinq onglets (JP, 12/10) : libellés courts, et la pilule
   défile au doigt quand ils ne tiennent pas tous ; l'onglet ouvert se
   centre (VisionEtages, effet sur \`onglet\`). Où ils tiennent, ils se
   partagent la largeur. */
@media (max-width:767.98px){
  .lyv-tabs{ display:flex; width:100%; padding:4px; gap:0; overflow-x:auto; overscroll-behavior-x:contain;
    scrollbar-width:none; -webkit-overflow-scrolling:touch; scroll-padding:0 4px; }
  .lyv-tabs::-webkit-scrollbar{ display:none; }
  /* Les cinq libellés courts tiennent dans la tête dès 375 px (311 px) :
     12 px, 6 px de marge, sans écart (JP, 13/10 : « Équipes » était coupé). */
  .lyv-tabs button{ flex:1 1 auto; justify-content:center; height:36px; padding:0 6px; font-size:12px; }
  .lyv-tabn, .lyv-tabl{ display:none; }
  .lyv-tabc{ display:inline; }
  /* Un libellé à moitié sorti de la pilule se fond dans le noir, du côté
     où il en reste à voir : on lit qu'elle défile, pas qu'un mot est coupé. */
  .lyv-tabs::before, .lyv-tabs::after{ content:""; position:sticky; z-index:1; flex:none; width:34px; align-self:stretch;
    pointer-events:none; opacity:0; transition:opacity .2s ease; }
  .lyv-tabs::before{ left:-4px; margin:-4px -34px -4px 0; background:linear-gradient(90deg, #000 35%, rgba(0,0,0,0)); }
  .lyv-tabs::after{ right:-4px; margin:-4px 0 -4px -34px; background:linear-gradient(270deg, #000 35%, rgba(0,0,0,0)); }
  .lyv-tabs.reste-g::before, .lyv-tabs.reste-d::after{ opacity:1; }
  /* Quatre onglets (version Entreprises) : ils tiennent dès 320 px, la pilule
     ne défile pas ; sans les fondus, qui la faisaient dépasser de 2 px et
     voilaient « Équipes ». */
  .lyv-tabs.lyv-tabs-4{ overflow:visible; }
  .lyv-tabs.lyv-tabs-4::before, .lyv-tabs.lyv-tabs-4::after{ display:none; }
}
/* À 320 px, 256 px de tête : 22 px. */
@media (max-width:359.98px){ .lyv .lyv-titre{ font-size:22px; } }
`;
