import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@lystes/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@lystes/components/ui/dialog";
import type { MembreAgenceSociale } from "@lystes/features/social/types-agence";
import { cn } from "@lystes/lib/utils";

function Portrait({ membre, taille = "h-8 w-8" }: { membre: MembreAgenceSociale; taille?: string }) {
  return membre.avatar ? (
    <img src={membre.avatar} alt={`Portrait illustratif de ${membre.nom}`} loading="lazy" className={cn(taille, "shrink-0 rounded-full object-cover")} />
  ) : (
    <span className={cn(taille, "flex shrink-0 items-center justify-center rounded-full bg-muted text-[8px] font-semibold text-muted-foreground")}>{membre.nom.slice(0, 2).toUpperCase()}</span>
  );
}

export function EquipeAgenceCompacte({ membres, onOuvrir }: { membres: MembreAgenceSociale[]; onOuvrir: () => void }) {
  return (
    <Button
      variant="ghost"
      className="mt-4 flex h-auto w-full flex-col items-stretch bg-muted p-3 text-left"
      onClick={onOuvrir}
      aria-label={`Voir l’équipe IA, ${membres.length} membres`}
    >
      <span className="flex items-center justify-between">
        <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Équipe IA</span>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
      </span>
      <span className="mt-2 flex -space-x-2" aria-hidden="true">
        {membres.slice(0, 8).map((membre) => <span key={membre.cle} className="rounded-full bg-background p-0.5"><Portrait membre={membre} taille="h-7 w-7" /></span>)}
        {membres.length > 8 && <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-[7px] font-semibold text-background">+{membres.length - 8}</span>}
      </span>
    </Button>
  );
}

export function OrganigrammeAgenceDialog({ ouvert, onOuvertChange, nomAgence, membres }: { ouvert: boolean; onOuvertChange: (ouvert: boolean) => void; nomAgence: string; membres: MembreAgenceSociale[] }) {
  const [selection, setSelection] = useState<MembreAgenceSociale | null>(null);
  const direction = membres.find((membre) => membre.pole === "Direction");
  const poles = ["Social Media", "UGC", "Production photo", "Connaissance client"] as const;
  return (
    <Dialog open={ouvert} onOpenChange={onOuvertChange}>
      <DialogContent className="max-h-[88vh] max-w-4xl overflow-y-auto bg-background">
        <DialogHeader><DialogTitle className="font-display text-2xl font-light">L’agence de {nomAgence}</DialogTitle></DialogHeader>
        <p className="text-[10px] text-muted-foreground">Une équipe IA organisée par métier. Les portraits servent d’identités visuelles et ne représentent pas des collaborateurs réels.</p>
        {direction && (
          <Button variant="ghost" onClick={() => setSelection(direction)} className="mx-auto mt-5 flex h-auto w-52 justify-start gap-3 bg-muted p-3 text-left">
            <Portrait membre={direction} taille="h-10 w-10" /><span><strong className="block text-[11px] text-foreground">{direction.nom}</strong><span className="text-[9px] text-muted-foreground">{direction.role}</span></span>
          </Button>
        )}
        <div className="mx-auto h-5 w-px bg-muted-foreground/30" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {poles.map((pole) => {
            const membresPole = membres.filter((membre) => membre.pole === pole);
            return (
              <section key={pole} className="bg-muted p-3">
                <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{pole}</p>
                <div className="mt-3 space-y-1.5">
                  {membresPole.map((membre) => (
                    <Button key={membre.cle} variant="ghost" onClick={() => setSelection(membre)} className="flex h-auto w-full justify-start gap-2 bg-background p-2 text-left">
                      <Portrait membre={membre} taille="h-7 w-7" /><span className="min-w-0"><strong className="block truncate text-[9px] text-foreground">{membre.nom}</strong><span className="block text-[8px] leading-tight text-muted-foreground">{membre.role}</span></span>
                    </Button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
        {selection && (
          <div className="mt-4 bg-muted p-4">
            <div className="flex items-center gap-3"><Portrait membre={selection} taille="h-10 w-10" /><div><p className="text-xs font-semibold text-foreground">{selection.nom}</p><p className="text-[9px] text-muted-foreground">{selection.role}</p></div></div>
            <p className="mt-3 text-[10px] leading-relaxed text-foreground">{selection.mission}</p>
            <p className="mt-2 text-[8px] uppercase tracking-[0.12em] text-muted-foreground">{selection.reseaux.join(" · ")}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}