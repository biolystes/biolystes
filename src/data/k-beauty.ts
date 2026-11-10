/* Catégorie « Inspiré K-beauty » (10/11/2026) : liste unique, dans l'ordre du rituel.
   Les produits restent aussi dans leur catégorie d'origine. Tous les codes ont été
   trouvés dans src/data/catalogue-pro/products.ts (aucun manquant). */
export const ID_K_BEAUTY = "k-beauty";
export const LIBELLE_K_BEAUTY = "Inspiré K-beauty";
export const INTRO_K_BEAUTY =
  "Le rituel inspiré de la K-beauty : double nettoyage, couches d'hydratation légères, soin de la barrière cutanée et protection solaire, avec nos soins européens.";

export const RITUEL_K_BEAUTY: readonly { code: string; etape: string }[] = [
  { code: "A5924", etape: "Double nettoyage, l'huile" },
  { code: "A5852", etape: "Double nettoyage, la mousse" },
  { code: "A5805", etape: "Tonique et essence" },
  { code: "A5932", etape: "Tonique et essence" },
  { code: "S0119", etape: "Sérums" },
  { code: "A5926", etape: "Sérums" },
  { code: "A5861", etape: "Sérums" },
  { code: "A5848", etape: "Sérums" },
  { code: "S0132", etape: "Sérums" },
  { code: "S0137-7", etape: "Yeux et lèvres" },
  { code: "S0138-7", etape: "Yeux et lèvres" },
  { code: "A5837", etape: "Crème" },
  { code: "A5923", etape: "Crème" },
  { code: "S0016", etape: "Protection solaire" },
];

const RANG = new Map(RITUEL_K_BEAUTY.map((x, i) => [x.code, i]));
export const estKBeauty = (code?: string) => !!code && RANG.has(code);
export const rangKBeauty = (code?: string) => (code && RANG.has(code) ? RANG.get(code)! : Infinity);
