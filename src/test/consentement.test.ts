import { beforeEach, describe, expect, it, vi } from "vitest";
import { CLE_CHOIX, DUREE_CHOIX_MS, enregistrerChoix, lireChoix } from "@/lib/consentement";

describe("consentement aux cookies de mesure", () => {
  beforeEach(() => {
    localStorage.clear();
    delete (window as unknown as { gtag?: unknown }).gtag;
  });

  it("n'a aucun choix tant que le visiteur n'a pas répondu", () => {
    expect(lireChoix()).toBeNull();
  });

  it("mémorise « accepté » six mois et le transmet à Google", () => {
    const gtag = vi.fn();
    (window as unknown as { gtag: unknown }).gtag = gtag;
    enregistrerChoix("accepte");
    expect(lireChoix()).toBe("accepte");
    expect(gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "granted" });
    const { t } = JSON.parse(localStorage.getItem(CLE_CHOIX)!);
    expect(t - Date.now()).toBeGreaterThan(DUREE_CHOIX_MS - 5000);
  });

  it("mémorise « refusé »", () => {
    const gtag = vi.fn();
    (window as unknown as { gtag: unknown }).gtag = gtag;
    enregistrerChoix("refuse");
    expect(lireChoix()).toBe("refuse");
    expect(gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "denied" });
  });

  it("oublie le choix une fois les six mois passés", () => {
    enregistrerChoix("accepte");
    expect(lireChoix(Date.now() + DUREE_CHOIX_MS + 1000)).toBeNull();
  });

  it("ignore une valeur illisible", () => {
    localStorage.setItem(CLE_CHOIX, "{n'importe quoi");
    expect(lireChoix()).toBeNull();
  });
});
