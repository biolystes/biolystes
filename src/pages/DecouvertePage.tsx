import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import CommentCaMarche from "@/components/CommentCaMarche";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import SafeVideo from "@/components/SafeVideo";
import {
  ArrowRight, Check, FlaskConical, Truck, Globe, Package, Leaf, Award,
  Rabbit, FileCheck2, BadgeCheck, ShoppingBag, MessageCircle, HelpCircle,
  Sparkles, Clock, Shield, Zap,
  AlertTriangle, Warehouse, Users, Eye, Timer, ChevronLeft, ChevronRight,
} from "lucide-react";
import LystesAiSection from "@/components/LystesAiSection";
import InstaFeedSection from "@/components/InstaFeedSection";
import WirtzkinSection from "@/components/WirtzkinSection";
import AvantApresSection from "@/components/AvantApresSection";
import { Button } from "@/components/ui/button";
import { ExternalLink, MousePointerClick, PackagePlus, SendHorizontal } from "lucide-react";
import salonCoiffure from "@/assets/salon-coiffure.webp";
import productBox from "@/assets/product-box.jpg";
import product235th1 from "@/assets/product-235th-1.jpg";
import product235th2 from "@/assets/product-235th-2.jpg";
import product235th3 from "@/assets/product-235th-3.jpg";

// Brand images for portfolio
import kaniwa1 from "@/assets/kaniwa-1.jpg";
import kaniwa6 from "@/assets/kaniwa-6.jpg";
import kaniwa7 from "@/assets/kaniwa-7.jpg";
import kaniwaUgc2 from "@/assets/kaniwa-ugc-2.jpg";
import kaniwaUgc3 from "@/assets/kaniwa-ugc-3.jpg";
import kaniwaUgc4 from "@/assets/kaniwa-ugc-4.jpg";
import kaniwaUgc5 from "@/assets/kaniwa-ugc-5.png";
import kaniwaUgc6 from "@/assets/kaniwa-ugc-6.jpg";

import fralene3 from "@/assets/fralene-3.jpg";
import fralene10 from "@/assets/fralene-10.jpg";
import fraleneExt1 from "@/assets/fralene-ext-1.jpg";
import sevmylook1 from "@/assets/sevmylook-1.jpg";
import sevmylook3 from "@/assets/sevmylook-3.jpg";
import sevmylook7 from "@/assets/sevmylook-7.jpg";
import sevmylook9 from "@/assets/sevmylook-9.jpg";
import sevmylook20 from "@/assets/sevmylook-20.jpg";
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
const productImages = [productBox, product235th1, product235th2, product235th3];

