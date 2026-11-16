import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseAnon, siteBaseUrl } from "../supabase";

interface StoredProduct {
  id: number;
  name: string;
  image?: string;
  permalink?: string;
  categories?: string[];
}

export default defineTool({
  name: "get_product_selection",
  title: "Lire une sélection de produits",
  description:
    "Récupère le contenu d'une sélection Biolystes à partir de son identifiant (la fin du lien /selection/<id>).",
  inputSchema: {
    id: z.string().trim().uuid().describe("Identifiant UUID de la sélection."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ id }) => {
    const supabase = supabaseAnon();
    const { data, error } = await supabase.rpc("get_product_selection", { _id: id }).single<{ id: string; title: string; products: unknown; created_at: string }>();
    if (error || !data) {
      throw new ToolError("Sélection introuvable");
    }
    const products = ((data.products as unknown as StoredProduct[]) ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image ?? "",
      permalink: p.permalink ?? "",
      categories: p.categories ?? [],
    }));
    return {
      content: [{ type: "text", text: `${data.title} — ${products.length} produit(s)` }],
      structuredContent: {
        selection: {
          id: data.id,
          title: data.title,
          url: `${siteBaseUrl()}/selection/${data.id}`,
          createdAt: data.created_at,
          products,
        },
      },
    };
  },
});
