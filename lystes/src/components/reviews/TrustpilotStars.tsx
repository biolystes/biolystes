import { useId } from "react";

interface TrustpilotStarsProps {
  rating: number;
  size?: number; // px
  className?: string;
  /**
   * "dark" (défaut) : tuiles foncées #202329, l'étoile est la découpe qui
   * laisse voir le fond clair de la page.
   * "white" : pour un fond sombre (bannière, aplat photo). La tuile devient
   * un voile blanc translucide et l'étoile est peinte en blanc : sur une
   * photo foncée, la version « dark » se fond dans l'image et l'étoile
   * paraît noire.
   */
  tone?: "dark" | "white";
}

const CARRE = "M-2 -2 H26 V26 H-2 Z";
const ETOILE = "M12 4 L14.5 9.5 L20.5 10 L16 14 L17.5 20 L12 16.8 L6.5 20 L8 14 L3.5 10 L9.5 9.5 Z";

/**
 * Trustpilot-style star row: each star keeps the brand's square tile with a
 * star-shaped cutout (fill-rule="evenodd"). The fill ratio of the partial
 * star uses a hard-stop linear gradient.
 */
export function TrustpilotStars({
  rating,
  size = 20,
  className = "",
  tone = "dark",
}: TrustpilotStarsProps) {
  const uid = useId().replace(/:/g, "");
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const pct = Math.max(0, Math.min(1, rating - i)) * 100;
        const gradId = `tp-star-${uid}-${i}`;
        return (
          <svg
            key={i}
            viewBox="-2 -2 28 28"
            style={{ width: size, height: size }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={gradId}>
                {tone === "white" ? (
                  <>
                    <stop offset={`${pct}%`} stopColor="#FFFFFF" />
                    <stop offset={`${pct}%`} stopColor="rgba(255,255,255,0.35)" />
                  </>
                ) : (
                  <>
                    <stop offset={`${pct}%`} stopColor="#202329" />
                    <stop offset={`${pct}%`} stopColor="#E8E8E9" />
                  </>
                )}
              </linearGradient>
            </defs>
            {tone === "white" ? (
              <>
                {/* Tuile : voile blanc translucide, l'étoile peinte par-dessus. */}
                <path d={CARRE} fill="rgba(255,255,255,0.22)" />
                <path d={ETOILE} fill={`url(#${gradId})`} />
              </>
            ) : (
              <path
                fillRule="evenodd"
                d={`${CARRE} ${ETOILE}`}
                fill={`url(#${gradId})`}
              />
            )}
          </svg>
        );
      })}
    </div>
  );
}

export default TrustpilotStars;
