import type { BrandLandingResolved } from "@lystes/hooks/useBrandLanding";
import type { BrandReview, BrandReviewsAggregate } from "@lystes/hooks/useBrandReviews";
import type { BrandLinkData } from "@lystes/pages/BrandLinkPage";
import type { PagePublique } from "@lystes/pages/RdvPublicPage";
import type { ArticleMarque } from "@lystes/features/magazine/lib/api-marque";
import type { QuestionFaq } from "../../../../supabase/functions/_shared/faq-affichee";

/**
 * L'entreprise de démonstration de la version « Entreprises » des étages
 * (/business, 12/10/2026, JP) : Brévan Architectes, un cabinet d'architectes
 * INVENTÉ (aucune vraie marque, aucun vrai cabinet : recherche du 12/10, aucun
 * cabinet de ce nom). Un site vitrine : services, références, équipe,
 * contact. Ni panier, ni prix, ni fiche produit, ni code promo.
 *
 * Ces données nourrissent les VRAIES vues des pages publiques de « Vos
 * outils » (VueMultiLien, VueAvisMarque, VueMagazineMarque, VueFaqMarque,
 * VueContact, VueRdv) et le site vitrine de « Votre site web »
 * (VisiteSiteVitrine). Rien n'est lu en base, rien ne part sur le réseau.
 *
 * Photos : public/demo-corporate/, générées le 12/10/2026
 * (~/Documents/lystes_ai/photos-clients/lystes/2026-10-12-corporate/).
 * Chaque photo ne sert qu'une fois par onglet, et jamais sur deux onglets
 * à la fois : le site vitrine a les siennes (hero, projets), les outils les
 * leurs (services, articles).
 */

export const SLUG_CORPO = "brevan-architectes";
export const MARQUE_CORPO = "Brévan Architectes";
export const LOGO_CORPO = "/demo-corporate/logo-brevan.svg";
const IMG = "/demo-corporate";

/* Le site vitrine (onglet « Votre site web »). */
export const PHOTOS_SITE = {
  hero: `${IMG}/hero.webp`,
  projets: [
    { src: `${IMG}/projet-1.webp`, titre: "Siège d’un groupe de conseil", lieu: "Lyon 7e" },
    { src: `${IMG}/projet-2.webp`, titre: "Hall et escalier d’un siège social", lieu: "Boulogne-Billancourt" },
    { src: `${IMG}/projet-3.webp`, titre: "Étage de direction, immeuble haussmannien", lieu: "Paris 8e" },
  ],
};

/* Les services du cabinet (onglet « Vos outils »). */
export type ServiceCorpo = { id: string; slug: string; nom: string; image: string; accroche: string };
export const SERVICES_CORPO: ServiceCorpo[] = [
  { id: "bv-bureaux", slug: "bureaux-et-sieges", nom: "Bureaux et sièges sociaux", image: `${IMG}/service-bureaux.webp`,
    accroche: "Programmation, conception et suivi de chantier de vos espaces de travail." },
  { id: "bv-rehab", slug: "rehabilitation", nom: "Réhabilitation d’immeubles", image: `${IMG}/service-rehabilitation.webp`,
    accroche: "Restructurer un bâtiment existant, l’agrandir, le remettre aux normes." },
  { id: "bv-interieur", slug: "architecture-interieure", nom: "Architecture intérieure", image: `${IMG}/service-interieur.webp`,
    accroche: "Matières, mobilier et lumière, dessinés pour vos équipes et vos visiteurs." },
];

/** La fiche de l'entreprise, telle que useBrandLanding la rendrait. Aucun
 *  produit : la page d'avis ne montre donc ni carrousel ni « Produits ». */
export const FICHE_CORPO: BrandLandingResolved = {
  accountId: "demo-brevan-architectes",
  brandName: MARQUE_CORPO,
  slug: SLUG_CORPO,
  enabled: true,
  complexes: null,
  chatPlaceholder: null,
  heroProducts: SERVICES_CORPO.map((s) => ({ image_url: s.image, name: s.nom })),
  products: [],
  websiteUrl: "https://lystes.ai",
  hasServices: true,
  hasProducts: false,
};

/* ---------- Les avis clients de l'entreprise ---------- */

