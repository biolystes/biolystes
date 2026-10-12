import type { AIPhotographer } from "../types";

import avatarSelfie from "@lystes/assets/photographers/victoria.jpg";
import avatarDeballage from "@lystes/assets/photographers/maxime.jpg";
import avatarRoutine from "@lystes/assets/photographers/luna.jpg";
import avatarAvis from "@lystes/assets/photographers/margot.jpg";
import avatarComparaison from "@lystes/assets/photographers/elena.jpg";
import avatarDemo from "@lystes/assets/photographers/aminata.jpg";

/**
 * L'AGENCE UGC IA : SIX FAÇONS DE NE PAS RESSEMBLER À UNE PUBLICITÉ.
 *
 * 15/09/2026. Trouvé par `aucune-agence-nest-vide.test.ts` le jour où il a été
 * écrit, et non par un humain : `photographesDe("ugc")` renvoyait ZÉRO profil.
 * La page `/dashboard/createurs-ugc` s'ouvrait donc sur une liste vide, comme
 * l'agence SEO/GEO, sans que personne l'ait remarqué.
 *
 * C'est le troisième espace dans ce cas en une matinée. La cause est toujours
 * la même : on déclare l'espace, la route, le menu et le palier de facturation,
 * quatre gestes visibles et vérifiés par des tests, et on oublie le cinquième,
 * invisible, qui est d'y mettre quelqu'un.
 *
 * CE QUI SÉPARE L'UGC DE TOUT LE RESTE. Une agence de communication cherche la
 * cohérence d'un feed. Une agence marketing cherche le clic. L'UGC cherche à
 * ne PAS être reconnu comme une publicité : cadrage imparfait, lumière du
 * logement, peau non retouchée, un geste en cours plutôt qu'une pose. Dès que
 * l'image devient belle au sens studio, elle est ignorée. C'est le seul métier
 * de la maison où la perfection technique est un défaut.
 *
 * AUCUN RÉSULTAT N'EST PROMIS dans ces prompts. Un avant-après qui affirme un
 * effet engage la boutique bien au-delà de ce qu'une photo peut prouver.
 */

/** Les six moments d'une séance UGC, du premier contact au verdict. */
const SCENES_SELFIE = [
  "UGC selfie, 9:16. La personne tient le produit près du visage, bras tendu vers la caméra du téléphone, lumière d'intérieur venue d'une fenêtre hors champ. Cadrage légèrement de travers. Peau non retouchée, pores visibles, aucun filtre de beauté. Le produit lisible mais pas mis en scène.",
  "UGC selfie, 9:16, dans une salle de bain réelle, encombrée : d'autres objets restent visibles autour. Le produit vient d'être posé sur le rebord. Regard vers la caméra, expression ordinaire, ni sourire commercial ni pose.",
  "UGC selfie, 9:16, pris à bout de bras dans une chambre, fin de journée, lumière chaude et basse. Le produit tenu contre la poitrine, partiellement dans l'ombre. Grain visible, comme une photo prise sans y penser.",
  "UGC selfie, 4:5, assise, le produit dans une main, un téléphone dans l'autre reflété dans un miroir. Le miroir porte des traces. Rien n'est nettoyé pour la photo.",
  "UGC selfie, 9:16, gros plan du visage et du produit côte à côte, mise au point sur le produit, visage légèrement flou. Mouvement perceptible.",
  "UGC selfie de clôture, 9:16, le produit tenu vers l'objectif, bras tendu, fond d'intérieur banal et flou. Une seule expression, franche.",
];

const SCENES_DEBALLAGE = [
  "UGC déballage, 9:16, vue en plongée sur des mains ouvrant le colis posé sur une table de cuisine. Le carton, le papier et le ruban restent dans le cadre. Lumière du plafond, pas de studio.",
  "UGC déballage, 9:16, le produit sorti à moitié de son emballage, tenu à deux mains. Emballage encore visible en bas de cadre. Aucun accessoire ajouté.",
  "UGC déballage, 1:1, à plat vu du dessus : le produit, son emballage ouvert et la facture, sur une table en bois ordinaire. Ombres dures d'un éclairage domestique.",
  "UGC déballage, 9:16, une main retire le film ou le sceau du produit, geste en cours, faible profondeur de champ.",
  "UGC déballage, 9:16, le produit posé à côté de deux objets quotidiens qui donnent son échelle réelle : une tasse, un trousseau de clés.",
  "UGC déballage de clôture, 9:16, le produit seul dans la main, emballage froissé au second plan. Fin de séquence.",
];

const SCENES_ROUTINE = [
  "UGC routine, 9:16, le produit utilisé dans son contexte réel, geste en cours, la personne ne regarde pas la caméra. Lumière du logement. Rien n'est posé pour la photo.",
  "UGC routine, 9:16, le produit dans la main au milieu d'autres produits déjà en place sur une étagère. Il n'est pas mis en avant, il est là.",
  "UGC routine, 4:5, vue du dessus du plan de travail pendant l'utilisation : le produit ouvert, d'autres objets autour, une trace d'usage visible.",
  "UGC routine, 9:16, le produit glissé dans un sac ou une poche, à moitié visible. Photo prise en marchant, léger flou de mouvement.",
  "UGC routine, 9:16, le produit posé sur un rebord de fenêtre au réveil, lumière du matin rasante. Personne dans le cadre.",
  "UGC routine de clôture, 9:16, le produit rangé à sa place définitive dans le logement. Banal et vrai.",
];

