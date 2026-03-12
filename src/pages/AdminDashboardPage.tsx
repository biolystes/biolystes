import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Users, ClipboardList, ShoppingBag, FileText, Package, ChevronRight, Eye, Upload, Plus } from "lucide-react";
import { toast } from "sonner";

interface Client {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  company_name: string | null;
  created_at: string | null;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientData, setClientData] = useState<{ brief: any; selections: any[]; contracts: any[]; orders: any[] } | null>(null);
  const [activeTab, setActiveTab] = useState("brief");
  const [loadingData, setLoadingData] = useState(false);

  // Upload contract
  const [showUpload, setShowUpload] = useState(false);
  const [contractTitle, setContractTitle] = useState("Contrat");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch all profiles (admin can see all via has_role)
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setClients(data as Client[]);
      setLoading(false);
    });
  }, []);

  const loadClientData = async (client: Client) => {
    setSelectedClient(client);
    setLoadingData(true);
    setActiveTab("brief");
    const [briefRes, selRes, conRes, ordRes] = await Promise.all([
      supabase.from("briefs").select("*").eq("user_id", client.id).order("created_at", { ascending: false }).limit(1),
      supabase.from("client_selections").select("*").eq("user_id", client.id),
      supabase.from("client_contracts").select("*").eq("user_id", client.id).order("created_at", { ascending: false }),
      supabase.from("client_orders").select("*").eq("user_id", client.id).order("created_at", { ascending: false }),
    ]);
    setClientData({
      brief: briefRes.data?.[0] || null,
      selections: selRes.data || [],
      contracts: conRes.data || [],
      orders: ordRes.data || [],
    });
    setLoadingData(false);
  };

  const uploadContract = async (file: File) => {
    if (!selectedClient || !user) return;
    setUploading(true);
    const filePath = `${selectedClient.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("contracts").upload(filePath, file);
    if (uploadError) { toast.error("Erreur upload: " + uploadError.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("contracts").getPublicUrl(filePath);
    const { error } = await supabase.from("client_contracts").insert({
      user_id: selectedClient.id,
      title: contractTitle,
      pdf_url: publicUrl,
      status: "pending",
    });
    if (error) { toast.error("Erreur: " + error.message); setUploading(false); return; }
    toast.success("Contrat envoyé au client !");
    setShowUpload(false);
    setContractTitle("Contrat");
    setUploading(false);
    loadClientData(selectedClient);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from("client_orders").update({ status }).eq("id", orderId);
    toast.success("Statut mis à jour");
    if (selectedClient) loadClientData(selectedClient);
  };

  const tabs = [
    { id: "brief", label: "Brief", icon: ClipboardList },
    { id: "selections", label: "Produits", icon: ShoppingBag },
    { id: "contracts", label: "Contrats", icon: FileText },
    { id: "orders", label: "Commandes", icon: Package },
  ];

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#86868b" }}>Chargement...</div>;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#86868b", letterSpacing: "1.5px", textTransform: "uppercase" }}>Administration</span>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1d1d1f", marginTop: 6, letterSpacing: "-0.5px" }}>
          Tableau de bord admin
        </h1>
      </motion.div>

      <div style={{ display: "flex", gap: 20, marginTop: 28 }}>
        {/* Client list */}
        <div style={{ width: 300, flexShrink: 0, background: "#fff", borderRadius: 20, padding: 20, height: "fit-content" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Users size={16} />
            <h3 style={{ fontSize: 14, fontWeight: 700 }}>Clients ({clients.length})</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {clients.map(client => (
              <button key={client.id} onClick={() => loadClientData(client)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  borderRadius: 10, border: "none", textAlign: "left", width: "100%",
                  background: selectedClient?.id === client.id ? "#1d1d1f" : "transparent",
                  color: selectedClient?.id === client.id ? "#fff" : "#1d1d1f",
                  cursor: "pointer", transition: "all .1s",
                }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: selectedClient?.id === client.id ? "rgba(255,255,255,0.2)" : "#f5f4df",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                }}>
                  {(client.first_name?.[0] || "?").toUpperCase()}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {client.first_name} {client.last_name}
                  </p>
                  <p style={{ fontSize: 11, opacity: 0.6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {client.email}
                  </p>
                </div>
                <ChevronRight size={14} style={{ opacity: 0.4 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Client detail */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selectedClient ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: 60, textAlign: "center", color: "#86868b" }}>
              <Users size={40} strokeWidth={1} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
              <p style={{ fontSize: 15, fontWeight: 500 }}>Sélectionnez un client pour voir ses données</p>
            </div>
          ) : loadingData ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: 60, textAlign: "center", color: "#86868b" }}>Chargement...</div>
          ) : (
            <div>
              {/* Client header */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 20, marginBottom: 16 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f" }}>
                  {selectedClient.first_name} {selectedClient.last_name}
                </h2>
                <p style={{ fontSize: 13, color: "#86868b", marginTop: 4 }}>
                  {selectedClient.email} {selectedClient.company_name ? `· ${selectedClient.company_name}` : ""}
                </p>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 14px", borderRadius: 10, border: "none",
                      background: activeTab === tab.id ? "#1d1d1f" : "#fff",
                      color: activeTab === tab.id ? "#fff" : "#1d1d1f",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}>
                    <tab.icon size={14} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div style={{ background: "#fff", borderRadius: 20, padding: 24 }}>
                {activeTab === "brief" && (
                  clientData?.brief ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {[
                        { label: "Nom de marque", val: clientData.brief.brand_name },
                        { label: "Marché cible", val: clientData.brief.target_market },
                        { label: "Public cible", val: clientData.brief.target_audience },
                        { label: "Positionnement", val: clientData.brief.positioning },
                        { label: "Ingrédients clés", val: clientData.brief.key_ingredients },
                        { label: "Packaging", val: clientData.brief.packaging_preferences },
                        { label: "Budget", val: clientData.brief.budget_range },
                        { label: "Délai", val: clientData.brief.timeline },
                      ].map((field, i) => (
                        <div key={i}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: "#86868b", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>{field.label}</p>
                          <p style={{ fontSize: 14, color: "#1d1d1f", fontWeight: 500 }}>{field.val || "—"}</p>
                        </div>
                      ))}
                      {clientData.brief.brand_description && (
                        <div style={{ gridColumn: "1 / -1" }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: "#86868b", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>Description</p>
                          <p style={{ fontSize: 14, color: "#1d1d1f", lineHeight: 1.6 }}>{clientData.brief.brand_description}</p>
                        </div>
                      )}
                      {clientData.brief.additional_notes && (
                        <div style={{ gridColumn: "1 / -1" }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: "#86868b", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: 4 }}>Notes</p>
                          <p style={{ fontSize: 14, color: "#1d1d1f", lineHeight: 1.6 }}>{clientData.brief.additional_notes}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: "#86868b", textAlign: "center", padding: 20 }}>Aucun brief soumis</p>
                  )
                )}

                {activeTab === "selections" && (
                  clientData?.selections.length ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
                      {clientData.selections.map((sel: any) => (
                        <div key={sel.id} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #f0f0f0" }}>
                          <div style={{ aspectRatio: "1", background: "#f5f4df", overflow: "hidden" }}>
                            {sel.wc_product_image ? (
                              <img src={sel.wc_product_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#c7c7cc" }}>📦</div>}
                          </div>
                          <div style={{ padding: 10 }}>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "#1d1d1f" }}>{sel.wc_product_name}</p>
                            <p style={{ fontSize: 11, color: "#86868b", marginTop: 2 }}>Qté: {sel.quantity || 1} · {sel.wc_product_price}€</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p style={{ color: "#86868b", textAlign: "center", padding: 20 }}>Aucune sélection</p>
                )}

                {activeTab === "contracts" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                      <button onClick={() => setShowUpload(true)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6,
                          padding: "8px 16px", borderRadius: 10, border: "none",
                          background: "#1d1d1f", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        }}>
                        <Upload size={14} /> Envoyer un contrat
                      </button>
                    </div>
                    {showUpload && (
                      <div style={{ background: "#f9f9fb", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                        <input value={contractTitle} onChange={e => setContractTitle(e.target.value)}
                          placeholder="Titre du contrat"
                          style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #e5e5e7", fontSize: 14, marginBottom: 10, outline: "none" }} />
                        <input type="file" accept=".pdf" onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) uploadContract(file);
                        }} disabled={uploading} />
                        {uploading && <p style={{ fontSize: 12, color: "#86868b", marginTop: 8 }}>Upload en cours...</p>}
                      </div>
                    )}
                    {clientData?.contracts.length ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {clientData.contracts.map((c: any) => (
                          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "#f9f9fb", borderRadius: 12 }}>
                            <FileText size={18} color={c.status === "signed" ? "#22c55e" : "#f59e0b"} />
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 13, fontWeight: 600 }}>{c.title}</p>
                              <p style={{ fontSize: 11, color: "#86868b" }}>{c.status === "signed" ? "Signé" : "En attente"}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : <p style={{ color: "#86868b", textAlign: "center", padding: 20 }}>Aucun contrat</p>}
                  </div>
                )}

                {activeTab === "orders" && (
                  clientData?.orders.length ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {clientData.orders.map((order: any) => (
                        <div key={order.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, background: "#f9f9fb", borderRadius: 12 }}>
                          <Package size={18} />
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 13, fontWeight: 600 }}>
                              {new Date(order.created_at).toLocaleDateString("fr-FR")} · {order.total ? `${order.total}€` : "—"}
                            </p>
                            <p style={{ fontSize: 11, color: "#86868b" }}>{order.notes || "Pas de notes"}</p>
                          </div>
                          <select value={order.status || "pending"} onChange={e => updateOrderStatus(order.id, e.target.value)}
                            style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e5e5e7", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  ) : <p style={{ color: "#86868b", textAlign: "center", padding: 20 }}>Aucune commande</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
