/**
 * Le plan éditorial d'un community manager : une base de prompts PAR RÉSEAU.
 *
 * Avant le 13/09/2026, un community manager n'avait qu'une seule série de neuf
 * prompts, écrite pour le feed Instagram et rejouée partout. Une story
 * ressemblait donc à un post, un TikTok à une photo produit, et LinkedIn
 * n'avait rien d'éditorial.
 *
 * La règle d'écriture n'est pas la même d'un réseau à l'autre — c'est la
 * décision de JP (13/09/2026) :
 *
 *   TikTok, Reels        UGC pur, filmé au téléphone. Aucune écriture.
 *   Stories Instagram    UGC + accroche écrite DANS l'image, style story.
 *   Feed Instagram       Mélange UGC / produit / macro / avant-après. Sans texte.
 *   X                    Avant-après et posts simples, lisibles en petit.
 *   LinkedIn             Éditorial : ingrédients, actualité, nouveautés, marque.
 *
 * Le feed reprend l'alternance d'Adèle (UGC, zoom, mise en scène) : c'est elle
 * qui plaisait. Les incrustations de texte en ont été retirées et déplacées
 * vers les stories, le seul endroit où elles sont voulues.
 *
 * Un profil sans prompt pour un réseau n'affiche rien pour ce réseau : il
 * n'emprunte jamais celui d'un autre.
 */
import type { PlateformeEditoriale } from "@lystes/components/mygpt/editorial-formats";

export interface ReglePlateforme {
  /** Une accroche écrite dans l'image est-elle voulue sur ce réseau ? */
  texteDansImage: boolean;
  /** Ce que le réseau attend, en une phrase lisible par le marchand. */
  nature: string;
}

export const REGLES_PLATEFORME: Record<PlateformeEditoriale, ReglePlateforme> = {
  "instagram-feed": {
    texteDansImage: false,
    nature: "Mélange UGC, photo produit, macro et avant/après. Aucune écriture sur l'image.",
  },
  "instagram-story": {
    texteDansImage: true,
    nature: "UGC avec une accroche courte écrite dans l'image, comme une vraie story.",
  },
  "instagram-reel": {
    texteDansImage: false,
    nature: "UGC filmé au téléphone, geste réel, cadrage imparfait. Aucune écriture.",
  },
  tiktok: {
    texteDansImage: false,
    nature: "UGC natif TikTok, première seconde d'une vidéo. Aucune écriture.",
  },
  linkedin: {
    texteDansImage: false,
    nature: "Éditorial : ingrédients, actualité, nouveautés, marque. Le texte est dans le post.",
  },
  x: {
    texteDansImage: false,
    nature: "Avant/après et visuels simples, lisibles en petit. Aucune écriture.",
  },
  facebook: {
    texteDansImage: false,
    nature: "Post de page : visuel clair, lisible dans un fil d'actualité. Aucune écriture.",
  },
  snapchat: {
    texteDansImage: true,
    nature: "Snap vertical plein écran, avec une accroche courte écrite dans l'image.",
  },
  pinterest: {
    texteDansImage: false,
    nature: "Épingle verticale : visuel inspirant et net, pensé pour la recherche visuelle. Aucune écriture.",
  },
  "google-ads": {
    texteDansImage: false,
    nature: "Visuel publicitaire de recherche ou display.",
  },
  "meta-ads": {
    texteDansImage: true,
    nature: "Créative publicitaire Meta, 4:5. Accroche dans le tiers haut, produit centré, un appel à l'action.",
  },
  /* 14/09/2026 (JP) : « marketing presenté comme le template agence PAR
     PLATEFORME, sauf qu'il s'agit de pub ». Chaque régie a sa nature propre :
     le format, la densité de texte et la place du logo ne se transposent pas.
     Une créative Meta en 4:5 avec accroche en haut est illisible en Shopping
     Google, où l'image doit être nue sur blanc. */
  "tiktok-ads": {
    texteDansImage: true,
    nature: "Créative TikTok 9:16, captée au téléphone, une accroche très courte. Ne doit pas ressembler à une publicité.",
  },
  "pinterest-ads": {
    texteDansImage: true,
    nature: "Épingle sponsorisée 2:3. Accroche dans le cinquième haut, le reste calme.",
  },
  "linkedin-ads": {
    texteDansImage: true,
    nature: "Créative professionnelle 1.91:1. Contexte de travail réel, ton sobre, une seule ligne d'accroche.",
  },
  "snapchat-ads": {
    texteDansImage: true,
    nature: "Verticale 9:16 plein cadre, immédiate. Deux mots au maximum.",
  },
};

