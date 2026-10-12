import { LYSTES_ENV } from "@lystes/integrations/supabase/env";
/**
 * LE MAGAZINE D'UNE MARQUE, LU DANS LA BONNE TABLE (01/10/2026).
 *
 * Mesuré avant d'écrire (carte du 01/10) : la page /<marque>/blog (aujourd'hui /mag) lisait
 * `magazine_articles`, les 60 derniers articles TOUTES marques, puis filtrait
 * dans le navigateur. Les articles écrits par la rédaction de marque, avec
 * leur SEO, leur GEO et leurs produits, vivent dans `brand_magazine_articles`
 * et n'étaient affichés nulle part ; une marque disparaissait dès que
 * soixante articles plus récents existaient ailleurs.
 *
 * Ici, le filtre est fait par la base : compte de la marque et statut
 * « publie » (la politique RLS ne laisse de toute façon sortir que ceux-là).
 * Les deux anciens articles, rattachés par leur étiquette, restent lus dans
 * `magazine_articles`, avec le même filtre côté base.
 */
import { supabase } from "@lystes/integrations/supabase/client";
import type { QuestionReponse } from "../../../../supabase/functions/_shared/article-marque-rendu";
import { faqDe } from "../../../../supabase/functions/_shared/article-marque-rendu";
import { lireReglageCanonique } from "../../../../supabase/functions/_shared/magazine-canonique";

export interface PhotoArticle {
  url: string;
  alt: string;
  generee: boolean;
}

export interface ArticleMarque {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  excerpt: string | null;
  body: string;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  published_at: string | null;
  updated_at: string | null;
  read_minutes: number | null;
  signature: string | null;
  mention_ia: boolean;
  photos: PhotoArticle[];
  product_ids: string[];
  faq: QuestionReponse[];
  seo: { title: string | null; meta_description: string | null; keywords: string[] };
  featured: boolean;
}

export interface ProduitDeLArticle {
  id: string;
  nom: string;
  url: string;
  image: string | null;
}

export interface MarqueDuMagazine {
  accountId: string;
  slug: string;
  nom: string;
}

/** Nombre d'articles lus pour la page du magazine. */
export const ARTICLES_PAR_PAGE = 60;

/**
 * Les colonnes d'un article que lit un visiteur : celles qu'affiche la page,
 * rien de plus. Avec « * », chaque visiteur recevait aussi les colonnes
 * internes de la rédaction (moteur, erreur de rédaction, agence, angle).
 * Même liste que la fonction publique `magazine-marque-public`.
 */
export const COLONNES_ARTICLE_PUBLIC =
  "id, slug, title, dek, excerpt, body, hero_image_url, hero_image_alt, published_at, updated_at, read_minutes, signature, redige_par_ia, product_ids, photos, geo, seo, tags, status";

type Ligne = Record<string, unknown>;

const texte = (v: unknown) => (typeof v === "string" && v.trim() ? v : null);

/** Une ligne de `brand_magazine_articles`, ramenée à la forme commune. */
export function depuisArticleMarque(l: Ligne): ArticleMarque {
  const seo = (l.seo && typeof l.seo === "object" ? l.seo : {}) as Ligne;
  return {
    id: String(l.id),
    slug: String(l.slug),
    title: String(l.title ?? ""),
    dek: texte(l.dek),
    excerpt: texte(l.excerpt),
    body: String(l.body ?? ""),
    hero_image_url: texte(l.hero_image_url),
    hero_image_alt: texte(l.hero_image_alt),
    published_at: texte(l.published_at),
    updated_at: texte(l.updated_at),
    read_minutes: typeof l.read_minutes === "number" ? l.read_minutes : null,
    signature: texte(l.signature),
    mention_ia: l.redige_par_ia === true,
    photos: (Array.isArray(l.photos) ? l.photos : [])
      .filter((p): p is Ligne => !!p && typeof (p as Ligne).url === "string")
      .map((p) => ({ url: String(p.url), alt: String(p.alt ?? l.title ?? ""), generee: p.generee === true })),
    product_ids: Array.isArray(l.product_ids) ? l.product_ids.map(String) : [],
    faq: faqDe(l.geo),
    seo: {
      title: texte(seo.title),
      meta_description: texte(seo.meta_description),
      keywords: Array.isArray(seo.keywords) ? seo.keywords.map(String) : [],
    },
    featured: false,
  };
}

