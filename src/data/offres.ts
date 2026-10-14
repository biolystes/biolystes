/* Les montants des offres de Biolystes, TTC, en un seul endroit : la page
   /tarifs les affiche, src/test/garde-alignement-offres.test.ts les compare
   à la référence.

   Référence : compétence tarifs-biolystes (« Tous les packs », « Décisions
   de JP du 14/10/2026 (soir) ») et src/data/packs.ts de biolystes.pro (dépôt
   commandcenterbiolystes). Un montant change là-bas : le changer ici ET
   dans le test, jamais seulement dans le test.

   « Payer en une fois » : acompte, tranche(s), solde ; l'abonnement est
   payant en plus et démarre une fois le solde réglé, site livré (Standard
   compris : jamais « abonnement inclus » à l'achat).
   « Payer sur plusieurs mois » (Standard et IA seulement) : sélection
   offerte, acompte à la validation de la sélection, reste de la mise en
   place (acompte déduit) à la livraison du site, puis la mensualité, qui
   comprend l'abonnement. Le site est à la cliente une fois le total réglé. */

export type PackAchat = {
  cle: "design" | "solo" | "duo" | "standard" | "ia";
  prix: number;
  acompte: number;
  /* À la réception des produits, seulement s'ils plaisent. */
  aReception: number;
  /* À la livraison du site (null : pas de troisième temps). */
  aLivraisonSite: number | null;
  abonnement: number;
};

export const PACKS_ACHAT: PackAchat[] = [
  { cle: "design", prix: 599, acompte: 199, aReception: 400, aLivraisonSite: null, abonnement: 39 },
  { cle: "solo", prix: 499, acompte: 199, aReception: 300, aLivraisonSite: null, abonnement: 49 },
  { cle: "duo", prix: 999, acompte: 199, aReception: 301, aLivraisonSite: 499, abonnement: 79 },
  { cle: "standard", prix: 1499, acompte: 199, aReception: 551, aLivraisonSite: 749, abonnement: 99 },
  { cle: "ia", prix: 2999, acompte: 299, aReception: 1201, aLivraisonSite: 1499, abonnement: 99 },
];

export type PackPlusieursMois = {
  cle: "standard" | "ia";
  acompte: number;
  miseEnPlace: number;
  /* Mise en place moins l'acompte, payé à la livraison du site. */
  resteMiseEnPlace: number;
  /* Minimum : la cliente peut verser plus ou solder à tout moment. */
  mensualiteMin: number;
  /* Total à régler pour que le site soit à elle. */
  total: number;
  abonnementInclus: true;
};

export const PACKS_PLUSIEURS_MOIS: PackPlusieursMois[] = [
  { cle: "standard", acompte: 199, miseEnPlace: 499, resteMiseEnPlace: 300, mensualiteMin: 199, total: 1499, abonnementInclus: true },
  { cle: "ia", acompte: 299, miseEnPlace: 599, resteMiseEnPlace: 300, mensualiteMin: 199, total: 2999, abonnementInclus: true },
];

/* Produit en plus du nombre prévu par le pack : paiement unique. */
export const PRODUIT_EN_PLUS = 39;

/* Ce que dit la page sous l'abonnement des packs achetés. */
export const ABONNEMENT_DEMARRE_SITE = "Démarre à la livraison du site, une fois le solde réglé.";

export const packAchat = (cle: PackAchat["cle"]) => PACKS_ACHAT.find((p) => p.cle === cle)!;
export const packPlusieursMois = (cle: PackPlusieursMois["cle"]) => PACKS_PLUSIEURS_MOIS.find((p) => p.cle === cle)!;
