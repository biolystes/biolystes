import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@lystes/integrations/supabase/client";

/**
 * LE CONTEXTE QUE LA MARQUE AJUSTE ELLE-MÊME.
 *
 * 14/09/2026 (JP) : les chiffres se calculent, mais deux choses ne se
 * devinent pas — le LIEU (une boutique, un salon de coiffure, un institut)
 * et le MODÈLE attendu sur les photos. La marque les écrit ici, une fois,
 * et toutes les générations les reprennent.
 */
export interface ContexteCreatif {
  lieu_type: string;
  lieu_nom: string;
  lieu_ville: string;
  lieu_ambiance: string;
  notes: string;
  avatar_genre: string;
  avatar_age: string;
  avatar_carnation: string;
  avatar_style: string;
  avatar_description: string;
  modele_ugc_id: string | null;
  /** Photos du lieu réel, servant de décor aux visuels générés. */
  lieu_photos: string[];
  /** La marque veut-elle que ses visuels soient tournés dans SON lieu ? */
  lieu_tournage_actif: boolean;
}

export const CONTEXTE_VIDE: ContexteCreatif = {
  lieu_type: "",
  lieu_nom: "",
  lieu_ville: "",
  lieu_ambiance: "",
  notes: "",
  avatar_genre: "",
  avatar_age: "",
  avatar_carnation: "",
  avatar_style: "",
  avatar_description: "",
  modele_ugc_id: null,
  lieu_photos: [],
  lieu_tournage_actif: false,
};

export const TYPES_DE_LIEU = [
  "Boutique",
  "Salon de coiffure",
  "Institut de beauté",
  "Cabinet / clinique",
  "Studio photo",
  "Atelier",
  "Restaurant",
  "Salle de sport",
  "Domicile",
  "Extérieur / rue",
  "Vente en ligne uniquement",
];

export const CARNATIONS = ["Claire", "Médium", "Mate", "Foncée", "Variée"];
export const TRANCHES_AGE = ["18-25 ans", "25-35 ans", "35-45 ans", "45-60 ans", "60 ans et plus"];
export const GENRES = ["Femmes", "Hommes", "Mixte"];

export function useContexteCreatif(compteId?: string | null) {
  const client = useQueryClient();

  const requete = useQuery({
    queryKey: ["contexte-creatif", compteId],
    enabled: !!compteId,
    queryFn: async (): Promise<ContexteCreatif> => {
      const { data, error } = await supabase
        .from("contexte_creatif")
        .select(
          "lieu_type, lieu_nom, lieu_ville, lieu_ambiance, notes, avatar_genre, avatar_age, avatar_carnation, avatar_style, avatar_description, modele_ugc_id, lieu_photos, lieu_tournage_actif",
        )
        .eq("account_id", compteId!)
        .maybeSingle();
      if (error) throw error;
      return { ...CONTEXTE_VIDE, ...(data ?? {}) };
    },
  });

  const enregistrer = useMutation({
    mutationFn: async (valeurs: Partial<ContexteCreatif>) => {
      if (!compteId) throw new Error("Aucune boutique sélectionnée.");
      const { error } = await supabase
        .from("contexte_creatif")
        .upsert(
          { account_id: compteId, ...CONTEXTE_VIDE, ...(requete.data ?? {}), ...valeurs },
          { onConflict: "account_id" },
        );
      if (error) throw error;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["contexte-creatif", compteId] });
    },
  });

  return {
    contexte: requete.data ?? CONTEXTE_VIDE,
    chargement: requete.isLoading,
    enregistrer: enregistrer.mutateAsync,
    enregistrement: enregistrer.isPending,
  };
}

/** La phrase qui décrit le lieu et le modèle attendus, pour un prompt image. */
export function phraseContexte(contexte: ContexteCreatif): string[] {
  const lignes: string[] = [];
  const lieu = [contexte.lieu_type, contexte.lieu_nom, contexte.lieu_ville].filter(Boolean).join(" · ");
  if (lieu) lignes.push(`Lieu de la marque : ${lieu}.`);
  if (contexte.lieu_ambiance) lignes.push(`Décor et ambiance : ${contexte.lieu_ambiance}.`);
  /* Le tournage sur place n'a de sens que si une photo du lieu accompagne la
     consigne : sans référence visuelle, le moteur invente un autre salon. */
  if (contexte.lieu_tournage_actif && contexte.lieu_photos.length) {
    lignes.push(
      "Tourner dans CE lieu exact : la photo de décor fournie en référence montre les murs, le mobilier et la lumière à reproduire. N'invente aucun autre décor.",
    );
  }
  const modele = [contexte.avatar_genre, contexte.avatar_age, contexte.avatar_carnation, contexte.avatar_style]
    .filter(Boolean)
    .join(" · ");
  if (modele) lignes.push(`Si une personne apparaît sur le visuel : ${modele}.`);
  if (contexte.avatar_description) lignes.push(contexte.avatar_description);
  if (contexte.notes) lignes.push(contexte.notes);
  return lignes;
}
