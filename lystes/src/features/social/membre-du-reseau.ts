import type { PlateformeEditoriale } from "@lystes/components/mygpt/editorial-formats";

/**
 * QUI TIENT QUEL RÉSEAU.
 *
 * 14/09/2026 (JP) : « on voit chaque réseau social faire le job, on voit les
 * frames du community manager ».
 *
 * `equipe-agence.ts` nomme les quinze rôles et leurs réseaux en toutes lettres
 * (« Instagram », « TikTok »…), mais la planche raisonne en plateformes
 * (`instagram-story`, `meta-ads`…). Personne ne faisait la traduction : sans
 * elle, l'animation ne sait pas quel visage montrer pendant qu'une case
 * s'écrit, et retomberait sur la direction pour tout le monde. Une équipe dont
 * on ne voit qu'une tête n'est pas une équipe.
 *
 * Les trois formats Instagram partagent Amara : c'est le même métier, la même
 * personne. Les deux régies publicitaires reviennent à la direction, faute
 * d'acheteur média dans l'équipe : on ne prête pas un travail à quelqu'un qui
 * ne le fait pas.
 */
export const MEMBRE_DU_RESEAU: Record<PlateformeEditoriale, string> = {
  "instagram-feed": "cm-instagram",
  "instagram-story": "cm-instagram",
  "instagram-reel": "cm-instagram",
  tiktok: "cm-tiktok",
  linkedin: "cm-linkedin",
  x: "cm-x",
  facebook: "cm-facebook",
  snapchat: "cm-snapchat",
  pinterest: "cm-pinterest",
  "google-ads": "direction",
  "meta-ads": "direction",
  /* Les quatre regies ajoutees le 14/09 reviennent aussi a la direction :
     l'equipe n'a pas d'acheteur media, et on ne prete pas un travail a
     quelqu'un qui ne le fait pas. */
  "tiktok-ads": "direction",
  "pinterest-ads": "direction",
  "linkedin-ads": "direction",
  "snapchat-ads": "direction",
};

/** La clé du membre qui tient ce réseau ; la direction à défaut. */
export function membreDuReseau(plateforme: string): string {
  return MEMBRE_DU_RESEAU[plateforme as PlateformeEditoriale] ?? "direction";
}
