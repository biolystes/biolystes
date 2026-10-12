import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lystes/integrations/supabase/client";
import { useAccount } from "@lystes/contexts/AccountContext";
import { toast } from "sonner";

export interface StudioModel {
  id: string;
  account_id: string | null;
  name: string;
  image_url: string;
  storage_path: string;
  gender: "female" | "male";
  ethnicity: "white" | "black" | "latino" | "mena" | "east_asian" | "south_asian" | "mixed";
  age_range: "11-17" | "18-25" | "26-35" | "36-45" | "46-55";
  is_classified: boolean;
  classification_confidence: number | null;
  created_at: string;
  sample_images?: string[] | null;
  specialty?: string | null;
  card_title?: string | null;
}

export const ETHNICITY_OPTIONS = [
  { value: "all", label: "Toutes" },
  { value: "white", label: "Blanche / Caucasienne" },
  { value: "black", label: "Africaine / Noire" },
  { value: "latino", label: "Latino / Hispanique" },
  { value: "mena", label: "Moyen-Orient / Afrique du Nord" },
  { value: "east_asian", label: "Asiatique de l'Est" },
  { value: "south_asian", label: "Asiatique du Sud" },
  { value: "mixed", label: "Mixte / Multi-ethnique" },
];

export const AGE_RANGE_OPTIONS = [
  { value: "all", label: "Tous les âges" },
  { value: "11-17", label: "11-17 ans" },
  { value: "18-25", label: "18-25 ans" },
  { value: "26-35", label: "26-35 ans" },
  { value: "36-45", label: "36-45 ans" },
  { value: "46-55", label: "46-55 ans" },
];

export const GENDER_OPTIONS = [
  { value: "all", label: "Tous" },
  { value: "female", label: "Femme" },
  { value: "male", label: "Homme" },
];

/** Le genre d'un modèle, en français comme dans le filtre : les cartes UGC
    affichaient « female » tel que la base l'écrit (relecture du 10/10/2026). */
export function libelleGenre(genre: string | null | undefined): string {
  return GENDER_OPTIONS.find((o) => o.value !== "all" && o.value === genre)?.label ?? "UGC";
}

/**
 * Models pinned at the top of the catalog (in this exact order).
 */
const FEATURED_MODEL_IDS = [
  "120f05bb-486e-46b9-98fa-1b014c9b8c70",
  "008530c8-9dee-445f-8315-70a2a5906db0",
  "f56a8714-de45-44ef-a167-2074ea482177",
  "c793eaac-65d3-434d-9647-c3be3f25e3e4",
  "1f4980f3-2e06-4fb3-b1dd-29b1e34e4036",
  "d085fd32-c0af-43c6-9a26-e4871bc0cb28",
  "718e83f9-ff2d-4c98-83d9-05057bc67705",
  "0d9ed2ac-3944-44e6-bc04-24589c0f1693",
  "e9bee524-e8fa-4c16-98ad-69e3a71e0661",
  "5a6b1674-5c04-4327-9cee-32e6f124d053",
];


/**
 * Models pushed to the bottom of the catalog.
 */
const DEMOTED_MODEL_IDS = [
  "0025a184-c3ae-4bdd-9409-32a0782131f8",
];


/**
 * Interleave models so no two consecutive models share the same ethnicity.
 * This creates a visually diverse catalog without any clustering.
 */
function interleaveByEthnicity(models: StudioModel[]): StudioModel[] {
  if (models.length <= 1) return models;


  // Group by ethnicity
  const groups = new Map<string, StudioModel[]>();
  for (const m of models) {
    const key = m.ethnicity ?? "unknown";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(m);
  }

  // Sort groups by size descending (largest first for round-robin)
  const sorted = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  const queues = sorted.map(([, arr]) => [...arr]);

  const result: StudioModel[] = [];
  let lastEthnicity: string | null = null;

  while (queues.some((q) => q.length > 0)) {
    let placed = false;
    // Try each queue, prefer the largest non-matching
    for (const q of queues) {
      if (q.length === 0) continue;
      if (q[0].ethnicity !== lastEthnicity) {
        const item = q.shift()!;
        result.push(item);
        lastEthnicity = item.ethnicity;
        placed = true;
        break;
      }
    }
    // If all remaining are the same ethnicity, just take from the largest
    if (!placed) {
      for (const q of queues) {
        if (q.length > 0) {
          const item = q.shift()!;
          result.push(item);
          lastEthnicity = item.ethnicity;
          break;
        }
      }
    }
    // Re-sort queues by remaining size
    queues.sort((a, b) => b.length - a.length);
  }

  return result;
}

