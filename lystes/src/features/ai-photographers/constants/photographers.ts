import { AIPhotographer } from "../types";
import type { DisciplineCreative } from "./disciplines";
import { PHOTOGRAPHE_LUNETTES } from "./photographe-lunettes";
import { PHOTOGRAPHE_ADGOD } from "./photographe-adgod";

import camilleAvatar from "@lystes/assets/photographers/camille.jpg";
import sofiaAvatar from "@lystes/assets/photographers/sofia.jpg";
import aminataAvatar from "@lystes/assets/photographers/aminata.jpg";
import lunaAvatar from "@lystes/assets/photographers/luna.jpg";
import yukiAvatar from "@lystes/assets/photographers/yuki.jpg";
import elenaAvatar from "@lystes/assets/photographers/elena.jpg";
import margotAvatar from "@lystes/assets/photographers/margot.jpg";

import isabelleAvatar from "@lystes/assets/photographers/isabelle.jpg";
import { AGENCES_MARKETING } from "./agences-marketing";
import { AGENCES_COIFFURE } from "./agences-coiffure";
import { AGENCES_SEO_GEO } from "./agences-seo-geo";
import { AGENCES_UGC } from "./agences-ugc";
import maximeAvatar from "@lystes/assets/photographers/maxime.jpg";
import { PROMPTS_SHOT } from "./prompts-shot";
import { PROMPTS_PORTFOLIO_LUCIE_ORIGINAUX } from "./prompts-plateformes";
import { libelleDuType, variantesDuType } from "./variantes-shot";




const MARGOT_SAMPLES = [
  "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/ugc-studio/ugc-portfolio/068cda21-81e2-46c0-b72e-7bffe2626b4c/1771835198911-scene1.png",
  "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/ugc-studio/ugc-portfolio/068cda21-81e2-46c0-b72e-7bffe2626b4c/1771835249219-scene2.png",
  "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/ugc-studio/ugc-portfolio/068cda21-81e2-46c0-b72e-7bffe2626b4c/1771835292703-scene3.png",
  "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/ugc-studio/ugc-portfolio/068cda21-81e2-46c0-b72e-7bffe2626b4c/1771836346717-scene1.png",
  "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/ugc-studio/ugc-portfolio/068cda21-81e2-46c0-b72e-7bffe2626b4c/1771836388962-scene2.png",
  "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/ugc-studio/ugc-portfolio/068cda21-81e2-46c0-b72e-7bffe2626b4c/1771836535993-scene3.png",
];

const PROMPTS_ISABELLE_9 = [
  "Lookbook front view — the SAME model wears the EXACT garment from the reference image, full body, straight posture, seamless white studio, soft even light, accurate cut and colour, no text or overlay.",
  "Lookbook three-quarter view — the SAME model and EXACT garment, subtle three-quarter turn, full silhouette visible, seamless white studio, natural fabric folds, no text or overlay.",
  "Lookbook profile view — the SAME model and EXACT garment in clean side profile, full body, garment construction clearly readable, white studio, no text or overlay.",
  "Lookbook back view — the SAME model and EXACT garment photographed from behind, full body, back construction and length visible, white studio, no text or overlay.",
  "Lookbook walking pose — the SAME model wearing the EXACT garment during one natural step, fabric moving realistically, full body, white studio, no text or overlay.",
  "Lookbook seated pose — the SAME model wearing the EXACT garment in a restrained seated pose, silhouette and fabric behaviour visible, white studio, no text or overlay.",
  "Garment detail — close crop on the SAME model wearing the EXACT garment, focusing on seam, closure, collar or textile texture, honest material detail, no text or overlay.",
  "Lookbook contrapposto — the SAME model and EXACT garment, relaxed weight shift and subtle editorial attitude, full body, seamless white studio, no text or overlay.",
  "Lookbook closing portrait — the SAME model wearing the EXACT garment, frame from knees upward, calm direct gaze, soft white studio light, garment remains the subject, no text or overlay.",
];

