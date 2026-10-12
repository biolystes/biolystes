import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, RotateCcw } from "lucide-react";
import { CONFIG_PLATEFORME, type PlateformeEditoriale } from "@lystes/components/mygpt/editorial-formats";
import { membreDuReseau } from "./membre-du-reseau";
import type { MembreAgenceSociale } from "./types-agence";

/**
 * LA PLANCHE DU JOUR : L'ÉQUIPE AU TRAVAIL, SANS RIEN INVENTER.
 *
 * 14/09/2026 (JP), dicté : « on voit Lucie apparaître en disant que Lucie va
 * préparer tes postes d'aujourd'hui, on la voit comme team manager. Ensuite on
 * voit chaque réseau social faire le job. Ensuite la photographe qui prépare le
 * contenu. Et ensuite le coordinateur qui réorganise tout pour que la personne
 * sache ce qui est pour quel community manager. »
 *
 * LA RÈGLE QUI GOUVERNE TOUT : un pas d'animation égale un événement réel.
 * Aucune case ne change d'état, aucun compteur ne bouge sans une réponse reçue.
 * Une scène qui se déroule toute seule pendant que le serveur rame est une
 * barre de chargement déguisée en équipe, et elle ment sur ce qui est prêt.
 *
 * CONSÉQUENCE, contre-intuitive mais décisive : le plan complet est affiché dès
 * la première seconde, cases vides comprises, avec le réseau et le nom de la
 * personne sous chacune. La marchande peut fermer à la seconde 1 en sachant
 * déjà quoi poster où. Il n'y a donc PAS de « passe de coordination » finale à
 * la fin : elle ne révélerait rien que l'écran ne montre depuis le début.
 * Le coordinateur que JP décrit, c'est cette grille, tenue d'emblée.
 *
 * Aucune bibliothèque d'animation : le back-office n'en a aucune, et la charte
 * n'anime que des couleurs. `transition-colors`, `animate-in fade-in-0`, et
 * `Loader2` pour l'attente. Chaque état est porté par un TEXTE autant que par
 * une couleur : quand le système coupe les animations, la planche reste lisible.
 */

export type EtatCase = "attente" | "encours" | "faite" | "ratee";

export interface CaseJournee {
  cle: string;
  plateforme: string;
  produit: string | null;
  etat: EtatCase;
  image: string | null;
  erreur?: string | null;
}

const LIBELLE_ETAT: Record<EtatCase, string> = {
  attente: "En attente",
  encours: "En cours",
  faite: "Prêt",
  ratee: "À refaire",
};

/** Plancher de lisibilité de la ligne d'équipe : elle ne clignote pas. */
const LISIBILITE_MS = 900;

function Portrait({ membre, taille }: { membre?: MembreAgenceSociale; taille: number }) {
  const style = { width: taille, height: taille };
  if (membre?.avatar) {
    return <img src={membre.avatar} alt="" loading="lazy" className="shrink-0 rounded-full object-cover" style={style} />;
  }
  return (
    <div className="flex shrink-0 items-center justify-center rounded-full bg-muted text-[8px] font-semibold text-muted-foreground" style={style}>
      {(membre?.nom ?? "?").slice(0, 2).toUpperCase()}
    </div>
  );
}

