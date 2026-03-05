import { useRef } from "react";
import { motion } from "framer-motion";
import { Check, Info, ArrowRight } from "lucide-react";

const RDV_URL = "https://app.iclosed.io/e/paylystes/r2";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <Check size={14} strokeWidth={2} className="flex-shrink-0 mt-0.5 text-muted-foreground" />
      <span className="text-[13px] leading-relaxed text-muted-foreground">{text}</span>
    </div>
  );
}

function DeductionBanner({ text }: { text: string }) {
  return (
    <div className="rounded-2xl px-6 py-5 text-center bg-secondary border border-border">
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <Info size={14} strokeWidth={1.8} className="text-muted-foreground" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Bon à savoir</span>
      </div>
      <p className="text-[13px] leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

// ─── PACK DÉCOUVERTE ──────────────────────────────────────
function PackDecouverte() {
  return (
    <div className="relative rounded-2xl p-7 md:p-9 flex flex-col border-2 border-foreground">
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-foreground text-background">
        Pack découverte
      </div>

      <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-tight mb-1 mt-2 text-foreground">
        Testez nos produits — 147€
      </h3>
      <p className="text-sm mb-8 text-muted-foreground leading-relaxed">
        ou 3× 49€ — Validez la qualité avant de vous lancer
      </p>

      <div className="flex flex-col mb-8">
        {[
          "4 produits échantillons (sérum, crème, nettoyant, soin spécifique)",
          "Accompagnement personnalisé dans la sélection par nos experts",
          "Étiquetage standard conforme Biolystes",
          "Certifié Bio & Végan / COSMOS / ECOCERT / FDA",
          "Livraison incluse sous 7 à 8 jours",
        ].map((t, i) => <CheckItem key={i} text={t} />)}
      </div>

      <a href={RDV_URL} target="_blank" rel="noopener noreferrer"
        className="block w-full py-4 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase rounded-xl bg-foreground text-background border-2 border-foreground hover:opacity-90 transition-opacity mt-auto">
        Commander mes échantillons
      </a>
    </div>
  );
}

// ─── PACK AGENCE ──────────────────────────────────────────
function PackAgence() {
  return (
    <div className="relative rounded-2xl p-7 md:p-9 flex flex-col border-2 border-foreground">
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-foreground text-background">
        Populaire
      </div>

      <h3 className="text-base font-extrabold uppercase tracking-tight mb-0.5 mt-2 text-foreground">Pack Agence</h3>
      <p className="text-xs mb-5 text-muted-foreground">Gestion 360°</p>

      <div className="mb-2">
        <span className="text-3xl md:text-[34px] font-extrabold text-foreground tracking-tight">1 499€</span>
        <span className="text-[13px] ml-2 text-muted-foreground">frais uniques ou 999€ en 2 fois</span>
      </div>

      <div className="rounded-xl p-4 mb-7 bg-muted/50 border border-border">
        <p className="text-xs font-extrabold uppercase tracking-wide mb-0.5 text-foreground">+ Abonnement Pro inclus obligatoire</p>
        <p className="text-2xl font-extrabold my-0.5 text-foreground">99€<span className="text-[13px] font-medium text-muted-foreground">/mois</span></p>
        <p className="text-[11px] mt-0.5 text-muted-foreground">Hébergement, livraisons, SEO, support & IA inclus</p>
      </div>

      <div className="flex flex-col mb-8">
        {[
          "Création de logo", "Design Packaging", "Contenu textuel clé en main",
          "Photographie IA hyperréaliste", "Site e-commerce", "Indexation Google",
          "Automatisation livraison", "Support premium", "Expert produit dédié en votre nom",
          "Achat de stock pas nécessaire", "Aucune quantité min en cas d'achat de stock",
          "Optimisation SEO avancée", "CRO standard",
        ].map((f, i) => <CheckItem key={i} text={f} />)}
      </div>

      <a href={RDV_URL} target="_blank" rel="noopener noreferrer"
        className="block w-full py-4 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase rounded-xl bg-foreground text-background border-2 border-foreground hover:opacity-90 transition-opacity mt-auto">
        Prendre RDV
      </a>
    </div>
  );
}

// ─── PACK IA ──────────────────────────────────────────────
function PackIA() {
  return (
    <div className="relative rounded-2xl p-7 md:p-9 flex flex-col border border-border">
      <h3 className="text-base font-extrabold uppercase tracking-tight mb-0.5 text-foreground">Pack IA</h3>
      <p className="text-xs mb-5 text-muted-foreground">Gestion 360° + Intelligence artificielle avancée</p>

      <div className="mb-2">
        <span className="text-3xl md:text-[34px] font-extrabold text-foreground tracking-tight">2 999€</span>
        <span className="text-[13px] ml-2 text-muted-foreground">frais uniques ou 999€ en 2 fois</span>
      </div>

      <div className="rounded-xl p-4 mb-7 bg-muted/50 border border-border">
        <p className="text-xs font-extrabold uppercase tracking-wide mb-0.5 text-foreground">+ Abonnement Pro inclus obligatoire</p>
        <p className="text-2xl font-extrabold my-0.5 text-foreground">199€<span className="text-[13px] font-medium text-muted-foreground">/mois</span></p>
        <p className="text-[11px] mt-0.5 text-muted-foreground">1er mois offert · Tout le Pro + UGC IA, diagnostic IA & réseaux sociaux</p>
      </div>

      <div className="flex flex-col mb-8">
        {[
          "Création de logo", "Design Packaging", "Contenu textuel clé en main",
          "Photographie IA hyperréaliste", "Site e-commerce", "Indexation Google",
          "Automatisation livraison", "Support premium", "Expert produit dédié en votre nom",
          "Achat de stock pas nécessaire", "Aucune quantité min en cas d'achat de stock",
          "UGC IA Ultraréaliste", "Optimisation SEO avancée", "CRO standard",
          "Expert produit dédié", "Diagnostic intelligent par IA (Option)",
          "Recommandations produits par IA", "Gestion réseaux sociaux 1 mois",
        ].map((f, i) => <CheckItem key={i} text={f} />)}
      </div>

      <a href={RDV_URL} target="_blank" rel="noopener noreferrer"
        className="block w-full py-4 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase rounded-xl bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-all mt-auto">
        Prendre RDV
      </a>
    </div>
  );
}

// ─── ABONNEMENTS ──────────────────────────────────────────
function AbonnementSection() {
  return (
    <section className="mt-24 md:mt-32">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
        <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">Abonnements mensuels</motion.p>
        <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl font-light tracking-tight text-foreground">
          Boostez votre marque avec nos services
        </motion.h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: "Marketing + CRO",
            desc: "Boostez vos ventes avec une stratégie marketing complète et l'optimisation de vos conversions.",
            price: "699€",
            sub: "Engagement flexible",
            recommended: true,
            features: [
              "Création & optimisation publicités Meta", "Publicités TikTok Ads",
              "Media Buying stratégique", "Optimisation des conversions (CRO)",
              "A/B testing pages & tunnels", "Référencement naturel (SEO)",
              "Suivi des performances publicitaires", "Conseil stratégique mensuel",
              "Rapports détaillés & ROI", "Support prioritaire dédié",
            ],
          },
          {
            title: "Community Manager",
            desc: "Déléguez la gestion de vos réseaux sociaux à nos experts.",
            price: "699€",
            sub: "Engagement flexible",
            recommended: false,
            features: [
              "Gestion Instagram & Facebook", "Gestion TikTok", "Gestion Pinterest",
              "Calendrier éditorial mensuel", "Création de contenu (posts & stories)",
              "Modération & engagement communauté", "Rapports de performance mensuels", "Support dédié",
            ],
          },
        ].map((item, idx) => (
          <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={idx}
            className={`relative rounded-2xl p-7 md:p-9 flex flex-col ${
              item.recommended ? "border-2 border-foreground" : "border border-border"
            }`}>
            {item.recommended && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-foreground text-background">
                Recommandé
              </div>
            )}
            <h3 className="text-base font-extrabold uppercase tracking-tight mb-2 mt-1 text-foreground">{item.title}</h3>
            <p className="text-[13px] mb-4 text-muted-foreground leading-relaxed">{item.desc}</p>
            <div className="mb-1">
              <span className="text-2xl md:text-[32px] font-extrabold text-foreground">{item.price}</span>
              <span className="text-[13px] ml-1.5 text-muted-foreground">/mois</span>
            </div>
            <p className="text-xs font-semibold mb-6 text-muted-foreground">{item.sub}</p>
            <div className="flex flex-col mb-8 flex-1">
              {item.features.map((f, i) => <CheckItem key={i} text={f} />)}
            </div>
            <a href={RDV_URL} target="_blank" rel="noopener noreferrer"
              className={`block w-full py-4 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase rounded-xl transition-all mt-auto ${
                item.recommended
                  ? "bg-foreground text-background border-2 border-foreground hover:opacity-90"
                  : "bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background"
              }`}>
              Prendre RDV
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── MAIN ─────────────────────────────────────────────────
export default function PricingPage() {
  const packRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const scrollTo = (key: string) => {
    packRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12 text-center mt-4 md:mt-[90px]">
        <h1 className="text-2xl md:text-[42px] font-extrabold uppercase leading-tight tracking-tight mb-3 text-foreground">
          Des forfaits transparents<br className="hidden md:block" /><span className="md:hidden"> </span>et adaptés à votre ambition
        </h1>
        <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
          Le premier mois de l'abonnement est toujours offert !
        </p>
      </motion.div>

      {/* Step Progress */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.3 }}
        className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 mb-10 md:mb-14">
        {[
          { key: "decouverte", step: "1", label: "Je teste", price: "Dès 147€" },
          { key: "agence", step: "2", label: "Je lance", price: "Dès 1 499€" },
          { key: "ia", step: "3", label: "Je lance + IA", price: "Dès 2 999€" },
        ].map((s, i) => (
          <div key={s.key} className="flex items-center gap-0">
            <button
              onClick={() => scrollTo(s.key)}
              className="flex flex-col items-center px-6 md:px-8 py-3.5 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-border"
            >
              <span className="text-[11px] uppercase tracking-widest mb-0.5 text-muted-foreground font-semibold">
                {s.step}. {s.label}
              </span>
              <span className="text-[12px] text-muted-foreground">{s.price}</span>
            </button>
            {i < 2 && <ArrowRight size={14} strokeWidth={1.8} className="text-muted-foreground hidden md:block mx-1" />}
          </div>
        ))}
      </motion.div>

      {/* All 3 packs */}
      <div className="space-y-8">
        <motion.div ref={(el) => { packRefs.current.decouverte = el; }}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="w-full">
          <PackDecouverte />
          <div className="mt-5">
            <DeductionBanner text="147€ déduits de toute Offre Avec Site souscrite dans les 30 jours. Votre test devient un acompte, pas une dépense." />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <motion.div ref={(el) => { packRefs.current.agence = el; }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <PackAgence />
            <div className="mt-5">
              <DeductionBanner text="Vous avez commandé un Pack Échantillon ? Vos 147€ sont déduits de la mise en place." />
            </div>
          </motion.div>

          <motion.div ref={(el) => { packRefs.current.ia = el; }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            <PackIA />
            <div className="mt-5">
              <DeductionBanner text="Vous avez commandé un Pack Échantillon ? Vos 147€ sont déduits de la mise en place." />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Abonnements additionnels */}
      <AbonnementSection />

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="text-center mt-16 mb-4">
        <p className="text-xs text-muted-foreground">
          Des questions ? Contactez-nous à{" "}
          <a href="mailto:hello@biolystes.com" className="text-foreground font-semibold no-underline">hello@biolystes.com</a>
        </p>
      </motion.div>
    </>
  );
}
