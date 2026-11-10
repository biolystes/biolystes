/* Copies « (K-Beauty Inspiration) » des soins du rituel (JP, 10/11/2026) : les
   produits sont doublés, pas rangés dans deux catégories. Les originaux restent
   inchangés dans products.ts (copie synchronisée, jamais retouchée). */
import { PRODUCTS, type Product } from "@/data/catalogue-pro/products";
import { ID_K_BEAUTY, RITUEL_K_BEAUTY } from "@/data/k-beauty";

export const SUFFIXE_NOM_K_BEAUTY = " (K-Beauty Inspiration)";
export const SUFFIXE_SLUG_K_BEAUTY = "-k-beauty-inspiration";

export type CopieKBeauty = Product & { slug_origine: string };

export const COPIES_K_BEAUTY: CopieKBeauty[] = RITUEL_K_BEAUTY.flatMap(({ code }) => {
  const p = PRODUCTS.find((x) => x.code === code);
  if (!p) return [];
  return [{ ...p, nom: p.nom + SUFFIXE_NOM_K_BEAUTY, slug: p.slug + SUFFIXE_SLUG_K_BEAUTY, categorie: ID_K_BEAUTY, slug_origine: p.slug } as CopieKBeauty];
});

/** Slug de l'original pour une copie (photos, etc.), sinon le slug lui-même. */
export const slugOrigine = (p: Pick<Product, "slug">) => (p as Partial<CopieKBeauty>).slug_origine ?? p.slug;
