/**
 * L'AGENCE DE COM EMBAUCHÉE : types du contrat `agence-semaine` et règles
 * d'écran pures, testées sans navigateur (agenceSemaine.test.ts).
 *
 * 30/09/2026 (JP) : « comme dans la vraie vie, une marque embauche une agence
 * et ne gère plus ce domaine ». L'écran suit neuf états, dans l'ordre : aucune
 * agence, embauchée sans brief, aucun réseau relié, semaine vide, en
 * préparation, proposée, programmée, publiée ou en échec, agence arrêtée (qui
 * ramène au premier). `etapeAgence` décide lequel montrer, une seule fois.
 */
import type { PlateformeEditoriale } from "@lystes/components/mygpt/editorial-formats";

export type MandatAgence = "semi_autonome" | "autonome";
export type EtatValidationSemaine = "proposee" | "validee" | "partie_auto" | "refusee";
export type EtatCaseAgence = "a_ecrire" | "en_cours" | "prete" | "echouee" | "versee";
export type EtatPublication = "prevue" | "en_cours" | "publiee" | "echouee" | "annulee";

export interface BriefAgence {
  marque: string;
  objectifs: string;
  a_dire: string[];
  a_eviter: string[];
  cliente: string;
  avis: { nombre: number; note_moyenne: number | null; extraits: string[] };
  produits_phares: string[];
  lieu: string;
}

export type SourceBrief = "brand_knowledge" | "customer_avatars" | "reviews" | "products" | "contexte_creatif" | null;

export interface EmbaucheAgence {
  id: string;
  profile_id: string;
  discipline: string;
  mandat: MandatAgence;
  brief: Partial<BriefAgence>;
  etat: "active" | "arretee";
  embauchee_le: string | null;
}

export interface ValidationSemaine {
  etat: EtatValidationSemaine;
  proposee_le: string | null;
  depart_auto_le: string | null;
  decide_le: string | null;
}

export interface PublicationCase {
  id: string;
  etat: EtatPublication;
  lien_post: string | null;
  message_erreur: string | null;
  publie_le: string | null;
}

export interface CaseAgence {
  day_index: number;
  platform: PlateformeEditoriale;
  slot_index: number;
  etat: EtatCaseAgence;
  heure_prevue: string | null;
  calendrier_id: string | null;
  publication: PublicationCase | null;
}

export interface CompteSocial {
  plateforme: string;
  nom_profil: string | null;
  etat: string;
}

export interface EtatAgenceSemaine {
  embauche: EmbaucheAgence | null;
  validation: ValidationSemaine | null;
  cases: CaseAgence[];
  comptes: CompteSocial[];
  plafond: { par_mois: number | null; publiees_ce_mois: number };
}

export interface Ignoree {
  calendrierId?: string;
  dayIndex?: number;
  plateforme: string;
  motif: string;
}

/* ─────────────── Réseau relié ─────────────── */

/**
 * Le compte Upload-Post qui porte un format de l'agence. Les trois formats
 * Instagram partent du même compte : un seul « Instagram » relié les ouvre
 * tous. Snapchat n'a pas de publication par API : `null`, publication
 * manuelle, jamais proposé dans la file.
 */
export const RESEAU_DU_FORMAT: Partial<Record<PlateformeEditoriale, string>> = {
  "instagram-feed": "instagram",
  "instagram-story": "instagram",
  "instagram-reel": "instagram",
  tiktok: "tiktok",
  linkedin: "linkedin",
  x: "x",
  facebook: "facebook",
  pinterest: "pinterest",
};

export function reseauDuFormat(format: PlateformeEditoriale): string | null {
  return RESEAU_DU_FORMAT[format] ?? null;
}

/** Les comptes réellement utilisables : connectés, pas expirés ni en erreur. */
export function reseauxRelies(comptes: readonly CompteSocial[]): Set<string> {
  return new Set(comptes.filter((c) => c.etat === "connecte").map((c) => c.plateforme));
}

