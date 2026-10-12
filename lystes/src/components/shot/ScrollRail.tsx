import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { computeThumb, type Thumb } from "@lystes/features/scroll-rail/scroll-rail";

/**
 * Zone défilante avec un rail dessiné à droite.
 *
 * Le rail gris reste visible tant qu'il y a du texte au-delà du cadre, et le
 * segment noir marque la position. La barre native est masquée : sur macOS et
 * iOS elle s'efface d'elle-même, ce qui privait le lecteur de toute indication.
 *
 * Quand le contenu tient entièrement, aucun rail n'apparaît.
 */

/** Le curseur ne descend jamais sous cette hauteur, sinon il devient invisible. */
const MIN_THUMB = 12;

interface Props {
  children: ReactNode;
  /** Classes de la zone défilante, dont sa hauteur maximale. */
  className?: string;
}

export function ScrollRail({ children, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<Thumb | null>(null);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setThumb(
      computeThumb({
        scrollTop: el.scrollTop,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        trackHeight: el.clientHeight,
        minThumbHeight: MIN_THUMB,
      }),
    );
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    /* La description arrive parfois après le premier rendu, et la carte change
       de largeur au redimensionnement : dans les deux cas la hauteur du contenu
       bouge, et un rail mesuré une seule fois mentirait. */
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, children]);

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={measure}
        className={`lystes-hide-scrollbar overflow-y-auto ${className}`}
      >
        {children}
      </div>
      {thumb && (
        <div aria-hidden className="absolute right-0 top-0 bottom-0 w-[2px] bg-neutral-200">
          <div
            className="absolute left-0 w-[2px] bg-neutral-900"
            style={{ top: thumb.top, height: thumb.height }}
          />
        </div>
      )}
    </div>
  );
}
