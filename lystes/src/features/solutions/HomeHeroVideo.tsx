import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";

import VideoAuto from "@lystes/components/VideoAuto";

const HeroTryModal = lazy(() => import("./HeroTryModal"));


/**
 * Hero vidéo de la home (`/`). Fond vidéo plein cadre, titre SF Pro avec
 * vignettes produit + avatar + machine à écrire, fil de conversation en verre
 * qui glisse et se dissout vers le haut, et deux boutons.
 *
 * Auto-contenu : tout le style est scopé sous `.lyh` pour ne pas fuir dans le
 * reste de la page. Les assets pointent vers les fichiers publics de lystes.ai.
 */

const A = {
  video: "https://lystes.ai/__l5e/assets-v1/48dd4735-eb4b-4d9e-afc3-542a3717c7c8/avis-prompt-video.mp4",
  avatar: "https://lystes.ai/__l5e/assets-v1/ed34ac03-fb58-44f8-9244-f54350fedeba/hero-avatar-2.mp4",
  /* Premieres images des deux videos, servies depuis public/. Les fichiers mp4
     pesent 7,4 et 7,5 Mo : sur mobile le premier ecran restait vide le temps du
     telechargement. Le poster s'affiche tout de suite, la video prend le relais. */
  videoPoster: "/hero-poster.webp",
  avatarPoster: "/hero-avatar-poster.webp",
  chip1: "https://lystes.ai/__l5e/assets-v1/56e14a37-7a06-4466-b98e-60c8015c4c3e/hero-product-kanivza.webp",
  chip2: "https://lystes.ai/__l5e/assets-v1/c0c02cc3-9e54-476d-96b5-5249c9d1768e/hero-slide-earrings.webp",
  chip3: "https://lystes.ai/__l5e/assets-v1/3400816a-af0f-49d1-a6ce-e8386f3687e7/hero-slide-jacket.png",
  ba1: "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/before-after/d7bb6871-6142-4c3b-8daf-b754fb38f4eb/1766996391238.png",
  ba2: "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/before-after/d7bb6871-6142-4c3b-8daf-b754fb38f4eb/1766996432144.png",
  prod1: "/images/clients/valthea-2.jpg",
  prod2: "/images/clients/valthea-3.jpg",
};

/* 29/09 : les cinq lieux d'installation du carrousel. Shopify et WooCommerce
   pointent vers leurs guides dédiés ; les trois autres parcours n'ont pas de
   guide : ils renvoient vers l'inscription classique. */
type LieuInstall = {
  key: string;
  defaut: string;
  href: string;
  logo: "shopify" | "woo" | { paths: string[]; circles?: [number, number, number][] };
  ordiSeulement?: boolean;
};

const LIEUX_INSTALL: LieuInstall[] = [
  { key: "heroHome.ctaShopify", defaut: "Installer sur Shopify", href: "/install/shopify", logo: "shopify" },
  { key: "heroHome.ctaWoo", defaut: "Installer sur WooCommerce", href: "/install/woocommerce", logo: "woo" },
  { key: "heroHome.ctaPos", defaut: "Installer en point de vente", href: "/auth", logo: { paths: ["M4 10h16l-1.5-5h-13L4 10Z", "M5 10v10h14V10", "M9 20v-5h6v5"] } },
  { key: "heroHome.ctaDomicile", defaut: "Installer au domicile des clients", href: "/auth", logo: { paths: ["m3 11 9-8 9 8", "M5 9.5V21h14V9.5"], circles: [[12, 14, 2.4]] } },
  { key: "heroHome.ctaEvent", defaut: "Installer lors de vos événements", href: "/auth", logo: { paths: ["M3.5 5h17v16h-17z", "M8 3v4M16 3v4M3.5 10h17"] } },
];

export const NB = " "; // espace fine insécable : jamais de « ? » orphelin
const AGENT_IC =
  '<span class="lyh-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="12" cy="12" r="9.2"/><path d="M12 7.4v9.2M7.4 12h9.2M8.75 8.75l6.5 6.5M15.25 8.75l-6.5 6.5"/></svg></span>';
const USER_IC =
  '<span class="lyh-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="12" cy="8.2" r="3.4"/><path d="M5.4 19.6c1.3-3.3 4-5 6.6-5s5.3 1.7 6.6 5"/></svg></span>';

/** Un produit d'une fiche de démonstration : photo, nom, et une ligne sous le
 *  nom (sur /bio, un ou deux actifs clés tels qu'écrits dans l'INCI). */
export type ProduitFil = { image: string; nom: string; ligne?: string };

/** Un message du fil. Les widgets « ba », « review » et « slots » sont ceux de
 *  l'accueil ; « prods » prend ses propres produits quand `produits` est
 *  fourni (13/10/2026, /bio), sinon il garde les trois fiches de l'accueil. */
export type MsgFil = {
  side?: "agent" | "user";
  name?: string;
  text?: string;
  widget?: "ba" | "review" | "prods" | "slots";
  intro?: string;
  note?: string;
  produits?: ProduitFil[];
};
type Msg = MsgFil;

/** Traducteur minimal injecte depuis le composant (react-i18next). */
type Tr = (k: string, o?: Record<string, unknown>) => string;

/* Le fil de conversation etait ecrit en dur en francais : sur /en ou /de la
   demonstration restait francaise. Il est desormais construit a partir des
   cles `heroHome.*`, avec le francais en repli. */
const buildThread = (t: Tr): Msg[] => {
  const agent = t("heroHome.agentName", { defaultValue: "Agent Lystes" });
  const user = t("heroHome.userName", { defaultValue: "A\u00efcha" });
  return [
    { side: "agent", name: agent, text: t("heroHome.greeting", { defaultValue: "Bonjour, comment puis-je vous aider" }) + NB + "?" },
    { side: "user", name: user, text: t("heroHome.q1", { defaultValue: "Votre cr\u00e8me convient aux peaux mixtes et m\u00e9tisses" }) + NB + "?" },
    { widget: "ba" },
    { side: "user", name: user, text: t("heroHome.q2", { defaultValue: "Impressionnant. Vous avez des avis de clientes" }) + NB + "?" },
    { widget: "review" },
    { side: "user", name: user, text: t("heroHome.q3", { defaultValue: "Top. Que me conseillez-vous pour ma routine" }) + NB + "?" },
    { widget: "prods" },
    { side: "user", name: user, text: t("heroHome.q4", { defaultValue: "Parfait. Je peux passer en institut demain matin" }) + NB + "?" },
    { side: "agent", name: agent, text: t("heroHome.slotsAnswer", { defaultValue: "Oui, il reste quelques cr\u00e9neaux demain matin." }) },
    { widget: "slots" },
  ];
};

/* Phrases tournantes du titre. Le francais reste en repli : si une langue
   n'a pas la cle, on affiche le francais plutot qu'une chaine vide. */
/* Le titre annonce un DÉPLOIEMENT, plus un recrutement : « capables de faire
   X » ne s'y raccroche plus. La charnière est devenue « pour », et ces phrases
   sont des résultats, plus des fonctions. Une gérante n'achète pas un agent qui
   sait faire un diagnostic, elle achète des ventes en plus.

   Elles sont rangées par force de conversion, l'argent d'abord : c'est la
   première qui s'affiche à l'ouverture de la page, et souvent la seule lue.

   La charnière vit dans `heroHome.capables`, ces phrases dans
   `heroHome.phrases`, pour les sept langues. En allemand et en néerlandais
   l'infinitif est encadré (« um … zu », « om … te ») : le second morceau est
   donc DANS la phrase, pas dans la charnière. */
const PHRASES_FR = [
  "augmenter vos ventes",
  "améliorer votre conversion",
  "réduire vos retours produits",
  "vendre à toute heure",
  "conseiller comme en boutique",
  "rendre l'essayage possible",
  "proposer la bonne routine",
  "rassurer avant l'achat",
  "comprendre vos points de friction",
  "conseiller de vive voix",
];

import { useTranslation } from "react-i18next";
import { BasculeCible } from "@lystes/components/landing/Header";
import { getJsxT } from "@lystes/i18n/jsx-locale";
import { CarrouselLieux } from "./CarrouselLieux";
import shopifyLogo from "@lystes/assets/shopify-icon.png";
import wooLogo from "@lystes/assets/woocommerce-icon.webp";
// 28/09 (JP) : le logo fourni par JP, bulle violette et lettres blanches, pour le
// lien d'installation. Le bandeau du haut garde la bulle blanche.
import wooLogoViolet from "@lystes/assets/woocommerce-bulle-violette.webp";

/* Modèles IA affichés sous le hero. Tracés repris des logos officiels,
   dessinés en currentColor pour rester lisibles sur la photo. */
