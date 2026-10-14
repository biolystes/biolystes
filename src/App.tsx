import CatalogPasswordGate from "@/components/CatalogPasswordGate";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import PortfolioPage from "./pages/PortfolioPage";
import PublicAgentPage from "./pages/PublicAgentPage";
import SharedSelectionPage from "./pages/SharedSelectionPage";
import ConceptPage from "./pages/ConceptPage";
import DecouvertePage from "./pages/DecouvertePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ClientDashboardPage from "./pages/ClientDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";
import AIPage from "./pages/AIPage";
import AgencePage from "./pages/AgencePage";
import RdvPage from "./pages/RdvPage";
import CommentCaMarchePage from "./pages/CommentCaMarchePage";
import EquipeIAPage from "./pages/EquipeIAPage";
import ResponsabilitePage from "./pages/ResponsabilitePage";
import GlowlyPage from "./pages/GlowlyPage";
import LinkPage from "./pages/LinkPage";
import InfosPage from "./pages/InfosPage";
import QualitePage from "./pages/QualitePage";
import WirtzkinPage from "./pages/WirtzkinPage";
import EchantillonsPage from "./pages/EchantillonsPage";
import { lazy, Suspense } from "react";
import { usePolicesDuSite } from "./lib/polices-du-site";

/* Accueil repris de lystes.ai/bio (12/10/2026) : chargé à part, pour que
   son poids (thème et blocs de lystes.ai) ne pèse pas sur les autres pages. */
const AccueilCommeBioPage = lazy(() => import("./pages/AccueilCommeBioPage"));
/* /agents-ia : l'accueil de lystes.ai repris (13/10/2026). Il partage avec
   l'accueil une coquille (route parente) : la bascule de l'en-tête passe de
   l'un à l'autre sans rechargement. */
const CoquilleLystes = lazy(() => import("./pages/CoquilleLystes"));
const AgentsIaPage = lazy(() => import("./pages/AgentsIaPage"));
/* La partie Actus vit dans le même cadre que l’accueil (thème de lystes.ai). */
const ActusPage = lazy(() => import("./actus/ActusPage"));
const ArticlePage = lazy(() => import("./actus/ArticlePage"));
/* Les pages liées depuis le pied de page (14/10/2026) : même en-tête, même
   pied de page et même thème que l’accueil, dans un cadre commun
   (src/pages/pied/CadrePied.tsx). Chargées à part, comme l’accueil. */
const CadrePied = lazy(() => import("./pages/pied/CadrePied"));
const PourquoiCetteOffrePage = lazy(() => import("./pages/PourquoiCetteOffrePage"));
const PourquoiBiolystesPage = lazy(() => import("./pages/PourquoiBiolystesPage"));
const MentionsLegalesPage = lazy(() => import("./pages/MentionsLegalesPage"));
const PolitiqueConfidentialitePage = lazy(() => import("./pages/PolitiqueConfidentialitePage"));
const CGVPage = lazy(() => import("./pages/CGVPage"));
/* /faq : les questions fréquentes, à plat (14/10/2026). */
const FaqPage = lazy(() => import("./pages/FaqPage"));
/* /a-propos : la page Entreprise de lystes.ai reprise pour Biolystes (14/10/2026). */
const AProposPage = lazy(() => import("./pages/AProposPage"));
/* /tarifs (14/10/2026) : la page des prix, liée nulle part et non indexée. */
const TarifsPage = lazy(() => import("./pages/TarifsPage"));
const LivraisonPage = lazy(() => import("./pages/LivraisonPage"));
/* /innovation (14/10/2026) : « Toujours plus d’innovation », dans le menu principal. */
const InnovationPage = lazy(() => import("./pages/InnovationPage"));
/* /catalogue (14/10/2026) : le catalogue de biolystes.pro, dans le même cadre
   que /tarifs (en-tête, pied de page, mot de passe à l'identité du site). */
