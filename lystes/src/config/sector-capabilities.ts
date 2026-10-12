/**
 * SECTOR CAPABILITIES REGISTRY
 * 
 * Defines the special capability each Expert Produit has on single product pages.
 * The capability is ALWAYS focused on the current product — not a generic diagnostic.
 * 
 * Each sector has exactly ONE capability type:
 * - photo_diagnostic: Upload photo → AI analysis → product match (skincare, haircare)
 * - virtual_tryon: Upload photo → overlay product on photo (wigs, optical, makeup, fashion, jewelry, watches)
 * - visualizer: Upload photo of space → project product in it (furniture)
 * - questionnaire: Series of questions → personalized recommendation (wellness, nutrition, perfume, etc.)
 * - configurator: Build/customize a service → get quote (catering)
 */

export type CapabilityType =
  | 'photo_diagnostic'
  | 'virtual_tryon'
  | 'questionnaire'
  | 'visualizer'
  | 'configurator';

export interface QuestionnaireField {
  id: string;
  label: string;
  type: 'select' | 'multi_select' | 'slider' | 'text';
  options?: string[];
  min?: number;
  max?: number;
}

export interface TryOnConfig {
  enabled: boolean;
  mode: 'realtime' | 'photo_only';
  decartModel: string;
  promptTemplate: string;
  fallbackToPhoto: boolean;
  idealResolution: { width: number; height: number; fps: number };
}

export interface SectorCapability {
  type: CapabilityType;
  /** Button label shown to the customer */
  label: string;
  /** Lucide icon name */
  icon: string;
  /** Short description for the customer */
  description: string;
  /** AI prompt addition for this capability — always product-centric */
  promptContext: string;
  /** Does it need a photo upload? */
  requiresPhoto: boolean;
  /** For questionnaire / configurator types */
  questionnaireFields?: QuestionnaireField[];
  /** Decart realtime try-on config (for virtual_tryon sectors) */
  tryonConfig?: TryOnConfig;
}

// ─────────────────────────────────────────────
// REGISTRY — 19 sectors
// ─────────────────────────────────────────────

