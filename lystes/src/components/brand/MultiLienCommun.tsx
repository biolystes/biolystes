/**
 * Les pièces du multi-lien que lystes.ai/<marque> partage avec les pages
 * posées dans son cadre (contact, FAQ) : le logo cerclé qui chevauche la
 * carte, le nom de la marque et son badge, le pied « Propulsé par ».
 *
 * Demande de JP du 01/10/2026 : contact et FAQ « avec le logo, la délimitation
 * et tout ça du multi-lien ». Ces pièces étaient recopiées dans
 * `CadreMultiLien`, et la copie avait déjà dérivé : le nom y sortait en
 * Satoshi 12 px quand le multi-lien l'écrit en Bricolage Grotesque, 14 px sur
 * téléphone (mesuré dans Chrome le 01/10 au soir). Un seul dessin, lu par les
 * deux : une retouche du multi-lien vaut aussi pour le contact et la FAQ.
 *
 * Les styles restent ceux de `brandLinkPageStyles` (BrandLinkPage.tsx).
 */

/** Les douze pétales du sceau « vérifié », autour du cercle central.
 *  Repère fourni par JP le 04/10/2026 (SVG collé) : le même sceau, une fois
 *  agrandi de 18 % en blanc pour faire le liseré, une fois en noir posé dessus,
 *  puis la coche blanche. Dessiné dans un cadre de 24 × 24. */
const PETALES = [
  [19.8, 12], [18.75, 15.9], [15.9, 18.75], [12, 19.8], [8.1, 18.75], [5.25, 15.9],
  [4.2, 12], [5.25, 8.1], [8.1, 5.25], [12, 4.2], [15.9, 5.25], [18.75, 8.1],
];

const Sceau = ({ remplissage }: { remplissage: string }) => (
  <g fill={remplissage}>
    <circle cx="12" cy="12" r="5.4" />
    {PETALES.map(([cx, cy]) => (
      <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.4" />
    ))}
  </g>
);

/** Le logo cerclé, ou les deux premières lettres du nom quand la marque n'a pas de logo. */
export function LogoMultiLien({ nom, logoUrl }: { nom: string; logoUrl?: string | null }) {
  return (
    <div className="blp-profile-wrapper">
      {logoUrl ? (
        <img src={logoUrl} alt={nom} className="blp-profile-img" />
      ) : (
        <div className="blp-profile-img flex items-center justify-center text-xl font-semibold text-gray-700">
          {nom.substring(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
}

/**
 * Le nom de la marque et son badge.
 *
 * `titre` : sur le multi-lien, le nom est le titre de la page (h1). Sur le
 * contact et la FAQ, la page a son propre titre : le nom y est un
 * paragraphe, aux mêmes classes, et `brandLinkPageStyles` lui rend ce que la
 * règle globale des titres donne au h1 (la fonte, la taille de 12 px).
 *
 * Le sceau est posé en absolu (règle `.verified`) à droite du nom : il sort du
 * flux, donc le nom reste centré dans la carte.
 */
export function NomMultiLien({
  nom,
  verifie,
  titre = false,
  libelleVerifie,
}: {
  nom: string;
  verifie?: boolean;
  titre?: boolean;
  /** Le nom du badge pour un lecteur d'écran. */
  libelleVerifie?: string;
}) {
  const Balise = titre ? "h1" : "p";
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      <div className="relative">
        <Balise className="blp-nom text-xl font-bold tracking-tight uppercase">{nom}</Balise>
        {verifie && (
          <svg className="verified" viewBox="0 0 24 24" role="img" aria-label={libelleVerifie ?? "Vérifié"}>
            <g transform="translate(12 12) scale(1.18) translate(-12 -12)">
              <Sceau remplissage="#ffffff" />
            </g>
            <Sceau remplissage="#111111" />
            <path className="tick" d="M7.3 12.3l3.1 3.1 6.3-6.6" />
          </svg>
        )}
      </div>
    </div>
  );
}

/** Le pied « Propulsé par Lystes AI ». Le libellé vient de la page qui le pose. */
export function PiedMultiLien({ propulse }: { propulse: string }) {
  return (
    <footer className="text-center pt-8 pb-4">
      <a
        href="https://lystes.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        {propulse} <span className="font-medium">Lystes AI</span>
      </a>
    </footer>
  );
}
