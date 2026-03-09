import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import SafeVideo from "@/components/SafeVideo";
import LystesAiSection from "@/components/LystesAiSection";
import AITeamOrgChart from "@/components/AITeamOrgChart";
import AIClientsShowcase from "@/components/AIClientsShowcase";
import { LeakyBucketSection, DeploymentSection, InternationalSection, SecteursSection, TestimonialsSection, CTASection } from "@/components/AIExtraSections";
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
      <div className="max-w-5xl mx-auto mt-[80px] rounded-[2.75rem] p-6 md:p-8 bg-secondary">
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
      </div>

      {/* ═══ AI SECTIONS (reuse from LystesAiSection) ═══ */}
      <section className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8 text-primary-foreground">
        <LystesAiSection />
      </section>

      {/* ═══ TEAM ORG CHART ═══ */}
      <div className="max-w-5xl mx-auto mt-8 rounded-[2.75rem] p-6 md:p-8 bg-secondary">
        <AITeamOrgChart />
      </div>

      {/* ═══ LEAKY BUCKET ═══ */}
      <div className="max-w-5xl mx-auto mt-8 rounded-[2.75rem] p-6 md:p-8 bg-secondary">
        <LeakyBucketSection />
      </div>

      {/* ═══ DÉPLOIEMENT ═══ */}
      <div className="max-w-5xl mx-auto mt-8 rounded-[2.75rem] p-6 md:p-8 bg-secondary">
        <DeploymentSection />
      </div>

      {/* ═══ INTERNATIONAL ═══ */}
      <div className="max-w-5xl mx-auto mt-8 rounded-[2.75rem] p-6 md:p-8 bg-secondary">
        <InternationalSection />
      </div>

      {/* ═══ TÉMOIGNAGES ═══ */}
      <div className="max-w-5xl mx-auto mt-8 rounded-[2.75rem] p-6 md:p-8 bg-secondary">
        <TestimonialsSection />
      </div>

      {/* ═══ CTA FINAL ═══ */}
      <div className="max-w-5xl mx-auto mt-8 mb-8 rounded-[2.75rem] p-6 md:p-8 bg-secondary">
        <CTASection />

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-foreground text-primary-foreground py-16 mt-8 rounded-t-[2.75rem]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <h5 className="text-sm font-bold mb-3">Biolystes.</h5>
              <p className="text-xs opacity-60 leading-relaxed mb-4">Écosystème IA qui double vos ventes e-commerce.</p>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="https://instagram.com/biolystes" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h6 className="text-xs font-semibold opacity-60 uppercase tracking-widest mb-3">Lystes AI</h6>
              <ul className="space-y-2 text-xs">
                <li className="opacity-60">Diagnostic IA</li>
                <li className="opacity-60">Expert Produit IA</li>
                <li className="opacity-60">Photographe IA</li>
                <li className="opacity-60">Analytics IA</li>
              </ul>
            </div>

            <div>
              <h6 className="text-xs font-semibold opacity-60 uppercase tracking-widest mb-3">Nos Engagements</h6>
              <ul className="space-y-2 text-xs">
                {["Ecocert / Cosmos", "Conformité UE 1223/2009", "Conformité FDA", "100% Végan & Cruelty-Free"].map(e => (
                  <li key={e} className="flex items-center gap-2 opacity-60">
                    <Check className="h-3 w-3 shrink-0" strokeWidth={2} />
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h6 className="text-xs font-semibold opacity-60 uppercase tracking-widest mb-3">Restons en contact</h6>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2 opacity-60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  hello@biolystes.com
                </li>
                <li className="flex items-center gap-2 opacity-60 whitespace-nowrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  6 avenue Émile Deschanel, 75007 Paris
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs opacity-40">©2025 Biolystes</p>
            <div className="flex items-center gap-6 text-xs opacity-40">
              <Link to="/mentions-legales" className="hover:opacity-100 transition-opacity">Mentions légales</Link>
              <Link to="/politique-confidentialite" className="hover:opacity-100 transition-opacity">Politique de Confidentialité</Link>
              <Link to="/cgv" className="hover:opacity-100 transition-opacity">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );
}
