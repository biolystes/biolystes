import { Newspaper } from "lucide-react";
import { FLECHE, STYLE_BOUTON_NOIR } from "./BoutonDiagFaq";

/**
 * Le bouton noir des entreprises (JP, 12/10/2026, version « Entreprises » des
 * étages) : là où une boutique a « Faire un diagnostic », une entreprise a
 * « Nos dernières actus ». Même dessin que BoutonDiagFaq (la pastille noire,
 * le badge AI, la petite phrase, la flèche), une icône d'actualité, et le
 * clic ouvre la page d'actualités de l'entreprise : son magazine sur
 * lystes.ai (/<marque>/mag, BlogMarquePage), écrit par l'agent Magazine IA.
 *
 * Utilisé pour l'instant dans les démonstrations de /business seulement :
 * le brancher sur le vrai multi-lien et sur le widget des sites est à
 * construire.
 */
export function BoutonActus({
  libelle = "Le magazine",
  libelleAction = "Nos dernières actus",
  ouvrir,
  deuxLignes = false,
}: {
  libelle?: string;
  libelleAction?: string;
  ouvrir: () => void;
  deuxLignes?: boolean;
}) {
  return (
    <>
      <style>{STYLE_BOUTON_NOIR}</style>
      <div className={"lystes-bdf lystes-actus" + (deuxLignes ? " deux-lignes" : "")}>
        <button type="button" className="lystes-bdf-bouton" onClick={ouvrir}>
          <span className="lystes-bdf-pastille">
            <Newspaper size={14} strokeWidth={1.8} aria-hidden="true" />
            {libelleAction}
            <span className="lystes-bdf-ai">AI</span>
          </span>
          <span className="lystes-bdf-libelle">{libelle}</span>
          <span className="lystes-bdf-fleche">{FLECHE}</span>
        </button>
      </div>
    </>
  );
}
