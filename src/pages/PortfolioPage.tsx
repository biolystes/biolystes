import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// ─── Kaniwa Botanique ─────────────────────────────────────
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

// ─── Fralène ──────────────────────────────────────────────
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

// ─── Sevmylook ────────────────────────────────────────────
import sevmylook1 from "@/assets/sevmylook-1.jpg";
import sevmylook2 from "@/assets/sevmylook-2.jpg";
import sevmylook3 from "@/assets/sevmylook-3.jpg";
import sevmylook4 from "@/assets/sevmylook-4.jpg";

import sevmylook6 from "@/assets/sevmylook-6.jpg";
import sevmylook7 from "@/assets/sevmylook-7.jpg";
import sevmylook8 from "@/assets/sevmylook-8.jpg";
import sevmylook9 from "@/assets/sevmylook-9.jpg";
import sevmylook10 from "@/assets/sevmylook-10.jpg";
import sevmylook11 from "@/assets/sevmylook-11.jpg";
import sevmylook12 from "@/assets/sevmylook-12.jpg";
import sevmylook13 from "@/assets/sevmylook-13.jpg";
import sevmylook14 from "@/assets/sevmylook-14.jpg";
import sevmylook15 from "@/assets/sevmylook-15.jpg";
import sevmylook16 from "@/assets/sevmylook-16.jpg";
import sevmylook17 from "@/assets/sevmylook-17.jpg";
import sevmylook18 from "@/assets/sevmylook-18.jpg";
import sevmylook19 from "@/assets/sevmylook-19.jpg";

// ─── Pmyrris Beauty ───────────────────────────────────────
import pmyrris1 from "@/assets/pmyrris-1.jpg";
import pmyrris2 from "@/assets/pmyrris-2.jpg";
import pmyrris3 from "@/assets/pmyrris-3.jpg";
import pmyrris4 from "@/assets/pmyrris-4.jpg";
import pmyrris5 from "@/assets/pmyrris-5.jpg";

import pmyrris7 from "@/assets/pmyrris-7.jpg";
import pmyrris8 from "@/assets/pmyrris-8.jpg";
import pmyrris9 from "@/assets/pmyrris-9.jpg";
import pmyrris10 from "@/assets/pmyrris-10.jpg";
import pmyrris11 from "@/assets/pmyrris-11.jpg";
import pmyrris12 from "@/assets/pmyrris-12.jpg";
import pmyrris13 from "@/assets/pmyrris-13.jpg";
import pmyrris14 from "@/assets/pmyrris-14.jpg";
import pmyrris15 from "@/assets/pmyrris-15.jpg";

// ─── Data ─────────────────────────────────────────────────
export interface Brand {
  slug: string;
  name: string;
  tagline: string;
  tags: string[];
  accentColor: string;
  url: string;
  photos: string[];
}

export const BRANDS: Brand[] = [
  {
    slug: "kaniwa",
    name: "Kaniwa Botanique",
    tagline: "Marque bio & vegan · Gamme soins visage, corps & rasage · Lancée en 12 jours",
    tags: ["Bio & Vegan", "France", "12 jours"],
    accentColor: "#1d1d1f",
    url: "https://kaniwabotanique.com/",
    photos: [
      kaniwa1, kaniwa2, kaniwa3, kaniwa4, kaniwa5, kaniwa6, kaniwa7,
      kaniwa8, kaniwa9, kaniwa10, kaniwa11, kaniwa12, kaniwa14,
    ],
  },
  {
    slug: "fralene",
    name: "Fralène",
    tagline: "Gamme soins visage premium · Huile nettoyante lactée & démaquillant biphasique",
    tags: ["Soins visage", "Sans parfum", "Premium"],
    accentColor: "#6b21a8",
    url: "https://fraleneparis.com/",
    photos: [
      fralene1, fralene2, fralene3, fralene4, fralene5,
      fralene6, fralene7, fralene8, fralene9, fralene10,
      fralene11, fralene12, fralene13, fralene14, fralene15,
    ],
  },
  {
    slug: "sevmylook",
    name: "Sevmylook",
    tagline: "Gamme solaire & soins visage · Protection SPF 30, crème hydratante Séverine & huile Jouvence",
    tags: ["Soins visage", "SPF 30", "Gamme complète"],
    accentColor: "#b5896b",
    url: "https://sevmylook.com/",
    photos: [
      sevmylook1, sevmylook2, sevmylook3, sevmylook4,
      sevmylook6, sevmylook7, sevmylook8, sevmylook9, sevmylook10,
      sevmylook11, sevmylook12, sevmylook13, sevmylook14, sevmylook15,
      sevmylook16, sevmylook17, sevmylook18, sevmylook19,
    ],
  },
  {
    slug: "pmyrris",
    name: "Pmyrris Beauty",
    tagline: "Gamme soins capillaires · Shampoing lissant, conditionneur & spray définissant pour cheveux bouclés",
    tags: ["Soins capillaires", "Cheveux bouclés", "Naturel"],
    accentColor: "#5c2d1e",
    url: "https://pmyrrisbeauty.fr/",
    photos: [
      pmyrris1, pmyrris2, pmyrris3, pmyrris4, pmyrris5,
      pmyrris7, pmyrris8, pmyrris9,
      pmyrris10, pmyrris11, pmyrris12,
      pmyrris13, pmyrris14, pmyrris15,
    ],
  },
];

