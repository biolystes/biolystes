/**
 * Titres et descriptions des pages de marque.
 *
 * RÈGLE DE FOND : le nom de la marque et le mot « avis » restent dans le
 * titre, parce que c'est la requête que ces pages visent. Ce qui disparaît,
 * c'est l'affirmation chiffrée : la note, le nombre d'avis, et le mot
 * « vérifiés ».
 *
 * Pourquoi. Un titre qui annonce « 39 avis vérifiés, note moyenne 4,7/5 »
 * affirme un contrôle d'authenticité que la plateforme ne fait pas. Le mot
 * « vérifiés » est le facteur aggravant.
 *
 * Retirer le chiffre ne coûte rien en référencement : « Avis Kaniwa Botanique »
 * vise exactement la même requête que « Avis Kaniwa Botanique : note 4,7/5 ».
 * La note a sa place dans le balisage structuré, qui est l'endroit prévu pour
 * ça et que Google sait vérifier.
 */
import { deMarque } from "@lystes/lib/elision";

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

function ensureSentence(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  return /[.!?…]$/.test(clean) ? clean : `${clean}.`;
}

export function formatSeoRating(rating: number): string {
  return Number(rating || 0).toFixed(1).replace(".", ",");
}

/**
 * Choisit la forme longue si elle tient dans la limite, la forme courte sinon.
 * Une marque au nom long garde ainsi un titre entier plutôt qu'un titre coupé
 * au milieu d'un mot par des points de suspension.
 */
function titreQuiTient(longue: string, courte: string): string {
  return longue.length <= TITLE_MAX ? longue : truncate(courte, TITLE_MAX);
}

export function buildBrandLandingMeta({
  brandName,
  complexesText,
}: {
  brandName: string;
  complexesText?: string | null;
}) {
  const title = titreQuiTient(
    `${brandName} : produits, avis et diagnostic beauté`,
    `${brandName} : produits et avis`,
  );
  const description =
    `Découvrez ${brandName} sur Lystes : ses produits, leurs compositions et leurs prix, ` +
    `un diagnostic beauté personnalisé${complexesText ? ` pour ${complexesText}` : ""} et les retours clients.`;

  return { title, description: truncate(description, DESCRIPTION_MAX) };
}

export function buildBrandReviewsMeta({ brandName }: { brandName: string }) {
  const title = titreQuiTient(
    `Avis ${brandName} : produits, notes et retours`,
    `Avis ${brandName}`,
  );
  const description =
    `Avis et retours sur ${brandName} : la gamme, les compositions, les prix, ` +
    `et l'espace pour partager votre propre expérience de la marque.`;

  return { title, description: truncate(description, DESCRIPTION_MAX) };
}

export function buildBrandProductMeta({
  brandName,
  productName,
  tagline,
}: {
  brandName: string;
  productName: string;
  tagline?: string | null;
}) {
  const title = titreQuiTient(
    `${productName} : avis et composition | ${brandName}`,
    `${productName} | ${brandName}`,
  );
  const taglineSentence = tagline ? ` ${ensureSentence(tagline)}` : "";
  const description =
    `${productName} ${deMarque(brandName)}.${taglineSentence} Composition, prix, ` +
    `conseils d'usage et retours clients sur Lystes.`;

  return { title, description: truncate(description, DESCRIPTION_MAX) };
}
