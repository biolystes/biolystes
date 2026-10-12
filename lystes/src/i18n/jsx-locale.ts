/**
 * Locale léger pour les pages "solutions" écrites en JSX pur (journalistes, avis),
 * qui ne passent pas par le système de tokens HTML (`solutions-locale`).
 *
 * Chaque page a un dictionnaire `src/i18n/locales/jsx/<page>.<lang>.json` dont les
 * clés sont les chaînes FR canoniques (copiées telles quelles depuis le composant).
 * On récupère une fonction `t(fr)` qui renvoie la traduction, ou le FR en repli.
 * Déposer un nouveau JSON dans `locales/jsx/` suffit à activer une langue.
 */

type Dict = Record<string, string>;

const modules = import.meta.glob<{ default: Dict }>("./locales/jsx/*.json", {
  eager: true,
});

const byPageLang: Record<string, Record<string, Dict>> = {};

for (const [path, mod] of Object.entries(modules)) {
  // path e.g. ./locales/jsx/journalistes.fr.json
  const match = path.match(/\/([a-z0-9-]+)\.([a-z]{2})\.json$/i);
  if (!match) continue;
  const [, page, lang] = match;
  (byPageLang[page] ||= {})[lang.toLowerCase()] = mod.default;
}

/**
 * Renvoie une fonction de traduction pour une page et une langue.
 * `t(fr)` -> traduction si présente, sinon la chaîne FR d'origine.
 */
export function getJsxT(page: string, lang: string): (fr: string) => string {
  const short = (lang || "fr").substring(0, 2).toLowerCase();
  const dict = byPageLang[page]?.[short];
  /* 12/10/2026 (JP) : en français, l'apostrophe affichée est typographique
     (’). Les clés gardent l'apostrophe droite, seul le rendu change. */
  if (short === "fr") return (fr) => fr.replace(/(?<=\p{L})'(?=\p{L})/gu, "\u2019");
  if (!dict) return (fr) => fr;
  return (fr) => dict[fr] ?? fr;
}

/**
 * Comme `getJsxT`, mais une langue sans dictionnaire reçoit l'anglais, pas le
 * français. Pour les écrans que voient des marchandes du monde entier (guides
 * d'installation, paiement) : une Japonaise lit mieux l'anglais que le
 * français, c'est déjà la règle du guide Shopify.
 */
export function getJsxTOuAnglais(page: string, lang: string): (fr: string) => string {
  const short = (lang || "fr").substring(0, 2).toLowerCase();
  if (short === "fr" || byPageLang[page]?.[short]) return getJsxT(page, short);
  return getJsxT(page, "en");
}
