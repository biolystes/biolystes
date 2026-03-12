import { useState } from "react";
import BiolystesArticlesWidget from "./BiolystesArticlesWidget";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Menu, X, LogOut, Compass, LayoutDashboard, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const publicNavItems = [
  { path: "/", label: "Offre cosmétique" },
  { path: "/agence", label: "Offre agence" },
  { path: "/ai", label: "Offre IA" },
  { path: "/pourquoi-biolystes", label: "Pourquoi Biolystes ?" },
];

const RDV_URL = "https://app.iclosed.io/e/paylystes/r2";

function TopNavBar() {
  const location = useLocation();
  const { user, profile, signOut, isAdmin } = useAuth();

  const navItems = [
    ...publicNavItems,
    ...(user ? [{ path: "/espace-client", icon: LayoutDashboard, label: "Mon espace" }] : []),
    ...(isAdmin ? [{ path: "/admin", icon: Shield, label: "Admin" }] : []),
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const initials = profile
    ? `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() || "?"
    : "?";

  return (
    <header
      className="hidden md:flex items-center fixed top-0 left-0 right-0 z-40 px-6"
      style={{
        height: 56,
        background: "#f5f4df",
        borderBottom: "1px solid #1d1d1f",
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center shrink-0 mr-3">
        <img
          src="https://biolystes.pro/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
          alt="Lystes"
          className="h-10 w-10 animate-tourne object-contain"
        />
      </Link>

      {/* Promo text */}
      <span className="whitespace-nowrap mr-auto" style={{ fontFamily: "'Inter'", fontSize: "10px", fontWeight: 700 }}>
        🔥 CETTE SEMAINE : -20% SUR NOS OFFRES
      </span>

      {/* Nav */}
      <nav className="flex items-center gap-3 shrink-0">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <span
              className={`text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? "text-foreground"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {item.label}
            </span>
          </Link>
        ))}

        <Link to="/chat" className="btn-outline">
          <span>Poser vos questions</span>
          <span className="arrow-circle">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <a
          href={RDV_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-startup"
        >
          <span>Prendre RDV</span>
          <span className="arrow-circle">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </a>
      </nav>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  const navItems = [
    ...publicNavItems,
    ...(user ? [{ path: "/espace-client", icon: LayoutDashboard, label: "Mon espace" }] : []),
    ...(isAdmin ? [{ path: "/admin", icon: Shield, label: "Admin" }] : []),
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#f5f4df" }}>
      <TopNavBar />

      {/* Overlay mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -220 }}
              animate={{ x: 0 }}
              exit={{ x: -220 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-56 bg-card z-50 md:hidden flex flex-col p-4"
            >
              <div className="flex items-center gap-2 mb-6">
                <img
                  src="https://biolystes.pro/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
                  alt="Lystes"
                  className="h-7 w-7 object-contain"
                />
                <span className="font-bold text-sm" style={{ color: "#1d1d1f" }}>Biolystes</span>
              </div>
              <nav className="space-y-1 flex-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                  >
                    {'icon' in item && item.icon && <item.icon size={16} strokeWidth={1.5} />}
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/settings"
                  onClick={() => setMobileOpen(false)}
                  className={`nav-item ${isActive("/settings") ? "active" : ""}`}
                >
                  <Settings size={16} strokeWidth={1.5} />
                  Réglages
                </Link>
                <button
                  onClick={signOut}
                  className="nav-item w-full text-left"
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <LogOut size={16} strokeWidth={1.5} />
                  Se déconnecter
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Contenu principal */}
      <div className="flex-1">
        {/* Header mobile */}
        <header className="md:hidden bg-card px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <img
              src="https://biolystes.pro/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
              alt="Lystes"
              className="h-7 w-7 object-contain"
            />
            <span className="font-bold text-sm" style={{ color: "#1d1d1f" }}>Biolystes</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </header>

        <main className="md:pt-[56px]" style={{ background: "#f5f4df", minHeight: "100vh", maxWidth: 1200, margin: "0 auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
