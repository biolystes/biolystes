import { useEffect, useRef, type ReactNode } from "react";
import { ChevronsCarrousel } from "./ChevronsCarrousel";

/**
 * Le carrousel d'une ligne de la bannière de l'accueil (« Installer sur
 * Shopify », « Installer sur WooCommerce », point de vente…), sorti tel quel
 * de HomeHeroVideo (13/10/2026) pour servir aussi aux trois points de
 * l'en-tête de /bio (JP : « le même carrousel que celui de l'accueil »).
 * Mêmes classes (`lyh-install-*`, `lyh-lien-shopify`), même piste qui glisse
 * d'un élément à la fois, mêmes flèches (ChevronsCarrousel).
 *
 * `index` est piloté par l'appelant. `largeur` : facultatif, calcule la
 * largeur de la ligne à chaque mesure (la bannière l'aligne sur son champ).
 */
/* `ordiSeulement` : masqué sous 720 px (lien qui coûte une ligne au téléphone). */
export type ElementLieu = { key: string; contenu: ReactNode; href?: string; ordiSeulement?: boolean };

export function CarrouselLieux({ elements, index, setIndex, largeur, className, libellePrecedent, libelleSuivant }: {
  elements: ElementLieu[];
  index: number;
  setIndex: (f: (i: number) => number) => void;
  largeur?: (row: HTMLElement) => string | null;
  className?: string;
  libellePrecedent: string;
  libelleSuivant: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const largeurRef = useRef(largeur);
  largeurRef.current = largeur;
  const n = elements.length;
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const viewport = track.parentElement;
    if (!viewport) return;
    const row = viewport.parentElement;
    const appliquer = () => {
      const items = Array.from(track.children) as HTMLElement[];
      const courant = items[index];
      if (!courant) return;
      const l = row && largeurRef.current ? largeurRef.current(row) : null;
      if (row && l !== null) row.style.width = l;
      const rendu = viewport.clientWidth;
      const max = Math.max(0, track.scrollWidth - rendu);
      track.style.transform = `translateX(${-Math.min(courant.offsetLeft, max)}px)`;
    };
    appliquer();
    /* Au premier montage, les styles et les polices ne sont pas tous encore
       appliqués : une passe à la frame suivante, plus une à chaque changement
       de taille de la piste. */
    const raf = requestAnimationFrame(appliquer);
    const ro = new ResizeObserver(() => appliquer());
    ro.observe(track);
    document.fonts?.ready?.then(() => appliquer()).catch(() => {});
    window.addEventListener("resize", appliquer);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", appliquer);
    };
  }, [index]);
  return (
    <div className={"lyh-install-row" + (className ? " " + className : "")}>
      <div className="lyh-install-viewport">
        <div className="lyh-install-track" ref={trackRef}>
          {elements.map((e) => {
            const cl = "lyh-lien-shopify" + (e.ordiSeulement ? " lyh-ordi-seulement" : "");
            return e.href
              ? <a key={e.key} className={cl} href={e.href}>{e.contenu}</a>
              : <span key={e.key} className={cl}>{e.contenu}</span>;
          })}
        </div>
      </div>
      {/* Les deux flèches suivent le carrousel : elles sont dans le flux,
        juste après la fenêtre, et non posées en absolu au bord droit. */}
      <ChevronsCarrousel
        libellePrecedent={libellePrecedent}
        libelleSuivant={libelleSuivant}
        precedent={() => setIndex((i) => (i - 1 + n) % n)}
        suivant={() => setIndex((i) => (i + 1) % n)}
      />
    </div>
  );
}

/* Les styles de base du carrousel, ceux de la bannière : la page qui le monte
   hors de la bannière les pose une fois, puis règle la couleur. */
export const CSS_CARROUSEL_LIEUX = `
.lyh-install-row{ display:flex; align-items:center; gap:10px; margin-top:8px; width:336px; max-width:100%; transition:width .35s cubic-bezier(.22,1,.36,1); }
.lyh-install-viewport{ flex:1 1 0; min-width:0; overflow:hidden; }
.lyh-install-chevs{ display:flex; align-items:center; gap:4px; flex:none; }
.lyh-install-track{ display:flex; align-items:center; gap:11px; width:max-content; flex:none; transition:transform .35s cubic-bezier(.22,1,.36,1); will-change:transform; }
.lyh-btn-logo{ width:16px; height:16px; object-fit:contain; flex:none; display:block; }
.lyh-lien-shopify{ display:inline-flex; align-items:center; gap:7px; font-size:11px; font-weight:600; line-height:1; color:#fff; text-decoration:underline; text-underline-offset:3px; white-space:nowrap; transition:opacity .2s; }
.lyh-install-chev{ display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; padding:0; border:0; background:transparent; color:#fff; opacity:.8; cursor:pointer; transition:opacity .2s; }
.lyh-install-chev:hover{ opacity:1; }
.lyh-install-chev svg{ width:16px; height:16px; display:block; }
`;
