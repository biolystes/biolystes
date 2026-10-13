import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Link } from "@lystes/lib/lien-lystes";
import SafeVideo from "@lystes/components/bio/SafeVideo";
import {
  ArrowRight, Check, FlaskConical, Truck, Globe, Package, Leaf, Award, X,
  Rabbit, FileCheck2, BadgeCheck, ShoppingBag, MessageCircle, HelpCircle,
  Sparkles, Clock, Shield, Zap,
  AlertTriangle, Warehouse, Users, Eye, Timer, ChevronLeft, ChevronRight,
} from "lucide-react";
import ResponsabiliteSection from "@lystes/components/bio/ResponsabiliteSection";
import InstaFeedSection from "@lystes/components/bio/InstaFeedSection";
import WirtzkinSection from "@lystes/components/bio/WirtzkinSection";
import HomeHeroVideo, { FilConversation, NB, type HeroVariante, type MsgFil } from "@lystes/features/solutions/HomeHeroVideo";
import BioGammes from "@lystes/components/bio/BioGammes";
import BioFaq from "@lystes/components/bio/BioFaq";
import VisionEtagesBloc from "@lystes/features/solutions/VisionEtagesBloc";
import BlocsAccueilSecteur from "@lystes/features/solutions/BlocsAccueilSecteur";
import { Header } from "@lystes/components/landing/Header";
import { Footer } from "@lystes/components/landing/Footer";
import { useSansMotSeul } from "@lystes/hooks/useSansMotSeul";
import { CommeSurAccueil } from "@lystes/features/solutions/CommeSurAccueil";
import { Button } from "@lystes/components/ui/button";
import { ExternalLink, MousePointerClick, PackagePlus, SendHorizontal } from "lucide-react";
import salonCoiffure from "@lystes/assets/bio/salon-coiffure.webp";
import productBox from "@lystes/assets/bio/product-box.jpg";
import product235th1 from "@lystes/assets/bio/product-235th-1.jpg";
import product235th2 from "@lystes/assets/bio/product-235th-2.jpg";
import product235th3 from "@lystes/assets/bio/product-235th-3.jpg";

// Brand images for portfolio
import kaniwa1 from "@lystes/assets/bio/kaniwa-1.jpg";
import kaniwa6 from "@lystes/assets/bio/kaniwa-6.jpg";
import kaniwa7 from "@lystes/assets/bio/kaniwa-7.jpg";
import kaniwaUgc2 from "@lystes/assets/bio/kaniwa-ugc-2.jpg";
import kaniwaUgc3 from "@lystes/assets/bio/kaniwa-ugc-3.jpg";
import kaniwaUgc4 from "@lystes/assets/bio/kaniwa-ugc-4.jpg";
import kaniwaUgc5 from "@lystes/assets/bio/kaniwa-ugc-5.png";
import kaniwaUgc6 from "@lystes/assets/bio/kaniwa-ugc-6.jpg";

import fralene3 from "@lystes/assets/bio/fralene-3.jpg";
import fralene10 from "@lystes/assets/bio/fralene-10.jpg";
import fraleneExt1 from "@lystes/assets/bio/fralene-ext-1.jpg";
import sevmylook1 from "@lystes/assets/bio/sevmylook-1.jpg";
import sevmylook3 from "@lystes/assets/bio/sevmylook-3.jpg";
import sevmylook7 from "@lystes/assets/bio/sevmylook-7.jpg";
import sevmylook9 from "@lystes/assets/bio/sevmylook-9.jpg";
import sevmylook20 from "@lystes/assets/bio/sevmylook-20.jpg";
import pmyrris1 from "@lystes/assets/bio/pmyrris-1.jpg";
import pmyrris2 from "@lystes/assets/bio/pmyrris-2.jpg";
import pmyrris4 from "@lystes/assets/bio/pmyrris-4.jpg";
import pmyrris5 from "@lystes/assets/bio/pmyrris-5.jpg";

import cert1 from "@lystes/assets/bio/cert-1.png";
import cert2 from "@lystes/assets/bio/cert-2.png";
import cert3 from "@lystes/assets/bio/cert-3.png";
import cert4 from "@lystes/assets/bio/cert-4.png";
import cert5 from "@lystes/assets/bio/cert-5.png";
import cert6 from "@lystes/assets/bio/cert-6.png";
import cert7 from "@lystes/assets/bio/cert-7.png";
import cert8 from "@lystes/assets/bio/cert-8.png";

