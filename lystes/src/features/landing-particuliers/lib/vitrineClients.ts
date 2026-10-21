/**
 * Photos des marques clientes dont le site est en ligne, pour les bandes et
 * carrousels « nos clientes » : Valthéa Paris, Éclose Paris, Jhouny's Secret.
 * Packshots repris des boutiques (valtheaparis.com, ecloseparis.com,
 * jhounysecret.com). Remplacent, depuis le 21/10/2026, les visuels de deux
 * marques dont les sites ne sont plus en ligne.
 */
const photo = (nom: string) => `/images/clients/${nom}.jpg`;

export const valthea = (n: number) => photo(`valthea-${n}`);
export const eclose = (n: number) => photo(`eclose-${n}`);
export const jhouny = (n: number) => photo(`jhouny-${n}`);

/** Rangée de packshots Valthéa (remplace l'ancienne rangée de huit visuels). */
export const rangeeValthea = [1, 2, 3, 4, 5, 6].map(valthea);

/**
 * Maquettes de fiche produit (grande image + quatre vignettes) : des visuels
 * qui n'apparaissent pas dans les rangées ci-dessus, pour qu'une même page ne
 * montre jamais deux fois la même photo.
 */
export const ficheMaquette = {
  grande: valthea(7),
  vignettes: [valthea(8), valthea(9), valthea(10), valthea(11)],
};

/** Rangée de packshots Éclose (remplace l'ancienne rangée de six visuels). */
export const rangeeEclose = [1, 2, 3, 4, 5].map(eclose);

/** Tuiles produit des maquettes « hub d'avis » (quatre visuels). */
export const tuilesMaquette = [7, 8, 9, 10].map(valthea);

/** Seconde maquette de fiche produit, pour une page qui montre aussi `tuilesMaquette`. */
export const ficheMaquetteB = {
  grande: valthea(11),
  vignettes: [valthea(12), jhouny(1), jhouny(2), jhouny(3)],
};
