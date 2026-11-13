/* Les pièces communes aux deux pages « Formules et ingrédients » et « Notre
   standard de beauté propre » (JP, 13/11/2026), dans le cadre des pages du pied
   de page (CadrePied). Une seule source pour que les deux pages gardent les
   mêmes bandes, les mêmes cartes et les mêmes espacements.

   Règles de JP tenues ici :
   - deux gris seulement : #f9f9fa pour le fond d'une bande, #f4f4f6 pour ce qui
     est posé dessus (JP, 13/11/2026) ; aucune bordure quand la couleur
     différencie déjà ;
   - rien n'est replié : cartes à plat ; sur téléphone, les grilles de huit cartes
     défilent latéralement (carrousel à accroche), les autres s'empilent ;
   - jamais un mot seul en fin de ligne : les textes passent par `t()` (deux
     derniers mots liés, espace insécable avant « : ; ? ! % »), les titres par
     `sansMotSeul` (src/lib/sans-mot-seul.ts) ; voir src/lib/typographie-fr.ts. */
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { RondIcone } from "./elements";
import { sansMotSeul } from "@/lib/sans-mot-seul";
import { t, typo } from "@/lib/typographie-fr";

/** Une bande pleine largeur : blanche, ou gris de fond #f9f9fa. */
export function Zone({ gris = false, id, children }: { gris?: boolean; id?: string; children: ReactNode }) {
  return (
    <section id={id} className={(gris ? "bg-[#f9f9fa]" : "bg-background") + " py-12 md:py-16 scroll-mt-24"}>
      <div className="max-w-5xl mx-auto px-[1.25rem] md:px-[1.5rem]">{children}</div>
    </section>
  );
}

type Colonnes = 2 | 3 | 4;

const GRILLE: Record<Colonnes, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 lg:grid-cols-4",
};

/** Grille de cartes. `rail` : sur téléphone, les cartes défilent latéralement
    (la suivante dépasse, pour montrer qu'il y en a d'autres) ; dès 768 px, grille. */
export function Cartes({ colonnes, rail = false, children }: { colonnes: Colonnes; rail?: boolean; children: ReactNode }) {
  if (!rail) return <div className={"grid gap-4 " + GRILLE[colonnes]}>{children}</div>;
  return (
    <div
      className={
        "flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-[1.25rem] px-[1.25rem] scroll-px-[1.25rem] " +
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden " +
        "[&>*]:shrink-0 [&>*]:basis-[82%] [&>*]:snap-start " +
        "md:mx-0 md:px-0 md:pb-0 md:overflow-visible md:grid md:gap-4 md:[&>*]:basis-auto " +
        GRILLE[colonnes]
      }
    >
      {children}
    </div>
  );
}

/** Une carte : rond noir à icône (ou numéro) ou image carrée, titre, texte, et en bas une note en gris. */
export function Carte({ icone, numero, image, alt = "", titre, texte, note }: {
  icone?: LucideIcon;
  image?: string;
  alt?: string;
  numero?: string;
  titre: string;
  texte: string;
  note?: string;
}) {
  return (
    <article className="bg-[#f4f4f6] rounded-2xl p-[1.5rem] md:p-[1.75rem] flex flex-col gap-4 text-left">
      {image && <img src={image} alt={alt} width={720} height={720} loading="lazy" decoding="async" className="w-full aspect-square object-cover rounded-xl" />}
      {icone && <RondIcone icone={icone} />}
      {numero && (
        <span className="text-[1.5rem] leading-none text-muted-foreground tabular-nums"
          style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif", fontWeight: 300 }}>
          {numero}
        </span>
      )}
      <div className="min-w-0">
        <h3 className="text-[1.0625rem] !font-semibold text-foreground leading-snug text-balance"
          style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif", textTransform: "none", letterSpacing: "-0.01em" }}>
          {sansMotSeul(typo(titre))}
        </h3>
        <p className="mt-2 text-[0.9375rem] text-foreground/80 leading-[1.7] text-pretty">{t(texte)}</p>
      </div>
      {note && <p className="mt-auto pt-1 text-[0.8125rem] leading-snug text-muted-foreground">{t(note)}</p>}
    </article>
  );
}

/** Un chiffre en grand, avec sa phrase. */
export function Chiffre({ valeur, texte }: { valeur: string; texte: string }) {
  return (
    <article className="bg-[#f4f4f6] rounded-2xl p-[1.5rem] md:p-[2rem] text-center">
      <p className="text-[2.5rem] md:text-[3rem] leading-none text-foreground whitespace-nowrap"
        style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif", fontWeight: 300, letterSpacing: "-0.02em" }}>
        {valeur}
      </p>
      <p className="mt-3 text-[0.9375rem] text-foreground/80 leading-[1.7] text-pretty max-w-[18rem] mx-auto">{t(texte)}</p>
    </article>
  );
}

/** Le haut de page : une bannière image pleine largeur, le titre posé à gauche (même place que sur la page modèle). */
export function Banniere({ image, alt = "", surtitre, noir, gris, texte }: {
  image: string; alt?: string; surtitre: string; noir: string; gris: string; texte: string;
}) {
  return (
    <section className="bg-background pt-6 md:pt-8 px-[1.25rem] md:px-[1.5rem]">
      <div className="relative max-w-6xl mx-auto rounded-3xl overflow-hidden min-h-[26rem] md:min-h-[30rem] flex items-center">
        <img src={image} alt={alt} width={1920} height={749} fetchPriority="high" decoding="async" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative px-[1.5rem] md:px-[3.5rem] py-12 max-w-[34rem] text-left space-y-4">
          <p className="text-xs tracking-[0.3em] uppercase text-foreground">{surtitre}</p>
          <h1 className="text-[1.75rem] md:text-[2.25rem] !font-light tracking-tight text-foreground leading-[1.2]"
            style={{ textWrap: "pretty", fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif" }}>
            {noir} <span className="text-foreground/70 md:block">{gris}</span>
          </h1>
          <p className="text-base text-foreground leading-relaxed text-pretty">{t(texte)}</p>
        </div>
      </div>
    </section>
  );
}

/** Un bloc image et texte, côte à côte, l'image à gauche ou à droite (sur téléphone : image puis texte). */
export function BlocImage({ image, alt, titre, texte, inverse = false }: {
  image: string; alt: string; titre: string; texte: string; inverse?: boolean;
}) {
  return (
    <article className="grid gap-6 md:gap-12 md:grid-cols-2 items-center">
      <img src={image} alt={alt} width={1264} height={800} loading="lazy" decoding="async"
        className={"w-full h-auto rounded-3xl " + (inverse ? "md:order-2" : "")} />
      <div className={"text-left " + (inverse ? "md:order-1" : "")}>
        <h3 className="text-[1.375rem] md:text-[1.625rem] !font-light text-foreground leading-snug text-balance"
          style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif", textTransform: "none", letterSpacing: "-0.01em" }}>
          {sansMotSeul(typo(titre))}
        </h3>
        <p className="mt-3 text-base text-foreground/80 leading-[1.75] text-pretty">{t(texte)}</p>
      </div>
    </article>
  );
}
