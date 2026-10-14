export interface PrixConseilles { milieu: number; bio: number; luxe: number; }
export interface Product {
  slug: string; nom: string; categorie: string; volume: string;
  prix_ht: number | null; prix_conseilles: PrixConseilles | null;
  certifications: string[]; star_features: string[];
  description: string; ingredients: string; arome: string; inci: string;
  image: string; url: string;
  /** retired : retiré chez le fournisseur, gardé pour l'historique, non commandable. */
  status?: 'available' | 'coming_soon' | 'retired';
  /** Pas encore de photo nettoyée (étiquette blanche) : la fiche s'affiche avec « Image à venir ». */
  image_a_venir?: boolean;
  /**
   * Photo générée refusée au contrôle visuel (flacon déformé, texte resté…) : la fiche
   * garde « Image à venir » même si la base contient une image approuvée pour ce slug.
   */
  image_a_refaire?: boolean;
  /** Code de la fiche chez le fournisseur : clé du rapprochement avec la moisson, jamais affiché. */
  code?: string;
  /** Arrivée au catalogue (AAAA-MM-JJ) : le produit porte le badge « Nouveau » pendant JOURS_NOUVEAUTE jours. */
  date_arrivee?: string;
}

/** prix_ht est un prix hors taxes : prix catalogue TTC du fournisseur ÷ 1,2, au centime (mise à jour du 14/10/2026). */
export const MENTION_RETIRE = "Retiré chez le fournisseur";
export const MENTION_IMAGE_A_VENIR = "Image à venir";
export const MENTION_NOUVEAU = "Nouveau";

/** Durée pendant laquelle un produit arrivé au catalogue porte le badge « Nouveau ». */
export const JOURS_NOUVEAUTE = 60;

/** Vrai si le produit est arrivé au catalogue depuis moins de JOURS_NOUVEAUTE jours. */
export function estNouveau(p: Pick<Product, "date_arrivee" | "status">, aujourdhui: Date = new Date()): boolean {
  if (!p.date_arrivee || p.status === "retired") return false;
  const arrivee = new Date(`${p.date_arrivee}T00:00:00`);
  if (Number.isNaN(arrivee.getTime())) return false;
  const jours = (aujourdhui.getTime() - arrivee.getTime()) / 86_400_000;
  return jours >= 0 && jours < JOURS_NOUVEAUTE;
}

/**
 * Ordre d'affichage par défaut : les nouveautés d'abord, de la plus récente à la plus
 * ancienne, puis le reste dans l'ordre du catalogue (tri stable).
 */
export function nouveautesDabord<T extends Pick<Product, "date_arrivee" | "status">>(liste: readonly T[], aujourdhui: Date = new Date()): T[] {
  return liste
    .map((p, i) => ({ p, i, n: estNouveau(p, aujourdhui) }))
    .sort((a, b) => {
      if (a.n !== b.n) return a.n ? -1 : 1;
      if (a.n && b.n && a.p.date_arrivee !== b.p.date_arrivee) return a.p.date_arrivee! < b.p.date_arrivee! ? 1 : -1;
      return a.i - b.i;
    })
    .map((x) => x.p);
}

/**
 * Marge de la cliente, en % de son prix de vente hors taxes : le prix de vente
 * conseillé est TTC (TVA 20 %), le prix d'achat est HT. Comparer les deux tels
 * quels gonflerait la marge de la TVA.
 */
export function margePourcent(prixAchatHT: number | null | undefined, prixVenteTTC: number | null | undefined): number | null {
  if (!prixAchatHT || !prixVenteTTC) return null;
  const venteHT = prixVenteTTC / 1.2;
  return Math.round(((venteHT - prixAchatHT) / venteHT) * 100);
}

/** Un produit qu'une cliente peut sélectionner ou commander. */
export function estCommandable(p: Pick<Product, "status" | "prix_ht">): boolean {
  return p.status !== "retired" && p.prix_ht != null;
}
export const CATEGORIES = [
  { id: "all", label: "Tous les produits" },
  { id: "soins-du-visage", label: "Soins Visage" },
  { id: "soins-du-corps", label: "Soins Corps" },
  { id: "soins-du-cheveu", label: "Soins Cheveux" },
  { id: "collection-box", label: "Collections" },
  { id: "maquillage", label: "Maquillage" },
  { id: "supplements", label: "Compléments alimentaires" },
] as const;
export const PRODUCTS: Product[] = [
  {
    "slug": "patchs-hydrogel-anti-age-pour-les-yeux-7-pieces",
    "code": "S0137-7",
    "nom": "Patchs anti-âge pour les yeux à base d'hydrogel",
    "categorie": "soins-du-visage",
    "volume": "7 g",
    "prix_ht": 13.63,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Les patchs hydrogel anti-âge pour les yeux sont des patchs haut de gamme destinés aux marques souhaitant proposer des soins pour le contour des yeux très tendance. Leur formule associe la niacinamide, l’acide hyaluronique et l’or dans un format hydrogel inspiré de la K-beauty.\n\nCes patchs hydrogel prennent soin de la zone délicate du contour des yeux en 15 minutes. La niacinamide aide à éclaircir et à unifier le teint tout en rendant le contour des yeux plus lisse. L’acide hyaluronique apporte une hydratation en profondeur, contribuant à repulper l’apparence des ridules causées par la sécheresse. La glycérine, le jus d’aloès et le panthénol offrent une hydratation à plusieurs niveaux pour une peau visuellement plus douce et plus confortable, tout en aidant à apaiser l’aspect fatigué du regard. Ces patchs sont testés sous contrôle dermatologique et sans parfum ; ils conviennent à tous les types de peau, y compris les peaux matures, sèches et sensibles. La boîte contient 7 paires de patchs.",
    "ingredients": "Niacinamide, Acide hyaluronique, Jus d'aloès, Panthénol",
    "arome": "Sans parfum",
    "inci": "INGRÉDIENTS / INCI : Aqua (Water), Glycerin, Carrageenan, Panthenol, Mica, Amorphophallus Konjac Root Extract, Sucrose, Hordeum Vulgare Stem Water, CI 77891 (Titanium Dioxide), Sodium Levulinate, Niacinamide, Phenoxyethanol, Sodium Anisate, Sodium Hyaluronate, CI 77491 (Iron Oxides), Benzoic Acid, Dehydroacetic Acid, Lactic Acid, Sorbic Acid, Aloe Barbadensis Leaf Juice Powder, Sodium Benzoate, Citric Acid, CI 77480 (Gold), Sodium Hydroxide. ➀ Issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/patchs-hydrogel-anti-age-pour-les-yeux-7-pieces.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "les-yeux-7-pieces-2AuDU",
    "code": "S0135-7",
    "nom": "Patchs hydrogel énergisants pour les yeux à la caféine et à la vitamine C",
    "categorie": "soins-du-visage",
    "volume": "7 g",
    "prix_ht": 13.63,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Les patchs hydrogel énergisants pour les yeux à la caféine et à la vitamine C constituent un produit hautement performant destiné aux entreprises qui souhaitent se positionner sur le marché en pleine expansion des soins pour les yeux, un secteur très tendance. Leur formule associe la caféine et la vitamine C dans un format hydrogel inspiré de la « K-beauty », spécialement conçu pour lutter contre les yeux gonflés et l'air fatigué.\n\nDes patchs hydrogel rafraîchissants et légers qui apaisent et revitalisent la zone délicate du contour des yeux. La caféine aide à décongestionner le regard fatigué, la vitamine C aide à éclaircir le teint, tandis que le panthénol et la glycérine maintiennent la peau hydratée et apaisée. Appliquez un patch sous chaque œil, laissez agir environ 15 minutes, puis massez délicatement pour faire pénétrer le sérum restant. Pas besoin de rincer. La boîte contient 7 paires de patchs.",
    "ingredients": "Caféine, Vitamine C, Panthénol, Glycérine",
    "arome": "Sans parfum",
    "inci": "INGRÉDIENTS / INCI : Aqua (Water), Glycerin, Chondrus Crispus, Panthenol, Glucomannan, Sucrose, Maltodextrin, Phenethyl Alcohol, Sodium Levulinate, p-Anisic Acid, Caffeine, Rosa Gallica Flower Extract, Sodium Hydroxide, Punica Granatum Flower Extract, Sodium Ascorbyl Phosphate, Citric Acid, Lactic Acid, Potassium Sorbate, Sodium Benzoate. ➀ Issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/les-yeux-7-pieces-2AuDU.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "Anti-les-yeux-7-pieces-2AuDU-BTCtq",
    "code": "S0136-7",
    "nom": "Patchs pour les yeux anti-fatigue à l'hydrogel",
    "categorie": "soins-du-visage",
    "volume": "7 g",
    "prix_ht": 13.63,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Les patchs pour les yeux anti-fatigue à base d'hydrogel constituent une entrée en matière accessible dans le secteur en pleine expansion des soins pour les yeux, s'inscrivant dans le cadre d'un rituel de soins à domicile. Les antioxydants et les ingrédients hydratants sont intégrés dans une formule à base d'hydrogel inspirée de la « K-beauty », qui rafraîchit les yeux fatigués.\n\nDes patchs rafraîchissants à base d'hydrogel conçus pour revitaliser la zone délicate du contour des yeux. Grâce à leurs antioxydants et à leurs actifs hydratants, ils procurent une sensation de confort à la peau et lui donnent un aspect reposé. Appliquez un patch sous chaque œil, laissez agir environ 15 minutes, puis massez délicatement pour faire pénétrer le sérum restant. Aucun rinçage nécessaire. La boîte contient 7 paires de patchs.",
    "ingredients": "Antioxydants, Panthénol, Glycérine",
    "arome": "Un parfum floral frais et léger aux subtiles notes végétales",
    "inci": "INGRÉDIENTS / INCI : Aqua (Water), Glycerin, Annona Cherimola Fruit Extract, Carrageenan, Panthenol, Amorphophallus Konjac Root Extract, Aspalathus Linearis Leaf, Sucrose, Phenethyl Alcohol, Sodium Levulinate, Sodium Anisate, Sodium Hyaluronate, Sodium Citrate, Citric Acid, Phenylpropanol, Sodium Dehydroacetate, Geraniol, Linalool. ➀ Issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/Anti-les-yeux-7-pieces-2AuDU-BTCtq.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "coffret-decouverte-de-3-bombes-de-bain-senteurs-chaudes-et-boisees",
    "code": "S0178",
    "nom": "Coffret découverte de 3 bombes de bain, senteurs chaudes et boisées",
    "categorie": "soins-du-corps",
    "volume": "375 g",
    "prix_ht": 10.08,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Coffret cadeau",
      "rituel de bien-être"
    ],
    "description": "Les coffrets cadeaux sont parmi les produits les plus faciles à vendre, et leur succès repose sur la variété. Ce trio de bombes de bain effervescentes offre à votre marque un cadeau prêt à offrir, idéal pour les gammes bien-être, soins personnels et saisonnières. Vos clients profitent de trois bains différents dans un seul coffret et auront envie d'en racheter.\n\nUn coffret de trois bombes de bain, chacune avec son propre parfum et son ambiance, présentées ensemble dans un élégant coffret cadeau. Plongez-en une sous l'eau du robinet et laissez-la pétiller : elle embaumera votre salle de bain et transformera un bain ordinaire en un petit rituel. Avec une bombe différente pour chaque bain, ce coffret est parfait pour les douces soirées du dimanche, la récupération après le sport et les soirées cocooning. C'est aussi un cadeau attentionné qui ne demande aucun effort.",
    "ingredients": "Huile de bois de cèdre, Huile d'écorce d'orange amère, Sel marin",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/coffret-decouverte-de-3-bombes-de-bain-senteurs-chaudes-et-boisees.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "coffret-decouverte-de-3-bombes-de-bain-cozy-fresh",
    "code": "S0177",
    "nom": "Coffret découverte de 3 bombes de bain, Cozy & Fresh",
    "categorie": "soins-du-corps",
    "volume": "125 g",
    "prix_ht": 10.08,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Coffret cadeau",
      "rituel de bien-être"
    ],
    "description": "Les coffrets cadeaux sont parmi les produits les plus faciles à vendre, et leur succès repose sur la variété. Ce trio de bombes de bain effervescentes offre à votre marque un cadeau prêt à offrir, idéal pour les gammes bien-être, soins personnels et saisonnières. Vos clients profitent de trois bains différents dans un seul coffret et auront envie d'en racheter.\n\nUn coffret de trois bombes de bain, chacune avec son propre parfum et son ambiance, présentées ensemble dans un élégant coffret cadeau. Plongez-en une sous l'eau du robinet et laissez-la pétiller : elle embaumera votre salle de bain et transformera un bain ordinaire en un petit rituel. Avec une bombe différente pour chaque bain, ce coffret est parfait pour les douces soirées du dimanche, la récupération après le sport et les soirées cocooning. C'est aussi un cadeau attentionné qui ne demande aucun effort.",
    "ingredients": "Huile de bois de cèdre, Huile d'écorce d'orange amère, Huile d'eucalyptus",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/coffret-decouverte-de-3-bombes-de-bain-cozy-fresh.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "bombe-de-bain-neroli-et-orange",
    "code": "S0157",
    "nom": "Bombe de bain, néroli et orange",
    "categorie": "soins-du-corps",
    "volume": "125 g",
    "prix_ht": 3.5,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Rituel de bien-être inspiré du spa"
    ],
    "description": "Des senteurs florales et hespéridées éclatantes procurent une sensation de fraîcheur et de luxe, et sont parfaites pour les photos sur les réseaux sociaux. Cette bombe de bain effervescente offre à votre marque un bain joyeux et vivifiant, idéal pour un moment de détente au quotidien et pour les campagnes marketing printanières ou estivales.\n\nUne bombe de bain effervescente aux délicates notes de néroli et d’orange vive. Plongez-la sous l’eau du robinet et laissez-la se transformer en mousse, libérant un arôme frais, floral et hespéridé qui embaumera toute la pièce. Transformez votre bain en un rituel sensoriel de relaxation, parfait pour les matins paisibles, pour se ressourcer et pour tous ceux qui souhaitent un bain synonyme de légèreté et de bien-être.",
    "ingredients": "Huile d'écorce d'orange amère, Vanilline",
    "arome": "Orange juteuse, sucre - notes de tête, néroli, vanille - notes de cœur, fleurs jaunes, sel marin - notes de fond.",
    "inci": "INGRÉDIENTS / INCI : Sodium Bicarbonate, Citric Acid, Sodium Chloride, Prunus Amygdalus Dulcis Oil, Eucalyptus Globulus Oil, Mentha Piperita Leaf, Mentha Arvensis Leaf Oil, Polysorbate 80, Aqua/Water, Menthol, Limonene, Pinene",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/bombe-de-bain-neroli-et-orange.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "bombe-de-bain-bergamote-et-pin",
    "code": "S0155",
    "nom": "Bombe de bain, bergamote et pin",
    "categorie": "soins-du-corps",
    "volume": "125 g",
    "prix_ht": 3.5,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Rituel de bien-être inspiré du spa"
    ],
    "description": "Les senteurs vertes et forestières sont perçues comme haut de gamme et unisexes, et complètent à merveille toute gamme de produits pour le bain. Cette bombe de bain effervescente apporte à votre marque une touche de fraîcheur et d'ancrage, idéale pour les coffrets cadeaux et les lignes masculines, avec une histoire olfactive mémorable.\n\nUne bombe de bain effervescente aux notes de bergamote éclatante et de pin frais. Plongez-la sous l'eau du robinet et laissez-la se transformer en mousse, libérant un arôme vert et vivifiant évoquant une promenade en forêt après la pluie. Transformez un bain ordinaire en un rituel sensoriel de détente, conçu pour tous ceux qui recherchent une sensation de fraîcheur, d'ancrage et une pointe de nature dans leur bain.",
    "ingredients": "Sel marin",
    "arome": "Bergamote, zeste d'agrumes - notes de tête, citronnelle, herbe et feuilles vertes - notes de cœur, fleurs douces, pin - notes de fond.",
    "inci": "INGRÉDIENTS / INCI : Sodium Bicarbonate, Citric Acid, Sodium Chloride, Prunus Amygdalus Dulcis Oil, Maris Sal, Parfum/Fragrance, Aqua/Water, Limonene, Linalool, Linalyl Acetate, Pinene, CI 19140, CI 42090",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/bombe-de-bain-bergamote-et-pin.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "bombe-de-bain-vanille-et-cannelle",
    "code": "S0156",
    "nom": "Bombe de bain, vanille et cannelle",
    "categorie": "soins-du-corps",
    "volume": "125 g",
    "prix_ht": 3.5,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Rituel de bien-être inspiré du spa"
    ],
    "description": "Les senteurs chaudes et épicées sont incontournables pendant les fêtes et fidélisent la clientèle tout au long de l'hiver. Cette bombe de bain effervescente apporte à votre marque une touche réconfortante et épicée, idéale pour les fêtes et parfaite pour les coffrets cadeaux.\n\nUne bombe de bain effervescente parfumée à la vanille douce et à la cannelle chaude. Plongez-la sous l'eau du robinet et laissez-la se transformer en mousse, libérant un arôme chaleureux et gourmand qui transforme le bain en un véritable moment de détente. Transformez un bain ordinaire en un rituel sensoriel de relaxation, idéal pour les soirées fraîches, les moments de détente après les fêtes et pour tous ceux qui souhaitent un bain réconfortant.",
    "ingredients": "Graines de pavot, Huile de bois de cèdre",
    "arome": "Vanille, cannelle - notes de tête, coriandre, raisin - notes de cœur, yaourt, ambre - notes de fond.",
    "inci": "INGRÉDIENTS / INCI : Sodium Bicarbonate, Citric Acid, Sodium Chloride, Prunus Amygdalus Dulcis Oil, Eucalyptus Globulus Oil, Mentha Piperita Leaf, Mentha Arvensis Leaf Oil, Polysorbate 80, Aqua/Water, Menthol, Limonene, Pinene",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/bombe-de-bain-vanille-et-cannelle.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "bombe-de-bain-eucalyptus-et-menthe-sauvage",
    "code": "S0154",
    "nom": "Bombe de bain, eucalyptus et menthe sauvage",
    "categorie": "soins-du-corps",
    "volume": "125 g",
    "prix_ht": 3.5,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Rituel de bien-être inspiré du spa"
    ],
    "description": "Les senteurs rafraîchissantes et relaxantes, dignes d'un spa, séduisent les clients qui souhaitent transformer leur bain en un véritable soin. Cette bombe de bain effervescente apporte à votre marque une touche de fraîcheur et de bien-être, idéale pour les gammes dédiées aux soins personnels, avec un parfum irrésistible.\n\nUne bombe de bain effervescente aux notes fraîches d'eucalyptus et de menthe sauvage. Plongez-la sous l'eau du robinet et laissez-la se transformer en mousse. Elle libérera un parfum frais et vivifiant qui métamorphosera votre salle de bain en un havre de détente. Transformez votre bain en un rituel sensoriel de relaxation, parfait pour les matins brumeux, après une séance de sport ou lors des journées étouffantes où l'on aspire à un moment de pur plaisir.",
    "ingredients": "Huile d'eucalyptus, Huile de menthe sauvage, Feuille de menthe poivrée",
    "arome": "Eucalyptus, menthe sauvage, menthe poivrée.",
    "inci": "INGRÉDIENTS / INCI : Sodium Bicarbonate, Citric Acid, Sodium Chloride, Prunus Amygdalus Dulcis Oil, Eucalyptus Globulus Oil, Mentha Piperita Leaf, Mentha Arvensis Leaf Oil, Polysorbate 80, Aqua/Water, Menthol, Limonene, Pinene",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/bombe-de-bain-eucalyptus-et-menthe-sauvage.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "sel-de-bain-mineral-a-l-ecorce-d-orange-et-a-la-vanille-douce",
    "code": "S0151",
    "nom": "Sel de bain minéral à l'écorce d'orange et à la vanille douce",
    "categorie": "soins-du-corps",
    "volume": "500 g",
    "prix_ht": 7.58,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Riche en minéraux Inspiré des spas"
    ],
    "description": "Des notes d'agrumes éclatantes sur un fond doux et sucré séduiront à coup sûr les clients en quête d'un bain revigorant. Ce sel de bain minéral apporte à votre marque une image fraîche et joyeuse grâce à sa couleur orange intense, qui attire l'œil en rayon et en photo.\n\nUn sel de bain riche en minéraux, aux notes d'orange zestée qui évoluent vers une douce vanille, le tout sublimé par un mélange d'huiles essentielles aux multiples nuances. Ce sel orange vif fond dans l'eau chaude pour un bain tonifiant et réconfortant jusqu'à la dernière minute. Un rituel apaisant pour se détendre, que ce soit le matin ou lors d'une journée de ressourcement.",
    "ingredients": "Riche en minéraux, Inspiré des spas",
    "arome": "Agrumes juteux, zestes, baies rouges - notes de tête, bonbons, fleurs jaunes - notes de cœur, ambre, boisé, vanille chaude - notes de fond.",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/sel-de-bain-mineral-a-l-ecorce-d-orange-et-a-la-vanille-douce.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "sels-de-bain-au-magnesium-et-a-la-lavande",
    "code": "S0153",
    "nom": "Sels de bain au magnésium et à la lavande",
    "categorie": "soins-du-corps",
    "volume": "500 g",
    "prix_ht": 9.08,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Au magnésium  Inspiré des spas"
    ],
    "description": "La lavande est le parfum phare du rayon bain et soins corporels, un rituel de détente que les clients rachètent régulièrement. Ce sel de bain minéral au magnésium offre à votre marque un bain classique et raffiné, idéal à offrir, avec une présence constante en rayon et une marge bénéficiaire intéressante.\n\nUn sel de bain riche en minéraux et en magnésium, parfumé au lavandin et à de délicates notes florales blanches, grâce à un mélange d’huiles essentielles aux multiples nuances. Versez une poignée de sel dans l’eau chaude et laissez-le se dissoudre pour un bain relaxant et apaisant. De véritables fleurs de lavande séchées se mêlent au sel blanc pour une ambiance spa directement dans la baignoire. Un rituel de bain relaxant pour décompresser après une longue journée.",
    "ingredients": "Magnésium, Sel marin, Sel d'Epsom, Huile d'eucalyptus",
    "arome": "Lavande fraîche aux notes florales, herbacées, d'agrumes et d'eucalyptus rafraîchissantes.",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/sels-de-bain-au-magnesium-et-a-la-lavande.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "sels-de-bain-mineraux-au-santal-et-au-patchouli",
    "code": "S0152",
    "nom": "Sels de bain minéraux au santal et au patchouli",
    "categorie": "soins-du-corps",
    "volume": "500 g",
    "prix_ht": 7.58,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Riche en minéraux Inspiré des spas"
    ],
    "description": "Les senteurs boisées et réconfortantes sont de plus en plus prisées dans le secteur du bain et du soin corporel, et leur confèrent une image haut de gamme. Ce sel de bain minéral de 500 g offre à votre marque une expérience de bain chaleureuse et unisexe, idéale pour les coffrets cadeaux et les gammes masculines, avec une marge confortable.\n\nUn sel de bain riche en minéraux, parfumé au santal chaud et au patchouli terreux, associé à une composition d'huiles essentielles aux multiples notes. De fines particules végétales brunes se mêlent au sel blanc, conférant au mélange une apparence aussi naturelle que son parfum. Versez quelques poignées de sel dans l'eau chaude pour un bain profond et apaisant. Un rituel de bain relaxant pour se détendre le corps et l'esprit lors des soirées tranquilles et des journées de ressourcement.",
    "ingredients": "Sel marin, Huile de patchouli, Sucre de fleur de coco",
    "arome": "Papyrus, ambre épicé, santal - tête, palmarosa, agrumes - cœur, patchouli, lavande, pin - fond",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/sels-de-bain-mineraux-au-santal-et-au-patchouli.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "sels-de-bain-mineraux-cremeux-a-la-noix-de-coco-et-a-l-ambre-chaud",
    "code": "S0150",
    "nom": "Sels de bain minéraux crémeux à la noix de coco et à l'ambre chaud",
    "categorie": "soins-du-corps",
    "volume": "500 g",
    "prix_ht": 7.58,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Riche en minéraux",
      "Inspiré des spas"
    ],
    "description": "Les parfums gourmands et chaleureux se vendent très bien en hiver et sont un incontournable des cadeaux. Ce sel de bain minéral apporte à votre marque une touche de douceur et de réconfort grâce à sa couleur jaune tendre qui attire l'attention en rayon et en photo.\n\nUn sel de bain riche en minéraux, parfumé à la noix de coco crémeuse et à l'ambre chaleureux, enrichi d'une composition d'huiles essentielles aux notes multiples et enveloppé d'un fini doux comme du cachemire. Sa douce teinte jaune fond dans l'eau chaude pour un bain réconfortant et enveloppant. Un rituel de bain apaisant pour se détendre lors des soirées fraîches et des week-ends de farniente.",
    "ingredients": "Riche en minéraux, Inspiré des spas",
    "arome": "Jus de noix de coco, yaourt à la vanille - notes de tête, fleurs blanches, agrumes - notes de cœur, cachemire, musc, ambre - notes de fond",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/sels-de-bain-mineraux-cremeux-a-la-noix-de-coco-et-a-l-ambre-chaud.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "brume-texturisante-anti-frisottis-pour-cheveux-boucles",
    "code": "S0142",
    "nom": "Brume texturisante anti-frisottis pour cheveux bouclés",
    "categorie": "soins-du-cheveu",
    "volume": "125 ml",
    "prix_ht": 7.33,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "La touche finale qui transforme une gamme de produits pour cheveux bouclés en une routine complète. Cette brume protéinée est la clé d’une définition et d’un rafraîchissement quotidiens ; c’est le produit que les clientes aux cheveux bouclés choisissent le plus souvent. Végétalienne, sans fruits à coque et suffisamment légère pour les boucles fines qui ont tendance à s'aplatir, elle est vendue en complément du shampoing pour cheveux bouclés et du soin 3-en-1, offrant ainsi à votre marque une gamme complète de soins pour les boucles, du lavage au coiffage.\n\nUne brume légère qui définit les boucles et dompte les frisottis sans effet cartonné. Les protéines de riz hydrolysées et l’extrait de graines de lin apportent tenue et souplesse, tandis que l’aloe vera et la glycérine préservent la douceur et l’hydratation des boucles. Utilisez-la sur cheveux humides pour fixer votre coiffure, ou sur cheveux secs pour redonner vie à vos boucles entre deux lavages. Agitez le flacon, vaporisez sur les longueurs et les pointes, puis malaxez les cheveux vers le haut pour redonner de la définition à vos boucles. Ce produit est vegan, sans noix et conçu pour rafraîchir vos cheveux le lendemain. Convient particulièrement aux cheveux de type 2 (ondulés) et de type 3 (bouclés).",
    "ingredients": "Glycérine, Jus d'aloès, Protéines de riz hydrolysées",
    "arome": "Un parfum floral léger et frais, aux subtiles notes de rose.",
    "inci": "INGRÉDIENTS / INCI : Water (Aqua, Eau), Glycerin, Aloe Barbadensis Leaf Juice, Hydrolyzed Rice Protein, Polysorbate 20, Fragrance (Parfum), Sodium Benzoate, Linum Usitatissimum (Linseed) Seed Extract, Potassium Sorbate, Citric Acid, Vitis Vinifera (Grape) Fruit Extract, Benzyl Alcohol, Citronellol, Alpha-Isomethyl Ionone, Geraniol, Linalool. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/brume-texturisante-anti-frisottis-pour-cheveux-boucles.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "serum-a-0-3-de-pdrn-issu-de-spicules-et-de-centella-asiatica",
    "code": "S0132",
    "nom": "Sérum à 0,3 % de PDRN issu de spicules et de centella asiatica",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 13.08,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Hydratation en plusieurs couches",
      "absorption rapide"
    ],
    "description": "Le sérum à 0,3 % de PDRN et de centella asiatica aux spicules est un booster hautement performant destiné aux marques qui souhaitent capitaliser simultanément sur deux des plus grandes tendances de la K-beauty. La sensation de picotement caractéristique offre aux clientes la preuve immédiate et tangible que le sérum agit, tandis que l’éclat visible dès la première utilisation incite à renouveler facilement l’achat.\nUn booster léger à utiliser en première étape. Les fines spicules procurent une sensation de picotement et de micro-exfoliation qui prépare la peau à absorber les principes actifs, tandis que le complexe PDRN, l’acide hyaluronique et la centella asiatica agissent pour une peau visiblement plus lisse, plus ferme et hydratée. La glycérine et la bétaïne apportent une hydratation profonde et multicouche, et la centella aide à apaiser et à calmer la peau. Vous remarquerez un éclat dès la première utilisation. Appliquez par tapotements sur une peau propre et sèche en première étape, le matin ou le soir. Une légère sensation de picotement est normale : ce sont les spicules qui agissent. Sans parfum et testé sous contrôle dermatologique.\nAVERTISSEMENT : À conserver à l'abri de la lumière directe du soleil.",
    "ingredients": "Éponge hydrolysée, PDRN végétalien, Acide hyaluronique, Centella asiatica",
    "arome": "Sans parfum",
    "inci": "INGRÉDIENTS / INCI : Water (Aqua), Glycerin, Betaine, Propanediol, Xanthan Gum, Caprylyl Glycol, Hydrolyzed Sponge, Phenylpropanol, Sodium Hyaluronate, Sodium DNA, Hydrogenated Lecithin, Asiaticoside, Madecassic Acid, Asiatic Acid, CI 17200. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-a-0-3-de-pdrn-issu-de-spicules-et-de-centella-asiatica.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "soin-3-en-1-pour-cheveux-boucles",
    "code": "S0141",
    "nom": "Soin 3 en 1 pour cheveux bouclés",
    "categorie": "soins-du-cheveu",
    "volume": "200 ml",
    "prix_ht": 9.75,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Le produit polyvalent qui trouve toute sa place dans une gamme dédiée aux cheveux bouclés. Un seul produit remplit à la fois les fonctions d’un après-shampoing, d’un masque profond et d’un soin sans rinçage. L’huile d’argan et les protéines de riz hydrolysées ciblent la sécheresse et les frisottis, les préoccupations principales des adeptes des cheveux bouclés. Associez-le au shampoing pour cheveux bouclés et à la brume texturisante pour une gamme complète et prête à l'emploi dédiée aux boucles.\n\nUn seul produit, trois façons de l'utiliser. Rincez-le comme un après-shampoing, laissez-le agir comme un masque de soin ou appliquez-le sans rinçage comme un produit coiffant. Il est conçu pour les boucles sèches et sujettes aux frisottis qui ont besoin d’une hydratation et d’une définition supplémentaires. L’huile d’argan et les protéines de riz hydrolysées redonnent de la force à chaque mèche, tandis que la glycérine et l’acide lactique maintiennent les boucles hydratées et pleines de souplesse. Appliquez-le des mi-longueurs jusqu’aux pointes sur cheveux humides, puis coiffez-vous comme vous le souhaitez. Convient particulièrement aux cheveux de type 2 (ondulés) et de type 3 (bouclés).",
    "ingredients": "Glycérine, Acide lactique, Huile d'argan",
    "arome": "Un parfum floral léger et frais, aux subtiles notes de rose.",
    "inci": "INGRÉDIENTS / INCI : Water (Aqua, Eau), Cetearyl Alcohol, Glycerin, Inulin, Stearamidopropyl Dimethylamine, Fragrance (Parfum), Lactic Acid, Sodium Benzoate, Hydrolyzed Rice Protein, Citric Acid, Argania Spinosa Kernel Oil, Potassium Sorbate, Linum Usitatissimum (Linseed) Seed Extract, Vitis Vinifera (Grape) Fruit Extract, Benzyl Alcohol, Citronellol, Alpha-Isomethyl Ionone, Geraniol, Linalool. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/soin-3-en-1-pour-cheveux-boucles.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "shampoing-pour-cheveux-boucles",
    "code": "S0140",
    "nom": "Shampoing pour cheveux bouclés",
    "categorie": "soins-du-cheveu",
    "volume": "390 ml",
    "prix_ht": 11.08,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Un produit incontournable pour tous les cheveux bouclés ou texturés. Cette formule végane et sans sulfate répond aux attentes des clientes aux cheveux bouclés en matière de nettoyage, et s’associe parfaitement au soin 3-en-1 pour cheveux bouclés et à la brume texturisante anti-frisottis pour cheveux bouclés, vous permettant ainsi de proposer une routine complète, du lavage au coiffage.\n\nShampoing sans sulfate spécialement conçu pour les boucles. Il élimine les accumulations et les résidus de produits sans priver les boucles des huiles naturelles dont elles ont besoin, pour que les cheveux restent doux, souples et faciles à coiffer. L'aloe vera et l'huile d'argan réhydratent les cheveux et lissent les frisottis, tandis qu'une base nettoyante douce dérivée de la noix de coco préserve la structure de vos boucles. Ce produit est vegan et suffisamment doux pour un lavage quotidien. Appliquez-le sur les cheveux humides et le cuir chevelu, faites mousser, puis rincez. Convient particulièrement aux cheveux de type 2 (ondulés) et de type 3 (bouclés).",
    "ingredients": "Jus d'aloès, Huile d'argan, Bétaïne, Glycérine, Acide lactique",
    "arome": "Un parfum floral frais et léger, aux subtiles notes végétales.",
    "inci": "INGRÉDIENTS / INCI : Water (Aqua/Eau), Coco-Glucoside, Cocamidopropyl Betaine, Aloe Barbadensis Leaf Juice, Glycerin, Sodium Cocoyl Isethionate, Inulin, Argania Spinosa Kernel Oil, Fragrance (Parfum), Lactic Acid, Sodium Benzoate, Guar Hydroxypropyltrimonium Chloride, Potassium Sorbate, Linum Usitatissimum (Linseed) Seed Extract, Citric Acid, Cocos Nucifera (Coconut) Fruit Extract, Vitis Vinifera (Grape) Fruit Extract, Linalool, Alpha-Isomethyl Ionone. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/shampoing-pour-cheveux-boucles.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "serum-a-la-vitamine-c-sachet-d-essai",
    "code": "SC5857",
    "nom": "Sérum à la vitamine C (sachet d'essai)",
    "categorie": "soins-du-visage",
    "volume": "2 ml",
    "prix_ht": 0.79,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [
      "Avec une forme stabilisée de Vitamine C naturelle"
    ],
    "description": "Offrez à vos clients la possibilité d'obtenir un teint rajeuni et éclatant grâce à notre Booster énergisant à la vitamine C. Ce produit contient un mélange unique composé de 2 % de vitamine C naturelle, 1 % d'acide férulique et 1 % d'argousier, et permet à votre marque de proposer à vos précieux clients un sérum puissant qui aide à protéger la peau contre les agressions environnementales et favorise une peau d'apparence jeune.\n\nSérum léger qui illumine et unifie le teint. L'acide férulique favorise la fermeté de la peau, tandis que l'acide hyaluronique renforce son hydratation. Des huiles nourrissantes adoucissent la peau pour révéler un teint éclatant et d'apparence jeune. Appliquer sur une peau propre.",
    "ingredients": "2% Vitamine C naturelle (Ascorbylglucoside), 1% Acide férulique, 1% Huile de pépins de bourdaine, Vitamine E, Huile de graines de jojoba, Huile d'amande, Huile d'avocat, Huile de graines de rose musquée, PCA de sodium, Acide hyaluronique.",
    "arome": "Arôme doux et juteux de mandarine avec des notes délicates florales et d'agrumes",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Glycerin➁, Cetearyl Alcohol, Simmondsia Chinensis (Jojoba) Seed Oil➀, Pentylene Glycol, Butylene Glycol, Ascorbyl Glucoside, Glyceryl Stearate Citrate, Sodium PCA, Polyglyceryl-6 Stearate, Caprylic/Capric Triglyceride, Ferulic Acid, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil➀, Tocopherol, Coco-Caprylate/Caprate, Dicaprylyl Carbonate, Isoamyl Laurate, Triheptanoin, Potassium Hydroxide, Prunus Amygdalus Dulcis (Sweet Almond) Oil➀, Parfum/Fragrance, Cellulose, Sodium Citrate, Xanthan Gum, Polyglyceryl-6 Behenate, Persea Gratissima (Avocado) Oil➀, Rosa Canina (Rosehip) Fruit Oil➀, Ascorbyl Palmitate, Ricinus Communis (Castor) Seed Oil➀, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Citric Acid, Limonene➂, Citrus Aurantium Peel Oil, Geranyl Acetate➂, Citrus Limon Peel Oil, Linalool➂, Pinene➂, Geraniol➂, Pelargonium Graveolens Flower Oil, Citronellol➂, Vanillin, Beta-Caryophyllene➂, Carvone➂ ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué à partir d'ingrédients biologiques ➂ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-a-la-vitamine-c-sachet-d-essai.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "shampooing-volumateur-a-la-keratine-sachet-d-essai",
    "code": "SC0017",
    "nom": "Shampooing volumateur à la kératine (sachet d'essai)",
    "categorie": "soins-du-cheveu",
    "volume": "5 ml",
    "prix_ht": 0.79,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [
      "Épaississement",
      "Réactive le cuir chevelu",
      "Pour plus de volume"
    ],
    "description": "Une solution haute performance conçue pour répondre à la demande croissante en matière de cheveux plus volumineux et d'apparence plus saine. Cette formule douce mais puissante offre une purification en profondeur et un volume visible, ce qui en fait un complément idéal et facile à commercialiser pour les entreprises qui souhaitent offrir des résultats dignes d'un salon de coiffure.\n\nCette formule douce mais puissante purifie les cheveux, les laissant visiblement doux, lisses et volumineux. Enrichie en kératine hydrolysée et en un complexe hydratant unique, elle favorise une apparence plus dense tout en aidant activement à protéger les cheveux contre les cassures. Il suffit de masser sur cheveux mouillés, de faire mousser et de rincer abondamment pour une sensation de propreté et de fraîcheur.\nÀ associer avec : À associer en duo avec notre après-shampooing Keratin Volume Boost.",
    "ingredients": "Huile de romarin, Kératine, Caféine, Sodium PCA",
    "arome": "Arôme gourmand avec des notes fraîches et aromatiques de menthe poivrée et de romarin sur un fond sucré de vanille, de poudre de fève tonka et de bois de santal.",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Lauryl Glucoside, Sodium Coco-Sulfate, Cantharellus Cibarius (Chanterelle) Extract➀, Glycerin➁, Citric Acid, Disodium Cocoyl Glutamate, PCA Glyceryl Oleate, Sodium PCA, Zinc PCA, Coco-Glucoside, Glyceryl Oleate, Parfum/Fragrance, Sodium Chloride, Caffeine, Benzyl Alcohol, Sodium Cocoyl Glutamate, Sodium Benzoate, Potassium Sorbate, Hydrolyzed Keratin, Leuconostoc/Radish Root Ferment Filtrate, Rosmarinus Officinalis Leaf Oil➀, Mentha Piperita Oil➀, Menthol➂, Limonene➂, Camphor➂, Citrus Aurantium Bergamia Peel Oil, Pinene➂ ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué à partir d'ingrédients biologiques ➂ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/shampooing-volumateur-a-la-keratine-sachet-d-essai.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "apres-shampooing-volumateur-a-la-keratine-sachet-d-essai",
    "code": "SC0018",
    "nom": "Après-shampooing volumateur à la kératine (sachet d'essai)",
    "categorie": "soins-du-cheveu",
    "volume": "5 ml",
    "prix_ht": 0.79,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [
      "Épaissit",
      "réactive le cuir chevelu",
      "pour plus de volume"
    ],
    "description": "Le produit idéal pour répondre à la forte demande en matière de cheveux plus volumineux et plus faciles à coiffer. Sa formule avancée lisse et démêle les cheveux, tout en les protégeant activement contre les cassures et les frisottis, pour une chevelure visiblement plus saine et plus volumineuse. C'est un complément idéal et de haute qualité pour les marques qui souhaitent proposer une solution complète pour donner du volume aux cheveux.\n\nAprès-shampooing volumateur qui lisse, démêle et protège contre les cassures et les frisottis, améliorant ainsi le volume pour des cheveux visiblement plus sains. Enrichi en extraits botaniques nourrissants et en kératine hydrolysée, il aide à fortifier les cheveux de l'intérieur. Appliquez sur cheveux humides, en insistant sur les longueurs et les pointes, puis rincez abondamment pour obtenir un volume doux et somptueux.\nÀ associer avec : À associer en duo avec notre shampooing Keratin Volume Boost.",
    "ingredients": "Huile de romarin, Kératine, Vitamine E, Caféine, Sodium PCA",
    "arome": "Arôme gourmand avec des notes fraîches et aromatiques de menthe poivrée et de romarin sur un fond sucré de vanille, de poudre de fève tonka et de bois de santal.",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Cantharellus Cibarius (Chanterelle) Extract➀, Cetearyl Alcohol, Distearoylethyl Dimonium Chloride, Glycerin, PCA Glyceryl Oleate, Sodium PCA, Urtica Dioica (Nettle) Leaf Extract➀, Zinc PCA, Tocopherol, Parfum/Fragrance, Caffeine, Guar Hydroxypropyltrimonium Chloride, Benzyl Alcohol, Sodium Benzoate, Cocos Nucifera (Coconut) Oil➀, Persea Gratissima (Avocado) Oil➀, Prunus Amygdalus Dulcis (Sweet Almond) Oil➀, Potassium Sorbate, Mentha Piperita Oil➀, Hydrolyzed Keratin, Rosmarinus Officinalis Leaf Oil➀, Lactic Acid, Leuconostoc/Radish Root Ferment Filtrate, Menthol➁, Limonene➁, Camphor➁, Citrus Aurantium Bergamia Peel Oil, Pinene➁ ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué à partir d'ingrédients biologiques",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/apres-shampooing-volumateur-a-la-keratine-sachet-d-essai.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "masque-capillaire-reparateur-intensif-a-la-keratine-sachet-d-essai",
    "code": "SC0091",
    "nom": "Masque capillaire réparateur intensif à la kératine (sachet d'essai)",
    "categorie": "soins-du-cheveu",
    "volume": "5 ml",
    "prix_ht": 0.79,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [
      "Profondément nourrissant",
      "aide à réduire les cassures et les pointes fourchues",
      "pour des cheveux brillants et soyeux"
    ],
    "description": "Le masque capillaire intensif à la kératine est un produit incontournable dans toute gamme de soins capillaires professionnels ou grand public. Avec sa texture riche et onctueuse et sa formule nourrissante, il répond à la demande croissante de solutions qui renforcent et protègent les cheveux secs et abîmés.\n\nCe masque capillaire intensif nourrit et renforce les cheveux en profondeur, en ciblant les cassures, les pointes fourchues et le manque d'éclat. Formulé à base de kératine hydrolysée, de protéines de blé, de peptides et d'un complexe biominéral, il renforce la structure capillaire et améliore l'élasticité et la brillance des cheveux. La vitamine E et le beurre de karité offrent une protection antioxydante et une hydratation intense, laissant les cheveux doux, éclatants de santé et faciles à coiffer. Appliquez généreusement sur des cheveux propres et humides, en insistant sur les longueurs et les pointes. Laissez agir pendant 5 à 10 minutes, puis rincez abondamment.",
    "ingredients": "Kératine, Vitamine E, Beurre de karité, Sodium PCA, Protéines de blé",
    "arome": "Élégant arôme floral blanc avec des nuances de tubéreuse crémeuse sur un fond fruité.",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Cantharellus Cibarius (Chanterelle) Extract➀, Cetearyl Alcohol, Distearoylethyl Dimonium Chloride, Glycerin➁, Brassica Alcohol, PCA Glyceryl Oleate, Sodium PCA, Brassicyl Isoleucinate Esylate, Lactic Acid, Parfum/Fragrance, Cocos Nucifera (Coconut) Oil*, Xylitylglucoside, Butylene Glycol, Guar Hydroxypropyltrimonium Chloride, Benzyl Alcohol, Anhydroxylitol, Persea Gratissima (Avocado) Oil➀, Hydrolyzed Wheat Protein, Sodium Benzoate, Xylitol, Hydrolyzed Keratin, Potassium Sorbate, Ascorbyl Palmitate, Butyrospermum Parkii (Shea) Butter*, Oenothera Biennis (Evening Primrose) Oil➀, Prunus Amygdalus Dulcis (Sweet Almond) Oil*, Tocopherol, Crambe Maritima (Sea Kale) Leaf Extract, Leuconostoc/Radish Root Ferment Filtrate, Linalool➂, Limonene➂, Citrus Aurantium Peel Oil, Juniperus Virginiana Oil, Benzyl Salicylate➂ ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué à partir d'ingrédients biologiques",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/masque-capillaire-reparateur-intensif-a-la-keratine-sachet-d-essai.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "serum-perfecteur-de-pigment-sachet-d-essai",
    "code": "SC5876",
    "nom": "Sérum perfecteur de pigment (sachet d'essai)",
    "categorie": "soins-du-visage",
    "volume": "2 ml",
    "prix_ht": 0.79,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [
      "sérum léger",
      "réduit l'apparence des taches brunes",
      "favorise un teint uniforme"
    ],
    "description": "Ce sérum clarifiant perfecteur de pigment est le complément idéal à la gamme de produits de toute marque de soins de la peau. Il s'agit d'une solution ciblée pour réduire les taches irrégulières, unifier le teint et favoriser un teint radieux et sans imperfections.\n\nNotre sérum perfecteur de pigment est conçu pour réduire l'apparence des taches brunes et favoriser un teint uniforme. Sa formule légère hydrate et apaise tout en ciblant la pigmentation pour un teint plus lumineux. Son parfum ajoute une couche supplémentaire d'indulgence, avec des notes terreuses de racine de vétiver et de bois, complétées par un fond d'amande douce et sucrée. Appliquer quotidiennement sur une peau propre pour de meilleurs résultats.\nA combiner avec : Utiliser avec notre gel hydratant à la niacinamide et notre sérum à la vitamine C pour obtenir un teint plus uniforme.",
    "ingredients": "PCA de sodium, vitamine E",
    "arome": "Arôme boisé de vétiver avec des notes de fleurs blanches, d'amande douce et de vanille",
    "inci": "INGRÉDIENTS / INCI : Aqua, Glycerin➁, Caprylic/Capric Triglyceride, Helianthus Annuus (Sunflower) Seed Oil➀, Pentylene Glycol, Cetearyl Alcohol, Sodium PCA, Glyceryl Stearate Citrate, Alpha-Arbutin, Astrocaryum Murumuru Seed Butter, Gossypium Herbaceum Seed Oil, Bidens Pilosa Extract, Cellulose, Linum Usitatissimum Seed Oil, Parfum, Xanthan Gum, Ascorbyl Palmitate, Lactic Acid, Ascophyllum Nodosum Extract, Sodium Phytate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Tocopherol, Limonene➂, Citrus Limon Peel Oil, Pogostemon Cablin Oil, Linalool➂, Juniperus Virginiana Oil, Cedrus Atlantica Oil/Extract, Pinene➂, Vanillin, Menthol➂, Citral➂, Beta-Caryophyllene➂ ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué à partir d'ingrédients biologiques ➂ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-perfecteur-de-pigment-sachet-d-essai.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "creme-de-nuit-ceramide-barrier-sachet-d-essai",
    "code": "SC5923",
    "nom": "Crème de nuit Ceramide Barrier (sachet d'essai)",
    "categorie": "soins-du-visage",
    "volume": "2 ml",
    "prix_ht": 0.79,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [
      "Hydrate en profondeur",
      "Soutient la barrière cutanée"
    ],
    "description": "Les crèmes de nuit jouent un rôle crucial en soutenant le processus naturel de rajeunissement de la peau pendant la nuit. C'est pourquoi elles constituent l'une des catégories de produits les plus populaires et seront un excellent complément à toute ligne de produits de soins de la peau.\n\nLa crème de nuit hydratante au céramide est soigneusement formulée avec des ingrédients qui agissent pendant la nuit, favorisant le renouvellement de la peau et lui donnant un éclat radieux. La formule hydratante glisse sans effort sur la peau et offre un rajeunissement complet de la peau pendant le sommeil. Les céramides aident à soutenir la barrière cutanée naturelle et donnent à votre peau une apparence saine le matin. Appliquer le soir sur une peau propre.\nÀ combiner avec : Peptide Anti-Ageing Serum ou l'Huile visage nourrissante et la Crème contour des yeux apaisante pour une routine nocturne complète. En outre, utilisez la Crème de Jour Hydratante lors de votre routine de soin du matin.",
    "ingredients": "Céramides, jus d'aloès, huile de jojoba, huile de tournesol, beurre de cacao, beurre de karité, Sodium PCA, acide hyaluronique.",
    "arome": "Arôme délicat de fleurs blanches avec des notes de lavande aromatique et fraîche sur fond herbacé.",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Theobroma Cacao (Cocoa) Seed Butter➀, Simmondsia Chinensis (Jojoba) Seed Oil➀, Helianthus Annuus (Sunflower) Seed Oil➀, Dicaprylyl Carbonate, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Glycerin➁, Helianthus Annuus (Sunflower) Seed Cera, Butyrospermum Parkii (Shea) Butter➀, Olea Europaea (Olive) Oil Unsaponifiables, Sodium PCA, Palmitic Acid, Stearic Acid, Polyglyceryl-6 Behenate, Parfum, Cellulose, Rhus Verniciflua Peel Cera / Rhus Succedanea Fruit Cera, Shorea Robusta Resin, Hippophae Rhamnoides (Sea Buckthorn) Fruit Extract➀, Xanthan Gum, Paeonia Lactiflora (Peony) Root Extract, Sambucus Nigra (Elder) Fruit Extract➀, Vaccinium Macrocarpon (Cranberry) Seed Oil➀, Glycosphingolipids, Glycolipids, Aqua, Sodium Phytate, Ascorbyl Palmitate, Tocopherol, Lactic Acid, Sodium Hyaluronate, Linalool➂, Limonene➂ ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué à partir d'ingrédients biologiques ➂ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-de-nuit-ceramide-barrier-sachet-d-essai.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "creme-peptide-ageless-jour-et-nuit-sachet-d-essai",
    "code": "SC0024",
    "nom": "Crème Peptide Ageless Jour et Nuit (sachet d'essai)",
    "categorie": "soins-du-visage",
    "volume": "2 ml",
    "prix_ht": 0.79,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [
      "lisse les ridules",
      "hydrate",
      "renforce l'élasticité"
    ],
    "description": "La crème Peptide Ageless AM/PM à l'acide hyaluronique constitue un atout majeur pour les marques de beauté qui souhaitent répondre à la demande croissante en matière de soins de la peau à base de peptides et de produits multifonctionnels. Conçue comme une solution polyvalente pour le jour et la nuit, elle vient renforcer toute gamme de soins anti-âge.\n\nCette crème raffermissante contient un complexe de peptides de qualité clinique qui aide à améliorer l'élasticité de la peau et à atténuer l'apparence des ridules et des rides. Conçue pour une utilisation matin et soir, elle offre une hydratation équilibrée et des effets repulpants visibles en une seule formule. Sa texture légère mais nourrissante pénètre facilement, laissant la peau lisse, souple et revitalisée tout au long de la journée et de la nuit. En soutenant les processus naturels de renouvellement de la peau, elle contribue à favoriser un teint plus ferme et d'apparence plus jeune au fil du temps. Idéale pour celles et ceux qui recherchent un soin anti-âge efficace en un minimum d'étapes, cette crème à double action s'intègre facilement à toute routine. Appliquez-la sur une peau propre matin et soir pour de meilleurs résultats.",
    "ingredients": "Peptides, Vitamine C, Vitamine E, Acide hyaluronique, PCA de sodium",
    "arome": "Arôme floral délicat et douceur subtile",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Sodium PCA, Dipalmitoyl Hydroxyproline, Propanediol, Aroma/Fragrance, Dicaprylyl Carbonate, Polyglyceryl-6 Behenate, Mangifera Indica (Mango) Seed Butter➀, Caprylic/Capric Triglyceride, Coco-Caprylate, Fragaria Ananassa (Strawberry) Seed Oil, Vaccinium Myrtillus (Blueberry) Seed Oil➀, Xanthan Gum, Hexapeptide-11, Phytosterols, Octyldodecanol, Palmitic Acid, Stearic Acid, Tocopherol, Ascorbyl Palmitate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Potassium Hydroxide, Leuconostoc/Radish Root Ferment Filtrate, Ginkgo Biloba (Ginkgo) Leaf Extract➀, Citric Acid, Sodium Benzoate, Potassium Sorbate, CI 77491 (Iron Oxides)➂, Linalyl Acetate➁, Geranyl Acetate➁, Linalool➁, Geraniol➁, Citronellol➁ ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-peptide-ageless-jour-et-nuit-sachet-d-essai.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "serum-anti-age-aux-peptides-sachet-d-essai",
    "code": "SC5848",
    "nom": "Sérum anti-âge aux peptides (sachet d'essai)",
    "categorie": "soins-du-visage",
    "volume": "2 ml",
    "prix_ht": 0.79,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [
      "Améliore la barrière cutanée",
      "Booste l'élasticité",
      "Riche en antioxydants"
    ],
    "description": "Proposez à vos clients un sérum aux peptides haut de gamme, formulé à partir de 2 % d'hexapeptide-11 et de 1 % d'extrait de ginkgo biloba. Ce sérum haut de gamme aide à atténuer l'apparence des ridules et des rides, permettant ainsi à vos clients de profiter d'une peau plus lisse, plus ferme et plus raffinée.\n\nSérum lissant pour la peau, enrichi d'ingrédients anti-âge de haute performance pour donner à la peau un aspect plus rebondi et favoriser son élasticité. L'huile de graines de myrtille riche en antioxydants et les extraits de ginkgo assurent une protection, tandis que les peptides et l'acide hyaluronique contribuent à atténuer les rides. Appliquer sur une peau propre.",
    "ingredients": "Hydroxyproline, Peptides, Phytostérols, Jus d’aloe vera, Sodium PCA, Acide hyaluronique, Huile de graines de fraise, Huile de graines de myrtille, Extrait de feuilles de ginkgo",
    "arome": "Délicat arôme floral fantastique avec des notes d'ambre sur un fond doux et poudré",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Glycerin, Simmondsia Chinensis (Jojoba) Seed Oil➀, Aqua/Water, Pentylene Glycol, Cetearyl Alcohol, Sodium PCA, Isoamyl Laurate, Glyceryl Stearate Citrate, Dipalmitoyl Hydroxyproline, Propanediol, Parfum/Fragrance, Caprylic/Capric Triglyceride, Fragaria Ananassa (Strawberry) Seed Oil, Vaccinium Myrtillus (Blueberry) Seed Oil➀, Xanthan Gum, Hexapeptide-11, Phytosterols, Ricinus Communis (Castor) Seed Oil➀, Ascorbyl Palmitate, Hydrolyzed Hyaluronic Acid, Potassium Hydroxide, Sodium Hyaluronate, Sodium Phytate, Tocopherol, Leuconostoc/Radish Root Ferment Filtrate, Ginkgo Biloba Leaf Extract, CI 77491 (Iron Oxides)➁, Citric Acid, Sodium Benzoate, Potassium Sorbate, Glycolipids, Linalool➂, Geraniol➂, Citronellol➂ ➀ Ingrédient issu de l'agriculture biologique ➁ Pigments minéraux purs ➂ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-anti-age-aux-peptides-sachet-d-essai.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "serum-collagene-boost-sachet-d-essai",
    "code": "SC5879",
    "nom": "Sérum Collagène Boost (sachet d'essai)",
    "categorie": "soins-du-visage",
    "volume": "2 ml",
    "prix_ht": 0.79,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [
      "Texture innovante à absorption rapide",
      "Reconstitue l'hydratation"
    ],
    "description": "Que vous soyez une adepte des soins de la peau ou que vous ayez une approche minimaliste, ce sérum s'intégrera sans difficulté dans votre routine quotidienne. Il constitue un excellent complément à votre routine de soins pour donner à votre peau un aspect plus lisse et plus rebondi, tout en lui procurant une sensation de confort et d'hydratation. Il peut également être utilisé pendant les procédures de beauté.\n\napporte à votre peau l'hydratation dont elle a tant besoin et une dose d'actifs puissants qui contribuent à lui donner une apparence plus jeune. La peau paraît plus lisse et plus ferme. La texture légère et rapidement absorbée laisse la peau fraîche et fraîche. Appliquer sur une peau propre.\nCombiner avec : pour des résultats optimaux, ajouter la crème de jour anti-âge et la crème lissante pour les yeux à la routine de soins de la peau.",
    "ingredients": "PCA de sodium, acide hyaluronique, huile de tournesol",
    "arome": "Arôme élégant et poudré d'iris avec une touche de violette sur un fond musqué et boisé doux",
    "inci": "INGRÉDIENTS / INCI : Aqua, Glycerin➁, Caprylic/Capric Triglyceride, Helianthus Annuus (Sunflower) Seed Oil➀, Pentylene Glycol, Cetearyl Alcohol, Glyceryl Stearate Citrate, Sodium PCA, Cellulose, Parfum, Hydrolyzed Hyaluronic Acid, Xanthan Gum, Glyceryl Caprylate, Nasturtium Officinale (Watercress) Flower/Leaf Extract➀, Sambucus Nigra (Elder) Fruit Extract➀, Ascorbyl Palmitate, Sodium Hyaluronate, Sodium Phytate, Potassium Hydroxide, Linalool➂, Geraniol➂, Citronellol➂ ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué à partir d'ingrédients biologiques ➂ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-collagene-boost-sachet-d-essai.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "nettoyant-a-base-d-huile-et-de-lait-pour-peaux-sensibles-sachet-d-essai",
    "code": "SC5924",
    "nom": "Nettoyant à base d'huile et de lait pour peaux sensibles (sachet d'essai)",
    "categorie": "soins-du-visage",
    "volume": "2 ml",
    "prix_ht": 0.79,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Organic"
    ],
    "star_features": [
      "texture huile-lait innovante",
      "convient aux peaux sensibles",
      "testé sous contrôle dermatologique"
    ],
    "description": "Texture nettoyante innovante 2 en 1 qui se transforme en gel huileux rosé en lait soyeux au contact de l'eau. Convient aux peaux sensibles et a été testé sous contrôle dermatologique. Idéal pour le démaquillage, même le plus épais, ou dans le cadre d'une double routine de nettoyage.\n\nLa texture riche et huileuse se transforme en lait soyeux et dissout le maquillage et les impuretés. Laisse la peau fraîche, douce et nourrie sans la déshydrater. Doux pour les peaux sèches et délicates. Appliquer sur la peau sèche ou humide, masser délicatement pour éliminer les impuretés, puis rincer à l'eau. Éviter le contact direct avec les yeux.\nA combiner avec: Pour le soin des peaux sensibles, associez-le au Nettoyant pour le visage et le corps et à la Crème riche nourrissante.",
    "ingredients": "Huile de tournesol, Glycolipides, Extrait de camomille, Extrait d'argousier Extrait de mûre",
    "arome": "Arôme fruité de fleurs blanches avec une touche délicate de jasmin fleuri et de bois de santal crémeux sur un fond poudré doux et légèrement vert",
    "inci": "INGRÉDIENTS / INCI : Caprylic/Capric Triglyceride, Glycerin, Helianthus Annuus (Sunflower) Seed Oil➀, Aqua, Sucrose Laurate, Sucrose Palmitate, Alcohol, Tocopherol, Mica (CI 77019), Parfum, Chamomilla Recutita (Camomile) Flower Extract➀, Hippophae Rhamnoides (Sea Buckthorn) Fruit Extract➀, Rubus Chamaemorus (Cloudberry) Fruit Extract➀, CI 77491 (Iron Oxides), Glycolipids, Limonene, Linalyl Acetate ➀ Ingrédient issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/nettoyant-a-base-d-huile-et-de-lait-pour-peaux-sensibles-sachet-d-essai.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "masque-pour-les-levres-a-l-hydrogel-hyaluronique",
    "code": "S0138-7",
    "nom": "Masque pour les lèvres à l'hydrogel hyaluronique",
    "categorie": "soins-du-visage",
    "volume": "7 g",
    "prix_ht": 17.25,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Repulpant",
      "hydratan"
    ],
    "description": "Le masque pour les lèvres à l'hydrogel hyaluronique s'inscrit dans la catégorie en plein essor des soins pour les lèvres, où les formats de soins tels que les masques et les huiles comptent parmi les produits qui connaissent la plus forte croissance dans le domaine des soins de la peau. À base d'acide hyaluronique, cette formule s'appuie sur un format hydrogel inspiré de la « K-beauty » et destiné aux lèvres sèches et déshydratées.\n\nUn masque à l'hydrogel d'acide hyaluronique qui hydrate en profondeur et régénère les lèvres sèches et déshydratées. L'acide hyaluronique, le panthénol et la glycérine captent l'humidité pour des lèvres plus douces et plus pulpeuses. Appliquez sur des lèvres propres et sèches, laissez agir environ 15 minutes, puis massez délicatement pour faire pénétrer le sérum restant. La boîte contient 7 masques pour les lèvres.",
    "ingredients": "Acide hyaluronique, Panthénol, Glycérine, Extrait de litchi, Extrait de pomme",
    "arome": "Sans parfum",
    "inci": "INGRÉDIENTS / INCI : Aqua (Water), Glycerin, Carrageenan, Panthenol, Amorphophallus Konjac Root Extract, Sucrose, Sodium Levulinate, Phenoxyethanol, Aroma (Flavor), Sodium Anisate, Sodium Hyaluronate, Litchi Chinensis Fruit Extract, Pyrus Malus (Apple) Fruit Extract, Benzoic Acid, Dehydroacetic Acid, Lactic Acid, Sorbic Acid, Chlorella Vulgaris/Lupinus Albus P ➀ Issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/masque-pour-les-levres-a-l-hydrogel-hyaluronique.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "coffret-cadeau-aux-peptides-anti-age",
    "code": "S0143",
    "nom": "Coffret cadeau aux peptides anti-âge",
    "categorie": "collection-box",
    "volume": "95 ml",
    "prix_ht": 40.25,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Hydratation en profondeur",
      "coup de fouet hydratant instantané",
      "texture légère",
      "anti-âge"
    ],
    "description": "La collection « Anti-Age Peptide » est un coffret cadeau prêt à l'emploi destiné aux marques souhaitant proposer une routine anti-âge complète à base de peptides dans un seul coffret. Composée d'un sérum, d'une crème pour les yeux et d'une crème visage jour et nuit, elle offre aux clients une routine complète articulée autour de l'une des familles d'actifs les plus prisées dans le domaine des soins de la peau. Une solution idéale pour les marques qui ciblent les consommateurs soucieux de la composition des produits.\n\nCette gamme propose un rituel ciblé à base de peptides, du sérum au soin pour les yeux en passant par la crème de jour. Le sérum anti-âge aux peptides est enrichi en hexapeptide-11 à 2 %, en acide hyaluronique et en extrait de ginkgo biloba pour aider à atténuer l’apparence des ridules tout en favorisant un teint plus raffiné. La Crème anti-âge aux peptides pour le contour des yeux cible la zone délicate du regard et contribue à atténuer l'apparence des ridules, des pattes d'oie et de la perte de fermeté grâce à sa formule légère. La Crème anti-âge aux peptides matin/soir complète la routine grâce à un complexe de peptides qui aide à améliorer l'élasticité et apporte une hydratation équilibrée matin et soir. Convient à tous les types de peau.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/coffret-cadeau-aux-peptides-anti-age.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "kit-de-manucure-et-pedicure-pour-salon-de-beaute",
    "code": "S0139",
    "nom": "Kit de manucure et pédicure pour salon de beauté",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 119.03,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Usage professionnel",
      "Adoucit la peau",
      "Lisse la peau rugueuse",
      "Soin nourrissant"
    ],
    "description": "Un kit professionnel complet conçu pour sublimer chaque étape du soin des mains et des pieds, de la préparation à la finition. Destiné aux salons qui souhaitent offrir une véritable expérience digne d’un spa, il associe un nettoyage en douceur, une exfoliation efficace et un soin nourrissant de finition, afin que chaque soin soit à la fois complet et relaxant. Les formules sont élaborées pour protéger le vernis et le gel fraîchement appliqués tout en laissant les mains et les pieds doux, lisses et confortables, offrant ainsi aux clientes un résultat qui leur donnera envie de revenir.\nLe kit comprend:\nGel lavant mains & corps, pamplemousse\nGel lavant mains & corps, ambre et patchouli\nGel lavant mains & corps, cèdre et menthe poivrée\nGel lavant mains & corps, cardamome et gingembre\nVolcan islandais Exfoliant pour le visage et le corps\nExfoliant éclaircissant pour le visage et le corps à l'acide kojique\nHuile corporelle Omega 6-9 pour une peau éclatante\nHuile visage tout-en-un\nCrème pour le corps à l'urée pour peaux rugueuses\nCrème pour les mains Silk Skin, ambre boisé et cuir\nCrème pour les mains Silk Skin, épices et bois de santal",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/kit-de-manucure-et-pedicure-pour-salon-de-beaute.png",
    "url": "",
    "date_arrivee": "2026-10-14"
  },
  {
    "slug": "gel-lavant-pour-bebe",
    "code": "S0088",
    "nom": "Gel lavant pour bébé",
    "categorie": "soins-du-corps",
    "volume": "390 ml",
    "prix_ht": 10.75,
    "prix_conseilles": {
      "milieu": 28,
      "bio": 45,
      "luxe": 58
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "Doux pour la peau",
      "pour bébés",
      "certifié biologique"
    ],
    "description": "Produit indispensable pour les soins de bébé, ce gel douche pour bébé nettoie en douceur sans dessécher la peau grâce aux propriétés apaisantes de la camomille et des graines de lin. Sa formule douce et apaisante répond à la demande croissante de produits efficaces, sûrs et nourrissants pour les peaux délicates dès le premier jour.\n\nCe gel douche ultra-doux nettoie sans dessécher la peau, laissant la peau de bébé douce, lisse et naturellement nourrie. Formulé à base de jus d'aloès biologique pour une hydratation apaisante, de bétaïne pour une peau plus douce et d'extrait de camomille calmant, il offre un lavage doux et réconfortant. L'extrait de graines de lin apporte un supplément de nutrition, aidant à maintenir l'équilibre naturel et la souplesse de la peau. Appliquez sur la peau humide, faites mousser doucement et rincez abondamment - ou ajoutez quelques gouttes à l'eau du bain pour encore plus de plaisir moussant. Évitez tout contact avec les yeux.",
    "ingredients": "Jus d'aloès Bétaïne Extrait de camomille Extrait de graines de lin",
    "arome": "Arôme floral avec une touche sucrée de fleur d'amandier, des notes fruitées de cerise douce et acidulée sur un fond poudré et vanillé.",
    "inci": "INGREDIENTS / INCI: Aloe Barbadensis (Aloe) Leaf Juice➀, Sodium Coco-Sulfate, Sodium Cocoamphoacetate, Coco-Glucoside, Rosa Damascena (Rose) Flower Water➀, Cocamidopropyl Betaine, Sodium Chloride, Chamomilla Recutita (Camomile) Flower Extract➀, Linum Usitatissimum (Linseed) Seed Extract➀, Citric Acid, Parfum/Fragrance, Glyceryl Oleate, Aqua/Water, Benzyl Alcohol, Sodium Benzoate, Potassium Sorbate ➀Ingredients from organic farming ➁Made using natural ingredients Origine naturelle du total 98% Origine biologique du total 12% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport son",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-lavant-pour-bebe.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/gel-lavant-pour-bebe"
  },
  {
    "slug": "huile-corporelle-omega-6-9-pour-une-peau-eclatante",
    "code": "S0069",
    "nom": "Huile corporelle Omega 6-9 pour une peau éclatante",
    "categorie": "soins-du-corps",
    "volume": "145 ml",
    "prix_ht": 15.17,
    "prix_conseilles": {
      "milieu": 40,
      "bio": 64,
      "luxe": 82
    },
    "certifications": [
      "Sans gluten",
      "Végétalien",
      "Certifié biologique"
    ],
    "star_features": [
      "Rajeunissant",
      "apporte un éclat sain",
      "hydratant"
    ],
    "description": "L'huile corporelle Omega 6-9 Glowing Skin est un complément hautement performant à toute gamme de soins corporels haut de gamme. Formulée à partir d'un mélange d'huiles végétales riches en oméga, elle répond à la demande croissante de soins corporels naturels, biologiques et profondément nourrissants.\n\nCette huile corporelle luxueuse apporte les lipides essentiels pour renforcer la barrière naturelle de la peau, maintenir son hydratation et lui redonner douceur et éclat. Enrichie en huiles de tournesol, d'amande douce, de jojoba, d'argan, de rose musquée, de framboise et de pépins de courge, elle hydrate intensément tout en améliorant la texture et l'élasticité de la peau. Légère mais profondément nourrissante, elle pénètre rapidement sans laisser de résidus gras. Idéale pour un usage quotidien, après la douche ou pour traiter les zones sèches, cette huile laisse la peau souple, lisse et éclatante.",
    "ingredients": "Huile de graines de tournesol Huile d'argan Huile de rose musquée Huile de jojoba Huile d'amande douce Huile de pépins de framboise",
    "arome": "Arôme de cardamome verte, de romarin et de galbanum",
    "inci": "INGREDIENTS / INCI: Helianthus Annuus (Sunflower) Seed Oil➀, Decyl Cocoate, Prunus Amygdalus Dulcis (Sweet Almond) Oil➀, Simmondsia Chinensis (Jojoba) Seed Oil➀, Argania Spinosa (Argan) Kernel Oil➀, Dicaprylyl Carbonate, Rosa Canina (Rosehip) Fruit Oil*, Rubus Idaeus (Raspberry) Seed Oil➀, Coco-Caprylate/Caprate, Parfum/Fragrance, Cucurbita Pepo (Pumpkin) Seed Oil➀, Tocopherol, Undecane, Tridecane, Pogostemon Cablin Oil, Linalyl Acetate➁, Pinene➁, Linalool➁, Camphor➁, Beta-Caryophyllene➁, Terpineol➁, Limonene➁ ➀Ingredients from organic farming ➁From natural essential oils Origine naturelle du total 99% Origine biologique du total 86% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/huile-corporelle-omega-6-9-pour-une-peau-eclatante.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/huile-corporelle-omega-6-9-pour-une-peau-eclatante"
  },
  {
    "slug": "volcan-islandais-exfoliant-aha-pour-le-visage-et-le-corps",
    "code": "S0023",
    "nom": "Volcan islandais Exfoliant pour le visage et le corps",
    "categorie": "soins-du-corps",
    "volume": "170 ml",
    "prix_ht": 12.67,
    "prix_conseilles": {
      "milieu": 33,
      "bio": 53,
      "luxe": 68
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Exfoliation douce",
      "avec du sable volcanique"
    ],
    "description": "Un gommage visage et corps haute performance qui rehausse n'importe quelle gamme de soins pour la peau. Polyvalent, doux et facile à personnaliser, il constitue la solution idéale pour les entreprises qui souhaitent élargir leur offre de produits existante.\n\nUn gommage crémeux pour le visage et le corps, infusé de sable volcanique, qui exfolie en douceur mais efficacement, en éliminant les cellules mortes de la peau pour la rendre lisse au toucher. Appliquer sur peau sèche ou humide, masser délicatement et rincer à l'eau.",
    "ingredients": "Sable volcanique Huile de ricin",
    "arome": "Arôme frais de concombre avec des notes de citron, d'écorces d'agrumes sucrées et d'herbe verte fraîchement coupée.",
    "inci": "Aqua/Water, Hydrogenated Castor Oil, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Pentylene Glycol, Glycerin➁, Glyceryl Stearate Citrate, Polyglyceryl-3 Stearate, Kaolin, Volcanic Sand, Parfum/Fragrance, Helianthus Annuus (Sunflower) Seed Oil➀, Xanthan Gum, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Tocopherol, Fragaria Ananassa (Strawberry) Fruit Extract➀, Rubus Chamaemorus (Cloudberry) Fruit Extract➀, Rubus Idaeus (Raspberry) Fruit Extract➀, Sodium Phytate, Lactic Acid, Citric Acid, Sodium Benzoate, Potassium Sorbate, Benzyl Salicylate➂, Limonene➂, Citrus Aurantium Peel Oil, Citral➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 99% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingré",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/volcan-islandais-exfoliant-aha-pour-le-visage-et-le-corps.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/volcan-islandais-exfoliant-aha-pour-le-visage-et-le-corps"
  },
  {
    "slug": "exfoliant-eclaircissant-pour-le-visage-et-le-corps-a-l-acide-kojique",
    "code": "S0022",
    "nom": "Exfoliant éclaircissant pour le visage et le corps à l'acide kojique",
    "categorie": "soins-du-corps",
    "volume": "150 ml",
    "prix_ht": 10.08,
    "prix_conseilles": {
      "milieu": 27,
      "bio": 42,
      "luxe": 54
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Éclaircissant",
      "lissant",
      "élimine les cellules mortes"
    ],
    "description": "Ce produit est idéal pour toute gamme de soins de la peau axée sur une exfoliation douce mais efficace. Parfait pour le visage et le corps, cet exfoliant est un excellent ajout à votre catalogue, vous permettant d'offrir une solution ciblée qui répond à la demande croissante de produits propres et efficaces.\n\nCet exfoliant doux à double usage est conçu pour cibler le teint irrégulier et les taches brunes. Enrichi en acide kojique, il élimine en douceur les cellules mortes de la peau, révélant un teint plus lumineux et plus lisse. Enrichie en vitamine C, en beurre de karité et en huile de jojoba, cette formule exfolie, nourrit et hydrate la peau, ce qui la rend parfaite pour préparer votre peau à des soins ou simplement pour profiter d'une routine revitalisante. Appliquez sur la peau humide du visage et du corps, en massant doucement par mouvements circulaires pour exfolier. Rincez abondamment à l'eau et séchez en tapotant. Utilisez 2 à 3 fois par semaine, puis appliquez une crème hydratante et un écran solaire, car l'acide kojique peut augmenter la sensibilité au soleil.",
    "ingredients": "Vitamine C Vitamine E Sodium PCA Beurre de karité Huile de jojoba Menthol Acide kojique",
    "arome": "Arôme d'agrumes avec des notes de citron vert, de thé vert et de menthe poivrée douce sur un fond de vétiver et de bois de cèdre",
    "inci": "Aqua/Water, Dicaprylyl Carbonate, Glycerin➁, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Betaine, Sodium PCA, Simmondsia Chinensis (Jojoba) Seed Oil➀, Parfum/Fragrance, Kojic Acid, Xanthan Gum, Polyglyceryl-6 Behenate, Perlite, Butyrospermum Parkii (Shea) Butter➀, Palmitic Acid, Stearic Acid, Ascorbyl Palmitate, Tocopherol, Potassium Hydroxide, Limonene➂, Citral➂, Citrus Limon Peel Oil, Menthol➂, Pinene➂, Pogostemon Cablin Oil, Linalool➂, Juniperus Virginiana Oil, Mentha Viridis Leaf Oil, Carvone➂, Cedrus Atlantica Oil/Extract, Beta-Caryophyllene➂, Citronellol➂, Geraniol➂ ➀Ingredients from organic Farming ➁Made using organic ingredients ➂From natural essential oils Origine naturelle du total 98% Origine biologique du total 6% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de form",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/exfoliant-eclaircissant-pour-le-visage-et-le-corps-a-l-acide-kojique.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/exfoliant-eclaircissant-pour-le-visage-et-le-corps-a-l-acide-kojique"
  },
  {
    "slug": "bougie-en-cire-de-soja-mousse",
    "code": "S0105",
    "nom": "Bougie en cire de soja, Mousse",
    "categorie": "soins-du-corps",
    "volume": "100 ml",
    "prix_ht": 9,
    "prix_conseilles": {
      "milieu": 24,
      "bio": 38,
      "luxe": 49
    },
    "certifications": [],
    "star_features": [
      "Cire de soja naturelle",
      "mèche en coton",
      "parfum délicat"
    ],
    "description": "Apportez une touche de calme inspirée par la nature à votre gamme de produits grâce à notre bougie à la cire de soja et à la mousse, coulée à la main. Complément idéal des collections bien-être, soins du corps ou aromathérapie, elle enrichit le rituel de soins personnels d'une expérience olfactive apaisante et terreuse.\n\nCette bougie capture l'essence d'une forêt sereine, mêlant la mousse terreuse à de douces notes boisées. Coulée à la main dans un récipient en verre à partir de cire de soja naturelle avec une mèche en coton, elle offre une combustion propre et durable et évoque la fraîcheur et la beauté tranquille des bois. Idéale pour se détendre ou créer une atmosphère paisible. Remarque : chaque bougie comporte une étiquette réglementaire obligatoire sur le dessous, avec les informations requises en matière de sécurité et de composition. Cette étiquette est exigée par la loi et ne peut être personnalisée. La bougie mesure 6,8 cm de hauteur et 5,8 cm de diamètre.",
    "ingredients": "Cire de soja Mèche en coton Parfum",
    "arome": "Parfum terreux et apaisant aux notes fraîches, vertes et boisées, qui rappelle une forêt paisible après la pluie.Parfum terreux et apaisant aux notes fraîches, vertes et boisées, qui rappelle une forêt paisible après la pluie.",
    "inci": "Contains: Parfum (Pogostemon Cablin Oil, Eugenol, Linalool, Beta-Caryophyllene, Geraniol, Benzyl Salicylate, Citronellol, Nerol). Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/bougie-en-cire-de-soja-mousse.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/bougie-en-cire-de-soja-mousse"
  },
  {
    "slug": "bougie-en-cire-de-soja-fleur-sauvage",
    "code": "S0106",
    "nom": "Bougie en cire de soja, Fleur sauvage",
    "categorie": "soins-du-corps",
    "volume": "100 ml",
    "prix_ht": 9,
    "prix_conseilles": {
      "milieu": 24,
      "bio": 38,
      "luxe": 49
    },
    "certifications": [],
    "star_features": [
      "Cire de soja naturelle",
      "mèche en coton",
      "arôme doux"
    ],
    "description": "Élargissez votre gamme de produits de bien-être ou de soins corporels avec notre bougie à la cire de soja et aux fleurs sauvages coulée à la main, conçue pour transformer vos rituels quotidiens en moments de calme et d'inspiration. Idéale comme produit d'appoint, elle rehausse l'attrait sensoriel de toute collection de produits de spa ou de soins personnels.\n\nInspirée par le parfum des prairies en fleurs, cette bougie offre un arôme floral léger avec une fraîcheur subtile qui illumine n'importe quel espace. Coulée à la main dans un récipient en verre à partir de cire de soja naturelle avec une mèche en coton, elle brûle proprement tout en remplissant l'air d'un doux parfum de fleurs sauvages. Remarque : chaque bougie comporte une étiquette réglementaire obligatoire sur le dessous, avec les informations requises en matière de sécurité et de composition. Cette étiquette est exigée par la loi et ne peut être personnalisée. La bougie mesure 6,8 cm de hauteur et 5,8 cm de diamètre.",
    "ingredients": "Cire de soja Mèche en coton Parfum",
    "arome": "Arôme floral doux aux notes vives et fraîches, inspiré des fleurs sauvages et des prairies ensoleillées.",
    "inci": "Contains: Parfum (Citronellol, Geranyl Acetate, Phenylethyl Alcohol, Benzyl Salicylate, Limonene). Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/bougie-en-cire-de-soja-fleur-sauvage.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/bougie-en-cire-de-soja-fleur-sauvage"
  },
  {
    "slug": "bougie-en-cire-de-soja-lavande",
    "code": "S0104",
    "nom": "Bougie en cire de soja, Lavande",
    "categorie": "soins-du-corps",
    "volume": "100 ml",
    "prix_ht": 9,
    "prix_conseilles": {
      "milieu": 24,
      "bio": 38,
      "luxe": 49
    },
    "certifications": [],
    "star_features": [
      "Cire de soja naturelle",
      "mèche en coton",
      "arôme doux"
    ],
    "description": "Améliorez votre gamme de produits de bien-être et de soins personnels avec notre bougie à la lavande et à la cire de soja coulée à la main, un produit complémentaire idéal pour la relaxation et les soins du corps. Parfaite en complément des rituels de soins de la peau ou du bain, elle contribue à créer une atmosphère apaisante qui complète l'expérience sensorielle.\n\nImprégnée du parfum apaisant et intemporel de la lavande, cette bougie transforme n'importe quel espace en un havre de paix. Coulée à la main dans un récipient en verre à partir de cire de soja naturelle et d'une mèche en coton, elle brûle proprement et uniformément. Légèrement parfumée à la lavande naturelle, elle invite à la tranquillité et à l'équilibre à chaque instant. Remarque : chaque bougie comporte une étiquette réglementaire obligatoire sur le dessous, avec les informations requises en matière de sécurité et de composition. Cette étiquette est exigée par la loi et ne peut être personnalisée. La bougie mesure 6,8 cm de hauteur et 5,8 cm de diamètre.",
    "ingredients": "Cire de soja Mèche en coton Parfum",
    "arome": "Parfum classique et apaisant de lavande avec de douces notes herbacées et florales, qui apporte détente et équilibre à chaque pièce.",
    "inci": "Contains: Parfum (Linalool, Limonene, Geraniol, Coumarin). Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/bougie-en-cire-de-soja-lavande.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/bougie-en-cire-de-soja-lavande"
  },
  {
    "slug": "bougie-en-cire-de-soja-bruyere",
    "code": "S0103",
    "nom": "Bougie en cire de soja, Bruyère",
    "categorie": "soins-du-corps",
    "volume": "100 ml",
    "prix_ht": 9,
    "prix_conseilles": {
      "milieu": 24,
      "bio": 38,
      "luxe": 49
    },
    "certifications": [],
    "star_features": [
      "Cire de soja naturelle",
      "mèche en coton",
      "arôme doux"
    ],
    "description": "Rehaussez votre gamme de produits pour le corps et le bien-être avec notre bougie à la cire de soja et à la bruyère coulée à la main, un complément idéal qui vient parfaire tout rituel de soins personnels ou de spa. Idéale en complément des produits de soins de la peau, de bain ou de relaxation, elle améliore l'expérience sensorielle que vos clients associent à leur routine quotidienne.\n\nLorsque la bruyère commence à fleurir, son arôme doux et mielleux embaume l'air, apportant une touche de chaleur estivale forestière à l'intérieur. Coulée à la main dans un récipient en verre, cette bougie est fabriquée à partir de cire de soja naturelle et d'une mèche en coton, légèrement parfumée à la fragrance naturelle de bruyère. Idéale pour les petits espaces ou les moments de tranquillité, elle diffuse une douceur florale à chaque fois que vous l'allumez. Remarque : chaque bougie comporte une étiquette réglementaire obligatoire sur le dessous, avec les informations requises en matière de sécurité et de composition. Cette étiquette est exigée par la loi et ne peut être personnalisée. La bougie mesure 6,8 cm de hauteur et 5,8 cm de diamètre.",
    "ingredients": "Cire de soja Mèche en coton Parfum",
    "arome": "Arôme sucré et floral avec de douces notes de miel, inspiré par la floraison de la bruyère et les prairies estivales chaudes.",
    "inci": "Contains: Parfum (Benzyl Benzoate, Pelargonium Graveolens Flower Oil, Citrus Aurantium Dulcis Peel Oil, Eugenol, Citrus Aurantium Bergamia Peel Oil, Pogestemon Cablin Oil). Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/bougie-en-cire-de-soja-bruyere.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/bougie-en-cire-de-soja-bruyere"
  },
  {
    "slug": "mousse-lavante-pour-bebe",
    "code": "S0089",
    "nom": "Mousse lavante pour bébé",
    "categorie": "soins-du-corps",
    "volume": "150 ml",
    "prix_ht": 10.33,
    "prix_conseilles": {
      "milieu": 27,
      "bio": 43,
      "luxe": 56
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié biologique"
    ],
    "star_features": [
      "Doux pour la peau",
      "pour bébés",
      "certifié biologique"
    ],
    "description": "Complément idéal à toute gamme de produits de soins pour bébés, cette mousse pour bébés offre une solution nettoyante haut de gamme sans savon pour les peaux sensibles, avec les bienfaits apaisants de la camomille et des graines de lin. Sa texture aérienne et sans savon fait du bain un moment réconfortant et amusant.\n\nCette mousse ultra-douce élimine en douceur les impuretés sans dessécher la peau, laissant la peau de bébé douce, lisse et apaisée. Enrichie en jus d'aloès biologique pour hydrater et en extraits apaisants de camomille et de graines de lin, elle offre un soin délicat adapté aux peaux les plus sensibles. Sa texture légère et aérienne rend son application facile et agréable, transformant l'heure du bain en un rituel apaisant. Appliquez sur la peau humide, faites mousser doucement et rincez abondamment. Évitez tout contact avec les yeux.",
    "ingredients": "Jus d'aloès Bétaïne Sodium PCA Extrait de camomille Extrait de graines de lin",
    "arome": "Vanille douce",
    "inci": "INGREDIENTS / INCI: Aloe Barbadensis (Aloe) Leaf Juice➀, Caprylyl/Capryl Glucoside, Cocamidopropyl Betaine, Glycerin➁, Butylene Glycol, Pentylene Glycol, Sodium PCA, Sucrose Cocoate, Chamomilla Recutita (Camomile) Flower Extract➀, Linum Usitatissimum (Linseed) Seed Extract➀, Lactic Acid, Vanillin ➀Ingredients from organic farming ➁Made using organic ingredients Origine naturelle du total 99% Origine biologique du total 12% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés. Ecocert COSMOS Organic Certifié COSMOS ORGANIC Certifié par",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/mousse-lavante-pour-bebe.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/mousse-lavante-pour-bebe"
  },
  {
    "slug": "lotion-pour-le-corps-bebe",
    "code": "S0090",
    "nom": "Lotion pour le corps bébé",
    "categorie": "soins-du-corps",
    "volume": "190 ml",
    "prix_ht": 10.5,
    "prix_conseilles": {
      "milieu": 28,
      "bio": 44,
      "luxe": 57
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié biologique"
    ],
    "star_features": [
      "Doux pour la peau",
      "pour bébés",
      "certifié biologique"
    ],
    "description": "Complément idéal à toute gamme de soins pour bébés, cette lotion corporelle pour bébés offre une hydratation douce et certifiée biologique tout en préservant la santé des peaux délicates. Enrichie en extraits de mûres blanches et de graines de lin riches en oméga, elle aide à protéger les peaux délicates tout en offrant une hydratation longue durée.\n\nCette lotion corporelle nourrissante hydrate et apaise instantanément la peau délicate des bébés, la laissant douce, lisse et protégée. Formulée à base d'extraits de mûre blanche et de graines de lin pour renforcer la barrière cutanée, de jus d'aloès et de sodium PCA pour une hydratation douce, et de vitamines C et E associées à des beurres de karité et de cacao pour un apport riche en antioxydants, elle offre un soin complet aux peaux sensibles. Appliquez en massage sur la peau sèche selon les besoins pour maintenir sa douceur et sa souplesse tout au long de la journée.",
    "ingredients": "Vitamine C Vitamine E Extrait de graines de lin Beurre de karité Sodium PCA Beurre de cacao",
    "arome": "Arôme floral avec une touche sucrée de fleur d'amandier et un fond sucré de vanille.",
    "inci": "INGREDIENTS / INCI: Aloe Barbadensis (Aloe) Leaf Juice➀, Helianthus Annuus (Sunflower) Seed Oil➀, Caprylic/Capric Triglyceride, Glycerin➁, Glyceryl Stearate Citrate, Pentylene Glycol, Cetearyl Alcohol, Olea Europaea (Olive) Fruit Oil➀, Parfum/Fragrance, Rubus Chamaemorus (Cloudberry) Fruit Extract➀, Cellulose, Sodium PCA, Linum Usitatissimum (Linseed) Seed Extract➀, Xanthan Gum, Butyrospermum Parkii (Shea) Butter➀, Theobroma Cacao (Cocoa) Seed Butter➀, Aqua/Water, Ascorbyl Palmitate, Sodium Phytate, Tocopherol, Lactic Acid, Vanillin ➀Ingredients from organic farming ➁Made using organic ingredients Origine naturelle du total 100% Origine biologique du total 21% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le res",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/lotion-pour-le-corps-bebe.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/lotion-pour-le-corps-bebe"
  },
  {
    "slug": "creme-pour-le-corps-pour-peaux-sensibles",
    "code": "A5940",
    "nom": "Crème pour le corps pour peaux sensibles",
    "categorie": "soins-du-corps",
    "volume": "190 ml",
    "prix_ht": 12.42,
    "prix_conseilles": {
      "milieu": 33,
      "bio": 52,
      "luxe": 67
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Hydratation en profondeur",
      "formule à absorption rapide",
      "apaise et hydrate"
    ],
    "description": "Développez votre marque privée de soins de la peau avec une crème hydratante luxueuse, conçue pour offrir les soins les plus doux à la peau.\n\nNotre crème pour le corps pour peaux sensibles est conçue pour nourrir et protéger les peaux délicates. Enrichie d'ingrédients calmants et apaisants, cette formule à absorption rapide offre une hydratation en profondeur sans provoquer d'irritation, ce qui la rend idéale pour un usage quotidien sur le visage et le corps. Conçue spécifiquement pour les peaux sensibles et déshydratées, elle apaise sans effort tout en retenant l'humidité, laissant la peau douce, souple et parfaitement équilibrée. Offrez à votre peau la douceur qu'elle mérite grâce à cet ajout essentiel à votre ligne de soins sous marque de distributeur. Associez-le à notre nettoyant huile-lait pour peaux sensibles, à notre nettoyant visage et corps pour peaux sensibles et à notre shampooing pour cuir chevelu pour créer une ligne de produits de soins pour peaux sensibles.",
    "ingredients": "Beurre de karité, beurre de cacao, Sodium PCA, jus d'aloès, extrait de fleur (tilleul, jasmin), extrait de fruit (prune).",
    "arome": "Arôme aquatique frais avec des notes délicates de nénuphar et de jasmin",
    "inci": "INGREDIENTS / INCI: Aloe Barbadensis (Aloe) Leaf Juice➀, Helianthus Annuus (Sunflower) Seed Oil➀, Dicaprylyl Carbonate, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Glycerin, Olea Europaea (Olive) Fruit Oil➀, Prunus Domestica (Plum) Fruit Extract➀, Parfum/Fragrance, Polyglyceryl-6 Behenate, Palmitic Acid, Stearic Acid, Butyrospermum Parkii (Shea) Butter➀, Sodium PCA, Theobroma Cacao (Cocoa) Seed Butter➀, Xanthan Gum, Aqua/Water, Tilia Cordata (Linden) Flower Extract➀, Cellulose, Ascorbyl Palmitate, Sodium Phytate, Tocopherol, Jasminum Officinale (Jasmin) Extract, Lactic Acid, Leuconostoc/Radish Root Ferment Filtrate, Vanillin, Terpineol, Linalyl Acetate, Anethole ➀Ingredients from Organic Farming Origine naturelle du total 99% Origine biologique du total 20% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées ",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-pour-le-corps-pour-peaux-sensibles.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/creme-pour-le-corps-pour-peaux-sensibles"
  },
  {
    "slug": "creme-pour-le-corps-a-luree-pour-peaux-rugueuses-2",
    "code": "A5937-G",
    "nom": "Crème pour le corps 5% urée + 2% panthénol",
    "categorie": "soins-du-corps",
    "volume": "280 ml",
    "prix_ht": 13.67,
    "prix_conseilles": {
      "milieu": 36,
      "bio": 57,
      "luxe": 74
    },
    "certifications": [],
    "star_features": [
      "Hydratation Intensive",
      "5% Urée",
      "Texture Nourrissante et Non Grasse"
    ],
    "description": "Cette crème pour le corps profondément hydratante avec de l'urée et du panthénol est essentielle pour toute ligne de soins de la peau destinée aux clients recherchant une hydratation puissante et durable ainsi que des bienfaits adoucissants pour la peau. Conçue pour les personnes ayant la peau rugueuse et sèche, cette crème offre une solution d'hydratation profonde et durable qui nourrit et apaise, en faisant un choix idéal pour les collections de soins haut de gamme.\n\nCette crème pour le corps est conçue pour apaiser et adoucir instantanément les peaux rugueuses. Enrichie en 5 % d'urée pour une hydratation intense, en acide hyaluronique pour la rétention d'humidité et en panthénol pour un soin apaisant, elle soulage la sécheresse et redonne à la peau un toucher lisse et souple. À combiner avec : Parfait en complément de notre collection de nettoyants pour les mains et le corps, de la crème pour les mains Silk Skin et des sérums pour le corps.",
    "ingredients": "Sodium PCA, Urée, Acide Hyaluronique, Panthénol",
    "arome": "Arôme frais de concombre avec une touche délicate de citron, de thym vert et d'écorce d'agrumes douce-amère",
    "inci": "Ingredients / INCI: Aqua, Helianthus Annuus (Sunflower) Seed Oil➀, Glycerin, Hydroxyethyl Urea, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Panthenol, Caprylic/Capric Triglyceride, Caprylic/Capric/Myristic/Stearic Triglyceride, Dicaprylyl Carbonate, Sodium PCA, Parfum, Triethyl Citrate, Polyglyceryl-6 Behenate, Benzyl Alcohol, Xanthan Gum, Sodium Benzoate, Palmitic Acid, Stearic Acid, Lactic Acid, Potassium Sorbate, Ascorbyl Palmitate, Sodium Hyaluronate, Sodium Phytate, Tocopherol, Benzyl Salicylate, Limonene, Citrus Aurantium Bergamia Peel Oil, Citrus Aurantium Peel Oil, Citral, Linalool, Linalyl Acetate, Pinene, Cananga Odorata Oil/Extract ➀Ingredients from organic farming Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriq",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-pour-le-corps-a-luree-pour-peaux-rugueuses-2.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/creme-pour-le-corps-a-luree-pour-peaux-rugueuses-2"
  },
  {
    "slug": "creme-pour-le-corps-a-luree-pour-peaux-rugueuses",
    "code": "A5937-A",
    "nom": "Crème pour le corps 5% urée + 2% panthénol",
    "categorie": "soins-du-corps",
    "volume": "280 ml",
    "prix_ht": 13.67,
    "prix_conseilles": {
      "milieu": 36,
      "bio": 57,
      "luxe": 74
    },
    "certifications": [],
    "star_features": [
      "Hydratation Intensive",
      "5% Urée",
      "Texture Nourrissante et Non Grasse"
    ],
    "description": "Cette crème pour le corps profondément hydratante avec de l'urée et du panthénol est essentielle pour toute ligne de soins de la peau destinée aux clients recherchant une hydratation puissante et durable ainsi que des bienfaits adoucissants pour la peau. Conçue pour les personnes ayant la peau rugueuse et sèche, cette crème offre une solution d'hydratation profonde et durable qui nourrit et apaise, en faisant un choix idéal pour les collections de soins haut de gamme.\n\nCette crème pour le corps est conçue pour apaiser et adoucir instantanément les peaux rugueuses. Enrichie en 5 % d'urée pour une hydratation intense, en acide hyaluronique pour la rétention d'humidité et en panthénol pour un soin apaisant, elle soulage la sécheresse et redonne à la peau un toucher lisse et souple. À combiner avec : Parfait en complément de notre collection de nettoyants pour les mains et le corps, de la crème pour les mains Silk Skin et des sérums pour le corps.",
    "ingredients": "Sodium PCA, Urée, Acide Hyaluronique, Panthénol",
    "arome": "Arôme frais de concombre avec une touche délicate de citron, de thym vert et d'écorce d'agrumes douce-amère",
    "inci": "Ingredients / INCI: Aqua, Helianthus Annuus (Sunflower) Seed Oil➀, Glycerin, Hydroxyethyl Urea, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Panthenol, Caprylic/Capric Triglyceride, Caprylic/Capric/Myristic/Stearic Triglyceride, Dicaprylyl Carbonate, Sodium PCA, Parfum, Triethyl Citrate, Polyglyceryl-6 Behenate, Benzyl Alcohol, Xanthan Gum, Sodium Benzoate, Palmitic Acid, Stearic Acid, Lactic Acid, Potassium Sorbate, Ascorbyl Palmitate, Sodium Hyaluronate, Sodium Phytate, Tocopherol, Benzyl Salicylate, Limonene, Citrus Aurantium Bergamia Peel Oil, Citrus Aurantium Peel Oil, Citral, Linalool, Linalyl Acetate, Pinene, Cananga Odorata Oil/Extract ➀Ingredients from organic farming Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriq",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-pour-le-corps-a-luree-pour-peaux-rugueuses.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/creme-pour-le-corps-a-luree-pour-peaux-rugueuses"
  },
  {
    "slug": "serum-corporel-silk-skin-ambre-boise-et-cuir",
    "code": "A5872",
    "nom": "Sérum corporel Silk Skin, ambre boisé et cuir",
    "categorie": "soins-du-corps",
    "volume": "270 ml",
    "prix_ht": 9.75,
    "prix_conseilles": {
      "milieu": 26,
      "bio": 41,
      "luxe": 53
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Hydratation en profondeur",
      "formule à absorption rapide",
      "apaise et hydrate"
    ],
    "description": "Complète parfaitement notre crème pour les mains Silk Skin et notre large gamme de produits de lavage pour les mains et le corps.\n\nCe sérum léger à absorption rapide offre une hydratation et un rajeunissement intenses, laissant votre peau incroyablement douce et lisse. Le sérum contient un mélange unique d'huiles nourrissantes, dont l'huile de jojoba et l'huile de rose musquée, qui agissent ensemble pour améliorer la texture et l'élasticité de la peau. À combiner avec: Parfait avec notre Gel lavant pour les mains et le corps et notre Crème pour les mains Silk Skin.",
    "ingredients": "PCA de sodium Huile de Jojoba Extrait de fruit Extrait de plantes Acide Hyaluronique Eau de fleur de lavande Bétaïne",
    "arome": "Arôme de baies de genièvre avec des notes douces d'ambre, de pétales de rose délicats, d'accord de cuir et de patchouli boisé.",
    "inci": "INGREDIENTS / INCI: Aqua, Coconut Alkanes, Pentylene Glycol, Cetearyl Alcohol, Glycerin, Glyceryl Stearate Citrate, Betaine, Caprylic/Capric Triglyceride, Dicaprylyl Carbonate, Simmondsia Chinensis Seed Oil, Sodium PCA, Helianthus Annuus Seed Oil, Parfum, Undecane, Tridecane, Xanthan Gum, Cellulose, Ascorbyl Palmitate, Tocopherol, Rosa Canina Fruit Oil, Sodium Phytate, Nasturtium Officinale Flower/Leaf Extract, Potassium Hydroxide, Sodium Hyaluronate, Ginkgo Biloba Leaf Extract, Citric Acid, Sodium Benzoate, Potassium Sorbate, Vanillin, Linalyl Acetate, Pogostemon Cablin Oil, Linalool, Coumarin, Cedrus Atlantica Oil/Extract Origine naturelle du total 99% Origine biologique du total 3% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits s",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-corporel-silk-skin-ambre-boise-et-cuir.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/serum-corporel-silk-skin-ambre-boise-et-cuir"
  },
  {
    "slug": "serum-corporel-silk-skin-epices-et-bois-de-santal",
    "code": "A5870",
    "nom": "Sérum corporel Silk Skin, épices et bois de santal",
    "categorie": "soins-du-corps",
    "volume": "270 ml",
    "prix_ht": 10.08,
    "prix_conseilles": {
      "milieu": 27,
      "bio": 42,
      "luxe": 54
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Hydratation en profondeur",
      "formule à absorption rapide",
      "apaise et hydrate"
    ],
    "description": "Complète parfaitement notre crème pour les mains Silk Skin et notre large gamme de produits de lavage pour les mains et le corps.\n\nCe sérum léger à absorption rapide offre une hydratation et un rajeunissement intenses, laissant votre peau incroyablement douce et lisse. Le sérum contient un mélange unique d'huiles nourrissantes, dont l'huile de jojoba et l'huile de rose musquée, qui agissent ensemble pour améliorer la texture et l'élasticité de la peau. À combiner avec: Parfait avec notre Gel lavant pour les mains et le corps et notre Crème pour les mains Silk Skin.",
    "ingredients": "PCA de sodium Huile de Jojoba Extrait de fruit Extrait de plantes Acide Hyaluronique Eau de fleur de lavande Bétaïne",
    "arome": "Arôme frais avec des notes d'agrumes, de poivre rose épicé, de cardamome et de gingembre sur fond de bois de santal et de vétiver.",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Coconut Alkanes, Pentylene Glycol, Polyglyceryl-6 Stearate, Glyceryl Stearate Citrate, Glycerin, Betaine, Caprylic/Capric Triglyceride, Dicaprylyl Carbonate, Simmondsia Chinensis (Jojoba) Seed Oil➀, Sodium PCA, Helianthus Annuus (Sunflower) Seed Oil➀, Parfum/Fragrance, Undecane, Polyglyceryl-6 Behenate, Tridecane, Xanthan Gum, Cellulose, Ascorbyl Palmitate, Tocopherol, Rosa Canina (Rosehip) Fruit Oil➀, Sodium Phytate, Nasturtium Officinale (Watercress) Flower/Leaf Extract➀, Potassium Hydroxide, Sodium Hyaluronate, Ginkgo Biloba (Ginkgo) Leaf Extract➀, Citric Acid, Sodium Benzoate, Potassium Sorbate, Juniperus Virginiana Oil, Linalyl Acetate➁, Cedrus Atlantica Oil/Extract, Pogostemon Cablin Oil, Beta-Caryophyllene➁, Lavandula Oil/Extract, Pinene➁, Limonene➁, Linalool➁. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-corporel-silk-skin-epices-et-bois-de-santal.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/serum-corporel-silk-skin-epices-et-bois-de-santal"
  },
  {
    "slug": "creme-pour-les-mains-silk-skin-epices-et-bois-de-santal",
    "code": "A5869",
    "nom": "Crème pour les mains Silk Skin, épices et bois de santal",
    "categorie": "soins-du-corps",
    "volume": "270 ml",
    "prix_ht": 10.58,
    "prix_conseilles": {
      "milieu": 28,
      "bio": 44,
      "luxe": 57
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Hydratation profonde",
      "nourrissante et apaisante",
      "protège la peau"
    ],
    "description": "Améliorez la ligne de soins de votre marque avec cette crème pour les mains Silk Skin. Parfaite pour l'hydratation et la protection quotidiennes, elle complète toute votre gamme de produits de soins de la peau.\n\nConçue pour offrir une hydratation et une nutrition intenses à vos mains. Infusée d'huile de graines de tournesol et de beurre de cacao, cette formule riche procure une hydratation durable tout en apaisant la peau sèche et gercée. La texture veloutée de la crème pour les mains assure une absorption rapide, ce qui la rend idéale pour un usage fréquent tout au long de la journée. À combiner avec: Parfait avec notre nettoyant pour les mains et le corps et notre lotion hydratante pour le corps.",
    "ingredients": "Beurre de cacao PCA de sodium Extrait de fruit Extrait de baies Extrait de plante",
    "arome": "Arôme frais avec des notes d'agrumes, de poivre rose épicé, de cardamome et de gingembre sur fond de bois de santal et de vétiver",
    "inci": "INGREDIENTS / INCI: Aqua, Helianthus Annuus Seed Oil, Glycerin, Glyceryl Stearate Citrate, Cetearyl Alcohol, Sodium PCA, Caprylic/Capric Triglyceride, Caprylic/Capric/Myristic/Stearic Triglyceride, Dicaprylyl Carbonate, Theobroma Cacao Seed Butter, Parfum, Octyldodecanol, Cellulose, Benzyl Alcohol, Hippophae Rhamnoides Fruit Extract, Irvingia Gabonensis Kernel Butter, Rubus Chamaemorus Fruit Extract, Vaccinium Myrtillus Fruit Extract, Xanthan Gum, Hydrogenated Coco-Glycerides, Sodium Benzoate, Sodium Hyaluronate, Tocopherol, Lactic Acid, Potassium Sorbate, Ascorbyl Palmitate, Sodium Phytate, Juniperus Virginiana Oil, Linalyl Acetate, Cedrus Atlantica Oil/Extract, Pogostemon Cablin Oil, Beta-Caryophyllene, Lavandula Oil/Extract, Pinene, Limonene, Linalool Origine naturelle du total 99% Origine biologique du total 15% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources nat",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-pour-les-mains-silk-skin-epices-et-bois-de-santal.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/creme-pour-les-mains-silk-skin-epices-et-bois-de-santal"
  },
  {
    "slug": "creme-pour-les-mains-silk-skin-ambre-boise-et-cuir",
    "code": "A5867",
    "nom": "Crème pour les mains Silk Skin, ambre boisé et cuir",
    "categorie": "soins-du-corps",
    "volume": "270 ml",
    "prix_ht": 10.58,
    "prix_conseilles": {
      "milieu": 28,
      "bio": 44,
      "luxe": 57
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Hydratation profonde",
      "nourrissante et apaisante",
      "protège la peau"
    ],
    "description": "Améliorez la ligne de soins de votre marque avec cette crème pour les mains Silk Skin. Parfaite pour l'hydratation et la protection quotidiennes, elle complète toute votre gamme de produits de soins de la peau.\n\nConçue pour offrir une hydratation et une nutrition intenses à vos mains. Infusée d'huile de graine d'Helianthus Annuus et de beurre de graine de Theobroma Cacao, cette formule riche procure une hydratation durable tout en apaisant les peaux sèches et gercées. La texture veloutée de la crème pour les mains assure une absorption rapide, ce qui la rend idéale pour un usage fréquent tout au long de la journée. À combiner avec : Parfait avec notre nettoyant pour les mains et le corps et notre lotion hydratante pour le corps.",
    "ingredients": "Beurre de cacao PCA de sodium Extrait de fruit Extrait de baies Extrait de plante",
    "arome": "Arôme de baies de genièvre avec des notes douces d'ambre, de pétales de rose délicats, d'accord de cuir et de patchouli boisé",
    "inci": "INGREDIENTS / INCI: Aqua, Helianthus Annuus Seed Oil, Glycerin, Glyceryl Stearate Citrate, Cetearyl Alcohol, Sodium PCA, Caprylic/Capric Triglyceride, Caprylic/Capric/Myristic/Stearic Triglyceride, Dicaprylyl Carbonate, Theobroma Cacao Seed Butter, Parfum, Octyldodecanol, Cellulose, Benzyl Alcohol, Hippophae Rhamnoides Fruit Extract, Irvingia Gabonensis Kernel Butter, Rubus Chamaemorus Fruit Extract, Vaccinium Myrtillus Fruit Extract, Xanthan Gum, Hydrogenated Coco-Glycerides, Sodium Benzoate, Sodium Hyaluronate, Tocopherol, Lactic Acid, Potassium Sorbate, Ascorbyl Palmitate, Sodium Phytate, Vanillin, Linalyl Acetate, Pogostemon Cablin Oil, Linalool, Coumarin, Cedrus Atlantica Oil/Extract, Pinene Origine naturelle du total 99% Origine biologique du total 15% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-pour-les-mains-silk-skin-ambre-boise-et-cuir.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/creme-pour-les-mains-silk-skin-ambre-boise-et-cuir"
  },
  {
    "slug": "gel-lavant-mains-corps-pamplemousse-6",
    "code": "A5821-G",
    "nom": "Gel lavant mains & corps, pamplemousse",
    "categorie": "soins-du-corps",
    "volume": "490 ml",
    "prix_ht": 8.5,
    "prix_conseilles": {
      "milieu": 22,
      "bio": 36,
      "luxe": 46
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Hydratant",
      "Doux pour la peau",
      "Végétalien"
    ],
    "description": "Ce nettoyant corporel doux et personnalisé nettoie vos mains et votre peau sans les déshydrater. Infusé d'ingrédients hydratants, il laisse votre peau fraîche, douce et délicatement parfumée. Appliquer sur la peau humide, faire mousser et rincer abondamment.",
    "ingredients": "Bétaïne, Extrait de baies",
    "arome": "Pamplemousse énergisant et acidulé",
    "inci": "Aqua, Sodium Coco-Sulfate, Cocamidopropyl Betaine, Sodium Cocoamphoacetate, Citric Acid, Betaine, Coco-Glucoside, Parfum, Benzyl Alcohol, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Sodium Benzoate, Potassium Sorbate, Sodium Chloride, Limonene➁, Citronellol➁, Citral➁, Benzyl Salicylate➁, Geraniol➁, Linalool➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 98% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlif",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-lavant-mains-corps-pamplemousse-6.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/gel-lavant-mains-corps-pamplemousse-6"
  },
  {
    "slug": "gel-lavant-mains-corps-pamplemousse-5",
    "code": "A5821-A",
    "nom": "Gel lavant mains & corps, pamplemousse",
    "categorie": "soins-du-corps",
    "volume": "490 ml",
    "prix_ht": 8.5,
    "prix_conseilles": {
      "milieu": 22,
      "bio": 36,
      "luxe": 46
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Hydratant",
      "Doux pour la peau",
      "Végétalien"
    ],
    "description": "Ce nettoyant corporel doux et personnalisé nettoie vos mains et votre peau sans les déshydrater. Infusé d'ingrédients hydratants, il laisse votre peau fraîche, douce et délicatement parfumée. Appliquer sur la peau humide, faire mousser et rincer abondamment.",
    "ingredients": "Bétaïne, Extrait de baies",
    "arome": "Pamplemousse énergisant et acidulé",
    "inci": "Aqua, Sodium Coco-Sulfate, Cocamidopropyl Betaine, Sodium Cocoamphoacetate, Citric Acid, Betaine, Coco-Glucoside, Parfum, Benzyl Alcohol, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Sodium Benzoate, Potassium Sorbate, Sodium Chloride, Limonene➁, Citronellol➁, Citral➁, Benzyl Salicylate➁, Geraniol➁, Linalool➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 98% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlif",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-lavant-mains-corps-pamplemousse-5.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/gel-lavant-mains-corps-pamplemousse-5"
  },
  {
    "slug": "gel-lavant-mains-corps-pamplemousse-7",
    "nom": "Gel lavant mains & corps, pamplemousse",
    "categorie": "soins-du-corps",
    "volume": "400 ml",
    "prix_ht": null,
    "prix_conseilles": {
      "milieu": 13,
      "bio": 21,
      "luxe": 27
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Hydratant",
      "Doux pour la peau",
      "Végétalien"
    ],
    "description": "Ce nettoyant corporel doux et personnalisé nettoie vos mains et votre peau sans les déshydrater. Infusé d'ingrédients hydratants, il laisse votre peau fraîche, douce et délicatement parfumée. Appliquer sur la peau humide, faire mousser et rincer abondamment.",
    "ingredients": "Bétaïne, Extrait de baies",
    "arome": "Pamplemousse énergisant et acidulé",
    "inci": "Aqua, Sodium Coco-Sulfate, Cocamidopropyl Betaine, Sodium Cocoamphoacetate, Citric Acid, Betaine, Coco-Glucoside, Parfum, Benzyl Alcohol, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Sodium Benzoate, Potassium Sorbate, Sodium Chloride, Limonene➁, Citronellol➁, Citral➁, Benzyl Salicylate➁, Geraniol➁, Linalool➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 98% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlif",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-lavant-mains-corps-pamplemousse-7.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/gel-lavant-mains-corps-pamplemousse-7",
    "status": "retired"
  },
  {
    "slug": "gel-lavant-mains-corps-cedre-menthe-poivree-2",
    "code": "A5855-A",
    "nom": "Gel lavant mains & corps, CÈDRE & MENTHE POIVRÉE",
    "categorie": "soins-du-corps",
    "volume": "490 ml",
    "prix_ht": 8.33,
    "prix_conseilles": {
      "milieu": 22,
      "bio": 35,
      "luxe": 45
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "HYDRATANTS",
      "VEGAN",
      "LÉGERS"
    ],
    "description": "Nettoie les mains et la peau sans les déshydrater. Laisse la peau fraîche, douce et délicatement parfumée. Appliquez sur une peau humide, faites mousser puis rincez abondamment",
    "ingredients": "Extrait de fruits, Bétaïne",
    "arome": "Arôme frais de menthe avec des notes herbacées vertes sur un fond de cèdre blanc",
    "inci": "Aqua/Water, Sodium Coco-Sulfate, Sodium Cocoamphoacetate, Cocamidopropyl Betaine, Betaine, Coco-Glucoside, Citric Acid, Parfum/Fragrance, Sodium Chloride, Benzyl Alcohol, Pyrus Cydonia (Quince) Fruit Extract➀, Sodium Benzoate, Potassium Sorbatel ➀ Ingredients from organic farming Origine naturelle du total 98% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international COSMOS-standard by ECOCERT Greenlife. Our product formulas contain natural ingredients sourced in organic farming and organic plant-based ingredients. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natural-and-organic-cosmetics-cosmos",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-lavant-mains-corps-cedre-menthe-poivree-2.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/gel-lavant-mains-corps-cedre-menthe-poivree-2"
  },
  {
    "slug": "gel-lavant-mains-corps-cardamone-gingembre-2",
    "code": "A5856-A",
    "nom": "Gel lavant mains & corps, CARDAMONE & GINGEMBRE",
    "categorie": "soins-du-corps",
    "volume": "490 ml",
    "prix_ht": 8.33,
    "prix_conseilles": {
      "milieu": 22,
      "bio": 35,
      "luxe": 45
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "HYDRATANTS",
      "VEGAN",
      "LÉGERS"
    ],
    "description": "Nettoie les mains et la peau sans les déshydrater. Laisse la peau fraîche, douce et délicatement parfumée. Appliquez sur une peau humide, faites mousser puis rincez abondamment",
    "ingredients": "Extrait de fruits, Bétaïne",
    "arome": "Arôme aromatique de cardamome avec des notes d'épices froides et de gingembre doux",
    "inci": "Aqua/Water, Sodium Coco-Sulfate, Sodium Cocoamphoacetate, Cocamidopropyl Betaine, Betaine, Coco-Glucoside, Citric Acid, Parfum/Fragrance, Sodium Chloride, Benzyl Alcohol, Pyrus Cydonia (Quince) Fruit Extract➀, Sodium Benzoate, Potassium Sorbate ➀ Ingredients from organic farming Origine naturelle du total 98% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international COSMOS-standard by ECOCERT Greenlife. Our product formulas contain natural ingredients sourced in organic farming and organic plant-based ingredients. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natural-and-organic-cosmetics-cosmos",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-lavant-mains-corps-cardamone-gingembre-2.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/gel-lavant-mains-corps-cardamone-gingembre-2"
  },
  {
    "slug": "hand-body-wash-patchouli-amber-vanilla-4",
    "code": "A5854-A",
    "nom": "Hand & Body Wash, Patchouli & Amber Vanilla",
    "categorie": "soins-du-corps",
    "volume": "490 ml",
    "prix_ht": 8.33,
    "prix_conseilles": {
      "milieu": 22,
      "bio": 35,
      "luxe": 45
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "HYDRATANTS",
      "VEGAN",
      "LÉGERS"
    ],
    "description": "Nettoie les mains et la peau sans les déshydrater. Laisse la peau fraîche, douce et délicatement parfumée. Appliquez sur une peau humide, faites mousser puis rincez abondamment.",
    "ingredients": "Extrait de fruits, Bétaïne",
    "arome": "Doux arôme de vanille avec des notes d'ambre et de patchouli sur un fond boisé",
    "inci": "Aqua/Water, Sodium Coco-Sulfate, Sodium Cocoamphoacetate, Cocamidopropyl Betaine, Betaine, Coco-Glucoside, Citric Acid, Parfum/Fragrance, Sodium Chloride, Benzyl Alcohol, Pyrus Cydonia (Quince) Fruit Extract➀, Sodium Benzoate, Potassium Sorbate ➀ Ingredients from organic farming Origine naturelle du total 98% All Natural Vous ne trouverez aucun colorant artificiel, parfum synthétique, parabène ou sulfate dans nos produits de soin. Notre gamme de produits de beauté est certifiée biologique ou naturelle selon le référentiel international COSMOS par ECOCERT Greenlife. Nos formules de produits contiennent des ingrédients naturels issus de l’agriculture biologique et des ingrédients d’origine végétale biologique. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natural-and-organic-cosmetics-cosmos",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/hand-body-wash-patchouli-amber-vanilla-4.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/hand-body-wash-patchouli-amber-vanilla-4"
  },
  {
    "slug": "gel-lavant-mains-corps-cardamone-gingembre",
    "code": "A5856-G",
    "nom": "Gel lavant mains & corps, CARDAMONE & GINGEMBRE",
    "categorie": "soins-du-corps",
    "volume": "490 ml",
    "prix_ht": 8.33,
    "prix_conseilles": {
      "milieu": 22,
      "bio": 35,
      "luxe": 45
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "HYDRATANTS",
      "VEGAN",
      "LÉGERS"
    ],
    "description": "Nettoie les mains et la peau sans les déshydrater. Laisse la peau fraîche, douce et délicatement parfumée. Appliquez sur une peau humide, faites mousser puis rincez abondamment.",
    "ingredients": "TYPES DE PEAU Tous types de peaux POINTS FORTS Hydratant Respectueuse de la peau Nettoie la peau sans l'assécher Laisse un délicat parfum sur la peau Texture de gel transparente Crée une mousse délicate Facile à rincer INGRÉDIENTS Extrait de fruits Bétaïne PARFUM Arôme aromatique de cardamome avec des notes d'épices froides et de gingembre doux",
    "arome": "",
    "inci": "Aqua/Water, Sodium Coco-Sulfate, Sodium Cocoamphoacetate, Cocamidopropyl Betaine, Betaine, Coco-Glucoside, Citric Acid, Parfum/Fragrance, Sodium Chloride, Benzyl Alcohol, Pyrus Cydonia (Quince) Fruit Extract ➀, Sodium Benzoate, Potassium Sorbatel ➀ Ingredients from organic farming Origine naturelle du total 98% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natu",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-lavant-mains-corps-cardamone-gingembre.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/gel-lavant-mains-corps-cardamone-gingembre"
  },
  {
    "slug": "gel-lavant-mains-corps-cedre-menthe-poivree",
    "code": "A5855-G",
    "nom": "Gel lavant mains & corps, CÈDRE & MENTHE POIVRÉE",
    "categorie": "soins-du-corps",
    "volume": "490 ml",
    "prix_ht": 8.33,
    "prix_conseilles": {
      "milieu": 22,
      "bio": 35,
      "luxe": 45
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "HYDRATANTS",
      "VEGAN",
      "LÉGERS"
    ],
    "description": "Nettoie les mains et la peau sans les déshydrater. Laisse la peau fraîche, douce et délicatement parfumée. Appliquez sur une peau humide, faites mousser puis rincez abondamment.",
    "ingredients": "TYPES DE PEAU Tous types de peaux POINTS FORTS Hydratant Respectueuse de la peau Nettoie la peau sans l'assécher Laisse un délicat parfum sur la peau Texture de gel transparente Crée une mousse délicate Facile à rincer INGRÉDIENTS Extrait de fruits Bétaïne PARFUM Arôme frais de menthe avec des notes herbacées vertes sur un fond de cèdre blanc",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Sodium Coco-Sulfate, Sodium Cocoamphoacetate, Cocamidopropyl Betaine, Betaine, Coco-Glucoside, Citric Acid, Parfum/Fragrance, Sodium Chloride, Benzyl Alcohol, Pyrus Cydonia (Quince) Fruit Extract➀, Sodium Benzoate, Potassium Sorbatel. ➀ Ingrédient issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-lavant-mains-corps-cedre-menthe-poivree.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/gel-lavant-mains-corps-cedre-menthe-poivree"
  },
  {
    "slug": "gel-lavant-mains-corps-ambre-patchouli",
    "code": "A5854-G",
    "nom": "Gel lavant mains & corps, Ambre & Patchouli",
    "categorie": "soins-du-corps",
    "volume": "490 ml",
    "prix_ht": 8.33,
    "prix_conseilles": {
      "milieu": 22,
      "bio": 35,
      "luxe": 45
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "HYDRATANTS",
      "VEGAN",
      "LÉGERS"
    ],
    "description": "Ce gel douche pour les mains et le corps de haute qualité, vendu sous marque privée, est conçu pour améliorer l'expérience de vos clients en matière de soins de la peau ! Son parfum riche et sa mousse veloutée constituent une combinaison idéale qui sera très appréciée par vos clients. Les rituels de bain deviendront ainsi des expériences remarquables ! Les gels douche sont particulièrement adaptés aux spas et centres de bien-être, aux entreprises de commerce électronique, aux hôtels-boutiques design, aux restaurants et cafés, ainsi qu'aux détaillants de luxe.\n\ncette formule douce assure un nettoyage lissant et hydratant ! La bétaïne hydratante apporte des bienfaits hydratants, tandis que le parfum subtil de vanille douce et d'ambre persiste sur la peau tout au long de la journée ! Appliquez sur peau humide, faites mousser et rincez abondamment.",
    "ingredients": "Extrait de fruits, Bétaïne",
    "arome": "Doux arôme de vanille avec des notes d'ambre et de patchouli sur un fond boisé",
    "inci": "Aqua/Water, Sodium Coco-Sulfate, Sodium Cocoamphoacetate, Cocamidopropyl Betaine, Betaine, Coco-Glucoside, Citric Acid, Parfum/Fragrance, Sodium Chloride, Benzyl Alcohol, Pyrus Cydonia (Quince) Fruit Extract➀, Sodium Benzoate, Potassium Sorbate ➀ Ingredients from organic farming Origine naturelle du total 98% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international COSMOS-standard by ECOCERT Greenlife. Our product formulas contain natural ingredients sourced in organic farming and organic plant-based ingredients. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natural-and-organic-cosmetics-cosmos",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-lavant-mains-corps-ambre-patchouli.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/gel-lavant-mains-corps-ambre-patchouli"
  },
  {
    "slug": "nettoyant-2-en-1-pour-les-cheveux-et-le-corps-pour-les-hommes",
    "code": "A5931",
    "nom": "Nettoyant 2 en 1 pour les cheveux et le corps pour les hommes",
    "categorie": "soins-du-corps",
    "volume": "490 ml",
    "prix_ht": 9.92,
    "prix_conseilles": {
      "milieu": 26,
      "bio": 42,
      "luxe": 54
    },
    "certifications": [
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Convient à la peau et aux cheveux",
      "donne du volume aux cheveux"
    ],
    "description": "Produit multi-usages - lavage des mains, du corps et des cheveux, avec un parfum vivifiant et rafraîchissant, destiné au public masculin. Complément idéal à toute routine de soins de la peau - soit comme produit autonome, soit comme complément à un assortiment existant de produits de soins pour hommes.\n\nNettoie le corps et les cheveux tout en préservant leur texture douce. Renforce et donne du volume aux cheveux. Appliquer sur les cheveux et le corps humides, faire mousser et rincer. A combiner avec: Pour une routine complète de soins pour hommes, nous recommandons d'ajouter à l'assortiment la Crème visage à l'acide hyaluronique ou le Gel visage au zinc sans huile, l'Huile à barbe adoucissante et la Crème anti-âge pour les yeux.",
    "ingredients": "Bétaïne, protéines de blé",
    "arome": "Arôme boisé élégant avec des notes vertes d'herbe fraîchement coupée, de vétiver fumé et d'ambre",
    "inci": "Ingredients / INCI: Aqua, Sodium Coco-Sulfate, Coco-Glucoside, Rosa Damascena (Rosa) Flower Water➀, Cocamidopropyl Betaine, Glycerin➁, Betaine, Glyceryl Oleate, Sodium Chloride, Citric Acid, Parfum, Benzyl Alcohol, Brassica Alcohol, Pyrus Cydonia (Quince) Fruit Extract➀, Urtica Dioica (Nettle) Leaf Extract➀, Hydrolyzed Wheat Protein, Sodium Benzoate, Brassicyl Isoleucinate Esylate, Potassium Sorbate, Limonene➂, Linalool➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 98% Origine biologique du total 8% Produits durables The products are made using environmentally friendly production and processing processes respecting human health and using natural resources responsibly. The formulations are developed, applying the concept of green formulation. The ingredients used in the products are made respecting biodiversity. There are no GMO ingredients within the products. The packaging is recyclable. The transportation",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/nettoyant-2-en-1-pour-les-cheveux-et-le-corps-pour-les-hommes.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/nettoyant-2-en-1-pour-les-cheveux-et-le-corps-pour-les-hommes"
  },
  {
    "slug": "nettoyant-peaux-sensibles-visage-corps-4",
    "code": "A9945-390",
    "nom": "Nettoyant peaux sensibles visage & corps",
    "categorie": "soins-du-corps",
    "volume": "390 ml",
    "prix_ht": 10.42,
    "prix_conseilles": {
      "milieu": 28,
      "bio": 44,
      "luxe": 56
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "​​​​​​​Doux pour la peau",
      "Formule minimaliste",
      "Peaux sensibles"
    ],
    "description": "Ce nettoyant est un produit idéal pour toute gamme de soins destinée aux peaux sensibles et sujettes aux rougeurs. Ce nettoyant double usage pour le visage et le corps, à la formule minimaliste, aide à maintenir le niveau d'hydratation naturel de la peau. Testé dermatologiquement et doux pour la peau.\n\nCe nettoyant visage et corps pour peaux sensibles, à la formule minimaliste, purifie la peau en douceur et aide à maintenir son niveau d'hydratation naturel. Enrichi en extraits de tilleul, de jasmin et de prune, il est conçu pour apaiser la peau et la laisser propre, confortable et merveilleusement douce. Convient aussi bien au visage qu'au corps. Appliquer sur peau humide. Rincer abondamment.",
    "ingredients": "Extrait de fleurs de tilleul, Extrait de fleurs de jasmin, Extrait de prunes",
    "arome": "Violette poudrée et florale, vanille douce, frangipane",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Coco-Glucoside, Cocamidopropyl Betaine, Glycerin, Xanthan Gum, Sodium PCA, Sodium Levulinate, Lactic Acid, Acacia Senegal Gum, Parfum/Fragrance, Sodium Anisate, Prunus Domestica (Plum) Fruit Extract*, Tilia Cordata (Linden) Flower Extract*, Jasminum Officinale (Jasmine) Extract, Leuconostoc/Radish Root Ferment Filtrate. * Ingrédient issu de l'agriculture biologique. Certifié COSMOS NATURAL.",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/nettoyant-peaux-sensibles-visage-corps-4.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-corps/nettoyant-peaux-sensibles-visage-corps-4"
  },
  {
    "slug": "shampooing-doux-pour-bebe",
    "code": "S0087",
    "nom": "Shampooing doux pour bébé",
    "categorie": "soins-du-cheveu",
    "volume": "400 ml",
    "prix_ht": 11.08,
    "prix_conseilles": {
      "milieu": 29,
      "bio": 47,
      "luxe": 60
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "Doux pour la peau",
      "pour bébés",
      "certifié biologique"
    ],
    "description": "Conçu pour les moments les plus délicats des soins, ce shampooing pour bébés allie nettoyage doux et confort naturel dans une formule nourrissante. Léger et apaisant, il prend soin des tout-petits tout en répondant aux besoins quotidiens en matière de soins purs et biologiques.\n\nCe shampooing ultra-doux nettoie en douceur les cheveux de bébé sans les dessécher, les laissant doux, frais et faciles à coiffer. Formulé à base de jus d'aloès biologique pour une hydratation apaisante, de bétaïne pour une douceur accrue et de prébiotiques pour favoriser un cuir chevelu sain, il offre un lavage nourrissant de la racine à la pointe. L'extrait de fleur de tilleul enrichit encore la formule grâce à ses propriétés naturellement apaisantes, ce qui le rend idéal même pour les cuirs chevelus les plus délicats. Appliquez une petite quantité sur les cheveux mouillés, faites mousser doucement et rincez abondamment. Évitez tout contact avec les yeux.",
    "ingredients": "Jus d'aloès Bétaïne Prébiotiques Extrait de fleur de tilleul",
    "arome": "Arôme floral avec une touche sucrée de fleur d'amandier, des notes fruitées de cerise douce et acidulée sur un fond poudré et vanillé.",
    "inci": "INGREDIENTS / INCI: Aloe Barbadensis (Aloe) Leaf Juice*, Sodium Coco-Sulfate, Rosa Damascena (Rose) Flower Water*, Cocamidopropyl Betaine, Coco-Glucoside, Sodium Cocoamphoacetate, Aqua/Water, Glyceryl Oleate, Linum Usitatissimum (Linseed) Seed Extract*, Sodium Chloride, Tilia Cordata (Linden) Flower Extract*, Citric Acid, Parfum/Fragrance, Benzyl Alcohol, Sodium Benzoate, Potassium Sorbate, Phenethyl Alcohol, Furcellaria Lumbricalis Extract ➀Ingredients from organic farming ➁Made using Organic Ingredients Origine naturelle du total 98% Origine biologique du total 12% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont ",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/shampooing-doux-pour-bebe.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-cheveu/shampooing-doux-pour-bebe"
  },
  {
    "slug": "masque-capillaire-a-la-keratine",
    "code": "S0091",
    "nom": "Masque capillaire réparateur intensif à la kératine",
    "categorie": "soins-du-cheveu",
    "volume": "170 ml",
    "prix_ht": 13.25,
    "prix_conseilles": {
      "milieu": 35,
      "bio": 56,
      "luxe": 72
    },
    "certifications": [
      "Certifié naturel"
    ],
    "star_features": [
      "Nourrit en profondeur",
      "aide à réduire les cassures et les pointes fourchues",
      "améliore la brillance et la douceur."
    ],
    "description": "Le masque capillaire intensif à la kératine est un produit incontournable dans toute gamme de soins capillaires professionnels ou grand public. Avec sa texture riche et onctueuse et sa formule nourrissante, il répond à la demande croissante de solutions qui renforcent et protègent les cheveux secs et abîmés.\n\nCe masque capillaire intensif nourrit et renforce les cheveux en profondeur, en ciblant les cassures, les pointes fourchues et le manque d'éclat. Formulé à base de kératine hydrolysée, de protéines de blé, de peptides et d'un complexe biominéral, il renforce la structure capillaire et améliore l'élasticité et la brillance des cheveux. La vitamine E et le beurre de karité offrent une protection antioxydante et une hydratation intense, laissant les cheveux doux, éclatants de santé et faciles à coiffer. Appliquez généreusement sur des cheveux propres et humides, en insistant sur les longueurs et les pointes. Laissez agir pendant 5 à 10 minutes, puis rincez abondamment.",
    "ingredients": "Kératine Vitamine E Beurre de karité Sodium PCA Protéines de blé",
    "arome": "Élégant arôme floral blanc avec des nuances de tubéreuse crémeuse sur un fond fruité.",
    "inci": "INGREDIENTS / INCI: Aqua/Water, Cantharellus Cibarius (Chanterelle) Extract➀, Cetearyl Alcohol, Distearoylethyl Dimonium Chloride, Glycerin➁, Brassica Alcohol, PCA Glyceryl Oleate, Sodium PCA, Brassicyl Isoleucinate Esylate, Lactic Acid, Parfum/Fragrance, Cocos Nucifera (Coconut) Oil*, Xylitylglucoside, Butylene Glycol, Guar Hydroxypropyltrimonium Chloride, Benzyl Alcohol, Anhydroxylitol, Persea Gratissima (Avocado) Oil➀, Hydrolyzed Wheat Protein, Sodium Benzoate, Xylitol, Hydrolyzed Keratin, Potassium Sorbate, Ascorbyl Palmitate, Butyrospermum Parkii (Shea) Butter*, Oenothera Biennis (Evening Primrose) Oil➀, Prunus Amygdalus Dulcis (Sweet Almond) Oil*, Tocopherol, Crambe Maritima (Sea Kale) Leaf Extract, Leuconostoc/Radish Root Ferment Filtrate, Linalool➂, Limonene➂, Citrus Aurantium Peel Oil, Juniperus Virginiana Oil, Benzyl Salicylate➂ ➀Ingredients from organic farming ➁Made using organic ingredients Origine naturelle du total 98% Origine biologique du total 12% Produits durables Le",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/masque-capillaire-a-la-keratine.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-cheveu/masque-capillaire-a-la-keratine"
  },
  {
    "slug": "exfoliant-pour-cuir-chevelu-deep-cleanse-romarin-et-menthe",
    "code": "A5874",
    "nom": "Exfoliant pour cuir chevelu Deep Cleanse, romarin et menthe",
    "categorie": "soins-du-cheveu",
    "volume": "170 ml",
    "prix_ht": 12.92,
    "prix_conseilles": {
      "milieu": 34,
      "bio": 54,
      "luxe": 70
    },
    "certifications": [
      "Sans gluten",
      "Sans noix"
    ],
    "star_features": [
      "Élimine les accumulations",
      "Huile de romarin"
    ],
    "description": "Élargissez votre collection de soins capillaires avec notre exfoliant pour cuir chevelu Deep Cleanse, romarin et menthe. Ce produit de nettoyage en profondeur est idéal pour les clients qui souhaitent lutter contre les accumulations et les pellicules tout en favorisant un cuir chevelu sain.\n\nL'exfoliant pour cuir chevelu Deep Cleanse, romarin et menthe, revitalise le cuir chevelu et les cheveux. Formulé avec des exfoliants naturels et des huiles de romarin et de menthe poivrée, il nettoie en profondeur et élimine efficacement les accumulations du cuir chevelu, tout en aidant à réduire l'apparence des pellicules. Ce gommage revigorant favorise un cuir chevelu sain et équilibré. Appliquer sur les cheveux et le cuir chevelu mouillés, masser délicatement en insistant sur le cuir chevelu. Laisser agir pendant 5 à 15 minutes avant de rincer.",
    "ingredients": "Kératine Huile de romarin Beurre de karité Huile de menthe poivrée",
    "arome": "Arôme gourmand avec des notes fraîches et aromatiques de menthe poivrée et de romarin sur fond de vanille sucrée, de fève tonka poudrée et de bois de santal.",
    "inci": "Aqua/Water, Isoamyl Laurate, Kaolin, Prunus Cerasus (Sour Cherry) Shell Powder, Glycerin➁, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Helianthus Annuus (Sunflower) Seed Oil➀, Parfum/Fragrance, Xanthan Gum, Polyglyceryl-6 Behenate, Mentha Piperita (Peppermint) Oil➀, Benzyl Alcohol, Butyrospermum Parkii (Shea) Butter➀, Palmitic Acid, Stearic Acid, Mentha Piperita (Peppermint) Leaf Extract➀, Sodium Benzoate, Ascorbyl Palmitate, Potassium Hydroxide, Rosmarinus Officinalis (Rosemary) Leaf Oil➀, Tocopherol, Potassium Sorbate, Hydrolyzed Keratin, Leuconostoc/Radish Root Ferment Filtrate, Menthol➂, Limonene➂, Pinene➂, Beta-Caryophyllene➂, Camphor➂, Citrus Aurantium Bergamia Peel Oil, Linalool➂ ➀Ingredients from Organic Farming ➁Made using organic ingredients ➂From natural essential oils Origine naturelle du total 99% Origine biologique du total 7% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humai",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/exfoliant-pour-cuir-chevelu-deep-cleanse-romarin-et-menthe.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-cheveu/exfoliant-pour-cuir-chevelu-deep-cleanse-romarin-et-menthe"
  },
  {
    "slug": "shampooing-volumateur-a-la-keratine",
    "code": "S0017",
    "nom": "Shampooing volumateur à la kératine",
    "categorie": "soins-du-cheveu",
    "volume": "390 ml",
    "prix_ht": 11.08,
    "prix_conseilles": {
      "milieu": 29,
      "bio": 47,
      "luxe": 60
    },
    "certifications": [
      "Sans gluten",
      "Sans noix"
    ],
    "star_features": [
      "Épaississement",
      "Réactive le cuir chevelu",
      "Pour plus de volume"
    ],
    "description": "Une solution haute performance conçue pour répondre à la demande croissante en matière de cheveux plus volumineux et d'apparence plus saine. Cette formule douce mais puissante offre une purification en profondeur et un volume visible, ce qui en fait un complément idéal et facile à commercialiser pour les entreprises qui souhaitent offrir des résultats dignes d'un salon de coiffure.\n\nCette formule douce mais puissante purifie les cheveux, les laissant visiblement doux, lisses et volumineux. Enrichie en kératine hydrolysée et en un complexe hydratant unique, elle favorise une apparence plus dense tout en aidant activement à protéger les cheveux contre les cassures. Il suffit de masser sur cheveux mouillés, de faire mousser et de rincer abondamment pour une sensation de propreté et de fraîcheur. À associer avec : À associer en duo avec notre après-shampooing Keratin Volume Boost.",
    "ingredients": "Huile de romarin Kératine Caféine Sodium PCA",
    "arome": "Arôme gourmand avec des notes fraîches et aromatiques de menthe poivrée et de romarin sur un fond sucré de vanille, de poudre de fève tonka et de bois de santal.",
    "inci": "Aqua/Water, Lauryl Glucoside, Sodium Coco-Sulfate, Cantharellus Cibarius (Chanterelle) Extract➀, Glycerin➁, Citric Acid, Disodium Cocoyl Glutamate, PCA Glyceryl Oleate, Sodium PCA, Zinc PCA, Coco-Glucoside, Glyceryl Oleate, Parfum/Fragrance, Sodium Chloride, Caffeine, Benzyl Alcohol, Sodium Cocoyl Glutamate, Sodium Benzoate, Potassium Sorbate, Hydrolyzed Keratin, Leuconostoc/Radish Root Ferment Filtrate, Rosmarinus Officinalis Leaf Oil➀, Mentha Piperita Oil➀, Menthol➂, Limonene➂, Camphor➂, Citrus Aurantium Bergamia Peel Oil, Pinene➂ ➀Ingredients from organic Farming ➁Made using organic ingredients ➂From natural essential oils Origine naturelle du total 99% Origine biologique du total 4% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/shampooing-volumateur-a-la-keratine.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-cheveu/shampooing-volumateur-a-la-keratine"
  },
  {
    "slug": "apres-shampooing-volumateur-a-la-keratine",
    "code": "S0018",
    "nom": "Après-shampooing volumateur à la kératine",
    "categorie": "soins-du-cheveu",
    "volume": "390 ml",
    "prix_ht": 10.42,
    "prix_conseilles": {
      "milieu": 28,
      "bio": 44,
      "luxe": 56
    },
    "certifications": [
      "Sans gluten"
    ],
    "star_features": [
      "Épaissit",
      "réactive le cuir chevelu",
      "pour plus de volume"
    ],
    "description": "Le produit idéal pour répondre à la forte demande en matière de cheveux plus volumineux et plus faciles à coiffer. Sa formule avancée lisse et démêle les cheveux, tout en les protégeant activement contre les cassures et les frisottis, pour une chevelure visiblement plus saine et plus volumineuse. C'est un complément idéal et de haute qualité pour les marques qui souhaitent proposer une solution complète pour donner du volume aux cheveux.\n\nAprès-shampooing volumateur qui lisse, démêle et protège contre les cassures et les frisottis, améliorant ainsi le volume pour des cheveux visiblement plus sains. Enrichi en extraits botaniques nourrissants et en kératine hydrolysée, il aide à fortifier les cheveux de l'intérieur. Appliquez sur cheveux humides, en insistant sur les longueurs et les pointes, puis rincez abondamment pour obtenir un volume doux et somptueux. À associer avec : À associer en duo avec notre shampooing Keratin Volume Boost.",
    "ingredients": "Huile de romarin Kératine Vitamine E Caféine Sodium PCA",
    "arome": "Arôme gourmand avec des notes fraîches et aromatiques de menthe poivrée et de romarin sur un fond sucré de vanille, de poudre de fève tonka et de bois de santal.",
    "inci": "Aqua/Water, Cantharellus Cibarius (Chanterelle) Extract➀, Cetearyl Alcohol, Distearoylethyl Dimonium Chloride, Glycerin, PCA Glyceryl Oleate, Sodium PCA, Urtica Dioica (Nettle) Leaf Extract➀, Zinc PCA, Tocopherol, Parfum/Fragrance, Caffeine, Guar Hydroxypropyltrimonium Chloride, Benzyl Alcohol, Sodium Benzoate, Cocos Nucifera (Coconut) Oil➀, Persea Gratissima (Avocado) Oil➀, Prunus Amygdalus Dulcis (Sweet Almond) Oil➀, Potassium Sorbate, Mentha Piperita Oil➀, Hydrolyzed Keratin, Rosmarinus Officinalis Leaf Oil➀, Lactic Acid, Leuconostoc/Radish Root Ferment Filtrate, Menthol➁, Limonene➁, Camphor➁, Citrus Aurantium Bergamia Peel Oil, Pinene➁ ➀Ingredients from organic Farming ➁Made using organic ingredients Origine naturelle du total 98% Origine biologique du total 7% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliq",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/apres-shampooing-volumateur-a-la-keratine.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-cheveu/apres-shampooing-volumateur-a-la-keratine"
  },
  {
    "slug": "apres-shampooing-smoky-green-vetiver",
    "code": "A5918",
    "nom": "Après-shampooing, Smoky Green Vetiver",
    "categorie": "soins-du-cheveu",
    "volume": "370 ml",
    "prix_ht": 10.08,
    "prix_conseilles": {
      "milieu": 27,
      "bio": 42,
      "luxe": 54
    },
    "certifications": [],
    "star_features": [
      "Prévient les pointes fourchues",
      "les cheveux deviennent plus soyeux",
      "facilite le coiffage"
    ],
    "description": "Complément idéal à toute gamme de soins capillaires pour obtenir un look et une sensation dignes d'un salon de coiffure.\n\nNourrit les pointes des cheveux et prévient les cassures et les pointes fourchues. Les cheveux deviennent plus soyeux et plus faciles à coiffer. Appliquer sur les pointes, laisser absorber pendant 1 à 3 minutes et rincer.",
    "ingredients": "Panthénol, bétaïne, protéines de blé",
    "arome": "Arôme boisé élégant avec des notes vertes d'herbe fraîchement coupée et de vétiver fumé",
    "inci": "Ingredients / INCI: Aqua, Cetearyl Alcohol, Behentrimonium Chloride, Betaine, Glycerin, Panthenol, Distearoylethyl Dimonium Chloride, Persea Gratissima (Avocado) Oil➀, Parfum, Mica, Lactic Acid, Tocopherol, Benzyl Alcohol, CI 77891, Sodium Benzoate, Hydrolyzed Wheat Protein, Potassium Sorbate, Limonene, Citrus Limon Peel Oil, Pogostemon Cablin Oil, Juniperus Virginiana Oil, Linalool ➀ Ingredients from organic farming Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/apres-shampooing-smoky-green-vetiver.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-cheveu/apres-shampooing-smoky-green-vetiver"
  },
  {
    "slug": "shampooing-smoky-green-vetiver",
    "code": "A5917",
    "nom": "Shampooing, Smoky Green Vetiver",
    "categorie": "soins-du-cheveu",
    "volume": "400 ml",
    "prix_ht": 10.08,
    "prix_conseilles": {
      "milieu": 27,
      "bio": 42,
      "luxe": 54
    },
    "certifications": [],
    "star_features": [
      "Apporte de la brillance aux cheveux",
      "les rend lisses",
      "délicatement parfumés"
    ],
    "description": "Complément idéal à toute gamme de soins capillaires pour obtenir un aspect et une sensation dignes d'un salon de coiffure.\n\nPurifie en douceur les cheveux, les laissant frais et brillants. Les cheveux sont incroyablement lisses et pleins de corps. Appliquer sur les cheveux humides et sur le cuir chevelu, faire mousser et rincer.",
    "ingredients": "Bétaïne, protéines de blé",
    "arome": "Arôme boisé élégant avec des notes vertes d'herbe fraîchement coupée et de vétiver fumé",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Sodium Coco-Sulfate, Coco-Glucoside, Cocamidopropyl Betaine, Glycerin➁, Betaine, Aqua/Water, Glyceryl Oleate, Sodium Chloride, Citric Acid, Parfum/Fragrance, Benzyl Alcohol, Brassica Alcohol, Hydrolyzed Wheat Protein, Camellia Sinensis (Black Tea) Leaf Extract➀, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Sodium Benzoate, Brassicyl Isoleucinate Esylate, Potassium Sorbate, Limonene➂, Citrus Limon Peel Oil, Pogostemon Cablin Oil, Juniperus Virginiana Oil, Linalool➂, Cedrus Atlantica Oil/Extract. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques ➂ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/shampooing-smoky-green-vetiver.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-cheveu/shampooing-smoky-green-vetiver"
  },
  {
    "slug": "apres-shampooing-citrus-cocktail",
    "code": "A5916",
    "nom": "Après-shampooing, Citrus Cocktail",
    "categorie": "soins-du-cheveu",
    "volume": "370 ml",
    "prix_ht": 10.75,
    "prix_conseilles": {
      "milieu": 28,
      "bio": 45,
      "luxe": 58
    },
    "certifications": [],
    "star_features": [
      "Prévient les pointes fourchues",
      "Facilite le coiffage",
      "Nourrit les cheveux"
    ],
    "description": "Complément idéal à toute gamme de soins capillaires pour obtenir un aspect et une sensation dignes d'un salon de coiffure.\n\nNourrit les pointes des cheveux et prévient les cassures et les pointes fourchues. Les cheveux deviennent plus soyeux et plus faciles à coiffer. Appliquer sur les pointes, laisser absorber pendant 1 à 3 minutes et rincer.",
    "ingredients": "Panthénol, bétaïne, protéines de blé",
    "arome": "Arôme de cocktail d'agrumes frais et acidulé avec des notes d'herbes et une touche délicate de pétales floraux sucrés",
    "inci": "Ingredients / INCI: Aqua, Cetearyl Alcohol, Betaine, Glycerin, Distearoylethyl Dimonium Chloride, Parfum, Mica, Lactic Acid, Panthenol, Benzyl Alcohol, CI 77891, Sodium Benzoate, Hydrolyzed Wheat Protein, Potassium Sorbate, Limonene, Citrus Limon Peel Oil, Citrus Aurantium Peel Oil, Citral, Pinene, Linalool, Citronellol, Terpineol, Linalyl Acetate Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/apres-shampooing-citrus-cocktail.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-cheveu/apres-shampooing-citrus-cocktail"
  },
  {
    "slug": "shampooing-pour-cheveux-colores",
    "nom": "Shampooing pour cheveux colorés",
    "categorie": "soins-du-cheveu",
    "volume": "400 ml",
    "prix_ht": null,
    "prix_conseilles": {
      "milieu": 27,
      "bio": 42,
      "luxe": 54
    },
    "certifications": [
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Soigne les cheveux colorés",
      "Doux pour les cheveux",
      "Délicatement parfumé"
    ],
    "description": "Complément idéal à toute gamme de soins capillaires pour obtenir un aspect et une sensation dignes d'un salon de coiffure. Spécialement conçu pour les cheveux colorés.\n\nPurifie en douceur les cheveux, les laissant frais, lisses et brillants. Doux pour les cheveux colorés. Appliquer sur les cheveux humides et sur le cuir chevelu, faire mousser et rincer.",
    "ingredients": "Bétaïne, protéines de blé, jus d'aloès",
    "arome": "Arôme de zeste d'agrumes avec des notes légèrement amères de pamplemousse rouge et de pêche blanche sucrée sur un fond fruité",
    "inci": "Ingredients / INCI: Aloe Barbadensis (Aloe) Leaf Juice➀, Sodium Coco-Sulfate, Coco-Glucoside, Cocamidopropyl Betaine, Betaine, Sodium Chloride, Aqua, Glyceryl Oleate, Parfum, Lactic Acid, Citric Acid, Benzyl Alcohol, Brassica Alcohol, Hydrolyzed Wheat Protein, Sodium Benzoate, Brassicyl Isoleucinate Esylate, Potassium Sorbate, Limonene➁, Citrus Aurantium Bergamia Peel Oil, Citrus Aurantium Peel Oil, Citrus Limon Peel Oil, Linalyl Acetate➁, Citronellol➁, Pinene➁, Linalool➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 98% Origine biologique du total 7% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les ",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/shampooing-pour-cheveux-colores.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-cheveu/shampooing-pour-cheveux-colores",
    "status": "retired"
  },
  {
    "slug": "moisturising-conditioner",
    "code": "A5827",
    "nom": "Moisturising Conditioner",
    "categorie": "soins-du-cheveu",
    "volume": "290 ml",
    "prix_ht": 8.17,
    "prix_conseilles": {
      "milieu": 26,
      "bio": 42,
      "luxe": 54
    },
    "certifications": [
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Aide à réparer les pointes sèches",
      "Hydratant",
      "Lisse"
    ],
    "description": "Le revitalisant personnalisé nourrit les cheveux, les laissant lisses et faciles à coiffer. Infusé d'huile d'argan et de protéines de blé pour nourrir les pointes sèches et améliorer la texture des cheveux. Appliquer sur les pointes des cheveux, laisser agir 2 à 5 min. absorber et rincer.",
    "ingredients": "Jus d'aloès, Protéine de blé, Huile d'argan, Extrait de plante",
    "arome": "Fruits juteux et bois chauds",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Cetearyl Alcohol, Aqua, Glycerin, Distearoylethyl Dimonium Chloride, Betaine, Cocos Nucifera (Coconut) Oil➀, Sodium PCA, Parfum, Tocopherol, Butylene Glycol, Benzyl Alcohol, Guar Hydroxypropyltrimonium Chloride, Hydrolyzed Wheat Protein, Sodium Benzoate, Lactic Acid, Argania Spinosa (Argan) Kernel Oil➀, Potassium Sorbate, Crambe Maritima (Sea Kale) Leaf Extract, Citric Acid, Arctium Lappa (Burdock) Root Extract➀, Ginkgo Biloba (Gingko) Leaf Extract➀, Linalool➁, Limonene➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 98% Origine biologique du total 11% All Natural Vous ne trouverez aucun colorant artificiel, parfum synthétique, parabène ou sulfate dans nos produits de soin. Notre gamme de produits de beauté est certifiée biologique ou naturelle selon le référentiel international COSMOS par ECOCERT Greenlife. Nos formules de produits contiennent des ingrédients naturels issus de l’agriculture biologique et",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/moisturising-conditioner.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-cheveu/moisturising-conditioner"
  },
  {
    "slug": "shampooing-hydratant",
    "code": "A5826",
    "nom": "Shampooing hydratant",
    "categorie": "soins-du-cheveu",
    "volume": "290 ml",
    "prix_ht": 9.58,
    "prix_conseilles": {
      "milieu": 25,
      "bio": 40,
      "luxe": 52
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Certifié naturel"
    ],
    "star_features": [
      "Hydratant",
      "Doux pour les cheveux",
      "Effet lissant"
    ],
    "description": "Purifie les cheveux en douceur, les laissant frais et hydratés. Aide à conserver des cheveux lisses et brillants. Appliquer sur les cheveux et le cuir chevelu humides, faire mousser, puis rincer.",
    "ingredients": "Jus d’aloe vera, Extrait de plantes",
    "arome": "Fruits sucrés et bois chauds",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Lauryl Glucoside, Sodium Coco-Sulfate, Aqua/Water, Citric Acid, Disodium Cocoyl Glutamate, Sodium PCA, Coco-Glucoside, Glyceryl Oleate, Butylene Glycol, Parfum/Fragrance, Benzyl Alcohol, Sodium Cocoyl Glutamate, Sodium Benzoate, Glycerin, Potassium Sorbate, Crambe Maritima (Sea Kale) Leaf Extract, Ginkgo Biloba (Ginkgo) Leaf Extract➀, Arctium Lappa (Burdock) Root Extract➀, Linalool➁, Limonene➁. ➀ Ingrédient issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/shampooing-hydratant.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-cheveu/shampooing-hydratant"
  },
  {
    "slug": "creme-hydratante-alternative-au-retinol",
    "code": "S0045",
    "nom": "Crème hydratante alternative au rétinol",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 10.58,
    "prix_conseilles": {
      "milieu": 28,
      "bio": 44,
      "luxe": 57
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Alternative douce au rétinol",
      "réduit l'apparence des ridules"
    ],
    "description": "La crème hydratante alternative au rétinol est un produit indispensable dans toute gamme de soins anti-âge. Avec sa texture soyeuse et rapidement absorbée, elle apaise la peau tout en répondant aux besoins en solutions anti-âge avancées mais douces.\n\ncette crème hydratante légère offre des bienfaits anti-âge similaires à ceux du rétinol sans aucune irritation, aidant à réduire l'apparence des rides et des ridules. Elle est enrichie en extrait de Bidens Pilosa, une alternative naturelle au rétinol, ce qui en fait un choix doux mais efficace pour un usage quotidien. Elle hydrate en profondeur, nourrit et lisse la peau, pour un teint éclatant et rafraîchi. Appliquez une petite quantité sur le visage et le cou nettoyés, matin et/ou soir.",
    "ingredients": "Jus d'aloès Sodium PCA Vitamine C Acide hyaluronique Vitamine E Extrait de Bidens Pilosa (alternative au rétinol)",
    "arome": "Arôme de rose légèrement sucré avec une touche délicate de géranium rouge sur un fond vert et fruité",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin➁, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Aqua/Water, Sodium PCA, Dipalmitoyl Hydroxyproline, Astrocaryum Murumuru Seed Butter, Hippophae Rhamnoides (Sea Buckthorn) Fruit Extract➀, Gossypium Herbaceum Seed Oil, Propanediol, Bidens Pilosa Extract, Dicaprylyl Carbonate, Polyglyceryl-6 Behenate, Parfum/Fragrance, Linum Usitatissimum Seed Oil, Mangifera Indica (Mango) Seed Butter➀, Caprylic/Capric Triglyceride, Coco-Caprylate, Xanthan Gum, Octyldodecanol, Palmitic Acid, Stearic Acid, Tocopherol, Ascorbyl Palmitate, Potassium Hydroxide, Rhodomyrtus Tomentosa (Rose Myrtle) Fruit Extract, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Alteromonas Ferment Extract, Phenethyl Alcohol, Geraniol➂, Citronellol➂, Pelargonium Graveolens Flower Oil, Linalool➂, Citral➂ ➀Ingredients from organic Farming ➁Made using organic ingredients ➂From natural essential oils Origine naturelle",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-hydratante-alternative-au-retinol.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-hydratante-alternative-au-retinol"
  },
  {
    "slug": "protection-solaire-spf50-stick-avec-teinte",
    "code": "S0007",
    "nom": "Protection solaire SPF50 Stick, avec teinte",
    "categorie": "soins-du-visage",
    "volume": "12 g",
    "prix_ht": 8.67,
    "prix_conseilles": {
      "milieu": 28,
      "bio": 44,
      "luxe": 57
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Facile à utiliser",
      "protection solaire"
    ],
    "description": "Complétez votre gamme de produits solaires avec notre stick solaire minéral teinté SPF 50, conçu pour une protection performante et sans effort.\n\nCe stick solaire à base de minéraux offre une protection puissante à large spectre contre les UVA/UVB avec un SPF 50. Sa formule lisse et fondante glisse facilement, assurant une couverture uniforme pour tous les types de peau, y compris les zones sensibles. Parfait pour une application en déplacement, c'est un produit indispensable pour une protection solaire quotidienne. AVERTISSEMENT : Le stick ne garantit pas une protection à 100 %. L'exposition prolongée au soleil est une menace sérieuse pour la santé, évitez-la, même si vous utilisez un écran solaire.",
    "ingredients": "Huile de riz, huile de graines de tournesol, huile de jojoba",
    "arome": "Arôme vert et rafraîchissant de menthe avec des notes d'aloe vera, de nénuphar et de fleurs blanches sur fond de vanille douce et crémeuse",
    "inci": "Zinc Oxide, Oryza Sativa (Rice) Bran Oil, Vegetable Oil, Dicaprylyl Carbonate, Isoamyl Laurate, CI 77891 (Titanium Dioxide)③, Helianthus Annuus (Sunflower) Seed Wax, Oryza Sativa (Rice) Bran Wax, Rhus Succedanea Fruit Wax, Hydrated Silica, Simmondsia Chinensis (Jojoba) Seed Oil①, Silica, Jojoba Esters, Theobroma Cacao (Cocoa) Seed Butter①, Parfum/Fragrance, Tocopherol, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil①, Nigella Sativa (Black Cumin) Seed Oil①, CI 77491, CI 77492, CI 77499 (Iron Oxides)③, Glycolipids, Glycosphingolipids, Aqua/Water, Vanillin, Terpineol②, Linalyl Acetate②, Anethole②, Geraniol② ① Ingredients from organic farming ② From natural essential oils ③ Pure mineral pigments Origine naturelle du total 99% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les in",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/protection-solaire-spf50-stick-avec-teinte.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/protection-solaire-spf50-stick-avec-teinte"
  },
  {
    "slug": "nettoyant-visage-eclat-radieux",
    "code": "S0102",
    "nom": "Nettoyant visage éclat radieux",
    "categorie": "soins-du-visage",
    "volume": "145 ml",
    "prix_ht": 11.42,
    "prix_conseilles": {
      "milieu": 30,
      "bio": 48,
      "luxe": 62
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Nettoie en douceur",
      "rafraîchit",
      "revitalise et révèle l'éclat naturel"
    ],
    "description": "Le nettoyant visage Radiant Glow est un nettoyant quotidien rafraîchissant conçu pour les gammes de soins de la peau modernes axées sur une purification efficace mais douce. Développé pour répondre à la demande de formulations d'origine naturelle certifiées, il combine des propriétés nettoyantes et hydratantes, ce qui le rend adapté aux peaux normales et grasses.\n\nCe nettoyant visage dissout efficacement les impuretés, l'excès de sébum et les résidus de maquillage tout en préservant l'équilibre naturel de l'hydratation de la peau. Formulé à base de jus d'aloès, d'extraits de plantes et d'extrait de mûre, il aide à rafraîchir et à revitaliser le teint sans obstruer les pores. Le sodium PCA et la glycérine favorisent l'hydratation, laissant la peau propre et confortable. Faites mousser dans vos mains, appliquez sur le visage, massez doucement et rincez abondamment à l'eau. Une légère séparation peut se produire en raison de la formulation naturelle.",
    "ingredients": "Jus d'aloès extrait végétal extrait de baies",
    "arome": "fruité, floral, vert",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Coco-Glucoside, Cocamidopropyl Betaine, Glycerin, Aqua/Water, Xanthan Gum, Propanediol, Rubus Fruticosus (Blackberry) Fruit Extract➀, Sodium PCA, Sodium Levulinate, Lactic Acid, Acacia Senegal Gum, Sodium Anisate, Acorus Calamus (Sweet Flag) Root Extract➀, Parfum/Fragrance, Salvia Officinalis (Sage) Leaf Extract➀, Rhamnose, CI 77491 (Iron Oxides)➂, Glucose, Glucuronic Acid, Arctium Lappa (Burdock) Root Extract➀, Citric Acid, Sodium Benzoate, Potassium Sorbate, Linalool➁, Limonene➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 99% Origine biologique du total 10% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodive",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/nettoyant-visage-eclat-radieux.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/nettoyant-visage-eclat-radieux"
  },
  {
    "slug": "creme-de-nuit-pour-peaux-sensibles-sans-parfum",
    "code": "S0095",
    "nom": "Crème de nuit pour peaux sensibles, sans parfum",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 12.42,
    "prix_conseilles": {
      "milieu": 33,
      "bio": 52,
      "luxe": 67
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "apaise les irritations",
      "aide à réduire les rougeurs",
      "sans parfum"
    ],
    "description": "La crème de nuit pour peaux sensibles est un soin nocturne indispensable dans toute gamme de soins pour peaux sensibles. Dotée d'une formule douce et sans parfum et d'une texture apaisante, elle favorise la régénération nocturne de la peau tout en répondant à la demande croissante de produits hautement performants mais ultra-doux pour les peaux sensibles et sujettes aux rougeurs.\n\nCette crème de nuit apaisante est spécialement formulée pour calmer et hydrater les peaux sensibles pendant votre sommeil. Enrichie en jus d'aloe vera, elle aide à réduire les rougeurs et les irritations visibles, favorisant un teint plus équilibré et plus confortable au réveil. L'acide hyaluronique procure une hydratation longue durée, renforçant la barrière d'hydratation naturelle de la peau sans agresser les peaux délicates. Sa formule sans parfum convient à tous les types de peau, en particulier aux peaux sensibles et sujettes aux rougeurs. Appliquez 1 à 3 pompes sur le visage, le cou et le décolleté nettoyés chaque soir, en massant délicatement par mouvements ascendants. Au réveil, votre peau sera apaisée, hydratée et rafraîchie.",
    "ingredients": "Jus d'aloe vera Algues Acide hyaluronique",
    "arome": "Un arôme neutre et doux de base du produit",
    "inci": "INGREDIENTS / INCI: Aloe Barbadensis (Aloe) Leaf Juice➀, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin, Pentylene Glycol, Polyglyceryl-3 Stearate, Cetearyl Alcohol, Coco-Caprylate, Dicaprylyl Carbonate, Isoamyl Laurate, Aqua/Water, Hydrolyzed Rhodophyceae Extract, Mangifera Indica (Mango) Seed Butter➀, Cellulose, Caprylic/Capric Triglyceride, Xanthan Gum, Octyldodecanol, Potassium Hydroxide, Sodium Hyaluronate, Palmitic Acid, Stearic Acid, Tocopherol, Ascorbyl Palmitate, Sodium Phytate, Hydrolyzed Hyaluronic Acid ➀Ingredients from organic Farming ➁Made using organic ingredients Origine naturelle du total 99% Origine biologique du total 42% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiv",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-de-nuit-pour-peaux-sensibles-sans-parfum.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-de-nuit-pour-peaux-sensibles-sans-parfum"
  },
  {
    "slug": "masque-a-l-argile-pour-les-pores-et-les-points-noirs",
    "code": "S0092",
    "nom": "Masque à l'argile pour les pores et les points noirs",
    "categorie": "soins-du-visage",
    "volume": "90 ml",
    "prix_ht": 13.17,
    "prix_conseilles": {
      "milieu": 35,
      "bio": 55,
      "luxe": 71
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "Mélange d'argiles purifiantes",
      "absorbe l'excès de sébum"
    ],
    "description": "Le masque à l'argile pour les pores et les points noirs est un produit incontournable pour toute gamme de soins axée sur la purification et l'équilibre de la peau. Formulé à partir d'argiles riches en minéraux et d'actifs revitalisants, il répond à la demande de solutions efficaces mais douces qui traitent l'excès de sébum, les pores visibles et les points noirs sans dessécher la peau.\n\nCe masque purifiant à l'argile nettoie la peau en profondeur, absorbe l'excès de sébum et les impuretés tout en exfoliant en douceur pour éliminer les cellules mortes. Les argiles blanche et verte agissent ensemble pour affiner l'apparence des pores et aider à minimiser les points noirs, tandis que les algues aquatiques et un complexe biominerale favorisent la revitalisation et l'équilibre de la peau. Sa texture crémeuse et riche en minéraux laisse la peau propre, lisse et rafraîchie. Appliquez sur une peau propre, laissez agir pendant 5 à 10 minutes, puis rincez abondamment.",
    "ingredients": "Argile blanche Argile verte Algues aquatiques Complexe biominéral Jus d'aloe vera Extrait de feuilles de thé noir biologique Extrait de sauge biologique Extrait de concombre biologique",
    "arome": "Un arôme neutre de base avec une subtile nuance argileuse.",
    "inci": "Aloe Barbadensis Leaf Juice➀, Kaolin, Glycerin, Montmorillonite, Diatomaceous Earth, Butylene Glycol, Aqua/Water, Sodium PCA, Lactic Acid, Sodium Levulinate, Olea Europaea (Olive) Fruit Oil➀, Tocopherol, Xanthan Gum, Propanediol, Sodium Anisate, Glyceryl Caprylate, Charcoal Powder, Camellia Sinensis (Black Tea) Leaf Extract➀, Cucumis Sativus (Cucumber) Fruit Extract➀, Salvia Officinalis (Sage) Leaf Extract➀, [CI 77491, CI 77492, CI 77499 (Iron Oxides)]➁, Rhamnose, Glycolipids, Glucose, Glucuronic Acid ➀ Ingredients from Organic Farming ➁ Pure mineral pigments Origine naturelle du total 100% Origine biologique du total 16% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/masque-a-l-argile-pour-les-pores-et-les-points-noirs.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/masque-a-l-argile-pour-les-pores-et-les-points-noirs"
  },
  {
    "slug": "brume-visage-prebiotique-microbiome",
    "code": "A5932",
    "nom": "Brume Visage Prébiotique Microbiome",
    "categorie": "soins-du-visage",
    "volume": "100 ml",
    "prix_ht": 10.58,
    "prix_conseilles": {
      "milieu": 28,
      "bio": 44,
      "luxe": 57
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Hydrate et rafraîchit la peau",
      "Protège la barrière cutanée",
      "Effet calmant"
    ],
    "description": "Améliorez votre offre de soins avec cette brume pour le visage à base de prébiotiques, conçue pour hydrater, équilibrer et rafraîchir. Un complément polyvalent à toute gamme de soins modernes.\n\nFormule légère qui procure une sensation d'hydratation et de fraîcheur et aide à rétablir l'équilibre naturel de la peau. Infusée de prébiotiques, elle aide à protéger la barrière cutanée et à se défendre contre les agressions extérieures. Parfaite pour fixer le maquillage ou pour rafraîchir la peau en milieu de journée. À combiner avec : Parfait en duo avec notre sérum gelée aux prébiotiques. * La couleur de la brume peut varier (blanc ou transparent)",
    "ingredients": "Prébiotiques Acide hyaluronique",
    "arome": "Arôme de cardamome verte, de romarin et de galbanum avec des notes de poivre rose épicé, de gingembre et de menthe poivrée fraîche sur un fond boisé de cèdre.",
    "inci": "Aqua/Water, Alcohol①, Parfum/Fragrance, Betaine, Lactobacillus Ferment Lysate, Sodium PCA, Hydrolyzed Glycosaminoglycans, Glycerin, Propanediol, Potassium Hydroxide, Potassium Sorbate, Sodium Benzoate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Rhamnose, Glucose, Glucuronic Acid ①Made using organic ingredients Origine naturelle du total 99% Origine biologique du total 7% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS d",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/brume-visage-prebiotique-microbiome.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/brume-visage-prebiotique-microbiome"
  },
  {
    "slug": "protection-solaire-spf50-stick-sans-teinte",
    "code": "S0016",
    "nom": "Protection solaire SPF50 Stick, sans teinte",
    "categorie": "soins-du-visage",
    "volume": "12 g",
    "prix_ht": 8.67,
    "prix_conseilles": {
      "milieu": 28,
      "bio": 44,
      "luxe": 57
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Facile à utiliser",
      "protection solaire"
    ],
    "description": "Complétez votre gamme de produits solaires avec notre stick de protection solaire minérale SPF 50, conçu pour une protection performante et sans effort.\n\nCe stick solaire à base de minéraux offre une protection puissante à large spectre contre les UVA/UVB avec un SPF 50. Sa formule lisse et fondante glisse facilement, assurant une couverture uniforme pour tous les types de peau, y compris les zones sensibles. Parfait pour une application en déplacement, c'est un produit indispensable pour une protection solaire quotidienne. AVERTISSEMENT : Le stick ne garantit pas une protection à 100 %. L'exposition prolongée au soleil est une menace sérieuse pour la santé, évitez-la, même si vous utilisez un écran solaire.",
    "ingredients": "Huile de riz, huile de tournesol, huile de jojoba",
    "arome": "Arôme vert et rafraîchissant de menthe avec des notes d'aloe vera, de nénuphar et de fleurs blanches sur fond de vanille douce et crémeuse",
    "inci": "Zinc Oxide, Dicaprylyl Carbonate, Oryza Sativa (Rice) Bran Oil, Vegetable Oil, Isoamyl Laurate, CI 77891 (Titanium Dioxide)③, Helianthus Annuus (Sunflower) Seed Wax, Oryza Sativa (Rice) Bran Wax, Rhus Succedanea Fruit Wax, Hydrated Silica, Simmondsia Chinensis (Jojoba) Seed Oil①, Silica, Jojoba Esters, Theobroma Cacao (Cocoa) Seed Butter①, Parfum/Fragrance, Tocopherol, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil①, Nigella Sativa (Black Cumin) Seed Oil①, CI 77491, CI 77492, CI 77499 (Iron Oxides)③, Glycolipids, Glycosphingolipids, Aqua/Water, Vanillin, Terpineol②, Linalyl Acetate②, Anethole②, Geraniol② ① Ingredients from organic farming ② From natural essential oils ③ Pure mineral pigments Origine naturelle du total 98% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les in",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/protection-solaire-spf50-stick-sans-teinte.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/protection-solaire-spf50-stick-sans-teinte"
  },
  {
    "slug": "retinol-alternative-serum",
    "code": "S0046",
    "nom": "Sérum alternatif au rétinol",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 12.17,
    "prix_conseilles": {
      "milieu": 32,
      "bio": 51,
      "luxe": 66
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Alternative douce au rétinol",
      "réduit l'apparence des ridules"
    ],
    "description": "Complément indispensable à toute gamme de soins anti-âge, ce sérum alternatif au rétinol est à la fois puissant et doux. Il répond à la demande croissante de solutions anti-âge hautement performantes tout en offrant des résultats visibles qui embellissent la peau.\n\nCe sérum léger est conçu pour améliorer l'apparence de la peau en affinant son grain et en réduisant l'apparence des ridules et des taches brunes. Il est enrichi en extrait de Bidens Pilosa, une alternative naturelle au rétinol, en jus d'aloès, en huile de jojoba et en extrait de myrte rose pour offrir une hydratation en profondeur, un soutien antioxydant et une nutrition pour un teint rafraîchi et éclatant. Appliquez quelques gouttes sur le visage nettoyé matin et/ou soir.",
    "ingredients": "Jus d'aloès Sodium PCA Vitamine C Acide hyaluronique Vitamine E Extrait de Bidens Pilosa (alternative au rétinol) Huile de jojoba Extrait de myrte rose",
    "arome": "Arôme de rose légèrement sucré avec une touche délicate de géranium rouge sur un fond vert et fruité",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Glycerin➁, Simmondsia Chinensis (Jojoba) Seed Oil➀, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Propanediol, Dicaprylyl Carbonate, Astrocaryum Murumuru Seed Butter, Gossypium Herbaceum Seed Oil, Isoamyl Laurate, Bidens Pilosa Extract, Polyglyceryl-6 Behenate, Linum Usitatissimum Seed Oil, Parfum/Fragrance, Cellulose, Aqua/Water, Hippophae Rhamnoides (Sea Buckthorn) Fruit Extract➀, Lactic Acid, Xanthan Gum, Rhodomyrtus Tomentosa (Rose Myrtle) Fruit Extract, Caprylic/Capric Triglyceride, Rosa Canina (Rosehip) Fruit Oil➀, Mangifera Indica (Mango) Seed Butter➀, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Octyldodecanol, Tocopherol, Geraniol➂, Citronellol➂, Pelargonium Graveolens Flower Oil, Linalool➂, Citral➂ ➀Ingredients from organic Farming ➁Made using organic ingredients ➂From natural essential oils Origine naturelle du total 99% Origine biologique du total 24% Produits durables Les produits sont fabriqués à l'aid",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/retinol-alternative-serum.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/retinol-alternative-serum"
  },
  {
    "slug": "serum-contour-des-yeux-alternatif-au-retinol",
    "code": "S0044",
    "nom": "Sérum contour des yeux alternatif au rétinol",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": 11.08,
    "prix_conseilles": {
      "milieu": 29,
      "bio": 47,
      "luxe": 60
    },
    "certifications": [
      "Sans gluten",
      "Végétalien"
    ],
    "star_features": [
      "Alternative douce au rétinol",
      "réduit l'apparence des ridules"
    ],
    "description": "Une excellente solution pour répondre à la demande croissante de produits anti-âge efficaces mais doux. En incluant une alternative naturelle au rétinol, vous pouvez proposer un produit hautement performant sans les effets secondaires négatifs souvent associés au rétinol traditionnel.\n\nce sérum doux pour les yeux offre un soin puissant et ciblé pour la peau délicate du contour des yeux. Formulé à partir d'une alternative naturelle au rétinol, l'extrait de Bidens Pilosa, il atténue l'apparence des ridules, des pattes d'oie et des signes de fatigue sans l'irritation du rétinol traditionnel. Un mélange d'acide hyaluronique, de jus d'aloès, d'huile de jojoba et d'huile de ricin hydrate en profondeur le contour des yeux pour un regard frais et éclatant.",
    "ingredients": "Jus d'aloès Sodium PCA Vitamine C Acide hyaluronique Vitamine E Extrait de Bidens Pilosa (alternative au rétinol) Huile de jojoba Huile de ricin",
    "arome": "Arôme de rose légèrement sucré avec une touche délicate de géranium rouge sur un fond vert et fruité",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Glycerin➁, Coconut Alkanes, Pentylene Glycol, Aqua/Water, Simmondsia Chinensis (Jojoba) Seed Oil➀, Sodium PCA, Polyglyceryl-6 Stearate, Glyceryl Stearate Citrate, Borago Officinalis (Borage) Seed Oil➀, Caprylic/Capric Triglyceride, Dipalmitoyl Hydroxyproline, Ricinus Communis (Castor) Seed Oil, Astrocaryum Murumuru Seed Butter, Gossypium Herbaceum Seed Oil, Bidens Pilosa Extract, Linum Usitatissimum Seed Oil, Parfum/Fragrance, CI 77163 (Bismuth Chloride Oxide)➃, Polyglyceryl-6 Behenate, Rhus Verniciflua Peel Cera/Rhus Succedanea Fruit Cera, Xanthan Gum, Aesculus Hippocastanum (Horse Chestnut) Seed Extract, Cellulose, Tocopherol, Ascorbyl Palmitate, Potassium Hydroxide, Mangifera Indica (Mango) Seed Butter➀, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Octyldodecanol, Alteromonas Ferment Extract, Phenethyl Alcohol, Escin, Geraniol➂, Citronellol➂, Pelargonium Graveolens Flower Oil, Linalool➂, Citral➂ ➀Ingredients from organic Farmin",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-contour-des-yeux-alternatif-au-retinol.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/serum-contour-des-yeux-alternatif-au-retinol"
  },
  {
    "slug": "soin-cible-contre-les-taches-brunes-a-l-acide-kojique",
    "code": "S0020",
    "nom": "Soin ciblé contre les taches brunes, 1 % d'acide kojique",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": 10.08,
    "prix_conseilles": {
      "milieu": 27,
      "bio": 42,
      "luxe": 54
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Soins ciblés",
      "Éclaircissants"
    ],
    "description": "Le produit idéal pour toute gamme de soins axée sur la pigmentation et le teint irrégulier. Formulé avec 1 % d'acide kojique, il est conçu pour offrir à vos clients un teint visiblement plus lisse et plus uniforme. Cette formule vous permet d'offrir une solution ciblée qui renforce la confiance et répond à la demande croissante de produits efficaces et spécialisés.\n\nCe sérum puissant est conçu pour éclaircir l'apparence des taches brunes et des décolorations existantes, et prévenir la formation de nouvelles taches. Il agit pour améliorer le teint et rendre la peau visiblement plus lisse et plus uniforme. Axé sur des résultats ciblés, ce sérum est indispensable pour toutes les personnes qui cherchent à retrouver leur éclat et à obtenir un teint plus lumineux. Appliquez une petite quantité directement sur les taches brunes sur une peau propre et sèche, une fois par jour, le soir. Appliquez ensuite une crème hydratante et utilisez toujours un écran solaire pendant la journée pour protéger votre peau, car l'acide kojique peut augmenter la sensibilité au soleil.",
    "ingredients": "Vitamine C Vitamine E Huile d'argousier Extrait de romarin Sodium PCA Bétaïne Acide kojique",
    "arome": "Arôme d'agrumes verts avec des notes de zeste de citron et d'orange, de gingembre et de concombre frais sur un fond boisé de vétiver, de cèdre et de patchouli terreux.",
    "inci": "Aqua/Water, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin➁, Pentylene Glycol, Betaine, Isoamyl Laurate, Sodium PCA, Glyceryl Stearate Citrate, Kojic Acid, Sclerotium Gum, Parfum/Fragrance, Xanthan Gum, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil➀, Ascorbyl Palmitate, Tocopherol, Sodium Phytate, Capsicum Annuum (Paprika) Fruit Extract*, Potassium Hydroxide, Helianthus Annuus (Sunflower) Seed Oil➀, Rosmarinus Officinalis (Rosemary) Leaf Extract*, Limonene➂, Citrus Limon Peel Oil, Benzyl Salicylate➂, Citral➂, Pogostemon Cablin Oil, Citrus Aurantium Peel Oil, Juniperus Virginiana Oil, Linalool➂, Cedrus Atlantica Oil/Extract, Pinene➂ ➀Ingredients from organic Farming ➁Made using organic ingredients ➂From natural essential oils Origine naturelle du total 100% Origine biologique du total 8% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations ",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/soin-cible-contre-les-taches-brunes-a-l-acide-kojique.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/soin-cible-contre-les-taches-brunes-a-l-acide-kojique"
  },
  {
    "slug": "creme-pour-le-visage-anti-taches-brunes-a-l-acide-kojique",
    "code": "S0021",
    "nom": "Crème pour le visage anti-taches brunes à l'acide kojique",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 10.83,
    "prix_conseilles": {
      "milieu": 29,
      "bio": 46,
      "luxe": 58
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Soins ciblés",
      "Éclaircissants"
    ],
    "description": "Produit idéal pour toute gamme de soins axée sur la pigmentation et le teint irrégulier. Cette crème pour le visage hautement performante est un ajout stratégique à votre catalogue, vous permettant d'offrir une solution ciblée qui répond à la demande croissante de produits efficaces et spécialisés.\n\ncette crème pour le visage est conçue pour atténuer l'apparence des taches brunes et autres décolorations. Elle est formulée avec d'acide kojique, connu pour ses propriétés éclaircissantes. Enrichie en vitamine C, en extrait de romarin et en bétaïne, la crème apporte également un soutien antioxydant et une hydratation en profondeur pour aider la peau à être lisse, souple et éclatante. Appliquez uniformément sur le visage une ou deux fois par jour sur une peau propre et sèche, en insistant sur les zones présentant des taches brunes ou une décoloration. Utilisez toujours un écran solaire pendant la journée, car l'acide kojique peut augmenter la sensibilité au soleil.",
    "ingredients": "Vitamine C Vitamine E Huile d'argousier Extrait de romarin Sodium PCA Bétaïne Acide kojique",
    "arome": "Arôme d'agrumes verts avec des notes de zeste de citron et d'orange, de gingembre et de concombre frais sur un fond boisé de vétiver, de cèdre et de patchouli terreux.",
    "inci": "Aqua/Water, Glycerin➁, Simmondsia Chinensis (Jojoba) Seed Oil➀, Pentylene Glycol, Polyglyceryl-3 Stearate, Cetearyl Alcohol, Betaine, Sodium PCA, Coco-Caprylate, Isoamyl Laurate, Caprylic/Capric Triglyceride, Kojic Acid, Xanthan Gum, Parfum/Fragrance, Cellulose, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil➀, Tocopherol, Ascorbyl Palmitate, Sodium Phytate, Capsicum Annuum (Paprika) Fruit Extract➀, Potassium Hydroxide, Helianthus Annuus (Sunflower) Seed Oil➀, Rosmarinus Officinalis (Rosemary) Leaf Extract*, Limonene➂, Citrus Limon Peel Oil, Benzyl Salicylate➂, Citral➂, Pogostemon Cablin Oil, Citrus Aurantium Peel Oil, Juniperus Virginiana Oil, Linalool➂, Cedrus Atlantica Oil/Extract, Pinene➂ ➀Ingredients from organic Farming ➁Made using organic ingredients ➂From natural essential oils Origine naturelle du total 100% Origine biologique du total 8% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la sant",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-pour-le-visage-anti-taches-brunes-a-l-acide-kojique.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-pour-le-visage-anti-taches-brunes-a-l-acide-kojique"
  },
  {
    "slug": "demaquillant-biphasic",
    "code": "A5933",
    "nom": "Démaquillant BiPhasic, sans parfum",
    "categorie": "soins-du-visage",
    "volume": "100 ml",
    "prix_ht": 12.83,
    "prix_conseilles": {
      "milieu": 34,
      "bio": 54,
      "luxe": 69
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel",
      "Sans allergène sur l'étiquette",
      "Sans parfum"
    ],
    "star_features": [
      "Doux pour la peau",
      "élimine le maquillage et les impuretés"
    ],
    "description": "Cette formulation unique, aux propriétés nettoyantes à la fois douces et efficaces, sera un complément parfait à l'offre de toute marque de soins de la peau.\n\nDémaquillant à la composition biphasée unique, combinant une phase à base d'huile et une phase à base d'eau pour un démaquillage efficace et sans effort. Cette formulation sans parfum nettoie en douceur, apaise et laisse la peau hydratée.",
    "ingredients": "Jus d'aloès Extrait de fleur de camomille Extrait de fruit d'argousier Extrait de framboise Acide hyaluronique",
    "arome": "Sans parfum",
    "inci": "NGREDIENTS / INCI: Aloe Barbadensis (Aloe) Leaf Juice➀, Isoamyl Laurate, Coco-Caprylate/Caprate, Butylene Glycol, Glycerin➁, Coconut Alkanes, Sodium Chloride, Aqua, Sodium Levulinate, Tocopherol, Sodium Benzoate, Caprylyl/Capryl Glucoside, Lactic Acid, Sodium Phytate, Chamomilla Recutita (Camomile) Flower Extract➀, Hippophae Rhamnoides (Sea-Buckthorn) Fruit Extract➀, Rubus Idaeus (Raspberry) Fruit Extract➀, Capsicum Annuum (Paprika) Fruit Extract➀, Sodium Hyaluronate, Helianthus Annuus (Sunflower) Seed Oil➀, Citric Acid, Potassium Sorbate, Rosmarinus Officinalis (Rosemary) Leaf Extract➀ ➀ Ingredients from organic farming ➁ Made using organic ingredients Origine naturelle du total 99% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits so",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/demaquillant-biphasic.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/demaquillant-biphasic"
  },
  {
    "slug": "creme-hydratante-pour-peaux-sensibles",
    "code": "S0001",
    "nom": "Crème hydratante pour peaux sensibles, sans parfum",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 11.75,
    "prix_conseilles": {
      "milieu": 31,
      "bio": 49,
      "luxe": 63
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié biologique",
      "Sans allergène sur l'étiquette",
      "Sans parfum"
    ],
    "star_features": [
      "Calme les irritations",
      "réduit les rougeurs",
      "sans parfum"
    ],
    "description": "Cette crème hydratante pour peaux sensibles est un complément essentiel à toute ligne de soins destinée aux peaux délicates et sujettes aux rougeurs. Sa formule apaisante, sans parfum, procure une hydratation durable et calme les irritations, offrant ainsi le soin ultime aux peaux sensibles.\n\nNotre soin hydratant pour peaux sensibles est conçu pour calmer et hydrater les peaux les plus délicates. Spécialement formulée pour réduire les rougeurs et les irritations, cette crème hydratante douce offre un soulagement durable tout en renforçant la barrière naturelle de la peau. Légère mais profondément nourrissante, elle s'absorbe sans effort pour un fini confortable et non gras. Appliquer quotidiennement sur une peau propre pour des résultats optimaux et un teint apaisé et équilibré. Associez-les à notre crème pour le corps Sensitive Body Cream, à notre nettoyant visage et corps Sensitive Skin et à notre shampooing pour le cuir chevelu Sensitive Scalp pour créer une gamme de produits adaptés aux peaux sensibles.",
    "ingredients": "PCA de sodium, jus d'aloès, huile de jojoba, acide hyaluronique",
    "arome": "Sans parfum",
    "inci": "Ingredients / INCI: Aloe Barbadensis (Aloe) Leaf Juice➀, Glycerin, Simmondsia Chinensis (Jojoba) Seed Oil➀, Pentylene Glycol, Polyglyceryl-3 Stearate, Cetearyl Alcohol, Sodium PCA, Coco-Caprylate, Isoamyl Laurate, Caprylic/Capric Triglyceride, Aqua/Water, Hydrolyzed Rhodophyceae Extract, Octyldodecanol, Xanthan Gum, Cellulose, Irvingia Gabonensis Kernel Butter, Potassium Hydroxide, Sodium Hyaluronate, Hydrogenated Coco-Glycerides, Tocopherol, Ascorbyl Palmitate, Sodium Phytate, Hydrolyzed Hyaluronic Acid ➀Ingredients from organic farming Origine naturelle du total 100% Origine biologique du total 22% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans ",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-hydratante-pour-peaux-sensibles.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-hydratante-pour-peaux-sensibles"
  },
  {
    "slug": "creme-de-jour-anti-age-4",
    "code": "A5809-15",
    "nom": "Crème de jour anti-âge",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": 10.08,
    "prix_conseilles": {
      "milieu": 27,
      "bio": 42,
      "luxe": 54
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Acide hyaluronique",
      "Hydratation renforcée",
      "Texture luxueuse"
    ],
    "description": "Crème pour le visage de texture veloutée enrichie en actifs marins innovants qui contribuent à uniformiser la texture de la peau et à rendre celle-ci plus lisse au toucher. L’acide hyaluronique de poids moléculaires multiples contribue à stimuler l'hydratation de la peau et à favoriser la jeunesse de la peau. Les ridules semblent moins visibles, la peau paraît plus ferme et plus éclatante. Appliquer sur peau propre.",
    "ingredients": "Jus d’aloe vera, Huile de jojoba, Bétaïne, Beurre de karité, Extrait de baies, Extrait de fleurs, Huile d’avocat, Acide hyaluronique, Extrait de ferment d’alteromonas",
    "arome": "Mélisse aux douces notes florales",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin➁, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Betaine, Isoamyl Laurate, Aqua/Water, Butyrospermum Parkii (Shea) Butter➀, Parfum/Fragrance, Caprylic/Capric Triglyceride, Mica (CI 77019)➃, Polyglyceryl-6 Behenate, Cellulose, Palmitic Acid, Stearic Acid, Vaccinium Vitis-Idaea (Lingonberry) Fruit Extract➀, Xanthan Gum, Echinacea Purpurea (Coneflower) Flower/Leaf/Stem Extract➀, Ribes Nigrum (Blackcurrant) Fruit Extract➀, Sambucus Nigra (Elder) Flower Extract➀, Ascorbyl Palmitate, Persea Gratissima (Avocado) Oil➀, Tocopherol, Hydrolyzed Hyaluronic Acid, Potassium Hydroxide, Sodium Hyaluronate, Sodium Phytate, Alteromonas Ferment Extract, Phenethyl Alcohol, Magnesium Stearate, Alcohol➁, Benzyl Salicylate➂, Limonene➂, Citrus Aurantium Bergamia Peel Oil, Citrus Aurantium Peel Oil, Citral➂, Linalool➂, Linalyl Acetate➂, Pinene➂, Cananga Odorata Oil/Extract. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques ➂ Issu d'huiles essentielles naturelles ➃ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-de-jour-anti-age-4.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-de-jour-anti-age-4"
  },
  {
    "slug": "serum-perfecteur-de-pigment",
    "code": "A5876",
    "nom": "Sérum perfecteur de pigment",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 12.67,
    "prix_conseilles": {
      "milieu": 33,
      "bio": 53,
      "luxe": 68
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "sérum léger",
      "réduit l'apparence des taches brunes",
      "favorise un teint uniforme"
    ],
    "description": "Ce sérum clarifiant Pigment Perfecting Serum est le complément idéal à la gamme de produits de toute marque de soins de la peau. Il s'agit d'une solution ciblée pour réduire les taches irrégulières, unifier le teint et favoriser un teint radieux et sans imperfections.\n\nNotre sérum perfecteur de pigment est conçu pour réduire l'apparence des taches brunes et favoriser un teint uniforme. Sa formule légère hydrate et apaise tout en ciblant la pigmentation pour un teint plus lumineux. Son parfum ajoute une couche supplémentaire d'indulgence, avec des notes terreuses de racine de vétiver et de bois, complétées par un fond d'amande douce et sucrée. Appliquer quotidiennement sur une peau propre pour de meilleurs résultats. A combiner avec : Utiliser avec notre gel hydratant à la niacinamide et notre sérum à la vitamine C pour obtenir un teint plus uniforme.",
    "ingredients": "PCA de sodium, vitamine E",
    "arome": "Arôme boisé de vétiver avec des notes de fleurs blanches, d'amande douce et de vanille",
    "inci": "Ingredients / INCI: Aqua, Glycerin➁, Caprylic/Capric Triglyceride, Helianthus Annuus (Sunflower) Seed Oil➀, Pentylene Glycol, Cetearyl Alcohol, Sodium PCA, Glyceryl Stearate Citrate, Alpha-Arbutin, Astrocaryum Murumuru Seed Butter, Gossypium Herbaceum Seed Oil, Bidens Pilosa Extract, Cellulose, Linum Usitatissimum Seed Oil, Parfum, Xanthan Gum, Ascorbyl Palmitate, Lactic Acid, Ascophyllum Nodosum Extract, Sodium Phytate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Tocopherol, Limonene➂, Citrus Limon Peel Oil, Pogostemon Cablin Oil, Linalool➂, Juniperus Virginiana Oil, Cedrus Atlantica Oil/Extract, Pinene➂, Vanillin, Menthol➂, Citral➂, Beta-Caryophyllene➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 100% Origine biologique du total 23% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources na",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-perfecteur-de-pigment.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/serum-perfecteur-de-pigment"
  },
  {
    "slug": "exfoliant-liquide-a-lacide-glycolique",
    "code": "A5865",
    "nom": "Tonique exfoliant à l'acide glycolique",
    "categorie": "soins-du-visage",
    "volume": "250 ml",
    "prix_ht": 11.75,
    "prix_conseilles": {
      "milieu": 31,
      "bio": 49,
      "luxe": 63
    },
    "certifications": [],
    "star_features": [
      "Exfolie",
      "élimine les accumulations",
      "favorise l'apparition d'un teint plus uniforme"
    ],
    "description": "Intégrez notre exfoliant liquide à l'acide glycolique dans votre gamme de soins pour offrir une solution avancée pour une peau plus lisse et plus éclatante.\n\nSolution exfoliante douce enrichie en acide glycolique à 5 %, conçue pour éliminer les accumulations de peau et favoriser l'apparition d'un teint plus uniforme. Ses propriétés permettent à la peau d'apparaître plus lisse et plus lumineuse à chaque utilisation. Appliquer plusieurs fois par semaine le soir sur une peau propre et sèche. A combiner avec: Sensitive Oil-to-Milk Cleanser et Moisturising Day Cream. Utiliser ensuite pendant la journée la crème solaire minérale SPF30 pour le visage et le corps pour protéger la peau de l'exposition au soleil.",
    "ingredients": "Acide glycolique Hydroxyde de potassium Extrait de canneberge Extrait de Ligonberry",
    "arome": "Une fragrance douce et florale avec des notes délicates de rose fraîche",
    "inci": "INGREDIENTS / INCI: Aqua, Glycolic Acid, Glycerin, Potassium Hydroxide, Betaine, Sodium PCA, Sodium Levulinate, Phenethyl Alcohol, Sodium Benzoate, Vaccinium Macrocarpon (Cranberry) Fruit Extract ➀, Vaccinium Vitis-Idaea (Lingonberry) Fruit Extract ➀, Alcohol ➀ Ingredients from organic farming Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/exfoliant-liquide-a-lacide-glycolique.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/exfoliant-liquide-a-lacide-glycolique"
  },
  {
    "slug": "creme-de-jour-hydratante-3",
    "code": "A5807-15",
    "nom": "Crème de jour hydratante",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": 9.67,
    "prix_conseilles": {
      "milieu": 26,
      "bio": 41,
      "luxe": 52
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Hydratation Renforcée",
      "Acide Hyaluronique",
      "Texture Luxueuse"
    ],
    "description": "Cette crème pour le visage de texture soyeuse pénètre rapidement la peau et lui apporte hydratation et nutrition intenses. Formulée à l’acide hyaluronique de poids moléculaires multiples et au bisabolol apaisant pour une peau veloutée et pulpeuse tout au long de la journée. L'extrait de sorbier riche en antioxydants contribue à protéger contre les agressions environnementales et à préserver la jeunesse de la peau. Convient aux peaux normales à sèches. Appliquer sur peau propre.",
    "ingredients": "Jus d’aloe vera, Huile de jojoba, Bétaïne, Extrait de fleurs, Extrait de baies, Extrait de fruits, Acide hyaluronique",
    "arome": "Mélisse aux douces notes florales",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice, Caprylic/Capric Triglyceride, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin➁, Glyceryl Stearate Citrate, Pentylene Glycol, Cetearyl Alcohol, Betaine, Dicaprylyl Carbonate, Parfum, Palmitic Acid, Stearic Acid, Xanthan Gum, Bisabolol, Nasturtium Officinale (Watercress) Flower/Leaf Extract➀, Rubus Fruticosus (Blackberry) Fruit Extract➀, Sorbus Aucuparia (Rowan) Fruit Extract➀, Ascorbyl Palmitate, Rubus Idaeus (Raspberry) Seed Oil➀, Tocopherol, Aqua, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Potassium Hydroxide, Benzyl Salicylate➂, Limonene➂, Citral➂, Linalool➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 99% Origine biologique du total 22% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international C",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-de-jour-hydratante-3.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-de-jour-hydratante-3"
  },
  {
    "slug": "nettoyant-a-base-dhuile-et-de-lait-pour-peaux-sensibles",
    "code": "A5924",
    "nom": "Nettoyant à base d'huile et de lait pour peaux sensibles",
    "categorie": "soins-du-visage",
    "volume": "150 ml",
    "prix_ht": 13.83,
    "prix_conseilles": {
      "milieu": 37,
      "bio": 58,
      "luxe": 75
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié biologique"
    ],
    "star_features": [
      "texture huile-lait innovante",
      "convient aux peaux sensibles",
      "testé sous contrôle dermatologique"
    ],
    "description": "Texture nettoyante innovante 2 en 1 qui se transforme en gel huileux rosé en lait soyeux au contact de l'eau. Convient aux peaux sensibles et a été testé sous contrôle dermatologique. Idéal pour le démaquillage, même le plus épais, ou dans le cadre d'une double routine de nettoyage.\n\nLa texture riche et huileuse se transforme en lait soyeux et dissout le maquillage et les impuretés. Laisse la peau fraîche, douce et nourrie sans la déshydrater. Doux pour les peaux sèches et délicates. Appliquer sur la peau sèche ou humide, masser délicatement pour éliminer les impuretés, puis rincer à l'eau. Éviter le contact direct avec les yeux. A combiner avec: Pour le soin des peaux sensibles, associez-le au Nettoyant pour le visage et le corps et à la Crème riche nourrissante.",
    "ingredients": "Huile de tournesol Glycolipides Extrait de camomille Extrait d'argousier Extrait de mûre",
    "arome": "Arôme fruité de fleurs blanches avec une touche délicate de jasmin fleuri et de bois de santal crémeux sur un fond poudré doux et légèrement vert",
    "inci": "Ingredients / INCI: Caprylic/Capric Triglyceride, Glycerin, Helianthus Annuus (Sunflower) Seed Oil➀, Aqua, Sucrose Laurate, Sucrose Palmitate, Alcohol, Tocopherol, Mica (CI 77019), Parfum, Chamomilla Recutita (Camomile) Flower Extract➀, Hippophae Rhamnoides (Sea Buckthorn) Fruit Extract➀, Rubus Chamaemorus (Cloudberry) Fruit Extract➀, CI 77491 (Iron Oxides), Glycolipids, Limonene, Linalyl Acetate ➀ Ingredients from organic farming Origine naturelle du total 100% Origine biologique du total 39% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matéria",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/nettoyant-a-base-dhuile-et-de-lait-pour-peaux-sensibles.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/nettoyant-a-base-dhuile-et-de-lait-pour-peaux-sensibles"
  },
  {
    "slug": "gel-visage-au-zinc-sans-huile-pour-hommes",
    "code": "A5930",
    "nom": "Gel visage au zinc sans huile pour hommes",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 13.08,
    "prix_conseilles": {
      "milieu": 35,
      "bio": 55,
      "luxe": 71
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Enrichi en zinc favorisant le collagène",
      "il pénètre facilement dans la peau"
    ],
    "description": "Crème hydratante simple et facile à utiliser, destinée au public masculin. Complément idéal à toute routine de soins de la peau, que ce soit en tant que produit autonome ou en tant que complément à un assortiment existant de produits de soins pour hommes.\n\nCette crème hydratante a la consistance d'un gel sans huile qui ne laisse pas de sensation d'épaisseur ou de lourdeur sur la peau. Le produit est rapidement absorbé et procure une hydratation instantanée. Le zinc, qui favorise le collagène, aide la peau à conserver son aspect jeune et frais. Appliquer sur une peau propre. Conçu pour convenir à une variété de types de peau, des peaux grasses aux peaux normales et mixtes. A combiner avec: Convient à l'huile à barbe adoucissante. Pour une routine complète de soins pour hommes, nous recommandons d'ajouter le Nettoyant corps et cheveux 2-en-1 à l'assortiment ainsi que la Crème anti-âge pour les yeux.",
    "ingredients": "Jus d'aloès, zinc, acide hyaluronique",
    "arome": "Arôme d'agrumes verts avec des notes fraîches de thé vert et de fleurs blanches sur fond de bois de cèdre et de vétiver",
    "inci": "Ingredients / INCI: Aloe Barbadensis (Aloe) Leaf Juice➀, Glycerin➁, Pentylene Glycol, Butylene Glycol, Betaine, Sclerotium Gum, Zinc PCA, Aqua, Propanediol, Parfum, Nasturtium Officinale (Watercress) Flower/Leaf Extract➀, Sodium Phytate, Potassium Hydroxide, Sodium Hyaluronate, Rhamnose, Glucose, Glucuronic Acid, Limonene➂, Linalool➂, Geraniol➂, Citral➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 100% Origine biologique du total 27% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués ",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-visage-au-zinc-sans-huile-pour-hommes.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/gel-visage-au-zinc-sans-huile-pour-hommes"
  },
  {
    "slug": "creme-visage-a-lacide-hyaluronique-pour-hommes",
    "code": "A5929",
    "nom": "Crème visage à l'acide hyaluronique pour hommes",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 13.33,
    "prix_conseilles": {
      "milieu": 35,
      "bio": 56,
      "luxe": 72
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Hydrate",
      "calme la peau",
      "rafraîchit"
    ],
    "description": "Crème hydratante simple et facile à utiliser, destinée au public masculin. Complément idéal à toute routine de soins de la peau, que ce soit en tant que produit autonome ou en tant que complément à un assortiment existant de produits de soins pour hommes.\n\nCette crème hydratante a une texture veloutée et légère qui pénètre sans effort et procure une hydratation instantanée. Formulé avec de l'acide hyaluronique à poids moléculaire multiple et un mélange d'ingrédients naturels puissants pour protéger et hydrater. Le Bisabolol apaisant aide à calmer la peau après le rasage. Appliquer sur une peau propre. Conçu pour convenir à une variété de types de peau, de la peau normale à la peau sèche. A combiner avec: Convient à l'huile à barbe adoucissante. Pour une routine complète de soins pour hommes, nous recommandons d'ajouter le Nettoyant corps et cheveux 2-en-1 à l'assortiment ainsi que la Crème pour les yeux anti-âge.",
    "ingredients": "Jus d'aloès, huile de jojoba, bétaïne, acide hyaluronique",
    "arome": "Fraîcheur du concombre avec une touche délicate de citron, de thym vert et d'écorce d'agrume douce-amère",
    "inci": "Ingredients / INCI: Aloe Barbadensis (Aloe) Leaf Juice, Caprylic/Capric Triglyceride, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin➁, Glyceryl Stearate Citrate, Pentylene Glycol, Cetearyl Alcohol, Betaine, Dicaprylyl Carbonate, Parfum, Palmitic Acid, Stearic Acid, Xanthan Gum, Bisabolol, Nasturtium Officinale (Watercress) Flower/Leaf Extract➀, Rubus Fruticosus (Blackberry) Fruit Extract➀, Sorbus Aucuparia (Rowan) Fruit Extract➀, Ascorbyl Palmitate, Rubus Idaeus (Raspberry) Seed Oil➀, Tocopherol, Aqua, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Potassium Hydroxide, Benzyl Salicylate➂, Limonene➂, Citral➂, Linalool➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 99% Origine biologique du total 22% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulat",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-visage-a-lacide-hyaluronique-pour-hommes.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-visage-a-lacide-hyaluronique-pour-hommes"
  },
  {
    "slug": "huile-a-barbe-adoucissante",
    "code": "A5927",
    "nom": "Huile à barbe adoucissante",
    "categorie": "soins-du-visage",
    "volume": "20 ml",
    "prix_ht": 11.33,
    "prix_conseilles": {
      "milieu": 30,
      "bio": 48,
      "luxe": 61
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié biologique"
    ],
    "star_features": [
      "Adoucit la barbe",
      "Pénètre facilement",
      "Facilite le coiffage"
    ],
    "description": "La formule non grasse de l'huile à barbe adoucissante sera l'ajout parfait à toute collection de produits de soins pour hommes ou à utiliser dans les salons de coiffure. Conçue à partir d'un mélange d'huiles naturelles de première qualité, elle offre des résultats de niveau professionnel et une expérience rafraîchissante et énergisante. Améliorez l'expérience de toilettage de vos clients et offrez-leur l'expérience d'une barbe bien conditionnée et impeccablement coiffée.\n\nAbsorbe rapidement, laissant la barbe lisse et plus douce au toucher. Enrichi avec 1% de Cannabidiol pour calmer la peau sous-jacente et fournir un effet réconfortant. Déposer quelques gouttes dans les paumes et appliquer sur la barbe. A combiner avec: Crème visage à l'acide hyaluronique ou Gel visage au zinc sans huile comme base avant d'appliquer l'Huile à barbe adoucissante. Pour une routine complète de soins pour hommes, nous recommandons d'ajouter le Nettoyant corps et cheveux 2-en-1 à l'assortiment ainsi que la Crème anti-âge pour les yeux.",
    "ingredients": "Huile de graines de chanvre, Cannabidiol",
    "arome": "Arôme de fougère aromatique avec des notes douces d'orange, de bergamote et de lavande sur fond de coumarine douce et de mousse de chêne tendre",
    "inci": "Ingredients / INCI: Cannabis Sativa (Hemp) Seed Oil➀, Decyl Cocoate, Undecane, Tridecane, Cannabidiol - Derived From Extract Or Tincture Or Resin Of Cannabis, Tocopherol, Parfum, Limonene➁, Linalool➁, Citral➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 100% Origine biologique du total 62% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés. Ecocert COSMOS Organic Certifié COSMOS ORGANIC Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/huile-a-barbe-adoucissante.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/huile-a-barbe-adoucissante"
  },
  {
    "slug": "serum-collagene-boost",
    "code": "A5879",
    "nom": "Sérum éclat jeunesse",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 13.5,
    "prix_conseilles": {
      "milieu": 36,
      "bio": 57,
      "luxe": 73
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Texture innovante à absorption rapide",
      "Reconstitue l'hydratation"
    ],
    "description": "Que vous soyez une adepte des soins de la peau ou que vous ayez une approche minimaliste, ce sérum s'intégrera sans difficulté dans votre routine quotidienne. Il constitue un excellent complément à votre routine de soins pour donner à votre peau un aspect plus lisse et plus rebondi, tout en lui procurant une sensation de confort et d'hydratation. Il peut également être utilisé pendant les procédures de beauté.\n\napporte à votre peau l'hydratation dont elle a tant besoin et une dose d'actifs puissants qui contribuent à lui donner une apparence plus jeune. La peau paraît plus lisse et plus ferme. La texture légère et rapidement absorbée laisse la peau fraîche et fraîche. Appliquer sur une peau propre. Combiner avec : pour des résultats optimaux, ajouter la crème de jour anti-âge et la crème lissante pour les yeux à la routine de soins de la peau.",
    "ingredients": "PCA de sodium, acide hyaluronique, huile de tournesol",
    "arome": "Arôme élégant et poudré d'iris avec une touche de violette sur un fond musqué et boisé doux",
    "inci": "Ingredients / INCI: Aqua, Glycerin➁, Caprylic/Capric Triglyceride, Helianthus Annuus (Sunflower) Seed Oil➀, Pentylene Glycol, Cetearyl Alcohol, Glyceryl Stearate Citrate, Sodium PCA, Cellulose, Parfum, Hydrolyzed Hyaluronic Acid, Xanthan Gum, Glyceryl Caprylate, Nasturtium Officinale (Watercress) Flower/Leaf Extract➀, Sambucus Nigra (Elder) Fruit Extract➀, Ascorbyl Palmitate, Sodium Hyaluronate, Sodium Phytate, Potassium Hydroxide, Linalool➂, Geraniol➂, Citronellol➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 100% Origine biologique du total 23% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pa",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-collagene-boost.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/serum-collagene-boost"
  },
  {
    "slug": "creme-de-nuit-anti-age-au-collagene",
    "code": "A5877",
    "nom": "Crème de nuit anti-âge",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 14.42,
    "prix_conseilles": {
      "milieu": 38,
      "bio": 61,
      "luxe": 78
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Pour une peau plus rebondie et plus douce",
      "Réduit l'apparence des ridules"
    ],
    "description": "Un excellent complément à la crème de jour anti-âge pour une routine de soins anti-âge complète. Parfait pour compléter l'assortiment de soins existant ou pour être proposé comme un seul produit de soin anti-âge de haute performance.\n\nCrème de nuit formulée pour réduire les signes de l'âge et révéler une peau plus rebondie, plus ferme et d'apparence plus saine. Sa texture douce et riche s'absorbe sans effort et se superpose facilement à d'autres produits de soin. Grâce à un extrait innovant de plancton marin, la crème agit pendant la nuit pour révéler une peau plus ferme et plus lisse le matin. Le pouvoir nourrissant des beurres de cacao et de karité assure une hydratation en profondeur. Appliquer le soir sur une peau propre. A combiner avec : Sérum hydratant ou Sérum à l'huile alternative au rétinol naturel et Crème lissante pour les yeux pour une routine nocturne anti-âge complète. En outre, utilisez la crème de jour anti-âge lors de votre routine de soins du matin.",
    "ingredients": "Jus de feuille d'aloès, Sodium PCA, huile de graines de tournesol, beurre de cacao, beurre de karité.",
    "arome": "Arôme floral et doux de nénuphar et de jasmin blanc avec une touche de menthe poivrée et de vanille.",
    "inci": "INGREDIENTS / INCI: Aloe Barbadensis (Aloe) Leaf Juice➀, Helianthus Annuus (Sunflower) Seed Oil➀, Theobroma Cacao (Cocoa) Seed Butter➀, Dicaprylyl Carbonate, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Helianthus Annuus (Sunflower) Seed Cera, Butyrospermum Parkii (Shea) Butter➀, Aqua/Water, Glycerin➁, Olea Europaea (Olive) Oil Unsaponifiables, Sodium PCA, Parfum/Fragrance, Palmitic Acid, Stearic Acid, Polyglyceryl-6 Behenate, Rhus Verniciflua Peel Cera, Shorea Robusta Resin, Cellulose, Xanthan Gum, Algae Extract, Nasturtium Officinale (Watercress) Flower/Leaf Extract➀, Sambucus Nigra (Elder) Fruit Extract➀, Sodium Phytate, Alteromonas Ferment Extract, Phenethyl Alcohol, Ascorbyl Palmitate, Tocopherol, Lactic Acid, Sodium Hyaluronate, Vanillin, Terpineol➂, Linalyl Acetate➂ ➀ Ingredients from Organic Farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 99% Origine biologique du total 26% Produits durables Les produits sont fab",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-de-nuit-anti-age-au-collagene.jpg",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-de-nuit-anti-age-au-collagene"
  },
  {
    "slug": "creme-de-nuit-hydratante-au-ceramide",
    "code": "A5923",
    "nom": "Crème de nuit Ceramide Barrier",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 14.42,
    "prix_conseilles": {
      "milieu": 38,
      "bio": 61,
      "luxe": 78
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "Hydrate en profondeur",
      "Soutient la barrière cutanée"
    ],
    "description": "Les crèmes de nuit jouent un rôle crucial en soutenant le processus naturel de rajeunissement de la peau pendant la nuit. C'est pourquoi elles constituent l'une des catégories de produits les plus populaires et seront un excellent complément à toute ligne de produits de soins de la peau.\n\nLa crème de nuit hydratante au céramide est soigneusement formulée avec des ingrédients qui agissent pendant la nuit, favorisant le renouvellement de la peau et lui donnant un éclat radieux. La formule hydratante glisse sans effort sur la peau et offre un rajeunissement complet de la peau pendant le sommeil. Les céramides aident à soutenir la barrière cutanée naturelle et donnent à votre peau une apparence saine le matin. Appliquer le soir sur une peau propre. À combiner avec: Peptide Anti-Ageing Serum ou Nourishing Facial Oil et Smoothing Eye Cream pour une routine nocturne complète. En outre, utilisez la Crème de Jour Hydratante lors de votre routine de soin du matin.",
    "ingredients": "Céramides, jus d'aloès, huile de jojoba, huile de tournesol, beurre de cacao, beurre de karité, Sodium PCA, acide hyaluronique.",
    "arome": "Arôme délicat de fleurs blanches avec des notes de lavande aromatique et fraîche sur fond herbacé.",
    "inci": "Ingredients / INCI: Aloe Barbadensis (Aloe) Leaf Juice➀, Theobroma Cacao (Cocoa) Seed Butter➀, Simmondsia Chinensis (Jojoba) Seed Oil➀, Helianthus Annuus (Sunflower) Seed Oil➀, Dicaprylyl Carbonate, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Glycerin➁, Helianthus Annuus (Sunflower) Seed Cera, Butyrospermum Parkii (Shea) Butter➀, Olea Europaea (Olive) Oil Unsaponifiables, Sodium PCA, Palmitic Acid, Stearic Acid, Polyglyceryl-6 Behenate, Parfum, Cellulose, Rhus Verniciflua Peel Cera / Rhus Succedanea Fruit Cera, Shorea Robusta Resin, Hippophae Rhamnoides (Sea Buckthorn) Fruit Extract➀, Xanthan Gum, Paeonia Lactiflora (Peony) Root Extract, Sambucus Nigra (Elder) Fruit Extract➀, Vaccinium Macrocarpon (Cranberry) Seed Oil➀, Glycosphingolipids, Glycolipids, Aqua, Sodium Phytate, Ascorbyl Palmitate, Tocopherol, Lactic Acid, Sodium Hyaluronate, Linalool➂, Limonene➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine nature",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-de-nuit-hydratante-au-ceramide.jpg",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-de-nuit-hydratante-au-ceramide"
  },
  {
    "slug": "huile-visage-nourrissante-3",
    "code": "A5818-30",
    "nom": "Huile visage nourrissante",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 12.67,
    "prix_conseilles": {
      "milieu": 33,
      "bio": 53,
      "luxe": 68
    },
    "certifications": [
      "Sans gluten",
      "Végétalien",
      "Certifié biologique"
    ],
    "star_features": [
      "Certifiée biologique",
      "Vegan",
      "Nourrissante"
    ],
    "description": "Cet incroyable mélange de 11 huiles et extraits certifiés biologiques apporte la cure de nutriments et de vitamines dont votre peau a besoin pour un teint sain et éclatant. Nourrit intensément, laissant la peau douce et revitalisée. Appliquer sur peau propre. Éviter tout contact direct avec les yeux.",
    "ingredients": "Huile de jojoba, Extrait de baies, Huile d’argan, Huile d’avocat",
    "arome": "Fruits secs orientaux et notes épicées",
    "inci": "Simmondsia Chinensis (Jojoba) Seed Oil➀, Decyl Cocoate, Solanum Lycopersicum (Tomato) Fruit Extract➀, Hippophae Rhamnoides (Sea Buckthorn) Fruit Extract➀, Undecane, Tridecane, Argania Spinosa (Argan) Kernel Oil➀, Rubus Chamaemorus (Cloudberry) Fruit Extract➀, Tocopherol, Persea Gratissima (Avocado) Oil➀, Prunus Amygdalus (Almond) Dulcis Oil➀, Prunus Armeniaca (Apricot) Kernel Oil➀, Parfum, Borago Officinalis (Borage) Seed Oil➀, Oenothera Biennis (Evening Primrose) Oil➀, Prunus Domestica (Plum) Seed Oil, Vaccinium Myrtillus (Blueberry) Seed Oil➀, Linalool➁, Limonene➁, Citronellol➁, Geraniol➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 100% Origine biologique du total 63% All Natural Vous ne trouverez aucun colorant artificiel, parfum synthétique, parabène ou sulfate dans nos produits de soin. Notre gamme de produits de beauté est certifiée biologique ou naturelle selon le référentiel international COSMOS par ECOCERT Greenlife. Nos formules",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/huile-visage-nourrissante-3.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/huile-visage-nourrissante-3"
  },
  {
    "slug": "soin-anti-acne",
    "code": "A5851",
    "nom": "Acne Spot Care (édition limitée)",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": 8.83,
    "prix_conseilles": {
      "milieu": 29,
      "bio": 46,
      "luxe": 58
    },
    "certifications": [],
    "star_features": [
      "Réduit les rougeurs autour de l'imperfection",
      "Apporte un soulagement à la peau"
    ],
    "description": "Contribue à apaiser la peau et à réduire les rougeurs associées aux imperfections. Les ingrédients antibactériens tels que l’acide salicylique et l’huile d'arbre à thé confèrent à la peau un aspect lumineux et sain. Appliquez une petite quantité de produit sur une peau propre, directement sur l’imperfection.",
    "ingredients": "2% Acide salicylique, 3% Huile d'arbre à thé, Jus de feuille d'aloès, Kaolin (Argile blanche), Huile d'argan, PCA de sodium, Extrait de myrte rose, Extrait de groseille à maquereau, Extrait de myrtille, Poudre de charbon",
    "arome": "Arôme frais d'arbre à thé avec des notes herbacées et terrestres",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Glycerin, Kaolin, Argania Spinosa (Argan) Kernel Oil➀, Melaleuca Alternifolia (Tea Tree) Leaf Oil➀, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Isoamyl Laurate, Salicylic Acid, Sodium PCA, Propanediol, Potassium Hydroxide, Xanthan Gum, Polyglyceryl-6 Behenate, Parfum/Fragrance, Cellulose, Palmitic Acid, Stearic Acid, Aqua/Water, Rhodomyrtus Tomentosa (Rose Myrtle) Fruit Extract, Ribes Grossularia (Gooseberry) Fruit Extract➀, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Ascorbyl Palmitate, Tocopherol, Charcoal Powder, Limonene, Citral, Linalool, Citronellol, Geraniol ➀ Ingredients from organic farming All Natural Vous ne trouverez aucun colorant artificiel, parfum synthétique, parabène ou sulfate dans nos produits de soin. Notre gamme de produits de beauté est certifiée biologique ou naturelle selon le référentiel international COSMOS par ECOCERT Greenlife. Nos formules de produits contiennent des ingrédients naturels issus de l’a",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/soin-anti-acne.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/soin-anti-acne"
  },
  {
    "slug": "concentre-peeling-aha",
    "code": "A5835",
    "nom": "Concentré Peeling AHA",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 11.75,
    "prix_conseilles": {
      "milieu": 31,
      "bio": 49,
      "luxe": 63
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "Effet lissant",
      "Exfoliant hydratant",
      "Apporte de l’éclat"
    ],
    "description": "Enrichi en acide lactique, il contribue à éliminer les cellules mortes et à favoriser le renouvellement cellulaire, révélant ainsi une peau fraîche et éclatante. Améliore l’aspect des peaux ternes et fatiguées, atténue les taches pigmentaires et les ridules. L’acide hyaluronique veille à ce que votre peau reste hydratée et souple tout au long du processus d’exfoliation. Appliquez le soir sur une peau préalablement nettoyée et laissez agir toute la nuit. Utilisation 1 à 2 fois par semaine. Évitez l’exposition directe au soleil après utilisation. Veillez à toujours utiliser une protection solaire.",
    "ingredients": "10% Acide lactique, 1% Acide hyaluronique, Extrait de sauge, Extrait de thé blanc",
    "arome": "Arôme légèrement sucré",
    "inci": "Aqua/Water, Lactic Acid, Pentylene Glycol, Potassium Hydroxide, Butylene Glycol, Glycerin➁, Sodium Hyaluronate, Camellia Sinensis (White Tea) Leaf Extract➀, Salvia Officinalis (Sage) Leaf Extract➀ ➀ Ingredients from organic farming ➁ Made using organic ingredients Origine naturelle du total 100% Origine biologique du total 2% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international COSMOS-standard by ECOCERT Greenlife. Our product formulas contain natural ingredients sourced in organic farming and organic plant-based ingredients. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natural-and-organic-cosmetics-cosmos",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/concentre-peeling-aha.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/concentre-peeling-aha"
  },
  {
    "slug": "sérum-peptidique",
    "code": "A5848",
    "nom": "Sérum anti-âge aux peptides",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 13.08,
    "prix_conseilles": {
      "milieu": 35,
      "bio": 55,
      "luxe": 71
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Améliore la barrière cutanée",
      "Booste l'élasticité",
      "Riche en antioxydants"
    ],
    "description": "Offrez à vos clients une formule luxueuse de sérum peptidique à base d'acide hyaluronique et d'extrait de ginkgo. Ce sérum luxueux aide à atténuer l'apparence des rides et ridules, permettant à vos clients de profiter d'une peau plus lisse, plus ferme et plus raffinée.\n\nSérum lissant pour la peau, enrichi d'ingrédients anti-âge de haute performance pour donner à la peau un aspect plus rebondi et favoriser son élasticité. L'huile de graines de myrtille riche en antioxydants et les extraits de ginkgo assurent une protection, tandis que les peptides et l'acide hyaluronique contribuent à atténuer les rides. Appliquer sur une peau propre.",
    "ingredients": "Hydroxyproline, Peptides, Phytostérols, Jus d’aloe vera, Sodium PCA, Acide hyaluronique, Huile de graines de fraise, Huile de graines de myrtille, Extrait de feuilles de ginkgo",
    "arome": "Délicat arôme floral fantastique avec des notes d'ambre sur un fond doux et poudré",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Glycerin, Simmondsia Chinensis (Jojoba) Seed Oil➀, Aqua/Water, Pentylene Glycol, Cetearyl Alcohol, Sodium PCA, Isoamyl Laurate, Glyceryl Stearate Citrate, Dipalmitoyl Hydroxyproline, Propanediol, Parfum/Fragrance, Caprylic/Capric Triglyceride, Fragaria Ananassa (Strawberry) Seed Oil, Vaccinium Myrtillus (Blueberry) Seed Oil➀, Xanthan Gum, Hexapeptide-11, Phytosterols, Ricinus Communis (Castor) Seed Oil➀, Ascorbyl Palmitate, Hydrolyzed Hyaluronic Acid, Potassium Hydroxide, Sodium Hyaluronate, Sodium Phytate, Tocopherol, Leuconostoc/Radish Root Ferment Filtrate, Ginkgo Biloba Leaf Extract, CI 77491 (Iron Oxides)➁, Citric Acid, Sodium Benzoate, Potassium Sorbate, Glycolipids, Linalool➂, Geraniol➂, Citronellol➂ ➀ Ingredients from organic farming ➁ Pure mineral pigments ➂ From natural essential oils Origine naturelle du total 99% Origine biologique du total 20% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfa",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-peptidique.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/sérum-peptidique"
  },
  {
    "slug": "serum-a-la-vitamine-c",
    "code": "A5857",
    "nom": "Sérum à la vitamine C",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 12.83,
    "prix_conseilles": {
      "milieu": 34,
      "bio": 54,
      "luxe": 69
    },
    "certifications": [
      "Sans gluten",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Avec une forme stabilisée de Vitamine C naturelle"
    ],
    "description": "Sérum léger qui éclaircit et unifie le teint. L’acide férulique raffermit la peau, tandis que l’acide hyaluronique stimule son hydratation. Les huiles nourrissantes adoucissent la peau pour révéler un teint éclatant à l’apparence plus jeune. Appliquez le produit sur une peau préalablement nettoyée.",
    "ingredients": "2% Vitamine C naturelle (Ascorbylglucoside), 1% Acide férulique, 1% Huile de pépins de bourdaine, Vitamine E, Huile de graines de jojoba, Huile d'amande, Huile d'avocat, Huile de graines de rose musquée, PCA de sodium, Acide hyaluronique.",
    "arome": "Arôme doux et juteux de mandarine avec des notes délicates florales et d'agrumes",
    "inci": "In the EU: Aqua/Water, Glycerin➁, Cetearyl Alcohol, Simmondsia Chinensis (Jojoba) Seed Oil➀, Pentylene Glycol, Butylene Glycol, Ascorbyl Glucoside, Glyceryl Stearate Citrate, Sodium PCA, Polyglyceryl-6 Stearate, Caprylic/Capric Triglyceride, Ferulic Acid, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil➀, Tocopherol, Coco-Caprylate/Caprate, Dicaprylyl Carbonate, Isoamyl Laurate, Triheptanoin, Potassium Hydroxide, Prunus Amygdalus Dulcis (Sweet Almond) Oil➀, Parfum/Fragrance, Cellulose, Sodium Citrate, Xanthan Gum, Polyglyceryl-6 Behenate, Persea Gratissima (Avocado) Oil➀, Rosa Canina (Rosehip) Fruit Oil➀, Ascorbyl Palmitate, Ricinus Communis (Castor) Seed Oil➀, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Citric Acid, Limonene➂, Citrus Aurantium Peel Oil, Geranyl Acetate➂, Citrus Limon Peel Oil, Linalool➂, Pinene➂, Geraniol➂, Pelargonium Graveolens Flower Oil, Citronellol➂, Vanillin, Beta-Caryophyllene➂, Carvone➂ ➀ Ingredients from organic farming ➁ Made using organic ",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-a-la-vitamine-c.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/serum-a-la-vitamine-c"
  },
  {
    "slug": "protection-solaire-spf-30-pour-visage-corps",
    "nom": "Protection solaire SPF 30 pour Visage & Corps",
    "categorie": "soins-du-visage",
    "volume": "150 ml",
    "prix_ht": null,
    "prix_conseilles": {
      "milieu": 42,
      "bio": 67,
      "luxe": 86
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien"
    ],
    "star_features": [
      "Protection contre les UV",
      "Protection durable",
      "Résistance à l'eau"
    ],
    "description": "Cette crème solaire minérale SPF30 est un produit multi-usage qui convient aussi bien au visage qu'au corps. Elle est formulée à partir d'ingrédients végétaliens à base de minéraux et garantit une protection à large spectre contre les UVA/UVB. Ce produit sera un excellent complément à l'offre de votre marque, car il s'agit de l'un des produits essentiels les plus populaires de l'été.\n\nEnrichi d'ingrédients à base de minéraux, cet écran solaire assure une protection à large spectre contre les UVA/UVB et prévient le vieillissement prématuré. Testé pour sa résistance à l'eau, il laisse la peau protégée, hydratée et lisse sans laisser de traces blanches. Appliquer généreusement avant l'exposition au soleil sur toutes les parties du corps exposées et renouveler l'application toutes les deux heures, ou plus fréquemment en cas de baignade, de transpiration ou d'essuyage, afin de maintenir une protection efficace. ATTENTION: la crème ne garantit pas une protection à 100 % contre les rayons UVA/UVB. L'exposition prolongée au soleil est une menace sérieuse pour la santé, évitez-la même si vous utilisez un écran solaire.",
    "ingredients": "Jus d'aloès, extrait de baies, extrait de fruits",
    "arome": "Arôme de fleurs fraîches épanouies avec des notes aquatiques sur un fond vert, aromatique et boisé",
    "inci": "INGREDIENTS / INCI: Zinc Oxide, Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Isoamyl Laurate, Lecithin, Polyglyceryl-3 Ricinoleate, Glycerin, Butylene Glycol, Sorbitan Olivate, Oryza Sativa (Rice) Bran Oil, Vegetable Oil, Helianthus Annuus (Sunflower) Seed Wax, Oryza Sativa (Rice) Bran Wax, Rhus Succedanea Fruit Wax, Parfum, Sodium Chloride, Xanthan Gum, Sorbitan Caprylate, Citric Acid, Propanediol, Caprylic/Capric Triglyceride, Polyhydroxystearic Acid, Caprylyl Glycol, Benzoic Acid, Tocopherol, Ascorbyl Palmitate, Aqua, Hippophae Rhamnoides (Sea Buckthorn) Fruit Extract*, Rubus Idaeus (Raspberry) Fruit Extract*, Sodium Phytate, Isostearic Acid, Polyglyceryl-3 Polyricinoleate, Propylene Glycol, Linalool, Limonene, Citral ➀ Ingredients from organic farming Origine naturelle du total 98% Origine biologique du total 5% Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/protection-solaire-spf-30-pour-visage-corps.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/protection-solaire-spf-30-pour-visage-corps",
    "status": "retired"
  },
  {
    "slug": "creme-contour-des-yeux-3-en-1",
    "code": "A5928",
    "nom": "Crème contour des yeux 3 en 1",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": 11.33,
    "prix_conseilles": {
      "milieu": 30,
      "bio": 48,
      "luxe": 61
    },
    "certifications": [
      "Sans gluten",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Apaise le contour des yeux",
      "Texture légère"
    ],
    "description": "Crème multifonctionnelle anti-âge pour les yeux destinée aux hommes, avec un triple effet pour rafraîchir les yeux fatigués: hydratation diminution de l'apparence des cernes et des poches minimiser l'apparence des ridules Ce produit sera un excellent complément à toute marque de soins de la peau recherchant des produits de soins sophistiqués pour hommes.\n\nCette crème rajeunissante pour les yeux a une texture légère et va au-delà de l'hydratation de base, travaillant avec diligence pour diminuer l'apparence des cernes et des poches. Infusée avec 1 % de cannabidiol, elle apporte des bienfaits calmants et un confort immédiat à la peau du contour des yeux. Le contour de l'œil paraît plus lumineux, plus frais et plus jeune à chaque utilisation. Appliquer sur la peau propre du contour des yeux.",
    "ingredients": "Huile de graines de chanvre, jus d'aloès, cannabidiol, acide hyaluronique, extrait de feuille de ginkgo.",
    "arome": "Arôme d'agrumes verts avec des notes fraîches de thé vert et de fleurs blanches sur fond de bois de cèdre et de vétive",
    "inci": "Ingredients / INCI: Aloe Barbadensis (Aloe) Leaf Juice➀, Glycerin➁, Cannabis Sativa (Hemp) Seed Oil➀, Glyceryl Stearate Citrate, Pentylene Glycol, Cetearyl Alcohol, Coco-Caprylate, Dicaprylyl Carbonate, Sodium PCA, Cannabidiol - Derived From Extract Or Tincture Or Resin Of Cannabis, Octyldodecanol, Irvingia Gabonensis (Wild Mango) Kernel Butter, Cellulose, Parfum, Caprylic/Capric Triglyceride, Palmitic Acid, Stearic Acid, Xanthan Gum, Hydrogenated Coco-Glycerides, Tocopherol, Ascorbyl Palmitate, Aqua, Sodium Phytate, Vitis Vinifera (Grape) Leaf Extract➀, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Aesculus Hippocastanum (Horse Chestnut) Seed Extract➀, Potassium Hydroxide, Ginkgo Biloba (Ginkgo) Leaf Extract, Limonene➂, Linalool➂, Geraniol➂, Citral➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 99% Origine biologique du total 18% Produits durables Les produits sont fabriqués à l'aide de processus de produ",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-contour-des-yeux-3-en-1.jpg",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-contour-des-yeux-3-en-1"
  },
  {
    "slug": "mousse-nettoyante",
    "code": "A5852",
    "nom": "Mousse nettoyante",
    "categorie": "soins-du-visage",
    "volume": "150 ml",
    "prix_ht": 9.75,
    "prix_conseilles": {
      "milieu": 26,
      "bio": 41,
      "luxe": 53
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "Mousse douce et onctueuse",
      "Respectueuse de la peau"
    ],
    "description": "Douce et légère, la mousse nettoyante aide à éliminer le maquillage et les impuretés, pour une peau fraîche et souple. Appliquez la mousse sur le visage, massez doucement puis rincez à l’eau.",
    "ingredients": "Eau de fleurs de rose, Extrait de camomille, Extrait de calendula",
    "arome": "Fleurs de printemps douces, parfum floral, poudre de riz",
    "inci": "Aqua, Cocamidopropyl Betaine, Rosa Damascena (Rose) Flower Water ➀, Glycerin, Sucrose Cocoate, Sodium Levulinate, Lactic Acid, Sodium Anisate, Calendula Officinalis (Calendula) Flower Extract ➀, Chamomilla Recutita (Camomile) Flower Extract ➀, Parfum, Benzyl Alcohol, Sodium Benzoate, Potassium Sorbate ➀ Ingredients from organic farming Origine naturelle du total 97% Origine biologique du total 7% All Natural Vous ne trouverez aucun colorant artificiel, parfum synthétique, parabène ou sulfate dans nos produits de soin. Notre gamme de produits de beauté est certifiée biologique ou naturelle selon le référentiel international COSMOS par ECOCERT Greenlife. Nos formules de produits contiennent des ingrédients naturels issus de l’agriculture biologique et des ingrédients d’origine végétale biologique. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natural-and-organic-cosm",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/mousse-nettoyante.jpg",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/mousse-nettoyante"
  },
  {
    "slug": "creme-de-jour-anti-age",
    "code": "A5809-B",
    "nom": "Crème de jour anti-âge",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 13.5,
    "prix_conseilles": {
      "milieu": 36,
      "bio": 57,
      "luxe": 73
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Acide hyaluronique",
      "Hydratation renforcée",
      "Texture luxueuse"
    ],
    "description": "Crème pour le visage de texture veloutée enrichie en actifs marins innovants qui contribuent à uniformiser la texture de la peau et à rendre celle-ci plus lisse au toucher. L’acide hyaluronique de poids moléculaires multiples contribue à stimuler l'hydratation de la peau et à favoriser la jeunesse de la peau. Les ridules semblent moins visibles, la peau paraît plus ferme et plus éclatante. Appliquer sur peau propre.",
    "ingredients": "Jus d’aloe vera, Huile de jojoba, Bétaïne, Beurre de karité, Extrait de baies, Extrait de fleurs, Huile d’avocat, Acide hyaluronique, Extrait de ferment d’alteromonas",
    "arome": "Mélisse aux douces notes florales",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin➁, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Betaine, Isoamyl Laurate, Aqua/Water, Butyrospermum Parkii (Shea) Butter➀, Parfum/Fragrance, Caprylic/Capric Triglyceride, Mica (CI 77019)➃, Polyglyceryl-6 Behenate, Cellulose, Palmitic Acid, Stearic Acid, Vaccinium Vitis-Idaea (Lingonberry) Fruit Extract➀, Xanthan Gum, Echinacea Purpurea (Coneflower) Flower/Leaf/Stem Extract➀, Ribes Nigrum (Blackcurrant) Fruit Extract➀, Sambucus Nigra (Elder) Flower Extract➀, Ascorbyl Palmitate, Persea Gratissima (Avocado) Oil➀, Tocopherol, Hydrolyzed Hyaluronic Acid, Potassium Hydroxide, Sodium Hyaluronate, Sodium Phytate, Alteromonas Ferment Extract, Phenethyl Alcohol, Magnesium Stearate, Alcohol➁, Benzyl Salicylate➂, Limonene➂, Citrus Aurantium Bergamia Peel Oil, Citrus Aurantium Peel Oil, Citral➂, Linalool➂, Linalyl Acetate➂, Pinene➂, Cananga Odorata Oil/Extract. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques ➂ Issu d'huiles essentielles naturelles ➃ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-de-jour-anti-age.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-de-jour-anti-age"
  },
  {
    "slug": "gel-hydratant-a-la-niacinamide",
    "code": "A5837",
    "nom": "Gel hydratant à la niacinamide",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 11.25,
    "prix_conseilles": {
      "milieu": 30,
      "bio": 47,
      "luxe": 61
    },
    "certifications": [],
    "star_features": [
      "Unifie le teint",
      "À base de vitamine b3",
      "Hydratation prolongée"
    ],
    "description": "Gel hydratant pour le visage, enrichi de 5 % de niacinamide, un ingrédient cosmétique polyvalent, soit une version de la vitamine B3. Aide la peau à conserver son hydratation, à paraître plus lisse et à réduire l’apparence du teint irrégulier et des taches pigmentées. Appliquez sur une peau préalablement nettoyée.",
    "ingredients": "Niacinamide, Extrait de feuilles de ginkgo, Alginate de sodium",
    "arome": "Floraison légèrement et fraîchement parfumée avec une pointe de vert",
    "inci": "INGRÉDIENTS/INCI : Aqua/Water, Alcohol, Niacinamide, Glycerin, Cellulose Gum, Algin, Potassium Hydroxide, Parfum/Fragrance, Sodium Phytate, Ginkgo Biloba (Ginkgo) Leaf Extract*, Citric Acid, Sodium Benzoate, Potassium Sorbate *Ingrédients issus de l'agriculture biologique Produits durables Les produits sont fabriqués selon des processus de production et de transformation respectueux de l'environnement, respectueux de la santé humaine et utilisant les ressources naturelles de manière responsable. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a aucun ingrédient OGM dans les produits. L'emballage est recyclable. L'emballage de transport est composé de matériaux recyclés.",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-hydratant-a-la-niacinamide.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/gel-hydratant-a-la-niacinamide"
  },
  {
    "slug": "huile-apaisante-pour-le-visage",
    "code": "A5831-20",
    "nom": "Huile apaisante pour le visage",
    "categorie": "soins-du-visage",
    "volume": "20 ml",
    "prix_ht": 15.83,
    "prix_conseilles": {
      "milieu": 42,
      "bio": 66,
      "luxe": 86
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié biologique"
    ],
    "star_features": [
      "Apporte de l’éclat",
      "À base de cannabidiol"
    ],
    "description": "Huile pour le visage enrichie en cannabidiol dosé à 1 % aux propriétés apaisantes pour la peau et régulant la production de sébum. Contribue à améliorer l’aspect des peaux sèches et ternes. Mélanger 1 à 3 gouttes à son soin hydratant du visage ou du corps, ou utiliser seul.",
    "ingredients": "Huile de chanvre, Cannabidiol",
    "arome": "Aromatique, légèrement piquant, rappelant les herbes parfumées",
    "inci": "Cannabis Sativa (Hemp) Seed Oil➀, Decyl Cocoate, Undecane, Tridecane, Cannabidiol - Derived From Extract Or Tincture Or Resin Of Cannabis, Tocopherol, Parfum/Fragrance, Limonene➁, Linalool➁, Citral➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 100% Origine biologique du total 62% All Natural Vous ne trouverez aucun colorant artificiel, parfum synthétique, parabène ou sulfate dans nos produits de soin. Notre gamme de produits de beauté est certifiée biologique ou naturelle selon le référentiel international COSMOS par ECOCERT Greenlife. Nos formules de produits contiennent des ingrédients naturels issus de l’agriculture biologique et des ingrédients d’origine végétale biologique. Ecocert COSMOS Organic Certifié COSMOS ORGANIC Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natural-and-organic-cosmetics-cosmos",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/huile-apaisante-pour-le-visage.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/huile-apaisante-pour-le-visage"
  },
  {
    "slug": "gel-booster-a-la-cafeine-2",
    "code": "A5820-20",
    "nom": "Gel Booster à la caféine",
    "categorie": "soins-du-visage",
    "volume": "20 ml",
    "prix_ht": 9.92,
    "prix_conseilles": {
      "milieu": 26,
      "bio": 42,
      "luxe": 54
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "​​​​​​​Rafraîchissant",
      "Non gras",
      "Hydratant"
    ],
    "description": "Concentré en gel avec caféine dosée à 1 % pour contribuer à réduire les poches sous les yeux et donner de la fraîcheur aux peaux fatiguées. Particulièrement bénéfique pour la peau du contour des yeux. Mélanger 1 à 3 gouttes à son soin hydratant du visage ou contour des yeux, ou utiliser seul.",
    "ingredients": "Caféine",
    "arome": "Floraison mentholée, accent fruité",
    "inci": "Aqua, Alcohol, Glycerin➀, Caffeine, Carrageenan, Cellulose Gum, Ceratonia Siliqua Gum, Parfum, Glucose, Sodium Phytate, Citric Acid ➀ Made using organic ingredients Origine naturelle du total 99% Origine biologique du total 11% Produits durables You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international COSMOS-standard by ECOCERT Greenlife. Our product formulas contain natural ingredients sourced in organic farming and organic plant-based ingredients. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natural-and-organic-cosmetics-cosmos",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-booster-a-la-cafeine-2.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/gel-booster-a-la-cafeine-2"
  },
  {
    "slug": "gel-hydratant-non-gras-2",
    "code": "A5811-B",
    "nom": "Gel hydratant non gras",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 13.08,
    "prix_conseilles": {
      "milieu": 35,
      "bio": 55,
      "luxe": 71
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Sans huile",
      "Multiusage",
      "Acide hyaluronique"
    ],
    "description": "Nourrissez votre peau de ce gel hydratant pour le visage non gras, mais composé d'une généreuse dose d’acide hyaluronique, associée à de la bétaïne et de l'extrait de cresson. Ce gel enveloppe votre peau d'une hydratation infinie, la laissant repulpée et fraîche. Convient aux peaux grasses à mixtes. Appliquer sur peau propre.",
    "ingredients": "Jus d’aloe vera, Zinc, Extrait de fleurs, Acide hyaluronique",
    "arome": "Plantes, Agrumes, Verveine",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Glycerin➁, Pentylene Glycol, Butylene Glycol, Betaine, Sclerotium Gum, Zinc PCA, Aqua, Propanediol, Parfum, Nasturtium Officinale (Watercress) Flower/Leaf Extract➀, Sodium Phytate, Potassium Hydroxide, Sodium Hyaluronate, Rhamnose, Glucose, Glucuronic Acid, Limonene➂, Linalool➂, Geraniol➂, Citral➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 100% Origine biologique du total 27% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international COSMOS-standard by ECOCERT Greenlife. Our product formulas contain natural ingredients sourced in organic farming and organic plant-based ingredients. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocer",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-hydratant-non-gras-2.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/gel-hydratant-non-gras-2"
  },
  {
    "slug": "serum-hydratant-2",
    "code": "A5813-B",
    "nom": "Sérum hydratant",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 12.75,
    "prix_conseilles": {
      "milieu": 34,
      "bio": 54,
      "luxe": 69
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Multiusage",
      "Hydratation renforcée",
      "Léger"
    ],
    "description": "Aérien, ce sérum pour le visage laisse la peau soyeuse. Il procure une bonne dose d'hydratation à la peau pour un teint frais tout au long de la journée. Le bisabolol apaisant procure une sensation de confort, tandis que les extraits de plaquebière et de pivoine apportent nutriments et vitamines pour une peau nette. Appliquer sur peau propre.",
    "ingredients": "Jus d’aloe vera, Huile de jojoba, Eau de fleurs de rose, Extrait de baies, Extrait de fleurs, Acide hyaluronique, Extrait de ferment d’alteromonas",
    "arome": "Coton doux, fleurs",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin➁, Pentylene Glycol, Rosa Damascena (Rose) Flower Water➀, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Isoamyl Laurate, Aqua, Betaine, Polyglyceryl-6 Behenate, Parfum, Cellulose, Caprylic/Capric Triglyceride, Xanthan Gum, Bisabolol, Paeonia Lactiflora (Peony) Root Extract, Rubus Chamaemorus (Cloudberry) Fruit Extract➀, Ascorbyl Palmitate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Tocopherol, Benzyl Alcohol, Alteromonas Ferment Extract, Phenethyl Alcohol, CI 77491 (Iron Oxides)④, Sodium Benzoate, Potassium Sorbate, Potassium Hydroxide, Glycolipids, Limonene➂, Geraniol➂, Coumarin➂, Linalool➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils ④ Pure mineral pigments Origine naturelle du total 99% Origine biologique du total 25% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincar",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-hydratant-2.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/serum-hydratant-2"
  },
  {
    "slug": "gel-booster-au-ginkgo-antioxydant",
    "code": "A5819-20",
    "nom": "Gel Booster au ginkgo antioxydant",
    "categorie": "soins-du-visage",
    "volume": "20 ml",
    "prix_ht": 9.5,
    "prix_conseilles": {
      "milieu": 25,
      "bio": 40,
      "luxe": 51
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "Protège",
      "Non gras",
      "Hydratant"
    ],
    "description": "Concentré, l’extrait de Ginkgo biloba est riche en antioxydants qui contribuent à minimiser les dommages causés par les particules libres et protègent la peau contre la pollution ou les autres facteurs environnementaux. Les peaux ternes et fatiguées retrouvent fraîcheur et jeunesse. Mélanger 1 à 3 gouttes à son hydratant pour le visage ou le corps.",
    "ingredients": "Extrait de plantes",
    "arome": "Floraison mentholée, accent fruité",
    "inci": "INGRÉDIENTS / INCI : Aqua, Alcohol, Glycerin, Cellulose Gum, Algin, Aroma, Ginkgo Biloba Leaf Extract, Citric Acid, Sodium Phytate, Camellia Sinensis Leaf Extract, Potassium Hydroxide, Quercus Robur Bark Extract, Vitis Vinifera Seed Extract, Sodium Benzoate, Potassium Sorbate. ➀ Ingrédient issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-booster-au-ginkgo-antioxydant.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/gel-booster-au-ginkgo-antioxydant"
  },
  {
    "slug": "creme-de-jour-hydratante",
    "code": "A5807-B",
    "nom": "Crème de jour hydratante",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 13.33,
    "prix_conseilles": {
      "milieu": 35,
      "bio": 56,
      "luxe": 72
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Hydratation Renforcée",
      "Acide Hyaluronique",
      "Texture Luxueuse"
    ],
    "description": "Cette crème pour le visage de texture soyeuse pénètre rapidement la peau et lui apporte hydratation et nutrition intenses. Formulée à l’acide hyaluronique de poids moléculaires multiples et au bisabolol apaisant pour une peau veloutée et pulpeuse tout au long de la journée. L'extrait de sorbier riche en antioxydants contribue à protéger contre les agressions environnementales et à préserver la jeunesse de la peau. Convient aux peaux normales à sèches. Appliquer sur peau propre.",
    "ingredients": "Jus d’aloe vera, Huile de jojoba, Bétaïne, Extrait de fleurs, Extrait de baies, Extrait de fruits, Acide hyaluronique",
    "arome": "Mélisse aux douces notes florales",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice, Caprylic/Capric Triglyceride, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin➁, Glyceryl Stearate Citrate, Pentylene Glycol, Cetearyl Alcohol, Betaine, Dicaprylyl Carbonate, Parfum, Palmitic Acid, Stearic Acid, Xanthan Gum, Bisabolol, Nasturtium Officinale (Watercress) Flower/Leaf Extract➀, Rubus Fruticosus (Blackberry) Fruit Extract➀, Sorbus Aucuparia (Rowan) Fruit Extract➀, Ascorbyl Palmitate, Rubus Idaeus (Raspberry) Seed Oil➀, Tocopherol, Aqua, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Potassium Hydroxide, Benzyl Salicylate➂, Limonene➂, Citral➂, Linalool➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 99% Origine biologique du total 22% All Natural Vous ne trouverez aucun colorant artificiel, parfum synthétique, parabène ou sulfate dans nos produits de soin. Notre gamme de produits de beauté est certifiée biologique ou naturelle selon le référent",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-de-jour-hydratante.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-de-jour-hydratante"
  },
  {
    "slug": "huile-visage-nourrissante",
    "nom": "Huile visage nourrissante",
    "categorie": "soins-du-visage",
    "volume": "20 ml",
    "prix_ht": null,
    "prix_conseilles": {
      "milieu": 32,
      "bio": 51,
      "luxe": 66
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié biologique"
    ],
    "star_features": [
      "Certifiée biologique",
      "Vegan",
      "Nourrissante"
    ],
    "description": "Cet incroyable mélange de 11 huiles et extraits certifiés biologiques apporte la cure de nutriments et de vitamines dont votre peau a besoin pour un teint sain et éclatant. Nourrit intensément, laissant la peau douce et revitalisée. Appliquer sur peau propre. Éviter tout contact direct avec les yeux.",
    "ingredients": "Huile de jojoba, Extrait de baies, Huile d’argan, Huile d’avocat",
    "arome": "Fruits secs orientaux et notes épicées",
    "inci": "Simmondsia Chinensis (Jojoba) Seed Oil➀, Decyl Cocoate, Solanum Lycopersicum (Tomato) Fruit Extract➀, Hippophae Rhamnoides (Sea Buckthorn) Fruit Extract➀, Undecane, Tridecane, Argania Spinosa (Argan) Kernel Oil➀, Rubus Chamaemorus (Cloudberry) Fruit Extract➀, Tocopherol, Persea Gratissima (Avocado) Oil➀, Prunus Amygdalus (Almond) Dulcis Oil➀, Prunus Armeniaca (Apricot) Kernel Oil➀, Parfum, Borago Officinalis (Borage) Seed Oil➀, Oenothera Biennis (Evening Primrose) Oil➀, Prunus Domestica (Plum) Seed Oil, Vaccinium Myrtillus (Blueberry) Seed Oil➀, Linalool➁, Limonene➁, Citronellol➁, Geraniol➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 100% Origine biologique du total 63% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international COSMOS-standard by ECOCERT Greenlife. Our product formulas co",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/huile-visage-nourrissante.jpg",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/huile-visage-nourrissante",
    "status": "retired"
  },
  {
    "slug": "creme-apaisante-pour-les-yeux",
    "code": "A5832",
    "nom": "Crème apaisante pour les yeux",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": 11.42,
    "prix_conseilles": {
      "milieu": 30,
      "bio": 48,
      "luxe": 62
    },
    "certifications": [
      "Sans gluten",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "À base de cannabidiol",
      "Prévient l’apparition de poches sous les yeux"
    ],
    "description": "Crème yeux à la texture légère, enrichie de 1 % de cannabidiol qui contribue à réduire la sécheresse de la peau. Ravive l’aspect du contour des yeux, en apportant une hydratation immédiate. Prévient l’apparition des poches et des cernes. Appliquez sur le contour des yeux préalablement nettoyé.",
    "ingredients": "TYPES DE PEAU Peaux normales Peaux sèches Peaux grasses PROBLÉMATIQUE DE PEAU Peaux sèches Peaux fatiguées Peaux ternes Poches sous les yeux PARFUM Note florale terreuse, épicée et douce POINTS FORTS Idéale pour les peaux sèches À base de cannabidiol Prévient l’apparition de poches sous les yeux INGRÉDIENT Huile de chanvre Jus d’aloe vera Cannabidiol Beurre de mangue sauvage Extrait de feuille de vigne Acide hyaluronique Extrait de graines de marron d’Inde Extrait de feuilles de ginkgo",
    "arome": "",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Glycerin➁, Cannabis Sativa (Hemp) Seed Oil➀, Glyceryl Stearate Citrate, Pentylene Glycol, Cetearyl Alcohol, Coco-Caprylate, Dicaprylyl Carbonate, Sodium PCA, Cannabidiol - Derived From Extract Or Tincture Or Resin Of Cannabis, Octyldodecanol, Irvingia Gabonensis (Wild Mango) Kernel Butter, Cellulose, Parfum/Fragrance, Caprylic/Capric Triglyceride, Palmitic Acid, Stearic Acid, Xanthan Gum, Hydrogenated Coco-Glycerides, Tocopherol, Ascorbyl Palmitate, Aqua/Water, Sodium Phytate, Vitis Vinifera (Grape) Leaf Extract➀, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Aesculus Hippocastanum (Horse Chestnut) Seed Extract➀, Potassium Hydroxide, Ginkgo Biloba (Ginkgo) Leaf Extract, Limonene➂, Linalool➂, Geraniol➂, Citral➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 99% Origine biologique du total 18% All Natural Vous ne trouverez aucun colorant artificiel, parfum synthétique, par",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-apaisante-pour-les-yeux.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-apaisante-pour-les-yeux"
  },
  {
    "slug": "huile-apaisante-pour-le-visage-2",
    "nom": "Huile apaisante pour le visage",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": null,
    "prix_conseilles": {
      "milieu": 39,
      "bio": 63,
      "luxe": 81
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié biologique"
    ],
    "star_features": [
      "Apporte de l’éclat",
      "À base de cannabidiol"
    ],
    "description": "Huile pour le visage enrichie en cannabidiol dosé à 1 % aux propriétés apaisantes pour la peau et régulant la production de sébum. Contribue à améliorer l’aspect des peaux sèches et ternes. Mélanger 1 à 3 gouttes à son soin hydratant du visage ou du corps, ou utiliser seul.",
    "ingredients": "Huile de chanvre, Cannabidiol",
    "arome": "Aromatique, légèrement piquant, rappelant les herbes parfumées",
    "inci": "Cannabis Sativa (Hemp) Seed Oil➀, Decyl Cocoate, Undecane, Tridecane, Cannabidiol - Derived From Extract Or Tincture Or Resin Of Cannabis, Tocopherol, Parfum/Fragrance, Limonene➁, Linalool➁, Citral➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 100% Origine biologique du total 62% All Natural Vous ne trouverez aucun colorant artificiel, parfum synthétique, parabène ou sulfate dans nos produits de soin. Notre gamme de produits de beauté est certifiée biologique ou naturelle selon le référentiel international COSMOS par ECOCERT Greenlife. Nos formules de produits contiennent des ingrédients naturels issus de l’agriculture biologique et des ingrédients d’origine végétale biologique. Ecocert COSMOS Organic Certifié COSMOS ORGANIC Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natural-and-organic-cosmetics-cosmos",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/huile-apaisante-pour-le-visage-2.jpg",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/huile-apaisante-pour-le-visage-2",
    "status": "retired"
  },
  {
    "slug": "serum-hydratant",
    "code": "A5813",
    "nom": "Sérum hydratant",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 12.75,
    "prix_conseilles": {
      "milieu": 34,
      "bio": 54,
      "luxe": 69
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Multiusage",
      "Hydratation renforcée",
      "Léger"
    ],
    "description": "Aérien, ce sérum pour le visage laisse la peau soyeuse. Il procure une bonne dose d'hydratation à la peau pour un teint frais tout au long de la journée. Le bisabolol apaisant procure une sensation de confort, tandis que les extraits de plaquebière et de pivoine apportent nutriments et vitamines pour une peau nette. Appliquer sur peau propre.",
    "ingredients": "Jus d’aloe vera, Huile de jojoba, Eau de fleurs de rose, Extrait de baies, Extrait de fleurs, Acide hyaluronique, Extrait de ferment d’alteromonas",
    "arome": "Coton doux, fleurs",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin➁, Pentylene Glycol, Rosa Damascena (Rose) Flower Water➀, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Isoamyl Laurate, Aqua, Betaine, Polyglyceryl-6 Behenate, Parfum, Cellulose, Caprylic/Capric Triglyceride, Xanthan Gum, Bisabolol, Paeonia Lactiflora (Peony) Root Extract, Rubus Chamaemorus (Cloudberry) Fruit Extract➀, Ascorbyl Palmitate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Tocopherol, Benzyl Alcohol, Alteromonas Ferment Extract, Phenethyl Alcohol, CI 77491 (Iron Oxides)④, Sodium Benzoate, Potassium Sorbate, Potassium Hydroxide, Glycolipids, Limonene➂, Geraniol➂, Coumarin➂, Linalool➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils ④ Pure mineral pigments Origine naturelle du total 99% Origine biologique du total 25% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincar",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-hydratant.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/serum-hydratant"
  },
  {
    "slug": "gel-hydratant-non-gras",
    "code": "A5811",
    "nom": "Gel hydratant non gras",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 13.08,
    "prix_conseilles": {
      "milieu": 35,
      "bio": 55,
      "luxe": 71
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Sans huile",
      "Multiusage",
      "Acide hyaluronique"
    ],
    "description": "Nourrissez votre peau de ce gel hydratant pour le visage non gras, mais composé d'une généreuse dose d’acide hyaluronique, associée à de la bétaïne et de l'extrait de cresson. Ce gel enveloppe votre peau d'une hydratation infinie, la laissant repulpée et fraîche. Convient aux peaux grasses à mixtes. Appliquer sur peau propre.",
    "ingredients": "Jus d’aloe vera, Zinc, Extrait de fleurs, Acide hyaluronique",
    "arome": "Plantes, Agrumes, Verveine",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Glycerin➁, Pentylene Glycol, Butylene Glycol, Betaine, Sclerotium Gum, Zinc PCA, Aqua, Propanediol, Parfum, Nasturtium Officinale (Watercress) Flower/Leaf Extract➀, Sodium Phytate, Potassium Hydroxide, Sodium Hyaluronate, Rhamnose, Glucose, Glucuronic Acid, Limonene➂, Linalool➂, Geraniol➂, Citral➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 100% Origine biologique du total 27% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international COSMOS-standard by ECOCERT Greenlife. Our product formulas contain natural ingredients sourced in organic farming and organic plant-based ingredients. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocer",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-hydratant-non-gras.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/gel-hydratant-non-gras"
  },
  {
    "slug": "creme-contour-des-yeux-eclaircissante",
    "code": "A5817",
    "nom": "Crème contour des yeux éclaircissante",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": 10.58,
    "prix_conseilles": {
      "milieu": 28,
      "bio": 44,
      "luxe": 57
    },
    "certifications": [
      "Sans gluten",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Prévient l’apparition des cernes",
      "Hydratante"
    ],
    "description": "Cette crème contour des yeux apporte une fraîcheur instantanée. Un mélange de 3 ingrédients végétaux biologiques contribue à réduire les poches et les cernes, tandis que l’acide hyaluronique de poids moléculaires multiples cible les rides et la sécheresse de la peau. Le contour des yeux paraît reposé et frais. Appliquer sur peau propre au niveau du contour des yeux.",
    "ingredients": "Bétaïne, Extrait de plantes, Beurre de karité",
    "arome": "Coton doux, fleurs",
    "inci": "Aqua, Helianthus Annuus (Sunflower) Seed Oil➀, Glycerin, Pentylene Glycol, Cetearyl Alcohol, Isoamyl Laurate, Arachidyl Alcohol, Behenyl Alcohol, Betaine, Palmitic Acid, Stearic Acid, Arachidyl Glucoside, Parfum, Cellulose, Butyrospermum Parkii (Shea) Butter➀, Coco-Glucoside, Xanthan Gum, Oryza Sativa (Rice) Bran Oil, Vegetable Oil, Helianthus Annuus (Sunflower) Seed Wax, Oryza Sativa (Rice) Bran Wax, Rhus Succedanea Fruit Wax, Ascorbyl Palmitate, Tocopherol, Sodium Phytate, Vitis Vinifera (Grape) Leaf Extract➀, Potassium Hydroxide, Aesculus Hippocastanum (Horse Chestnut) Seed Extract➀, Hydrolyzed Hyaluronic Acid, Ginkgo Biloba (Ginkgo) Leaf Extract, Sodium Hyaluronate, Limonene➁, Geraniol➁, Coumarin➁, Linalool➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 100% Origine biologique du total 10% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range ",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-contour-des-yeux-eclaircissante.jpg",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-contour-des-yeux-eclaircissante"
  },
  {
    "slug": "creme-riche-nourrissante",
    "code": "A5810",
    "nom": "Crème riche nourrissante, sans parfum",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 13.17,
    "prix_conseilles": {
      "milieu": 35,
      "bio": 55,
      "luxe": 71
    },
    "certifications": [
      "Sans gluten",
      "Végétalien",
      "Certifié naturel",
      "Sans allergène sur l'étiquette",
      "Sans parfum"
    ],
    "star_features": [
      "Peaux matures",
      "Douce pour les peaux sèches"
    ],
    "description": "Cette crème riche pour le visage apaise, hydrate et nourrit la peau, tout en restaurant la barrière cutanée afin d’assurer une protection tout au long de la journée. L'extrait de plaquebière contribue à procurer douceur et confort. La consistance riche et cireuse laisse la peau veloutée au toucher. Convient pour les zones sèches de la peau. Appliquer sur peau propre.",
    "ingredients": "Beurre de cacao, Huile d’argan, Beurre de karité,Huile d’olive, Extrait de baies",
    "arome": "Sans parfum ajouté",
    "inci": "Aqua, Helianthus Annuus (Sunflower) Seed Oil➀, Theobroma Cacao (Cocoa) Seed Butter➀, Dicaprylyl Carbonate, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Glycerin➁, Argania Spinosa (Argan) Kernel Oil➀, Helianthus Annuus (Sunflower) Seed Cera, Butyrospermum Parkii (Shea) Butter➀, Olea Europaea (Olive) Oil Unsaponifiables, Palmitic Acid, Rubus Chamaemorus (Cloudberry) Fruit Extract➀, Stearic Acid, Polyglyceryl-6 Behenate, Cellulose, Rhus Verniciflua Peel Cera / Rhus Succedanea Fruit Cera, Shorea Robusta Resin, Xanthan Gum, Vanilla Planifolia (Vanilla) Bean Extract➀, Sodium Phytate, Ascorbyl Palmitate, Tocopherol, Lactic Acid ➀ Ingredients from organic farming ➁ Made using organic ingredients Origine naturelle du total 99% Origine biologique du total 20% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international COSMOS-stand",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-riche-nourrissante.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-riche-nourrissante"
  },
  {
    "slug": "creme-de-jour-legere-et-hydratante",
    "code": "A5808",
    "nom": "Crème de jour légère et hydratante",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 12.67,
    "prix_conseilles": {
      "milieu": 33,
      "bio": 53,
      "luxe": 68
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Légère",
      "Hydratante",
      "Peaux normales à grasses"
    ],
    "description": "Cette crème pour le visage de texture délicate pénètre rapidement, laissant la peau hydratée et matte. Enrichie en acide hyaluronique et en bétaïne hydratants pour rétablir l'hydratation de la peau et lui apporter immédiatement fraîcheur et confort. Convient aux peaux normales à mixtes. Appliquer sur peau propre.",
    "ingredients": "Jus d’aloe vera, Huile d’argan, Bétaïne, Bisabolol, Extrait de plantes, Acide hyaluronique",
    "arome": "Agrumes, thé vert",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Argania Spinosa (Argan) Kernel Oil➀, Glycerin, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Betaine, Isoamyl Laurate, Parfum, Polyglyceryl-6 Behenate, Cellulose, Xanthan Gum, Caprylic/Capric Triglyceride, Palmitic Acid, Stearic Acid, Aqua, Bisabolol, Carum Petroselinum (Parsley) Extract➀, Quercus Robur (Oak) Bark Extract➀, Ascorbyl Palmitate, Tocopherol, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Arctium Lappa (Burdock) Root Extract➀, Citric Acid, Lactic Acid, Sodium Benzoate, Potassium Sorbate, Limonene➁, Citronellol➁, Linalool➁, Geraniol➁, Citral➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 99% Origine biologique du total 15% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international COSMOS-standard by ECOCERT Gre",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-de-jour-legere-et-hydratante.jpg",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-de-jour-legere-et-hydratante"
  },
  {
    "slug": "creme-de-jour-hydratante-2",
    "code": "A5807",
    "nom": "Crème de jour hydratante",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 13.33,
    "prix_conseilles": {
      "milieu": 35,
      "bio": 56,
      "luxe": 72
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Hydratation Renforcée",
      "Acide Hyaluronique",
      "Texture Luxueuse"
    ],
    "description": "Cette crème pour le visage de texture soyeuse pénètre rapidement la peau et lui apporte hydratation et nutrition intenses. Formulée à l’acide hyaluronique de poids moléculaires multiples et au bisabolol apaisant pour une peau veloutée et pulpeuse tout au long de la journée. L'extrait de sorbier riche en antioxydants contribue à protéger contre les agressions environnementales et à préserver la jeunesse de la peau. Convient aux peaux normales à sèches. Appliquer sur peau propre.",
    "ingredients": "Jus d’aloe vera, Huile de jojoba, Bétaïne, Extrait de fleurs, Extrait de baies, Extrait de fruits, Acide hyaluronique",
    "arome": "Mélisse aux douces notes florales",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice, Caprylic/Capric Triglyceride, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin➁, Glyceryl Stearate Citrate, Pentylene Glycol, Cetearyl Alcohol, Betaine, Dicaprylyl Carbonate, Parfum, Palmitic Acid, Stearic Acid, Xanthan Gum, Bisabolol, Nasturtium Officinale (Watercress) Flower/Leaf Extract➀, Rubus Fruticosus (Blackberry) Fruit Extract➀, Sorbus Aucuparia (Rowan) Fruit Extract➀, Ascorbyl Palmitate, Rubus Idaeus (Raspberry) Seed Oil➀, Tocopherol, Aqua, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Potassium Hydroxide, Benzyl Salicylate➂, Limonene➂, Citral➂, Linalool➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 99% Origine biologique du total 22% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international C",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-de-jour-hydratante-2.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-de-jour-hydratante-2"
  },
  {
    "slug": "tonique-purifiant",
    "code": "A5806",
    "nom": "Tonique purifiant",
    "categorie": "soins-du-visage",
    "volume": "200 ml",
    "prix_ht": 9.08,
    "prix_conseilles": {
      "milieu": 24,
      "bio": 38,
      "luxe": 49
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel",
      "Sans allergène sur l'étiquette",
      "Sans parfum"
    ],
    "star_features": [
      "Sans parfum ajouté",
      "Rafraîchit",
      "Vegan"
    ],
    "description": "Tonique multi-usage – élimine les impuretés et l'excès de sébum, contribue à désobstruer les pores, préserve le pH naturel de la peau et hydrate celle-ci. La peau retrouve fraîcheur et souplesse. Verser le produit dans les mains et appliquer sur l’ensemble du visage. Éviter tout contact direct avec les yeux.",
    "ingredients": "TYPES DE PEAU Peaux normales Peaux grasses PROBLÉMATIQUE DE PEAU Peaux mixtes à grasses PARFUM Infusion de plantes aux fruits secs et notes de rose POINTS FORTS Sans parfum ajouté Rafraîchit Vegan INGRÉDIENT Eau de fleurs de lavande Extrait de plantes Acide salicylique",
    "arome": "",
    "inci": "Aqua, Alcohol, Lavandula Angustifolia (Lavender) Flower Water ➀, Glycerin➁, Betaine, Propanediol, Acorus Calamus (Sweet Flag) Root Extract➀, Cucumis Sativus (Cucumber) Fruit Extract➀, Salicylic Acid, Benzyl Alcohol, Sodium Benzoate, Potassium Sorbate, Rhamnose, Glucose, Glucuronic Acid ➀ Ingredients from organic farming ➁ Made using organic ingredients Origine naturelle du total 99% Origine biologique du total 7% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international COSMOS-standard by ECOCERT Greenlife. Our product formulas contain natural ingredients sourced in organic farming and organic plant-based ingredients. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natural-and-organic-cosmetics-cosmos",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/tonique-purifiant.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/tonique-purifiant"
  },
  {
    "slug": "tonique-hydratant",
    "code": "A5805",
    "nom": "Tonique hydratant",
    "categorie": "soins-du-visage",
    "volume": "200 ml",
    "prix_ht": 9.08,
    "prix_conseilles": {
      "milieu": 24,
      "bio": 38,
      "luxe": 49
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel",
      "Sans allergène sur l'étiquette",
      "Sans parfum"
    ],
    "star_features": [
      "Procure une sensation de fraîcheur",
      "Idéal pour les peaux ternes"
    ],
    "description": "Hydrate et contribue à préserver le pH naturel de la peau pour laisser celle-ci éclatante et confortable après nettoyage. Enrichi en eau de rose et acide hyaluronique pour une hydratation accrue. Verser le produit dans les mains et appliquer sur l’ensemble du visage. Éviter tout contact direct avec les yeux.",
    "ingredients": "Eau de fleurs de rose, Extrait de fleurs, Extrait de fruits, Acide hyaluronique",
    "arome": "Infusion de plantes aux légères notes florales",
    "inci": "Aqua, Rosa Damascena (Rose) Flower Water ➀, Glycerin➁, Sodium PCA, Benzyl Alcohol, Chamomilla Recutita (Camomile) Flower Extract ➀, Fragaria Ananassa (Strawberry) Fruit Extract ➀, Sodium Benzoate, Potassium Sorbate, Sodium Hyaluronate, Lactic Acid, Citric Acid ➀ Ingredients from organic farming ➁ Made using organic ingredients Origine naturelle du total 99% Origine biologique du total 7% All Natural Vous ne trouverez aucun colorant artificiel, parfum synthétique, parabène ou sulfate dans nos produits de soin. Notre gamme de produits de beauté est certifiée biologique ou naturelle selon le référentiel international COSMOS par ECOCERT Greenlife. Nos formules de produits contiennent des ingrédients naturels issus de l’agriculture biologique et des ingrédients d’origine végétale biologique. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natural-and-organic-cosmetics-cos",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/tonique-hydratant.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/tonique-hydratant"
  },
  {
    "slug": "eau-micellaire-nettoyante",
    "code": "A5804",
    "nom": "Eau micellaire nettoyante",
    "categorie": "soins-du-visage",
    "volume": "200 ml",
    "prix_ht": 8.17,
    "prix_conseilles": {
      "milieu": 22,
      "bio": 34,
      "luxe": 44
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié biologique",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "Démaquille",
      "Formule hydratante",
      "Tous types de peaux"
    ],
    "description": "Nettoyant efficace pour éliminer le maquillage et les impuretés, laisse la peau propre et fraîche. Enrichie en acide hyaluronique et en extraits apaisants de fleur de tilleul et de camomille. Appliquer sur un carré de coton durable et passer sur le visage, les yeux et les lèvres.",
    "ingredients": "Jus d’aloe vera, Extrait de fleurs, Acide hyaluronique",
    "arome": "Fraîcheur printanière de la prairie au matin",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Butylene Glycol, Glycerin➁, Caprylyl/Capryl Glucoside, Aqua, Polyglyceryl-4 Caprate, Sodium Levulinate, Betaine, Chamomilla Recutita (Camomile) Flower Extract➀, Tilia Cordata (Linden) Flower Extract➀, Sodium Benzoate, Lactic Acid, Parfum, Sodium Hyaluronate ➀ Ingredients from organic farming ➁ Made using organic ingredients Origine naturelle du total 99% Origine biologique du total 13% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international COSMOS-standard by ECOCERT Greenlife. Our product formulas contain natural ingredients sourced in organic farming and organic plant-based ingredients. Ecocert COSMOS Organic Certifié COSMOS ORGANIC Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natural-and-organic-cosmetics-cosmos",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/eau-micellaire-nettoyante.jpg",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/eau-micellaire-nettoyante"
  },
  {
    "slug": "creme-de-jour-anti-age-2",
    "code": "A5809",
    "nom": "Crème de jour anti-âge",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 13.5,
    "prix_conseilles": {
      "milieu": 36,
      "bio": 57,
      "luxe": 73
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Acide hyaluronique",
      "Hydratation renforcée",
      "Texture luxueuse"
    ],
    "description": "Crème pour le visage de texture veloutée enrichie en actifs marins innovants qui contribuent à uniformiser la texture de la peau et à rendre celle-ci plus lisse au toucher. L’acide hyaluronique de poids moléculaires multiples contribue à stimuler l'hydratation de la peau et à favoriser la jeunesse de la peau. Les ridules semblent moins visibles, la peau paraît plus ferme et plus éclatante. Appliquer sur peau propre.",
    "ingredients": "Jus d’aloe vera, Huile de jojoba, Bétaïne, Beurre de karité, Extrait de baies, Extrait de fleurs, Huile d’avocat, Acide hyaluronique, Extrait de ferment d’alteromonas",
    "arome": "Mélisse aux douces notes florales",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin➁, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Betaine, Isoamyl Laurate, Aqua/Water, Butyrospermum Parkii (Shea) Butter➀, Parfum/Fragrance, Caprylic/Capric Triglyceride, Mica (CI 77019)➃, Polyglyceryl-6 Behenate, Cellulose, Palmitic Acid, Stearic Acid, Vaccinium Vitis-Idaea (Lingonberry) Fruit Extract➀, Xanthan Gum, Echinacea Purpurea (Coneflower) Flower/Leaf/Stem Extract➀, Ribes Nigrum (Blackcurrant) Fruit Extract➀, Sambucus Nigra (Elder) Flower Extract➀, Ascorbyl Palmitate, Persea Gratissima (Avocado) Oil➀, Tocopherol, Hydrolyzed Hyaluronic Acid, Potassium Hydroxide, Sodium Hyaluronate, Sodium Phytate, Alteromonas Ferment Extract, Phenethyl Alcohol, Magnesium Stearate, Alcohol➁, Benzyl Salicylate➂, Limonene➂, Citrus Aurantium Bergamia Peel Oil, Citrus Aurantium Peel Oil, Citral➂, Linalool➂, Linalyl Acetate➂, Pinene➂, Cananga Odorata Oil/Extract. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques ➂ Issu d'huiles essentielles naturelles ➃ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-de-jour-anti-age-2.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-de-jour-anti-age-2"
  },
  {
    "slug": "creme-contour-des-yeux-apaisante",
    "code": "A5816",
    "nom": "Crème contour des yeux apaisante",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": 11.33,
    "prix_conseilles": {
      "milieu": 30,
      "bio": 48,
      "luxe": 61
    },
    "certifications": [
      "Sans gluten",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Hydratante",
      "Vegan",
      "Légère"
    ],
    "description": "Sensation de fraîcheur grâce à cette crème soyeuse qui contribue à raffermir et lisser la peau autour des yeux. Les céramides créent un bouclier protecteur de la peau, et contribuent à prévenir la perte d'hydratation et à améliorer la fermeté et l’élasticité. Le contour des yeux est visiblement plus frais et jeune. Appliquer sur peau propre au niveau du contour des yeux.",
    "ingredients": "Jus d’aloe vera, Huile de jojoba, Beurre de karité, Extrait de plantes, Acide hyaluronique, Escine",
    "arome": "Coton doux, fleurs",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin➁, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Isoamyl Laurate, Dipalmitoyl Hydroxyproline, Sodium PCA, Parfum, Polyglyceryl-6 Behenate, Cellulose, Butyrospermum Parkii (Shea) Butter➀, Caprylic/Capric Triglyceride, Palmitic Acid, Stearic Acid, Xanthan Gum, Aesculus Hippocastanum (Horse Chestnut) Seed Extract➀, Camellia Sinensis (Black Tea) Leaf Extract➀, Ascorbyl Palmitate, Glycosphingolipids, Tocopherol, Glycolipids, Aqua, Hydrolysed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Potassium Hydroxide, Escin, Limonene➂, Linalool➂, Coumarin➂, Geraniol➂ ➀ Ingredients from organic farming ➁ Made using organic ingredients ➂ From natural essential oils Origine naturelle du total 100% Origine biologique du total 18% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural c",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-contour-des-yeux-apaisante.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/creme-contour-des-yeux-apaisante"
  },
  {
    "slug": "mousse-purifiante",
    "code": "A5803",
    "nom": "Mousse purifiante",
    "categorie": "soins-du-visage",
    "volume": "190 ml",
    "prix_ht": 11,
    "prix_conseilles": {
      "milieu": 29,
      "bio": 46,
      "luxe": 59
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel"
    ],
    "star_features": [
      "Peaux mixtes à grasses",
      "Jus d’aloe vera"
    ],
    "description": "Ce nettoyant d'une texture innovante dissout les impuretés, contribue à éliminer l’excès de sébum et hydrate le visage sans obstruer les pores. Le résultat : une peau à la fois propre et formidablement hydratée. Faire mousser dans les mains, appliquer sur le visage, masser délicatement, puis rincer à l’eau.",
    "ingredients": "Jus d’aloe vera, Extrait de plantes, Extrait de baies",
    "arome": "Pamplemousse doux et citron énergisant",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Coco-Glucoside, Cocamidopropyl Betaine, Glycerin, Aqua, Xanthan Gum, Propanediol, Rubus Fruticosus (Blackberry) Fruit Extract➀, Sodium PCA, Sodium Levulinate, Lactic Acid, Acacia Senegal Gum, Sodium Anisate, Parfum, Acorus Calamus (Sweet Flag) Root Extract➀, CI 77891 (Titanium Dioxide)➂, Salvia Officinalis (Sage) Leaf Extract➀, Rhamnose, Glucose, Glucuronic Acid, Arctium Lappa (Burdock) Root Extract➀, Citric Acid, Sodium Benzoate, Potassium Sorbate, Limonene➁ ➀ Ingredients from organic farming ➁ From natural essential oils ➂ Pure mineral pigments Origine naturelle du total 98% Origine biologique du total 10% All Natural Vous ne trouverez aucun colorant artificiel, parfum synthétique, parabène ou sulfate dans nos produits de soin. Notre gamme de produits de beauté est certifiée biologique ou naturelle selon le référentiel international COSMOS par ECOCERT Greenlife. Nos formules de produits contiennent des ingrédients naturels issus de l’agriculture b",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/mousse-purifiante.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/mousse-purifiante"
  },
  {
    "slug": "gel-clarifiant",
    "code": "A5802",
    "nom": "Gel clarifiant",
    "categorie": "soins-du-visage",
    "volume": "200 ml",
    "prix_ht": 9.75,
    "prix_conseilles": {
      "milieu": 26,
      "bio": 41,
      "luxe": 53
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié naturel",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "Inquiétude"
    ],
    "description": "Rafraîchissez votre peau avec ce gel nettoyant clarifiant. La mousse douce élimine les impuretés du quotidien et l’excès de sébum. Facile à rincer, laissant la peau propre et confortable. Faire mousser dans les mains, appliquer sur le visage, masser délicatement, puis rincer à l’eau.",
    "ingredients": "Jus d'aloès, extrait de fruit",
    "arome": "Fruits secs orientaux et notes épicées",
    "inci": "Aloe Barbadensis (Aloe) Leaf Juice➀, Lauryl Glucoside, Glycerin, Sodium Coco-Sulfate, Aqua, Sodium PCA, Disodium Cocoyl Glutamate, Sodium Levulinate, Citric Acid, Coco-Glucoside, Glyceryl Oleate, Sodium Anisate, Sodium Cocoyl Glutamate, Parfum, Prunus Domestica (Plum) Fruit Extract➀, Sodium Phytate ➀ Ingredients from organic farming Origine naturelle du total 100% Origine biologique du total 10% All Natural Vous ne trouverez aucun colorant artificiel, parfum synthétique, parabène ou sulfate dans nos produits de soin. Notre gamme de produits de beauté est certifiée biologique ou naturelle selon le référentiel international COSMOS par ECOCERT Greenlife. Nos formules de produits contiennent des ingrédients naturels issus de l’agriculture biologique et des ingrédients d’origine végétale biologique. Ecocert COSMOS Natural Certifié COSMOS NATUREL Certifié par ECOCERT Greenlife selon le référentiel COSMOS disponible sur https://www.ecocert.com/fr/certification-detail/natural-and-organic-cosme",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-clarifiant.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/gel-clarifiant"
  },
  {
    "slug": "lait-nettoyant-doux",
    "code": "A5801",
    "nom": "Lait nettoyant doux",
    "categorie": "soins-du-visage",
    "volume": "190 ml",
    "prix_ht": 9.75,
    "prix_conseilles": {
      "milieu": 26,
      "bio": 41,
      "luxe": 53
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié biologique",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "Texture soyeuse",
      "Laisse la peau douce"
    ],
    "description": "Nettoyant visage doux de texture douce et soyeuse qui nourrit la peau tout en éliminant toute trace de maquillage et impureté. Appliquer le nettoyant sur le visage, masser délicatement, puis rincer à l’eau.",
    "ingredients": "Beurre de karité, Huile d’argan, Huile d’avocat, Huile de jojoba, Extrait de fleurs",
    "arome": "Sensation de fraîcheur verte et acidulée",
    "inci": "Aqua, Helianthus Annuus (Sunflower) Seed Oil➀, Sucrose Distearate, Glycerin, Dicaprylyl Carbonate, Isoamyl Laurate, Sucrose Stearate, Butyrospermum Parkii (Shea) Butter➀, Sodium Levulinate, Palmitic Acid, Stearic Acid, Xanthan Gum, Parfum, Sodium Anisate, Argania Spinosa (Argan) Kernel Oil➀, Persea Gratissima (Avocado) Oil➀, Simmondsia Chinensis (Jojoba) Seed Oil➀, Lactic Acid, Centaurea Cyanus (Cornflower) Flower Extract➀, Paeonia Lactiflora (Peony) Root Extract, Ascorbyl Palmitate, Sodium Phytate, Tocopherol, Linalool➁, Limonene➁, Benzyl Salicylate➁, Citral➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 99% Origine biologique du total 15% All Natural You won't be finding any artificial dyes, synthetic fragrances, parabens, or sulfates in our skincare products. Our beauty product range is organic or natural certified according to the international COSMOS-standard by ECOCERT Greenlife. Our product formulas contain natural ingredients source",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/lait-nettoyant-doux.jpg",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/lait-nettoyant-doux"
  },
  {
    "slug": "huile-visage-nourrissante-2",
    "code": "A5818",
    "nom": "Huile visage nourrissante",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": 11.33,
    "prix_conseilles": {
      "milieu": 30,
      "bio": 48,
      "luxe": 61
    },
    "certifications": [
      "Sans gluten",
      "Végétalien",
      "Certifié biologique"
    ],
    "star_features": [
      "Certifiée biologique",
      "Vegan",
      "Nourrissante"
    ],
    "description": "Cet incroyable mélange de 11 huiles et extraits certifiés biologiques apporte la cure de nutriments et de vitamines dont votre peau a besoin pour un teint sain et éclatant. Nourrit intensément, laissant la peau douce et revitalisée. Appliquer sur peau propre. Éviter tout contact direct avec les yeux.",
    "ingredients": "Huile de jojoba, Extrait de baies, Huile d’argan, Huile d’avocat",
    "arome": "Fruits secs orientaux et notes épicées",
    "inci": "Simmondsia Chinensis (Jojoba) Seed Oil➀, Decyl Cocoate, Solanum Lycopersicum (Tomato) Fruit Extract➀, Hippophae Rhamnoides (Sea Buckthorn) Fruit Extract➀, Undecane, Tridecane, Argania Spinosa (Argan) Kernel Oil➀, Rubus Chamaemorus (Cloudberry) Fruit Extract➀, Tocopherol, Persea Gratissima (Avocado) Oil➀, Prunus Amygdalus (Almond) Dulcis Oil➀, Prunus Armeniaca (Apricot) Kernel Oil➀, Parfum, Borago Officinalis (Borage) Seed Oil➀, Oenothera Biennis (Evening Primrose) Oil➀, Prunus Domestica (Plum) Seed Oil, Vaccinium Myrtillus (Blueberry) Seed Oil➀, Linalool➁, Limonene➁, Citronellol➁, Geraniol➁ ➀ Ingredients from organic farming ➁ From natural essential oils Origine naturelle du total 100% Origine biologique du total 63% All Natural Vous ne trouverez aucun colorant artificiel, parfum synthétique, parabène ou sulfate dans nos produits de soin. Notre gamme de produits de beauté est certifiée biologique ou naturelle selon le référentiel international COSMOS par ECOCERT Greenlife. Nos formules",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/huile-visage-nourrissante-2.png",
    "url": "https://www.biolystes.com/fr/private-label-products/soins-du-visage/huile-visage-nourrissante-2"
  },
  {
    "slug": "le-duo-réparation-&-brillance",
    "code": "S0099",
    "nom": "Le Duo Réparation & Brillance",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 17.33,
    "prix_conseilles": {
      "milieu": 56,
      "bio": 89,
      "luxe": 115
    },
    "certifications": [],
    "star_features": [
      "Ajoute de la brillance Adoucit les cheveux"
    ],
    "description": "Redonnez vie aux cheveux ternes et abîmés avec notre Duo Réparation & Brillance personnalisable. Disponible pour les commandes standard et en dropshipping. Ce duo réparateur nourrit, lisse et ravive la brillance naturelle, pour des cheveux plus sains et plus doux à chaque utilisation. Présenté dans une boîte noire avec une manche personnalisable, c’est le complément parfait à la ligne capillaire haut de gamme de votre marque. Ce qu'il y a à l'intérieur : Après-Shampooing Hydratant : Hydrate en profondeur et adoucit les cheveux tout en améliorant leur texture et leur maniabilité. Brume Capillaire Sans Rinçage à la Kératine : Apporte de la kératine pour une douceur, une brillance et un contrôle des frisottis instantanés. Le Duo Réparation & Brillance est idéal pour la vente en salon, les coffrets cadeaux saisonniers ou comme point d’entrée pour les clients recherchant des cheveux sains et brillants.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/leduoreparationbrillance.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/le-duo-réparation-&-brillance"
  },
  {
    "slug": "coffret-renaissance-capillaire",
    "code": "S0098",
    "nom": "Coffret Renaissance Capillaire",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 17.33,
    "prix_conseilles": {
      "milieu": 56,
      "bio": 89,
      "luxe": 115
    },
    "certifications": [],
    "star_features": [
      "Ajoute du volume",
      "lisse"
    ],
    "description": "Revitalisez et transformez les cheveux fatigués avec notre Coffret Renaissance Capillaire personnalisable. Disponible pour les commandes standard et en dropshipping. Ce duo régénérant renforce, nourrit et apporte une brillance durable. Conçu pour redonner volume et vitalité, il est idéal pour les marques souhaitant offrir une expérience capillaire de qualité professionnelle. Présenté dans une boîte noire avec une manche personnalisable pour mettre en valeur l’identité unique de votre marque. Ce qu'il y a à l'intérieur : Shampooing Hydratant : Nettoie et revitalise les cheveux des racines jusqu’aux pointes, pour des mèches plus épaisses et plus saines. Brume Capillaire Sans Rinçage à la Kératine : Lisse les frisottis et intensifie la brillance grâce à la kératine pour une finition brillante digne d’un salon. Le Coffret Renaissance Capillaire est parfait pour les collections capillaires, les cadeaux clients ou les coffrets découverte pour nouveaux acheteurs.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/coffret-renaissance-capillaire.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/coffret-renaissance-capillaire"
  },
  {
    "slug": "duo-corps-peaux-sensibles",
    "nom": "Duo Corps Peaux Sensibles",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": null,
    "prix_conseilles": {
      "milieu": 56,
      "bio": 89,
      "luxe": 115
    },
    "certifications": [],
    "star_features": [
      "Hydratation profonde apaise et hydrate"
    ],
    "description": "Offrez un soin doux et quotidien pour les peaux délicates avec notre Duo Corps Peaux Sensibles personnalisable. Disponible pour les commandes standard et en dropshipping. Ce duo apaisant est conçu pour nettoyer et nourrir les peaux sensibles sans provoquer d’irritation. Enrichi en ingrédients doux et respectueux de la peau, il laisse la peau souple, équilibrée et hydratée. Présenté dans une boîte noire avec une manche personnalisable pour mettre en valeur l’identité de votre marque. Ce qu'il y a à l'intérieur : Gel Lavant Mains & Corps au Pamplemousse : Nettoie en douceur sans dessécher, laissant la peau fraîche et subtilement parfumée de notes naturelles de pamplemousse. Crème Corps Peaux Sensibles : Apaise et hydrate grâce à une texture légère et non grasse, aidant à restaurer la barrière cutanée. Le Duo Corps Peaux Sensibles est parfait pour les boutiques bien-être, les clients de spa ou les marques qui souhaitent promouvoir des soins corporels doux au quotidien.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/duocorpspeauxsensibles.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/duo-corps-peaux-sensibles",
    "status": "retired"
  },
  {
    "slug": "duo-performance-anti-age-2",
    "code": "S0015",
    "nom": "Duo Performance Anti-Âge",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 22.67,
    "prix_conseilles": {
      "milieu": 60,
      "bio": 95,
      "luxe": 122
    },
    "certifications": [],
    "star_features": [
      "Hydratation",
      "Atténue les ridules",
      "Lisse"
    ],
    "description": "Le Duo Performance est un ensemble de soins haut de gamme conçu pour lisser, raffermir et rajeunir la peau. Présenté dans une boîte élégante et entièrement personnalisable, il offre un aspect professionnel et soigné à votre marque. Ce qu'il y a à l'intérieur : Sérum anti-âge aux peptides : Un sérum haute performance infusé de peptides et d'acide hyaluronique. Cette formule aide à réduire l'apparence des rides, à améliorer l'élasticité de la peau et à fournir une hydratation profonde. Crème de jour anti-âge : Une crème veloutée et nourrissante pour le visage, enrichie d'actifs marins et d'acide hyaluronique à poids moléculaire multiple pour affiner la texture de la peau et offrir une hydratation durable. Offrez à vos clients une expérience anti-âge luxueuse grâce à ce duo d'experts !",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/duoperformanceantiage.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/duo-performance-anti-age-2"
  },
  {
    "slug": "duo-de-routine-contre-les-taches-brunes-2",
    "code": "S0012",
    "nom": "Duo de routine contre les taches brunes",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 22.67,
    "prix_conseilles": {
      "milieu": 60,
      "bio": 95,
      "luxe": 122
    },
    "certifications": [],
    "star_features": [
      "Anti-taches de pigmentation",
      "Favorise un teint uniforme",
      "Éclat de santé"
    ],
    "description": "Améliorez vos routines de soins avec le Duo de routine contre les taches brunes, une combinaison puissante pour un teint plus lumineux et plus uniforme. Ce coffret est présenté dans une magnifique boîte personnalisable, sur laquelle votre marque est imprimée directement pour une présentation professionnelle et haut de gamme. A l'intérieur de la boîte : Sérum perfecteur de pigment : Un sérum léger conçu pour cibler les taches brunes et favoriser un teint uniforme. Le Sodium PCA améliore l'équilibre hydrique de la peau et aide à maintenir un teint lisse et souple. Sérum à la vitamine C : Mélange puissant de 2 % de vitamine C naturelle, d'acide férulique et d'argousier, ce booster énergisant aide à protéger la peau contre les agressions extérieures tout en éclaircissant et en unifiant le teint. Aidez vos clients à retrouver un teint radieux et jeune grâce à cet ensemble de routine anti-taches formulé par des experts.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/duoderoutinecontrelestachesbrunes.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/duo-de-routine-contre-les-taches-brunes-2"
  },
  {
    "slug": "le-duo-dhydratation-ultime",
    "code": "S0014",
    "nom": "Le duo d'hydratation ultime",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 22.67,
    "prix_conseilles": {
      "milieu": 60,
      "bio": 95,
      "luxe": 122
    },
    "certifications": [],
    "star_features": [
      "Hydratation",
      "Atténue les ridules",
      "Léger"
    ],
    "description": "Le coffret de soins parfait pour une hydratation en profondeur. Présenté dans un coffret moderne et personnalisable, ce duo est conçu pour les entreprises qui souhaitent offrir des solutions d'hydratation de haute qualité. Ce coffret comprend Gel Booster Double hydratation : Un gel rafraîchissant à base d'acide hyaluronique à poids moléculaire multiple qui emprisonne l'hydratation et améliore la fermeté naturelle de la peau. Sérum hydratant : Un sérum léger, à absorption rapide, qui hydrate la peau tout au long de la journée pour lui donner un aspect frais et radieux. Un set indispensable pour les clientes à la recherche d'une hydratation profonde et durable.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/leduodhydratationultime.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/le-duo-dhydratation-ultime"
  },
  {
    "slug": "boite-de-collection-pour-le-teint-clair",
    "code": "S0005",
    "nom": "Boîte de collection pour le teint clair",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 31.67,
    "prix_conseilles": {
      "milieu": 84,
      "bio": 133,
      "luxe": 171
    },
    "certifications": [],
    "star_features": [
      "Pour les peaux sujettes à l'acné",
      "les soins anti-âge"
    ],
    "description": "Améliorez votre routine de soins avec le Boîte de Collection Teint Clair, un trio bien pensé qui cible les peaux sujettes aux imperfections et apporte des bénéfices anti-âge tout en favorisant l'hydratation et l'équilibre. Ce qu'il y a à l'intérieur : Gel clarifiant : Un nettoyant doux mais puissant qui élimine les impuretés et laisse à la peau une sensation de fraîcheur et d'équilibre. Crème de jour anti-âge : Une crème veloutée pour le visage conçue pour favoriser un grain de peau plus lisse, réduire l'apparence des ridules et améliorer la fermeté et l'éclat de la peau. Natural Retinol Alternative Oil Serum : Un sérum huileux luxueux à base de bakuchiol qui améliore l'élasticité de la peau et revitalise les peaux ternes ou matures pour une apparence rajeunie. Proposé dans un coffret noir avec une pochette, ce coffret est personnalisable, ce qui permet à votre marque de se démarquer sur le marché concurrentiel de la beauté.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/boitedecollectionpourleteintclair.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/boite-de-collection-pour-le-teint-clair"
  },
  {
    "slug": "boite-de-collection-eclat-intemporel",
    "code": "S0006",
    "nom": "Boîte de collection Eclat intemporel",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 35.67,
    "prix_conseilles": {
      "milieu": 94,
      "bio": 150,
      "luxe": 193
    },
    "certifications": [],
    "star_features": [
      "Soins anti-âge",
      "hydratation profonde",
      "peau éclatante"
    ],
    "description": "Complétant parfaitement vos solutions de soins efficaces, le coffret Timeless Radiance Collection Box offre une peau radieuse simple mais efficace. Ce coffret trio opère sa magie en purifiant, en hydratant et en gardant la peau pulpeuse tout au long de la journée. Jetez un coup d'œil à l'intérieur : Démaquillant biphasé : Une combinaison de phases à base d'huile et à base d'eau pour un démaquillage efficace et sans effort. Gel hydratant double boost : Ce gel rajeunissant à base d'acide hyaluronique de poids moléculaire multiple forme une barrière d'hydratation sur la peau, renforçant ainsi son élasticité et sa fermeté naturelles. Crème de jour anti-âge 15ml : Infusée d'extrait de ferment d'alteromonas, cette crème unifie la texture de la peau, la rendant plus lisse et plus ferme. Proposé dans un coffret noir avec une pochette, ce coffret est personnalisable, ce qui permet à votre marque de se démarquer sur le marché concurrentiel de la beauté.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/boitedecollectioneclatintemporel.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/boite-de-collection-eclat-intemporel"
  },
  {
    "slug": "boite-de-collection-eclat-rajeunissant",
    "code": "S0004",
    "nom": "Boîte de collection Éclat rajeunissant",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 35.67,
    "prix_conseilles": {
      "milieu": 94,
      "bio": 150,
      "luxe": 193
    },
    "certifications": [],
    "star_features": [
      "Hydratation en profondeur",
      "Hydratation renforcée",
      "Texture légère"
    ],
    "description": "Améliorez votre gamme de soins de la peau avec le Boîte de Collection Éclat Rajeunissant, conçu pour un nettoyage en profondeur, une hydratation et un éclat défiant l'âge. Disponible pour les commandes standard et en dropshipping.\n\nLe Boîte de Collection Éclat Rajeunissant offre trois produits de haute performance conçus pour purifier, nourrir et éclaircir la peau pour un éclat rafraîchissant et juvénile. Présenté dans un coffret noir avec une pochette, ce coffret peut être personnalisé pour mettre en valeur l'identité de votre marque et se démarquer sur le marché de la beauté. Le coffret comprend Mousse purifiante : Nettoyant à la texture innovante qui dissout les impuretés, aide à éliminer l'excès de sébum et hydrate le visage sans obstruer les pores. Sérum à l'huile alternative au rétinol naturel : Le Bakuchiol, reconnu comme l'alternative douce au rétinol, aide à atténuer les ridules et à raviver l'éclat de la jeunesse de la peau. Crème éclaircissante pour les yeux : Un mélange de trois ingrédients végétaux biologiques aide à réduire les poches, les cernes et la sécheresse. La boîte de collection de produits permet à votre marque d'offrir des cadeaux personnalisés et attentionnés, des éditions saisonnières, des éditions limitées, etc.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/boitedecollectioneclatrajeunissant.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/boite-de-collection-eclat-rajeunissant"
  },
  {
    "slug": "boite-de-collection-du-trio-anti-age",
    "code": "S0003",
    "nom": "Boîte de collection du trio anti-âge",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 42.83,
    "prix_conseilles": {
      "milieu": 113,
      "bio": 180,
      "luxe": 231
    },
    "certifications": [],
    "star_features": [
      "Hydratation en profondeur",
      "hydratation instantanée",
      "texture légère"
    ],
    "description": "Améliorez votre offre de produits avec la Boîte de collection Trio anti-âge, conçue pour les commandes standard et les livraisons directes. Cette sélection comprend nos produits les plus vendus qui améliorent l'apparence du vieillissement et apportent une hydratation essentielle. Chaque coffret est élégamment emballé dans une boîte noire élégante avec une pochette personnalisable, fournissant la toile parfaite pour mettre en valeur votre marque et captiver les clients sur le marché concurrentiel de la beauté. La collection comprend : Crème de jour anti-âge : Hydrate et protège la peau tout au long de la journée grâce à l'acide hyaluronique à poids moléculaire multiple pour une hydratation et une protection optimales. Sérum aux peptides : Un sérum puissant infusé de peptides anti-âge haute performance pour lisser, repulper et améliorer l'élasticité de la peau. Crème pour les yeux 3-en-1 : Une formule rajeunissante et légère qui va au-delà de l'hydratation de base pour minimiser l'apparence des cernes, des poches et des ridules autour des yeux. La Boîte de Collection Trio Anti-Âge permet à votre marque d'offrir des options de cadeau personnalisées et réfléchies, des sorties saisonnières, des éditions limitées, et bien plus encore.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/boitedecollectiondutrioantiage.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/boite-de-collection-du-trio-anti-age"
  },
  {
    "slug": "boite-de-la-collection-luminous-skin",
    "code": "A5914",
    "nom": "Boîte de la collection Luminous Skin",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 35,
    "prix_conseilles": {
      "milieu": 113,
      "bio": 180,
      "luxe": 231
    },
    "certifications": [],
    "star_features": [
      "Réhydrate",
      "Prévient les cernes",
      "Doux pour la peau"
    ],
    "description": "Faites la promotion de votre marque en offrant à vos clients une peau saine, radieuse et éclatante grâce à notre boîte de collection Luminous Skin soigneusement conçue. Parfait pour les commandes standard et en dropshipping ! Avec notre gamme de produits bien sélectionnés, cette collection est parfaite pour les utilisateurs de maquillage. Elle garantit que la peau est non seulement propre, mais aussi rafraîchie et nourrie à la fin de la journée. Caractéristiques de l'ensemble : Démaquillant biphasé : Grâce à une combinaison de phases à base d'huile et d'eau, cette formule unique élimine le maquillage tout en maintenant une peau apaisée et hydratée. Sérum booster de collagène : Enrichi en extraits de plantes améliorant le collagène, il réduit les rides et ridules pour une peau plus lisse, plus ferme et plus raffinée. Crème éclaircissante pour les yeux : Revitalise instantanément le contour des yeux, en réduisant les cernes et les poches, pour un regard plus jeune. La boîte de collection de produits permet à votre marque d'offrir des cadeaux attentionnés et personnalisés, des éditions saisonnières, des éditions limitées, etc.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/boitedelacollectionluminousskin.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/boite-de-la-collection-luminous-skin"
  },
  {
    "slug": "boite-de-collection-trio-glowy-skin",
    "code": "A5925",
    "nom": "Boîte de collection Trio Glowy Skin",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 35.67,
    "prix_conseilles": {
      "milieu": 94,
      "bio": 150,
      "luxe": 193
    },
    "certifications": [],
    "star_features": [
      "Nourrissant",
      "Hydratant"
    ],
    "description": "Améliorez votre offre de soins avec la boîte de collection Glowy Skin Trio, conçue pour offrir une peau douce et soignée. Utilisable en toute sécurité par tous les types de peau - une routine adaptée à chacun, tous les jours. Points forts du produit : Lait démaquillant doux : d'une texture douce et soyeuse, il est parfait pour éliminer les impuretés tout en nourrissant la peau. Crème de jour hydratante : Une crème pour le visage à absorption rapide, enrichie d'acide hyaluronique multimoléculaire et d'extraits de plantes, qui laisse la peau fraîche, rebondie et rafraîchie toute la journée. Huile nourrissante pour le visage : Une huile polyvalente qui hydrate, revitalise et rehausse l'éclat naturel de la peau. Cette collection haut de gamme est conçue pour offrir un mélange homogène de nettoyage et d'hydratation, ce qui en fait le soin quotidien idéal.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/boitedecollectiontrioglowyskin.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/boite-de-collection-trio-glowy-skin"
  },
  {
    "slug": "boite-de-collection-hydratation-profonde",
    "code": "A5913",
    "nom": "Boîte de collection Hydratation profonde",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 37.75,
    "prix_conseilles": {
      "milieu": 100,
      "bio": 159,
      "luxe": 204
    },
    "certifications": [],
    "star_features": [
      "Hydratation",
      "Atténuation des ridules",
      "Douceur pour les peaux sèches",
      "Protection"
    ],
    "description": "Réapprovisionnez et restaurez votre peau avec Boîte de collection Hydratation profonde, un trio de produits essentiels conçus pour hydrater, nourrir et éclaircir la peau en profondeur. Parfait pour la vente au détail et le dropshipping, ce coffret bien pensé est idéal pour améliorer toute routine de soins de la peau. Le coffret comprend Crème riche nourrissante : Une crème profondément hydratante qui restaure la barrière cutanée pour assurer une protection tout au long de la journée. Gel Double Hydratation Boost : Il apporte une hydratation instantanée, laissant la peau douce, rebondie et rafraîchie. Crème contour des yeux éclaircissante : Cible la zone délicate des yeux pour réduire l'apparence des cernes et des poches. La boîte de collection de produits permet à votre marque d'offrir des cadeaux attentionnés et personnalisés, des éditions saisonnières, des éditions limitées, etc.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/boitedecollectionhydratationprofonde.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/boite-de-collection-hydratation-profonde"
  },
  {
    "slug": "la-boite-de-collection-ultime-pour-le-renouveau",
    "code": "A5912",
    "nom": "La Boîte de Collection Ultime pour le Renouveau",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 37.75,
    "prix_conseilles": {
      "milieu": 100,
      "bio": 159,
      "luxe": 204
    },
    "certifications": [],
    "star_features": [
      "Hydratation",
      "Atténuation des ridules"
    ],
    "description": "Améliorez votre offre de produits avec La Boîte de Collection Ultime pour le Renouveau, un ensemble soigneusement conçu pour hydrater, lisser et renouveler la peau. Idéal pour la vente au détail ou en dropshipping, ce coffret personnalisable est parfait pour rehausser votre marque tout en répondant aux besoins des adeptes des soins de la peau. La Boîte de Collection Ultime pour le Renouveau comprend trois produits qui agissent ensemble pour donner à la peau un aspect radieux et sain : Double Hydration Boost Gel : Gel rajeunissant à base d'acide hyaluronique de poids moléculaire multiple. Peptide Serum : Sérum lissant pour la peau, enrichi d'ingrédients anti-âge de haute performance pour donner à la peau un aspect plus rebondi et favoriser son élasticité. AHA Peeling Concentrate : Peeling doux formulé avec 10 % d'acide lactique qui élimine les cellules mortes et favorise le renouvellement de la peau. La boîte de collection de produits permet à votre marque d'offrir des cadeaux attentionnés et personnalisés, des éditions saisonnières, des éditions limitées, etc.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/laboitedecollectionultimepourlerenouveau.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/la-boite-de-collection-ultime-pour-le-renouveau"
  },
  {
    "slug": "boite-de-collection-de-routine-de-nuit-au-collagene",
    "code": "A5911",
    "nom": "Boîte de Collection de Routine de Nuit au Collagène",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 35,
    "prix_conseilles": {
      "milieu": 113,
      "bio": 180,
      "luxe": 231
    },
    "certifications": [],
    "star_features": [
      "Texture innovante à absorption rapide",
      "Reconstitue l'hydratation"
    ],
    "description": "Améliorez votre offre de soins de la peau avec Boîte de Collection de Routine de Nuit au Collagène, soigneusement conçu pour le rajeunissement nocturne. Idéal pour les commandes standard au détail et en dropshipping, ce coffret est parfait pour ceux qui souhaitent s'offrir un rituel de beauté haut de gamme à base de collagène. Cette luxueuse collection est conçue pour restaurer et revitaliser la peau pendant la nuit, en favorisant un teint hydraté, lisse et jeune. Chaque produit agit en synergie pour cibler les signes du vieillissement, laissant la peau rafraîchie et renouvelée dès le matin. Présenté dans une élégante boîte noire avec une pochette personnalisable, Boîte de Collection de Routine de Nuit au Collagène est parfait pour mettre en avant votre marque et vous démarquer sur le marché concurrentiel de la beauté. Le coffret comprend : Collagen Anti-Age Night Cream: Réduit les signes du vieillissement tout en hydratant et en raffermissant la peau en profondeur. Collagen Boost Serum: Enrichi d'une dose d'actifs puissants qui aident à soutenir le collagène pour une peau d'apparence plus jeune. Smoothing Eye Cream: Réduit l'apparence des ridules et des poches tout en nourrissant en profondeur la zone délicate du contour de l'œil. La boîte de collection de produits permet à votre marque d'offrir des cadeaux attentionnés et personnalisés, des éditions saisonnières, des éditions limitées, etc.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/boite-de-collection-de-routine-de-nuit-au-collagene.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/boite-de-collection-de-routine-de-nuit-au-collagene"
  },
  {
    "slug": "boite-de-collection-eclat-quotidien-2",
    "code": "A5905",
    "nom": "Boîte de collection Éclat quotidien",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 35.67,
    "prix_conseilles": {
      "milieu": 94,
      "bio": 150,
      "luxe": 193
    },
    "certifications": [],
    "star_features": [
      "Hydratation en profondeur",
      "peau éclatante",
      "apaise et hydrate",
      "laisse la peau soyeuse."
    ],
    "description": "Apportez de la fraîcheur à votre entreprise de soins de la peau avec notre boîte de collection Daily Radiance personnalisable. Disponible pour les commandes standard et en dropshipping.\n\nUn coffret de soins radieux composé de nos produits les plus performants, conçus pour nettoyer, hydrater et rajeunir la peau. Ce trio laisse la peau éclatante et revitalisée tout au long de la journée. Parfait pour obtenir un teint sain et lumineux. Présenté dans un coffret noir avec une pochette, il peut être personnalisé pour mettre en valeur l'identité de votre marque et se démarquer sur le marché de la beauté. Caractéristiques du coffret : Huile pour le visage tout-en-un: Associée à des huiles de graines de jojoba, d'avocat, d'amande, d'argousier et bien d'autres encore, cette huile polyvalente pour le visage hydrate la peau et lui donne un aspect énergique. Crème de jour hydratante 15ml: Formulée avec de l'acide hyaluronique à poids moléculaire multiple et du bisabolol apaisant, cette crème hydratante soyeuse hydrate et nourrit instantanément la peau. Mousse nettoyante: Enrichie en eau de fleur de rose, en extrait de camomille et en extrait de calendula, cette mousse nettoyante douce et légère aide à éliminer le maquillage et les impuretés, laissant la peau fraîche et souple. Product Collection Box permet à votre marque d'offrir des cadeaux personnalisés et attentionnés, des éditions saisonnières, des éditions limitées, etc.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/boitedecollectioneclatquotidien.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/boite-de-collection-eclat-quotidien-2"
  },
  {
    "slug": "boite-de-collection-rituel-dhydratation",
    "code": "A5907",
    "nom": "Boîte de collection Rituel d'hydratation",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 37.75,
    "prix_conseilles": {
      "milieu": 100,
      "bio": 159,
      "luxe": 204
    },
    "certifications": [],
    "star_features": [
      "Hydratation en profondeur",
      "laisse la peau douce et soyeuse"
    ],
    "description": "Introduisez un rituel d'hydratation dans votre ligne de soins avec ce coffret de collection Rituel d'hydratation personnalisable. Disponible pour les commandes standard et en dropshipping.\n\nCe trio de soins ultra-hydratants est conçu pour nettoyer, hydrater et renforcer l'hydratation de la peau, la laissant douce et régénérée. Il est parfait pour garantir une hydratation durable et un éclat radieux. Présenté dans un coffret noir avec une pochette, il peut être personnalisé pour mettre en valeur l'identité de votre marque et se démarquer sur le marché de la beauté. Le coffret comprend: Nettoyant Oil-to-Milk: La texture riche et huileuse se transforme en lait soyeux et dissout le maquillage et les impuretés, laissant la peau fraîche, douce et nourrie sans la déshydrater. Crème de jour hydratante 15ml: Infusée d'acide hyaluronique multi-moléculaire et de bisabolol pour une hydratation et un confort en profondeur. Gel Double Hydratation Boost: L'acide hyaluronique de poids moléculaire multiple aide à former une barrière d'hydratation sur la peau, empêchant la perte d'hydratation et améliorant la plénitude et l'élasticité naturelles de la peau. La boîte de collection de produits permet à votre marque d'offrir des cadeaux attentionnés et personnalisés, des éditions saisonnières, des éditions limitées, etc.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/boitedecollectionritueldhydratation.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/boite-de-collection-rituel-dhydratation"
  },
  {
    "slug": "boitier-de-collection-boost-serum",
    "code": "A5902",
    "nom": "Boîtier de collection Boost Serum",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 35,
    "prix_conseilles": {
      "milieu": 113,
      "bio": 180,
      "luxe": 231
    },
    "certifications": [],
    "star_features": [
      "Hydratation en profondeur",
      "texture légère et luxueuse qui laisse la peau douce comme de la soie."
    ],
    "description": "Améliorez votre activité dans le domaine des soins de la peau grâce à notre boîte de collection de produits Boost Serum personnalisable. Disponible pour les commandes standard et en dropshipping. Une sélection incontournable de nos sérums les plus performants qui améliorent l'élasticité et la fermeté de la peau. Emballé dans un coffret noir avec une pochette, qui peut être personnalisé pour mettre en valeur l'identité de votre marque et se démarquer sur le marché de la beauté. Le coffret compren",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/boitier-de-collection-boost-serum",
    "image_a_venir": true,
    "image_a_refaire": true
  },
  {
    "slug": "boite-de-collection-acne-care-2",
    "code": "A5901",
    "nom": "Boîte de collection Acné Care",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 29.17,
    "prix_conseilles": {
      "milieu": 94,
      "bio": 150,
      "luxe": 193
    },
    "certifications": [],
    "star_features": [
      "Pour les peaux sujettes à l'acné",
      "texture luxueuse",
      "hydratante"
    ],
    "description": "Améliorez votre activité dans le domaine des soins de la peau avec notre boîte de collection de produits de soins de l'acné personnalisable. Disponible pour les commandes standard et en dropshipping. Sélection soigneusement étudiée de nos produits de haute qualité qui aident efficacement à réduire les rougeurs autour des boutons et à calmer les peaux sujettes à l'acné. Emballé dans un coffret noir avec une pochette, qui peut être personnalisé pour mettre en valeur l'identité de votre marque et se démarquer sur le marché de la beauté. Caractéristiques du coffret: Mousse nettoyante: Mousse nettoyante douce et légère, qui aide à éliminer le maquillage et les impuretés, laissant la peau fraîche et souple. Concentré gommant AHA: Aide à éliminer les cellules mortes et favorise le renouvellement de la peau, révélant une peau fraîche et éclatante. Soin des taches d'acné: Calme la peau et réduit les rougeurs autour de l'imperfection. Notre formule contribue à vous donner une peau claire et d'apparence saine. Product Collection Box permet à votre marque d'offrir des cadeaux personnalisés et attentionnés, des éditions saisonnières, des éditions limitées, etc.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/boitedecollectionacnecare.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/boite-de-collection-acne-care-2"
  },
  {
    "slug": "boite-de-collection-anti-age-2",
    "code": "A5900",
    "nom": "Boîte de collection anti-âge",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 39.75,
    "prix_conseilles": {
      "milieu": 105,
      "bio": 167,
      "luxe": 215
    },
    "certifications": [],
    "star_features": [
      "Hydratation en profondeur",
      "hydratation instantanée",
      "texture légère"
    ],
    "description": "Améliorez votre activité dans le domaine des soins de la peau grâce à notre boîte de collection de produits anti-âge personnalisable. Disponible pour les commandes standard et les livraisons directes. Nous avons sélectionné nos meilleurs produits qui aideront à combattre les signes de l'âge et offriront à la peau un regain d'hydratation bien nécessaire. Le coffret est emballé dans une boîte noire avec une pochette qui peut être personnalisée pour mettre en valeur l'identité de votre marque et vous démarquer sur le marché de la beauté. Le coffret comprend Crème de jour anti-âge: Hydrate et protège la peau tout au long de la journée grâce à l'acide hyaluronique à poids moléculaire multiple. Sérum peptidique: Sérum lissant pour la peau, enrichi d'ingrédients anti-âge de haute performance pour donner à la peau un aspect plus rebondi et favoriser son élasticité. Crème lissante pour les yeux: Cible les rides et ridules du contour de l'œil et donne un aspect plus jeune à la peau. La boîte de collection de produits permet à votre marque d'offrir des cadeaux attentionnés et personnalisés, des éditions saisonnières, des éditions limitées, etc.",
    "ingredients": "Divers",
    "arome": "Divers",
    "inci": "Divers Produits durables Les produits sont fabriqués à l'aide de processus de production et de traitement respectueux de l'environnement, de la santé humaine et des ressources naturelles. Les formulations sont développées en appliquant le concept de formulation verte. Les ingrédients utilisés dans les produits sont fabriqués dans le respect de la biodiversité. Il n'y a pas d'ingrédients OGM dans les produits. Les emballages sont recyclables. Les emballages de transport sont fabriqués à partir de matériaux recyclés.",
    "image": "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/boitedecollectionantiage.png",
    "url": "https://www.biolystes.com/fr/private-label-products/collection-box/boite-de-collection-anti-age-2"
  },
  {
    "slug": "shampooing-pour-cuir-chevelu-sensible",
    "code": "A5939",
    "nom": "Shampooing pour cuir chevelu sensible",
    "categorie": "soins-du-cheveu",
    "volume": "400 ml",
    "prix_ht": 11.42,
    "prix_conseilles": {
      "milieu": 24,
      "bio": 38,
      "luxe": 52
    },
    "certifications": [
      "Testé dermatologiquement",
      "Sans noix",
      "Végétalien",
      "Certifié naturel",
      "Sans allergène sur l'étiquette"
    ],
    "star_features": [
      "Pour cuir chevelu sensible",
      "Nourrit les cheveux",
      "Délicatement parfumé"
    ],
    "description": "Proposez une nouvelle option de soins capillaires qui offrira un traitement doux et apaisant. Ce shampooing est formulé de manière experte pour prendre soin des peaux sèches et sensibles. Ce shampooing doux mais efficace convient à tous les types de peau, ce qui en fait le choix idéal pour les personnes dont le cuir chevelu est délicat ou facilement irrité. Certifié par COSMOS Natural, il garantit les normes les plus élevées en matière d'ingrédients naturels et respectueux de l'environnement. Permettez à vos clients de bénéficier d'un cuir chevelu équilibré et confortable et de cheveux d'apparence plus saine à chaque lavage.",
    "ingredients": "Bétaïne, Protéine de blé, Extrait de fleur, Extrait de fruit, Extrait de plante",
    "arome": "Arôme de fleurs blanches avec des notes aquatiques et de fruits rouges sur un fond gourmand légèrement sucré.",
    "inci": "INGRÉDIENTS / INCI : Aqua, Sodium Coco-Sulfate, Cocamidopropyl Betaine, Coco-Glucoside, Betaine, Glyceryl Oleate, Prunus Domestica (Plum) Fruit Extract➀, Sodium Chloride, Citric Acid, Parfum, Benzyl Alcohol, Hydrolyzed Wheat Protein, Tilia Cordata (Linden) Flower Extract➀, Sodium Benzoate, Potassium Sorbate, Jasminum Officinale (Jasmin) Extract, Leuconostoc/Radish Root Ferment Filtrate. ➀ Ingrédient issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/shampooing-pour-cuir-chevelu-sensible.png",
    "url": "https://biolystes.com/fr/private-label-products/soins-du-cheveu/shampooing-pour-cuir-chevelu-sensible"
  },
  {
    "slug": "brume-capillaire-sans-rincage-keratin-shine",
    "code": "A5938",
    "nom": "Brume capillaire sans rinçage Keratin Shine",
    "categorie": "soins-du-cheveu",
    "volume": "100 ml",
    "prix_ht": 10.58,
    "prix_conseilles": {
      "milieu": 22,
      "bio": 35,
      "luxe": 48
    },
    "certifications": [],
    "star_features": [
      "Apporte de la brillance",
      "Adoucit les cheveux"
    ],
    "description": "Un produit de soin capillaire conçu pour revitaliser et protéger. La solution professionnelle pour les cheveux abîmés, frisés ou fragiles. La brume légère sans rinçage à la kératine, infusée de kératine hydrolysée, d'acide lactique et d'extraits d'algues, agit pour lisser, renforcer et démêler les cheveux abîmés. Sa formule aide à réduire les cassures et les pointes fourchues, laissant les cheveux plus sains, plus doux et plus faciles à coiffer. Il suffit de vaporiser sur les cheveux propres et humides - aucun rinçage n'est nécessaire.",
    "ingredients": "Kératine, Acide lactique",
    "arome": "Arôme frais et aquatique avec des notes délicates de pétales floraux sur un fond fruité et vanillé.",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Butylene Glycol, Parfum/Fragrance, Sodium Levulinate, Hydrolyzed Keratin, Sodium Benzoate, Lactic Acid, Phenethyl Alcohol, Furcellaria Lumbricalis Extract, Leuconostoc/Radish Root Ferment Filtrate, Linalool➀, Limonene➀, Citrus Aurantium Peel Oil, Citrus Limon Peel Oil, Citronellol➀, Pelargonium Graveolens Flower Oil, Pinene➀. ➀ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/brume-capillaire-sans-rincage-keratin-shine.png",
    "url": "https://biolystes.com/fr/private-label-products/soins-du-cheveu/brume-capillaire-sans-rincage-keratin-shine"
  },
  {
    "slug": "huile-fortifiante-pour-cheveux-et-cuir-chevelu-au-romarin",
    "code": "A5873",
    "nom": "Huile fortifiante pour cheveux et cuir chevelu au romarin",
    "categorie": "soins-du-cheveu",
    "volume": "30 ml",
    "prix_ht": 9.92,
    "prix_conseilles": {
      "milieu": 21,
      "bio": 34,
      "luxe": 46
    },
    "certifications": [
      "Sans gluten",
      "Végétalien"
    ],
    "star_features": [
      "Nourrit les cheveux et le cuir chevelu",
      "Donne de la brillance et un éclat sain"
    ],
    "description": "Une solution naturelle pour nourrir le cuir chevelu et redonner de la vigueur aux cheveux. Cette huile riche en nutriments, infusée d'huiles de romarin et de menthe poivrée, nourrit le cuir chevelu, améliore la résistance des cheveux et redonne de l'éclat aux cheveux secs ou cassants. Appliquer simplement sur le cuir chevelu et les cheveux et laisser agir pendant au moins 15 minutes avant de laver.",
    "ingredients": "Huile de romarin, Huile d'amande, Huile de menthe poivrée",
    "arome": "Menthe poivrée et romarin sur une base douce de vanille et de bois de santal",
    "inci": "INGRÉDIENTS / INCI : Helianthus Annuus (Sunflower) Seed Oil➀, Decyl Cocoate, Ricinus Communis (Castor) Seed Oil➀, Prunus Amygdalus Dulcis (Sweet Almond) Oil➀, Argania Spinosa (Argan) Kernel Oil➀, Parfum/Fragrance, Cannabis Sativa (Hemp) Seed Oil➀, Olea Europaea (Olive) Fruit Oil➀, Persea Gratissima (Avocado) Oil➀, Mentha Piperita (Peppermint) Oil➀, Rosmarinus Officinalis (Rosemary) Leaf Oil➀, Urtica Dioica (Nettle) Leaf Extract➀, Menthol➁, Limonene➁, Camphor➁, Pinene➁, Citrus Aurantium Bergamia Peel Oil, Linalool➁, Beta-Caryophyllene➁, Vanillin, Linalyl Acetate➁, Eugenia Caryophyllus Oil, Eugenol➁, Citrus Aurantium Peel Oil, Citrus Limon Peel Oil, Pogostemon Cablin Oil, Santalol➁, Coumarin**, Carvone➁. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/huile-fortifiante-pour-cheveux-et-cuir-chevelu-au-romarin.png",
    "url": "https://biolystes.com/fr/private-label-products/soins-du-cheveu/huile-fortifiante-pour-cheveux-et-cuir-chevelu-au-romarin"
  },
  {
    "slug": "serum-naturel-a-base-dhuile-alternatif-au-retinol",
    "code": "A5858",
    "nom": "Sérum naturel à base d'huile alternatif au rétinol",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 13.5,
    "prix_conseilles": {
      "milieu": 36,
      "bio": 57,
      "luxe": 73
    },
    "certifications": [
      "Sans gluten",
      "Sans noix",
      "Végétalien",
      "Certifié biologique"
    ],
    "star_features": [
      "Doux pour la peau",
      "Réduit l'apparence des ridules"
    ],
    "description": "Sérum multifonction à base d'huile, enrichi en bakuchiol et en cynorrhodon pour contribuer à réduire l'apparence des ridules et offrir à la peau une apparence plus souple et plus ferme.",
    "ingredients": "Bakuchiol, Huile de rose musquée, Huile de jojoba, Huile de fraise, Huile d'onagre, Huile de Framboise, Huile de myrtille",
    "arome": "Rose élégante à la chaleur profondément épicée et boisée",
    "inci": "Simmondsia Chinensis (Jojoba) Seed Oil➀, Decyl Cocoate, Dicaprylyl Carbonate, Coco-Caprylate/Caprate, Oenothera Biennis (Evening Primrose) Oil➀, Rosa Canina (Rosehip) Fruit Oil➀, Tocopherol, Fragaria Ananassa (Strawberry) Seed Oil, Rubus Idaeus (Raspberry) Seed Oil➀, Undecane, Bakuchiol, Parfum, Tridecane, Vaccinium Myrtillus (Blueberry) Seed Oil➀, Geraniol, Citronellol, Linalool, Limonene. ➀ Ingrédients issus de l'agriculture biologique. Origine naturelle du total : 99 %. Origine biologique du total : 61 %. Certifié COSMOS ORGANIC par ECOCERT Greenlife.",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-naturel-a-base-dhuile-alternatif-au-retinol.png",
    "url": "https://biolystes.com/fr/private-label-products/soins-du-visage/serum-naturel-a-base-dhuile-alternatif-au-retinol"
  },
  {
    "slug": "huile-visage-tout-en-un",
    "code": "A5853",
    "nom": "Huile visage tout-en-un",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 12.67,
    "prix_conseilles": {
      "milieu": 33,
      "bio": 52,
      "luxe": 67
    },
    "certifications": [
      "Végétalien",
      "Certifié biologique"
    ],
    "star_features": [
      "Multiusage",
      "Éclat et brillance renforcés"
    ],
    "description": "Cette huile multifonction pour le visage hydrate et dynamise votre peau. Appliquez sur une peau propre.",
    "ingredients": "Huile de graines de jojoba, Huile d'avocat, Huile d'amandes, Huile d'onagre, Huile d'argousier, Huile de pépins de framboise",
    "arome": "Mandarine sucrée et fraîche sur un nuage floral",
    "inci": "INGRÉDIENTS / INCI : Simmondsia Chinensis (Jojoba) Seed Oil➀, Decyl Cocoate, Prunus Amygdalus Dulcis (Sweet Almond) Oil➀, Dicaprylyl Carbonate, Rosa Canina (Rosehip) Fruit Extract➀, Coco-Caprylate/Caprate, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil➀, Parfum/Fragrance, Tocopherol, Undecane, Olea Europaea (Olive) Fruit Oil➀, Persea Gratissima (Avocado) Oil➀, Prunus Armeniaca (Apricot) Kernel Oil➀, Tridecane, Oenothera Biennis (Evening Primrose) Oil➀, Prunus Domestica (Plum) Seed Oil, Avena Sativa (Oat) Kernel Oil➀, Rubus Idaeus (Raspberry) Seed Oil➀, Solanum Lycopersicum (Tomato) Fruit Extract➀, Limonene➁, Citrus Aurantium Bergamia Peel Oil, Citrus Aurantium Peel Oil, Citrus Limon Peel Oil, Linalyl Acetate➁, Citronellol➁, Pinene➁, Linalool➁, Geranyl Acetate➁, Geraniol➁, Citral➁, Mentha Viridis Leaf Oil, Terpinolene➁, Carvone➁, Benzyl Salicylate➁. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/huile-visage-tout-en-un.jpg",
    "url": "https://biolystes.com/fr/private-label-products/soins-du-visage/huile-visage-tout-en-un"
  },
  {
    "slug": "mascara-allongeant-et-volumisant",
    "code": "S0034",
    "nom": "Mascara allongeant et volumisant",
    "categorie": "maquillage",
    "volume": "6 ml",
    "prix_ht": 11.08,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Les peptides",
      "Manque de volume"
    ],
    "description": "Mascara allongeant et volumisant aux peptides.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Stearic Acid, Helianthus Annuus (Sunflower) Seed Cera, Glycerin➁, Copernicia Cerifera (Carnauba) Wax, Olea Europaea (Olive) Oil Unsaponifiables, Glyceryl Rosinate, Cellulose, Pentylene Glycol, Pullulan, Octyldodecanol, Glyceryl Stearate, Pisum Sativum Peptide, Polyglyceryl-10 Laurate, Sorbitol, Rhus Verniciflua Peel Cera, Shorea Robusta Resin, Glyceryl Caprylate/Caprate, Palmitic Acid, Potassium Hydroxide, Acacia Senegal Gum, Magnesium Stearate, Xanthan Gum, Trehalose, Citric Acid, Leuconostoc/Radish Root Ferment Filtrate, Ricinus Communis (Castor) Seed Oil➀, CI 77499 (Iron Oxides)➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/mascara-allongeant-et-volumisant.png",
    "url": ""
  },
  {
    "slug": "anti-cernes-correcteur-25-medium-neutral",
    "code": "S0114",
    "nom": "Anti-cernes correcteur : 25 Medium Neutral",
    "categorie": "maquillage",
    "volume": "4 ml",
    "prix_ht": 11.25,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Acide hyaluronique",
      "Peau sensible"
    ],
    "description": "Anti-cernes correcteur teinte 25 Medium Neutral.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Butylene Glycol, Butyrospermum Parkii (Shea) Butter➀, Polyglyceryl-3 Polyricinoleate, Dodecane, Oryza Sativa Powder, Oryza Sativa Bran Oil, Vegetable Oil, Helianthus Annuus Seed Wax, Oryza Sativa Bran Wax, Rhus Succedanea Fruit Wax, Polyglyceryl-3 Diisostearate, Glycerin➁, Sodium PCA, Sodium Chloride, Xanthan Gum, Sodium Dehydroacetate, Lactic Acid, Aluminum Hydroxide, Glycolipids, Paeonia Lactiflora (Peony) Root Extract, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/anti-cernes-correcteur-25-medium-neutral.png",
    "url": ""
  },
  {
    "slug": "anti-cernes-correcteur-05-clair-froid",
    "code": "S0111",
    "nom": "Anti-cernes correcteur : 05 Clair froid",
    "categorie": "maquillage",
    "volume": "4 ml",
    "prix_ht": 11.25,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Acide hyaluronique",
      "Peau sensible"
    ],
    "description": "Anti-cernes correcteur teinte 05 Clair froid.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Butylene Glycol, Butyrospermum Parkii (Shea) Butter➀, Polyglyceryl-3 Polyricinoleate, Dodecane, Oryza Sativa Powder, Oryza Sativa Bran Oil, Vegetable Oil, Helianthus Annuus Seed Wax, Oryza Sativa Bran Wax, Rhus Succedanea Fruit Wax, Polyglyceryl-3 Diisostearate, Glycerin➁, Sodium PCA, Sodium Chloride, Xanthan Gum, Sodium Dehydroacetate, Lactic Acid, Aluminum Hydroxide, Glycolipids, Paeonia Lactiflora (Peony) Root Extract, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/anti-cernes-correcteur-05-clair-froid.png",
    "url": ""
  },
  {
    "slug": "anti-cernes-correcteur-35-deep-neutral",
    "code": "S0115",
    "nom": "Anti-cernes correcteur : 35 Deep Neutral",
    "categorie": "maquillage",
    "volume": "4 ml",
    "prix_ht": 11.25,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Acide hyaluronique",
      "Peau sensible"
    ],
    "description": "Anti-cernes correcteur teinte 35 Deep Neutral.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Butylene Glycol, Butyrospermum Parkii (Shea) Butter➀, Polyglyceryl-3 Polyricinoleate, Dodecane, Oryza Sativa Powder, Oryza Sativa Bran Oil, Vegetable Oil, Helianthus Annuus Seed Wax, Oryza Sativa Bran Wax, Rhus Succedanea Fruit Wax, Polyglyceryl-3 Diisostearate, Glycerin➁, Sodium PCA, Sodium Chloride, Xanthan Gum, Sodium Dehydroacetate, Lactic Acid, Aluminum Hydroxide, Glycolipids, Paeonia Lactiflora (Peony) Root Extract, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/anti-cernes-correcteur-35-deep-neutral.png",
    "url": ""
  },
  {
    "slug": "anti-cernes-correcteur-15-medium-cool",
    "code": "S0113",
    "nom": "Anti-cernes correcteur : 15 Medium Cool",
    "categorie": "maquillage",
    "volume": "4 ml",
    "prix_ht": 11.25,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Acide hyaluronique",
      "Peau sensible"
    ],
    "description": "Anti-cernes correcteur teinte 15 Medium Cool.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Butylene Glycol, Butyrospermum Parkii (Shea) Butter➀, Polyglyceryl-3 Polyricinoleate, Dodecane, Oryza Sativa Powder, Oryza Sativa Bran Oil, Vegetable Oil, Helianthus Annuus Seed Wax, Oryza Sativa Bran Wax, Rhus Succedanea Fruit Wax, Polyglyceryl-3 Diisostearate, Glycerin➁, Sodium PCA, Sodium Chloride, Xanthan Gum, Sodium Dehydroacetate, Lactic Acid, Aluminum Hydroxide, Glycolipids, Paeonia Lactiflora (Peony) Root Extract, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/anti-cernes-correcteur-15-medium-cool.jpg",
    "url": ""
  },
  {
    "slug": "anti-cernes-correcteur-20-medium-warm",
    "code": "S0110",
    "nom": "Anti-cernes correcteur : 20 Moyen chaud",
    "categorie": "maquillage",
    "volume": "4 ml",
    "prix_ht": 11.25,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Acide hyaluronique",
      "Peau sensible"
    ],
    "description": "Anti-cernes correcteur teinte 20 Moyen chaud.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Butylene Glycol, Butyrospermum Parkii (Shea) Butter➀, Polyglyceryl-3 Polyricinoleate, Dodecane, Oryza Sativa Powder, Oryza Sativa Bran Oil, Vegetable Oil, Helianthus Annuus Seed Wax, Oryza Sativa Bran Wax, Rhus Succedanea Fruit Wax, Polyglyceryl-3 Diisostearate, Glycerin➁, Sodium PCA, Sodium Chloride, Xanthan Gum, Sodium Dehydroacetate, Lactic Acid, Aluminum Hydroxide, Glycolipids, Paeonia Lactiflora (Peony) Root Extract, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/anti-cernes-correcteur-20-medium-warm.png",
    "url": ""
  },
  {
    "slug": "anti-cernes-correcteur-10-clair-chaud",
    "code": "S0112",
    "nom": "Anti-cernes correcteur : 10 Clair Chaud",
    "categorie": "maquillage",
    "volume": "4 ml",
    "prix_ht": 11.25,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Acide hyaluronique",
      "Peau sensible"
    ],
    "description": "Anti-cernes correcteur teinte 10 Clair Chaud.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Butylene Glycol, Butyrospermum Parkii (Shea) Butter➀, Polyglyceryl-3 Polyricinoleate, Dodecane, Oryza Sativa Powder, Oryza Sativa Bran Oil, Vegetable Oil, Helianthus Annuus Seed Wax, Oryza Sativa Bran Wax, Rhus Succedanea Fruit Wax, Polyglyceryl-3 Diisostearate, Glycerin➁, Sodium PCA, Sodium Chloride, Xanthan Gum, Sodium Dehydroacetate, Lactic Acid, Aluminum Hydroxide, Glycolipids, Paeonia Lactiflora (Peony) Root Extract, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/anti-cernes-correcteur-10-clair-chaud.png",
    "url": ""
  },
  {
    "slug": "anti-cernes-correcteur-30-tan-neutral",
    "code": "S0033",
    "nom": "Anti-cernes correcteur : 30 Tan Neutral",
    "categorie": "maquillage",
    "volume": "4 ml",
    "prix_ht": 11.25,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Acide hyaluronique",
      "Peau sensible"
    ],
    "description": "Anti-cernes correcteur teinte 30 Tan Neutral.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Butylene Glycol, Butyrospermum Parkii (Shea) Butter➀, Polyglyceryl-3 Polyricinoleate, Dodecane, Oryza Sativa Powder, Oryza Sativa Bran Oil, Vegetable Oil, Helianthus Annuus Seed Wax, Oryza Sativa Bran Wax, Rhus Succedanea Fruit Wax, Polyglyceryl-3 Diisostearate, Glycerin➁, Sodium PCA, Sodium Chloride, Xanthan Gum, Sodium Dehydroacetate, Lactic Acid, Aluminum Hydroxide, Glycolipids, Paeonia Lactiflora (Peony) Root Extract, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/anti-cernes-correcteur-30-tan-neutral.png",
    "url": ""
  },
  {
    "slug": "fond-de-teint-aux-peptides-25-medium-warm",
    "code": "S0054",
    "nom": "Fond de teint aux peptides, 25 Moyen chaud",
    "categorie": "maquillage",
    "volume": "30 ml",
    "prix_ht": 13.67,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Les peptides",
      "Taches sombres"
    ],
    "description": "Fond de teint aux peptides teinte 25 Moyen chaud.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Isoamyl Laurate, Polyglyceryl-3 Ricinoleate, Butylene Glycol, Sorbitan Olivate, Kaolin, Glycerin, Cellulose, Lecithin, Silica, Sodium Chloride, Sodium PCA, Zinc Stearate, Oryza Sativa (Rice) Starch, Cera Alba (Beeswax)➀, Sorbitan Caprylate, Aqua/Water, Parfum/Fragrance, Tocopherol, Propanediol, Aluminum Hydroxide, Benzoic Acid, Caprylyl Glycol, Paeonia Lactiflora (Peony) Root Extract, Potassium Hydroxide, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Glycolipids, Magnesium Stearate, Hexapeptide-11, Leuconostoc/Radish Root Ferment Filtrate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Citric Acid, Propylene Glycol, Citrus Aurantium Bergamia Peel Oil, Limonene➁, Linalyl Acetate➁, Citrus Limon Peel Oil, Linalool➁, Pinene➁, Citrus Aurantium Peel Oil, Citral➁, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/fond-de-teint-aux-peptides-25-medium-warm.png",
    "url": ""
  },
  {
    "slug": "fond-de-teint-aux-peptides-45-deep-warm",
    "code": "S0061",
    "nom": "Fond de teint aux peptides, 45 Foncé chaud",
    "categorie": "maquillage",
    "volume": "30 ml",
    "prix_ht": 13.67,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Les peptides",
      "Taches sombres"
    ],
    "description": "Fond de teint aux peptides teinte 45 Foncé chaud.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Isoamyl Laurate, Polyglyceryl-3 Ricinoleate, Butylene Glycol, Sorbitan Olivate, Kaolin, Glycerin, Cellulose, Lecithin, Silica, Sodium Chloride, Sodium PCA, Zinc Stearate, Oryza Sativa (Rice) Starch, Cera Alba (Beeswax)➀, Sorbitan Caprylate, Aqua/Water, Parfum/Fragrance, Tocopherol, Propanediol, Aluminum Hydroxide, Benzoic Acid, Caprylyl Glycol, Paeonia Lactiflora (Peony) Root Extract, Potassium Hydroxide, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Glycolipids, Magnesium Stearate, Hexapeptide-11, Leuconostoc/Radish Root Ferment Filtrate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Citric Acid, Propylene Glycol, Citrus Aurantium Bergamia Peel Oil, Limonene➁, Linalyl Acetate➁, Citrus Limon Peel Oil, Linalool➁, Pinene➁, Citrus Aurantium Peel Oil, Citral➁, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/fond-de-teint-aux-peptides-45-deep-warm.png",
    "url": ""
  },
  {
    "slug": "fond-de-teint-aux-peptides-15-light-cool",
    "code": "S0053",
    "nom": "Fond de teint aux peptides, 15 Light Cool",
    "categorie": "maquillage",
    "volume": "30 ml",
    "prix_ht": 13.67,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Les peptides",
      "Taches sombres"
    ],
    "description": "Fond de teint aux peptides teinte 15 Light Cool.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Isoamyl Laurate, Polyglyceryl-3 Ricinoleate, Butylene Glycol, Sorbitan Olivate, Kaolin, Glycerin, Cellulose, Lecithin, Silica, Sodium Chloride, Sodium PCA, Zinc Stearate, Oryza Sativa (Rice) Starch, Cera Alba (Beeswax)➀, Sorbitan Caprylate, Aqua/Water, Parfum/Fragrance, Tocopherol, Propanediol, Aluminum Hydroxide, Benzoic Acid, Caprylyl Glycol, Paeonia Lactiflora (Peony) Root Extract, Potassium Hydroxide, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Glycolipids, Magnesium Stearate, Hexapeptide-11, Leuconostoc/Radish Root Ferment Filtrate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Citric Acid, Propylene Glycol, Citrus Aurantium Bergamia Peel Oil, Limonene➁, Linalyl Acetate➁, Citrus Limon Peel Oil, Linalool➁, Pinene➁, Citrus Aurantium Peel Oil, Citral➁, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/fond-de-teint-aux-peptides-15-light-cool.png",
    "url": ""
  },
  {
    "slug": "fond-de-teint-aux-peptides-10-light-warm",
    "code": "S0055",
    "nom": "Fond de teint aux peptides, teinte 10 Clair chaud",
    "categorie": "maquillage",
    "volume": "30 ml",
    "prix_ht": 13.67,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Les peptides",
      "Taches sombres"
    ],
    "description": "Fond de teint aux peptides teinte 10 Clair chaud.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Isoamyl Laurate, Polyglyceryl-3 Ricinoleate, Butylene Glycol, Sorbitan Olivate, Kaolin, Glycerin, Cellulose, Lecithin, Silica, Sodium Chloride, Sodium PCA, Zinc Stearate, Oryza Sativa (Rice) Starch, Cera Alba (Beeswax)➀, Sorbitan Caprylate, Aqua/Water, Parfum/Fragrance, Tocopherol, Propanediol, Aluminum Hydroxide, Benzoic Acid, Caprylyl Glycol, Paeonia Lactiflora (Peony) Root Extract, Potassium Hydroxide, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Glycolipids, Magnesium Stearate, Hexapeptide-11, Leuconostoc/Radish Root Ferment Filtrate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Citric Acid, Propylene Glycol, Citrus Aurantium Bergamia Peel Oil, Limonene➁, Linalyl Acetate➁, Citrus Limon Peel Oil, Linalool➁, Pinene➁, Citrus Aurantium Peel Oil, Citral➁, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/fond-de-teint-aux-peptides-10-light-warm.png",
    "url": ""
  },
  {
    "slug": "fond-de-teint-aux-peptides-20-medium-neutral",
    "code": "S0051",
    "nom": "Fond de teint aux peptides, teinte 20 Medium Neutral",
    "categorie": "maquillage",
    "volume": "30 ml",
    "prix_ht": 13.67,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Les peptides",
      "Taches sombres"
    ],
    "description": "Fond de teint aux peptides teinte 20 Medium Neutral.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Isoamyl Laurate, Polyglyceryl-3 Ricinoleate, Butylene Glycol, Sorbitan Olivate, Kaolin, Glycerin, Cellulose, Lecithin, Silica, Sodium Chloride, Sodium PCA, Zinc Stearate, Oryza Sativa (Rice) Starch, Cera Alba (Beeswax)➀, Sorbitan Caprylate, Aqua/Water, Parfum/Fragrance, Tocopherol, Propanediol, Aluminum Hydroxide, Benzoic Acid, Caprylyl Glycol, Paeonia Lactiflora (Peony) Root Extract, Potassium Hydroxide, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Glycolipids, Magnesium Stearate, Hexapeptide-11, Leuconostoc/Radish Root Ferment Filtrate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Citric Acid, Propylene Glycol, Citrus Aurantium Bergamia Peel Oil, Limonene➁, Linalyl Acetate➁, Citrus Limon Peel Oil, Linalool➁, Pinene➁, Citrus Aurantium Peel Oil, Citral➁, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/fond-de-teint-aux-peptides-20-medium-neutral.png",
    "url": ""
  },
  {
    "slug": "fond-de-teint-aux-peptides-30-tan-neutral",
    "code": "S0059",
    "nom": "Fond de teint aux peptides, 30 Tan Neutral",
    "categorie": "maquillage",
    "volume": "30 ml",
    "prix_ht": 13.67,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Les peptides",
      "Taches sombres"
    ],
    "description": "Fond de teint aux peptides teinte 30 Tan Neutral.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Isoamyl Laurate, Polyglyceryl-3 Ricinoleate, Butylene Glycol, Sorbitan Olivate, Kaolin, Glycerin, Cellulose, Lecithin, Silica, Sodium Chloride, Sodium PCA, Zinc Stearate, Oryza Sativa (Rice) Starch, Cera Alba (Beeswax)➀, Sorbitan Caprylate, Aqua/Water, Parfum/Fragrance, Tocopherol, Propanediol, Aluminum Hydroxide, Benzoic Acid, Caprylyl Glycol, Paeonia Lactiflora (Peony) Root Extract, Potassium Hydroxide, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Glycolipids, Magnesium Stearate, Hexapeptide-11, Leuconostoc/Radish Root Ferment Filtrate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Citric Acid, Propylene Glycol, Citrus Aurantium Bergamia Peel Oil, Limonene➁, Linalyl Acetate➁, Citrus Limon Peel Oil, Linalool➁, Pinene➁, Citrus Aurantium Peel Oil, Citral➁, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/fond-de-teint-aux-peptides-30-tan-neutral.png",
    "url": ""
  },
  {
    "slug": "fond-de-teint-aux-peptides-35-tan-warm",
    "code": "S0063",
    "nom": "Fond de teint aux peptides, 35 Hâlé chaud",
    "categorie": "maquillage",
    "volume": "30 ml",
    "prix_ht": 13.67,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Les peptides",
      "Taches sombres"
    ],
    "description": "Fond de teint aux peptides teinte 35 Hâlé chaud.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Isoamyl Laurate, Polyglyceryl-3 Ricinoleate, Butylene Glycol, Sorbitan Olivate, Kaolin, Glycerin, Cellulose, Lecithin, Silica, Sodium Chloride, Sodium PCA, Zinc Stearate, Oryza Sativa (Rice) Starch, Cera Alba (Beeswax)➀, Sorbitan Caprylate, Aqua/Water, Parfum/Fragrance, Tocopherol, Propanediol, Aluminum Hydroxide, Benzoic Acid, Caprylyl Glycol, Paeonia Lactiflora (Peony) Root Extract, Potassium Hydroxide, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Glycolipids, Magnesium Stearate, Hexapeptide-11, Leuconostoc/Radish Root Ferment Filtrate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Citric Acid, Propylene Glycol, Citrus Aurantium Bergamia Peel Oil, Limonene➁, Linalyl Acetate➁, Citrus Limon Peel Oil, Linalool➁, Pinene➁, Citrus Aurantium Peel Oil, Citral➁, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/fond-de-teint-aux-peptides-35-tan-warm.png",
    "url": ""
  },
  {
    "slug": "fond-de-teint-aux-peptides-40-deep-neutral",
    "code": "S0065",
    "nom": "Fond de teint aux peptides, 40 Deep Neutral",
    "categorie": "maquillage",
    "volume": "30 ml",
    "prix_ht": 13.67,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Les peptides",
      "Taches sombres"
    ],
    "description": "Fond de teint aux peptides teinte 40 Deep Neutral.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Isoamyl Laurate, Polyglyceryl-3 Ricinoleate, Butylene Glycol, Sorbitan Olivate, Kaolin, Glycerin, Cellulose, Lecithin, Silica, Sodium Chloride, Sodium PCA, Zinc Stearate, Oryza Sativa (Rice) Starch, Cera Alba (Beeswax)➀, Sorbitan Caprylate, Aqua/Water, Parfum/Fragrance, Tocopherol, Propanediol, Aluminum Hydroxide, Benzoic Acid, Caprylyl Glycol, Paeonia Lactiflora (Peony) Root Extract, Potassium Hydroxide, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Glycolipids, Magnesium Stearate, Hexapeptide-11, Leuconostoc/Radish Root Ferment Filtrate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Citric Acid, Propylene Glycol, Citrus Aurantium Bergamia Peel Oil, Limonene➁, Linalyl Acetate➁, Citrus Limon Peel Oil, Linalool➁, Pinene➁, Citrus Aurantium Peel Oil, Citral➁, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/fond-de-teint-aux-peptides-40-deep-neutral.png",
    "url": ""
  },
  {
    "slug": "fond-de-teint-aux-peptides-50-deep-cool",
    "code": "S0066",
    "nom": "Fond de teint aux peptides, 50 Deep Cool",
    "categorie": "maquillage",
    "volume": "30 ml",
    "prix_ht": 13.67,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Les peptides",
      "Taches sombres"
    ],
    "description": "Fond de teint aux peptides teinte 50 Deep Cool.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Isoamyl Laurate, Polyglyceryl-3 Ricinoleate, Butylene Glycol, Sorbitan Olivate, Kaolin, Glycerin, Cellulose, Lecithin, Silica, Sodium Chloride, Sodium PCA, Zinc Stearate, Oryza Sativa (Rice) Starch, Cera Alba (Beeswax)➀, Sorbitan Caprylate, Aqua/Water, Parfum/Fragrance, Tocopherol, Propanediol, Aluminum Hydroxide, Benzoic Acid, Caprylyl Glycol, Paeonia Lactiflora (Peony) Root Extract, Potassium Hydroxide, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Glycolipids, Magnesium Stearate, Hexapeptide-11, Leuconostoc/Radish Root Ferment Filtrate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Citric Acid, Propylene Glycol, Citrus Aurantium Bergamia Peel Oil, Limonene➁, Linalyl Acetate➁, Citrus Limon Peel Oil, Linalool➁, Pinene➁, Citrus Aurantium Peel Oil, Citral➁, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/fond-de-teint-aux-peptides-50-deep-cool.png",
    "url": ""
  },
  {
    "slug": "fond-de-teint-aux-peptides-05-clair-neutre",
    "code": "S0058",
    "nom": "Fond de teint aux peptides, 05 Clair neutre",
    "categorie": "maquillage",
    "volume": "30 ml",
    "prix_ht": 13.67,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Les peptides",
      "Taches sombres"
    ],
    "description": "Fond de teint aux peptides teinte 05 Clair neutre.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice➀, Dicaprylyl Carbonate, Isoamyl Laurate, Polyglyceryl-3 Ricinoleate, Butylene Glycol, Sorbitan Olivate, Kaolin, Glycerin, Cellulose, Lecithin, Silica, Sodium Chloride, Sodium PCA, Zinc Stearate, Oryza Sativa (Rice) Starch, Cera Alba (Beeswax)➀, Sorbitan Caprylate, Aqua/Water, Parfum/Fragrance, Tocopherol, Propanediol, Aluminum Hydroxide, Benzoic Acid, Caprylyl Glycol, Paeonia Lactiflora (Peony) Root Extract, Potassium Hydroxide, Vaccinium Myrtillus (Blueberry) Fruit Extract➀, Glycolipids, Magnesium Stearate, Hexapeptide-11, Leuconostoc/Radish Root Ferment Filtrate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Citric Acid, Propylene Glycol, Citrus Aurantium Bergamia Peel Oil, Limonene➁, Linalyl Acetate➁, Citrus Limon Peel Oil, Linalool➁, Pinene➁, Citrus Aurantium Peel Oil, Citral➁, +/- [CI 77891 (Titanium Dioxide), CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/fond-de-teint-aux-peptides-05-clair-neutre.png",
    "url": ""
  },
  {
    "slug": "rouge-a-levres-mat-nude-terracotta",
    "code": "S0109",
    "nom": "Rouge à lèvres mat, nude terracotta",
    "categorie": "maquillage",
    "volume": "4 g",
    "prix_ht": 13.5,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Peaux déshydratées",
      "Beurre de karité"
    ],
    "description": "Rouge à lèvres mat teinte nude terracotta.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Oryza Sativa (Rice) Bran Oil, Vegetable Oil, Ricinus Communis (Castor) Seed Oil, Coco-Caprylate, Dicaprylyl Carbonate, Helianthus Annuus (Sunflower) Seed Wax, Oryza Sativa (Rice) Bran Wax, Rhus Succedanea Fruit Wax, Capryloyl Glycerin/Sebacic Acid Copolymer, Cellulose, Polyglyceryl-2 Triisostearate, Silica, Rhus Verniciflua Peel Cera, Tocopherol, Parfum/Fragrance, Butyrospermum Parkii (Shea) Butter➀, Aluminum Hydroxide, Ascorbyl Palmitate, Vaccinium Myrtillus (Blueberry) Seed Oil➀, Glycolipids, Stevia Rebaudiana Extract, Helianthus Annuus (Sunflower) Seed Oil, Vanillin, Citrus Aurantium Peel Oil, Limonene, +/- [CI 77861 (Tin Oxide), Mica (CI 77019), CI 77891 (Titanium Dioxide), CI 77742 (Manganese Violet), CI 77491, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/rouge-a-levres-mat-nude-terracotta.png",
    "url": ""
  },
  {
    "slug": "rouge-a-levres-mat-vieux-rose",
    "code": "S0108",
    "nom": "Rouge à lèvres mat, vieux rose",
    "categorie": "maquillage",
    "volume": "4 g",
    "prix_ht": 13.5,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Peaux déshydratées",
      "Beurre de karité"
    ],
    "description": "Rouge à lèvres mat teinte vieux rose.",
    "ingredients": "",
    "arome": "",
    "inci": "INGRÉDIENTS / INCI : Oryza Sativa (Rice) Bran Oil, Vegetable Oil, Ricinus Communis (Castor) Seed Oil, Coco-Caprylate, Dicaprylyl Carbonate, Helianthus Annuus (Sunflower) Seed Wax, Oryza Sativa (Rice) Bran Wax, Rhus Succedanea Fruit Wax, Capryloyl Glycerin/Sebacic Acid Copolymer, Cellulose, Polyglyceryl-2 Triisostearate, Silica, Rhus Verniciflua Peel Cera, Tocopherol, Parfum/Fragrance, Butyrospermum Parkii (Shea) Butter➀, Aluminum Hydroxide, Ascorbyl Palmitate, Vaccinium Myrtillus (Blueberry) Seed Oil➀, Glycolipids, Stevia Rebaudiana Extract, Helianthus Annuus (Sunflower) Seed Oil, Vanillin, Citrus Aurantium Peel Oil, Limonene, +/- [CI 77861 (Tin Oxide), Mica (CI 77019), CI 77891 (Titanium Dioxide), CI 77742 (Manganese Violet), CI 77491, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/rouge-a-levres-mat-vieux-rose.png",
    "url": ""
  },
  {
    "slug": "vitamin-d3-k2-1-700-drops-1-000-i-u-50ml",
    "nom": "Vitamin D3 + K2 - 1,700 Drops (1,000 I.U.) - 50ml",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 6.9,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Neutral flavor | 1,000 I.U. Vitamin D3 per drop | Vitamin K2 | 50ml",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/vitamin-d3-k2-1-700-drops-1-000-i-u-50ml.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "lion-s-mane-vitamin-b6-gummies-60-pcs",
    "nom": "Lion's Mane + Vitamin B6 Gummies - 60 pcs.",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 5.92,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Blueberry flavor | Vitamin B6 | 60 pcs.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/lion-s-mane-vitamin-b6-gummies-60-pcs.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "ashwagandha-vitamin-b6-gummies-60-pcs",
    "nom": "Ashwagandha + Vitamin B6 Gummies - 60 pcs.",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 5.37,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Mango Flavor | Vitamin B6 | Lemon Balm | Chamomile | Lavender | 60 pcs.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/ashwagandha-vitamin-b6-gummies-60-pcs.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "shilajit-gummies-vitamin-c-b6-b12-60-pcs",
    "nom": "Shilajit Gummies + Vitamin C,B6, B12 - 60 pcs.",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 6.49,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Strawberry Flavor | Vitamin C | Vitamin B6 | Vitamin B12 | 60 pcs.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/shilajit-gummies-vitamin-c-b6-b12-60-pcs.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "creatine-gummies-90-pcs",
    "nom": "Creatine Gummies - 90 pcs.",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 9.36,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "1g Creatine per Gummy | 90 pcs",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/creatine-gummies-90-pcs.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "elderberry-vitamin-c-zinc-gummies-60-pcs",
    "nom": "Elderberry + Vitamin C + Zinc Gummies - 60 pcs.",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 5.58,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Wildberry flavor | Vitamin C | Zinc | 60 pcs.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/elderberry-vitamin-c-zinc-gummies-60-pcs.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "multivitamin-mineral-gummies-60-pcs",
    "nom": "Multivitamin + Mineral Gummies - 60 pcs.",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 6.7,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Mango flavor | Multivitamin Complex | Mineral complex | 60 pcs.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/multivitamin-mineral-gummies-60-pcs.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "shilajit-20-fulvic-acid-90-vegan-capsules",
    "nom": "Shilajit (20% Fulvic Acid) - 90 vegan capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.32,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Shilajit Extract | Standardized to 20% Fulvic Acid | 90 Vegan HPMC Capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/shilajit-20-fulvic-acid-90-vegan-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "ashwagandha-10-withanolide-90-vegan-capsules",
    "nom": "Ashwagandha (10% Withanolide) - 90 vegan capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.14,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Ashwagandha Extract | 10% Withanolide | 90 Vegan Capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/ashwagandha-10-withanolide-90-vegan-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "creatine-monohydrate-180-vegan-tablets",
    "nom": "Creatine Monohydrate - 180 vegan tablets",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.78,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Creatine Monohydrate | 180 Tablets",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/creatine-monohydrate-180-vegan-tablets.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "turmeric-95-curcumin-piperine-60-vegan-capsules",
    "nom": "Turmeric (95% Curcumin) + Piperine - 60 vegan capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 6.91,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Turmeric Extract (95% Curcumin) | Black Pepper Extract (95% Piperine) | 90 vegan capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/turmeric-95-curcumin-piperine-60-vegan-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "iodine-180-vegan-tablets",
    "nom": "Iodine - 180 vegan tablets",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.27,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Iod | 180 vegan tablets",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/iodine-180-vegan-tablets.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "apple-cider-vinegar-extract-capsules-600mg-per-capsule-120-vegan-capsules",
    "nom": "Apple Cider Vinegar Extract Capsules (600mg per capsule) - 120 vegan capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.43,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Apple Cider Vinegar Extract | Vegan | 120 Capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/apple-cider-vinegar-extract-capsules-600mg-per-capsule-120-vegan-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "magnesium-6x-complex-b6-120-vegan-capsules",
    "nom": "Magnesium 6x Complex + B6 - 120 vegan capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.3,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "6x Magnesium | Vitamin B6 | 120 Capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/magnesium-6x-complex-b6-120-vegan-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "electrolyte-complex-120-vegan-tablets",
    "nom": "Electrolyte Complex - 120 vegan tablets",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 6.82,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Electrolyte Complex | B-Complex | 120 Tablets",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/electrolyte-complex-120-vegan-tablets.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "iron-vitamin-c-120-vegan-tablets",
    "nom": "Iron + Vitamin C - 120 vegan tablets",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 6.34,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Iron Bisglycinate | Vitamin C | 120 vegan tablets",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/iron-vitamin-c-120-vegan-tablets.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "chaste-tree-240-vegan-capsules",
    "nom": "Chaste tree - 240 vegan capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 8.4,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Chaste Tree | 240 Capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/chaste-tree-240-vegan-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "premium-collagen-hydrolysate-plus-3000-5000-da-180-capsules",
    "nom": "Premium Collagen Hydrolysate PLUS (3000-5000 DA) - 180 Capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 11.44,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Collagen complex | Skin Hair Nails | 180 capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/premium-collagen-hydrolysate-plus-3000-5000-da-180-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "vitamin-d3-4-000-iu-180-softgels",
    "nom": "Vitamin D3 4,000 IU - 180 Softgels",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.92,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "4000 IU | Halal compliant gelatin | 180 softgels",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/vitamin-d3-4-000-iu-180-softgels.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "omega-3-max-35-25-120-softgels",
    "nom": "Omega 3 Max 35/25 - 120 Softgels",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 12.89,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Omega 3 Triglyceride | 35:25 | Halal compliant Gelatin | 120 Softgels",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/omega-3-max-35-25-120-softgels.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "buffered-vitamin-c-500mg-magnesium-240-capsules",
    "nom": "Buffered Vitamin C 500mg + Magnesium - 240 Capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.65,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Buffered Vitamin C | Magnesium | 240 vegan capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/buffered-vitamin-c-500mg-magnesium-240-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "marine-collagen-peptides-2000-5000-da-120-capsules",
    "nom": "Marine Collagen Peptides (2000-5000 DA) - 120 Capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.34,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Marine Collagen Peptides 1000-2000 DA | Type I | 120 Capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/marine-collagen-peptides-2000-5000-da-120-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "multivitamin-and-mineral-complex-120-softgels",
    "nom": "Multivitamin and Mineral Complex - 120 Softgels",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 8.3,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Coordinated Multivitamin and Mineral Complex | Basic Coverage | 120 Softgels",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/multivitamin-and-mineral-complex-120-softgels.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "milk-thistle-artichoke-dandelion-complex-120-capsules",
    "nom": "Milk Thistle Artichoke Dandelion Complex - 120 Capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 8.17,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Milk Thistle Extract | Artichoke Extract | Dandelion Extract | 120 Capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/milk-thistle-artichoke-dandelion-complex-120-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "l-lysine-100-capsules",
    "nom": "L-Lysine - 100 Capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 6.74,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "L-Lysine | 100 Capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/l-lysine-100-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "magnesium-zinc-b6-gummies-60-pcs",
    "nom": "Magnesium + Zinc + B6 Gummies - 60 pcs.",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 5.94,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Magnesium | Zinc | B6 | 60 Gummies",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/magnesium-zinc-b6-gummies-60-pcs.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "turmeric-ginger-black-pepper-gummies-60-pcs",
    "nom": "Turmeric + Ginger + Black Pepper Gummies - 60 pcs.",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 6.95,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Orange Flavor | Turmeric Extract | Ginger Extract | Black Pepper | 60 pcs.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/turmeric-ginger-black-pepper-gummies-60-pcs.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "apple-cider-vinegar-c-b6-chromium-gummies-60-pcs",
    "nom": "Apple Cider Vinegar + C + B6 + Chromium Gummies - 60 pcs",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 5.57,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Apple cider vinegar | C | B6 | Chromium | 60 pcs.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/apple-cider-vinegar-c-b6-chromium-gummies-60-pcs.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "premium-multivitamin-mineral-gummies-60-pcs",
    "nom": "Premium Multivitamin + Mineral Gummies - 60 pcs.",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.24,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Mixed Berry Flavor | Multivitamins | Minerals | 60 pcs.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/premium-multivitamin-mineral-gummies-60-pcs.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "premium-shilajit-gummies-1000-vitamin-c-b6-b12-60-pcs",
    "nom": "Premium Shilajit Gummies 1000 + Vitamin C,B6, B12 - 60 pcs",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.3,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Mixed Berry Flavor | Vitamin C | Vitamin B6 | Vitamin B12 | 60 pcs.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/premium-shilajit-gummies-1000-vitamin-c-b6-b12-60-pcs.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "premium-ashwagandha-gummies-300-vitamin-b6-60-pcs",
    "nom": "Premium Ashwagandha Gummies 300 + Vitamin B6 - 60 pcs",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 6.94,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Mixed Berry Flavor | Vitamin B6 | Lemon Balm | Chamomile | Lavender | 60 pcs.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/premium-ashwagandha-gummies-300-vitamin-b6-60-pcs.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "coenzyme-q10-200mg-60-softgels",
    "nom": "Coenzyme Q10 200mg - 60 Softgels",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 13.38,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Coenzyme Q10 (Ubiquinone) | 200mg | 60 Softgels",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/coenzyme-q10-200mg-60-softgels.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "green-tea-extract-40-polyphenols-60-capsules",
    "nom": "Green tea extract 40% polyphenols - 60 capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 3.84,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Green Tea Extract | 40% Polyphenols | 60 Tablets",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/green-tea-extract-40-polyphenols-60-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "turmeric-piperine-60-capsules",
    "nom": "Turmeric + Piperine - 60 Capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.18,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Turmeric | 600mg | Piperine | 60 Capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/turmeric-piperine-60-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "vitamin-d3-3-000-i-u-60-vegan-softgels",
    "nom": "Vitamin D3 3,000 I.U. - 60 vegan softgels",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 6.1,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Vitamin D3 | 75 µg (3000 I.U.) per Softgel | 60 Softgels",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/vitamin-d3-3-000-i-u-60-vegan-softgels.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "magnesium-4-fold-complex-60-vegan-tablets",
    "nom": "Magnesium 4-fold complex - 60 vegan tablets",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 6.51,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Magnesium Complex | 4 Magnesium Compounds | 60 Vegan Tablets",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/magnesium-4-fold-complex-60-vegan-tablets.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "electrolyte-powder-strawberry-lemon-300g",
    "nom": "Electrolyte Powder Strawberry Lemon - 300g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 11.3,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Electrolyte Complex | 30 servings",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/electrolyte-powder-strawberry-lemon-300g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "electrolyte-powder-tropical-mango-300g",
    "nom": "Electrolyte Powder Tropical Mango - 300g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 11.3,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Electrolyte Complex | 30 Servings",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/electrolyte-powder-tropical-mango-300g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "creatine-monohydrate-tutti-frutti-500g",
    "nom": "Creatine Monohydrate Tutti Frutti - 500g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.54,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Creatine Monohydrate | Tutti Frutti Flavor | 500g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/creatine-monohydrate-tutti-frutti-500g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "creatine-monohydrate-raspberry-500g",
    "nom": "Creatine Monohydrate Raspberry - 500g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.54,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Creatine Monohydrate | Tutti Frutti Flavor | 500g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/creatine-monohydrate-raspberry-500g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "pre-workout-booster-raspberry-520g",
    "nom": "Pre-Workout Booster Raspberry - 520g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 10.23,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Raspberry flavor | Caffeine | Creatine | Vitamins | 520g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/pre-workout-booster-raspberry-520g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "pre-workout-booster-orange-520g",
    "nom": "Pre-Workout Booster Orange - 520g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 10.23,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Orange flavor | Caffeine | Creatine | Vitamins | 520g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/pre-workout-booster-orange-520g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "pre-workout-booster-tutti-frutti-520g",
    "nom": "Pre-Workout Booster Tutti Frutti - 520g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 10.23,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "tutti frutti flavor | caffeine | creatine | vitamins | 520g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/pre-workout-booster-tutti-frutti-520g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "pre-workout-booster-apple-520g",
    "nom": "Pre-Workout Booster Apple - 520g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 10.23,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Apple flavor | Caffeine | Creatine | Vitamins | 520g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/pre-workout-booster-apple-520g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "premium-whey-protein-cookies-1-000g",
    "nom": "Premium Whey Protein Cookies - 1,000g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 17.48,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Cookies Flavour | 80% Protein | 1.000g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/premium-whey-protein-cookies-1-000g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "premium-whey-protein-vanilla-1-000g",
    "nom": "Premium Whey Protein Vanilla - 1,000g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 17.48,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Vanilla flavor | 80% Protein | 1,000g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/premium-whey-protein-vanilla-1-000g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "premium-whey-protein-strawberry-1-000g",
    "nom": "Premium Whey Protein Strawberry - 1,000g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 17.48,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Strawberry flavor | 80% Protein | 1,000g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/premium-whey-protein-strawberry-1-000g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "premium-whey-protein-chocolate-1-000g",
    "nom": "Premium Whey Protein Chocolate - 1,000g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 17.48,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Chocolate flavor | 80% Protein | 1,000g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/premium-whey-protein-chocolate-1-000g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "multivitamin-basic-shots-plus-500ml",
    "nom": "Multivitamin Basic Shots Plus+ - 500ml",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.51,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Multivitamin complex | Mineral complex | Basic coverage",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/multivitamin-basic-shots-plus-500ml.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "collagen-night-plus-1500-da-shots-500ml",
    "nom": "Collagen Night Plus+ (1500 DA) Shots - 500ml",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 12.86,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Marine collagen | Vitamin complex | Amino complex | Plant extracts",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/collagen-night-plus-1500-da-shots-500ml.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "fembalance-shots-plus-500ml",
    "nom": "FemBalance Shots Plus+ - 500ml",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 13.55,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Collagen Complex | Vitamins | Menopause | 20 Shots",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/fembalance-shots-plus-500ml.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "ginseng-power-plus-33-shots-500ml",
    "nom": "Ginseng Power Plus+ - 33 Shots - 500ml",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 8.05,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Korean and Siberian Ginseng | Ginger Extract | Caffeine | Vitamins",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/ginseng-power-plus-33-shots-500ml.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "magnesium-complex-shots-plus-500ml",
    "nom": "Magnesium Complex Shots Plus+ - 500ml",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 8.05,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Magnesium Bisglycinate | Vitamin C+D3 | Amino Acid Complex",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/magnesium-complex-shots-plus-500ml.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "vita-shield-plus-shots-fresh-orange-500ml",
    "nom": "Vita Shield PLUS+ Shots - Fresh Orange - 500ml",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 5.37,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Orange Flavor | Vitamin C | Zinc | Vitamin D3 | Immune System | 500ml",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/vita-shield-plus-shots-fresh-orange-500ml.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "vita-complete-plus-50-vegan-shots-fresh-orange-500ml",
    "nom": "Vita Complete PLUS+ 50 vegan Shots - Fresh Orange - 500ml",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 10.96,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Orange Flavor | Multivitamin Complex | Minerals | Energy | 500ml",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/vita-complete-plus-50-vegan-shots-fresh-orange-500ml.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "collagen-marine-plus-1500-da-50-shots-wild-berry-500ml",
    "nom": "Collagen Marine Plus+ (1500 DA) - 50 Shots - Wild Berry - 500ml",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 13.23,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Wild Berry Flavor | Collagen Peptides Type 1 & 3 from Fish | 500ml",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/collagen-marine-plus-1500-da-50-shots-wild-berry-500ml.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "collagen-support-plus-shots-1500-da-wild-berry-500ml",
    "nom": "Collagen Support PLUS+ Shots (1500 DA) - Wild Berry - 500ml",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 10.63,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Wild Berry Flavor | Collagen Peptides Type 1,2 & 3 | Joint Formula | 500ml",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/collagen-support-plus-shots-1500-da-wild-berry-500ml.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "vita-balance-plus-bacterial-cultures-33-vegan-lemon-shots-500ml",
    "nom": "Vita Balance PLUS+ Bacterial Cultures - 33 vegan Lemon Shots - 500ml",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 10.28,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Lemon Flavor | 10 Billion CFU | Microencapsulated | Intestinal Flora | 500ml",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/vita-balance-plus-bacterial-cultures-33-vegan-lemon-shots-500ml.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "collagen-vital-plus-shots-1500-da-wild-berry-500ml",
    "nom": "Collagen Vital PLUS+ Shots (1500 DA) - Wild Berry - 500ml",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 10.26,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Wild Berry Flavor | Collagen Peptides Type 1 & 3 | Beauty Formula | 500ml",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/collagen-vital-plus-shots-1500-da-wild-berry-500ml.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "egyptian-black-cumin-oil-black-seed-oil-240-vegan-softgels",
    "nom": "Egyptian Black Cumin Oil (Black Seed Oil) - 240 Vegan Softgels",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 11.64,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Egyptian Black Cumin Oil | Vegan Softgels | 240 pcs.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/egyptian-black-cumin-oil-black-seed-oil-240-vegan-softgels.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "glucosamine-500mg-90-capsules",
    "nom": "Glucosamine 500mg - 90 Capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 9.05,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Glucosamine | 90 Capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/glucosamine-500mg-90-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "chondroitin-500-mg-90-capsules",
    "nom": "Chondroitin 500 mg - 90 Capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 8.78,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Chondroitin | Halal compliant raw material | 90 capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/chondroitin-500-mg-90-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "omega-3-triglyceride-18-12-halal-gelatin-120-softgels",
    "nom": "Omega 3 Triglyceride 18/12 (Halal Gelatin) - 120 Softgels",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 9.05,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Omega 3 18/12 | Vitamin E | Halal Gelatin | 120 Softgels",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/omega-3-triglyceride-18-12-halal-gelatin-120-softgels.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "sodium-bicarbonate-enteric-coated-120-capsules",
    "nom": "Sodium Bicarbonate Enteric-Coated - 120 Capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 8.8,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Sodium Bicarbonate | 120 Enteric-Coated Capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/sodium-bicarbonate-enteric-coated-120-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "melatonin-75-capsules",
    "nom": "Melatonin - 75 Capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 6.13,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Melatonin 1mg | Vegan Capsules | 75 pcs.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/melatonin-75-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "l-tryptophan-90-capsules",
    "nom": "L-Tryptophan - 90 Capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 8.06,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "L-Tryptophan 500mg | No Additives | 90 Capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/l-tryptophan-90-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "taurine-powder-500g-doypack",
    "nom": "Taurine Powder - 500g Doypack",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 4.55,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Taurine Powder | 500g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/taurine-powder-500g-doypack.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "l-glutamine-powder-doypack-500g",
    "nom": "L-Glutamine Powder Doypack - 500g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 8.2,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "L-Glutamine Powder | 500g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/l-glutamine-powder-doypack-500g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "shilajit-powder-5-fulvic-acid-250g",
    "nom": "Shilajit Powder - 5% Fulvic Acid - 250g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 11.52,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Shilajit Powder | Purified | 5% Fulvic Acid | No Additives",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/shilajit-powder-5-fulvic-acid-250g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "spirulina-1-000-tablets",
    "nom": "Spirulina - 1,000 Tablets",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 4.64,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Spirulina Compressed Tablets | 1000 pcs. | 250g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/spirulina-1-000-tablets.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "chlorella-1000-tablets",
    "nom": "Chlorella - 1000 tablets",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 9.32,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Chlorella vulgaris pressed tablets | 1000 pcs",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/chlorella-1000-tablets.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "25mg-zinc-bisglycinate-500-tablets",
    "nom": "25mg Zinc Bisglycinate - 500 Tablets",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 8.22,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Zinc Bisglycinate | High Dose | 25mg per Tablet | 500 Tablets",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/25mg-zinc-bisglycinate-500-tablets.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "25mg-iron-bisglycinate-500-tablets",
    "nom": "25mg Iron Bisglycinate - 500 Tablets",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 8.22,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Iron Bisglycinate | 25mg | 250 Tablets",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/25mg-iron-bisglycinate-500-tablets.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "clear-whey-protein-iced-tea-peach-500g",
    "nom": "Clear Whey Protein Iced Tea Peach - 500g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 17.25,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Iced Tea Peach Flavor | Clear Whey Isolate | 500g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/clear-whey-protein-iced-tea-peach-500g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "clear-whey-protein-iced-tea-lemon-500g",
    "nom": "Clear Whey Protein Iced Tea Lemon - 500g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 17.25,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Iced Tea Lemon Flavor | Clear Whey Isolate | 500g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/clear-whey-protein-iced-tea-lemon-500g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "creatine-monohydrate-1000g-doypack",
    "nom": "Creatine Monohydrate - 1000g Doypack",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 8.68,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Creatine Monohydrate | Micronized (200 mesh) | No Additives | 1000g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/creatine-monohydrate-1000g-doypack.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "collagen-hydrolysate-powder-500g-doypack",
    "nom": "Collagen Hydrolysate Powder - 500g Doypack",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 10.28,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Collagen Peptides | Type I & III | Skin & Joints | No Additives | 500g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/collagen-hydrolysate-powder-500g-doypack.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "ashwagandha-powder-500g-doypack",
    "nom": "Ashwagandha Powder - 500g Doypack",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 10.28,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "From the Root | No Additives | 500g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/ashwagandha-powder-500g-doypack.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "msm-powder-500g",
    "nom": "MSM Powder - 500g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 9.38,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Methylsulfonylmethane | No Additives | 500g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/msm-powder-500g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "eaa-essential-amino-acids-cherry-500g",
    "nom": "EAA (Essential Amino Acids) Cherry - 500g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 10.84,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Cherry Flavor| Essential Amino Acids (EAAs) | 500g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/eaa-essential-amino-acids-cherry-500g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "sango-sea-coral-powder-250g",
    "nom": "Sango Sea Coral Powder - 250g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 9.87,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Natural Calcium | Magnesium | Optimal Ca:Mg Ratio | 250g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/sango-sea-coral-powder-250g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "chondroitin-powder-100g",
    "nom": "Chondroitin Powder - 100g",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 6.92,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Chondroitin sulfate | No additives | 100g",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/chondroitin-powder-100g.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "magnesium-complex-vitamin-b6-90-capsules",
    "nom": "Magnesium Complex + Vitamin B6 - 90 Capsules",
    "categorie": "supplements",
    "volume": "",
    "prix_ht": 7.42,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Magnesium Complex 2:1:1 | Optimally balanced | Vitamin B6 | 90 capsules",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/coming-soon/magnesium-complex-vitamin-b6-90-capsules.jpg",
    "url": "",
    "status": "coming_soon"
  },
  {
    "slug": "cc-creme-aux-ceramides-et-spf-30-en-stick-35-deep-EP3IZ",
    "code": "S0122",
    "nom": "Stick correcteur de teint aux céramides (SPF 30) : 20 Clair",
    "categorie": "maquillage",
    "volume": "12 g",
    "prix_ht": 11.42,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "Le CC Cream Ceramide Stick est un produit phare hybride conçu pour les marques qui souhaitent combler le fossé entre les soins de la peau et le maquillage grâce à une solution unique et hautement performante. Répondant à la demande croissante en matière de produits de beauté multifonctionnels, il allie correction du teint et renforcement de la barrière cutanée dans un produit innovant et pratique à emporter partout.\n\nCe stick correcteur de teint offre un teint lisse et uniforme en atténuant l'apparence des imperfections, des rougeurs et des pores, pour un fini naturel et léger. Conçu pour une utilisation nomade, il constitue une alternative pratique aux fonds de teint liquides traditionnels, permettant des retouches rapides et faciles. Enrichi en céramides, en beurre de cacao et en huile de jojoba, il aide à renforcer la barrière cutanée tout en préservant l'hydratation et le confort tout au long de la journée. Sa texture crémeuse se fond parfaitement à la peau pour un résultat frais et discret. Il est disponible en quatre teintes – claire, moyenne, bronzée et foncée – et convient à tous les types de peau. Appliquez-le directement sur la peau et estompez-le pour un fini uniforme et naturel, à tout moment et en tout lieu.",
    "ingredients": "Vitamine E, Beurre de cacao, Céramides",
    "arome": "aquatique, frais, floral",
    "inci": "INGRÉDIENTS / INCI : Zinc Oxide, Dicaprylyl Carbonate, Oryza Sativa (Rice) Bran Oil, Vegetable Oil, Isoamyl Laurate, Helianthus Annuus (Sunflower) Seed Wax, Oryza Sativa (Rice) Bran Wax, Rhus Succedanea Fruit Wax, Simmondsia Chinensis (Jojoba) Seed Oil➀, Silica, Theobroma Cacao (Cocoa) Seed Butter➀, Parfum/Fragrance, Tocopherol, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil➀, Nigella Sativa (Black Cumin) Seed Oil➀, Glycolipids, Aluminum Hydroxide, Glycosphingolipids, Aqua/Water, Vanillin, Terpineol➁, Linalyl Acetate➁, Anethole➁, Geraniol➁, CI 77891 (Titanium Dioxide), [CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/cc-creme-aux-ceramides-et-spf-30-en-stick-35-deep-EP3IZ.png",
    "url": ""
  },
  {
    "slug": "cc-creme-aux-ceramides-et-spf-30-en-stick-35-deep-Fa59u",
    "code": "S0121",
    "nom": "Stick correcteur de teint aux céramides (SPF 30) : 25 Moyen",
    "categorie": "maquillage",
    "volume": "12 g",
    "prix_ht": 11.42,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "Le CC Cream Ceramide Stick est un produit phare hybride conçu pour les marques qui souhaitent combler le fossé entre les soins de la peau et le maquillage grâce à une solution unique et hautement performante. Répondant à la demande croissante en matière de produits de beauté multifonctionnels, il allie correction du teint et renforcement de la barrière cutanée dans un produit innovant et pratique à emporter partout.\n\nCe stick correcteur de teint offre un teint lisse et uniforme en atténuant l'apparence des imperfections, des rougeurs et des pores, pour un fini naturel et léger. Conçu pour une utilisation nomade, il constitue une alternative pratique aux fonds de teint liquides traditionnels, permettant des retouches rapides et faciles. Enrichi en céramides, en beurre de cacao et en huile de jojoba, il aide à renforcer la barrière cutanée tout en préservant l'hydratation et le confort tout au long de la journée. Sa texture crémeuse se fond parfaitement à la peau pour un résultat frais et discret. Il est disponible en quatre teintes – claire, moyenne, bronzée et foncée – et convient à tous les types de peau. Appliquez-le directement sur la peau et estompez-le pour un fini uniforme et naturel, à tout moment et en tout lieu.",
    "ingredients": "Vitamine E, Beurre de cacao, Céramides",
    "arome": "aquatique, frais, floral",
    "inci": "INGRÉDIENTS / INCI : Zinc Oxide, Dicaprylyl Carbonate, Oryza Sativa (Rice) Bran Oil, Vegetable Oil, Isoamyl Laurate, Helianthus Annuus (Sunflower) Seed Wax, Oryza Sativa (Rice) Bran Wax, Rhus Succedanea Fruit Wax, Simmondsia Chinensis (Jojoba) Seed Oil➀, Silica, Theobroma Cacao (Cocoa) Seed Butter➀, Parfum/Fragrance, Tocopherol, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil➀, Nigella Sativa (Black Cumin) Seed Oil➀, Glycolipids, Aluminum Hydroxide, Glycosphingolipids, Aqua/Water, Vanillin, Terpineol➁, Linalyl Acetate➁, Anethole➁, Geraniol➁, CI 77891 (Titanium Dioxide), [CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/cc-creme-aux-ceramides-et-spf-30-en-stick-35-deep-Fa59u.png",
    "url": ""
  },
  {
    "slug": "cc-creme-aux-ceramides-et-spf-30-en-stick-35-deep-TTCkT",
    "code": "S0120",
    "nom": "Stick correcteur de teint aux céramides (SPF 30) : 30 Hâlé",
    "categorie": "maquillage",
    "volume": "12 g",
    "prix_ht": 11.42,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "Le CC Cream Ceramide Stick est un produit phare hybride conçu pour les marques qui souhaitent combler le fossé entre les soins de la peau et le maquillage grâce à une solution unique et hautement performante. Répondant à la demande croissante en matière de produits de beauté multifonctionnels, il allie correction du teint et renforcement de la barrière cutanée dans un produit innovant et pratique à emporter partout.\n\nCe stick correcteur de teint offre un teint lisse et uniforme en atténuant l'apparence des imperfections, des rougeurs et des pores, pour un fini naturel et léger. Conçu pour une utilisation nomade, il constitue une alternative pratique aux fonds de teint liquides traditionnels, permettant des retouches rapides et faciles. Enrichi en céramides, en beurre de cacao et en huile de jojoba, il aide à renforcer la barrière cutanée tout en préservant l'hydratation et le confort tout au long de la journée. Sa texture crémeuse se fond parfaitement à la peau pour un résultat frais et discret. Il est disponible en quatre teintes – claire, moyenne, bronzée et foncée – et convient à tous les types de peau. Appliquez-le directement sur la peau et estompez-le pour un fini uniforme et naturel, à tout moment et en tout lieu.",
    "ingredients": "Vitamine E, Beurre de cacao, Céramides",
    "arome": "Aquatique, frais, floral",
    "inci": "INGRÉDIENTS / INCI : Zinc Oxide, Dicaprylyl Carbonate, Oryza Sativa (Rice) Bran Oil, Vegetable Oil, Isoamyl Laurate, Helianthus Annuus (Sunflower) Seed Wax, Oryza Sativa (Rice) Bran Wax, Rhus Succedanea Fruit Wax, Simmondsia Chinensis (Jojoba) Seed Oil➀, Silica, Theobroma Cacao (Cocoa) Seed Butter➀, Parfum/Fragrance, Tocopherol, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil➀, Nigella Sativa (Black Cumin) Seed Oil➀, Glycolipids, Aluminum Hydroxide, Glycosphingolipids, Aqua/Water, Vanillin, Terpineol➁, Linalyl Acetate➁, Anethole➁, Geraniol➁, CI 77891 (Titanium Dioxide), [CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/cc-creme-aux-ceramides-et-spf-30-en-stick-35-deep-TTCkT.png",
    "url": ""
  },
  {
    "slug": "cc-creme-aux-ceramides-et-spf-30-en-stick-35-deep",
    "code": "S0116",
    "nom": "Stick correcteur de teint aux céramides (SPF 30) : 35 Foncé",
    "categorie": "maquillage",
    "volume": "12 g",
    "prix_ht": 11.42,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "Le CC Cream Ceramide Stick est un produit phare hybride conçu pour les marques qui souhaitent combler le fossé entre les soins de la peau et le maquillage grâce à une solution unique et hautement performante. Répondant à la demande croissante en matière de produits de beauté multifonctionnels, il allie correction du teint et renforcement de la barrière cutanée dans un produit innovant et pratique à emporter partout.\n\nCe stick correcteur de teint offre un teint lisse et uniforme en atténuant l'apparence des imperfections, des rougeurs et des pores, pour un fini naturel et léger. Conçu pour une utilisation nomade, il constitue une alternative pratique aux fonds de teint liquides traditionnels, permettant des retouches rapides et faciles. Enrichi en céramides, en beurre de cacao et en huile de jojoba, il aide à renforcer la barrière cutanée tout en préservant l'hydratation et le confort tout au long de la journée. Sa texture crémeuse se fond parfaitement à la peau pour un résultat frais et discret. Il est disponible en quatre teintes – claire, moyenne, bronzée et foncée – et convient à tous les types de peau. Appliquez-le directement sur la peau et estompez-le pour un fini uniforme et naturel, à tout moment et en tout lieu.",
    "ingredients": "Vitamine E, Beurre de cacao, Céramides",
    "arome": "Aquatique, frais, floral",
    "inci": "INGRÉDIENTS / INCI : Zinc Oxide, Dicaprylyl Carbonate, Oryza Sativa (Rice) Bran Oil, Vegetable Oil, Isoamyl Laurate, Helianthus Annuus (Sunflower) Seed Wax, Oryza Sativa (Rice) Bran Wax, Rhus Succedanea Fruit Wax, Simmondsia Chinensis (Jojoba) Seed Oil➀, Silica, Theobroma Cacao (Cocoa) Seed Butter➀, Parfum/Fragrance, Tocopherol, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil➀, Nigella Sativa (Black Cumin) Seed Oil➀, Glycolipids, Aluminum Hydroxide, Glycosphingolipids, Aqua/Water, Vanillin, Terpineol➁, Linalyl Acetate➁, Anethole➁, Geraniol➁, CI 77891 (Titanium Dioxide), [CI 77491, CI 77492, CI 77499 (Iron Oxides)]➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/cc-creme-aux-ceramides-et-spf-30-en-stick-35-deep.png",
    "url": ""
  },
  {
    "slug": "nourish-and-volumize-shampoo-2",
    "code": "A5829",
    "nom": "Shampooing nourrissant et volumateur",
    "categorie": "soins-du-cheveu",
    "volume": "290 ml",
    "prix_ht": 7.17,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "Ce shampooing nettoie les cheveux tout en préservant leur douceur. Il fortifie la fibre et donne du volume. Appliquer sur cheveux humides et sur le cuir chevelu, faire mousser puis rincer.",
    "ingredients": "Bétaïne, protéine de blé",
    "arome": "Thé vert et aloe",
    "inci": "INGRÉDIENTS / INCI : Aqua, Sodium Coco-Sulfate, Coco-Glucoside, Cocamidopropyl Betaine, Glycerin➀, Betaine, Sodium Chloride, Glyceryl Oleate, Xylitylglucoside, Hydrolysed Wheat Protein, Brassicyl Isoleucinate Esylate, Brassica Alcohol, Anhydroxylitol, Parfum, Citric Acid, Sodium Benzoate, Xylitol, Potassium Sorbate, Benzyl Alcohol, Limonene➁, Linalool➁. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/nourish-and-volumize-shampoo-2.png",
    "url": ""
  },
  {
    "slug": "shampoing-sec-en-spray-quick-refresh",
    "code": "S0093",
    "nom": "Shampoing sec en spray « Quick Refresh »",
    "categorie": "soins-du-cheveu",
    "volume": "100 ml",
    "prix_ht": 9.67,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Le shampoing sec en spray « Quick Refresh » est une solution capillaire pratique à emporter partout. Il procure instantanément un aspect propre et rafraîchi entre deux lavages, sans eau ni appareil de coiffure chauffant.\n\nCe shampoing sec sans aérosol contient des agents naturels absorbant le sébum, diffusés sous forme de brume fine pour une application uniforme et légère. Il aide à absorber l'excès de sébum au niveau des racines et rafraîchit instantanément les cheveux, leur redonnant un aspect propre et volumineux. Adapté à tous les types de cheveux, il permet d'espacer les lavages tout en conservant une chevelure fraîche.\nBien agiter avant utilisation. Vaporiser sur cheveux secs, en insistant sur les racines, puis masser délicatement du bout des doigts. Ne pas rincer. Il est normal qu'une petite quantité de poudre se dépose au fond du flacon après l'avoir agité.\nAVERTISSEMENT : Contient de l'alcool (éthanol), classé comme matière dangereuse (HAZMAT). Expédition par voie terrestre standard uniquement, pas d'expédition en prioritaire, express ou par avion. Nous nous chargeons de la conformité pour les revendeurs en dropshipping. Pour les commandes manuelles et en gros, veuillez consulter [cet article] pour en savoir plus sur les conditions d'expédition.",
    "ingredients": "Amidon de riz, Sarcosine, Extraits botaniques",
    "arome": "Un parfum floral raffiné, rehaussé d'une note de fond douce de bois de cèdre.",
    "inci": "INGRÉDIENTS / INCI : Alcohol denat., Aqua (water), Distarch phosphate, Propanediol, Glycerin, Parfum (fragrance), Sarcosine, Panthenol, Maltodextrin, Echinacea purpurea extract, Rhodiola rosea extract. ➀ Issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/shampoing-sec-en-spray-quick-refresh.png",
    "url": ""
  },
  {
    "slug": "serum-exfoliant-pour-le-cuir-chevelu",
    "code": "S8176",
    "nom": "Sérum exfoliant pour le cuir chevelu",
    "categorie": "soins-du-cheveu",
    "volume": "30 ml",
    "prix_ht": 11.08,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "Le sérum exfoliant pour cuir chevelu est un produit hautement performant destiné aux marques de soins capillaires qui souhaitent se positionner sur le marché en pleine expansion des soins du cuir chevelu. S'inscrivant dans la tendance de la « skinification des cheveux », il offre une solution à la fois efficace et douce qui favorise des cheveux d'apparence plus saine dès la racine.\n\nCe sérum exfoliant pour le cuir chevelu est conçu pour éliminer en douceur les résidus de produits tout en aidant à purifier et à rééquilibrer le cuir chevelu. Enrichi en acide lactique, il exfolie en douceur et renouvelle la surface du cuir chevelu, tandis que le hyaluronate de sodium apporte une hydratation légère pour aider à maintenir le confort et l'équilibre hydrique. La formule aide à soulager les sensations d'inconfort et la sécheresse du cuir chevelu, créant ainsi un environnement plus sain pour la pousse des cheveux. Utilisé régulièrement, il favorise l'apparence de cheveux plus forts et plus volumineux, tout en laissant le cuir chevelu rafraîchi et revitalisé. Appliquez sur le cuir chevelu sec, laissez agir pendant 3 à 5 minutes, puis rincez abondamment. Utilisez une à deux fois par semaine pour de meilleurs résultats.",
    "ingredients": "Acide lactique, Hyaluronate de sodium",
    "arome": "Sans parfum",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Lactic Acid, Pentylene Glycol, Potassium Hydroxide, Butylene Glycol, Glycerin➁, Sodium Hyaluronate, Urtica Dioica (Nettle) Leaf Extract➀. ➀ Ingrédient issu de l'agriculture biologique ➁ Fabriqué avec des ingrédients biologiques",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-exfoliant-pour-le-cuir-chevelu.png",
    "url": ""
  },
  {
    "slug": "deodorant-a-bille-50-ml",
    "code": "S0094-W",
    "nom": "Déodorant à bille sans aluminium",
    "categorie": "soins-du-corps",
    "volume": "50 ml",
    "prix_ht": 10.5,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Un excellent atout pour les marques de soins personnels qui souhaitent se lancer sur le marché des déodorants naturels. Axé sur la protection contre les odeurs et l'expérience sensorielle, il s'intègre parfaitement aux routines modernes de soins corporels.\n\nCe déodorant à bille sans aluminium offre une protection efficace contre les odeurs tout au long de la journée, tout en étant doux pour la peau. Conçu pour un usage quotidien, il s'applique en douceur et pénètre rapidement, laissant les aisselles fraîches, sèches et confortables, sans irritation. Un mélange doux pour la peau à base d'aloe vera et de panthénol aide à apaiser et à calmer la peau, tandis que des actifs déodorants naturels tels que le citrate de triéthyle et l'acide shikimique aident à prévenir la formation des odeurs à la source. Des émollients légers favorisent la douceur et le confort, ce qui le rend adapté même aux peaux sensibles. Appliquez quotidiennement sur des aisselles propres et sèches en effectuant 2 à 3 passages pour de meilleurs résultats.",
    "ingredients": "Aloe vera, Citrate de triéthyle, Acide shikimique, Huile de graines de Macadamia ternifolia, Panthénol, Mélange d'huiles essentielles",
    "arome": "Lavande, écorce d'orange, romarin, ylang-ylang, patchouli, eucalyptus",
    "inci": "INGRÉDIENTS / INCI : Aqua, Aloe Barbadensis Leaf Extract➀, Macadamia Integrifolia Seed Oil➀, Triethyl Citrate, Glycerin, Polyglyceryl-3 Betainate Lactate, Shikimic Acid, Hydroxypropyl Starch Phosphate, Cetearyl Alcohol, Lavandula Hybrida Grosso Herb Oil, Eucalyptus Globulus Leaf Oil, Rosmarinus Officinalis Leaf Oil, Sucrose Distearate, Panthenol, Pogostemon Cablin Oil, Citrus Aurantium Peel Oil, Xanthan Gum, Algin, Citric Acid, Sodium Dehydroacetate, Parfum, Benzyl Alcohol, Benzoic Acid, Sorbic Acid, Lavandula Oil/Extract, Linalool, Linalyl Acetate, Camphor, Beta-caryophyllene, Cananga Odorata Oil/Extract, Pinene, Limonene, Terpineol, Terpinolene, Geranyl Acetate, Geraniol, Coumarin. ➀ Issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/deodorant-a-bille-50-ml.png",
    "url": ""
  },
  {
    "slug": "deodorant-a-bille-50-ml-tp2vM",
    "code": "S0094-B",
    "nom": "Déodorant à bille sans aluminium",
    "categorie": "soins-du-corps",
    "volume": "50 ml",
    "prix_ht": 10.5,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Un excellent atout pour les marques de soins personnels qui souhaitent se lancer sur le marché des déodorants naturels. Axé sur la protection contre les odeurs et l'expérience sensorielle, il s'intègre parfaitement aux routines modernes de soins corporels.\n\nCe déodorant à bille sans aluminium offre une protection efficace contre les odeurs tout au long de la journée, tout en étant doux pour la peau. Conçu pour un usage quotidien, il s'applique en douceur et pénètre rapidement, laissant les aisselles fraîches, sèches et confortables, sans irritation. Un mélange doux pour la peau à base d'aloe vera et de panthénol aide à apaiser et à calmer la peau, tandis que des actifs déodorants naturels tels que le citrate de triéthyle et l'acide shikimique aident à prévenir la formation des odeurs à la source. Des émollients légers favorisent la douceur et le confort, ce qui le rend adapté même aux peaux sensibles. Appliquez quotidiennement sur des aisselles propres et sèches en effectuant 2 à 3 passages pour de meilleurs résultats.",
    "ingredients": "Aloe vera, Citrate de triéthyle, Acide shikimique, Huile de graines de Macadamia ternifolia, Panthénol, Mélange d'huiles essentielles",
    "arome": "Lavande, écorce d'orange, romarin, ylang-ylang, patchouli, eucalyptus",
    "inci": "INGRÉDIENTS / INCI : Aqua, Aloe Barbadensis Leaf Extract➀, Macadamia Integrifolia Seed Oil➀, Triethyl Citrate, Glycerin, Polyglyceryl-3 Betainate Lactate, Shikimic Acid, Hydroxypropyl Starch Phosphate, Cetearyl Alcohol, Lavandula Hybrida Grosso Herb Oil, Eucalyptus Globulus Leaf Oil, Rosmarinus Officinalis Leaf Oil, Sucrose Distearate, Panthenol, Pogostemon Cablin Oil, Citrus Aurantium Peel Oil, Xanthan Gum, Algin, Citric Acid, Sodium Dehydroacetate, Parfum, Benzyl Alcohol, Benzoic Acid, Sorbic Acid, Lavandula Oil/Extract, Linalool, Linalyl Acetate, Camphor, Beta-caryophyllene, Cananga Odorata Oil/Extract, Pinene, Limonene, Terpineol, Terpinolene, Geranyl Acetate, Geraniol, Coumarin. ➀ Issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/deodorant-a-bille-50-ml-tp2vM.png",
    "url": ""
  },
  {
    "slug": "calming-facial-oil",
    "code": "A5831",
    "nom": "Huile apaisante pour le visage",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": 12.17,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Organic"
    ],
    "star_features": [],
    "description": "Huile pour le visage à l'huile de chanvre et 1 % de cannabidiol, qui apaise la peau et aide à réguler le sébum. Elle aide à améliorer l'aspect des peaux sèches et ternes. Mélanger 1 à 3 gouttes à son soin hydratant du visage ou du corps, ou l'utiliser seule.",
    "ingredients": "Huile de graines de chanvre, cannabidiol",
    "arome": "Aromatique, légèrement zesté, aux notes d'herbes parfumées",
    "inci": "INGRÉDIENTS / INCI : Cannabis Sativa (Hemp) Seed Oil➀, Decyl Cocoate, Undecane, Tridecane, Cannabidiol - Derived From Extract Or Tincture Or Resin Of Cannabis, Tocopherol, Parfum/Fragrance, Limonene➁, Linalool➁, Citral➁. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/calming-facial-oil.png",
    "url": ""
  },
  {
    "slug": "copy-of-creme-peptide-ageless-jour-et-nuit-o7VB3",
    "code": "S0024",
    "nom": "Crème Peptide Ageless Jour et Nuit",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 10.42,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "La crème Peptide Ageless AM/PM à l'acide hyaluronique constitue un atout majeur pour les marques de beauté qui souhaitent répondre à la demande croissante en matière de soins de la peau à base de peptides et de produits multifonctionnels. Conçue comme une solution polyvalente pour le jour et la nuit, elle vient renforcer toute gamme de soins anti-âge.\n\nCette crème raffermissante contient un complexe de peptides de qualité clinique qui aide à améliorer l'élasticité de la peau et à atténuer l'apparence des ridules et des rides. Conçue pour une utilisation matin et soir, elle offre une hydratation équilibrée et des effets repulpants visibles en une seule formule. Sa texture légère mais nourrissante pénètre facilement, laissant la peau lisse, souple et revitalisée tout au long de la journée et de la nuit. En soutenant les processus naturels de renouvellement de la peau, elle contribue à favoriser un teint plus ferme et d'apparence plus jeune au fil du temps. Idéale pour celles et ceux qui recherchent un soin anti-âge efficace en un minimum d'étapes, cette crème à double action s'intègre facilement à toute routine. Appliquez-la sur une peau propre matin et soir pour de meilleurs résultats.",
    "ingredients": "Peptides, Vitamine C, Vitamine E, Acide hyaluronique, PCA de sodium",
    "arome": "Arôme floral délicat et douceur subtile",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Simmondsia Chinensis (Jojoba) Seed Oil➀, Glycerin, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Sodium PCA, Dipalmitoyl Hydroxyproline, Propanediol, Aroma/Fragrance, Dicaprylyl Carbonate, Polyglyceryl-6 Behenate, Mangifera Indica (Mango) Seed Butter➀, Caprylic/Capric Triglyceride, Coco-Caprylate, Fragaria Ananassa (Strawberry) Seed Oil, Vaccinium Myrtillus (Blueberry) Seed Oil➀, Xanthan Gum, Hexapeptide-11, Phytosterols, Octyldodecanol, Palmitic Acid, Stearic Acid, Tocopherol, Ascorbyl Palmitate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Sodium Phytate, Potassium Hydroxide, Leuconostoc/Radish Root Ferment Filtrate, Ginkgo Biloba (Ginkgo) Leaf Extract➀, Citric Acid, Sodium Benzoate, Potassium Sorbate, CI 77491 (Iron Oxides)➂, Linalyl Acetate➁, Geranyl Acetate➁, Linalool➁, Geraniol➁, Citronellol➁. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/copy-of-creme-peptide-ageless-jour-et-nuit-o7VB3.png",
    "url": ""
  },
  {
    "slug": "creme-contour-des-yeux-anti-age-aux-peptides-A4YQs",
    "code": "S0025",
    "nom": "Crème contour des yeux anti-âge aux peptides",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": 7.58,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "La crème contour des yeux anti-âge aux peptides est un complément indispensable à toute gamme de soins à base de peptides, offrant une solution ciblée pour l'un des principaux défis de l'anti-âge. Elle vient compléter une gamme cohérente de produits aux peptides tout en offrant un fort potentiel de vente incitative grâce à une formule ciblée et axée sur les résultats.\n\nCette crème contour des yeux ciblée est formulée pour la zone délicate du contour des yeux. Elle aide à réduire l'apparence des ridules, des rides et des pattes d'oie tout en améliorant l'aspect de la fermeté. Enrichie d'un complexe de peptides de qualité clinique, elle agit pour soutenir la structure de la peau et aider à lisser les signes visibles du vieillissement là où ils apparaissent en premier. Sa texture légère et agréable pénètre facilement sans laisser de film gras, ce qui la rend idéale pour un usage quotidien. Elle s'associe parfaitement aux sérums et crèmes de la même gamme. Appliquez-la délicatement sur la peau propre du contour des yeux, matin et soir.",
    "ingredients": "Peptides, Vitamine C, Vitamine E, PCA de sodium",
    "arome": "Un arôme de rose légèrement sucré, rehaussé d'une touche délicate de géranium rouge sur un fond vert et fruité",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Glycerin, Coconut Alkanes, Pentylene Glycol, Simmondsia Chinensis (Jojoba) Seed Oil➀, Sodium PCA, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Borago Officinalis (Borage) Seed Oil➀, Caprylic/Capric Triglyceride, Dipalmitoyl Hydroxyproline, Ricinus Communis (Castor) Seed Oil, Propanediol, Aroma/Fragrance, Polyglyceryl-6 Behenate, Xanthan Gum, Fragaria Ananassa (Strawberry) Seed Oil, Rhus Verniciflua Peel Cera/Rhus Succedanea Fruit Cera, Vaccinium Myrtillus (Blueberry) Seed Oil➀, Cellulose, Hexapeptide-11, Phytosterols, Ascorbyl Palmitate, Tocopherol, Mangifera Indica (Mango) Seed Butter➀, Sodium Phytate, Potassium Hydroxide, Leuconostoc/Radish Root Ferment Filtrate, Octyldodecanol, Ginkgo Biloba (Ginkgo) Leaf Extract➀, Citric Acid, Sodium Benzoate, Potassium Sorbate, CI 77491 (Iron Oxides)➂, Linalyl Acetate➁, Geranyl Acetate➁, Linalool➁, Geraniol➁, Citronellol➁. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-contour-des-yeux-anti-age-aux-peptides-A4YQs.png",
    "url": ""
  },
  {
    "slug": "creme-hydratante-anti-imperfections",
    "code": "S0118",
    "nom": "Crème hydratante anti-imperfections",
    "categorie": "soins-du-visage",
    "volume": "50 ml",
    "prix_ht": 11.08,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "Un complément précieux à toute gamme de soins ciblant les imperfections, qui offre une hydratation légère tout en répondant aux besoins des peaux à tendance acnéique. Sa formule équilibrée et sa composition à base d'ingrédients naturels en font un produit idéal pour les marques qui s'adressent aussi bien aux adolescents qu'aux adultes à la recherche de soins anti-imperfections à la fois doux et efficaces.\n\nCette crème hydratante légère est conçue pour hydrater, apaiser et soutenir les peaux sujettes aux imperfections sans laisser de sensation de lourdeur ni obstruer les pores. Enrichie en acide hyaluronique et en polysaccharides naturels, elle aide à maintenir un niveau d'hydratation optimal tout en favorisant un teint plus lisse et plus clair. L'huile d'argan et le sodium PCA favorisent l'hydratation et la douceur de la peau, tandis qu'un complexe antioxydant à base de vitamine C, de feuilles de maté, de mousse d'Islande et d'extraits de callus de genévrier aide à protéger et à apaiser la peau. La formule à absorption rapide laisse la peau équilibrée, confortable et rafraîchie. Appliquez une noisette de produit sur la peau propre du visage et du cou, massez doucement jusqu'à absorption complète, matin et soir.",
    "ingredients": "Huile d'argan, Acide hyaluronique, Extrait de feuille de maté, Extrait de mousse d'Islande, Extrait de callus de genévrier",
    "arome": "thé vert, frais, gingembre",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Glycerin➁, Argania Spinosa (Argan) Kernel Oil➀, Pentylene Glycol, Polyglyceryl-6 Stearate, Cetearyl Alcohol, Cellulose, Sodium PCA, Isoamyl Laurate, Zinc PCA, Aroma/Fragrance, Caprylic/Capric Triglyceride, Propanediol, Polyglyceryl-6 Behenate, Alcohol, Xanthan Gum, Ilex Paraguariensis (Mate) Leaf Extract➀, Palmitic Acid, Stearic Acid, Ascorbyl Palmitate, Tocopherol, Potassium Hydroxide, Sodium Phytate, Sodium Hyaluronate, Cetraria Islandica (Iceland Moss) Extract, Usnea Barbata (Lichen) Extract, Rhamnose, Juniperus Communis (Juniper) Callus Extract, CI 77007 (Ultramarines)➃, Glucose, Glucuronic Acid, Silica, Kaolin, Maltodextrin, CI 75815 (Chlorophyllin Copper Complex), Linalool➂, Linalyl Acetate➂, Citrus Aurantium Bergamia Peel Oil, Citral➂, Limonene➂, Juniperus Virginiana Oil, Citronellol➂, Pinene➂. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/creme-hydratante-anti-imperfections.png",
    "url": ""
  },
  {
    "slug": "gel-booster-au-ginkgo-antioxydant-4",
    "code": "A5819-PUMP",
    "nom": "Gel Booster au ginkgo antioxydant",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 8.5,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "L'extrait concentré de ginkgo biloba contenu dans le gel pour le visage de la marque de distributeur est riche en antioxydants qui aident à minimiser les dommages causés par les radicaux libres et à protéger la peau de la pollution ou d'autres facteurs environnementaux. La peau terne et fatiguée retrouve fraîcheur et jeunesse. Mélangez le gel pour le visage à votre crème hydratante pour le visage ou le corps.",
    "ingredients": "Extrait de plantes",
    "arome": "Floraison mentholée, accent fruité",
    "inci": "INGRÉDIENTS / INCI : Aqua, Alcohol, Glycerin, Carrageenan, Cellulose Gum, Ceratonia Siliqua Gum, Parfum, Glucose, Ginkgo Biloba (Ginkgo) Leaf Extract➀, Citric Acid, Sodium Phytate, Camellia Sinensis (Green Tea) Leaf Extract➀, Potassium Hydroxide, Quercus Robur (Oak) Bark Extract➀, Vitis Vinifera (Grape) Seed Extract➀, Sodium Benzoate, Potassium Sorbatel. ➀ Ingrédient issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-booster-au-ginkgo-antioxydant-4.png",
    "url": ""
  },
  {
    "slug": "gel-booster-a-la-cafeine-4",
    "code": "A5820-30",
    "nom": "Gel Booster à la caféine",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 10.5,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "Concentré en gel avec caféine dosée à 1 % pour contribuer à réduire les poches sous les yeux et donner de la fraîcheur aux peaux fatiguées. Particulièrement bénéfique pour la peau du contour des yeux. Mélanger à votre crème hydratante pour le visage ou les yeux.\nMode d'emploi : Mélanger 1 à 3 gouttes à son soin hydratant du visage ou contour des yeux, ou utiliser seul.",
    "ingredients": "Caféine",
    "arome": "Floraison mentholée, accent fruité",
    "inci": "INGRÉDIENTS / INCI : Aqua, Alcohol, Glycerin➀, Caffeine, Carrageenan, Cellulose Gum, Ceratonia Siliqua Gum, Parfum, Glucose, Sodium Phytate, Citric Acid. ➀ Fabriqué avec des ingrédients biologiques",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-booster-a-la-cafeine-4.png",
    "url": ""
  },
  {
    "slug": "gel-double-hydratation-boost-5",
    "code": "A5861",
    "nom": "Gel Double Hydratation Boost + HA",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 10.58,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "Gel régénérant à base d’acide hyaluronique léger de poids moléculaire multiple, qui contribue à former une barrière hydratante sur la peau, empêchant la perte d’hydratation et renforçant la fermeté et l’élasticité naturelles. Atténue la formation des petites rides et ridules et rafraîchit la peau. Appliquez le produit sur une peau préalablement nettoyée.",
    "ingredients": "Sodium PCA, Acide hyaluronique, Jus de feuilles d'Aloe, Extrait de sauge, Extrait de thé blanc",
    "arome": "Arôme aquatique frais avec des notes fruitées juteuses et sucrées",
    "inci": "INGRÉDIENTS / INCI : Aloe Barbadensis (Aloe) Leaf Juice*, Pentylene Glycol, Butylene Glycol, Glycerin**, Sodium PCA, Aqua/Water, Propanediol, Cellulose Gum, Parfum/Fragrance, Algin, Camellia Sinensis (White Tea) Leaf Extract*, Salvia Officinalis (Sage) Leaf Extract*, Hydrolyzed Hyaluronic Acid, Lactic Acid, Sodium Hyaluronate, Sodium Phytate, Rhamnose, Glucose, Glucuronic Acid *Ingrédients issus de l’agriculture biologique **Fabriqué à base d’ingrédients biologiques.",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-double-hydratation-boost-5.png",
    "url": ""
  },
  {
    "slug": "nettoyant-visage-purifiant-anti-imperfections",
    "code": "S0107",
    "nom": "Nettoyant purifiant anti-imperfections pour le visage",
    "categorie": "soins-du-visage",
    "volume": "140 ml",
    "prix_ht": 11.42,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "Un incontournable de toute gamme de soins anti-imperfections, qui répond à la demande croissante de solutions nettoyantes à la fois douces et efficaces pour les peaux à tendance acnéique. Avec son profil rafraîchissant et purifiant, il s'intègre parfaitement dans les gammes de beauté modernes axées sur le naturel.\n\nCe nettoyant doux pour le visage nettoie et purifie efficacement les peaux sujettes aux imperfections sans utiliser de tensioactifs agressifs. Sa formule au pH équilibré aide à éliminer les impuretés et l'excès de sébum tout en préservant l'équilibre naturel de l'hydratation de la peau, laissant le teint frais, doux et confortable. Les extraits de feuille de maté, de mousse d'Islande et de callus de genévrier ont des propriétés apaisantes et purifiantes, favorisant un teint plus lisse et plus clair. Avec son arôme frais de thé vert, ce nettoyant est idéal comme première étape d'une routine de soins anti-imperfections. Appliquez une petite quantité sur la peau humide, massez doucement, puis rincez abondamment.\nMode d'emploi : Ce nettoyant doux pour le visage nettoie et purifie efficacement les peaux sujettes aux imperfections sans utiliser de tensioactifs agressifs. Appliquez une petite quantité sur la peau humide, massez doucement, puis rincez abondamment.",
    "ingredients": "Glycérine, PCA sodique, Extrait de feuille de maté, Extrait de mousse d'Islande, Extrait de callus de genévrier",
    "arome": "thé vert frais",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Coco-Glucoside, Cocamidopropyl Betaine, Glycerin, Xanthan Gum, Propanediol, Sodium PCA, Sodium Levulinate, Lactic Acid, Ilex Paraguariensis (Mate) Leaf Extract➀, Parfum/Fragrance, Acacia Senegal Gum, Sodium Anisate, Alcohol, Rhamnose, CI 77007 (Ultramarines)➂, Glucose, Glucuronic Acid, Cetraria Islandica (Iceland Moss) Extract, Usnea Barbata (Lichen) Extract, Juniperus Communis (Juniper) Callus Extract, Silica, Kaolin, Linalool➁, Linalyl Acetate➁. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/nettoyant-visage-purifiant-anti-imperfections.png",
    "url": ""
  },
  {
    "slug": "sunscreen-spf30-with-tint-1Ru0O",
    "code": "S5980",
    "nom": "Crème solaire teintée SPF 30",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 10.58,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "Crème solaire minérale teintée SPF 30 (haute protection), qui aide à unifier le teint pour un éclat naturel. Sa texture légère se fond dans la peau sans laisser de traces blanches et offre une couvrance légère qui embellit le teint. Enrichie en argousier riche en oméga et en acide hyaluronique, elle aide à maintenir l'hydratation et le confort de la peau tout au long de la journée. Présentée en flacon de verre avec pompe. Ce produit n'assure pas une protection totale contre les UVA et les UVB : une exposition prolongée au soleil reste un risque sérieux pour la santé, même avec une protection solaire.",
    "ingredients": "Oxyde de zinc, huile de pépins de framboise, extrait d'argousier, acide hyaluronique",
    "arome": "Agrumes doux et fruités sur un fond crémeux et doux",
    "inci": "INGRÉDIENTS / INCI : Zinc Oxide, Aqua/Water, Dicaprylyl Carbonate, Isoamyl Laurate, Squalane, Caprylic/Capric Triglyceride, Glycerin, CI 77891 (Titanium Dioxide)➂, Polyglyceryl-3 Polyricinoleate, Sorbitan Oleate, Lecithin, Hydrated Silica, Cera Alba (Beeswax), Polyglyceryl-6 Stearate, Sodium Chloride, Hectorite, Jojoba Esters, Sorbitan Caprylate, Parfum/Fragrance, Polyhydroxystearic Acid, Hippophae Rhamnoides (Sea Buckthorn) Fruit Extract➀, Citric Acid, Polyglyceryl-6 Behenate, Propanediol, Caprylyl Glycol, Benzoic Acid, Sodium Phytate, Isostearic Acid, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, [CI 77491, CI 77492, CI 77499 (Iron Oxides)]➀, Limonene➁, Citrus Aurantium Peel Oil, Linalool➁, Citrus Limon Peel Oil, Pinene➁, Vanillin, Citral➁. ➀ Ingrédient issu de l'agriculture biologique ➁ Issu d'huiles essentielles naturelles ➂ Pigments minéraux purs",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/sunscreen-spf30-with-tint-1Ru0O.png",
    "url": ""
  },
  {
    "slug": "serum-gelee-prebiotique-bioactif",
    "code": "A5926",
    "nom": "Sérum Gelée Prébiotique Bioactif",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 11.5,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [],
    "description": "Offrez à vos clients une solution de soins de la peau fondée sur la science avec ce sérum infusé de prébiotiques. Conçu pour soutenir le microbiome de la peau, il est parfait pour tous les types de peau et constitue un ajout polyvalent à toute collection axée sur l'équilibre et la santé de la peau.\n\nIl s'agit d'une formule légère, à base de gel, conçue pour équilibrer et nourrir votre peau. Infusée de prébiotiques, elle soutient la barrière protectrice de la peau, procure un effet apaisant et favorise un teint radieux.",
    "ingredients": "prébiotiques, acide hyaluronique, sodium PCA",
    "arome": "Vert, agrumes, menthe, boisé",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Alcohol②, Glycerin②, Sodium PCA, Cellulose Gum, Algin, Lactobacillus Ferment Lysate, Parfum/Fragrance, Sodium Phytate, Potassium Sorbate, Sodium Benzoate, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, Pogostemon Cablin Oil. ② Fabriqué avec des ingrédients biologiques",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-gelee-prebiotique-bioactif.png",
    "url": ""
  },
  {
    "slug": "serum-aux-exosomes-et-a-la-niacinamide",
    "code": "S0119",
    "nom": "Sérum aux exosomes et à la niacinamide",
    "categorie": "soins-du-visage",
    "volume": "30 ml",
    "prix_ht": 11.83,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [],
    "description": "Le sérum aux exosomes et à la niacinamide est un produit de soin incontournable pour les marques qui souhaitent proposer des formules innovantes, axées sur l'éclat et très tendance. Alliant la technologie des exosomes à des actifs qui renforcent la barrière cutanée, il contribue à une peau d'apparence plus saine et plus éclatante.\n\nSa formule avancée favorise le renouvellement cellulaire tout en atténuant le teint terne, les irrégularités de teint et les premiers signes de vieillissement. Enrichi en exosomes infusés d'extrait de pomme, en niacinamide et en ferments favorisant le microbiome, ce sérum aide à renforcer la barrière cutanée tout en rendant la peau plus lisse, plus lumineuse et plus éclatante. L'acide lactique affine délicatement le teint, tandis que l'acide hyaluronique apporte une hydratation légère pour une apparence plus repulpée et plus fraîche. La centella asiatica aide à apaiser et à réconforter la peau, lui donnant un aspect revitalisé jour après jour.\nCe sérum pénètre rapidement et s'intègre facilement à votre routine de soins du matin comme du soir. Convient à tous les types de peau.",
    "ingredients": "Exosomes , Acide lactique, Niacinamide, Acide hyaluronique",
    "arome": "Sans parfum",
    "inci": "INGRÉDIENTS / INCI : Aqua/Water, Dicaprylyl Carbonate, Niacinamide, Glycerin, Pentylene Glycol, Cetearyl Alcohol, Polyglyceryl-6 Stearate, Butylene Glycol, Simmondsia Chinensis (Jojoba) Seed Oil➀, Pyrus Malus Fruit Extract, Polyglyceryl-6 Behenate, Caprylic/Capric Triglyceride, Xanthan Gum, Phospholipids, Lactobacillus Ferment, Lactic Acid, Sodium Phytate, Centella Asiatica Leaf Extract, Hydrolyzed Hyaluronic Acid, Sodium Hyaluronate, CI 77491 (Iron Oxides). ➀ Ingrédient issu de l'agriculture biologique",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/serum-aux-exosomes-et-a-la-niacinamide.png",
    "url": ""
  },
  {
    "slug": "duo-renouveau-derma",
    "code": "S0101",
    "nom": "Duo Renouveau Derma",
    "categorie": "collection-box",
    "volume": "430 ml",
    "prix_ht": 21.08,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Hydratation en profondeur",
      "apport instantané d'hydratation",
      "texture légère",
      "régénère la surface de la peau"
    ],
    "description": "Revitalisez et perfectionnez votre gamme de soins avec notre Duo Renouveau Derma personnalisable. Disponible pour les commandes standard et en dropshipping.\n\nFormulé avec des actifs cliniquement prouvés, ce duo exfolie et régénère la peau en douceur. L’acide kojique agit sur le teint irrégulier et le manque d’éclat, tandis que l’urée et le panthénol hydratent intensément et renforcent la barrière cutanée. Ensemble, ils offrent une peau plus lisse, lumineuse et visiblement plus saine que vos clients adoreront.\n\nCe qu'il y a à l'intérieur :\n\nExfoliant Visage & Corps Éclat à l’Acide Kojique : Élimine délicatement les cellules mortes tout en aidant à unifier le teint et à raviver l’éclat de la peau.\n\nCrème Corps 5 % Urée + 2 % Panthénol : Hydrate en profondeur et apaise, restaurant le confort des peaux sèches ou rugueuses.\n\nLe Duo Renouveau Derma est idéal pour les soins post-été, les traitements en spa ou les rituels quotidiens de renouvellement cutané.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/duo-renouveau-derma.png",
    "url": ""
  },
  {
    "slug": "duo-cheveux-brillants",
    "code": "S0097",
    "nom": "Duo cheveux brillants",
    "categorie": "collection-box",
    "volume": "580 ml",
    "prix_ht": 16.58,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Hydratant",
      "Doux pour les cheveux",
      "Lissant",
      "Adoucit les cheveux"
    ],
    "description": "Offrez à vos clients le secret de cheveux éclatants et d'apparence saine avec notre Duo cheveux brillants personnalisable. Disponible pour les commandes standard et en dropshipping.\n\nCe duo hydrate en profondeur et redonne de la brillance : les cheveux sont lisses, doux et faciles à coiffer. Présenté dans un élégant coffret noir avec un fourreau personnalisable, il reflète le style de votre marque et enrichit votre offre capillaire.\n\nCe qu'il y a à l'intérieur :\nShampooing hydratant : nettoie en douceur tout en réhydratant, pour des cheveux plus doux et plus souples.\nAprès-shampooing hydratant : nourrit et démêle, pour des cheveux soyeux, brillants et faciles à coiffer.\n\nLe Duo cheveux brillants est idéal pour un lancement en boutique, un cadeau en salon ou un coffret de découverte haut de gamme.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/duo-cheveux-brillants.png",
    "url": ""
  },
  {
    "slug": "coffret-de-soins-pour-peaux-a-imperfections",
    "code": "S0126",
    "nom": "Coffret de soins pour peaux à imperfections",
    "categorie": "collection-box",
    "volume": "560 ml",
    "prix_ht": 67.75,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Soin anti-imperfections",
      "pour un teint plus lisse",
      "purifie les pores",
      "formule douce"
    ],
    "description": "Une routine complète de soins de la peau spécialement conçue pour les peaux à imperfections, qui aide à purifier, clarifier et équilibrer le teint.\nComposé d'acides exfoliants, de niacinamide, d'argile et d'actifs hydratants, cet ensemble contribue à une peau d'apparence plus nette en agissant sur l'excès de sébum, les pores obstrués et le grain de peau irrégulier. Ce rituel en plusieurs étapes, du nettoyage au soin et à l'hydratation, aide à atténuer l'apparence des imperfections tout en préservant le confort et l'équilibre de la peau.\nLa collection comprend :\nConcentré Peeling AHA\nNettoyant purifiant pour le visage contre l'acné\nCrème hydratante anti-acné\nTonique purifiant\nGel hydratant à la niacinamide\nMasque à l'argile pour les pores et les points noirs",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "",
    "url": "",
    "image_a_venir": true,
    "image_a_refaire": true
  },
  {
    "slug": "coffret-spa-luxe",
    "code": "S0075",
    "nom": "Coffret spa luxe",
    "categorie": "collection-box",
    "volume": "3060 ml",
    "prix_ht": 118.01,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Pour un microbiome équilibré",
      "une texture soyeuse",
      "des soins de spa",
      "un usage professionnel"
    ],
    "description": "Le coffret SPA de luxe est destiné aux marques qui souhaitent proposer des produits haut de gamme à leurs clients.\nIl s'agit d'un ensemble des produits les plus luxueux pour votre marque. Cette collection comprend des produits de soin pour le corps et les cheveux de haute qualité, conçus pour offrir une expérience SPA à vos clients. Tout ce qu'il faut pour des cheveux doux et volumineux et une peau lisse et soyeuse avec un microbiome équilibré.\nTous les produits inclus dans l'échantillon :\nBrume Visage Prébiotique Microbiome\nAprès-shampooing volumateur à la kératine\nBrume capillaire sans rinçage Keratin Shine\nVolcan islandais Exfoliant pour le visage et le corps\nHuile fortifiante pour cheveux et cuir chevelu au romarin\nExfoliant pour cuir chevelu Deep Cleanse, romarin et menthe\nGel lavant mains & corps, pamplemousse\nGel lavant corps, ambre et vanille\nCrème pour le corps à 5 % d'hydroxyéthylurée + 2 % de panthénol\nCrème pour les mains Silk Skin, ambre boisé et cuir\nSérum corporel Silk Skin, ambre boisé et cuir",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/coffret-spa-luxe.png",
    "url": ""
  },
  {
    "slug": "collection-de-routines-sans-retinol",
    "code": "S0125",
    "nom": "Collection de routines sans rétinol",
    "categorie": "collection-box",
    "volume": "315 ml",
    "prix_ht": 57.08,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Alternative douce au rétinol",
      "agit sur les rides et les ridules",
      "adoucit la peau",
      "convient aux peaux sensibles"
    ],
    "description": "Une alternative douce et d'origine végétale aux soins traditionnels à base de rétinol, conçue pour offrir des bienfaits visibles en matière de renouvellement cutané, sans irritation.\nCette gamme s'appuie sur des alternatives végétales au rétinol, associées à des ingrédients nourrissants qui contribuent à améliorer la douceur, la fermeté et l'éclat général de la peau. La routine couvre toutes les étapes, du nettoyage en douceur aux sérums ciblés, en passant par les soins pour les yeux et l'hydratation, ce qui la rend idéale pour les peaux sensibles ou pour celles et ceux qui souhaitent éviter le rétinol tout en traitant les premiers signes de vieillissement.\nLa collection comprend :\nSérum naturel à base d’huile alternatif au rétinol\nSérum alternatif au rétinol\nCrème hydratante alternative au rétinol\nSérum contour des yeux alternatif au rétinol\nLait nettoyant doux",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/collection-de-routines-sans-retinol.png",
    "url": ""
  },
  {
    "slug": "collection-pour-le-corps-peau-douce-et-soyeuse",
    "code": "S0130",
    "nom": "Collection pour le corps « Peau douce et soyeuse »",
    "categorie": "collection-box",
    "volume": "1455 ml",
    "prix_ht": 57.92,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Hydratation en profondeur",
      "formule à absorption rapide",
      "apaise et hydrate"
    ],
    "description": "Un rituel complet de soins du corps conçu pour nourrir, adoucir et hydrater la peau en profondeur, tout en offrant une expérience olfactive unique.\nCette gamme comprend une huile pour le corps, une crème hydratante, un gel nettoyant, un soin pour les mains et un sérum pour le corps, pour une peau lisse et éclatante de santé de la tête aux pieds. Enrichie en huiles nourrissantes, en urée et en actifs revitalisants, elle contribue à améliorer la texture et l'hydratation de la peau tout en laissant un parfum délicat.\nLa collection comprend :\nHuile corporelle Omega 6-9 pour une peau éclatante\nCrème pour le corps à 5 % d'hydroxyéthylurée + 2 % de panthénol\nGel lavant mains & corps, Ambre & Patchouli\nCrème pour les mains Silk Skin, ambre boisé et cuir\nSérum corporel Silk Skin, épices et bois de santal",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/collection-pour-le-corps-peau-douce-et-soyeuse.png",
    "url": ""
  },
  {
    "slug": "collection-professionnelle-pour-salons-de-coiffure",
    "code": "S0078",
    "nom": "Collection professionnelle pour salons de coiffure",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 75.48,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "pour les cheveux volumineux",
      "produits de salon",
      "usage professionnel",
      "conçus pour les coiffeurs"
    ],
    "description": "La collection Professional Hair Salon est destinée aux marques qui souhaitent proposer des produits haut de gamme à leurs clients.\nIl s'agit d'un ensemble de produits professionnels sous marque propre pour votre marque. Cette collection comprend des produits capillaires de haute qualité conçus pour être proposés dans les salons de coiffure. Tout ce qu'il faut pour des cheveux doux, volumineux et forts.\nTous les produits inclus dans l'échantillon :\nExfoliant purifiant pour cuir chevelu\nShampooing, Smoky Green Vetiver\nHuile fortifiante pour cheveux et cuir chevelu au romarin\nAprès-shampooing volumateur à la kératine\nBrume capillaire sans rinçage Keratin Shine\nShampooing pour cuir chevelu sensible",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/collection-professionnelle-pour-salons-de-coiffure.png",
    "url": ""
  },
  {
    "slug": "ensemble-performance-ultime",
    "code": "S0085",
    "nom": "Ensemble Performance ultime",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 251.31,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "haute performance",
      "pour un microbiome sain",
      "conçu pour des résultats quotidiens",
      "usage professionnel"
    ],
    "description": "Le coffret Ultimate Performance Bundle est idéal pour les marques qui souhaitent proposer des produits efficaces. Élaborés à partir d'ingrédients haut de gamme et de grande qualité, tous les produits de ce coffret reflètent notre engagement en faveur de soins de la peau propres et efficaces.\nCette collection comprend des produits de marque privée qui hydratent en profondeur, éclaircissent et unifient le teint, aident à prévenir et à atténuer les taches brunes, équilibrent le microbiome cutané et préviennent et atténuent les signes du vieillissement.\nProduits inclus dans cet ensemble :\nCrème de jour anti-âge\nCrème de nuit Ceramide Barrier\nSérum naturel à base d’huile alternatif au rétinol\nSérum anti-âge aux peptides\nCrème contour des yeux apaisante\nGel hydratant à la niacinamide\nCrème de nuit anti-âge au collagène\nHuile visage tout-en-un, 30 ml\nConcentré Peeling AHA\nGel Double Hydratation Boost + HA\nSérum à la vitamine C\nSérum Gelée Prébiotique Bioactif\nBrume Visage Prébiotique Microbiome\nTonique exfoliant à l'acide glycolique\nSérum contour des yeux alternatif au rétinol\nSérum Collagène Boost\nSérum alternatif au rétinol\nCrème hydratante alternative au rétinol\nSoin ciblé contre les taches brunes, 1 % d'acide kojique\nCrème pour le visage anti-taches brunes à l'acide kojique\nExfoliant éclaircissant pour le visage et le corps à l'acide kojique",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/ensemble-performance-ultime.png",
    "url": ""
  },
  {
    "slug": "ensemble-de-soins-anti-age-pour-la-peau",
    "code": "S0082",
    "nom": "Ensemble de soins anti-âge pour la peau",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 188.28,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Anti-âge",
      "pour un regard plus jeune",
      "raffermit la peau",
      "hydratation en profondeur"
    ],
    "description": "Ensemble complet de soins anti-âge pour une routine complète. Il s'agit d'une gamme soigneusement sélectionnée pour rafraîchir et nourrir la peau afin de lui donner un aspect plus jeune et éclatant. Cet ensemble comprend tous les produits indispensables qui se complètent et combattent les signes du vieillissement, offrant à la peau de vos clients un soin complet. Il s'agit d'une routine facile à suivre pour une peau plus saine et d'apparence plus jeune.\nProduits inclus dans cet ensemble :\nCrème de jour anti-âge\nSérum anti-âge aux peptides\nSérum naturel à base d’huile alternatif au rétinol\nSérum perfecteur de pigment\nCrème contour des yeux apaisante\nEau micellaire nettoyante\nSérum à la vitamine C\nCrème de nuit anti-âge au collagène\nGel Double Hydratation Boost + HA\nSérum Collagène Boost\nSérum contour des yeux alternatif au rétinol\nSérum alternatif au rétinol\nCrème hydratante alternative au rétinol\nSoin ciblé contre les taches brunes, 1 % d'acide kojique\nCrème pour le visage anti-taches brunes à l'acide kojique\nExfoliant éclaircissant pour le visage et le corps à l'acide kojique",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "",
    "url": "",
    "image_a_venir": true,
    "image_a_refaire": true
  },
  {
    "slug": "ensemble-de-soins-cliniques-pharmaceutiques",
    "code": "S0079",
    "nom": "Ensemble de soins cliniques pharmaceutiques",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 154.11,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Anti-âge",
      "réparation de la barrière cutanée",
      "doux",
      "destiné aux cliniques",
      "respectueux de la peau"
    ],
    "description": "Le Clinical Care Pharma Bundle est une gamme complète de solutions avancées pour les soins de la peau. Cette collection sélectionnée avec soin comprend des produits contenant des ingrédients actifs puissants, conçus pour répondre à des préoccupations spécifiques, allant de la lutte contre le vieillissement à la réparation de la barrière cutanée. C'est le kit de démarrage idéal pour créer une marque professionnelle, axée sur les résultats, à laquelle les clients feront confiance.\nTous les produits inclus dans l'échantillon :\nTonique exfoliant à l'acide glycolique\nCrème de nuit Ceramide Barrier\nGel hydratant à la niacinamide\nCrème pour le corps pour peaux sensibles\nCrème hydratante pour peaux sensibles, sans parfum\nSérum Gelée Prébiotique Bioactif\nBrume Visage Prébiotique Microbiome\nCrème pour le corps à 5 % d'hydroxyéthylurée + 2 % de panthénol\nLait nettoyant doux\nCrème de jour anti-âge\nGel Booster à la caféine, flacon ambré\nGel Double Hydratation Boost + HA\nGel hydratant non gras",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/ensemble-de-soins-cliniques-pharmaceutiques.png",
    "url": ""
  },
  {
    "slug": "ensemble-de-soins-pour-peaux-sensibles",
    "code": "S0084",
    "nom": "Ensemble de soins pour peaux sensibles",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 59.87,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "doux pour la peau",
      "renforce la barrière cutanée",
      "pour les peaux sensibles",
      "apaise la peau"
    ],
    "description": "Cet ensemble comprend une collection soigneusement sélectionnée de produits spécialement formulés pour les peaux sensibles. Il contient tout ce dont vous avez besoin pour créer une gamme complète de produits destinés aux peaux sensibles.\nCes produits ne contiennent aucun ingrédient irritant. Ils sont doux pour la peau et renforcent sa barrière protectrice naturelle. Proposez à vos clients des produits qui nourrissent, protègent et prennent soin de leur peau.\nProduits inclus dans cet ensemble :\nNettoyant peaux sensibles visage & corps\nCrème hydratante pour peaux sensibles, sans parfum\nCrème pour le corps pour peaux sensibles\nShampooing pour cuir chevelu sensible\nNettoyant à base d'huile et de lait pour peaux sensibles",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/ensemble-de-soins-pour-peaux-sensibles.png",
    "url": ""
  },
  {
    "slug": "ensemble-pour-estheticienne-en-salon-de-beaute",
    "code": "S0077",
    "nom": "Ensemble pour esthéticienne en salon de beauté",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 105.15,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "beauté naturelle",
      "nourrissante",
      "douce pour la peau",
      "pour les esthéticiennes"
    ],
    "description": "Ce pack est destiné aux marques qui souhaitent proposer des produits haut de gamme à leurs clients.\nLe pack Esthéticienne pour salon de beauté comprend des produits de soin du visage de qualité professionnelle sous marque propre. Cette collection comprend des produits de beauté propres et de haute qualité, conçus pour être utilisés dans les salons de beauté.\nTous les produits inclus dans l'échantillon :\nLait nettoyant doux\nConcentré Peeling AHA\nSérum hydratant\nSérum Collagène Boost\nCrème de jour légère et hydratante\nGel hydratant à la niacinamide\nCrème apaisante pour les yeux\nTonique purifiant\nGel hydratant non gras",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/ensemble-pour-estheticienne-en-salon-de-beaute.png",
    "url": ""
  },
  {
    "slug": "gamme-de-soins-capillaires-keratin-boost",
    "code": "S0128",
    "nom": "Gamme de soins capillaires Keratin Boost",
    "categorie": "collection-box",
    "volume": "1050 ml",
    "prix_ht": 35,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Épaississant",
      "revitalise le cuir chevelu",
      "pour plus de volume",
      "enrichi en kératine"
    ],
    "description": "Une routine de soins capillaires fortifiante conçue pour aider à réparer les dommages, améliorer la résistance et rehausser la brillance grâce à des formules à base de kératine.\nCette gamme est spécialement conçue pour les cheveux fragiles, secs et abîmés, et propose un système complet comprenant un shampooing, un après-shampooing, un masque et une brume sans rinçage. Enrichie en kératine et en ingrédients nourrissants, elle aide à lisser la fibre capillaire, à réduire la casse et à redonner aux cheveux un aspect plus sain et plus brillant à chaque utilisation.\nLa collection comprend :\nMasque capillaire réparateur intensif à la kératine\nAprès-shampooing volumateur à la kératine\nBrume capillaire sans rinçage Keratin Shine",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "",
    "url": "",
    "image_a_venir": true,
    "image_a_refaire": true
  },
  {
    "slug": "la-collection-complete",
    "code": "S0081",
    "nom": "La collection complète",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 975.71,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "une gamme variée de produits",
      "parfaits pour les découvrir",
      "adaptés à tous les types de peau",
      "très performants"
    ],
    "description": "Le kit de démarrage ultime pour votre marque. Notre collection complète comprend une gamme variée de produits, notamment une gamme complète de solutions de soins pour le visage, les cheveux et le corps. Grâce à des formules conçues pour répondre à tous les besoins, des soins anti-âge ciblés et anti-taches aux soins quotidiens d'hydratation, de nettoyage et de protection solaire, vous pouvez facilement créer une marque complète qui répond aux besoins de chaque client.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/la-collection-complete.png",
    "url": ""
  },
  {
    "slug": "les-indispensables-du-fitness-et-du-bien-etre",
    "code": "S0076",
    "nom": "Les indispensables du fitness et du bien-être",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 125.45,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "réparation de la barrière cutanée",
      "hydratation en profondeur",
      "nettoyage en douceur",
      "après l'entraînement"
    ],
    "description": "Une gamme complète de produits de bien-être pour le visage et le corps. Cet ensemble sélectionné avec soin de produits de marque privée est un gage de qualité et de soin. Axée sur la réparation de la barrière cutanée, l'hydratation en profondeur et le nettoyage en douceur, cette gamme vous permet d'offrir une expérience complète pour le visage et le corps sous votre propre marque, conçue pour les consommateurs modernes soucieux de leur bien-être.\nTous les produits inclus dans l'échantillon :\nGel lavant mains & corps, cèdre et menthe poivrée\nGel lavant mains & corps, cardamome et gingembre\nGel lavant mains & corps, Ambre & Patchouli\nSérum corporel Silk Skin, ambre boisé et cuir\nCrème pour le corps à 5 % d'hydroxyéthylurée + 2 % de panthénol\nCrème pour les mains Silk Skin, épices et bois de santal\nVolcan islandais Exfoliant pour le visage et le corps\nGel lavant mains & corps, pamplemousse, 490 ml\nEau micellaire nettoyante\nGel hydratant non gras\nCrème de jour hydratante\nBrume Visage Prébiotique Microbiome",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/les-indispensables-du-fitness-et-du-bien-etre.png",
    "url": ""
  },
  {
    "slug": "lot-de-produits-essentiels-pour-les-cheveux",
    "code": "S0123",
    "nom": "Lot de produits essentiels pour les cheveux",
    "categorie": "collection-box",
    "volume": "980 ml",
    "prix_ht": 33.25,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "pour les cheveux volumineux",
      "les soins proposés en salon",
      "les produits indispensables",
      "pour une brillance naturelle"
    ],
    "description": "Le coffret d'essai « Hair Care Essentials » s'adresse aux marques qui souhaitent proposer une introduction de qualité et attrayante à leur gamme de soins capillaires.\nCet ensemble soigneusement sélectionné contient des produits de qualité professionnelle qui redonnent du volume aux cheveux, revitalisent le cuir chevelu et prennent soin des cheveux de la racine jusqu'aux pointes. Idéal pour un soin quotidien et des résultats visibles.\nProduits inclus dans le coffret :\nAprès-shampooing volumateur à la kératine\nExfoliant pour cuir chevelu Deep Cleanse, romarin et menthe\nHuile fortifiante pour cheveux et cuir chevelu au romarin",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "",
    "url": "",
    "image_a_venir": true,
    "image_a_refaire": true
  },
  {
    "slug": "lot-cheveux-brillants",
    "code": "S0129",
    "nom": "Lot « Cheveux brillants »",
    "categorie": "collection-box",
    "volume": "970 ml",
    "prix_ht": 31.08,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Apporte de la brillance aux cheveux",
      "rend les cheveux soyeux",
      "dégage un parfum délicat",
      "facilite le démêlage"
    ],
    "description": "Une routine de soins capillaires purifiante et revitalisante, conçue pour rééquilibrer le cuir chevelu et redonner à vos cheveux leur éclat et leur douceur naturels.\nCe coffret associe un nettoyage en profondeur, une action nourrissante et un soin fortifiant pour éliminer les résidus tout en favorisant un cuir chevelu sain. Grâce à son action exfoliante, hydratante et à ses soins à base d'huiles, il aide à rééquilibrer le cuir chevelu et laisse les cheveux rafraîchis, brillants et pleins de vitalité.\nLe pack comprend :\nExfoliant pour cuir chevelu Deep Cleanse\nShampooing, Smoky Green Vetiver\nAprès-shampooing, Smoky Green Vetiver\nHuile fortifiante pour cheveux et cuir chevelu au romarin",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/lot-cheveux-brillants.png",
    "url": ""
  },
  {
    "slug": "lot-eclaircissant-a-l-acide-kojique",
    "code": "S0124",
    "nom": "Lot éclaircissant à l'acide kojique",
    "categorie": "collection-box",
    "volume": "950 ml",
    "prix_ht": 55.58,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Soin ciblé",
      "éclaircissant",
      "uniformise le teint",
      "pour les taches brunes"
    ],
    "description": "Un coffret de soins éclaircissants ciblés, conçu pour aider à uniformiser le teint et à atténuer l'apparence des taches brunes. Idéal pour les marques qui souhaitent proposer une routine complète de soins anti-pigmentation à base d'actifs hautement performants.\nCe coffret associe exfoliation, traitement ciblé et soins quotidiens à base d'acide kojique, de vitamine C et d'acide glycolique pour aider à révéler un teint plus éclatant et plus uniforme. Il intervient à différentes étapes de la routine – du nettoyage et de l'exfoliation jusqu'à l'application du sérum et de la crème hydratante – pour favoriser, au fil du temps, une peau plus lisse et plus lumineuse. Idéal pour les clients préoccupés par le teint terne, la pigmentation et le teint irrégulier.\nLe pack comprend :\nCrème pour le visage anti-taches brunes à l'acide kojique\nExfoliant éclaircissant pour le visage et le corps à l'acide kojique\nSoin ciblé contre les taches brunes, 1 % d'acide kojique\nSérum à la vitamine C\nTonique exfoliant à l'acide glycolique",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/lot-eclaircissant-a-l-acide-kojique.png",
    "url": ""
  },
  {
    "slug": "pack-des-meilleures-ventes-de-tous-les-temps",
    "code": "S0083",
    "nom": "Pack des meilleures ventes de tous les temps",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 180.53,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Haute performance",
      "best-sellers",
      "actifs naturels",
      "pour tous les types de peau"
    ],
    "description": "Ce pack best-sellers de tous les temps comprend les produits de soin essentiels les plus performants. Il est idéal pour les marques qui souhaitent proposer des produits que leurs clients adoreront immédiatement.\nLes produits de cette collection best-sellers sont appréciés de tous pour leurs formules performantes qui répondent aux besoins des clients modernes. En intégrant ces produits de beauté propres et de haute qualité à votre gamme de soins, votre entreprise mise sur la qualité, l'efficacité et la satisfaction client!\nProduits inclus dans cet ensemble :\nTonique hydratant\nGel Booster à la caféine\nCrème de nuit Ceramide Barrier\nSérum naturel à base d’huile alternatif au rétinol\nCrème de jour hydratante\nGel Double Hydratation Boost + HA\nSérum à la vitamine C\nConcentré Peeling AHA\nNettoyant peaux sensibles visage & corps\nHuile visage tout-en-un\nSérum anti-âge aux peptides\nCrème contour des yeux apaisante\nNettoyant à base d'huile et de lait pour peaux sensibles\nCrème de jour anti-âge\nMousse nettoyante",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/pack-des-meilleures-ventes-de-tous-les-temps.png",
    "url": ""
  },
  {
    "slug": "selection-de-maquilleurs-specialises-dans-la-beaute-naturelle",
    "code": "S0131",
    "nom": "Sélection de maquilleurs spécialisés dans la beauté naturelle",
    "categorie": "collection-box",
    "volume": "342 ml",
    "prix_ht": 253.25,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "Délicat",
      "pour un teint uniforme",
      "un toucher velouté",
      "destiné aux maquilleurs professionnels"
    ],
    "description": "Une gamme de maquillage naturel de qualité professionnelle, conçue pour offrir un résultat impeccable, un confort optimal pour la peau et une polyvalence au quotidien.\nCette collection soigneusement sélectionnée comprend des produits essentiels pour le teint, les yeux et les lèvres, conçus pour offrir une couvrance fiable, une longue tenue et un fini naturel. Grâce à ses ingrédients respectueux de la peau et à son approche moderne de la « clean beauty », elle est idéale tant pour les maquilleurs professionnels que pour les consommateurs à la recherche de produits de maquillage hautement performants offrant des bienfaits pour la peau.\nLa collection comprend :\nFond de teint aux peptides, 05 Clair neutre\nFond de teint aux peptides, 10 Clair chaud\nFond de teint aux peptides, 15 Clair froid\nFond de teint aux peptides, 20 Moyen neutre\nFond de teint aux peptides, 25 Moyen chaud\nFond de teint aux peptides, 30 Hâlé neutre\nFond de teint aux peptides, 35 Hâlé chaud\nFond de teint aux peptides, 40 Foncé neutre\nFond de teint aux peptides, 45 Foncé chaud\nFond de teint aux peptides, 50 Foncé froid\nAnti-cernes correcteur, 05 Clair froid\nAnti-cernes correcteur, 10 Clair Chaud\nAnti-cernes correcteur, 15 Moyen froid\nAnti-cernes correcteur, 20 Moyen chaud\nAnti-cernes correcteur, 25 Moyen neutre\nAnti-cernes correcteur, 30 Hâlé neutre\nAnti-cernes correcteur, 35 Foncé neutre\nMascara allongeant et volumisant\nRouge à lèvres mat, nude terracotta\nRouge à lèvres mat, vieux rose",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/selection-de-maquilleurs-specialises-dans-la-beaute-naturelle.png",
    "url": ""
  },
  {
    "slug": "la-collection-complete-seconde-selection",
    "code": "S0080",
    "nom": "La collection complète, seconde sélection",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 836.21,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "une gamme variée de produits",
      "parfaits pour les découvrir",
      "adaptés à tous les types de peau",
      "très performants"
    ],
    "description": "Le kit de démarrage ultime pour votre marque. Cette collection complète comprend une gamme variée de produits, avec des solutions de soins pour le visage, les cheveux et le corps. Grâce à des formules conçues pour tous les besoins, des soins anti-âge ciblés et anti-taches aux soins quotidiens d'hydratation, de nettoyage et de protection solaire, vous pouvez facilement créer une marque complète qui répond aux besoins de chaque client.",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/la-collection-complete-seconde-selection.png",
    "url": ""
  },
  {
    "slug": "trousse-de-toilette-pour-homme",
    "code": "S0086",
    "nom": "Trousse de toilette pour homme",
    "categorie": "collection-box",
    "volume": "",
    "prix_ht": 78.38,
    "prix_conseilles": null,
    "certifications": [],
    "star_features": [
      "conçu pour les hommes",
      "routine complète",
      "usage professionnel",
      "soin quotidien rafraîchissant"
    ],
    "description": "Le kit de soins pour hommes comprend une gamme de produits conçus pour répondre aux besoins de l'homme moderne. Ce coffret de soins pour hommes de marque privée offre une routine complète. Des sérums et crèmes aux huiles à barbe et nettoyants doux pour la peau.\nCe coffret comprend 8 produits :\nGel visage au zinc sans huile pour hommes\nCrème contour des yeux 3 en 1\nHuile à barbe adoucissante\nNettoyant 2 en 1 pour les cheveux et le corps pour les hommes\nCrème visage à l'acide hyaluronique pour hommes\nGel Booster au ginkgo antioxydant, 20 ml\nSérum hydratant, flacon noir\nGel Booster à la caféine, 20 ml",
    "ingredients": "",
    "arome": "",
    "inci": "",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/trousse-de-toilette-pour-homme.png",
    "url": ""
  },
  {
    "slug": "gel-booster-a-la-cafeine",
    "code": "A5820",
    "nom": "Gel Booster à la caféine",
    "categorie": "soins-du-visage",
    "volume": "15 ml",
    "prix_ht": 6.25,
    "prix_conseilles": null,
    "certifications": [
      "Ecocert COSMOS Natural"
    ],
    "star_features": [
      "​​​​​​​Rafraîchissant",
      "Non gras",
      "Hydratant"
    ],
    "description": "Concentré en gel avec caféine dosée à 1 % pour contribuer à réduire les poches sous les yeux et donner de la fraîcheur aux peaux fatiguées. Particulièrement bénéfique pour la peau du contour des yeux. Mélanger 1 à 3 gouttes à son soin hydratant du visage ou contour des yeux, ou utiliser seul.",
    "ingredients": "Caféine",
    "arome": "Floraison mentholée, accent fruité",
    "inci": "INGRÉDIENTS / INCI : Aqua, Alcohol, Glycerin➀, Caffeine, Carrageenan, Cellulose Gum, Ceratonia Siliqua Gum, Parfum, Glucose, Sodium Phytate, Citric Acid ➀ Fabriqué à partir d'ingrédients biologiques",
    "image": "https://ssjhqlgbgmtzvmmrxcbs.supabase.co/storage/v1/object/public/product-images/clean-products/gel-booster-a-la-cafeine.png",
    "url": ""
  }
];

/** Produits que les clientes voient au catalogue (affiché dans les textes d'accueil). */
export const NOMBRE_PRODUITS_COMMANDABLES = PRODUCTS.filter((p) => estCommandable(p)).length;

/** Fiches cosmétiques en ligne (coffrets compris, compléments alimentaires et produits retirés exclus) : le compteur du catalogue. */
export const NOMBRE_PRODUITS_CATALOGUE = PRODUCTS.filter((p) => p.categorie !== "supplements" && p.status !== "retired").length;
