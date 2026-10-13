import { LYSTES_ENV } from "@lystes/integrations/supabase/env";
import { useEffect, useState } from "react";

/**
 * LA DURÉE DE L'ESSAI, DITE PAR LA CAISSE ELLE-MÊME.
 *
 * Décision de JP du 25/08/2026, CGV alignées le 26/09 (PR 171) : sept jours
 * d'essai gratuits, carte demandée à l'inscription, premier prélèvement à la
 * fin de l'essai. La durée vit dans le secret `ESSAI_JOURS`, lu par
 * `checkout-create` à chaque paiement, et la même fonction la rend en lecture
 * publique (GET, `{ "essai_jours": 7 }`).
 *
 * L'accueil et /tarifs l'annoncent désormais, mais ils la DEMANDENT au lieu de
 * l'écrire : le jour où JP met l'essai à zéro, aucune page ne doit continuer
 * de promettre « 7 jours » pendant que Stripe prélève à l'inscription. C'est
 * le mécanisme que `StepOffer` utilise déjà depuis le 26/08.
 *
 * Une seule lecture par chargement de page, partagée par tous les écrans qui
 * l'affichent (bouton du haut, bas de page, tarifs). Repli à 7 si la caisse ne
 * répond pas : c'est la valeur en vigueur, et un réseau lent ne doit pas
 * transformer l'offre.
 *
 * Corrigé le 27/09/2026 (audit du jour, point 19) : la lecture partait par un
 * `fetch` nu. `checkout-create` garde la vérification du jeton par défaut
 * (verify_jwt), donc la passerelle répondait 401 avant même la fonction, et
 * chaque page affichait le repli quoi que dise le secret. La lecture porte
 * désormais la clé publique du projet, qui passe cette vérification sans
 * session : l'accueil et /tarifs sont vus par des visiteuses non connectées.
 * C'est la même clé que tout le site embarque déjà ; rien de secret.
 */
export const ESSAI_JOURS_REPLI = 7;

let lecture: Promise<number> | null = null;

/** Les en-têtes que la passerelle des fonctions exige, sans session. */
function entetesPublics(): Record<string, string> {
  const cle = LYSTES_ENV.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
  return cle ? { apikey: cle, Authorization: `Bearer ${cle}` } : {};
}

function lireEssaiJours(): Promise<number> {
  if (lecture) return lecture;
  const base = LYSTES_ENV.VITE_SUPABASE_URL as string | undefined;
  if (!base || typeof fetch !== "function") return Promise.resolve(ESSAI_JOURS_REPLI);
  lecture = fetch(`${base}/functions/v1/checkout-create`, { method: "GET", headers: entetesPublics() })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const n = Number(d?.essai_jours);
      return Number.isFinite(n) && n >= 0 ? Math.floor(n) : ESSAI_JOURS_REPLI;
    })
    .catch(() => ESSAI_JOURS_REPLI);
  return lecture;
}

/** Nombre de jours d'essai réellement accordés par la caisse. 0 = aucun essai. */
export function useEssaiJours(): number {
  const [jours, setJours] = useState(ESSAI_JOURS_REPLI);
  useEffect(() => {
    let vivant = true;
    void lireEssaiJours().then((n) => {
      if (vivant) setJours(n);
    });
    return () => {
      vivant = false;
    };
  }, []);
  return jours;
}
