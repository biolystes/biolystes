import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
/* Copie de l'accueil pour `/accueil-v2` (09/10/2026, JP). Ce fichier est la
   copie de `AgentsAutonomesRawPage.tsx`, son gabarit celle de
   `agents-autonomes-page.tmpl.html`. Les fichiers de l'accueil ne sont pas
   importés : toucher `/accueil-v2` ne peut pas casser `/`.
   Seuls écarts avec l'accueil : la zone de la démonstration PUREGAIN, qui
   porte les quatre étages de la vision (VisionEtages.tsx), et la balise
   robots « noindex ». */
import rawTemplate from "./agents-vision-page.tmpl.html?raw";
import VisionEtages from "./VisionEtages";
import { CommeSurAccueil } from "./CommeSurAccueil";
import { Hierarchy } from "@lystes/components/landing/Hierarchy";
import { AnimatedChat } from "@lystes/features/landing-particuliers/pages/pro-offer/components/AnimatedChat";
import { FaceMeshScanner } from "@lystes/features/landing-particuliers/components/diagnostic/FaceMeshScanner";
import { VideoPromptBanner } from "./VideoPromptBanner";
import DataIntelligentBanner from "./DataIntelligentBanner";
import HeroRotatingTitle, { getSecondHeroCopy } from "./HeroRotatingTitle";
import HomeShotUrlInput from "./HomeShotUrlInput";
import { CallClaireButton } from "@lystes/components/CallClaireButton";
import HomeHeroVideo from "./HomeHeroVideo";
import HomeDemoExperienceBridge from "./HomeDemoExperienceBridge";
import { ShoppingAssistantCompareSection } from "@lystes/features/landing-particuliers/pages/pro-offer/components/DiagnosticComparisonSection";
import { HomeCreatorsGallery } from "@lystes/features/solutions/HomeCreatorsGallery";
import diagnosticFace from "@lystes/features/landing-particuliers/pages/diagnostic-agent/assets/diagnostic-face.jpg";
import { getHomeLocale } from "@lystes/i18n/home-locale";

const HIERARCHY_MARKER = "<!--HIERARCHY_MOUNT-->";
const CHAT_MARKER = "<!--ANIMATED_CHAT_MOUNT-->";
const VIDEO_PROMPT_MARKER = "<!--VIDEO_PROMPT_MOUNT-->";
const CALL_CLEA_MARKER = "<!--CALL_CLEA_MOUNT-->";
const CHAT_SLOT_ID = "animated-chat-slot";
const VIDEO_PROMPT_SLOT_ID = "video-prompt-slot";
const CALL_CLEA_SLOT_ID = "call-clea-slot";
const DATA_INTELLIGENT_MARKER = "<!--DATA_INTELLIGENT_MOUNT-->";
const DATA_INTELLIGENT_SLOT_ID = "data-intelligent-slot";
const HERO_TITLE_MARKER = "<!--HERO_TITLE_MOUNT-->";
const HERO_TITLE_SLOT_ID = "hero-title-slot";
const HOME_HERO_MARKER = "<!--HOME_HERO_MOUNT-->";
const HOME_HERO_SLOT_ID = "home-hero-slot";
const HERO_TITLE_MARKER_2 = "<!--HERO_TITLE_MOUNT_2-->";
const HERO_TITLE_SLOT_ID_2 = "hero-title-slot-2";
const SHOPPING_COMPARE_MARKER = "<!--SHOPPING_COMPARE_MOUNT-->";
const SHOPPING_COMPARE_SLOT_ID = "shopping-compare-slot";
const SHOPPING_COMPARE_MARKER_2 = "<!--SHOPPING_COMPARE_MOUNT_2-->";
const SHOPPING_COMPARE_SLOT_ID_2 = "shopping-compare-slot-2";
const SHOT_URL_INPUT_MARKER = "<!--SHOT_URL_INPUT_MOUNT-->";
const SHOT_URL_INPUT_SLOT_ID = "shot-url-input-slot";
const CREATORS_GALLERY_MARKER = "<!--CREATORS_GALLERY_MOUNT-->";
const CREATORS_GALLERY_SLOT_ID = "creators-gallery-slot";
/* Les repères de la vision : au-dessus (phrase et onglets), la scène de l'étage
   ouvert (texte, liste des agents et visuel, posés dans le gabarit), le calque
   du projecteur sur la fiche Éclose, et dessous la page de la marque. */
