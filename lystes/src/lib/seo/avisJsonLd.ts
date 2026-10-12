/**
 * Balisage des avis pour les étoiles Google (lot 13, 12/10/2026).
 *
 * POURQUOI `Product` ET PLUS `Organization` NOTÉ : Google n'affiche pas
 * d'étoiles pour des avis qu'une entité recueille sur elle-même (« self-serving
 * reviews », consignes des extraits d'avis). La page d'avis d'une marque
 * balisait la marque elle-même avec une note : c'était exactement ce cas.
 * Les avis portent sur des PRODUITS : chaque produit noté devient un `Product`
 * avec son `aggregateRating` et ses `review`. L'`Organization` reste, sans note.
 *
 * DEUX RÈGLES DE GOOGLE TENUES ICI :
 * 1. Seuls les avis visibles sur la page sont balisés : l'appelant passe la
 *    liste qu'il affiche, rien d'autre.
 * 2. Pas de note sans avis : `aggregateRating` n'apparaît que si le nombre
 *    d'avis et la moyenne sont positifs (une note à zéro fait rejeter le bloc).
 *
 * Utilisé par les pages React (`BrandProductReviewPage`, `BrandReviewsPage`) et
 * par le pré-rendu (`scripts/generate-static-meta.ts`) : un seul dessin.
 */

export type AvisPourBalisage = {
  auteur: string;
  note: number;
  date?: string | null;
  titre?: string | null;
  texte: string;
};

export type ProduitPourBalisage = {
  nom: string;
  marque: string;
  url?: string | null;
  image?: string | null;
  description?: string | null;
  /** Moyenne des avis publiés VISIBLES sur la page. */
  moyenne: number;
  /** Nombre d'avis publiés sur lesquels porte la moyenne. */
  nombre: number;
  /** Les avis du produit visibles sur la page. */
  avis: AvisPourBalisage[];
};

/** Arrondi à une décimale, borné à l'échelle 1 à 5. */
function noteLisible(n: number): number {
  const borne = Math.min(5, Math.max(1, Number(n) || 0));
  return Math.round(borne * 10) / 10;
}

export function balisageAvis(a: AvisPourBalisage): Record<string, unknown> {
  return {
    "@type": "Review",
    author: { "@type": "Person", name: (a.auteur || "").trim() || "Client" },
    ...(a.date ? { datePublished: String(a.date).slice(0, 10) } : {}),
    reviewRating: {
      "@type": "Rating",
      ratingValue: noteLisible(a.note),
      bestRating: 5,
      worstRating: 1,
    },
    ...(a.titre ? { name: a.titre } : {}),
    reviewBody: String(a.texte ?? "").slice(0, 1000),
  };
}

/**
 * Un `Product` noté. Sans avis ni note, il ne porte ni `aggregateRating` ni
 * `review` : à l'appelant de ne pas l'émettre (`produitBalisable`).
 */
export function balisageProduit(p: ProduitPourBalisage, avecContexte = true): Record<string, unknown> {
  const avis = p.avis.filter((a) => a.texte && a.texte.trim() && a.note > 0);
  return {
    ...(avecContexte ? { "@context": "https://schema.org" } : {}),
    "@type": "Product",
    name: p.nom,
    ...(p.description ? { description: p.description } : {}),
    ...(p.image ? { image: [p.image] } : {}),
    ...(p.url ? { url: p.url } : {}),
    brand: { "@type": "Brand", name: p.marque },
    ...(p.nombre > 0 && p.moyenne > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: noteLisible(p.moyenne),
            reviewCount: p.nombre,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(avis.length > 0 ? { review: avis.slice(0, 10).map(balisageAvis) } : {}),
  };
}

/** Un produit ne mérite un balisage noté que s'il a au moins un avis publié. */
export function produitBalisable(p: Pick<ProduitPourBalisage, "nombre" | "moyenne">): boolean {
  return p.nombre > 0 && p.moyenne > 0;
}

/**
 * La page d'avis d'une marque : l'`Organization` SANS note, puis un `Product`
 * par produit noté visible sur la page, dans un seul `@graph`.
 */
export function balisagePageAvisMarque(opts: {
  marque: string;
  url: string;
  siteMarque?: string | null;
  logo?: string | null;
  produits: ProduitPourBalisage[];
}): Record<string, unknown> {
  const organisation: Record<string, unknown> = {
    "@type": "Organization",
    name: opts.marque,
    url: opts.url,
    ...(opts.siteMarque ? { sameAs: [opts.siteMarque] } : {}),
    ...(opts.logo ? { logo: opts.logo, image: opts.logo } : {}),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      organisation,
      ...opts.produits.filter(produitBalisable).map((p) => balisageProduit(p, false)),
    ],
  };
}

