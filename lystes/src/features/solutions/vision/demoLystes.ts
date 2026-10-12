import type { BrandLandingResolved, BrandProductCard } from "@lystes/hooks/useBrandLanding";
import type { BrandReview, BrandReviewsAggregate } from "@lystes/hooks/useBrandReviews";
import type { BrandLinkData } from "@lystes/pages/BrandLinkPage";
import type { InfluencerData } from "@lystes/pages/InfluencerLinkPage";
import type { PagePublique } from "@lystes/pages/RdvPublicPage";
import type { ArticleMarque } from "@lystes/features/magazine/lib/api-marque";
import type { QuestionFaq } from "../../../../supabase/functions/_shared/faq-affichee";
import type { ProduitFaq } from "../../../../supabase/functions/_shared/faq-socles";

/**
 * La marque de démonstration de l'onglet « Vos outils » (12/10/2026, JP) :
 * Lystes & Partners, jamais une marque cliente. Ces données nourrissent les
 * VRAIES vues des pages publiques (VueMultiLien, VueAvisMarque,
 * VueMagazineMarque, VueFaqMarque, VuePaiement, VueContact) : rien n'est lu
 * en base, rien ne part sur le réseau, l'écran s'affiche aussitôt.
 *
 * Photos : public/demo-lystes/produits/, tirées des retouches du 11/10
 * (~/Documents/lystes_ai/photos-clients/lystes/2026-10-11-demo-produits-lystes).
 * Le coffret est un assemblage des trois flacons, sans packaging inventé.
 */

export const SLUG_DEMO = "lystes-partners";
export const MARQUE_DEMO = "Lystes & Partners";
export const LOGO_DEMO = "/demo-lystes/logo-lystes-partners.png";
const IMG = "/demo-lystes/produits";

type ProduitDemo = { id: string; slug: string; nom: string; prix: number; image: string; accroche: string };

export const PRODUITS_DEMO: ProduitDemo[] = [
  { id: "lp-huile", slug: "huile-omega-6-9", nom: "Huile corps Oméga 6-9", prix: 45, image: `${IMG}/huile-omega.jpg`,
    accroche: "Huile sèche riche en oméga 6 et 9, qui nourrit la peau sèche sans film gras." },
  { id: "lp-creme", slug: "creme-uree-10", nom: "Crème lissante 10 % urée", prix: 39, image: `${IMG}/creme-uree.jpg`,
    accroche: "Lisse les zones rugueuses et les petits grains des bras et des jambes." },
  { id: "lp-aha", slug: "concentre-aha", nom: "Concentré peeling AHA", prix: 35, image: `${IMG}/concentre-aha.jpg`,
    accroche: "Un soir sur deux, il affine le grain de peau et ravive l'éclat." },
  { id: "lp-nettoyant", slug: "nettoyant-doux", nom: "Nettoyant doux visage et corps", prix: 31, image: `${IMG}/nettoyant.jpg`,
    accroche: "Lave sans tirailler, même les peaux sensibles." },
  { id: "lp-exfoliant", slug: "exfoliant-volcanique", nom: "Exfoliant volcanique", prix: 33, image: `${IMG}/exfoliant-volcanique.jpg`,
    accroche: "Grains de roche volcanique pour lisser le corps une fois par semaine." },
  { id: "lp-coffret", slug: "coffret-rituel", nom: "Coffret rituel peau douce", prix: 99, image: `${IMG}/coffret-rituel.jpg`,
    accroche: "L'huile, la crème et le concentré, réunis pour une routine complète." },
];

const carte = (p: ProduitDemo, n: number, note: number): BrandProductCard => ({
  id: p.id,
  slug: p.slug,
  name: p.nom,
  image_url: p.image,
  tagline: p.accroche,
  rating: note,
  reviewsCount: n,
  purchaseUrl: null,
});

/** La fiche de marque, telle que useBrandLanding la rendrait. */
export const FICHE_DEMO: BrandLandingResolved = {
  accountId: "demo-lystes-partners",
  brandName: MARQUE_DEMO,
  slug: SLUG_DEMO,
  enabled: true,
  complexes: null,
  chatPlaceholder: null,
  heroProducts: PRODUITS_DEMO.slice(0, 3).map((p) => ({ image_url: p.image, name: p.nom })),
  products: PRODUITS_DEMO.map((p, i) => carte(p, [3, 2, 2, 1, 1, 0][i], [4.7, 4.5, 5, 4, 5, 0][i])),
  websiteUrl: "https://lystes.ai",
  hasServices: false,
  hasProducts: true,
};

