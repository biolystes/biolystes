import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Un écran de la visite « Vos outils », SANS iframe (JP, 12/10/2026 : « il
 * fallait reproduire les différents écrans à la perfection, pour ne pas avoir
 * à faire des iframes, parce qu'à chaque fois ça charge très longtemps »).
 *
 * La vraie vue de la page publique est rendue dans la page même, dans une
 * racine d'ombre (shadow DOM) :
 *  - les règles de l'accueil (`.biolystes-ai-scope h1`…) n'y entrent pas, et
 *    les styles des pages (`.blp-body`, `#lystes-bdf-fenetre`…) n'en sortent
 *    pas ;
 *  - les styles de lystes.ai y sont repris une fois, sans réseau, depuis les
 *    feuilles déjà chargées, et adaptés à l'écran : chaque `@media` de
 *    largeur devient un `@container`, chaque `vh`/`vw` un `cqh`/`cqw`. La page
 *    se dessine donc à la largeur de l'écran de la visite (1100 px réduits sur
 *    ordinateur, 320 px sur téléphone), comme elle le faisait dans un cadre ;
 *  - l'écran est le bloc conteneur des éléments fixes : la fenêtre du
 *    diagnostic s'ouvre dans l'écran, pas sur l'accueil.
 *
 * `Fen` remplace la fenêtre du cadre : défilement, hauteur, mesures en pixels
 * de la page (avant réduction).
 */

export type Fen = {
  racine: ShadowRoot;
  /** L'écran : la « fenêtre » de la page, bloc conteneur des éléments fixes. */
  vue: HTMLElement;
  /** Ce qui défile dans l'écran. */
  defile: HTMLElement;
  readonly scrollY: number;
  readonly innerHeight: number;
  readonly scrollHeight: number;
  scrollTo: (o: { top: number; behavior?: ScrollBehavior }) => void;
  /** La boîte d'un élément en pixels de la page, depuis le haut de l'écran. */
  rect: (el: Element) => { left: number; top: number; width: number; height: number; right: number; bottom: number };
};

/* Une condition de largeur seule (`(min-width: 1024px)`, `screen and
   (max-width: 850px)`, `(width >= 40rem)`) : elle passe à l'écran. */
const LARGEUR_SEULE =
  /^(?:only\s+)?(?:screen\s+and\s+)?\(\s*(?:(?:min|max)-width\s*:\s*[\d.]+(?:px|em|rem)|width\s*[<>]=?\s*[\d.]+(?:px|em|rem))\s*\)(?:\s+and\s+\(\s*(?:(?:min|max)-width\s*:\s*[\d.]+(?:px|em|rem)|width\s*[<>]=?\s*[\d.]+(?:px|em|rem))\s*\))*$/i;

const unites = (t: string) =>
  t.replace(/(\d*\.?\d+)(?:d|s|l)?vh\b/g, "$1cqh").replace(/(\d*\.?\d+)(?:d|s|l)?vw\b/g, "$1cqw");

const condition = (c: string) => {
  const propre = c.trim();
  return LARGEUR_SEULE.test(propre) ? `@container lyvo ${propre.replace(/^(?:only\s+)?screen\s+and\s+/i, "")}` : `@media ${propre}`;
};

function regle(r: CSSRule): string {
  if (r instanceof CSSStyleRule) {
    const imbriquees = (r as CSSStyleRule & { cssRules?: CSSRuleList }).cssRules;
    if (imbriquees && imbriquees.length) return r.cssText;
    return `${r.selectorText}{${unites(r.style.cssText)}}`;
  }
  if (r instanceof CSSMediaRule) return `${condition(r.media.mediaText)}{${[...r.cssRules].map(regle).join("")}}`;
  if (r instanceof CSSSupportsRule) return `@supports ${r.conditionText}{${[...r.cssRules].map(regle).join("")}}`;
  if (r instanceof CSSFontFaceRule || r instanceof CSSImportRule) return "";
  return r.cssText;
}

/* Les styles de lystes.ai, adaptés une fois, partagés par tous les écrans.
   Refaits si une feuille s'est ajoutée depuis (une page chargée à la demande). */