const VISION_TETE_MARKER = "<!--VISION_TETE_MOUNT-->";
const VISION_TETE_SLOT_ID = "vision-tete-slot";
const VISION_PASTILLES_MARKER = "<!--VISION_PASTILLES_MOUNT-->";
const VISION_PASTILLES_SLOT_ID = "vision-pastilles-slot";
const VISION_PANNEAUX_MARKER = "<!--VISION_PANNEAUX_MOUNT-->";
const VISION_PANNEAUX_SLOT_ID = "vision-panneaux-slot";
const VISION_DEMO_ID = "vision-demo";
const VISION_SCENE_ID = "vision-scene";
const VISION_TEXTE_ID = "vision-texte-slot";
const VISION_LEGENDE_ID = "vision-legende-slot";
const VISION_VISUEL_ID = "vision-visuel-slot";

const TOKEN_RE = /\{\{(t\d{3}_[a-z0-9-]+)\}\}/g;

export function interpolate(template: string, dict: Record<string, string>, fallback: Record<string, string>) {
  return template.replace(TOKEN_RE, (_, key: string) => {
    const v = dict[key] ?? fallback[key];
    if (v == null) return "";
    // Basic HTML-escape for safety (values come from locale files, but attributes matter)
    return v
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  });
}

export function prepare(raw: string, removeHomeSections = false) {
  const source = removeHomeSections
    ? raw
        .replace(SHOPPING_COMPARE_MARKER, "")
        .replace(VIDEO_PROMPT_MARKER, "")
    : raw;
  const prepared = source
    .replace(
      VIDEO_PROMPT_MARKER,
      `<div id="${VIDEO_PROMPT_SLOT_ID}" style="grid-column:1 / -1"></div>`
    )
    .replace(
      DATA_INTELLIGENT_MARKER,
      `<div class="wrap" style="margin:44px auto;"><div id="${DATA_INTELLIGENT_SLOT_ID}"></div></div>`
    )
    .replace(
      HERO_TITLE_MARKER,
      `<span id="${HERO_TITLE_SLOT_ID}"></span>`
    )
    .replace(
      HOME_HERO_MARKER,
      `<div id="${HOME_HERO_SLOT_ID}"></div>`
    )
    .replace(
      HERO_TITLE_MARKER_2,
      `<span id="${HERO_TITLE_SLOT_ID_2}" style="font-size:0.78em; display:inline-block;"></span>`
    )
    .replace(
      SHOPPING_COMPARE_MARKER,
      `<div id="${SHOPPING_COMPARE_SLOT_ID}" style="grid-column:1 / -1"></div>`
    )
    .replace(
      SHOPPING_COMPARE_MARKER_2,
      `<div id="${SHOPPING_COMPARE_SLOT_ID_2}"></div>`
    )
    .replace(
      SHOT_URL_INPUT_MARKER,
      `<div id="${SHOT_URL_INPUT_SLOT_ID}"></div>`
    )
    .replace(
      CREATORS_GALLERY_MARKER,
      `<div id="${CREATORS_GALLERY_SLOT_ID}"></div>`
    )
    .replace(
      CALL_CLEA_MARKER,
      `<div id="${CALL_CLEA_SLOT_ID}" style="position:absolute; left:50%; bottom:41px; transform:translateX(-50%); z-index:9999;"></div>`
    )
    .replace(VISION_TETE_MARKER, `<div id="${VISION_TETE_SLOT_ID}"></div>`)
    /* Calque posé sur la démonstration : il ne capte aucun clic, la fiche
       reste utilisable comme sur l'accueil. */
    .replace(
      VISION_PASTILLES_MARKER,
      `<div id="${VISION_PASTILLES_SLOT_ID}" style="position:absolute; inset:0; pointer-events:none; z-index:2;"></div>`
    )
    .replace(VISION_PANNEAUX_MARKER, `<div id="${VISION_PANNEAUX_SLOT_ID}"></div>`);
  const [beforeHtml, restHtml] = prepared.split(HIERARCHY_MARKER);
  const afterHierarchyHtml = (restHtml ?? "").replace(
    CHAT_MARKER,
    `<div id="${CHAT_SLOT_ID}"></div>`
  );
  return { beforeHtml, afterHierarchyHtml };
}

