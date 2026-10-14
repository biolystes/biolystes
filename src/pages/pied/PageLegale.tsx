/* Gabarit des pages légales (mentions légales, confidentialité, CGV), dans
   le style de l’accueil (JP, 14/10/2026). Seule la mise en page change : le
   texte juridique de chaque page reste celui d’avant, mot pour mot.

   En haut, l’en-tête de section de l’accueil ; puis un sommaire à plat (pas
   de menu repliable) ; puis les articles sur une colonne de lecture de
   720 px, 16 px, interligne 1,75. Titres d’article à 20 px sous 400 px de
   large : « responsabilités réglementaires » tient alors dans la colonne de
   320 px sans toucher le bord (JP, 14/10/2026 : 16 px de marge partout). */
import type { ReactNode } from "react";
import { Entete } from "./elements";

export type ArticleLegal = {
  id: string;
  /* « Article 1 » au-dessus du titre, pour les CGV. */
  numero?: string;
  titre: string;
  contenu: ReactNode;
};

export default function PageLegale({ noir, gris, miseAJour, articles }: {
  noir: string;
  gris: string;
  miseAJour: string;
  articles: ArticleLegal[];
}) {
  return (
    <>
      <section className="bg-background pt-12 md:pt-20 pb-10 md:pb-12 px-6">
        <Entete niveau={1} surtitre="Informations légales" noir={noir} gris={gris} texte={miseAJour} />
      </section>

      <section className="bg-background pb-16 md:pb-24 px-6">
        <div className="max-w-[720px] mx-auto">
          <nav aria-label="Sommaire" className="bg-secondary rounded-2xl p-6 md:p-8">
            <p className="text-xs tracking-[0.3em] uppercase text-foreground mb-4">Sommaire</p>
            <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {articles.map((a, i) => (
                <li key={a.id} className="flex items-baseline gap-3 text-[0.9375rem] leading-snug">
                  <span className="w-5 shrink-0 text-muted-foreground tabular-nums">{i + 1}.</span>
                  <a href={`#${a.id}`} className="text-foreground hover:text-muted-foreground transition-colors text-pretty">{a.titre}</a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-12 md:mt-16 space-y-12 md:space-y-14">
            {articles.map((a) => (
              <article key={a.id} id={a.id} className="scroll-mt-28">
                {a.numero && <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">{a.numero}</p>}
                <h2 className="text-[1.25rem] min-[400px]:text-[1.375rem] md:text-[1.625rem] !font-normal tracking-tight text-foreground leading-snug text-pretty"
                  style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif" }}>
                  {a.titre}
                </h2>
                <div className="mt-4 space-y-4 text-base text-foreground/80 leading-[1.75] text-pretty">
                  {a.contenu}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* Liste d’un texte légal : les « – » d’origine deviennent des puces. */
export function ListeLegale({ elements }: { elements: ReactNode[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {elements.map((el, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-[0.7em] w-1.5 h-1.5 rounded-full bg-foreground shrink-0" aria-hidden="true" />
          <span className="text-pretty">{el}</span>
        </li>
      ))}
    </ul>
  );
}

/* Couple libellé / valeur (fiche de l’éditeur). */
export function FicheLegale({ lignes }: { lignes: [string, ReactNode][] }) {
  return (
    <dl className="rounded-2xl border border-border divide-y divide-border">
      {lignes.map(([libelle, valeur]) => (
        <div key={libelle} className="grid sm:grid-cols-[270px_1fr] gap-x-6 gap-y-0.5 px-5 py-3.5">
          <dt className="text-[0.8125rem] tracking-[0.04em] text-muted-foreground sm:text-[0.9375rem] sm:tracking-normal">{libelle}</dt>
          <dd className="text-foreground text-[0.9375rem] md:text-base text-pretty">{valeur}</dd>
        </div>
      ))}
    </dl>
  );
}
