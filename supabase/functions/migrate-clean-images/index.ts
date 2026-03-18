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
  const match = dataUri.match(/^data:(image\/\w+);base64,(.+)$/);
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
    // Get all base64 images
    const { data: rows, error } = await admin
      .from("product_clean_images")
      .select("id, product_name, product_name_normalized, clean_image_url")
      .like("clean_image_url", "data:%");

    if (error) throw error;
    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ message: "No base64 images to migrate", migrated: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let migrated = 0;
    const errors: string[] = [];

    for (const row of rows) {
      try {
        const { bytes, mimeType } = base64ToBytes(row.clean_image_url);
        const ext = mimeType.split("/")[1] || "png";
        const filePath = `clean/${row.product_name_normalized}.${ext}`;

        // Upload to storage
        const { error: uploadError } = await admin.storage
          .from("product-images")
          .upload(filePath, bytes, { contentType: mimeType, upsert: true });

        if (uploadError) {
          errors.push(`Upload ${row.product_name}: ${uploadError.message}`);
          continue;
        }

        // Get public URL
        const { data: urlData } = admin.storage
          .from("product-images")
          .getPublicUrl(filePath);

        // Update DB record with URL instead of base64
        const { error: updateError } = await admin
          .from("product_clean_images")
          .update({ clean_image_url: urlData.publicUrl })
          .eq("id", row.id);

        if (updateError) {
          errors.push(`Update ${row.product_name}: ${updateError.message}`);
          continue;
        }

        migrated++;
        console.log(`Migrated: ${row.product_name} (${migrated}/${rows.length})`);
      } catch (e) {
        errors.push(`${row.product_name}: ${e instanceof Error ? e.message : "unknown"}`);
      }
    }

    return new Response(
      JSON.stringify({ migrated, total: rows.length, errors: errors.slice(0, 10) }),
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
