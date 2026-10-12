import { LYSTES_ENV } from "@lystes/integrations/supabase/env";
/**
 * La carte de discussion ouverte, en haut de la page publique de la marque.
 *
 * Décision de JP : sur mobile, un bouton « discuter » qui ouvre une popup se
 * fait ignorer. La conversation doit être déjà ouverte, à portée de pouce, avec
 * une question déjà posée par l'agent. C'est le conseiller de boutique
 * (`SITE_ADVISOR`) qui parle : sa portée est le catalogue entier, pas une fiche.
 *
 * COPIE EXACTE DU WIDGET WOOCOMMERCE, sans compromis. Consigne de JP le
 * 12/08/2026, après une première version qui reprenait les couleurs mais pas la
 * structure : « ce n'est pas le même chat, les mêmes boutons ».
 *
 * Toutes les valeurs ci-dessous sortent de `public/woo-product-chat.js`, avec
 * leur ligne. Ce ne sont pas des ordres de grandeur.
 *
 * Le piège qu'on ne voit qu'en lisant le CSS : dans le widget, les avatars ne
 * forment PAS un bandeau en haut de la conversation. Ils sont ancrés au bloc de
 * saisie, en `position: absolute; top: -18px; right: 11px` (ligne 2032), donc à
 * cheval sur la frontière entre la zone grise des messages et le bloc blanc. Un
 * commentaire du fichier explique pourquoi : le conteneur grandit vers le haut
 * quand la conversation s'ouvre, et un badge ancré en haut remonterait avec lui.
 *
 * On ne charge PAS `woo-product-chat.js` : 9 732 lignes écrites pour s'injecter
 * dans un site tiers dont il ne maîtrise pas le CSS. Ici on est chez nous.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { supabase } from "@lystes/integrations/supabase/client";
import { deMarque } from "@lystes/lib/elision";
import { VoiceCallButton } from "@lystes/components/chatbot/VoiceCallButton";
import { resolveSectorKey } from "@lystes/config/sector-resolver";
import { getSectorConfig } from "@lystes/config/sector-config";
import { vendDesPrestations } from "@lystes/config/secteurs-prestations";

interface Props {
  accountId: string;
  brandName: string;
  logoUrl?: string | null;
  /**
   * L'image du produit mis en avant que le visiteur regarde. Le dernier avatar
   * bascule dessus, exactement comme le widget montre l'image de la fiche
   * ouverte. Absente, on retombe sur le logo de la marque.
   */
  vignetteUrl?: string | null;
  /** Message du visiteur envoyé tout seul dès que l'agent est prêt (formulaire de contact devenu chat). */
  premierMessage?: string | null;
  /**
   * Mode « contact » (page /:slug/contact, demande de JP du 30/09/2026).
   * Passer la prop, même à `null`, suffit à l'activer : `null` pendant que
   * `brand-contact-message` enregistre le message, puis l'identifiant et le
   * jeton signé qu'il renvoie. Le serveur relit l'historique en base : le
   * navigateur n'envoie jamais `history` dans ce mode.
   */
  contact?: { id: string; jeton: string } | null;
  /** Le message du formulaire est en cours d'enregistrement : bulle client et points d'attente. */
  contactEnAttente?: boolean;
  /** Page posée dans un iframe chez la marchande : `/embed/*` interdit le micro, pas de bouton d'appel. */
  integre?: boolean;
  /** Ce que le serveur a conclu après chaque réponse : réglé tout de suite, ou à recontacter et pourquoi. */
  onStatut?: (s: { statut: "repondu" | "a_recontacter"; manque: string[] }) => void;
  /**
   * Démonstration (visite « Vos outils » de l'accueil, 12/10/2026) : la carte
   * reçoit son agent et ses bulles au lieu de les demander au serveur. Aucun
   * appel réseau, rien ne s'envoie. Absente sur les vraies pages.
   */
  demo?: DemoConseiller;
  /**
   * [lot 11] Prévenu quand on sait si la marque a un conseiller : `true` à
   * l'arrivée de l'agent, `false` s'il n'y en a pas. Le magazine s'en sert
   * pour ne poser le titre de son module qu'au-dessus d'une vraie carte.
   */
  onDisponible?: (disponible: boolean) => void;
}

/** Ce que la visite fournit à la carte : l'agent, ses bulles, l'attente. */
export interface DemoConseiller {
  agent: { id: string; name: string; logo_url?: string | null };
  messages: { role: "user" | "assistant"; content: string }[];
  /** Les points d'attente du conseiller, sous la dernière bulle. */
  enAttente?: boolean;
  /** Le libellé du bouton noir du secteur. */
  libelleAction?: string;
}

