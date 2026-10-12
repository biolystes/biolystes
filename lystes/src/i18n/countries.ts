/**
 * Country registry → default language + currency.
 *
 * Used by PreferencesContext to:
 *  1. Auto-detect a sensible default on first visit (via navigator.language → region).
 *  2. Let the user override Country, Language and Currency independently in the
 *     Preferences modal.
 *
 * Default country (no detection match) = United States (EN / USD).
 *
 * `language` always points to a locale that exists in src/i18n/config.ts.
 * For markets without a dedicated translation (Korean, Turkish, Hebrew, Thai,
 * Indonesian, etc.) we fall back to English — the user can still override.
 */

import type { Currency } from "./currencies";

export interface Country {
  code: string;     // ISO 3166-1 alpha-2
  label: string;    // Native or English name shown in the dropdown
  flag: string;     // emoji flag
  language: string; // matching i18n locale code (must exist in src/i18n/config.ts)
  currency: Currency;
  region: "Europe" | "Americas" | "Asia" | "Middle East" | "Africa" | "Oceania";
}

export const countries: Country[] = [
  // ───── Europe (20) ─────
  { code: "FR", label: "France",          flag: "🇫🇷", language: "fr", currency: "EUR", region: "Europe" },
  { code: "DE", label: "Deutschland",     flag: "🇩🇪", language: "de", currency: "EUR", region: "Europe" },
  { code: "IT", label: "Italia",          flag: "🇮🇹", language: "it", currency: "EUR", region: "Europe" },
  { code: "ES", label: "España",          flag: "🇪🇸", language: "es", currency: "EUR", region: "Europe" },
  { code: "GB", label: "United Kingdom",  flag: "🇬🇧", language: "en", currency: "GBP", region: "Europe" },
  { code: "NL", label: "Nederland",       flag: "🇳🇱", language: "nl", currency: "EUR", region: "Europe" },
  { code: "BE", label: "Belgique",        flag: "🇧🇪", language: "fr", currency: "EUR", region: "Europe" },
  { code: "CH", label: "Suisse",          flag: "🇨🇭", language: "fr", currency: "CHF", region: "Europe" },
  { code: "AT", label: "Österreich",      flag: "🇦🇹", language: "de", currency: "EUR", region: "Europe" },
  { code: "IE", label: "Ireland",         flag: "🇮🇪", language: "en", currency: "EUR", region: "Europe" },
  { code: "PT", label: "Portugal",        flag: "🇵🇹", language: "pt", currency: "EUR", region: "Europe" },
  { code: "LU", label: "Luxembourg",      flag: "🇱🇺", language: "fr", currency: "EUR", region: "Europe" },
  { code: "SE", label: "Sverige",         flag: "🇸🇪", language: "sv", currency: "SEK", region: "Europe" },
  { code: "DK", label: "Danmark",         flag: "🇩🇰", language: "en", currency: "DKK", region: "Europe" },
  { code: "NO", label: "Norge",           flag: "🇳🇴", language: "en", currency: "NOK", region: "Europe" },
  { code: "FI", label: "Suomi",           flag: "🇫🇮", language: "en", currency: "EUR", region: "Europe" },
  { code: "PL", label: "Polska",          flag: "🇵🇱", language: "pl", currency: "PLN", region: "Europe" },
  { code: "CZ", label: "Česko",           flag: "🇨🇿", language: "en", currency: "CZK", region: "Europe" },
  { code: "RO", label: "România",         flag: "🇷🇴", language: "en", currency: "RON", region: "Europe" },
  { code: "GR", label: "Ελλάδα",          flag: "🇬🇷", language: "en", currency: "EUR", region: "Europe" },

  // ───── Americas (8) ─────
  { code: "US", label: "United States",   flag: "🇺🇸", language: "en", currency: "USD", region: "Americas" },
  { code: "CA", label: "Canada",          flag: "🇨🇦", language: "en", currency: "CAD", region: "Americas" },
  { code: "BR", label: "Brasil",          flag: "🇧🇷", language: "pt", currency: "BRL", region: "Americas" },
  { code: "MX", label: "México",          flag: "🇲🇽", language: "es", currency: "MXN", region: "Americas" },
  { code: "AR", label: "Argentina",       flag: "🇦🇷", language: "es", currency: "ARS", region: "Americas" },
  { code: "CL", label: "Chile",           flag: "🇨🇱", language: "es", currency: "CLP", region: "Americas" },
  { code: "CO", label: "Colombia",        flag: "🇨🇴", language: "es", currency: "COP", region: "Americas" },
  { code: "PE", label: "Perú",            flag: "🇵🇪", language: "es", currency: "PEN", region: "Americas" },

  // ───── Asia (10) ─────
  { code: "KR", label: "South Korea",     flag: "🇰🇷", language: "en", currency: "KRW", region: "Asia" },
  { code: "JP", label: "日本",             flag: "🇯🇵", language: "ja", currency: "JPY", region: "Asia" },
  { code: "CN", label: "中国",             flag: "🇨🇳", language: "zh", currency: "CNY", region: "Asia" },
  { code: "HK", label: "Hong Kong",       flag: "🇭🇰", language: "zh", currency: "HKD", region: "Asia" },
  { code: "TW", label: "Taiwan",          flag: "🇹🇼", language: "zh", currency: "TWD", region: "Asia" },
  { code: "SG", label: "Singapore",       flag: "🇸🇬", language: "en", currency: "SGD", region: "Asia" },
  { code: "TH", label: "Thailand",        flag: "🇹🇭", language: "en", currency: "THB", region: "Asia" },
  { code: "MY", label: "Malaysia",        flag: "🇲🇾", language: "en", currency: "MYR", region: "Asia" },
  { code: "IN", label: "भारत",            flag: "🇮🇳", language: "hi", currency: "INR", region: "Asia" },
  { code: "ID", label: "Indonesia",       flag: "🇮🇩", language: "en", currency: "IDR", region: "Asia" },

  // ───── Middle East (5) ─────
  { code: "AE", label: "الإمارات",        flag: "🇦🇪", language: "ar", currency: "AED", region: "Middle East" },
  { code: "SA", label: "السعودية",        flag: "🇸🇦", language: "ar", currency: "SAR", region: "Middle East" },
  { code: "QA", label: "قطر",             flag: "🇶🇦", language: "ar", currency: "QAR", region: "Middle East" },
  { code: "KW", label: "الكويت",          flag: "🇰🇼", language: "ar", currency: "KWD", region: "Middle East" },
  { code: "IL", label: "Israel",          flag: "🇮🇱", language: "en", currency: "ILS", region: "Middle East" },

  // ───── Africa & Mediterranean (5) ─────
  { code: "TR", label: "Türkiye",         flag: "🇹🇷", language: "en", currency: "TRY", region: "Africa" },
  { code: "MA", label: "Maroc",           flag: "🇲🇦", language: "fr", currency: "MAD", region: "Africa" },
  { code: "TN", label: "Tunisie",         flag: "🇹🇳", language: "fr", currency: "TND", region: "Africa" },
  { code: "EG", label: "مصر",             flag: "🇪🇬", language: "ar", currency: "EGP", region: "Africa" },
  { code: "ZA", label: "South Africa",    flag: "🇿🇦", language: "en", currency: "ZAR", region: "Africa" },

  // ───── Oceania (2) ─────
  { code: "AU", label: "Australia",       flag: "🇦🇺", language: "en", currency: "AUD", region: "Oceania" },
  { code: "NZ", label: "New Zealand",     flag: "🇳🇿", language: "en", currency: "NZD", region: "Oceania" },

  // Legacy
  { code: "RU", label: "Россия",          flag: "🇷🇺", language: "ru", currency: "RUB", region: "Europe" },
];

