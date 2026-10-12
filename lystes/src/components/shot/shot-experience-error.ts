/**
 * Traduction des pannes du diagnostic et de l'essayage en message lisible.
 *
 * Le 01/08/2026, la modale affichait tel quel le message de supabase-js :
 * « Failed to send a request to the Edge Function ». Un prospect qui lit ça
 * part. Et quand les fonctions edge repondent 404 NOT_FOUND_FUNCTION_BLOB,
 * c'est exactement ce qu'il voit.
 *
 * Règle : jamais de jargon, toujours une marche à suivre, et jamais un faux
 * résultat pour masquer la panne.
 */

export interface ExperienceError {
  message: string;
  nextAction?: string;
}

const INDISPONIBLE: ExperienceError = {
  message: "Le service d'analyse est momentanément indisponible.",
  nextAction: "Réessayez dans quelques minutes. Si cela persiste, écrivez-nous depuis la page Aide.",
};

const RESEAU: ExperienceError = {
  message: "Nous n'avons pas réussi à joindre le service d'analyse.",
  nextAction: "Vérifiez votre connexion, puis réessayez.",
};

/** Les messages que nos propres fonctions renvoient déjà en français, à réutiliser tels quels. */
interface CorpsErreur {
  message?: string;
  next_action?: string;
  error?: string;
}

/**
 * Une erreur levée par notre propre code (« Aucun rendu généré »,
 * « Analyse indisponible ») est déjà en français et déjà juste : on la garde,
 * plutôt que de la remplacer par un message générique moins précis.
 */
function estDejaLisible(e: unknown): e is Error {
  if (!(e instanceof Error)) return false;
  const nom = e.name ?? "";
  if (nom.startsWith("Functions")) return false;
  if (e instanceof TypeError) return false;
  // Un message anglais vient forcément d'une bibliothèque, pas de nous.
  return Boolean(e.message) && !/^[A-Z][a-z]+ (to|a|the) /.test(e.message);
}

export async function describeExperienceError(e: unknown): Promise<ExperienceError> {
  const nom = e instanceof Error ? e.name : "";

  // Erreur HTTP : la réponse porte le détail, on la lit avant de conclure.
  if (nom === "FunctionsHttpError") {
    const reponse = (e as { context?: Response }).context;
    let corps: CorpsErreur = {};
    try {
      corps = (await reponse?.clone().json()) as CorpsErreur;
    } catch {
      /* corps illisible ou vide : on retombe sur le statut */
    }

    // Nos propres réponses (429 de la limite démo, 402 de crédits) sont déjà
    // rédigées en français avec leur marche à suivre : on les reprend telles
    // quelles. Mais UNIQUEMENT les nôtres. Un 404 de la plateforme Supabase
    // porte lui aussi un `message`, en anglais (« Requested function was not
    // found ») : le réutiliser remettrait sous les yeux du visiteur exactement
    // le jargon qu'on veut supprimer. La présence de `next_action` est ce qui
    // distingue nos réponses des siennes.
    if (corps.message && corps.next_action) {
      return { message: corps.message, nextAction: corps.next_action };
    }

    const statut = reponse?.status ?? 0;
    if (statut === 404) return INDISPONIBLE;
    if (statut === 429) {
      return {
        message: "Vous avez atteint le nombre d'essais offerts pour cette heure.",
        nextAction: "Réessayez un peu plus tard, ou créez un compte pour un accès sans limite.",
      };
    }
    if (statut === 402) {
      return {
        message: "Le solde de crédits est épuisé.",
        nextAction: "Rechargez depuis Tableau de bord → Crédits.",
      };
    }
    if (statut === 413) {
      return {
        message: "Votre photo est trop lourde pour être analysée.",
        nextAction: "Reprenez-la en qualité standard, ou choisissez une image plus légère.",
      };
    }
    if (statut >= 500) return INDISPONIBLE;
    return INDISPONIBLE;
  }

  // Requête jamais partie : réseau du visiteur, ou service injoignable.
  if (nom === "FunctionsFetchError" || nom === "FunctionsRelayError" || e instanceof TypeError) {
    return RESEAU;
  }

  if (estDejaLisible(e)) {
    return { message: e.message, nextAction: "Réessayez avec une autre photo." };
  }

  return INDISPONIBLE;
}
