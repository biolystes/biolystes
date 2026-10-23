/* Consentement aux cookies de mesure d'audience (Google Analytics 4, 23/10/2026).
   Le consentement est REFUSÉ par défaut (index.html, avant la balise Google) ;
   ce module lit, écrit et applique le choix du visiteur. Le choix est mémorisé
   six mois dans le navigateur ; index.html relit la même clé au chargement
   (avant « config »), donc toute modification de la clé ou du format se fait
   aux deux endroits. */

export type Choix = "accepte" | "refuse";

export const CLE_CHOIX = "biolystes-cookies-choix";
/* Six mois. */
export const DUREE_CHOIX_MS = 182 * 24 * 60 * 60 * 1000;

type Gtag = (...args: unknown[]) => void;

function stockage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/* Le choix mémorisé s'il existe et n'est pas expiré, sinon null. */
export function lireChoix(maintenant: number = Date.now()): Choix | null {
  const s = stockage();
  if (!s) return null;
  try {
    const brut = s.getItem(CLE_CHOIX);
    if (!brut) return null;
    const { c, t } = JSON.parse(brut) as { c?: string; t?: number };
    if ((c !== "accepte" && c !== "refuse") || typeof t !== "number" || t <= maintenant) return null;
    return c;
  } catch {
    return null;
  }
}

/* Efface les cookies de mesure (_ga, _ga_XXXX) quand le visiteur refuse après
   avoir accepté. */
function supprimerCookiesMesure() {
  const hote = location.hostname;
  const parties = hote.split(".");
  const domaines = ["", hote, "." + hote];
  if (parties.length > 2) domaines.push("." + parties.slice(-2).join("."));
  document.cookie.split(";").forEach((cookie) => {
    const nom = cookie.split("=")[0].trim();
    if (!/^_ga(_|$)/.test(nom)) return;
    domaines.forEach((d) => {
      document.cookie = `${nom}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/` + (d ? `; domain=${d}` : "");
    });
  });
}

/* Mémorise le choix et le transmet à Google (mode consentement). Seule la
   mesure d'audience peut être accordée : publicité et personnalisation restent
   refusées. */
export function enregistrerChoix(choix: Choix) {
  const s = stockage();
  try {
    s?.setItem(CLE_CHOIX, JSON.stringify({ c: choix, t: Date.now() + DUREE_CHOIX_MS }));
  } catch {
    /* navigation privée : le choix vaut pour la page ouverte seulement */
  }
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("consent", "update", { analytics_storage: choix === "accepte" ? "granted" : "denied" });
  if (choix === "refuse") supprimerCookiesMesure();
}
