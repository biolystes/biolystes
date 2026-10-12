import type { PlateformeEditoriale } from "@lystes/components/mygpt/editorial-formats";

export interface MembreAgenceSociale {
  cle: string;
  nom: string;
  role: string;
  pole: "Direction" | "Social Media" | "UGC" | "Production photo" | "Connaissance client";
  mission: string;
  reseaux: string[];
  avatar: string | null;
  parent?: string;
}

export interface ProduitAgenceSociale {
  id: string;
  name: string;
  image_url: string | null;
  price?: number | null;
}

export interface ProduitSemaine extends ProduitAgenceSociale {
  reference_url: string;
  position: number;
}

export interface TextePublicationSociale {
  profile_id: string;
  day_index: number;
  platform: PlateformeEditoriale;
  slot_index: number;
  product_id: string | null;
  reference_url: string | null;
  prompt_exact: string;
  caption: string;
  hashtags: string[];
  call_to_action: string;
  image_overlay: string;
  image_url?: string | null;
  /** Vrai quand le visuel sort d'un générateur : « Image générée par IA ». */
  image_generee?: boolean;
  /** Heure de départ, `time` Postgres (« 18:30:00 »). */
  heure_prevue?: string | null;
  /** État de rédaction de la case (a_ecrire, en_cours, prete, echouee, versee). */
  etat?: string | null;
}

export function debutSemaine(date = new Date()): string {
  const copie = new Date(date);
  const jour = copie.getDay();
  copie.setDate(copie.getDate() - (jour === 0 ? 6 : jour - 1));
  return `${copie.getFullYear()}-${String(copie.getMonth() + 1).padStart(2, "0")}-${String(copie.getDate()).padStart(2, "0")}`;
}

export function clePublication(
  profileId: string,
  dayIndex: number,
  plateforme: PlateformeEditoriale,
  slotIndex: number,
) {
  return `${profileId}:${dayIndex}:${plateforme}:${slotIndex}`;
}