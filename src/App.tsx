import CatalogPasswordGate from "@/components/CatalogPasswordGate";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import CatalogPage from "./pages/CatalogPage";
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
import MentionsLegalesPage from "./pages/MentionsLegalesPage";
import PolitiqueConfidentialitePage from "./pages/PolitiqueConfidentialitePage";
import CGVPage from "./pages/CGVPage";
import OnboardingPage from "./pages/OnboardingPage";
import AIPage from "./pages/AIPage";
import AgencePage from "./pages/AgencePage";
import PourquoiBiolystesPage from "./pages/PourquoiBiolystesPage";
import PourquoiCetteOffrePage from "./pages/PourquoiCetteOffrePage";
import RdvPage from "./pages/RdvPage";
import CommentCaMarchePage from "./pages/CommentCaMarchePage";
import LivraisonPage from "./pages/LivraisonPage";
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
import BarreActus from "./actus/BarreActus";

/* Accueil repris de lystes.ai/bio (12/10/2026) : chargé à part, pour que
   son poids (thème et blocs de lystes.ai) ne pèse pas sur les autres pages. */
const AccueilCommeBioPage = lazy(() => import("./pages/AccueilCommeBioPage"));
/* La partie Actus vit dans le même cadre que l’accueil (thème de lystes.ai). */
const ActusPage = lazy(() => import("./actus/ActusPage"));
const ArticlePage = lazy(() => import("./actus/ArticlePage"));

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
      <Route path="/" element={<Suspense fallback={null}><AccueilCommeBioPage /></Suspense>} />
      <Route path="/decouverte" element={<Layout><DecouvertePage /></Layout>} />
      <Route path="/concept" element={<Layout><ConceptPage /></Layout>} />
      <Route path="/chat" element={<Layout><DashboardPage /></Layout>} />
      <Route path="/catalogue" element={<Layout><CatalogPasswordGate><CatalogPage /></CatalogPasswordGate></Layout>} />
      <Route path="/portfolio" element={<Layout><PortfolioPage /></Layout>} />
      <Route path="/ai" element={<Layout><AIPage /></Layout>} />
      <Route path="/agence" element={<Layout><AgencePage /></Layout>} />
      <Route path="/pricing" element={<Navigate to="/rdv" replace />} />
      <Route path="/tarifs" element={<Navigate to="/rdv" replace />} />
      <Route path="/etudes" element={<Layout><PourquoiBiolystesPage /></Layout>} />
      <Route path="/pourquoi-cette-offre" element={<Layout><PourquoiCetteOffrePage /></Layout>} />
      {/* Actus (12/10/2026) : cadre de l’accueil, articles dans src/actus/articles.ts. */}
      <Route path="/blog" element={<Suspense fallback={null}><ActusPage /></Suspense>} />
      <Route path="/actus" element={<Navigate to="/blog" replace />} />
      <Route path="/blog/:slug" element={<Suspense fallback={null}><ArticlePage /></Suspense>} />
      <Route path="/rdv" element={<Layout><RdvPage /></Layout>} />
      <Route path="/comment-ca-marche" element={<Layout><CommentCaMarchePage /></Layout>} />
      <Route path="/livraison" element={<Layout><LivraisonPage /></Layout>} />
      <Route path="/equipe-ia" element={<Layout><EquipeIAPage /></Layout>} />
      <Route path="/responsabilite" element={<Layout><ResponsabilitePage /></Layout>} />
      <Route path="/glowly" element={<Layout><GlowlyPage /></Layout>} />
      <Route path="/link" element={<Layout><LinkPage /></Layout>} />
      <Route path="/infos" element={<Layout><InfosPage /></Layout>} />
      <Route path="/qualite" element={<Layout><QualitePage /></Layout>} />
      <Route path="/wirtzkin" element={<Layout><WirtzkinPage /></Layout>} />
      <Route path="/echantillons" element={<Layout><EchantillonsPage /></Layout>} />
      <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
      <Route path="/mentions-legales" element={<Layout><MentionsLegalesPage /></Layout>} />
      <Route path="/politique-confidentialite" element={<Layout><PolitiqueConfidentialitePage /></Layout>} />
      <Route path="/cgv" element={<Layout><CGVPage /></Layout>} />

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
          {/* Barre « Voir nos dernières actus » et orbital, sur toutes les pages publiques. */}
          <BarreActus />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
