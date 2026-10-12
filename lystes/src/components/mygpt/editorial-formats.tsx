/**
 * Les formats éditoriaux partagés : la liste des plateformes, leur libellé, et
 * le cadre qui dessine un contenu à l'apparence de sa destination.
 *
 * Extrait de `CarteProfilEditorial.tsx` le 12/09/2026 : la semaine du community
 * manager avait besoin du même cadre, et deux copies auraient divergé au
 * premier ajustement.
 */
import {
  Bookmark,
  Facebook,
  Ghost,
  Globe2,
  Heart,
  Instagram,
  Linkedin,
  Megaphone,
  MessageCircle,
  MoreHorizontal,
  Music2,
  Pause,
  Pin,
  Repeat2,
  Search,
  Send,
  ThumbsUp,
  Volume2,
} from "lucide-react";
import { cn } from "@lystes/lib/utils";

export type PlateformeEditoriale =
  | "instagram-feed"
  | "instagram-story"
  | "instagram-reel"
  | "tiktok"
  | "linkedin"
  | "x"
  | "facebook"
  | "snapchat"
  | "pinterest"
  | "google-ads"
  | "meta-ads"
  | "tiktok-ads"
  | "pinterest-ads"
  | "linkedin-ads"
  | "snapchat-ads";

export const CONFIG_PLATEFORME: Record<PlateformeEditoriale, {
  libelle: string;
  court: string;
  format: string;
  Icone: typeof Instagram;
}> = {
  "instagram-feed": { libelle: "Instagram Feed", court: "Post", format: "Posts 4:5", Icone: Instagram },
  "instagram-story": { libelle: "Instagram Stories", court: "Story", format: "Stories 9:16", Icone: Instagram },
  "instagram-reel": { libelle: "Instagram Reels", court: "Reel", format: "Reels 9:16", Icone: Instagram },
  tiktok: { libelle: "TikTok", court: "TikTok", format: "Vidéos 9:16", Icone: Music2 },
  linkedin: { libelle: "LinkedIn", court: "LinkedIn", format: "Posts éditoriaux", Icone: Linkedin },
  x: { libelle: "X", court: "X", format: "Posts & threads", Icone: MessageCircle },
  facebook: { libelle: "Facebook", court: "Post", format: "Posts 4:5", Icone: Facebook },
  snapchat: { libelle: "Snapchat", court: "Snap", format: "Snaps 9:16", Icone: Ghost },
  pinterest: { libelle: "Pinterest", court: "Épingle", format: "Épingles 2:3", Icone: Pin },
  "google-ads": { libelle: "Google Ads", court: "Google", format: "Search & Display", Icone: Search },
  "meta-ads": { libelle: "Meta Ads", court: "Meta", format: "Social Ads", Icone: Megaphone },
  /* 14/09/2026 (JP) : « marketing et GEO sont censes etre presentes comme le
     template agence PAR PLATEFORME, sauf qu'il s'agit de pub, et qu'il y a
     Google Ads en plus ».

     Quatre regies manquaient. Sans elles, une agence marketing n'avait que deux
     plateformes a tenir sur six, et quatre de ses agences ne pouvaient pas
     apparaitre dans une semaine. Le format compte autant que le reseau : une
     crea Meta en 4:5 est illisible en Shopping Google, ou l'image doit etre nue
     sur blanc. */
  "tiktok-ads": { libelle: "TikTok Ads", court: "TikTok", format: "Vidéos 9:16", Icone: Music2 },
  "pinterest-ads": { libelle: "Pinterest Ads", court: "Épingle", format: "Épingles 2:3", Icone: Pin },
  "linkedin-ads": { libelle: "LinkedIn Ads", court: "LinkedIn", format: "Posts sponsorisés", Icone: Linkedin },
  "snapchat-ads": { libelle: "Snapchat Ads", court: "Snap", format: "Verticales 9:16", Icone: Ghost },
};

