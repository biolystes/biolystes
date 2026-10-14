/* Les actus écrites dans le back-office de lystes.ai (14/10/2026).

   JP : « comment mettre des actus avec photos, comme celle de HR & Associés,
   dans le back-office ». JP, Ferdaousse ou Anaïs écrivent l’article dans le
   Magazine du compte Biolystes sur lystes.ai (bouton « Écrire un article ») ;
   une fois publié, il apparaît ici, sur /blog et sur /blog/<adresse>, au
   gabarit des articles de src/actus/articles.ts.

   Même lecture publique que le Magazine de lystes.ai (lystes/src/features/
   magazine/lib/api-marque.ts) : mêmes colonnes, compte de la marque, statut
   « publie », base lystes.ai figée (lystes/src/integrations/supabase). Le
   texte est le markdown du Magazine (intertitres « ## », paragraphes,
   listes, **gras**), ramené aux blocs du gabarit.

   Un article sans photo de une n’est pas affiché (une photo par article),
   et une adresse déjà prise par un article de articles.ts reste à celui-ci.
   Si la lecture échoue, /blog garde ses articles en dur : la page ne casse
   jamais. */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lystes/integrations/supabase/client";
import { COLONNES_ARTICLE_PUBLIC, depuisArticleMarque, type ArticleMarque } from "@lystes/features/magazine/lib/api-marque";
import { blocsDe, type Morceau } from "../../lystes/supabase/functions/_shared/article-marque-rendu";
import { articles as articlesEnDur, type Article, type Bloc } from "./articles";

/** Le compte Business Biolystes sur lystes.ai. */
export const COMPTE_BIOLYSTES = "727692bd-5feb-4049-ad06-2902a5d5dd23";

/** Nombre d’actus lues dans le Magazine. */
const LIMITE = 60;

const APPEL = "Parlons de votre projet de marque cosmétique.";

/** Les morceaux d’une ligne, en texte : le gras reste, les liens gardent leur texte. */
function enTexte(morceaux: Morceau[]): string {
  return morceaux
    .map((m) => (m.t === "texte" ? m.v : m.t === "gras" ? `**${enTexte(m.v)}**` : enTexte(m.v)))
    .join("");
}

/** Le markdown du Magazine, en blocs du gabarit. */
export function corpsDepuisMarkdown(markdown: string): Bloc[] {
  return blocsDe(markdown).map((b): Bloc => {
    if (b.t === "titre") return { t: "h2", texte: enTexte(b.v) };
    if (b.t === "liste") return { t: "liste", items: b.items.map(enTexte), numerotee: b.ordonnee };
    return { t: "p", texte: enTexte(b.v) };
  });
}

/** Un article du Magazine, au format des actus. null s’il ne peut pas être affiché. */
export function actuDepuisMagazine(a: ArticleMarque): Article | null {
  const date = a.published_at?.slice(0, 10);
  if (!a.slug || !a.title.trim() || !a.hero_image_url || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const corps = corpsDepuisMarkdown(a.body);
  if (!corps.length) return null;
  const chapo = a.dek ?? a.excerpt ?? "";
  const titreSeo = a.seo.title ?? a.title;
  return {
    slug: a.slug,
    titre: a.title.trim(),
    titreSeo: /biolystes/i.test(titreSeo) ? titreSeo : `${titreSeo} | Biolystes`,
    description: a.seo.meta_description ?? a.excerpt ?? chapo,
    chapo,
    categorie: "Actualité",
    date,
    image: a.hero_image_url,
    alt: a.hero_image_alt ?? a.title,
    appel: APPEL,
    corps,
  };
}

/** Les actus du Magazine et celles de articles.ts, du plus récent au plus ancien.
 *  À date égale, l’article du Magazine (le plus récent écrit) passe devant. */
export function fusionnerActus(magazine: Article[], enDur: Article[] = articlesEnDur): Article[] {
  const prises = new Set(enDur.map((a) => a.slug));
  const photos = new Set(enDur.map((a) => a.image));
  const neuves: Article[] = [];
  for (const a of magazine) {
    if (prises.has(a.slug) || photos.has(a.image)) continue;
    prises.add(a.slug);
    photos.add(a.image);
    neuves.push(a);
  }
  return [...neuves, ...enDur].sort((x, y) => (x.date < y.date ? 1 : x.date > y.date ? -1 : 0));
}

export async function chargerActusMagazine(): Promise<Article[]> {
  const { data, error } = await supabase
    .from("brand_magazine_articles")
    .select(COLONNES_ARTICLE_PUBLIC)
    .eq("account_id", COMPTE_BIOLYSTES)
    .eq("status", "publie")
    .order("published_at", { ascending: false })
    .limit(LIMITE);
  if (error) throw error;
  return ((data ?? []) as unknown as Record<string, unknown>[])
    .map(depuisArticleMarque)
    .map(actuDepuisMagazine)
    .filter((a): a is Article => !!a);
}

/** Toutes les actus affichées. `pret` : la lecture du Magazine est finie (réussie ou non). */
export function useActus(): { actus: Article[]; pret: boolean } {
  const q = useQuery({
    queryKey: ["actus-magazine-biolystes"],
    queryFn: chargerActusMagazine,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  return { actus: fusionnerActus(q.data ?? []), pret: !q.isLoading };
}
