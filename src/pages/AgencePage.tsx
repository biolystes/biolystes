import { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import SafeVideo from "@/components/SafeVideo";
import {
  ArrowRight, Check, ChevronLeft, ChevronRight, HelpCircle, ExternalLink,
} from "lucide-react";
import AgenceServicesSection from "@/components/AgenceServicesSection";
import WirtzkinSection from "@/components/WirtzkinSection";

import kaniwa1 from "@/assets/kaniwa-1.jpg";
import kaniwa6 from "@/assets/kaniwa-6.jpg";
import kaniwa7 from "@/assets/kaniwa-7.jpg";
import kaniwaUgc2 from "@/assets/kaniwa-ugc-2.jpg";
import kaniwaUgc3 from "@/assets/kaniwa-ugc-3.jpg";
import kaniwaUgc4 from "@/assets/kaniwa-ugc-4.jpg";
import kaniwaUgc5 from "@/assets/kaniwa-ugc-5.png";
import kaniwaUgc6 from "@/assets/kaniwa-ugc-6.jpg";
import sevmylook1 from "@/assets/sevmylook-1.jpg";
import sevmylook3 from "@/assets/sevmylook-3.jpg";
import sevmylook7 from "@/assets/sevmylook-7.jpg";
import sevmylook20 from "@/assets/sevmylook-20.jpg";

const CTA_URL = "https://app.iclosed.io/e/paylystes/r2";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const portfolioBrands = [
  {
    name: "Kaniwa Botanique",
    tagline: "Stratégie réseaux sociaux + contenu IA",
    url: "https://kaniwabotanique.com/",
    photos: [kaniwa1, kaniwaUgc2, kaniwa7, kaniwaUgc3, kaniwaUgc4, kaniwaUgc5, kaniwaUgc6],
  },
  {
    name: "Sevmylook",
    tagline: "Stratégie complète par Séverine Formal (400K abonnés)",
    url: "https://sevmylook.com/",
    photos: [sevmylook1, sevmylook20, sevmylook7, sevmylook3],
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
              {typeof item === "object" && item !== null && "type" in item && item.type === "video" ? (
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

export default function AgencePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background -mx-6 lg:-mx-10 -mt-6 lg:-mt-10 overflow-x-hidden">

      {/* ═══ HERO ═══ */}
      <section id="section-decouvre" className="pt-36 pb-0 md:pt-44 md:pb-0">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-4">
            <span className="bg-foreground text-primary-foreground text-[8px] font-semibold tracking-[0.8px] uppercase px-5 py-2 rounded-full">
              Depuis 2005
            </span>
            <span className="text-[8px] text-foreground font-medium tracking-[0.8px] uppercase">
              Plus de 18 ans d'expérience en communication
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-foreground max-w-[726px] mx-auto text-[36px] md:text-[56px] lg:text-[74px]"
            style={{ fontFamily: "'Instrument Serif', serif", lineHeight: "1em", letterSpacing: 0 }}>
            Faites rayonner votre marque cosmétique avec une agence qui connaît votre secteur
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-base md:text-lg text-foreground max-w-2xl mx-auto leading-relaxed">
            Biolystes Communication est une agence spécialisée pour les marques cosmétiques bio et végane. Réseaux sociaux, publicités, influence, création de contenu, SEO — on gère votre visibilité de A à Z pour que vous puissiez vous concentrer sur vos ventes.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex flex-wrap justify-center gap-4">
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="btn-startup">
              <span>Prendre rendez-vous</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </a>
            <button onClick={() => navigate("/portfolio")} className="btn-outline">
              <span>Voir nos réalisations</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══ EXPÉRIENCE ═══ */}
      <section id="section-experience" className="py-12 md:py-16 bg-background">
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
            18 ans d'expérience en communication<br /> ont donné naissance à notre agence cosmétique
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="mt-6 text-base md:text-lg text-foreground max-w-2xl mx-auto leading-relaxed">
            Nous avons accompagné des dizaines de marques beauté. Aujourd'hui, on met cette expertise à disposition des porteurs de projets cosmétiques.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="https://kaniwabotanique.com" target="_blank" rel="noopener noreferrer" className="btn-startup">
              <span>Voir notre dernier projet</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </a>
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <span>Demander un audit gratuit</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </a>
          </motion.div>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
          className="max-w-5xl mx-auto px-6 mt-20 grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            { num: "1", title: "Stratégie sur-mesure pour votre marque", desc: "On analyse votre positionnement, votre cible et vos concurrents pour construire un plan de communication adapté à votre budget." },
            { num: "2", title: "Création de contenu premium", desc: "Photos IA, vidéos UGC, carrousels Instagram, articles SEO — du contenu professionnel sans les coûts d'une agence traditionnelle." },
            { num: "3", title: "Gestion complète de vos canaux", desc: "On publie, on engage, on analyse. Vos réseaux sociaux, vos campagnes pub et votre SEO sont entre de bonnes mains." },
          ].map((item) => (
            <div key={item.num} className="px-8 py-10 md:py-8">
              <span className="text-4xl text-foreground" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 100 }}>{item.num}</span>
              <h3 className="text-sm font-black uppercase tracking-wide text-foreground mt-3 mb-3">{item.title}</h3>
              <p className="text-sm text-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ═══ SERVICES (dark section) ═══ */}
      <section id="section-services" className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8" style={{ overflow: "visible" }}>
        <AgenceServicesSection />
      </section>

      {/* ═══ PORTFOLIO ═══ */}
      <section id="section-portfolio" className="py-6 md:py-8">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-8">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">Portfolio</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl text-foreground leading-relaxed">
              Des marques que nous avons accompagnées en communication.
            </motion.h2>
          </motion.div>

          <div className="space-y-16">
            {portfolioBrands.map((brand, idx) => (
              <motion.div key={brand.name} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp} custom={idx}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{brand.name}</h3>
                    <p className="text-sm text-foreground">{brand.tagline}</p>
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

      {/* ═══ TARIFS ═══ */}
      <section id="section-tarifs" className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-12 text-center">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">Tarifs</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground leading-relaxed">
              Des forfaits transparents adaptés à votre ambition
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {/* Pack Visibilité */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <div className="relative rounded-2xl p-7 md:p-9 flex flex-col border-2 border-foreground">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-foreground text-background">
                  Populaire
                </div>
                <h3 className="text-base font-extrabold uppercase tracking-tight mb-0.5 mt-2 text-foreground">Pack Visibilité</h3>
                <p className="text-xs mb-5 text-foreground">Réseaux sociaux + contenu</p>
                <div className="mb-6">
                  <span className="text-3xl md:text-[34px] font-extrabold text-foreground tracking-tight">499€</span>
                  <span className="text-[13px] ml-2 text-foreground">HT/mois</span>
                </div>
                <div className="flex flex-col mb-8 flex-1">
                  {[
                    "12 publications/mois",
                    "Calendrier éditorial",
                    "Création de visuels",
                    "Photos IA produits",
                    "Captions & hashtags optimisés",
                    "Community management",
                    "Rapport mensuel",
                    "SEO fiches produits",
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-3 py-1.5">
                      <Check size={14} strokeWidth={2} className="flex-shrink-0 mt-0.5 text-foreground" />
                      <span className="text-[13px] leading-relaxed text-foreground">{f}</span>
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
                  <HelpCircle size={14} strokeWidth={1.8} className="text-foreground" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">Bon à savoir</span>
                </div>
                <p className="text-[13px] leading-relaxed text-foreground">Client Biolystes ? Bénéficiez de -20% sur tous nos forfaits communication.</p>
              </div>
            </motion.div>

            {/* Pack Accélération */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <div className="relative rounded-2xl p-7 md:p-9 flex flex-col border border-border">
                <h3 className="text-base font-extrabold uppercase tracking-tight mb-0.5 text-foreground">Pack Accélération</h3>
                <p className="text-xs mb-5 text-foreground">Visibilité + Publicité + Influence</p>
                <div className="mb-6">
                  <span className="text-3xl md:text-[34px] font-extrabold text-foreground tracking-tight">999€</span>
                  <span className="text-[13px] ml-2 text-foreground">HT/mois</span>
                </div>
                <div className="flex flex-col mb-8 flex-1">
                  {[
                    "Tout le Pack Visibilité",
                    "20 publications/mois",
                    "Meta Ads (création & pilotage)",
                    "Visuels publicitaires",
                    "A/B testing des campagnes",
                    "1 campagne influence/mois",
                    "UGC IA ultraréaliste",
                    "Retargeting",
                    "2 articles blog SEO/mois",
                    "Rapport mensuel détaillé",
                    "Community management avancé",
                  ].map((f, i) => (
                    <div key={i} className="flex items-start gap-3 py-1.5">
                      <Check size={14} strokeWidth={2} className="flex-shrink-0 mt-0.5 text-foreground" />
                      <span className="text-[13px] leading-relaxed text-foreground">{f}</span>
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
                  <HelpCircle size={14} strokeWidth={1.8} className="text-foreground" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">Bon à savoir</span>
                </div>
                <p className="text-[13px] leading-relaxed text-foreground">Le budget publicitaire (dépenses Meta/Google) n'est pas inclus dans le forfait.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ WIRTZKIN ═══ */}
      <section className="py-12 md:py-16 bg-background">
        <WirtzkinSection />
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section id="section-lance" className="bg-secondary py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-6">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">Passez à l'action</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground leading-relaxed">
              Prêt à faire connaître votre marque ?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-foreground max-w-xl mx-auto leading-relaxed">
              Prenez rendez-vous pour un audit gratuit de votre communication actuelle et un plan d'action personnalisé.
            </motion.p>
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
            <div>
              <h5 className="text-sm font-bold mb-3">Biolystes.</h5>
              <p className="text-xs opacity-60 leading-relaxed mb-4">Agence de Communication pour Marques Cosmétiques Bio & Végane.</p>
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

            <div>
              <h6 className="text-xs font-semibold opacity-60 uppercase tracking-widest mb-3">Nos Services</h6>
              <ul className="space-y-2 text-xs">
                <li className="opacity-60">Réseaux sociaux</li>
                <li className="opacity-60">Publicité digitale</li>
                <li className="opacity-60">Création de contenu</li>
                <li className="opacity-60">SEO & Référencement</li>
                <li className="opacity-60">Influence Marketing</li>
              </ul>
            </div>

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

            <div>
              <h6 className="text-xs font-semibold opacity-60 uppercase tracking-widest mb-3">Restons en contact</h6>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2 opacity-60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  hello@biolystes.com
                </li>
                <li className="flex items-center gap-2 opacity-60 whitespace-nowrap">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  6 avenue Émile Deschanel, 75007 Paris
                </li>
              </ul>
            </div>
          </div>

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
