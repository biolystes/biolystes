import { useState, useEffect } from "react";
import AIChat from "@/components/AIChat";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import kaniwa1 from "@/assets/kaniwa-1.jpg";
import kaniwa2 from "@/assets/kaniwa-2.jpg";
import kaniwa3 from "@/assets/kaniwa-3.jpg";
import kaniwa4 from "@/assets/kaniwa-4.jpg";
import kaniwa5 from "@/assets/kaniwa-5.jpg";
import kaniwa6 from "@/assets/kaniwa-6.jpg";
import kaniwa7 from "@/assets/kaniwa-7.jpg";
import kaniwa8 from "@/assets/kaniwa-8.jpg";
import kaniwa9 from "@/assets/kaniwa-9.jpg";
import kaniwa10 from "@/assets/kaniwa-10.jpg";
import kaniwa11 from "@/assets/kaniwa-11.jpg";
import kaniwa12 from "@/assets/kaniwa-12.jpg";

import kaniwa14 from "@/assets/kaniwa-14.jpg";

// ─── Fralène imports ──────────────────────────────────────
import fralene1 from "@/assets/fralene-1.jpg";
import fralene2 from "@/assets/fralene-2.jpg";
import fralene3 from "@/assets/fralene-3.jpg";
import fralene4 from "@/assets/fralene-4.jpg";
import fralene5 from "@/assets/fralene-5.jpg";
import fralene6 from "@/assets/fralene-6.jpg";
import fralene7 from "@/assets/fralene-7.jpg";
import fralene8 from "@/assets/fralene-8.jpg";
import fralene9 from "@/assets/fralene-9.jpg";
import fralene10 from "@/assets/fralene-10.jpg";
import fralene11 from "@/assets/fralene-11.jpg";
import fralene12 from "@/assets/fralene-12.jpg";
import fralene13 from "@/assets/fralene-13.jpg";
import fralene14 from "@/assets/fralene-14.jpg";
import fralene15 from "@/assets/fralene-15.jpg";

// ─── Sevmylook imports ────────────────────────────────────
import sevmylook1 from "@/assets/sevmylook-1.jpg";
import sevmylook2 from "@/assets/sevmylook-2.jpg";
import sevmylook3 from "@/assets/sevmylook-3.jpg";
import sevmylook4 from "@/assets/sevmylook-4.jpg";
import sevmylook6 from "@/assets/sevmylook-6.jpg";
import sevmylook7 from "@/assets/sevmylook-7.jpg";
import sevmylook8 from "@/assets/sevmylook-8.jpg";
import sevmylook9 from "@/assets/sevmylook-9.jpg";
import sevmylook10 from "@/assets/sevmylook-10.jpg";

