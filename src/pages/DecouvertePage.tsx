import { useState, useEffect, useRef, useCallback } from "react";
import CommentCaMarche from "@/components/CommentCaMarche";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Check, FlaskConical, Truck, Globe, Package, Leaf, Award,
  Rabbit, FileCheck2, BadgeCheck, ShoppingBag, MessageCircle, HelpCircle,
  Camera, Palette, Globe2, BarChart3, Sparkles, Clock, Shield, Zap,
  AlertTriangle, Warehouse, Users, Eye, Timer,
  ScanFace, QrCode, Star, StarHalf, Menu, Search, User, Mic, ArrowUp,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

import cert1 from "@/assets/cert-1.png";
import cert2 from "@/assets/cert-2.png";
import cert3 from "@/assets/cert-3.png";
import cert4 from "@/assets/cert-4.png";
import cert5 from "@/assets/cert-5.png";
import cert6 from "@/assets/cert-6.png";
import cert7 from "@/assets/cert-7.png";
import cert8 from "@/assets/cert-8.png";

const certLogos = [cert1, cert2, cert3, cert4, cert5, cert6, cert7, cert8];

const CTA_URL = "https://app.iclosed.io/e/paylystes/r2";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

type StepKey = "decouvre" | "constat" | "comprend" | "qualite" | "livraison" | "lystesai" | "lance";

const steps: { key: StepKey; label: string; subtitle: string }[] = [
  { key: "decouvre", label: "Je découvre", subtitle: "Le concept" },
  { key: "constat", label: "Le constat", subtitle: "Pourquoi Biolystes" },
  { key: "comprend", label: "Je comprends", subtitle: "La mise en place" },
  { key: "qualite", label: "La qualité", subtitle: "Nos engagements" },
  { key: "livraison", label: "La livraison", subtitle: "Comment ça marche" },
  { key: "lystesai", label: "Lystes.ai", subtitle: "Vos agents IA" },
  { key: "lance", label: "Je me lance", subtitle: "Passez à l'action" },
];

const lystesAiPillars = [
  {
    icon: ScanFace,
    title: "Équipe Diagnostics AI",
    text: "Votre visiteur prend un selfie. L'IA scanne son visage, analyse sa peau en détail, et recommande automatiquement les produits les plus adaptés de votre boutique.",
  },
  {
    icon: MessageCircle,
    title: "Équipe Expert produit AI",
    text: "Chaque produit dispose de son propre expert dédié. Il répond instantanément aux questions sur la composition, la compatibilité, les délais. Comme votre meilleur vendeur, formé sur chaque détail.",
  },
  {
    icon: Camera,
    title: "Équipe Photographe AI",
    text: "Photos produits niveau studio professionnel, visuels UGC avec de vrais visages pour vos réseaux sociaux, contenus marketing. En quelques secondes, sans shooting.",
  },
  {
    icon: Globe,
    title: "Équipe Expert SEO AI",
    text: "Optimisation automatique de vos fiches produits, méta-descriptions, mots-clés et contenus pour que votre boutique soit visible sur Google dès le lancement.",
  },
  {
    icon: BarChart3,
    title: "Équipe Marketing AI",
    text: "Plans d'action marketing personnalisés, campagnes email, stratégies de conversion. Un directeur marketing qui travaille pour vous 24h/24.",
  },
  {
    icon: QrCode,
    title: "Équipe Créateur de contenu AI",
    text: "Contenus pour vos réseaux sociaux, articles de blog, descriptions produits optimisées. Du contenu professionnel généré en quelques secondes.",
  },
  {
    icon: BarChart3,
    title: "Équipe Analytics AI",
    text: "Un assistant IA connaît vos chiffres en temps réel. CA, tops produits, questions clients, points de blocage. Des décisions basées sur la réalité, pas sur des suppositions.",
  },
];

