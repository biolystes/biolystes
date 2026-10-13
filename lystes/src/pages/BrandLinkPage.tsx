/**
* Page publique Multi-Lien – PIXEL-PERFECT d'après le HTML fourni
* Route: /:slug
* - Layout: fond radial fixe + carte blanche arrondie + avatar chevauchant
* - Garde extras: CTA agent (popup) + featured section + footer
* - Typo: Satoshi (site)
* - Couleurs: fixes (radial-gradient background, dégradé avatar rose)
*/

import { useEffect, useState, useRef, useCallback, Fragment, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Link } from "@lystes/lib/lien-lystes";
import { supabase } from "@lystes/integrations/supabase/client";
import { X } from "lucide-react";
import { getTryOnDemoUrl } from "@lystes/utils/agentRouting";
import { BrandAdvisorChatCard, type DemoConseiller } from "@lystes/components/brand/BrandAdvisorChatCard";
import { BoutonDiagFaq, type DemoDiagFaq } from "@lystes/components/brand/BoutonDiagFaq";
import { BoutonActus } from "@lystes/components/brand/BoutonActus";
import { useIsMobile } from "@lystes/hooks/use-mobile";
import { FILTRE_AVIS_DEFINITIFS } from "@lystes/lib/reviews/authenticity";
import { ajouterSuivi } from "@lystes/lib/lienSuivi";
import { choisirAvisPertinents, fusionnerSansDoublon, lireMode, sourcesALaUne, type ModeALaUne } from "@lystes/lib/multilien/aLaUne";
import { TrustpilotStars } from "@lystes/components/reviews/TrustpilotStars";
import { LogoMultiLien, NomMultiLien, PiedMultiLien } from "@lystes/components/brand/MultiLienCommun";
import {
  alignerLiensInternes,
  completerLiensContactFaq,
  estLienInterne,
} from "../../supabase/functions/_shared/adresses-marque";

/* ========== TYPES ========== */
export interface FeaturedProduct {
  id: string;
  name: string;
  image_url: string;
  price: string;
  price_suffix?: string;
  cta_label?: string;
  cta_url?: string;
}

export interface CustomLink {
  label: string;
  url: string;
  cle?: string;
  actif?: boolean;
}

export interface FeaturedSection {
  image_url?: string;
  title?: string;
  description?: string;
  cta_label?: string;
  cta_url?: string;
}

export interface AgentAvatars {
  widget_avatar_1: string | null;
  widget_avatar_2: string | null;
  widget_avatar_3: string | null;
}

export interface Review {
  id?: string;
  name: string;
  rating: number;
  text: string;
  source?: string;
}

/* Montrée dans un cadre par une page de lystes.ai (la visite « Vos outils »
   de /accueil-v2, 10/10/2026), la page n'a pas de visiteuse : ni la vue ni
   les clics ne comptent. Un cadre posé par un autre site, lui, compte : lire
   l'adresse d'un parent d'une autre origine lève une erreur. */
function montreeParLystes(): boolean {
  try {
    return window.parent !== window && window.parent.location.origin === window.location.origin;
  } catch {
    return false;
  }
}

export interface BrandLinkData {
  id: string;
  slug: string;
  account_id: string;
  brand_name: string;
  brand_tagline?: string;
  avatar_url?: string;
  logo_url?: string;
  is_verified: boolean;
  featured_products: FeaturedProduct[];
  featured_products_title: string;
  custom_links: CustomLink[];
  featured_section: FeaturedSection;
  reviews: Review[];
  reviews_display_count?: number;
  /* La page des avis existe-t-elle pour cette marque ? `BrandReviewsPage` est
     adossée à `account_landing_config`, pas à `brand_link_pages`. Relevé le
     12/08/2026 : sur les 4 pages multi-liens existantes, TROIS n'ont pas de
     fiche de marque, et `/marque/avis` y renvoie vers l'accueil
     (`BrandReviewsPage.tsx:129`). */
  a_une_page_avis?: boolean;
  primary_cta_label?: string;
  primary_cta_type?: string;
  primary_cta_url?: string;
  background_color?: string;
}