export const PHOTOGRAPHERS: AIPhotographer[] = [
  {
    id: "camille",
    /* 15/09/2026 (JP) : Camille est la photographe packshot d'origine de
       /shot — sa place est la page Photographes. Reclassée « community » par
       erreur, elle avait disparu de l'annuaire des photographes. */
    discipline: "photographe",
    name: "Camille",
    specialty: "Beauté",
    style: "Packshot",
    type: "Photo Beauté",
    title: "Spécialiste packshots cosmétiques — sérums, crèmes et soins visage",
    avatar: camilleAvatar,
    sectorKey: "beauty",
    /* Les visuels dans l'ORDRE des cadrages ci-dessous : chaque photo, son
       prompt et son libelle occupent la meme position. */
    frames: [1, 2, 3, 6, 7, 8],
    sampleImages: [
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/d7b7277c-0548-47b5-a56b-c509f5c622d4/1770906513946-frame-1.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/d7b7277c-0548-47b5-a56b-c509f5c622d4/1770906507802-frame-2.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/d7b7277c-0548-47b5-a56b-c509f5c622d4/1770906506736-frame-3.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/d7b7277c-0548-47b5-a56b-c509f5c622d4/1770906501958-frame-6.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/d7b7277c-0548-47b5-a56b-c509f5c622d4/1770906504507-frame-7.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/d7b7277c-0548-47b5-a56b-c509f5c622d4/1770906506194-frame-8.png",
    ],
    /* Les NEUF prompts d'origine de Camille, ceux de /shot
       (supabase/functions/shot-generate-frame — CAMILLE_FRAMES), dans l'ordre
       des cadrages 1 a 9. Sans eux, ses plateaux repartaient sur le scenario
       cosmetique partage (JP, 07/09/2026). */
    libellesCadrages: [
      "Hero Shot",
      "Close-up Texture",
      "In Context",
      "Levitation",
      "Extreme Detail",
      "Editorial Bold",
    ],
    promptsPortfolio: [
      `Front-facing hero shot of the product in a clean studio setup. Neutral background, balanced composition, calm and confident presentation of the product.`,
      `Close-up shot with the focus centered on the middle of the product. Focusing on surface texture, materials and print details.`,
      `Product placed in an environment that naturally fits the brand and product category. Studio setting inspired by the product design elements and colours.`,
      `Product levitating slightly tilted on a neutral background that matches the reference image color palette. Floating position is angled and intentional, the product is floating naturally in space.`,
      `Extreme close-up focusing on a specific detail of the label, edge, texture or material behavior.`,
      `Product in an unexpected yet aesthetically strong setting that feels bold, editorial and visually striking. Studio-based and designer-driven. Bold composition that elevates the brand.`,
    ],
  },
  {
    id: "sofia",
    discipline: "community",
    name: "Sofia",
    specialty: "Gastronomie",
    style: "Nature Morte",
    type: "Photo Gastronomie",
    title: "Spécialiste food photography — plats, bowls et dressage culinaire",
    avatar: sofiaAvatar,
    sectorKey: "food",
    frames: [2, 3, 5, 8, 9, 1],
    libellesCadrages: [
      "Close-up Texture",
      "In Context",
      "Grille produit",
      "Editorial Bold",
      "Plan large décor",
      "Hero Shot",
    ],
    /* Prompts propres a ce plateau : sans eux, tous les profils
       partageaient la meme consigne de repli (JP, 07/09/2026). */
    promptsPortfolio: [
      `Close-up food photography: fork or spoon lifting a portion of the dish, steam and glossy sauce catching a soft window light, shallow depth of field, natural ceramic tableware, warm appetising palette.`,
      `The dish styled on a real dining table: linen napkin, cutlery, glass of water, crumbs and herbs scattered naturally, three-quarter angle at 45 degrees, daylight from the side.`,
      `Flat lay from directly above: the dish at the centre surrounded by its raw ingredients arranged in a clean grid on a matte stone surface, even diffused light, no shadows fighting.`,
      `Bold editorial food shot: strong coloured backdrop, dish slightly off-centre, hard directional light creating a graphic shadow, saturated appetising colours, magazine cover energy.`,
      `Wide restaurant scene: the dish in the foreground in focus, blurred table setting, chairs and warm interior behind, golden hour light, cosy hospitality mood.`,
      `Front-facing hero shot of the dish on a neutral plate, centred, soft top light, fresh garnish, clean appetising presentation ready for a menu.`,
    ],
    sampleImages: [
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/ffc897fc-5da1-4347-8bd7-0ef3a12acee3/1770962530506-frame-2.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/ffc897fc-5da1-4347-8bd7-0ef3a12acee3/1770962537664-frame-3.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/ffc897fc-5da1-4347-8bd7-0ef3a12acee3/1770962519096-frame-5.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/ffc897fc-5da1-4347-8bd7-0ef3a12acee3/1770962527947-frame-8.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/ffc897fc-5da1-4347-8bd7-0ef3a12acee3/1770962529468-frame-9.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/ffc897fc-5da1-4347-8bd7-0ef3a12acee3/1770962534906-frame-1.png",
    ],
  },
  {
    id: "aminata",
    withModel: true,
    discipline: "community",
    name: "Aminata",
    specialty: "Sport",
    style: "Portée",
    type: "Photo Sport",
    title: "Spécialiste sportswear — leggings, brassières et tenues fitness",
    avatar: aminataAvatar,
    sectorKey: "sport",
    frames: [9, 2, 4, 8, 6, 7],
    libellesCadrages: [
      "Plan large mouvement",
      "Close-up Texture",
      "Levitation",
      "Editorial Bold",
      "Studio dynamique",
      "Extreme Detail",
    ],
    /* Prompts propres a ce plateau : sans eux, tous les profils
       partageaient la meme consigne de repli (JP, 07/09/2026). */
    promptsPortfolio: [
      `Wide sportswear scene: athlete wearing the garment mid-movement in an urban training spot, full body in frame, natural daylight, dynamic posture, real sweat and motion.`,
      `Close-up on the fabric worn on the body: stretch, seams, ribbing and technical weave visible, skin and textile contrast, side light revealing texture.`,
      `The garment floating on a plain coloured background, softly tilted as if caught in movement, fabric folds suspended, clean studio light.`,
      `Bold sports editorial: strong colour block background, athlete in a powerful static pose, hard light and deep shadows, high contrast, campaign energy.`,
      `Studio shot on seamless backdrop: athlete in a controlled athletic pose, full garment readable, crisp even lighting, muscular definition kept natural.`,
      `Extreme detail on one technical feature of the garment: waistband, logo tab, mesh panel or flatlock stitching, macro optics, tactile realism.`,
    ],
    sampleImages: [
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/fc807305-3d11-4e40-9439-97ee4562d5b7/1770905113008-frame-9.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/fc807305-3d11-4e40-9439-97ee4562d5b7/1770904923665-frame-2.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/fc807305-3d11-4e40-9439-97ee4562d5b7/1770904921608-frame-4.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/fc807305-3d11-4e40-9439-97ee4562d5b7/1770903908541-frame-8.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/fc807305-3d11-4e40-9439-97ee4562d5b7/1770903905725-frame-6.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/fc807305-3d11-4e40-9439-97ee4562d5b7/1770905111492-frame-7.png",
    ],
  },
  {
    id: "luna",
    discipline: "community",
    name: "Luna",
    specialty: "Lunettes & Optique",
    style: "Packshot",
    type: "Photo Lunettes",
    title: "Spécialiste lunettes — montures, solaires et accessoires optiques",
    avatar: lunaAvatar,
    sectorKey: "eyewear",
    frames: [2, 3, 4, 7, 9, 1],
    libellesCadrages: [
      "Close-up Texture",
      "In Context",
      "Levitation",
      "Extreme Detail",
      "Plan large décor",
      "Hero Shot",
    ],
    /* Prompts propres a ce plateau : sans eux, tous les profils
       partageaient la meme consigne de repli (JP, 07/09/2026). */
    promptsPortfolio: [
      `Close-up of the eyewear at three-quarter angle: acetate grain, hinge and temple detail, controlled reflections on the lenses, soft gradient background.`,
      `The frames placed in a styled optical setting: stone or wood surface, a folded case, a shaft of daylight casting a sharp shadow of the temples.`,
      `Eyewear levitating slightly open and tilted on a neutral coloured background matching the frame colour, weightless and intentional, soft rim light.`,
      `Extreme macro on one detail of the frames: hinge screw, lens edge, brand engraving on the temple, razor-sharp optics, no plastic rendering.`,
      `Wide styled scene: the eyewear small in a minimal architectural set, long shadows, generous negative space, editorial calm.`,
      `Front-facing hero shot of the eyewear, perfectly symmetrical, neutral background, even studio light, lenses clean with a single controlled highlight.`,
    ],
    sampleImages: [
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770965079491-frame-2.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770965073801-frame-3.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770965078617-frame-4.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770965069821-frame-7.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770965049387-frame-9.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770965043890-frame-1.png",
    ],
  },
  {
    id: "yuki",
    discipline: "community",
    name: "Yuki",
    specialty: "Électronique",
    style: "Packshot",
    type: "Photo Électronique",
    title: "Spécialiste électronique — smartphones, audio et gadgets high-tech",
    avatar: yukiAvatar,
    sectorKey: "electronics",
    frames: [1, 3, 4, 8, 9, 2],
    libellesCadrages: [
      "Hero Shot",
      "In Context",
      "Levitation",
      "Editorial Bold",
      "Plan large décor",
      "Close-up Texture",
    ],
    /* Prompts propres a ce plateau : sans eux, tous les profils
       partageaient la meme consigne de repli (JP, 07/09/2026). */
    promptsPortfolio: [
      `Front-facing hero shot of the device on a neutral seamless background, precise symmetry, crisp reflections, cool controlled studio lighting, screen or surface immaculate.`,
      `The device in a real usage setting: desk, cable, notebook, morning light through a window, tech lifestyle mood, product still perfectly readable.`,
      `The device levitating slightly tilted on a gradient background, weightless, soft rim light tracing the metal edges, subtle floor reflection.`,
      `Bold tech editorial: strong graphic background, device off-centre, hard directional light and coloured accents, high-contrast futuristic look.`,
      `Wide minimal scene: the device small on a large concrete or matte surface, long clean shadow, deep negative space, architectural calm.`,
      `Close-up on the materials of the device: brushed metal, glass, ports and buttons, macro optics, controlled specular highlights, tactile realism.`,
    ],
    sampleImages: [
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770966684293-frame-1.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770966671958-frame-3.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770966673078-frame-4.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770966666314-frame-8.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770966689171-frame-9.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770966685723-frame-2.png",
    ],
  },
  {
    id: "elena",
    withModel: true,
    discipline: "community",
    name: "Elena",
    specialty: "Mode",
    style: "Lifestyle",
    type: "Photo Mode",
    title: "Spécialiste mode — vêtements, accessoires et lookbooks tendance",
    avatar: elenaAvatar,
    sectorKey: "fashion",
    frames: [9, 8, 7, 6, 3, 1],
    libellesCadrages: [
      "Plan large décor",
      "Editorial Bold",
      "Extreme Detail",
      "Studio couleur",
      "In Context",
      "Hero Shot",
    ],
    /* Prompts propres a ce plateau : sans eux, tous les profils
       partageaient la meme consigne de repli (JP, 07/09/2026). */
    promptsPortfolio: [
      `Wide fashion scene: model wearing the piece full length in a styled location, natural light, relaxed editorial walk, garment silhouette fully readable.`,
      `Bold fashion editorial: coloured seamless backdrop, strong pose, hard light with a graphic shadow, saturated palette, campaign attitude.`,
      `Extreme detail of the garment: fabric weave, button, stitching or label, macro optics, soft directional light, tactile realism.`,
      `Studio shot on a coloured background: model in a clean three-quarter pose, even soft light, colours of the garment kept accurate.`,
      `The piece worn in a real-life context: street, café or interior, candid posture, daylight, lifestyle mood without losing the garment detail.`,
      `Front-facing hero shot of the piece worn straight on, neutral background, even studio light, clean lookbook framing.`,
    ],
    sampleImages: [
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770966947960-frame-9.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770966919290-frame-8.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770966945476-frame-7.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770966965186-frame-6.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770966950615-frame-3.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/9a02f834-5ad0-4836-964b-3c4c13102b9d/1770966914864-frame-1.png",
    ],
  },
  {
    id: "margot",
    withModel: true,
    discipline: "photographe",
    name: "Margot",
    specialty: "Éditorial + UGC",
    style: "Incarné",
    type: "Photo Éditorial & UGC",
    title: "Spécialiste UGC éditorial — selfies produit hyper-réalistes",
    avatar: margotAvatar,
    sectorKey: "beauty",
    edgeFunction: "generate-editorial-ugc-photos",
    sampleImages: MARGOT_SAMPLES,
  },
  {
    id: "isabelle",
    withModel: true,
    discipline: "community",
    name: "Isabelle",
    specialty: "Mode Lookbook Studio",
    style: "Portée",
    type: "Photo Lookbook",
    title: "Spécialiste lookbook mode fond blanc — poses éditoriales & détails produit haute couture",
    avatar: isabelleAvatar,
    sectorKey: "fashion",
    frames: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    promptsPortfolio: PROMPTS_ISABELLE_9,
    edgeFunction: "generate-fashion-lookbook-photos",
    sampleImages: [
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374300068-frame-1.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374325439-frame-2.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374349290-frame-3.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374371228-frame-4.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374404070-frame-5.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374430163-frame-6.png",
    ],
  },
  {
    id: "maxime",
    withModel: true,
    discipline: "photographe",
    name: "Maxime",
    specialty: "Chaussures Lookbook",
    style: "Portée",
    type: "Photo Chaussures Lookbook",
    title: "Spécialiste lookbook chaussures fond blanc — poses éditoriales & détails produit luxe",
    avatar: maximeAvatar,
    sectorKey: "fashion",
    edgeFunction: "generate-designer-mockup-photos",
    sampleImages: [
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374300443-frame-1.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374321672-frame-2.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374344052-frame-3.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374386554-frame-4.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374407840-frame-5.png",
      "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/product-creator/product-photos/5f02a89f-186b-406b-abaa-aa1186ee30ec/1788374431459-frame-6.png",
    ],
  },
  /* Photographe campagne lunettes : portfolio + prompts livrés par JP. */
  PHOTOGRAPHE_LUNETTES,
  /* Photographe beauté signature adgod.ai : 7 visuels Kaniwa + 7 prompts. */
  PHOTOGRAPHE_ADGOD,
];

