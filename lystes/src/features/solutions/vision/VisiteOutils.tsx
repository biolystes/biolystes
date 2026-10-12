import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { NavigationType, UNSAFE_LocationContext, useLocation } from "react-router-dom";
import {
  ECART,
  Encart,
  EncartPose,
  LARGEUR_ENCART,
  DUREE_ETAPE,
  type Agent,
  type Cote,
  type Pied,
  type Point,
  type Pointe,
  type Rect,
  type TailleCadre,
} from "../VisionEtages";
import { createPortal } from "react-dom";
import { EcranOmbre, type Fen } from "./EcranOmbre";
import { ResultatGoogleAvis } from "../ResultatGoogleAvis";
import { BrandAdvisorChatCard } from "@lystes/components/brand/BrandAdvisorChatCard";
import { FORMULAIRE_VIDE } from "@lystes/components/brand/FormulaireContact";
import { VueMultiLien } from "@lystes/pages/BrandLinkPage";
import { VueAvisMarque } from "@lystes/pages/BrandReviewsPage";
import { VueFaqMarque } from "@lystes/pages/BrandFaqPage";
import { VuePaiement } from "@lystes/pages/BrandPayPage";
import { VueContact } from "@lystes/pages/BrandContactPage";
import { VueLienInfluenceur } from "@lystes/pages/InfluencerLinkPage";
import { VueRdv } from "@lystes/pages/RdvPublicPage";
import { VueMagazineMarque } from "@lystes/features/magazine/pages/BlogMarquePage";
import { deMarque } from "@lystes/lib/elision";
import {
  AGENT_DIAGNOSTIC_DEMO,
  ARTICLES_DEMO,
  AVIS_DEMO,
  CONSEILLER_DEMO,
  CONTACT_DEMO,
  FAQ_DEMANDES,
  FAQ_GENERAL,
  FAQ_SECTIONS,
  FICHE_DEMO,
  INFLUENCEUSE_DEMO,
  LOGO_DEMO,
  MARQUE_DEMO,
  MULTI_LIEN_DEMO,
  QUESTIONS_DIAG_DEMO,
  RDV_CLIENTES_DEMO,
  RDV_INSTITUT_DEMO,
  RDV_PRO_DEMO,
  SLUG_DEMO,
} from "./demoLystes";

/**
 * L'onglet « Vos outils » de l'accueil (10/10/2026, JP) : « tu reproduis en
 * HTML le multilien, la plateforme d'avis, la plateforme de mag, la plateforme
 * de paiement, la plateforme de contact… quand on passe à l'outil d'après, on
 * change d'écran ». Une étape, un poste, un écran.
 *
 * Depuis le 12/10/2026 (JP : « il fallait reproduire les différents écrans à
 * la perfection, pour ne pas avoir à faire des iframes, parce qu'à chaque
 * fois ça charge très longtemps »), aucun écran n'est plus une iframe :
 * chacun est la VRAIE vue de la page publique (VueMultiLien, VueAvisMarque,
 * VueMagazineMarque, VueFaqMarque, VuePaiement, VueContact), extraite de sa
 * page et partagée avec elle, nourrie des données de démonstration de
 * Lystes & Partners (demoLystes.tsx). Aucun appel au serveur : l'écran se
 * dessine dans la même image que le changement d'étape.
 *
 * Chaque écran est rendu dans une racine d'ombre (EcranOmbre.tsx) : les styles
 * de l'accueil n'y entrent pas, et la page s'y dessine à la largeur de
 * l'écran (ordinateur réduit, ou téléphone), comme chez elle. L'écran ne
 * reçoit ni clic ni clavier (inert) : aucun lien ne part, rien ne s'envoie.
 *
 * Le multi-lien montre son conseiller IA (JP, 12/10 : « le chat multilien est
 * censé avoir un LLM, que je ne vois pas dans l'exemple ») : une question
 * d'une cliente, une réponse qui oriente vers un produit ; puis le bouton du
 * diagnostic et la fenêtre qu'il ouvre.
 */

type Props = {
  etape: number;
  survol: (s: boolean) => void;
  mobile: boolean;
  pied: Pied;
  taille: (t: TailleCadre) => void;
  /* L'écran de l'étape est dessiné et le point a trouvé sa cible. */
  prete?: (p: boolean) => void;
};

/* Chaque étape porte le nom de SON OUTIL (JP, 10/10 nuit : « il y a deux
   fois la même chose, Responsable avis ») : aucun nom ni aucun encart de
   l'onglet « Votre e-commerce » n'est repris ici. Les textes disent ce que
   fait la page publique de l'outil, rien de plus : BrandLinkPage,
   BrandReviewsPage (note de la marque et de chaque produit, répartition,
   avis publiés aussitôt, sans compte), BlogMarquePage, BrandFaqPage (deux
   socles : l'essentiel des fiches, puis les préoccupations relevées dans les
   conversations, les avis et les messages, classées par fréquence et revues
   chaque semaine), BrandPayPage (montant libre, en une ou plusieurs fois),
   BrandContactPage (le conseiller répond aussitôt, le message reste
   transmis). */
export const AGENTS_OUTILS: Agent[] = [
  /* Textes de JP, 12/10/2026 : ce que chaque outil apporte à la marque. */
  { nom: "Multi-lien IA", mission: "un seul lien qui oriente vers le bon produit",
    role: "Orienter le visiteur venu d’Instagram, de TikTok ou de LinkedIn, le plus vite possible, vers ce qui l’intéresse.",
    unique: "Un chat IA répond tout de suite, avec la FAQ, les avis proches de ses préoccupations et un diagnostic ou un essayage immédiat. Les produits à la une changent seuls : votre sélection, vos meilleures ventes ou les plus appréciés." },
  { nom: "Page d’avis IA", mission: "des avis qui font votre réputation sur Google", elle: true,
    role: "Améliorer la réputation de votre marque avec une page d’avis, notée produit par produit.",
    unique: "Vos étoiles apparaissent sur Google. La page et chaque produit sont indexés : qui tape le nom d’un produit voit ses avis dans les résultats." },
  { nom: "Magazine IA", mission: "des articles qui amènent des clientes prêtes à acheter",
    role: "Publier des articles nés des préoccupations de vos clientes et des mots-clés qui ont le plus de chances de faire vendre.",
    unique: "Ils s’écrivent seuls, pour Google et pour être cités par ChatGPT, avec des boutons qui mènent toujours à l’achat. Ils amènent un trafic qualifié, prêt à acheter." },
  { nom: "Page FAQ IA", mission: "les réponses à vos clientes, et des liens vers votre site", elle: true,
    role: "Répondre aux questions de vos clientes sur une page lue par Google et par les IA.",
    unique: "Hébergée sur lystes.ai, elle crée des liens vers votre site, comme le magazine. Chaque produit y porte un bouton vers sa page chez vous." },
  { nom: "Paiement IA", mission: "le paiement en plusieurs fois, en boutique",
    role: "Faciliter la vente dans votre institut ou votre point de vente.",
    unique: "Vous proposez le paiement en plusieurs fois par un simple lien : la cliente saisit le montant et choisit comment régler, sans terminal." },
  { nom: "Contact IA", mission: "un formulaire qui règle les demandes avant vous",
    role: "Mettre sur votre site un formulaire qui crée un ticket pour chaque demande de vos clientes.",
    unique: "Un agent IA reprend aussitôt la conversation dans un chat et répond tout de suite. Quand vous ouvrez la demande, elle est souvent déjà réglée : votre charge de travail baisse." },
  /* JP, 12/10/2026 : la marque crée le lien de chaque influenceur
     (/dashboard/collaborations) ; sa page publique (/i/<pseudo>) ouvre le
     diagnostic ou l'essayage. Une vente passée avec le code promo du lien
     lui est rattachée (shopify-webhooks, attribuerLaVente). */
  { nom: "Lien influenceur IA", mission: "vos influenceurs vendent avec un diagnostic ou un essayage",
    role: "Créer un lien par influenceur, pour que sa communauté découvre vos produits avec lui.",
    unique: "Sa communauté fait un diagnostic pour trouver ses produits, ou essaie les looks qu’il a partagés sur Instagram. Chaque vente passée avec son code promo est rattachée à son lien." },
  /* JP, 12/10/2026 : la page publique de réservation (/rdv/<slug>, ou
     /<marque>/booking), pour un institut comme pour une entreprise. Les
     rappels : déclencheur cc_programmer_rappels et send-booking-reminders
     (la veille, puis une heure avant). */
  { nom: "Booking IA", mission: "vos rendez-vous pris en ligne, même la nuit",
    role: "Laisser vos clientes réserver une prestation en ligne, à toute heure.",
    unique: "Pour un institut comme pour une entreprise : vos clients choisissent la prestation, le jour et le créneau, seuls. Un rappel part la veille, puis une heure avant." },
];


/* L'adresse de chaque écran, pour une légende sous le visuel. */
export const ADRESSES_OUTILS = [
  `lystes.ai/${SLUG_DEMO}`,
  `lystes.ai/${SLUG_DEMO}/avis`,
  `lystes.ai/${SLUG_DEMO}/mag`,
  `lystes.ai/${SLUG_DEMO}/faq`,
  `lystes.ai/${SLUG_DEMO}/pay`,
  `lystes.ai/${SLUG_DEMO}/contact`,
  `lystes.ai/i/${INFLUENCEUSE_DEMO.instagram_handle}`,
  `lystes.ai/${SLUG_DEMO}/booking`,
];
/* La marque de la légende. */
export const MARQUE_OUTILS = MARQUE_DEMO;

