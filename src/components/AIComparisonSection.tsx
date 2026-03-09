import { motion } from "framer-motion";
import {
  Star, StarHalf, Menu, Search, User, ShoppingBag, Mic, ArrowUp,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { AnimatedChat } from "./AnimatedChat";
import kaniwaUgc2 from "@/assets/kaniwa-ugc-2.jpg";
import kaniwaUgc3 from "@/assets/kaniwa-ugc-3.jpg";
import kaniwaUgc4 from "@/assets/kaniwa-ugc-4.jpg";
import kaniwaUgc5 from "@/assets/kaniwa-ugc-5.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AIComparisonSection() {
  return (
    <section className="max-w-5xl mx-auto bg-foreground mt-8 rounded-[2.75rem] p-6 md:p-8 text-primary-foreground">
      <div className="text-center max-w-5xl mx-auto px-6 pt-24 pb-12">
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-[10px] font-bold tracking-[2.5px] uppercase text-white/50 mb-5">
          Votre équipe intégrée
        </motion.p>
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-3xl md:text-4xl font-light tracking-tight max-w-[780px] mx-auto mb-6 text-white">
          Automatiser la recommandation de produit en intégrant un diagnostiqueur IA à votre ecommerce
        </motion.h2>
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="text-[17px] text-white/50 leading-[1.7] max-w-[600px] mx-auto">
          En plus de la gestion de votre e-commerce, nous vous mettons à disposition nos <strong className="text-white">7 équipes IA</strong> pour vous assister : photos produits, SEO, marketing, analytics, support client — voici ce qu'elles font pour vous.
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

        {/* Before / After Phones */}
        <section className="py-24 md:py-36">
          <div className="max-w-7xl mx-auto px-6">
            <div className="w-full flex justify-center items-start overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              <div className="relative flex flex-col md:flex-row items-start justify-center gap-10 md:gap-16">

                {/* ── AVANT (Concurrents) ── */}
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
                  {/* Conversion card */}
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
                  <div className="bg-[#f5f4df] text-[#111] px-5 py-2 rounded-lg font-bold text-[9px] tracking-widest uppercase z-10">Vous avec Biolystes AI</div>
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
                          Découvrez notre <strong className="text-foreground">crème de jour anti-âge</strong> formulée pour revitaliser votre peau. Ce <strong className="text-foreground">soin hydratant expert</strong> unifie le teint, repulpe l'épiderme et aide à réduire l'apparence des taches pigmentaires.
                        </p>

                        {/* Chat */}
                        <div className="mb-6 bg-background border border-border rounded-[20px] overflow-hidden shadow-sm flex flex-col">
                          <div className="h-[291px] overflow-y-auto p-4 pt-5 flex flex-col gap-4 bg-muted/30" style={{ scrollBehavior: "smooth", scrollbarWidth: "none" }}>
                            <div className="flex flex-col gap-1 w-full shrink-0">
                              <div className="bg-background border border-border shadow-sm text-foreground text-[12px] p-3 rounded-2xl rounded-tl-sm leading-relaxed w-[92%]">
                                Parfait ! J'ai analysé votre diagnostic. Peau de type Mixte. Préoccupations : Vitiligo, Pores dilatés, Légères rougeurs. Comment puis-je vous aider avec la Crème de jour anti-âge ?
                              </div>
                              <span className="text-[9px] text-muted-foreground ml-1 font-medium">Maintenant</span>
                            </div>
                            <div className="flex flex-col gap-1 w-full items-end shrink-0">
                              <div className="bg-foreground text-primary-foreground text-[13px] py-3 px-4 rounded-2xl rounded-tr-sm w-fit max-w-[85%] leading-relaxed">
                                Bonjour, j'aimerais savoir si cette crème est adaptée au peau mixte et métisse ?
                              </div>
                              <span className="text-[9px] text-muted-foreground mr-1 font-medium">09:42</span>
                            </div>
                            <div className="flex flex-col gap-2 w-full shrink-0">
                              <div className="bg-background border border-border shadow-sm text-foreground text-[13px] p-4 rounded-2xl rounded-tl-sm flex flex-col gap-3 w-[92%]">
                                <span className="leading-relaxed">Absolument ! Notre formule contient des extraits marins et de l'acide hyaluronique. Voici des résultats :</span>
                                <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-xl border border-border">
                                    <img src="https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/before-after/d7bb6871-6142-4c3b-8daf-b754fb38f4eb/1766996391238.png" alt="" className="w-[76px] h-[52px] object-cover rounded-lg border border-border shadow-sm" />
                                    <div className="flex flex-col">
                                      <span className="text-[13px] font-bold leading-tight">Anti-vieillissement</span>
                                      <span className="text-[11px] text-muted-foreground mt-0.5">5 semaines</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-xl border border-border">
                                    <img src="https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/before-after/d7bb6871-6142-4c3b-8daf-b754fb38f4eb/1766996432144.png" alt="" className="w-[76px] h-[52px] object-cover rounded-lg border border-border shadow-sm" />
                                    <div className="flex flex-col">
                                      <span className="text-[13px] font-bold leading-tight">Anti-âge front</span>
                                      <span className="text-[11px] text-muted-foreground mt-0.5">3 semaines</span>
                                    </div>
                                  </div>
                                </div>
                                <span className="leading-relaxed">Ces résultats vous parlent ?</span>
                              </div>
                              <span className="text-[9px] text-muted-foreground ml-1 font-medium">09:42</span>
                            </div>
                            <div className="flex flex-col gap-1 w-full items-end shrink-0">
                              <div className="bg-foreground text-primary-foreground text-[13px] py-3 px-4 rounded-2xl rounded-tr-sm w-fit max-w-[85%] leading-relaxed">
                                C'est impressionnant ! Avez-vous des avis de clientes ?
                              </div>
                              <span className="text-[9px] text-muted-foreground mr-1 font-medium">09:43</span>
                            </div>
                            <div className="flex flex-col gap-2 w-full shrink-0">
                              <div className="bg-background border border-border shadow-sm text-foreground text-[13px] p-3 rounded-2xl rounded-tl-sm w-[92%] leading-relaxed">
                                Bien sûr ! Voici quelques retours vérifiés :
                              </div>
                              <div className="relative bg-background border border-border rounded-2xl p-4 shadow-sm w-[92%] flex flex-col gap-3">
                                <div className="flex gap-0.5 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <div key={i} className="bg-[#00B67A] text-white flex items-center justify-center w-[18px] h-[18px] rounded-[3px]">
                                      <Star className="w-[11px] h-[11px] fill-current" />
                                    </div>
                                  ))}
                                </div>
                                <p className="text-[13px] text-foreground italic leading-relaxed font-medium">
                                  "Ma peau paraît nettement plus jeune et lumineuse. Confort, éclat et peau revitalisée."
                                </p>
                                <p className="text-[12px] text-muted-foreground">Alice - via Trustpilot</p>
                                <div className="flex items-center justify-end gap-3 mt-1">
                                  <div className="w-7 h-7 border border-border rounded-full flex items-center justify-center text-muted-foreground opacity-50 bg-muted">
                                    <ChevronLeft className="w-3 h-3" />
                                  </div>
                                  <span className="text-[11px] text-muted-foreground font-medium">1 / 2</span>
                                  <div className="w-7 h-7 border border-border rounded-full flex items-center justify-center text-foreground bg-background shadow-sm">
                                    <ChevronRight className="w-3 h-3" />
                                  </div>
                                </div>
                              </div>
                              <span className="text-[9px] text-muted-foreground ml-1 font-medium">09:43</span>
                            </div>
                            <div className="flex flex-col gap-1 w-full items-end shrink-0">
                              <div className="bg-foreground text-primary-foreground text-[13px] py-3 px-4 rounded-2xl rounded-tr-sm w-fit max-w-[85%] leading-relaxed">
                                Top ! D'autres produits pour ma routine ?
                              </div>
                              <span className="text-[9px] text-muted-foreground mr-1 font-medium">09:44</span>
                            </div>
                            <div className="flex flex-col gap-1 w-full shrink-0">
                              <div className="flex flex-col gap-2 w-[95%] overflow-hidden">
                                <div className="bg-background border border-border shadow-sm text-foreground text-[13px] p-3 rounded-2xl rounded-tl-sm w-fit">
                                  Voici ce qui pourrait compléter votre routine :
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-2 pl-1" style={{ scrollbarWidth: "none" }}>
                                  {[
                                    { src: "https://i0.wp.com/kaniwabotanique.com/wp-content/uploads/2025/08/O236SDw9GkuAtxkcoHnMrhJ_9lJP7tPq-scaled.jpg?w=1930&ssl=1", name: "Sérum vitamine C", price: "35,00 €" },
                                    { src: "https://i0.wp.com/kaniwabotanique.com/wp-content/uploads/2026/01/FRONT_high_res-12-scaled.jpg?w=1930&ssl=1", name: "Sérum anti-âge", price: "34,00 €" },
                                    { src: "", name: "Gel Hydratation", price: "29,00 €" },
                                  ].map((p, i) => (
                                    <div key={i} className="min-w-[90px] bg-background border border-border rounded-xl p-2 flex flex-col gap-1 items-center text-center relative shadow-sm shrink-0">
                                      {p.src ? (
                                        <img src={p.src} alt={p.name} className="w-12 h-14 rounded object-cover shadow-sm mb-1" />
                                      ) : (
                                        <div className="w-12 h-14 bg-[#c8e6c9] rounded mb-1" />
                                      )}
                                      <p className="text-[9px] font-bold leading-tight h-6">{p.name}</p>
                                      <p className="text-[9px] text-muted-foreground font-medium">{p.price}</p>
                                      <button className="absolute -bottom-2 right-2 bg-foreground text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-[12px] shadow-md">+</button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1 w-full items-end shrink-0 mt-2">
                              <div className="bg-foreground text-primary-foreground text-[12px] py-2.5 px-3.5 rounded-2xl rounded-tr-sm w-fit">
                                Merci :)
                              </div>
                            </div>
                          </div>

                          {/* Chat input */}
                          <div className="p-3 bg-background border-t border-border shrink-0">
                            <div className="relative rounded-[22px] p-[1.5px] bg-gradient-to-r from-pink-300 via-purple-200 to-green-200 shadow-sm">
                              <div className="bg-background rounded-[20px] p-3 flex flex-col gap-3">
                                <div className="text-[13px] pl-1 tracking-wide min-h-[20px]">
                                  <span className="text-muted-foreground">Posez votre question sur ce produit ...</span>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="bg-foreground rounded-full py-1.5 pl-1.5 pr-4 flex items-center gap-2.5 shadow-md">
                                    <div className="flex items-center pl-0.5">
                                      <img src="https://i.pravatar.cc/100?img=5" className="w-6 h-6 rounded-md border-[1.5px] border-background relative z-10 object-cover" alt="" />
                                      <img src="https://i.pravatar.cc/100?img=11" className="w-6 h-6 rounded-md border-[1.5px] border-background relative z-20 -ml-2 object-cover" alt="" />
                                      <div className="relative z-30 -ml-2">
                                        <img src="https://i.pravatar.cc/100?img=9" className="w-6 h-6 rounded-md border-[1.5px] border-background object-cover" alt="" />
                                        <div className="absolute -top-1.5 -right-1.5 bg-gradient-to-br from-pink-100 via-blue-50 to-green-100 text-[6px] font-bold px-1 rounded shadow-sm text-foreground border border-background/80">AI</div>
                                      </div>
                                    </div>
                                    <span className="text-primary-foreground text-[10px] font-bold tracking-wide">Faire un diagnostic</span>
                                  </div>
                                  <div className="flex items-center gap-3 pr-1">
                                    <Mic className="w-5 h-5 text-muted-foreground" />
                                    <div className="bg-foreground text-primary-foreground w-7 h-7 rounded-full flex items-center justify-center shadow-md">
                                      <ArrowUp className="w-3 h-3" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button className="w-full bg-foreground text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 mb-6 text-[13px] tracking-wide uppercase">
                          AJOUTER AU PANIER<span className="w-px h-4 bg-muted-foreground/50 mx-2" />49,90€
                        </button>
                        <div className="overflow-hidden pb-6 -mx-2 px-2">
                          <div className="flex gap-2 w-max" style={{ transform: "translateX(-7.09375%)" }}>
                            {[kaniwaUgc3, kaniwaUgc4, kaniwaUgc2, kaniwaUgc5, kaniwaUgc3, kaniwaUgc4, kaniwaUgc2, kaniwaUgc5].map((src, i) => (
                              <div key={i} className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                <img src={src} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile labels */}
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
      </div>
    </section>
  );
}

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
      <p className="text-[11px] font-bold text-muted-foreground mb-3">Vitiligo • Pores dilatés • Rougeurs</p>
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
