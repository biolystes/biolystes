/* Carte vidéo « Backstage » (non cliquable, sans son) glissée parmi les lieux du listing /meetup.
   Le mot « Backstage » est centré, en majuscules, dans la police des titres de lieux.
   Les deux flèches, sans fond blanc, sont côte à côte à gauche des quatre pastilles. */
import { useState } from "react";
import PopupMeetup from "@/components/PopupMeetup";
import { ChevronLeft, ChevronRight } from "lucide-react";
import v2 from "@/assets/backstage/backstage_2.mp4.asset.json";
import v3 from "@/assets/backstage/backstage_3.mp4.asset.json";
import v4 from "@/assets/backstage/backstage_4.mp4.asset.json";

/* La dernière vidéo passe en première ; la toute première est retirée. */
const VIDEOS = [v4.url, v2.url, v3.url];
const fleche = "w-6 h-6 flex items-center justify-center text-white/90 hover:text-white transition-colors";

export default function CarteBackstage() {
  const [i, setI] = useState(0);
  const [ouvert, setOuvert] = useState(false);
  const aller = (d: number) => setI((i + d + VIDEOS.length) % VIDEOS.length);
  return (
    <div data-backstage className="relative rounded-[20px] overflow-hidden h-full min-h-[300px]" style={{ background: "rgb(29,29,31)" }}>
      <video key={VIDEOS[i]} src={VIDEOS[i]} autoPlay muted playsInline preload="metadata" onEnded={() => aller(1)} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 45%)" }} />
      {/* Le mot, centré, en majuscules, exactement la police des titres de lieux. */}
      <span className="absolute inset-0 flex items-center justify-center text-[13px] font-bold uppercase tracking-[0.3px] text-white pointer-events-none">Backstage</span>
      {/* Flèches sans fond, côte à côte, à gauche des quatre pastilles. */}
      <div className="absolute left-4 bottom-4 flex items-center gap-1">
        <div className="flex items-center -space-x-0.5">
          <button type="button" aria-label="Vidéo précédente" onClick={() => aller(-1)} className={fleche}><ChevronLeft className="w-3.5 h-3.5" /></button>
          <button type="button" aria-label="Vidéo suivante" onClick={() => aller(1)} className={fleche}><ChevronRight className="w-3.5 h-3.5" /></button>
        </div>
        <div className="flex gap-1.5">
          {VIDEOS.map((_, k) => <span key={k} className="w-1.5 h-1.5 rounded-full" style={{ background: "#ffffff", opacity: k === i ? 1 : 0.45 }} />)}
        </div>
      </div>
      <button type="button" data-savoir-plus-meetup onClick={() => setOuvert(true)} className="absolute right-4 bottom-3 h-8 px-3 rounded-lg text-[11px] font-semibold" style={{ background: "#ffffff", color: "rgb(29,29,31)" }}>En savoir plus</button>
      {ouvert && <PopupMeetup onFermer={() => setOuvert(false)} />}
    </div>
  );
}
