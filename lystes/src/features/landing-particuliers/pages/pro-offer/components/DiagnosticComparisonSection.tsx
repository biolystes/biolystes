import { useState, useRef, useEffect } from "react";
import { cn } from "@lystes/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, StarHalf, Menu, Search, User, ShoppingBag, ChevronLeft, ChevronRight,
  Mic, ArrowUp, Leaf, Shield, Zap, ArrowRight, ArrowUpRight,
  BadgeCheck, FileCheck2, Award, Rabbit, Package, Check, Play,
  Clock, FlaskConical, Truck, Warehouse, Users, Timer, Eye, TriangleAlert,
  MousePointerClick, PackagePlus, SendHorizontal, ExternalLink,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { TrustpilotStars } from "@lystes/components/reviews/TrustpilotStars";
import { AnimatedChat } from "./AnimatedChat";
import ugcNew1 from "@lystes/assets/kaniwa-ugc-new-1.jpg.asset.json";
import ugcNew2 from "@lystes/assets/kaniwa-ugc-new-2.jpg.asset.json";
import ugcNew3 from "@lystes/assets/kaniwa-ugc-new-3.jpg.asset.json";
import ugcNew4 from "@lystes/assets/kaniwa-ugc-new-4.jpg.asset.json";
import ugcNew5 from "@lystes/assets/kaniwa-ugc-new-5.jpg.asset.json";
const kaniwaUgc2 = ugcNew2.url;
const kaniwaUgc3 = ugcNew3.url;
const kaniwaUgc4 = ugcNew4.url;
const kaniwaUgc5 = ugcNew5.url;
const kaniwaUgc6 = ugcNew1.url;
import kaniwaNewAsset1 from "@lystes/assets/kaniwa-product-a-v2.jpg.asset.json";
import kaniwaNewAsset2 from "@lystes/assets/kaniwa-product-b-v2.jpg.asset.json";
import kaniwaNewAsset3 from "@lystes/assets/kaniwa-product-c-v2.png.asset.json";
const kaniwaShot1 = kaniwaNewAsset1.url;
const kaniwaShot2 = kaniwaNewAsset2.url;
const kaniwaShot3 = kaniwaNewAsset3.url;
import kaniwa1 from "../assets/kaniwa-1.jpg";
import kaniwa2 from "../assets/kaniwa-2.jpg";
import kaniwa3 from "../assets/kaniwa-3.jpg";
import kaniwa4 from "../assets/kaniwa-4.jpg";
import kaniwa5 from "../assets/kaniwa-5.jpg";
import kaniwa6 from "../assets/kaniwa-6.jpg";
import kaniwa7 from "../assets/kaniwa-7.jpg";
import kaniwa8 from "../assets/kaniwa-8.jpg";
import kaniwaNew1 from "../assets/kaniwa-new-1.png";
import kaniwaNew2 from "../assets/kaniwa-new-2.png";
import fralene1 from "../assets/fralene-1.jpg";
import fralene2 from "../assets/fralene-2.jpg";
import fralene3 from "../assets/fralene-3.jpg";
import fralene4 from "../assets/fralene-4.jpg";
import fralene5 from "../assets/fralene-5.jpg";
import fralene6 from "../assets/fralene-6.jpg";
import sevmylook1 from "../assets/sevmylook-1.jpg";
import sevmylook2 from "../assets/sevmylook-2.jpg";
import sevmylook3 from "../assets/sevmylook-3.jpg";
import sevmylook4 from "../assets/sevmylook-4.jpg";
import sevmylook5 from "../assets/sevmylook-5.jpg";
import sevmylook6 from "../assets/sevmylook-6.jpg";
import sevmylook7 from "../assets/sevmylook-7.jpg";
import sevmylook8 from "../assets/sevmylook-8.jpg";
import sevmylook9 from "../assets/sevmylook-9.jpg";
import pmyrris1 from "../assets/pmyrris-ugc-1.webp";
import pmyrris2 from "../assets/pmyrris-ugc-2.jpg";
import pmyrris3 from "../assets/pmyrris-ugc-3.jpg";
import pmyrris4 from "../assets/pmyrris-ugc-4.jpg";
import pmyrris5 from "../assets/pmyrris-ugc-5.jpg";
import demoVideo from "../assets/lystesai-demo.mov";
import newVideoAsset from "@lystes/assets/newvideo.MOV.asset.json";
import showcase1Asset from "@lystes/assets/showcase-1.mp4.asset.json";
import showcase2Asset from "@lystes/assets/showcase-2.mp4.asset.json";
import coiffureAfterAsset from "@lystes/assets/coiffure-after.jpg.asset.json";
import coiffureApresV2Asset from "@lystes/assets/coiffure-apres-v2.png.asset.json";
import coiffureAvantV2Asset from "@lystes/assets/coiffure-avant-v2.png.asset.json";
import coiffureProduitAsset from "@lystes/assets/coiffure-produit-v2.png.asset.json";
const CERT_LOGOS = [
  "https://biolystes.com/assets/cert-1-CtUmpA6O.png",
  "https://biolystes.com/assets/cert-2-BjMfeyj8.png",
  "https://biolystes.com/assets/cert-3-LFM-cmK9.png",
  "https://biolystes.com/assets/cert-4-BsqAt3w5.png",
  "https://biolystes.com/assets/cert-5-Dz4uvPKn.png",
  "https://biolystes.com/assets/cert-6-BlNS_xEK.png",
  "https://biolystes.com/assets/cert-7-DzjdONfT.png",
  ];



const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

function PhoneHeader() {
  return (
    <div className="flex items-center justify-between px-3 pt-5 pb-2 z-20">
      <div className="flex items-center gap-3">
        <Menu className="w-3.5 h-3.5 text-foreground" />
      </div>
      <div className="font-serif font-bold text-[14px] tracking-wide text-foreground">Kaniwa</div>
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <ShoppingBag className="w-3.5 h-3.5 text-foreground" />
          <span className="absolute -top-1 -right-1 bg-foreground text-primary-foreground text-[7px] font-bold w-2.5 h-2.5 flex items-center justify-center rounded-full">1</span>
        </div>
      </div>
    </div>
  );
}

function ProductInfo({ tp = false }: { tp?: boolean }) {
  const { t } = useTranslation();
  return (
    <>
      {tp && (
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex text-sm">
            {[0,1,2,3].map((i) => (
              <Star key={i} className="fill-current" style={{ background: "#4c6dff", color: "#fff", margin: 1, padding: 3, width: 8, height: 8, boxSizing: "content-box" }} />
            ))}
            <StarHalf className="fill-current" style={{ background: "#4c6dff", color: "#fff", margin: 1, padding: 3, width: 8, height: 8, boxSizing: "content-box" }} />
          </div>
          <span className="text-xs font-bold text-foreground">4.8/5</span>
          <span className="text-xs text-muted-foreground">(241 avis)</span>
        </div>
      )}
      <h3 className="text-[14px] font-bold leading-tight text-neutral-900 mb-1">{t("agentExtras.productTitle")}</h3>
    </>
  );
}

