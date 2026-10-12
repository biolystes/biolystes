/**
 * La FAQ d'une marque telle qu'elle est affichée : un seul calcul pour tous
 * les cadres.
 *
 * Sorti de `src/lib/seo/brandFaq.ts` le 01/10/2026 (demande de JP : la FAQ a
 * le même contenu partout, seul le cadre change). Il est lu par :
 *  - la page lystes.ai/<marque>/faq (dans le cadre du multi-lien) ;
 *  - le postbuild `scripts/generate-static-meta.ts`, qui écrit le HTML servi
 *    avant tout JavaScript ;
 *  - la fonction `faq-marque-publique`, qui sert la même liste à la fenêtre de
 *    l'orbital et au code d'intégration posé sur le site de la marque.
 *
 * `src/lib/seo/brandFaq.ts` réexporte tout : aucun appelant ne change.
 * Ce fichier n'importe que `faq-socles.ts`, lisible par Deno et par Vite.
 *
 * LA FAQ DU PRODUIT (02/10/2026). Une section de produit réunit le socle
 * fixe tiré de sa fiche (lignes « essentiel » portant son `product_id`) et
 * sa partie dynamique (lignes « produit », écrites par
 * `preoccupations-passage.ts` quand un sujet revient dans le chat de cette
 * fiche sans être couvert). La même section est servie sur la page
 * lystes.ai/<marque>/faq et sous la fiche de la boutique
 * (`preoccupations-produit-public`, via `questionsDuProduit`) : une seule
 * liste, deux cadres. Les lignes « produit » ne remontent jamais dans « Ce
 * que nos clientes demandent le plus », qui reste la partie de la marque.
 */
import { estUnRenvoi, type ProduitFaq, socleEssentiel } from "./faq-socles.ts";

export const ORIGINE_SITE = "https://lystes.ai";

/**
 * Colonnes de `products` lisibles par un visiteur anonyme. La migration
 * 20260820190036 n'accorde à `anon` qu'une liste fermée de colonnes : en
 * demander une autre (acf_fields, is_demo, is_active) fait échouer toute la
 * requête, et la page retombait sur « vide » pour chaque visiteur non
 * connecté, moteurs de recherche compris. Le postbuild lit avec la même clé
 * anonyme, donc avec la même liste.
 */
export const COLONNES_PRODUITS_PUBLIQUES =
  "id, name, description, short_description, ingredients, category, attributes, purchase_link, woo_permalink";

/** Une ligne de `brand_faq_items`. */
export type LigneFaq = {
  id: string;
  question: string;
  reponse: string;
  theme: string | null;
  source: string | null;
  occurrences: number | null;
  rang: number | null;
  product_id?: string | null;
  /** Identifiant stable posé par les moteurs (« <produit>:utilisation », « produit:<produit>:demande:taille »). */
  cle?: string | null;
};

export type QuestionFaq = {
  cle: string;
  question: string;
  reponse: string;
  theme: string | null;
  produitId: string | null;
  occurrences: number;
  mesuree: boolean;
  repondue: boolean;
  /** La clé stable de la question (colonne `cle`, ou celle du calcul pour l'essentiel calculé ici). */
  cleDonnees: string | null;
};

export type SectionProduitFaq = { produit: ProduitFaq; questions: QuestionFaq[] };

export type FaqAffichee = {
  /** « Ce que nos clientes demandent le plus », de la plus fréquente à la moins fréquente. */
  demandes: QuestionFaq[];
  /** « L'essentiel » au complet, questions générales et questions par produit. */
  essentiel: QuestionFaq[];
  /** Les questions de l'essentiel qui ne visent aucun produit. */
  general: QuestionFaq[];
  /** Une section par produit qui a au moins une question. */
  sections: SectionProduitFaq[];
  /** Tout ce que la page montre, dans l'ordre de l'écran. */
  affichees: QuestionFaq[];
};

const SOURCES_ESSENTIEL = new Set(["essentiel", "cowork"]);
const SOURCES_DEMANDES = new Set(["preoccupation", "auto"]);
/** La partie dynamique de la FAQ d'un produit : jamais dans les demandes de la marque, toujours dans la section du produit. */
export const SOURCE_PRODUIT = "produit";

