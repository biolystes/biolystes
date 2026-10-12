import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@lystes/components/ui/button";
import { telechargerPublications } from "@lystes/features/social/telechargerPublications";
import { Dialog, DialogContent } from "@lystes/components/ui/dialog";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Music2,
  ThumbsUp,
  Repeat2,
  Search,
} from "lucide-react";
import type { PlateformeEditoriale } from "@lystes/components/mygpt/CarteProfilEditorial";
import type { TextePublicationSociale } from "@lystes/features/social/types-agence";

interface ApercuContenuDialogProps {
  ouvert: boolean;
  onOuvertChange: (ouvert: boolean) => void;
  plateforme: PlateformeEditoriale;
  image?: string;
  nomProfil: string;
  contenu?: TextePublicationSociale;
}

const INTITULES: Record<PlateformeEditoriale, string> = {
  "instagram-feed": "Post Instagram",
  "instagram-story": "Story Instagram",
  "instagram-reel": "Reel Instagram",
  tiktok: "Vidéo TikTok",
  linkedin: "Post LinkedIn",
  x: "Post X",
  facebook: "Post Facebook",
  snapchat: "Snap Snapchat",
  pinterest: "Épingle Pinterest",
  "google-ads": "Annonce Google Ads",
  "meta-ads": "Publicité Meta Ads",
  "tiktok-ads": "Publicité Meta Ads",
  "pinterest-ads": "Publicité Meta Ads",
  "linkedin-ads": "Publicité Meta Ads",
  "snapchat-ads": "Publicité Meta Ads",
};

/** Texte indicatif du contenu prévu pour la publication (le vrai wording est
    rédigé par le profil à la création du post). */
const TEXTE_PREVU: Record<PlateformeEditoriale, string> = {
  "instagram-feed":
    "Accroche pensée pour votre cliente, bénéfice produit concret, preuve, puis appel à l’action vers la fiche produit. Le wording final reprend les préoccupations réelles de vos clientes.",
  "instagram-story":
    "Séquence verticale : accroche en haut, visuel plein écran, appel à l’action en bas. Pensée pour un visionnage rapide.",
  "instagram-reel":
    "Reel vertical rythmé : une accroche immédiate, une démonstration claire et un appel à l’action final.",
  tiktok: "Script vertical rythmé : les 3 premières secondes accrochent, le produit démontre, la fin invite à l’action.",
  linkedin: "Post éditorial : constat, enseignement, lien avec votre marque. Ton professionnel, phrases courtes.",
  x: "Message court et direct, une idée par post, éventuellement décliné en thread.",
  facebook: "Post de page chaleureux : bénéfice produit concret, preuve sociale, appel à l’action vers la boutique.",
  snapchat: "Snap vertical spontané : accroche très courte dans l’image, pensée pour un visionnage immédiat.",
  pinterest: "Épingle inspirante : titre clair, visuel net et vertical, pensée pour la recherche visuelle.",
  "google-ads": "Titre accrocheur relié à une recherche réelle, description orientée bénéfice, lien vers la page produit.",
  "meta-ads": "Visuel produit en avant, accroche orientée bénéfice, bouton d’appel à l’action vers la boutique.",
  "tiktok-ads": "Visuel produit en avant, accroche orientée bénéfice, bouton d’appel à l’action vers la boutique.",
  "pinterest-ads": "Visuel produit en avant, accroche orientée bénéfice, bouton d’appel à l’action vers la boutique.",
  "linkedin-ads": "Visuel produit en avant, accroche orientée bénéfice, bouton d’appel à l’action vers la boutique.",
  "snapchat-ads": "Visuel produit en avant, accroche orientée bénéfice, bouton d’appel à l’action vers la boutique.",
};

function ImageOuCadre({ image, className }: { image?: string; className: string }) {
  if (image) {
    return <img src={image} alt="" className={className} />;
  }
  return (
    <div className={`${className} flex items-center justify-center bg-muted text-center text-[10px] text-muted-foreground`}>
      Visuel à créer
    </div>
  );
}

