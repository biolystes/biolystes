/**
 * RAIL DE DÉFILEMENT
 *
 * Géométrie du curseur d'un rail dessiné à la main.
 *
 * Pourquoi ne pas styler la barre native : sur macOS et iOS, le système utilise
 * des barres flottantes qui n'occupent aucune largeur et s'effacent une seconde
 * après le défilement. `scrollbar-color` et `::-webkit-scrollbar` changent bien
 * leur apparence, mais rien ne les empêche de disparaître. Or l'intérêt du rail
 * est justement d'être visible en permanence : il dit au lecteur qu'il reste du
 * texte, et où il en est. Il faut donc le dessiner.
 */

export interface RailMetrics {
  /** Défilement courant, en pixels. */
  scrollTop: number;
  /** Hauteur totale du contenu, débordement compris. */
  scrollHeight: number;
  /** Hauteur visible du contenu. */
  clientHeight: number;
  /** Hauteur du rail. Vaut en général `clientHeight`. */
  trackHeight: number;
  /** Hauteur minimale du curseur, pour qu'il reste visible sur un long texte. */
  minThumbHeight: number;
}

export interface Thumb {
  /** Décalage du curseur depuis le haut du rail, en pixels. */
  top: number;
  /** Hauteur du curseur, en pixels. */
  height: number;
}

/**
 * Position et taille du curseur, ou `null` quand il n'y a rien à faire défiler.
 *
 * Renvoyer `null` plutôt qu'un curseur pleine hauteur est délibéré : un rail
 * affiché sur un texte qui tient entièrement laisserait croire à un débordement
 * qui n'existe pas. L'appelant masque alors le rail.
 */
export function computeThumb(m: RailMetrics): Thumb | null {
  const { scrollTop, scrollHeight, clientHeight, trackHeight, minThumbHeight } = m;

  const overflow = scrollHeight - clientHeight;
  if (!(overflow > 0) || !(trackHeight > 0) || !(scrollHeight > 0)) return null;

  /* Le curseur occupe la même part du rail que la zone visible occupe du
     contenu, sans jamais descendre sous le minimum ni dépasser le rail. */
  const proportional = trackHeight * (clientHeight / scrollHeight);
  const height = Math.min(trackHeight, Math.max(minThumbHeight, proportional));

  /* La course du curseur est plus courte que le rail, de sa propre hauteur.
     Sans cela, arrivé en bas, il déborderait de la moitié de sa taille. */
  const travel = trackHeight - height;
  const progress = clamp(scrollTop / overflow, 0, 1);

  return { top: Math.round(progress * travel), height: Math.round(height) };
}

function clamp(v: number, min: number, max: number): number {
  if (Number.isNaN(v)) return min;
  return Math.min(max, Math.max(min, v));
}
