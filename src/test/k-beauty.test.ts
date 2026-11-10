import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { MemoryRouter } from "react-router-dom";
import CatalogPage from "@/pages/CatalogPage";
import { PRODUCTS } from "@/data/catalogue-pro/products";
import { PRODUITS_VISIBLES } from "@/data/masquage-catalogue";
import { RITUEL_K_BEAUTY, INTRO_K_BEAUTY } from "@/data/k-beauty";
import { COPIES_K_BEAUTY } from "@/data/k-beauty-copies";
import { CATEGORIES_FILTRE, correspond, optionsFiltres, selectionVide, trierRituel, valeursDe } from "@/lib/filtres-catalogue";

const CODES = RITUEL_K_BEAUTY.map((x) => x.code);
const choix = (id: string) => { const s = selectionVide(); s.categorie.add(id); return PRODUITS_VISIBLES.filter((p) => correspond(p, s)); };

describe("catégorie Inspiré K-beauty (produits doublés)", () => {
  it("existe juste après les soins du visage, avec 14 produits", () => {
    const ids = CATEGORIES_FILTRE.map((c) => c.id);
    expect(ids[ids.indexOf("soins-du-visage") + 1]).toBe("k-beauty");
    const o = optionsFiltres(PRODUITS_VISIBLES).categorie.find((x) => x.valeur === "k-beauty");
    expect(o?.libelle).toBe("Inspiré K-beauty");
    expect(o?.n).toBe(14);
  });
  it("les originaux restent seuls dans leur catégorie, nom inchangé", () => {
    for (const code of CODES) {
      const p = PRODUCTS.find((x) => x.code === code)!;
      expect(valeursDe(p).categorie).toEqual([p.categorie]);
      expect(p.nom).not.toContain("K-Beauty");
    }
  });
  it("14 copies : suffixe, slug unique, catégorie k-beauty, ordre du rituel", () => {
    expect(COPIES_K_BEAUTY).toHaveLength(14);
    const slugs = PRODUITS_VISIBLES.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const c of COPIES_K_BEAUTY) {
      const o = PRODUCTS.find((x) => x.code === c.code)!;
      expect(c.nom).toBe(`${o.nom} (K-Beauty Inspiration)`);
      expect(c.slug).toBe(`${o.slug}-k-beauty-inspiration`);
      expect(c.categorie).toBe("k-beauty");
      expect(c.inci).toBe(o.inci);
    }
    expect(trierRituel(choix("k-beauty")).map((p) => p.code)).toEqual(CODES);
    expect(choix("soins-du-visage").some((p) => p.categorie === "k-beauty")).toBe(false);
  });
  it("chaque copie a sa fiche", () => {
    for (const c of COPIES_K_BEAUTY) {
      window.history.replaceState(null, "", `/catalogue?produit=${c.slug}`);
      const { unmount } = render(createElement(MemoryRouter, null, createElement(CatalogPage)));
      expect(screen.getByRole("dialog", { name: c.nom })).toBeTruthy();
      unmount();
    }
    window.history.replaceState(null, "", "/");
  }, 60000);
  it("aucune mention de la Corée", () => {
    expect(INTRO_K_BEAUTY).not.toMatch(/cor[ée]e|korea/i);
  });
});
