/**
 * SECTOR → SPECIALIST REGISTRY
 * 
 * Tableau complet des 20 secteurs et leurs spécialistes automatiquement créés
 * Ce registre est la source de vérité pour :
 * - create-organization-v2 (edge function)
 * - ConfigSiteInstallStep (installation widget)
 * - useSectorConfig (dashboard)
 * 
 * ⚠️ IMPORTANT: Synchroniser avec supabase/functions/create-organization-v2/index.ts
 */

export interface SectorSpecialistConfig {
  sector: string;
  sectorLabel: string;
  specialistTitle: string;
  specialistBadge: string;
  agentType: string;
  agentCategory: 'diagnostic' | 'tryon' | 'coaching' | 'advisor';
  specialty: 'SKINCARE' | 'HAIRCARE' | 'WELLNESS' | 'OPTICS' | 'SKINCARE_HAIRCARE' | 'CATERING' | 'FASHION' | 'MAKEUP' | 'SHOES' | 'JEWELRY' | 'FURNITURE' | 'NUTRITION' | 'PERFUME' | 'ELECTRONICS' | 'FOOD' | 'PETS' | 'SPORT' | 'SERVICES' | 'OTHER';
  defaultName: string;
  demoUrl?: string;
  widgetScript: 'shopify-embed.js' | 'woo-embed.js';
}

/**
 * COMPLETE MAPPING: 20 Sectors → Specialists
 * Garantit 100% de couverture pour l'onboarding et l'installation widget
 */
