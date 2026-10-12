/**
 * Coquille commune aux trois annuaires du Cowork : agences (freelances),
 * magazines et créateurs UGC (JP, 02/09/2026).
 *
 * Même dessin partout : une recherche, des filtres, puis la liste. Chaque
 * annuaire ne fournit que ses lignes ; la mécanique de filtre vit ici, une
 * seule fois.
 *
 * 02/09/2026 (JP) : « trop de tags, pas beau » puis « pas de steps ici, juste
 * un affichage compact ». Plus de pastilles ni de wizard : une ligne de
 * recherche + des menus déroulants, puis des lignes « profil » (avatar rond,
 * nom, bio, stats) comme une liste de profils Twitter/Instagram.
 *
 * Règle maison : aucun chiffre inventé. Une fiche sans donnée mesurée affiche
 * « Non mesuré » plutôt qu'une estimation.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, RotateCcw } from 'lucide-react';
import { cn } from '@lystes/lib/utils';
import { Button } from '@lystes/components/ui/button';

export type LigneRepertoire = {
  id: string;
  /** Catégories auxquelles la ligne appartient (identifiants des pastilles). */
  cats: string[];
  titre: string;
  /** Ligne de spécialité, sous le nom : « CRO & UX — Acquisition | Studio ». */
  sousTitre: string;
  /** Vignette : URL d'image, sinon initiales. */
  image?: string | null;
  initiales?: string;
  /** Prix de référence en euros, utilisé par le filtre de budget. */
  prix?: number | null;
  /** Libellé du prix affiché à droite (« 450 € / jour », « 1 764 € »…). */
  prixLibelle?: string;
  /** Petites étiquettes sous le sous-titre. */
  tags?: string[];
  /** Les trois chiffres du bandeau, déjà formatés. */
  chiffres?: { label: string; valeur: string }[];
  /**
   * Jusqu'à six réalisations réelles. Quand elles existent, elles REMPLACENT
   * le bloc « À propos » : sur un créateur UGC, ce sont ses contenus qui
   * disent son travail, pas une description (JP, 02/09/2026).
   */
  galerie?: string[];
  /**
   * Adresse à encoder en QR. Quand elle existe, le QR prend la place de la
   * galerie : sur un expert produit, ce qui compte n'est pas de montrer des
   * visuels mais de pouvoir ouvrir sa fiche depuis un téléphone, en boutique
   * ou sur un salon (JP, 08/09/2026).
   */
  qr?: string | null;
  /** Le libellé sous le QR : « Contexte de Camille », « Essayage ». */
  qrLegende?: string;
  /** Le texte « À propos », affiché faute de galerie. */
  bio?: string | null;
  lieu?: string | null;
  lien?: string | null;
  /** Clic sur la carte : ouvre la fiche détaillée (JP, 04/09/2026). */
  onOpen?: () => void;
  /** Action principale de la ligne. */
  onAction?: () => void;
  actionLibelle?: string;
  /**
   * Actions secondaires (tester, instructions, ouvrir…). Elles s'affichent en
   * boutons discrets sous l'action principale : sans elles, une carte d'expert
   * n'offrait aucun geste dès que la fiche produit n'avait pas d'adresse
   * publique (JP, 10/09/2026).
   */
  actionsSecondaires?: { id: string; libelle: string; onClick: () => void }[];
  /**
   * Petites icônes posées en haut à droite du bandeau, avec leur compteur
   * mesuré : historique des conversations, vues de la fiche, édition des
   * consignes (JP, 10/09/2026). `compte` à null = pas encore mesuré, on
   * affiche l'icône seule, jamais un zéro inventé.
   */
  iconesBandeau?: {
    id: string;
    icone: React.ReactNode;
    compte?: number | null;
    titre: string;
    onClick: () => void;
  }[];
};

export type Categorie = { id: string; mot: string };

/**
 * Ordres de tri proposés par la page (nom, plus sollicités…). Le comparateur
 * vit chez l'appelant : lui seul sait ce que ses chiffres veulent dire.
 */
export type TriRepertoire = {
  id: string;
  libelle: string;
  comparer: (a: LigneRepertoire, b: LigneRepertoire) => number;
};