const AVIS_BRUTS: [string, string, number, string, string, string, string | null][] = [
  // auteur, ville, note, titre, texte, date ISO, réponse du cabinet
  ["Marc D.", "Lyon", 5, "Un chantier tenu dans les délais",
    "Regroupement de nos deux sites sur un seul plateau : l’équipe a tenu le planning et nos collaborateurs ont emménagé à la date prévue.",
    "2026-10-08T09:10:00Z", "Merci Marc, ce fut un plaisir de travailler avec vos équipes."],
  ["Sophie L.", "Paris", 5, "À l’écoute de nos équipes",
    "Ils ont interrogé chaque service avant de dessiner. Le résultat ressemble enfin à notre façon de travailler.",
    "2026-10-03T17:25:00Z", null],
  ["Antoine R.", "Nantes", 4, "Très bon suivi de chantier",
    "Comptes rendus clairs chaque semaine. Quelques jours de retard sur la livraison du mobilier, bien gérés.",
    "2026-09-26T08:40:00Z", "Merci Antoine pour votre retour, nous avons revu nos délais avec ce fournisseur."],
  ["Claire M.", "Bordeaux", 5, "Une réhabilitation réussie",
    "Notre immeuble des années 70 consomme beaucoup moins et nos locataires ont signé de nouveaux baux.",
    "2026-09-18T14:05:00Z", null],
  ["Julien P.", "Lille", 5, "Des propositions claires",
    "Trois scénarios chiffrés dès la première étude, ce qui a facilité la décision en comité de direction.",
    "2026-09-09T11:30:00Z", null],
];

const initiales = (n: string) => n.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("");
const dateLue = (iso: string) => new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

const AVIS: BrandReview[] = AVIS_BRUTS.map(([auteur, ville, note, titre, texte, date, reponse], i) => ({
  id: `bv-avis-${i + 1}`,
  rating: note,
  title: titre,
  content: texte,
  author_name: auteur,
  initials: initiales(auteur),
  location: ville,
  /* Un client d'un cabinet n'a rien « acheté » : pas de mention d'achat. */
  verified_purchase: false,
  published_at: date,
  date_label: dateLue(date),
  product_id: null,
  brand_reply: reponse,
  source: "lystes",
  provenance: "demo",
  est_definitif: true,
}));

const moyenne = AVIS.reduce((s, a) => s + a.rating, 0) / AVIS.length;
export const AVIS_CORPO: Pick<BrandReviewsAggregate, "reviews" | "avgRating" | "totalCount" | "totalAffiche" | "distribution"> = {
  reviews: AVIS,
  avgRating: Math.round(moyenne * 10) / 10,
  totalCount: AVIS.length,
  totalAffiche: AVIS.length,
  distribution: [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    pct: Math.round((AVIS.filter((a) => a.rating === stars).length / AVIS.length) * 100),
  })),
};

/* ---------- Le lien LinkedIn (le multi-lien, posé dans la bio) ---------- */

export const MULTI_LIEN_CORPO: BrandLinkData = {
  id: "demo-brevan-architectes",
  slug: SLUG_CORPO,
  account_id: "demo-brevan-architectes",
  brand_name: MARQUE_CORPO,
  logo_url: LOGO_CORPO,
  is_verified: true,
  featured_products: SERVICES_CORPO.map((s) => ({
    id: s.id,
    name: s.nom,
    image_url: s.image,
    price: "",
    cta_label: "Découvrir",
    cta_url: `/${SLUG_CORPO}`,
  })),
  featured_products_title: "Nos expertises",
  custom_links: [
    { label: "Prendre rendez-vous", url: `/${SLUG_CORPO}/booking` },
    { label: "Nos articles", url: `/${SLUG_CORPO}/mag` },
    { label: "Nous contacter", url: `/${SLUG_CORPO}/contact`, cle: "contact" },
    { label: "FAQ", url: `/${SLUG_CORPO}/faq`, cle: "faq" },
  ],
  featured_section: {},
  reviews: AVIS.slice(0, 3).map((a) => ({ id: a.id, name: a.author_name.split(" ")[0], rating: a.rating, text: a.content })),
  reviews_display_count: 3,
  a_une_page_avis: true,
};

/** Le conseiller : un visiteur venu de LinkedIn, une réponse qui l'oriente
 *  vers le bon service et un rendez-vous (conseiller-boutique-chat, compte
 *  « prestations » : il oriente vers la prise de rendez-vous ou le devis). */
export const CONSEILLER_CORPO = {
  agent: { id: "demo-conseiller-brevan", name: "Louise", logo_url: LOGO_CORPO },
  accueil: `Bonjour, je suis Louise. Sur quel projet pouvons-nous vous aider ?`,
  question: "Nous regroupons deux sites sur un plateau de 1 200 m². Vous faites ce type de projet ?",
  reponse: "Oui, c’est le cœur de notre service Bureaux et sièges sociaux. Je vous propose un premier échange de 30 minutes avec un associé pour cadrer votre projet.",
};

