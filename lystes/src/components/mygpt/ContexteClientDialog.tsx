import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@lystes/lib/lien-lystes";
import { Copy, ExternalLink, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@lystes/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lystes/components/ui/tabs";
import { Button } from "@lystes/components/ui/button";
import { Badge } from "@lystes/components/ui/badge";
import { supabase } from "@lystes/integrations/supabase/client";
import { useAccount } from "@lystes/contexts/AccountContext";
import { fusionner, lireEntrees } from "@lystes/pages/dashboard/experts/insights-metiers";
import { useStatsClientele } from "@lystes/features/social/useStatsClientele";
import { phraseContexte, useContexteCreatif, type ContexteCreatif } from "@lystes/features/social/useContexteCreatif";
import { GraphesClientele } from "@lystes/components/mygpt/contexte/GraphesClientele";
import { ReglageAvatarClient } from "@lystes/components/mygpt/contexte/ReglageAvatarClient";
import { LieuDeTournage } from "@lystes/components/mygpt/contexte/LieuDeTournage";
import { SavoirBoutique } from "@lystes/components/mygpt/contexte/SavoirBoutique";
import { cn } from "@lystes/lib/utils";

/**
 * LE CONTEXTE CLIENTE DERRIÈRE CHAQUE PUBLICATION.
 *
 * 14/09/2026 (JP) : le contexte ne se lit plus en texte. On voit d'un coup
 * d'œil QUI achète (femmes / hommes, pays, panier), CE QUI se vend, CE QUI
 * fait parler, CE QUI mériterait d'être mis en avant — et la marque ajuste
 * elle-même l'avatar client, le lieu et le mannequin attendu sur les visuels.
 *
 * Rien n'est inventé : une source vide s'affiche vide, avec le lien qui la
 * remplit.
 */

interface ContexteClientDialogProps {
  ouvert: boolean;
  onOuvertChange: (ouvert: boolean) => void;
  /** Le profil à qui ce contexte est destiné (community manager, media buyer…). */
  nomProfil: string;
  plateforme: string;
  /** Reprend le brief dans le prompt général du profil, quand c'est possible. */
  onAppliquer?: (brief: string) => void;
}

const GENRE: Record<string, string> = {
  female: "femmes",
  male: "hommes",
  mixed: "public mixte",
};

export function ContexteClientDialog({
  ouvert,
  onOuvertChange,
  nomProfil,
  plateforme,
  onAppliquer,
}: ContexteClientDialogProps) {
  const { selectedAccount } = useAccount();
  const compteId = selectedAccount?.id;
  const [portraitChoisi, setPortraitChoisi] = useState<string | null>(null);
  const [brouillon, setBrouillon] = useState<Partial<ContexteCreatif>>({});

  const { data: stats, isLoading: statsEnCours } = useStatsClientele(compteId, ouvert);
  const { contexte: contexteEnregistre, enregistrer, enregistrement } = useContexteCreatif(compteId);
  const contexte = useMemo(
    () => ({ ...contexteEnregistre, ...brouillon }),
    [contexteEnregistre, brouillon],
  );
  const modifie = Object.keys(brouillon).length > 0;

  const { data, isLoading } = useQuery({
    queryKey: ["contexte-client-creatif", compteId],
    enabled: !!compteId && ouvert,
    queryFn: async () => {
      const [portraits, analyses, produits] = await Promise.all([
        supabase
          .from("customer_avatars")
          .select("*")
          .eq("account_id", compteId!)
          .eq("is_active", true)
          .order("sample_size", { ascending: false, nullsFirst: false }),
        supabase
          .from("product_conversation_insights")
          .select("product_name, top_concerns, top_questions, common_objections")
          .eq("account_id", compteId!)
          .limit(500),
        supabase
          .from("products")
          .select("name, price")
          .eq("account_id", compteId!)
          .limit(50),
      ]);
      if (portraits.error) throw portraits.error;
      if (analyses.error) throw analyses.error;
      if (produits.error) throw produits.error;

      const lignes = analyses.data ?? [];
      return {
        portraits: portraits.data ?? [],
        preoccupations: fusionner(
          lignes.flatMap((a) => lireEntrees(a.top_concerns, ["concern", "label"], a.product_name)),
        ).slice(0, 6),
        questions: fusionner(
          lignes.flatMap((a) => lireEntrees(a.top_questions, ["question", "label"], a.product_name)),
        ).slice(0, 6),
        freins: fusionner(
          lignes.flatMap((a) =>
            lireEntrees(a.common_objections, ["objection", "label"], a.product_name),
          ),
        ).slice(0, 6),
        produits: produits.data ?? [],
      };
    },
  });

  const portrait = useMemo(() => {
    const liste = data?.portraits ?? [];
    if (!liste.length) return null;
    return liste.find((p) => p.id === portraitChoisi) ?? liste[0];
  }, [data, portraitChoisi]);

  /* Le type de personne à montrer sur le visuel : le réglage de la marque
     prime sur le calcul, parce qu'elle connaît sa clientèle. */
  const typeDeModele = useMemo(() => {
    const manuel = [contexte.avatar_genre, contexte.avatar_age, contexte.avatar_carnation, contexte.avatar_style]
      .filter(Boolean)
      .join(" · ");
    if (manuel) return manuel;
    if (!portrait) return null;
    const morceaux: string[] = [];
    if (portrait.gender) morceaux.push(GENRE[portrait.gender] ?? portrait.gender);
    if (portrait.age_range) morceaux.push(portrait.age_range + " ans");
    const pays = portrait.top_countries?.filter(Boolean) ?? [];
    if (pays.length) morceaux.push(pays.slice(0, 2).join(", "));
    return morceaux.length ? morceaux.join(" · ") : null;
  }, [contexte, portrait]);

  const brief = useMemo(() => {
    const lignes: string[] = [];
    lignes.push(`Contexte cliente pour ${nomProfil} (${plateforme}).`);
    if (portrait) {
      lignes.push(
        `Portrait dominant : ${portrait.avatar_name}${
          portrait.sample_size ? ` (${portrait.sample_size} clientes)` : ""
        }.`,
      );
      if (portrait.avatar_description) lignes.push(portrait.avatar_description);
      if (portrait.main_concerns?.length)
        lignes.push(`Préoccupations du portrait : ${portrait.main_concerns.slice(0, 5).join(" ; ")}.`);
      if (portrait.pain_points?.length)
        lignes.push(`Points de friction : ${portrait.pain_points.slice(0, 5).join(" ; ")}.`);
      if (portrait.average_order_value)
        lignes.push(`Panier moyen observé : ${Math.round(Number(portrait.average_order_value))} €.`);
    }
    if (typeDeModele)
      lignes.push(
        `Si le visuel montre une personne ou un mannequin, elle doit ressembler à cette cliente : ${typeDeModele}.`,
      );
    lignes.push(...phraseContexte(contexte));
    if (stats?.nbCommandes)
      lignes.push(
        `Mesuré sur 12 mois : ${stats.nbCommandes} commandes, panier moyen ${Math.round(stats.panierMoyen)} €${
          stats.pays.length ? `, surtout ${stats.pays.slice(0, 3).map((p) => p.libelle).join(", ")}` : ""
        }.`,
      );
    if (stats?.topVentes.length)
      lignes.push(`Meilleures ventes : ${stats.topVentes.slice(0, 5).map((v) => v.libelle).join(" ; ")}.`);
    if (stats?.sollicitations.length)
      lignes.push(
        `Produits les plus questionnés : ${stats.sollicitations.slice(0, 5).map((s) => s.libelle).join(" ; ")}.`,
      );
    if (stats?.essayages.length)
      lignes.push(`Produits les plus essayés : ${stats.essayages.slice(0, 4).map((e) => e.libelle).join(" ; ")}.`);
    if (stats?.aMettreEnAvant.length)
      lignes.push(
        `À mettre en avant (très questionnés, peu vendus) : ${stats.aMettreEnAvant
          .slice(0, 4)
          .map((p) => p.libelle)
          .join(" ; ")}.`,
      );
    if (data?.preoccupations.length)
      lignes.push(
        `Préoccupations entendues en conversation : ${data.preoccupations
          .map((p) => p.libelle)
          .join(" ; ")}.`,
      );
    if (data?.questions.length)
      lignes.push(`Questions posées : ${data.questions.map((q) => q.libelle).join(" ; ")}.`);
    if (data?.freins.length)
      lignes.push(`Objections à lever : ${data.freins.map((f) => f.libelle).join(" ; ")}.`);
    lignes.push(
      "Le texte publié doit répondre à une de ces préoccupations, nommer le produit et garder le ton de la marque.",
    );
    return lignes.join("\n");
  }, [data, stats, contexte, portrait, typeDeModele, nomProfil, plateforme]);

  const Liste = ({ titre, entrees }: { titre: string; entrees?: { libelle: string; compte: number }[] }) =>
    entrees?.length ? (
      <div>
        <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{titre}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {entrees.map((e) => (
            <Badge key={e.libelle} variant="secondary" className="text-[10px] font-normal">
              {e.libelle} · {e.compte}
            </Badge>
          ))}
        </div>
      </div>
    ) : null;

  const enregistrerContexte = async () => {
    try {
      await enregistrer(brouillon);
      setBrouillon({});
      toast.success("Contexte enregistré.");
    } catch (erreur) {
      toast.error(erreur instanceof Error ? erreur.message : "Enregistrement impossible.");
    }
  };

  return (
    <Dialog open={ouvert} onOpenChange={onOuvertChange}>
      <DialogContent className="max-h-[88vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />
            Contexte cliente · {nomProfil}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="chiffres">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="chiffres" className="text-[11px]">Chiffres</TabsTrigger>
            <TabsTrigger value="conversations" className="text-[11px]">Conversations</TabsTrigger>
            <TabsTrigger value="avatar" className="text-[11px]">Avatar & lieu</TabsTrigger>
            <TabsTrigger value="cerveau" className="text-[11px]">Le cerveau</TabsTrigger>
            <TabsTrigger value="brief" className="text-[11px]">Brief</TabsTrigger>
          </TabsList>

          <TabsContent value="chiffres" className="mt-5">
            {statsEnCours ? (
              <div className="flex items-center gap-2 py-10 text-[11px] text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Lecture de vos commandes, conversations et essayages…
              </div>
            ) : stats ? (
              <GraphesClientele stats={stats} compteId={compteId} />
            ) : null}
          </TabsContent>

          <TabsContent value="conversations" className="mt-5 space-y-5">
            {isLoading ? (
              <div className="flex items-center gap-2 py-10 text-[11px] text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Lecture de vos portraits et de vos conversations…
              </div>
            ) : (
              <>
                {(data?.portraits.length ?? 0) > 1 && (
                  <div className="flex flex-wrap gap-1.5">
                    {data!.portraits.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPortraitChoisi(p.id)}
                        className={cn(
                          "rounded-full px-3 py-1 text-[10px]",
                          portrait?.id === p.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {p.avatar_name}
                      </button>
                    ))}
                  </div>
                )}

                {portrait ? (
                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Portrait calculé
                    </p>
                    <p className="mt-1 font-display text-lg font-medium text-foreground">{portrait.avatar_name}</p>
                    {portrait.avatar_description && (
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        {portrait.avatar_description}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 rounded-lg bg-muted p-4 text-[11px] text-muted-foreground">
                    <p>Aucun portrait cliente n’a encore été calculé. Rien n’est inventé ici.</p>
                    <Button asChild size="sm" variant="outline">
                      <Link to="/dashboard/experts-produit/avatar-client">
                        Calculer l’avatar client <ExternalLink className="ml-1.5 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-3">
                  <Liste titre="Préoccupations" entrees={data?.preoccupations} />
                  <Liste titre="Questions posées" entrees={data?.questions} />
                  <Liste titre="Objections" entrees={data?.freins} />
                </div>

                <Button asChild size="sm" variant="ghost" className="text-[11px]">
                  <Link to="/dashboard/experts-produit/insights">
                    Voir tous les insights <ExternalLink className="ml-1.5 h-3 w-3" />
                  </Link>
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="avatar" className="mt-5 space-y-4">
            <ReglageAvatarClient
              compteId={compteId}
              contexte={contexte}
              onChanger={(valeurs) => setBrouillon((actuel) => ({ ...actuel, ...valeurs }))}
              enregistrement={enregistrement}
            />
            <LieuDeTournage
              compteId={compteId}
              contexte={contexte}
              onChanger={(valeurs) => setBrouillon((actuel) => ({ ...actuel, ...valeurs }))}
            />

            <div className="flex items-center gap-2">
              <Button size="sm" onClick={enregistrerContexte} disabled={!modifie || enregistrement}>
                {enregistrement && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                Enregistrer le contexte
              </Button>
              {modifie && <span className="text-[10px] text-muted-foreground">Modifications non enregistrées.</span>}
            </div>
          </TabsContent>

          <TabsContent value="cerveau" className="mt-5">
            <SavoirBoutique compteId={compteId} />
          </TabsContent>

          <TabsContent value="brief" className="mt-5 space-y-4">
            <pre className="max-h-[45vh] overflow-y-auto whitespace-pre-wrap rounded-lg bg-muted p-4 text-[11px] leading-relaxed text-foreground">
              {brief}
            </pre>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(brief);
                  toast.success("Brief copié.");
                }}
              >
                <Copy className="mr-1.5 h-3 w-3" /> Copier le brief
              </Button>
              {onAppliquer && (
                <Button
                  size="sm"
                  onClick={() => {
                    onAppliquer(brief);
                    onOuvertChange(false);
                  }}
                >
                  Ajouter au prompt du profil
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
