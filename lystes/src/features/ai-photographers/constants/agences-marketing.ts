import type { AIPhotographer } from "../types";
import VISUELS from "@lystes/features/graphiste/example-visuals.json";

import avatarPackshot from "@lystes/assets/photographers/isabelle.jpg";
import avatarEditorial from "@lystes/assets/photographers/victoria.jpg";
import avatarPreuve from "@lystes/assets/photographers/maxime.jpg";
import avatarTexture from "@lystes/assets/photographers/luna.jpg";
import avatarNatif from "@lystes/assets/photographers/margot.jpg";
import avatarPromo from "@lystes/assets/photographers/elena.jpg";

/**
 * LES AGENCES MARKETING IA, UNE PAR STYLE DE DESIGN.
 *
 * 15/09/2026 (JP) : « l'idée est que le client choisit son agence en fonction
 * de son style », et « dans les inspirations graphiste, j'ai mis aussi le
 * graphiste présent ici pour avoir encore plus de style ». Puis, la veille :
 * « une agence marketing IA, comme agence de communication, qui contient son
 * organigramme par plateforme ».
 *
 * LES DEUX DEMANDES SE RÉCONCILIENT, et c'est ce que j'avais manqué trois fois.
 * Les AGENCES se distinguent par le STYLE : c'est ce qui permet de CHOISIR.
 * L'ORGANIGRAMME de chacune est par PLATEFORME : c'est ce qui permet de LIVRER.
 * Ce sont deux axes, pas un seul, et je les avais confondus à chaque essai.
 *
 * MES TROIS ERREURS AVANT D'Y ARRIVER, pour qu'elles ne soient pas refaites :
 *   1. six agences, une par PLATEFORME — une plateforme est un format, pas un
 *      style, et six agences identiques ne se choisissent pas ;
 *   2. trois agences copiées sur trois marques — mieux, mais tiré de trois
 *      références au lieu de la bibliothèque complète ;
 *   3. UNE agence — le bon organigramme, mais plus rien à choisir.
 *
 * D'OÙ VIENNENT CES SIX STYLES. De `src/features/graphiste/example-visuals.json`,
 * les cent visuels de référence que JP a réunis et que sert déjà
 * `lystes.ai/graphiste`. Je les ai TOUS regardés, en planches-contact, avant
 * d'écrire une ligne. Six familles s'en dégagent, et elles ne recoupent PAS les
 * quatre onglets de la page publique (Lifestyle, Studio, Éditorial, Promo) :
 * ces onglets classent le SUJET, ces six-là classent la GRAMMAIRE.
 *
 * LES PORTFOLIOS NE COÛTENT RIEN. Chaque agence montre les visuels RÉELS de sa
 * famille, ceux de la bibliothèque, servis par le site. Aucune génération, donc
 * aucun crédit, et une marchande voit du vrai travail au lieu d'une maquette.
 */

/** Un visuel de la bibliothèque, par son rang, tel que le site le sert. */
const v = (rang: number): string => (VISUELS as string[])[rang];

/**
 * Les neuf créatives d'une vague, une par format de plateforme.
 *
 * Le rythme est HEBDOMADAIRE : une régie sort une vague et la laisse tourner
 * avant de juger. `rythmeHebdomadaire("marketing")` le porte déjà.
 */
/* Les libellés portent le NOM du placement, pas seulement son format, parce
   que `budgetTexte` s'en sert pour décider combien de caractères tiennent.
   Mesuré avant de pousser : « Google 4:5 » ne contenait pas le mot Shopping,
   le budget tombait donc sur le cas général et une image de place de marché
   serait partie avec une accroche. Les places de marché refusent le texte
   promotionnel, et une image refusée ne sert à rien. */
const LIBELLES = [
  "Meta Story 9:16",
  "Meta feed 4:5",
  "Google Display 1:1",
  "Google Shopping 4:5",
  "TikTok 9:16",
  "Pinterest 2:3",
  "LinkedIn 1:1",
  "Snapchat 9:16",
  "Clôture feed 1:1",
];

/**
 * La grammaire commune, tenue par les six.
 *
 * Elle sort de la lecture des cent visuels : ce qu'ils font TOUS, quelle que
 * soit leur famille. Elle est posée en tête de chaque prompt parce qu'elle
 * décrit le cadre, pas l'intention.
 */
const SOCLE =
  "Brand mark small top-left, website top-right. ONE headline of two lines at most, never three ideas. " +
  "One short sub-line, or none. The product PHOTOGRAPHED, resting on a real material or held in a real hand, " +
  "with its contact point and cast shadow visible. At most one button, thin outline, pill shaped. " +
  "Palette taken from the product itself. No stock icon, no gradient behind the text, no drop shadow on type. " +
  "No claim of result, no superlative, no invented figure.";

