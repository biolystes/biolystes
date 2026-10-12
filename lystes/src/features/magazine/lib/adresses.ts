/**
 * LES ADRESSES DU MAGAZINE D'UNE MARQUE (02/10/2026).
 *
 * Le magazine d'une marque vit à lystes.ai/<marque>/mag, chaque article à
 * lystes.ai/<marque>/mag/<article>. Les adresses déjà diffusées mènent à
 * celles-ci, dans le navigateur (RedirectionMagazine) comme dans le
 * pré-rendu (scripts/seo/magazine-marque.ts) :
 *   - /<marque>/blog            → /<marque>/mag
 *   - /<marque>/blog/<article>  → /<marque>/mag/<article>
 *   - /blog/<marque>            → /<marque>/mag
 *
 * Une seule source pour l'écran, la canonique, le pré-rendu et le plan du
 * site : une adresse recopiée à la main dans quatre fichiers finit toujours
 * par diverger. Module pur, sans import, lu aussi par les scripts du build.
 *
 * `/mag` et `/mag/<article>` seuls restent Lystes Mag, le magazine de Lystes.
 */

export const ORIGINE_LYSTES = "https://lystes.ai";

/** Le segment qui suit la marque dans l'adresse de son magazine. */
export const SEGMENT_MAGAZINE = "mag";

export const cheminMagazine = (marque: string): string => `/${marque}/${SEGMENT_MAGAZINE}`;

export const cheminArticle = (marque: string, article: string): string =>
  `/${marque}/${SEGMENT_MAGAZINE}/${article}`;

export const canoniqueMagazine = (marque: string): string => `${ORIGINE_LYSTES}${cheminMagazine(marque)}`;

export const canoniqueArticle = (marque: string, article: string): string =>
  `${ORIGINE_LYSTES}${cheminArticle(marque, article)}`;

/**
 * L'adresse /mag qui remplace une ancienne adresse du magazine, ou null si
 * le chemin n'en est pas une. La requête et l'ancre ne sont pas lues ici :
 * l'appelant les recolle.
 */
export function versLeMagazine(chemin: string): string | null {
  const s = chemin.split(/[?#]/)[0].split("/").filter(Boolean);
  if (s.length === 2 && s[0] === "blog") return cheminMagazine(s[1]);
  if (s.length === 2 && s[1] === "blog") return cheminMagazine(s[0]);
  if (s.length === 3 && s[1] === "blog") return cheminArticle(s[0], s[2]);
  return null;
}
