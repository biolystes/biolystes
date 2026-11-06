/* Goodies personnalisés : catalogue complet repris des objets publicitaires du fournisseur (06/11/2026),
   noms, descriptions, caractéristiques et photos par coloris dans goodies-catalogue.json.
   Aucun prix ici : les prix ne s'affichent que sur /tarifs. */
import catalogue from "./goodies-catalogue.json";

export type CategorieGoodie =
  | "vetements" | "sacs" | "boissons" | "bureau" | "maison" | "voyage"
  | "high-tech" | "alimentaire" | "evenementiel" | "emballage";

export const CATEGORIES_GOODIES: { id: CategorieGoodie; nom: string }[] = [
  { id: "vetements", nom: "Vêtements" },
  { id: "sacs", nom: "Sacs" },
  { id: "boissons", nom: "Gourdes, mugs & tumblers" },
  { id: "bureau", nom: "Papeterie & stylos" },
  { id: "maison", nom: "Bougies & maison" },
  { id: "voyage", nom: "Voyage" },
  { id: "high-tech", nom: "High-tech" },
  { id: "alimentaire", nom: "Lunch box" },
  { id: "evenementiel", nom: "Événementiel" },
  { id: "emballage", nom: "Emballage & cartes" },
];

export interface ProduitGoodie {
  slug: string;
  nom: string;
  categorie: CategorieGoodie;
  accroche: string;
  description: string;
  caracteristiques: Record<string, string>;
  dimensions: string[];
  galerie: string[];
  variantes: { coloris: string | null; image: string }[];
}

export const PRODUITS_GOODIES = catalogue as ProduitGoodie[];

/* Une carte par variante (produit × coloris), chacune avec sa propre photo de rendu. */
export interface Goodie { slug: string; nom: string; coloris: string | null; categorie: CategorieGoodie; image: string }

export const GOODIES: Goodie[] = PRODUITS_GOODIES.flatMap((p) =>
  p.variantes.map((v) => ({ slug: p.slug, nom: p.nom, coloris: v.coloris, categorie: p.categorie, image: v.image })),
);
