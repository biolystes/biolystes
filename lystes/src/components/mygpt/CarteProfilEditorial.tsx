import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, RefreshCw, Trash2, Users } from "lucide-react";
import { Button } from "@lystes/components/ui/button";
import { ContexteClientDialog } from "@lystes/components/mygpt/ContexteClientDialog";
import { ApercuContenuDialog } from "@lystes/components/mygpt/ApercuContenuDialog";
import {
  CadreContenu,
  CONFIG_PLATEFORME,
  tailleCadre,
  type PlateformeEditoriale,
} from "@lystes/components/mygpt/editorial-formats";
import {
  SemaineCommunityManager,
  type OptionsAgenceSemaine,
  type PublicationJour,
  type SemaineCM,
} from "@lystes/components/mygpt/SemaineCommunityManager";
import { cn } from "@lystes/lib/utils";
import { equipeAgenceParDefaut } from "@lystes/features/social/equipe-agence";
import type { MembreAgenceSociale, ProduitAgenceSociale, ProduitSemaine, TextePublicationSociale } from "@lystes/features/social/types-agence";
import { EquipeAgenceCompacte, OrganigrammeAgenceDialog } from "@lystes/components/mygpt/OrganigrammeAgenceDialog";
import { ProduitsSemaine } from "@lystes/components/mygpt/ProduitsSemaine";
import { ApercuArticle } from "@lystes/features/ai-photographers/components/ApercuArticle";

export type { PlateformeEditoriale, SemaineCM };

interface CarteProfilEditorialProps {
  profileId: string;
  nom: string;
  avatar?: string | null;
  specialite?: string | null;
  description?: string | null;
  galerie?: string[];
  plateforme: PlateformeEditoriale;
  /* 14/09/2026 (JP) : « community manager sera renommé en agence ». Les deux
     anciennes valeurs restent acceptées le temps que les appelants suivent :
     un type qui casse la compilation de trois écrans pour un renommage de
     libellé se paie plus cher qu'il ne rapporte. */
  role: "Agence" | "Community manager" | "Media buyer";
  actif?: boolean;
  prioritaire?: boolean;
  onAction: () => void;
  onDelete?: () => void;
  onRefaire?: () => void;
  /** Anciennes générations dont le texte exact n'avait pas été conservé. */
  nbNonTracables?: number;
  /** Reprend le contexte cliente dans le prompt général du profil. */
  onAppliquerContexte?: (brief: string) => void;
  /** Le prompt retenu pour un emplacement de la semaine, réseau par réseau. */
  promptDe?: (plateforme: PlateformeEditoriale, index: number) => string;
  onEnregistrerPrompt?: (
    plateforme: PlateformeEditoriale,
    index: number,
    texte: string,
  ) => Promise<boolean> | void;
  /** Relance toutes les publications d'un jour, dans l'ordre du plan. */
  onRefaireJournee?: (publications: PublicationJour[], libelleJour: string) => void;
  /** Relance une seule publication, avec le prompt édité. */
  onRefairePhoto?: (publication: PublicationJour) => void;
  equipe?: MembreAgenceSociale[];
  catalogueProduits?: ProduitAgenceSociale[];
  produitsSemaine?: ProduitSemaine[];
  onBasculerProduit?: (produit: ProduitAgenceSociale) => void;
  contenuDe?: (jour: number, plateforme: PlateformeEditoriale, index: number) => TextePublicationSociale | undefined;
  onEnregistrerContenu?: (contenu: TextePublicationSociale) => Promise<boolean>;
  onGenererContenu?: (contenu: TextePublicationSociale, productName: string) => Promise<{ ok: boolean; message?: string }>;
  /** Le réglage de semaine déjà enregistré, pour qu'il survive à l'onglet. */
  planEnregistre?: SemaineCM | null;
  onEnregistrerPlan?: (jour: number, plateforme: PlateformeEditoriale, nombre: number) => void;
  /** Faux pour la livraison simple : neuf photos, sans la semaine. */
  vueSemaine?: boolean;
  /** Le métier du profil : il décide des plateformes et du rythme. */
  metier?: string;
  /**
   * Lance la première séance du profil, quand la page sait la lancer.
   * Optionnelle à dessein : sans elle, l'état vide explique sans rien promettre.
   */
  onCreerPortfolio?: () => void;
  /* 16/09/2026 (JP) : « il faut conserver les fonctionnalités de régénération
     d'image ». En passant les photographes sur ce gabarit, chaque case avait
     perdu sa reprise et sa suppression : elles reviennent ici, position par
     position, comme sur l'ancienne carte créative. */
  /** Relance UNE case du portfolio, sans toucher aux autres. */
  onGenererPhoto?: (index: number) => void;
  /** Retire UNE photo du portfolio. */
  onSupprimerPhoto?: (index: number) => void;
  /** L'agence est embauchée : la semaine passe en mode programmé (30/09). */
  agence?: OptionsAgenceSemaine;
  /** Libellé du bouton principal ; « Sélectionner le profil » par défaut. */
  libelleAction?: string;
}

