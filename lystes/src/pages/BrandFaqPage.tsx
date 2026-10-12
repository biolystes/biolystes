import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Link } from "@lystes/lib/lien-lystes";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Loader2 } from "lucide-react";

import { supabase } from "@lystes/integrations/supabase/client";
import { useBrandLanding, type BrandLandingResolved, type BrandProductCard } from "@lystes/hooks/useBrandLanding";
import { useApparenceMultiLien } from "@lystes/hooks/useApparenceMultiLien";
import LandingHeader from "@lystes/features/landing-particuliers/components/public/LandingHeader";
import { BrandLandingProvider } from "@lystes/contexts/BrandLandingContext";
import "@lystes/features/landing-particuliers/styles.css";
import { titreEnFrancais } from "@lystes/lib/titre-produit";
import { generateProductSlug } from "@lystes/lib/products/slug";
import {
  canoniqueFaq,
  COLONNES_PRODUITS_PUBLIQUES,
  faqAffichee,
  type LigneFaq,
  lignesUtiles,
  type QuestionFaq,
} from "@lystes/lib/seo/brandFaq";
import {
  questionsDuProduit,
  produitDepuisLigne,
  type ProduitFaq,
  schemaFaqPage,
} from "../../supabase/functions/_shared/faq-socles";

/**
 * /:brandSlug/faq : la foire aux questions de la marque, en deux socles.
 *
 *  - « L'essentiel » : écrit par `brand-faq-generator` à partir des fiches
 *    produits et de ce que la marque a renseigné. Tant que la fonction n'est
 *    pas passée (inscription toute fraîche), la page le calcule elle-même
 *    depuis les fiches, avec le même code : elle n'est jamais vide dès que la
 *    boutique a un produit.
 *  - « Ce que nos clientes demandent le plus » : les préoccupations qui
 *    reviennent dans les conversations, les avis et les messages de contact,
 *    classées par fréquence, réécrites chaque semaine.
 *
 * Toutes les réponses sont dans le HTML sans clic (lisibles par les moteurs
 * et les assistants), et le balisage FAQPage reprend mot pour mot les
 * réponses affichées.
 *
 * 04/10/2026 (demande de JP) : la page quitte le cadre du multi-lien et
 * reprend le template de /:marque/avis : en-tête du site, bannière pierre,
 * carrousel des produits, blocs blancs sur fond pierre : décliné pour les
 * questions par produit : chaque carte du carrousel mène à la section du
 * produit plus bas, et chaque section porte son ancre.
 */

function ancre(nom: string): string {
  return `produit-${generateProductSlug(nom)}`;
}

