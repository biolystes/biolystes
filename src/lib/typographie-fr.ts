/**
 * Typographie française des textes des pages (JP, 13/11/2026) : jamais un mot
 * seul en fin de ligne, jamais une ponctuation double en début de ligne.
 * Utilisée par les pages « Formules et ingrédients » et « Notre standard de
 * beauté propre » (src/pages/pied/cartes-standard.tsx). Pour un titre court,
 * voir aussi `sansMotSeul` (src/lib/sans-mot-seul.ts).
 */
const NBSP = " ";

/** Espace insécable avant « : ; ? ! % », après « « », entre un nombre et son unité. */
export function typo(texte: string): string {
  return texte
    .replace(/ ([:;?!%»€])/g, NBSP + "$1")
    .replace(/« /g, "«" + NBSP)
    .replace(/(\d) (h|ml|g|kg|jours?|fois)\b/g, "$1" + NBSP + "$2")
    .replace(/\bn° (\d)/g, "n°" + NBSP + "$1");
}

/** `typo`, et les deux derniers mots liés : pas de mot seul sur la dernière ligne d'un paragraphe. */
export function t(texte: string): string {
  return typo(texte).replace(/ (\S+)$/, NBSP + "$1");
}
