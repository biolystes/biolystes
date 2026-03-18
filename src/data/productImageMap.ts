// ─── CSV image loader for selfnamed product images ──────────
// Loads selfnamed-images.csv and provides a normalized name → image URLs lookup.
// No circular dependencies.

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export interface ProductImageEntry {
  nom: string;
  image_principale: string;
  image_2: string;
  image_3: string;
  allImages: string[];
}

let _cache: Map<string, ProductImageEntry> | null = null;
let _loading: Promise<Map<string, ProductImageEntry>> | null = null;

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

export async function loadProductImages(): Promise<Map<string, ProductImageEntry>> {
  if (_cache) return _cache;
  if (_loading) return _loading;

  _loading = fetch("/data/selfnamed-images.csv")
    .then(r => r.text())
    .then(text => {
      const map = new Map<string, ProductImageEntry>();
      const lines = text.split("\n").filter(l => l.trim());
      // Skip header (line 0)
      for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);
        if (fields.length < 4) continue;
        const [nom, , img1, img2, img3] = fields;
        if (!nom || !img1) continue;
        const key = normalize(nom);
        // Only keep first occurrence per name (best images)
        if (map.has(key)) continue;
        const allImages = [img1, img2, img3].filter(Boolean);
        map.set(key, {
          nom,
          image_principale: img1,
          image_2: img2 || "",
          image_3: img3 || "",
          allImages,
        });
      }
      _cache = map;
      return map;
    })
    .catch(() => {
      const empty = new Map<string, ProductImageEntry>();
      _cache = empty;
      return empty;
    });

  return _loading;
}

export function getProductImagesSync(normalizedName: string): string[] {
  if (!_cache) return [];
  const entry = _cache.get(normalizedName);
  return entry ? entry.allImages : [];
}
