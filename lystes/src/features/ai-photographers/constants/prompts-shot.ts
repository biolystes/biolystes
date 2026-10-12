/**
 * Source unique des neuf cadrages de `/shot`.
 *
 * Ces textes restent volontairement ouverts : ils fixent un type de prise de
 * vue, jamais un lieu, un décor ou un univers de marque à l'avance.
 */
export const PROMPTS_SHOT = [
  "Front-facing hero shot of the product in a clean studio setup. Neutral background, balanced composition, calm and confident presentation of the product.",
  "Close-up shot with the focus centered on the middle of the product. Focusing on surface texture, materials and print details.",
  "Product placed in an environment that naturally fits the brand and product category. Studio setting inspired by the product design elements and colours.",
  "Product shown in use or interaction on a neutral studio background. Hands and interaction elements are minimal and restrained, the look matches the style of the package.",
  "Isometric composition showing multiple products arranged in a precise geometric order from the top isometric angle. All products are placed at the same isometric top angle, evenly spaced, clean, structured and graphic.",
  "Product levitating slightly tilted on a neutral background that matches the reference image color palette. Floating position is angled and intentional, the product is floating naturally in space.",
  "Extreme close-up focusing on a specific detail of the label, edge, texture or material behavior.",
  "Product in an unexpected yet aesthetically strong setting that feels bold, editorial and visually striking. Studio-based and designer-driven. Bold composition that elevates the brand.",
  "Wide composition showing the product in use, placed within a refined designer setup. Clean props, controlled styling, cohesive with the rest of the series.",
] as const;

export const LIBELLES_SHOT = [
  "Hero Shot",
  "Close-up Texture",
  "In Context",
  "In Use",
  "Isometric Grid",
  "Levitation",
  "Extreme Detail",
  "Editorial Bold",
  "Wide Lifestyle",
] as const;

export function promptShot(frameNumber: number): string | undefined {
  return PROMPTS_SHOT[frameNumber - 1];
}