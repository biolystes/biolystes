/* Filtres du catalogue (27/10/2026) : valeurs tirées des vrais produits, OU dans
   un filtre, ET entre filtres, aucun prix, une photo de NOS produits par catégorie. */
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { createElement } from "react";
import CatalogPage from "@/pages/CatalogPage";
import { PRODUCTS } from "@/data/catalogue-pro/products";
import { CATEGORIES_MASQUEES, PRODUITS_PROPRES, PRODUITS_VISIBLES, estEnBas, estMasque } from "@/data/masquage-catalogue";
import { correspond, optionsFiltres, selectionVide, trier, valeursDe } from "@/lib/filtres-catalogue";
import { badgeDisponibilite } from "@/data/disponibilite";
import { citeLeFournisseur } from "@/lib/fournisseur-masque";

describe("filtres du catalogue", () => {
  const options = optionsFiltres();

  it("chaque valeur proposée mène à au moins un soin", () => {
    for (const k of Object.keys(options) as (keyof typeof options)[]) {
      expect(options[k].length, k).toBeGreaterThan(0);
      for (const o of options[k]) {
        const s = selectionVide();
        s[k].add(o.valeur);
        expect(PRODUITS_VISIBLES.filter((p) => correspond(p, s)).length, `${k}:${o.valeur}`).toBe(o.n);
        expect(o.n).toBeGreaterThan(0);
      }
    }
  });

  it("OU dans un filtre, ET entre les filtres", () => {
    const s = selectionVide();
    s.categorie.add("soins-du-visage");
    const visage = PRODUCTS.filter((p) => correspond(p, s));
    s.categorie.add("maquillage");
    const deux = PRODUCTS.filter((p) => correspond(p, s));
    expect(deux.length).toBeGreaterThan(visage.length);
    s.type.add("Crème");
    const cremes = PRODUCTS.filter((p) => correspond(p, s));
    expect(cremes.length).toBeLessThan(deux.length);
    for (const p of cremes) expect(valeursDe(p).type).toContain("Crème");
  });

  it("le tri A à Z range les produits disponibles par ordre alphabétique", () => {
    const dispo = trier(PRODUCTS, "az").filter((p) => p.status !== "retired" && !badgeDisponibilite(p));
    const noms = dispo.map((p) => p.nom);
    expect(noms).toEqual([...noms].sort((a, b) => a.localeCompare(b, "fr", { sensitivity: "base" })));
  });

  it("tri par défaut : les « Bientôt » en tête, puis les nouveautés, puis le reste, les compléments tout en bas", () => {
    const l = trier(PRODUITS_VISIBLES, "nouveautes");
    const haut = l.filter((p) => !estEnBas(p));
    const nb = haut.filter((p) => p.status !== "retired" && badgeDisponibilite(p) === "Bientôt").length;
    for (const p of haut.slice(0, nb)) expect(badgeDisponibilite(p), p.slug).toBe("Bientôt");
    expect(haut.slice(nb).some((p) => badgeDisponibilite(p) === "Bientôt")).toBe(false);
    // JP 27/10/2026 : tout ce qui touche aux compléments alimentaires est tout en bas de la sélection, dans les deux tris.
    for (const tri of ["nouveautes", "az"] as const) {
      const t = trier(PRODUITS_VISIBLES, tri);
      const premierEnBas = t.findIndex((p) => estEnBas(p));
      expect(premierEnBas, tri).toBeGreaterThan(0);
      for (const p of t.slice(premierEnBas)) expect(estEnBas(p), `${tri} ${p.slug}`).toBe(true);
    }
  });

  it("les compléments alimentaires sont masqués, sauf les images vérifiées propres (réglage réversible)", () => {
    expect(CATEGORIES_MASQUEES).toContain("supplements");
    const complements = PRODUCTS.filter((p) => p.categorie === "supplements");
    expect(complements.length).toBeGreaterThan(PRODUITS_PROPRES.length);
    // Tout produit de la catégorie est masqué, sauf ceux de la liste « propres » ; la liste ne contient que de vrais produits.
    for (const p of complements) expect(estMasque(p), p.slug).toBe(!PRODUITS_PROPRES.includes(p.slug));
    for (const slug of PRODUITS_PROPRES) expect(complements.some((p) => p.slug === slug), slug).toBe(true);
    expect(PRODUITS_VISIBLES.filter((p) => p.categorie === "supplements").map((p) => p.slug).sort()).toEqual([...PRODUITS_PROPRES].sort());
    // Aucune donnée supprimée : la copie du catalogue garde les 83.
    expect(complements.length).toBe(83);
  });

  it("la page : choisir une catégorie filtre les cartes, le titre la nomme, aucun prix n'apparaît", () => {
    const { container } = render(createElement(CatalogPage, { sansPrix: true }));
    expect(container.querySelector("[data-titre-liste]")!.textContent).toBe("Tous les produits");
    fireEvent.click(container.querySelector('[data-filtre="categorie"]')!);
    const vignettes = container.querySelectorAll("[data-categorie-choix] img");
    expect(vignettes.length).toBeGreaterThanOrEqual(7);
    for (const v of vignettes) expect(citeLeFournisseur(v.getAttribute("src") ?? "")).toBe(false);
    fireEvent.click(container.querySelector('[data-categorie-choix="maquillage"]')!);
    expect(container.querySelector("[data-titre-liste]")!.textContent).toBe("Maquillage");
    const attendu = PRODUCTS.filter((p) => p.categorie === "maquillage").length;
    expect(container.querySelectorAll("[data-produit]").length).toBe(attendu);
    expect(container.querySelector("[data-compteur-filtres]")!.textContent).toBe("1");
    expect(container.textContent).not.toContain("€");
    expect(container.textContent).not.toMatch(/prix/i);
  });
});