/** Ce que renvoie `conseiller-boutique-chat` en mode contact. */
interface ReponseContact {
  reply?: string;
  statut?: string;
  manque?: unknown;
}

/** Nettoie `manque` : seules des chaînes non vides passent, cinq au plus. */
export function lireManque(brut: unknown): string[] {
  if (!Array.isArray(brut)) return [];
  return brut
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((x) => x.trim())
    .slice(0, 5);
}

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface AgentMeta {
  id: string;
  name: string;
  initial_message?: string | null;
  logo_url?: string | null;
}

/* Le CSS du widget, valeur pour valeur. Le préfixe `lmk-` (lystes marque)
   évite toute collision avec le widget lui-même si les deux se croisaient un
   jour sur la même page. Exporté pour la visite « Vos outils » de
   /accueil-v2, qui redessine la carte sans appeler le conseiller. */
export const STYLE = `
/* Restyle du 12/10/2026, demande de JP : « pas terrible du tout en termes de
   design ». La reference est le bloc de conversation de l'accueil, au-dessus de
   « Equipe IA de conseillers produit » (components/bio/AnimatedChat.tsx) : une
   carte blanche bordee, des bulles blanches a contour leger, l'heure en petit
   gris, un separateur fin, la barre au contour degrade rose, lavande et vert.
   Les valeurs ci-dessous sont celles de ses classes Tailwind, traduites ici
   parce que la carte vit aussi dans des pages dont le CSS n'est pas le notre.
   Plus de zone grise, plus de titre en capitales, plus de pastille noire.
   PAS D'ACCENT GRAVE dans ces commentaires : ils vivent dans un gabarit de
   chaine, et un accent grave le referme. */
.lmk-carte {
  background: #fff; border: 1px solid hsl(var(--border, 0 0% 90%));
  border-radius: 20px; overflow: hidden;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.lmk-head { display: flex; align-items: center; gap: 10px; padding: 14px 16px 0; min-width: 0; }
.lmk-head-avatar {
  width: 26px; height: 26px; border-radius: 8px; object-fit: cover; flex: none;
  border: 1px solid hsl(var(--border, 0 0% 90%)); display: block; background: #fff;
}
.lmk-head-texte { display: flex; flex-direction: column; min-width: 0; line-height: 1.25; }
.lmk-head-nom {
  font-size: 13px; font-weight: 600; color: hsl(var(--foreground, 0 0% 7%));
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.lmk-head-role {
  font-size: 11px; color: hsl(var(--muted-foreground, 0 0% 45%));
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.lmk-container {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  /* La colonne DOIT etre bornee. Avec une colonne auto, la grille se
     dimensionne sur le contenu le plus large et sort du telephone. */
  grid-template-columns: minmax(0, 1fr);
  min-width: 0;
}
.lmk-messages, .lmk-block { min-width: 0; }
.lmk-messages {
  padding: 16px 16px 14px;
  height: 288px;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  background: #fff;
  display: flex; flex-direction: column; gap: 14px;
}
.lmk-messages::-webkit-scrollbar { width: 0; height: 0; }
/* Une ligne de conversation : la bulle, puis l'heure dessous. La classe
   lmk-message reste sur la ligne, la visite de l'accueil la vise. */
.lmk-message {
  display: flex; flex-direction: column; gap: 4px;
  max-width: 88%; width: fit-content; flex: none; min-width: 0;
}
.lmk-message.user { margin-left: auto; align-items: flex-end; }
.lmk-bulle {
  font-size: 13px; line-height: 1.6; text-align: left; hyphens: none;
  white-space: pre-wrap; overflow-wrap: anywhere; border-radius: 16px;
}
.lmk-message.assistant .lmk-bulle {
  background: #fff; color: hsl(var(--foreground, 0 0% 7%));
  border: 1px solid hsl(var(--border, 0 0% 90%));
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border-top-left-radius: 4px; padding: 12px 14px;
}
.lmk-message.user .lmk-bulle {
  background: hsl(var(--foreground, 0 0% 7%)); color: hsl(var(--primary-foreground, 0 0% 100%));
  border-top-right-radius: 4px; padding: 10px 14px;
}
.lmk-heure {
  font-size: 9px; font-weight: 500; color: hsl(var(--muted-foreground, 0 0% 45%));
  margin: 0 4px;
}
.lmk-message.assistant.typing .lmk-bulle { padding: 12px 14px; height: 36px; display: flex; align-items: center; }
.lmk-typing-dots { display: flex; gap: 6px; align-items: center; }
.lmk-typing-dots span {
  width: 6px; height: 6px; background: hsl(var(--muted-foreground, 0 0% 45%) / 0.6); border-radius: 50%;
  animation: lmk-typing 1.4s infinite ease-in-out both;
}
.lmk-typing-dots span:nth-child(2) { animation-delay: 0.16s; }
.lmk-typing-dots span:nth-child(3) { animation-delay: 0.32s; }
@keyframes lmk-typing {
  0%, 80%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
}
.lmk-quick-replies { display: flex; flex-wrap: wrap; gap: 6px; margin-left: 4px; flex: none; }
.lmk-quick-reply-btn {
  padding: 4px 10px;
  background: #fff;
  border: 1px solid hsl(var(--border, 0 0% 90%));
  border-radius: 999px;
  font-size: 11px;
  color: hsl(var(--muted-foreground, 0 0% 45%));
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}
.lmk-quick-reply-btn:hover { border-color: hsl(var(--foreground, 0 0% 7%)); color: hsl(var(--foreground, 0 0% 7%)); }
/* Le separateur fin, puis la barre en pilule au contour degrade : le
   degrade est un fond de 1,5 px autour d'une pilule blanche, comme dans la
   reference (from-pink-300 via-purple-200 to-green-200). */
.lmk-block { background: #fff; border-top: 1px solid hsl(var(--border, 0 0% 90%)); padding: 12px; }
.lmk-barre {
  border-radius: 999px; padding: 1.5px;
  background: linear-gradient(to right, #f9a8d4, #e9d5ff, #bbf7d0);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
.lmk-barre-int {
  background: #fff; border-radius: 999px;
  display: flex; align-items: center; gap: 4px; min-width: 0;
  padding: 6px 6px 6px 14px;
}
.lmk-form { display: flex; flex: 1; min-width: 0; }
.lmk-input {
  flex: 1; min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  resize: none;
  color: hsl(var(--foreground, 0 0% 7%));
  caret-color: hsl(var(--foreground, 0 0% 7%));
  font: inherit;
  font-size: 13px;
  line-height: 20px;
  height: 28px;
  padding: 0;
  text-transform: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.lmk-input::placeholder { color: hsl(var(--muted-foreground, 0 0% 45%)); opacity: 1; }
.lmk-input:focus, .lmk-input:focus-visible, .lmk-input:active {
  outline: none; border: none; box-shadow: none; -webkit-appearance: none;
}
.lmk-send-btn {
  width: 28px; height: 28px; min-width: 28px;
  padding: 0; margin: 0;
  border-radius: 50%;
  background: hsl(var(--foreground, 0 0% 7%));
  color: hsl(var(--primary-foreground, 0 0% 100%));
  border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.lmk-send-btn:hover { opacity: 0.85; }
.lmk-send-btn:disabled { cursor: default; opacity: 1; }
.lmk-send-btn svg { width: 12px; height: 12px; }
.lmk-actions-row { display: contents; }
/* Les outils ne se compriment jamais : sur 375 px, deux boutons d'action plus
   le modèle, le micro et l'envoi tiennent juste. Sans ce verrou, l'icône du
   modèle passait de 22 à 19,5 px, écrasée par le flex. Ce sont les pastilles
   qui défilent, pas les outils qui rétrécissent. */
.lmk-right-actions { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
/* Le micro et le telephone : des traits gris, discrets, comme le micro de la
   reference. Le telephone garde son vrai appel (VoiceCallButton). */
.lmk-right-actions .lmk-mic-btn, .lmk-right-actions .lystes-call-btn {
  width: 26px; height: 26px; min-width: 26px; border-radius: 50%;
  background: transparent; border: none; padding: 0; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: hsl(var(--muted-foreground, 0 0% 45%));
  transition: background 0.2s, color 0.2s;
}
.lmk-right-actions .lmk-mic-btn:hover, .lmk-right-actions .lystes-call-btn:hover {
  background: hsl(var(--muted, 0 0% 96%)); color: hsl(var(--foreground, 0 0% 7%));
}
.lmk-right-actions .lmk-mic-btn svg, .lmk-right-actions .lystes-call-btn svg {
  width: 16px; height: 16px; stroke: currentColor;
}
.lmk-right-actions .lystes-call-btn.in-call { background: #ef4444; color: #fff; }
.lmk-right-actions img, .lmk-right-actions svg { flex-shrink: 0; }
.lmk-pills {
  display: flex; align-items: center; gap: 6px; min-width: 0;
  overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none;
}
.lmk-pills::-webkit-scrollbar { width: 0; height: 0; }
/* Le bouton noir du widget. Un seul, comme chez le marchand : « ESSAYER » sur
   une fiche essayable, « Faire un diagnostic » sinon. Valeurs de
   woo-product-chat.js:3496, et sa pastille d'agent de woo-product-chat.js:4352,
   dont le badge en dégradé n'est pas celui du groupe d'avatars. */
.lmk-pill {
  flex: 0 0 auto;
  border: 0px;
  background: #000000;
  color: #ffffff;
  padding: 4px 16px 5px 9px;
  border-radius: 28px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
  text-decoration: none;
}
.lmk-pill-label {
  padding-left: 6px;
  font-size: 7px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  white-space: nowrap;
}
.lmk-pill-vignette { width: 20px; height: 20px; border-radius: 6px; object-fit: cover; display: block; }
.lmk-pill-badge {
  position: absolute; top: -4px; right: -6px;
  background: linear-gradient(135deg,#fce7f3,#eff6ff,#dcfce7);
  color: #111; font-size: 5px; font-weight: 700;
  padding: 1px 3px; border-radius: 12px; line-height: 1;
}
@media (max-width: 480px) {
  .lmk-pill { font-size: 10px; }
  .lmk-pill-label { font-size: 7px; }
}
.lmk-mic-btn.listening { background: #ef4444 !important; color: #fff !important; }
.lmk-modelmini { position: relative; display: inline-flex; align-items: center; }
.lmk-modelmini-btn {
  display: inline-flex; align-items: center; gap: 3px; border: none; cursor: pointer;
  background: transparent; padding: 2px; border-radius: 999px; line-height: 0;
}
.lmk-modelmini-btn img { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; display: block; }
.lmk-modelmini-menu {
  position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
  min-width: 132px; background: rgba(255,255,255,0.95);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  border-radius: 12px; padding: 4px; z-index: 30;
  box-shadow: oklch(0.2 0.02 250 / 0.06) 0 1px 2px 0,
              oklch(0.2 0.02 250 / 0.04) 0 1px 1px 0;
  display: none; flex-direction: column;
}
.lmk-modelmini-menu.on { display: flex; }
.lmk-modelmini-menu button {
  display: flex; align-items: center; gap: 7px; border: none; cursor: pointer;
  background: transparent; padding: 7px 9px; border-radius: 9px;
  font: 500 13px -apple-system, BlinkMacSystemFont, sans-serif; color: #1b1b1e;
  width: 100%; text-align: left;
}
.lmk-modelmini-menu button:hover { background: rgba(0,0,0,0.05); }
.lmk-modelmini-menu button img { width: 16px; height: 16px; border-radius: 50%; }
.lmk-modelmini-menu button[aria-checked="true"]::after {
  content: '✓'; margin-left: auto; font-size: 11px; color: #6d6d73;
}
@media (prefers-reduced-motion: reduce) {
  .lmk-typing-dots span { animation: none; }
}
`;