const SCENES_AVIS = [
  "UGC avis, 9:16, la personne parle face caméra en tenant le produit, à mi-poitrine, dans son salon. Expression en train de parler, bouche ouverte, pas une pose figée. Aucune promesse de résultat visible dans l'image.",
  "UGC avis, 9:16, assise sur un canapé, le produit posé sur le genou, regard légèrement hors caméra comme si elle réfléchissait.",
  "UGC avis, 4:5, le produit tenu à deux mains, tourné pour montrer une face précise, index qui désigne un détail.",
  "UGC avis, 9:16, debout dans une cuisine, produit dans une main, geste de l'autre main en cours d'explication.",
  "UGC avis, 9:16, plan rapproché du produit tenu devant la caméra, visage flou derrière. La personne montre plus qu'elle ne pose.",
  "UGC avis de clôture, 9:16, le produit reposé sur la table, mains à plat de part et d'autre, regard direct. Fin de propos.",
];

const SCENES_COMPARAISON = [
  "UGC comparaison, 1:1, le produit et l'objet qu'il remplace côte à côte sur une surface ordinaire, vus du dessus, même lumière pour les deux. Aucun avantage visuel donné à l'un.",
  "UGC comparaison, 9:16, les deux tenus chacun dans une main, à hauteur de poitrine, dans un intérieur réel.",
  "UGC comparaison, 4:5, les deux posés côte à côte avec un objet quotidien entre eux pour l'échelle. Rien n'est retouché.",
  "UGC comparaison, 9:16, la texture ou la matière des deux en très gros plan, dans le même cadre, lumière naturelle.",
  "UGC comparaison, 1:1, les deux emballages face à face, étiquettes lisibles, sur une table de cuisine.",
  "UGC comparaison de clôture, 9:16, une main repose l'un et garde l'autre. Le geste dit le choix, aucun texte ne l'affirme.",
];

const SCENES_DEMO = [
  "UGC démonstration, 9:16, un geste d'utilisation précis en cours, mains au premier plan, produit au centre, faible profondeur de champ. Filmé comme par une amie.",
  "UGC démonstration, 9:16, le produit ouvert et son contenu visible, tenu en biais vers la lumière d'une fenêtre.",
  "UGC démonstration, 4:5, vue du dessus des mains en train d'appliquer, de doser ou d'assembler. Une partie du geste sort du cadre.",
  "UGC démonstration, 9:16, gros plan sur la partie du produit qui fait le travail, avec une main autour. Aucune retouche de la peau.",
  "UGC démonstration, 9:16, deux étapes du même geste dans un cadre partagé haut et bas, même lieu, même lumière.",
  "UGC démonstration de clôture, 9:16, le produit reposé, geste terminé, mains encore dans le cadre. Rien n'est affirmé.",
];

/** L'UGC se livre par séance de six, pas par jour de semaine. */
const LIBELLES = [
  "Accroche",
  "Découverte",
  "Usage",
  "Détail",
  "Preuve",
  "Clôture",
];

export const AGENCES_UGC: AIPhotographer[] = [
  {
    id: "ugc-selfie",
    discipline: "ugc",
    name: "Inès",
    specialty: "Selfie",
    style: "Incarné",
    type: "Selfie produit",
    title: "Selfies bras tendu — lumière du logement, peau non retouchée",
    avatar: avatarSelfie,
    sectorKey: "beauty",
    sampleImages: [],
    libellesCadrages: LIBELLES,
    promptsPortfolio: SCENES_SELFIE,
  },
  {
    id: "ugc-deballage",
    discipline: "ugc",
    name: "Sofia",
    specialty: "Déballage",
    style: "Incarné",
    type: "Déballage colis",
    title: "Déballages — le carton reste dans le cadre",
    avatar: avatarDeballage,
    sectorKey: "electronics",
    sampleImages: [],
    libellesCadrages: LIBELLES,
    promptsPortfolio: SCENES_DEBALLAGE,
  },
  {
    id: "ugc-routine",
    discipline: "ugc",
    name: "Djenaba",
    specialty: "Routine",
    style: "Incarné",
    type: "Produit en usage",
    title: "Le produit là où il vit vraiment, pas là où il pose",
    avatar: avatarRoutine,
    sectorKey: "beauty",
    sampleImages: [],
    libellesCadrages: LIBELLES,
    promptsPortfolio: SCENES_ROUTINE,
  },
  {
    id: "ugc-avis",
    discipline: "ugc",
    name: "Louise",
    specialty: "Avis face caméra",
    style: "Incarné",
    type: "Témoignage",
    title: "Face caméra — en train de parler, jamais en train de poser",
    avatar: avatarAvis,
    sectorKey: "beauty",
    sampleImages: [],
    libellesCadrages: LIBELLES,
    promptsPortfolio: SCENES_AVIS,
  },
  {
    id: "ugc-comparaison",
    discipline: "ugc",
    name: "Hawa",
    specialty: "Comparaison",
    style: "Incarné",
    type: "Avant et après objet",
    title: "Deux objets, la même lumière, aucun avantage donné",
    avatar: avatarComparaison,
    sectorKey: "fashion",
    sampleImages: [],
    libellesCadrages: LIBELLES,
    promptsPortfolio: SCENES_COMPARAISON,
  },
  {
    id: "ugc-demo",
    discipline: "ugc",
    name: "Clémence",
    specialty: "Démonstration",
    style: "Incarné",
    type: "Geste d'utilisation",
    title: "Le geste en cours, filmé comme par une amie",
    avatar: avatarDemo,
    sectorKey: "beauty",
    sampleImages: [],
    libellesCadrages: LIBELLES,
    promptsPortfolio: SCENES_DEMO,
  },
];
