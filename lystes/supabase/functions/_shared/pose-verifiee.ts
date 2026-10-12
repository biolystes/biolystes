/**
 * CE QUI COMPTE COMME UNE POSE VÉRIFIÉE, ÉCRIT UNE SEULE FOIS.
 *
 * Contre-revue du 27/09/2026. Deux définitions coexistaient :
 *   - le navigateur (`verifierPoseDuConseiller`, `src/config/urls.ts`)
 *     comptait la pose faite pour « ok » ET pour « not_a_product_page » ;
 *   - `verify-install` n'écrivait `accounts.install_verified` que pour « ok ».
 * Une marchande qui collait l'adresse de son accueil lisait « Votre conseiller
 * est bien en ligne sur votre site », puis le Guide d'installation et son
 * badge lui redemandaient « Vérifier la pose », puisqu'ils lisent
 * `install_verified`.
 *
 * `not_a_product_page` n'est rendu qu'APRÈS avoir trouvé le script ET le
 * compte dans la page : le conseiller est posé, la page ouverte n'est
 * simplement pas une fiche produit. Les deux verdicts valent donc pose, des
 * deux côtés, par cette seule fonction.
 *
 * Aucune dépendance : `verify-install` l'importe, le navigateur aussi.
 */

/** Les verdicts de `verify-install` qui prouvent le conseiller du compte sur la page. */
export const VERDICTS_DE_POSE = ["ok", "not_a_product_page"] as const;

/** Vrai quand le verdict prouve la pose : `install_verified` s'écrit, l'écran l'annonce. */
export function poseVue(diagnostic: string | null | undefined): boolean {
  return (VERDICTS_DE_POSE as readonly string[]).includes(diagnostic ?? "");
}
