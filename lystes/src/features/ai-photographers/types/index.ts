import type { DisciplineCreative } from "../constants/disciplines";

/** Les sept styles de prise de vue reconnus par JP (03/09/2026). Un
 *  photographe en porte un seul : c'est ce que la carte affiche sous
 *  l'intitule « Photo ». */
export type StylePhoto =
  | "Flat Lay"
  | "Lifestyle"
  | "Incarné"
  | "Texture"
  | "Nature Morte"
  | "Portée"
  | "Packshot";

export interface AIPhotographer {
  id: string;
  name: string;
  specialty: string;
  /** Style de prise de vue, lu sur la carte : « Photo · PACKSHOT ». */
  style: StylePhoto;
  type: string;
  title: string;
  avatar: string;
  sampleImages: string[];
  sectorKey: "beauty" | "food" | "sport" | "fashion" | "eyewear" | "electronics";
  /** Metier reel du profil : photographe, graphiste, ugc ou community. */
  discipline?: DisciplineCreative;
  /** Cadrages joues par ce profil ; absent = les neuf cadrages. */
  frames?: number[];
  /** Nom du profil dont ce style a ete extrait. */
  derivedFrom?: string;
  /**
   * Le shooting met une personne en scene : le produit est porte, pas pose.
   * Le CoWork ouvre alors un onglet « Mannequin IA » et refuse de lancer le
   * shooting tant qu'aucun mannequin n'est choisi (JP, 03/09/2026).
   */
  withModel?: boolean;
  edgeFunction?: string;
  /** Prompts exacts du shooting d'origine, dans l'ordre de sampleImages. */
  promptsPortfolio?: string[];
  /** Libellés affichés pendant la génération, dans le même ordre. */
  libellesCadrages?: string[];
}
