/* Thème des pages du pied de page (14/10/2026) : /pourquoi-cette-offre,
   /etudes, /mentions-legales, /politique-confidentialite, /cgv, /faq,
   /a-propos, /tarifs.

   Elles s’affichent comme l’accueil, sous `.lystes-racine` (thème de
   lystes.ai). Leurs classes doivent donc sortir du thème de lystes.ai, pas
   de celui du site (cantonné hors `.lystes-racine`, postcss.config.js).
   Le dossier lystes/ est recopié depuis lystes.ai par un script : on n’y
   ajoute rien, on reprend son thème ici.

   `important: ".pied-page"` : ces classes ne valent que dans le cadre de
   ces pages (src/pages/pied/CadrePied.tsx). Chargées une fois, elles
   resteraient sinon actives sur l’accueil après une navigation, et
   repeindraient ses règles maison (.text-sm à 11 px, etc.). */
import type { Config } from "tailwindcss";
import theme from "../../../lystes/tailwind.config";

export default {
  ...theme,
  important: ".pied-page",
  content: [
    "./src/pages/pied/**/*.{ts,tsx}",
    "./src/pages/PourquoiCetteOffrePage.tsx",
    "./src/pages/PourquoiBiolystesPage.tsx",
    "./src/pages/MentionsLegalesPage.tsx",
    "./src/pages/PolitiqueConfidentialitePage.tsx",
    "./src/pages/CGVPage.tsx",
    "./src/pages/FaqPage.tsx",
    "./src/pages/AProposPage.tsx",
    "./src/pages/TarifsPage.tsx",
  ],
} satisfies Config;