/* ========== STYLES - identiques au HTML fourni ========== */
export const brandLinkPageStyles = `
  .blp-body {
    font-family: 'Satoshi', -apple-system, BlinkMacSystemFont, sans-serif;
    min-height: 100vh;
    margin: 0;
    display: flex;
    justify-content: center;
  }

  /* Le diagnostic est sorti du chat (BoutonDiagFaq, sous la carte) : la
     pastille d'action du chat ne reste pas en double (11/10/2026). */
  .blp-avec-bdf .lmk-pills .lmk-pill { display: none; }

  .blp-main-card {
    background-color: white;
    width: 100%;
    max-width: 332px;
    margin-top: 68px;
    border-top-left-radius: 51px;
    border-top-right-radius: 51px;
    padding: 0 20px 51px 20px;
    position: relative;
    min-height: calc(100vh - 68px);
  }

  .blp-profile-wrapper {
    position: absolute;
    top: -47px;
    left: 50%;
    transform: translateX(-50%);
    width: 94px;
    height: 94px;
    border-radius: 50%;
    padding: 3px;
    background: linear-gradient(to bottom, #d946ef, #ec4899, #f43f5e);
  }

  .blp-profile-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: contain;
    border: 3px solid white;
    background-color: #fffdfd;
    padding: 7px;
  }

  .blp-verified-badge {
    color: #1DA1F2;
  }

  /* Le sceau « vérifié » du multi-lien (JP, 04/10/2026) : posé en absolu à
     droite du nom, hors du flux, pour que le nom reste centré dans la carte.
     Le repère horizontal suit la fin du nom (left: calc(100% + 6px)) : la
     valeur fixe mesurée sur « Valthea Paris » (right: 67px) mangeait la
     dernière lettre sur un nom plus long, relevé sur « Dream Virgin Hair ». */
  .verified {
    position: absolute;
    left: calc(100% + 6px);
    top: -6px;
    width: 13px;
    height: 20px;
    display: block;
  }

  .verified .tick {
    fill: none;
    stroke: #ffffff;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .blp-product-button-shadow {
    box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 1);
  }

  .blp-link-item {
    border: 1.5px solid #000;
    transition: all 0.2s ease;
    position: relative;
  }

  .blp-link-item:hover {
    background-color: #f9f9f9;
    transform: translateY(-1px);
  }

  .blp-link-item svg.w-5.h-5 {
    position: absolute !important;
    right: 16px !important;
  }

  .blp-link-item span.text-xs.font-bold {
    display: table !important;
    text-align: center !important;
    width: 100% !important;
    letter-spacing: 0 !important;
    font-size: 9px !important;
  }

  button.blp-link-item {
    padding: 16px 11px !important;
    border-radius: 7px !important;
  }

  a.blp-link-item {
    padding: 18px 11px !important;
    border-radius: 0px !important;
    border: 1px solid #000 !important;
  }

  .bg-gray-200 {
    background-color: rgb(0 0 0) !important;
  }

  /* Widget Button - 3 stacked avatars + AI badge */
  .blp-widget-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #111111;
    color: white;
    border: none;
    border-radius: 42px;
    padding: 10px 17px 10px 14px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .blp-widget-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
  }

  .blp-avatars {
    display: flex;
    align-items: center;
    position: absolute;
    left: 19px;
  }

  .blp-avatar {
    width: 27px;
    height: 27px;
    border-radius: 50%;
    border: 2px solid #111;
    object-fit: cover;
    background: #333;
  }

  .blp-avatar-2 {
    margin-left: -10px;
    z-index: 1;
  }

  .blp-avatar-3 {
    margin-left: -10px;
    z-index: 2;
  }

  .blp-ai-badge {
    position: absolute;
    bottom: -3px;
    right: -7px;
    background: #000;
    color: white;
    font-size: 8px;
    font-weight: 700;
    padding: 2px 5px;
    border-radius: 7px;
    z-index: 3;
  }

  button.blp-link-item.flex.items-center.justify-between.w-full.bg-white {
    margin-bottom: 13px;
    padding: 20px 13px !important;
  }

  .blp-btn-icon {
    font-size: 14px;
    transform: rotate(45deg);
  }

  /* Reviews Section - Carousel */
  .blp-reviews-carousel {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    padding-bottom: 4px;
  }

  .blp-reviews-carousel::-webkit-scrollbar {
    display: none;
  }

  .blp-review-card {
    background: #f9f9f9;
    border-radius: 14px;
    padding: 30px;
    border: 0px solid #eee;
    min-width: 238px;
    max-width: 255px;
    flex-shrink: 0;
    scroll-snap-align: start;
  }

  .blp-review-card p.text-sm.text-gray-600.leading-relaxed {
    text-align: justify;
  }

  .blp-review-text-wrapper {
    position: relative;
    transition: max-height 0.3s ease;
  }

  /* Le voile de fondu ne s'applique qu'aux avis réellement coupés.
     Sur un avis court, il effaçait la fin d'une phrase entière. */
  .blp-review-text-wrapper.tronque {
    max-height: 102px;
    overflow: hidden;
  }

  .blp-review-text-wrapper.expanded {
    max-height: 2000px;
    overflow: visible;
  }

  .blp-review-text-wrapper.tronque:not(.expanded)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 34px;
    background: linear-gradient(transparent, #f9f9f9);
    pointer-events: none;
  }

  .blp-voir-plus {
    background: none;
    border: none;
    color: #111;
    font-size: 10px;
    font-weight: 600;
    cursor: pointer;
    padding: 5px 0 0;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .blp-body.p-4 a.blp-link-item svg.w-5.h-5,
  .blp-body.p-4 button.blp-link-item svg.w-5.h-5 {
    position: absolute;
    right: 16px;
  }

  .blp-body.p-4 a.blp-link-item,
  .blp-body.p-4 button.blp-link-item {
    position: relative;
  }

  .blp-body.p-4 a.blp-link-item span.text-xs.font-bold.tracking-widest.uppercase,
  .blp-body.p-4 button.blp-link-item span.text-xs.font-bold.tracking-widest.uppercase {
    width: 100%;
    display: block;
    text-align: center;
    letter-spacing: 0px;
    font-size: 9px;
  }

  .blp-body.p-4 a.blp-link-item {
    padding: 18px 11px;
    border-radius: 7px;
  }

  .blp-body.p-4 button.blp-link-item {
    padding: 16px 11px;
    border-radius: 7px;
  }

  h2.text-sm.font-semibold.text-gray-900.uppercase.tracking-wider {
    text-align: center;
    padding-top: 30px;
  }

  .blp-review-stars {
    display: flex;
    gap: 3px;
  }

  .blp-star-box {
    width: 15px;
    height: 15px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .blp-star-filled {
    background-color: #1D1D1F;
  }

  .blp-star-filled svg {
    color: white;
  }

  .blp-star-empty {
    background-color: #171f3929;
  }

  .blp-star-empty svg {
    color: transparent;
  }

  /* Custom overrides - user provided */
  .blp-body.p-4 .blp-main-card {
    background-color: white;
    width: 100%;
    max-width: 283px;
    margin-top: 68px;
    border-top-left-radius: 51px;
    border-top-right-radius: 51px;
    padding: 0 20px 51px 20px;
    position: relative;
    min-height: calc(100vh - 68px);
  }

  .blp-body.p-4 h1.text-xl.font-bold.tracking-tight.uppercase {
    font-size: 12px;
    text-transform: capitalize;
  }

  /* Le nom de la marque posé en paragraphe, sur le contact et la FAQ qui ont
     leur propre titre (MultiLienCommun, 01/10/2026) : la taille du h1 ci-dessus
     et la fonte que la règle globale des titres (index.css) donne au h1.
     Sous 850 px, la règle .text-xl d'index.css les passe tous deux à 14 px. */
  .blp-body.p-4 p.blp-nom.text-xl.font-bold.tracking-tight.uppercase {
    font-size: 12px;
    font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
    text-transform: capitalize;
  }

  .blp-body.p-4 a.blp-link-item svg.w-5.h-5,
  .blp-body.p-4 button.blp-link-item svg.w-5.h-5 {
    position: absolute;
    right: 16px;
    width: 11px;
  }

  .blp-body.p-4 a.blp-link-item span.text-xs.font-bold,
  .blp-body.p-4 button.blp-link-item span.text-xs.font-bold {
    width: 100%;
    display: block;
    text-align: center;
    letter-spacing: 0px;
    font-size: 9px;
  }

  .blp-body.p-4 .flex.flex-col.border.border-gray-200.rounded-sm.overflow-hidden {
    border: 1px solid;
    padding-bottom: 8px;
  }

  .blp-body.p-4 a.blp-product-button-shadow {
    border-radius: 18px;
  }

  .blp-body.p-4 .space-y-4 svg.w-5.h-5,
  .blp-body.p-4 svg.w-5.h-5 {
    width: 12px;
  }

  .blp-body.p-4 .pt-20.text-center {
    padding-top: 54px;
  }

  .blp-body.p-4 span.block.text-sm.font-semibold.mb-2 {
    font-size: 9px;
  }
  `;

