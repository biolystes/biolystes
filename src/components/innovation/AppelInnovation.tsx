/* La section « Toujours plus d’innovation » de l’accueil de biolystes.com
   (JP, 14/10/2026), qui mène à /innovation. Posée après les blocs de
   l’accueil qui parlent du site et des agents IA (BlocsAccueilSecteur), par un
   écart voulu : l’accueil est recopié de lystes.ai/bio (sync.py), l’insertion
   est réappliquée à chaque alignement par ecarts_voulus.py (voir
   lystes/ECARTS-VOULUS.md). Ce fichier vit hors de lystes/ : la synchro ne
   l’écrase pas.

   Le maillage du visage est celui de l’accueil. Le scanner est déjà posé plus
   haut dans le carrousel des agents (#diagnostic-facemesh-slot) : une seconde
   instance de MediaPipe sur la même page reste bloquée sur « Analyse en
   cours » (vu sur lystes.ai, 10/10/2026). Comme l’encart des étages de
   lystes.ai (VisionEtages, MiroirVisage), on reflète donc ce scanner image par
   image ; sans lui, repli sur le composant lui-même. */
import { useEffect, useRef, useState } from "react";
import { Link as LienSite } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarHeart, QrCode, ScanFace, type LucideIcon } from "lucide-react";
import EnteteSection from "@lystes/components/bio/EnteteSection";
import { FaceMeshScanner } from "@lystes/features/landing-particuliers/components/diagnostic/FaceMeshScanner";
import { demanderMaillage } from "@lystes/lib/mediapipe-sur";
import visageDiagnostic from "@/assets/innovation/visage-diagnostic.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

/* Le visage scanné, reflété depuis le scanner de la page (même code que
   MiroirVisage de lystes.ai, src/features/solutions/VisionEtages.tsx). */
function MiroirVisage() {
  const toile = useRef<HTMLCanvasElement>(null);
  const [miroir, setMiroir] = useState(true);
  useEffect(() => {
    demanderMaillage();
    let id = 0;
    /* Le scanner du carrousel se monte un peu après cette section (portail
       posé après le rendu des blocs) : on l’attend jusqu’à 10 s avant le
       repli, sinon une seconde instance de MediaPipe partait et restait
       bloquée sur « Analyse en cours » (vu le 14/10/2026). */
    const debut = performance.now();
    /* Hors de l’écran, on ne recopie rien : le téléphone ne dessine que ce
       qu’on voit. */
    let visible = true;
    const obs = typeof IntersectionObserver !== "undefined" && toile.current
      ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "100px 0px" })
      : null;
    if (obs && toile.current) obs.observe(toile.current);
    const pas = () => {
      const source = document.querySelector<HTMLCanvasElement>("#diagnostic-facemesh-slot canvas");
      if (!source) {
        if (performance.now() - debut < 10000) id = requestAnimationFrame(pas);
        else setMiroir(false);
        return;
      }
      const c = toile.current;
      const g = c?.getContext("2d");
      if (visible && c && g && source.width && source.height) {
        const w = Math.round(c.clientWidth * window.devicePixelRatio);
        const h = Math.round(c.clientHeight * window.devicePixelRatio);
        if (c.width !== w) c.width = w;
        if (c.height !== h) c.height = h;
        const k = Math.max(w / source.width, h / source.height);
        g.clearRect(0, 0, w, h);
        g.drawImage(source, (w - source.width * k) / 2, (h - source.height * k) / 2, source.width * k, source.height * k);
      }
      id = requestAnimationFrame(pas);
    };
    pas();
    return () => {
      cancelAnimationFrame(id);
      obs?.disconnect();
    };
  }, []);
  return miroir
    ? <canvas ref={toile} className="block w-full aspect-[4/5] rounded-3xl" aria-label="Diagnostic IA : le visage d’une cliente analysé par le maillage" role="img" />
    : <FaceMeshScanner imageUrl={visageDiagnostic} />;
}

const LIEUX: { icone: LucideIcon; titre: string; texte: string }[] = [
  { icone: ScanFace, titre: "Votre e-commerce", texte: "Un diagnostic IA de la peau et des cheveux, puis une Cure 90 jours après l’achat." },
  { icone: QrCode, titre: "Votre boutique ou institut", texte: "Un QR code sur le packaging, et vos produits répondent à vos\u00a0clientes." },
  { icone: CalendarHeart, titre: "Vos événements", texte: "Des stands connectés qui transforment chaque visiteuse en contact qualifié." },
];

export default function AppelInnovation() {
  return (
    <section id="section-innovation" className="bg-secondary py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <EnteteSection className="mb-10 md:mb-12" surtitre="Innovation" aLaLigne={false}
          noir="Toujours plus d’innovation," gris={"pour votre e\u2011commerce, votre boutique ou institut, ou vos événements."} />
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 items-stretch">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }} variants={fadeUp} custom={0}
            className="rounded-2xl bg-[#0d0d0d] p-6 lg:p-8 flex items-center justify-center">
            <div className="w-full max-w-[360px]">
              <MiroirVisage />
            </div>
          </motion.div>
          <div className="flex flex-col gap-4">
            {LIEUX.map((l, i) => (
              <motion.div key={l.titre} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }} variants={fadeUp} custom={i + 1}
                className="rounded-2xl bg-background p-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
                    <l.icone className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{l.titre}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed text-pretty">{l.texte}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="mt-10 flex flex-wrap justify-center gap-4">
          <LienSite to="/innovation" className="btn-startup">
            <span>Découvrir nos innovations</span>
            <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
          </LienSite>
        </motion.div>
      </div>
    </section>
  );
}
