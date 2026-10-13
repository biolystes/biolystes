/* /blog/articles.json, lu par la fenêtre « L’actualité » du widget Lystes
   (JP, 13/10/2026). Ce que ces assertions empêchent :
   - un article du blog absent de la fenêtre, ou dans un autre ordre que /blog ;
   - un prix qui partirait dans la fenêtre (aucun prix en ligne) ;
   - du HTML non échappé (le widget nettoie aussi, on ne compte pas dessus). */
import { describe, expect, it } from "vitest";
import { articles, typo } from "@/actus/articles";
import { articlesEnJson, blocEnHtml } from "../../scripts/articles-json";

const json = articlesEnJson(articles, typo, (img) => `/img/${img.split("/").pop()}`);

describe("articles.json", () => {
  it("tous les articles, du plus récent au plus ancien, chacun avec image, date et lien", () => {
    expect(json).toHaveLength(articles.length);
    const dates = json.map((a) => a.date);
    expect([...dates].sort().reverse()).toEqual(dates);
    for (const a of json) {
      expect(a.title.length).toBeGreaterThan(10);
      expect(a.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(a.hero_image_url).toMatch(/^\/img\/.+\.(jpe?g|png|webp)$/);
      expect(a.url).toMatch(/^\/(blog\/[a-z0-9-]+|etudes)$/);
      expect(a.read_minutes).toBeGreaterThan(0);
    }
  });

  it("le texte des articles du gabarit, rien pour ceux qui renvoient vers une page", () => {
    for (const a of json) {
      const source = articles.find((s) => s.slug === a.slug)!;
      if (source.url) expect(a.html).toBe("");
      else expect(a.html).toContain("<p>");
    }
  });

  it("aucun prix dans la fenêtre", () => {
    const tout = JSON.stringify(json);
    expect(tout).not.toMatch(/€|\bEUR\b|euros?\b|\/mois/i);
  });

  it("gras rendu, balises échappées", () => {
    expect(blocEnHtml({ t: "p", texte: "a **b** <script>x</script>" }, (t) => t)).toBe("<p>a <strong>b</strong> &lt;script&gt;x&lt;/script&gt;</p>");
    expect(blocEnHtml({ t: "liste", items: ["un", "deux"], numerotee: true }, (t) => t)).toBe("<ol><li>un</li><li>deux</li></ol>");
  });
});
