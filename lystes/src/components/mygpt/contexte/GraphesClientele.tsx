import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Part, StatsClientele } from "@lystes/features/social/useStatsClientele";
import { usePrenomsClientele } from "@lystes/features/social/useSignauxClientele";

/**
 * LES CHIFFRES, EN IMAGE.
 *
 * 14/09/2026 (JP) : le contexte doit se lire d'un coup d'œil — qui achète,
 * d'où, quels produits se vendent, lesquels font parler. Palette monochrome :
 * une seule couleur, des opacités différentes, aucune bordure.
 */

const TEINTES = ["hsl(var(--foreground))", "hsl(var(--foreground) / 0.72)", "hsl(var(--foreground) / 0.48)", "hsl(var(--foreground) / 0.3)", "hsl(var(--foreground) / 0.18)", "hsl(var(--foreground) / 0.1)"];

function Titre({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{children}</p>
  );
}

function Vide({ message }: { message: string }) {
  return <p className="py-6 text-[10px] leading-relaxed text-muted-foreground">{message}</p>;
}

function raccourcir(texte: string, taille = 22) {
  return texte.length > taille ? `${texte.slice(0, taille - 1)}…` : texte;
}

function Barres({ donnees, unite }: { donnees: Part[]; unite: string }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(120, donnees.length * 26)}>
      <BarChart data={donnees} layout="vertical" margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="libelle"
          width={130}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
          tickFormatter={(v: string) => raccourcir(v)}
        />
        <Tooltip
          cursor={{ fill: "hsl(var(--muted))" }}
          contentStyle={{
            background: "hsl(var(--background))",
            border: "none",
            borderRadius: 8,
            fontSize: 11,
          }}
          formatter={(valeur: number) => [`${valeur} ${unite}`, ""]}
        />
        <Bar dataKey="valeur" radius={[0, 4, 4, 0]} barSize={12}>
          {donnees.map((_, index) => (
            <Cell key={index} fill={TEINTES[Math.min(index, TEINTES.length - 1)]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function GraphesClientele({ stats, compteId }: { stats: StatsClientele; compteId?: string | null }) {
  /* 14/09/2026 (JP) : « pourquoi c'est vide alors que d'un côté on montre que
     ce n'est pas le cas ? »

     LA CAUSE, mesurée : la même question, qui achète, était répondue à DEUX
     endroits depuis DEUX sources. Cet onglet lisait `customer_avatars`, la
     table des portraits calculés, vide tant que personne n'a lancé le calcul.
     L'onglet « Avatar & lieu » déduisait le genre des prénoms de commande et
     affichait 98 % de femmes sur mille prénoms. Un écran annonçait donc « non
     mesuré » pendant que le suivant montrait la mesure.

     LA RÈGLE MAINTENANT : une seule mesure, pas deux. On appelle exactement le
     hook de l'autre onglet, `usePrenomsClientele`, même clé de requête donc
     même résultat en cache : les deux écrans ne peuvent plus diverger.

     Recalculer ici aurait donné un TROISIÈME chiffre : cet onglet lit 800
     commandes sur douze mois, l'autre en lit cinq mille depuis toujours. */
  const { data: prenoms } = usePrenomsClientele(compteId, !stats.genres.length);

  const parPrenoms = !stats.genres.length && prenoms && prenoms.femmes + prenoms.hommes > 0;
  const genres: Part[] = parPrenoms
    ? [
        { libelle: "Femmes", valeur: prenoms.femmes },
        { libelle: "Hommes", valeur: prenoms.hommes },
      ]
    : stats.genres;

  const chiffres = [
    { label: "Commandes (12 mois)", valeur: stats.nbCommandes.toLocaleString("fr-FR") },
    { label: "Chiffre d’affaires", valeur: `${Math.round(stats.chiffreAffaires).toLocaleString("fr-FR")} €` },
    { label: "Panier moyen", valeur: `${Math.round(stats.panierMoyen).toLocaleString("fr-FR")} €` },
    { label: "Âge dominant", valeur: stats.ageSource ?? "—" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted p-4 sm:grid-cols-4">
        {chiffres.map((c) => (
          <div key={c.label}>
            <p className="text-[7px] uppercase tracking-[0.14em] text-muted-foreground">{c.label}</p>
            <p className="mt-0.5 font-display text-lg font-medium text-foreground">{c.valeur}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Titre>Femmes / hommes</Titre>
          {genres.length ? (
            <div className="mt-2 flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie data={genres} dataKey="valeur" nameKey="libelle" innerRadius={32} outerRadius={56} stroke="none">
                    {genres.map((_, index) => (
                      <Cell key={index} fill={TEINTES[Math.min(index, TEINTES.length - 1)]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--background))", border: "none", borderRadius: 8, fontSize: 11 }}
                    formatter={(valeur: number, nom: string) => [`${valeur} clients`, nom]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <ul className="space-y-1 text-[10px] text-muted-foreground">
                {genres.map((g, index) => (
                  <li key={g.libelle} className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ background: TEINTES[Math.min(index, TEINTES.length - 1)] }}
                    />
                    <span className="text-foreground">{g.libelle}</span> · {g.valeur}
                  </li>
                ))}
                {/* D'où vient le chiffre. Une proportion sans sa provenance se
                    fait prendre pour une autre : ici les prénoms de commande
                    n'ont pas la même autorité qu'un portrait calculé. */}
                <li className="pt-1 text-[9px] leading-relaxed">
                  {parPrenoms
                    ? `Déduit de ${prenoms.femmes + prenoms.hommes} prénoms de commande reconnus${prenoms.indetermines ? `, ${prenoms.indetermines} écartés plutôt que devinés` : ""}.`
                    : "Mesuré sur vos portraits clientes."}
                </li>
              </ul>
            </div>
          ) : (
            <Vide message="Aucune commande ne porte de prénom exploitable, et aucun portrait cliente n’a encore été calculé. Réglez la répartition à la main dans l’onglet « Avatar & lieu »." />
          )}
        </div>

        <div>
          <Titre>Pays d’où viennent les commandes</Titre>
          {stats.pays.length ? <div className="mt-2"><Barres donnees={stats.pays} unite="commandes" /></div> : <Vide message="Aucune commande enregistrée sur les 12 derniers mois." />}
        </div>

        <div>
          <Titre>Meilleures ventes</Titre>
          {stats.topVentes.length ? <div className="mt-2"><Barres donnees={stats.topVentes} unite="vendus" /></div> : <Vide message="Aucune ligne de commande exploitable." />}
        </div>

        <div>
          <Titre>Produits les plus questionnés</Titre>
          {stats.sollicitations.length ? <div className="mt-2"><Barres donnees={stats.sollicitations} unite="conversations" /></div> : <Vide message="Aucune conversation analysée pour l’instant." />}
        </div>

        <div>
          <Titre>Produits les plus essayés</Titre>
          {stats.essayages.length ? <div className="mt-2"><Barres donnees={stats.essayages} unite="essayages" /></div> : <Vide message="Aucun essayage enregistré." />}
        </div>

        <div>
          <Titre>À mettre en avant</Titre>
          {stats.aMettreEnAvant.length ? (
            <ul className="mt-2 space-y-2">
              {stats.aMettreEnAvant.map((p) => (
                <li key={p.libelle} className="rounded-lg bg-muted p-3">
                  <p className="text-[11px] font-medium text-foreground">{p.libelle}</p>
                  <p className="mt-0.5 text-[9px] text-muted-foreground">
                    {p.questions} conversation{p.questions > 1 ? "s" : ""} · {p.ventes} vendu{p.ventes > 1 ? "s" : ""} sur 12 mois
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <Vide message="Rien à signaler : les produits qui font parler sont déjà ceux qui se vendent." />
          )}
        </div>
      </div>
    </div>
  );
}
