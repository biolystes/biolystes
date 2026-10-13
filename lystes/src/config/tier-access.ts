/**
 * Tier Access Configuration
 * Centralized configuration for subscription tiers, limits, and menu access
 * 5-tier model: Free, Starter, Pro, Business, Enterprise
 */

export type TierName = 'free' | 'starter' | 'pro' | 'business' | 'enterprise';

// Ordered array for tier comparison (index = tier level)
export const TIER_ORDER: TierName[] = ['free', 'starter', 'pro', 'business', 'enterprise'];

// Tier display names for UI
export const TIER_DISPLAY_NAMES: Record<TierName, string> = {
  free: 'Gratuit',
  starter: 'Starter',
  pro: 'Pro',
  business: 'Business',
  enterprise: 'Enterprise',
};

// Limits per tier (null = unlimited)
export interface TierLimits {
  products: number | null;
  services: number | null;
  interactions_monthly: number | null;
  images_monthly: number | null;
  messages_monthly: number | null;
  before_after: number | null;
  reviews: number | null;
  conversation_history_days: number | null;
  sub_accounts: number | null;
  agents: number | null;
  blog_posts: number | null;
  /* Réseaux sociaux reliables simultanément (22/08/2026). Le plafond est
     re-vérifié côté serveur à la connexion : ce champ sert l'affichage. */
  reseaux_sociaux: number | null;
}

export const TIER_LIMITS: Record<TierName, TierLimits> = {
  free: {
    products: 30,
    services: 5,
    interactions_monthly: 50,
    images_monthly: 0,
    messages_monthly: 50,
    before_after: 0,
    reviews: 0,
    conversation_history_days: 7,
    sub_accounts: 0,
    agents: 1,
    blog_posts: 0,
    reseaux_sociaux: 0,
  },
  starter: {
    products: 50,
    services: 10,
    interactions_monthly: 500,
    images_monthly: 200,
    messages_monthly: 500,
    before_after: 5,
    reviews: 10,
    conversation_history_days: 30,
    sub_accounts: 1,
    agents: 1,
    blog_posts: 5,
    reseaux_sociaux: 1,
  },
  pro: {
    products: 100,
    services: 50,
    interactions_monthly: 1000,
    images_monthly: 600,
    messages_monthly: 1000,
    before_after: 15,
    reviews: 30,
    conversation_history_days: 90,
    sub_accounts: 1,
    agents: 3,
    blog_posts: 20,
    reseaux_sociaux: 3,
  },
  business: {
    products: 300,
    services: 150,
    interactions_monthly: 3000,
    images_monthly: 1250,
    messages_monthly: 3000,
    before_after: null,
    reviews: null,
    conversation_history_days: null,
    sub_accounts: 3,
    agents: 5,
    blog_posts: null,
    reseaux_sociaux: null,
  },
  enterprise: {
    products: null,
    services: null,
    interactions_monthly: null,
    images_monthly: null,
    messages_monthly: null,
    before_after: null,
    reviews: null,
    conversation_history_days: null,
    sub_accounts: null,
    agents: null,
    blog_posts: null,
    reseaux_sociaux: null,
  },
};

// Menu access configuration with optional limitKey
export interface MenuAccessConfig {
  requiredTier: TierName;
  limitKey?: keyof TierLimits;
}

