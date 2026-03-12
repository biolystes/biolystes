import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  type JSONProduct,
  type EnrichedFields,
  buildEnrichmentMap,
  jsonToWCProduct,
  parseCertifications,
  parseIngredients,
  parseStarFeatures,
  normalize,
  getCategoryLabel,
} from "@/data/productsData";

// ─── Crème palette (no grays) ─────────────────────────────
const C = {
  bg: "#ebebd6",         // main crème background
  bgLight: "#f5f4df",    // lighter crème (panels, dropdowns)
  border: "#dddcc8",     // crème border
  borderLight: "#e2e1cc",// lighter crème border
  muted: "#8a8970",      // warm olive muted text
  mutedLight: "#a5a48e", // lighter muted
  accent: "#6b6a55",     // darker warm accent text
  skeleton: "#e2e1cc",   // skeleton pulse
  skeletonDark: "#d6d5c0",
  badgeBg: "rgba(139,138,112,0.1)",
  badgeBgStrong: "rgba(139,138,112,0.14)",
};

// ─── WooCommerce config ───────────────────────────────────
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
  search:  (p: any) => <Icon {...p} d={["M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z","m21 21-4.3-4.3"]} />,
  leaf:    (p: any) => <Icon {...p} d={["M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 1 8.5-2 3-5.5 5-9 5.5","M2 21c0-3 1.85-5.36 5.08-7C9.5 12.52 12 13 13 14"]} />,
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
  _enriched?: EnrichedFields;
}

interface WCCategory { id: number; name: string; slug: string; count: number; parent: number; image?: { src: string } | null; }
interface WCTag { id: number; name: string; count: number; }
interface WCAttribute { id: number; name: string; slug: string; }
interface WCAttributeTerm { id: number; name: string; count: number; }

// ─── Color map ────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  "ambre": "#c17e3f", "amber": "#c17e3f",
  "noir": "#1a1a1a", "black": "#1a1a1a", "noire": "#1a1a1a",
  "blanche": "#f9f9f9", "blanc": C.bgLight, "white": "#f9f9f9",
  "vert": "#4a8c4a", "verte": "#4a8c4a", "green": "#4a8c4a",
  "transparente": `repeating-conic-gradient(${C.skeletonDark} 0% 25%, ${C.bgLight} 0% 50%) 0 0/8px 8px`,
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

function normalizeStr(name: string): string {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

// ─── Filter Dropdown ──────────────────────────────────────
type FilterOption = { id: number | string; name: string; image?: string };

function FilterDropdown({ label, options, selected, onChange, grid = false }: {
  label: string; options: FilterOption[]; selected: (number | string)[]; onChange: (ids: (number | string)[]) => void; grid?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const hasActive = selected.length > 0;

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, border: hasActive ? "1.5px solid #1d1d1f" : `0px solid ${C.border}`, background: hasActive ? "#1d1d1f" : C.badgeBg, color: hasActive ? C.bgLight : "#1d1d1f", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap" }}>
        {label}
        {hasActive && <span style={{ background: "rgba(255,255,255,0.25)", borderRadius: 10, padding: "1px 6px", fontSize: 10, fontWeight: 700 }}>{selected.length}</span>}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={open ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} /></svg>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 98 }} />
          <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 99, background: C.bgLight, borderRadius: 14, minWidth: grid ? 380 : 220, boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)", border: `1px solid ${C.borderLight}` }}>
            <div style={{ padding: 10, display: grid ? "grid" : "block", gridTemplateColumns: grid ? "1fr 1fr" : undefined, gap: grid ? 2 : 0 }}>
              {options.map(opt => {
                const active = selected.includes(opt.id);
                return (
                  <button key={opt.id} onClick={() => onChange(active ? selected.filter(id => id !== opt.id) : [...selected, opt.id])}
                    style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", borderRadius: 8, border: "none", background: active ? C.bg : "transparent", cursor: "pointer", textAlign: "left", transition: "background .1s" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, border: active ? "none" : `1.5px solid ${C.border}`, background: active ? "#1d1d1f" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {active && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
                    </div>
                    {opt.image && <div style={{ width: 22, height: 22, borderRadius: "50%", background: opt.image, border: `1px solid ${C.border}`, flexShrink: 0 }} />}
                    <span style={{ fontSize: 13, fontWeight: 400, color: "#1d1d1f" }}>{opt.name}</span>
                  </button>
                );
              })}
            </div>
            {selected.length > 0 && (
              <div style={{ borderTop: `1px solid ${C.bg}`, padding: "6px 10px" }}>
                <button onClick={() => onChange([])} style={{ width: "100%", padding: "6px", borderRadius: 8, border: "none", background: "transparent", color: C.muted, fontSize: 12, cursor: "pointer" }}>Effacer la sélection</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Product Placeholder (no image) ───────────────────────
function ProductPlaceholder({ name }: { name: string }) {
  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 12,
      background: "#ecebd7", padding: 24,
    }}>
      <Icons.leaf size={32} sw={1} />
      <span style={{
        fontSize: 11, fontWeight: 700, color: C.muted,
        textTransform: "uppercase", letterSpacing: ".5px",
        textAlign: "center", lineHeight: 1.5, maxWidth: "80%",
      }}>
        {name}
      </span>
    </div>
  );
}