/* Le formulaire qui devient conversation a besoin de plus de temps qu'une
   étape ordinaire : la saisie, l'envoi, puis la réponse à lire. */
const DUREE_CONTACT = 12000;
/* Le multi-lien se parcourt de haut en bas, partie par partie (T_ML) :
   l'en-tête, la conversation, le bouton du diagnostic et sa fenêtre, les
   produits et les liens, puis les avis. */
const DUREE_MULTI_LIEN = 21000;
/* La page d'avis, puis le résultat Google avec ses étoiles. */
const DUREE_AVIS = 10500;
/* Le lien influenceur : la créatrice, ses produits, son code, puis le
   diagnostic que lance sa communauté. */
const DUREE_INFLUENCEUR = 15000;
/* Booking IA : la réservation d'un institut, puis celle d'une entreprise. */
const DUREE_RDV = 20000;
export function dureeEtapeOutils(etape: number): number {
  return etape === 7 ? DUREE_RDV : etape === 6 ? DUREE_INFLUENCEUR : etape === 5 ? DUREE_CONTACT : etape === 0 ? DUREE_MULTI_LIEN : etape === 1 ? DUREE_AVIS : DUREE_ETAPE;
}

const SLUG = SLUG_DEMO;
const MARQUE = MARQUE_DEMO;

/* ---------- Le téléphone (présentation téléphone seulement) ----------
   Depuis le 11/10, sur ordinateur, les pages sont en largeur d'ordinateur,
   réduites (voir « L'ordinateur réduit » plus bas). Ce qui suit ne vaut plus
   que pour la présentation téléphone de la scène.
   JP, 10/10 nuit : « on ne voit pas le multi-lien, Responsable avis on ne le
   voit pas ». Les pages de la marque sont des pages de téléphone : rendues à
   1280 × 800 puis réduites, le multi-lien n'était qu'une colonne minuscule au
   milieu d'un grand cadre gris. Chaque écran est maintenant rendu à la
   largeur d'un téléphone, dans un cadre de téléphone sobre :
   - quand l'encart se pose à côté du point, le téléphone prend toute la
     hauteur de la boîte (520 px) et l'encart se pose à sa droite ;
   - en présentation téléphone (encart sous le visuel), il prend toute la
     largeur du visuel.
   Chaque page est rendue à 320 px, la largeur du plus petit téléphone : les
   pages du multi-lien, dont la carte ne dépasse pas 283 px (BrandLinkPage),
   laissaient sinon deux marges grises, et à 390 px les avis et la FAQ
   sortaient à 7 px à 1440 (relecture du 10/10). */
const ECRAN_TEL = { l: 390, h: 800 };
const BORD_TEL = 6;
const HAUT_TEL = 520;
type Geometrie = { boiteW: number; boiteH: number; x: number; telW: number; telH: number; ecranW: number; ecranH: number; bord: number };
function geometrie(boiteW: number, mobile: boolean): Geometrie {
  if (mobile) {
    const boiteH = Math.round(Math.min(420, boiteW * 1.3));
    return { boiteW, boiteH, x: 0, telW: boiteW, telH: boiteH, ecranW: boiteW - 2 * BORD_TEL, ecranH: boiteH - 2 * BORD_TEL, bord: BORD_TEL };
  }
  /* Sur ordinateur, l'écran prend toute la boîte, sans cadre de téléphone. */
  return { boiteW, boiteH: HAUT_TEL, x: 0, telW: boiteW, telH: HAUT_TEL, ecranW: boiteW, ecranH: HAUT_TEL, bord: 0 };
}
/* La largeur qu'il faut à la boîte pour que la page réduite reste lisible
   (texte à 9 px au moins à l'écran) avec l'encart posé dessus. En deux
   colonnes, la boîte ne fait que 516 px à 1440 : la scène passe en une
   colonne (872 px), comme à 1024 ; l'iPad en portrait (576 px) garde
   l'ordinateur réduit. Au téléphone, la présentation téléphone entière.
   Jamais d'entre-deux. */
const LARGEUR_POSEE = 534;

/* ---------- L'ordinateur réduit ----------
   JP, 11/10/2026 : « la partie multi-lien, je ne sais pas pourquoi tu as
   choisi de la faire en mobile. J'aurais préféré la version normale, mais
   que tu t'occupes de la proportion pour qu'on voie assez de choses à
   l'écran… essaie un côté zoom arrière ». Sur ordinateur, chaque page est
   rendue en largeur d'ordinateur, puis réduite dans la boîte ; l'encart,
   lui, garde sa taille et se pose par-dessus.
   - Les pages en pleine largeur (avis, magazine, FAQ) sont rendues à
     1100 px et réduites à la largeur de la boîte.
   - Les pages en carte (multi-lien, paiement, contact : une carte de 283 px
     au milieu d'un fond gris) sont rendues larges, réduites moins fort, et
     cadrées pour que la carte et l'encart tiennent côte à côte : réduite à
     la largeur de la boîte, la carte n'était plus qu'une colonne illisible
     au milieu du gris (JP, 10/10 nuit).
   Le multi-lien, lui, est rendu à sa largeur de téléphone (`colonne`) :
   JP, 12/10/2026 : « c'est tellement zoomé qu'on ne voit pas que c'est un
   multi-lien. On doit quand même voir le truc entier ». La page entière, du
   logo aux avis, réduite dans un cadre, puis parcourue de haut en bas. */
const CARTE = 283;
type Vue = { k: number; x0: number; y0?: number; l: number; h: number; cadre?: boolean };
type Ordi = {
  /* La largeur de rendu de la page, en pixels CSS. */
  largeur: number;
  /* Une page en carte, cadrée sur la carte. */
  carte?: boolean;
  /* La largeur de la carte, si ce n'est pas celle du multi-lien (283 px),
     et sa marge droite où l'encart peut mordre (20 px par défaut). */
  carteL?: number;
  carteMarge?: number;
  /* La page entière est la carte : posée dans un cadre, comme le multi-lien. */
  cadre?: boolean;
  /* Une page de téléphone, rendue à cette largeur dans un cadre. */
  colonne?: number;
  /* Page en pleine largeur : sa réduction (0,9 par défaut), et la largeur
     de rendu sous laquelle elle ne descend pas (sa mise en page change). */
  echelle?: number;
  minimum?: number;
};
function vueDe(e: EtapeOutil, g: Geometrie, mobile: boolean): Vue {
  if (mobile || !e.ordi) {
    const l = e.largeur ?? ECRAN_TEL.l;
    const k = g.ecranW / l;
    return { k, x0: 0, l, h: Math.round(g.ecranH / k) };
  }
  const o = e.ordi;
  const W = g.ecranW;
  if (o.colonne) {
    /* La colonne et l'encart (point, écart, 240 px : 262) côte à côte,
       centrés ensemble. Réduite à 0,75 au plus bas (boîte de 535 px à
       1440) : les liens (12 px) restent à 9 px à l'écran ; jamais au-delà
       de 0,8, pour que la page se voie presque entière. */
    const k = Math.min(0.8, (W - 274) / o.colonne);
    const gauche = Math.max(8, Math.round((W - (o.colonne * k + 262)) / 2));
    const y0 = MARGE_COLONNE;
    return { k, x0: -gauche / k, y0, l: o.colonne, h: Math.round((g.ecranH - 2 * y0) / k), cadre: true };
  }
  if (o.carte) {
    /* La carte à taille réelle, et l'encart (point, écart, 240 px) à côté,
       centrés ensemble : réduite, la carte du multi-lien tombait à 8 px de
       texte (relecture du 11/10). */
    /* L'encart peut mordre sur la marge blanche droite de la carte (20 px) :
       263 = 20 + 243 de contenu ; 262 = point, écart et encart. */
    const cl = o.carteL ?? CARTE;
    const utile = cl - (o.carteMarge ?? 20);
    const k = Math.min(1, (W - 270) / utile);
    const gauche = Math.max(4, Math.round((W - (utile * k + 262)) / 2));
    const x0 = (o.largeur - cl) / 2 - gauche / k;
    if (o.cadre) return { k, x0, y0: MARGE_COLONNE, l: o.largeur, h: Math.round((g.ecranH - 2 * MARGE_COLONNE) / k), cadre: true };
    return { k, x0, l: o.largeur, h: Math.round(g.ecranH / k) };
  }
  /* Une boîte large (une colonne, iPad) élargit le rendu plutôt que de
     grossir la page : à 1024 px, réduite à 0,75, la une du magazine ne
     tenait plus en hauteur (« À la une » et « Lire l'article » tranchés). */
  /* Rendue en largeur d'ordinateur (790 px au moins : en dessous, les
     pages passent en mise en page de téléphone), réduite à 0,9 : le texte
     courant (13 à 14 px) reste lisible. À 0,51, il tombait à 5 ou 6 px
     (relecture du 11/10 : « illisible »). */
  const l = Math.max(LARGEUR_MIN_ORDI, o.minimum ?? 0, Math.round(W / (o.echelle ?? 0.9)));
  const k = W / l;
  return { k, x0: 0, l, h: Math.round(g.ecranH / k) };
}
const LARGEUR_MIN_ORDI = 790;
/* Le multi-lien sur ordinateur : la largeur d'un téléphone (la carte de
   332 px et sa marge grise), et l'air au-dessus et au-dessous du cadre. */
