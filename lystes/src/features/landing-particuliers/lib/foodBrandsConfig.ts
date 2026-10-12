// Registry of food / catering partner brands for the AI quote flow.
// Each brand has a remote product catalog scraped from the brand website.
// Used by /:brandSlug → BrandTryOnPage (mode="food") and /:brandSlug/devis.

export type FoodBrandProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tags: string[];
  image: string;
  price?: number;
  description?: string;
};

export type FoodBrand = {
  slug: string;
  name: string;
  tagline?: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  products: FoodBrandProduct[];
};

export const FOOD_BRANDS: FoodBrand[] = [
  {
    slug: "delicesducongo",
    name: "Délices du Congo",
    tagline: "Traiteur africain haut de gamme — Arpajon (91), Île-de-France.",
    city: "Arpajon, Île-de-France",
    phone: "07 53 23 99 16",
    email: "contact@delicesducongo.com",
    website: "https://delicesducongo.com",
    products: [
      { id: "ddc-1", slug: "plateau-grillades", name: "Plateau grillades", category: "À la carte", tags: ["grillades", "viande", "partage"], image: "https://delicesducongo.com/wp-content/uploads/2023/01/Plateau-grillade-1024x1024.png", price: 25 },
      { id: "ddc-2", slug: "ntaba", name: "Ntaba", category: "À la carte", tags: ["chèvre", "spécialité", "congo"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/NTABA-scaled.jpg", price: 10 },
      { id: "ddc-3", slug: "morue", name: "Morue", category: "À la carte", tags: ["poisson", "spécialité"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/MORUE.png", price: 10 },
      { id: "ddc-4", slug: "pondu", name: "Pondu", category: "À la carte", tags: ["manioc", "feuilles", "végétal", "congo"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/PONDU.jpg", price: 10 },
      { id: "ddc-5", slug: "5-brochettes-de-boeuf", name: "5 brochettes de bœuf", category: "À la carte", tags: ["bœuf", "brochettes", "viande"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/Brochettes-de-boeuf-1024x1024.png", price: 10 },
      { id: "ddc-6", slug: "5-ailes-de-poulet", name: "5 ailes de poulet", category: "À la carte", tags: ["poulet", "volaille"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/Ailes-de-poulet-scaled-1.jpeg", price: 8 },
      { id: "ddc-7", slug: "box-110-beignets", name: "Box 110 beignets", category: "À la carte", tags: ["beignets", "mikate", "sucré"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/Beignets-nature-montagne.png", price: 30 },
      { id: "ddc-8", slug: "box-55-beignets", name: "Box 55 beignets", category: "À la carte", tags: ["beignets", "mikate", "sucré"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/Beignets-nature-montagne.png", price: 17 },
      { id: "ddc-9", slug: "box-ddc", name: "Box DDC", category: "Menus", tags: ["box", "découverte", "partage"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/WhatsApp-Image-2023-02-01-at-00.42.18.jpeg", price: 30, description: "3 brochettes, Ntaba (200g), bâton de manioc, 2 ailes de poulet, 20 beignets, banane plantain" },
      { id: "ddc-10", slug: "menu-duo", name: "Menu DUO", category: "Menus", tags: ["menu", "duo", "couple"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/Menu-duo-scaled-1.jpeg", price: 40, description: "4 brochettes ou ailes, Ntaba, riz, 30 beignets, 2 bâtons de manioc, 2 boissons" },
      { id: "ddc-11", slug: "menu-delice", name: "Menu DÉLICE", category: "Menus", tags: ["menu", "famille", "partage"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/MENU-DELICE-scaled.jpg", price: 60, description: "2 barquettes de Ntaba, 3 bâtons manioc, 5 brochettes ou ailes, 60 beignets, riz, 3 boissons" },
      { id: "ddc-12", slug: "riz-rouge", name: "Riz rouge", category: "Garniture", tags: ["riz", "accompagnement"], image: "https://delicesducongo.com/wp-content/uploads/2023/01/Riz-rouge-1024x819.png", price: 3 },
      { id: "ddc-13", slug: "sauce-tomate-oignon", name: "Sauce tomate oignon", category: "Garniture", tags: ["sauce", "tomate"], image: "https://delicesducongo.com/wp-content/uploads/2023/01/SAUCE-TOMATE-OIGNON-1024x1024.png", price: 4 },
      { id: "ddc-14", slug: "cacahouete", name: "Cacahuète", category: "Garniture", tags: ["cacahuète", "snack"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/fotolia_51988975_subscription_xxl-copy.jpeg", price: 0.5 },
      { id: "ddc-15", slug: "jus-de-gingembre-550ml", name: "Jus de gingembre (550ml)", category: "Boissons", tags: ["jus", "gingembre", "boisson"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/JUS-DE-GINGEMBRE-1-scaled.jpg", price: 5 },
      { id: "ddc-16", slug: "coca-cola-33cl", name: "Coca Cola (33cl)", category: "Boissons", tags: ["soda", "boisson"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/canette-coca-cola-33cl.jpg", price: 1.5 },
      { id: "ddc-17", slug: "fanta-33cl", name: "Fanta (33cl)", category: "Boissons", tags: ["soda", "boisson"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/5a50772c82179a9c2ef811e4ac892b8f34696df5.webp", price: 1.5 },
      { id: "ddc-18", slug: "eau-50cl", name: "Eau (50cl)", category: "Boissons", tags: ["eau", "boisson"], image: "https://delicesducongo.com/wp-content/uploads/2022/08/Bouteille-cristaline-50-CL.webp", price: 1.5 },
    ],
  },
];

export const getFoodBrand = (slug: string): FoodBrand | undefined =>
  FOOD_BRANDS.find((b) => b.slug === slug);

export const FOOD_BRAND_SLUGS = FOOD_BRANDS.map((b) => b.slug);
