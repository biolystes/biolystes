/**
 * Écoute d'authentification, sans les faux réveils.
 *
 * Pourquoi ce fichier existe : `supabase.auth.onAuthStateChange` ne signale
 * pas seulement les connexions et déconnexions. Il émet aussi `SIGNED_IN` à
 * chaque retour d'onglet et `TOKEN_REFRESHED` toutes les heures — parfois
 * plusieurs fois par minute quand plusieurs composants sont montés. Chaque
 * écouteur du back-office relançait alors sa requête et repassait en
 * « chargement » : ce sont les micro-chargements et les fausses
 * micro-déconnexions vues à l'écran.
 *
 * Ici on ne prévient l'appelant que lorsque l'IDENTITÉ change réellement :
 * première session connue, changement d'utilisateur, ou déconnexion. Un
 * simple rafraîchissement de jeton ne réveille plus rien.
 */

import { supabase } from "@lystes/integrations/supabase/client";

export type ChangementIdentite = {
  userId: string | null;
  /** true à la toute première notification (amorçage). */
  premier: boolean;
};

export function onIdentiteChange(
  rappel: (info: ChangementIdentite) => void,
): () => void {
  let connu: string | null | undefined = undefined;

  const notifier = (userId: string | null) => {
    if (connu !== undefined && connu === userId) return; // même utilisateur : rien à refaire
    const premier = connu === undefined;
    connu = userId;
    rappel({ userId, premier });
  };

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => notifier(session?.user?.id ?? null),
  );

  // getSession() lit le jeton local : aucun aller-retour réseau au montage.
  supabase.auth.getSession()
    .then(({ data: { session } }) => notifier(session?.user?.id ?? null))
    .catch(() => notifier(null));

  return () => subscription.unsubscribe();
}

/** Utilisateur courant sans appel réseau (jeton local). */
export async function utilisateurLocal() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user ?? null;
  } catch {
    return null;
  }
}
