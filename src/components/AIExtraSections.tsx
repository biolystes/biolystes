import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";
import leakyBucketImg from "@/assets/leaky-bucket.webp";

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
    <div className="text-center pt-24 pb-12 px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        className="mb-6 md:mb-8">
        <span className="inline-block text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-cream/50 mb-4 md:mb-6">
          Pourquoi votre taux de conversion reste bas
        </span>
        <h2 className="text-[26px] md:text-[clamp(36px,5vw,56px)] font-medium tracking-[-0.03em] leading-[1.1] text-cream">
          Vous essayez de remplir un{" "}
          <span className="font-['Instrument_Serif'] italic text-cream/50 whitespace-nowrap">seau percé.</span>
        </h2>
      </motion.div>
      <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
        className="text-[15px] md:text-[17px] text-cream/50 leading-[1.7] max-w-[780px] mx-auto mb-16 md:mb-24">
        Chaque mois, vous investissez en pub, en contenu, en collaborations. Le trafic arrive. Mais sur votre site, le visiteur hésite, doute, repart — pas accompagné par un expert à chaque étape de son parcours.
      </motion.p>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
        className="flex justify-center">
        <img
          src={leakyBucketImg}
          alt="Comparaison e-commerce sans et avec Biolystes AI — CA perdu vs CA récupéré"
          className="w-full max-w-[960px] h-auto"
        />
      </motion.div>
    </div>
  );
}

