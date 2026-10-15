import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon, siteBaseUrl } from "../supabase";

const productSchema = z.object({
  id: z.number().int().describe("Identifiant produit du catalogue."),
  name: z.string().trim().min(1).describe("Nom du produit."),
  image: z.string().trim().optional().describe("URL de l'image produit."),
  permalink: z.string().trim().optional().describe("Lien produit d'origine."),
  categories: z.array(z.string()).optional().describe("Catégories du produit."),
});

export default defineTool({
  name: "create_product_selection",
  title: "Créer un lien de sélection de produits",
  description:
    "Crée une sélection de produits Biolystes et renvoie le lien public de partage (https://biolystes.com/selection/<id>). Aucun prix n'est exposé.",
  inputSchema: {
    title: z.string().trim().min(1).max(120).describe("Titre de la sélection, ex. « Sélection pour Aurélia »."),
    products: z.array(productSchema).min(1).max(50).describe("Produits de la sélection."),
  },
  annotations: { readOnlyHint: false, idempotentHint: false, openWorldHint: false },
  handler: async ({ title, products }) => {
    const supabase = supabaseAnon();
    // Jamais de prix stocké ni affiché : règle « aucun prix en ligne ».
    const rows = products.map((p) => ({
      id: p.id,
      name: p.name,
      price: "",
      image: p.image ?? "",
      permalink: p.permalink ?? "",
      categories: p.categories ?? [],
    }));
    const { data, error } = await supabase
      .from("product_selections")
      .insert({ title, products: rows })
      .select("id, title, created_at")
      .single();
    if (error || !data) {
      throw new ToolError(error?.message ?? "Insertion de la sélection impossible");
    }
    const url = `${siteBaseUrl()}/selection/${data.id}`;
    return {
      content: [{ type: "text", text: `Sélection créée : ${url}` }],
      structuredContent: {
        selection: {
          id: data.id,
          title: data.title,
          url,
          productCount: rows.length,
          createdAt: data.created_at,
        },
      },
    };
  },
});
