/**
 * LES PARAMÈTRES DE SUIVI D'UN LIEN SORTANT VERS LE SITE D'UNE MARQUE
 * (lot 11, 12/10/2026).
 *
 * Plan du 12/10, promesse 29 : les liens d'achat du magazine partaient sans
 * paramètre de suivi, donc la marque ne voyait jamais dans ses statistiques
 * qu'une vente venait d'un article. Un seul assistant pour tous les lots
 * (magazine, FAQ, avis, multi-lien) : la même règle partout, écrite une fois.
 *
 *   ajouterSuivi("https://marque.fr/produit/x", "magazine", "mon-article")
 *   → https://marque.fr/produit/x?utm_source=lystes&utm_medium=magazine&utm_campaign=mon-article
 *
 * Règles :
 *   - seules les adresses http(s) absolues sont touchées ; tout le reste
 *     (ancre, mailto:, adresse relative, texte invalide) revient tel quel ;
 *   - un utm_source déjà posé par la marque est respecté : rien n'est ajouté,
 *     on n'écrase jamais le suivi de quelqu'un d'autre ;
 *   - l'ancre (#…) et les autres paramètres sont gardés.
 *
 * Module pur, sans import : lisible aussi par les scripts et par Deno.
 */

export const SOURCE_SUIVI = "lystes";

/** Une valeur de paramètre propre : minuscules, chiffres, tirets, 100 caractères au plus. */
export function valeurDeSuivi(brut: string): string {
  return String(brut ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function ajouterSuivi(url: string, medium: string, campagne?: string | null): string {
  if (typeof url !== "string" || !/^https?:\/\//i.test(url.trim())) return url;
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return url;
  }
  if (u.searchParams.has("utm_source")) return url;
  const m = valeurDeSuivi(medium);
  if (!m) return url;
  u.searchParams.set("utm_source", SOURCE_SUIVI);
  u.searchParams.set("utm_medium", m);
  const c = campagne ? valeurDeSuivi(campagne) : "";
  if (c) u.searchParams.set("utm_campaign", c);
  return u.toString();
}
