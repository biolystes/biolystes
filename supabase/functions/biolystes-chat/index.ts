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
let catalogProducts: ProduitJSON[] | null = null;

function extractPrice(raw: string): string {
  const m = raw.match(/([\d,]+)\s*\$/);
  return m ? m[1].replace(",", ".") + " $" : "sur demande";
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
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
        output += `- Description : ${p.description.replace(/\n/g, " ")}\n`;
      }
      if (p.inci) output += `- INCI (complet) : ${p.inci.replace(/\n/g, " ")}\n`;
      output += `\n`;
    }
  }

  return output;
}

async function loadCatalogProducts(): Promise<ProduitJSON[]> {
  if (catalogProducts) return catalogProducts;

  try {
    const urls = [
      "https://biolystes.lovable.app/data/produits.json",
      "https://biolystes.pro/data/produits.json",
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          const products: ProduitJSON[] = await res.json();
          catalogProducts = products;
          console.log(`Loaded enriched catalog: ${products.length} products from ${url}`);
          return catalogProducts;
        }
      } catch { /* try next */ }
    }
  } catch (e) {
    console.error("Failed to load enriched catalog:", e);
  }

  catalogProducts = []; // Don't retry on failure
  return catalogProducts;
}

async function getEnrichedCatalog(): Promise<string> {
  if (enrichedCatalog !== null) return enrichedCatalog;

  const products = await loadCatalogProducts();
  enrichedCatalog = products.length ? buildEnrichedCatalog(products) : "";
  return enrichedCatalog;
}

function extractAssistantText(content: unknown): string {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          const text = (part as { text?: unknown }).text;
          return typeof text === "string" ? text : "";
        }
        return "";
      })
      .join("");
  }

  return "";
}

function extractProductBlockTitles(content: string): string[] {
  const titles: string[] = [];
  const regex = /:::product[\s\S]*?titre:\s*(.+?)\n[\s\S]*?:::/g;

  for (const match of content.matchAll(regex)) {
    titles.push(match[1].trim());
  }

  return titles;
}

function hasHallucinatedProductBlock(content: string, products: ProduitJSON[]): boolean {
  const allowedTitles = new Set(products.map((product) => normalizeText(product.nom)));
  return extractProductBlockTitles(content).some((title) => !allowedTitles.has(normalizeText(title)));
}

function buildCatalogFallback(userQuestion?: string): string {
  const normalizedQuestion = normalizeText(userQuestion ?? "");
  const intro = /\blevre\b|\blevres\b|\blip\b/.test(normalizedQuestion)
    ? "Concernant les soins des lèvres, je ne vois pas actuellement de référence dédiée dans le catalogue Biolystes que j'ai sous les yeux."
    : "Je préfère être précise : je ne vois pas actuellement de référence dédiée correspondant à votre demande dans le catalogue Biolystes que j'ai sous les yeux.";

  return `${intro}\n\nJe préfère donc ne rien inventer.\n\nJe peux en revanche :\n- vous orienter vers une catégorie réellement disponible du catalogue,\n- vérifier avec vous un autre besoin produit,\n- ou vous inviter à consulter le catalogue complet : https://biolystes.com/catalogue`;
}

function createSseResponse(content: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`));
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const safeMessages = Array.isArray(messages) ? messages : [];
    const latestUserMessage = [...safeMessages]
      .reverse()
      .find(
        (message): message is { role: string; content: string } =>
          !!message &&
          typeof message === "object" &&
          typeof message.role === "string" &&
          typeof message.content === "string" &&
          message.role === "user",
      )?.content ?? "";
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build enriched system prompt
    const catalog = await getEnrichedCatalog();
    const fullSystemPrompt = SYSTEM_PROMPT + catalog;
    const guardrailPrompt = /\blevre\b|\blevres\b|\blip\b/.test(normalizeText(latestUserMessage))
      ? "Alerte catalogue : le catalogue actuel ne contient pas de soin des lèvres dédié. Tu dois le dire clairement et ne citer aucun produit pour les lèvres."
      : "Alerte catalogue : si la demande ne correspond pas clairement à un produit listé dans le catalogue actuel, dis que tu ne vois pas de référence dédiée et n'invente rien. Dans ce cas, n'affiche aucun bloc produit.";

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
          { role: "system", content: guardrailPrompt },
          ...safeMessages,
        ],
        stream: false,
        temperature: 0.2,
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
          JSON.stringify({ error: "Service temporairement en maintenance, veuillez réessayer plus tard." }),
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

    const result = await response.json();
    const assistantContent = extractAssistantText(result?.choices?.[0]?.message?.content).trim();
    const products = await loadCatalogProducts();

    if (!assistantContent || hasHallucinatedProductBlock(assistantContent, products)) {
      if (assistantContent) {
        console.warn("Blocked hallucinated product block in AI response", { latestUserMessage });
      }
      return createSseResponse(buildCatalogFallback(latestUserMessage));
    }

    return createSseResponse(assistantContent);
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
