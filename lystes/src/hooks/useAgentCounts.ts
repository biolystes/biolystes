/**
 * useAgentCounts, Source unique de calcul des effectifs IA
 *
 * Calcule dynamiquement le nombre d'agents par équipe en fonction
 * du nombre réel de produits synchronisés (productCount).
 *
 * Formule:
 *   Conversion = (productCount × 2) + specialists
 *   Créative   = UGC + photographes + graphistes (fixe)
 *   Marketing  = productCount + 5 agents individuels
 *   Analytics  = 1 directrice + 6 analystes (fixe)
 *   Total      = Conversion + Créative + Marketing + Analytics + Direction(1) + Directeurs(4)
 */
import { useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lystes/integrations/supabase/client";
import { useAccount } from "@lystes/contexts/AccountContext";
import { useSectorFeatures } from "@lystes/hooks/useSectorConfig";
import { PHOTOGRAPHERS } from "@lystes/features/ai-photographers/constants/photographers";
import { GRAPHISTES } from "@lystes/features/ai-graphistes/constants/graphistes";

export interface AgentCounts {
  productCount: number;

  conversion: {
    specialists: number;   // 1 (Zoé) conditionnel secteur
    advisors: number;      // = productCount
    coaches: number;       // = productCount
    total: number;
  };

  creative: {
    ugc: number;           // DB studio_models count
    photographers: number; // PHOTOGRAPHERS.length
    designers: number;     // GRAPHISTES.length
    total: number;
  };

  marketing: {
    optimizers: number;    // = productCount
    strategist: number;    // 1 (Inès)
    adsManager: number;    // 1 (Théo)
    influence: number;     // 1 (Jade)
    campaigns: number;     // 1 (Hugo)
    socialTracking: number;// 1 (Hugo fait les deux, mais 1 agent conceptuel)
    total: number;
  };

  analytics: {
    director: number;      // 1 (Sarah)
    analysts: number;      // 6
    total: number;         // 7 (fixe)
  };

  // Named agents (directeurs + managers)
  direction: number;       // 1 (Cowork)
  directors: number;       // 4 (Eva, Raphaël, Lucas, Sarah)
  managers: number;

  grandTotal: number;
  /**
   * Vrai tant que les effectifs ne sont PAS connus : compte non résolu,
   * lecture en vol, ou lecture en échec. Un écran sans chiffre lu ne doit
   * jamais en afficher un, et surtout pas un zéro : voir `erreur` pour
   * savoir laquelle des deux causes s'applique.
   */
  loading: boolean;
  /**
   * L'erreur de lecture, `null` quand la lecture a abouti. C'est elle qui
   * sépare « votre boutique n'a aucun produit » de « je n'ai pas pu lire
   * vos produits » : sans elle les deux rendaient le même zéro.
   * Un écran qui l'affiche passe par `EtatPanne`
   * (`src/components/dashboard/EtatEcran.tsx`) et propose `relire`.
   */
  erreur?: unknown;
  /**
   * Relance la lecture, pour le bouton « Réessayer » de l'état de panne.
   * Absente de la version statique : il n'y a rien à relire sans requête.
   */
  relire?: () => void;
}

// Fixed counts
const PHOTOGRAPHERS_COUNT = PHOTOGRAPHERS.length;  // 10
const DESIGNERS_COUNT = GRAPHISTES.length;          // 1

/**
 * Static version (no DB call), for landing page / onboarding pre-sync
 */
export function computeAgentCounts(
  productCount: number,
  ugcCount: number,
  hasDiagnostic: boolean
): Omit<AgentCounts, 'loading'> {
  const specialists = hasDiagnostic ? 1 : 0;

  const conversion = {
    specialists,
    advisors: productCount,
    coaches: productCount,
    total: productCount * 2 + specialists,
  };

  const creative = {
    ugc: ugcCount,
    photographers: PHOTOGRAPHERS_COUNT,
    designers: DESIGNERS_COUNT,
    total: ugcCount + PHOTOGRAPHERS_COUNT + DESIGNERS_COUNT,
  };

  const marketing = {
    optimizers: productCount,
    strategist: 1,
    adsManager: 1,
    influence: 1,
    campaigns: 1,
    socialTracking: 1,
    total: productCount + 5,
  };

  const analytics = {
    director: 1,   // Sarah
    analysts: 6,
    total: 7,
  };

  return {
    productCount,
    conversion,
    creative,
    marketing,
    analytics,
    direction: 1,
    directors: 4, // Eva, Raphaël, Lucas, Sarah
    managers: 5 + 3 + (hasDiagnostic ? 1 : 0), // Eva-side: Adam, Sofia, Zoé? | Raphaël-side: Emma, Noah, Léa | Lucas-side: Maya, Inès, Théo, Jade, Hugo
    grandTotal: 1 + 4 + conversion.total + creative.total + marketing.total + analytics.total,
  };
}

/**
 * Hook dynamique, récupère productCount & ugcCount depuis Supabase
 */
export function useAgentCounts(): AgentCounts {
  const { selectedAccountId } = useAccount();
  const sectorFeatures = useSectorFeatures();
  const hasDiagnostic = sectorFeatures?.hasDiagnostic ?? false;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["agent-counts", selectedAccountId],
    queryFn: async () => {
      if (!selectedAccountId) return { productCount: 0, ugcCount: 0 };

      const [productsRes, ugcRes] = await Promise.all([
        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("account_id", selectedAccountId),
        supabase
          .from("studio_models")
          .select("id", { count: "exact", head: true }),
      ]);

      if (productsRes.error || ugcRes.error) {
        console.error("useAgentCounts fetch error", productsRes.error || ugcRes.error);
        throw productsRes.error || ugcRes.error;
      }

      return {
        productCount: productsRes.count || 0,
        ugcCount: ugcRes.count || 0,
      };
    },
    enabled: !!selectedAccountId,
    staleTime: 5 * 60 * 1000,
  });

  const relire = useCallback(() => {
    void refetch();
  }, [refetch]);

  return useMemo(() => {
    /* TROIS ÉTATS, JAMAIS DEUX : 25/08/2026.
       Le hook n'en rendait que deux, `loading` et des chiffres. En échec de
       lecture, `data` reste `undefined` : il retombait donc sur
       `computeAgentCounts(0, 0, …)` et servait des effectifs à zéro,
       impossibles à distinguer d'une boutique sans produit. La pastille
       « 0 experts SEO » et l'organigramme vide venaient de là, sur des
       comptes dont le catalogue est plein.
       Le piège de react-query : `enabled: !!selectedAccountId` laisse
       `isLoading` à FAUX tant que le compte n'est pas résolu, donc le seul
       `isLoading` ne suffisait pas non plus à retenir les chiffres.
       `erreur` est désormais rendue à côté : c'est elle qui permet à l'écran
       de dire la panne au lieu d'affirmer un effectif. */
    if (isError) {
      return {
        ...computeAgentCounts(0, 0, hasDiagnostic),
        loading: true,
        erreur: error,
        relire,
      };
    }

    if (isLoading || !data) {
      return {
        ...computeAgentCounts(0, 0, hasDiagnostic),
        loading: true,
        erreur: null,
        relire,
      };
    }

    return {
      ...computeAgentCounts(data.productCount, data.ugcCount, hasDiagnostic),
      loading: false,
      erreur: null,
      relire,
    };
  }, [data, isLoading, isError, error, hasDiagnostic, relire]);
}
