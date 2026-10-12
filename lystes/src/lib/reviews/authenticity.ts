/**
 * Provenance des avis — règle du 20/08/2026, révisée le même jour.
 *
 * TOUT AVIS PUBLIÉ COMPTE. La note moyenne, la répartition, le balisage
 * structuré et le widget public reposent sur l'ensemble des avis actifs et
 * publiés, sans distinction d'origine. La modération décide de ce qui est
 * publié ; une fois publié, un avis est un vrai avis.
 *
 * `provenance` reste renseignée et modifiable depuis le back-office, mais
 * comme information de traçabilité : elle n'écarte plus rien. C'est pourquoi
 * `PROVENANCES_DEFINITIVES` liste toutes les valeurs et `estAvisDefinitif`
 * répond toujours `true`. Ne rétrécissez pas cette liste sans une demande
 * explicite : la restreindre a déjà fait disparaître 8 786 avis d'un coup des
 * notes publiques.
 *
 * JUMEAU : `supabase/functions/_shared/reviews-authenticity.ts`. Les deux
 * fichiers disent la même chose et se modifient ENSEMBLE.
 */

export const PROVENANCES = [
  "client_verifie",
  "client_declare",
  "import_externe",
  "catalogue",
  "non_renseignee",
  "demo",
] as const;

export type Provenance = (typeof PROVENANCES)[number];

/** Toutes les provenances comptent. Volontaire : voir l'en-tête du fichier. */
export const PROVENANCES_DEFINITIVES: readonly Provenance[] = PROVENANCES;

/** Libellés du back-office, et ce que chaque valeur engage. */
export const LIBELLES_PROVENANCE: Record<Provenance, { titre: string; aide: string }> = {
  client_verifie: {
    titre: "Client vérifié",
    aide: "Une commande ou un compte client est rattaché à cet avis.",
  },
  client_declare: {
    titre: "Client déclaré",
    aide: "Déposé sur le site public, sans commande rattachée.",
  },
  import_externe: {
    titre: "Import externe",
    aide: "Repris d'une plateforme tierce (Trustpilot, Google, WooCommerce…).",
  },
  catalogue: {
    titre: "Catalogue de la marque",
    aide: "Écrit à l'initiative de la marque. Compte dans la note comme tout avis publié.",
  },
  non_renseignee: {
    titre: "À qualifier",
    aide: "Origine non documentée. Compte dans la note ; à qualifier pour la traçabilité.",
  },
  demo: {
    titre: "Démonstration",
    aide: "Avis fictif de présentation, affiché avec la mention « Démonstration ».",
  },
};

/**
 * Filtre PostgREST passé à `.or(...)`. Il accepte toute provenance connue ET
 * les lignes où la colonne est vide, pour qu'aucun avis publié ne soit perdu
 * au motif qu'il précède l'existence du champ.
 */
export const FILTRE_AVIS_DEFINITIFS = `provenance.in.(${PROVENANCES.join(",")}),provenance.is.null`;

/** La règle, côté front : un avis publié est un vrai avis. */
export function estAvisDefinitif(_provenance?: string | null): boolean {
  return true;
}

/** Normalise une valeur lue en base vers une provenance connue. */
export function versProvenance(valeur: string | null | undefined): Provenance {
  return PROVENANCES.includes(valeur as Provenance) ? (valeur as Provenance) : "non_renseignee";
}
