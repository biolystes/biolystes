import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Get ONE base64 image at a time
    const { data: row, error } = await admin
      .from("product_clean_images")
      .select("id, product_name, product_name_normalized, clean_image_url")
      .like("clean_image_url", "data:%")
      .limit(1)
      .single();

    if (error || !row) {
      // Check remaining count
      const { count } = await admin
        .from("product_clean_images")
        .select("id", { count: "exact", head: true })
        .like("clean_image_url", "data:%");

      return new Response(JSON.stringify({ 
        message: count === 0 ? "All images migrated!" : "No row found", 
        remaining: count || 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse base64
    const match = row.clean_image_url.match(/^data:(image\/[^;]+);base64,(.+)$/s);
    if (!match) {
      // Not valid base64, skip by marking with a placeholder
      return new Response(JSON.stringify({ error: "Invalid base64 for " + row.product_name_normalized }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mimeType = match[1];
    const raw = atob(match[2]);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);

    const ext = mimeType === "image/jpeg" ? "jpg" : "png";
    const filePath = `clean/${row.product_name_normalized}.${ext}`;

    // Upload
    const { error: uploadError } = await admin.storage
      .from("product-images")
      .upload(filePath, bytes, { contentType: mimeType, upsert: true });

    if (uploadError) {
      return new Response(JSON.stringify({ error: `Upload failed: ${uploadError.message}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: urlData } = admin.storage.from("product-images").getPublicUrl(filePath);

    // Update row
    const { error: updateError } = await admin
      .from("product_clean_images")
      .update({ clean_image_url: urlData.publicUrl })
      .eq("id", row.id);

    if (updateError) {
      return new Response(JSON.stringify({ error: `DB update failed: ${updateError.message}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Count remaining
    const { count } = await admin
      .from("product_clean_images")
      .select("id", { count: "exact", head: true })
      .like("clean_image_url", "data:%");

    return new Response(
      JSON.stringify({ 
        migrated: row.product_name_normalized, 
        url: urlData.publicUrl,
        remaining: count || 0,
        size_bytes: bytes.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("Migration error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
