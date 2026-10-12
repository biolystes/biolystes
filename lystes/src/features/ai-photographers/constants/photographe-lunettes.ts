/**
 * Marceau — photographe IA spécialisé lunettes (campagne éditoriale).
 *
 * Portfolio issu d'un vrai shooting de la paire « The Shade » (Jimmy Fairly) :
 * neuf visuels de campagne dans une palette orange-noir-blanc, chacun livré
 * avec le prompt exact qui l'a produit. Les prompts sont conservés pour que
 * les shootings futurs rejouent la même signature lumineuse.
 *
 * Visuels CDN (Lovable Assets) : src/assets/photographes/lunettes/.
 */
import type { AIPhotographer } from "../types";

import campagne1 from "@lystes/assets/photographes/lunettes/campagne-1.asset.json";
import campagne2 from "@lystes/assets/photographes/lunettes/campagne-2.asset.json";
import campagne3 from "@lystes/assets/photographes/lunettes/campagne-3.asset.json";
import campagne4 from "@lystes/assets/photographes/lunettes/campagne-4.asset.json";
import campagne5 from "@lystes/assets/photographes/lunettes/campagne-5.asset.json";
import campagne6 from "@lystes/assets/photographes/lunettes/campagne-6.asset.json";
import campagne7 from "@lystes/assets/photographes/lunettes/campagne-7.asset.json";
import campagne8 from "@lystes/assets/photographes/lunettes/campagne-8.asset.json";
import campagne9 from "@lystes/assets/photographes/lunettes/campagne-9.asset.json";

/** Prompts exacts du shooting, dans le même ordre que le portfolio. */
export const PROMPTS_LUNETTES_MARCEAU: string[] = [
  "a confident modern woman wearing the uploaded eyewear. oversized black tailored blazer, clean slick-back hairstyle, minimal gold hoop earrings, natural glowing skin. burnt orange seamless background with dramatic sunlight entering through window blinds creating bold shadow patterns across the face. camera positioned below eye level looking upward. large blurred foreground object crossing the frame naturally. luxury editorial photography, vogue campaign styling, cinematic lighting, shallow dof, selective focus on the glasses, orange-black-white palette, premium optical advertisement, ultra-realistic skin texture, 8k.",
  "luxury eyewear displayed between oversized white architectural blocks with dramatic orange sunlight entering through large windows. long geometric shadows fall across the white surfaces. clean minimalist luxury interior with black, white and orange styling. low camera angle emphasizing the product. crisp reflections on the frame, soft background blur, premium editorial lighting, luxury fashion campaign, magazine-quality product photography, ultra-realistic, shallow dof, 8k.",
  "luxury eyewear campaign photography. the eyewear is placed on a matte black stone pedestal inside a premium studio. the background is a warm orange gradient fading into black with a subtle white glow behind the product. soft haze creates visible light beams. dramatic side lighting produces long shadows while glossy reflections highlight the acetate finish. camera positioned extremely low, almost touching the surface, looking slightly upward toward the glasses. editorial composition with generous negative space for typography. ultra-realistic product photography, premium optical advertisement, vogue eyewear campaign aesthetic, 85mm lens, shallow depth of field, cinematic lighting, orange-black-white palette, 8k.",
  "luxury eyewear resting on natural black volcanic stone outdoors during golden hour. warm orange sunlight grazes one edge of the frame while the rest remains rich black. modern architectural buildings appear heavily blurred in the background. camera almost touching the stone surface with an upward perspective. editorial luxury advertisement, cinematic contrast, shallow depth of field, vogue fashion campaign, premium reflections, orange-black-white color grading, ultra-realistic, 8k.",
  "luxury eyewear placed on a clean white acrylic platform inside a minimalist studio. a translucent orange acrylic sheet passes in front of the lens creating premium foreground motion blur. directional spotlight creates cinematic highlights while maintaining sharp focus on the eyewear. camera positioned very low. luxury optical campaign, premium editorial styling, shallow depth of field, realistic reflections, orange-black-white palette, 50mm lens, 8k.",
  "luxury fashion portrait of a stylish man wearing the uploaded eyewear while walking through a modern city during sunset. warm orange sunlight illuminates one side of the face. foreground filled with heavily blurred pedestrians creating cinematic depth. camera positioned from waist level looking upward. black tailored wardrobe. editorial randomness, premium vogue aesthetic, soft motion blur, shallow depth of field, luxury magazine photography, orange-black-white color grading, ultra-realistic, 8k.",
  "luxury eyewear standing on a glossy black reflective table inside a premium architectural interior. vertical orange illuminated panels softly reflect on the lenses and glossy acetate frame. foreground is naturally blurred with abstract architectural elements. camera positioned extremely low for a cinematic perspective. dramatic contrast, luxury editorial composition, realistic reflections, premium optical advertisement, orange-black-white palette, ultra-realistic, 8k.",
  "extreme macro beauty shot focusing on one human eye wearing the uploaded eyewear. every eyelash, eyebrow hair, skin pore and reflection rendered in ultra-high detail. warm orange light naturally reflects inside the lens, the black acetate frame dominates the composition, premium luxury optical campaign, cinematic macro lighting, shallow focus, vogue beauty editorial, orange-black-white tones only, ultra-realistic macro photography, 100mm macro lens, 8k.",
  "luxury editorial portrait of a sophisticated woman wearing the uploaded eyewear. dramatic striped shadows from window blinds fall across the face and blazer. rich warm orange background mixed with deep black shadows. camera positioned extremely low looking upward to create a powerful fashion perspective. large blurred foreground object crossing naturally, selective focus keeps the eyewear razor sharp. luxury optical advertisement, vogue magazine cover quality, cinematic lighting, orange-black-white palette, realistic reflections, natural skin texture, ultra-realistic, 8k.",
];

export const PHOTOGRAPHE_LUNETTES: AIPhotographer = {
  id: "marceau",
  discipline: "photographe",
  name: "Marceau",
  specialty: "Lunettes Campagne",
  /* Ses cadrages vont « du packshot au portrait éditorial » et ses prompts
     décrivent la monture PORTÉE par un mannequin (08/09/2026). */
  style: "Portée",
  type: "Photo Lunettes Campagne",
  title:
    "Spécialiste campagne lunettes — lumière cinématique orange-noir-blanc, du packshot au portrait éditorial",
  avatar: campagne7.url,
  sectorKey: "eyewear",
  /* La campagne alterne produit posé et produit porté : le mannequin reste
     disponible sur ce profil. */
  withModel: true,
  sampleImages: [
    campagne1.url,
    campagne2.url,
    campagne3.url,
    campagne4.url,
    campagne5.url,
    campagne6.url,
    campagne7.url,
    campagne8.url,
    campagne9.url,
  ],
  libellesCadrages: [
    "Portrait stores vénitiens",
    "Blocs architecturaux",
    "Socle pierre noire",
    "Pierre volcanique",
    "Plaque acrylique orange",
    "Marche en ville",
    "Table noire laquée",
    "Macro regard",
    "Portrait contre-plongée",
  ],
  promptsPortfolio: PROMPTS_LUNETTES_MARCEAU,
};
