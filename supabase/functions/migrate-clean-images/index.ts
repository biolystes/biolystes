import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode as decodeBase64 } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Get ONE base64 image - only id + normalized name first (lightweight)
    const { data: meta, error: metaErr } = await admin
      .from("product_clean_images")
      .select("id, product_name_normalized")
      .like("clean_image_url", "data:%")
      .limit(1)
      .maybeSingle();

    if (metaErr) throw metaErr;
    if (!meta) {
      return new Response(JSON.stringify({ done: true, remaining: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Now fetch only this row's image via raw SQL to avoid ORM overhead
    const { data: imgRow, error: imgErr } = await admin.rpc("get_clean_image_base64", { row_id: meta.id });

    if (imgErr || !imgRow) {
      // Fallback: fetch via normal query
      const { data: fallback } = await admin
        .from("product_clean_images")
        .select("clean_image_url")
        .eq("id", meta.id)
        .single();

      if (!fallback) throw new Error("Cannot fetch image data");

      const b64 = fallback.clean_image_url;
      const commaIdx = b64.indexOf(",");
      if (commaIdx === -1) throw new Error("Invalid base64");

      const header = b64.substring(0, commaIdx);
      const mimeMatch = header.match(/data:(image\/[^;]+)/);
      const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
      const ext = mimeType === "image/jpeg" ? "jpg" : "png";

      const rawB64 = b64.substring(commaIdx + 1);
      const bytes = decodeBase64(rawB64);
      const filePath = `clean/${meta.product_name_normalized}.${ext}`;

      const { error: upErr } = await admin.storage
        .from("product-images")
        .upload(filePath, bytes, { contentType: mimeType, upsert: true });

      if (upErr) throw new Error(`Upload: ${upErr.message}`);

      const { data: urlData } = admin.storage.from("product-images").getPublicUrl(filePath);

      await admin.from("product_clean_images")
        .update({ clean_image_url: urlData.publicUrl })
        .eq("id", meta.id);

      const { count } = await admin.from("product_clean_images")
        .select("id", { count: "exact", head: true })
        .like("clean_image_url", "data:%");

      return new Response(JSON.stringify({
        migrated: meta.product_name_normalized,
        url: urlData.publicUrl,
        remaining: count || 0,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "RPC not found, used fallback" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Migration error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
