import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import "@lystes/styles/lystes-orb.css";


/* Orbe à particules — port exact du dessin du widget boutique
   (public/woo-product-chat.js, préréglage « working » : 12 orbites,
   40 points fantômes, 3 particules, vitesse 1,885). Ne pas modifier les
   réglages : l'orbe du back-office doit rester identique à celle des
   boutiques. */
const OPTS = {
  orbitN: 12,
  ghostN: 40,
  ghostR: 0.75,
  ghostA: 0.5,
  particles: 3,
  partR: 1,
  partRDepth: 1.3,
  rsPow: 0.6,
  rMin: 0.25,
};

const SPEED = 1.885;

function hashD(a: number, b: number) {
  const h = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return h - Math.floor(h);
}

function proj(yaw: number, tilt: number, cx: number, cy: number, scale: number) {
  const st = Math.sin(tilt);
  const ct = Math.cos(tilt);
  const sy = Math.sin(yaw);
  const cyw = Math.cos(yaw);
  return (x: number, y: number, z: number): [number, number, number] => {
    const x1 = x * cyw + z * sy;
    const z1 = -x * sy + z * cyw;
    const y1 = y * ct - z1 * st;
    const z2 = y * st + z1 * ct;
    return [cx + x1 * scale, cy - y1 * scale, z2];
  };
}

type Dot = { x: number; y: number; z: number; r: number; white: number; a?: number };

function paint(ctx: CanvasRenderingContext2D, dots: Dot[], rMin: number, dark: boolean) {
  dots.sort((a, b) => a.z - b.z);
  for (const d of dots) {
    const alpha = d.a == null ? 1 : d.a;
    if (alpha < 0.02) continue;
    const w = Math.min(1, Math.max(0, d.white));
    const g = Math.round((dark ? 1 - w : w) * 255);
    ctx.fillStyle = `rgba(${g},${g},${g},${alpha})`;
    ctx.beginPath();
    ctx.arc(d.x, d.y, Math.max(rMin, d.r), 0, Math.PI * 2);
    ctx.fill();
  }
}

function draw(ctx: CanvasRenderingContext2D, size: number, t: number, dark: boolean) {
  const o = OPTS;
  const cx = size / 2;
  const cy = size / 2;
  /* Sphère resserrée : à petite taille, 0,82 débordait visuellement. */
  const R = (size / 2) * 0.62;
  const pt = proj(t * 0.12, 0.3, cx, cy, 1);

  const rs = Math.pow(size / 300, o.rsPow);
  const dots: Dot[] = [];
  for (let orb = 0; orb < o.orbitN; orb++) {
    const h1 = hashD(orb, 1.7);
    const h2 = hashD(orb, 5.2);
    const h3 = hashD(orb, 8.9);
    const ro = R * (0.45 + 0.52 * h1);
    const th = h1 * 2 * Math.PI;
    const phi = Math.acos(2 * h2 - 1);
    const nx = Math.sin(phi) * Math.cos(th);
    const ny = Math.cos(phi);
    const nz = Math.sin(phi) * Math.sin(th);
    let ux = -ny;
    let uy = nx;
    const uz = 0;
    const ul = Math.max(1e-6, Math.sqrt(ux * ux + uy * uy));
    ux /= ul;
    uy /= ul;
    const vx = ny * uz - nz * uy;
    const vy = nz * ux - nx * uz;
    const vz = nx * uy - ny * ux;
    const speed = (0.25 + 0.55 * h3) * (h3 > 0.5 ? 1 : -1);
    for (let k = 0; k < o.ghostN; k++) {
      const a = (k / o.ghostN) * 2 * Math.PI;
      const p = pt(
        (ux * Math.cos(a) + vx * Math.sin(a)) * ro,
        (uy * Math.cos(a) + vy * Math.sin(a)) * ro,
        (uz * Math.cos(a) + vz * Math.sin(a)) * ro
      );
      const depth = (p[2] / ro + 1) / 2;
      dots.push({
        x: p[0],
        y: p[1],
        z: p[2],
        r: o.ghostR * rs,
        white: 0.72,
        a: o.ghostA * (0.4 + 0.6 * depth),
      });
    }
    for (let m = 0; m < o.particles; m++) {
      const a = t * speed + (m / o.particles) * 2 * Math.PI + h2 * 6;
      const p = pt(
        (ux * Math.cos(a) + vx * Math.sin(a)) * ro,
        (uy * Math.cos(a) + vy * Math.sin(a)) * ro,
        (uz * Math.cos(a) + vz * Math.sin(a)) * ro
      );
      const depth = (p[2] / ro + 1) / 2;
      dots.push({
        x: p[0],
        y: p[1],
        z: p[2],
        r: (o.partR + o.partRDepth * depth) * rs,
        white: 0.3 - 0.22 * depth,
      });
    }
  }
  paint(ctx, dots, o.rMin, dark);
}

interface LystesOrbProps {
  /** Diamètre affiché en pixels. */
  size?: number;
  /** Fond sombre (particules claires) ou fond clair (particules sombres). */
  dark?: boolean;
  /** Pastille « AI » en bas à droite. */
  badge?: string | null;
  /** "particles" = sphère animée, "ring" = disque plein + auréole (bouton d'appel). */
  variant?: "particles" | "ring";
  /** Auréole lumineuse rotative autour du rond. */
  beam?: boolean;
  /** Contenu affiché au centre en variante "ring" (icône d'appel). */
  children?: ReactNode;
  className?: string;
}

export function LystesOrb({
  size = 40,
  dark = false,
  badge = "IA",
  variant = "particles",
  beam = false,
  children,
  className,
}: LystesOrbProps) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (variant !== "particles") return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const logical = 64;
    canvas.width = Math.round(logical * dpr);
    canvas.height = Math.round(logical * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let visible = true;
    const start = performance.now();

    const frame = () => {
      const t = ((performance.now() - start) / 1000) * SPEED;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, logical, logical);
      draw(ctx, logical, t, dark);
      if (visible) raf = requestAnimationFrame(frame);
    };

    /* On ne peint que si l'orbe est à l'écran. */
    const io = new IntersectionObserver((entries) => {
      const now = entries[0]?.isIntersecting ?? true;
      if (now && !visible) {
        visible = true;
        raf = requestAnimationFrame(frame);
      } else if (!now) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(wrap);
    raf = requestAnimationFrame(frame);

    return () => {
      visible = false;
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [dark, variant]);

  /* Pastille et liseré proportionnels au diamètre. */
  const badgeSize = Math.max(12, Math.round(size * 0.34));

  return (
    <div
      ref={wrapRef}
      className={`lystes-orbwrap${className ? ` ${className}` : ""}`}
      style={
        {
          width: size,
          height: size,
          "--lystes-orb-badge": `${badgeSize}px`,
        } as CSSProperties
      }
    >
      <span className={`lystes-orb-face${dark ? " is-dark" : ""}`}>
        {variant === "particles" ? (
          <canvas ref={canvasRef} className="lystes-orb-canvas" />
        ) : (
          <span className="lystes-orb-inner">{children}</span>
        )}
      </span>
      {beam && <span className="lystes-orb-beamglow" aria-hidden />}
      {beam && <span className="lystes-orb-beam" aria-hidden />}
      {badge && <span className="lystes-orb-badge">{badge}</span>}

    </div>
  );
}

