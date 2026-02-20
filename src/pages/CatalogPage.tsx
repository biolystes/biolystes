import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

// ─── Inline SVG icon ─────────────────────────────────────
function Icon({ d, size = 16, sw = 1.5 }: { d: string | string[]; size?: number; sw?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
    </svg>
  );
}

const Icons = {
  box:     (p: any) => <Icon {...p} d={["M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z","M12 22V12","M3.29 7 12 12l8.71-5","M7.5 4.27l9 5.15"]} />,
  close:   (p: any) => <Icon {...p} d={["M18 6 6 18","m6 6 12 12"]} />,
  external:(p: any) => <Icon {...p} d={["M15 3h6v6","M10 14 21 3","M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"]} />,
  search:  (p: any) => <Icon {...p} d={["M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z","m21 21-4.3-4.3"]} />,
};

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

// ─── Color map ────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  "ambre": "#c17e3f", "amber": "#c17e3f",
  "noir": "#1a1a1a", "black": "#1a1a1a", "noire": "#1a1a1a",
  "blanche": "#f9f9f9", "blanc": "#f0f0f0", "white": "#f9f9f9",
  "vert": "#4a8c4a", "verte": "#4a8c4a", "green": "#4a8c4a",
  "transparente": "repeating-conic-gradient(#d4d4d4 0% 25%, #f5f5f5 0% 50%) 0 0/8px 8px",
  "rose": "#e8a0b0", "bleu": "#4a7cb5", "violet": "#8b5cf6",
  "beige": "#d4b896", "crème": "#f5e6d3", "argent": "#a8a8a8", "or": "#d4af37",
};

const TAG_GROUP_LABELS: Record<string, string> = {
  "réclamations": "Réclamations", "reclamations": "Réclamations", "claims": "Réclamations",
  "inquiétude": "Besoin", "inquietude": "Besoin", "concern": "Besoin",
  "préoccupation": "Besoin", "préoccupations": "Besoin",
  "principes actifs": "Principes actifs", "principe actif": "Principes actifs",
  "actifs": "Principes actifs", "ingrédients actifs": "Principes actifs",
  "couleur de l'emballage": "Couleur de l'emballage", "couleur": "Couleur de l'emballage",
};

const FILTER_ORDER = ["Réclamations", "Besoin", "Principes actifs", "Couleur de l'emballage"];


function parseTag(tagName: string): { displayName: string; group: string | null } {
  const match = tagName.match(/^(.+?)\s*\((.+?)\)\s*$/);
  if (match) return { displayName: match[1].trim(), group: match[2].trim().toLowerCase() };
  return { displayName: tagName, group: null };
}

