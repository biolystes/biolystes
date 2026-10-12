import type { AIPhotographer } from "../types";

import avatarEnquete from "@lystes/assets/photographers/victoria.jpg";
import avatarComparatif from "@lystes/assets/photographers/maxime.jpg";
import avatarGuide from "@lystes/assets/photographers/luna.jpg";
import avatarQuestions from "@lystes/assets/photographers/margot.jpg";
import avatarTerrain from "@lystes/assets/photographers/elena.jpg";
import avatarLexique from "@lystes/assets/photographers/aminata.jpg";

/**
 * L'AGENCE SEO/GEO IA : SIX JOURNALISTES, SIX FAÇONS D'ÊTRE TROUVÉE.
 *
 * 15/09/2026 (JP), devant la page : « je suis parti agence SEO/GEO, c'est
 * vide », puis « et dans journaliste rien ».
 *
 * IL AVAIT RAISON, ET LA CAUSE ÉTAIT ENTIÈREMENT DE MON FAIT. La veille,
 * j'avais déclaré l'espace `agences_seo_geo_ia` aux sept endroits qu'exige
 * `workspace-packs.ts`, posé sa route `/dashboard/agences-seo-geo-ia`, son
 * entrée de menu, son palier de facturation `starter`, et écrit un test qui
 * vérifiait que le menu contenait bien les quatre agences. Tout était vrai.
 * Il manquait les gens : `DISCIPLINES.journaliste` existait, aucun profil ne
 * la portait, et la page rendait donc une liste de zéro élément.
 *
 * LA LEÇON, qui vaut au-delà de ce fichier : mes tests mesuraient des
 * DÉCLARATIONS, pas des RÉSULTATS. Un test qui vérifie qu'un espace est
 * déclaré ne dit rien de ce qu'une marchande voit en l'ouvrant. Le seul test
 * qui aurait attrapé ça compte les profils rendus, et il est écrit en même
 * temps que ce fichier.
 *
 * SEO ET GEO, DEUX LECTEURS POUR UN SEUL TEXTE. Le SEO vise le moteur de
 * recherche, qui classe des pages. Le GEO vise les modèles de langage, qui
 * citent des passages. Ce qui les sert tous les deux : une question posée
 * telle que les gens la posent, une réponse nette dans les premières lignes,
 * des faits vérifiables et attribuables. Ce qui les dessert : le remplissage,
 * les superlatifs, et la promesse de résultat.
 *
 * LE RYTHME EST HEBDOMADAIRE, jamais quotidien. JP, 14/09 : « contrairement à
 * l'agence de communication, l'approche est à la semaine et pas aujourd'hui ».
 * Un article demande une recherche, et six articles par semaine tiennent un
 * blog vivant là où six par jour font un site de spam que Google déclasse.
 *
 * LE PIÈGE QUI LES FERAIT DISPARAÎTRE, et qui a déjà mangé d'autres profils :
 * le filtre de `photographers.ts` écarte EN SILENCE tout profil sans
 * `promptsPortfolio` et avec moins de deux visuels. Chaque journaliste porte
 * donc ses six sujets réels. Aucun ne peut disparaître sans qu'un test rougisse.
 */

/** Les six sujets d'une semaine d'enquête. */
const SUJETS_ENQUETE = [
  "Enquête, 1200 à 1500 mots. Question posée telle qu'une cliente la pose, en titre. Réponse nette dans les trois premières lignes, avant tout contexte. Puis ce que disent les sources, nommées, avec leur date. Une section « ce qui n'est pas prouvé » qui dit franchement où la recherche s'arrête. Aucun résultat promis.",
  "Enquête, 1200 mots, sur une croyance répandue du secteur du produit. Énoncer la croyance, dire d'où elle vient, puis ce qui la soutient et ce qui la contredit. Terminer sur ce qu'une cliente peut en faire concrètement. Aucun superlatif.",
  "Enquête comparative, 1400 mots, sur deux approches opposées du même besoin. Un tableau qui oppose coût, durée, effort et limite de chacune. Conclure en disant pour qui chacune convient, jamais laquelle est la meilleure.",
  "Enquête, 1000 mots, sur un ingrédient ou un composant du produit. Ce qu'il fait, à quelle concentration, sur quelle durée, et ce qui est encore débattu. Citer au moins trois sources datées et nommées.",
  "Enquête, 1200 mots, sur une réglementation ou une norme qui touche le produit. Ce qu'elle exige, depuis quand, ce qu'elle change pour une cliente. Lien vers le texte officiel.",
  "Enquête de clôture, 900 mots, qui répond en un paragraphe chacun aux six questions les plus posées du mois. Chaque réponse autonome, citable seule par un modèle de langage sans le reste de l'article.",
];

