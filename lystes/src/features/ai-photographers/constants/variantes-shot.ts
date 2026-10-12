/**
 * Trois variantes par TYPE de photo (JP, 16/09/2026).
 *
 * « Au niveau photographe, l'idée était de faire des variables par type de
 * photo : trois photos différentes de gros plan, trois photos différentes de
 * lévitation… » Un photographe IA ne joue donc qu'UN type de prise de vue,
 * mais il en livre trois exécutions distinctes.
 *
 * Règle de rédaction, identique à `/shot` : ces textes fixent une intention de
 * prise de vue — angle, distance, lumière, support — jamais un lieu, un décor
 * de marque ou un univers. La scène reste inventée autour du produit réel, qui
 * est le seul élément verrouillé.
 */
import { LIBELLES_SHOT, PROMPTS_SHOT } from "./prompts-shot";

/** Les trois variantes d'un type, dans l'ordre affiché. */
export const VARIANTES_SHOT: Record<number, [string, string, string]> = {
  1: [
    "Front-facing hero shot of the product in a clean studio setup. Neutral background, balanced centred composition, calm and confident presentation of the product, soft frontal light.",
    "Hero shot of the same product seen slightly from above at a three-quarter angle, still on a clean neutral ground. Directional light from one side, a single controlled shadow anchoring the product.",
    "Hero shot from a low camera position, the product standing tall against a clean seamless background drawn from its own palette. Restrained contrast, generous negative space above the product.",
  ],
  2: [
    "Close-up shot with the focus centred on the middle of the product, revealing surface texture, materials and print details. Shallow depth of field, even light.",
    "Close-up on the upper third of the product — cap, closure, neck or top edge — shot at a slight angle with grazing light that reveals relief and material grain.",
    "Close-up taken from an oblique low angle along the side of the product, the surface running diagonally across the frame, reflections and texture readable end to end.",
  ],
  3: [
    "Product placed in an environment that naturally fits the brand and product category. Studio setting inspired by the product design elements and colours.",
    "Same kind of fitting environment, seen wider and from a higher angle, the product placed off-centre with the set breathing around it. Daylight quality, coherent palette.",
    "Same kind of fitting environment, camera close to the surface at product height, the set falling out of focus behind. Intimate framing, warm directional light.",
  ],
  4: [
    "Product shown in use or interaction on a neutral studio background. Hands and interaction elements are minimal and restrained, the look matches the style of the package.",
    "Product being picked up or set down, captured mid-gesture with a trace of natural motion. Neutral studio ground, restrained styling, honest skin texture.",
    "Product held close to the camera in one hand, framed from the wrist, the background a plain tonal field. Scale and touch are the subject.",
  ],
  5: [
    "Isometric composition showing multiple copies of the product arranged in a precise geometric order from a top isometric angle, evenly spaced, clean, structured and graphic.",
    "Same multiple copies arranged in a tighter offset grid, seen from directly overhead, rhythm and repetition carrying the frame. Flat even light, no fighting shadows.",
    "Same multiple copies aligned in a single receding row seen from a low isometric angle, perspective creating the rhythm. Clean neutral ground, precise spacing.",
  ],
  6: [
    "Product levitating slightly tilted on a neutral background that matches the reference image colour palette. Floating position is angled and intentional, the product floats naturally in space.",
    "Product floating upright and perfectly centred with a soft grounded shadow far below it, seamless background in one tone drawn from the product. Quiet, weightless, precise.",
    "Product suspended in a dynamic diagonal, caught as if mid-turn, with a second lighter shadow suggesting movement. Same tonal background, controlled studio light.",
  ],
  7: [
    "Extreme close-up focusing on a specific detail of the label, edge, texture or material behaviour.",
    "Extreme close-up on the junction between two materials of the product — glass and cap, paper and seal, metal and plastic — the seam running through the frame.",
    "Extreme close-up so tight that the product becomes almost abstract: colour field, reflection and grain only, still recognisably this product's material.",
  ],
  8: [
    "Product in an unexpected yet aesthetically strong setting that feels bold, editorial and visually striking. Studio-based and designer-driven. Bold composition that elevates the brand.",
    "Bold editorial frame built on one dominant colour block sampled from the product, hard directional light casting a graphic shadow, the product placed off-centre.",
    "Bold editorial frame with a strong architectural structure around the product — planes, steps or curves — shot from an unusual angle, sculpted light, magazine energy.",
  ],
  9: [
    "Wide composition showing the product in use, placed within a refined designer setup. Clean props, controlled styling, cohesive with the rest of the series.",
    "Wide frame with the product small but perfectly readable in a generous, quiet setting. Low horizon, soft late light, ample empty space around it.",
    "Wide frame shot from a high vantage point looking down on the whole setup, the product clearly the focal point among restrained, precisely placed elements.",
  ],
};

/** Le nom éditorial d'un type de photo `/shot`. */
export function libelleDuType(frameNumber: number): string {
  return LIBELLES_SHOT[frameNumber - 1] ?? `Cadrage ${frameNumber}`;
}

/**
 * Les trois prompts d'un type. À défaut de variantes écrites, le cadrage
 * `/shot` d'origine est répété plutôt qu'inventé.
 */
export function variantesDuType(frameNumber: number): string[] {
  const ecrites = VARIANTES_SHOT[frameNumber];
  if (ecrites) return [...ecrites];
  const socle = PROMPTS_SHOT[frameNumber - 1];
  return socle ? [socle, socle, socle] : [];
}
