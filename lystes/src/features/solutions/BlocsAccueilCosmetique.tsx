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
 * Les blocs de l'accueil que JP garde sur /bio (12/10/2026), filtrés sur la
 * cosmétique : « en ne laissant que des choses en lien avec la cosmétique ».
 *
 * Aucune copie : le bento et le carrousel des équipes sont lus dans le gabarit
 * de l'accueil (agents-vision-page.tmpl.html), préparé et traduit par les
 * mêmes fonctions que l'accueil ; les autres blocs sont les composants de
 * l'accueil. Le filtre ne touche que la copie montée ici :
 *  - carrousel : sans l'essayage virtuel (une tenue de mode) ni l'événementiel
 *    (une table de réception) ;
 *  - portfolios des cartes (photographes, UGC) : seule la série cosmétique
 *    reste, les séries lifestyle, studio sport, food, lookbook et fashion
 *    sont retirées avec leurs onglets ;
 *  - Data intelligent : sans l'onglet Essayages ;
 *  - créateurs : déjà en cosmétique seule.
 */
const CARTES_RETIREES = ["essayage virtuel", "événementiel"];

function extraire(lang: string) {
  const { fr, current } = getHomeLocale("agents-autonomes", lang);
  const { beforeHtml } = prepare(rawTemplate, true);
  const doc = new DOMParser().parseFromString(interpolate(beforeHtml, current, fr), "text/html");

  /* Les styles du gabarit, sans la seule règle qui ne vise pas son cadre
     (.max-w-3xl) : elle élargirait les titres de /bio. */
  const style = (doc.querySelector("style")?.textContent ?? "").replace(/\.max-w-3xl\s*\{[^}]*\}/, "");

  const bento = doc.querySelector(".bento-syn");

  const bande = doc.querySelector("#agents-biolystes")?.closest(".biolystes-ai-scope");
  if (bande) {
    for (const carte of Array.from(bande.querySelectorAll(".cartes6 > div"))) {
      const titre = (carte.querySelector("h4")?.textContent ?? "").toLowerCase();
      if (CARTES_RETIREES.some((x) => titre.includes(x))) carte.remove();
    }
    for (const pf of Array.from(bande.querySelectorAll(".wf-portfolio"))) {
      pf.querySelectorAll(".pf-slide").forEach((s, i) => { if (i > 0) s.remove(); });
      pf.querySelectorAll(".pf-radio").forEach((r, i) => { if (i > 0) r.remove(); });
      pf.querySelector(".pf-tabs")?.remove();
    }
  }
  return { style, bento: bento?.outerHTML ?? "", bande: bande?.outerHTML ?? "" };
}

export default function BlocsAccueilCosmetique() {
  const lang = "fr";
  const blocs = useMemo(() => extraire(lang), []);
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
    <div ref={racine} className="bio-blocs">
      <style>{blocs.style}</style>
      {/* Réglages propres à /bio (l'accueil n'est pas touché) : aucun mot seul
          en fin de titre, et des titres de cartes plus grands que leur texte. */}
      <style>{`
        .bio-blocs h2, .bio-blocs h3, .bio-blocs h4 { text-wrap: balance; }
        .bio-blocs .cartes6 h4 { font-size: 15px; }
      `}</style>
      {/* 1. Le bento « Vendez davantage… » */}
      <div className="biolystes-ai-scope px-4 sm:px-6 lg:px-0">
        <div className="wrap" dangerouslySetInnerHTML={{ __html: blocs.bento }} />
      </div>
      {/* 2. Data intelligent */}
      <div className="biolystes-ai-scope px-4 sm:px-6 lg:px-0">
        <div className="wrap" style={{ margin: "44px auto" }}>
          <DataIntelligentBanner lang={lang} essayages={false} />
        </div>
      </div>
      {/* 3. Le carrousel « De combien augmenterait… » */}
      <div dangerouslySetInnerHTML={{ __html: blocs.bande }} />
      {/* 4. Les créateurs, en cosmétique seule */}
      <HomeCreatorsGallery sansGeneration />
      {/* 5. L'organigramme */}
      <Hierarchy className="pt-10 md:pt-14" />

      {slots.clea && createPortal(<CallClaireButton variant="inline" />, slots.clea)}
      {slots.face && createPortal(<FaceMeshScanner imageUrl={diagnosticFace} />, slots.face)}
      {slots.chat && createPortal(<AnimatedChat />, slots.chat)}
      {slots.titre && createPortal(<HeroRotatingTitle lang={lang} {...getSecondHeroCopy(lang)} />, slots.titre)}
    </div>
  );
}
