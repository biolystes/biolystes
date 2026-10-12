/**
 * Sector Bento — bloc "cas d'usage sectoriel" utilisé sur les pages solutions.
 * Structure calquée sur les bentos coiffure / distribution / événementiel présents
 * sur la page essayage (`/`). Portable, avec CSS scopée pour éviter les collisions.
 */

import { FaceMeshScanner } from "@lystes/features/landing-particuliers/components/diagnostic/FaceMeshScanner";

export type SectorBentoLarge =
  | {
      type: "before-after";
      heading: string;
      text: string;
      beforeImg: string;
      afterImg: string;
      beforeLabel: string;
      afterLabel: string;
    }
  | {
      type: "comparison";
      heading: string;
      text: string;
      axisTitle: string;
      pillA: string;
      pillB: string;
      axisLeft: string;
      axisMid: string;
      axisRight: string;
    };

export interface SectorBentoData {
  /** Titre du bloc (ex. "Secteur de la coiffure"). */
  sectorTitle: string;
  sectorDescription: string;
  media:
    | { kind: "video"; src: string }
    | { kind: "image"; src: string }
    | { kind: "facemesh"; src: string };
  mediaBadge?: string;
  mediaTitle?: string;
  mediaLink?: { label: string; href: string };
  ctaCard: { heading: string; text: string; ctaLabel: string; ctaHref: string };
  kpi1: {
    label: string;
    prefix: string;
    value: string;
    suffix: string;
    expl: string;
    src: string;
  };
  large2: SectorBentoLarge;
  kpi2: {
    label: string;
    prefix: string;
    value: string;
    suffix: string;
    expl: string;
    src: string;
  };
}

const SCOPE = "sector-bento-scope";

