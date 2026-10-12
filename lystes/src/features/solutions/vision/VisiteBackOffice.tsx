import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Bell,
  BookOpenText,
  Bot,
  BrainCircuit,
  Calendar,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronsUpDown,
  ClipboardList,
  Compass,
  Flame,
  Globe,
  House,
  LayoutGrid,
  Lightbulb,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Package,
  PanelLeft,
  Plus,
  Route,
  Sparkles,
  TrendingUp,
  Users,
  Users2,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import "@lystes/styles/booking-kit.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lystes/components/ui/tabs";
import { Button } from "@lystes/components/ui/button";
import { ScrollArea } from "@lystes/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lystes/components/ui/select";
import { CarteProfilCreatif } from "@lystes/components/mygpt/CarteProfilCreatif";
import { CarteProfilEditorial } from "@lystes/components/mygpt/CarteProfilEditorial";
import { PanneauMagazines } from "@lystes/components/cowork/PanneauxAnnuaires";
import { PanneauComptable } from "@lystes/components/cowork/PanneauComptable";
import { GRIS, Ligne, Panneau, TitreBloc, Trait } from "@lystes/features/social/ui";
import { TEAM_AVATARS } from "@lystes/utils/illustratedAvatars";
import { DISCIPLINES, type DisciplineConfig, type DisciplineCreative } from "@lystes/features/ai-photographers/constants/disciplines";
import { photographesDe, profilsOrdonnes } from "@lystes/features/ai-photographers/constants/photographers";
import { casesPleines, estComplet, modeleComplet } from "@lystes/features/ai-photographers/profilsComplets";
import type { AIPhotographer } from "@lystes/features/ai-photographers/types";
import { GRAPHISTES } from "@lystes/features/ai-graphistes/constants/graphistes";
import type { AIGraphiste } from "@lystes/features/ai-graphistes/types";
import {
  AGE_RANGE_OPTIONS,
  ETHNICITY_OPTIONS,
  GENDER_OPTIONS,
  libelleGenre,
  useStudioModels,
  type StudioModel,
} from "@lystes/features/creative-studio-photo/hooks/useStudioModels";
import { CadreReproduit } from "./CadreReproduit";
import { VueAnalystes, VueCommunity, VueCopilote } from "./VuesGestion";
import {
  DUREE_ETAPE,
  ECRAN_BOUTIQUE,
  Encart,
  type Agent,
  type Pied,
  type Pointe,
  type TailleCadre,
} from "../VisionEtages";

/**
 * Étage 3, « Votre entreprise » : la visite du back-office (10/10/2026, JP).
 *
 * JP : « tu reproduis à la perfection les community managers, les différents
 * postes qui sont dans le back-office », pour dire qu'on recrute des
 * community managers, des photographes, des graphistes… et qu'ils connaissent
 * tous l'avatar client et les préoccupations des clientes. « Et il y a aussi ce
 * type de listing pour l'aspect marketing. Et parcourir pour montrer votre
 * réseau de magazines. »
 *
 * Même mécanique que la boutique de l'étage 2 : l'écran est rendu à la taille
 * d'un écran d'ordinateur (ECRAN_BOUTIQUE), puis réduit à la largeur du cadre.
 * Chaque étape change d'écran. L'écran est rendu dans un cadre de même
 * origine (CadreReproduit) : rendu dans l'accueil, il prenait ses règles
 * (titres à 58 px en graisse 300, noms des cartes en 300) et, sur téléphone,
 * les tailles réduites d'index.css (relectures du 10/10).
 *
 * D'où vient chaque morceau :
 *   - Le décor : la latérale Cowork (AdminLayout, WorkspacePackSwitcher,
 *     CoworkConversationsNav, MerchantToolsLauncher) et la barre haute,
 *     recopiées : les vraies dépendent du compte connecté.
 *   - Étapes 1 et 2 : la page /dashboard/copilote (CopilotePage), onglet
 *     « Le cap » : balisage et classes recopiés, chiffres de la marque de
 *     démonstration Lystes & Partners (la vraie page lit le compte).
 *   - Étapes 3 à 6 : la fenêtre « Choisir qui shoote » de
 *     src/components/mygpt/CoworkStudioBar.tsx (balisage et classes recopiés,
 *     elle lit la base). Ses cartes sont la vraie CarteProfilCreatif, nourrie
 *     des vrais profils (photographers.ts, graphistes.ts) et des modèles du
 *     catalogue (`studio_models`, lu par le vrai crochet useStudioModels, en
 *     lecture seule). Profils finis seulement (profilsComplets.ts).
 *   - Étape 7 : la page /dashboard/agences-marketing-ia (CreateursUgcPage) :
 *     en-tête du métier, la carte « Créer mon … », puis les vraies fiches
 *     CarteProfilEditorial (agences-marketing.ts).
 *   - Étape 8 : la fenêtre Cowork « Paraître dans un magazine »
 *     (CoworkOutils), avec le vrai PanneauMagazines et son catalogue presse
 *     (magazines-presse.ts).
 *   - Étape 9 : la fenêtre Cowork « Gestion fiscale et comptable », avec le
 *     vrai PanneauComptable.
 *
 * Rien n'est cliquable dans l'écran (inert) : aucune sélection, aucune
 * séance, aucun envoi. Le point et l'encart restent au-dessus, vivants.
 */

/* ---------- Les étapes ---------- */

type Onglet = "community" | "photographes" | "graphistes" | "ugc";
type Ecran = "point-de-vente" | "evenementiel" | "copilote" | "copilote-chat" | "community-feed" | "analystes" | "modale" | "marketing" | "magazines" | "comptable";

/* Ce que l'étape montre, et à quelle échelle (JP, 11/10 : « fais des dézooms
   pour qu'on voie mieux », « je ne veux pas de trucs coupés » ; relecture du
   même jour : aucun texte sous ~9 px à l'écran). La vue est exactement la
   zone décrite ici, réduite : rien d'autre n'entre dans le champ, donc rien
   n'y entre tranché.
   - ecran : la largeur de l'écran rendu (1280 par défaut). Plus étroit, la
     page se met en page comme sur un petit ordinateur ou un téléphone, avec
     ses propres règles (le Copilote passe ses chiffres en 2 × 2).
   - cible : le rang de la carte visée dans la grille (0 = la carte
     « Créer mon … »), ou le sélecteur de l'élément visé ; `sous` : la partie
     de la cible montrée (la colonne de gauche d'une fiche d'agence).
   - rangee : la vue prend toute la rangée de la cible, dans la largeur de
     la grille ; `haut` : la vue remonte jusqu'à cet élément (le titre de la
     fenêtre, le chemin chiffré). */
type Cadrage = {
  ecran?: number;
  cible: number | string;
  sous?: string;
  rangee?: boolean;
  haut?: string;
  /* Avec `rangee` : le nombre de rangées montrées (1 par défaut). */
  rangees?: number;
  /* Les cibles parcourues l'une après l'autre pendant l'étape, à la place
     de `cible` (JP, 12/10 : « plus de magazines dans l'animation »). */
  suite?: number[];
};
type EtapeBO = { ecran: Ecran; onglet?: Onglet; ordi: Cadrage; tel: Cadrage };


/* Les postes, dans l'ordre de la visite, chacun avec son étape. mission : la
   ligne courte de la liste ; role et unique : l'encart.
   11/10/2026 (JP) : l'onglet devient « Votre gestion » ; le Copilote, son
   plan d'action et l'expert-comptable rejoignent la visite. L'agence SEO et
   GEO en sort : aucun de ses profils n'a encore de portfolio, et seuls les
   profils finis se montrent (profilsComplets.ts). */