const COLONNE_MULTI_LIEN = 348;
const MARGE_COLONNE = 12;

/* Où le point se pose sur la zone (les trois prises de la visite, plus le
   bord droit), où se pose l'encart, et l'écart du point hors de la zone :
   posé sur un texte, le point en cachait les dernières lettres. */
type PriseOutil = "gauche" | "droite" | "centre" | "haut";
type Visee = { prise: PriseOutil; cote: Cote; decalage?: number };
function viser(r: Rect, v: Visee): Point {
  const d = v.decalage ?? 0;
  if (v.prise === "centre") return { x: r.x + r.w / 2, y: r.y + r.h / 2 };
  if (v.prise === "haut") return { x: r.x + r.w / 2, y: r.y - d };
  if (v.prise === "droite") return { x: r.x + r.w + d, y: r.y + r.h / 2 };
  return { x: r.x - d, y: r.y + r.h / 2 };
}


type Planifier = (f: () => void, ms: number) => void;
/* Une zone en pixels de l'écran de l'accueil (getBoundingClientRect). */
type Zone = { left: number; top: number; width: number; height: number };
/* `serrer` : l'écran demande un cadre plus bas que la boîte (la hauteur de
   sa page, en pixels de page), ou null pour la hauteur pleine. */
type Rendu = { fen: Fen; actif: boolean; cle: string; ordi: boolean; serrer: (h: number | null) => void };
type EtapeOutil = {
  titre: string;
  /* La largeur de rendu de la page au téléphone, en pixels CSS (390 par défaut). */
  largeur?: number;
  /* Une règle propre à cet écran, posée dans la page. */
  style?: string;
  /* L'écran : la vraie vue de la page publique, nourrie des données de démonstration. */
  ecran: (r: Rendu) => ReactNode;
  /* L'écran dirige lui-même son défilement et sa cible (data-vo-cible). */
  autonome?: boolean;
  /* L'élément qui dit que la page est prête, et vers lequel elle défile. */
  ancre: (f: Fen) => Element | null;
  /* Où pulse le point (par défaut, l'ancre). */
  cible?: (f: Fen) => Element | null;
  /* Ou une zone plus fine que l'élément : un texte jusqu'à sa fin réelle. */
  zone?: (f: Fen) => Zone | null;
  visee: Visee;
  /* La hauteur où amener la page (en pixels de la page), une fois l'ancre trouvée. */
  haut?: (ancre: Element, f: Fen) => number;
  /* Ce que l'étape fait dans la page, sans rien écrire, une fois la page prête. */
  preparer?: (f: Fen, plusTard: Planifier) => void;
  /* Sur ordinateur : la page en largeur d'ordinateur, réduite. */
  ordi?: Ordi;
  /* Ce qui change sur ordinateur. */
  surOrdi?: Partial<Pick<EtapeOutil, "ancre" | "cible" | "zone" | "visee" | "haut">>;
};

const q = (f: Fen, sel: string) => f.racine.querySelector(sel);
/* La réduction de l'écran (1 = page à taille réelle). */
const echelle = (f: Fen) => (f.vue.offsetWidth ? f.vue.getBoundingClientRect().width / f.vue.offsetWidth : 1);

/* Les écrans autonomes disent eux-mêmes où pulse le point, et comment le
   viser, sur leur écran. */
const parAttribut = (f: Fen) => {
  const sel = f.vue.getAttribute("data-vo-cible");
  return sel ? q(f, sel) : null;
};
const viseeLue = (f: Fen): Visee | null => {
  try {
    const v = f.vue.getAttribute("data-vo-visee");
    return v ? (JSON.parse(v) as Visee) : null;
  } catch {
    return null;
  }
};

/* Un paragraphe arrêté à la fin de sa plus longue ligne : le bord de sa
   boîte dépassait le texte de toute la largeur restante, et le point
   tombait sur le flacon de la photo (relecture du 10/10). */
const finDuTexte = (p: Element | null): Zone | null => {
  if (!p) return null;
  const b = p.getBoundingClientRect();
  const r = document.createRange();
  r.selectNodeContents(p);
  const lignes = [...r.getClientRects()].filter((l) => l.width > 1);
  if (!lignes.length) return null;
  const droite = Math.max(...lignes.map((l) => l.right));
  return { left: b.left, top: b.top, width: droite - b.left, height: b.height };
};

/* Les étoiles du produit, dans le résultat Google de l'étape des avis. */
const etoilesGoogle = (f: Fen) => q(f, '[data-vo-google] [data-resultat="produit"] > div:last-child');
/* Le point au bord droit du résultat, à hauteur des étoiles : l'encart ne
   couvre pas le titre du produit. */
const zoneGoogle = (f: Fen): Zone | null => {
  const e = etoilesGoogle(f)?.getBoundingClientRect();
  const r = e && etoilesGoogle(f)?.parentElement?.getBoundingClientRect();
  return e && r ? { left: r.left, top: e.top, width: r.width, height: e.height } : null;
};

/* Le titre « Questions par produit » de la FAQ, au-dessus du carrousel. */
const titreParProduit = (f: Fen) =>
  [...f.racine.querySelectorAll("h2")].find((h) => /par produit/i.test(h.textContent ?? "")) ?? null;

/* Le multi-lien dit lui-même où pulse le point (data-vo-cible) et, s'il le
   faut, le bloc dont la cible prend la largeur (data-vo-large) : le point
   se pose au bord de ce bloc, à hauteur de la cible, et l'encart à côté,
   sans couvrir le texte (une bulle, une question de la fenêtre). */
const zoneMultiLien = (f: Fen): Zone | null => {
  const c = parAttribut(f);
  const large = f.vue.getAttribute("data-vo-large");
  if (!c || !large) return null;
  const m = q(f, large)?.getBoundingClientRect();
  const b = c.getBoundingClientRect();
  return m ? { left: m.left, top: b.top, width: m.width, height: b.height } : null;
};

