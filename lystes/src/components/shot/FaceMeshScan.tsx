import { useEffect, useMemo, useRef, useState } from "react";
import { FaceLandmarker } from "@mediapipe/tasks-vision";
import { useFaceLandmarks } from "@lystes/features/landing-particuliers/hooks/useFaceLandmarks";

interface Props {
  photo: string;
  /** Taille du carré en px (par défaut 220). */
  size?: number;
  /** Rendu figé (résultat) plutôt qu'animation de scan. */
  static?: boolean;
  /**
   * Appelé une seule fois, à la fin du premier cycle complet. Permet à l'appelant
   * de n'afficher le résultat qu'une fois l'animation allée à son terme.
   */
  onCycleEnd?: () => void;
}

type RegionKey = "forehead" | "cheek" | "nose" | "chin";

/** Étapes du zoom : zone analysée, libellé affiché, facteur d'agrandissement. */
const STEPS: Array<{ key: RegionKey; label: string; scale: number }> = [
  { key: "forehead", label: "Zone T", scale: 2.4 },
  { key: "cheek", label: "Joue", scale: 2.7 },
  { key: "nose", label: "Pores", scale: 3.0 },
  { key: "chin", label: "Teint", scale: 2.6 },
];

/** Positions de repli quand aucun visage n'est détecté (cadrage selfie standard). */
const FALLBACK_REGIONS: Record<RegionKey, { x: number; y: number }> = {
  forehead: { x: 0.5, y: 0.24 },
  cheek: { x: 0.4, y: 0.54 },
  nose: { x: 0.5, y: 0.5 },
  chin: { x: 0.5, y: 0.72 },
};

const TICK_COUNT = 16;

/* Découpage du cycle, en ms. PASS_MS vaut une passe à la vitesse exacte du
   scanner Shopify/WooCommerce (0,008 par frame sur une course de 1,6, soit 200
   frames à 60 fps). Quatre passes : descente, remontée, descente, remontée, le
   maillage étant redessiné à chacune. Ces constantes sont les seules à toucher
   pour resserrer ou étirer l'animation. */
const PASS_MS = 3335;
const SWEEP_PASSES = 4;
const SWEEP_MS = PASS_MS * SWEEP_PASSES;
const FADE_MS = 450;
const STEP_ENTER_MS = 600;
const STEP_HOLD_MS = 900;
const STEP_MS = STEP_ENTER_MS + STEP_HOLD_MS;
const OUT_MS = 600;
const CYCLE_MS = SWEEP_MS + FADE_MS + STEPS.length * STEP_MS + OUT_MS;

/** Référence de taille du scanner d'origine : sert à mettre les épaisseurs à l'échelle. */
const REF_SIZE = 400;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Générateur pseudo-aléatoire déterministe : un champ de particules stable entre deux rendus. */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

interface View {
  x: number;
  y: number;
  s: number;
}

const FULL_VIEW: View = { x: 0.5, y: 0.5, s: 1 };

const lerpView = (a: View, b: View, t: number): View => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  s: a.s + (b.s - a.s) * t,
});

/**
 * Maillage biométrique animé superposé au selfie — rendu visuel de l'analyse
 * du visage pendant le diagnostic.
 *
 * Le balayage reprend celui du scanner embarqué sur Shopify/WooCommerce
 * (`components/agent/FaceMeshScanner`) : rendu canvas, voile sombre, faisceau
 * en aller-retour, particules et maillage révélés dans une traîne dégressive.
 * S'y ajoute une phase de zoom successif sur les zones analysées.
 *
 * Tout est peint dans le canvas, y compris le zoom (recadrage à la source
 * plutôt que transformation CSS) : l'image reste nette même agrandie 3 fois.
 */
