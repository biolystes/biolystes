/* Données de livraison de Biolystes : pays, délais, préparation, frais.
   FICHIER JUMEAU, identique mot pour mot dans deux dépôts :
     - biolystes/biolystes              src/data/livraison.ts (biolystes.com/livraison)
     - biolystes/commandcenterbiolystes src/data/livraison.ts (biolystes.pro/livraison)
   Toute modification se fait dans les deux, dans la même journée : les deux
   pages doivent afficher les mêmes chiffres (JP, 14/10/2026).

   Sources :
   - pays et délais par pays : page biolystes.pro/livraison telle qu’en ligne
     le 14/10/2026 (tableaux recopiés à l’identique) ;
   - frais au poids, mode Standard, vers la France, HT : messages de
     Ferdaousse, centre d’aide du laboratoire relu le 13/10/2026 (tarifs
     depuis le 23/07/2026, facturés au poids et non à l’unité) ;
   - préparation : 2 jours ouvrés de 1 à 20 produits (Ferdaousse, centre
     d’aide du laboratoire) ; biolystes.pro disait « 1 à 10 unités »
     jusqu’au 14/10/2026, remplacé par la source la plus récente ;
   - fabrication : 2 à 3 jours ouvrés selon les matières premières
     (biolystes.pro/livraison). */

export const LIVRAISON_MISE_A_JOUR = "14 octobre 2026";

/* Préparation d’une commande, impression comprise. */
export const PREPARATION = { jours: 2, produitsMin: 1, produitsMax: 20 };

/* Fabrication, qui s’ajoute selon la disponibilité des matières premières. */
export const FABRICATION = { joursMin: 2, joursMax: 3 };

/* Mode Standard, vers la France, HT. TTC = HT × 1,2. */
export const FRAIS_STANDARD_FRANCE: { poids: string; ht: number }[] = [
  { poids: "Moins de 2 kg", ht: 7.38 },
  { poids: "De 2 à 3 kg", ht: 7.41 },
  { poids: "De 3 à 5 kg", ht: 8.93 },
];

export type GroupeDelais = {
  id: string;
  mode: "Standard" | "Express";
  titre: string;
  lignes: { jours: number; pays: string[] }[];
};

/* Délai d’expédition en jours ouvrés, par pays (biolystes.pro/livraison). */
export const DELAIS_PAR_PAYS: GroupeDelais[] = [
  {
    id: "standard-2kg",
    mode: "Standard",
    titre: "Colis jusqu’à 2 kg",
    lignes: [
      { jours: 4, pays: ["Danemark", "Autriche", "Lettonie", "Lituanie", "Estonie"] },
      { jours: 5, pays: ["Rép. tchèque", "Slovaquie", "Espagne", "Roumanie", "Pays-Bas", "Belgique", "Pologne", "Italie", "Hongrie", "Allemagne", "Suède"] },
      { jours: 6, pays: ["Bulgarie", "Croatie", "France", "Grèce", "Finlande", "Irlande"] },
      { jours: 7, pays: ["Royaume-Uni"] },
      { jours: 8, pays: ["Portugal", "Suisse"] },
      { jours: 12, pays: ["États-Unis"] },
    ],
  },
  {
    id: "standard-plus-2kg-ue",
    mode: "Standard",
    titre: "Colis de plus de 2 kg, Union européenne",
    lignes: [
      { jours: 5, pays: ["Pologne", "Hongrie", "Rép. tchèque", "Lettonie", "Lituanie", "Estonie"] },
      { jours: 5, pays: ["Danemark", "Pays-Bas", "Slovaquie", "Suède", "Belgique", "Autriche", "Croatie"] },
      { jours: 5, pays: ["Italie", "Finlande", "Irlande", "France"] },
      { jours: 6, pays: ["Allemagne", "Espagne", "Portugal", "Roumanie", "Bulgarie", "Grèce"] },
    ],
  },
  {
    id: "standard-plus-2kg-hors-ue",
    mode: "Standard",
    titre: "Colis de plus de 2 kg, hors Union européenne",
    lignes: [
      { jours: 5, pays: ["Royaume-Uni"] },
      { jours: 6, pays: ["Suisse"] },
    ],
  },
  {
    id: "express",
    mode: "Express",
    titre: "Tous les colis",
    lignes: [
      { jours: 2, pays: ["France", "Pays-Bas", "Belgique", "Rép. tchèque", "Espagne", "Royaume-Uni", "Italie", "Autriche", "Hongrie", "Irlande", "Allemagne", "Danemark", "Pologne", "Suède", "Finlande", "Lettonie", "Lituanie", "Estonie"] },
      { jours: 2, pays: ["Slovaquie", "Portugal", "Roumanie", "Bulgarie", "Grèce", "Croatie"] },
      { jours: 2, pays: ["Suisse"] },
      { jours: 3, pays: ["États-Unis"] },
    ],
  },
];

/* Les lignes d’un même délai réunies, dans l’ordre d’apparition. */
export function lignesParDelai(groupe: GroupeDelais): { jours: number; pays: string[] }[] {
  const out: { jours: number; pays: string[] }[] = [];
  for (const l of groupe.lignes) {
    const meme = out.find((o) => o.jours === l.jours);
    if (meme) meme.pays.push(...l.pays);
    else out.push({ jours: l.jours, pays: [...l.pays] });
  }
  return out;
}

/* 7.38 → « 7,38 € » ; TTC arrondi au centime. */
export function euros(n: number): string {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}
export function ttc(ht: number): number {
  return Math.round(ht * 1.2 * 100) / 100;
}
