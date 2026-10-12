import { useEffect, useState } from "react";
import { supabase } from "@lystes/integrations/supabase/client";
import { getBrandWebsite } from "@lystes/features/landing-particuliers/lib/brandWebsites";
import { generateProductSlug } from "@lystes/lib/products/slug";
import { getFashionBrand } from "@lystes/features/landing-particuliers/lib/fashionBrandsConfig";
import { getFoodBrand } from "@lystes/features/landing-particuliers/lib/foodBrandsConfig";

/** Build a synthetic BrandLandingResolved from local in-code brand catalogs
 *  (lolo-paris, delicesducongo) so /:slug, /:slug/avis and /:slug/:productSlug
 *  all work even when no DB row exists yet. */
function buildLocalBrandLanding(slug: string): BrandLandingResolved | null {
  const fashion = getFashionBrand(slug);
  const food = getFoodBrand(slug);
  const src = fashion ?? food;
  if (!src) return null;

  const products: BrandProductCard[] = src.products
    .filter((p) => !!p.image)
    .map((p) => {
      // Ces deux champs valaient `4,5 + (hash du produit % 6) / 10` et
      // `4 + (hash % 9)` : une note entre 4,5 et 5 et un nombre d'avis entre 4
      // et 12, fabriqués par une fonction de hachage. Rien ne les mesurait.
      // Zéro signifie « aucun avis », et l'affichage masque alors la notation
      // plutôt que de montrer des étoiles vides.
      return {
        id: p.id,
        slug: p.slug ?? generateProductSlug(p.name),
        name: p.name,
        image_url: p.image,
        tagline: (p as { category?: string }).category ?? null,
        rating: 0,
        reviewsCount: 0,
        purchaseUrl: null,
      };
    });

  const heroProducts = products.slice(0, 3).map((p) => ({
    image_url: p.image_url,
    name: p.name,
  }));

  return {
    accountId: `local:${slug}`,
    brandName: src.name,
    slug,
    enabled: true,
    complexes: null,
    chatPlaceholder: null,
    heroProducts,
    products,
    websiteUrl: getBrandWebsite(slug, null),
    hasServices: false,
    hasProducts: products.length > 0,
  };
}


export interface BrandProductCard {
  id: string;
  slug: string;
  name: string;
  image_url: string;
  tagline: string | null;
  rating: number;
  reviewsCount: number;
  purchaseUrl: string | null;
}

export interface BrandLandingResolved {
  accountId: string;
  brandName: string;
  slug: string;
  enabled: boolean;
  complexes: string[] | null;
  chatPlaceholder: string | null;
  heroProducts: { image_url: string; name: string }[];
  products: BrandProductCard[];
  websiteUrl: string | null;
  hasServices: boolean;
  hasProducts: boolean;
}

/** Stock images d'institut beauté (Unsplash) pour la hero d'un compte sans
 *  produits mais avec des prestations (ex: Wirkskin). */
const INSTITUT_HERO_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80",
  "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&q=80",
];