export function formatRelie(format: PlateformeEditoriale, relies: ReadonlySet<string>): boolean {
  const reseau = reseauDuFormat(format);
  return reseau !== null && relies.has(reseau);
}

/* ─────────────── Hashtags ─────────────── */

/**
 * Copie écran de `HASHTAGS_PAR_RESEAU` (supabase/functions/_shared/tons-reseaux.ts).
 * Le test d'égalité de agenceSemaine.test.ts échoue si les deux divergent.
 */
export const HASHTAGS_PAR_FORMAT: Record<string, { min: number; max: number }> = {
  "instagram-feed": { min: 5, max: 5 },
  "instagram-reel": { min: 5, max: 5 },
  "instagram-story": { min: 0, max: 3 },
  tiktok: { min: 3, max: 5 },
  facebook: { min: 0, max: 3 },
  linkedin: { min: 0, max: 3 },
  x: { min: 0, max: 2 },
  pinterest: { min: 0, max: 0 },
  snapchat: { min: 0, max: 0 },
};

export function bornerHashtags(format: PlateformeEditoriale, hashtags: readonly string[]): string[] {
  const borne = HASHTAGS_PAR_FORMAT[format] ?? { min: 0, max: 8 };
  return hashtags.slice(0, borne.max);
}

/* ─────────────── Plan par défaut ─────────────── */

/**
 * L'ordre dans lequel l'agence remplit une semaine bornée : le feed d'abord,
 * les stories ensuite. Le reel est absent : il exige une vidéo que la
 * semaine ne produit pas. Snapchat aussi : il ne part pas par l'API.
 */
export const PRIORITE_FORMATS: PlateformeEditoriale[] = [
  "instagram-feed",
  "instagram-story",
  "tiktok",
  "facebook",
  "linkedin",
  "x",
  "pinterest",
];

/**
 * Le plan par défaut sous le plafond de l'offre : au plus
 * `publications_par_mois / 4` publications dans la semaine, seulement sur les
 * réseaux reliés, étalées jour après jour. Sans plafond connu, une par jour et
 * par réseau relié, jamais plus de sept réseaux.
 *
 * Sans réseau relié, le plan est vide : la semaine n'invente pas de cases qui
 * ne pourront pas partir.
 */
export function planParDefautBorne(
  parMois: number | null,
  relies: ReadonlySet<string>,
): Record<string, number>[] {
  const jours: Record<string, number>[] = Array.from({ length: 7 }, () => ({}));
  const formats = PRIORITE_FORMATS.filter((f) => formatRelie(f, relies));
  if (!formats.length) return jours;
  const budget = parMois === null ? formats.length * 7 : Math.max(0, Math.floor(parMois / 4));
  let posees = 0;
  /* Un tour = un format par jour, du lundi au dimanche ; puis le format
     suivant. Le feed tombe donc chaque jour avant qu'une story ne s'ajoute. */
  for (const format of formats) {
    for (let jour = 0; jour < 7; jour++) {
      if (posees >= budget) return jours;
      jours[jour][format] = (jours[jour][format] ?? 0) + 1;
      posees++;
    }
  }
  return jours;
}

export function totalPlan(plan: readonly Record<string, number>[]): number {
  return plan.reduce((somme, jour) => somme + Object.values(jour).reduce((a, n) => a + (n || 0), 0), 0);
}

/* ─────────────── Dates ─────────────── */

/** La date (AAAA-MM-JJ) d'un jour de la semaine, en heure locale. */
export function dateDuJour(weekStart: string, dayIndex: number): Date {
  const [a, m, j] = weekStart.split("-").map(Number);
  return new Date(a, (m ?? 1) - 1, (j ?? 1) + dayIndex);
}

/** Un jour passé ne se prépare plus : il partirait en rafale au cron suivant. */
export function jourPasse(weekStart: string, dayIndex: number, maintenant: Date = new Date()): boolean {
  const jour = dateDuJour(weekStart, dayIndex);
  const aujourdhui = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
  return jour.getTime() < aujourdhui.getTime();
}

