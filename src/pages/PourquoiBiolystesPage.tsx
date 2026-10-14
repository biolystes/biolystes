/* /etudes : l’étude interne Biolystes, dans le style de l’accueil (JP,
   14/10/2026). Cadre, en-tête et pied de page : src/pages/pied/CadrePied.tsx.

   Le chiffre : 27 porteurs de projet sur 30 n’avaient pas lancé leur marque,
   soit 9 sur 10. L’ancien « 92 % » était impossible sur 30 personnes ;
   l’accueil dit aussi « 9 sur 10 ». Aucun montant en euros sur la page
   (règle de JP : aucun prix ni montant en ligne). */
import type { ReactNode } from "react";
import { Brain, CircleDollarSign, FlaskConical, X, type LucideIcon } from "lucide-react";
import { Bande, BoutonsAction, Entete, ListeCoches, Texte, TitreCarte } from "./pied/elements";

const CHIFFRES = [
  { valeur: "30", libelle: "porteurs de projet suivis, tous avec une formulation sur mesure en tête" },
  { valeur: "7 mois", libelle: "de suivi après leur premier contact avec Biolystes" },
  { valeur: "9 sur 10", libelle: "n’avaient toujours pas mis un seul produit en vente" },
];

const SANS = [
  "Sans parabènes", "Sans silicones", "Sans PEG", "Sans filtres UV chimiques",
  "Sans microplastiques", "Sans colorants artificiels", "Sans phosphates", "Sans conservateurs synthétiques",
];

const SYNTHESE = [
  { categorie: "Financier", facteur: "Coût d’entrée des laboratoires", impact: "2 000 à 4 000 unités à payer d’avance pour 4 produits" },
  { categorie: "Financier", facteur: "Déséquilibre budgétaire", impact: "90 % du budget dans le stock, rien pour le marketing" },
  { categorie: "Financier", facteur: "Risque de stock invendu", impact: "Des milliers de produits sans moyen de les vendre" },
  { categorie: "Opérationnel", facteur: "Fabrication interminable", impact: "Des mois, parfois des années d’allers-retours" },
  { categorie: "Opérationnel", facteur: "Chaîne de prestataires", impact: "Chaque maillon faible compromet l’ensemble" },
  { categorie: "Opérationnel", facteur: "Certifications", impact: "Des années pour tout obtenir seul" },
  { categorie: "Comportemental", facteur: "Procrastination", impact: "La complexité paralyse l’action" },
  { categorie: "Comportemental", facteur: "Biais de l’actif", impact: "L’ingrédient prime sur le résultat client" },
];

const BRICOLAGE_LEGER = { fontFamily: "'Bricolage Grotesque', 'Inter', sans-serif", fontWeight: 300 };

/* Carte de lecture : blanche sur bande grise, grise sur bande blanche. */
function Carte({ children, gris = false, className = "" }: { children: ReactNode; gris?: boolean; className?: string }) {
  return <div className={(gris ? "bg-secondary " : "bg-background ") + "rounded-2xl p-6 md:p-8 " + className}>{children}</div>;
}

function Facteur({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <Carte>
      <TitreCarte>{titre}</TitreCarte>
      <div className="mt-4 space-y-4">{children}</div>
    </Carte>
  );
}

function Categorie({ numero, titre, icone, children }: { numero: string; titre: string; icone: LucideIcon; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="pt-2 pb-1">
        <TitreCarte icone={icone} sousTitre={numero}>{titre}</TitreCarte>
      </div>
      {children}
    </div>
  );
}

