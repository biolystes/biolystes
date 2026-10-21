/**
 * GARDE-FOU PERMANENT : « tout doit être aligné partout » (JP, 14/10/2026, soir).
 *
 * Pourquoi ce test existe
 * -----------------------
 * Les offres Biolystes se décrivent dans trois dépôts (biolystes.pro, lystes.ai,
 * biolystes.com), dans les pages, les contrats, les CGV, la FAQ et les assistants
 * des closeuses. Chaque changement de prix laissait derrière lui des textes
 * périmés (Pack Découverte, loyer IA à 299 €/mois, « 10-15 jours », « 2 × 750 »,
 * « Abonnement inclus » sur le Standard à l'achat…) qu'une cliente finissait
 * par lire. JP : « tout doit être aligné partout ». Ce test fait échouer
 * `npm test` dès qu'un de ces textes revient, dès que src/data/offres.ts
 * s'écarte de la référence, et dès que la page /tarifs n'affiche plus le bon
 * parcours.
 *
 * La référence
 * ------------
 * Compétence ~/.claude/skills/tarifs-biolystes/SKILL.md (sections « Le parcours
 * complet », « Le paiement de l'offre en trois temps », « Décisions de JP du
 * 14/10/2026 (soir) », « Tous les packs ») et src/data/packs.ts de
 * commandcenterbiolystes (biolystes.pro), qui porte le même test. Dans ce
 * dépôt, les montants vivent dans src/data/offres.ts ; la page /tarifs les lit.
 *
 * S'il échoue
 * -----------
 * Corriger le TEXTE ou le montant, pas ce test. Ne changer REF_ACHAT et
 * REF_PLUSIEURS_MOIS ci-dessous que sur une décision écrite de JP, et alors
 * dans les trois dépôts le même jour.
 * Le mot « Location » reste permis dans les contrats et les CGV (terme
 * juridique « location avec option d'achat ») ; côté clientes, la formule
 * s'appelle « Payer sur plusieurs mois ».
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import { ABONNEMENT_DEMARRE_SITE, PACKS_ACHAT, PACKS_PLUSIEURS_MOIS, PRODUIT_EN_PLUS } from "@/data/offres";
import TarifsPage from "@/pages/TarifsPage";

const RACINE = resolve(__dirname, "../..");

/* ─── 1. Textes interdits côté clientes ─── */

