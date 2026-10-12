import type { AIGraphiste } from "../types";

import avatarEditorial from "@lystes/assets/photographers/isabelle.jpg";
import avatarDiagramme from "@lystes/assets/photographers/camille.jpg";
import avatarBloc from "@lystes/assets/photographers/victoria.jpg";
import avatarGradient from "@lystes/assets/photographers/luna.jpg";

/**
 * QUATRE STYLES, TIRÉS DES RÉFÉRENCES QUE JP A RÉUNIES LE 14/09/2026.
 *
 * JP : « groupe les créas par thématique ou style, comme ça on peut créer des
 * graphistes, en fonction du style de contenu ».
 *
 * CE QUE J'AI VU dans ses dix-neuf références, avant d'écrire une ligne : trois
 * marques, Commodity, MUTHA et Prequel, et une grammaire COMMUNE qu'elles
 * partagent toutes les trois :
 *   - logo en haut à gauche, adresse du site en haut à droite ;
 *   - UNE accroche, deux lignes au maximum, jamais trois idées ;
 *   - une sous-ligne courte, ou rien ;
 *   - le produit PHOTOGRAPHIÉ, posé sur une matière réelle ou tenu en main,
 *     avec son ombre portée et son point de contact ;
 *   - un seul bouton, contour fin, en gélule ;
 *   - la palette tirée du produit lui-même ;
 *   - zéro icône de banque d'images, zéro dégradé sous le texte, zéro ombre
 *     portée sur la typographie.
 *
 * CE QUI LES SÉPARE tient à UNE variable, et c'est la découverte utile : la
 * typographie. Serif italique à fort contraste chez Commodity, grotesque gras
 * capitales chez MUTHA, sans-serif léger chez Prequel. C'est elle qui rend une
 * marque reconnaissable en un dixième de seconde, pas sa couleur.
 *
 * LE DÉFAUT QUE CELA RÉPARE. Le seul graphiste livré, Céline, impose
 * « modern sans-serif THIN weight » dans ses six prompts. Toutes les marques
 * héritaient donc du même caractère : trop de cohérence ENTRE les marques, pas
 * assez AU SEIN d'une marque. Une agence se reconnaît à sa signature, et une
 * signature unique pour tous est l'absence de signature.
 *
 * COMMENT S'EN SERVIR. Choisir un style, c'est choisir une grammaire tenue sur
 * six visuels. La marque, elle, vient d'ailleurs : du produit joint en
 * référence et de `brand_dna`. Le style dit COMMENT, la marque dit QUOI.
 */

/** La grammaire commune aux dix-neuf références, rappelée dans chaque prompt. */
const CADRE = [
  "Brand logo top left, website address top right, both small and quiet.",
  "The product is PHOTOGRAPHED, never composited: real cast shadow, real contact point with its support, same grain and sharpness as the rest of the frame.",
  "The EXACT product from the reference image: same packaging, label, logo, colours and proportions. Label readable, facing the camera.",
  "Palette taken from the product itself. No stock icon, no gradient behind text, no drop shadow on type.",
].join(" ");

/** Un seul appel à l'action, jamais deux, jamais aucun sur une image de marque. */
const BOUTON = "One single call to action in a thin outlined pill, lower area, label of two or three words.";

/**
 * STYLE 1 — L'ÉDITORIAL SERIF. Commodity Gold, Milk, Book, Moss.
 * L'accroche est une balance en deux temps, et c'est elle le sujet.
 */
const PROMPTS_EDITORIAL = [
  `Advertising creative, 1:1. ${CADRE} Headline in HIGH-CONTRAST SERIF ITALIC, large, two lines forming a balanced pair, upper third. The product stands on a raw natural material, stone or driftwood, in a dark studio with one directional light. ${BOUTON}`,
  `Advertising creative, 1:1. ${CADRE} Headline in HIGH-CONTRAST SERIF ITALIC over a pale background, the product photographed very close, filling the right half, one short sub-line of ten words under the headline. ${BOUTON}`,
  `Advertising creative, 4:5. ${CADRE} The product held in a real hand, sleeve visible, blurred interior behind. Headline in HIGH-CONTRAST SERIF ITALIC across the lower third, three lines maximum. ${BOUTON}`,
  `Advertising creative, 1:1. ${CADRE} The product on a plain plinth, one raw ingredient or material beside it at its base. Headline in HIGH-CONTRAST SERIF ITALIC, centred, upper third. No sub-line.`,
  `Advertising creative, 9:16. ${CADRE} Dark gradient background, the product lower right, tilted, resting on wood. Headline in HIGH-CONTRAST SERIF ITALIC upper left, plus one sub-line of two short sentences. ${BOUTON}`,
  `Advertising creative, 1:1. ${CADRE} Closing frame: the product alone, centred, on a single flat colour taken from its own label. Brand name in HIGH-CONTRAST SERIF ITALIC, small, no other text.`,
];

/**
 * STYLE 2 — LE DIAGRAMME ANNOTÉ. Commodity Juice, MUTHA Best Sellers.
 * On NOMME les éléments, on ne promet rien : une annotation n'est pas un claim.
 */
