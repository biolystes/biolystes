import { describe, expect, it } from "vitest";
import { peutAjouterProduit, PRODUIT_EN_PLUS } from "@/data/offres";

describe("Produits supplémentaires des packs", () => {
  it("Design : un produit en plus est autorisé", () => {
    expect(peutAjouterProduit("design")).toBe(true);
  });
  it("Solo : passer au pack supérieur, aucun produit supplémentaire", () => {
    expect(peutAjouterProduit("solo")).toBe(false);
  });
  it("Duo : passer au pack supérieur, aucun produit supplémentaire", () => {
    expect(peutAjouterProduit("duo")).toBe(false);
  });
  it("Standard autorise les produits supplémentaires", () => {
    expect(peutAjouterProduit("standard")).toBe(true);
  });
  it("IA autorise les produits supplémentaires", () => {
    expect(peutAjouterProduit("ia")).toBe(true);
  });
  it("Un design de produit supplémentaire coûte 39 euros TTC", () => {
    expect(PRODUIT_EN_PLUS).toBe(39);
  });
});