/* ========== REVIEW CARD WITH "VOIR PLUS" ========== */
function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const [needsTruncation, setNeedsTruncation] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    /* On mesure après le rendu des polices : mesurer trop tôt faisait
       croire qu'un avis court dépassait, d'où le fondu de trop. */
    const mesurer = () => setNeedsTruncation(el.scrollHeight > 124);
    mesurer();
    const obs = new ResizeObserver(mesurer);
    obs.observe(el);
    return () => obs.disconnect();
  }, [review.text]);

  return (
    <div key={review.id || index} className="blp-review-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {/* Les mêmes étoiles que la page des avis, pas une seconde version.
              Le visiteur passe de l'une à l'autre en un clic : deux jeux
              d'étoiles différents à trois secondes d'intervalle, ça se voit. */}
          <TrustpilotStars rating={review.rating} size={16} />
          <span className="text-sm font-semibold text-gray-900">{review.name}</span>
        </div>
        {review.source && <span className="text-xs text-gray-400">via {review.source}</span>}
      </div>
      <div ref={textRef} className={`blp-review-text-wrapper ${needsTruncation ? 'tronque' : ''} ${expanded ? 'expanded' : ''}`}>
        <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
      </div>
      {needsTruncation && (
        <button className="blp-voir-plus" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Voir moins' : 'Voir plus'}
        </button>
      )}
    </div>
  );
}

/* ========== REVIEWS CAROUSEL WITH AUTOPLAY ========== */
/**
* La page publique des avis existe-t-elle pour cette marque ?
*
* Sans ce contrôle, le bouton « Voir tous les avis clients » ramenait le
* visiteur sur la page d'accueil de Lystes pour trois marques sur quatre.
*/
async function pageAvisExiste(slug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("account_landing_config")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();
  return !error && !!data;
}