const certLogos = [cert1, cert2, cert3, cert4, cert5, cert6, cert7, cert8];

const homeExpVideos = [
  "/videos/exp-1.mp4", "/videos/exp-2.mov", "/videos/exp-3.mov",
  "/videos/exp-9.mp4", "/videos/exp-11.mp4", "/videos/exp-12.mp4",
  "/videos/exp-4.mov", "/videos/exp-5.mov",
  "/videos/exp-42.mov", "/videos/exp-43.mov",
  "/videos/exp-44.mp4", "/videos/exp-45.mov", "/videos/exp-46.mov",
  "/videos/exp-48.mp4",
  "/videos/exp-49.mov", "/videos/exp-50.mov", "/videos/exp-51.mov", "/videos/exp-52.mov",
];

function HomeExperienceCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true, dragFree: true, slidesToScroll: 2 });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 3000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="w-full overflow-hidden mb-16 relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {homeExpVideos.map((src, i) => (
            <div key={i} className="flex-shrink-0 w-[200px] md:w-[240px] aspect-[9/16] rounded-2xl overflow-hidden bg-black">
              <SafeVideo src={src} className="w-full h-full object-cover" lazy />
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => emblaApi?.scrollPrev()} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center shadow-xl z-10 hover:opacity-80 transition-opacity">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => emblaApi?.scrollNext()} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-foreground text-background flex items-center justify-center shadow-xl z-10 hover:opacity-80 transition-opacity">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

const CTA_URL = "https://biolystes.pro/rdv";

/* 13/10/2026 (JP) : la conversation animée de l'accueil, reprise telle quelle
   (FilConversation), pour la recherche de produits à partir du concept d'une
   marque. Seuls les messages changent.
   Produits vérifiés dans la moisson du catalogue du 13/10/2026 : titres
   français exacts, tous véganes et certifiés Ecocert COSMOS Natural (aucun
   n'est COSMOS Organic : la conversation ne dit donc pas « bio »). Les actifs
   sont écrits comme dans l'INCI de chaque fiche ; le 2 % de Bidens Pilosa
   vient de la description de la crème. Photos : les packshots nettoyés du
   même dossier que la grille du catalogue (product-images/clean), réduits
   dans public/bio-fil. Aucun prix, aucun nom de laboratoire. */
const AGENT_SELECTION = "Conseiller de sélection";
const CREATRICE = "Clémence";
const FIL_CONCEPT: MsgFil[] = [
  { side: "user", name: CREATRICE, text: "Je lance une gamme anti-âge végane pour peaux matures, esprit minimaliste. Que me proposez-vous" + NB + "?" },
  { side: "agent", name: AGENT_SELECTION, text: "Avec plaisir. Un actif que vous voulez absolument, ou un ingrédient à éviter" + NB + "?" },
  { side: "user", name: CREATRICE, text: "Une alternative douce au rétinol. Vos formules sont certifiées" + NB + "?" },
  {
    widget: "prods",
    intro: "Oui, ces trois soins véganes sont certifiés COSMOS Natural",
    produits: [
      { image: "/bio-fil/serum-anti-age-peptides.webp", nom: "Sérum anti‑âge aux peptides", ligne: "Hexapeptide‑11" },
      { image: "/bio-fil/creme-alternative-retinol.webp", nom: "Crème hydratante alternative au rétinol", ligne: "Bidens Pilosa Extract" },
      { image: "/bio-fil/creme-de-nuit-anti-age.webp", nom: "Crème de nuit anti‑âge", ligne: "Algae Extract" },
    ],
    note: "L'alternative au rétinol : Bidens Pilosa Extract, à 2 % dans la crème.",
  },
  { side: "user", name: CREATRICE, text: "J'ajoute le sérum et la crème de nuit." },
  { side: "agent", name: AGENT_SELECTION, text: "C'est noté. Je vous prépare votre sélection, avec la liste INCI de chaque soin." },
];

/* 12/10/2026 (JP) : la bannière de /bio reprend la mise en page du haut de
   l’accueil (HomeHeroVideo, en variante) avec les textes et les preuves qui
   étaient déjà sur /bio. Aucune mention d’IA ici : la partie IA se présente
   sur l’accueil, et un seul renvoi y mène plus bas. Les fins du titre sont
   les gammes réellement présentes au catalogue du laboratoire (moisson du
   10/10/2026) ; le parfum n’y figure pas, il n’est donc pas annoncé. */
