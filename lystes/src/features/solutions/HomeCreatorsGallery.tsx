/**
* Clone de la page /creator embarqué en page d'accueil.
* Pleine largeur, hauteur d'écran fixe, scroll interne (iframe).
* Cosmétique seulement (JP, 12/10/2026) : les autres secteurs restent sur /creator.
*/
import { useTranslation } from "react-i18next";
import { getJsxT } from "@lystes/i18n/jsx-locale";
import EnteteSection from "@lystes/components/bio/EnteteSection";
import { TEAM_ROLES } from "@lystes/features/ugc-creators/teamPresentation";
import "./home-team-gallery.css";

/* `sansGeneration` (12/10/2026, /bio) : la galerie sans le panneau de
   génération ni la sélection d'un créateur. L'accueil garde le panneau.
   `secteur` (12/10/2026, /crea) : l'onglet de /creator ouvert, cosmétique
   par défaut, fashion sur /crea. */
export function HomeCreatorsGallery({
  sansGeneration = false,
  secteur = "cosmetique",
  langue,
  enteteCommun = false,
  sansOnglets = false,
  equipes = false,
}: {
  sansGeneration?: boolean;
  secteur?: string;
  /* Langue imposée (pages en français seul, /bio) ; sinon celle du visiteur. */
  langue?: string;
  /* L'en-tête commun des blocs de /bio (14/10/2026) au lieu du grand titre. */
  enteteCommun?: boolean;
  /** Recadre la ligne de secteurs de la fenêtre intégrée (15/10/2026). */
  sansOnglets?: boolean;
  /** /agents-ia (16/10/2026) : la galerie « Vos équipes IA » de lystes.ai. */
  equipes?: boolean;
} = {}) {
  const { i18n } = useTranslation();
  const lang = langue ?? (i18n.language || "fr").substring(0, 2).toLowerCase();
  const t = getJsxT("home-blocks", lang);
  const src = `https://lystes.ai/creator?embed=1&sector=${encodeURIComponent(equipes ? "fashion" : secteur)}&lang=${encodeURIComponent(lang)}${equipes ? "&teams=1&generation=0" : sansGeneration ? "&generation=0" : ""}`;

  return (
    <section className="w-full bg-[#F4F4F5]">
      {enteteCommun ? (
        <div className="mx-auto max-w-5xl px-6 pt-12 pb-8 md:pt-16">
          <EnteteSection surtitre="Vos créateurs IA"
            noir="Toute une équipe de créateurs IA" gris={"au service de votre\u00a0marque."}
            texte={t("Choisissez vos créateurs, votre univers et générez en quelques secondes des contenus fidèles à votre image de marque.")} />
        </div>
      ) : (
      <div className="mx-auto max-w-5xl px-6 pt-24 pb-8 text-center md:pt-32">
        <p className="mb-5 text-[8px] md:text-[10px] font-bold tracking-[1.4px] md:tracking-[2.5px] text-neutral-500 text-balance">
          {equipes ? "VOS ÉQUIPES IA" : t("UNE ÉQUIPE DE CRÉATEURS POUR VOTRE MARQUE")}
        </p>
        <h2 className="font-['Inter'] font-thin text-[28px] sm:text-[40px] md:text-[51px] leading-[1.15] md:leading-[1.1] tracking-tight max-w-[300px] sm:max-w-[640px] md:max-w-[780px] mx-auto mb-6 text-neutral-900 text-balance">
          {equipes ? "Plusieurs équipes IA au service de votre marque" : t("Toute une équipe de créateurs IA de contenu soutient votre marque")}
        </h2>
        <p className="text-[14px] md:text-[17px] text-neutral-600 leading-[1.7] mx-auto text-balance" style={{ maxWidth: 446 }}>
          {equipes ? "Conseil produit, communication, photographie et diagnostic." : t("Choisissez vos créateurs, votre univers et générez en quelques secondes des contenus fidèles à votre image de marque.")}
        </p>
        {equipes && <div className="home-team-roles text-neutral-500" aria-label="Métiers des équipes IA">
          <div className="home-team-roles-track">
            {[0, 1].map((copy) => <div key={copy} className="home-team-roles-group" aria-hidden={copy === 1 || undefined}>
              {TEAM_ROLES.map((role) => <span key={role}>{role}</span>)}
            </div>)}
          </div>
        </div>}
      </div>
      )}
      {/* 15/10/2026 (JP, « enlève Fashion en page d’accueil ») : la ligne de
          secteurs de la fenêtre intégrée (Cosmétique, Fashion, Sport,
          Bien-être) est recadrée, la galerie gardant sa hauteur. Le fond du
          cadre (crème) est celui de la fenêtre elle-même : aucune couture. */}
      {sansOnglets ? (
        <div className="h-[calc(82dvh-64px)] md:h-[calc(88dvh-96px)] w-full overflow-hidden">
          <iframe
            src={src}
            title={t("Créateurs de contenu IA")}
            loading="lazy"
            className="block h-[82dvh] md:h-[88dvh] w-full border-0 -mt-16 md:-mt-24"
          />
        </div>
      ) : (
        <iframe
          src={src}
          title={t("Créateurs de contenu IA")}
          loading="lazy"
          className="block h-[82dvh] md:h-[88dvh] w-full border-0"
        />
      )}
    </section>
  );
}

export default HomeCreatorsGallery;