// ─── Pmyrris imports ──────────────────────────────────────
import pmyrris1 from "@/assets/pmyrris-1.jpg";
import pmyrris2 from "@/assets/pmyrris-2.jpg";
import pmyrris3 from "@/assets/pmyrris-3.jpg";
import pmyrris4 from "@/assets/pmyrris-4.jpg";
import pmyrris5 from "@/assets/pmyrris-5.jpg";
import pmyrris7 from "@/assets/pmyrris-7.jpg";
import pmyrris8 from "@/assets/pmyrris-8.jpg";
import pmyrris9 from "@/assets/pmyrris-9.jpg";
import pmyrris10 from "@/assets/pmyrris-10.jpg";
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
function ProductCard({ product, onSelect, vatEnabled = false }: { product: WCProduct; onSelect: () => void; vatEnabled?: boolean }) {
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
      <div style={{ position: "relative", width: "100%", aspectRatio: "3/4", background: "#f5f5f7", overflow: "hidden" }}>
        {/* # badge top-left */}
        <div style={{
          position: "absolute", top: 12, left: 12, zIndex: 2,
          width: 24, height: 24, borderRadius: 6,
          background: "rgba(255,255,255,0.85)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, fontWeight: 700, color: "#86868b",
        }}>#</div>

        {/* VEGAN / BIO badges */}
        {(isVegan || isBio) && (
          <div style={{ position: "absolute", top: 10, right: 10, zIndex: 2, display: "flex", gap: 4 }}>
            {isVegan && (
              <span style={{
                padding: "3px 8px", borderRadius: 20, fontSize: 9, fontWeight: 600,
                letterSpacing: ".4px", textTransform: "uppercase",
                background: "rgba(255,255,255,0.9)", color: "#1d1d1f",
              }}>Vegan</span>
            )}
            {isBio && (
              <span style={{
                padding: "3px 8px", borderRadius: 20, fontSize: 9, fontWeight: 600,
                letterSpacing: ".4px", textTransform: "uppercase",
                background: "rgba(255,255,255,0.9)", color: "#1d1d1f",
              }}>Bio</span>
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "nowrap", gap: 6, marginTop: "auto", overflow: "hidden" }}>
          {price && (
            <span style={{ fontSize: 16, fontWeight: 700, color: "#1d1d1f", flexShrink: 0 }}>{vatEnabled ? Math.round(price * 1.2) : Math.round(price)}€ <span style={{ fontSize: 10, fontWeight: 400, color: "#86868b" }}>{vatEnabled ? "TTC" : "HT"}</span></span>
          )}
          <div style={{ display: "flex", gap: 5, flexWrap: "nowrap", overflow: "hidden", justifyContent: "flex-end" }}>
            {displayCats.slice(0, 2).map((cat, i) => (
              <span key={i} style={{
                padding: "4px 10px", borderRadius: 20, fontSize: 8, fontWeight: 700,
                letterSpacing: ".4px", textTransform: "uppercase",
                background: "#1d1d1f", color: "#fff",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 110,
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
  "blanche": "#f9f9f9", "blanc": "#f0f0f0", "white": "#f9f9f9",
  "vert": "#4a8c4a", "verte": "#4a8c4a", "green": "#4a8c4a",
  "transparente": "repeating-conic-gradient(#d4d4d4 0% 25%, #f5f5f5 0% 50%) 0 0/8px 8px",
  "transparent": "repeating-conic-gradient(#d4d4d4 0% 25%, #f5f5f5 0% 50%) 0 0/8px 8px",
  "rose": "#e8a0b0", "pink": "#e8a0b0",
  "bleu": "#4a7cb5", "blue": "#4a7cb5",
  "violet": "#8b5cf6", "purple": "#8b5cf6",
  "beige": "#d4b896", "crème": "#f5e6d3", "creme": "#f5e6d3",
  "argent": "#a8a8a8", "silver": "#a8a8a8",
  "or": "#d4af37", "gold": "#d4af37",
};

// ─── Tag group names → filter label mapping ───────────────
// Tags have format "Name (Group)" — we parse groups exactly like selfnamed
const TAG_GROUP_LABELS: Record<string, string> = {
  "réclamations": "Réclamations",
  "reclamations": "Réclamations",
  "réclamation": "Réclamations",
  "claims": "Réclamations",
  "inquiétude": "Besoin",
  "inquietude": "Besoin",
  "concern": "Besoin",
  "préoccupation": "Besoin",
  "préoccupations": "Besoin",
  "principes actifs": "Principes actifs",
  "principe actif": "Principes actifs",
  "actifs": "Principes actifs",
  "active ingredients": "Principes actifs",
  "ingrédients actifs": "Principes actifs",
  "couleur de l'emballage": "Couleur de l'emballage",
  "couleur emballage": "Couleur de l'emballage",
  "couleur": "Couleur de l'emballage",
  "packaging color": "Couleur de l'emballage",
};

const FILTER_ORDER = ["Réclamations", "Besoin", "Principes actifs", "Couleur de l'emballage"];


// Parse WC tag name: "Name (Group)" → { name, group }
function parseTag(tagName: string): { displayName: string; group: string | null } {
  const match = tagName.match(/^(.+?)\s*\((.+?)\)\s*$/);
  if (match) {
    return { displayName: match[1].trim(), group: match[2].trim().toLowerCase() };
  }
  return { displayName: tagName, group: null };
}

// ─── Main Dashboard (Configurateur IA) ──────────────────
export default function DashboardPage() {
  const { profile } = useAuth();
  const [chatStarted, setChatStarted] = useState(false);

  // Catalogue state (affiché tant qu'on n'a pas démarré le chat)
  const [allProducts, setAllProducts] = useState<WCProduct[]>([]);
  const [allCategories, setAllCategories] = useState<WCCategory[]>([]);
  const [allTags, setAllTags] = useState<WCTag[]>([]);
  const [attributes, setAttributes] = useState<WCAttribute[]>([]);
  const [attrTerms, setAttrTerms] = useState<Record<number, WCAttributeTerm[]>>({});
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedAttrTerms, setSelectedAttrTerms] = useState<Record<number, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<WCProduct | null>(null);
  const [vatEnabled, setVatEnabled] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "price-asc" | "price-desc">("date");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedGroupTags, setSelectedGroupTags] = useState<Record<string, number[]>>({});

  useEffect(() => {
    if (chatStarted) return; // ne pas fetcher si le catalogue n'est pas visible
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
  }, [chatStarted]);

  useEffect(() => {
    if (chatStarted) return;
    setLoading(true);
    setError(null);
    fetch(buildUrl("/products", { page: "1", per_page: "100", status: "publish", orderby: "date", order: "desc" }))
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((prods: WCProduct[]) => { setAllProducts(prods); setLoading(false); })
      .catch((err: Error) => { setError(err.message); setLoading(false); });
  }, [chatStarted]);

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

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 32 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "#86868b", marginBottom: 6 }}>
          {profile?.first_name ? `Bonjour, ${profile.first_name}` : "Bonjour"}
        </p>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: "#1d1d1f", lineHeight: 1.05, letterSpacing: "-1px", marginBottom: 0 }}>
          Lancez votre marque
        </h1>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: "#d1d1d6", lineHeight: 1.05, letterSpacing: "-1px", marginBottom: 16 }}>
          cosmétique bio.
        </h1>
        <p style={{ fontSize: 14, color: "#86868b", marginTop: 0, maxWidth: 520, lineHeight: 1.65 }}>
          Décrivez votre projet, discutez avec notre assistant IA, et obtenez<br />une sélection personnalisée de produits en marque blanche.
        </p>
      </motion.div>

      {/* Chat IA */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.4 }} style={{ marginBottom: chatStarted ? 0 : 48 }}>
        <AIChat onConversationStart={() => setChatStarted(true)} />
      </motion.div>

      {/* ── Cas clients (tabulations) ────────────────────────── */}
      <AnimatePresence>
        {!chatStarted && (
          <ClientShowcase />
        )}
      </AnimatePresence>

      {/* Catalogue — masqué quand le chat démarre */}
      <AnimatePresence>
        {!chatStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#86868b", letterSpacing: "1.5px", textTransform: "uppercase" }}>Catalogue</span>
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
                  <button onClick={clearFilters} style={{ padding: "7px 14px", borderRadius: 20, border: "1px solid #d1d1d6", background: "transparent", color: "#86868b", fontSize: 12, cursor: "pointer" }}>
                    Effacer
                  </button>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#86868b" }}>TVA</span>
                  <button onClick={() => setVatEnabled(v => !v)} role="switch" aria-checked={vatEnabled}
                    style={{ width: 36, height: 20, borderRadius: 10, border: "none", background: vatEnabled ? "#1d1d1f" : "#d1d1d6", cursor: "pointer", position: "relative", transition: "background .2s", padding: 0, flexShrink: 0 }}>
                    <span style={{ position: "absolute", top: 2, left: vatEnabled ? 18 : 2, width: 16, height: 16, borderRadius: 8, background: "#fff", transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
                  </button>
                </div>
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
                  <ProductCard key={p.id} product={p} onSelect={() => setSelectedProduct(p)} vatEnabled={vatEnabled} />
                ))}
              </motion.div>
            )}

            {!loading && !error && products.length === 0 && (
              <div style={{ textAlign: "center", padding: "64px 0", color: "#86868b" }}>
                <Icons.box size={30} sw={1} />
                <p style={{ fontSize: 14, marginTop: 12 }}>Aucun produit dans cette catégorie</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && <ProductPanel product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </AnimatePresence>
    </>
  );
}



