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

/** Une carte : rond noir à icône (ou numéro), titre, texte, et en bas une note en gris. */
export function Carte({ icone, numero, titre, texte, note }: {
  icone?: LucideIcon;
  numero?: string;
  titre: string;
  texte: string;
  note?: string;
}) {
  return (
    <article className="bg-[#f4f4f6] rounded-2xl p-[1.5rem] md:p-[1.75rem] flex flex-col gap-4 text-left">
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
