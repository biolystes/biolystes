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
      {/* Routes sans authentification requise */}
      <Route path="/" element={<Layout><DashboardPage /></Layout>} />
      <Route path="/catalog" element={<Layout><CatalogPage /></Layout>} />
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