export default function BrandFaqPage() {
  const { t } = useTranslation();
  const { brandSlug, productSlug } = useParams<{ brandSlug: string; productSlug?: string }>();
  const { apparence, chargement: chargementApparence } = useApparenceMultiLien(brandSlug);
  /* La fiche de marque, sous SON adresse, que la visite arrive par celle du
     multi-lien (« eclose-paris ») ou par la sienne (« ecloseparis »). */
  const { data: lue, loading: chargementFiche, notFound } = useBrandLanding(apparence?.slugFiche ?? brandSlug);
  const data = notFound ? null : lue;
  const [lignes, setLignes] = useState<LigneFaq[]>([]);
  const [produits, setProduits] = useState<ProduitFaq[]>([]);
  const [chargement, setChargement] = useState(true);
  const loading = chargementFiche || chargementApparence;

  const accountId = data?.accountId ?? apparence?.accountId;
  const slugFiche = data?.slug ?? null;
  useEffect(() => {
    let annule = false;
    if (!brandSlug || !accountId) {
      if (!loading) setChargement(false);
      return;
    }
    (async () => {
      setChargement(true);
      const [faq, catalogue] = await Promise.all([
        /* Le compte ET l'adresse, jamais l'adresse seule : filtrer sur le slug
           seul affichait ici les lignes qu'un AUTRE compte avait écrites sous
           cette adresse (audit du 30/09/2026). Le compte et l'adresse viennent
           tous deux de la même ligne d'account_landing_config. La base le vérifie aussi :
           migration 20260930173700_faq_ecrite_sous_son_adresse. Sans fiche de
           marque, aucune question ne peut être rangée : on ne lit rien. */
        slugFiche && data
          ? supabase
              .from("brand_faq_items")
              .select("*")
              .eq("account_id", data.accountId)
              .eq("slug", slugFiche.toLowerCase())
              .order("rang", { ascending: true })
              .limit(200)
          : Promise.resolve({ data: [] as unknown[] }),
        supabase
          .from("products")
          .select(COLONNES_PRODUITS_PUBLIQUES)
          .eq("account_id", accountId)
          .limit(80),
      ]);
      if (annule) return;
      setLignes(lignesUtiles(faq.data));
      const lus = ((catalogue.data ?? []) as unknown as Record<string, unknown>[])
        .map(produitDepuisLigne)
        .filter((p): p is ProduitFaq => !!p);
      /* Filet : si la lecture échoue, les produits déjà chargés par la vitrine
         suffisent à poser l'essentiel. La page n'est jamais vide avec des produits. */
      setProduits(
        lus.length > 0
          ? lus
          : (data?.products ?? []).map((c) => ({
              id: c.id,
              nom: c.name,
              description_courte: c.tagline,
              lien: c.purchaseUrl,
            })),
      );
      setChargement(false);
    })();
    return () => {
      annule = true;
    };
  }, [brandSlug, accountId, slugFiche, loading, data]);

  const marque = data?.brandName ?? apparence?.nom ?? "";
  /* L'adresse canonique est celle de la fiche quand elle existe : c'est
     elle que le postbuild écrit et que le sitemap déclare. */
  const slug = data?.slug ?? apparence?.slug ?? brandSlug ?? "";

  const tout = useMemo(() => {
    const base = faqAffichee({ lignes, produits, marque, slug });
    /* Complète chaque produit avec les questions que SA fiche permet de
       répondre (même code que le générateur), quand la FAQ écrite en base
       n'en porte qu'une partie. Rien n'est inventé : sans matière, rien. */
        const sections = base.sections.map((sec) => {
      const p = produits.find((x) => x.id === sec.produit.id);
      if (!p) return sec;
      const deja = new Set(sec.questions.map((q) => q.question.trim().toLowerCase()));
      const extra = questionsDuProduit({ ...p, nom: titreEnFrancais(p.nom) })
        .filter((q) => !deja.has(q.question.trim().toLowerCase()))
        .map<QuestionFaq>((q) => ({
          cle: q.cle,
          question: q.question,
          reponse: q.reponse,
          theme: q.theme,
          produitId: p.id,
          occurrences: 0,
          mesuree: false,
          repondue: q.repondue,
          cleDonnees: null,
        }));
      /* Le nom du produit en casse française, y compris dans les questions déjà écrites. */
      const propre = titreEnFrancais(p.nom);
      const renomme = sec.questions.map((q) => ({ ...q, question: q.question.split(p.nom).join(propre) }));
      return { ...sec, questions: [...renomme, ...extra] };
    });
    /* Minimum une question par produit : un produit sans section en base
       (fiche muette, rien d'écrit) en reçoit une, avec la question de repli
       factuelle de `questionsDuProduit` (nom + lien de la fiche, rien d'inventé). */
    const presents = new Set(sections.map((s) => s.produit.id));
    for (const p of produits) {
      if (presents.has(p.id)) continue;
      const propre = titreEnFrancais(p.nom);
      const questions = questionsDuProduit({ ...p, nom: propre }).map<QuestionFaq>((q) => ({
        cle: q.cle,
        question: q.question,
        reponse: q.reponse,
        theme: q.theme,
        produitId: p.id,
        occurrences: 0,
        mesuree: false,
        repondue: q.repondue,
        cleDonnees: null,
      }));
      if (questions.length > 0) sections.push({ produit: { ...p, nom: propre }, questions });
    }
    /* Tous les noms de produits en casse française, dans toutes les questions
       et réponses (essentiel général et demandes comprises). */
    const casse = (q: QuestionFaq): QuestionFaq => {
      let question = q.question;
      let reponse = q.reponse;
      for (const p of produits) {
        const propre = titreEnFrancais(p.nom);
        if (propre === p.nom) continue;
        question = question.split(p.nom).join(propre);
        reponse = reponse.split(p.nom).join(propre);
      }
      return { ...q, question, reponse };
    };
    const demandesC = base.demandes.map(casse);
    const generalC = base.general.map(casse);
    const sectionsC = sections.map((x) => ({ ...x, questions: x.questions.map(casse) }));
    return {
      ...base,
      demandes: demandesC,
      general: generalC,
      sections: sectionsC,
      affichees: [...demandesC, ...generalC, ...sectionsC.flatMap((x) => x.questions)],
    };
  }, [lignes, produits, marque, slug]);
  /* Une page par produit : /:marque/faq/:produit ne montre que ses questions,
     et le balisage ne reprend que celles-là. */
  const cardProduit = productSlug ? data?.products.find((c) => c.slug === productSlug) : undefined;
  const sectionProduit = productSlug
    ? tout.sections.find(
        (s) => s.produit.id === cardProduit?.id || generateProductSlug(s.produit.nom) === productSlug,
      )
    : undefined;
  const demandes = productSlug ? [] : tout.demandes;
  const general = productSlug ? [] : tout.general;
  const sections = productSlug ? (sectionProduit ? [sectionProduit] : []) : tout.sections;
  const affichees = productSlug ? sectionProduit?.questions ?? [] : tout.affichees;
  const nomBrut = cardProduit?.name ?? sectionProduit?.produit.nom ?? null;
  const nomProduit = nomBrut ? titreEnFrancais(nomBrut) : null;

  if (loading) {
    return (
      <div className="particuliers-scope min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-[#777b7f]" />
      </div>
    );
  }
  if (!data) return <Navigate to="/" replace />;

  const titre = nomProduit
    ? t("faqMarque.titreOngletProduit", "Questions fréquentes : {{produit}}, {{marque}}", { produit: nomProduit, marque })
    : t("faqMarque.titreOnglet", "Questions fréquentes : {{marque}}", { marque });
  const description = t(
    "faqMarque.description",
    "{{marque}} répond aux questions de ses clientes : {{exemples}}",
    { marque, exemples: affichees.slice(0, 2).map((q) => q.question).join(" ") },
  ).slice(0, 155);
  const canonique = productSlug ? `${canoniqueFaq(slug).replace(/\/$/, "")}/${productSlug}` : canoniqueFaq(slug);
  /* Mot pour mot et dans l'ordre de l'écran : une question du balisage que la
     page ne montre pas (fiche hors des 80 lues) ferait refuser tout le bloc. */
  const jsonLd = schemaFaqPage(affichees);

  return (
    <VueFaqMarque
      data={data}
      marque={marque}
      productSlug={productSlug}
      chargement={chargement}
      vide={!chargement && affichees.length === 0}
      demandes={demandes}
      general={general}
      sections={sections}
      sectionProduit={sectionProduit}
      tete={
        <>
          {/* `defer={false}` : par défaut, react-helmet-async n'écrit le <head>
              que dans un requestAnimationFrame, que Chrome suspend dans un onglet
              caché. Mesuré le 01/10/2026 : onglet caché, onze questions à l'écran,
              titre de l'accueil et zéro balise. Écrites pendant le rendu, les
              balises ne dépendent plus de l'affichage de l'onglet. */}
          <Helmet defer={false}>
            <title>{titre}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonique} />
            <meta property="og:title" content={titre} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonique} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary" />
            {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
          </Helmet>
        </>
      }
    />
  );
}

