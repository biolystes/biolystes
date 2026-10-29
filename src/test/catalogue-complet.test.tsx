/* /nouveautes (page cachée de relance, ex-/catalogue-complet-7q4m) :
   exactement le même catalogue que /catalogue, mais sans aucune mention de
   prix nulle part, et une accroche dont le nombre est calculé sur le vrai
   catalogue. /catalogue, elle, affiche les prix HT (JP, 29/10/2026). */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CatalogPage from "@/pages/CatalogPage";

describe("catalogue caché sans prix", () => {
  it("la version sansPrix n'affiche aucune mention de prix", () => {
    const { container } = render(<CatalogPage sansPrix />);
    expect(screen.queryByText("Prix sur devis")).toBeNull();
    expect(container.textContent).not.toContain("€");
    expect(container.textContent).not.toMatch(/prix/i);
  });

  it("la version sansPrix affiche bien tout le catalogue", () => {
    const { container } = render(<CatalogPage sansPrix />);
    expect(container.querySelectorAll("[data-produit]").length).toBeGreaterThan(100);
  });

  it("la version normale (/catalogue) affiche les prix HT sur les cartes", () => {
    const { container } = render(<CatalogPage />);
    expect(container.querySelectorAll("[data-prix-carte]").length).toBeGreaterThan(100);
  });
});
