/**
 * La FAQ publique d'une marque (lystes.ai/<marque>/faq), en deux socles.
 *
 * Demande de JP, 30/09/2026 : « dynamique, IA, qui reprend un socle important
 * mais aussi un socle des préoccupations qui reviennent ».
 *
 *  1. L'ESSENTIEL : les questions qu'une cliente se pose toujours (ce que
 *     c'est, composition, utilisation, pour qui, précautions, livraison,
 *     retours), écrites à partir des fiches produits et de ce que la marque a
 *     renseigné. Aucun modèle n'est nécessaire : ce socle existe dès que la
 *     boutique a un produit, la page n'est donc jamais vide.
 *  2. LES DEMANDES QUI REVIENNENT : les préoccupations lues dans les vraies
 *     conversations, les avis et les messages de contact, regroupées par
 *     thème et classées par fréquence.
 *
 * Ce fichier ne parle à aucun modèle : il est lu tel quel
 * par la fonction `brand-faq-generator` (Deno) et par la page (Vite).
 * Il n'importe qu'un module utilitaire (`nom-dans-la-phrase`).
 *
 * Règle d'or, reprise de `contact-donnees.ts` : une donnée absente ne
 * produit pas de réponse. Une question sans matière n'est pas posée, ou
 * renvoie vers la marque. Le modèle, quand il passe, ne fait que raccourcir,
 * et `reponseFidele` rejette toute phrase qui apporte un chiffre ou une
 * promesse absents des faits.
 */

import { accord, formesDuNom, phraseAvecNom } from "./nom-dans-la-phrase.ts";

export type Socle = "essentiel" | "preoccupation";

export interface ProduitFaq {
  id: string;
  nom: string;
  description?: string | null;
  description_courte?: string | null;
  ingredients?: string | null;
  categorie?: string | null;
  /** `acf_fields` et `attributes` des fiches, tels quels. */
  champs?: unknown;
  lien?: string | null;
}

/** Seuls les champs publics de `brand_knowledge` : jamais les objectifs, marges ou concurrents. */
export interface SavoirPublic {
  description_marque?: string | null;
  public_cible?: string | null;
  politique_ingredients?: string | null;
  livraison?: string | null;
  livraison_offerte_des?: number | null;
  retours?: string | null;
  delai_retour_jours?: number | null;
  sav?: string | null;
  horaires?: string | null;
  /* Lus sur le site de la marque (FAQ, CGV, page contact) : faq-site-marque.ts. */
  email?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  page_contact?: string | null;
  retractation?: string | null;
  paiement?: string | null;
  garanties?: string | null;
  faq_site?: Precision[];
}

export interface Precision {
  question: string;
  reponse: string;
}

export interface ItemFaq {
  /** Identifiant stable, sert d'ancre et de clé pour la réécriture. */
  cle: string;
  socle: Socle;
  question: string;
  reponse: string;
  theme: string;
  occurrences: number;
  produit_id: string | null;
  produit_nom: string | null;
  /** Les textes d'où la réponse est tirée : ce que le modèle a le droit de dire. */
  faits: string[];
  /** Faux quand la marque n'a rien renseigné : la question est vraie, la réponse renvoie vers elle. */
  repondue: boolean;
}

/** Colonnes publiques de `brand_knowledge`, à sélectionner explicitement. */
export const COLONNES_SAVOIR_PUBLIC =
  "brand_description, target_audience, ingredients_policy, shipping_info, shipping_free_threshold, returns_policy, returns_delay_days, support_info, horaires_ouverture";

// ─────────────────────────────────────────────────────────────────────────
// Texte
// ─────────────────────────────────────────────────────────────────────────

/** Retire les balises, décode les entités courantes, normalise les espaces. */
export function nettoyer(valeur: unknown): string {
  if (typeof valeur !== "string") return "";
  return valeur
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/(p|li|h\d|div)>/gi, ". ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#0?39;|&apos;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s*\.\s*\.(\s*\.)*/g, ".")
    .replace(/\s+/g, " ")
    .replace(/^[\s.]+/, "")
    .trim();
}

/** Les premières phrases entières d'un texte, sans dépasser `max` caractères. */
export function premieresPhrases(texte: string, max = 320): string {
  const propre = nettoyer(texte);
  if (propre.length <= max) return propre;
  const phrases = propre.match(/[^.!?]+[.!?]+/g) ?? [];
  let sortie = "";
  for (const p of phrases) {
    if ((sortie + p).trim().length > max) break;
    sortie = (sortie + p).trim();
  }
  if (sortie) return sortie;
  const coupe = propre.slice(0, max);
  return `${coupe.slice(0, Math.max(coupe.lastIndexOf(" "), 40)).trim()}…`;
}

/** Les champs d'une fiche (`acf_fields`, `attributes`) mis à plat en couples [nom, valeur]. */
export function aplatirChamps(champs: unknown): Array<[string, string]> {
  const sortie: Array<[string, string]> = [];
  const visiter = (cle: string, v: unknown, profondeur: number) => {
    if (profondeur > 3 || v == null) return;
    if (typeof v === "string") {
      const t = nettoyer(v);
      if (t.length >= 3) sortie.push([cle, t]);
    } else if (Array.isArray(v)) {
      /* Les attributs WooCommerce arrivent en liste de { name, options }. */
      for (const e of v) {
        if (e && typeof e === "object" && "name" in (e as Record<string, unknown>)) {
          const o = e as Record<string, unknown>;
          const valeurs = Array.isArray(o.options) ? o.options.join(", ") : o.value ?? o.options;
          visiter(String(o.name), valeurs, profondeur + 1);
        } else visiter(cle, e, profondeur + 1);
      }
    } else if (typeof v === "object") {
      for (const [k, w] of Object.entries(v as Record<string, unknown>)) visiter(k, w, profondeur + 1);
    }
  };
  visiter("", champs, 0);
  return sortie;
}

