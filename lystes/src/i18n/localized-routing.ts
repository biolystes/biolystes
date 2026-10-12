/**
 * Registry of public, SEO-indexable routes that exist in both /en/... and /fr/...
 * variants. Used by:
 *  - <LocaleShell> + App.tsx routing block
 *  - <RouteCanonical> for canonical + hreflang emission
 *  - scripts/generate-sitemap.ts for the multilingual sitemap
 *  - <PreferencesModal> to swap the URL prefix on language change
 *
 * Non-localized routes (dashboard, admin, auth, embed, demos) stay on their
 * existing paths and emit a single canonical with no hreflang.
 */

export const SITE_ORIGIN = "https://lystes.ai";

/** Locales that get a URL prefix. These match src/i18n/config.ts so the
 * homepage is directly available in every supported platform language. */
/** Locales qui reçoivent un préfixe d'URL.
 *
 * ⚠️ CINQ, et c'est une décision, pas un oubli.
 *
 * La liste en comptait 52 pour 32 fichiers de traduction : vingt langues,
 * dont vi, th, ur, bn, ta, sw, montaient une route `/<langue>/` et y
 * servaient du français sous une adresse étrangère.
 *
 * Elle a d'abord été ramenée à 32, les langues qui ont réellement leur
 * fichier `locales/home/agents-autonomes.<langue>.json`. JP a ensuite tranché
 * plus court : **on ne déclare une langue que si son fichier existe ET a été
 * relu par un humain.** Une traduction automatique non relue ne fait pas
 * gagner un marché, elle discrédite la page entière, et le doute rejaillit
 * sur les autres langues. Cinq qui tiennent valent mieux que trente-deux à
 * moitié faites.
 *
 * Les 27 autres fichiers restent en place et continuent d'être servis au
 * visiteur qui choisit cette langue : ils n'ont simplement pas d'adresse à
 * eux, donc ni entrée au sitemap ni `hreflang`. On élargit langue par langue,
 * après relecture.
 *
 * N'ajoutez pas une langue ici parce que son fichier existe. C'est
 * exactement le raccourci qui a produit les 52.
 */
export const URL_LOCALES = [
  "fr", "en", "de", "es", "it", "pt", "nl",
] as const;
export type UrlLocale = (typeof URL_LOCALES)[number];

/** Default locale used when bare paths (e.g. "/") need a canonical target,
 * and for `hreflang="x-default"`. */
export const DEFAULT_URL_LOCALE: UrlLocale = "en";

/** Paths (without locale prefix) that have localized variants and should
 * appear twice in the sitemap with hreflang annotations. Keep in sync with
 * the App.tsx <Route path="/:lng"> block. */
export const LOCALIZED_PATHS = [
  "/",
  "/institut",
  "/clinique",
  "/chirurgien",
  "/concept",
  "/diagnostic-ai",
  "/legal",
  "/terms",
  "/privacy",
  "/blog",
  "/docs",
  "/api-reference",
  "/status",
] as const;

const LOCALIZED_SET = new Set<string>(LOCALIZED_PATHS);
const LOCALE_SET = new Set<string>(URL_LOCALES);

/** Strip a leading /en or /fr from the pathname. Returns the locale (or null)
 * and the remaining path (always starts with "/"). */
export function parseLocalePath(pathname: string): {
  locale: UrlLocale | null;
  rest: string;
} {
  const m = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  if (m && LOCALE_SET.has(m[1])) {
    return { locale: m[1] as UrlLocale, rest: m[2] || "/" };
  }
  return { locale: null, rest: pathname || "/" };
}

/** Normalize a path: collapse trailing slashes, ensure leading slash. */
export function normalizePath(p: string): string {
  if (!p) return "/";
  const stripped = p.replace(/\/+$/, "");
  return stripped === "" ? "/" : stripped;
}

/** Returns true if a bare path (without locale prefix) is part of the
 * localized set. */
export function isLocalizedPath(restPath: string): boolean {
  return LOCALIZED_SET.has(normalizePath(restPath));
}

/** Build a localized URL: `/en/institut`, `/fr/`, etc. */
export function buildLocalizedPath(locale: UrlLocale, restPath: string): string {
  const norm = normalizePath(restPath);
  if (norm === "/") return `/${locale}/`;
  return `/${locale}${norm}`;
}

/** Build the absolute canonical URL for a localized path. */
export function buildLocalizedUrl(locale: UrlLocale, restPath: string): string {
  return `${SITE_ORIGIN}${buildLocalizedPath(locale, restPath)}`;
}
