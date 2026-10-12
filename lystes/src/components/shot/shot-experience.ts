// Détection de l'expérience interactive (diagnostic / essayage) à proposer
// dans la démo /shot, à partir des métadonnées produit scrappées.
//
// Scoring pondéré (et non "premier match gagne") : chaque famille accumule des
// points selon les mots-clés trouvés. Sous le seuil de confiance, ou si deux
// familles sont à égalité, on n'affiche AUCUN bouton — mieux vaut ne rien
// proposer qu'une expérience hors sujet.

export type ShotExperience =
  | { mode: "none" }
  | { mode: "diagnostic"; diagnosticType: "skin" | "hair"; label: string }
  | {
      mode: "tryon";
      productType: "eyewear" | "wig" | "clothing" | "makeup" | "shoes" | "jewelry";
      label: string;
    };

/**
 * Longueur maximale d'un libellé de call to action. Au-delà, le bouton passe sur
 * deux lignes dans la carte produit et casse la mise en page. Tout nouveau libellé
 * doit tenir dans cette limite : utiliser le libellé court « Diagnostic peau ».
 */
const MAX_CTA_LENGTH = 22;

interface Family {
  exp: Exclude<ShotExperience, { mode: "none" }>;
  /** Mots-clés forts (3 pts) : quasi-certains du secteur. */
  strong: RegExp;
  /** Mots-clés faibles (1 pt) : indices contextuels. */
  weak?: RegExp;
}