interface Props {
  darkMode: boolean;
  lignes: LigneRepertoire[];
  categories: readonly Categorie[];
  placeholder: string;
  /** Paliers de budget proposés ; `null` = tous les prix. */
  paliersBudget?: { libelle: string; max: number | null }[];
  videMessage?: string;
  /**
   * Pages plein écran (annuaires du back-office) : les filtres vivent dans
   * une colonne latérale à gauche de la grille, pas dans une barre au-dessus
   * (JP, 04/09/2026). Les fenêtres Cowork gardent la barre horizontale.
   */
  filtresDansSidebar?: boolean;
  /** Ordres de tri proposés ; le premier est celui appliqué par défaut. */
  tris?: readonly TriRepertoire[];
}

export function PanneauRepertoire({
  darkMode,
  lignes,
  categories,
  placeholder,
  paliersBudget,
  videMessage,
  filtresDansSidebar = false,
  tris,
}: Props) {
  /* Aucun libellé en dur (CHARTE.md, « Deux langues sur le même écran ») :
     le repli reste le français d'origine, mot pour mot. */
  const { t } = useTranslation();
  const [recherche, setRecherche] = useState('');
  const [triSel, setTriSel] = useState<string | null>(null);
  /* Catégories cochées (plusieurs en mode panneau latéral, une seule via le
     menu déroulant des fenêtres Cowork). */
  const [catsSel, setCatsSel] = useState<string[]>([]);
  /* Bornes de prix en euros ; null = pas de borne. */
  const [borneMin, setBorneMin] = useState<number | null>(null);
  const [borneMax, setBorneMax] = useState<number | null>(null);
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  /* Le slot de la latérale est rendu par AdminLayout au même commit ; on le
     récupère après montage, et on le relâche en quittant la page. */
  useEffect(() => {
    if (!filtresDansSidebar) return;
    setSlot(document.getElementById('annuaire-filtres-slot'));
    return () => setSlot(null);
  }, [filtresDansSidebar]);

  /* Prix réellement présents dans les fiches : la plage du curseur et
     l'histogramme en découlent, aucun chiffre n'est inventé. */
  const prixDispos = useMemo(
    () => lignes.map((l) => l.prix).filter((p): p is number => typeof p === 'number' && isFinite(p)),
    [lignes],
  );
  const prixMin = prixDispos.length ? Math.min(...prixDispos) : 0;
  const prixMax = prixDispos.length ? Math.max(...prixDispos) : 0;
  const effMin = borneMin ?? prixMin;
  const effMax = borneMax ?? prixMax;

  /* Nombre de fiches par catégorie, affiché entre parenthèses. */
  const comptesCats = useMemo(() => {
    const m = new Map<string, number>();
    lignes.forEach((l) => l.cats.forEach((c) => m.set(c, (m.get(c) ?? 0) + 1)));
    return m;
  }, [lignes]);

  /* Histogramme : 14 colonnes, hauteur = nombre de fiches dans la tranche. */
  const histogramme = useMemo(() => {
    if (prixDispos.length < 2 || prixMax <= prixMin) return null;
    const COLONNES = 14;
    const pas = (prixMax - prixMin) / COLONNES;
    const cols = new Array<number>(COLONNES).fill(0);
    prixDispos.forEach((p) => {
      const i = Math.min(COLONNES - 1, Math.floor((p - prixMin) / pas));
      cols[i] += 1;
    });
    const max = Math.max(...cols);
    return cols.map((n) => (max ? Math.max(0.12, n / max) : 0.12));
  }, [prixDispos, prixMin, prixMax]);

  const resultats = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    const gardees = lignes.filter((l) => {
      if (catsSel.length > 0 && !l.cats.some((c) => catsSel.includes(c))) return false;
      if (borneMax !== null && (l.prix ?? Infinity) > borneMax) return false;
      if (borneMin !== null && (l.prix ?? -Infinity) < borneMin) return false;
      if (!q) return true;
      return (
        l.titre.toLowerCase().includes(q) ||
        l.sousTitre.toLowerCase().includes(q) ||
        (l.tags ?? []).some((tag) => tag.toLowerCase().includes(q))
      );
    });
    const tri = tris?.find((x) => x.id === triSel) ?? tris?.[0];
    return tri ? [...gardees].sort(tri.comparer) : gardees;
  }, [lignes, recherche, catsSel, borneMin, borneMax, tris, triSel]);

  const reinitialiser = () => {
    setRecherche('');
    setCatsSel([]);
    setBorneMin(null);
    setBorneMax(null);
    setTriSel(null);
  };

  /* Le menu « Trier par », partagé par la barre et le panneau latéral. */
  const menuTri = tris && tris.length > 1 && (
    <div className="relative shrink-0">
      <select
        value={triSel ?? tris[0].id}
        onChange={(e) => setTriSel(e.target.value)}
        className={cn('lystes-filter-select appearance-none', darkMode ? 'lystes-filter-select-dark' : '')}
        aria-label={t('annuaire.panneau.trier', 'Trier')}
      >
        {tris.map((x) => (
          <option key={x.id} value={x.id}>
            {x.libelle}
          </option>
        ))}
      </select>
      <ChevronDown className="lystes-control-chevron pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
    </div>
  );

  /* JP, 02/09/2026 : pas de pastilles, pas de wizard — uniquement des menus
     déroulants compacts, quel que soit le nombre de catégories. */
  const selectCls = cn(
    'lystes-filter-select appearance-none',
    darkMode ? 'lystes-filter-select-dark' : '',
  );

  /* Barre horizontale des fenêtres Cowork : recherche + deux menus déroulants
     compacts (une seule catégorie à la fois, paliers de budget). */
  const controles = (
    <>
      {/* Recherche */}
      <div
        className={cn(
          'lystes-search-control flex min-w-[220px] flex-1 items-center gap-2',
          darkMode && 'lystes-filter-select-dark',
        )}
      >
        <Search className="lystes-control-icon shrink-0" />
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full min-w-0 appearance-none border-0 bg-transparent p-0 text-[11px] outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
            darkMode ? 'text-background placeholder:text-background/60' : 'text-foreground placeholder:text-muted-foreground',
          )}
        />
      </div>

      {/* Filtre catégorie — toujours un menu déroulant compact */}
      {categories.length > 0 && (
        <div className="relative shrink-0">
          <select
            value={catsSel[0] ?? ''}
            onChange={(e) => setCatsSel(e.target.value ? [e.target.value] : [])}
            className={selectCls}
            aria-label={t('annuaire.panneau.filtrerCategorie', 'Filtrer par catégorie')}
          >
            <option value="">{t('annuaire.panneau.toutesCategories', 'Toutes les catégories')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.mot}
              </option>
            ))}
          </select>
          <ChevronDown className="lystes-control-chevron pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
        </div>
      )}

      {/* Filtre budget (déroulant compact si présent) */}
      {paliersBudget && paliersBudget.length > 1 && (
        <div className="relative shrink-0">
          <select
            value={borneMax ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              setBorneMax(v === '' ? null : Number(v));
            }}
            className={selectCls}
          >
            {paliersBudget.map((p) => (
              <option key={p.libelle} value={p.max ?? ''}>
                {p.libelle}
              </option>
            ))}
          </select>
          <ChevronDown className="lystes-control-chevron pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
        </div>
      )}

      {menuTri}
    </>
  );

  /* Panneau latéral des pages annuaires, sur le modèle « Filtres » de Malt
     (JP, 04/09/2026) : titre + réinitialiser, recherche, curseur de budget
     avec histogramme, catégories en cases à cocher avec le nombre de fiches.
     Tout est compté sur les fiches réelles — aucun chiffre inventé. */
  const fmtPrix = (v: number) => `${v.toLocaleString('fr-FR')} €`;
  const curseurCls =
    'pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 w-full appearance-none bg-transparent ' +
    '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 ' +
    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white ' +
    '[&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-black [&::-moz-range-thumb]:pointer-events-auto ' +
    '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white ' +
    '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-black';

  const panneauFiltres = (
    <div className={cn('rounded-2xl', darkMode ? 'bg-white/[0.06] p-4' : 'bg-transparent p-0')}>
      <div className="flex items-center justify-between">
        <h3 className={cn('text-[14px] font-semibold', darkMode ? 'text-white' : 'text-[#000]')}>{t('annuaire.panneau.filtres', 'Filtres')}</h3>
        <button
          type="button"
          onClick={reinitialiser}
          className={cn('flex items-center gap-1.5 text-[11px]', darkMode ? 'text-white/60' : 'text-[#777b7f]')}
        >
          <RotateCcw className="h-3 w-3" />
          {t('annuaire.panneau.reinitialiser', 'Réinitialiser')}
        </button>
      </div>

      {/* Recherche */}
      <div
        className={cn(
          'lystes-search-control mt-3 flex w-full min-w-0 items-center gap-2',
          darkMode && 'lystes-filter-select-dark',
        )}
      >
        <Search className="lystes-control-icon shrink-0" />
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'w-full min-w-0 appearance-none border-0 bg-transparent p-0 text-[11px] outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0',
            darkMode ? 'text-background placeholder:text-background/60' : 'text-foreground placeholder:text-muted-foreground',
          )}
        />
      </div>

      {/* Trier par */}
      {menuTri && (
        <div className="mt-5">
          <p className={cn('text-[12px] font-semibold', darkMode ? 'text-white' : 'text-[#000]')}>{t('annuaire.panneau.trierPar', 'Trier par')}</p>
          <div className="mt-2 [&_select]:w-full">{menuTri}</div>
        </div>
      )}

      {/* Budget : histogramme + double curseur */}
      {histogramme && (
        <div className="mt-5">
          <p className={cn('text-[12px] font-semibold', darkMode ? 'text-white' : 'text-[#000]')}>{t('annuaire.panneau.budget', 'Budget')}</p>
          <div className="mt-2 flex h-8 items-end gap-[2px]">
            {histogramme.map((h, i) => (
              <div
                key={i}
                className={cn('flex-1 rounded-[2px]', darkMode ? 'bg-white/70' : 'bg-[#231e1f]')}
                style={{ height: `${Math.round(h * 100)}%` }}
              />
            ))}
          </div>
          <div className="relative h-6">
            <div className={cn('absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full', darkMode ? 'bg-white/15' : 'bg-[#f3f4f5]')} />
            <input
              type="range"
              min={prixMin}
              max={prixMax}
              value={effMin}
              onChange={(e) => setBorneMin(Math.min(Number(e.target.value), effMax))}
              className={curseurCls}
              aria-label={t('annuaire.panneau.budgetMin', 'Budget minimum')}
            />
            <input
              type="range"
              min={prixMin}
              max={prixMax}
              value={effMax}
              onChange={(e) => setBorneMax(Math.max(Number(e.target.value), effMin))}
              className={curseurCls}
              aria-label={t('annuaire.panneau.budgetMax', 'Budget maximum')}
            />
          </div>
          <div className={cn('flex items-center justify-between text-[10px]', darkMode ? 'text-white/60' : 'text-[#777b7f]')}>
            <span>{fmtPrix(effMin)}{borneMin === null ? ` ${t('annuaire.panneau.etMoins', 'et -')}` : ''}</span>
            <span>{fmtPrix(effMax)}{borneMax === null ? ` ${t('annuaire.panneau.etPlus', 'et +')}` : ''}</span>
          </div>
        </div>
      )}

      {/* Catégories : cases à cocher avec le nombre de fiches */}
      {categories.length > 0 && (
        <div className="mt-5">
          <p className={cn('text-[12px] font-semibold', darkMode ? 'text-white' : 'text-[#000]')}>{t('annuaire.panneau.categorie', 'Catégorie')}</p>
          <div className="mt-2 space-y-1.5">
            {categories.map((c) => {
              const coche = catsSel.includes(c.id);
              return (
                <label
                  key={c.id}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 text-[12px]',
                    darkMode ? 'text-white/80' : 'text-[#231e1f]',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={coche}
                    onChange={() =>
                      setCatsSel((prev) => (coche ? prev.filter((x) => x !== c.id) : [...prev, c.id]))
                    }
                    className="h-3.5 w-3.5 shrink-0 accent-black"
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {c.mot} <span className={darkMode ? 'text-white/40' : 'text-[#777b7f]'}>({comptesCats.get(c.id) ?? 0})</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

        /* Grille de profils, copiée du répertoire /partners : bandeau, avatar
          débordant, nom, spécialité, trois chiffres, deux actions, puis les
          contenus (UGC) ou le « À propos ». */
  const grille = (
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {resultats.length === 0 && (
          <p className={cn('py-6 text-center text-xs', darkMode ? 'text-white/50' : 'text-[#777b7f]')}>
            {videMessage ?? t('annuaire.panneau.aucunResultat', 'Aucun résultat pour cette recherche.')}
          </p>
        )}

        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultats.map((l) => (
            <article
              key={l.id}
              onClick={l.onOpen}
              className={cn(
                'flex flex-col overflow-hidden rounded-2xl',
                darkMode ? 'bg-white/[0.06]' : 'bg-transparent',
                l.onOpen && 'cursor-pointer transition-colors hover:bg-[#fafafa]',
              )}
            >
              {/* Bandeau gris : avatar et icônes dedans, plus de débordement
                  ni de corps blanc (JP, 11/09/2026). */}
              <div className={cn('relative h-16', darkMode ? 'bg-white/[0.06]' : 'bg-black/[0.07]')}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  {l.image ? (
                    <img
                      src={l.image}
                      alt=""
                      loading="lazy"
                      className={cn('h-11 w-11 rounded-[4px] object-cover bg-white mt-[38px]', darkMode ? 'ring-2 ring-[#1D1D1F]' : 'ring-2 ring-white')}
                    />
                  ) : (
                    <span
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-semibold',
                        darkMode ? 'bg-white text-black ring-2 ring-[#1D1D1F]' : 'bg-black text-white ring-2 ring-white',
                      )}
                    >
                      {l.initiales ?? l.titre.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Les trois gestes de la carte, en icônes dans le bandeau :
                    historique, vues, consignes. Compteur affiché seulement
                    quand il est mesuré. */}
                {l.iconesBandeau && l.iconesBandeau.length > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {l.iconesBandeau.map((i) => (
                      <button
                        key={i.id}
                        type="button"
                        title={i.titre}
                        aria-label={i.titre}
                        onClick={(e) => {
                          e.stopPropagation();
                          i.onClick();
                        }}
                        className={cn(
                          'flex h-7 items-center gap-1 rounded-full px-2 text-[10px] font-medium transition-colors',
                          darkMode
                            ? 'bg-white/[0.12] text-white hover:bg-white/[0.2]'
                            : 'bg-white/70 text-[#231e1f] hover:bg-white',
                        )}
                      >
                        {i.icone}
                        {typeof i.compte === 'number' && <span>{i.compte}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                <h4 className={cn('truncate text-[14px] font-semibold', darkMode ? 'text-white' : 'text-[#000]')}>
                  {l.titre}
                </h4>
                <p className={cn('mt-0.5 truncate text-[11px]', darkMode ? 'text-white/60' : 'text-[#777b7f]')}>
                  {l.sousTitre}
                </p>

                {l.chiffres && l.chiffres.length > 0 && (
                  <div
                    className={cn(
                      'mt-3 grid rounded-xl py-2',
                      l.chiffres.length === 3 ? 'grid-cols-3' : l.chiffres.length === 2 ? 'grid-cols-2' : 'grid-cols-1',
                      darkMode ? 'bg-white/[0.06]' : 'bg-[#f3f4f5]',
                    )}
                  >
                    {l.chiffres.map((c) => (
                      <div key={c.label} className="px-2 text-center">
                        <div className={cn('truncate text-[13px] font-semibold', darkMode ? 'text-white' : 'text-[#000]')}>
                          {c.valeur}
                        </div>
                        <div className={cn('mt-0.5 text-[8px] uppercase tracking-[0.14em]', darkMode ? 'text-white/40' : 'text-[#777b7f]')}>
                          {c.label}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {l.onAction && (
                  <div className="mt-3">
                    <Button
                      type="button"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        l.onAction?.();
                      }}
                    >
                      {l.actionLibelle ?? t('annuaire.panneau.contacter', 'Contacter')}
                    </Button>
                  </div>
                )}

                {l.actionsSecondaires && l.actionsSecondaires.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {l.actionsSecondaires.map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          a.onClick();
                        }}
                        className={cn(
                          'flex-1 rounded-full px-3 py-1.5 text-[11px] transition-colors',
                          darkMode
                            ? 'bg-white/[0.08] text-white/80 hover:bg-white/[0.14]'
                            : 'bg-[#f3f4f5] text-[#231e1f] hover:bg-[#e8e9ea]',
                        )}
                      >
                        {a.libelle}
                      </button>
                    ))}
                  </div>
                )}

                {/* 10/09/2026 (JP) : le « À propos » ne s'efface plus devant
                    l'image. Sur une carte d'expert, les deux se répondent : la
                    phrase dit ce que la personne fait, la photo dit sur quel
                    produit. Et un produit seul se montre en pleine largeur,
                    pas en vignette d'un tiers de carte. */}
                {l.bio && (
                  <>
                    <p className={cn('mt-3 text-[8px] uppercase tracking-[0.16em]', darkMode ? 'text-white/40' : 'text-[#777b7f]')}>
                      {t('annuaire.panneau.aPropos', 'À propos')}
                    </p>
                    <p className={cn('mt-1 line-clamp-3 text-[11px] leading-relaxed', darkMode ? 'text-white/70' : 'text-[#231e1f]')}>
                      {l.bio}
                    </p>
                  </>
                )}

                {/* Même carte sur toutes les pages d'équipe (JP, 30/09/2026) :
                    la photo du produit, entière, toujours ; le QR du coach se
                    pose en vignette dans son coin au lieu de la remplacer. */}
                {l.galerie && l.galerie.length === 1 ? (
                  <div className={cn('relative mt-3 aspect-[4/5] w-full overflow-hidden rounded-lg', darkMode ? 'bg-white/10' : 'bg-[#f3f4f5]')}>
                    <img src={l.galerie[0]} alt="" loading="lazy" className="h-full w-full object-contain" />
                    {l.qr && (
                      <div className="absolute bottom-2 right-2 rounded-[9px] bg-white p-1.5" title={l.qrLegende ?? undefined}>
                        <img src={l.qr} alt={l.qrLegende ?? t('annuaire.panneau.qr', 'QR code')} loading="lazy" className="block h-16 w-16" />
                      </div>
                    )}
                  </div>
                ) : l.qr ? (
                  <div className="mt-3 flex flex-col items-center gap-1.5">
                    {l.qrLegende && (
                      <p
                        className={cn(
                          'self-start text-[8px] uppercase tracking-[0.16em]',
                          darkMode ? 'text-white/45' : 'text-[#777b7f]',
                        )}
                      >
                        {l.qrLegende}
                      </p>
                    )}
                    <div className="w-full rounded-[9px] bg-white p-3">
                      <img
                        src={l.qr}
                        alt=""
                        loading="lazy"
                        className="mx-auto block h-auto w-full max-w-[132px]"
                      />
                    </div>
                  </div>
                ) : l.galerie && l.galerie.length > 0 ? (
                  <div className="mt-3 grid grid-cols-3 gap-1">
                    {l.galerie.slice(0, 6).map((src, index) => (
                      <div key={`${src}-${index}`} className={cn('aspect-[3/4] overflow-hidden rounded-md', darkMode ? 'bg-white/10' : 'bg-[#f3f4f5]')}>
                        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : null}


                <div className={cn('mt-auto flex items-end justify-between gap-2 pt-3 text-[10px]', darkMode ? 'text-white/50' : 'text-[#777b7f]')}>
                  <span className="truncate">{[l.lieu, l.lien].filter(Boolean).join(' · ')}</span>
                  {l.prixLibelle && (
                    <span className={cn('shrink-0 text-[11px]', darkMode ? 'text-white' : 'text-[#000]')}>{l.prixLibelle}</span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
  );

  /* 04/09/2026 (JP) : sur les pages annuaires, les contrôles partent dans la
     latérale du back-office (slot #annuaire-filtres-slot rendu par
     AdminLayout, sous l'entrée « Annuaire »). Tant que le slot n'existe pas —
     sidebar repliée, premier rendu — repli sur la colonne latérale interne.
     Fenêtres Cowork : barre horizontale au-dessus de la grille. */
  if (!filtresDansSidebar) {
    return (
      <div className="annuaire-repertoire flex min-h-0 flex-1 flex-col gap-4">
        <div className="lystes-filter-bar flex shrink-0 flex-wrap items-center gap-2 lg:flex-nowrap">{controles}</div>
        {grille}
      </div>
    );
  }

  return (
    <div className="annuaire-repertoire flex min-h-0 flex-1 flex-col">
      {slot
        ? createPortal(panneauFiltres, slot)
        : <aside className="mb-4 shrink-0">{panneauFiltres}</aside>}
      {grille}
    </div>
  );
}
