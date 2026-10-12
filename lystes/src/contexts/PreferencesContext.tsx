import { LYSTES_ENV } from "@lystes/integrations/supabase/env";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import {
  countries,
  DEFAULT_COUNTRY_CODE,
  detectCountryFromNavigator,
  getCountry,
  type Country,
} from "@lystes/i18n/countries";
import {
  currencies,
  getCurrency,
  type Currency,
  type CurrencyMeta,
} from "@lystes/i18n/currencies";
import { langueServie, CLE_LANGUE_CHOISIE, memoriserChoixDeLangue } from "@lystes/i18n/config";
import { parseLocalePath } from "@lystes/i18n/localized-routing";

const STORAGE_KEY = "lystes.preferences.v3";
// La v2 est empoisonnée : jusqu'au 02/08/2026, la géo-IP en repli y écrivait
// US/USD/en (ou de) pour chaque visiteur, indiscernable d'un vrai choix. On
// l'abandonne et on la retire à la première lecture : purge unique décidée
// par le Chef de projet, pas un effacement à chaque visite.
const LEGACY_STORAGE_KEY = "lystes.preferences.v2";

interface StoredPreferences {
  country: string;
  currency: Currency;
  language: string;
}

interface PreferencesContextValue {
  country: Country;
  currency: CurrencyMeta;
  language: string;
  setCountry: (code: string) => void;
  setCurrency: (code: Currency) => void;
  setLanguage: (code: string) => void;
  /** Utilisé par le modal pour appliquer l'état intermédiaire en une seule fois (« Save »). */
  apply: (next: { country: string; currency: Currency; language: string }) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function readStored(): StoredPreferences | null {
  try {
    if (localStorage.getItem(LEGACY_STORAGE_KEY) !== null) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPreferences;
    if (!parsed?.country || !parsed?.currency || !parsed?.language) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(p: StoredPreferences) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* iframe / navigation privée → ignorer silencieusement */
  }
}

/**
 * Calcule les préférences initiales à la première visite :
 *  - Si localStorage contient déjà une valeur → elle est reprise.
 *  - Sinon, essayer de détecter depuis `navigator.language` (navigateur FR → France/fr/EUR).
 *  - Dernier repli : États-Unis / anglais / USD.
 */
function langueDuNavigateur(): string {
  return typeof navigator !== "undefined" ? (navigator.language || "").slice(0, 2) : "";
}

function choixExplicite(): boolean {
  try {
    return localStorage.getItem(CLE_LANGUE_CHOISIE) === "1";
  } catch {
    return false;
  }
}

function computeInitial(): StoredPreferences {
  const stored = readStored();
  if (stored && getCountry(stored.country).code === stored.country.toUpperCase()) {
    const pays = getCountry(stored.country);
    // Troisième verrou : la langue enregistrée sans drapeau de choix explicite
    // vient de l'ancien défaut anglais forcé, pas d'une décision. On la
    // redérive du navigateur. Pays et devise sont conservés : eux ont toujours
    // suivi le navigateur ou un vrai réglage.
    const langue = choixExplicite()
      ? langueServie(stored.language, [pays.language])
      : langueServie(langueDuNavigateur(), [pays.language, "en"]);
    return { ...stored, language: langue };
  }
  const detected = detectCountryFromNavigator();
  // La langue suit le navigateur, comme le pays et la devise le faisaient
  // deja. `langueServie` garantit qu'on ne demande jamais une langue sans
  // fichier ; l'anglais reste le dernier repli.
  return {
    country: detected.code,
    currency: detected.currency,
    language: langueServie(langueDuNavigateur(), [detected.language, "en"]),
  };

}


export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [state, setState] = useState<StoredPreferences>(() => computeInitial());
  const [hasStored, setHasStored] = useState<boolean>(() => readStored() !== null);
  const urlLocale =
    typeof window !== "undefined" ? parseLocalePath(window.location.pathname).locale : null;

