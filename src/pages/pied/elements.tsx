/* Les pièces communes des pages du pied de page, reprises de l’accueil
   (lystes/src/pages/BioPage.tsx) : en-tête de section (EnteteSection),
   bandes blanches et grises, rond noir des icônes, boutons noirs. Une seule
   source pour que les cinq pages gardent les mêmes tailles et les mêmes
   espacements. Rien ne se replie : tout le texte est à plat.

   Tailles en rem (text-[0.9375rem] = 15 px…) : sous 850 px, lystes/src/index.css
   réduit de force .text-2xl à 16 px, .text-[15px] à 12 px, .text-[17px] à
   14 px. Sur des pages de lecture, le texte doit rester lisible au téléphone. */
import type { ReactNode } from "react";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";

export const CTA_URL = "https://biolystes.pro/rdv";
export const CATALOGUE_URL = "https://www.biolystes.com/catalogue";

/* L’en-tête de section de l’accueil (lystes/src/components/bio/EnteteSection.tsx) :
   sur-titre espacé, titre léger dont la fin passe en gris, description noire.
   `niveau` 1 pour le haut de page. `aLaLigne` : la partie grise sur sa propre
   ligne dès 768 px, comme sur l’accueil. */
export function Entete({ surtitre, noir, gris, texte, niveau = 2, aLaLigne = true, className = "" }: {
  surtitre: string;
  noir: string;
  gris: string;
  texte?: ReactNode;
  niveau?: 1 | 2;
  aLaLigne?: boolean;
  className?: string;
}) {
  const Titre = niveau === 1 ? "h1" : "h2";
  return (
    <div className={"space-y-4 text-center " + className}>
      <p className="text-xs tracking-[0.3em] uppercase text-foreground">{surtitre}</p>
      <Titre className="text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] !font-light tracking-tight mx-auto text-foreground leading-[1.25] md:leading-[1.2] lg:leading-[1.1]"
        style={{ maxWidth: "min(100%, 18em)", textWrap: "pretty", fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif" }}>
        {noir} <span className={"text-muted-foreground" + (aLaLigne ? " md:block" : "")}>{gris}</span>
      </Titre>
      {texte && <p className="text-base text-foreground max-w-xl mx-auto leading-relaxed text-pretty">{texte}</p>}
    </div>
  );
}

/* Une bande pleine largeur, blanche ou grise (#f5f5f7 du thème), avec les
   marges verticales de l’accueil. */
export function Bande({ gris = false, id, className = "", children }: { gris?: boolean; id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={(gris ? "bg-secondary " : "bg-background ") + "py-12 md:py-16 scroll-mt-24 " + className}>
      {children}
    </section>
  );
}

/* Le rond noir des icônes Lucide au trait (cartes « Le constat » de l’accueil). */
export function RondIcone({ icone: Icone, petit = false }: { icone: LucideIcon; petit?: boolean }) {
  return (
    <div className={(petit ? "w-8 h-8" : "w-10 h-10") + " shrink-0 rounded-full bg-foreground text-background flex items-center justify-center"}>
      <Icone className={petit ? "h-4 w-4" : "h-5 w-5"} strokeWidth={1.5} />
    </div>
  );
}

/* Titre de carte : Bricolage, demi-gras, 17 px, à côté du rond noir. */
export function TitreCarte({ icone, children, sousTitre }: { icone?: LucideIcon; children: ReactNode; sousTitre?: string }) {
  return (
    <div className="flex items-center gap-3">
      {icone && <RondIcone icone={icone} />}
      <div className="min-w-0">
        {sousTitre && <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground mb-1">{sousTitre}</p>}
        <h3 className="text-[1.0625rem] !font-semibold text-foreground leading-snug text-pretty"
          style={{ fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif", textTransform: "none", letterSpacing: "-0.01em" }}>
          {children}
        </h3>
      </div>
    </div>
  );
}

/* Paragraphe de lecture : 16 px, interligne confortable, coupure soignée. */
export function Texte({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={"text-[0.9375rem] md:text-base text-foreground/80 leading-[1.75] text-pretty " + className}>{children}</p>;
}

/* Liste à plat, coche noire au trait. */
export function ListeCoches({ elements }: { elements: ReactNode[] }) {
  return (
    <ul className="space-y-3">
      {elements.map((el, i) => (
        <li key={i} className="flex items-start gap-3 text-[0.9375rem] md:text-base text-foreground/80 leading-[1.75]">
          <Check className="h-4 w-4 mt-[0.4em] shrink-0 text-foreground" strokeWidth={2} />
          <span className="text-pretty">{el}</span>
        </li>
      ))}
    </ul>
  );
}

function Fleche() {
  return (
    <span className="arrow-circle">
      <ArrowRight className="w-3.5 h-3.5" />
    </span>
  );
}

/* Les deux boutons du bas de l’accueil : catalogue (plein) et rendez-vous
   (contour). */
export function BoutonsAction({ className = "" }: { className?: string }) {
  return (
    <div className={"flex flex-wrap justify-center gap-4 " + className}>
      <a href={CATALOGUE_URL} className="btn-startup">
        <span>Découvrez notre catalogue</span>
        <Fleche />
      </a>
      <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="btn-outline">
        <span>Prendre rendez-vous</span>
        <Fleche />
      </a>
    </div>
  );
}

export function BoutonRdv({ className = "" }: { className?: string }) {
  return (
    <div className={"flex justify-center " + className}>
      <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className="btn-startup">
        <span>Prendre rendez-vous</span>
        <Fleche />
      </a>
    </div>
  );
}
