import { describe, it, expect } from "vitest";
import { PRODUCTS } from "@/data/catalogue-pro/products";
import { PRODUITS_VISIBLES } from "@/data/masquage-catalogue";
import { RITUEL_K_BEAUTY, INTRO_K_BEAUTY } from "@/data/k-beauty";
import { CATEGORIES_FILTRE, correspond, optionsFiltres, selectionVide, trierRituel, valeursDe } from "@/lib/filtres-catalogue";

describe("catégorie Inspiré K-beauty", () => {
  it("existe juste après les soins du visage", () => {
    const ids = CATEGORIES_FILTRE.map((c) => c.id);
    expect(ids[ids.indexOf("soins-du-visage") + 1]).toBe("k-beauty");
    expect(optionsFiltres().categorie.find((o) => o.valeur === "k-beauty")?.libelle).toBe("Inspiré K-beauty");
  });
  it("contient les codes trouvés, dans l'ordre du rituel", () => {
    const s = selectionVide(); s.categorie.add("k-beauty");
    const codes = trierRituel(PRODUITS_VISIBLES.filter((p) => correspond(p, s))).map((p) => p.code);
    const attendus = RITUEL_K_BEAUTY.map((x) => x.code).filter((c) => PRODUITS_VISIBLES.some((p) => p.code === c));
    expect(codes).toEqual(attendus);
    expect(codes.slice(0, 2)).toEqual(["A5924", "A5852"]);
    expect(codes.at(-1)).toBe("S0016");
  });
  it("les produits restent dans leur catégorie d'origine", () => {
    for (const { code } of RITUEL_K_BEAUTY) {
      const p = PRODUCTS.find((x) => x.code === code)!;
      expect(valeursDe(p).categorie).toEqual([p.categorie, "k-beauty"]);
    }
  });
  it("aucune mention de la Corée", () => {
    expect(INTRO_K_BEAUTY).not.toMatch(/cor[ée]e|korea/i);
  });
});
