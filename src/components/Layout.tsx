import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LayoutGrid, Settings, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/", icon: Sparkles, label: "Configurateur" },
  { path: "/catalog", icon: LayoutGrid, label: "Catalogue" },
];

const bottomItems = [
  { path: "/settings", icon: Settings, label: "Réglages" },
];

function IconSidebar() {
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const initials = profile
    ? `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase() || "?"
    : "?";

  return (
    <aside
      className="hidden md:flex flex-col items-center fixed inset-y-0 left-0 z-30 py-5 gap-2"
      style={{ width: "64px", background: "#f9f9f9", borderRight: "1px solid #f0f0f0" }}
    >
      {/* Logo */}
      <Link to="/" className="mb-6">
        <img
          src="https://biolystes.com/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
          alt="Lystes"
          className="h-8 w-8 animate-tourne object-contain"
        />
      </Link>

      {/* Navigation principale */}
      <div className="flex flex-col items-center gap-2 flex-1">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} title={item.label}>
            <div className={`sidebar-icon-btn ${isActive(item.path) ? "active" : ""}`}>
              <item.icon size={16} strokeWidth={1.5} />
            </div>
          </Link>
        ))}
      </div>

      {/* Bas : réglages + déconnexion + avatar */}
      <div className="flex flex-col items-center gap-3 mt-auto">
        {bottomItems.map((item) => (
          <Link key={item.path} to={item.path} title={item.label}>
            <div className={`sidebar-icon-btn ${isActive(item.path) ? "active" : ""}`}>
              <item.icon size={16} strokeWidth={1.5} />
            </div>
          </Link>
        ))}
        <button
          onClick={signOut}
          title="Se déconnecter"
          className="sidebar-icon-btn"
        >
          <LogOut size={16} strokeWidth={1.5} />
        </button>
        <div
          className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold cursor-pointer"
          title={profile ? `${profile.first_name} ${profile.last_name}` : ""}
        >
          {initials}
        </div>
      </div>
    </aside>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <IconSidebar />

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
                  src="https://biolystes.com/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
                  alt="Lystes"
                  className="h-7 w-7 object-contain"
                />
                <span className="font-bold text-sm" style={{ color: "#1d1d1f" }}>Lystes.ai</span>
              </div>
              <nav className="space-y-1 flex-1">
                {[...navItems, ...bottomItems].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                  >
                    <item.icon size={16} strokeWidth={1.5} />
                    {item.label}
                  </Link>
                ))}
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
      <div className="flex-1 md:ml-16">
        {/* Header mobile */}
        <header className="md:hidden bg-card px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <img
              src="https://biolystes.com/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
              alt="Lystes"
              className="h-7 w-7 object-contain"
            />
            <span className="font-bold text-sm" style={{ color: "#1d1d1f" }}>Lystes.ai</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </header>

        <main className="p-6 lg:p-10" style={{ background: "#F5F5F7", minHeight: "100vh" }}>
          <div className="max-w-[1008px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
