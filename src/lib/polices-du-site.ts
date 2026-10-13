/* Polices du site, autrefois importées en tête de src/index.css.

   L’accueil reprend lystes.ai/bio, qui charge Inter en 400 à 700 seulement :
   ses textes « font-light » s’y affichent en 400. Si Inter 300 est aussi
   chargée, les mêmes textes s’affichent plus fins que sur lystes.ai. Les
   polices du site ne sont donc posées que hors de l’accueil, une fois, au
   premier passage sur une autre page. */
import { useEffect } from "react";

const ADRESSE = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Krona+One&display=swap";
const ID = "polices-du-site";

export function usePolicesDuSite(chemin: string) {
  useEffect(() => {
    if (chemin === "/" || chemin.startsWith("/agents-ia") || document.getElementById(ID)) return;
    const lien = document.createElement("link");
    lien.id = ID;
    lien.rel = "stylesheet";
    lien.href = ADRESSE;
    document.head.appendChild(lien);
  }, [chemin]);
}
