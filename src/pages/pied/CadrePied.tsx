/* Le cadre des pages liées depuis le pied de page (JP, 14/10/2026 : « le
   même design que la nouvelle page d’accueil ») : /pourquoi-cette-offre,
   /etudes, /mentions-legales, /politique-confidentialite, /cgv.

   Mêmes réglages que l’accueil (src/pages/CoquilleLystes.tsx) : thème de
   lystes.ai cantonné à `.lystes-racine` posée sur <body>, largeur du
   téléphone dans la balise viewport (le reste du site est affiché sur
   1200 px), même en-tête et même pied de page Biolystes. Route parente
   (App.tsx) : passer d’une de ces pages à l’autre ne démonte pas le cadre.

   `.pied-page` porte les classes de ces pages (pied.css, tailwind.config.ts
   à côté), sur <main> seulement ; `.bio-scope` reprend les réglages de
   l’accueil (boutons, gras). */
import "@lystes/index.css";
import "@lystes/i18n/config";
import "./pied.css";
import { useEffect, useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { PreferencesProvider } from "@lystes/contexts/PreferencesContext";
import { AccountProvider } from "@lystes/contexts/AccountContext";
import { TooltipProvider } from "@lystes/components/ui/tooltip";
import { Header } from "@lystes/components/landing/Header";
import { Footer } from "@lystes/components/landing/Footer";
import { CommeSurAccueil } from "@lystes/features/solutions/CommeSurAccueil";

const LARGEUR_TELEPHONE = "width=device-width, initial-scale=1.0";

export default function CadrePied() {
  const { pathname, hash } = useLocation();
  /* D’une page à l’autre, on repart du haut ; un lien de sommaire (#…)
     garde sa cible. */
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);

  useLayoutEffect(() => {
    document.body.classList.add("lystes-racine");
    const html = document.documentElement;
    const avant = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    const fenetre = document.querySelector('meta[name="viewport"]');
    const largeurAvant = fenetre?.getAttribute("content");
    fenetre?.setAttribute("content", LARGEUR_TELEPHONE);
    return () => {
      document.body.classList.remove("lystes-racine");
      html.style.scrollBehavior = avant;
      if (fenetre && largeurAvant) fenetre.setAttribute("content", largeurAvant === LARGEUR_TELEPHONE ? "width=1200" : largeurAvant);
    };
  }, []);

  return (
    <PreferencesProvider>
      <TooltipProvider>
        <AccountProvider>
          <div className="bio-scope min-h-screen bg-background text-foreground overflow-x-hidden">
            <CommeSurAccueil>
              <Header />
            </CommeSurAccueil>
            {/* `.pied-page` sur <main> seulement : posée plus haut, ses classes
                (plus prioritaires) écraseraient celles de l’en-tête et du pied
                de page (« hidden » contre « lg:flex »). */}
            <main className="pied-page" style={{ paddingTop: 72 }}>
              <Outlet />
            </main>
            <Footer marque="biolystes" />
          </div>
        </AccountProvider>
      </TooltipProvider>
    </PreferencesProvider>
  );
}
