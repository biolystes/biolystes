/* Barre de filtres du catalogue (JP, 27/10/2026).
   Ordinateur : une bande gris clair arrondie, des boutons blancs à chevron
   (Catégorie, Étiquette, Type, Préoccupation, Principes actifs) et, à droite,
   « Trier par » et « Filtres » (pastille noire = nombre de filtres actifs).
   Le bouton ouvert a une bordure noire.
   - Catégorie : un panneau blanc arrondi en grille de 4 colonnes, une photo
     d'un de NOS produits de la catégorie et son nom dessous, coche verte en
     haut à gauche sur la catégorie choisie ;
   - les autres : un panneau blanc arrondi, deux colonnes de cases à cocher
     arrondies gris clair, « Tous les … » en premier, défilement fin.
   Téléphone : la même bande avec deux boutons, « Trier par » (1/3) et « Filtres »
   (2/3) ; « Filtres » ouvre un panneau plein écran, toutes les rubriques ouvertes
   (aucun accordéon), et un bouton « Voir les N soins ».
   Polices et couleurs : celles du site (aucune police posée ici). */
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ArrowDownUp, SlidersHorizontal, X } from "lucide-react";
import {
  ORDRE_FILTRES, TITRES_FILTRES, nombreFiltresActifs,
  type CleFiltre, type OptionFiltre, type Selection, type Tri,
} from "@/lib/filtres-catalogue";

const NOIR = "rgb(29,29,31)";
const BANDE = "#f3f4f5";
const CASE_GRISE = "#e9eaec";
const VERT_FOND = "#d9eedd";
const VERT_COCHE = "#2e7d4f";

const LIBELLE_TRI: Record<Tri, string> = { nouveautes: "Nouveautés", az: "A à Z" };

/* « Tous les … » en tête de chaque liste. */
const TOUS: Record<Exclude<CleFiltre, "categorie">, string> = {
  etiquette: "Toutes les étiquettes",
  type: "Tous les types",
  preoccupation: "Toutes les préoccupations",
  actif: "Tous les principes actifs",
};

/* Défilement fin des listes (même réglage que les autres panneaux du site). */
const DEFILEMENT_FIN = "[scrollbar-width:thin] [scrollbar-color:rgba(0,0,0,0.18)_transparent]";

