import { useEffect, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
  type NormalizedLandmark,
} from "@mediapipe/tasks-vision";

export type FaceData = {
  landmarks: NormalizedLandmark[];
  bbox: { x: number; y: number; w: number; h: number };
  imageSize: { width: number; height: number };
};

export type FaceLandmarksState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: FaceData }
  | { status: "no-face" }
  | { status: "error"; message: string };

const WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

let landmarkerPromise: Promise<FaceLandmarker> | null = null;

async function createLandmarker(delegate: "GPU" | "CPU"): Promise<FaceLandmarker> {
  const fileset = await FilesetResolver.forVisionTasks(WASM_BASE);
  return await FaceLandmarker.createFromOptions(fileset, {
    baseOptions: {
      modelAssetPath: MODEL_URL,
      delegate,
    },
    runningMode: "IMAGE",
    numFaces: 1,
    // Seuils très permissifs : on préfère détecter un visage approximatif
    // que de laisser le user en "Visage non détecté" sur une selfie correcte.
    minFaceDetectionConfidence: 0.05,
    minFacePresenceConfidence: 0.05,
    minTrackingConfidence: 0.05,
    outputFaceBlendshapes: false,
    outputFacialTransformationMatrixes: false,
  });
}

// Crée un canvas avec brightness/contrast boostés pour aider la détection
// quand la photo est sombre, compressée ou avec peu de contraste.
function brightenedCanvas(src: HTMLImageElement | HTMLCanvasElement): HTMLCanvasElement {
  const c = document.createElement("canvas");
  const w = src instanceof HTMLImageElement ? src.naturalWidth : src.width;
  const h = src instanceof HTMLImageElement ? src.naturalHeight : src.height;
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  // Filtre canvas : brightness 1.25 + contraste 1.15 + saturation 1.1
  ctx.filter = "brightness(1.25) contrast(1.15) saturate(1.1)";
  ctx.drawImage(src, 0, 0);
  return c;
}

// Canvas haute résolution upscalé (utile si la photo source fait < 400px)
function upscaledCanvas(img: HTMLImageElement, target = 720): HTMLCanvasElement {
  const c = document.createElement("canvas");
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  if (Math.max(w, h) >= target) {
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx?.drawImage(img, 0, 0);
    return c;
  }
  const ratio = target / Math.max(w, h);
  c.width = Math.round(w * ratio);
  c.height = Math.round(h * ratio);
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

// Canvas avec padding ajouté autour (pour photos où le visage remplit 90%+ du cadre).
// MediaPipe attend un visage qui occupe ~30-60% du cadre — sans ça il échoue parfois
// à trouver le contour facial. On rajoute du padding (couleur tirée des bords de l'image).
function paddedCanvas(img: HTMLImageElement, padRatio = 0.4): HTMLCanvasElement {
  const c = document.createElement("canvas");
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const pad = Math.round(Math.max(w, h) * padRatio);
  c.width = w + 2 * pad;
  c.height = h + 2 * pad;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  // Échantillonne la couleur d'un coin pour le padding (souvent texture mur/coussin)
  const tmp = document.createElement("canvas");
  tmp.width = w;
  tmp.height = h;
  const tctx = tmp.getContext("2d");
  if (tctx) {
    tctx.drawImage(img, 0, 0);
    try {
      const corner = tctx.getImageData(0, 0, 1, 1).data;
      ctx.fillStyle = `rgb(${corner[0]}, ${corner[1]}, ${corner[2]})`;
    } catch {
      ctx.fillStyle = "#222";
    }
  } else {
    ctx.fillStyle = "#222";
  }
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(img, pad, pad);
  return c;
}

async function getLandmarker(): Promise<FaceLandmarker> {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      try {
        return await createLandmarker("GPU");
      } catch (err) {
        console.warn("[useFaceLandmarks] GPU delegate failed, falling back to CPU", err);
        return await createLandmarker("CPU");
      }
    })().catch((err) => {
      landmarkerPromise = null;
      throw err;
    });
  }
  return landmarkerPromise;
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  // 1) Tente avec CORS (nécessaire pour passer à MediaPipe sans canvas tainted)
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return img;
  } catch (e) {
    console.warn("[useFaceLandmarks] CORS image load failed, retrying without CORS", e);
  }
  // 2) Fallback sans CORS — MediaPipe accepte aussi un HTMLImageElement non-tainted
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  await img.decode();
  return img;
}

