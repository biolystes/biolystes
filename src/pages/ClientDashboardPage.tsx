import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, ShoppingBag, ClipboardList, Package, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ClientBriefTab from "@/components/client/ClientBriefTab";
import ClientSelectionsTab from "@/components/client/ClientSelectionsTab";
import ClientContractsTab from "@/components/client/ClientContractsTab";
import ClientOrdersTab from "@/components/client/ClientOrdersTab";

const tabs = [
  { id: "brief", label: "Mon brief", icon: ClipboardList },
  { id: "selections", label: "Mes produits", icon: ShoppingBag },
  { id: "contracts", label: "Contrats", icon: FileText },
  { id: "orders", label: "Commandes", icon: Package },
];

export default function ClientDashboardPage() {
  const [activeTab, setActiveTab] = useState("brief");
  const { profile } = useAuth();

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#86868b", letterSpacing: "1.5px", textTransform: "uppercase" }}>
          Mon espace
        </span>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1d1d1f", marginTop: 6, letterSpacing: "-0.5px" }}>
          Bonjour{profile?.first_name ? ` ${profile.first_name}` : ""} 👋
        </h1>
        <p style={{ fontSize: 14, color: "#86868b", marginTop: 6 }}>
          Gérez votre projet cosmétique depuis cet espace.
        </p>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 6, marginTop: 28, marginBottom: 28, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 18px", borderRadius: 12, border: "none",
              background: activeTab === tab.id ? "#1d1d1f" : "#fff",
              color: activeTab === tab.id ? "#fff" : "#1d1d1f",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              transition: "all .15s",
            }}
          >
            <tab.icon size={15} strokeWidth={1.8} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "brief" && <ClientBriefTab />}
      {activeTab === "selections" && <ClientSelectionsTab />}
      {activeTab === "contracts" && <ClientContractsTab />}
      {activeTab === "orders" && <ClientOrdersTab />}
    </>
  );
}