/** Post Instagram : image à gauche pleine hauteur, colonne texte façon Instagram. */
function ApercuInstagram({ image, contenu }: { image?: string; contenu?: TextePublicationSociale }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background sm:flex-row">
      <div className="min-h-0 sm:h-full sm:w-[55%]">
        <ImageOuCadre image={image} className="h-56 w-full object-cover sm:h-full" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2.5 p-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">L</span>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-foreground">votre_marque</p>
            <p className="text-[10px] text-muted-foreground">Paris</p>
          </div>
          <span className="ml-auto text-muted-foreground">···</span>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
          <div className="flex gap-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[9px] font-semibold text-foreground">L</span>
            <p className="text-[11px] leading-relaxed text-foreground">
              <span className="font-semibold">votre_marque</span>{" "}
               {contenu?.caption || TEXTE_PREVU["instagram-feed"]}
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground">Les commentaires de vos clientes apparaîtront ici.</p>
        </div>
        <div className="p-3">
          <div className="flex items-center gap-3 text-foreground">
            <Heart className="h-5 w-5" />
            <MessageCircle className="h-5 w-5" />
            <Send className="h-5 w-5" />
            <Bookmark className="ml-auto h-5 w-5" />
          </div>
           {contenu?.hashtags.length ? <p className="mt-2 text-[10px] text-primary">{contenu.hashtags.join(" ")}</p> : null}
           <p className="mt-2 text-[11px] font-semibold text-foreground">Aimé par vos clientes</p>
          <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">À l’instant</p>
        </div>
      </div>
    </div>
  );
}

/** Story / TikTok : visuel vertical plein écran, interface par-dessus. */
function ApercuVertical({ image, plateforme, contenu }: { image?: string; plateforme: PlateformeEditoriale; contenu?: TextePublicationSociale }) {
  const tiktok = plateforme === "tiktok";
  return (
    <div className="relative mx-auto h-full max-h-[640px] w-full max-w-[340px] overflow-hidden">
      <ImageOuCadre image={image} className="absolute inset-0 h-full w-full object-cover" />
      {!tiktok && (
        <div className="absolute inset-x-3 top-3 flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-0.5 flex-1 rounded-full ${i === 0 ? "bg-background" : "bg-background/40"}`} />
          ))}
        </div>
      )}
      <div className="absolute inset-x-3 top-6 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-background text-[9px] font-semibold text-foreground">L</span>
        <p className="text-[11px] font-semibold text-background">votre_marque</p>
      </div>
      <div className="absolute inset-x-4 bottom-16">
        <p className="text-[13px] font-semibold leading-snug text-background">
           {contenu?.image_overlay || contenu?.caption || TEXTE_PREVU[plateforme]}
        </p>
      </div>
      <div className="absolute inset-x-4 bottom-4 flex items-center gap-2">
        <span className="flex-1 rounded-full bg-background/20 px-3 py-2 text-[10px] text-background">
           {contenu?.call_to_action || (tiktok ? "Ajouter un commentaire…" : "Envoyer un message…")}
        </span>
        {tiktok ? <Music2 className="h-5 w-5 text-background" /> : <Heart className="h-5 w-5 text-background" />}
      </div>
    </div>
  );
}

/** LinkedIn / X / Facebook : post horizontal, texte au-dessus du visuel. */
function ApercuPostSocial({ image, plateforme, contenu }: { image?: string; plateforme: PlateformeEditoriale; contenu?: TextePublicationSociale }) {
  const x = plateforme === "x";
  const fb = plateforme === "facebook";
  return (
    <div className="mx-auto w-full max-w-[520px] overflow-hidden bg-background">
      <div className="flex items-start gap-3 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
          {x ? "X" : fb ? "f" : "in"}
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-foreground">Votre marque</p>
          <p className="text-[10px] text-muted-foreground">
            {x ? "@votremarque · maintenant" : fb ? "Sponsorisé · 🌐" : "Marque · maintenant"}
          </p>
        </div>
      </div>
       <p className="px-4 pb-3 text-[12px] leading-relaxed text-foreground">{contenu?.caption || TEXTE_PREVU[plateforme]}</p>
       {contenu?.hashtags.length ? <p className="px-4 pb-3 text-[10px] text-primary">{contenu.hashtags.join(" ")}</p> : null}
      <ImageOuCadre image={image} className={`${fb ? "aspect-[4/5]" : "aspect-[16/9]"} w-full object-cover`} />
      <div className="flex items-center justify-around p-3 text-muted-foreground">
        {x ? (
          <>
            <MessageCircle className="h-4 w-4" />
            <Repeat2 className="h-4 w-4" />
            <Heart className="h-4 w-4" />
            <Bookmark className="h-4 w-4" />
          </>
        ) : fb ? (
          <>
            <ThumbsUp className="h-4 w-4" />
            <MessageCircle className="h-4 w-4" />
            <Send className="h-4 w-4" />
          </>
        ) : (
          <>
            <ThumbsUp className="h-4 w-4" />
            <MessageCircle className="h-4 w-4" />
            <Repeat2 className="h-4 w-4" />
            <Send className="h-4 w-4" />
          </>
        )}
      </div>
    </div>
  );
}

