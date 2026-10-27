/**
 * Statut des produits chez le laboratoire, sur biolystes.com/catalogue
 * (JP, 15/10/2026 : des produits pas encore sortis étaient affichés comme
 * disponibles, certains avec le badge « Nouveau »).
 *
 * Le champ statut_labo vient de biolystes.pro (copie synchronisée de
 * src/data/products.ts, généré depuis la moisson). Ici : il correspond à la
 * moisson quand elle est sur ce Mac, aucun produit non actif n'a « Nouveau »
 * ni n'est commandable, et la page les montre après les disponibles, badgés.
 */
import { existsSync, readFileSync, realpathSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PRODUCTS, estCommandable, estNouveau, mentionStatutLabo } from "@/data/catalogue-pro/products";
import CatalogPage from "@/pages/CatalogPage";
import { PRODUITS_VISIBLES, estEnBas } from "@/data/masquage-catalogue";
import { badgeDisponibilite, estAVenir } from "@/data/disponibilite";

const INDISPONIBLES = PRODUCTS.filter((p) => mentionStatutLabo(p));
const SERVICES_DESIGN = new Set(["Concept", "Adaptation", "DESIGN", "Technical"]);

describe("statut des produits chez le laboratoire (biolystes.com)", () => {
  it("chaque fiche du laboratoire porte le statut de la dernière moisson, quand elle est sur ce Mac", (ctx) => {
    const fichier = path.join(os.homedir(), "lystes-agents/catalogue-labo/catalogue-dernier.json");
    if (!existsSync(fichier)) {
      ctx.skip();
      return;
    }
    const moisson = JSON.parse(readFileSync(realpathSync(fichier), "utf8")) as { resume: { code: string; statut: string } }[];
    const attendu = Object.fromEntries(
      moisson.filter(({ resume }) => !SERVICES_DESIGN.has(resume.code)).map(({ resume }) => [resume.code, resume.statut]),
    );
    const copie = Object.fromEntries(PRODUCTS.filter((p) => p.code && p.status !== "retired").map((p) => [p.code!, p.statut_labo]));
    expect(copie, "moisson plus récente : node scripts/statuts-moisson.mjs dans biolystes.pro, puis node scripts/sync-catalogue-pro.mjs ici").toEqual(attendu);
  });

  it("aucun produit non actif n'a le badge « Nouveau » ni ne peut être commandé", () => {
    expect(INDISPONIBLES.length).toBeGreaterThan(0);
    for (const p of INDISPONIBLES) {
      expect(estNouveau({ ...p, date_arrivee: "2026-10-15" }, new Date("2026-10-15T12:00:00")), p.code).toBe(false);
      expect(estCommandable(p), p.code).toBe(false);
    }
  });

  it("la page met tous les « Bientôt » en tête, puis les produits disponibles, les ruptures à la suite, jamais « Nouveau » sur eux", () => {
    const { container } = render(createElement(CatalogPage));
    const cartes = [...container.querySelectorAll("[data-produit]")];
    const slugs = cartes.map((c) => c.getAttribute("data-produit")!);
    // Les compléments alimentaires (masqués sauf images propres, JP 27/10/2026) sont rangés tout en bas, après tout le reste.
    const aVenir = PRODUITS_VISIBLES.filter((p) => p.status !== "retired" && estAVenir(p));
    const aVenirHaut = aVenir.filter((p) => !estEnBas(p));
    expect(aVenirHaut.length).toBeGreaterThan(0);
    // Tous les « Bientôt » des soins et du maquillage occupent les premières places.
    expect(new Set(slugs.slice(0, aVenirHaut.length))).toEqual(new Set(aVenirHaut.map((p) => p.slug)));
    // Les compléments alimentaires ferment la liste.
    const nbEnBas = PRODUITS_VISIBLES.filter((p) => estEnBas(p)).length;
    for (const s of slugs.slice(-nbEnBas)) expect(estEnBas(PRODUCTS.find((p) => p.slug === s)!), s).toBe(true);
    for (const p of aVenir) {
      const carte = cartes[slugs.indexOf(p.slug)];
      expect(carte.querySelector("[data-badge-nouveau]"), p.slug).toBeNull();
      expect(carte.querySelector("[data-badge-statut]")?.textContent, p.slug).toBe(badgeDisponibilite(p));
    }
    const disponibles = new Set(PRODUITS_VISIBLES.filter((p) => p.status !== "retired" && !badgeDisponibilite(p)).map((p) => p.slug));
    const derniereDisponible = Math.max(...slugs.map((s, i) => (disponibles.has(s) ? i : -1)));
    for (const p of INDISPONIBLES.filter((x) => x.statut_labo === "OUT_OF_STOCK")) {
      expect(slugs.indexOf(p.slug), `${p.code} rupture après les disponibles`).toBeGreaterThan(derniereDisponible);
    }
  });

  it("la recherche « bombe » montre les bombes à venir et le dit : jamais « 0 produit » seul", () => {
    const { container } = render(createElement(CatalogPage));
    fireEvent.change(screen.getByPlaceholderText("Rechercher un produit..."), { target: { value: "bombe" } });
    const cartes = [...container.querySelectorAll("[data-produit]")];
    const aVenir = cartes.filter((c) => c.getAttribute("data-statut-labo") === "COMING_SOON").length;
    expect(aVenir).toBeGreaterThan(0);
    const commandables = cartes.length - aVenir;
    expect(screen.getByTestId("nombre-produits").parentElement!.textContent).toBe(
      `${commandables} produit${commandables > 1 ? "s" : ""} · ${aVenir} bientôt disponible${aVenir > 1 ? "s" : ""}`,
    );
  });

  it("sous 768 px, la barre n'a que deux boutons : « Trier par » (1/3) et « Filtres » (2/3)", () => {
    const { container } = render(createElement(CatalogPage));
    const mobile = container.querySelector("[data-barre-filtres] .barre-filtres-tel")!;
    expect(mobile.className).toContain("grid-cols-3");
    expect(mobile.querySelectorAll("button").length).toBe(2);
    expect(mobile.querySelector("[data-tri]")!.parentElement!.className).toContain("col-span-1");
    expect(mobile.querySelector("[data-ouvrir-filtres]")!.className).toContain("col-span-2");
  });
});
