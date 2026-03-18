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

function base64ToBytes(dataUri: string): { bytes: Uint8Array; mimeType: string } {
  const match = dataUri.match(/^data:(image\/[^;]+);base64,(.+)$/s);
  if (!match) throw new Error("Invalid data URI");
  const mimeType = match[1];
  const raw = atob(match[2]);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return { bytes, mimeType };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Get ONLY IDs and names of base64 images (no heavy data)
    const { data: rows, error } = await admin
      .from("product_clean_images")
      .select("id, product_name_normalized")
      .like("clean_image_url", "data:%")
      .limit(3); // Process 3 at a time to stay within memory

    if (error) throw error;
    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ message: "No more base64 images to migrate", migrated: 0, remaining: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let migrated = 0;
    const errors: string[] = [];

    for (const row of rows) {
      try {
        // Fetch only this one row's image data
        const { data: fullRow, error: fetchErr } = await admin
          .from("product_clean_images")
          .select("clean_image_url")
          .eq("id", row.id)
          .single();

        if (fetchErr || !fullRow) {
          errors.push(`Fetch ${row.product_name_normalized}: ${fetchErr?.message}`);
          continue;
        }

        const { bytes, mimeType } = base64ToBytes(fullRow.clean_image_url);
        const ext = mimeType === "image/jpeg" ? "jpg" : "png";
        const filePath = `clean/${row.product_name_normalized}.${ext}`;

        // Upload to storage
        const { error: uploadError } = await admin.storage
          .from("product-images")
          .upload(filePath, bytes, { contentType: mimeType, upsert: true });

        if (uploadError) {
          errors.push(`Upload ${row.product_name_normalized}: ${uploadError.message}`);
          continue;
        }

        // Get public URL
        const { data: urlData } = admin.storage
          .from("product-images")
          .getPublicUrl(filePath);

        // Update DB with URL
        const { error: updateError } = await admin
          .from("product_clean_images")
          .update({ clean_image_url: urlData.publicUrl })
          .eq("id", row.id);

        if (updateError) {
          errors.push(`Update ${row.product_name_normalized}: ${updateError.message}`);
          continue;
        }

        migrated++;
        console.log(`Migrated: ${row.product_name_normalized} (${migrated}/${rows.length})`);
      } catch (e) {
        errors.push(`${row.product_name_normalized}: ${e instanceof Error ? e.message : "unknown"}`);
      }
    }

    // Check remaining
    const { count } = await admin
      .from("product_clean_images")
      .select("id", { count: "exact", head: true })
      .like("clean_image_url", "data:%");

    return new Response(
      JSON.stringify({ migrated, total: rows.length, remaining: count || 0, errors }),
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