/** Valeur d'un champ de fiche dont le nom correspond au motif. */
function champ(champs: unknown, motif: RegExp): string | null {
  for (const [cle, valeur] of aplatirChamps(champs)) {
    if (motif.test(cle.replace(/[_-]/g, " "))) return valeur;
  }
  return null;
}

/**
 * Passage d'une description qui suit un intertitre (« Mode d'emploi : … »),
 * jusqu'à l'intertitre suivant.
 */
function section(texte: string, intertitre: RegExp): string | null {
  const propre = nettoyer(texte);
  const m = propre.match(intertitre);
  if (!m || m.index === undefined) return null;
  const suite = propre.slice(m.index + m[0].length).replace(/^[\s:.\-\u2013]+/, "");
  const fin = suite.search(/\b(actifs? cl[ée]s?|ingr[ée]dients?|composition|mode d'emploi|conseils? d'utilisation|utilisation|pr[ée]cautions?|b[ée]n[ée]fices|r[ée]sultats?|contenance|pour qui)\s*:/i);
  const extrait = (fin > 0 ? suite.slice(0, fin) : suite).trim();
  if (extrait.length < 12) return null;
  /* « Utilisation : quelques gouttes… » : la réponse commence par une majuscule. */
  const court = premieresPhrases(extrait, 280);
  return court.charAt(0).toUpperCase() + court.slice(1);
}

/** La phrase qui contient le motif, telle qu'écrite par la marque. */
function phraseQuiContient(texte: string, motif: RegExp): string | null {
  const phrases = nettoyer(texte).match(/[^.!?]+[.!?]*/g) ?? [];
  const trouvee = phrases.find((p) => motif.test(p));
  return trouvee ? trouvee.trim() : null;
}

const MOTIF_SOIN = /soin|s[ée]rum|cr[èe]me|visage|corps|peau|cheveu|capillaire|shampo|masque|huile|baume|lotion|gel|nettoyant|d[ée]maquill|contour|lait|beaut|cosm[ée]t|skin|hair/i;

/** Un produit de soin appelle les questions de précaution. */
export function estUnSoin(p: ProduitFaq, secteur?: string | null): boolean {
  return MOTIF_SOIN.test(`${p.categorie ?? ""} ${p.nom}`) || MOTIF_SOIN.test(secteur ?? "");
}

// ─────────────────────────────────────────────────────────────────────────
// Labels de la fiche
// ─────────────────────────────────────────────────────────────────────────

/**
 * Ce qui suit « sans » sur un label (09/10/2026). Une liste fermée : « sans »
 * suivi de n'importe quel mot attrapait « sans laisser de film gras » et la
 * FAQ répondait « Sans laisser » à la question des labels.
 */
const SANS_CONNUS = [
  "gluten", "noix", "fruits? à coque", "allerg[èe]nes?", "parfum(?:s)?(?: ajout[ée]s?)?", "parab[èe]nes?", "sulfates?",
  "silicones?", "alcool", "huiles? min[ée]rales?", "huile de palme", "huiles? essentielles?", "perturbateurs? endocriniens?",
  "ph[ée]noxy[ée]thanol", "colorants?", "conservateurs?", "peg", "savon", "lactose", "ogm", "nanoparticules?",
  "microplastiques?", "plastique", "sucres? ajout[ée]s?",
];

/** Les labels connus. `id` regroupe les façons d'écrire le même label ; `*` : le texte lui-même. */
const LABELS: Array<{ id: string; motif: string }> = [
  { id: "vegan", motif: "100\\s?%\\s?v[ée]gan(?:e)?s?|v[ée]gan(?:e)?s?|v[ée]g[ée]talien(?:ne)?s?" },
  { id: "cosmos", motif: "(?:ecocert\\s+)?cosmos\\s+(?:organic|natural)|ecocert" },
  {
    id: "bio",
    motif:
      "certifi[ée]e?s?\\s+(?:bio(?:logique)?s?|ab)|(?:issue?s?\\s+de\\s+l['’])?agriculture\\s+biologique|biologiques?|bio(?!-)",
  },
  {
    id: "naturel",
    motif:
      "certifi[ée]e?s?\\s+naturel(?:le)?s?|(?:cosm[ée]tiques?\\s+)?naturel(?:le)?s?\\s+certifi[ée]e?s?|\\d+(?:[.,]\\d+)?\\s?%\\s+(?:d['’]ingr[ée]dients\\s+)?(?:d['’]origine\\s+)?naturel(?:le)?s?",
  },
  { id: "cruelty", motif: "cruelty[\\s-]?free|non\\s+test[ée]e?s?\\s+sur\\s+les\\s+animaux|leaping\\s+bunny|sans\\s+cruaut[ée]" },
  { id: "*", motif: `sans\\s+(?:${SANS_CONNUS.join("|")})` },
  { id: "*", motif: "(?:gluten|nut|paraben|sulfate|silicone|fragrance|alcohol|soap)[\\s-]free" },
];
const MOTIFS_LABELS = LABELS.map((l) => ({
  id: l.id,
  motif: new RegExp(`(?<![\\p{L}\\p{N}])(?:${l.motif})(?![\\p{L}\\p{N}])`, "giu"),
}));

function cleDuLabel(texte: string): string {
  return texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[\s-]+/g, " ")
    .replace(/s(?= |$)/g, "");
}

