import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lystes/integrations/supabase/client";

/**
 * LES PRODUITS QUE LA BOUTIQUE SAIT DÉJÀ PERTINENTS.
 *
 * 15/09/2026 (JP) : « dans le choix des produits, il faut une rubrique qui
 * remonte les produits jugés pertinents et les raisons pour lesquelles ils
 * sont jugés pertinents ».
 *
 * Tout est MESURÉ, rien n'est deviné : essayages (avec mise au panier et
 * achat), conversations clientes par produit, ventes des douze derniers mois.
 * Un produit sans le moindre signal n'apparaît pas — un classement inventé
 * serait pire qu'une rubrique absente.
 *
 * Le rapprochement se fait par NOM normalisé : les analyses de conversation ne
 * portent aucun `product_id` (vérifié sur Dream Virgin Hair : 385 fiches, 0
 * `product_id`) et les lignes de commande ne portent qu'un libellé.
 */

export function cleProduit(nom: string): string {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export interface ProduitPertinent {
  id: string;
  name: string;
  image_url: string | null;
  price?: number | null;
  score: number;
  raisons: string[];
}

interface LigneProduit {
  id: string;
  name: string;
  image_url: string | null;
  price: number | null;
  stock_status: string | null;
  average_rating: number | null;
  review_count: number | null;
}

function lireLignesCommande(brut: unknown): { nom: string; quantite: number }[] {
  if (!Array.isArray(brut)) return [];
  return brut.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const ligne = item as Record<string, unknown>;
    const nom = [ligne.name, ligne.title, ligne.product_name].find(
      (valeur) => typeof valeur === "string" && valeur.trim().length > 0,
    ) as string | undefined;
    if (!nom) return [];
    const brute = Number(ligne.quantity ?? ligne.qty ?? 1);
    return [{ nom: nom.trim(), quantite: Number.isFinite(brute) && brute > 0 ? brute : 1 }];
  });
}

export function useProduitsPertinents(compteId?: string | null, actif = true) {
  return useQuery({
    queryKey: ["produits-pertinents", compteId],
    enabled: !!compteId && actif,
    staleTime: 10 * 60 * 1000,
    queryFn: async (): Promise<ProduitPertinent[]> => {
      const depuis = new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString();

      const [produits, essais, essaisGeneriques, questions, commandes] = await Promise.all([
        supabase
          .from("products")
          .select("id, name, image_url, price, stock_status, average_rating, review_count")
          .eq("account_id", compteId!)
          .not("image_url", "is", null)
          .limit(2000),
        supabase
          .from("wig_tryon_sessions")
          .select("product_id, product_name, added_to_cart, purchased")
          .eq("account_id", compteId!)
          .limit(5000),
        supabase
          .from("tryon_sessions")
          .select("product_name")
          .eq("account_id", compteId!)
          .limit(2000),
        supabase
          .from("product_conversation_insights")
          .select("product_name, total_conversations")
          .eq("account_id", compteId!)
          .limit(500),
        supabase
          .from("ecommerce_orders")
          .select("line_items")
          .eq("account_id", compteId!)
          .gte("order_date", depuis)
          .order("order_date", { ascending: false })
          .limit(800),
      ]);

      if (produits.error) throw produits.error;

      const catalogue = (produits.data ?? []) as LigneProduit[];
      if (!catalogue.length) return [];

      const parId = new Map(catalogue.map((produit) => [produit.id, produit]));
      /* Deux fiches peuvent porter le même nom : la première gagne, et le
         signal n'est jamais compté deux fois. */
      const parNom = new Map<string, LigneProduit>();
      for (const produit of catalogue) {
        const cle = cleProduit(produit.name ?? "");
        if (cle && !parNom.has(cle)) parNom.set(cle, produit);
      }

      const vide = () => ({ essais: 0, paniers: 0, achats: 0, questions: 0, ventes: 0 });
      const signaux = new Map<string, ReturnType<typeof vide>>();
      const pour = (id: string) => {
        const existant = signaux.get(id);
        if (existant) return existant;
        const neuf = vide();
        signaux.set(id, neuf);
        return neuf;
      };
      const parLibelle = (libelle: string | null | undefined) => {
        const cle = cleProduit(libelle ?? "");
        const produit = cle ? parNom.get(cle) : undefined;
        return produit ? pour(produit.id) : null;
      };

      for (const essai of essais.data ?? []) {
        const produit = essai.product_id && parId.has(essai.product_id)
          ? pour(essai.product_id)
          : parLibelle(essai.product_name);
        if (!produit) continue;
        produit.essais += 1;
        if (essai.added_to_cart) produit.paniers += 1;
        if (essai.purchased) produit.achats += 1;
      }

      for (const essai of essaisGeneriques.data ?? []) {
        const produit = parLibelle(essai.product_name);
        if (produit) produit.essais += 1;
      }

      for (const analyse of questions.data ?? []) {
        const total = Number(analyse.total_conversations ?? 0);
        if (total <= 0) continue;
        const produit = parLibelle(analyse.product_name);
        if (produit) produit.questions += total;
      }

      for (const commande of commandes.data ?? []) {
        for (const ligne of lireLignesCommande(commande.line_items)) {
          const produit = parLibelle(ligne.nom);
          if (produit) produit.ventes += ligne.quantite;
        }
      }

      const classement: ProduitPertinent[] = [];
      for (const [id, signal] of signaux.entries()) {
        const produit = parId.get(id);
        if (!produit) continue;
        /* Une rupture de stock ne se met pas en vedette : on n'ouvre pas une
           semaine de publications sur un produit qu'on ne peut pas vendre. */
        if ((produit.stock_status ?? "").toUpperCase() === "OUT_OF_STOCK") continue;

        const interet = signal.essais + signal.questions;
        const aRemettre = interet >= 20 && signal.ventes <= 2;
        const score =
          signal.essais * 3 +
          signal.paniers * 8 +
          signal.achats * 15 +
          signal.questions * 4 +
          signal.ventes * 5 +
          (aRemettre ? 25 : 0);
        if (score <= 0) continue;

        const raisons: string[] = [];
        if (signal.essais) {
          raisons.push(
            signal.paniers
              ? `${signal.essais} essayages, ${signal.paniers} mise${signal.paniers > 1 ? "s" : ""} au panier`
              : `${signal.essais} essayage${signal.essais > 1 ? "s" : ""}`,
          );
        }
        if (signal.achats) raisons.push(`${signal.achats} achat${signal.achats > 1 ? "s" : ""} après essayage`);
        if (signal.questions)
          raisons.push(`${signal.questions} cliente${signal.questions > 1 ? "s ont" : " a"} posé des questions dessus`);
        if (signal.ventes) raisons.push(`${Math.round(signal.ventes)} vente${signal.ventes > 1 ? "s" : ""} sur 12 mois`);
        if (aRemettre) raisons.push("Très regardé, peu vendu : à remettre en avant");
        if (produit.average_rating && (produit.review_count ?? 0) > 0)
          raisons.push(
            `Note ${Number(produit.average_rating).toFixed(1).replace(".", ",")} sur ${produit.review_count} avis`,
          );

        classement.push({
          id: produit.id,
          name: produit.name,
          image_url: produit.image_url,
          price: produit.price,
          score,
          raisons,
        });
      }

      return classement.sort((a, b) => b.score - a.score).slice(0, 10);
    },
  });
}
