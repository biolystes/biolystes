import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Check, FlaskConical, Truck, Globe, Package, Leaf, Award,
  Rabbit, FileCheck2, BadgeCheck, ShoppingBag, MessageCircle, HelpCircle,
  Camera, Palette, Globe2, BarChart3, Sparkles, Clock, Shield, Zap
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

type StepKey = "decouvre" | "comprend" | "qualite" | "livraison" | "lance";

const steps: { key: StepKey; label: string; subtitle: string }[] = [
  { key: "decouvre", label: "Je découvre", subtitle: "Le concept" },
  { key: "comprend", label: "Je comprends", subtitle: "La mise en place" },
  { key: "qualite", label: "La qualité", subtitle: "Nos engagements" },
  { key: "livraison", label: "La livraison", subtitle: "Comment ça marche" },
  { key: "lance", label: "Je me lance", subtitle: "Passez à l'action" },
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
    decouvre: null, comprend: null, qualite: null, livraison: null, lance: null,
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

      {/* ═══ 2. JE COMPRENDS — LA MISE EN PLACE ═══ */}
      <section id="section-comprend" ref={setRef("comprend")} className="bg-secondary py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">La mise en place</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight max-w-3xl text-foreground">
              Comment ça se passe concrètement ?
            </motion.h2>
          </motion.div>

          {/* Timeline steps */}
          <div className="space-y-0 divide-y divide-border">
            {[
              { step: "01", title: "Sélection des produits", desc: "Choisissez vos cosmétiques parmi notre catalogue de formulations certifiées bio et végan. Un expert vous accompagne pour sélectionner les produits les plus adaptés à votre positionnement.", icon: ShoppingBag },
              { step: "02", title: "Création de votre identité", desc: "Logo, charte graphique, design packaging recyclable, brandboard complet. Nos designers créent une identité visuelle unique et professionnelle pour votre marque.", icon: Palette },
              { step: "03", title: "Photographie et contenu", desc: "Photos produits hyperréalistes générées par IA, contenus textuels optimisés pour le SEO. Tout est prêt pour vendre dès le premier jour.", icon: Camera },
              { step: "04", title: "Votre boutique en ligne", desc: "Un site e-commerce complet, hébergé et sécurisé, avec paiement intégré, nom de domaine et certificat SSL inclus. Indexé sur Google dès le lancement.", icon: Globe2 },
              { step: "05", title: "Lancement et accompagnement", desc: "Votre marque est en ligne. Notre équipe et nos agents IA vous accompagnent au quotidien : support client, marketing, analytics, contenu.", icon: Sparkles },
            ].map((item, i) => (
              <motion.div key={item.step} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp} custom={i} className="py-10 grid md:grid-cols-[80px_1fr] gap-4 md:gap-8">
                <div className="flex items-start gap-4">
                  <span className="text-2xl font-black text-foreground/20">{item.step}</span>
                  <item.icon className="h-5 w-5 text-foreground mt-1 md:hidden" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="h-5 w-5 text-foreground hidden md:block" strokeWidth={1.5} />
                    <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mt-16 p-8 md:p-12 rounded-2xl bg-foreground text-primary-foreground">
            <p className="text-xl md:text-2xl font-light leading-relaxed">
              Un seul interlocuteur, zéro complexité. Vous avez juste à <span className="font-semibold">choisir vos produits et vendre.</span> On s'occupe de tout le reste.
            </p>
          </motion.div>
        </div>
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

      {/* ═══ 5. JE ME LANCE ═══ */}
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