/**
 * Un community manager alterne les styles ; chaque groupe de cadrages qui se
 * ressemble est en realite un photographe a part entiere, qui ne fait que ce
 * style. On ne duplique aucun moteur : meme fonction edge, meme prompts, on
 * restreint seulement la liste des cadrages joues.
 */
interface GroupeStyle {
  suffixe: string;
  nom: string;
  specialty: string;
  type: string;
  title: string;
  frames: number[];
  /** Ce plateau fait porter le produit par une personne. */
  mannequin?: boolean;
  /** Dérive vers un autre métier que "photographe" (ex : Adèle → community). */
  discipline?: DisciplineCreative;
  /** Prompts propres au plateau : priment sur le remappage des prompts du parent. */
  prompts?: string[];
  /** Cadrages du parent servant à la galerie, quand `frames` porte des positions de prompts. */
  framesVisuels?: number[];
}

/**
 * Un « style », c'est un SHOOTING : meme lieu, meme decor, meme lumiere, on
 * ne change que l'angle et la position. On regroupe donc les cadrages qui
 * partagent le plateau, jamais ceux qui partagent la technique.
 *
 * Cadrages generiques (`generate-product-photos`, GENERIC_CONFIG) :
 * 1 hero fond blanc, 2 macro texture, 3 en situation (decor), 4 levitation
 * fond couleur, 5 grille isometrique fond neutre, 6 levitation bis,
 * 7 detail extreme, 8 editorial bold (fond graphique), 9 plan large decor.
 * Trois plateaux s'en degagent : le studio fond neutre (1, 2, 5, 7), le fond
 * couleur en apesanteur (4, 6, 8) et le decor stylise (3, 9).
 *
 * Chaque plateau est tenu par une personne differente : trois prenoms, pas
 * trois declinaisons d'un meme prenom.
 */
