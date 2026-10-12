/**
 * Chargeur de langues pour la documentation.
 *
 * Pourquoi un fichier à part plutôt que la racine `docs` dans le gros
 * `locales/<lang>.json` : ces fichiers font 350 Ko et treize sessions écrivent
 * dedans en même temps. Une racine `docs` isolée dans son propre dossier évite
 * les conflits, et surtout elle rend la règle SEO vérifiable d'un coup d'œil :
 * une langue existe si, et seulement si, son fichier existe.
 *
 * `locales/docs/<lang>.json`, découvert par glob Vite. Déposer un fichier
 * suffit à activer la langue, aucun import à ajouter.
 *
 * `docs/fr.json` EST OBLIGATOIRE, et la raison a été mesurée au rendu, pas
 * déduite. La chaîne de repli de l'application est `['fr', 'en']`. Une clé
 * absente du français mais présente en anglais est donc servie EN ANGLAIS à un
 * visiteur français, avant même que la valeur par défaut française de l'appel
 * `t()` n'ait sa chance. Une page de doc s'affichait ainsi entièrement en
 * anglais pour un visiteur en `fr`.
 *
 * Règle qui en découle : ne jamais déposer un fichier de langue sans déposer
 * en même temps la clé correspondante dans `fr.json`.
 *
 * Le français de `fr.json` doit rester identique, au caractère près, à la
 * valeur par défaut écrite dans la page. La valeur par défaut reste le dernier
 * filet : une clé absente de tous les fichiers s'affiche en français, jamais
 * en « docs.mcp.intro » brut.
 */

type Dict = Record<string, unknown>;

const modules = import.meta.glob<{ default: Dict }>("./locales/docs/*.json", {
  eager: true,
});

const SOURCES: Record<string, Dict> = {};

for (const [path, mod] of Object.entries(modules)) {
  // path : ./locales/docs/de.json
  const match = path.match(/\/([a-z]{2})\.json$/i);
  if (!match) continue;
  SOURCES[match[1].toLowerCase()] = (mod as { default: Dict }).default;
}

function fusionner(base: Dict, dessus: Dict): Dict {
  const out: Dict = { ...base };
  for (const cle of Object.keys(dessus)) {
    const v = dessus[cle];
    const b = out[cle];
    if (
      typeof v === "object" && v !== null && !Array.isArray(v) &&
      typeof b === "object" && b !== null && !Array.isArray(b)
    ) {
      out[cle] = fusionner(b as Dict, v as Dict);
    } else {
      out[cle] = v;
    }
  }
  return out;
}

/** Les langues pour lesquelles un fichier de documentation existe réellement. */
export const languesDocumentees = Object.keys(SOURCES).sort();

/**
 * Le dictionnaire `docs` d'une langue, français comblé dessous.
 * Une langue sans fichier reçoit le français entier, explicitement.
 */
export function getDocsLocale(lang: string): Dict {
  const fr = SOURCES.fr ?? {};
  const code = (lang || "fr").substring(0, 2).toLowerCase();
  const courant = SOURCES[code];
  if (!courant || code === "fr") return fr;
  return fusionner(fr, courant);
}
