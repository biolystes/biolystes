import { useRef, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@lystes/components/ui/button";
import { Switch } from "@lystes/components/ui/switch";
import { supabase } from "@lystes/integrations/supabase/client";
import type { ContexteCreatif } from "@lystes/features/social/useContexteCreatif";

/**
 * « SHOOTER DANS MON SALON » (JP, 15/09/2026).
 *
 * Une marchande qui tient un lieu — salon de coiffure, institut, boutique —
 * ne veut pas d'un décor inventé : elle veut SES murs. La description écrite
 * ne suffit pas, le moteur invente dès qu'il n'a pas d'image. On garde donc
 * jusqu'à trois photos du lieu, et l'interrupteur dit clairement si elles
 * doivent servir de décor. Interrupteur éteint : rien ne change.
 */
const MAX_PHOTOS = 3;

interface LieuDeTournageProps {
  compteId: string;
  contexte: ContexteCreatif;
  onChanger: (valeurs: Partial<ContexteCreatif>) => void;
}

export function LieuDeTournage({ compteId, contexte, onChanger }: LieuDeTournageProps) {
  const champ = useRef<HTMLInputElement | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const photos = contexte.lieu_photos ?? [];

  const deposer = async (fichiers: FileList | null) => {
    if (!fichiers?.length) return;
    setEnvoi(true);
    try {
      const ajoutees: string[] = [];
      for (const fichier of Array.from(fichiers).slice(0, MAX_PHOTOS - photos.length)) {
        if (!fichier.type.startsWith("image/")) {
          toast.error(`${fichier.name} n’est pas une image.`);
          continue;
        }
        if (fichier.size > 10 * 1024 * 1024) {
          toast.error(`${fichier.name} dépasse 10 Mo.`);
          continue;
        }
        const extension = fichier.name.split(".").pop() || "jpg";
        const chemin = `${compteId}/lieu/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
        const { error } = await supabase.storage
          .from("custom-photographers")
          .upload(chemin, fichier, { contentType: fichier.type, upsert: false });
        if (error) {
          toast.error(`Envoi impossible : ${error.message}`);
          continue;
        }
        ajoutees.push(supabase.storage.from("custom-photographers").getPublicUrl(chemin).data.publicUrl);
      }
      if (ajoutees.length) onChanger({ lieu_photos: [...photos, ...ajoutees].slice(0, MAX_PHOTOS) });
    } finally {
      setEnvoi(false);
      if (champ.current) champ.current.value = "";
    }
  };

  const retirer = (url: string) => onChanger({ lieu_photos: photos.filter((p) => p !== url) });

  return (
    <div className="space-y-3 rounded-lg bg-muted/40 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Lieu de tournage
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Vos photos servent de décor aux visuels générés : vos murs, votre mobilier, votre lumière.
          </p>
        </div>
        <Switch
          checked={contexte.lieu_tournage_actif}
          onCheckedChange={(valeur) => onChanger({ lieu_tournage_actif: valeur })}
          aria-label="Tourner dans mon lieu"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {photos.map((url) => (
          <div key={url} className="relative h-20 w-20 overflow-hidden rounded-md bg-muted">
            <img src={url} alt="Photo du lieu" className="h-full w-full object-cover" loading="lazy" />
            <button
              type="button"
              onClick={() => retirer(url)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/60 text-background"
              aria-label="Retirer cette photo"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <Button
            type="button"
            variant="ghost"
            className="h-20 w-20 flex-col gap-1 bg-muted/60 text-[9px]"
            disabled={envoi}
            onClick={() => champ.current?.click()}
          >
            {envoi ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
            Ajouter
          </Button>
        )}
      </div>

      {contexte.lieu_tournage_actif && !photos.length && (
        <p className="text-[10px] text-muted-foreground">
          Ajoutez au moins une photo de votre lieu : sans image, le décor ne peut pas être reproduit.
        </p>
      )}

      <input
        ref={champ}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(evenement) => void deposer(evenement.target.files)}
      />
    </div>
  );
}
