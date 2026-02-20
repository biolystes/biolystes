import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Globe, CreditCard } from "lucide-react";

// ─── Types ────────────────────────────────────────────────
type Tab = "sans-site" | "avec-site" | "abonnement";

// ─── Check icon ───────────────────────────────────────────
function CheckItem({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#86868b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span style={{ fontSize: 13, color: "#424245", lineHeight: 1.5 }}>{text}</span>
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────
function Badge({ label }: { label: string }) {
  return (
    <div style={{
      position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
      background: "#1d1d1f", color: "#fff", fontSize: 10, fontWeight: 700,
      letterSpacing: "1.2px", padding: "5px 14px", borderRadius: 20,
      textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
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
      style={{
        display: "block", width: "100%", padding: "14px",
        textAlign: "center", textDecoration: "none",
        fontSize: 11, fontWeight: 800, letterSpacing: "1.5px",
        textTransform: "uppercase",
        background: filled ? "#1d1d1f" : "transparent",
        color: filled ? "#fff" : "#1d1d1f",
        border: "1.5px solid #1d1d1f",
        borderRadius: 8, cursor: "pointer",
        transition: "all .15s",
        marginTop: "auto",
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
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Option 1 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: "#86868b", textTransform: "uppercase", background: "#ebebed", padding: "4px 12px", borderRadius: 20, alignSelf: "flex-start" }}>Option 1</span>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1d1d1f", textTransform: "uppercase", letterSpacing: ".3px", marginBottom: 8 }}>Offre sans site à 39€/mois</h3>
            <p style={{ fontSize: 14, color: "#86868b", lineHeight: 1.65, marginBottom: 20 }}>
              Accéder à notre catalogue de produits bio et végane certifié cosmo-ecocert, fda
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {[
                { icon: "⚡", text: "Produits disponibles en quelques jours !" },
                { icon: "🛡", text: "Zéro Risque : Pas de minimum de stock." },
                { icon: "🏅", text: "Qualité Garantie : Produits certifiés." },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: "#424245", lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <CtaButton label="Explorer le catalogue" filled />
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: "#f0f0f0", position: "absolute", left: "50%", top: 0, bottom: 0 }} />

        {/* Option 2 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", color: "#86868b", textTransform: "uppercase", background: "#ebebed", padding: "4px 12px", borderRadius: 20, alignSelf: "flex-start" }}>Option 2</span>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1d1d1f", textTransform: "uppercase", letterSpacing: ".3px", marginBottom: 8 }}>Design Packaging 79€</h3>
            <p style={{ fontSize: 14, color: "#86868b", lineHeight: 1.65, marginBottom: 20 }}>
              Pour les visionnaires désirant une image premium, un logo, un brandboard. Nos experts vous accompagnent.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
              {[
                { icon: "🔬", text: "Compréhension de vos attentes et votre cible" },
                { icon: "🎨", text: "Design adapté à votre positionnement" },
                { icon: "👥", text: "Accompagnement Expert 3 aller-retour" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, color: "#424245", lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <CtaButton label="Demander un devis" />
        </div>
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Pack Agence */}
        <div style={{ position: "relative", border: "2px solid #1d1d1f", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column" }}>
          <Badge label="Populaire" />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1d1d1f", textTransform: "uppercase", letterSpacing: ".3px", marginBottom: 4 }}>Pack Agence</h3>
          <p style={{ fontSize: 12, color: "#86868b", marginBottom: 16 }}>Gestion 360°</p>

          {/* Prix frais uniques */}
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#1d1d1f" }}>1 499€</span>
            <span style={{ fontSize: 13, color: "#86868b", marginLeft: 6 }}>frais uniques ou 999€ en 2 fois</span>
          </div>

          {/* Abonnement obligatoire — bien visible */}
          <div style={{
            background: "#f5f5f7", borderRadius: 10, padding: "10px 14px",
            marginBottom: 20, border: "1px solid #e5e5e7"
          }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#1d1d1f", marginBottom: 2, textTransform: "uppercase", letterSpacing: ".5px" }}>
              + Abonnement Pro inclus obligatoire
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#1d1d1f", margin: "2px 0" }}>
              99€<span style={{ fontSize: 13, fontWeight: 500, color: "#86868b" }}>/mois</span>
            </p>
            <p style={{ fontSize: 11, color: "#86868b", marginTop: 2 }}>
              1er mois offert · Hébergement, livraisons, SEO, support & IA inclus
            </p>
          </div>

          <div style={{ flex: 1, marginBottom: 24 }}>
            {packAgenceFeatures.map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>

        {/* Pack IA */}
        <div style={{ position: "relative", border: "1.5px solid #e5e5e7", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", background: "#fff" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1d1d1f", textTransform: "uppercase", letterSpacing: ".3px", marginBottom: 4 }}>Pack IA</h3>
          <p style={{ fontSize: 12, color: "#86868b", marginBottom: 16 }}>Gestion 360° + Intelligence artificielle avancée</p>

          {/* Prix frais uniques */}
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#1d1d1f" }}>2 999€</span>
            <span style={{ fontSize: 13, color: "#86868b", marginLeft: 6 }}>frais uniques ou 999€ en 2 fois</span>
          </div>

          {/* Abonnement obligatoire — bien visible */}
          <div style={{
            background: "#f5f5f7", borderRadius: 10, padding: "10px 14px",
            marginBottom: 20, border: "1px solid #e5e5e7"
          }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: "#1d1d1f", marginBottom: 2, textTransform: "uppercase", letterSpacing: ".5px" }}>
              + Abonnement Pro inclus obligatoire
            </p>
            <p style={{ fontSize: 22, fontWeight: 800, color: "#1d1d1f", margin: "2px 0" }}>
              199€<span style={{ fontSize: 13, fontWeight: 500, color: "#86868b" }}>/mois</span>
            </p>
            <p style={{ fontSize: 11, color: "#86868b", marginTop: 2 }}>
              1er mois offert · Tout le Pro + UGC IA, diagnostic IA & réseaux sociaux
            </p>
          </div>

          <div style={{ flex: 1, marginBottom: 24 }}>
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
      style={{ display: "flex", flexDirection: "column", gap: 24 }}
    >
      {/* Row 1: Abonnement Pro + Abonnement IA */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Abonnement Pro */}
        <div style={{ border: "1.5px solid #e5e5e7", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", background: "#fff" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1d1d1f", textTransform: "uppercase", letterSpacing: ".3px", marginBottom: 8 }}>Abonnement Pro</h3>
          <p style={{ fontSize: 13, color: "#86868b", lineHeight: 1.6, marginBottom: 16 }}>Accompagnement personnalisé et outils marketing pour booster votre croissance.</p>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: "#1d1d1f" }}>99€</span>
            <span style={{ fontSize: 13, color: "#86868b", marginLeft: 6 }}>/mois</span>
          </div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#86868b", marginBottom: 20 }}>1er mois offert avec un pack</p>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#1d1d1f", marginBottom: 12 }}>Ce qui est inclus :</p>
          <div style={{ flex: 1, marginBottom: 24 }}>
            {aboPro.map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>

        {/* Abonnement IA */}
        <div style={{ border: "1.5px solid #e5e5e7", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", background: "#fff" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1d1d1f", textTransform: "uppercase", letterSpacing: ".3px", marginBottom: 8 }}>Abonnement IA</h3>
          <p style={{ fontSize: 13, color: "#86868b", lineHeight: 1.6, marginBottom: 16 }}>Des visuels professionnels générés par IA pour sublimer votre marque.</p>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: "#1d1d1f" }}>99€</span>
            <span style={{ fontSize: 13, color: "#86868b", marginLeft: 6 }}>/photos</span>
          </div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#86868b", marginBottom: 20 }}>Sans engagement</p>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#1d1d1f", marginBottom: 12 }}>Ce qui est inclus :</p>
          <div style={{ flex: 1, marginBottom: 24 }}>
            {aboIA.map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>
      </div>

      {/* Row 2: Marketing CRO + Community Manager */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Marketing + CRO */}
        <div style={{ position: "relative", border: "2px solid #1d1d1f", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", background: "#fff" }}>
          <Badge label="Recommandé" />
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1d1d1f", textTransform: "uppercase", letterSpacing: ".3px", marginBottom: 8 }}>Marketing + CRO</h3>
          <p style={{ fontSize: 13, color: "#86868b", lineHeight: 1.6, marginBottom: 16 }}>Boostez vos ventes avec une stratégie marketing complète et l'optimisation de vos conversions.</p>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: "#1d1d1f" }}>699€</span>
            <span style={{ fontSize: 13, color: "#86868b", marginLeft: 6 }}>/mois</span>
          </div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#86868b", marginBottom: 20 }}>Engagement flexible</p>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#1d1d1f", marginBottom: 12 }}>Ce qui est inclus :</p>
          <div style={{ flex: 1, marginBottom: 24 }}>
            {marketingCRO.map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" filled />
        </div>

        {/* Community Manager */}
        <div style={{ border: "1.5px solid #e5e5e7", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", background: "#fff" }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1d1d1f", textTransform: "uppercase", letterSpacing: ".3px", marginBottom: 8 }}>Community Manager</h3>
          <p style={{ fontSize: 13, color: "#86868b", lineHeight: 1.6, marginBottom: 16 }}>Déléguez la gestion de vos réseaux sociaux à nos experts.</p>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: "#1d1d1f" }}>699</span>
            <span style={{ fontSize: 13, color: "#86868b", marginLeft: 4 }}>/mois</span>
          </div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#86868b", marginBottom: 20 }}>Engagement flexible</p>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#1d1d1f", marginBottom: 12 }}>Ce qui est inclus :</p>
          <div style={{ flex: 1, marginBottom: 24 }}>
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

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "sans-site", label: "Offre sans site web", icon: <Zap size={13} strokeWidth={1.8} /> },
    { key: "avec-site", label: "Offre avec site web", icon: <Globe size={13} strokeWidth={1.8} /> },
    { key: "abonnement", label: "Abonnement mensuel", icon: <CreditCard size={13} strokeWidth={1.8} /> },
  ];

  return (
    <>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, color: "#1d1d1f", lineHeight: 1.1, letterSpacing: "-1px", textTransform: "uppercase", marginBottom: 12 }}>
          Des forfaits transparents<br />et adaptés à votre ambition
        </h1>
        <p style={{ fontSize: 15, color: "#86868b", lineHeight: 1.6 }}>
          Le premier mois de l'abonnement est toujours offert !
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }} style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 40 }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "10px 20px", borderRadius: 8,
              fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
              border: "1.5px solid",
              cursor: "pointer", transition: "all .15s",
              background: activeTab === tab.key ? "#1d1d1f" : "#fff",
              color: activeTab === tab.key ? "#fff" : "#1d1d1f",
              borderColor: activeTab === tab.key ? "#1d1d1f" : "#d1d1d6",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        style={{
          background: "#fff",
          borderRadius: 20,
          border: "1px solid #f0f0f0",
          padding: 36,
          position: "relative",
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
        style={{ textAlign: "center", marginTop: 28 }}
      >
        <p style={{ fontSize: 12, color: "#86868b" }}>
          Des questions ? Contactez-nous à{" "}
          <a href="mailto:hello@biolystes.com" style={{ color: "#1d1d1f", fontWeight: 600, textDecoration: "none" }}>
            hello@biolystes.com
          </a>
        </p>
      </motion.div>
    </>
  );
}
