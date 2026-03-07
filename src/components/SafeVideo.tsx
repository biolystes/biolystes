import { useState, useRef, useEffect } from "react";

interface SafeVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  poster?: string;
  onClick?: () => void;
}

/**
 * Video component with fallback for unsupported formats (.mov on Android etc.)
 * Shows a dark gradient placeholder when video fails to load/play.
 */
export default function SafeVideo({
  src,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  controls = false,
  poster,
  onClick,
}: SafeVideoProps) {
  const [error, setError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setError(false);
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || error) return;

    const handleError = () => setError(true);
    const handleStalled = () => {
      // If stalled for too long, consider it failed
      setTimeout(() => {
        if (video.readyState < 2) setError(true);
      }, 3000);
    };

    video.addEventListener("error", handleError);
    video.addEventListener("stalled", handleStalled);
    return () => {
      video.removeEventListener("error", handleError);
      video.removeEventListener("stalled", handleStalled);
    };
  }, [error, src]);

  if (error) {
    return (
      <div
        className={`bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center ${className}`}
        onClick={onClick}
      >
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      controls={controls}
      poster={poster}
      className={className}
      onClick={onClick}
      onError={() => setError(true)}
      // @ts-ignore - webkit prefix for iOS
      webkit-playsinline="true"
    />
  );
}