/** Un ancien article (`magazine_articles`), écrit par la rédaction IA hebdomadaire. */
export function depuisAncienArticle(l: Ligne): ArticleMarque {
  return {
    id: String(l.id),
    slug: String(l.slug),
    title: String(l.title ?? ""),
    dek: texte(l.dek),
    excerpt: texte(l.excerpt),
    body: String(l.body ?? ""),
    hero_image_url: texte(l.hero_image_url),
    hero_image_alt: texte(l.hero_image_alt),
    published_at: texte(l.published_at),
    updated_at: texte(l.updated_at),
    read_minutes: typeof l.read_minutes === "number" ? l.read_minutes : null,
    signature: texte(l.author_name),
    mention_ia: true,
    photos: [],
    product_ids: [],
    faq: [],
    seo: { title: null, meta_description: null, keywords: [] },
    featured: l.featured === true,
  };
}

/** Du plus récent au plus ancien ; un article sans date passe après. */
export function trierParDate(articles: ArticleMarque[]): ArticleMarque[] {
  return [...articles].sort((a, b) => String(b.published_at ?? "").localeCompare(String(a.published_at ?? "")));
}

export async function chargerMarque(slug: string): Promise<MarqueDuMagazine | null> {
  const { data, error } = await supabase
    .from("account_landing_config")
    .select("account_id, slug, brand_name")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!data?.account_id) return null;
  return { accountId: String(data.account_id), slug: String(data.slug ?? slug), nom: String(data.brand_name ?? slug) };
}

/** Les articles publiés d'une marque : les siens, puis ses anciens rattachés par étiquette. */
export async function chargerArticlesMarque(slug: string): Promise<ArticleMarque[]> {
  const marque = await chargerMarque(slug);
  const [neufs, anciens] = await Promise.all([
    marque
      ? supabase
          .from("brand_magazine_articles")
          .select(COLONNES_ARTICLE_PUBLIC)
          .eq("account_id", marque.accountId)
          .eq("status", "publie")
          .order("published_at", { ascending: false })
          .limit(ARTICLES_PAR_PAGE)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from("magazine_articles")
      .select("*")
      .eq("published", true)
      .contains("tags", [slug])
      .order("published_at", { ascending: false })
      .limit(ARTICLES_PAR_PAGE),
  ]);
  if (neufs.error) throw neufs.error;
  if (anciens.error) throw anciens.error;
  return trierParDate([
    ...((neufs.data ?? []) as unknown as Ligne[]).map(depuisArticleMarque),
    ...((anciens.data ?? []) as Ligne[]).map(depuisAncienArticle),
  ]).slice(0, ARTICLES_PAR_PAGE);
}

/** Un article publié de la marque, et les fiches qu'il cite (adresse sur le site de la marque). */
export async function chargerArticleMarque(
  slug: string,
  slugArticle: string,
): Promise<{ marque: MarqueDuMagazine | null; article: ArticleMarque | null; produits: ProduitDeLArticle[] }> {
  const marque = await chargerMarque(slug);
  let article: ArticleMarque | null = null;
  if (marque) {
    const { data, error } = await supabase
      .from("brand_magazine_articles")
      .select(COLONNES_ARTICLE_PUBLIC)
      .eq("account_id", marque.accountId)
      .eq("slug", slugArticle)
      .eq("status", "publie")
      .maybeSingle();
    if (error) throw error;
    /* Les colonnes de l'agence (signature, photos, redige_par_ia) ne sont pas
       encore dans les types générés : la ligne est relue par depuisArticleMarque. */
    if (data) article = depuisArticleMarque(data as unknown as Ligne);
  }
  if (!article) {
    const { data, error } = await supabase
      .from("magazine_articles")
      .select("*")
      .eq("slug", slugArticle)
      .eq("published", true)
      .contains("tags", [slug])
      .maybeSingle();
    if (error) throw error;
    if (data) article = depuisAncienArticle(data as Ligne);
  }
  if (!article || !marque || !article.product_ids.length) return { marque, article, produits: [] };

  /* Colonnes lisibles par un visiteur non connecté seulement
     (20260820190036 : liste blanche `anon` sur products). `is_active` n'y
     est pas : la demander faisait refuser toute la requête (42501), et la
     page affichait « Cet article est introuvable », en noindex, à chaque
     visiteur et à Googlebot. */
  const { data: produits, error } = await supabase
    .from("products")
    .select("id, name, image_url, woo_permalink, purchase_link")
    .eq("account_id", marque.accountId)
    .in("id", article.product_ids);
  if (error) throw error;
  return {
    marque,
    article,
    produits: ((produits ?? []) as Ligne[])
      .filter((p) => p.woo_permalink || p.purchase_link)
      .map((p) => ({
        id: String(p.id),
        nom: String(p.name),
        url: String(p.woo_permalink || p.purchase_link),
        image: texte(p.image_url),
      })),
  };
}

