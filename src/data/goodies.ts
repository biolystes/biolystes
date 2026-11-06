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

/* Lunettes de soleil retirées à la demande (06/11/2026). */
export const PRODUITS_GOODIES = (catalogue as ProduitGoodie[]).filter((p) => !p.slug.startsWith("lunettes"));

/* Une carte par variante (produit × coloris), chacune avec sa propre photo de rendu. */
export interface Goodie { slug: string; nom: string; coloris: string | null; categorie: CategorieGoodie; image: string; choix?: { coloris: string | null; image: string }[] }

/* Produits dont les photos de chaque coloris montrent l'emplacement « LOGO » (vérifié à l'œil sur la 2e photo) :
   une carte par coloris. Tous les autres produits : une seule carte avec un choix de coloris. */
export const DETAIL_PAR_COLORIS = new Set([
  "bouteille-double-paroi-en-acier-inoxydable-recycle-500-ml-personnalisee",
  "bouteille-simple-paroi-en-acier-inoxydable-500-ml-personnalisee",
  "bouteille-simple-paroi-en-acier-inoxydable-recycle-750-ml-personnalisee",
  "gilet-homme-personnalise",
  "sweats-sans-capuche-zippe-unisexe-en-coton-biologique-personnalise",
  "t-shirt-femme-coton-biologique-poids-moyen-personnalise",
  "t-shirt-unisexe-coton-biologique-poids-moyen-personnalise",
]);

export const GOODIES: Goodie[] = PRODUITS_GOODIES.flatMap((p) =>
  DETAIL_PAR_COLORIS.has(p.slug) || p.variantes.length < 2
    ? p.variantes.map((v) => ({ slug: p.slug, nom: p.nom, coloris: v.coloris, categorie: p.categorie, image: v.image }))
    : [{ slug: p.slug, nom: p.nom, coloris: p.variantes[0].coloris, categorie: p.categorie, image: p.variantes[0].image, choix: p.variantes }],
);
