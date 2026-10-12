import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { PreferencesModal } from "@lystes/components/preferences/PreferencesModal";
import { usePreferences } from "@lystes/contexts/PreferencesContext";

/**
 * Trigger for the global Preferences modal (Country / Currency / Language).
 * Replaces the previous language-only dropdown.
 */
export function HeaderLanguageSelector({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const { country } = usePreferences();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const light = overlay || pathname === "/";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors text-[13px] font-medium ${
          light ? "hover:bg-white/10" : "hover:bg-black/5"
        }`}
        aria-label={t("header.preferences", "Ouvrir les préférences")}
      >
        <span className="text-base leading-none">{country.flag}</span>
        <Globe className={`w-3.5 h-3.5 opacity-60 ${light ? "text-white" : ""}`} />
      </button>
      <PreferencesModal open={open} onOpenChange={setOpen} />
    </>
  );
}