/**
* Le même témoignage ne peut pas être signé par deux personnes.
*
* Relevé sur Lambert Beauty le 12/08/2026 : le bloc saisi de sa page contient
* DEUX avis au texte rigoureusement identique, l'un signé Fanta sans source,
* l'autre signé Marie « via Google ». Le texte lui-même est en réalité trois
* témoignages collés bout à bout.
*
* Affiché tel quel, c'est le défaut du 01/08 qui revient par une autre porte :
* une page publique qui présente comme des retours clients ce qui n'en est pas.
* On garde la première occurrence et on écarte les suivantes. Un manque visible
* vaut mieux qu'un doublon qui se fait passer pour deux clientes.
*/
function sansDoublons(avis: Review[]): Review[] {
  const vus = new Set<string>();
  return avis.filter((a) => {
    const empreinte = (a.text || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (!empreinte || vus.has(empreinte)) return false;
    vus.add(empreinte);
    return true;
  });
}

/**
* Les avis à montrer sur la page publique.
*
* La colonne `brand_link_pages.reviews` est un bloc JSON saisi à la main. Quand
* le marchand ne l'a pas rempli, la section disparaissait, alors que ses vrais
* avis dorment dans la table `reviews`. JP, le 12/08/2026 : « il manque les avis
* qui renvoient vers la page avis ».
*
* Le bloc saisi garde la priorité, c'est un choix éditorial du marchand. À
* défaut, on sert les avis publiés de la boutique.
*
* `FILTRE_AVIS_DEFINITIFS` reste le point d'entrée unique de cette lecture,
* même s'il laisse aujourd'hui passer toute provenance : si la règle devait
* changer, elle changerait dans `authenticity.ts` et nulle part ailleurs.
*/
async function avisAAfficher(accountId: string, saisis: Review[]): Promise<Review[]> {
  if (saisis.length > 0) return sansDoublons(saisis);
  /* Lot 13 (12/10/2026) : des avis « pertinents » plutôt que les dix
     derniers. On lit les 200 derniers avis publiés, puis on garde les mieux
     notés et les plus détaillés, un par produit d'abord
     (`choisirAvisPertinents`). */
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, title, content, first_name, source, provenance, product_id, published_at")
    .eq("account_id", accountId)
    .eq("is_active", true)
    .eq("moderation_status", "published")
    .or(FILTRE_AVIS_DEFINITIFS)
    .order("published_at", { ascending: false })
    .limit(200);
  if (error || !data) return [];
  const provenances: Record<string, string> = {
    google: "Google",
    trustpilot: "Trustpilot",
    facebook: "Facebook",
    instagram: "Instagram",
  };
  const candidats = (data as Array<Record<string, unknown>>).map((r) => ({
    id: String(r.id),
    note: Number(r.rating ?? 5),
    texte: String(r.content ?? ""),
    titre: (r.title as string | null) ?? null,
    produitId: (r.product_id as string | null) ?? null,
    date: (r.published_at as string | null) ?? null,
    ligne: r,
  }));
  return sansDoublons(choisirAvisPertinents(candidats, 10).map(({ ligne: r }) => {
    const via = provenances[String(r.source ?? "").toLowerCase()];
    return {
      id: r.id as string,
      /* Prénom seul : le nom de famille n'est plus lisible par le rôle
         anonyme, un avis public ne doit pas exposer l'identité entière. */
      name: (r.first_name as string) ?? "Client",
      rating: (r.rating as number) ?? 5,
      text: r.content as string,
      source: via,
    };
  }));
}

/**
 * Les produits à la une quand la marque n'en a choisi aucun (lot 13).
 *
 * Meilleures ventes et mieux notés viennent de la fonction SQL
 * `multilien_produits_a_la_une` (lecture seule, identifiants et rang
 * seulement : la page publique ne lit pas `ecommerce_orders`). Tant que la
 * migration n'est pas passée, l'appel échoue et la page retombe sur les
 * derniers produits ajoutés, son comportement d'avant.
 */
async function produitsALaUneDynamiques(accountId: string, mode: ModeALaUne): Promise<FeaturedProduct[]> {
  const listes: string[][] = [];
  for (const source of sourcesALaUne(mode)) {
    if (fusionnerSansDoublon(listes, 3).length >= 3) break;
    if (source === "recents") {
      const { data, error } = await supabase
        .from("products")
        .select("id")
        .eq("account_id", accountId)
        .not("image_url", "is", null)
        .order("created_at", { ascending: false })
        .limit(3);
      if (error) console.error("BrandLinkPage: fetch top products failed", error);
      listes.push(((data ?? []) as Array<{ id: string }>).map((p) => p.id));
      continue;
    }
    // La fonction n'est pas encore dans les types générés : appel non typé.
    const { data, error } = await (supabase.rpc as unknown as (
      fn: string,
      args: Record<string, unknown>,
    ) => Promise<{ data: Array<{ product_id: string; rang: number }> | null; error: unknown }>)(
      "multilien_produits_a_la_une",
      { p_account_id: accountId, p_mode: source, p_limite: 3 },
    );
    if (error) {
      console.warn(`BrandLinkPage: ${source} indisponible, repli`, error);
      continue;
    }
    listes.push([...(data ?? [])].sort((x, y) => x.rang - y.rang).map((r) => r.product_id));
  }
  const ids = fusionnerSansDoublon(listes, 3);
  if (ids.length === 0) return [];
  const { data: lignes, error } = await supabase
    .from("products")
    .select("id, name, image_url, price, purchase_link")
    .eq("account_id", accountId)
    .in("id", ids);
  if (error || !lignes) return [];
  const parId = new Map((lignes as Array<{ id: string; name: string; image_url: string | null; price: number | null; purchase_link: string | null }>).map((p) => [p.id, p]));
  return ids
    .map((id) => parId.get(id))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({
      id: p.id,
      name: p.name,
      image_url: p.image_url || "",
      price: p.price ? `${p.price}€` : "Prix sur demande",
      cta_label: "Acheter",
      cta_url: p.purchase_link || undefined,
    }));
}

function ReviewsCarousel({ reviews, slug }: { reviews: Review[]; slug?: string }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIndex = useRef(0);

  const scrollToIndex = useCallback((index: number) => {
    const el = carouselRef.current;
    if (!el || !el.children.length) return;
    const child = el.children[index] as HTMLElement;
    if (child) {
      el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: 'smooth' });
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % reviews.length;
      scrollToIndex(currentIndex.current);
    }, 4000);
  }, [reviews.length, scrollToIndex]);

  useEffect(() => {
    if (reviews.length <= 1) return;
    startAutoplay();
    return () => { if (autoplayRef.current) clearInterval(autoplayRef.current); };
  }, [reviews.length, startAutoplay]);

  const handleInteraction = useCallback(() => {
    if (autoplayRef.current) clearInterval(autoplayRef.current);
    setTimeout(startAutoplay, 8000);
  }, [startAutoplay]);

  return (
    <section className="space-y-[13px] pt-[13px]">
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Ce qu'ils en pensent</h2>
      <div
        ref={carouselRef}
        className="blp-reviews-carousel"
        onTouchStart={handleInteraction}
        onMouseDown={handleInteraction}
      >
        {reviews.map((review, index) => (
          <ReviewCard key={review.id || index} review={review} index={index} />
        ))}
      </div>
      {/* Sous le carrousel, avant le pied de page : c'est là que JP l'a placé le
          12/08, et c'est l'endroit juste. En tête de section, le lien invitait à
          partir avant même d'avoir lu un avis. */}
      {slug && (
        <a
          href={`/${slug}/avis`}
          className="block w-full text-center bg-[#194cff] text-white text-xs font-bold uppercase tracking-widest py-[13px] rounded-lg"
        >
          Voir tous les avis clients
        </a>
      )}
    </section>
  );
}

