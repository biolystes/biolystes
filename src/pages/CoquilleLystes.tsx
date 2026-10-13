/* Coquille des pages reprises de lystes.ai sur biolystes.com (13/10/2026) :
   l’accueil « / » (copie de lystes.ai/bio) et « /agents-ia » (copie de
   l’accueil de lystes.ai). Les deux pages partagent cette coquille par une
   route parente : passer de l’une à l’autre par la bascule de l’en-tête ne
   recharge rien et ne démonte pas la coquille, seul le contenu change.

   Les composants sont recopiés tels quels de petal-diagnostics dans
   lystes/src (alias @lystes). Ils gardent le thème de lystes.ai :
   lystes/src/index.css, compilée avec lystes/tailwind.config.ts et cantonnée
   à `.lystes-racine` (postcss.config.js). La classe est posée sur <body>
   tant qu’une de ces pages est affichée, pour que les fenêtres et menus
   rendus hors de la page (portails) gardent le même style ; elle est retirée
   en les quittant, et le catalogue garde son propre thème.

   Mêmes fournisseurs que lystes.ai autour des pages (src/main.tsx et
   src/App.tsx de petal-diagnostics). */
import "@lystes/index.css";
import "@lystes/i18n/config";
import { useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";
import { PreferencesProvider } from "@lystes/contexts/PreferencesContext";
import { AccountProvider } from "@lystes/contexts/AccountContext";
import { TooltipProvider } from "@lystes/components/ui/tooltip";

const LARGEUR_APPAREIL = "width=device-width, initial-scale=1.0";

export default function CoquilleLystes() {
  useLayoutEffect(() => {
    document.body.classList.add("lystes-racine");
    /* La règle `html { scroll-behavior: smooth }` de lystes.ai ne peut pas
       être cantonnée par une classe sur <body> : posée ici, le temps de ces
       pages (défilement doux des liens vers les sections). */
    const html = document.documentElement;
    const avant = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    /* Ces pages suivent la largeur du téléphone ; le reste de biolystes.com
       est affiché sur 1200 px (index.html). Le script de tête d’index.html le
       fait au premier chargement, ceci suit la navigation. */
    const fenetre = document.querySelector('meta[name="viewport"]');
    const largeurAvant = fenetre?.getAttribute("content");
    fenetre?.setAttribute("content", LARGEUR_APPAREIL);
    return () => {
      document.body.classList.remove("lystes-racine");
      html.style.scrollBehavior = avant;
      if (fenetre && largeurAvant) {
        fenetre.setAttribute("content", largeurAvant === LARGEUR_APPAREIL ? "width=1200" : largeurAvant);
      }
    };
  }, []);

  return (
    <PreferencesProvider>
      <TooltipProvider>
        <AccountProvider>
          <Outlet />
        </AccountProvider>
      </TooltipProvider>
    </PreferencesProvider>
  );
}