export const SECTOR_SPECIALIST_REGISTRY: SectorSpecialistConfig[] = [
  // ============================================
  // DIAGNOSTIC & SANTÉ (3)
  // ============================================
  {
    sector: 'skincare',
    sectorLabel: 'Skincare / Cosmétiques',
    specialistTitle: 'Diagnosticien Peau',
    specialistBadge: 'DIAGNOSTIC',
    agentType: 'skin_diagnostic',
    agentCategory: 'diagnostic',
    specialty: 'SKINCARE',
    defaultName: 'Clara',
    demoUrl: '/demo/diagnostic-peau',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'haircare',
    sectorLabel: 'Cheveux / Capillaire',
    specialistTitle: 'Diagnosticien Cheveux',
    specialistBadge: 'DIAGNOSTIC',
    agentType: 'hair_diagnostic',
    agentCategory: 'diagnostic',
    specialty: 'HAIRCARE',
    defaultName: 'Jade',
    demoUrl: '/demo/diagnostic-capillaire',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'wellness',
    sectorLabel: 'Bien-être / Fitness',
    specialistTitle: 'Coach Bien-être',
    specialistBadge: 'WELLNESS',
    agentType: 'fitness_coaching',
    agentCategory: 'coaching',
    specialty: 'WELLNESS',
    defaultName: 'Noa',
    demoUrl: '/demo/coach-wellness',
    widgetScript: 'shopify-embed.js',
  },
  
  // ============================================
  // TRY-ON SPECIALISTS (8)
  // ============================================
  {
    sector: 'wigs',
    sectorLabel: 'Perruques / Extensions',
    specialistTitle: 'Essayeur Perruques',
    specialistBadge: 'TRYON',
    agentType: 'wig_tryon',
    agentCategory: 'tryon',
    specialty: 'HAIRCARE',
    defaultName: 'Zoé',
    demoUrl: '/demo/wig-tryon',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'optical',
    sectorLabel: 'Optique / Lunetterie',
    specialistTitle: 'Essayeur Lunettes',
    specialistBadge: 'TRYON',
    agentType: 'glasses_tryon',
    agentCategory: 'tryon',
    specialty: 'OPTICS',
    defaultName: 'Lila',
    demoUrl: '/demo/eyewear-tryon',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'fashion',
    sectorLabel: 'Mode / Vêtements',
    specialistTitle: 'Essayeur Mode IA',
    specialistBadge: 'TRYON',
    agentType: 'clothing_tryon',
    agentCategory: 'tryon',
    specialty: 'FASHION',
    defaultName: 'Léo',
    demoUrl: '/demo/fashion-tryon',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'makeup',
    sectorLabel: 'Maquillage',
    specialistTitle: 'Essayeur Maquillage IA',
    specialistBadge: 'TRYON',
    agentType: 'makeup_tryon',
    agentCategory: 'tryon',
    specialty: 'MAKEUP',
    defaultName: 'Rose',
    demoUrl: '/demo/makeup-tryon',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'shoes',
    sectorLabel: 'Chaussures',
    specialistTitle: 'Essayeur Chaussures IA',
    specialistBadge: 'TRYON',
    agentType: 'shoes_tryon',
    agentCategory: 'tryon',
    specialty: 'SHOES',
    defaultName: 'Stella',
    demoUrl: '/demo/shoes-tryon',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'jewelry',
    sectorLabel: 'Bijoux / Joaillerie',
    specialistTitle: 'Essayeur Bijoux IA',
    specialistBadge: 'TRYON',
    agentType: 'jewelry_tryon',
    agentCategory: 'tryon',
    specialty: 'JEWELRY',
    defaultName: 'Luna',
    demoUrl: '/demo/jewelry-tryon',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'watches',
    sectorLabel: 'Montres / Horlogerie',
    specialistTitle: 'Essayeur Montres IA',
    specialistBadge: 'TRYON',
    agentType: 'watch_tryon',
    agentCategory: 'tryon',
    specialty: 'JEWELRY',
    defaultName: 'Hugo',
    demoUrl: '/demo/watch-tryon-template',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'furniture',
    sectorLabel: 'Décoration / Mobilier',
    specialistTitle: 'Designer Déco IA',
    specialistBadge: 'TRYON',
    agentType: 'decor_tryon',
    agentCategory: 'tryon',
    specialty: 'FURNITURE',
    defaultName: 'Flora',
    demoUrl: '/demo/decor-tryon',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'decoration',
    sectorLabel: 'Décoration (alias)',
    specialistTitle: 'Designer Déco IA',
    specialistBadge: 'TRYON',
    agentType: 'decor_tryon',
    agentCategory: 'tryon',
    specialty: 'FURNITURE',
    defaultName: 'Flora',
    demoUrl: '/demo/decor-tryon',
    widgetScript: 'shopify-embed.js',
  },
  
  // ============================================
  // COACHING & CONSULTING (2)
  // ============================================
  {
    sector: 'nutrition',
    sectorLabel: 'Nutrition / Diététique',
    specialistTitle: 'Conseiller Nutrition',
    specialistBadge: 'NUTRITION',
    agentType: 'nutrition_coaching',
    agentCategory: 'coaching',
    specialty: 'NUTRITION',
    defaultName: 'Mila',
    demoUrl: '/demo/coach-nutrition',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'catering',
    sectorLabel: 'Traiteur / Événementiel',
    specialistTitle: 'Expert Devis Traiteur',
    specialistBadge: 'QUOTE',
    agentType: 'catering_quote',
    agentCategory: 'advisor',
    specialty: 'CATERING',
    defaultName: 'Capucine',
    widgetScript: 'shopify-embed.js',
  },
  
  // ============================================
  // PRODUCT ADVISORS (7 generic sectors)
  // ============================================
  {
    sector: 'perfume',
    sectorLabel: 'Parfumerie',
    specialistTitle: 'Conseiller Parfums',
    specialistBadge: 'CONSEILLER',
    agentType: 'product_advisor',
    agentCategory: 'advisor',
    specialty: 'PERFUME',
    defaultName: 'Iris',
    demoUrl: '/demo/advisor-perfume',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'electronics',
    sectorLabel: 'Électronique / Tech',
    specialistTitle: 'Conseiller Tech',
    specialistBadge: 'CONSEILLER',
    agentType: 'product_advisor',
    agentCategory: 'advisor',
    specialty: 'ELECTRONICS',
    defaultName: 'Tara',
    demoUrl: '/demo/advisor-electronics',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'food',
    sectorLabel: 'Épicerie / Alimentaire',
    specialistTitle: 'Conseiller Épicerie',
    specialistBadge: 'CONSEILLER',
    agentType: 'product_advisor',
    agentCategory: 'advisor',
    specialty: 'FOOD',
    defaultName: 'Lou',
    demoUrl: '/demo/advisor-food',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'pets',
    sectorLabel: 'Animaux / Animalerie',
    specialistTitle: 'Conseiller Animaux',
    specialistBadge: 'CONSEILLER',
    agentType: 'product_advisor',
    agentCategory: 'advisor',
    specialty: 'PETS',
    defaultName: 'Axelle',
    demoUrl: '/demo/advisor-pets',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'sport',
    sectorLabel: 'Sport / Outdoor',
    specialistTitle: 'Coach Sport',
    specialistBadge: 'CONSEILLER',
    agentType: 'product_advisor',
    agentCategory: 'coaching',
    specialty: 'SPORT',
    defaultName: 'Maëlle',
    demoUrl: '/demo/advisor-sport',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'services',
    sectorLabel: 'Services',
    specialistTitle: 'Conseiller Services',
    specialistBadge: 'CONSEILLER',
    agentType: 'product_advisor',
    agentCategory: 'advisor',
    specialty: 'SERVICES',
    defaultName: 'Léna',
    widgetScript: 'shopify-embed.js',
  },
  {
    sector: 'other',
    sectorLabel: 'Autre',
    specialistTitle: 'Conseiller IA',
    specialistBadge: 'CONSEILLER',
    agentType: 'product_advisor',
    agentCategory: 'advisor',
    specialty: 'OTHER',
    defaultName: 'Éva',
    demoUrl: '/demo/advisor-other',
    widgetScript: 'shopify-embed.js',
  },
];

/**
 * Get specialist config by sector
 */
export function getSpecialistBySector(sector: string): SectorSpecialistConfig | undefined {
  return SECTOR_SPECIALIST_REGISTRY.find(s => s.sector === sector);
}

/**
 * Get default specialist (fallback)
 */
export function getDefaultSpecialist(): SectorSpecialistConfig {
  return SECTOR_SPECIALIST_REGISTRY.find(s => s.sector === 'skincare')!;
}

/**
 * Total count of unique sectors (excluding aliases)
 */
export const TOTAL_UNIQUE_SECTORS = SECTOR_SPECIALIST_REGISTRY.filter(
  s => s.sector !== 'decoration' // Exclude alias (decoration → furniture)
).length;

// Export summary for verification
console.log(`[SECTOR_SPECIALIST_REGISTRY] ${SECTOR_SPECIALIST_REGISTRY.length} entries loaded (${TOTAL_UNIQUE_SECTORS} unique sectors)`);