function Case({ coche }: { coche: boolean }) {
  return (
    <span
      aria-hidden
      className="shrink-0 w-[22px] h-[22px] rounded-[7px] flex items-center justify-center"
      style={{ background: coche ? NOIR : CASE_GRISE }}
    >
      {coche && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
    </span>
  );
}

/** Liste de cases à cocher sur deux colonnes, « Tous les … » en premier. */
function ListeCases({
  cle, options, choisies, onBascule, onTous,
}: { cle: Exclude<CleFiltre, "categorie">; options: OptionFiltre[]; choisies: Set<string>; onBascule: (v: string) => void; onTous: () => void }) {
  const ligne = "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-left text-[15px] text-foreground hover:bg-black/5";
  return (
    <ul role="group" aria-label={TITRES_FILTRES[cle]} className="grid grid-cols-2 gap-x-2 gap-y-0.5">
      <li>
        <button type="button" role="checkbox" aria-checked={choisies.size === 0} onClick={onTous} className={ligne} data-option-tous={cle}>
          <Case coche={choisies.size === 0} />
          <span className="min-w-0 flex-1">{TOUS[cle]}</span>
        </button>
      </li>
      {options.map((o) => {
        const coche = choisies.has(o.valeur);
        return (
          <li key={o.valeur}>
            <button type="button" role="checkbox" aria-checked={coche} onClick={() => onBascule(o.valeur)} className={ligne} data-option-filtre={o.valeur}>
              <Case coche={coche} />
              <span className="min-w-0 flex-1 [text-wrap:balance]">{o.libelle}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Grille de catégories : une photo de produit, le nom dessous, coche verte sur la catégorie choisie. */
function GrilleCategories({
  options, choisies, images, nombres, colonnes, onChoix,
}: {
  options: OptionFiltre[]; choisies: Set<string>; images: Record<string, string>;
  nombres: Record<string, number>; colonnes: string; onChoix: (id: string | null) => void;
}) {
  const tout: OptionFiltre = { valeur: "all", libelle: "Tous les produits", n: 0 };
  return (
    <ul role="radiogroup" aria-label="Catégorie" className={`grid ${colonnes} gap-x-2 gap-y-3`}>
      {[tout, ...options].map((o) => {
        const choisie = o.valeur === "all" ? choisies.size === 0 : choisies.has(o.valeur);
        const src = images[o.valeur];
        return (
          <li key={o.valeur}>
            <button
              type="button"
              role="radio"
              aria-checked={choisie}
              onClick={() => onChoix(o.valeur === "all" ? null : o.valeur)}
              className="relative w-full flex flex-col items-center gap-1.5 p-2 rounded-xl text-center hover:bg-black/5"
              data-categorie-choix={o.valeur}
            >
              {choisie && (
                <span
                  data-coche-verte
                  className="absolute top-2 left-2 z-10 w-[22px] h-[22px] rounded-[7px] flex items-center justify-center"
                  style={{ background: VERT_FOND }}
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: VERT_COCHE }} />
                </span>
              )}
              <span className="w-full aspect-[4/3] rounded-lg overflow-hidden flex items-center justify-center" style={{ background: BANDE }}>
                {src && <img src={src} alt="" className="w-full h-full object-cover" />}
              </span>
              <span className="text-[14px] leading-tight text-foreground [text-wrap:balance]">
                {o.libelle}
                <span className="ml-1 text-xs text-muted-foreground" data-compteur={`pastille-${o.valeur}`}>({nombres[o.valeur]})</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function BoutonBande({
  children, onClick, ouvert, className = "", ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { ouvert?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={ouvert}
      className={`inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-[15px] font-medium text-foreground whitespace-nowrap transition-colors hover:bg-black/5 ${className}`}
      style={{ background: "#ffffff", border: `1px solid ${ouvert ? NOIR : "rgba(29,29,31,0.08)"}`, boxShadow: ouvert ? `0 0 0 1px ${NOIR}` : undefined }}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface BarreFiltresProps {
  options: Record<CleFiltre, OptionFiltre[]>;
  selection: Selection;
  /** Photo d'un produit de chaque catégorie (clé « all » = tout le catalogue). */
  imagesCategories: Record<string, string>;
  /** Nombre de produits commandables par catégorie (clé « all » = tout le catalogue). */
  nombresCategories: Record<string, number>;
  onBascule: (cle: CleFiltre, valeur: string) => void;
  onCategorie: (id: string | null) => void;
  onToutes: (cle: Exclude<CleFiltre, "categorie">) => void;
  onVider: () => void;
  tri: Tri;
  onTri: (t: Tri) => void;
  /** Nombre de soins affichés avec les filtres actuels (bouton « Voir les N soins »). */
  nombreResultats: number;
}

export default function BarreFiltresCatalogue({
  options, selection, imagesCategories, nombresCategories, onBascule, onCategorie, onToutes, onVider, tri, onTri, nombreResultats,
}: BarreFiltresProps) {
  const [ouvert, setOuvert] = useState<CleFiltre | "tri" | null>(null);
  const [gauche, setGauche] = useState(0);
  const [panneau, setPanneau] = useState(false);
  const racine = useRef<HTMLDivElement>(null);
  const actifs = nombreFiltresActifs(selection);

  const ouvrir = (cle: CleFiltre | "tri", e: React.MouseEvent<HTMLButtonElement>) => {
    if (ouvert === cle) { setOuvert(null); return; }
    // Le panneau part du bouton, sans dépasser la bande à droite.
    const bouton = e.currentTarget;
    const largeur = cle === "categorie" ? 680 : 600;
    const bande = racine.current?.clientWidth ?? 0;
    setGauche(Math.max(0, Math.min(bouton.offsetLeft, bande - Math.min(largeur, bande))));
    setOuvert(cle);
  };

  // Un clic ailleurs, ou Échap, referme la liste ouverte.
  useEffect(() => {
    if (!ouvert) return;
    const dehors = (e: MouseEvent) => { if (racine.current && !racine.current.contains(e.target as Node)) setOuvert(null); };
    const echap = (e: KeyboardEvent) => { if (e.key === "Escape") setOuvert(null); };
    document.addEventListener("mousedown", dehors);
    document.addEventListener("keydown", echap);
    return () => { document.removeEventListener("mousedown", dehors); document.removeEventListener("keydown", echap); };
  }, [ouvert]);

  // Panneau ouvert : la page dessous ne défile pas ; Échap le ferme.
  useEffect(() => {
    if (!panneau) return;
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const echap = (e: KeyboardEvent) => { if (e.key === "Escape") setPanneau(false); };
    document.addEventListener("keydown", echap);
    return () => { document.body.style.overflow = avant; document.removeEventListener("keydown", echap); };
  }, [panneau]);

  const pastille = actifs > 0 && (
    <span
      data-compteur-filtres
      className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-semibold text-white"
      style={{ background: NOIR }}
    >
      {actifs}
    </span>
  );

  const menuTri = (
    <div role="menu" className="absolute z-30 top-full mt-2 right-0 w-48 rounded-xl p-1.5 shadow-lg" style={{ background: "#ffffff", border: "1px solid rgba(29,29,31,0.1)" }}>
      {(Object.keys(LIBELLE_TRI) as Tri[]).map((t) => (
        <button
          key={t}
          type="button"
          role="menuitemradio"
          aria-checked={tri === t}
          onClick={() => { onTri(t); setOuvert(null); }}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-left text-[15px] text-foreground hover:bg-black/5"
        >
          {LIBELLE_TRI[t]}
          {tri === t && <Check className="w-4 h-4" />}
        </button>
      ))}
    </div>
  );

  const categories = (colonnes: string) => (
    <GrilleCategories
      options={options.categorie}
      choisies={selection.categorie}
      images={imagesCategories}
      nombres={nombresCategories}
      colonnes={colonnes}
      onChoix={(id) => { onCategorie(id); setOuvert(null); }}
    />
  );

  const liste = (cle: Exclude<CleFiltre, "categorie">) => (
    <ListeCases cle={cle} options={options[cle]} choisies={selection[cle]} onBascule={(v) => onBascule(cle, v)} onTous={() => onToutes(cle)} />
  );

  return (
    <>
      <div ref={racine} data-barre-filtres className="relative rounded-2xl p-2.5" style={{ background: BANDE }}>
        {/* Ordinateur */}
        <div className="barre-filtres-ordi items-center gap-2">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {ORDRE_FILTRES.map((cle) => {
              const n = selection[cle].size;
              return (
                <BoutonBande key={cle} ouvert={ouvert === cle} onClick={(e) => ouvrir(cle, e)} data-filtre={cle}>
                  {TITRES_FILTRES[cle]}
                  {n > 0 && <span className="text-xs text-muted-foreground">({n})</span>}
                  <ChevronDown className={`w-4 h-4 transition-transform ${ouvert === cle ? "rotate-180" : ""}`} />
                </BoutonBande>
              );
            })}
          </div>
          <div className="relative">
            <BoutonBande ouvert={ouvert === "tri"} onClick={(e) => ouvrir("tri", e)} data-tri>
              <ArrowDownUp className="w-4 h-4" /> Trier par
              <span className="text-xs text-muted-foreground">{LIBELLE_TRI[tri]}</span>
            </BoutonBande>
            {ouvert === "tri" && menuTri}
          </div>
          <BoutonBande onClick={() => setPanneau(true)} data-ouvrir-filtres>
            <SlidersHorizontal className="w-4 h-4" /> Filtres {pastille}
          </BoutonBande>
        </div>

        {/* Panneaux ouverts sous la bande (ordinateur) */}
        {ouvert && ouvert !== "tri" && (
          <div
            data-panneau-liste={ouvert}
            className={`filtres-liste-ordi absolute z-30 top-full mt-2 rounded-2xl p-3 shadow-lg ${ouvert === "categorie" ? "" : `max-h-[340px] overflow-y-auto ${DEFILEMENT_FIN}`}`}
            style={{ left: gauche, width: `min(${ouvert === "categorie" ? 680 : 600}px, 100%)`, background: "#ffffff", border: "1px solid rgba(29,29,31,0.1)" }}
          >
            {ouvert === "categorie" ? categories("grid-cols-4") : liste(ouvert)}
          </div>
        )}

        {/* Téléphone : deux boutons, 1/3 et 2/3 */}
        <div className="barre-filtres-tel grid-cols-3 gap-2">
          <div className="relative col-span-1">
            <BoutonBande className="w-full px-2" ouvert={ouvert === "tri"} onClick={(e) => ouvrir("tri", e)} data-tri>
              <ArrowDownUp className="w-4 h-4 shrink-0" /> Trier par
            </BoutonBande>
            {ouvert === "tri" && <div className="[&>div]:left-0 [&>div]:right-auto">{menuTri}</div>}
          </div>
          <BoutonBande className="col-span-2 w-full" onClick={() => setPanneau(true)} data-ouvrir-filtres>
            <SlidersHorizontal className="w-4 h-4" /> Filtres {pastille}
          </BoutonBande>
        </div>
      </div>

      {panneau && (
        <>
          <div className="filtres-voile fixed inset-0 bg-black/30 z-[10000000]" onClick={() => setPanneau(false)} />
          <div
            role="dialog"
            aria-label="Filtres"
            data-panneau-filtres
            className="filtres-panneau fixed top-0 right-0 bottom-0 z-[10000001] flex flex-col"
            style={{ background: "#ffffff" }}
          >
            <div className="flex items-center justify-between px-5 md:px-6 py-4" style={{ borderBottom: `1px solid ${BANDE}` }}>
              <span className="flex items-center gap-2 text-[17px] font-semibold text-foreground">Filtres {pastille}</span>
              <button
                type="button"
                onClick={() => setPanneau(false)}
                aria-label="Fermer"
                className="w-[30px] h-[30px] rounded-lg flex items-center justify-center"
                style={{ background: BANDE, color: "#666666" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className={`flex-1 overflow-y-auto px-5 md:px-6 py-5 flex flex-col gap-7 ${DEFILEMENT_FIN}`}>
              <div>
                <p className="text-[11px] font-bold tracking-[0.5px] uppercase mb-2 text-foreground">Trier par</p>
                <div className="flex gap-2">
                  {(Object.keys(LIBELLE_TRI) as Tri[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={tri === t}
                      onClick={() => onTri(t)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium ${tri === t ? "bg-foreground text-background" : "text-foreground hover:bg-black/10"}`}
                      style={tri === t ? undefined : { background: BANDE }}
                    >
                      {LIBELLE_TRI[t]}
                    </button>
                  ))}
                </div>
              </div>
              {ORDRE_FILTRES.map((cle) => (
                <div key={cle} data-section-filtre={cle}>
                  <p className="text-[11px] font-bold tracking-[0.5px] uppercase mb-2 text-foreground">{TITRES_FILTRES[cle]}</p>
                  {cle === "categorie" ? categories("grid-cols-3") : liste(cle)}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 px-5 md:px-6 py-4" style={{ borderTop: `1px solid ${BANDE}` }}>
              {actifs > 0 && (
                <button type="button" onClick={onVider} className="text-sm font-medium underline text-foreground whitespace-nowrap">
                  Tout effacer
                </button>
              )}
              <button
                type="button"
                onClick={() => setPanneau(false)}
                data-voir-resultats
                className="flex-1 h-11 rounded-xl text-sm font-medium"
                style={{ background: NOIR, color: "#ffffff" }}
              >
                {nombreResultats === 0 ? "Aucun soin" : nombreResultats === 1 ? "Voir le soin" : `Voir les ${nombreResultats} soins`}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