export default function AgentsVisionRawPage() {
  const { i18n, t } = useTranslation();
  /* `/accueil-v2` est un clone de l'accueil : la composition est celle de la
     home, on la force donc au lieu de la déduire de l'URL. Sans ce vrai, la
     page monterait deux blocs que l'accueil ne montre pas (comparatif
     shopping, bannière vidéo) et masquerait la galerie des créatrices. */
  const isHomeRoute = true;
  const lang = (i18n.language || "fr").substring(0, 2).toLowerCase();
  const isEn = lang === "en";
  const { beforeHtml, afterHierarchyHtml } = useMemo(() => {
    const { fr, current } = getHomeLocale("agents-autonomes", lang);
    const prepared = prepare(rawTemplate, isHomeRoute);
    const localizeDemo = (html: string) => html.replace(
      /\/fiche-produit-demo\.html(?!\?)/g,
      `/fiche-produit-demo.html?lang=${encodeURIComponent(lang)}`,
    );
    return {
      beforeHtml: interpolate(localizeDemo(prepared.beforeHtml), current, fr),
      afterHierarchyHtml: interpolate(localizeDemo(prepared.afterHierarchyHtml), current, fr),
    };
  }, [isHomeRoute, lang]);
  /* Titre et description : les mêmes que l'accueil. Leur histoire (le titre
     vit à trois endroits) est racontée dans AgentsAutonomesRawPage.tsx. */
  const titreOnglet = t("heroHome.titreOnglet", {
    defaultValue: "Déployer des agents IA ecommerce & retail | Lystes",
  });
  const meta = useMemo(
    () =>
      isEn
        ? {
            title: titreOnglet,
            description:
              "Deploy AI agents on your product pages: they advise your visitors and tell them whether the product suits them. Shopify and WooCommerce.",
          }
        : {
            title: titreOnglet,
            description:
              "Déployez des agents IA sur vos fiches produit : ils conseillent vos visiteurs et leur disent si le produit leur convient. Shopify et WooCommerce.",
          },
    [isEn, titreOnglet]
  );
  const [chatSlot, setChatSlot] = useState<HTMLElement | null>(null);
  const [conseillersSlot, setConseillersSlot] = useState<HTMLElement | null>(null);
  const [faceMeshSlot, setFaceMeshSlot] = useState<HTMLElement | null>(null);
  const [videoPromptSlot, setVideoPromptSlot] = useState<HTMLElement | null>(null);
  const [callCleaSlot, setCallCleaSlot] = useState<HTMLElement | null>(null);
  const [dataIntelSlot, setDataIntelSlot] = useState<HTMLElement | null>(null);
  const [heroTitleSlot, setHeroTitleSlot] = useState<HTMLElement | null>(null);
  const [homeHeroSlot, setHomeHeroSlot] = useState<HTMLElement | null>(null);
  const [heroTitleSlot2, setHeroTitleSlot2] = useState<HTMLElement | null>(null);
  const [shoppingCompareSlot, setShoppingCompareSlot] = useState<HTMLElement | null>(null);
  const [shoppingCompareSlot2, setShoppingCompareSlot2] = useState<HTMLElement | null>(null);
  const [shotUrlInputSlot, setShotUrlInputSlot] = useState<HTMLElement | null>(null);
  const [creatorsGallerySlot, setCreatorsGallerySlot] = useState<HTMLElement | null>(null);
  const [visionSlots, setVisionSlots] = useState<{
    tete: HTMLElement;
    scene: HTMLElement;
    texte: HTMLElement;
    legende: HTMLElement;
    visuel: HTMLElement;
    pastilles: HTMLElement;
    apres: HTMLElement;
    demo: HTMLElement;
  } | null>(null);

  useEffect(() => {
    const el = (id: string) => document.getElementById(id);
    const tete = el(VISION_TETE_SLOT_ID);
    const scene = el(VISION_SCENE_ID);
    const texte = el(VISION_TEXTE_ID);
    const legende = el(VISION_LEGENDE_ID);
    const visuel = el(VISION_VISUEL_ID);
    const pastilles = el(VISION_PASTILLES_SLOT_ID);
    const apres = el(VISION_PANNEAUX_SLOT_ID);
    const demo = el(VISION_DEMO_ID);
    setVisionSlots(
      tete && scene && texte && legende && visuel && pastilles && apres && demo
        ? { tete, scene, texte, legende, visuel, pastilles, apres, demo }
        : null,
    );
  }, [beforeHtml]);

  useEffect(() => {
    setChatSlot(document.getElementById(CHAT_SLOT_ID));
    setHomeHeroSlot(document.getElementById(HOME_HERO_SLOT_ID));
    setConseillersSlot(document.getElementById("conseillers-chat-slot"));
    setFaceMeshSlot(document.getElementById("diagnostic-facemesh-slot"));
    setVideoPromptSlot(document.getElementById(VIDEO_PROMPT_SLOT_ID));
    setCallCleaSlot(document.getElementById(CALL_CLEA_SLOT_ID));
    setDataIntelSlot(document.getElementById(DATA_INTELLIGENT_SLOT_ID));
    setHeroTitleSlot(document.getElementById(HERO_TITLE_SLOT_ID));
    setHeroTitleSlot2(document.getElementById(HERO_TITLE_SLOT_ID_2));
    setShoppingCompareSlot(document.getElementById(SHOPPING_COMPARE_SLOT_ID));
    setShoppingCompareSlot2(document.getElementById(SHOPPING_COMPARE_SLOT_ID_2));
    setShotUrlInputSlot(document.getElementById(SHOT_URL_INPUT_SLOT_ID));
    setCreatorsGallerySlot(document.getElementById(CREATORS_GALLERY_SLOT_ID));
    // Scroll to hash anchor once the raw HTML is mounted (SPA nav lands before content is in DOM).
    const hash = window.location.hash?.slice(1);
    if (hash) {
      const tryScroll = (attempt = 0) => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (attempt < 10) {
          setTimeout(() => tryScroll(attempt + 1), 120);
        }
      };
      tryScroll();
    }
  }, [beforeHtml, afterHierarchyHtml]);

  useEffect(() => {
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video.cost-loop"));
    if (!videos.length) return;

    const cleanups = videos.map((video) => {
      video.muted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = "auto";

      const play = () => {
        const attempt = video.play();
        if (attempt) attempt.catch(() => undefined);
      };
      const restart = () => {
        video.currentTime = 0;
        play();
      };

      video.addEventListener("loadeddata", play);
      video.addEventListener("canplay", play);
      video.addEventListener("ended", restart);
      play();

      return () => {
        video.removeEventListener("loadeddata", play);
        video.removeEventListener("canplay", play);
        video.removeEventListener("ended", restart);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [beforeHtml]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const portfolios = Array.from(document.querySelectorAll<HTMLElement>(".wf-portfolio"));
    const cleanups = portfolios.map((portfolio) => {
      const radios = Array.from(portfolio.querySelectorAll<HTMLInputElement>(".pf-radio"));
      if (radios.length < 2) return () => undefined;

      let timer: number | null = null;
      const delay = 9000;

      const currentIndex = () => {
        const index = radios.findIndex((radio) => radio.checked);
        return index >= 0 ? index : 0;
      };

      const stop = () => {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      };

      const start = () => {
        if (timer) return;
        timer = window.setInterval(() => {
          radios[(currentIndex() + 1) % radios.length].checked = true;
        }, delay);
      };

      const restart = () => {
        stop();
        start();
      };

      radios.forEach((radio) => radio.addEventListener("change", restart));

      let observer: IntersectionObserver | null = null;
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) start();
              else stop();
            });
          },
          { threshold: 0.35 }
        );
        observer.observe(portfolio);
      } else {
        start();
      }

      return () => {
        stop();
        observer?.disconnect();
        radios.forEach((radio) => radio.removeEventListener("change", restart));
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  // Carousel dots for .cartes6
  useCartes6Dots();

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        {/* La home depuis le 11/10/2026 (JP) : indexée, sans noindex. */}
      </Helmet>
      <div dangerouslySetInnerHTML={{ __html: beforeHtml }} />
      {/* biolystes.com : sans le panneau de création, comme sur l’accueil. */}
      {isHomeRoute && <HomeCreatorsGallery sansGeneration />}
      <Hierarchy className="pt-10 md:pt-14" />
      <div dangerouslySetInnerHTML={{ __html: afterHierarchyHtml }} />
      {chatSlot && createPortal(<AnimatedChat />, chatSlot)}
      {conseillersSlot && createPortal(<AnimatedChat />, conseillersSlot)}
      {faceMeshSlot && createPortal(<FaceMeshScanner imageUrl={diagnosticFace} />, faceMeshSlot)}
      {!isHomeRoute && videoPromptSlot && createPortal(<VideoPromptBanner />, videoPromptSlot)}
      {/* biolystes.com : pas de bouton « Appeler Cléa », le seul appel à
          l’action est le rendez-vous. */}
      {dataIntelSlot && createPortal(<DataIntelligentBanner lang={lang} />, dataIntelSlot)}
      {heroTitleSlot && createPortal(<HeroRotatingTitle lang={lang} />, heroTitleSlot)}
      {/* Sous 640 px, le hero porte la bascule Ecommerce / Entreprises, qui
          ne s'affiche que sur « / » : on lui présente ce chemin. */}
      {homeHeroSlot && createPortal(<CommeSurAccueil><HomeHeroVideo /></CommeSurAccueil>, homeHeroSlot)}
      {visionSlots && <VisionEtages {...visionSlots} />}
      {heroTitleSlot2 && createPortal(
        <HeroRotatingTitle lang={lang} {...getSecondHeroCopy(lang)} />,
        heroTitleSlot2
      )}
      {!isHomeRoute && shoppingCompareSlot && createPortal(<ShoppingAssistantCompareSection compact />, shoppingCompareSlot)}
      {!isHomeRoute && shotUrlInputSlot && createPortal(<HomeShotUrlInput />, shotUrlInputSlot)}
      {/* Écoute le bouton « Faire un diagnostic / un essayage » de la démo en
          iframe et ouvre le vrai parcours de /shot par-dessus la page. */}
      <HomeDemoExperienceBridge />
    </>
  );
}

