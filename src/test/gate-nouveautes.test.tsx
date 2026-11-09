/* /nouveautes et /nos-soins sont derrière le mot de passe du catalogue depuis
   le 09/11/2026 (Odile) : sans le mot de passe, aucune fiche produit ne
   s'affiche ; avec « biolystes » (PASSWORD dans CatalogPasswordGate.tsx), la
   page apparaît normalement. */
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import CatalogPasswordGate from "@/components/CatalogPasswordGate";
import NouveautesPage from "@/pages/NouveautesPage";

const pageGatee = () => (
  <HelmetProvider>
    <CatalogPasswordGate titre="Nos soins">
      <NouveautesPage />
    </CatalogPasswordGate>
  </HelmetProvider>
);

describe("mot de passe du catalogue sur /nouveautes et /nos-soins", () => {
  beforeEach(() => sessionStorage.clear());

  it("sans le mot de passe, l'écran du mot de passe s'affiche et aucune fiche produit", () => {
    const { container } = render(pageGatee());
    expect(screen.getByLabelText("Mot de passe")).toBeTruthy();
    expect(container.querySelectorAll("[data-produit]").length).toBe(0);
  });

  it("un mot de passe faux ne fait pas apparaître la page", () => {
    const { container } = render(pageGatee());
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "lystes" } });
    fireEvent.click(screen.getByText("Accéder"));
    expect(screen.getByText("Mot de passe incorrect.")).toBeTruthy();
    expect(container.querySelectorAll("[data-produit]").length).toBe(0);
  });

  it("avec « biolystes », toutes les fiches apparaissent", () => {
    const { container } = render(pageGatee());
    fireEvent.change(screen.getByLabelText("Mot de passe"), { target: { value: "biolystes" } });
    fireEvent.click(screen.getByText("Accéder"));
    expect(container.querySelectorAll("[data-produit]").length).toBeGreaterThan(100);
  });
});
