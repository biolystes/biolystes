/* Carte vidéo « Backstage » (non cliquable, sans son) glissée à la fin du listing /meetup. */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import v1 from "@/assets/backstage/backstage_1.mp4.asset.json";
import v2 from "@/assets/backstage/backstage_2.mp4.asset.json";
import v3 from "@/assets/backstage/backstage_3.mp4.asset.json";
import v4 from "@/assets/backstage/backstage_4.mp4.asset.json";

const VIDEOS = [v1.url, v2.url, v3.url, v4.url];
const bouton = "absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow";

export default function CarteBackstage() {
  const [i, setI] = useState(0);
  const aller = (d: number) => setI((i + d + VIDEOS.length) % VIDEOS.length);
  return (
    <div data-backstage className="relative rounded-[20px] overflow-hidden h-full min-h-[300px]" style={{ background: "rgb(29,29,31)" }}>
      <video key={VIDEOS[i]} src={VIDEOS[i]} autoPlay muted loop playsInline preload="metadata" onEnded={() => aller(1)} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 45%)" }} />
      <span className="absolute left-5 bottom-5 text-3xl italic" style={{ color: "#ffffff", fontFamily: "'Instrument Serif', serif" }}>Backstage</span>
      <button type="button" aria-label="Vidéo précédente" onClick={() => aller(-1)} className={`${bouton} left-3`} style={{ background: "#ffffff", color: "rgb(29,29,31)" }}><ChevronLeft className="w-5 h-5" /></button>
      <button type="button" aria-label="Vidéo suivante" onClick={() => aller(1)} className={`${bouton} right-3`} style={{ background: "#ffffff", color: "rgb(29,29,31)" }}><ChevronRight className="w-5 h-5" /></button>
      <div className="absolute right-5 bottom-6 flex gap-1.5">
        {VIDEOS.map((_, k) => <span key={k} className="w-1.5 h-1.5 rounded-full" style={{ background: "#ffffff", opacity: k === i ? 1 : 0.45 }} />)}
      </div>
    </div>
  );
}
