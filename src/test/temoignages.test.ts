import { describe, expect, it } from "vitest";
import { TEMOIGNAGES } from "@/data/temoignages";

describe("témoignages d'anciennes clientes", () => {
  it("six témoignages, prénom + initiale, texte entre guillemets français", () => {
    expect(TEMOIGNAGES).toHaveLength(6);
    for (const t of TEMOIGNAGES) {
      expect(t.prenom).toMatch(/^\S+ [A-Z]\.$/);
      expect(t.texte.startsWith("« ")).toBe(true);
      expect(t.texte.endsWith(" »")).toBe(true);
    }
  });
  it("Amanda B. : titre donné par JP le 21/10/2026, comme les cinq autres", () => {
    expect(TEMOIGNAGES[0].prenom).toBe("Amanda B.");
    expect(TEMOIGNAGES[0].titre).toBe("Résultats visibles dès le troisième mois");
    for (const t of TEMOIGNAGES) expect(t.titre).toBeTruthy();
  });
  it("typographie : insécable avant : ; ? !, aucun tiret long, aucune apostrophe droite", () => {
    for (const t of TEMOIGNAGES) {
      const tout = (t.titre ?? "") + t.texte;
      expect(tout).not.toMatch(/[—–]/);
      expect(tout).not.toMatch(/'/);
      expect(tout).not.toMatch(/ [:;?!»]/);
    }
  });
  it("aucun chiffre de vente, aucun prix, aucun nom de marque", () => {
    for (const t of TEMOIGNAGES) expect((t.titre ?? "") + t.texte).not.toMatch(/€|%/);
  });
});

import { AVIS_AUDIO, AVIS_AUDIO_NOM, AVIS_AUDIO_PUBLIE } from "@/data/temoignages";
describe("avis audio", () => {
  it("visible : accord de la cliente confirmé par JP le 21/10/2026", () => {
    expect(AVIS_AUDIO_PUBLIE).toBe(true);
  });
  it("signé « Corinne, fondatrice de Nitou & Be », sans lien, sans tiret long", () => {
    expect(AVIS_AUDIO_NOM).toBe("Corinne, fondatrice de Nitou & Be");
    expect(AVIS_AUDIO.transcription).not.toMatch(/[—–]/);
    expect(AVIS_AUDIO.transcription).not.toMatch(/ [:;?!]/);
  });
});