  // Garde i18n synchronisé avec la langue choisie, à chaque changement.
  useEffect(() => {
    const targetLanguage = urlLocale || state.language;
    if (i18n.language?.substring(0, 2) !== targetLanguage) {
      void i18n.changeLanguage(targetLanguage);
    }
    writeStored(urlLocale ? { ...state, language: urlLocale } : state);
  }, [state, i18n, urlLocale]);

  // Géolocalisation IP de première visite : ne s'exécute que si l'utilisateur
  // n'a jamais renseigné de préférence. Tout réglage explicite écrit en
  // localStorage et désactive ce mécanisme.
  useEffect(() => {
    if (hasStored) return;
    // Espace cliente des cures : en français, sans prix à convertir, donc sans
    // appel de géolocalisation (la recette locale ne touche pas la production).
    if (typeof window !== "undefined" && /^\/cure(\/|$)/.test(window.location.pathname)) return;
    let cancelled = false;
    (async () => {
      try {
        const url = LYSTES_ENV.VITE_SUPABASE_URL;
        const key = LYSTES_ENV.VITE_SUPABASE_PUBLISHABLE_KEY;
        if (!url) return;
        const resp = await fetch(`${url}/functions/v1/geo-country`, {
          headers: key ? { Authorization: `Bearer ${key}`, apikey: key } : {},
        });
        if (!resp.ok) return;
        const { country: code, source } = (await resp.json()) as {
          country?: string;
          source?: string;
        };
        if (cancelled || !code) return;
        // « fallback » signifie que la fonction n'a PAS géolocalisé : écraser la
        // détection navigateur avec ce défaut mettait chaque visiteur français
        // en anglais et en dollars.
        if (source === "fallback") return;
        const country = getCountry(code);
        if (country.code === state.country) return;
        setState((prev) => ({
          country: country.code,
          currency: country.currency,
          // La géo-IP dit où l'on est, pas ce que l'on parle : la langue reste
          // celle que le navigateur déclare, sinon une IP résolue en Allemagne
          // bascule un visiteur français en allemand.
          language: prev.language,
        }));
        setHasStored(true);
      } catch {
        /* ignorer — conserver le défaut dérivé du navigateur */
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setCountry = useCallback((code: string) => {
    setHasStored(true);
    setState((prev) => {
      const country = getCountry(code);
      const prevCountry = getCountry(prev.country);
      const currency =
        prev.currency === prevCountry.currency ? country.currency : prev.currency;
      const language =
        prev.language === prevCountry.language ? country.language : prev.language;
      return { country: country.code, currency, language };
    });
  }, []);

  const setCurrency = useCallback((code: Currency) => {
    setHasStored(true);
    setState((prev) => ({ ...prev, currency: code }));
  }, []);

  const setLanguage = useCallback((code: string) => {
    setHasStored(true);
    memoriserChoixDeLangue(code);
    setState((prev) => ({ ...prev, language: code }));
  }, []);

  const apply = useCallback(
    (next: { country: string; currency: Currency; language: string }) => {
      setHasStored(true);
      memoriserChoixDeLangue(next.language);
      setState({
        country: getCountry(next.country).code,
        currency: getCurrency(next.currency).code,
        language: langueServie(next.language, [getCountry(next.country).language]),
      });
    },
    [],
  );

  const value = useMemo<PreferencesContextValue>(
    () => ({
      country: getCountry(state.country),
      currency: getCurrency(state.currency),
      language: state.language,
      setCountry,
      setCurrency,
      setLanguage,
      apply,
    }),
    [state, setCountry, setCurrency, setLanguage, apply],
  );

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    // Repli défensif : les consommateurs ne plantent jamais si le provider est
    // absent d'un arbre de routes particulier (widgets embarqués par ex.) — on
    // renvoie les défauts US.
    const fallbackCountry = getCountry(DEFAULT_COUNTRY_CODE);
    return {
      country: fallbackCountry,
      currency: getCurrency(fallbackCountry.currency),
      language: fallbackCountry.language,
      setCountry: () => {},
      setCurrency: () => {},
      setLanguage: () => {},
      apply: () => {},
    };
  }
  return ctx;
}

export { countries, currencies };