function ProductImageCycler() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setIdx((p) => (p + 1) % productImages.length), 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="hidden md:block absolute -right-16 bottom-20 bg-secondary rounded-xl p-3 max-w-[220px] shadow-lg">
      <div className="overflow-hidden rounded-lg">
        <motion.div
          className="flex"
          animate={{ x: `-${idx * 100}%` }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {productImages.map((src, i) => (
            <img key={i} src={src} alt="Produit cosmétique" className="w-full flex-shrink-0 object-cover aspect-square" loading="lazy" />
          ))}
        </motion.div>
      </div>
      <div className="flex justify-center gap-1.5 mt-2">
        {productImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? "bg-foreground w-4" : "bg-muted-foreground/30"}`}
          />
        ))}
      </div>
    </div>
  );
}


  const fadeUp = {
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

type StepKey = "decouvre" | "constat" | "experience" | "comprend" | "qualite" | "livraison" | "lystesai" | "portfolio" | "catalogue" | "tarifs" | "lance";

const steps: { key: StepKey; label: string; subtitle: string }[] = [
  { key: "decouvre", label: "Je découvre", subtitle: "Le concept" },
  { key: "qualite", label: "La qualité", subtitle: "Nos engagements" },
  { key: "experience", label: "L'expérience", subtitle: "18 ans d'expertise" },
  { key: "comprend", label: "Je comprends", subtitle: "La mise en place" },
  { key: "livraison", label: "La livraison", subtitle: "Comment ça marche" },
  { key: "lystesai", label: "On gère tout", subtitle: "7 experts à votre service" },
  { key: "portfolio", label: "Nos clients", subtitle: "Portfolio" },
  { key: "catalogue", label: "Catalogue", subtitle: "Nos produits" },
  { key: "tarifs", label: "Tarifs", subtitle: "Nos offres" },
  { key: "constat", label: "Le constat", subtitle: "Pourquoi Biolystes" },
  { key: "lance", label: "Je me lance", subtitle: "Passez à l'action" },
];

const portfolioBrands = [
  {
    name: "Kaniwa Botanique",
    tagline: "Marque bio & vegan, lancée en 12 jours",
    url: "https://kaniwabotanique.com/",
    photos: [kaniwa1, kaniwaUgc2, kaniwa7, kaniwaUgc3, kaniwaUgc4, kaniwaUgc5, kaniwaUgc6],
  },
  {
    name: "Fralène",
    tagline: "Gamme soins visage premium",
    url: "https://fraleneparis.com/",
    photos: [{ type: "video" as const, src: "/videos/fralene-hero.mov" }, fralene3, fraleneExt1, fralene10],
  },
  {
    name: "Sevmylook",
    tagline: "Gamme solaire & soins visage par Séverine Formal",
    url: "https://sevmylook.com/",
    photos: [sevmylook1, sevmylook20, sevmylook7, sevmylook3],
  },
  {
    name: "Pmyrris Beauty",
    tagline: "Gamme soins capillaires naturels",
    url: "https://pmyrrisbeauty.fr/",
    photos: [pmyrris1, pmyrris2, pmyrris4, pmyrris5],
  },
];

function BrandCarousel({ brand }: { brand: typeof portfolioBrands[0] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true, dragFree: true });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex gap-3">
          {brand.photos.map((item, i) => (
            <div key={i} className="flex-none w-[45%] md:w-[24%] aspect-[3/4] rounded-2xl overflow-hidden">
              {typeof item === "object" && item.type === "video" ? (
                <SafeVideo src={item.src} className="w-full h-full object-cover" />
              ) : (
                <img src={typeof item === "string" ? item : ""} alt={`${brand.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
              )}
            </div>
          ))}
        </div>
      </div>
      {canScrollPrev && (
        <button onClick={() => emblaApi?.scrollPrev()} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-md hover:bg-background transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      {canScrollNext && (
        <button onClick={() => emblaApi?.scrollNext()} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-md hover:bg-background transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function StepProgress({ activeStep }: { activeStep: StepKey }) {
  const activeIdx = steps.findIndex(s => s.key === activeStep);

  const scrollToSection = (key: StepKey) => {
    document.getElementById(`section-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed left-0 right-0 z-20 bg-background/90 backdrop-blur-md border-b border-border" style={{ top: "88px" }}>
      <div className="max-w-4xl mx-auto px-2 md:px-4">
        <div className="flex items-center justify-start md:justify-between py-2 md:py-3 overflow-x-auto gap-1" style={{ scrollbarWidth: "none" }}>
          {steps.map((s, i) => {
            const isActive = s.key === activeStep;
            const isPast = i < activeIdx;
            return (
              <button
                key={s.key}
                onClick={() => scrollToSection(s.key)}
                className={`flex flex-col items-center px-2 md:px-5 py-1.5 md:py-2 rounded-xl cursor-pointer transition-all duration-200 border shrink-0 ${
                  isActive
                    ? "border-foreground bg-foreground/[0.03] font-bold"
                    : isPast
                    ? "border-transparent opacity-60"
                    : "border-transparent hover:border-border"
                }`}
              >
                <span className={`text-[9px] md:text-[10px] uppercase tracking-widest mb-0.5 ${
                  isActive ? "text-foreground font-extrabold" : "text-muted-foreground font-semibold"
                }`}>
                  {i + 1}. {s.label}
                </span>
                <span className={`text-[10px] md:text-[11px] hidden md:block ${isActive ? "text-foreground font-bold" : "text-muted-foreground"}`}>
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
    <div className="min-h-screen bg-background -mx-6 lg:-mx-10 -mt-6 lg:-mt-10 overflow-x-hidden">
      <StepProgress activeStep={activeStep} />

      {/* ═══ 1. JE DÉCOUVRE ═══ */}
      <section id="section-decouvre" ref={setRef("decouvre")} className="pt-36 pb-0 md:pt-44 md:pb-0">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-8">
            <span className="bg-foreground text-primary-foreground text-[8px] font-semibold tracking-[0.8px] uppercase px-5 py-2 rounded-full">
              En 10 jours
            </span>
            <span className="text-[8px] text-muted-foreground font-medium tracking-[0.8px] uppercase">
              Profitez de plus de 18 ans d'expérience
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-foreground max-w-[726px] mx-auto text-[36px] md:text-[56px] lg:text-[74px]"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: "1em", letterSpacing: 0 }}>
            Lancez votre marque cosmétique bio et végane sans vous ruiner
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Biolystes est une solution clé en main qui vous permet de créer et vendre votre propre marque de cosmétiques bio et végane, sans stock, sans minimum de commande, et sans vous noyer dans la complexité.
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

        {/* Certification text badges */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center justify-center gap-6 flex-wrap mt-12 mb-2">
          {[
            { icon: Leaf, label: "Certifié Bio & Végan" },
            { icon: Shield, label: "Conformité COSMOS/ECOCERT/FDA" },
            { icon: Zap, label: "Lancement Rapide" },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-2 text-sm text-muted-foreground">
              <item.icon className="h-4 w-4" strokeWidth={1.5} />
              {item.label}
            </span>
          ))}
        </motion.div>

        {/* Certifications carousel */}
        <div className="overflow-hidden py-4 mt-2">
          <motion.div
            className="flex gap-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ width: "max-content" }}
          >
            {[...certLogos, ...certLogos].map((logo, i) => (
              <img key={i} src={logo} alt="Certification" className="w-auto object-contain" style={{ maxHeight: 80, filter: "brightness(0)" }} />
            ))}
          </motion.div>
        </div>

        </div>


      </section>

      {/* ═══ PORTFOLIO IMAGES MARQUEE ═══ */}
      <section className="overflow-hidden py-3 bg-background">
        <div className="flex gap-3 px-3" style={{ overflowX: "auto", scrollbarWidth: "none" }}>
          {[
            kaniwa1, fralene3, sevmylook1, pmyrris1, kaniwa6, fralene10, sevmylook3, pmyrris4,
          ].map((src, i) => (
            <div key={i} className="shrink-0 w-[200px] md:w-[260px] aspect-[3/4] rounded-2xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 3. LA QUALITÉ — NOS ENGAGEMENTS ═══ */}
      <section id="section-qualite" ref={setRef("qualite")} className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16 text-center">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Nos engagements</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground leading-relaxed">
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

          {/* ═══ PRÉSENTATION PRODUITS (INSTA FEED) ═══ */}
          <div className="mt-8 mb-8">
            <InstaFeedSection />
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

      {/* ═══ 18 ANS D'EXPÉRIENCE ═══ */}
      <section id="section-experience" ref={setRef("experience")} className="py-12 md:py-16 bg-background">
        {/* Video carousel - auto-scrolling */}
        <div className="w-full overflow-hidden mb-16">
          <motion.div
            className="flex gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ width: "max-content" }}
          >
            {[...Array(2)].flatMap((_, dupeIdx) =>
              [
                "/videos/exp-1.mp4", "/videos/exp-2.mov", "/videos/exp-3.mov", "/videos/exp-4.mov",
                "/videos/exp-5.mov", "/videos/exp-6.mov", "/videos/exp-7.mov", "/videos/exp-8.mov",
                "/videos/exp-9.mp4", "/videos/exp-10.mov", "/videos/exp-11.mp4", "/videos/exp-12.mp4",
                "/videos/exp-13.mov", "/videos/exp-14.mov", "/videos/exp-15.mov", "/videos/exp-16.mov",
                "/videos/exp-17.mov", "/videos/exp-18.mov", "/videos/exp-19.mov", "/videos/exp-20.mov",
                "/videos/exp-21.mov", "/videos/exp-22.mov", "/videos/exp-23.mov", "/videos/exp-24.mov",
                "/videos/exp-25.mov", "/videos/exp-26.mov", "/videos/exp-27.mov", "/videos/exp-28.mov",
                "/videos/exp-29.mov", "/videos/exp-30.mov", "/videos/exp-31.mov",
              ].map((src, i) => (
                <div
                  key={`${dupeIdx}-${i}`}
                  className="flex-shrink-0 w-[200px] md:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden bg-black"
                >
                  <SafeVideo
                    src={src}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            )}
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground leading-relaxed">
            18 ans d'expérience<br /> dans le secteur de la beauté ont donné naissance à Biolystes
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Nous avons éliminé les obstacles pour vous permettre de vous concentrer sur l'essentiel : bâtir une marque qui vous ressemble.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="https://kaniwabotanique.com" target="_blank" rel="noopener noreferrer" className="btn-startup">
              <span>Voir notre dernier projet</span>
              <span className="arrow-circle">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
            <a href="https://app.iclosed.io/e/paylystes/r2" target="_blank" rel="noopener noreferrer" className="btn-outline">
              <span>Demander l'accès à nos produits</span>
              <span className="arrow-circle">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
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
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>

      </section>

      {/* ═══ 4. JE COMPRENDS — LA MISE EN PLACE ═══ */}
      <section id="section-comprend" ref={setRef("comprend")} className="bg-secondary">
        <CommentCaMarche />
      </section>

      {/* ═══ 5. LA LIVRAISON ═══ */}
      <section id="section-livraison" ref={setRef("livraison")} className="bg-secondary py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">La livraison</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl text-foreground leading-relaxed">
              Comment fonctionne l'expédition de vos commandes ?
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="p-8 rounded-2xl border-2 border-foreground">
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
              className="p-8 rounded-2xl border-2 border-foreground">
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


      <section id="section-lystesai" ref={setRef("lystesai")} className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8" style={{ overflow: "visible" }}>
        <LystesAiSection />
      </section>

      {/* ═══ AVANT / AVEC BIOLYSTES ═══ */}
      <AvantApresSection />

      {/* ═══ 7. PORTFOLIO — NOS CLIENTS ═══ */}
      <section id="section-portfolio" ref={setRef("portfolio")} className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Portfolio</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl text-foreground leading-relaxed">
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
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-foreground hover:opacity-80 transition-opacity shrink-0 rounded-full px-4 py-2">
                    Voir le site <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <BrandCarousel brand={brand} />
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══ 8. CATALOGUE ═══ */}
      <section id="section-catalogue" ref={setRef("catalogue")} className="bg-secondary py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Catalogue</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl text-foreground leading-relaxed">
              Des formulations d'excellence, prêtes à vendre.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl leading-relaxed">
              Plus de 100 produits certifiés bio et végan, disponibles sans minimum de commande.
            </motion.p>
          </motion.div>

          {catalogProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {catalogProducts.slice(0, 8).map((p, i) => (
                <motion.div key={p.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="group cursor-pointer bg-foreground/[0.04] p-[13px] rounded-[13px] m-[1px]" onClick={() => navigate("/catalog")}>
                  <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-muted">
                    {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
                  </div>
                  <p className="text-[9px] font-medium text-foreground text-center truncate">{p.name}</p>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mt-12 text-center flex flex-wrap justify-center gap-4">
            <a href="https://app.iclosed.io/e/paylystes/r2" target="_blank" rel="noopener noreferrer" className="btn-startup">
              <span>Prendre rendez-vous</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ 9a. TARIFS – PACK DÉCOUVERTE ═══ */}
      <section id="section-tarifs-2" className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-12 text-center">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Pas besoin de tout décider maintenant</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground leading-relaxed">
              Votre meilleure réflexion, testez nos produits <br />avec votre branding pour 147€, montant déduit si vous passez à l'étape suivante
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-sm text-muted-foreground leading-relaxed">
              4 produits certifiés bio chez vous en 7 jours. Création de votre logo, design packaging et shooting photo IA de vos produits.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="mb-8">
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
                  {["4 produits certifiés bio chez vous en 7 jours", "Création de votre logo", "Design packaging", "Shooting photo IA de vos produits", "Accompagnement dans la sélection des produits", "Certifié Bio & Végan / COSMOS / ECOCERT / FDA", "Livraison incluse sous 7 à 8 jours"].map((t, i) => (
                    <div key={i} className="flex items-start gap-3 py-1.5">
                      <Check size={14} strokeWidth={2} className="flex-shrink-0 mt-0.5 text-muted-foreground" />
                      <span className="text-[13px] leading-relaxed text-muted-foreground">{t}</span>
                    </div>
                  ))}
                </div>
                <a href={CTA_URL} target="_blank" rel="noopener noreferrer"
                  className="block w-full py-4 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase rounded-xl bg-foreground text-background border-2 border-foreground hover:opacity-90 transition-opacity mt-auto">
                  Commander mes échantillons
                </a>
              </div>
              <div className="rounded-2xl px-6 py-5 text-center bg-foreground/[0.02] mt-5">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <HelpCircle size={14} strokeWidth={1.8} className="text-muted-foreground" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Bon à savoir</span>
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground">147€ déduits de toute Offre Avec Site souscrite dans les 30 jours. Votre test devient un acompte, pas une dépense.</p>
              </div>
            </motion.div>

            <video
              src="/videos/hero-kaniwa.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="rounded-xl object-cover w-full h-auto hidden md:block"
              style={{ border: "5px solid", borderRadius: "12px", transform: "rotate(2deg)", margin: "0 36px", maxWidth: "calc(100% - 72px)", marginBottom: "33px" }}
            />
          </div>
        </div>
      </section>

      {/* ═══ 9b. TARIFS – PACKS AGENCE & IA ═══ */}
      <section id="section-tarifs" ref={setRef("tarifs")} className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-12 text-center">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Tarifs</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground leading-relaxed">
              Des forfaits transparents adaptés à votre ambition
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-sm text-muted-foreground leading-relaxed">
              Le premier mois de l'abonnement est toujours offert !
            </motion.p>
            <div className="inline-block mt-5 px-6 py-3 rounded-xl bg-red-600 text-white text-sm font-extrabold uppercase tracking-wide animate-none opacity-100">
              🔥 Cette semaine : -20% sur toutes nos offres
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {/* Pack Agence */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
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
                <div className="flex flex-col mb-8 flex-1">
                  {["Création de logo", "Design Packaging", "Contenu textuel clé en main", "Photographie IA hyperréaliste", "Site e-commerce", "Indexation Google", "Automatisation livraison", "Support premium", "Expert produit dédié en votre nom", "Achat de stock pas nécessaire", "Aucune quantité min en cas d'achat de stock", "Optimisation SEO avancée", "CRO standard"].map((f, i) => (
                    <div key={i} className="flex items-start gap-3 py-1.5">
                      <Check size={14} strokeWidth={2} className="flex-shrink-0 mt-0.5 text-muted-foreground" />
                      <span className="text-[13px] leading-relaxed text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
                <a href={CTA_URL} target="_blank" rel="noopener noreferrer"
                  className="block w-full py-4 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase rounded-xl bg-foreground text-background border-2 border-foreground hover:opacity-90 transition-opacity mt-auto">
                  Prendre RDV
                </a>
              </div>
              <div className="rounded-2xl px-6 py-5 text-center bg-foreground/[0.02] mt-5">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <HelpCircle size={14} strokeWidth={1.8} className="text-muted-foreground" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Bon à savoir</span>
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground">Vous avez commandé un Pack Échantillon ? Vos 147€ sont déduits de la mise en place.</p>
              </div>
            </motion.div>

            {/* Pack IA */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
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
                <div className="flex flex-col mb-8 flex-1">
                  {["Création de logo", "Design Packaging", "Contenu textuel clé en main", "Photographie IA hyperréaliste", "Site e-commerce", "Indexation Google", "Automatisation livraison", "Support premium", "Expert produit dédié en votre nom", "Achat de stock pas nécessaire", "Aucune quantité min en cas d'achat de stock", "UGC IA Ultraréaliste", "Optimisation SEO avancée", "CRO standard", "Expert produit dédié", "Diagnostic intelligent par IA (Option)", "Recommandations produits par IA", "Gestion réseaux sociaux 1 mois"].map((f, i) => (
                    <div key={i} className="flex items-start gap-3 py-1.5">
                      <Check size={14} strokeWidth={2} className="flex-shrink-0 mt-0.5 text-muted-foreground" />
                      <span className="text-[13px] leading-relaxed text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
                <a href={CTA_URL} target="_blank" rel="noopener noreferrer"
                  className="block w-full py-4 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase rounded-xl bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background transition-all mt-auto">
                  Prendre RDV
                </a>
              </div>
              <div className="rounded-2xl px-6 py-5 text-center bg-foreground/[0.02] mt-5">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <HelpCircle size={14} strokeWidth={1.8} className="text-muted-foreground" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Bon à savoir</span>
                </div>
                <p className="text-[13px] leading-relaxed text-muted-foreground">Vous avez commandé un Pack Échantillon ? Vos 147€ sont déduits de la mise en place.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ═══ RÉASSORT SANS MINIMUM ═══ */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground leading-relaxed"
              style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
              Réassort Sans Minimum<br />
              Vous êtes un institut ? un centre médical ? un salon de coiffure
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed text-sm">
              Pas besoin de minimum de stock pour vos points de vente physiques. Commandez 1, 10 ou 1000 produits selon vos besoins réels. Livré dans votre établissement en moins de 15 jours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            {[
              { icon: MousePointerClick, title: "Commande automatisée", desc: "Vous passez vos commandes via notre plateforme avec votre branding." },
              { icon: PackagePlus, title: "Fabrication Rapide", desc: "Le laboratoire fabrique le produit commandé 72h, avec votre branding." },
              { icon: SendHorizontal, title: "Livraison Directe", desc: "Le logisticien récupère votre colis au laboratoire et l'expédie dans votre établissement." },
            ].map((item) => (
              <div key={item.title} className="text-center bg-foreground/[0.02] p-[34px] rounded-[33px]">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-background rounded-full mb-3">
                  <item.icon className="w-4 h-4 text-foreground" strokeWidth={1} />
                </div>
                <h4 className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wide">{item.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="relative max-w-[944px] mx-auto">
            <div className="bg-secondary rounded-xl p-6 md:p-10">
              <img src={salonCoiffure} alt="Salon de coiffure" className="w-full rounded-lg" loading="lazy" />
            </div>
            <div className="hidden md:block absolute -left-16 bottom-20 max-w-[220px] shadow-lg rounded-xl overflow-hidden rotate-[-3deg] p-3" style={{ backgroundColor: '#2f5955' }}>
              <video
                src="/videos/salon-235th.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full rounded-xl object-cover aspect-[3/4]"
              />
            </div>
            <ProductImageCycler />
          </div>
        </div>
      </section>

      {/* ═══ WIRTZKIN ═══ */}
      <section className="py-12 md:py-16 bg-background">
        <WirtzkinSection />
      </section>

      {/* ═══ LE CONSTAT ═══ */}
      <section id="section-constat" ref={setRef("constat")} className="bg-secondary py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
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
                variants={fadeUp} custom={i} className="p-6 md:p-8 rounded-2xl bg-background">
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

      {/* ═══ 10. JE ME LANCE ═══ */}
      <section id="section-lance" ref={setRef("lance")} className="bg-secondary py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-6">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-muted-foreground">Passez à l'action</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground leading-relaxed">
              Prêt à lancer votre marque ?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Commencez par poser vos questions à notre assistant, explorez notre catalogue de formulations certifiées, ou prenez rendez-vous avec un expert.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            className="mt-12 grid sm:grid-cols-3 gap-6 text-left">
            <button onClick={() => navigate("/chat")}
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
              <p className="text-xs text-muted-foreground leading-relaxed">Plus de 100 formulations certifiées bio et végan, prêtes à vendre sous votre marque.</p>
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
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="btn-startup">
              <span>Prendre rendez-vous avec un expert</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-foreground text-primary-foreground py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Col 1 — Brand */}
            <div>
              <h5 className="text-sm font-bold mb-3">Biolystes.</h5>
              <p className="text-xs opacity-60 leading-relaxed mb-4">La Liberté de Créer Votre Marque de Beauté. Simplement.</p>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="https://instagram.com/biolystes" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>

            {/* Col 2 — Navigation */}
            <div>
              <h6 className="text-xs font-semibold opacity-60 uppercase tracking-widest mb-3">Navigation</h6>
              <ul className="space-y-2 text-xs">
                <li><a href="#section-comprend" className="opacity-60 hover:opacity-100 transition-opacity">Comment ça marche</a></li>
                <li><a href="#section-livraison" className="opacity-60 hover:opacity-100 transition-opacity">Zéro Stock</a></li>
                <li><a href="#section-qualite" className="opacity-60 hover:opacity-100 transition-opacity">Engagements</a></li>
                <li><button onClick={() => navigate("/pricing")} className="opacity-60 hover:opacity-100 transition-opacity">Nos Tarifs</button></li>
              </ul>
            </div>

            {/* Col 3 — Engagements */}
            <div>
              <h6 className="text-xs font-semibold opacity-60 uppercase tracking-widest mb-3">Nos Engagements</h6>
              <ul className="space-y-2 text-xs">
                {["Ecocert / Cosmos", "Conformité UE 1223/2009", "Conformité FDA", "100% Végan & Cruelty-Free"].map(e => (
                  <li key={e} className="flex items-center gap-2 opacity-60">
                    <Check className="h-3 w-3 shrink-0" strokeWidth={2} />
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Contact */}
            <div>
              <h6 className="text-xs font-semibold opacity-60 uppercase tracking-widest mb-3">Restons en contact</h6>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2 opacity-60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  hello@biolystes.com
                </li>
                <li className="flex items-center gap-2 opacity-60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  6 avenue Émile Deschanel, 75007 Paris
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs opacity-40">©2025 Biolystes</p>
            <div className="flex items-center gap-6 text-xs opacity-40">
              <Link to="/mentions-legales" className="hover:opacity-100 transition-opacity">Mentions légales</Link>
              <Link to="/politique-confidentialite" className="hover:opacity-100 transition-opacity">Politique de Confidentialité</Link>
              <Link to="/cgv" className="hover:opacity-100 transition-opacity">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