export const SECTOR_CAPABILITIES: Record<string, SectorCapability> = {

  // ═══ PHOTO DIAGNOSTIC ═══

  skincare: {
    type: 'photo_diagnostic',
    label: 'Diagnostic peau',
    icon: 'Scan',
    description: 'Analysez votre peau pour savoir si ce produit vous correspond',
    promptContext: `Analyze the customer's skin photo. Identify skin type, hydration level, redness, pores, elasticity, pigmentation.
Then explain specifically WHY this product is suited for their skin condition.
Provide a personalized routine incorporating this product.
Be specific about what you observed and how this product addresses those concerns.`,
    requiresPhoto: true,
  },

  haircare: {
    type: 'photo_diagnostic',
    label: 'Diagnostic cheveux',
    icon: 'Scan',
    description: 'Analysez vos cheveux pour savoir si ce soin vous correspond',
    promptContext: `Analyze the customer's hair photo. Identify hair type (straight/wavy/curly/coily), thickness, porosity signs, damage level, scalp condition if visible.
Then explain specifically WHY this product is suited for their hair type and condition.
Provide a personalized hair care routine incorporating this product.
Be specific about what you observed and how this product addresses those concerns.`,
    requiresPhoto: true,
  },

  // ═══ VIRTUAL TRY-ON ═══

  wigs: {
    type: 'virtual_tryon',
    label: 'Essayer cette perruque',
    icon: 'Camera',
    description: 'Voyez cette perruque sur vous en temps réel',
    promptContext: `The customer wants to try on THIS specific wig. Show them how it would look on their face shape. Comment on how the style, length, and color complement their features.`,
    requiresPhoto: true,
    tryonConfig: {
      enabled: true,
      mode: 'realtime',
      decartModel: 'lucy_v2v_720p_rt',
      promptTemplate: "Replace the person's hair with this specific wig: {product_name}. The wig has these characteristics: {product_description}. Maintain natural look, proper hair placement on the head, realistic hair physics and movement.",
      fallbackToPhoto: true,
      idealResolution: { width: 1280, height: 704, fps: 25 },
    },
  },

  optical: {
    type: 'virtual_tryon',
    label: 'Essayer ces lunettes',
    icon: 'Camera',
    description: 'Voyez ces lunettes sur votre visage en temps réel',
    promptContext: `The customer wants to try on THESE specific glasses. Analyze their face shape and comment on how the frame style, size, and color suit their features.`,
    requiresPhoto: true,
    tryonConfig: {
      enabled: true,
      mode: 'realtime',
      decartModel: 'lucy_v2v_720p_rt',
      promptTemplate: "Add these specific glasses to the person's face: {product_name}. Frame style: {product_description}. Position correctly on the nose bridge, proper sizing for face width, realistic reflections on lenses.",
      fallbackToPhoto: true,
      idealResolution: { width: 1280, height: 704, fps: 25 },
    },
  },

  makeup: {
    type: 'virtual_tryon',
    label: 'Essayer ce maquillage',
    icon: 'Camera',
    description: 'Testez ce maquillage en temps réel',
    promptContext: `The customer wants to try THIS specific makeup product. Show them how it would look on their skin tone and features. Comment on color match and application tips specific to their face.`,
    requiresPhoto: true,
    tryonConfig: {
      enabled: true,
      mode: 'realtime',
      decartModel: 'lucy_v2v_720p_rt',
      promptTemplate: "Apply this makeup product to the person's face: {product_name}. Product details: {product_description}. Natural blending, appropriate color on their skin tone, realistic finish.",
      fallbackToPhoto: true,
      idealResolution: { width: 1280, height: 704, fps: 25 },
    },
  },

  fashion: {
    type: 'virtual_tryon',
    label: 'Essayer ce vêtement',
    icon: 'Camera',
    description: 'Visualisez ce vêtement sur vous en temps réel',
    promptContext: `The customer wants to see how THIS specific clothing item would look on their body type. Analyze their morphology from the photo and explain how this garment fits their silhouette. Suggest the best size and any styling tips.`,
    requiresPhoto: true,
    tryonConfig: {
      enabled: true,
      mode: 'realtime',
      decartModel: 'lucy_v2v_720p_rt',
      promptTemplate: "Change the person's clothing to this specific item: {product_name}. Details: {product_description}. Maintain natural draping, proper fit to body type, realistic fabric texture and movement.",
      fallbackToPhoto: true,
      idealResolution: { width: 1280, height: 704, fps: 25 },
    },
  },

  jewelry: {
    type: 'virtual_tryon',
    label: 'Essayer ce bijou',
    icon: 'Camera',
    description: 'Visualisez ce bijou sur vous en temps réel',
    promptContext: `The customer wants to try THIS specific jewelry piece. Based on their photo, show how it would look and comment on how it complements their style, skin tone, and features.`,
    requiresPhoto: true,
    tryonConfig: {
      enabled: true,
      mode: 'realtime',
      decartModel: 'lucy_v2v_720p_rt',
      promptTemplate: "Add this jewelry piece to the person: {product_name}. Details: {product_description}. Correct placement, realistic metallic shine, proper scale relative to body.",
      fallbackToPhoto: true,
      idealResolution: { width: 1280, height: 704, fps: 25 },
    },
  },

  watches: {
    type: 'virtual_tryon',
    label: 'Essayer cette montre',
    icon: 'Camera',
    description: 'Visualisez cette montre à votre poignet en temps réel',
    promptContext: `The customer wants to see THIS specific watch on their wrist. Based on their photo, comment on the size proportions relative to their wrist and how the style matches their look.`,
    requiresPhoto: true,
    tryonConfig: {
      enabled: true,
      mode: 'realtime',
      decartModel: 'lucy_v2v_720p_rt',
      promptTemplate: "Add this watch to the person's wrist: {product_name}. Details: {product_description}. Correct wrist placement, proper size proportions, realistic reflections on dial.",
      fallbackToPhoto: true,
      idealResolution: { width: 1280, height: 704, fps: 25 },
    },
  },

  // ═══ VISUALIZER ═══

  furniture: {
    type: 'visualizer',
    label: 'Visualiser dans ma pièce',
    icon: 'Home',
    description: 'Projetez ce meuble dans votre intérieur',
    promptContext: `The customer wants to see how THIS specific furniture piece would look in their room. Analyze the room photo (style, colors, space available) and explain how this piece integrates. Comment on size compatibility, style harmony, and placement suggestions.`,
    requiresPhoto: true,
  },

  // ═══ QUESTIONNAIRE ═══

  wellness: {
    type: 'questionnaire',
    label: 'Diagnostic bien-être',
    icon: 'Heart',
    description: 'Découvrez si ce produit correspond à vos besoins',
    promptContext: `Based on the customer's wellness questionnaire answers, explain specifically WHY this product addresses their concerns. Connect each of their reported issues to specific ingredients or benefits of this product. Provide personalized usage recommendations.`,
    requiresPhoto: false,
    questionnaireFields: [
      { id: 'concern', label: 'Votre préoccupation principale', type: 'select', options: ['Stress', 'Sommeil', 'Énergie', 'Digestion', 'Immunité', 'Douleurs', 'Peau/cheveux', 'Autre'] },
      { id: 'frequency', label: 'Depuis combien de temps', type: 'select', options: ['Récent (< 1 mois)', 'Quelques mois', 'Chronique (> 6 mois)'] },
      { id: 'current', label: 'Prenez-vous déjà des compléments ?', type: 'select', options: ['Non', 'Oui, vitamines', 'Oui, plantes', 'Oui, plusieurs'] },
      { id: 'intensity', label: 'Intensité du besoin', type: 'slider', min: 1, max: 10 },
    ],
  },

  nutrition: {
    type: 'questionnaire',
    label: 'Diagnostic nutrition',
    icon: 'Apple',
    description: 'Ce produit correspond-il à vos objectifs nutritionnels ?',
    promptContext: `Based on the customer's nutrition questionnaire, explain specifically WHY this product fits their dietary goals. Reference specific nutritional values, ingredients, and how they align with the customer's objectives. Suggest serving sizes and meal integration tips.`,
    requiresPhoto: false,
    questionnaireFields: [
      { id: 'goal', label: 'Votre objectif', type: 'select', options: ['Perte de poids', 'Prise de masse', 'Équilibre alimentaire', 'Sport & performance', 'Végan/végétarien', 'Sans gluten', 'Autre'] },
      { id: 'allergies', label: 'Allergies ou intolérances', type: 'multi_select', options: ['Aucune', 'Gluten', 'Lactose', 'Noix', 'Soja', 'Œufs', 'Autre'] },
      { id: 'frequency', label: 'Fréquence de consommation', type: 'select', options: ['Quotidien', 'Plusieurs fois/semaine', 'Occasionnel'] },
    ],
  },

  perfume: {
    type: 'questionnaire',
    label: 'Profil olfactif',
    icon: 'Wind',
    description: 'Découvrez si ce parfum correspond à vos goûts',
    promptContext: `Based on the customer's olfactory profile, explain specifically WHY this perfume matches their preferences. Reference the specific notes (top, heart, base) of this perfume and how they align with the customer's taste. Suggest when and how to wear it. Compare to scent families they already enjoy.`,
    requiresPhoto: false,
    questionnaireFields: [
      { id: 'family', label: 'Familles olfactives préférées', type: 'multi_select', options: ['Floral', 'Boisé', 'Oriental', 'Frais/Agrumes', 'Musqué', 'Gourmand', 'Vert', 'Aquatique'] },
      { id: 'intensity', label: 'Intensité préférée', type: 'select', options: ['Léger & discret', 'Modéré', 'Intense & puissant'] },
      { id: 'occasion', label: 'Occasion principale', type: 'select', options: ['Quotidien', 'Bureau', 'Soirée', 'Été', 'Hiver', 'Toutes occasions'] },
      { id: 'current', label: 'Un parfum que vous aimez déjà', type: 'text' },
    ],
  },

  electronics: {
    type: 'questionnaire',
    label: 'Diagnostic besoin',
    icon: 'Cpu',
    description: 'Ce produit correspond-il à votre usage ?',
    promptContext: `Based on the customer's usage questionnaire, explain specifically WHY this electronic product fits their needs. Compare the product specs to their stated requirements. Highlight features that directly address their use case and flag any potential limitations for their needs.`,
    requiresPhoto: false,
    questionnaireFields: [
      { id: 'usage', label: 'Usage principal', type: 'select', options: ['Personnel', 'Professionnel', 'Gaming', 'Création/Design', 'Étudiant', 'Famille'] },
      { id: 'priority', label: 'Priorité', type: 'select', options: ['Performance', 'Autonomie', 'Légèreté', 'Prix', 'Qualité écran', 'Polyvalence'] },
      { id: 'budget', label: 'Budget', type: 'select', options: ['< 200€', '200-500€', '500-1000€', '1000-2000€', '> 2000€'] },
      { id: 'existing', label: 'Appareil actuel', type: 'text' },
    ],
  },

  food: {
    type: 'questionnaire',
    label: 'Recettes & accords',
    icon: 'ChefHat',
    description: 'Découvrez comment cuisiner ce produit',
    promptContext: `Based on the customer's food preferences, suggest 2-3 specific recipes using THIS product. Include preparation tips, ingredient pairings, and serving suggestions. Tailor the difficulty level to their cooking experience. If they have dietary restrictions, adapt the recipes accordingly.`,
    requiresPhoto: false,
    questionnaireFields: [
      { id: 'level', label: 'Niveau en cuisine', type: 'select', options: ['Débutant', 'Intermédiaire', 'Confirmé', 'Chef amateur'] },
      { id: 'diet', label: 'Régime alimentaire', type: 'multi_select', options: ['Aucun', 'Végétarien', 'Végan', 'Sans gluten', 'Sans lactose', 'Halal', 'Casher'] },
      { id: 'occasion', label: 'Pour quelle occasion', type: 'select', options: ['Repas quotidien', 'Apéro', 'Dîner entre amis', 'Repas de fête', 'Snack rapide'] },
    ],
  },

  pets: {
    type: 'questionnaire',
    label: 'Profil animal',
    icon: 'PawPrint',
    description: 'Ce produit est-il adapté à votre animal ?',
    promptContext: `Based on the customer's pet profile, explain specifically WHY this product is suited for their animal. Reference the pet's breed, size, age, and any specific needs. Provide dosage or usage recommendations tailored to their pet. Flag any precautions specific to their animal's profile.`,
    requiresPhoto: false,
    questionnaireFields: [
      { id: 'animal', label: "Type d'animal", type: 'select', options: ['Chien', 'Chat', 'Rongeur', 'Oiseau', 'Poisson', 'Reptile', 'Autre'] },
      { id: 'breed', label: 'Race (optionnel)', type: 'text' },
      { id: 'age', label: 'Âge', type: 'select', options: ['Bébé (< 6 mois)', 'Junior (6 mois - 2 ans)', 'Adulte (2-7 ans)', 'Senior (> 7 ans)'] },
      { id: 'size', label: 'Taille', type: 'select', options: ['Très petit (< 5kg)', 'Petit (5-10kg)', 'Moyen (10-25kg)', 'Grand (25-45kg)', 'Très grand (> 45kg)', 'N/A'] },
      { id: 'concern', label: 'Besoin spécifique', type: 'multi_select', options: ['Alimentation', 'Pelage/peau', 'Articulations', 'Digestion', 'Comportement', 'Hygiène', 'Aucun'] },
    ],
  },

  sport: {
    type: 'questionnaire',
    label: 'Profil sportif',
    icon: 'Dumbbell',
    description: 'Cet équipement correspond-il à votre niveau ?',
    promptContext: `Based on the customer's sports profile, explain specifically WHY this equipment/product fits their level and goals. Reference their sport, frequency, and objectives. Provide sizing or setup recommendations. Suggest how to integrate this product into their training routine.`,
    requiresPhoto: false,
    questionnaireFields: [
      { id: 'sport', label: 'Sport principal', type: 'select', options: ['Running', 'Musculation', 'Yoga/Pilates', 'Cyclisme', 'Natation', 'Sports collectifs', 'Randonnée', 'Fitness', 'Arts martiaux', 'Autre'] },
      { id: 'level', label: 'Niveau', type: 'select', options: ['Débutant', 'Intermédiaire', 'Confirmé', 'Compétition'] },
      { id: 'frequency', label: 'Fréquence', type: 'select', options: ['1-2x/semaine', '3-4x/semaine', '5+/semaine', 'Quotidien'] },
      { id: 'goal', label: 'Objectif', type: 'select', options: ['Débuter', 'Progresser', 'Performance', 'Récupération', 'Confort', 'Style'] },
    ],
  },

  // ═══ CONFIGURATOR ═══

  catering: {
    type: 'configurator',
    label: 'Devis personnalisé',
    icon: 'FileText',
    description: 'Configurez cette prestation et obtenez un devis',
    promptContext: `The customer wants to configure THIS specific catering service/menu. Based on their requirements (guests, date, preferences), provide a detailed personalized quote. Break down the pricing, suggest add-ons, and confirm availability. Be specific about what's included in this particular offering.`,
    requiresPhoto: false,
    questionnaireFields: [
      { id: 'guests', label: 'Nombre de convives', type: 'select', options: ['< 10', '10-20', '20-50', '50-100', '100-200', '> 200'] },
      { id: 'event', label: "Type d'événement", type: 'select', options: ['Mariage', 'Anniversaire', 'Entreprise', 'Cocktail', 'Buffet', 'Repas assis', 'Autre'] },
      { id: 'diet', label: 'Contraintes alimentaires', type: 'multi_select', options: ['Aucune', 'Végétarien', 'Végan', 'Halal', 'Casher', 'Sans gluten', 'Allergies'] },
      { id: 'budget', label: 'Budget par personne', type: 'select', options: ['< 20€', '20-40€', '40-70€', '70-100€', '> 100€'] },
    ],
  },

  shoes: {
    type: 'questionnaire',
    label: 'Guide taille',
    icon: 'Ruler',
    description: 'Trouvez votre taille idéale pour ce modèle',
    promptContext: `Based on the customer's foot measurements and preferences, recommend the exact size for THIS specific shoe model. Consider the brand's sizing (runs small/large), the shoe type (sneaker vs dress shoe), and the customer's comfort preferences. Provide confidence level in the recommendation.`,
    requiresPhoto: false,
    questionnaireFields: [
      { id: 'usual_size', label: 'Votre pointure habituelle', type: 'select', options: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'] },
      { id: 'width', label: 'Largeur du pied', type: 'select', options: ['Étroit', 'Normal', 'Large', 'Très large'] },
      { id: 'fit', label: 'Préférence de confort', type: 'select', options: ['Ajusté', 'Confortable', 'Ample'] },
      { id: 'brand_ref', label: 'Une marque où vous connaissez votre taille', type: 'text' },
    ],
  },

  other: {
    type: 'questionnaire',
    label: 'Conseil personnalisé',
    icon: 'MessageCircle',
    description: 'Découvrez si ce produit vous correspond',
    promptContext: `Based on the customer's answers, explain specifically WHY this product is suited for their needs. Be specific about features that match their requirements and transparent about any limitations.`,
    requiresPhoto: false,
    questionnaireFields: [
      { id: 'need', label: 'Votre besoin principal', type: 'text' },
      { id: 'usage', label: "Fréquence d'utilisation prévue", type: 'select', options: ['Quotidien', 'Hebdomadaire', 'Occasionnel', 'Ponctuel'] },
      { id: 'priority', label: 'Critère le plus important', type: 'select', options: ['Qualité', 'Prix', 'Durabilité', "Facilité d'utilisation", 'Design', 'Performance'] },
    ],
  },
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** Get capability config for a sector, falls back to 'other' */
export function getSectorCapability(sector: string | null | undefined): SectorCapability {
  if (!sector) return SECTOR_CAPABILITIES.other;
  return SECTOR_CAPABILITIES[sector] || SECTOR_CAPABILITIES.other;
}

/** Check if a sector requires photo upload for its capability */
export function sectorRequiresPhoto(sector: string | null | undefined): boolean {
  return getSectorCapability(sector).requiresPhoto;
}

/** Build the AI system prompt for a capability interaction */
export function buildCapabilityPrompt(
  sector: string,
  product: { name: string; description?: string; price?: number; metadata?: Record<string, unknown> }
): string {
  const cap = getSectorCapability(sector);
  return `SYSTEM CONTEXT:
- Sector: ${sector}
- Product name: ${product.name}
- Product description: ${product.description || 'N/A'}
- Product price: ${product.price ? `${product.price}€` : 'N/A'}
${product.metadata ? `- Product specs: ${JSON.stringify(product.metadata)}` : ''}

CAPABILITY: ${cap.promptContext}

IMPORTANT: Your analysis must be specifically about THIS product (${product.name}).
Do not recommend other products. Explain why THIS product is or isn't suited for the customer based on your analysis.
If the product is well-suited, explain exactly why with specific references to the analysis results.
If the product is not ideal, be honest but suggest how they could still benefit from it, or what to complement it with from the same brand.`;
}
