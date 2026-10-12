// src/config/sector-config.ts
// Configuration des secteurs d'activité et terminologie dynamique

/**
 * Secteurs d'activité supportés
 */
export type BusinessSector = 
  | 'skincare'     // Soins de la peau
  | 'haircare'     // Soins capillaires
  | 'optical'      // Lunettes et optique
  | 'wigs'         // Perruques
  | 'makeup'       // Maquillage
  | 'fashion'      // Mode et vêtements
  | 'shoes'        // Chaussures
  | 'jewelry'      // Bijouterie
  | 'watches'      // Horlogerie / Montres
  | 'wellness'     // Bien-être, compléments
  | 'services'     // Services (instituts, salons)
  | 'perfume'      // Parfumerie
  | 'catering'     // Traiteur événementiel
  | 'furniture'    // Mobilier et décoration
  | 'electronics'  // Électronique
  | 'food'         // Épicerie fine
  | 'pets'         // Animaux
  | 'sport'        // Sport et fitness
  | 'other';       // Autre secteur

/**
 * Terminologie dynamique par secteur
 * Permet d'adapter les labels dans toute l'application
 */
export interface SectorTerminology {
  // Analyse / Diagnostic / Essayage
  analysis: string;           // "Diagnostic" ou "Essayage"
  analysisPlural: string;     // "Diagnostics" ou "Essayages"
  analysisVerb: string;       // "diagnostiquer" ou "essayer"
  
  // Agents analystes
  analyst: string;            // "Diagnosticien" ou "Essayeur"
  analystPlural: string;      // "Diagnosticiens" ou "Essayeurs"
  
  // Expert produit
  expert: string;             // "Expert Produit" ou "Conseiller"
  expertPlural: string;       // "Experts Produit" ou "Conseillers"
  
  // Résultat
  result: string;             // "Type de peau" ou "Monture recommandée"
  resultPlural: string;       // "Types de peau" ou "Montures recommandées"
  
  // Action principale
  mainAction: string;         // "Analyser ma peau" ou "Essayer des lunettes"
  mainActionShort: string;    // "Analyser" ou "Essayer"
  
  // Icône principale
  mainIconName: string;       // "Sparkles" ou "Glasses"
  
  // Bouton page produit (généraliste pour non-essayage, spécifique pour essayage)
  productPageLabel: string;      // "Mon diagnostic" ou "Essayer ce produit"
  productPageLabelShort: string; // "Diagnostic" ou "Essayer"
}

/**
 * Configuration complète d'un secteur
 */
export interface SectorConfig {
  id: BusinessSector;
  label: string;
  labelShort: string;
  description: string;
  iconName: string;
  color: string;
  terminology: SectorTerminology;
  features: {
    hasCamera: boolean;      // Utilise la caméra
    hasTryOn: boolean;       // Essayage virtuel
    hasDiagnostic: boolean;  // Diagnostic peau/cheveux (hasCamera && !hasTryOn)
    hasQuiz: boolean;        // Questionnaire
    hasRecipes: boolean;     // Routines/recettes
    hasBeforeAfter: boolean; // Avant/après
    hasQRCoaches: boolean;   // Coaches post-achat
  };
  managers: {
    diagnostics: string;     // Titre manager diagnostics
    experts: string;         // Titre manager experts
    coaches: string;         // Titre manager coaches
  };
}

/**
 * Configuration de tous les secteurs
 */