/** « 18:30 » à partir d'un `time` Postgres (« 18:30:00 ») ; `null` si absent. */
export function heureCourte(heure: string | null | undefined): string | null {
  if (!heure) return null;
  const m = /^(\d{1,2}):(\d{2})/.exec(heure);
  return m ? `${m[1].padStart(2, "0")}:${m[2]}` : null;
}

/** « le jeudi 2 octobre à 14:05 », dans la langue du navigateur. */
export function dateDepartLisible(iso: string | null | undefined, langue = "fr-FR"): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const jour = d.toLocaleDateString(langue, { weekday: "long", day: "numeric", month: "long" });
  const heure = d.toLocaleTimeString(langue, { hour: "2-digit", minute: "2-digit" });
  return `${jour} à ${heure}`;
}

/* ─────────────── Coût ─────────────── */

/**
 * Le coût annoncé AVANT de lancer : un crédit de rédaction par texte à écrire,
 * lu dans `action_costs` (`social_publication_copy`). Sans tarif lu, `null` :
 * l'écran dit qu'il ne le connaît pas plutôt que d'afficher un chiffre inventé.
 */
export function coutLancement(aEcrire: number, creditsParTexte: number | null): number | null {
  if (creditsParTexte === null || !Number.isFinite(creditsParTexte)) return null;
  return aEcrire * creditsParTexte;
}

/* ─────────────── État de la case ─────────────── */

export type EtatAffiche =
  | { cle: "a_ecrire"; libelle: string }
  | { cle: "en_cours"; libelle: string }
  | { cle: "prete"; libelle: string }
  | { cle: "echouee"; libelle: string; motif: string | null }
  | { cle: "programmee"; libelle: string }
  | { cle: "publiee"; libelle: string; lien: string | null }
  | { cle: "echec_publication"; libelle: string; motif: string | null }
  | { cle: "annulee"; libelle: string };

/**
 * Ce que la case dit à la marque. La publication, quand elle existe, fait
 * autorité sur la rédaction : une case « prête » dont la publication a échoué
 * est en échec, pas prête.
 */
export function etatAffiche(c: Pick<CaseAgence, "etat" | "publication">, motifRedaction: string | null = null): EtatAffiche {
  const p = c.publication;
  if (p) {
    if (p.etat === "publiee") return { cle: "publiee", libelle: "Publiée", lien: p.lien_post };
    if (p.etat === "echouee") return { cle: "echec_publication", libelle: "Échec", motif: p.message_erreur };
    if (p.etat === "annulee") return { cle: "annulee", libelle: "Annulée" };
    return { cle: "programmee", libelle: p.etat === "en_cours" ? "En cours d’envoi" : "Programmée" };
  }
  if (c.etat === "prete" || c.etat === "versee") return { cle: "prete", libelle: "Prête" };
  if (c.etat === "en_cours") return { cle: "en_cours", libelle: "En rédaction" };
  if (c.etat === "echouee") return { cle: "echouee", libelle: "Ratée", motif: motifRedaction };
  return { cle: "a_ecrire", libelle: "À écrire" };
}

/* ─────────────── Étape de l'écran ─────────────── */

export type EtapeAgence =
  | "aucune_agence"
  | "sans_brief"
  | "sans_reseau"
  | "semaine_vide"
  | "en_preparation"
  | "proposee"
  | "programmee";

/**
 * Un brief complet à partir de ce que la base rend. `agences_embauchees.brief`
 * vaut `{}` à l'embauche et peut perdre des champs d'une version à l'autre :
 * la fenêtre lisait `brief.a_dire.length` et plantait sur un champ absent.
 * Un champ manquant devient vide, jamais une valeur inventée.
 */