function groupesGeneriques(noms: [string, string, string], univers: string): GroupeStyle[] {
  return [
    {
      suffixe: "studio-neutre",
      nom: noms[0],
      specialty: "Produit seul, fond neutre",
      type: "Photo Studio",
      title: `Un seul plateau studio ${univers}, produit seul sur fond neutre — même lumière, on change l'angle et l'inclinaison`,
      frames: [1, 5, 6],
    },
    {
      suffixe: "decor",
      nom: noms[1],
      specialty: "Décor stylisé",
      type: "Photo Decor",
      title: `Un seul décor ${univers} — même pièce, même lumière, du plan large au plan rapproché`,
      frames: [3, 8, 9],
    },
    {
      suffixe: "macro",
      nom: noms[2],
      specialty: "Macro matière",
      type: "Photo Macro",
      title: `Une seule série macro ${univers} — même table, même lumière rasante, cadrages très serrés`,
      frames: [2, 7],
    },
  ];
}


/* Prompts des clones Isabelle / Adèle / Marcus (JP, 07/09/2026) : 9 cadrages
   éditoriaux SANS aucune écriture sur l'image — seul le texte imprimé sur le
   packaging peut apparaître. Même produit que le shooting d'origine. */
const PROMPTS_CLONES_9: string[] = [
  "In Context — Product placed in an environment that naturally fits the brand and product category. Studio setting inspired by the product's own design elements and colours. Calm, credible, precisely lit. NO TEXT, no annotation, no overlay — only the text physically printed on the packaging.",
  "Editorial Bold — Product in an unexpected yet aesthetically strong setting that feels bold, editorial and visually striking. Studio-based and designer-driven. Sculpted light, one dominant colour block, a composition that elevates the brand. NO TEXT, no annotation, no overlay.",
  "Wide Lifestyle — Wide composition showing the product in use, placed within a refined designer setup. Clean props, controlled styling, cohesive with the rest of the series. Human presence implied, never staged. NO TEXT, no annotation, no overlay.",
  "Macro Matter — Extreme close-up on the product's material — glass reflection, matte lacquer, cream swirl, translucency. Abstract, sculptural, almost unrecognisable at first glance. Same colour world as the series. NO TEXT, no annotation, no overlay.",
  "Suspended — Product levitating slightly tilted against a seamless background drawn from its own palette. Soft grounded shadow, precise studio light, generous negative space around it. NO TEXT, no diagram, no annotation, no overlay.",
  "Raw Source — The raw materials of the product — leaves, seeds, powder, oil droplets, stone — arranged on a natural surface with the product standing among them. Kinfolk-like restraint, daylight quality. NO TEXT, no labels, no annotation, no overlay.",
  "Repetition — Multiple identical copies of the product arranged in a precise geometric order, seen from a top isometric angle. Every copy identical in packaging, label and colour. Rhythm, structure, graphic calm. NO TEXT, no tagline, no annotation, no overlay.",
  "Hand Held — A single hand holding the product against a plain studio background, skin and packaging both in sharp focus. Real skin texture, no retouching, natural nails. Scale and touch are the subject. NO TEXT, no annotation, no overlay.",
  "Negative Space — Product placed off-centre in a vast field of colour drawn from its palette, a single geometric shadow giving the frame structure. Extremely quiet, design-driven, the closing note of the grid. NO TEXT, no statistic, no descriptor, no overlay.",
];

