import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@lystes/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lystes/components/ui/select";
import { Button } from "@lystes/components/ui/button";
import {
  countries,
  currencies,
  usePreferences,
} from "@lystes/contexts/PreferencesContext";
import { languages, languesDisponibles } from "@lystes/i18n/config";
import { getCountry } from "@lystes/i18n/countries";
import { getCurrency, type Currency } from "@lystes/i18n/currencies";
import {
  URL_LOCALES,
  buildLocalizedPath,
  isLocalizedPath,
  parseLocalePath,
  type UrlLocale,
} from "@lystes/i18n/localized-routing";

interface PreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
* Inspired by the "Préférences" pattern (country / currency / language) used by
* e-commerce sites — but kept on-brand: Apple monochrome, zero shadow, zero visible
* border on the inner blocks (separation by background contrast only).
*/
export function PreferencesModal({ open, onOpenChange }: PreferencesModalProps) {
  const { t } = useTranslation();
  const { country, currency, language, apply } = usePreferences();
  const navigate = useNavigate();
  const location = useLocation();

  // État intermédiaire — n'est appliqué qu'à l'enregistrement (« Save »).
  const [draftCountry, setDraftCountry] = useState(country.code);
  const [draftCurrency, setDraftCurrency] = useState<Currency>(currency.code);
  const [draftLanguage, setDraftLanguage] = useState(language);

  // Réinitialise l'état intermédiaire à chaque (ré)ouverture de la modale.
  useEffect(() => {
    if (open) {
      setDraftCountry(country.code);
      setDraftCurrency(currency.code);
      setDraftLanguage(language);
    }
  }, [open, country.code, currency.code, language]);

  // Changer le pays dans la modale propose automatiquement la devise et la langue correspondantes.
  const handleCountryChange = (code: string) => {
    const c = getCountry(code);
    setDraftCountry(c.code);
    setDraftCurrency(c.currency);
    setDraftLanguage(c.language);
  };

  const handleSave = () => {
    apply({ country: draftCountry, currency: draftCurrency, language: draftLanguage });

    // Si on est sur une page SEO localisée (ou sa variante héritée sans préfixe),
    // naviguer vers la variante /<lng>/... correspondante pour que l'URL reste
    // en phase avec la langue choisie. Seules les langues exposées dans les URL
    // (en/fr) reçoivent un préfixe — les autres mettent à jour i18next et
    // conservent l'URL courante.
    const newLocale = draftLanguage as UrlLocale;
    if ((URL_LOCALES as readonly string[]).includes(newLocale)) {
      const { locale: currentLocale, rest } = parseLocalePath(location.pathname);
      if (isLocalizedPath(rest) && currentLocale !== newLocale) {
        navigate(
          `${buildLocalizedPath(newLocale, rest)}${location.search}${location.hash}`,
        );
      }
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[420px] bg-white p-0 gap-0 [&>button]:hidden"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="font-heading text-2xl font-light tracking-tight text-stone-900">
            {t("preferences.title", "Préférences")}
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-full text-stone-500 hover:text-stone-900 transition-colors"
            aria-label={t("common.close", "Fermer")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {/* Country */}
          <div className="bg-neutral-50 rounded-xl px-4 py-3">
            <label className="block text-[11px] uppercase tracking-wide text-stone-500 mb-1">
              {t("preferences.country", "Pays")}
            </label>
            <Select value={draftCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-full border-0 bg-transparent p-0 h-auto shadow-none focus:ring-0 focus:ring-offset-0 text-base font-medium text-stone-900">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500">
                      {getCountry(draftCountry).code}
                    </span>
                    <span>{getCountry(draftCountry).label}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              {/* Code pays en petites capitales, pas de drapeau emoji : même
                  règle que pour la langue plus bas, appliquée ici pour que la
                  modale ne mélange pas les deux traitements. `countries.ts`
                  porte encore un champ `flag`, utilisé par d'autres écrans. */}
              <SelectContent className="max-h-72">
                {countries.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="flex items-center gap-2">
                      <span className="w-6 text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">
                        {c.code}
                      </span>
                      <span>{c.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Currency */}
          <div className="bg-neutral-50 rounded-xl px-4 py-3">
            <label className="block text-[11px] uppercase tracking-wide text-stone-500 mb-1">
              {t("preferences.currency", "Devise")}
            </label>
            <Select
              value={draftCurrency}
              onValueChange={(v) => setDraftCurrency(v as Currency)}
            >
              <SelectTrigger className="w-full border-0 bg-transparent p-0 h-auto shadow-none focus:ring-0 focus:ring-offset-0 text-base font-medium text-stone-900">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span>{getCurrency(draftCurrency).code}</span>
                    <span className="text-stone-500">
                      {getCurrency(draftCurrency).symbol}
                    </span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="flex items-center gap-2">
                      <span className="font-medium">{c.code}</span>
                      <span className="text-stone-500 text-sm">{c.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="bg-neutral-50 rounded-xl px-4 py-3">
            <label className="block text-[11px] uppercase tracking-wide text-stone-500 mb-1">
              {t("preferences.language", "Langue")}
            </label>
            <Select value={draftLanguage} onValueChange={setDraftLanguage}>
              <SelectTrigger className="w-full border-0 bg-transparent p-0 h-auto shadow-none focus:ring-0 focus:ring-offset-0 text-base font-medium text-stone-900">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500">
                      {languages.find((l) => l.code === draftLanguage)?.sigle}
                    </span>
                    <span>
                      {languages.find((l) => l.code === draftLanguage)?.label}
                    </span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              {/* On ne propose que `languesDisponibles` : les langues couvertes
                  de bout en bout, fichier global ET fichier de tableau de bord.
                  Liste dérivée des fichiers présents, voir config.ts.

                  `languages` reste au dessus, pour le seul libellé : une
                  préférence enregistrée avant ce resserrement doit rester
                  lisible plutôt que de s'afficher en blanc. Le choix, lui, est
                  ramené à une langue couverte par `langueServie` à
                  l'enregistrement (PreferencesContext.apply).

                  Sigle en petites capitales, pas de drapeau : règle de JP,
                  aucun emoji comme icône. */}
              <SelectContent className="max-h-72">
                {languesDisponibles.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    <span className="flex items-center gap-2">
                      <span className="w-6 text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">
                        {l.sigle}
                      </span>
                      <span>{l.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            className="w-full h-12 rounded-full bg-stone-900 text-white font-heading uppercase tracking-wide text-xs hover:bg-stone-800"
          >
            {t("preferences.save", "Enregistrer les préférences")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
