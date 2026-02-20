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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
  const isPublicAgentRoute = location.pathname.startsWith("/agent/");

  if (isPublicAgentRoute) {
    return (
      <Routes>
        <Route path="/agent/:agentId" element={<PublicAgentPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout><DashboardPage /></Layout>} />
      <Route path="/catalog" element={<Layout><CatalogPage /></Layout>} />
      <Route path="/portfolio" element={<Layout><PortfolioPage /></Layout>} />
      <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />
      <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />

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