const CSS = `
.${SCOPE} {
  --ink: #1a1a1a;
  --ink-soft: rgba(26, 26, 26, 0.6);
  --ink-faint: rgba(26, 26, 26, 0.45);
  --paper: #f9f9f9;
  color: var(--ink);
  line-height: 1.65;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
.${SCOPE} .sb-wrap { max-width: 920px; margin: 0 auto; padding: 0; }
@media (min-width: 768px) { .${SCOPE} .sb-wrap { padding: 0 24px; } }
.${SCOPE} .sb-title { background: var(--paper); border-radius: 16px; padding: 50px 35px; display: flex; flex-direction: column; margin-top: 80px; }
.${SCOPE} .sb-title h3 { font-size: 28px; font-weight: 300; line-height: 32px; letter-spacing: -0.01em; margin-bottom: 14px; font-family: 'Inter'; }
.${SCOPE} .sb-title p { font-size: 13px; line-height: 1.65; color: var(--ink-soft); margin: 0; }
.${SCOPE} .sb-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 16px; }
@media (max-width: 760px) { .${SCOPE} .sb-grid { grid-template-columns: 1fr; } }
.${SCOPE} .sb-cell { background: var(--paper); border-radius: 16px; padding: 30px; display: flex; flex-direction: column; transition: transform .35s cubic-bezier(0.22,1,0.36,1); }
.${SCOPE} .sb-cell:hover { transform: translateY(-4px); }
.${SCOPE} .sb-cell h4 { font-size: 28px; font-weight: 300; line-height: 32px; letter-spacing: -0.01em; margin: 0 0 14px; font-family: 'Inter'; }
.${SCOPE} .sb-cell .t { font-size: 13px; line-height: 1.65; color: var(--ink-soft); margin: 0 0 24px; }
.${SCOPE} .sb-cta { margin-top: auto; padding: 14px 0 0; }
.${SCOPE} .sb-cta a { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 12px 12px 12px 26px; border-radius: 9999px; background: #000; color: #fff; font-size: 14px; line-height: 1; font-weight: 500; text-decoration: none; }
.${SCOPE} .sb-cta .arr { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 9999px; background: #fff; color: #000; }
.${SCOPE} .sb-repere { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 22px; }
.${SCOPE} .sb-repere p { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; margin: 0; }
.${SCOPE} .sb-repere span { color: var(--ink-faint); font-size: 14px; }
.${SCOPE} .sb-gros { font-size: 64px; font-weight: 300; line-height: 1; letter-spacing: -0.01em; font-variant-numeric: tabular-nums; }
.${SCOPE} .sb-gros sup { font-size: 26px; }
.${SCOPE} .sb-mult { font-size: 32px; font-weight: 300; }
.${SCOPE} .sb-expl { font-size: 13px; line-height: 1.65; color: var(--ink-soft); margin: 18px 0 0; }
.${SCOPE} .sb-src { margin-top: auto; padding-top: 16px; font-size: 10px; color: var(--ink-faint); }
.${SCOPE} .sb-media { position: relative; border-radius: 16px; overflow: hidden; min-height: 300px; display: flex; flex-direction: column; justify-content: flex-end; text-decoration: none; }
.${SCOPE} .sb-media video, .${SCOPE} .sb-media img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
.${SCOPE} .sb-media .sb-facemesh { position: absolute; inset: 0; z-index: 1; display: flex; align-items: center; justify-content: center; background: #050505; }
.${SCOPE} .sb-media .sb-facemesh canvas { border-radius: 16px; }
.${SCOPE} .sb-media .voile { position: absolute; inset: 0; background: linear-gradient(to top, rgba(26,26,26,0.82) 0%, rgba(26,26,26,0.25) 55%, rgba(26,26,26,0.05) 100%); z-index: 2; }
.${SCOPE} .sb-media .lab { position: relative; padding: 30px; z-index: 3; }
.${SCOPE} .sb-media .lab .badge { display: inline-block; margin-bottom: 4px; padding: 7px 11px; font-size: 6px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; color: #fff; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.55); border-radius: 999px; backdrop-filter: blur(4px); }
.${SCOPE} .sb-media .lab .lt { color: #fff; font-size: 28px; font-weight: 300; line-height: 32px; letter-spacing: -0.01em; margin-bottom: 14px; font-family: 'Inter'; display: block; }
.${SCOPE} .sb-media .lab .lk { margin-top: 12px; display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; color: rgba(255,255,255,0.85); }
@media (max-width: 760px) {
  .${SCOPE} .sb-media { min-height: 60vh; }
  .${SCOPE} .sb-media .lab { padding: 22px; }
  .${SCOPE} .sb-media .lab .lt { font-size: 24px; line-height: 28px; }
}
.${SCOPE} .sb-large2 { grid-column: span 2; }
@media (max-width: 760px) { .${SCOPE} .sb-large2 { grid-column: span 1; } }
.${SCOPE} .sb-ba-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.${SCOPE} .sb-ba-cell { position: relative; border-radius: 14px; overflow: hidden; background: #f5f5f5; aspect-ratio: 3/4; }
.${SCOPE} .sb-ba-cell .sb-ba-label { position: absolute; top: 12px; left: 12px; font-size: 11px; color: #fff; letter-spacing: 0.18em; text-transform: uppercase; font-weight: 600; z-index: 2; background: rgba(0,0,0,0.55); padding: 4px 10px; border-radius: 999px; }
.${SCOPE} .sb-ba-cell img { width: 100%; height: 100%; object-fit: cover; display: block; }
.${SCOPE} .sb-cmp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: center; }
@media (max-width: 640px) { .${SCOPE} .sb-cmp-grid { grid-template-columns: 1fr; } }
.${SCOPE} .sb-cmp-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.25em; font-weight: 600; color: var(--ink-faint); margin-bottom: 18px; }
.${SCOPE} .sb-pill-rail { display: flex; flex-direction: column; gap: 10px; align-items: flex-start; }
.${SCOPE} .sb-pill { display: inline-block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; background: #fff; border-radius: 9999px; padding: 7px 14px; white-space: nowrap; }
.${SCOPE} .sb-pill-accent { background: var(--ink); color: #fff; }
.${SCOPE} .sb-pill-axe { margin-top: 18px; background: #fff; border-radius: 9999px; padding: 8px 16px; display: flex; justify-content: space-between; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-faint); }
`;