// ─── Filter Dropdown ──────────────────────────────────────
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
          <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>
            {selected.length}
          </span>
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
                  <button key={opt.id} onClick={() => onChange(active ? selected.filter(id => id !== opt.id) : [...selected, opt.id])}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      width: "100%", padding: "9px 10px", borderRadius: 8, border: "none",
                      background: active ? "#f5f5f7" : "transparent",
                      cursor: "pointer", textAlign: "left", transition: "background .1s",
                    }}
                  >
                    <div style={{
                      width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                      border: active ? "none" : "1.5px solid #c7c7cc",
                      background: active ? "#1d1d1f" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {active && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                    </div>
                    {opt.image && <div style={{ width: 22, height: 22, borderRadius: "50%", background: opt.image, border: "1px solid #e5e5e5", flexShrink: 0 }} />}
                    <span style={{ fontSize: 13, fontWeight: 400, color: "#1d1d1f" }}>{opt.name}</span>
                  </button>
                );
              })}
            </div>
            {selected.length > 0 && (
              <div style={{ borderTop: "1px solid #f5f5f7", padding: "6px 10px" }}>
                <button onClick={() => onChange([])} style={{ width: "100%", padding: "6px", borderRadius: 8, border: "none", background: "transparent", color: "#86868b", fontSize: 12, cursor: "pointer" }}>
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

// ─── Product Detail Panel ─────────────────────────────────
function ProductPanel({ product, onClose }: { product: WCProduct; onClose: () => void }) {
  const img = product.images?.[0]?.src;
  const price = product.price ? parseFloat(product.price) : null;
  const desc = stripHtml(product.short_description || product.description);
  const tags = product.tags?.map(t => t.name) || [];
  const cats = product.categories?.map(c => c.name) || [];
  const isVegan = tags.some(t => t.toLowerCase().includes("vegan"));
  const isBio = tags.some(t => t.toLowerCase().includes("bio") || t.toLowerCase().includes("ecocert") || t.toLowerCase().includes("cosmos"));
  const midRange = price ? Math.round(price * 2.2) : null;
  const bio = price ? Math.round(price * 3.5) : null;
  const luxury = price ? Math.round(price * 4.5) : null;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: 100 }} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 420, background: "#fff", zIndex: 101, overflowY: "auto", display: "flex", flexDirection: "column" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f5f5f7" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#86868b" }}>Fiche produit</span>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: "#f5f5f7", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#86868b" }}>
            <Icons.close size={14} />
          </button>
        </div>

        <div style={{ background: "#f5f5f7", aspectRatio: "1", overflow: "hidden", flexShrink: 0 }}>
          {img
            ? <img src={img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d1d6" }}><Icons.box size={40} sw={1} /></div>
          }
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {isVegan && <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", background: "#f5f5f7", color: "#86868b" }}>Vegan</span>}
            {isBio && <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", background: "#f5f5f7", color: "#86868b" }}>Bio</span>}
          </div>

          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.4, textTransform: "uppercase", letterSpacing: ".2px" }}>{product.name}</h2>

          {desc && <p style={{ fontSize: 13, color: "#86868b", lineHeight: 1.65 }}>{desc.length > 280 ? desc.slice(0, 280) + "…" : desc}</p>}

          {price && (
            <div style={{ background: "#f5f5f7", borderRadius: 12, padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#86868b" }}>Prix de vente conseillé</span>
                <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "#1d1d1f", color: "#fff" }}>IA</span>
              </div>
              {[{ label: "Milieu de gamme", val: midRange }, { label: "Marché bio", val: bio }, { label: "Marché luxe", val: luxury }].map((tier, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, marginBottom: i < 2 ? 8 : 0, borderBottom: i < 2 ? "1px solid #ebebed" : "none" }}>
                  <span style={{ fontSize: 11, color: "#86868b", fontWeight: 500, textTransform: "uppercase", letterSpacing: ".3px" }}>{tier.label}</span>
                  <span style={{ fontSize: 13, color: "#1d1d1f", fontWeight: 700 }}>{tier.val}€</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {price && <span style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f" }}>{Math.round(price)}€ <span style={{ fontSize: 12, fontWeight: 400, color: "#86868b" }}>HT</span></span>}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {cats.slice(0, 3).map((cat, i) => (
                <span key={i} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", background: "#1d1d1f", color: "#fff" }}>{cat}</span>
              ))}
            </div>
          </div>

          <button onClick={() => window.open(product.permalink, "_blank")}
            style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: "#1d1d1f", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            Voir sur le site <Icons.external size={13} />
          </button>
        </div>
      </motion.div>
    </>
  );
}

