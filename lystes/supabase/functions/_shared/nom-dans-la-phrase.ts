/**
 * Le nom d'un produit dans une phrase française (04/10/2026, JP).
 *
 * Les fiches donnent souvent le nom en capitales (« SÉRUM PERFECTEUR DE
 * PIGMENTATION ») et sans article. Posé tel quel dans « Qu'est-ce que … ? »,
 * il crie et la phrase boite. Ici : un nom en capitales passe en minuscules,
 * et il reçoit son article (le, la, l', les), contracté après « de » (du,
 * des). Un nom déjà écrit en casse normale garde ses majuscules.
 *
 * 09/10/2026, fiche Éclose « Huile corporelle Omega 6-9 » : trois défauts.
 *  - « Le le Nettoyant … » : le nom en tête de phrase recevait « Le », puis
 *    un second passage, sensible à la casse, ne reconnaissait pas « Le »
 *    comme article et en ajoutait un autre. La phrase est maintenant lue une
 *    seule fois, occurrence par occurrence, et l'article déjà présent se
 *    reconnaît quelle que soit sa casse : relire une phrase déjà réécrite ne
 *    la change plus, et un article doublé par l'ancien calcul est réparé.
 *  - « L'Huile … est-il » : le nom donne son genre et son nombre
 *    (`feminin`, `pluriel`, `il`), pour accorder le verbe et l'adjectif
 *    (`accord`).
 *  - Un nom qui porte déjà son article (« Le Nettoyant doux ») n'en reçoit
 *    pas un second, et se contracte après « de » (« du Nettoyant doux »).
 */

/** Premiers mots féminins courants des fiches (soin, mode, maison). */
const FEMININS = new Set([
  "crème", "creme", "huile", "brume", "eau", "lotion", "mousse", "poudre", "perruque", "gelée", "gelee", "cire",
  "pommade", "base", "palette", "bougie", "robe", "veste", "chemise", "jupe", "paire", "trousse", "routine",
  "lingette", "ampoule", "émulsion", "emulsion", "essence", "bouteille", "gamme", "lampe", "montre", "bague",
  "boucle", "chaîne", "chaine", "parure", "écharpe", "echarpe", "casquette", "ceinture", "tunique", "teinture",
  "coloration", "protection", "cure", "solution", "fragrance", "huile", "mascara-crème", "ombre", "poudre",
  "laque", "gaine", "tisane", "infusion", "boisson", "barre", "box", "pochette", "trousse", "brosse", "lime",
  "pince", "tenue", "combinaison", "culotte", "brassière", "brassiere", "legging", "chaussette", "basket",
  "sandale", "botte", "bottine", "ballerine", "sacoche", "valise", "housse", "nappe", "serviette", "couverture",
  "coque", "glace", "pâte", "pate", "recharge", "formule", "synergie", "cure", "gomme", "lotion-tonique",
  "argile", "fleur", "graine", "potion", "goutte", "perle", "capsule", "gélule", "gelule", "mèche", "meche",
  "extension",
]);

/** Premiers mots au pluriel courants (« Gouttes … », « Lunettes … »), féminins. */
const PLURIELS_FEMININS = new Set([
  "gouttes", "lunettes", "chaussures", "baskets", "boucles", "extensions", "mèches", "meches", "perles", "capsules",
  "gélules", "gelules", "bougies",
]);
/** Premiers mots au pluriel, masculins (« Patchs … »). */
const PLURIELS_MASCULINS = new Set(["patchs", "patches"]);

const LETTRE = "A-Za-zÀ-ÖØ-öø-ÿ";

function enCapitales(nom: string): boolean {
  const lettres = nom.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");
  if (lettres.length < 3) return false;
  const majuscules = lettres.replace(/[^A-ZÀ-ÖØ-Þ]/g, "").length;
  return majuscules / lettres.length > 0.8;
}

/** Le nom tel qu'il s'écrit dans une phrase : minuscules s'il était en capitales. */
export function nomCourant(nom: string): string {
  const propre = String(nom || "").replace(/\s+/g, " ").trim();
  return enCapitales(propre) ? propre.toLocaleLowerCase("fr-FR") : propre;
}

function majuscule(s: string): string {
  return s.charAt(0).toLocaleUpperCase("fr-FR") + s.slice(1);
}

export type FormesDuNom = {
  /** « le sérum perfecteur », « l'huile », « la crème », « les gouttes » */
  le: string;
  /** « du sérum perfecteur », « de l'huile », « de la crème », « des gouttes » */
  du: string;
  /** En tête de phrase : « Le sérum perfecteur … » */
  Le: string;
  /** Le nom sans article (« Nettoyant doux » pour « Le Nettoyant doux »). */
  nom: string;
  feminin: boolean;
  pluriel: boolean;
  /** Le pronom sujet accordé : « est-il », « est-elle », « sont-ils », « sont-elles ». */
  il: "il" | "elle" | "ils" | "elles";
};

