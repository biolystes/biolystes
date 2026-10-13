import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Link } from "@lystes/lib/lien-lystes";
import { Helmet } from "react-helmet-async";
import {
  Loader2,
  ChevronRight,
  Check,
  ThumbsUp,
  Share,
  Flag,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight as ChevronRightArrow,
  ArrowUpRight,
  MessageSquare,
  Gift,
} from "lucide-react";
import { useBrandLanding, type BrandLandingResolved, type BrandProductCard } from "@lystes/hooks/useBrandLanding";
import { useBrandReviews, type BrandReviewsAggregate } from "@lystes/hooks/useBrandReviews";
import LandingHeader from "@lystes/features/landing-particuliers/components/public/LandingHeader";
import { BrandLandingProvider } from "@lystes/contexts/BrandLandingContext";
import BrandProductsCarousel from "@lystes/features/landing-particuliers/components/BrandProductsCarousel";
import "@lystes/features/landing-particuliers/styles.css";
import { buildBrandReviewsMeta } from "@lystes/lib/seo/brandMeta";
import { deMarque } from "@lystes/lib/elision";

import { TrustpilotStars } from "@lystes/components/reviews/TrustpilotStars";
import { ReviewSubmitForm } from "@lystes/components/reviews/ReviewSubmitForm";
import { ProductAgentInlineChat } from "@lystes/components/brand/ProductAgentInlineChat";
import { balisagePageAvisMarque, type ProduitPourBalisage } from "@lystes/lib/seo/avisJsonLd";
import { ajouterSuivi } from "@lystes/lib/lienSuivi";
import { Button } from "@lystes/components/ui/button";
import valtheaShot2 from "@lystes/assets/reviews/valthea-shot-2.png";
import valtheaShot3 from "@lystes/assets/reviews/valthea-shot-3.png";
import valtheaShot4 from "@lystes/assets/reviews/valthea-shot-4.png";
import valtheaShot5 from "@lystes/assets/reviews/valthea-shot-5.png";
import valtheaShot6 from "@lystes/assets/reviews/valthea-shot-6.png";

const VALTHEA_SHOT_IMAGES = [valtheaShot2, valtheaShot3, valtheaShot4, valtheaShot5, valtheaShot6];

/** Avis affichés avant « Voir plus d'avis » : ce sont eux que le balisage déclare. */
const AVIS_PAR_PAGE = 8;

function StarsRow({ rating, className = "w-4 h-4" }: { rating: number; className?: string }) {
  const sizeMap: Record<string, number> = { "w-3 h-3": 12, "w-4 h-4": 16, "w-5 h-5": 20, "w-6 h-6": 24 };
  const size = sizeMap[className] ?? 16;
  return <TrustpilotStars rating={rating} size={size} />;
}

/**
 * CE QUI A ÉTÉ RETIRÉ DE CETTE PAGE, ET POURQUOI
 *
 * Elle portait quatre inventions, servies à des visiteurs sur les pages
 * publiques de 44 marques clientes :
 *
 *   REVIEWS_POOL    huit avis écrits en dur, noms, dates, « achat vérifié »,
 *                   affichés dès que la base ne renvoyait rien
 *   DISTRIBUTION    une répartition d'étoiles fixe, 84 % de 5 étoiles
 *   POPULAR_TAGS    des « mentions populaires » qui ne venaient d'aucun avis
 *   fallbackAvg     une note dérivée des notes produits, elles-mêmes issues
 *                   des notes produits, sans mesure
 *
 * Aucune n'a de raison d'exister : présenter des avis inventés comme vérifiés
 * est une pratique commerciale trompeuse, et le risque ne s'arrête pas à cette
 * page, une action manuelle de Google frappe le domaine entier.
 *
 * CE QUI LES REMPLACE, et c'est le point qui compte pour la marque : rien.
 * Pas de compteur à zéro, pas d'étoiles grises, pas d'encart « aucun avis ».
 * Cinq étoiles vides se lisent comme une très mauvaise note, c'est pire que
 * rien. L'absence d'un bloc est neutre, un bloc vide est négatif.
 *
 * La page mène donc avec ce qui est vrai ET valorisant : les produits réels de
 * la marque, leurs images, leurs descriptions, le lien vers sa boutique. Une
 * page qui liste douze produits avec leurs vraies descriptions est plus
 * substantielle, plus utile et plus flatteuse que huit faux témoignages. Et
 * elle répond à l'intention de qui tape « <marque> avis » : se faire une
 * opinion.
 */

