/**
 * Carte « profil » des créatifs (JP, 02/09/2026) — gabarit imposé, identique
 * pour les Photographes IA, les Graphistes IA et les Créateurs UGC IA :
 * bandeau gris, avatar rond débordant, nom, sous-titre, bandeau de chiffres,
 * bouton pleine largeur, puis la galerie 3/4.
 *
 * Une seule définition, pour que les quatre onglets ne divergent plus jamais.
 *
 * Galerie : 2 colonnes × 4 photos pour les photographes, graphistes et UGC ;
 * 3 colonnes × 9 photos pour les community managers. La grille se règle via
 * les props `colonnesGalerie` et `nbPhotosGalerie`.
 *
 * Styles inline reproduits à l'identique du gabarit validé par JP :
 * padding latéral 9px, line-height titre 15px, sous-titre 8px, chiffres 7px/4px,
 * bouton blanc bordure faint 12px, galerie 2 colonnes.
 */
import React, { useRef, useState } from 'react';
import { Copy, ImagePlus, Pencil, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '@lystes/lib/utils';
import { Button } from '@lystes/components/ui/button';
import { Textarea } from '@lystes/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@lystes/components/ui/dialog';
import {
  PropositionsPromptDialog,
  type VariationPrompt,
} from '@lystes/features/ai-photographers/components/PropositionsPromptDialog';
import { ApercuStyle } from '@lystes/features/ai-photographers/components/ApercuStyle';

export interface CarteProfilCreatifProps {
  nom: string;
  /** L'identifiant du profil, pour retrouver son apercu de style. */
  profilId?: string;
  sousTitre?: string | null;
  avatar?: string | null;
  /**
   * Bandeau de trois colonnes. Gabarit JP du 03/09/2026 : `valeur` porte
   * l'INTITULÉ (ligne du haut, noir gras) et `label` la DONNÉE (ligne du bas,
   * grise, capitales) — « Photo / PACKSHOT », « Objectif / 9 ».
   * Données mesurées uniquement, jamais d'estimation.
   */
  chiffres?: { valeur: string | number; label: string }[];
  galerie?: string[];
  libelleAction: string;
  onAction: () => void;
  /** Action optionnelle de retrait, réservée aux galeries qui l'autorisent. */
  onDelete?: () => void;
  /** Action optionnelle « refaire le feed », réservée aux galeries autorisées. */
  onRefaire?: () => void;
  /** Dupliquer ce créatif dans les profils personnalisés du compte. */
  onDupliquer?: () => void;
  /** Modifier le nom et la photo d'un profil personnalisé. */
  onModifier?: () => void;
  /** Supprimer la photo de cette position (index dans la galerie affichée). */
  onSupprimerPhoto?: (index: number) => void;
  /** Clic sur la zone d'en-tête (bandeau, avatar, nom) — ouvre le détail. */
  onDetails?: () => void;
  actif?: boolean;
  /** Colonnes de la galerie : 2 par défaut, 3 pour les community managers. */
  colonnesGalerie?: 2 | 3;
  /** Nombre de photos affichées : 4 par défaut (others), 9 pour community. */
  nbPhotosGalerie?: number;
  /** Portfolio écrit, pour les métiers qui rendent du texte et non des images
      (les journalistes) : il remplace la galerie, jamais il ne s'y ajoute. */
  portfolioTexte?: { titre: string; chapo: string }[];
  /** Carte au-dessus de la ligne de flottaison : ses 2 premières photos sont
      chargées en priorité. À ne passer que sur les premières cartes d'une
      liste — sinon des centaines d'images partent en `eager` à la fois. */
  prioritaire?: boolean;
  /** Prompt relié à chaque photo (même ordre que la galerie). Quand il est
      fourni, un crayon apparaît sur chaque photo et l'ouvre en pop-up.
      Réservé au compte Dream Virgin Hair (JP, 07/09/2026). */
  promptsGalerie?: (string | null | undefined)[];
  /** Quand il est fourni, le pop-up du prompt devient éditable : le texte
      corrigé est renvoyé ici avec l'index de la photo, puis enregistré
      par l'appelant. */
  onPromptSave?: (
    index: number,
    prompt: string,
    referenceUrl?: string | null,
    produitUrl?: string | null,
  ) => Promise<boolean> | boolean;
  /** Photo de référence de chaque position (par défaut la photo affichée). */
  referencesGalerie?: (string | null | undefined)[];
  /** Produit de référence de chaque position (image du produit à photographier). */
  produitsGalerie?: (string | null | undefined)[];
  /** Envoi d'une nouvelle photo de référence ; rend son adresse publique. */
  onReferenceUpload?: (index: number, fichier: File) => Promise<string | null>;
  /** Envoi d'une nouvelle image de produit de référence ; rend son adresse. */
  onProduitUpload?: (index: number, fichier: File) => Promise<string | null>;
  /** Refaire uniquement la photo de cette position. */
  onGenererPhoto?: (index: number) => void;
  /** Le prompt GÉNÉRAL du créatif : le socle envoyé au-dessus de chaque
      photo. Quand il est fourni, un bouton l'ouvre sur la carte. */
  promptGeneral?: string | null;
  /** Enregistrement du prompt général corrigé. */
  onPromptGeneralSave?: (prompt: string) => Promise<boolean> | boolean;
  /** Propositions de variations de prompt. `index` vaut null pour le prompt
      général. Rien n'est enregistré : la variation retenue remplit le champ. */
  onSuggererPrompts?: (
    index: number | null,
    promptActuel: string,
    referenceUrl: string | null,
  ) => Promise<VariationPrompt[]>;
  /** Ouvre la galerie de références du portfolio. */
  onGalerieReferences?: () => void;
  /** Ouvre la fiche de conformité du portfolio. */
  onFicheConformite?: () => void;
  /**
   * Lance la première séance du profil, quand la page sait la lancer.
   * Optionnelle à dessein : sans elle, l'état sans visuel explique la
   * situation sans promettre une issue qu'aucun écran ne tiendrait.
   * Même nom que sur `CarteProfilEditorial` : les deux cartes traitent le
   * même manque, elles doivent l'ouvrir par la même porte.
   */
  onCreerPortfolio?: () => void;
}

/* POURQUOI LA GRILLE SANS VISUEL PARLE, AU LIEU DE NE RIEN DIRE DU TOUT.

   15/09/2026 (JP) : « pourquoi parler de 20/20 s'il n'y a pas d'aperçu des
   portfolios ? »

   Mesuré sur cette carte, galerie vide : la grille rend un bloc de zéro
   enfant. Pas une case, pas un mot, pas une issue. Au-dessus, le bandeau de
   chiffres annonce quand même « 0 références » et « 12 prises / séance ».
   La marchande lit donc une promesse chiffrée posée sur un blanc muet, et
   rien ne lui dit que la séance reste à faire.

   Ce qu'on ne fait surtout pas : combler avec des visuels pris ailleurs. Une
   image empruntée passerait pour du travail livré par ce profil, et le choix
   se ferait sur ce qu'il n'a jamais produit.

   Le nombre annoncé sort de `nbPhotosGalerie`, la taille réelle de la séance
   pour ce métier, six ou neuf selon la discipline. Un nombre écrit en dur
   mentirait à la moitié des profils.

   À ne pas étendre au portfolio incomplet : de un à huit visuels, les cases
   présentes suffisent, c'est un travail en cours et non un travail absent. */
function PremiereSeance({
  nom,
  nbVisuels,
  onCreer,
  profilId,
}: {
  nom: string;
  nbVisuels: number;
  onCreer?: () => void;
  profilId?: string;
}) {
  /* 15/09/2026 (JP) : « comment une personne choisit une agence marketing si
     elle ne voit pas son style ? ». Avant cette date, une grille vide rendait
     six agences publicitaires strictement identiques a l'ecran : meme bloc
     gris, meme phrase. Le choix etait impossible, donc la page inutile.

     L'apercu dessine passe AVANT l'invitation a lancer la seance : on montre
     d'abord de quoi l'agence est capable, on propose de payer ensuite. */
  const apercu = profilId ? <ApercuStyle profilId={profilId} /> : null;

  return (
    <>
      {apercu}
      <div className="mt-3 rounded-md bg-[#f3f4f5] p-3 text-center">
      <ImagePlus className="mx-auto h-4 w-4" style={{ color: '#777b7f' }} aria-hidden="true" />
      <p className="mt-[6px] text-[9px] font-semibold leading-[12px] text-black">
        {nom} n'a encore rien créé pour votre boutique.
      </p>
      <p className="mt-[2px] text-[8px] leading-[11px]" style={{ color: '#777b7f' }}>
        Une première séance livre {nbVisuels} visuel{nbVisuels > 1 ? 's' : ''} dans son style.
      </p>
      {/* Le bouton n'apparaît que si la page sait vraiment lancer la séance :
          un bouton qui ne fait rien coûte plus cher qu'une case vide, il
          promet une issue puis la retire aussitôt. */}
      {onCreer && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-7 w-full text-[9px] font-semibold text-black hover:opacity-90"
          style={{ background: '#e1f3c5' }}
          onClick={(event) => {
            event.stopPropagation();
            onCreer();
          }}
        >
          Créer ses premiers visuels
        </Button>
      )}
      </div>
    </>
  );
}