const PROMPTS_DIAGRAMME = [
  `Advertising creative, 1:1. ${CADRE} The product centred on a pale background, three or four DASHED CURVED ARROWS pointing to it from the edges, each ending in two or three words naming a note, an ingredient or a material. Modern sans-serif, light weight. Headline above, serif, two lines.`,
  `Advertising creative, 1:1. ${CADRE} The product with its real raw ingredients placed at its base, each named by a dashed arrow. One text colour for the whole frame.`,
  `Advertising creative, 4:5. ${CADRE} Several products of the same range floating slightly tilted, each carrying a WHITE ROUNDED PILL LABEL with its name, thin outline. Off-white background, soft shadows under each item.`,
  `Advertising creative, 1:1. ${CADRE} The product centred inside a thin circle outline, four to six benefits placed around it at even spacing, each marked by a small dot. Ultra-thin connector lines, 0.5 to 1 pixel.`,
  `Advertising creative, 1:1. ${CADRE} Extreme close crop on the product's material, one or two characteristics annotated with ultra-thin lines and small end dots, museum-label typography: minimal, precise, architectural.`,
  `Advertising creative, 4:5. ${CADRE} The product on a clean surface, a vertical thin line on one side carrying a list of four short factual lines. Nothing promised, only named.`,
];

/**
 * STYLE 3 — LE BLOC TYPOGRAPHIQUE. MUTHA.
 * Le titre occupe l'écran, le produit arrive dessous. Aucune finesse.
 */
const PROMPTS_BLOC = [
  `Advertising creative, 4:5. ${CADRE} Headline in HEAVY GROTESQUE CAPITALS, two lines, occupying the upper third, black on off-white. The product cluster below, floating, tilted, with soft contact shadows. One short sub-line under the headline.`,
  `Advertising creative, 1:1. ${CADRE} A single word in HEAVY GROTESQUE CAPITALS filling the frame width, the product overlapping it slightly from below.`,
  `Advertising creative, 9:16. ${CADRE} Headline in HEAVY GROTESQUE CAPITALS upper area, the product large and centred below, one bold colour field taken from the product behind it. ${BOUTON}`,
  `Advertising creative, 4:5. ${CADRE} The product cluster of the whole range, each item carrying a white rounded pill label with its name. Headline in HEAVY GROTESQUE CAPITALS above.`,
  `Advertising creative, 1:1. ${CADRE} Oversized brand name in HEAVY GROTESQUE CAPITALS ghosted at low opacity behind the product, the product sharp in front, splashing or pouring its own texture.`,
  `Advertising creative, 1:1. ${CADRE} Closing frame: bold colour block, the product anchored bottom right, two words in HEAVY GROTESQUE CAPITALS upper left.`,
];

/**
 * STYLE 4 — LE GRADIENT INCARNÉ. Prequel.
 * Une main, une texture réelle, et du texte qui suit une courbe.
 */
const PROMPTS_GRADIENT = [
  `Advertising creative, 9:16. ${CADRE} Smooth colour gradient background taken from the product. A real hand holds the product, a second forearm shows a swatch of the product's own texture. Headline in LIGHT GEOMETRIC SANS, two sizes on two lines, upper left.`,
  `Advertising creative, 9:16. ${CADRE} Gradient background, one short factual line set along a CURVED BASELINE arcing around the hand. Light geometric sans, generous letter spacing.`,
  `Advertising creative, 1:1. ${CADRE} The product held up against a plain sky gradient, natural daylight, headline in LIGHT GEOMETRIC SANS centred above.`,
  `Advertising creative, 9:16. ${CADRE} Close crop on skin with the product's texture applied and spread, the product itself smaller in a corner. One short line of light geometric sans.`,
  `Advertising creative, 4:5. ${CADRE} Gradient field, the product centred, a rating of five small stars and one short factual line in the lower area. Light geometric sans throughout.`,
  `Advertising creative, 9:16. ${CADRE} Closing frame: the product alone on the gradient, brand name in LIGHT GEOMETRIC SANS, small, centred, nothing else.`,
];

const CADRAGES = [
  "Accroche",
  "Gros plan",
  "En main",
  "Diagramme",
  "Matière",
  "Clôture",
];

export const GRAPHISTES_STYLES: AIGraphiste[] = [
  {
    id: "style-editorial-serif",
    name: "Hélène",
    specialty: "Éditorial serif",
    type: "Style Commodity",
    title: "Accroche en balance, serif italique fort contraste, produit sur matière brute",
    avatar: avatarEditorial,
    sectorKey: "editorial",
    edgeFunction: "generate-product-photos",
    promptsPortfolio: PROMPTS_EDITORIAL,
    sampleImages: [],
  },
  {
    id: "style-diagramme-annote",
    name: "Aurore",
    specialty: "Diagramme annoté",
    type: "Style pédagogique",
    title: "Flèches pointillées et pastilles : on nomme les composants, on ne promet rien",
    avatar: avatarDiagramme,
    sectorKey: "branding",
    edgeFunction: "generate-product-photos",
    promptsPortfolio: PROMPTS_DIAGRAMME,
    sampleImages: [],
  },
  {
    id: "style-bloc-typographique",
    name: "Garance",
    specialty: "Bloc typographique",
    type: "Style MUTHA",
    title: "Grotesque gras capitales, le titre occupe l’écran, le produit arrive dessous",
    avatar: avatarBloc,
    sectorKey: "ads",
    edgeFunction: "generate-product-photos",
    promptsPortfolio: PROMPTS_BLOC,
    sampleImages: [],
  },
  {
    id: "style-gradient-incarne",
    name: "Maëlys",
    specialty: "Gradient incarné",
    type: "Style Prequel",
    title: "Dégradé, une main, la texture réelle du produit, texte sur ligne courbe",
    avatar: avatarGradient,
    sectorKey: "social",
    edgeFunction: "generate-product-photos",
    promptsPortfolio: PROMPTS_GRADIENT,
    sampleImages: [],
  },
];

export { CADRAGES as CADRAGES_STYLES };
