/* Les actus du Magazine de lystes.ai sur /blog (14/10/2026) : la conversion
   d’un article du Magazine au gabarit, la fusion avec les articles en dur et
   la requête publique (compte Biolystes, statut « publie »). */
import { describe, expect, it, vi } from "vitest";

const appels: unknown[][] = [];
vi.mock("@lystes/integrations/supabase/client", () => {
  const chaine: Record<string, unknown> = {};
  for (const m of ["select", "eq", "order"]) chaine[m] = (...a: unknown[]) => (appels.push([m, ...a]), chaine);
  chaine.limit = async (...a: unknown[]) => {
    appels.push(["limit", ...a]);
    return {
      data: [
        {
          id: "1", slug: "notre-actu", title: "Notre actu", dek: "Le chapeau.", excerpt: "Le chapeau.",
          body: "Premier paragraphe avec **gras**.\n\n## Un intertitre\n\n- un\n- deux",
          hero_image_url: "https://x.supabase.co/storage/v1/object/public/brand-assets/c/magazine/1.jpg",
          hero_image_alt: "Une photo", published_at: "2026-10-20T12:00:00.000Z", seo: { title: "Notre actu" }, status: "publie",
        },
        { id: "2", slug: "sans-photo", title: "Sans photo", body: "Texte.", hero_image_url: null, published_at: "2026-10-21T12:00:00.000Z" },
      ],
      error: null,
    };
  };
  return { supabase: { from: (...a: unknown[]) => (appels.push(["from", ...a]), chaine) } };
});

import { COMPTE_BIOLYSTES, actuDepuisMagazine, chargerActusMagazine, corpsDepuisMarkdown, fusionnerActus } from "@/actus/magazine";
import { articles } from "@/actus/articles";

describe("actus du Magazine", () => {
  it("ramène le markdown aux blocs du gabarit", () => {
    expect(corpsDepuisMarkdown("Un **mot** et [un lien](https://exemple.fr).\n\n## Titre\n\n1. a\n2. b")).toEqual([
      { t: "p", texte: "Un **mot** et un lien." },
      { t: "h2", texte: "Titre" },
      { t: "liste", items: ["a", "b"], numerotee: true },
    ]);
  });

  it("lit les articles publiés du compte Biolystes, et écarte ceux sans photo", async () => {
    const actus = await chargerActusMagazine();
    expect(appels).toContainEqual(["from", "brand_magazine_articles"]);
    expect(appels).toContainEqual(["eq", "account_id", COMPTE_BIOLYSTES]);
    expect(appels).toContainEqual(["eq", "status", "publie"]);
    expect(actus.map((a) => a.slug)).toEqual(["notre-actu"]);
    expect(actus[0]).toMatchObject({
      titre: "Notre actu",
      titreSeo: "Notre actu | Biolystes",
      chapo: "Le chapeau.",
      date: "2026-10-20",
      alt: "Une photo",
      categorie: "Actualité",
    });
    expect(actus[0].corps[0]).toEqual({ t: "p", texte: "Premier paragraphe avec **gras**." });
  });

  it("trie par date avec les articles en dur, sans doublon d’adresse ni de photo", async () => {
    const [neuve] = await chargerActusMagazine();
    const doublon = { ...neuve, slug: articles[0].slug };
    const memePhoto = { ...neuve, slug: "autre", image: articles[1].image };
    const liste = fusionnerActus([neuve, doublon, memePhoto]);
    expect(liste[0].slug).toBe("notre-actu");
    expect(liste).toHaveLength(articles.length + 1);
    expect(liste.filter((a) => a.slug === articles[0].slug)[0]).toBe(articles[0]);
    const dates = liste.map((a) => a.date);
    expect([...dates].sort().reverse()).toEqual(dates);
  });

  it("refuse un article sans texte ou sans date", () => {
    const base = {
      id: "1", slug: "s", title: "T", dek: null, excerpt: null, body: "", hero_image_url: "https://x/p.jpg", hero_image_alt: null,
      published_at: "2026-10-20T12:00:00Z", updated_at: null, read_minutes: 1, signature: null, mention_ia: false, photos: [],
      product_ids: [], faq: [], seo: { title: null, meta_description: null, keywords: [] }, featured: false,
    };
    expect(actuDepuisMagazine(base)).toBeNull();
    expect(actuDepuisMagazine({ ...base, body: "Texte.", published_at: null })).toBeNull();
    expect(actuDepuisMagazine({ ...base, body: "Texte." })?.alt).toBe("T");
  });
});
