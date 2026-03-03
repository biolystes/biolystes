import { motion } from "framer-motion";
import { ArrowRight, Check, X, FlaskConical, Truck, Globe, ScanFace, MessageCircle, QrCode, Camera, BarChart3, ExternalLink, ShoppingBag, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    title: "Diagnostic intelligent",
    text: "Votre visiteur prend un selfie. L'IA scanne son visage, analyse sa peau en détail, et recommande automatiquement les produits les plus adaptés de votre boutique.",
  },
  {
    icon: MessageCircle,
    title: "Experts produits IA",
    text: "Chaque produit dispose de son propre expert dédié. Il répond instantanément aux questions sur la composition, la compatibilité, les délais. Comme votre meilleur vendeur, formé sur chaque détail.",
  },
  {
    icon: QrCode,
    title: "Coach post-achat",
    text: "Via un QR code sur votre packaging, votre client accède à un coach IA personnel. Conseils d'utilisation, routines adaptées, suggestions complémentaires. Moins de retours, plus de fidélisation.",
  },
  {
    icon: Camera,
    title: "Studio créatif IA",
    text: "Photos produits niveau studio professionnel, visuels UGC avec de vrais visages pour vos réseaux sociaux, contenus marketing. En quelques secondes, sans shooting.",
  },
  {
    icon: BarChart3,
    title: "Tableau de bord intelligent",
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
    installment: "ou 999 € en 2x",
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
    installment: "ou 999 € en 2x",
    sub: "Abonnement Pro obligatoire 199 €/mois",
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

/* ── Main Page ── */
export default function ConceptPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="relative max-w-4xl mx-auto px-6 py-32 md:py-44 text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="text-primary-foreground/50 text-sm tracking-[0.3em] uppercase mb-8">
            Biolystes
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-light text-primary-foreground leading-[1.1] tracking-tight">
            Sur dix marques qui se lancent,{" "}
            <span className="font-semibold">huit échouent.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-lg md:text-xl text-primary-foreground/60 max-w-2xl mx-auto leading-relaxed">
            Ce n'est pas une opinion, c'est une statistique. Nous avons éliminé chacun de ces obstacles pour que vous puissiez vous concentrer sur l'essentiel.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-12 flex flex-wrap justify-center gap-4">
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 rounded-full px-8 h-12 text-sm tracking-wide">
                Prendre rendez-vous
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href={CATALOG_URL}>
              <Button size="lg" className="rounded-full px-8 h-12 text-sm tracking-wide bg-transparent text-primary-foreground border border-primary-foreground/40 hover:bg-primary-foreground/10">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Consulter le catalogue
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

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
              <Button variant="outline" className="rounded-full px-6 h-11 text-sm">
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

      {/* ═══ LYSTES.AI ═══ */}
      <section className="bg-foreground text-primary-foreground">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <SectionLabel dark label="Lystes.ai" title="Cinq départements IA. Une seule plateforme."
            subtitle="Diagnostic, experts, coaching, contenu, pilotage. Connectée à votre boutique dès le premier jour." />
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
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-sm tracking-wide border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <HelpCircle className="mr-2 h-4 w-4" />
                Poser une question
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

      {/* ═══ MARQUES RÉFÉRENCES ═══ */}
      <section className="bg-secondary">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center">
            <SectionLabel label="Ils nous font confiance" title="Plus de 100 marques accompagnées." />
          </div>

          {/* Brand grids */}
          <div className="mt-16 space-y-16">
            {/* Kaniwa */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-semibold tracking-wide text-foreground">Kaniwa Botanique</p>
                <a href="https://kaniwabotanique.com" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Voir le site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[kaniwa1, kaniwa2, kaniwa3, kaniwa5].map((src, i) => (
                  <div key={i} className="aspect-[4/5] rounded-xl overflow-hidden">
                    <img src={src} alt="Kaniwa Botanique" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Fralène */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-semibold tracking-wide text-foreground">Fralène Paris</p>
                <a href="https://fraleneparis.com" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Voir le site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[fralene1, fralene2, fralene3, fralene5].map((src, i) => (
                  <div key={i} className="aspect-[4/5] rounded-xl overflow-hidden">
                    <img src={src} alt="Fralène Paris" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Sev My Look */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-semibold tracking-wide text-foreground">Sev My Look</p>
                <a href="https://sevmylook.com" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Voir le site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[sevmylook1, sevmylook3, sevmylook5, sevmylook7].map((src, i) => (
                  <div key={i} className="aspect-[4/5] rounded-xl overflow-hidden">
                    <img src={src} alt="Sev My Look" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* P'Myrris */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-semibold tracking-wide text-foreground">P'Myrris Beauty</p>
                <a href="https://pmyrrisbeauty.com" target="_blank" rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Voir le site <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[pmyrris1, pmyrris2, pmyrris4, pmyrris6].map((src, i) => (
                  <div key={i} className="aspect-[4/5] rounded-xl overflow-hidden">
                    <img src={src} alt="P'Myrris" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
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
          <motion.div variants={fadeUp} custom={2}>
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-full px-8 h-12 text-sm tracking-wide mt-4">
                Prendre rendez-vous avec un expert
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </motion.div>
        </motion.div>
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