export const SECTOR_CONFIGS: Record<BusinessSector, SectorConfig> = {
  skincare: {
    id: 'skincare',
    label: 'Skincare',
    labelShort: 'Skin',
    description: 'Soins de la peau, cosmétiques',
    iconName: 'Sparkles',
    color: '#EC4899',
    terminology: {
      analysis: 'Diagnostic',
      analysisPlural: 'Diagnostics',
      analysisVerb: 'diagnostiquer',
      analyst: 'Diagnosticien',
      analystPlural: 'Diagnosticiens',
      expert: 'Expert Produit',
      expertPlural: 'conseillers produit',
      result: 'Type de peau',
      resultPlural: 'Types de peau',
      mainAction: 'Analyser ma peau',
      mainActionShort: 'Analyser',
      mainIconName: 'Sparkles',
      productPageLabel: 'Mon diagnostic peau',
      productPageLabelShort: 'Diagnostic'
    },
    features: {
      hasCamera: true,
      hasTryOn: false,
      hasDiagnostic: true,  // skincare = diagnostics peau
      hasQuiz: true,
      hasRecipes: true,
      hasBeforeAfter: true,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Diagnostics',
      experts: 'Manager conseillers produit',
      coaches: 'Manager coach à domicile'
    }
  },
  
  haircare: {
    id: 'haircare',
    label: 'Capillaire',
    labelShort: 'Hair',
    description: 'Soins capillaires, coiffure',
    iconName: 'Scissors',
    color: '#8B5CF6',
    terminology: {
      analysis: 'Diagnostic',
      analysisPlural: 'Diagnostics',
      analysisVerb: 'diagnostiquer',
      analyst: 'Diagnosticien',
      analystPlural: 'Diagnosticiens',
      expert: 'Expert Capillaire',
      expertPlural: 'Experts Capillaires',
      result: 'Type de cheveux',
      resultPlural: 'Types de cheveux',
      mainAction: 'Analyser mes cheveux',
      mainActionShort: 'Analyser',
      mainIconName: 'Scissors',
      productPageLabel: 'Mon diagnostic cheveux',
      productPageLabelShort: 'Diagnostic'
    },
    features: {
      hasCamera: true,
      hasTryOn: false,
      hasDiagnostic: true,  // haircare = diagnostics cheveux
      hasQuiz: true,
      hasRecipes: true,
      hasBeforeAfter: true,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Diagnostics',
      experts: 'Manager Experts Capillaires',
      coaches: 'Manager coach à domicile'
    }
  },
  
  optical: {
    id: 'optical',
    label: 'Optique',
    labelShort: 'Optical',
    description: 'Lunettes, optique',
    iconName: 'Glasses',
    color: '#3B82F6',
    terminology: {
      analysis: 'Essayage',
      analysisPlural: 'Essayages',
      analysisVerb: 'essayer',
      analyst: 'Essayeur',
      analystPlural: 'Essayeurs',
      expert: 'Conseiller Optique',
      expertPlural: 'Conseillers Optiques',
      result: 'Monture recommandée',
      resultPlural: 'Montures recommandées',
      mainAction: 'Essayer des lunettes',
      mainActionShort: 'Essayer',
      mainIconName: 'Glasses',
      productPageLabel: 'Essayer ces lunettes',
      productPageLabelShort: 'Essayer'
    },
    features: {
      hasCamera: true,
      hasTryOn: true,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: false,
      hasBeforeAfter: false,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Essayages',
      experts: 'Manager Conseillers',
      coaches: 'Manager coach à domicile'
    }
  },
  
  wigs: {
    id: 'wigs',
    label: 'Perruques',
    labelShort: 'Wigs',
    description: 'Perruques, extensions',
    iconName: 'CircleUser',
    color: '#F59E0B',
    terminology: {
      analysis: 'Essayage',
      analysisPlural: 'Essayages',
      analysisVerb: 'essayer',
      analyst: 'Essayeur',
      analystPlural: 'Essayeurs',
      expert: 'Conseiller Perruques',
      expertPlural: 'Conseillers Perruques',
      result: 'Style recommandé',
      resultPlural: 'Styles recommandés',
      mainAction: 'Essayer une perruque',
      mainActionShort: 'Essayer',
      mainIconName: 'CircleUser',
      productPageLabel: 'Essayer cette perruque',
      productPageLabelShort: 'Essayer'
    },
    features: {
      hasCamera: true,
      hasTryOn: true,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: false,
      hasBeforeAfter: true,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Essayages',
      experts: 'Manager Conseillers',
      coaches: 'Manager coach à domicile'
    }
  },
  
  makeup: {
    id: 'makeup',
    label: 'Maquillage',
    labelShort: 'Makeup',
    description: 'Maquillage, cosmétiques couleur',
    iconName: 'Palette',
    color: '#EF4444',
    terminology: {
      analysis: 'Essayage',
      analysisPlural: 'Essayages',
      analysisVerb: 'essayer',
      analyst: 'Essayeur',
      analystPlural: 'Essayeurs',
      expert: 'Expert Maquillage',
      expertPlural: 'Experts Maquillage',
      result: 'Look recommandé',
      resultPlural: 'Looks recommandés',
      mainAction: 'Essayer un look',
      mainActionShort: 'Essayer',
      mainIconName: 'Palette',
      productPageLabel: 'Essayer ce look',
      productPageLabelShort: 'Essayer'
    },
    features: {
      hasCamera: true,
      hasTryOn: true,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: true,
      hasBeforeAfter: true,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Essayages',
      experts: 'Manager Experts Maquillage',
      coaches: 'Manager coach à domicile'
    }
  },
  
  fashion: {
    id: 'fashion',
    label: 'Mode',
    labelShort: 'Fashion',
    description: 'Vêtements, accessoires',
    iconName: 'Shirt',
    color: '#6366F1',
    terminology: {
      analysis: 'Essayage',
      analysisPlural: 'Essayages',
      analysisVerb: 'essayer',
      analyst: 'Essayeur',
      analystPlural: 'Essayeurs',
      expert: 'Conseiller Mode',
      expertPlural: 'Conseillers Mode',
      result: 'Style recommandé',
      resultPlural: 'Styles recommandés',
      mainAction: 'Essayer un look',
      mainActionShort: 'Essayer',
      mainIconName: 'Shirt',
      productPageLabel: 'Essayer ce vêtement',
      productPageLabelShort: 'Essayer'
    },
    features: {
      hasCamera: true,
      hasTryOn: true,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: false,
      hasBeforeAfter: false,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Essayages',
      experts: 'Manager Conseillers Mode',
      coaches: 'Manager coach à domicile'
    }
  },
  
  shoes: {
    id: 'shoes',
    label: 'Chaussures',
    labelShort: 'Shoes',
    description: 'Chaussures, sneakers, bottes',
    iconName: 'Footprints',
    color: '#78716C',
    terminology: {
      analysis: 'Essayage',
      analysisPlural: 'Essayages',
      analysisVerb: 'essayer',
      analyst: 'Essayeur',
      analystPlural: 'Essayeurs',
      expert: 'Expert Chaussures',
      expertPlural: 'Experts Chaussures',
      result: 'Modèle recommandé',
      resultPlural: 'Modèles recommandés',
      mainAction: 'Essayer des chaussures',
      mainActionShort: 'Essayer',
      mainIconName: 'Footprints',
      productPageLabel: 'Essayer ces chaussures',
      productPageLabelShort: 'Essayer'
    },
    features: {
      hasCamera: true,
      hasTryOn: true,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: false,
      hasBeforeAfter: true,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Essayages',
      experts: 'Manager Experts Chaussures',
      coaches: 'Manager coach à domicile'
    }
  },
  
  wellness: {
    id: 'wellness',
    label: 'Bien-être',
    labelShort: 'Wellness',
    description: 'Compléments, nutrition',
    iconName: 'Heart',
    color: '#10B981',
    terminology: {
      analysis: 'Bilan',
      analysisPlural: 'Bilans',
      analysisVerb: 'évaluer',
      analyst: 'Conseiller',
      analystPlural: 'Conseillers',
      expert: 'Expert Nutrition',
      expertPlural: 'Experts Nutrition',
      result: 'Programme recommandé',
      resultPlural: 'Programmes recommandés',
      mainAction: 'Commencer',
      mainActionShort: 'Commencer',
      mainIconName: 'Heart',
      productPageLabel: 'Commencer',
      productPageLabelShort: 'Commencer'
    },
    features: {
      hasCamera: false,
      hasTryOn: false,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: true,
      hasBeforeAfter: true,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Bilans',
      experts: 'Manager Experts Nutrition',
      coaches: 'Manager coach à domicile'
    }
  },
  
  services: {
    id: 'services',
    label: 'Services',
    labelShort: 'Services',
    description: 'Instituts, salons, spas',
    iconName: 'Calendar',
    color: '#14B8A6',
    terminology: {
      analysis: 'Consultation',
      analysisPlural: 'Consultations',
      analysisVerb: 'consulter',
      analyst: 'Conseiller',
      analystPlural: 'Conseillers',
      expert: 'Expert Service',
      expertPlural: 'Experts Services',
      result: 'Prestation recommandée',
      resultPlural: 'Prestations recommandées',
      mainAction: 'Prendre rendez-vous',
      mainActionShort: 'Réserver',
      mainIconName: 'Calendar',
      productPageLabel: 'Réserver ce soin',
      productPageLabelShort: 'Réserver'
    },
    features: {
      hasCamera: false,
      hasTryOn: false,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: false,
      hasBeforeAfter: true,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Consultations',
      experts: 'Manager Experts Services',
      coaches: 'Manager Suivi Client'
    }
  },
  
  perfume: {
    id: 'perfume',
    label: 'Parfumerie',
    labelShort: 'Parfum',
    description: 'Parfums, fragrances',
    iconName: 'Droplet',
    color: '#A855F7',
    terminology: {
      analysis: 'Conseil',
      analysisPlural: 'Conseils',
      analysisVerb: 'conseiller',
      analyst: 'Conseiller',
      analystPlural: 'Conseillers',
      expert: 'Expert Parfum',
      expertPlural: 'Experts Parfums',
      result: 'Fragrance recommandée',
      resultPlural: 'Fragrances recommandées',
      mainAction: 'Trouver mon parfum',
      mainActionShort: 'Découvrir',
      mainIconName: 'Droplet',
      productPageLabel: 'Trouver mon parfum',
      productPageLabelShort: 'Découvrir'
    },
    features: {
      hasCamera: false,
      hasTryOn: false,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: false,
      hasBeforeAfter: false,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Conseils',
      experts: 'Manager Experts Parfums',
      coaches: 'Manager coach à domicile'
    }
  },
  
  jewelry: {
    id: 'jewelry',
    label: 'Bijouterie',
    labelShort: 'Bijoux',
    description: 'Bijoux, montres, accessoires',
    iconName: 'Gem',
    color: '#F59E0B',
    terminology: {
      analysis: 'Essayage',
      analysisPlural: 'Essayages',
      analysisVerb: 'essayer',
      analyst: 'Essayeur',
      analystPlural: 'Essayeurs',
      expert: 'Expert Bijoux',
      expertPlural: 'Experts Bijoux',
      result: 'Bijou recommandé',
      resultPlural: 'Bijoux recommandés',
      mainAction: 'Essayer un bijou',
      mainActionShort: 'Essayer',
      mainIconName: 'Gem',
      productPageLabel: 'Essayer ce bijou',
      productPageLabelShort: 'Essayer'
    },
    features: {
      hasCamera: true,
      hasTryOn: true,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: false,
      hasBeforeAfter: true,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Essayages',
      experts: 'Manager Experts Bijoux',
      coaches: 'Manager coach à domicile'
    }
  },
  
  watches: {
    id: 'watches',
    label: 'Horlogerie',
    labelShort: 'Montres',
    description: 'Montres et horlogerie de luxe',
    iconName: 'Watch',
    color: '#1E3A5F',
    terminology: {
      analysis: 'Essayage',
      analysisPlural: 'Essayages',
      analysisVerb: 'essayer',
      analyst: 'Essayeur',
      analystPlural: 'Essayeurs',
      expert: 'Expert Montres',
      expertPlural: 'Experts Montres',
      result: 'Montre recommandée',
      resultPlural: 'Montres recommandées',
      mainAction: 'Essayer une montre',
      mainActionShort: 'Essayer',
      mainIconName: 'Watch',
      productPageLabel: 'Essayer cette montre',
      productPageLabelShort: 'Essayer'
    },
    features: {
      hasCamera: true,
      hasTryOn: true,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: false,
      hasBeforeAfter: true,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Essayages',
      experts: 'Manager Experts Montres',
      coaches: 'Manager coach à domicile'
    }
  },
  
  catering: {
    id: 'catering',
    label: 'Traiteur',
    labelShort: 'Traiteur',
    description: 'Services traiteur et événementiel',
    iconName: 'UtensilsCrossed',
    color: '#F97316',
    terminology: {
      analysis: 'Devis',
      analysisPlural: 'Devis',
      analysisVerb: 'établir',
      analyst: 'Conseiller Devis',
      analystPlural: 'Conseillers Devis',
      expert: 'Expert Traiteur',
      expertPlural: 'Experts Traiteur',
      result: 'Devis personnalisé',
      resultPlural: 'Devis personnalisés',
      mainAction: 'Obtenir un devis',
      mainActionShort: 'Devis',
      mainIconName: 'FileText',
      productPageLabel: 'Demander un devis',
      productPageLabelShort: 'Devis'
    },
    features: {
      hasCamera: false,
      hasTryOn: false,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: false,
      hasBeforeAfter: false,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Devis',
      experts: 'Manager Traiteur',
      coaches: 'Manager Suivi Client'
    }
  },

  furniture: {
    id: 'furniture',
    label: 'Décoration',
    labelShort: 'Déco',
    description: 'Meubles et décoration d\'intérieur',
    iconName: 'Sofa',
    color: '#92400E',
    terminology: {
      analysis: 'Essayage',
      analysisPlural: 'Essayages',
      analysisVerb: 'visualiser',
      analyst: 'Essayeur',
      analystPlural: 'Essayeurs',
      expert: 'Expert Déco',
      expertPlural: 'Experts Déco',
      result: 'Visualisation déco',
      resultPlural: 'Visualisations déco',
      mainAction: 'Visualiser dans ma pièce',
      mainActionShort: 'Visualiser',
      mainIconName: 'Sofa',
      productPageLabel: 'Visualiser ce meuble',
      productPageLabelShort: 'Visualiser'
    },
    features: {
      hasCamera: true,
      hasTryOn: true,
      hasDiagnostic: false,
      hasQuiz: false,
      hasRecipes: false,
      hasBeforeAfter: true,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Essayages',
      experts: 'Manager Experts Déco',
      coaches: 'Manager Suivi Client'
    }
  },

  electronics: {
    id: 'electronics',
    label: 'Électronique',
    labelShort: 'Tech',
    description: 'Smartphones, audio, gadgets',
    iconName: 'Smartphone',
    color: '#2563EB',
    terminology: {
      analysis: 'Conseil',
      analysisPlural: 'Conseils',
      analysisVerb: 'conseiller',
      analyst: 'Conseiller',
      analystPlural: 'Conseillers',
      expert: 'Expert Tech',
      expertPlural: 'Experts Tech',
      result: 'Recommandation tech',
      resultPlural: 'Recommandations tech',
      mainAction: 'Obtenir des conseils tech',
      mainActionShort: 'Conseiller',
      mainIconName: 'Smartphone',
      productPageLabel: 'Conseil expert',
      productPageLabelShort: 'Conseil'
    },
    features: {
      hasCamera: false,
      hasTryOn: false,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: false,
      hasBeforeAfter: false,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Conseils',
      experts: 'Manager Experts Tech',
      coaches: 'Manager Support'
    }
  },

  food: {
    id: 'food',
    label: 'Épicerie',
    labelShort: 'Épicerie',
    description: 'Chocolat, café, vins, épicerie fine',
    iconName: 'Coffee',
    color: '#78350F',
    terminology: {
      analysis: 'Conseil',
      analysisPlural: 'Conseils',
      analysisVerb: 'conseiller',
      analyst: 'Conseiller',
      analystPlural: 'Conseillers',
      expert: 'Expert Épicerie',
      expertPlural: 'Experts Épicerie',
      result: 'Recommandation gourmande',
      resultPlural: 'Recommandations gourmandes',
      mainAction: 'Découvrir nos produits',
      mainActionShort: 'Découvrir',
      mainIconName: 'Coffee',
      productPageLabel: 'Conseils gourmands',
      productPageLabelShort: 'Conseils'
    },
    features: {
      hasCamera: false,
      hasTryOn: false,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: true,
      hasBeforeAfter: false,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Conseils',
      experts: 'Manager Experts Épicerie',
      coaches: 'Manager Fidélité'
    }
  },

  pets: {
    id: 'pets',
    label: 'Animaux',
    labelShort: 'Pets',
    description: 'Chiens, chats, accessoires',
    iconName: 'Dog',
    color: '#EA580C',
    terminology: {
      analysis: 'Conseil',
      analysisPlural: 'Conseils',
      analysisVerb: 'conseiller',
      analyst: 'Conseiller',
      analystPlural: 'Conseillers',
      expert: 'Expert Animaux',
      expertPlural: 'Experts Animaux',
      result: 'Recommandation',
      resultPlural: 'Recommandations',
      mainAction: 'Trouver le produit idéal',
      mainActionShort: 'Conseiller',
      mainIconName: 'Dog',
      productPageLabel: 'Conseil expert',
      productPageLabelShort: 'Conseil'
    },
    features: {
      hasCamera: false,
      hasTryOn: false,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: false,
      hasBeforeAfter: false,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Conseils',
      experts: 'Manager Experts Animaux',
      coaches: 'Manager Suivi'
    }
  },

  sport: {
    id: 'sport',
    label: 'Sport',
    labelShort: 'Sport',
    description: 'Fitness, outdoor, équipements',
    iconName: 'Dumbbell',
    color: '#059669',
    terminology: {
      analysis: 'Conseil',
      analysisPlural: 'Conseils',
      analysisVerb: 'conseiller',
      analyst: 'Coach',
      analystPlural: 'coachs à domicile',
      expert: 'Expert Sport',
      expertPlural: 'Experts Sport',
      result: 'Programme recommandé',
      resultPlural: 'Programmes recommandés',
      mainAction: 'Obtenir des conseils sport',
      mainActionShort: 'Conseiller',
      mainIconName: 'Dumbbell',
      productPageLabel: 'Mon coaching sport',
      productPageLabelShort: 'Coaching'
    },
    features: {
      hasCamera: false,
      hasTryOn: false,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: false,
      hasBeforeAfter: true,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Conseils',
      experts: 'Manager Experts Sport',
      coaches: 'Manager Coaching'
    }
  },
  
  other: {
    id: 'other',
    label: 'Autre',
    labelShort: 'Autre',
    description: 'Autre secteur d\'activité',
    iconName: 'Store',
    color: '#6B7280',
    terminology: {
      analysis: 'Conseil',
      analysisPlural: 'Conseils',
      analysisVerb: 'conseiller',
      analyst: 'Conseiller',
      analystPlural: 'Conseillers',
      expert: 'Expert Produit',
      expertPlural: 'conseillers produit',
      result: 'Recommandation',
      resultPlural: 'Recommandations',
      mainAction: 'Obtenir un conseil',
      mainActionShort: 'Conseiller',
      mainIconName: 'Store',
      productPageLabel: 'Conseil expert',
      productPageLabelShort: 'Conseil'
    },
    features: {
      hasCamera: false,
      hasTryOn: false,
      hasDiagnostic: false,
      hasQuiz: true,
      hasRecipes: false,
      hasBeforeAfter: false,
      hasQRCoaches: true
    },
    managers: {
      diagnostics: 'Manager Conseils',
      experts: 'Manager Experts',
      coaches: 'Manager coach à domicile'
    }
  }
};

