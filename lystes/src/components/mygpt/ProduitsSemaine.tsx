import { Check, PackagePlus, Sparkles, X } from "lucide-react";
import { Button } from "@lystes/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@lystes/components/ui/popover";
import { useAccount } from "@lystes/contexts/AccountContext";
import { useProduitsPertinents } from "@lystes/features/social/useProduitsPertinents";
import type { ProduitAgenceSociale, ProduitSemaine } from "@lystes/features/social/types-agence";

export function ProduitsSemaine({ produits, catalogue, onBasculer }: { produits: ProduitSemaine[]; catalogue: ProduitAgenceSociale[]; onBasculer: (produit: ProduitAgenceSociale) => void }) {
  const selectionnes = new Set(produits.map((produit) => produit.id));
  const { selectedAccountId } = useAccount();
  /* Les produits que les données désignent déjà : essayages, questions
     clientes, ventes. Une boutique sans signal n'affiche pas la rubrique. */
  const { data: pertinents = [] } = useProduitsPertinents(selectedAccountId);
  return (
    <div className="mt-3 flex min-w-0 items-center gap-2 overflow-x-auto bg-background p-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="mr-1 shrink-0"><p className="text-[7px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Produits de la semaine</p><p className="text-[9px] text-foreground">{produits.length ? `${produits.length} sélectionné${produits.length > 1 ? "s" : ""}` : "Choix libre à l’agent"}</p></div>
      {produits.map((produit) => (
        <div key={produit.id} className="flex h-10 min-w-32 shrink-0 items-center gap-2 bg-muted px-2">
          <img src={produit.reference_url} alt={`Référence de ${produit.name}`} className="h-7 w-7 object-cover" />
          <span className="max-w-24 truncate text-[9px] font-medium text-foreground">{produit.name}</span>
          <Button variant="ghost" size="icon" className="ml-auto h-5 w-5" onClick={() => onBasculer(produit)} aria-label={`Retirer ${produit.name}`}><X className="h-2.5 w-2.5" /></Button>
        </div>
      ))}
      <Popover>
        <PopoverTrigger asChild><Button variant="ghost" size="sm" className="h-10 shrink-0 bg-muted px-3 text-[9px]" disabled={!catalogue.length}><PackagePlus className="mr-1.5 h-3 w-3" />{produits.length ? "Modifier" : "Choisir des produits"}</Button></PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-2">
          {pertinents.length > 0 && (
            <div className="mb-2 bg-muted/50 p-2">
              <div className="flex items-center justify-between gap-2">
                <p className="flex items-center gap-1 text-[7px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  <Sparkles className="h-2.5 w-2.5" /> Jugés pertinents
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-[9px]"
                  onClick={() => pertinents.slice(0, 3).filter((p) => !selectionnes.has(p.id)).forEach((p) => onBasculer(p))}
                >
                  Prendre les 3 premiers
                </Button>
              </div>
              <div className="mt-1 max-h-56 space-y-1 overflow-y-auto">
                {pertinents.map((produit) => {
                  const actif = selectionnes.has(produit.id);
                  return (
                    <Button key={produit.id} variant="ghost" className="h-auto w-full justify-start gap-2 px-2 py-1.5" onClick={() => onBasculer(produit)}>
                      {produit.image_url ? <img src={produit.image_url} alt="" className="h-8 w-8 shrink-0 object-cover" /> : <span className="h-8 w-8 shrink-0 bg-muted" />}
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block truncate text-[10px] text-foreground">{produit.name}</span>
                        <span className="block truncate text-[8px] font-normal text-muted-foreground">{produit.raisons.join(" · ")}</span>
                      </span>
                      {actif && <Check className="h-3 w-3 shrink-0" />}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
          <p className="px-2 py-1 text-[9px] text-muted-foreground">Catalogue réel · autant de produits que vous voulez. Sans sélection, l’agent choisit selon vos ventes et vos questions clientes.</p>
          <div className="mt-1 max-h-72 space-y-1 overflow-y-auto">
            {catalogue.map((produit) => {
              const actif = selectionnes.has(produit.id);
              return (
                <Button key={produit.id} variant="ghost" className="h-12 w-full justify-start px-2" disabled={!produit.image_url} onClick={() => onBasculer(produit)}>
                  {produit.image_url ? <img src={produit.image_url} alt="" className="h-8 w-8 object-cover" /> : <span className="h-8 w-8 bg-muted" />}
                  <span className="min-w-0 flex-1 truncate text-left text-[10px]">{produit.name}</span>
                  {actif && <Check className="h-3 w-3" />}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
