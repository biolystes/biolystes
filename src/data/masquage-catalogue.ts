/* Catégories masquées du catalogue (JP, 27/10/2026).

   « Compléments alimentaires » : plusieurs images gardent des traces (texte
   allemand, tableaux nutritionnels, codes-barres, fruits, éclaboussures, fond
   pas blanc). Tant qu'elles ne sont pas retravaillées, la catégorie disparaît
   de /catalogue, /nos-soins et /nouveautes : du filtre Catégorie, des listes,
   du tri « Bientôt », des compteurs et de la recherche.

   Réglage simple et réversible, aucune donnée supprimée :
   - CATEGORIES_MASQUEES : les catégories cachées. Vider la liste réaffiche tout ;
   - PRODUITS_PROPRES : les produits d'une catégorie masquée dont l'image a été
     regardée un par un (packaging vierge, aucun texte, aucun fruit, fond blanc
     pur) : ils restent affichés. Un produit s'ajoute ici seulement après contrôle ;
   - CATEGORIES_EN_BAS : les catégories rangées après toutes les autres dans
     chaque tri (les compléments passent après les soins et le maquillage).

   La copie synchronisée src/data/catalogue-pro/products.ts n'est jamais retouchée :
   tout passe par ce fichier, donc une resynchronisation ne peut pas les remontrer. */
import { CATEGORIES, PRODUCTS, type Product } from "@/data/catalogue-pro/products";

export const CATEGORIES_MASQUEES: readonly string[] = ["supplements"];

/** Audit du 27/10/2026 (complements-images-2710/audit.md) : images propres, vues une à une. */
export const PRODUITS_PROPRES: readonly string[] = [
  "ashwagandha-vitamin-b6-gummies-60-pcs",
  "coenzyme-q10-200mg-60-softgels",
  "green-tea-extract-40-polyphenols-60-capsules",
  "turmeric-piperine-60-capsules",
  "vitamin-d3-3-000-i-u-60-vegan-softgels",
  "magnesium-4-fold-complex-60-vegan-tablets",
  "electrolyte-powder-tropical-mango-300g",
  "creatine-monohydrate-raspberry-500g",
  "egyptian-black-cumin-oil-black-seed-oil-240-vegan-softgels",
  "glucosamine-500mg-90-capsules",
  "chondroitin-500-mg-90-capsules",
  "shilajit-powder-5-fulvic-acid-250g",
  "spirulina-1-000-tablets",
  "creatine-monohydrate-1000g-doypack",
  "chondroitin-powder-100g",
];

export const CATEGORIES_EN_BAS: readonly string[] = ["supplements"];

type Cat = Pick<Product, "categorie">;

export const estMasque = (p: Pick<Product, "slug" | "categorie">): boolean =>
  CATEGORIES_MASQUEES.includes(p.categorie) && !PRODUITS_PROPRES.includes(p.slug);

export const estEnBas = (p: Cat): boolean => CATEGORIES_EN_BAS.includes(p.categorie);

/** Les produits que le public peut voir. */
export const PRODUITS_VISIBLES: Product[] = PRODUCTS.filter((p) => !estMasque(p));

/** Les catégories qui ont au moins un produit visible (« Tous les produits » toujours). */
export const CATEGORIES_VISIBLES = CATEGORIES.filter(
  (c) => c.id === "all" || PRODUITS_VISIBLES.some((p) => p.categorie === c.id),
);

/** Range les catégories « en bas » après toutes les autres, sans toucher à l'ordre relatif. */
export function categoriesEnBas<T extends Cat>(liste: readonly T[]): T[] {
  return liste.map((p, i) => ({ p, i })).sort((a, b) => Number(estEnBas(a.p)) - Number(estEnBas(b.p)) || a.i - b.i).map((x) => x.p);
}