/**
 * Validateur local, aux champs que Google exige pour un extrait d'avis sur un
 * `Product`. Rend la liste des défauts ; vide = conforme.
 */
export function defautsProduitJsonLd(objet: unknown): string[] {
  const d: string[] = [];
  const p = objet as Record<string, unknown> | null;
  if (!p || typeof p !== "object") return ["pas un objet"];
  if (p["@type"] !== "Product") d.push("@type n'est pas Product");
  if (typeof p.name !== "string" || !p.name.trim()) d.push("name manquant");
  const agg = p.aggregateRating as Record<string, unknown> | undefined;
  const avis = p.review as Array<Record<string, unknown>> | undefined;
  if (!agg && !avis && !p.offers) d.push("ni aggregateRating, ni review, ni offers");
  if (agg) {
    if (agg["@type"] !== "AggregateRating") d.push("aggregateRating.@type");
    const v = Number(agg.ratingValue);
    if (!(v >= 1 && v <= 5)) d.push("aggregateRating.ratingValue hors de 1 à 5");
    const n = Number(agg.reviewCount ?? agg.ratingCount);
    if (!(n > 0)) d.push("aggregateRating sans reviewCount positif");
  }
  if (avis !== undefined) {
    if (!Array.isArray(avis) || avis.length === 0) d.push("review vide");
    else
      avis.forEach((r, i) => {
        if (r["@type"] !== "Review") d.push(`review[${i}].@type`);
        const auteur = r.author as Record<string, unknown> | undefined;
        if (!auteur || typeof auteur.name !== "string" || !auteur.name.trim()) d.push(`review[${i}].author.name`);
        const note = r.reviewRating as Record<string, unknown> | undefined;
        const v = Number(note?.ratingValue);
        if (!(v >= 1 && v <= 5)) d.push(`review[${i}].reviewRating.ratingValue`);
      });
  }
  return d;
}

/** Tous les `Product` d'un bloc JSON-LD (objet seul, tableau ou `@graph`). */
export function produitsDuJsonLd(bloc: unknown): unknown[] {
  if (Array.isArray(bloc)) return bloc.flatMap(produitsDuJsonLd);
  if (!bloc || typeof bloc !== "object") return [];
  const o = bloc as Record<string, unknown>;
  if (Array.isArray(o["@graph"])) return produitsDuJsonLd(o["@graph"]);
  return o["@type"] === "Product" ? [o] : [];
}

/** Un `Organization` ne doit plus porter de note (avis sur soi-même). */
export function organisationNotee(bloc: unknown): boolean {
  const liste = Array.isArray(bloc)
    ? bloc
    : bloc && typeof bloc === "object" && Array.isArray((bloc as Record<string, unknown>)["@graph"])
      ? ((bloc as Record<string, unknown>)["@graph"] as unknown[])
      : [bloc];
  return liste.some(
    (o) =>
      !!o &&
      typeof o === "object" &&
      (o as Record<string, unknown>)["@type"] === "Organization" &&
      ("aggregateRating" in (o as object) || "review" in (o as object)),
  );
}