/* POURQUOI LA GRILLE VIDE PARLE, AU LIEU D'ALIGNER NEUF CARRÉS GRIS.

   15/09/2026 (JP) : « Pourquoi parler de 20/20 s'il n'y a pas d'aperçu des
   portfolios ? »

   Mesuré : six agences marketing et quatre graphistes de style arrivent sans
   le moindre visuel. Leur carte montrait neuf carrés gris, sans un mot et sans
   issue. Une agence sans réalisations ne se choisit pas, et rien à l'écran ne
   disait que la séance restait à faire.

   Ce qu'on ne fait surtout pas : combler avec des photos produit existantes.
   Ces agences produisent des créas publicitaires, un packshot y passerait pour
   du travail livré, et la marchande jugerait une agence sur des images qu'elle
   n'a jamais faites. Le vide dit donc ce qu'il est, et propose la seule chose
   qui le remplit vraiment.

   À ne pas étendre au portfolio incomplet : entre un et huit visuels, la
   grille et ses cases grises restent justes, c'est un travail en cours et non
   un travail absent. */
function PortfolioVide({
  nom,
  onCreer,
  profilId,
  nombre,
}: {
  nom: string;
  onCreer?: () => void;
  profilId?: string;
  nombre: number;
}) {
  /* 15/09/2026 (JP) : « si je dois choisir un agent SEO, je dois savoir quel
     type d'article il va ecrire pour moi ». Avant cette date, six journalistes
     rendaient six blocs identiques et le choix etait impossible. Le gabarit
     passe AVANT l'invitation a payer : on montre, puis on propose. */
  return (
    <>
      {profilId && <ApercuArticle profilId={profilId} />}
      <div className="mt-3 rounded bg-muted p-3 text-center">
      <ImagePlus className="mx-auto h-4 w-4 text-muted-foreground" aria-hidden="true" />
      <p className="mt-1.5 text-[9px] font-semibold leading-relaxed text-foreground">
        {nom} n'a encore rien créé pour votre boutique.
      </p>
      <p className="mt-1 text-[8px] leading-relaxed text-muted-foreground">
        Une première séance livre {nombre} contenus dans son style.
      </p>
      {/* Le bouton n'apparaît que si la page sait vraiment lancer la séance :
          un bouton qui ne fait rien coûte plus cher qu'une case vide, il promet
          une issue puis la retire.
          01/10/2026 : il était vert #e1f3c5. La charte réserve ce vert à l'élu,
          un seul par écran ; sur la page d'agence, chaque carte au portfolio
          vide en portait un, à côté du mandat choisi. Blanc sur la pierre du
          bloc, comme une pastille qu'on vise, rayon 9. */}
      {onCreer && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-7 w-full rounded-[9px] bg-background text-[9px] font-semibold text-foreground hover:bg-background hover:text-[#231e1f]"
          onClick={onCreer}
        >
          Créer ses premiers contenus
        </Button>
      )}
      </div>
    </>
  );
}

