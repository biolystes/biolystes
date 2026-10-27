/* Filtres du catalogue (JP, 27/10/2026) : Catégorie, Étiquette, Type,
   Préoccupation, Principes actifs, plus le tri.

   Aucune donnée en double : toutes les valeurs sont calculées sur les vrais
   produits de src/data/catalogue-pro/products.ts (la même source que biolystes.pro).
   - Catégorie : le champ `categorie` ;
   - Étiquette : les certifications et mentions des cartes, plus « Nouveau » ;
   - Type : le genre de produit, lu dans le nom (crème, sérum, shampooing…) ;
   - Préoccupation : ce que le produit traite, lu dans le nom, les atouts et la
     description (hydratation, taches, peau sensible…) ;
   - Principes actifs : les ingrédients clés et la composition INCI.
   Une valeur n'est proposée que si au moins un produit la porte : le menu ne
   peut jamais mener à zéro soin. */
import { CATEGORIES, estNouveau, ordreCatalogue, type Product } from "@/data/catalogue-pro/products";
import { estAVenir } from "@/data/disponibilite";
import { PRODUITS_VISIBLES, categoriesEnBas } from "@/data/masquage-catalogue";

export type CleFiltre = "categorie" | "etiquette" | "type" | "preoccupation" | "actif";
export type Selection = Record<CleFiltre, Set<string>>;
export type Tri = "nouveautes" | "az";

export const TITRES_FILTRES: Record<CleFiltre, string> = {
  categorie: "Catégorie",
  etiquette: "Étiquette",
  type: "Type",
  preoccupation: "Préoccupation",
  actif: "Principes actifs",
};
export const ORDRE_FILTRES: CleFiltre[] = ["categorie", "etiquette", "type", "preoccupation", "actif"];

export const ETIQUETTE_NOUVEAU = "Nouveau";

export const selectionVide = (): Selection => ({
  categorie: new Set(), etiquette: new Set(), type: new Set(), preoccupation: new Set(), actif: new Set(),
});

export const nombreFiltresActifs = (s: Selection) => ORDRE_FILTRES.reduce((n, k) => n + s[k].size, 0);

/* ------------------------------------------------------------------ */
/* Règles de lecture. Les libellés sont ceux qu'une cliente comprend. */

