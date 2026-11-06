import { describe, expect, it } from "vitest";
import { desactiverClicDroit } from "../lib/clic-droit";

describe("Clic droit sur le site", () => {
  it("empêche le menu contextuel sans bloquer le clic normal", () => {
    const cible = new EventTarget();
    const retirer = desactiverClicDroit(cible);
    const clicDroit = new Event("contextmenu", { cancelable: true });
    cible.dispatchEvent(clicDroit);
    expect(clicDroit.defaultPrevented).toBe(true);
    const clic = new Event("click", { cancelable: true });
    cible.dispatchEvent(clic);
    expect(clic.defaultPrevented).toBe(false);
    retirer();
  });
});