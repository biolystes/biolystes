import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// ─── WooCommerce config ───────────────────────────────────
const WC_BASE = "https://biolystes.com/wp-json/wc/v3";
const CK = "ck_375b1fedd12fc4161c16f06a8358f4d362711239";
const CS = "cs_56ece5ac68b7c2c8ffafecbddb449504bac26657";

function buildUrl(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${WC_BASE}${endpoint}`);
  url.searchParams.set("consumer_key", CK);
  url.searchParams.set("consumer_secret", CS);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

function stripHtml(html: string) {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

// ─── Icons (SVG inline, strokeWidth 1.5) ─────────────────
function Icon({ d, size = 16, sw = 1.5, className = "" }: { d: string | string[]; size?: number; sw?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

const Icons = {
  grid:    (p: any) => <Icon {...p} d={["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"]} />,
  search:  (p: any) => <Icon {...p} d={["M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z","m21 21-4.3-4.3"]} />,
  home:    (p: any) => <Icon {...p} d={["M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8","M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"]} />,
  box:     (p: any) => <Icon {...p} d={["M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z","M12 22V12","M3.29 7 12 12l8.71-5","M7.5 4.27l9 5.15"]} />,
  folder:  (p: any) => <Icon {...p} d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />,
  clock:   (p: any) => <Icon {...p} d={["M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z","M12 6v6l4 2"]} />,
  settings:(p: any) => <Icon {...p} d={["M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z","M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"]} />,
  clip:    (p: any) => <Icon {...p} d={["M13.234 20.252 21 12.3","m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"]} />,
  mic:     (p: any) => <Icon {...p} d={["M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z","M19 10v2a7 7 0 0 1-14 0v-2","M12 19v3"]} />,
  arrow:   (p: any) => <Icon {...p} d={["M5 12h14","m12 5 7 7-7 7"]} />,
  leaf:    (p: any) => <Icon {...p} d={["M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 1c1 2 2 4.5 2 8 0 5.5-4.8 11-10 11Z","M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"]} />,
  shield:  (p: any) => <Icon {...p} d={["M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z","m9 12 2 2 4-4"]} />,
  sparkle: (p: any) => <Icon {...p} d={["M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z","M20 3v4","M22 5h-4","M4 17v2","M5 18H3"]} />,
};

// ─── Prompt cards ─────────────────────────────────────────
const prompts = [
  { text: "Comment lancer ses propres produits bio sans acheter de stock ?", icon: "box" },
  { text: "La création d'un e-shop et les photos produits sont inclus ?", icon: "sparkle" },
  { text: "Peut-on avoir des échantillons pour vérifier la qualité ?", icon: "shield" },
  { text: "Y a-t-il d'autres frais ou un engagement minimum ?", icon: "arrow" },
];

// ─── Types ────────────────────────────────────────────────
interface WCProduct {
  id: number;
  name: string;
  price: string;
  images: { src: string }[];
  tags: { name: string }[];
  categories: { name: string }[];
  short_description: string;
  description: string;
  permalink: string;
}

interface WCCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// ─── Product Card ─────────────────────────────────────────
function ProductCard({ product, index }: { product: WCProduct; index: number }) {
  const img = product.images?.[0]?.src;
  const tags = product.tags?.map(t => t.name) || [];
  const cats = product.categories?.map(c => c.name) || [];
  const isVegan = tags.some(t => t.toLowerCase().includes("vegan"));
  const isBio = tags.some(t => t.toLowerCase().includes("bio") || t.toLowerCase().includes("organic") || t.toLowerCase().includes("ecocert") || t.toLowerCase().includes("cosmos"));
  const price = product.price ? parseFloat(product.price) : null;

  const midRange = price ? Math.round(price * 2.2) : null;
  const bio = price ? Math.round(price * 3.5) : null;
  const luxury = price ? Math.round(price * 4.5) : null;

  // Keep only meaningful category names (not subcategories like concerns)
  const displayCats = cats.filter(c => c.length < 24).slice(0, 2);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      style={{
        display: "flex", flexDirection: "column", cursor: "pointer",
        background: "#fff", borderRadius: 16, overflow: "hidden",
        border: "1px solid #e5e5e7",
      }}
      onClick={() => window.open(product.permalink, "_blank")}
    >
      {/* Image area */}
      <div style={{
        position: "relative", width: "100%", aspectRatio: "1",
        background: "#f5f5f7", overflow: "hidden",
      }}>
        {/* # badge top-left */}
        <div style={{
          position: "absolute", top: 10, left: 10, zIndex: 2,
          width: 24, height: 24, borderRadius: 6,
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "#86868b",
        }}>#</div>

        {/* VEGAN / BIO badges top-right */}
        <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2, display: "flex", gap: 4 }}>
          {isVegan && (
            <span style={{
              padding: "3px 9px", borderRadius: 20, fontSize: 9, fontWeight: 700,
              letterSpacing: ".6px", textTransform: "uppercase",
              background: "#d1f2e0", color: "#1a7a45",
            }}>VEGAN</span>
          )}
          {isBio && (
            <span style={{
              padding: "3px 9px", borderRadius: 20, fontSize: 9, fontWeight: 700,
              letterSpacing: ".6px", textTransform: "uppercase",
              background: "#d1f2e0", color: "#1a7a45",
            }}>BIO</span>
          )}
        </div>

        {img ? (
          <img src={img} alt={product.name} loading="lazy" style={{
            width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icons.box size={32} sw={1} />
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Name in ALL CAPS */}
        <h3 style={{
          fontSize: 11, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.4, marginBottom: 12,
          textTransform: "uppercase", letterSpacing: ".3px",
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{product.name}</h3>

        {/* AI Pricing block */}
        {price && (
          <div style={{
            background: "#f5f5f7", borderRadius: 10, padding: "10px 12px", marginBottom: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#86868b" }}>
                Prix de vente conseillé
              </span>
              <span style={{
                fontSize: 8, fontWeight: 800, padding: "2px 5px", borderRadius: 4,
                background: "#1d1d1f", color: "#fff", letterSpacing: ".3px",
              }}>AI</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { label: "Milieu de gamme", val: midRange },
                { label: "Marché bio", val: bio },
                { label: "Marché luxe", val: luxury },
              ].map((tier, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#86868b", fontWeight: 500, letterSpacing: ".3px", textTransform: "uppercase" }}>{tier.label}</span>
                  <span style={{ fontSize: 11, color: "#1d1d1f", fontWeight: 700 }}>{tier.val}€</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom row: price + category tags */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
          {price && (
            <span style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f" }}>
              {Math.round(price)}€
            </span>
          )}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {displayCats.map((cat, i) => (
              <span key={i} style={{
                padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700,
                letterSpacing: ".5px", textTransform: "uppercase",
                background: "#1d1d1f", color: "#fff",
              }}>{cat}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ width: "100%", aspectRatio: "1", borderRadius: 16, background: "#f5f5f7", marginBottom: 12, animation: "pulse 1.5s infinite" }} />
      <div style={{ height: 12, width: "75%", background: "#f5f5f7", borderRadius: 4, marginBottom: 8 }} />
      <div style={{ height: 10, width: "50%", background: "#f5f5f7", borderRadius: 4, marginBottom: 8 }} />
      <div style={{ height: 10, width: "30%", background: "#f5f5f7", borderRadius: 4 }} />
    </div>
  );
}

// ─── Category Pill ────────────────────────────────────────
function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px", borderRadius: 20, border: "none",
      fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .15s",
      background: active ? "#1d1d1f" : "transparent",
      color: active ? "#fff" : "#86868b",
    }}>{label}</button>
  );
}

// ─── Main Dashboard ───────────────────────────────────────
export default function DashboardPage() {
  const [products, setProducts] = useState<WCProduct[]>([]);
  const [categories, setCategories] = useState<WCCategory[]>([]);
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  // Fetch categories
  useEffect(() => {
    fetch(buildUrl("/products/categories", { per_page: "50", hide_empty: "true" }))
      .then(r => r.json())
      .then((cats: WCCategory[]) => {
        const filtered = cats
          .filter(c => c.slug !== "uncategorized" && c.count > 0)
          .sort((a, b) => b.count - a.count);
        setCategories(filtered);
      })
      .catch(() => {});
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    setError(null);
    const params: Record<string, string> = { page: "1", per_page: "20", status: "publish", orderby: "date", order: "desc" };
    if (activeCat) params.category = String(activeCat);
    fetch(buildUrl("/products", params))
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((prods: WCProduct[]) => { setProducts(prods); setLoading(false); })
      .catch((err: Error) => { setError(err.message); setLoading(false); });
  }, [activeCat]);

  return (
    <div style={{ fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif" }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
      `}</style>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 40 }}
      >
        <p style={{ fontSize: 14, fontWeight: 500, color: "#86868b", marginBottom: 4, letterSpacing: ".2px" }}>
          Bonjour, Jean Pierre
        </p>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.15, letterSpacing: "-.5px" }}>
          Lancez votre marque<br />
          <span style={{ color: "#d1d1d6" }}>cosmétique bio.</span>
        </h1>
        <p style={{ fontSize: 14, color: "#86868b", marginTop: 12, maxWidth: 460, lineHeight: 1.6 }}>
          Décrivez votre projet, discutez avec notre assistant IA, et obtenez
          une sélection personnalisée de produits en marque blanche.
        </p>
      </motion.div>

      {/* Prompt cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}
      >
        {prompts.map((card, i) => {
          const Ic = Icons[card.icon as keyof typeof Icons];
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setChatInput(card.text)}
              style={{
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                padding: 16, borderRadius: 16, background: "#f5f5f7", border: "none",
                textAlign: "left", cursor: "pointer", minHeight: 100, transition: "background .15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#ebebed")}
              onMouseLeave={e => (e.currentTarget.style.background = "#f5f5f7")}
            >
              <p style={{ fontSize: 12, fontWeight: 500, color: "#424245", lineHeight: 1.45 }}>
                {card.text}
              </p>
              <div style={{ alignSelf: "flex-end", marginTop: 8, color: "#d1d1d6" }}>
                <Ic size={16} sw={1.5} />
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Chat input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          borderRadius: 16, background: "#f5f5f7", padding: "10px 16px", marginBottom: 40,
        }}
      >
        <div style={{ color: "#d1d1d6", cursor: "pointer", display: "flex" }}>
          <Icons.clip size={16} />
        </div>
        <div style={{ color: "#d1d1d6", cursor: "pointer", display: "flex" }}>
          <Icons.mic size={16} />
        </div>
        <input
          value={chatInput}
          onChange={e => setChatInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && chatInput.trim() && setChatInput("")}
          placeholder="Posez vos questions..."
          style={{
            flex: 1, border: "none", background: "transparent",
            fontSize: 14, color: "#1d1d1f", outline: "none",
            fontFamily: "inherit",
          }}
        />
        <span style={{ fontSize: 10, color: "#d1d1d6", fontVariantNumeric: "tabular-nums" }}>
          {chatInput.length}/1000
        </span>
        <button
          style={{
            width: 32, height: 32, borderRadius: 16, border: "none",
            background: chatInput.trim() ? "#1d1d1f" : "#e5e5e7",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: chatInput.trim() ? "pointer" : "default", transition: "background .15s",
            color: chatInput.trim() ? "#fff" : "#86868b",
          }}
        >
          <Icons.arrow size={14} sw={2} />
        </button>
      </motion.div>

      {/* Catalogue section — fond lavande comme le rendu attendu */}
      <div style={{
        background: "#eeecf8", borderRadius: 24, padding: "28px 24px",
        marginLeft: -40, marginRight: -40,
      }}>
        {/* Catalogue header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#86868b", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Catalogue
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#d1d1d6" }}>
            <Icons.search size={14} />
            <span style={{ fontSize: 11 }}>{products.length} produits</span>
          </div>
        </div>

        {/* Category pills */}
        {categories.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 24 }}>
            <Pill label="Tous" active={activeCat === null} onClick={() => setActiveCat(null)} />
            {categories.map(cat => (
              <Pill key={cat.id} label={cat.name} active={activeCat === cat.id} onClick={() => setActiveCat(cat.id)} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: 14, color: "#86868b" }}>Erreur de connexion au catalogue</p>
            <p style={{ fontSize: 12, color: "#d1d1d6", marginTop: 4 }}>{error}</p>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && products.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}
          >
            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </motion.div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <Icons.box size={32} sw={1} />
            <p style={{ fontSize: 14, color: "#86868b", marginTop: 12 }}>Aucun produit dans cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
}

