import { motion } from "framer-motion";
import {
  Star, StarHalf, Menu, Search, User, ShoppingBag, ChevronLeft, ChevronRight,
  Mic, ArrowUp,
} from "lucide-react";
import { AnimatedChat } from "./AnimatedChat";
import kaniwaUgc2 from "@/assets/kaniwa-ugc-2.jpg";
import kaniwaUgc3 from "@/assets/kaniwa-ugc-3.jpg";
import kaniwaUgc4 from "@/assets/kaniwa-ugc-4.jpg";
import kaniwaUgc5 from "@/assets/kaniwa-ugc-5.png";
import kaniwaUgc6 from "@/assets/kaniwa-ugc-6.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

function PhoneHeader() {
  return (
    <div className="flex items-center justify-between px-5 pt-10 pb-4 z-20">
      <div className="flex items-center gap-4">
        <Menu className="w-5 h-5 text-foreground" />
        <Search className="w-5 h-5 text-foreground" />
      </div>
      <div className="font-serif font-bold text-2xl tracking-wide text-foreground">Kaniwa</div>
      <div className="flex items-center gap-3">
        <User className="w-5 h-5 text-foreground" />
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-foreground" />
          <span className="absolute -top-1 -right-1 bg-foreground text-primary-foreground text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">1</span>
        </div>
      </div>
    </div>
  );
}

