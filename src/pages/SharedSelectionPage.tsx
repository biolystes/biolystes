import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ────────────────────────────────────────────────
interface SelectedProduct {
  id: number;
  name: string;
  price: string;
  image: string;
  permalink: string;
  categories: string[];
}

interface SelectionData {
  id: string;
  title: string;
  products: SelectedProduct[];
  created_at: string;
}

function Icon({ d, size = 16, sw = 1.5 }: { d: string | string[]; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

export default function SharedSelectionPage() {
  const { selectionId } = useParams<{ selectionId: string }>();
  const [selection, setSelection] = useState<SelectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectionId) return;
    supabase
      .from("product_selections")
      .select("*")
      .eq("id", selectionId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError("Sélection introuvable ou lien expiré.");
        } else {
          setSelection({
            id: data.id,
            title: data.title,
            products: (data.products as unknown as SelectedProduct[]) || [],
            created_at: data.created_at || "",
          });
        }
        setLoading(false);
      });
  }, [selectionId]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F5F7" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2.5px solid #1d1d1f", borderTopColor: "transparent", animation: "spin 0.9s linear infinite" }} />
          <p style={{ fontSize: 13, color: "#86868b" }}>Chargement de la sélection…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error || !selection) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F5F7" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "#1d1d1f", fontWeight: 600, marginBottom: 8 }}>{error || "Sélection introuvable"}</p>
          <Link to="/" style={{ fontSize: 13, color: "#86868b", textDecoration: "underline" }}>Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  const total = selection.products.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F7" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e5e7", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="https://biolystes.com/wp-content/uploads/2024/06/cropped-IMG_0262-1024x1024-1-1.png"
            alt="Biolystes"
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1d1d1f" }}>Biolystes</span>
        </div>
        <a
          href="https://app.iclosed.io/e/paylystes/r2"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
            textDecoration: "none", color: "#fff", background: "#1d1d1f",
            padding: "8px 18px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 7,
          }}
        >
          <Icon d={["M3 4h18","M3 8h18","M3 12h12"]} size={11} />
          Prendre rendez-vous
        </a>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#86868b", marginBottom: 8 }}>
            Sélection de produits
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1d1d1f", marginBottom: 6 }}>
            {selection.title}
          </h1>
          <p style={{ fontSize: 13, color: "#86868b" }}>
            {selection.products.length} produit{selection.products.length > 1 ? "s" : ""} · Coût catalogue total : <strong style={{ color: "#1d1d1f" }}>{total.toFixed(2)}€</strong>
          </p>
        </motion.div>
      </div>

      {/* Products grid */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 64px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {selection.products.map((product, idx) => {
            const price = parseFloat(product.price) || 0;
            const midRange = Math.round(price * 2.2);
            const bio = Math.round(price * 3.5);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                style={{ background: "#fff", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}
              >
                <div style={{ aspectRatio: "3/4", background: "#f5f5f7", overflow: "hidden", position: "relative" }}>
                  {product.image
                    ? <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d1d6", fontSize: 32 }}>📦</div>
                  }
                  <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(29,29,31,0.85)", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>
                    #{idx + 1}
                  </div>
                </div>
                <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  {/* Title + link side by side */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <h3 style={{ fontSize: 11, fontWeight: 700, color: "#1d1d1f", textTransform: "uppercase", letterSpacing: ".3px", lineHeight: 1.4, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {product.name}
                    </h3>
                    {product.permalink && (
                      <a
                        href={product.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{
                          flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 10, fontWeight: 700, color: "#1d1d1f", textDecoration: "none",
                          padding: "4px 10px", borderRadius: 8, border: "1.5px solid #1d1d1f",
                          whiteSpace: "nowrap", transition: "background .15s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#1d1d1f"; e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1d1d1f"; }}
                      >
                        Voir le site ↗
                      </a>
                    )}
                  </div>
                  {price > 0 && (
                    <div style={{ background: "#f5f5f7", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase", color: "#86868b" }}>Prix conseillé</span>
                        <span style={{ fontSize: 8, fontWeight: 800, padding: "1px 5px", borderRadius: 4, background: "#1d1d1f", color: "#fff" }}>IA</span>
                      </div>
                      {[{ label: "Milieu de gamme", val: midRange }, { label: "Marché bio", val: bio }].map((tier, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: i === 0 ? 5 : 0, marginBottom: i === 0 ? 5 : 0, borderBottom: i === 0 ? "1px solid #e5e5e7" : "none" }}>
                          <span style={{ fontSize: 10, color: "#86868b", textTransform: "uppercase", letterSpacing: ".2px" }}>{tier.label}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#1d1d1f" }}>{tier.val}€</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