const FAMILIES: Family[] = [
  {
    exp: { mode: "tryon", productType: "wig", label: "Essayer cette perruque" },
    strong: /(perruques?|wigs?|lace ?front|closure|frontal|tissages?|extensions? capillaires?|bundles?)/gi,
    weak: /(densité|hd lace|human hair|cheveux naturels|13x4|13x6)/gi,
  },
  {
    exp: { mode: "tryon", productType: "eyewear", label: "Essayer ces lunettes" },
    strong:
      /(lunettes?|solaires?|eyewear|sunglasses|monture|optique|eyeglasses|glasses|goggles)/gi,
    weak: /(verres?|branches|uv400|polarisé|anti-?reflet|presbytie)/gi,
  },
  {
    exp: { mode: "tryon", productType: "jewelry", label: "Essayer cette montre" },
    strong: /(montres?|watch(?:es)?|chronographe|garde-?temps)/gi,
    weak: /(cadran|bracelet cuir|quartz|automatique|étanche \d|mouvement)/gi,
  },
  {
    exp: { mode: "tryon", productType: "makeup", label: "Essayer ce look" },
    strong:
      /(rouge à lèvres|lipsticks?|gloss|fond de teint|foundation|mascara|maquillage|makeup|blush|eyeliner|fard|vernis|nail ?polish|ongles?)/gi,
    weak: /(teintes?|nuances?|shade|pigment|mat|satiné)/gi,
  },
  {
    exp: { mode: "tryon", productType: "shoes", label: "Essayer ces chaussures" },
    strong:
      /(chaussures?|sneakers?|baskets?|boots?|bottines?|escarpins?|sandales?|mocassins?|shoes|derbies|running)/gi,
    weak: /(pointure|semelle|talon|lacets)/gi,
  },
  {
    exp: { mode: "tryon", productType: "jewelry", label: "Essayer ce bijou" },
    strong:
      /(bijoux?|colliers?|bagues?|bracelets?|boucles? d'oreilles?|jewel(?:le)?ry|earrings?|necklaces?|pendentifs?|chaînes?|piercing)/gi,
    weak: /(plaqué or|argent 925|carat|acier inoxydable|zircon|diamant)/gi,
  },
  {
    exp: { mode: "tryon", productType: "clothing", label: "Essayer cet accessoire" },
    strong:
      /(sacs? à main|handbags?|sacoches?|casquettes?|chapeaux?|bobs?|bonnets?|écharpes?|foulards?|ceintures?|gants?|cravates?|nœuds? papillon)/gi,
    weak: /(cuir|bandoulière|réglable|unisexe)/gi,
  },
  {
    exp: { mode: "tryon", productType: "clothing", label: "Essayer ce vêtement" },
    strong:
      /(robes?|vestes?|manteaux?|pantalons?|jeans?|chemises?|t-?shirts?|pulls?|jupes?|blouses?|hoodies?|sweat(?:shirt)?s?|dress|jacket|combinaisons?|shorts?|maillots? de bain|blazers?|doudounes?|trench)/gi,
    weak: /(taille s\b|taille m\b|taille l\b|coupe|coton|lin|doublure|oversize)/gi,
  },
  {
    exp: { mode: "diagnostic", diagnosticType: "hair", label: "Diagnostic cheveux" },
    strong:
      /(shampoings?|shampoo|après-shampoing|conditioner|masques? capillaires?|soins? capillaires?|cuir chevelu|anti-?chute|hair ?care|huile capillaire|leave-?in)/gi,
    weak: /(kératine|boucles|frisés|cheveux|pousse|pointes)/gi,
  },
  {
    exp: { mode: "diagnostic", diagnosticType: "skin", label: "Diagnostic peau" },
    strong:
      /(crèmes?|creme|sérums?|serum|soins? visage|skincare|hydratant|nettoyants?|anti-?âge|acide hyaluronique|rétinol|niacinamide|spf|solaire visage|masques? visage|contour des yeux|gommages?|lotions? visage|baume lèvres)/gi,
    weak: /(peau|épiderme|pores|imperfections|cosmétique|texture|éclat|rides|acné)/gi,
  },
];

/** Secteurs incompatibles : si détectés, on ne propose jamais d'expérience. */
const OUT_OF_SCOPE =
  /\b(ordinateur|smartphone|téléviseur|électroménager|aspirateur|imprimante|pneu|batterie|logiciel|abonnement|meuble|canapé|matelas|outillage|perceuse|vin|bière|fromage|café en grains|croquettes|litière|jouet|parfums?|eaux? de parfum|eau de toilette|brumes?|fragrances?|bougies? parfumées?|encens)\b/i;

/**
 * Faux positifs explicites : objets connectés, optique médicale non essayable,
 * et compléments ingérables (jamais un diagnostic capillaire/peau).
 */
const NEGATIVE_RULES: RegExp[] = [
  /\b(montres?|bracelets?)\s+connect[ée]e?s?\b/i,
  /\b(smartwatch(?:es)?|montres? intelligentes?|trackers? d'activité)\b/i,
  /\b(lentilles? de contact|lentilles? journali[èe]res?|contact lenses?)\b/i,
  /\b(compl[ée]ments? alimentaires?|gummies?|g[ée]lules?|comprim[ée]s?|cures? orales?|capsules?|sachets? à diluer|poudres? à boire)\b/i,
];

const MIN_SCORE = 3;

function countMatches(re: RegExp, haystack: string): number {
  // Ancrage sur des frontières de mot : évite les faux positifs par sous-chaîne
  // (ex. « élé-gante » qui matchait « gant », « lin » dans « pralin »…).
  const flags = re.flags.includes("g") ? re.flags : `${re.flags}g`;
  const rx = new RegExp(`\\b(?:${re.source})\\b`, flags);
  return (haystack.match(rx) || []).length;
}

/**
 * @param primary  Titre + catégorie produit : seule source pouvant déclencher un CTA.
 * @param context  Description, points clés, fil d'Ariane… : indices faibles uniquement.
 */
export function detectShotExperience(
  primary: string | null | undefined,
  ...context: Array<string | null | undefined>
): ShotExperience {
  const head = (primary || "").trim();
  const tail = context.filter(Boolean).join(" · ");
  const haystack = [head, tail].filter(Boolean).join(" · ");
  if (!haystack.trim()) return { mode: "none" };
  if (OUT_OF_SCOPE.test(haystack)) return { mode: "none" };
  if (NEGATIVE_RULES.some((re) => re.test(haystack))) return { mode: "none" };

  const scored = FAMILIES.map((f) => {
    // Seul le titre/catégorie porte des points forts (3 pts, plafonné à 9).
    const strong = Math.min(countMatches(f.strong, head), 3) * 3;
    // Le contexte (description, menu du site) ne compte que comme indice faible.
    const contextHint = tail ? Math.min(countMatches(f.strong, tail), 2) : 0;
    const weak = f.weak ? Math.min(countMatches(f.weak, haystack), 3) : 0;
    return { exp: f.exp, score: strong + contextHint + weak };
  }).sort((a, b) => b.score - a.score);

  const best = scored[0];
  const second = scored[1];
  if (!best || best.score < MIN_SCORE) return { mode: "none" };
  // Un CTA ne peut jamais être déclenché par le seul contexte : il faut un
  // signal fort dans le titre ou la catégorie.
  const bestFamily = FAMILIES.find((f) => JSON.stringify(f.exp) === JSON.stringify(best.exp));
  if (bestFamily && countMatches(bestFamily.strong, head) === 0) return { mode: "none" };
  // Ambiguïté réelle entre deux familles distinctes → aucun bouton plutôt qu'un faux positif.
  if (
    second &&
    second.score === best.score &&
    JSON.stringify(second.exp) !== JSON.stringify(best.exp)
  ) {
    return { mode: "none" };
  }
  return best.exp;
}

// Garde-fou : signale en développement tout libellé trop long avant qu'il n'atteigne
// la carte produit, où il passerait sur deux lignes.
if (import.meta.env?.DEV) {
  for (const f of FAMILIES) {
    if (f.exp.label.length > MAX_CTA_LENGTH) {
      console.warn(
        `[shot-experience] Libellé de CTA trop long (${f.exp.label.length}/${MAX_CTA_LENGTH}) : "${f.exp.label}"`,
      );
    }
  }
}


