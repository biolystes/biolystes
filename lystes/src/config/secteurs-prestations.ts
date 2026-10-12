import { resolveSectorKey } from "@lystes/config/sector-resolver";

/**
 * Les secteurs qui vendent une PRESTATION, pas un produit.
 *
 * Décision de JP le 12/08/2026, en ouvrant le produit aux sites vitrines et aux
 * instituts : « ce n'est pas des produits, c'est des services ». Chez eux, tout
 * le vocabulaire et la moitié des écrans changent de sens.
 *
 * Ce que ça implique, et que le produit tenait pour acquis jusqu'ici :
 *
 *  - le catalogue liste des PRESTATIONS avec un prix et une durée, pas des
 *    fiches produit avec un stock et un SKU ;
 *  - l'import n'est pas un CSV de produits ni une synchronisation Shopify :
 *    c'est l'aspiration de leur site, ou de leur page Planity ou Doctolib ;
 *  - l'adresse demandée à l'inscription n'est PAS celle d'une boutique en
 *    ligne, c'est celle de leur site vitrine. Un institut n'a pas de panier ;
 *  - il n'y a rien à essayer et, chez un professionnel, rien à diagnostiquer :
 *    la conversion se joue sur la prise de rendez-vous, le formulaire de
 *    contact ou le devis ;
 *  - le tableau de bord ne doit pas compter des diagnostics ou des essayages,
 *    mais des demandes de contact et des rendez-vous.
 *
 * ⚠️ NE JAMAIS RECOPIER UNE LISTE D'ALIAS ICI.
 * Ce fichier a tenu quinze alias à la main pendant que `sector-resolver.ts` en
 * connaissait une soixantaine, alimentés par la même table que le SQL. Deux
 * listes qui divergent, c'est un institut qui voit un catalogue de produits
 * parce que son secteur était connu de l'une et pas de l'autre.
 * `resolveSectorKey` est la seule autorité : elle ramène « Institut »,
 * « bien_etre » ou « BIEN ETRE » sur leur clé canonique, et rend `null` quand
 * elle ne reconnaît rien plutôt que de retomber en silence sur `other`.
 *
 * ⚠️ ET SURTOUT : le secteur n'est qu'un REPLI.
 * Mesuré le 12/08/2026 : seuls 2 comptes sur 64 voyaient l'entrée Rendez-vous,
 * parce qu'on devinait le modèle d'affaires depuis un secteur choisi pour tout
 * autre chose. Un salon de coiffure coche « Cheveux », un institut coche
 * « Beauté » : deux secteurs de produits, deux marchands qui vendent pourtant
 * des prestations. Depuis, l'inscription pose la question franchement et la
 * réponse est stockée dans `accounts.offering_type`. Elle fait autorité ; le
 * secteur ne sert plus qu'aux comptes qui n'ont pas encore répondu.
 */

/** Réponse explicite du marchand à l'inscription. */
export type TypeDOffre = "products" | "services" | "both";

/** Clés CANONIQUES, jamais des alias. */
const SECTEURS_PRESTATIONS: readonly string[] = ["services", "wellness", "catering"];

/**
 * Un institut fait des diagnostics à ses clientes, un cabinet ou une agence
 * non. La distinction sert à masquer les diagnostics chez les seconds sans les
 * retirer aux premiers.
 */
const SECTEURS_PRESTATIONS_AVEC_DIAGNOSTIC: readonly string[] = ["wellness"];

/** Normalise la réponse stockée, qui peut venir de la base donc être n'importe quoi. */
export function normaliserTypeDOffre(valeur: string | null | undefined): TypeDOffre | null {
  const v = (valeur || "").trim().toLowerCase();
  return v === "products" || v === "services" || v === "both" ? v : null;
}

export function vendDesPrestations(
  secteur: string | null | undefined,
  typeDOffre?: string | null,
): boolean {
  /* La déclaration du marchand prime toujours sur la déduction. */
  const declare = normaliserTypeDOffre(typeDOffre);
  if (declare) return declare !== "products";

  const canonique = resolveSectorKey(secteur);
  return canonique !== null && SECTEURS_PRESTATIONS.includes(canonique);
}

/** Vrai quand le marchand vend AUSSI des produits (le cas le plus courant). */
export function vendDesProduits(
  secteur: string | null | undefined,
  typeDOffre?: string | null,
): boolean {
  const declare = normaliserTypeDOffre(typeDOffre);
  if (declare) return declare !== "services";
  return !vendDesPrestations(secteur);
}

/**
 * Vrai pour un institut ou un centre de bien-être : il vend des prestations ET
 * ses clientes peuvent passer un diagnostic qui recommande la bonne prestation.
 * C'est le cas d'usage qui intéresse le plus JP.
 *
 * Un institut qui a déclaré « prestations » sur un secteur de peau ou de
 * cheveux garde son diagnostic : c'est précisément son métier.
 */
export function prestationsAvecDiagnostic(
  secteur: string | null | undefined,
  typeDOffre?: string | null,
): boolean {
  if (!vendDesPrestations(secteur, typeDOffre)) return false;
  const canonique = resolveSectorKey(secteur);
  if (canonique === null) return false;
  return (
    SECTEURS_PRESTATIONS_AVEC_DIAGNOSTIC.includes(canonique) ||
    ["skincare", "haircare", "makeup", "wigs"].includes(canonique)
  );
}

/** Le mot juste pour ce que le marchand vend, à afficher partout. */
export function motPourLOffre(
  secteur: string | null | undefined,
  typeDOffre?: string | null,
): {
  singulier: string;
  pluriel: string;
} {
  return vendDesPrestations(secteur, typeDOffre)
    ? { singulier: "prestation", pluriel: "Prestations" }
    : { singulier: "produit", pluriel: "Produits" };
}
