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
  it("filtre le lectorat masculin", () => {
    expect(filtrerMagazines("", { lectorats: ["Homme"] }).map(m => m.editeur)).toEqual(["gqmagazine.fr"]);
  });
  it("filtre le positionnement people", () => {
    expect(filtrerMagazines("", { positionnements: ["People"] }).map(m => m.editeur)).toEqual(["purepeople.com", "voici.fr", "public.fr"]);
  });
  it("filtre les audiences de plus d'1 million", () => {
    expect(filtrerMagazines("", { audiences: [3] }).map(m => m.editeur)).toEqual(["purepeople.com", "femmeactuelle.fr", "voici.fr", "marieclaire.fr"]);
  });
});
