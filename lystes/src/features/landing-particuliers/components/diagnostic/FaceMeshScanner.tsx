import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getJsxT } from "@lystes/i18n/jsx-locale";
import { useMouvementReduit } from "@lystes/hooks/useMouvementReduit";
import { neutraliserAlerteMediapipe, surDemandeMaillage, webglDisponible } from "@lystes/lib/mediapipe-sur";

// Generate face mesh tesselation connections (subset for performance)
const generateConnections = () => {
  const connections: [number, number][] = [];

  const faceOval = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];
  for (let i = 0; i < faceOval.length - 1; i++) connections.push([faceOval[i], faceOval[i + 1]]);

  const leftEyebrow = [276, 283, 282, 295, 285, 300, 293, 334, 296, 336];
  for (let i = 0; i < leftEyebrow.length - 1; i++) connections.push([leftEyebrow[i], leftEyebrow[i + 1]]);

  const rightEyebrow = [46, 53, 52, 65, 55, 70, 63, 105, 66, 107];
  for (let i = 0; i < rightEyebrow.length - 1; i++) connections.push([rightEyebrow[i], rightEyebrow[i + 1]]);

  const leftEye = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398, 362];
  for (let i = 0; i < leftEye.length - 1; i++) connections.push([leftEye[i], leftEye[i + 1]]);

  const rightEye = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246, 33];
  for (let i = 0; i < rightEye.length - 1; i++) connections.push([rightEye[i], rightEye[i + 1]]);

  const lipsOuter = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185, 61];
  for (let i = 0; i < lipsOuter.length - 1; i++) connections.push([lipsOuter[i], lipsOuter[i + 1]]);

  const lipsInner = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78];
  for (let i = 0; i < lipsInner.length - 1; i++) connections.push([lipsInner[i], lipsInner[i + 1]]);

  const nose = [168, 6, 197, 195, 5, 4, 1, 19, 94, 2];
  for (let i = 0; i < nose.length - 1; i++) connections.push([nose[i], nose[i + 1]]);

  const verticalLines = [
    [10, 151, 9, 8, 168, 6, 197, 195, 5, 4, 1, 19, 94, 2, 164, 0, 11, 12, 13, 14, 15, 16, 17, 18, 200, 199, 175, 152],
    [234, 93, 132, 58, 172, 136, 150, 149, 176, 148],
    [454, 323, 361, 288, 397, 365, 379, 378, 400, 377],
  ];
  verticalLines.forEach((line) => {
    for (let i = 0; i < line.length - 1; i++) connections.push([line[i], line[i + 1]]);
  });

  const cross: [number, number][] = [
    [234, 127], [127, 162], [162, 21], [21, 54],
    [454, 356], [356, 389], [389, 251], [251, 284],
    [93, 132], [132, 58], [58, 172],
    [323, 361], [361, 288], [288, 397],
    [10, 109], [109, 67], [67, 103], [103, 54],
    [10, 338], [338, 297], [297, 332], [332, 284],
  ];
  connections.push(...cross);

  return connections;
};

const CONNECTIONS = generateConnections();

interface FaceMeshScannerProps {
  imageUrl: string;
  className?: string;
  onFaceDetected?: (detected: boolean) => void;
}

interface Landmark { x: number; y: number; z: number }

declare global {
  interface Window {
    FaceMesh: any;
    FACEMESH_TESSELATION: [number, number][];
  }
}

