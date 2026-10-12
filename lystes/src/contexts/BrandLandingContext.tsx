import { createContext, useContext, type ReactNode } from "react";
import type { BrandProductCard } from "@lystes/hooks/useBrandLanding";


/**
 * Contexte qui permet à `ParticuliersLandingPage` d'être réutilisée pour la
 * landing publique d'une marque cliente (ex: lystes.ai/sevmylook).
 *
 * Si présent, override les 3 produits hero, les complexes du texte tournant,
 * et l'ID de marque transmis au chat (`/p/chat?brand={accountId}`).
 *
 * Si absent (= rendu de la home `/` standard), les valeurs par défaut Lystes
 * sont utilisées partout.
 */
export interface BrandLandingContextValue {
  accountId: string;
  brandName: string;
  slug: string;
  /** 3 produits aléatoires du catalogue de la marque, à afficher dans le hero. */
  heroProducts: { image_url: string; name: string }[];
  /** Catalogue complet (avec slug, note, nb avis) pour le carrousel produits. */
  products?: BrandProductCard[];
  /** Liste des "complexes" affichés dans le texte tournant (tes cernes, ta cellulite…). */
  complexes: string[] | null;
  /** Placeholder dynamique du champ chat, dérivé des complexes. */
  chatPlaceholder?: string | null;
  /** URL du site officiel de la marque (utilisée par le CTA du header). */
  websiteUrl?: string | null;
  /** Compte démo institut : a au moins une prestation active. */
  hasServices?: boolean;
  /** Compte démo marque : a au moins un produit actif. */
  hasProducts?: boolean;
}

const BrandLandingContext = createContext<BrandLandingContextValue | null>(null);

export function BrandLandingProvider({
  value,
  children,
}: {
  value: BrandLandingContextValue;
  children: ReactNode;
}) {
  return (
    <BrandLandingContext.Provider value={value}>{children}</BrandLandingContext.Provider>
  );
}

export function useBrandLandingContext(): BrandLandingContextValue | null {
  return useContext(BrandLandingContext);
}