interface SectorBentoBlockProps {
  data: SectorBentoData;
}

export function SectorBentoBlock({ data }: SectorBentoBlockProps) {
  return (
    <div className={SCOPE}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="sb-wrap">
        <div className="sb-title">
          <h3>{data.sectorTitle}</h3>
          <p>{data.sectorDescription}</p>
        </div>
        <div className="sb-grid">
          {/* Media */}
          <div className="sb-media">
            {data.media.kind === "video" ? (
              <video autoPlay muted loop playsInline preload="auto">
                <source src={data.media.src} type="video/mp4" />
              </video>
            ) : data.media.kind === "facemesh" ? (
              <div className="sb-facemesh">
                <FaceMeshScanner imageUrl={data.media.src} />
              </div>
            ) : (
              <img src={data.media.src} alt={data.sectorTitle} />
            )}
            <span className="voile" />
            <span className="lab">
              {data.mediaBadge && <span className="badge">{data.mediaBadge}</span>}
              {data.mediaTitle && <span className="lt">{data.mediaTitle}</span>}
              {data.mediaLink && (
                <a
                  className="lk"
                  href={data.mediaLink.href}
                  style={{ textDecoration: "none", color: "rgba(255,255,255,0.85)" }}
                >
                  ↗ {data.mediaLink.label}
                </a>
              )}
            </span>
          </div>

          {/* CTA card */}
          <div className="sb-cell">
            <h4>{data.ctaCard.heading}</h4>
            <p className="t">{data.ctaCard.text}</p>
            <div className="sb-cta">
              <a href={data.ctaCard.ctaHref}>
                <span>{data.ctaCard.ctaLabel}</span>
                <span className="arr">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* KPI 1 */}
          <div className="sb-cell">
            <div className="sb-repere"><p>{data.kpi1.label}</p><span>↗</span></div>
            <div className="sb-gros">
              <span className="sb-mult">{data.kpi1.prefix}</span>
              {data.kpi1.value}
              <sup>{data.kpi1.suffix}</sup>
            </div>
            <p className="sb-expl">{data.kpi1.expl}</p>
            <div className="sb-src">{data.kpi1.src}</div>
          </div>

          {/* Large 2 */}
          <div className="sb-cell sb-large2">
            {data.large2.type === "before-after" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <h4>{data.large2.heading}</h4>
                  <p className="t" style={{ textAlign: "justify" }}>{data.large2.text}</p>
                </div>
                <div className="sb-ba-grid">
                  <div className="sb-ba-cell">
                    <div className="sb-ba-label">{data.large2.beforeLabel}</div>
                    <img src={data.large2.beforeImg} alt={data.large2.beforeLabel} />
                  </div>
                  <div className="sb-ba-cell">
                    <div className="sb-ba-label">{data.large2.afterLabel}</div>
                    <img src={data.large2.afterImg} alt={data.large2.afterLabel} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="sb-cmp-grid">
                <div>
                  <h4>{data.large2.heading}</h4>
                  <p className="t" style={{ textAlign: "justify" }}>{data.large2.text}</p>
                </div>
                <div>
                  <div className="sb-cmp-title">{data.large2.axisTitle}</div>
                  <div className="sb-pill-rail">
                    <span className="sb-pill" style={{ marginLeft: "0%" }}>{data.large2.pillA}</span>
                    <span className="sb-pill sb-pill-accent" style={{ marginLeft: "30%" }}>{data.large2.pillB}</span>
                  </div>
                  <div className="sb-pill-axe">
                    <span>{data.large2.axisLeft}</span>
                    <span>{data.large2.axisMid}</span>
                    <span>{data.large2.axisRight}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KPI 2 */}
          <div className="sb-cell">
            <div className="sb-repere"><p>{data.kpi2.label}</p><span>↗</span></div>
            <div className="sb-gros">
              <span className="sb-mult">{data.kpi2.prefix}</span>
              {data.kpi2.value}
              <sup>{data.kpi2.suffix}</sup>
            </div>
            <p className="sb-expl">{data.kpi2.expl}</p>
            <div className="sb-src">{data.kpi2.src}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
