import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ═══ LEAKY BUCKET ═══ */
function LeakyBucketSection() {
  return (
    <section className="py-[100px] md:py-[140px] bg-background">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[clamp(20px,5vw,80px)]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-center mb-6 md:mb-8">
          <span className="inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 md:mb-6">
            Pourquoi votre taux de conversion reste bas
          </span>
          <h2 className="text-[26px] md:text-[clamp(36px,5vw,56px)] font-medium tracking-[-0.03em] leading-[1.1]">
            Vous essayez de remplir un{" "}
            <span className="font-['Instrument_Serif'] italic text-muted-foreground whitespace-nowrap">seau percé.</span>
          </h2>
        </motion.div>
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-center text-[15px] md:text-[17px] text-muted-foreground leading-[1.7] max-w-[780px] mx-auto mb-16 md:mb-24">
          Chaque mois, vous investissez en pub, en contenu, en collaborations. Le trafic arrive. Mais sur votre site, le visiteur hésite, doute, repart — pas accompagné par un expert à chaque étape de son parcours sur votre e-commerce. Et vous recommencez.
        </motion.p>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="flex justify-center">
          {/* Visual: simplified wireframe of leaky bucket concept */}
          <div className="w-full max-w-[900px] bg-muted/50 rounded-3xl p-8 md:p-12 border border-border">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Sans Lystes */}
              <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground mb-4">Sans Lystes AI</div>
                <div className="relative mx-auto w-[160px] h-[200px] border-2 border-dashed border-muted-foreground/30 rounded-b-[40px] rounded-t-xl flex flex-col items-center justify-center">
                  <div className="text-[32px] font-light font-['Instrument_Serif'] italic text-muted-foreground">2%</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">conversion</div>
                  {/* Leak holes */}
                  {[30, 60, 90, 120].map((top, i) => (
                    <div key={i} className="absolute -right-3 w-2 h-2 rounded-full bg-destructive/40" style={{ top }} />
                  ))}
                </div>
                <p className="text-[12px] text-muted-foreground mt-4">98% des visiteurs repartent</p>
              </div>
              {/* Avec Lystes */}
              <div className="text-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground mb-4">Avec Lystes AI</div>
                <div className="relative mx-auto w-[160px] h-[200px] border-2 border-foreground rounded-b-[40px] rounded-t-xl flex flex-col items-center justify-center">
                  <div className="text-[32px] font-light font-['Instrument_Serif'] italic text-foreground">8%+</div>
                  <div className="text-[10px] text-foreground uppercase tracking-wide">conversion</div>
                  {/* Sealed holes */}
                  {[30, 60, 90, 120].map((top, i) => (
                    <div key={i} className="absolute -right-3 w-2 h-2 rounded-full bg-foreground flex items-center justify-center" style={{ top }}>
                      <div className="w-1 h-1 rounded-full bg-background" />
                    </div>
                  ))}
                </div>
                <p className="text-[12px] text-foreground font-medium mt-4">Chaque point de fuite est colmaté par un agent IA</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══ DÉPLOIEMENT ═══ */
function DeploymentSection() {
  return (
    <section className="py-[120px] bg-background">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[clamp(20px,5vw,80px)]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-center mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-4">Déploiement</p>
          <h2 className="text-[26px] md:text-[clamp(36px,5vw,52px)] font-medium tracking-[-0.03em] mb-4">
            Opérationnel en <em className="font-['Instrument_Serif'] italic text-muted-foreground not-italic">20 minutes</em>
          </h2>
          <p className="text-[17px] text-muted-foreground max-w-[560px] mx-auto leading-[1.7]">
            Pas besoin de développeur. Installation simple en 3 étapes.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 border-t border-b border-border">
          {[
            { step: "01", title: "Connectez", desc: "Importez votre catalogue produits depuis Shopify, WooCommerce ou via CSV. Synchronisation automatique des nouveautés." },
            { step: "02", title: "Personnalisez", desc: "Définissez le ton de vos experts, vos couleurs de marque et les connaissances spécifiques à transmettre." },
            { step: "03", title: "Activez", desc: "Copiez une ligne de code ou installez l'app. Vos experts sont opérationnels immédiatement." },
          ].map((s, i) => (
            <motion.div key={s.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className={`px-10 py-12 ${i < 2 ? "md:border-r border-border" : ""} ${i > 0 ? "md:border-t-0 border-t border-border" : ""}`}>
              <div className="text-[10px] font-bold text-muted-foreground tracking-[0.12em] uppercase mb-5">Étape {s.step}</div>
              <h3 className="text-[22px] font-medium tracking-[-0.02em] mb-3 text-foreground">{s.title}</h3>
              <p className="text-[14px] text-muted-foreground leading-[1.7]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ INTERNATIONAL ═══ */
function InternationalSection() {
  const languages = [
    { flag: "🇫🇷", name: "Français", active: true },
    { flag: "🇬🇧", name: "English", active: true },
    { flag: "🇪🇸", name: "Español" },
    { flag: "🇩🇪", name: "Deutsch" },
    { flag: "🇮🇹", name: "Italiano" },
    { flag: "🇨🇳", name: "中文" },
  ];

  return (
    <section className="py-[120px] bg-muted">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[clamp(20px,5vw,80px)]">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-4">International</p>
            <h2 className="text-[24px] md:text-[clamp(32px,4vw,40px)] font-medium tracking-[-0.03em] mb-5">
              Vos experts parlent <em className="font-['Instrument_Serif'] italic text-muted-foreground not-italic">100+ langues</em>
            </h2>
            <p className="text-[16px] text-muted-foreground leading-[1.7] mb-8">
              Pas de traduction. Vos experts répondent nativement dans la langue du client, avec les nuances culturelles adaptées.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {languages.map(l => (
                <span key={l.name} className={`px-[18px] py-2.5 rounded-lg text-[13px] font-medium ${
                  l.active ? "bg-foreground text-background border border-foreground" : "bg-background border border-border"
                }`}>
                  {l.flag} {l.name}
                </span>
              ))}
              <span className="px-[18px] py-2.5 rounded-lg text-[13px] font-medium bg-background border border-border">+95 autres</span>
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="md:order-none order-first">
            <div className="w-[280px] h-[280px] border border-border rounded-full flex items-center justify-center relative bg-background mx-auto">
              <div className="absolute w-2 h-2 bg-foreground rounded-full top-[25%] left-[25%]" />
              <div className="absolute w-1.5 h-1.5 bg-muted-foreground/50 rounded-full bottom-[35%] right-[30%]" />
              <div className="text-center">
                <div className="text-[48px] font-semibold tracking-[-0.03em] text-foreground">100+</div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground">Langues natives</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══ SECTEURS ═══ */
function SecteursSection() {
  const sectors = [
    { name: "Skincare", desc: "Diagnostic peau, recommandations personnalisées", active: true },
    { name: "Capillaire", desc: "Analyse cheveux, routines sur-mesure", active: true },
    { name: "Optique", desc: "Essayage virtuel, morphologie visage", active: true },
    { name: "Perruques", desc: "Try-on IA, conseils couleur et coupe", active: true },
    { name: "Maquillage", desc: "Teintes adaptées, tutoriels personnalisés", active: false },
    { name: "Parfumerie", desc: "Profil olfactif, recommandations", active: false },
    { name: "Mode", desc: "Style, tailles, associations", active: false },
    { name: "Compléments", desc: "Besoins nutritionnels, dosages", active: false },
  ];

  return (
    <section className="py-[120px] bg-background">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[clamp(20px,5vw,80px)]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-center mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-4">Secteurs</p>
          <h2 className="text-[26px] md:text-[clamp(36px,5vw,52px)] font-medium tracking-[-0.03em] mb-4">
            Multi-secteurs <em className="font-['Instrument_Serif'] italic text-muted-foreground not-italic">pour chaque besoin</em>
          </h2>
          <p className="text-[17px] text-muted-foreground max-w-[560px] mx-auto leading-[1.7]">
            Lystes AI s'adapte à votre vertical avec des agents spécialisés.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-5">
          {sectors.map((s, i) => (
            <motion.div key={s.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.5}
              className="p-7 border border-border rounded-2xl hover:border-foreground hover:-translate-y-1 transition-all bg-background">
              <div className={`inline-block text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded mb-4 ${
                s.active ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
              }`}>
                {s.active ? "Actif" : "Bientôt"}
              </div>
              <h3 className="text-[18px] font-medium tracking-[-0.02em] mb-2 text-foreground">{s.name}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ TÉMOIGNAGES ═══ */
function TestimonialsSection() {
  const testimonials = [
    {
      text: "En 3 semaines, notre taux de conversion a bondi de 85%. Les experts IA répondent aux questions que nos fiches produits ne couvrent pas.",
      name: "Marie D.",
      role: "CEO, Marque Cosmétique",
      initial: "M",
    },
    {
      text: "Le diagnostic peau dans nos campagnes TikTok a généré +200% de leads qualifiés.",
      name: "Sophie M.",
      role: "CMO, Marque Skincare",
      initial: "S",
    },
    {
      text: "On a remplacé 3 outils SaaS par Lystes AI. Tout est centralisé, intelligent, et nos clients adorent le diagnostic.",
      name: "Thomas R.",
      role: "Fondateur, E-shop Bio",
      initial: "T",
    },
  ];

  return (
    <section className="py-[120px] bg-muted">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[clamp(20px,5vw,80px)]">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-center mb-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-4">Témoignages</p>
          <h2 className="text-[26px] md:text-[clamp(36px,5vw,52px)] font-medium tracking-[-0.03em]">
            Ce qu'ils en <em className="font-['Instrument_Serif'] italic text-muted-foreground not-italic">pensent</em>
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-background rounded-[20px] p-8">
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-foreground text-foreground" />
                ))}
              </div>
              <p className="text-[15px] text-muted-foreground leading-[1.7] mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 bg-muted rounded-full flex items-center justify-center text-[16px] font-semibold text-muted-foreground">
                  {t.initial}
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-foreground">{t.name}</div>
                  <div className="text-[12px] text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ CTA FINAL ═══ */
function CTASection() {
  return (
    <section className="py-[120px] md:py-[160px] bg-foreground">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[clamp(20px,5vw,80px)] text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <h2 className="text-[28px] md:text-[clamp(40px,5vw,60px)] font-medium tracking-[-0.03em] mb-6 text-background leading-[1.1]">
            Prêt à doubler vos <em className="font-['Instrument_Serif'] italic text-background/50 not-italic">ventes ?</em>
          </h2>
          <p className="text-[16px] md:text-[18px] text-background/50 leading-[1.7] max-w-[560px] mx-auto mb-10">
            Rejoignez les marques qui ont déjà recruté leurs équipes IA. Déploiement en 20 minutes, sans engagement.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="https://www.cal.eu/lystes/30min?overlayCalendar=true" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-background/30 text-background text-[14px] font-medium hover:bg-background/10 transition-colors">
              <span>Prendre rendez-vous</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-background text-foreground text-[14px] font-medium hover:bg-background/90 transition-colors">
              <span>Essai gratuit</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export {
  LeakyBucketSection,
  DeploymentSection,
  InternationalSection,
  SecteursSection,
  TestimonialsSection,
  CTASection,
};