const ETAPES: EtapeOutil[] = [
  {
    titre: `Le multi-lien de ${MARQUE} sur lystes.ai`,
    largeur: 320,
    ordi: { largeur: COLONNE_MULTI_LIEN, colonne: COLONNE_MULTI_LIEN },
    ecran: (r) => <MultiLienDemo {...r} />,
    /* La page se parcourt elle-même, partie par partie (MultiLienDemo). */
    autonome: true,
    ancre: parAttribut,
    zone: zoneMultiLien,
    visee: { prise: "droite", cote: "droite", decalage: 6 },
  },
  {
    titre: `La page d’avis de ${MARQUE} sur lystes.ai`,
    largeur: 320,
    ordi: { largeur: 1100 },
    /* Pas de carrousel de produits en haut (JP, 10/10 nuit) : caché dans la
       démonstration seulement, la vraie page le garde. */
    style: "section:has(> div > div.snap-x.overflow-x-auto){display:none!important}",
    ecran: (r) => <AvisDemo {...r} />,
    /* La répartition des notes, au bout des pourcentages ; puis, sur le
       résultat Google, au bout des étoiles du produit. */
    ancre: (f) => q(f, "aside h2 + div"),
    cible: (f) => etoilesGoogle(f) ?? q(f, "aside h2 + div"),
    zone: zoneGoogle,
    visee: { prise: "droite", cote: "droite", decalage: 13 },
    /* Sur ordinateur, au bout des deux boutons de l'en-tête, l'encart sur les
       photos de l'en-tête (relecture du 11/10). */
    surOrdi: {
      ancre: (f) => q(f, ".lyr-btns > :last-child"),
      cible: (f) => etoilesGoogle(f) ?? q(f, ".lyr-btns > :last-child"),
      /* Le point 40 px (de page) sous le milieu du bouton. */
      zone: (f) => {
        if (etoilesGoogle(f)) return zoneGoogle(f);
        const b = q(f, ".lyr-btns > :last-child")?.getBoundingClientRect();
        return b ? { left: b.left, top: b.top + 40 * echelle(f), width: b.width, height: b.height } : null;
      },
      visee: { prise: "droite", cote: "droite", decalage: 12 },
      haut: () => 0,
    },
    /* En haut de page si la répartition tient dans l'écran ; sinon, l'écran
       commence aux deux boutons. */
    haut: (ancre, f) => {
      const bas = f.rect(ancre).bottom + f.scrollY;
      if (bas + 24 <= f.innerHeight) return 0;
      const boutons = q(f, ".lyr-btns");
      return boutons ? f.rect(boutons).top + f.scrollY - 16 : bas + 24 - f.innerHeight;
    },
  },
  {
    titre: `Le magazine de ${MARQUE} sur lystes.ai`,
    /* 0,68 : la une garde sa photo à gauche et son titre à droite, et tient
       en hauteur, de « À la une » à « Lire l'article ». */
    ordi: { largeur: 1100, echelle: 0.68, minimum: 1100 },
    ecran: (r) => <MagazineDemo {...r} />,
    autonome: true,
    ancre: parAttribut,
    zone: (f) => finDuTexte(parAttribut(f)),
    visee: { prise: "droite", cote: "droite", decalage: 6 },
  },
  {
    titre: `La FAQ de ${MARQUE} sur lystes.ai`,
    largeur: 320,
    ordi: { largeur: 1100, echelle: 0.75 },
    ecran: () => (
      <VueFaqMarque
        data={FICHE_DEMO}
        marque={MARQUE}
        chargement={false}
        vide={false}
        demandes={FAQ_DEMANDES}
        general={FAQ_GENERAL}
        sections={FAQ_SECTIONS}
      />
    ),
    /* Sur ordinateur, la page entière (JP, 11/10) : le point au bout des deux
       boutons de l'en-tête. */
    surOrdi: {
      ancre: (f) => q(f, ".lyr-btns > :last-child"),
      cible: (f) => q(f, ".lyr-btns > :last-child"),
      zone: () => null,
      visee: { prise: "droite", cote: "droite", decalage: 12 },
      haut: (_a, f) => {
        const tete = q(f, "header");
        return tete ? f.rect(tete).bottom + f.scrollY : 0;
      },
    },
    /* Au téléphone, les questions PAR PRODUIT : le point au bout du titre. */
    ancre: titreParProduit,
    zone: (f) => finDuTexte(titreParProduit(f)),
    visee: { prise: "droite", cote: "droite", decalage: 18 },
    haut: (ancre, f) => f.rect(ancre).top + f.scrollY - 20,
  },
  {
    titre: `La page de paiement de ${MARQUE} sur lystes.ai`,
    largeur: 320,
    ordi: { largeur: 1600, carte: true },
    ecran: (r) => <PaiementDemo {...r} />,
    ancre: (f) => q(f, "input.bpay-amount"),
    visee: { prise: "droite", cote: "droite", decalage: 6 },
  },
  {
    titre: `Le formulaire de contact de ${MARQUE} sur lystes.ai`,
    largeur: 320,
    ordi: { largeur: 1600, carte: true },
    ecran: (r) => <ContactDemo {...r} />,
    autonome: true,
    ancre: parAttribut,
    visee: { prise: "droite", cote: "droite", decalage: 6 },
  },
  {
    titre: `Le lien influenceur de ${INFLUENCEUSE_DEMO.display_name} pour ${MARQUE}`,
    /* 280 px au téléphone : à 320, réduite à 0,83 à 375, la page tombait
       sous 9 px. */
    largeur: 280,
    /* La carte de la page (309 px) presque à taille réelle. Le point se
       pose au bord du contenu de la carte, l'encart à côté, sur sa marge
       blanche, sans couvrir de texte. */
    ordi: { largeur: 1600, carte: true, carteL: 309, carteMarge: 24 },
    /* Les boutons de la carte passent de 9 à 10 px dans la démonstration
       seulement : réduite à 0,96 à 1440, la carte les gardait sous 9 px. */
    style: '.blp-main-card [style*="font-size: 9px"]{font-size:10px!important}',
    ecran: (r) => <InfluenceurDemo {...r} />,
    autonome: true,
    ancre: parAttribut,
    zone: zoneMultiLien,
    visee: { prise: "droite", cote: "droite", decalage: 6 },
  },
  {
    titre: `La prise de rendez-vous de ${MARQUE} sur lystes.ai`,
    /* 280 px au téléphone : à 320, réduite à 0,83 à 375, la page tombait
       sous 9 px. */
    largeur: 280,
    /* La page en colonne de téléphone (280 px), à taille réelle dans son
       cadre : ses intitulés sont en 10 px. L'encart se pose à côté. */
    ordi: { largeur: 280, carte: true, carteL: 280, carteMarge: 0, cadre: true },
    ecran: (r) => <RdvDemo {...r} />,
    autonome: true,
    ancre: parAttribut,
    zone: zoneMultiLien,
    visee: { prise: "droite", cote: "droite", decalage: 6 },
  },
];

const CSS = `
.lyv-o-ecran{ pointer-events:none; }
/* Le téléphone : un cadre noir sobre, l'écran blanc. */
.lyv-o-tel{ position:absolute; top:0; box-sizing:border-box; border:${BORD_TEL}px solid #111; border-radius:34px; overflow:hidden;
  background:#fff; isolation:isolate; }
.lyv-o-tel.plat{ border-radius:24px; }
/* Sur ordinateur : la page réduite, sans cadre de téléphone ; elle recule
   en douceur quand le multi-lien ouvre sa fenêtre. */
.lyv-o-tel.ordi{ border:0; border-radius:14px; background:#f4f4f5; }
.lyv-o-tel.ordi .lyv-o-ecran{ transition:opacity .45s ease, visibility 0s linear .45s, transform .8s cubic-bezier(.4,0,.2,1); }
.lyv-o-tel.ordi .lyv-o-ecran.on{ transition:opacity .45s ease, transform .8s cubic-bezier(.4,0,.2,1); }
`;

/* Délai au-delà duquel l'étape se montre même sans sa cible, à condition
   que sa page ait rendu du texte. */
const SECOURS = 1500;

type Vise = { p: Point; cote: Cote; etape: number; cache?: boolean };

