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
  lazy?: boolean;
}

/**
 * Video component with:
 * - Fallback for unsupported formats (.mov on Android etc.)
 * - Lazy loading via IntersectionObserver (loads only when near viewport)
 * - preload="metadata" to avoid downloading full video upfront
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
  lazy = true,
}: SafeVideoProps) {
  const [error, setError] = useState(false);
  const [isVisible, setIsVisible] = useState(!lazy);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setError(false);
  }, [src]);

  // Lazy loading: only render video when near viewport
  useEffect(() => {
    if (!lazy) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || error) return;

    const handleError = () => setError(true);
    video.addEventListener("error", handleError);
    return () => {
      video.removeEventListener("error", handleError);
    };
  }, [error, src, isVisible]);

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

  if (!isVisible) {
    return (
      <div
        ref={containerRef}
        className={`bg-neutral-900 ${className}`}
        onClick={onClick}
      />
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
      preload="metadata"
      // @ts-ignore - webkit prefix for iOS
      webkit-playsinline="true"
    />
  );
}
