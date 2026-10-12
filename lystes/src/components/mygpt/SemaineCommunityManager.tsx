/**
 * La semaine d'un community manager. Les jours restent en onglets ; pour le
 * jour choisi, tous les contenus partagent un seul carrousel horizontal. Les
 * plateformes restent groupées à l'intérieur de cette ligne unique.
 *
 * 13/09/2026 (JP) — chaque contenu du jour est relié à UN prompt précis de son
 * réseau : le crayon montre ce prompt, l'enregistre, et « Refaire la journée »
 * relance toutes les publications du jour avec ces mêmes prompts, dans l'ordre.
 * Plus rien n'est tiré au hasard dans la galerie.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CheckCheck, ChevronLeft, ChevronRight, Download, ExternalLink, Link2, Loader2, Minus, Pencil, Plus, RefreshCw, SlidersHorizontal, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@lystes/components/ui/dropdown-menu";
import {
  telechargerPublications,
  type PublicationTelechargeable,
} from "@lystes/features/social/telechargerPublications";
import { Button } from "@lystes/components/ui/button";
import { Input } from "@lystes/components/ui/input";
import { Label } from "@lystes/components/ui/label";
import { Textarea } from "@lystes/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@lystes/components/ui/dialog";
import {
  CadreContenu,
  CONFIG_PLATEFORME,
  tailleCadre,
  type PlateformeEditoriale,
} from "@lystes/components/mygpt/editorial-formats";
import {
  promptDePlateforme,
  promptsDePlateforme,
  REGLES_PLATEFORME,
} from "@lystes/features/ai-photographers/constants/prompts-plateformes";
import { cn } from "@lystes/lib/utils";
import { deMarque } from "@lystes/lib/elision";
import { PlancheJournee, type CaseJournee, type EtatCase } from "@lystes/features/social/PlancheJournee";
import { equipeAgenceParDefaut } from "@lystes/features/social/equipe-agence";
import { ProduitsSemaine } from "@lystes/components/mygpt/ProduitsSemaine";
import type { MembreAgenceSociale, ProduitAgenceSociale, ProduitSemaine, TextePublicationSociale } from "@lystes/features/social/types-agence";
import { MENTION_IMAGE_IA, texteFinal } from "@lystes/features/social/texteFinal";
import {
  bornerHashtags,
  estAvantApres,
  etatAffiche,
  formatRelie,
  heureCourte,
  jourPasse,
  motifBlocage,
  promptSansAvantApres,
  type CaseAgence,
} from "@lystes/features/social/agenceSemaine";
import { toast } from "sonner";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const JOURS_COURTS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/* 15/09/2026 (JP) : « au lieu d'avoir lundi mardi, ca va etre semaine 1,
   semaine 2 ». Une regie publicitaire ne publie pas tous les jours : elle
   sort une vague de creatives par semaine, qu'on laisse tourner avant de
   juger. Afficher « Mardi » sur une campagne Meta dit donc le contraire du
   metier, et pousse la marchande a croire qu'elle doit produire chaque jour. */
const SEMAINES = ["Semaine 1", "Semaine 2", "Semaine 3", "Semaine 4", "Semaine 5", "Semaine 6", "Semaine 7"];
const SEMAINES_COURTES = ["S1", "S2", "S3", "S4", "S5", "S6", "S7"];

const RANGEES_PLATEFORMES: PlateformeEditoriale[][] = [
  ["instagram-feed", "facebook", "x", "linkedin"],
  ["tiktok", "instagram-story", "instagram-reel", "snapchat", "pinterest"],
];

/** Les plateformes qu'un community manager tient réellement. */
export const PLATEFORMES_CM: PlateformeEditoriale[] = [
  "instagram-feed",
  "instagram-story",
  "instagram-reel",
  "tiktok",
  "linkedin",
  "x",
  "facebook",
  "snapchat",
  "pinterest",
];

/**
 * LES PLATEFORMES D'UNE AGENCE MARKETING, ET SON RYTHME.
 *
 * 14/09/2026 (JP) : « marketing et GEO sont censes etre presentes comme le
 * template agence PAR PLATEFORME, sauf qu'il s'agit de pub, et qu'il y a Google
 * Ads en plus », puis « la difference aussi, c'est qu'une fois par semaine »,
 * « que ce soit les articles SEO/GEO, le planning, et pareil pour marketing ».
 *
 * DEUX ECARTS AVEC L'AGENCE DE COMMUNICATION, et ils vont ensemble :
 *   - les plateformes sont des REGIES, pas des reseaux editoriaux. Le format
 *     ne se transpose pas : une crea Meta en 4:5 est illisible en Shopping
 *     Google, ou l'image doit etre nue sur blanc.
 *   - le rythme est HEBDOMADAIRE. Une campagne posee le lundi doit vivre assez
 *     longtemps pour qu'on sache si elle marche. La remplacer chaque matin,
 *     c'est n'avoir jamais de mesure : on change ce qu'on n'a pas eu le temps
 *     de juger.
 */
export const PLATEFORMES_ADS: PlateformeEditoriale[] = [
  "meta-ads",
  "google-ads",
  "tiktok-ads",
  "pinterest-ads",
  "linkedin-ads",
  "snapchat-ads",
];

/**
 * LES SUPPORTS D'UNE AGENCE SEO/GEO.
 *
 * Un article n'a pas de « reseau » : il a un endroit ou il est trouve. SEO vise
 * le moteur de recherche, GEO vise la citation par un assistant. Ce sont deux
 * ecritures differentes, donc deux colonnes, pas une case « article ».
 */
export const PLATEFORMES_EDITORIALES: PlateformeEditoriale[] = [
  "google-ads",
];

/** Le jeu de plateformes d'un metier. */
export function plateformesDuMetier(discipline?: string): PlateformeEditoriale[] {
  if (discipline === "marketing") return PLATEFORMES_ADS;
  return PLATEFORMES_CM;
}

/** Vrai quand le metier travaille a la SEMAINE, pas a la journee. */
export function rythmeHebdomadaire(discipline?: string): boolean {
  return discipline === "marketing" || discipline === "journaliste";
}

export type SemaineCM = Record<PlateformeEditoriale, number>[];

/** Une publication du jour : son réseau, son rang dans ce réseau, sa place. */
export interface PublicationJour {
  plateforme: PlateformeEditoriale;
  /** Rang dans la base de prompts du réseau. */
  index: number;
  /** Place dans la journée : c'est elle qui porte la photo. */
  slot: number;
  prompt: string;
  produit?: ProduitSemaine;
  contenu?: TextePublicationSociale;
  /** Le jour de la semaine (0 = lundi) : la reprise d'images en a besoin. */
  jour?: number;
}

