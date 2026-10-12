import { ReactNode } from "react";

/**
 * Les pièces communes des trois écrans « Faire tourner vos réseaux ».
 *
 * Elles ne réinterprètent pas la charte, elles la recopient : les valeurs
 * viennent de `CHARTE.md`, elle-même relevée dans le sélecteur d'espace. Le
 * défaut nommé « à la manière de » (point 8 de la charte) vient justement de
 * réécritures qui gardent la silhouette et perdent les mesures.
 *
 * Rappel des valeurs portées ici :
 *   panneau  blanc, r14, p5, SANS bordure
 *   ligne    p 12/9, r9 — le rayon de la ligne et celui de la pastille
 *   pastille 36 × 32, r9, fond #f3f4f5 au repos, blanc sur la ligne élue
 *   élu      #e1f3c5, UNE SEULE ligne par écran
 *   titre    12,5 px · 600 · −0,006em
 *   sous-titre 11 px, interligne 1,5, gris #777b7f, jamais noir
 *   étiquette 8,5 px · 600 · +0,07em · r5
 *   trait    #f1f1f1 à 75 %
 */

export const VERT_ELU = "#e1f3c5";
export const PIERRE = "#f3f4f5";
export const GRIS = "#777b7f";
export const ENCRE = "#231e1f";
export const TRAIT = "rgba(241,241,241,0.75)";

export function Panneau({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[14px] bg-white p-[5px] ${className}`}>{children}</div>;
}

export function TitreBloc({ titre, note, actions }: { titre: string; note?: string; actions?: ReactNode }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-4">
      <p className="text-[12.5px] font-semibold tracking-[-0.006em] text-black">{titre}</p>
      {note && <span className="text-[11px] leading-[1.5]" style={{ color: GRIS }}>{note}</span>}
      {actions}
    </div>
  );
}

export function Pastille({ children, elu = false }: { children: ReactNode; elu?: boolean }) {
  return (
    <span
      className="flex h-8 w-9 shrink-0 items-center justify-center rounded-[9px]"
      style={{ background: elu ? "#ffffff" : PIERRE, color: elu ? "#000000" : GRIS }}
    >
      {children}
    </span>
  );
}

export function Etiquette({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-[5px] px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.07em]"
      style={{ background: PIERRE, color: GRIS }}
    >
      {children}
    </span>
  );
}

/**
 * Le module de base de la charte : une pastille, deux lignes de texte, une
 * étiquette facultative, et de quoi agir à droite.
 */
export function Ligne({
  icone,
  titre,
  sousTitre,
  etiquette,
  droite,
  actions,
  elu = false,
}: {
  icone?: ReactNode;
  titre: string;
  sousTitre?: string;
  etiquette?: string;
  droite?: ReactNode;
  actions?: ReactNode;
  elu?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 rounded-[9px] px-3 py-[9px]"
      style={{ background: elu ? VERT_ELU : "transparent" }}
    >
      {icone !== undefined && <Pastille elu={elu}>{icone}</Pastille>}
      <div className="min-w-0 flex-1">
        <p
          className="flex items-center gap-2 truncate text-[12.5px] font-semibold tracking-[-0.006em]"
          style={{ color: elu ? "#000000" : ENCRE }}
        >
          <span className="truncate">{titre}</span>
          {etiquette && <Etiquette>{etiquette}</Etiquette>}
        </p>
        {sousTitre && (
          <p className="truncate text-[11px] leading-[1.5]" style={{ color: GRIS }}>
            {sousTitre}
          </p>
        )}
      </div>
      {droite && (
        <span className="shrink-0 text-[11px] leading-[1.5]" style={{ color: GRIS }}>
          {droite}
        </span>
      )}
      {actions && <span className="flex shrink-0 items-center gap-1">{actions}</span>}
    </div>
  );
}

/** Le seul séparateur autorisé. */
export function Trait() {
  return <div className="mx-3 h-px" style={{ background: TRAIT }} />;
}

/**
 * Un message plein-panneau. Il ne dit jamais « 0 » quand la vraie phrase est
 * « je n'ai pas pu regarder » (point 10 de la charte).
 */
export function Message({ children }: { children: ReactNode }) {
  return (
    <Panneau>
      <p className="px-3 py-8 text-center text-[11px] leading-[1.5]" style={{ color: GRIS }}>
        {children}
      </p>
    </Panneau>
  );
}
