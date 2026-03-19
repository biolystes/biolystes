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

const MANUAL_IMAGE_OVERRIDES: Array<{ nom: string; images: string[] }> = [
  {
    nom: "Shampooing pour cuir chevelu sensible",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1dqZlpETEJBOGFUQjAzbFA0LUt6d1dhSkc5LV9yOU9TLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2NHb1lNOGNPUzFYcERXek1hRGk3RjFqM0ZtS1FRb1o2LmpwZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Brume capillaire sans rinçage Keratin Shine",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL243NDcwV3NDTzM5LXJhdHJrcDJoaHhDc2dNM2NDSXluLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL21UNzBia2JzN04wdnpMYWRDM3k5em1iaHlJVHRqUUttLmpwZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Huile fortifiante pour cheveux et cuir chevelu au romarin",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zLzczRjhPM2pmUklTc2JYcVhYMGFYckJmRHlXYkEyM1ZRLmpwZWcmd2lkdGg9MTAyNA==",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL3FlVjAxTTVqM2gwbjlVcFktcWdtN00zUTZDU3FOTXhuLmpwZWcmd2lkdGg9MTAyNA==",
    ],
  },
  // ── 20 coffrets / duos from CSV ──
  {
    nom: "Le Duo Réparation & Brillance",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2kyWllRMGVieGJQT3hGTnZfZXZtOXNQLW9CZkpNYVBNLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2hWWXowcmFKUW4wVlZoUHhtaXd2cmRhbWJ5WW5nMi1SLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zLy1yaE5sSjlYYjdNMWthVmJaQlhkb3BjcTg1Vk1zcGRYLmpwZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Coffret Renaissance Capillaire",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2kyWllRMGVieGJQT3hGTnZfZXZtOXNQLW9CZkpNYVBNLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1dqZlpETEJBOGFUQjAzbFA0LUt6d1dhSkc5LV9yOU9TLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zLzV6TDhGMHlzREM5cTRKMWJCWDJaN2gtSmlyWjVrX28xLmpwZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Duo Corps Peaux Sensibles",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL0kzSWdBanFjSnVCcm00cFZVUlhGcFU2Y0xUYUZULW9xLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL0FWUnVjMnQzQzkwUGF1Tmx1cmxNMDVyWEN2LXZlby02LnBuZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2lFemJWM0F4ZnJvZVpKblcyTXFEajUzZF9DaWVSRkpyLmpwZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Duo Performance Anti-Âge",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL245UG5IR1djbUdRdHMtY3QtZEtYR25jQkNtZWJmOFlTLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1VIMUlkOWVFcHZqdFFrNzdpbkhzRmVjdzR4am9WWkpsLmpwZWcmd2lkdGg9MTAyNA==",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL3BqNWM4V0JRM0JFRmU0bDMwc2M4UkpRQUVnLVpLUWVoLmpwZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Duo de routine contre les taches brunes",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1dldDZvaXZQZVBOSWo1Rk11QW4wYVlxRTY0RDBpRExaLnBuZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zLzgtdDdhS1psWjEtWkNyM3BkMlczMldSalhyNXhBUWpnLnBuZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL05hbWRDT1NMVWlNNXlGUk13aWxIR1JRTENFZmRKdkM5LmpwZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Le duo d'hydratation ultime",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2Jjd1hXckhiNmhDelVROFdkOXY3N0c5UGZqdk5DLTB6LnBuZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2wwcmhVRVJ1UjgxdXpLdHNMYUZtYzF3cXRzdkRaTlgyLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1BCanp5d2doOXVfbWZscUd4dXFvdzdpQlZ2ZlI2S213LmpwZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Boîte de collection pour le teint clair",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL05WYXNsYUFtZjNXaU9iNjVMaW9nMng2dWliZk9jX1RLLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2R4c3ZfaDlQblJkWVhnTVg3b3hHSjdoTG0wN1c4Nnh4LmpwZWcmd2lkdGg9MTAyNA==",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2pLQTVYdGlUa3JWRUdURklJZml5VTVqUWVUSmloaGxNLnBuZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Boîte de collection Eclat intemporel",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2R4c3ZfaDlQblJkWVhnTVg3b3hHSjdoTG0wN1c4Nnh4LmpwZWcmd2lkdGg9MTAyNA==",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2Jjd1hXckhiNmhDelVROFdkOXY3N0c5UGZqdk5DLTB6LnBuZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL24xUU9lYy1WTUpMcVhSMjc1WU9kVU1TNjI1STMyZ3FULmpwZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Boîte de collection Éclat rajeunissant",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zLzFhVFljbHIyVnF1M2YxdnpBQ045NWwtZkZrd1h1ZlJGLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1d4VlJROW5kYi1FYV9wOXp5dHhNTUhlVWJUSzFBZGRJLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2pLQTVYdGlUa3JWRUdURklJZml5VTVqUWVUSmloaGxNLnBuZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Boîte de collection du trio anti-âge",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1VIMUlkOWVFcHZqdFFrNzdpbkhzRmVjdzR4am9WWkpsLmpwZWcmd2lkdGg9MTAyNA==",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL245UG5IR1djbUdRdHMtY3QtZEtYR25jQkNtZWJmOFlTLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL3IxQldUZUJab0g5d2ZtQlRna1RGUW5peERJMVY1Q2dBLnBuZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Boîte de la collection Luminous Skin",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1d4VlJROW5kYi1FYV9wOXp5dHhNTUhlVWJUSzFBZGRJLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1J0b0NSVEVoUXFyMllGVmtBU3RfMlg0U1d3blpjMDltLmpwZWcmd2lkdGg9MTAyNA==",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL24xUU9lYy1WTUpMcVhSMjc1WU9kVU1TNjI1STMyZ3FULmpwZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Boîte de collection Trio Glowy Skin",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1NYVWZadzc5Nk84RkdoOXhzazNZeEtsS2ktQ3l4enNaLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL0tXSHhFMnBBQVltR0lCZTJpNHFwejNXM2RUdnlLZTZOLmpwZWcmd2lkdGg9MTAyNA==",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2NYU0E3cmVud05Pay1Vbmx5M044OHNKMVRmbFJQZHJ6LmpwZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Boîte de collection Hydratation profonde",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL0MzeXAzYWs3MkR5cndlRmJfMTB2U0VIeVpnSm1JOWNMLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1d4VlJROW5kYi1FYV9wOXp5dHhNTUhlVWJUSzFBZGRJLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2Jjd1hXckhiNmhDelVROFdkOXY3N0c5UGZqdk5DLTB6LnBuZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "La Boîte de Collection Ultime pour le Renouveau",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1VIMUlkOWVFcHZqdFFrNzdpbkhzRmVjdzR4am9WWkpsLmpwZWcmd2lkdGg9MTAyNA==",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2J4c1dnbzBDOWpNTXBsdnVVLTB3dnJ3d203QURnYS1hLnBuZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2Jjd1hXckhiNmhDelVROFdkOXY3N0c5UGZqdk5DLTB6LnBuZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Boîte de Collection de Routine de Nuit au Collagène",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2Y5bktrRmFiQkJhN3Q1cExMd04zUmZmUWFhNG1EeFRsLmpwZWcmd2lkdGg9MTAyNA==",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2x4YU1mRmYxS2huY3pJTXhwZW5GNUZzNFEyX1dQLTYzLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1J0b0NSVEVoUXFyMllGVmtBU3RfMlg0U1d3blpjMDltLmpwZWcmd2lkdGg9MTAyNA==",
    ],
  },
  {
    nom: "Boîte de collection Éclat quotidien",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL0NEMmdyNTFIOHllZ21Mc21zblhPQlR6QlM3V3R4dUhRLnBuZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL0tXSHhFMnBBQVltR0lCZTJpNHFwejNXM2RUdnlLZTZOLmpwZWcmd2lkdGg9MTAyNA==",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zLzdzR0ZtdzNWdmtzb1R0RFA3OHhvN1NQVWxadEViTnpvLnBuZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Boîte de collection Rituel d'hydratation",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL0tXSHhFMnBBQVltR0lCZTJpNHFwejNXM2RUdnlLZTZOLmpwZWcmd2lkdGg9MTAyNA==",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2Jjd1hXckhiNmhDelVROFdkOXY3N0c5UGZqdk5DLTB6LnBuZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zLzh6ck1WSm1qVmdRQmxvY0x4VjExYWlNOXV4VFlpOWs3LnBuZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Boîtier de collection Boost Serum",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1VIMUlkOWVFcHZqdFFrNzdpbkhzRmVjdzR4am9WWkpsLmpwZWcmd2lkdGg9MTAyNA==",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2pLQTVYdGlUa3JWRUdURklJZml5VTVqUWVUSmloaGxNLnBuZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1J0b0NSVEVoUXFyMllGVmtBU3RfMlg0U1d3blpjMDltLmpwZWcmd2lkdGg9MTAyNA==",
    ],
  },
  {
    nom: "Boîte de collection Acné Care",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL0NEMmdyNTFIOHllZ21Mc21zblhPQlR6QlM3V3R4dUhRLnBuZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2J4c1dnbzBDOWpNTXBsdnVVLTB3dnJ3d203QURnYS1hLnBuZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL281RXBlcG5XdVpYb3RCXzBiY0hoU0FSZXA1aWdRdHF1LnBuZyZ3aWR0aD0xMDI0",
    ],
  },
  {
    nom: "Boîte de collection anti-âge",
    images: [
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2x4YU1mRmYxS2huY3pJTXhwZW5GNUZzNFEyX1dQLTYzLmpwZyZ3aWR0aD0xMDI0",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1VIMUlkOWVFcHZqdFFrNzdpbkhzRmVjdzR4am9WWkpsLmpwZWcmd2lkdGg9MTAyNA==",
      "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL245UG5IR1djbUdRdHMtY3QtZEtYR25jQkNtZWJmOFlTLmpwZyZ3aWR0aD0xMDI0",
    ],
  },
];

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
      for (const override of MANUAL_IMAGE_OVERRIDES) {
        const allImages = override.images.filter(Boolean);
        if (allImages.length === 0) continue;

        map.set(normalize(override.nom), {
          nom: override.nom,
          image_principale: allImages[0] || "",
          image_2: allImages[1] || "",
          image_3: allImages[2] || "",
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