const MODELES_IA: { nom: string; viewBox: string; d: string; evenodd?: boolean }[] = [
  {
    nom: "ChatGPT",
    viewBox: "2 2 20 21",
    d: "M20.557 10.634a5.07 5.07 0 00-.42-4.099c-1.087-1.901-3.284-2.864-5.432-2.42-.939-1.061-2.321-1.654-3.754-1.654a5.07 5.07 0 00-4.814 3.481 5 5 0 00-3.334 2.42 5.07 5.07 0 00.618 5.901 5.06 5.06 0 00.444 4.1 5.025 5.025 0 005.432 2.419 5.07 5.07 0 003.753 1.679 5.07 5.07 0 004.815-3.481 5 5 0 003.333-2.42 5.07 5.07 0 00-.642-5.926M13.05 21.152a3.66 3.66 0 01-2.395-.864c.025-.025.099-.05.124-.074l3.975-2.296a.65.65 0 00.321-.568v-5.605l1.679.963c.025 0 .025.024.025.05v4.641a3.716 3.716 0 01-3.729 3.753M5 17.72c-.444-.765-.592-1.654-.444-2.518.025.024.075.05.124.074l3.975 2.296a.6.6 0 00.642 0l4.864-2.815v1.95c0 .026 0 .05-.024.05l-4.025 2.321c-1.778 1.037-4.074.42-5.111-1.358M3.965 9.03a3.88 3.88 0 011.95-1.654v4.74c0 .223.124.445.321.568l4.865 2.815-1.68.963c-.024 0-.049.025-.049 0L5.347 14.14a3.714 3.714 0 01-1.383-5.111m13.827 3.21-4.864-2.815 1.679-.963c.024 0 .05-.025.05 0l4.024 2.32a3.727 3.727 0 011.358 5.112 3.72 3.72 0 01-1.95 1.63v-4.716a.61.61 0 00-.297-.568m1.654-2.519a.5.5 0 00-.123-.074L15.347 7.35a.6.6 0 00-.642 0L9.84 10.165V8.214c0-.025 0-.05.025-.05l4.025-2.32A3.73 3.73 0 0119 7.226c.445.741.593 1.63.445 2.494M8.927 13.177l-1.68-.963c-.024 0-.024-.025-.024-.05v-4.64a3.75 3.75 0 013.753-3.753 3.66 3.66 0 012.395.864.5.5 0 01-.123.074L9.273 7.004a.65.65 0 00-.321.568v5.605zm.913-1.975 2.173-1.26 2.173 1.26v2.493l-2.173 1.26-2.173-1.26z",
  },
  {
    nom: "Claude",
    viewBox: "0 0 24 24",
    evenodd: true,
    d: "m4.709 15.955 4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a3 3 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312z",
  },
  {
    nom: "Nano Banana",
    viewBox: "0 0 24 24",
    evenodd: true,
    d: "M8.342 13.16H3.455c-.513 0-.772-.639-.408-1.012l1.608-1.653a3.166 3.166 0 014.565 0l.513.527.006-.015.038.017c.735-1.93.786-2.809.783-5.007v-.275c-.01-1.782-.02-3.935 1.965-4.22 2.603-.375 4.504 4.219 4.815 8.299a3.17 3.17 0 013.38.774l1.609 1.653c.365.375.106 1.012-.407 1.012H19.27q.109.397.11.828v5.664c0 .914-.994 1.292-1.602.576-.229-.27-1.067-1.25-2.155-2.52-2.92 4.183-10.266 6.462-12.34 3.006H2.49a.991.991 0 110-1.982h.246c.014-1.687 1.23-3.148 2.846-3.783a7.45 7.45 0 002.76-1.889m7.543-2.145q0-.19-.005-.388a15.7 15.7 0 00-.632-3.939c-.38-1.282-.887-2.33-1.425-2.992-.545-.671-.906-.715-1.085-.69-.223.032-.292.098-.322.129-.05.052-.135.176-.209.45-.152.567-.15 1.286-.147 2.186v.244c.002 1.134-.009 2.028-.145 2.92a11.3 11.3 0 01-.537 2.08zm-3.468 3.056c-1.636 3.166-4.981 4.71-8.118 4.87a.562.562 0 00.057 1.124c3.294-.169 6.921-1.749 8.845-5.081z",
  },
  {
    nom: "Google Veo",
    viewBox: "0 0 150 150",
    d: "M94.1 54.61c-12.42-5.94-28.01-6.45-37.24 4.77-7.32 8.9-7.83 21.46-.75 30.86.39.51.3.61-.25.29C10.76 64.41 34.37-.54 85.97 8.74c61.77 10.03 77.69 91.97 24.12 124.39C132.66 108.4 126.2 70.5 94.1 54.61M40.59 17.94C15.07 43.86 28.1 86.76 61.45 98.17c16 5.76 34-.02 37.62-18.24 1.39-7.03-.18-13.57-4.7-19.59-.24-.32-.18-.39.17-.19 16.11 8.93 26.2 26.17 23.84 44.69-8.97 54.35-79.68 44.89-101.47 4.34-19.12-31.63-6.24-75.35 23.68-91.24",
  },
  {
    nom: "Kling",
    viewBox: "0 0 31 32",
    evenodd: true,
    d: "m26.166 4.454.106.105.003-.003c2.04 2.048 1.455 6.163-1.503 10.828l5.818 5.82-.25.487a17.3 17.3 0 01-3.905 5.04 17 17 0 01-7.414 3.864l-.1.024-.143.034-.103.023-.227.05-.188.037-.141.027c-.15.03-.307.058-.46.084l-.128.019-.097.012q-.207.028-.412.052a15.49 15.49 0 01-12.605-4.361l-.096-.093c-2.044-2.048-1.465-6.166 1.497-10.834L0 9.849l.25-.487a17.1 17.1 0 013.908-5.036A17.2 17.2 0 019.774.992c.48-.173.982-.324 1.475-.452q.61-.163 1.231-.275c.14-.028.298-.057.451-.083a15.45 15.45 0 0113.235 4.272m-1.967.25h-.006l.006.003c-1.977-.612-5.114.377-8.43 2.562 2.523-.703 4.963-.339 6.54 1.239 1.494 1.497 1.903 3.769 1.337 6.156a4 4 0 01-.1.387c2.707-4.095 3.573-7.926 1.859-9.637a1 1 0 00-.09-.087l-.013-.012-.019-.017-.057-.044q-.037-.03-.077-.058l-.042-.03a3 3 0 00-.908-.462m-1.357 9.205c-.349 2.082-1.5 4.186-3.245 5.929-1.74 1.744-3.848 2.896-5.933 3.248-1.951.33-3.634-.1-4.737-1.2-1.1-1.101-1.53-2.778-1.2-4.739.349-2.08 1.497-4.185 3.234-5.926 0 0 .003 0 .01-.01l.006-.01C12.72 9.469 14.82 8.32 16.9 7.972c1.951-.33 3.63.098 4.737 1.2 1.1 1.1 1.53 2.78 1.2 4.738zm-17.68-8.46a15.6 15.6 0 00-3.307 4.118l-.01.003 5.048 5.036q.616-.87 1.32-1.718.246-.294.506-.598l.066-.075.24-.268c.007-.006.014-.019.014-.019l.044-.05.023-.027.035-.038.09-.1q.095-.108.195-.213c0-.007.01-.017.01-.017l.108-.118.077-.08q.005-.007.006-.006.008-.009.007-.01l.014-.018.014-.017a.2.2 0 00.033-.032l.019-.02c.041-.041.09-.089.134-.137a1 1 0 01.08-.086l.041-.042.026-.029.227-.224.05-.053.056-.059a33 33 0 013.457-3.017l.16-.117h.001v-.001l.002-.001.16-.118q.269-.201.54-.393.29-.198.58-.39c2.622-1.748 5.19-2.797 7.286-3.005a13.95 13.95 0 00-9.768-1.766c-.091.016-.17.032-.25.048l-.048.01q-1.104.227-2.165.607a15.6 15.6 0 00-5.121 3.04m.279 20.408q.42.32.957.486H6.39c1.99.608 5.115-.384 8.419-2.563-2.52.7-4.955.336-6.532-1.242-1.487-1.49-1.896-3.769-1.333-6.156q.042-.19.099-.387c-2.706 4.096-3.57 7.926-1.858 9.638a3 3 0 00.256.224m23.291-4.37v.002a15.7 15.7 0 01-3.305 4.115 15.7 15.7 0 01-6.972 3.576l-.032.008-.086.02a3 3 0 01-.295.064q-.097.02-.198.037-.21.04-.42.07l-.117.02-.133.017q-.16.022-.328.04a13.97 13.97 0 01-8.767-1.913c2.018-.199 4.475-1.184 6.995-2.813l.144-.094.144-.095.196-.132h.001l.379-.258q.275-.192.54-.393l.326-.237a34 34 0 003.458-3.018l.073-.078.03-.034q.08-.075.15-.147l.076-.076s.02-.02.023-.03l.029-.028.012-.013.087-.086.067-.07.067-.068.018-.02a.2.2 0 01.033-.031l.015-.018.014-.017s.01-.01.016-.013l.054-.058.026-.025q-.042.044-.08.092l.062-.065.001-.002q.064-.07.129-.134s0-.01.01-.01q.088-.094.171-.19l.113-.126a.1.1 0 00.035-.039l.064-.077.016-.019q.117-.125.229-.253l.078-.09q.188-.219.374-.441l.15-.179.047-.058.178-.22q.075-.09.147-.184.045-.06.093-.117c.29-.374.569-.742.838-1.12z",
  },
  {
    nom: "Suno",
    viewBox: "0 0 24 24",
    evenodd: true,
    d: "M16.5 0C20.642 0 24 5.373 24 12h-9c0 6.627-3.358 12-7.5 12S0 18.627 0 12h9c0-6.627 3.358-12 7.5-12",
  },
  {
    nom: "Topaz AI",
    viewBox: "-2.049 -2.048 25.08 25.058",
    d: "M6.949 20.962H0v-6.949h6.949zm6.969-6.949h-6.95V7.065h6.95zm7.064-7.064h-6.949V0h6.949z",
  },
];


/**
 * Variante du hero pour une autre page (12/10/2026, /bio) : même mise en
 * page, même machine à écrire, mêmes boutons, mais textes, photo de fond,
 * champ et liens fournis par la page. Sans variante, rien ne change pour
 * l'accueil. Une variante n'a ni bascule, ni carrousel des modèles IA ; elle
 * peut avoir son fil de conversation (`fil`, /bio depuis le 13/10/2026),
 * posé comme celui de l'accueil.
 */
