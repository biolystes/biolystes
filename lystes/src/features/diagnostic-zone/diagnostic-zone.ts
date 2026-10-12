/**
 * ZONE DE DIAGNOSTIC DÉDUITE DU PRODUIT
 *
 * Constat de l'audit du 28/07/2026 : `customer-analyze-photo` sait analyser
 * **13 zones** (visage, cou, lèvres, dents, barbe, mains, pieds, corps, cils et
 * sourcils, cuir chevelu, cheveux, tatouages, cicatrices), mais les widgets
 * Shopify et WooCommerce n'en atteignent que **2**, peau et cheveux, choisies
 * une fois pour toute la boutique via `agent_type`.
 *
 * Conséquence concrète : sur une boutique de soins du corps, une crème pour le
 * cou, un baume à lèvres et une crème pour les mains déclenchent tous le même
 * diagnostic « visage ». L'analyse est alors hors sujet, et le client le voit.
 *
 * Ce module comble l'écart : à partir du texte de la fiche, il affine la zone.
 * Comme `shot-experience`, il **ne tranche pas sous le seuil** : sans signal
 * clair, il rend la zone par défaut plutôt qu'un pari.
 */

/** Zones acceptées par `customer-analyze-photo`. */
export type DiagnosticZone =
  | "skin"
  | "neck"
  | "lips"
  | "teeth"
  | "beard"
  | "hands_nails"
  | "feet"
  | "body_skin"
  | "lashes_brows"
  | "scalp"
  | "hair";

/** Score minimal pour détourner la zone par défaut. */
const MIN_SCORE = 2;

/**
 * Motifs par zone. Les termes forts valent 2 points, les indices 1.
 *
 * `specificity` départage les égalités : le cuir chevelu et les cheveux ne sont
 * pas ambigus, l'un est contenu dans l'autre. « Shampoing antipelliculaire cuir
 * chevelu » doit donc partir sur le cuir chevelu, pas se replier faute de
 * trancher. En revanche lèvres contre dents reste une vraie ambiguïté : même
 * spécificité, donc repli.
 */
const ZONE_RULES: Array<{
  zone: DiagnosticZone;
  strong: RegExp;
  weak?: RegExp;
  /** 2 = zone précise, 1 = zone englobante. */
  specificity: 1 | 2;
}> = [
  {
    zone: "neck",
    specificity: 2,
    strong: /\b(cou|nuque|decollete|neck|cervical)\b/gi,
    weak: /\b(double menton|ovale du visage|jawline)\b/gi,
  },
  {
    zone: "lips",
    specificity: 2,
    strong: /\b(levres?|lips?|baume a levres|lip balm|gloss|rouge a levres|lipstick)\b/gi,
  },
  {
    zone: "teeth",
    specificity: 2,
    strong: /\b(dents?|dentaires?|teeth|tooth|dentifrice|toothpaste|blanchiment dentaire|email dentaire)\b/gi,
  },
  {
    zone: "beard",
    specificity: 2,
    strong: /\b(barbes?|beard|moustaches?|rasage|shaving|apres-rasage|aftershave)\b/gi,
  },
  {
    zone: "hands_nails",
    specificity: 2,
    strong: /\b(mains?|ongles?|hands?|nails?|cuticules?|manucure|manicure|vernis)\b/gi,
  },
  {
    zone: "feet",
    specificity: 2,
    strong: /\b(pieds?|feet|foot|talons? (fendilles?|secs?)|pedicure|callosites?)\b/gi,
  },
  {
    zone: "lashes_brows",
    specificity: 2,
    strong: /\b(cils?|sourcils?|lashes?|brows?|eyebrows?|mascara|serum cils)\b/gi,
  },
  {
    zone: "scalp",
    specificity: 2,
    strong: /\b(cuir chevelu|scalp|pellicul\w*|antipellicul\w*|dandruff|racines? grasses?)\b/gi,
  },
  {
    zone: "hair",
    specificity: 1,
    strong: /\b(cheveux|hair|capillaires?|shampoings?|shampoo|apres-shampoing|conditioner|masque capillaire)\b/gi,
  },
  {
    zone: "body_skin",
    specificity: 1,
    strong: /\b(corps|body|jambes?|bras|dos|ventre|vergetures?|stretch marks?|lait corporel|body lotion)\b/gi,
    weak: /\b(hydratation du corps|gommage corporel)\b/gi,
  },
];

const normalize = (v: string): string =>
  v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const count = (haystack: string, pattern: RegExp): number =>
  (haystack.match(new RegExp(pattern.source, pattern.flags)) ?? []).length;

/**
 * Affine la zone de diagnostic à partir du texte de la fiche produit.
 *
 * `fallback` est la zone configurée par le marchand : on n'y touche que si un
 * signal net désigne une autre zone. Sans ça, un raffinement hasardeux serait
 * pire que le réglage global, qui a au moins le mérite d'être délibéré.
 */
export function detectDiagnosticZone(
  text: string | null | undefined,
  fallback: DiagnosticZone = "skin",
): DiagnosticZone {
  if (!text?.trim()) return fallback;
  const haystack = normalize(text);

  const scores = ZONE_RULES.map(({ zone, strong, weak, specificity }) => ({
    zone,
    specificity,
    score: count(haystack, strong) * 2 + (weak ? count(haystack, weak) : 0),
  }))
    // À score égal, la zone la plus précise passe devant la zone englobante.
    .sort((a, b) => b.score - a.score || b.specificity - a.specificity);

  const [best, second] = scores;
  if (!best || best.score < MIN_SCORE) return fallback;
  /* Égalité de score ET de spécificité : ambiguïté réelle, comme lèvres contre
     dents. On ne devine pas, on garde le réglage délibéré du marchand. */
  if (second && best.score === second.score && best.specificity === second.specificity) {
    return fallback;
  }

  return best.zone;
}

/** Libellé lisible d'une zone, pour l'interface et les messages. */
export const ZONE_LABEL: Record<DiagnosticZone, string> = {
  skin: "Peau du visage",
  neck: "Cou et décolleté",
  lips: "Lèvres",
  teeth: "Dents",
  beard: "Barbe",
  hands_nails: "Mains et ongles",
  feet: "Pieds",
  body_skin: "Peau du corps",
  lashes_brows: "Cils et sourcils",
  scalp: "Cuir chevelu",
  hair: "Cheveux",
};
