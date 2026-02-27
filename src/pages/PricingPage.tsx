import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Globe, CreditCard } from "lucide-react";

// ─── Types ────────────────────────────────────────────────
type Tab = "sans-site" | "avec-site" | "abonnement";

// ─── Check icon ───────────────────────────────────────────
function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 mb-2">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span className="text-[13px] leading-relaxed" style={{ color: "#424245" }}>{text}</span>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────
function Badge({ label }: { label: string }) {
  return (
    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
      style={{ background: "#1d1d1f", color: "#fff" }}>
      {label}
    </div>
  );
}

// ─── CTA Button ───────────────────────────────────────────
function CtaButton({ label, filled = false, onClick }: { label: string; filled?: boolean; onClick?: () => void }) {
  const RDV_URL = "https://app.iclosed.io/e/paylystes/r2";
  return (
    <a
      href={onClick ? undefined : RDV_URL}
      target={onClick ? undefined : "_blank"}
      rel="noopener noreferrer"
      onClick={onClick}
      className="block w-full py-3.5 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase rounded-lg cursor-pointer transition-all duration-150 mt-auto"
      style={{
        background: filled ? "#1d1d1f" : "transparent",
        color: filled ? "#fff" : "#1d1d1f",
        border: "1.5px solid #1d1d1f",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = "#1d1d1f";
        el.style.color = "#fff";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = filled ? "#1d1d1f" : "transparent";
        el.style.color = filled ? "#fff" : "#1d1d1f";
      }}
    >
      {label}
    </a>
  );
}

// ─── OFFRE SANS SITE WEB ──────────────────────────────────
function TabSansSite() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* Option 1 */}
        <div className="flex flex-col gap-5">
          <span className="text-[10px] font-bold tracking-wide uppercase self-start px-3 py-1 rounded-full" style={{ color: "#86868b", background: "#ebebed" }}>Option 1</span>
          <div>
            <h3 className="text-base md:text-lg font-extrabold uppercase tracking-tight mb-1" style={{ color: "#1d1d1f" }}>Accès Catalogue — 39€/mois</h3>
            <p className="text-sm mb-5" style={{ color: "#86868b", lineHeight: 1.65 }}>
              Testez nos produits sans engagement
            </p>
            <div className="flex flex-col gap-2.5 mb-7">
              {[
                "Jusqu'à 4 références produits",
                "Sans minimum de commande par produit",
                "Étiquetage standard conforme inclus",
                "Produits certifiés bio, vegan, COSMOS, Ecocert",
                "35€ par référence supplémentaire",
                "Sans engagement, résiliable à tout moment",
              ].map((text, i) => <CheckItem key={i} text={text} />)}
            </div>
          </div>
          <CtaButton label="Explorer le catalogue" filled />
        </div>

        {/* Divider - desktop only */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px" style={{ background: "#f0f0f0" }} />

        {/* Option 2 */}
        <div className="flex flex-col gap-5">
          <span className="text-[10px] font-bold tracking-wide uppercase self-start px-3 py-1 rounded-full" style={{ color: "#86868b", background: "#ebebed" }}>Option 2</span>
          <div>
            <h3 className="text-base md:text-lg font-extrabold uppercase tracking-tight mb-1" style={{ color: "#1d1d1f" }}>Design Packaging — 79€/produit</h3>
            <p className="text-sm mb-5" style={{ color: "#86868b", lineHeight: 1.65 }}>
              Votre identité sur chaque produit
            </p>
            <div className="flex flex-col gap-2.5 mb-7">
              {[
                "Logo et identité visuelle",
                "Étiquette personnalisée à votre image",
                "Brandboard complet",
                "3 aller-retours avec nos designers",
                "Fichiers livrés, ils sont à vous",
              ].map((text, i) => <CheckItem key={i} text={text} />)}
            </div>
          </div>
          <CtaButton label="Demander un devis" />
        </div>
      </div>

      {/* Phrase de progression */}
      <div className="text-center pt-4">
        <p className="text-[13px] italic" style={{ color: "#86868b", lineHeight: 1.6 }}>
          Commencez par l'Option 1 pour tester, passez à l'Option 2 quand vous êtes prêt(e).
        </p>
      </div>
    </motion.div>
  );
}