/* ---------- Les avis ---------- */

const AVIS_BRUTS: [string, string, string | null, number, string, string, string, string | null][] = [
  // produit, auteur, ville, note, titre, texte, date ISO, réponse de la marque
  ["lp-huile", "Camille R.", "Lyon", 5, "Enfin une huile qui pénètre vite",
    "Je l'applique sur peau encore humide après la douche : en deux minutes je peux m'habiller. Mes jambes ne tiraillent plus le soir.",
    "2026-10-09T09:12:00Z", "Merci Camille ! Sur peau humide, c'est exactement le bon geste."],
  ["lp-creme", "Inès B.", "Nantes", 5, "Mes bras sont lisses en trois semaines",
    "J'avais des petits grains sur l'arrière des bras depuis des années. Avec la crème à l'urée matin et soir, la peau est nettement plus douce.",
    "2026-10-07T18:40:00Z", null],
  ["lp-aha", "Sarah M.", "Paris", 5, "Le grain de peau est plus fin",
    "Je l'utilise un soir sur deux comme conseillé. Aucune rougeur, et le teint est plus lumineux au réveil.",
    "2026-10-05T21:03:00Z", null],
  ["lp-huile", "Julie T.", "Bordeaux", 4, "Très bonne, le flacon part vite",
    "Texture parfaite et odeur discrète. J'en mets sur tout le corps, donc le flacon dure un mois environ.",
    "2026-10-02T08:25:00Z", "Merci Julie, le coffret rituel revient moins cher pour un usage corps entier."],
  ["lp-nettoyant", "Léa D.", "Lille", 4, "Doux, même sur ma peau réactive",
    "Il mousse peu mais nettoie bien, et ma peau ne tire plus après la douche.",
    "2026-09-28T19:10:00Z", null],
  ["lp-creme", "Nadia K.", "Marseille", 4, "Efficace sur les talons",
    "Je l'utilise aussi sur les pieds, les talons sont beaucoup moins rêches. Texture un peu riche le matin.",
    "2026-09-24T07:55:00Z", null],
  ["lp-exfoliant", "Marion P.", "Toulouse", 5, "Le gommage que j'attendais",
    "Grains fins mais efficaces. Une fois par semaine, puis l'huile : la peau est douce pendant des jours.",
    "2026-09-20T20:30:00Z", null],
  ["lp-huile", "Chloé V.", "Rennes", 5, "Parfaite pour la peau sèche",
    "Ma peau est très sèche l'hiver. Cette huile est la seule qui tienne jusqu'au soir sans laisser de film gras.",
    "2026-09-15T12:00:00Z", null],
  ["lp-aha", "Emma L.", "Strasbourg", 5, "Bluffant sur les marques d'imperfections",
    "Les petites marques sur mes joues s'estompent. Je mets une crème hydratante par-dessus et c'est parfait.",
    "2026-09-11T22:15:00Z", null],
];

const initiales = (n: string) => n.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("");
const dateLue = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

const AVIS: BrandReview[] = AVIS_BRUTS.map(([produit, auteur, ville, note, titre, texte, date, reponse], i) => ({
  id: `lp-avis-${i + 1}`,
  rating: note,
  title: titre,
  content: texte,
  author_name: auteur,
  initials: initiales(auteur),
  location: ville,
  verified_purchase: true,
  published_at: date,
  date_label: dateLue(date),
  product_id: produit,
  brand_reply: reponse,
  source: "lystes",
  /* Des avis de présentation : la page le dit (« Démonstration »), la légende aussi. */
  provenance: "demo",
  est_definitif: true,
}));

const moyenne = AVIS.reduce((s, a) => s + a.rating, 0) / AVIS.length;
export const AVIS_DEMO: Pick<BrandReviewsAggregate, "reviews" | "avgRating" | "totalCount" | "totalAffiche" | "distribution"> = {
  reviews: AVIS,
  avgRating: Math.round(moyenne * 10) / 10,
  totalCount: AVIS.length,
  totalAffiche: AVIS.length,
  distribution: [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    pct: Math.round((AVIS.filter((a) => a.rating === stars).length / AVIS.length) * 100),
  })),
};

