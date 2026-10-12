/**
 * PROFILS FINIS SEULEMENT (JP, 11/10/2026).
 *
 * « Les profils qui ne sont pas encore prêts ne doivent pas apparaître […]
 * Il faut qu'on ne voie que des profils finis. Dans la plateforme non plus,
 * il ne doit pas y avoir de profils avec "il faut charger encore une photo". »
 *
 * Un profil du catalogue (photographe, graphiste, community manager, UGC,
 * agence, modèle du studio) n'est montré aux clientes que s'il a sa photo de
 * profil ET au moins PHOTOS_MIN photos de portfolio : de quoi remplir la
 * galerie 2 × 2 de la fenêtre « Choisir qui shoote » sans case vide.
 *
 * Rien n'est supprimé : les profils incomplets restent dans le code et en
 * base, l'atelier (super admin) les voit toujours pour les compléter. Les
 * profils créés par la marchande elle-même ne passent pas par ce filtre : ce
 * sont les siens.
 */
export const PHOTOS_MIN = 4;

/** Les photos réellement présentes d'une galerie. */
export function photosPresentes(galerie: (string | null | undefined)[] | null | undefined): number {
  return (galerie ?? []).filter((u) => typeof u === "string" && u.trim().length > 0).length;
}

/** Vrai si le profil a sa photo de profil et un portfolio complet. */
export function profilComplet(avatar: string | null | undefined, galerie: (string | null | undefined)[] | null | undefined): boolean {
  return Boolean(avatar && avatar.trim()) && photosPresentes(galerie) >= PHOTOS_MIN;
}

/** Raccourci pour les profils du catalogue (`avatar`, `sampleImages`). */
export const estComplet = (p: { avatar?: string | null; sampleImages?: (string | null | undefined)[] }) =>
  profilComplet(p.avatar, p.sampleImages);

/** Raccourci pour les modèles du studio (`image_url`, `sample_images`). */
export const modeleComplet = (m: { image_url?: string | null; sample_images?: (string | null | undefined)[] | null }) =>
  profilComplet(m.image_url, m.sample_images);

/**
 * Le nombre de cases de galerie à montrer : les photos présentes, au plus
 * `max`, arrondies à des rangées pleines. Aucune case « Photo 7 » vide ne
 * reste sous les yeux d'une cliente.
 */
export function casesPleines(galerie: (string | null | undefined)[] | null | undefined, colonnes: number, max: number): number {
  /* Les photos d'affilée depuis la première case : une position refaite plus
     loin laisse des trous (useFeedsCreatifs ne compacte pas), et un trou
     serait une case vide. */
  const liste = galerie ?? [];
  const premierTrou = liste.findIndex((u) => !(typeof u === "string" && u.trim()));
  const n = Math.min(premierTrou === -1 ? liste.length : premierTrou, max);
  return Math.max(colonnes, Math.floor(n / colonnes) * colonnes);
}