/** La consigne de sortie ajoutée à tout prompt, selon la règle du réseau. */
export function regleTexteDe(plateforme: PlateformeEditoriale): string {
  return REGLES_PLATEFORME[plateforme].texteDansImage
    ? "One short hand-written-looking caption overlay is expected, native Instagram story style, maximum six words, no emoji wall, no sticker spam."
    : "NO TEXT, no caption, no sticker, no annotation, no overlay — the only text visible is the text physically printed on the product packaging.";
}

const SANS_TEXTE = regleTexteDe("instagram-feed");
const AVEC_TEXTE = regleTexteDe("instagram-story");

/**
 * La base livrée avec chaque community manager. Les prompts parlent toujours
 * du PRODUIT EXACT de l'image de référence : c'est la règle qui a manqué aux
 * anciens portfolios.
 */
export const PROMPTS_PAR_PLATEFORME: Partial<Record<PlateformeEditoriale, string[]>> = {
  /* Neuf positions, l'alternance d'Adèle conservée : nature morte, matière,
     UGC, mise en scène, avant/après. Aucune écriture. */
  "instagram-feed": [
    `Hero still life — the EXACT reference product standing alone on a raw-stone plinth, frontal three-quarter view, soft side daylight, tactile editorial realism. ${SANS_TEXTE}`,
    `Macro material study — extreme close-up of the EXACT reference product, grazing light revealing packaging texture, print and reflections, shallow depth of field. ${SANS_TEXTE}`,
    `UGC hand shot — a real person's hand holding the EXACT reference product at chest height, phone camera look, natural indoor daylight, real skin texture, no retouching. ${SANS_TEXTE}`,
    `Overhead still life — top-down composition of the EXACT reference product with three spaced natural materials, asymmetrical styling, generous negative space. ${SANS_TEXTE}`,
    `Before / after diptych — the same subject split in two halves within one frame, identical framing, lighting and distance on both sides, the EXACT reference product visible in the frame. Honest, believable difference, no graphic separator. ${SANS_TEXTE}`,
    `In-use lifestyle — the EXACT reference product being applied or used in a real domestic setting, human presence natural and unposed, mixed daylight, lived-in details. ${SANS_TEXTE}`,
    `Raw ingredients still life — the EXACT reference product surrounded by real ingredients relevant to its category, arranged on stone, close three-quarter framing. ${SANS_TEXTE}`,
    `Counter-top candid — the EXACT reference product standing on a bathroom or kitchen counter among everyday objects, imperfect phone framing, real clutter. ${SANS_TEXTE}`,
    `Wide closing frame — the EXACT reference product small but readable in a calm sculptural set, low horizon, late-afternoon light, coherent with the eight previous images. ${SANS_TEXTE}`,
  ],
  /* Stories : UGC + accroche écrite. C'est le seul réseau où le texte est voulu. */
  "instagram-story": [
    `Morning bathroom selfie — a real person holding the EXACT reference product near their face, damp hair, bare skin, window light, vertical 9:16 phone framing. ${AVEC_TEXTE}`,
    `Routine step — vertical close-up of hands applying or opening the EXACT reference product, phone held one-handed, slight motion blur, real bathroom light. ${AVEC_TEXTE}`,
    `Result of the day — a real person showing the result obtained with the EXACT reference product, front camera, warm indoor lamp light, honest expression. ${AVEC_TEXTE}`,
    `Restock story — the EXACT reference product placed among everyday objects, shot from above in vertical format, imperfect casual framing. ${AVEC_TEXTE}`,
    `Question story — a real person looking at the camera holding the EXACT reference product, vertical framing with empty space in the upper third for the caption. ${AVEC_TEXTE}`,
    `Behind the scenes — the EXACT reference product in a workspace or packing setting, hands in frame, vertical phone shot, raw and unstyled. ${AVEC_TEXTE}`,
  ],
  /* Reels et TikTok : UGC pur, première image d'une vidéo, jamais d'écriture. */
  "instagram-reel": [
    `First frame of a reel — a real person about to speak to the front camera while holding the EXACT reference product, vertical 9:16, natural home light, unposed. ${SANS_TEXTE}`,
    `Hands-only demo frame — top-down vertical shot of hands opening or using the EXACT reference product on a plain surface, phone camera realism. ${SANS_TEXTE}`,
    `Get-ready-with-me frame — a real person mid-routine in a mirror, the EXACT reference product visible on the shelf or in hand, vertical, mixed bathroom light. ${SANS_TEXTE}`,
  ],
  tiktok: [
    `TikTok opening frame — a real person filming themselves at arm's length holding the EXACT reference product, vertical 9:16, harsh honest light, amateur framing. ${SANS_TEXTE}`,
    `TikTok unboxing frame — point-of-view hands opening the packaging of the EXACT reference product on a bed or desk, vertical, real shadows. ${SANS_TEXTE}`,
    `TikTok reaction frame — close vertical shot of a real person's face and the EXACT reference product held beside it, genuine surprised expression, low-light sensor grain. ${SANS_TEXTE}`,
  ],
  /* LinkedIn : éditorial. Le texte du post porte le message, pas l'image. */
  linkedin: [
    `Ingredient close-up — the raw ingredients of the EXACT reference product laid out on a neutral surface next to the product, clean daylight, documentary clarity. ${SANS_TEXTE}`,
    `Product presentation — the EXACT reference product photographed as a professional catalogue shot, neutral background, precise studio light, packaging fully readable. ${SANS_TEXTE}`,
    `Founder at work — a person working in a studio, workshop or office with the EXACT reference product present on the desk, candid documentary photography, natural light. ${SANS_TEXTE}`,
    `New release — the EXACT reference product presented alongside its packaging and one supporting element, calm editorial composition, generous negative space. ${SANS_TEXTE}`,
  ],
  /* X : avant/après et posts simples, qui restent lisibles à petite taille. */
  x: [
    `Before / after — one frame split in two identical halves, same angle, same light, same distance, the EXACT reference product present. Readable at thumbnail size. ${SANS_TEXTE}`,
    `Single clean product shot — the EXACT reference product centred on a plain contrasting background, strong silhouette, no props, readable at thumbnail size. ${SANS_TEXTE}`,
    `Comparison line-up — the EXACT reference product placed beside a plain neutral reference object of known scale, frontal view, flat even light. ${SANS_TEXTE}`,
  ],
  /* Facebook : le visuel doit rester clair dans un fil d'actualité chargé. */
  facebook: [
    `Lifestyle in-use — the EXACT reference product held or used by a real person in a real home setting, warm daylight, friendly and unposed, readable at feed size. ${SANS_TEXTE}`,
    `Product hero on colour — the EXACT reference product centred on a soft solid-colour backdrop matching its packaging tones, even studio light, strong silhouette. ${SANS_TEXTE}`,
    `Social proof moment — a real person smiling naturally while holding the EXACT reference product, chest-up framing, phone photo realism, lived-in background. ${SANS_TEXTE}`,
    `Before / after pair — the same subject split in two halves within one frame, identical framing and light, the EXACT reference product visible. Honest, believable difference. ${SANS_TEXTE}`,
  ],
  /* Snapchat : plein écran vertical, l'accroche courte fait partie du snap. */
  snapchat: [
    `POV snap — front-camera vertical shot of a real person holding the EXACT reference product beside their face, harsh honest phone light, casual framing. ${AVEC_TEXTE}`,
    `Routine snap — vertical one-handed phone shot of hands opening or applying the EXACT reference product, real bathroom light, slight motion blur. ${AVEC_TEXTE}`,
    `Haul snap — the EXACT reference product placed among a few everyday objects, top-down vertical framing, imperfect and spontaneous. ${AVEC_TEXTE}`,
  ],
  /* Pinterest : vertical, inspirant, très net — l'épingle vit par l'image. */
  pinterest: [
    `Pin hero — the EXACT reference product standing on a clean pedestal against a soft neutral backdrop, vertical 2:3 framing, crisp editorial light. ${SANS_TEXTE}`,
    `Flat lay pin — top-down vertical composition of the EXACT reference product with two or three relevant props, generous spacing, Pinterest-style styling. ${SANS_TEXTE}`,
    `Routine step pin — vertical close shot of the EXACT reference product in use, one clear gesture, calm background, magazine-grade sharpness. ${SANS_TEXTE}`,
  ],
};