const p = (corps: string): string => `${SOCLE} ${corps}`;

/** 1. Packshot annoté : le produit expliqué par des lignes fines. */
const PROMPTS_PACKSHOT = [
  p("Meta Story 9:16, off-white. The EXACT product floating slightly tilted, centred. FIVE THIN LINES radiate from it to five short benefit labels in small caps sans-serif, evenly spaced around it. A few capsules or particles of the product scattered and floating, casting tiny shadows. Bottom fifth kept clear of text."),
  p("Meta feed 4:5, off-white. The EXACT product standing on a pale stone plinth. A THIN CIRCLE is drawn around it; five small pictogram-and-label pairs sit on that circle. Soft top light, long soft shadow."),
  p("Google Display 1:1, off-white. The EXACT product cut out, left. Right: a vertical stack of five short benefit lines, each preceded by a thin line drawn back to the product. One flat button under the stack."),
  p("Google Shopping 4:5, pure white. The EXACT product centred, upright, three-quarter angle, no annotation, no text anywhere. Even margins on four sides, one soft shadow beneath."),
  p("TikTok 9:16, domestic surface, natural window light. The EXACT product lying on a real cluttered shelf, two annotation lines only, handwritten-looking, pointing to two details. Slightly imperfect framing."),
  p("Pinterest 2:3, off-white. The EXACT product tilted on raw fabric, THIN LINES to three ingredient names set very small. Vast empty space above. No button."),
  p("LinkedIn 1:1, cool grey. The EXACT product centred with ONE annotation line to a single factual specification. Nothing else. Restrained."),
  p("Snapchat 9:16, saturated colour field taken from the product. The EXACT product very large, tilted, two thick annotation lines only, short labels. Understood in under a second."),
  p("Closing frame 1:1, deep green field. The EXACT product alone, small, centred, one thin circle around it, brand mark beneath. No annotation."),
];

/** 2. Éditorial serif : l'accroche prend la place, le produit attend. */
const PROMPTS_EDITORIAL = [
  p("Meta Story 9:16, off-white. Headline in LARGE SERIF, two lines, upper third, one word in ITALIC for emphasis. The EXACT product enters from the bottom edge, cropped, very large. Two thirds of the frame is empty space."),
  p("Meta feed 4:5, warm beige. Headline in LARGE SERIF, two lines, left aligned, with a THIN VERTICAL RULE separating it from a second short line on the right. The EXACT product below, small, centred, held in a real hand."),
  p("Google Display 1:1, off-white. Headline in SERIF, two lines, centred at the top. The EXACT product beneath, upright. One outlined pill button at the bottom. Nothing else."),
  p("Google Shopping 4:5, pure white. The EXACT product centred, upright, no text at all. Even margins."),
  p("TikTok 9:16, real interior, daylight. A real hand pouring or using the EXACT product. Headline in SERIF across the top third, two lines, one word italic. Visible skin texture, no retouching."),
  p("Pinterest 2:3, soft neutral. Headline in LARGE SERIF in the top fifth, two lines. The EXACT product in the lower third on a natural material. The middle of the frame left deliberately empty."),
  p("LinkedIn 1:1, pale grey. Headline in SERIF, two lines, left. Right: the EXACT product, small, upright. One factual line beneath the headline. Sober, no emphasis."),
  p("Snapchat 9:16, deep single colour. Headline in LARGE SERIF, white, centred, two lines. The EXACT product below, backlit so the silhouette reads."),
  p("Closing frame 1:1, off-white. One short SERIF line, centred, and the EXACT product beneath it, small. Nothing else in frame."),
];

/** 3. Preuve chiffrée : un chiffre mesuré, ou rien. */
const PROMPTS_PREUVE = [
  p("Meta Story 9:16, off-white. ONE VERY LARGE NUMBER with a percent sign fills the upper half, heavy sans-serif. Beneath it one short factual line saying what it measures, and a small source note. The EXACT product in the lower third. The figure must come from real measured data, never invented."),
  p("Meta feed 4:5, pale field. A TWO-COLUMN COMPARISON TABLE, thin rules, tick marks in the left column, crosses in the right. The EXACT product beside the table, held in a real hand. Headline in sans-serif above."),
  p("Google Display 1:1, white. A star rating and a review count at the top, set small. The EXACT product centred. Five small pictogram-and-label pairs in a row at the bottom. One flat button."),
  p("Google Shopping 4:5, pure white. The EXACT product centred, upright, no figure, no text. Even margins."),
  p("TikTok 9:16, split screen with a vertical rule down the middle. Left labelled before, right labelled after, the EXACT product visible on the right side only. Real room, phone-camera light. No result claimed in words: only the two states are shown."),
  p("Pinterest 2:3, soft neutral. A VERTICAL STACK OF THREE FIGURES at the left, each with a short caption beneath. The EXACT product at the right, tall. Generous space."),
  p("LinkedIn 1:1, cool grey. ONE FIGURE only, large, with one factual line and a small source note beneath. The EXACT product small at the lower right. Nothing decorative."),
  p("Snapchat 9:16, saturated field. ONE HUGE FIGURE filling the upper half, one short line under it, the EXACT product at the bottom, cropped."),
  p("Closing frame 1:1, off-white. A single row of five tick marks with five short words beneath, the EXACT product small above. No figure."),
];

