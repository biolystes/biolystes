import { describe, it, expect } from "vitest";
import { adresseDemarrer } from "@/lib/demarrer";

describe("adresseDemarrer", () => {
  it("champ vide → /demarrer sans paramètre", () => {
    expect(adresseDemarrer("  ")).toBe("https://biolystes.pro/demarrer");
  });
  it("texte encodé", () => {
    expect(adresseDemarrer("crème & sérum")).toBe("https://biolystes.pro/demarrer?projet=cr%C3%A8me%20%26%20s%C3%A9rum");
  });
  it("300 caractères au plus", () => {
    const url = adresseDemarrer("a".repeat(400));
    expect(new URL(url).searchParams.get("projet")).toHaveLength(300);
  });
});
