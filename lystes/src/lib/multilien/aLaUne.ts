/**
 * Multi-lien dynamique (lot 13, 12/10/2026) : quels produits mettre à la une,
 * quels avis montrer. Logique pure, testée sans base
 * (`src/test/multilien-dynamique.test.ts`).
 */

/** Comment la page choisit ses produits quand la liste manuelle est vide. */
export type ModeALaUne = "auto" | "selection" | "meilleures_ventes" | "mieux_notes";

export const MODES_A_LA_UNE: { valeur: ModeALaUne; libelle: string; aide: string }[] = [
  {
    valeur: "auto",
    libelle: "Automatique",
    aide: "Les meilleures ventes des 30 derniers jours, puis les produits les mieux notés.",
  },
  {
    valeur: "meilleures_ventes",
    libelle: "Meilleures ventes",
    aide: "Les produits les plus vendus sur 30 jours (90 jours si les ventes sont rares).",
  },
  {
    valeur: "mieux_notes",
    libelle: "Plus appréciés",
    aide: "La meilleure note moyenne, à partir de 3 avis publiés.",
  },
  {
    valeur: "selection",
    libelle: "Sélection manuelle",
    aide: "Seulement les produits choisis ci-dessous. Liste vide : les derniers produits ajoutés.",
  },
];

export function lireMode(valeur: unknown): ModeALaUne {
  return MODES_A_LA_UNE.some((m) => m.valeur === valeur) ? (valeur as ModeALaUne) : "auto";
}

/**
 * L'ordre des sources à essayer. La liste manuelle garde toujours la
 * priorité quand elle est remplie : l'appelant ne consulte ce plan que si
 * elle est vide. Les derniers produits ajoutés ferment toujours la marche,
 * comme avant le lot 13 : une marque sans vente ni avis garde sa section.
 */
export function sourcesALaUne(mode: ModeALaUne): Array<"meilleures_ventes" | "mieux_notes" | "recents"> {
  switch (mode) {
    case "meilleures_ventes":
      return ["meilleures_ventes", "recents"];
    case "mieux_notes":
      return ["mieux_notes", "recents"];
    case "selection":
      return ["recents"];
    default:
      return ["meilleures_ventes", "mieux_notes", "recents"];
  }
}

/** Fusionne des listes d'identifiants dans l'ordre, sans doublon, jusqu'à `n`. */
export function fusionnerSansDoublon(listes: string[][], n: number): string[] {
  const sortie: string[] = [];
  for (const liste of listes) {
    for (const id of liste) {
      if (sortie.length >= n) return sortie;
      if (id && !sortie.includes(id)) sortie.push(id);
    }
  }
  return sortie;
}

export type AvisCandidat = {
  id: string;
  note: number;
  texte: string;
  titre?: string | null;
  produitId?: string | null;
  date?: string | null;
};

/**
 * Les avis « pertinents » du multi-lien : plutôt que les dix derniers, les
 * mieux notés et les plus détaillés, un par produit d'abord pour que la
 * section ne parle pas dix fois du même flacon, puis les suivants.
 *
 * Score : la note d'abord (un 5 passe devant un 4), puis la longueur utile du
 * texte, plafonnée à 400 caractères pour qu'un roman ne batte pas tout, puis
 * la date. Un texte de moins de 20 caractères (« Top ! ») passe en dernier.
 */
export function choisirAvisPertinents<T extends AvisCandidat>(avis: T[], n: number): T[] {
  const longueur = (a: AvisCandidat) => Math.min(400, `${a.titre ?? ""} ${a.texte ?? ""}`.replace(/\s+/g, " ").trim().length);
  const tries = [...avis]
    .filter((a) => (a.texte ?? "").trim().length > 0)
    .sort((a, b) => {
      const courtA = longueur(a) < 20 ? 1 : 0;
      const courtB = longueur(b) < 20 ? 1 : 0;
      if (courtA !== courtB) return courtA - courtB;
      if (b.note !== a.note) return b.note - a.note;
      const l = longueur(b) - longueur(a);
      if (l !== 0) return l;
      return String(b.date ?? "").localeCompare(String(a.date ?? ""));
    });
  const premiers: T[] = [];
  const suite: T[] = [];
  const produitsVus = new Set<string>();
  for (const a of tries) {
    const cle = a.produitId ?? `sans-produit:${a.id}`;
    if (a.produitId && produitsVus.has(cle)) {
      suite.push(a);
      continue;
    }
    produitsVus.add(cle);
    premiers.push(a);
  }
  return [...premiers, ...suite].slice(0, n);
}
