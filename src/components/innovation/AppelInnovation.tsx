/* La section « Toujours plus d’innovation » de l’accueil de biolystes.com
   (JP, 14/10/2026), qui mène à /innovation. Posée après les blocs de
   l’accueil qui parlent du site et des agents IA (BlocsAccueilSecteur), par un
   écart voulu : l’accueil est recopié de lystes.ai/bio (sync.py), l’insertion
   est réappliquée à chaque alignement par ecarts_voulus.py (voir
   lystes/ECARTS-VOULUS.md). Ce fichier vit hors de lystes/ : la synchro ne
   l’écrase pas.

   Le maillage montre un AUTRE visage que le scanner du carrousel des agents
   (#diagnostic-facemesh-slot) : aucune photo deux fois sur la page (JP,
   14/10/2026). La section reflétait ce scanner, faute de pouvoir lancer un
   second MediaPipe. */
import { useEffect, useRef, useState } from "react";
import { Link as LienSite } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CalendarHeart, QrCode, ScanFace, type LucideIcon } from "lucide-react";
import EnteteSection from "@lystes/components/bio/EnteteSection";
import { FaceMeshScanner } from "@lystes/features/landing-particuliers/components/diagnostic/FaceMeshScanner";
import { demanderMaillage } from "@lystes/lib/mediapipe-sur";
/* Inès, un des profils de diagnostic de la démo Lystes
   (public/demo-lystes/diagnostics/profil-03.jpg), absent du reste de l’accueil. */
import visageAccueil from "@/assets/innovation/visage-accueil.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

/* Pourquoi un second scanner restait sur « Analyse en cours » (14/10/2026) :
   l’ancien MediaPipe de jsDelivr (face_mesh.js) n’a qu’un module wasm par
   page. Deux FaceMesh qui s’initialisent en même temps se heurtent : le
   second s’arrête sur « Module.arguments has been replaced ». Et
   FaceMeshScanner tient son script pour chargé dès que la balise existe : le
   second scanner, monté pendant que le premier charge encore face_mesh.js,
   trouve window.FaceMesh vide et n’analyse jamais. L’un après l’autre, deux
   FaceMesh marchent (vérifié dans la page).
   On monte donc ce scanner quand celui du carrousel a fini son analyse :
   plus de roue dans son emplacement. Le correctif reste ici, hors de
   lystes/ que la synchro réécrit. */
function scannerDuCarrouselOccupe(): boolean {
  const slot = document.getElementById("diagnostic-facemesh-slot");
  if (!slot) return false;
  /* Pas encore monté (portail posé après le rendu des blocs), ou en analyse. */
  return !slot.querySelector("canvas") || !!slot.querySelector(".animate-spin");
}

function VisageInnovation() {
  const cadre = useRef<HTMLDivElement>(null);
  const [pret, setPret] = useState(false);
  useEffect(() => {
    const el = cadre.current;
    if (!el) return;
    let minuterie = 0;
    let depart = 0;
    const attendre = () => {
      /* Au-delà de 20 s (réseau très lent, carrousel absent), on monte quand
         même : au pire, le repli du scanner. */
      if (!scannerDuCarrouselOccupe() || performance.now() - depart > 20000) setPret(true);
      else minuterie = window.setTimeout(attendre, 200);
    };
    /* MediaPipe ne part qu’à l’approche de la section : le scanner du
       carrousel, plus haut, est alors appelé à finir le sien d’abord. */
    const obs = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver((entrees) => {
          if (!entrees.some((e) => e.isIntersecting)) return;
          obs?.disconnect();
          demanderMaillage();
          depart = performance.now();
          attendre();
        }, { rootMargin: "300px 0px" })
      : null;
    if (obs) obs.observe(el);
    else setPret(true);
    return () => {
      obs?.disconnect();
      window.clearTimeout(minuterie);
    };
  }, []);
  return (
    <div ref={cadre} role="img" aria-label="Diagnostic IA : le visage d’une cliente analysé par le maillage">
      {pret ? (
        <FaceMeshScanner imageUrl={visageAccueil} />
      ) : (
        /* En attendant : la photo assombrie, comme le scanner avant son
           maillage, à la même taille (photo en 4:5). */
        <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden">
          <img src={visageAccueil} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
    </div>
  );
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
              <VisageInnovation />
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
