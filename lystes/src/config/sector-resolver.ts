/**
 * RÉSOLVEUR CANONIQUE DE SECTEUR
 *
 * Cinq sources déclarent aujourd'hui des secteurs sous des noms différents :
 * `sector-specialist-registry`, `advisorSectorConfig`, `tryOnSectorConfig`,
 * `shot-experience` et `sector-presets`. Six secteurs portent deux noms
 * (fashion/clothing, optical/eyewear, wigs/wig, skincare/skin, haircare/hair,
 * electronics/tech) et furniture/decoration/decor en porte trois.
 *
 * Plutôt qu'un renommage massif et risqué, ce module pose une couche de
 * traduction : n'importe quel alias, français ou anglais, se résout vers l'unique
 * secteur du registre des spécialistes, qui reste la source de vérité. Les
 * appelants migrent ensuite à leur rythme.
 *
 * Voir docs/CHANTIER-MATCHING-UGC-ET-ACTIONS.md pour l'audit complet.
 */

import {
  SECTOR_SPECIALIST_REGISTRY,
  type SectorSpecialistConfig,
} from "./sector-specialist-registry";

/**
 * Alias vers secteur canonique du registre.
 *
 * Ne contient que des correspondances constatées dans le code ou employées par
 * l'équipe. Un alias absent n'est pas une erreur : `resolveSector` retombe sur
 * une comparaison directe avec les clés du registre.
 */
const SECTOR_ALIASES: Record<string, string> = {
  // Divergences relevées dans le code
  clothing: "fashion",
  eyewear: "optical",
  wig: "wigs",
  skin: "skincare",
  hair: "haircare",
  tech: "electronics",
  /* `hightech` est la valeur qu'écrit la carte « High-Tech » de l'inscription
     (`onboardingData.ts`). Elle n'était résolue par rien : le secteur d'une
     boutique d'électronique était illisible partout où passe ce résolveur. */
  hightech: "electronics",
  /* `decoration` et `decor` pointent vers `furniture`, pas vers `decoration`.
     Le registre porte les deux entrées, mais celle de `decoration` s'y annonce
     « Décoration (alias) » et copie `furniture` trait pour trait : même
     `decor_tryon`, même « Designer Déco IA », même Flora, même démo. La carte
     « Deco » de l'inscription écrivait donc un secteur d'essayage qui ne
     recevait aucun essayeur de fiche : elle promettait l'essayage virtuel et
     ne livrait rien.
     ⚠️ Côté front, `resolveSectorKey` teste le registre AVANT les alias, donc
     `decoration` continue de se résoudre sur lui-même : cette entrée est
     inerte ici. Elle est écrite quand même pour que les trois copies restent
     lisibles côte à côte, et c'est `metierDeFicheDuSecteur` dans
     `sector-config.ts` qui fait le pont. Côté edge et côté SQL, où il n'y a
     pas de registre, l'alias agit vraiment. */
  decoration: "furniture",
  decor: "furniture",
  cosmetics: "skincare",
  cosmetic: "skincare",
  beauty: "skincare",
  watch: "watches",
  shoe: "shoes",
  jewellery: "jewelry",
  glasses: "optical",
  optics: "optical",

  // Libellés français employés par l'équipe
  cosmetique: "skincare",
  peau: "skincare",
  cheveux: "haircare",
  capillaire: "haircare",
  perruque: "wigs",
  perruques: "wigs",
  lunettes: "optical",
  mode: "fashion",
  vetements: "fashion",
  chaussures: "shoes",
  maquillage: "makeup",
  bijou: "jewelry",
  bijoux: "jewelry",
  montre: "watches",
  montres: "watches",
  meubles: "furniture",
  parfum: "perfume",
  parfums: "perfume",
  alimentation: "food",
  epicerie: "food",
  animaux: "pets",
  "bien-etre": "wellness",
  bienetre: "wellness",
  sante: "wellness",
  traiteur: "catering",
  nutrition: "nutrition",

  /**
   * `institut` est constaté en base sur un compte, mesuré le 12/08/2026 sur les
   * 64 comptes. Le registre nomme `services` « Services (instituts, salons) » :
   * c'est le rattachement fidèle. Il n'impose ni essayeur ni diagnostiqueur, et
   * c'est voulu, un institut vendant une prestation plutôt qu'un produit à
   * essayer. Le gain est de le faire passer de « je n'ai pas su le lire » à
   * « reconnu, sans métier » : la première ressemble à une panne, la seconde
   * est une décision.
   */
  institut: "services",
  instituts: "services",
  salon: "services",
  /* Les métiers de prestation cités par l'équipe et absents jusqu'ici : ils se
     résolvaient sur `null`, donc leur compte était traité comme une boutique
     de produits (verrou 16 en échec au 12/08/2026). */
  coiffure: "services",
  coiffeur: "services",
  barbier: "services",
  esthetique: "services",
  estheticienne: "services",
  spa: "wellness",
  massage: "wellness",
  restaurant: "catering",
  restauration: "catering",

  /**
   * La maroquinerie n'a pas encore de secteur dédié dans le registre. On la
   * rattache à la mode, dont l'essayeur est le plus proche, plutôt que de ne
   * rien proposer. À revoir quand un secteur `leather` sera ajouté, ce qui
   * suppose de synchroniser create-organization-v2.
   */
  maroquinerie: "fashion",
  leather: "fashion",
  sacs: "fashion",
};

/** Secteurs cités par l'équipe mais sans spécialiste dédié au registre. */
export const PENDING_SECTORS = ["maroquinerie"] as const;

/**
 * Normalise une saisie : minuscules, accents retirés, espaces et soulignés
 * ramenés au tiret. « Bien-Être », « bien_etre » et « BIEN ETRE » convergent.
 */
function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_]+/g, "-");
}

const BY_SECTOR = new Map<string, SectorSpecialistConfig>(
  SECTOR_SPECIALIST_REGISTRY.map((c) => [c.sector, c]),
);

/**
 * Résout n'importe quel alias vers sa clé de secteur canonique.
 * Renvoie `null` si rien ne correspond, pour laisser l'appelant décider
 * plutôt que de retomber silencieusement sur `other`.
 */
export function resolveSectorKey(input: string | null | undefined): string | null {
  if (!input) return null;
  const key = normalize(input);
  if (BY_SECTOR.has(key)) return key;

  const aliased = SECTOR_ALIASES[key];
  if (aliased && BY_SECTOR.has(aliased)) return aliased;

  // Dernier recours : la forme sans tiret, pour « bien etre » vs « bienetre ».
  const compact = key.replace(/-/g, "");
  const compactAlias = SECTOR_ALIASES[compact];
  if (compactAlias && BY_SECTOR.has(compactAlias)) return compactAlias;

  return null;
}

/** Résout un alias vers la configuration complète du spécialiste. */
export function resolveSector(input: string | null | undefined): SectorSpecialistConfig | null {
  const key = resolveSectorKey(input);
  return key ? (BY_SECTOR.get(key) ?? null) : null;
}

/**
 * Code d'action du secteur : ce que la plateforme propose au visiteur.
 * C'est `agentCategory` du registre, exposé sous un nom qui dit son usage.
 */
export function resolveActionCode(
  input: string | null | undefined,
): SectorSpecialistConfig["agentCategory"] | null {
  return resolveSector(input)?.agentCategory ?? null;
}

/** Tous les secteurs canoniques, pour alimenter un sélecteur sans le saisir à la main. */
export function listCanonicalSectors(): SectorSpecialistConfig[] {
  return SECTOR_SPECIALIST_REGISTRY;
}
