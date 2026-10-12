import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getSyncedLocales } from '@lystes/utils/syncTranslations';
import { getDocsLocale } from '@lystes/i18n/docs-locale';
import { getOnboardingLocale } from '@lystes/i18n/onboarding-locale';
import { getDashboardLocale, languesTableauDeBord } from '@lystes/i18n/dashboard-locale';

const syncedLocales = getSyncedLocales();

/**
 * La documentation vit dans `locales/docs/<lang>.json`, hors du gros fichier
 * partagé, et vient se greffer sous la racine `docs`. Voir docs-locale.ts.
 *
 * Le parcours d'installation suit exactement le même mécanisme sous la racine
 * `onb`. Voir onboarding-locale.ts. Les racines `onboarding.*` et
 * `onboardingWizard.*` du gros fichier ne sont pas touchées.
 *
 * `docs` et `onb` n'existent pas dans le gros fichier : les poser en
 * écrasement n'efface rien. `dashboard`, LUI, existe et porte 500 clés. On le
 * passe donc à `getDashboardLocale` comme socle, au lieu de le remplacer.
 * L'écrasement pur, corrigé le 10/08/2026, effaçait ces 500 clés dans les
 * quatorze langues ; voir l'en-tête de dashboard-locale.ts.
 */
const avecDocs = (code: string, base: unknown) => {
  const socle = base as Record<string, unknown>;
  return {
    ...socle,
    docs: getDocsLocale(code),
    onb: getOnboardingLocale(code),
    dashboard: getDashboardLocale(
      code,
      (socle.dashboard as Record<string, unknown>) ?? {},
    ),
  };
};

/**
 * La table des libellés de langue.
 *
 * `sigle` remplace les drapeaux emoji retirés le 10/08/2026 : règle de JP,
 * aucun emoji comme icône. Deuxième raison, indépendante de la charte : un
 * drapeau désigne un pays, pas une langue. Le drapeau espagnol pour l'espagnol
 * ignore quatre cents millions d'hispanophones hors d'Espagne, le drapeau
 * britannique pour l'anglais en fait autant. Deux lettres capitales ne mentent
 * pas.
 */
export interface LangueMeta {
  code: string;
  label: string;
  /** Le code en capitales, à afficher en petites capitales : FR, EN, DE… */
  sigle: string;
  rtl?: boolean;
}

/**
 * Il n'y a plus de champ `flag`. Il a été retiré, pas vidé : un champ nommé
 * `flag` qui contiendrait « FR » se serait fait recoller un emoji à la première
 * relecture distraite. Les quatre `.flag` qui subsistent dans le dépôt viennent
 * de `countries.ts` ou de listes locales, pas d'ici.
 */
const languesBrutes: Array<Omit<LangueMeta, 'sigle'>> = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'sv', label: 'Svenska' },
  { code: 'da', label: 'Dansk' },
  { code: 'no', label: 'Norsk' },
  { code: 'fi', label: 'Suomi' },
  { code: 'is', label: 'Íslenska' },
  { code: 'pl', label: 'Polski' },
  { code: 'cs', label: 'Čeština' },
  { code: 'sk', label: 'Slovenčina' },
  { code: 'hu', label: 'Magyar' },
  { code: 'ro', label: 'Română' },
  { code: 'bg', label: 'Български' },
  { code: 'el', label: 'Ελληνικά' },
  { code: 'hr', label: 'Hrvatski' },
  { code: 'sr', label: 'Српски' },
  { code: 'sl', label: 'Slovenščina' },
  { code: 'lt', label: 'Lietuvių' },
  { code: 'lv', label: 'Latviešu' },
  { code: 'et', label: 'Eesti' },
  { code: 'ca', label: 'Català' },
  { code: 'ga', label: 'Gaeilge' },
  { code: 'mt', label: 'Malti' },
  { code: 'ru', label: 'Русский' },
  { code: 'uk', label: 'Українська' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'th', label: 'ไทย' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'tl', label: 'Filipino' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'ur', label: 'اردو', rtl: true },
  { code: 'ar', label: 'العربية', rtl: true },
  { code: 'he', label: 'עברית', rtl: true },
  { code: 'fa', label: 'فارسی', rtl: true },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'am', label: 'አማርኛ' },
];

