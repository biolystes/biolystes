/* Page d’accueil de biolystes.com, reprise à l’identique de lystes.ai/bio
   (JP, 12/10/2026 : « ce que tu as fait dans /bio, tu le reproduis à la
   perfection sur biolystes.com »).

   La page et ses composants sont recopiés tels quels de petal-diagnostics
   dans lystes/src (alias @lystes). Ils gardent le thème de lystes.ai :
   lystes/src/index.css, compilée avec lystes/tailwind.config.ts et cantonnée
   à `.lystes-racine` (postcss.config.js). La classe est posée sur <body>
   tant que l’accueil est affiché, pour que les fenêtres et menus rendus hors
   de la page (portails) gardent le même style ; elle est retirée en quittant
   l’accueil, et le catalogue garde son propre thème.

   Mêmes fournisseurs que lystes.ai autour de la page (src/main.tsx et
   src/App.tsx de petal-diagnostics). */
import "@lystes/index.css";
import "@lystes/i18n/config";
import { useLayoutEffect } from "react";
import { PreferencesProvider } from "@lystes/contexts/PreferencesContext";
import { AccountProvider } from "@lystes/contexts/AccountContext";
import { TooltipProvider } from "@lystes/components/ui/tooltip";
import BioPage from "@lystes/pages/BioPage";

export default function AccueilCommeBioPage() {
  useLayoutEffect(() => {
    document.body.classList.add("lystes-racine");
    /* La règle `html { scroll-behavior: smooth }` de lystes.ai ne peut pas
       être cantonnée par une classe sur <body> : posée ici, le temps de
       l’accueil (défilement doux des liens vers les sections). */
    const html = document.documentElement;
    const avant = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    /* lystes.ai/bio suit la largeur du téléphone ; le reste de biolystes.com
       est affiché sur 1200 px (index.html). Le script de tête d’index.html le
       fait au premier chargement de « / », ceci suit la navigation. */
    const fenetre = document.querySelector('meta[name="viewport"]');
    const largeurAvant = fenetre?.getAttribute("content");
    fenetre?.setAttribute("content", "width=device-width, initial-scale=1.0");
    return () => {
      document.body.classList.remove("lystes-racine");
      html.style.scrollBehavior = avant;
      if (fenetre && largeurAvant) {
        fenetre.setAttribute("content", largeurAvant === "width=device-width, initial-scale=1.0" ? "width=1200" : largeurAvant);
      }
    };
  }, []);

  return (
    <PreferencesProvider>
      <TooltipProvider>
        <AccountProvider>
          <BioPage />
        </AccountProvider>
      </TooltipProvider>
    </PreferencesProvider>
  );
}