/* ---------- La FAQ ---------- */

const q = (cle: string, question: string, reponse: string, occurrences = 0): QuestionFaq => ({
  cle,
  question,
  reponse,
  theme: null,
  produitId: null,
  occurrences,
  mesuree: occurrences > 0,
  repondue: true,
  cleDonnees: null,
});

export const FAQ_DEMANDES_CORPO: QuestionFaq[] = [
  q("d1", "Combien de temps dure une étude de faisabilité ?",
    "Quatre à six semaines selon la surface et l’état du bâtiment, visite des lieux comprise.", 12),
  q("d2", "Pouvez-vous rester sur place pendant les travaux ?",
    "Oui. Nous phasons le chantier par zones pour que vos équipes continuent de travailler.", 8),
  q("d3", "Intervenez-vous hors d’Île-de-France ?",
    "Oui, depuis nos ateliers de Paris et de Lyon, partout en France.", 5),
];
export const FAQ_GENERAL_CORPO: QuestionFaq[] = [
  q("g1", "Comment se passe un premier rendez-vous ?",
    "Un échange de 30 minutes avec un associé, en visio ou dans vos locaux, pour comprendre votre projet."),
  q("g2", "Travaillez-vous avec nos propres entreprises de travaux ?",
    "Oui. Nous pouvons aussi lancer la consultation des entreprises pour vous."),
];

/* ---------- Les articles d'expertise ---------- */

const article = (id: string, slug: string, title: string, dek: string, image: string, featured = false):
  Pick<ArticleMarque, "id" | "slug" | "title" | "dek" | "excerpt" | "hero_image_url" | "hero_image_alt" | "featured"> => ({
  id, slug, title, dek, excerpt: dek, hero_image_url: image, hero_image_alt: title, featured,
});

export const ARTICLES_CORPO = [
  article("a1", "renover-immeuble-bureaux-annees-70", "Rénover des bureaux des années 70",
    "Façade, isolation, brise-soleil : l’ordre des travaux décide de ce que vous gagnez sur la facture d’énergie et sur le confort.",
    `${IMG}/article-energie.webp`, true),
  article("a2", "bureaux-flexibles-plateau", "Bureaux flexibles : dessiner un plateau que les équipes utilisent vraiment",
    "Avant de retirer des postes fixes, mesurer comment chaque équipe travaille, et prévoir les lieux pour s’isoler.",
    `${IMG}/article-flex.webp`),
  article("a3", "construire-en-bois-tertiaire", "Construire des bureaux en bois : ce que change le chantier",
    "Panneaux préfabriqués, chantier plus court et plus calme : ce qu’il faut décider dès les premières esquisses.",
    `${IMG}/article-bois.webp`),
];

/* ---------- Le contact ---------- */

export const CONTACT_CORPO = {
  nom: "Hélène",
  email: "helene@exemple.fr",
  message: "Quels sont vos délais pour une première étude de nos bureaux à Lyon ?",
  reponse:
    "Un associé peut venir visiter vos bureaux sous quinze jours. L’étude de faisabilité prend ensuite quatre à six semaines. Je transmets votre demande à l’atelier de Lyon.",
};

/* ---------- Le rendez-vous commercial (Booking IA) ---------- */

export const RDV_CORPO: PagePublique = {
  organisation: {
    id: "demo-rdv-brevan",
    nom: MARQUE_CORPO,
    slug: SLUG_CORPO,
    logo: LOGO_CORPO,
    couleur: "#111111",
    fuseau: "Europe/Paris",
    devise: "€",
    adresse: null,
    telephone: null,
  },
  prestations: [
    { id: "rdv-echange", nom: "Premier échange sur votre projet", description: null, prix: null, duree: 30, categorie: "Rendez-vous" },
    { id: "rdv-visite", nom: "Visite de vos locaux", description: null, prix: null, duree: 60, categorie: "Rendez-vous" },
    { id: "rdv-references", nom: "Présentation de nos références", description: null, prix: null, duree: 45, categorie: "Rendez-vous" },
    { id: "rdv-associe", nom: "Point avec un associé", description: null, prix: null, duree: 30, categorie: "Rendez-vous" },
  ],
  conseillers: [],
};
export const RDV_CLIENT_CORPO = { nom: "Hélène Martin", email: "helene.martin@exemple.fr" };