type Review = {
  id: number;
  author: string;
  initials: string;
  date: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  productSlug?: string;
  productName?: string;
  /** Réponse de la marque, telle qu'elle est en base. La page affichait
   *  jusqu'ici une phrase de remerciement écrite en dur à sa place. */
  reply?: string | null;
  /** Avis d'une testeuse (02/10/2026) : « Produit offert », exigence légale. */
  offert?: boolean;
  /** Avis fictif de présentation : la mention « Démonstration » s'affiche. */
  demo?: boolean;
  location?: string | null;
  publishedAt?: string;
};

export default function BrandReviewsPage() {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const { data, loading, notFound } = useBrandLanding(brandSlug);
  const avis = useBrandReviews({
    accountId: data?.accountId,
  });

  if (loading) {
    return (
      <div className="particuliers-scope min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
      </div>
    );
  }
  if (notFound || !data) return <Navigate to="/" replace />;

  // La note vient des avis publiés ou n'existe pas. Aucune valeur de repli :
  // une moyenne dérivée des notes produits n'a jamais rien mesuré.
  const url = `https://lystes.ai/${data.slug}/avis`;
  const { title, description } = buildBrandReviewsMeta({
    brandName: data.brandName,
  });
  const ogImage = data.products[0]?.image_url ?? data.heroProducts[0]?.image_url;

  /**
   * Lot 13 (12/10/2026) : les étoiles Google.
   *
   * Avant, la marque se notait elle-même (`Organization` + `aggregateRating`).
   * Google n'affiche pas d'étoiles pour des avis qu'une entité recueille sur
   * elle-même. Les avis portent sur des produits : chaque produit noté devient
   * un `Product` avec sa note et ses avis, l'`Organization` reste sans note.
   *
   * Seul ce qui est visible est balisé : la note d'un produit est celle de sa
   * carte (`parProduit` de `VueAvisMarque`, mêmes avis chargés), et ses avis
   * sont ceux de la première page de la liste (les 8 plus récents).
   */
  const visibles = [...avis.reviews]
    .sort((x, y) => (y.published_at ?? "").localeCompare(x.published_at ?? ""))
    .slice(0, AVIS_PAR_PAGE);
  const produitsNotes: ProduitPourBalisage[] = data.products
    .map((p) => {
      const siens = avis.reviews.filter((r) => r.product_id === p.id);
      return {
        nom: p.name,
        marque: data.brandName,
        url: `https://lystes.ai/${data.slug}/${p.slug}`,
        image: p.image_url || null,
        description: p.tagline ?? null,
        nombre: siens.length,
        moyenne: siens.length ? siens.reduce((t, r) => t + r.rating, 0) / siens.length : 0,
        avis: visibles
          .filter((r) => r.product_id === p.id)
          .map((r) => ({ auteur: r.author_name, note: r.rating, date: r.published_at, titre: r.title, texte: r.content })),
      };
    })
    .filter((p) => p.nombre > 0);
  const brandSchema = balisagePageAvisMarque({
    marque: data.brandName,
    url,
    siteMarque: data.websiteUrl ?? null,
    logo: ogImage ?? null,
    produits: produitsNotes,
  });
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://lystes.ai/" },
      { "@type": "ListItem", position: 2, name: data.brandName, item: `https://lystes.ai/${data.slug}` },
      { "@type": "ListItem", position: 3, name: "Avis clients", item: url },
    ],
  };

  return (
    <VueAvisMarque
      data={data}
      avis={avis}
      tete={
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            {ogImage && <meta property="og:image" content={ogImage} />}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {ogImage && <meta name="twitter:image" content={ogImage} />}
            <script type="application/ld+json">{JSON.stringify(brandSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        </Helmet>
      }
    />
  );
}

/**
 * La page d'avis telle qu'elle s'affiche, sans rien lire en base : la page la
 * nourrit de ce qu'elle a chargé, la visite « Vos outils » de l'accueil
 * (12/10/2026) de ses données de démonstration. Un seul dessin pour les deux.
 * `demo` : pas de formulaire d'avis (il interroge le serveur dès son
 * affichage), il est hors de l'écran de la visite.
 */
export function VueAvisMarque({
  data,
  avis,
  tete,
  demo = false,
}: {
  data: BrandLandingResolved;
  avis: Pick<BrandReviewsAggregate, "reviews" | "avgRating" | "totalCount" | "totalAffiche" | "distribution">;
  tete?: ReactNode;
  demo?: boolean;
}) {
  const dbReviews = avis.reviews;
  const [searchVal, setSearchVal] = useState("");
  const [sort, setSort] = useState<"recent" | "rating">("recent");
  const [visible, setVisible] = useState(AVIS_PAR_PAGE);
  const [activeSlide, setActiveSlide] = useState(0);

  // Tous les avis publiés sont affichés et comptent, sans distinction.
  const reviews: Review[] = useMemo(
    () =>
      dbReviews.map((r) => {
        const product = data?.products?.find((p) => p.id === r.product_id);
        return {
          id: r.id as unknown as number,
          author: r.author_name,
          initials: r.initials,
          date: r.date_label,
          rating: r.rating,
          title: r.title ?? "",
          content: r.content,
          verified: r.verified_purchase,
          productSlug: product?.slug,
          productName: product?.name,
          location: r.location,
          publishedAt: r.published_at,
          reply: r.brand_reply,
          offert: r.produit_offert,
          demo: r.provenance === "demo",
        };
      }),
    [dbReviews, data],
  );

  const bannerSlides = useMemo(() => {
    if (!data) return [];
    return dbReviews
      .filter((review) => review.product_id)
      .map((review) => {
        const product = data.products.find((item) => item.id === review.product_id);
        return product ? { review, product } : null;
      })
      .filter((slide): slide is NonNullable<typeof slide> => Boolean(slide))
      .filter((slide, index, slides) => slides.findIndex((item) => item.product.id === slide.product.id) === index)
      .slice(0, 5);
  }, [data, dbReviews]);

  useEffect(() => {
    if (bannerSlides.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % bannerSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [bannerSlides.length]);

  useEffect(() => {
    if (activeSlide >= bannerSlides.length) setActiveSlide(0);
  }, [activeSlide, bannerSlides.length]);


  const avisReels = avis.totalCount > 0;
  const avgRating = avis.avgRating;
  const totalReviews = avis.totalCount;
  const distribution = avis.distribution;
  /** Y a-t-il quelque chose à lire. */
  const aDesAvis = avis.totalAffiche > 0;

  const filtered = reviews.filter((r) => {
    const q = searchVal.trim().toLowerCase();
    if (!q) return true;
    return (
      r.title.toLowerCase().includes(q) ||
      r.content.toLowerCase().includes(q) ||
      (r.productName ?? "").toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q)
    );
  }).sort((a, b) =>
    sort === "rating"
      ? b.rating - a.rating
      : (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  );

  /** Avis réels par produit : rien n'est affiché pour un produit sans avis. */
  const parProduit = new Map<string, { n: number; somme: number }>();
  for (const r of dbReviews) {
    if (!r.product_id) continue;
    const e = parProduit.get(r.product_id) ?? { n: 0, somme: 0 };
    e.n += 1;
    e.somme += r.rating;
    parProduit.set(r.product_id, e);
  }

  return (
    <BrandLandingProvider value={data}>
    <div className="particuliers-scope min-h-screen bg-white text-black">
      {tete}
      <LandingHeader />

      {/* BANNIÈRE AVIS — le diaporama ne montre que des produits et avis présents en base. */}
      <section className="border-y border-stone-200 bg-stone-50">
        {bannerSlides.length > 0 ? (() => {
          const slide = bannerSlides[activeSlide];
          if (!slide) return null;
          // Photos de fond : shots Valthéa, sinon les vraies photos produits de la marque
          // (le produit de l'avis en premier), répétées pour remplir 5 cases.
          const productImages = Array.from(new Set([
            slide.product.image_url,
            ...data.products.map((p: BrandProductCard) => p.image_url),
          ].filter((u): u is string => Boolean(u))));
          const sourceImages = data.slug === "valtheaparis" ? VALTHEA_SHOT_IMAGES : productImages;
          const hasValtheaShots = sourceImages.length > 0;
          const shotStrip = Array.from({ length: 5 }, (_, offset) =>
            sourceImages[(data.slug === "valtheaparis" ? activeSlide + offset : offset) % sourceImages.length],
          );
          return (
            <div className="relative mx-auto min-h-[170px] max-w-[1600px] overflow-hidden md:min-h-[200px]">
              {hasValtheaShots ? (
                <div
                  key={`shot-${activeSlide}`}
                  className="absolute inset-0 grid grid-cols-5 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
                  aria-hidden="true"
                >
                  {shotStrip.map((image, index) => (
                    <img key={`${image}-${index}`} src={image} alt="" className="h-full min-w-0 w-full object-cover" />
                  ))}
                </div>
              ) : (
                <img
                  key={slide.product.id}
                  src={slide.product.image_url}
                  alt={slide.product.name}
                  className="absolute inset-0 h-full w-full object-cover object-center motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
                />
              )}
              {/* L'aplat est une teinte plate, posée sur tout le slide : le
                  texte blanc doit rester lisible au-dessus de n'importe quelle
                  image, y compris à droite où le dégradé s'éteignait. */}
              <div className="absolute inset-0 bg-black/55" />
              {/* Les pastilles et les flèches sont désormais dans le bloc de
                  texte, juste au-dessus des pilules : la colonne n'a donc plus
                  besoin d'une grande réserve en bas sur petit écran. */}
              <div className="relative z-10 flex min-h-[170px] max-w-3xl flex-col justify-end px-6 pt-3 pb-3 text-white md:min-h-[200px] md:px-16 md:pt-[76px] md:pb-[60px]">
                {/* Marque, note et nombre d'avis tiennent sur une seule ligne. */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <div className="flex h-7 w-7 items-center justify-center bg-white text-[11px] font-semibold text-black">
                    {data.brandName.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm font-semibold">{data.brandName}</p>
                  {avisReels && (
                    <span className="flex items-center gap-2">
                      <TrustpilotStars rating={avgRating} size={14} tone="white" />
                      <span className="text-xs text-white/80">{avgRating.toFixed(1)} · {totalReviews} avis</span>
                    </span>
                  )}
                </div>
                 <p className="pt-[33px] pb-[4px] text-[9px] font-semibold uppercase tracking-wider text-white/70">Avis sur {slide.product.name}</p>
                <h1 className="mt-1 max-w-2xl text-base font-semibold leading-snug tracking-tight md:text-xl">
                  {slide.review.title || slide.review.content}
                </h1>
                {slide.review.title && (
                   <p className="mt-1.5 line-clamp-2 max-w-xl text-xs leading-relaxed text-white/80 md:text-sm">{slide.review.content}</p>
                )}
                {/* La coche « Achat vérifié » de la liste figure aussi dans le
                    slide, peinte en blanc pour rester lisible sur la photo. */}
                <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-[11px] text-white/80">
                  <span>{slide.review.author_name}</span>
                  {slide.review.verified_purchase && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Check className="h-3 w-3 text-white" /> Achat vérifié
                      </span>
                    </>
                  )}
                  {slide.review.provenance === "demo" && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>Démonstration</span>
                    </>
                  )}
                </p>
                {/* Pastilles et flèches : une ligne à part, à gauche, posée
                    juste au-dessus des pilules. */}
                {bannerSlides.length > 1 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="mr-1 flex items-center gap-1.5">
                      {bannerSlides.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          aria-label={`Aller à l'avis ${index + 1}`}
                          onClick={() => setActiveSlide(index)}
                          className={`h-1.5 w-1.5 rounded-full transition-colors ${index === activeSlide ? "bg-white" : "bg-white/40 hover:bg-white/70"}`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-0">
                      <button
                        type="button"
                        aria-label="Avis précédent"
                        className="shrink-0 bg-transparent p-0 leading-none text-white/90 transition-opacity hover:text-white"
                        onClick={() => setActiveSlide((current) => (current - 1 + bannerSlides.length) % bannerSlides.length)}
                      >
                        <ChevronLeft className="h-[13px] w-[13px] md:h-[15px] md:w-[15px]" />
                      </button>
                      <button
                        type="button"
                        aria-label="Avis suivant"
                        className="-ml-1 shrink-0 bg-transparent p-0 leading-none text-white/90 transition-opacity hover:text-white"
                        onClick={() => setActiveSlide((current) => (current + 1) % bannerSlides.length)}
                      >
                        <ChevronRightArrow className="h-[13px] w-[13px] md:h-[15px] md:w-[15px]" />
                      </button>
                    </div>
                  </div>
                )}
                {/* Deux pilules, les mêmes que sur la page d'accueil : la noire
                    mène au formulaire d'avis, la seconde au site du marchand.
                    classes lyr- de styles.css (copie des pilules lyh- de
                    l'accueil, qui n'est pas monté ici). */}
                <div className="lyr-btns mt-2">
                  <a className="lyr-btn-black" href="#ecrire-un-avis">
                    <span>Laisser un avis</span>
                    <span className="lyr-arrow" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 7h10v10" />
                        <path d="M7 17 17 7" />
                      </svg>
                    </span>
                  </a>
                  {data.websiteUrl && (
                    <a className="lyr-btn-outline" href={ajouterSuivi(data.websiteUrl, "avis", data.slug)} target="_blank" rel="noopener noreferrer">
                      <span>Voir le site</span>
                      <span className="lyr-arrow" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M7 7h10v10" />
                          <path d="M7 17 17 7" />
                        </svg>
                      </span>
                    </a>
                  )}
                </div>
              </div>

            </div>
          );
        })() : (
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-stone-500">{data.brandName}</p>
              <h1 className="mt-2 font-editorial text-4xl font-normal">Avis clients</h1>
            </div>
            <Button asChild className="h-12 w-fit rounded-full px-6">
              <a href="#ecrire-un-avis">Laisser un avis <ArrowUpRight className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
        )}
      </section>

      {/* PRODUITS */}
      {data.products.length > 0 && (
        <section>
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-6">
              <h2 className="text-xl font-semibold tracking-tight">Produits {data.brandName}</h2>
              <p className="mt-1 text-sm text-stone-500">
                {data.products.length} produits : cliquez pour voir la fiche et ses avis
              </p>
            </div>
            <div className="-mx-6 flex snap-x snap-mandatory gap-2 overflow-x-auto bg-stone-50 px-6 py-4">
              {data.products.map((p: BrandProductCard) => {
                const st = parProduit.get(p.id);
                const moy = st ? st.somme / st.n : 0;
                return (
                  <Link
                    key={p.slug}
                    to={`/${data.slug}/${p.slug}`}
                    className="group flex w-[46%] shrink-0 snap-start flex-col rounded-[11px] bg-white p-[11px] sm:w-[31%] md:w-[23%] lg:w-[18.5%]"
                  >
                    <div className="aspect-[4/5.9] max-h-[242px] overflow-hidden bg-white">
                      <img src={p.image_url} alt={p.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                    <div className="mt-4 flex-1 px-1">
                      <h3 className="line-clamp-2 text-sm font-medium leading-snug">{p.name}</h3>
                    </div>
                    <div className="mt-3 mb-2 flex items-center justify-between px-1">
                      {st ? (
                        <>
                          <div className="flex items-center gap-1.5">
                            <StarsRow rating={moy} className="w-3 h-3" />
                            <span className="text-xs font-medium tabular-nums">{moy.toFixed(1)}</span>
                          </div>
                          <span className="text-[11px] text-stone-500">{st.n} avis</span>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-stone-500 group-hover:text-black">
                          Voir la fiche <ArrowUpRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Lot 13 : le chat de la marque, comme sur la page avis d'un produit.
          Pas dans la visite de démonstration : il interroge le serveur. */}
      {!demo && data.accountId && (
        <ProductAgentInlineChat accountId={data.accountId} brandName={data.brandName} />
      )}

      {/* DEUX COLONNES */}
      <main className={`mx-auto grid max-w-7xl grid-cols-1 gap-px bg-stone-100 ${avisReels ? "lg:grid-cols-[320px_1fr]" : ""}`}>
        {avisReels && (
          <aside className="space-y-10 bg-white p-8">
            <div>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
                Répartition des notes
              </h2>
              <div className="space-y-2">
                {distribution.map((d) => (
                  <div key={d.stars} className="flex items-center gap-3 text-xs">
                    <span className="w-14 text-stone-500">{d.stars} étoiles</span>
                    <div className="h-1.5 flex-1 bg-stone-100">
                      <div className="h-full bg-black" style={{ width: `${d.pct}%` }} />
                    </div>
                    <span className="w-8 text-right tabular-nums text-stone-500">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}

        <section className="bg-white p-8">
          {aDesAvis && (
            <>
              <div className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3 bg-stone-100 px-4">
                  <Search className="h-4 w-4 text-stone-500" />
                  <input
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Rechercher dans les avis…"
                    className="h-10 w-full border-0 bg-transparent text-sm outline-none placeholder:text-stone-500"
                  />
                </div>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as typeof sort)}
                    className="w-full appearance-none border-0 bg-stone-100 py-2.5 pl-4 pr-10 text-sm"
                  >
                    <option value="recent">Les plus récents</option>
                    <option value="rating">Meilleure note</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-px bg-stone-100">
                {filtered.slice(0, visible).map((r) => (
                  <article key={r.id} className="bg-white py-8 first:pt-0">
                    <header className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center bg-stone-100 text-xs font-semibold">
                          {r.initials}
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {r.author}
                            {r.location && <span className="font-normal text-stone-500"> · {r.location}</span>}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500">
                            <span>{r.date}</span>
                            {r.verified && (
                              <span className="inline-flex items-center gap-1"><Check className="h-3 w-3" /> Achat vérifié</span>
                            )}
                            {r.offert && (
                              <span className="inline-flex items-center gap-1"><Gift className="h-3 w-3" /> Produit offert</span>
                            )}
                            {r.demo && (
                              <span className="inline-flex items-center gap-1">Démonstration</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <StarsRow rating={r.rating} className="w-4 h-4" />
                    </header>
                    {r.productSlug && r.productName && (
                      <Link
                        to={`/${data.slug}/${r.productSlug}`}
                        className="mb-2 inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-stone-500 hover:text-black"
                      >
                        {r.productName} <ChevronRight className="h-3 w-3" />
                      </Link>
                    )}
                      <div className="mb-4">
                        {/* Le titre d'avis se cite entre guillemets, comme dans
                            la bannière. */}
                        {r.title && <h3 className="text-base font-semibold tracking-tight">{r.title}</h3>}
                        <p className="mt-2 text-sm leading-relaxed text-stone-600">{r.content}</p>
                      </div>
                    {r.reply && (
                      <div className="mb-4 bg-stone-100 p-5">
                        <div className="mb-2 inline-flex items-center gap-2 text-xs font-medium">
                          <MessageSquare className="h-3.5 w-3.5" /> Réponse {deMarque(data.brandName)}
                        </div>
                        <p className="text-sm leading-relaxed text-stone-600">{r.reply}</p>
                      </div>
                    )}
                  </article>
                ))}
              </div>

              {visible < filtered.length && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + 8)}
                    className="bg-stone-100 px-6 py-3 text-sm font-medium hover:bg-stone-200"
                  >
                    Voir plus d'avis
                  </button>
                </div>
              )}
            </>
          )}

          <div id="ecrire-un-avis" className={aDesAvis ? "mt-12" : ""}>
            {!aDesAvis && (
              <h2 className="mb-2 text-2xl font-semibold tracking-tight">
                Partagez votre expérience avec {data.brandName}
              </h2>
            )}
            {!demo && <ReviewSubmitForm accountId={data.accountId} />}
          </div>
        </section>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-stone-500">
        <Link to="/legal" className="hover:text-black">Mentions</Link>
        <span className="mx-2">·</span>
        <Link to="/p/confidentialite" className="hover:text-black">Confidentialité</Link>
        <span className="mx-2">·</span>
        <Link to="/p/cgu" className="hover:text-black">CGU</Link>
      </footer>
    </div>
    </BrandLandingProvider>
  );
}