// ─── OFFRE AVEC SITE WEB ──────────────────────────────────
const packAgenceFeatures = [
  "Création de logo",
  "Design Packaging",
  "Contenu textuel clé en main",
  "Photographie IA hyperréaliste",
  "Site e-commerce",
  "Indexation Google",
  "Automatisation livraison",
  "Support premium",
  "Expert produit dédié en votre nom",
  "Achat de stock pas nécessaire",
  "Aucune quantité min en cas d'achat de stock",
  "Optimisation SEO avancée",
  "CRO standard",
];

const packIAFeatures = [
  "Création de logo",
  "Design Packaging",
  "Contenu textuel clé en main",
  "Photographie IA hyperréaliste",
  "Site e-commerce",
  "Indexation Google",
  "Automatisation livraison",
  "Support premium",
  "Expert produit dédié en votre nom",
  "Achat de stock pas nécessaire",
  "Aucune quantité min en cas d'achat de stock",
  "UGC IA Ultraréaliste",
  "Optimisation SEO avancée",
  "CRO standard",
  "Expert produit dédié",
  "Diagnostic intelligent par IA",
  "Recommandations produits par IA",
  "Gestion réseaux sociaux 1 mois",
];

function TabAvecSite() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pack Agence */}
        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "2px solid #1d1d1f" }}>
          <Badge label="Populaire" />
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-1" style={{ color: "#1d1d1f" }}>Pack Agence</h3>
          <p className="text-xs mb-4" style={{ color: "#86868b" }}>Gestion 360°</p>

          <div className="mb-1">
            <span className="text-2xl md:text-[28px] font-extrabold" style={{ color: "#1d1d1f" }}>1 499€</span>
            <span className="text-[13px] ml-1.5" style={{ color: "#86868b" }}>frais uniques ou 999€ en 2 fois</span>
          </div>

          <div className="rounded-xl p-3 mb-5" style={{ background: "#f5f5f7", border: "1px solid #e5e5e7" }}>
            <p className="text-xs font-extrabold uppercase tracking-wide mb-0.5" style={{ color: "#1d1d1f" }}>
              + Abonnement Pro inclus obligatoire
            </p>
            <p className="text-xl md:text-[22px] font-extrabold my-0.5" style={{ color: "#1d1d1f" }}>
              99€<span className="text-[13px] font-medium" style={{ color: "#86868b" }}>/mois</span>
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "#86868b" }}>
              Hébergement, livraisons, SEO, support & IA inclus
            </p>
          </div>

          <div className="flex-1 mb-6">
            {packAgenceFeatures.map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>

        {/* Pack IA */}
        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "1.5px solid #e5e5e7", background: "#fff" }}>
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-1" style={{ color: "#1d1d1f" }}>Pack IA</h3>
          <p className="text-xs mb-4" style={{ color: "#86868b" }}>Gestion 360° + Intelligence artificielle avancée</p>

          <div className="mb-1">
            <span className="text-2xl md:text-[28px] font-extrabold" style={{ color: "#1d1d1f" }}>2 999€</span>
            <span className="text-[13px] ml-1.5" style={{ color: "#86868b" }}>frais uniques ou 999€ en 2 fois</span>
          </div>

          <div className="rounded-xl p-3 mb-5" style={{ background: "#f5f5f7", border: "1px solid #e5e5e7" }}>
            <p className="text-xs font-extrabold uppercase tracking-wide mb-0.5" style={{ color: "#1d1d1f" }}>
              + Abonnement Pro inclus obligatoire
            </p>
            <p className="text-xl md:text-[22px] font-extrabold my-0.5" style={{ color: "#1d1d1f" }}>
              199€<span className="text-[13px] font-medium" style={{ color: "#86868b" }}>/mois</span>
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: "#86868b" }}>
              1er mois offert · Tout le Pro + UGC IA, diagnostic IA & réseaux sociaux
            </p>
          </div>

          <div className="flex-1 mb-6">
            {packIAFeatures.map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── ABONNEMENT MENSUEL ───────────────────────────────────
const aboPro = [
  "Gestion e-commerce complète",
  "Support dédié",
  "Gestion de la sécurité du site web",
  "Serveur dédié & hébergement inclus",
  "Certificat SSL inclus",
  "Sauvegardes automatiques",
  "Optimisation SEO de base",
  "Nom de domaine inclus",
  "Configuration email pro",
  "Gestion des livraisons de vos produits",
  "Chat en ligne IA intégré",
  "Diagnostic intelligent par IA",
  "Recommandations produits par IA",
  "Achat de stock en plusieurs fois",
  "Configuration solution de paiement en x fois",
];

const aboIA = [
  "Toutes les prestations de l'abonnement Pro",
  "Photos UGC authentiques",
  "Photos lifestyle immersives",
  "Photos studio professionnelles",
  "Minimum 6 photos",
  "Retouches 2 allers et retour",
  "Chat en ligne IA intégré",
  "Diagnostic intelligent par IA",
  "Recommandations produits par IA",
  "Achat de stock en plusieurs fois",
  "Configuration solution de paiement en x fois",
];

const marketingCRO = [
  "Création & optimisation publicités Meta",
  "Publicités TikTok Ads",
  "Media Buying stratégique",
  "Optimisation des conversions (CRO)",
  "A/B testing pages & tunnels",
  "Référencement naturel (SEO)",
  "Suivi des performances publicitaires",
  "Conseil stratégique mensuel",
  "Rapports détaillés & ROI",
  "Support prioritaire dédié",
];

const communityManager = [
  "Gestion Instagram & Facebook",
  "Gestion TikTok",
  "Gestion Pinterest",
  "Calendrier éditorial mensuel",
  "Création de contenu (posts & stories)",
  "Modération & engagement communauté",
  "Rapports de performance mensuels",
  "Support dédié",
];

function TabAbonnement() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      {/* Row 1: Abonnement Pro + Abonnement IA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Abonnement Pro */}
        <div className="rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "1.5px solid #e5e5e7", background: "#fff" }}>
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-2" style={{ color: "#1d1d1f" }}>Abonnement Pro</h3>
          <p className="text-[13px] mb-4" style={{ color: "#86868b", lineHeight: 1.6 }}>Accompagnement personnalisé et outils marketing pour booster votre croissance.</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[32px] font-extrabold" style={{ color: "#1d1d1f" }}>99€</span>
            <span className="text-[13px] ml-1.5" style={{ color: "#86868b" }}>/mois</span>
          </div>
          <p className="text-xs font-semibold mb-5" style={{ color: "#86868b" }}>1er mois offert avec un pack</p>
          <p className="text-xs font-bold mb-3" style={{ color: "#1d1d1f" }}>Ce qui est inclus :</p>
          <div className="flex-1 mb-6">
            {aboPro.map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>

        {/* Abonnement IA */}
        <div className="rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "1.5px solid #e5e5e7", background: "#fff" }}>
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-2" style={{ color: "#1d1d1f" }}>Abonnement IA</h3>
          <p className="text-[13px] mb-4" style={{ color: "#86868b", lineHeight: 1.6 }}>Des visuels professionnels générés par IA pour sublimer votre marque.</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[32px] font-extrabold" style={{ color: "#1d1d1f" }}>99€</span>
            <span className="text-[13px] ml-1.5" style={{ color: "#86868b" }}>/mois</span>
          </div>
          <p className="text-xs font-semibold mb-5" style={{ color: "#86868b" }}>Sans engagement</p>
          <p className="text-xs font-bold mb-3" style={{ color: "#1d1d1f" }}>Ce qui est inclus :</p>
          <div className="flex-1 mb-6">
            {aboIA.map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>
      </div>

      {/* Row 2: Marketing CRO + Community Manager */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marketing + CRO */}
        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "2px solid #1d1d1f", background: "#fff" }}>
          <Badge label="Recommandé" />
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-2" style={{ color: "#1d1d1f" }}>Marketing + CRO</h3>
          <p className="text-[13px] mb-4" style={{ color: "#86868b", lineHeight: 1.6 }}>Boostez vos ventes avec une stratégie marketing complète et l'optimisation de vos conversions.</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[32px] font-extrabold" style={{ color: "#1d1d1f" }}>699€</span>
            <span className="text-[13px] ml-1.5" style={{ color: "#86868b" }}>/mois</span>
          </div>
          <p className="text-xs font-semibold mb-5" style={{ color: "#86868b" }}>Engagement flexible</p>
          <p className="text-xs font-bold mb-3" style={{ color: "#1d1d1f" }}>Ce qui est inclus :</p>
          <div className="flex-1 mb-6">
            {marketingCRO.map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" filled />
        </div>

        {/* Community Manager */}
        <div className="rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "1.5px solid #e5e5e7", background: "#fff" }}>
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-2" style={{ color: "#1d1d1f" }}>Community Manager</h3>
          <p className="text-[13px] mb-4" style={{ color: "#86868b", lineHeight: 1.6 }}>Déléguez la gestion de vos réseaux sociaux à nos experts.</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[32px] font-extrabold" style={{ color: "#1d1d1f" }}>699</span>
            <span className="text-[13px] ml-1" style={{ color: "#86868b" }}>/mois</span>
          </div>
          <p className="text-xs font-semibold mb-5" style={{ color: "#86868b" }}>Engagement flexible</p>
          <p className="text-xs font-bold mb-3" style={{ color: "#1d1d1f" }}>Ce qui est inclus :</p>
          <div className="flex-1 mb-6">
            {communityManager.map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main PricingPage ─────────────────────────────────────
export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("sans-site");

  const tabs: { key: Tab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { key: "sans-site", label: "Offre sans site web", shortLabel: "Sans site", icon: <Zap size={13} strokeWidth={1.8} /> },
    { key: "avec-site", label: "Offre avec site web", shortLabel: "Avec site", icon: <Globe size={13} strokeWidth={1.8} /> },
    { key: "abonnement", label: "Abonnement mensuel", shortLabel: "Abonnement", icon: <CreditCard size={13} strokeWidth={1.8} /> },
  ];

  return (
    <>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 md:mb-10 text-center mt-4 md:mt-[90px]">
        <h1 className="text-2xl md:text-[42px] font-extrabold uppercase leading-tight tracking-tight mb-3" style={{ color: "#1d1d1f" }}>
          Des forfaits transparents<br className="hidden md:block" /><span className="md:hidden"> </span>et adaptés à votre ambition
        </h1>
        <p className="text-sm md:text-[15px]" style={{ color: "#86868b", lineHeight: 1.6 }}>
          Le premier mois de l'abonnement est toujours offert !
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }} className="flex justify-center gap-2 mb-8 md:mb-10 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 rounded-lg text-[10px] md:text-[11px] font-bold tracking-wide uppercase cursor-pointer transition-all duration-150"
            style={{
              border: "1.5px solid",
              background: activeTab === tab.key ? "#1d1d1f" : "#fff",
              color: activeTab === tab.key ? "#fff" : "#1d1d1f",
              borderColor: activeTab === tab.key ? "#1d1d1f" : "#d1d1d6",
            }}
          >
            {tab.icon}
            <span className="hidden md:inline">{tab.label}</span>
            <span className="md:hidden">{tab.shortLabel}</span>
          </button>
        ))}
      </motion.div>

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="rounded-2xl md:rounded-[20px] p-4 md:p-9 relative"
        style={{
          background: "#fff",
          border: "1px solid #f0f0f0",
        }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "sans-site" && <TabSansSite key="sans-site" />}
          {activeTab === "avec-site" && <TabAvecSite key="avec-site" />}
          {activeTab === "abonnement" && <TabAbonnement key="abonnement" />}
        </AnimatePresence>
      </motion.div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center mt-7"
      >
        <p className="text-xs" style={{ color: "#86868b" }}>
          Des questions ? Contactez-nous à{" "}
          <a href="mailto:hello@biolystes.com" style={{ color: "#1d1d1f", fontWeight: 600, textDecoration: "none" }}>
            hello@biolystes.com
          </a>
        </p>
      </motion.div>
    </>
  );
}
