import { describe, expect, it } from "vitest";
import { MAGAZINES, filtrerMagazines } from "@/data/magazines";

describe("Catalogue public des magazines", () => {
  it("ne transporte aucun prix d’offre dans les données publiques", () => {
    expect(MAGAZINES.length).toBe(17);
    for (const magazine of MAGAZINES) expect(Object.keys(magazine)).not.toContain("prix");
  });
  it("recherche un éditeur", () => {
    expect(filtrerMagazines("marieclaire").map(m => m.editeur)).toEqual(["marieclaire.fr"]);
  });
  it("filtre l'audience mensuelle", () => {
    expect(filtrerMagazines("", { audienceMin: 1000000 }).map(m => m.editeur)).toEqual(["purepeople.com", "femmeactuelle.fr", "voici.fr", "marieclaire.fr"]);
  });
  it("sélectionne un média sans inventer de score de notoriété", () => {
    expect(filtrerMagazines("", { editeur: "vogue.fr" }).map(m => m.editeur)).toEqual(["vogue.fr"]);
  });
  it("filtre la qualité du référencement sur le Trust Flow", () => {
    expect(filtrerMagazines("", { tfMin: 60 }).map(m => m.editeur)).toEqual(["vogue.fr", "latribune.fr", "marieclaire.fr"]);
  });
});