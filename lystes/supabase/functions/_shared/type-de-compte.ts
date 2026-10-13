/**
 * Le type de compte : E-commerce ou Business.
 *
 * Demande de JP du 13/10/2026 : « il doit y avoir des comptes e-commerce et
 * des comptes business, et le back-office n'est pas exactement le même pour
 * les deux ».
 *
 *  - ecommerce : une boutique en ligne (Shopify, WooCommerce, catalogue,
 *    panier). C'est le compte de toujours, et la valeur par défaut.
 *  - business  : une société sans boutique en ligne. Site vitrine, services,
 *    rendez-vous. Biolystes.com en est le premier compte.
 *
 * Le type vit dans `accounts.kind` (migration 20261013090000_type_de_compte).
 * Il ne remplace PAS `accounts.offering_type` (products, services, both), qui
 * dit ce qu'une boutique vend et sert aux instituts : un institut reste un
 * compte e-commerce qui vend des prestations.
 *
 * UNE SEULE LECTURE. Toute question « ce compte est-il Business ? » passe par
 * `typeDeCompte()`, côté navigateur comme côté fonctions. Une valeur absente,
 * inconnue ou illisible rend `ecommerce` : un compte dont la lecture rate
 * garde le back-office qu'il a toujours eu, jamais un menu amputé.
 *
 * Ce fichier n'importe rien : il est lu tel quel par les fonctions (Deno) et
 * par le navigateur (Vite), comme `adresses-marque.ts`.
 */

export type TypeDeCompte = "ecommerce" | "business";

export const TYPES_DE_COMPTE: readonly TypeDeCompte[] = ["ecommerce", "business"];

export const TYPE_PAR_DEFAUT: TypeDeCompte = "ecommerce";

/**
 * Le type d'un compte, à partir de la valeur brute de `accounts.kind` ou de
 * la ligne du compte elle-même.
 */
export function typeDeCompte(
  source: string | null | undefined | { kind?: string | null } ,
): TypeDeCompte {
  const brut = typeof source === "string" || source == null ? source : source.kind;
  if (typeof brut !== "string") return TYPE_PAR_DEFAUT;
  const v = brut.trim().toLowerCase();
  return v === "business" ? "business" : TYPE_PAR_DEFAUT;
}

export function estBusiness(source: Parameters<typeof typeDeCompte>[0]): boolean {
  return typeDeCompte(source) === "business";
}

/* ─────────────────────────────────────────────────────────────────────────
   Le widget en mode « vitrine ».

   Un compte Business n'a ni panier ni fiche produit : l'orbital y met en
   avant le rendez-vous, et le bouton « Nos dernières actus » remplace
   « Faire un diagnostic » (même choix que la démo /business, PR 355).

   `get-widget-config` renvoie ce bloc tel quel. Le widget
   (public/woo-product-chat.js) le lit : c'est le point d'entrée, et le seul
   endroit où se décide ce que l'orbital montre à un compte Business.

   Il complète aussi `behavior.barre_flottante` avec l'action « actus » quand
   le compte n'en a pas déclaré : c'est le réglage que le widget lit déjà
   pour la barre « Voir nos dernières actus » (v3.63.0). Un réglage posé par
   la marque gagne toujours.
   ───────────────────────────────────────────────────────────────────────── */

export const ORIGINE_LYSTES_AI = "https://lystes.ai";

export interface ConfigVitrine {
  /** Un compte Business n'a pas de panier. */
  panier: false;
  /** Ni cartes produit, ni recommandations de produits. */
  produits: false;
  /** Le bouton du champ de chat : les actualités, à la place du diagnostic. */
  bouton_principal: "actus";
  /** La page des actualités : le magazine de la marque sur lystes.ai. */
  actus: { libelle: string; url: string } | null;
  /** Le rendez-vous, mis en avant dans l'orbital. */
  rendez_vous: { mis_en_avant: true; slug: string | null; url: string | null };
}

export interface ReponseTypeDeCompte {
  type_de_compte: TypeDeCompte;
  /** « boutique » pour un compte e-commerce, « vitrine » pour un Business. */
  mode: "boutique" | "vitrine";
  /** `null` pour un compte e-commerce : rien ne change pour lui. */
  vitrine: ConfigVitrine | null;
}

/** Un slug sûr pour une adresse : lettres, chiffres, tirets. */
function slugSur(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const v = s.trim();
  return /^[a-z0-9][a-z0-9-]{0,80}$/i.test(v) ? v : null;
}

export function configVitrine(entree: {
  type: TypeDeCompte;
  /** Slug de la page publique de la marque (`/<slug>/mag`). */
  slugMarque?: string | null;
  /** Slug de l'organisation de rendez-vous (`/rdv/<slug>`). */
  slugRdv?: string | null;
}): ReponseTypeDeCompte {
  if (entree.type !== "business") {
    return { type_de_compte: "ecommerce", mode: "boutique", vitrine: null };
  }
  const marque = slugSur(entree.slugMarque);
  const rdv = slugSur(entree.slugRdv);
  return {
    type_de_compte: "business",
    mode: "vitrine",
    vitrine: {
      panier: false,
      produits: false,
      bouton_principal: "actus",
      actus: marque ? { libelle: "Nos dernières actus", url: `${ORIGINE_LYSTES_AI}/${marque}/mag` } : null,
      rendez_vous: {
        mis_en_avant: true,
        slug: rdv,
        url: rdv ? `${ORIGINE_LYSTES_AI}/rdv/${rdv}` : null,
      },
    },
  };
}

/**
 * Le `behavior` du widget pour ce type de compte. E-commerce : rendu tel
 * quel, au même objet. Business : la barre « actus » est posée si la marque
 * n'a rien déclaré.
 */
export function behaviorPourType<T extends Record<string, unknown>>(
  behavior: T,
  reponse: ReponseTypeDeCompte,
): T {
  if (reponse.mode !== "vitrine" || !reponse.vitrine?.actus) return behavior;
  if (behavior && behavior.barre_flottante) return behavior;
  return { ...behavior, barre_flottante: { action: "actus", lien: reponse.vitrine.actus.url } };
}