/**
 * Obtenir la configuration d'un secteur
 */
export function getSectorConfig(sector: BusinessSector): SectorConfig {
  return SECTOR_CONFIGS[sector] || SECTOR_CONFIGS.skincare;
}

/**
 * Obtenir la terminologie d'un secteur
 */
export function getSectorTerminology(sector: BusinessSector): SectorTerminology {
  return getSectorConfig(sector).terminology;
}

/**
 * Mapper un business_type vers un secteur
 */
export function mapBusinessTypeToSector(businessType: string): BusinessSector {
  const mapping: Record<string, BusinessSector> = {
    'skin_diagnostic': 'skincare',
    'hair_diagnostic': 'haircare',
    'optical': 'optical',
    'glasses_tryon': 'optical',
    'wigs_tryon': 'wigs',
    'wig_tryon': 'wigs',
    'makeup_tryon': 'makeup',
    'fashion_tryon': 'fashion',
    'clothing_tryon': 'fashion',
    'shoes_tryon': 'fashion',
    'jewelry_tryon': 'jewelry',
    'wellness': 'wellness',
    'nutrition': 'wellness',
    'services': 'services',
    'salon': 'services',
    'spa': 'services',
    'catering': 'catering',
    'catering_quote': 'catering',
    'traiteur': 'catering'
  };
  
  return mapping[businessType] || 'skincare';
}

