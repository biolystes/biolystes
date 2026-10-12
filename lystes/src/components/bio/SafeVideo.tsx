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
  /** Distance from viewport to start loading (default "300px") */
  rootMargin?: string;
}

/**
 * Video component with:
 * - Fallback for unsupported formats (.mov on Android etc.)
 * - Lazy loading via IntersectionObserver (loads only when near viewport)
 * - Auto pause/play when entering/leaving viewport
 * - preload="none" to avoid downloading anything upfront
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
  rootMargin = "300px",
}: SafeVideoProps) {
  const [error, setError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy);
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
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy, rootMargin]);

  // Auto pause when out of viewport, play when in viewport
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay || controls) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "50px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [shouldLoad, autoPlay, controls]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || error) return;

    const handleError = () => setError(true);
    video.addEventListener("error", handleError);
    return () => {
      video.removeEventListener("error", handleError);
    };
  }, [error, src, shouldLoad]);

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

  if (!shouldLoad) {
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
      preload="none"
      // @ts-ignore - webkit prefix for iOS
      webkit-playsinline="true"
    />
  );
}
