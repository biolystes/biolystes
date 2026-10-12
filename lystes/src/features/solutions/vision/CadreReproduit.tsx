import { useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";

/**
 * Le cadre des écrans reproduits de /accueil-v2 (Vos outils, Votre
 * entreprise) : un cadre vide de même origine, qui reçoit les styles de
 * lystes.ai, et où l'écran est rendu par un portail React.
 *
 * Pourquoi un cadre (10/10/2026, relecture du back-office) : rendu dans la
 * page, l'écran héritait des règles de l'accueil (`.biolystes-ai-scope h1`
 * à 58 px en graisse 300) et, sur téléphone, des règles d'index.css qui
 * réduisent textes et marges sous 850 px. Dans un cadre de 1280 px, l'écran
 * se dessine avec ses seules règles d'ordinateur, à toutes les largeurs.
 */

const PAGE_VIDE = '<!doctype html><html lang="fr"><head><meta charset="utf-8"></head><body></body></html>';

export function CadreReproduit({ refCadre, pret, rendu, styleEnPlus, ...cadre }: {
  refCadre?: (n: HTMLIFrameElement | null) => void;
  pret?: () => void;
  rendu: (doc: Document, fen: Window) => ReactNode;
  /* Une règle propre à la visite, posée après les styles de lystes.ai. */
  styleEnPlus?: string;
  title: string;
  tabIndex: number;
  "aria-hidden"?: boolean;
  className: string;
  style: CSSProperties;
}) {
  const [doc, setDoc] = useState<Document | null>(null);
  const charge = (f: HTMLIFrameElement) => {
    const d = f.contentDocument;
    if (!d?.head || d.getElementById("lyv-o-styles")) return;
    /* Les styles de lystes.ai (Tailwind, polices) : la page s'y dessine comme
       chez elle, avec ses règles d'ordinateur, puisque le cadre fait 1280 px. */
    const repere = d.createElement("meta");
    repere.id = "lyv-o-styles";
    d.head.appendChild(repere);
    const base = d.createElement("base");
    base.href = `${window.location.origin}/`;
    d.head.appendChild(base);
    document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach((n) => d.head.appendChild(n.cloneNode(true)));
    if (styleEnPlus) {
      const st = d.createElement("style");
      st.textContent = styleEnPlus;
      d.head.appendChild(st);
    }
    setDoc(d);
    pret?.();
  };
  return (
    <>
      <iframe {...cadre} ref={refCadre} srcDoc={PAGE_VIDE} onLoad={(e) => charge(e.currentTarget)} />
      {doc?.defaultView && createPortal(rendu(doc, doc.defaultView), doc.body)}
    </>
  );
}
