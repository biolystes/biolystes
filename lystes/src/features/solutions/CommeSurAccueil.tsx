import { useMemo, type ReactNode } from "react";
import { UNSAFE_LocationContext, useLocation, useNavigationType } from "react-router-dom";

/**
 * Fait lire « / » comme chemin aux composants de l'accueil montés sur
 * `/accueil-v2` (09/10/2026).
 *
 * L'en-tête (`Header.tsx`) et la bascule Ecommerce / Entreprises
 * (`BasculeCible`) regardent le chemin : la bascule ne s'affiche que sur « / »
 * et « /business », et l'en-tête ne prend toute la largeur que sur « / ».
 * Ces fichiers servent l'accueil, on ne les modifie pas : on leur présente le
 * chemin de l'accueil, et le clone devient identique, bascule comprise.
 *
 * Seuls les enfants voient ce chemin ; le reste de l'application, l'URL et
 * l'historique ne changent pas. Les liens de l'en-tête sont absolus, ils
 * mènent donc aux mêmes adresses que sur l'accueil.
 */
export function CommeSurAccueil({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const valeur = useMemo(
    () => ({ location: { ...location, pathname: "/" }, navigationType }),
    [location, navigationType],
  );
  return <UNSAFE_LocationContext.Provider value={valeur}>{children}</UNSAFE_LocationContext.Provider>;
}