export const DEFAULT_COUNTRY_CODE = "FR";

export function getCountry(code: string | undefined | null): Country {
  if (!code) return countries.find((c) => c.code === DEFAULT_COUNTRY_CODE)!;
  return (
    countries.find((c) => c.code === code.toUpperCase()) ||
    countries.find((c) => c.code === DEFAULT_COUNTRY_CODE)!
  );
}

/**
 * Try to derive a country from `navigator.language` (e.g. "fr-FR" → FR, "en" → US fallback).
 * Returns US when nothing matches — matches our "EN default" stance.
 */
export function detectCountryFromNavigator(): Country {
  if (typeof navigator === "undefined") return getCountry(DEFAULT_COUNTRY_CODE);
  const langs = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
  // First pass: exact region match (e.g. "fr-FR" → FR, "en-GB" → GB)
  for (const raw of langs) {
    const region = raw.split(/[-_]/)[1]?.toUpperCase();
    if (region) {
      const hit = countries.find((c) => c.code === region);
      if (hit) return hit;
    }
  }
  // Second pass: language-only match — prefer any non-English match over "en"
  // so a French-speaking user with "en-US" first still lands on France.
  for (const raw of langs) {
    const lang = raw.split(/[-_]/)[0]?.toLowerCase();
    if (lang && lang !== "en") {
      const hit = countries.find((c) => c.language === lang);
      if (hit) return hit;
    }
  }
  for (const raw of langs) {
    const lang = raw.split(/[-_]/)[0]?.toLowerCase();
    if (lang) {
      const hit = countries.find((c) => c.language === lang);
      if (hit) return hit;
    }
  }
  return getCountry(DEFAULT_COUNTRY_CODE);
}
