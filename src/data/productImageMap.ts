// ─── Product image lookup ──────────────────────────────────
// Clean images are now served from the product_clean_images database table.
// This module is kept for backward compatibility but returns empty results.

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export { normalize };

export interface ProductImageEntry {
  nom: string;
  image_principale: string;
  image_2: string;
  image_3: string;
  allImages: string[];
}

let _cache: Map<string, ProductImageEntry> | null = null;

export async function loadProductImages(): Promise<Map<string, ProductImageEntry>> {
  if (!_cache) _cache = new Map();
  return _cache;
}

export function getProductImagesSync(_normalizedName: string): string[] {
  return [];
}
