/**
 * CE QUE CHAQUE ÉQUIPE VA CHERCHER DANS LES CONVERSATIONS.
 *
 * 10/09/2026 (JP) : « les insights clients (préoccupations) par type
 * d'expert ». Les tables d'insights ne portent PAS de colonne métier — le
 * rattachement honnête passe par la fiche produit : on ne montre à une équipe
 * que les préoccupations relevées sur les fiches où elle est postée
 * (`product_experts.metier`).
 *
 * L'angle ci-dessous ne filtre rien, il ÉCLAIRE : il dit à l'équipe ce qu'elle
 * est censée faire de ces préoccupations. Aucun chiffre n'en dépend.
 */
export interface AngleMetier {
  /** Le mot que l'équipe emploie pour ses interlocutrices. */
  angle: string;
  /** Ce que l'équipe doit faire des freins relevés. */
  consigne: string;
}

export const ANGLES_METIERS: Record<string, AngleMetier> = {
  conseil: {
    angle: "Ce qui bloque avant l'achat",
    consigne:
      "Chaque objection non levée sur la fiche est une vente perdue : donnez la réponse dans la fiche, pas seulement dans la conversation.",
  },
  diagnostic: {
    angle: "Ce que la cliente n'arrive pas à évaluer seule",
    consigne:
      "Une préoccupation qui revient sans réponse claire est un diagnostic à proposer plus tôt dans le parcours.",
  },
  essayage: {
    angle: "Le doute sur le rendu",
    consigne:
      "Tout ce qui touche à l'aspect, la taille ou la couleur se règle par un essayage : proposez-le sur ces fiches en priorité.",
  },
  avis: {
    angle: "Ce que les clientes voudraient lire avant d'acheter",
    consigne:
      "Sollicitez un avis sur les points qui reviennent : un avis qui répond à l'objection vaut mieux qu'un argument de marque.",
  },
  seo: {
    angle: "Les mots que tapent les clientes",
    consigne:
      "Les questions posées sont des requêtes : reprenez-les mot pour mot dans le titre, la description et la FAQ de la fiche.",
  },
  geo: {
    angle: "Les questions posées aux IA",
    consigne:
      "Une IA cite ce qu'elle peut vérifier : transformez chaque question récurrente en réponse courte, datée et sourcée sur la fiche.",
  },
  pays: {
    angle: "Ce qui change d'un marché à l'autre",
    consigne:
      "Une préoccupation qui ne revient que dans un pays se traite dans la langue et les usages de ce pays, pas par une traduction.",
  },
  apres_achat: {
    angle: "Ce qui se passe après la livraison",
    consigne:
      "Les préoccupations d'usage sont votre feuille de route de suivi : un message au bon moment évite un retour.",
  },
};

export function angleDe(metier: string): AngleMetier {
  return (
    ANGLES_METIERS[metier] ?? {
      angle: "Ce que disent vos clientes",
      consigne: "Reprenez ces points là où la cliente se pose la question.",
    }
  );
}

/* Les formes réellement rencontrées en base (relevé du 10/09/2026 sur
   `product_conversation_insights`) : chaque entrée porte un libellé, un
   compteur, parfois une gravité, une intention et des extraits. */
export interface EntreeInsight {
  libelle: string;
  compte: number;
  severite?: string | null;
  intention?: string | null;
  produits: string[];
  extraits: string[];
}

export function lireEntrees(
  brut: unknown,
  champs: string[],
  produitParDefaut: string | null,
): EntreeInsight[] {
  if (!Array.isArray(brut)) return [];
  const sorties: EntreeInsight[] = [];
  for (const item of brut) {
    if (!item || typeof item !== "object") continue;
    const objet = item as Record<string, unknown>;
    let libelle: string | null = null;
    for (const champ of champs) {
      const valeur = objet[champ];
      if (typeof valeur === "string" && valeur.trim()) {
        libelle = valeur.trim();
        break;
      }
    }
    if (!libelle) continue;
    const produits = Array.isArray(objet.products)
      ? (objet.products.filter((p) => typeof p === "string") as string[])
      : produitParDefaut
        ? [produitParDefaut]
        : [];
    const extraits = Array.isArray(objet.samples)
      ? (objet.samples.filter((s) => typeof s === "string") as string[])
      : [];
    sorties.push({
      libelle,
      compte: typeof objet.count === "number" ? objet.count : 1,
      severite: typeof objet.severity === "string" ? objet.severity : null,
      intention: typeof objet.intent === "string" ? objet.intent : null,
      produits,
      extraits,
    });
  }
  return sorties;
}

/** Regroupe les entrées identiques et additionne leurs compteurs. */
export function fusionner(entrees: EntreeInsight[]): EntreeInsight[] {
  const parCle = new Map<string, EntreeInsight>();
  for (const e of entrees) {
    const cle = e.libelle.toLowerCase();
    const existante = parCle.get(cle);
    if (!existante) {
      parCle.set(cle, { ...e, produits: [...e.produits], extraits: [...e.extraits] });
      continue;
    }
    existante.compte += e.compte;
    for (const p of e.produits) if (!existante.produits.includes(p)) existante.produits.push(p);
    for (const s of e.extraits) if (!existante.extraits.includes(s)) existante.extraits.push(s);
    if (!existante.severite && e.severite) existante.severite = e.severite;
    if (!existante.intention && e.intention) existante.intention = e.intention;
  }
  return [...parCle.values()].sort((a, b) => b.compte - a.compte);
}

/* ─────────────────────────────────────────────────────────────────────────
   RATTACHER UNE ANALYSE À UNE ÉQUIPE (relevé du 10/09/2026).

   `product_conversation_insights.product_id` est VIDE sur les 385 analyses de
   la boutique : seules `product_woo_id` et `product_name` sont renseignées.
   Filtrer sur l'identifiant interne seul ne retenait donc aucune ligne, et
   les pages s'affichaient à zéro alors que la donnée existe.

   On rattache donc par trois clés, dans cet ordre : identifiant interne,
   identifiant boutique, puis nom exact. Aucun rapprochement approximatif :
   un nom qui ne colle pas reste dehors plutôt que d'attribuer les
   préoccupations d'une fiche à une autre.
   ───────────────────────────────────────────────────────────────────────── */
export interface FichesEquipe {
  ids: Set<string>;
  woo: Set<string>;
  noms: Set<string>;
}

export function analyseRetenue(
  analyse: { product_id?: string | null; product_woo_id?: string | null; product_name?: string | null },
  fiches: FichesEquipe,
): boolean {
  if (analyse.product_id && fiches.ids.has(analyse.product_id)) return true;
  if (analyse.product_woo_id && fiches.woo.has(String(analyse.product_woo_id))) return true;
  if (analyse.product_name && fiches.noms.has(analyse.product_name.trim().toLowerCase())) return true;
  return false;
}
