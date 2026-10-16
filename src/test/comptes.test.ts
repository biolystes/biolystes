import { describe, it, expect } from "vitest";
import { adresseCompte } from "@/lib/comptes";
import { lienLystes } from "@lystes/lib/lien-lystes";

describe("liens de compte", () => {
  it("la création de compte va vers biolystes.pro/inscription", () => {
    expect(adresseCompte("/signup")).toBe("https://biolystes.pro/inscription");
    expect(lienLystes("/auth?mode=signup").href).toBe("https://biolystes.pro/inscription");
  });
  it("la connexion va vers biolystes.pro/connexion", () => {
    expect(adresseCompte("/login")).toBe("https://biolystes.pro/connexion");
    expect(lienLystes("/p/auth/login").href).toBe("https://biolystes.pro/connexion");
    expect(lienLystes("/auth").href).toBe("https://biolystes.pro/connexion");
  });
});
