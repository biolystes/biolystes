/* Barre de filtres de la page RP : même rendu que la barre du catalogue
   (bande gris clair, boutons blancs à chevron, panneau blanc de cases à cocher). */
import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ArrowDownUp, X } from "lucide-react";

const NOIR = "rgb(29,29,31)";
const BANDE = "#f3f4f5";
const CASE_GRISE = "#e9eaec";

export interface RubriqueRP { cle: string; titre: string; tous: string; options: { valeur: string; libelle: string; n: number }[]; choisies: string[] }

function Case({ coche }: { coche: boolean }) {
  return <span aria-hidden className="shrink-0 w-[22px] h-[22px] rounded-[7px] flex items-center justify-center" style={{ background: coche ? NOIR : CASE_GRISE }}>{coche && <Check className="w-3.5 h-3.5" strokeWidth={3} style={{ color: BANDE }} />}</span>;
}

function Bouton({ children, ouvert, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { ouvert?: boolean }) {
  return <button type="button" aria-expanded={ouvert} className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl text-[15px] font-medium text-foreground whitespace-nowrap hover:bg-black/5" style={{ background: "#ffffff", border: `1px solid ${ouvert ? NOIR : "rgba(29,29,31,0.08)"}`, boxShadow: ouvert ? `0 0 0 1px ${NOIR}` : undefined }} {...rest}>{children}</button>;
}

export default function BarreFiltresRP({ rubriques, onBascule, onTous, onVider, tri, tris, onTri }: {
  rubriques: RubriqueRP[]; onBascule: (cle: string, valeur: string) => void; onTous: (cle: string) => void; onVider: () => void;
  tri: string; tris: { valeur: string; libelle: string }[]; onTri: (t: string) => void;
}) {
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [gauche, setGauche] = useState(0);
  const racine = useRef<HTMLDivElement>(null);
  const actifs = rubriques.reduce((n, r) => n + r.choisies.length, 0);
  useEffect(() => {
    if (!ouvert) return;
    const dehors = (e: MouseEvent) => { if (racine.current && !racine.current.contains(e.target as Node)) setOuvert(null); };
    const echap = (e: KeyboardEvent) => { if (e.key === "Escape") setOuvert(null); };
    document.addEventListener("mousedown", dehors); document.addEventListener("keydown", echap);
    return () => { document.removeEventListener("mousedown", dehors); document.removeEventListener("keydown", echap); };
  }, [ouvert]);
  const ouvrir = (cle: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (ouvert === cle) return setOuvert(null);
    const bande = racine.current?.clientWidth ?? 0;
    setGauche(Math.max(0, Math.min(e.currentTarget.offsetLeft, bande - Math.min(520, bande))));
    setOuvert(cle);
  };
  const r = rubriques.find(x => x.cle === ouvert);
  const ligne = "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-left text-[15px] text-foreground hover:bg-black/5";
  return <div ref={racine} className="relative">
    <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl" style={{ background: BANDE }}>
      {rubriques.map(x => <Bouton key={x.cle} ouvert={ouvert === x.cle} onClick={e => ouvrir(x.cle, e)}>{x.titre}{x.choisies.length > 0 && <span className="text-xs text-muted-foreground">({x.choisies.length})</span>}<ChevronDown className="w-4 h-4" /></Bouton>)}
      <div className="ml-auto flex items-center gap-2">
        {actifs > 0 && <Bouton onClick={onVider}><X className="w-4 h-4" />Effacer</Bouton>}
        <Bouton ouvert={ouvert === "tri"} onClick={e => ouvrir("tri", e)}><ArrowDownUp className="w-4 h-4" />Trier par<ChevronDown className="w-4 h-4" /></Bouton>
      </div>
    </div>
    {ouvert && <div className="absolute top-full mt-2 z-30 rounded-2xl p-3 shadow-xl max-w-full" style={{ background: "#ffffff", left: ouvert === "tri" ? undefined : gauche, right: ouvert === "tri" ? 0 : undefined, width: ouvert === "tri" ? 260 : 520 }}>
      {ouvert === "tri" ? <ul role="radiogroup" aria-label="Trier par">{tris.map(t => <li key={t.valeur}><button type="button" role="radio" aria-checked={tri === t.valeur} onClick={() => { onTri(t.valeur); setOuvert(null); }} className={ligne}><Case coche={tri === t.valeur} />{t.libelle}</button></li>)}</ul>
        : r && <ul role="group" aria-label={r.titre} className="grid grid-cols-2 gap-x-2 gap-y-0.5">
          <li><button type="button" role="checkbox" aria-checked={r.choisies.length === 0} onClick={() => onTous(r.cle)} className={ligne}><Case coche={r.choisies.length === 0} />{r.tous}</button></li>
          {r.options.map(o => { const c = r.choisies.includes(o.valeur); return <li key={o.valeur}><button type="button" role="checkbox" aria-checked={c} onClick={() => onBascule(r.cle, o.valeur)} className={ligne}><Case coche={c} /><span className="flex-1">{o.libelle} <span className="text-xs text-muted-foreground">({o.n})</span></span></button></li>; })}
        </ul>}
    </div>}
  </div>;
}
