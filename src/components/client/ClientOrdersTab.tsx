import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Package, Plus, Send } from "lucide-react";

interface Order {
  id: string;
  items: any;
  total: number | null;
  status: string | null;
  notes: string | null;
  created_at: string;
}

export default function ClientOrdersTab() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selections, setSelections] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("client_orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("client_selections").select("*").eq("user_id", user.id),
    ]).then(([ordersRes, selectionsRes]) => {
      if (ordersRes.data) setOrders(ordersRes.data as Order[]);
      if (selectionsRes.data) setSelections(selectionsRes.data);
      setLoading(false);
    });
  }, [user]);

  const submitOrder = async () => {
    if (!user || selections.length === 0) {
      toast.error("Veuillez d'abord sélectionner des produits");
      return;
    }
    setSubmitting(true);
    const items = selections.map(s => ({
      product_id: s.wc_product_id,
      name: s.wc_product_name,
      quantity: s.quantity || 1,
      price: s.wc_product_price,
    }));
    const total = items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
    const { data, error } = await supabase.from("client_orders").insert({
      user_id: user.id,
      items,
      total,
      notes,
      status: "pending",
    }).select().single();
    if (error) { toast.error("Erreur"); setSubmitting(false); return; }
    setOrders(o => [data as Order, ...o]);
    setShowForm(false);
    setNotes("");
    toast.success("Demande de commande envoyée !");
    setSubmitting(false);
  };

  const statusLabel: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: "En attente", color: "#f59e0b", bg: "#fef3c7" },
    confirmed: { label: "Confirmée", color: "#3b82f6", bg: "#dbeafe" },
    shipped: { label: "Expédiée", color: "#8b5cf6", bg: "#ede9fe" },
    delivered: { label: "Livrée", color: "#22c55e", bg: "#f0fdf4" },
  };

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#86868b" }}>Chargement...</div>;

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f" }}>Mes commandes</h2>
        <button onClick={() => setShowForm(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "10px 20px", borderRadius: 12, border: "none",
            background: "#1d1d1f", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>
          <Plus size={16} /> Nouvelle commande
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#f9f9fb", borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Nouvelle demande de commande</h3>
          <p style={{ fontSize: 13, color: "#86868b", marginBottom: 12 }}>
            Votre commande sera basée sur vos {selections.length} produit{selections.length > 1 ? "s" : ""} sélectionné{selections.length > 1 ? "s" : ""}.
          </p>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Instructions spéciales ou notes..."
            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #e5e5e7", fontSize: 14, minHeight: 80, resize: "vertical", outline: "none", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "flex-end" }}>
            <button onClick={() => setShowForm(false)}
              style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #e5e5e7", background: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Annuler
            </button>
            <button onClick={submitOrder} disabled={submitting}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, border: "none", background: "#1d1d1f", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              <Send size={14} /> {submitting ? "Envoi..." : "Envoyer la demande"}
            </button>
          </div>
        </div>
      )}

      {orders.length === 0 && !showForm ? (
        <div style={{ padding: 40, textAlign: "center", color: "#86868b", fontSize: 14 }}>
          Aucune commande pour le moment.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {orders.map(order => {
            const s = statusLabel[order.status || "pending"] || statusLabel.pending;
            return (
              <div key={order.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, background: "#f9f9fb", borderRadius: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Package size={18} color={s.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1d1d1f" }}>
                    Commande du {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </p>
                  <p style={{ fontSize: 12, color: "#86868b", marginTop: 2 }}>
                    {Array.isArray(order.items) ? order.items.length : 0} produit{Array.isArray(order.items) && order.items.length > 1 ? "s" : ""} · {order.total ? `${order.total}€ HT` : "—"}
                  </p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: s.color, background: s.bg, padding: "5px 12px", borderRadius: 20 }}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