/** 4. Texture macro : la matière parle, le texte se tait. */
const PROMPTS_TEXTURE = [
  p("Meta Story 9:16. EXTREME MACRO on the material of the EXACT product, filling the whole frame: powder grain, gel droplets, cream ridges. The product itself appears only small in a corner, in focus. One very short line of type, lower left. Shallow depth of field, real light."),
  p("Meta feed 4:5. A GRID OF FOUR TEXTURE TILES, each a different material related to the product, one of them containing the EXACT product. Thin gutters between tiles. One short label per tile, very small."),
  p("Google Display 1:1, white. The EXACT product cut out on white with ONE round macro texture swatch beside it, as a colour and material reference. One short line. One flat button."),
  p("Google Shopping 4:5, pure white. The EXACT product centred, upright, no texture, no text. Even margins."),
  p("TikTok 9:16. Close crop on real skin with the product's material spread across it, the EXACT product resting beside it on the same surface. Natural window light, visible pores, no beauty filter, no retouching."),
  p("Pinterest 2:3. Full-bleed macro of a natural element the product is made from, leaf, root, powder, seen very close. The EXACT product small in the lower third, resting on it. One short line at the top."),
  p("LinkedIn 1:1, cool light. The EXACT product upright on a plain surface with a single macro detail of its own material enlarged beside it. Factual, quiet."),
  p("Snapchat 9:16. Full-bleed macro texture in a saturated colour, the EXACT product pressed into it, half visible. One very short word at the bottom."),
  p("Closing frame 1:1. Macro on the material alone, no product, no text, only the brand mark very small in a corner."),
];

/** 5. Natif plateforme : le visuel se déguise en interface. */
const PROMPTS_NATIF = [
  p("Meta Story 9:16, deep single colour. The frame imitates an INCOMING CALL SCREEN: a caller name at the top, the EXACT product where the avatar would be, two round buttons at the bottom, one red to decline, one green to accept. One short line above the buttons."),
  p("Meta feed 4:5, deep single colour. The frame imitates a PHONE NOTIFICATION CARD, rounded corners, a small app icon, a reminder line, a small action button. The EXACT product beneath the card on the same colour field."),
  p("Google Display 1:1, white. The frame imitates a SEARCH RESULT CARD: a small sponsored tag, a site name, a blue title line, a grey description. The EXACT product cut out at the right of the card."),
  p("Google Shopping 4:5, pure white. The EXACT product centred, upright, no interface, no text. Even margins."),
  p("TikTok 9:16. The frame imitates a SPONSORED IN-FEED POST: a small account row at the top with a sponsored label and a close cross, then the EXACT product on a deep colour field, then a short caption. Reads native, not designed."),
  p("Pinterest 2:3, soft field. The frame imitates a DELIVERY TRACKING STRIP: a thin horizontal line with two labelled dots at each end and a small marker along it. The EXACT product above it. Playful and quiet."),
  p("LinkedIn 1:1, cool grey. The frame imitates a QUOTED TESTIMONIAL CARD: a thin bordered box, a large quotation mark, a short quote, a first name, a star rating. The EXACT product beside the card. The quote must come from a real review, never invented."),
  p("Snapchat 9:16, saturated field. The frame imitates a WEATHER WIDGET or a lock screen, with the EXACT product substituted for the icon. One very short line."),
  p("Closing frame 1:1. A single message bubble on a plain field, one short line inside it, the EXACT product small beneath. Nothing else."),
];

