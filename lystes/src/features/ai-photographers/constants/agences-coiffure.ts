import type { AIPhotographer } from "../types";
import {
  PROFIL_ACADEMIE_COIFFURE,
  PROFIL_SALON_COIFFURE,
  promptsDePlateforme,
} from "./prompts-plateformes";

import avatarSalon from "@lystes/assets/photographers/elena.jpg";
import avatarAcademie from "@lystes/assets/photographers/margot.jpg";

/**
 * LES DEUX AGENCES DE COMMUNICATION SPÉCIALISÉES SALONS DE COIFFURE.
 *
 * 15/09/2026 (JP) : « une agence de communication spécialisée salons de
 * coiffure, avec les prompts liés à ce qu'on a déjà fait, et la possibilité de
 * mettre son lieu si la personne veut que les photos soient shootées dans son
 * salon ».
 *
 * POURQUOI DEUX ET NON UNE. Un salon qui vend des prestations et un salon qui
 * enseigne ne racontent pas la même semaine : le premier montre un résultat
 * sur la cliente, le second montre un geste transmis. Mélanger les deux dans
 * un seul profil donnait un feed où l'on ne sait plus si l'on vend une couleur
 * ou une formation.
 *
 * LEURS PROMPTS NE SONT PAS ÉCRITS ICI. Ils vivent dans
 * `prompts-plateformes.ts`, par réseau, puisque c'est le réseau qui décide de
 * la règle d'écriture. Le portfolio reprend les neuf prompts du feed
 * Instagram : la fiche montre donc exactement ce que la semaine produira, au
 * lieu d'un second jeu de textes qui dérive du premier.
 */

const portfolio = (profileId: string) => promptsDePlateforme("instagram-feed", profileId);

export const AGENCES_COIFFURE: AIPhotographer[] = [
  {
    id: PROFIL_SALON_COIFFURE,
    discipline: "community",
    name: "Salima",
    specialty: "Salons de coiffure",
    style: "Lifestyle",
    type: "Agence de communication",
    /* 01/10/2026 : plus de tiret long, et plus d'« avant/après ». L'agence
       génère ses visuels et saute les prompts d'avant/après (règle E5 : un
       avant/après ne se montre qu'avec de vraies photos). La fiche promettait
       un format que la semaine ne livre pas. Les prompts, eux, ne bougent pas. */
    title: "La semaine d’un salon : résultat sur la cliente, geste réel",
    avatar: avatarSalon,
    sectorKey: "beauty",
    libellesCadrages: [
      "Résultat",
      "Matière",
      "Mains au travail",
      "Avant / après",
      "Couleur",
      "Vue de dos",
      "Ambiance salon",
      "Produit en main",
      "Sortie de salon",
    ],
    sampleImages: [],
    promptsPortfolio: portfolio(PROFIL_SALON_COIFFURE),
  },
  {
    id: PROFIL_ACADEMIE_COIFFURE,
    discipline: "community",
    name: "Iman",
    specialty: "Académies de coiffure",
    style: "Lifestyle",
    type: "Agence de communication",
    title: "La semaine d’un salon qui forme : démonstration, élèves, sessions",
    avatar: avatarAcademie,
    sectorKey: "beauty",
    libellesCadrages: [
      "Démonstration",
      "Geste",
      "Élève au travail",
      "Avant / après",
      "Plan de travail",
      "Explication",
      "Salle en session",
      "Matériel en main",
      "Fin de session",
    ],
    sampleImages: [],
    promptsPortfolio: portfolio(PROFIL_ACADEMIE_COIFFURE),
  },
];
