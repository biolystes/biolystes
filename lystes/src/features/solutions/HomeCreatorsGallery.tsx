/**
* Clone de la page /creator embarqué en page d'accueil.
* Pleine largeur, hauteur d'écran fixe, scroll interne (iframe).
* Cosmétique seulement (JP, 12/10/2026) : les autres secteurs restent sur /creator.
*/
import { useTranslation } from "react-i18next";
import { getJsxT } from "@lystes/i18n/jsx-locale";

/* `sansGeneration` (12/10/2026, /bio) : la galerie sans le panneau de
   génération ni la sélection d'un créateur. L'accueil garde le panneau.
   `secteur` (12/10/2026, /crea) : l'onglet de /creator ouvert, cosmétique
   par défaut, fashion sur /crea. */
export function HomeCreatorsGallery({
  sansGeneration = false,
  secteur = "cosmetique",
}: { sansGeneration?: boolean; secteur?: string } = {}) {
  const { i18n } = useTranslation();
  const lang = (i18n.language || "fr").substring(0, 2).toLowerCase();
  const t = getJsxT("home-blocks", lang);

  return (
    <section className="w-full bg-[#F4F4F5]">
      <div className="mx-auto max-w-5xl px-6 pt-24 pb-8 text-center md:pt-32">
        <p className="mb-5 text-[8px] md:text-[10px] font-bold tracking-[1.4px] md:tracking-[2.5px] text-neutral-500 text-balance">
          {t("UNE ÉQUIPE DE CRÉATEURS POUR VOTRE MARQUE")}
        </p>
        <h2 className="font-['Inter'] font-thin text-[28px] sm:text-[40px] md:text-[51px] leading-[1.15] md:leading-[1.1] tracking-tight max-w-[300px] sm:max-w-[640px] md:max-w-[780px] mx-auto mb-6 text-neutral-900 text-balance">
          {t("Toute une équipe de créateurs IA de contenu soutient votre marque")}
        </h2>
        <p className="text-[14px] md:text-[17px] text-neutral-600 leading-[1.7] mx-auto text-balance" style={{ maxWidth: 446 }}>
          {t("Choisissez vos créateurs, votre univers et générez en quelques secondes des contenus fidèles à votre image de marque.")}
        </p>
      </div>
      <iframe
        src={`https://lystes.ai/creator?embed=1&sector=${encodeURIComponent(secteur)}&lang=${encodeURIComponent(lang)}${sansGeneration ? "&generation=0" : ""}`}
        title={t("Créateurs de contenu IA")}
        loading="lazy"
        className="block h-[82dvh] md:h-[88dvh] w-full border-0"
      />
    </section>
  );
}

export default HomeCreatorsGallery;
