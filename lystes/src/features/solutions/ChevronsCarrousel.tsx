/**
 * Les deux petites flèches ‹ › des carrousels d'une ligne, sorties telles
 * quelles de la bannière (HomeHeroVideo, ligne « Installer sur… » ; 13/10/2026)
 * pour servir aussi aux trois points de l'en-tête de /bio. Même balisage,
 * mêmes classes (`lyh-install-chevs`, `lyh-install-chev`) : la bannière garde
 * ses styles ; ailleurs, la page appelante pose la couleur.
 */
export function ChevronsCarrousel({ precedent, suivant, libellePrecedent, libelleSuivant, className }: {
  precedent: () => void;
  suivant: () => void;
  libellePrecedent: string;
  libelleSuivant: string;
  className?: string;
}) {
  return (
    <div className={"lyh-install-chevs" + (className ? " " + className : "")}>
      <button type="button" className="lyh-install-chev lyh-install-chev--prev" aria-label={libellePrecedent} onClick={precedent}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <button type="button" className="lyh-install-chev lyh-install-chev--next" aria-label={libelleSuivant} onClick={suivant}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
      </button>
    </div>
  );
}