const POSTES: { agent: Agent; etape: EtapeBO; montre?: boolean }[] = [
  {
    agent: {
      nom: "Copilote IA",
      mission: "comme ChatGPT, mais il connaît déjà votre marque",
      role: "Répondre à vos questions et vous conseiller comme ChatGPT ou Claude, sans que vous ayez à lui expliquer votre entreprise.",
      unique: "Il connaît déjà vos conversations, avis, ventes, prix, visites et leur provenance, et l’avatar client tiré de vos diagnostics. Ses conseils sont plus pertinents que ceux d’une IA qui ne connaît pas vos clients.",
    },
    etape: {
      ecran: "copilote-chat",
      ordi: { ecran: 960, cible: "[data-gestion-vue]" },
      tel: { ecran: 380, cible: "[data-gestion-vue]" },
    },
  },
  {
    agent: {
      nom: "Plan d’action IA",
      mission: "le plan pour vendre plus, tiré de vos données",
      role: "Établir un plan d’action pour maximiser vos ventes, à partir des préoccupations de vos clients et de vos métriques.",
      unique: "Chaque action part d’un constat mesuré chez vous, comme un panier abandonné ou une question sans réponse, et porte son gain estimé.",
    },
    etape: {
      ecran: "copilote",
      ordi: { ecran: 1000, cible: "[data-lyv-e-leviers]", haut: "[data-lyv-e-chemin]" },
      tel: { ecran: 710, cible: "[data-lyv-e-leviers]" },
    },
  },
  /* 12/10/2026 (JP) : la gestion des points de vente et des événements.
     Leurs écrans reprennent tels quels le visuel et le texte des sections
     « Équipe IA point de vente » et « Équipe IA événementielle » du site
     (point-de-vente-page.tmpl.html, comment-ca-marche-page.tmpl.html). */
  {
    agent: {
      nom: "Équipe IA point de vente",
      mission: "un vendeur IA derrière chaque produit, en rayon",
      role: "Conseiller vos clients en magasin grâce à un QR code sur l’étiquette : conseils, comparatifs et avis, produit par produit.",
      unique: "Le client obtient une réponse experte, même sans vendeur disponible. Vous découvrez enfin ce qui se dit chez vos distributeurs, région par région.",
      elle: true,
    },
    etape: {
      ecran: "point-de-vente",
      ordi: { ecran: 760, cible: "[data-lyv-e-terrain]" },
      tel: { ecran: 760, cible: "[data-lyv-e-media]" },
    },
  },
  {
    agent: {
      nom: "Équipe IA événementiel",
      mission: "un conseil pour chaque visiteur, même dans la foule",
      role: "Offrir à chaque visiteur de vos événements un diagnostic, un essayage ou un conseil, même quand il y a foule.",
      unique: "Vous repartez avec des leads qualifiés et de la data. Chaque invité garde un assistant qui se souvient de ses préférences.",
      elle: true,
    },
    etape: {
      ecran: "evenementiel",
      ordi: { ecran: 760, cible: "[data-lyv-e-terrain]" },
      tel: { ecran: 760, cible: "[data-lyv-e-media]" },
    },
  },
  {
    agent: {
      nom: "Photographe IA",
      mission: "des photos dans votre univers, sans shooting",
      role: "Créer les photos de vos produits dans l’univers que vous choisissez, adaptées à chaque usage : fiche produit, réseaux, publicité.",
      unique: "Un rendu aussi réaliste que celui d’un photographe, pour beaucoup moins cher qu’un shooting. Il lit le portrait de votre cliente avant chaque séance.",
    },
    /* Camille, la photographe packshot d'origine de /shot. */
    etape: {
      ecran: "modale",
      onglet: "photographes",
      ordi: { cible: 1, rangee: true, haut: ".lyv-e-modale h2" },
      tel: { cible: 1 },
    },
  },
  {
    agent: {
      nom: "Réseau de magazines",
      mission: "votre marque dans Vogue, Marie Claire, Madame Figaro…",
      role: "Asseoir la réputation de votre marque dans votre secteur grâce à un article dans un magazine connu.",
      unique: "Chaque titre affiche son prix d’avance et sa fiche d’audience. Vous gagnez du temps, sans démarcher les rédactions une à une.",
    },
    /* JP, 12/10 : « plus de magazines dans l'animation ». Sur ordinateur,
       deux rangées à la fois, et la vue descend tout le catalogue presse en
       trois temps (Vogue, puis Madame Figaro, puis Marie Claire en tête de
       rangée) ; au téléphone, une carte à la fois : Vogue, Madame Figaro,
       Marie Claire. */
    etape: {
      ecran: "magazines",
      ordi: { cible: 0, suite: [0, 6, 12], rangee: true, rangees: 2, haut: ".lyv-e-modale-presse h2" },
      tel: { cible: 0, suite: [0, 8, 12] },
    },
  },
  {
    agent: {
      nom: "Community managers IA",
      mission: "vos réseaux tenus, sans y passer vos journées",
      role: "Tenir votre Instagram et vos autres réseaux pour vous faire gagner du temps, sans rien perdre en qualité.",
      unique: "Des visuels vraiment professionnels, et des sujets tirés des préoccupations relevées dans vos conversations.",
      elle: true,
    },
    etape: {
      ecran: "community-feed",
      ordi: { ecran: 1040, cible: "[data-gestion-vue]" },
      tel: { ecran: 380, cible: "[data-gestion-vue]" },
    },
  },
  /* 11/10/2026 (JP) : le Créateur UGC passe devant le Photographe dans la
     visite « Votre gestion » ; l'ordre des écrans de la fenêtre ne bouge pas. */
  {
    agent: {
      nom: "Créateur UGC IA",
      mission: "du contenu à votre image : sport, lifestyle, produit",
      role: "Créer des contenus UGC adaptés à votre secteur et à votre univers, du sport au lifestyle en passant par la mise en avant du produit.",
      unique: "Le modèle à l’écran ressemble à votre avatar client, et chaque scène répond à un doute entendu dans vos échanges.",
    },
    etape: {
      ecran: "modale",
      onglet: "ugc",
      ordi: { cible: 4, rangee: true, haut: ".lyv-e-modale h2" },
      tel: { cible: 4 },
    },
  },
  {
    agent: {
      nom: "Graphiste IA",
      mission: "affiches, infographies, visuels annotés",
      role: "Créer vos visuels de marque, affiches, infographies et visuels annotés de produit, dans votre charte graphique.",
      unique: "Les bénéfices écrits sur l’image sont ceux que vos clientes cherchent, d’après leurs questions dans le chat.",
    },
    /* Céline, branding cosmétiques : la seule graphiste au portfolio complet. */
    /* Masqué le 11/10/2026 (demande de JP) : le Graphiste IA sort de la
       visite « Votre gestion » pour le moment. Le poste, son écran et son
       contenu restent écrits ; retirer « montre: false » le remet en place. */
    montre: false,
    etape: {
      ecran: "modale",
      onglet: "graphistes",
      ordi: { cible: 1, rangee: true, haut: ".lyv-e-modale h2" },
      tel: { cible: 1 },
    },
  },
  {
    agent: {
      nom: "Marketing IA",
      mission: "stratégie, campagnes et publicités",
      role: "Bâtir votre stratégie et vos campagnes, publicités et calendrier compris, à partir des préoccupations de vos clients et de vos données.",
      unique: "Ses accroches répondent aux objections relevées avant l’achat. Vos publicités et vos posts tiennent le même discours.",
    },
    /* Nova, le packshot annoté : la colonne de sa fiche et ses neuf
       créatives ; sa semaine, vide sans compte, reste hors champ. */
    /* Masquée le 11/10/2026 (demande de JP) : « Agence marketing IA » sort de
       la visite « Votre gestion ». Le poste, son écran et ses créatives
       restent écrits ; « montre: false » les remet en place. */
    montre: false,
    etape: {
      ecran: "marketing",
      ordi: { cible: 1, sous: ":scope > section" },
      tel: { cible: 1, sous: ":scope > section" },
    },
  },
  /* La fenêtre « Paraître dans un magazine » : ses textes disent ce qu'elle
     montre (MagazinesPage, magazines-presse.ts, FicheMagazine). */
  {
    agent: {
      nom: "Data analysts IA",
      mission: "ce que disent vos clients, et où ils bloquent",
      role: "Lire vos conversations pour comprendre les préoccupations de vos clients et les points de friction qui freinent l’achat.",
      unique: "Il s’appuie sur les données de votre compte et n’invente aucun résultat. Il vous dit quels sujets reviennent, et sur quels produits.",
    },
    etape: {
      ecran: "analystes",
      ordi: { ecran: 1000, cible: "[data-gestion-vue]" },
      tel: { ecran: 380, cible: "[data-gestion-vue]" },
    },
  },
  /* La fenêtre « Gestion fiscale et comptable » du Cowork (PanneauComptable).
     Au téléphone, la fenêtre a la largeur d'un téléphone et passe en une
     colonne, comme dans l'application ; l'écran garde 860 px, au-dessus du
     seuil où index.css réduit les textes. */
  {
    agent: {
      nom: "Expert-comptable",
      mission: "une vraie comptabilité, quand votre marque grandit",
      role: "Passé un certain chiffre d’affaires, tenir une vraie comptabilité pour franchir une étape : optimiser vos impôts, protéger votre marque à l’INPI, pérenniser la gestion.",
      unique: "Vous cochez les prestations utiles et prenez rendez-vous depuis votre espace, avec un cabinet qui suit les marques en ligne.",
    },
    etape: {
      ecran: "comptable",
      ordi: { cible: ".lyv-e-modale-compta" },
      tel: { ecran: 860, cible: ".lyv-e-modale-compta" },
    },
  },
];

/* Les community managers montrés sous l'onglet « Agences de communication
   IA » : de vraies agences, finies. Les photographes que le catalogue
   classe aussi en community managers (Luna « Photo Lunettes », Yuki, Elena)
   n'y apparaissent pas (relecture du 11/10). Tant qu'aucune agence n'a son
   portfolio, l'étape reste hors de la visite ; elle revient seule dès qu'il
   existe. */
const estPhotographe = (ph: AIPhotographer) => /^photo\b/i.test(ph.type ?? "");
const COMMUNITY_FINIS = profilsOrdonnes("community").filter((ph) => estComplet(ph) && !estPhotographe(ph));
for (const p of POSTES) if (p.etape.onglet === "community") p.montre = COMMUNITY_FINIS.length > 0;
const POSTES_MONTRES = POSTES.filter((p) => p.montre !== false);

export const AGENTS_ENTREPRISE: Agent[] = POSTES_MONTRES.map((p) => p.agent);
/* La légende sous le visuel, quand l'écran n'est pas le back-office. */
export function legendeEntreprise(etape: number): [string, string] | null {
  const e = POSTES_MONTRES[etape]?.etape.ecran;
  if (e === "point-de-vente") return ["En magasin", ", un QR code sur chaque étiquette"];
  if (e === "evenementiel") return ["En événement", ", un conseil pour chaque visiteur"];
  return null;
}
const ETAPES: EtapeBO[] = POSTES_MONTRES.map((p) => p.etape);

