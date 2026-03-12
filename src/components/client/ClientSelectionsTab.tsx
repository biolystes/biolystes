import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, Search, X } from "lucide-react";

const WC_BASE = "https://biolystes.pro/wp-json/wc/v3";
const CK = "ck_375b1fedd12fc4161c16f06a8358f4d362711239";
const CS = "cs_56ece5ac68b7c2c8ffafecbddb449504bac26657";

function buildUrl(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${WC_BASE}${endpoint}`);
  url.searchParams.set("consumer_key", CK);
  url.searchParams.set("consumer_secret", CS);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

interface WCProduct {
  id: number;
  name: string;
  price: string;
  images: { src: string }[];
}

interface Selection {
  id: string;
  wc_product_id: number;
  wc_product_name: string | null;
  wc_product_image: string | null;
  wc_product_price: number | null;
  quantity: number | null;
  notes: string | null;
}

export default function ClientSelectionsTab() {
  const { user } = useAuth();
  const [selections, setSelections] = useState<Selection[]>([]);
  const [products, setProducts] = useState<WCProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCatalog, setShowCatalog] = useState(false);
  const [search, setSearch] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("client_selections").select("*").eq("user_id", user.id).order("created_at").then(({ data }) => {
      if (data) setSelections(data as Selection[]);
      setLoading(false);
    });
  }, [user]);

  const loadCatalog = async () => {
    if (products.length > 0) { setShowCatalog(true); return; }
    setCatalogLoading(true);
    try {
      const res = await fetch(buildUrl("/products", { per_page: "100", status: "publish" }));
      const data = await res.json();
      setProducts(data);
    } catch { toast.error("Erreur lors du chargement du catalogue"); }
    setCatalogLoading(false);
    setShowCatalog(true);
  };

  const addProduct = async (product: WCProduct) => {
    if (!user) return;
    if (selections.some(s => s.wc_product_id === product.id)) {
      toast.info("Produit déjà sélectionné");
      return;
    }
    const { data, error } = await supabase.from("client_selections").insert({
      user_id: user.id,
      wc_product_id: product.id,
      wc_product_name: product.name,
      wc_product_image: product.images?.[0]?.src || null,
      wc_product_price: product.price ? parseFloat(product.price) : null,
      quantity: 1,
    }).select().single();
    if (error) { toast.error("Erreur"); return; }
    setSelections(s => [...s, data as Selection]);
    toast.success("Produit ajouté !");
  };

  const removeProduct = async (id: string) => {
    await supabase.from("client_selections").delete().eq("id", id);
    setSelections(s => s.filter(sel => sel.id !== id));
    toast.success("Produit retiré");
  };

  const updateQuantity = async (id: string, qty: number) => {
    if (qty < 1) return;
    await supabase.from("client_selections").update({ quantity: qty }).eq("id", id);
    setSelections(s => s.map(sel => sel.id === id ? { ...sel, quantity: qty } : sel));
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#86868b" }}>Chargement...</div>;

  return (
    <div>
      {/* Current selections */}
      <div style={{ background: "#fff", borderRadius: 20, padding: 28, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1d1d1f" }}>Ma sélection de produits</h2>
            <p style={{ fontSize: 13, color: "#86868b", marginTop: 4 }}>{selections.length} produit{selections.length > 1 ? "s" : ""} sélectionné{selections.length > 1 ? "s" : ""}</p>
          </div>
          <button onClick={loadCatalog} disabled={catalogLoading}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 20px", borderRadius: 12, border: "none",
              background: "#1d1d1f", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
            }}>
            <Plus size={16} /> {catalogLoading ? "Chargement..." : "Ajouter des produits"}
          </button>
        </div>

        {selections.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#86868b", fontSize: 14 }}>
            Aucun produit sélectionné. Cliquez sur "Ajouter des produits" pour commencer.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {selections.map(sel => (
              <div key={sel.id} style={{
                display: "flex", alignItems: "center", gap: 14, padding: 14,
                background: "#f9f9fb", borderRadius: 14,
              }}>
                <div style={{ width: 56, height: 56, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#f0f0f2" }}>
                  {sel.wc_product_image ? (
                    <img src={sel.wc_product_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#c7c7cc", fontSize: 20 }}>📦</div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1d1d1f", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sel.wc_product_name}</p>
                  {sel.wc_product_price && <p style={{ fontSize: 12, color: "#86868b", marginTop: 2 }}>{sel.wc_product_price}€ HT</p>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => updateQuantity(sel.id, (sel.quantity || 1) - 1)}
                    style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid #e5e5e7", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Minus size={12} />
                  </button>
                  <span style={{ fontSize: 14, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{sel.quantity || 1}</span>
                  <button onClick={() => updateQuantity(sel.id, (sel.quantity || 1) + 1)}
                    style={{ width: 28, height: 28, borderRadius: 8, border: "1px solid #e5e5e7", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Plus size={12} />
                  </button>
                </div>
                <button onClick={() => removeProduct(sel.id)}
                  style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Catalog modal */}
      <AnimatePresence>
        {showCatalog && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCatalog(false)}
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 100 }} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "80vh", background: "#fff", borderRadius: "20px 20px 0 0", zIndex: 101, display: "flex", flexDirection: "column" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>Catalogue produits</h3>
                <button onClick={() => setShowCatalog(false)} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#f5f4df", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ padding: "12px 24px" }}>
                <div style={{ position: "relative" }}>
                  <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#86868b" }} />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher un produit..."
                    style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 10, border: "1px solid #e5e5e7", fontSize: 14, outline: "none" }} />
                </div>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                {filtered.map(product => {
                  const alreadySelected = selections.some(s => s.wc_product_id === product.id);
                  return (
                    <div key={product.id} onClick={() => !alreadySelected && addProduct(product)}
                      style={{
                        borderRadius: 14, overflow: "hidden", cursor: alreadySelected ? "default" : "pointer",
                        opacity: alreadySelected ? 0.5 : 1, border: "1px solid #f0f0f0",
                      }}>
                      <div style={{ aspectRatio: "1", background: "#f5f4df", overflow: "hidden" }}>
                        {product.images?.[0]?.src ? (
                          <img src={product.images[0].src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#c7c7cc" }}>📦</div>
                        )}
                      </div>
                      <div style={{ padding: 10 }}>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "#1d1d1f", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.name}</p>
                        {product.price && <p style={{ fontSize: 12, color: "#86868b", marginTop: 4 }}>{parseFloat(product.price)}€</p>}
                        {alreadySelected && <p style={{ fontSize: 10, color: "#34c759", fontWeight: 600, marginTop: 4 }}>✓ Sélectionné</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
