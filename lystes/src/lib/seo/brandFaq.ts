/**
 * La FAQ publique d'une marque (lystes.ai/<marque>/faq), telle qu'elle est
 * affichée. Un seul calcul, lu à deux endroits :
 *
 *  - la page `BrandFaqPage`, dans le navigateur ;
 *  - le postbuild `scripts/generate-static-meta.ts`, qui écrit le HTML servi
 *    avant tout JavaScript.
 *
 * Pourquoi le postbuild compte, mesuré le 01/10/2026 : `curl
 * https://lystes.ai/ecloseparis/faq` renvoyait le titre de l'accueil et
 * `canonical="https://lystes.ai/"`, sans une question. Les robots qui
 * n'exécutent pas le JavaScript, c'est à dire la plupart des assistants IA,
 * lisaient donc l'accueil à cette adresse. `/ecloseparis` et
 * `/ecloseparis/avis` avaient leur page écrite ; `/faq`, aucune.
 *
 * Le balisage FAQPage reprend la liste `affichees`, dans l'ordre de l'écran :
 * Google refuse des données structurées qui annoncent une question que la
 * page ne montre pas.
 */
import { canoniqueFaq, type QuestionFaq } from "../../../supabase/functions/_shared/faq-affichee";
import { descriptionFaq, schemaFaqPage, titreFaq } from "../../../supabase/functions/_shared/faq-socles";

/* Le calcul vit dans `_shared/faq-affichee.ts` depuis le 01/10/2026 : la
   fonction `faq-marque-publique` le sert à la fenêtre de l'orbital et au code
   d'intégration. Il est réexporté ici pour la page et le postbuild. */
export {
  ancreProduitFaq,
  canoniqueFaq,
  COLONNES_PRODUITS_PUBLIQUES,
  faqAffichee,
  lignesUtiles,
  ORIGINE_SITE,
  questionsDuProduit,
} from "../../../supabase/functions/_shared/faq-affichee";
export type {
  FaqAffichee,
  LigneFaq,
  QuestionFaq,
  SectionProduitFaq,
} from "../../../supabase/functions/_shared/faq-affichee";

/**
 * Le corps lisible de la version servie avant le JavaScript : ce que montre
 * l'écran, en français. Les phrases viennent du dictionnaire de l'écran
 * (`faqMarque.mentionIa`, `faqMarque.vide`), passées par l'appelant.
 *
 * Sans question, l'écran affiche sa phrase d'attente. Mesuré le 01/10/2026 :
 * 22 FAQ sur 57 sont vides, et la version servie y annonçait « Réponses
 * rédigées par IA » au-dessus de rien.
 */
export function corpsFaqStatique(e: {
  marque: string;
  affichees: QuestionFaq[];
  textes: { mentionIa: string; vide: string };
}): { intro: string; sections: Array<{ titre: string; texte: string }> } {
  if (e.affichees.length === 0) {
    return { intro: e.textes.vide.replace(/\{\{marque\}\}/g, e.marque), sections: [] };
  }
  return {
    intro: e.textes.mentionIa,
    // Les mêmes questions que l'écran, dans le même ordre, réponses comprises.
    sections: e.affichees.map((q) => ({ titre: q.question, texte: q.reponse })),
  };
}

/**
 * Les balises de tête de la version servie avant le JavaScript, en français :
 * c'est la langue des questions elles-mêmes.
 */
export function metaFaqStatique(e: { marque: string; slug: string; affichees: QuestionFaq[] }): {
  title: string;
  description: string;
  canonical: string;
  jsonLd: Record<string, unknown> | null;
} {
  return {
    title: titreFaq(e.marque),
    description: descriptionFaq(
      e.marque,
      e.affichees.map((q) => q.question),
    ),
    canonical: canoniqueFaq(e.slug),
    jsonLd: schemaFaqPage(e.affichees),
  };
}
