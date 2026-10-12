import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@lystes/components/ui/button";
import { Input } from "@lystes/components/ui/input";
import { Textarea } from "@lystes/components/ui/textarea";
import { supabase } from "@lystes/integrations/supabase/client";
import { useUGCAvatars } from "@lystes/features/creative-ugc-images/hooks/useUGCAvatars";
import {
  CARNATIONS,
  GENRES,
  TRANCHES_AGE,
  TYPES_DE_LIEU,
  type ContexteCreatif,
} from "@lystes/features/social/useContexteCreatif";
import { SignauxMesures } from "@lystes/components/mygpt/contexte/SignauxMesures";
import { cn } from "@lystes/lib/utils";

/**
 * CE QUE LA MARQUE AJUSTE ELLE-MÊME.
 *
 * 14/09/2026 (JP) : le calcul donne une tendance, la marque tranche. Genre,
 * âge, carnation, style, lieu — et le mannequin retenu pour les visuels. Si
 * aucun modèle de la bibliothèque ne convient, elle en fait générer un.
 */

interface ReglageAvatarClientProps {
  compteId?: string | null;
  contexte: ContexteCreatif;
  onChanger: (valeurs: Partial<ContexteCreatif>) => void;
  enregistrement?: boolean;
}

function Puces({
  titre,
  options,
  valeur,
  onChoisir,
}: {
  titre: string;
  options: string[];
  valeur: string;
  onChoisir: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{titre}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChoisir(valeur === option ? "" : option)}
            className={cn(
              "rounded-full px-3 py-1 text-[10px] transition-colors",
              valeur === option ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

const GENRE_TECHNIQUE: Record<string, "female" | "male"> = { Femmes: "female", Hommes: "male", Mixte: "female" };
const AGE_TECHNIQUE: Record<string, "18-25" | "25-35" | "35-45" | "45+"> = {
  "18-25 ans": "18-25",
  "25-35 ans": "25-35",
  "35-45 ans": "35-45",
  "45-60 ans": "45+",
  "60 ans et plus": "45+",
};
const CARNATION_TECHNIQUE: Record<string, "light" | "medium" | "tan" | "dark"> = {
  Claire: "light",
  Médium: "medium",
  Mate: "tan",
  Foncée: "dark",
  Variée: "medium",
};

export function ReglageAvatarClient({ compteId, contexte, onChanger, enregistrement }: ReglageAvatarClientProps) {
  const { data: modeles = [], isLoading } = useUGCAvatars(compteId ?? null);
  const client = useQueryClient();
  const [generation, setGeneration] = useState(false);

  /* Deux intentions derrière un seul écran : « donne-moi un modèle » reprend la
     bibliothèque sans rien coûter, « un autre visage » paie une vraie
     génération. Sans cette distinction, la marchande qui n'aime pas le portrait
     recliquait indéfiniment sur le même. */
  const genererModele = async (forcerNouveau = false) => {
    if (!compteId) return;
    if (!contexte.avatar_genre || !contexte.avatar_age || !contexte.avatar_carnation) {
      toast.error("Choisissez d’abord le genre, la tranche d’âge et la carnation.");
      return;
    }
    setGeneration(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-ugc-avatar", {
        body: {
          name: contexte.avatar_style ? `Modèle ${contexte.avatar_style}` : "Modèle sur mesure",
          description: [contexte.avatar_description, contexte.lieu_type && `Photographié dans un contexte : ${contexte.lieu_type}`]
            .filter(Boolean)
            .join(". "),
          gender: GENRE_TECHNIQUE[contexte.avatar_genre] ?? "female",
          ageRange: AGE_TECHNIQUE[contexte.avatar_age] ?? "25-35",
          skinTone: CARNATION_TECHNIQUE[contexte.avatar_carnation] ?? "medium",
          category: "lifestyle",
          accountId: compteId,
          regenerer: forcerNouveau,
        },
      });
      if (error) throw error;
      if ((data as { error?: string })?.error) throw new Error((data as { error?: string }).error);
      await client.invalidateQueries({ queryKey: ["ugc-avatars", compteId] });
      /* Un modèle repris n'a pas été « ajouté » : il était déjà là, et il n'a
         rien coûté. Annoncer un ajout qui n'a pas eu lieu ferait chercher une
         nouveauté qui n'existe pas dans la bibliothèque. */
      toast.success(
        (data as { repris?: boolean })?.repris
          ? "Modèle repris de votre bibliothèque, sans nouveau crédit."
          : "Modèle généré et ajouté à votre bibliothèque."
      );
    } catch (erreur) {
      toast.error(erreur instanceof Error ? erreur.message : "La génération du modèle a échoué.");
    } finally {
      setGeneration(false);
    }
  };

  return (
    <div className="space-y-6">
      <SignauxMesures compteId={compteId} onReprendre={onChanger} />

      <div className="space-y-4 rounded-lg bg-muted p-4">
        <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Avatar client — ajusté par vous
        </p>
        <Puces titre="Genre dominant" options={GENRES} valeur={contexte.avatar_genre} onChoisir={(v) => onChanger({ avatar_genre: v })} />
        <Puces titre="Tranche d’âge" options={TRANCHES_AGE} valeur={contexte.avatar_age} onChoisir={(v) => onChanger({ avatar_age: v })} />
        <Puces titre="Carnation" options={CARNATIONS} valeur={contexte.avatar_carnation} onChoisir={(v) => onChanger({ avatar_carnation: v })} />
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Style</p>
          <Input
            className="mt-2 h-8 text-[11px]"
            placeholder="Lifestyle, chic, sportif, naturel…"
            value={contexte.avatar_style}
            onChange={(e) => onChanger({ avatar_style: e.target.value })}
          />
        </div>
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Précisions sur vos clientes
          </p>
          <Textarea
            className="mt-2 min-h-[70px] text-[11px]"
            placeholder="Ex. : clientes afro-caribéennes, cheveux crépus, urbaines, achètent pour un événement."
            value={contexte.avatar_description}
            onChange={(e) => onChanger({ avatar_description: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-4 rounded-lg bg-muted p-4">
        <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Lieu et décor pris en compte sur les photos
        </p>
        <Puces titre="Type de lieu" options={TYPES_DE_LIEU} valeur={contexte.lieu_type} onChoisir={(v) => onChanger({ lieu_type: v })} />
        <div className="grid gap-2 sm:grid-cols-2">
          <Input
            className="h-8 text-[11px]"
            placeholder="Nom du lieu"
            value={contexte.lieu_nom}
            onChange={(e) => onChanger({ lieu_nom: e.target.value })}
          />
          <Input
            className="h-8 text-[11px]"
            placeholder="Ville"
            value={contexte.lieu_ville}
            onChange={(e) => onChanger({ lieu_ville: e.target.value })}
          />
        </div>
        <Textarea
          className="min-h-[60px] text-[11px]"
          placeholder="Ambiance : murs blancs, plantes, lumière naturelle, fauteuils de salon…"
          value={contexte.lieu_ambiance}
          onChange={(e) => onChanger({ lieu_ambiance: e.target.value })}
        />
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Modèle retenu pour les visuels
          </p>
          <div className="flex items-center gap-2">
            {/* `() => genererModele(false)` et non `genererModele` : passé
                directement, React donne l'événement de clic en premier
                argument, un objet toujours vrai, et chaque clic paierait. */}
            <Button size="sm" variant="outline" onClick={() => genererModele(false)} disabled={generation || enregistrement}>
              {generation ? <Loader2 className="mr-1.5 h-3 w-3 animate-spin" /> : <Sparkles className="mr-1.5 h-3 w-3" />}
              Générer un modèle
            </Button>
            {/* La sortie de secours : la reprise est l'ordinaire, jamais une
                impasse. Celui-ci consomme un crédit, et le dit. */}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => genererModele(true)}
              disabled={generation || enregistrement}
              title="Consomme un crédit"
            >
              Un autre visage
            </Button>
          </div>
        </div>
        {isLoading ? (
          <p className="mt-3 text-[10px] text-muted-foreground">Lecture de votre bibliothèque…</p>
        ) : modeles.length ? (
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
            {modeles.map((modele) => (
              <button
                key={modele.id}
                type="button"
                onClick={() => onChanger({ modele_ugc_id: contexte.modele_ugc_id === modele.id ? null : modele.id })}
                className={cn(
                  "overflow-hidden rounded-lg bg-muted text-left",
                  contexte.modele_ugc_id === modele.id && "ring-2 ring-foreground",
                )}
                aria-label={`Choisir ${modele.name}`}
              >
                <img src={modele.image_url} alt={modele.name} loading="lazy" className="aspect-square w-full object-cover" />
                <p className="truncate px-1.5 py-1 text-[8px] text-muted-foreground">{modele.name}</p>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
            Aucun modèle dans votre bibliothèque. Réglez le genre, l’âge et la carnation ci-dessus, puis
            faites-en générer un.
          </p>
        )}
      </div>
    </div>
  );
}
