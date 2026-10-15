/* Bandeau « biolystes.com est en ligne » (JP, 15/10/2026) : carte sombre posée
   en haut du catalogue, photo estompée à droite, titre, phrase, bouton et croix
   de fermeture. Le bandeau se ferme pour la session (sessionStorage) : il ne
   revient pas à chaque changement de catégorie, mais réapparaît à la session
   suivante. Couleurs de la marque : noir #121212, crème #f5f4df — jamais de blanc pur. */
import { useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import bannierePhoto from "@/assets/banniere-nouveau-site.jpg";

const CLE_SESSION = "nouveau_site_banniere_fermee";

const NOIR = "#121212";
const CREME = "#f5f4df";

export default function NouveauSiteBanner() {
  const [ferme, setFerme] = useState(() => {
    try {
      return sessionStorage.getItem(CLE_SESSION) === "1";
    } catch {
      return false;
    }
  });

  if (ferme) return null;

  const fermer = () => {
    try {
      sessionStorage.setItem(CLE_SESSION, "1");
    } catch {
      /* navigation privée : le bandeau se ferme quand même pour la page */
    }
    setFerme(true);
  };

  return (
    <aside
      aria-label="Nouveau site Biolystes"
      className="relative overflow-hidden rounded-[28px]"
      style={{ background: NOIR }}
    >
      {/* Photo : pleine largeur sur téléphone, moitié droite sur ordinateur.
          L'absence de padding sur la carte évite que l'image, absolutely
          positionnée, ne soit décalée sous le remplissage et ne laisse une
          bande noire en haut. */}
      <img
        src={bannierePhoto}
        alt="Portrait d'une cliente au naturel, peau nue, éclairage doux"
        loading="lazy"
        width={1024}
        height={1024}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-40 sm:w-2/3 sm:opacity-100"
      />
      {/* Dégradé qui noie la photo dans le noir pour garder le texte lisible. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/90 to-[#121212]/30 sm:via-[#121212]/70 sm:to-transparent"
      />

      <div className="relative max-w-xl px-6 py-8 md:px-12 md:py-12">
        <h2
          className="text-2xl font-semibold leading-tight md:text-[28px]"
          style={{ color: CREME }}
        >
          biolystes.com est en&nbsp;ligne
        </h2>
        <p className="mt-3 text-sm md:text-base" style={{ color: `${CREME}b3` }}>
          Nouveau site est en ligne.
        </p>
        <a
          href="https://biolystes.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex items-center gap-3 rounded-full py-2 pl-5 pr-2 text-sm font-medium transition-transform hover:scale-[1.02]"
          style={{ background: CREME, color: NOIR }}
        >
          <span className="whitespace-nowrap">Voir le nouveau site</span>
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-full"
            style={{ background: NOIR, color: CREME }}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </a>
      </div>

      <button
        type="button"
        onClick={fermer}
        aria-label="Fermer le bandeau"
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-white/20"
        style={{ background: `${CREME}26`, color: CREME }}
      >
        <X className="h-4 w-4" />
      </button>
    </aside>
  );
}
