/**
 * Convertit un nom de produit en slug URL-safe.
 * "Sérum à la Vitamine C" → "serum-a-la-vitamine-c"
 */
export function generateProductSlug(name: string): string {
  const base = (name ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base.slice(0, 80) || `produit-${Date.now().toString(36)}`;
}