/**
 * Les neuf textes retrouvés dans `creative_profile_feeds.prompt_utilise` pour
 * les neuf photos du portfolio de Lucie générées le 07/09/2026. Cette liste
 * suit les traces réelles, pas une recomposition à partir des images.
 */
export const PROMPTS_PORTFOLIO_LUCIE_ORIGINAUX = [
  PROMPTS_PAR_PLATEFORME["instagram-feed"]?.[0] ?? "",
  PROMPTS_PAR_PLATEFORME["instagram-story"]?.[0] ?? "",
  PROMPTS_PAR_PLATEFORME["instagram-story"]?.[1] ?? "",
  PROMPTS_PAR_PLATEFORME["instagram-story"]?.[2] ?? "",
  PROMPTS_PAR_PLATEFORME["instagram-reel"]?.[0] ?? "",
  PROMPTS_PAR_PLATEFORME.tiktok?.[0] ?? "",
  PROMPTS_PAR_PLATEFORME.linkedin?.[0] ?? "",
  PROMPTS_PAR_PLATEFORME.x?.[0] ?? "",
  PROMPTS_PAR_PLATEFORME.facebook?.[0] ?? "",
] as const;

/**
 * LES PROMPTS D'UN MÉTIER, ATTACHÉS À UN PROFIL.
 *
 * 15/09/2026 (JP) : « une agence de communication spécialisée salons de
 * coiffure ». La base ci-dessus parle toujours d'un PRODUIT posé : un salon,
 * lui, ne vend pas un flacon, il vend un résultat visible sur les cheveux
 * d'une cliente, dans son fauteuil. Rejouer la base sur un salon donnait des
 * packshots, exactement ce que la règle serveur `hairdressing` de
 * `shot-generate-frame` interdit depuis des mois.
 *
 * Un profil présent ici remplace la base, réseau par réseau. Un réseau absent
 * de son entrée retombe sur la base commune : on ne laisse jamais un réseau
 * sans prompt.
 */
