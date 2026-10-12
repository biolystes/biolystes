import { useEffect, useState } from "react";
import { supabase } from "@lystes/integrations/supabase/client";
import { estAvisDefinitif, FILTRE_AVIS_DEFINITIFS, versProvenance, type Provenance } from "@lystes/lib/reviews/authenticity";

export type BrandReview = {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  author_name: string;
  initials: string;
  location: string | null;
  verified_purchase: boolean;
  published_at: string;
  date_label: string;
  product_id: string | null;
  brand_reply: string | null;
  /** Avis d'une testeuse : « Produit offert » s'affiche sous le nom (02/10/2026). */
  produit_offert?: boolean;
  source: string;
  /** D'où vient l'avis. Décide s'il compte. */
  provenance: Provenance;
  /** `true` quand l'avis compte : note moyenne, répartition, balisage, widget. */
  est_definitif: boolean;
};

export type BrandReviewsAggregate = {
  /** Tous les avis publiés, définitifs ou non. Ce qui s'affiche à l'écran. */
  reviews: BrandReview[];
  /**
   * Les avis qui comptent — aujourd'hui, tous les avis publiés. Conservé comme
   * ensemble distinct pour que la note moyenne, la répartition et le balisage
   * `aggregateRating` aient un seul point d'entrée si la règle change.
   */
  reviewsReels: BrandReview[];
  avgRating: number;
  /** Nombre d'avis qui comptent (exact, non plafonné par `limit`). */
  totalCount: number;
  /** Nombre d'avis publiés (exact). Identique à `totalCount`. */
  totalAffiche: number;
  distribution: { stars: number; pct: number }[];
  loading: boolean;
};


function relativeDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return "À l'instant";
  if (diffH < 24) return `Il y a ${diffH} heure${diffH > 1 ? "s" : ""}`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `Il y a ${diffD} jour${diffD > 1 ? "s" : ""}`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

function buildDistribution(reviews: BrandReview[]): { stars: number; pct: number }[] {
  const total = reviews.length || 1;
  return [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return { stars, pct: Math.round((count / total) * 100) };
  });
}

/**
 * Récupère les avis réels dans public.reviews pour une marque (filtrable par produit).
 * Retourne vide s'il n'y en a aucun — l'appelant peut alors se rabattre sur des données factices pour les marques de démo.
 */
export function useBrandReviews(opts: {
  accountId: string | null | undefined;
  productId?: string | null;
  limit?: number;
}): BrandReviewsAggregate {
  const { accountId, productId, limit = 50 } = opts;
  const VIDE: BrandReviewsAggregate = {
    reviews: [],
    reviewsReels: [],
    avgRating: 0,
    totalCount: 0,
    totalAffiche: 0,
    distribution: buildDistribution([]),
    loading: false,
  };
  const [state, setState] = useState<BrandReviewsAggregate>({ ...VIDE, loading: true });

  useEffect(() => {
    if (!accountId) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    let cancelled = false;
    (async () => {
      // Tout avis actif et publié s'affiche ET compte. La règle vit dans
      // `@/lib/reviews/authenticity`, jamais réécrite ici.
      let q = supabase
        .from("reviews")
        .select(
          "id, rating, title, content, first_name, location, verified_purchase, published_at, product_id, response, source, provenance, produit_offert",
        )
        .eq("account_id", accountId)
        .eq("is_active", true)
        .eq("moderation_status", "published")
        .order("featured_order", { ascending: true, nullsFirst: false })
        .order("published_at", { ascending: false })
        .limit(limit);
      if (productId) q = q.eq("product_id", productId);

      // Les totaux ne peuvent pas être déduits de la page chargée : elle est
      // plafonnée à `limit`. On compte donc à part, aux mêmes conditions.
      const base = () => {
        let c = supabase
          .from("reviews")
          .select("id", { count: "exact", head: true })
          .eq("account_id", accountId)
          .eq("is_active", true)
          .eq("moderation_status", "published");
        if (productId) c = c.eq("product_id", productId);
        return c;
      };
      const qCountReels = base().or(FILTRE_AVIS_DEFINITIFS);
      const qCountTous = base();

      const [{ data, error }, { count: countReels }, { count: countTous }] = await Promise.all([
        q,
        qCountReels,
        qCountTous,
      ]);
      if (cancelled) return;
      if (error || !data) {
        setState(VIDE);
        return;
      }
      const reviews: BrandReview[] = data.map((r: any) => {
        // `last_name` n'est pas lisible publiquement (PII) : on n'affiche que le prénom.
        const author = String(r.first_name ?? "").trim() || "Client vérifié";
        return {
          id: r.id,
          rating: r.rating ?? 5,
          title: r.title,
          content: r.content ?? "",
          author_name: author,
          initials: initialsOf(author) || "C",
          location: r.location,
          verified_purchase: r.verified_purchase ?? false,
          published_at: r.published_at ?? new Date().toISOString(),
          date_label: relativeDate(r.published_at ?? new Date().toISOString()),
          product_id: r.product_id,
          brand_reply: r.response,
          produit_offert: r.produit_offert === true,
          source: r.source ?? "manual",
          provenance: versProvenance(r.provenance),
          est_definitif: estAvisDefinitif(r.provenance),
        };
      });
      const reviewsReels = reviews.filter((r) => r.est_definitif);
      const avg =
        reviewsReels.length > 0
          ? Math.round((reviewsReels.reduce((s, r) => s + r.rating, 0) / reviewsReels.length) * 10) / 10
          : 0;
      setState({
        reviews,
        reviewsReels,
        avgRating: avg,
        totalCount: countReels ?? reviewsReels.length,
        totalAffiche: countTous ?? reviews.length,
        distribution: buildDistribution(reviewsReels),
        loading: false,
      });


    })();
    return () => {
      cancelled = true;
    };
  }, [accountId, productId, limit]);

  return state;
}
