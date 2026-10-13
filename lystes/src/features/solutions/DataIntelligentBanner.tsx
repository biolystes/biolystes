import VideoAuto from "@lystes/components/VideoAuto";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

/**
 * Bloc "Data intelligent" — courbe blanche animée sur fond vidéo, façon bento.
 * Mise en page 100% inline (immunisé au build/CSS global).
 * Libellés d'axes, point et ligne de survol en HTML (pas de texte SVG étiré
 * par preserveAspectRatio="none"). i18n autonome (fallback FR/EN). Aucune ombre.
 */

type Txt = {
  t1: string; t2: string; sub: string; conv: string; tryon: string;
  unitConv: string; unitTryon: string; topicsTitle: string; topics: string[];
};

const TOPIC_W = ["41%", "14%", "8%", "7%"];

const I18N: Record<string, Txt> = {
  fr: { t1: "Data intelligent pour comprendre", t2: "parfaitement vos clients", sub: "Évolution quotidienne · {total} total", conv: "Conversations", tryon: "Essayages", unitConv: "conversations", unitTryon: "essayages", topicsTitle: "Sujets fréquents", topics: ["Routine anti-âge", "Actifs (rétinol, acide hyaluronique)", "Peaux sensibles", "Taches & hydratation"] },
  en: { t1: "Smart data to understand", t2: "your customers perfectly", sub: "Daily trend · {total} total", conv: "Conversations", tryon: "Try-ons", unitConv: "conversations", unitTryon: "try-ons", topicsTitle: "Frequent topics", topics: ["Anti-aging routine", "Actives (retinol, hyaluronic acid)", "Sensitive skin", "Spots & hydration"] },
  de: { t1: "Intelligente Daten, um", t2: "Ihre Kunden perfekt zu verstehen", sub: "Täglicher Verlauf · {total} gesamt", conv: "Konversationen", tryon: "Anproben", unitConv: "Konversationen", unitTryon: "Anproben", topicsTitle: "Häufige Themen", topics: ["Anti-Aging-Routine", "Wirkstoffe (Retinol, Hyaluronsäure)", "Empfindliche Haut", "Flecken & Feuchtigkeit"] },
  es: { t1: "Datos inteligentes para entender", t2: "perfectamente a tus clientes", sub: "Evolución diaria · {total} en total", conv: "Conversaciones", tryon: "Pruebas", unitConv: "conversaciones", unitTryon: "pruebas", topicsTitle: "Temas frecuentes", topics: ["Rutina antiedad", "Activos (retinol, ácido hialurónico)", "Pieles sensibles", "Manchas e hidratación"] },
  pt: { t1: "Dados inteligentes para entender", t2: "perfeitamente os seus clientes", sub: "Evolução diária · {total} no total", conv: "Conversas", tryon: "Provas", unitConv: "conversas", unitTryon: "provas", topicsTitle: "Temas frequentes", topics: ["Rotina antienvelhecimento", "Ativos (retinol, ácido hialurônico)", "Peles sensíveis", "Manchas e hidratação"] },
  it: { t1: "Dati intelligenti per capire", t2: "perfettamente i tuoi clienti", sub: "Andamento giornaliero · {total} totale", conv: "Conversazioni", tryon: "Prove", unitConv: "conversazioni", unitTryon: "prove", topicsTitle: "Argomenti frequenti", topics: ["Routine anti-età", "Attivi (retinolo, acido ialuronico)", "Pelli sensibili", "Macchie e idratazione"] },
  nl: { t1: "Slimme data om", t2: "je klanten perfect te begrijpen", sub: "Dagelijks verloop · {total} totaal", conv: "Gesprekken", tryon: "Passessies", unitConv: "gesprekken", unitTryon: "passessies", topicsTitle: "Veelgestelde onderwerpen", topics: ["Anti-verouderingsroutine", "Actieve stoffen (retinol, hyaluronzuur)", "Gevoelige huid", "Vlekken & hydratatie"] },
};

const DATA = {
  conv: { total: 500, vals: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 4, 14, 26, 94, 48, 40, 52, 85, 58, 44, 40, 42, 15] },
  tryon: { total: 171, vals: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 5, 9, 22, 14, 11, 12, 17, 13, 9, 8, 7, 3] },
};
const PEAK = 20;
const LABEL_IDX = [0, 2, 5, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 29];
const Y_TICKS = [100, 75, 50, 25, 0];
const NS = "http://www.w3.org/2000/svg";
const W = 900, H = 260, PT = 10, PB = 10, MAXV = 100;

