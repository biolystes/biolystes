import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import CatalogPage from "./pages/CatalogPage";
import SettingsPage from "./pages/SettingsPage";
import PortfolioPage from "./pages/PortfolioPage";
import PricingPage from "./pages/PricingPage";
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
import TarifsPage from "./pages/TarifsPage";
import PourquoiBiolystesPage from "./pages/PourquoiBiolystesPage";
import BlogPage from "./pages/BlogPage";
import ArticleCoffretsPage from "./pages/ArticleCoffretsPage";
import ArticleMarieClairePage from "./pages/ArticleMarieClairePage";
import ArticleLancerMarquePage from "./pages/ArticleLancerMarquePage";
import ArticleBiaisActifPage from "./pages/ArticleBiaisActifPage";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
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
      <Route path="/" element={<Layout><DecouvertePage /></Layout>} />
      <Route path="/decouverte" element={<Layout><DecouvertePage /></Layout>} />
      <Route path="/concept" element={<Layout><ConceptPage /></Layout>} />
      <Route path="/chat" element={<Layout><DashboardPage /></Layout>} />
      <Route path="/catalogue" element={<Layout><CatalogPage /></Layout>} />
      <Route path="/portfolio" element={<Layout><PortfolioPage /></Layout>} />
      <Route path="/ai" element={<Layout><AIPage /></Layout>} />
      <Route path="/agence" element={<Layout><AgencePage /></Layout>} />
      <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
      <Route path="/tarifs" element={<Layout><TarifsPage /></Layout>} />
      <Route path="/pourquoi-biolystes" element={<Layout><PourquoiBiolystesPage /></Layout>} />
      <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
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
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
