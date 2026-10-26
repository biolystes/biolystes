/* /nouveautes (page cachée de relance, ex-/catalogue-complet-7q4m) :
   exactement le même catalogue que /catalogue, mais sans aucune mention de
   prix nulle part, et une accroche dont le nombre est calculé sur le vrai
   catalogue. /catalogue, elle, doit rester inchangée (« Prix sur devis »). */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CatalogPage from "@/pages/CatalogPage";
import { accrocheNombre } from "@/pages/NouveautesPage";
import { PRODUCTS } from "@/data/catalogue-pro/products";

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

  it("la version normale (/catalogue) reste inchangée", () => {
    render(<CatalogPage />);
    expect(screen.getAllByText("Prix sur devis").length).toBeGreaterThan(0);
  });
});

describe("accroche de /nouveautes", () => {
  it("le nombre est calculé sur le vrai catalogue, jamais surestimé", () => {
    expect(accrocheNombre(PRODUCTS.length)).toBe("Près de 300");
    expect(accrocheNombre(240)).toBe("Plus de 200");
    expect(accrocheNombre(391)).toBe("Près de 400");
    expect(accrocheNombre(100)).toBe("Plus de 100");
  });
});
