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
import { CATEGORIES, NOMBRE_PRODUITS_COMMANDABLES, PRODUCTS, estCommandable, estNouveau } from "@/data/catalogue-pro/products";
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
    // Un seul chiffre : en-tête = pastille « Tous les produits » = compteur de liste,
    // les produits commandables, compléments alimentaires compris, retirés exclus.
    const commandables = PRODUCTS.filter((p) => estCommandable(p)).length;
    expect(NOMBRE_PRODUITS_COMMANDABLES).toBe(commandables);
    expect(screen.getByTestId("nombre-catalogue").textContent).toBe(`${commandables} produits`);
    expect(container.querySelector('[data-compteur="pastille-all"]')?.textContent).toBe(`(${commandables})`);
    expect(screen.getByTestId("nombre-produits").textContent).toBe(`${commandables} produits`);
    const texte = container.textContent ?? "";
    expect(texte).toMatch(/HT/);
    for (const interdit of [/599\s*€/, /1[\s\u00a0\u202f]?499\s*€/, /2[\s\u00a0\u202f]?999\s*€/, /Nos Offres/i, /Pack (Design|Standard|IA)/]) {
      expect(texte, String(interdit)).not.toMatch(interdit);
    }

    const fiches = [...container.querySelectorAll("[data-produit]")];
    const nouveautes = PRODUCTS.filter((p) => estNouveau(p));
    // Badge de 60 jours : passé ce délai, il peut n'y avoir ni nouveauté ni pastille.
    expect(fiches.slice(0, nouveautes.length).map((f) => f.getAttribute("data-produit")).sort(), "nouveautés en tête").toEqual(nouveautes.map((p) => p.slug).sort());
    expect(container.querySelectorAll("[data-badge-nouveau]").length).toBe(nouveautes.filter((p) => !p.status).length);
    const pastille = screen.getAllByRole("button").find((b) => /^Nouveautés/.test(b.textContent ?? ""));
    expect(pastille?.textContent).toBe(nouveautes.length ? `Nouveautés(${nouveautes.length})` : undefined);
    expect(texte).toContain("Compléments alimentaires");
    expect(texte).not.toMatch(/Supplements/);

    const avecInci = PRODUCTS.find((p) => p.inci && p.prix_ht != null)!;
    fireEvent.click(container.querySelector(`[data-produit="${avecInci.slug}"]`)!);
    const fiche = screen.getByRole("dialog");
    expect(fiche.textContent).toContain("Composition INCI");
    expect(fiche.textContent).toContain(avecInci.inci.slice(0, 40));
    // Aucun prix sur les pages publiques sauf /tarifs : la fiche dit « Prix sur devis ».
    expect(screen.queryByTestId("prix-ht")).toBeNull();
    expect(fiche.textContent).not.toContain(avecInci.prix_ht!.toFixed(2).replace(".", ",") + " €");
    expect(screen.getByTestId("prix-sur-devis").textContent).toBe("Prix sur devis");
  });

  it("chaque pastille de catégorie donne le nombre du compteur de liste une fois ouverte", () => {
    const { container } = render(createElement(CatalogPage));
    for (const cat of CATEGORIES) {
      const pastille = container.querySelector(`[data-compteur="pastille-${cat.id}"]`)!;
      const attendu = pastille.textContent!.replace(/\D/g, "");
      fireEvent.click(pastille.closest("button")!);
      expect(screen.getByTestId("nombre-produits").textContent!.replace(/\D/g, ""), cat.id).toBe(attendu);
    }
  });

  it("les produits retirés restent visibles, en fin de liste, marqués non commandables", () => {
    const { container } = render(createElement(CatalogPage));
    const retires = PRODUCTS.filter((p) => p.status === "retired").map((p) => p.slug);
    expect(retires.length).toBeGreaterThan(0);
    const fiches = [...container.querySelectorAll("[data-produit]")];
    const fin = fiches.slice(-retires.length);
    expect(fin.map((f) => f.getAttribute("data-produit")).sort()).toEqual([...retires].sort());
    for (const f of fin) expect(f.textContent).toContain("Non commandable");
    expect(fiches.filter((f) => f.textContent!.includes("Non commandable")).length).toBe(retires.length);
  });
});
