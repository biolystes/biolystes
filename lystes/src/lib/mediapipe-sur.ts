/**
 * Garde-fous autour des anciens modules MediaPipe chargés depuis jsDelivr
 * (`@mediapipe/face_mesh`, `@mediapipe/selfie_segmentation`…).
 *
 * Origine (13/10/2026) : dans un navigateur sans WebGL (Chromium sans GPU,
 * accélération matérielle coupée, carte graphique sur liste noire), le fichier
 * `face_mesh.js` de MediaPipe appelle lui-même
 * `alert("Failed to create WebGL canvas context when passing video frame.")`
 * au premier `send()`. Le visiteur voyait cette boîte de dialogue sur l'accueil.
 *
 * Deux protections :
 * 1. `webglDisponible()` : on ne charge pas MediaPipe sans WebGL, le composant
 *    affiche son repli.
 * 2. `neutraliserAlerteMediapipe()` : si MediaPipe appelle quand même `alert`
 *    (contexte perdu entre le test et l'appel), le message part en console.
 */

let webglEnCache: boolean | null = null;

/** Même test que MediaPipe : un contexte webgl2, sinon webgl, sur un canvas du DOM. */
export function webglDisponible(): boolean {
  if (webglEnCache !== null) return webglEnCache;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    webglEnCache = !!gl;
    // Libère le contexte de test : le navigateur en limite le nombre.
    (gl as WebGLRenderingContext | null)?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    webglEnCache = false;
  }
  return webglEnCache;
}

let alerteNeutralisee = false;

/**
 * Remplace `window.alert` une seule fois : les messages venant de MediaPipe
 * (WebGL, graphe, wasm) vont en console, tous les autres passent inchangés.
 */
export function neutraliserAlerteMediapipe(): void {
  if (alerteNeutralisee || typeof window === "undefined") return;
  alerteNeutralisee = true;
  const alerteNative = window.alert.bind(window);
  window.alert = (message?: unknown) => {
    const texte = String(message ?? "");
    if (/webgl|mediapipe|graph|wasm/i.test(texte)) {
      console.error("[MediaPipe] alerte interceptée :", texte);
      return;
    }
    alerteNative(message as string);
  };
}
