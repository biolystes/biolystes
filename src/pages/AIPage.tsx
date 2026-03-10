import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SafeVideo from "@/components/SafeVideo";
import LystesAiSection from "@/components/LystesAiSection";
import AITeamOrgChart from "@/components/AITeamOrgChart";
import AIClientsShowcase from "@/components/AIClientsShowcase";
import { LeakyBucketSection, DeploymentSection, InternationalSection, TestimonialsSection, CTASection } from "@/components/AIExtraSections";
import aiHeroMockup from "@/assets/ai-hero-mockup.png";
import DiagnosticComparisonSection from "@/components/DiagnosticComparisonSection";

import sevmylook1 from "@/assets/sevmylook-1.jpg";
import sevmylook2 from "@/assets/sevmylook-2.jpg";
import sevmylook3 from "@/assets/sevmylook-3.jpg";
import sevmylook4 from "@/assets/sevmylook-4.jpg";
import sevmylook5 from "@/assets/sevmylook-5.jpg";
import sevmylook6 from "@/assets/sevmylook-6.jpg";
import sevmylook7 from "@/assets/sevmylook-7.jpg";
import sevmylook8 from "@/assets/sevmylook-8.jpg";
import sevmylook9 from "@/assets/sevmylook-9.jpg";
import kaniwa1 from "@/assets/kaniwa-1.jpg";
import kaniwa2 from "@/assets/kaniwa-2.jpg";
import kaniwa3 from "@/assets/kaniwa-3.jpg";
import kaniwa4 from "@/assets/kaniwa-4.jpg";
import kaniwa5 from "@/assets/kaniwa-5.jpg";
import kaniwa6 from "@/assets/kaniwa-6.jpg";
import kaniwa7 from "@/assets/kaniwa-7.jpg";
import kaniwa8 from "@/assets/kaniwa-8.jpg";
import fralene1 from "@/assets/fralene-1.jpg";
import fralene2 from "@/assets/fralene-2.jpg";
import fralene3 from "@/assets/fralene-3.jpg";
import fralene4 from "@/assets/fralene-4.jpg";
import fralene5 from "@/assets/fralene-5.jpg";
import fralene6 from "@/assets/fralene-6.jpg";
import kaniwaUgc2 from "@/assets/kaniwa-ugc-2.jpg";
import kaniwaUgc3 from "@/assets/kaniwa-ugc-3.jpg";
import kaniwaUgc4 from "@/assets/kaniwa-ugc-4.jpg";
import kaniwaUgc5 from "@/assets/kaniwa-ugc-5.png";
import kaniwaUgc6 from "@/assets/kaniwa-ugc-6.jpg";
import pmyrrisUgc1 from "@/assets/pmyrris-ugc-1.webp";
import pmyrrisUgc2 from "@/assets/pmyrris-ugc-2.jpg";
import pmyrrisUgc3 from "@/assets/pmyrris-ugc-3.jpg";
import pmyrrisUgc4 from "@/assets/pmyrris-ugc-4.jpg";
import pmyrrisUgc5 from "@/assets/pmyrris-ugc-5.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const row1 = [sevmylook4, sevmylook1, sevmylook2, sevmylook7, sevmylook3, sevmylook9, sevmylook5, sevmylook8, sevmylook6];
const row2 = [kaniwa1, kaniwa2, kaniwa3, kaniwa4, kaniwa5, kaniwa6, kaniwa7, kaniwa8];
const row3 = [fralene1, fralene2, fralene3, fralene4, fralene5, fralene6];
const ugcRow1 = [kaniwaUgc2, kaniwaUgc3, kaniwaUgc4, kaniwaUgc5, kaniwaUgc6];
const ugcRow2 = [pmyrrisUgc1, pmyrrisUgc2, pmyrrisUgc3, pmyrrisUgc4, pmyrrisUgc5];

function ScrollingRow({ images, speed = 30, reverse = false }: { images: string[]; speed?: number; reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf: number;
    let pos = 0;
    const half = track.scrollWidth / 2;
    const dir = reverse ? 1 : -1;

    const animate = () => {
      pos += dir * (speed / 60);
      if (dir < 0 && pos <= -half) pos += half;
      if (dir > 0 && pos >= 0) pos -= half;
      track.style.transform = `translate3d(${pos}px, 0, 0)`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [speed, reverse]);

  const doubled = [...images, ...images];
  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex gap-3 will-change-transform" style={{ width: "max-content" }}>
        {doubled.map((src, i) => (
          <img key={i} src={src} alt={`Photo AI ${i + 1}`} loading="lazy" className="h-[200px] md:h-[260px] w-auto rounded-xl object-cover shrink-0" />
        ))}
      </div>
    </div>
  );
}

