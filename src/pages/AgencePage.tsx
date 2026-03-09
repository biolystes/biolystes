import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SafeVideo from "@/components/SafeVideo";
import { ArrowRight } from "lucide-react";
import LystesAiSection from "@/components/LystesAiSection";
import AvantApresSection from "@/components/AvantApresSection";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AgencePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background -mx-6 lg:-mx-10 -mt-6 lg:-mt-10 overflow-x-hidden">

      {/* ═══ 1. HERO ═══ */}
      <section id="section-decouvre" className="pt-36 pb-0 md:pt-44 md:pb-0">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-4">
            <span className="bg-foreground text-primary-foreground text-[8px] font-semibold tracking-[0.8px] uppercase px-5 py-2 rounded-full">
              En 10 jours
            </span>
            <span className="text-[8px] text-foreground font-medium tracking-[0.8px] uppercase">
              Profitez de plus de 18 ans d'expérience
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-foreground max-w-[726px] mx-auto text-[36px] md:text-[56px] lg:text-[74px]"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: "1em", letterSpacing: 0 }}>
            Lancez votre marque cosmétique bio et végane sans vous ruiner
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-base md:text-lg text-foreground max-w-2xl mx-auto leading-relaxed">
            Biolystes est une solution clé en main pour les entrepreneurs qui veulent lancer leur propre marque de cosmétiques bio et végane certifiés ECOCERT et COSMOS. Pas de stock à acheter, pas de minimum de commande, pas de graphiste, pas de webmaster, pas de photographe, ni même de logisticien pour expédier les commandes. On prend tout en charge de A à Z.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="https://app.iclosed.io/e/paylystes/r2" target="_blank" rel="noopener noreferrer" className="btn-startup">
              <span>Prendre rendez-vous</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </a>
            <button onClick={() => navigate("/chat")} className="btn-outline">
              <span>Posez vos questions</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══ 2. 18 ANS D'EXPÉRIENCE ═══ */}
      <section id="section-experience" className="py-12 md:py-16 bg-background">
        {/* Video carousel - auto-scrolling */}
        <div className="w-full overflow-hidden mb-16">
          <motion.div
            className="flex gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ width: "max-content" }}
          >
            {[
              "/videos/exp-1.mp4", "/videos/exp-2.mov", "/videos/exp-3.mov",
              "/videos/exp-9.mp4", "/videos/exp-11.mp4", "/videos/exp-12.mp4",
              "/videos/exp-4.mov", "/videos/exp-5.mov",
            ].map((src, i) => (
              <div key={i} className="flex-shrink-0 w-[200px] md:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden bg-black">
                <SafeVideo src={src} className="w-full h-full object-cover" lazy />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground leading-relaxed">
            18 ans d'expérience<br /> dans le secteur de la beauté ont donné naissance à Biolystes
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="mt-6 text-base md:text-lg text-foreground max-w-2xl mx-auto leading-relaxed">
            Nous avons éliminé les obstacles pour vous permettre de vous concentrer sur l'essentiel : bâtir une marque qui vous ressemble.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="https://kaniwabotanique.com" target="_blank" rel="noopener noreferrer" className="btn-startup">
              <span>Voir notre dernier projet</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </a>
            <a href="https://app.iclosed.io/e/paylystes/r2" target="_blank" rel="noopener noreferrer" className="btn-outline">
              <span>Demander l'accès à nos produits</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </a>
          </motion.div>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
          className="max-w-5xl mx-auto px-6 mt-20 grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            { num: "1", title: "Profitez de 18 ans d'expérience e-commerce", desc: "Nous vous accompagnons avec un savoir-faire éprouvé dans le e-commerce et la cosmétique naturelle." },
            { num: "2", title: "Offrez vous des services 360° premium", desc: "Identité visuelle, packagings et boutique en ligne conçus pour valoriser votre marque dès le départ." },
            { num: "3", title: "Profitez de notre réseau pour vous développer", desc: "Accédez à nos partenaires experts pour accélérer votre croissance sans multiplier les prestataires." },
          ].map((item) => (
            <div key={item.num} className="px-8 py-10 md:py-8">
              <span className="text-4xl text-foreground" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 100 }}>{item.num}</span>
              <h3 className="text-sm font-black uppercase tracking-wide text-foreground mt-3 mb-3">{item.title}</h3>
              <p className="text-sm text-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ═══ 3. LYSTES AI ═══ */}
      <section id="section-lystesai" className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8" style={{ overflow: "visible" }}>
        <LystesAiSection titleOverrides={{
          diagnostics: "Gestion de vos réseaux sociaux",
          expertProduit: "Gestion de votre site ecommerce",
          photographe: "Gestion de vos contenus photos et vidéos",
          seo: "Gestion de votre référencement",
          marketing: "Gestion de votre marketing",
          contenu: "Gestion de vos contenus créatifs",
          analytics: "Gestion de vos données et analytics",
        }} />
        <AvantApresSection />
      </section>

    </div>
  );
}
