import { Loader2, ScanFace, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@lystes/components/ui/button";
import {
  useLireLesVisages,
  usePrenomsClientele,
  useVisagesClientele,
  type Compteur,
} from "@lystes/features/social/useSignauxClientele";
import type { ContexteCreatif } from "@lystes/features/social/useContexteCreatif";

/**
 * CE QUE VOS DONNÉES DISENT DE VOS CLIENTES.
 *
 * 14/09/2026 (JP) : deux sources mesurées, jamais mélangées — les photos
 * d'essayage et de diagnostic d'un côté, les prénoms des commandes de
 * l'autre. Chaque chiffre porte son volume. La marque reste libre de
 * reprendre ces valeurs dans son réglage, ou de les ignorer.
 */

interface SignauxMesuresProps {
  compteId?: string | null;
  onReprendre: (valeurs: Partial<ContexteCreatif>) => void;
}

const CARNATION_LISIBLE: Record<string, string> = {
  claire: "Claire",
  medium: "Médium",
  mate: "Mate",
  foncee: "Foncée",
};

const ORIGINE_LISIBLE: Record<string, string> = {
  "afro-descendante": "Afro-descendantes",
  caucasienne: "Caucasiennes",
  metissee: "Métissées",
  hispanique: "Hispaniques",
  asiatique: "Asiatiques",
  "moyen-orientale": "Moyen-orientales",
};

function Barres({ titre, entrees, lisible }: { titre: string; entrees: Compteur[]; lisible?: Record<string, string> }) {
  if (!entrees.length) return null;
  const total = entrees.reduce((somme, e) => somme + e.n, 0) || 1;
  return (
    <div>
      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{titre}</p>
      <div className="mt-2 space-y-1.5">
        {entrees.map((entree) => (
          <div key={entree.libelle} className="flex items-center gap-2">
            <span className="w-28 shrink-0 truncate text-[10px] text-foreground">
              {lisible?.[entree.libelle] ?? entree.libelle}
            </span>
            <span className="h-1.5 flex-1 bg-foreground/10">
              <span className="block h-full bg-foreground/60" style={{ width: `${(entree.n / total) * 100}%` }} />
            </span>
            <span className="w-14 shrink-0 text-right text-[10px] tabular-nums text-muted-foreground">
              {Math.round((entree.n / total) * 100)} %
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SignauxMesures({ compteId, onReprendre }: SignauxMesuresProps) {
  const { data: visages, isLoading: visagesEnCours } = useVisagesClientele(compteId);
  const { data: prenoms, isLoading: prenomsEnCours } = usePrenomsClientele(compteId);
  const lecture = useLireLesVisages(compteId);

  const lancer = async () => {
    try {
      const resultat = await lecture.mutateAsync(24);
      toast.success(
        resultat.analysees
          ? `${resultat.analysees} photos lues, ${resultat.restantes} restantes.`
          : resultat.message ?? "Rien de nouveau à lire.",
      );
    } catch (erreur) {
      toast.error(erreur instanceof Error ? erreur.message : "La lecture des photos a échoué.");
    }
  };

  const reprendre = () => {
    const valeurs: Partial<ContexteCreatif> = {};
    const genre = visages?.genres[0]?.libelle ?? (prenoms?.partFemmes !== null && prenoms?.partFemmes !== undefined
      ? prenoms.partFemmes > 0.6 ? "femme" : prenoms.partFemmes < 0.4 ? "homme" : "mixte"
      : null);
    if (genre === "femme") valeurs.avatar_genre = "Femmes";
    else if (genre === "homme") valeurs.avatar_genre = "Hommes";
    else if (genre === "mixte") valeurs.avatar_genre = "Mixte";
    const age = visages?.ages[0]?.libelle;
    if (age) valeurs.avatar_age = age;
    const carnation = visages?.carnations[0]?.libelle;
    if (carnation && CARNATION_LISIBLE[carnation]) valeurs.avatar_carnation = CARNATION_LISIBLE[carnation];
    const origines = (visages?.origines ?? []).slice(0, 2).map((o) => ORIGINE_LISIBLE[o.libelle] ?? o.libelle);
    const cheveux = visages?.cheveux[0]?.libelle;
    const precisions = [
      origines.length ? `Clientèle majoritairement ${origines.join(" et ").toLowerCase()}` : null,
      cheveux ? `cheveux ${cheveux}` : null,
    ].filter(Boolean).join(", ");
    if (precisions) valeurs.avatar_description = `${precisions}.`;
    if (!Object.keys(valeurs).length) {
      toast.error("Aucune valeur mesurée à reprendre pour l’instant.");
      return;
    }
    onReprendre(valeurs);
    toast.success("Valeurs mesurées reprises dans le réglage.");
  };

  const enCours = visagesEnCours || prenomsEnCours;

  return (
    <div className="space-y-5 rounded-lg bg-muted p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Ce que vos données disent
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {visages?.retenus
              ? `${visages.retenus} photos d’essayage et de diagnostic lues`
              : "Aucune photo lue pour l’instant"}
            {prenoms?.total ? ` · ${prenoms.total} prénoms de commande` : ""}
          </p>
        </div>
        <div className="flex gap-1.5">
          <Button size="sm" variant="outline" onClick={() => void lancer()} disabled={lecture.isPending}>
            {lecture.isPending ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <ScanFace className="mr-1.5 h-3 w-3" />}
            Lire des photos
          </Button>
          <Button size="sm" variant="ghost" onClick={reprendre} disabled={enCours}>
            <Wand2 className="mr-1.5 h-3 w-3" /> Reprendre ces valeurs
          </Button>
        </div>
      </div>

      {enCours ? (
        <p className="text-[10px] text-muted-foreground">Lecture de vos photos et de vos commandes…</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-4">
            <Barres titre="Genre vu sur les photos" entrees={visages?.genres ?? []} />
            <Barres titre="Tranches d’âge" entrees={visages?.ages ?? []} />
            <Barres titre="Carnations" entrees={visages?.carnations ?? []} lisible={CARNATION_LISIBLE} />
          </div>
          <div className="space-y-4">
            <Barres titre="Origine apparente" entrees={visages?.origines ?? []} lisible={ORIGINE_LISIBLE} />
            <Barres titre="Type de cheveu" entrees={visages?.cheveux ?? []} />
            {prenoms && prenoms.partFemmes !== null ? (
              <Barres
                titre="Genre déduit des prénoms de commande"
                entrees={[
                  { libelle: "Femmes", n: prenoms.femmes },
                  { libelle: "Hommes", n: prenoms.hommes },
                ]}
              />
            ) : null}
            {prenoms?.indetermines ? (
              <p className="text-[9px] text-muted-foreground">
                {prenoms.indetermines} prénoms non reconnus, écartés du calcul plutôt que devinés.
              </p>
            ) : null}
          </div>
        </div>
      )}

      {!visages?.retenus && !visagesEnCours && (
        <p className="text-[10px] leading-relaxed text-muted-foreground">
          Vos essayages et diagnostics contiennent des photos de clientes. « Lire des photos » en analyse un lot et
          n’en garde que des pourcentages : aucun visage, aucun nom. Les photos de mineurs sont écartées.
        </p>
      )}
    </div>
  );
}
