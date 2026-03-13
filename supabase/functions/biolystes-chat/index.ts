import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SYSTEM_PROMPT } from "./system-prompt.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── Enriched product catalog (loaded once) ──────────────
interface ProduitJSON {
  nom: string;
  slug: string;
  categorie: string;
  volume: string;
  prix: string;
  certifications: string;
  ingredients_fr: string;
  star_features: string;
  description: string;
  inci: string;
  arôme: string;
  url: string;
}

let enrichedCatalog: string | null = null;

function extractPrice(raw: string): string {
  const m = raw.match(/([\d,]+)\s*\$/);
  return m ? m[1].replace(",", ".") + " $" : "sur demande";
}

function buildEnrichedCatalog(products: ProduitJSON[]): string {
  const byCategory: Record<string, ProduitJSON[]> = {};
  for (const p of products) {
    const cat = p.categorie || "autre";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(p);
  }

  const categoryLabels: Record<string, string> = {
    "soins-du-corps": "🧴 SOINS DU CORPS",
    "soins-capillaires": "💇 SOINS CAPILLAIRES",
    "soins-du-visage": "🌸 SOINS DU VISAGE",
    "soins-pour-hommes": "👨 SOINS POUR HOMMES",
    "hygiene-bucco-dentaire": "🪥 HYGIÈNE BUCCO-DENTAIRE",
    "coffrets-cadeaux": "🎁 COFFRETS CADEAUX",
    "aromatherapie": "🌿 AROMATHÉRAPIE",
    "protection-solaire": "☀️ PROTECTION SOLAIRE",
  };

  let output = `\n\n## CATALOGUE PRODUITS ENRICHI (données complètes)\n`;
  output += `**⚠️ UTILISE CES FICHES ENRICHIES pour donner des réponses détaillées, précises et expertes sur chaque produit.**\n\n`;

  for (const [cat, prods] of Object.entries(byCategory)) {
    output += `### ${categoryLabels[cat] || cat.toUpperCase()}\n\n`;
    for (const p of prods) {
      const price = extractPrice(p.prix);
      
      output += `**${p.nom}** — ${p.volume} — Prix unitaire HT : ${price}\n`;
      output += `- Slug URL : ${p.slug}\n`;
      if (p.certifications) output += `- Certifications : ${p.certifications}\n`;
      output += `- Ingrédients clés : ${p.ingredients_fr}\n`;
      output += `- Points forts : ${p.star_features}\n`;
      if (p.arôme) output += `- Arôme/Parfum : ${p.arôme}\n`;
      if (p.description) {
        output += `- Description complète : ${p.description.replace(/\n/g, " ")}\n`;
      }
      if (p.inci) {
        output += `- INCI complet : ${p.inci.replace(/\n/g, " ")}\n`;
      }
      output += `\n`;
    }
  }

  return output;
}

async function getEnrichedCatalog(): Promise<string> {
  if (enrichedCatalog) return enrichedCatalog;

  try {
    // Fetch from the app's public data
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
    // produits.json is hosted on the frontend, fetch from known URL
    const urls = [
      "https://biolystes.lovable.app/data/produits.json",
      "https://biolystes.pro/data/produits.json",
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          const products: ProduitJSON[] = await res.json();
          enrichedCatalog = buildEnrichedCatalog(products);
          console.log(`Loaded enriched catalog: ${products.length} products from ${url}`);
          return enrichedCatalog;
        }
      } catch { /* try next */ }
    }
  } catch (e) {
    console.error("Failed to load enriched catalog:", e);
  }

  enrichedCatalog = ""; // Don't retry on failure
  return enrichedCatalog;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build enriched system prompt
    const catalog = await getEnrichedCatalog();
    const fullSystemPrompt = SYSTEM_PROMPT + catalog;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: fullSystemPrompt },
          ...messages,
        ],
        stream: true,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de requêtes, veuillez réessayer dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédit IA épuisé, veuillez recharger votre compte." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(
        JSON.stringify({ error: "Erreur du service IA, veuillez réessayer." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
