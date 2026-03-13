import { motion } from "framer-motion";
import { Check, Play, Star } from "lucide-react";
import SafeVideo from "@/components/SafeVideo";



const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function GlowlySection() {
  return (
    <section id="section-glowly" className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8" style={{ overflow: "visible" }}>

      {/* ─── Hero intro ─── */}
      <div className="text-center max-w-5xl mx-auto px-6 pt-24 pb-12">
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-[10px] font-bold tracking-[2.5px] uppercase text-cream/50 mb-5">
          Votre équipe intégrée
        </motion.p>
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-3xl md:text-4xl font-light tracking-tight max-w-[780px] mx-auto mb-6 text-cream">
          Comment maximiser vos résultats dès les premiers mois, indépendamment de nos services ?
        </motion.h2>
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="text-[17px] text-cream/50 leading-[1.7] max-w-[600px] mx-auto">
          En tant que nouvelle marque, le plus important est de gérer votre e-réputation et votre exposition.
        </motion.p>
      </div>

      {/* ─── Block 1 — Créatrices de contenu ─── */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        className="bg-background py-14 md:py-20 rounded-2xl">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 min-w-[260px]">
            <span className="inline-block bg-foreground text-primary-foreground text-[10px] font-bold tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-5">
              Contenu UGC
            </span>
            <h3 className="text-[30px] font-light leading-[1.25] text-foreground mb-3.5">
              Faites appel à des créatrices de contenu pour parler de vos produits
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.7]">
              Collaborez avec des créatrices de contenu qui présentent vos produits de manière authentique. Elles génèrent des vidéos engageantes, des avis sincères et du contenu prêt à publier sur vos réseaux sociaux, augmentant votre crédibilité et votre visibilité.
            </p>
          </div>
          <div className="flex-[1.5] min-w-[300px] w-full">
            <SafeVideo src="/videos/fralene-ugc.mp4" className="w-full h-[400px] object-cover rounded-2xl" />
          </div>
        </div>
      </motion.div>

      {/* ─── Block 2 — Trustpilot & Avis ─── */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
        className="bg-secondary py-14 md:py-20 rounded-2xl mt-4">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 min-w-[260px]">
            <span className="inline-block bg-foreground text-primary-foreground text-[10px] font-bold tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-5">
              E-Réputation
            </span>
            <h3 className="text-[30px] font-light leading-[1.25] text-foreground mb-3.5">
              Ouvrez un compte Trustpilot et récoltez des avis clients
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.7]">
              Les avis clients sont la pierre angulaire de votre crédibilité en ligne. Créez votre profil Trustpilot, encouragez vos premiers clients à laisser un avis et construisez une réputation solide qui rassure et convertit les visiteurs en acheteurs.
            </p>
            <a href="https://fr.trustpilot.com/review/glowlyparis.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary underline underline-offset-4 mt-3 hover:opacity-80 transition-opacity">
              Voir un exemple de page Trustpilot →
            </a>
          </div>
          <div className="flex-[1.5] min-w-[300px] w-full">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden">
                <SafeVideo src="/videos/trustpilot-ugc.mp4" className="w-full h-[480px] object-cover" />
              </div>
              {/* Trustpilot badge */}
              <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-3 shadow-lg flex items-center gap-4 max-w-[280px]">
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-black text-foreground leading-none">4,3</span>
                  <span className="text-[10px] font-bold text-foreground mt-0.5">Excellent</span>
                  <div className="flex mt-1">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#00b67a] text-[#00b67a]" />
                    ))}
                    <Star className="w-3 h-3 fill-[#00b67a]/40 text-[#00b67a]" />
                  </div>
                  <span className="text-[9px] text-muted-foreground mt-0.5">12 avis</span>
                </div>
                <div className="flex flex-col gap-[3px] flex-1">
                  {[{ label: "5", pct: 75 }, { label: "4", pct: 18 }, { label: "3", pct: 0 }, { label: "2", pct: 0 }, { label: "1", pct: 0 }].map((r) => (
                    <div key={r.label} className="flex items-center gap-1.5">
                      <span className="text-[9px] text-muted-foreground w-[14px] text-right">{r.label}★</span>
                      <div className="flex-1 h-[6px] bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#00b67a] rounded-full" style={{ width: `${r.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Block 3 — Sponsoriser le contenu ─── */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
        className="bg-secondary py-14 md:py-20 rounded-2xl mt-4">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 min-w-[260px]">
            <span className="inline-block bg-foreground text-primary-foreground text-[10px] font-bold tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-5">
              Publicité
            </span>
            <h3 className="text-[30px] font-light leading-[1.25] text-foreground mb-3.5">
              Sponsorisez les vidéos de vos créatrices de contenu
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.7]">
              Transformez le contenu UGC de vos créatrices en publicités performantes. En sponsorisant leurs vidéos sur Instagram et TikTok, vous amplifiez votre portée et touchez une audience qualifiée, prête à découvrir votre marque.
            </p>
          </div>
          <div className="flex-[1.5] min-w-[300px] w-full">
            <SafeVideo src="/videos/contenu-ugc-2.mov" className="w-full rounded-2xl" />
          </div>
        </div>
      </motion.div>

      {/* ─── Block 4 — Publicité Instagram & TikTok ─── */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
        className="bg-background py-14 md:py-20 rounded-2xl mt-4">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 min-w-[260px]">
            <span className="inline-block bg-foreground text-primary-foreground text-[10px] font-bold tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-5">
              Stratégie Marketing
            </span>
            <h3 className="text-[30px] font-light leading-[1.25] text-foreground mb-3.5">
              Lancez des publicités sur Instagram et TikTok
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.7]">
              Mettez en place des campagnes publicitaires ciblées sur les réseaux sociaux. Créez des plans d'action personnalisés, des campagnes email et des stratégies de conversion pour maximiser vos ventes dès les premiers mois.
            </p>
          </div>
          <div className="flex-[1.5] min-w-[300px] w-full">
            <SafeVideo src="/videos/publicite-social.mov" className="w-full rounded-2xl" />
          </div>
        </div>
      </motion.div>

    </section>
  );
}
