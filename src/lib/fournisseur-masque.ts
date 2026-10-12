/**
 * Le nom du laboratoire fournisseur ne figure EN CLAIR dans aucun fichier
 * servi au navigateur (règle de JP : le fournisseur ne se nomme jamais).
 * Le code qui doit reconnaître ses adresses d'images passe par ici : le nom
 * y est recomposé à l'exécution, il ne se lit pas dans le paquet publié.
 * Même module que src/lib/fournisseur-masque.ts de lystes.ai.
 */
const MORCEAUX = ["se", "lf", "na", "med"];

const NOM_FOURNISSEUR_COMPACT = MORCEAUX.join("");

function compacter(texte: string): string {
  return texte.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "");
}

/** Vrai si le texte ou l'adresse cite le fournisseur, quelle que soit l'écriture. */
export function citeLeFournisseur(texte: string | null | undefined): boolean {
  return !!texte && compacter(texte).includes(NOM_FOURNISSEUR_COMPACT);
}

/** L'adresse d'image si elle ne vient pas du laboratoire, sinon "". */
export function imageSansFournisseur(url: string | null | undefined): string {
  return url && !citeLeFournisseur(url) ? url : "";
}
