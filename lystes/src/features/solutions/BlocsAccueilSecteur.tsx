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
  }
  return { style, bento: bento?.outerHTML ?? "", bande: bande?.outerHTML ?? "" };
}

export default function BlocsAccueilSecteur({ secteur }: { secteur: Secteur }) {
  const lang = "fr";
  const reglage = REGLAGES[secteur];
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
      {/* 1. Le bento « Vendez davantage… » */}
      <div className="biolystes-ai-scope px-4 sm:px-6 lg:px-0">
        <div className="wrap" dangerouslySetInnerHTML={{ __html: blocs.bento }} />
      </div>
      {/* 2. Data intelligent */}
      <div className="biolystes-ai-scope px-4 sm:px-6 lg:px-0">
        <div className="wrap" style={{ margin: "44px auto" }}>
          <DataIntelligentBanner lang={lang} essayages={reglage.essayages} />
        </div>
      </div>
      {/* 3. Le carrousel « De combien augmenterait… » */}
      <div dangerouslySetInnerHTML={{ __html: blocs.bande }} />
      {/* 4. Les créateurs, sur le secteur de la page */}
      <HomeCreatorsGallery sansGeneration secteur={reglage.createurs} />
      {/* 5. L'organigramme */}
      <Hierarchy className="pt-10 md:pt-14" />

      {/* biolystes.com : pas de bouton « Appeler Cléa », le seul appel à
          l’action de la page est le rendez-vous. */}
      {slots.face && createPortal(<FaceMeshScanner imageUrl={diagnosticFace} />, slots.face)}
      {slots.chat && createPortal(<AnimatedChat />, slots.chat)}
      {slots.titre && createPortal(<HeroRotatingTitle lang={lang} {...getSecondHeroCopy(lang)} />, slots.titre)}
    </div>
  );
}
