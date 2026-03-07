import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import SafeVideo from "@/components/SafeVideo";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

const videos = [
  { src: "/videos/wirtzkin-1.mov", title: "Présentation clinique Wirtzkin" },
  { src: "/videos/wirtzkin-2.mov", title: "Produits Wirtzkin par Biolystes" },
  { src: "/videos/wirtzkin-3.mov", title: "Wirtzkin en situation" },
];

export default function WirtzkinSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, videos.length - 1));
    setCurrentIndex(clamped);
    if (scrollRef.current) {
      const child = scrollRef.current.children[clamped] as HTMLElement;
      if (child) {
        scrollRef.current.scrollTo({ left: child.offsetLeft - scrollRef.current.offsetLeft, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (fullscreen !== null) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % videos.length;
        if (scrollRef.current) {
          const child = scrollRef.current.children[next] as HTMLElement;
          if (child) {
            scrollRef.current.scrollTo({ left: child.offsetLeft - scrollRef.current.offsetLeft, behavior: "smooth" });
          }
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [fullscreen]);

  return (
    <div className="max-w-5xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-12 text-center">
        <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
          Ils nous font confiance
        </motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground">
          Le centre médical esthétique <br />Wirtzkin nous a choisi
        </motion.h2>
        <motion.p variants={fadeUp} custom={2} className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Wirtzkin, centre médical esthétique spécialisé dans les soins de la peau, a décidé de faire confiance à Biolystes pour la production de ses produits cosmétiques bio et végane.
        </motion.p>
      </motion.div>

      {/* Video Carousel */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3} className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6"
        >
          {videos.map((video, i) => (
            <button
              key={i}
              onClick={() => setFullscreen(i)}
              className="relative flex-shrink-0 w-[300px] md:w-[400px] aspect-[9/16] rounded-2xl overflow-hidden group snap-start cursor-pointer border-0 p-0 bg-black"
            >
              <video
                src={video.src}
                muted
                loop
                playsInline
                autoPlay
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Navigation arrows */}
        {videos.length > 1 && (
          <>
            <button
              onClick={() => scrollTo(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg disabled:opacity-30 transition-opacity z-10"
            >
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <button
              onClick={() => scrollTo(currentIndex + 1)}
              disabled={currentIndex === videos.length - 1}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg disabled:opacity-30 transition-opacity z-10"
            >
              <ChevronRight className="h-5 w-5 text-foreground" />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-foreground w-6" : "bg-muted-foreground/30"}`}
            />
          ))}
        </div>
      </motion.div>


      {/* Fullscreen video modal */}
      <AnimatePresence>
        {fullscreen !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setFullscreen(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={videos[fullscreen].src}
                autoPlay
                loop
                playsInline
                controls
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setFullscreen(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors z-10"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