export function CarteProfilCreatif({
  nom,
  profilId,
  sousTitre,
  avatar,
  chiffres = [],
  galerie = [],
  libelleAction,
  onAction,
  onDelete,
  onRefaire,
  onDupliquer,
  onModifier,
  onSupprimerPhoto,
  onDetails,
  actif = false,
  colonnesGalerie = 2,
  nbPhotosGalerie = 4,
  portfolioTexte,
  prioritaire = false,
  promptsGalerie,
  onPromptSave,
  referencesGalerie,
  produitsGalerie,
  onReferenceUpload,
  onProduitUpload,
  onGenererPhoto,
  promptGeneral,
  onPromptGeneralSave,
  onSuggererPrompts,
  onGalerieReferences,
  onFicheConformite,
  onCreerPortfolio,
}: CarteProfilCreatifProps) {
  /* Le prompt général : un seul texte pour tout le créatif. */
  const [generalOuvert, setGeneralOuvert] = useState(false);
  const [generalBrouillon, setGeneralBrouillon] = useState('');
  const [generalEnregistrement, setGeneralEnregistrement] = useState(false);
  /* Les propositions de variations : `null` = fermé, sinon la position visée
     (-1 pour le prompt général). Rien n'est enregistré sans clic. */
  const [variationsPour, setVariationsPour] = useState<number | null>(null);
  // Community managers : 9 photos en 3 colonnes (3 rangées pleines).
  // Les autres métiers : 4 photos en 2 colonnes (2 rangées pleines).
  const photos = galerie.slice(0, nbPhotosGalerie);
  const [promptOuvert, setPromptOuvert] = useState<number | null>(null);
  /* La photo ouverte en grand au clic sur la vignette (JP, 16/09/2026). */
  const [photoAgrandie, setPhotoAgrandie] = useState<string | null>(null);
  const [promptBrouillon, setPromptBrouillon] = useState('');
  const [promptEnregistrement, setPromptEnregistrement] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [envoiReference, setEnvoiReference] = useState(false);
  const champReference = useRef<HTMLInputElement>(null);
  /* Le produit de référence : l'objet qui doit être rephotographié dans la
     scène. Sans lui, la position reprend le produit chargé au lancement. */
  const [produit, setProduit] = useState<string | null>(null);
  const [envoiProduit, setEnvoiProduit] = useState(false);
  const champProduit = useRef<HTMLInputElement>(null);

  const referenceDe = (index: number) =>
    referencesGalerie?.[index] ?? photos[index] ?? null;

  const ouvrirPrompt = (index: number) => {
    setPromptOuvert(index);
    setPromptBrouillon(promptsGalerie?.[index] ?? '');
    setReference(referenceDe(index));
    setProduit(produitsGalerie?.[index] ?? null);
  };

  const fermerPrompt = () => {
    setPromptOuvert(null);
    setPromptEnregistrement(false);
    setEnvoiReference(false);
    setEnvoiProduit(false);
  };

  const changerReference = async (fichier: File) => {
    if (promptOuvert === null || !onReferenceUpload) return;
    setEnvoiReference(true);
    const url = await onReferenceUpload(promptOuvert, fichier);
    setEnvoiReference(false);
    if (url) setReference(url);
  };

  const changerProduit = async (fichier: File) => {
    if (promptOuvert === null || !onProduitUpload) return;
    setEnvoiProduit(true);
    const url = await onProduitUpload(promptOuvert, fichier);
    setEnvoiProduit(false);
    if (url) setProduit(url);
  };

  const enregistrerPrompt = async (): Promise<boolean> => {
    if (promptOuvert === null || !onPromptSave) return false;
    const texte = promptBrouillon.trim();
    if (!texte) return false;
    setPromptEnregistrement(true);
    const ok = await onPromptSave(promptOuvert, texte, reference, produit);
    setPromptEnregistrement(false);
    return !!ok;
  };

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl bg-white',
        actif && 'ring-1 ring-[#c9dfa2]',
      )}
    >
      <div
        className={cn('relative h-12 bg-black/[0.07]', onDetails && 'cursor-pointer')}
        onClick={onDetails}
        role={onDetails ? 'button' : undefined}
        aria-label={onDetails ? `Voir le profil de ${nom}` : undefined}
      >
        {onRefaire && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Refaire le feed de ${nom}`}
            title="Refaire le feed"
            className={cn(
              'absolute top-1.5 z-10 h-5 w-5 rounded-full bg-background p-0 text-muted-foreground [&_svg]:!h-2.5 [&_svg]:!w-2.5 hover:bg-muted hover:text-foreground',
              onDelete ? 'right-7' : 'right-1.5',
            )}
            onClick={(event) => {
              event.stopPropagation();
              onRefaire();
            }}
          >
            <RefreshCw className="h-2.5 w-2.5" />
          </Button>
        )}
        {onDupliquer && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Dupliquer ${nom}`}
            title="Dupliquer ce créatif"
            className={cn(
              'absolute top-1.5 z-10 h-5 w-5 rounded-full bg-background p-0 text-muted-foreground [&_svg]:!h-2.5 [&_svg]:!w-2.5 hover:bg-muted hover:text-foreground',
              onDelete && onRefaire ? 'right-[3.25rem]' : onDelete || onRefaire ? 'right-7' : 'right-1.5',
            )}
            onClick={(event) => {
              event.stopPropagation();
              onDupliquer();
            }}
          >
            <Copy className="h-2.5 w-2.5" />
          </Button>
        )}
        {onDelete && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Supprimer ${nom}`}
            title="Supprimer"
            className="absolute right-1.5 top-1.5 z-10 h-5 w-5 rounded-full bg-background p-0 text-muted-foreground [&_svg]:!h-2.5 [&_svg]:!w-2.5 hover:bg-muted hover:text-destructive"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="h-2.5 w-2.5" />
          </Button>
        )}
        <div className="absolute -bottom-6 left-4">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              loading="lazy"
              className="h-14 w-14 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e9eaec] text-[13px] font-semibold text-[#777b7f] ring-2 ring-white">
              {nom.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      <div
        className="flex flex-1 flex-col px-4 pb-4 pt-8"
        style={{ paddingLeft: 9, paddingRight: 9 }}
      >
        <div className="flex min-w-0 items-center gap-1.5">
          <h4
            className={cn('truncate text-[14px] font-semibold text-[#000]', onDetails && 'cursor-pointer hover:underline')}
            style={{ lineHeight: '15px' }}
            onClick={onDetails}
          >
            {nom}
          </h4>
          {onModifier && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Modifier le nom et la photo de ${nom}`}
              title="Modifier le profil"
              className="h-4 w-4 shrink-0 rounded-full p-0 text-muted-foreground [&_svg]:!h-2 [&_svg]:!w-2 hover:bg-muted hover:text-foreground"
              onClick={onModifier}
            >
              <Pencil className="h-2 w-2" />
            </Button>
          )}
        </div>
        {sousTitre && (
          <p
            className="mt-0.5 truncate text-[11px] text-[#777b7f]"
            style={{ marginTop: -1, fontSize: 8 }}
          >
            {sousTitre}
          </p>
        )}

        {chiffres.length > 0 && (
          <div
            className={cn(
              'mt-3 grid bg-[#f3f4f5] py-2',
              chiffres.length === 1 ? 'grid-cols-1' : chiffres.length === 2 ? 'grid-cols-2' : 'grid-cols-3',
            )}
            style={{ borderRadius: 5 }}
          >
            {chiffres.map((c, i) => (
              <div
                key={`${c.valeur}-${c.label}`}
                className={cn('px-2 text-center', i > 0 && 'border-l border-[#e4e4e4]')}
              >
                <div className="truncate text-[7px] font-semibold text-[#000]">{c.valeur}</div>
                <div
                  className="mt-0.5 text-[5px] uppercase tracking-[0.14em] text-[#777b7f]"
                  style={{ fontSize: 4 }}
                >
                  {c.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3">
          <Button
            type="button"
            className="h-11 w-full bg-[#f1f1f1] px-6 py-3 text-[#000] hover:bg-[#e7e7e7]"
            style={{
              padding: '3px 19px',
              lineHeight: '26px',
              height: '24px',
              fontSize: 8,
              background: '#fff',
              border: '1px solid #0000000d',
              borderRadius: 12,
            }}
            onClick={onAction}
          >
            {libelleAction}
          </Button>
        </div>

        {/* Une photo supprimée retire aussi sa case. L'index d'origine reste
            attaché à la photo afin que son prompt et ses actions ne décalent
            pas les positions suivantes. */}
        {portfolioTexte && portfolioTexte.length > 0 && (
          <div className="mt-3 space-y-1">
            {portfolioTexte.map((article) => (
              <div key={article.titre} className="rounded-md bg-[#f3f4f5] p-2">
                <p className="text-[9px] font-semibold leading-[12px] text-black">{article.titre}</p>
                <p className="mt-[2px] text-[8px] leading-[11px]" style={{ color: '#777b7f' }}>
                  {article.chapo}
                </p>
              </div>
            ))}
          </div>
        )}

        {!portfolioTexte && (() => {
          const photosAffichees = photos
            .map((img, index) => ({ img, index }))
            .filter(({ img }) => Boolean(img));
          /* Zéro visuel n'est pas un portfolio en cours, c'est un portfolio
             qui n'a pas commencé : seul ce cas bascule sur l'état parlant. */
          if (photosAffichees.length === 0) {
            return (
              <PremiereSeance
                nom={nom}
                nbVisuels={nbPhotosGalerie}
                onCreer={onCreerPortfolio}
                profilId={profilId}
              />
            );
          }
          /* Les emplacements sans photo restent visibles : une zone grise
             avec son bouton « + » qui ouvre la reprise de CETTE position.
             Sans elles, une carte à 1 photo sur 3 ne montrait qu'une photo
             et la marchande ne savait pas comment produire les deux
             manquantes (JP, 16/09/2026). */
          const occupes = new Set(photosAffichees.map(({ index }) => index));
          const vides = Array.from({ length: nbPhotosGalerie }, (_, k) => k).filter(
            (k) => !occupes.has(k),
          );
          return (
            <div
              className="mt-3 gap-1"
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${colonnesGalerie}, 1fr)`,
              }}
            >
              {photosAffichees.map(({ img, index: i }) => {
                return (
                  <div
                    key={`${img}-${i}`}
                    className="group relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-md bg-[#f3f4f5]"
                    onClick={() => setPhotoAgrandie(img)}
                    role="button"
                    aria-label={`Agrandir la photo ${i + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Photo ${i + 1} du portfolio de ${nom}`}
                      loading={prioritaire && i < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      onLoad={(e) => e.currentTarget.classList.add('opacity-100')}
                      className="h-full w-full object-cover opacity-0 transition-opacity duration-500"
                    />
                    {promptsGalerie && (
                      <button
                        type="button"
                        aria-label={`${onPromptSave ? 'Voir ou modifier' : 'Voir'} le prompt de la photo ${i + 1}`}
                        title={onPromptSave ? 'Voir / modifier le prompt' : 'Voir le prompt'}
                        className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[#52504f] opacity-0 transition-opacity hover:text-black group-hover:opacity-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          ouvrirPrompt(i);
                        }}
                      >
                        <Pencil className="h-2.5 w-2.5" />
                      </button>
                    )}
                    {/* Refaire CETTE photo seulement, sans relancer la
                        séance entière (JP, 08/09/2026). */}
                    {onGenererPhoto && (
                      <button
                        type="button"
                        aria-label={`Refaire la photo ${i + 1}`}
                        title="Refaire cette photo"
                        className="absolute left-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[#52504f] opacity-0 transition-opacity hover:text-black group-hover:opacity-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          onGenererPhoto(i);
                        }}
                      >
                        <RefreshCw className="h-2.5 w-2.5" />
                      </button>
                    )}
                    {/* Supprimer CETTE photo du portfolio (JP, 12/09/2026). */}
                    {img && onSupprimerPhoto && (
                      <button
                        type="button"
                        aria-label={`Supprimer la photo ${i + 1} du portfolio`}
                        title="Supprimer cette photo"
                        className="absolute bottom-1 right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[#52504f] opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                        onClick={(event) => {
                          event.stopPropagation();
                          onSupprimerPhoto(i);
                        }}
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    )}
                  </div>
                );
              })}
              {vides.map((i) => (
                <button
                  key={`vide-${i}`}
                  type="button"
                  disabled={!onGenererPhoto}
                  aria-label={`Créer la photo ${i + 1}`}
                  title={`Créer la photo ${i + 1}`}
                  className="flex aspect-[3/4] flex-col items-center justify-center gap-1 rounded-md bg-[#f3f4f5] text-[#9a978f] transition-colors hover:bg-[#ebecef] hover:text-[#52504f] disabled:cursor-default"
                  onClick={(event) => {
                    event.stopPropagation();
                    onGenererPhoto?.(i);
                  }}
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  <span className="text-[9px]">Photo {i + 1}</span>
                </button>
              ))}
            </div>
          );
        })()}

        {/* Le socle commun à toutes les photos, puis les deux outils de
            contrôle du portfolio (références, conformité). */}
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {promptGeneral !== undefined && promptGeneral !== null && (
            <button
              type="button"
              className="text-[11px] text-[#52504f] underline underline-offset-2 hover:text-black"
              onClick={(event) => {
                event.stopPropagation();
                setGeneralBrouillon(promptGeneral);
                setGeneralOuvert(true);
              }}
            >
              Prompt général
            </button>
          )}
          {onGalerieReferences && (
            <button
              type="button"
              className="text-[11px] text-[#52504f] underline underline-offset-2 hover:text-black"
              onClick={(event) => {
                event.stopPropagation();
                onGalerieReferences();
              }}
            >
              Références
            </button>
          )}
          {onFicheConformite && (
            <button
              type="button"
              className="text-[11px] text-[#52504f] underline underline-offset-2 hover:text-black"
              onClick={(event) => {
                event.stopPropagation();
                onFicheConformite();
              }}
            >
              Conformité
            </button>
          )}
        </div>
      </div>

      <Dialog open={generalOuvert} onOpenChange={setGeneralOuvert}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[14px]">Prompt général — {nom}</DialogTitle>
          </DialogHeader>
          <p className="text-[11px] leading-[1.5] text-[#777b7f]">
            Ce texte est envoyé au-dessus de chacune de ses photos. Le prompt de chaque photo vient ensuite.
          </p>
          <Textarea
            value={generalBrouillon}
            onChange={(e) => setGeneralBrouillon(e.target.value)}
            readOnly={!onPromptGeneralSave}
            rows={12}
            className="text-[12px]"
          />
          {onPromptGeneralSave && (
            <div className="flex justify-end gap-2">
              {onSuggererPrompts && (
                <Button variant="ghost" onClick={() => setVariationsPour(-1)}>
                  Proposer des variations
                </Button>
              )}
              <Button variant="ghost" onClick={() => setGeneralOuvert(false)}>
                Annuler
              </Button>
              <Button
                disabled={generalEnregistrement}
                onClick={async () => {
                  setGeneralEnregistrement(true);
                  const ok = await onPromptGeneralSave(generalBrouillon);
                  setGeneralEnregistrement(false);
                  if (ok) setGeneralOuvert(false);
                }}
              >
                {generalEnregistrement ? 'Enregistrement…' : 'Enregistrer'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Le prompt relié à la photo : lecture seule par défaut, éditable
          quand l'appelant fournit `onPromptSave` (Dream Virgin Hair). */}
      <Dialog open={promptOuvert !== null} onOpenChange={(o) => !o && fermerPrompt()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[14px]">
              Prompt — {nom}{promptOuvert !== null ? ` · photo ${promptOuvert + 1}` : ''}
            </DialogTitle>
          </DialogHeader>
          {onPromptSave ? (
            <div className="flex flex-col gap-3">
              {/* La photo de référence de cette position : c'est elle qui
                  porte le style. On peut la remplacer, et le prompt est
                  alors réécrit à partir de la nouvelle photo. */}
              <div className="flex items-start gap-3">
                <div className="h-28 w-21 shrink-0 overflow-hidden rounded-md bg-[#f3f4f5]" style={{ width: 84 }}>
                  {reference ? (
                    <img src={reference} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] text-[#9a9a9a]">
                      aucune
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#777b7f]">
                    Photo de référence
                  </span>
                  {onReferenceUpload && (
                    <>
                      <input
                        ref={champReference}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          e.target.value = '';
                          if (f) void changerReference(f);
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-7 w-fit px-3 text-[11px]"
                        disabled={envoiReference}
                        onClick={() => champReference.current?.click()}
                      >
                        {envoiReference ? 'Envoi…' : 'Changer la photo'}
                      </Button>
                    </>
                  )}
                  <p className="max-w-[16rem] text-[10px] leading-snug text-[#777b7f]">
                    Le prompt est réécrit à partir de cette photo : on garde son
                    esprit, jamais sa copie.
                  </p>
                </div>
              </div>

              {/* Le produit de référence : l'objet photographié dans la scène.
                  Sans lui, la position reprend le produit chargé au lancement. */}
              <div className="flex items-start gap-3">
                <div className="h-28 shrink-0 overflow-hidden rounded-md bg-[#f3f4f5]" style={{ width: 84 }}>
                  {produit ? (
                    <img src={produit} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] text-[#9a9a9a]">
                      aucun
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#777b7f]">
                    Produit de référence
                  </span>
                  {onProduitUpload && (
                    <>
                      <input
                        ref={champProduit}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          e.target.value = '';
                          if (f) void changerProduit(f);
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-7 w-fit px-3 text-[11px]"
                        disabled={envoiProduit}
                        onClick={() => champProduit.current?.click()}
                      >
                        {envoiProduit ? 'Envoi…' : 'Changer le produit'}
                      </Button>
                    </>
                  )}
                  <p className="max-w-[16rem] text-[10px] leading-snug text-[#777b7f]">
                    L'objet photographié dans la scène. Sans produit choisi ici,
                    la photo reprend le produit chargé au lancement.
                  </p>
                </div>
              </div>

              {promptOuvert !== null && !promptsGalerie?.[promptOuvert] && (
                <p className="text-[10px] leading-snug text-[#777b7f]">
                  Le texte exact utilisé pour cette photo n'est pas connu : elle date d'avant
                  l'enregistrement des consignes. Refaites-la pour connaître son texte réel.
                </p>
              )}
              <textarea
                value={promptBrouillon}
                onChange={(e) => setPromptBrouillon(e.target.value)}
                rows={10}
                placeholder="Décrivez la photo à obtenir : cadrage, lumière, décor, ambiance…"
                className="w-full resize-y rounded-md bg-[#f3f4f5] p-3 text-[12px] leading-relaxed text-[#111] outline-none placeholder:text-[#9a9a9a]"
              />
              <div className="flex flex-wrap justify-end gap-2">
                {onSuggererPrompts && promptOuvert !== null && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setVariationsPour(promptOuvert)}
                  >
                    Proposer des variations
                  </Button>
                )}
                <Button type="button" variant="ghost" onClick={fermerPrompt}>
                  Annuler
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={promptEnregistrement || !promptBrouillon.trim()}
                  onClick={() => void enregistrerPrompt().then((ok) => ok && fermerPrompt())}
                >
                  {promptEnregistrement ? 'Enregistrement…' : 'Enregistrer'}
                </Button>
                {onGenererPhoto && (
                  <Button
                    type="button"
                    disabled={promptEnregistrement || !promptBrouillon.trim()}
                    onClick={() => {
                      const index = promptOuvert;
                      void enregistrerPrompt().then((ok) => {
                        if (!ok || index === null) return;
                        fermerPrompt();
                        onGenererPhoto(index);
                      });
                    }}
                  >
                    Générer cette photo
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap text-[12px] leading-relaxed text-[#52504f]">
              {(promptOuvert !== null && promptsGalerie?.[promptOuvert]) ||
                'Aucun prompt enregistré pour cette photo.'}
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Les variations proposées : elles remplissent le champ en cours
          d'édition, elles ne s'enregistrent jamais toutes seules. */}
      {onSuggererPrompts && (
        <PropositionsPromptDialog
          ouvert={variationsPour !== null}
          onClose={() => setVariationsPour(null)}
          nom={nom}
          position={variationsPour !== null && variationsPour >= 0 ? variationsPour : null}
          charger={async () => {
            if (variationsPour === null) return [];
            if (variationsPour < 0) {
              return onSuggererPrompts(null, generalBrouillon, null);
            }
            return onSuggererPrompts(
              variationsPour,
              promptsGalerie?.[variationsPour] ?? promptBrouillon,
              referenceDe(variationsPour),
            );
          }}
          onChoisir={(texte) => {
            if (variationsPour === null) return;
            if (variationsPour < 0) setGeneralBrouillon(texte);
            else setPromptBrouillon(texte);
          }}
        />
      )}

      {/* Visionneuse plein écran au clic sur une photo (JP, 16/09/2026). */}
      <Dialog open={photoAgrandie !== null} onOpenChange={(o) => !o && setPhotoAgrandie(null)}>
        <DialogContent className="max-w-fit border-0 bg-black/90 p-0 sm:max-w-fit" style={{ background: 'transparent' }}>
          <DialogHeader className="sr-only">
            <DialogTitle>Aperçu de la photo</DialogTitle>
          </DialogHeader>
          {photoAgrandie && (
            <img
              src={photoAgrandie}
              alt="Aperçu en grand"
              className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain"
              onClick={() => setPhotoAgrandie(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </article>
  );
}