// ─── Client data ──────────────────────────────────────────
const CLIENTS = [
  {
    slug: "kaniwa",
    name: "Kaniwa Botanique",
    url: "https://kaniwabotanique.com/",
    tagline: "Marque bio & vegan lancée en 12 jours · Gamme soins visage, corps & rasage",
    tags: ["Bio & Vegan", "France", "12 jours"],
    accentColor: "#1d1d1f",
    quote: "Grâce à Biolystes, j'ai lancé ma marque cosmétique bio en moins de deux semaines, sans stock, sans laboratoire.",
    quoteAuthor: "Fondatrice de Kaniwa Botanique — Paris, France",
    photos: [kaniwa1, kaniwa2, kaniwa3, kaniwa4, kaniwa5, kaniwa6, kaniwa7, kaniwa8, kaniwa9, kaniwa10, kaniwa11, kaniwa12, kaniwa14],
  },
  {
    slug: "fralene",
    name: "Fralène",
    url: "https://fraleneparis.com/",
    tagline: "Gamme soins visage premium · Huile nettoyante lactée & démaquillant biphasique",
    tags: ["Soins visage", "Sans parfum", "Premium"],
    accentColor: "#6b21a8",
    quote: "Biolystes m'a permis de créer une ligne de soins haut de gamme avec un packaging élégant, sans avoir à gérer la production.",
    quoteAuthor: "Fondatrice de Fralène — France",
    photos: [fralene1, fralene2, fralene3, fralene4, fralene5, fralene6, fralene7, fralene8, fralene9, fralene10, fralene11, fralene12, fralene13, fralene14, fralene15],
  },
  {
    slug: "sevmylook",
    name: "Sevmylook",
    url: "https://sevmylook.com/",
    tagline: "Gamme solaire & soins visage · Protection SPF 30, crème hydratante Séverine & huile Jouvence",
    tags: ["Soins visage", "SPF 30", "Gamme complète"],
    accentColor: "#b5896b",
    quote: "Biolystes a su créer une identité visuelle cohérente et des formules de qualité pour toute notre gamme.",
    quoteAuthor: "Fondatrice de Sevmylook — France",
    photos: [sevmylook1, sevmylook2, sevmylook3, sevmylook4, sevmylook6, sevmylook7, sevmylook8, sevmylook9, sevmylook10],
  },
  {
    slug: "pmyrris",
    name: "Pmyrris Beauty",
    url: "https://pmyrrisbeauty.fr/",
    tagline: "Gamme soins capillaires pour cheveux bouclés · Shampoing, conditionneur & spray définissant",
    tags: ["Soins capillaires", "Bouclés", "Naturel"],
    accentColor: "#5c2d1e",
    quote: "Biolystes a transformé mon concept en une gamme capillaire complète, avec un packaging qui correspond parfaitement à mon univers.",
    quoteAuthor: "Fondatrice de Pmyrris Beauty — France",
    photos: [pmyrris1, pmyrris2, pmyrris3, pmyrris4, pmyrris5, pmyrris7, pmyrris8, pmyrris9, pmyrris10],
  },
];

