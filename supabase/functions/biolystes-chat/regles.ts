/* Ce que le chat de biolystes.com ne doit jamais dire (12/10/2026).
   Appliqué au prompt ET au catalogue produits.json avant l'envoi au modèle
   (index.ts). Test : src/test/prompt-chat.test.ts.

   1. Aucune allégation éclaircissante : jamais d'éclaircissement ni de
      blanchiment (ligne rouge de JP, compétence methodes-biolystes, règle 8).
      Les textes du catalogue sont réécrits vers l'éclat ou l'uniformité.
   2. Aucun lieu pour les laboratoires : « réseau de laboratoires français et
      européens » est faux. Formulation neutre : « nos laboratoires
      partenaires certifiés ISO 22716 ».
   3. Aucune statistique sans source : « 8 marques sur 10 échouent » retirée ;
      « 90 % du budget dans le stock » gardé avec sa source (étude interne
      Biolystes, biolystes.com/etudes). */

const REMPLACEMENTS: [RegExp, string][] = [
  // 1. Éclaircissement et blanchiment
  [/éclaircit et unifie/gi, "unifie"],
  [/en éclaircissant et en unifiant/gi, "en unifiant"],
  [/éclaircir l['’]apparence/gi, "atténuer l'apparence"],
  [/l['’]éclaircissement global du teint/gi, "l'illumination globale du teint"],
  [/éclaircit/gi, "illumine"],
  [/éclaircir/gi, "illuminer"],
  [/éclaircissements?/gi, "illumination"],
  [/Éclaircissantes/g, "Illuminatrices"],
  [/éclaircissantes/g, "illuminatrices"],
  [/Éclaircissante/g, "Illuminatrice"],
  [/éclaircissante/g, "illuminatrice"],
  [/Éclaircissants/g, "Illuminateurs"],
  [/éclaircissants/g, "illuminateurs"],
  [/Éclaircissant/g, "Illuminateur"],
  [/éclaircissant/g, "illuminateur"],
  [/Blanchissant naturel/g, "Pour un sourire éclatant"],
  [/blanchissante?s?|blanchiment|blanchit/gi, "éclat"],
  // 2. Laboratoires sans lieu
  [/notre réseau de laboratoires français et européens d['’]excellence/gi, "nos laboratoires partenaires certifiés ISO 22716"],
  [/Meilleurs laboratoires européens, certifiés/g, "Laboratoires partenaires certifiés ISO 22716, produits certifiés"],
  [/Labos européens qui travaillent avec des marques connues\./g, "Nos laboratoires partenaires certifiés ISO 22716."],
  [/laboratoires? (français|européens|français et européens)( d['’]excellence)?/gi, "laboratoires partenaires certifiés ISO 22716"],
  [/labos? (français|européens)/gi, "laboratoires partenaires certifiés ISO 22716"],
  // 3. Statistiques
  [/Sur dix marques de cosmétiques qui se lancent, huit échouent\. ?/g, ""],
  [/ ?\(8 marques sur 10 échouent\)/g, ""],
  [/jusqu'à 90 % de leur budget dans l'achat de stock\./g, "jusqu'à 90 % de leur budget dans l'achat de stock (étude interne Biolystes, biolystes.com/etudes)."],
];

/** Formulations interdites dans tout ce qui part au modèle. */
export const FORMULES_INTERDITES: RegExp[] = [
  /éclairci/i,
  /blanchi/i,
  /laboratoires? (français|européens)/i,
  /labos? (français|européens)/i,
  /8 marques sur 10/i,
  /huit (marques )?(sur dix )?échouent/i,
  /sur dix marques[^.]*huit/i,
];

export function nettoyerPrompt(texte: string): string {
  let t = texte;
  for (const [motif, par] of REMPLACEMENTS) t = t.replace(motif, par);
  return t;
}
