import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getJsxT } from "@lystes/i18n/jsx-locale";

const PREFIX = "lystes.ai/";

/**
 * Barre d'annonce affichée au-dessus du header (page d'accueil).
 */
export function TopBar() {
  const [copied, setCopied] = useState(false);
  const { i18n } = useTranslation();
  const t = getJsxT("home-blocks", i18n.language);
  /* Deux-points à la française (espace insécable avant) seulement en français. */
  const deuxPoints = (i18n.language || "fr").toLowerCase().startsWith("fr") ? "\u00a0:" : ":";

  /* « Copié » ne s'affiche que si la copie a réellement eu lieu. Le repli
     `execCommand` était appelé sans lire son résultat, puis « Copié »
     s'affichait sans condition : la visiteuse collait ensuite du vide. */
  const handleCopy = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(PREFIX);
      ok = true;
    } catch {
      const el = document.createElement("textarea");
      el.value = PREFIX;
      document.body.appendChild(el);
      el.select();
      try {
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      }
      document.body.removeChild(el);
    }
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-neutral-950" style={{ background: "#e1f3c5" }}>
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-1.5 px-2 py-2 sm:gap-3 sm:px-6 lg:px-8">
        {/* Le texte se replie sur deux lignes au besoin au lieu de déborder
            sous le bouton Copier : mesuré à 375 px, 306 px de texte pour 294
            disponibles. Plus de tiret long devant la consigne : deux-points. */}
        <span className="flex min-w-0 items-center gap-1.5 text-[10px] leading-[1.25] sm:gap-2 sm:whitespace-nowrap sm:text-[13px] sm:leading-none">
          <span aria-hidden="true" className="relative flex h-1.5 w-1.5 shrink-0 sm:h-2 sm:w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neutral-950 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neutral-950 sm:h-2 sm:w-2" />
          </span>
          <span className="min-w-0">
            <span className="font-semibold">{t("Démo")}{deuxPoints}</span>{" "}
            <span className="text-neutral-950/90">{t("Ajoutez « lystes.ai/ » au début de l’URL d’un produit.")}</span>
          </span>
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`${t("Copier")} ${PREFIX}`}
          className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-neutral-950 px-2 py-1.5 text-[9px] font-semibold leading-none text-white transition-colors hover:bg-neutral-950/90 sm:px-[11px] sm:py-2 sm:text-[10px]"
        >
          {copied ? (
            <Check className="h-2.5 w-2.5" strokeWidth={2} />
          ) : (
            <Copy className="h-2.5 w-2.5" strokeWidth={2} />
          )}
          {copied ? t("Copié") : t("Copier")}
        </button>
      </div>
    </div>
  );
}
