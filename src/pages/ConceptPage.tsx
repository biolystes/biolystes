import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, X, FlaskConical, Truck, Globe, ScanFace, MessageCircle, QrCode, Camera, BarChart3, ExternalLink, ShoppingBag, HelpCircle, Star, StarHalf, Menu, Search, User, Mic, ArrowUp, ChevronLeft, ChevronRight, FileCheck2, BadgeCheck, Leaf, Award, Rabbit, Package, CheckCircle2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import CommentCaMarche from "@/components/CommentCaMarche";

// Brand images
import kaniwa1 from "@/assets/kaniwa-1.jpg";
import kaniwa2 from "@/assets/kaniwa-2.jpg";
import kaniwa3 from "@/assets/kaniwa-3.jpg";
import kaniwa5 from "@/assets/kaniwa-5.jpg";
import fralene1 from "@/assets/fralene-1.jpg";
import fralene2 from "@/assets/fralene-2.jpg";
import fralene3 from "@/assets/fralene-3.jpg";
import fralene5 from "@/assets/fralene-5.jpg";
import sevmylook1 from "@/assets/sevmylook-1.jpg";
import sevmylook3 from "@/assets/sevmylook-3.jpg";
import sevmylook5 from "@/assets/sevmylook-5.jpg";
import sevmylook7 from "@/assets/sevmylook-7.jpg";
import pmyrris1 from "@/assets/pmyrris-1.jpg";
import pmyrris2 from "@/assets/pmyrris-2.jpg";
import pmyrris4 from "@/assets/pmyrris-4.jpg";
import pmyrris6 from "@/assets/pmyrris-6.jpg";
import cert1 from "@/assets/cert-1.png";
import cert2 from "@/assets/cert-2.png";
import cert3 from "@/assets/cert-3.png";
import cert4 from "@/assets/cert-4.png";
import cert5 from "@/assets/cert-5.png";
import cert6 from "@/assets/cert-6.png";
import cert7 from "@/assets/cert-7.png";
import cert8 from "@/assets/cert-8.png";

const certLogos = [cert1, cert2, cert3, cert4, cert5, cert6, cert7, cert8];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const CTA_URL = "https://app.iclosed.io/e/paylystes/r2";
const CATALOG_URL = "/catalog";
const CONTACT_URL = "https://app.iclosed.io/e/paylystes/r2";

// WooCommerce config for catalog preview
const WC_BASE = "https://biolystes.com/wp-json/wc/v3";
const CK = "ck_375b1fedd12fc4161c16f06a8358f4d362711239";
const CS = "cs_56ece5ac68b7c2c8ffafecbddb449504bac26657";

const brands = [
  { name: "Kaniwa Botanique", url: "https://kaniwabotanique.com" },
  { name: "Fralène Paris", url: "https://fraleneparis.com" },
  { name: "Sev My Look", url: "https://sevmylook.com" },
  { name: "P'Myrris Beauty", url: "https://pmyrrisbeauty.com" },
];

