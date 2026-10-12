/**
 * LE TEXTE EXACT QUI PARTIRA SUR LE RÉSEAU.
 *
 * 30/09/2026 (JP) : la marque doit voir « quel TEXTE exact » part chaque jour.
 * La semaine gardait légende, appel à l'action et hashtags dans trois champs
 * séparés, et rien ne les assemblait : l'écran montrait des morceaux, le
 * serveur publiait `texte` seul. Cette fonction est la règle unique côté
 * écran ; `supabase/functions/_shared/programmer-publications.ts` porte la
 * même, et `texteFinal.test.ts` rejoue les mêmes cas des deux côtés.
 *
 * L'ordre : légende, puis appel à l'action, puis hashtags sur une ligne, puis
 * la mention « Image générée par IA » quand le visuel sort d'un générateur.
 * Blocs séparés par une ligne vide. Un bloc vide disparaît, sans laisser de
 * trou. Une vraie photo produit ne porte jamais la mention.
 */
export const MENTION_IMAGE_IA = "Image générée par IA";

export interface ContenuTexteFinal {
  caption?: string | null;
  call_to_action?: string | null;
  hashtags?: readonly string[] | null;
  image_generee?: boolean | null;
}

/** Un hashtag propre : un seul dièse, sans espace, sans doublon (casse ignorée). */
export function nettoyerHashtags(hashtags: readonly string[] | null | undefined): string[] {
  const vus = new Set<string>();
  const sortie: string[] = [];
  for (const brut of hashtags ?? []) {
    const mot = String(brut ?? "").trim().replace(/^#+/, "").replace(/\s+/g, "");
    if (!mot) continue;
    const cle = mot.toLowerCase();
    if (vus.has(cle)) continue;
    vus.add(cle);
    sortie.push(`#${mot}`);
  }
  return sortie;
}

export function texteFinal(contenu: ContenuTexteFinal): string {
  const blocs: string[] = [];
  const legende = (contenu.caption ?? "").trim();
  const appel = (contenu.call_to_action ?? "").trim();
  const hashtags = nettoyerHashtags(contenu.hashtags);
  if (legende) blocs.push(legende);
  /* Un appel déjà écrit mot pour mot dans la légende n'est pas répété : le
     rédacteur le glisse parfois en fin de légende. */
  if (appel && !legende.includes(appel)) blocs.push(appel);
  if (hashtags.length) blocs.push(hashtags.join(" "));
  if (contenu.image_generee) blocs.push(MENTION_IMAGE_IA);
  return blocs.join("\n\n");
}
