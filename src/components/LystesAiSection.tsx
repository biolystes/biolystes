import { motion } from "framer-motion";
import {
  ScanFace, MessageCircle, Camera, Globe, BarChart3, QrCode,
  Star, StarHalf, Menu, Search, User, ShoppingBag, Mic, ArrowUp,
  ChevronLeft, ChevronRight, Check, Sparkles, ClipboardList, Play,
  Minus, AlertTriangle, MessageSquare
} from "lucide-react";
import { AnimatedChat } from "./AnimatedChat";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ═══════════════════════════════════════════════════
   HERO + STATS
   ═══════════════════════════════════════════════════ */
function LystesHero() {
  return (
    <div className="text-center max-w-[1120px] mx-auto px-6 pt-24 pb-12">
      <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        className="text-[10px] font-bold tracking-[2.5px] uppercase text-muted-foreground mb-5">
        Comment gérer sa marque
      </motion.p>
      <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
        className="text-3xl md:text-4xl font-light tracking-tight max-w-[780px] mx-auto mb-6 text-foreground">
        Comment gérer sa marque bio et végane <em className="italic">sans engager trop de dépenses</em> ?
      </motion.h2>
      <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
        className="text-[17px] text-muted-foreground leading-[1.7] max-w-[600px] mx-auto">
        Nous mettons à votre disposition <strong className="text-foreground">7 équipes d'agents IA</strong> spécialisées qui travaillent ensemble pour gérer votre marque au quotidien — photos, SEO, ventes, marketing, analytics — le tout sans embaucher.
      </motion.p>

      {/* Stats */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
        className="flex justify-center gap-14 pt-10 pb-6 flex-wrap">
        {[
          { num: "7", label: "Équipes AI dédiées" },
          { num: "24h/24", label: "Disponibilité" },
          { num: "80%", label: "Économie vs agence" },
        ].map(s => (
          <div key={s.label} className="text-center">
            <div className="text-[44px] font-black leading-none text-foreground">{s.num}</div>
            <div className="text-xs text-muted-foreground font-semibold mt-1.5">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BEFORE / AFTER PHONES
   ═══════════════════════════════════════════════════ */
function BeforeAfterPhones() {
  return (
    <div className="w-full flex justify-center items-start overflow-x-auto py-12 px-6 gap-10 md:gap-16" style={{ scrollbarWidth: "none" }}>
      <div className="relative flex flex-col md:flex-row items-start justify-center gap-10 md:gap-16">

        {/* ── AVANT ── */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="flex flex-col items-center gap-4 relative z-10 w-[320px] shrink-0">
          <div className="bg-foreground text-primary-foreground px-5 py-2 rounded-lg font-bold text-sm tracking-widest uppercase">Vos concurrents</div>
          <div className="w-[320px] bg-background rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative flex flex-col">
            <PhoneHeader />
            <div className="w-full h-64 bg-muted relative pt-4 overflow-hidden">
              <div className="flex justify-center items-start h-full">
                <img src="https://i0.wp.com/kaniwabotanique.com/wp-content/uploads/2025/08/veuDbzM0ysQo5wxsfo1yvp1BnqZbx7PW-scaled.jpg?w=1930&ssl=1" alt="Produit" className="w-[140px] h-[200px] object-cover rounded-2xl shadow-sm border border-border relative z-10" />
              </div>
              <div className="absolute bottom-4 w-full flex justify-center gap-2 z-20">
                <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
              </div>
            </div>
            <div className="px-6 mt-8 pb-8">
              <ProductInfo />
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
              <PaymentIcons />
            </div>
          </div>
          {/* Conversion card */}
          <div className="bg-background p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] w-[320px]">
            <p className="text-[10px] font-bold tracking-[2px] uppercase text-muted-foreground mb-2">Taux de conversion</p>
            <div className="flex items-center gap-3">
              <span className="text-[22px] font-bold text-foreground">3,8 %</span>
              <ArrowUp className="w-4 h-4 text-[#10b981] rotate-90" />
              <span className="text-[22px] font-bold text-[#10b981]">42 %</span>
            </div>
          </div>
        </motion.div>

        {/* ── AVEC LYSTES ── */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
          className="flex flex-col items-center gap-4 relative w-[360px] shrink-0">
          <div className="bg-foreground text-primary-foreground px-5 py-2 rounded-lg font-bold text-sm tracking-widest uppercase z-10">
            Vous avec Biolystes AI
          </div>
          <div className="relative">
            <div className="w-[360px] bg-background rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden relative flex flex-col z-10">
              <PhoneHeader />
              <div className="w-full bg-foreground text-primary-foreground text-center text-[10px] font-medium tracking-widest uppercase py-1.5 shrink-0">
                Livraison gratuite aujourd'hui
              </div>
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
              <div className="px-6 mt-8">
                <ProductInfo />
                <p className="text-[11px] font-bold text-muted-foreground mb-3">Vitiligo • Pores dilatés • Rougeurs</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-6">
                  Découvrez notre <strong className="text-foreground">crème de jour anti-âge</strong> formulée pour revitaliser votre peau. Ce <strong className="text-foreground">soin hydratant expert</strong> unifie le teint, repulpe l'épiderme et aide à réduire l'apparence des taches pigmentaires.
                </p>
                <AnimatedChat />
                <button className="w-full bg-foreground text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-6 text-[13px] tracking-wide shadow-lg uppercase">
                  AJOUTER AU PANIER<span className="w-px h-4 bg-muted-foreground/50 mx-2" />49,90€
                </button>
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

            {/* Pointer labels - desktop */}
            <div className="hidden lg:block absolute -right-4 top-0 translate-x-full pl-4" style={{ height: "100%" }}>
              {[
                { label: "Directeur Marketing AI", top: "151px" },
                { label: "Photographe AI", top: "280px" },
                { label: "Expert SEO AI", top: "640px" },
                { label: "Expert produit AI", top: "820px" },
                { label: "Diagnostic AI", top: "1073px" },
                { label: "Créateur de contenu AI", top: "1291px" },
              ].map((agent) => (
                <div key={agent.label} className="flex items-center gap-2 absolute" style={{ top: agent.top }}>
                  <div className="w-3 h-3 rounded-full bg-foreground border-2 border-background shadow" />
                  <div className="w-5 h-px bg-foreground/20" />
                  <span className="bg-foreground text-primary-foreground text-[11px] font-semibold px-4 py-2 rounded-full whitespace-nowrap shadow-sm">
                    {agent.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: agent labels */}
          <div className="lg:hidden flex flex-wrap gap-2 justify-center mt-2">
            {["Directeur Marketing AI", "Photographe AI", "Expert SEO AI", "Expert produit AI", "Diagnostic AI", "Créateur de contenu AI", "Analytics AI"].map((label) => (
              <span key={label} className="bg-foreground text-primary-foreground text-[10px] font-medium px-3 py-1.5 rounded-full">
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   TEAM DETAIL SECTIONS
   ═══════════════════════════════════════════════════ */

function TeamDiagnostics() {
  return (
    <TeamRow bg="bg-background" title="Diagnostic peau intelligent" kicker="Équipe Diagnostics AI"
      desc="Votre visiteur prend un selfie. L'IA scanne son visage, analyse sa peau en détail, et recommande automatiquement les produits les plus adaptés de votre boutique.">
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <video autoPlay muted loop playsInline className="w-full md:w-1/2 h-[400px] object-cover rounded-2xl">
          <source src="https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/video//diagnosticai.mp4" type="video/mp4" />
        </video>
        <div className="flex flex-col gap-4 w-full md:w-1/2">
          <img src="https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/widget-avatars/avatar3.jpeg" alt="Diagnostic résultat" className="w-full h-[190px] object-cover rounded-2xl" />
          <img src="https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/widget-avatars/avatar1.jpeg" alt="Diagnostic résultat" className="w-full h-[190px] object-cover rounded-2xl" />
        </div>
      </div>
    </TeamRow>
  );
}

function TeamExpertProduit() {
  return (
    <TeamRow bg="bg-secondary" reversed title="Un vendeur expert sur chaque fiche" kicker="Équipe Expert Produit AI"
      desc="Chaque produit dispose de son propre expert dédié. Il répond instantanément aux questions sur la composition, la compatibilité, les délais. Comme votre meilleur vendeur, formé sur chaque détail.">
      <div className="flex justify-center">
        <div className="w-[320px] bg-background rounded-[2rem] overflow-hidden border border-border">
          <PhoneHeader small />
          <div className="bg-foreground text-primary-foreground text-center text-[9px] font-semibold tracking-[2px] uppercase py-1.5">
            Livraison gratuite aujourd'hui
          </div>
          <img src="https://lystes.ai/images/clients/kaniwa-6.jpg" alt="" className="w-full h-[200px] object-cover" />
          <div className="px-4 pt-3.5 pb-2">
            <ProductInfo small />
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

function TeamPhotographe() {
  return (
    <TeamRow bg="bg-background" title="Photos studio en quelques secondes" kicker="Équipe Photographe AI"
      desc="Photos produits niveau studio professionnel, visuels UGC avec de vrais visages pour vos réseaux sociaux, contenus marketing. En quelques secondes, sans shooting.">
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-1.5" style={{ gridAutoRows: "180px" }}>
        <img className="col-span-2 w-full h-full object-cover rounded-xl" src="https://lystes.ai/images/clients/kaniwa-1.jpg" alt="" />
        <img className="w-full h-full object-cover rounded-xl" src="https://lystes.ai/images/clients/kaniwa-6.jpg" alt="" />
        <img className="w-full h-full object-cover rounded-xl" src="https://lystes.ai/images/clients/kaniwa-5.jpg" alt="" />
        <img className="w-full h-full object-cover rounded-xl" src="https://lystes.ai/images/clients/kaniwa-3.jpg" alt="" />
        <img className="w-full h-full object-cover rounded-xl" src="https://lystes.ai/images/clients/fralene-2.jpg" alt="" />
        <img className="col-span-2 w-full h-full object-cover rounded-xl" src="https://lystes.ai/images/clients/fralene-3.jpg" alt="" />
      </div>
    </TeamRow>
  );
}

function TeamSEO() {
  return (
    <TeamRow bg="bg-secondary" reversed title="Visible sur Google dès le lancement" kicker="Équipe Expert SEO AI"
      desc="Optimisation automatique de vos fiches produits, méta-descriptions, mots-clés et contenus pour que votre boutique soit visible sur Google dès le lancement.">
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#34d399]" />
          <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-muted-foreground">Score SEO</span>
          <span className="ml-auto text-[26px] font-black text-foreground">92<span className="text-[13px] text-[#10b981]">/100</span></span>
        </div>
        {[
          { label: "Meta Title", val: "Crème Anti-Âge Bio — Soin Visage Naturel | Expire" },
          { label: "Meta Description", val: "Découvrez notre crème anti-âge bio formulée avec des actifs marins…" },
          { label: "H1", val: "Crème de jour anti-âge bio et végane" },
          { label: "Mots-clés", val: "crème anti-âge bio, soin visage naturel, cosmétique végane" },
          { label: "Alt images", val: "3/3 optimisées" },
        ].map(r => (
          <div key={r.label} className="flex items-start gap-2.5 p-3 bg-background rounded-xl mb-1.5">
            <div className="w-[18px] h-[18px] rounded-full bg-[#d1fae5] flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-[10px] h-[10px] text-[#065f46]" strokeWidth={3} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-muted-foreground mb-0.5">{r.label}</p>
              <p className="text-xs text-foreground leading-snug">{r.val}</p>
            </div>
          </div>
        ))}
        <div className="mt-3.5 p-2.5 bg-[#ecfdf5] rounded-xl text-[11px] text-[#065f46] font-semibold text-center flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3" /> Fiche produit optimisée automatiquement par l'IA
        </div>
      </div>
    </TeamRow>
  );
}

function TeamMarketing() {
  const tasks = [
    { day: "Lun", task: "Campagne email de bienvenue", status: "done" },
    { day: "Mar", task: "Post Instagram — Avant/Après", status: "done" },
    { day: "Mer", task: "Story UGC — Témoignage cliente", status: "now" },
    { day: "Jeu", task: "Relance panier abandonné", status: "wait" },
    { day: "Ven", task: "Newsletter promo weekend", status: "wait" },
  ];

  return (
    <TeamRow bg="bg-background" title="Votre directeur marketing 24h/24" kicker="Équipe Marketing AI"
      desc="Plans d'action marketing personnalisés, campagnes email, stratégies de conversion. Un directeur marketing qui travaille pour vous 24h/24.">
      <div className="w-full max-w-xl mx-auto bg-background rounded-[2.5rem] border border-border overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-10 pb-6 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">Progression</span>
            <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">Semaine 1</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center border border-border">
            <div className="w-6 h-1 bg-muted rounded-full relative overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-3/5 bg-blue-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Task list */}
        <div className="px-6 pb-6 space-y-2">
          {tasks.map(t => (
            <div key={t.day} className={`flex items-center justify-between p-5 rounded-[1.25rem] transition-all duration-300 border ${
              t.status === "now" ? "bg-blue-50/30 border-blue-100" : "bg-transparent border-transparent"
            }`}>
              <div className="flex items-center gap-6">
                <span className={`w-10 text-[11px] font-extrabold tracking-widest ${
                  t.status === "done" ? "text-muted-foreground/40" : "text-muted-foreground"
                }`}>{t.day}</span>
                <span className={`text-[15px] font-semibold ${
                  t.status === "done" ? "text-muted-foreground/40 line-through" : "text-foreground"
                }`}>{t.task}</span>
              </div>
              <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center ${
                t.status === "done" ? "bg-foreground" : t.status === "now" ? "bg-blue-500" : "bg-muted"
              }`}>
                {t.status === "done" && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />}
                {t.status === "now" && <Play className="w-3 h-3 text-white fill-white" />}
                {t.status === "wait" && <Minus className="w-3 h-3 text-muted-foreground" strokeWidth={3} />}
              </div>
            </div>
          ))}
        </div>

        {/* Objectifs */}
        <div className="m-6 p-8 bg-foreground rounded-[2rem] text-primary-foreground">
          <div className="flex items-center gap-2 mb-6 opacity-40">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]">Objectifs Business</span>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold tracking-tight">+25%</span>
                <ArrowUp className="w-4 h-4 text-[#34d399]" />
              </div>
              <p className="text-[10px] opacity-40 font-bold uppercase tracking-[0.1em]">Trafic hebdomadaire</p>
            </div>
            <div className="space-y-1 border-l border-primary-foreground/10 pl-8">
              <div className="text-3xl font-bold tracking-tight">15</div>
              <p className="text-[10px] opacity-40 font-bold uppercase tracking-[0.1em]">Ventes confirmées</p>
            </div>
          </div>
        </div>
      </div>
    </TeamRow>
  );
}

function TeamContenu() {
  return (
    <TeamRow bg="bg-secondary" reversed title="Du contenu pro en quelques secondes" kicker="Équipe Créateur de contenu AI"
      desc="Contenus pour vos réseaux sociaux, articles de blog, descriptions produits optimisées. Du contenu professionnel généré en quelques secondes.">
      <div className="flex gap-3.5 flex-wrap">
        {[
          { src: "https://lystes.ai/images/clients/kaniwa-ugc-1.jpg", label: "Post Instagram" },
          { src: "https://lystes.ai/images/clients/kaniwa-ugc-4.jpg", label: "Story Réseaux" },
        ].map(img => (
          <div key={img.label} className="flex-1 min-w-[140px] rounded-2xl overflow-hidden relative">
            <img src={img.src} alt="" className="w-full h-[280px] object-cover block" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent p-3 pt-8 text-white text-[11px] font-semibold flex items-center gap-1.5">
              📱 {img.label}
            </div>
          </div>
        ))}
        <div className="flex-1 min-w-[180px] bg-background rounded-2xl p-6 flex flex-col justify-center gap-2.5">
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

function TeamAnalytics() {
  const bars = [38, 52, 45, 68, 82, 74, 91];
  const days = ["L", "M", "M", "J", "V", "S", "D"];

  return (
    <TeamRow bg="bg-background" title="Des décisions basées sur la réalité" kicker="Équipe Analytics AI"
      desc="Un assistant IA connaît vos chiffres en temps réel. CA, tops produits, questions clients, points de blocage. Des décisions basées sur la réalité, pas sur des suppositions.">
      <div>
        {/* KPIs */}
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

        {/* Bars */}
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

/* ═══════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════ */

function PhoneHeader({ small }: { small?: boolean }) {
  const sz = small ? "w-4 h-4" : "w-5 h-5";
  return (
    <div className="flex items-center justify-between px-5 pt-7 pb-3.5 border-b border-border">
      <div className="flex items-center gap-3">
        <Menu className={`${sz} text-foreground`} />
        <Search className={`${sz} text-foreground`} />
      </div>
      <div className={`font-serif font-bold ${small ? "text-xl" : "text-2xl"} tracking-wide text-foreground`}>Expire</div>
      <div className="flex items-center gap-3">
        <User className={`${sz} text-foreground`} />
        <div className="relative">
          <ShoppingBag className={`${sz} text-foreground`} />
          <span className="absolute -top-1 -right-1 bg-foreground text-primary-foreground text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">1</span>
        </div>
      </div>
    </div>
  );
}

function ProductInfo({ small }: { small?: boolean }) {
  return (
    <>
      <div className="flex items-center gap-1.5 mb-2">
        <div className={`flex text-foreground ${small ? "text-xs" : "text-sm"}`}>
          {[...Array(4)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
          <StarHalf className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="text-xs font-bold text-foreground">4.8/5</span>
        <span className="text-xs text-muted-foreground">(241 avis)</span>
      </div>
      <h3 className={`${small ? "text-lg" : "text-[22px]"} font-bold leading-tight text-foreground mb-1`}>Crème de jour anti-âge</h3>
    </>
  );
}

function PaymentIcons() {
  return (
    <div className="flex justify-center items-center gap-3">
      <div className="px-2.5 py-0.5 border border-border rounded text-[10px] font-bold text-[#1434CB] italic">VISA</div>
      <div className="w-7 h-4 border border-border rounded relative overflow-hidden flex items-center justify-center bg-background">
        <div className="w-3.5 h-3.5 bg-[#EB001B] rounded-full absolute -ml-2.5 opacity-90" />
        <div className="w-3.5 h-3.5 bg-[#F79E1B] rounded-full absolute ml-2.5 opacity-90" />
      </div>
      <div className="px-2.5 py-0.5 border border-border rounded text-[10px] font-bold flex items-center gap-1 text-foreground"> Pay</div>
      <div className="px-2.5 py-0.5 border border-border rounded text-[10px] font-bold flex items-center gap-1 text-muted-foreground">G Pay</div>
    </div>
  );
}

function TeamRow({ bg, reversed, title, kicker, desc, children }: {
  bg: string; reversed?: boolean; title: string; kicker: string; desc: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} custom={0}
      className={`${bg} py-14 md:py-20`}>
      <div className={`max-w-[1120px] mx-auto px-6 flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-12`}>
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

/* ═══════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════ */
export default function LystesAiSection() {
  return (
    <>
      <LystesHero />
      <BeforeAfterPhones />
      <TeamDiagnostics />
      <TeamExpertProduit />
      <TeamPhotographe />
      <TeamSEO />
      <TeamMarketing />
      <TeamContenu />
      <TeamAnalytics />
    </>
  );
}
