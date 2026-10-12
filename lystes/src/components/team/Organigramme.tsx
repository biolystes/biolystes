/**
* Organigramme — Composant interactif (3 variantes)
*
* backoffice : Interactif, modales profil, fiches d'équipe cliquables. /dashboard/my-team
* onboarding : Même chose + animation compteur 0→total. Onboarding post-synchronisation
* landing    : Lecture seule, chiffres fixes, auto-rotation seule. Page d'accueil
*/
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@lystes/lib/utils";
import { getJsxT } from "@lystes/i18n/jsx-locale";
import { useAgentCounts, computeAgentCounts } from "@lystes/hooks/useAgentCounts";
import { useSectorFeatures } from "@lystes/hooks/useSectorConfig";
import { buildOrgData, type OrgAgent, type OrgData, type OrgDirector, type OrgTeam, type CoworkCard } from "./organigramme-data";

type OrgVariant = "backoffice" | "onboarding" | "landing";

interface OrganigrammeProps {
  variant?: OrgVariant;
  fixedProductCount?: number;
  /**
   * Jeu de donnees a afficher. Omis, c'est celui de l'accueil, inchange :
   * ce composant se comporte exactement comme avant pour tous ses appelants
   * existants. `/business` passe le sien, qui decrit des metiers d'entreprise
   * et non des produits de catalogue.
   */
  data?: OrgData;
}

// ─── Sous-composants ──────────────────────────────────────────────────────────

function VerticalLine({ h = 40 }: { h?: number }) {
  return <div className="w-px bg-border mx-auto" style={{ height: h }} />;
}

function SectionLabel({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <div className="text-center mb-5 mt-2">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {children}{count !== undefined && <span className="ml-1.5 opacity-60">({count})</span>}
      </span>
    </div>
  );
}

function AvatarBubbles({ count }: { count: number }) {
  const shown = Math.min(count, 3);
  const rest = count - shown;
  return (
    <div className="flex items-center justify-center gap-1 mb-3">
      <div className="flex ml-2">
        {Array.from({ length: shown }).map((_, i) => (
          <div key={i} className="w-[30px] h-[30px] rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground" style={{ marginLeft: i > 0 ? -8 : 0, zIndex: shown - i }}>
            {i + 1}
          </div>
        ))}
      </div>
      {rest > 0 && <span className="text-[11px] text-muted-foreground ml-1">+{rest}</span>}
    </div>
  );
}

