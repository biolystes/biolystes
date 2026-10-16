/* Création de compte et connexion se font sur biolystes.pro, jamais sur lystes.ai. */
export const URL_INSCRIPTION = "https://biolystes.pro/inscription";
export const URL_CONNEXION = "https://biolystes.pro/connexion";

/** Adresse de compte pour un chemin d'authentification (/signup, /login, /auth?mode=signup…), ou null. */
export function adresseCompte(cible: string): string | null {
  const [chemin, requete = ""] = cible.split(/[?#]/);
  if (["/signup", "/inscription", "/register", "/auth/register", "/p/auth/register", "/auth/signup"].includes(chemin)) return URL_INSCRIPTION;
  if (["/login", "/connexion", "/auth/login", "/p/auth/login"].includes(chemin)) return URL_CONNEXION;
  if (chemin === "/auth") return /(^|&)mode=signup\b/.test(requete) ? URL_INSCRIPTION : URL_CONNEXION;
  return null;
}