export function useStudioModels(accountId?: string) {
  return useQuery({
    queryKey: ["studio-models", accountId],
    queryFn: async () => {
      // Always fetch in batches to bypass the 1000-row default limit
      const allData: StudioModel[] = [];
      let offset = 0;
      const batchSize = 1000;
      let hasMore = true;

      while (hasMore) {
        let query = supabase
          .from("studio_models")
          .select("*")
          .order("created_at", { ascending: false })
          .range(offset, offset + batchSize - 1);

        // Always filter to ensure global models (account_id IS NULL) are visible
        if (accountId) {
          query = query.or(`account_id.eq.${accountId},account_id.is.null`);
        } else {
          query = query.is("account_id", null);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching studio models:", error);
          throw error;
        }

        if (data && data.length > 0) {
          allData.push(...(data as StudioModel[]));
          offset += batchSize;
          hasMore = data.length === batchSize;
        } else {
          hasMore = false;
        }
      }

      // Interleave by ethnicity to ensure diversity in display order
      const ordered = interleaveByEthnicity(allData);

      // Pin featured models at the top, in the configured order
      const featured = FEATURED_MODEL_IDS
        .map((id) => ordered.find((m) => m.id === id))
        .filter(Boolean) as StudioModel[];
      const demoted = DEMOTED_MODEL_IDS
        .map((id) => ordered.find((m) => m.id === id))
        .filter(Boolean) as StudioModel[];
      const rest = ordered.filter(
        (m) => !FEATURED_MODEL_IDS.includes(m.id) && !DEMOTED_MODEL_IDS.includes(m.id)
      );

      return [...featured, ...rest, ...demoted];


    },
    enabled: true,
  });
}

export function useClassifyModels() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      accountId, 
      bucketName = "avatar-model-photo-stuido", 
      folderPath = "" 
    }: { 
      accountId: string; 
      bucketName?: string; 
      folderPath?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("classify-studio-models", {
        body: { accountId, bucketName, folderPath },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["studio-models", variables.accountId] });
      
      if (data.processed > 0) {
        toast.success(`${data.processed} modèle(s) classifié(s) avec succès !`);
      } else if (data.alreadyClassified > 0) {
        toast.info(`Tous les modèles sont déjà classifiés (${data.alreadyClassified})`);
      } else {
        toast.info("Aucun nouveau modèle trouvé dans le bucket");
      }

      if (data.failed > 0) {
        toast.warning(`${data.failed} modèle(s) n'ont pas pu être classifié(s)`);
      }
    },
    onError: (error: Error) => {
      console.error("Classification error:", error);
      toast.error("Une erreur est survenue lors de la classification. Veuillez réessayer.");
    },
  });
}

export function useDeleteStudioModel() {
  const queryClient = useQueryClient();
  const { selectedAccountId } = useAccount();

  return useMutation({
    mutationFn: async (modelId: string) => {
      const { data, error } = await supabase
        .from("studio_models")
        .delete()
        .eq("id", modelId)
        .eq("account_id", selectedAccountId)
        .select("id");

      if (error || !data || data.length === 0) {
        throw error ?? new Error("Aucune ligne supprimée (studio_models)");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio-models"] });
      toast.success("Modèle supprimé");
    },
    onError: (error: Error) => {
      console.error(error);
      toast.error("Une erreur est survenue lors de la suppression du modèle. Veuillez réessayer.");
    },
  });
}