function ProfileModal({ agent, onClose }: { agent: OrgAgent | null; onClose: () => void }) {
  if (!agent) return null;
  return (
    <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] animate-in fade-in duration-200">
      <div onClick={e => e.stopPropagation()} className="bg-background rounded-2xl p-9 max-w-[400px] w-[90%] relative animate-in slide-in-from-bottom-5 duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:bg-muted rounded-lg w-8 h-8 flex items-center justify-center">×</button>
        <div className="text-center mb-5">
          <div className="w-[72px] h-[72px] rounded-full mx-auto mb-3.5 flex items-center justify-center bg-white border-0">
            <img src={agent.avatar} alt={agent.name} className="w-[52px] h-[52px] rounded-full" />
          </div>
          <h3 className="text-xl font-bold">{agent.name}</h3>
          <span className="text-[13px] text-muted-foreground">{agent.title}</span>
            {agent.tag && <div className="mt-2.5"><span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 border-0 rounded text-muted-foreground">{agent.tag}</span></div>}
          {agent.mission && <div className="mt-2.5"><span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2.5 py-1 bg-foreground rounded text-background">Mission : {agent.mission}</span></div>}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground text-center">{agent.bio}</p>
      </div>
    </div>
  );
}

function CEOCard({ data, onClick, interactive, accessLabel }: { data: OrgAgent; onClick: (a: OrgAgent) => void; interactive: boolean; accessLabel: string }) {
  return (
    <div onClick={() => interactive && onClick(data)} className={cn("bg-foreground text-background px-5 md:px-8 py-4 md:py-5 rounded-xl flex items-center justify-between gap-4 md:gap-6 min-w-0 md:min-w-[320px] w-full max-w-[400px] transition-all", interactive && "cursor-pointer hover:opacity-90 hover:scale-[1.01]")}>
      <div className="flex items-center gap-3.5">
        <img src={data.avatar} alt={data.name} className="w-[46px] h-[46px] rounded-full bg-white" style={{ objectFit: 'contain' }} />
        <div>
          <h4 className="text-base font-semibold">{data.name}</h4>
          <span className="text-xs text-background/70">{data.title}</span>
        </div>
      </div>
      <div className="text-[9px] font-bold uppercase tracking-[0.1em] px-2.5 py-1.5 border border-muted-foreground/30 rounded text-muted-foreground">{accessLabel}</div>
    </div>
  );
}

function DirectorCard({ director, isActive, onSelect, onProfile, interactive }: { director: OrgDirector; isActive: boolean; onSelect: () => void; onProfile: (a: OrgAgent) => void; interactive: boolean }) {
  return (
    <div className={cn(
      "px-5 py-4 rounded-xl text-center w-[160px] relative transition-all duration-[350ms]",
      isActive ? "org-directeur-actif bg-foreground text-background border-0 -translate-y-1 scale-[1.03]" : "bg-[#f9f9f9] text-foreground border-0 hover:-translate-y-0.5",
      interactive && "cursor-pointer"
    )}>
      <div onClick={() => interactive && onProfile(director)}>
        <img src={director.avatar} alt={director.name} className="w-10 h-10 rounded-full mx-auto mb-2 bg-white border-0" />
        <h4 className="text-[13px] font-semibold mb-0.5">{director.name}</h4>
        <span className={cn("text-[9px] block mb-2", isActive ? "text-background/60" : "text-muted-foreground")}>{director.title}</span>
      </div>
        <button onClick={e => { e.stopPropagation(); onSelect(); }} className={cn("text-[7px] font-bold uppercase tracking-[0.08em] px-2 py-0.5 rounded inline-block", isActive ? "border-background/30 text-background/60" : "border-0 text-muted-foreground")}>
        {director.label}
      </button>
      {isActive && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-foreground" />}
    </div>
  );
}

function ManagerCard({ manager, onClick, interactive }: { manager: OrgAgent; onClick: (a: OrgAgent) => void; interactive: boolean }) {
  const s = manager.isSpecialist;
  return (
    <div onClick={() => interactive && onClick(manager)} className={cn(
      "px-4 py-3.5 rounded-xl text-center w-[110px] transition-all duration-200",
      s ? "bg-foreground text-background border-0" : "bg-[#f9f9f9] text-foreground border-0",
      interactive && "cursor-pointer hover:-translate-y-[3px] ",
      interactive && !s && "hover:border-foreground"
    )}>
      <img src={manager.avatar} alt={manager.name} className="w-9 h-9 rounded-full mx-auto mb-2 bg-white border-0" />
      <h4 className="text-xs font-semibold mb-0.5 truncate">{manager.name}</h4>
      <span className={cn("text-[9px] block mb-2 truncate", s ? "text-background/60" : "text-muted-foreground")}>{manager.title}</span>
        {manager.tag && <div className={cn("text-[7px] font-bold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded inline-block", s ? "border-background/30 text-background/60" : "border-0 text-muted-foreground")}>{manager.tag}</div>}
    </div>
  );
}

function OrgTeamCard({ team, interactive }: { team: OrgTeam; interactive: boolean }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => interactive && team.href && navigate(team.href)} className={cn("p-6 border-dashed border-0 rounded-2xl bg-background text-center transition-all w-full outline-none", interactive && "cursor-pointer hover:border-foreground hover:bg-muted/60")}>
      <AvatarBubbles count={team.count} />
      <h4 className="text-[15px] font-semibold text-foreground mb-1">{team.name}</h4>
      <p className="text-[13px] text-muted-foreground mb-2.5">{team.subtitle}</p>
      <span className="text-[10px] text-muted-foreground/70">{team.description}</span>
    </button>
  );
}

function CoworkBanner({ cowork, interactive }: { cowork: CoworkCard; interactive: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => interactive && navigate(cowork.href)}
      className={cn(
        "w-full max-w-[600px] mx-auto p-6 border-dashed border-0 rounded-2xl bg-background text-center transition-all outline-none",
        interactive && "cursor-pointer hover:border-foreground hover:bg-muted/60"
      )}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <h4 className="text-[15px] font-semibold text-foreground">{cowork.name}{"\u00a0: "}Assistant IA stratégique</h4>
      </div>
      <p className="text-[13px] text-muted-foreground">{cowork.description}</p>
    </button>
  );
}

