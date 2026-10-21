import { useEffect, useRef } from "react";
import videoAsset from "@lystes/assets/avis-prompt-video.mp4.asset.json";

/**
 * Bandeau vidéo + prompt bar animé (typewriter) — inséré au milieu du bento
 * "équipes autonomes". Full width via gridColumn: 1 / -1 dans le grid parent.
 */
export function VideoPromptBanner() {
  const typeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = typeRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phrases = [
      "Quels actifs anti-âge pour ma peau ?",
      "Crée ma routine anti-âge",
      "Mon rétinol est-il bien dosé ?",
      "Compare ma crème aux références",
      "Convient-elle aux peaux sensibles ?",
      "Je peux t'appeler ?",
    ];
    if (reduce) {
      el.textContent = phrases[0];
      return;
    }
    let pIdx = 0, cIdx = 0, deleting = false, timer: number | null = null;
    const HOLD = 1800, TYPE = 55, ERASE = 26;
    const tick = () => {
      const full = phrases[pIdx];
      cIdx += deleting ? -1 : 1;
      el.textContent = full.substring(0, cIdx);
      let delay = deleting ? ERASE : TYPE;
      if (!deleting && cIdx === full.length) {
        deleting = true;
        delay = HOLD;
      } else if (deleting && cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        delay = 320;
      }
      timer = window.setTimeout(tick, delay);
    };
    tick();
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      style={{ gridColumn: "1 / -1", borderRadius: 22, overflow: "hidden", position: "relative", aspectRatio: "203 / 96", background: "#000" }}
      className="video-prompt-banner"
    >
      <video
        src={videoAsset.url}
        autoPlay
        muted
        loop
        playsInline
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      {/* scrim */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.42) 100%)",
        }}
      />
      {/* prompt overlay */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 3.4% 4.6%" }}>
        <div
          style={{
            display: "inline-flex",
            marginBottom: 14,
            padding: "0 2px",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              height: 36,
              width: 36,
              flexShrink: 0,
              overflow: "hidden",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(255,255,255,0.1)",
            }}
          >
            <img
              src="/images/clients/valthea-2.jpg"
              alt=""
              style={{ height: "100%", width: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
            <h3
              style={{
                margin: 0,
                color: "#fff",
                fontSize: 13,
                fontWeight: 600,
                lineHeight: 1.15,
                whiteSpace: "nowrap",
              }}
            >
              Crème anti-âge
            </h3>
            <span style={{ display: "flex", alignItems: "baseline", gap: 6, whiteSpace: "nowrap" }}>
              <span style={{ fontSize: 12, fontWeight: 400, textDecoration: "line-through", color: "rgba(255,255,255,0.65)" }}>90€</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>49€</span>
            </span>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 12,
            height: 58,
            padding: "0 8px 0 20px",
            borderRadius: 32,
            background: "transparent",
            backdropFilter: "blur(18px) saturate(140%)",
            WebkitBackdropFilter: "blur(18px) saturate(140%)",
          }}
        >
          <svg style={{ flex: "0 0 auto", width: 15, height: 21, color: "#fff" }} viewBox="0 0 15 21" fill="none" aria-hidden>
            <path
              d="M3.68 20.4c-.12.16-.26.26-.42.3a.53.53 0 0 1-.41-.05.52.52 0 0 1-.26-.31.6.6 0 0 1 .05-.52l2.31-6.03H.56a.55.55 0 0 1-.4-.15.53.53 0 0 1-.15-.38c0-.16.07-.33.2-.5L7.25.4c.13-.16.26-.26.42-.3a.5.5 0 0 1 .42.05c.12.06.2.17.25.32a.6.6 0 0 1-.04.51L6 6.99h4.38c.17 0 .3.05.4.15.11.1.16.22.16.37 0 .16-.07.33-.2.5L3.68 20.4Z"
              fill="currentColor"
            />
          </svg>
          <div
            style={{
              flex: "1 1 auto",
              minWidth: 0,
              display: "flex",
              alignItems: "center",
              color: "rgba(255,255,255,0.96)",
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <span ref={typeRef} />
            <span
              style={{
                display: "inline-block",
                width: 1.5,
                height: "1.15em",
                marginLeft: 1,
                background: "#fff",
                transform: "translateY(2px)",
                animation: "vpb-blink 1s steps(1) infinite",
              }}
            />
          </div>
          <button
            type="button"
            aria-label="Envoyer"
            style={{
              flex: "0 0 auto",
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              border: "none",
              borderRadius: "50%",
              background: "rgba(10,10,10,0.16)",
              cursor: "default",
            }}
          >
            <svg viewBox="0 0 15 15" fill="none" aria-hidden style={{ width: 15, height: 15, color: "#fff" }}>
              <path
                d="M7.5 14a.83.83 0 0 1-.6-.24.85.85 0 0 1-.24-.6V5.28L3.86 7.95a.83.83 0 0 1-.6.25.79.79 0 0 1-.57-.23.79.79 0 0 1-.23-.58c0-.22.08-.42.25-.6L6.9.62A.83.83 0 0 1 7.5.38c.23 0 .43.08.6.24l4.19 4.17c.17.18.26.38.26.6 0 .23-.08.42-.23.58a.79.79 0 0 1-.57.23.83.83 0 0 1-.6-.25L8.34 5.28v7.88c0 .25-.08.45-.24.6a.83.83 0 0 1-.6.24Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
      <style>{`
        @media (max-width: 767px) {
          .video-prompt-banner {
            aspect-ratio: 96 / 126 !important;
          }
        }
        @keyframes vpb-blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

export default VideoPromptBanner;
