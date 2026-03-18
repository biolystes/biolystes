import { getProductImagesSync } from "./productImageMap";

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

// ─── Canonical slug mapping (synonyms → single slug) ──────
const CANONICAL_SLUGS: Record<string, string> = {
  "soins-du-cheveu": "soins-capillaires",
  "coffrets-cadeaux": "coffrets",
  "soins-pour-bebes": "soins-du-corps", // bébés grouped under corps
};

export function getCanonicalSlug(slug: string): string {
  return CANONICAL_SLUGS[slug] || slug;
}

// ─── Category label mapping ───────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  "soins-du-corps": "Soins du corps",
  "soins-du-visage": "Soins du visage",
  "soins-capillaires": "Soins capillaires",
  "soins-du-cheveu": "Soins capillaires",
  "soins-pour-hommes": "Soins pour hommes",
  "coffrets-cadeaux": "Coffrets cadeaux",
  "coffrets": "Coffrets",
  "kits-echantillons": "Kits d'échantillons",
  "aromatherapie": "Aromathérapie",
  "soins-solaires": "Soins solaires",
  "hygiene-bucco-dentaire": "Hygiène bucco-dentaire",
  "maquillage": "Maquillage",
  "soins-pour-animaux": "Soins pour animaux",
  "soins-pour-bebes": "Soins pour bébés",
};

export function getCategoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Generate stable category ID from canonical slug ──────
export function getCategoryId(slug: string): number {
  const canonical = getCanonicalSlug(slug);
  return -(canonical.length * 1000 + canonical.charCodeAt(0));
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

// ─── Image URL helpers ───────────────────────────────────
function toAbsoluteSelfnamedUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalized = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `https://static.selfnamed.com${normalized}`;
}

function decodeSelfnamedProxyPath(url: string): string {
  const match = url.match(/\/r\/([^?#&]+)/i);
  if (!match?.[1]) return "";

  try {
    const base64 = match[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return atob(padded).toLowerCase();
  } catch {
    return "";
  }
}

function isCatalogImage(url: string): boolean {
  const lower = url.toLowerCase();

  if (lower.includes("/certifications/")) return false;
  if (lower.includes("gallery-photos") || lower.includes("galleryphotos")) return true;

  const decoded = decodeSelfnamedProxyPath(url);
  if (!decoded) return false;
  if (decoded.includes("certifications")) return false;
  return decoded.includes("gallery-photos") || decoded.includes("galleryphotos");
}

// ─── Convert JSON product to WCProduct-compatible format ──
export function jsonToWCProduct(jp: JSONProduct, index: number): any {
  const price = parseJsonPrice(jp.prix);
  const catLabel = getCategoryLabel(jp.categorie);

  // Priority: use high-quality CSV images first (1024px, sharp)
  let imageUrls = getProductImagesSync(normalize(jp.nom));

  // Fallback: parse from JSON only if CSV has no match
  if (imageUrls.length === 0 && jp.images) {
    imageUrls = jp.images
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(toAbsoluteSelfnamedUrl)
      .filter(isCatalogImage);
  }

  return {
    id: -(index + 1),
    name: jp.nom,
    price: price ? price.toString() : "",
    images: imageUrls.length > 0 ? imageUrls.map(src => ({ src })) : [],
    tags: parseCertifications(jp.certifications).map((cert, i) => ({
      id: -(index * 100 + i),
      name: cert,
    })),
    categories: [{
      id: getCategoryId(jp.categorie),
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