const SUJETS_COMPARATIF = [
  "Comparatif, 1500 mots, entre le produit et ses trois alternatives réelles. Un tableau en tête avec prix, format, durée et limite. Le produit n'y est pas avantagé : ce qui le dessert est écrit aussi.",
  "Comparatif de formats, 1200 mots : quelle version du produit pour quel usage. Un critère par section, une recommandation par profil de cliente.",
  "Comparatif de prix, 1200 mots : ce que coûte réellement le besoin sur un an, toutes solutions confondues, calcul montré. Aucune promesse d'économie.",
  "Comparatif, 1300 mots, entre faire soi-même et acheter. Temps, coût, risque, résultat attendu de chaque côté. Conclure honnêtement, même si la réponse est « faire soi-même ».",
  "Comparatif saisonnier, 1000 mots : ce qui change dans le besoin selon la période, et ce qu'il faut ajuster. Faits vérifiables uniquement.",
  "Comparatif de clôture, 900 mots : six erreurs d'achat fréquentes et comment les éviter, une par paragraphe autonome.",
];

const SUJETS_GUIDE = [
  "Guide pratique, 1200 mots, en étapes numérotées. Chaque étape porte sa durée et son matériel. La première ligne dit combien de temps prend l'ensemble. Aucune étape ne suppose un achat.",
  "Guide de démarrage, 1000 mots, pour la toute première utilisation. Ce qu'on ressent, ce qui est normal, ce qui ne l'est pas et doit faire arrêter.",
  "Guide de dépannage, 1200 mots : six problèmes fréquents, leur cause probable et le geste correctif. Un problème par section, citable seule.",
  "Guide d'entretien, 900 mots : comment faire durer le produit, à quelle fréquence, avec quoi. Chiffres de durée réels, jamais arrondis à l'avantage.",
  "Guide de routine, 1200 mots : où le produit se place dans une journée ou une semaine type, et avec quoi il ne se combine pas.",
  "Guide de clôture, 800 mots : la liste de contrôle en dix points, imprimable, sans commentaire superflu.",
];

const SUJETS_QUESTIONS = [
  "Page questions-réponses, 1500 mots, construite sur les questions réellement posées au service client. Chaque réponse tient en un paragraphe autonome de 40 à 80 mots, formulée pour être citée telle quelle par un modèle de langage.",
  "Questions-réponses, 1200 mots, sur les objections avant achat. L'objection est citée mot pour mot, la réponse ne la contourne pas.",
  "Questions-réponses, 1200 mots, sur l'usage : combien de temps, à quelle fréquence, avec quoi, pour qui. Réponses courtes et chiffrées.",
  "Questions-réponses, 1000 mots, sur la sécurité et les contre-indications. Dire clairement quand il ne faut pas utiliser le produit, et quand consulter.",
  "Questions-réponses, 1000 mots, sur la livraison, le retour et le remboursement. Chaque réponse exacte et vérifiable dans les conditions de vente.",
  "Questions-réponses de clôture, 900 mots : les six questions que les clientes posent APRÈS l'achat, celles qui décident du rachat.",
];

const SUJETS_TERRAIN = [
  "Reportage, 1300 mots, sur l'usage réel du produit par des clientes, à partir de leurs mots. Citations attribuées et datées, jamais reformulées pour flatter. Ce qui les a déçues figure aussi.",
  "Reportage, 1200 mots, sur une journée type d'une utilisatrice. Descriptif, concret, sans emphase. Le produit n'apparaît que là où il apparaît vraiment.",
  "Reportage, 1200 mots, sur la fabrication ou la provenance. Ce qu'on peut prouver, ce qu'on ne peut pas. Aucun nom de fournisseur.",
  "Reportage, 1000 mots, sur un retour d'expérience de trois mois. Ce qui a marché, ce qui n'a pas marché, sans conclusion forcée.",
  "Reportage, 1000 mots, sur ce que le service client entend le plus souvent, et ce que ça révèle du besoin.",
  "Reportage de clôture, 800 mots : six témoignages courts, chacun autonome, chacun daté.",
];