export function normaliserBrief(brief: Partial<BriefAgence> | null | undefined): BriefAgence {
  const b = brief ?? {};
  const liste = (v: unknown) => (Array.isArray(v) ? v.map((x) => String(x ?? "")) : []);
  const texte = (v: unknown) => (typeof v === "string" ? v : "");
  const avis = (b.avis ?? {}) as Partial<BriefAgence["avis"]>;
  return {
    marque: texte(b.marque),
    objectifs: texte(b.objectifs),
    a_dire: liste(b.a_dire),
    a_eviter: liste(b.a_eviter),
    cliente: texte(b.cliente),
    avis: {
      nombre: typeof avis.nombre === "number" ? avis.nombre : 0,
      note_moyenne: typeof avis.note_moyenne === "number" ? avis.note_moyenne : null,
      extraits: liste(avis.extraits).slice(0, 3),
    },
    produits_phares: liste(b.produits_phares),
    lieu: texte(b.lieu),
  };
}

/** Un brief vaut « donné » dès qu'un champ porte un mot de la marque. */
export function briefRenseigne(brief: Partial<BriefAgence> | null | undefined): boolean {
  if (!brief) return false;
  const textes = [brief.marque, brief.objectifs, brief.cliente, brief.lieu].some((v) => typeof v === "string" && v.trim());
  const listes = [brief.a_dire, brief.a_eviter, brief.produits_phares].some((l) => Array.isArray(l) && l.some((v) => String(v).trim()));
  return textes || listes;
}

/**
 * L'étape à montrer. `enPreparation` vient de l'écran (la rédaction tourne
 * dans cet onglet), le reste de la base. Publiée et échec se lisent case par
 * case dans « programmee » : une semaine mêle souvent les deux.
 */
export function etapeAgence(etat: EtatAgenceSemaine | null | undefined, enPreparation = false): EtapeAgence {
  if (!etat?.embauche || etat.embauche.etat !== "active") return "aucune_agence";
  if (!briefRenseigne(etat.embauche.brief)) return "sans_brief";
  if (!reseauxRelies(etat.comptes).size) return "sans_reseau";
  if (enPreparation) return "en_preparation";
  if (etat.cases.some((c) => c.publication)) return "programmee";
  if (etat.validation?.etat === "proposee") return "proposee";
  if (!etat.cases.some((c) => c.etat === "prete" || c.etat === "versee")) return "semaine_vide";
  return "proposee";
}

/** Le motif clair d'une case qui ne partira pas : le même vocabulaire que le serveur. */
export function motifBlocage(
  c: { platform: PlateformeEditoriale; image_url?: string | null; day_index: number },
  weekStart: string,
  relies: ReadonlySet<string>,
  maintenant: Date = new Date(),
): string | null {
  if (reseauDuFormat(c.platform) === null) return "Publication manuelle";
  if (!formatRelie(c.platform, relies)) return "Réseau non relié";
  if (jourPasse(weekStart, c.day_index, maintenant)) return "Jour passé";
  if (c.platform === "instagram-reel") return "Un reel demande une vidéo";
  if (!c.image_url) return "Visuel manquant";
  return null;
}

/* ─────────────── Avant / après ─────────────── */

/**
 * Règle de JP : un avant/après ne se publie qu'avec de VRAIES photos. Les
 * visuels de l'agence sortent d'un générateur ; un prompt d'avant/après
 * fabriquerait une transformation qui n'a jamais eu lieu. La semaine de
 * l'agence les saute donc, sur tous les réseaux (le premier prompt X de la
 * base, tombé chaque jour au rang 0, en était un).
 */
const AVANT_APRES = /before\s*[/-]\s*after|avant\s*[/-]\s*apr[eè]s/i;

export function estAvantApres(prompt: string | null | undefined): boolean {
  return AVANT_APRES.test(prompt ?? "");
}

/** Le prompt d'un rang, pris dans la liste purgée de ses avant/après. */
export function promptSansAvantApres(prompts: readonly string[], index: number): string | undefined {
  const permis = prompts.filter((p) => !estAvantApres(p));
  if (!permis.length) return undefined;
  return permis[index % permis.length];
}