/**
 * La FAQ telle qu'elle s'affiche, sans rien lire en base : la page la nourrit
 * de ce qu'elle a calculé, la visite « Vos outils » de l'accueil (12/10/2026)
 * de ses questions de démonstration. Un seul dessin pour les deux.
 */
export function VueFaqMarque({
  data,
  marque,
  productSlug,
  chargement,
  vide,
  demandes,
  general,
  sections,
  sectionProduit,
  tete,
}: {
  data: BrandLandingResolved;
  marque: string;
  productSlug?: string;
  chargement: boolean;
  vide: boolean;
  demandes: QuestionFaq[];
  general: QuestionFaq[];
  sections: { produit: ProduitFaq; questions: QuestionFaq[] }[];
  sectionProduit?: { produit: ProduitFaq; questions: QuestionFaq[] };
  tete?: ReactNode;
}) {
  const { t } = useTranslation();
  const slugProduit = (p: ProduitFaq) =>
    data.products.find((c) => c.id === p.id)?.slug ?? generateProductSlug(p.nom);
  const siteDeLaMarque = data.websiteUrl ?? null;


  /* Nombre de questions par produit, pour les cartes du carrousel. */
  const questionsParProduit = new Map<string, number>();
  for (const s of sections) questionsParProduit.set(s.produit.id, s.questions.length);

  /* Accordéon natif : la réponse reste dans le HTML (moteurs, assistants)
     même fermée. */
  const bloc = (q: QuestionFaq) => (
    <article key={q.cle} className="bg-[#f3f4f5] px-5 py-5">
    <details className="group [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
        <h3 className="text-[12.5px] font-semibold leading-snug tracking-[-0.006em] text-black">{q.question}</h3>
        <span aria-hidden="true" className="relative h-3 w-3 shrink-0">
          <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-black" />
          <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-black transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
        </span>
      </summary>
      <p className="mt-3 text-[11px] leading-[1.5] text-[#777b7f] whitespace-pre-line">{q.reponse}</p>
      {q.mesuree && q.occurrences > 1 && (
        <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.07em] text-[#777b7f]">
          {t("faqMarque.frequence", "Revient {{count}} fois ces 90 derniers jours", { count: q.occurrences })}
        </p>
      )}
    </details>
    </article>
  );

  const titreSection = (texte: string, id?: string) => (
    <h2 id={id} className="text-xl font-semibold tracking-tight text-black">
      {texte}
    </h2>
  );

  return (
    <BrandLandingProvider value={data}>
      <div className="particuliers-scope min-h-screen bg-white text-black">
        {tete}

        <LandingHeader />

        {/* BANNIÈRE : même gabarit que la page avis : bande pierre, nom de
            marque, titre éditorial, pilules. */}
        <section className="bg-[#f3f4f5]">
          <div className="mx-auto max-w-7xl px-6 py-12">
            <div>
              <p className="text-sm text-[#777b7f]">{marque}</p>
              <h1 className="mt-2 font-editorial text-4xl font-normal">
                {t("faqMarque.titre", "Questions fréquentes")}
              </h1>
              <p className="mt-3 mb-[18px] max-w-[400px] text-sm leading-relaxed text-[#777b7f]">
                {t(
                  "faqMarque.mentionIa",
                  "Réponses rédigées par IA à partir de ce que nos clientes demandent et des informations de la marque.",
                )}
              </p>
            </div>
            <div className="lyr-btns mt-6">
              <Link className="lyr-btn-black" to={`/${data.slug}/forms`}>
                <span>{t("faqMarque.poserQuestion", "Poser une question")}</span>
                <span className="lyr-arrow" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </span>
              </Link>
              {siteDeLaMarque && (
                <a className="lyr-btn-outline lyr-btn-outline-clair" href={siteDeLaMarque} target="_blank" rel="noopener noreferrer">
                  <span>{t("faqMarque.navSite", "Le site de la marque")}</span>
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
        </section>

        {/* PRODUITS : le carrousel de la page avis, mais chaque carte mène à
            la section de questions du produit, plus bas dans la page. */}
        {data.products.length > 0 && (
          <section>
            <div className="mx-auto max-w-7xl px-6 py-12">
              <div className="mb-6">
                <h2 className="text-xl font-semibold tracking-tight">
                  {t("faqMarque.parProduit", "Questions par produit")}
                </h2>
                <p className="mt-1 text-sm text-[#777b7f]">
                  {t(
                    "faqMarque.parProduitSousTitre",
                    "{{count}} produits, une page de questions par produit",
                    { count: data.products.length },
                  )}
                </p>
              </div>
              <div className="-mx-6 flex snap-x snap-mandatory gap-2 overflow-x-auto bg-[#f3f4f5] px-6 py-4 [scrollbar-width:thin]">
                {data.products.map((p: BrandProductCard) => {
                  const n = questionsParProduit.get(p.id) ?? 0;
                  return (
                    <a
                      key={p.slug}
                      href={`/${data.slug}/faq/${p.slug}`}
                      aria-current={p.slug === productSlug ? "page" : undefined}
                      className="group flex w-[46%] aria-[current=page]:outline aria-[current=page]:outline-1 aria-[current=page]:outline-black shrink-0 snap-start flex-col rounded-[11px] bg-white p-[11px] sm:w-[31%] md:w-[23%] lg:w-[18.5%]"
                    >
                      <div className="aspect-[4/5.9] max-h-[242px] overflow-hidden bg-white">
                        <img src={p.image_url} alt={p.name} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      </div>
                      <div className="mt-4 flex-1 px-1">
                        {/* Trois lignes : à deux, les noms longs finissaient en « … » sur
                            téléphone (« Nettoyant peaux sensibles visage… », 11/10). */}
                        <h3 className="line-clamp-3 text-sm font-medium leading-snug">{titreEnFrancais(p.name)}</h3>
                      </div>
                      <div className="mt-3 mb-2 flex items-center justify-between px-1">
                        {n > 0 ? (
                          <span className="text-[11px] text-[#777b7f]">
                            {t("faqMarque.nQuestions", "{{count}} questions", { count: n })}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-[#777b7f] group-hover:text-black">
                            {t("faqMarque.voirFiche", "Voir la fiche produit")} <ArrowUpRight className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* QUESTIONS : blocs blancs séparés par le fond pierre, comme la
            liste d'avis. */}
        <main className="mx-auto max-w-7xl px-6 pb-16">
          {chargement ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-[#777b7f]" />
            </div>
          ) : productSlug && !sectionProduit ? (
            <div className="bg-[#f3f4f5] px-6 py-16 text-center">
              <p className="text-sm text-[#777b7f]">
                {t("faqMarque.produitSansQuestion", "Pas encore de questions pour ce produit.")}
              </p>
              <Link to={`/${data.slug}/faq`} className="mt-4 inline-block text-[10px] font-semibold uppercase tracking-[0.07em] underline">
                {t("faqMarque.toutesQuestions", "Toutes les questions")}
              </Link>
            </div>
          ) : vide ? (
            <div className="bg-[#f3f4f5] px-6 py-16 text-center">
              <p className="text-sm leading-relaxed text-[#777b7f]">
                {t(
                  "faqMarque.vide",
                  "Les questions fréquentes de {{marque}} apparaîtront dès que ses produits seront en ligne.",
                  { marque },
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {demandes.length > 0 && (
                <section aria-labelledby="faq-demandes">
                  {titreSection(t("faqMarque.demandes", "Ce que nos clientes demandent le plus"), "faq-demandes")}
                  <p className="mt-1 mb-6 text-sm text-[#777b7f]">
                    {t(
                      "faqMarque.demandesSousTitre",
                      "Les préoccupations qui reviennent dans les conversations, les avis et les messages, de la plus fréquente à la moins fréquente. Mises à jour chaque semaine.",
                    )}
                  </p>
                  <div className="grid gap-px bg-white">{demandes.map(bloc)}</div>
                </section>
              )}

              {(general.length > 0 || sections.length > 0) && (
                <section aria-labelledby="faq-essentiel">
                  {titreSection(t("faqMarque.essentiel", "L'essentiel"), "faq-essentiel")}
                  <p className="mt-1 mb-6 text-sm text-[#777b7f]">
                    {t(
                      "faqMarque.essentielSousTitre",
                      "Les questions de base sur {{marque}} et ses produits, tirées des fiches produits et de ce que la marque a renseigné.",
                      { marque },
                    )}
                  </p>

                  {general.length > 0 && <div className="grid gap-px bg-white">{general.map(bloc)}</div>}

                  {sections.map(({ produit, questions }) => (
                    <div key={produit.id} id={ancre(produit.nom)} className="mt-10 scroll-mt-24">
                      <h3 className="text-base font-semibold leading-snug tracking-tight text-black">
                        {productSlug ? (
                          titreEnFrancais(produit.nom)
                        ) : (
                          <Link to={`/${data.slug}/faq/${slugProduit(produit)}`} className="hover:opacity-60 transition-opacity">
                            {titreEnFrancais(produit.nom)}
                          </Link>
                        )}
                      </h3>
                      <div className="mt-2 mb-4 flex flex-wrap gap-x-5 gap-y-1">
                        {productSlug && (
                          <Link
                            to={`/${data.slug}/faq`}
                            className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[#777b7f] hover:text-black transition-colors"
                          >
                            {t("faqMarque.toutesQuestions", "Toutes les questions")}
                          </Link>
                        )}
                      </div>
                      <div className="grid gap-px bg-white">{questions.map(bloc)}</div>
                    </div>
                  ))}
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </BrandLandingProvider>
  );
}