const SALON = "Real hairdressing salon, real hairdresser at work, the result clearly visible on the client's own hair. Warm salon lighting, professional tools, natural skin texture, no flat product packshot, no stock-photo smile.";
const ACADEMIE = "Hairdressing academy session inside a real salon: a trainer demonstrating a technique to trainees, hands and gesture readable, mannequin heads or a real model. Warm salon lighting, professional tools, documentary realism, no flat product packshot.";

const PROMPTS_SALON: Partial<Record<PlateformeEditoriale, string[]>> = {
  "instagram-feed": [
    `${SALON} Hero result — a client in the chair after her service, three-quarter view, the finished hair fully readable, mirror softly out of focus behind. ${SANS_TEXTE}`,
    `${SALON} Macro hair study — extreme close-up of the finished texture, curl pattern or colour depth, grazing window light. ${SANS_TEXTE}`,
    `${SALON} Hands at work — the hairdresser's hands mid-gesture in the client's hair, scissors or brush visible, shallow depth of field. ${SANS_TEXTE}`,
    `${SALON} Before / after — one frame split in two identical halves, same client, same angle, same light, honest believable difference, no graphic separator. ${SANS_TEXTE}`,
    `${SALON} Colour process — foils, bowl and brush in use on the client's hair, overhead framing, real workbench clutter. ${SANS_TEXTE}`,
    `${SALON} Back view — the finished hair photographed from behind, full length visible, the salon readable but out of focus. ${SANS_TEXTE}`,
    `${SALON} Salon atmosphere — wide view of the room in service, chairs, mirrors, daylight, one client being styled in the foreground. ${SANS_TEXTE}`,
    `${SALON} Detail of the service used — the exact reference item in the hairdresser's hand while working, never posed alone on a shelf. ${SANS_TEXTE}`,
    `${SALON} Closing frame — the client standing at the door, finished hair catching late-afternoon light, calm and coherent with the eight previous images. ${SANS_TEXTE}`,
  ],
  "instagram-story": [
    `${SALON} Chair arrival — the client sitting down before the service, vertical 9:16 phone framing, raw salon light. ${AVEC_TEXTE}`,
    `${SALON} Mid-service snap — hands working the hair, vertical one-handed phone shot, slight motion blur. ${AVEC_TEXTE}`,
    `${SALON} Reveal — the mirror turned toward the finished result, vertical framing, honest expression. ${AVEC_TEXTE}`,
    `${SALON} Slot of the day — an empty chair in the lit salon, vertical framing with space in the upper third for the caption. ${AVEC_TEXTE}`,
    `${SALON} Care advice — the hairdresser holding the exact reference item beside the client's finished hair, vertical. ${AVEC_TEXTE}`,
    `${SALON} Closing time — the salon at the end of the day, tools tidied, warm lamps on, vertical phone shot. ${AVEC_TEXTE}`,
  ],
  "instagram-reel": [
    `${SALON} First frame of a reel — the hairdresser about to start the service, client seated, vertical 9:16, unposed. ${SANS_TEXTE}`,
    `${SALON} Hands-only demo frame — top-down vertical shot of the styling gesture on the hair. ${SANS_TEXTE}`,
    `${SALON} Transformation opening frame — the client before the service, vertical, plain salon background. ${SANS_TEXTE}`,
  ],
  tiktok: [
    `${SALON} TikTok opening frame — phone filmed at arm's length, hairdresser and client together in the mirror, vertical, harsh honest light. ${SANS_TEXTE}`,
    `${SALON} TikTok process frame — point-of-view of the hands sectioning the hair, vertical, amateur framing. ${SANS_TEXTE}`,
    `${SALON} TikTok reaction frame — close vertical shot of the client's face seeing the result, genuine expression, sensor grain. ${SANS_TEXTE}`,
  ],
  linkedin: [
    `${SALON} Team at work — the salon in service, several stations busy, documentary photography, natural light. ${SANS_TEXTE}`,
    `${SALON} Craft detail — the hairdresser's tools laid out on the workbench beside the chair, precise clean light. ${SANS_TEXTE}`,
    `${SALON} Professional portrait — the hairdresser in the salon, tools in hand, sober editorial framing, no studio backdrop. ${SANS_TEXTE}`,
    `${SALON} New service announcement — the result of the new service on a real client, calm composition, generous negative space. ${SANS_TEXTE}`,
  ],
  x: [
    `${SALON} Before / after split frame, same client, same angle, readable at thumbnail size. ${SANS_TEXTE}`,
    `${SALON} Single clean result shot — the finished hair against a plain contrasting salon wall, strong silhouette. ${SANS_TEXTE}`,
    `${SALON} Tool in hand — the hairdresser's hand holding the working tool close to the hair, frontal, flat even light. ${SANS_TEXTE}`,
  ],
  facebook: [
    `${SALON} Client and hairdresser together after the service, chest-up framing, warm daylight, friendly and unposed. ${SANS_TEXTE}`,
    `${SALON} Salon front or reception, welcoming and lit, readable at feed size. ${SANS_TEXTE}`,
    `${SALON} Before / after pair in one frame, identical framing and light, honest difference. ${SANS_TEXTE}`,
    `${SALON} Result of the week — the finished hair in three-quarter view, mirror behind, warm light. ${SANS_TEXTE}`,
  ],
  snapchat: [
    `${SALON} POV snap — front camera, hairdresser and finished client side by side, vertical, harsh phone light. ${AVEC_TEXTE}`,
    `${SALON} Process snap — hands in the hair, vertical one-handed shot, motion blur. ${AVEC_TEXTE}`,
    `${SALON} Free slot snap — empty chair, salon lights on, vertical, spontaneous. ${AVEC_TEXTE}`,
  ],
  pinterest: [
    `${SALON} Pin hero — the finished hairstyle photographed vertically 2:3, crisp editorial light, calm background. ${SANS_TEXTE}`,
    `${SALON} Colour inspiration pin — close vertical shot of the colour result in daylight, gradient fully readable. ${SANS_TEXTE}`,
    `${SALON} Step pin — vertical close shot of one clear styling gesture, magazine-grade sharpness. ${SANS_TEXTE}`,
  ],
};

