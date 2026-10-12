/**
 * La police et la couleur de texte du site qui pose un formulaire Lystes.
 *
 * Demande de JP du 01/10/2026 : le code d'intégration donne « juste le
 * formulaire », qui doit se fondre dans la page de la marque. Le formulaire
 * vit dans un iframe (il bascule sur la conversation après l'envoi) : il ne
 * peut pas hériter du CSS de la page. `public/lystes-contact.js` lit donc la
 * police et la couleur calculées à l'endroit où il est posé et les passe en
 * paramètres (`?police=` et `?encre=`).
 *
 * Limite connue : une police web chargée par le site (Google Fonts, police
 * du thème) n'existe pas dans l'iframe. Le navigateur prend alors la police
 * de repli de la même pile, souvent la bonne famille générique.
 *
 * Seules des valeurs inoffensives passent : une pile de noms de polices, une
 * couleur rgb/rgba ou hexadécimale.
 */
const POLICE_SURE = /^[A-Za-z0-9 ,'"_-]{1,200}$/;
const ENCRE_SURE = /^(#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\))$/i;

export interface StyleHote {
  police: string | null;
  encre: string | null;
}

export function lireStyleHote(recherche: URLSearchParams): StyleHote {
  const police = (recherche.get("police") ?? "").trim();
  const encre = (recherche.get("encre") ?? "").trim();
  return {
    police: POLICE_SURE.test(police) ? police : null,
    encre: ENCRE_SURE.test(encre) ? encre : null,
  };
}
