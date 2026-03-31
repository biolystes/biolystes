import { useEffect, useState } from "react";
import lystesLogo from "@/assets/lystes-logo.png";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  type JSONProduct,
  type EnrichedFields,
  buildEnrichmentMap,
  parseCertifications,
  parseIngredients,
  parseStarFeatures,
  normalize,
} from "@/data/productsData";

function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

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

// ─── Palette (matching catalog) ───────────────────────────
const C = {
  bg: "#ebebd6",
  bgLight: "#f5f4df",
  border: "#dddcc8",
  borderLight: "#e2e1cc",
  muted: "#8a8970",
  mutedLight: "#a5a48e",
  accent: "#6b6a55",
  badgeBg: "rgba(139,138,112,0.1)",
};

function Icon({ d, size = 16, sw = 1.5 }: { d: string | string[]; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

// ─── Product Detail Panel ─────────────────────────────────
function ProductPanel({
  product,
  enriched,
  imgSrc,
  onClose,
}: {
  product: SelectedProduct;
  enriched: EnrichedFields | null;
  imgSrc: string;
  onClose: () => void;
}) {
  const price = parseFloat(product.price) || 0;
  const midRange = price ? Math.round(price * 2.2) : null;
  const bio = price ? Math.round(price * 3.5) : null;
  const luxury = price ? Math.round(price * 4.5) : null;

  const desc = enriched?.description_full || "";
  const isVegan = enriched?.certifications?.some(c => c.toLowerCase().includes("végan") || c.toLowerCase().includes("vegan"));
  const isBio = enriched?.certifications?.some(c => c.toLowerCase().includes("bio") || c.toLowerCase().includes("certifié"));

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: 100 }}
      />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: 420, maxWidth: "100vw",
          background: C.bgLight, zIndex: 101, overflowY: "auto", display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${C.bg}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted }}>Fiche produit</span>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.muted }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Image */}
        <div style={{ background: C.bg, aspectRatio: "1", overflow: "hidden", flexShrink: 0 }}>
          {imgSrc
            ? <img src={imgSrc} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d1d6", fontSize: 32 }}>📦</div>
          }
        </div>

        {/* Content */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Badges */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {isVegan && <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", background: C.bg, color: C.muted }}>Vegan</span>}
            {isBio && <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", background: C.bg, color: C.muted }}>Bio</span>}
            {enriched?.volume && <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", background: C.bg, color: C.muted }}>{enriched.volume}</span>}
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.4, textTransform: "uppercase", letterSpacing: ".2px" }}>{product.name}</h2>

          {/* Star features */}
          {enriched?.star_features && enriched.star_features.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {enriched.star_features.map((f, i) => (
                <span key={i} style={{ padding: "4px 10px", borderRadius: 8, fontSize: 10, fontWeight: 600, background: "#e8e6d0", color: C.accent }}>
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {desc && <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{desc.length > 400 ? desc.slice(0, 400) + "…" : desc}</p>}

          {/* Certifications */}
          {enriched?.certifications && enriched.certifications.length > 0 && (
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted, display: "block", marginBottom: 8 }}>Certifications</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {enriched.certifications.map((c, i) => (
                  <span key={i} style={{ padding: "2px 7px", borderRadius: 6, fontSize: 8, fontWeight: 600, letterSpacing: ".3px", background: C.badgeBg, color: C.accent, whiteSpace: "nowrap" }}>{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Key ingredients */}
          {enriched?.ingredients_fr && enriched.ingredients_fr.length > 0 && (
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted, display: "block", marginBottom: 8 }}>Ingrédients clés</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {enriched.ingredients_fr.map((ing, i) => (
                  <span key={i} style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 500, background: C.bg, color: C.accent }}>{ing}</span>
                ))}
              </div>
            </div>
          )}

          {/* Aroma */}
          {enriched?.arome && enriched.arome !== "Divers" && (
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted, display: "block", marginBottom: 6 }}>Arôme</span>
              <p style={{ fontSize: 12, color: C.accent, lineHeight: 1.6, fontStyle: "italic" }}>{enriched.arome}</p>
            </div>
          )}

          {/* INCI */}
          {enriched?.inci && (
            <details style={{ marginTop: 4 }}>
              <summary style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted, cursor: "pointer", marginBottom: 6 }}>
                Composition INCI
              </summary>
              <p style={{ fontSize: 10, color: C.mutedLight, lineHeight: 1.6, marginTop: 6 }}>
                {enriched.inci.length > 500 ? enriched.inci.slice(0, 500) + "…" : enriched.inci}
              </p>
            </details>
          )}

          {/* Price tiers */}
          {price > 0 && (
            <div style={{ background: C.bg, borderRadius: 12, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted }}>Prix de vente conseillé</span>
                <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "#1d1d1f", color: C.bgLight }}>IA</span>
              </div>
              {[{ label: "Milieu de gamme", val: midRange }, { label: "Marché bio", val: bio }, { label: "Marché luxe", val: luxury }].map((tier, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, marginBottom: i < 2 ? 8 : 0, borderBottom: i < 2 ? `1px solid ${C.borderLight}` : "none" }}>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".3px" }}>{tier.label}</span>
                  <span style={{ fontSize: 13, color: "#1d1d1f", fontWeight: 700 }}>{tier.val}€</span>
                </div>
              ))}
            </div>
          )}

          {/* Catalogue price */}
          {price > 0 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f" }}>{Math.round(price)}€ <span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>HT</span></span>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}

export default function SharedSelectionPage() {
  const { selectionId } = useParams<{ selectionId: string }>();
  const [selection, setSelection] = useState<SelectionData | null>(null);
  const [cleanImages, setCleanImages] = useState<Map<string, string>>(new Map());
  const [enrichmentMap, setEnrichmentMap] = useState<Map<string, EnrichedFields & { jsonProduct: JSONProduct }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);

  useEffect(() => {
    if (!selectionId) return;

    // Load selection, clean images, and product data in parallel
    Promise.all([
      supabase.from("product_selections").select("*").eq("id", selectionId).single(),
      supabase.from("product_clean_images").select("product_name_normalized, clean_image_url"),
      fetch("/data/produits.json").then(r => r.json()) as Promise<JSONProduct[]>,
    ]).then(([selRes, imgRes, jsonProducts]) => {
      if (selRes.error || !selRes.data) {
        setError("Sélection introuvable ou lien expiré.");
      } else {
        setSelection({
          id: selRes.data.id,
          title: selRes.data.title,
          products: (selRes.data.products as unknown as SelectedProduct[]) || [],
          created_at: selRes.data.created_at || "",
        });
      }
      if (imgRes.data) {
        const map = new Map<string, string>();
        for (const row of imgRes.data) {
          map.set(row.product_name_normalized, row.clean_image_url);
        }
        setCleanImages(map);
      }
      if (jsonProducts) {
        setEnrichmentMap(buildEnrichmentMap(jsonProducts));
      }
      setLoading(false);
    });
  }, [selectionId]);

  const getEnriched = (name: string): EnrichedFields | null => {
    const key = normalize(name);
    const entry = enrichmentMap.get(key);
    return entry || null;
  };

  const getImage = (product: SelectedProduct): string => {
    return cleanImages.get(normalizeProductName(product.name)) || product.image || "";
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f4df" }}>
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f4df" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "#1d1d1f", fontWeight: 600, marginBottom: 8 }}>{error || "Sélection introuvable"}</p>
          <Link to="/" style={{ fontSize: 13, color: "#86868b", textDecoration: "underline" }}>Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  const total = selection.products.reduce((acc, p) => acc + (parseFloat(p.price) || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f4df" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e5e7", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={lystesLogo} alt="Biolystes" style={{ width: 32, height: 32, objectFit: "contain" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1d1d1f" }}>Biolystes</span>
        </div>
        <a
          href="https://biolystes.com/rdv"
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
            const imgSrc = getImage(product);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                onClick={() => setSelectedProduct(product)}
                style={{ background: "#f5f4df", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", cursor: "pointer" }}
              >
                <div style={{ aspectRatio: "3/4", background: "#f5f4df", overflow: "hidden", position: "relative" }}>
                  {imgSrc
                    ? <img src={imgSrc} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d1d6", fontSize: 32 }}>📦</div>
                  }
                  <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(29,29,31,0.85)", color: "#fff", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>
                    #{idx + 1}
                  </div>
                </div>
                <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <h3 style={{ fontSize: 11, fontWeight: 700, color: "#1d1d1f", textTransform: "uppercase", letterSpacing: ".3px", lineHeight: 1.4, margin: 0, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {product.name}
                    </h3>
                  </div>
                  {price > 0 && (
                    <div style={{ background: "#f5f4df", borderRadius: 10, padding: "10px 12px" }}>
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

      {/* Product Detail Panel */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductPanel
            product={selectedProduct}
            enriched={getEnriched(selectedProduct.name)}
            imgSrc={getImage(selectedProduct)}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