export function PlancheJournee({
  libelleJour,
  cases,
  equipe,
  onRefaire,
}: {
  libelleJour: string;
  cases: CaseJournee[];
  equipe: MembreAgenceSociale[];
  onRefaire?: (cle: string) => void;
}) {
  const parCle = useMemo(() => new Map(equipe.map((m) => [m.cle, m])), [equipe]);
  const direction = parCle.get("direction");

  const faites = cases.filter((c) => c.etat === "faite").length;
  const ratees = cases.filter((c) => c.etat === "ratee").length;
  const encours = cases.find((c) => c.etat === "encours");
  const reseaux = new Set(cases.map((c) => c.plateforme)).size;

  /* Le visage qui parle. Il suit qui travaille vraiment, et ne change qu'après
     un plancher de lisibilité : sans lui, neuf réponses rapides feraient
     défiler neuf têtes en une seconde, ce qui ne se lit pas et donne
     l'impression d'un bug. Le plancher retarde la LIGNE, jamais les cases. */
  const cleVoulue = encours ? membreDuReseau(encours.plateforme) : "direction";
  const [cleAffichee, setCleAffichee] = useState(cleVoulue);
  useEffect(() => {
    if (cleVoulue === cleAffichee) return;
    const minuteur = setTimeout(() => setCleAffichee(cleVoulue), LISIBILITE_MS);
    return () => clearTimeout(minuteur);
  }, [cleVoulue, cleAffichee]);

  const parle = parCle.get(cleAffichee) ?? direction;
  const termine = !encours && faites + ratees === cases.length && cases.length > 0;

  /* La phrase dit la SITUATION, la ligne de compteurs dit les NOMBRES. Les deux
     annonçaient « 1 à refaire » à trois centimètres l'un de l'autre : un chiffre
     répété se lit comme deux chiffres différents, et on les additionne. */
  const phrase = termine
    ? ratees
      ? "Journée terminée. Reprenez les publications à refaire."
      : `Votre journée est prête. ${faites} publication${faites > 1 ? "s" : ""} à valider.`
    : encours
      ? `${parle?.nom ?? "L’équipe"} prépare ${CONFIG_PLATEFORME[encours.plateforme as PlateformeEditoriale]?.libelle ?? encours.plateforme}.`
      : `${direction?.nom ?? "L’agence"} prépare vos publications du jour.`;

  return (
    <section className="animate-in fade-in-0 rounded-lg bg-background p-5 duration-300">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-[13px] font-semibold text-foreground">{libelleJour}</h3>
        <p className="text-[10px] text-muted-foreground">
          {`${cases.length} publication${cases.length > 1 ? "s" : ""}, ${reseaux} réseau${reseaux > 1 ? "x" : ""}`}
        </p>
      </header>

      {/* LA LIGNE D'ÉQUIPE : le seul endroit où l'équipe parle. Elle ne
          s'empile pas en journal, elle change de visage et de texte. Un
          historique de neuf lignes serait illisible et ne servirait personne. */}
      <div className="mt-3 flex items-center gap-3 rounded-lg bg-muted p-3">
        <Portrait membre={parle} taille={36} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium text-foreground">{phrase}</p>
          <p className="mt-0.5 text-[9px] text-muted-foreground">
            {`${faites} sur ${cases.length} prête${faites > 1 ? "s" : ""}`}
            {ratees ? ` · ${ratees} à refaire` : ""}
          </p>
        </div>
        {encours ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" /> : null}
      </div>

      <div className="mt-1 h-px bg-[#f1f1f1]" />

      {/* LE PLAN ENTIER, DÈS LA PREMIÈRE SECONDE. Chaque case dit son réseau,
          son produit et qui la tient, avant même d'être écrite. */}
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {cases.map((c) => {
          const config = CONFIG_PLATEFORME[c.plateforme as PlateformeEditoriale];
          const membre = parCle.get(membreDuReseau(c.plateforme)) ?? direction;
          return (
            <li key={c.cle} className="min-w-0">
              <div
                className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-lg transition-colors duration-200 ${
                  c.etat === "faite" ? "bg-[#e1f3c5]" : "bg-muted"
                }`}
              >
                {c.image ? (
                  <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                ) : (
                  <div className="px-2 text-center">
                    <p className="text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
                      {config?.court ?? c.plateforme}
                    </p>
                    {c.produit ? (
                      <p className="mt-1 line-clamp-2 text-[9px] leading-tight text-muted-foreground">{c.produit}</p>
                    ) : null}
                  </div>
                )}

                {/* L'état est écrit, pas seulement coloré : les animations
                    coupées ou un daltonisme ne doivent rien enlever. */}
                <span className="absolute bottom-1 left-1 flex items-center gap-1 rounded bg-background/90 px-1.5 py-0.5 text-[8px] text-muted-foreground">
                  {c.etat === "encours" ? <Loader2 className="h-2.5 w-2.5 animate-spin" /> : null}
                  {c.etat === "faite" ? <Check className="h-2.5 w-2.5" /> : null}
                  {LIBELLE_ETAT[c.etat]}
                </span>

                {c.etat === "ratee" && onRefaire ? (
                  <button
                    type="button"
                    onClick={() => onRefaire(c.cle)}
                    className="absolute right-1 top-1 rounded bg-background/90 p-1 text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    aria-label={`Refaire ${config?.libelle ?? c.plateforme}`}
                  >
                    <RotateCcw className="h-2.5 w-2.5" />
                  </button>
                ) : null}
              </div>

              {/* La signature est SOUS l'information, jamais à sa place. */}
              <div className="mt-1 flex items-center gap-1.5">
                <Portrait membre={membre} taille={16} />
                <p className="truncate text-[9px] text-muted-foreground">
                  {`${membre?.nom ?? "L’agence"} · ${config?.libelle ?? c.plateforme}`}
                </p>
              </div>

              {c.etat === "ratee" && c.erreur ? (
                <p className="mt-0.5 line-clamp-2 text-[9px] leading-tight text-muted-foreground">{c.erreur}</p>
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