/* ---------- Le multi-lien ---------- */

export const MULTI_LIEN_DEMO: BrandLinkData = {
  id: "demo-lystes-partners",
  slug: SLUG_DEMO,
  account_id: "demo-lystes-partners",
  brand_name: MARQUE_DEMO,
  logo_url: LOGO_DEMO,
  is_verified: true,
  featured_products: PRODUITS_DEMO.slice(0, 3).map((p) => ({
    id: p.id,
    name: p.nom,
    image_url: p.image,
    price: `${p.prix}€`,
    cta_label: "Acheter",
    cta_url: `/${SLUG_DEMO}`,
  })),
  featured_products_title: "",
  custom_links: [
    { label: "Voir les avis", url: `/${SLUG_DEMO}/avis` },
    { label: "Le magazine", url: `/${SLUG_DEMO}/mag` },
    { label: "Nous contacter", url: `/${SLUG_DEMO}/contact`, cle: "contact" },
    { label: "FAQ", url: `/${SLUG_DEMO}/faq`, cle: "faq" },
  ],
  featured_section: {},
  reviews: AVIS.slice(0, 3).map((a) => ({ id: a.id, name: a.author_name.split(" ")[0], rating: a.rating, text: a.content })),
  reviews_display_count: 3,
  a_une_page_avis: true,
};

export const AGENT_DIAGNOSTIC_DEMO = { id: "demo-diagnostic", agent_type: "skin_diagnostic" };

/** Le conseiller du multi-lien : une question d'une cliente, une réponse qui
 *  oriente vers un produit du catalogue. */
export const CONSEILLER_DEMO = {
  agent: { id: "demo-conseiller", name: "Alice", logo_url: LOGO_DEMO },
  /* Espace insécable avant le point d'interrogation : il ne tombe jamais
     seul en début de ligne. */
  accueil: `Bonjour, je suis Alice. Que cherchez-vous aujourd'hui\u00a0?`,
  question: "J'ai des petits grains sur les bras, que me conseillez-vous\u00a0?",
  reponse: "C'est souvent une kératose pilaire. La Crème lissante 10 % urée (39 €) lisse ces grains en trois semaines.",
};

/* ---------- La FAQ ---------- */

const q = (cle: string, question: string, reponse: string, produitId: string | null, occurrences = 0): QuestionFaq => ({
  cle,
  question,
  reponse,
  theme: null,
  produitId,
  occurrences,
  mesuree: occurrences > 0,
  repondue: true,
  cleDonnees: null,
});

