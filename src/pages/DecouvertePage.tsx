import { useState, useEffect, useRef, useCallback } from "react";
import CommentCaMarche from "@/components/CommentCaMarche";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight, Check, FlaskConical, Truck, Globe, Package, Leaf, Award,
  Rabbit, FileCheck2, BadgeCheck, ShoppingBag, MessageCircle, HelpCircle,
  Sparkles, Clock, Shield, Zap,
  AlertTriangle, Warehouse, Users, Eye, Timer,
} from "lucide-react";
import LystesAiSection from "@/components/LystesAiSection";
import InstaFeedSection from "@/components/InstaFeedSection";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

// Brand images for portfolio
import kaniwa1 from "@/assets/kaniwa-1.jpg";

import kaniwa3 from "@/assets/kaniwa-3.jpg";
import kaniwa5 from "@/assets/kaniwa-5.jpg";
import kaniwa6 from "@/assets/kaniwa-6.jpg";

import fralene1 from "@/assets/fralene-1.jpg";
import fralene2 from "@/assets/fralene-2.jpg";
import fralene3 from "@/assets/fralene-3.jpg";
import fralene5 from "@/assets/fralene-5.jpg";
import sevmylook1 from "@/assets/sevmylook-1.jpg";
import sevmylook3 from "@/assets/sevmylook-3.jpg";
import sevmylook7 from "@/assets/sevmylook-7.jpg";
import sevmylook9 from "@/assets/sevmylook-9.jpg";
import pmyrris1 from "@/assets/pmyrris-1.jpg";
import pmyrris2 from "@/assets/pmyrris-2.jpg";
import pmyrris4 from "@/assets/pmyrris-4.jpg";
import pmyrris5 from "@/assets/pmyrris-5.jpg";

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
const WC_BASE = "https://biolystes.com/wp-json/wc/v3";
const CK = "ck_375b1fedd12fc4161c16f06a8358f4d362711239";
const CS = "cs_56ece5ac68b7c2c8ffafecbddb449504bac26657";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

type StepKey = "decouvre" | "constat" | "experience" | "comprend" | "qualite" | "livraison" | "lystesai" | "portfolio" | "catalogue" | "tarifs" | "lance";

const steps: { key: StepKey; label: string; subtitle: string }[] = [
  { key: "decouvre", label: "Je découvre", subtitle: "Le concept" },
  { key: "constat", label: "Le constat", subtitle: "Pourquoi Biolystes" },
  { key: "experience", label: "L'expérience", subtitle: "18 ans d'expertise" },
  { key: "qualite", label: "La qualité", subtitle: "Nos engagements" },
  { key: "comprend", label: "Je comprends", subtitle: "La mise en place" },
  { key: "livraison", label: "La livraison", subtitle: "Comment ça marche" },
  { key: "lystesai", label: "On gère tout", subtitle: "7 experts à votre service" },
  { key: "portfolio", label: "Nos clients", subtitle: "Portfolio" },
  { key: "catalogue", label: "Catalogue", subtitle: "Nos produits" },
  { key: "tarifs", label: "Tarifs", subtitle: "Nos offres" },
  { key: "lance", label: "Je me lance", subtitle: "Passez à l'action" },
];

