/**
 * L'APERÇU DE STYLE : voir le travail d'une agence AVANT de le payer.
 *
 * 15/09/2026 (JP), devant la page des agences marketing : « comment une
 * personne choisit une agence marketing si elle ne voit pas son style ? », et
 * « je ne vois aucun visuel rassurant ».
 *
 * MON ERREUR, ÉCRITE NOIR SUR BLANC LA VEILLE dans `agences-marketing.ts` :
 * « `sampleImages` reste vide à dessein : je n'ai aucune publicité déjà
 * produite à montrer ». Le raisonnement était honnête et le résultat
 * inutilisable. Une marchande arrivait devant six cartes identiques, neuf
 * carrés gris chacune, et n'avait aucun moyen de choisir. Un argument de
 * pureté qui empêche de choisir se retourne contre celui qu'il protège.
 *
 * CE QU'ON NE FAIT TOUJOURS PAS : afficher des photos produit ou les captures
 * de publicités d'autres marques. Les premières feraient passer pour du
 * travail livré ce qui n'existe pas ; les secondes sont les créations
 * d'annonceurs tiers, et les montrer comme le portfolio d'une agence lystes
 * serait un mensonge doublé d'un emprunt.
 *
 * CE QU'ON FAIT. Le style d'une agence publicitaire n'est pas dans le sujet de
 * l'image, il est dans sa MISE EN PAGE : un 4:5 avec accroche en haut ne
 * ressemble pas à une bannière avec bouton, qui ne ressemble pas à un 9:16
 * capté au téléphone. Une mise en page se dessine. Ces aperçus sont donc du
 * code, pas des images : ils coûtent zéro crédit, s'affichent instantanément,
 * et ne prétendent rien. Une marchande voit le cadre, la place du texte, les
 * proportions, et peut choisir.
 *
 * LE CAS GOOGLE SEARCH, que JP a relevé en premier : il n'y a pas d'image du
 * tout. Une annonce Search est du TEXTE. Son aperçu rend donc une annonce
 * texte, pas un cadre vide, sinon cette agence paraîtrait cassée alors qu'elle
 * est simplement d'une autre nature.
 */

/** Où l'accroche se pose dans le cadre. */
type PlaceTexte = "haut" | "bas" | "gauche" | "aucune";

export interface StyleDessine {
  /** Le format, tel qu'il est écrit dans les prompts du profil. */
  ratio: string;
  /** Proportion CSS correspondante, pour que le cadre soit juste. */
  aspect: string;
  placeTexte: PlaceTexte;
  /** Un bouton d'appel dessiné dans le cadre (bannières Display). */
  bouton?: boolean;
  /** La teinte du fond, prise dans l'identité de la plateforme. */
  fond: string;
  /** La couleur du bloc produit. */
  produit: string;
  /** Une phrase qui dit le parti pris, lue sous les cadres. */
  signature: string;
}

export interface ApercuProfil {
  /** Rendu particulier : une annonce texte, pas un visuel. */
  annonceTexte?: boolean;
  cadres: StyleDessine[];
  signature: string;
}

/* Les six agences publicitaires. Chaque entrée décrit ce que ses prompts
   demandent réellement : le format, la place de l'accroche, la présence d'un
   bouton. Rien n'est inventé ici, tout est relu depuis `agences-marketing.ts`. */
export const APERCUS: Record<string, ApercuProfil> = {
  /* 15/09/2026 : une seule agence marketing, donc un seul apercu. Il montre les
     TROIS grammaires de design qu'elle tient, prises dans les references de JP,
     et non six cadres identiques pour six agences qui n'existent plus. */
  "agence-marketing-ia": {
    signature:
      "Trois grammaires tenues : serif italique sur matiere brute, grotesque capitales a pastilles, sans moderne a texte courbe.",
    cadres: [
      { ratio: "9:16", aspect: "9 / 16", placeTexte: "haut", fond: "#2b2724", produit: "#d8d2cb", signature: "" },
      { ratio: "4:5", aspect: "4 / 5", placeTexte: "haut", fond: "#efece7", produit: "#3f4246", signature: "" },
      { ratio: "1:1", aspect: "1 / 1", placeTexte: "gauche", bouton: true, fond: "#f4f4f3", produit: "#3f4246", signature: "" },
      { ratio: "2:3", aspect: "2 / 3", placeTexte: "haut", fond: "#e9eef0", produit: "#3f4246", signature: "" },
    ],
  },
};