export default function VisiteOutils({ etape, survol, mobile, pied, taille, prete }: Props) {
  const boite = useRef<HTMLDivElement>(null);
  const fens = useRef<(Fen | null)[]>([]);
  const [geo, setGeo] = useState<Geometrie | null>(null);
  const [vise, setVise] = useState<Vise | null>(null);
  const [prets, setPrets] = useState<boolean[]>([]);
  /* La hauteur demandée par chaque écran (null : la boîte entière). */
  const [serres, setSerres] = useState<(number | null)[]>([]);
  const serrers = useMemo(
    () => ETAPES.map((_, i) => (h: number | null) =>
      setSerres((v) => {
        if ((v[i] ?? null) === h) return v;
        const n = [...v];
        n[i] = h;
        return n;
      })),
    [],
  );
  /* L'écran affiché : celui de l'étape dès qu'il a trouvé sa cible. Les huit
     écrans sont montés dès l'ouverture de l'onglet : sans cadre ni réseau,
     ils se dessinent dans la même image. */
  const [affiche, setAffiche] = useState(-1);
  const [secours, setSecours] = useState(false);
  const base = ETAPES[etape] ?? ETAPES[0];
  const etapeOutil = useMemo<EtapeOutil>(
    () => (mobile || !base.surOrdi ? base : { ...base, ...base.surOrdi }),
    [base, mobile],
  );
  const pret = !!prets[etape];
  const geoRef = useRef<Geometrie | null>(null);
  geoRef.current = geo;
  const viseCourant = vise && vise.etape === etape ? vise : null;
  const visible = secours && pret ? etape : affiche;

  /* Le secours ne libère l'étape que sur un écran qui a rendu sa page. */
  useEffect(() => {
    setSecours(false);
    let id = 0;
    const essayer = () => {
      const texte = fens.current[etape]?.defile.innerText?.trim() ?? "";
      if (texte.length > 80) setSecours(true);
      else id = window.setTimeout(essayer, 500);
    };
    id = window.setTimeout(essayer, SECOURS);
    return () => window.clearTimeout(id);
  }, [etape]);

  useEffect(() => {
    prete?.(!!viseCourant || (secours && pret));
  }, [viseCourant, secours, pret, prete]);

  useLayoutEffect(() => {
    const b = boite.current;
    if (!b) return;
    const maj = () => {
      const g = geometrie(b.clientWidth, mobile);
      setGeo((o) => (o && o.boiteW === g.boiteW && o.boiteH === g.boiteH && o.ecranW === g.ecranW && o.x === g.x ? o : g));
      taille({ w: b.clientWidth, h: g.boiteH, largeurMin: LARGEUR_POSEE });
    };
    maj();
    const ro = new ResizeObserver(maj);
    ro.observe(b);
    return () => ro.disconnect();
  }, [taille, mobile]);

  const signalerPret = useCallback((i: number, f: Fen) => {
    fens.current[i] = f;
    setPrets((v) => {
      if (v[i]) return v;
      const n = [...v];
      n[i] = true;
      return n;
    });
  }, []);

  /* L'étape met sa page en état (défilement, ce qu'elle y fait), puis le
     point suit l'élément, mesuré à l'écran de l'accueil. */
  useEffect(() => {
    if (!pret) return;
    const f = fens.current[etape];
    if (!f) return;
    let fini = false;
    const minuteurs: number[] = [];
    const plusTard: Planifier = (fn, ms) => { minuteurs.push(window.setTimeout(() => { if (!fini) fn(); }, ms)); };
    let prepare = 0;
    let raf = 0;
    /* La hauteur voulue pour l'ancre, jamais au-delà du bas de la page. */
    const voulu = (ancre: Element) => {
      const ecran = f.innerHeight;
      const max = Math.max(0, f.scrollHeight - ecran);
      if (etapeOutil.haut) return Math.min(max, Math.max(0, etapeOutil.haut(ancre, f)));
      const r = f.rect(ancre);
      const absolu = r.top + f.scrollY;
      if (absolu + Math.min(r.height, 200) <= ecran - 40) return 0;
      return Math.min(max, Math.max(0, absolu - Math.max(40, (ecran - Math.min(r.height, ecran - 80)) / 2)));
    };
    const recaler = () => {
      const a = etapeOutil.ancre(f);
      if (!a) return;
      const h = voulu(a);
      if (Math.abs(h - f.scrollY) > 8) f.scrollTo({ top: h, behavior: "smooth" });
    };
    let arrivee = !!etapeOutil.autonome;
    const mesurer = () => {
      if (fini) return;
      const ancre = etapeOutil.ancre(f);
      if (ancre && !prepare && ancre.getBoundingClientRect().width > 0) {
        prepare = performance.now();
        etapeOutil.preparer?.(f, plusTard);
        if (!etapeOutil.autonome) {
          /* La page saute à sa place au lieu d'y défiler sous les yeux. */
          f.scrollTo({ top: voulu(ancre), behavior: "instant" as ScrollBehavior });
          [600, 1500, 3000].forEach((ms) => plusTard(recaler, ms));
        }
        setAffiche(etape);
      }
      if (prepare && !arrivee) {
        const a = etapeOutil.ancre(f);
        arrivee = !a || Math.abs(f.scrollY - voulu(a)) <= 2 || performance.now() - prepare > 1600;
      }
      const el = prepare ? (etapeOutil.cible ?? etapeOutil.ancre)(f) : null;
      const r = el ? (etapeOutil.zone?.(f) ?? el.getBoundingClientRect()) : null;
      const v = (etapeOutil.autonome && viseeLue(f)) || etapeOutil.visee;
      const attente = prepare > 0 && (!arrivee || f.vue.hasAttribute("data-vo-attente"));
      const B = boite.current?.getBoundingClientRect();
      const qv = B && r && r.width > 0
        ? viser({ x: r.left - B.left, y: r.top - B.top, w: r.width, h: r.height }, v)
        : null;
      const proche = (a: number, b: number) => Math.abs(a - b) < 0.5;
      setVise((o) => {
        if (attente) return o && o.etape === etape ? (o.cache ? o : { ...o, cache: true }) : o;
        if (!qv) return o && o.etape === etape ? null : o;
        if (o && o.etape === etape && !o.cache && o.cote === v.cote && proche(o.p.x, qv.x) && proche(o.p.y, qv.y)) return o;
        return { p: qv, cote: v.cote, etape };
      });
      raf = window.requestAnimationFrame(mesurer);
    };
    raf = window.requestAnimationFrame(mesurer);
    return () => {
      fini = true;
      window.cancelAnimationFrame(raf);
      minuteurs.forEach((m) => window.clearTimeout(m));
    };
  }, [pret, etape, etapeOutil, mobile, pied.cle]);

  return (
    <div
      className="lyv-boutique lyv-o"
      ref={boite}
      style={geo ? { height: geo.boiteH } : undefined}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") survol(true); }}
      onPointerLeave={() => survol(false)}
    >
      <style>{CSS}</style>
      {geo && (
        <div className={"lyv-o-tel" + (mobile ? " plat" : " ordi")} style={{ left: geo.x, width: geo.telW, height: geo.telH }}>
          {ETAPES.map((e, i) => {
            const vue = vueDe(e, geo, mobile);
            /* Un écran serré garde sa page entière, centrée en hauteur : la
               confirmation du rendez-vous ne laisse plus un grand blanc. */
            const serre = serres[i];
            const h = serre ? Math.min(vue.h, Math.ceil(serre)) : vue.h;
            const descente = ((vue.h - h) * vue.k) / 2;
            return (
              <EcranOmbre
                key={i}
                titre={e.titre}
                cache={i !== visible}
                className={"lyv-boutique-page lyv-o-ecran" + (i === visible ? " on" : "")}
                style={{
                  width: vue.l,
                  height: h,
                  transform: `translate(${-vue.x0 * vue.k}px, ${(vue.y0 ?? 0) + descente}px) scale(${vue.k})`,
                  /* Le multi-lien dans son cadre : une page de téléphone. */
                  ...(vue.cadre ? { borderRadius: 22, overflow: "hidden", boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 18px 40px -18px rgba(0,0,0,.35)" } : null),
                  /* L'écran se reconnaît à son étape (recette, mesures). */
                  ...({ "--lyv-o-etape": i } as CSSProperties),
                }}
                pret={(f) => signalerPret(i, f)}
              >
                {(f) => (
                  <SansDefilement>
                    <div data-etape={i}>
                      {e.style && <style>{e.style}</style>}
                      {e.ecran({ fen: f, actif: i === etape, cle: pied.cle, ordi: !mobile, serrer: serrers[i] })}
                    </div>
                  </SansDefilement>
                )}
              </EcranOmbre>
            );
          })}
        </div>
      )}
      {viseCourant && !viseCourant.cache && (
        <span className="lyv-pouls" style={{ left: viseCourant.p.x, top: viseCourant.p.y }} aria-hidden="true" />
      )}
      {geo && !mobile && (viseCourant ? !viseCourant.cache : secours) && (
        <EncartPose
          key={`o${etape}`}
          poseDirecte
          serrer={{ min: 180, deborde: 24 }}
          point={viseCourant ? viseCourant.p : null}
          cote={viseCourant?.cote ?? etapeOutil.visee.cote}
          cadre={{ w: geo.boiteW, h: geo.boiteH }}
          largeur={LARGEUR_ENCART}
          contenu={(pointe: Pointe | null, style: CSSProperties) => (
            <Encart agent={AGENTS_OUTILS[etape] ?? AGENTS_OUTILS[0]} loupe={null} pointe={pointe} pied={pied} survol={survol} style={style} />
          )}
        />
      )}
    </div>
  );
}

/* CadreMultiLien remonte la page en haut quand la navigation vient d'un lien :
   posé dans l'accueil, il ferait remonter l'accueil. Pour lui, l'écran est
   arrivé par l'historique (POP), qu'il laisse en place. */
function SansDefilement({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <UNSAFE_LocationContext.Provider value={{ location, navigationType: NavigationType.Pop }}>
      {children}
    </UNSAFE_LocationContext.Provider>
  );
}

/* Le temps écoulé depuis le début de l'étape, tant qu'elle est active. */
function useChrono(actif: boolean, cle: string, fin: number) {
  const [ms, setMs] = useState(0);
  useEffect(() => {
    setMs(0);
    if (!actif) return;
    const debut = performance.now();
    const id = window.setInterval(() => {
      const v = performance.now() - debut;
      setMs(v);
      if (v > fin) window.clearInterval(id);
    }, 40);
    return () => window.clearInterval(id);
  }, [actif, cle, fin]);
  return ms;
}

/* ---------- Le multi-lien : VueMultiLien, son conseiller et son diagnostic ---------- */

/* Les parties du multi-lien, dans l'ordre de la page, et l'instant (depuis
   le début de l'étape) où la visite passe à chacune. Chaque partie reste
   assez longtemps pour se lire avec l'encart. */
const PARTIES_ML = ["haut", "chat", "reponse", "bouton", "fenetre", "questions", "liens", "avis"] as const;
type PartieML = (typeof PARTIES_ML)[number];
const T_ML = [3000, 4300, 7300, 9300, 11900, 14700, 17600];

/* Où pulse le point dans chaque partie, et quelle zone viser. */
const CIBLE_ML: Record<PartieML, { sel: string; large?: string; visee?: Visee }> = {
  /* Le point au bout du nom, après sa coche. */
  haut: { sel: ".blp-main-card .verified", visee: { prise: "droite", cote: "droite", decalage: 14 } },
  chat: { sel: ".lmk-messages > .lmk-message:last-child", large: ".lmk-messages" },
  reponse: { sel: ".lmk-messages > .lmk-message:last-child", large: ".lmk-messages" },
  bouton: { sel: ".lystes-bdf-bouton" },
  fenetre: { sel: "#lystes-bdf-fenetre .lystes-bdf-parcours h3", large: "#lystes-bdf-fenetre" },
  questions: { sel: "#lystes-bdf-fenetre .lystes-bdf-faq h2", large: "#lystes-bdf-fenetre" },
  liens: { sel: ".blp-link-item" },
  avis: { sel: ".blp-reviews-carousel" },
};
const VISEE_ML: Visee = { prise: "droite", cote: "droite", decalage: 6 };

/* La hauteur où amener la page pour montrer la partie, en pixels de la page. */
function hautPartie(f: Fen, partie: PartieML): number {
  const H = f.innerHeight;
  const max = Math.max(0, f.scrollHeight - H);
  const haut = (el: Element | null) => (el ? f.rect(el).top + f.scrollY : 0);
  const bas = (el: Element | null) => (el ? f.rect(el).bottom + f.scrollY : 0);
  let v = 0;
  if (partie === "chat" || partie === "reponse") {
    /* La conversation entière, son pied compris. */
    const c = q(f, ".lmk-carte");
    v = c ? Math.min(haut(c) - 16, bas(c) + 16 - H) : 0;
  } else if (partie === "bouton" || partie === "fenetre" || partie === "questions") {
    /* Le bouton aux deux cinquièmes de l'écran : la fin de la conversation
       au-dessus, les produits au-dessous. */
    v = haut(q(f, ".lystes-bdf-bouton")) - H * 0.4;
  } else if (partie === "liens") {
    /* Les produits et les liens, jusqu'au dernier. */
    const liens = f.racine.querySelectorAll(".blp-link-item");
    const dernier = liens[liens.length - 1] ?? null;
    v = dernier ? bas(dernier) + 20 - H : 0;
  } else if (partie === "avis") {
    v = max;
  }
  return Math.min(max, Math.max(0, Math.round(v)));
}

const mouvementReduit = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* La partie en cours : un minuteur par passage, pas un rendu toutes les 40 ms. */
function usePartie(actif: boolean, cle: string): number {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    if (!actif) return;
    const ids = T_ML.map((t, i) => window.setTimeout(() => setN(i + 1), t));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [actif, cle]);
  return n;
}

function MultiLienDemo({ fen, actif, cle }: Rendu) {
  const n = usePartie(actif, cle);
  /* Mouvement réduit : la page reste en haut, sans défilement ni fenêtre. */
  const reduit = useMemo(mouvementReduit, []);
  const partie: PartieML = reduit ? "haut" : PARTIES_ML[n];
  const repondu = n >= PARTIES_ML.indexOf("reponse");
  const messages = [
    { role: "assistant" as const, content: CONSEILLER_DEMO.accueil },
    { role: "user" as const, content: CONSEILLER_DEMO.question },
    ...(repondu ? [{ role: "assistant" as const, content: CONSEILLER_DEMO.reponse }] : []),
  ];

  /* La fenêtre du diagnostic : ouverte par son bouton, sur le parcours,
     puis sur l'onglet des questions ; refermée pour la suite de la page. */
  useEffect(() => {
    const fenetre = q(fen, "#lystes-bdf-fenetre");
    const ouverte = partie === "fenetre" || partie === "questions";
    if (ouverte && !fenetre) (q(fen, ".lystes-bdf-bouton") as HTMLElement | null)?.click();
    if (!ouverte && fenetre) (q(fen, "#lystes-bdf-fenetre .lystes-bdf-fermer") as HTMLElement | null)?.click();
    if (partie !== "questions") return;
    const id = window.requestAnimationFrame(() => {
      (q(fen, '#lystes-bdf-fenetre .lystes-bdf-onglets [role="tab"]:nth-child(2)') as HTMLElement | null)?.click();
    });
    return () => window.cancelAnimationFrame(id);
  }, [partie, fen]);

  /* Le défilement : la page descend jusqu'à la partie, puis le point et
     l'encart s'y posent. Pendant qu'elle défile, ils attendent. */
  useEffect(() => {
    const vue = fen.vue;
    const c = CIBLE_ML[partie];
    const viser = () => {
      vue.setAttribute("data-vo-cible", c.sel);
      vue.setAttribute("data-vo-visee", JSON.stringify(c.visee ?? VISEE_ML));
      if (c.large) vue.setAttribute("data-vo-large", c.large);
      else vue.removeAttribute("data-vo-large");
      vue.removeAttribute("data-vo-attente");
    };
    /* La fenêtre s'ouvre par-dessus la page, sans la faire défiler. */
    if (partie === "fenetre" || partie === "questions") {
      viser();
      return;
    }
    const haut = hautPartie(fen, partie);
    if (Math.abs(fen.scrollY - haut) < 2) {
      viser();
      return;
    }
    vue.setAttribute("data-vo-attente", "");
    /* Hors de l'étape (retour en haut), la page saute ; dans l'étape, elle défile. */
    fen.scrollTo({ top: haut, behavior: actif ? "smooth" : ("instant" as ScrollBehavior) });
    const debut = performance.now();
    let id = 0;
    const arrive = () => {
      if (Math.abs(fen.scrollY - haut) < 2 || performance.now() - debut > 1800) {
        viser();
        return;
      }
      id = window.requestAnimationFrame(arrive);
    };
    id = window.requestAnimationFrame(arrive);
    return () => window.cancelAnimationFrame(id);
  }, [partie, fen, actif]);

  return (
    <VueMultiLien
      data={MULTI_LIEN_DEMO}
      agentId={null}
      agentAvatars={null}
      agentDiagnostic={AGENT_DIAGNOSTIC_DEMO}
      surMobile={false}
      demo={{
        conseiller: { agent: CONSEILLER_DEMO.agent, messages, enAttente: !repondu, libelleAction: "Faire un diagnostic" },
        diag: { questions: QUESTIONS_DIAG_DEMO, lien: null, parcours: <ParcoursDemo />, conteneur: fen.vue, tel: true },
      }}
    />
  );
}

/* Le volet gauche de la fenêtre du diagnostic. Sur lystes.ai, il porte le
   parcours de l'agent de diagnostic (/agent/:id), une application à part
   qui lit son agent en base : la visite montre sa première question, sans
   la charger. */
function ParcoursDemo({ serre = false }: { serre?: boolean }) {
  const choix = ["Elle tiraille", "Elle brille", "Les deux, selon les zones", "Rien de particulier"];
  /* Serré : la fenêtre du lien influenceur au téléphone, plus basse que
     l'écran du diagnostic du multi-lien. */
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: serre ? "16px 18px" : "28px 36px", gap: serre ? 8 : 12, fontFamily: "inherit", color: "#111" }}>
      <p style={{ margin: 0, fontSize: serre ? 11 : 13, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "#6b6b6b" }}>
        Diagnostic de peau · 1 / 4
      </p>
      <h3 style={{ margin: 0, fontSize: serre ? 18 : 22, fontWeight: 500, lineHeight: 1.25, textWrap: "balance" } as CSSProperties}>
        Comment est votre peau en fin de journée ?
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: serre ? 6 : 8 }}>
        {choix.map((c, i) => (
          <span key={c} style={{ display: "block", padding: serre ? "7px 12px" : "9px 14px", borderRadius: 8, fontSize: serre ? 14 : 15,
            border: i === 0 ? "1.5px solid #111" : "1px solid #e4e4e7", background: i === 0 ? "#f6f6f6" : "#fff" }}>
            {c}
          </span>
        ))}
      </div>
      {!serre && (
        <p style={{ margin: 0, fontSize: 13, color: "#6b6b6b" }}>
          Quatre questions, puis la routine {deMarque(MARQUE)} faite pour vous.
        </p>
      )}
    </div>
  );
}