export function useFaceLandmarks(photoUrl: string | null): FaceLandmarksState {
  const [state, setState] = useState<FaceLandmarksState>({ status: "idle" });

  useEffect(() => {
    if (!photoUrl) {
      setState({ status: "idle" });
      return;
    }
    let cancelled = false;
    setState({ status: "loading" });

    (async () => {
      try {
        const landmarker = await getLandmarker();
        const img = await loadImage(photoUrl);
        if (cancelled) return;

        // Cascade de tentatives. Chaque attempt contient :
        //   - la source à passer à MediaPipe
        //   - une fonction "remap" qui convertit un landmark (x,y) normalisé de la
        //     source vers les coords normalisées de l'IMAGE ORIGINALE (sinon les
        //     overlays seront décalés).
        const W = img.naturalWidth;
        const H = img.naturalHeight;
        type Attempt = {
          name: string;
          source: HTMLImageElement | HTMLCanvasElement;
          remap: (x: number, y: number) => { x: number; y: number };
        };
        const identity = (x: number, y: number) => ({ x, y });
        const padRemap = (padPx: number, srcW: number, srcH: number) =>
          (x: number, y: number) => ({
            x: (x * srcW - padPx) / W,
            y: (y * srcH - padPx) / H,
          });

        const attempts: Attempt[] = [{ name: "plain", source: img, remap: identity }];
        try {
          const c = document.createElement("canvas");
          c.width = W;
          c.height = H;
          c.getContext("2d")?.drawImage(img, 0, 0);
          attempts.push({ name: "canvas", source: c, remap: identity });
        } catch {}
        attempts.push({ name: "upscaled", source: upscaledCanvas(img, 720), remap: identity });
        {
          const c = paddedCanvas(img, 0.35);
          const padPx = Math.round(Math.max(W, H) * 0.35);
          attempts.push({ name: "padded", source: c, remap: padRemap(padPx, c.width, c.height) });
        }
        {
          const c = paddedCanvas(img, 0.7);
          const padPx = Math.round(Math.max(W, H) * 0.7);
          attempts.push({ name: "padded-large", source: c, remap: padRemap(padPx, c.width, c.height) });
        }
        attempts.push({ name: "brightened", source: brightenedCanvas(img), remap: identity });
        {
          const padded = paddedCanvas(img, 0.4);
          const padPx = Math.round(Math.max(W, H) * 0.4);
          const c = brightenedCanvas(padded);
          attempts.push({ name: "padded-brightened", source: c, remap: padRemap(padPx, c.width, c.height) });
        }

        let result: any = null;
        let usedAttempt: Attempt | null = null;
        for (const a of attempts) {
          if (cancelled) return;
          try {
            const r = landmarker.detect(a.source);
            if (r.faceLandmarks?.length) {
              result = r;
              usedAttempt = a;
              break;
            }
            console.info(`[useFaceLandmarks] no face on ${a.name}, trying next`);
          } catch (e) {
            console.warn(`[useFaceLandmarks] detect failed on ${a.name}`, e);
          }
        }
        if (cancelled) return;

        if (!result || !result.faceLandmarks?.length || !usedAttempt) {
          console.info("[useFaceLandmarks] no face detected after all attempts", {
            w: W,
            h: H,
          });
          setState({ status: "no-face" });
          return;
        }
        console.info(`[useFaceLandmarks] face detected via ${usedAttempt.name}`);

        // Reconvertit les landmarks dans les coords normalisées de l'image originale
        const remap = usedAttempt.remap;
        result.faceLandmarks[0] = result.faceLandmarks[0].map((l: any) => {
          const p = remap(l.x, l.y);
          return { x: p.x, y: p.y, z: l.z };
        });

        const landmarks = result.faceLandmarks[0];
        let minX = 1, minY = 1, maxX = 0, maxY = 0;
        for (const l of landmarks) {
          if (l.x < minX) minX = l.x;
          if (l.x > maxX) maxX = l.x;
          if (l.y < minY) minY = l.y;
          if (l.y > maxY) maxY = l.y;
        }

        setState({
          status: "ready",
          data: {
            landmarks,
            bbox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY },
            imageSize: { width: img.naturalWidth, height: img.naturalHeight },
          },
        });
      } catch (e) {
        if (cancelled) return;
        console.error("[useFaceLandmarks] detection error", e);
        const message = e instanceof Error ? e.message : "Erreur de détection faciale";
        setState({ status: "error", message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [photoUrl]);

  return state;
}