function PhotoCarousel() {
  return (
    <div className="space-y-3">
      <ScrollingRow images={row1} speed={25} />
      <ScrollingRow images={row2} speed={20} reverse />
      <ScrollingRow images={row3} speed={30} />
    </div>
  );
}

function UgcCarousel() {
  return (
    <div className="space-y-3">
      <ScrollingRow images={ugcRow1} speed={25} />
      <ScrollingRow images={ugcRow2} speed={20} reverse />
    </div>
  );
}

export default function AIPage() {
  return (
    <div className="min-h-screen bg-background -mx-6 lg:-mx-10 -mt-6 lg:-mt-10 overflow-x-hidden">

      {/* ═══ 1. HERO ═══ */}
      <div className="max-w-5xl mx-auto mt-[80px] rounded-[2.75rem] p-6 md:p-8">
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="relative z-[2]">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left: Text */}
            <div className="lg:text-left text-center">
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
                className="flex items-center gap-4 lg:justify-start justify-center mb-6">
                <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-foreground/50">
                  Shopify · WooCommerce
                </span>
              </motion.div>

              <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
                className="text-[28px] md:text-[clamp(42px,4.2vw,69px)] font-thin leading-[1.1] tracking-[-0.03em] mb-4 md:mb-6 text-foreground"
                style={{ fontFamily: "'Instrument Serif', serif" }}>
                Écosystème IA qui double{" "}
                <span className="italic text-foreground/40">vos ventes</span>
              </motion.h1>

              <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
                className="text-[14px] md:text-[17px] text-foreground/50 leading-[1.7] mb-6 md:mb-8 max-w-[580px] lg:mx-0 mx-auto">
                En e-commerce, en moyenne, seuls 2% de vos visiteurs achètent.
                Les 98% restants repartent, alors qu'une partie d'entre eux aurait dû devenir clients.
                Lystes AI résout ce problème grâce à un écosystème d'agents IA
                qui identifient, un par un, les points de friction qui vous coûtent des ventes.
              </motion.p>

              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
                className="flex flex-wrap gap-3 lg:justify-start justify-center">
                <a href="https://www.cal.eu/lystes/30min?overlayCalendar=true" target="_blank" rel="noopener noreferrer"
                  className="btn-outline">
                  <span>Prendre rendez-vous</span>
                  <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
                </a>
                <a href="/signup" className="btn-startup">
                  <span>Essai gratuit</span>
                  <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
                </a>
              </motion.div>
            </div>

            {/* Right: Mockup image */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}
              className="relative">
              <div className="relative" style={{ transform: "rotate(2deg)" }}>
                <img
                  src={aiHeroMockup}
                  alt="Lystes AI diagnostic peau"
                  className="w-full h-auto block rounded-[24px]"
                />
                {/* Floating card: skin type */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute bg-background rounded-xl px-3 py-2 lg:px-4 lg:py-3 shadow-[0_4px_24px_rgba(0,0,0,0.08)]
                    left-3 bottom-24 lg:left-[-60px] lg:top-[70px] lg:bottom-auto w-[110px] lg:w-[135px]">
                  <small className="block text-[9px] lg:text-[10px] uppercase tracking-[0.1em] text-foreground/40 mb-0.5 lg:mb-1">
                    Type de peau
                  </small>
                  <span className="text-[14px] lg:text-[16px] font-medium text-foreground">Mixte</span>
                </motion.div>

                {/* Floating card: recommended product */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute bg-background rounded-xl lg:rounded-2xl px-3 py-2 lg:px-5 lg:py-4 flex items-center gap-2 lg:gap-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.08)]
                    bottom-3 right-3 lg:bottom-6 lg:right-6">
                  <img
                    src="https://i0.wp.com/trueageskin.com/wp-content/uploads/2025/09/Ng14HDIyLnWpNrIUb72KNWGQkE1xAHi8-scaled.jpg?resize=1140%2C1512&ssl=1"
                    alt="Sérum Équilibrant Pro"
                    className="w-[36px] lg:w-[46px] h-auto rounded-lg object-cover"
                  />
                  <div>
                    <small className="block text-[9px] lg:text-[10px] uppercase tracking-[0.05em] text-foreground/40 mb-0.5">
                      Produit recommandé
                    </small>
                    <p className="text-[12px] lg:text-[14px] font-semibold text-foreground mb-0.5">
                      Sérum Équilibrant Pro
                    </p>
                    <span className="text-[11px] lg:text-[13px] text-foreground/50">28,00 €</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
      </div>

      {/* ═══ 2. AGENTS CONVERSATIONNELS ═══ */}
      <DiagnosticComparisonSection />

      {/* ═══ 3. ÉQUIPE DIAGNOSTICS AI (section sombre 1) ═══ */}
      <section className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8 text-primary-foreground">
        <LystesAiSection teams={["diagnostics"]} />
      </section>

      {/* ═══ 4. CRÉATION DE CONTENU AI (section sombre 2) ═══ */}
      <section className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8 text-primary-foreground">
        <LystesAiSection
          teams={[]}
          heroOverrides={{
            kicker: "Création de contenu",
            title: <>Automatiser la création de contenus niveau <em className="italic">studio professionnel</em></>,
            description: "Nous mettons en place une équipe Photographe AI qui génère des photos produits niveau studio professionnel, des visuels UGC avec de vrais visages pour vos réseaux sociaux et des contenus marketing. En quelques secondes, sans shooting.",
            stats: [
              { num: "∞", label: "Photos générées" },
              { num: "10s", label: "Par visuel" },
              { num: "0€", label: "Coût shooting" },
            ],
            customMedia: <PhotoCarousel />,
          }}
        />
      </section>

      {/* ═══ 4c. STRATÉGIE MARKETING AI ═══ */}
      <section className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8 text-primary-foreground">
        <LystesAiSection
          teams={["marketing", "contenu", "analytics"]}
          heroOverrides={{
            kicker: "Stratégie marketing",
            title: <>Automatiser la mise en place de plan marketing basé sur <em className="italic">vos data, le SEO et le suivi de votre trafic</em></>,
            description: "Nous mettons en place une équipe Marketing AI qui analyse votre trafic en temps réel, optimise votre référencement naturel et ajuste vos campagnes automatiquement. Des décisions basées sur la data, pas sur l'intuition.",
            stats: [
              { num: "24/7", label: "Analyse trafic" },
              { num: "100%", label: "Data-driven" },
              { num: "+40%", label: "Conversion SEO" },
            ],
            customMedia: <UgcCarousel />,
          }}
        />
      </section>

      {/* ═══ 4b. AUTOMATISATION UGC ═══ */}
      <section className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8 text-primary-foreground">
        <LystesAiSection
          teams={["marketing", "contenu", "analytics"]}
          heroOverrides={{
            kicker: "Création de contenu UGC",
            title: <>Automatiser la création de <em className="italic">contenus UGC</em> pour vos réseaux sociaux</>,
            description: "Nous mettons en place une équipe Créateur UGC AI qui génère des visuels UGC avec de vrais visages, des stories, des posts Instagram et des témoignages clients authentiques. Du contenu engageant produit en quelques secondes, sans créateurs externes.",
            stats: [
              { num: "∞", label: "Contenus générés" },
              { num: "12s", label: "Par contenu" },
              { num: "0€", label: "Coût créateur" },
            ],
            customMedia: <UgcCarousel />,
          }}
        />
      </section>

      {/* ═══ 5. ORGANIGRAMME IA ═══ */}
      <section className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8 text-primary-foreground">
        <AITeamOrgChart />
      </section>

      {/* ═══ 7. LEAKY BUCKET ═══ */}
      <section className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8 text-primary-foreground">
        <LeakyBucketSection />
      </section>

      {/* ═══ 8. DÉPLOIEMENT ═══ */}
      <section className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8 text-primary-foreground">
        <DeploymentSection />
      </section>

      {/* ═══ 9. INTERNATIONAL ═══ */}
      <section className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8 text-primary-foreground">
        <InternationalSection />
      </section>

      {/* ═══ 10. TÉMOIGNAGES ═══ */}
      <section className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8 text-primary-foreground">
        <TestimonialsSection />
      </section>

      {/* ═══ 11. CTA FINAL ═══ */}
      <section className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8 text-primary-foreground">
        <CTASection />
      </section>
    </div>
  );
}