export default function DiagnosticComparisonSection({ hideStats = false }: { hideStats?: boolean } = {}) {
  const { t } = useTranslation();
  return (
    <section className="max-w-5xl mx-auto mt-8 rounded-[2rem] md:rounded-[2.75rem] p-4 sm:p-6 md:p-8 overflow-hidden">
      {/* ── Header ── */}
      <div className="max-w-4xl mx-auto px-6 text-center pt-36 pb-0 md:pt-24 md:pb-0">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="flex items-center justify-center gap-3 mb-4">
          <span className="bg-foreground text-primary-foreground text-[8px] font-semibold tracking-[0.8px] uppercase px-5 py-2 rounded-full">En 10 jours ouvrés</span>
          <span className="text-[8px] text-foreground font-medium tracking-[0.8px] uppercase">Profitez de plus de 18 ans d'expérience</span>
        </motion.div>
        <motion.h1 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-foreground max-w-[726px] mx-auto text-[36px] md:text-[56px] lg:text-[52px]"
          style={{ fontFamily: '"Inter", "Satoshi", sans-serif', lineHeight: "1em", letterSpacing: 0, fontWeight: 100 }}>
          Lancez votre marque cosmétique bio <br />et végane sans vous ruiner
        </motion.h1>
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="mt-8 text-base md:text-[15px] text-foreground max-w-[880px] mx-auto leading-relaxed md:leading-[1.5]"
          style={{ textWrap: "balance" }}>
          Lancer sa propre marque de cosmétiques bio et végane certifiés ECOCERT et COSMOS. Pas de stock à acheter, pas de minimum de commande, pas de graphiste, pas de webmaster, pas de photographe, ni même de logisticien pour expédier les commandes. On prend tout en charge de A à Z
        </motion.p>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
          className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="/auth?mode=signup" className="inline-flex items-center justify-center gap-2.5 pl-[26px] pr-3 py-3 rounded-full bg-black text-white text-[14px] font-medium leading-none min-w-[228px] hover:opacity-90 hover:-translate-y-0.5 transition-all">
            <span className="whitespace-nowrap">S'inscrire gratuitement</span>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-black shrink-0"><ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} /></span>
          </a>
          <a href="/tarifs" className="btn-outline">
            <span>Voir les tarifs</span>
            <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
          </a>
        </motion.div>
        {/* Social proof strip */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] text-neutral-600">
          <span className="inline-flex items-center gap-1.5"><span className="text-black font-semibold">2 400+</span> marques accompagnées</span>
          <span className="hidden sm:inline text-neutral-300">·</span>
          <span className="inline-flex items-center gap-1.5"><span className="text-black font-semibold">+30 %</span> de taux de conversion moyen</span>
          <span className="hidden sm:inline text-neutral-300">·</span>
          <span className="inline-flex items-center gap-1.5"><span className="text-black font-semibold">5 min</span> d'installation, sans développeur</span>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
          className="flex items-center justify-center gap-6 flex-wrap mt-12 mb-2">
          <span className="flex items-center gap-2 text-sm text-foreground"><Leaf className="h-4 w-4" strokeWidth={1.5} />Certifié Bio &amp; Végan</span>
          <span className="flex items-center gap-2 text-sm text-foreground"><Shield className="h-4 w-4" strokeWidth={1.5} />Conforme au règlement CE 1223/2009</span>
          <span className="flex items-center gap-2 text-sm text-foreground"><Zap className="h-4 w-4" strokeWidth={1.5} />Lancement Rapide</span>
        </motion.div>
        <div className="overflow-hidden py-4 mt-2">
          <div className="flex gap-12 items-center animate-marquee" style={{ width: "max-content" }}>
            {[...CERT_LOGOS, ...CERT_LOGOS].map((src, i) => (
              <img key={i} src={src} alt="Logo de certification cosmétique bio et végane" className="w-auto object-contain" style={{ maxHeight: 80, filter: "brightness(0)" }} loading="lazy" />
            ))}
          </div>
        </div>
      </div>
      <section className="overflow-hidden py-3 bg-background">
        <div className="flex gap-3 px-3" style={{ overflowX: "auto", scrollbarWidth: "none" }}>
          {[
            "https://biolystes.com/assets/kaniwa-1-BZ624Hyw.jpg",
            "https://biolystes.com/assets/fralene-3-DdwnW6I4.jpg",
            "https://biolystes.com/assets/sevmylook-1-C1yFcjUj.jpg",
            "https://biolystes.com/assets/pmyrris-1-BZA_AcNE.jpg",
            "https://biolystes.com/assets/kaniwa-6-D2a5t0QS.jpg",
            "https://biolystes.com/assets/fralene-10-DGPFUZiI.jpg",
            "https://biolystes.com/assets/sevmylook-3-Bx7A6QEM.jpg",
            "https://biolystes.com/assets/pmyrris-4-CIW_Zott.jpg",
          ].map((src, i) => (
            <div key={i} className="shrink-0 w-[200px] md:w-[260px] aspect-[3/4] rounded-2xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <section id="section-qualite" className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: BadgeCheck, title: "Certifié Bio & Végan", desc: "Formulations naturelles certifiées par des organismes indépendants." },
              { icon: Leaf, title: "ECOCERT / COSMOS", desc: "Standards écologiques européens et internationaux respectés." },
              { icon: FileCheck2, title: "Enregistré CPNP", desc: "Conformité totale aux normes européennes et britanniques." },
              { icon: Award, title: "ISO 22716", desc: "Bonnes pratiques de fabrication cosmétique." },
              { icon: Rabbit, title: "Non testé sur animaux", desc: "Aucune expérimentation animale à aucun stade." },
              { icon: Package, title: "Packaging recyclable", desc: "Emballages conçus pour être 100% recyclables." },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="bg-secondary p-5 rounded-xl">
                <div className="w-10 h-10 mb-3 rounded-full bg-background flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                </div>
                <h3 className="text-xs font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-foreground text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 mb-8">
            <div className="w-full">
              <div className="space-y-4 mb-16 text-center">
                <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">Retour client</motion.p>
                <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-2xl mx-auto text-foreground leading-relaxed">
                  <b>Avis d'une de nos clientes</b> <br />sur sa sélection de produits
                </motion.h2>
                <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="text-foreground max-w-xl mx-auto leading-relaxed">
                  Sev Formal, beauty expert internationale basée entre Miami et Paris, nous fait un retour sur les atouts des produits qu'elle a sélectionnés pour sa marque.
                </motion.p>
              </div>
              <div className="overflow-hidden">
                <div className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                  {[
                    { src: "https://biolystes.com/assets/insta-1-BRKEOtTZ.jpg", alt: "Présentation produit Biolystes 1" },
                    { src: "https://biolystes.com/assets/insta-2-BXvZ8yBX.jpg", alt: "Présentation produit Biolystes 2" },
                    { src: "https://biolystes.com/assets/insta-3-DIardOJ_.jpg", alt: "Présentation produit Biolystes 3" },
                    { src: "https://biolystes.com/assets/insta-4-CO3ISBB7.jpg", alt: "Présentation produit Biolystes 4" },
                  ].map((item, i) => (
                    <button key={i} className="relative shrink-0 w-[200px] md:w-[calc((100%_-_32px)/3)] aspect-[360/575] rounded-2xl overflow-hidden cursor-pointer border-0 p-0 bg-transparent">
                      <img src={item.src} alt={item.alt} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                          <Play className="h-5 w-5 text-foreground ml-0.5" fill="currentColor" stroke="currentColor" strokeWidth={2} />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 space-y-10">
            <div>
              <div className="flex items-baseline justify-between mb-6 border-b border-foreground/15 pb-3">
                <p className="text-[10px] tracking-[0.3em] uppercase text-foreground">Sans</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/50">Nos formulations excluent</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Parabènes", "Silicones", "PEG", "Filtres UV chimiques", "Microplastiques", "Colorants artificiels", "Phosphates", "Conservateurs synthétiques", "Gluten", "Noix"].map((item, i) => (
                  <span key={i} className="text-sm text-foreground/60 line-through decoration-foreground/40 px-4 py-2 rounded-full border border-foreground/15">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ExperienceSection />
      <ProcessSection />
      <DeliverySection />
      <PortfolioSection />
      <CatalogSection />
      <ReassortSection />
      <TestimonialSection />
      <ConstatSection />
      <LaunchSection />





      {/* ── Before / After Phones ── */}
      <PhonesCompareBlock t={t} />
    </section>
  );
}

function PhonesCompareBlock({ t }: { t: (k: string) => string }) {
  const [mobileTab, setMobileTab] = useState<"before" | "after">("after");

  const beforePhone = (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
      className="flex flex-col items-center gap-3.5 relative z-10 w-[220px] shrink-0">
      <div className="hidden md:block bg-black text-white px-4 py-1.5 rounded-lg font-bold text-[8px] tracking-widest uppercase">{t("agentExtras.competitorsLabel")}</div>
      <div className="w-[220px] bg-background rounded-[1.75rem] overflow-hidden relative flex flex-col border border-border" style={{ background: '#fff' }}>
        <PhoneHeader />
        <div className="w-full h-44 relative pt-2 overflow-hidden" style={{ background: '#f5f5f5' }}>
          <div className="flex justify-center items-start h-full">
            <img src="https://i0.wp.com/kaniwabotanique.com/wp-content/uploads/2025/08/veuDbzM0ysQo5wxsfo1yvp1BnqZbx7PW-scaled.jpg?w=1930&ssl=1" alt="Produit" className="w-[88px] h-[130px] object-cover rounded-xl border border-border relative z-10" />
          </div>
          <div className="absolute bottom-3 w-full flex justify-center gap-1.5 z-20">
            <div className="w-1 h-1 rounded-full bg-foreground" />
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          </div>
        </div>
        <div className="px-3.5 sm:px-4 mt-3 pb-4">
          <ProductInfo />
          <p className="text-[11px] text-muted-foreground leading-snug mb-3 h-[48px]">
            {t("agentExtras.competitorProductDesc")}
          </p>
          <button className="w-full bg-foreground text-primary-foreground py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 text-[9px] tracking-wide uppercase mb-2.5">
            {t("agentExtras.addToCart")}<span className="w-px h-2.5 bg-muted-foreground/50 mx-1.5" />49,90€
          </button>
        </div>
      </div>
    </motion.div>
  );

  const afterPhone = (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
      className="flex flex-col items-center gap-3.5 relative w-full max-w-[340px] sm:w-[240px] sm:max-w-none shrink-0">
      <div className="hidden md:block bg-black text-white px-4 py-1.5 rounded-lg font-bold text-[8px] tracking-widest uppercase z-10">
        {t("agentExtras.withLystesLabel")}
      </div>
      <div className="relative w-full">
        <div className="w-full sm:w-[240px] bg-background rounded-[1.75rem] overflow-hidden relative flex flex-col z-10 border border-border" style={{ background: '#fff' }}>
          <PhoneHeader />
          <div className="w-full relative mt-1.5 shrink-0">
            <div className="flex overflow-x-auto gap-2.5 px-3.5 sm:px-4 pb-4 pt-1.5" style={{ scrollbarWidth: "none" }}>
              {[
                "https://lystes.ai/images/clients/kaniwa-6.jpg",
                kaniwaUgc2,
                "https://lystes.ai/images/clients/kaniwa-8.jpg",
                kaniwaUgc4,
                "https://lystes.ai/images/clients/kaniwa-7.jpg",
                kaniwaUgc5,
                "https://lystes.ai/images/clients/kaniwa-4.jpg",
                kaniwaUgc5,
              ].map((src, i) => (
                <div key={i} className="snap-start shrink-0 relative flex flex-col items-center">
                  <img src={src} alt="" className="w-[160px] h-[185px] object-cover rounded-xl relative z-10 border border-border" />
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
          <div className="px-3.5 sm:px-4 mt-3">
            <ProductInfo tp />
            <p className="text-[11px] text-muted-foreground leading-snug mb-3">
              {t("agentExtras.descPrefix")}
            </p>
            <AnimatedChat />
            <button className="w-full bg-foreground text-primary-foreground py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 mb-3 text-[9px] tracking-wide uppercase">
              {t("agentExtras.addToCart")}<span className="w-px h-2.5 bg-muted-foreground/50 mx-1.5" />49,90€
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="py-4 md:py-10">
      <div className="max-w-7xl mx-auto px-1 sm:px-6">
        {/* Mobile: auto-rotating tabs */}
        <div className="md:hidden">
          <div className="flex justify-center mb-5">
            <div className="inline-flex gap-1 bg-[#f1f1f1] rounded-[12px] p-[7px]">
              {(["before", "after"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setMobileTab(k)}
                  className={cn(
                    "px-4 py-1.5 rounded-[9px] text-[10px] font-semibold tracking-wide uppercase transition-all",
                    mobileTab === k ? "bg-foreground text-primary-foreground" : "bg-white text-foreground/60"
                  )}
                >
                  {k === "before" ? t("agentExtras.competitorsLabel") : t("agentExtras.withLystesLabel")}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex justify-center"
              >
                {mobileTab === "before" ? beforePhone : afterPhone}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop: side by side */}
        <div className="hidden md:flex w-full justify-center items-start md:overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          <div className="relative flex flex-row items-start justify-center gap-7 min-w-max">
            {beforePhone}
            {afterPhone}
          </div>
        </div>
      </div>
    </section>
  );
}

function UgcScrollStrip() {
  const images = [kaniwaUgc3, kaniwaUgc4, kaniwaUgc2, kaniwaUgc5, kaniwaUgc3, kaniwaUgc4, kaniwaUgc2, kaniwaUgc5];
  return (
    <div className="overflow-hidden pb-6 -mx-2 px-2">
      <motion.div
        className="flex gap-2 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      >
        {images.map((src, i) => (
          <div key={i} className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

const EXPERIENCE_VIDEOS = [
  "https://biolystes.com/videos/exp-1.mp4",
  "https://biolystes.com/videos/exp-2.mov",
  "https://biolystes.com/videos/exp-3.mov",
  "https://biolystes.com/videos/exp-9.mp4",
  "https://biolystes.com/videos/exp-11.mp4",
  "https://biolystes.com/videos/exp-12.mp4",
  "https://biolystes.com/videos/exp-4.mov",
  "https://biolystes.com/videos/exp-5.mov",
  "https://biolystes.com/videos/exp-42.mov",
  "https://biolystes.com/videos/exp-43.mov",
  "https://biolystes.com/videos/exp-44.mp4",
  "https://biolystes.com/videos/exp-45.mov",
  "https://biolystes.com/videos/exp-46.mov",
  "https://biolystes.com/videos/exp-48.mp4",
  "https://biolystes.com/videos/exp-49.mov",
  "https://biolystes.com/videos/exp-50.mov",
  "https://biolystes.com/videos/exp-51.mov",
  "https://biolystes.com/videos/exp-52.mov",
  ];

const EXPERIENCE_PILLARS = [
  { n: "1", title: "Profitez de 18 ans d'expérience e-commerce", desc: "Nous vous accompagnons avec un savoir-faire éprouvé dans le e-commerce et la cosmétique naturelle." },
  { n: "2", title: "Offrez-vous des services 360° premium", desc: "Identité visuelle, packagings et boutique en ligne conçus pour valoriser votre marque dès le départ." },
  { n: "3", title: "Profitez de notre réseau pour vous développer", desc: "Accédez à nos partenaires experts pour accélérer votre croissance sans multiplier les prestataires." },
  ];

function ExperienceSection() {
  const [offset, setOffset] = useState(0);
  const cardWidth = 240 + 16; // md width + gap
  const step = cardWidth * 2;
  return (
    <section id="section-experience" className="py-12 md:py-16 bg-foreground text-primary-foreground" style={{ borderRadius: "31px", marginBottom: "33px" }}>
      <div className="w-full overflow-hidden mb-16 relative">
        <div className="overflow-hidden">
          <div className="flex gap-4 transition-transform duration-500" style={{ transform: `translate3d(-${offset}px, 0px, 0px)` }}>
            {EXPERIENCE_VIDEOS.map((src, i) => (
              <div key={i} className="flex-shrink-0 w-[200px] md:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden bg-black">
                <video src={src} autoPlay loop playsInline muted className="w-full h-full object-cover" preload="none" />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => setOffset((o) => Math.max(0, o - step))}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background text-foreground flex items-center justify-center shadow-xl z-10 hover:opacity-80 transition-opacity"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setOffset((o) => Math.min((EXPERIENCE_VIDEOS.length - 4) * cardWidth, o + step))}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-background text-foreground flex items-center justify-center shadow-xl z-10 hover:opacity-80 transition-opacity"
          aria-label="Suivant"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-2xl mx-auto text-primary-foreground leading-relaxed">
          18 ans d'expérience dans le secteur <br />de la beauté ont donné naissance à Biolystes
        </motion.h2>
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="mt-6 text-base md:text-lg text-primary-foreground max-w-2xl mx-auto leading-relaxed">
          Nous avons éliminé les obstacles pour vous permettre de vous concentrer sur l'essentiel : bâtir une marque qui vous ressemble.
        </motion.p>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="mt-10 flex flex-wrap justify-center gap-4">
          <a href="https://kaniwabotanique.com" target="_blank" rel="noopener noreferrer" className="btn-startup-white">
            <span>Voir le dernier projet</span>
            <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
          </a>
          <a href="https://biolystes.pro/rdv" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 pl-4 sm:pl-5 pr-1.5 py-1.5 rounded-full bg-transparent text-primary-foreground text-[13px] sm:text-sm font-medium border border-primary-foreground hover:bg-primary-foreground/10 transition">
            <span>Demander le catalogue</span>
            <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-foreground text-foreground transition-transform group-hover:rotate-45">
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </a>
        </motion.div>
      </div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
        className="max-w-5xl mx-auto px-6 mt-20 grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/20">
        {EXPERIENCE_PILLARS.map((p) => (
          <div key={p.n} className="px-8 py-10 md:py-8">
            <span className="text-4xl text-primary-foreground" style={{ fontFamily: '"Inter", "Satoshi", sans-serif', fontWeight: 100 }}>{p.n}</span>
            <h3 className="text-sm font-black uppercase tracking-wide text-primary-foreground mt-3 mb-3">{p.title}</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}

const PROCESS_STEPS = [
  { label: "ÉTAPE 1", title: "Sélection de Produits", desc: "Choisissez parmi notre catalogue de produits certifiés bio, végans, conformes au règlement européen, prêts à être étiquetés avec votre marque.", img: "https://lystes.ai/__l5e/assets-v1/f1a046b0-ea2a-40a1-a6cf-019127384607/clea-eye-cream.png" },
  { label: "ÉTAPE 2", title: "Design Packaging Personnalisé", desc: "Vous nous fournissez votre logo et inspirations. Nous créons une identité visuelle unique avec des étiquettes et packagings professionnels pour votre marque.", img: "https://biolystes.com/assets/kaniwa-1-BZ624Hyw.jpg" },
  { label: "ÉTAPE 3", title: "Envoi des échantillons", desc: "Commandez vos échantillons pour découvrir et valider nos produits. C'est le moyen idéal de tester sans risque avant de lancer votre marque en toute confiance.", img: "https://biolystes.com/assets/envoi-echantillons-step-BPqAdt9s.png" },
  { label: "ÉTAPE 4", title: "Photos Packshots et Ambiance", desc: "Nous réalisons un set complet de photos haute qualité (packshots produits, images d'ambiance) pour sublimer votre site et vos campagnes marketing.", img: "https://biolystes.com/assets/sevmylook-20-XhIM2aCJ.jpg" },
  { label: "ÉTAPE 5", title: "Création du Site E-commerce", desc: "Nous créons et configurons votre boutique en ligne prête à vendre, sans nécessiter d'investissement technique de votre part.", img: "https://biolystes.com/assets/ecommerce-step-BwZ2tUNc.png" },
  { label: "ÉTAPE 6", title: "Logistique & Expédition Simplifiées", desc: "De la production à la demande à l'expédition sous votre marque, nous nous occupons de tout. Vous vous concentrez sur la croissance.", img: "https://biolystes.com/assets/logistique-step-BVjckAeq.jpg" },
  { label: "ÉTAPE 7 (Optionnel)", title: "Coaching ou accompagnement", desc: "Optimisez vos chances de réussite en vous faisant accompagner par des experts disposant de 18 ans d'expérience dans ce secteur d'activité.", img: "https://biolystes.com/assets/coaching-step-CzMjwuyt.png" },
  ];

function ProcessSection() {
  const [step, setStep] = useState(0);
  const current = PROCESS_STEPS[step];
  const cream = "#fff";
  return (
    <section id="section-comprend">
      <section className="bg-foreground" style={{ borderRadius: "31px" }}>
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight max-w-2xl mx-auto text-balance mx-auto" style={{ color: cream }}>
              Comment fonctionne la mise en place de votre marque en 10 jours ouvrés ?
            </h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: "rgba(255, 255, 255, 0.667)" }}>
              Suivez notre processus simplifié, de la conception à l'automatisation.
            </p>
          </div>

          <div className="flex justify-center items-center gap-2 md:gap-3 mb-10 flex-wrap">
            {PROCESS_STEPS.map((_, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => setStep(i)}
                  className="w-8 h-8 rounded-full text-xs font-semibold border transition-colors"
                  style={{
                    backgroundColor: i === step ? cream : "transparent",
                    color: i === step ? "rgb(18, 18, 18)" : "rgba(255, 255, 255, 0.533)",
                    borderColor: i === step ? cream : "rgba(255, 255, 255, 0.3)",
                  }}
                >
                  {i + 1}
                </button>
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="w-4 md:w-6 h-px" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }} />
                )}
              </div>
            ))}
          </div>

          <div className="max-w-2xl mx-auto rounded-2xl p-6 md:p-10" style={{ backgroundColor: cream }}>
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-6 items-center">
                <div className="order-2 md:order-1">
                  <span className="text-xs font-semibold text-muted-foreground block mb-2 uppercase tracking-wider">{current.label}</span>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{current.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{current.desc}</p>
                </div>
                <div className="rounded-lg w-full overflow-hidden order-1 md:order-2" style={{ aspectRatio: "284 / 352.55" }}>
                  <img src={current.img} alt={current.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="inline-flex items-center gap-2 text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-full disabled:opacity-50 disabled:pointer-events-none"
              >
                <ChevronLeft className="h-3.5 w-3.5" />Précédent
              </button>
              <button
                onClick={() => setStep((s) => Math.min(PROCESS_STEPS.length - 1, s + 1))}
                disabled={step === PROCESS_STEPS.length - 1}
                className="inline-flex items-center gap-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3 rounded-full disabled:opacity-50 disabled:pointer-events-none"
              >
                Suivant<ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

const CATALOG_ITEMS = [
  { img: kaniwa1, name: "Crème de nuit peaux sensibles" },
  { img: kaniwa2, name: "Sérum contour des yeux" },
  { img: kaniwa3, name: "Tonique exfoliant acide glycolique" },
  { img: kaniwa4, name: "Sérum perfecteur de pigment" },
  { img: kaniwa5, name: "Crème de jour hydratante" },
  { img: kaniwa6, name: "Huile visage nourrissante" },
  { img: kaniwa7, name: "Sérum naturel alternatif au rétinol" },
  { img: kaniwa8, name: "Gel booster au ginkgo antioxydant" },
  ];

function SectionHeader({ eyebrow, title, subtitle, centered = false }: { eyebrow: string; title: string; subtitle?: string; centered?: boolean }) {
  return (
    <div className={cn("space-y-4 mb-12", centered && "text-center")}>
      <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">
        {eyebrow}
      </motion.p>
      <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl text-foreground leading-relaxed">
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="text-foreground max-w-xl leading-relaxed">
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

function DeliverySection() {
  return (
    <section id="section-livraison" className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-6">
        <SectionHeader eyebrow="La livraison" title="Comment fonctionne l'expédition de vos commandes ?" />
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="p-[44px] rounded-2xl border-0" style={{ background: "#f1f1f161" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
                <Clock className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Mode Standard</h3>
                <p className="text-xs text-foreground">Livraison en 6-7 jours</p>
              </div>
            </div>
            <div className="space-y-4 text-sm text-foreground leading-relaxed">
              <p>Votre client passe commande sur votre boutique en ligne.</p>
              <p>Le laboratoire fabrique le produit à la demande, sous votre nom, avec votre packaging.</p>
              <p>Le colis est expédié directement chez votre client. <strong className="text-foreground">Aucun stock nécessaire.</strong></p>
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="p-[44px] rounded-2xl border-0" style={{ background: "#f1f1f161" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
                <Zap className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Mode Express</h3>
                <p className="text-xs text-foreground">Livraison en 24-48h</p>
              </div>
            </div>
            <div className="space-y-4 text-sm text-foreground leading-relaxed">
              <p>Achetez uniquement le stock nécessaire, sans minimum de quantité ni MOQ, et placez-le chez notre logisticien.</p>
              <p>Réapprovisionnement en une semaine au rythme de vos ventes — commandez juste ce qu'il faut, sans risque de surstock.</p>
              <p>Vos clients reçoivent leur commande <strong className="text-foreground">en 24 à 48 heures,</strong> expédiée directement par le logisticien.</p>
            </div>
          </motion.div>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          {[
            { icon: ShoppingBag, label: "Commande client" },
            { icon: FlaskConical, label: "Fabrication" },
            { icon: Package, label: "Emballage" },
            { icon: Truck, label: "Expédition" },
            { icon: Check, label: "Livré" },
          ].map((step, i, arr) => (
            <div key={i} className="flex items-center gap-3 md:flex-col md:gap-2 relative">
              <div className="w-12 h-12 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
                <step.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-semibold text-foreground">{step.label}</span>
              {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block absolute -right-6 top-1/2 -translate-y-1/2" />}
            </div>
          ))}
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3} className="mt-12 p-6 rounded-xl bg-background border border-border text-center">
          <Shield className="h-5 w-5 text-foreground mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Chaque commande est expédiée <strong className="text-foreground">sous votre nom de marque</strong>. Votre client ne voit que votre marque, de l'emballage au bon de livraison.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const PORTFOLIO_BRANDS = [
  {
    name: "Kaniwa Botanique",
    desc: "Marque bio & vegan, lancée en 12 jours",
    href: "https://kaniwabotanique.com/",
    items: [kaniwa1, kaniwaUgc2, kaniwa3, kaniwaUgc4, kaniwa5, kaniwaUgc6, kaniwa7],
  },
  {
    name: "Fralène",
    desc: "Gamme soins visage premium",
    href: "https://fraleneparis.com/",
    items: [demoVideo, fralene2, fralene3, fralene4],
  },
  {
    name: "Sevmylook",
    desc: "Gamme solaire & soins visage par Séverine Formal",
    href: "https://sevmylook.com/",
    items: [sevmylook1, sevmylook2, sevmylook3, sevmylook4],
  },
  {
    name: "Pmyrris Beauty",
    desc: "Gamme soins capillaires naturels",
    href: "https://pmyrrisbeauty.fr/",
    items: [pmyrris1, pmyrris2, pmyrris3, pmyrris4],
  },
  ];

function PortfolioBrand({ brand }: { brand: typeof PORTFOLIO_BRANDS[0] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 220, behavior: "smooth" });
    }
  };
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">{brand.name}</h3>
          <p className="text-sm text-foreground">{brand.desc}</p>
        </div>
        <a href={brand.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-foreground hover:opacity-80 transition-opacity shrink-0 rounded-full px-4 py-2">
          Voir le site <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <div className="relative">
        <div ref={scrollRef} className="overflow-hidden rounded-2xl">
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
            {brand.items.map((src, i) => (
              <div key={i} className="flex-none w-[45%] md:w-[24%] aspect-[3/4] rounded-2xl overflow-hidden snap-start">
                {typeof src === "string" && src.endsWith(".mov") ? (
                  <video src={src} autoPlay loop playsInline muted className="w-full h-full object-cover" preload="none" />
                ) : (
                  <img src={src as string} alt={`${brand.name} ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                )}
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => scroll(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-md hover:bg-background transition-colors" aria-label="Précédent">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button onClick={() => scroll(1)} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center shadow-md hover:bg-background transition-colors" aria-label="Suivant">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}

function PortfolioSection() {
  return (
    <section id="section-portfolio" className="py-6 md:py-8">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader eyebrow="Portfolio" title="Plus de 100 marques accompagnées." />
        <div className="space-y-16">
          {PORTFOLIO_BRANDS.map((brand) => (
            <PortfolioBrand key={brand.name} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CatalogSection() {
  return (
    <section id="section-catalogue" className="bg-secondary py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader eyebrow="Catalogue" title="Des formulations d'excellence, prêtes à vendre." subtitle="Plus de 100 produits certifiés bio et végan, disponibles sans minimum de commande." />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATALOG_ITEMS.map((item, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="group cursor-pointer bg-foreground/[0.04] p-[13px] rounded-[13px] m-[1px]">
              <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-muted">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <p className="text-[9px] font-medium text-foreground text-center truncate">{item.name}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="mt-12 text-center flex flex-wrap justify-center gap-4">
          <a href="/auth?mode=signup" className="inline-flex items-center justify-center gap-2.5 pl-[26px] pr-3 py-3 rounded-full bg-black text-white text-[14px] font-medium leading-none min-w-[228px] hover:opacity-90 hover:-translate-y-0.5 transition-all">
            <span className="whitespace-nowrap">S'inscrire gratuitement</span>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-black shrink-0"><ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} /></span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

const REASSORT_FEATURES = [
  { icon: MousePointerClick, title: "Commande automatisée", desc: "Vous passez vos commandes via notre plateforme avec votre branding." },
  { icon: PackagePlus, title: "Fabrication Rapide", desc: "Le laboratoire fabrique le produit commandé sous 72h, avec votre branding." },
  { icon: SendHorizontal, title: "Livraison Directe", desc: "Le logisticien récupère votre colis au laboratoire et l'expédie dans votre établissement." },
  ];

function ReassortSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground leading-relaxed">
            Réassort Sans Minimum<br />Vous êtes un institut ? un centre médical ? un salon de coiffure ?
          </h2>
          <p className="text-foreground mt-4 max-w-xl mx-auto leading-relaxed text-sm">
            Pas besoin de minimum de stock pour vos points de vente physiques. Commandez 1, 10 ou 1000 produits selon vos besoins réels. Livré dans votre établissement en 6 à 7 jours.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
          {REASSORT_FEATURES.map((feature, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="text-center bg-foreground/[0.02] p-[34px] rounded-[33px]">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-background rounded-full mb-3">
                <feature.icon className="h-4 w-4 text-foreground" strokeWidth={1} />
              </div>
              <h3 className="text-xs font-semibold text-foreground mb-1 uppercase tracking-wide">{feature.title}</h3>
              <p className="text-foreground text-xs leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="relative max-w-[944px] mx-auto">
          <div className="bg-secondary rounded-xl p-6 md:p-10">
            <img src={kaniwaNew1} alt="Salon de coiffure équipé de cosmétiques en marque blanche" className="w-full rounded-lg" loading="lazy" />
          </div>
          <div className="hidden md:block absolute -left-16 bottom-20 max-w-[220px] shadow-lg rounded-xl overflow-hidden rotate-[-3deg] p-3 bg-foreground">
            <video src={showcase1Asset.url} autoPlay loop playsInline muted className="w-full rounded-xl object-cover aspect-[3/4]" preload="none" />
          </div>
          <div className="hidden md:block absolute -right-16 bottom-20 bg-secondary rounded-xl p-3 max-w-[220px] shadow-lg">
            <div className="overflow-hidden rounded-lg">
              <div className="flex">
                <img src={coiffureProduitAsset.url} alt="Cosmétique bio personnalisé Biolystes" className="w-full flex-shrink-0 object-cover aspect-square" loading="lazy" />
                <img src={coiffureAvantV2Asset.url} alt="Cosmétique bio personnalisé Biolystes" className="w-full flex-shrink-0 object-cover aspect-square" loading="lazy" />
                <img src={coiffureApresV2Asset.url} alt="Cosmétique bio personnalisé Biolystes" className="w-full flex-shrink-0 object-cover aspect-square" loading="lazy" />
                <img src={coiffureAfterAsset.url} alt="Cosmétique bio personnalisé Biolystes" className="w-full flex-shrink-0 object-cover aspect-square" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const WIRTZKIN_VIDEOS = [newVideoAsset.url, showcase2Asset.url, showcase1Asset.url];

function TestimonialSection() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  return (
    <section className="py-12 md:py-16 bg-foreground">
      <div className="max-w-5xl mx-auto px-6">
        <div className="space-y-4 mb-12 text-center">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-primary-foreground/60">
            Ils nous font confiance
          </motion.p>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-3xl md:text-4xl font-light tracking-tight max-w-2xl mx-auto text-primary-foreground">
            Le centre médical esthétique <br />Wirtzkin nous a choisi
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="text-base text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed">
            Wirtzkin, centre médical esthétique spécialisé dans les soins de la peau, a décidé de faire confiance à Biolystes pour la production de ses produits cosmétiques bio et végane.
          </motion.p>
        </div>
        <div className="relative">
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-6 px-6">
            {WIRTZKIN_VIDEOS.map((src, i) => (
              <button key={i} className="relative flex-shrink-0 w-[300px] md:w-[400px] aspect-[9/16] rounded-2xl overflow-hidden group snap-start cursor-pointer border-0 p-0 bg-black">
                <video src={src} autoPlay loop playsInline muted className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" preload="none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
          <button onClick={() => scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg transition-opacity z-10">
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button onClick={() => scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg transition-opacity z-10">
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex justify-center gap-2 mt-6">
            {WIRTZKIN_VIDEOS.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} className={cn("w-2 h-2 rounded-full transition-all", active === i ? "bg-primary-foreground w-6" : "bg-primary-foreground/30")} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const CONSTAT_CARDS = [
  { icon: Warehouse, title: "Le stock", desc: "La majorité des créateurs investissent jusqu'à 90 % de leur budget dans l'achat de stock. Une fois la marque lancée, il ne reste plus rien pour se faire connaître. Sans visibilité, pas de ventes. Le stock dort, la trésorerie fond, et le projet s'arrête." },
  { icon: FlaskConical, title: "La fabrication", desc: "Trouver la bonne formule, le bon dosage, le bon équilibre. Certains de nos clients avaient passé huit mois, un an, parfois des années en allers-retours avec des laboratoires, sans jamais réussir à finaliser un seul produit." },
  { icon: Users, title: "La chaîne de prestataires", desc: "Il ne suffit pas de trouver un bon laboratoire. Il faut aussi le bon designer, le bon photographe, le bon développeur. Si un seul maillon est faible, c'est toute votre image de marque qui en souffre." },
  { icon: Timer, title: "La procrastination", desc: "Des projets qui restent à l'état d'idée pendant des mois, parce que la complexité du parcours pousse à toujours remettre à demain." },
  { icon: Award, title: "Les certifications", desc: "COSMOS, ECOCERT, CPNP, ISO 22716, packaging recyclable, sans parabènes, sans silicones, sans microplastiques. Cocher toutes ces cases par vous-même, ça prend des années." },
  { icon: Eye, title: "Le manque de recul", desc: "Chaque nouvelle formulation demande du temps pour être affinée. C'est un investissement en temps que la plupart des créateurs n'ont tout simplement pas." },
  ];

function ConstatSection() {
  return (
    <section id="section-constat" className="bg-secondary py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="space-y-4 mb-16 text-center">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">
            Le constat
          </motion.p>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-2xl md:text-3xl font-light tracking-tight max-w-2xl mx-auto text-foreground leading-relaxed">
            Nous avons créé Biolystes car de nombreuses personnes échouent en raison de choix inadaptés lors du lancement de leur marque cosmétique bio et végane.
          </motion.h2>
        </div>
        <div className="space-y-6">
          {CONSTAT_CARDS.map((card, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="p-6 md:p-8 rounded-2xl bg-background">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
                  <card.icon className="h-5 w-5 text-destructive" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-sm text-foreground leading-relaxed">{card.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="mt-16 p-8 md:p-12 rounded-2xl bg-foreground text-center text-primary-foreground">
          <TriangleAlert className="h-6 w-6 mx-auto mb-4 opacity-70" strokeWidth={1.5} />
          <p className="text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
            Huit chances sur dix de tomber dans un de ces cas de figure. C'est ce constat qui a donné naissance à Biolystes. Nous avons éliminé chacun de ces obstacles, un par un, pour que vous puissiez vous concentrer sur l'essentiel : <span className="font-semibold">vendre et développer votre marque.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function LaunchSection() {
  return (
    <section id="section-lance" className="bg-secondary py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="space-y-6">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">
            Passez à l'action
          </motion.p>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground leading-relaxed">
            Prêt à lancer votre marque ?
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="text-foreground max-w-xl mx-auto leading-relaxed">
            Commencez par poser vos questions à notre assistant, explorez notre catalogue de formulations certifiées, ou créez votre compte pour démarrer.
          </motion.p>
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3} className="mt-16 flex flex-wrap justify-center gap-4">
          <a href="/auth?mode=signup" className="inline-flex items-center justify-center gap-2.5 pl-[26px] pr-3 py-3 rounded-full bg-black text-white text-[14px] font-medium leading-none min-w-[228px] hover:opacity-90 hover:-translate-y-0.5 transition-all">
            <span className="whitespace-nowrap">S'inscrire gratuitement</span>
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-black shrink-0"><ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} /></span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Shopping Assistant Compare (header + SANS/AVEC phones)
// Utilisé sur la page d'accueil `/` — sans contenu Biolystes.
// ─────────────────────────────────────────────────────────────
export function ShoppingAssistantCompareSection({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const [mobileTab, setMobileTab] = useState<"before" | "after">("after");
  return (
    <section className={cn("phone-unscope max-w-5xl mx-auto rounded-[2rem] md:rounded-[2.75rem] p-4 sm:p-6 md:p-8 overflow-hidden", compact ? "mt-0" : "mt-8")}>
      {!compact && (
        <div className="text-center max-w-5xl mx-auto px-3 sm:px-6 pt-12 md:pt-24 pb-10 md:pb-12">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-[10px] font-bold tracking-[2.5px] uppercase text-neutral-500 mb-5">
            {t("agentExtras.compareKicker")}
          </motion.p>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="font-['Inter'] font-thin text-[28px] sm:text-[40px] md:text-[51px] leading-[1.1] tracking-tight max-w-[780px] mx-auto mb-6 text-neutral-900 whitespace-pre-line">
            {t("agentExtras.compareTitle1")}
            <em className="italic">{t("agentExtras.compareTitleHL")}</em>
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="text-[14px] md:text-[17px] text-neutral-600 leading-[1.7] max-w-[640px] mx-auto whitespace-pre-line">
            {t("agentExtras.compareDescStart")}
          </motion.p>
        </div>
      )}

      <section className={cn(compact ? "py-8 md:py-12" : "py-4 md:py-10")}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Mobile tab bar */}
          <div className="md:hidden flex justify-center mb-6">
            <div className="inline-flex gap-1 bg-[#f1f1f1] rounded-[12px] p-[7px]">
              {(["before", "after"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setMobileTab(k)}
                  className={cn(
                    "px-4 py-1.5 rounded-[9px] text-[10px] font-semibold tracking-wide uppercase transition-all",
                    mobileTab === k ? "bg-foreground text-primary-foreground" : "bg-white text-foreground/60"
                  )}
                >
                  {k === "before" ? t("agentExtras.competitorsLabel") : t("agentExtras.withLystesLabel")}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full flex justify-center items-start md:overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            <div className="relative flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-10 md:min-w-max">

              {/* AVANT */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
                className={cn("md:flex flex-col items-center gap-4 relative z-10 w-[240px] shrink-0", mobileTab === "before" ? "flex" : "hidden")}>
                <div className="hidden md:block bg-black text-white px-5 py-2.5 rounded-full font-bold text-[9px] tracking-[0.15em] uppercase leading-none">{t("agentExtras.competitorsLabel")}</div>
                <div className="w-[240px] bg-background rounded-[1.75rem] overflow-hidden relative flex flex-col border border-border" style={{ background: '#fff' }}>
                  <PhoneHeader />
                  <div className="w-full h-44 relative pt-2 overflow-hidden" style={{ background: '#f5f5f5' }}>
                    <div className="flex justify-center items-start h-full">
                      <img src="https://i0.wp.com/kaniwabotanique.com/wp-content/uploads/2025/08/veuDbzM0ysQo5wxsfo1yvp1BnqZbx7PW-scaled.jpg?w=1930&ssl=1" alt="Produit" className="w-[88px] h-[130px] object-cover rounded-xl border border-border relative z-10" />
                    </div>
                    <div className="absolute bottom-3 w-full flex justify-center gap-1.5 z-20">
                      <div className="w-1 h-1 rounded-full bg-foreground" />
                      <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                    </div>
                  </div>
                  <div className="px-3.5 sm:px-4 mt-3 pb-4">
                    <ProductInfo />
                    <p className="text-[11px] text-muted-foreground leading-snug mb-3 h-[48px]">
                      {t("agentExtras.competitorProductDesc")}
                    </p>
                    <button className="w-full bg-foreground text-primary-foreground py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 text-[9px] tracking-wide uppercase mb-2.5">
                      {t("agentExtras.addToCart")}<span className="w-px h-2.5 bg-muted-foreground/50 mx-1.5" />49,90€
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* AVEC LYSTES */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
                className={cn("md:flex flex-col items-center gap-4 relative w-[240px] shrink-0", mobileTab === "after" ? "flex" : "hidden")}>
                <div className="hidden md:block bg-black text-white px-5 py-2.5 rounded-full font-bold text-[9px] tracking-[0.15em] uppercase z-10 leading-none">
                  {t("agentExtras.withLystesLabel")}
                </div>
                <div className="relative w-full">
                  <div className="w-[240px] bg-background rounded-[1.75rem] overflow-hidden relative flex flex-col z-10 border border-border" style={{ background: '#fff' }}>
                    <PhoneHeader />
                    <div className="bg-black text-white text-center py-1.5 text-[8px] tracking-[0.15em] uppercase font-semibold leading-none">
                      Livraison gratuite aujourd'hui
                    </div>
                    <div className="w-full relative mt-1.5 shrink-0 overflow-hidden">
                      <div className="flex gap-2.5 px-3.5 sm:px-4 pb-4 pt-1.5 animate-[ugc-slide_18s_linear_infinite] w-max">
                        {[
                          kaniwaShot1, kaniwaShot2, kaniwaShot3,
                          kaniwaShot1, kaniwaShot2, kaniwaShot3,
                          kaniwaShot1, kaniwaShot2, kaniwaShot3,
                          kaniwaShot1, kaniwaShot2, kaniwaShot3,
                        ].map((src, i) => (
                          <div key={i} className="shrink-0 relative flex flex-col items-center">
                            <img src={src} alt="" className="w-[160px] h-[185px] object-cover rounded-xl relative z-10 border border-border" />
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
                    <div className="px-3.5 sm:px-4 mt-3 pb-4">
                      <ProductInfo tp />
                      <p className="text-[11px] text-muted-foreground leading-snug mb-3">
                        {t("agentExtras.descPrefix")}
                      </p>
                      <div className="mb-4"><AnimatedChat compact={compact} /></div>
                      <button className="w-full bg-foreground text-primary-foreground py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 mt-2 text-[9px] tracking-wide uppercase leading-none">
                        {t("agentExtras.addToCart")}<span className="w-px h-2.5 bg-muted-foreground/50 mx-1.5" />49,90€
                      </button>
                      <div className="overflow-hidden pt-3 -mx-2 px-2">
                        <div className="flex gap-2 w-max animate-[ugc-slide_18s_linear_infinite]">
                          {[kaniwaUgc2, kaniwaUgc3, kaniwaUgc4, kaniwaUgc2, kaniwaUgc3, kaniwaUgc4, kaniwaUgc2, kaniwaUgc3].map((src, i) => (
                            <div key={i} className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                              <img src={src} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </section>

      {!compact && (
        <div className="text-center max-w-5xl mx-auto px-3 sm:px-6 pb-10 md:pb-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            className="mt-4 flex flex-wrap justify-center gap-4">
            <a href="/auth?mode=signup" className="inline-flex items-center justify-center gap-2.5 pl-[26px] pr-3 py-3 rounded-full bg-black text-white text-[14px] font-medium leading-none min-w-[228px] hover:opacity-90 hover:-translate-y-0.5 transition-all">
              <span className="whitespace-nowrap">S'inscrire gratuitement</span>
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white text-black shrink-0"><ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} /></span>
            </a>
            <a href="https://kaniwabotanique.com/product/serum-a-la-vitamine-c/" target="_blank" rel="noopener noreferrer" className="btn-outline">
              <span>Tester en ligne</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </a>
          </motion.div>
        </div>
      )}
    </section>
  );
}