/**
 * LE MODE AGENCE EMBAUCHÉE (30/09/2026, JP : « elle lance sa semaine, valide
 * ou corrige une journée, puis ça part »). Absent, la semaine reste la vitrine
 * d'avant : rien ne change pour les pages qui ne l'ont pas.
 */
export interface OptionsAgenceSemaine {
  /** Lundi de la semaine affichée, AAAA-MM-JJ. */
  weekStart: string;
  /** Réseaux Upload-Post reliés et utilisables (instagram, tiktok…). */
  reseauxRelies: ReadonlySet<string>;
  /** L'état serveur d'une case (publication comprise), s'il existe. */
  etatDe?: (jour: number, plateforme: PlateformeEditoriale, index: number) => CaseAgence | undefined;
  /** Plan par défaut borné par le plafond et les réseaux reliés. */
  planParDefaut?: Record<string, number>[];
  onValiderJour?: (jour: number) => void;
  onRelier?: () => void;
  onReessayer?: (publicationId: string) => void;
  /** Branché par la page : le bouton « Lancer ma semaine » du bandeau l'appelle. */
  refLancement?: { current: (() => Promise<void>) | null };
  /** Résumé remonté à la page : à écrire, faites, en cours. */
  onResume?: (resume: { aEcrire: number; faites: number; total: number; enCours: boolean }) => void;
  /** Appelé quand le lancement a fini de rédiger : la page propose la semaine. */
  onSemainePrete?: () => void;
  validationEnCours?: boolean;
  maintenant?: Date;
}

/** Le plan borné de l'agence, complété de zéros sur les autres formats. */
function semaineAgenceParDefaut(plan: Record<string, number>[]): SemaineCM {
  return JOURS.map((_, jour) => {
    const vide = Object.fromEntries(
      [...PLATEFORMES_CM, ...PLATEFORMES_ADS].map((p) => [p, 0]),
    ) as Record<PlateformeEditoriale, number>;
    for (const [format, nombre] of Object.entries(plan[jour] ?? {})) {
      (vide as Record<string, number>)[format] = nombre;
    }
    return vide;
  });
}

/** 3 stories par défaut, les autres formats une fois. */
/**
 * LE DEFAUT D'UN METIER HEBDOMADAIRE : tout tombe le lundi.
 *
 * Le reste de la semaine sert a MESURER, pas a reproduire. Etaler six creatives
 * sur six jours donne six mesures qui commencent a six moments differents, et
 * plus aucune comparaison possible.
 */
export function semaineHebdoParDefaut(plateformes: PlateformeEditoriale[]): SemaineCM {
  return JOURS.map((_, jour) => {
    const vide = Object.fromEntries(
      [...PLATEFORMES_CM, ...PLATEFORMES_ADS].map((p) => [p, 0]),
    ) as Record<PlateformeEditoriale, number>;
    if (jour !== 0) return vide;
    /* DEUX par plateforme, pas une. JP : « pas une, il peut y avoir
       plusieurs pour tester laquelle marche ». Une seule creative ne se
       compare a rien. Deux, lancees le meme jour sur la meme plateforme,
       se comparent : tout le reste est identique, donc l'ecart vient de
       la creative. La marchande peut monter ou descendre ce nombre. */
    for (const p of plateformes) vide[p] = 2;
    return vide;
  });
}

export function semaineParDefaut(_nom: string): SemaineCM {
  return JOURS.map(() => {
    return {
      "instagram-feed": 1,
      "instagram-story": 3,
      "instagram-reel": 1,
      tiktok: 1,
      linkedin: 1,
      x: 1,
      facebook: 1,
      snapchat: 1,
      pinterest: 1,
      "google-ads": 0,
      "meta-ads": 0,
    } as Record<PlateformeEditoriale, number>;
  });
}

const pluriel = (p: PlateformeEditoriale, n: number) => {
  if (p === "instagram-story") return n > 1 ? "stories" : "story";
  if (p === "instagram-feed" || p === "facebook") return n > 1 ? "posts" : "post";
  if (p === "instagram-reel") return n > 1 ? "reels" : "reel";
  if (p === "snapchat") return n > 1 ? "snaps" : "snap";
  if (p === "pinterest") return n > 1 ? "épingles" : "épingle";
  return CONFIG_PLATEFORME[p].court;
};

