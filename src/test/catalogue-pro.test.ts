/**
 * /catalogue = le catalogue de biolystes.pro (JP, 14/10/2026).
 *
 * Les données de src/data/catalogue-pro/ sont une copie synchronisée de
 * biolystes/commandcenterbiolystes (scripts/sync-catalogue-pro.mjs). Ce test
 * échoue si la copie est retouchée à la main, si biolystes.pro a changé
 * depuis la dernière synchronisation, si le nom du laboratoire apparaît, ou
 * si la page n'affiche plus tous les produits ou affiche des prix de packs.
 *
 * S'il échoue sur « identique à biolystes.pro » : relancer
 * `node scripts/sync-catalogue-pro.mjs`, jamais modifier les données ici.
 * S'il échoue sur « la page de biolystes.pro n'a pas changé » : reporter le
 * changement de src/pages/CataloguePage.tsx de biolystes.pro dans
 * src/pages/CatalogPage.tsx (badge, filtre…), puis relancer la synchro.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PRODUCTS } from "@/data/catalogue-pro/products";
import imagesApprouvees from "@/data/catalogue-pro/images-approuvees.json";
import source from "@/data/catalogue-pro/source.json";
import { citeLeFournisseur } from "@/lib/fournisseur-masque";
import CatalogPage, { getProductImage } from "@/pages/CatalogPage";
import { FICHIER_COMPOSANT, FICHIER_PRODUITS, codesProduits, lireFichier, lireImagesApprouvees, sha256 } from "../../scripts/catalogue-pro-commun.mjs";

const DOSSIER = path.resolve(__dirname, "../data/catalogue-pro");
const codes = codesProduits as (src: string) => string[];
const copie = readFileSync(path.join(DOSSIER, "products.ts"), "utf8");

describe("catalogue de biolystes.com = catalogue de biolystes.pro", () => {
  it("la copie n'a pas été retouchée à la main", () => {
    expect(sha256(copie)).toBe(source.sha256);
    expect(PRODUCTS.length).toBe(source.nombre);
    expect(sha256(PRODUCTS.map((p) => p.slug).join("\n"))).toBe(source.codes_sha256);
    expect(codes(copie)).toEqual(PRODUCTS.map((p) => p.slug));
  });

  it("identique à biolystes.pro (branche main) : produits, codes, photos, page", async (ctx) => {
    let distant: string;
    try {
      distant = lireFichier(FICHIER_PRODUITS);
    } catch {
      // Ni `gh` ni réseau (intégration continue hors du Mac de JP) : rien à comparer.
      ctx.skip();
      return;
    }
    const codesPro = codes(distant);
    expect(PRODUCTS.length, "nombre de produits").toBe(codesPro.length);
    expect(PRODUCTS.map((p) => p.slug), "codes des produits").toEqual(codesPro);
    expect(sha256(copie), "products.ts diffère : relancer node scripts/sync-catalogue-pro.mjs").toBe(sha256(distant));
    expect(
      sha256(await lireImagesApprouvees()),
      "photos approuvées de biolystes.pro changées : relancer node scripts/sync-catalogue-pro.mjs",
    ).toBe(source.images_sha256);
    expect(
      sha256(lireFichier(FICHIER_COMPOSANT)),
      "la page de biolystes.pro a changé : reporter le changement dans src/pages/CatalogPage.tsx, puis relancer la synchro",
    ).toBe(source.composant_sha256);
  }, 60_000);

  it("le nom du laboratoire n'apparaît dans aucune donnée ni aucune image", () => {
    for (const p of PRODUCTS) {
      expect(citeLeFournisseur(JSON.stringify(p)), p.slug).toBe(false);
      expect(citeLeFournisseur(getProductImage(p)), p.slug).toBe(false);
    }
    expect(citeLeFournisseur(JSON.stringify(imagesApprouvees))).toBe(false);
  });

  it("la page affiche tous les produits, le prix HT et l'INCI, sans prix de packs", () => {
    const { container } = render(createElement(CatalogPage));
    expect(container.querySelectorAll("[data-produit]").length).toBe(PRODUCTS.length);
    expect(screen.getByTestId("nombre-produits").textContent).toBe(`${PRODUCTS.length} produits`);
    const texte = container.textContent ?? "";
    expect(texte).toMatch(/HT/);
    for (const interdit of [/599\s*€/, /1[\s\u00a0\u202f]?499\s*€/, /2[\s\u00a0\u202f]?999\s*€/, /Nos Offres/i, /Pack (Design|Standard|IA)/]) {
      expect(texte, String(interdit)).not.toMatch(interdit);
    }

    const avecInci = PRODUCTS.find((p) => p.inci && p.prix_ht != null)!;
    fireEvent.click(container.querySelector(`[data-produit="${avecInci.slug}"]`)!);
    const fiche = screen.getByRole("dialog");
    expect(fiche.textContent).toContain("Composition INCI");
    expect(fiche.textContent).toContain(avecInci.inci.slice(0, 40));
    expect(screen.getByTestId("prix-ht").textContent).toContain(avecInci.prix_ht!.toFixed(2).replace(".", ","));
  });
});
