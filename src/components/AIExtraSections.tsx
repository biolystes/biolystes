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
  const abandonedCarts = [
    { id: "B8#$rY3j", amount: null },
    { id: "a9X#4kZ", amount: "645,00 €" },
    { id: "Q7lmP28rT", amount: "1 482,00 €" },
    { id: "LOp#Q7", amount: "327,00 €" },
    { id: "MSSKl3n%Lq", amount: "912,00 €" },
    { id: "B8#$rY3j", amount: "2 301,00 €" },
  ];

  const agents = [
    { icon: "📋", name: "Diagnostic" },
    { icon: "✉️", name: "Expert produit" },
    { icon: "🎯", name: "Coach post-achat" },
  ];

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
          Chaque mois, vous investissez en pub, en contenu, en collaborations. Le trafic arrive. Mais sur votre site, le visiteur hésite, doute, repart — pas accompagné par un expert à chaque étape de son parcours.
        </motion.p>

        {/* Phone mockups comparison */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="flex justify-center">
          <div className="w-full max-w-[1000px] flex flex-col md:flex-row items-center md:items-start justify-center gap-6 md:gap-0 relative">

            {/* Left phone — Sans Lystes */}
            <div className="w-[280px] md:w-[320px] shrink-0">
              <div className="rounded-[32px] border-2 border-border bg-background p-5 pt-8 relative">
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[80px] h-[6px] bg-muted rounded-full" />
                <h4 className="text-[14px] font-semibold text-foreground mb-4">Votre e-commerce</h4>
                <div className="bg-muted/60 rounded-xl p-4 mb-4 text-[13px] leading-[1.8] text-foreground">
                  <div><span className="font-semibold">Visiteurs :</span> 10 000/mois</div>
                  <div><span className="font-semibold">Taux de conversion :</span> 1.8%</div>
                  <div><span className="font-semibold">Ventes :</span> 180</div>
                  <div className="text-destructive font-bold mt-1">CA perdu : -17 640€</div>
                </div>
                <h5 className="text-[12px] font-semibold text-foreground mb-2">Les abandons de panier</h5>
                <div className="space-y-0 divide-y divide-border">
                  {abandonedCarts.map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-[12px]">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-muted-foreground/50">?</span>
                        <span className="font-mono">{c.id}</span>
                      </div>
                      {c.amount && <span className="text-destructive/70">~ {c.amount}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center connector — Lystes badge */}
            <div className="hidden md:flex flex-col items-center justify-center self-center mx-[-20px] z-10">
              <div className="w-[1px] h-[40px] bg-border" />
              <div className="bg-background border border-border rounded-xl px-5 py-2.5 shadow-sm flex items-center gap-2">
                <span className="text-[14px] font-semibold text-foreground tracking-tight">Lystes</span>
              </div>
              <div className="w-[1px] h-[40px] bg-border" />
            </div>

            {/* Right phone — Avec Lystes AI */}
            <div className="w-[280px] md:w-[320px] shrink-0">
              <div className="rounded-[32px] border-2 border-foreground bg-background p-5 pt-8 relative">
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[80px] h-[6px] bg-muted rounded-full" />
                <h4 className="text-[14px] font-semibold text-foreground mb-4">Avec Lystes AI</h4>
                <div className="bg-muted/60 rounded-xl p-4 mb-4 text-[13px] leading-[1.8] text-foreground">
                  <div><span className="font-semibold">Visiteurs :</span> 10 000/mois</div>
                  <div><span className="font-semibold">Taux de conversion :</span> 3.6%</div>
                  <div><span className="font-semibold">Ventes :</span> 360</div>
                  <div className="text-green-600 font-bold mt-1">CA récupéré : +17 640€</div>
                </div>
                <div className="space-y-2.5">
                  {agents.map((a) => (
                    <div key={a.name} className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-3 text-[13px] font-medium text-foreground">
                      <span>{a.icon}</span>
                      <span>{a.name}</span>
                    </div>
                  ))}
                </div>
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
