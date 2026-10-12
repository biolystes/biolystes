/**
 * Propositions de variations de prompt pour une position (JP, 13/09/2026).
 *
 * Rien n'est enregistré ici : le marchand choisit une proposition, elle va
 * dans le champ du prompt, et c'est lui qui enregistre. Si le service ne
 * répond pas, on le dit — aucun texte de remplacement n'est inventé.
 */
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@lystes/components/ui/dialog";
import { Button } from "@lystes/components/ui/button";

export interface VariationPrompt {
  titre: string;
  prompt: string;
}

export function PropositionsPromptDialog({
  ouvert,
  onClose,
  nom,
  position,
  charger,
  onChoisir,
}: {
  ouvert: boolean;
  onClose: () => void;
  nom: string;
  position: number | null;
  /** Va chercher les propositions au serveur. */
  charger: () => Promise<VariationPrompt[]>;
  /** La proposition retenue remplace le texte en cours d'édition. */
  onChoisir: (prompt: string) => void;
}) {
  const [variations, setVariations] = useState<VariationPrompt[]>([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!ouvert) {
      setVariations([]);
      setErreur(null);
      return;
    }
    let vivant = true;
    setChargement(true);
    setErreur(null);
    charger()
      .then((liste) => {
        if (!vivant) return;
        setVariations(liste);
        if (!liste.length) setErreur("Aucune proposition n'a été renvoyée.");
      })
      .catch((e: unknown) => {
        if (!vivant) return;
        setErreur(e instanceof Error ? e.message : "Propositions indisponibles.");
      })
      .finally(() => {
        if (vivant) setChargement(false);
      });
    return () => {
      vivant = false;
    };
  }, [ouvert, charger]);

  return (
    <Dialog open={ouvert} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[14px]">
            Variations proposées — {nom}
            {position !== null ? ` · photo ${position + 1}` : ""}
          </DialogTitle>
        </DialogHeader>
        <p className="text-[11px] leading-snug text-[#777b7f]">
          Choisissez une variation : elle remplit le champ du prompt. Vous pouvez la retoucher, puis
          l'enregistrer. Rien n'est enregistré tant que vous ne le demandez pas.
        </p>

        {chargement && <p className="py-6 text-center text-[11px] text-[#777b7f]">Recherche de variations…</p>}

        {!chargement && erreur && (
          <p className="rounded-md bg-[#fdf1f1] p-3 text-[11px] text-[#8a2b2b]">{erreur}</p>
        )}

        {!chargement &&
          variations.map((v, i) => (
            <div key={`${v.titre}-${i}`} className="rounded-lg bg-[#f7f7f8] p-3">
              <p className="text-[11px] font-semibold text-black">{v.titre || `Variation ${i + 1}`}</p>
              <p className="mt-1 whitespace-pre-wrap text-[11px] leading-relaxed text-[#52504f]">{v.prompt}</p>
              <div className="mt-2 flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="h-7 px-3 text-[11px]"
                  onClick={() => {
                    onChoisir(v.prompt);
                    onClose();
                  }}
                >
                  Utiliser cette variation
                </Button>
              </div>
            </div>
          ))}
      </DialogContent>
    </Dialog>
  );
}
