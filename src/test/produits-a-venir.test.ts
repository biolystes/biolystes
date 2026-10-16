import { describe, it, expect } from "vitest";
import { PRODUCTS } from "@/data/catalogue-pro/products";
import { badgeDisponibilite, peutEtreCommande } from "@/data/disponibilite";

const sachets = PRODUCTS.filter((p) => p.code?.startsWith("SC"));

describe("produits à venir", () => {
  it("le catalogue contient les 10 sachets d'essai SC", () => {
    expect(sachets).toHaveLength(10);
  });
  it("chaque sachet porte le badge « Bientôt » et ne se commande pas", () => {
    for (const p of sachets) {
      expect(badgeDisponibilite(p), p.code).toBe("Bientôt");
      expect(peutEtreCommande(p), p.code).toBe(false);
    }
  });
  it("un produit au statut coming_soon porte « Bientôt » et ne se commande pas", () => {
    const p = { status: "coming_soon" as const, statut_labo: "actif" as const, prix_ht: 10 };
    expect(badgeDisponibilite(p)).toBe("Bientôt");
    expect(peutEtreCommande(p)).toBe(false);
  });
});
