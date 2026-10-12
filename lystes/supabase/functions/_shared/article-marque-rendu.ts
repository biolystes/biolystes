/**
 * L'ARTICLE DE MARQUE, LU DE LA MÊME FAÇON PARTOUT (01/10/2026).
 *
 * Un même article s'affiche à trois endroits : la page lystes.ai/<marque>/blog
 * (React), le site de la marque par le shortcode [lystes_magazine] (HTML rendu
 * par le serveur, inséré par l'extension WordPress), et le pré-rendu lu par
 * les robots (Googlebot, GPTBot, PerplexityBot), qui n'exécutent pas le
 * JavaScript. Trois lecteurs, une seule grammaire : ce module.
 *
 * Mesuré avant d'écrire : l'ancien rendu (`MagArticlePage.tsx`) ignorait les
 * liens, et un `[texte](adresse)` s'affichait brut. Les liens vers la fiche de
 * la marque sont pourtant ce qui donne au site de la marque son crédit
 * (backlinks). Ici, un lien est rendu s'il mène à un hôte autorisé (le site de
 * la marque, lystes.ai) ; sinon seul son texte reste.
 *
 * Aucun import : le module est lu par Deno (fonctions), par Vite (la page) et
 * par tsx (le pré-rendu).
 */

export type Morceau =
  | { t: "texte"; v: string }
  | { t: "gras"; v: Morceau[] }
  | { t: "italique"; v: Morceau[] }
  | { t: "lien"; href: string; v: Morceau[] };

export type Bloc =
  | { t: "titre"; niveau: 2 | 3; v: Morceau[] }
  | { t: "paragraphe"; v: Morceau[] }
  | { t: "liste"; ordonnee: boolean; items: Morceau[][] };

/** L'hôte d'une adresse, sans « www. », en minuscules ; null si illisible. */
export function hoteDe(adresse: string | null | undefined): string | null {
  if (!adresse) return null;
  try {
    const u = new URL(adresse);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return u.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Vrai quand l'adresse est en http(s) et mène à l'un des hôtes autorisés (ou un sous-domaine). */
export function lienAutorise(adresse: string, hotes: readonly string[] | null): boolean {
  const hote = hoteDe(adresse);
  if (!hote) return false;
  if (hotes === null) return true;
  return hotes.some((h) => {
    const propre = h.toLowerCase().replace(/^www\./, "");
    return propre.length > 0 && (hote === propre || hote.endsWith(`.${propre}`));
  });
}

/* Sans « lookbehind » : un Safari antérieur à 16.4 refuserait le module
   entier, et la page de la marque ne s'afficherait plus. L'italique garde
   donc le caractère qui le précède dans un groupe (`avant`). */
const MOTIFS: Array<{ nom: "lien" | "gras" | "italique"; re: RegExp }> = [
  { nom: "lien", re: /\[([^\]\n]+)\]\(([^)\s]+)\)/ },
  { nom: "gras", re: /\*\*([^*\n]+?)\*\*/ },
  { nom: "italique", re: /(^|[^*\w])\*([^*\n]+?)\*(?![*\w])/ },
];

/** Le texte d'une ligne, découpé en morceaux : texte, gras, italique, lien. */
export function morceauxDe(ligne: string, hotes: readonly string[] | null = null): Morceau[] {
  const sortie: Morceau[] = [];
  let reste = ligne;
  while (reste.length) {
    let premier: { nom: "lien" | "gras" | "italique"; debut: number; fin: number; m: RegExpExecArray } | null = null;
    for (const motif of MOTIFS) {
      const m = motif.re.exec(reste);
      if (!m) continue;
      const debut = motif.nom === "italique" ? m.index + m[1].length : m.index;
      if (premier === null || debut < premier.debut) premier = { nom: motif.nom, debut, fin: m.index + m[0].length, m };
    }
    if (!premier) {
      sortie.push({ t: "texte", v: reste });
      break;
    }
    const { nom, debut, fin, m } = premier;
    if (debut > 0) sortie.push({ t: "texte", v: reste.slice(0, debut) });
    if (nom === "lien") {
      const interieur = morceauxDe(m[1], hotes);
      if (lienAutorise(m[2], hotes)) sortie.push({ t: "lien", href: m[2], v: interieur });
      else sortie.push(...interieur);
    } else {
      sortie.push({ t: nom, v: morceauxDe(nom === "italique" ? m[2] : m[1], hotes) });
    }
    reste = reste.slice(fin);
  }
  return sortie;
}