/** Une carte d'article sous une fiche produit : de quoi l'afficher, rien de plus. */
export interface ArticleDuProduit {
  id: string;
  slug: string;
  title: string;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  read_minutes: number | null;
  published_at: string | null;
}

/** Nombre d'articles lus sous une fiche produit. */
export const ARTICLES_PAR_PRODUIT = 12;

/**
 * Les articles publiés de la marque qui citent ce produit (02/10/2026), du
 * plus récent au plus ancien. Le filtre est fait par la base : compte,
 * statut « publie » et `product_ids` contenant la fiche (index GIN
 * brand_magazine_articles_products_idx). Les anciens articles
 * (`magazine_articles`) ne citent aucune fiche : ils ne sont pas lus ici.
 */
export async function chargerArticlesDuProduit(accountId: string, productId: string): Promise<ArticleDuProduit[]> {
  if (!accountId || !productId) return [];
  const { data, error } = await supabase
    .from("brand_magazine_articles")
    .select("id, slug, title, hero_image_url, hero_image_alt, read_minutes, published_at")
    .eq("account_id", accountId)
    .eq("status", "publie")
    .contains("product_ids", [productId])
    .order("published_at", { ascending: false })
    .limit(ARTICLES_PAR_PRODUIT);
  if (error) throw error;
  return ((data ?? []) as unknown as Ligne[])
    .filter((l) => texte(l.slug) && texte(l.title))
    .map((l) => ({
      id: String(l.id),
      slug: String(l.slug),
      title: String(l.title),
      hero_image_url: texte(l.hero_image_url),
      hero_image_alt: texte(l.hero_image_alt),
      read_minutes: typeof l.read_minutes === "number" ? l.read_minutes : null,
      published_at: texte(l.published_at),
    }));
}

/* ------------------------------------------------------------------------
 * [lot 11] Les modules de conseil dans l'article, et la canonique choisie.
 * --------------------------------------------------------------------- */

/** Les types d'agent qui portent un parcours de diagnostic (même liste que le multi-lien). */
export const TYPES_AGENT_DIAGNOSTIC = ["skin_diagnostic", "hair_diagnostic", "diagnostic"] as const;

export interface AgentDiagnosticMarque {
  id: string;
  agent_type: string;
}

/**
 * L'agent de diagnostic actif de la marque, ou null. Même lecture que
 * BrandLinkPage : sans agent actif de ce type, l'article ne montre aucun
 * bouton de diagnostic. Ne lève jamais : un échec vaut « pas de diagnostic ».
 */
export async function chargerAgentDiagnostic(accountId: string): Promise<AgentDiagnosticMarque | null> {
  if (!accountId) return null;
  try {
    const { data, error } = await supabase
      .from("agents")
      .select("id, agent_type")
      .eq("account_id", accountId)
      .in("agent_type", [...TYPES_AGENT_DIAGNOSTIC])
      .eq("is_active", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error || !data?.id) return null;
    return { id: String(data.id), agent_type: String(data.agent_type) };
  } catch {
    return null;
  }
}

/**
 * La canonique de l'article quand la marque a choisi son propre site
 * (réglage `magazine_canonique`, migration 20261012201101), sinon null :
 * l'appelant garde l'adresse lystes.ai. Ne lève jamais.
 *
 * Lue en deux temps pour ne rien casser : le réglage d'abord, dans une
 * requête à part (si la colonne n'existe pas encore en base, seule cette
 * requête échoue, et la page garde lystes.ai) ; puis, seulement pour une
 * marque qui a choisi son site, l'adresse servie par magazine-marque-public,
 * la même que pose l'extension WordPress.
 */
export async function chargerCanoniqueDeLaMarque(slug: string, slugArticle: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("account_landing_config")
      .select("magazine_canonique" as "slug")
      .eq("slug", slug)
      .maybeSingle();
    if (error) return null;
    const reglage = lireReglageCanonique((data as unknown as Ligne | null)?.magazine_canonique);
    if (reglage !== "site_marque") return null;
    const base = LYSTES_ENV.VITE_SUPABASE_URL as string | undefined;
    if (!base) return null;
    const r = await fetch(
      `${base}/functions/v1/magazine-marque-public?marque=${encodeURIComponent(slug)}&article=${encodeURIComponent(slugArticle)}`,
    );
    if (!r.ok) return null;
    const d = (await r.json()) as { article?: { canonique?: unknown } };
    const c = d.article?.canonique;
    return typeof c === "string" && /^https?:\/\/[^\s"'<>]+$/i.test(c) ? c : null;
  } catch {
    return null;
  }
}