const BIO_HERO = (onProjet: (projet: string) => void): HeroVariante => ({
  aria: "Lancez votre marque cosmétique bio et végane",
  classe: "lyh--bio",
  /* 13/10/2026 (JP, capture de référence) : surtitre court. */
  eyebrow: "Mise en place en 10 jours",
  /* Sans deux-points (JP, 13/10/2026). */
  titre: "Lancez votre marque\ncosmétique bio et végane",
  phrases: [
    "soins du visage",
    "soins anti-âge",
    "soins capillaires",
    "soins du corps",
    "soins solaires",
    "maquillage",
    "soins pour homme",
  ],
  /* Vidéos fournies par JP le 12/10/2026 (dossier « lystes Biolystes video »),
     réencodées pour le web. video3 en ordinateur ET en téléphone (choix de JP,
     12/10 : « garde cette vidéo pour la version mobile »). */
  fond: {
    ordi: { video: "/videos/bio/bio-hero-ordi.mp4", affiche: "/videos/bio/bio-hero-ordi.webp", position: "60% 30%" },
    mobile: { video: "/videos/bio/bio-hero-ordi.mp4", affiche: "/videos/bio/bio-hero-ordi.webp", position: "70% 20%" },
  },
  /* Fond gris clair : le voile de l’accueil ne suffit pas sous un titre
     blanc. Plus sombre à gauche, là où se trouve le texte. */
  voile: "linear-gradient(100deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,.40) 45%, rgba(0,0,0,.12) 100%)",
  voileMobile: "linear-gradient(to top, rgba(0,0,0,.72) 0%, rgba(0,0,0,.45) 50%, rgba(0,0,0,.18) 100%)",
  cta: { label: "Prendre rendez-vous", labelCourt: "Rendez-vous", href: CTA_URL, externe: true },
  /* 13/10/2026 (JP) : un champ de projet, plus une recherche de produits.
     Le texte part au conseiller de sélection, dans l’orbital du widget. */
  champ: {
    placeholder: "Décrivez votre projet…",
    placeholderCourt: "Votre projet…",
    bouton: "Recevoir ma sélection",
    boutonCourt: "Sélection",
    onSubmit: onProjet,
  },
  liens: [
    { label: "Certifié Bio & Végan", href: "#section-qualite", icone: { paths: ["M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z", "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"] } },
    { label: "Conformité COSMOS/ECOCERT/FDA", href: "#section-conformite", icone: { paths: ["M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"] } },
    { label: "Lancement Rapide", href: "#section-comprend", icone: { paths: ["M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"] } },
  ],
  texte: "Pas de stock à acheter, pas de minimum de commande. On prend tout en charge de A à Z.",
});
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
            <img key={i} src={src} alt="Cosmétique bio personnalisé Biolystes" className="w-full flex-shrink-0 object-cover aspect-square" loading="lazy" />
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

type StepKey = "decouvre" | "constat" | "experience" | "comprend" | "qualite" | "livraison" | "conformite" | "portfolio" | "catalogue" | "faq" | "lance";