const norm = (t: string) =>
  t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’`]/g, "'");

/** Genre de produit, lu dans le nom. Première règle qui correspond. */
const TYPES: [string, RegExp][] = [
  ["Bougie", /\bbougie/],
  ["Coffret et kit", /\b(coffret|kit|duo|ensemble|collection|lot|box|boite)\b/],
  ["Patchs", /\bpatch/],
  ["Fond de teint", /\bfond de teint/],
  ["Anti-cernes", /\banti-cernes|\bcorrecteur/],
  ["Rouge à lèvres", /\brouge a levres|\bbaume a levres|\bgloss/],
  ["Mascara", /\bmascara/],
  ["Poudre", /\bpoudre/],
  ["Après-shampooing", /\bapres-shampo|\bconditioner/],
  ["Shampooing", /\bshampo/],
  ["Masque", /\bmasque/],
  ["Sérum", /\bserum/],
  ["Crème", /\bcreme|\bbaume\b|\bbeurre\b/],
  ["Gel", /\bgel\b/],
  ["Huile", /\bhuile/],
  ["Nettoyant et démaquillant", /\b(nettoyant|demaquillant|mousse|savon)/],
  ["Tonique et brume", /\b(tonique|brume|lotion|eau micellaire)/],
  ["Exfoliant", /\b(exfoliant|gommage)/],
  ["Sels et bain", /\b(sels?|bain|bombe)\b/],
  ["Déodorant", /\bdeodorant/],
  ["Protection solaire", /\b(solaire|spf)\b|protection\b/],
  ["Soin", /\bsoin\b|\bconcentre\b|\bstick\b|\bspot\b/],
];

/** Ce que le produit traite. Plusieurs valeurs possibles, lues dans nom + atouts + description. */
const PREOCCUPATIONS: [string, RegExp][] = [
  ["Hydratation", /hydrat|desalter|seche|secheresse/],
  ["Anti-âge", /anti-age|anti-rides|ridule|rides|fermete|retinol|collagene|peptide|raffermi|mature/],
  ["Taches et éclat", /tache|eclat|teint irregulier|uniformis|illumin|pigment|eclairc/],
  ["Peau sensible", /peau sensible|peaux sensibles|apais|reactive|irrit|doux pour la peau|hypoallerg/],
  ["Imperfections", /imperfection|acne|boutons|purifi|sebum|pores|peau grasse|peaux grasses|mixte/],
  ["Nutrition", /nourri|nutri|reparat|repar|reconstitu/],
  ["Contour des yeux", /contour des yeux|cernes|poches|pour les yeux/],
  ["Cheveux bouclés", /boucl|cheveux textur|frises/],
  ["Volume et brillance", /volume|brillance|brillant|epaiss/],
  ["Cuir chevelu", /cuir chevelu|pellicul|chute|pousse/],
  ["Détente et bien-être", /relax|detente|spa\b|bien-etre|sommeil|apaisement/],
  ["Énergie et performance", /energie|performance|endurance|vitalite|pre-workout|electrolyte/],
];

/** Principes actifs : nom clair + ce qui les trahit dans les ingrédients clés ou l'INCI. */
const ACTIFS: [string, RegExp][] = [
  ["Acide hyaluronique", /hyaluron/],
  ["Niacinamide", /niacinamide/],
  ["Vitamine C", /vitamine c\b|ascorb|vitamin c\b/],
  ["Vitamine E", /vitamine e\b|tocopher|vitamin e\b/],
  ["Peptides", /peptide/],
  ["Panthénol", /panthenol/],
  ["Céramides", /ceramide/],
  ["Caféine", /cafeine|caffeine/],
  ["Bétaïne", /betaine/],
  ["PCA de sodium", /sodium pca|pca de sodium/],
  ["Glycérine", /glycerine|glycerin\b/],
  ["Aloe vera", /aloe|aloes/],
  ["Huile de jojoba", /jojoba|simmondsia/],
  ["Huile d'argan", /argan/],
  ["Huile d'avocat", /avocat|persea/],
  ["Beurre de karité", /karite|butyrospermum/],
  ["Beurre de cacao", /beurre de cacao|theobroma/],
  ["Acide lactique", /acide lactique|lactic acid/],
  ["Acide salicylique", /salicyl/],
  ["Kératine", /keratine|keratin/],
  ["Protéines de blé", /proteines? de ble|wheat protein/],
  ["Cannabidiol (CBD)", /cannabidiol|\bcbd\b/],
  ["Eau de rose", /eau de fleurs de rose|rosa damascena/],
  ["Huile de rose musquée", /rose musquee|rosa moschata|rosa canina/],
  ["Sel marin", /sel marin|maris sal/],
];

/* ------------------------------------------------------------------ */
/* Étiquettes : une graphie par mention. */
function etiquettes(p: Product): string[] {
  const out = new Set<string>();
  for (const c of p.certifications) {
    const n = norm(c);
    if (/vegetalien|vegan/.test(n)) out.add("Végétalien");
    else if (/sans gluten/.test(n)) out.add("Sans gluten");
    else if (/sans noix/.test(n)) out.add("Sans noix");
    else if (/cosmos organic|biologique/.test(n)) out.add("Biologique");
    else if (/cosmos natural|certifie naturel/.test(n)) out.add("Certifié naturel");
    else if (/sans parfum/.test(n)) out.add("Sans parfum");
    else if (/sans allergene/.test(n)) out.add("Sans allergène sur l'étiquette");
    else if (/dermatolog/.test(n)) out.add("Testé dermatologiquement");
  }
  for (const f of p.star_features) {
    const n = norm(f);
    if (/\bvegan\b|vegetalien/.test(n)) out.add("Végétalien");
    if (/certifie(e)? biologique/.test(n)) out.add("Biologique");
    if (/sans parfum/.test(n)) out.add("Sans parfum");
  }
  if (estNouveau(p)) out.add(ETIQUETTE_NOUVEAU);
  return [...out];
}

function types(p: Product): string[] {
  if (p.categorie === "supplements") return ["Complément alimentaire"];
  const nom = norm(p.nom);
  const t = TYPES.find(([, re]) => re.test(nom));
  return t ? [t[0]] : [];
}

function preoccupations(p: Product): string[] {
  if (p.categorie === "supplements" || p.categorie === "bougies") {
    const t = norm(`${p.nom} ${p.star_features.join(" ")} ${p.description}`);
    return PREOCCUPATIONS.filter(([n, re]) => (n === "Énergie et performance" || n === "Détente et bien-être") && re.test(t)).map(([n]) => n);
  }
  const tete = norm(`${p.nom} ${p.star_features.join(" ")}`);
  const corps = norm(p.description);
  return PREOCCUPATIONS.filter(([n, re]) => {
    if (n === "Énergie et performance") return false;
    // Le nom et les atouts disent l'essentiel ; la description complète les cas où elle le dit clairement.
    return re.test(tete) || re.test(corps);
  }).map(([n]) => n);
}

function actifs(p: Product): string[] {
  const t = norm(`${p.ingredients} ${p.star_features.join(" ")} ${p.inci}`);
  return ACTIFS.filter(([, re]) => re.test(t)).map(([n]) => n);
}

export interface ProduitFiltrable { p: Product; valeurs: Record<CleFiltre, string[]> }

const CACHE = new Map<string, Record<CleFiltre, string[]>>();
export function valeursDe(p: Product): Record<CleFiltre, string[]> {
  let v = CACHE.get(p.slug);
  if (!v) {
    v = { categorie: [p.categorie], etiquette: etiquettes(p), type: types(p), preoccupation: preoccupations(p), actif: actifs(p) };
    CACHE.set(p.slug, v);
  }
  return v;
}

const LABEL_CATEGORIE = new Map<string, string>(CATEGORIES.filter((c) => c.id !== "all").map((c) => [c.id, c.label]));
export const libelleCategorie = (id: string) => LABEL_CATEGORIE.get(id) ?? id;

export interface OptionFiltre { valeur: string; libelle: string; n: number }

/** Les valeurs de chaque filtre, avec le nombre de produits qui les portent (au moins un). */
export function optionsFiltres(produits: readonly Product[] = PRODUITS_VISIBLES): Record<CleFiltre, OptionFiltre[]> {
  const compte = (k: CleFiltre) => {
    const m = new Map<string, number>();
    for (const p of produits) for (const v of valeursDe(p)[k]) m.set(v, (m.get(v) ?? 0) + 1);
    return m;
  };
  const trie = (m: Map<string, number>, ordre?: string[]): OptionFiltre[] =>
    [...m.entries()]
      .map(([valeur, n]) => ({ valeur, libelle: valeur, n }))
      .sort((a, b) => (ordre ? ordre.indexOf(a.valeur) - ordre.indexOf(b.valeur) : b.n - a.n || a.libelle.localeCompare(b.libelle, "fr")));
  const cat = compte("categorie");
  return {
    categorie: CATEGORIES.filter((c) => c.id !== "all" && cat.has(c.id)).map((c) => ({ valeur: c.id, libelle: c.label, n: cat.get(c.id)! })),
    etiquette: trie(compte("etiquette"), [ETIQUETTE_NOUVEAU, "Végétalien", "Sans gluten", "Sans noix", "Biologique", "Certifié naturel", "Sans parfum", "Sans allergène sur l'étiquette", "Testé dermatologiquement"]),
    type: trie(compte("type")),
    preoccupation: trie(compte("preoccupation")),
    actif: trie(compte("actif")),
  };
}

/** OU à l'intérieur d'un filtre, ET entre les filtres. */
export function correspond(p: Product, s: Selection): boolean {
  const v = valeursDe(p);
  return ORDRE_FILTRES.every((k) => s[k].size === 0 || v[k].some((x) => s[k].has(x)));
}

/** Rang d'un produit selon sa disponibilité : disponible, bientôt, rupture, retiré. */
const rangDispo = (p: Product) => (p.status === "retired" ? 3 : p.statut_labo === "OUT_OF_STOCK" ? 2 : estAVenir(p) ? 1 : 0);

/**
 * Tri « Nouveautés » (le tri par défaut, JP 27/10/2026) : d'abord tous les produits
 * « Bientôt », puis les nouveautés (la plus récente en tête), puis le reste des
 * produits disponibles, puis les ruptures, puis les retirés. À rang égal, l'ordre
 * du catalogue. Tri « A à Z » : disponibles, bientôt, ruptures, retirés, chacun par
 * ordre alphabétique.
 * Dans les deux tris, les catégories rangées « en bas » (compléments alimentaires,
 * JP 27/10/2026) passent après tous les soins et le maquillage, y compris après
 * les soins retirés ; entre eux, l'ordre du tri s'applique.
 */
export function trier<T extends Product>(liste: readonly T[], tri: Tri): T[] {
  const base = ordreCatalogue(liste);
  if (tri === "nouveautes") {
    const rang = (p: T) => {
      const d = rangDispo(p);
      if (d === 1) return 0;
      if (d === 0) return estNouveau(p) ? 2 : 3;
      return 2 + d + 1;
    };
    return categoriesEnBas(base.map((p, i) => ({ p, i })).sort((a, b) => rang(a.p) - rang(b.p) || a.i - b.i).map((x) => x.p));
  }
  return categoriesEnBas([...base].sort((a, b) => rangDispo(a) - rangDispo(b) || a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" })));
}
