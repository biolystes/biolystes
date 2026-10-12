/**
 * Fallback hardcodé : URL du site officiel par slug de marque.
 * Utilisé quand `accounts.website` est vide en base.
 * À remplacer plus tard par une vraie config back-office.
 */
export const BRAND_WEBSITE_FALLBACK: Record<string, string> = {
  anaveraparis: "https://anaveraparis.com",
  "lolo-paris": "https://loloparis.com",
  delicesducongo: "https://delicesducongo.com",
  fraleneparis: "https://fraleneparis.com",
  glowlyparis: "https://glowlyparis.com",
  goldentiffany: "https://goldentiffany.com",
  kaniwabotanique: "https://kaniwabotanique.com",
  nafsibeautytherapie: "https://nafsibeautytherapie.com",
  soleyabeaute: "https://soleyabeaute.com",
  stellayato: "https://stellayato.com",
  trueageskin: "https://trueageskin.com",
  wkcosmetics: "https://wkcosmetics.com",
  pmyrrisbeauty: "https://pmyrrisbeauty.fr",
};

export function getBrandWebsite(slug: string | null | undefined, dbWebsite?: string | null): string | null {
  if (dbWebsite && dbWebsite.trim()) return dbWebsite.trim();
  if (!slug) return null;
  return BRAND_WEBSITE_FALLBACK[slug] ?? null;
}
