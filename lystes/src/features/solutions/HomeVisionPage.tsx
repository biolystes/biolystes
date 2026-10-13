import AgentsVisionRawPage from "./AgentsVisionRawPage";
import { Header } from "@lystes/components/landing/Header";
import { TopBar } from "@lystes/components/landing/TopBar";
import { Footer } from "@lystes/components/landing/Footer";
import { SolutionBottomPattern } from "./SolutionBottomPattern";
import { CommeSurAccueil } from "./CommeSurAccueil";
import { useSansMotSeul } from "@lystes/hooks/useSansMotSeul";

/**
 * Route `/accueil-v2` (09/10/2026, JP) : clone de l'accueil pour faire
 * comprendre la vision en quatre étages. Copie de `HomeAgentsAutonomesPage`,
 * même coquille (en-tête en surimpression, barre haute, pied de page), mais le
 * contenu vient de `AgentsVisionRawPage`. Aucun fichier propre à l'accueil
 * n'est modifié : `/` ne bouge pas d'un pixel.
 */
export default function HomeVisionPage() {
  /* Aucun mot seul en fin de ligne, nulle part sur la page (JP). */
  useSansMotSeul();
  return (
    <>
      <style>{`
        [data-solution-shell] header.particuliers-scope { display: none !important; }
        /* Le hero vidéo apporte son propre fond : on masque le gradient hérité en haut de la home. */
        [data-solution-shell] [data-solution-hero-bg],
        [data-solution-shell] img[src*="hero-gradient"] { display: none !important; }
      `}</style>
      {/* L'en-tête lit le chemin : sur « / » il prend toute la largeur et
          porte la bascule Ecommerce / Entreprises. On lui présente « / ». */}
      <CommeSurAccueil>
        {/* biolystes.com : pas de bandeau « Démo : ajoutez lystes.ai/ » (pistache
            réservé au pied de page, refusé sur /bio). */}
        <Header overlay />
      </CommeSurAccueil>
      <main data-solution-shell data-vision-shell style={{ paddingTop: 0 }}>
        <AgentsVisionRawPage />
        <SolutionBottomPattern />
      </main>
      <Footer />
    </>
  );
}
