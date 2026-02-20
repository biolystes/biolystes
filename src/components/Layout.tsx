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
  ChevronRight,
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
  { path: "/support", icon: HelpCircle, label: "Aide & Support" },
  { path: "/settings", icon: Settings, label: "Réglages" },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <img
          src="https://biolystes.com/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
          alt="Biolystes"
          className="h-8 w-8 rounded-lg object-contain"
        />
        <span className="font-bold text-lg pacifico">Biolystes AI</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1">{item.label}</span>
            {isActive(item.path) && (
              <ChevronRight className="h-3 w-3 opacity-50" />
            )}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-accent transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin</p>
            <p className="text-xs text-muted-foreground truncate">admin@biolystes.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-card border-r border-border z-30">
        <SidebarContent />
      </aside>

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
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 md:hidden"
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Mobile header */}
        <header className="md:hidden bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <img
              src="https://biolystes.com/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
              alt="Biolystes"
              className="h-7 w-7 rounded-lg object-contain"
            />
            <span className="font-bold pacifico">Biolystes AI</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>

        {/* Page content */}
        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