/* ---------- Les avis : VueAvisMarque, puis le résultat Google ---------- */

/* JP, 12/10/2026 : « on avait fait dans la page /solutions/avis une
   reproduction des recherches Google avec les notes ». La page d'avis
   d'abord, puis, par-dessus, la recherche Google de la marque : la page
   d'avis et chaque produit indexés, avec leurs étoiles. Le résultat est le
   composant de /solutions/avis, tel quel, nourri de la marque de démonstration. */
const BASCULE_GOOGLE = 4400;
const virgule = (n: number) => String(n).replace(".", ",");
const ETOILES_DEMO = (() => {
  const produit = FICHE_DEMO.products[0];
  const note = virgule(AVIS_DEMO.avgRating);
  return {
    recherche: `${MARQUE.toLowerCase()} avis`,
    marque: {
      fil: `lystes.ai › ${SLUG} › avis`,
      lien: `https://lystes.ai/${SLUG}/avis`,
      titre: `Avis ${MARQUE}\u00a0: note ${note}/5 sur ${AVIS_DEMO.totalCount} avis vérifiés`,
      note: `Note\u00a0: ${note}`,
      votes: `· ${AVIS_DEMO.totalCount} votes`,
      description: `Découvrez les avis vérifiés sur ${MARQUE}\u00a0: produits, textures, résultats et retours clients.`,
    },
    produit: {
      fil: `lystes.ai › ${SLUG} › ${produit.slug}`,
      lien: `https://lystes.ai/${SLUG}/${produit.slug}`,
      titre: `${produit.name}\u00a0: avis ${virgule(produit.rating)}/5 | ${MARQUE}`,
      note: `Note\u00a0: ${virgule(produit.rating)}`,
      votes: `· ${produit.reviewsCount} votes`,
    },
  };
})();