/** 6. Promo directe : l'offre est le sujet, tout le reste sert. */
const PROMPTS_PROMO = [
  p("Meta Story 9:16, saturated field taken from the product. A ROUND PROMO STICKER, tilted, upper right, carrying a short offer. The EXACT product large and centred. One flat button at the bottom in a contrasting colour. Urgency without shouting."),
  p("Meta feed 4:5, split background of two flat colour blocks. The EXACT product on one side; on the other a short offer line, one guarantee line and one flat button. Thick clean edge between the blocks."),
  p("Google Display 1:1, white. The EXACT product cut out left. Right: a short offer headline, one guarantee line in small type, one flat rectangular button in a strong colour. Legible at 160 pixels wide."),
  p("Google Shopping 4:5, pure white. The EXACT product centred, upright, no sticker, no offer, no text. Even margins: a marketplace image never carries promotional text."),
  p("TikTok 9:16, real interior. A real hand holding the EXACT product, a small promo sticker overlaid in a corner as if added after the fact. Short caption in the platform's native style. Nothing staged."),
  p("Pinterest 2:3, soft field. The EXACT product in the lower half, a short offer line at the top, one outlined pill button between them. Calm even when promoting."),
  p("LinkedIn 1:1, cool grey. The EXACT product with one factual offer line and one flat button. No sticker, no urgency: the network refuses it."),
  p("Snapchat 9:16, very saturated field. A LARGE OFFER FIGURE at the top, the EXACT product filling the lower two thirds, one flat button."),
  p("Closing frame 1:1, plain field. One short offer line, the EXACT product small beneath, one flat button. Nothing else."),
];

export const AGENCES_MARKETING: AIPhotographer[] = [
  {
    id: "agence-packshot-annote",
    discipline: "marketing",
    name: "Nova",
    specialty: "Packshot annoté",
    style: "Packshot",
    type: "Agence marketing IA",
    title: "Le produit expliqué : lignes fines, bénéfices nommés, rien d'inventé",
    avatar: avatarPackshot,
    sectorKey: "beauty",
    /* Les visuels RÉELS de sa famille, pris dans la bibliothèque de
       `lystes.ai/graphiste`. Aucune génération, donc aucun crédit. */
    sampleImages: [v(0), v(2), v(5), v(8), v(13), v(15), v(35), v(58), v(88)],
    libellesCadrages: LIBELLES,
    promptsPortfolio: PROMPTS_PACKSHOT,
  },
  {
    id: "agence-editorial-serif",
    discipline: "marketing",
    name: "Isadora",
    specialty: "Éditorial serif",
    style: "Packshot",
    type: "Agence marketing IA",
    title: "L'accroche prend la place : grand serif, deux lignes, beaucoup de vide",
    avatar: avatarEditorial,
    sectorKey: "beauty",
    sampleImages: [v(45), v(55), v(59), v(66), v(69), v(77), v(78), v(93), v(67)],
    libellesCadrages: LIBELLES,
    promptsPortfolio: PROMPTS_EDITORIAL,
  },
  {
    id: "agence-preuve-chiffree",
    discipline: "marketing",
    name: "Maxence",
    specialty: "Preuve chiffrée",
    style: "Packshot",
    type: "Agence marketing IA",
    title: "Un chiffre mesuré, ou rien : tableaux, avant-après, cases cochées",
    avatar: avatarPreuve,
    sectorKey: "electronics",
    sampleImages: [v(28), v(34), v(62), v(64), v(74), v(82), v(3), v(17), v(94)],
    libellesCadrages: LIBELLES,
    promptsPortfolio: PROMPTS_PREUVE,
  },
  {
    id: "agence-texture-macro",
    discipline: "marketing",
    name: "Naïa",
    specialty: "Texture macro",
    style: "Texture",
    type: "Agence marketing IA",
    title: "La matière parle : macro, gouttes, poudre, peau, presque pas de texte",
    avatar: avatarTexture,
    sectorKey: "beauty",
    sampleImages: [v(37), v(40), v(46), v(47), v(54), v(83), v(84), v(87), v(80)],
    libellesCadrages: LIBELLES,
    promptsPortfolio: PROMPTS_TEXTURE,
  },
  {
    id: "agence-natif-plateforme",
    discipline: "marketing",
    name: "Margot",
    specialty: "Natif plateforme",
    style: "Lifestyle",
    type: "Agence marketing IA",
    title: "Déguisé en interface : appel entrant, notification, post sponsorisé",
    avatar: avatarNatif,
    sectorKey: "beauty",
    sampleImages: [v(20), v(23), v(25), v(51), v(63), v(96), v(27), v(31), v(90)],
    libellesCadrages: LIBELLES,
    promptsPortfolio: PROMPTS_NATIF,
  },
  {
    id: "agence-promo-directe",
    discipline: "marketing",
    name: "Kadi",
    specialty: "Promo directe",
    style: "Packshot",
    type: "Agence marketing IA",
    title: "L'offre est le sujet : sticker, bouton vif, garantie lisible",
    avatar: avatarPromo,
    sectorKey: "fashion",
    sampleImages: [v(38), v(43), v(65), v(73), v(94), v(50), v(60), v(61), v(75)],
    libellesCadrages: LIBELLES,
    promptsPortfolio: PROMPTS_PROMO,
  },
];