export type HeroVariante = {
  /** Le fil de conversation sur la vidéo, comme sur l'accueil (JP, 13/10/2026 :
   *  « les deux bannières uniformes »). */
  fil?: { messages: MsgFil[]; agent?: string };
  /** Libellé accessible de la section. */
  aria: string;
  /** Classe propre à la page (« lyh--bio »), pour régler une page sans
   *  toucher les autres variantes. */
  classe?: string;
  /** Sur-titre, en petites capitales. */
  eyebrow: string;
  /** Début du titre, avant la fin qui s'écrit. Un « \n » force un retour. */
  titre: string;
  /** Fins du titre, qui s'écrivent puis s'effacent en boucle. */
  phrases: string[];
  /** Vidéo plein cadre : une pour l'ordinateur, une pour le téléphone (une
   *  seule est chargée), chacune avec son image d'affiche. Sans vidéo
   *  (/crea, 12/10/2026 : aucune vidéo mode dans le dépôt), l'affiche seule
   *  sert de fond fixe. */
  fond: {
    ordi: { video?: string; affiche: string; position?: string };
    mobile: { video?: string; affiche: string; position?: string };
  };
  /** Voile plus soutenu, pour un fond clair sous un titre blanc. */
  voile?: string;
  voileMobile?: string;
  /** Bouton blanc au lieu du noir, sur une vidéo sombre (/crea). */
  ctaClair?: boolean;
  /** Bouton noir. */
  cta: { label: string; labelCourt?: string; href: string; externe?: boolean };
  /** Champ de saisie à droite du bouton. Facultatif : /crea n'en a pas. */
  champ?: {
    placeholder: string;
    /** Texte d'aide sur téléphone (720 px et moins), quand le long ne tient pas. */
    placeholderCourt?: string;
    bouton: string;
    boutonCourt?: string;
    /** Appelé avec le texte saisi, jamais vide : un champ vide prend seulement le focus. */
    onSubmit: (valeur: string) => void;
  };
  /** Petite ligne de liens sous les boutons. */
  liens?: { label: string; href: string; icone: { paths: string[]; circles?: [number, number, number][] }; ordiSeulement?: boolean }[];
  /** Phrase sous les boutons. */
  texte?: string;
};

/** Choix du fond de la variante : ordinateur ou téléphone, et animations
 *  coupées. Lu au montage, pour ne charger qu'une seule vidéo. */
function useFondVariante(actif: boolean) {
  const [etat, setEtat] = useState<{ mobile: boolean; fixe: boolean } | null>(null);
  useEffect(() => {
    if (!actif) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const maj = () => setEtat({ mobile: mq.matches, fixe: rm.matches });
    maj();
    mq.addEventListener("change", maj);
    rm.addEventListener("change", maj);
    return () => {
      mq.removeEventListener("change", maj);
      rm.removeEventListener("change", maj);
    };
  }, [actif]);
  return etat;
}

/** Vidéo de fond d'une variante (/bio, /crea, biolystes.com). 13/10/2026
 *  (JP, iPhone) : lue depuis une adresse blob:, attribut `muted` posé et
 *  lecture relancée, voir lib/videoSansRange. L'affiche reste visible
 *  pendant le téléchargement. */
function VideoFond({ src, affiche }: { src: string; affiche: string }) {
  return <VideoAuto className="lyh-bgvid" src={src} poster={affiche} preload="auto" />;
}

/** Téléphone au sens de la mise en page du hero (720 px et moins). */
function useEtroit(actif: boolean) {
  const [etroit, setEtroit] = useState(false);
  useEffect(() => {
    if (!actif) return;
    const mq = window.matchMedia("(max-width: 720px)");
    const maj = () => setEtroit(mq.matches);
    maj();
    mq.addEventListener("change", maj);
    return () => mq.removeEventListener("change", maj);
  }, [actif]);
  return etroit;
}

/**
 * Le fil de conversation animé de l'accueil : bulles en verre qui glissent,
 * se dissolvent vers le haut et rejouent en boucle. Sorti du hero le
 * 13/10/2026 pour servir aussi à /bio (recherche de produits selon le concept
 * d'une marque) : même moteur, même cadence, mêmes cartes, seuls les messages
 * changent. Placé en absolu en bas à droite de son parent, comme dans le hero.
 */
export function FilConversation({ messages, agent, className }: { messages: MsgFil[]; agent?: string; className?: string }) {
  const { t } = useTranslation();
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;
    const timers: number[] = [];
    let step = 0;
    let stopped = false;
    /** Raccourci de traduction pour les widgets rendus en HTML brut. */
    const tx = (key: string, fr: string) => t("heroHome." + key, { defaultValue: fr });
    const nomAgent = agent ?? tx("agentName", "Agent Lystes");
    const THREAD = messages;

    const rowEl = (msg: Msg) => {
      const row = document.createElement("div");
      row.className = "lyh-row " + (msg.widget ? "agent" : msg.side);
      const cell = document.createElement("div");
      cell.className = "lyh-cell";
      const b = document.createElement("div");
      b.className = "lyh-bubble";
      if (msg.widget === "ba") {
        b.innerHTML =
          '<div class="lyh-who">' + AGENT_IC + "<span>" + nomAgent + "</span></div>" +
          '<div class="lyh-wt">' + tx("baIntro", "Oui, voici deux résultats sur peaux mixtes") + "</div>" +
          '<div class="lyh-balist">' +
          '<div class="lyh-barow"><img src="' + A.ba1 + '" alt=""><div class="lyh-batx"><b>' + tx("baItem1", "Anti-vieillissement") + "</b><span>" + tx("baWeeks5", "5 semaines") + "</span></div></div>" +
          '<div class="lyh-barow"><img src="' + A.ba2 + '" alt=""><div class="lyh-batx"><b>' + tx("baItem2", "Anti-âge front") + "</b><span>" + tx("baWeeks3", "3 semaines") + "</span></div></div>" +
          "</div>" +
          '<div class="lyh-wn">' + tx("baAsk", "Ces résultats vous parlent") + NB + "?</div>";
      } else if (msg.widget === "review") {
        const star = '<i><svg viewBox="0 0 24 24"><path d="M12 2.3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4-5.8-3-5.8 3 1.1-6.4L2.6 9.1l6.5-.9z"/></svg></i>';
        b.innerHTML =
          '<div class="lyh-who">' + AGENT_IC + "<span>" + nomAgent + "</span></div>" +
          '<div class="lyh-wt">' + tx("reviewIntro", "Bien sûr, voici un retour vérifié") + "</div>" +
          '<div class="lyh-stars">' + star.repeat(5) + "</div>" +
          '<div class="lyh-quote">' + tx("reviewQuote", "« Ma peau paraît nettement plus jeune et lumineuse. Confort, éclat et peau revitalisée. »") + "</div>" +
          '<div class="lyh-rfoot"><span class="lyh-rauth">' + tx("reviewAuthor", "Alice, via Trustpilot") + "</span>" +
          '<span class="lyh-rnav"><span class="lyh-rdot off"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg></span>' +
          '<span class="lyh-rcount">1 / 2</span>' +
          '<span class="lyh-rdot"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></span></span></div>';
      } else if (msg.widget === "prods" && msg.produits) {
        /* Fiches fournies par la page (/bio) : pas de prix, une ligne
           d'actifs sous le nom. */
        b.innerHTML =
          '<div class="lyh-who">' + AGENT_IC + "<span>" + nomAgent + "</span></div>" +
          (msg.intro ? '<div class="lyh-wt">' + msg.intro + "</div>" : "") +
          '<div class="lyh-prods">' +
          msg.produits
            .map((p) => '<div class="lyh-prod"><img src="' + p.image + '" alt=""><b>' + p.nom + "</b>" + (p.ligne ? "<span>" + p.ligne + "</span>" : "") + '<span class="lyh-add">+</span></div>')
            .join("") +
          "</div>" +
          (msg.note ? '<div class="lyh-wn">' + msg.note + "</div>" : "");
      } else if (msg.widget === "prods") {
        b.innerHTML =
          '<div class="lyh-who">' + AGENT_IC + "<span>" + nomAgent + "</span></div>" +
          '<div class="lyh-wt">' + tx("prodsIntro", "Voici la routine que je vous conseille") + "</div>" +
          '<div class="lyh-prods">' +
          '<div class="lyh-prod"><img src="' + A.prod1 + '" alt=""><b>' + tx("prod1", "Sérum vitamine C") + '</b><span class="lyh-add">+</span></div>' +
          '<div class="lyh-prod"><img src="' + A.prod2 + '" alt=""><b>' + tx("prod2", "Sérum anti-âge") + '</b><span class="lyh-add">+</span></div>' +
          '<div class="lyh-prod"><img src="' + A.prod1 + '" alt=""><b>' + tx("prod3", "Gel hydratation") + '</b><span class="lyh-add">+</span></div>' +
          "</div>";
      } else if (msg.widget === "slots") {
        b.innerHTML =
          '<div class="lyh-slots">' +
          '<div class="lyh-shead"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(90deg)"><path d="M8 10l4 4 4-4"/></svg>' + "<p>" + tx("tomorrow", "Demain") + "</p>" + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(-90deg)"><path d="M8 10l4 4 4-4"/></svg></div>' +
          '<div class="lyh-sgrid"><p class="sel">09:00</p><p>09:30</p><p>10:00</p><p>10:30</p><p>11:00</p></div>' +
          '<button type="button">' + tx("confirming", "Confirmation…") + "</button>" +
          "</div>";
      } else {
        b.innerHTML =
          '<div class="lyh-who">' + (msg.side === "agent" ? AGENT_IC : USER_IC) + "<span>" + msg.name + "</span></div>" +
          '<div class="lyh-txt">' + msg.text + "</div>";
      }
      cell.appendChild(b);
      row.appendChild(cell);
      return row;
    };

    const restack = () => {
      const kids = Array.from(chat.children) as HTMLElement[];
      kids.forEach((el, i) => {
        const fromEnd = kids.length - 1 - i;
        el.classList.remove("dim", "fade", "gone");
        if (fromEnd === 2) el.classList.add("dim");
        else if (fromEnd === 3) el.classList.add("fade");
        else if (fromEnd >= 4) el.classList.add("gone");
      });
      while (chat.children.length > 7) chat.removeChild(chat.firstElementChild as Node);
    };

    const addMessage = (msg: Msg, instant: boolean) => {
      const row = rowEl(msg);
      chat.appendChild(row);
      if (instant) {
        row.classList.add("in", "no-anim");
        restack();
        requestAnimationFrame(() => row.classList.remove("no-anim"));
        return;
      }
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          row.classList.add("in");
          restack();
        })
      );
    };

    const MSG_INTERVAL = 2100;
    const HOLD_AFTER = 2600;
    const tick = () => {
      if (stopped) return;
      if (step >= THREAD.length) {
        step = 0;
        chat.replaceChildren();
        addMessage(THREAD[0], true);
        addMessage(THREAD[1], true);
        step = 2;
        timers.push(window.setTimeout(tick, HOLD_AFTER));
        return;
      }
      addMessage(THREAD[step], false);
      step += 1;
      timers.push(window.setTimeout(tick, MSG_INTERVAL));
    };

    chat.replaceChildren();
    addMessage(THREAD[0], true);
    addMessage(THREAD[1], true);
    step = 2;
    timers.push(window.setTimeout(tick, MSG_INTERVAL));

    return () => {
      stopped = true;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [t, messages, agent]);

  return (
    <>
      <style>{CSS_FIL}</style>
      <div className={className ? "lyh-chat " + className : "lyh-chat"} ref={chatRef} aria-hidden="true" />
    </>
  );
}

