import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Zap, Globe, CreditCard } from "lucide-react";

const RDV_URL = "https://app.iclosed.io/e/paylystes/r2";

type Tab = "decouverte" | "sans-site" | "avec-site" | "abonnement";

function CheckItem({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <div className="flex items-start gap-2.5 mb-2">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={dark ? "#1d1d1f" : "#86868b"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span className="text-[13px] leading-relaxed" style={{ color: "#424245" }}>{text}</span>
    </div>
  );
}

function Badge({ label, popular = false }: { label: string; popular?: boolean }) {
  return (
    <div
      className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
      style={{ background: popular ? "#1d1d1f" : "#ebebed", color: popular ? "#fff" : "#86868b" }}
    >
      {label}
    </div>
  );
}

function CtaButton({ label, filled = false }: { label: string; filled?: boolean }) {
  return (
    <a
      href={RDV_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full py-3.5 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase cursor-pointer transition-all duration-150 mt-auto"
      style={{
        background: filled ? "#1d1d1f" : "transparent",
        color: filled ? "#fff" : "#1d1d1f",
        border: "1.5px solid #1d1d1f",
        borderRadius: 50,
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "#1d1d1f"; e.currentTarget.style.color = "#fff"; }}
      onMouseLeave={e => { e.currentTarget.style.background = filled ? "#1d1d1f" : "transparent"; e.currentTarget.style.color = filled ? "#fff" : "#1d1d1f"; }}
    >
      {label}
    </a>
  );
}

// ─── PACK DÉCOUVERTE ──────────────────────────────────────
function TabDecouverte() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sans Branding */}
        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "1px solid #e5e5e7" }}>
          <Badge label="Formule 1" />
          <div className="mt-2">
            <h3 className="text-base md:text-lg font-extrabold uppercase tracking-tight mb-1" style={{ color: "#1d1d1f" }}>Sans Branding — 147€</h3>
            <p className="text-sm mb-5" style={{ color: "#86868b", lineHeight: 1.65 }}>ou 3x 49€ — Testez nos produits sans engagement</p>
            <div className="flex flex-col gap-2.5 mb-7">
              {[
                "4 produits échantillons (sérum, crème, nettoyant, soin spécifique)",
                "Accompagnement personnalisé dans la sélection par nos experts",
                "Étiquetage standard conforme Biolystes",
                "Certifié Bio & Végan / COSMOS / ECOCERT / FDA",
                "Livraison incluse sous 7 à 8 jours",
                "Produit supplémentaire : 29€/unité",
              ].map((t, i) => <CheckItem key={i} text={t} />)}
            </div>
          </div>
          <CtaButton label="Explorer le catalogue" filled />
        </div>

        {/* Avec Branding */}
        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "2px solid #1d1d1f" }}>
          <Badge label="Formule 2 · Recommandé" popular />
          <div className="mt-2">
            <h3 className="text-base md:text-lg font-extrabold uppercase tracking-tight mb-1" style={{ color: "#1d1d1f" }}>Avec Branding — 237€</h3>
            <p className="text-sm mb-5" style={{ color: "#86868b", lineHeight: 1.65 }}>ou 3x 79€ — Votre marque clé en main</p>
            <div className="flex flex-col gap-2.5 mb-7">
              {[
                "Tout du pack sans branding +",
                "Création de logo",
                "Design packaging des 4 produits",
                "Brandboard complet",
                "3 aller-retours avec nos designers",
                "Fichiers livrés, ils sont à vous",
                "Produit supplémentaire : 49€/unité (avec branding)",
              ].map((t, i) => <CheckItem key={i} text={t} dark />)}
            </div>
          </div>
          <CtaButton label="Prendre RDV" />
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-[13px] italic" style={{ color: "#86868b", lineHeight: 1.6 }}>
          Le montant de votre Pack Échantillon est intégralement déduit si vous passez à l'une de nos offres avec site web.
        </p>
      </div>
    </motion.div>
  );
}