const steps: { key: StepKey; label: string; subtitle: string }[] = [
  { key: "decouvre", label: "Je découvre", subtitle: "Le concept" },
  { key: "qualite", label: "La qualité", subtitle: "Nos engagements" },
  { key: "experience", label: "L’expérience", subtitle: "18 ans d’expertise" },
  { key: "comprend", label: "Je comprends", subtitle: "La mise en place" },
  { key: "livraison", label: "La livraison", subtitle: "Comment ça marche" },
  { key: "conformite", label: "La conformité", subtitle: "Réglementaire" },
  { key: "portfolio", label: "Nos clients", subtitle: "Portfolio" },
  { key: "catalogue", label: "Catalogue", subtitle: "Nos produits" },
  { key: "constat", label: "Le constat", subtitle: "Pourquoi Biolystes" },
  { key: "faq", label: "Questions", subtitle: "Questions fréquentes" },
  { key: "lance", label: "Je me lance", subtitle: "Passez à l’action" },
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
    photos: [{ type: "video" as const, src: "/videos/fralene-hero-2.mov" }, fralene3, fraleneExt1, fralene10],
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
    <div className="fixed left-0 right-0 z-20 bg-background/90 backdrop-blur-md border-b border-border" style={{ top: "56px" }}>
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


/* Les étapes d’une commande. Chaque phrase reprend un texte de la section
   « La livraison » : rien n’est ajouté. */
const ETAPES_LIVRAISON = [
  { icon: ShoppingBag, label: "Commande client", texte: "Votre client passe commande sur votre boutique en ligne." },
  { icon: FlaskConical, label: "Fabrication", texte: "Le laboratoire fabrique le produit à la demande, sous votre nom." },
  { icon: Package, label: "Emballage", texte: "Le produit part avec votre packaging, sous votre nom de marque." },
  { icon: Truck, label: "Expédition", texte: "Le colis est expédié directement chez votre client." },
  { icon: Check, label: "Livré", texte: "En 6 à 7 jours en mode standard, en 24 à 48 heures en mode express." },
];

function EtapesLivraison() {
  const piste = useRef<HTMLDivElement>(null);
  const [courante, setCourante] = useState(0);
  const suivre = () => {
    const el = piste.current;
    if (!el) return;
    const carte = el.firstElementChild as HTMLElement | null;
    const pas = carte ? carte.offsetWidth + 12 : el.clientWidth;
    setCourante(Math.min(ETAPES_LIVRAISON.length - 1, Math.round(el.scrollLeft / pas)));
  };
  return (
    <div className="mt-16">
      {/* Ordinateur : la frise, ronds alignés sur une même ligne. */}
      <div className="hidden md:grid grid-cols-5 gap-4">
        {ETAPES_LIVRAISON.map((item) => (
          <div key={item.label} className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
              <item.icon className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-semibold text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
      {/* Téléphone : une étape par carte, défilement au doigt, la suivante
          dépasse pour qu’on devine la suite. Pas de lecture automatique. */}
      <div className="md:hidden">
        <div
          ref={piste}
          onScroll={suivre}
          className="-mx-4 px-4 scroll-px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {ETAPES_LIVRAISON.map((item, i) => (
            <div key={item.label} className="snap-start shrink-0 w-[78%] rounded-2xl bg-background p-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 shrink-0 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
                  <item.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">Étape {i + 1}</p>
                  <h3 className="text-base font-semibold text-foreground">{item.label}</h3>
                </div>
              </div>
              <p className="mt-3 text-sm text-foreground leading-relaxed text-pretty">{item.texte}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
          {courante + 1} / {ETAPES_LIVRAISON.length}
        </p>
      </div>
    </div>
  );
}

export default function DecouvertePage() {
  /* Aucun mot seul en fin de ligne, nulle part sur la page (JP). */
  useSansMotSeul();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<StepKey>("decouvre");
  const [catalogProducts, setCatalogProducts] = useState<{ id: number; name: string; image: string }[]>([]);
  const sectionRefs = useRef<Record<StepKey, HTMLElement | null>>({
    decouvre: null, constat: null, experience: null, comprend: null, qualite: null, livraison: null, conformite: null, portfolio: null, catalogue: null, faq: null, lance: null,
  });

  // Fallback catalog products (used when WooCommerce API is blocked by CORS)
  const fallbackProducts = [
    { id: 1, name: "Crème de nuit peaux sensibles", image: "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/cremedenuitpourpeauxsensiblessansparfum.png" },
    { id: 2, name: "Sérum contour des yeux", image: "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/serumcontourdesyeuxalternatifauretinol.png" },
    { id: 3, name: "Tonique exfoliant acide glycolique", image: "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/toniqueexfoliantalacideglycolique.png" },
    { id: 4, name: "Sérum perfecteur de pigment", image: "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/serumperfecteurdepigment.png" },
    { id: 5, name: "Crème de jour hydratante", image: "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/cremedejourhydratante.jpeg" },
    { id: 6, name: "Huile visage nourrissante", image: "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/huilevisagenourrissante.png" },
    { id: 7, name: "Sérum naturel alternatif au rétinol", image: "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/serumnaturelabasedhuilealternatifauretinol.png" },
    { id: 8, name: "Gel booster au ginkgo antioxydant", image: "https://nftpssrtcbwputfwjdfi.supabase.co/storage/v1/object/public/product-images/clean/gelboosterauginkgoantioxydant.jpeg" },
  ];

  // Catalogue statique : pas d’appel à la boutique avec des clés en dur.
  useEffect(() => {
    setCatalogProducts(fallbackProducts);
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

  const [recherche, setRecherche] = useState("");
  /* Le champ de projet de la bannière ouvre l’orbital du widget Lystes avec
     le texte du visiteur comme premier message (conseiller de sélection),
     là où le widget est chargé : biolystes.com, widget 3.65.0 et plus
     (`LystesWidget.open`). Sur lystes.ai/bio, aucun widget ni chat : le
     visiteur descend vers les gammes du catalogue, comme avant. */
  const heroVariante = BIO_HERO((projet) => {
    const widget = (window as unknown as { LystesWidget?: { open?: (o: { message: string }) => boolean } }).LystesWidget;
    if (typeof widget?.open === "function" && widget.open({ message: projet })) return;
    document.getElementById("section-catalogue")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  return (
    <div className="bio-scope min-h-screen bg-background overflow-x-hidden">
      {/* En-tête de l’accueil, transparent sur la vidéo (JP, 12/10/2026),
          sans le bandeau vert « Démo ». Il lit « / » pour prendre la même
          forme que sur l’accueil. */}
      <CommeSurAccueil>
        <Header overlay />
      </CommeSurAccueil>

      {/* ═══ 1. JE DÉCOUVRE ═══ */}
      <section id="section-decouvre" ref={setRef("decouvre")} className="pb-0">
        <HomeHeroVideo variante={heroVariante} />
        <div className="max-w-4xl mx-auto px-6 text-center pt-8">
        {/* Certifications carousel */}
        <div className="overflow-hidden py-4 mt-2">
          <motion.div
            className="flex gap-12 items-center"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ width: "max-content" }}
          >
            {[...certLogos, ...certLogos].map((logo, i) => (
              <img key={i} src={logo} alt="Logo de certification cosmétique bio et végane" className="w-auto object-contain" style={{ maxHeight: 80, filter: "brightness(0)" }} />
            ))}
          </motion.div>
        </div>

        </div>


      </section>

      {/* ═══ PORTFOLIO IMAGES MARQUEE ═══ */}
      {/* Version de JP (12/10/2026) : la bande n’est plus pleine largeur, elle
          suit le conteneur max-w-4xl, avec ces six photos. */}
      <section className="overflow-hidden py-3 bg-background">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-3 px-3" style={{ overflowX: "auto", scrollbarWidth: "none" }}>
            {[
              kaniwa1, pmyrris1, sevmylook1, fralene10, sevmylook3, pmyrris4,
            ].map((src, i) => (
              <div key={i} className="shrink-0 w-[200px] md:w-[260px] aspect-[3/4] rounded-2xl overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 3. LA QUALITÉ : NOS ENGAGEMENTS ═══ */}
      <section id="section-qualite" ref={setRef("qualite")} className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16 text-center">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">Nos engagements</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground leading-relaxed text-balance">
              <b>Sans achat de stock</b>, des cosmétiques d’excellence, certifiés et responsables
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-foreground max-w-xl mx-auto leading-relaxed">
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
                <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-foreground text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* ═══ PRÉSENTATION PRODUITS (INSTA FEED) ═══ */}
          <div className="mt-8 mb-8">
            <InstaFeedSection />
          </div>

          {/* ═══ FORMULATION PROPRE ═══ */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="mt-20 text-center">
            <motion.p variants={fadeUp} custom={0} className="text-[10px] font-bold tracking-[0.35em] uppercase text-muted-foreground">
              Formulation propre
            </motion.p>
            <motion.h3 variants={fadeUp} custom={1} className="mt-4 text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground leading-relaxed">
              Pourquoi c’est sans risque pour votre <span className="text-muted-foreground">santé</span>
            </motion.h3>
            <motion.p variants={fadeUp} custom={2} className="mt-4 max-w-md mx-auto text-sm text-muted-foreground leading-relaxed">
              Une liste rigoureuse d’ingrédients que nous n’utilisons jamais, pour préserver les peaux les plus fragiles.
            </motion.p>
          </motion.div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              "Parabènes", "Silicones", "Filtres UV chimiques", "Microplastiques",
              "Colorants artificiels", "Phosphates", "Conservateurs", "Gluten",
            ].map((item, i) => (
              <motion.div key={item} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-secondary rounded-2xl px-3 py-5 flex flex-col items-center text-center">
                <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
                  <X className="h-3 w-3 text-background" strokeWidth={3} />
                </div>
                <p className="mt-3 text-[9px] font-semibold tracking-[0.18em] uppercase text-muted-foreground">Sans</p>
                <p className="mt-1 text-[10px] font-semibold tracking-[0.06em] uppercase text-foreground leading-snug">{item}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="mt-12 text-center">
            <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-muted-foreground">Ce que nous garantissons</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["Ingrédients d’origine naturelle", "Parfums véganes", "Production à la demande", "Traçabilité complète", "Laboratoires certifiés", "Échantillons disponibles", "Aucun minimum de commande", "Expédition sous votre marque", "Végétalien", "Certifié naturel"].map(item => (
                <span key={item} className="bg-secondary rounded-full px-4 py-2 text-[11px] text-foreground inline-flex items-center gap-1.5">
                  <Check className="h-3 w-3 shrink-0" strokeWidth={2.5} />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

      </section>

      {/* ═══ 18 ANS D’EXPÉRIENCE ═══ */}
      <section id="section-experience" ref={setRef("experience")} className="py-12 md:py-16 bg-background">
        {/* Video carousel with arrows */}
        <HomeExperienceCarousel />

        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground leading-relaxed text-balance">
            18 ans d’expérience dans le secteur de la beauté ont donné naissance à Biolystes
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="mt-6 text-base md:text-lg text-foreground max-w-2xl mx-auto leading-relaxed">
            Nous avons éliminé les obstacles pour vous permettre de vous concentrer sur l’essentiel : bâtir une marque qui vous ressemble.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="mt-10 flex flex-wrap justify-center gap-4">
            {/* biolystes.com : un seul appel à l'action, le rendez-vous. */}
            <a href="https://biolystes.pro/rdv" target="_blank" rel="noopener noreferrer" className="btn-startup">
              <span>Prendre rendez-vous</span>
              <span className="arrow-circle">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </motion.div>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
          className="max-w-5xl mx-auto px-6 mt-20 grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            { num: "1", title: "Profitez de 18 ans d’expérience en e-commerce", desc: "Nous vous accompagnons avec un savoir-faire éprouvé dans le e-commerce et la cosmétique naturelle." },
            { num: "2", title: "Offrez-vous des services 360° premium", desc: "Identité visuelle, packagings et boutique en ligne conçus pour valoriser votre marque dès le départ." },
            { num: "3", title: "Profitez de notre réseau pour vous développer", desc: "Accédez à nos partenaires experts pour accélérer votre croissance sans multiplier les prestataires." },
          ].map((item) => (
            <div key={item.num} className="px-8 py-10 md:py-8">
              <span className="text-4xl text-foreground" style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 100 }}>{item.num}</span>
              <h3 className="text-base font-black uppercase tracking-wide text-foreground mt-3 mb-3 text-balance">{item.title}</h3>
              <p className="text-sm text-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>

      </section>

      {/* ═══ 4. JE COMPRENDS : LES ÉTAPES DE CRÉATION DE MARQUE ═══
          13/10/2026 (JP) : remplace « Comment ça marche ». Le gabarit des
          étages de l’accueil (VisionEtages), seul le contenu change
          (vision/etapesBio.ts). */}
      <section id="section-comprend" ref={setRef("comprend")} className="pt-12 md:pt-16 bg-background px-4 sm:px-6 lg:px-0">
        <VisionEtagesBloc secteur="bio" />
      </section>

      {/* ═══ 5. LA LIVRAISON ═══ */}
      <section id="section-livraison" ref={setRef("livraison")} className="bg-secondary py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">La livraison</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl text-foreground leading-relaxed text-balance">
              Comment fonctionne l’expédition de vos commandes ?
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
                  <p className="text-xs text-foreground">Livraison en 6-7 jours</p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-foreground leading-relaxed">
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
                  <p className="text-xs text-foreground">Livraison en 24-48h</p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-foreground leading-relaxed">
                <p>Achetez uniquement le stock nécessaire, sans minimum de quantité ni MOQ, et placez-le chez notre logisticien.</p>
                <p>Réapprovisionnement en une semaine, au rythme de vos ventes : commandez juste ce qu’il faut, sans risque de surstock.</p>
                <p>Vos clients reçoivent leur commande <strong className="text-foreground">en 24 à 48 heures,</strong> expédiée directement par le logisticien.</p>
              </div>
            </motion.div>
          </div>

          {/* Les cinq étapes : frise sur ordinateur, carrousel sur téléphone
              (JP, 12/10/2026 : « tu fais un carrousel »). */}
          <EtapesLivraison />

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            className="mt-12 p-6 rounded-xl bg-background border border-border text-center">
            <Shield className="h-5 w-5 text-foreground mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Chaque commande est expédiée <strong className="text-foreground">sous votre nom de marque</strong>. Votre client ne voit que votre marque, de l’emballage au bon de livraison.
            </p>
          </motion.div>
        </div>
      </section>


      {/* ═══ 6. LA CONFORMITÉ ═══
          12/10/2026 : les blocs IA (équipes, avant/après) qui partageaient
          cette section sont retirés ; la partie IA se présente sur l’accueil.
          Reste le bloc conformité, qui est le sujet de la marque blanche. */}
      <section id="section-conformite" ref={setRef("conformite")} className="max-w-5xl mx-auto bg-background mt-8 px-6 md:px-16 pb-10 md:pb-14">
        <ResponsabiliteSection />
      </section>


      {/* ═══ 7. PORTFOLIO : NOS CLIENTS ═══ */}
      <section id="section-portfolio" ref={setRef("portfolio")} className="hidden py-6 md:py-8" aria-hidden="true">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-8">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">Portfolio</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl text-foreground leading-relaxed text-balance">
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

      {/* ═══ 8. CATALOGUE ═══ */}
      <section id="section-catalogue" ref={setRef("catalogue")} className="bg-secondary py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">Catalogue</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl text-foreground leading-relaxed text-balance">
              Des formulations d’excellence, prêtes à vendre.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-foreground max-w-xl leading-relaxed">
              Plus de 100 produits certifiés bio et végan, disponibles sans minimum de commande.
            </motion.p>
          </motion.div>

          {/* 13/10/2026 (JP) : la conversation animée de l'accueil, ici pour
              la recherche de produits selon le concept de la marque. Photo de
              fond présente nulle part ailleurs à l'écran sur /bio (le
              portfolio qui la contient est masqué). Même largeur que la
              grille du catalogue, juste en dessous. */}
          <div className="bio-fil relative mb-16 overflow-hidden rounded-2xl bg-muted h-[520px] md:h-[560px]">
            <img src={kaniwaUgc4} alt="Créatrice de marque cosmétique tenant son flacon" className="absolute inset-0 h-full w-full object-cover object-[30%_30%]" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-l from-black/55 via-black/20 to-transparent" />
            <FilConversation messages={FIL_CONCEPT} agent={AGENT_SELECTION} className="lyh-chat--cadre" />
          </div>

          {catalogProducts.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {catalogProducts.slice(0, 8).map((p, i) => (
                <motion.div key={p.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                  className="group bg-foreground/[0.04] p-[13px] rounded-[13px] m-[1px]">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-3 bg-muted">
                    {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
                  </div>
                  <p className="text-[9px] font-medium text-foreground text-center truncate">{p.name}</p>
                </motion.div>
              ))}
            </div>
          )}

          <BioGammes recherche={recherche} onRecherche={setRecherche} />

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mt-12 text-center flex flex-wrap justify-center gap-4">
            <a href="https://biolystes.pro/rdv" target="_blank" rel="noopener noreferrer" className="btn-startup">
              <span>Prendre rendez-vous</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </a>
          </motion.div>
        </div>
      </section>



      {/* ═══ RÉASSORT SANS MINIMUM ═══ */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground leading-relaxed text-balance"
              style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
              Réassort Sans Minimum<br />
              Vous êtes un institut ? un centre médical ? un salon de coiffure ?
            </h2>
            <p className="text-foreground mt-4 max-w-xl mx-auto leading-relaxed text-sm">
              Pas besoin de minimum de stock pour vos points de vente physiques. Commandez 1, 10 ou 1000 produits selon vos besoins réels. Livré dans votre établissement en moins de 15 jours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
            {[
              { icon: MousePointerClick, title: "Commande automatisée", desc: "Vous passez vos commandes via notre plateforme avec votre branding." },
              { icon: PackagePlus, title: "Fabrication Rapide", desc: "Le laboratoire fabrique le produit commandé 72h, avec votre branding." },
              { icon: SendHorizontal, title: "Livraison Directe", desc: "Le logisticien récupère votre colis au laboratoire et l’expédie dans votre établissement." },
            ].map((item) => (
              <div key={item.title} className="text-center bg-foreground/[0.02] p-[34px] rounded-[33px]">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-background rounded-full mb-3">
                  <item.icon className="w-4 h-4 text-foreground" strokeWidth={1} />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1 uppercase tracking-wide md:tracking-normal lg:tracking-wide">{item.title}</h3>
                <p className="text-foreground text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="relative max-w-[944px] mx-auto">
            <div className="bg-secondary rounded-xl p-6 md:p-10">
              <img src={salonCoiffure} alt="Salon de coiffure équipé de cosmétiques en marque blanche" className="w-full rounded-lg" loading="lazy" />
            </div>
            <div className="hidden md:block absolute -left-16 bottom-20 max-w-[220px] shadow-lg rounded-xl overflow-hidden rotate-[-3deg] p-3" style={{ backgroundColor: '#2f5955' }}>
              <SafeVideo
                src="/videos/salon-235th.mp4"
                className="w-full rounded-xl object-cover aspect-[3/4]"
                lazy
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
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">Le constat</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl font-light tracking-tight max-w-3xl mx-auto text-foreground leading-relaxed text-balance">
              Nous avons créé Biolystes car de nombreuses personnes échouent en raison de choix inadaptés lors du lancement de leur marque cosmétique bio et végane.
            </motion.h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                icon: Warehouse,
                title: "Le stock",
                desc: "La majorité des créateurs investissent jusqu’à 90 % de leur budget dans l’achat de stock. Une fois la marque lancée, il ne reste plus rien pour se faire connaître. Sans visibilité, pas de ventes. Le stock dort, la trésorerie fond, et le projet s’arrête.",
              },
              {
                icon: FlaskConical,
                title: "La fabrication",
                desc: "Trouver la bonne formule, le bon dosage, le bon équilibre. Certains de nos clients avaient passé huit mois, un an, parfois des années en allers-retours avec des laboratoires, sans jamais réussir à finaliser un seul produit.",
              },
              {
                icon: Users,
                title: "La chaîne de prestataires",
                desc: "Il ne suffit pas de trouver un bon laboratoire. Il faut aussi le bon designer, le bon photographe, le bon développeur. Si un seul maillon est faible, c’est toute votre image de marque qui en souffre.",
              },
              {
                icon: Timer,
                title: "La procrastination",
                desc: "Des projets qui restent à l’état d’idée pendant des mois, parce que la complexité du parcours pousse à toujours remettre à demain.",
              },
              {
                icon: Award,
                title: "Les certifications",
                desc: "COSMOS, ECOCERT, FDA, CPNP, ISO 22716, packaging recyclable, sans parabènes, sans silicones, sans microplastiques. Cocher toutes ces cases par vous-même, ça prend des années.",
              },
              {
                icon: Eye,
                title: "Le manque de recul",
                desc: "Chaque nouvelle formulation demande du temps pour être affinée. C’est un investissement en temps que la plupart des créateurs n’ont tout simplement pas.",
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
                    <p className="text-sm text-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mt-16 p-8 md:p-12 rounded-2xl bg-foreground text-center text-white">
            <AlertTriangle className="h-6 w-6 mx-auto mb-4 opacity-70" strokeWidth={1.5} />
            <p className="text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
              Huit chances sur dix de tomber dans un de ces cas de figure. C’est ce constat qui a donné naissance à Biolystes. Nous avons éliminé chacun de ces obstacles, un par un, pour que vous puissiez vous concentrer sur l’essentiel : <span className="font-semibold">vendre et développer votre marque.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* « Et après le lancement » retiré (JP, 13/10/2026) : l’onglet
          Communication des étapes de création le couvre. */}

      {/* ═══ LES BLOCS DE L’ACCUEIL, EN COSMÉTIQUE (JP, 12/10/2026) ═══ */}
      <BlocsAccueilSecteur secteur="cosmetique" />

      {/* ═══ QUESTIONS FRÉQUENTES ═══ */}
      <section id="section-faq" ref={setRef("faq")} className="py-12 md:py-16 bg-background">
        <BioFaq />
      </section>

      {/* ═══ 10. JE ME LANCE ═══ */}
      <section id="section-lance" ref={setRef("lance")} className="bg-secondary py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-6">
            <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">Passez à l’action</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground leading-relaxed text-balance">
              Prêt à lancer votre marque ?
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-foreground max-w-xl mx-auto leading-relaxed">
              Explorez notre catalogue de formulations certifiées, puis prenez rendez-vous avec un expert pour composer votre gamme.
            </motion.p>
          </motion.div>




          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
            className="mt-16 flex flex-wrap justify-center gap-4">
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="btn-startup">
              <span>Prendre rendez-vous</span>
              <span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ PIED DE PAGE ═══ : celui de l’accueil (JP, 12/10/2026). */}
      <Footer />
    </div>
  );
}