// Menu access configuration: menu ID -> { requiredTier, limitKey? }
export const MENU_ACCESS: Record<string, MenuAccessConfig> = {
  // Free+ (accessible to all tiers including free)
  'dashboard': { requiredTier: 'free' },
  'products': { requiredTier: 'free', limitKey: 'products' },
  'expert-products': { requiredTier: 'free' },
  'settings': { requiredTier: 'free' },
  'billing': { requiredTier: 'free' },
  'support': { requiredTier: 'free' },
  'profile': { requiredTier: 'free' },
  'notifications': { requiredTier: 'free' },

  // Starter+ (accessible to all paid tiers)
  'agents': { requiredTier: 'starter', limitKey: 'agents' },
  'services': { requiredTier: 'starter', limitKey: 'services' },
  'interactions': { requiredTier: 'starter', limitKey: 'interactions_monthly' },
  'diagnostics': { requiredTier: 'starter', limitKey: 'interactions_monthly' },
  'conversations': { requiredTier: 'starter' },
  'sections-vivantes': { requiredTier: 'starter' },
  'leads': { requiredTier: 'starter' },
  'before-after': { requiredTier: 'starter', limitKey: 'before_after' },
  'reviews': { requiredTier: 'starter', limitKey: 'reviews' },
  'brand-knowledge': { requiredTier: 'starter' },
  'integrations': { requiredTier: 'starter' },
  'tutorials': { requiredTier: 'starter' },
  'specialists': { requiredTier: 'starter' },
  // Poste de pilotage — jamais cadenassé au-dessus du palier 1
  'specialists-conv': { requiredTier: 'starter' },
  'products-conv': { requiredTier: 'starter' },
  'postpurchase-conv': { requiredTier: 'starter' },
  'historiques': { requiredTier: 'starter' },
  'contact-messages': { requiredTier: 'starter' },
  'stream': { requiredTier: 'starter' },
  'installation': { requiredTier: 'starter' },
  'catalog': { requiredTier: 'starter', limitKey: 'products' },
  'activity': { requiredTier: 'starter' },
  'equipe': { requiredTier: 'starter' },
  'stables': { requiredTier: 'starter' },
  'recruit': { requiredTier: 'starter' },

  // Créativité — ouverte a tout compte payant, plafonnee par images_monthly
  'ads-creator': { requiredTier: 'starter', limitKey: 'images_monthly' },
  'mockup-creator': { requiredTier: 'starter', limitKey: 'images_monthly' },
  'creative-ugc-images': { requiredTier: 'starter', limitKey: 'images_monthly' },
  'studio-photo': { requiredTier: 'starter', limitKey: 'images_monthly' },
  'ugc-library': { requiredTier: 'starter' },

  
  // Analytics et export — ouverts a tout compte payant
  'analytics': { requiredTier: 'starter' },
  'winners': { requiredTier: 'starter' },
  'feedback': { requiredTier: 'starter' },
  'geo-analytics': { requiredTier: 'starter' },
  'analytics-diagnostics': { requiredTier: 'starter' },
  'analysis-quality': { requiredTier: 'starter' },
  
  // Cowork, marketing, QR post-achat, marque blanche — tout compte payant
  'my-gpt': { requiredTier: 'starter' },
  'insights': { requiredTier: 'starter' },
  'my-week': { requiredTier: 'starter' },
  'marketing': { requiredTier: 'starter' },
  'product-agents': { requiredTier: 'starter' },
  'ephemeral-instructions': { requiredTier: 'starter' },
  'my-team': { requiredTier: 'starter' },
  'cerveau': { requiredTier: 'starter' },
  'team': { requiredTier: 'starter' },

  // Faire tourner vos réseaux — palier Starter, plafonné en nombre de réseaux
  /* Le rétroplanning lit les mêmes données que l'espace social : même palier.
     Sans cette ligne il retomberait sur 'free', et le cliquet le dirait. */
  'community-managers-ia-retroplanning': { requiredTier: 'starter' },
  'agence-communication-ia-annuaire': { requiredTier: 'starter' },
  'agences-marketing-ia-annuaire': { requiredTier: 'starter' },
  'agences-seo-geo-ia-annuaire': { requiredTier: 'starter' },
  'social-pilote': { requiredTier: 'starter', limitKey: 'reseaux_sociaux' },
  'social-calendrier': { requiredTier: 'starter' },
  /* `social-retombees` a été ajouté aux menus de l'espace (workspace-packs.ts
     l.1151) sans passer ici. Or un menuId absent de cette table retombe sur
     `free` (getRequiredTierForMenu, l.271) : la page devenait gratuite pour
     tout le monde, et aucune garde serveur ne rattrape, aucun menu social ne
     porte de feature_slug. La fuite est restée invisible tant que l'espace
     était fermé ; elle se serait ouverte avec lui. Même palier que ses trois
     voisines, dont elle lit les données. */
  'social-retombees': { requiredTier: 'starter' },
  'social-reseaux': { requiredTier: 'starter', limitKey: 'reseaux_sociaux' },

  // Trouver des influenceurs — palier Starter, la dépense est au crédit
  'influenceurs-trouver': { requiredTier: 'starter' },
  'influenceurs-liste': { requiredTier: 'starter' },


  /* ══ LA FUITE DE FACTURATION, FERMÉE LE 15/09/2026 ══

     Cent six menus d'espaces OUVERTS n'avaient ni entrée ici ni feature_slug.
     `getRequiredTierForMenu` leur rendait donc 'free' (l. 271) : ils étaient
     accessibles SANS ABONNEMENT, en production, sans que personne l'ait voulu.
     Ce n'est pas une politique tarifaire, c'est un oubli répété cent six fois.

     LE PALIER RETENU EST `starter`, le premier palier payant, pour trois
     raisons :
       1. c'est celui de leurs VOISINS déjà déclarés, dans les mêmes espaces
          et pour le même service ;
       2. un palier plus haut fermerait la porte à des marchandes qui paient
          déjà et s'en servent : corriger une fuite ne doit pas couper un
          client en règle ;
       3. il protège la recette sans rien promettre de neuf.

     AUCUN PLAFOND N'EST AJOUTÉ. Les voisins en portent parfois un
     (`reseaux_sociaux`, `images_monthly`). Un plafond mal choisi bloque une
     marchande au milieu de son travail, et personne ne saurait dire d'où il
     vient. Le palier suffit à fermer la fuite.

     Les huit menus déclarés `free` plus haut ne bougent pas : ils sont
     gratuits par DÉCISION, pas par oubli. ══ */

  // Rendez-vous
  'booking': { requiredTier: 'starter' },
  'booking-addons': { requiredTier: 'starter' },
  'booking-agents': { requiredTier: 'starter' },
  'booking-automations': { requiredTier: 'starter' },
  'booking-bookings': { requiredTier: 'starter' },
  'booking-calendar': { requiredTier: 'starter' },
  'booking-clientes-espace': { requiredTier: 'starter' },
  'booking-tableau-closer': { requiredTier: 'starter' },
  'booking-coupons': { requiredTier: 'starter' },
  'booking-customers': { requiredTier: 'starter' },
  'booking-equipe': { requiredTier: 'starter' },
  'booking-espace': { requiredTier: 'starter' },
  'booking-event-types': { requiredTier: 'starter' },
  'booking-integrations': { requiredTier: 'starter' },
  'booking-invoices': { requiredTier: 'starter' },
  'booking-notifications': { requiredTier: 'starter' },
  'booking-payments': { requiredTier: 'starter' },
  'booking-pipeline-config': { requiredTier: 'starter' },
  'booking-reports': { requiredTier: 'starter' },
  'booking-services': { requiredTier: 'starter' },
  'booking-settings': { requiredTier: 'starter' },

  // Vos boutiques
  'boutiques': { requiredTier: 'starter' },
  'boutiques-audit': { requiredTier: 'starter' },
  'boutiques-connect': { requiredTier: 'starter' },
  'boutiques-conversion': { requiredTier: 'starter' },
  'boutiques-livraison': { requiredTier: 'starter' },
  'boutiques-paniers': { requiredTier: 'starter' },
  'boutiques-performance': { requiredTier: 'starter' },
  'boutiques-produits': { requiredTier: 'starter' },
  'boutiques-rapports': { requiredTier: 'starter' },
  'boutiques-top-clients': { requiredTier: 'starter' },
  'boutiques-top-produits': { requiredTier: 'starter' },
  'boutiques-top-ventes': { requiredTier: 'starter' },
  'boutiques-ventes': { requiredTier: 'starter' },
  'boutiques-visites': { requiredTier: 'starter' },
  /* 09/10/2026 : les dix entrées de la latérale que l'espace ne réclamait
     pas (voir PACK_MENUS.boutiques), et « Cures en cours », réclamée sans
     palier. Le palier de leurs voisins, sans plafond : sans cette ligne,
     les réclamer les aurait ouvertes gratuitement. */
  'boutiques-cures': { requiredTier: 'starter' },
  'boutiques-categories': { requiredTier: 'starter' },
  'boutiques-stocks': { requiredTier: 'starter' },
  'boutiques-clients': { requiredTier: 'starter' },
  'boutiques-paiements': { requiredTier: 'starter' },
  'boutiques-taxes': { requiredTier: 'starter' },
  'boutiques-coupons': { requiredTier: 'starter' },
  'boutiques-avis': { requiredTier: 'starter' },
  'boutiques-emails': { requiredTier: 'starter' },
  'boutiques-acces': { requiredTier: 'starter' },
  'boutiques-reglages': { requiredTier: 'starter' },

  // Vos agents et vos outils
  'activite': { requiredTier: 'starter' },
  /* 13/10/2026 : l'accueil d'un compte Business, même palier que l'activité. */
  'accueil-entreprise': { requiredTier: 'starter' },
  'ventes-assistees': { requiredTier: 'starter' },
  'mise-en-route': { requiredTier: 'starter' },
  'bibliotheque-lots': { requiredTier: 'starter' },
  'cadeaux-progressifs': { requiredTier: 'starter' },
  'copilote': { requiredTier: 'starter' },
  'strategie': { requiredTier: 'starter' },
  'creations': { requiredTier: 'starter' },
  'expert-library': { requiredTier: 'starter' },
  'guide-lots': { requiredTier: 'starter' },
  'integrations-mcp': { requiredTier: 'starter' },
  'lots': { requiredTier: 'starter' },
  'mk-integrations': { requiredTier: 'starter' },
  'panier-offres': { requiredTier: 'starter' },
  'post-achat': { requiredTier: 'starter' },
  'vendre-plus': { requiredTier: 'starter' },

  // Diagnostiqueurs
  'diagnostiqueurs-activite': { requiredTier: 'starter' },
  'diagnostiqueurs-avatar': { requiredTier: 'starter' },
  'diagnostiqueurs-diagnostics': { requiredTier: 'starter' },
  'diagnostiqueurs-guide': { requiredTier: 'starter' },
  'diagnostiqueurs-insights': { requiredTier: 'starter' },
  'diagnostiqueurs-produit': { requiredTier: 'starter' },

  // Essayeurs
  'essayeurs-activite': { requiredTier: 'starter' },
  'essayeurs-avatar': { requiredTier: 'starter' },
  'essayeurs-essayages': { requiredTier: 'starter' },
  'essayeurs-guide': { requiredTier: 'starter' },
  'essayeurs-insights': { requiredTier: 'starter' },
  'essayeurs-produit': { requiredTier: 'starter' },

  // Experts avis
  'avis-produit': { requiredTier: 'starter' },
  'experts-avis-activite': { requiredTier: 'starter' },
  'experts-avis-agence': { requiredTier: 'starter' },
  'experts-avis-avatar': { requiredTier: 'starter' },
  'experts-avis-avis': { requiredTier: 'starter' },
  'experts-avis-guide': { requiredTier: 'starter' },
  'experts-avis-insights': { requiredTier: 'starter' },
  'managers-ugc-activite': { requiredTier: 'starter' },
  'managers-ugc-annuaire': { requiredTier: 'starter' },
  'managers-ugc-guide': { requiredTier: 'starter' },

  // Experts produit
  'experts-produit-activite': { requiredTier: 'starter' },
  'experts-produit-avatar': { requiredTier: 'starter' },
  'experts-produit-conversations': { requiredTier: 'starter' },
  'experts-produit-guide': { requiredTier: 'starter' },
  'experts-produit-insights': { requiredTier: 'starter' },
  'experts-produit-sans-reponse': { requiredTier: 'starter' },

  // Experts SEO
  'experts-seo-activite': { requiredTier: 'starter' },
  'experts-seo-avatar': { requiredTier: 'starter' },
  'experts-seo-guide': { requiredTier: 'starter' },
  'experts-seo-insights': { requiredTier: 'starter' },
  'experts-seo-optimisations': { requiredTier: 'starter' },

  // Coachs à domicile
  'coachs-domicile-activite': { requiredTier: 'starter' },
  'coachs-domicile-avatar': { requiredTier: 'starter' },
  'coachs-domicile-conversations': { requiredTier: 'starter' },
  'coachs-domicile-guide': { requiredTier: 'starter' },
  'coachs-domicile-insights': { requiredTier: 'starter' },

  // Experts GEO
  'experts-geo-activite': { requiredTier: 'starter' },
  'experts-geo-annuaire': { requiredTier: 'starter' },
  'experts-geo-avatar': { requiredTier: 'starter' },
  'experts-geo-guide': { requiredTier: 'starter' },
  'experts-geo-insights': { requiredTier: 'starter' },

  // Magazine de marque
  'magazine-marque-apercu': { requiredTier: 'starter' },
  'magazine-marque-articles': { requiredTier: 'starter' },
  'magazine-marque-calendrier': { requiredTier: 'starter' },
  'magazine-marque-equipes': { requiredTier: 'starter' },

  // Votre manager
  'brand-advisor': { requiredTier: 'starter' },
  'voice-agent': { requiredTier: 'starter' },

  // Formulaires
  'forms': { requiredTier: 'starter' },
  'forms-fields': { requiredTier: 'starter' },
  'forms-responses': { requiredTier: 'starter' },

  // Avis
  'review': { requiredTier: 'starter' },
  'review-products': { requiredTier: 'starter' },
  'review-shop': { requiredTier: 'starter' },

  // Le savoir de la marque
  'knowledge-sources': { requiredTier: 'starter' },
  'mk-contexte': { requiredTier: 'starter' },

  // Influenceurs
  'influenceurs-historique': { requiredTier: 'starter' },

  // Annuaire des agences
  'agences-annuaire': { requiredTier: 'starter' },

  // Annuaire des magazines
  'magazines-annuaire': { requiredTier: 'starter' },

  // Agence UGC IA
  'createurs-ugc-annuaire': { requiredTier: 'starter' },

  // Agence de communication IA
  'community-managers-ia-annuaire': { requiredTier: 'starter' },

  // Photographes IA
  'photographes-ia-annuaire': { requiredTier: 'starter' },

  // Graphistes IA
  'graphistes-ia-annuaire': { requiredTier: 'starter' },

  // Enterprise only (API, Affiliate)
  'affiliate': { requiredTier: 'enterprise' },
  'admin': { requiredTier: 'enterprise' },

};

