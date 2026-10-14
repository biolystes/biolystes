/* Pièces communes à scripts/sync-catalogue-pro.mjs (qui écrit la copie) et
   à src/test/catalogue-pro.test.ts (qui la compare à biolystes.pro). Une seule
   façon de lire la source, pour que la copie et le contrôle ne divergent pas. */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";

export const DEPOT = "biolystes/commandcenterbiolystes";
export const BRANCHE = "main";
export const FICHIER_PRODUITS = "src/data/products.ts";
export const FICHIER_CARTE_IMAGES = "src/data/clean-image-map.json";
export const FICHIER_COMPOSANT = "src/pages/CataloguePage.tsx";

/* Même règle que src/lib/fournisseur-masque.ts : le nom est recomposé. */
const NOM_COMPACT = ["se", "lf", "na", "med"].join("");
export const citeLeFournisseur = (t) =>
  !!t && t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "").includes(NOM_COMPACT);

export const sha256 = (t) => createHash("sha256").update(t).digest("hex");

const gh = (args) =>
  execFileSync("gh", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"], timeout: 60_000 });

/** Le dernier commit de la branche main de biolystes.pro. */
export const dernierCommit = () => gh(["api", `repos/${DEPOT}/commits/${BRANCHE}`, "--jq", ".sha"]).trim();

/** Un fichier de biolystes.pro, tel quel. */
export const lireFichier = (fichier, ref = BRANCHE) =>
  gh(["api", "-H", "Accept: application/vnd.github.raw", `repos/${DEPOT}/contents/${fichier}?ref=${ref}`]);

/** Les codes (slugs) des produits, dans l'ordre du fichier. */
export function codesProduits(source) {
  return [...source.matchAll(/^    "slug": "([^"]+)",$/gm)].map((m) => m[1]);
}

/** Les photos « approved » de la table clean_product_images de biolystes.pro,
    lues avec sa clé publique (celle que son navigateur reçoit déjà, prise dans
    son .env, jamais recopiée ici). Même règle que CataloguePage.tsx : lignes
    triées de la plus récente à la plus ancienne, la dernière écrite gagne. */
export async function lireImagesApprouvees(ref = BRANCHE) {
  const env = Object.fromEntries(
    lireFichier(".env", ref)
      .split("\n")
      .map((l) => l.match(/^([A-Z_]+)\s*=\s*"?([^"]*)"?\s*$/))
      .filter(Boolean)
      .map((m) => [m[1], m[2]]),
  );
  const url = env.VITE_SUPABASE_URL;
  const cle = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const reponse = await fetch(
    `${url}/rest/v1/clean_product_images?select=product_slug,clean_image_url,status,created_at,updated_at&order=updated_at.desc`,
    { headers: { apikey: cle, Authorization: `Bearer ${cle}` } },
  );
  if (!reponse.ok) throw new Error(`clean_product_images : ${reponse.status} ${await reponse.text()}`);
  const approuvees = {};
  for (const img of await reponse.json()) {
    if (img.status !== "approved" || !img.clean_image_url) continue;
    approuvees[img.product_slug] = { url: img.clean_image_url, version: img.updated_at ?? img.created_at ?? "" };
  }
  return JSON.stringify(Object.fromEntries(Object.keys(approuvees).sort().map((k) => [k, approuvees[k]])), null, 2) + "\n";
}