/**
 * Le bouton noir change de nature selon ce que vend la boutique.
 *
 * Consigne de JP, 12/08/2026 : « comme c'est une boutique de perruques il doit
 * avoir un bouton essayage, si c'était une marque cosmétique ce serait un bouton
 * cosmétique ». C'est déjà la logique du widget, qui bascule entre ESSAYER et
 * « Faire un diagnostic » selon que la fiche est essayable.
 *
 * On lit `features.hasTryOn` et `hasDiagnostic` de `sector-config.ts`, la même
 * source que le reste du produit, plutôt qu'une liste de secteurs recopiée ici.
 * Deux listes qui divergent, c'est une boutique de perruques qui se voit
 * proposer un diagnostic de peau.
 */
function actionDuSecteur(secteur: string | null | undefined): { label: string; intention: string } {
  const canonique = resolveSectorKey(secteur);
  if (canonique && vendDesPrestations(canonique)) {
    return { label: "Prendre rendez-vous", intention: "Je voudrais prendre rendez-vous." };
  }
  if (canonique) {
    try {
      const config = getSectorConfig(canonique as Parameters<typeof getSectorConfig>[0]);
      if (config?.features?.hasTryOn) {
        return { label: "Essayer un modèle", intention: "Je voudrais essayer un modèle." };
      }
      if (config?.features?.hasDiagnostic) {
        return { label: "Faire un diagnostic", intention: "Je voudrais faire un diagnostic." };
      }
    } catch {
      /* secteur connu du résolveur mais absent de la configuration : on tombe
         sur le libellé neutre plutôt que de ne rien afficher */
    }
  }
  return { label: "Être conseillé", intention: "Que me conseillez-vous ?" };
}

