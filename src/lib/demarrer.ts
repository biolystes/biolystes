/* Point d'entrée « Commencer mon projet » : tout part vers biolystes.pro/demarrer,
   avec le texte saisi (300 caractères au plus) dans `projet`. */
export const DEMARRER_URL = "https://biolystes.pro/demarrer";

export function adresseDemarrer(projet?: string): string {
  const texte = (projet ?? "").trim().slice(0, 300);
  return texte ? `${DEMARRER_URL}?projet=${encodeURIComponent(texte)}` : DEMARRER_URL;
}
