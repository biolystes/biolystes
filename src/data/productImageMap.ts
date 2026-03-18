// ─── Known product images extracted from verified HTML source ──────────
// Maps normalized product names to arrays of known-good image URLs.
// Used as fallback when produits.json image parsing fails.

import { normalize } from "./productsData";

const RAW_IMAGE_MAP: Record<string, string[]> = {
  "Crème de jour anti-âge": [
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL245UG5IR1djbUdRdHMtY3QtZEtYR25jQkNtZWJmOFlTLmpwZyZ3aWR0aD0xMDI0",
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2k5Z3Jxby1TZ0h4UU9WOVgzWU5CZk5TZS1BTG41dnBFLmpwZyZ3aWR0aD0xMDI0",
  ],
  "Gel Booster à la caféine": [
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL3FnaFNrdWlkMnBrSm9Nd3JXVkVOZ2NKOFlxVElqQjVlLmpwZWcmd2lkdGg9MTAyNA==",
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2VCT084TTNUaVFZWXQ2UDlEcWdFSUEzVzlHYTdweVJVLmpwZWcmd2lkdGg9MTAyNA==",
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1VqRDd6TWVzYzVDUXJBUUI2NERhR3g3X3c5XzFRNHlJLmpwZyZ3aWR0aD0xMDI0",
  ],
  "Gel Booster au ginkgo antioxydant": [
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2R2ekNFbnJDYU5heGdPenh4encyellCZ1RTbVVNS19sLmpwZWcmd2lkdGg9MTAyNA==",
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2w2MXNtOHFRVEU1cG9uRmV6d0R0cmUxUkhiR2JEbG8xLmpwZyZ3aWR0aD0xMDI0",
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL0tySXZCYTNwaHpnb0owZk1RcmpNNFpRQmEwTVZ3SDdfLmpwZyZ3aWR0aD0xMDI0",
  ],
  "Huile visage nourrissante": [
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2lJVE9FZWE1amF3aE5jMVRhNHB2UmprZFVoQXNnaXlTLmpwZyZ3aWR0aD0xMDI0",
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zLy1BSzVvMDJlSE5JM1I0UlVGVGt0UnJLYXpJV1YxTk4wLmpwZyZ3aWR0aD0xMDI0",
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2NYU0E3cmVud05Pay1Vbmx5M044OHNKMVRmbFJQZHJ6LmpwZyZ3aWR0aD0xMDI0",
  ],
  "Sérum naturel à base d'huile alternatif au rétinol": [
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2pLQTVYdGlUa3JWRUdURklJZml5VTVqUWVUSmloaGxNLnBuZyZ3aWR0aD0xMDI0",
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zLzVDaU9SekVINklWOGpGUkNEMjBiS3FKUVBZMEl2emF0LmpwZyZ3aWR0aD0xMDI0",
  ],
  "Huile visage tout-en-un": [
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zLzdzR0ZtdzNWdmtzb1R0RFA3OHhvN1NQVWxadEViTnpvLnBuZyZ3aWR0aD0xMDI0",
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL1R5S2FNMUt1VExOUWlUZHlNZWRHdVpDalNZM2c4MXl1LmpwZyZ3aWR0aD0xMDI0",
  ],
  "Huile apaisante pour le visage": [
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2ItWjNSZUtiQmNrVmlRcVlJSE5OWURHS2ZLeEpxVmdXLmpwZyZ3aWR0aD0xMDI0",
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2lIMWZ4ZHJ0TmFlLTduNW12cWsxa0dJQ1FCSll1bF9lLmpwZWcmd2lkdGg9MTAyNA==",
  ],
  "Gel hydratant non gras": [
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2htZ3piX0luU1RvMkE1M0lYM0VxZktHRGsxUGo0eWJhLmpwZyZ3aWR0aD0xMDI0",
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2dwbWgtV2IzMExrbFpWOXdtU3BMdW9HMU9vX2ZkZnBNLmpwZyZ3aWR0aD0xMDI0",
  ],
  "Sérum hydratant": [
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2wwcmhVRVJ1UjgxdXpLdHNMYUZtYzF3cXRzdkRaTlgyLmpwZyZ3aWR0aD0xMDI0",
    "https://static.selfnamed.com/r/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL2YxZ3Z5TzlHakY1RUl1eTJ2cEFhZDJnU2taakYtdXNpLmpwZyZ3aWR0aD0xMDI0",
  ],
};

// Build normalized lookup map (lazy singleton)
let _normalizedMap: Map<string, string[]> | null = null;

export function getKnownProductImages(productName: string): string[] {
  if (!_normalizedMap) {
    _normalizedMap = new Map();
    for (const [name, urls] of Object.entries(RAW_IMAGE_MAP)) {
      _normalizedMap.set(normalize(name), urls);
    }
  }
  return _normalizedMap.get(normalize(productName)) || [];
}