const PROMPTS_ADELE_9: string[] = [
  "Hero sculptural still life — the EXACT reference product standing alone on a low raw-stone plinth, frontal three-quarter view, soft side daylight, restrained botanical shadow, tactile editorial realism. NO PERSON, NO TEXT, no annotation or overlay except text physically printed on the packaging.",
  "Macro material study — extreme close-up of the EXACT reference product among raw stone, folded linen and one dry botanical element, grazing light revealing packaging texture and reflections. NO PERSON, NO TEXT, no annotation or overlay except packaging print.",
  "Architectural pedestal — the EXACT reference product placed inside a minimal sculptural set of plaster blocks and curved paper, low camera angle, long clean shadow, palette derived from the product. NO PERSON, NO TEXT, no graphic overlay.",
  "Overhead still life — top-down composition of the EXACT reference product with three carefully spaced natural materials, asymmetrical museum-catalogue styling, quiet daylight and generous negative space. NO PERSON, NO TEXT, no annotation or overlay.",
  "Botanical silhouette — the EXACT reference product on a matte pedestal, a real branch outside the frame casting a delicate shadow across the set, precise product label and silhouette, calm premium atmosphere. NO PERSON, NO TEXT, no overlay.",
  "Monochrome alcove — the EXACT reference product nested in a shallow curved alcove built in one colour sampled from its packaging, soft frontal light, subtle floor reflection, centred sculptural composition. NO PERSON, NO TEXT, no overlay.",
  "Raw ingredients still life — the EXACT reference product surrounded by a restrained selection of real ingredients relevant to its category, arranged naturally on stone, close three-quarter framing, honest material detail. NO PERSON, NO TEXT, no labels or overlay.",
  "Levitating sculptural composition — the EXACT reference product floating slightly above a raw plinth with one small stone balancing the frame, believable grounded shadow, precise studio light, ample negative space. NO PERSON, NO TEXT, no diagram or overlay.",
  "Wide closing frame — the EXACT reference product small but readable in a broad sculptural landscape of plaster, stone and a single botanical accent, low horizon, soft late-afternoon light, coherent with the full series. NO PERSON, NO TEXT, no overlay.",
];

/**
 * Neuf positions, sans jamais trahir les prompts d'origine.
 *
 * 16/09/2026 (JP) : « c'est le portfolio qui me permet de sélectionner ». Les
 * Les positions absentes reprennent mot pour mot `/shot`. Aucun lieu, décor,
 * univers ou angle supplémentaire n'est inventé par cette couche.
 */
function neufPromptsCommunity(prompts: string[] | undefined): string[] | undefined {
  const propres = (prompts ?? []).map((prompt) => prompt.trim()).filter(Boolean);
  if (!propres.length) return undefined;
  if (propres.length >= 9) return propres.slice(0, 9);
  return PROMPTS_SHOT.map((prompt, index) => propres[index] || prompt);
}