/* Ce que l'écran montre, pour les lecteurs d'écran. */
const LIBELLE_ECRAN: Record<Ecran, string> = {
  "point-de-vente": "un vendeur IA en rayon, par QR code",
  evenementiel: "un événement de marque équipé d’agents IA",
  copilote: "le Copilote",
  "copilote-chat": "le chat du Copilote",
  "community-feed": "les Community managers IA et leur feed Instagram",
  analystes: "les Data analysts IA",
  modale: "la fenêtre « Choisir qui shoote » du Cowork",
  marketing: "les agences marketing IA",
  magazines: "la fenêtre « Paraître dans un magazine » du Cowork",
  comptable: "la fenêtre « Gestion fiscale et comptable » du Cowork",
};

/* ---------- Le décor : la latérale Cowork et la barre haute ---------- */

/* Les liens rapides de CoworkConversationsNav (LIENS_RAPIDES), dans l'ordre
   fixé par JP le 01/09/2026. Le « Guide d'installation » part quand tout est
   fait : on montre ce cas-là. */
const LIENS_RAPIDES: { titre: string; icone: LucideIcon; menu?: boolean }[] = [
  { titre: "Suivre l'activité", icone: House },
  { titre: "Copilote", icone: Calendar },
  { titre: "Guide d'utilisation", icone: Compass },
  { titre: "Conversations", icone: MessageSquare },
  { titre: "Essayages", icone: Package },
  { titre: "Préoccupations clients", icone: Lightbulb },
  { titre: "Mails capturés", icone: Users },
  { titre: "Mémoire agents IA", icone: BookOpenText, menu: true },
  { titre: "Instructions agents IA", icone: ClipboardList, menu: true },
  { titre: "Marketing IA", icone: TrendingUp, menu: true },
];

const LOGO_LYSTES = "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/logo/lystes.PNG";

/* L'orbe du sélecteur d'espace : l'animation `thinking-orbs` du vrai
   sélecteur n'est pas installée ici, on en garde la silhouette, une couronne
   de particules qui tourne. */
function Orbe() {
  const points = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const r = i % 2 ? 10 : 12.5;
    return { x: 16 + Math.cos(a) * r, y: 16 + Math.sin(a) * r, o: 0.25 + ((i * 7) % 10) / 13 };
  });
  return (
    <span className="lyv-e-orbe" aria-hidden="true">
      <svg width="32" height="32" viewBox="0 0 32 32">
        {points.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={1.1} fill="#1a1a1a" opacity={p.o} />)}
        <circle cx="16" cy="16" r="2" fill="#1a1a1a" opacity=".55" />
      </svg>
    </span>
  );
}