/** Une hauteur commune aligne le rail ; seule la largeur traduit le format. */
export function tailleCadre(plateforme: PlateformeEditoriale) {
  if (plateforme === "instagram-story" || plateforme === "instagram-reel" || plateforme === "tiktok" || plateforme === "snapchat") return "h-[300px] w-[169px]";
  if (plateforme === "instagram-feed") return "h-[300px] w-[180px]";
  if (plateforme === "pinterest") return "h-[300px] w-[200px]";
  if (plateforme === "facebook") return "h-[300px] w-[240px]";
  if (plateforme === "meta-ads") return "h-[300px] w-[232px]";
  return "h-[300px] w-[300px]";
}

export function CadreContenu({
  plateforme,
  image,
  index,
  prioritaire,
  legende,
  hashtags = [],
  appelAction,
  texteImage,
  mention,
}: {
  plateforme: PlateformeEditoriale;
  image?: string;
  index: number;
  prioritaire: boolean;
  legende?: string;
  hashtags?: string[];
  appelAction?: string;
  texteImage?: string;
  /** Posée SUR l'image (« Image générée par IA ») : jamais sans image. */
  mention?: string;
}) {
  const config = CONFIG_PLATEFORME[plateforme];
  const visuel = image ? (
    <img
      src={image}
      alt=""
      loading={prioritaire && index === 0 ? "eager" : "lazy"}
      decoding="async"
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full items-center justify-center bg-muted px-6 text-center text-[13px] text-muted-foreground">
      Contenu à créer
    </div>
  );
  const corps = image && mention ? (
    <div className="relative h-full w-full">
      {visuel}
      {/* Les formats verticaux occupent leur bas (barre de réponse, légende
          du reel, texte posé sur l'image à bottom-14) : la mention se pose en
          haut, sous l'en-tête du compte. À bottom-14, elle chevauchait le
          texte de la story (capture 1440-06 du 30/09).
          C'est une étiquette de la charte : 8,5 px, 600, capitales, +0,07em,
          rayon 5. À 8 px, l'annuaire la ramenait à 6 px (index.css,
          `.annuaire-repertoire .text-[8px]`) : illisible. */}
      <span
        className={cn(
          "pointer-events-none absolute left-1.5 rounded-[5px] bg-background/90 px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.07em] text-foreground",
          ["instagram-story", "instagram-reel", "tiktok", "snapchat"].includes(plateforme) ? "top-10" : "bottom-1.5",
        )}
      >
        {mention}
      </span>
    </div>
  ) : (
    visuel
  );

  if (plateforme === "google-ads") {
    return (
      <div className="flex h-full flex-col justify-between bg-background p-6">
        <div>
          <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-semibold text-foreground">A</span>
            Annonce · Votre marque
          </div>
          <p className="mt-6 text-[22px] font-medium leading-snug text-primary">
            Un titre publicitaire adapté à votre produit
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            Une annonce claire, reliée à une recherche réelle et à une page produit.
          </p>
        </div>
        <span className="text-[13px] font-medium text-foreground">Aperçu Google Ads {index + 1}</span>
      </div>
    );
  }

  if (plateforme === "linkedin") {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-background">
        <div className="flex h-9 shrink-0 items-center gap-2 px-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[8px] font-semibold text-background">VM</span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[9px] font-semibold text-foreground">Votre marque <span className="font-normal text-muted-foreground">· 1er</span></p>
            <p className="mt-0.5 flex items-center gap-1 text-[7px] text-muted-foreground">Sponsorisé <Globe2 className="h-2 w-2" /></p>
          </div>
          <MoreHorizontal className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <p className="line-clamp-3 px-3 py-2 text-[10px] leading-relaxed text-foreground">
          {legende || "Légende à générer"}
        </p>
        <div className="min-h-0 flex-1 overflow-hidden">{corps}</div>
        <div className="flex items-center gap-2 bg-muted px-3 py-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-semibold text-foreground">Découvrez la sélection de votre marque</p>
            <p className="truncate text-[8px] text-muted-foreground">votremarque.com</p>
          </div>
          <span className="shrink-0 rounded-full px-3 py-1 text-[9px] font-semibold text-primary ring-1 ring-primary">{appelAction || "À générer"}</span>
        </div>
        <div className="flex items-center justify-between px-3 py-1.5 text-[8px] text-muted-foreground">
          <span className="flex items-center gap-1"><span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground"><ThumbsUp className="h-2 w-2" /></span>Vous et 15 autres</span>
          <span>2 commentaires · 3 republications</span>
        </div>
        <div className="grid grid-cols-4 bg-muted/50 py-1.5 text-[8px] text-muted-foreground">
          <span className="flex items-center justify-center gap-1"><ThumbsUp className="h-3 w-3" />J’aime</span>
          <span className="flex items-center justify-center gap-1"><MessageCircle className="h-3 w-3" />Commenter</span>
          <span className="flex items-center justify-center gap-1"><Repeat2 className="h-3 w-3" />Republier</span>
          <span className="flex items-center justify-center gap-1"><Send className="h-3 w-3" />Envoyer</span>
        </div>
      </div>
    );
  }

  if (plateforme === "x") {
    return (
      <div className="flex h-full flex-col bg-background">
        <div className="flex h-9 shrink-0 items-center gap-2 px-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[8px] text-background">X</span>
          <div className="min-w-0 leading-tight"><p className="truncate text-[9px] font-semibold text-foreground">Votre marque</p><p className="text-[7px] text-muted-foreground">Publication sponsorisée</p></div>
          <MoreHorizontal className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <p className="line-clamp-3 px-2.5 pb-2 text-[10px] leading-relaxed text-foreground">{legende || "Légende à générer"}</p>
        <div className="min-h-0 flex-1 overflow-hidden">{corps}</div>
        <div className="flex items-center gap-4 px-2.5 py-1.5 text-[8px] text-muted-foreground"><span>Réagir</span><span>Commenter</span><span>Partager</span></div>
      </div>
    );
  }

  if (plateforme === "instagram-feed") {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-background">
        <div className="flex h-9 shrink-0 items-center gap-2 px-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-[8px] text-background">L</span>
          <div className="min-w-0 leading-tight"><p className="truncate text-[9px] font-semibold text-foreground">Votre marque</p><p className="text-[7px] text-muted-foreground">Sponsorisé</p></div>
          <MoreHorizontal className="ml-auto h-3.5 w-3.5 text-foreground" />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">{corps}</div>
        <div className="flex h-9 shrink-0 items-center gap-3 px-2.5 text-foreground">
          <Heart className="h-4 w-4" />
          <MessageCircle className="h-4 w-4" />
          <Send className="h-4 w-4" />
          <Bookmark className="ml-auto h-4 w-4" />
        </div>
        {(legende || hashtags.length > 0) && <p className="line-clamp-2 px-2.5 pb-2 text-[8px] leading-tight text-foreground"><strong>votre_marque</strong> {legende} <span className="text-primary">{hashtags.join(" ")}</span></p>}
      </div>
    );
  }

  if (plateforme === "facebook") {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-background">
        <div className="flex h-9 shrink-0 items-center gap-2 px-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[8px] text-background">L</span>
          <div className="min-w-0 leading-tight"><p className="truncate text-[9px] font-semibold text-foreground">Votre marque</p><p className="text-[7px] text-muted-foreground">Sponsorisé · <Globe2 className="inline h-2 w-2" /></p></div>
          <MoreHorizontal className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className="min-h-0 flex-1 overflow-hidden">{corps}</div>
        {legende && <p className="line-clamp-2 px-2.5 py-1 text-[8px] leading-tight text-foreground">{legende}</p>}
        <div className="grid shrink-0 grid-cols-3 py-1.5 text-[8px] text-muted-foreground">
          <span className="flex items-center justify-center gap-1"><ThumbsUp className="h-3 w-3" />J’aime</span>
          <span className="flex items-center justify-center gap-1"><MessageCircle className="h-3 w-3" />Commenter</span>
          <span className="flex items-center justify-center gap-1"><Send className="h-3 w-3" />Partager</span>
        </div>
      </div>
    );
  }

  if (plateforme === "snapchat") {
    return (
      <div className="relative h-full overflow-hidden bg-transparent">
        {corps}
        <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 px-2 pt-2 text-background">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[6px] text-background">L</span>
          <p className="text-[8px] font-semibold">votre.marque</p>
          <MoreHorizontal className="ml-auto h-3.5 w-3.5" />
        </div>
        <div className="absolute inset-x-0 bottom-0 px-2 pb-3 text-center">
          {texteImage && <p className="mb-2 text-[11px] font-semibold text-background">{texteImage}</p>}
          <p className="text-[8px] font-medium text-background">{appelAction || "Appel à l’action à générer"}</p>
        </div>
      </div>
    );
  }

  if (plateforme === "pinterest") {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-transparent">
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg">
          {corps}
          <span className="absolute right-1.5 top-1.5 rounded-full bg-foreground px-2 py-0.5 text-[7px] font-semibold text-background">Enregistrer</span>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 px-0.5 pt-1.5">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-foreground text-[6px] text-background">L</span>
          <p className="truncate text-[8px] font-semibold text-foreground">{legende || "Titre à générer"}</p>
        </div>
      </div>
    );
  }

  if (plateforme === "instagram-story") {
    return (
      <div className="relative h-full overflow-hidden bg-transparent">
        {corps}
        <div className="absolute inset-x-0 top-0 px-2 pt-2 text-background">
          <div className="h-0.5 w-full rounded-full bg-background/80" />
          <div className="mt-2 flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[6px] text-background">L</span>
            <p className="text-[8px] font-semibold">votre.marque <span className="font-normal text-background/80">18 h</span></p>
            <Pause className="ml-auto h-3.5 w-3.5" />
            <Volume2 className="h-3.5 w-3.5" />
            <MoreHorizontal className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-2 pb-3 text-background">
          <span className="min-w-0 flex-1 rounded-full px-3 py-2 text-[8px] ring-1 ring-background/80">Répondre à votre marque…</span>
          <Heart className="h-4 w-4 shrink-0" />
          <Send className="h-4 w-4 shrink-0" />
        </div>
        {texteImage && <p className="absolute inset-x-3 bottom-14 text-center text-[11px] font-semibold text-background">{texteImage}</p>}
      </div>
    );
  }

  if (plateforme === "instagram-reel" || plateforme === "tiktok") {
    const ugc = plateforme === "tiktok";
    return (
      <div className="relative h-full overflow-hidden bg-background">
        {corps}
        {/* En-tête UGC : créatrice + tag UGC */}
        <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 px-2 pt-2">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[6px] font-normal text-background">L</span>
          <div className="min-w-0">
            <p className="truncate text-[8px] font-semibold leading-none text-background">@lucie.ugc</p>
            <p className="mt-0.5 text-[6px] leading-none text-background/80">{config.format}</p>
          </div>
        </div>
        {/* Rail d'actions à droite façon TikTok / Reel */}
        <div className="absolute bottom-6 right-1.5 flex flex-col items-center gap-1 text-background">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground/30 backdrop-blur-sm">
            <Heart className="h-2 w-2" fill="currentColor" />
          </span>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground/30 backdrop-blur-sm">
            <MessageCircle className="h-2 w-2" />
          </span>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground/30 backdrop-blur-sm">
            <Send className="h-2 w-2" />
          </span>
        </div>
        {/* Légende UGC + ticker son */}
        <div className="absolute inset-x-0 bottom-0 px-2 pb-2 pt-4 bg-gradient-to-t from-black/60 to-transparent text-background">
          <p className="line-clamp-2 text-[8px] font-medium leading-tight">{legende || "Légende à générer"}</p>
          {ugc && (
            <div className="mt-1 flex items-center gap-1">
              <Music2 className="h-2 w-2 shrink-0" />
              <p className="truncate text-[7px]">son original · @lucie.ugc</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden bg-background">
      {corps}
      <div className="absolute inset-x-0 top-0 flex items-center gap-3 px-2.5 py-3">
        <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-normal text-background">L</span>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold leading-none text-background">Votre marque</p>
          <p className="mt-1 text-[6px] leading-none text-background/80">{config.format}</p>
        </div>
      </div>
    </div>
  );
}
