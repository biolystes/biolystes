/* Le chat de biolystes.com (ouvert par l'orbital) ne doit jamais :
   donner un prix, alléguer un éclaircissement, situer les laboratoires,
   citer une statistique sans source (12/10/2026).
   Règles : supabase/functions/biolystes-chat/regles.ts. */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { REGLE_FINALE, SYSTEM_PROMPT } from "../../supabase/functions/biolystes-chat/system-prompt.ts";
import { FORMULES_INTERDITES, nettoyerPrompt } from "../../supabase/functions/biolystes-chat/regles.ts";

const produits: Record<string, unknown>[] = JSON.parse(
  readFileSync(path.resolve(__dirname, "../../public/data/produits.json"), "utf8"),
);
/* Tout le texte du catalogue, tel que index.ts peut l'envoyer au modèle. */
const catalogue = produits.map((p) => Object.values(p).filter((v) => typeof v === "string").join("\n")).join("\n\n");
const envoye = nettoyerPrompt(SYSTEM_PROMPT + catalogue) + REGLE_FINALE;
/* La règle finale nomme ce qu'elle interdit : on la contrôle à part. */
const sansRegle = nettoyerPrompt(SYSTEM_PROMPT + catalogue);

describe("prompt du chat biolystes-chat", () => {
  it("le catalogue brut contient bien des formulations à retirer (le test sert à quelque chose)", () => {
    expect(/éclairci/i.test(catalogue)).toBe(true);
  });

  for (const motif of FORMULES_INTERDITES) {
    it(`n'envoie jamais ${motif}`, () => {
      const trouve = sansRegle.match(new RegExp(`.{0,60}${motif.source}.{0,40}`, motif.flags));
      expect(trouve?.[0] ?? null).toBeNull();
    });
  }

  it("ne situe jamais les laboratoires, et parle de laboratoires partenaires certifiés ISO 22716", () => {
    expect(envoye).toMatch(/laboratoires partenaires certifiés ISO 22716/);
    expect(sansRegle).not.toMatch(/(français|européens) d['’]excellence/i);
  });

  it("ne cite « 90 % » qu'avec sa source (étude interne, /etudes)", () => {
    const occurrences = [...sansRegle.matchAll(/\b90\s?%[^\n]{0,120}/g)].map((m) => m[0]);
    for (const o of occurrences) expect(o).toMatch(/étude interne Biolystes, biolystes\.com\/etudes/);
  });

  it("n'envoie aucun montant", () => {
    expect(sansRegle).not.toMatch(/\d\s?€|€\s?\d|\d\s?euros?\b/i);
  });

  it("finit par la règle finale", () => {
    expect(envoye.endsWith(REGLE_FINALE)).toBe(true);
    expect(REGLE_FINALE).toMatch(/éclaircissement ou de blanchiment/);
  });
});
