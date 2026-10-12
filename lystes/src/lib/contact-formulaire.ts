/**
 * Les règles du formulaire de contact, côté navigateur.
 *
 * Elles recopient celles de `brand-contact-message` (contrat du 30/09/2026) :
 * le serveur reste juge, mais une cliente qui oublie son e-mail doit le savoir
 * avant l'envoi, pas après un aller-retour.
 */

export interface FormulaireContact {
  nom: string;
  email: string;
  telephone: string;
  numero_commande: string;
  message: string;
}

export type ChampContact = keyof FormulaireContact;

const CHAMPS: ChampContact[] = ["nom", "email", "telephone", "numero_commande", "message"];

export const EMAIL_VALIDE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEPHONE_VALIDE = /^[0-9 +().-]*$/;
const NUMERO_VALIDE = /^[A-Za-z0-9_/-]*$/;

/** Les champs refusés, dans l'ordre du formulaire. Vide = envoi possible. */
export function validerContact(f: FormulaireContact): ChampContact[] {
  const refuses: ChampContact[] = [];
  const nom = f.nom.trim();
  if (nom.length < 1 || nom.length > 200) refuses.push("nom");
  const email = f.email.trim().replace(/\s+/g, "");
  if (!email || email.length > 200 || !EMAIL_VALIDE.test(email)) refuses.push("email");
  const tel = f.telephone.trim();
  if (tel.length > 40 || !TELEPHONE_VALIDE.test(tel)) refuses.push("telephone");
  const numero = f.numero_commande.trim().replace(/^#/, "");
  if (numero.length > 40 || !NUMERO_VALIDE.test(numero)) refuses.push("numero_commande");
  const message = f.message.trim();
  if (message.length < 1 || message.length > 5000) refuses.push("message");
  return refuses;
}

/**
 * L'adresse de la page hôte transmise par l'iframe (`?origine=`). Seule une
 * adresse http(s) de 500 caractères au plus passe, sans requête ni ancre :
 * elle ne doit porter aucune donnée personnelle.
 */
export function normaliserOrigine(brute: string | null | undefined): string | null {
  if (!brute) return null;
  try {
    const u = new URL(brute);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    const propre = `${u.origin}${u.pathname}`;
    return propre.length <= 500 ? propre : null;
  } catch {
    return null;
  }
}

export interface ErreurContact {
  code: string | null;
  champs: ChampContact[];
  retryAfter: number | null;
}

/**
 * Lit le corps d'une erreur de `supabase.functions.invoke`. Sur une réponse
 * non 2xx, supabase-js range la `Response` dans `error.context` : c'est là que
 * se trouvent `error`, `champs` et `retry_after`.
 */
export async function lireErreurContact(err: unknown): Promise<ErreurContact> {
  const vide: ErreurContact = { code: null, champs: [], retryAfter: null };
  const contexte = (err as { context?: unknown } | null)?.context;
  if (!contexte || typeof (contexte as Response).json !== "function") return vide;
  try {
    const reponse = contexte as Response;
    const corps = (await (typeof reponse.clone === "function" ? reponse.clone() : reponse).json()) as {
      error?: unknown;
      champs?: unknown;
      retry_after?: unknown;
    };
    const champs = Array.isArray(corps.champs)
      ? corps.champs.filter((c): c is ChampContact => typeof c === "string" && (CHAMPS as string[]).includes(c))
      : [];
    return {
      code: typeof corps.error === "string" ? corps.error : null,
      champs,
      retryAfter: typeof corps.retry_after === "number" && corps.retry_after > 0 ? corps.retry_after : null,
    };
  } catch {
    return vide;
  }
}
