import { motion } from "framer-motion";
import { Check, Play } from "lucide-react";
import SafeVideo from "@/components/SafeVideo";
import kaniwaUgc2 from "@/assets/kaniwa-ugc-2.jpg";


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
            <div className="flex gap-3.5 flex-wrap">
              <div className="flex-1 min-w-[140px] rounded-2xl overflow-hidden relative">
                <img src={kaniwaUgc2} alt="Avis client UGC" className="w-full h-[480px] object-cover block" />
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
            {/* Product card mockup */}
            <div className="flex justify-center">
              <div className="w-[320px] bg-background rounded-[2rem] overflow-hidden border border-border">
                <div className="flex items-center justify-between px-5 pt-10 pb-4 z-20">
                  <div className="flex items-center gap-3">
                    <Menu className="w-4 h-4 text-foreground" />
                    <Search className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="font-serif font-bold text-xl tracking-wide text-foreground">Kaniwa</div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-foreground" />
                    <div className="relative">
                      <ShoppingBag className="w-4 h-4 text-foreground" />
                      <span className="absolute -top-1 -right-1 bg-foreground text-primary-foreground text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">1</span>
                    </div>
                  </div>
                </div>
                <div className="bg-foreground text-primary-foreground text-center text-[9px] font-semibold tracking-[2px] uppercase py-1.5">
                  Livraison gratuite aujourd'hui
                </div>
                <img src={kaniwa6} alt="Crème de jour" className="w-full h-[200px] object-cover" />
                <div className="px-4 pt-3.5 pb-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex text-foreground text-xs">
                      {[...Array(4)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                      <StarHalf className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span className="text-xs font-bold text-foreground">4.8/5</span>
                    <span className="text-xs text-muted-foreground">(241 avis)</span>
                  </div>
                  <h3 className="text-lg font-bold leading-tight text-foreground mb-1">Crème de jour anti-âge</h3>
                  <p className="text-[10px] font-bold text-muted-foreground">Vitiligo · Pores dilatés · Rougeurs</p>
                </div>
                <div className="mx-3.5 bg-muted/50 rounded-2xl p-3 flex flex-col gap-2">
                  <div className="bg-background border border-border rounded-2xl rounded-tl-sm px-3 py-2.5 text-xs text-foreground leading-snug max-w-[90%]">
                    Parfait ! J'ai analysé votre diagnostic. Peau de type <strong>Mixte</strong>. Comment puis-je vous aider ?
                  </div>
                  <div className="self-end bg-foreground text-primary-foreground rounded-2xl rounded-tr-sm px-3 py-2.5 text-xs leading-snug max-w-[80%]">
                    Cette crème est adaptée aux peaux mixtes et métisses ?
                  </div>
                  <div className="bg-background border border-border rounded-2xl rounded-tl-sm px-3 py-2.5 text-xs text-foreground leading-snug max-w-[90%]">
                    Absolument ! Notre formule contient des extraits marins et de l'acide hyaluronique, parfaitement adaptés.
                  </div>
                </div>
                <div className="mx-3.5 mt-3.5 mb-4">
                  <button className="w-full bg-foreground text-primary-foreground py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase">
                    Ajouter au panier — 49,90 €
                  </button>
                </div>
              </div>
            </div>
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