export function CarteProfilEditorial({
  profileId,
  nom,
  avatar,
  specialite,
  description,
  galerie = [],
  plateforme,
  role,
  actif = false,
  prioritaire = false,
  onAction,
  onDelete,
  onRefaire,
  nbNonTracables = 0,
  onAppliquerContexte,
  promptDe,
  onEnregistrerPrompt,
  onRefaireJournee,
  onRefairePhoto,
  equipe,
  catalogueProduits = [],
  produitsSemaine = [],
  onBasculerProduit,
  contenuDe,
  onEnregistrerContenu,
  onGenererContenu,
  planEnregistre,
  onEnregistrerPlan,
  vueSemaine = true,
  metier,
  onCreerPortfolio,
  onGenererPhoto,
  onSupprimerPhoto,
  agence,
  libelleAction = "Sélectionner le profil",
}: CarteProfilEditorialProps) {
  const rail = useRef<HTMLDivElement>(null);
  const [photoAgrandie, setPhotoAgrandie] = useState<string | null>(null);
  const [contexteOuvert, setContexteOuvert] = useState(false);
  const [organigrammeOuvert, setOrganigrammeOuvert] = useState(false);
  const [apercu, setApercu] = useState<{ plateforme: PlateformeEditoriale; image?: string; contenu?: TextePublicationSociale } | null>(null);
  const config = CONFIG_PLATEFORME[plateforme];
  const { Icone } = config;
  /* LA GRILLE FAIT NEUF CASES, ET LE COMPTEUR DOIT DIRE NEUF.
     14/09/2026 (JP) : « je veux juste que tous les profils soient pareils au
     niveau de leur portfolio ». Mesuré : la grille montrait 9 cases pendant
     que la ligne « Portfolio » annonçait `galerie.length`, soit 11 chez Lucie,
     6 chez d'autres. Deux vérités contradictoires sur la même carte, et des
     profils qui ne se ressemblaient pas d'une ligne à l'autre.
     Le portfolio d'un profil d'agence, c'est ces neuf contenus. */
  /* 16/09/2026 (JP) : « 3 photos par profil et 3 photos générées par profil ».
     Le photographe livre trois prises, pas neuf — la grille, le compteur et le
     texte de la séance disent le même nombre, celui du métier. */
  const CASES_PORTFOLIO = metier === "photographe" ? 3 : 9;
  const contenus = Array.from({ length: CASES_PORTFOLIO }, (_, index) => galerie[index]);
  const nbContenus = Math.min(galerie.length, CASES_PORTFOLIO);
  /* 12/09/2026 (JP) : un profil d'agence ne tient pas une seule plateforme —
     il tient une semaine. 14/09 : « community manager » devient « agence », et
     tous les profils de l'annuaire en sont. */
  /* 14/09/2026 (JP) : « il faut aussi l'ancienne version ou il y avait juste le
     community manager qui livrait 9 photos ».

     Le 12/09, la carte d'un profil community est passee de la grille de neuf
     photos a la vue SEMAINE. C'est un gain pour l'agence, qui tient sept
     reseaux, mais la livraison simple a disparu du meme coup : neuf photos dans
     le style du feed, rien d'autre a regler. Cowork la fait toujours, la page
     ne la faisait plus.

     `vueSemaine={false}` rend la vue d'origine. Les deux cohabitent, chacune a
     son adresse : on ne remplace pas un usage par un autre sous pretexte que le
     second est plus riche. */
  const estCommunity = (role === "Agence" || role === "Community manager") && vueSemaine;
  const membresAgence = equipe ?? equipeAgenceParDefaut(nom, avatar);

  const defiler = (direction: -1 | 1) => {
    rail.current?.scrollBy({ left: direction * 200, behavior: "smooth" });
  };

  return (
    <article className={cn("grid min-w-0 overflow-hidden rounded-lg bg-background lg:grid-cols-[220px_minmax(0,1fr)]", actif && "ring-1 ring-primary")}>
      <section className="flex min-w-0 flex-col bg-background p-4 lg:p-4">
        <div className="flex items-start justify-between gap-3">
          {avatar ? (
            <img src={avatar} alt={`Portrait de ${nom}`} loading="lazy" className="h-12 w-12 rounded-full object-cover ring-2 ring-muted" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {nom.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex gap-1">
            {onRefaire && <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onRefaire} aria-label={`Refaire les contenus de ${nom}`}><RefreshCw className="h-3 w-3" /></Button>}
            {onDelete && <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={onDelete} aria-label={`Supprimer ${nom}`}><Trash2 className="h-3 w-3" /></Button>}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{role}</p>
          <h2 className="mt-0.5 font-display text-lg font-medium leading-tight text-foreground">{nom}</h2>
          <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">{specialite || config.libelle}</p>
          <p className="mt-2 line-clamp-2 text-[9px] leading-relaxed text-muted-foreground">
            {description || `Crée et organise vos contenus ${config.libelle} dans un style cohérent avec votre marque.`}
          </p>
        </div>

        {/* `nbContenus` décide, et c'est le même nombre que la ligne
            « Portfolio » plus bas : deux vérités contradictoires sur une même
            carte, on en a déjà payé le prix le 14/09. */}
        {nbContenus === 0 ? (
          <PortfolioVide nom={nom} onCreer={onCreerPortfolio} profilId={profileId} nombre={CASES_PORTFOLIO} />
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-1" aria-label="Aperçu des réalisations">
            {contenus.map((image, index) =>
              image ? (
                <div
                  key={`${image}-${index}`}
                  className="group relative aspect-square cursor-zoom-in overflow-hidden rounded bg-muted"
                  role="button"
                  aria-label={`Agrandir la photo ${index + 1}`}
                  onClick={() => setPhotoAgrandie(image)}
                >
                  <img src={image} alt="" loading={prioritaire ? "eager" : "lazy"} className="h-full w-full object-cover" />
                  {onGenererPhoto && (
                    <button
                      type="button"
                      aria-label={`Refaire la photo ${index + 1}`}
                      title="Refaire cette photo"
                      className="absolute left-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-background/90 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                      onClick={(event) => { event.stopPropagation(); onGenererPhoto(index); }}
                    >
                      <RefreshCw className="h-2.5 w-2.5" />
                    </button>
                  )}
                  {onSupprimerPhoto && (
                    <button
                      type="button"
                      aria-label={`Supprimer la photo ${index + 1} du portfolio`}
                      title="Supprimer cette photo"
                      className="absolute bottom-1 right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-background/90 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                      onClick={(event) => { event.stopPropagation(); onSupprimerPhoto(index); }}
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  key={`vide-${index}`}
                  type="button"
                  disabled={!onGenererPhoto}
                  aria-label={`Créer la photo ${index + 1}`}
                  title={`Créer la photo ${index + 1}`}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-default"
                  onClick={(event) => { event.stopPropagation(); onGenererPhoto?.(index); }}
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  <span className="text-[9px]">Photo {index + 1}</span>
                </button>
              ),
            )}
          </div>
        )}

        <div className="mt-3 flex items-center gap-3 text-[9px]">
          <div><p className="text-[7px] uppercase tracking-[0.12em] text-muted-foreground">{estCommunity ? "Réseaux" : "Plateforme"}</p><p className="mt-0.5 font-semibold text-foreground">{estCommunity ? "IG · TikTok · X · LinkedIn" : config.libelle}</p></div>
          <div><p className="text-[7px] uppercase tracking-[0.12em] text-muted-foreground">Portfolio</p><p className="mt-0.5 font-semibold text-foreground">{nbContenus} contenus</p></div>
        </div>

        {nbNonTracables > 0 && (
          <p className="mt-2 text-[9px] font-medium text-destructive">
            {nbNonTracables} ancienne{nbNonTracables > 1 ? "s" : ""} image{nbNonTracables > 1 ? "s" : ""} non traçable{nbNonTracables > 1 ? "s" : ""}
          </p>
        )}

        <Button className="mt-3 w-full" size="sm" onClick={onAction}>{libelleAction}</Button>
        {/* 12/09/2026 (JP) : le wording ne part pas de la seule photo — il part
            aussi de l'avatar client et des préoccupations entendues. */}
        <Button
          className="mt-1.5 w-full"
          size="sm"
          variant="outline"
          onClick={() => setContexteOuvert(true)}
        >
          Contexte cliente
        </Button>
        {estCommunity && <EquipeAgenceCompacte membres={membresAgence} onOuvrir={() => setOrganigrammeOuvert(true)} />}
      </section>

      {photoAgrandie && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 p-6"
          role="dialog"
          aria-label="Photo agrandie"
          onClick={() => setPhotoAgrandie(null)}
        >
          <img src={photoAgrandie} alt="" className="max-h-full max-w-full object-contain" />
        </div>
      )}

      <ContexteClientDialog
        ouvert={contexteOuvert}
        onOuvertChange={setContexteOuvert}
        nomProfil={nom}
        plateforme={config.libelle}
        onAppliquer={onAppliquerContexte}
      />
      <OrganigrammeAgenceDialog ouvert={organigrammeOuvert} onOuvertChange={setOrganigrammeOuvert} nomAgence={nom} membres={membresAgence} />

      <section className="min-w-0 bg-muted p-5 lg:p-6">
        {estCommunity ? (
          <SemaineCommunityManager
            profileId={profileId}
            nom={nom}
            galerie={galerie}
            prioritaire={prioritaire}
            onOuvrirContenu={(plateformeJour, image, contenu) => setApercu({ plateforme: plateformeJour, image, contenu })}
            promptDe={promptDe}
            onEnregistrerPrompt={onEnregistrerPrompt}
            onRefaireJournee={onRefaireJournee}
            onRefairePhoto={onRefairePhoto}
            equipe={membresAgence}
            metier={metier}
            planEnregistre={planEnregistre}
            onEnregistrerPlan={onEnregistrerPlan}
            catalogueProduits={catalogueProduits}
            produitsSemaine={produitsSemaine}
            onBasculerProduit={onBasculerProduit}
            contenuDe={contenuDe}
            onEnregistrerContenu={onEnregistrerContenu}
            onGenererContenu={onGenererContenu}
            agence={agence}
          />
        ) : (
          <>
            {/* 14/09/2026 (JP) : « dans community manager, pour faire le feed de
                9 photos, donne la possibilité de choisir plusieurs produits ».

                La sélection multiple existait, mais seulement dans la vue
                semaine : la livraison simple tirait ses neuf photos d'un seul
                produit, choisi par l'agent. Un feed Instagram montre une gamme,
                pas un flacon répété neuf fois. C'est le même composant que
                l'agence, monté ici aussi. */}
            {/* 16/09/2026 (JP) : zone entourée à retirer pour les
                photographes — pas de bande « Produits de la semaine »
                sur leur fiche, le template Instagram reste. */}
            {onBasculerProduit && metier !== "photographe" && (
              <ProduitsSemaine
                produits={produitsSemaine}
                catalogue={catalogueProduits}
                onBasculer={onBasculerProduit}
              />
            )}

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-8 w-9 shrink-0 items-center justify-center rounded-[9px] bg-background text-foreground"><Icone className="h-4 w-4" strokeWidth={1.3} /></span>
                <div className="min-w-0"><p className="truncate text-[11px] font-semibold text-foreground">Style de contenus · {config.libelle}</p><p className="text-[8px] uppercase tracking-[0.14em] text-muted-foreground">{config.format}</p></div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-background" onClick={() => defiler(-1)} aria-label="Contenu précédent"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-background" onClick={() => defiler(1)} aria-label="Contenu suivant"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>

            <div ref={rail} className="mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {contenus.map((image, index) => (
                <button
                  type="button"
                  key={`${plateforme}-${image ?? index}`}
                  onClick={() => setApercu({ plateforme, image })}
                  aria-label={`Agrandir le contenu ${index + 1} (${config.libelle})`}
                  className={cn(
                    "shrink-0 snap-start overflow-hidden rounded-lg bg-background text-left transition-opacity hover:opacity-90",
                    tailleCadre(plateforme),
                  )}
                >
                  <CadreContenu plateforme={plateforme} image={image} index={index} prioritaire={prioritaire} />
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      <ApercuContenuDialog
        ouvert={apercu !== null}
        onOuvertChange={(ouvert) => !ouvert && setApercu(null)}
        plateforme={apercu?.plateforme ?? plateforme}
        image={apercu?.image}
        nomProfil={nom}
        contenu={apercu?.contenu}
      />
    </article>
  );
}
