import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import rawTemplate from "./agents-vision-page.tmpl.html?raw";
import { interpolate, prepare, useCartes6Dots } from "./AgentsVisionRawPage";
import DataIntelligentBanner from "./DataIntelligentBanner";
import { getSecondHeroCopy, HeroRotatingTitle } from "./HeroRotatingTitle";
import { HomeCreatorsGallery } from "./HomeCreatorsGallery";
import { Hierarchy } from "@lystes/components/landing/Hierarchy";
import { CallClaireButton } from "@lystes/components/CallClaireButton";
import { AnimatedChat } from "@lystes/features/landing-particuliers/pages/pro-offer/components/AnimatedChat";
import { FaceMeshScanner } from "@lystes/features/landing-particuliers/components/diagnostic/FaceMeshScanner";
import diagnosticFace from "@lystes/features/landing-particuliers/pages/diagnostic-agent/assets/diagnostic-face.jpg";
import { getHomeLocale } from "@lystes/i18n/home-locale";
import { ArrowRight } from "lucide-react";

/**
 * Les blocs de l'accueil montés sur une page de marque blanche, filtrés sur
 * un secteur (12/10/2026) : /bio en cosmétique (« en ne laissant que des
 * choses en lien avec la cosmétique »), /crea en mode.
 *
 * Aucune copie : le bento et le carrousel des équipes sont lus dans le gabarit
 * de l'accueil (agents-vision-page.tmpl.html), préparé et traduit par les
 * mêmes fonctions que l'accueil ; les autres blocs sont les composants de
 * l'accueil. Le filtre ne touche que la copie montée ici. Pour chaque
 * secteur :
 *  - les cartes du carrousel retirées ;
 *  - la série gardée dans chaque portfolio (photographes, UGC), les autres
 *    séries partent avec leurs onglets ;
 *  - l'onglet Essayages de Data intelligent, gardé ou non ;
 *  - le secteur de la galerie des créateurs.
 */
export type Secteur = "cosmetique" | "mode";

type Reglage = {
  /** Mots qui retirent une carte quand son titre les contient. */
  cartesRetirees: string[];
  /** Série gardée, par sa classe dans le gabarit. */
  photographes: string;
  ugc: string;
  essayages: boolean;
  /** Secteur de /creator. */
  createurs: string;
  /** Blocs retirés de la page en entier. */
  blocsRetires?: ("bento" | "data" | "organigramme")[];
  /** Les titres des blocs au format de l'en-tête commun de /bio. */
  enteteCommun?: boolean;
  /** La ligne de secteurs de la fenêtre des créateurs est recadrée. */
  sansOnglets?: boolean;
  /** Le lien de chaque carte (« En savoir plus » de l'accueil) remplacé. */
  lienCartes?: { libelle: string; href: string };
};

const REGLAGES: Record<Secteur, Reglage> = {
  /* /bio : sans l'essayage virtuel (une tenue de mode) ni l'événementiel
     (une table de réception) ; séries cosmétiques. */
  cosmetique: {
    cartesRetirees: ["essayage virtuel", "événementiel"],
    photographes: "s1",
    ugc: "u1",
    essayages: false,
    createurs: "cosmetique",
    /* 14/10/2026 (JP) : le bento « Vendez davantage… », Data intelligent et
       « Combien d'agents IA composeront… » retirés de biolystes.com. */
    blocsRetires: ["bento", "data", "organigramme"],
    /* 14/10/2026 (JP) : le lien des cartes devient « Prendre rendez-vous »,
       vers la prise de rendez-vous (nouvel onglet). */
    lienCartes: { libelle: "Prendre rendez-vous", href: "https://biolystes.pro/rdv" },
    /* 14/10/2026 (JP, « uniformise tout ») : mêmes titres que le reste de /bio. */
    enteteCommun: true,
    /* 15/10/2026 (JP, « enlève Fashion en page d'accueil ») : la ligne de
       secteurs de la fenêtre des créateurs est masquée sur biolystes.com. */
    sansOnglets: true,
  },
  /* /crea : l'essayage virtuel a toute sa place ; le diagnostic beauté (un
     visage) et l'événementiel partent. Séries Lookbook et Fashion, créateurs
     sur l'onglet Fashion. */
  mode: {
    cartesRetirees: ["diagnostic beauté", "événementiel"],
    photographes: "s5",
    ugc: "u2",
    essayages: true,
    createurs: "fashion",
  },
};

