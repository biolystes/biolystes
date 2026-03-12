import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Info } from "lucide-react";
import SafeVideo from "@/components/SafeVideo";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const RDV_URL = "https://app.iclosed.io/e/paylystes/r2";
const RDV_AI_URL = "https://www.cal.eu/lystes/30min?overlayCalendar=true";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <Check size={14} strokeWidth={2} className="flex-shrink-0 mt-0.5 text-muted-foreground" />
      <span className="text-[13px] leading-relaxed text-muted-foreground">{text}</span>
    </div>
  );
}

function BonASavoir({ text }: { text: string }) {
  return (
    <div className="rounded-2xl px-6 py-5 text-center bg-secondary border border-border mt-5">
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <Info size={14} strokeWidth={1.8} className="text-muted-foreground" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Bon à savoir</span>
      </div>
      <p className="text-[13px] leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function PackCard({
  badge, title, subtitle, price, priceLabel, oldPrice, monthlyBlock, features, cta, ctaUrl, highlighted = false,
}: {
  badge?: string;
  title: string;
  subtitle: string;
  price: string;
  priceLabel: string;
  oldPrice?: string;
  monthlyBlock?: { price: string; label: string; note?: string };
  features: string[];
  cta: string;
  ctaUrl: string;
  highlighted?: boolean;
}) {
  return (
    <div className={`relative rounded-2xl p-7 md:p-9 flex flex-col ${highlighted ? "border-2 border-foreground" : "border border-border"}`}>
      {badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-foreground text-background">
          {badge}
        </div>
      )}
      <h3 className="text-base font-extrabold uppercase tracking-tight mb-0.5 mt-2 text-foreground">{title}</h3>
      <p className="text-xs mb-5 text-muted-foreground">{subtitle}</p>
      <div className="mb-2">
        <span className="text-3xl md:text-[34px] font-extrabold text-foreground tracking-tight">{price}</span>
        <span className="text-[13px] ml-2 text-muted-foreground">{priceLabel}</span>
        {oldPrice && <span className="text-[13px] ml-2 line-through text-muted-foreground">{oldPrice}</span>}
      </div>
      {monthlyBlock && (
        <div className="rounded-xl p-4 mb-7 bg-muted/50 border border-border">
          <p className="text-xs font-extrabold uppercase tracking-wide mb-0.5 text-foreground">+ Abonnement Pro inclus obligatoire</p>
          <p className="text-2xl font-extrabold my-0.5 text-foreground">{monthlyBlock.price}<span className="text-[13px] font-medium text-muted-foreground">/mois</span></p>
          {monthlyBlock.note && <p className="text-[11px] mt-0.5 text-muted-foreground">{monthlyBlock.note}</p>}
        </div>
      )}
      <div className="flex flex-col mb-8 flex-1">
        {features.map((f, i) => <CheckItem key={i} text={f} />)}
      </div>
      <a href={ctaUrl} target="_blank" rel="noopener noreferrer"
        className={`block w-full py-4 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase rounded-xl transition-all mt-auto ${
          highlighted
            ? "bg-foreground text-background border-2 border-foreground hover:opacity-90"
            : "bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background"
        }`}>
        {cta}
      </a>
    </div>
  );
}

/* ── Tab Sections ── */

