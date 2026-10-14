/* Le cadre des pages Actus : même thème, même en-tête et même pied de page
   que la page d’accueil reprise de lystes.ai/bio (JP, 12/10/2026 : « mêmes
   en-tête et pied de page »).

   Mêmes réglages que src/pages/AccueilCommeBioPage.tsx : la classe
   `.lystes-racine` sur <body> (thème de lystes.ai, voir postcss.config.js)
   et la largeur du téléphone dans la balise viewport (le reste du site est
   affiché sur 1200 px). Les classes Tailwind de src/actus sont compilées
   avec le thème de lystes.ai (lystes/tailwind.config.ts, `content`). */
import "@lystes/index.css";
import "@lystes/i18n/config";
import { useEffect, useLayoutEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { PreferencesProvider } from "@lystes/contexts/PreferencesContext";
import { AccountProvider } from "@lystes/contexts/AccountContext";
import { TooltipProvider } from "@lystes/components/ui/tooltip";
import { Header } from "@lystes/components/landing/Header";
import { Footer } from "@lystes/components/landing/Footer";
import { CommeSurAccueil } from "@lystes/features/solutions/CommeSurAccueil";

const LARGEUR_TELEPHONE = "width=device-width, initial-scale=1.0";

export default function CadreActus({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  /* D’un article à l’autre, on repart du haut de la page. */
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  useLayoutEffect(() => {
    document.body.classList.add("lystes-racine");
    const fenetre = document.querySelector('meta[name="viewport"]');
    const largeurAvant = fenetre?.getAttribute("content");
    fenetre?.setAttribute("content", LARGEUR_TELEPHONE);
    return () => {
      document.body.classList.remove("lystes-racine");
      if (fenetre && largeurAvant) fenetre.setAttribute("content", largeurAvant === LARGEUR_TELEPHONE ? "width=1200" : largeurAvant);
    };
  }, []);

  return (
    <PreferencesProvider>
      <TooltipProvider>
        <AccountProvider>
          <div className="bio-scope min-h-screen bg-white text-[#1d1d1f] overflow-x-hidden">
            <CommeSurAccueil>
              <Header />
            </CommeSurAccueil>
            <main className="pt-[72px]">{children}</main>
            <Footer marque="biolystes" />
          </div>
        </AccountProvider>
      </TooltipProvider>
    </PreferencesProvider>
  );
}

/* Le bouton noir de l’accueil (« Prendre rendez-vous », .btn-startup de
   lystes/src/index.css), seul appel à l’action des articles. */
export function BoutonRdv({ libelle = "Prendre rendez-vous" }: { libelle?: string }) {
  return (
    <a href="https://biolystes.pro/rdv" target="_blank" rel="noopener noreferrer" className="btn-startup">
      <span>{libelle}</span>
      <span className="arrow-circle">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
      </span>
    </a>
  );
}