const portfolioBrands = [
  {
    name: "Kaniwa Botanique",
    tagline: "Marque bio & vegan, lancée en 12 jours",
    url: "https://kaniwabotanique.com/",
    photos: [kaniwa1, kaniwa3, kaniwa5, kaniwa6],
  },
  {
    name: "Fralène",
    tagline: "Gamme soins visage premium",
    url: "https://fraleneparis.com/",
    photos: [fralene1, fralene2, fralene3, fralene5],
  },
  {
    name: "Sevmylook",
    tagline: "Gamme solaire & soins visage par Séverine Formal",
    url: "https://sevmylook.com/",
    photos: [sevmylook1, sevmylook3, sevmylook7, sevmylook9],
  },
  {
    name: "Pmyrris Beauty",
    tagline: "Gamme soins capillaires naturels",
    url: "https://pmyrrisbeauty.fr/",
    photos: [pmyrris1, pmyrris2, pmyrris4, pmyrris5],
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
  const [catalogProducts, setCatalogProducts] = useState<{ id: number; name: string; price: string; image: string }[]>([]);
  const sectionRefs = useRef<Record<StepKey, HTMLElement | null>>({
    decouvre: null, constat: null, experience: null, comprend: null, qualite: null, livraison: null, lystesai: null, portfolio: null, catalogue: null, tarifs: null, lance: null,
  });

  // Fetch catalog products
  useEffect(() => {
    const url = new URL(`${WC_BASE}/products`);
    url.searchParams.set("consumer_key", CK);
    url.searchParams.set("consumer_secret", CS);
    url.searchParams.set("per_page", "8");
    url.searchParams.set("status", "publish");
    url.searchParams.set("orderby", "popularity");
    fetch(url.toString())
      .then(r => r.json())
      .then((data: any[]) => {
        setCatalogProducts(data.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.images?.[0]?.src || "",
        })));
      })
      .catch(() => {});
  }, []);

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

      {/* ═══ 18 ANS D'EXPÉRIENCE ═══ */}
      <section id="section-experience" ref={setRef("experience")} className="py-24 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-3xl md:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground">
            18 ans d'expérience dans le secteur de la beauté ont donné naissance à Biolystes
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Nous avons éliminé les obstacles pour vous permettre de vous concentrer sur l'essentiel : bâtir une marque qui vous ressemble.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="https://kaniwabotanique.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-foreground text-primary-foreground hover:bg-foreground/90 rounded-full px-10 h-14 text-sm tracking-wide font-medium uppercase">
                Voir notre dernier projet
              </Button>
            </a>
            <a href="/catalog">
              <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-sm tracking-wide font-medium border-muted-foreground/40 text-foreground hover:bg-foreground hover:text-primary-foreground uppercase">
                Voir nos produits bio
              </Button>
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
              <span className="text-4xl font-black text-foreground">{item.num}</span>
              <h3 className="text-sm font-black uppercase tracking-wide text-foreground mt-3 mb-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Video présentation */}
        <div className="max-w-5xl mx-auto px-6 mt-16">
          <div className="rounded-2xl overflow-hidden">
            <video autoPlay muted loop playsInline className="w-full h-auto rounded-2xl">
              <source src="https://biolystes.com/wp-content/uploads/2025/09/ok.mov" type="video/mp4" />
            </video>
          </div>
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

      {/* ═══ 4. JE COMPRENDS — LA MISE EN PLACE ═══ */}
      <section id="section-comprend" ref={setRef("comprend")} className="py-0 mt-[59px] mb-[34px]">
        <CommentCaMarche />
      </section>

      {/* ═══ 5. LA LIVRAISON ═══ */}
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
      <section id="section-lystesai" ref={setRef("lystesai")} className="bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8">
        <LystesAiSection />
      </section>

      {/* ═══ 7. PORTFOLIO — NOS CLIENTS ═══ */}
      <section id="section-portfolio" ref={setRef("portfolio")} className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Portfolio</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight max-w-3xl text-foreground">
              Plus de 100 marques accompagnées.
            </motion.h2>
          </motion.div>

          <div className="space-y-16">
            {portfolioBrands.map((brand, idx) => (
              <motion.div key={brand.name} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp} custom={idx}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{brand.name}</h3>
                    <p className="text-sm text-muted-foreground">{brand.tagline}</p>
                  </div>
                  <a href={brand.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-70 transition-opacity shrink-0">
                    Voir le site <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {brand.photos.map((src, i) => (
                    <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden">
                      <img src={src} alt={`${brand.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mt-16 text-center">
            <Button variant="outline" className="rounded-full px-8 h-12 text-sm border-muted-foreground/40"
              onClick={() => navigate("/portfolio")}>
              Voir tout le portfolio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══ 8. CATALOGUE ═══ */}
      <section id="section-catalogue" ref={setRef("catalogue")} className="bg-secondary py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Catalogue</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight max-w-3xl text-foreground">
              Des formulations d'excellence, prêtes à vendre.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl leading-relaxed">
              Plus de 50 produits certifiés bio et végan, disponibles sans minimum de commande.
            </motion.p>
          </motion.div>

          {catalogProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {catalogProducts.slice(0, 8).map((p, i) => (
                <motion.div key={p.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="group cursor-pointer" onClick={() => navigate("/catalog")}>
                  <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-muted">
                    {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.price} EUR HT</p>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mt-12 text-center flex flex-wrap justify-center gap-4">
            <Button className="rounded-full px-8 h-12 text-sm" onClick={() => navigate("/catalog")}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Voir tout le catalogue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ═══ 9. TARIFS ═══ */}
      <section id="section-tarifs" ref={setRef("tarifs")} className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16 text-center">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Tarifs</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground">
              Des offres claires, sans surprise.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Tous les prix sont en HT. Le montant du Pack Échantillon est déduit de toute offre souscrite dans les 30 jours.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Pack Échantillon */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="p-8 rounded-2xl bg-secondary border border-border">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Pack Échantillon</p>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-black text-foreground">147€</span>
                <span className="text-sm text-muted-foreground mb-1">ou 3× 49€</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Testez nos formulations avant de vous lancer. Montant intégralement déduit de toute offre souscrite sous 30 jours.
              </p>
              <div className="space-y-2">
                {["Jusqu'à 5 échantillons", "Formulations certifiées bio", "Livraison incluse"].map(t => (
                  <div key={t} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0" /> {t}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Offre Avec Site */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="p-8 rounded-2xl bg-secondary border border-border">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">Offre Avec Site</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-3xl font-black text-foreground">1 499€</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">ou 2× 750€ · + 99€/mois</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Solution complète : site e-commerce, design, packaging, photos et lancement en 10-15 jours.
              </p>
              <div className="space-y-2">
                {["Site e-commerce inclus", "Design packaging inclus", "Photos IA hyperréalistes", "SEO & indexation Google", "Abonnement Pro 99€/mois"].map(t => (
                  <div key={t} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0" /> {t}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Offre Avec Site + IA */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
              className="p-8 rounded-2xl bg-foreground text-primary-foreground border-2 border-foreground">
              <p className="text-xs tracking-[0.2em] uppercase text-primary-foreground/50 mb-4">Offre Avec Site + IA</p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-3xl font-black">2 999€</span>
              </div>
              <p className="text-xs text-primary-foreground/50 mb-4">ou 2× 1 500€ · + 199€/mois</p>
              <p className="text-sm text-primary-foreground/70 leading-relaxed mb-6">
                Tout de l'offre Avec Site + UGC IA, diagnostic intelligent et gestion réseaux sociaux.
              </p>
              <div className="space-y-2">
                {["Tout de l'offre Avec Site", "UGC IA ultraréaliste", "Diagnostic intelligent par IA", "Recommandations produits par IA", "Gestion réseaux sociaux 1 mois"].map(t => (
                  <div key={t} className="flex items-center gap-2 text-sm text-primary-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0" /> {t}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            className="mt-12 text-center flex flex-wrap justify-center gap-4">
            <Button className="rounded-full px-8 h-12 text-sm" onClick={() => navigate("/pricing")}>
              Voir le détail des tarifs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="rounded-full px-8 h-12 text-sm border-muted-foreground/40">
                <HelpCircle className="mr-2 h-4 w-4" />
                Prendre rendez-vous
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ PRÉSENTATION PRODUITS (INSTA FEED) ═══ */}
      <section className="py-24 md:py-32">
        <InstaFeedSection />
      </section>

      {/* ═══ 10. JE ME LANCE ═══ */}
      <section id="section-lance" ref={setRef("lance")} className="bg-secondary py-24 md:py-32">
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
