import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const directors = [
  {
    name: "Eva", role: "Directrice Conversion", img: "https://static.thenounproject.com/png/7385763-200.png",
    teamLabel: "ÉQUIPE CONVERSION",
    managers: [
      { name: "Jade", role: "Manager Diagnostics", img: "https://static.thenounproject.com/png/7385779-200.png", badge: "DIAG" },
      { name: "Hugo", role: "Manager Experts Produit", img: "https://static.thenounproject.com/png/7923622-200.png", badge: "EXPERT" },
    ],
    teams: [
      { name: "Diagnostics AI", agentMultiplier: 1, desc: "Analyse peau via selfie" },
      { name: "Experts Produit AI", agentMultiplier: 1, desc: "Conseiller IA par fiche produit" },
    ],
  },
  {
    name: "Raphaël", role: "Directeur Créatif", img: "https://static.thenounproject.com/png/7038302-200.png",
    teamLabel: "ÉQUIPE CRÉATIVE",
    managers: [
      { name: "Emma", role: "Manager Ambassadeurs", img: "https://static.thenounproject.com/png/7385783-200.png", badge: "UGC" },
      { name: "Noah", role: "Manager Photographes", img: "https://static.thenounproject.com/png/7923622-200.png", badge: "PHOTO" },
      { name: "Léa", role: "Manager Design", img: "https://static.thenounproject.com/png/7385779-200.png", badge: "DESIGN" },
    ],
    teams: [
      { name: "Ambassadeurs UGC", agentMultiplier: 1.04, desc: "Contenu UGC réaliste par secteur" },
      { name: "Photographes IA", agentMultiplier: 0.07, desc: "Photos produit professionnelles" },
      { name: "Graphistes IA", agentMultiplier: 0.007, desc: "Branding & design éditorial" },
    ],
  },
  {
    name: "Lucas", role: "Directeur Marketing", img: "https://static.thenounproject.com/png/7999219-200.png",
    teamLabel: "ÉQUIPE MARKETING",
    managers: [
      { name: "Camille", role: "Manager Email", img: "https://static.thenounproject.com/png/7385763-200.png", badge: "EMAIL" },
      { name: "Théo", role: "Manager Social", img: "https://static.thenounproject.com/png/7038302-200.png", badge: "SOCIAL" },
    ],
    teams: [
      { name: "Email Marketing AI", agentMultiplier: 0.5, desc: "Campagnes et relances automatisées" },
      { name: "Social Media AI", agentMultiplier: 0.54, desc: "Posts, stories et calendrier éditorial" },
    ],
  },
  {
    name: "Sarah", role: "Directrice Analytics", img: "https://static.thenounproject.com/png/7385779-200.png",
    teamLabel: "ÉQUIPE ANALYTICS",
    managers: [
      { name: "Antoine", role: "Manager Data", img: "https://static.thenounproject.com/png/7999219-200.png", badge: "DATA" },
    ],
    teams: [
      { name: "Analytics AI", agentMultiplier: 0.045, desc: "Dashboards & insights temps réel" },
    ],
  },
];

