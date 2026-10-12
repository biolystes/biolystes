import { useQuery } from "@tanstack/react-query";
import { supabase } from "@lystes/integrations/supabase/client";

/**
 * LES CHIFFRES RÉELS DERRIÈRE LE CONTEXTE.
 *
 * 14/09/2026 (JP) : « qui sont les clients, quels produits sont les plus
 * sollicités, lesquels se vendent, lesquels mériteraient d'être mis en
 * avant ». Tout est calculé à partir des commandes, des conversations et des
 * essayages de la boutique. Rien n'est inventé : une source vide s'affiche
 * vide, avec le lien pour la remplir.
 */

export interface Part {
  libelle: string;
  valeur: number;
}

export interface StatsClientele {
  nbCommandes: number;
  chiffreAffaires: number;
  panierMoyen: number;
  pays: Part[];
  genres: Part[];
  genreSource: "portraits" | "aucune";
  ageSource: string | null;
  topVentes: Part[];
  sollicitations: Part[];
  essayages: Part[];
  aMettreEnAvant: { libelle: string; questions: number; ventes: number }[];
  portraits: {
    id: string;
    avatar_name: string;
    avatar_description: string | null;
    gender: string | null;
    age_range: string | null;
    sample_size: number | null;
    average_order_value: number | null;
    top_countries: string[] | null;
    main_concerns: string[] | null;
    pain_points: string[] | null;
  }[];
}

type LigneCommande = { nom: string; quantite: number };

function lireLignes(brut: unknown): LigneCommande[] {
  if (!Array.isArray(brut)) return [];
  return brut.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const ligne = item as Record<string, unknown>;
    const nom = [ligne.name, ligne.title, ligne.product_name]
      .find((v) => typeof v === "string" && v.trim().length > 0) as string | undefined;
    if (!nom) return [];
    const brute = Number(ligne.quantity ?? ligne.qty ?? 1);
    return [{ nom: nom.trim(), quantite: Number.isFinite(brute) && brute > 0 ? brute : 1 }];
  });
}

function classer(compteur: Map<string, number>, limite: number): Part[] {
  return [...compteur.entries()]
    .map(([libelle, valeur]) => ({ libelle, valeur }))
    .sort((a, b) => b.valeur - a.valeur)
    .slice(0, limite);
}

const GENRE_LISIBLE: Record<string, string> = {
  female: "Femmes",
  male: "Hommes",
  mixed: "Mixte",
  unisex: "Mixte",
};

export function useStatsClientele(compteId?: string | null, actif = true) {
  return useQuery({
    queryKey: ["stats-clientele-contexte", compteId],
    enabled: !!compteId && actif,
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<StatsClientele> => {
      const depuis = new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString();

      const [commandes, portraits, analyses, essais] = await Promise.all([
        supabase
          .from("ecommerce_orders")
          .select("total, line_items, billing_country, shipping_country, order_date")
          .eq("account_id", compteId!)
          .gte("order_date", depuis)
          .order("order_date", { ascending: false })
          .limit(800),
        supabase
          .from("customer_avatars")
          .select(
            "id, avatar_name, avatar_description, gender, age_range, sample_size, average_order_value, top_countries, main_concerns, pain_points",
          )
          .eq("account_id", compteId!)
          .eq("is_active", true)
          .order("sample_size", { ascending: false, nullsFirst: false }),
        supabase
          .from("product_conversation_insights")
          .select("product_name, total_conversations")
          .eq("account_id", compteId!)
          .order("total_conversations", { ascending: false })
          .limit(200),
        supabase
          .from("tryon_sessions")
          .select("product_name")
          .eq("account_id", compteId!)
          .limit(1000),
      ]);

      if (commandes.error) throw commandes.error;
      if (portraits.error) throw portraits.error;
      if (analyses.error) throw analyses.error;

      const lignesCommandes = commandes.data ?? [];
      const chiffreAffaires = lignesCommandes.reduce((somme, c) => somme + Number(c.total ?? 0), 0);
      const nbCommandes = lignesCommandes.length;

      const compteurPays = new Map<string, number>();
      const compteurVentes = new Map<string, number>();
      for (const commande of lignesCommandes) {
        const pays = (commande.billing_country || commande.shipping_country || "").trim();
        if (pays) compteurPays.set(pays, (compteurPays.get(pays) ?? 0) + 1);
        for (const ligne of lireLignes(commande.line_items)) {
          compteurVentes.set(ligne.nom, (compteurVentes.get(ligne.nom) ?? 0) + ligne.quantite);
        }
      }

      const compteurEssais = new Map<string, number>();
      for (const essai of essais.data ?? []) {
        const nom = (essai.product_name ?? "").trim();
        if (nom) compteurEssais.set(nom, (compteurEssais.get(nom) ?? 0) + 1);
      }

      /* Une même fiche peut être analysée sur plusieurs périodes : on
         additionne par nom de produit pour ne pas afficher deux fois la
         même ligne. */
      const compteurQuestions = new Map<string, number>();
      for (const analyse of analyses.data ?? []) {
        const nom = (analyse.product_name ?? "").trim();
        const total = Number(analyse.total_conversations ?? 0);
        if (!nom || total <= 0) continue;
        compteurQuestions.set(nom, (compteurQuestions.get(nom) ?? 0) + total);
      }
      /* 14/09 : `classer` trie déjà par libellé unique, mais la casse et les
         espaces faisaient réapparaître deux fois le même produit dans « à
         mettre en avant ». On replie donc sur une clé normalisée. */
      const parCleNormalisee = new Map<string, { libelle: string; valeur: number }>();
      for (const [libelle, valeur] of compteurQuestions.entries()) {
        const cle = libelle.toLowerCase().replace(/\s+/g, " ").trim();
        const existant = parCleNormalisee.get(cle);
        if (existant) existant.valeur += valeur;
        else parCleNormalisee.set(cle, { libelle, valeur });
      }
      const sollicitations = [...parCleNormalisee.values()]
        .sort((a, b) => b.valeur - a.valeur)
        .slice(0, 50);

      const topVentes = classer(compteurVentes, 8);
      const vendus = new Map(topVentes.map((v) => [v.libelle.toLowerCase(), v.valeur]));

      /* Très demandé en conversation, absent du haut des ventes : c'est là
         que la mise en avant a le plus d'effet. */
      const aMettreEnAvant = sollicitations
        .filter((s) => !vendus.has(s.libelle.toLowerCase()))
        .slice(0, 6)
        .map((s) => ({
          libelle: s.libelle,
          questions: s.valeur,
          ventes: compteurVentes.get(s.libelle) ?? 0,
        }));

      const compteurGenres = new Map<string, number>();
      for (const portrait of portraits.data ?? []) {
        if (!portrait.gender) continue;
        const libelle = GENRE_LISIBLE[portrait.gender] ?? portrait.gender;
        compteurGenres.set(libelle, (compteurGenres.get(libelle) ?? 0) + Number(portrait.sample_size ?? 1));
      }

      return {
        nbCommandes,
        chiffreAffaires,
        panierMoyen: nbCommandes ? chiffreAffaires / nbCommandes : 0,
        pays: classer(compteurPays, 6),
        genres: classer(compteurGenres, 3),
        genreSource: compteurGenres.size ? "portraits" : "aucune",
        ageSource: portraits.data?.[0]?.age_range ?? null,
        topVentes,
        sollicitations: sollicitations.slice(0, 8),
        essayages: classer(compteurEssais, 6),
        aMettreEnAvant,
        portraits: portraits.data ?? [],
      };
    },
  });
}