function CosmetiqueTab() {
  return (
    <>
      {/* Pack Découverte */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="mb-8">
        <div className="relative rounded-2xl p-7 md:p-9 flex flex-col border-2 border-foreground">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-foreground text-background">
            Pack découverte
          </div>
          <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-tight mb-1 mt-2 text-foreground">
            Testez nos produits — 147€
          </h3>
          <p className="text-sm mb-8 text-muted-foreground leading-relaxed">ou 3× 49€ — Validez la qualité avant de vous lancer</p>
          <div className="flex flex-col mb-8">
            {["4 produits échantillons", "Accompagnement personnalisé dans la sélection par nos experts", "Étiquetage standard conforme Biolystes", "Certifié Bio & Végan / COSMOS / ECOCERT / FDA", "Livraison incluse sous 7 à 8 jours"].map((t, i) => <CheckItem key={i} text={t} />)}
          </div>
          <a href={RDV_URL} target="_blank" rel="noopener noreferrer"
            className="block w-full py-4 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase rounded-xl bg-foreground text-background border-2 border-foreground hover:opacity-90 transition-opacity mt-auto">
            Commander mes échantillons
          </a>
        </div>
        <BonASavoir text="147€ déduits de toute Offre Avec Site souscrite dans les 30 jours. Votre test devient un acompte, pas une dépense." />
      </motion.div>

      {/* Pack Agence + Pack IA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <PackCard
            badge="Populaire"
            title="Pack Agence"
            subtitle="Gestion 360°"
            price="1 499€"
            priceLabel="frais uniques ou 999€ en 2 fois"
            highlighted
            monthlyBlock={{ price: "99€", label: "/mois", note: "Hébergement, livraisons, SEO, support & IA inclus" }}
            features={[
              "Création de logo", "Design Packaging", "Contenu textuel clé en main",
              "Photographie IA hyperréaliste", "Site e-commerce", "Indexation Google",
              "Automatisation livraison", "Support premium", "Expert produit dédié en votre nom",
              "Achat de stock pas nécessaire", "Aucune quantité min en cas d'achat de stock",
              "Optimisation SEO avancée", "CRO standard",
            ]}
            cta="Prendre RDV"
            ctaUrl={RDV_URL}
          />
          <BonASavoir text="Vous avez commandé un Pack Échantillon ? Vos 147€ sont déduits de la mise en place." />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
          <PackCard
            title="Pack IA"
            subtitle="Gestion 360° + Intelligence artificielle avancée"
            price="2 999€"
            priceLabel="frais uniques ou 999€ en 2 fois"
            monthlyBlock={{ price: "149€", label: "/mois", note: "1er mois offert · Tout le Pro + UGC IA, diagnostic IA & réseaux sociaux" }}
            features={[
              "Création de logo", "Design Packaging", "Contenu textuel clé en main",
              "Photographie IA hyperréaliste", "Site e-commerce", "Indexation Google",
              "Automatisation livraison", "Support premium", "Expert produit dédié en votre nom",
              "Achat de stock pas nécessaire", "Aucune quantité min en cas d'achat de stock",
              "UGC IA Ultraréaliste", "Optimisation SEO avancée", "CRO standard",
              "Expert produit dédié", "Diagnostic intelligent par IA (Option)",
              "Recommandations produits par IA", "Gestion réseaux sociaux 1 mois",
            ]}
            cta="Prendre RDV"
            ctaUrl={RDV_URL}
          />
          <BonASavoir text="Vous avez commandé un Pack Échantillon ? Vos 147€ sont déduits de la mise en place." />
        </motion.div>
      </div>
    </>
  );
}

function CommunicationTab() {
  return (
    <>
      <p className="text-center text-sm text-muted-foreground mb-10 max-w-lg mx-auto">
        Pour les marques qui ont déjà un laboratoire et souhaitent booster leur communication.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
          <PackCard
            badge="Populaire"
            title="Pack Visibilité"
            subtitle="Réseaux sociaux + contenu"
            price="499€"
            priceLabel="HT/mois"
            oldPrice="699€ HT/mois"
            highlighted
            features={[
              "12 publications/mois", "Calendrier éditorial", "Création de visuels",
              "Photos IA produits", "Captions & hashtags optimisés", "Community management",
              "Rapport mensuel", "SEO fiches produits",
            ]}
            cta="Prendre RDV"
            ctaUrl={RDV_URL}
          />
          <BonASavoir text="Client Biolystes ? Bénéficiez de -20% sur tous nos forfaits communication." />
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
          <PackCard
            title="Pack Accélération"
            subtitle="Visibilité + Publicité + Influence"
            price="999€"
            priceLabel="HT/mois"
            oldPrice="1 499€ HT/mois"
            features={[
              "Tout le Pack Visibilité", "20 publications/mois", "Meta Ads (création & pilotage)",
              "Visuels publicitaires", "A/B testing des campagnes", "1 campagne influence/mois",
              "UGC IA ultraréaliste", "Retargeting", "2 articles blog SEO/mois",
              "Rapport mensuel détaillé", "Community management avancé",
            ]}
            cta="Prendre RDV"
            ctaUrl={RDV_URL}
          />
          <BonASavoir text="Le budget publicitaire (dépenses Meta/Google) n'est pas inclus dans le forfait." />
        </motion.div>
      </div>
    </>
  );
}

function LystesAiTab() {
  return (
    <>
      <p className="text-center text-sm text-muted-foreground mb-10 max-w-lg mx-auto">
        Compatible Shopify & WooCommerce — pour les marques qui ont déjà leur boutique en ligne.
      </p>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="max-w-md mx-auto">
        <PackCard
          badge="Offre IA"
          title="Lystes AI"
          subtitle="Écosystème IA complet pour votre e-commerce"
          price="999€"
          priceLabel="HT — frais de setup"
          highlighted
          monthlyBlock={{ price: "99€", label: "/mois", note: "Agents IA, diagnostic, photos, UGC, SEO, analytics — tout inclus" }}
          features={[
            "Agents conversationnels sur chaque fiche produit",
            "Diagnostic peau & cheveux intelligent",
            "Photos produits IA niveau studio",
            "Contenu UGC généré automatiquement",
            "SEO optimisé en continu",
            "Plan marketing piloté par la data",
            "Analytics basés sur les conversations clients",
            "Support multilingue 100+ langues",
            "Déploiement en 20 minutes",
          ]}
          cta="Prendre RDV"
          ctaUrl={RDV_AI_URL}
        />
        <BonASavoir text="Client Biolystes ? Bénéficiez de -20% sur les frais de setup." />
      </motion.div>
    </>
  );
}

function AbonnementsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        {
          title: "Marketing + CRO",
          desc: "Boostez vos ventes avec une stratégie marketing complète et l'optimisation de vos conversions.",
          price: "699€",
          sub: "Engagement flexible",
          recommended: true,
          features: [
            "Création & optimisation publicités Meta", "Publicités TikTok Ads",
            "Media Buying stratégique", "Optimisation des conversions (CRO)",
            "A/B testing pages & tunnels", "Référencement naturel (SEO)",
            "Suivi des performances publicitaires", "Conseil stratégique mensuel",
            "Rapports détaillés & ROI", "Support prioritaire dédié",
          ],
        },
        {
          title: "Community Manager",
          desc: "Déléguez la gestion de vos réseaux sociaux à nos experts.",
          price: "699€",
          sub: "Engagement flexible",
          recommended: false,
          features: [
            "Gestion Instagram & Facebook", "Gestion TikTok", "Gestion Pinterest",
            "Calendrier éditorial mensuel", "Création de contenu (posts & stories)",
            "Modération & engagement communauté", "Rapports de performance mensuels", "Support dédié",
          ],
        },
      ].map((item, idx) => (
        <motion.div key={item.title} initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} custom={idx}
          className="flex flex-col">
          <div className={`relative rounded-2xl p-7 md:p-9 flex flex-col flex-1 ${
            item.recommended ? "border-2 border-foreground" : "border border-border"
          }`}>
            {item.recommended && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-foreground text-background">
                Recommandé
              </div>
            )}
            <h3 className="text-base font-extrabold uppercase tracking-tight mb-2 mt-1 text-foreground">{item.title}</h3>
            <p className="text-[13px] mb-4 text-muted-foreground leading-relaxed">{item.desc}</p>
            <div className="mb-1">
              <span className="text-2xl md:text-[32px] font-extrabold text-foreground">{item.price}</span>
              <span className="text-[13px] ml-1.5 text-muted-foreground">/mois</span>
            </div>
            <p className="text-xs font-semibold mb-6 text-muted-foreground">{item.sub}</p>
            <div className="flex flex-col mb-8 flex-1">
              {item.features.map((f, i) => <CheckItem key={i} text={f} />)}
            </div>
            <a href={RDV_URL} target="_blank" rel="noopener noreferrer"
              className={`block w-full py-4 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase rounded-xl transition-all mt-auto ${
                item.recommended
                  ? "bg-foreground text-background border-2 border-foreground hover:opacity-90"
                  : "bg-background text-foreground border-2 border-foreground hover:bg-foreground hover:text-background"
              }`}>
              Prendre RDV
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function TarifsPage() {
  return (
    <>
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12 mt-4 md:mt-[90px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-[42px] font-extrabold uppercase leading-tight tracking-tight mb-3 text-foreground">
              Tous nos tarifs<br className="hidden md:block" /><span className="md:hidden"> </span>au même endroit
            </h1>
            <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed max-w-xl mx-auto md:mx-0">
              Cosmétique, communication ou intelligence artificielle — trouvez l'offre qui correspond à votre ambition.
            </p>
          </div>
          <div className="hidden md:block">
            <SafeVideo
              src="/videos/hero-kaniwa.mp4"
              className="rounded-2xl object-cover w-full h-auto"
              lazy
            />
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="cosmetique" className="w-full mb-20">
        <TabsList className="w-full flex flex-wrap justify-center gap-1 bg-transparent h-auto mb-10">
          <TabsTrigger value="cosmetique" className="text-xs md:text-sm font-bold uppercase tracking-wide px-5 py-2.5 rounded-full border border-border data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-foreground transition-all">
            Cosmétique
          </TabsTrigger>
          <TabsTrigger value="communication" className="text-xs md:text-sm font-bold uppercase tracking-wide px-5 py-2.5 rounded-full border border-border data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-foreground transition-all">
            Communication
          </TabsTrigger>
          <TabsTrigger value="lystes-ai" className="text-xs md:text-sm font-bold uppercase tracking-wide px-5 py-2.5 rounded-full border border-border data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-foreground transition-all">
            Lystes AI
          </TabsTrigger>
          <TabsTrigger value="abonnements" className="text-xs md:text-sm font-bold uppercase tracking-wide px-5 py-2.5 rounded-full border border-border data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=active]:border-foreground transition-all">
            Abonnements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cosmetique"><CosmetiqueTab /></TabsContent>
        <TabsContent value="communication"><CommunicationTab /></TabsContent>
        <TabsContent value="lystes-ai"><LystesAiTab /></TabsContent>
        <TabsContent value="abonnements"><AbonnementsTab /></TabsContent>
      </Tabs>

      {/* Footer CTA */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="text-center mt-8 mb-4">
        <p className="text-xs text-muted-foreground">
          Des questions ? Contactez-nous à{" "}
          <a href="mailto:hello@biolystes.com" className="text-foreground font-semibold no-underline">hello@biolystes.com</a>
        </p>
      </motion.div>
    </>
  );
}