const obstacles = [
  {
    title: "Le stock",
    text: "La majorité des créateurs investissent jusqu'à 90 % de leur budget dans l'achat de stock. Une fois la marque lancée, il ne reste plus rien pour se faire connaître. Sans visibilité, pas de ventes. Le stock dort, la trésorerie fond, et le projet s'arrête.",
  },
  {
    title: "La fabrication",
    text: "Trouver la bonne formule, le bon dosage, le bon équilibre. Certains de nos clients avaient passé huit mois, un an, parfois des années en allers-retours avec des laboratoires, sans jamais réussir à finaliser un seul produit.",
  },
  {
    title: "La chaîne de prestataires",
    text: "Il ne suffit pas de trouver un bon laboratoire. Il faut aussi le bon designer, le bon photographe, le bon développeur. Si un seul maillon est faible, c'est toute votre image de marque qui en souffre.",
  },
  {
    title: "La procrastination",
    text: "Des projets qui restent à l'état d'idée pendant des mois, parce que la complexité du parcours pousse à toujours remettre à demain.",
  },
  {
    title: "Les certifications",
    text: "COSMOS, ECOCERT, FDA, CPNP, ISO 22716, packaging recyclable, sans parabènes, sans silicones, sans microplastiques. Cocher toutes ces cases par vous-même, ça prend des années.",
  },
  {
    title: "Le manque de recul",
    text: "Chaque nouvelle formulation demande du temps pour être affinée. C'est un investissement en temps que la plupart des créateurs n'ont tout simplement pas.",
  },
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

const eliminates = [
  "Chercher des laboratoires fiables",
  "Investir dans du stock",
  "Gérer les expéditions et la logistique",
  "Créer un site e-commerce",
  "Payer un designer pour le packaging",
  "Organiser des shootings photo",
];

const provides = [
  "Meilleurs laboratoires européens, certifiés Bio, Végan, COSMOS, ECOCERT, FDA",
  "Packaging 100 % recyclable",
  "Zéro stock, pas de minimum de commande",
  "Livraison directe au client final",
  "Site e-commerce inclus dans les packs avec site",
  "Création de logo et packaging inclus",
  "Photos générées par IA, hyperréalistes",
  "Lancement rapide en 15 jours",
];

/* ── Pricing data ── */

const packDecouverte = [
  {
    name: "Sans Branding",
    price: "147 €",
    installment: "ou 3x 49 €",
    features: [
      "4 produits : sérum, crème, nettoyant, soin spécifique",
      "Accompagnement personnalisé par nos experts",
      "Certifié Bio et Végan / COSMOS / ECOCERT / FDA",
      "Livraison incluse sous 7 à 8 jours",
      "Produit supplémentaire : 29 €/unité",
    ],
  },
  {
    name: "Avec Branding",
    price: "237 €",
    installment: "ou 3x 79 €",
    popular: true,
    features: [
      "Tout du pack Sans Branding",
      "Packaging personnalisé à votre marque (logo, nom, couleurs)",
      "Brandboard complet",
      "3 aller-retours avec nos designers",
      "Produit supplémentaire : 49 €/unité",
    ],
  },
];

const offresSansSite = [
  {
    name: "Sans Design",
    price: "39 €/mois",
    setup: "",
    features: [
      "Accès catalogue complet sans minimum de stock",
      "Jusqu'à 4 références produits",
      "Étiquetage standard conforme inclus",
      "Produits certifiés bio, végan, COSMOS, Ecocert",
      "Produits facturés à l'unité (10-20 € selon la réf.)",
      "Sans engagement, résiliable à tout moment",
    ],
  },
  {
    name: "Avec Design",
    price: "39 €/mois",
    setup: "+ 99 € de mise en place",
    popular: true,
    features: [
      "Tout de la formule Sans Design",
      "Création de logo",
      "Design packaging des 4 produits",
      "Brandboard complet",
      "3 aller-retours avec nos designers",
      "Fichiers livrés, ils sont à vous",
    ],
  },
];

const offresAvecSite = [
  {
    name: "Pack Agence",
    price: "1 499 €",
    installment: "ou 750 € en 2x",
    sub: "Abonnement Pro obligatoire 99 €/mois",
    popular: true,
    features: [
      "Création de logo + Design Packaging",
      "Contenu textuel clé en main",
      "Photographie IA hyperréaliste",
      "Site e-commerce",
      "Indexation Google + SEO avancée",
      "Automatisation livraison",
      "Support premium",
      "Expert produit dédié en votre nom",
      "Achat de stock pas nécessaire",
      "CRO standard",
    ],
  },
  {
    name: "Pack IA",
    price: "2 999 €",
    installment: "ou 1 500 € en 2x",
    sub: "Abonnement Pro obligatoire 99 €/mois",
    features: [
      "Tout du Pack Agence",
      "UGC IA Ultraréaliste",
      "Expert produit dédié",
      "Diagnostic intelligent par IA",
      "Recommandations produits par IA",
      "Gestion réseaux sociaux 1 mois",
    ],
  },
];

const abonnements = [
  {
    name: "Abonnement Pro",
    price: "99 €/mois",
    note: "1er mois offert avec un pack",
    features: [
      "Gestion e-commerce complète",
      "Support dédié",
      "Hébergement, SSL, sauvegardes",
      "SEO + nom de domaine + email pro",
      "Gestion des livraisons",
      "Chat IA intégré + diagnostic IA + recommandations produits",
      "Paiement en plusieurs fois pour le client final",
    ],
  },
  {
    name: "Abonnement IA",
    price: "99 €/mois",
    note: "Sans engagement",
    features: [
      "Tout du Pro",
      "Photos UGC, lifestyle et studio professionnelles",
      "Minimum 6 photos",
      "Retouches 2 allers-retours",
    ],
  },
  {
    name: "Marketing + CRO",
    price: "699 €/mois",
    features: [
      "Publicités Meta et TikTok Ads",
      "Media Buying stratégique",
      "CRO, A/B testing, SEO",
      "Rapports détaillés et ROI",
      "Conseil stratégique mensuel",
    ],
  },
  {
    name: "Community Manager",
    price: "699 €/mois",
    features: [
      "Gestion Instagram, Facebook, TikTok, Pinterest",
      "Calendrier éditorial + création de contenu",
      "Modération et engagement",
      "Rapports mensuels",
    ],
  },
];

/* ── Pricing Card Component ── */
function PricingCard({ name, price, installment, setup, sub, note, features, popular }: {
  name: string; price: string; installment?: string; setup?: string; sub?: string; note?: string; features: string[]; popular?: boolean;
}) {
  return (
    <div className={`relative p-6 md:p-8 rounded-2xl h-full flex flex-col ${popular ? "bg-foreground text-primary-foreground ring-2 ring-foreground" : "bg-background border border-border"}`}>
      {popular && (
        <span className="absolute -top-3 left-6 px-3 py-1 text-[11px] tracking-[0.15em] uppercase font-semibold bg-primary-foreground text-foreground rounded-full">
          Populaire
        </span>
      )}
      <p className={`text-sm font-semibold ${popular ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{name}</p>
      <p className={`text-2xl md:text-3xl font-light mt-2 tracking-tight ${popular ? "text-primary-foreground" : "text-foreground"}`}>{price}</p>
      {installment && <p className={`text-sm mt-1 ${popular ? "text-primary-foreground/50" : "text-muted-foreground"}`}>{installment}</p>}
      {setup && <p className={`text-sm mt-1 ${popular ? "text-primary-foreground/50" : "text-muted-foreground"}`}>{setup}</p>}
      {sub && <p className={`text-xs mt-2 font-medium ${popular ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{sub}</p>}
      {note && <p className={`text-xs mt-2 font-medium ${popular ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{note}</p>}
      <div className="mt-6 space-y-3 flex-1">
        {features.map((f) => (
          <div key={f} className="flex items-start gap-3">
            <Check className={`h-4 w-4 mt-0.5 shrink-0 ${popular ? "text-primary-foreground/70" : "text-foreground"}`} />
            <p className={`text-sm leading-relaxed ${popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{f}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4">
        <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="block">
          <button className={`w-full py-3 rounded-full text-sm font-medium transition-colors ${popular ? "bg-primary-foreground text-foreground hover:bg-primary-foreground/90" : "bg-foreground text-primary-foreground hover:bg-foreground/90"}`}>
            Prendre rendez-vous
          </button>
        </a>
      </div>
    </div>
  );
}

/* ── Section heading ── */
function SectionLabel({ label, title, subtitle, dark }: { label: string; title: string; subtitle?: string; dark?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="space-y-4"
    >
      <motion.p variants={fadeUp} custom={0} className={`text-xs tracking-[0.3em] uppercase ${dark ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
        {label}
      </motion.p>
      <motion.h2 variants={fadeUp} custom={1} className={`text-3xl md:text-4xl font-light tracking-tight max-w-3xl ${dark ? "text-primary-foreground" : "text-foreground"}`}>
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={fadeUp} custom={2} className={`max-w-2xl leading-relaxed ${dark ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ── Catalog Preview ── */
function CatalogPreview({ navigate }: { navigate: (path: string) => void }) {
  const [products, setProducts] = useState<{ id: number; name: string; price: string; image: string }[]>([]);

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
        setProducts(data.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.images?.[0]?.src || "",
        })));
      })
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <SectionLabel label="Catalogue" title="Des formulations d'excellence, prêtes à vendre."
        subtitle="Plus de 50 produits certifiés bio et végan, disponibles sans minimum de commande." />
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.slice(0, 8).map((p, i) => (
          <motion.div key={p.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
            className="group cursor-pointer" onClick={() => navigate("/catalog")}>
            <div className="aspect-square rounded-2xl overflow-hidden mb-3" style={{ background: "linear-gradient(160deg, #e8eef5 0%, #dce6f0 100%)" }}>
              {p.image && <img src={p.image} alt={p.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" loading="lazy" />}
            </div>
            <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{p.price} EUR HT</p>
          </motion.div>
        ))}
      </div>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={8} className="mt-12 text-center flex flex-wrap justify-center gap-4">
        <Button className="rounded-full px-8 h-12 text-sm" onClick={() => navigate("/catalog")}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Voir tout le catalogue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button variant="outline" className="rounded-full px-8 h-12 text-sm" onClick={() => navigate("/configurateur")}>
          <MessageCircle className="mr-2 h-4 w-4" />
          Poser une question sur les produits
        </Button>
      </motion.div>
    </section>
  );
}

/* ── Animated Chat Widget (full conversation) ── */
function AnimatedChat() {
  const [visibleMsgs, setVisibleMsgs] = useState<string[]>(["msg-1"]);
  const [showTyping, setShowTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [inputText, setInputText] = useState("Posez votre question sur ce produit ...");
  const [isTypingInput, setIsTypingInput] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => containerRef.current?.scrollTo({ top: containerRef.current?.scrollHeight ?? 0, behavior: "smooth" }), 50);
  }, []);

  const showMsg = useCallback((id: string) => {
    setVisibleMsgs(prev => [...prev, id]);
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    if (!isVisible) return;
    let cancelled = false;
    const d = (ms: number) => new Promise<void>(r => { const t = setTimeout(() => { if (!cancelled) r(); }, ms); });

    const typeAndSend = async (text: string, msgId: string) => {
      setIsTypingInput(true); setInputText("");
      for (let i = 0; i < text.length; i++) {
        if (cancelled) return;
        setInputText(text.slice(0, i + 1));
        await new Promise(r => setTimeout(r, 20));
      }
      await d(400); if (cancelled) return;
      setIsTypingInput(false); setInputText("Posez votre question sur ce produit ...");
      setShowSuggestions(false); showMsg(msgId);
    };

    (async () => {
      try {
        await d(800); if (cancelled) return;
        await typeAndSend("Bonjour, j'aimerais savoir si cette crème est adaptée au peau mixte et métisse ?", "msg-2");
        await d(500); if (cancelled) return;
        setShowTyping(true); scrollToBottom(); await d(2000); if (cancelled) return;
        setShowTyping(false); showMsg("msg-3"); await d(2500); if (cancelled) return;
        await typeAndSend("C'est impressionnant ! Avez-vous des avis de clientes qui l'ont testée ?", "msg-3b");
        await d(600); if (cancelled) return;
        setShowTyping(true); scrollToBottom(); await d(1500); if (cancelled) return;
        setShowTyping(false); showMsg("msg-3c"); await d(2500); if (cancelled) return;
        await typeAndSend("Top ! Et avez-vous d'autres produits pour ma routine ?", "msg-4");
        await d(600); if (cancelled) return;
        setShowTyping(true); scrollToBottom(); await d(1800); if (cancelled) return;
        setShowTyping(false); showMsg("msg-5"); await d(2000); if (cancelled) return;
        await typeAndSend("Merci :)", "msg-6");
        await d(500); if (cancelled) return;
        setShowTyping(true); scrollToBottom(); await d(1500); if (cancelled) return;
        setShowTyping(false); showMsg("msg-7");
        await d(6000); if (cancelled) return;
        setVisibleMsgs(["msg-1"]); setShowSuggestions(true); setShowTyping(false); setAnimKey(k => k + 1);
      } catch { /* */ }
    })();
    return () => { cancelled = true; };
  }, [isVisible, animKey, showMsg, scrollToBottom]);

  const isShown = (id: string) => visibleMsgs.includes(id);
  const pop = { initial: { opacity: 0, y: 10, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275] } };

  return (
    <motion.div className="mb-6 bg-background border border-border rounded-[20px] overflow-hidden shadow-sm flex flex-col"
      onViewportEnter={() => setIsVisible(true)} viewport={{ once: false, margin: "-50px" }}>
      <div ref={containerRef} className="h-[291px] overflow-y-auto p-4 pt-5 flex flex-col gap-4 bg-muted/30" style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}>
        {/* Msg 1 */}
        <div className="flex flex-col gap-1 w-full shrink-0">
          <div className="bg-background border border-border shadow-sm text-foreground text-[12px] p-3 rounded-2xl rounded-tl-sm leading-relaxed w-[92%]">
            Parfait ! J'ai analysé votre diagnostic. Peau de type Mixte. Préoccupations : Vitiligo, Pores dilatés, Légères rougeurs. Comment puis-je vous aider avec la Crème de jour anti-âge ?
          </div>
          <span className="text-[9px] text-muted-foreground ml-1 font-medium">Maintenant</span>
        </div>
        {showSuggestions && (
          <div className="flex flex-wrap gap-1.5 ml-1">
            {["Quels sont les ingrédients clés ?", "Est-elle en stock ?", "Délai de livraison ?"].map(s => (
              <span key={s} className="text-[9px] px-2.5 py-1 border border-border bg-background rounded-full text-muted-foreground shadow-sm">{s}</span>
            ))}
          </div>
        )}
        {isShown("msg-2") && <motion.div {...pop} className="flex flex-col gap-1 w-full items-end shrink-0"><div className="bg-foreground text-primary-foreground text-[13px] py-3 px-4 rounded-2xl rounded-tr-sm w-fit max-w-[85%] leading-relaxed">Bonjour, j'aimerais savoir si cette crème est adaptée au peau mixte et métisse ?</div><span className="text-[9px] text-muted-foreground mr-1 font-medium">09:42</span></motion.div>}
        {isShown("msg-3") && <motion.div {...pop} className="flex flex-col gap-2 w-full shrink-0"><div className="bg-background border border-border shadow-sm text-foreground text-[13px] p-4 rounded-2xl rounded-tl-sm flex flex-col gap-3 w-[92%]"><span className="leading-relaxed">Absolument ! Notre formule contient des extraits marins et de l'acide hyaluronique. Voici des résultats :</span><div className="flex flex-col gap-2"><div className="flex items-center gap-3 p-2 bg-muted/50 rounded-xl border border-border"><img src="https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/before-after/d7bb6871-6142-4c3b-8daf-b754fb38f4eb/1766996391238.png" alt="" className="w-[76px] h-[52px] object-cover rounded-lg border border-border shadow-sm" /><div className="flex flex-col"><span className="text-[13px] font-bold leading-tight">Anti-vieillissement</span><span className="text-[11px] text-muted-foreground mt-0.5">5 semaines</span></div></div><div className="flex items-center gap-3 p-2 bg-muted/50 rounded-xl border border-border"><img src="https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/before-after/d7bb6871-6142-4c3b-8daf-b754fb38f4eb/1766996432144.png" alt="" className="w-[76px] h-[52px] object-cover rounded-lg border border-border shadow-sm" /><div className="flex flex-col"><span className="text-[13px] font-bold leading-tight">Anti-âge front</span><span className="text-[11px] text-muted-foreground mt-0.5">3 semaines</span></div></div></div><span className="leading-relaxed">Ces résultats vous parlent ?</span></div><span className="text-[9px] text-muted-foreground ml-1 font-medium">09:42</span></motion.div>}
        {isShown("msg-3b") && <motion.div {...pop} className="flex flex-col gap-1 w-full items-end shrink-0"><div className="bg-foreground text-primary-foreground text-[13px] py-3 px-4 rounded-2xl rounded-tr-sm w-fit max-w-[85%] leading-relaxed">C'est impressionnant ! Avez-vous des avis de clientes ?</div><span className="text-[9px] text-muted-foreground mr-1 font-medium">09:43</span></motion.div>}
        {isShown("msg-3c") && <motion.div {...pop} className="flex flex-col gap-2 w-full shrink-0"><div className="bg-background border border-border shadow-sm text-foreground text-[13px] p-3 rounded-2xl rounded-tl-sm w-[92%] leading-relaxed">Bien sûr ! Voici quelques retours vérifiés :</div><div className="relative bg-background border border-border rounded-2xl p-4 shadow-sm w-[92%] flex flex-col gap-3"><div className="flex gap-0.5 mt-1">{[...Array(5)].map((_, i) => <div key={i} className="bg-[#00B67A] text-white flex items-center justify-center w-[18px] h-[18px] rounded-[3px]"><Star className="w-[11px] h-[11px] fill-current" /></div>)}</div><p className="text-[13px] text-foreground italic leading-relaxed font-medium">"Ma peau paraît nettement plus jeune et lumineuse. Confort, éclat et peau revitalisée."</p><p className="text-[12px] text-muted-foreground">Alice - via Trustpilot</p><div className="flex items-center justify-end gap-3 mt-1"><div className="w-7 h-7 border border-border rounded-full flex items-center justify-center text-muted-foreground opacity-50 bg-muted"><ChevronLeft className="w-3 h-3" /></div><span className="text-[11px] text-muted-foreground font-medium">1 / 2</span><div className="w-7 h-7 border border-border rounded-full flex items-center justify-center text-foreground bg-background shadow-sm"><ChevronRight className="w-3 h-3" /></div></div></div><span className="text-[9px] text-muted-foreground ml-1 font-medium">09:43</span></motion.div>}
        {isShown("msg-4") && <motion.div {...pop} className="flex flex-col gap-1 w-full items-end shrink-0"><div className="bg-foreground text-primary-foreground text-[13px] py-3 px-4 rounded-2xl rounded-tr-sm w-fit max-w-[85%] leading-relaxed">Top ! D'autres produits pour ma routine ?</div><span className="text-[9px] text-muted-foreground mr-1 font-medium">09:44</span></motion.div>}
        {isShown("msg-5") && <motion.div {...pop} className="flex flex-col gap-1 w-full shrink-0"><div className="flex flex-col gap-2 w-[95%] overflow-hidden"><div className="bg-background border border-border shadow-sm text-foreground text-[13px] p-3 rounded-2xl rounded-tl-sm w-fit">Voici ce qui pourrait compléter votre routine :</div><div className="flex gap-2 overflow-x-auto pb-2 pl-1" style={{ scrollbarWidth: "none" }}>{[{ img: "https://i0.wp.com/kaniwabotanique.com/wp-content/uploads/2025/08/O236SDw9GkuAtxkcoHnMrhJ_9lJP7tPq-scaled.jpg?w=1930&ssl=1", name: "Sérum vitamine C", price: "35,00 €" },{ img: "https://i0.wp.com/kaniwabotanique.com/wp-content/uploads/2026/01/FRONT_high_res-12-scaled.jpg?w=1930&ssl=1", name: "Sérum anti-âge", price: "34,00 €" },{ img: "", name: "Gel Hydratation", price: "29,00 €" }].map((p, i) => <div key={i} className="min-w-[90px] bg-background border border-border rounded-xl p-2 flex flex-col gap-1 items-center text-center relative shadow-sm shrink-0">{p.img ? <img src={p.img} alt={p.name} className="w-12 h-14 rounded object-cover shadow-sm mb-1" /> : <div className="w-12 h-14 bg-[#c8e6c9] rounded mb-1" />}<p className="text-[9px] font-bold leading-tight h-6">{p.name}</p><p className="text-[9px] text-muted-foreground font-medium">{p.price}</p><button className="absolute -bottom-2 right-2 bg-foreground text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-[12px] shadow-md">+</button></div>)}</div></div></motion.div>}
        {isShown("msg-6") && <motion.div {...pop} className="flex flex-col gap-1 w-full items-end shrink-0 mt-2"><div className="bg-foreground text-primary-foreground text-[12px] py-2.5 px-3.5 rounded-2xl rounded-tr-sm w-fit">Merci :)</div></motion.div>}
        {isShown("msg-7") && <motion.div {...pop} className="flex flex-col gap-1 w-full shrink-0"><div className="bg-background border border-border shadow-sm text-foreground text-[12px] p-3 rounded-2xl rounded-tl-sm leading-relaxed w-[92%]">De rien ! Crème ajoutée au panier. N'hésitez pas pour d'autres questions.</div></motion.div>}
        {showTyping && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1 w-full shrink-0"><div className="bg-background border border-border shadow-sm py-3 px-3.5 rounded-2xl rounded-tl-sm w-fit flex gap-1.5 items-center h-[34px]"><div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDuration: "1.4s", animationDelay: "-0.32s" }} /><div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDuration: "1.4s", animationDelay: "-0.16s" }} /><div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-pulse" style={{ animationDuration: "1.4s" }} /></div></motion.div>}
      </div>
      {/* Chat input with gradient border */}
      <div className="p-3 bg-background border-t border-border shrink-0">
        <div className="relative rounded-[22px] p-[1.5px] bg-gradient-to-r from-pink-300 via-purple-200 to-green-200 shadow-sm">
          <div className="bg-background rounded-[20px] p-3 flex flex-col gap-3">
            <div className="text-[13px] pl-1 tracking-wide min-h-[20px]">
              {isTypingInput ? <span className="text-foreground">{inputText}<span className="animate-pulse ml-[1px]">|</span></span> : <span className="text-muted-foreground">{inputText}</span>}
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="bg-foreground rounded-full py-1.5 pl-1.5 pr-4 flex items-center gap-2.5 shadow-md">
                <div className="flex items-center pl-0.5">
                  <img src="https://i.pravatar.cc/100?img=5" className="w-6 h-6 rounded-md border-[1.5px] border-background relative z-10 object-cover" alt="" />
                  <img src="https://i.pravatar.cc/100?img=11" className="w-6 h-6 rounded-md border-[1.5px] border-background relative z-20 -ml-2 object-cover" alt="" />
                  <div className="relative z-30 -ml-2"><img src="https://i.pravatar.cc/100?img=9" className="w-6 h-6 rounded-md border-[1.5px] border-background object-cover" alt="" /><div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-pink-100 via-blue-50 to-green-100 text-[6px] font-bold px-1 rounded shadow-sm text-foreground border border-background/80">AI</div></div>
                </div>
                <span className="text-primary-foreground text-[10px] font-bold tracking-wide">Faire un diagnostic</span>
              </div>
              <div className="flex items-center gap-3 pr-1">
                <Mic className="w-5 h-5 text-muted-foreground" />
                <div className="bg-foreground text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center shadow-md"><ArrowUp className="w-3 h-3" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function ConceptPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background -mx-6 lg:-mx-10 -mt-6 lg:-mt-10">

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[hsl(270,40%,96%)] via-background to-background">
        <div className="relative max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-8">
            <span className="bg-foreground text-primary-foreground text-xs font-semibold tracking-[0.15em] uppercase px-5 py-2 rounded-full">
              En 10 jours
            </span>
            <span className="text-muted-foreground text-sm tracking-wide">
              Profitez de plus de 18 ans d'expérience
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-5xl lg:text-[3.8rem] xl:text-[4.5rem] font-black text-foreground leading-[1.05] tracking-[-0.02em] uppercase max-w-5xl mx-auto">
            Sans vous ruiner lancez votre propre marque cosmétique bio et végane
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Oubliez le sourcing des meilleurs laboratoires français et européens, l'investissement dans le stock, la gestion des livraisons, la conception du site, le design du packaging ou même la gestion de votre support client.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-10 flex flex-wrap justify-center gap-4">
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-foreground text-primary-foreground hover:bg-foreground/90 rounded-full px-10 h-14 text-sm tracking-wide font-medium">
                Prendre rendez-vous
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href={CATALOG_URL}>
              <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-sm tracking-wide font-medium border-muted-foreground/40 text-foreground hover:bg-foreground hover:text-primary-foreground">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Consulter le catalogue
              </Button>
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Certifié Bio & Végan
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Conformité COSMOS/ECOCERT/FDA
            </span>
            <span className="flex items-center gap-1.5">
              <Rocket className="h-4 w-4" /> Lancement Rapide
            </span>
          </motion.div>
        </div>
      </section>

      {/* ═══ CERTIFICATIONS CAROUSEL ═══ */}
      <div className="overflow-hidden py-2 bg-background">
        <motion.div
          className="flex gap-12 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ width: "max-content" }}
        >
          {[...certLogos, ...certLogos].map((logo, i) => (
            <img key={i} src={logo} alt="Certification" className="h-16 md:h-20 w-auto object-contain opacity-70 grayscale" />
          ))}
        </motion.div>
      </div>

      {/* ═══ LES OBSTACLES ═══ */}
      <section className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <SectionLabel label="Le constat" title="Les raisons sont presque toujours les mêmes." />
        <div className="mt-16 grid gap-0 divide-y divide-border">
          {obstacles.map((item, i) => (
            <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp} custom={i} className="py-8 md:py-10 grid md:grid-cols-[200px_1fr] gap-4 md:gap-12">
              <p className="text-sm font-semibold text-foreground tracking-wide">{item.title}</p>
              <p className="text-muted-foreground leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="mt-16 p-8 md:p-12 rounded-2xl bg-foreground text-primary-foreground">
          <p className="text-xl md:text-2xl font-light leading-relaxed">
            Huit chances sur dix de tomber dans un de ces cas de figure. C'est ce constat qui a donné naissance à Biolystes. Nous avons éliminé chacun de ces obstacles, un par un, pour que vous puissiez vous concentrer sur l'essentiel : <span className="font-semibold">vendre et développer votre marque.</span>
          </p>
        </motion.div>
      </section>

      {/* ═══ LE CONCEPT ═══ */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <SectionLabel label="Le concept" title="Vous vendez, on s'occupe de tout le reste." />
          <div className="mt-16 space-y-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
              <p>
                Forts de 18 ans d'expérience dans l'e-commerce et la beauté, nous avons déjà accompagné plus de 100 marques grâce à une solution clé en main pour lancer la vôtre en seulement 10 à 15 jours.
              </p>
              <p>
                Zéro stock, zéro risque. Votre client commande, notre réseau de laboratoires français et européens d'excellence fabrique le produit à la demande, et nous l'expédions directement chez lui, sous votre nom. Aucun minimum de commande.
              </p>
              <p>
                Tous nos produits sont certifiés ECOCERT, COSMOS, et conformes aux normes européennes et américaines. C'est ce niveau d'exigence qui a convaincu des expertes internationales comme Sev Formal et ses 400 000 abonnés, ainsi que des marques comme Kaniwa Botanique et Fralène Paris, de nous confier la création de leur marque.
              </p>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: FlaskConical, label: "Laboratoires certifiés", sub: "Français et européens" },
                { icon: Truck, label: "Zéro stock", sub: "Aucun minimum de commande" },
                { icon: Globe, label: "10 à 15 jours", sub: "Pour lancer votre marque" },
              ].map((item) => (
                <div key={item.label} className="p-6 rounded-2xl bg-background">
                  <item.icon className="h-5 w-5 text-foreground mb-4" />
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.sub}</p>
             </div>
            ))}
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="mt-10 flex flex-wrap gap-4">
            <a href={CATALOG_URL}>
              <Button className="rounded-full px-6 h-11 text-sm">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Voir le catalogue produits
              </Button>
            </a>
            <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer">
              <Button className="rounded-full px-6 h-11 text-sm bg-transparent text-foreground border border-border hover:bg-accent">
                <HelpCircle className="mr-2 h-4 w-4" />
                Une question ? Parlons-en
              </Button>
            </a>
          </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ BRAND SHOWCASE STRIP ═══ */}
      <section className="overflow-hidden py-6 bg-background">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex gap-3 px-3"
          style={{ overflowX: "auto", scrollbarWidth: "none" }}
        >
          {[kaniwa1, fralene1, sevmylook1, pmyrris1, kaniwa3, fralene3, sevmylook3, pmyrris4].map((src, i) => (
            <div key={i} className="shrink-0 w-[200px] md:w-[260px] aspect-[3/4] rounded-2xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </motion.div>
      </section>

      {/* ═══ DEUX ÉTAPES ═══ */}
      <section className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <SectionLabel label="Le processus" title="Deux étapes. C'est tout." />
        <div className="mt-16 grid md:grid-cols-2 gap-12 md:gap-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-10 rounded-full bg-foreground text-primary-foreground flex items-center justify-center text-sm font-semibold">1</span>
              <h3 className="text-xl font-semibold tracking-tight">Mise en place de votre marque</h3>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
              <p>Votre expert produit vous accompagne dans la sélection de vos cosmétiques parmi notre catalogue certifié bio et végan. Des formulations clean, sans parabènes, sans silicones, sans ingrédients controversés.</p>
              <p>Nous réalisons un brief créatif pour comprendre l'ADN de votre projet. Un chef de projet dédié pilote l'ensemble de nos équipes. Un seul interlocuteur, zéro complexité pour vous.</p>
              <p>En quelques jours, vous recevez l'intégralité de vos livrables : logo, identité visuelle, design packagings recyclables, photos IA hyperréalistes, contenu du site rédigé et optimisé, et votre boutique en ligne prête à vendre.</p>
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-10 rounded-full bg-foreground text-primary-foreground flex items-center justify-center text-sm font-semibold">2</span>
              <h3 className="text-xl font-semibold tracking-tight">Gestion au quotidien</h3>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-[15px]">
              <p>Côté ventes, Lystes.ai travaille pour vous jour et nuit. Un expert produit IA répond aux questions 24h/24. Le diagnostic intelligent scanne le visage de votre client et recommande les produits adaptés.</p>
              <p><strong className="text-foreground">Mode standard</strong> — Votre client commande, le laboratoire fabrique et expédie directement sous votre nom. Aucun stock, livraison en 6-7 jours.</p>
              <p><strong className="text-foreground">Mode express</strong> — Livraison en 24 à 48 heures grâce à un stock tampon. Réapprovisionnement automatique chaque semaine, sans minimum.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ COMMENT ÇA MARCHE ═══ */}
      <CommentCaMarche />

      {/* ═══ LYSTES.AI ═══ */}
      <section className="bg-foreground text-primary-foreground">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <SectionLabel dark label="Lystes.ai" title="Comment gérer sa marque bio et végane au quotidien sans engager trop de dépenses ?"
            subtitle="Une fois que nous nous sommes mis à votre place, nous vous mettons à disposition des agents IA qui vous permettent d'atteindre vos objectifs. Ces agents vous aideront à produire des photos, à améliorer votre SEO, à répondre à votre place au client, à proposer des diagnostics et des recommandations produits, à vous donner des plans d'action marketing, à créer des contenus photos et des contenus pour vos réseaux sociaux." />
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
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5} className="mt-12 flex flex-wrap gap-4">
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 rounded-full px-8 h-12 text-sm tracking-wide">
                Prendre rendez-vous
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href={CONTACT_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full px-8 h-12 text-sm tracking-wide bg-transparent text-primary-foreground border border-primary-foreground/40 hover:bg-primary-foreground/10">
                <HelpCircle className="mr-2 h-4 w-4" />
                Poser une question
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ AVANT / AVEC LYSTES ═══ */}
      <section className="py-24 md:py-36 bg-secondary">
        <div className="max-w-[1280px] mx-auto px-5 md:px-[clamp(20px,5vw,80px)]">
import cert1 from "@/assets/cert-1.png";
import cert2 from "@/assets/cert-2.png";
import cert3 from "@/assets/cert-3.png";
import cert4 from "@/assets/cert-4.png";
import cert5 from "@/assets/cert-5.png";
import cert6 from "@/assets/cert-6.png";
import cert7 from "@/assets/cert-7.png";
import cert8 from "@/assets/cert-8.png";

const certLogos = [cert1, cert2, cert3, cert4, cert5, cert6, cert7, cert8];
import cert1 from "@/assets/cert-1.png";
import cert2 from "@/assets/cert-2.png";
import cert3 from "@/assets/cert-3.png";
import cert4 from "@/assets/cert-4.png";
import cert5 from "@/assets/cert-5.png";
import cert6 from "@/assets/cert-6.png";
import cert7 from "@/assets/cert-7.png";
import cert8 from "@/assets/cert-8.png";

const certLogos = [cert1, cert2, cert3, cert4, cert5, cert6, cert7, cert8];

          {/* Phone comparisons */}
          <div className="w-full flex justify-center items-start overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <div className="relative flex flex-col md:flex-row items-start justify-center gap-10 md:gap-16">

              {/* ── AVANT ── */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
                className="flex flex-col items-center gap-8 relative z-10 w-[320px] shrink-0">
                <div className="bg-foreground text-primary-foreground px-5 py-2 rounded-lg font-bold text-sm tracking-widest uppercase">Vos concurrents</div>
                <div className="w-[320px] bg-background rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative flex flex-col">
                  {/* Nav bar */}
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
                  {/* Product image area */}
                  <div className="w-full h-64 bg-muted relative pt-4 overflow-hidden">
                    <div className="flex justify-center items-start h-full">
                      <img src="https://i0.wp.com/kaniwabotanique.com/wp-content/uploads/2025/08/veuDbzM0ysQo5wxsfo1yvp1BnqZbx7PW-scaled.jpg?w=1930&ssl=1" alt="Produit" className="w-[140px] h-[200px] object-cover rounded-2xl shadow-sm border border-border relative z-10" />
                    </div>
                    <div className="absolute bottom-4 w-full flex justify-center gap-2 z-20">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                    </div>
                  </div>
                  {/* Product info */}
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
                    {/* Trust badges */}
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
                {/* Conversion rate card */}
                <div className="w-[320px] bg-background px-5 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] relative z-20">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">TAUX DE CONVERSION</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[22px] font-bold text-foreground">3,8 %</span>
                    <span className="text-primary font-bold text-sm">→</span>
                    <span className="text-[22px] font-bold text-primary">42 %</span>
                    <svg className="w-16 h-6 ml-auto" viewBox="0 0 100 30" fill="none">
                      <path d="M0 20 Q 15 0, 30 15 T 60 15 T 90 10 T 100 5" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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
                    {/* Nav bar */}
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
                    {/* Promo bar */}
                    <div className="w-full bg-foreground text-primary-foreground text-center text-[10px] font-medium tracking-widest uppercase py-1.5 shrink-0">
                      Livraison gratuite aujourd'hui
                    </div>
                    {/* Product images carousel - exact same images as original */}
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
                    {/* Product info */}
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
                      {/* Animated Chat widget */}
                      <AnimatedChat />
                      {/* Add to cart */}
                      <button className="w-full bg-foreground text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-6 text-[13px] tracking-wide shadow-lg uppercase">
                        AJOUTER AU PANIER<span className="w-px h-4 bg-muted-foreground/50 mx-2" />49,90€
                      </button>
                      {/* UGC images */}
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

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4} className="mt-16 text-center">
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full px-8 h-12 text-sm tracking-wide">
                Découvrir Lystes AI
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ ÉLIMINE / PREND EN CHARGE ═══ */}
      <section className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">Vous n'avez plus à</p>
            <div className="space-y-4">
              {eliminates.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <X className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="text-muted-foreground text-[15px]">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">Nous prenons tout en charge</p>
            <div className="space-y-4">
              {provides.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-foreground mt-0.5 shrink-0" />
                  <p className="text-foreground text-[15px]">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>



      {/* ═══ PRICING — PACK DÉCOUVERTE ═══ */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <SectionLabel label="Pack Découverte" title="Testez avant de vous engager."
            subtitle="Le montant du Pack Découverte est intégralement déduit si vous passez à une offre avec site web." />
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {packDecouverte.map((p, i) => (
              <motion.div key={p.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <PricingCard {...p} />
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="mt-8 text-center">
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer">
              <Button className="rounded-full px-6 h-11 text-sm">
                Commander un pack
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══ PRICING — SANS SITE ═══ */}
      <section className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <SectionLabel label="Offre sans site web" title="Vendez en autonomie."
          subtitle="Accédez à notre catalogue et vendez sur vos propres canaux." />
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {offresSansSite.map((p, i) => (
            <motion.div key={p.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <PricingCard {...p} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ PRICING — AVEC SITE ═══ */}
      <section className="bg-secondary">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <SectionLabel label="Offre avec site web" title="Votre business clé en main." />
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {offresAvecSite.map((p, i) => (
              <motion.div key={p.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <PricingCard {...p} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABONNEMENTS ═══ */}
      <section className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <SectionLabel label="Abonnements mensuels" title="Des services qui accompagnent votre croissance."
          subtitle="Le premier mois de l'abonnement est toujours offert." />
        <div className="mt-12 grid sm:grid-cols-2 gap-6">
          {abonnements.map((p, i) => (
            <motion.div key={p.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <PricingCard {...p} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ PORTFOLIO / CASE STUDIES ═══ */}
      <section className="bg-secondary">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <SectionLabel label="Portfolio" title="Plus de 100 marques accompagnées." />
          <div className="mt-16 space-y-20">
            {[
              { name: "Kaniwa Botanique", tagline: "Marque bio & vegan, lancée en 12 jours", url: "https://kaniwabotanique.com", images: [kaniwa1, kaniwa2, kaniwa3, kaniwa5] },
              { name: "Fralène Paris", tagline: "Gamme soins visage premium", url: "https://fraleneparis.com", images: [fralene1, fralene2, fralene3, fralene5] },
              { name: "Sev My Look", tagline: "Gamme solaire & soins visage, 400K abonnés", url: "https://sevmylook.com", images: [sevmylook1, sevmylook3, sevmylook5, sevmylook7] },
              { name: "P'Myrris Beauty", tagline: "Soins capillaires cheveux bouclés", url: "https://pmyrrisbeauty.fr", images: [pmyrris1, pmyrris2, pmyrris4, pmyrris6] },
            ].map((brand, bi) => (
              <motion.div key={brand.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={bi}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <p className="text-lg font-semibold tracking-tight text-foreground">{brand.name}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{brand.tagline}</p>
                  </div>
                  <a href={brand.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-70 transition-opacity shrink-0">
                    Voir le site <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {brand.images.map((src, i) => (
                    <div key={i} className="aspect-[4/5] rounded-xl overflow-hidden">
                      <img src={src} alt={brand.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4} className="mt-16 text-center">
            <button onClick={() => navigate("/portfolio")}
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-70 transition-opacity">
              Voir tout le portfolio <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ═══ CATALOGUE PREVIEW ═══ */}
      <CatalogPreview navigate={navigate} />

      {/* ═══ ENGAGEMENTS & CERTIFICATIONS ═══ */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16 space-y-4">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
            Nos produits bio et véganes sont certifiés ECOCERT COSMOS et enregistrés au CPNP
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Profitez de notre expertise et de notre réseau<br />de laboratoires français et européens d'excellence.
          </motion.p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: FileCheck2, title: "Enregistrement CPNP", desc: "Produits enregistrés, conformes aux normes EU & UK." },
            { icon: BadgeCheck, title: "Conformité FDA", desc: "Formulations conformes pour le marché américain." },
            { icon: Leaf, title: "Certification ECOCERT", desc: "Répond aux standards écologiques UE, UK & USA." },
            { icon: Award, title: "Certification ISO 22716", desc: "Bonnes pratiques de fabrication garanties." },
            { icon: Rabbit, title: "Non Testés sur Animaux", desc: "Aucune expérimentation animale à aucun stade." },
            { icon: Package, title: "Packagings Recyclables", desc: "Emballages conçus pour être recyclables." },
            { icon: Award, title: "Sans Ingrédients Controversés", desc: "Sans parabènes, silicones, PEG, filtres UV chimiques, microplastiques, colorants artificiels." },
            { icon: Leaf, title: "Parfums 100% Véganes", desc: "Sans parfums synthétiques, substances aromatiques naturelles, sans phosphates ni conservateurs synthétiques." },
            { icon: Package, title: "Aucun Minimum de Commande", desc: "Pour les points de vente physiques, commandes flexibles." },
            { icon: FileCheck2, title: "Échantillons Disponibles", desc: "Testez les produits avant le lancement de votre marque." },
            { icon: Award, title: "Production à la Demande", desc: "Fabrication à la commande, adaptée à vos besoins." },
            { icon: Package, title: "Expédition Directe", desc: "Envoi aux clients finaux sous votre marque." },
          ].map((item, i) => (
            <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card p-5 rounded-xl text-center">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                <item.icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
              </div>
              <h4 className="text-xs font-semibold text-foreground mb-1">{item.title}</h4>
              <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-5xl font-light tracking-tight">
            En résumé : vous vendez, on s'occupe de tout le reste.
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Vous ne lancez pas juste une marque. Vous lancez une marque équipée pour vendre.
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="flex flex-wrap justify-center gap-4 mt-4">
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full px-8 h-12 text-sm tracking-wide">
                Prendre rendez-vous avec un expert
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-sm tracking-wide"
              onClick={() => navigate("/configurateur")}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Poser une question
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground">
          Biolystes — Paris, France — hello@biolystes.com
        </p>
      </footer>

      {/* ═══ FLOATING CHAT BUTTON ═══ */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        onClick={() => navigate("/configurateur")}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-foreground text-primary-foreground flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        aria-label="Poser une question"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
