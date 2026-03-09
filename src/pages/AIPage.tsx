import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SafeVideo from "@/components/SafeVideo";
import LystesAiSection from "@/components/LystesAiSection";
import aiHeroMockup from "@/assets/ai-hero-mockup.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AIPage() {
  return (
    <div className="min-h-screen bg-background -mx-6 lg:-mx-10 -mt-6 lg:-mt-10 overflow-x-hidden">

      {/* ═══ HERO ═══ */}
      <section className="min-h-screen pt-[140px] pb-[100px] relative overflow-hidden flex items-center">
        {/* Background video */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <SafeVideo
            src="/videos/ai-hero.mp4"
            className="w-full h-full object-cover"
            autoPlay
            loop
          />
        </div>

        <div className="max-w-[1280px] mx-auto px-5 md:px-10 relative z-[2]">
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
                En e-commerce, le constat est brutal : en moyenne, seuls 2% de vos visiteurs achètent.
                Les 98% restants repartent, alors qu'une partie d'entre eux aurait dû devenir clients.
                Lystes AI résout ce problème grâce à un écosystème d'agents IA autonomes et interconnectés
                qui identifient et éliminent, un par un, les points de friction qui vous coûtent des ventes.
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

      {/* ═══ AI SECTIONS (reuse from LystesAiSection) ═══ */}
      <section className="bg-foreground text-primary-foreground">
        <LystesAiSection />
      </section>
    </div>
  );
}