const FONT = '-apple-system,BlinkMacSystemFont,"Helvetica Neue",Helvetica,Arial,sans-serif';

// x/y en fractions 0..1 (indépendant de la taille rendue)
const xF = (i: number) => i / 29;
const svgY = (v: number) => PT + (H - PT - PB) * (1 - v / MAXV);
const yF = (v: number) => svgY(v) / H;

const S: Record<string, CSSProperties> = {
  root: { width: "100%" },
  video: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -2, display: "block" },
  scrim: { position: "absolute", inset: 0, zIndex: -1, background: "linear-gradient(120deg, rgba(11,28,33,.62) 0%, rgba(11,28,33,.30) 42%, rgba(11,28,33,0) 72%), linear-gradient(0deg, rgba(11,28,33,.34) 0%, rgba(11,28,33,0) 40%)" },
  head: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },
  muted: { color: "rgba(255,255,255,.62)", fontWeight: 600 },
  seg: { display: "inline-flex", background: "rgba(16,27,26,.5)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", borderRadius: 999, padding: 4, gap: 2, flex: "none" },
  sub: { fontSize: 13, color: "rgba(255,255,255,.82)", margin: "18px 0 0" },
  tipD: { fontSize: 12, color: "#6e6e73", marginBottom: 8 },
  tipV: { display: "inline-flex", alignItems: "baseline", gap: 9 },
  tipU: { color: "#3f4b4e" },
  topicsH: { fontSize: 14, fontWeight: 600, margin: "0 0 16px", color: "#fff" },
  bar: { flex: "1 1 auto", height: 8, borderRadius: 99, background: "rgba(255,255,255,.28)", overflow: "hidden" },
  barFill: { display: "block", height: "100%", width: 0, background: "#fff", borderRadius: 99, transition: "width 1.1s cubic-bezier(.22,1,.36,1)" },
};

function segBtn(active: boolean, mobile: boolean): CSSProperties {
  return { border: "none", background: active ? "#141414" : "transparent", color: active ? "#fff" : "rgba(255,255,255,.82)", fontFamily: "inherit", fontSize: mobile ? 12 : 13, padding: mobile ? "6px 12px" : "8px 18px", borderRadius: 999, cursor: "pointer", fontWeight: 500, transition: "all .2s", whiteSpace: "nowrap" };
}

/* `essayages` : l'onglet Essayages (true par défaut, comme sur l'accueil).
   /bio le retire (12/10/2026) : ses chiffres ne montrent pas d'essayage
   cosmétique. */