/**
 * Le libellé du bouton flottant posé chez les clients.
 *
 * `get-widget-config` lit ses paramètres dans la chaîne de requête, pas dans le
 * corps : `supabase.functions.invoke` ne convient donc pas, il envoie un POST
 * avec un corps JSON. On appelle l'adresse directement.
 *
 * Ne lève jamais : sans réponse, on retombe sur le libellé déduit du secteur.
 */
async function chargerLibelleFlottant(accountId: string): Promise<string | null> {
  const base = LYSTES_ENV.VITE_SUPABASE_URL;
  if (!base) return null;
  try {
    const reponse = await fetch(
      `${base}/functions/v1/get-widget-config?account_id=${encodeURIComponent(accountId)}`,
    );
    if (!reponse.ok) return null;
    const donnees = (await reponse.json()) as { labels?: Record<string, string> };
    const l = donnees?.labels;
    return l?.floatingButtonLabel || l?.floatingButtonLabelShort || l?.ctaPrimary || null;
  } catch {
    return null;
  }
}

/* Les deux modèles proposés au visiteur, mêmes icônes que le widget. */
const MODELES = [
  { nom: "Claude", icone: "https://lystes.ai/iconeai2.png" },
  { nom: "ChatGPT", icone: "https://lystes.ai/iconeai1.png" },
] as const;
const CLE_MODELE = "lystes_model";