function ProductInfo() {
  return (
    <>
      <div className="flex items-center gap-1.5 mb-2">
        <div className="flex text-foreground text-sm">
          {[...Array(4)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
          <StarHalf className="w-3.5 h-3.5 fill-current" />
        </div>
        <span className="text-xs font-bold text-foreground">4.8/5</span>
        <span className="text-xs text-muted-foreground">(241 avis)</span>
      </div>
      <h3 className="text-[22px] font-bold leading-tight text-foreground mb-1">Crème de jour anti-âge</h3>
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

export default function DiagnosticComparisonSection() {
  return (
    <section className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8" style={{ overflow: "visible" }}>
      {/* ── Header ── */}
      <div className="text-center max-w-5xl mx-auto px-6 pt-24 pb-12">
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-[10px] font-bold tracking-[2.5px] uppercase text-white/50 mb-5">
          Votre équipe intégrée
        </motion.p>
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-3xl md:text-4xl font-light tracking-tight max-w-[780px] mx-auto mb-6 text-white">
          Automatiser la conversion de vos visiteurs en client en intégrant un{" "}
          <em className="italic">agent conversationnel IA sur chaque page produit</em>
        </motion.h2>
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="text-[17px] text-white/50 leading-[1.7] max-w-[600px] mx-auto">
           Nous déployons une équipe d'agents conversationnels IA dédiée à chaque produit, capable de répondre instantanément aux questions de vos clients concernant la composition, la compatibilité ou les délais.
        </motion.p>

        {/* Stats */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
          className="grid grid-cols-3 max-w-xl mx-auto pt-14 pb-6 divide-x divide-white/20">
          {[
            { num: "7", label: "Équipes AI dédiées" },
            { num: "24h/24", label: "Disponibilité" },
            { num: "80%", label: "Économie vs agence" },
          ].map((s) => (
            <div key={s.label} className="text-center px-4 md:px-8">
              <div className="text-2xl md:text-3xl font-light leading-none text-white tracking-tight italic">{s.num}</div>
              <div className="text-[10px] text-white/50 font-semibold mt-3 uppercase tracking-[0.15em] whitespace-nowrap">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Before / After Phones ── */}
      <section className="py-24 md:py-36">
        <div className="max-w-7xl mx-auto px-6">
          <div className="w-full flex justify-center items-start overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <div className="relative flex flex-col md:flex-row items-start justify-center gap-10 md:gap-16">

              {/* ── AVANT ── */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
                className="flex flex-col items-center gap-8 relative z-10 w-[320px] shrink-0">
                <div className="bg-[#f5f4df] text-[#111] px-5 py-2 rounded-lg font-bold text-[9px] tracking-widest uppercase">Vos concurrents</div>
                <div className="w-[320px] bg-background rounded-[2.5rem] overflow-hidden relative flex flex-col border border-border">
                  <PhoneHeader />
                  <div className="w-full h-64 bg-muted relative pt-4 overflow-hidden">
                    <div className="flex justify-center items-start h-full">
                      <img src="https://i0.wp.com/kaniwabotanique.com/wp-content/uploads/2025/08/veuDbzM0ysQo5wxsfo1yvp1BnqZbx7PW-scaled.jpg?w=1930&ssl=1" alt="Produit" className="w-[140px] h-[200px] object-cover rounded-2xl border border-border relative z-10" />
                    </div>
                    <div className="absolute bottom-4 w-full flex justify-center gap-2 z-20">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                      <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                    </div>
                  </div>
                  <div className="px-6 mt-8 pb-8">
                    <ProductInfo />
                    <p className="text-[11px] font-bold text-muted-foreground mb-3">Vitiligo • Pores dilatés • Rougeurs</p>
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-lg font-bold text-foreground">49,90€</span>
                      <span className="text-sm text-muted-foreground line-through mb-0.5">65,00€</span>
                    </div>
                    <p className="text-[13px] text-muted-foreground leading-relaxed mb-8 h-[72px]">
                      Unifie le teint et repulpe la peau sans laisser de film gras. Idéale pour les peaux mixtes et les problématiques de pigmentation.
                    </p>
                    <button className="w-full bg-foreground text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-[13px] tracking-wide uppercase mb-4">
                      AJOUTER AU PANIER<span className="w-px h-4 bg-muted-foreground/50 mx-2" />49,90€
                    </button>
                    <PaymentIcons />
                  </div>
                </div>
                <div className="w-[320px] bg-background px-5 py-4 rounded-2xl border border-border relative z-20">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">TAUX DE CONVERSION</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[22px] font-bold text-foreground">0,6 %</span>
                    <span className="text-primary font-bold text-sm">→</span>
                    <span className="text-[22px] font-bold text-primary">3,2 %</span>
                    <svg className="w-16 h-6 ml-auto" viewBox="0 0 100 30" fill="none">
                      <path d="M0 20 Q 15 0, 30 15 T 60 15 T 90 10 T 100 5" stroke="hsl(var(--primary))" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              {/* ── AVEC LYSTES ── */}
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
                className="flex flex-col items-center gap-8 relative w-[360px] shrink-0">
                <div className="bg-[#f5f4df] text-[#111] px-5 py-2 rounded-lg font-bold text-[9px] tracking-widest uppercase z-10">
                  Vous avec Biolystes AI
                </div>
                <div className="relative">
                  <div className="w-[360px] bg-background rounded-[2.5rem] overflow-hidden relative flex flex-col z-10 border border-border">
                    <PhoneHeader />
                    <div className="w-full bg-foreground text-primary-foreground text-center text-[10px] font-medium tracking-widest uppercase py-1.5 shrink-0">
                      Livraison gratuite aujourd'hui
                    </div>
                    <div className="w-full relative mt-2 shrink-0">
                      <div className="flex overflow-x-auto gap-4 px-5 pb-6 pt-2" style={{ scrollbarWidth: "none" }}>
                        {[
                          "https://lystes.ai/images/clients/kaniwa-6.jpg",
                          kaniwaUgc2,
                          "https://lystes.ai/images/clients/kaniwa-8.jpg",
                          kaniwaUgc4,
                          "https://lystes.ai/images/clients/kaniwa-7.jpg",
                          kaniwaUgc5,
                          "https://lystes.ai/images/clients/kaniwa-4.jpg",
                          kaniwaUgc5,
                        ].map((src, i) => (
                          <div key={i} className="snap-start shrink-0 relative flex flex-col items-center">
                            <img src={src} alt="" className="w-[240px] h-[280px] object-cover rounded-2xl relative z-10 border border-border" />
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
                        Découvrez notre <strong className="text-foreground">crème de jour anti-âge</strong> formulée pour revitaliser votre peau. Ce{" "}
                        <strong className="text-foreground">soin hydratant expert</strong> unifie le teint, repulpe l'épiderme et aide à réduire l'apparence des taches pigmentaires.
                      </p>
                      <AnimatedChat />
                      <button className="w-full bg-foreground text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-6 text-[13px] tracking-wide uppercase">
                        AJOUTER AU PANIER<span className="w-px h-4 bg-muted-foreground/50 mx-2" />49,90€
                      </button>
                      <UgcScrollStrip />
                    </div>
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
        </div>
      </section>
    </section>
  );
}

function UgcScrollStrip() {
  const images = [kaniwaUgc3, kaniwaUgc4, kaniwaUgc2, kaniwaUgc5, kaniwaUgc3, kaniwaUgc4, kaniwaUgc2, kaniwaUgc5];
  return (
    <div className="overflow-hidden pb-6 -mx-2 px-2">
      <motion.div
        className="flex gap-2 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
      >
        {images.map((src, i) => (
          <div key={i} className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
