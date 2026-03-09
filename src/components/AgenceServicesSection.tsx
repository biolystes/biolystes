import { motion } from "framer-motion";
import SafeVideo from "@/components/SafeVideo";
import {
  Star, StarHalf, Menu, Search, User, ShoppingBag,
  Check, Sparkles, Play,
} from "lucide-react";
import kaniwaUgc2 from "@/assets/kaniwa-ugc-2.jpg";
import agenceReseaux from "@/assets/agence-reseaux.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ═══ HERO ═══ */
function ServicesHero() {
  return (
    <div className="text-center max-w-5xl mx-auto px-6 pt-24 pb-12">
      <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        className="text-[10px] font-bold tracking-[2.5px] uppercase text-white/50 mb-5">
        Nos services
      </motion.p>
      <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
        className="text-3xl md:text-4xl font-light tracking-tight max-w-[780px] mx-auto mb-6 text-white">
        Qu'est-ce qu'on fait concrètement pour<br /><em className="italic">votre marque ?</em>
      </motion.h2>
      <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
        className="text-[17px] text-white/50 leading-[1.7] max-w-[600px] mx-auto">
        Une agence de communication complète, spécialisée dans la cosmétique bio. Voici nos <strong className="text-white">6 pôles d'expertise</strong> qui travaillent pour vous.
      </motion.p>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
        className="grid grid-cols-3 max-w-xl mx-auto pt-14 pb-6 divide-x divide-white/20">
        {[
          { num: "6", label: "Pôles d'expertise" },
          { num: "100+", label: "Marques accompagnées" },
          { num: "80%", label: "Économie vs agence" },
        ].map((s) => (
          <div key={s.label} className="text-center px-4 md:px-8">
            <div className="text-2xl md:text-3xl font-light leading-none text-white tracking-tight italic">{s.num}</div>
            <div className="text-[10px] text-white/50 font-semibold mt-3 uppercase tracking-[0.15em] whitespace-nowrap">{s.label}</div>
          </div>
        ))}
      </motion.div>

    </div>
  );
}

