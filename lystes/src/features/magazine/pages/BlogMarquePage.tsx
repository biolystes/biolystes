import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Link } from "@lystes/lib/lien-lystes";
import { Helmet } from "react-helmet-async";
import { chargerArticlesMarque, type ArticleMarque } from "../lib/api-marque";
import { useBrandLanding } from "@lystes/hooks/useBrandLanding";
import { canoniqueMagazine, cheminArticle } from "../lib/adresses";

/*
 * Le magazine par marque : lystes.ai/<marque>/mag (02/10/2026 ; les
 * anciennes adresses /<marque>/blog et /blog/<marque> y mènent).
 * Portage de la maquette Elunesse fournie par JP (03/08/2026) : masthead serif
 * géant, fond ivoire, cartes 4/5, filets fins — plus la top barre promo noire
 * dynamique et la mise en avant « titre + call to action ».
 * Convention de rattachement : un article appartient à la marque quand son
 * tableau `tags` contient le slug de la marque.
 *
 * 01/10/2026 : la page lit enfin les articles de la rédaction de marque
 * (`brand_magazine_articles`, ceux de l'agence de journalistes), plus les
 * anciens rattachés par étiquette, avec le filtre fait par la base (voir
 * lib/api-marque.ts). Chaque article s'ouvre sous la marque,
 * /<marque>/blog/<article>, et la canonique est /<marque>/blog. Mise en page
 * et textes inchangés.
 */

const IVOIRE = "#f5f3ee";
const ENCRE = "#0d0d0d";
const SERIF = '"Inter", "Satoshi", sans-serif';

function nomDepuisSlug(slug: string) {
  return slug
    .split(/[-_]/)
    .map((m) => (m ? m[0].toUpperCase() + m.slice(1) : m))
    .join(" ");
}

export default function BlogMarquePage() {
  const { brandSlug = "" } = useParams();
  const { data: marqueReelle } = useBrandLanding(brandSlug);
  // Le nom réel du compte prime ; le slug décodé n'est qu'un repli.
  const marque = marqueReelle?.brandName ?? nomDepuisSlug(brandSlug);
  const [articles, setArticles] = useState<ArticleMarque[] | null>(null);

  useEffect(() => {
    let actif = true;
    chargerArticlesMarque(brandSlug)
      .then((liste) => actif && setArticles(liste))
      .catch(() => actif && setArticles([]));
    return () => {
      actif = false;
    };
  }, [brandSlug]);

  const canonique = canoniqueMagazine(brandSlug);
  const description = `Le magazine ${marque} : conseils, coulisses et expertises de la marque, publiés par son équipe.`;


  return (
    <VueMagazineMarque
      marque={marque}
      brandSlug={brandSlug}
      articles={articles}
      tete={
          <Helmet>
            <title>{`Le magazine ${marque}`}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonique} />
            <meta property="og:title" content={`Le magazine ${marque}`} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonique} />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
              rel="stylesheet"
            />
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Blog",
                name: `Le magazine ${marque}`,
                url: canonique,
                description,
              })}
            </script>
          </Helmet>
      }
    />
  );
}

/**
 * Le magazine tel qu'il s'affiche, sans rien lire en base : la page le nourrit
 * des articles chargés, la visite « Vos outils » de l'accueil (12/10/2026) de
 * ses articles de démonstration. Un seul dessin pour les deux.
 */
