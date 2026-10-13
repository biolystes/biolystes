/* /blog/articles.json : les articles de la partie Actus, lus par le widget
   Lystes (option data-actus-source, petal-diagnostics, widget 3.64.0).

   JP, 13/10/2026 : « Voir nos dernières actus est censé être en pop-up, la
   même que sur Éclose ». Le bouton noir de la barre du widget ouvre la
   fenêtre « L’actualité » de l’orbital ; elle se remplit avec ce fichier.

   Une seule source : src/actus/articles.ts. Le fichier n’est jamais écrit à
   la main ; le greffon Vite ci-dessous le produit au build et le sert en
   développement. Les images sont celles que Vite publie déjà pour /blog
   (aucune copie) ; à défaut, une copie est publiée sous blog/img/.

   Ce module (hors de src : il tourne dans Node) est importé par vite.config.ts ET par le test
   (src/test/articles-json.test.ts) : aucune dépendance au navigateur. */
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import type { Article, Bloc } from "../src/actus/articles";

export const CHEMIN_ARTICLES_JSON = "blog/articles.json";

export type ArticleJson = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  hero_image_url: string;
  hero_image_alt: string;
  url: string;
  html: string;
  read_minutes: number;
};

const echapper = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Même rendu que le gabarit (ArticlePage) : typographie, puis **gras**. */
function riche(texte: string, typo: (t: string) => string) {
  return echapper(typo(texte)).replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function liste(items: string[], typo: (t: string) => string, numerotee?: boolean) {
  const balise = numerotee ? "ol" : "ul";
  return `<${balise}>${items.map((i) => `<li>${riche(i, typo)}</li>`).join("")}</${balise}>`;
}

export function blocEnHtml(bloc: Bloc, typo: (t: string) => string): string {
  switch (bloc.t) {
    case "p":
      return `<p>${riche(bloc.texte, typo)}</p>`;
    case "h2":
      return `<h2>${echapper(typo(bloc.texte))}</h2>`;
    case "liste":
      return liste(bloc.items, typo, bloc.numerotee);
    case "cartes":
      return bloc.items.map((c) => `<p><strong>${echapper(typo(c.titre))}</strong><br>${riche(c.texte, typo)}</p>`).join("");
    case "chiffre":
      return `<p><strong>${echapper(typo(bloc.valeur))}</strong> ${riche(bloc.texte, typo)}</p>${bloc.note ? `<p><em>${riche(bloc.note, typo)}</em></p>` : ""}`;
    case "note":
      return `<p><em>${riche(bloc.texte, typo)}</em></p>`;
    case "comparaison":
      return `<p><strong>${echapper(typo(bloc.gauche.titre))}</strong></p>${liste(bloc.gauche.items, typo)}`
        + `<p><strong>${echapper(typo(bloc.droite.titre))}</strong></p>${liste(bloc.droite.items, typo)}`;
  }
}

function texteDuBloc(bloc: Bloc): string {
  switch (bloc.t) {
    case "p": case "h2": case "note": return bloc.texte;
    case "liste": return bloc.items.join(" ");
    case "cartes": return bloc.items.map((c) => `${c.titre} ${c.texte}`).join(" ");
    case "chiffre": return `${bloc.valeur} ${bloc.texte} ${bloc.note || ""}`;
    case "comparaison": return [...bloc.gauche.items, ...bloc.droite.items].join(" ");
  }
}

/** Les articles, du plus récent au plus ancien (même ordre que /blog). */
export function articlesEnJson(
  articles: Article[],
  typo: (t: string) => string,
  adresseImage: (image: string) => string,
): ArticleJson[] {
  return [...articles]
    .sort((x, y) => (x.date < y.date ? 1 : x.date > y.date ? -1 : 0))
    .map((a) => {
      const mots = [a.chapo, ...a.corps.map(texteDuBloc)].join(" ").split(/\s+/).filter(Boolean).length;
      return {
        slug: a.slug,
        title: a.titre,
        excerpt: a.chapo,
        date: a.date,
        category: a.categorie,
        hero_image_url: adresseImage(a.image),
        hero_image_alt: a.alt,
        url: a.url || `/blog/${a.slug}`,
        /* Un article qui renvoie vers une page existante (/etudes) n’a pas de
           texte ici : le widget ouvre la page. */
        html: a.url ? "" : a.corps.map((b) => blocEnHtml(b, typo)).join("") + `<p><em>${riche(a.appel, typo)}</em></p>`,
        read_minutes: Math.max(1, Math.round(mots / 200)),
      };
    });
}

/* ───────────── Greffon Vite ───────────── */

const IMAGE = /\.(jpe?g|png|webp|avif|gif|svg)$/i;

/** Charge src/actus/articles.ts hors de Vite : les images deviennent leur
 *  chemin sur le disque, les icônes Lucide sont ignorées. */
async function chargerArticles(racine: string): Promise<{ articles: Article[]; typo: (t: string) => string }> {
  const { build } = await import("esbuild");
  const resoudre = (p: string, dossier: string) => {
    if (p.startsWith("@lystes/")) return path.join(racine, "lystes/src", p.slice(8));
    if (p.startsWith("@/")) return path.join(racine, "src", p.slice(2));
    return path.resolve(dossier, p);
  };
  const r = await build({
    entryPoints: [path.join(racine, "src/actus/articles.ts")],
    bundle: true,
    write: false,
    format: "esm",
    platform: "neutral",
    logLevel: "silent",
    plugins: [{
      name: "articles-seuls",
      setup(b) {
        b.onResolve({ filter: IMAGE }, (a) => ({ path: resoudre(a.path, a.resolveDir), namespace: "image" }));
        b.onLoad({ filter: /.*/, namespace: "image" }, (a) => ({ contents: `export default ${JSON.stringify(a.path)};`, loader: "js" }));
        b.onResolve({ filter: /^lucide-react$/ }, () => ({ path: "lucide-react", namespace: "icones" }));
        b.onLoad({ filter: /.*/, namespace: "icones" }, () => ({ contents: "module.exports = {};", loader: "js" }));
      },
    }],
  });
  const code = r.outputFiles[0].text;
  const mod = await import(/* @vite-ignore */ "data:text/javascript;base64," + Buffer.from(code).toString("base64"));
  return { articles: mod.articles, typo: mod.typo };
}

export function articlesJsonVite(): Plugin {
  let racine = process.cwd();
  return {
    name: "biolystes-articles-json",
    configResolved(config) {
      racine = config.root;
    },
    /* Développement : servi à la volée, images servies par Vite à leur chemin. */
    configureServer(server) {
      server.middlewares.use(`/${CHEMIN_ARTICLES_JSON}`, async (_req, res) => {
        try {
          const { articles, typo } = await chargerArticles(racine);
          const json = articlesEnJson(articles, typo, (img) => "/" + path.relative(racine, img).split(path.sep).join("/"));
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ articles: json }));
        } catch (e) {
          res.statusCode = 500;
          res.end(String(e));
        }
      });
    },
    /* Build : les images déjà publiées par Vite pour /blog, retrouvées par
       leur nom d’origine ; sinon une copie sous blog/img/. */
    async generateBundle(_options, bundle) {
      const { articles, typo } = await chargerArticles(racine);
      const publiees = new Map<string, string>();
      for (const sortie of Object.values(bundle)) {
        if (sortie.type !== "asset") continue;
        const origines = (sortie as { originalFileNames?: string[] }).originalFileNames || [];
        for (const o of origines) publiees.set(path.resolve(racine, o), sortie.fileName);
      }
      const json = articlesEnJson(articles, typo, (img) => {
        const deja = publiees.get(path.resolve(img));
        if (deja) return "/" + deja;
        const ref = this.emitFile({ type: "asset", name: `blog/img/${path.basename(img)}`, source: readFileSync(img) });
        return "/" + this.getFileName(ref);
      });
      this.emitFile({ type: "asset", fileName: CHEMIN_ARTICLES_JSON, source: JSON.stringify({ articles: json }) });
    },
  };
}