/** Hero fallback pour marques capillaires sans produits encore importés. */
const HAIRCARE_HERO_FALLBACK_IMAGES = [
  { image_url: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&q=80", name: "Soin capillaire" },
  { image_url: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=400&q=80", name: "Shampoing" },
  { image_url: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&q=80", name: "Masque cheveux" },
];

/** Hero fallback pour marques skincare sans produits encore importés. */
const SKINCARE_HERO_FALLBACK_IMAGES = [
  { image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80", name: "Sérum" },
  { image_url: "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&q=80", name: "Crème" },
  { image_url: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80", name: "Soin visage" },
];

const PAIN_POINTS_STALE_DAYS = 30;

/**
 * Raccourcit un "complexe" pour le texte tournant : on garde uniquement le
 * premier symptôme. "ta peau sèche et rugueuse" → "ta peau sèche",
 * "ton teint terne et sans éclat" → "ton teint terne",
 * "tes signes de l'âge (rides et ridules)" → "tes signes de l'âge".
 */
function shortenComplex(raw: string): string {
  let s = raw.trim();
  // Coupe au premier séparateur additif
  s = s.split(/\s+(?:et|ou|&|\+|,|\/|\(|–|—|-)\s+/i)[0];
  // Coupe sur ponctuation restante
  s = s.split(/[(\/,–—]/)[0];
  return s.trim().replace(/[.;:!?]+$/, "");
}

function dedupeShort(list: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    const short = shortenComplex(item);
    const key = short.toLowerCase();
    if (short && !seen.has(key)) {
      seen.add(key);
      out.push(short);
    }
  }
  return out;
}

function buildPlaceholder(complexes: string[] | null): string | null {
  if (!complexes || complexes.length === 0) return null;
  const examples = complexes.slice(0, 3).map((c) => `"${c}"`).join(", ");
  return `Dis-moi ce que tu veux améliorer… ex : ${examples}`;
}

/**
 * Résout un slug de marque (ex: 'sevmylook') vers sa configuration de landing
 * publique + 3 produits aléatoires de son catalogue.
 *
 * Retourne `null` si :
 * - le slug n'existe pas,
 * - la landing est désactivée,
 * - le compte n'a aucun produit actif (pas de hero possible).
 */
export function useBrandLanding(slug: string | undefined) {
  const [data, setData] = useState<BrandLandingResolved | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!slug) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    (async () => {
      setLoading(true);
      setNotFound(false);

      // 1) Résoudre slug → config (inclut le nom de la marque, lisible publiquement)
      const { data: config, error: configErr } = await supabase
        .from("account_landing_config")
        .select(
          "account_id, slug, complexes, complexes_auto, complexes_auto_generated_at, complexes_override_enabled, enabled, brand_name"
        )
        .eq("slug", slug)
        .maybeSingle();

      if (cancelled) return;

      if (configErr || !config || !config.enabled) {
        const local = buildLocalBrandLanding(slug);
        if (local) {
          setData(local);
          setLoading(false);
          return;
        }
        setNotFound(true);
        setLoading(false);
        return;
      }


      const accountId = config.account_id as string;
      const brandName = (config.brand_name as string | null) ?? slug;

      // 2) Produits avec image
      const { data: products } = await supabase
        .from("products")
        .select(
          "id, name, image_url, images, short_description, category, average_rating, review_count, purchase_link, woo_permalink"
        )
        .eq("account_id", accountId)
        // Les fiches désactivées sont exclues par les règles d'accès publiques
        // (le visiteur n'a pas le droit de lire la colonne is_active).
        .not("image_url", "is", null)
        .limit(60);

      if (cancelled) return;

      const BLOCKED_HERO_IMAGE_FRAGMENTS = [
        "P9xKy_MZkrvk7Be0HGexocB9afzNiaVx",
        "Capture-decran-2025-12-10-a-14.50.43",
      ];
      const isBlocked = (url: string) =>
        BLOCKED_HERO_IMAGE_FRAGMENTS.some((frag) => url.includes(frag));

      const withImages = (products ?? [])
        .map((p) => {
          const img =
            p.image_url ||
            (Array.isArray(p.images) && p.images.length > 0 ? String(p.images[0]) : null);
          return img && !isBlocked(img) ? { name: p.name as string, image_url: img } : null;
        })
        .filter((p): p is { name: string; image_url: string } => !!p);

      // Liste complète des produits cliquables (pour le carrousel "Produits phares")
      const usedSlugs = new Set<string>();
      const productsList: BrandProductCard[] = (products ?? [])
        .map((p) => {
          const img =
            p.image_url ||
            (Array.isArray(p.images) && p.images.length > 0 ? String(p.images[0]) : null);
          if (!img || isBlocked(img)) return null;
          let s = generateProductSlug(p.name as string);
          let i = 2;
          while (usedSlugs.has(s)) s = `${generateProductSlug(p.name as string)}-${i++}`;
          usedSlugs.add(s);
          // `average_rating` et `review_count` sont renseignées pour 2 443 des
          // 2 473 produits, et elles dérivent des 9 765 avis de démonstration :
          // elles ne mesurent aucun client. Tant qu'elles ne seront pas
          // recalculées depuis des avis réels, elles ne sont pas affichées.
          // Voir src/lib/reviews/authenticity.ts.
          const rating = 0;
          const reviewsCount = 0;
          return {
            id: p.id as string,
            slug: s,
            name: p.name as string,
            image_url: img,
            tagline: (p.short_description as string | null) ?? (p.category as string | null) ?? null,
            rating,
            reviewsCount,
            purchaseUrl:
              (p.purchase_link as string | null) ?? (p.woo_permalink as string | null) ?? null,
          };
        })
        .filter((p): p is BrandProductCard => !!p);

      const shuffled = [...withImages].sort(() => Math.random() - 0.5);
      let heroProducts = shuffled.slice(0, 3);
      const hasProducts = heroProducts.length > 0;

      // 2b) Prestations (institut) + sector + website du compte
      const [{ count: servicesCount }, { data: account }] = await Promise.all([
        supabase
          .from("services")
          .select("id", { count: "exact", head: true })
          .eq("account_id", accountId)
          .eq("is_active", true),
        supabase
          .from("accounts")
          .select("website, sector")
          .eq("id", accountId)
          .maybeSingle(),
      ]);
      const hasServices = (servicesCount ?? 0) > 0;
      const sector = ((account?.sector as string | null) ?? "").toLowerCase();
      const isHaircare = sector.includes("hair") || sector.includes("capill") || sector.includes("cheveu");

      // Fallback hero pour les comptes sans produits
      if (!hasProducts) {
        if (hasServices) {
          heroProducts = INSTITUT_HERO_FALLBACK_IMAGES.map((image_url, i) => ({
            image_url,
            name: ["Soin visage", "Massage", "Beauté"][i] ?? "Prestation",
          }));
        } else {
          heroProducts = isHaircare
            ? HAIRCARE_HERO_FALLBACK_IMAGES
            : SKINCARE_HERO_FALLBACK_IMAGES;
        }
      }

      if (heroProducts.length === 0) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      /* L'adresse du site du marchand. `accounts` n'est pas lisible par le
         navigateur d'un visiteur (règles d'accès : membre du compte ou super
         admin), donc en page publique `account.website` arrive vide et le
         repli codé ne couvre que quelques marques. La fonction
         sécurité-définitrice `lire_site_marque` ne rend alors que cette
         adresse — site déclaré, sinon boutique connectée — et rien d'autre. */
      let websiteUrl = getBrandWebsite(
        config.slug as string,
        (account?.website as string | null) ?? null
      );
      if (!websiteUrl) {
        /* types.ts est auto-généré et ne connaît pas encore la fonction :
           l'appel est typé à la main, sans toucher au fichier généré. */
        const rpc = supabase.rpc.bind(supabase) as (
          fn: string,
          args: Record<string, unknown>,
        ) => Promise<{ data: unknown }>;
        const { data: site } = await rpc("lire_site_marque", {
          p_slug: config.slug as string,
        });
        websiteUrl = (site as string | null) ?? null;
      }

      // 4) Résolution finale des complexes :
      //    - override manuel actif + liste non vide → liste manuelle,
      //    - sinon liste auto (générée par IA),
      //    - sinon null (RotatingWord retombera sur les défauts Lystes).
      const manualList = (config.complexes as string[] | null) ?? null;
      const autoList = (config.complexes_auto as string[] | null) ?? null;
      const overrideEnabled = Boolean(config.complexes_override_enabled);
      const finalComplexes =
        overrideEnabled && manualList && manualList.length > 0
          ? manualList
          : autoList && autoList.length > 0
            ? autoList
            : null;

      // 5) Auto-trigger derive-brand-pain-points si pas encore généré ou périmé.
      const generatedAt = config.complexes_auto_generated_at as string | null;
      const isStale =
        !generatedAt ||
        (Date.now() - new Date(generatedAt).getTime()) / 86400000 > PAIN_POINTS_STALE_DAYS;
      if (isStale && (!autoList || autoList.length === 0)) {
        // fire & forget, ne bloque pas le rendu
        supabase.functions
          .invoke("derive-brand-pain-points", { body: { account_id: accountId } })
          .catch((e) => console.warn("[useBrandLanding] derive failed", e));
      }

      const shortenedComplexes = finalComplexes ? dedupeShort(finalComplexes) : null;

      setData({
        accountId,
        brandName,
        slug: config.slug as string,
        enabled: true,
        complexes: shortenedComplexes && shortenedComplexes.length > 0 ? shortenedComplexes : null,
        chatPlaceholder: buildPlaceholder(shortenedComplexes),
        heroProducts,
        products: productsList,
        websiteUrl,
        hasServices,
        hasProducts,
      });
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { data, loading, notFound };
}