const CatalogPage = lazy(() => import("./pages/CatalogPage"));

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  usePolicesDuSite(location.pathname);
  const isPublicAgentRoute = location.pathname.startsWith("/agent/");
  const isSharedSelectionRoute = location.pathname.startsWith("/selection/");

  if (isPublicAgentRoute) {
    return <Routes><Route path="/agent/:agentId" element={<PublicAgentPage />} /></Routes>;
  }
  if (isSharedSelectionRoute) {
    return <Routes><Route path="/selection/:selectionId" element={<SharedSelectionPage />} /></Routes>;
  }

  return (
    <Routes>
      <Route element={<Suspense fallback={null}><CoquilleLystes /></Suspense>}>
        <Route path="/" element={<Suspense fallback={null}><AccueilCommeBioPage /></Suspense>} />
        <Route path="/agents-ia" element={<Suspense fallback={null}><AgentsIaPage /></Suspense>} />
      </Route>
      <Route path="/decouverte" element={<Layout><DecouvertePage /></Layout>} />
      <Route path="/concept" element={<Layout><ConceptPage /></Layout>} />
      <Route path="/chat" element={<Layout><DashboardPage /></Layout>} />
      <Route path="/portfolio" element={<Layout><PortfolioPage /></Layout>} />
      <Route path="/ai" element={<Layout><AIPage /></Layout>} />
      <Route path="/agence" element={<Layout><AgencePage /></Layout>} />
      <Route path="/pricing" element={<Navigate to="/rdv" replace />} />
      <Route element={<Suspense fallback={null}><CadrePied /></Suspense>}>
        <Route path="/pourquoi-cette-offre" element={<Suspense fallback={null}><PourquoiCetteOffrePage /></Suspense>} />
        <Route path="/etudes" element={<Suspense fallback={null}><PourquoiBiolystesPage /></Suspense>} />
        <Route path="/mentions-legales" element={<Suspense fallback={null}><MentionsLegalesPage /></Suspense>} />
        <Route path="/politique-confidentialite" element={<Suspense fallback={null}><PolitiqueConfidentialitePage /></Suspense>} />
        <Route path="/cgv" element={<Suspense fallback={null}><CGVPage /></Suspense>} />
        <Route path="/faq" element={<Suspense fallback={null}><FaqPage /></Suspense>} />
        <Route path="/a-propos" element={<Suspense fallback={null}><AProposPage /></Suspense>} />
        <Route path="/tarifs" element={<Suspense fallback={null}><CatalogPasswordGate titre="Offre privée" objet="à l’offre"><TarifsPage /></CatalogPasswordGate></Suspense>} />
        <Route path="/livraison" element={<Suspense fallback={null}><LivraisonPage /></Suspense>} />
        <Route path="/innovation" element={<Suspense fallback={null}><InnovationPage /></Suspense>} />
        <Route path="/catalogue" element={<Suspense fallback={null}><CatalogPasswordGate><CatalogPage /></CatalogPasswordGate></Suspense>} />
      </Route>
      {/* Actus (12/10/2026) : cadre de l’accueil, articles dans src/actus/articles.ts. */}
      <Route path="/blog" element={<Suspense fallback={null}><ActusPage /></Suspense>} />
      <Route path="/actus" element={<Navigate to="/blog" replace />} />
      <Route path="/blog/:slug" element={<Suspense fallback={null}><ArticlePage /></Suspense>} />
      <Route path="/rdv" element={<Layout><RdvPage /></Layout>} />
      <Route path="/comment-ca-marche" element={<Layout><CommentCaMarchePage /></Layout>} />
      <Route path="/equipe-ia" element={<Layout><EquipeIAPage /></Layout>} />
      <Route path="/responsabilite" element={<Layout><ResponsabilitePage /></Layout>} />
      <Route path="/glowly" element={<Layout><GlowlyPage /></Layout>} />
      <Route path="/link" element={<Layout><LinkPage /></Layout>} />
      <Route path="/infos" element={<Layout><InfosPage /></Layout>} />
      <Route path="/qualite" element={<Layout><QualitePage /></Layout>} />
      <Route path="/wirtzkin" element={<Layout><WirtzkinPage /></Layout>} />
      <Route path="/echantillons" element={<Layout><EchantillonsPage /></Layout>} />
      <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Onboarding */}
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />

      {/* Client Dashboard */}
      <Route path="/espace-client" element={<ProtectedRoute><Layout><ClientDashboardPage /></Layout></ProtectedRoute>} />

      {/* Admin Dashboard */}
      <Route path="/admin" element={<AdminRoute><Layout><AdminDashboardPage /></Layout></AdminRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
