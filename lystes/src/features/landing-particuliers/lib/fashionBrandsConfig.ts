// Registry of fashion partner brands for the try-on flow.
// Each brand has a local product catalog (images live in src/assets/tryon-carousel).
// Used by /:brandSlug → BrandTryOnPage with an LLM search hero.

import p1 from "@lystes/assets/tryon-carousel/p1.webp";
import p2 from "@lystes/assets/tryon-carousel/p2.webp";
import p3 from "@lystes/assets/tryon-carousel/p3.webp";
import p4 from "@lystes/assets/tryon-carousel/p4.webp";
import p5 from "@lystes/assets/tryon-carousel/p5.webp";
import p6 from "@lystes/assets/tryon-carousel/p6.webp";
import p7 from "@lystes/assets/tryon-carousel/p7.webp";
import p8 from "@lystes/assets/tryon-carousel/p8.webp";
import p9 from "@lystes/assets/tryon-carousel/p9.webp";

export type FashionBrandProduct = {
  id: string;
  slug: string;
  name: string;
  category: string; // pants | hoodies | shorts | bags | sunglasses | shoes
  tags: string[];
  image: string;
  price?: number;
};

export type FashionBrand = {
  slug: string;
  name: string;
  tagline?: string;
  greetingAgent?: string;
  products: FashionBrandProduct[];
};

export const FASHION_BRANDS: FashionBrand[] = [
  {
    slug: "lolo-paris",
    name: "Lolo Paris",
    tagline: "Pièces signature mode — essaie avant d'acheter.",
    greetingAgent: "Iris",
    products: [
      { id: "lp-1", slug: "jogging-vert-coton", name: "Pantalon jogging vert motif coton", category: "pants", tags: ["pantalon", "jogging", "streetwear", "vert"], image: p1, price: 120 },
      { id: "lp-2", slug: "hoodie-vert-oversize", name: "Hoodie vert oversize", category: "hoodies", tags: ["hoodie", "sweat", "oversize", "vert", "streetwear"], image: p2, price: 140 },
      { id: "lp-3", slug: "short-mesh-ethnique", name: "Short mesh imprimé ethnique", category: "shorts", tags: ["short", "mesh", "sport", "imprimé", "ethnique"], image: p3, price: 95 },
      { id: "lp-4", slug: "sac-cuir-camel", name: "Sac à main cuir camel", category: "bags", tags: ["sac", "cuir", "camel", "luxe", "chic"], image: p4, price: 450 },
      { id: "lp-5", slug: "pantalon-jaune-dept", name: "Pantalon jaune logo Dépt", category: "pants", tags: ["pantalon", "jaune", "technique", "streetwear"], image: p5, price: 180 },
      { id: "lp-6", slug: "short-mesh-eclair-bleu", name: "Short mesh éclair bleu", category: "shorts", tags: ["short", "mesh", "sport", "bleu"], image: p6, price: 95 },
      { id: "lp-7", slug: "lunettes-verres-roses", name: "Lunettes de soleil verres roses", category: "sunglasses", tags: ["lunettes", "soleil", "rose", "accessoires"], image: p7, price: 220 },
      { id: "lp-8", slug: "escarpins-slingback-noirs", name: "Escarpins slingback noirs", category: "shoes", tags: ["escarpins", "slingback", "noir", "chic", "chaussures"], image: p8, price: 380 },
      { id: "lp-9", slug: "sac-miu-miu-matelasse", name: "Sac Miu Miu cuir matelassé", category: "bags", tags: ["sac", "cuir", "matelassé", "luxe", "miu miu"], image: p9, price: 1850 },
    ],
  },
];

export const getFashionBrand = (slug: string): FashionBrand | undefined =>
  FASHION_BRANDS.find((b) => b.slug === slug);

export const FASHION_BRAND_SLUGS = FASHION_BRANDS.map((b) => b.slug);