/* ========== COMPONENT ========== */
export default function BrandLinkPage() {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<BrandLinkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showAgentPopup, setShowAgentPopup] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentType, setAgentType] = useState<string | null>(null);
  const [agentAvatars, setAgentAvatars] = useState<AgentAvatars | null>(null);
  /* L'agent de diagnostic de la marque, s'il en existe un d'actif. */
  const [agentDiagnostic, setAgentDiagnostic] = useState<{ id: string; agent_type: string } | null>(null);
  /* Quel agent la bulle ouvre : le bouton principal ou le diagnostic. */
  const [agentPopup, setAgentPopup] = useState<{ id: string; type: string | null } | null>(null);


  /* Consigne de JP, 12/08/2026 : « uniquement version mobile ». La version
     ordinateur lui convient telle qu'elle était, donc tout ce qui a été ajouté
     ce jour-là (conversation, carrousel d'avis, appels à l'action) est réservé
     aux écrans de moins de 768 px. */
  const surMobile = useIsMobile();

  useEffect(() => {
    async function fetchBrandPage() {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data: pageData, error } = await supabase
        .from("brand_link_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

      if (error || !pageData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Track view (montreeParLystes : pas dans la visite de /accueil-v2)
      if (!montreeParLystes()) {
        const { error: viewError } = await supabase.rpc("increment_brand_link_view", { p_slug: slug });
        if (viewError) {
          console.error("BrandLinkPage: increment view failed", viewError);
        }
      }

      let featuredProducts = (pageData.featured_products as unknown as FeaturedProduct[]) || [];
      let customLinks = (pageData.custom_links as unknown as CustomLink[]) || [];

      /* Lot 13 (12/10/2026) : produits à la une dynamiques. La liste manuelle
         garde la priorité quand elle est remplie. Vide, la page suit le mode
         choisi par la marque (`featured_products_mode`, « auto » par défaut) :
         meilleures ventes (30 jours, repli 90), plus appréciés (3 avis
         minimum), puis les derniers produits ajoutés, comme avant. */
      if (featuredProducts.length === 0) {
        featuredProducts = await produitsALaUneDynamiques(
          pageData.account_id as string,
          lireMode((pageData as { featured_products_mode?: unknown }).featured_products_mode),
        );
      }

      // ALWAYS enrich all featured products with real purchase_link from DB
      // Uses SECURITY DEFINER RPC to bypass RLS on public page
      const productIds = featuredProducts.map(p => p.id).filter(Boolean);
      if (productIds.length > 0) {
        const { data: realProducts, error: realProductsError } = await supabase
          .rpc("get_product_purchase_links_for_account", {
            p_account_id: pageData.account_id,
            p_product_ids: productIds as string[]
          });
        if (realProductsError) {
          console.error("BrandLinkPage: fetch real purchase links failed", realProductsError);
        }
        if (realProducts && Array.isArray(realProducts)) {
          const linkMap = Object.fromEntries(
            (realProducts as { id: string; purchase_link: string }[]).map(p => [p.id, p.purchase_link])
          );
          featuredProducts = featuredProducts.map(p => ({
            ...p,
            cta_url: (p.id && linkMap[p.id]) ? linkMap[p.id] : p.cta_url
          }));
        }
      }

      /* Lot 13 : paramètres de suivi sur les liens produit, pour que la
         marque voie dans ses statistiques les ventes venues du multi-lien. */
      featuredProducts = featuredProducts.map((p) => ({
        ...p,
        cta_url: p.cta_url ? ajouterSuivi(p.cta_url, "multilien", pageData.slug as string) : p.cta_url,
      }));

      // FALLBACK: Auto-generate top 3 category links if none configured.
      // « Nous contacter » et « FAQ » seuls ne comptent pas comme une
      // configuration : une page qui n'a qu'eux garde ses catégories (01/10).
      if (customLinks.every((l) => l.cle === "contact" || l.cle === "faq")) {
        const { data: topCategories, error: topCategoriesError } = await supabase
          .from("products")
          .select("category, purchase_link")
          .eq("account_id", pageData.account_id)
          .not("category", "is", null)
          .limit(100);

        if (topCategoriesError) {
          console.error("BrandLinkPage: fetch top categories failed", topCategoriesError);
        }

        if (topCategories && topCategories.length > 0) {
          // Count categories and get top 3
          const categoryCount: Record<string, number> = {};
          topCategories.forEach(p => {
            if (p.category) {
              categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
            }
          });
          const sortedCategories = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([cat]) => cat);

          /* La boutique de CETTE marque, déduite de ses propres liens d'achat.
             Jusqu'au 20/08/2026, cette ligne pointait en dur sur
             dreamvirginhair.com : le repli avait été écrit pour ce compte-là
             puis laissé pour tous les autres. Chaque marque sans liens
             personnalisés envoyait donc ses visiteurs chez une autre marque,
             sous ses propres libellés, et c'était en ligne.

             Aucune boutique trouvée : on n'affiche AUCUN lien. Une page
             publique sans raccourci de catégorie est incomplète ; une page qui
             envoie les clientes ailleurs est nuisible. */
          const boutique = (topCategories ?? [])
            .map((p: { purchase_link?: string | null }) => p.purchase_link)
            .find((url): url is string => typeof url === "string" && /^https?:\/\//.test(url));

          if (boutique) {
            const origine = new URL(boutique).origin;
            customLinks = [
              ...sortedCategories.map(cat => ({
                label: cat,
                url: `${origine}/categorie-produit/${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'))}/`
              })),
              ...customLinks,
            ];
          }
        }
      }

      /* « Nous contacter » et « FAQ », liens par défaut du multi-lien (JP,
         01/10/2026). Ils s'affichent tant que la marque ne les a pas retirés,
         sans rien écrire en base : la règle est celle de
         `completerLiensContactFaq`, la même que l'écran de configuration.
         Un lien que la marque a éteint (`actif: false`) bloque le défaut et
         ne s'affiche pas. Les liens internes posés à l'inscription
         reprennent l'adresse actuelle de la page : relevé le 01/10, des
         pages « ecloseparis » menaient encore à « /eclose-paris/avis ». */
      customLinks = (completerLiensContactFaq(
        alignerLiensInternes(customLinks, pageData.slug as string),
        pageData.slug as string,
      ) as CustomLink[]).filter((l) => l.actif !== false);

      // Check if CTA is an agent ID and fetch agent type + avatars
      if (pageData.primary_cta_type === "agent" && pageData.primary_cta_url) {
        const selectedAgentId = pageData.primary_cta_url;
        setAgentId(selectedAgentId);

        const { data: agentData, error: agentError } = await supabase
          .from("agents")
          .select("agent_type, widget_avatar_1, widget_avatar_2, widget_avatar_3")
          .eq("id", selectedAgentId)
          .single();

        if (agentError) {
          console.error("BrandLinkPage: fetch agent type/avatars failed", agentError);
        }

        if (agentData?.agent_type) {
          setAgentType(agentData.agent_type);
        }
        if (agentData) {
          setAgentAvatars({
            widget_avatar_1: agentData.widget_avatar_1,
            widget_avatar_2: agentData.widget_avatar_2,
            widget_avatar_3: agentData.widget_avatar_3
          });
        }
      }

      setData({
        ...pageData,
        featured_products: featuredProducts,
        custom_links: customLinks,
        featured_section: (pageData.featured_section as unknown as FeaturedSection) || {},
        reviews: await avisAAfficher(
          pageData.account_id as string,
          (pageData.reviews as unknown as Review[]) || [],
        ),
        a_une_page_avis: await pageAvisExiste(pageData.slug as string),
        reviews_display_count: (pageData as any).reviews_display_count ?? 3,
        background_color: pageData.background_color || undefined,
      });

      /* Agent de diagnostic de la marque : sert le bouton « Faire mon
         diagnostic ». Aucun agent actif de ce type ⇒ pas de section. */
      const { data: diag } = await supabase
        .from("agents")
        .select("id, agent_type")
        .eq("account_id", pageData.account_id)
        .in("agent_type", ["skin_diagnostic", "hair_diagnostic", "diagnostic"])
        .eq("is_active", true)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (diag?.id) setAgentDiagnostic({ id: diag.id as string, agent_type: diag.agent_type as string });

      setLoading(false);
    }

    fetchBrandPage();
  }, [slug]);

  const handleLinkClick = () => {
    /* La visite de /accueil-v2 ouvre la fenêtre du diagnostic : pas un clic. */
    if (slug && !montreeParLystes()) {
      // Fire-and-forget — don't await before window.open to avoid popup blocker
      void supabase.rpc("increment_brand_link_click", { p_slug: slug }).then(({ error: clickError }) => {
        if (clickError) {
          console.error("BrandLinkPage: increment click failed", clickError);
        }
      });
    }
  };

  const handleCtaClick = () => {
    handleLinkClick();

    if (data?.primary_cta_type === "agent" && agentId) {
      setAgentPopup({ id: agentId, type: agentType });
      setShowAgentPopup(true);
    } else if (data?.primary_cta_url) {
      window.open(data.primary_cta_url, "_blank");
    }
  };

  /* Loading state */
  if (loading) {
    return (
      <>
        <style>{brandLinkPageStyles}</style>
        <div className="blp-body p-4">
          <div className="blp-main-card shadow-2xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-400 border-t-transparent" />
          </div>
        </div>
      </>
    );
  }

  /* Not found state */
  if (notFound || !data) {
    return (
      <>
        <style>{brandLinkPageStyles}</style>
        <div className="blp-body p-4">
          <div className="blp-main-card shadow-2xl flex flex-col items-center justify-center text-center">
            <h1 className="text-xl font-semibold mb-2">Page non trouvée</h1>
            <p className="text-gray-500 text-sm">Cette page n'existe pas ou a été désactivée.</p>
          </div>
        </div>
      </>
    );
  }

  /* Main render : l'affichage est dans VueMultiLien, partagé avec la
     visite « Vos outils » de l'accueil, qui lui fournit ses données. */
  return (
    <VueMultiLien
      data={data}
      agentId={agentId}
      agentAvatars={agentAvatars}
      agentDiagnostic={agentDiagnostic}
      surMobile={surMobile}
      auClicLien={handleLinkClick}
      auClicCta={handleCtaClick}
    >
      {/* Agent Popup Modal */}
      {showAgentPopup && agentPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md h-[80vh] max-h-[700px] bg-white rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setShowAgentPopup(false)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-900" />
            </button>

            <iframe
              src={getAgentPopupUrl(agentPopup.type, agentPopup.id)}
              className="w-full h-full border-0"
              title="Agent"
              allow="camera; microphone"
            />
          </div>
        </div>
      )}
    </VueMultiLien>
  );
}