export const FAQ_DEMANDES: QuestionFaq[] = [
  q("d1", "Quelle routine pour une peau sèche qui tiraille ?",
    "Le Nettoyant doux sous la douche, puis l'Huile corps Oméga 6-9 sur peau encore humide. Ajoutez la Crème lissante 10 % urée sur les zones rugueuses.", null, 14),
  q("d2", "Peut-on utiliser le concentré AHA en été ?",
    "Oui, le soir, un jour sur deux, avec une protection solaire le matin.", "lp-aha", 9),
  q("d3", "Les produits conviennent-ils pendant la grossesse ?",
    "L'huile, la crème et le nettoyant oui. Demandez l'avis de votre médecin pour le concentré AHA.", null, 6),
];
export const FAQ_GENERAL: QuestionFaq[] = [
  q("g1", "Où sont fabriqués les produits Lystes & Partners ?", "En France, dans un laboratoire certifié.", null),
  q("g2", "Quels sont les délais de livraison ?", "48 à 72 heures en France métropolitaine, offerte dès 60 €.", null),
];
const produitFaq = (p: ProduitDemo): ProduitFaq => ({ id: p.id, nom: p.nom, description_courte: p.accroche, lien: null });
export const FAQ_SECTIONS: { produit: ProduitFaq; questions: QuestionFaq[] }[] = [
  { produit: produitFaq(PRODUITS_DEMO[0]), questions: [
    q("h1", "L'Huile corps Oméga 6-9 laisse-t-elle un film gras ?", "Non, c'est une huile sèche : elle pénètre en deux minutes.", "lp-huile"),
    q("h2", "Peut-on l'utiliser sur le visage ?", "Oui, quelques gouttes le soir sur peau sèche.", "lp-huile"),
    q("h3", "Combien de temps dure un flacon ?", "Environ un mois pour le corps entier, chaque jour.", "lp-huile"),
  ] },
  { produit: produitFaq(PRODUITS_DEMO[1]), questions: [
    q("c1", "À quoi sert l'urée à 10 % ?", "Elle hydrate et lisse les zones rugueuses : bras, coudes, talons.", "lp-creme"),
    q("c2", "Matin ou soir ?", "Les deux, sur peau sèche, en massant jusqu'à pénétration.", "lp-creme"),
  ] },
  { produit: produitFaq(PRODUITS_DEMO[2]), questions: [
    q("a1", "À quelle fréquence appliquer le concentré AHA ?", "Un soir sur deux, puis chaque soir si la peau le tolère.", "lp-aha"),
    q("a2", "Picote-t-il ?", "Un léger picotement les premiers jours est normal.", "lp-aha"),
  ] },
  { produit: produitFaq(PRODUITS_DEMO[3]), questions: [
    q("n1", "Le nettoyant convient-il au visage ?", "Oui, visage et corps, même les peaux sensibles.", "lp-nettoyant"),
  ] },
  { produit: produitFaq(PRODUITS_DEMO[4]), questions: [
    q("e1", "Combien de fois par semaine exfolier ?", "Une fois, deux au plus, sur peau mouillée.", "lp-exfoliant"),
  ] },
  { produit: produitFaq(PRODUITS_DEMO[5]), questions: [
    q("r1", "Que contient le coffret rituel ?", "L'huile Oméga 6-9, la crème à l'urée et le concentré AHA.", "lp-coffret"),
  ] },
];

/** Les questions de la fenêtre du diagnostic, comme faq-marque-publique les sert. */
export const QUESTIONS_DIAG_DEMO = [...FAQ_DEMANDES, ...FAQ_SECTIONS.flatMap((s) => s.questions)]
  .slice(0, 6)
  .map((x) => ({ question: x.question, reponse: x.reponse, repondue: true }));

/* ---------- Le magazine ---------- */

const article = (id: string, slug: string, title: string, dek: string, image: string, featured = false):
  Pick<ArticleMarque, "id" | "slug" | "title" | "dek" | "excerpt" | "hero_image_url" | "hero_image_alt" | "featured"> => ({
  id, slug, title, dek, excerpt: dek, hero_image_url: image, hero_image_alt: title, featured,
});

export const ARTICLES_DEMO = [
  article("m1", "keratose-pilaire-uree", "Kératose pilaire : ce que l'urée change à la peau",
    "Ces petits grains sur les bras viennent de la kératine qui bouche l'entrée des pores. L'urée l'assouplit et retient l'eau dans la peau.",
    `${IMG}/article-creme.jpg`, true),
  article("m2", "omega-6-9-barriere-cutanee", "Oméga 6 et 9 : ce que les huiles végétales changent à la barrière cutanée",
    "La barrière cutanée est faite de cellules et de lipides. Quand les lipides manquent, l'eau s'évapore et la peau tiraille.",
    `${IMG}/article-huile.jpg`),
  article("m3", "apres-la-douche-peau-humide", "Après la douche, sur peau humide : le geste qui retient l'hydratation",
    "Les trois minutes qui suivent la douche sont celles où la peau a le plus d'eau. C'est le moment de la garder.",
    `${IMG}/avis-huile.jpg`),
];

/* ---------- Le contact ---------- */

export const CONTACT_DEMO = {
  nom: "Camille",
  email: "camille@exemple.com",
  message: "Votre huile convient-elle à une peau très sèche ?",
  reponse:
    "Oui. L'Huile corps Oméga 6-9 (45 €) est faite pour les peaux sèches : appliquée sur peau humide, elle retient l'hydratation sans film gras.",
};

/* ---------- Le lien influenceur ---------- */

