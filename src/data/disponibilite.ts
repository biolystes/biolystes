/* Produits « à venir » : badge « Bientôt » et jamais commandables.
   Couche locale au-dessus de la copie synchronisée de biolystes.pro
   (src/data/catalogue-pro/products.ts, à ne pas retoucher à la main). */
import { estCommandable, type Product } from "@/data/catalogue-pro/products";

export const BADGE_A_VENIR = "Bientôt";
export const BADGE_RUPTURE = "Rupture";

type P = Pick<Product, "status" | "statut_labo" | "prix_ht">;

/** Vrai si le produit n'est pas encore sorti (statut boutique ou laboratoire). */
export function estAVenir(p: Pick<Product, "status" | "statut_labo">): boolean {
  return p.status === "coming_soon" || p.statut_labo === "COMING_SOON";
}

/** Texte du badge de disponibilité, ou null si le produit est disponible. */
export function badgeDisponibilite(p: Pick<Product, "status" | "statut_labo">): string | null {
  if (p.status === "retired") return null;
  if (estAVenir(p)) return BADGE_A_VENIR;
  if (p.statut_labo === "OUT_OF_STOCK") return BADGE_RUPTURE;
  return null;
}

/** Seuls les produits disponibles se commandent : jamais un produit à venir. */
export function peutEtreCommande(p: P): boolean {
  return estCommandable(p) && !estAVenir(p);
}
