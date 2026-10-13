// src/hooks/useSectorConfig.ts
// Hook pour accéder à la configuration du secteur du compte

import { toast } from 'sonner';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useAccount } from '@lystes/contexts/AccountContext';
import { supabase } from '@lystes/integrations/supabase/client';
import { 
  BusinessSector, 
  SectorConfig, 
  SectorTerminology,
  getSectorConfig, 
  getSectorTerminology,
  mapBusinessTypeToSector,
  mapSectorToBusinessType,
  getManagerTitle,
  getManagerDescription
} from '@lystes/config/sector-config';
import { vendDesPrestations, prestationsAvecDiagnostic, normaliserTypeDOffre, type TypeDOffre } from '@lystes/config/secteurs-prestations';
import { useTypeDeCompte } from '@lystes/hooks/useTypeDeCompte';

interface UseSectorConfigReturn {
  // Secteur actuel
  sector: BusinessSector;
  sectorConfig: SectorConfig;
  /* Réponse explicite du marchand à l'inscription : produits, prestations, ou
     les deux. Fait autorité sur le secteur (JP, 12/08/2026). */
  offeringType: TypeDOffre | null;
  terminology: SectorTerminology;
  
  // États
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSector: (sector: BusinessSector) => Promise<void>;
  
  // Utilitaires
  getManagerTitle: (managerId: string) => string;
  getManagerDescription: (managerId: string) => string;
  isFeatureEnabled: (feature: keyof SectorConfig['features']) => boolean;
}

/**
 * Hook pour accéder à la configuration du secteur
 * 
 * @example
 * const { sector, terminology, isLoading } = useSectorConfig();
 * 
 * // Utiliser la terminologie dynamique
 * <h1>{terminology.analysisPlural}</h1> // "Diagnostics" ou "Essayages"
 */
