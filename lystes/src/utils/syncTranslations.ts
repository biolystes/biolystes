/**
 * Chargeur des fichiers de langue globaux.
 *
 * `src/i18n/locales/<lang>.json`, découvert par glob Vite eager, même idiome que
 * `i18n/docs-locale.ts` et `i18n/home-locale.ts` : déposer un fichier suffit à
 * activer la langue, il n'y a aucun import à ajouter.
 *
 * Ce glob est la SEULE source de vérité des langues réellement servies.
 * `i18n/config.ts` en dérive à la fois les `resources` d'i18next et la liste
 * proposée au visiteur (`languesDisponibles`).
 *
 * Pourquoi ça compte, mesuré le 02/08/2026 : trois listes étaient écrites à la
 * main, les 14 imports d'ici, les 14 lignes de `resources`, et les 52 entrées de
 * `languages`. Elles avaient divergé. La modale de préférences offrait donc 52
 * langues pour 14 fichiers : un marchand qui choisissait le danois voyait le
 * drapeau changer et lisait du français, sans un mot d'explication.
 */

type LocaleObject = Record<string, unknown>;

const modules = import.meta.glob<{ default: LocaleObject }>("../i18n/locales/*.json", {
  eager: true,
});

/** Les dictionnaires bruts, par code de langue, tels que le glob les trouve. */
const SOURCES: Record<string, LocaleObject> = {};

for (const [path, mod] of Object.entries(modules)) {
  // path : ../i18n/locales/de.json
  //
  // LIMITE CONNUE : ce motif ne reconnaît que les codes à DEUX lettres. Le jour
  // où quelqu'un dépose `pt-BR.json` ou `zh-Hant.json`, le fichier sera ignoré
  // ici, la langue n'apparaîtra pas dans `languesDisponibles`, et rien ne le
  // dira. C'est la même famille de panne muette que celle qu'on corrige ici, à
  // une échelle près. Élargir le motif suppose de décider ce que devient un
  // `pt-BR` face au `pt` existant, ce qui n'est pas qu'une affaire de regex.
  const match = path.match(/\/([a-z]{2})\.json$/i);
  if (!match) continue;
  SOURCES[match[1].toLowerCase()] = (mod as { default: LocaleObject }).default;
}

/**
 * Fusion profonde de deux objets : les valeurs de la source comblent les clés manquantes de la cible
 */
function deepMerge(target: LocaleObject, source: LocaleObject): LocaleObject {
  const result: LocaleObject = { ...target };

  for (const key in source) {
    if (!(key in result)) {
      // Clé manquante dans la cible, on prend la valeur de la source
      result[key] = source[key];
    } else if (
      typeof source[key] === "object" &&
      source[key] !== null &&
      !Array.isArray(source[key]) &&
      typeof result[key] === "object" &&
      result[key] !== null &&
      !Array.isArray(result[key])
    ) {
      // Les deux sont des objets, on récurs
      result[key] = deepMerge(
        result[key] as LocaleObject,
        source[key] as LocaleObject
      );
    }
    // Si la clé existe déjà dans la cible, on garde la valeur de la cible
  }

  return result;
}

/**
 * Récupère toutes les locales, clés manquantes comblées depuis le français (référence)
 */
export function getSyncedLocales(): Record<string, LocaleObject> {
  const reference = SOURCES.fr ?? {};
  const out: Record<string, LocaleObject> = {};

  for (const code of Object.keys(SOURCES)) {
    // Le français EST la référence, il ne se comble pas lui-même.
    out[code] = code === "fr" ? reference : deepMerge(SOURCES[code], reference);
  }

  return out;
}