/** L'article que le nom porte déjà : « Le Nettoyant », « La Crème », « L'Huile », « Les Gouttes ». */
const ARTICLE_EN_TETE = /^(?:(le|la|les)\s+|(l)['’]\s*)(?=\S)/i;

export function formesDuNom(nom: string): FormesDuNom {
  const complet = nomCourant(nom);
  const tete = complet.match(ARTICLE_EN_TETE);
  const article = tete ? (tete[1] ?? tete[2]).toLocaleLowerCase("fr-FR") : null;
  const n = tete ? complet.slice(tete[0].length) : complet;
  const premier = (n.split(/[\s'’-]/)[0] || "").toLocaleLowerCase("fr-FR");

  const pluriel = article === "les" ||
    (article === null && (PLURIELS_FEMININS.has(premier) || PLURIELS_MASCULINS.has(premier)));
  let feminin: boolean;
  if (article === "la") feminin = true;
  else if (article === "le") feminin = false;
  else if (pluriel) feminin = PLURIELS_FEMININS.has(premier) || FEMININS.has(premier.replace(/[sx]$/, ""));
  else feminin = FEMININS.has(premier);

  let le: string;
  let du: string;
  if (pluriel) {
    le = `les ${n}`;
    du = `des ${n}`;
  } else if (/^[aeiouyàâäéèêëîïôöùûüh]/i.test(n)) {
    le = `l'${n}`;
    du = `de l'${n}`;
  } else if (feminin) {
    le = `la ${n}`;
    du = `de la ${n}`;
  } else {
    le = `le ${n}`;
    du = `du ${n}`;
  }
  const il = pluriel ? (feminin ? "elles" : "ils") : (feminin ? "elle" : "il");
  return { le, du, Le: majuscule(le), nom: n, feminin, pluriel, il };
}

/**
 * Le mot accordé au nom : `accord(f, "naturel", "naturelle", "naturels", "naturelles")`,
 * ou `accord(f, "est-il", "est-elle", "sont-ils", "sont-elles")`.
 */
export function accord(
  f: Pick<FormesDuNom, "feminin" | "pluriel">,
  masculin: string,
  feminin: string,
  masculinPluriel: string,
  femininPluriel: string,
): string {
  if (f.pluriel) return f.feminin ? femininPluriel : masculinPluriel;
  return f.feminin ? feminin : masculin;
}

/** Ce qui précède le nom et lui sert déjà de déterminant, en toute casse (« Le », « de la », « vos »). */
const DETERMINANT_AVANT = new RegExp(
  `(?:^|[^${LETTRE}])(?:le|la|les|du|des|au|aux|ce|cet|cette|ces|votre|vos|notre|nos|mon|ma|mes|ton|ta|tes|son|sa|ses|leur|leurs|un|une) $`,
  "i",
);
/** « de » juste avant le nom : il se contracte avec l'article (du, de la, de l', des). */
const DE_AVANT = new RegExp(`(?:^|[^${LETTRE}])([Dd])e $`);
/** « Le le », « La la », « Les les » : l'article doublé par le calcul d'avant le 09/10. */
const ARTICLE_DOUBLE = new RegExp(`(^|[^${LETTRE}])(le|la|les) \\2 $`, "i");
/** Début de phrase : rien avant, ou une ponctuation finale. */
const DEBUT_DE_PHRASE = /(?:^\s*|[.!?…]\s+)$/;
const UNE_LETTRE = new RegExp(`[${LETTRE}]`);

/**
 * Réécrit une phrase qui contient le nom brut (« Qu'est-ce que SÉRUM X ? »)
 * avec ses formes (« Qu'est-ce que le sérum x ? »). Le nom déjà précédé d'un
 * article ou d'un déterminant ne reçoit pas d'article de plus, quelle que
 * soit la casse de ce déterminant. Relire une phrase déjà réécrite ne la
 * change pas. Sans le nom, la phrase reste.
 */
export function phraseAvecNom(phrase: string, nom: string): string {
  const brut = String(nom || "").replace(/\s+/g, " ").trim();
  if (!brut || !phrase || !phrase.includes(brut)) return phrase;
  const f = formesDuNom(brut);

  let sortie = "";
  let reste = phrase;
  let i: number;
  while ((i = reste.indexOf(brut)) !== -1) {
    let avant = sortie + reste.slice(0, i);
    const apres = reste.slice(i + brut.length);
    const precedent = avant.slice(-1);
    const suivant = apres.charAt(0);
    let forme: string;
    if ((precedent && /['’]/.test(precedent)) || UNE_LETTRE.test(precedent) || (suivant && UNE_LETTRE.test(suivant) && UNE_LETTRE.test(brut.slice(-1)))) {
      /* Après une élision (« l'Huile »), ou au milieu d'un mot : rien ne change. */
      forme = brut;
    } else if (DETERMINANT_AVANT.test(avant)) {
      /* Déjà déterminé (« le Sérum », « Le Nettoyant », « vos Gouttes ») : le nom seul. */
      avant = avant.replace(ARTICLE_DOUBLE, "$1$2 ");
      forme = f.nom;
    } else if (DE_AVANT.test(avant)) {
      const de = avant.match(DE_AVANT)![1];
      avant = avant.slice(0, -3);
      forme = de === "D" ? majuscule(f.du) : f.du;
    } else if (DEBUT_DE_PHRASE.test(avant)) {
      forme = f.Le;
    } else {
      forme = f.le;
    }
    sortie = avant + forme;
    reste = apres;
  }
  return sortie + reste;
}
