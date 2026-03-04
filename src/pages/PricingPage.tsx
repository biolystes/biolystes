import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Zap, Globe, CreditCard, Check, Info, ArrowRight } from "lucide-react";

const RDV_URL = "https://app.iclosed.io/e/paylystes/r2";

type Tab = "decouverte" | "sans-site" | "avec-site" | "abonnement";

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 mb-2">
      <Check size={14} strokeWidth={2.2} className="flex-shrink-0 mt-0.5 text-muted-foreground" />
      <span className="text-[13px] leading-relaxed text-muted-foreground">{text}</span>
    </div>
  );
}

function Badge({ label, popular = false }: { label: string; popular?: boolean }) {
  return (
    <div
      className={`absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
        popular ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
      }`}
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
      className={`block w-full py-3.5 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase cursor-pointer transition-all duration-150 mt-auto rounded-lg ${
        filled
          ? "bg-foreground text-background border-[1.5px] border-foreground hover:opacity-90"
          : "bg-background text-foreground border-[1.5px] border-foreground hover:bg-foreground hover:text-background"
      }`}
    >
      {label}
    </a>
  );
}

function DeductionBanner({ text }: { text: string }) {
  return (
    <div className="rounded-xl px-5 py-4 text-center mt-6" style={{ background: "#f7f7f8", border: "1px solid #ebebed" }}>
      <div className="flex items-center justify-center gap-2 mb-1">
        <Info size={14} strokeWidth={1.8} className="text-muted-foreground flex-shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Bon à savoir</span>
      </div>
      <p className="text-[12.5px] leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

// ─── PARCOURS VISUEL ──────────────────────────────────────
function StepProgress({ activeTab, onTabChange }: { activeTab: Tab; onTabChange: (t: Tab) => void }) {
  const steps: { key: Tab; step: string; label: string; price: string }[] = [
    { key: "decouverte", step: "1", label: "Je teste", price: "Dès 147€" },
    { key: "sans-site", step: "2", label: "Je vends", price: "Dès 138€" },
    { key: "avec-site", step: "3", label: "Je lance", price: "Dès 1 499€" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-0 mb-6 md:mb-8">
      {steps.map((s, i) => {
        const isActive = activeTab === s.key;
        return (
          <div key={s.key} className="flex items-center gap-0">
            <button
              onClick={() => onTabChange(s.key)}
              className={`flex flex-col items-center px-6 md:px-8 py-3.5 rounded-xl cursor-pointer transition-all duration-200 border ${
                isActive
                  ? "border-foreground bg-foreground/[0.03] font-bold"
                  : "border-transparent hover:border-border"
              }`}
            >
              <span className={`text-[11px] uppercase tracking-widest mb-0.5 ${isActive ? "text-foreground font-extrabold" : "text-muted-foreground font-semibold"}`}>
                {s.step}. {s.label}
              </span>
              <span className={`text-[12px] ${isActive ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                {s.price}
              </span>
            </button>
            {i < steps.length - 1 && (
              <ArrowRight size={14} strokeWidth={1.8} className="text-muted-foreground hidden md:block mx-1" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── PACK ÉCHANTILLON ─────────────────────────────────────
function TabDecouverte() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex flex-col items-center">
      <div className="w-full max-w-lg">
        <div className="relative rounded-2xl p-6 md:p-8 flex flex-col border-2 border-foreground">
          <Badge label="Pack découverte" popular />
          <div className="mt-3">
            <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-tight mb-1 text-foreground">Testez nos produits — 147€</h3>
            <p className="text-sm mb-6 text-muted-foreground leading-relaxed">ou 3× 49€ — Validez la qualité avant de vous lancer</p>
            <div className="flex flex-col gap-2.5 mb-7">
              {[
                "4 produits échantillons (sérum, crème, nettoyant, soin spécifique)",
                "Accompagnement personnalisé dans la sélection par nos experts",
                "Étiquetage standard conforme Biolystes",
                "Certifié Bio & Végan / COSMOS / ECOCERT / FDA",
                "Livraison incluse sous 7 à 8 jours",
              ].map((t, i) => <CheckItem key={i} text={t} />)}
            </div>
          </div>
          <CtaButton label="Commander mes échantillons" filled />
        </div>

        <DeductionBanner text="147€ déduits de toute Offre Sans Site ou Avec Site souscrite dans les 30 jours. Votre test devient un acompte, pas une dépense." />
      </div>
    </motion.div>
  );
}

// ─── OFFRE SANS SITE WEB ──────────────────────────────────
function TabSansSite() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col border border-border">
          <Badge label="Formule 1" />
          <div className="mt-2">
            <h3 className="text-base md:text-lg font-extrabold uppercase tracking-tight mb-1 text-foreground">Sans Design — 39€/mois</h3>
            <p className="text-sm mb-5 text-muted-foreground leading-relaxed">Accédez au catalogue et testez sans engagement</p>
            <div className="flex flex-col gap-2.5 mb-7">
              {[
                "Accès catalogue complet",
                "Jusqu'à 4 références produits",
                "Aucun minimum de stock imposé",
                "Mise en conformité étiquetage",
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

        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col border-2 border-foreground">
          <Badge label="Formule 2 · Recommandé" popular />
          <div className="mt-2">
            <h3 className="text-base md:text-lg font-extrabold uppercase tracking-tight mb-1 text-foreground">Avec Design — 39€/mois + 99€</h3>
            <p className="text-sm mb-1 text-muted-foreground leading-relaxed">Votre marque clé en main dès 138€</p>
            <p className="text-[11px] mb-5 text-muted-foreground">39€/mois + 99€ forfait unique design</p>
            <div className="flex flex-col gap-2.5 mb-7">
              {[
                "Tout de la Formule 1 inclus",
                "Création de logo",
                "Mise en conformité étiquetage",
                "Design packaging des 4 produits",
                "Brandboard complet",
                "3 aller-retours avec nos designers",
                "Fichiers livrés, ils sont à vous",
                "Produits facturés à l'unité (10-20€ selon la réf.)",
                "Référence produit supplémentaire : +19€ de design/produit",
              ].map((t, i) => <CheckItem key={i} text={t} />)}
            </div>
          </div>
          <CtaButton label="Prendre RDV" />
        </div>
      </div>

      <DeductionBanner text="Vous avez commandé un Pack Échantillon ? Vos 147€ sont déduits du forfait design (99€ offerts + 48€ déduits du 1er mois)." />
    </motion.div>
  );
}

// ─── OFFRE AVEC SITE WEB ──────────────────────────────────
function TabAvecSite() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col border-2 border-foreground">
          <Badge label="Populaire" popular />
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-1 mt-2 text-foreground">Pack Agence</h3>
          <p className="text-xs mb-4 text-muted-foreground">Gestion 360°</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[28px] font-extrabold text-foreground">1 499€</span>
            <span className="text-[13px] ml-1.5 text-muted-foreground">frais uniques ou 999€ en 2 fois</span>
          </div>
          <div className="rounded-xl p-3 mb-5 bg-muted/50 border border-border">
            <p className="text-xs font-extrabold uppercase tracking-wide mb-0.5 text-foreground">+ Abonnement Pro inclus obligatoire</p>
            <p className="text-xl md:text-[22px] font-extrabold my-0.5 text-foreground">99€<span className="text-[13px] font-medium text-muted-foreground">/mois</span></p>
            <p className="text-[11px] mt-0.5 text-muted-foreground">Hébergement, livraisons, SEO, support & IA inclus</p>
          </div>
          <div className="flex-1 mb-6">
            {["Création de logo", "Design Packaging", "Contenu textuel clé en main", "Photographie IA hyperréaliste", "Site e-commerce", "Indexation Google", "Automatisation livraison", "Support premium", "Expert produit dédié en votre nom", "Achat de stock pas nécessaire", "Aucune quantité min en cas d'achat de stock", "Optimisation SEO avancée", "CRO standard"].map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>

        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col border border-border">
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-1 text-foreground">Pack IA</h3>
          <p className="text-xs mb-4 text-muted-foreground">Gestion 360° + Intelligence artificielle avancée</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[28px] font-extrabold text-foreground">2 999€</span>
            <span className="text-[13px] ml-1.5 text-muted-foreground">frais uniques ou 999€ en 2 fois</span>
          </div>
          <div className="rounded-xl p-3 mb-5 bg-muted/50 border border-border">
            <p className="text-xs font-extrabold uppercase tracking-wide mb-0.5 text-foreground">+ Abonnement Pro inclus obligatoire</p>
            <p className="text-xl md:text-[22px] font-extrabold my-0.5 text-foreground">199€<span className="text-[13px] font-medium text-muted-foreground">/mois</span></p>
            <p className="text-[11px] mt-0.5 text-muted-foreground">1er mois offert · Tout le Pro + UGC IA, diagnostic IA & réseaux sociaux</p>
          </div>
          <div className="flex-1 mb-6">
            {["Création de logo", "Design Packaging", "Contenu textuel clé en main", "Photographie IA hyperréaliste", "Site e-commerce", "Indexation Google", "Automatisation livraison", "Support premium", "Expert produit dédié en votre nom", "Achat de stock pas nécessaire", "Aucune quantité min en cas d'achat de stock", "UGC IA Ultraréaliste", "Optimisation SEO avancée", "CRO standard", "Expert produit dédié", "Diagnostic intelligent par IA", "Recommandations produits par IA", "Gestion réseaux sociaux 1 mois"].map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>
      </div>

      <DeductionBanner text="Vous avez commandé un Pack Échantillon ? Vos 147€ sont déduits de la mise en place." />
    </motion.div>
  );
}

// ─── ABONNEMENT MENSUEL ───────────────────────────────────
function TabAbonnement() {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-5 md:p-7 flex flex-col border border-border">
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-2 text-foreground">Abonnement Pro</h3>
          <p className="text-[13px] mb-4 text-muted-foreground leading-relaxed">Accompagnement personnalisé et outils marketing pour booster votre croissance.</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[32px] font-extrabold text-foreground">99€</span>
            <span className="text-[13px] ml-1.5 text-muted-foreground">/mois</span>
          </div>
          <p className="text-xs font-semibold mb-5 text-muted-foreground">1er mois offert avec un pack</p>
          <p className="text-xs font-bold mb-3 text-foreground">Ce qui est inclus :</p>
          <div className="flex-1 mb-6">
            {["Gestion e-commerce complète", "Support dédié", "Gestion de la sécurité du site web", "Serveur dédié & hébergement inclus", "Certificat SSL inclus", "Sauvegardes automatiques", "Optimisation SEO de base", "Nom de domaine inclus", "Configuration email pro", "Gestion des livraisons de vos produits", "Chat en ligne IA intégré", "Diagnostic intelligent par IA", "Recommandations produits par IA", "Achat de stock en plusieurs fois", "Configuration solution de paiement en x fois"].map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>

        <div className="rounded-2xl p-5 md:p-7 flex flex-col border border-border">
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-2 text-foreground">Abonnement IA</h3>
          <p className="text-[13px] mb-4 text-muted-foreground leading-relaxed">Des visuels professionnels générés par IA pour sublimer votre marque.</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[32px] font-extrabold text-foreground">99€</span>
            <span className="text-[13px] ml-1.5 text-muted-foreground">/mois</span>
          </div>
          <p className="text-xs font-semibold mb-5 text-muted-foreground">Sans engagement</p>
          <p className="text-xs font-bold mb-3 text-foreground">Ce qui est inclus :</p>
          <div className="flex-1 mb-6">
            {["Toutes les prestations de l'abonnement Pro", "Photos UGC authentiques", "Photos lifestyle immersives", "Photos studio professionnelles", "Minimum 6 photos", "Retouches 2 allers et retour", "Chat en ligne IA intégré", "Diagnostic intelligent par IA", "Recommandations produits par IA", "Achat de stock en plusieurs fois", "Configuration solution de paiement en x fois"].map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative rounded-2xl p-5 md:p-7 flex flex-col border-2 border-foreground">
          <Badge label="Recommandé" popular />
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-2 mt-2 text-foreground">Marketing + CRO</h3>
          <p className="text-[13px] mb-4 text-muted-foreground leading-relaxed">Boostez vos ventes avec une stratégie marketing complète et l'optimisation de vos conversions.</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[32px] font-extrabold text-foreground">699€</span>
            <span className="text-[13px] ml-1.5 text-muted-foreground">/mois</span>
          </div>
          <p className="text-xs font-semibold mb-5 text-muted-foreground">Engagement flexible</p>
          <p className="text-xs font-bold mb-3 text-foreground">Ce qui est inclus :</p>
          <div className="flex-1 mb-6">
            {["Création & optimisation publicités Meta", "Publicités TikTok Ads", "Media Buying stratégique", "Optimisation des conversions (CRO)", "A/B testing pages & tunnels", "Référencement naturel (SEO)", "Suivi des performances publicitaires", "Conseil stratégique mensuel", "Rapports détaillés & ROI", "Support prioritaire dédié"].map((f, i) => <CheckItem key={i} text={f} />)}
          </div>
          <CtaButton label="Prendre RDV" filled />
        </div>

        <div className="rounded-2xl p-5 md:p-7 flex flex-col border border-border">
          <h3 className="text-base font-extrabold uppercase tracking-tight mb-2 text-foreground">Community Manager</h3>
          <p className="text-[13px] mb-4 text-muted-foreground leading-relaxed">Déléguez la gestion de vos réseaux sociaux à nos experts.</p>
          <div className="mb-1">
            <span className="text-2xl md:text-[32px] font-extrabold text-foreground">699€</span>
            <span className="text-[13px] ml-1 text-muted-foreground">/mois</span>
          </div>
          <p className="text-xs font-semibold mb-5 text-muted-foreground">Engagement flexible</p>
          <p className="text-xs font-bold mb-3 text-foreground">Ce qui est inclus :</p>
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
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-6 md:mb-8 text-center mt-4 md:mt-[90px]">
        <h1 className="text-2xl md:text-[42px] font-extrabold uppercase leading-tight tracking-tight mb-3 text-foreground">
          Des forfaits transparents<br className="hidden md:block" /><span className="md:hidden"> </span>et adaptés à votre ambition
        </h1>
        <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">
          Le premier mois de l'abonnement est toujours offert !
        </p>
      </motion.div>

      {/* Parcours visuel */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, duration: 0.3 }}>
        <StepProgress activeTab={activeTab} onTabChange={setActiveTab} />
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.35 }} className="flex justify-center gap-2 mb-8 md:mb-10 flex-wrap">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 text-[10px] md:text-[11px] font-bold tracking-wide uppercase cursor-pointer transition-all duration-150 rounded-full border-[1.5px] ${
              activeTab === tab.key
                ? "bg-foreground text-background border-foreground"
                : "bg-background text-foreground border-border"
            }`}
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
        className="rounded-2xl md:rounded-[20px] p-4 md:p-9 relative bg-background border border-border/50"
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
        <p className="text-xs text-muted-foreground">
          Des questions ? Contactez-nous à{" "}
          <a href="mailto:hello@biolystes.com" className="text-foreground font-semibold no-underline">hello@biolystes.com</a>
        </p>
      </motion.div>
    </>
  );
}