/**
 * La table complète des libellés, sigle calculé. Elle couvre des langues qui
 * n'ont aucun fichier : c'est un dictionnaire de noms, pas une offre.
 */
export const languages: LangueMeta[] = languesBrutes.map((l) => ({
  ...l,
  sigle: l.code.toUpperCase(),
}));

/**
 * LES LANGUES COUVERTES DE BOUT EN BOUT. C'est la seule liste à proposer à un
 * utilisateur, dans le tableau de bord comme sur les pages publiques.
 *
 * DEUX conditions, toutes deux dérivées d'un glob, aucune liste en dur :
 *  1. `locales/<lang>.json` existe        → glob de syncTranslations
 *  2. `locales/dashboard/<lang>.json` existe → glob de dashboard-locale
 *
 * Le jour où quelqu'un dépose `locales/dashboard/ja.json`, le japonais
 * réapparaît ici tout seul, sans toucher à ce fichier. C'est le point : la
 * liste SUIT les fichiers, elle ne les précède pas. Ne la remplacez jamais par
 * un tableau écrit à la main, c'est exactement la panne qu'on corrige ici.
 *
 * POURQUOI LA DEUXIÈME CONDITION, mesuré le 10/08/2026. La liste ne tenait
 * compte que des fichiers globaux et proposait quatorze langues. Le bundle
 * `dashboard` (525 clés : barre latérale, barre du haut, menu compte, accueil,
 * crédits, espace marketing) n'en a que sept. Un marchand qui choisissait le
 * japonais obtenait un tableau de bord ENTIÈREMENT en français : ces 525 clés
 * étaient à 0 % de couverture, comblées par le repli français de
 * `getDashboardLocale`. Sept langues qui tiennent valent mieux que quatorze à
 * moitié faites — c'est déjà l'arbitrage rendu par JP pour `URL_LOCALES` dans
 * localized-routing.ts, qui liste exactement les sept mêmes.
 */
const codesCouverts = new Set(
  Object.keys(syncedLocales).filter((code) => languesTableauDeBord.includes(code)),
);

export const languesDisponibles = languages.filter((l) => codesCouverts.has(l.code));

/**
 * Un code de langue ramené à une langue couverte de bout en bout.
 *
 * Sert aux préférences déjà enregistrées, et c'est le point de régression de la
 * correction du 10/08/2026 : un marchand réglé sur `ja` ou `ru` porte encore ce
 * code dans son navigateur. Sans ce filtre, sa préférence survivrait au retrait
 * de la langue et il resterait sur un tableau de bord français.
 *
 * Il retombe sur la langue de son pays si elle est couverte — `countries.ts`
 * annonce quatorze langues, dont sept ne le sont pas, d'où la vérification —
 * et à défaut sur l'anglais, langue par défaut du site. Jamais d'échec, jamais
 * de page blanche : la boucle finit toujours par `'en'`, qui est couvert par
 * construction (`locales/en.json` et `locales/dashboard/en.json` existent).
 */
export const langueServie = (code: string | undefined | null, replis: string[] = []): string => {
  for (const candidat of [code, ...replis, 'en']) {
    const c = (candidat || '').substring(0, 2).toLowerCase();
    if (codesCouverts.has(c)) return c;
  }
  return 'en';
};


/**
 * Une entrée par langue servie, construite depuis le glob. Écrire ces lignes à
 * la main était la cause de la divergence, voir l'en tête de syncTranslations.
 *
 * QUATORZE ici, SEPT dans `languesDisponibles`, et ce n'est pas une divergence.
 * i18next doit savoir rendre les quatorze : les pages publiques sont traduites
 * dans toutes, et `AgentPage` comme `AgentLanguageSelector` appellent encore
 * `changeLanguage` avec des codes hors des sept. Ce qu'on retire, c'est le
 * CHOIX offert à un utilisateur, pas la capacité de rendre. Les deux listes
 * répondent à deux questions différentes : « sait-on afficher cette langue ? »
 * et « ose-t-on la proposer ? ».
 */
