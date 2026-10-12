import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Link } from "@lystes/lib/lien-lystes";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Button } from "@lystes/components/ui/button";
import lystesLogo from "@lystes/assets/particuliers/lystes-logo.png";
import { useBrandLandingContext } from "@lystes/contexts/BrandLandingContext";
import { supabase } from "@lystes/integrations/supabase/client";
import { getBrandWebsite } from "@lystes/features/landing-particuliers/lib/brandWebsites";
import { HeaderLanguageSelector } from "@lystes/components/landing/HeaderLanguageSelector";
import { getFashionBrand } from "../../lib/fashionBrandsConfig";
import { getFoodBrand } from "../../lib/foodBrandsConfig";
import { getWigBrand } from "../../lib/wigBrandsConfig";

/**
 * Header public unifié — utilisé sur la home /p, /p/transformations,
 * /p/pros/recherche et toute autre page publique particuliers.
 * Tous les libellés sont traduits via i18n (clé `homeLanding.header.*`).
 */
export default function LandingHeader() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const contextBrand = useBrandLandingContext();
  // Hide persistent universe nav on the home page (chips already rendered inline there)
  // and on brand-scoped pages.
  const isHome = location.pathname === "/" || location.pathname === "/p";
  const brandAccountId = searchParams.get("brand");
  const [urlBrand, setUrlBrand] = useState<{
    accountId: string;
    brandName: string;
    slug: string;
    websiteUrl: string | null;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!brandAccountId || contextBrand?.accountId === brandAccountId) {
      setUrlBrand(null);
      return;
    }

    (async () => {
      const { data: cfg } = await supabase
        .from("account_landing_config")
        .select("account_id, slug, brand_name")
        .eq("account_id", brandAccountId)
        .maybeSingle();

      if (cancelled || !cfg) return;

      const { data: account } = await supabase
        .from("accounts")
        .select("website")
        .eq("id", brandAccountId)
        .maybeSingle();

      if (cancelled) return;

      setUrlBrand({
        accountId: String(cfg.account_id),
        brandName: (cfg.brand_name as string | null) ?? String(cfg.slug ?? brandAccountId),
        slug: String(cfg.slug ?? ""),
        websiteUrl: getBrandWebsite(
          (cfg.slug as string | null) ?? null,
          (account?.website as string | null) ?? null,
        ),
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [brandAccountId, contextBrand?.accountId]);

  const brand = contextBrand ?? urlBrand;
  const isBrand = !!brand || !!brandAccountId;

  const routeSlug = location.pathname.replace(/^\/+/, "").split("/")[0];
  const routeFashionBrand = getFashionBrand(routeSlug);
  const routeFoodBrand = getFoodBrand(routeSlug);
  const routeWigBrand = getWigBrand(routeSlug);
  const routeBrand = !brand && (routeFashionBrand || routeFoodBrand || routeWigBrand)
    ? {
        accountId: routeWigBrand?.accountId ?? `local:${routeSlug}`,
        brandName: routeFashionBrand?.name ?? routeFoodBrand?.name ?? routeWigBrand?.name ?? routeSlug,
        slug: routeSlug,
        websiteUrl: getBrandWebsite(
          routeSlug,
          routeFoodBrand?.website ?? null,
        ),
      }
    : null;
  const resolvedBrand = brand ?? routeBrand;
  // Le bandeau d'une marque ne montre plus ni liens de navigation internes
  // ni sélecteur de devise/langue : seuls le logo, « Connexion » et le bouton
  // du site restent. Le sélecteur revient sur les pages qui ne sont pas une
  // page de marque.
  const onBrandPage = isBrand || !!resolvedBrand;
  const brandSite = resolvedBrand?.websiteUrl ?? null;
  const brandSiteLabel = (() => {
    if (!brandSite) return null;
    try {
      return new URL(brandSite).hostname.replace(/^www\./, "");
    } catch {
      return brandSite.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
    }
  })();

  const homeHref = resolvedBrand?.slug ? `/${resolvedBrand.slug}` : "/";

  return (
    <>
      <header className="relative z-[300] px-4 sm:px-6 py-[3px] flex items-center justify-between bg-transparent">
        <Link to={homeHref} className="inline-flex items-center">
          <img
            src={lystesLogo}
            alt="Lystes & Partners"
            className="w-12 h-12 sm:w-[3.1rem] sm:h-[3.1rem] object-contain animate-spin-slow"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2" style={{ fontFamily: "'Jost', sans-serif" }}>
          {!isBrand && (
            <Link to="/product-agent">
              <Button variant="ghost" size="sm">{t("homeLanding.header.pro_question")}</Button>
            </Link>
          )}
          {!onBrandPage && <HeaderLanguageSelector />}
          <Link to="/p/auth/login">
            <Button variant="ghost" size="sm">{t("homeLanding.header.login")}</Button>
          </Link>
          {isBrand && brandSite ? (
            <a
              href={brandSite}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 pl-5 pr-1.5 py-1.5 rounded-full bg-black text-white text-sm font-medium hover:opacity-90 transition"
            >
              <span>{brandSiteLabel ?? t("homeLanding.header.visitSite")}</span>
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black transition-transform group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
          ) : !isBrand ? (
            <Link
              to="/p/auth/register"
              className="group inline-flex items-center gap-2 pl-5 pr-1.5 py-1.5 rounded-full bg-black text-white text-sm font-medium hover:opacity-90 transition"
            >
              <span>{t("homeLanding.header.register")}</span>
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-black transition-transform group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </Link>
          ) : null}
        </nav>

        {/* Mobile: compact CTA + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {!onBrandPage && <HeaderLanguageSelector />}
          {(isBrand || !!resolvedBrand) ? (
            brandSite ? (
            <a
              href={brandSite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-10 px-4 max-w-[52vw] rounded-full bg-black text-white text-[13px] font-medium hover:opacity-90 transition"
            >
              {/* L'adresse du site, jamais « Site » (règle de JP). */}
              <span className="truncate">{brandSiteLabel ?? t("homeLanding.header.siteShort")}</span>
            </a>
            ) : null
          ) : (
            <Link
              to="/p/auth/register"
              className="inline-flex items-center justify-center h-10 px-4 rounded-full bg-black text-white text-[13px] font-medium hover:opacity-90 transition"
            >
              {t("homeLanding.header.registerShort")}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? t("homeLanding.header.closeMenu") : t("homeLanding.header.openMenu")}
            aria-expanded={mobileMenuOpen}
            className="h-10 w-10 inline-flex items-center justify-center rounded-full bg-white hover:bg-black/[0.04] transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>
      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="relative z-[300] md:hidden bg-white animate-fade-in">
          <nav className="flex flex-col px-4 py-3" style={{ fontFamily: "'Jost', sans-serif" }}>
            {!isBrand && (
              <Link
                to="/product-agent"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-3 text-[15px] text-black hover:bg-black/[0.04] rounded-lg"
              >
                {t("homeLanding.header.pro_question")}
              </Link>
            )}
            <Link
              to="/p/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-3 text-[15px] text-black hover:bg-black/[0.04] rounded-lg"
            >
              {t("homeLanding.header.login")}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
