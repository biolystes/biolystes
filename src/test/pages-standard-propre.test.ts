/**
 * Les pages /formules-et-ingredients et /standard-de-beaute-propre (JP,
 * 13/11/2026) : ce qu'elles annoncent est contrôlé ici, pas seulement écrit.
 *
 * 1. Les huit familles « écartées de chaque formule du catalogue » sont
 *    cherchées dans la liste INCI de CHAQUE produit du catalogue (copie
 *    synchronisée) : un seul produit qui en contient une, et la page mentirait.
 * 2. Ne figurent pas sur la page les exclusions qui ne tiennent pas pour tous les
 *    produits (PEG et dérivés, colorants de synthèse, phénoxyéthanol, « sans
 *    sulfates »), ni « toutes les formules sont véganes / bio ».
 * 3. Aucun nom de laboratoire, aucun prix, aucun tiret long, jamais
 *    « fabrication à la commande » dans le texte des pages.
 */
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PRODUCTS } from "@/data/catalogue-pro/products";
import { citeLeFournisseur } from "@/lib/fournisseur-masque";

/** Les deux pages : seul leur texte est contrôlé (cartes-standard.tsx est du code, il n'a pas de texte à lui). */
const PAGES = ["src/pages/FormulesIngredientsPage.tsx", "src/pages/StandardBeautePropre.tsx"];

/** Le champ `inci` de la copie du catalogue contient la liste INCI, puis sa légende et le texte de présentation de la
    fiche d'origine (qui parle de « parabens » pour dire qu'il n'y en a pas) : on ne garde que la liste. */
function listeInci(champ: string): string {
  const coupe = champ.search(/\s[➀➁➂➃①②③④]\s|Origine naturelle|Natural origin|All Natural|You won't|COSMOS NATURAL certified/);
  return coupe >= 0 ? champ.slice(0, coupe) : champ;
}

/** Le texte du fichier, sans ses commentaires (qui nomment les règles). */
function sansCommentaires(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((ligne) => ligne.replace(/(^|\s)\/\/.*$/, ""))
    .join("\n");
}

const textes = PAGES.map((f) => ({ f, texte: sansCommentaires(readFileSync(f, "utf8")) }));
const toutLeTexte = textes.map((x) => x.texte).join("\n");

/** Les huit familles annoncées « absentes de chaque formule », avec la forme sous laquelle elles se lisent dans une liste INCI. */
const FAMILLES: Record<string, RegExp> = {
  parabènes: /paraben/i,
  "silicones et siloxanes": /dimethicone|methicone|siloxane|silicone|dimethiconol|cyclomethicone|\w+conol\b|silsesquioxane|siloxy/i,
  "SLS et SLES": /lauryl sulfate|laureth sulfate|lauryl sulphate|laureth sulphate|myreth sulfate|alkyl sulfate/i,
  microplastiques: /polyethylene\b|polypropylene|nylon|polymethyl methacrylate|\bpmma\b|polyurethane|acrylates (?:copolymer|crosspolymer)|polyquaternium/i,
  "donneurs de formaldéhyde": /formaldehyde|dmdm|imidazolidinyl|diazolidinyl|quaternium-15|bronopol|hydroxymethylglycinate|methenamine|benzylhemiformal/i,
  isothiazolinones: /isothiazolinone/i,
  "BHA et BHT": /\bbha\b|\bbht\b|butylated hydroxy/i,
  "huiles minérales": /paraffinum|petrolatum|mineral oil|microcrystalline wax|ozokerite|ceresin|isoparaffin/i,
};

describe("pages Formules et ingrédients, Standard de beauté propre : ce qu'elles annoncent est vrai", () => {
  const AVEC_INCI = PRODUCTS.filter((p) => (p.inci ?? "").trim().length > 20 && p.status !== "retired");
  const inciDe = (p: (typeof PRODUCTS)[number]) => listeInci(p.inci);

  it("le catalogue contrôlé n'est pas vide", () => {
    expect(AVEC_INCI.length).toBeGreaterThan(100);
  });

  for (const [famille, motif] of Object.entries(FAMILLES)) {
    it(`aucun produit du catalogue ne contient : ${famille}`, () => {
      const fautifs = AVEC_INCI.filter((p) => motif.test(inciDe(p))).map((p) => p.nom);
      expect(fautifs, `la page annonce « ${famille} » absents de chaque formule`).toEqual([]);
    });
  }

  it("la page n'annonce pas d'exclusion qui ne tient pas pour tous les produits", () => {
    expect(toutLeTexte).not.toMatch(/\bPEG\b/);
    expect(toutLeTexte).not.toMatch(/colorants? (?:de synth|artificiel)/i);
    expect(toutLeTexte).not.toMatch(/ph[ée]noxy[ée]thanol/i);
    expect(toutLeTexte).not.toMatch(/sans sulfates?/i);
  });

  it("jamais « toutes les formules » pour les mentions véganes, bio ou certifiées", () => {
    expect(toutLeTexte).not.toMatch(/tou(?:te)?s? (?:nos |les )?(?:formules?|produits?|soins?)[^.]{0,40}(?:v[ée]gan|bio\b|certifi)/i);
  });
});

describe("pages Formules et ingrédients, Standard de beauté propre : règles de Biolystes", () => {
  it("aucun nom de laboratoire, aucun lien vers lui, aucun mot qui y mène", () => {
    // le nom du fournisseur ne s'écrit jamais en clair dans le dépôt : src/lib/fournisseur-masque.ts le recompose à l'exécution
    expect(citeLeFournisseur(toutLeTexte)).toBe(false);
    expect(toutLeTexte).not.toMatch(/\bmandat|cpnp/i);
  });

  it("aucun prix", () => {
    expect(toutLeTexte).not.toMatch(/€|\beuros?\b|\bHT\b|\bTTC\b/);
  });

  it("aucun tiret long, jamais « fabrication à la commande »", () => {
    expect(toutLeTexte).not.toMatch(/[—–]/);
    expect(toutLeTexte).not.toMatch(/fabrication à la commande|fabriqu[ée]s? à la (?:commande|demande)/i);
  });

  it("les descriptions SEO tiennent en 160 caractères", () => {
    for (const { f, texte } of textes) {
      const m = texte.match(/const SEO_DESCRIPTION =\s*\n?\s*"([^"]+)"/);
      if (!m) continue;
      expect(m[1].length, f).toBeLessThanOrEqual(160);
    }
  });
});
