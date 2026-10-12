import { useEffect, useState } from "react";

/**
 * « RÉDUIRE LES ANIMATIONS », ET LES VIDÉOS DE DÉCOR SUR TÉLÉPHONE.
 *
 * Audit du 27/09/2026 (points 31 et 32) :
 *  - la règle CSS de `index.css` arrête toutes les animations CSS quand la
 *    visiteuse demande moins de mouvement, mais les boucles JavaScript de
 *    l'accueil (fil de conversation, vignettes, machine à écrire, démo du
 *    conseiller, scanner du diagnostic) continuaient de tourner ;
 *  - les deux vidéos du haut de l'accueil pèsent 7,4 et 7,5 Mo, et
 *    l'attribut `autoplay` passe outre `preload="metadata"` : un téléphone les
 *    téléchargeait en entier avant même le premier geste.
 *
 * Ces deux fonctions sont la seule source de vérité. Elles se lisent de façon
 * SYNCHRONE au premier rendu : une vidéo qui recevait sa source puis la
 * perdait au rendu suivant aurait déjà lancé son téléchargement.
 */

export const REQUETE_MOUVEMENT_REDUIT = "(prefers-reduced-motion: reduce)";
/** La largeur où l'accueil passe en mise en page téléphone (HomeHeroVideo). */
export const REQUETE_TELEPHONE = "(max-width: 720px)";

function correspond(requete: string): boolean {
  try {
    return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(requete).matches;
  } catch {
    return false;
  }
}

/** Vrai quand la visiteuse a demandé moins de mouvement à son système. */
export function mouvementReduit(): boolean {
  return correspond(REQUETE_MOUVEMENT_REDUIT);
}

/**
 * Une vidéo de décor peut-elle être chargée et jouée ? Non sur téléphone, non
 * quand la visiteuse demande moins de mouvement, non en mode « économie de
 * données ». L'affiche (`poster`) prend alors sa place : même cadrage, aucun
 * téléchargement de la vidéo.
 */
export function videoDecorPermise(): boolean {
  if (mouvementReduit() || correspond(REQUETE_TELEPHONE)) return false;
  try {
    const connexion = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connexion?.saveData) return false;
  } catch {
    /* navigateur sans l'API : on ne suppose rien */
  }
  return true;
}

function useSelonMedia(calcul: () => boolean, requetes: string[]): boolean {
  const [valeur, setValeur] = useState(calcul);
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const listes = requetes.map((q) => window.matchMedia(q));
    const maj = () => setValeur(calcul());
    listes.forEach((l) => l.addEventListener?.("change", maj));
    maj();
    return () => listes.forEach((l) => l.removeEventListener?.("change", maj));
    // Les requêtes sont des constantes du module.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return valeur;
}

/** Suit « réduire les animations », y compris s'il change pendant la visite. */
export function useMouvementReduit(): boolean {
  return useSelonMedia(mouvementReduit, [REQUETE_MOUVEMENT_REDUIT]);
}

/** Suit la largeur et la préférence : une fenêtre agrandie retrouve sa vidéo. */
export function useVideoDecorPermise(): boolean {
  return useSelonMedia(videoDecorPermise, [REQUETE_MOUVEMENT_REDUIT, REQUETE_TELEPHONE]);
}