/**
 * Les labels que la fiche affiche (« Sans gluten • Végétalien • Certifié
 * biologique »), tels que la marque les écrit, une fois chacun, dans l'ordre
 * de la fiche. Seuls les labels connus comptent : une phrase de la
 * description qui contient « sans » n'en est pas un.
 */
export function labelsDeLaFiche(texte: string): string[] {
  const propre = nettoyer(texte);
  if (!propre) return [];
  type Trouve = { debut: number; fin: number; id: string; texte: string };
  const trouves: Trouve[] = [];
  for (const l of MOTIFS_LABELS) {
    for (const m of propre.matchAll(l.motif)) {
      const t = m[0].replace(/\s+/g, " ");
      trouves.push({ debut: m.index!, fin: m.index! + m[0].length, id: l.id === "*" ? cleDuLabel(t) : l.id, texte: t });
    }
  }
  /* Deux motifs sur le même passage : le plus long l'emporte. */
  trouves.sort((a, b) => a.debut - b.debut || (b.fin - b.debut) - (a.fin - a.debut));
  const parId = new Map<string, string>();
  let fin = -1;
  for (const t of trouves) {
    if (t.debut < fin) continue;
    fin = t.fin;
    const deja = parId.get(t.id);
    if (deja === undefined || t.texte.length > deja.length) parId.set(t.id, t.texte);
  }
  return [...parId.values()].map((t) => {
    const lettres = t.replace(/[^\p{L}]/gu, "");
    const crie = lettres.length > 3 && lettres === lettres.toLocaleUpperCase("fr-FR");
    const casse = crie ? t.toLocaleLowerCase("fr-FR") : t;
    return casse.charAt(0).toLocaleUpperCase("fr-FR") + casse.slice(1);
  });
}

/**
 * Les questions d'un produit dont le verbe ou l'adjectif s'accorde au nom
 * (09/10/2026 : « L'huile … est-elle vegan et naturelle ? »). Partagées mot
 * pour mot avec la FAQ du produit (`preoccupations-produit.ts`).
 */
export const QUESTIONS_ACCORDEES = {
  composition: (nom: string) => `Que ${accord(formesDuNom(nom), "contient", "contient", "contiennent", "contiennent")} ${nom} ?`,
  pourQui: (nom: string) =>
    `À qui ${accord(formesDuNom(nom), "s'adresse", "s'adresse", "s'adressent", "s'adressent")} ${nom} ?`,
  precautions: (nom: string) =>
    `${nom} ${
      accord(formesDuNom(nom), "convient-il", "convient-elle", "conviennent-ils", "conviennent-elles")
    } aux peaux sensibles ? Y a-t-il des précautions ?`,
  labels: (nom: string) => {
    const f = formesDuNom(nom);
    return `${nom} ${accord(f, "est-il", "est-elle", "sont-ils", "sont-elles")} vegan et ${
      accord(f, "naturel", "naturelle", "naturels", "naturelles")
    } ?`;
  },
  gamme: (nom: string) =>
    `Dans quelle gamme ${accord(formesDuNom(nom), "se trouve", "se trouve", "se trouvent", "se trouvent")} ${nom} ?`,
};

// ─────────────────────────────────────────────────────────────────────────
// Socle 1 : l'essentiel
// ─────────────────────────────────────────────────────────────────────────

function item(
  partiel: Omit<ItemFaq, "occurrences" | "produit_id" | "produit_nom" | "repondue" | "faits"> &
    Partial<Pick<ItemFaq, "produit_id" | "produit_nom" | "faits" | "repondue">>,
): ItemFaq {
  const sortie: ItemFaq = {
    occurrences: 0,
    produit_id: null,
    produit_nom: null,
    repondue: true,
    faits: [partiel.reponse],
    ...partiel,
  };
  /* 04/10 (JP) : le nom du produit, souvent en capitales sur la fiche, passe
     en casse de phrase avec son article dans la question. */
  if (sortie.produit_nom) sortie.question = phraseAvecNom(sortie.question, sortie.produit_nom);
  return sortie;
}

