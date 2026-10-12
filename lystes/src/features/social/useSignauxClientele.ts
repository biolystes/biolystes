import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lystes/integrations/supabase/client";
import { repartirPrenoms, type RepartitionPrenoms } from "./prenoms-genres";

/**
 * LES DEUX SIGNAUX MESURÉS DE L'AVATAR CLIENT.
 *
 * 14/09/2026 (JP) : « analyse les photos des diagnostics ou essayages », et
 * « analyse les prénoms des gens qui commandent ». Ce sont deux sources
 * distinctes, avec deux volumes distincts. On ne les fusionne jamais en un
 * chiffre unique sans origine : chacune s'affiche avec ce qui la fonde.
 */

export interface Compteur {
  libelle: string;
  n: number;
}

export interface SignalVisages {
  total: number;
  retenus: number;
  genres: Compteur[];
  ages: Compteur[];
  carnations: Compteur[];
  origines: Compteur[];
  cheveux: Compteur[];
}

function classer(lignes: (string | null)[]): Compteur[] {
  const compteur = new Map<string, number>();
  for (const brut of lignes) {
    const libelle = (brut ?? "").trim();
    if (!libelle || libelle === "indetermine") continue;
    compteur.set(libelle, (compteur.get(libelle) ?? 0) + 1);
  }
  return [...compteur.entries()]
    .map(([libelle, n]) => ({ libelle, n }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 6);
}

/** Ce que les photos d'essayage et de diagnostic déjà lues disent. */
export function useVisagesClientele(compteId?: string | null, actif = true) {
  return useQuery({
    queryKey: ["visages-clientele", compteId],
    enabled: !!compteId && actif,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<SignalVisages> => {
      const { data, error } = await supabase
        .from("client_face_signals")
        .select("gender, age_bracket, skin_tone, origin, hair_type, retenu")
        .eq("account_id", compteId!)
        .limit(5000);
      if (error) throw error;
      const toutes = data ?? [];
      const retenues = toutes.filter((ligne) => ligne.retenu);
      return {
        total: toutes.length,
        retenus: retenues.length,
        genres: classer(retenues.map((l) => l.gender)),
        ages: classer(retenues.map((l) => l.age_bracket)),
        carnations: classer(retenues.map((l) => l.skin_tone)),
        origines: classer(retenues.map((l) => l.origin)),
        cheveux: classer(retenues.map((l) => l.hair_type)),
      };
    },
  });
}

/** Le genre déduit des prénoms des commandes, sans appel payant. */
export function usePrenomsClientele(compteId?: string | null, actif = true) {
  return useQuery({
    queryKey: ["prenoms-clientele", compteId],
    enabled: !!compteId && actif,
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<RepartitionPrenoms> => {
      const { data, error } = await supabase
        .from("ecommerce_orders")
        .select("customer_first_name")
        .eq("account_id", compteId!)
        .not("customer_first_name", "is", null)
        .order("order_date", { ascending: false })
        .limit(5000);
      if (error) throw error;
      return repartirPrenoms((data ?? []).map((ligne) => ligne.customer_first_name));
    },
  });
}

/** Lance une nouvelle passe de lecture des photos, par lots. */
export function useLireLesVisages(compteId?: string | null) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (limite: number | undefined = 24) => {
      if (!compteId) throw new Error("Aucune boutique sélectionnée.");
      const { data, error } = await supabase.functions.invoke("analyser-visages-clientele", {
        body: { accountId: compteId, limite },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) {
        throw new Error(String((data as { message?: string }).message ?? "Lecture impossible."));
      }
      return data as { analysees: number; retenues?: number; restantes: number; message?: string };
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["visages-clientele", compteId] });
    },
  });
}