/** Points de navigation du carrousel .cartes6 (accueil, et /bio depuis le
 *  12/10/2026). `dep` relance la pose quand le carrousel est monté plus tard. */
export function useCartes6Dots(dep?: unknown) {
  useEffect(() => {
    const carousel = document.querySelector<HTMLElement>(".biolystes-ai-scope .cartes6");
    if (!carousel) return;
    const cards = Array.from(carousel.children) as HTMLElement[];
    if (cards.length < 2) return;

    // Avoid double-mount
    let dots = carousel.parentElement?.querySelector<HTMLElement>(".cartes6-dots");
    if (!dots) {
      dots = document.createElement("div");
      dots.className = "cartes6-dots";
      carousel.after(dots);
    } else {
      dots.innerHTML = "";
    }

    const getScrollPoints = () => {
      const maxScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
      const pageCount = Math.max(1, Math.ceil(carousel.scrollWidth / carousel.clientWidth));

      if (pageCount === 1) return [0];

      return Array.from({ length: pageCount }, (_, i) =>
        Math.round((maxScroll / (pageCount - 1)) * i)
      );
    };

    let scrollPoints = getScrollPoints();

    const dotEls: HTMLButtonElement[] = scrollPoints.map((point, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cartes6-dot";
      b.setAttribute("aria-label", `Aller à la page ${i + 1}`);
      b.addEventListener("click", () => {
        carousel.scrollTo({ left: point, behavior: "smooth" });
      });
      dots!.appendChild(b);
      return b;
    });

    const updateActive = () => {
      scrollPoints = getScrollPoints();
      let bestIdx = 0;
      let bestDist = Infinity;
      scrollPoints.forEach((point, i) => {
        const d = Math.abs(point - carousel.scrollLeft);
        if (d < bestDist) { bestDist = d; bestIdx = i; }
      });
      dotEls.forEach((el, i) => el.classList.toggle("is-active", i === bestIdx));
    };
    updateActive();
    carousel.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      carousel.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
      dots?.remove();
    };
  }, [dep]);
}