/** Pinterest : épingle verticale, bouton Enregistrer, titre dessous. */
function ApercuPinterest({ image, contenu }: { image?: string; contenu?: TextePublicationSociale }) {
  return (
    <div className="mx-auto w-full max-w-[340px]">
      <div className="relative overflow-hidden rounded-2xl">
        <ImageOuCadre image={image} className="aspect-[2/3] w-full object-cover" />
        <span className="absolute right-3 top-3 rounded-full bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background">Enregistrer</span>
      </div>
      <div className="flex items-center gap-2 px-1 pt-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[9px] font-semibold text-foreground">L</span>
        <div className="min-w-0">
           <p className="truncate text-[12px] font-semibold text-foreground">{contenu?.caption || "Titre de l’épingle"}</p>
          <p className="text-[10px] text-muted-foreground">Votre marque</p>
        </div>
      </div>
    </div>
  );
}

/** Google Ads : rendu annonce sponsorisée. */
function ApercuGoogleAds() {
  return (
    <div className="mx-auto w-full max-w-[520px] rounded-lg bg-background p-5">
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <span className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground">Sponsorisé</span>
        <Search className="h-3.5 w-3.5" />
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">L</span>
        <div>
          <p className="text-[12px] text-foreground">Votre marque</p>
          <p className="text-[11px] text-muted-foreground">https://votre-boutique.com</p>
        </div>
      </div>
      <p className="mt-2 text-[16px] font-medium leading-snug text-primary">
        Un titre publicitaire relié à une recherche réelle de vos clientes
      </p>
      <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{TEXTE_PREVU["google-ads"]}</p>
    </div>
  );
}

/** Meta Ads : visuel plein + barre publicité. */
function ApercuMetaAds({ image }: { image?: string }) {
  return (
    <div className="mx-auto w-full max-w-[460px] overflow-hidden bg-background">
      <div className="flex items-center gap-2.5 p-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">L</span>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-foreground">Votre marque</p>
          <p className="text-[10px] text-muted-foreground">Sponsorisé · 🌐</p>
        </div>
      </div>
      <p className="px-3 pb-3 text-[12px] leading-relaxed text-foreground">{TEXTE_PREVU["meta-ads"]}</p>
      <ImageOuCadre image={image} className="aspect-square w-full object-cover" />
      <div className="flex items-center justify-between bg-muted px-4 py-3">
        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-wide text-muted-foreground">votre-boutique.com</p>
          <p className="truncate text-[12px] font-semibold text-foreground">Découvrir le produit</p>
        </div>
        <span className="rounded-md bg-background px-3 py-1.5 text-[11px] font-semibold text-foreground">Acheter</span>
      </div>
    </div>
  );
}

export function ApercuContenuDialog({
  ouvert,
  onOuvertChange,
  plateforme,
  image,
  nomProfil,
  contenu,
}: ApercuContenuDialogProps) {
  const vertical = plateforme === "instagram-story" || plateforme === "instagram-reel" || plateforme === "tiktok" || plateforme === "snapchat";
  return (
    <Dialog open={ouvert} onOpenChange={onOuvertChange}>
      <DialogContent className={`max-h-[90vh] max-w-3xl overflow-y-auto p-0 ${vertical ? "!bg-transparent" : "bg-muted"}`}>
        <div className={vertical ? "h-[70vh]" : ""}>
           {plateforme === "instagram-feed" && <ApercuInstagram image={image} contenu={contenu} />}
           {vertical && <ApercuVertical image={image} plateforme={plateforme} contenu={contenu} />}
          {(plateforme === "linkedin" || plateforme === "x" || plateforme === "facebook") && (
             <ApercuPostSocial image={image} plateforme={plateforme} contenu={contenu} />
          )}
           {plateforme === "pinterest" && <ApercuPinterest image={image} contenu={contenu} />}
          {plateforme === "google-ads" && <ApercuGoogleAds />}
          {plateforme === "meta-ads" && <ApercuMetaAds image={image} />}
        </div>
        {(image || contenu) && (
          <div className="flex justify-end p-3">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 bg-background px-3 text-[10px]"
              onClick={() => {
                void telechargerPublications(
                  [{
                    jour: contenu?.day_index ?? 0,
                    jourLibelle: "Publication",
                    plateforme,
                    index: contenu?.slot_index ?? 0,
                    produit: null,
                    imageUrl: contenu?.image_url ?? image ?? null,
                    legende: contenu?.caption,
                    hashtags: contenu?.hashtags,
                    appelAction: contenu?.call_to_action,
                    texteImage: contenu?.image_overlay,
                    prompt: contenu?.prompt_exact,
                  }],
                  `${nomProfil.split(" ")[0].toLowerCase()}-publication`,
                ).then((resultat) =>
                  toast.success(resultat.sansImage ? "Texte téléchargé, image manquante." : "Image et texte téléchargés."),
                ).catch(() => toast.error("Le téléchargement a échoué."));
              }}
            >
              <Download className="mr-1.5 h-3 w-3" /> Télécharger
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
