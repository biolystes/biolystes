import { AIGraphiste } from "../types";
import { GRAPHISTES_STYLES } from "./styles-references";

import celineAvatar from "@lystes/assets/graphistes/celine.jpg";


/* 14/09/2026 (JP) : « groupe les créas par thématique ou style, comme ça on
   peut créer des graphistes ». Les quatre styles tirés de ses références vivent
   dans styles-references.ts et rejoignent la liste ici : un seul endroit à lire
   pour savoir qui existe. */
export const GRAPHISTES: AIGraphiste[] = [
  ...GRAPHISTES_STYLES,
  {
    id: "celine",
    name: "Céline",
    specialty: "Cosmétiques & Wellness",
    type: "Branding Éditorial",
    title: "Graphiste branding cosmétiques — packshots annotés, UGC + claims, infographies ingrédients style Aesop / Byredo",
    avatar: celineAvatar,
    sectorKey: "branding",
    edgeFunction: "generate-cosmetics-branding-photos",
    /**
     * Les prompts RÉELS des 6 visuels du portfolio, position par position —
     * copie des FRAME_PROMPTS 1 à 6 de `generate-cosmetics-branding-photos`.
     * C'est ce texte (ou sa réécriture marchande) que « Refaire le feed »
     * envoie, et c'est lui que le crayon affiche. (JP, 07/09/2026)
     */
    promptsPortfolio: [
      "UGC Selfie 1 + Claim — PERSON 1 taking a hyper-realistic smartphone selfie holding the EXACT product from the reference image near their face. Genuine relaxed expression, natural warm light. Front-camera angle, warm color grading. Feels like a real Instagram post. GRAPHIC ELEMENTS: The product name and ONE key claim/benefit are annotated on the side in modern sans-serif THIN weight typography with a fine connection line pointing to the product. White text by default.",
      "Close-up Texture + Annotations — Close-up shot focused on the middle of the product. The product must be EXACTLY the same as the reference — same label, same colors, same proportions. Focusing on surface texture, materials and print details. GRAPHIC ELEMENTS: 1-2 material characteristics (e.g. 'Airless Pump', 'Recyclable Glass') annotated with ultra-thin connection lines (0.5-1px) and small dots at endpoints. Modern sans-serif THIN weight. White text by default.",
      "Ingredients Annotated — The EXACT reference product (identical packaging, label, logo, colors) placed in a studio environment inspired by the product's color palette. GRAPHIC ELEMENTS: 3-4 key ingredients annotated around the product with ultra-thin connection lines (0.5-1px) connected directly to the product, small dots at endpoints, and fine circles. Ingredient names in modern sans-serif THIN weight. White text by default (dark charcoal only if background is too light). ONE text color for the entire frame. Typography feels like a museum label — minimal, precise, architectural.",
      "Levitation + Benefits Circle — The EXACT product from the reference image levitating slightly tilted on a neutral background matching the product's color palette. GRAPHIC ELEMENTS: A fine thin circle centered on the product with 4-6 unique benefits placed around it at regular spacing (like a clock). Each benefit in modern sans-serif THIN weight. White text by default. The circle and text create a graphic diagram around the floating product.",
      "Isometric Grid + Tagline — Isometric composition showing multiple copies of the EXACT same product from the reference image, arranged in a precise geometric order from top isometric angle. Every copy must have identical packaging, label and colors. GRAPHIC ELEMENTS: The product range name and a short tagline annotated in modern sans-serif THIN weight typography. Clean, structured, graphic.",
      "UGC Selfie 2 + Benefits List — PERSON 2 — DIFFERENT from Person 1 (different gender, age, or ethnicity) — taking a hyper-realistic smartphone selfie holding the EXACT product from the reference image near their face. Genuine relaxed expression, natural light. GRAPHIC ELEMENTS: A list of 4-5 key benefits on the side, aligned vertically along a fine thin vertical line. Modern sans-serif THIN weight. White text by default.",
    ],
    sampleImages: [
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374302528-frame-1.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374327084-frame-2.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374357752-frame-3.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374381528-frame-4.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374405533-frame-5.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374428983-frame-6.png",
    ],
  },
];
