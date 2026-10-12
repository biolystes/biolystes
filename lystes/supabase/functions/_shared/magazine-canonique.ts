/**
 * UNE SEULE ADRESSE CANONIQUE PAR ARTICLE DE MAGAZINE (lot 11, 12/10/2026).
 *
 * Mesuré dans le plan du 12/10 (risque « Doublon de contenu ») : un article
 * vit à lystes.ai/<marque>/mag/<article> ET sur le site de la marque par le
 * shortcode [lystes_magazine]. Chaque copie se déclarait canonique : Google
 * voyait deux pages identiques qui se réclamaient chacune l'originale, et
 * choisissait seul, parfois la mauvaise.
 *
 * Règle : une seule canonique, la même dans les deux copies et dans les
 * données structurées.
 *   - Par défaut, lystes.ai (`lystes`) : la page y existe toujours, pré-rendue,
 *     et l'adresse ne dépend d'aucune page WordPress.
 *   - Réglage par marque `site_marque` (colonne
 *     account_landing_config.magazine_canonique, migration
 *     20261012201100) : l'adresse de l'article sur le site de la marque,
 *     SEULEMENT si elle est connue et sur un domaine de la marque. Sinon on
 *     retombe sur lystes.ai : une canonique vers une page qui n'existe pas
 *     serait pire que le doublon.
 *
 * Module pur, sans import : lu par la fonction `magazine-marque-public`, par
 * l'écran (ArticleMarquePage) et par les tests.
 */

export type ReglageCanonique = "lystes" | "site_marque";

export const REGLAGE_CANONIQUE_DEFAUT: ReglageCanonique = "lystes";

/** Toute valeur inconnue, absente ou illisible vaut lystes.ai. */
export function lireReglageCanonique(v: unknown): ReglageCanonique {
  return v === "site_marque" ? "site_marque" : REGLAGE_CANONIQUE_DEFAUT;
}

function hoteSansWww(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    if (u.username || u.password) return null;
    return u.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * L'adresse canonique de l'article.
 *
 * `hotesMarque` : les domaines de la marque (ceux de ses fiches produit, ou
 * de sa page Magazine signalée). Une adresse de la marque hors de ces
 * domaines est refusée : personne ne doit pouvoir faire déclarer à Lystes
 * une canonique vers un site tiers en passant une adresse dans la requête.
 */
export function canoniqueDeLArticle(p: {
  reglage: ReglageCanonique;
  urlLystes: string;
  adresseMarque?: string | null;
  hotesMarque?: Iterable<string>;
}): string {
  if (p.reglage !== "site_marque" || !p.adresseMarque) return p.urlLystes;
  const hote = hoteSansWww(p.adresseMarque);
  if (!hote || hote === "lystes.ai") return p.urlLystes;
  const permis = new Set([...(p.hotesMarque ?? [])].map((h) => h.toLowerCase().replace(/^www\./, "")));
  if (!permis.has(hote)) return p.urlLystes;
  if (p.adresseMarque.length > 2048) return p.urlLystes;
  return p.adresseMarque;
}
