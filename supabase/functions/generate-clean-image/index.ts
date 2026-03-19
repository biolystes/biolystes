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

const normalizeProductName = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");

// Convert base64 data URI to Uint8Array
function base64ToBytes(dataUri: string): { bytes: Uint8Array; mimeType: string } {
  const match = dataUri.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!match) throw new Error("Invalid data URI");
  const mimeType = match[1];
  const raw = atob(match[2]);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return { bytes, mimeType };
}

// Upload image to storage bucket and return public URL
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
    // It's already a URL, download it first
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

  const { data: urlData } = admin.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageUrl, productName } = await req.json();
    if (!imageUrl) throw new Error("imageUrl is required");
    if (!productName) throw new Error("productName is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
    if (!admin) throw new Error("Supabase service client is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-pro-image-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Look at this cosmetic product photo carefully. I need you to produce an IDENTICAL copy of this exact image with ONE change only: erase/remove ALL visible text, letters, words, and written characters from the product packaging, labels, and surfaces. This includes brand names, product names, ingredient lists, "Your Brand Here", and any other typography.

CRITICAL RULES:
- The product packaging (box, bottle, tube, jar) must remain EXACTLY as it is — same shape, same colors, same materials, same angles, same lighting, same shadows, same reflections.
- If the product is a SET or COLLECTION of multiple items in a box, keep ALL items visible in their exact positions. Do NOT merge them into a single product.
- Where text was removed, fill the area naturally with the surrounding packaging color/texture/pattern — as if the text was never there.
- Do NOT change the background, composition, camera angle, lighting, or any visual element other than the text.
- Do NOT reimagine, redesign, or reinterpret the product. This is a text-removal task, NOT a product redesign.
- The output image should be virtually indistinguishable from the input except that all text is gone.`,
              },
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
            ],
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans quelques instants." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits AI insuffisants." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erreur lors de la génération" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImage) {
      return new Response(JSON.stringify({ error: "Aucune image générée" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const product_name_normalized = normalizeProductName(productName);

    // Upload to storage instead of storing base64 in DB
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
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