/**
 * Mapper un secteur vers un business_type
 */
export function mapSectorToBusinessType(sector: BusinessSector): string {
  const mapping: Record<BusinessSector, string> = {
    'skincare': 'skin_diagnostic',
    'haircare': 'hair_diagnostic',
    'optical': 'optical',
    'wigs': 'wigs_tryon',
    'makeup': 'makeup_tryon',
    'fashion': 'fashion_tryon',
    'shoes': 'shoes_tryon',
    'jewelry': 'jewelry_tryon',
    'watches': 'watch_tryon',
    'wellness': 'wellness',
    'services': 'services',
    'perfume': 'product_advisor',
    'catering': 'catering_quote',
    'furniture': 'product_advisor',
    'electronics': 'product_advisor',
    'food': 'product_advisor',
    'pets': 'product_advisor',
    'sport': 'product_advisor',
    'other': 'product_advisor'
  };
  
  return mapping[sector] || 'product_advisor';
}

/**
 * Obtenir le titre d'un manager pour un secteur donné
 */
export function getManagerTitle(managerId: string, sector: BusinessSector): string {
  const config = getSectorConfig(sector);
  
  // Mapping des managers vers leurs titres dynamiques
  const managerTitles: Record<string, string> = {
    // Sofia - Manager des diagnostics/essayages
    'sofia': config.managers.diagnostics,
    
    // Eva - Manager des experts produit
    'eva': config.managers.experts,
    
    // Ava - Manager des coaches
    'ava': config.managers.coaches,
    
    // Maya - Manager Analytics (toujours le même)
    'maya': 'Manager Analytics',
    
    // Rose - Coach Stratégique (toujours le même)
    'rose': 'Coach Stratégique',
    
    // Nina - Manager Winners (toujours le même)
    'nina': 'Manager Winners',
    
    // Emma - Manager Conversations (toujours le même)
    'emma': 'Manager Conversations',
    
    // Léa - Manager Leads (toujours le même)
    'lea': 'Manager Leads',
    
    // Léna - Manager Marketing (toujours le même)
    'lena': 'Manager Marketing'
  };
  
  return managerTitles[managerId.toLowerCase()] || 'Manager';
}

