/**
 * Home locale loader.
 *
 * The Home page is rendered from a language-agnostic HTML template with
 * `{{key}}` tokens (see `src/features/solutions/*.tmpl.html`). Each locale
 * lives in `src/i18n/locales/home/<slug>.<lang>.json`.
 *
 * FR is the canonical source. Any missing locale/key falls back to FR.
 * Locales are auto-discovered via Vite eager glob — dropping a new JSON
 * file into `locales/home/` is enough to enable that language.
 */

type Dict = Record<string, string>;

const modules = import.meta.glob<{ default: Dict }>("./locales/home/*.json", {
  eager: true,
});

const SOURCES: Record<string, Record<string, Dict>> = {};

for (const [path, mod] of Object.entries(modules)) {
  // path e.g. ./locales/home/agents-autonomes.fr.json
  const match = path.match(/\/([a-z0-9-]+)\.([a-z]{2})\.json$/i);
  if (!match) continue;
  const [, slug, lang] = match;
  (SOURCES[slug] ||= {})[lang] = (mod as { default: Dict }).default;
}

export function getHomeLocale(slug: string, lang: string): { fr: Dict; current: Dict } {
  const bySlug = SOURCES[slug];
  if (!bySlug) return { fr: {}, current: {} };
  const fr = bySlug.fr ?? {};
  const en = bySlug.en ?? {};
  const code = (lang || "fr").substring(0, 2).toLowerCase();
  if (code === "fr") return { fr, current: fr };
  // Pour toute langue autre que le français, l'anglais sert de repli
  // intermédiaire : une clé encore non traduite s'affiche en anglais
  // plutôt qu'en français, jamais mélangée à la langue du visiteur.
  const current = { ...fr, ...en, ...(bySlug[code] ?? {}) };
  return { fr, current };
}


export type HomeSlug = string;