// ─── Lightbox ─────────────────────────────────────────────
function Lightbox({
  photos, index, onClose, onPrev, onNext,
}: {
  photos: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <X size={28} />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-5" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
        {index + 1} / {photos.length}
      </div>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 text-white/60 hover:text-white transition-colors"
        style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      >
        <ChevronLeft size={22} />
      </button>

      {/* Image */}
      <motion.img
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        src={photos[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "88vh", maxWidth: "88vw", objectFit: "contain", borderRadius: 12 }}
      />

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 text-white/60 hover:text-white transition-colors"
        style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
      >
        <ChevronRight size={22} />
      </button>
    </motion.div>
  );
}

// ─── Brand Album ──────────────────────────────────────────
function BrandAlbum({ brand, index }: { brand: Brand; index: number }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const handlePrev = () => setLightboxIdx((i) => (i === null || i === 0 ? brand.photos.length - 1 : i - 1));
  const handleNext = () => setLightboxIdx((i) => (i === null ? 0 : (i + 1) % brand.photos.length));

  // Keyboard nav
  const handleKey = (e: React.KeyboardEvent) => {
    if (lightboxIdx === null) return;
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") setLightboxIdx(null);
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15, duration: 0.5 }}
        onKeyDown={handleKey}
        tabIndex={-1}
        style={{ outline: "none" }}
      >
        {/* Album header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: brand.accentColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                {brand.name[0]}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1d1d1f", letterSpacing: "-0.3px" }}>
                {brand.name}
              </h2>
              <a
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11, fontWeight: 600, color: brand.accentColor,
                  textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4,
                  padding: "4px 12px", borderRadius: 20,
                  border: `1px solid ${brand.accentColor}40`,
                  transition: "background .15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = `${brand.accentColor}12`)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                Voir le site ↗
              </a>
            </div>
            <p style={{ fontSize: 13, color: "#86868b", paddingLeft: 42 }}>{brand.tagline}</p>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {brand.tags.map((tag, i) => (
              <span key={i} style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: i === 0 ? brand.accentColor : "#f0f0f2",
                color: i === 0 ? "#fff" : "#86868b",
              }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Photo count pill */}
        <div style={{ paddingLeft: 42, marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: "#86868b", fontWeight: 500 }}>
            {brand.photos.length} photos · Cliquez pour agrandir
          </span>
        </div>

        {/* Masonry grid */}
        <div style={{
          columns: "4 220px",
          gap: 10,
          lineHeight: 0,
        }}>
          {brand.photos.map((src, i) => (
            <div
              key={i}
              onClick={() => setLightboxIdx(i)}
              style={{
                marginBottom: 10,
                borderRadius: 14,
                overflow: "hidden",
                cursor: "zoom-in",
                breakInside: "avoid",
                position: "relative",
              }}
              className="group"
            >
              <img
                src={src}
                alt={`${brand.name} ${i + 1}`}
                loading="lazy"
                style={{
                  width: "100%",
                  display: "block",
                  transition: "transform 0.4s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#f0f0f0", marginTop: 48, marginBottom: 48 }} />
      </motion.section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            photos={brand.photos}
            index={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Portfolio Page ────────────────────────────────────────
export default function PortfolioPage() {
  return (
    <>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 48 }}
      >
        <span style={{ fontSize: 10, fontWeight: 700, color: "#86868b", letterSpacing: "1.5px", textTransform: "uppercase" }}>
          Biolystes
        </span>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1d1d1f", marginTop: 6, letterSpacing: "-0.6px" }}>
          Portfolio
        </h1>
        <p style={{ fontSize: 15, color: "#86868b", marginTop: 8, maxWidth: 520, lineHeight: 1.6 }}>
          Des marques cosmétiques créées de A à Z avec Biolystes — packaging, formulation, identité visuelle.
        </p>
      </motion.div>

      {/* Albums */}
      {BRANDS.map((brand, i) => (
        <BrandAlbum key={brand.slug} brand={brand} index={i} />
      ))}
    </>
  );
}
