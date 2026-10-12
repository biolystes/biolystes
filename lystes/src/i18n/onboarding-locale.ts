/**
 * Chargeur de langues pour le parcours d'installation.
 *
 * Copie volontaire de `docs-locale.ts`, et non un mecanisme nouveau. Meme
 * raison : les gros `locales/<lang>.json` font 350 Ko et quatorze sessions
 * ecrivent dedans en meme temps. Une racine isolee dans son propre dossier
 * evite les conflits d'ecriture et rend la couverture verifiable d'un coup
 * d'oeil, une langue existe si et seulement si son fichier existe.
 *
 * `locales/onboarding/<lang>.json`, decouvert par glob Vite. Deposer un
 * fichier suffit a activer la langue, aucun import a ajouter.
 *
 * Racine `onb`, distincte des racines `onboarding.*` et `onboardingWizard.*`
 * qui vivent deja dans les gros fichiers. Les deux coexistent sans se
 * marcher dessus : ce chargeur n'ecrase que la racine `onb`.
 *
 * `onboarding/fr.json` EST OBLIGATOIRE. La chaine de repli de l'application
 * est `['fr', 'en']` (voir config.ts). Une cle absente du francais mais
 * presente en anglais serait donc servie EN ANGLAIS a un visiteur francais,
 * avant meme que la valeur par defaut francaise de l'appel `t()` n'ait sa
 * chance. C'est la panne que la session documentation a mesuree au rendu.
 *
 * La valeur par defaut ecrite dans le composant reste le dernier filet : une
 * cle absente de tous les fichiers s'affiche en francais, jamais en
 * « onb.secteur.titre » brut.
 */

type Dict = Record<string, unknown>;

const modules = import.meta.glob<{ default: Dict }>("./locales/onboarding/*.json", {
  eager: true,
});

const SOURCES: Record<string, Dict> = {};

for (const [path, mod] of Object.entries(modules)) {
  // path : ./locales/onboarding/de.json
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

/** Les langues pour lesquelles un fichier d'onboarding existe reellement. */
export const languesOnboarding = Object.keys(SOURCES).sort();

/**
 * Le dictionnaire `onb` d'une langue, francais comble dessous.
 * Une langue sans fichier recoit le francais entier, explicitement : c'est le
 * repli francais assume, jamais une traduction automatique non relue.
 */
export function getOnboardingLocale(lang: string): Dict {
  const fr = SOURCES.fr ?? {};
  const code = (lang || "fr").substring(0, 2).toLowerCase();
  const courant = SOURCES[code];
  if (!courant || code === "fr") return fr;
  return fusionner(fr, courant);
}