export function SemaineCommunityManager({
  profileId,
  nom,
  galerie = [],
  prioritaire = false,
  onOuvrirContenu,
  promptDe,
  onEnregistrerPrompt,
  onRefaireJournee,
  onRefairePhoto,
  catalogueProduits = [],
  produitsSemaine = [],
  onBasculerProduit,
  contenuDe,
  onEnregistrerContenu,
  onGenererContenu,
  planEnregistre,
  onEnregistrerPlan,
  equipe,
  metier,
  agence,
}: {
  profileId: string;
  nom: string;
  galerie?: string[];
  prioritaire?: boolean;
  onOuvrirContenu?: (plateforme: PlateformeEditoriale, image?: string, contenu?: TextePublicationSociale) => void;
  /** Le prompt retenu pour un emplacement ; à défaut, celui livré. */
  promptDe?: (plateforme: PlateformeEditoriale, index: number) => string;
  onEnregistrerPrompt?: (
    plateforme: PlateformeEditoriale,
    index: number,
    texte: string,
  ) => Promise<boolean> | void;
  /** Relance toutes les publications du jour, dans l'ordre du plan. */
  onRefaireJournee?: (publications: PublicationJour[], libelleJour: string) => void;
  /** Relance une seule publication, avec le prompt édité. */
  onRefairePhoto?: (publication: PublicationJour) => void;
  catalogueProduits?: ProduitAgenceSociale[];
  produitsSemaine?: ProduitSemaine[];
  onBasculerProduit?: (produit: ProduitAgenceSociale) => void;
  contenuDe?: (jour: number, plateforme: PlateformeEditoriale, index: number) => TextePublicationSociale | undefined;
  onEnregistrerContenu?: (contenu: TextePublicationSociale) => Promise<boolean>;
  onGenererContenu?: (contenu: TextePublicationSociale, productName: string) => Promise<{ ok: boolean; message?: string }>;
  /** Le plan lu dans `social_week_plan`, ou absent si la semaine est vierge. */
  planEnregistre?: SemaineCM | null;
  /** Appelé à chaque cran de réglage, pour que le plan survive à l'onglet. */
  onEnregistrerPlan?: (jour: number, plateforme: PlateformeEditoriale, nombre: number) => void;
  /** L'équipe de l'agence, pour montrer qui tient quel réseau pendant le travail. */
  equipe?: MembreAgenceSociale[];
  /** Le métier : il décide des plateformes ET du rythme. */
  metier?: string;
  agence?: OptionsAgenceSemaine;
}) {
  const { t } = useTranslation();
  /* 14/09/2026 (JP) : « où retrouve-t-il le planning s'il quitte la page ? »

     Le plan vivait dans ce seul `useState`. Au rechargement, `semaineParDefaut`
     le recalculait : si le réglage avait changé, les créneaux ne tombaient plus
     au même endroit et les textes déjà enregistrés se retrouvaient sur les
     mauvaises cases, `slot_index` n'étant qu'un rang d'empilement. Le travail
     n'était pas perdu, il était DÉPLACÉ, ce qui est pire : ça ne se voit pas.

     `planEnregistre` vient désormais de `social_week_plan`. Le défaut ne sert
     plus que quand la marchande n'a jamais rien réglé pour cette semaine. */
  /* 14/09/2026 (JP) : « marketing et GEO presentes comme le template agence PAR
     PLATEFORME, sauf qu'il s'agit de pub », et « la difference, c'est une fois
     par semaine ». Le metier decide de DEUX choses a la fois : les plateformes
     tenues, et le rythme. Les separer ferait un planning quotidien de regies
     publicitaires, qui n'a aucun sens. */
  const plateformes = plateformesDuMetier(metier);
  /* Un seul endroit decide du vocabulaire, pour que le titre, le bouton
     « Preparer » et le nom du fichier telecharge ne se contredisent jamais. */
  const rangs = rythmeHebdomadaire(metier) ? SEMAINES : JOURS;
  const rangsCourts = rythmeHebdomadaire(metier) ? SEMAINES_COURTES : JOURS_COURTS;
  /* La base ne contient que les cases reglees : les autres gardent le defaut,
     sinon un seul reglage videait le reste de la semaine. */
  const fusionner = (plan: SemaineCM | null | undefined): SemaineCM => {
    const defaut = agence?.planParDefaut
      ? semaineAgenceParDefaut(agence.planParDefaut)
      : rythmeHebdomadaire(metier) ? semaineHebdoParDefaut(plateformes) : semaineParDefaut(nom);
    if (!plan) return defaut;
    return defaut.map((jourDefaut, i) => {
      const enregistre = (plan[i] ?? {}) as Record<string, number | undefined>;
      const fusion = { ...jourDefaut } as Record<string, number>;
      for (const [cle, valeur] of Object.entries(enregistre)) {
        if (typeof valeur === "number") fusion[cle] = valeur;
      }
      return fusion;
    }) as SemaineCM;
  };
  const [semaine, setSemaine] = useState<SemaineCM>(() => fusionner(planEnregistre));

  /* La base fait autorité dès qu'elle a quelque chose à dire. Sans cette
     reprise, le premier rendu montre le défaut et l'écrase ensuite : la
     marchande voit son réglage clignoter puis revenir. */
  useEffect(() => {
    if (planEnregistre || agence?.planParDefaut) setSemaine(fusionner(planEnregistre));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planEnregistre, agence?.planParDefaut]);
  const [jour, setJour] = useState(() => {
    const numero = new Date().getDay();
    return numero === 0 ? 6 : numero - 1;
  });
  const [reglage, setReglage] = useState(false);
  const [edition, setEdition] = useState<PublicationJour | null>(null);
  const [texteEdite, setTexteEdite] = useState("");
  const [legendeEditee, setLegendeEditee] = useState("");
  const [hashtagsEdites, setHashtagsEdites] = useState("");
  const [appelEdite, setAppelEdite] = useState("");
  const [texteImageEdite, setTexteImageEdite] = useState("");
  const [produitEdite, setProduitEdite] = useState<string>("");
  const [heureEditee, setHeureEditee] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);
  const [telechargement, setTelechargement] = useState(false);
  const rail = useRef<HTMLDivElement | null>(null);

  /* L'ordre compte : la version du marchand d'abord, puis les prompts propres
     au métier du profil (une agence coiffure ne reprend pas ceux d'un produit),
     puis la base commune. */
  const resoudrePrompt = (plateforme: PlateformeEditoriale, index: number) => {
    const choisi = promptDe?.(plateforme, index) ?? promptDePlateforme(plateforme, index, profileId) ?? "";
    /* E5 (règle de JP) : un avant/après ne se montre qu'avec de vraies
       photos. L'agence génère ses visuels : elle saute ces prompts et prend
       le suivant du même réseau (le prompt X n° 1 était un avant/après). */
    if (!agence || !estAvantApres(choisi)) return choisi;
    return promptSansAvantApres(promptsDePlateforme(plateforme, profileId), index) ?? "";
  };

  /* Le plan d'un jour : l'ordre est stable, donc une même case redonne toujours
     le même prompt et la même photo tant que le réglage ne change pas. */
  const planPour = useCallback(
    (jourCible: number): PublicationJour[] => {
      const sortie: PublicationJour[] = [];
      for (const plateforme of plateformes) {
        const nombre = semaine[jourCible][plateforme];
        for (let index = 0; index < nombre; index++) {
          const existant = contenuDe?.(jourCible, plateforme, index);
          const produit = produitsSemaine.find((item) => item.id === existant?.product_id)
            ?? (produitsSemaine.length ? produitsSemaine[sortie.length % produitsSemaine.length] : undefined);
          sortie.push({
            plateforme,
            index,
            slot: sortie.length,
            prompt: resoudrePrompt(plateforme, index),
            produit,
            contenu: existant,
            jour: jourCible,
          });
        }
      }
      return sortie;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [semaine, promptDe, contenuDe, produitsSemaine],
  );

  const plan = useMemo<PublicationJour[]>(() => planPour(jour), [planPour, jour]);

  /* PRÉPARER LA JOURNÉE, ET LA VOIR SE PRÉPARER.
     14/09/2026 (JP) : « je dois pouvoir prévoir les postes pour aujourd'hui, et
     dans l'animation on voit Lucie apparaître, puis chaque réseau faire le job ».

     Les cases se remplissent une par une, dans l'ordre du plan, et chaque
     bascule suit une VRAIE réponse. Séquentiel et non parallèle, pour deux
     raisons qui comptent plus que la vitesse : la marchande voit qui travaille
     à chaque instant, et neuf appels simultanés au modèle se font étrangler. */
  const [etatsJournee, setEtatsJournee] = useState<Record<string, EtatCase>>({});
  const [erreursJournee, setErreursJournee] = useState<Record<string, string>>({});
  const [journeeOuverte, setJourneeOuverte] = useState(false);

  const cleCase = (item: PublicationJour) => `${jour}:${item.plateforme}:${item.index}`;

  const casesJournee = useMemo<CaseJournee[]>(
    () => plan.map((item) => {
      const cle = `${jour}:${item.plateforme}:${item.index}`;
      /* Un texte déjà en base vaut « faite », même sans passage par le bouton :
         l'écran doit refléter ce qui EXISTE, pas seulement ce qu'il a vu se
         faire pendant sa propre session. */
      const dejaEcrite = Boolean(item.contenu?.caption);
      return {
        cle,
        plateforme: item.plateforme,
        produit: item.produit?.name ?? null,
        etat: etatsJournee[cle] ?? (dejaEcrite ? "faite" : "attente"),
        image: item.contenu?.image_url ?? null,
        erreur: erreursJournee[cle] ?? null,
      };
    }),
    [plan, jour, etatsJournee, erreursJournee],
  );

  const preparerUne = useCallback(async (item: PublicationJour, jourCible: number = item.jour ?? jour) => {
    const cle = `${jourCible}:${item.plateforme}:${item.index}`;
    if (!onGenererContenu || !item.produit) {
      setEtatsJournee((e) => ({ ...e, [cle]: "ratee" }));
      setErreursJournee((e) => ({ ...e, [cle]: "Choisissez d’abord un produit avec une photo." }));
      return;
    }
    setEtatsJournee((e) => ({ ...e, [cle]: "encours" }));
    setErreursJournee((e) => ({ ...e, [cle]: "" }));
    const resultat = await onGenererContenu(
      {
        profile_id: profileId,
        day_index: jourCible,
        platform: item.plateforme,
        slot_index: item.index,
        product_id: item.produit.id,
        reference_url: item.produit.reference_url,
        prompt_exact: item.prompt,
        caption: "",
        hashtags: [],
        call_to_action: "",
        image_overlay: "",
        image_url: item.produit.reference_url ?? null,
      },
      item.produit.name,
    );
    setEtatsJournee((e) => ({ ...e, [cle]: resultat.ok ? "faite" : "ratee" }));
    /* Le motif est gardé et affiché sous la case. Une case ratée sans motif se
       relance à l'aveugle, et se repaie. */
    if (!resultat.ok) setErreursJournee((e) => ({ ...e, [cle]: resultat.message ?? "La rédaction a échoué." }));
  }, [jour, onGenererContenu, profileId]);

  const preparerJournee = useCallback(async () => {
    setJourneeOuverte(true);
    for (const item of plan) {
      /* Ce qui est déjà écrit n'est pas refait : le repasser coûterait un
         crédit par case pour un texte qui existe. */
      if (item.contenu?.caption) continue;
      /* L'agence ne rédige pas pour un réseau que la marque n'a pas relié :
         le texte serait payé et ne partirait jamais. */
      if (agence && !formatRelie(item.plateforme, agence.reseauxRelies)) continue;
      await preparerUne(item);
    }
  }, [plan, preparerUne, agence]);

  /* LANCER MA SEMAINE (E5). Tous les jours à venir, dans l'ordre, case par
     case : seulement les réseaux reliés, jamais un jour passé, jamais ce qui
     est déjà écrit. La page annonce le nombre et le coût AVANT : `aLancer`
     est la même liste que celle qui sera rédigée, pas une estimation. */
  const lancementEnCours = useRef(false);
  const [lancement, setLancement] = useState<{ faites: number; total: number } | null>(null);
  const aLancer = useMemo(() => {
    if (!agence) return [] as PublicationJour[];
    const sortie: PublicationJour[] = [];
    for (let j = 0; j < 7; j++) {
      if (jourPasse(agence.weekStart, j, agence.maintenant)) continue;
      for (const item of planPour(j)) {
        if (item.contenu?.caption) continue;
        if (!formatRelie(item.plateforme, agence.reseauxRelies)) continue;
        sortie.push(item);
      }
    }
    return sortie;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agence?.weekStart, agence?.reseauxRelies, agence?.maintenant, planPour]);

  const lancerSemaine = useCallback(async () => {
    if (lancementEnCours.current) return;
    lancementEnCours.current = true;
    const liste = aLancer;
    setLancement({ faites: 0, total: liste.length });
    try {
      for (const [rang, item] of liste.entries()) {
        await preparerUne(item, item.jour);
        setLancement({ faites: rang + 1, total: liste.length });
      }
      agence?.onSemainePrete?.();
    } finally {
      lancementEnCours.current = false;
      setLancement(null);
    }
  }, [aLancer, preparerUne, agence]);

  useEffect(() => {
    if (agence?.refLancement) agence.refLancement.current = lancerSemaine;
  }, [agence?.refLancement, lancerSemaine]);

  useEffect(() => {
    agence?.onResume?.({
      aEcrire: aLancer.length,
      faites: lancement?.faites ?? 0,
      total: lancement?.total ?? aLancer.length,
      enCours: lancement !== null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aLancer.length, lancement]);

  /* Télécharger : la publication ouverte, le jour, le reste de la semaine ou
     la semaine entière — image ET texte, dans une seule archive. */
  const telecharger = async (jours: number[], libelle: string) => {
    setTelechargement(true);
    try {
      const publications: PublicationTelechargeable[] = [];
      for (const jourCible of jours) {
        for (const item of planPour(jourCible)) {
          publications.push({
            jour: jourCible,
            jourLibelle: rangs[jourCible],
            plateforme: item.plateforme,
            index: item.index,
            produit: item.produit?.name ?? null,
            imageUrl: item.contenu?.image_url ?? (jourCible === jour ? galerie[item.slot] : null) ?? null,
            legende: item.contenu?.caption,
            hashtags: item.contenu?.hashtags,
            appelAction: item.contenu?.call_to_action,
            texteImage: item.contenu?.image_overlay,
            prompt: item.prompt,
          });
        }
      }
      if (!publications.length) {
        toast.error("Rien à télécharger sur cette période.");
        return;
      }
      const resultat = await telechargerPublications(
        publications,
        `${nom.split(" ")[0].toLowerCase()}-${libelle}`,
      );
      toast.success(
        resultat.sansImage
          ? `${resultat.total} publications téléchargées, ${resultat.sansImage} sans image.`
          : `${resultat.total} publications téléchargées.`,
      );
    } catch (erreur) {
      toast.error(erreur instanceof Error ? erreur.message : "Le téléchargement a échoué.");
    } finally {
      setTelechargement(false);
    }
  };

  const regler = (jourCible: number, p: PlateformeEditoriale, delta: number) =>
    setSemaine((ancienne) => {
      const suivante = ancienne.map((j, index) =>
        index === jourCible ? { ...j, [p]: Math.max(0, Math.min(6, j[p] + delta)) } : j,
      );
      /* Enregistré à chaque cran, pas à un clic « Valider » qui n'existe pas.
         La marchande règle et s'en va : sans ceci, son réglage meurt avec
         l'onglet. L'échec est silencieux côté écran mais tracé en console :
         un réglage qui ne part pas ne doit pas bloquer celui qui suit. */
      onEnregistrerPlan?.(jourCible, p, suivante[jourCible][p]);
      return suivante;
    });

  const ouvrirEdition = (publication: PublicationJour) => {
    setEdition(publication);
    setTexteEdite(publication.prompt);
    setLegendeEditee(publication.contenu?.caption ?? "");
    setHashtagsEdites(publication.contenu?.hashtags.join(" ") ?? "");
    setAppelEdite(publication.contenu?.call_to_action ?? "");
    setTexteImageEdite(publication.contenu?.image_overlay ?? "");
    setProduitEdite(publication.produit?.id ?? "");
    setHeureEditee(heureCourte(publication.contenu?.heure_prevue ?? agence?.etatDe?.(jour, publication.plateforme, publication.index)?.heure_prevue) ?? "");
  };

  /* E7 : une publication déjà partie ne se corrige plus ici. Le lien suffit. */
  const publicationEditee = edition ? agence?.etatDe?.(jour, edition.plateforme, edition.index)?.publication ?? null : null;
  const dejaPubliee = publicationEditee?.etat === "publiee";

  const contenuEdite = (): TextePublicationSociale | null => {
    if (!edition) return null;
    const produit = produitsSemaine.find((item) => item.id === produitEdite);
    const hashtags = hashtagsEdites.split(/[\s,]+/).map((item) => item.trim()).filter((item) => item.startsWith("#"));
    const base: TextePublicationSociale = {
      profile_id: profileId,
      day_index: jour,
      platform: edition.plateforme,
      slot_index: edition.index,
      product_id: produit?.id ?? null,
      reference_url: produit?.reference_url ?? null,
      prompt_exact: texteEdite.trim(),
      caption: legendeEditee.trim(),
      /* La borne du réseau, pas un 8 pour tous : X en garde deux, Pinterest
         aucun (HASHTAGS_PAR_RESEAU, la même table que le serveur). */
      hashtags: agence ? bornerHashtags(edition.plateforme, hashtags) : hashtags.slice(0, 8),
      call_to_action: appelEdite.trim(),
      image_overlay: texteImageEdite.trim(),
      image_url: galerie[edition.slot] ?? null,
    };
    if (!agence) return base;
    /* En agence, le visuel de la case est celui qui partira : on le garde tel
       quel, avec sa nature (vraie photo ou image générée). */
    const imageCase = edition.contenu?.image_url ?? null;
    return {
      ...base,
      image_url: imageCase ?? galerie[edition.slot] ?? null,
      image_generee: imageCase ? Boolean(edition.contenu?.image_generee) : Boolean(galerie[edition.slot]),
      heure_prevue: heureEditee ? `${heureEditee}:00` : null,
    };
  };

  /* E7 : une case déjà programmée (publication encore « prevue ») est
     corrigée en base, pas seulement dans la semaine. Le serveur n'a qu'une
     porte pour ça : revalider le jour, qui met à jour la publication prévue
     (texte, média, heure) au lieu d'en créer une seconde. */
  const repercuterCorrection = () => {
    if (agence?.onValiderJour && publicationEditee?.etat === "prevue") agence.onValiderJour(jour);
  };

  const enregistrer = async () => {
    if (!edition) return;
    setEnregistrement(true);
    try {
      const promptOk = onEnregistrerPrompt ? await onEnregistrerPrompt(edition.plateforme, edition.index, texteEdite.trim()) : true;
      const contenu = contenuEdite();
      const contenuOk = contenu && onEnregistrerContenu ? await onEnregistrerContenu(contenu) : true;
      if (promptOk === false || contenuOk === false) {
        toast.error("La publication n’a pas pu être enregistrée.");
        return;
      }
      repercuterCorrection();
      setEdition(null);
    } finally {
      setEnregistrement(false);
    }
  };

  const genererTextes = async () => {
    const contenu = contenuEdite();
    const produit = produitsSemaine.find((item) => item.id === produitEdite);
    if (!contenu || !produit || !onGenererContenu) {
      toast.error("Choisissez d’abord un produit de la semaine avec sa référence.");
      return;
    }
    setEnregistrement(true);
    try {
      const resultat = await onGenererContenu(contenu, produit.name);
      if (!resultat.ok) {
        toast.error(resultat.message || "La rédaction n’a pas abouti.");
        return;
      }
      repercuterCorrection();
      setEdition(null);
      toast.success("Publication rédigée et enregistrée.");
    } finally {
      setEnregistrement(false);
    }
  };

  /* Enregistre le prompt édité puis régénère cette seule publication avec :
     le but est qu'un prompt modifié produise aussitôt sa nouvelle photo. */
  const enregistrerPuisRefaire = async () => {
    if (!edition || !onRefairePhoto) return;
    setEnregistrement(true);
    try {
      if (onEnregistrerPrompt) {
        const ok = await onEnregistrerPrompt(edition.plateforme, edition.index, texteEdite.trim());
        if (ok === false) return;
      }
      const contenu = contenuEdite();
      if (contenu && onEnregistrerContenu) {
        const ok = await onEnregistrerContenu(contenu);
        if (!ok) return;
      }
      onRefairePhoto({
        ...edition,
        prompt: texteEdite.trim(),
        produit: produitsSemaine.find((item) => item.id === produitEdite),
        contenu: contenu ?? undefined,
      });
      setEdition(null);
    } finally {
      setEnregistrement(false);
    }
  };

  return (
    <div className="min-w-0">
      {/* À 375 px, quatre boutons ne tiennent pas à côté du titre : la
          rangée passe dessous au lieu d'écraser le titre en colonne d'un mot
          et de couper « Télécharger » hors du cadre. */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold text-foreground">
            {/* « La semaine d'Isadora », pas « de Isadora » (relecture du 10/10). */}
            La semaine {deMarque(nom.split(" ")[0])}
          </p>
          <p className="whitespace-nowrap text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
            Ce qui se publie chaque jour
          </p>
        </div>
        <div className="flex min-w-0 flex-wrap items-center gap-1">
          {agence?.onValiderJour && !jourPasse(agence.weekStart, jour, agence.maintenant) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 rounded-[9px] bg-foreground px-2 text-[10px] text-background hover:bg-foreground/90 hover:text-background"
              onClick={() => agence.onValiderJour?.(jour)}
              disabled={agence.validationEnCours || !plan.some((item) => item.contenu?.caption)}
            >
              {agence.validationEnCours ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <CheckCheck className="mr-1.5 h-3 w-3" />}
              {t("agence.semaine.validerJour", "Valider {{jour}}", { jour: rangs[jour].toLowerCase() })}
            </Button>
          )}
          {onGenererContenu && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 rounded-[9px] bg-background px-2 text-[10px]"
              onClick={() => { void preparerJournee(); }}
              disabled={casesJournee.some((c) => c.etat === "encours")}
            >
              <Sparkles className="mr-1.5 h-3 w-3" />
              Préparer {rangs[jour].toLowerCase()}
            </Button>
          )}
          {onRefaireJournee && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 rounded-[9px] px-2 bg-background text-[10px]"
              onClick={() => onRefaireJournee(plan, rangs[jour])}
            >
              <RefreshCw className="mr-1.5 h-3 w-3" />
              Refaire {rangs[jour].toLowerCase()}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 rounded-[9px] px-2 bg-background text-[10px]" disabled={telechargement}>
                {telechargement ? (
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                ) : (
                  <Download className="mr-1.5 h-3 w-3" />
                )}
                Télécharger
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-[11px]">
              <DropdownMenuItem onClick={() => void telecharger([jour], rangs[jour].toLowerCase())}>
                {rangs[jour]} seulement
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  void telecharger(
                    JOURS.map((_, index) => index).filter((index) => index >= jour),
                    "reste-de-la-semaine",
                  )
                }
              >
                Le reste de la semaine
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void telecharger(JOURS.map((_, index) => index), "semaine")}>
                La semaine entière
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 rounded-[9px] px-2 bg-background text-[10px]"
            onClick={() => setReglage((v) => !v)}
          >
            <SlidersHorizontal className="mr-1.5 h-3 w-3" />
            {reglage ? "Terminer" : "Régler la semaine"}
          </Button>
        </div>
      </div>

      {onBasculerProduit && (
        <ProduitsSemaine produits={produitsSemaine} catalogue={catalogueProduits} onBasculer={onBasculerProduit} />
      )}

      {/* La planche ne s'ouvre qu'à la demande : elle doublerait sinon la
          grille de la semaine juste en dessous, sans rien ajouter. */}
      {journeeOuverte && (
        <div className="mt-3">
          <PlancheJournee
            libelleJour={`${rangs[jour]} · ${nom.split(" ")[0]}`}
            cases={casesJournee}
            equipe={equipe ?? equipeAgenceParDefaut(nom)}
            onRefaire={(cle) => {
              const item = plan.find((p) => `${jour}:${p.plateforme}:${p.index}` === cle);
              if (item) void preparerUne(item);
            }}
          />
        </div>
      )}

      <div className="mt-3 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {rangsCourts.map((libelle, index) => {
          /* E5 : un jour passé reste consultable mais grisé ; il ne se lance
             plus et ne se valide plus, il partirait en rafale au cron suivant.
             Grisé veut dire le gris de la charte (#777b7f), pas une opacité :
             un libellé à 40 % sur du blanc est délavé, donc illisible. */
          const passe = agence ? jourPasse(agence.weekStart, index, agence.maintenant) : false;
          return (
            <button
              key={libelle}
              type="button"
              onClick={() => setJour(index)}
              aria-pressed={jour === index}
              title={passe ? t("agence.semaine.jourPasse", "Jour passé") : undefined}
              className={cn(
                "shrink-0 rounded-[9px] px-3 py-1.5 text-[10px] font-semibold transition-colors",
                /* Le jour choisi est une ligne choisie : le vert de l'élu et
                   le texte noir, pas un aplat noir (remarque de JP, 30/09). */
                jour === index ? "bg-[#e1f3c5] text-black" : "bg-background text-foreground",
                passe && jour !== index && "text-[#777b7f]",
              )}
            >
              {libelle}
            </button>
          );
        })}
      </div>

      {reglage && (
        <div className="mt-3 flex gap-2 overflow-x-auto bg-background p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PLATEFORMES_CM.map((p) => (
            <div key={p} className="flex shrink-0 items-center gap-1">
              <span className="text-[9px] text-foreground">{CONFIG_PLATEFORME[p].court}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => regler(jour, p, -1)} aria-label={`Retirer ${CONFIG_PLATEFORME[p].libelle} le ${rangs[jour]}`}><Minus className="h-3 w-3" /></Button>
              <span className="w-3 text-center text-[9px] font-semibold tabular-nums">{semaine[jour][p]}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => regler(jour, p, 1)} aria-label={`Ajouter ${CONFIG_PLATEFORME[p].libelle} le ${rangs[jour]}`}><Plus className="h-3 w-3" /></Button>
            </div>
          ))}
        </div>
      )}

      {/* Un seul carrousel sur deux étages. Les deux rangées défilent ensemble,
          dans l'ordre du modèle validé, sans modifier l'ordre de génération. */}
      <div className="mt-4">
        <div className="mb-2 flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 bg-background" onClick={() => rail.current?.scrollBy({ left: -420, behavior: "smooth" })} aria-label="Contenus précédents">
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 bg-background" onClick={() => rail.current?.scrollBy({ left: 420, behavior: "smooth" })} aria-label="Contenus suivants">
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div ref={rail} className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="w-max min-w-full space-y-8">
            {RANGEES_PLATEFORMES.map((rangee, indexRangee) => (
              <div key={indexRangee} className="flex snap-x snap-mandatory items-start gap-8">
                {rangee.map((p) => {
                  const publications = plan.filter((item) => item.plateforme === p);
                  if (!publications.length) return null;
                  const { libelle } = CONFIG_PLATEFORME[p];
                  return (
                    <section key={p} className="shrink-0 snap-start">
                      <p className="mb-2 text-[10px] font-medium text-foreground">
                        {libelle}
                        <span className="ml-1.5 text-[9px] font-normal text-muted-foreground">
                          {publications.length} {pluriel(p, publications.length)}
                        </span>
                      </p>
                      <div className="flex gap-2">
                        {publications.map((publication) => {
                          /* En agence, la case montre le visuel qui PARTIRA
                             (image_url de la case), pas la photo du
                             portfolio au même rang. Une case d'un réseau non
                             relié n'est plus voilée à 50 % : délavée, elle
                             devenait illisible, et la fiche dessous dit déjà
                             « Ne partira pas : Réseau non relié ». */
                          const image = (agence ? publication.contenu?.image_url : undefined) ?? galerie[publication.slot];
                          return (
                            <div key={`${p}-${jour}-${publication.index}`} className="relative shrink-0">
                              <button
                                type="button"
                                 onClick={() => onOuvrirContenu?.(p, image, publication.contenu)}
                                aria-label={`Agrandir le contenu ${libelle}, ${rangs[jour]}`}
                                className={cn(
                                  "block overflow-hidden rounded-lg bg-background text-left transition-opacity hover:opacity-90",
                                  tailleCadre(p),
                                )}
                              >
                                <CadreContenu
                                  plateforme={p}
                                  image={image}
                                  index={publication.index}
                                  prioritaire={prioritaire}
                                  legende={publication.contenu?.caption}
                                  hashtags={agence && publication.contenu ? bornerHashtags(p, publication.contenu.hashtags) : publication.contenu?.hashtags}
                                  appelAction={publication.contenu?.call_to_action}
                                  texteImage={publication.contenu?.image_overlay}
                                  /* Règle de JP : la mention se pose SUR l'image
                                     générée, jamais sur une vraie photo produit. */
                                  mention={agence && publication.contenu?.image_generee ? t("agence.case.imageIa", MENTION_IMAGE_IA) : undefined}
                                />
                              </button>
                              {agence && (
                                <FicheCase
                                  plateforme={p}
                                  publication={publication}
                                  image={image ?? null}
                                  etatServeur={agence.etatDe?.(jour, p, publication.index)}
                                  etatLocal={etatsJournee[`${jour}:${p}:${publication.index}`]}
                                  erreurLocale={erreursJournee[`${jour}:${p}:${publication.index}`] || null}
                                  motif={motifBlocage(
                                    { platform: p, image_url: image ?? null, day_index: jour },
                                    agence.weekStart,
                                    agence.reseauxRelies,
                                    agence.maintenant,
                                  )}
                                  onRelier={agence.onRelier}
                                  onReessayer={agence.onReessayer}
                                />
                              )}
                               {(onEnregistrerPrompt || onEnregistrerContenu) && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-1 top-1 z-10 h-5 w-5 bg-background/90 p-0 [&_svg]:!h-2.5 [&_svg]:!w-2.5"
                                  onClick={() => ouvrirEdition(publication)}
                                  aria-label={`Modifier le prompt ${libelle} ${publication.index + 1}`}
                                >
                                  <Pencil />
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!edition} onOpenChange={(ouvert) => !ouvert && setEdition(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-sm">
              {edition ? `${CONFIG_PLATEFORME[edition.plateforme].libelle} · contenu ${edition.index + 1}` : ""}
            </DialogTitle>
          </DialogHeader>
          {edition && (
            <>
              <p className="text-[10px] text-muted-foreground">
                {REGLES_PLATEFORME[edition.plateforme].nature}
              </p>
              <Textarea
                value={texteEdite}
                onChange={(e) => setTexteEdite(e.target.value)}
                rows={10}
                className="text-[11px]"
                aria-label="Prompt de cette publication"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label htmlFor="produit-publication" className="text-[9px]">Produit</Label>
                  <select id="produit-publication" value={produitEdite} onChange={(e) => setProduitEdite(e.target.value)} className="mt-1 h-9 w-full rounded-md bg-muted px-3 text-[10px] text-foreground">
                    <option value="">Produit à choisir</option>
                    {produitsSemaine.map((produit) => <option key={produit.id} value={produit.id}>{produit.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="appel-publication" className="text-[9px]">Appel à l’action</Label>
                  <Input id="appel-publication" value={appelEdite} onChange={(e) => setAppelEdite(e.target.value)} className="mt-1 h-9 text-[10px]" placeholder="À générer" />
                </div>
              </div>
              <div>
                <Label htmlFor="legende-publication" className="text-[9px]">Légende complète</Label>
                <Textarea id="legende-publication" value={legendeEditee} onChange={(e) => setLegendeEditee(e.target.value)} rows={4} className="mt-1 text-[10px]" placeholder="À générer" />
              </div>
              <div>
                <Label htmlFor="hashtags-publication" className="text-[9px]">Hashtags</Label>
                <Input id="hashtags-publication" value={hashtagsEdites} onChange={(e) => setHashtagsEdites(e.target.value)} className="mt-1 h-9 text-[10px]" placeholder="#produit #marque" />
              </div>
              {agence && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="heure-publication" className="text-[9px]">{t("agence.semaine.heure", "Heure de publication")}</Label>
                    <Input id="heure-publication" type="time" value={heureEditee} onChange={(e) => setHeureEditee(e.target.value)} className="mt-1 h-9 text-[10px]" />
                  </div>
                  {dejaPubliee && (
                    <div className="flex items-end">
                      <p className="text-[10px] font-medium text-foreground">
                        {t("agence.semaine.dejaPubliee", "Déjà publiée")}
                        {publicationEditee?.lien_post && (
                          <a href={publicationEditee.lien_post} target="_blank" rel="noreferrer" className="ml-2 underline">
                            {t("agence.semaine.voir", "Voir la publication")}
                          </a>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              )}
              {(edition.plateforme === "instagram-story" || edition.plateforme === "snapchat") && (
                <div>
                  <Label htmlFor="texte-image-publication" className="text-[9px]">Texte dans l’image</Label>
                  <Input id="texte-image-publication" value={texteImageEdite} onChange={(e) => setTexteImageEdite(e.target.value)} className="mt-1 h-9 text-[10px]" placeholder="Accroche courte" />
                </div>
              )}
            </>
          )}
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setEdition(null)}>Annuler</Button>
            {onGenererContenu && <Button variant="outline" size="sm" disabled={dejaPubliee || enregistrement || !texteEdite.trim() || !produitEdite} onClick={() => void genererTextes()}>Générer les textes</Button>}
            <Button variant="outline" size="sm" disabled={dejaPubliee || enregistrement || !texteEdite.trim()} onClick={() => void enregistrer()}>
              {enregistrement ? "Enregistrement…" : "Enregistrer"}
            </Button>
            {onRefairePhoto && (
              <Button size="sm" disabled={dejaPubliee || enregistrement || !texteEdite.trim()} onClick={() => void enregistrerPuisRefaire()}>
                <RefreshCw className="mr-1.5 h-3 w-3" />
                {enregistrement ? "Enregistrement…" : "Enregistrer et refaire la photo"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** La largeur du cadre d'un réseau : la fiche sous la case prend la même. */
function largeurCadre(plateforme: PlateformeEditoriale): string {
  return tailleCadre(plateforme).split(" ").find((c) => c.startsWith("w-")) ?? "w-[180px]";
}

/**
 * CE QUI PARTIRA, SOUS LA CASE (E6, E12).
 *
 * Réseau et format, produit, heure, état, puis le TEXTE EXACT tel que le
 * réseau le recevra (texteFinal : légende, appel à l'action, hashtags bornés,
 * mention IA si le visuel est généré). Une case publiée donne son lien, une
 * case en échec donne le motif du réseau et « Réessayer ». Une case qui ne
 * partira pas dit pourquoi, avec le vocabulaire du serveur.
 */
function FicheCase({
  plateforme,
  publication,
  image,
  etatServeur,
  etatLocal,
  erreurLocale,
  motif,
  onRelier,
  onReessayer,
}: {
  plateforme: PlateformeEditoriale;
  publication: PublicationJour;
  image: string | null;
  etatServeur?: CaseAgence;
  etatLocal?: EtatCase;
  erreurLocale: string | null;
  motif: string | null;
  onRelier?: () => void;
  onReessayer?: (publicationId: string) => void;
}) {
  const { t } = useTranslation();
  const contenu = publication.contenu;
  const config = CONFIG_PLATEFORME[plateforme];
  const heure = heureCourte(etatServeur?.heure_prevue ?? contenu?.heure_prevue);
  const affiche = etatServeur
    ? etatAffiche(etatServeur, erreurLocale)
    : etatLocal === "encours"
      ? etatAffiche({ etat: "en_cours", publication: null })
      : etatLocal === "ratee"
        ? etatAffiche({ etat: "echouee", publication: null }, erreurLocale)
        : etatAffiche({ etat: contenu?.caption ? "prete" : "a_ecrire", publication: null });
  const generee = Boolean(image && contenu?.image_generee);
  const texte = contenu?.caption
    ? texteFinal({
        caption: contenu.caption,
        call_to_action: contenu.call_to_action,
        hashtags: bornerHashtags(plateforme, contenu.hashtags),
        image_generee: generee,
      })
    : "";
  const publiee = affiche.cle === "publiee";
  const enEchec = affiche.cle === "echec_publication";

  return (
    <div className={cn("mt-1.5 space-y-1", largeurCadre(plateforme))}>
      {/* « Instagram Stories · Stories 9:16 » demande 135 px ; à côté de
          « Heure à fixer », il n'en restait que 109 dans le cadre de 169 et le
          libellé était coupé. Une largeur se règle sur le libellé le plus
          long : la ligne passe à la ligne au lieu de tronquer, l'heure
          descend dessous quand elle ne tient plus à côté. */}
      <p className="flex flex-wrap items-baseline justify-between gap-x-1 text-[9px] font-semibold text-foreground">
        <span className="min-w-0 break-words">{config.libelle} · {config.format}</span>
        <span className="shrink-0 tabular-nums text-[#777b7f]">{heure ?? t("agence.case.heureAFixer", "Heure à fixer")}</span>
      </p>
      <p className="break-words text-[9px] leading-snug text-[#777b7f]">
        {publication.produit?.name ?? t("agence.case.produitAChoisir", "Produit à choisir")}
      </p>
      {affiche.cle === "echouee" || enEchec ? (
        /* Un échec se lit en clair, motif du réseau compris : une phrase, pas
           une pastille qui se casse sur deux lignes. En noir semi-gras, pas en
           rouge : le 30/09, JP a relevé le rouge parmi les écarts de charte
           des écrans d'agents. Le mot « Échec » porte l'alerte. */
        <p className="text-[9px] font-semibold leading-snug text-black">
          {`${affiche.libelle}${"motif" in affiche && affiche.motif ? ` : ${affiche.motif}` : ""}`}
        </p>
      ) : (
        /* L'état est une étiquette de la charte (8,5 px, 600, capitales,
           +0,07em, rayon 5), blanche sur la pierre de la semaine : pas une
           gélule, pas un aplat noir. Seule « Publiée » passe au noir. */
        <p
          className={cn(
            "inline-block rounded-[5px] bg-background px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.07em]",
            publiee ? "text-black" : "text-[#777b7f]",
          )}
        >
          {affiche.libelle}
        </p>
      )}
      {texte ? (
        /* Le texte ENTIER, jamais rogné : la marque doit lire ce qui partira,
           hashtags et mention compris (E6). */
        <p className="whitespace-pre-line break-words text-[9px] leading-snug text-foreground" title={texte}>
          {texte}
        </p>
      ) : (
        <p className="text-[9px] italic text-[#777b7f]">{t("agence.case.texteAEcrire", "Texte à rédiger")}</p>
      )}
      {motif && !publiee && !etatServeur?.publication && (
        <p className="flex flex-wrap items-center gap-x-1 text-[9px] font-medium leading-snug text-[#777b7f]">
          {t("agence.case.nePartiraPas", "Ne partira pas : {{motif}}", { motif })}
          {motif === "Réseau non relié" && onRelier && (
            <button type="button" onClick={onRelier} className="inline-flex items-center gap-0.5 text-foreground underline">
              <Link2 className="h-2.5 w-2.5" />
              {t("agence.case.relier", "Relier")}
            </button>
          )}
        </p>
      )}
      {publiee && "lien" in affiche && affiche.lien && (
        <a href={affiche.lien} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[9px] font-medium text-foreground underline">
          <ExternalLink className="h-2.5 w-2.5" />
          {t("agence.case.voir", "Voir la publication")}
        </a>
      )}
      {enEchec && etatServeur?.publication && onReessayer && (
        <button
          type="button"
          onClick={() => onReessayer(etatServeur.publication!.id)}
          className="inline-flex items-center gap-1 text-[9px] font-medium text-foreground underline"
        >
          <RefreshCw className="h-2.5 w-2.5" />
          {t("agence.case.reessayer", "Réessayer")}
        </button>
      )}
    </div>
  );
}