export default function AITeamOrgChart() {
  const [productCount, setProductCount] = useState(134);
  const [activeDir, setActiveDir] = useState(1);

  const totalAgents = useMemo(() => {
    let total = 1; // MyGPT
    total += directors.length; // directors
    directors.forEach(d => {
      total += d.managers.length;
      d.teams.forEach(t => total += Math.max(1, Math.round(productCount * t.agentMultiplier)));
    });
    return total;
  }, [productCount]);

  const teamTotals = useMemo(() =>
    directors.map(d => {
      let count = 1 + d.managers.length;
      d.teams.forEach(t => count += Math.max(1, Math.round(productCount * t.agentMultiplier)));
      return count;
    }),
    [productCount]
  );

  const dir = directors[activeDir];

  const navDir = (delta: number) => {
    setActiveDir(i => (i + delta + directors.length) % directors.length);
  };

  return (
    <section className="py-[80px] md:py-[120px] bg-transparent">
      <div className="max-w-[1280px] mx-auto px-5 md:px-[clamp(20px,5vw,80px)]">

        {/* Header */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-center mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground mb-4">Équipe AI</p>
          <h2 className="text-[24px] md:text-[clamp(32px,4vw,44px)] font-medium tracking-[-0.03em] mb-4 leading-[1.15]">
            <span className="font-['Instrument_Serif'] italic">Lystes {productCount} produits</span>{" "}
            <span className="inline-block">= <span className="font-['Instrument_Serif'] italic text-muted-foreground">{totalAgents} agents dédiés</span></span>
            <br />pour booster vos ventes
          </h2>
          <p className="text-[17px] text-muted-foreground max-w-[560px] mx-auto leading-[1.7]">
            Chaque produit de votre catalogue génère automatiquement des agents spécialisés en conversion, création de contenu et marketing.
          </p>
        </motion.div>

        {/* Slider */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="max-w-md mx-auto mb-12">
          <div className="flex items-center justify-between text-[12px] text-muted-foreground mb-2">
            <span>10 produits</span>
            <span className="font-medium text-foreground">{productCount} produits</span>
            <span>1000 produits</span>
          </div>
          <Slider min={10} max={1000} step={1} value={[productCount]}
            onValueChange={([v]) => setProductCount(v)} />
        </motion.div>

        {/* Org chart */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="py-10 px-5">
          <div className="max-w-[1100px] mx-auto flex flex-col items-center">

            {/* MyGPT */}
            <div className="bg-foreground text-background px-5 md:px-8 py-4 md:py-5 rounded-xl flex items-center justify-between gap-4 md:gap-6 w-full max-w-[400px] transition-all">
              <div className="flex items-center gap-3.5">
                <img src="https://static.thenounproject.com/png/7544901-200.png" alt="MyGPT" className="w-[46px] h-[46px] rounded-full bg-white" />
                <div>
                  <h4 className="text-base font-semibold">MyGPT</h4>
                  <span className="text-xs text-muted-foreground">Manager Général</span>
                </div>
              </div>
              <div className="text-[9px] font-bold uppercase tracking-[0.1em] px-2.5 py-1.5 border border-muted-foreground/30 rounded text-muted-foreground">Accès 360°</div>
            </div>

            <div className="w-px bg-border mx-auto" style={{ height: 40 }} />

            {/* Directors label */}
            <div className="text-center mb-5 mt-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Directeurs</span>
            </div>

            {/* Directors carousel - Desktop */}
            <div className="hidden md:flex gap-3 justify-center flex-wrap items-center">
              <button onClick={() => navDir(-1)} className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center text-base text-muted-foreground transition-all hover:bg-foreground hover:text-background hover:border-foreground shrink-0">←</button>
              {directors.map((d, i) => (
                <button key={d.name} onClick={() => setActiveDir(i)}
                  className={`px-5 py-4 rounded-xl text-center w-[160px] relative transition-all duration-[350ms] ${
                    i === activeDir
                      ? "bg-foreground text-background border border-foreground -translate-y-1 scale-[1.03] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                      : "bg-background text-foreground border border-border hover:border-foreground hover:-translate-y-0.5"
                  }`}>
                  <img src={d.img} alt={d.name} className="w-10 h-10 rounded-full mx-auto mb-2 bg-white border border-border" />
                  <h4 className="text-[13px] font-semibold mb-0.5">{d.name}</h4>
                  <span className={`text-[9px] block mb-2 ${i === activeDir ? "text-background/60" : "text-muted-foreground"}`}>{d.role}</span>
                  <span className={`text-[7px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 border rounded inline-block ${
                    i === activeDir ? "border-background/30 text-background/60" : "border-border text-muted-foreground"
                  }`}>{d.teamLabel}</span>
                  {i === activeDir && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-foreground" />}
                </button>
              ))}
              <button onClick={() => navDir(1)} className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center text-base text-muted-foreground transition-all hover:bg-foreground hover:text-background hover:border-foreground shrink-0">→</button>
            </div>

            {/* Directors carousel - Mobile */}
            <div className="flex md:hidden gap-4 justify-center items-center">
              <button onClick={() => navDir(-1)} className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground shrink-0">←</button>
              <div className="px-5 py-4 rounded-xl text-center w-[160px] bg-foreground text-background border border-foreground -translate-y-1 scale-[1.03] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                <img src={dir.img} alt={dir.name} className="w-10 h-10 rounded-full mx-auto mb-2 bg-white border border-border" />
                <h4 className="text-[13px] font-semibold mb-0.5">{dir.name}</h4>
                <span className="text-[9px] block mb-2 text-background/60">{dir.role}</span>
                <span className="text-[7px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 border rounded inline-block border-background/30 text-background/60">{dir.teamLabel}</span>
              </div>
              <button onClick={() => navDir(1)} className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground shrink-0">→</button>
            </div>

            {/* Dots */}
            <div className="flex gap-1.5 justify-center my-3">
              {directors.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeDir ? "w-5 bg-foreground" : "w-1.5 bg-border"}`} />
              ))}
            </div>

            <div className="w-px bg-border mx-auto" style={{ height: 24 }} />

            {/* Managers */}
            <div className="w-full max-w-[900px] transition-opacity duration-300" key={activeDir}>
              <div className="text-center mb-5 mt-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Managers — {dir.teamLabel}<span className="ml-1.5 opacity-60">({dir.managers.length})</span>
                </span>
              </div>
              <div className="flex gap-3 justify-center flex-wrap mb-2">
                {dir.managers.map(m => (
                  <div key={m.name} className="px-4 py-3.5 rounded-xl text-center w-[110px] bg-background text-foreground border border-border transition-all duration-200">
                    <img src={m.img} alt={m.name} className="w-9 h-9 rounded-full mx-auto mb-2 bg-white border border-border" />
                    <h4 className="text-xs font-semibold mb-0.5 truncate">{m.name}</h4>
                    <span className="text-[9px] block mb-2 truncate text-muted-foreground">{m.role}</span>
                    <div className="text-[7px] font-bold uppercase tracking-[0.08em] px-1.5 py-0.5 border rounded inline-block border-border text-muted-foreground">{m.badge}</div>
                  </div>
                ))}
              </div>

              <div className="w-px bg-border mx-auto" style={{ height: 40 }} />

              {/* Teams */}
              <div className="text-center mb-5 mt-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Équipes — {dir.teamLabel}
                </span>
              </div>
              <div className={`grid gap-5 mx-auto ${dir.teams.length === 1 ? "grid-cols-1 max-w-[300px]" : dir.teams.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
                {dir.teams.map(t => {
                  const count = Math.max(1, Math.round(productCount * t.agentMultiplier));
                  const shown = Math.min(3, count);
                  const extra = count - shown;
                  return (
                    <div key={t.name} className="p-6 border border-dashed border-border rounded-2xl bg-background text-center transition-all w-full">
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <div className="flex ml-2">
                          {[...Array(shown)].map((_, j) => (
                            <div key={j} className="w-[30px] h-[30px] rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground"
                              style={{ marginLeft: j > 0 ? -8 : 0, zIndex: shown - j }}>
                              {j + 1}
                            </div>
                          ))}
                        </div>
                        {extra > 0 && <span className="text-[11px] text-muted-foreground ml-1">+{extra}</span>}
                      </div>
                      <h4 className="text-[15px] font-semibold text-foreground mb-1">{t.name}</h4>
                      <p className="text-[13px] text-muted-foreground mb-2.5">{count} {count > 1 ? "créateurs" : "créateur"}</p>
                      <span className="text-[10px] text-muted-foreground/70">{t.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats footer */}
            <div className="mt-12 w-full max-w-[900px]">
              <div className="w-px bg-border mx-auto" style={{ height: 40 }} />
              <div className="bg-foreground text-background rounded-2xl px-6 md:px-10 py-6 md:py-7 flex flex-col md:flex-row items-center gap-5 md:gap-10 max-w-[800px] mx-auto">
                <div className="shrink-0 text-center md:text-left">
                  <div className="text-[40px] md:text-[56px] font-light tracking-tight italic font-['Instrument_Serif'] leading-none text-white">{totalAgents}</div>
                  <div className="text-[10px] text-white/50 uppercase tracking-[0.15em] mt-2">Total agents actifs</div>
                </div>
                <div className="grid grid-cols-2 md:flex gap-5 md:gap-10 md:ml-auto">
                  {directors.map((d, i) => (
                    <div key={d.name} className="text-center">
                      <div className="text-[24px] md:text-[32px] font-light italic font-['Instrument_Serif'] leading-none text-white">{teamTotals[i]}</div>
                      <div className="text-[8px] md:text-[9px] uppercase tracking-[0.12em] text-white/50 mt-1.5 md:mt-2">{d.teamLabel}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