export function FaceMeshScan({
  photo,
  size = 220,
  static: isStatic = false,
  onCycleEnd,
}: Props) {
  const face = useFaceLandmarks(photo);
  /** La détection a rendu son verdict : visage trouvé, absent, ou en erreur. */
  const detectionSettled =
    face.status === "ready" || face.status === "no-face" || face.status === "error";
  /**
   * Délai de garde. Sans lui, une détection qui ne revient jamais (modèle non
   * téléchargé, onglet en arrière-plan) bloquerait le cycle, donc `onCycleEnd`,
   * donc l'affichage du rapport. On part sans maillage plutôt que de rester figé.
   */
  const [detectionTimedOut, setDetectionTimedOut] = useState(false);
  useEffect(() => {
    if (isStatic) return;
    setDetectionTimedOut(false);
    const id = setTimeout(() => setDetectionTimedOut(true), 8000);
    return () => clearTimeout(id);
  }, [isStatic, photo]);
  const canStart = detectionSettled || detectionTimedOut;

  /* Gardé dans une ref : un changement de callback ne doit pas relancer le cycle. */
  const onCycleEndRef = useRef(onCycleEnd);
  onCycleEndRef.current = onCycleEnd;
  const cycleEndedRef = useRef(false);
  const startRef = useRef(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const bracketsRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const labelTextRef = useRef<HTMLSpanElement>(null);
  const ticksRef = useRef<HTMLDivElement>(null);
  /** Dernier état d'overlay appliqué : évite de réécrire le DOM à chaque frame. */
  const overlayStateRef = useRef({ step: -1, visible: false, ticks: -1, brackets: false });

  /**
   * Landmarks reprojetés dans le repère du carré affiché. La photo est cadrée
   * en « cover » : sans tenir compte du recadrage, maillage et zooms se
   * décalent du visage.
   */
  const projected = useMemo(() => {
    if (face.status !== "ready") return null;
    const { landmarks, imageSize } = face.data;
    if (!landmarks?.length || !imageSize?.width || !imageSize?.height) return null;

    const { width: iw, height: ih } = imageSize;
    const k = Math.max(1 / iw, 1 / ih); // carré de côté 1
    const ox = (1 - iw * k) / 2;
    const oy = (1 - ih * k) / 2;
    const toFrac = (p: { x: number; y: number }) => ({
      x: p.x * iw * k + ox,
      y: p.y * ih * k + oy,
    });

    const pts = landmarks.map(toFrac);
    const tess = FaceLandmarker.FACE_LANDMARKS_TESSELATION ?? [];
    const edges = tess
      .map((c: { start: number; end: number }) => [pts[c.start], pts[c.end]] as const)
      .filter(([a, b]) => a && b);

    const avg = (ids: number[]) => {
      let x = 0;
      let y = 0;
      for (const i of ids) {
        x += landmarks[i].x;
        y += landmarks[i].y;
      }
      return { x: x / ids.length, y: y / ids.length };
    };
    const regions: Record<RegionKey, { x: number; y: number }> = {
      forehead: toFrac({ x: landmarks[10].x, y: Math.max(0.05, landmarks[10].y + 0.03) }),
      cheek: toFrac(avg([50, 101, 118])),
      nose: toFrac({ x: landmarks[1].x, y: landmarks[1].y }),
      chin: toFrac({ x: landmarks[152].x, y: Math.min(0.97, landmarks[152].y - 0.03) }),
    };

    return { edges, regions };
  }, [face]);

  /**
   * Charge la photo une fois, pour pouvoir la peindre dans le canvas.
   * On s'appuie sur `onload` et non sur `decode()` : cette promesse peut rester
   * en attente sur un onglet masqué, ce qui laissait le cadre vide au retour.
   */
  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!cancelled) imgRef.current = img;
    };
    img.onerror = () => {
      // Sans CORS l'image reste peignable, seul l'export du canvas serait bloqué.
      if (cancelled) return;
      const plain = new Image();
      plain.onload = () => {
        if (!cancelled) imgRef.current = plain;
      };
      plain.src = photo;
    };
    img.src = photo;
    return () => {
      cancelled = true;
      imgRef.current = null;
    };
  }, [photo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const regions = projected?.regions ?? FALLBACK_REGIONS;
    const scaleUnit = size / REF_SIZE;

    // Champ de particules, en coordonnées du carré (0-1), stable d'un rendu à l'autre.
    const rand = seededRandom(1337);
    const particles = Array.from(
      { length: Math.max(120, Math.round((size * size) / 320)) },
      (_, i) => ({
        x: rand(),
        y: rand(),
        r: (0.6 + rand() * 1.2) * scaleUnit * 1.6,
        seed: i * 13.37,
      }),
    );

    /**
     * Peint la photo recadrée selon `view`. Le zoom est fait à la source
     * (`drawImage` avec rectangle source) et non par transformation CSS :
     * l'image reste à pleine résolution même agrandie.
     */
    const drawPhoto = (view: View) => {
      const img = imgRef.current;
      if (!img) return false;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!iw || !ih) return false;

      const side = Math.min(iw, ih); // côté du carré « cover » dans l'image source
      const ox = (iw - side) / 2;
      const oy = (ih - side) / 2;
      const span = 1 / view.s;
      const fx = clamp(view.x - span / 2, 0, 1 - span);
      const fy = clamp(view.y - span / 2, 0, 1 - span);

      ctx.drawImage(
        img,
        ox + fx * side,
        oy + fy * side,
        side * span,
        side * span,
        0,
        0,
        size,
        size,
      );
      return true;
    };

    /** Faisceau : dégradé large puis trait net, comme sur le scanner Shopify/Woo. */
    const drawBeam = (y: number, alpha: number) => {
      const half = 20 * scaleUnit;
      const g = ctx.createLinearGradient(0, y - half, 0, y + half);
      g.addColorStop(0, "rgba(255,255,255,0)");
      g.addColorStop(0.4, `rgba(255,255,255,${0.3 * alpha})`);
      g.addColorStop(0.5, `rgba(255,255,255,${0.9 * alpha})`);
      g.addColorStop(0.6, `rgba(255,255,255,${0.3 * alpha})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, y - half, size, half * 2);

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.strokeStyle = `rgba(255,255,255,${0.95 * alpha})`;
      ctx.lineWidth = 2 * scaleUnit;
      ctx.shadowColor = `rgba(255,255,255,${0.8 * alpha})`;
      ctx.shadowBlur = 15 * scaleUnit;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    /** Traîne : plus un élément est loin derrière le faisceau, plus il s'efface. */
    const trailAlpha = (behind: number, band: number, power: number) => {
      if (behind < -10 * scaleUnit || behind > band) return 0;
      return Math.pow(Math.max(0, 1 - behind / band), power);
    };

    const drawParticles = (beamY: number, dir: number, alpha: number, t: number) => {
      const band = size * 0.45;
      for (const p of particles) {
        const py = p.y * size;
        const behind = dir === 1 ? beamY - py : py - beamY;
        const a = trailAlpha(behind, band, 1.6) * 0.35 * alpha * (0.6 + 0.4 * Math.sin(t * 0.004 + p.seed));
        if (a > 0.01) {
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath();
          ctx.arc(p.x * size, py, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const drawMesh = (beamY: number, dir: number, alpha: number) => {
      const edges = projected?.edges;
      if (!edges?.length) return;
      const band = size * 0.4;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = 0.8 * scaleUnit * 1.6;
      for (const [a, b] of edges) {
        const x1 = a.x * size;
        const y1 = a.y * size;
        const x2 = b.x * size;
        const y2 = b.y * size;
        const behind = dir === 1 ? beamY - (y1 + y2) / 2 : (y1 + y2) / 2 - beamY;
        const al = trailAlpha(behind, band, 1.5) * alpha;
        if (al <= 0.02) continue;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(255,255,255,${al * 0.85})`;
        ctx.stroke();
        if (al > 0.5) {
          ctx.fillStyle = `rgba(255,255,255,${al})`;
          ctx.beginPath();
          ctx.arc(x1, y1, 1.2 * scaleUnit * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    /** Rendu figé : photo + maillage complet, sans balayage. */
    const drawStatic = () => {
      if (!drawPhoto(FULL_VIEW)) return;
      const edges = projected?.edges;
      if (!edges?.length) return;
      ctx.lineWidth = 0.8 * scaleUnit * 1.6;
      ctx.strokeStyle = "rgba(255,255,255,0.45)";
      for (const [a, b] of edges) {
        ctx.beginPath();
        ctx.moveTo(a.x * size, a.y * size);
        ctx.lineTo(b.x * size, b.y * size);
        ctx.stroke();
      }
    };

    /** Applique les overlays DOM, uniquement quand leur état change. */
    const syncOverlay = (step: number, visible: boolean, ticks: number, brackets: boolean) => {
      const prev = overlayStateRef.current;
      if (prev.brackets !== brackets) {
        bracketsRef.current?.style.setProperty("opacity", brackets ? "1" : "0");
        prev.brackets = brackets;
      }
      if (prev.step !== step && step >= 0) {
        if (labelTextRef.current) labelTextRef.current.textContent = STEPS[step].label;
        prev.step = step;
      }
      if (prev.visible !== visible) {
        const o = visible ? "1" : "0";
        labelRef.current?.style.setProperty("opacity", o);
        reticleRef.current?.style.setProperty("opacity", o);
        prev.visible = visible;
      }
      if (prev.ticks !== ticks) {
        const nodes = ticksRef.current?.children;
        if (nodes) {
          for (let i = 0; i < nodes.length; i++) {
            nodes[i].classList.toggle("bg-white", i < ticks);
          }
        }
        prev.ticks = ticks;
      }
    };

    if (isStatic) {
      // La photo peut arriver après ce passage : on retente jusqu'à ce qu'elle soit là.
      let raf = 0;
      const tryDraw = () => {
        if (imgRef.current) drawStatic();
        else raf = requestAnimationFrame(tryDraw);
      };
      tryDraw();
      return () => cancelAnimationFrame(raf);
    }

    let raf = 0;

    /* Tant que MediaPipe n'a pas rendu ses points, on ne lance pas le cycle :
       sinon la première descente se joue sans maillage et seule la remontée en
       profite. On patiente sur un état vivant mais sans faisceau. */
    const drawWaiting = (now: number) => {
      if (!drawPhoto(FULL_VIEW)) return;
      for (const p of particles) {
        const a = 0.18 * (0.5 + 0.5 * Math.sin(now * 0.002 + p.seed));
        if (a > 0.01) {
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath();
          ctx.arc(p.x * size, p.y * size, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      syncOverlay(-1, false, 0, true);
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      if (!canStart) {
        ctx.clearRect(0, 0, size, size);
        drawWaiting(now);
        return;
      }
      /* L'origine du temps vit dans une ref : l'arrivée des landmarks relance cet
         effet, et repartir de zéro rallongerait l'attente d'un cycle entier. */
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;

      if (!cycleEndedRef.current && elapsed >= CYCLE_MS) {
        cycleEndedRef.current = true;
        onCycleEndRef.current?.();
      }

      const t = elapsed % CYCLE_MS;

      ctx.clearRect(0, 0, size, size);

      if (t < SWEEP_MS + FADE_MS) {
        // Phase 1 : balayage en aller-retour, puis fondu de sortie.
        const fading = t > SWEEP_MS;
        const alpha = fading ? 1 - (t - SWEEP_MS) / FADE_MS : 1;

        /* Pas de voile sombre : le scanner d'origine en pose un à 45 %, mais il
           noircit trop la photo ici. La photo reste à nu sous le balayage. */
        if (!drawPhoto(FULL_VIEW)) return;

        /* Une passe par tranche de PASS_MS, en alternant le sens. Le maillage est
           redessiné à chaque passe, pas seulement à la remontée. */
        const pass = Math.min(Math.floor(t / PASS_MS), SWEEP_PASSES - 1);
        const local = (t - pass * PASS_MS) / PASS_MS;
        const down = pass % 2 === 0;
        const p = down ? local : 1 - local;
        const beamPos = -0.3 + p * 1.6; // sort du cadre en haut et en bas, comme la référence
        const beamY = beamPos * size;
        const dir = down ? 1 : -1;

        drawParticles(beamY, dir, alpha, now);
        drawMesh(beamY, dir, alpha);
        if (!fading && beamPos >= 0 && beamPos <= 1) drawBeam(beamY, alpha);

        syncOverlay(-1, false, 0, true);
        return;
      }

      // Phase 2 : zoom successif sur les zones analysées.
      const tz = t - SWEEP_MS - FADE_MS;
      const stepIndex = Math.min(Math.floor(tz / STEP_MS), STEPS.length - 1);
      const inSteps = tz < STEPS.length * STEP_MS;

      if (inSteps) {
        const local = tz - stepIndex * STEP_MS;
        const step = STEPS[stepIndex];
        const target: View = { ...regions[step.key], s: step.scale };
        const from =
          stepIndex === 0
            ? FULL_VIEW
            : { ...regions[STEPS[stepIndex - 1].key], s: STEPS[stepIndex - 1].scale };

        const entering = local < STEP_ENTER_MS;
        const view = entering
          ? lerpView(from, target, easeInOut(local / STEP_ENTER_MS))
          : target;
        if (!drawPhoto(view)) return;

        const holdProgress = entering ? 0 : (local - STEP_ENTER_MS) / STEP_HOLD_MS;
        syncOverlay(
          stepIndex,
          !entering,
          entering ? 0 : Math.round(holdProgress * TICK_COUNT),
          true,
        );
        return;
      }

      // Phase 3 : retour au cadrage complet.
      const out = (tz - STEPS.length * STEP_MS) / OUT_MS;
      const last = STEPS[STEPS.length - 1];
      const from: View = { ...regions[last.key], s: last.scale };
      if (!drawPhoto(lerpView(from, FULL_VIEW, easeInOut(clamp(out, 0, 1))))) return;
      syncOverlay(-1, false, 0, false);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [isStatic, projected, size, photo, canStart]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-neutral-100 shrink-0"
      style={{ width: size, height: size }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="block"
        aria-hidden="true"
      />

      {!isStatic && (
        <>
          {/* Coins de cadrage */}
          <div
            ref={bracketsRef}
            className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
          >
            <span className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/85" />
            <span className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/85" />
            <span className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/85" />
            <span className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/85" />
          </div>

          {/* Libellé de la zone en cours d'analyse */}
          <div
            ref={labelRef}
            className="absolute top-1/2 left-[9%] -translate-y-1/2 opacity-0 transition-opacity duration-300 pointer-events-none"
          >
            <span
              ref={labelTextRef}
              className="text-white text-[13px] pb-1.5 border-b border-white/40 inline-block"
            >
              Zone T
            </span>
            <div ref={ticksRef} className="flex gap-[2px] mt-2">
              {Array.from({ length: TICK_COUNT }, (_, i) => (
                <i key={i} className="w-[2px] h-2.5 bg-white/35" />
              ))}
            </div>
          </div>

          {/* Réticule de mesure — centré, puisque le zoom amène la zone analysée
              au centre du cadre. */}
          <div
            ref={reticleRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[16%] aspect-square opacity-0 transition-opacity duration-300 pointer-events-none"
          >
            <div className="absolute inset-0 border border-white/90" />
            <span className="absolute -top-px left-1/2 -translate-x-1/2 w-px h-2 bg-white/90" />
            <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-px h-2 bg-white/90" />
            <span className="absolute -left-px top-1/2 -translate-y-1/2 h-px w-2 bg-white/90" />
            <span className="absolute -right-px top-1/2 -translate-y-1/2 h-px w-2 bg-white/90" />
          </div>
        </>
      )}
    </div>
  );
}