function Laterale() {
  return (
    <aside className="lyv-e-laterale">
      {/* Logo, aide et compte marchand. */}
      <div className="flex items-center gap-2 bg-muted p-2">
        <span className="flex shrink-0 items-center gap-3">
          <img src={LOGO_LYSTES} alt="" className="h-9 w-auto flex-shrink-0 animate-spin-slow" />
        </span>
        <div className="flex-1" />
        <span className="flex items-center rounded-[9px] bg-gray-medium p-1.5">
          <span className="relative shrink-0 rounded-[7px] bg-background p-0.5">
            <span className="block rounded-full bg-muted" style={{ width: 36, height: 36 }} />
          </span>
        </span>
      </div>

      {/* Le sélecteur d'espace, sur Cowork. */}
      <div className="px-3 pb-2 pt-1">
        <div
          className="flex w-full items-center rounded-xl"
          style={{ gap: 20, background: "#f5f5f5", border: "4px solid #fff", padding: "5px 9px" }}
        >
          <Orbe />
          <span
            className="flex-1 truncate text-left text-[12.5px] font-semibold tracking-[-0.006em] text-foreground"
            style={{ marginLeft: -14 }}
          >
            Cowork Lystes
          </span>
          <ChevronsUpDown className="shrink-0" style={{ width: 13, height: 13, color: "#c2c2c5" }} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3">
        <span
          className="relative flex w-full items-center justify-center rounded-btn px-3 py-2.5 font-medium text-black"
          style={{ background: "rgb(225, 243, 197)", fontSize: 14, lineHeight: "20px" }}
        >
          <Plus className="absolute left-3 flex-shrink-0" style={{ width: 17, height: 17 }} />
          <span>Nouvelle conversation</span>
          <kbd className="absolute right-3 font-sans font-medium text-black/50" style={{ fontSize: 10 }}>⌘N</kbd>
        </span>
        <div className="pt-1.5" />
        <div className="space-y-0.5">
          {LIENS_RAPIDES.map(({ titre, icone: Icone, menu }) => (
            <div key={titre} className="flex items-center">
              <span
                className="flex min-w-0 flex-1 items-center gap-2 rounded-btn px-3 py-[3px] text-left text-foreground"
                style={{ fontSize: 13, lineHeight: 1.5 }}
              >
                <Icone className="flex-shrink-0" style={{ width: 15, height: 15 }} />
                <span className={menu ? "flex-1 break-words leading-snug" : "flex-1 truncate"}>{titre}</span>
              </span>
              {menu && (
                <span className="px-2 py-1 text-muted-foreground">
                  <ChevronDown style={{ width: 14, height: 14 }} />
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="px-3 pb-2 pt-4 font-semibold uppercase tracking-wider text-foreground" style={{ fontSize: 11 }}>
          Conversations
        </div>
        <p className="px-3 py-2 text-muted-foreground" style={{ fontSize: 12 }}>Aucune conversation</p>
        <div className="flex-1" />
      </div>

      {/* Le lanceur des outils marchands. */}
      <div className="bg-background px-3 py-1.5">
        <div className="flex items-center gap-1 rounded-[9px] bg-muted p-1">
          <span className="flex h-8 min-w-0 flex-1 items-center justify-start gap-2 px-2 text-[12.5px] font-semibold">
            <span className="text-left">Nos outils</span>
            <span
              className="rounded-full px-[7px] py-[2px] text-[9px] font-semibold uppercase tracking-[0.08em] text-black/70"
              style={{ background: "rgb(225, 243, 197)" }}
            >
              IA
            </span>
            <ChevronsUpDown className="ml-auto text-muted-foreground" style={{ width: 14, height: 14 }} strokeWidth={1.3} />
          </span>
          <span className="flex shrink-0 items-center justify-center rounded-full bg-white" style={{ width: 32, height: 32 }}>
            <ArrowUpRight className="text-black" style={{ width: 16, height: 16 }} strokeWidth={1.5} />
          </span>
        </div>
      </div>
    </aside>
  );
}

function BarreHaute() {
  return (
    <div className="mb-4 flex h-16 shrink-0 items-center gap-4 border-b border-apple-gray-medium bg-background/95 px-8">
      <div className="flex min-w-0 max-w-[220px] shrink items-center gap-2">
        <span className="flex shrink-0 items-center justify-center text-muted-foreground" style={{ width: 32, height: 32 }}>
          <PanelLeft style={{ width: 18, height: 18 }} />
        </span>
        <p className="truncate font-medium text-foreground" style={{ fontSize: 14, lineHeight: "20px" }}>Bonjour 👋</p>
      </div>
      <div className="flex-1" />
      <div className="flex shrink-0 items-center justify-end gap-3">
        <span className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-medium" style={{ fontSize: 13 }}>
          <span className="leading-none" style={{ fontSize: 16 }}>🇫🇷</span>
          <Globe className="opacity-60" style={{ width: 14, height: 14 }} />
        </span>
        <span className="relative flex items-center justify-center" style={{ width: 40, height: 40 }}>
          <Bell style={{ width: 20, height: 20 }} />
        </span>
      </div>
    </div>
  );
}

/* La barre Cowork, Cerveau, Organigramme, Équipe IA (CoworkTopNavigation).
   L'effectif de l'équipe se lit dans la base : la vraie barre n'affiche rien
   tant qu'il n'est pas lu, on fait pareil. */
function NavigationCowork() {
  const bouton = "flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5";
  return (
    <nav className="absolute right-3.5 top-1 z-20 flex items-center gap-0.5 rounded-full bg-white px-1 py-0.5" style={{ fontSize: 11 }}>
      <span className={bouton + " bg-secondary font-medium text-secondary-foreground"}><LayoutGrid style={{ width: 12, height: 12 }} />Cowork</span>
      <span className={bouton + " font-medium text-muted-foreground"}><BrainCircuit style={{ width: 12, height: 12 }} />Cerveau</span>
      <span className={bouton + " font-medium text-muted-foreground"}><Users2 style={{ width: 12, height: 12 }} />Organigramme</span>
      <span className={bouton + " font-medium text-muted-foreground"}>
        <Bot style={{ width: 12, height: 12 }} />Équipe IA<ChevronDown style={{ width: 12, height: 12 }} />
      </span>
    </nav>
  );
}

/* ---------- La fenêtre « Choisir qui shoote » (CoworkStudioBar) ---------- */

/** Carte « créer » d'un métier, recopiée de CoworkStudioBar (CarteCreerCreatif,
    design validé par JP le 06/09/2026). */
function CarteCreerCreatif({ metier }: { metier: DisciplineConfig }) {
  return (
    <button
      type="button"
      tabIndex={-1}
      className="flex h-full min-h-[420px] w-full flex-col items-center justify-center gap-4 rounded-3xl bg-[#f3f4f5] px-8 py-12 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
        <Plus className="text-[#1a1a1a]" style={{ width: 20, height: 20 }} />
      </span>
      <span className="text-[13px] font-semibold leading-snug text-[#1a1a1a] [text-wrap:balance]">{metier.titreCreation}</span>
      <span className="max-w-[280px] text-[11px] leading-relaxed text-[#777b7f]">{metier.sousTitre}</span>
    </button>
  );
}

const rien = () => {};

/* Les profils du catalogue, comme `carteIntegree` de CoworkStudioBar : le
   style de prise de vue, le secteur, le nombre de photos de la séance. */
function carteIntegree(ph: AIPhotographer, opts?: { colonnes: 2 | 3; nbPhotos: number }) {
  return (
    <CarteProfilCreatif
      key={ph.id}
      nom={ph.name}
      sousTitre={ph.type}
      avatar={ph.avatar}
      chiffres={[
        { valeur: "Photo", label: ph.style },
        { valeur: "Type", label: ph.specialty },
        { valeur: "Objectif", label: `${opts?.nbPhotos ?? 4}` },
      ]}
      galerie={ph.sampleImages ?? []}
      colonnesGalerie={opts?.colonnes ?? 2}
      nbPhotosGalerie={casesPleines(ph.sampleImages, opts?.colonnes ?? 2, opts?.nbPhotos ?? 4)}
      libelleAction="Sélectionner"
      onAction={rien}
    />
  );
}

/* Un modèle du catalogue UGC, comme dans la fenêtre (même carte, mêmes
   chiffres). */
function carteModele(m: StudioModel) {
  return (
    <CarteProfilCreatif
      key={m.id}
      nom={m.name || "Créateur UGC"}
      sousTitre={m.card_title}
      avatar={m.image_url}
      chiffres={[
        { valeur: (m.sample_images ?? []).length, label: "contenus" },
        { valeur: libelleGenre(m.gender), label: "secteur" },
        { valeur: (m.sample_images ?? []).length, label: "réalisations" },
      ]}
      galerie={m.sample_images ?? []}
      nbPhotosGalerie={casesPleines(m.sample_images, 2, 4)}
      libelleAction="Sélectionner"
      onAction={rien}
    />
  );
}

/* Les filtres fixes de l'onglet Créateurs UGC IA : genre, type de peau, âge. */
function FiltresUgc() {
  const filtres = [
    { options: GENDER_OPTIONS, place: "Genre", tous: "Genre : tous" },
    { options: ETHNICITY_OPTIONS, place: "Type de peau", tous: "Type de peau : toutes" },
    { options: AGE_RANGE_OPTIONS, place: "Âge", tous: "Âge : tous" },
  ];
  return (
    <div className="lystes-filter-bar mb-2 flex flex-nowrap items-center gap-2">
      {filtres.map((f) => (
        <Select key={f.place} value="all">
          <SelectTrigger className="lystes-select-trigger flex-1" tabIndex={-1}>
            <SelectValue placeholder={f.place} />
          </SelectTrigger>
          <SelectContent>
            {f.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-[11px]">
                {opt.value === "all" ? f.tous : opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}

function Grille({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-3 gap-3 p-1" data-lyv-e-grille="">{children}</div>;
}

/* Les listes de la fenêtre, dans son ordre : mêmes sources que
   CoworkStudioBar. */
type Listes = {
  community: AIPhotographer[];
  photographes: AIPhotographer[];
  graphistes: AIGraphiste[];
  ugc: AIPhotographer[];
  modeles: StudioModel[];
};

function FenetreCreateurs({ onglet, listes }: { onglet: Onglet; listes: Listes }) {
  return (
    <div className="lyv-e-modale" role="presentation">
      <div className="flex shrink-0 flex-col space-y-1.5 text-left">
        <h2 className="text-lg font-semibold leading-none tracking-tight">Choisir qui shoote</h2>
      </div>
      <Tabs value={onglet} className="lystes-creator-controls">
        {/* 11/10/2026 (JP) : « Créateur UGC IA » en premier, suivi des
            « Photographes IA » ; la visite et la vraie fenêtre (Cowork) gardent
            le même ordre. */}
        <TabsList className="lystes-role-tabs grid h-auto w-full grid-cols-4 gap-1 bg-transparent p-0">
          <TabsTrigger className="lystes-role-tab" value="ugc" tabIndex={-1}>Créateurs UGC IA</TabsTrigger>
          <TabsTrigger className="lystes-role-tab" value="photographes" tabIndex={-1}>Photographes IA</TabsTrigger>
          <TabsTrigger className="lystes-role-tab" value="community" tabIndex={-1}>Agences de communication IA</TabsTrigger>
          <TabsTrigger className="lystes-role-tab" value="graphistes" tabIndex={-1}>Graphistes IA</TabsTrigger>
        </TabsList>

        <TabsContent value="photographes">
          <ScrollArea className="h-[540px]">
            <Grille>
              <CarteCreerCreatif metier={DISCIPLINES.photographe} />
              {listes.photographes.map((ph) => carteIntegree(ph))}
            </Grille>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="graphistes">
          <ScrollArea className="h-[540px]">
            <Grille>
              <CarteCreerCreatif metier={DISCIPLINES.graphiste} />
              {listes.graphistes.map((gr) => (
                <CarteProfilCreatif
                  key={gr.id}
                  nom={gr.name}
                  sousTitre={gr.type}
                  avatar={gr.avatar}
                  chiffres={[
                    { valeur: (gr.sampleImages ?? []).length, label: "contenus" },
                    { valeur: gr.specialty, label: "secteur" },
                    { valeur: (gr.sampleImages ?? []).length, label: "réalisations" },
                  ]}
                  galerie={gr.sampleImages ?? []}
                  libelleAction="Sélectionner"
                  onAction={rien}
                />
              ))}
            </Grille>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="ugc">
          <FiltresUgc />
          <ScrollArea className="h-[500px]">
            <Grille>
              <CarteCreerCreatif metier={DISCIPLINES.ugc} />
              {listes.ugc.map((ph) => carteIntegree(ph))}
              {listes.modeles.map((m) => carteModele(m))}
            </Grille>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="community">
          <ScrollArea className="h-[540px]">
            <Grille>
              <CarteCreerCreatif metier={DISCIPLINES.community} />
              {listes.community.map((ph) => carteIntegree(ph, { colonnes: 3, nbPhotos: 9 }))}
            </Grille>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <span className="absolute right-4 top-4 rounded-sm opacity-70">
        <X style={{ width: 16, height: 16 }} />
      </span>
    </div>
  );
}

/* ---------- Les pages des agences (CreateursUgcPage) ---------- */

/** La carte « Créer mon agence … » de l'annuaire (CreatePhotographerCard),
    sans son formulaire. */
function CarteCreerAnnuaire({ metier }: { metier: DisciplineConfig }) {
  return (
    <span className="flex h-[190px] min-h-0 w-full flex-col items-center justify-center gap-3 self-start whitespace-normal rounded-3xl bg-white px-8 py-5 text-center font-medium">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f1f1f1]">
        <Plus className="text-foreground" style={{ width: 20, height: 20 }} strokeWidth={1.5} />
      </span>
      <span className="max-w-[280px] font-semibold leading-snug text-foreground" style={{ fontSize: 12 }}>
        {metier.titreCreation}
      </span>
      <span className="max-w-[300px] text-[11px] font-normal leading-relaxed text-muted-foreground">{metier.sousTitre}</span>
    </span>
  );
}

/* Le canevas gris des pages du tableau de bord (.dashboard-page-canvas, au
   rembourrage de l'ordinateur). Il défile sous la main de la visite. */
function Canevas({ children }: { children: ReactNode }) {
  return <div className="lyv-e-canevas lyv-e-defile">{children}</div>;
}

/* Les agences marketing et SEO : la page de CreateursUgcPage pour ces
   métiers (`gabaritSemaine`), sans compte connecté : la carte « Créer », puis
   une fiche CarteProfilEditorial par agence, en colonne, la semaine à droite
   (plateforme et rôle comme `plateformeDuProfil`). */
function PageAgences({ discipline, profils }: { discipline: DisciplineCreative; profils: AIPhotographer[] }) {
  const metier = DISCIPLINES[discipline];
  return (
    <Canevas>
      <div className="annuaire-repertoire mx-auto max-w-6xl px-4 py-8">
        <p className="text-[8px] uppercase tracking-[0.2em] text-[#777b7f]">Annuaire</p>
        <h1 className="mt-1 text-[22px] font-semibold text-foreground">{metier.pluriel}</h1>
        <p className="mt-1 text-[11px] text-muted-foreground">{metier.sousTitre}</p>
        <div className="mt-6 flex flex-col gap-4" data-lyv-e-grille="">
          <CarteCreerAnnuaire metier={metier} />
          {profils.map((ph, i) => (
            <CarteProfilEditorial
              key={ph.id}
              profileId={ph.id}
              nom={ph.name}
              specialite={ph.type ?? ph.specialty}
              description={ph.title}
              avatar={ph.avatar}
              galerie={ph.sampleImages ?? []}
              plateforme="instagram-feed"
              role="Agence"
              prioritaire={i < 2}
              onAction={rien}
              metier={discipline}
            />
          ))}
        </div>
      </div>
    </Canevas>
  );
}

/* ---------- La fenêtre « Paraître dans un magazine » (CoworkOutils) ---------- */

function FenetreMagazines() {
  return (
    <div className="lyv-e-modale lyv-e-modale-presse" role="presentation">
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-col space-y-1.5 px-6 pb-3 pt-6 text-left">
          <h2 className="text-lg font-normal leading-none tracking-tight">Paraître dans un magazine</h2>
        </div>
        <div className="flex min-h-0 flex-1 flex-col px-6 pb-6">
          <PanneauMagazines darkMode={false} />
        </div>
      </div>
      <span className="absolute right-4 top-4 rounded-sm opacity-70">
        <X style={{ width: 16, height: 16 }} />
      </span>
    </div>
  );
}

/* Les portraits et portfolios servis par le stockage Supabase sont des PNG
   de 1 à 1,5 Mo, affichés ici sur une centaine de pixels : la galerie
   restait grise à l'arrivée de l'étape (relecture du 10/10). L'écran prend
   la même image, réduite par le service de transformation de Supabase
   (/render/image, environ 20 Ko en WebP). */
/* La largeur seule ne suffit pas : le service garde alors la hauteur
   d'origine et recadre au centre (360 × 1152 pour une photo de 928 × 1152,
   mesuré le 10/10). Les portfolios ne montraient qu'une tranche verticale
   grossie 2,4 fois, et les avatars UGC, des lèvres. Le portfolio tient donc
   entier dans sa boîte 3/4 (contain), l'avatar est recadré en carré. */
const OBJET_PUBLIC = "/storage/v1/object/public/";
function miniature(url: string | null | undefined, largeur: number, hauteur: number, mode: "contain" | "cover"): string {
  if (!url || !url.includes(OBJET_PUBLIC)) return url ?? "";
  return `${url.replace(OBJET_PUBLIC, "/storage/v1/render/image/public/")}?width=${largeur}&height=${hauteur}&resize=${mode}&quality=70`;
}
const avatarReduit = (u: string | null | undefined) => miniature(u, 160, 160, "cover");
const photoReduite = (u: string) => miniature(u, 360, 480, "contain");
type AvecPortfolio = { avatar?: string | null; sampleImages?: string[] };
const enMiniature = <T extends AvecPortfolio>(ph: T): T => ({
  ...ph,
  avatar: avatarReduit(ph.avatar),
  sampleImages: (ph.sampleImages ?? []).map(photoReduite),
});
const modeleEnMiniature = (m: StudioModel): StudioModel => ({
  ...m,
  image_url: avatarReduit(m.image_url),
  sample_images: (m.sample_images ?? []).map(photoReduite),
});

/* ---------- Le Copilote (CopilotePage) ---------- */

/* La page /dashboard/copilote, onglet « Le cap » : en-tête, actions,
   onglets, plaque verte des chiffres, chemin chiffré et leviers. Balisage et
   classes recopiés de CopilotePage.tsx ; la vraie page lit le compte
   connecté (useCopilote, useTaches), la visite montre la marque de
   démonstration Lystes & Partners. */
const ONGLETS_COPILOTE: { id: string; label: string; icone: LucideIcon }[] = [
  { id: "cap", label: "Le cap", icone: Compass },
  { id: "conseils", label: "Conseils par canal", icone: Megaphone },
  { id: "trafic", label: "Stratégie trafic", icone: Route },
  { id: "semaine", label: "Cette semaine", icone: CalendarDays },
  { id: "fait", label: "Ce que j'ai fait", icone: Check },
  { id: "atelier", label: "Atelier créatives", icone: Sparkles },
  { id: "budgets", label: "Budgets", icone: Wallet },
  { id: "discussion", label: "Discussion", icone: MessageCircle },
  { id: "sources", label: "Ce qui le nourrit", icone: Flame },
];

const EQUIPE_COPILOTE = [
  { nom: "Maya", role: "Analyse vos chiffres", photo: TEAM_AVATARS.maya },
  { nom: "Lucas", role: "Prépare la publicité", photo: TEAM_AVATARS.lucas },
  { nom: "Emma", role: "Lit vos conversations", photo: TEAM_AVATARS.emma },
];

/* Lystes & Partners, la marque de démonstration : un mois en cours. */
const NB = " ";
const DEMO_KPIS = [
  { label: "Palier visé ce mois-ci", valeur: `12${NB}000 €`, note: "62 % du chemin parcouru" },
  { label: "Déjà encaissé", valeur: `7${NB}440 €`, note: `Objectif que vous avez fixé : 15${NB}000 €` },
  { label: "Reste à faire", valeur: `4${NB}560 €`, note: "152 commandes au total" },
  { label: "Visites nécessaires", valeur: `9${NB}500`, note: `6${NB}200 mesurées sur 30 jours` },
];
const DEMO_PHRASE = `Lystes & Partners a encaissé 7${NB}440 € ce mois-ci. Pour tenir 12${NB}000 €, il manque 58 commandes au panier moyen de 79 € : les paniers abandonnés et les avis en apportent une bonne part avant toute publicité.`;
/* Titres et lignes courts : la ligne de la charte (Ligne) tronque ce qui
   dépasse, et la vue du téléphone n'a que 350 px d'écran de large. */
const DEMO_LEVIERS = [
  { titre: "Relancer les paniers", sousTitre: `42 paniers, 3${NB}320 € en attente`, gain: "+830 €" },
  { titre: "Afficher les avis reçus", sousTitre: "64 avis absents des fiches", gain: "+540 €" },
  { titre: "Répondre sur la texture", sousTitre: "1 question sur 4 au conseiller", gain: "+410 €" },
];

function PageCopilote() {
  return (
    <div className="lyv-e-page">
      <div className="lyv-e-defile lyv-e-copilote">
        <div className="bkit bkit-canvas min-h-full w-full min-w-0 max-w-full overflow-x-hidden rounded-[24px] p-5 pb-12 md:p-8 md:pb-14 space-y-8">
          <div data-lyv-e-entete="" className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-[28px] font-semibold tracking-tight text-foreground md:text-[32px]">Votre copilote</h1>
                <p className="text-sm text-muted-foreground">
                  Le palier visé, ce qu'il mène seul, ce qu'il vous demande et ce qu'il apprend
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" className="h-9 text-[12px]" tabIndex={-1}>Réévaluer le palier</Button>
                <Button size="sm" className="h-9 text-[12px]" tabIndex={-1}>Recalculer mes tâches</Button>
              </div>
              <Tabs value="cap">
                <TabsList className="flex flex-wrap h-auto rounded-xl bg-muted/50 p-1">
                  {ONGLETS_COPILOTE.map((o) => {
                    const Icone = o.icone;
                    return (
                      <TabsTrigger key={o.id} value={o.id} className="gap-2 data-[state=active]:bg-background" tabIndex={-1}>
                        <Icone className="h-4 w-4" />
                        <span className="hidden sm:inline">{o.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* La plaque verte de l'accueil « Activité » (PlaqueKpi), reprise
              telle quelle : 4 chiffres en ligne sur grand écran, 2 × 2
              au-dessous de 1024 px. */}
          <div data-lyv-e-plaque="" className="rounded-[20px] p-4 md:p-8 space-y-4" style={{ background: "rgb(225, 243, 197)" }}>
            <div data-lyv-e-kpis="" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {DEMO_KPIS.map((k, i) => (
                <div
                  key={k.label}
                  className={`rounded-2xl p-5 ${i === 0 ? "bg-[#111111] text-white" : "bg-white text-foreground"}`}
                >
                  <div className="text-[34px] font-medium leading-none tabular-nums">{k.valeur}</div>
                  <div className={`mt-2 text-[13px] ${i === 0 ? "text-white/80" : "text-muted-foreground"}`}>
                    {k.label}
                  </div>
                  {k.note && (
                    <div className={`mt-1 text-[12px] ${i === 0 ? "text-white/50" : "text-muted-foreground/70"}`}>
                      {k.note}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="rounded-2xl bg-white p-5">
              <p className="text-[13px] leading-[1.6] text-foreground">{DEMO_PHRASE}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center">
                  {EQUIPE_COPILOTE.map((a, i) => (
                    <img key={a.nom} src={a.photo} alt="" className={`h-7 w-7 rounded-full object-cover ${i > 0 ? "-ml-2" : ""}`} />
                  ))}
                  <span className="ml-2 text-[11.5px]" style={{ color: GRIS }}>
                    Plan d'action suivi par {EQUIPE_COPILOTE.length} agents
                  </span>
                </div>
              </div>
            </div>
          </div>

          <section data-lyv-e-chemin="">
            <TitreBloc titre="Le chemin chiffré" note="Conversion retenue : 1,6 %, mesurée sur 30 jours" />
            <Panneau>
              <Ligne
                icone={<Wallet className="h-4 w-4" strokeWidth={1.3} />}
                titre="Panier moyen : 79 €"
                sousTitre="Mesuré sur vos commandes des 180 derniers jours."
                droite={`Meilleur mois : 10${NB}900 €`}
              />
              <Trait />
              <Ligne
                icone={<TrendingUp className="h-4 w-4" strokeWidth={1.3} />}
                titre={`152 commandes, 9${NB}500 visites`}
                sousTitre="Palier ÷ panier moyen = commandes, ÷ 1,6 % de conversion = visites."
                etiquette="Mesuré"
              />
              <Trait />
              <Ligne
                icone={<Sparkles className="h-4 w-4" strokeWidth={1.3} />}
                titre={`1${NB}900 € de publicité pour tenir ce trafic`}
                sousTitre={`Meta 1${NB}100 € (ROAS 3,1x) · Google 800 € (ROAS 2,6x)`}
              />
            </Panneau>
          </section>

          <section data-lyv-e-leviers="">
            <TitreBloc titre="Les leviers avant d'acheter du trafic" note="Ce qui est déjà dans la boutique et qui n'est pas encaissé" />
            <Panneau>
              {DEMO_LEVIERS.map((l, i) => (
                <div key={l.titre}>
                  {i > 0 && <Trait />}
                  <Ligne
                    icone={<TrendingUp className="h-4 w-4" strokeWidth={1.3} />}
                    titre={l.titre}
                    sousTitre={l.sousTitre}
                    droite={l.gain}
                  />
                </div>
              ))}
            </Panneau>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------- La fenêtre « Gestion fiscale et comptable » (CoworkOutils) ---------- */

/* Le vrai PanneauComptable, dans le cadre de son pop-up (h-[90vh]
   max-h-[760px] sm:max-w-4xl, p-0) : le cabinet à gauche, les prestations
   à cocher à droite. Rien n'est cliquable dans l'écran. */
function FenetreComptable() {
  return (
    <div className="lyv-e-modale lyv-e-modale-compta" role="presentation">
      <div className="flex min-h-0 flex-1 flex-col">
        <PanneauComptable darkMode={false} />
      </div>
      <span className="absolute right-4 top-4 z-20 rounded-sm opacity-70">
        <X style={{ width: 16, height: 16 }} />
      </span>
    </div>
  );
}

/* ---------- L'écran ---------- */

function Ecran({ def, listes, profilsMarketing, tel }: {
  def: EtapeBO;
  listes: Listes;
  profilsMarketing: AIPhotographer[];
  tel: boolean;
}) {
  if (def.ecran === "point-de-vente" || def.ecran === "evenementiel") return <Terrain ecran={def.ecran} />;
  if (def.ecran === "copilote-chat" || def.ecran === "community-feed" || def.ecran === "analystes") {
    return <div className="bo-typo">
      {def.ecran === "copilote-chat" && <VueCopilote />}
      {def.ecran === "community-feed" && <VueCommunity profil={profilsOrdonnes("community").find(ph => ph.name === "Adèle" && estComplet(ph)) ?? profilsOrdonnes("community").find(ph => estComplet(ph) && (ph.sampleImages?.length ?? 0) >= 9) ?? profilsOrdonnes("community").find(estComplet)} />}
      {def.ecran === "analystes" && <VueAnalystes />}
    </div>;
  }
  const cowork = def.ecran === "modale" || def.ecran === "magazines" || def.ecran === "comptable";
  return (
    <div className={"lyv-e-ecran bo-typo" + (tel ? " lyv-e-tel" : "")}>
      <Laterale />
      <main className="lyv-e-principal">
        <BarreHaute />
        {cowork && (
          <div className="lyv-e-canevas lyv-e-cowork">
            <NavigationCowork />
          </div>
        )}
        {def.ecran === "copilote" && <PageCopilote key="copilote" />}
        {def.ecran === "marketing" && (
          <div className="lyv-e-page" key="marketing"><PageAgences discipline="marketing" profils={profilsMarketing} /></div>
        )}
      </main>
      {def.ecran === "modale" && def.onglet && (
        <>
          <div className="lyv-e-voile" />
          <FenetreCreateurs onglet={def.onglet} listes={listes} />
        </>
      )}
      {def.ecran === "magazines" && (
        <>
          <div className="lyv-e-voile" />
          <FenetreMagazines />
        </>
      )}
      {def.ecran === "comptable" && (
        <>
          <div className="lyv-e-voile" />
          <FenetreComptable />
        </>
      )}
    </div>
  );
}

/* ---------- Le terrain : point de vente et événementiel ---------- */

/* Le visuel et le texte des sections du site, tels quels : la carte média
   (« video-carte ») et la carte texte (« bs ») du bento. */
const TERRAIN = {
  "point-de-vente": {
    image: "https://lystes.ai/__l5e/assets-v1/04936b06-45a6-4f03-b168-04a83df1ada7/distribution-slide-2.png",
    video: null,
    alt: "Vendeur IA en point de vente scannant un produit",
    ratio: 1280 / 1600,
    titre: "Un vendeur IA derrière chaque référence, dans chaque rayon",
    texte: "Vos produits en rayon prennent la parole. L’agent IA connaît la gamme, argumente, oriente vers la bonne référence et rassure sur les alternatives. Vos équipes se concentrent sur la vente à forte valeur.",
  },
  evenementiel: {
    image: null,
    video: "https://lystes.ai/__l5e/assets-v1/e03ab355-e574-4a17-bf12-8046ecefddaa/syncbeauty.mp4",
    alt: "Un événement de marque",
    ratio: 720 / 1280,
    titre: "Rendez vos événements plus innovants avec des agents IA qui interagissent avec vos invités.",
    texte: "Chaque invité repart avec un assistant qui se souvient de lui, ses préférences, son diagnostic, ses essais. Vous prolongez l’émotion du live et récupérez des contacts vraiment qualifiés, pas une simple liste d’emails.",
  },
} as const;
const HAUTEUR_TERRAIN = 420;

function Terrain({ ecran }: { ecran: "point-de-vente" | "evenementiel" }) {
  const t = TERRAIN[ecran];
  return (
    <div className="lyv-e-terrain" data-lyv-e-terrain="">
      <div className="lyv-e-media" data-lyv-e-media="" style={{ width: Math.round(HAUTEUR_TERRAIN * t.ratio), height: HAUTEUR_TERRAIN }}>
        {t.video
          ? <video src={t.video} autoPlay loop muted playsInline preload="auto" aria-label={t.alt} />
          : <img src={t.image ?? ""} alt={t.alt} />}
      </div>
      <div className="lyv-e-terrain-texte">
        <h4>{t.titre}</h4>
        <p>{t.texte}</p>
      </div>
    </div>
  );
}

/* Les images que l'étape montre à l'écran : la rangée de la carte visée et
   la suivante, portraits et portfolios. La visite les demande pendant l'étape
   d'avant : la galerie restait grise une seconde à l'arrivée (relecture du
   10/10). */
function imagesEtape(def: EtapeBO, listes: Listes, profilsMarketing: AIPhotographer[]): string[] {
  if (def.ecran === "point-de-vente") return [TERRAIN["point-de-vente"].image];
  const cible = def.ordi.cible;
  if (typeof cible !== "number") return [];
  type Carte = { avatar?: string | null; galerie: string[] };
  const deProfil = (n: number) => (ph: AvecPortfolio): Carte => ({ avatar: ph.avatar, galerie: (ph.sampleImages ?? []).slice(0, n) });
  let cartes: Carte[] = [];
  let colonnes = 3;
  if (def.ecran === "modale") {
    if (def.onglet === "community") cartes = listes.community.map(deProfil(9));
    else if (def.onglet === "photographes") cartes = listes.photographes.map(deProfil(4));
    else if (def.onglet === "graphistes") cartes = listes.graphistes.map(deProfil(4));
    else cartes = [...listes.ugc.map(deProfil(4)), ...listes.modeles.map((m) => ({ avatar: m.image_url, galerie: (m.sample_images ?? []).slice(0, 4) }))];
  } else if (def.ecran === "marketing") {
    cartes = profilsMarketing.map(deProfil(9));
    colonnes = 1;
  }
  /* La carte « Créer » occupe le rang 0. */
  const debut = cible - (cible % colonnes);
  const visibles = [null, ...cartes].slice(debut, debut + (colonnes === 1 ? 2 : 2 * colonnes));
  return visibles.flatMap((c) => (c ? [c.avatar ?? "", ...c.galerie] : [])).filter(Boolean);
}

/* ---------- La visite ---------- */

/* Délai au-delà duquel l'étape se montre même sans sa cible : la visite ne
   reste jamais bloquée. */
const SECOURS = 8000;

/* Le dézoom (JP, 11/10/2026 : « pourquoi ne pas réduire la proportion pour
   qu'on voie mieux les choses ? », « je ne veux pas de trucs coupés »).
   L'écran est rendu à la taille d'un ordinateur (ou plus étroit, voir
   Cadrage), puis la vue montre exactement la zone de l'étape : l'en-tête de
   la fenêtre et une rangée de trois cartes entières, la plaque du Copilote,
   la colonne d'une fiche, la liste du comptable. Rien d'autre n'entre dans
   le champ, donc rien n'y entre tranché.
   - L'échelle reste assez grande pour que le texte de l'écran se lise :
     1 pour le Copilote et le comptable, 0,82 pour une rangée de trois
     cartes (11 px deviennent 9 px). Avant, à 0,8 sur tout
     l'écran, on voyait une carte et demie ; à 0,5, le Copilote sortait en
     texte de 5 px.
   - Sur ordinateur, la vue en haut, l'encart dessous, sa pointe vers la
     cible : l'encart ne couvre plus rien. Le cadre a la hauteur des deux,
     sans vide dessous.
   - Au téléphone, une seule carte, ou les 4 chiffres du Copilote en 2 × 2 ;
     l'encart vient sous le visuel (VisionEtages). */
const ECHELLE_MAX_ORDI = 1;
const ECHELLE_MAX_TEL = 1.1;
const HAUTEUR_VUE_ORDI = 520;
const HAUTEUR_VUE_TEL = 560;
const ECART_ENCART = 14;
/* La marge autour de la zone, en pixels de l'écran : moins que l'écart
   entre deux cartes (12 px), pour que la voisine reste hors champ. */
const MARGE = 5;
type Boite = { left: number; top: number; right: number; bottom: number };
type Vu = { s: number; x: number; y: number; w: number; h: number; gauche: number; px: number; py: number };

export default function VisiteBackOffice({ etape, survol, mobile, pied, taille, prete }: {
  etape: number;
  survol: (s: boolean) => void;
  mobile: boolean;
  pied: Pied;
  taille: (t: TailleCadre) => void;
  prete?: (p: boolean) => void;
}) {
  const boite = useRef<HTMLDivElement>(null);
  const cadreEcran = useRef<HTMLIFrameElement | null>(null);
  const refEncart = useRef<HTMLDivElement>(null);
  const [charge, setCharge] = useState(false);
  const [largeur, setLargeur] = useState(0);
  const [hEncart, setHEncart] = useState(150);
  const [vu, setVu] = useState<{ v: Vu; etape: number } | null>(null);
  const [secours, setSecours] = useState(false);
  const rang = Math.min(Math.max(etape, 0), ETAPES.length - 1);
  const def = ETAPES[rang];
  const cadEtape = mobile ? def.tel : def.ordi;
  /* Le temps de l'étape, pour les étapes qui parcourent une suite de cibles. */
  const [tranche, setTranche] = useState(0);
  const suite = cadEtape.suite;
  useEffect(() => {
    setTranche(0);
    if (!suite || suite.length < 2) return;
    const pas = Math.floor(DUREE_ETAPE / suite.length);
    const ids = suite.slice(1).map((_, i) => window.setTimeout(() => setTranche(i + 1), pas * (i + 1)));
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [etape, suite]);
  const cad: Cadrage = suite ? { ...cadEtape, cible: suite[Math.min(tranche, suite.length - 1)] } : cadEtape;
  const largeurEcran = cad.ecran ?? ECRAN_BOUTIQUE.w;
  const agent = AGENTS_ENTREPRISE[Math.min(rang, AGENTS_ENTREPRISE.length - 1)];
  const vuCourant = vu && vu.etape === etape ? vu.v : null;

  /* Les créateurs UGC du catalogue, lus comme la vraie fenêtre (sans compte :
     le catalogue commun seulement). Profils finis seulement : photo de
     profil et portfolio complet (profilsComplets.ts, JP 11/10). */
  const { data: modeles } = useStudioModels();
  const listes = useMemo<Listes>(() => ({
    community: COMMUNITY_FINIS.map((ph) => enMiniature(ph)),
    photographes: photographesDe("photographe").filter(estComplet).map((ph) => enMiniature(ph)),
    graphistes: GRAPHISTES.filter(estComplet).map((gr) => enMiniature(gr)),
    ugc: photographesDe("ugc").filter(estComplet).map((ph) => enMiniature(ph)),
    modeles: (modeles ?? []).filter(modeleComplet).map(modeleEnMiniature),
  }), [modeles]);
  const profilsMarketing = useMemo(() => profilsOrdonnes("marketing").filter(estComplet).map((ph) => enMiniature(ph)), []);

  /* La hauteur du cadre suit la vue (et l'encart, sur ordinateur) : ni vide
     dessous, ni vue tronquée. */
  const hauteurCadre = vuCourant
    ? Math.ceil(vuCourant.h + (mobile ? 0 : ECART_ENCART + hEncart))
    : mobile ? Math.round(largeur * 1.1) : HAUTEUR_VUE_ORDI;
  useLayoutEffect(() => {
    const b = boite.current;
    if (!b) return;
    const maj = () => {
      setLargeur(b.clientWidth);
      taille({ w: b.clientWidth, h: b.clientHeight });
    };
    maj();
    const ro = new ResizeObserver(maj);
    ro.observe(b);
    return () => ro.disconnect();
  }, [taille]);

  /* La hauteur de l'encart, pour la hauteur du cadre. */
  useLayoutEffect(() => {
    const el = refEncart.current;
    if (!el) return;
    const maj = () => setHEncart((h) => (Math.abs(h - el.offsetHeight) > 1 ? el.offsetHeight : h));
    maj();
    const ro = new ResizeObserver(maj);
    ro.observe(el);
    return () => ro.disconnect();
  });

  useEffect(() => {
    setSecours(false);
    const id = window.setTimeout(() => setSecours(true), SECOURS);
    return () => window.clearTimeout(id);
  }, [etape]);

  useEffect(() => {
    prete?.(!!vuCourant || secours);
  }, [vuCourant, secours, prete]);

  /* Pendant l'étape, les images de la suivante. */
  useEffect(() => {
    if (!vuCourant) return;
    const suivante = ETAPES[(rang + 1) % ETAPES.length];
    const id = window.setTimeout(() => {
      imagesEtape(suivante, listes, profilsMarketing).forEach((src) => { new Image().src = src; });
    }, 400);
    return () => window.clearTimeout(id);
  }, [!!vuCourant, rang, listes, profilsMarketing]); // eslint-disable-line react-hooks/exhaustive-deps

  /* L'étape fait défiler sa liste jusqu'à la cible, puis mesure, à chaque
     image, la zone à montrer : les images et la liste des modèles UGC
     arrivent après coup et changent les hauteurs. */
  useEffect(() => {
    const doc = cadreEcran.current?.contentDocument;
    if (!charge || !doc || !largeur) return;
    let fini = false;
    let raf = 0;
    let defile = false;
    const debut = performance.now();
    const grille = () => doc.querySelector<HTMLElement>("[data-lyv-e-grille]")
      ?? doc.querySelector<HTMLElement>(".lyv-e-modale-presse .overflow-y-auto > .grid");
    const carteDe = (n: number) => grille()?.children[n] as HTMLElement | undefined;
    const porteur = () => (typeof cad.cible === "number" ? carteDe(cad.cible) : doc.querySelector<HTMLElement>(cad.cible) ?? undefined);
    const cible = () => {
      const el = porteur();
      return (el && cad.sous ? el.querySelector<HTMLElement>(cad.sous) : el) ?? undefined;
    };
    const zoneDefilement = (el: HTMLElement) =>
      el.closest<HTMLElement>("[data-radix-scroll-area-viewport], .lyv-e-defile, .overflow-y-auto");
    /* Le premier élément montré, calé en haut de sa zone de défilement. */
    const ancre = (): HTMLElement | undefined => {
      if (cad.rangee && typeof cad.cible === "number") return carteDe(cad.cible - (cad.cible % 3));
      if (cad.haut) {
        const h = doc.querySelector<HTMLElement>(cad.haut);
        if (h && zoneDefilement(h)) return h;
      }
      return porteur();
    };
    const rect = (el: Element): Boite => {
      const r = el.getBoundingClientRect();
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    };
    /* La zone montrée, en pixels de l'écran. */
    const region = (el: HTMLElement): Boite | null => {
      let r = rect(el);
      if (cad.rangee && typeof cad.cible === "number") {
        const g = grille();
        if (!g) return null;
        const premier = cad.cible - (cad.cible % 3);
        const cartes = [...g.children].slice(premier, premier + 3 * (cad.rangees ?? 1)).map(rect);
        /* Toute la largeur de la grille, même quand la rangée n'a que deux
           cartes : le titre et les onglets de la fenêtre restent entiers. */
        const lg = rect(g);
        r = {
          left: lg.left,
          right: lg.right,
          top: Math.min(...cartes.map((c) => c.top)),
          bottom: Math.max(...cartes.map((c) => c.bottom)),
        };
      }
      if (cad.haut) {
        const h = doc.querySelector(cad.haut);
        if (h) r = { ...r, top: Math.min(r.top, rect(h).top) };
      }
      return { left: r.left - MARGE, right: r.right + MARGE, top: r.top - MARGE, bottom: r.bottom + MARGE };
    };
    const mesurer = () => {
      if (fini) return;
      const el = cible();
      if (el && !defile && performance.now() - debut > 60) {
        defile = true;
        const a = ancre();
        const zone = a ? zoneDefilement(a) : null;
        if (a && zone) {
          const ecart = a.getBoundingClientRect().top - zone.getBoundingClientRect().top - (cad.rangee ? 4 : 16);
          zone.scrollTo({ top: Math.max(0, zone.scrollTop + ecart), behavior: "instant" });
        }
      }
      const r = el && defile ? region(el) : null;
      if (el && r) {
        const rw = r.right - r.left;
        const rh = r.bottom - r.top;
        const s = Math.min(mobile ? ECHELLE_MAX_TEL : ECHELLE_MAX_ORDI, largeur / rw, (mobile ? HAUTEUR_VUE_TEL : HAUTEUR_VUE_ORDI) / rh);
        const w = rw * s;
        const h = rh * s;
        const gauche = Math.max(0, (largeur - w) / 2);
        const c = el.getBoundingClientRect();
        const bas = Math.min(c.bottom, r.bottom);
        const px = gauche + ((c.left + c.right) / 2 - r.left) * s;
        const py = mobile ? ((Math.max(c.top, r.top) + bas) / 2 - r.top) * s : (bas - r.top) * s - 3;
        const n: Vu = { s, x: r.left, y: r.top, w, h, gauche, px, py };
        setVu((o) => {
          if (o && o.etape === etape) {
            const p = o.v;
            const proche = (k: keyof Vu) => Math.abs(p[k] - n[k]) < (k === "s" ? 0.0005 : 0.5);
            if ((Object.keys(n) as (keyof Vu)[]).every(proche)) return o;
          }
          return { v: n, etape };
        });
      }
      raf = window.requestAnimationFrame(mesurer);
    };
    raf = window.requestAnimationFrame(mesurer);
    return () => {
      fini = true;
      window.cancelAnimationFrame(raf);
    };
  }, [charge, etape, largeur, def, mobile, largeurEcran, tranche]); // eslint-disable-line react-hooks/exhaustive-deps

  const v = vuCourant;
  /* L'encart, sous la vue, la pointe au-dessus de la cible. */
  const pointe: Pointe | null = v ? { cote: "haut", decalage: Math.max(14, Math.min(largeur - 14, v.px)) } : null;
  return (
    <div
      className={"lyv-boutique lyv-e-visite" + (mobile ? " tel" : "")}
      ref={boite}
      style={{ height: hauteurCadre }}
      onPointerEnter={(ev) => { if (ev.pointerType === "mouse") survol(true); }}
      onPointerLeave={() => survol(false)}
    >
      <style>{CSS_BOITE}</style>
      <div
        className="lyv-e-vue"
        style={v
          ? { left: v.gauche, width: v.w, height: v.h }
          : { left: 0, width: largeur, height: mobile ? hauteurCadre : HAUTEUR_VUE_ORDI - hEncart - ECART_ENCART, opacity: secours ? 1 : 0 }}
      >
        <CadreReproduit
          className="lyv-e-cadre"
          title={`Le back-office Lystes : ${LIBELLE_ECRAN[def.ecran]}`}
          tabIndex={-1}
          style={{
            width: largeurEcran,
            height: def.ecran === "copilote-chat" || def.ecran === "community-feed" || def.ecran === "analystes" ? 1400 : ECRAN_BOUTIQUE.h,
            transform: v
              ? `scale(${v.s}) translate(${-v.x}px, ${-v.y}px)`
              : `scale(${largeur / largeurEcran || 0.4})`,
          }}
          refCadre={(n) => { cadreEcran.current = n; n?.setAttribute("inert", ""); }}
          pret={() => setCharge(true)}
          styleEnPlus={CSS_E}
          rendu={() => <Ecran def={def} listes={listes} profilsMarketing={profilsMarketing} tel={mobile} />}
        />
      </div>
      {v && <span className="lyv-pouls" style={{ left: v.px, top: v.py }} aria-hidden="true" />}
      {!mobile && (
        <div
          ref={refEncart}
          className="lyv-encart-pose lyv-e-encart"
          style={{ left: 0, top: v ? v.h + ECART_ENCART : HAUTEUR_VUE_ORDI - hEncart, width: largeur, visibility: v || secours ? "visible" : "hidden" }}
        >
          <Encart agent={agent} loupe={null} pointe={pointe} pied={pied} survol={survol} />
        </div>
      )}
    </div>
  );
}

/* Le cadre de l'écran, dans l'accueil : la vue arrondie en haut, l'encart
   dessous, sur le fond du visuel. */
const CSS_BOITE = `
.lyv-boutique.lyv-e-visite{ aspect-ratio:auto; overflow:visible; background:transparent; border-radius:0; }
.lyv-e-vue{ position:absolute; top:0; overflow:hidden; border-radius:12px; background:#fff;
  transition:height .35s ease, width .35s ease, left .35s ease, opacity .3s ease; }
.lyv-e-cadre{ position:absolute; left:0; top:0; border:0; display:block; transform-origin:0 0; pointer-events:none; background:#fff; }
.lyv-e-visite .lyv-encart-pose{ transition:top .35s ease; }
.lyv-e-visite .lyv-encart-pose .lyv-encart-texte{ padding-top:1px; }
.lyv-e-visite.tel .lyv-e-vue{ border-radius:10px; }
.lyv-e-visite.tel{ transition:height .35s ease; }
@media (prefers-reduced-motion:reduce){ .lyv-e-vue, .lyv-e-visite .lyv-encart-pose, .lyv-e-visite.tel{ transition:none; } }
`;

/* L'écran, dans son cadre de 1280 × 800 : les règles d'ordinateur de
   lystes.ai s'y appliquent seules, à toutes les largeurs de l'accueil. */
const CSS_E = `
html,body{ margin:0; overflow:hidden !important; background:transparent; }
.lyv-e-ecran{ position:absolute; left:0; top:0; width:100%; height:800px; overflow:hidden;
  font-family:'Inter','Satoshi',-apple-system,BlinkMacSystemFont,sans-serif;
  background:hsl(var(--color-gray-light)); color:hsl(var(--foreground)); line-height:1.5; text-align:left;
  -webkit-font-smoothing:antialiased; }
.lyv-e-ecran *{ box-sizing:border-box; }
.lyv-e-laterale{ position:absolute; left:12px; top:12px; bottom:12px; width:240px; display:flex; flex-direction:column;
  overflow:hidden; border-radius:16px; background:hsl(var(--background)); }
.lyv-e-orbe{ display:inline-grid; place-items:center; width:32px; height:32px; flex:none; border-radius:50%; overflow:hidden; }
.lyv-e-orbe svg{ animation:lyv-e-tourne 9s linear infinite; }
@keyframes lyv-e-tourne{ to{ transform:rotate(360deg); } }
.lyv-e-principal{ position:absolute; left:264px; top:12px; right:12px; bottom:12px; display:flex; flex-direction:column;
  overflow:hidden; border-radius:16px; background:hsl(var(--background)); }
.lyv-e-canevas{ position:relative; flex:1; min-height:0; margin:0 24px 24px; padding:32px; border-radius:32px;
  background:hsl(var(--muted)); overflow:hidden; }
.lyv-e-canevas.lyv-e-cowork{ padding:0; }
.lyv-e-page{ flex:1; min-height:0; display:flex; flex-direction:column; animation:lyv-e-apparait .4s ease both; }
/* Le voile des fenêtres : celui de Dialog (bg-black/80, dialog.tsx). */
.lyv-e-voile{ position:absolute; inset:0; z-index:30; background:rgba(0,0,0,.8); }
.lyv-e-modale{ position:absolute; z-index:31; left:50%; top:50%; transform:translate(-50%,-50%); width:100%; max-width:672px; max-height:720px;
  display:flex; flex-direction:column; gap:16px; padding:24px; border-radius:12px; background:hsl(var(--background)); overflow:hidden; }
/* « Paraître dans un magazine » : max-h-[85vh] sm:max-w-2xl, p-0. */
.lyv-e-modale.lyv-e-modale-presse{ height:680px; max-height:680px; padding:0; gap:0; }
/* La vue descend jusqu'à la dernière rangée et la cale en haut : la liste
   peut défiler assez pour cela (sinon, le bas de la rangée d'avant restait
   dans le champ, tranché). */
.lyv-e-modale-presse .overflow-y-auto > .grid{ padding-bottom:480px; }
/* « Gestion fiscale et comptable » : h-[90vh] max-h-[760px] sm:max-w-4xl, p-0. */
.lyv-e-modale.lyv-e-modale-compta{ max-width:896px; height:720px; max-height:720px; padding:0; gap:0; }
.lyv-e-tel .lyv-e-modale.lyv-e-modale-compta{ max-width:380px; }
/* Visite : la photo du cabinet reste visible, quelle que soit la largeur. */
.lyv-e-modale-compta > div > .grid{ grid-template-columns:repeat(2,minmax(0,1fr)); }
.lyv-e-modale-compta > div > .grid > aside{ display:block; }
.lyv-e-tel .lyv-e-modale-compta > div > .grid{ grid-template-columns:1fr; grid-template-rows:200px minmax(0,1fr); }
/* Le terrain : la carte média et la carte texte du bento du site. */
.lyv-e-terrain{ position:absolute; left:0; top:0; width:100%; display:flex; gap:12px; padding:12px; background:#fff;
  font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; color:#171717; -webkit-font-smoothing:antialiased; }
.lyv-e-media{ position:relative; flex:none; overflow:hidden; border-radius:16px; background:#f5f5f5; }
.lyv-e-media img, .lyv-e-media video{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
.lyv-e-terrain-texte{ flex:1; min-width:0; display:flex; flex-direction:column; justify-content:center; padding:32px 30px;
  border-radius:16px; background:#f9f9f9; }
.lyv-e-terrain-texte h4{ margin:0 0 14px; font-size:24px; line-height:1.2; font-weight:400; letter-spacing:-.01em; text-wrap:balance; }
.lyv-e-terrain-texte p{ margin:0; font-size:15px; line-height:1.6; color:#555; text-wrap:pretty; }
/* Le Copilote : la page dans sa colonne, sous la barre haute. */
.lyv-e-copilote{ flex:1; min-height:0; overflow:hidden; margin:0 24px 24px; }
.lyv-e-modale [role="tabpanel"]{ animation:lyv-e-apparait .35s ease both; }
@keyframes lyv-e-apparait{ from{ opacity:0; } to{ opacity:1; } }
@media (prefers-reduced-motion:reduce){
  .lyv-e-orbe svg{ animation:none; }
  .lyv-e-page, .lyv-e-modale [role="tabpanel"]{ animation:none; }
}
`;