/** Questions de fond d'un produit, uniquement celles que la fiche permet de répondre. */
export function questionsDuProduit(p: ProduitFaq, secteur?: string | null): ItemFaq[] {
  const nom = p.nom.trim();
  const description = [p.description_courte, p.description].map(nettoyer).filter(Boolean).join(". ");
  const base = { socle: "essentiel" as const, produit_id: p.id, produit_nom: nom, theme: nom };
  const sortie: ItemFaq[] = [];

  const presentation = premieresPhrases(nettoyer(p.description_courte) || nettoyer(p.description), 300);
  if (presentation.length >= 20) {
    sortie.push(item({ ...base, cle: `${p.id}:quoi`, question: `Qu'est-ce que ${nom} ?`, reponse: presentation }));
  }

  const composition =
    nettoyer(p.ingredients) ||
    champ(p.champs, /ingr[ée]dient|composition|inci|mati[èe]re/i) ||
    section(description, /\b(ingr[ée]dients?|composition|actifs? cl[ée]s?|principes? actifs?)\s*:/i);
  if (composition && composition.length >= 8) {
    sortie.push(item({
      ...base,
      cle: `${p.id}:composition`,
      question: QUESTIONS_ACCORDEES.composition(nom),
      reponse: premieresPhrases(composition, 400),
    }));
  }

  const usage =
    champ(p.champs, /utilisation|mode d.?emploi|how to use|application|conseils?/i) ||
    section(description, /\b(mode d'emploi|conseils? d'utilisation|utilisation|comment l'utiliser|application)\s*:/i);
  if (usage) {
    sortie.push(item({ ...base, cle: `${p.id}:utilisation`, question: `Comment utiliser ${nom} ?`, reponse: premieresPhrases(usage, 300) }));
  }

  const pourQui =
    champ(p.champs, /pour qui|type de (peau|cheveux)|skin type|hair type|cible/i) ||
    /* Intertitre obligatoire : sans les deux-points, « convient a » attrapait
       « Convient aussi bien… » et coupait la réponse en plein mot. */
    section(description, /\b(pour qui|id[ée]al pour|convient [àa])\s*:/i) ||
    /* Phrase de la marque qui nomme le type de peau ou de cheveux visé. */
    phraseQuiContient(description, /\b(formul[ée]e? pour|con[çc]u[e]? pour|convient (aux|à|a)|adapt[ée]e? (aux|à)|id[ée]al(e)? pour)\b.*\b(peaux?|cheveux|types?)\b/i);
  if (pourQui) {
    sortie.push(item({ ...base, cle: `${p.id}:pour-qui`, question: QUESTIONS_ACCORDEES.pourQui(nom), reponse: premieresPhrases(pourQui, 260) }));
  }

  const resultats =
    champ(p.champs, /r[ée]sultat|result/i) || section(description, /\br[ée]sultats?\s*:/i);
  if (resultats) {
    sortie.push(item({
      ...base,
      cle: `${p.id}:resultats`,
      question: `Au bout de combien de temps voit-on l'effet de ${nom} ?`,
      reponse: premieresPhrases(resultats, 260),
    }));
  }

  /* Texture et sensation, telles que la fiche les décrit. */
  const texture = phraseQuiContient(description, /\btextures?\b|\bparfum\b|\bfini\b|\bodeur\b/i);
  if (texture && !(presentation && nettoyer(presentation).startsWith(nettoyer(texture)))) {
    sortie.push(item({ ...base, cle: `${p.id}:texture`, question: `Quelle est la texture de ${nom} ?`, reponse: premieresPhrases(texture, 260) }));
  }

  /* Labels écrits par la marque (vegan, certifié biologique, sans gluten…) :
     seuls les labels connus, jamais « sans » suivi de n'importe quel mot. */
  const uniques = labelsDeLaFiche(description);
  if (uniques.length >= 2) {
    sortie.push(item({
      ...base,
      cle: `${p.id}:labels`,
      question: QUESTIONS_ACCORDEES.labels(nom),
      reponse: `Selon la fiche de la marque : ${uniques.join(", ")}.`,
      faits: [description],
    }));
  }

  if (estUnSoin(p, secteur)) {
    const precautions =
      champ(p.champs, /pr[ée]caution|contre.?indication|avertissement|warning|sensible/i) ||
      section(description, /\b(pr[ée]cautions?( d'emploi)?|contre.?indications?|avertissements?)\s*:/i) ||
      phraseQuiContient(description, /peaux? sensibles?|enceinte|grossesse|allaitement|contre.?indi|[ée]viter le contour/i);
    /* La phrase qui cite « peaux sensibles » est souvent la présentation elle-même :
       la répéter mot pour mot sous une autre question n'apprend rien. */
    const redite = precautions && presentation && nettoyer(presentation).includes(nettoyer(precautions));
    if (precautions && !redite) {
      sortie.push(item({
        ...base,
        cle: `${p.id}:precautions`,
        question: QUESTIONS_ACCORDEES.precautions(nom),
        reponse: premieresPhrases(precautions, 280),
      }));
    }
  }

  completerAuMinimum(p, nom, base, sortie);
  return sortie;
}

/** Nombre minimum de questions-réponses par produit (consigne du 04/10/2026). */
export const MIN_QUESTIONS_PAR_PRODUIT = 5;

/**
 * Complète un produit jusqu'au minimum, uniquement avec des faits certains :
 * la gamme (catégorie de la fiche), le lien de la fiche, et — quand la fiche
 * ne dit rien sur un point — une réponse qui l'écrit honnêtement et renvoie
 * vers la fiche ou la marque. Jamais de contenu, d'usage ni de prix supposé.
 */
function completerAuMinimum(
  p: ProduitFaq,
  nom: string,
  base: { socle: "essentiel"; produit_id: string; produit_nom: string; theme: string },
  sortie: ItemFaq[],
): void {
  const lien = nettoyer(p.lien);
  const categorie = nettoyer(p.categorie);
  const a = (suffixe: string) => sortie.some((q) => q.cle === `${p.id}:${suffixe}`);
  const renvoi = lien
    ? `Le détail figure sur la fiche du produit, sur la boutique de la marque : ${lien}`
    : `Écrivez à la marque depuis sa page contact pour en savoir plus.`;
  /* Même marque de renvoi que le reste de la FAQ : affichée, jamais balisée. */
  const nonDetaille = (sujet: string) => `Sur ${sujet} de ${nom}, la marque ${PAS_ENCORE_PRECISE}. ${renvoi}`;

  /* Le verbe s'accorde au nom : « Les gouttes font partie… », « sont en vente ». */
  const auPluriel = formesDuNom(nom).pluriel;
  const candidats: Array<{ suffixe: string; question: string; reponse: string; repondue: boolean }> = [];
  if (categorie && !a("quoi")) {
    candidats.push({
      suffixe: "gamme",
      question: QUESTIONS_ACCORDEES.gamme(nom),
      reponse: `${nom} ${auPluriel ? "font" : "fait"} partie de la gamme « ${categorie} » de la marque.`,
      repondue: true,
    });
  }
  if (lien) {
    candidats.push({
      suffixe: "fiche",
      question: `Où acheter ${nom} ?`,
      reponse: `${nom} ${auPluriel ? "sont" : "est"} en vente sur la boutique de la marque : ${lien}`,
      repondue: true,
    });
  }
  if (!a("composition")) candidats.push({ suffixe: "composition", question: QUESTIONS_ACCORDEES.composition(nom), reponse: nonDetaille("le contenu"), repondue: false });
  if (!a("utilisation")) candidats.push({ suffixe: "utilisation", question: `Comment utiliser ${nom} ?`, reponse: nonDetaille("le mode d'emploi"), repondue: false });
  if (!a("pour-qui")) candidats.push({ suffixe: "pour-qui", question: QUESTIONS_ACCORDEES.pourQui(nom), reponse: nonDetaille("le public visé"), repondue: false });
  candidats.push({
    suffixe: "contact",
    question: `Comment poser une autre question sur ${nom} ?`,
    reponse: `Utilisez le bouton « Poser une question » de cette page : il ouvre la page contact de la marque.`,
    repondue: true,
  });

  for (const c of candidats) {
    if (sortie.length >= MIN_QUESTIONS_PAR_PRODUIT) break;
    sortie.push(item({ ...base, cle: `${p.id}:${c.suffixe}`, question: c.question, reponse: phraseAvecNom(c.reponse, nom), repondue: c.repondue }));
  }
}

export interface EntreeEssentiel {
  marque: string;
  slug: string;
  secteur?: string | null;
  produits: ProduitFaq[];
  savoir?: SavoirPublic | null;
  precisions?: Precision[];
  /** Nombre de produits décrits en détail ; les autres restent cités. */
  maxProduits?: number;
}

/**
 * Une même fiche importée deux fois (Éclose Paris, 30/09 : la crème à l'urée
 * figure deux fois) ne doit ni compter double ni ouvrir deux sections à la
 * même ancre. On garde la fiche la plus renseignée, à sa place dans la liste.
 */
export function dedoublonner(produits: ProduitFaq[]): ProduitFaq[] {
  const cle = (p: ProduitFaq) => nettoyer(p.nom).toLowerCase();
  const poids = (p: ProduitFaq) =>
    [p.description, p.description_courte, p.ingredients].map(nettoyer).join("").length;
  const meilleure = new Map<string, ProduitFaq>();
  for (const p of produits) {
    const deja = meilleure.get(cle(p));
    if (!deja || poids(p) > poids(deja)) meilleure.set(cle(p), p);
  }
  return produits.filter((p) => meilleure.get(cle(p)) === p);
}

function euros(n: number): string {
  return `${Number.isInteger(n) ? n : n.toFixed(2).replace(".", ",")} €`;
}

/**
 * Le socle de base. Jamais vide dès qu'il y a un produit : au pire, la liste
 * des produits de la marque et la façon de lui écrire, deux faits certains.
 */
/** Les moyens de contact réels de la marque, ou null si aucun n'est connu. */
export function reponseContact(marque: string, savoir: SavoirPublic): string | null {
  const email = nettoyer(savoir.email);
  const tel = nettoyer(savoir.telephone);
  const adresse = nettoyer(savoir.adresse);
  const horaires = nettoyer(savoir.horaires);
  const sav = nettoyer(savoir.sav);
  const page = nettoyer(savoir.page_contact);
  const moyens = [email ? `par e-mail à ${email}` : "", tel ? `par téléphone au ${tel}` : ""].filter(Boolean);
  const morceaux = [
    moyens.length ? `Vous pouvez joindre ${marque} ${moyens.join(" ou ")}.` : "",
    !moyens.length && sav ? premieresPhrases(sav, 220) : "",
    adresse ? `Adresse : ${adresse}.` : "",
    horaires ? `Horaires : ${premieresPhrases(horaires, 120)}` : "",
    page ? `Page contact de la marque : ${page}` : "",
  ].filter(Boolean);
  return morceaux.length ? morceaux.join(" ") : null;
}

export function socleEssentiel(e: EntreeEssentiel): ItemFaq[] {
  const marque = e.marque.trim();
  const produits = dedoublonner(e.produits.filter((p) => p && p.nom && p.nom.trim()));
  const savoir = e.savoir ?? {};
  const sortie: ItemFaq[] = [];
  const base = { socle: "essentiel" as const };

  if (produits.length > 0) {
    const noms = produits.slice(0, 8).map((p) => p.nom.trim());
    const reste = produits.length - noms.length;
    const reponse = produits.length === 1
      ? `${marque} propose ${noms[0]}.`
      : `${marque} propose ${produits.length} produits, dont ${noms.join(", ")}${reste > 0 ? `, et ${reste} autres` : ""}.`;
    sortie.push(item({ ...base, cle: "marque:catalogue", theme: "La marque", question: `Quels produits propose ${marque} ?`, reponse }));
  }

  const description = nettoyer(savoir.description_marque);
  if (description) {
    sortie.push(item({ ...base, cle: "marque:qui", theme: "La marque", question: `Qui est ${marque} ?`, reponse: premieresPhrases(description, 320) }));
  }
  const cible = nettoyer(savoir.public_cible);
  if (cible) {
    sortie.push(item({ ...base, cle: "marque:pour-qui", theme: "La marque", question: `À qui s'adressent les produits ${marque} ?`, reponse: premieresPhrases(cible, 260) }));
  }
  const politique = nettoyer(savoir.politique_ingredients);
  if (politique) {
    sortie.push(item({ ...base, cle: "marque:composition", theme: "Composition", question: `Comment ${marque} choisit-elle ses ingrédients ?`, reponse: premieresPhrases(politique, 300) }));
  }

  const livraison = nettoyer(savoir.livraison);
  const seuil = typeof savoir.livraison_offerte_des === "number" && savoir.livraison_offerte_des > 0
    ? savoir.livraison_offerte_des : null;
  if (livraison || seuil) {
    const morceaux = [livraison ? premieresPhrases(livraison, 280) : "", seuil ? `Livraison offerte dès ${euros(seuil)} d'achat.` : ""].filter(Boolean);
    sortie.push(item({ ...base, cle: "marque:livraison", theme: "Livraison", question: "Quels sont les délais et les frais de livraison ?", reponse: morceaux.join(" ") }));
  }

  const retours = nettoyer(savoir.retours);
  const delai = typeof savoir.delai_retour_jours === "number" && savoir.delai_retour_jours > 0 ? savoir.delai_retour_jours : null;
  if (retours || delai) {
    const morceaux = [delai ? `Vous disposez de ${delai} jours pour retourner un produit.` : "", retours ? premieresPhrases(retours, 280) : ""].filter(Boolean);
    sortie.push(item({ ...base, cle: "marque:retours", theme: "Retours", question: "Comment retourner un produit ?", reponse: morceaux.join(" ") }));
  }

  const retractation = nettoyer(savoir.retractation);
  if (retractation) {
    sortie.push(item({ ...base, cle: "marque:retractation", theme: "Conditions de vente", question: "Quel est le délai de rétractation ?", reponse: premieresPhrases(retractation, 280) }));
  }
  const paiement = nettoyer(savoir.paiement);
  if (paiement) {
    sortie.push(item({ ...base, cle: "marque:paiement", theme: "Conditions de vente", question: "Quels moyens de paiement sont acceptés ?", reponse: premieresPhrases(paiement, 220) }));
  }
  const garanties = nettoyer(savoir.garanties);
  if (garanties) {
    sortie.push(item({ ...base, cle: "marque:garanties", theme: "Conditions de vente", question: `Quelles garanties offre ${marque} ?`, reponse: premieresPhrases(garanties, 280) }));
  }

  /* Le contact : les vrais moyens de la marque, lus sur son site. Jamais
     d'adresse lystes.ai ; sans aucun moyen connu, pas de question. */
  const contact = reponseContact(marque, savoir);
  if (contact) {
    sortie.push(item({ ...base, cle: "marque:contact", theme: "Contact", question: `Comment contacter ${marque} ?`, reponse: contact }));
  }

  /* Les questions de la FAQ du site, reprises telles quelles. */
  for (const [i, qa] of (savoir.faq_site ?? []).slice(0, 15).entries()) {
    const q = nettoyer(qa.question);
    const r = nettoyer(qa.reponse);
    if (q.length >= 6 && r.length >= 6) {
      sortie.push(item({ ...base, cle: `site:${i}`, theme: "FAQ de la marque", question: q, reponse: premieresPhrases(r, 500) }));
    }
  }

  for (const [i, pr] of (e.precisions ?? []).slice(0, 8).entries()) {
    const q = nettoyer(pr.question);
    const r = nettoyer(pr.reponse);
    if (q.length >= 6 && r.length >= 6) {
      sortie.push(item({ ...base, cle: `precision:${i}`, theme: "Précisions de la marque", question: q, reponse: premieresPhrases(r, 400) }));
    }
  }

  /* Les produits les mieux documentés d'abord : leur section est la plus utile. */
  const detailles = produits
    .map((p) => ({ p, q: questionsDuProduit(p, e.secteur) }))
    .filter((x) => x.q.length > 0)
    .sort((a, b) => b.q.length - a.q.length)
    .slice(0, e.maxProduits ?? 20);
  for (const { q } of detailles) sortie.push(...q);

  return sortie;
}

// ─────────────────────────────────────────────────────────────────────────
// Socle 2 : ce que les clientes demandent le plus
// ─────────────────────────────────────────────────────────────────────────

export interface ThemePreoccupation {
  theme: string;
  libelle: string;
  motif: RegExp;
  question: (marque: string) => string;
}

export const THEMES: ThemePreoccupation[] = [
  { theme: "livraison", libelle: "Livraison", motif: /livr|exp[ée]di|colis|shipping|delivery|suivi de (ma )?commande|quand (vais|va|est-ce).*(recevoir|arriver)/i, question: () => "Quand vais-je recevoir ma commande, et combien coûte la livraison ?" },
  { theme: "retours", libelle: "Retours", motif: /retour|rembours|[ée]chang|renvoy|refund|return/i, question: () => "Puis-je retourner ou échanger un produit ?" },
  { theme: "precautions", libelle: "Peaux sensibles et précautions", motif: /sensible|irrit|r[ée]action|rougeur|enceinte|grossesse|allait|ecz[ée]ma|contre.?indic|allerg|tol[ée]r/i, question: () => "Les produits conviennent-ils aux peaux sensibles, et y a-t-il des précautions ?" },
  { theme: "composition", libelle: "Composition", motif: /ingr[ée]dient|compos|contient|naturel|\bbio\b|v[ée]gan|parfum[ée]?\b|sulfate|silicone|parab[èe]ne|inci\b/i, question: (m) => `Que contiennent les produits ${m} ?` },
  { theme: "utilisation", libelle: "Utilisation", motif: /utilis|appliqu|combien de fois|fr[ée]quence|matin|soir|routine|dose|how to use|s'en servir/i, question: () => "Comment utiliser les produits, et à quelle fréquence ?" },
  { theme: "resultats", libelle: "Résultats", motif: /r[ée]sultat|efficac|combien de temps|au bout de|[çc]a marche|fonctionne|effet/i, question: () => "Au bout de combien de temps voit-on un effet ?" },
  { theme: "conseil", libelle: "Choisir son produit", motif: /quel (produit|soin)|lequel|conseill|recommand|type de (peau|cheveux)|adapt[ée]|convient|pour (ma|mon|mes) (peau|cheveux)/i, question: () => "Quel produit choisir pour mon besoin ?" },
  { theme: "prix", libelle: "Prix et offres", motif: /\bprix\b|co[uû]te|promo|code|r[ée]duction|tarif|soldes|trop cher/i, question: () => "Où trouver les prix et les offres en cours ?" },
  { theme: "disponibilite", libelle: "Disponibilité", motif: /stock|disponib|rupture|r[ée]assort|en attente/i, question: () => "Un produit en rupture sera-t-il de nouveau disponible ?" },
  { theme: "commande", libelle: "Commande et paiement", motif: /paiement|payer|carte bancaire|paypal|factur|annuler (ma )?commande|modifier (ma )?commande/i, question: () => "Comment modifier, annuler ou payer une commande ?" },
];

/** Marque d'une réponse qui renvoie vers la marque faute de donnée. */
export const PAS_ENCORE_PRECISE = "n'a pas encore précisé ce point";

/** Vrai pour une réponse de renvoi : elle s'affiche, mais n'entre pas dans le balisage. */
export function estUnRenvoi(reponse: string): boolean {
  return reponse.includes(PAS_ENCORE_PRECISE);
}

export interface Signal {
  texte: string;
  /** Une conversation compte 1 ; un sujet déjà agrégé porte son nombre de mentions. */
  poids?: number;
}

export interface GroupePreoccupation {
  theme: string;
  libelle: string;
  occurrences: number;
  exemples: string[];
}

/**
 * Regroupe les signaux par thème et les classe du plus fréquent au moins
 * fréquent. Un signal compte une fois par thème, quelle que soit la façon
 * dont il le répète. En dessous de `minimum`, ce n'est pas « qui revient ».
 */
export function regrouperPreoccupations(signaux: Signal[], minimum = 2): GroupePreoccupation[] {
  const groupes = new Map<string, GroupePreoccupation>();
  for (const s of signaux) {
    const texte = nettoyer(s.texte);
    if (texte.length < 4) continue;
    const poids = Number.isFinite(s.poids) && (s.poids as number) > 0 ? Math.round(s.poids as number) : 1;
    for (const t of THEMES) {
      if (!t.motif.test(texte)) continue;
      const g = groupes.get(t.theme) ?? { theme: t.theme, libelle: t.libelle, occurrences: 0, exemples: [] };
      g.occurrences += poids;
      if (g.exemples.length < 5 && texte.length <= 240) g.exemples.push(texte);
      groupes.set(t.theme, g);
    }
  }
  const ordre = (theme: string) => THEMES.findIndex((t) => t.theme === theme);
  return [...groupes.values()]
    .filter((g) => g.occurrences >= minimum)
    .sort((a, b) => b.occurrences - a.occurrences || ordre(a.theme) - ordre(b.theme));
}

/**
 * Réponse à une préoccupation, tirée de l'essentiel déjà écrit. Quand rien
 * ne permet de répondre, la question reste (elle est réelle) et la réponse
 * renvoie vers la marque, sans rien promettre.
 */
export function socleDemandes(
  groupes: GroupePreoccupation[],
  essentiel: ItemFaq[],
  marque: string,
  slug: string,
  max = 8,
): ItemFaq[] {
  const parCle = new Map(essentiel.map((i) => [i.cle, i]));
  const produitsAvec = (suffixe: string) => essentiel.filter((i) => i.produit_id && i.cle.endsWith(`:${suffixe}`));
  const renvoi = (quoi: string, n: number) =>
    `${quoi} ${n > 1 ? `est précisé pour ${n} produits` : "est précisé pour un produit"} dans la section « L'essentiel », produit par produit.`;

  const reponses: Record<string, () => { reponse: string; faits: string[] } | null> = {
    livraison: () => { const i = parCle.get("marque:livraison"); return i ? { reponse: i.reponse, faits: i.faits } : null; },
    retours: () => { const i = parCle.get("marque:retours"); return i ? { reponse: i.reponse, faits: i.faits } : null; },
    composition: () => {
      const i = parCle.get("marque:composition");
      if (i) return { reponse: i.reponse, faits: i.faits };
      const n = produitsAvec("composition").length;
      return n ? { reponse: renvoi("La composition", n), faits: [] } : null;
    },
    utilisation: () => { const n = produitsAvec("utilisation").length; return n ? { reponse: renvoi("Le mode d'emploi", n), faits: [] } : null; },
    precautions: () => { const n = produitsAvec("precautions").length; return n ? { reponse: renvoi("Ce que dit la marque sur les peaux sensibles et les précautions", n), faits: [] } : null; },
    resultats: () => { const n = produitsAvec("resultats").length; return n ? { reponse: renvoi("Ce que la marque indique sur les résultats", n), faits: [] } : null; },
    conseil: () => {
      const i = parCle.get("marque:pour-qui");
      if (i) return { reponse: i.reponse, faits: i.faits };
      const n = produitsAvec("pour-qui").length;
      return n ? { reponse: renvoi("Le public de chaque produit", n), faits: [] } : null;
    },
    prix: () => ({ reponse: `Le prix de chaque produit est indiqué sur sa fiche, sur le site de ${marque}.`, faits: [] }),
    disponibilite: () => ({ reponse: `La disponibilité de chaque produit s'affiche sur sa fiche. Pour une date de retour en stock, posez la question directement à ${marque}.`, faits: [] }),
    commande: () => null,
  };

  return groupes.slice(0, max).map((g, rang) => {
    const theme = THEMES.find((t) => t.theme === g.theme)!;
    const trouvee = reponses[g.theme]?.() ?? null;
    return {
      cle: `demande:${g.theme}`,
      socle: "preoccupation" as const,
      question: theme.question(marque),
      reponse: trouvee?.reponse ??
        `${marque} ${PAS_ENCORE_PRECISE}. Posez-lui la question directement : la marque vous répondra.`,
      theme: g.libelle,
      occurrences: g.occurrences,
      produit_id: null,
      produit_nom: null,
      faits: trouvee ? (trouvee.faits.length ? trouvee.faits : [trouvee.reponse]) : [],
      repondue: Boolean(trouvee),
      rang,
    } as ItemFaq & { rang: number };
  });
}

// ─────────────────────────────────────────────────────────────────────────
// Garde-fou de la réécriture par le modèle
// ─────────────────────────────────────────────────────────────────────────

const PROMESSES = /garanti|gu[ée]ri|miracle|d[ée]finitivement|sans (aucun )?risque|cliniquement prouv|100\s?%|imm[ée]diat|disparai|dispara[iî]t|efface les rides/i;

/**
 * Le code tranche : une réponse réécrite est gardée seulement si elle est
 * courte, si chaque nombre qu'elle cite figure dans les faits, et si elle ne
 * promet rien que les faits ne promettent pas déjà.
 */
export function reponseFidele(reponse: string, faits: string[]): boolean {
  const texte = nettoyer(reponse);
  if (texte.length < 8 || texte.length > 480) return false;
  const source = faits.map(nettoyer).join(" ").toLowerCase();
  const nombres = texte.match(/\d+(?:[.,]\d+)?/g) ?? [];
  for (const n of nombres) {
    const variantes = [n, n.replace(",", "."), n.replace(".", ",")];
    if (!variantes.some((v) => source.includes(v))) return false;
  }
  const promesse = texte.match(PROMESSES);
  if (promesse && !source.includes(promesse[0].toLowerCase())) return false;
  return true;
}

// ─────────────────────────────────────────────────────────────────────────
// SEO et GEO
// ─────────────────────────────────────────────────────────────────────────

export function titreFaq(marque: string): string {
  return `Questions fréquentes : ${marque.trim()}`;
}

export function descriptionFaq(marque: string, questions: string[]): string {
  const tete = `${marque.trim()} répond aux questions de ses clientes`;
  const suite = questions.slice(0, 2).join(" ");
  const texte = suite ? `${tete} : ${suite}` : `${tete}.`;
  return texte.length > 155 ? `${texte.slice(0, 154).replace(/\s+\S*$/, "")}…` : texte;
}

/**
 * Balisage FAQPage. Seules les questions réellement répondues y figurent,
 * mot pour mot comme à l'écran. En dessous de deux, pas de balisage : Google
 * refuse une FAQ d'une seule question plutôt que de l'ignorer.
 */
export function schemaFaqPage(items: Array<Pick<ItemFaq, "question" | "reponse" | "repondue">>): Record<string, unknown> | null {
  const repondues = items.filter((i) => i.repondue !== false && i.question && i.reponse);
  if (repondues.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: repondues.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.reponse },
    })),
  };
}

/** Convertit une ligne de `products` en produit de FAQ. */
export function produitDepuisLigne(l: Record<string, unknown>): ProduitFaq | null {
  const nom = typeof l.name === "string" ? l.name.trim() : "";
  if (!nom || typeof l.id !== "string") return null;
  const texte = (v: unknown) => (typeof v === "string" && v.trim() ? v : null);
  return {
    id: l.id,
    nom,
    description: texte(l.description),
    description_courte: texte(l.short_description),
    ingredients: texte(l.ingredients),
    categorie: texte(l.category),
    champs: [l.acf_fields, l.attributes].filter(Boolean),
    lien: texte(l.purchase_link) ?? texte(l.woo_permalink),
  };
}

/** Convertit la ligne `brand_knowledge` en savoir public (les autres colonnes sont ignorées). */
export function savoirDepuisLigne(l: Record<string, unknown> | null | undefined): SavoirPublic {
  if (!l) return {};
  const t = (v: unknown) => (typeof v === "string" && v.trim() ? v : null);
  const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
  return {
    description_marque: t(l.brand_description),
    public_cible: t(l.target_audience),
    politique_ingredients: t(l.ingredients_policy),
    livraison: t(l.shipping_info),
    livraison_offerte_des: n(l.shipping_free_threshold),
    retours: t(l.returns_policy),
    delai_retour_jours: n(l.returns_delay_days),
    sav: t(l.support_info),
    horaires: t(l.horaires_ouverture),
  };
}

/**
 * Fusionne ce que le site dit (FAQ, CGV, contact) avec le savoir saisi par
 * la marque : ce qu'elle a écrit elle-même prime, le site complète.
 */
export function avecSite(savoir: SavoirPublic, site: Record<string, unknown> | null | undefined): SavoirPublic {
  if (!site) return savoir;
  const t = (v: unknown) => (typeof v === "string" && v.trim() ? v : null);
  const n = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
  return {
    ...savoir,
    livraison: savoir.livraison ?? t(site.livraison),
    livraison_offerte_des: savoir.livraison_offerte_des ?? n(site.livraison_offerte_des),
    retours: savoir.retours ?? t(site.retours),
    delai_retour_jours: savoir.delai_retour_jours ?? n(site.delai_retour_jours),
    horaires: savoir.horaires ?? t(site.horaires),
    email: t(site.email),
    telephone: t(site.telephone),
    adresse: t(site.adresse),
    page_contact: t(site.page_contact),
    retractation: t(site.retractation),
    paiement: t(site.paiement),
    garanties: t(site.garanties),
    faq_site: Array.isArray(site.faq) ? (site.faq as Array<{ question: string; reponse: string }>) : [],
  };
}

