import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/DashboardPage";
import AgentsPage from "./pages/AgentsPage";
import ProductsPage from "./pages/ProductsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LeadsPage from "./pages/LeadsPage";
import DiagnosticsPage from "./pages/DiagnosticsPage";
import TeamPage from "./pages/TeamPage";
import SettingsPage from "./pages/SettingsPage";
import PublicAgentPage from "./pages/PublicAgentPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Routes that use the main layout (sidebar)
const LAYOUT_ROUTES = ["/", "/agents", "/products", "/analytics", "/leads", "/diagnostics", "/team", "/support", "/settings"];

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
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/diagnostics" element={<DiagnosticsPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