let feuille: { cle: string; f: CSSStyleSheet } | null = null;
function feuilleDesPages(): CSSStyleSheet {
  const feuilles = [...document.styleSheets];
  let total = 0;
  const morceaux: string[] = [];
  for (const s of feuilles) {
    try {
      const regles = s.cssRules;
      total += regles.length;
      morceaux.push([...regles].map(regle).join("\n"));
    } catch {
      /* Feuille d'une autre origine (polices) : ses @font-face valent déjà pour le document. */
    }
  }
  const cle = `${feuilles.length}:${total}`;
  if (feuille?.cle === cle) return feuille.f;
  const f = new CSSStyleSheet();
  f.replaceSync(morceaux.join("\n"));
  feuille = { cle, f };
  return f;
}

const BASE = new CSSStyleSheet();
BASE.replaceSync(`
.lyvo-vue{ all:initial; display:block; position:relative; width:100%; height:100%; overflow:hidden;
  container:lyvo / size; contain:strict; background:#fff; }
.lyvo-defile{ position:absolute; inset:0; overflow:hidden; }
`);

/* Les <style> que les vues posent elles-mêmes (brandLinkPageStyles, la
   fenêtre du diagnostic…) passent par la même adaptation. */
const adaptes = new WeakMap<Element, string>();
function adapterStyle(el: HTMLStyleElement) {
  const t = el.textContent ?? "";
  if (adaptes.get(el) === t) return;
  const n = unites(t.replace(/@media\s*([^{]+)\{/g, (_m, c: string) => `${condition(c)}{`));
  adaptes.set(el, n);
  if (n !== t) el.textContent = n;
}
function adapterStyles(racine: ParentNode) {
  racine.querySelectorAll("style").forEach((s) => adapterStyle(s as HTMLStyleElement));
}

function creerFen(racine: ShadowRoot, vue: HTMLElement, defile: HTMLElement): Fen {
  const echelle = () => {
    const l = vue.offsetWidth;
    return l ? vue.getBoundingClientRect().width / l : 1;
  };
  return {
    racine,
    vue,
    defile,
    get scrollY() { return defile.scrollTop; },
    get innerHeight() { return defile.clientHeight; },
    get scrollHeight() { return defile.scrollHeight; },
    scrollTo: (o) => defile.scrollTo(o),
    rect: (el) => {
      const k = echelle();
      const v = vue.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const left = (r.left - v.left) / k;
      const top = (r.top - v.top) / k;
      return { left, top, width: r.width / k, height: r.height / k, right: left + r.width / k, bottom: top + r.height / k };
    },
  };
}

export function EcranOmbre({
  className,
  style,
  titre,
  cache,
  pret,
  children,
}: {
  className: string;
  style: CSSProperties;
  titre: string;
  cache?: boolean;
  pret?: (f: Fen) => void;
  children: (f: Fen) => ReactNode;
}) {
  const hote = useRef<HTMLDivElement>(null);
  const [fen, setFen] = useState<Fen | null>(null);

  useLayoutEffect(() => {
    const h = hote.current;
    if (!h) return;
    /* Ni clic ni clavier : aucun lien ne part, rien ne s'envoie. */
    h.setAttribute("inert", "");
    const racine = h.shadowRoot ?? h.attachShadow({ mode: "open" });
    racine.adoptedStyleSheets = [feuilleDesPages(), BASE];
    const vue = document.createElement("div");
    vue.className = "lyvo-vue";
    /* Ce que la page hérite de <body> chez elle : rien de l'accueil. */
    const corps = getComputedStyle(document.body);
    Object.assign(vue.style, {
      fontFamily: corps.fontFamily,
      fontSize: corps.fontSize,
      lineHeight: corps.lineHeight,
      color: corps.color,
      webkitFontSmoothing: "antialiased",
    });
    const defile = document.createElement("div");
    defile.className = "lyvo-defile";
    vue.appendChild(defile);
    racine.replaceChildren(vue);
    const obs = new MutationObserver(() => adapterStyles(racine));
    obs.observe(racine, { childList: true, subtree: true, characterData: true });
    const f = creerFen(racine, vue, defile);
    setFen(f);
    return () => {
      obs.disconnect();
      racine.replaceChildren();
      setFen(null);
    };
  }, []);

  /* Les <style> des vues sont adaptés avant d'être peints (l'observateur ne
     passe qu'après) ; puis l'écran se dit prêt. */
  useLayoutEffect(() => {
    if (!fen) return;
    adapterStyles(fen.racine);
    pret?.(fen);
  });

  return (
    <div ref={hote} className={className} style={style} role="img" aria-label={titre} aria-hidden={cache || undefined}>
      {fen && createPortal(children(fen), fen.defile)}
    </div>
  );
}