/** Un cadre dessiné : le format, la place du texte, le bloc produit. */
function Cadre({ style }: { style: StyleDessine }) {
  const barre = (largeur: string) => (
    <div className="rounded-[1px]" style={{ height: 3, width: largeur, background: "#9aa0a6" }} />
  );

  return (
    <div className="relative overflow-hidden rounded-[3px]" style={{ aspectRatio: style.aspect, background: style.fond }}>
      {/* Le format, lisible : c'est la première chose qui distingue deux agences. */}
      <span
        className="absolute right-[3px] top-[3px] rounded-[2px] px-[3px] text-[6px] font-semibold leading-[9px]"
        style={{ background: "rgba(255,255,255,0.82)", color: "#5f6368" }}
      >
        {style.ratio}
      </span>

      <div className="flex h-full flex-col justify-between p-[5px]">
        {style.placeTexte === "haut" ? (
          <div className="flex flex-col gap-[2px]">{barre("72%")}{barre("46%")}</div>
        ) : <div />}

        <div className={style.placeTexte === "gauche" ? "flex items-center gap-[4px]" : "flex justify-center"}>
          {style.placeTexte === "gauche" && (
            <div className="flex flex-1 flex-col gap-[2px]">{barre("88%")}{barre("60%")}</div>
          )}
          {/* Le produit : une forme, jamais une photo. On montre la place qu'il
              occupe dans le cadre, ce qui est précisément le parti pris. */}
          <div
            className="rounded-[2px]"
            style={{
              background: style.produit,
              opacity: 0.86,
              width: style.placeTexte === "gauche" ? "38%" : "42%",
              aspectRatio: "3 / 4",
            }}
          />
        </div>

        {style.placeTexte === "bas" ? (
          <div className="flex flex-col gap-[2px]">{barre("64%")}{barre("40%")}</div>
        ) : <div />}

        {style.bouton && (
          <div
            className="mt-[3px] rounded-[2px]"
            style={{ height: 7, width: "52%", background: "#1a73e8", opacity: 0.85 }}
          />
        )}
      </div>
    </div>
  );
}

/** L'annonce texte de Google Search : pas d'image du tout, c'est le sujet. */
function AnnonceTexte() {
  return (
    <div className="rounded-[3px] bg-white p-[6px]" style={{ border: "1px solid #eceff1" }}>
      <div className="flex items-center gap-[3px]">
        <span
          className="rounded-[2px] px-[3px] text-[6px] font-bold leading-[9px]"
          style={{ background: "#f1f3f4", color: "#202124" }}
        >
          Sponsorisé
        </span>
        <span className="text-[6px] leading-[9px]" style={{ color: "#5f6368" }}>
          votre-boutique.com
        </span>
      </div>
      <p className="mt-[3px] text-[9px] font-medium leading-[12px]" style={{ color: "#1a0dab" }}>
        Le titre de votre annonce, 30 signes
      </p>
      <p className="mt-[1px] text-[7px] leading-[10px]" style={{ color: "#4d5156" }}>
        La description, 90 signes, une promesse tenable et un seul appel à l'action.
      </p>
    </div>
  );
}

/**
 * L'aperçu complet, affiché à la place d'une grille vide.
 *
 * Il rend `null` pour un profil sans style déclaré : mieux vaut l'ancien état
 * vide, honnête, qu'un aperçu inventé pour remplir.
 */
export function ApercuStyle({ profilId }: { profilId: string }) {
  const apercu = APERCUS[profilId];
  if (!apercu) return null;

  return (
    <div className="mt-3">
      <p className="text-[8px] font-semibold uppercase leading-[11px] tracking-[0.06em]" style={{ color: "#777b7f" }}>
        Son style
      </p>

      {apercu.annonceTexte && (
        <div className="mt-[5px]">
          <AnnonceTexte />
        </div>
      )}

      <div className="mt-[5px] grid grid-cols-4 gap-1">
        {apercu.cadres.map((cadre, i) => (
          <Cadre key={i} style={cadre} />
        ))}
      </div>

      <p className="mt-[5px] text-[8px] leading-[11px]" style={{ color: "#777b7f" }}>
        {apercu.signature}
      </p>
      {/* On dit ce que c'est. Un aperçu pris pour une photo livrée serait le
          même mensonge que les photos produit qu'on refuse d'afficher. */}
      <p className="mt-[2px] text-[7px] leading-[10px]" style={{ color: "#9aa0a6" }}>
        Mises en page, pas des visuels livrés. Une première séance produit les vraies images.
      </p>
    </div>
  );
}