/* Masqués le 11/10/2026, demande de JP : « Je ne sais pas pourquoi dans le
   formulaire de contact tu rajoutes un bouton diagnostic, et le choix des LLM
   dans les chats : pas enlever, mais cache-le pour le moment. »
   Le code reste en place : passer le drapeau à `true` les réaffiche.
   - AFFICHER_CHOIX_MODELE : l'icône du modèle et son chevron, à côté du micro.
     Sans lui, le modèle retenu (stockage local ou Claude par défaut) répond.
   - AFFICHER_ACTION_EN_CONTACT : le bouton noir du secteur (« Faire un
     diagnostic »…) dans le chat qui suit le formulaire de contact. */
export const AFFICHER_CHOIX_MODELE = false;
export const AFFICHER_ACTION_EN_CONTACT = false;
/** Le bouton noir du secteur dans la barre de saisie, masqué le 12/10/2026. */
export const AFFICHER_ACTION_DANS_BARRE = false;

export function BrandAdvisorChatCard({
  accountId,
  brandName,
  logoUrl,
  vignetteUrl,
  premierMessage,
  contact,
  contactEnAttente,
  integre,
  onStatut,
  demo,
  onDisponible,
}: Props) {
  const { t, i18n } = useTranslation();
  /* Le mode contact s'active par la seule présence de la prop, même à null. */
  const modeContact = contact !== undefined;
  const messageTransmis = t(
    "contactPage.messageTransmis",
    "Votre message est bien transmis à {{marque}}, qui vous recontactera.",
    { marque: brandName },
  );
  const [secteur, setSecteur] = useState<string | null>(null);
  const [libelleFlottant, setLibelleFlottant] = useState<string | null>(null);
  const [dictee, setDictee] = useState(false);
  const reconnaissanceRef = useRef<{ stop: () => void } | null>(null);
  const [modele, setModele] = useState<string>(() => {
    try {
      return localStorage.getItem(CLE_MODELE) || MODELES[0].nom;
    } catch {
      return MODELES[0].nom;
    }
  });
  const [menuModele, setMenuModele] = useState(false);
  const [agent, setAgent] = useState<AgentMeta | null>(demo ? demo.agent : null);
  const [indisponible, setIndisponible] = useState(false);
  /* En mode contact, la première bulle est le message du formulaire, posée
     tout de suite : la cliente voit qu'il est parti pendant qu'il s'enregistre. */
  const [messages, setMessages] = useState<Msg[]>(() =>
    modeContact && premierMessage?.trim() ? [{ role: "user", content: premierMessage.trim() }] : [],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  /** Mode contact : le message du formulaire a été confié au conseiller. */
  const [premierLance, setPremierLance] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const heuresRef = useRef<string[]>([]);

  /* La bascule logo vers produit, en fondu. Un changement d'image sec fait
     sauter l'avatar, et c'est exactement le genre de défaut qui se voit. */
  const vignetteVoulue = vignetteUrl || agent?.logo_url || logoUrl || null;
  const [vignetteAffichee, setVignetteAffichee] = useState<string | null>(null);
  const [vignetteVisible, setVignetteVisible] = useState(true);

  useEffect(() => {
    if (vignetteVoulue === vignetteAffichee) return;
    if (vignetteAffichee === null) {
      setVignetteAffichee(vignetteVoulue);
      return;
    }
    setVignetteVisible(false);
    const t = setTimeout(() => {
      setVignetteAffichee(vignetteVoulue);
      setVignetteVisible(true);
    }, 160);
    return () => clearTimeout(t);
  }, [vignetteVoulue, vignetteAffichee]);

  useEffect(() => {
    if (demo) return;
    let annule = false;
    supabase.functions
      .invoke("conseiller-boutique-chat", { body: { account_id: accountId, mode: "init" } })
      .then(({ data, error }) => {
        if (annule) return;
        if (error || !data?.agent) {
          setIndisponible(true);
          onDisponible?.(false);
          return;
        }
        setAgent(data.agent);
        onDisponible?.(true);
        /* Le secteur arrive avec l'agent : le visiteur n'étant pas connecté,
           une lecture directe de `accounts` depuis le navigateur ne rend rien,
           la politique d'accès la refuse. C'est la panne qui affichait « Être
           conseillé » chez un perruquier au lieu de « Essayer un modèle ». */
        if (typeof data.secteur === "string") setSecteur(data.secteur);
        /* Le libellé du bouton noir vient de la MÊME source que les boutons
           flottants posés chez les clients : `get-widget-config`, qui rend les
           libellés du type d'agent. Consigne de JP le 12/08 : « le call to
           action est le même que ceux des sites en fonction du secteur, je
           parle des boutons flottants ». Recopier une table de libellés ici
           garantissait qu'elle divergerait de celle des sites. */
        void chargerLibelleFlottant(accountId).then((l) => {
          if (!annule && l) setLibelleFlottant(l);
        });
        /* Mode contact : ni accueil ni suggestions, la conversation part du
           message du formulaire. */
        if (modeContact) return;
        setMessages([
          {
            role: "assistant",
            content:
              data.agent.initial_message ||
              `Bonjour, je suis ${data.agent.name} ${deMarque(brandName)}. Que cherchez-vous aujourd'hui ?`,
          },
        ]);
      })
      .catch(() => {
        if (annule) return;
        setIndisponible(true);
        onDisponible?.(false);
      });
    return () => {
      annule = true;
    };
    // modeContact ne change pas pendant la vie de la carte.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, brandName]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, demo?.messages.length, demo?.enAttente]);

  /* La dictée, par la reconnaissance vocale du navigateur. Absente sur Firefox
     et sur les vieux Safari : on n'affiche pas un bouton qui ne fera rien. */
  const dicteeDisponible =
    typeof window !== "undefined" &&
    Boolean(
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
        (window as unknown as Record<string, unknown>).webkitSpeechRecognition,
    );

  const basculerDictee = () => {
    if (!dicteeDisponible) return;
    if (dictee) {
      reconnaissanceRef.current?.stop();
      setDictee(false);
      return;
    }
    const Moteur = ((window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>)
        .webkitSpeechRecognition) as new () => Record<string, unknown>;
    const moteur = new Moteur() as Record<string, unknown> & { start: () => void; stop: () => void };
    moteur.lang = "fr-FR";
    moteur.interimResults = false;
    moteur.onresult = (e: { results: Array<Array<{ transcript: string }>> }) => {
      const dit = e.results?.[0]?.[0]?.transcript;
      if (dit) setInput((v) => (v ? `${v} ${dit}` : dit));
    };
    moteur.onend = () => setDictee(false);
    moteur.onerror = () => setDictee(false);
    reconnaissanceRef.current = moteur;
    moteur.start();
    setDictee(true);
  };

  /**
   * Mode contact : le serveur relit l'historique en base, vérifie le jeton et
   * décide du statut. On n'envoie donc que le dernier message, jamais `history`.
   */
  const envoyerContact = async (text: string, dejaAffiche: boolean) => {
    if (!contact) return;
    if (!dejaAffiche) {
      setMessages((m) => [...m, { role: "user", content: text }]);
      setInput("");
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("conseiller-boutique-chat", {
        body: {
          account_id: accountId,
          mode: "contact",
          contact_id: contact.id,
          jeton: contact.jeton,
          message: text,
        },
      });
      if (error) throw error;
      const r = (data ?? {}) as ReponseContact;
      const reponse = typeof r.reply === "string" && r.reply.trim() ? r.reply.trim() : messageTransmis;
      const manque = lireManque(r.manque);
      /* Tout ce qui n'est pas « repondu » en toutes lettres reste à recontacter :
         le repli sûr, comme côté serveur. */
      const statut = r.statut === "repondu" && manque.length === 0 ? "repondu" : "a_recontacter";
      setMessages((m) => [...m, { role: "assistant", content: reponse }]);
      onStatut?.({ statut, manque });
    } catch {
      /* Limite atteinte, jeton expiré, chat en panne : le message est déjà
         enregistré côté serveur, on le dit sans inventer de réponse. */
      setMessages((m) => [...m, { role: "assistant", content: messageTransmis }]);
      onStatut?.({ statut: "a_recontacter", manque: [] });
    } finally {
      setLoading(false);
    }
  };

  const envoyer = async (texte?: string) => {
    if (demo) return;
    const text = (texte ?? input).trim();
    if (modeContact) {
      if (!text || loading || !contact || !premierLance) return;
      await envoyerContact(text, false);
      return;
    }
    if (!text || loading || !agent) return;
    const suite: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(suite);
    setInput("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("conseiller-boutique-chat", {
        body: { account_id: accountId, message: text, history: suite.slice(0, -1), langue: i18n.resolvedLanguage || i18n.language },
      });
      if (error) throw error;
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data?.reply || "Pouvez-vous reformuler ?" },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Je rencontre un souci technique. Réessayez dans un instant." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const premierEnvoye = useRef(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (modeContact) return;
    if (!premierMessage || premierEnvoye.current || !agent || messages.length !== 1) return;
    premierEnvoye.current = true;
    void envoyer(premierMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent, messages.length, premierMessage]);

  /* Mode contact : le message du formulaire part dès que le contact est
     enregistré et que la carte sait qui répond. Si la carte d'accueil n'a pas
     répondu, on part quand même : le serveur n'a besoin que du jeton. */
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (!modeContact || premierLance || !contact) return;
    if (!agent && !indisponible) return;
    const texte = premierMessage?.trim();
    if (!texte) return;
    setPremierLance(true);
    void envoyerContact(texte, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modeContact, premierLance, contact, agent, indisponible, premierMessage]);

  if (!modeContact && (indisponible || !agent)) return null;

  /* Le libellé des boutons flottants fait autorité ; le secteur ne sert que de
     filet quand la configuration du widget n'a pas répondu. */
  const parDefaut = actionDuSecteur(secteur);
  const action = { label: demo?.libelleAction || libelleFlottant || parDefaut.label, intention: parDefaut.intention };
  /* En démonstration, les bulles et l'attente sont celles que la visite fournit. */
  const bulles = demo ? demo.messages : messages;
  const attente = demo
    ? Boolean(demo.enAttente)
    : loading || (modeContact && !premierLance) || (contactEnAttente && !contact);
  const suggestions = ["Que me conseillez-vous ?", "Vos meilleures ventes ?", action.label];

  /* L'heure sous chaque bulle, comme la reference : posee au premier affichage
     de la bulle, puis figee. */
  const maintenant = () =>
    new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const heures = heuresRef.current;
  for (let i = heures.length; i < bulles.length; i++) heures.push(maintenant());
  const avatarTete = vignetteAffichee || MODELES.find((m) => m.nom === modele)?.icone || null;

  return (
    <section className="mb-8 text-left min-w-0 overflow-hidden">
      <style>{STYLE}</style>

      {/* La carte reprend le bloc de conversation de l'accueil (AnimatedChat,
          au-dessus de « Équipe IA de conseillers produit ») : blanche, bordée,
          sans zone grise. Demande de JP du 12/10/2026. */}
      <div className="lmk-carte">
        {/* En-tête minimal : la vignette et le nom du conseiller en casse
            normale, son rôle en gris dessous. Le téléphone est descendu dans
            la barre de saisie, à côté du micro. */}
        <div className="lmk-head">
          {avatarTete && (
            <img
              className="lmk-head-avatar"
              src={avatarTete}
              alt=""
              style={{ opacity: vignetteVisible ? 1 : 0, transition: "opacity 0.16s ease" }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <div className="lmk-head-texte">
            <span className="lmk-head-nom">{agent?.name || brandName}</span>
            <span className="lmk-head-role">
              {/* Le nom de l'agent porte souvent déjà la marque (« Conseiller
                  Éclose Paris ») : on ne la répète pas dessous. */}
              {(agent?.name || brandName).includes(brandName) ? "Conseiller IA" : `Conseiller IA ${deMarque(brandName)}`}
            </span>
          </div>
        </div>

        <div className="lmk-container">
          <div ref={scrollRef} className="lmk-messages">
            {bulles.map((m, i) => (
              <div key={i} className={`lmk-message ${m.role}`}>
                <div className="lmk-bulle">{m.content}</div>
                <span className="lmk-heure">{heures[i]}</span>
              </div>
            ))}
            {attente && (
              <div
                className="lmk-message assistant typing"
                role="status"
                aria-label={t("contactPage.enAttente", "Le conseiller prépare sa réponse")}
              >
                <div className="lmk-bulle">
                  <span className="lmk-typing-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
              </div>
            )}
            {!modeContact && bulles.length <= 1 && !attente && (
              <div className="lmk-quick-replies">
                {suggestions.map((s) => (
                  <button key={s} type="button" className="lmk-quick-reply-btn" onClick={() => envoyer(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Le séparateur fin, puis la barre en pilule au contour dégradé. */}
          <div className="lmk-block">
            <div className="lmk-barre">
              <div className="lmk-barre-int">
                <form
                  id="lmk-chat-form"
                  className="lmk-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void envoyer();
                  }}
                >
                  <input
                    className="lmk-input"
                    type="text"
                    enterKeyHint="send"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void envoyer();
                      }
                    }}
                    placeholder={
                      modeContact
                        ? t("contactPage.placeholderCourt", "Votre réponse…")
                        : "Votre question…"
                    }
                    aria-label={modeContact ? t("contactPage.champChat", "Votre réponse au conseiller") : undefined}
                    disabled={loading || (modeContact && !premierLance)}
                  />
                </form>

                {/* Le bouton noir du secteur (« Faire un diagnostic »…) n'est plus
                    dans la barre : JP, 12/10/2026, « bien sûr sans le bouton faire un
                    diagnostic ». Code gardé, drapeau AFFICHER_ACTION_DANS_BARRE. */}
                <div className="lmk-actions-row">
                  {AFFICHER_ACTION_DANS_BARRE && (!modeContact || AFFICHER_ACTION_EN_CONTACT) && (
                  <div className="lmk-pills">
                    <button type="button" className="lmk-pill" onClick={() => void envoyer(action.intention)}>
                      <span style={{ display: "inline-flex", alignItems: "center", paddingLeft: 2 }}>
                        <span style={{ position: "relative", display: "inline-block", lineHeight: 0 }}>
                          {avatarTete ? (
                            <img src={avatarTete} alt="" className="lmk-pill-vignette" />
                          ) : (
                            <span className="lmk-pill-vignette" style={{ background: "#333" }} />
                          )}
                          <span className="lmk-pill-badge">IA</span>
                        </span>
                      </span>
                      <span className="lmk-pill-label">{action.label}</span>
                    </button>
                  </div>
                  )}

                  <div className="lmk-right-actions">
                    {/* Le choix du modèle, comme dans le widget : icône ronde de 22 px
                        et chevron, menu au-dessus. Le choix est retenu d'une visite à
                        l'autre dans le même stockage local que le widget. */}
                    {AFFICHER_CHOIX_MODELE && (
                    <div className="lmk-modelmini">
                      <button
                        type="button"
                        className="lmk-modelmini-btn"
                        aria-haspopup="true"
                        aria-expanded={menuModele}
                        title="Modèle"
                        onClick={() => setMenuModele((v) => !v)}
                      >
                        <img src={MODELES.find((m) => m.nom === modele)?.icone} alt="" />
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 10 10"
                          fill="none"
                          stroke="#8a8a90"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2 4l3 3 3-3" />
                        </svg>
                      </button>
                      <div className={`lmk-modelmini-menu${menuModele ? " on" : ""}`} role="menu">
                        {MODELES.map((m) => (
                          <button
                            key={m.nom}
                            type="button"
                            role="menuitemradio"
                            aria-checked={modele === m.nom}
                            onClick={() => {
                              setModele(m.nom);
                              setMenuModele(false);
                              try {
                                localStorage.setItem(CLE_MODELE, m.nom);
                              } catch {
                                /* navigation privée : le choix vaut pour cette visite */
                              }
                            }}
                          >
                            <img src={m.icone} alt="" />
                            {m.nom}
                          </button>
                        ))}
                      </div>
                    </div>
                    )}

                    {dicteeDisponible && (
                    <button
                      type="button"
                      className={`lmk-mic-btn${dictee ? " listening" : ""}`}
                      onClick={basculerDictee}
                      aria-label="Dicter"
                      title="Dicter"
                    >
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                      </svg>
                    </button>
                    )}
                    {/* Le téléphone appelle vraiment, l'agent vocal reçoit le
                        contexte de la marque. Pas dans un iframe : le micro y est
                        interdit. */}
                    {agent && !integre && (
                      <VoiceCallButton
                        renderAs="widget-icon"
                        assistantName={agent.name}
                        language="fr"
                        contextPrompt={`Tu es ${agent.name}, conseiller de la boutique ${brandName}. Tu connais tout son catalogue.`}
                        firstMessage={`Bonjour, je suis ${agent.name} ${deMarque(brandName)}. Que cherchez-vous ?`}
                      />
                    )}
                    <button
                      type="submit"
                      form="lmk-chat-form"
                      className="lmk-send-btn"
                      disabled={loading || !input.trim() || (modeContact && !premierLance)}
                      aria-label="Envoyer"
                    >
                      <ArrowUp strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