/**
 * Obtenir la description d'un manager pour un secteur donné
 */
export function getManagerDescription(managerId: string, sector: BusinessSector): string {
  const terminology = getSectorTerminology(sector);
  
  const descriptions: Record<string, string> = {
    'sofia': `Supervise tous les ${terminology.analystPlural.toLowerCase()} par canal d'acquisition`,
    'eva': `Supervise les ${terminology.expertPlural.toLowerCase()} (1 par produit)`,
    'ava': 'Supervise les coaches post-achat (1 par produit)',
    'maya': `Analyse les performances des ${terminology.analysisPlural.toLowerCase()} et conversions`,
    'rose': 'Stratège marketing et conseiller business',
    'nina': 'Identifie et suit les produits les plus performants',
    'emma': 'Analyse les conversations et objections clients',
    'lea': 'Qualifie et segmente les prospects',
    'lena': 'Optimise les campagnes marketing multi-canal'
  };
  
  return descriptions[managerId.toLowerCase()] || 'Manager de l\'équipe';
}

/**
 * Tous les secteurs disponibles
 */
export function getAllSectors(): BusinessSector[] {
  return Object.keys(SECTOR_CONFIGS) as BusinessSector[];
}

/**
 * Secteurs avec essayage virtuel
 */
export function getTryOnSectors(): BusinessSector[] {
  return getAllSectors().filter(s => SECTOR_CONFIGS[s].features.hasTryOn);
}

