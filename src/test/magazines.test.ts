import { describe, expect, it } from "vitest";
import { MAGAZINES, filtrerMagazines } from "@/data/magazines";

describe("Catalogue public des magazines", () => {
  it("ne transporte aucun prix d’offre dans les données publiques", () => {
    expect(MAGAZINES.length).toBe(17);
    for (const magazine of MAGAZINES) expect(Object.keys(magazine)).not.toContain("prix");
  });
  it("recherche un éditeur et filtre sa thématique", () => {
    expect(filtrerMagazines("marieclaire", ["Mode & Beauté"]).map(m => m.editeur)).toEqual(["marieclaire.fr"]);
    expect(filtrerMagazines("marieclaire", ["Auto & Moto"])).toEqual([]);
  });
});