function ProgressDots({ total, active }: { total: number; active: number }) {
  return (
    <div className="flex gap-1.5 justify-center my-3">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={cn("h-1.5 rounded-full transition-all duration-300", i === active ? "w-5 bg-foreground" : "w-1.5 bg-border")} />
      ))}
    </div>
  );
}

function TotalBanner({ directors }: { directors: OrgDirector[] }) {
  const totals = directors.map(d => ({
    label: d.label,
    count: d.teams.reduce((s, t) => s + t.count, 0) + d.managers.length,
  }));
  const grandTotal = totals.reduce((s, t) => s + t.count, 0) + 1 + directors.length; // +PDG+N directeurs
  return (
      <div className="bg-foreground text-background rounded-2xl px-6 md:px-10 py-6 md:py-7 flex flex-col md:flex-row items-center gap-5 md:gap-10 max-w-[800px] mx-auto">
      <div className="shrink-0 text-center md:text-left">
        <div className="text-[40px] md:text-[56px] font-light tracking-tight italic font-['Inter'] leading-none text-white">{grandTotal}</div>
        <div className="text-[10px] text-white/50 uppercase tracking-[0.15em] mt-2">Total agents actifs</div>
      </div>
      <div className="grid grid-cols-2 md:flex gap-5 md:gap-10 md:ml-auto">
        {totals.map(t => (
          <div key={t.label} className="text-center">
            <div className="text-[24px] md:text-[32px] font-light italic font-['Inter'] leading-none text-white">{t.count}</div>
            <div className="text-[8px] md:text-[9px] uppercase tracking-[0.12em] text-white/50 mt-1.5 md:mt-2">{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NavArrow({ dir, onClick }: { dir: "l" | "r"; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-9 h-9 rounded-full border-0 bg-background flex items-center justify-center text-base text-muted-foreground transition-all hover:bg-foreground hover:text-background hover:border-foreground flex-shrink-0">
      {dir === "l" ? "←" : "→"}
    </button>
  );
}

// ─── Composant principal ────────────────────────────────────────────────────────────────────

export default function Organigramme({ variant = "backoffice", fixedProductCount, data }: OrganigrammeProps) {
  const { i18n } = useTranslation();
  const t = getJsxT("home-blocks", i18n.language || "fr");
  /* Jamais de tiret long dans un texte visible (règle de JP) : deux-points,
     avec l'espace insécable du français devant, sans espace ailleurs. */
  const deuxPoints = (i18n.language || "fr").toLowerCase().startsWith("fr") ? "\u00a0: " : ": ";
  const isLanding = variant === "landing";
  const isOnboarding = variant === "onboarding";
  const interactive = !isLanding;

  const dynamicCounts = useAgentCounts();
  const sectorFeatures = useSectorFeatures();
  const hasDiag = sectorFeatures?.hasDiagnostic ?? false;

  const counts = isLanding && fixedProductCount !== undefined
    ? computeAgentCounts(fixedProductCount, 140, hasDiag)
    : dynamicCounts;

  const sourceOrgData = data ?? buildOrgData(counts, hasDiag);
  const translateAgent = (agent: OrgAgent): OrgAgent => ({
    ...agent,
    title: t(agent.title),
    tag: agent.tag ? t(agent.tag) : undefined,
    bio: t(agent.bio),
    mission: agent.mission ? t(agent.mission) : undefined,
  });
  const orgData = {
    ceo: translateAgent(sourceOrgData.ceo),
    directors: sourceOrgData.directors.map((director) => ({
      ...translateAgent(director),
      id: director.id,
      label: t(director.label),
      managers: director.managers.map(translateAgent),
      teams: director.teams.map((team) => ({
        ...team,
        name: t(team.name),
        description: t(team.description),
        subtitle: team.subtitle.replace(/([A-Za-zÀ-ÿ-]+)$/u, (word) => t(word)),
      })),
      cowork: director.cowork ? {
        ...director.cowork,
        description: t(director.cowork.description),
        cta: t(director.cowork.cta),
      } : undefined,
    })),
  };

  // État de la rotation automatique
  const [activeDir, setActiveDir] = useState(0);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<OrgAgent | null>(null);
  const [opacity, setOpacity] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cur = orgData.directors[activeDir];

  useEffect(() => {
    if (paused || selected) return;
    timerRef.current = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setActiveDir(p => (p + 1) % orgData.directors.length);
        setOpacity(1);
      }, 250);
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, selected, orgData.directors.length]);

  const goTo = useCallback((i: number) => {
    setPaused(true);
    setOpacity(0);
    setTimeout(() => { setActiveDir(i); setOpacity(1); }, 200);
  }, []);

  const openProfile = useCallback((a: OrgAgent) => { if (interactive) setSelected(a); }, [interactive]);

  // Onboarding : compteur animé
  const [displayTotal, setDisplayTotal] = useState(isOnboarding ? 0 : counts.grandTotal);
  useEffect(() => {
    if (!isOnboarding) { setDisplayTotal(counts.grandTotal); return; }
    const target = counts.grandTotal;
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / 2000, 1);
      setDisplayTotal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isOnboarding, counts.grandTotal]);

  if ('loading' in counts && (counts as any).loading) {
    return <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" /></div>;
  }

  return (
    <div className="py-10 px-5">
      <div className="max-w-[1100px] mx-auto flex flex-col items-center">

        {/* Total animé de l'onboarding */}
        {isOnboarding && (
          <div className="text-center mb-8">
            <div className="text-[64px] font-bold leading-none tracking-tight">{displayTotal}</div>
            <div className="text-base text-muted-foreground">agents IA dédiés à votre boutique</div>
          </div>
        )}

        {/* PDG */}
        <CEOCard data={orgData.ceo} onClick={openProfile} interactive={interactive} accessLabel={t("Accès 360°")} />
        <VerticalLine h={40} />

        {/* Ligne des directeurs */}
        <SectionLabel>{t("Directeurs")}</SectionLabel>
        {/* Bureau : tous les directeurs visibles */}
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="hidden md:flex gap-3 justify-center flex-wrap items-center">
          <NavArrow dir="l" onClick={() => goTo((activeDir - 1 + orgData.directors.length) % orgData.directors.length)} />
          {orgData.directors.map((d, i) => (
            <DirectorCard key={d.id} director={d} isActive={activeDir === i} onSelect={() => goTo(i)} onProfile={openProfile} interactive={interactive} />
          ))}
          <NavArrow dir="r" onClick={() => goTo((activeDir + 1) % orgData.directors.length)} />
        </div>
        {/* Mobile : un seul directeur actif avec des flèches */}
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="flex md:hidden gap-4 justify-center items-center">
          <NavArrow dir="l" onClick={() => goTo((activeDir - 1 + orgData.directors.length) % orgData.directors.length)} />
          <DirectorCard director={cur} isActive={true} onSelect={() => goTo(activeDir)} onProfile={openProfile} interactive={interactive} />
          <NavArrow dir="r" onClick={() => goTo((activeDir + 1) % orgData.directors.length)} />
        </div>
        <ProgressDots total={orgData.directors.length} active={activeDir} />
        <VerticalLine h={24} />

        {/* Managers + équipes du directeur actif */}
        <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="w-full max-w-[900px] transition-opacity duration-300" style={{ opacity }}>
          <SectionLabel count={cur.managers.length}>{cur.id === "analytics" ? t("Analystes") : t("Managers")}{deuxPoints}{cur.label}</SectionLabel>
          <div className="flex gap-3 justify-center flex-wrap mb-2">
            {cur.managers.map(m => <ManagerCard key={m.name} manager={m} onClick={openProfile} interactive={interactive} />)}
          </div>
          {cur.teams.length > 0 && (
            <>
              <VerticalLine h={40} />
              <SectionLabel>{t("Équipes")}{deuxPoints}{cur.label}</SectionLabel>
              <div className={cn("grid gap-5 mx-auto", cur.teams.length === 1 ? "grid-cols-1 max-w-[400px]" : cur.teams.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3")}>
                {cur.teams.map(t => <OrgTeamCard key={t.name} team={t} interactive={interactive} />)}
              </div>
            </>
          )}
          {cur.cowork && (
            <div className="flex flex-col items-center w-full">
              <VerticalLine h={40} />
              <CoworkBanner cowork={cur.cowork} interactive={interactive} />
            </div>
          )}
        </div>
      </div>

      {/* Modale de profil */}
      {interactive && selected && <ProfileModal agent={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
