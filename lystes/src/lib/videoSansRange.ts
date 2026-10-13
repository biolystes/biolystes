import { useEffect, useState, type RefObject } from "react";

/**
 * Vidéos d'arrière-plan lisibles sur iPhone.
 *
 * 13/10/2026 (JP, iPhone) : sur lystes.ai et biolystes.com, les vidéos de
 * fond restaient sur leur affiche. Les fichiers de public/ sont servis sans
 * requêtes partielles : « Range: bytes=0-1 » reçoit 200 et le fichier entier,
 * jamais 206. Safari sur iPhone exige 206 pour lire une vidéo. Chrome et
 * Safari sur ordinateur s'en passent, d'où un défaut visible seulement sur
 * téléphone. Les fichiers servis par https://lystes.ai/__l5e/ répondent 206 et ne sont pas
 * concernés.
 *
 * Correctif : une vidéo de public/ est téléchargée en entier puis lue depuis
 * une adresse blob:, qui n'a pas besoin du serveur. Au-delà de 8 Mo, le
 * téléchargement entier pèserait trop sur le téléphone : la vidéo est lue
 * directement, comme avant (elle reste alors sur son affiche sur iPhone,
 * il faut la réencoder plus légère ou la servir par https://lystes.ai/__l5e/).
 */

export const TAILLE_MAX_BLOB = 8 * 1024 * 1024;

/** Vrai pour un fichier de public/ du site courant, servi sans Range. */
export function servieSansRange(src: string | undefined | null): boolean {
  if (!src || typeof window === "undefined") return false;
  if (/^(blob|data):/i.test(src)) return false;
  let u: URL;
  try {
    u = new URL(src, window.location.href);
  } catch {
    return false;
  }
  if (u.origin !== window.location.origin) return false;
  if (u.pathname.startsWith("https://lystes.ai/__l5e/")) return false;
  return /\.(mp4|mov|m4v|webm)$/i.test(u.pathname);
}

/* Une adresse blob: par fichier, partagée par toutes les vidéos de la page
   et gardée le temps de la visite : la même vidéo (video2.mp4, exp-1.mp4…)
   n'est téléchargée qu'une fois. */
const cache = new Map<string, Promise<string>>();

function versBlob(src: string): Promise<string> {
  let p = cache.get(src);
  if (!p) {
    p = fetch(src)
      .then(async (r) => {
        if (!r.ok) throw new Error(String(r.status));
        const taille = Number(r.headers.get("content-length") || 0);
        if (taille > TAILLE_MAX_BLOB) {
          r.body?.cancel().catch(() => {});
          return src;
        }
        const b = await r.blob();
        if (b.size > TAILLE_MAX_BLOB) return src;
        return URL.createObjectURL(b);
      })
      .catch(() => {
        cache.delete(src);
        return src;
      });
    cache.set(src, p);
  }
  return p;
}

/**
 * Source à donner à la balise vidéo. Pour un fichier servi sans Range,
 * `undefined` pendant le téléchargement (l'affiche reste visible), puis
 * l'adresse blob:. En cas d'échec, l'adresse d'origine. Les autres sources
 * passent telles quelles. `actif` à faux retarde le téléchargement (vidéo
 * chargée à l'approche de l'écran).
 */
export function useSourceLisible(src: string | undefined, actif = true): string | undefined {
  const sansRange = servieSansRange(src);
  const [lue, setLue] = useState<{ de: string; url: string } | null>(null);

  useEffect(() => {
    if (!src || !sansRange || !actif) return;
    let fini = false;
    versBlob(src).then((url) => {
      if (!fini) setLue({ de: src, url });
    });
    return () => {
      fini = true;
    };
  }, [src, sansRange, actif]);

  if (!src || !sansRange) return src;
  return lue && lue.de === src ? lue.url : undefined;
}

/** Pose l'attribut `muted` dans le DOM : React ne pose que la propriété, et
 *  iOS peut alors refuser la lecture automatique. À appeler dans le ref. */
export function poserMuet(v: HTMLVideoElement | null) {
  if (!v) return;
  v.muted = true;
  v.defaultMuted = true;
  v.setAttribute("muted", "");
}

/**
 * Relance une lecture refusée : quand la vidéo est prête, au retour sur
 * l'onglet et au premier toucher. Le mode économie d'énergie d'iOS bloque
 * toute lecture automatique : seul le toucher la relance.
 * `enVue` (facultatif) : ne relance pas une vidéo mise en pause hors écran.
 */
export function useRelanceLecture(
  ref: RefObject<HTMLVideoElement | null>,
  source: string | undefined,
  actif = true,
  enVue?: () => boolean,
) {
  useEffect(() => {
    const v = ref.current;
    if (!v || !source || !actif) return;
    const lancer = () => {
      if (!v.paused || (enVue && !enVue())) return;
      const p = v.play();
      if (p) p.catch(() => {});
    };
    const auRetour = () => {
      if (document.visibilityState === "visible") lancer();
    };
    lancer();
    v.addEventListener("canplay", lancer);
    document.addEventListener("visibilitychange", auRetour);
    document.addEventListener("touchstart", lancer, { passive: true });
    return () => {
      v.removeEventListener("canplay", lancer);
      document.removeEventListener("visibilitychange", auRetour);
      document.removeEventListener("touchstart", lancer);
    };
  }, [ref, source, actif, enVue]);
}

/**
 * Même correctif pour les gabarits HTML injectés (dangerouslySetInnerHTML,
 * pages *.tmpl.html) : chaque <video autoplay> dont la source est un fichier
 * de public/ passe sur son adresse blob:, attribut muted posé, lecture
 * relancée. À appeler après l'injection, avec la racine du gabarit.
 */
export function reparerVideosSansRange(racine: ParentNode | null): () => void {
  if (!racine) return () => {};
  let fini = false;
  const nettoyages: (() => void)[] = [];
  racine.querySelectorAll<HTMLVideoElement>("video[autoplay]").forEach((v) => {
    const src =
      v.getAttribute("src") ||
      [...v.querySelectorAll("source")].map((s) => s.getAttribute("src") || "").find((s) => /\.mp4$/i.test(s)) ||
      v.querySelector("source")?.getAttribute("src") ||
      "";
    if (v.hasAttribute("muted")) poserMuet(v);
    if (!servieSansRange(src)) return;
    versBlob(src).then((url) => {
      if (fini || url === src) return;
      v.querySelectorAll("source").forEach((s) => s.remove());
      v.src = url;
      const lancer = () => {
        if (!v.paused) return;
        const p = v.play();
        if (p) p.catch(() => {});
      };
      lancer();
      v.addEventListener("canplay", lancer);
      document.addEventListener("touchstart", lancer, { passive: true });
      nettoyages.push(() => {
        v.removeEventListener("canplay", lancer);
        document.removeEventListener("touchstart", lancer);
      });
    });
  });
  return () => {
    fini = true;
    nettoyages.forEach((n) => n());
  };
}
