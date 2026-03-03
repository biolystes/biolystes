import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, LayoutGrid, Settings, Menu, X, LogOut, Images, Tag, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { path: "/", icon: Sparkles, label: "Configurateur" },
  { path: "/catalog", icon: LayoutGrid, label: "Catalogue" },
  { path: "/portfolio", icon: Images, label: "Portfolio" },
  { path: "/pricing", icon: Tag, label: "Tarifs" },
  { path: "/concept", icon: Lightbulb, label: "Concept" },
];

const bottomItems = [
  { path: "/settings", icon: Settings, label: "Réglages" },
];

function TextSidebar() {
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
      className="hidden md:flex flex-col fixed inset-y-0 left-0 z-30 py-5"
      style={{ width: "200px", background: "#F5F5F7", borderRight: "1px solid #e5e5e7" }}
    >
      {/* Logo */}
      <Link to="/" className="mb-6 flex items-center gap-2.5 px-5">
        <img
          src="https://biolystes.com/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
          alt="Lystes"
          className="h-7 w-7 animate-tourne object-contain"
        />
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.3px" }}>Lystes.ai</span>
      </Link>

      {/* Navigation principale */}
      <div className="flex flex-col gap-1 flex-1 px-3">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <div className={`nav-item ${isActive(item.path) ? "active" : ""}`}>
              <item.icon size={16} strokeWidth={1.5} />
              {item.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Bas : réglages + déconnexion + avatar */}
      <div className="flex flex-col gap-1 mt-auto px-3">
        {bottomItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <div className={`nav-item ${isActive(item.path) ? "active" : ""}`}>
              <item.icon size={16} strokeWidth={1.5} />
              {item.label}
            </div>
          </Link>
        ))}
        <button
          onClick={signOut}
          className="nav-item w-full"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Se déconnecter
        </button>
        <div className="flex items-center gap-2.5 px-3 py-2 mt-2">
          <div
            className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold"
          >
            {initials}
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#1d1d1f" }}>
            {profile ? `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim() || "Mon compte" : "Mon compte"}
          </span>
        </div>
      </div>
    </aside>
  );
}

const RDV_URL = "https://app.iclosed.io/e/paylystes/r2";

function TopBar() {
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, zIndex: 25,
      display: "flex", justifyContent: "flex-end", alignItems: "center",
      padding: "10px 28px",
      pointerEvents: "none",
    }} className="hidden md:flex">
      <a
        href={RDV_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          pointerEvents: "all",
          fontSize: 11, fontWeight: 700, letterSpacing: "1.2px",
          textTransform: "uppercase", textDecoration: "none",
          color: "#1d1d1f", border: "1.5px solid #1d1d1f",
          padding: "7px 18px", borderRadius: 20,
          background: "rgba(245,245,247,0.85)",
          backdropFilter: "blur(8px)",
          transition: "all .15s",
          display: "flex", alignItems: "center", gap: 7,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "#1d1d1f";
          (e.currentTarget as HTMLElement).style.color = "#fff";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "rgba(245,245,247,0.85)";
          (e.currentTarget as HTMLElement).style.color = "#1d1d1f";
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Prendre rendez-vous
      </a>
    </div>
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
      <TextSidebar />
      <TopBar />

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
      <div className="flex-1 md:ml-[200px]">
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