const STYLES_DERIVES: Record<string, GroupeStyle[]> = {
  camille: [
    /* Lucie remontée en tête des profils dérivés de Camille (JP, 21/09/2026) :
       elle apparaît désormais avant Adèle, comme premier plateau dérivé. */
    { suffixe: "macro", nom: "Lucie", specialty: "Direction artistique sociale", type: "Photo Social Media", title: "Une semaine sociale complète : produit, Stories, Reels, TikTok et contenus éditoriaux", frames: [1, 2, 3, 4, 5, 6, 7, 8, 9], discipline: "community",
      /* Traces exactes des neuf images générées le 07/09/2026. Ces prompts ne
         sont ni déduits des photos, ni réécrits, ni complétés par /shot. */
      prompts: [...PROMPTS_PORTFOLIO_LUCIE_ORIGINAUX],
    },
    {
      /* Neuf positions de prompts : les prompts d'Adèle décrivent chacun la
         photo entière, le numéro ne sert que d'alignement (le texte part dans
         `frame_prompts` et prime côté moteur). La galerie reste sur les
         cadrages 3 et 8 du shooting de Camille via `framesVisuels`. */
      suffixe: "decor", nom: "Adèle", specialty: "Décor sculptural", type: "Photo Nature Morte", title: "Un seul plateau décor — socles, matières brutes, botanique, angles différents", frames: [3, 8, 3, 8, 3, 8], framesVisuels: [3, 8], discipline: "community",
      /* Prompts Adèle (JP, 07/09/2026) : nature morte SANS aucune écriture sur
         l'image — pas d'annotation, pas de ligne, seul le texte imprimé sur
         le packaging peut apparaître. */
      prompts: PROMPTS_ADELE_9,
    },
    { suffixe: "produit-seul", nom: "Noémie", specialty: "Produit seul", type: "Photo Packshot", title: "Un seul fond neutre — produit isolé, même lumière, positions différentes", frames: [1, 6] },
    /* Clones (JP, 07/09/2026) : trois community managers qui rejouent les 9
       cadrages éditoriaux sur le MÊME produit que Camille, sans écriture. */
    /* 14/09/2026 : ces trois profils empruntaient les prenoms d'Isabelle et
       d'Adele, qui existent DEJA plus haut dans la meme liste. L'annuaire
       affichait donc deux Adele et deux Isabelle, avec des specialites
       differentes, et la marchande choisissait au hasard. Un prenom est un
       identifiant a l'ecran : deux profils qui le partagent sont un seul
       profil pour qui regarde. */
    { suffixe: "clone-isabelle", nom: "Apolline", specialty: "Série éditoriale", type: "Photo Éditoriale", title: "Une seule série éditoriale — neuf cadrages, même produit, aucune écriture", frames: [1, 2, 3, 4, 5, 6, 7, 8, 9], discipline: "community", prompts: PROMPTS_CLONES_9 },
    { suffixe: "clone-adele", nom: "Jeanne", specialty: "Série éditoriale", type: "Photo Éditoriale", title: "Une seule série éditoriale — neuf cadrages, même produit, aucune écriture", frames: [1, 2, 3, 4, 5, 6, 7, 8, 9], discipline: "community", prompts: PROMPTS_CLONES_9 },
    { suffixe: "clone-marcus", nom: "Marcus", specialty: "Série éditoriale", type: "Photo Éditoriale", title: "Une seule série éditoriale — neuf cadrages, même produit, aucune écriture", frames: [1, 2, 3, 4, 5, 6, 7, 8, 9], discipline: "community", prompts: PROMPTS_CLONES_9 },
  ],

  isabelle: [
    { suffixe: "lookbook", mannequin: true, nom: "Garance", specialty: "Lookbook fond blanc", type: "Photo Lookbook", title: "Un seul lookbook fond blanc — même mannequin, trois-quarts, profil, dos, contrapposto", frames: [1, 6, 7, 9] },
    { suffixe: "mouvement", mannequin: true, nom: "Prune", specialty: "Mouvement", type: "Photo Mouvement", title: "Un seul shooting en marche — même plateau, le vêtement en mouvement", frames: [4, 8] },
    { suffixe: "produit-seul", nom: "Roxane", specialty: "Vêtement seul", type: "Photo Produit", title: "Une seule table produit — flat lay et isométrique, sans mannequin ni macro", frames: [3, 5] },
  ],
  sofia: groupesGeneriques(["Ines", "Clara", "Manon"], "culinaire"),
  aminata: groupesGeneriques(["Awa", "Fatou", "Nais"], "sportswear"),
  luna: groupesGeneriques(["Selma", "Iris", "Zoe"], "lunetterie"),
  yuki: groupesGeneriques(["Hana", "Mei", "Rina"], "high-tech"),
  elena: groupesGeneriques(["Alba", "Livia", "Nina"], "mode"),
};



/**
 * Uniquement les images du plateau. Pas de repli sur la serie entiere : une
 * galerie qui melange les plateaux redonne l'impression d'un feed.
 */
function echantillons(parent: AIPhotographer, frames: number[]): string[] {
  /* Dans l'ORDRE des cadrages du plateau derive, pas dans celui du parent :
     les prompts et les visuels s'alignent sur `frames` (JP, 07/09/2026). */
  return frames
    .map((n) =>
      (parent.sampleImages ?? []).find((u) => u.includes(`frame-${n}.`) || u.includes(`frame-${n}-`)),
    )
    .filter((u): u is string => Boolean(u));
}

/* Le complement de galerie a ete retire le 16/09/2026 : une photo sans prompt
   ne peut pas etre rejouee, donc elle n'a rien a faire dans un portfolio qui
   sert a choisir un rendu. */

