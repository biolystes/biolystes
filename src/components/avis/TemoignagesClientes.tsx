/* Les six témoignages d'anciennes clientes (JP, 21/10/2026), sous le bloc des
   prix de /tarifs. Identité du site : en-tête de section (surtitre, titre noir
   puis gris), cartes #f3f4f5, rien de replié. Ni photo, ni étoile, ni note. */
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mic, Pause, Play, Quote } from "lucide-react";
import { Bande, Entete, RondIcone } from "@/pages/pied/elements";
import { AVIS_AUDIO, AVIS_AUDIO_NOM, AVIS_AUDIO_PUBLIE, TEMOIGNAGES } from "@/data/temoignages";

const BRICOLAGE = "'Bricolage Grotesque', 'Inter', sans-serif";

const minutes = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* L'avis audio : un extrait d'une minute, bouton noir, jamais lancé tout seul
   (preload="none", aucun autoplay). La transcription est à plat sous le lecteur. */
function AvisAudio() {
  const audio = useRef<HTMLAudioElement>(null);
  const [lecture, setLecture] = useState(false);
  const [temps, setTemps] = useState(0);
  const [duree, setDuree] = useState(AVIS_AUDIO.duree);
  const basculer = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) void a.play().catch(() => setLecture(false)); else a.pause();
  };
  return (
    <figure className="rounded-2xl bg-[#f3f4f5] p-[1.5rem] md:p-[2rem]" data-avis-audio>
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
        <div>
          <div className="flex items-center gap-3">
            <RondIcone icone={Mic} />
            <figcaption>
              <span className="block text-[0.75rem] tracking-[0.14em] uppercase text-foreground">Avis audio</span>
              <span className="block mt-0.5 text-[0.9375rem] font-medium text-foreground">{AVIS_AUDIO_NOM}</span>
            </figcaption>
          </div>
          <div className="mt-5 flex items-center gap-4">
            <button type="button" onClick={basculer} aria-label={lecture ? "Mettre en pause l’avis audio" : "Écouter l’avis audio"}
              className="w-14 h-14 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2">
              {lecture ? <Pause className="h-5 w-5" strokeWidth={1.75} /> : <Play className="h-5 w-5 translate-x-px" strokeWidth={1.75} />}
            </button>
            <div className="min-w-0 flex-1">
              <input type="range" min={0} max={duree} step={0.1} value={temps} aria-label="Position dans l’avis audio"
                onChange={(e) => { const v = Number(e.target.value); setTemps(v); if (audio.current) audio.current.currentTime = v; }}
                className="w-full h-1 cursor-pointer" style={{ accentColor: "#000" }} />
              <p className="mt-1.5 flex justify-between text-[0.8125rem] text-muted-foreground tabular-nums">
                <span>{minutes(temps)}</span><span>{minutes(duree)}</span>
              </p>
            </div>
          </div>
          <audio ref={audio} preload="none"
            onPlay={() => setLecture(true)} onPause={() => setLecture(false)} onEnded={() => { setLecture(false); setTemps(0); }}
            onTimeUpdate={(e) => setTemps(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => { if (Number.isFinite(e.currentTarget.duration)) setDuree(e.currentTarget.duration); }}>
            {AVIS_AUDIO.sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
          </audio>
        </div>
        <blockquote className="text-[1.25rem] md:text-[1.5rem] leading-snug tracking-tight text-foreground"
          style={{ fontFamily: BRICOLAGE, fontWeight: 400, textWrap: "balance" }}>
          {AVIS_AUDIO.citation}
        </blockquote>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-[0.75rem] tracking-[0.14em] uppercase text-foreground">Transcription de l’extrait</p>
        <p className="mt-3 text-[0.9375rem] text-foreground/80 leading-relaxed" style={{ textWrap: "pretty" }}>{AVIS_AUDIO.transcription}</p>
      </div>
    </figure>
  );
}

/* `niveau` 1 sur la page /avis (titre de page), `versAvis` sur l'accueil et
   /tarifs : le lien « Voir tous les avis » mène à /avis. */
export default function TemoignagesClientes({ niveau = 2, versAvis = false }: { niveau?: 1 | 2; versAvis?: boolean }) {
  return (
    <Bande id="temoignages">
      <div className="max-w-[1072px] mx-auto px-[1.25rem] md:px-[1.5rem]">
        <Entete niveau={niveau} className="mb-8 md:mb-10" surtitre="Anciennes clientes" noir="Leurs premiers mois" gris="avec Biolystes." />
        {/* L'avis audio en tête (JP, 21/10/2026 : « mets l'audio en haut »), pleine largeur. */}
        {AVIS_AUDIO_PUBLIE && <div className="mb-4"><AvisAudio /></div>}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMOIGNAGES.map((t) => (
            <li key={t.prenom}>
              <figure className="h-full rounded-2xl bg-[#f3f4f5] p-[1.5rem] md:p-[2rem] flex flex-col" data-temoignage>
                <div className="flex items-center gap-3">
                  <RondIcone icone={Quote} />
                  <figcaption className="text-[0.9375rem] font-medium text-foreground">{t.prenom}</figcaption>
                </div>
                {t.titre && (
                  <h3 className="mt-5 text-[1.125rem] md:text-[1.25rem] !font-semibold leading-snug text-foreground"
                    style={{ fontFamily: BRICOLAGE, textTransform: "none", textWrap: "balance" }}>
                    {t.titre}
                  </h3>
                )}
                <blockquote className={(t.titre ? "mt-3" : "mt-5") + " text-[0.9375rem] md:text-base text-foreground/80 leading-relaxed"} style={{ textWrap: "pretty" }}>
                  {t.texte}
                </blockquote>
              </figure>
            </li>
          ))}
        </ul>
        {versAvis && (
          <div className="mt-8 md:mt-10 flex justify-center">
            <Link to="/avis" className="btn-outline">
              <span>Voir tous les avis</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </Link>
          </div>
        )}
      </div>
    </Bande>
  );
}