export default function HomeHeroVideo({ variante }: { variante?: HeroVariante } = {}) {
  const fondEtat = useFondVariante(!!variante);
  const etroit = useEtroit(!!variante);
  const champInputRef = useRef<HTMLInputElement>(null);
  /* Le titre etait ecrit en dur : sur /de la page passait en allemand mais le
     H1 restait en francais. Il passe par les cles, avec le francais en repli. */
  const { t, i18n } = useTranslation();
  const jsxT = getJsxT("home-blocks", i18n.language);
  const PHRASES = useMemo(() => {
    if (variante?.phrases.length) return variante.phrases;
    const v = t("heroHome.phrases", { returnObjects: true, defaultValue: PHRASES_FR });
    return Array.isArray(v) && v.length ? (v as string[]) : PHRASES_FR;
  }, [t, variante]);
  const THREAD = useMemo(() => buildThread(t as Tr), [t]);
  const typedRef = useRef<HTMLSpanElement>(null);
  const chipRefs = [useRef<HTMLImageElement>(null), useRef<HTMLImageElement>(null), useRef<HTMLImageElement>(null)];
  /* Champ d'essai du hero : l'URL saisie, puis l'URL validée qui ouvre la
     fenêtre de démonstration (chargée à la demande, hors du premier écran). */
  const [urlSaisie, setUrlSaisie] = useState("");
  const [essaiUrl, setEssaiUrl] = useState<string | null>(null);
  /* 29/09 : carrousel des lieux d'installation. Les flèches font glisser
     la piste d'un lieu à la fois (Shopify, WooCommerce, point de vente,
     domicile, événements) — ce n'est pas un interrupteur qui ouvre un bloc. */
  const [installIdx, setInstallIdx] = useState(0);
  const lieux: LieuInstall[] = variante
    ? (variante.liens ?? []).map((l) => ({ key: l.label, defaut: l.label, href: l.href, logo: l.icone, ordiSeulement: l.ordiSeulement }))
    : []; /* biolystes.com : pas de « Installer sur… » (inscription lystes.ai). */
  const nbLieux = lieux.length;
  /* La ligne épouse la largeur réelle du champ « Tester gratuitement » au
     dessus (30/09) : ses bords droits s'alignent ; sous 720 px, toute la
     largeur. Le carrousel lui-même est CarrouselLieux (13/10/2026). */
  const largeurInstall = useCallback((row: HTMLElement) => {
    if (window.innerWidth <= 720) return "100%";
    const champ = row.closest(".lyh-inner")?.querySelector(".lyh-field") ?? document.querySelector(".lyh-field");
    if (!champ) return null;
    return `${Math.max(0, champ.getBoundingClientRect().right - row.getBoundingClientRect().left)}px`;
  }, []);

  /* L'OFFRE, DITE UNE FOIS ET JUSTE, SOUS LES BOUTONS.
     Le bouton noir portait « Dès 99 € barré 49 €/mois » : masqué sur
     ordinateur, et c'est le bouton entier qui disparaissait sur téléphone.
     Aucun des deux nombres n'était le prix facturé (49,17 € HT), et le prix
     barré n'a jamais été pratiqué, ce que `offre-lancement.ts` signale
     lui-même comme un risque de pratique commerciale trompeuse.
     Le prix venait de la grille de la caisse, la durée d'essai de la caisse
     elle-même.

     30/09 (JP) : le hero ne dit plus l'essai ni le prix. Il dit ce que Lystes
     apporte aux produits, et le carrousel des lieux d'installation reprend les
     mêmes mots (« point de vente », « domicile des clients », « événements »).
     La phrase vit dans `heroHome.offre`, dans les sept langues. */
  const offre = variante
    ? variante.texte ?? ""
    : t("heroHome.offre", {
        defaultValue:
          "Donnez à vos produits les moyens d'atteindre leur plein potentiel de vente, que ce soit en ligne, au domicile de vos clients, en point de vente ou lors de vos événements.",
      });


  // Rotation des vignettes produit
  useEffect(() => {
    const imgs = chipRefs.map((r) => r.current).filter(Boolean) as HTMLImageElement[];
    if (imgs.length < 2) return;
    let idx = 0;
    const id = window.setInterval(() => {
      imgs[idx].classList.remove("on");
      idx = (idx + 1) % imgs.length;
      imgs[idx].classList.add("on");
    }, 2400);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Machine à écrire (segment italique)
  useEffect(() => {
    const typed = typedRef.current;
    if (!typed) return;
    let pIdx = 0,
      cIdx = 0,
      deleting = false,
      stopped = false;
    let id = 0;
    const type = () => {
      if (stopped) return;
      const phrase = PHRASES[pIdx];
      typed.textContent = phrase.slice(0, cIdx);
      let delay = deleting ? 38 : 72;
      if (!deleting && cIdx === phrase.length) {
        delay = 2200;
        deleting = true;
      } else if (deleting && cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % PHRASES.length;
        delay = 350;
      } else cIdx += deleting ? -1 : 1;
      id = window.setTimeout(type, delay);
    };
    type();
    return () => {
      stopped = true;
      window.clearTimeout(id);
    };
  }, [PHRASES]);

  return (
    <section
      className={variante ? `lyh lyh--variante${variante.fil ? " lyh--fil" : ""}${variante.classe ? ` ${variante.classe}` : ""}` : "lyh"}
      aria-label={variante?.aria ?? t("heroHome.eyebrow", { defaultValue: "Écosystème d'agents IA par produit" })}
    >
      <style>{CSS}</style>
      {variante && (
        <style>{`.lyh--variante .lyh-bgvid{ object-position:${variante.fond.mobile.position ?? "center"}; }
@media (min-width:768px){ .lyh--variante .lyh-bgvid{ object-position:${variante.fond.ordi.position ?? "center"}; } }
${variante.voile ? `.lyh--variante .lyh-veil{ background:${variante.voile}; }` : ""}
${variante.voileMobile ? `@media (max-width:720px){ .lyh--variante .lyh-veil{ background:${variante.voileMobile}; } }` : ""}
${variante.ctaClair ? `.lyh--variante .lyh-btn-black{ background:#fff; color:#000; } .lyh--variante .lyh-btn-black .lyh-arrow{ background:#000; color:#fff; }` : ""}
/* 12/10/2026 (JP, /bio en mobile) : titre plus présent mais équilibré, vidéo
   sur toute la hauteur, textes lisibles. Règles posées après celles de
   l'accueil, qui ne change pas.
   13/10/2026 (JP, capture à 920 px) : « ces 2 doivent toujours être alignés
   sur la même ligne ». Le bouton noir et le champ partagent UNE rangée à
   toutes les largeurs, téléphone compris : même hauteur, mêmes bords haut et
   bas, bord gauche sur la marge du titre. Avant, entre 721 et 1100 px, la
   borne de 420 px de l'accueil les empilait, et le bouton (48 px) n'avait
   pas la hauteur du champ (52 px). Une version côte à côte avait déplu en
   mobile pour la même raison : les hauteurs sont donc fixées, pas laissées
   au contenu. */
.lyh.lyh--variante .lyh-btns{ flex-wrap:nowrap; align-items:stretch; max-width:100%; }
.lyh.lyh--variante .lyh-btn-black{ flex:0 0 auto; height:52px; box-sizing:border-box; }
/* 13/10/2026 (JP) : le texte collait au bord gauche et la pastille au bord
   droit. Air à gauche (28 px), écart net entre texte et pastille, et la
   pastille posée à 8 px du bord, en haut, à droite et en bas : 52 px de
   haut = 8 + 36 + 8. Même règle sur téléphone (48 = 8 + 32 + 8). */
.lyh.lyh--variante .lyh-btn-black{ min-width:0; justify-content:space-between; align-items:center; gap:14px; padding:0 8px 0 28px; }
.lyh.lyh--variante .lyh-btn-black .lyh-arrow{ width:36px; height:36px; }
.lyh.lyh--variante .lyh-btn-outline.lyh-field{ flex:0 1 336px; min-width:0; height:52px; box-sizing:border-box; }
/* Preuves : la ligne prend la largeur du contenu et passe à la ligne au
   lieu de sortir de l'écran (« Lance… » coupé à 920 px), écarts réguliers. */
.lyh.lyh--variante .lyh-install-row{ width:100% !important; }
.lyh.lyh--variante .lyh-install-track{ column-gap:16px; row-gap:10px; }
@media (max-width:720px){
  .lyh.lyh--variante .lyh-h1{ font-size:clamp(30px, 9vw, 38px); line-height:1.08; margin-bottom:20px; }
  .lyh.lyh--variante .lyh-titre{ display:block; text-wrap:balance; }
  .lyh.lyh--variante .lyh-br{ display:none; }
  .lyh.lyh--variante .lyh-stage, .lyh.lyh--variante .lyh-bgvid{ height:100%; }
  /* Téléphone : même rangée, libellés courts. Le bouton garde la largeur de
     « Rendez-vous », le champ prend tout le reste. */
  .lyh.lyh--variante .lyh-btns{ flex-direction:row; flex-wrap:nowrap; gap:8px; width:100%; }
  .lyh.lyh--variante .lyh-btn-black, .lyh.lyh--variante .lyh-btn-outline.lyh-field{ order:0; height:48px; min-width:0; box-sizing:border-box; }
  .lyh.lyh--variante .lyh-btn-black{ flex:0 0 auto; width:auto; justify-content:space-between; gap:10px; padding:0 8px 0 18px; font-size:13px; }
  .lyh.lyh--variante .lyh-btn-black .lyh-arrow{ width:32px; height:32px; }
  .lyh.lyh--variante .lyh-btn-outline.lyh-field{ flex:1 1 0; width:auto; padding:5px 5px 5px 13px; gap:6px; }
  .lyh.lyh--variante .lyh-input{ font-size:13px; }
  .lyh.lyh--variante .lyh-arrow.lyh-submit{ height:36px; font-size:12px; padding:0 11px; gap:4px; }
  /* Sans champ (/crea), le bouton seul garde toute la largeur. */
  .lyh.lyh--variante .lyh-btns--seul .lyh-btn-black{ flex:1 1 auto; padding:0 8px 0 22px; font-size:14px; }
  .lyh.lyh--variante .lyh-btns--seul .lyh-btn-black .lyh-cta-l{ display:inline; } .lyh.lyh--variante .lyh-btns--seul .lyh-btn-black .lyh-cta-s{ display:none; }
  .lyh.lyh--variante .lyh-lien-shopify{ font-size:14px; gap:8px; }
  .lyh.lyh--variante .lyh-btn-logo{ width:16px; height:16px; }
  /* Preuves empilées, sur la marge du titre. */
  .lyh.lyh--variante .lyh-install-row{ margin-top:16px; }
  .lyh.lyh--variante .lyh-install-track{ flex-direction:column; align-items:flex-start; row-gap:10px; }
  .lyh.lyh--variante .lyh-offre{ font-size:14px; line-height:1.5; color:rgba(255,255,255,.9); margin-top:14px; }
}
/* 400 px et moins : quelques pixels repris, surtout au champ, pour que
   « Votre projet… » y tienne en entier (mesuré à 390 et 375). Le bouton noir
   garde 16 px d'air à gauche et sa pastille reste à 8 px du bord. */
@media (max-width:400px){
  .lyh.lyh--variante .lyh-btns:not(.lyh-btns--seul) .lyh-btn-black{ padding-left:16px; gap:8px; }
  .lyh.lyh--variante .lyh-btn-outline.lyh-field{ padding-left:11px; gap:4px; }
  .lyh.lyh--variante .lyh-input{ font-size:12px; }
  .lyh.lyh--variante .lyh-arrow.lyh-submit{ padding:0 14px; font-size:9px; }
}
/* 13/10/2026 (JP, capture de référence à 375 px), /bio seulement : titre
   sur 3 lignes fixes (« Lancez votre marque » / « cosmétique bio et
   végane : » / la fin en italique), ~24 px à 375, mis à l'échelle à 390 et
   430. Liste ~12,5 px, phrase ~11 px. /crea garde ses réglages. */
@media (max-width:720px){
  .lyh.lyh--bio .lyh-h1{ font-size:clamp(21px, 6.4vw, 28px); line-height:1.14; margin-bottom:18px; }
  .lyh.lyh--bio .lyh-titre{ display:inline; text-wrap:wrap; }
  .lyh.lyh--bio .lyh-br{ display:inline; }
  .lyh.lyh--bio .lyh-titre > span, .lyh.lyh--bio .lyh-it{ white-space:nowrap; }
  /* 14/10/2026 (JP) : le carrousel du hero en 10 px sur téléphone. */
  .lyh.lyh--bio .lyh-lien-shopify{ font-size:10px; gap:7px; }
  .lyh.lyh--bio .lyh-btn-logo{ width:14px; height:14px; }
  .lyh.lyh--bio .lyh-offre{ font-size:clamp(11px, 2.95vw, 12.5px); line-height:1.5; }
  .lyh.lyh--bio .lyh-offre-br{ display:inline; }
}`}</style>
      )}

      <div className="lyh-stage">
        {variante ? (
          fondEtat && (() => {
            const f = fondEtat.mobile ? variante.fond.mobile : variante.fond.ordi;
            return fondEtat.fixe || !f.video ? (
              <img className="lyh-bgvid" src={f.affiche} alt="" />
            ) : (
              <VideoFond key={f.video} src={f.video} affiche={f.affiche} />
            );
          })()
        ) : (
          <VideoAuto className="lyh-bgvid" preload="metadata" poster={A.videoPoster} src={A.video} />
        )}
        <div className="lyh-veil" />
      </div>

      <div className="lyh-inner">
        {/* La bascule Ecommerce / Entreprises. Sur grand ecran elle vit dans
            l'en-tete, a droite du logo ; ici elle n'apparait que sous 640 px,
            ou l'en-tete n'a pas la place de la porter. Meme composant,
            BasculeCible dans Header.tsx : un seul endroit a corriger. */}
        {!variante && <BasculeCible light dans="hero" />}
        {variante ? (
          <div className="lyh-eyebrow"><span>{variante.eyebrow}</span></div>
        ) : (
        <div className="lyh-eyebrow">
          <span>{t("heroHome.eyebrow", { defaultValue: "Écosystème d'agents IA par produit" })}</span>
          {/* Logos servis depuis le dépôt : les adresses externes précédentes
              expiraient (lien signé Lovable) ou pointaient vers le site d'un
              tiers. Alignement optique par la hauteur, pas par des marges
              négatives. */}
          <img src={shopifyLogo} alt="Shopify" className="lyh-eyebrow-logo" loading="lazy" />
          <img src={wooLogo} alt="WooCommerce" className="lyh-eyebrow-logo" loading="lazy" />
        </div>
        )}
        {variante ? (
          <h1 className="lyh-h1">
            {/* Les retours forcés ne valent que sur ordinateur : sur téléphone,
                le titre s'équilibre seul (text-wrap: balance), sans mot seul. */}
            <span className="lyh-titre">
              {variante.titre.split("\n").map((ligne, i) => {
                /* 17/10/2026 (JP) : sur biolystes.com, les vignettes de
                   l'accueil Lystes (produits qui défilent + vidéo) sont
                   insérées dans le titre, entre « cosmétique » et « bio et
                   végane ». Produits cosmétiques du catalogue, pas ceux de
                   mode de l'accueil. */
                const bio = variante.classe?.includes("lyh--bio") && i === 1 && ligne.startsWith("cosmétique ");
                return (
                  <span key={ligne}>
                    {i > 0 && <br className="lyh-br" />}
                    {i > 0 && " "}
                    {bio ? (
                      <>
                        cosmétique
                        <span className="lyh-chips">
                          <span className="lyh-chip first">
                            <img ref={chipRefs[0]} className="on" src="/bio-selection/creme-riche-nourrissante.webp" alt="" />
                            <img ref={chipRefs[1]} src="/bio-selection/huile-visage-tout-en-un.webp" alt="" />
                            <img ref={chipRefs[2]} src="/bio-fil/serum-anti-age-peptides.webp" alt="" />
                          </span>
                          <span className="lyh-chip second">
                            <VideoAuto src={A.avatar} preload="metadata" poster={A.avatarPoster} />
                          </span>
                        </span>{" "}
                        {ligne.slice("cosmétique ".length)}
                      </>
                    ) : (
                      ligne
                    )}
                  </span>
                );
              })}
            </span>
            <br className="lyh-br" />
            <span className="lyh-it">
              <span ref={typedRef} />
              <span className="lyh-caret" />
            </span>
          </h1>
        ) : (
        <h1 className="lyh-h1">
          {/* Claude et ChatGPT prennent leur majuscule : ce sont les deux
              noms dont on emprunte la credibilite, les ecrire en bas de casse
              se lit comme une faute et non comme un parti pris. */}
          {/* ⚠️ La SEULE source de ce titre est `heroHome.*` dans les sept
              fichiers `src/i18n/locales/<langue>.json`. Un bloc `hero.titre1`
              existe aussi dans `locales/home/agents-autonomes.<langue>.json`,
              il porte l'ancienne formulation et il est MORT : le gabarit
              `agents-autonomes-page.tmpl.html` ne le reference nulle part, la
              page monte ce composant-ci a la place. Le neerlandais y est meme
              redige en portugais, sans que personne le voie. Chercher
              « titre1 » tombe d'abord sur ce bloc mort : ne pas s'y fier. */}
          {t("heroHome.titre1", { defaultValue: "Déployer des agents IA" })}
          <br />
          {/* 31/08/2026 (JP) : « pour » doit rester sur la même ligne que
              « dans vos pages produits » et se placer à droite des deux
              photos. Le groupe est donc insécable. */}
          <span className="lyh-ligne2">
            {t("heroHome.titre2", { defaultValue: "ecommerce & retail" })}
            <span className="lyh-chips">
              <span className="lyh-chip first">
                <img ref={chipRefs[0]} className="on" src={A.chip1} alt="" />
                <img ref={chipRefs[1]} src={A.chip2} alt="" />
                <img ref={chipRefs[2]} src={A.chip3} alt="" />
              </span>
              <span className="lyh-chip second">
                <VideoAuto src={A.avatar} preload="metadata" poster={A.avatarPoster} />
              </span>
            </span>{" "}
            {t("heroHome.capables", { defaultValue: "pour" })}
          </span>
          <br />
          <span className="lyh-it">
            <span ref={typedRef} />
            <span className="lyh-caret" />
          </span>
        </h1>
        )}

        <div className={variante && !variante.champ ? "lyh-btns lyh-btns--seul" : "lyh-btns"}>
          <a
            className="lyh-btn-black"
            href={variante?.cta.href ?? "https://biolystes.pro/rdv"}
            {...(!variante || variante.cta.externe ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <span className="lyh-lbl-l">
              {variante ? (
                <>
                  <span className="lyh-cta-l">{variante.cta.label}</span>
                  <span className="lyh-cta-s">{variante.cta.labelCourt ?? variante.cta.label}</span>
                </>
              ) : (
                /* biolystes.com : un seul appel à l’action, le rendez-vous. */
                <>
                  <span className="hidden min-[721px]:inline">Prendre rendez-vous</span>
                  <span className="min-[721px]:hidden">Rendez-vous</span>
                </>
              )}
            </span>
            <span className="lyh-arrow">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </span>
          </a>
          {/* Ce n'est plus un lien de démonstration mais un champ : le
              visiteur colle l'URL de sa page produit et la fenêtre d'essai
              (techno Shot) s'ouvre sur son propre produit. */}
          {/* biolystes.com : pas de champ « Tester gratuitement » hors variante. */}
          {variante?.champ && (
          <form
            className="lyh-btn-outline lyh-field"
            onSubmit={(e) => {
              e.preventDefault();
              const v = urlSaisie.trim();
              if (variante) {
                /* Biolystes : champ vide, l'envoi part quand même (/demarrer). */
                variante.champ?.onSubmit(v);
              } else if (v) setEssaiUrl(v);
            }}
          >
            <input
              ref={champInputRef}
              className="lyh-input"
              type="text"
              inputMode={variante ? "text" : "url"}
              value={urlSaisie}
              onChange={(e) => setUrlSaisie(e.target.value)}
              placeholder={(etroit && variante?.champ?.placeholderCourt) || variante?.champ?.placeholder || t("heroHome.urlPlaceholder", { defaultValue: "Lien d'une fiche produit" })}
              aria-label={variante?.champ?.placeholder ?? t("heroHome.urlPlaceholder", { defaultValue: "Lien d'une fiche produit" })}
            />
            <button className="lyh-arrow lyh-submit" type="submit" aria-label={variante?.champ?.bouton ?? t("heroHome.ctaFree", { defaultValue: "Tester gratuitement" })}>
              <span className="lyh-submit-lbl">{variante?.champ?.bouton ?? t("heroHome.ctaFree", { defaultValue: "Tester gratuitement" })}</span>
              {/* Sous 720 px la pilule était trop étroite à côté de
                  l'inscription : le libellé court prend le relais. */}
              <span className="lyh-submit-lbl lyh-submit-lbl-s">{variante ? variante.champ?.boutonCourt ?? variante.champ?.bouton : t("heroHome.ctaFreeShort", { defaultValue: "Tester" })}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </form>
          )}

        </div>

        {/* Le chemin Shopify, sous l'inscription : un lien souligné avec le
            logo, pas une pastille. Les logos Shopify et WooCommerce du
            sur-titre n'étaient que des images : une marchande Shopify
            cherchait « Installer » et ne trouvait qu'un compte à créer.
            /install/shopify est le guide qui aboutit aujourd'hui, et il
            basculera seul sur la connexion en un clic quand
            `EXAMEN_SHOPIFY_PASSE` passera à vrai. */}
        {nbLieux > 0 && (
        <CarrouselLieux
          index={installIdx}
          setIndex={setInstallIdx}
          largeur={largeurInstall}
          libellePrecedent={t("heroHome.installPrec", { defaultValue: "Lieu d'installation précédent" })}
          libelleSuivant={t("heroHome.installSuiv", { defaultValue: "Lieu d'installation suivant" })}
          elements={lieux.map((lieu) => ({
            key: lieu.key,
            href: lieu.href,
            ordiSeulement: lieu.ordiSeulement,
            contenu: (
              <>
                {lieu.logo === "shopify" && <img src={shopifyLogo} alt="" className="lyh-btn-logo" />}
                {lieu.logo === "woo" && <img src={wooLogoViolet} alt="" className="lyh-btn-logo lyh-btn-logo--woo" />}
                {typeof lieu.logo === "object" && (
                  <svg className="lyh-btn-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    {lieu.logo.paths.map((d) => <path key={d} d={d} />)}
                    {lieu.logo.circles?.map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />)}
                  </svg>
                )}
                <span>{t(lieu.key, { defaultValue: lieu.defaut })}</span>
              </>
            ),
          }))}
        />
        )}

        {/* 28/09 (JP) : sur ordinateur, le prix passe sur sa propre ligne —
            la phrase tenait sur deux lignes inégales et le « Ensuite, dès … »
            se retrouvait coupé. Découpage sur la dernière phrase, donc valable
            dans toutes les langues. Le retour est masqué sur téléphone. */}
        {offre && (() => {
          const m = offre.match(/^([^.!?]*[.!?])\s+(.*)$/s);
          const avant = m ? m[1] : offre;
          const apres = m ? m[2] : null;
          return (
            <p className="lyh-offre">
              {avant}
              {apres && (<><br className="lyh-offre-br" />{" "}{apres}</>)}
            </p>
          );
        })()}

        {/* Carrousel des modèles IA utilisés par les équipes Lystes. Trois
            logos visibles à la fois, défilement continu (boucle sans saut :
            la liste est dupliquée). Logos en SVG inline (currentColor). */}
        {!variante && (
        <div className="lyh-models" aria-label="Modèles IA utilisés">
          <div className="lyh-models-track">
            {[...MODELES_IA, ...MODELES_IA].map((m, i) => (
              <span className="lyh-model" key={m.nom + i}>
                <svg viewBox={m.viewBox} aria-hidden="true" focusable="false"><path fill="currentColor" fillRule={m.evenodd ? "evenodd" : undefined} d={m.d} /></svg>
                <span>{m.nom}</span>
              </span>
            ))}
          </div>
        </div>
        )}
      </div>

      {variante?.fil
        ? <FilConversation messages={variante.fil.messages} agent={variante.fil.agent} />
        : !variante && <FilConversation messages={THREAD} />}

      {essaiUrl && (
        <Suspense fallback={null}>
          <HeroTryModal url={essaiUrl} onClose={() => setEssaiUrl(null)} />
        </Suspense>
      )}

    </section>
  );
}

const CSS = `
/* Variante (autre page) sans fil de conversation : pas de place réservée
   sous les boutons sur téléphone. Avec un fil (/bio), la place de l'accueil
   reste. */
@media (max-width:720px){ .lyh--variante:not(.lyh--fil) .lyh-inner{ padding-bottom:56px !important; } }
/* /bio sur téléphone (JP, 13/10/2026) : le fil s'arrête 110 px au-dessus du
   bas, au-dessus de la barre flottante du widget (« Voir nos dernières
   actus ») ; le texte de la bannière garde toute la hauteur du fil plus un
   écart au-dessus, et une bulle qui sort par le haut s'efface avant
   d'approcher le texte. */
/* 14/10/2026 (JP, deux passes) : le bas restait vide. Le fil, ramené à
   220 px, descend à 20 px du bas ; à 72 px quand la pilule du widget
   (« Voir nos dernières actus », 63 px) est sur la page. Le texte le suit à
   12 px, et le lien marqué « ordi seulement » disparaît. */
@media (max-width:720px){
  .lyh-ordi-seulement{ display:none !important; }
  .lyh--fil .lyh-inner{ padding-bottom:252px !important; }
  body:has(#lystes-widget-btn) .lyh--fil .lyh-inner{ padding-bottom:304px !important; }
  body:has(#lystes-widget-btn) .lyh--fil .lyh-chat{ bottom:72px; }
  .lyh--fil .lyh-chat{ bottom:20px; height:220px;
    -webkit-mask-image:linear-gradient(to bottom, transparent 0%, transparent 10%, rgba(0,0,0,.4) 22%, #000 40%);
    mask-image:linear-gradient(to bottom, transparent 0%, transparent 10%, rgba(0,0,0,.4) 22%, #000 40%); }
}
/* Variante : peu de liens, tous visibles d'un coup, sans flèches ni masque ;
   ils passent à la ligne sur téléphone au lieu d'être coupés. */
.lyh--variante .lyh-install-row{ width:auto !important; max-width:100%; }
.lyh--variante .lyh-install-viewport{ overflow:visible; }
.lyh--variante .lyh-install-track{ flex-wrap:wrap; width:auto; flex:1 1 auto; row-gap:10px; transform:none !important; }
.lyh--variante .lyh-install-chevs{ display:none; }
/* Libellé court du bouton noir sur téléphone : la pilule y fait 127 px. */
.lyh--variante .lyh-cta-s{ display:none; }
@media (max-width:720px){ .lyh--variante .lyh-cta-l{ display:none; } .lyh--variante .lyh-cta-s{ display:inline; } }
.lyh{ position:relative; width:100vw; margin-left:calc(-50vw + 50%); min-height:640px; height:100svh; max-height:900px;
  overflow:hidden; color:#fff; isolation:isolate; --gb:rgba(255,255,255,.10); --gbd:rgba(255,255,255,.18);
  --ease:cubic-bezier(.22,1,.36,1); font-family:-apple-system,BlinkMacSystemFont,"Bricolage Grotesque","Helvetica Neue",Helvetica,Arial,sans-serif; }
.lyh *{ box-sizing:border-box; }
.lyh-stage{ position:absolute; inset:0; z-index:0; background:#3a352f; }
.lyh-bgvid{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:60% center; pointer-events:none; }
@media (min-width:768px){ .lyh-bgvid{ object-position:center; } }
.lyh-veil{ position:absolute; inset:0; background:linear-gradient(100deg, rgba(0,0,0,.42) 0%, rgba(0,0,0,.12) 55%, rgba(0,0,0,.25) 100%); }
@media (max-width:720px){ .lyh-veil{ background:
  linear-gradient(to top, rgba(0,0,0,.55) 0%, rgba(0,0,0,.28) 38%, rgba(0,0,0,0) 62%),
  linear-gradient(100deg, rgba(0,0,0,.30) 0%, rgba(0,0,0,.08) 60%, rgba(0,0,0,.18) 100%); } }

.lyh-inner{ position:relative; z-index:2; width:100%; max-width:none; margin:0; padding:0 clamp(28px,6.15vw,104px); height:100%;
  display:flex; flex-direction:column; justify-content:center; align-items:flex-start; text-align:left; }
/* Grand écran : le contenu commence sur le même axe visuel que le logo au
   lieu d'être resserré au centre. La légère descente reprend la composition
   de référence, avec le marketing sous l'en-tête plutôt que collé en haut. */
@media (min-width:1101px){ .lyh-inner{ transform:translateY(64px); } }
.lyh-eyebrow{ display:flex; align-items:center; gap:7px; font-size:9px; font-weight:600; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.85); margin-bottom:5px; }
/* Deux icones carrees de meme taille. L'ancien couple melait une icone et un
   logotype complet, de hauteurs differentes, dont le mot COMMERCE etait ecrit
   en noir : illisible sur un fond photo sombre. */
.lyh-eyebrow-logo{ height:16px; width:16px; object-fit:contain; display:block; opacity:.95; }
.lyh-h1{ font-weight:500; font-size:clamp(28px,3.6vw,50px); line-height:1.1; letter-spacing:-.02em; margin:0 0 15px; max-width:780px; color:#fff; font-family:'Bricolage Grotesque'; }
.lyh-it{ font-style:italic; font-weight:500; display:inline-block; padding-inline-end:.12em; min-height:1.1em; }
.lyh-caret{ display:inline-block; width:.06em; height:.9em; margin-left:.04em; background:currentColor; transform:translateY(.12em); animation:lyhcaret 1s steps(2) infinite; }
@keyframes lyhcaret{ 50%{ opacity:0; } }

.lyh-chips{ display:inline-flex; align-items:center; position:relative; vertical-align:middle; margin:0 0px 0px 8px; transform:translateY(-.08em); user-select:none; pointer-events:none; }
/* Insécable : « dans vos pages produits », les deux photos et « pour »
   tiennent sur une seule ligne, « pour » restant à droite des photos. */
.lyh-ligne2{ white-space:nowrap; }
.lyh-chip{ display:block; width:38px; height:38px; overflow:hidden; position:relative; border:3px solid #fff; border-radius:12px; background:#f2f0ec; }
.lyh-chip.first{ transform:rotate(-6deg); z-index:3; }
.lyh-chip.second{ margin-left:-12px; z-index:2; }
.lyh-chip img, .lyh-chip video{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
.lyh-chip img{ opacity:0; transition:opacity 500ms; }
.lyh-chip img.on{ opacity:1; }
.lyh-aitag{ position:absolute; top:-3px; right:-3px; z-index:5; background:#194cff; color:#fff; font-size:7px; font-weight:600; padding:3px 3px; border-radius:6px; letter-spacing:1px; text-transform:uppercase; }
@media (max-width:850px){ .lyh-chip{ width:26px; height:26px; border-width:2px; border-radius:6px; } .lyh-chip.second{ margin-left:-8px; } .lyh-chips{ margin:0 2px; } .lyh-aitag{ font-size:7px; padding:1px 4px; } }

 /* 560 px au plus : les deux boutons tiennent sur une ligne, le champ d'essai
    passe à la ligne suivante. Sans cette borne, le bouton Shopify poussait
    le champ sous le fil de conversation, à droite (mesuré à 1024 px). */
 .lyh-btns{ display:flex; flex-wrap:wrap; gap:16px; margin-top:8px; max-width:560px; }
 .lyh-btn-logo{ width:16px; height:16px; object-fit:contain; flex:none; display:block; }
 /* L'offre, en une phrase sous les boutons : essai, carte, premier
    prélèvement, puis le prix d'entrée hors taxes. */
.lyh-offre{ margin:12px 0 0; max-width:520px; font-size:11.5px; line-height:1.5; color:rgba(255,255,255,.86); text-wrap:pretty; }
/* Retour à la ligne avant « Ensuite, dès … » : ordinateur uniquement. */
.lyh-offre-br{ display:none; }
@media (min-width:721px){ .lyh-offre-br{ display:block; } }

 /* Carrousel des modèles IA : fenêtre fixe (~3 logos), bande défilante en
    boucle. Deux copies de la liste côte à côte ; translateX de 0 à -50%
    parcourt exactement un jeu, sans saut. Fondus latéraux en masque. */
  .lyh-models{ position:relative; overflow:hidden; width:336px; max-width:100%; margin-top:22px; color:rgba(255,255,255,.82);
    -webkit-mask-image:linear-gradient(to right, transparent, #000 11%, #000 89%, transparent); mask-image:linear-gradient(to right, transparent, #000 11%, #000 89%, transparent); }
 .lyh-models-track{ display:flex; flex-wrap:nowrap; align-items:center; gap:22px; width:max-content; animation:lyh-marquee 22s linear infinite; }
 .lyh-model{ display:inline-flex; align-items:center; gap:7px; font-size:11px; font-weight:500; letter-spacing:.02em; white-space:nowrap; }
 .lyh-model svg{ width:14px; height:14px; flex:none; opacity:.9; }
 @keyframes lyh-marquee{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
.lyh-btn-black, .lyh-btn-outline{ display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:9px 1px 11px 9px; border-radius:999px; font-size:13px; font-weight:500; line-height:1; text-decoration:none; min-width:183px; transition:opacity .2s, transform .2s, background-color .2s; }
.lyh-btn-black{ background:#000; color:#fff; }
.lyh-btn-black:hover{ opacity:.9; transform:translateY(-2px); }
.lyh-btn-black .lyh-arrow{ background:#fff; color:#000; }
.lyh-btn-outline{ background:rgba(255,255,255,.08); color:#fff; border:1px solid rgba(255,255,255,.55); -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); }
.lyh-btn-outline:hover{ background:rgba(255,255,255,.16); transform:translateY(-2px); }
.lyh-btn-outline .lyh-arrow{ background:rgba(255,255,255,.22); color:#fff; }
/* Bouton Shopify : même pilule que le champ d'essai, logo à gauche, pas de
   rond fléché. Largeur réglée sur le libellé, jamais coupé. Cette règle vient
   APRÈS la règle commune des boutons, à spécificité égale : placée avant,
   elle était écrasée par « padding:9px 1px 11px 9px », et le libellé collait
   au bord droit (1 px) dès qu'il dépassait la largeur minimale, en allemand
   et en néerlandais. Les réglages mobiles, plus bas, passent toujours après. */
/* Carrousel des lieux d'installation : la piste glisse sous un masque, les
   flèches la font avancer d'un lieu à la fois. La ligne prend exactement la
   largeur du champ « Tester gratuitement » au-dessus (336 px, bornée à 100 %
   sur petit écran) : les deux flèches se trouvent ainsi à l'extrémité droite
   du bouton « Tester gratuitement ». La fenêtre occupe tout le reste de la
   ligne ; comme elle est plus étroite que la piste, le début du lieu suivant
   apparaît toujours en léger, sous le masque. */
.lyh-install-row{ display:flex; align-items:center; gap:10px; margin-top:14px; width:336px; max-width:100%; transition:width .35s var(--ease); }
.lyh-install-viewport{ flex:1 1 0; min-width:0; overflow:hidden; }
.lyh-install-chevs{ display:flex; align-items:center; gap:4px; flex:none; }
.lyh-install-track{ display:flex; align-items:center; gap:11px; width:max-content; flex:none; transition:transform .35s var(--ease); will-change:transform; }
/* 28/09 (JP) : la pointe de la bulle tire le centre du logo vers le bas, le
   corps de la bulle paraissait 1,4 px trop haut. La marge haute recentre le
   corps sur le texte (mesuré au pixel : 2 px en bureau, 4 px sur téléphone). */
.lyh-btn-logo--woo{ width:auto; height:12px; margin-top:2px; }
.lyh-lien-shopify{ display:inline-flex; align-items:center; gap:7px; font-size:11px; font-weight:600; line-height:1; color:#fff; text-decoration:underline; text-underline-offset:3px; white-space:nowrap; transition:opacity .2s; }
.lyh-lien-shopify:hover{ opacity:.75; }
.lyh-install-chev{ display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; padding:0; border:0; background:transparent; color:#fff; opacity:.8; cursor:pointer; transition:opacity .2s; }
.lyh-install-chev:hover{ opacity:1; }
.lyh-install-chev svg{ width:16px; height:16px; display:block; }
.lyh-arrow{ display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; flex:none; }
.lyh-arrow svg{ width:14px; height:14px; }
/* Champ d'essai : même pilule que l'ancien bouton, le libellé devient un
   placeholder et la flèche devient le bouton d'envoi. */
.lyh-field{ padding:6px 6px 6px 22px; min-width:336px; max-width:100%; gap:8px; cursor:text; }
.lyh-input{ flex:1 1 auto; min-width:0; background:transparent; border:0; outline:none; color:#fff; font:inherit; font-size:12px; padding:0; }
.lyh-input::placeholder{ color:rgba(255,255,255,.8); }
.lyh-submit{ width:auto; height:38px; border-radius:21px; padding:0 14px; gap:7px; border:0; cursor:pointer; font:inherit; font-size:10px; white-space:nowrap; }
.lyh-submit svg{ width:14px; height:14px; }
.lyh-submit-lbl-s{ display:none; }
.lyh-submit:hover{ background:rgba(255,255,255,.34); }


/* Tablette (721 à 1100 px) : le fil de conversation occupe la moitié droite
   du bas de l'écran. Centré verticalement, le bloc boutons + offre
   descendait sous les bulles (mesuré à 768 x 1024). Il se cale en haut,
   sous l'en-tête, et laisse le bas au fil. */
@media (min-width:721px) and (max-width:1100px){
  .lyh-inner{ justify-content:flex-start; padding-top:150px; }
  /* 420 px pour les boutons : l'inscription (185 px) et « Auf Shopify
     installieren » (205 px, marges de 18 px rétablies) tiennent côte à côte
     avec leur écart de 16 px. À 400, le bouton Shopify allemand passait seul
     sur une ligne. L'offre garde 400 px. */
  .lyh-btns{ max-width:420px; }
  .lyh-offre{ max-width:400px; }
}
@media (max-width:720px){
  /* Hauteur au moins égale à l'écran, et plus si le contenu l'exige : avec
     les deux boutons et la ligne d'offre, un écran de 667 px ne suffisait
     plus, et le sur-titre remontait sous l'en-tête. Le contenu reste calé en
     bas, au-dessus du fil de conversation (262 px). */
  .lyh{ height:auto; min-height:100svh; max-height:none; }
  .lyh-inner{ height:auto; min-height:100svh; justify-content:flex-end; padding:124px 20px 262px; }
  .lyh-eyebrow{ font-size:7px; letter-spacing:.14em; margin-bottom:7px; gap:6px; }
  /* Carrousel d'installation sur téléphone : écart réduit entre les lieux,
     le masque limite déjà le débordement (la translation est bornée en JS). */
  .lyh-install-row{ width:100%; }
  .lyh-install-row{ gap:8px; }
  .lyh-install-track{ gap:11px; }
  .lyh-lien-shopify{ font-size:11px; gap:7px; }
  .lyh-btn-logo--woo{ margin-top:4px; }
  .lyh-eyebrow-logo{ height:14px; width:14px; }
  .lyh-eyebrow-logo--woo{ height:11px; }
  .lyh-h1{ font-size:clamp(23px,5.9vw,29px); line-height:1.14; margin-bottom:18px; }
  /* Mobile : le champ d'essai et l'inscription partagent la même rangée.
     Le champ absorbe l'espace disponible tandis que l'inscription garde la
     largeur minimale nécessaire à son libellé et à sa flèche. */
  .lyh-btns{ gap:8px; margin-top:0; width:100%; max-width:none; flex-wrap:nowrap; align-items:stretch; }
  .lyh-btn-outline.lyh-field{ order:-1; width:auto; min-width:0; flex:1 1 0; padding:4px 4px 4px 10px; box-sizing:border-box; overflow:hidden; }
  .lyh-btn-black{ flex:0 0 127px; width:127px; min-width:0; box-sizing:border-box; }
  .lyh-btn-black{ justify-content:space-between; padding:5px 5px 5px 12px; }
  .lyh-offre{ margin-top:10px; font-size:10.5px; }
  .lyh-input{ font-size:8.8px; text-overflow:ellipsis; }
  .lyh-arrow.lyh-submit{ width:auto; height:30px; border-radius:18px; padding:0 14px 0 15px; font-size:8.8px; gap:4px; flex:0 0 auto; }
  .lyh-submit-lbl{ display:none; } .lyh-submit-lbl-s{ display:inline; }
  .lyh-arrow.lyh-submit svg{ width:11px; height:11px; }
  .lyh-models{ width:300px; margin-top:14px; }
  .lyh-models-track{ gap:14px; }
  .lyh-model{ font-size:9.5px; gap:5px; }
  .lyh-model svg{ width:11px; height:11px; }
  .lyh-btn-outline{ min-width:0; font-size:11.5px; white-space:nowrap; padding:8px 8px 8px 14px; gap:7px; flex:0 0 auto; }
  .lyh-btn-black{ font-size:8.8px; }
  .lyh-arrow{ width:21px; height:21px; } .lyh-arrow svg{ width:11px; height:11px; }
}
@media (max-width:380px){
  .lyh-btn-black{ flex-basis:119px; width:119px; padding-left:10px; font-size:8.4px; }
  .lyh-btn-outline.lyh-field{ padding-left:9px; }
  .lyh-input{ font-size:8.4px; }
  .lyh-arrow.lyh-submit{ padding:0 12px 0 13px; font-size:8.4px; }
}
@media (prefers-reduced-motion:reduce){
  .lyh-caret{ animation:none; }
  .lyh-models-track{ animation:none; }
}
.lyh-models:hover .lyh-models-track{ animation-play-state:paused; }
`;

const CSS_FIL = `
/* Fil de conversation (FilConversation) : bannière de l'accueil et de /bio. Les variables du
   verre sont redéfinies ici pour que le fil marche hors du hero. */
.lyh-chat *{ box-sizing:border-box; }
.lyh-chat{ --gb:rgba(255,255,255,.10); --gbd:rgba(255,255,255,.18); --ease:cubic-bezier(.22,1,.36,1);
  color:#fff; font-family:-apple-system,BlinkMacSystemFont,"Bricolage Grotesque","Helvetica Neue",Helvetica,Arial,sans-serif;
  position:absolute; right:0; bottom:0; z-index:3; width:min(454px,100vw); height:386px; padding:16px 16px 32px; display:flex; flex-direction:column; justify-content:flex-end; overflow:clip; pointer-events:none;
  -webkit-mask-image:linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.35) 12%, #000 34%); mask-image:linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.35) 12%, #000 34%); }
.lyh-row{ display:grid; grid-template-rows:0fr; transition:grid-template-rows 500ms var(--ease); }
.lyh-row.in{ grid-template-rows:1fr; }
.lyh-row.agent{ justify-items:start; }
.lyh-row.user{ justify-items:end; }
.lyh-cell{ overflow:hidden; min-height:0; }
.lyh-cell > .lyh-bubble{ margin-top:12px; }
.lyh-bubble{ width:75vw; max-width:334px; border-radius:16px; padding:16px; background:var(--gb); border:1px solid var(--gbd); -webkit-backdrop-filter:blur(82px); backdrop-filter:blur(82px); display:flex; flex-direction:column; gap:8px;
  -webkit-mask-image:linear-gradient(to top, #000 50%, transparent 90%); mask-image:linear-gradient(to top, #000 50%, transparent 90%);
  -webkit-mask-size:auto 200%; mask-size:auto 200%; -webkit-mask-position:center top; mask-position:center top;
  opacity:0; transition:opacity 500ms cubic-bezier(.4,0,.2,1), -webkit-mask-position 500ms cubic-bezier(.4,0,.2,1), mask-position 500ms cubic-bezier(.4,0,.2,1); }
.lyh-row.in .lyh-bubble{ -webkit-mask-position:center 100%; mask-position:center 100%; opacity:1; }
.lyh-row.dim .lyh-bubble{ opacity:.62; }
.lyh-row.fade .lyh-bubble{ opacity:.3; }
.lyh-row.no-anim{ transition:none; }
.lyh-row.no-anim .lyh-bubble{ transition:none; }
.lyh-who{ display:flex; align-items:center; gap:8px; font-size:12.5px; color:rgba(255,255,255,.82); }
.lyh-ic{ width:16px; height:16px; flex:none; display:grid; place-items:center; color:rgba(255,255,255,.85); }
.lyh-ic svg{ width:15px; height:15px; }
.lyh-txt{ font-size:15px; line-height:1.45; color:#fff; text-wrap:pretty; }

.lyh-slots{ display:flex; flex-direction:column; gap:12px; }
.lyh-shead{ display:flex; justify-content:space-between; align-items:center; font-size:12.5px; }
.lyh-shead svg{ width:16px; height:16px; }
.lyh-sgrid{ display:grid; grid-template-columns:repeat(5,1fr); gap:8px; font-size:12.5px; color:rgba(255,255,255,.82); }
.lyh-sgrid p{ display:flex; justify-content:center; padding:5px 0; border-radius:999px; }
.lyh-sgrid p.sel{ background:#86efac; color:#14261a; }
.lyh-slots button{ width:100%; border:none; border-radius:10px; background:#fff; color:#7a7a74; font-size:13px; padding:9px 0; font-family:inherit; }

.lyh-wt{ font-size:15px; line-height:1.45; color:#fff; }
.lyh-wn{ font-size:12.5px; color:rgba(255,255,255,.72); }
.lyh-balist{ display:flex; flex-direction:column; gap:8px; }
.lyh-barow{ display:flex; align-items:center; gap:10px; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.16); border-radius:12px; padding:6px; }
.lyh-barow img{ width:58px; height:42px; object-fit:cover; border-radius:8px; flex:none; }
.lyh-batx{ display:flex; flex-direction:column; min-width:0; }
.lyh-batx b{ font-size:12.5px; font-weight:700; color:#fff; }
.lyh-batx span{ font-size:11.5px; color:rgba(255,255,255,.7); }
.lyh-stars{ display:flex; gap:3px; }
.lyh-stars i{ width:17px; height:17px; border-radius:3px; background:#194cff; display:grid; place-items:center; }
.lyh-stars svg{ width:11px; height:11px; fill:#fff; }
.lyh-quote{ font-size:13.5px; font-style:italic; line-height:1.45; color:#fff; }
.lyh-rfoot{ display:flex; align-items:center; justify-content:space-between; }
.lyh-rauth{ font-size:11.5px; color:rgba(255,255,255,.72); }
.lyh-rnav{ display:flex; align-items:center; gap:8px; }
.lyh-rdot{ width:22px; height:22px; border-radius:50%; border:1px solid rgba(255,255,255,.35); display:grid; place-items:center; color:#fff; }
.lyh-rdot.off{ opacity:.4; }
.lyh-rdot svg{ width:11px; height:11px; }
.lyh-rcount{ font-size:11.5px; color:rgba(255,255,255,.72); }
.lyh-prods{ display:flex; gap:8px; }
.lyh-prod{ flex:1; min-width:0; background:rgba(255,255,255,.12); border:1px solid rgba(255,255,255,.16); border-radius:12px; padding:8px 6px 10px; display:flex; flex-direction:column; align-items:center; gap:3px; text-align:center; position:relative; }
.lyh-prod img{ width:42px; height:50px; object-fit:cover; border-radius:6px; }
.lyh-prod b{ font-size:10.5px; font-weight:700; line-height:1.15; color:#fff; }
.lyh-prod span{ font-size:10.5px; color:rgba(255,255,255,.72); }
.lyh-prod .lyh-add{ position:absolute; right:5px; bottom:-7px; width:19px; height:19px; border-radius:50%; background:#fff; color:#111; font-size:13px; line-height:1; display:grid; place-items:center; font-weight:600; }

@media (max-width:720px){
  .lyh-chat{ height:260px; padding:10px 12px 16px; }
  .lyh-bubble{ width:80vw; max-width:272px; padding:12px; border-radius:14px; gap:6px; }
  .lyh-txt{ font-size:13.5px; line-height:1.4; } .lyh-who{ font-size:11px; }
  .lyh-wt{ font-size:13.5px; } .lyh-wn{ font-size:11.5px; }
  .lyh-barow img{ width:50px; height:36px; } .lyh-batx b{ font-size:11.5px; } .lyh-quote{ font-size:12.5px; } .lyh-prod img{ width:36px; height:44px; }
  .lyh-sgrid{ gap:5px; font-size:11px; } .lyh-slots button{ font-size:12px; padding:8px 0; }
}
@media (max-width:380px){
  .lyh-bubble{ max-width:250px; }
}
@media (prefers-reduced-motion:reduce){
  .lyh-row{ transition:none; } .lyh-bubble{ transition:opacity 200ms ease; }
}
`;