/** L'influenceuse de démonstration : un personnage, jamais une personne
 *  réelle. Sa photo est une UGC générée pour la démo (createur-4, retouche
 *  du 11/10 : ~/Documents/lystes_ai/photos-clients/lystes/
 *  2026-10-11-demo-produits-lystes/sorties/), le flacon est celui de la
 *  marque. Ses produits sont ceux de Lystes & Partners. */
export const INFLUENCEUSE_DEMO: InfluencerData = {
  id: "demo-influenceuse",
  instagram_handle: "maelle.peaudouce",
  display_name: "Maëlle Rivière",
  avatar_url: "/demo-lystes/influenceuse-maelle.jpg",
  bio: "Peau sèche et sensible : mes routines testées, chaque semaine sur Instagram.",
  slug: "@maelle.peaudouce",
  accent_color: "#8DB75A",
  background_color: "#ececec",
  gradient_center: "#f3f7ec",
  gradient_mid: "#e6efd8",
  gradient_edge: "#d7e6c1",
  featured_products: PRODUITS_DEMO.slice(0, 3).map((p) => ({ id: p.id, name: p.nom, image_url: p.image, price: `${p.prix} €`, cta_url: "https://lystes.ai" })),
  featured_products_title: "Ma routine",
  primary_agent_id: "demo-diagnostic",
  primary_cta_label: "Mon diagnostic de peau",
  primary_cta_type: "diagnostic",
  primary_cta_url: null,
  promo_code: "MAELLE15",
  promo_discount: "-15 % sur votre première commande",
  custom_links: [
    { label: "Ma routine en vidéo", url: "https://lystes.ai" },
    { label: "Toute la boutique", url: "https://lystes.ai" },
  ],
  reviews: AVIS.slice(6, 8).map((a) => ({ id: a.id, name: a.author_name.split(" ")[0], rating: a.rating, text: a.content })),
  featured_section: null,
  before_image_url: null,
  after_image_url: null,
  before_after_title: null,
  account_id: "demo-lystes-partners",
};

/* ---------- La prise de rendez-vous (Booking IA) ---------- */

/** Deux usages de la même page /rdv/<slug> : l'institut (soins, diagnostic
 *  en cabine), puis l'entreprise (démonstration, conseiller). La page ne
 *  connaît que des prestations, librement nommées par le marchand. */
const organisationRdv = (nom: string) => ({
  id: "demo-rdv",
  nom,
  slug: SLUG_DEMO,
  logo: LOGO_DEMO,
  couleur: "#111111",
  fuseau: "Europe/Paris",
  devise: "€",
  adresse: null,
  telephone: null,
});
export const RDV_INSTITUT_DEMO: PagePublique = {
  organisation: organisationRdv(`${MARQUE_DEMO} · Institut`),
  prestations: [
    { id: "rdv-diag", nom: "Diagnostic de peau en cabine", description: null, prix: 25, duree: 30, categorie: "Soins" },
    { id: "rdv-visage", nom: "Soin visage éclat", description: null, prix: 65, duree: 60, categorie: "Soins" },
    { id: "rdv-corps", nom: "Gommage et modelage corps", description: null, prix: 80, duree: 75, categorie: "Soins" },
    { id: "rdv-routine", nom: "Atelier routine peau sèche", description: null, prix: 35, duree: 45, categorie: "Ateliers" },
  ],
  conseillers: [],
};
export const RDV_PRO_DEMO: PagePublique = {
  organisation: organisationRdv(`${MARQUE_DEMO} · Professionnels`),
  prestations: [
    { id: "rdv-demo", nom: "Réserver une démo de la gamme", description: null, prix: null, duree: 30, categorie: "Revendeurs" },
    { id: "rdv-conseiller", nom: "Rendez-vous avec un conseiller", description: null, prix: null, duree: 20, categorie: "Revendeurs" },
    { id: "rdv-formation", nom: "Formation de votre équipe", description: null, prix: null, duree: 60, categorie: "Revendeurs" },
    { id: "rdv-devis", nom: "Étude de votre commande", description: null, prix: null, duree: 30, categorie: "Revendeurs" },
  ],
  conseillers: [],
};
export const RDV_CLIENTES_DEMO = {
  institut: { nom: "Camille Roux", email: "camille.roux@exemple.fr" },
  pro: { nom: "Hélène Martin", email: "helene.martin@exemple.fr" },
};