/** Ne garde qu'une série dans un portfolio. La série gardée prend la place
 *  et le nom de la première (s1, u1), que les styles du gabarit affichent
 *  quand le premier bouton est coché. */
function garderSerie(pf: Element, classe: string) {
  const premiere = classe.charAt(0) + "1";
  const gardee = pf.querySelector(`.pf-slide.${classe}`);
  pf.querySelectorAll(".pf-slide").forEach((s) => { if (s !== gardee) s.remove(); });
  gardee?.classList.replace(classe, premiere);
  pf.querySelectorAll(".pf-radio").forEach((r, i) => {
    if (i > 0) r.remove();
    else r.setAttribute("checked", "");
  });
  pf.querySelector(".pf-tabs")?.remove();
}

function extraire(lang: string, reglage: Reglage) {
  const { fr, current } = getHomeLocale("agents-autonomes", lang);
  const { beforeHtml } = prepare(rawTemplate, true);
  const doc = new DOMParser().parseFromString(interpolate(beforeHtml, current, fr), "text/html");

  /* Les styles du gabarit, sans la seule règle qui ne vise pas son cadre
     (.max-w-3xl) : elle élargirait les titres de la page. */
  const style = (doc.querySelector("style")?.textContent ?? "").replace(/\.max-w-3xl\s*\{[^}]*\}/, "");

  const bento = doc.querySelector(".bento-syn");

  const bande = doc.querySelector("#agents-biolystes")?.closest(".biolystes-ai-scope");
  if (bande) {
    for (const carte of Array.from(bande.querySelectorAll(".cartes6 > div"))) {
      const titre = (carte.querySelector("h4")?.textContent ?? "").toLowerCase();
      if (reglage.cartesRetirees.some((x) => titre.includes(x))) carte.remove();
    }
    for (const pf of Array.from(bande.querySelectorAll(".wf-portfolio"))) {
      garderSerie(pf, pf.classList.contains("pf-2") ? reglage.ugc : reglage.photographes);
    }
    if (reglage.lienCartes) {
      for (const a of Array.from(bande.querySelectorAll<HTMLAnchorElement>(".cartes6 > div > a[href]"))) {
        a.setAttribute("href", reglage.lienCartes.href);
        if (/^https?:/.test(reglage.lienCartes.href)) {
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        }
        const texte = Array.from(a.childNodes).find((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
        if (texte) texte.textContent = reglage.lienCartes.libelle + " ";
      }
    }
  }
  /* 14/10/2026 (JP) : l'appel à l'action « En savoir plus » vers la page des
     agents IA, monté sous la description du bandeau. */
  const desc = bande?.querySelector("#agents-biolystes > .reveal > p");
  if (desc) {
    const cta = doc.createElement("div");
    cta.id = "agents-cta-slot";
    cta.setAttribute("style", "display:flex;justify-content:center;margin-top:28px");
    desc.insertAdjacentElement("afterend", cta);
  }
  return { style, bento: bento?.outerHTML ?? "", bande: bande?.outerHTML ?? "" };
}

/* bandeSeule (biolystes.com, 23/10/2026, JP, page À propos) : ne monte que le
   carrousel des équipes IA, le même que sur l'accueil (même extraction, mêmes
   cartes, mêmes réglages), sans le bento, Data intelligent, la galerie des
   créateurs ni l'organigramme. */
export default function BlocsAccueilSecteur({ secteur, bandeSeule = false }: { secteur: Secteur; bandeSeule?: boolean }) {
  const lang = "fr";
  const reglage = REGLAGES[secteur];
  const retire = (bloc: "bento" | "data" | "organigramme") => bandeSeule || (reglage.blocsRetires?.includes(bloc) ?? false);
  const blocs = useMemo(() => extraire(lang, reglage), [reglage]);
  const racine = useRef<HTMLDivElement>(null);
  const [slots, setSlots] = useState<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const el = racine.current;
    if (!el) return;
    const q = (id: string) => el.querySelector<HTMLElement>(`#${id}`);
    setSlots({
      clea: q("call-clea-slot"),
      face: q("diagnostic-facemesh-slot"),
      chat: q("conseillers-chat-slot"),
      titre: q("hero-title-slot-2"),
      cta: q("agents-cta-slot"),
    });
  }, [blocs]);

  useCartes6Dots(blocs);

  return (
    <div ref={racine} className="blocs-secteur">
      <style>{blocs.style}</style>
      {/* Réglages propres à ces pages (l'accueil n'est pas touché) : aucun
          mot seul en fin de titre, et des titres de cartes plus grands que
          leur texte. */}
      <style>{`
        .blocs-secteur h2, .blocs-secteur h3, .blocs-secteur h4 { text-wrap: balance; }
        .blocs-secteur .cartes6 h4 { font-size: 15px; }
      `}</style>
      {/* En-tête commun de /bio : le titre du carrousel des équipes reprend la
          taille, la graisse et la description des autres blocs. */}
      {reglage.enteteCommun && <style>{`
        .blocs-secteur #agents-biolystes > .reveal h2 { font-size: 24px !important; font-weight: 300 !important;
          line-height: 1.375 !important; letter-spacing: -0.025em !important; max-width: min(100%, 18em); margin: 0 auto; text-wrap: pretty; }
        @media (min-width: 1024px) { .blocs-secteur #agents-biolystes > .reveal h2 { font-size: 36px !important; } }
        .blocs-secteur #agents-biolystes > .reveal p { font-size: 16px !important; line-height: 1.625 !important;
          color: hsl(var(--foreground)) !important; max-width: 36rem !important; }
      `}</style>}
      {/* 1. Le bento « Vendez davantage… » */}
      {!retire("bento") && (
        <div className="biolystes-ai-scope px-4 sm:px-6 lg:px-0">
          <div className="wrap" dangerouslySetInnerHTML={{ __html: blocs.bento }} />
        </div>
      )}
      {/* 2. Data intelligent */}
      {!retire("data") && (
        <div className="biolystes-ai-scope px-4 sm:px-6 lg:px-0">
          <div className="wrap" style={{ margin: "44px auto" }}>
            <DataIntelligentBanner lang={lang} essayages={reglage.essayages} />
          </div>
        </div>
      )}
      {/* 3. Le carrousel « De combien augmenterait… » */}
      <div dangerouslySetInnerHTML={{ __html: blocs.bande }} />
      {/* 4. Les créateurs, sur le secteur de la page */}
      {!bandeSeule && <HomeCreatorsGallery sansGeneration secteur={reglage.createurs} langue={lang} enteteCommun={reglage.enteteCommun} sansOnglets={reglage.sansOnglets} />}
      {/* 5. L'organigramme */}
      {!retire("organigramme") && <Hierarchy className="pt-10 md:pt-14" />}

      {/* biolystes.com : pas de bouton « Appeler Cléa », le seul appel à
          l’action de la page est le rendez-vous. */}
      {slots.face && createPortal(<FaceMeshScanner imageUrl={diagnosticFace} />, slots.face)}
      {slots.chat && createPortal(<AnimatedChat />, slots.chat)}
      {slots.titre && createPortal(<HeroRotatingTitle lang={lang} {...getSecondHeroCopy(lang)} />, slots.titre)}
      {slots.cta && createPortal(<a href="https://www.biolystes.com/agents-ia" className="btn-outline"><span>En savoir plus</span><span className="arrow-circle"><ArrowRight className="w-3.5 h-3.5" /></span></a>, slots.cta)}
    </div>
  );
}