// ─── Client Showcase (tabbed) ─────────────────────────────
function ClientShowcase() {
  const [activeTab, setActiveTab] = useState(0);
  const client = CLIENTS[activeTab];
  const rowA = client.photos.slice(0, Math.ceil(client.photos.length / 2));
  const rowB = client.photos.slice(Math.floor(client.photos.length / 2));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      style={{ marginTop: 64 }}
    >
      {/* Section label */}
      <span style={{ fontSize: 10, fontWeight: 700, color: "#86868b", letterSpacing: "1.5px", textTransform: "uppercase" }}>
        Cas clients
      </span>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {CLIENTS.map((c, i) => (
          <button
            key={c.slug}
            onClick={() => setActiveTab(i)}
            style={{
              padding: "8px 18px",
              borderRadius: 24,
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: activeTab === i ? c.accentColor : "#f0f0f2",
              color: activeTab === i ? "#fff" : "#86868b",
              boxShadow: activeTab === i ? `0 2px 12px ${c.accentColor}40` : "none",
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Active client content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={client.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.4px" }}>
                {client.name}
              </h2>
              <p style={{ fontSize: 13, color: "#86868b", marginTop: 4, maxWidth: 420 }}>
                {client.tagline}
              </p>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              {client.tags.map((tag, i) => (
                <span key={i} style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: i === 0 ? client.accentColor : "#f0f0f2",
                  color: i === 0 ? "#fff" : "#86868b",
                }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Carousel */}
          <style>{`
            @keyframes scrollL { from { transform: translateX(0) } to { transform: translateX(-50%) } }
            @keyframes scrollR { from { transform: translateX(-50%) } to { transform: translateX(0) } }
            .anim-l { animation: scrollL 40s linear infinite; }
            .anim-r { animation: scrollR 40s linear infinite; }
            .client-strip:hover .anim-l,
            .client-strip:hover .anim-r { animation-play-state: paused; }
          `}</style>

          <div className="client-strip" style={{ display: "flex", flexDirection: "column", gap: 10, overflow: "hidden", borderRadius: 20 }}>
            <div style={{ overflow: "hidden" }}>
              <div className="anim-l" style={{ display: "flex", gap: 10, width: "max-content" }}>
                {[...rowA, ...rowA].map((src, i) => (
                  <div key={i} style={{ width: 220, height: 160, borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
                    <img src={src} alt={client.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <div className="anim-r" style={{ display: "flex", gap: 10, width: "max-content" }}>
                {[...rowB, ...rowB].map((src, i) => (
                  <div key={i} style={{ width: 220, height: 160, borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
                    <img src={src} alt={client.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quote */}
          <div style={{ marginTop: 16, padding: "20px 24px", borderRadius: 16, background: "#fff", border: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: client.accentColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
              {client.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, color: "#1d1d1f", fontWeight: 500, lineHeight: 1.6, fontStyle: "italic", marginBottom: 6 }}>
                "{client.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <p style={{ fontSize: 11, color: "#86868b" }}>{client.quoteAuthor}</p>
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 11, fontWeight: 600, color: client.accentColor,
                    textDecoration: "none", display: "flex", alignItems: "center", gap: 4,
                    padding: "3px 10px", borderRadius: 12,
                    border: `1px solid ${client.accentColor}40`,
                    background: `${client.accentColor}08`,
                    whiteSpace: "nowrap",
                  }}
                >
                  Voir le site ↗
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function KaniwaSection() {
  return null;
}
