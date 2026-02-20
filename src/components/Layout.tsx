import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  Package,
  BarChart3,
  Users2,
  Settings,
  Menu,
  X,
  HelpCircle,
  FileText,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { path: "/", icon: LayoutDashboard, label: "Tableau de bord" },
  { path: "/agents", icon: Bot, label: "Agents IA" },
  { path: "/products", icon: Package, label: "Produits" },
  { path: "/diagnostics", icon: FileText, label: "Diagnostics" },
  { path: "/analytics", icon: BarChart3, label: "Analytics" },
  { path: "/leads", icon: Users2, label: "Leads" },
  { path: "/team", icon: Users2, label: "Équipe" },
];

const bottomItems = [
  { path: "/settings", icon: Settings, label: "Réglages" },
];

function IconSidebar() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className="hidden md:flex flex-col items-center fixed inset-y-0 left-0 z-30 py-5 gap-2"
      style={{
        width: "64px",
        background: "hsl(var(--sidebar-bg))",
        borderRight: "1px solid hsl(var(--sidebar-border))",
      }}
    >
      {/* Logo */}
      <Link to="/" className="mb-6">
        <img
          src="https://biolystes.com/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
          alt="Biolystes"
          className="h-8 w-8 animate-tourne object-contain"
        />
      </Link>

      {/* Main nav icons */}
      <div className="flex flex-col items-center gap-2 flex-1">
        {navItems.map((item) => (
          <Link key={item.path} to={item.path} title={item.label}>
            <div className={`sidebar-icon-btn ${isActive(item.path) ? "active" : ""}`}>
              <item.icon size={16} />
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom icons */}
      <div className="flex flex-col items-center gap-3 mt-auto">
        {bottomItems.map((item) => (
          <Link key={item.path} to={item.path} title={item.label}>
            <div className={`sidebar-icon-btn ${isActive(item.path) ? "active" : ""}`}>
              <item.icon size={16} />
            </div>
          </Link>
        ))}
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold cursor-pointer">
          A
        </div>
      </div>
    </aside>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop icon sidebar */}
      <IconSidebar />

      {/* Mobile overlay */}
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
              className="fixed inset-y-0 left-0 w-56 bg-card border-r border-border z-50 md:hidden flex flex-col p-4"
            >
              <div className="flex items-center gap-2 mb-6">
                <img
                  src="https://biolystes.com/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
                  alt="Biolystes"
                  className="h-7 w-7 object-contain"
                />
                <span className="font-bold pacifico">Biolystes AI</span>
              </div>
              <nav className="space-y-1 flex-1">
                {[...navItems, ...bottomItems].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 md:ml-16">
        {/* Mobile header */}
        <header className="md:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <img
              src="https://biolystes.com/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
              alt="Biolystes"
              className="h-7 w-7 object-contain"
            />
            <span className="font-bold pacifico">Biolystes AI</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </header>

        <main className="p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
