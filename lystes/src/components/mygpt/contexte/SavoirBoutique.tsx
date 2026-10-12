import { Link } from "@lystes/lib/lien-lystes";
import { ExternalLink } from "lucide-react";
import { Button } from "@lystes/components/ui/button";
import { useCerveauBoutique } from "@lystes/hooks/useCerveauBoutique";

/**
 * LE CERVEAU, LU DEPUIS LA FENÊTRE CONTEXTE.
 *
 * 14/09/2026 (JP) : « récupère le cerveau, la page, pour rajouter au pop-up
 * contexte ». On ne recopie aucun calcul : `useCerveauBoutique` est la seule
 * source, déjà mise en cache pour la page dédiée.
 */

const LIBELLES: Record<string, string> = {
  produits: "Fiches produit",
  agents: "Agents",
  experts: "Experts produit",
  avisReels: "Avis authentifiés",
  essayages: "Essayages",
  diagnostics: "Diagnostics",
  commandes: "Commandes",
  clientes: "Clientes",
  avatars: "Portraits clientes",
  sujets: "Sujets abordés",
  conversations: "Conversations",
  visites: "Visites mesurées",
  contenu: "Contenus produits",
};

export function SavoirBoutique({ compteId }: { compteId?: string | null }) {
  const cerveau = useCerveauBoutique(compteId ?? null);

  if (cerveau.chargement) {
    return <p className="py-10 text-[11px] text-muted-foreground">Lecture de ce que votre boutique sait…</p>;
  }

  const comptes = Object.entries(LIBELLES)
    .map(([cle, libelle]) => ({ libelle, n: cerveau.comptes[cle] ?? 0 }))
    .filter((ligne) => ligne.n > 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {comptes.map((ligne) => (
          <div key={ligne.libelle} className="rounded-lg bg-muted p-3">
            <p className="font-display text-lg font-medium leading-none text-foreground tabular-nums">{ligne.n}</p>
            <p className="mt-1 text-[9px] text-muted-foreground">{ligne.libelle}</p>
          </div>
        ))}
      </div>

      {cerveau.sujets.length > 0 && (
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Ce dont vos clientes parlent
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {cerveau.sujets.slice(0, 14).map((sujet) => (
              <span key={sujet.id} className="rounded-full bg-muted px-2.5 py-1 text-[10px] text-foreground">
                {sujet.sujet} · {sujet.mentions}
              </span>
            ))}
          </div>
        </div>
      )}

      {cerveau.connexions.length > 0 && (
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Sources connectées
          </p>
          <div className="mt-2 space-y-1">
            {cerveau.connexions.map((connexion) => (
              <p key={`${connexion.plateforme}-${connexion.boutique}`} className="text-[10px] text-muted-foreground">
                {connexion.plateforme}
                {connexion.boutique ? ` · ${connexion.boutique}` : ""} — {connexion.statut ?? "état inconnu"}
                {connexion.produitsSynchronises ? ` · ${connexion.produitsSynchronises} produits` : ""}
              </p>
            ))}
          </div>
        </div>
      )}

      {cerveau.sourcesMuettes.length > 0 && (
        <p className="text-[9px] leading-relaxed text-muted-foreground">
          Sources qui n’ont pas répondu : {cerveau.sourcesMuettes.slice(0, 4).join(" ; ")}.
        </p>
      )}

      <Button asChild size="sm" variant="ghost" className="text-[11px]">
        <Link to="/dashboard/cerveau">
          Ouvrir la page Le cerveau <ExternalLink className="ml-1.5 h-3 w-3" />
        </Link>
      </Button>
    </div>
  );
}
