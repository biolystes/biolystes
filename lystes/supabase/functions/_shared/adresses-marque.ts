/**
 * Les adresses du contact et de la FAQ d'une marque, pour les trois cadres.
 *
 * Demande de JP du 01/10/2026 : le contact et la FAQ ont le même contenu
 * partout, seul le cadre change (multi-lien sur lystes.ai, fenêtre de
 * l'orbital chez la marchande, code nu dans sa propre page). Il faut donc UNE
 * seule réponse à la question « où vit le contact de cette marque ? », lue par
 * la page publique, le back-office, `get-widget-config` et
 * `faq-marque-publique`. Deux calculs finissent toujours par diverger : c'est
 * ce qui a laissé des liens « /eclose-paris/contact » sur une page dont
 * l'adresse est devenue « ecloseparis » (relevé en base le 01/10).
 *
 * Règle :
 *  - la page de la marque, si elle en a déclaré une dans ses liens (adresse
 *    http(s) hors lystes.ai, sous la clé `contact` ou `faq`, ou dont le
 *    chemin le dit : `/pages/contact`, `/faq`…) ;
 *  - sinon `https://lystes.ai/<slug>/contact` et `/faq`.
 *
 * Le slug vient toujours de la configuration (`brand_link_pages.slug`, puis
 * `account_landing_config.slug`), jamais déduit d'un nom.
 *
 * Ce fichier n'importe rien : il est lu tel quel par les fonctions (Deno) et
 * par le navigateur (Vite), comme `faq-socles.ts`.
 */

export const ORIGINE_LYSTES = "https://lystes.ai";

export type QuoiAdresse = "contact" | "faq";

/** Un lien du multi-lien, tel qu'il est rangé dans `brand_link_pages.custom_links`. */
export interface LienMultiLien {
  cle?: string;
  label: string;
  url: string;
  actif?: boolean;
}

/**
 * Les chemins qui disent « contact » ou « FAQ », sans requête ni ancre.
 * Aucune migration ne les recopie : les multi-liens existants ne sont pas
 * réécrits en base (choix du 01/10, voir `liens-contact-faq-par-defaut`),
 * seule cette règle les lit.
 */
export const MOTIF_CHEMIN_CONTACT =
  "/(pages/)?(contact|contact-us|contactez-nous|nous-contacter|forms)/?$";
export const MOTIF_CHEMIN_FAQ = "/(pages/)?(faq|faqs|foire-aux-questions|questions-frequentes)/?$";

const MOTIFS: Record<QuoiAdresse, RegExp> = {
  contact: new RegExp(MOTIF_CHEMIN_CONTACT, "i"),
  faq: new RegExp(MOTIF_CHEMIN_FAQ, "i"),
};

/** Les libellés posés par défaut, en français : ce sont des données, pas des textes d'interface. */
export const LIBELLES_PAR_DEFAUT: Record<QuoiAdresse, string> = {
  contact: "Nous contacter",
  faq: "FAQ",
};