const ESPACE = "[\\s\\u00a0\\u202f]*";
const INTERDITS: { nom: string; motif: RegExp; horsContrats?: boolean }[] = [
  { nom: "Pack Découverte (retiré)", motif: /Pack\s+D[ée]couverte/i },
  { nom: "FDA (aucune autorisation FDA)", motif: /\bFDA\b/ },
  { nom: "299 € par mois (la mensualité est de 199 €, 299 € est l'acompte de l'IA)", motif: new RegExp(`299${ESPACE}(?:€|euros?)${ESPACE}(?:/|par)${ESPACE}mois`, "i") },
  { nom: "« 10-15 j » (délai périmé : 10 jours ouvrés)", motif: /10\s*-\s*15\s*j/i },
  { nom: "« 10 à 15 jours » (délai périmé : 10 jours ouvrés)", motif: /10\s+à\s+15\s+jours/i },
  { nom: "« 2 × 750 » (échéancier périmé)", motif: /2\s*[×x]\s*750/i },
  // (?!['"]?:) : l'en-tête HTTP « Location: … » des redirections n'est pas un libellé.
  // useLocation et window.location ne comptent pas (pas de frontière de mot, ou minuscule).
  { nom: "« Location » comme libellé client (dire « Payer sur plusieurs mois »)", motif: /\bLocation\b(?!['"]?:)/, horsContrats: true },
];

/** Fichiers servis aux clientes ou relayés vers elles : pages, données, assistant de chat, public/. */
const DOSSIERS = ["src", "supabase/functions", "public"];
const EXTENSIONS = /\.(tsx?|jsx?|html|json|md)$/;
const IGNORES = /(^|\/)(node_modules|test|tests|__tests__|dist)(\/|$)|\.test\.|\.spec\.|src\/integrations\/supabase\/types\.ts$/;
/** Contrats et CGV : « Location » y est le terme juridique (« location avec option d'achat »), permis. */
const CONTRATS = /contract|contrat|cgv/i;

/**
 * Exceptions justifiées, chemin relatif → motifs tolérés dans ce fichier.
 * Seulement des fichiers qu'aucune cliente ne voit. La plus courte possible.
 */
const PACK_DECOUVERTE = "Pack Découverte (retiré)";
const EXCEPTIONS: Record<string, string[]> = {
  // Page morte : /pricing redirige vers /rdv (src/App.tsx), le fichier n'est
  // importé nulle part (vérifié plus bas). Prix périmés : à supprimer, pas à corriger.
  "src/pages/PricingPage.tsx": [PACK_DECOUVERTE],
  // Note interne pour l'avocat, qui cite « FDA » pour demander de le retirer ;
  // ni importée ni publiée (vérifié plus bas).
  "src/actus/A-VALIDER-AVOCAT.md": ["FDA (aucune autorisation FDA)"],
  // Consigne à l'assistant de chat (« ne jamais le proposer »), jamais affichée telle quelle.
  "supabase/functions/biolystes-chat/system-prompt.ts": [PACK_DECOUVERTE],
};
/* Ces exceptions ne tiennent que tant que le fichier n'est importé nulle part. */
const JAMAIS_IMPORTES = ["src/pages/PricingPage.tsx", "src/actus/A-VALIDER-AVOCAT.md"];

function fichiers(dir: string): string[] {
  let out: string[] = [];
  let noms: string[] = [];
  try { noms = readdirSync(dir); } catch { return out; }
  for (const n of noms) {
    const p = join(dir, n);
    const rel = relative(RACINE, p);
    if (IGNORES.test(rel)) continue;
    const st = statSync(p);
    if (st.isDirectory()) out = out.concat(fichiers(p));
    else if (EXTENSIONS.test(n) && st.size < 2_000_000) out.push(p);
  }
  return out;
}

/** Retire les commentaires // et /* *\/ (sans toucher aux « https:// »), et <!-- --> en HTML, en gardant les numéros de ligne. */
function sansCommentaires(src: string, ext: string): string {
  const blanc = (m: string) => m.replace(/[^\n]/g, " ");
  if (/\.html$/.test(ext)) return src.replace(/<!--[\s\S]*?-->/g, blanc);
  if (!/\.(tsx?|jsx?)$/.test(ext)) return src;
  return src
    .replace(/\/\*[\s\S]*?\*\//g, blanc)
    .replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");
}

describe("Garde-fou : aucun texte périmé côté clientes", () => {
  const liste = DOSSIERS.flatMap((d) => fichiers(join(RACINE, d)));
  const rels = liste.map((f) => relative(RACINE, f));

  it("le périmètre n'est pas vide", () => {
    expect(liste.length).toBeGreaterThan(50);
    for (const page of ["src/pages/TarifsPage.tsx", "src/pages/CGVPage.tsx", "src/pages/FaqPage.tsx"]) expect(rels).toContain(page);
  });

  for (const interdit of INTERDITS) {
    it(interdit.nom, () => {
      const trouves: string[] = [];
      for (const f of liste) {
        const rel = relative(RACINE, f);
        if (interdit.horsContrats && CONTRATS.test(rel)) continue;
        if (EXCEPTIONS[rel]?.includes(interdit.nom)) continue;
        const lignes = sansCommentaires(readFileSync(f, "utf8"), f).split("\n");
        lignes.forEach((l, i) => {
          const m = l.match(interdit.motif);
          if (m) {
            const debut = Math.max(0, (m.index ?? 0) - 40);
            trouves.push(`${rel}:${i + 1} … ${l.slice(debut, debut + 120).trim()}`);
          }
        });
      }
      expect(trouves, `Texte interdit « ${interdit.nom} » :\n${trouves.join("\n")}`).toEqual([]);
    });
  }

  it("les exceptions « jamais importées » le restent", () => {
    for (const fichier of JAMAIS_IMPORTES) {
      const nom = basename(fichier).replace(/\.(tsx?|md)$/, "").replace(/[-.]/g, "\\$&");
      const motif = new RegExp(`(?:from|import)\\s*\\(?\\s*["'][^"']*/${nom}(?:\\.(?:tsx?|md))?(?:\\?raw)?["']`);
      const importeurs = liste
        .filter((f) => /\.(tsx?|jsx?)$/.test(f) && relative(RACINE, f) !== fichier)
        .filter((f) => motif.test(sansCommentaires(readFileSync(f, "utf8"), f)))
        .map((f) => relative(RACINE, f));
      expect(importeurs, `${fichier} est en exception mais importé par : ${importeurs.join(", ")}. Corriger ses textes et retirer l'exception.`).toEqual([]);
    }
  });
});

/* ─── 2. Montants de src/data/offres.ts = la référence ─── */

/** Référence : compétence tarifs-biolystes, « Tous les packs », et décisions de JP du 14/10/2026 (soir). TTC. */
const REF_ACHAT = {
  design: { prix: 599, acompte: 199, aReception: 400, aLivraisonSite: null, abonnement: 39 },
  basic: { prix: 999, acompte: 199, aReception: 301, aLivraisonSite: 499, abonnement: 79 },
  standard: { prix: 1499, acompte: 199, aReception: 551, aLivraisonSite: 749, abonnement: 99 },
  ia: { prix: 2999, acompte: 299, aReception: 1201, aLivraisonSite: 1499, abonnement: 99 },
};
const REF_PLUSIEURS_MOIS = {
  standard: { acompte: 199, miseEnPlace: 499, resteMiseEnPlace: 300, mensualiteMin: 199, total: 1499, abonnementInclus: true },
  ia: { acompte: 299, miseEnPlace: 599, resteMiseEnPlace: 300, mensualiteMin: 199, total: 2999, abonnementInclus: true },
};

describe("Garde-fou : les montants de src/data/offres.ts sont ceux de la référence", () => {
  it("Payer en une fois : prix, acompte, tranches, abonnement", () => {
    const vus = Object.fromEntries(PACKS_ACHAT.map(({ cle, ...reste }) => [cle, reste]));
    expect(vus).toEqual(REF_ACHAT);
    for (const p of PACKS_ACHAT) expect(p.acompte + p.aReception + (p.aLivraisonSite ?? 0), p.cle).toBe(p.prix);
  });

  it("Payer sur plusieurs mois : acompte, mise en place, reste de 300 €, mensualité, total", () => {
    const vus = Object.fromEntries(PACKS_PLUSIEURS_MOIS.map(({ cle, ...reste }) => [cle, reste]));
    expect(vus).toEqual(REF_PLUSIEURS_MOIS);
    for (const p of PACKS_PLUSIEURS_MOIS) {
      expect(p.miseEnPlace - p.acompte, p.cle).toBe(p.resteMiseEnPlace);
      /* Le total pour que le site soit à elle est le prix du pack acheté. */
      expect(p.total, p.cle).toBe(REF_ACHAT[p.cle].prix);
    }
  });

  it("produit en plus : 39 € ; abonnement à l'achat jamais « inclus »", () => {
    expect(PRODUIT_EN_PLUS).toBe(39);
    expect(ABONNEMENT_DEMARRE_SITE).not.toMatch(/inclus|compris/i);
    expect(ABONNEMENT_DEMARRE_SITE).toMatch(/solde/);
  });
});

/* ─── 3. Ce que la page /tarifs affiche vraiment ─── */

/* jsdom n'a pas ResizeObserver (aperçu du site Éclose). */
globalThis.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} } as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver ??= class { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } } as unknown as typeof IntersectionObserver;

/* Montants tels que la page les écrit (« 1 499 € »), espaces insécables ramenées à des espaces. */
const n = (t: string | null | undefined) => (t ?? "").replace(/[  ]/g, " ").replace(/\s+/g, " ");
const eur = (x: number) => x.toLocaleString("fr-FR").replace(/[  ]/g, " ") + " €";

function afficher() {
  render(createElement(HelmetProvider, null, createElement(MemoryRouter, null, createElement(TarifsPage))));
  return () => n(document.body.textContent);
}
const etapes = () => screen.getAllByRole("listitem").filter((li) => li.closest("ol")).map((li) => n(li.textContent));

describe("Garde-fou : la page /tarifs", () => {
  it("Standard payé en une fois : abonnement 99 €/mois payant après le solde, jamais « inclus »", () => {
    const texte = afficher();
    expect(screen.getByRole("tab", { name: "Payer en une fois" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Standard" })).toHaveAttribute("aria-selected", "true");
    const t = texte();
    expect(t).toContain("Puis l’abonnement, par mois");
    expect(t).toContain(eur(99) + " TTC");
    expect(t).toContain(ABONNEMENT_DEMARRE_SITE);
    expect(t).not.toMatch(/abonnement (inclus|compris)/i);
    const f = etapes();
    for (const m of [199, 551, 749]) expect(f.some((e) => e.includes(eur(m) + " TTC")), `frise sans ${m} €`).toBe(true);
  });

  it("Pack Basic (21/10/2026) : remplace Solo et Duo, 999 € en trois temps, 79 € par mois", () => {
    const texte = afficher();
    const packs = within(screen.getByRole("tablist", { name: "Votre pack" })).getAllByRole("tab").map((t) => n(t.textContent));
    expect(packs).toEqual(["Basic", "Standard", "IA"]);
    fireEvent.click(screen.getByRole("tab", { name: "Basic" }));
    const f = etapes();
    for (const m of [199, 301, 499]) expect(f.some((e) => e.includes(eur(m) + " TTC")), `frise sans ${m} €`).toBe(true);
    const t = texte();
    expect(t).toContain(eur(999) + " TTC");
    expect(t).toContain(eur(79) + " TTC");
    expect(t).toMatch(/1 ou 2 designs de produits personnalisés \(2 au maximum\)/);
    expect(t).not.toMatch(/Pack Solo|Pack Duo/);
  });

  for (const [pack, acompte, total] of [["Standard", 199, 1499], ["IA", 299, 2999]] as const) {
    it(`${pack} sur plusieurs mois : 0 €, acompte ${acompte} €, 300 € à la livraison du site, puis 199 €/mois abonnement inclus, total ${total} €`, () => {
      const texte = afficher();
      // Le pack d'abord (onglets « Votre pack »), puis le mode de paiement,
      // dans la carte du prix : il n'existe que pour Standard et IA (PR 67).
      fireEvent.click(within(screen.getByRole("tablist", { name: "Votre pack" })).getByRole("tab", { name: pack }));
      fireEvent.click(within(screen.getByRole("tablist", { name: "Comment payer" })).getByRole("tab", { name: "Payer sur plusieurs mois" }));
      const f = etapes();
      expect(f).toHaveLength(5);
      expect(f[0]).toMatch(/0 €/);
      expect(f[1]).toMatch(/validation/i);
      expect(f[1]).toContain(eur(acompte) + " TTC");
      expect(f[3]).toMatch(/livraison du site/i);
      expect(f[3]).toContain(eur(300) + " TTC");
      expect(f[4]).toMatch(/au minimum/i);
      expect(f[4]).toContain(eur(199) + " TTC");
      expect(f[4]).toMatch(/abonnement inclus/i);
      const t = texte();
      expect(t).toContain("Total pour que le site soit à vous");
      expect(t).toMatch(/à partir de/i);
      expect(t).toContain(eur(total) + " TTC");
      expect(t).not.toMatch(/Location|louer/);
    });
  }
});