export function VueMagazineMarque({
  marque,
  brandSlug,
  articles,
  tete,
  bandeau,
  entreprise = false,
}: {
  marque: string;
  brandSlug: string;
  /** `null` : la lecture est en cours. */
  articles: Pick<ArticleMarque, "id" | "slug" | "title" | "dek" | "excerpt" | "hero_image_url" | "hero_image_alt" | "featured">[] | null;
  tete?: ReactNode;
  /** La phrase du bandeau noir ; par défaut, celle d'une boutique. */
  bandeau?: string;
  /** Une entreprise sans boutique (version Entreprises, 12/10/2026) : « le
   *  site » au lieu de « la boutique ». */
  entreprise?: boolean;
}) {
  const aLaUne = articles?.find((a) => a.featured) ?? articles?.[0] ?? null;
  const reste = (articles ?? []).filter((a) => a.id !== aLaUne?.id);
  const lienArticle = (slug: string) => cheminArticle(brandSlug, slug);

  return (
    <div className="min-h-screen" style={{ background: IVOIRE, color: ENCRE }}>
      {tete}

      {/* Top barre promo — noire, dynamique, minimaliste comme lystes.ai */}
      <Link
        to={`/${brandSlug}`}
        className="block w-full text-center py-2.5 px-4 text-[11px] tracking-[0.28em] uppercase"
        style={{ background: ENCRE, color: IVOIRE }}
      >
        {marque}&nbsp;: {bandeau ?? "découvrez la boutique et ses nouveautés"}{" "}
        <span aria-hidden="true">→</span>
      </Link>

      {/* Masthead */}
      <header style={{ background: IVOIRE }}>
        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 pt-10 pb-8 text-center">
          <span
            className="block leading-none"
            style={{
              fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(45px, 1vw, 160px)",
              letterSpacing: "-0.04em",
            }}
          >
            {marque}
          </span>
          <span className="block text-[10px] tracking-[0.5em] uppercase" style={{ color: "#2d2d2d", marginTop: 5 }}>
            Le magazine
          </span>
        </div>
        <div style={{ borderTop: "1px solid rgba(13,13,13,.15)", borderBottom: "1px solid rgba(13,13,13,.15)" }}>
          <div className="max-w-[1100px] mx-auto px-5 sm:px-8 flex items-center justify-center gap-x-8 py-4 text-[11px] tracking-[0.22em] uppercase">
            <span className="font-semibold">Sommaire</span>
            <Link to={`/${brandSlug}`} className="hover:opacity-60" style={{ color: "#2d2d2d" }}>
              {entreprise ? "Le site" : "La boutique"}
            </Link>
            <a href="https://lystes.ai" className="hover:opacity-60" style={{ color: "#2d2d2d" }}>
              Lystes AI
            </a>
          </div>
        </div>
      </header>

      <main>
        {articles === null ? (
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-28 text-center text-[13px] tracking-[0.2em] uppercase" style={{ color: "#2d2d2d" }}>
            Chargement…
          </div>
        ) : aLaUne ? (
          <>
            {/* À la une — gros titre + call to action */}
            <section className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-16 pb-20" style={{ borderBottom: "1px solid rgba(13,13,13,.15)" }}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                <Link to={lienArticle(aLaUne.slug)} className="lg:col-span-8 block group">
                  <div className="aspect-[4/5] overflow-hidden" style={{ background: "#e8e4dd" }}>
                    {aLaUne.hero_image_url && (
                      <img
                        alt={aLaUne.hero_image_alt ?? aLaUne.title}
                        src={aLaUne.hero_image_url}
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
                      />
                    )}
                  </div>
                </Link>
                <div className="lg:col-span-4 lg:pt-16">
                  <div className="flex items-center gap-4 mb-8">
                    <span className="text-[11px] tracking-[0.4em] uppercase font-semibold">À la une</span>
                    <div className="h-px flex-1" style={{ background: "rgba(13,13,13,.25)" }} />
                  </div>
                  <h1
                    className="text-[40px] sm:text-[56px] lg:text-[64px] leading-[0.98] [text-wrap:balance]"
                    style={{ fontFamily: SERIF, fontWeight: 400, letterSpacing: "-0.015em" }}
                  >
                    <Link to={lienArticle(aLaUne.slug)}>{aLaUne.title}</Link>
                  </h1>
                  {aLaUne.dek && (
                    <p className="mt-8 text-[16px] leading-[1.65] font-light" style={{ color: "#2d2d2d" }}>
                      {aLaUne.dek}
                    </p>
                  )}
                  <Link
                    to={lienArticle(aLaUne.slug)}
                    className="inline-block mt-10 px-9 py-4 text-[11px] tracking-[0.32em] uppercase font-semibold transition-colors"
                    style={{ background: ENCRE, color: IVOIRE }}
                  >
                    Lire l'article
                  </Link>
                </div>
              </div>
            </section>

            {/* La grille */}
            {reste.length > 0 && (
              <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {reste.map((a) => (
                    <Link key={a.id} to={lienArticle(a.slug)} className="group block">
                      <div className="aspect-[4/5] overflow-hidden" style={{ background: "#e8e4dd" }}>
                        {a.hero_image_url && (
                          <img
                            alt={a.hero_image_alt ?? a.title}
                            src={a.hero_image_url}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                          />
                        )}
                      </div>
                      <div className="pt-5">
                        <h3
                          className="text-[24px] sm:text-[28px] leading-[1.08] [text-wrap:balance]"
                          style={{ fontFamily: SERIF, fontWeight: 400, letterSpacing: "-0.01em" }}
                        >
                          {a.title}
                        </h3>
                        {a.excerpt && (
                          <p className="mt-3 text-[14px] leading-[1.6] font-light line-clamp-3" style={{ color: "#2d2d2d" }}>
                            {a.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          /* État vide honnête — jamais de faux articles */
          <section className="max-w-[820px] mx-auto px-5 sm:px-8 py-32 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-6" style={{ color: "#2d2d2d" }}>
              Bientôt
            </p>
            <h1
              className="text-[44px] sm:text-[64px] leading-[1]"
              style={{ fontFamily: SERIF, fontWeight: 400, letterSpacing: "-0.015em" }}
            >
              Le magazine <i>{marque}</i> arrive.
            </h1>
            <p className="mt-7 text-[15px] leading-[1.65] font-light max-w-md mx-auto" style={{ color: "#2d2d2d" }}>
              Conseils, coulisses et expertises de la marque, publiés ici très prochainement.
            </p>
            <Link
              to={`/${brandSlug}`}
              className="inline-block mt-10 px-9 py-4 text-[11px] tracking-[0.32em] uppercase font-semibold"
              style={{ background: ENCRE, color: IVOIRE }}
            >
              {entreprise ? "Visiter le site" : "Visiter la boutique"}
            </Link>
          </section>
        )}

        {/* CTA Lystes AI — repris de la maquette */}
        <section className="max-w-[1100px] mx-auto px-5 sm:px-8 py-24 text-center" style={{ borderTop: "1px solid rgba(13,13,13,.15)" }}>
          <p className="text-[10px] tracking-[0.4em] uppercase font-semibold mb-5" style={{ color: "#2d2d2d" }}>
            Aller plus loin
          </p>
          <h2
            className="text-[40px] sm:text-[64px] leading-[1]"
            style={{ fontFamily: SERIF, fontWeight: 400, letterSpacing: "-0.02em" }}
          >
            Découvrez <i>Lystes AI</i>
          </h2>
          <a
            href="https://lystes.ai"
            className="inline-block mt-10 px-10 py-4 text-[11px] tracking-[0.32em] uppercase font-semibold"
            style={{ background: ENCRE, color: IVOIRE }}
          >
            Essayer Lystes AI
          </a>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid rgba(13,13,13,.15)" }}>
        <div className="py-6 text-center text-[10px] tracking-[0.32em] uppercase" style={{ color: "#2d2d2d" }}>
          © {new Date().getFullYear()} {marque} · propulsé par Lystes
        </div>
      </footer>
    </div>
  );
}