/** Ne garde que les lignes qui ont une question et une réponse. */
export function lignesUtiles(lignes: unknown[] | null | undefined): LigneFaq[] {
  return ((lignes ?? []) as LigneFaq[]).filter((l) => l && l.question && l.reponse);
}

/**
 * Les deux socles, tels que la page les affiche. Tant que `brand-faq-generator`
 * n'a pas écrit l'essentiel (inscription toute fraîche), il est calculé ici
 * depuis les fiches, avec le même code que la fonction.
 */
export function faqAffichee(e: {
  lignes: LigneFaq[];
  produits: ProduitFaq[];
  marque: string;
  slug: string;
  /**
   * La marque a-t-elle déjà un essentiel écrit ? Par défaut, lu dans
   * `lignes`. Un appelant qui ne lit qu'une partie des lignes (la fiche d'une
   * boutique) le passe, compté en base.
   */
  essentielEcrit?: boolean;
}): FaqAffichee {
  const { lignes, produits, marque, slug } = e;
  const parNom = new Map(produits.map((p) => [p.nom, p.id]));
  const depuisLigne = (l: LigneFaq, i: number): QuestionFaq => ({
    cle: l.id ?? `l${i}`,
    question: l.question,
    reponse: l.reponse,
    theme: l.theme,
    produitId: l.product_id ?? (l.theme ? parNom.get(l.theme) ?? null : null),
    occurrences: l.occurrences ?? 0,
    mesuree: l.source === "preoccupation" || l.source === SOURCE_PRODUIT,
    repondue: !estUnRenvoi(l.reponse),
    cleDonnees: l.cle ?? null,
  });

  const stockees = lignes.filter((l) => SOURCES_ESSENTIEL.has(l.source ?? ""));
  const aGenerer = e.essentielEcrit === undefined
    ? lignes.filter((l) => l.source === "essentiel").length === 0
    : !e.essentielEcrit;
  const essentiel: QuestionFaq[] = [
    ...(aGenerer
      ? socleEssentiel({ marque, slug, produits }).map((q) => ({
          cle: q.cle,
          question: q.question,
          reponse: q.reponse,
          theme: q.theme,
          produitId: q.produit_id,
          occurrences: 0,
          mesuree: false,
          repondue: q.repondue,
          cleDonnees: q.cle,
        }))
      : []),
    ...stockees.map(depuisLigne),
  ];
  const demandes = lignes
    .filter((l) => SOURCES_DEMANDES.has(l.source ?? ""))
    .map(depuisLigne)
    .sort((a, b) => b.occurrences - a.occurrences);

  /* La partie dynamique des produits : après le socle de chaque fiche, de la
     plus demandée à la moins demandée. */
  const duProduit = lignes
    .filter((l) => l.source === SOURCE_PRODUIT)
    .map(depuisLigne)
    .sort((a, b) => b.occurrences - a.occurrences);

  const general = essentiel.filter((q) => !q.produitId);
  const sections = produits
    .map((p) => ({
      produit: p,
      questions: [...essentiel.filter((q) => q.produitId === p.id), ...duProduit.filter((q) => q.produitId === p.id)],
    }))
    .filter((s) => s.questions.length > 0);
  const affichees = [...demandes, ...general, ...sections.flatMap((s) => s.questions)];

  return { demandes, essentiel, general, sections, affichees };
}

/** L'adresse canonique de la FAQ d'une marque. */
export function canoniqueFaq(slug: string): string {
  return `${ORIGINE_SITE}/${slug}/faq`;
}

/** Les questions de la section d'un produit, dans l'ordre de la page ; vide sans section. */
export function questionsDuProduit(faq: FaqAffichee, produitId: string): QuestionFaq[] {
  return faq.sections.find((s) => s.produit.id === produitId)?.questions ?? [];
}

/** L'ancre de la section d'un produit sur la page FAQ (`ancre` de BrandFaqPage, même slug que `generateProductSlug`). */
export function ancreProduitFaq(slugDuProduit: string): string {
  return `produit-${slugDuProduit}`;
}