/**
 * Le markdown d'un article, en blocs. Grammaire tenue : `## ` et `### `,
 * paragraphes séparés par une ligne vide, listes `- `, `* ` et `1. `, gras,
 * italique, liens. Tout le reste est du texte.
 */
export function blocsDe(markdown: string | null | undefined, hotes: readonly string[] | null = null): Bloc[] {
  const blocs: Bloc[] = [];
  let paragraphe: string[] = [];
  let liste: { ordonnee: boolean; items: string[] } | null = null;

  const fermerParagraphe = () => {
    if (paragraphe.length) blocs.push({ t: "paragraphe", v: morceauxDe(paragraphe.join(" "), hotes) });
    paragraphe = [];
  };
  const fermerListe = () => {
    if (liste) blocs.push({ t: "liste", ordonnee: liste.ordonnee, items: liste.items.map((i) => morceauxDe(i, hotes)) });
    liste = null;
  };

  for (const brute of String(markdown ?? "").replace(/\r\n?/g, "\n").split("\n")) {
    const ligne = brute.trim();
    const titre = /^(#{2,3})\s+(.+)$/.exec(ligne);
    const puce = /^[-*•]\s+(.+)$/.exec(ligne);
    const numero = /^\d{1,2}[.)]\s+(.+)$/.exec(ligne);
    if (!ligne) {
      fermerParagraphe();
      fermerListe();
    } else if (titre) {
      fermerParagraphe();
      fermerListe();
      blocs.push({ t: "titre", niveau: titre[1].length === 2 ? 2 : 3, v: morceauxDe(titre[2].replace(/#+\s*$/, "").trim(), hotes) });
    } else if (/^#\s+/.test(ligne)) {
      /* Un titre de niveau 1 dans le corps ferait un second h1 : la page en a
         déjà un, le titre de l'article. Il devient un intertitre. */
      fermerParagraphe();
      fermerListe();
      blocs.push({ t: "titre", niveau: 2, v: morceauxDe(ligne.replace(/^#\s+/, ""), hotes) });
    } else if (puce || numero) {
      fermerParagraphe();
      const ordonnee = Boolean(numero);
      if (liste && liste.ordonnee !== ordonnee) fermerListe();
      if (!liste) liste = { ordonnee, items: [] };
      liste.items.push((puce ?? numero)![1]);
    } else {
      fermerListe();
      paragraphe.push(ligne);
    }
  }
  fermerParagraphe();
  fermerListe();
  return blocs;
}

/** Échappe un texte pour l'insérer dans du HTML, attributs compris. */
export function echapper(texte: string): string {
  return texte
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function htmlDeMorceaux(morceaux: Morceau[]): string {
  return morceaux
    .map((m) => {
      if (m.t === "texte") return echapper(m.v);
      if (m.t === "gras") return `<strong>${htmlDeMorceaux(m.v)}</strong>`;
      if (m.t === "italique") return `<em>${htmlDeMorceaux(m.v)}</em>`;
      return `<a href="${echapper(m.href)}">${htmlDeMorceaux(m.v)}</a>`;
    })
    .join("");
}

/** Le HTML d'un article : seules les balises h2, h3, p, ul, ol, li, strong, em, a sortent. */
export function htmlDe(markdown: string | null | undefined, hotes: readonly string[] | null = null): string {
  return blocsDe(markdown, hotes)
    .map((b) => {
      if (b.t === "titre") return `<h${b.niveau}>${htmlDeMorceaux(b.v)}</h${b.niveau}>`;
      if (b.t === "paragraphe") return `<p>${htmlDeMorceaux(b.v)}</p>`;
      const balise = b.ordonnee ? "ol" : "ul";
      return `<${balise}>${b.items.map((i) => `<li>${htmlDeMorceaux(i)}</li>`).join("")}</${balise}>`;
    })
    .join("\n");
}

function texteDeMorceaux(morceaux: Morceau[]): string {
  return morceaux.map((m) => (m.t === "texte" ? m.v : texteDeMorceaux(m.v))).join("");
}

/** Le texte nu d'un article, sans balisage : pour compter, décrire, comparer. */
export function texteDe(markdown: string | null | undefined): string {
  return blocsDe(markdown, null)
    .map((b) => (b.t === "liste" ? b.items.map(texteDeMorceaux).join(" ") : texteDeMorceaux(b.v)))
    .join("\n")
    .trim();
}

/**
 * Réécrit le markdown en retirant les liens qui ne mènent pas à un hôte
 * autorisé : le texte du lien reste, l'adresse part. Appliqué AVANT
 * l'enregistrement, pour qu'aucun lecteur ne reçoive un lien inventé.
 */
export function nettoyerLiens(markdown: string, hotes: readonly string[]): string {
  return markdown.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (tout, texte: string, adresse: string) =>
    lienAutorise(adresse, hotes) ? tout : texte,
  );
}

/** Les adresses des liens restés dans un markdown. */
export function liensDe(markdown: string): string[] {
  return [...markdown.matchAll(/\[[^\]\n]+\]\(([^)\s]+)\)/g)].map((m) => m[1]);
}

export interface QuestionReponse {
  question: string;
  reponse: string;
}

/** Les paires question-réponse GEO d'un article, appariées et vides écartées. */
export function faqDe(geo: unknown): QuestionReponse[] {
  const g = (geo && typeof geo === "object" ? geo : {}) as { questions?: unknown; reponses_courtes?: unknown };
  const questions = Array.isArray(g.questions) ? g.questions : [];
  const reponses = Array.isArray(g.reponses_courtes) ? g.reponses_courtes : [];
  const sortie: QuestionReponse[] = [];
  for (let i = 0; i < Math.min(questions.length, reponses.length); i++) {
    const question = String(questions[i] ?? "").trim();
    const reponse = String(reponses[i] ?? "").trim();
    if (question && reponse) sortie.push({ question, reponse });
  }
  return sortie;
}

export interface DonneesJsonLd {
  titre: string;
  description: string | null;
  url: string;
  image: string | null;
  publieLe: string | null;
  modifieLe: string | null;
  auteur: string | null;
  marque: string;
  motsCles: string[];
  faq: QuestionReponse[];
}

/**
 * Les données structurées d'un article : `Article` (BlogPosting) et, quand
 * l'article porte ses réponses GEO, `FAQPage`. Ce sont elles que Google et les
 * assistants lisent pour citer une réponse courte.
 */
export function jsonLdArticle(d: DonneesJsonLd): Record<string, unknown>[] {
  const article: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: d.titre.slice(0, 110),
    mainEntityOfPage: { "@type": "WebPage", "@id": d.url },
    url: d.url,
    publisher: { "@type": "Organization", name: d.marque },
  };
  if (d.description) article.description = d.description;
  if (d.image) article.image = [d.image];
  if (d.publieLe) article.datePublished = d.publieLe;
  if (d.modifieLe || d.publieLe) article.dateModified = d.modifieLe ?? d.publieLe;
  if (d.auteur) article.author = { "@type": "Organization", name: d.auteur };
  if (d.motsCles.length) article.keywords = d.motsCles.join(", ");
  const sortie = [article];
  if (d.faq.length) {
    sortie.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: d.faq.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.reponse },
      })),
    });
  }
  return sortie;
}

/** Un JSON sûr à poser dans une balise <script> : « </ » ne peut pas la fermer. */
export function jsonPourScript(donnees: unknown): string {
  return JSON.stringify(donnees).replace(/</g, "\\u003c");
}