const SUJETS_LEXIQUE = [
  "Page de définition, 900 mots, sur un terme technique du secteur. La définition tient dans les deux premières lignes, le reste développe. Écrite pour être la source citée par un modèle de langage interrogé sur ce terme.",
  "Lexique, 1200 mots : dix termes du secteur, chacun défini en 60 mots autonomes, classés par ordre alphabétique.",
  "Page de définition, 900 mots, sur une unité ou une mesure qui revient dans les fiches produit. Ce qu'elle veut dire, ce qu'elle ne dit pas.",
  "Page de définition, 900 mots, sur un label ou une certification. Qui le délivre, ce qu'il garantit, ce qu'il ne garantit pas.",
  "Page de définition, 800 mots, distinguant deux termes que tout le monde confond. La distinction énoncée dès la première ligne.",
  "Lexique de clôture, 800 mots : les six abréviations du secteur, développées et expliquées, une par paragraphe.",
];

/** Le même intitulé de rythme pour les six : la semaine, pas la journée. */
const LIBELLES = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export const AGENCES_SEO_GEO: AIPhotographer[] = [
  {
    id: "journaliste-enquete",
    discipline: "journaliste",
    name: "Théodora",
    specialty: "Enquête",
    style: "Lifestyle",
    type: "Article d'enquête",
    title: "Enquêtes sourcées : ce qui est prouvé, et ce qui ne l'est pas",
    avatar: avatarEnquete,
    sectorKey: "beauty",
    sampleImages: [],
    libellesCadrages: LIBELLES,
    promptsPortfolio: SUJETS_ENQUETE,
  },
  {
    id: "journaliste-comparatif",
    discipline: "journaliste",
    name: "Bastien",
    specialty: "Comparatif",
    style: "Lifestyle",
    type: "Article comparatif",
    title: "Comparatifs honnêtes : y compris ce qui dessert le produit",
    avatar: avatarComparatif,
    sectorKey: "electronics",
    sampleImages: [],
    libellesCadrages: LIBELLES,
    promptsPortfolio: SUJETS_COMPARATIF,
  },
  {
    id: "journaliste-guide",
    discipline: "journaliste",
    name: "Maëlys",
    specialty: "Guide pratique",
    style: "Lifestyle",
    type: "Guide en étapes",
    title: "Guides en étapes : durée, matériel, geste correctif",
    avatar: avatarGuide,
    sectorKey: "beauty",
    sampleImages: [],
    libellesCadrages: LIBELLES,
    promptsPortfolio: SUJETS_GUIDE,
  },
  {
    id: "journaliste-questions",
    discipline: "journaliste",
    name: "Ranya",
    specialty: "Questions-réponses",
    style: "Lifestyle",
    type: "Page de questions",
    title: "Réponses citables telles quelles par une IA interrogée",
    avatar: avatarQuestions,
    sectorKey: "beauty",
    sampleImages: [],
    libellesCadrages: LIBELLES,
    promptsPortfolio: SUJETS_QUESTIONS,
  },
  {
    id: "journaliste-terrain",
    discipline: "journaliste",
    name: "Awa",
    specialty: "Reportage",
    style: "Lifestyle",
    type: "Reportage clientes",
    title: "Terrain : les mots des clientes, cités et datés",
    avatar: avatarTerrain,
    sectorKey: "fashion",
    sampleImages: [],
    libellesCadrages: LIBELLES,
    promptsPortfolio: SUJETS_TERRAIN,
  },
  {
    id: "journaliste-lexique",
    discipline: "journaliste",
    name: "Constance",
    specialty: "Définitions",
    style: "Lifestyle",
    type: "Page de définition",
    title: "Définitions : être la source que l'IA cite sur ce terme",
    avatar: avatarLexique,
    sectorKey: "beauty",
    sampleImages: [],
    libellesCadrages: LIBELLES,
    promptsPortfolio: SUJETS_LEXIQUE,
  },
];