export function useSectorConfig(): UseSectorConfigReturn {
  const { selectedAccountId } = useAccount();
  const [sector, setSectorState] = useState<BusinessSector>('skincare');
  const [offeringType, setOfferingType] = useState<TypeDOffre | null>(null);
  const [loadedForAccountId, setLoadedForAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // isLoading est dérivé : true jusqu'à ce que le secteur soit chargé pour le compte ACTUEL
  // Également true quand aucun compte n'est encore sélectionné (pour éviter d'afficher la mauvaise terminologie par défaut)
  const isLoading = !selectedAccountId || selectedAccountId !== loadedForAccountId;
  
  // Charger le secteur depuis le compte
  useEffect(() => {
    if (!selectedAccountId) {
      setLoadedForAccountId(null);
      return;
    }
    
    const fetchSector = async () => {
      setError(null);
      
      try {
        const { data, error: fetchError } = await supabase
          .from('accounts')
          .select('sector, primary_mode, offering_type')
          .eq('id', selectedAccountId)
          .single();
        
        if (fetchError) {
          throw fetchError;
        }
        
        if (data) {
          setOfferingType(normaliserTypeDOffre((data as { offering_type?: string | null }).offering_type));
          // Priorité 1: champ sector direct (valeur BusinessSector)
          const validSectors: string[] = ['skincare', 'haircare', 'optical', 'wigs', 'makeup', 'fashion', 'wellness', 'services', 'perfume', 'shoes', 'jewelry', 'furniture', 'electronics', 'food', 'pets', 'sport', 'other', 'catering'];
          if (data.sector && validSectors.includes(data.sector)) {
            setSectorState(data.sector as BusinessSector);
          } 
          // Priorité 2: mapping depuis primary_mode
          else if (data.primary_mode) {
            const mappedSector = mapBusinessTypeToSector(data.primary_mode);
            setSectorState(mappedSector);
          }
        }
      } catch (err) {
        console.error('Error fetching sector config:', err);
        toast.error("Une erreur est survenue");
        setError('Impossible de charger la configuration du secteur');
        // Fallback sur skincare en cas d'erreur
        setSectorState('skincare');
      } finally {
        // Marque le secteur comme chargé pour ce compte précis
        setLoadedForAccountId(selectedAccountId);
      }
    };
    
    fetchSector();
  }, [selectedAccountId]);
  
  // Configuration du secteur actuel
  const sectorConfig = useMemo(() => getSectorConfig(sector), [sector]);
  
  // Terminologie du secteur actuel
  const terminology = useMemo(() => getSectorTerminology(sector), [sector]);
  
  /**
   * Changer le secteur du compte
   */
  const setSector = useCallback(async (newSector: BusinessSector) => {
    if (!selectedAccountId) {
      throw new Error('Aucun compte sélectionné');
    }
    
    // Invalide l'état chargé pour déclencher isLoading=true
    setLoadedForAccountId(null);
    setError(null);
    
    try {
      const businessType = mapSectorToBusinessType(newSector);
      
      // Met à jour sector ET primary_mode pour la compatibilité ascendante
      const { data: updateData, error: updateError } = await supabase
        .from('accounts')
        .update({
          sector: newSector,
          primary_mode: businessType
        })
        .eq('id', selectedAccountId)
        .select('id');

      if (updateError || !updateData || updateData.length === 0) {
        throw updateError || new Error('Aucune ligne mise à jour (accounts.sector)');
      }
      
      setSectorState(newSector);
    } catch (err) {
      console.error('Error updating sector:', err);
      toast.error("Une erreur est survenue");
      setError('Impossible de mettre à jour le secteur');
      throw err;
    } finally {
      // Remarque comme chargé pour ce compte
      setLoadedForAccountId(selectedAccountId);
    }
  }, [selectedAccountId]);
  
  /**
   * Obtenir le titre d'un manager pour ce secteur
   */
  const getManagerTitleForSector = useCallback((managerId: string) => {
    return getManagerTitle(managerId, sector);
  }, [sector]);
  
  /**
   * Obtenir la description d'un manager pour ce secteur
   */
  const getManagerDescriptionForSector = useCallback((managerId: string) => {
    return getManagerDescription(managerId, sector);
  }, [sector]);
  
  /**
   * Vérifier si une fonctionnalité est activée pour ce secteur
   */
  const isFeatureEnabled = useCallback((feature: keyof SectorConfig['features']) => {
    return sectorConfig.features[feature];
  }, [sectorConfig]);
  
  return {
    sector,
    sectorConfig,
    offeringType,
    terminology,
    isLoading,
    error,
    setSector,
    getManagerTitle: getManagerTitleForSector,
    getManagerDescription: getManagerDescriptionForSector,
    isFeatureEnabled
  };
}

/**
 * Hook simplifié pour juste la terminologie
 */
export function useSectorTerminology(): SectorTerminology & { isLoading: boolean } {
  const { terminology, isLoading } = useSectorConfig();
  return { ...terminology, isLoading };
}

/**
 * Hook pour vérifier les fonctionnalités du secteur
 */
export function useSectorFeatures() {
  const { sectorConfig, sector, offeringType, isLoading: secteurEnCours } = useSectorConfig();
  /* 13/10/2026 (JP) : un compte Business n'a ni produit à diagnostiquer ni
     produit à essayer, et vend des services. Ses drapeaux le disent ici, à la
     source, pour que la latérale et le sélecteur n'aient rien à deviner. Un
     compte e-commerce garde exactement les drapeaux de son secteur. */
  const { type, isLoading: typeEnCours } = useTypeDeCompte();
  const business = type === 'business';
  const isLoading = secteurEnCours || typeEnCours;

  if (business) {
    return {
      isLoading,
      typeDeCompte: type,
      sector,
      offeringType,
      vendDesPrestations: true,
      prestationsAvecDiagnostic: false,
      hasCamera: false,
      hasTryOn: false,
      hasDiagnostic: false,
      hasQuiz: sectorConfig.features.hasQuiz,
      hasRecipes: false,
      hasBeforeAfter: false,
      hasQRCoaches: false,
    };
  }

  return {
    isLoading,
    typeDeCompte: type,
    /* Le secteur brut, et ce qu'il implique. Une boutique vend des produits,
       un institut ou une agence vend des PRESTATIONS : tout le vocabulaire et
       la moitié des écrans changent de sens (JP, 12/08/2026). */
    sector,
    offeringType,
    vendDesPrestations: vendDesPrestations(sector, offeringType),
    prestationsAvecDiagnostic: prestationsAvecDiagnostic(sector, offeringType),
    hasCamera: sectorConfig.features.hasCamera,
    hasTryOn: sectorConfig.features.hasTryOn,
    hasDiagnostic: sectorConfig.features.hasDiagnostic,
    hasQuiz: sectorConfig.features.hasQuiz,
    hasRecipes: sectorConfig.features.hasRecipes,
    hasBeforeAfter: sectorConfig.features.hasBeforeAfter,
    hasQRCoaches: sectorConfig.features.hasQRCoaches
  };
}

export default useSectorConfig;