/* ═══ SHARED TEAM ROW ═══ */
function TeamRow({ bg, reversed, title, kicker, desc, children }: {
  bg: string; reversed?: boolean; title: string; kicker: string; desc: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} custom={0}
      className={`${bg} py-14 md:py-20`}>
      <div className={`max-w-5xl mx-auto px-6 flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12`}>
        <div className="flex-1 min-w-[260px]">
          <span className="inline-block bg-foreground text-primary-foreground text-[10px] font-bold tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-5">
            {kicker}
          </span>
          <h3 className="text-[30px] font-light leading-[1.25] text-foreground mb-3.5">{title}</h3>
          <p className="text-[15px] text-muted-foreground leading-[1.7]">{desc}</p>
        </div>
        <div className="flex-[1.5] min-w-[300px] w-full">
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══ 1. RÉSEAUX SOCIAUX ═══ */
function BlocReseauxSociaux() {
  return (
    <TeamRow bg="bg-background" title="Gestion de vos réseaux sociaux" kicker="Réseaux sociaux"
      desc="On prend en main vos comptes Instagram, TikTok et Facebook. Calendrier éditorial, rédaction des publications, gestion de la communauté et analyse des performances. Vous n'avez plus qu'à valider.">
      <img src={agenceReseaux} alt="Gestion réseaux sociaux" className="w-full h-[400px] object-cover rounded-2xl" />
    </TeamRow>
  );
}

/* ═══ 2. PUBLICITÉ DIGITALE ═══ */
function BlocPublicite() {
  return (
    <TeamRow bg="bg-secondary" reversed title="Création de site ecommerce" kicker="Site web & E-commerce"
      desc="On conçoit votre boutique en ligne de A à Z : design sur-mesure, fiches produits optimisées, tunnel de vente performant et intégration des moyens de paiement. Un site qui convertit, pensé pour la cosmétique.">
      <div className="flex justify-center">
        <div className="w-[320px] bg-background rounded-[2rem] overflow-hidden border border-border">
          <div className="flex items-center justify-between px-5 pt-7 pb-3.5 border-b border-border">
            <div className="flex items-center gap-3">
              <Menu className="w-4 h-4 text-foreground" />
              <Search className="w-4 h-4 text-foreground" />
            </div>
            <div className="font-serif font-bold text-xl tracking-wide text-foreground">Kaniwa</div>
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-foreground" />
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-foreground" />
                <span className="absolute -top-1 -right-1 bg-foreground text-primary-foreground text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">1</span>
              </div>
            </div>
          </div>
          <div className="bg-foreground text-primary-foreground text-center text-[9px] font-semibold tracking-[2px] uppercase py-1.5">
            Livraison gratuite aujourd'hui
          </div>
          <img src="https://lystes.ai/images/clients/kaniwa-6.jpg" alt="" className="w-full h-[200px] object-cover" />
          <div className="px-4 pt-3.5 pb-2">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex text-foreground text-xs">
                {[...Array(4)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                <StarHalf className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="text-xs font-bold text-foreground">4.8/5</span>
              <span className="text-xs text-muted-foreground">(241 avis)</span>
            </div>
            <h3 className="text-lg font-bold leading-tight text-foreground mb-1">Crème de jour anti-âge</h3>
            <p className="text-[10px] font-bold text-muted-foreground">Vitiligo · Pores dilatés · Rougeurs</p>
          </div>
          <div className="mx-3.5 bg-muted/50 rounded-2xl p-3 flex flex-col gap-2">
            <div className="bg-background border border-border rounded-2xl rounded-tl-sm px-3 py-2.5 text-xs text-foreground leading-snug max-w-[90%]">
              Parfait ! J'ai analysé votre diagnostic. Peau de type <strong>Mixte</strong>. Comment puis-je vous aider ?
            </div>
            <div className="self-end bg-foreground text-primary-foreground rounded-2xl rounded-tr-sm px-3 py-2.5 text-xs leading-snug max-w-[80%]">
              Cette crème est adaptée aux peaux mixtes et métisses ?
            </div>
            <div className="bg-background border border-border rounded-2xl rounded-tl-sm px-3 py-2.5 text-xs text-foreground leading-snug max-w-[90%]">
              Absolument ! Notre formule contient des extraits marins et de l'acide hyaluronique, parfaitement adaptés.
            </div>
          </div>
          <div className="mx-3.5 mt-3.5 mb-4">
            <button className="w-full bg-foreground text-primary-foreground py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase">
              Ajouter au panier — 49,90€
            </button>
          </div>
        </div>
      </div>
    </TeamRow>
  );
}

/* ═══ 3. CRÉATION DE CONTENU ═══ */
function BlocContenu() {
  return (
    <TeamRow bg="bg-background" title="Photos IA, vidéos UGC et visuels pour vos réseaux" kicker="Création de contenu"
      desc="Nous mettons en place une équipe Photographe AI, qui génère des photos produits niveau studio professionnel, des visuels UGC avec de vrais visages pour vos réseaux sociaux et des contenus marketing. En quelques secondes, sans shooting.">
      <div className="rounded-2xl overflow-hidden">
        <SafeVideo src="/videos/contenu-ugc.mp4" className="w-full h-[400px] object-cover" lazy />
      </div>
    </TeamRow>
  );
}

/* ═══ 4. SEO & RÉFÉRENCEMENT ═══ */
function BlocSEO() {
  return (
    <TeamRow bg="bg-secondary" reversed title="Optimisation de votre visibilité Google" kicker="SEO & Référencement"
      desc="On optimise vos fiches produits, méta-descriptions, mots-clés et contenus. Articles de blog, netlinking et suivi des positions inclus.">
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#34d399]" />
          <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-muted-foreground">Score SEO</span>
          <span className="ml-auto text-[26px] font-black text-foreground">92<span className="text-[13px] text-[#10b981]">/100</span></span>
        </div>
        {[
          { label: "Meta Title", val: "Crème Anti-Âge Bio — Soin Visage Naturel | Kaniwa" },
          { label: "Meta Description", val: "Découvrez notre crème anti-âge bio formulée avec des actifs marins…" },
          { label: "H1", val: "Crème de jour anti-âge bio et végane" },
          { label: "Mots-clés", val: "crème anti-âge bio, soin visage naturel, cosmétique végane" },
          { label: "Alt images", val: "3/3 optimisées" },
        ].map(r => (
          <div key={r.label} className="flex items-start gap-2.5 p-3 rounded-xl mb-1.5 border border-foreground">
            <div className="w-[18px] h-[18px] rounded-full bg-[#d1fae5] flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-[10px] h-[10px] text-[#065f46]" strokeWidth={3} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-foreground mb-0.5">{r.label}</p>
              <p className="text-xs text-foreground leading-snug">{r.val}</p>
            </div>
          </div>
        ))}
        <div className="mt-3.5 p-2.5 bg-[#ecfdf5] rounded-xl text-[11px] text-[#065f46] font-semibold text-center flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3" /> Fiche produit optimisée automatiquement
        </div>
      </div>
    </TeamRow>
  );
}

/* ═══ 5. INFLUENCE MARKETING ═══ */
function BlocInfluence() {
  return (
    <TeamRow bg="bg-background" title="Gestion influenceuses beauté" kicker="Influence Marketing"
      desc="On identifie, contacte et négocie avec les influenceuses adaptées à votre marque. Micro-influence, placements produits, unboxings — on gère la campagne de bout en bout.">
      <div className="flex gap-3.5 flex-wrap">
        <div className="flex-1 min-w-[140px] rounded-2xl overflow-hidden relative">
          <img src={kaniwaUgc2} alt="" className="w-full h-[280px] object-cover block" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent p-3 pt-8 text-white text-[11px] font-semibold flex items-center gap-1.5">
            📱 Post Instagram
          </div>
        </div>
        <div className="flex-1 min-w-[140px] rounded-2xl overflow-hidden relative">
          <SafeVideo src="/videos/fralene-ugc.mp4" className="w-full h-[280px] object-cover block" lazy />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent p-3 pt-8 text-white text-[11px] font-semibold flex items-center gap-1.5">
            📱 Story Réseaux
          </div>
        </div>
        <div className="flex-1 min-w-[180px] bg-background rounded-2xl p-6 flex flex-col justify-center gap-2.5 border border-border">
          <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Blog Article</span>
          <h4 className="text-[15px] font-bold text-foreground leading-snug">5 routines beauté bio pour peaux sensibles</h4>
          <p className="text-xs text-muted-foreground leading-snug">Découvrez comment prendre soin de votre peau avec des produits 100% naturels et végans…</p>
          <div className="text-[11px] text-[#10b981] font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Rédigé en 12 secondes
          </div>
        </div>
      </div>
    </TeamRow>
  );
}

/* ═══ 6. REPORTING & ANALYTICS ═══ */
function BlocAnalytics() {
  const bars = [38, 52, 45, 68, 82, 74, 91];
  const days = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <TeamRow bg="bg-secondary" reversed title="Gestion de vos campagnes Meta Ads & Google Ads" kicker="Publicité digitale"
      desc="On crée, optimise et pilote vos campagnes publicitaires. Ciblage précis de votre audience beauté, A/B testing des visuels, retargeting et analyse du ROI. Chaque euro investi est suivi.">
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-5">
          {[
            { label: "CA Semaine", val: "2 847€", trend: "+18%" },
            { label: "Top Produit", val: "Crème Anti-Âge", trend: "34 ventes" },
            { label: "Taux Conversion", val: "4.2%", trend: "+0.8pt" },
          ].map(k => (
            <div key={k.label} className="bg-background rounded-xl p-3.5 text-center">
              <p className="text-[10px] text-muted-foreground font-semibold mb-1">{k.label}</p>
              <p className="text-[17px] font-black text-foreground">{k.val}</p>
              <p className="text-[10px] text-[#10b981] font-semibold mt-0.5">{k.trend}</p>
            </div>
          ))}
        </div>
        <div className="flex items-end gap-2 h-[100px] px-1">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full rounded-md ${i === bars.length - 1 ? "bg-foreground" : "bg-muted"}`} style={{ height: `${h}px` }} />
              <span className="text-[10px] text-muted-foreground font-semibold">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </TeamRow>
  );
}

/* ═══ MAIN EXPORT ═══ */
export default function AgenceServicesSection() {
  return (
    <>
      <ServicesHero />
      <BlocReseauxSociaux />
      <BlocPublicite />
      <BlocContenu />
      <BlocSEO />
      <BlocInfluence />
      <BlocAnalytics />
    </>
  );
}