// ─── Certification Badge ──────────────────────────────────
function CertBadge({ label }: { label: string }) {
  return (
    <span style={{
      padding: "2px 7px", borderRadius: 6, fontSize: 8, fontWeight: 600,
      letterSpacing: ".3px", background: C.badgeBg, color: C.accent,
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

// ─── Product Detail Panel ─────────────────────────────────
function ProductPanel({ product, onClose }: { product: WCProduct; onClose: () => void }) {
  const img = product.images?.[0]?.src || null;
  const price = product.price ? parseFloat(product.price) : null;
  const desc = product._enriched?.description_full || stripHtml(product.short_description || product.description);
  const tags = product.tags?.map(t => t.name) || [];
  const cats = product.categories?.map(c => c.name) || [];
  const isVegan = tags.some(t => t.toLowerCase().includes("vegan")) ||
    product._enriched?.certifications?.some(c => c.toLowerCase().includes("végan") || c.toLowerCase().includes("vegan"));
  const isBio = tags.some(t => t.toLowerCase().includes("bio") || t.toLowerCase().includes("ecocert") || t.toLowerCase().includes("cosmos")) ||
    product._enriched?.certifications?.some(c => c.toLowerCase().includes("bio") || c.toLowerCase().includes("certifié"));
  const midRange = price ? Math.round(price * 2.2) : null;
  const bio = price ? Math.round(price * 3.5) : null;
  const luxury = price ? Math.round(price * 4.5) : null;
  const enriched = product._enriched;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.18)", zIndex: 100 }} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 420, background: C.bgLight, zIndex: 101, overflowY: "auto", display: "flex", flexDirection: "column" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${C.bg}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted }}>Fiche produit</span>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "none", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.muted }}>
            <Icons.close size={14} />
          </button>
        </div>

        <div style={{ background: C.bg, aspectRatio: "1", overflow: "hidden", flexShrink: 0 }}>
          {img
            ? <img src={img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <ProductPlaceholder name={product.name} />
          }
        </div>

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

          {desc && <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65 }}>{desc.length > 400 ? desc.slice(0, 400) + "…" : desc}</p>}

          {/* Certifications */}
          {enriched?.certifications && enriched.certifications.length > 0 && (
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted, display: "block", marginBottom: 8 }}>Certifications</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {enriched.certifications.map((c, i) => <CertBadge key={i} label={c} />)}
              </div>
            </div>
          )}

          {/* Key ingredients */}
          {enriched?.ingredients_fr && enriched.ingredients_fr.length > 0 && (
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: C.muted, display: "block", marginBottom: 8 }}>Ingrédients clés</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {enriched.ingredients_fr.map((ing, i) => (
                  <span key={i} style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 500, background: C.bg, color: C.accent }}>
                    {ing}
                  </span>
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
          {price && (
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

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {price && <span style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f" }}>{Math.round(price)}€ <span style={{ fontSize: 12, fontWeight: 400, color: C.muted }}>HT</span></span>}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {cats.slice(0, 3).map((cat, i) => (
                <span key={i} style={{ padding: "3px 10px", borderRadius: 20, fontSize: 9, fontWeight: 700, letterSpacing: ".5px", textTransform: "uppercase", background: "#1d1d1f", color: C.bgLight }}>{cat}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// ─── Product Card ─────────────────────────────────────────
function ProductCard({ product, onSelect, vatEnabled = false, isSelected = false, onToggleSelect }: { product: WCProduct; onSelect: () => void; vatEnabled?: boolean; isSelected?: boolean; onToggleSelect?: (e: React.MouseEvent) => void }) {
  const img = product.images?.[0]?.src || null;
  const cats = product.categories?.map(c => c.name) || [];
  const price = product.price ? parseFloat(product.price) : null;
  const midRange = price ? Math.round(price * 2.2) : null;
  const bioPrix = price ? Math.round(price * 3.5) : null;
  const luxury = price ? Math.round(price * 4.5) : null;
  const displayCats = cats.filter(c => c.length < 24).slice(0, 2);
  const enriched = product._enriched;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.18 }}
      onClick={onSelect}
      style={{
        display: "flex", flexDirection: "column", cursor: "pointer",
        borderRadius: 20, overflow: "hidden",
        outline: isSelected ? "2.5px solid #1d1d1f" : "none",
        border: "none", boxShadow: "none",
        transition: "outline .15s",
        background: C.bg,
      }}
    >
      {/* Image area */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "1", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", background: "#ecebd7", minHeight: 354 }}>
        {enriched?.volume && (
          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2, padding: "3px 10px", borderRadius: 8, background: "rgba(245,244,223,0.7)", backdropFilter: "blur(8px)", fontSize: 9, fontWeight: 700, color: C.muted, letterSpacing: ".3px" }}>
            {enriched.volume}
          </div>
        )}
        {!enriched?.volume && (
          <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2, width: 26, height: 26, borderRadius: 8, background: "rgba(245,244,223,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.muted }}>#</div>
        )}

        {onToggleSelect && (
          <button onClick={onToggleSelect}
            style={{ position: "absolute", top: 10, right: 10, zIndex: 10, width: 26, height: 26, borderRadius: 8, border: isSelected ? "none" : "2px solid rgba(0,0,0,0.15)", background: isSelected ? "#1d1d1f" : "rgba(245,244,223,0.6)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all .15s" }}>
            {isSelected && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>}
          </button>
        )}

        {img
          ? <img src={img} alt={product.name} loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1)", transition: "transform .4s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
          : <ProductPlaceholder name={product.name} />
        }
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <h3 style={{ fontSize: 11, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.4, textTransform: "uppercase", letterSpacing: ".3px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 30, margin: 0 }}>
          {product.name}
        </h3>

        {enriched?.star_features && enriched.star_features.length > 0 && (
          <p style={{ fontSize: 10, color: C.muted, lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {enriched.star_features.join(" · ")}
          </p>
        )}

        {enriched?.certifications && enriched.certifications.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {enriched.certifications.slice(0, 3).map((c, i) => <CertBadge key={i} label={c} />)}
            {enriched.certifications.length > 3 && (
              <span style={{ fontSize: 8, fontWeight: 600, color: C.mutedLight, alignSelf: "center" }}>+{enriched.certifications.length - 3}</span>
            )}
          </div>
        )}


        {price && (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "#111" }}>Prix de vente conseillé</span>
              <span style={{ fontSize: 8, fontWeight: 800, padding: "2px 6px", borderRadius: 4, background: "#1d1d1f", color: C.bgLight }}>AI</span>
            </div>
            {[
              { label: "Milieu de gamme", val: midRange },
              { label: "Marché Bio", val: bioPrix },
              { label: "Marché Luxe", val: luxury },
            ].map((tier, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                <span style={{ fontSize: 11, color: "#111", fontWeight: 400 }}>{tier.label}</span>
                <span style={{ fontSize: 12, color: "#111", fontWeight: 600 }}>{tier.val}€</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "nowrap", gap: 6, overflow: "hidden", marginTop: "auto", paddingTop: 6, borderTop: `1px solid ${C.borderLight}` }}>
          {price && <span style={{ fontSize: 15, fontWeight: 700, color: "#111", flexShrink: 0 }}>{Math.round(price)}€ <span style={{ fontSize: 9, fontWeight: 400, color: "#111" }}>HT</span></span>}
          <div style={{ display: "flex", gap: 4, flexWrap: "nowrap", overflow: "hidden", justifyContent: "flex-end" }}>
            {displayCats.slice(0, 2).map((cat, i) => (
              <span key={i} style={{ padding: "3px 9px", borderRadius: 20, fontSize: 8, fontWeight: 700, letterSpacing: ".4px", textTransform: "uppercase", background: "#1d1d1f", color: C.bgLight, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 100 }}>{cat}</span>
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
    <div style={{ borderRadius: 20, overflow: "hidden", border: "none", boxShadow: "none", background: C.bgLight }}>
      <div style={{ width: "100%", aspectRatio: "1", background: C.bg, animation: "pulse 1.5s infinite" }} />
      <div style={{ padding: "16px 18px" }}>
        <div style={{ height: 10, width: "75%", background: C.skeleton, borderRadius: 4, marginBottom: 8, animation: "pulse 1.5s infinite" }} />
        <div style={{ height: 10, width: "55%", background: C.skeleton, borderRadius: 4, marginBottom: 12, animation: "pulse 1.5s infinite" }} />
        <div style={{ height: 8, width: "90%", background: C.borderLight, borderRadius: 4, marginBottom: 6, animation: "pulse 1.5s infinite" }} />
        <div style={{ height: 8, width: "80%", background: C.borderLight, borderRadius: 4, marginBottom: 6, animation: "pulse 1.5s infinite" }} />
        <div style={{ height: 8, width: "70%", background: C.borderLight, borderRadius: 4, animation: "pulse 1.5s infinite" }} />
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
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [jsonProducts, setJsonProducts] = useState<JSONProduct[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetch("/data/produits.json")
      .then(r => r.json())
      .then((data: JSONProduct[]) => setJsonProducts(data))
      .catch(() => {});
  }, []);

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

  const mergedProducts = (() => {
    if (jsonProducts.length === 0) return allProducts;
    const enrichmentMap = buildEnrichmentMap(jsonProducts);
    const wcNormalizedNames = new Set(allProducts.map(p => normalizeStr(p.name)));
    const enrichedWC = allProducts.map(p => {
      const key = normalizeStr(p.name);
      const enrichment = enrichmentMap.get(key);
      if (enrichment) return { ...p, _enriched: enrichment };
      return p;
    });
    const jsonOnlyProducts: WCProduct[] = [];
    jsonProducts.forEach((jp, idx) => {
      const key = normalizeStr(jp.nom);
      if (!wcNormalizedNames.has(key)) jsonOnlyProducts.push(jsonToWCProduct(jp, idx) as WCProduct);
    });
    return [...enrichedWC, ...jsonOnlyProducts];
  })();

  const topLevel = allCategories.filter(c => c.parent === 0).sort((a, b) => b.count - a.count);

  const jsonCategories = (() => {
    if (jsonProducts.length === 0) return [];
    const cats = new Set<string>();
    jsonProducts.forEach(jp => { if (jp.categorie) cats.add(jp.categorie); });
    return Array.from(cats).map(slug => ({ id: -(slug.length * 1000 + slug.charCodeAt(0)), name: getCategoryLabel(slug) }));
  })();

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

  const filteredProducts = mergedProducts.filter(p => {
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
      .map(p => ({ id: p.id, name: p.name, price: p.price, image: p.images?.[0]?.src || "", permalink: p.permalink, categories: p.categories.map(c => c.name) }));
    if (selectedProducts.length === 0) return;
    setSharing(true);
    try {
      const userId = user?.id;
      const { data, error } = await supabase
        .from("product_selections")
        .insert({ user_id: userId || "00000000-0000-0000-0000-000000000000", title: `Sélection Biolystes — ${selectedProducts.length} produit${selectedProducts.length > 1 ? "s" : ""}`, products: selectedProducts as any })
        .select("id").single();
      if (error || !data) { console.error("Supabase insert error:", error); throw error; }
      const shareUrl = `${window.location.origin}/selection/${data.id}`;
      try { await navigator.clipboard.writeText(shareUrl); toast.success("Lien copié !", { description: "Partagez ce lien pour présenter votre sélection." }); }
      catch { prompt("Copiez ce lien :", shareUrl); toast.success("Lien de partage créé !"); }
    } catch (err) { console.error("Share error:", err); toast.error("Erreur lors de la création du lien."); }
    finally { setSharing(false); }
  };

  const products = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
    if (sortBy === "price-desc") return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
    return 0;
  });

  const hasFilters = selectedCatIds.length > 0 || selectedTagIds.length > 0 ||
    Object.values(selectedAttrTerms).some(v => v.length > 0) ||
    Object.values(selectedGroupTags).some(v => v.length > 0);

  const clearFilters = () => { setSelectedCatIds([]); setSelectedTagIds([]); setSelectedAttrTerms({}); setSelectedGroupTags({}); };

  const catOptions: FilterOption[] = topLevel.map(c => ({ id: c.id, name: c.name }));
  const unGroupedTags = allTags.filter(t => { const { group } = parseTag(t.name); if (!group) return true; return !TAG_GROUP_LABELS[group]; }).slice(0, 30).map(t => ({ id: t.id, name: t.name }));

  const groupFilters = FILTER_ORDER.map(label => {
    const group = tagGroups[label];
    if (!group || group.tags.length === 0) return null;
    const isColor = label === "Couleur de l'emballage";
    const options: FilterOption[] = group.tags.map((t, i) => ({
      id: t.id, name: group.displayNames[i],
      ...(isColor ? { image: COLOR_MAP[group.displayNames[i].toLowerCase()] || C.border } : {}),
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

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: C.muted, marginBottom: 4 }}>Catalogue</p>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1d1d1f", lineHeight: 1.1, letterSpacing: "-.5px" }}>
          Vos produits<br />
          <span style={{ color: "#000" }}>en marque blanche.</span>
        </h1>
        <p style={{ fontSize: 14, color: C.muted, marginTop: 10, maxWidth: 460, lineHeight: 1.65 }}>
          Sélectionnez les produits que vous souhaitez commercialiser sous votre propre marque.
        </p>
      </motion.div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "1.5px", textTransform: "uppercase" }}>Catalogue</span>
          <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.border }}>
            <Icons.search size={13} />
            <span style={{ fontSize: 11 }}>{products.length} produits</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {catOptions.length > 0 && <FilterDropdown label="Catégorie" options={catOptions} selected={selectedCatIds} onChange={ids => setSelectedCatIds(ids as number[])} grid={catOptions.length > 4} />}
            {unGroupedTags.length > 0 && <FilterDropdown label="Étiquette" options={unGroupedTags} selected={selectedTagIds} onChange={ids => setSelectedTagIds(ids as number[])} grid={unGroupedTags.length > 6} />}
            {groupFilters.map(f => <FilterDropdown key={f.label} label={f.label} options={f.options} selected={selectedGroupTags[f.label] || []} onChange={ids => setSelectedGroupTags(prev => ({ ...prev, [f.label]: ids as number[] }))} grid={f.options.length > 6 && !f.isColor} />)}
            {hasFilters && <button onClick={clearFilters} style={{ padding: "7px 14px", borderRadius: 20, border: `1px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 12, fontWeight: 400, cursor: "pointer" }}>Effacer</button>}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ position: "relative" }}>
              <button onClick={() => setSortOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, border: `1px solid ${C.border}`, background: C.bgLight, color: "#1d1d1f", fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M7 12h10M11 18h2" /></svg>
                Trier
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={sortOpen ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} /></svg>
              </button>
              {sortOpen && (
                <>
                  <div onClick={() => setSortOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 98 }} />
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 99, background: C.bgLight, borderRadius: 14, minWidth: 180, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", border: `1px solid ${C.borderLight}`, padding: 8 }}>
                    {sortOptions.map(opt => (
                      <button key={opt.key} onClick={() => { setSortBy(opt.key as typeof sortBy); setSortOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 10px", borderRadius: 8, border: "none", background: sortBy === opt.key ? C.bg : "transparent", cursor: "pointer", textAlign: "left", fontSize: 13, color: "#1d1d1f" }}>
                        <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, border: sortBy === opt.key ? "none" : `1.5px solid ${C.border}`, background: sortBy === opt.key ? "#1d1d1f" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
            <p style={{ fontSize: 14, color: C.muted }}>Erreur de connexion au catalogue</p>
            <p style={{ fontSize: 12, color: C.border, marginTop: 4 }}>{error}</p>
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
              <ProductCard key={p.id} product={p} onSelect={() => setSelectedProduct(p)} vatEnabled={vatEnabled} isSelected={selectedIds.has(p.id)} onToggleSelect={(e) => toggleSelect(p.id, e)} />
            ))}
          </motion.div>
        )}

        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: "center", padding: "64px 0", color: C.muted }}>
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
            initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 200, display: "flex", alignItems: "center", gap: 12, background: "#1d1d1f", borderRadius: 20, padding: "12px 16px 12px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.28)", whiteSpace: "nowrap" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: C.bgLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#1d1d1f" }}>{selectedIds.size}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(245,244,223,0.85)" }}>produit{selectedIds.size > 1 ? "s" : ""} sélectionné{selectedIds.size > 1 ? "s" : ""}</span>
            </div>
            <button onClick={() => setSelectedIds(new Set())} style={{ background: "rgba(245,244,223,0.12)", border: "none", borderRadius: 10, padding: "6px 12px", color: "rgba(245,244,223,0.7)", fontSize: 12, cursor: "pointer" }}>Effacer</button>
            <button onClick={shareSelection} disabled={sharing}
              style={{ display: "flex", alignItems: "center", gap: 7, background: C.bgLight, border: "none", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "#1d1d1f", cursor: sharing ? "default" : "pointer", opacity: sharing ? 0.7 : 1, transition: "opacity .15s" }}>
              {sharing ? (
                <svg style={{ animation: "spin .8s linear infinite" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              )}
              {sharing ? "Création…" : "Partager la sélection"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