export function FaceMeshScanner({ imageUrl, className = "", onFaceDetected }: FaceMeshScannerProps) {
  /* Textes traduits. Le libellé de chargement dit « Analyse en cours… » :
     l'accueil ne promet plus d'analyse « biométrique » (audit du 26/09/2026,
     PR 180). */
  const { i18n } = useTranslation();
  const tr = useMemo(() => getJsxT("home-blocks", i18n.language), [i18n.language]);
  /* « Réduire les animations » : une image fixe, le maillage posé, sans
     balayage ni boucle (audit du 27/09/2026). */
  const mouvementReduit = useMouvementReduit();
  const reduitRef = useRef(mouvementReduit);
  reduitRef.current = mouvementReduit;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const landmarksRef = useRef<Landmark[] | null>(null);
  const particlesRef = useRef<{ x: number; y: number; r: number; seed: number }[]>([]);
  const scanYRef = useRef(-0.3);
  const scanDirectionRef = useRef(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 300, height: 400 });
  /* MediaPipe (plusieurs Mo de wasm) ne se charge que lorsque le bloc
     approche de l'écran, et jamais sans WebGL : sans WebGL, son face_mesh.js
     ouvre une alert() au visiteur (13/10/2026). Le repli est le même canvas :
     la photo, le balayage et les particules, sans le maillage. */
  const [enVue, setEnVue] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setEnVue(true);
      return;
    }
    /* L'encart des étages (MiroirVisage) recopie ce canvas hors de l'écran :
       il demande le maillage sans attendre que le bloc soit en vue. */
    const lacher = surDemandeMaillage(() => setEnVue(true));
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setEnVue(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      lacher();
    };
  }, []);

  const scanSpeed = 0.008;

  useEffect(() => {
    if (!enVue) return;
    if (!webglDisponible()) {
      console.warn("[FaceMeshScanner] WebGL indisponible : MediaPipe n'est pas chargé, démo sans maillage.");
      setIsLoading(false);
      return;
    }
    neutraliserAlerteMediapipe();
    const loadScripts = async () => {
      try {
        const scripts = [
          "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js",
          "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
        ];
        await Promise.all(
          scripts.map(
            (src) =>
              new Promise<void>((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) return resolve();
                const s = document.createElement("script");
                s.src = src;
                s.async = true;
                s.onload = () => resolve();
                s.onerror = reject;
                document.head.appendChild(s);
              }),
          ),
        );
        setMediaLoaded(true);
      } catch (err) {
        console.error("MediaPipe load error:", err);
        setError(tr("Module de détection indisponible"));
        setIsLoading(false);
      }
    };
    loadScripts();
  }, [enVue]);

  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      const containerWidth = containerRef.current?.clientWidth || 300;
      const maxWidth = Math.min(containerWidth, 400);
      const maxHeight = 500;
      // Contain: respecte à la fois maxWidth et maxHeight pour voir l'image entière
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      const width = img.width * ratio;
      const height = img.height * ratio;
      setCanvasDimensions({ width, height });

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
          ctx.fillRect(0, 0, width, height);
        }
        const count = Math.max(160, Math.floor((width * height) / 1400));
        particlesRef.current = Array.from({ length: count }, (_, i) => ({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.6 + Math.random() * 1.2,
          seed: i * 13.37,
        }));
      }
      setImageLoaded(true);
    };
    img.onerror = () => {
      setError("Image non chargée");
      setIsLoading(false);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (!mediaLoaded || !imageLoaded || !imageRef.current || !window.FaceMesh) return;
    const init = async () => {
      try {
        const faceMesh = new window.FaceMesh({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });
        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.15,
          minTrackingConfidence: 0.15,
        });
        faceMesh.onResults((results: any) => {
          if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            landmarksRef.current = results.multiFaceLandmarks[0];
            onFaceDetected?.(true);
            // Image fixe : le maillage arrive après le premier dessin, on redessine une fois.
            if (reduitRef.current) animationRef.current = requestAnimationFrame(drawFrame);
          } else {
            landmarksRef.current = null;
            onFaceDetected?.(false);
          }
          setIsLoading(false);
        });
        await faceMesh.send({ image: imageRef.current });
      } catch (err) {
        console.error("FaceMesh error:", err);
        setError(tr("Erreur lors de l'analyse"));
        setIsLoading(false);
      }
    };
    init();
  }, [mediaLoaded, imageLoaded, onFaceDetected]);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imageRef.current;
    const landmarks = landmarksRef.current;
    if (!canvas || !ctx || !img) {
      animationRef.current = requestAnimationFrame(drawFrame);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (reduitRef.current) {
      /* Un seul dessin : le visage et son maillage, sans balayage. */
      if (landmarks && landmarks.length > 0) {
        const connections = window.FACEMESH_TESSELATION || CONNECTIONS;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = 0.8;
        for (const c of connections) {
          const a = landmarks[c[0]];
          const b = landmarks[c[1]];
          if (!a || !b) continue;
          ctx.beginPath();
          ctx.moveTo(a.x * canvas.width, a.y * canvas.height);
          ctx.lineTo(b.x * canvas.width, b.y * canvas.height);
          ctx.stroke();
        }
      }
      return;
    }

    scanYRef.current += scanSpeed * scanDirectionRef.current;
    if (scanYRef.current > 1.3) scanDirectionRef.current = -1;
    else if (scanYRef.current < -0.3) scanDirectionRef.current = 1;

    const scanLineY = scanYRef.current * canvas.height;
    const direction = scanDirectionRef.current;

    if (scanYRef.current >= 0 && scanYRef.current <= 1) {
      const gradient = ctx.createLinearGradient(0, scanLineY - 20, 0, scanLineY + 20);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0)");
      gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.3)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.9)");
      gradient.addColorStop(0.6, "rgba(255, 255, 255, 0.3)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanLineY - 20, canvas.width, 40);

      ctx.beginPath();
      ctx.moveTo(0, scanLineY);
      ctx.lineTo(canvas.width, scanLineY);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    const particles = particlesRef.current;
    if (particles.length) {
      const height = canvas.height;
      const scanBandWidth = height * 0.45;
      const t = performance.now();
      for (const p of particles) {
        const distance = direction === 1 ? scanLineY - p.y : p.y - scanLineY;
        if (distance > -10 && distance < scanBandWidth) {
          let alpha = 1 - distance / scanBandWidth;
          alpha = Math.pow(Math.max(0, alpha), 1.6);
          const flicker = 0.6 + 0.4 * Math.sin(t * 0.004 + p.seed);
          const a = alpha * 0.35 * flicker;
          if (a > 0.01) {
            ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    if (landmarks && landmarks.length > 0) {
      const width = canvas.width;
      const height = canvas.height;
      const scanBandWidth = height * 0.4;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      const connections = window.FACEMESH_TESSELATION || CONNECTIONS;
      for (const c of connections) {
        const a = landmarks[c[0]];
        const b = landmarks[c[1]];
        if (!a || !b) continue;
        const x1 = a.x * width, y1 = a.y * height, x2 = b.x * width, y2 = b.y * height;
        const segY = (y1 + y2) / 2;
        const distance = direction === 1 ? scanLineY - segY : segY - scanLineY;
        if (distance > -10 && distance < scanBandWidth) {
          let alpha = 1 - distance / scanBandWidth;
          alpha = Math.pow(Math.max(0, alpha), 1.5);
          if (alpha > 0.02) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
            if (alpha > 0.5) {
              ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
              ctx.beginPath();
              ctx.arc(x1, y1, 1.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
    }

    animationRef.current = requestAnimationFrame(drawFrame);
  }, []);

  // Relancé si la préférence change pendant la visite : l'animation reprend, ou s'arrête.
  useEffect(() => {
    if (!imageLoaded) return;
    animationRef.current = requestAnimationFrame(drawFrame);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [imageLoaded, drawFrame, mouvementReduit]);

  return (
    <div
      ref={containerRef}
      className={`relative mx-auto ${className}`}
      style={{ width: "100%", maxWidth: "400px" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-auto rounded-3xl block mx-auto"
        style={{
          width: canvasDimensions.width,
          height: canvasDimensions.height,
          maxWidth: "100%",
        }}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            <p className="text-white/80 text-sm font-mono tracking-wider uppercase">{tr("Analyse en cours…")}</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 rounded-3xl overflow-hidden">
          <img src={imageUrl} alt="Photo" className="w-full h-full object-cover rounded-3xl" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
    </div>
  );
}
