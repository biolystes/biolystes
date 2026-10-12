/**
 * Currency registry used by the Preferences modal.
 * Covers the 50 supported countries (see countries.ts).
 */

export type Currency =
  | "USD" | "EUR" | "GBP" | "CHF" | "CAD" | "AUD" | "NZD"
  | "JPY" | "CNY" | "HKD" | "TWD" | "KRW" | "SGD" | "THB" | "MYR" | "IDR" | "INR"
  | "RUB" | "PLN" | "CZK" | "RON" | "SEK" | "NOK" | "DKK"
  | "BRL" | "MXN" | "ARS" | "CLP" | "COP" | "PEN"
  | "SAR" | "AED" | "QAR" | "KWD" | "ILS" | "TRY"
  | "MAD" | "TND" | "EGP" | "ZAR";

export interface CurrencyMeta {
  code: Currency;
  symbol: string;
  label: string;
}

export const currencies: CurrencyMeta[] = [
  { code: "USD", symbol: "$",   label: "US Dollar" },
  { code: "EUR", symbol: "€",   label: "Euro" },
  { code: "GBP", symbol: "£",   label: "British Pound" },
  { code: "CHF", symbol: "CHF", label: "Swiss Franc" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "AU$", label: "Australian Dollar" },
  { code: "NZD", symbol: "NZ$", label: "New Zealand Dollar" },
  { code: "JPY", symbol: "¥",   label: "Japanese Yen" },
  { code: "CNY", symbol: "¥",   label: "Chinese Yuan" },
  { code: "HKD", symbol: "HK$", label: "Hong Kong Dollar" },
  { code: "TWD", symbol: "NT$", label: "Taiwan Dollar" },
  { code: "KRW", symbol: "₩",   label: "South Korean Won" },
  { code: "SGD", symbol: "S$",  label: "Singapore Dollar" },
  { code: "THB", symbol: "฿",   label: "Thai Baht" },
  { code: "MYR", symbol: "RM",  label: "Malaysian Ringgit" },
  { code: "IDR", symbol: "Rp",  label: "Indonesian Rupiah" },
  { code: "INR", symbol: "₹",   label: "Indian Rupee" },
  { code: "RUB", symbol: "₽",   label: "Russian Ruble" },
  { code: "PLN", symbol: "zł",  label: "Polish Złoty" },
  { code: "CZK", symbol: "Kč",  label: "Czech Koruna" },
  { code: "RON", symbol: "lei", label: "Romanian Leu" },
  { code: "SEK", symbol: "kr",  label: "Swedish Krona" },
  { code: "NOK", symbol: "kr",  label: "Norwegian Krone" },
  { code: "DKK", symbol: "kr",  label: "Danish Krone" },
  { code: "BRL", symbol: "R$",  label: "Brazilian Real" },
  { code: "MXN", symbol: "MX$", label: "Mexican Peso" },
  { code: "ARS", symbol: "AR$", label: "Argentine Peso" },
  { code: "CLP", symbol: "CL$", label: "Chilean Peso" },
  { code: "COP", symbol: "CO$", label: "Colombian Peso" },
  { code: "PEN", symbol: "S/",  label: "Peruvian Sol" },
  { code: "SAR", symbol: "﷼",   label: "Saudi Riyal" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
  { code: "QAR", symbol: "ر.ق", label: "Qatari Riyal" },
  { code: "KWD", symbol: "د.ك", label: "Kuwaiti Dinar" },
  { code: "ILS", symbol: "₪",   label: "Israeli Shekel" },
  { code: "TRY", symbol: "₺",   label: "Turkish Lira" },
  { code: "MAD", symbol: "د.م.",label: "Moroccan Dirham" },
  { code: "TND", symbol: "د.ت", label: "Tunisian Dinar" },
  { code: "EGP", symbol: "ج.م", label: "Egyptian Pound" },
  { code: "ZAR", symbol: "R",   label: "South African Rand" },
];

export function getCurrency(code: string | undefined | null): CurrencyMeta {
  if (!code) return currencies[0];
  return currencies.find((c) => c.code === code) || currencies[0];
}
