import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
* Fenêtre d'essai du hero.
*
* Ce n'est PAS une imitation de /shot : c'est /shot lui-même, servi dans la
* page en plein écran. Même scrape (`shot-scrape`), mêmes 9 générations
* (`shot-generate-frame`), même carte produit et même modale d'expérience
* (diagnostic / essayage) — aucune logique dupliquée ici.
*
* ELLE DOIT SE FERMER AU DOIGT.
* Jusqu'au 26/09/2026, la fenêtre était en z-index 9999 et l'en-tête public en
* 9 999 999 (Header.tsx). L'en-tête, haut de 110 px avec son bandeau, passait
* PAR-DESSUS le bouton Fermer : un toucher sur la croix tombait sur le bandeau
* « Démo ». Seule la touche Échap fermait la fenêtre, et un téléphone n'en a
* pas. La fenêtre passe au-dessus de tout (y compris le panneau mobile de
* l'en-tête, 99 999 999), la croix grandit à 44 px, la zone de sécurité du
* haut de l'écran est respectée, et un toucher hors de la fiche ferme aussi.
*/
export default function HeroTryModal({ url, onClose }: { url: string; onClose: () => void }) {
  const { t } = useTranslation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const src = `/shot?url=${encodeURIComponent(url)}&fiche=1`;

  return createPortal(
    <div className="fixed inset-0 z-[100000000] bg-background" role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={onClose}
        aria-label={t("header.close", "Fermer")}
        className="absolute right-4 z-10 h-11 w-11 rounded-[9px] bg-foreground/90 text-background flex items-center justify-center"
        style={{ top: "max(16px, env(safe-area-inset-top))" }}
      >
        <X className="h-4 w-4" />
      </button>
      {/* La fiche produit mobile de /shot, telle quelle : meme composant,
          meme scrape, memes generations, meme diagnostic et meme essayage.
          Le cadre reproduit la largeur d'un telephone pour qu'elle s'affiche
          exactement comme sur mobile. Un toucher sur le fond, hors de la
          fiche, ferme la fenetre. */}
      <div
        className="w-full h-full flex items-center justify-center p-3 pt-16"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <iframe
          src={src}
          title="Lystes Shot"
          className="w-full max-w-[390px] h-full border-0 rounded-[1.75rem] bg-white"
          allow="camera; clipboard-write"
        />
      </div>
    </div>,
    document.body,
  );
}