// Tier prices (monthly and annual in EUR)
export interface TierPrice {
  monthly: number | null;
  annual: number | null;
}

export const TIER_PRICES: Record<TierName, TierPrice> = {
  free: { monthly: 0, annual: 0 },
  starter: { monthly: 99, annual: 79 },
  pro: { monthly: 299, annual: 239 },
  business: { monthly: 499, annual: 399 },
  enterprise: { monthly: null, annual: null },
};

// Map old plan names to new tier names
export const PLAN_TO_TIER_MAP: Record<string, TierName> = {
  'FREE': 'free',
  'SOLO': 'free',
  'DISCOVERY': 'starter',
  'STARTER': 'starter',
  'PRO': 'pro',
  'BUSINESS': 'business',
  'SCALE': 'business',
  'ENTERPRISE': 'enterprise',
};

// Helper to get tier from plan
export function planToTier(plan: string | undefined | null): TierName {
  if (!plan) return 'free';
  const upperPlan = plan.toUpperCase();
  return PLAN_TO_TIER_MAP[upperPlan] || 'free';
}

/**
 * Pont vers la matrice cible (`src/config/entitlements.ts`).
 * `PlanId` (none | standard | pro | enterprise) est la source de vérité ;
 * les `TierName` ne subsistent que comme vocabulaire d'affichage.
 */
export function planIdToTier(planId: string | undefined | null): TierName {
  switch (planId) {
    case 'standard':
      return 'starter';
    case 'pro':
      return 'pro';
    case 'business':
      return 'business';
    case 'enterprise':
      return 'enterprise';
    default:
      return 'free';
  }
}


// Helper to compare tiers
export function tierAtLeast(currentTier: TierName, requiredTier: TierName): boolean {
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  const requiredIndex = TIER_ORDER.indexOf(requiredTier);
  return currentIndex >= requiredIndex;
}

// Helper to get next tier for upgrade
export function getNextTier(currentTier: TierName): TierName | null {
  const currentIndex = TIER_ORDER.indexOf(currentTier);
  if (currentIndex < TIER_ORDER.length - 1) {
    return TIER_ORDER[currentIndex + 1];
  }
  return null;
}

// Helper to get required tier for a menu
export function getRequiredTierForMenu(menuId: string): TierName {
  return MENU_ACCESS[menuId]?.requiredTier || 'free';
}

// Helper to get menu config
export function getMenuConfig(menuId: string): MenuAccessConfig | null {
  return MENU_ACCESS[menuId] || null;
}