/**
 * Le métier d'agent que le secteur impose à CHAQUE fiche produit, en plus du
 * conseiller, du référenceur et de l'animateur d'avis que tout le monde a.
 *
 * Dérivé des drapeaux `hasTryOn` et `hasDiagnostic` ci-dessus plutôt que d'une
 * liste recopiée : ajouter un secteur essayable ici suffit, sans avoir à penser
 * à une seconde liste. Les copies edge et SQL, elles, n'ont pas ce luxe et
 * doivent être tenues à la main.
 *
 * `null` quand le secteur n'impose ni l'un ni l'autre — une épicerie, un
 * traiteur, une animalerie. Ce n'est pas un manque : poser un essayeur qui ne
 * peut rien faire essayer serait pire que de n'en poser aucun. Un écran qui
 * affiche « Essayeurs : 0 » à une épicerie invente un trou qui n'existe pas.
 */
export function metierDeFicheDuSecteur(
  secteur: string | null | undefined,
): 'essayage' | 'diagnostic' | null {
  if (!secteur) return null;
  /* Le registre des spécialistes connaît deux secteurs que celui-ci n'a pas.
     `resolveSectorKey` les rend tels quels, puisqu'il teste le registre avant
     ses alias : sans ce pont, l'accès direct rendrait `undefined` et la
     boutique n'aurait aucun métier de fiche.

     `decoration` s'annonce au registre « Décoration (alias) » et copie
     `furniture` trait pour trait, même `decor_tryon`, même Flora : c'est bien
     un essayage. La carte « Deco » de l'inscription promettait donc l'essayage
     virtuel sans qu'aucun essayeur de fiche soit créé.

     `nutrition` n'a volontairement pas de pont : le registre le classe en
     coaching, il n'impose ni essayage ni diagnostic, et `null` est la bonne
     réponse. */
  const PONTS: Record<string, BusinessSector> = { decoration: 'furniture' };
  const config = SECTOR_CONFIGS[(PONTS[secteur] ?? secteur) as BusinessSector];
  if (!config) return null;
  if (config.features.hasTryOn) return 'essayage';
  if (config.features.hasDiagnostic) return 'diagnostic';
  return null;
}

/**
 * Secteurs avec caméra
 */
export function getCameraSectors(): BusinessSector[] {
  return getAllSectors().filter(s => SECTOR_CONFIGS[s].features.hasCamera);
}