const PROMPTS_ACADEMIE: Partial<Record<PlateformeEditoriale, string[]>> = {
  "instagram-feed": [
    `${ACADEMIE} Hero frame — the trainer demonstrating a cut on a model while trainees watch, three-quarter view. ${SANS_TEXTE}`,
    `${ACADEMIE} Macro gesture — extreme close-up of the trainer's hands holding the section and the tool. ${SANS_TEXTE}`,
    `${ACADEMIE} Trainee at work — a trainee practising on a mannequin head, trainer's hand correcting the angle. ${SANS_TEXTE}`,
    `${ACADEMIE} Before / after of a training exercise, one frame split in two identical halves, honest difference. ${SANS_TEXTE}`,
    `${ACADEMIE} Bench view — mannequin heads, combs and clips lined up before a session, overhead framing. ${SANS_TEXTE}`,
    `${ACADEMIE} Board moment — the trainer explaining a technique to the group, salon in the background. ${SANS_TEXTE}`,
    `${ACADEMIE} Full room — the academy session in progress, several stations, daylight. ${SANS_TEXTE}`,
    `${ACADEMIE} Material used — the exact reference item in the trainer's hand during the demonstration, never posed alone. ${SANS_TEXTE}`,
    `${ACADEMIE} Closing frame — the group at the end of the session, finished work visible, warm late light. ${SANS_TEXTE}`,
  ],
  "instagram-story": [
    `${ACADEMIE} Session start — the room filling up, vertical 9:16 phone framing. ${AVEC_TEXTE}`,
    `${ACADEMIE} Technique in progress — the trainer's hands on the section, vertical, slight motion blur. ${AVEC_TEXTE}`,
    `${ACADEMIE} Trainee result — the work finished on a mannequin head, vertical, honest light. ${AVEC_TEXTE}`,
    `${ACADEMIE} Remaining seats — an empty station ready, vertical framing with space in the upper third. ${AVEC_TEXTE}`,
    `${ACADEMIE} Question moment — a trainee asking the trainer, vertical, candid. ${AVEC_TEXTE}`,
    `${ACADEMIE} End of session — tools tidied, room empty, warm lamps on, vertical. ${AVEC_TEXTE}`,
  ],
  "instagram-reel": [
    `${ACADEMIE} First frame — the trainer about to demonstrate, group out of focus behind, vertical 9:16. ${SANS_TEXTE}`,
    `${ACADEMIE} Hands-only frame — top-down vertical shot of the demonstrated gesture. ${SANS_TEXTE}`,
    `${ACADEMIE} Practice frame — a trainee repeating the gesture, vertical, plain background. ${SANS_TEXTE}`,
  ],
  tiktok: [
    `${ACADEMIE} TikTok opening frame — phone at arm's length, trainer speaking to the camera in the salon, vertical. ${SANS_TEXTE}`,
    `${ACADEMIE} TikTok technique frame — point-of-view of the hands working the section, vertical, amateur framing. ${SANS_TEXTE}`,
    `${ACADEMIE} TikTok result frame — the trainee's finished work held toward the camera, vertical, sensor grain. ${SANS_TEXTE}`,
  ],
  linkedin: [
    `${ACADEMIE} Certification moment — the trainer handing a certificate to a trainee in the salon, sober documentary light. ${SANS_TEXTE}`,
    `${ACADEMIE} Training bench — tools and mannequin heads prepared for a session, precise clean light. ${SANS_TEXTE}`,
    `${ACADEMIE} Trainer portrait — the trainer in the academy, tools in hand, editorial and sober. ${SANS_TEXTE}`,
    `${ACADEMIE} New programme — a session in progress, calm composition, generous negative space. ${SANS_TEXTE}`,
  ],
  x: [
    `${ACADEMIE} Before / after of a training exercise, split frame, readable at thumbnail size. ${SANS_TEXTE}`,
    `${ACADEMIE} Single clean shot of the finished training work against a plain wall. ${SANS_TEXTE}`,
    `${ACADEMIE} Tool in hand during the demonstration, frontal, flat even light. ${SANS_TEXTE}`,
  ],
  facebook: [
    `${ACADEMIE} Group photo at the end of a session, warm daylight, unposed. ${SANS_TEXTE}`,
    `${ACADEMIE} Academy room ready before a session, welcoming and lit, readable at feed size. ${SANS_TEXTE}`,
    `${ACADEMIE} Before / after of a trainee's exercise in one frame, identical framing and light. ${SANS_TEXTE}`,
    `${ACADEMIE} Trainer demonstrating to the group, three-quarter view. ${SANS_TEXTE}`,
  ],
  snapchat: [
    `${ACADEMIE} POV snap — front camera, trainer and trainees behind, vertical, harsh phone light. ${AVEC_TEXTE}`,
    `${ACADEMIE} Practice snap — hands on the mannequin head, vertical, motion blur. ${AVEC_TEXTE}`,
    `${ACADEMIE} Seat left snap — an empty station ready, vertical, spontaneous. ${AVEC_TEXTE}`,
  ],
  pinterest: [
    `${ACADEMIE} Pin hero — the finished training work photographed vertically 2:3, crisp editorial light. ${SANS_TEXTE}`,
    `${ACADEMIE} Technique pin — close vertical shot of the demonstrated gesture, fully readable. ${SANS_TEXTE}`,
    `${ACADEMIE} Bench pin — tools and mannequin heads arranged vertically, calm styling. ${SANS_TEXTE}`,
  ],
};