function AvisDemo({ fen, actif, cle, ordi }: Rendu) {
  const [google, setGoogle] = useState(false);
  useEffect(() => {
    setGoogle(false);
    if (!actif) return;
    const id = window.setTimeout(() => setGoogle(true), BASCULE_GOOGLE);
    return () => window.clearTimeout(id);
  }, [actif, cle]);
  return (
    <>
      <VueAvisMarque data={FICHE_DEMO} avis={AVIS_DEMO} demo />
      {google && createPortal(
        <div data-vo-google="" className="bg-neutral-50" style={{ position: "absolute", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", padding: ordi ? "16px 24px" : 8, overflow: "hidden", animation: "vo-google-entree .45s ease both" }}>
          <style>{"@keyframes vo-google-entree{from{opacity:0}to{opacity:1}}"}</style>
          {/* Sur ordinateur, le résultat à gauche et l'encart à sa droite,
              sans le couvrir ; au téléphone, sans la description de la
              marque et un peu réduit, pour tenir dans l'écran jusqu'aux
              étoiles du produit. */}
          <div style={ordi ? { width: "52%" } : ({ width: "100%", zoom: 0.78 } as CSSProperties)}>
            <ResultatGoogleAvis
              {...ETOILES_DEMO}
              marque={ordi ? ETOILES_DEMO.marque : { ...ETOILES_DEMO.marque, description: undefined }}
            />
          </div>
        </div>,
        fen.vue,
      )}
    </>
  );
}

/* ---------- Le paiement : VuePaiement, le montant tapé sous les yeux ---------- */

function PaiementDemo({ actif, cle }: Rendu) {
  const ms = useChrono(actif, cle, 1700);
  /* 45 €, le prix de l'huile sur le multi-lien ; rien n'est envoyé. */
  const montant = ms < 1300 ? "" : ms < 1550 ? "4" : "45";
  return (
    <VuePaiement
      marque={MARQUE}
      slug={SLUG}
      appearance={{ brand_name: MARQUE, logo_url: LOGO_DEMO, avatar_url: null, background_color: "#ececec", is_verified: true }}
      verification={false}
      confirme={null}
      annule={false}
      montant={montant}
      onMontant={() => undefined}
      envoi={false}
      erreur={null}
      payer={() => undefined}
    />
  );
}

/* ---------- Le magazine : VueMagazineMarque, avec les articles de démonstration ---------- */

/* L'étape montre l'article à la une, puis (au téléphone) descend sur les suivants. */
const BASCULE_MAG = 2800;
const UNE = "main > section:first-child h1";
const BOUTON_UNE = "main > section:first-child h1 ~ a";
const GRILLE = "main > section:nth-child(2) a:last-child h3";

function MagazineDemo({ fen, actif, cle, ordi }: Rendu) {
  const [grille, setGrille] = useState(false);

  useEffect(() => {
    setGrille(false);
    /* Sur ordinateur, la une tient avec sa photo, son titre et son chapeau. */
    if (!actif || ordi) return;
    const id = window.setTimeout(() => setGrille(true), BASCULE_MAG);
    return () => window.clearTimeout(id);
  }, [actif, cle, ordi]);

  /* Où pulse le point, et la hauteur de la page : la une entière, puis la
     grille. Pendant que la page défile, le point et l'encart attendent. */
  useEffect(() => {
    const vue = fen.vue;
    const visee: Visee = ordi ? { prise: "gauche", cote: "gauche", decalage: 10 } : { prise: "droite", cote: "droite", decalage: 6 };
    const selecteur = grille ? GRILLE : UNE;
    const viser = () => {
      vue.setAttribute("data-vo-cible", selecteur);
      vue.setAttribute("data-vo-visee", JSON.stringify(visee));
      vue.removeAttribute("data-vo-attente");
    };
    const ecran = fen.innerHeight;
    const max = Math.max(0, fen.scrollHeight - ecran);
    const titre = fen.racine.querySelector(selecteur);
    const fin = grille ? titre?.nextElementSibling : fen.racine.querySelector(BOUTON_UNE);
    let haut = 0;
    if (titre && fin) {
      const t = fen.rect(titre).top + fen.scrollY;
      const b = fen.rect(fin).bottom + fen.scrollY;
      haut = Math.min(t - 40, b + 24 - ecran);
      /* Sur ordinateur, la une entière, de « À la une » à « Lire l'article ». */
      const etiquette = ordi && !grille ? titre.previousElementSibling : null;
      if (etiquette) {
        const bas = b + 12 - ecran;
        const hautMax = fen.rect(etiquette).top + fen.scrollY - 8;
        haut = bas <= hautMax ? (bas + hautMax) / 2 : bas;
      }
      const section = titre.closest("section");
      if (ordi && haut > 0 && section) {
        const st = fen.rect(section).top + fen.scrollY;
        if (b + 24 - ecran <= st) haut = st;
      }
    }
    haut = Math.min(max, Math.max(0, haut));
    if (Math.abs(fen.scrollY - haut) < 2) {
      viser();
      return;
    }
    vue.setAttribute("data-vo-attente", "");
    /* Au premier affichage, la page saute à sa place ; ensuite, elle défile. */
    fen.scrollTo({ top: haut, behavior: grille ? "smooth" : ("instant" as ScrollBehavior) });
    const debut = performance.now();
    let id = 0;
    const arrive = () => {
      if (Math.abs(fen.scrollY - haut) < 2 || performance.now() - debut > 1600) {
        viser();
        return;
      }
      id = window.requestAnimationFrame(arrive);
    };
    id = window.requestAnimationFrame(arrive);
    return () => window.cancelAnimationFrame(id);
  }, [grille, fen, ordi]);

  return <VueMagazineMarque marque={MARQUE} brandSlug={SLUG} articles={ARTICLES_DEMO} />;
}

/* ---------- Le contact : VueContact, le formulaire qui se remplit, puis la conversation ---------- */

/* Les temps de la scène, en millisecondes depuis le début de l'étape. */
const T = { nom: 600, email: 1500, message: 2700, envoi: 4700, conversation: 5300, enregistre: 6100, reponse: 7600 };
const VITESSE = { nom: 85, email: 45, message: 28 };

function ContactDemo({ fen, actif, cle }: Rendu) {
  const ms = useChrono(actif, cle, T.reponse + 100);
  const tape = (texte: string, debut: number, vitesse: number) =>
    ms < debut ? "" : texte.slice(0, Math.min(texte.length, Math.floor((ms - debut) / vitesse) + 1));
  const form = {
    ...FORMULAIRE_VIDE,
    nom: tape(CONTACT_DEMO.nom, T.nom, VITESSE.nom),
    email: tape(CONTACT_DEMO.email, T.email, VITESSE.email),
    message: tape(CONTACT_DEMO.message, T.message, VITESSE.message),
  };
  const conversation = ms >= T.conversation;
  const enregistre = ms >= T.enregistre;
  const repondu = ms >= T.reponse;
  const moment = ms < T.email ? "nom" : ms < T.message ? "email" : ms < T.envoi ? "message" : ms < T.conversation ? "envoyer" : "chat";

  /* Où pulse le point, et ce que la page doit montrer : le champ en cours,
     puis le formulaire entier, puis la conversation. */
  useEffect(() => {
    const cible = {
      nom: "#vo-contact-nom",
      email: "#vo-contact-email",
      message: "#vo-contact-message",
      envoyer: 'form button[type="submit"]',
      chat: ".lmk-messages > .lmk-message:last-child",
    }[moment];
    fen.vue.setAttribute("data-vo-cible", cible);
    const ecran = fen.innerHeight;
    const bas = moment === "chat"
      ? fen.racine.querySelector("[data-vo-conversation]")?.parentElement
      : fen.racine.querySelector(moment === "nom" || moment === "email" ? cible : "main form");
    if (!bas) {
      fen.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const voulu = Math.max(0, fen.rect(bas).bottom + fen.scrollY - (ecran - (moment === "chat" ? 24 : 16)));
    if (Math.abs(voulu - fen.scrollY) > 4) fen.scrollTo({ top: voulu, behavior: "smooth" });
  }, [moment, repondu, fen]);

  const rien = () => undefined;
  return (
    <VueContact
      cadre={{ nom: MARQUE, logoUrl: LOGO_DEMO, verifie: true, retour: { chemin: `/${SLUG}`, multiLien: true } }}
      integre={false}
      nom={MARQUE}
      phase={conversation ? "conversation" : "formulaire"}
      form={form}
      onForm={rien}
      erreurs={[]}
      onErreurs={rien}
      piege=""
      onPiege={rien}
      erreurEnvoi={null}
      onEnvoyer={(e) => e.preventDefault()}
      hote={{ police: null, encre: null }}
      statut={repondu ? { statut: "repondu", manque: [] } : null}
      enregistre={enregistre}
      prefixe="vo-contact"
      conseiller={
        <div data-vo-conversation="">
          <BrandAdvisorChatCard
            accountId="demo-lystes-partners"
            brandName={MARQUE}
            logoUrl={LOGO_DEMO}
            premierMessage={CONTACT_DEMO.message}
            contact={null}
            contactEnAttente
            demo={{
              agent: CONSEILLER_DEMO.agent,
              messages: [
                { role: "user", content: CONTACT_DEMO.message },
                ...(repondu ? [{ role: "assistant" as const, content: CONTACT_DEMO.reponse }] : []),
              ],
              enAttente: !repondu,
            }}
          />
        </div>
      }
    />
  );
}

/* ---------- Le lien influenceur : VueLienInfluenceur, puis le diagnostic ---------- */

/* JP, 12/10/2026 : « une influenceuse cosmétique laisse sa communauté faire
   des diagnostics pour voir quels produits lui conviennent le mieux ». La
   page publique du lien (/i/<pseudo>), nourrie d'une influenceuse de
   démonstration : la créatrice, sa routine, son code promo, puis le bouton
   du diagnostic et la fenêtre qu'il ouvre. */
const PARTIES_IL = ["haut", "produits", "promo", "bouton", "fenetre"] as const;
type PartieIL = (typeof PARTIES_IL)[number];
const T_IL = [2600, 5200, 7800, 10200];
/* Le point au bord de la carte, à hauteur de la partie ; dans la fenêtre,
   au bord de la fenêtre, à hauteur de la question. */
const CIBLE_IL: Record<PartieIL, { sel: string; large: string }> = {
  haut: { sel: ".ilp-nom", large: ".ilp-contenu" },
  produits: { sel: ".ilp-produits", large: ".ilp-contenu" },
  promo: { sel: ".ilp-promo", large: ".ilp-contenu" },
  bouton: { sel: ".ilp-cta", large: ".ilp-contenu" },
  fenetre: { sel: ".ilp-fenetre h3", large: ".ilp-fenetre" },
};

function InfluenceurDemo({ fen, actif, cle, ordi }: Rendu) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    if (!actif) return;
    const ids = T_IL.map((t, i) => window.setTimeout(() => setN(i + 1), t));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [actif, cle]);
  const reduit = useMemo(mouvementReduit, []);
  const partie: PartieIL = reduit ? "haut" : PARTIES_IL[n];

  useEffect(() => {
    const vue = fen.vue;
    const c = CIBLE_IL[partie];
    const viser = () => {
      vue.setAttribute("data-vo-cible", c.sel);
      vue.setAttribute("data-vo-visee", JSON.stringify(VISEE_ML));
      vue.setAttribute("data-vo-large", c.large);
      vue.removeAttribute("data-vo-attente");
    };
    /* La fenêtre s'ouvre par-dessus la page, sans la faire défiler. */
    if (partie === "fenetre") {
      const id = window.requestAnimationFrame(viser);
      return () => window.cancelAnimationFrame(id);
    }
    /* La partie aux deux cinquièmes de l'écran, sans dépasser le bas. */
    const H = fen.innerHeight;
    const max = Math.max(0, fen.scrollHeight - H);
    const el = q(fen, c.sel);
    const haut = partie === "haut" || !el
      ? 0
      : Math.min(max, Math.max(0, Math.round(fen.rect(el).top + fen.scrollY - H * 0.4)));
    if (Math.abs(fen.scrollY - haut) < 2) {
      viser();
      return;
    }
    vue.setAttribute("data-vo-attente", "");
    fen.scrollTo({ top: haut, behavior: actif ? "smooth" : ("instant" as ScrollBehavior) });
    const debut = performance.now();
    let id = 0;
    const arrive = () => {
      if (Math.abs(fen.scrollY - haut) < 2 || performance.now() - debut > 1800) {
        viser();
        return;
      }
      id = window.requestAnimationFrame(arrive);
    };
    id = window.requestAnimationFrame(arrive);
    return () => window.cancelAnimationFrame(id);
  }, [partie, fen, actif]);

  const rien = () => undefined;
  return (
    <VueLienInfluenceur
      data={INFLUENCEUSE_DEMO}
      agentAvatars={null}
      essayage={false}
      actions={{ produit: rien, essayer: rien, agent: rien, lien: rien, promo: rien }}
      fenetreAgent={partie === "fenetre" ? <ParcoursDemo serre={!ordi} /> : null}
      fermerAgent={rien}
      /* La fenêtre à la hauteur de l'écran de la visite, pas de la fenêtre du navigateur. */
      hauteurFenetre="85cqh"
      /* Centrée sur la carte, la fenêtre de 440 px sortait de l'écran par la gauche. */
      largeurFenetre={300}
    />
  );
}

/* ---------- Booking IA : VueRdv, un institut puis une entreprise ---------- */

/* JP, 12/10/2026 : la prise de rendez-vous sert aux instituts et aux
   professionnels. La vraie page de réservation (/rdv/<slug>), nourrie de
   deux jeux de prestations : d'abord l'institut (soin visage), puis
   l'entreprise (démonstration). Chaque fois : la prestation, le créneau,
   les coordonnées, la confirmation. Rien n'est envoyé. */
const T_RDV = { prestation: 1200, creneau: 3000, coordonnees: 5000, confirme: 7600, pro: 10000, creneauPro: 12200, coordonneesPro: 14000, confirmePro: 16600 };

function RdvDemo({ fen, actif, cle, serrer }: Rendu) {
  const ms = useChrono(actif, cle, T_RDV.confirmePro + 100);
  const reduit = useMemo(mouvementReduit, []);
  const t = reduit ? 0 : ms;
  const pro = t >= T_RDV.pro;
  const page = pro ? RDV_PRO_DEMO : RDV_INSTITUT_DEMO;
  const d = pro ? T_RDV.pro : 0;
  const local = t - d;
  const client = pro ? RDV_CLIENTES_DEMO.pro : RDV_CLIENTES_DEMO.institut;
  const jours = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    return Array.from({ length: 14 }, (_, i) => new Date(base.getFullYear(), base.getMonth(), base.getDate() + i));
  }, []);
  const jour = jours[local >= T_RDV.creneau - 600 || pro ? 1 : 0];
  const creneaux = useMemo(() => {
    const a = (h: number, m: number) => new Date(jour.getFullYear(), jour.getMonth(), jour.getDate(), h, m).toISOString();
    return [a(9, 30), a(10, 30), a(11, 30), a(14, 0), a(15, 30), a(17, 0)];
  }, [jour]);
  const prestationId = pro ? page.prestations[0].id : local >= T_RDV.prestation ? page.prestations[1].id : page.prestations[0].id;
  const creneau = local >= (pro ? T_RDV.creneauPro - d : T_RDV.creneau) ? creneaux[pro ? 3 : 1] : null;
  const debutSaisie = pro ? T_RDV.coordonneesPro - d : T_RDV.coordonnees;
  const tape = (texte: string, debut: number) => (local < debut ? "" : texte.slice(0, Math.floor((local - debut) / 45) + 1));
  const confirme = local >= (pro ? T_RDV.confirmePro - d : T_RDV.confirme);
  const moment = confirme ? "confirme" : local >= debutSaisie ? "coordonnees" : creneau ? "creneau" : "prestation";

  /* La confirmation tient en quelques lignes : le cadre se resserre sur
     elle au lieu de laisser la moitié de l'écran en blanc. */
  useLayoutEffect(() => {
    const page = confirme ? (fen.racine.querySelector(".rdv-page") as HTMLElement | null) : null;
    serrer(page ? page.offsetHeight : null);
  }, [confirme, pro, fen, serrer]);

  /* Où pulse le point : la prestation choisie, le créneau, le bouton, puis
     le titre de la confirmation. La page descend jusqu'à lui. */
  useEffect(() => {
    const vue = fen.vue;
    const trouver = (): Element | null => {
      const boutons = [...fen.racine.querySelectorAll(".rdv-page button")];
      if (moment === "confirme") return fen.racine.querySelector(".rdv-page h1");
      if (moment === "coordonnees") return boutons.find((b) => /Confirmer/.test(b.textContent ?? "")) ?? null;
      if (moment === "creneau") return boutons.find((b) => b.classList.contains("bg-primary") && /\d\d:\d\d/.test(b.textContent ?? "")) ?? null;
      const nomP = page.prestations.find((p) => p.id === prestationId)?.nom ?? "";
      return boutons.find((b) => (b.textContent ?? "").includes(nomP)) ?? null;
    };
    const el = trouver();
    fen.racine.querySelectorAll("[data-vo-ici]").forEach((e) => e.removeAttribute("data-vo-ici"));
    if (!el) return;
    el.setAttribute("data-vo-ici", "");
    const viser = () => {
      vue.setAttribute("data-vo-cible", "[data-vo-ici]");
      vue.setAttribute("data-vo-visee", JSON.stringify(VISEE_ML));
      vue.setAttribute("data-vo-large", ".rdv-page");
      vue.removeAttribute("data-vo-attente");
    };
    const H = fen.innerHeight;
    const max = Math.max(0, fen.scrollHeight - H);
    const haut = moment === "prestation" || moment === "confirme"
      ? 0
      : Math.min(max, Math.max(0, Math.round(fen.rect(el).top + fen.scrollY - H * 0.45)));
    if (Math.abs(fen.scrollY - haut) < 2) {
      viser();
      return;
    }
    vue.setAttribute("data-vo-attente", "");
    fen.scrollTo({ top: haut, behavior: actif && moment !== "confirme" ? "smooth" : ("instant" as ScrollBehavior) });
    const debut = performance.now();
    let id = 0;
    const arrive = () => {
      if (Math.abs(fen.scrollY - haut) < 2 || performance.now() - debut > 1500) {
        viser();
        return;
      }
      id = window.requestAnimationFrame(arrive);
    };
    id = window.requestAnimationFrame(arrive);
    return () => window.cancelAnimationFrame(id);
  }, [moment, pro, prestationId, fen, actif, page]);

  const rien = () => undefined;
  return (
    <VueRdv
      page={page}
      encastre={false}
      prestationId={prestationId}
      onPrestation={rien}
      conseillerId={null}
      onConseiller={rien}
      jours={jours}
      jour={jour}
      onJour={rien}
      creneaux={creneaux}
      chargementCreneaux={false}
      creneau={creneau}
      onCreneau={rien}
      nom={tape(client.nom, debutSaisie)}
      onNom={rien}
      email={tape(client.email, debutSaisie + 700)}
      onEmail={rien}
      telephone=""
      onTelephone={rien}
      notes=""
      onNotes={rien}
      erreur={null}
      envoi={false}
      confirme={confirme}
      onReserver={rien}
    />
  );
}
