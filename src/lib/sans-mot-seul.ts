/**
 * Règle de JP : jamais un mot seul sur la dernière ligne d'un titre.
 * `text-wrap: balance` ne suffit pas sur les noms courts (« Huile visage nourrissante »
 * finit sur « NOURRISSANTE » seul dans une carte de 375 px) : on lie les deux derniers
 * mots par une espace insécable. Au-delà de LONGUEUR_MAX caractères (une carte à 320 px
 * laisse 92 px de texte, soit environ 12 capitales), la paire liée déborderait : on laisse
 * alors le navigateur couper, aucune coupe ne pouvant éviter le mot seul à cette largeur.
 */
const LONGUEUR_MAX = 12;

export function sansMotSeul(texte: string): string {
  const t = texte.trim();
  const i = t.lastIndexOf(" ");
  if (i <= 0) return t;
  const j = t.lastIndexOf(" ", i - 1);
  const paire = t.slice(j + 1);
  if (paire.length > LONGUEUR_MAX) return t;
  return `${t.slice(0, i)} ${t.slice(i + 1)}`;
}