/** Identifiants des profils qui portent leurs propres prompts par réseau. */
export const PROFIL_SALON_COIFFURE = "agence-salon-coiffure";
export const PROFIL_ACADEMIE_COIFFURE = "agence-academie-coiffure";

export const PROMPTS_PAR_PROFIL: Record<string, Partial<Record<PlateformeEditoriale, string[]>>> = {
  [PROFIL_SALON_COIFFURE]: PROMPTS_SALON,
  [PROFIL_ACADEMIE_COIFFURE]: PROMPTS_ACADEMIE,
};

/** Les prompts livrés pour un réseau ; liste vide si le réseau n'est pas tenu. */
export function promptsDePlateforme(plateforme: PlateformeEditoriale, profileId?: string): string[] {
  const propres = profileId ? PROMPTS_PAR_PROFIL[profileId]?.[plateforme] : undefined;
  return propres ?? PROMPTS_PAR_PLATEFORME[plateforme] ?? [];
}

/**
 * Le prompt d'un emplacement d'un réseau. On boucle sur la base quand le
 * marchand demande plus de contenus qu'il n'y a de prompts écrits — l'ordre
 * reste stable, donc le même emplacement redonne toujours le même prompt.
 *
 * Le profil est consulté en premier : une agence coiffure ne reprend jamais
 * les prompts « produit » de la base commune.
 */
export function promptDePlateforme(
  plateforme: PlateformeEditoriale,
  index: number,
  profileId?: string,
): string | undefined {
  const base = promptsDePlateforme(plateforme, profileId);
  if (!base.length) return undefined;
  return base[index % base.length];
}


/**
 * Le format d'image attendu par chaque réseau. Une story, un Reel et un
 * TikTok se regardent en plein écran vertical : les générer au format du
 * secteur (4:5) donnait des images recadrées à l'affichage.
 */
export const FORMAT_PLATEFORME: Record<PlateformeEditoriale, string> = {
  "instagram-feed": "4:5",
  "instagram-story": "9:16",
  "instagram-reel": "9:16",
  tiktok: "9:16",
  linkedin: "1:1",
  x: "16:9",
  facebook: "4:5",
  snapchat: "9:16",
  pinterest: "2:3",
  "google-ads": "1:1",
  "meta-ads": "1:1",
  "tiktok-ads": "1:1",
  "pinterest-ads": "1:1",
  "linkedin-ads": "1:1",
  "snapchat-ads": "1:1",
};
