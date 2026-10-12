/**
 * Le cadre du multi-lien, pour poser une page de la marque dedans.
 *
 * Demande de JP du 01/10/2026 : lystes.ai/<marque>/contact et /faq
 * « doivent s'inscrire dans le design du multi-lien, avec le logo, la
 * délimitation et tout ça du multi-lien ». Le contenu reste celui de la page,
 * seul le cadre change.
 *
 * Le cadre partage avec `BrandLinkPage.tsx` ses styles (`brandLinkPageStyles`)
 * et ses pièces (`MultiLienCommun` : le logo cerclé qui chevauche la carte, le
 * nom en capitales et le badge vérifié, le pied « Propulsé par Lystes AI »).
 * Il reprend aussi le fond `hsl(var(--muted))` et la carte blanche
 * `.blp-main-card` (333 px, coins hauts de 60).
 *
 * Deux écarts, voulus :
 *  - pas de `shadow-2xl` sur la carte. La charte ne veut aucune ombre, et
 *    celle du multi-lien est déjà rendue transparente par index.css (mesuré
 *    le 01/10 : box-shadow à rgba(0, 0, 0, 0)).
 *  - le nom de la marque est un paragraphe, pas un titre : le titre de la
 *    page (« Nous contacter », « Questions fréquentes ») est le seul h1. Le
 *    paragraphe porte les classes du h1 du multi-lien, et brandLinkPageStyles
 *    lui rend sa fonte et sa taille : Bricolage Grotesque, 12 px, 14 px sous
 *    850 px, mesurés identiques dans Chrome le 01/10 au soir.
 *
 * Arrivée depuis un lien du multi-lien, la page s'ouvrait à la hauteur où la
 * cliente avait cliqué (631 px plus bas sur un téléphone, mesuré le 01/10) :
 * logo, titre et retour hors de l'écran. Le cadre remonte en haut à chaque
 * navigation interne, sans toucher au retour du navigateur ni à une ancre.
 */
import { useEffect, type ReactNode } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { Link } from "@lystes/lib/lien-lystes";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { brandLinkPageStyles } from "@lystes/pages/BrandLinkPage";
import { LogoMultiLien, NomMultiLien, PiedMultiLien } from "@lystes/components/brand/MultiLienCommun";

export interface CadreMultiLienProps {
  nom: string;
  logoUrl?: string | null;
  verifie?: boolean;
  /** Où mène « Retour aux liens » : le multi-lien de la marque, ou sa boutique s'il n'existe pas. */
  retour: { chemin: string; multiLien: boolean } | null;
  children: ReactNode;
}

export function CadreMultiLien({ nom, logoUrl, verifie, retour, children }: CadreMultiLienProps) {
  const { t } = useTranslation();
  const { pathname, hash } = useLocation();
  const navigation = useNavigationType();

  /* Une navigation interne (clic sur un lien du multi-lien, « Contact » depuis
     la FAQ) ouvre la page en haut. Le retour du navigateur (POP) garde la
     position qu'il restaure, et une ancre garde sa cible. */
  useEffect(() => {
    if (navigation !== "PUSH" && navigation !== "REPLACE") return;
    if (hash || typeof window === "undefined" || window.scrollY === 0) return;
    window.scrollTo(0, 0);
  }, [pathname, hash, navigation]);

  return (
    <>
      <style>{brandLinkPageStyles}</style>
      <div className="blp-body p-4" style={{ background: "hsl(var(--muted))" }} data-cadre="multi-lien">
        <div className="blp-main-card">
          <LogoMultiLien nom={nom} logoUrl={logoUrl} />

          <div className="pt-20 text-center">
            <NomMultiLien nom={nom} verifie={verifie} libelleVerifie={t("cadreMultiLien.verifiee", "Marque vérifiée")} />
          </div>

          {retour && (
            <nav className="mb-6 text-left">
              <Link
                to={retour.chemin}
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.07em] text-[#777b7f] hover:text-[#231e1f] transition-colors"
              >
                <ArrowLeft className="h-3 w-3" strokeWidth={1.3} aria-hidden="true" />
                {retour.multiLien
                  ? t("cadreMultiLien.retourLiens", "Retour aux liens")
                  : t("cadreMultiLien.retourBoutique", "Retour à la boutique")}
              </Link>
            </nav>
          )}

          <div className="text-left">{children}</div>

          <PiedMultiLien propulse={t("cadreMultiLien.propulse", "Propulsé par")} />
        </div>
      </div>
    </>
  );
}