/* ========== AFFICHAGE ========== */
/**
 * Le multi-lien tel qu'il s'affiche, sans rien lire en base : la page le
 * nourrit de ce qu'elle a chargé, la visite « Vos outils » de l'accueil
 * (12/10/2026) de ses données de démonstration. Un seul dessin pour les deux.
 *
 * `demo` : la carte du conseiller s'affiche à toutes les largeurs (dans la
 * visite, le multi-lien doit montrer son chat IA), avec ses bulles fournies,
 * et la fenêtre du diagnostic s'ouvre dans l'écran de la visite.
 */
export function VueMultiLien({
  data,
  agentId,
  agentAvatars,
  agentDiagnostic,
  surMobile,
  auClicLien,
  auClicCta,
  demo,
  actus,
  children,
}: {
  data: BrandLinkData;
  agentId: string | null;
  agentAvatars: AgentAvatars | null;
  agentDiagnostic: { id: string; agent_type: string } | null;
  surMobile: boolean;
  auClicLien?: () => void;
  auClicCta?: () => void;
  demo?: { conseiller: DemoConseiller; diag?: DemoDiagFaq };
  /* Une entreprise sans diagnostic : le bouton noir « Nos dernières actus »
     à sa place, qui ouvre son magazine (BoutonActus). */
  actus?: { ouvrir: () => void };
  children?: ReactNode;
}) {
  const handleLinkClick = () => auClicLien?.();
  const handleCtaClick = () => auClicCta?.();
  /* Le produit que le visiteur regarde. L'avatar de la conversation bascule
     dessus, comme le widget montre l'image de la fiche ouverte. Volontairement
     collant : une fois touché, il reste jusqu'au suivant. Revenir au logo dès
     qu'on retire le doigt ferait clignoter l'avatar. */
  const [produitRegarde, setProduitRegarde] = useState<string | null>(null);

  return (
    <>
      <style>{brandLinkPageStyles}</style>
      <div className={"blp-body p-4" + (agentDiagnostic || actus ? " blp-avec-bdf" : "")} style={{ background: 'hsl(var(--muted))' }}>
        {/* Main white card */}
        <div className="blp-main-card shadow-2xl">
          {/* Profile Section : le logo et le nom sont partagés avec le contact
              et la FAQ posés dans ce cadre (MultiLienCommun). */}
          <LogoMultiLien nom={data.brand_name} logoUrl={data.logo_url || data.avatar_url} />

          <div className="pt-20 text-center">
            {/* Brand name + Verified badge */}
            <NomMultiLien nom={data.brand_name} verifie={data.is_verified} titre />

            {/* Conversation ouverte, en haut : sur mobile un bouton « discuter »
                se fait ignorer, une conversation déjà commencée non. */}
            {(surMobile || demo) && (
              <BrandAdvisorChatCard
                accountId={data.account_id}
                brandName={data.brand_name}
                logoUrl={data.logo_url || data.avatar_url}
                vignetteUrl={produitRegarde}
                demo={demo?.conseiller}
              />
            )}

            {/* Le diagnostic, SOUS le chat et hors de lui (JP, 11/10/2026) : le
                bouton noir « Faire un diagnostic AI » et sa petite phrase, puis
                la fenêtre du parcours et des questions, au dessin du widget des
                boutiques. Il remplace l'ancien lien « Faire mon diagnostic »
                du bas de page, et la pastille du chat se retire (règle
                .blp-avec-bdf). Seulement si la marque a un agent de
                diagnostic actif. */}
            {agentDiagnostic && (
              <div className="mb-[22px]">
                <BoutonDiagFaq
                  marque={data.brand_name}
                  slug={data.slug}
                  libelle="Questions & avis"
                  parcoursUrl={getAgentPopupUrl(agentDiagnostic.agent_type, agentDiagnostic.id)}
                  avis={(data.reviews ?? []).map((r) => ({ nom: r.name, note: r.rating, texte: r.text }))}
                  auClic={handleLinkClick}
                  deuxLignes
                  demo={demo?.diag}
                />
              </div>
            )}

            {!agentDiagnostic && actus && (
              <div className="mb-[22px]">
                <BoutonActus ouvrir={actus.ouvrir} deuxLignes />
              </div>
            )}

            {/* Product Showcase Row - 3 columns */}
            {data.featured_products.length > 0 && (
              <div className="flex items-stretch mb-[34px]">
                {data.featured_products.slice(0, 3).map((product, idx) => (
                  <Fragment key={product.id || idx}>
                    {/* Séparateur fin centré dans l'espace entre deux produits
                        (demandé par JP le 04/10) : un trait libre, pas une bordure de carte. */}
                    {idx > 0 && (
                      <div
                        className="w-px shrink-0 self-stretch bg-gray-200 mx-2"
                        aria-hidden="true"
                      />
                    )}
                    <div
                      className="flex-1 min-w-0 flex flex-col overflow-hidden pt-[11px]"
                      onPointerEnter={() => product.image_url && setProduitRegarde(product.image_url)}
                      onTouchStart={() => product.image_url && setProduitRegarde(product.image_url)}
                    >
                    <div className="h-[94px] bg-gray-100">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Photo
                        </div>
                      )}
                    </div>
                    {/* Prix + « Acheter → » en texte simple, alignés à gauche
                        (style demandé par JP le 04/10) : pas de boîte encadrée,
                        pas de majuscules, une flèche fine après le libellé. */}
                    <div className="p-2 bg-white text-left">
                      <span className="block text-[10px] font-semibold mb-0">
                        {product.price}
                        {product.price_suffix && (
                          <span className="text-[7px] text-gray-500 font-normal ml-0.5">{product.price_suffix}</span>
                        )}
                      </span>
                      {product.cta_url && (
                        <a
                          href={product.cta_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleLinkClick}
                          className="inline-flex items-center gap-1 text-[9px] font-semibold text-black transition-opacity hover:opacity-60"
                        >
                          <span className="border-b border-black">{product.cta_label && product.cta_label !== "ACHETER" ? product.cta_label : "Acheter"}</span>
                          <svg
                            className="shrink-0"
                            style={{ width: 9, height: 9, marginTop: 2, transform: "rotate(-45deg)" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  </Fragment>
                ))}
              </div>
            )}

            {/* CTA Principal - Opens agent popup (premier lien) */}
            {agentId && data.primary_cta_label && (
              <button
                onClick={handleCtaClick}
                className="blp-link-item flex items-center justify-between w-full bg-white"
              >
                {agentAvatars && (agentAvatars.widget_avatar_2 || agentAvatars.widget_avatar_3) && (
                  <div className="blp-avatars">
                    {agentAvatars.widget_avatar_2 && (
                      <img src={agentAvatars.widget_avatar_2} alt="" className="blp-avatar blp-avatar-2" />
                    )}
                    {agentAvatars.widget_avatar_3 && (
                      <img src={agentAvatars.widget_avatar_3} alt="" className="blp-avatar blp-avatar-3" />
                    )}
                    <span className="blp-ai-badge">IA</span>
                  </div>
                )}
                <span className="text-xs font-bold tracking-widest uppercase text-left">{data.primary_cta_label}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            )}

            {/* Links Section */}
            {data.custom_links.length > 0 && (
              <div className="space-y-[13px]">
                {data.custom_links.map((link, idx) =>
                  /* Un lien vers une page de la marque sur lystes.ai (contact,
                     FAQ, avis) reste dans le même onglet : la page s'ouvre
                     dans le cadre du multi-lien, avec son retour aux liens. */
                  estLienInterne(link.url) ? (
                    <Link
                      key={idx}
                      to={link.url}
                      onClick={handleLinkClick}
                      className="blp-link-item flex items-center justify-between bg-white"
                    >
                      <span className="text-xs font-bold tracking-widest uppercase text-left">{link.label}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  ) : (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleLinkClick}
                      className="blp-link-item flex items-center justify-between bg-white"
                    >
                      <span className="text-xs font-bold tracking-widest uppercase text-left">{link.label}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  ),
                )}
              </div>
            )}

            {/* Featured Section */}
            {data.featured_section.image_url && (
              <section className="mt-8 space-y-3 text-left">
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={data.featured_section.image_url}
                    alt={data.featured_section.title || "Featured"}
                    className="w-full"
                  />
                </div>
                {data.featured_section.title && (
                  <h3 className="text-base font-semibold text-gray-900">{data.featured_section.title}</h3>
                )}
                {data.featured_section.description && (
                  <p className="text-sm text-gray-500 leading-relaxed">{data.featured_section.description}</p>
                )}
                {data.featured_section.cta_url && (
                  <a
                    href={data.featured_section.cta_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleLinkClick}
                    className="blp-link-item flex items-center justify-between bg-white"
                  >
                    <span className="text-xs font-bold tracking-widest uppercase">{data.featured_section.cta_label || "En savoir plus"}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                )}
              </section>
            )}

            {/* Reviews Section - Carousel with Autoplay */}
            {data.reviews && data.reviews.length > 0 && (
              <ReviewsCarousel reviews={data.reviews.slice(0, data.reviews_display_count || 3)} slug={data.a_une_page_avis ? data.slug : undefined} />
            )}

            {/* Avis : quand la marque n'a encore aucun témoignage publié, on
                n'invente pas d'étoiles — on ouvre simplement la porte de la
                page des avis, qui n'existe que si la marque a une fiche. */}
            {(!data.reviews || data.reviews.length === 0) && data.a_une_page_avis && (
              <a
                href={`/${data.slug}/avis`}
                onClick={handleLinkClick}
                className="blp-link-item flex items-center justify-between bg-white mt-4"
              >
                <span className="text-xs font-bold tracking-widest uppercase text-left">Avis clients</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            )}

            {/* Footer Lystes AI */}
            <PiedMultiLien propulse="Propulsé par" />
          </div>
        </div>


        {children}
      </div>
    </>
  );
}

/* Helper to get the correct popup URL based on agent type */
function getAgentPopupUrl(agentType: string | null, agentId: string): string {
  // For try-on agents, route directly to demo page to avoid iframe redirect issues
  const tryOnUrl = getTryOnDemoUrl(agentType, agentId);
  if (tryOnUrl) {
    return `${window.location.origin}${tryOnUrl}`;
  }
  return `${window.location.origin}/agent/${agentId}`;
}