// ─── OFFRE SANS SITE WEB ──────────────────────────────────
function TabSansSite() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sans Design */}
        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "1px solid #e5e5e7" }}>
          <Badge label="Formule 1" />
          <div className="mt-2">
            <h3 className="text-base md:text-lg font-extrabold uppercase tracking-tight mb-1" style={{ color: "#1d1d1f" }}>Sans Design — 39€/mois</h3>
            <p className="text-sm mb-5" style={{ color: "#86868b", lineHeight: 1.65 }}>Accédez au catalogue et testez sans engagement</p>
            <div className="flex flex-col gap-2.5 mb-7">
              {[
                "Accès catalogue complet",
                "Jusqu'à 4 références produits",
                "Aucun minimum de stock imposé",
                "Étiquetage standard conforme inclus",
                "Produits certifiés bio, végan, COSMOS, Ecocert",
                "Produits facturés à l'unité (10-20€ selon la réf.)",
                "Accompagnement dans la sélection de vos produits",
                "Sans engagement, résiliable à tout moment",
              ].map((t, i) => <CheckItem key={i} text={t} />)}
            </div>
          </div>
          <CtaButton label="Explorer le catalogue" filled />
        </div>

        {/* Avec Design */}
        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "2px solid #1d1d1f" }}>
          <Badge label="Formule 2 · Recommandé" popular />
          <div className="mt-2">
            <h3 className="text-base md:text-lg font-extrabold uppercase tracking-tight mb-1" style={{ color: "#1d1d1f" }}>Avec Design — 39€/mois + 99€</h3>
            <p className="text-sm mb-1" style={{ color: "#86868b", lineHeight: 1.65 }}>Votre marque clé en main dès 138€</p>
            <p className="text-[11px] mb-5" style={{ color: "#86868b" }}>39€/mois + 99€ forfait unique design</p>
            <div className="flex flex-col gap-2.5 mb-7">
              {[
                "Tout de la Formule 1 inclus",
                "Création de logo",
                "Design packaging des 4 produits",
                "Brandboard complet",
                "3 aller-retours avec nos designers",
                "Fichiers livrés, ils sont à vous",
                "Produits facturés à l'unité (10-20€ selon la réf.)",
                "Référence produit supplémentaire : +19€ de design/produit",
              ].map((t, i) => <CheckItem key={i} text={t} dark />)}
            </div>
          </div>
          <CtaButton label="Prendre RDV" />
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-[13px] italic" style={{ color: "#86868b", lineHeight: 1.6 }}>
          Commencez sans design pour tester, ajoutez le design quand vous êtes prêt(e). Si vous avez pris le Pack Échantillon avec branding, votre design est déjà fait — passez directement en Formule 1.
        </p>
      </div>
    </motion.div>
  );
}

