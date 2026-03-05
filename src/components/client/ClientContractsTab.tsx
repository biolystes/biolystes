import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FileText, CheckCircle, Clock, Download } from "lucide-react";

interface Contract {
  id: string;
  title: string;
  pdf_url: string | null;
  status: string | null;
  signed_at: string | null;
  created_at: string;
}

export default function ClientContractsTab() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase.from("client_contracts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setContracts(data as Contract[]);
      setLoading(false);
    });
  }, [user]);

  const signContract = async (id: string) => {
    const { error } = await supabase.from("client_contracts").update({
      status: "signed",
      signed_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) { toast.error("Erreur"); return; }
    setContracts(c => c.map(ct => ct.id === id ? { ...ct, status: "signed", signed_at: new Date().toISOString() } : ct));
    toast.success("Contrat signé !");
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#86868b" }}>Chargement...</div>;

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 28 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f", marginBottom: 20 }}>Mes contrats</h2>

      {contracts.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "#86868b", fontSize: 14 }}>
          Aucun contrat pour le moment. Votre contrat apparaîtra ici lorsqu'il sera prêt.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {contracts.map(contract => (
            <div key={contract.id} style={{
              display: "flex", alignItems: "center", gap: 16, padding: 18,
              background: "#f9f9fb", borderRadius: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: contract.status === "signed" ? "#f0fdf4" : "#fef3c7",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {contract.status === "signed" ? <CheckCircle size={20} color="#22c55e" /> : <Clock size={20} color="#f59e0b" />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#1d1d1f" }}>{contract.title}</p>
                <p style={{ fontSize: 12, color: "#86868b", marginTop: 2 }}>
                  {contract.status === "signed"
                    ? `Signé le ${new Date(contract.signed_at!).toLocaleDateString("fr-FR")}`
                    : "En attente de signature"}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {contract.pdf_url && (
                  <a href={contract.pdf_url} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 14px", borderRadius: 10, border: "1px solid #e5e5e7",
                      background: "#fff", color: "#1d1d1f", fontSize: 12, fontWeight: 600, textDecoration: "none", cursor: "pointer",
                    }}>
                    <Download size={14} /> PDF
                  </a>
                )}
                {contract.status !== "signed" && (
                  <button onClick={() => signContract(contract.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 10, border: "none",
                      background: "#1d1d1f", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}>
                    <FileText size={14} /> Signer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