/** Le slug tel que les routes l'acceptent : minuscules, chiffres, tirets. `null` s'il est vide. */
export function slugAdresse(slug: unknown): string | null {
  const s = String(slug ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");
  return s || null;
}

/** Le chemin d'une adresse, sans requête ni ancre. */
function chemin(url: string): string {
  const sansSuite = url.replace(/[?#].*$/, "");
  if (/^https?:\/\//i.test(sansSuite)) {
    try {
      return new URL(sansSuite).pathname;
    } catch {
      return "";
    }
  }
  return sansSuite;
}

function lireLien(brut: unknown): { cle: string | null; url: string; actif: boolean } | null {
  if (!brut || typeof brut !== "object") return null;
  const l = brut as Record<string, unknown>;
  const url = typeof l.url === "string" ? l.url.trim() : "";
  return { cle: typeof l.cle === "string" ? l.cle : null, url, actif: l.actif !== false };
}

/** Ce lien mène-t-il au contact (ou à la FAQ), où qu'il pointe ? */
export function lienMeneA(brut: unknown, quoi: QuoiAdresse): boolean {
  const l = lireLien(brut);
  if (!l) return false;
  if (l.cle === quoi) return true;
  return Boolean(l.url) && MOTIFS[quoi].test(chemin(l.url));
}

/** Une adresse sur lystes.ai (ou relative à lystes.ai) ? */
function surLystes(url: string): boolean {
  if (url.startsWith("/")) return true;
  try {
    return /(^|\.)lystes\.ai$/i.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * La page que la marque a déclarée elle-même dans ses liens pour ce besoin :
 * une adresse http(s) hors de lystes.ai. `null` sinon.
 */
export function pageDeclaree(liens: unknown, quoi: QuoiAdresse): string | null {
  if (!Array.isArray(liens)) return null;
  for (const brut of liens) {
    const l = lireLien(brut);
    if (!l || !l.actif || !/^https?:\/\//i.test(l.url) || surLystes(l.url)) continue;
    if (lienMeneA(brut, quoi)) return l.url;
  }
  return null;
}

/** `https://lystes.ai/<slug>/contact` ou `/faq`. */
export function adresseLystes(slug: string, quoi: QuoiAdresse): string {
  return `${ORIGINE_LYSTES}/${slug}/${quoi}`;
}

export interface AdressesMarque {
  slug: string;
  contact: string;
  faq: string;
  /** Vrai quand l'adresse vient d'une page déclarée par la marque. */
  contactDeclare: boolean;
  faqDeclaree: boolean;
}

/** Les deux adresses d'une marque. `null` sans slug : on ne devine pas. */
export function adressesMarque(e: { slug: unknown; liens?: unknown }): AdressesMarque | null {
  const slug = slugAdresse(e.slug);
  if (!slug) return null;
  const contact = pageDeclaree(e.liens, "contact");
  const faq = pageDeclaree(e.liens, "faq");
  return {
    slug,
    contact: contact ?? adresseLystes(slug, "contact"),
    faq: faq ?? adresseLystes(slug, "faq"),
    contactDeclare: Boolean(contact),
    faqDeclaree: Boolean(faq),
  };
}

/**
 * Les deux liens par défaut du multi-lien, en chemins internes : un clic les
 * ouvre dans le cadre du multi-lien, sans quitter lystes.ai.
 */
export function liensContactFaq(slug: string): LienMultiLien[] {
  return (["contact", "faq"] as const).map((quoi) => ({
    cle: quoi,
    label: LIBELLES_PAR_DEFAUT[quoi],
    url: `/${slug}/${quoi}`,
    actif: true,
  }));
}

/**
 * Ajoute « Nous contacter » et « FAQ » à des liens existants, sans toucher à
 * un seul lien écrit par la marque. Lue par la page publique ET par l'écran de
 * configuration, pour que la marque voie ce que voit sa cliente ; rien n'est
 * écrit en base tant que la marque n'enregistre pas :
 *
 *  - « Nous contacter » n'est ajouté que si aucun lien ne mène déjà au
 *    contact ET que la page n'a jamais reçu les liens de l'inscription (aucun
 *    lien porteur d'une `cle`). Une page créée à l'inscription avait ce lien :
 *    s'il manque, c'est que la marque l'a retiré, et on ne le lui remet pas.
 *  - « FAQ » est ajoutée si aucun lien n'y mène, juste après le contact, ou à
 *    la fin s'il n'y en a pas. Elle n'a jamais été un lien par défaut avant
 *    le 01/10 : son absence n'est pas un refus.
 *
 * Idempotent : appliquée deux fois, elle ne double rien.
 */
export function completerLiensContactFaq<T>(liens: T[], slug: string): Array<T | LienMultiLien> {
  const [contact, faq] = liensContactFaq(slug);
  const resultat: Array<T | LienMultiLien> = [...liens];
  const aDesCles = liens.some((l) => Boolean(lireLien(l)?.cle));
  if (!resultat.some((l) => lienMeneA(l, "contact")) && !aDesCles) resultat.push(contact);
  if (!resultat.some((l) => lienMeneA(l, "faq"))) {
    const rang = resultat.findIndex((l) => lienMeneA(l, "contact"));
    if (rang === -1) resultat.push(faq);
    else resultat.splice(rang + 1, 0, faq);
  }
  return resultat;
}

/** Les clés des liens internes posés par lystes.ai (inscription et défauts). */
const CLES_INTERNES = new Set(["avis-voir", "avis-laisser", "contact", "faq", "rdv"]);

/**
 * Remet le slug de la page dans les liens internes que lystes.ai a posés.
 *
 * Relevé en base le 01/10/2026 : des pages à l'adresse « ecloseparis »
 * portent encore des liens « /eclose-paris/avis », écrits à l'inscription
 * avant que l'adresse ne perde ses tirets. Seuls les liens porteurs d'une de
 * nos clés ET d'un chemin interne sont réalignés : un lien que la marque a
 * fait pointer ailleurs ne bouge pas.
 */
export function alignerLiensInternes<T>(liens: T[], slug: string): T[] {
  return liens.map((brut) => {
    const l = lireLien(brut);
    if (!l || !l.cle || !CLES_INTERNES.has(l.cle) || !l.url.startsWith("/")) return brut;
    const url = l.url.replace(/^\/[^/?#]*/, `/${slug}`);
    return url === l.url ? brut : ({ ...(brut as object), url } as T);
  });
}

/** Un lien interne à lystes.ai s'ouvre dans le même onglet : il reste dans le cadre. */
export function estLienInterne(url: string): boolean {
  return url.startsWith("/") && !url.startsWith("//");
}
