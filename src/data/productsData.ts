// ─── JSON product type from produits.json ─────────────────
export interface JSONProduct {
  url: string;
  categorie: string;
  slug: string;
  nom: string;
  volume: string;
  prix: string;
  moq: string;
  certifications: string;
  ingredients_fr: string;
  star_features: string;
  description: string;
  inci: string;
  arôme: string;
  images: string;
  erreur: string;
}

// ─── Enriched product fields ──────────────────────────────
export interface EnrichedFields {
  volume?: string;
  certifications?: string[];
  ingredients_fr?: string[];
  star_features?: string[];
  description_full?: string;
  inci?: string;
  arome?: string;
  slug?: string;
  categorie_json?: string;
  images_cdn?: { src: string }[];
}

// ─── Parse price from JSON format ─────────────────────────
// "PRIX / 1 PIÈCE 12,90 $ TVA MIN. ORDER QTY. No MOQ" → 12.90
export function parseJsonPrice(prixStr: string): number | null {
  if (!prixStr) return null;
  const match = prixStr.match(/([\d]+[,.][\d]+)/);
  if (!match) return null;
  return parseFloat(match[1].replace(",", "."));
}

// ─── Parse certifications ─────────────────────────────────
export function parseCertifications(str: string): string[] {
  if (!str) return [];
  return str.split("|").map(s => s.trim()).filter(Boolean);
}

// ─── Parse ingredients ────────────────────────────────────
export function parseIngredients(str: string): string[] {
  if (!str) return [];
  // Split by common patterns - ingredients are often space-separated phrases
  return str.split(/\s{2,}/).map(s => s.trim()).filter(Boolean);
}

// ─── Parse star features ──────────────────────────────────
export function parseStarFeatures(str: string): string[] {
  if (!str) return [];
  return str.split(",").map(s => s.trim()).filter(Boolean);
}

// ─── Parse images from JSON field ─────────────────────────
// Format: pipe-separated CDN paths. First is usually cert icon (60px), rest are product photos.
const CDN_BASE = "https://static.selfnamed.com";
export function parseJsonImages(imagesStr: string): { src: string }[] {
  if (!imagesStr) return [];
  const parts = imagesStr.split("|").map(s => s.trim()).filter(Boolean);
  // Skip certification icons (width=60), keep product photos
  const productImages = parts.filter(p => !p.includes("d2lkdGg9NjA=") && !p.includes("Y2VydGlmaWNhdGlvbnM"));
  return productImages.map(p => ({ src: `${CDN_BASE}${p}` }));
}

// ─── Category label mapping ───────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  "soins-du-corps": "Soins du corps",
  "soins-du-visage": "Soins du visage",
  "soins-capillaires": "Soins capillaires",
  "soins-pour-hommes": "Soins pour hommes",
  "coffrets-cadeaux": "Coffrets cadeaux",
  "aromatherapie": "Aromathérapie",
  "soins-solaires": "Soins solaires",
  "hygiene-bucco-dentaire": "Hygiène bucco-dentaire",
  "maquillage": "Maquillage",
};

export function getCategoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Normalize name for matching ──────────────────────────
export function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// ─── Build enrichment map ─────────────────────────────────
export function buildEnrichmentMap(jsonProducts: JSONProduct[]): Map<string, EnrichedFields & { jsonProduct: JSONProduct }> {
  const map = new Map<string, EnrichedFields & { jsonProduct: JSONProduct }>();
  for (const jp of jsonProducts) {
    const key = normalize(jp.nom);
    map.set(key, {
      volume: jp.volume || undefined,
      certifications: parseCertifications(jp.certifications),
      ingredients_fr: parseIngredients(jp.ingredients_fr),
      star_features: parseStarFeatures(jp.star_features),
      description_full: jp.description || undefined,
      inci: jp.inci || undefined,
      arome: jp.arôme || undefined,
      slug: jp.slug,
      categorie_json: jp.categorie,
      jsonProduct: jp,
    });
  }
  return map;
}

// ─── Convert JSON product to WCProduct-compatible format ──
export function jsonToWCProduct(jp: JSONProduct, index: number): any {
  const price = parseJsonPrice(jp.prix);
  const catLabel = getCategoryLabel(jp.categorie);

  return {
    id: -(index + 1), // negative IDs to avoid collision with WC
    name: jp.nom,
    price: price ? price.toString() : "",
    images: parseJsonImages(jp.images),
    tags: parseCertifications(jp.certifications).map((cert, i) => ({
      id: -(index * 100 + i),
      name: cert,
    })),
    categories: [{
      id: -(index + 1),
      name: catLabel,
    }],
    attributes: [],
    short_description: jp.star_features || "",
    description: jp.description || "",
    permalink: "",
    // Enriched fields
    _enriched: {
      volume: jp.volume,
      certifications: parseCertifications(jp.certifications),
      ingredients_fr: parseIngredients(jp.ingredients_fr),
      star_features: parseStarFeatures(jp.star_features),
      description_full: jp.description,
      inci: jp.inci,
      arome: jp.arôme,
      slug: jp.slug,
      categorie_json: jp.categorie,
    } as EnrichedFields,
  };
}