function StepProgress({ activeStep }: { activeStep: StepKey }) {
  const activeIdx = steps.findIndex(s => s.key === activeStep);

  const scrollToSection = (key: StepKey) => {
    document.getElementById(`section-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed top-14 left-0 right-0 z-20 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between py-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {steps.map((s, i) => {
            const isActive = s.key === activeStep;
            const isPast = i < activeIdx;
            return (
              <button
                key={s.key}
                onClick={() => scrollToSection(s.key)}
                className={`flex flex-col items-center px-3 md:px-5 py-2 rounded-xl cursor-pointer transition-all duration-200 border shrink-0 ${
                  isActive
                    ? "border-foreground bg-foreground/[0.03] font-bold"
                    : isPast
                    ? "border-transparent opacity-60"
                    : "border-transparent hover:border-border"
                }`}
              >
                <span className={`text-[10px] uppercase tracking-widest mb-0.5 ${
                  isActive ? "text-foreground font-extrabold" : "text-muted-foreground font-semibold"
                }`}>
                  {i + 1}. {s.label}
                </span>
                <span className={`text-[11px] ${isActive ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                  {s.subtitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DecouvertePage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<StepKey>("decouvre");
  const sectionRefs = useRef<Record<StepKey, HTMLElement | null>>({
    decouvre: null, constat: null, comprend: null, qualite: null, livraison: null, lystesai: null, lance: null,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          const topmost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          const key = topmost.target.id.replace("section-", "") as StepKey;
          setActiveStep(key);
        }
      },
      { rootMargin: "-120px 0px -50% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const setRef = (key: StepKey) => (el: HTMLElement | null) => {
    sectionRefs.current[key] = el;
  };

  return (
    <div className="min-h-screen bg-background -mx-6 lg:-mx-10 -mt-6 lg:-mt-10">
      <StepProgress activeStep={activeStep} />

      {/* ═══ 1. JE DÉCOUVRE ═══ */}
      <section id="section-decouvre" ref={setRef("decouvre")} className="pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-8">
            <span className="bg-foreground text-primary-foreground text-xs font-semibold tracking-[0.15em] uppercase px-5 py-2 rounded-full">
              Découverte
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-5xl lg:text-[3.5rem] font-black text-foreground leading-[1.05] tracking-[-0.02em] uppercase max-w-4xl mx-auto">
            Lancez votre marque cosmétique bio et végane sans vous ruiner
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Biolystes est une solution clé en main qui vous permet de créer et vendre votre propre marque de cosmétiques bio et végane, sans stock, sans minimum de commande, et sans vous noyer dans la complexité.
          </motion.p>

          {/* Key pillars */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-14 grid sm:grid-cols-3 gap-6 text-left">
            {[
              { icon: FlaskConical, title: "Laboratoires d'excellence", desc: "Formulations certifiées bio et vegan par les meilleurs laboratoires français et européens." },
              { icon: Truck, title: "Zéro stock, zéro risque", desc: "Votre client commande, on fabrique et on expédie directement sous votre nom." },
              { icon: Globe, title: "Lancement en 10 jours", desc: "Logo, packaging, site e-commerce, photos — tout est prêt en 10 à 15 jours." },
            ].map((item, i) => (
              <div key={item.title} className="p-6 rounded-2xl bg-secondary">
                <item.icon className="h-5 w-5 text-foreground mb-4" strokeWidth={1.5} />
                <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Certifications carousel */}
        <div className="overflow-hidden py-8 mt-8">
          <motion.div
            className="flex gap-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ width: "max-content" }}
          >
            {[...certLogos, ...certLogos].map((logo, i) => (
              <img key={i} src={logo} alt="Certification" className="h-14 md:h-18 w-auto object-contain opacity-60 grayscale" />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ 2. LE CONSTAT ═══ */}
      <section id="section-constat" ref={setRef("constat")} className="bg-secondary py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16 text-center">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Le constat</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl font-light tracking-tight max-w-3xl mx-auto text-foreground leading-relaxed">
              Nous avons créé Biolystes car de nombreuses personnes échouent en raison de choix inadaptés lors du lancement de leur marque cosmétique bio et végane.
            </motion.h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                icon: Warehouse,
                title: "Le stock",
                desc: "La majorité des créateurs investissent jusqu'à 90 % de leur budget dans l'achat de stock. Une fois la marque lancée, il ne reste plus rien pour se faire connaître. Sans visibilité, pas de ventes. Le stock dort, la trésorerie fond, et le projet s'arrête.",
              },
              {
                icon: FlaskConical,
                title: "La fabrication",
                desc: "Trouver la bonne formule, le bon dosage, le bon équilibre. Certains de nos clients avaient passé huit mois, un an, parfois des années en allers-retours avec des laboratoires, sans jamais réussir à finaliser un seul produit.",
              },
              {
                icon: Users,
                title: "La chaîne de prestataires",
                desc: "Il ne suffit pas de trouver un bon laboratoire. Il faut aussi le bon designer, le bon photographe, le bon développeur. Si un seul maillon est faible, c'est toute votre image de marque qui en souffre.",
              },
              {
                icon: Timer,
                title: "La procrastination",
                desc: "Des projets qui restent à l'état d'idée pendant des mois, parce que la complexité du parcours pousse à toujours remettre à demain.",
              },
              {
                icon: Award,
                title: "Les certifications",
                desc: "COSMOS, ECOCERT, FDA, CPNP, ISO 22716, packaging recyclable, sans parabènes, sans silicones, sans microplastiques. Cocher toutes ces cases par vous-même, ça prend des années.",
              },
              {
                icon: Eye,
                title: "Le manque de recul",
                desc: "Chaque nouvelle formulation demande du temps pour être affinée. C'est un investissement en temps que la plupart des créateurs n'ont tout simplement pas.",
              },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }}
                variants={fadeUp} custom={i} className="p-6 md:p-8 rounded-2xl bg-background border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="h-5 w-5 text-destructive" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mt-16 p-8 md:p-12 rounded-2xl bg-foreground text-primary-foreground text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-4 opacity-70" strokeWidth={1.5} />
            <p className="text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
              Huit chances sur dix de tomber dans un de ces cas de figure. C'est ce constat qui a donné naissance à Biolystes. Nous avons éliminé chacun de ces obstacles, un par un, pour que vous puissiez vous concentrer sur l'essentiel : <span className="font-semibold">vendre et développer votre marque.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 3. JE COMPRENDS — LA MISE EN PLACE ═══ */}
      <section id="section-comprend" ref={setRef("comprend")} className="py-0">
        <CommentCaMarche />
      </section>

      {/* ═══ 3. LA QUALITÉ — NOS ENGAGEMENTS ═══ */}
      <section id="section-qualite" ref={setRef("qualite")} className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16 text-center">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Nos engagements</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground">
              Des cosmétiques d'excellence, certifiés et responsables
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Tous nos produits sont formulés sans parabènes, sans silicones, sans PEG, sans filtres UV chimiques, sans microplastiques et sans colorants artificiels.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: BadgeCheck, title: "Certifié Bio & Végan", desc: "Formulations naturelles certifiées par des organismes indépendants." },
              { icon: Leaf, title: "ECOCERT / COSMOS", desc: "Standards écologiques européens et internationaux respectés." },
              { icon: FileCheck2, title: "Enregistré CPNP", desc: "Conformité totale aux normes européennes et britanniques." },
              { icon: Award, title: "ISO 22716 / FDA", desc: "Bonnes pratiques de fabrication, marché US inclus." },
              { icon: Rabbit, title: "Non testé sur animaux", desc: "Aucune expérimentation animale à aucun stade." },
              { icon: Package, title: "Packaging recyclable", desc: "Emballages conçus pour être 100% recyclables." },
            ].map((item, i) => (
              <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-secondary p-5 rounded-xl">
                <div className="w-10 h-10 mb-3 rounded-full bg-background flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                </div>
                <h4 className="text-xs font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* What we eliminate */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mt-16 grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">Nos formulations excluent</p>
              <div className="space-y-3">
                {["Parabènes", "Silicones", "PEG", "Filtres UV chimiques", "Microplastiques", "Colorants artificiels", "Phosphates", "Conservateurs synthétiques"].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center">
                      <span className="text-destructive text-xs font-bold">✕</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">Ce que nous garantissons</p>
              <div className="space-y-3">
                {["Ingrédients 100% naturels", "Parfums véganes", "Production à la demande", "Traçabilité complète", "Laboratoires certifiés", "Échantillons disponibles", "Aucun minimum de commande", "Expédition sous votre marque"].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-foreground shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 4. LA LIVRAISON ═══ */}
      <section id="section-livraison" ref={setRef("livraison")} className="bg-secondary py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">La livraison</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight max-w-3xl text-foreground">
              Comment fonctionne l'expédition de vos commandes ?
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="p-8 rounded-2xl bg-background border border-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
                  <Clock className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Mode Standard</h3>
                  <p className="text-xs text-muted-foreground">Livraison en 6-7 jours</p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>Votre client passe commande sur votre boutique en ligne.</p>
                <p>Le laboratoire fabrique le produit à la demande, sous votre nom, avec votre packaging.</p>
                <p>Le colis est expédié directement chez votre client. <strong className="text-foreground">Aucun stock nécessaire.</strong></p>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="p-8 rounded-2xl bg-background border-2 border-foreground">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
                  <Zap className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Mode Express</h3>
                  <p className="text-xs text-muted-foreground">Livraison en 24-48h</p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>Un stock tampon est maintenu pour vos produits les plus vendus.</p>
                <p>Réapprovisionnement automatique chaque semaine, sans minimum de commande.</p>
                <p>Vos clients reçoivent leur commande <strong className="text-foreground">en 24 à 48 heures.</strong></p>
              </div>
            </motion.div>
          </div>

          {/* Visual process */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
            {[
              { icon: ShoppingBag, label: "Commande client" },
              { icon: FlaskConical, label: "Fabrication" },
              { icon: Package, label: "Emballage" },
              { icon: Truck, label: "Expédition" },
              { icon: Check, label: "Livré" },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-3 md:flex-col md:gap-2">
                <div className="w-12 h-12 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
                  <item.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-semibold text-foreground">{item.label}</span>
                {i < 4 && <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block absolute" style={{ display: "none" }} />}
              </div>
            ))}
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            className="mt-12 p-6 rounded-xl bg-background border border-border text-center">
            <Shield className="h-5 w-5 text-foreground mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Chaque commande est expédiée <strong className="text-foreground">sous votre nom de marque</strong>. Votre client ne voit que votre marque, de l'emballage au bon de livraison.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ 6. LYSTES.AI ═══ */}
      <section id="section-lystesai" ref={setRef("lystesai")} className="bg-foreground text-primary-foreground">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-4">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-primary-foreground/50">Lystes.ai</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight max-w-3xl text-primary-foreground">
              Comment gérer sa marque bio et végane au quotidien sans engager trop de dépenses ?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="max-w-2xl leading-relaxed text-primary-foreground/60">
              Une fois que nous nous sommes mis à votre place, nous vous mettons à disposition des agents IA qui vous permettent d'atteindre vos objectifs. Ces agents vous aideront à produire des photos, à améliorer votre SEO, à répondre à votre place au client, à proposer des diagnostics et des recommandations produits, à vous donner des plans d'action marketing, à créer des contenus photos et des contenus pour vos réseaux sociaux.
            </motion.p>
          </motion.div>

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {lystesAiPillars.map((pillar, i) => (
              <motion.div key={pillar.title} initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i} className="p-6 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10">
                <pillar.icon className="h-5 w-5 text-primary-foreground/70 mb-4" />
                <h3 className="text-sm font-semibold mb-2">{pillar.title}</h3>
                <p className="text-sm text-primary-foreground/60 leading-relaxed">{pillar.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPARAISON : AVANT / AVEC LYSTES ═══ */}
      <section className="py-24 md:py-36 bg-secondary">
        <div className="max-w-[1280px] mx-auto px-5 md:px-[clamp(20px,5vw,80px)]">
          <div className="w-full flex justify-center items-start overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <div className="relative flex flex-col md:flex-row items-start justify-center gap-10 md:gap-16">

              {/* ── AVANT ── */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
                className="flex flex-col items-center gap-8 relative z-10 w-[320px] shrink-0">
                <div className="bg-foreground text-primary-foreground px-5 py-2 rounded-lg font-bold text-sm tracking-widest uppercase">Vos concurrents</div>
                <div className="w-[320px] bg-background rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative flex flex-col">
                  <div className="flex items-center justify-between px-5 pt-10 pb-4 z-20">
                    <div className="flex items-center gap-4">
                      <Menu className="w-5 h-5 text-foreground" />
                      <Search className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="font-serif font-bold text-2xl tracking-wide text-foreground">Expire</div>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-foreground" />
                      <div className="relative">
                        <ShoppingBag className="w-5 h-5 text-foreground" />
                        <span className="absolute -top-1 -right-1 bg-foreground text-primary-foreground text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">1</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-64 bg-muted relative pt-4 overflow-hidden">
                    <div className="flex justify-center items-start h-full">
                      <img src="https://i0.wp.com/kaniwabotanique.com/wp-content/uploads/2025/08/veuDbzM0ysQo5wxsfo1yvp1BnqZbx7PW-scaled.jpg?w=1930&ssl=1" alt="Produit" className="w-[140px] h-[200px] object-cover rounded-2xl shadow-sm border border-border relative z-10" />
                    </div>
                    <div className="absolute bottom-4 w-full flex justify-center gap-2 z-20">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                    </div>
                  </div>
                  <div className="px-6 mt-8 pb-8">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex text-foreground text-sm">
                        {[...Array(4)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                        <StarHalf className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="text-xs font-bold text-foreground">4.8/5</span>
                      <span className="text-xs text-muted-foreground">(241 avis)</span>
                    </div>
                    <h3 className="text-[22px] font-bold leading-tight text-foreground mb-1">Crème de jour<br />anti-âge</h3>
                    <p className="text-[11px] font-bold text-muted-foreground mb-3">Vitiligo • Pores dilatés • Rougeurs</p>
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-lg font-bold text-foreground">49,90€</span>
                      <span className="text-sm text-muted-foreground line-through mb-0.5">65,00€</span>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed mb-8 h-[72px]">
                      Unifie le teint et repulpe la peau sans laisser de film gras. Idéale pour les peaux mixtes et les problématiques de pigmentation.
                    </p>
                    <button className="w-full bg-foreground text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-[13px] tracking-wide shadow-lg uppercase mb-4">
                      AJOUTER AU PANIER<span className="w-px h-4 bg-muted-foreground/50 mx-2" />49,90€
                    </button>
                    <div className="flex justify-center items-center gap-3">
                      <div className="px-2.5 py-0.5 border border-border rounded text-[10px] font-bold text-[#1434CB] italic">VISA</div>
                      <div className="w-7 h-4 border border-border rounded relative overflow-hidden flex items-center justify-center bg-background">
                        <div className="w-3.5 h-3.5 bg-[#EB001B] rounded-full absolute -ml-2.5 opacity-90" />
                        <div className="w-3.5 h-3.5 bg-[#F79E1B] rounded-full absolute ml-2.5 opacity-90" />
                      </div>
                      <div className="px-2.5 py-0.5 border border-border rounded text-[10px] font-bold flex items-center gap-1 text-foreground"> Pay</div>
                      <div className="px-2.5 py-0.5 border border-border rounded text-[10px] font-bold flex items-center gap-1 text-muted-foreground">G Pay</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ── AVEC LYSTES ── */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
                className="flex flex-col items-center gap-8 relative w-[360px] shrink-0">
                <div className="bg-foreground text-primary-foreground px-5 py-2 rounded-lg font-bold text-sm tracking-widest uppercase z-10">
                  Vous avec Biolystes AI
                </div>
                <div className="relative">
                  <div className="w-[360px] bg-background rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden relative flex flex-col z-10">
                    <div className="flex items-center justify-between px-5 pt-10 pb-4 z-20 shrink-0 border-b border-border">
                      <div className="flex items-center gap-4">
                        <Menu className="w-5 h-5 text-foreground" />
                        <Search className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="font-serif font-bold text-2xl tracking-wide text-foreground">Expire</div>
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-foreground" />
                        <div className="relative">
                          <ShoppingBag className="w-5 h-5 text-foreground" />
                          <span className="absolute -top-1 -right-1 bg-foreground text-primary-foreground text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">1</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-foreground text-primary-foreground text-center text-[10px] font-medium tracking-widest uppercase py-1.5 shrink-0">
                      Livraison gratuite aujourd'hui
                    </div>
                    <div className="w-full relative mt-2 shrink-0">
                      <div className="flex overflow-x-auto gap-4 px-5 pb-6 pt-2" style={{ scrollbarWidth: "none" }}>
                        {[
                          "https://lystes.ai/images/clients/kaniwa-6.jpg",
                          "https://lystes.ai/images/clients/kaniwa-ugc-1.jpg",
                          "https://lystes.ai/images/clients/kaniwa-8.jpg",
                          "https://lystes.ai/images/clients/kaniwa-ugc-4.jpg",
                          "https://lystes.ai/images/clients/kaniwa-7.jpg",
                          "https://lystes.ai/images/clients/kaniwa-ugc-3.jpg",
                          "https://lystes.ai/images/clients/kaniwa-4.jpg",
                          "https://lystes.ai/images/clients/kaniwa-5.jpg",
                        ].map((src, i) => (
                          <div key={i} className="snap-start shrink-0 relative flex flex-col items-center">
                            <div className="absolute -bottom-1.5 w-[85%] h-4 bg-foreground/15 blur-md rounded-[100%] z-0" />
                            <img src={src} alt="" className="w-[240px] h-[280px] object-cover rounded-2xl shadow-sm relative z-10 border border-border" />
                          </div>
                        ))}
                      </div>
                      <div className="absolute bottom-1 w-full flex justify-center gap-1.5 z-20">
                        <div className="w-4 h-1.5 rounded-full bg-foreground" />
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                      </div>
                    </div>
                    <div className="px-6 mt-8">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="flex text-foreground text-sm">
                          {[...Array(4)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                          <StarHalf className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <span className="text-xs font-bold text-foreground">4.8/5</span>
                        <span className="text-xs text-muted-foreground">(241 avis)</span>
                      </div>
                      <h3 className="text-[22px] font-bold leading-tight text-foreground mb-1">Crème de jour anti-âge</h3>
                      <p className="text-[11px] font-bold text-muted-foreground mb-3">Vitiligo • Pores dilatés • Rougeurs</p>
                      <p className="text-[13px] text-muted-foreground leading-relaxed mb-6">
                        Découvrez notre <strong className="text-foreground">crème de jour anti-âge</strong> formulée pour revitaliser votre peau. Ce <strong className="text-foreground">soin hydratant expert</strong> unifie le teint, repulpe l'épiderme et aide à réduire l'apparence des taches pigmentaires.
                      </p>
                      <AnimatedChat />
                      <button className="w-full bg-foreground text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-6 text-[13px] tracking-wide shadow-lg uppercase">
                        AJOUTER AU PANIER<span className="w-px h-4 bg-muted-foreground/50 mx-2" />49,90€
                      </button>
                      <div className="flex gap-2 pb-6">
                        {[
                          "https://lystes.ai/images/clients/kaniwa-ugc-1.jpg",
                          "https://lystes.ai/images/clients/kaniwa-ugc-3.jpg",
                          "https://lystes.ai/images/clients/kaniwa-ugc-4.jpg",
                        ].map((src, i) => (
                          <div key={i} className="w-20 h-20 rounded-xl overflow-hidden">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Agent labels - desktop */}
                  <div className="hidden lg:block absolute -right-4 top-0 translate-x-full pl-4" style={{ height: "100%" }}>
                    {[
                      { label: "Équipe Marketing AI", top: "80px" },
                      { label: "Équipe Photographe AI", top: "160px" },
                      { label: "Équipe Expert SEO AI", top: "420px" },
                      { label: "Équipe Expert produit AI", top: "560px" },
                      { label: "Équipe Diagnostics AI", top: "700px" },
                      { label: "Créateur de contenu AI", top: "830px" },
                    ].map((agent) => (
                      <div key={agent.label} className="flex items-center gap-2 absolute" style={{ top: agent.top }}>
                        <div className="w-2 h-2 rounded-full bg-foreground border-2 border-background shadow" />
                        <div className="w-10 h-px bg-foreground/20" />
                        <span className="bg-foreground text-primary-foreground text-[11px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-sm">
                          {agent.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile: agent labels */}
                <div className="lg:hidden flex flex-wrap gap-2 justify-center mt-2">
                  {["Équipe Marketing AI", "Équipe Photographe AI", "Équipe Expert SEO AI", "Équipe Expert produit AI", "Équipe Diagnostics AI", "Équipe Créateur de contenu AI", "Équipe Analytics AI"].map((label) => (
                    <span key={label} className="bg-foreground text-primary-foreground text-[10px] font-medium px-3 py-1.5 rounded-lg">
                      {label}
                    </span>
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══ 7. JE ME LANCE ═══ */}
      <section id="section-lance" ref={setRef("lance")} className="py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-6">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Passez à l'action</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-light tracking-tight text-foreground">
              Prêt à lancer votre marque ?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Commencez par poser vos questions à notre assistant, explorez notre catalogue de formulations certifiées, ou prenez rendez-vous avec un expert.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            className="mt-12 grid sm:grid-cols-3 gap-6 text-left">
            <button onClick={() => navigate("/")}
              className="p-6 rounded-2xl bg-secondary hover:bg-accent transition-colors text-left group">
              <MessageCircle className="h-6 w-6 text-foreground mb-4" strokeWidth={1.5} />
              <h3 className="text-sm font-semibold text-foreground mb-1">Posez vos questions</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Notre assistant IA répond à toutes vos questions sur le lancement de votre marque.</p>
              <ArrowRight className="h-4 w-4 text-foreground mt-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button onClick={() => navigate("/catalog")}
              className="p-6 rounded-2xl bg-secondary hover:bg-accent transition-colors text-left group">
              <ShoppingBag className="h-6 w-6 text-foreground mb-4" strokeWidth={1.5} />
              <h3 className="text-sm font-semibold text-foreground mb-1">Explorer le catalogue</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">Plus de 50 formulations certifiées bio et végan, prêtes à vendre sous votre marque.</p>
              <ArrowRight className="h-4 w-4 text-foreground mt-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a href={CTA_URL} target="_blank" rel="noopener noreferrer"
              className="p-6 rounded-2xl bg-foreground text-primary-foreground hover:opacity-90 transition-opacity text-left group no-underline">
              <HelpCircle className="h-6 w-6 mb-4" strokeWidth={1.5} />
              <h3 className="text-sm font-semibold mb-1">Prendre rendez-vous</h3>
              <p className="text-xs opacity-70 leading-relaxed">Discutez de votre projet avec un expert Biolystes. Appel gratuit et sans engagement.</p>
              <ArrowRight className="h-4 w-4 mt-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
            className="mt-16 flex flex-wrap justify-center gap-4">
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full px-10 h-14 text-sm tracking-wide font-medium">
                Prendre rendez-vous avec un expert
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-sm tracking-wide font-medium border-muted-foreground/40"
              onClick={() => navigate("/pricing")}>
              Voir les tarifs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground">
          Biolystes — Paris, France — hello@biolystes.com
        </p>
      </footer>
    </div>
  );
}