/** Position d'un cadrage dans la liste du parent (defaut : cadrages 1 a 9). */
function positionCadrage(parent: AIPhotographer, frame: number): number {
  const base = parent.frames?.length ? parent.frames : [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return base.indexOf(frame);
}

export const PHOTOGRAPHES_DERIVES: AIPhotographer[] = Object.entries(STYLES_DERIVES).flatMap(
  ([parentId, groupes]) => {
    const parent = PHOTOGRAPHERS.find((p) => p.id === parentId);
    if (!parent) return [];
    return groupes
      .map((g) => ({
        ...parent,
        id: `${parentId}-${g.suffixe}`,
        discipline: g.discipline ?? ("photographe" as const),
        name: g.nom,
        specialty: g.specialty,
        type: g.type,
        title: g.title,
        derivedFrom: parent.name,
        /* Le plateau derive ne herite pas du mannequin du parent : Roxane
           photographie le vetement seul, Garance le fait porter. */
        withModel: g.mannequin === true,
        frames: (g.discipline ?? "photographe") === "community"
          ? [1, 2, 3, 4, 5, 6, 7, 8, 9]
          : g.frames,
        /* Le prompt d'une position derive de son NUMERO de cadrage chez le
           parent : sans ce remappage, Adele (cadrages 3 et 8) recevait les
           prompts 1 et 2 de Camille. */
        promptsPortfolio: g.discipline === "community"
          ? neufPromptsCommunity(
              g.prompts?.length
                ? g.prompts
                : parent.promptsPortfolio?.length
                  ? g.frames.map((n) => parent.promptsPortfolio?.[positionCadrage(parent, n)] ?? "")
                  : undefined,
            )
          : g.prompts?.length
            ? g.prompts
          : parent.promptsPortfolio?.length
            ? g.frames.map((n) => parent.promptsPortfolio?.[positionCadrage(parent, n)] ?? "")
            : undefined,
        libellesCadrages: parent.libellesCadrages?.length
          ? g.frames.map((n) => parent.libellesCadrages?.[positionCadrage(parent, n)] ?? "")
          : undefined,
        /* Un profil qui porte SES propres prompts ne montre plus le portfolio
           du parent : ces photos appartiennent à d'autres marques et, jointes
           au moteur comme référence de style, elles y ramenaient leur produit
           (JP, 07/09/2026). Ses positions restent vides tant qu'il n'a pas
           généré ses propres photos. */
        /* 16/09/2026 (JP) : plus aucune photo de complement. Ces variantes
           n'avaient pas de prompt derriere elles : la marchande choisissait un
           plateau sur une photo que la generation ne pouvait pas rejouer. */
        sampleImages: g.prompts?.length
          ? []
          : echantillons(parent, g.framesVisuels ?? g.frames),
      }))
      .filter((p) => p.promptsPortfolio?.length || p.sampleImages.length >= 2);

  },
);


/**
 * Le metier reel se lit dans les images produites, pas dans l'intitule :
 * un profil qui alterne studio, macro et lifestyle anime un feed
 * (community manager), un profil qui rejoue toujours le meme cadrage est un
 * photographe. On classe ici, une fois, pour tous les ecrans.
 */
/** Profils livres, groupes de style derives compris. */
/* 15/09/2026 (JP) : « je suis parti agence SEO/GEO, c'est vide », « et dans
   journaliste rien ». L'espace etait declare aux sept endroits, la route
   posee, le menu rempli, le palier de facturation choisi. Il manquait les
   gens. Un espace sans profils rend une liste de zero element. */
/**
 * VERROU PORTFOLIO → GENERATION (JP, 16/09/2026).
 *
 * « C'est le portfolio qui me permet de selectionner. » Donc une photo montree
 * en position N DOIT etre celle que le prompt de la position N rejoue. Toute
 * photo qui depasse la liste des prompts n'est racontee par aucun prompt :
 * elle sort de la galerie plutot que de promettre un rendu impossible.
 */
function alignerGalerie(profil: AIPhotographer): AIPhotographer {
  const prompts = (profil.promptsPortfolio ?? []).filter((p) => p?.trim());
  if (!prompts.length) return profil;
  const galerie = (profil.sampleImages ?? []).filter(Boolean);
  if (galerie.length <= prompts.length) return profil;
  return { ...profil, sampleImages: galerie.slice(0, prompts.length) };
}

/**
 * UN PHOTOGRAPHE = UN TYPE DE PHOTO, TROIS VARIANTES (JP, 16/09/2026).
 *
 * « Si je veux que des photos gros plan, je prends un photographe gros plan. »
 * Chaque profil ci-dessous ne joue qu'un seul cadrage de `/shot`, répété trois
 * fois, avec trois exécutions différentes de CE type (angle, distance,
 * lumière). Le type ne change jamais d'une variante à l'autre.
 *
 * La base est celle de Camille : c'est le seul plateau dont la qualité fait
 * référence. Seuls les types dont elle possède une vraie photo sont ouverts —
 * aucune image de remplissage n'est ajoutée pour meubler une galerie.
 */
const TYPES_PAR_PHOTOGRAPHE: { frame: number; nom: string; specialty: string; type: string }[] = [
  { frame: 1, nom: "Éloïse", specialty: "Photo héros", type: "Photo Hero" },
  { frame: 2, nom: "Salomé", specialty: "Gros plan texture", type: "Photo Gros plan" },
  { frame: 3, nom: "Victoire", specialty: "Produit en situation", type: "Photo En situation" },
  { frame: 6, nom: "Anouk", specialty: "Lévitation", type: "Photo Lévitation" },
  { frame: 7, nom: "Capucine", specialty: "Détail extrême", type: "Photo Détail" },
  { frame: 8, nom: "Solveig", specialty: "Éditorial bold", type: "Photo Éditoriale" },
];

const CAMILLE = PHOTOGRAPHERS.find((p) => p.id === "camille")!;

export const PHOTOGRAPHES_PAR_TYPE: AIPhotographer[] = TYPES_PAR_PHOTOGRAPHE.flatMap((t) => {
  const visuel = echantillons(CAMILLE, [t.frame]);
  if (!visuel.length) return [];
  const libelle = libelleDuType(t.frame);
  return [
    {
      ...CAMILLE,
      id: `camille-type-${t.frame}`,
      discipline: "photographe" as const,
      name: t.nom,
      specialty: t.specialty,
      type: t.type,
      title: `Un seul type de photo — trois ${t.specialty.toLowerCase()} différentes du même produit`,
      derivedFrom: CAMILLE.name,
      withModel: false,
      frames: [t.frame, t.frame, t.frame],
      promptsPortfolio: variantesDuType(t.frame),
      libellesCadrages: [`${libelle} 1`, `${libelle} 2`, `${libelle} 3`],
      /* Une seule photo de référence : celle que Camille a réellement produite
         pour ce type. Les deux autres positions restent vides tant que le
         plateau n'a pas généré ses propres variantes. */
      sampleImages: visuel,
    },
  ];
});

/**
 * Camille côté community manager (JP, 16/09/2026 : « les deux »).
 *
 * Même identité, mêmes prompts : ce profil LIT la source de Camille, il ne
 * recopie aucun texte. Il n'apparaît que dans la liste des community managers.
 */
export const CAMILLE_COMMUNITY: AIPhotographer = {
  ...CAMILLE,
  id: "camille-community",
  discipline: "community",
  /* Mêmes intitulés que la photographe : c'est la MÊME Camille, vue depuis la
     liste des community managers. Changer son style ou son secteur ici en
     ferait un second profil du même prénom, donc deux Camille à l'écran. */
  title: "La série packshot de Camille, déclinée pour un feed social",
  derivedFrom: CAMILLE.name,
};

export const TOUS_LES_PROFILS: AIPhotographer[] = [...PHOTOGRAPHERS, ...PHOTOGRAPHES_PAR_TYPE, CAMILLE_COMMUNITY, ...PHOTOGRAPHES_DERIVES, ...AGENCES_COIFFURE, ...AGENCES_MARKETING, ...AGENCES_SEO_GEO, ...AGENCES_UGC]
  .map((profil) =>
    profil.discipline === "community"
      ? {
          ...profil,
          frames: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          promptsPortfolio: neufPromptsCommunity(profil.promptsPortfolio),
        }
      : profil,
  )
  .map(alignerGalerie);

/**
 * LES DEUX PROFILS QUE JP VEUT VOIR EN PREMIER.
 *
 * 14/09/2026 : « rajoute Lucie dans Cowork », « Adele aussi ». Mesure faite
 * avant de corriger : elles y etaient DEJA, mais en huitieme et neuvieme
 * position sur douze. Il fallait faire defiler sept cartes pour les atteindre,
 * ce qui revient a ne pas les avoir.
 *
 * L'annuaire les remontait deja, avec cette meme liste ecrite en dur dans
 * CreateursUgcPage. Cowork, lui, affichait l'ordre brut. Deux ecrans, deux
 * ordres, pour la meme liste de profils : la marchande ne retrouvait pas dans
 * l'un ce qu'elle avait vu dans l'autre.
 */
export const COMMUNITY_EN_TETE = ["camille-macro", "camille-decor"];

/**
 * 16/09/2026 (JP) : « je ne vois pas les nouveaux photographes ». Ils étaient
 * bien là, mais en sixième position sur trente : il fallait défiler pour les
 * atteindre, ce qui revient à ne pas les avoir. Les plateaux par type de photo
 * passent donc en tête de l'annuaire Photographes, derrière Camille.
 */
export const PHOTOGRAPHES_EN_TETE = ["camille", ...PHOTOGRAPHES_PAR_TYPE.map((p) => p.id)];

/** Les profils d'un metier, les mis en avant d'abord. */
export function profilsOrdonnes(discipline: DisciplineCreative): AIPhotographer[] {
  const tous = photographesDe(discipline);
  const ordre =
    discipline === "community"
      ? COMMUNITY_EN_TETE
      : discipline === "photographe"
        ? PHOTOGRAPHES_EN_TETE
        : null;
  if (!ordre) return tous;
  const enTete = ordre
    .map((id) => tous.find((p) => p.id === id))
    .filter((p): p is AIPhotographer => Boolean(p));
  return [...enTete, ...tous.filter((p) => !ordre.includes(p.id))];
}

/** Le nombre de cases de la galerie d'un profil du catalogue : son portfolio,
    au plus la taille de la séance. Un profil du catalogue n'a pas de bouton
    pour créer une photo : les trois cases « Photo 7, 8, 9 » d'un portfolio de
    six ne menaient à rien (relecture du 10/10/2026, Sofia et Aminata). Sans
    portfolio, la carte annonce toujours la séance prévue. */
export function tailleGalerie(ph: { sampleImages?: string[] }, seance: number): number {
  const n = (ph.sampleImages ?? []).filter(Boolean).length;
  return n ? Math.min(seance, n) : seance;
}

export function photographesDe(discipline: DisciplineCreative): AIPhotographer[] {
  return TOUS_LES_PROFILS.filter((p) => (p.discipline ?? "photographe") === discipline);
}
