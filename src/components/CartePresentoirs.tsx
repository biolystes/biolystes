import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import atelier from "@/assets/meetup/presentoir-atelier.jpeg.asset.json";
import eclose from "@/assets/meetup/presentoirs-eclose.jpeg.asset.json";

const PHOTOS = [
  { url: atelier.url, alt: "Fabrication d’un présentoir géant en forme de flacon" },
  { url: eclose.url, alt: "Les présentoirs géants Éclōse terminés" },
];

export default function CartePresentoirs() {
  const [index, setIndex] = useState(0);
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });

  useEffect(() => {
    if (!embla) return;
    const selection = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", selection);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const motion = () => {
      clearInterval(timer);
      if (!reduced.matches) timer = setInterval(() => embla.scrollNext(), 4500);
    };
    motion();
    reduced.addEventListener("change", motion);
    return () => {
      embla.off("select", selection);
      clearInterval(timer);
      reduced.removeEventListener("change", motion);
    };
  }, [embla]);

  return (
    <div data-presentoirs className="relative rounded-[20px] overflow-hidden min-h-[380px] bg-muted" role="region" aria-label="Vos présentoirs instagrammables">
      <div ref={emblaRef} className="absolute inset-0 overflow-hidden">
        <div className="flex h-full">
          {PHOTOS.map((photo) => (
            <div key={photo.url} className="relative flex-[0_0_100%] min-w-0 h-full">
              <img src={photo.url} alt={photo.alt} loading="lazy" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-primary text-primary-foreground px-4 py-3 flex flex-col items-center gap-2">
        <p className="text-[13px] font-bold uppercase text-center">Vos présentoirs instagrammables</p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground" aria-label="Photo précédente" title="Photo précédente" onClick={() => embla?.scrollPrev()}><ChevronLeft /></Button>
          {PHOTOS.map((photo, i) => <span key={photo.url} className={`h-1.5 w-1.5 rounded-full bg-primary-foreground ${index === i ? "opacity-100" : "opacity-40"}`} />)}
          <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground" aria-label="Photo suivante" title="Photo suivante" onClick={() => embla?.scrollNext()}><ChevronRight /></Button>
        </div>
      </div>
    </div>
  );
}