const resources = Object.fromEntries(
  Object.entries(syncedLocales).map(([code, base]) => [code, { translation: avecDocs(code, base) }]),
);

/**
 * Drapeau posé UNIQUEMENT quand le visiteur choisit sa langue dans l'interface.
 * Il distingue un vrai choix de la valeur qu'écrivait l'ancien défaut anglais.
 */
export const CLE_LANGUE_CHOISIE = 'lystes.langueChoisie';

/** Marque le choix comme explicite. À appeler depuis tout sélecteur de langue. */
export function memoriserChoixDeLangue(code: string) {
  try {
    localStorage.setItem(CLE_LANGUE_CHOISIE, '1');
    localStorage.setItem('i18nextLng', code);
  } catch {
    // Navigation privée, quota plein : la langue vaudra pour cette visite.
  }
}

// Purge unique du verrou hérité. Avant le 24/08, `lng: 'en'` combiné à
// `caches: ['localStorage']` écrivait « en » chez tout le monde, sans choix.
// Sans cette purge, la correction ne changerait rien pour les visiteurs déjà
// venus : ils resteraient en anglais pour toujours.
try {
  if (!localStorage.getItem(CLE_LANGUE_CHOISIE) && localStorage.getItem('i18nextLng')) {
    localStorage.removeItem('i18nextLng');
  }
} catch {
  // Rien à purger si le stockage est indisponible.
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // Aucune langue forcée : `lng` neutraliserait le détecteur. L'ordre est
    // choix explicite du visiteur, puis langue de son navigateur, puis anglais.
    // Mesuré le 24/08 : un navigateur en français recevait l'anglais, et le
    // seul texte français à l'écran était celui dont la clé manquait.
    fallbackLng: ['en', 'fr'],


    supportedLngs: languages.map((l) => l.code),
    nonExplicitSupportedLngs: true, // accepts 'en-US' -> 'en'
    load: 'languageOnly',
    // Never render an empty string when a key is missing — let parseMissingKeyHandler humanize it.
    returnEmptyString: false,
    returnNull: false,
    saveMissing: true, // triggers missingKeyHandler below
    missingKeyHandler: (lngs, ns, key, fallbackValue) => {
      // Dedupe console noise: log each missing key once per session.
      const w = (globalThis as any).__i18nMissingKeys ||= new Set<string>();
      const sig = `${Array.isArray(lngs) ? lngs.join(',') : lngs}::${key}`;
      if (w.has(sig)) return;
      w.add(sig);
      // eslint-disable-next-line no-console
      console.warn(
        `[i18n] Missing key "${key}" for lang [${Array.isArray(lngs) ? lngs.join(',') : lngs}] (ns="${ns}"). Fallback rendered.`,
        fallbackValue ? { fallbackValue } : undefined,
      );
    },
    // Last-resort renderer: never show a raw "foo.bar.baz" key in the UI.
    // Humanizes the final segment so the layout never collapses on missing copy.
    parseMissingKeyHandler: (key: string, defaultValue?: string) => {
      if (defaultValue) return defaultValue;
      const last = String(key).split('.').pop() || key;
      // camelCase / snake_case / kebab-case -> "Camel Case"
      const humanized = last
        .replace(/[_-]+/g, ' ')
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/\s+/g, ' ')
        .trim();
      return humanized.charAt(0).toUpperCase() + humanized.slice(1);
    },
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Le choix explicite du visiteur passe avant tout, sa langue de
      // navigateur ensuite. `htmlTag` reste exclu : la balise du document est
      // écrite par l'application elle-même, la lire serait circulaire.
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

// Keep <html lang> and dir in sync with the active language (RTL for Arabic, etc.)
const applyHtmlLang = (lng: string) => {
  const code = (lng || 'en').substring(0, 2);

  const meta = languages.find((l) => l.code === code);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = code;
    document.documentElement.dir = meta?.rtl ? 'rtl' : 'ltr';
  }
};
applyHtmlLang(i18n.language);
i18n.on('languageChanged', applyHtmlLang);

export default i18n;