// ─── OFFRE AVEC SITE WEB ──────────────────────────────────
function TabAvecSite() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pack Agence */}
        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "2px solid #1d1d1f" }}>
          <Badge label="Populaire" popular />
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-1 mt-2" style={{ color: "#1d1d1f" }}>Pack Agence</h3>
          <p className="text-xs mb-4" style={{ color: "#86868b" }}>Gestion 360°</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[28px] font-extrabold" style={{ color: "#1d1d1f" }}>1 499€</span>
            <span className="text-[13px] ml-1.5" style={{ color: "#86868b" }}>frais uniques ou 999€ en 2 fois</span>
          </div>
          <div className="rounded-xl p-3 mb-5" style={{ background: "#f5f5f7", border: "1px solid #e5e5e7" }}>
            <p className="text-xs font-extrabold uppercase tracking-wide mb-0.5" style={{ color: "#1d1d1f" }}>+ Abonnement Pro inclus obligatoire</p>
            <p className="text-xl md:text-[22px] font-extrabold my-0.5" style={{ color: "#1d1d1f" }}>99€<span className="text-[13px] font-medium" style={{ color: "#86868b" }}>/mois</span></p>
            <p className="text-[11px] mt-0.5" style={{ color: "#86868b" }}>Hébergement, livraisons, SEO, support & IA inclus</p>
          </div>
          <div className="flex-1 mb-6">
            {["Création de logo", "Design Packaging", "Contenu textuel clé en main", "Photographie IA hyperréaliste", "Site e-commerce", "Indexation Google", "Automatisation livraison", "Support premium", "Expert produit dédié en votre nom", "Achat de stock pas nécessaire", "Aucune quantité min en cas d'achat de stock", "Optimisation SEO avancée", "CRO standard"].map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>

        {/* Pack IA */}
        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "1px solid #e5e5e7" }}>
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-1" style={{ color: "#1d1d1f" }}>Pack IA</h3>
          <p className="text-xs mb-4" style={{ color: "#86868b" }}>Gestion 360° + Intelligence artificielle avancée</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[28px] font-extrabold" style={{ color: "#1d1d1f" }}>2 999€</span>
            <span className="text-[13px] ml-1.5" style={{ color: "#86868b" }}>frais uniques ou 999€ en 2 fois</span>
          </div>
          <div className="rounded-xl p-3 mb-5" style={{ background: "#f5f5f7", border: "1px solid #e5e5e7" }}>
            <p className="text-xs font-extrabold uppercase tracking-wide mb-0.5" style={{ color: "#1d1d1f" }}>+ Abonnement Pro inclus obligatoire</p>
            <p className="text-xl md:text-[22px] font-extrabold my-0.5" style={{ color: "#1d1d1f" }}>199€<span className="text-[13px] font-medium" style={{ color: "#86868b" }}>/mois</span></p>
            <p className="text-[11px] mt-0.5" style={{ color: "#86868b" }}>1er mois offert · Tout le Pro + UGC IA, diagnostic IA & réseaux sociaux</p>
          </div>
          <div className="flex-1 mb-6">
            {["Création de logo", "Design Packaging", "Contenu textuel clé en main", "Photographie IA hyperréaliste", "Site e-commerce", "Indexation Google", "Automatisation livraison", "Support premium", "Expert produit dédié en votre nom", "Achat de stock pas nécessaire", "Aucune quantité min en cas d'achat de stock", "UGC IA Ultraréaliste", "Optimisation SEO avancée", "CRO standard", "Expert produit dédié", "Diagnostic intelligent par IA", "Recommandations produits par IA", "Gestion réseaux sociaux 1 mois"].map((f, i) => <CheckItem key={i} text={f} dark />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── ABONNEMENT MENSUEL ───────────────────────────────────
function TabAbonnement() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Abonnement Pro */}
        <div className="rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "1px solid #e5e5e7" }}>
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-2" style={{ color: "#1d1d1f" }}>Abonnement Pro</h3>
          <p className="text-[13px] mb-4" style={{ color: "#86868b", lineHeight: 1.6 }}>Accompagnement personnalisé et outils marketing pour booster votre croissance.</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[32px] font-extrabold" style={{ color: "#1d1d1f" }}>99€</span>
            <span className="text-[13px] ml-1.5" style={{ color: "#86868b" }}>/mois</span>
          </div>
          <p className="text-xs font-semibold mb-5" style={{ color: "#86868b" }}>1er mois offert avec un pack</p>
          <p className="text-xs font-bold mb-3" style={{ color: "#1d1d1f" }}>Ce qui est inclus :</p>
          <div className="flex-1 mb-6">
            {["Gestion e-commerce complète", "Support dédié", "Gestion de la sécurité du site web", "Serveur dédié & hébergement inclus", "Certificat SSL inclus", "Sauvegardes automatiques", "Optimisation SEO de base", "Nom de domaine inclus", "Configuration email pro", "Gestion des livraisons de vos produits", "Chat en ligne IA intégré", "Diagnostic intelligent par IA", "Recommandations produits par IA", "Achat de stock en plusieurs fois", "Configuration solution de paiement en x fois"].map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>

        {/* Abonnement IA */}
        <div className="rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "1px solid #e5e5e7" }}>
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-2" style={{ color: "#1d1d1f" }}>Abonnement IA</h3>
          <p className="text-[13px] mb-4" style={{ color: "#86868b", lineHeight: 1.6 }}>Des visuels professionnels générés par IA pour sublimer votre marque.</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[32px] font-extrabold" style={{ color: "#1d1d1f" }}>99€</span>
            <span className="text-[13px] ml-1.5" style={{ color: "#86868b" }}>/mois</span>
          </div>
          <p className="text-xs font-semibold mb-5" style={{ color: "#86868b" }}>Sans engagement</p>
          <p className="text-xs font-bold mb-3" style={{ color: "#1d1d1f" }}>Ce qui est inclus :</p>
          <div className="flex-1 mb-6">
            {["Toutes les prestations de l'abonnement Pro", "Photos UGC authentiques", "Photos lifestyle immersives", "Photos studio professionnelles", "Minimum 6 photos", "Retouches 2 allers et retour", "Chat en ligne IA intégré", "Diagnostic intelligent par IA", "Recommandations produits par IA", "Achat de stock en plusieurs fois", "Configuration solution de paiement en x fois"].map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Marketing + CRO */}
        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "2px solid #1d1d1f" }}>
          <Badge label="Recommandé" popular />
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-2 mt-2" style={{ color: "#1d1d1f" }}>Marketing + CRO</h3>
          <p className="text-[13px] mb-4" style={{ color: "#86868b", lineHeight: 1.6 }}>Boostez vos ventes avec une stratégie marketing complète et l'optimisation de vos conversions.</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[32px] font-extrabold" style={{ color: "#1d1d1f" }}>699€</span>
            <span className="text-[13px] ml-1.5" style={{ color: "#86868b" }}>/mois</span>
          </div>
          <p className="text-xs font-semibold mb-5" style={{ color: "#86868b" }}>Engagement flexible</p>
          <p className="text-xs font-bold mb-3" style={{ color: "#1d1d1f" }}>Ce qui est inclus :</p>
          <div className="flex-1 mb-6">
            {["Création & optimisation publicités Meta", "Publicités TikTok Ads", "Media Buying stratégique", "Optimisation des conversions (CRO)", "A/B testing pages & tunnels", "Référencement naturel (SEO)", "Suivi des performances publicitaires", "Conseil stratégique mensuel", "Rapports détaillés & ROI", "Support prioritaire dédié"].map((f, i) => <CheckItem key={i} text={f} dark />)}
          </div>
          <CtaButton label="Prendre RDV" filled />
        </div>

        {/* Community Manager */}
        <div className="rounded-2xl p-5 md:p-7 flex flex-col" style={{ border: "1px solid #e5e5e7" }}>
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-2" style={{ color: "#1d1d1f" }}>Community Manager</h3>
          <p className="text-[13px] mb-4" style={{ color: "#86868b", lineHeight: 1.6 }}>Déléguez la gestion de vos réseaux sociaux à nos experts.</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[32px] font-extrabold" style={{ color: "#1d1d1f" }}>699€</span>
            <span className="text-[13px] ml-1" style={{ color: "#86868b" }}>/mois</span>
          </div>
          <p className="text-xs font-semibold mb-5" style={{ color: "#86868b" }}>Engagement flexible</p>
          <p className="text-xs font-bold mb-3" style={{ color: "#1d1d1f" }}>Ce qui est inclus :</p>
          <div className="flex-1 mb-6">
            {["Gestion Instagram & Facebook", "Gestion TikTok", "Gestion Pinterest", "Calendrier éditorial mensuel", "Création de contenu (posts & stories)", "Modération & engagement communauté", "Rapports de performance mensuels", "Support dédié"].map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────
export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("decouverte");

  const tabs: { key: Tab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    { key: "decouverte", label: "Pack Échantillon", shortLabel: "Échantillon", icon: <Package size={13} strokeWidth={1.8} /> },
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
            className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 text-[10px] md:text-[11px] font-bold tracking-wide uppercase cursor-pointer transition-all duration-150"
            style={{
              borderRadius: 50,
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
        style={{ background: "#fff", border: "1px solid #f0f0f0" }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "decouverte" && <TabDecouverte key="decouverte" />}
          {activeTab === "sans-site" && <TabSansSite key="sans-site" />}
          {activeTab === "avec-site" && <TabAvecSite key="avec-site" />}
          {activeTab === "abonnement" && <TabAbonnement key="abonnement" />}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center mt-7">
        <p className="text-xs" style={{ color: "#86868b" }}>
          Des questions ? Contactez-nous à{" "}
          <a href="mailto:hello@biolystes.com" style={{ color: "#1d1d1f", fontWeight: 600, textDecoration: "none" }}>hello@biolystes.com</a>
        </p>
      </motion.div>
    </>
  );
}