export function DataIntelligentBanner({ lang = "fr", essayages = true }: { lang?: string; essayages?: boolean }) {
  const code = (lang || "fr").substring(0, 2).toLowerCase();
  const txt = I18N[code] ?? I18N.en;
  const locale = code;

  const [mode, setMode] = useState<"conv" | "tryon">("conv");
  const [mobile, setMobile] = useState(false);

  const svgRef = useRef<SVGSVGElement>(null);
  const plotRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const tipDRef = useRef<HTMLDivElement>(null);
  const tipVRef = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const on = () => setMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const days = useMemo(() => {
    const end = new Date(2026, 6, 16);
    const arr: Date[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(end);
      d.setDate(end.getDate() - i);
      arr.push(d);
    }
    return arr;
  }, []);

  const fmtShort = (d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "short" }).replace(".", "");
  const fmtLong = (d: Date) => d.toLocaleDateString(locale, { day: "numeric", month: "long" });

  useEffect(() => {
    const svg = svgRef.current;
    const plot = plotRef.current;
    if (!svg || !plot) return;
    const vals = DATA[mode].vals;
    const el = (n: string, at: Record<string, string | number>) => {
      const e = document.createElementNS(NS, n);
      for (const k in at) e.setAttribute(k, String(at[k]));
      return e;
    };
    svg.innerHTML = "";

    // gridlines horizontales (l'étirement d'une ligne horizontale est sans effet visible)
    Y_TICKS.forEach((v) => {
      const y = svgY(v);
      svg.appendChild(el("line", { x1: 0, y1: y, x2: W, y2: y, stroke: "rgba(255,255,255,.42)", "stroke-width": 1, "stroke-dasharray": "2 7", "vector-effect": "non-scaling-stroke" }));
    });

    const XX = (i: number) => W * xF(i);
    let d = "M " + XX(0) + " " + svgY(vals[0]);
    for (let i = 1; i < 30; i++) {
      const cx = (XX(i - 1) + XX(i)) / 2;
      d += " C " + cx + " " + svgY(vals[i - 1]) + ", " + cx + " " + svgY(vals[i]) + ", " + XX(i) + " " + svgY(vals[i]);
    }

    const defs = el("defs", {});
    const grad = el("linearGradient", { id: "diGrad", x1: 0, y1: 0, x2: 0, y2: 1 });
    grad.appendChild(el("stop", { offset: "0%", "stop-color": "#fff", "stop-opacity": 0.34 }));
    grad.appendChild(el("stop", { offset: "100%", "stop-color": "#fff", "stop-opacity": 0 }));
    defs.appendChild(grad);
    svg.appendChild(defs);
    svg.appendChild(el("path", { d: d + " L " + W + " " + H + " L 0 " + H + " Z", fill: "url(#diGrad)", stroke: "none" }));

    const path = el("path", { d, fill: "none", stroke: "#fff", "stroke-width": 2.4, "stroke-linecap": "round", "stroke-linejoin": "round", "vector-effect": "non-scaling-stroke" }) as SVGPathElement;
    svg.appendChild(path);

    const showAt = (i: number) => {
      const fx = xF(i) * 100, fy = yF(vals[i]) * 100;
      if (guideRef.current) { guideRef.current.style.left = fx + "%"; guideRef.current.style.opacity = "1"; }
      if (dotRef.current) { dotRef.current.style.left = fx + "%"; dotRef.current.style.top = fy + "%"; dotRef.current.style.opacity = "1"; }
      const r = plot.getBoundingClientRect();
      if (tipDRef.current) tipDRef.current.textContent = fmtLong(days[i]);
      if (tipVRef.current) tipVRef.current.textContent = String(vals[i]);
      if (tipRef.current) {
        const tw = tipRef.current.offsetWidth || 180;
        const px = (fx / 100) * r.width;
        tipRef.current.style.left = Math.min(Math.max(px + 14, 4), Math.max(4, r.width - tw - 4)) + "px";
        tipRef.current.style.top = Math.max(2, (fy / 100) * r.height - 74) + "px";
        tipRef.current.style.opacity = "1";
        tipRef.current.style.transform = "none";
      }
    };

    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer: number | null = null;
    // Sur mobile : pas de tooltip par défaut (aucun survol) -> le badge ne masque plus la vidéo.
    if (reduce) {
      path.style.strokeDashoffset = "0";
      if (!mobile) showAt(PEAK);
    } else {
      path.style.strokeDashoffset = String(len);
      path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 1100, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
      if (!mobile) timer = window.setTimeout(() => showAt(PEAK), 1150);
    }

    const onMove = (e: MouseEvent) => {
      const r = plot.getBoundingClientRect();
      const i = Math.max(0, Math.min(29, Math.round(((e.clientX - r.left) / r.width) * 29)));
      showAt(i);
    };
    const onLeave = () => showAt(PEAK);
    plot.addEventListener("mousemove", onMove);
    plot.addEventListener("mouseleave", onLeave);

    const bars = barsRef.current?.querySelectorAll<HTMLElement>("[data-w]");
    const barTimer = window.setTimeout(() => bars?.forEach((b) => (b.style.width = b.dataset.w || "0")), 200);

    return () => {
      plot.removeEventListener("mousemove", onMove);
      plot.removeEventListener("mouseleave", onLeave);
      if (timer) window.clearTimeout(timer);
      window.clearTimeout(barTimer);
    };
  }, [mode, locale, mobile]);

  const cfg = DATA[mode];
  const unit = mode === "conv" ? txt.unitConv : txt.unitTryon;
  const subText = txt.sub.replace("{total}", String(cfg.total));

  const gutter = mobile ? 30 : 40;
  const xRow = mobile ? 22 : 26;
  const plotH = mobile ? 200 : 260;
  const axisFont = mobile ? 10 : 12;
  const xLabels = mobile ? [0, 5, 10, 15, 20, 25, 29] : LABEL_IDX;

  const panelStyle: CSSProperties = { position: "relative", borderRadius: mobile ? 18 : 22, overflow: "hidden", padding: mobile ? "22px 18px 26px" : "clamp(32px,4vw,56px)", isolation: "isolate", fontFamily: FONT, color: "#fff", boxSizing: "border-box" };
  const h3Style: CSSProperties = { fontSize: mobile ? 22 : "clamp(21px,2.7vw,30px)", fontWeight: 500, letterSpacing: "-.02em", lineHeight: 1.2, margin: 0, color: "#fff", maxWidth: 620, fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif" };
  const tipStyle: CSSProperties = { position: "absolute", pointerEvents: "none", background: "#fff", borderRadius: mobile ? 12 : 15, padding: mobile ? "9px 11px" : "12px 15px", opacity: 0, transform: "translateY(4px)", transition: "opacity .15s, transform .15s", zIndex: 4, boxSizing: "border-box", whiteSpace: "nowrap" };
  const tipBStyle: CSSProperties = { background: "#123a42", color: "#fff", borderRadius: mobile ? 7 : 9, padding: mobile ? "3px 9px" : "4px 11px", fontSize: mobile ? 14 : 17, fontVariantNumeric: "tabular-nums" };

  return (
    <div style={S.root}>
      <div style={panelStyle}>
        <VideoAuto style={S.video} src="/video2.mp4" aria-hidden="true" />
        <div style={S.scrim} aria-hidden="true" />

        <div style={S.head}>
          <h3 style={h3Style}>{txt.t1} <span style={S.muted}>{txt.t2}</span></h3>
          <div style={S.seg} role="tablist" aria-label="Data">
            <button style={segBtn(mode === "conv", mobile)} role="tab" aria-selected={mode === "conv"} onClick={() => setMode("conv")}>{txt.conv}</button>
            {essayages && (
              <button style={segBtn(mode === "tryon", mobile)} role="tab" aria-selected={mode === "tryon"} onClick={() => setMode("tryon")}>{txt.tryon}</button>
            )}
          </div>
        </div>

        <p style={S.sub}>{subText}</p>

        {/* zone graphique : gouttière Y à gauche + rangée X en bas, tracé SVG au milieu */}
        <div style={{ position: "relative", marginTop: 14, paddingLeft: gutter, paddingBottom: xRow }}>
          <div ref={plotRef} style={{ position: "relative", height: plotH }}>
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", overflow: "visible" }} aria-label={subText} />

            {/* libellés Y (HTML, non étirés) */}
            {Y_TICKS.map((v) => (
              <span key={v} style={{ position: "absolute", left: -8, top: `${yF(v) * 100}%`, transform: "translate(-100%,-50%)", fontSize: axisFont, color: "rgba(255,255,255,.82)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{v}</span>
            ))}

            {/* libellés X (HTML, non étirés) */}
            {xLabels.map((i) => (
              <span key={i} style={{ position: "absolute", top: "100%", marginTop: 7, left: `${xF(i) * 100}%`, transform: "translateX(-50%)", fontSize: axisFont, color: "rgba(255,255,255,.82)", whiteSpace: "nowrap" }}>{fmtShort(days[i])}</span>
            ))}

            {/* ligne de survol + point (HTML, ronds non déformés) */}
            <div ref={guideRef} style={{ position: "absolute", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,.7)", opacity: 0, transform: "translateX(-0.5px)", pointerEvents: "none" }} />
            <div ref={dotRef} style={{ position: "absolute", width: 11, height: 11, borderRadius: "50%", background: "#fff", transform: "translate(-50%,-50%)", opacity: 0, pointerEvents: "none" }} />

            <div ref={tipRef} style={tipStyle}>
              <div style={S.tipD} ref={tipDRef} />
              <div style={S.tipV}><b style={tipBStyle} ref={tipVRef} /><span style={{ ...S.tipU, fontSize: mobile ? 12 : 13 }}>{unit}</span></div>
            </div>
          </div>
        </div>

        {mode === "conv" && (
          <div style={{ margin: "40px 0 0" }} ref={barsRef}>
            <h4 style={S.topicsH}>{txt.topicsTitle}</h4>
            {txt.topics.map((label, idx) => (
              <div style={{ display: "flex", alignItems: "center", gap: mobile ? 12 : 16, marginBottom: 13 }} key={idx}>
                <span style={{ flex: mobile ? "0 1 150px" : "0 1 260px", minWidth: 0, fontSize: 13, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
                <div style={S.bar}><i style={S.barFill} data-w={TOPIC_W[idx]} /></div>
                <span style={{ width: 46, flex: "none", textAlign: "right", fontSize: 14, fontVariantNumeric: "tabular-nums", color: "#fff", fontWeight: 700 }}>{TOPIC_W[idx]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DataIntelligentBanner;