export default function PourquoiBiolystesPage() {
  return (
    <>
      {/* ═══ HAUT DE PAGE ═══ */}
      <section className="bg-background pt-12 md:pt-20 pb-12 md:pb-16 px-6">
        <Entete niveau={1} surtitre="Étude interne Biolystes"
          noir="9 porteurs de projet sur 10"
          gris={"n’ont toujours rien lancé 7 mois après."}
          texte="Nous avons suivi 30 porteurs de projet venus nous voir avec une formulation sur mesure. Voici ce que sont devenus leurs projets." />
        <div className="max-w-4xl mx-auto mt-10 md:mt-12 grid sm:grid-cols-3 gap-4">
          {CHIFFRES.map((c) => (
            <div key={c.valeur} className="bg-secondary rounded-2xl p-6 text-center">
              <p className="text-[36px] md:text-[40px] leading-none text-foreground tracking-tight" style={BRICOLAGE_LEGER}>{c.valeur}</p>
              <p className="mt-3 text-[0.875rem] text-muted-foreground leading-relaxed text-pretty">{c.libelle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ L’ÉTUDE ═══ */}
      <Bande gris>
        <div className="max-w-[768px] mx-auto px-6">
          <Entete className="mb-10 md:mb-12" surtitre="L’étude"
            noir="Nous avons voulu mesurer" gris="ce que deviennent ces projets."
            texte="Chaque mois, plusieurs dizaines d’entrepreneurs nous demandent de lancer leur propre marque cosmétique." />
          <div className="space-y-4">
            <Carte>
              <TitreCarte>Contexte de l’étude</TitreCarte>
              <div className="mt-4 space-y-4">
                <Texte>Chez Biolystes, nous recevons chaque mois plusieurs dizaines de demandes d’entrepreneurs souhaitant lancer leur propre marque cosmétique. Parmi eux, une proportion importante arrive avec un projet de formulation sur mesure : un actif précis, un dosage particulier, une vision produit très définie.</Texte>
                <Texte>Nous avons voulu mesurer objectivement ce qu’il advient de ces projets.</Texte>
              </div>
            </Carte>
            <Carte>
              <TitreCarte>Méthodologie</TitreCarte>
              <div className="mt-4 space-y-4">
                <Texte>Nous avons constitué un échantillon de 30 porteurs de projets ayant les caractéristiques suivantes :</Texte>
                <ListeCoches elements={[
                  "Ils nous ont contactés avec un projet de marque cosmétique",
                  "Ils avaient un nom de marque défini",
                  "Ils souhaitaient une formulation sur mesure avec des ingrédients spécifiques",
                  "Ils n’ont pas fait appel à nos services",
                ]} />
                <Texte>Nous avons effectué un suivi 7 mois après leur prise de contact initiale pour savoir s’ils avaient effectivement lancé leur marque (critère : mise en vente effective d’au moins un produit).</Texte>
              </div>
            </Carte>
          </div>
        </div>
      </Bande>

      {/* ═══ LE RÉSULTAT ═══ */}
      <Bande>
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-foreground text-background rounded-2xl px-6 py-12 md:p-14 text-center">
            <p className="text-xs tracking-[0.3em] uppercase opacity-70">Le résultat</p>
            <p className="mt-5 text-[64px] md:text-[96px] leading-none tracking-tight" style={BRICOLAGE_LEGER}>9 sur 10</p>
            <p className="mt-5 text-[1.125rem] md:text-[1.25rem] max-w-lg mx-auto leading-relaxed text-pretty" style={BRICOLAGE_LEGER}>
              n’avaient toujours pas lancé leur marque 7&nbsp;mois après.
            </p>
            <p className="mt-6 text-[0.9375rem] opacity-70 max-w-md mx-auto leading-relaxed text-pretty">
              Pas un produit vendu. Pas un site en ligne. Des porteurs de projets motivés, avec une vision claire et une formulation précise en tête, et pourtant rien.
            </p>
          </div>

          <Entete className="mt-16 md:mt-20 mb-10" surtitre="Les projets lancés"
            noir="Et les rares projets" gris={"qui ont vu le jour ?"}
            texte="Quant aux rares projets qui ont effectivement vu le jour, le constat n’est guère plus encourageant." />
          <div className="max-w-[720px] mx-auto space-y-4">
            <Carte gris>
              <TitreCarte sousTitre="Premier cas">Des produits fabriqués en Chine</TitreCarte>
              <div className="mt-4 space-y-4">
                <Texte>Sur les quelques porteurs de projets de notre échantillon qui ont réussi à lancer, nous avons pu constater que certains commercialisaient des produits fabriqués en Chine. Ce qui en soi ne signifie pas que les produits sont de mauvaise qualité. La Chine est aujourd’hui un pays qui développe de bons produits cosmétiques.</Texte>
                <Texte>Mais elle souffre d’une image de marque défavorable auprès du consommateur européen, qui l’associe encore à de la mauvaise qualité, à tort ou à raison. Et cette perception affecte directement les ventes, en particulier lorsqu’il s’agit de produits qui touchent à la peau ou aux cheveux. La confiance est tout simplement moins élevée, encore plus lorsqu’il s’agit d’une jeune marque inconnue.</Texte>
                <Texte>Nous avons également pu constater que les comptes Instagram de ces marques ne renvoyaient pas une image premium. Or, quand on est une jeune marque, il est impératif de mettre la barre haute dès le départ. Vos produits seront positionnés à peu près au même niveau de prix que ceux de multinationales qui ont des budgets de communication considérables. Si en plus votre image de marque ne respire pas la qualité et que la mention « made in China » figure sur vos produits, le client n’a strictement aucune raison de vous choisir plutôt qu’une marque établie.</Texte>
              </div>
            </Carte>
            <Carte gris>
              <TitreCarte sousTitre="Deuxième cas">Une marque française piégée par son stock</TitreCarte>
              <div className="mt-4 space-y-4">
                <Texte>Nous avons observé une marque basée en France qui a effectivement réussi à se lancer. Les produits étaient fabriqués localement, ce qui est un bon point. Mais en regardant de plus près, les réseaux sociaux de la marque semblaient morts : peu de contenu, aucune dynamique, une image qui manquait cruellement de moyens.</Texte>
                <Texte>Tout laissait penser que la créatrice avait investi la quasi-totalité de son budget dans l’achat de stock et qu’il ne restait plus rien pour la communication. C’est exactement le piège que nous décrivons dans les blocages financiers : le stock est là, les produits existent, mais personne ne les connaît. La marque est lancée sur le papier, mais elle est invisible aux yeux des clients.</Texte>
              </div>
            </Carte>
          </div>
          <Texte className="mt-8 max-w-[720px] mx-auto">
            Ces projets, bien qu’ils aient réussi à se lancer, semblent (en termes d’acquisition client et d’image de marque) ne pas aller dans la voie du succès. Ce qui renforce notre constat : <strong className="text-foreground">sortir un produit ne suffit pas. Il faut sortir le bon produit, avec la bonne image, les bonnes certifications et le bon positionnement</strong> pour avoir une chance dans un marché aussi concurrentiel.
          </Texte>
        </div>
      </Bande>

      {/* ═══ LES FACTEURS D’ÉCHEC ═══ */}
      <Bande gris>
        <div className="max-w-[768px] mx-auto px-6">
          <Entete className="mb-10" surtitre="Analyse des facteurs d’échec"
            noir="Trois grandes catégories" gris="de blocage."
            texte="En étudiant ces 30 parcours, nous avons identifié trois grandes catégories de blocage." />

          <div className="space-y-12">
            <Categorie numero="Catégorie 1" titre="Les blocages financiers" icone={CircleDollarSign}>
              <Facteur titre="Le coût d’entrée des laboratoires">
                <Texte>Quand on veut une formulation sur mesure avec des ingrédients nobles certifiés, les laboratoires imposent des minimums de commande élevés : généralement 500 à 1 000 unités par référence. Pour une gamme de 4 produits, cela représente 2 000 à 4 000 unités dès le départ, soit <strong className="text-foreground">un investissement lourd</strong>, rien que pour le stock.</Texte>
                <Texte>Bien sûr, certains créateurs trouvent des laboratoires qui acceptent de petites quantités. Mais très souvent, cela n’est possible qu’avec des produits qui ne répondent pas aux standards de qualité qu’exige le marché actuel.</Texte>
                <Texte>Car un bon produit cosmétique, c’est un produit :</Texte>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {SANS.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-[0.9375rem] text-foreground">
                      <span className="w-5 h-5 shrink-0 rounded-full bg-foreground flex items-center justify-center">
                        <X className="h-2.5 w-2.5 text-background" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Texte>C’est aussi un produit à base d’ingrédients 100 % naturels, aux parfums véganes, certifié Bio & Végan avec des formulations validées par des organismes indépendants (ECOCERT / COSMOS), enregistré au CPNP pour la conformité européenne, conforme aux bonnes pratiques de fabrication ISO 22716 et FDA, non testé sur les animaux et conditionné dans un packaging 100 % recyclable.</Texte>
                <Texte>Le consommateur d’aujourd’hui vérifie les certifications, lit les compositions, compare les labels. Arriver sur le marché sans cocher ces cases, c’est partir avec un désavantage majeur face à des marques qui les cochent toutes.</Texte>
              </Facteur>
              <Facteur titre="Le déséquilibre budgétaire">
                <Texte>La majorité des créateurs investissent jusqu’à <strong className="text-foreground">90 % de leur budget</strong> dans l’achat de stock. Une fois la marque lancée, il ne reste plus rien pour se faire connaître. Sans budget marketing, sans visibilité, pas de ventes. Le stock dort, la trésorerie fond, et le projet s’arrête.</Texte>
                <Texte>C’est un cercle vicieux : plus le créateur veut un produit premium, plus le stock coûte cher, et moins il lui reste pour le commercialiser. Or, dans le marché cosmétique actuel, le meilleur produit du monde ne se vend pas tout seul.</Texte>
              </Facteur>
              <Facteur titre="Le risque de stock invendu">
                <Texte>Se retrouver avec 2 000 à 4 000 produits qu’on n’est pas sûr d’écouler représente un risque financier considérable, surtout pour un premier lancement. Beaucoup de projets meurent avec des cartons entiers de produits invendus, non pas parce que le produit est mauvais, mais parce que le créateur n’a jamais eu les moyens de le faire connaître.</Texte>
              </Facteur>
            </Categorie>

            <Categorie numero="Catégorie 2" titre="Les blocages opérationnels" icone={FlaskConical}>
              <Facteur titre="La fabrication interminable">
                <Texte>Trouver la bonne formule, le bon dosage, le bon équilibre entre efficacité et stabilité. Certains de nos prospects avaient passé huit mois, un an, parfois des années en allers-retours avec des laboratoires, sans jamais réussir à finaliser un seul produit. Chaque itération demande des tests de stabilité, des ajustements, des validations. Le produit parfait n’arrive jamais, et pendant ce temps, le projet n’avance pas.</Texte>
              </Facteur>
              <Facteur titre="La chaîne de prestataires">
                <Texte>Il ne suffit pas de trouver un bon laboratoire. Il faut aussi le bon designer pour le packaging, le bon photographe pour les visuels, le bon développeur pour le site e‑commerce, le bon logisticien pour les expéditions. Si un seul maillon est faible, c’est toute l’image de marque qui en souffre. Chaque prestataire impose ses propres contraintes : minimums de commande, délais, tarifs, allers-retours. Le parcours devient un véritable parcours du combattant.</Texte>
              </Facteur>
              <Facteur titre="Les certifications">
                <Texte>COSMOS, ECOCERT, FDA, CPNP, ISO 22716, packaging recyclable, sans parabènes, sans silicones, sans microplastiques. Cocher toutes ces cases par soi-même, ça prend des années. Et plus on est exigeant sur la qualité (ce qui devrait être le cas de tout créateur sérieux), plus c’est long et coûteux. La réglementation cosmétique européenne (Règlement CE n°1223/2009) est rigoureuse, et c’est une bonne chose pour le consommateur, mais c’est un obstacle de taille pour un entrepreneur isolé.</Texte>
              </Facteur>
            </Categorie>

            <Categorie numero="Catégorie 3" titre="Les blocages comportementaux" icone={Brain}>
              <Facteur titre="La procrastination">
                <Texte>Des projets qui restent à l’état d’idée pendant des mois, parce que la complexité du parcours pousse à toujours remettre à demain. Face à l’accumulation des tâches (trouver un labo, valider une formule, choisir un packaging, créer un site, obtenir des certifications), la motivation initiale s’érode et l’inertie s’installe.</Texte>
              </Facteur>
              <Facteur titre="Le biais de l’actif : quand l’ingrédient devient plus important que le résultat">
                <Texte>C’est sans doute la découverte la plus marquante de notre étude.</Texte>
                <Texte>Lorsque nous demandions à ces entrepreneurs s’ils lançaient leur marque pour proposer des actifs spécifiques ou pour traiter un problème de peau, la réponse était quasi systématiquement centrée sur l’actif, pas sur le résultat.</Texte>
                <div className="bg-secondary rounded-xl p-4 md:p-5 space-y-2 text-[0.9375rem] md:text-base text-foreground">
                  <p>« Je veux absolument de l’huile de marula. »</p>
                  <p>« Il me faut du rétinol dans ma formule. »</p>
                  <p>« Je ne lancerai rien sans cet actif précis. »</p>
                </div>
                <Texte>Or, quand on veut traiter un problème (l’anti-âge, l’hydratation, l’hyperpigmentation, le soin des cheveux), il existe de nombreux actifs qui permettent d’obtenir des résultats. Personne n’a le monopole d’un ingrédient que les autres n’auraient pas.</Texte>
                <Texte>Pour le client final, le plus important, c’est que <strong className="text-foreground">le produit fonctionne</strong>. Pas la liste des actifs sur l’étiquette.</Texte>
                <Texte>Un sérum anti-âge avec du bakuchiol (alternative naturelle au rétinol) peut être tout aussi efficace qu’une formulation sur mesure au rétinol. La différence ? Le premier peut être lancé en 15 jours sans stock. Le second prendra 12 mois et un stock payé d’avance avant de voir le jour, s’il voit le jour.</Texte>
              </Facteur>
            </Categorie>
          </div>
        </div>
      </Bande>

      {/* ═══ SYNTHÈSE ═══ */}
      <Bande>
        <div className="max-w-4xl mx-auto px-6">
          <Entete className="mb-10" surtitre="Synthèse"
            noir="Huit facteurs d’échec," gris="en un coup d’œil." />
          <div className="rounded-2xl bg-secondary overflow-hidden">
            <div className="hidden lg:grid grid-cols-[150px_1fr_1.3fr] gap-6 px-6 pt-5 pb-3 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
              <span>Catégorie</span><span>Facteur</span><span>Impact</span>
            </div>
            <ul className="divide-y divide-background">
              {SYNTHESE.map((f) => (
                <li key={f.facteur} className="grid lg:grid-cols-[150px_1fr_1.3fr] gap-x-6 gap-y-1.5 px-6 py-4 lg:items-center">
                  <span><span className="inline-block bg-background rounded-full px-3 py-1 text-[12px] text-foreground">{f.categorie}</span></span>
                  <span className="text-[0.9375rem] font-medium text-foreground">{f.facteur}</span>
                  <span className="text-[0.9375rem] text-muted-foreground text-pretty">{f.impact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Bande>

      {/* ═══ CONCLUSION ═══ */}
      <Bande gris>
        <div className="max-w-4xl mx-auto px-6">
          <Entete className="mb-10" surtitre="Conclusion"
            noir="Le sur-mesure dès le départ" gris="bloque plus qu’il ne sert." />
          <div className="max-w-[720px] mx-auto space-y-4">
            <Texte>Notre étude montre que le choix de la formulation sur mesure dès le lancement est, dans la grande majorité des cas, un choix qui bloque le projet plutôt que de le servir. Non pas parce que le sur-mesure est mauvais en soi, mais parce qu’il exige des moyens financiers, du temps et un niveau de maturité que la plupart des porteurs de projets n’ont pas au moment du lancement.</Texte>
            <Texte>Les blocages financiers empêchent de se faire connaître. Les blocages opérationnels retardent indéfiniment la mise sur le marché. Et les blocages comportementaux, notamment le biais de l’actif, poussent les créateurs à prendre des décisions irrationnelles qui condamnent leur projet avant même qu’il ne naisse.</Texte>
            <Texte>Même parmi les rares projets qui ont vu le jour, les signaux ne sont pas encourageants : des produits fabriqués en Chine qui souffrent d’un déficit de confiance auprès du consommateur européen, des images de marque qui ne sont pas au niveau, ou des créateurs piégés par leur stock sans budget pour communiquer.</Texte>
          </div>
          <Carte className="max-w-[720px] mx-auto my-8">
            <Texte>Bien entendu, nous ne disons pas qu’il est impossible de réussir avec une formulation unique. Il y a des projets qui ont réussi avec cette approche, et nous vous le souhaitons sincèrement, même si vous ne passez pas par nous. Cet article n’a pas pour but de promouvoir nos services, mais de vous alerter sur des difficultés réelles que nous avons observées. Si la formulation sur mesure est ce qui vous intéresse le plus, nous vous souhaitons le meilleur dans cette démarche. Vous pouvez réussir avec cette approche. Mais il y a des pièges propres à ce parcours, dans lesquels beaucoup tombent. L’objectif de cette étude est simplement que vous en soyez conscient pour pouvoir les éviter.</Texte>
          </Carte>
          <div className="max-w-[720px] mx-auto space-y-4">
            <Texte>Pour ceux qui souhaitent une approche plus progressive, la stratégie la plus rationnelle reste de <strong className="text-foreground">commencer par lancer avec des produits existants, certifiés et de qualité</strong>, qui traitent la même problématique que celle que vous visez. Se constituer une clientèle, valider le marché, générer des ventes. Et compléter ensuite sa gamme avec du sur-mesure, quand les moyens et le recul le permettent.</Texte>
            <Texte>C’est cette conviction, née de l’observation de dizaines de projets avortés, qui est à l’origine de Biolystes.</Texte>
          </div>
        </div>
      </Bande>

      {/* ═══ PASSEZ À L’ACTION ═══ */}
      <Bande>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Entete surtitre="Passez à l’action"
            noir="Lancez votre marque" gris={"bio et végane en 15 jours."}
            texte="Découvrez notre catalogue, composez votre gamme parmi nos formulations certifiées, et testez vos produits avant de vous engager." />
          <BoutonsAction className="mt-10" />
          <p className="mt-14 text-[0.8125rem] text-muted-foreground leading-relaxed max-w-xl mx-auto text-pretty">
            Méthodologie : étude interne réalisée par Biolystes sur un échantillon de 30 porteurs de projets ayant souhaité lancer une marque cosmétique avec formulation sur mesure, sans faire appel à nos services. Suivi réalisé sur une période de 7 mois après la prise de contact initiale. Critère de lancement : mise en vente effective d’au moins un produit.
          </p>
        </div>
      </Bande>
    </>
  );
}
