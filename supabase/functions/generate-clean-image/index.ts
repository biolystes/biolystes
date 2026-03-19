import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const admin =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const normalizeProductName = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

function base64ToBytes(dataUri: string): { bytes: Uint8Array; mimeType: string } {
  const match = dataUri.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) throw new Error("Invalid data URI");
  const mimeType = match[1];
  const raw = atob(match[2]);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return { bytes, mimeType };
}

async function uploadToStorage(imageData: string, productNameNormalized: string): Promise<string> {
  if (!admin) throw new Error("Supabase client not configured");

  let bytes: Uint8Array;
  let ext = "png";
  let contentType = "image/png";

  if (imageData.startsWith("data:")) {
    const result = base64ToBytes(imageData);
    bytes = result.bytes;
    contentType = result.mimeType;
    ext = result.mimeType.split("/")[1] || "png";
  } else if (imageData.startsWith("http")) {
    const resp = await fetch(imageData);
    if (!resp.ok) throw new Error(`Failed to fetch image: ${resp.status}`);
    const ct = resp.headers.get("content-type") || "image/png";
    contentType = ct;
    ext = ct.split("/")[1]?.split(";")[0] || "png";
    bytes = new Uint8Array(await resp.arrayBuffer());
  } else {
    throw new Error("Unknown image format");
  }

  const filePath = `clean/${productNameNormalized}.${ext}`;

  const { error: uploadError } = await admin.storage
    .from("product-images")
    .upload(filePath, bytes, {
      contentType,
      upsert: true,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data: urlData } = admin.storage.from("product-images").getPublicUrl(filePath);
  return urlData.publicUrl;
}

async function callLovableAI(payload: Record<string, unknown>) {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new HttpError(500, "LOVABLE_API_KEY is not configured");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new HttpError(429, "Trop de requêtes, réessayez dans quelques instants.");
    }
    if (response.status === 402) {
      throw new HttpError(402, "Crédits AI insuffisants.");
    }
    const t = await response.text();
    console.error("AI gateway error:", response.status, t);
    throw new HttpError(500, "Erreur lors de la génération");
  }

  return response.json();
}

function extractAssistantText(content: unknown): string {
  if (typeof content === "string") return content;

  if (Array.isArray(content)) {
    return content
      .map((part: any) => {
        if (typeof part === "string") return part;
        if (part && typeof part.text === "string") return part.text;
        return "";
      })
      .join("\n");
  }

  return "";
}

function safeParseJson(raw: string): any | null {
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

async function generateCleanCandidate(imageUrl: string): Promise<string> {
  const data: any = await callLovableAI({
    model: "google/gemini-3.1-flash-image-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Edit this exact cosmetic product image with one single operation: remove all visible written text (letters/words/brand names/product names) from packaging labels.

Hard constraints (must follow strictly):
- Preserve the exact composition and geometry.
- Keep the same number of items/products as in the original image.
- Keep every item in the exact same position, size, orientation, perspective, and spacing.
- Keep the exact same box shape, bottle/tube/jar shapes, materials, lighting, shadows, reflections, and background.
- Do NOT redesign, simplify, replace, merge, or remove any product item.
- Only erase typography and naturally inpaint the removed text regions with matching surrounding texture/color.

This is text removal only, not product generation.`,
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    modalities: ["image", "text"],
  });

  // Log full response structure for debugging
  const choice = data?.choices?.[0]?.message;
  console.log("AI response keys:", JSON.stringify({
    hasImages: !!choice?.images,
    imagesLength: choice?.images?.length,
    contentType: typeof choice?.content,
    contentIsArray: Array.isArray(choice?.content),
    contentLength: Array.isArray(choice?.content) ? choice.content.length : 0,
  }));

  // Try multiple extraction paths
  let generatedImage: string | null = null;

  // Path 1: images array (standard)
  generatedImage = choice?.images?.[0]?.image_url?.url ?? null;

  // Path 2: content array with image_url parts
  if (!generatedImage && Array.isArray(choice?.content)) {
    for (const part of choice.content) {
      if (part?.type === "image_url" && part?.image_url?.url) {
        generatedImage = part.image_url.url;
        break;
      }
      if (part?.image_url?.url) {
        generatedImage = part.image_url.url;
        break;
      }
    }
  }

  // Path 3: inline_data in content parts
  if (!generatedImage && Array.isArray(choice?.content)) {
    for (const part of choice.content) {
      if (part?.inline_data?.data && part?.inline_data?.mime_type) {
        generatedImage = `data:${part.inline_data.mime_type};base64,${part.inline_data.data}`;
        break;
      }
    }
  }

  if (!generatedImage) {
    console.error("No image found in AI response. Full choice:", JSON.stringify(choice).slice(0, 500));
    throw new HttpError(500, "Aucune image générée");
  }

  return generatedImage;
}

async function countItems(imageUrl: string): Promise<number | null> {
  try {
    const data: any = await callLovableAI({
      model: "google/gemini-3-flash-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Count the total number of distinct physical product items visible in this cosmetic product photo. Include boxes, bottles, tubes, jars, pumps — every separate object. Return ONLY a JSON object: {"count": <number>}`,
            },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    });

    const raw = extractAssistantText(data?.choices?.[0]?.message?.content);
    const parsed = safeParseJson(raw);
    const count = Number(parsed?.count);
    return Number.isFinite(count) ? Math.round(count) : null;
  } catch (e) {
    console.warn("countItems failed:", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageUrl, productName } = await req.json();
    if (!imageUrl) throw new HttpError(400, "imageUrl is required");
    if (!productName) throw new HttpError(400, "productName is required");
    if (!admin) throw new HttpError(500, "Supabase service client is not configured");

    const MAX_ATTEMPTS = 1;
    let generatedImage: string | null = null;
    let lastRejectReason = "";

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      const candidate = await generateCleanCandidate(imageUrl);
      const validation = await validateCompositionIntegrity(imageUrl, candidate);

      if (validation.ok) {
        generatedImage = candidate;
        break;
      }

      lastRejectReason = validation.reason;
      console.warn(`generate-clean-image attempt ${attempt} rejected:`, validation.reason);
    }

    if (!generatedImage) {
      return new Response(
        JSON.stringify({
          error:
            "Image rejetée automatiquement: la composition du boîtier a été modifiée au lieu d'enlever uniquement le texte. " +
            (lastRejectReason ? `Détail: ${lastRejectReason}` : "Réessayez."),
        }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const product_name_normalized = normalizeProductName(productName);
    const publicUrl = await uploadToStorage(generatedImage, product_name_normalized);

    const { error: persistError } = await admin.from("product_clean_images").upsert(
      {
        product_name: productName,
        product_name_normalized,
        clean_image_url: publicUrl,
      },
      { onConflict: "product_name_normalized" }
    );

    if (persistError) {
      console.error("persist clean image error:", persistError);
      return new Response(JSON.stringify({ error: "Image générée mais non sauvegardée" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ imageUrl: publicUrl, saved: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-clean-image error:", e);

    if (e instanceof HttpError) {
      return new Response(JSON.stringify({ error: e.message }), {
        status: e.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