// ─── Product Card ─────────────────────────────────────────
function ProductCard({ product, onSelect, vatEnabled = false, isSelected = false, onToggleSelect }: { product: WCProduct; onSelect: () => void; vatEnabled?: boolean; isSelected?: boolean; onToggleSelect?: (e: React.MouseEvent) => void }) {
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
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }} onClick={onSelect}
      style={{ display: "flex", flexDirection: "column", cursor: "pointer", background: "#fff", borderRadius: 16, overflow: "hidden", outline: isSelected ? "2.5px solid #1d1d1f" : "2.5px solid transparent", transition: "outline .15s" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", background: "#f5f5f7", overflow: "hidden" }}>
        {/* Selection checkbox */}
        {onToggleSelect && (
          <button
            onClick={onToggleSelect}
            style={{
              position: "absolute", top: 10, left: 10, zIndex: 10, width: 26, height: 26,
              borderRadius: 8, border: isSelected ? "none" : "2px solid rgba(255,255,255,0.9)",
              background: isSelected ? "#1d1d1f" : "rgba(255,255,255,0.75)",
              backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all .15s", boxShadow: "0 1px 4px rgba(0,0,0,.15)",
            }}
          >
            {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
          </button>
        )}
        <div style={{ position: "absolute", top: 12, right: 12, zIndex: 2, width: 24, height: 24, borderRadius: 6, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#86868b" }}>#</div>
        {(isVegan || isBio) && (
          <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2, display: "flex", gap: 4 }}>
            {isVegan && <span style={{ padding: "3px 8px", borderRadius: 20, fontSize: 9, fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase", background: "rgba(255,255,255,0.9)", color: "#1d1d1f" }}>Vegan</span>}
            {isBio && <span style={{ padding: "3px 8px", borderRadius: 20, fontSize: 9, fontWeight: 600, letterSpacing: ".4px", textTransform: "uppercase", background: "rgba(255,255,255,0.9)", color: "#1d1d1f" }}>Bio</span>}
          </div>
        )}
        {img
          ? <img src={img} alt={product.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#d1d1d6" }}><Icons.box size={36} sw={1} /></div>
        }
      </div>
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontSize: 11, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.4, marginBottom: 14, textTransform: "uppercase", letterSpacing: ".3px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.name}
        </h3>
        {price && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid #e5e5e7", marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".8px", textTransform: "uppercase", color: "#1d1d1f" }}>Prix de vente conseillé</span>
              <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "#1d1d1f", color: "#fff" }}>IA</span>
            </div>
            {[{ label: "Milieu de gamme", val: midRange }, { label: "Marché bio", val: bioPrix }, { label: "Marché luxe", val: luxury }].map((tier, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: i < 2 ? 5 : 0 }}>
                <span style={{ fontSize: 10, color: "#86868b", fontWeight: 500, display: "flex", alignItems: "center", gap: 6, textTransform: "uppercase", letterSpacing: ".2px" }}>
                  <span style={{ fontSize: 8, color: "#d1d1d6" }}>○</span> {tier.label}
                </span>
                <span style={{ fontSize: 11, color: "#1d1d1f", fontWeight: 700 }}>{tier.val}€</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "nowrap", gap: 6, marginTop: "auto", overflow: "hidden" }}>
          {price && <span style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", flexShrink: 0 }}>{Math.round(price)}€ <span style={{ fontSize: 10, fontWeight: 400, color: "#86868b" }}>HT</span></span>}
          <div style={{ display: "flex", gap: 5, flexWrap: "nowrap", overflow: "hidden", justifyContent: "flex-end" }}>
            {displayCats.slice(0, 2).map((cat, i) => (
              <span key={i} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700, letterSpacing: ".4px", textTransform: "uppercase", background: "#1d1d1f", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 110 }}>{cat}</span>
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

// ─── Main CatalogPage ─────────────────────────────────────
export default function CatalogPage() {
  const [allProducts, setAllProducts] = useState<WCProduct[]>([]);
  const [allCategories, setAllCategories] = useState<WCCategory[]>([]);
  const [allTags, setAllTags] = useState<WCTag[]>([]);
  const [attributes, setAttributes] = useState<WCAttribute[]>([]);
  const [attrTerms, setAttrTerms] = useState<Record<number, WCAttributeTerm[]>>({});
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedAttrTerms, setSelectedAttrTerms] = useState<Record<number, string[]>>({});
  const [selectedGroupTags, setSelectedGroupTags] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<WCProduct | null>(null);
  const [vatEnabled, setVatEnabled] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "price-asc" | "price-desc">("date");
  const [sortOpen, setSortOpen] = useState(false);
  // ─── Multi-selection for sharing ──────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [sharing, setSharing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      fetch(buildUrl("/products/categories", { per_page: "100", hide_empty: "true" })).then(r => r.json()),
      fetch(buildUrl("/products/tags", { per_page: "100", hide_empty: "true" })).then(r => r.json()),
      fetch(buildUrl("/products/attributes", { per_page: "50" })).then(r => r.json()),
    ]).then(([cats, tags, attrs]: [WCCategory[], WCTag[], WCAttribute[]]) => {
      setAllCategories(cats.filter(c => c.slug !== "uncategorized" && c.count > 0 && !/^\d+$/.test(c.name.trim()) && !["type", "types"].includes(c.name.toLowerCase().trim())).sort((a, b) => b.count - a.count));
      setAllTags(tags.filter(t => t.count > 0).sort((a, b) => b.count - a.count));
      setAttributes(attrs);
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

  const topLevel = allCategories.filter(c => c.parent === 0).sort((a, b) => b.count - a.count);

  const tagGroups = (() => {
    const groups: Record<string, { label: string; tags: WCTag[]; displayNames: string[] }> = {};
    allTags.forEach(tag => {
      const { displayName, group } = parseTag(tag.name);
      if (!group) return;
      const mappedLabel = TAG_GROUP_LABELS[group];
      if (!mappedLabel) return;
      if (!groups[mappedLabel]) groups[mappedLabel] = { label: mappedLabel, tags: [], displayNames: [] };
      groups[mappedLabel].tags.push(tag);
      groups[mappedLabel].displayNames.push(displayName);
    });
    return groups;
  })();

  const filteredProducts = allProducts.filter(p => {
    const pCatIds = new Set(p.categories.map(c => c.id));
    const pTagIds = new Set(p.tags.map(t => t.id));
    const pAttrMap: Record<string, string[]> = {};
    p.attributes.forEach(a => { pAttrMap[a.id] = a.options.map(o => o.toLowerCase()); });
    if (selectedCatIds.length > 0 && !selectedCatIds.some(id => pCatIds.has(id))) return false;
    if (selectedTagIds.length > 0 && !selectedTagIds.some(id => pTagIds.has(id))) return false;
    for (const [, tagIds] of Object.entries(selectedGroupTags)) {
      if (tagIds.length === 0) continue;
      if (!tagIds.some(id => pTagIds.has(id))) return false;
    }
    for (const [attrId, terms] of Object.entries(selectedAttrTerms)) {
      if (terms.length === 0) continue;
      const pTerms = pAttrMap[attrId] || [];
      if (!terms.some(t => pTerms.includes(t.toLowerCase()))) return false;
    }
    return true;
  });

  const toggleSelect = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
    if (!selectionMode) setSelectionMode(true);
  };

  const shareSelection = async () => {
    const selectedProducts = products
      .filter(p => selectedIds.has(p.id))
      .map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.images?.[0]?.src || "",
        permalink: p.permalink,
        categories: p.categories.map(c => c.name),
      }));

    if (selectedProducts.length === 0) return;
    setSharing(true);

    try {
      const userId = user?.id;
      const { data, error } = await supabase
        .from("product_selections")
        .insert({
          user_id: userId || "00000000-0000-0000-0000-000000000000",
          title: `Sélection Biolystes — ${selectedProducts.length} produit${selectedProducts.length > 1 ? "s" : ""}`,
          products: selectedProducts as any,
        })
        .select("id")
        .single();

      if (error || !data) throw error;

      const shareUrl = `${window.location.origin}/selection/${data.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Lien copié !", { description: "Partagez ce lien pour présenter votre sélection." });
    } catch (err) {
      toast.error("Erreur lors de la création du lien.");
    } finally {
      setSharing(false);
    }
  };

  const products = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
    if (sortBy === "price-desc") return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
    return 0;
  });

  const hasFilters = selectedCatIds.length > 0 || selectedTagIds.length > 0 ||
    Object.values(selectedAttrTerms).some(v => v.length > 0) ||
    Object.values(selectedGroupTags).some(v => v.length > 0);

  const clearFilters = () => {
    setSelectedCatIds([]); setSelectedTagIds([]);
    setSelectedAttrTerms({}); setSelectedGroupTags({});
  };

  const catOptions: FilterOption[] = topLevel.map(c => ({ id: c.id, name: c.name }));
  const unGroupedTags = allTags.filter(t => {
    const { group } = parseTag(t.name);
    if (!group) return true;
    return !TAG_GROUP_LABELS[group];
  }).slice(0, 30).map(t => ({ id: t.id, name: t.name }));

  const groupFilters = FILTER_ORDER.map(label => {
    const group = tagGroups[label];
    if (!group || group.tags.length === 0) return null;
    const isColor = label === "Couleur de l'emballage";
    const options: FilterOption[] = group.tags.map((t, i) => ({
      id: t.id, name: group.displayNames[i],
      ...(isColor ? { image: COLOR_MAP[group.displayNames[i].toLowerCase()] || "#ccc" } : {}),
    }));
    return { label, options, isColor };
  }).filter(Boolean) as { label: string; options: FilterOption[]; isColor: boolean }[];

  const sortOptions = [
    { key: "date", label: "Plus récent" },
    { key: "price-asc", label: "Prix croissant" },
    { key: "price-desc", label: "Prix décroissant" },
  ];

  return (
    <>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>

      {/* En-tête */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#86868b", marginBottom: 4 }}>Catalogue</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.1, letterSpacing: "-.5px" }}>
          Vos produits<br />
          <span style={{ color: "#d1d1d6" }}>en marque blanche.</span>
        </h1>
        <p style={{ fontSize: 14, color: "#86868b", marginTop: 10, maxWidth: 460, lineHeight: 1.65 }}>
          Sélectionnez les produits que vous souhaitez commercialiser sous votre propre marque.
        </p>
      </motion.div>

      {/* Catalogue */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#86868b", letterSpacing: "1.5px", textTransform: "uppercase" }}>
            Catalogue
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#d1d1d6" }}>
            <Icons.search size={13} />
            <span style={{ fontSize: 11 }}>{products.length} produits</span>
          </div>
        </div>

        {/* Barre de filtres */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {catOptions.length > 0 && (
              <FilterDropdown label="Catégorie" options={catOptions} selected={selectedCatIds} onChange={ids => setSelectedCatIds(ids as number[])} grid={catOptions.length > 4} />
            )}
            {unGroupedTags.length > 0 && (
              <FilterDropdown label="Étiquette" options={unGroupedTags} selected={selectedTagIds} onChange={ids => setSelectedTagIds(ids as number[])} grid={unGroupedTags.length > 6} />
            )}
            {groupFilters.map(f => (
              <FilterDropdown key={f.label} label={f.label} options={f.options} selected={selectedGroupTags[f.label] || []} onChange={ids => setSelectedGroupTags(prev => ({ ...prev, [f.label]: ids as number[] }))} grid={f.options.length > 6 && !f.isColor} />
            ))}
            {hasFilters && (
              <button onClick={clearFilters} style={{ padding: "7px 14px", borderRadius: 20, border: "1px solid #d1d1d6", background: "transparent", color: "#86868b", fontSize: 12, fontWeight: 400, cursor: "pointer" }}>
                Effacer
              </button>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <button onClick={() => setSortOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, border: "1px solid #d1d1d6", background: "#fff", color: "#1d1d1f", fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M7 12h10M11 18h2" /></svg>
                Trier
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={sortOpen ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} /></svg>
              </button>
              {sortOpen && (
                <>
                  <div onClick={() => setSortOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 98 }} />
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 99, background: "#fff", borderRadius: 14, minWidth: 180, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", border: "1px solid #f0f0f0", padding: 8 }}>
                    {sortOptions.map(opt => (
                      <button key={opt.key} onClick={() => { setSortBy(opt.key as typeof sortBy); setSortOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", borderRadius: 8, border: "none", background: sortBy === opt.key ? "#f5f5f7" : "transparent", cursor: "pointer", textAlign: "left", fontSize: 13, color: "#1d1d1f" }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, border: sortBy === opt.key ? "none" : "1.5px solid #c7c7cc", background: sortBy === opt.key ? "#1d1d1f" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {sortBy === opt.key && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                        </div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
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
              <ProductCard
                key={p.id}
                product={p}
                onSelect={() => setSelectedProduct(p)}
                vatEnabled={vatEnabled}
                isSelected={selectedIds.has(p.id)}
                onToggleSelect={(e) => toggleSelect(p.id, e)}
              />
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

      <AnimatePresence>
        {selectedProduct && <ProductPanel product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{
              position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
              zIndex: 200, display: "flex", alignItems: "center", gap: 12,
              background: "#1d1d1f", borderRadius: 20, padding: "12px 16px 12px 20px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.28)", whiteSpace: "nowrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#1d1d1f" }}>
                {selectedIds.size}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>
                produit{selectedIds.size > 1 ? "s" : ""} sélectionné{selectedIds.size > 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={() => setSelectedIds(new Set())}
              style={{ background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 10, padding: "6px 12px", color: "rgba(255,255,255,0.7)", fontSize: 12, cursor: "pointer" }}
            >
              Effacer
            </button>
            <button
              onClick={shareSelection}
              disabled={sharing}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "#fff", border: "none", borderRadius: 12,
                padding: "8px 16px", fontSize: 13, fontWeight: 700,
                color: "#1d1d1f", cursor: sharing ? "default" : "pointer",
                opacity: sharing ? 0.7 : 1, transition: "opacity .15s",
              }}
            >
              {sharing ? (
                <svg style={{ animation: "spin .8s linear infinite" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              )}
              {sharing ? "Création…" : "Partager la sélection"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

