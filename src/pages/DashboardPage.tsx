import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

// ─── Icons ────────────────────────────────────────────────
function Icon({ d, size = 16, sw = 1.5 }: { d: string | string[]; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

const Icons = {
  grid:    (p: any) => <Icon {...p} d={["M3 3h7v7H3z","M14 3h7v7h-7z","M14 14h7v7h-7z","M3 14h7v7H3z"]} />,
  search:  (p: any) => <Icon {...p} d={["M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z","m21 21-4.3-4.3"]} />,
  box:     (p: any) => <Icon {...p} d={["M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z","M12 22V12","M3.29 7 12 12l8.71-5","M7.5 4.27l9 5.15"]} />,
  shield:  (p: any) => <Icon {...p} d={["M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z","m9 12 2 2 4-4"]} />,
  sparkle: (p: any) => <Icon {...p} d={["M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z","M20 3v4","M22 5h-4","M4 17v2","M5 18H3"]} />,
  clip:    (p: any) => <Icon {...p} d={["M13.234 20.252 21 12.3","m16 6-8.414 8.586a2 2 0 0 0 0 2.828 2 2 0 0 0 2.828 0l8.414-8.586a4 4 0 0 0 0-5.656 4 4 0 0 0-5.656 0l-8.415 8.585a6 6 0 1 0 8.486 8.486"]} />,
  mic:     (p: any) => <Icon {...p} d={["M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z","M19 10v2a7 7 0 0 1-14 0v-2","M12 19v3"]} />,
  arrow:   (p: any) => <Icon {...p} d={["M5 12h14","m12 5 7 7-7 7"]} />,
  close:   (p: any) => <Icon {...p} d={["M18 6 6 18","m6 6 12 12"]} />,
  external:(p: any) => <Icon {...p} d={["M15 3h6v6","M10 14 21 3","M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"]} />,
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
  tags: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  attributes: { id: number; name: string; options: string[] }[];
  short_description: string;
  description: string;
  permalink: string;
}

interface WCCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  parent: number;
  image?: { src: string } | null;
}

interface WCTag {
  id: number;
  name: string;
  count: number;
}

interface WCAttribute {
  id: number;
  name: string;
  slug: string;
}

interface WCAttributeTerm {
  id: number;
  name: string;
  count: number;
}

// ─── Product Detail Panel ─────────────────────────────────
function ProductPanel({ product, onClose }: { product: WCProduct; onClose: () => void }) {
  const img = product.images?.[0]?.src;
  const price = product.price ? parseFloat(product.price) : null;
  const desc = stripHtml(product.short_description || product.description);
  const cats = product.categories?.map(c => c.name) || [];
  const tags = product.tags?.map(t => t.name) || [];
  const isVegan = tags.some(t => t.toLowerCase().includes("vegan"));
  const isBio = tags.some(t => t.toLowerCase().includes("bio") || t.toLowerCase().includes("ecocert") || t.toLowerCase().includes("cosmos"));

  const midRange = price ? Math.round(price * 2.2) : null;
  const bio = price ? Math.round(price * 3.5) : null;
  const luxury = price ? Math.round(price * 4.5) : null;

  const displayCats = cats.slice(0, 3);

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: 100,
        }}
      />
      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0, width: 420,
          background: "#fff", zIndex: 101, overflowY: "auto",
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px", borderBottom: "1px solid #f5f5f7",
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#86868b" }}>
            Fiche produit
          </span>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 8, border: "none",
              background: "#f5f5f7", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", color: "#86868b",
            }}
          >
            <Icons.close size={14} />
          </button>
        </div>

        {/* Image */}
        <div style={{ background: "#f5f5f7", aspectRatio: "1", overflow: "hidden", flexShrink: 0 }}>
          {img
            ? <img src={img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d1d6" }}><Icons.box size={40} sw={1} /></div>
          }
        </div>

        {/* Body */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {isVegan && (
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", background: "#f5f5f7", color: "#86868b" }}>
                Vegan
              </span>
            )}
            {isBio && (
              <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", background: "#f5f5f7", color: "#86868b" }}>
                Bio
              </span>
            )}
          </div>

          {/* Name */}
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.4, textTransform: "uppercase", letterSpacing: ".2px" }}>
            {product.name}
          </h2>

          {/* Description */}
          {desc && (
            <p style={{ fontSize: 13, color: "#86868b", lineHeight: 1.65 }}>
              {desc.length > 280 ? desc.slice(0, 280) + "…" : desc}
            </p>
          )}

          {/* AI Pricing */}
          {price && (
            <div style={{ background: "#f5f5f7", borderRadius: 12, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#86868b" }}>
                  Prix de vente conseillé
                </span>
                <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "#1d1d1f", color: "#fff" }}>AI</span>
              </div>
              {[
                { label: "Milieu de gamme", val: midRange },
                { label: "Marché bio", val: bio },
                { label: "Marché luxe", val: luxury },
              ].map((tier, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, marginBottom: i < 2 ? 8 : 0, borderBottom: i < 2 ? "1px solid #ebebed" : "none" }}>
                  <span style={{ fontSize: 11, color: "#86868b", fontWeight: 500, textTransform: "uppercase", letterSpacing: ".3px" }}>{tier.label}</span>
                  <span style={{ fontSize: 13, color: "#1d1d1f", fontWeight: 700 }}>{tier.val}€</span>
                </div>
              ))}
            </div>
          )}

          {/* Price + categories */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {price && <span style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f" }}>{Math.round(price)}€</span>}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {displayCats.map((cat, i) => (
                <span key={i} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", background: "#1d1d1f", color: "#fff" }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => window.open(product.permalink, "_blank")}
            style={{
              width: "100%", padding: "13px", borderRadius: 12, border: "none",
              background: "#1d1d1f", color: "#fff", fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              letterSpacing: ".2px",
            }}
          >
            Voir sur le site
            <Icons.external size={13} />
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Product Card ─────────────────────────────────────────
function ProductCard({ product, onSelect }: { product: WCProduct; onSelect: () => void }) {
  const img = product.images?.[0]?.src;
  const tags = product.tags?.map(t => t.name) || [];
  const cats = product.categories?.map(c => c.name) || [];
  const isVegan = tags.some(t => t.toLowerCase().includes("vegan"));
  const isBio = tags.some(t => t.toLowerCase().includes("bio") || t.toLowerCase().includes("ecocert") || t.toLowerCase().includes("cosmos"));
  const price = product.price ? parseFloat(product.price) : null;

  const midRange = price ? Math.round(price * 2.2) : null;
  const bioPrix = price ? Math.round(price * 3.5) : null;
  const luxury = price ? Math.round(price * 4.5) : null;

  const displayCats = cats.filter(c => c.length < 24).slice(0, 2);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={onSelect}
      style={{
        display: "flex", flexDirection: "column", cursor: "pointer",
        background: "#fff", borderRadius: 16, overflow: "hidden",
      }}
    >
      {/* Image area — rectangle taller */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", background: "#f0f0f5", overflow: "hidden" }}>
        {/* # badge top-left */}
        <div style={{
          position: "absolute", top: 12, left: 12, zIndex: 2,
          width: 24, height: 24, borderRadius: 6,
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 700, color: "#86868b",
        }}>#</div>

        {/* VEGAN / BIO — green badges top-right */}
        {(isVegan || isBio) && (
          <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2, display: "flex", gap: 5 }}>
            {isVegan && (
              <span style={{
                padding: "4px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700,
                letterSpacing: ".5px", textTransform: "uppercase",
                background: "#c8f0d8", color: "#1a6b3a",
              }}>VEGAN</span>
            )}
            {isBio && (
              <span style={{
                padding: "4px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700,
                letterSpacing: ".5px", textTransform: "uppercase",
                background: "#c8f0d8", color: "#1a6b3a",
              }}>BIO</span>
            )}
          </div>
        )}

        {img
          ? <img src={img} alt={product.name} loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d1d6" }}>
              <Icons.box size={36} sw={1} />
            </div>
        }
      </div>

      {/* Card body */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Name ALL CAPS bold */}
        <h3 style={{
          fontSize: 11, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.4, marginBottom: 14,
          textTransform: "uppercase", letterSpacing: ".3px",
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{product.name}</h3>

        {/* Pricing block */}
        {price && (
          <div style={{ marginBottom: 14 }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #e5e5e7", marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase", color: "#1d1d1f" }}>
                Prix de vente conseillé
              </span>
              <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "#1d1d1f", color: "#fff", letterSpacing: ".2px" }}>AI</span>
            </div>
            {/* Tiers with ○ bullet */}
            {[
              { label: "Milieu de gamme", val: midRange },
              { label: "Marché bio", val: bioPrix },
              { label: "Marché luxe", val: luxury },
            ].map((tier, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: i < 2 ? 5 : 0 }}>
                <span style={{ fontSize: 10, color: "#86868b", fontWeight: 500, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: ".2px" }}>
                  <span style={{ fontSize: 8, color: "#d1d1d6" }}>○</span> {tier.label}
                </span>
                <span style={{ fontSize: 11, color: "#1d1d1f", fontWeight: 700 }}>{tier.val}€</span>
              </div>
            ))}
          </div>
        )}

        {/* Bottom: price left + category pills right */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
          {price && (
            <span style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f" }}>{Math.round(price)}€</span>
          )}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {displayCats.map((cat, i) => (
              <span key={i} style={{
                padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700,
                letterSpacing: ".4px", textTransform: "uppercase",
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
    <div style={{ borderRadius: 16, overflow: "hidden", background: "#fff" }}>
      <div style={{ width: "100%", aspectRatio: "1", background: "#f5f5f7", animation: "pulse 1.5s infinite" }} />
      <div style={{ padding: "14px" }}>
        <div style={{ height: 10, width: "80%", background: "#f5f5f7", borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 8, width: "55%", background: "#f5f5f7", borderRadius: 4 }} />
      </div>
    </div>
  );
}

// ─── Generic Filter Dropdown ──────────────────────────────
type FilterOption = { id: number | string; name: string; image?: string };

function FilterDropdown({ label, options, selected, onChange, grid = false }: {
  label: string;
  options: FilterOption[];
  selected: (number | string)[];
  onChange: (ids: (number | string)[]) => void;
  grid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const hasActive = selected.length > 0;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "7px 14px", borderRadius: 20,
          border: hasActive ? "1.5px solid #1d1d1f" : "1px solid #d1d1d6",
          background: hasActive ? "#1d1d1f" : "#fff",
          color: hasActive ? "#fff" : "#1d1d1f",
          fontSize: 12, fontWeight: 500, cursor: "pointer",
          transition: "all .15s", whiteSpace: "nowrap",
        }}
      >
        {label}
        {hasActive && (
          <span style={{
            background: "rgba(255,255,255,0.25)", borderRadius: 10,
            padding: "1px 6px", fontSize: 10, fontWeight: 700,
          }}>{selected.length}</span>
        )}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d={open ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
        </svg>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 98 }} />
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 99,
            background: "#fff", borderRadius: 14, minWidth: grid ? 380 : 220,
            boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)",
            border: "1px solid #f0f0f0",
          }}>
            <div style={{ padding: 10, display: grid ? "grid" : "block", gridTemplateColumns: grid ? "1fr 1fr" : undefined, gap: grid ? 2 : 0 }}>
              {options.map(opt => {
                const active = selected.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onChange(active ? selected.filter(id => id !== opt.id) : [...selected, opt.id]);
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", padding: "9px 10px", borderRadius: 8, border: "none",
                      background: active ? "#f5f5f7" : "transparent",
                      cursor: "pointer", textAlign: "left", transition: "background .1s",
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "#f9f9f9"; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    {/* Checkbox */}
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                      border: active ? "none" : "1.5px solid #c7c7cc",
                      background: active ? "#1d1d1f" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {active && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                    </div>
                    {/* Color swatch for "couleur" */}
                    {opt.image && (
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: opt.image, border: "1px solid #e5e5e5", flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: 13, fontWeight: 400, color: "#1d1d1f" }}>{opt.name}</span>
                  </button>
                );
              })}
            </div>
            {selected.length > 0 && (
              <div style={{ borderTop: "1px solid #f5f5f7", padding: "6px 10px" }}>
                <button
                  onClick={() => { onChange([]); }}
                  style={{
                    width: "100%", padding: "6px", borderRadius: 8, border: "none",
                    background: "transparent", color: "#86868b", fontSize: 12, cursor: "pointer",
                  }}
                >
                  Effacer la sélection
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Color map for "Couleur de l'emballage" ──────────────
const COLOR_MAP: Record<string, string> = {
  "ambre": "#c17e3f", "amber": "#c17e3f",
  "noir": "#1a1a1a", "black": "#1a1a1a", "noire": "#1a1a1a",
  "blanche": "#f5f5f5", "blanc": "#f5f5f5", "white": "#f5f5f5",
  "vert": "#4a8c4a", "verte": "#4a8c4a", "green": "#4a8c4a",
  "transparente": "linear-gradient(135deg, #e8e8e8 25%, transparent 25%, transparent 75%, #e8e8e8 75%)",
  "transparent": "linear-gradient(135deg, #e8e8e8 25%, transparent 25%, transparent 75%, #e8e8e8 75%)",
  "rose": "#e8a0b0", "pink": "#e8a0b0",
  "bleu": "#4a7cb5", "blue": "#4a7cb5",
  "violet": "#8b5cf6", "purple": "#8b5cf6",
  "beige": "#d4b896", "crème": "#f5e6d3", "creme": "#f5e6d3",
  "argent": "#a8a8a8", "silver": "#a8a8a8",
  "or": "#d4af37", "gold": "#d4af37",
};

// ─── Main Dashboard ───────────────────────────────────────
export default function DashboardPage() {
  const [allProducts, setAllProducts] = useState<WCProduct[]>([]);
  const [allCategories, setAllCategories] = useState<WCCategory[]>([]);
  const [allTags, setAllTags] = useState<WCTag[]>([]);
  const [attributes, setAttributes] = useState<WCAttribute[]>([]);
  const [attrTerms, setAttrTerms] = useState<Record<number, WCAttributeTerm[]>>({});

  // Active filters: key = filter group key (string), value = array of selected term names/ids
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedAttrTerms, setSelectedAttrTerms] = useState<Record<number, string[]>>({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<WCProduct | null>(null);

  // ─── Fetch all data in parallel ──────────────────────────
  useEffect(() => {
    Promise.all([
      fetch(buildUrl("/products/categories", { per_page: "100", hide_empty: "true" })).then(r => r.json()),
      fetch(buildUrl("/products/tags", { per_page: "100", hide_empty: "true" })).then(r => r.json()),
      fetch(buildUrl("/products/attributes", { per_page: "50" })).then(r => r.json()),
    ]).then(([cats, tags, attrs]: [WCCategory[], WCTag[], WCAttribute[]]) => {
      setAllCategories(cats.filter(c => c.slug !== "uncategorized" && c.count > 0).sort((a, b) => b.count - a.count));
      setAllTags(tags.filter(t => t.count > 0).sort((a, b) => b.count - a.count));
      setAttributes(attrs);
      // Fetch all attribute terms in parallel
      Promise.all(
        attrs.map(attr =>
          fetch(buildUrl(`/products/attributes/${attr.id}/terms`, { per_page: "100", hide_empty: "true" }))
            .then(r => r.json())
            .then((terms: WCAttributeTerm[]) => ({ id: attr.id, terms: terms.filter(t => t.count > 0) }))
        )
      ).then(results => {
        const map: Record<number, WCAttributeTerm[]> = {};
        results.forEach(({ id, terms }) => { map[id] = terms.sort((a, b) => b.count - a.count); });
        setAttrTerms(map);
      });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(buildUrl("/products", { page: "1", per_page: "100", status: "publish", orderby: "date", order: "desc" }))
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((prods: WCProduct[]) => { setAllProducts(prods); setLoading(false); })
      .catch((err: Error) => { setError(err.message); setLoading(false); });
  }, []);

  // ─── Category tree (top-level only for pills) ─────────────
  const topLevel = allCategories.filter(c => c.parent === 0).sort((a, b) => b.count - a.count);

  // ─── Client-side filtering ────────────────────────────────
  const products = allProducts.filter(p => {
    const pCatIds = new Set(p.categories.map(c => c.id));
    const pTagIds = new Set(p.tags.map(t => t.id));
    const pAttrMap: Record<string, string[]> = {};
    p.attributes.forEach(a => { pAttrMap[a.id] = a.options.map(o => o.toLowerCase()); });

    if (selectedCatIds.length > 0 && !selectedCatIds.some(id => pCatIds.has(id))) return false;
    if (selectedTagIds.length > 0 && !selectedTagIds.some(id => pTagIds.has(id))) return false;
    for (const [attrId, terms] of Object.entries(selectedAttrTerms)) {
      if (terms.length === 0) continue;
      const pTerms = pAttrMap[attrId] || [];
      if (!terms.some(t => pTerms.includes(t.toLowerCase()))) return false;
    }
    return true;
  });

  const hasFilters = selectedCatIds.length > 0 || selectedTagIds.length > 0 ||
    Object.values(selectedAttrTerms).some(v => v.length > 0);

  const clearFilters = () => {
    setSelectedCatIds([]);
    setSelectedTagIds([]);
    setSelectedAttrTerms({});
  };

  // ─── Build filter definitions (like selfnamed) ────────────
  // Fixed 7 filter dropdowns matching selfnamed exactly
  const ATTR_LABELS: Record<string, string> = {
    "type": "Type",
    "reclamations": "Réclamations",
    "reclamation": "Réclamations",
    "claims": "Réclamations",
    "inquietude": "Inquiétude",
    "concern": "Inquiétude",
    "principes-actifs": "Principes actifs",
    "principes_actifs": "Principes actifs",
    "active-ingredients": "Principes actifs",
    "actifs": "Principes actifs",
    "couleur": "Couleur de l'emballage",
    "couleur-emballage": "Couleur de l'emballage",
    "packaging-color": "Couleur de l'emballage",
    "color": "Couleur de l'emballage",
  };

  // Top-level category options (for Catégorie dropdown)
  const catOptions: FilterOption[] = topLevel.map(c => ({ id: c.id, name: c.name }));

  // Tag options (for Étiquette dropdown)
  const tagOptions: FilterOption[] = allTags.slice(0, 30).map(t => ({ id: t.id, name: t.name }));

  // Attribute dropdowns in selfnamed order
  const ATTR_ORDER = ["type", "reclamations", "reclamation", "claims", "inquietude", "concern",
    "principes-actifs", "principes_actifs", "active-ingredients", "actifs",
    "couleur", "couleur-emballage", "packaging-color", "color"];

  const attrFilters = attributes
    .map(attr => {
      const label = ATTR_LABELS[attr.slug] || attr.name;
      const terms = attrTerms[attr.id] || [];
      if (terms.length === 0) return null;
      const isColor = attr.slug.includes("couleur") || attr.slug.includes("color");
      const options: FilterOption[] = terms.map(t => ({
        id: t.name,
        name: t.name,
        ...(isColor ? { image: COLOR_MAP[t.name.toLowerCase()] || "#ccc" } : {}),
      }));
      const sortIdx = ATTR_ORDER.findIndex(s => attr.slug.includes(s));
      return { attr, label, options, isColor, sortIdx: sortIdx === -1 ? 99 : sortIdx };
    })
    .filter(Boolean)
    .sort((a, b) => a!.sortIdx - b!.sortIdx) as { attr: WCAttribute; label: string; options: FilterOption[]; isColor: boolean; sortIdx: number }[];

  return (
    <>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#86868b", marginBottom: 4 }}>Bonjour, Jean Pierre</p>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.1, letterSpacing: "-.5px" }}>
          Lancez votre marque<br />
          <span style={{ color: "#d1d1d6" }}>cosmétique bio.</span>
        </h1>
        <p style={{ fontSize: 14, color: "#86868b", marginTop: 12, maxWidth: 460, lineHeight: 1.65 }}>
          Décrivez votre projet, discutez avec notre assistant IA, et obtenez une sélection personnalisée de produits en marque blanche.
        </p>
      </motion.div>

      {/* Prompt cards */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        {prompts.map((card, i) => {
          const Ic = Icons[card.icon as keyof typeof Icons];
          return (
            <button key={i} onClick={() => setChatInput(card.text)} style={{
              display: "flex", flexDirection: "column", justifyContent: "space-between",
              padding: 16, borderRadius: 16, background: "#f5f5f7", border: "none",
              textAlign: "left", cursor: "pointer", minHeight: 96, transition: "background .15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#ebebed")}
            onMouseLeave={e => (e.currentTarget.style.background = "#f5f5f7")}
            >
              <p style={{ fontSize: 12, fontWeight: 500, color: "#424245", lineHeight: 1.45 }}>{card.text}</p>
              <div style={{ alignSelf: "flex-end", marginTop: 8, color: "#d1d1d6" }}><Ic size={15} /></div>
            </button>
          );
        })}
      </motion.div>

      {/* Chat */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}
        style={{ display: "flex", alignItems: "center", gap: 10, borderRadius: 16, background: "#f5f5f7", padding: "10px 16px", marginBottom: 40 }}>
        <div style={{ color: "#d1d1d6", display: "flex" }}><Icons.clip size={15} /></div>
        <div style={{ color: "#d1d1d6", display: "flex" }}><Icons.mic size={15} /></div>
        <input value={chatInput} onChange={e => setChatInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && chatInput.trim() && setChatInput("")}
          placeholder="Posez vos questions..."
          style={{ flex: 1, border: "none", background: "transparent", fontSize: 14, color: "#1d1d1f", outline: "none" }}
        />
        <span style={{ fontSize: 10, color: "#d1d1d6" }}>{chatInput.length}/1000</span>
        <button style={{
          width: 30, height: 30, borderRadius: 15, border: "none",
          background: chatInput.trim() ? "#1d1d1f" : "#e5e5e7",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: chatInput.trim() ? "pointer" : "default", transition: "background .15s",
          color: chatInput.trim() ? "#fff" : "#86868b",
        }}>
          <Icons.arrow size={13} sw={2} />
        </button>
      </motion.div>

      {/* Catalogue */}
      <div style={{ background: "#eeedf5", borderRadius: 20, padding: "24px 20px", marginLeft: -40, marginRight: -40 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#86868b", letterSpacing: "1.5px", textTransform: "uppercase" }}>Catalogue</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#d1d1d6" }}>
            <Icons.search size={13} />
            <span style={{ fontSize: 11 }}>{products.length} produits</span>
          </div>
        </div>

        {/* Filter bar — exactly like selfnamed */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20, alignItems: "center" }}>

          {/* 1. Catégorie */}
          {catOptions.length > 0 && (
            <FilterDropdown
              label="Catégorie"
              options={catOptions}
              selected={selectedCatIds}
              onChange={ids => setSelectedCatIds(ids as number[])}
              grid={catOptions.length > 4}
            />
          )}

          {/* 2. Étiquette */}
          {tagOptions.length > 0 && (
            <FilterDropdown
              label="Étiquette"
              options={tagOptions}
              selected={selectedTagIds}
              onChange={ids => setSelectedTagIds(ids as number[])}
              grid={tagOptions.length > 6}
            />
          )}

          {/* 3-7. Attributes (Type, Réclamations, Inquiétude, Principes actifs, Couleur) */}
          {attrFilters.map(f => (
            <FilterDropdown
              key={f.attr.id}
              label={f.label}
              options={f.options}
              selected={selectedAttrTerms[f.attr.id] || []}
              onChange={vals => setSelectedAttrTerms(prev => ({ ...prev, [f.attr.id]: vals as string[] }))}
              grid={f.options.length > 6}
            />
          ))}

          {/* Clear all */}
          {hasFilters && (
            <button onClick={clearFilters} style={{
              padding: "7px 14px", borderRadius: 20, border: "1px solid #d1d1d6",
              background: "transparent", color: "#86868b", fontSize: 12, fontWeight: 400,
              cursor: "pointer", marginLeft: 4,
            }}>✕ Effacer</button>
          )}
        </div>

        {error && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: 14, color: "#86868b" }}>Erreur de connexion au catalogue</p>
            <p style={{ fontSize: 12, color: "#d1d1d6", marginTop: 4 }}>{error}</p>
          </div>
        )}

        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {products.map(p => (
              <ProductCard key={p.id} product={p} onSelect={() => setSelectedProduct(p)} />
            ))}
          </motion.div>
        )}

        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0", color: "#86868b" }}>
            <Icons.box size={30} sw={1} />
            <p style={{ fontSize: 14, marginTop: 12 }}>Aucun produit dans cette catégorie</p>
          </div>
        )}
      </div>

      {/* Product detail panel */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductPanel product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