/* ═══ DÉPLOIEMENT ═══ */
function DeploymentSection() {
  return (
    <div className="pt-24 pb-12 px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        className="text-center mb-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cream/50 mb-4">Déploiement</p>
        <h2 className="text-[26px] md:text-[clamp(36px,5vw,52px)] font-medium tracking-[-0.03em] mb-4 text-cream">
          Opérationnel en <em className="font-['Instrument_Serif'] italic text-cream/50 not-italic">20 minutes</em>
        </h2>
        <p className="text-[17px] text-cream/50 max-w-[560px] mx-auto leading-[1.7]">
          Pas besoin de développeur. Installation simple en 3 étapes.
        </p>
      </motion.div>
      <div className="grid md:grid-cols-3 border-t border-b border-cream/10">
        {[
          { step: "01", title: "Connectez", desc: "Importez votre catalogue produits depuis Shopify, WooCommerce ou via CSV. Synchronisation automatique des nouveautés." },
          { step: "02", title: "Personnalisez", desc: "Définissez le ton de vos experts, vos couleurs de marque et les connaissances spécifiques à transmettre." },
          { step: "03", title: "Activez", desc: "Copiez une ligne de code ou installez l'app. Vos experts sont opérationnels immédiatement." },
        ].map((s, i) => (
          <motion.div key={s.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
            className={`px-10 py-12 ${i < 2 ? "md:border-r border-cream/10" : ""} ${i > 0 ? "md:border-t-0 border-t border-cream/10" : ""}`}>
            <div className="text-[10px] font-bold text-cream/40 tracking-[0.12em] uppercase mb-5">Étape {s.step}</div>
            <h3 className="text-[22px] font-medium tracking-[-0.02em] mb-3 text-cream">{s.title}</h3>
            <p className="text-[14px] text-cream/50 leading-[1.7]">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
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
    <div className="pt-24 pb-12 px-6">
      <div className="grid md:grid-cols-2 gap-20 items-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cream/50 mb-4">International</p>
          <h2 className="text-[24px] md:text-[clamp(32px,4vw,40px)] font-medium tracking-[-0.03em] mb-5 text-cream">
            Vos experts parlent <em className="font-['Instrument_Serif'] italic text-cream/50 not-italic">100+ langues</em>
          </h2>
          <p className="text-[16px] text-cream/50 leading-[1.7] mb-8">
            Pas de traduction. Vos experts répondent nativement dans la langue du client, avec les nuances culturelles adaptées.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {languages.map(l => (
              <span key={l.name} className={`px-[18px] py-2.5 rounded-lg text-[13px] font-medium ${
                l.active ? "bg-cream text-foreground border border-cream" : "bg-cream/10 border border-cream/20 text-cream/70"
              }`}>
                {l.flag} {l.name}
              </span>
            ))}
            <span className="px-[18px] py-2.5 rounded-lg text-[13px] font-medium bg-cream/10 border border-cream/20 text-cream/70">+95 autres</span>
          </div>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="md:order-none order-first">
          <div className="w-[280px] h-[280px] border border-cream/20 rounded-full flex items-center justify-center relative mx-auto">
            <div className="absolute w-2 h-2 bg-cream rounded-full top-[25%] left-[25%]" />
            <div className="absolute w-1.5 h-1.5 bg-cream/50 rounded-full bottom-[35%] right-[30%]" />
            <div className="text-center">
              <div className="text-[48px] font-semibold tracking-[-0.03em] text-cream">100+</div>
              <div className="text-[11px] uppercase tracking-[0.1em] text-cream/50">Langues natives</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
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
    <div className="pt-24 pb-12 px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        className="text-center mb-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cream/50 mb-4">Secteurs</p>
        <h2 className="text-[26px] md:text-[clamp(36px,5vw,52px)] font-medium tracking-[-0.03em] mb-4 text-cream">
          Multi-secteurs <em className="font-['Instrument_Serif'] italic text-cream/50 not-italic">pour chaque besoin</em>
        </h2>
        <p className="text-[17px] text-cream/50 max-w-[560px] mx-auto leading-[1.7]">
          Lystes AI s'adapte à votre vertical avec des agents spécialisés.
        </p>
      </motion.div>
      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-5">
        {sectors.map((s, i) => (
          <motion.div key={s.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.5}
            className="p-7 border border-cream/10 rounded-2xl hover:border-cream/30 hover:-translate-y-1 transition-all">
            <div className={`inline-block text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded mb-4 ${
              s.active ? "bg-cream text-foreground" : "bg-cream/10 text-cream/50"
            }`}>
              {s.active ? "Actif" : "Bientôt"}
            </div>
            <h3 className="text-[18px] font-medium tracking-[-0.02em] mb-2 text-cream">{s.name}</h3>
            <p className="text-[13px] text-cream/50 leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══ TÉMOIGNAGES ═══ */
function TestimonialsSection() {
  const testimonials = [
    {
      text: "L'agent IA sur nos fiches produits répond aux questions que nos clientes posaient par DM. On gagne un temps fou et elles achètent plus sereinement.",
      name: "Sev Formal",
      role: "CEO, Sevmylook",
      initial: "S",
    },
    {
      text: "Depuis qu'on a intégré le diagnostic sur notre site, nos clients comprennent mieux quel produit leur correspond. Ça a clairement réduit les retours.",
      name: "Sambou",
      role: "CEO, 235th Barber",
      initial: "S",
    },
    {
      text: "Nos agents conversationnels connaissent nos formulations mieux que nous. Les clientes posent des questions pointues sur les actifs et elles obtiennent des réponses précises instantanément.",
      name: "Léa",
      role: "Fondatrice, Trueage Skin",
      initial: "L",
    },
  ];

  return (
    <div className="pt-24 pb-12 px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        className="text-center mb-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cream/50 mb-4">Témoignages</p>
        <h2 className="text-[26px] md:text-[clamp(36px,5vw,52px)] font-medium tracking-[-0.03em] text-cream">
          Ce qu'ils en <em className="font-['Instrument_Serif'] italic text-cream/50 not-italic">pensent</em>
        </h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
            className="bg-cream/5 border border-cream/10 rounded-[20px] p-8">
            <div className="flex gap-1 mb-5">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-cream text-cream" />
              ))}
            </div>
            <p className="text-[15px] text-cream/60 leading-[1.7] mb-6">"{t.text}"</p>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-cream/10 rounded-full flex items-center justify-center text-[16px] font-semibold text-cream/60">
                {t.initial}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-cream">{t.name}</div>
                <div className="text-[12px] text-cream/50">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══ CTA FINAL ═══ */
function CTASection() {
  return (
    <div className="pt-24 pb-12 px-6 text-center">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
        <h2 className="text-[28px] md:text-[clamp(40px,5vw,60px)] font-medium tracking-[-0.03em] mb-6 text-cream leading-[1.1]">
          Prêt à doubler vos <em className="font-['Instrument_Serif'] italic text-cream/50 not-italic">ventes ?</em>
        </h2>
        <p className="text-[16px] md:text-[18px] text-cream/50 leading-[1.7] max-w-[560px] mx-auto mb-10">
          Rejoignez les marques qui ont déjà recruté leurs équipes IA. Déploiement en 20 minutes, sans engagement.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="https://www.cal.eu/lystes/30min?overlayCalendar=true" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-cream/30 text-cream text-[14px] font-medium hover:bg-cream/10 transition-colors">
            <span>Prendre rendez-vous</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-cream text-foreground text-[14px] font-medium hover:bg-cream/90 transition-colors">
            <span>Essai gratuit</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </div>
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
