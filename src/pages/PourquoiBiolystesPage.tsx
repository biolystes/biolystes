import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, Warehouse, FlaskConical, Users, Timer, Award, Eye, TrendingDown, DollarSign, Package, Brain, Target } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const CTA_URL = "https://app.iclosed.io/e/paylystes/r2";

const failureFactors = [
  { category: "Financier", factor: "Coût d'entrée des laboratoires", impact: "15 000 à 20 000€ minimum pour 4 produits" },
  { category: "Financier", factor: "Déséquilibre budgétaire", impact: "90% du budget dans le stock, rien pour le marketing" },
  { category: "Financier", factor: "Risque de stock invendu", impact: "Des milliers de produits sans moyen de les vendre" },
  { category: "Opérationnel", factor: "Fabrication interminable", impact: "Des mois, parfois des années d'allers-retours" },
  { category: "Opérationnel", factor: "Chaîne de prestataires", impact: "Chaque maillon faible compromet l'ensemble" },
  { category: "Opérationnel", factor: "Certifications", impact: "Des années pour tout obtenir seul" },
  { category: "Comportemental", factor: "Procrastination", impact: "La complexité paralyse l'action" },
  { category: "Comportemental", factor: "Biais de l'actif", impact: "L'ingrédient prime sur le résultat client" },
];

const categoryColors: Record<string, string> = {
  Financier: "bg-background text-foreground/80 text-[11px]",
  Opérationnel: "bg-background text-foreground/80 text-[11px]",
  Comportemental: "bg-background text-foreground/80 text-[11px]",
};

function SectionBlock({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className={className}>
      {children}
    </motion.div>
  );
}

export default function PourquoiBiolystesPage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionBlock>
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-destructive/10 text-destructive text-sm font-semibold mb-8">
              <AlertTriangle className="w-4 h-4" />
              Étude interne Biolystes
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.1] mb-6"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              <span className="font-bold">92%</span> des porteurs de projets cosmétiques sur mesure n'ont toujours pas lancé leur marque <span className="font-bold">7 mois après.</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-sm text-muted-foreground max-w-xl mx-auto">
              Étude interne Biolystes — Échantillon de 30 porteurs de projets — Suivi sur 7 mois
            </motion.p>
          </SectionBlock>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 space-y-16">
        {/* Contexte */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">Contexte de l'étude</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-foreground/80 leading-relaxed">
            Chez Biolystes, nous recevons chaque mois des dizaines de demandes d'entrepreneurs souhaitant lancer leur propre marque cosmétique. Parmi eux, une proportion importante arrive avec un projet de formulation sur mesure : un actif précis, un dosage particulier, une vision produit très définie.
          </motion.p>
          <motion.p variants={fadeUp} custom={2} className="text-foreground/80 leading-relaxed mt-4">
            Nous avons voulu mesurer objectivement ce qu'il advient de ces projets.
          </motion.p>
        </SectionBlock>

        {/* Méthodologie */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">Méthodologie</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="bg-secondary rounded-2xl p-6 md:p-8">
            <p className="text-foreground/80 leading-relaxed mb-4">Nous avons constitué un échantillon de 30 porteurs de projets ayant les caractéristiques suivantes :</p>
            <ul className="space-y-2 text-foreground/80">
              {[
                "Ils nous ont contactés avec un projet de marque cosmétique",
                "Ils avaient un nom de marque défini",
                "Ils souhaitaient une formulation sur mesure avec des ingrédients spécifiques",
                "Ils n'ont pas fait appel à nos services",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-foreground/80 leading-relaxed mt-4">
              Nous avons effectué un suivi 7 mois après leur prise de contact initiale pour savoir s'ils avaient effectivement lancé leur marque (critère : mise en vente effective d'au moins un produit).
            </p>
          </motion.div>
        </SectionBlock>

        {/* Résultat principal */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="bg-foreground text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <p className="text-6xl md:text-8xl font-bold mb-4">92%</p>
            <p className="text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto opacity-80">
              n'avaient toujours pas lancé leur marque 7 mois après.
            </p>
            <p className="mt-6 text-sm opacity-60 max-w-md mx-auto">
              Pas un produit vendu. Pas un site en ligne. Des porteurs de projets motivés, avec une vision claire et une formulation précise en tête — et pourtant, rien.
            </p>
          </motion.div>
        </SectionBlock>

        {/* Les 8% */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-6">Et les 8% qui ont lancé ?</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-foreground/80 leading-relaxed mb-8">
            Quant aux rares projets qui ont effectivement vu le jour, le constat n'est guère plus encourageant.
          </motion.p>

          {/* Cas 1 */}
          <motion.div variants={fadeUp} custom={2} className="bg-secondary rounded-2xl p-6 md:p-8 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Premier cas : des produits fabriqués en Chine</h3>
            <div className="space-y-4 text-foreground/80 leading-relaxed text-[15px]">
              <p>Sur les quelques porteurs de projets de notre échantillon qui ont réussi à lancer, nous avons pu constater que certains commercialisaient des produits fabriqués en Chine. Ce qui en soi ne signifie pas que les produits sont de mauvaise qualité. La Chine est aujourd'hui un pays qui développe de bons produits cosmétiques.</p>
              <p>Mais elle souffre d'une image de marque défavorable auprès du consommateur européen, qui l'associe encore à de la mauvaise qualité — à tort ou à raison. Et cette perception affecte directement les ventes, en particulier lorsqu'il s'agit de produits qui touchent à la peau ou aux cheveux. La confiance est tout simplement moins élevée, encore plus lorsqu'il s'agit d'une jeune marque inconnue.</p>
              <p>Nous avons également pu constater que les comptes Instagram de ces marques ne renvoyaient pas une image premium. Or, quand on est une jeune marque, il est impératif de mettre la barre haute dès le départ. Vos produits seront positionnés à peu près au même niveau de prix que ceux de multinationales qui ont des budgets de communication considérables. Si en plus votre image de marque ne respire pas la qualité et que la mention "made in China" figure sur vos produits, le client n'a strictement aucune raison de vous choisir plutôt qu'une marque établie.</p>
            </div>
          </motion.div>

          {/* Cas 2 */}
          <motion.div variants={fadeUp} custom={3} className="bg-secondary rounded-2xl p-6 md:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-3">Deuxième cas : une marque française piégée par son stock</h3>
            <div className="space-y-4 text-foreground/80 leading-relaxed text-[15px]">
              <p>Nous avons observé une marque basée en France qui a effectivement réussi à se lancer. Les produits étaient fabriqués localement, ce qui est un bon point. Mais en regardant de plus près, les réseaux sociaux de la marque semblaient morts : peu de contenu, aucune dynamique, une image qui manquait cruellement de moyens.</p>
              <p>Tout laissait penser que la créatrice avait investi la quasi-totalité de son budget dans l'achat de stock et qu'il ne restait plus rien pour la communication. C'est exactement le piège que nous décrivons dans les blocages financiers : le stock est là, les produits existent, mais personne ne les connaît. La marque est lancée sur le papier, mais elle est invisible aux yeux des clients.</p>
            </div>
          </motion.div>

          <motion.p variants={fadeUp} custom={4} className="text-foreground/80 leading-relaxed mt-6 text-[15px]">
            Ces projets, bien qu'ils aient réussi à se lancer, semblent — en termes d'acquisition client et d'image de marque — ne pas aller dans la voie du succès. Ce qui renforce notre constat : <strong className="text-foreground">sortir un produit ne suffit pas. Il faut sortir le bon produit, avec la bonne image, les bonnes certifications et le bon positionnement</strong> pour avoir une chance dans un marché aussi concurrentiel.
          </motion.p>
        </SectionBlock>

        {/* Analyse des facteurs d'échec */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">Analyse des facteurs d'échec</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-foreground/80 leading-relaxed mb-8">
            En étudiant ces 30 parcours, nous avons identifié trois grandes catégories de blocage.
          </motion.p>
        </SectionBlock>

        {/* Catégorie 1 — Financiers */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-red-700" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Catégorie 1 — Les blocages financiers</h3>
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="space-y-6">
            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <h4 className="font-semibold text-foreground mb-3">Le coût d'entrée des laboratoires</h4>
              <div className="space-y-4 text-foreground/80 leading-relaxed text-[15px]">
                <p>Quand on veut une formulation sur mesure avec des ingrédients nobles certifiés, les laboratoires imposent des minimums de commande élevés : généralement 500 à 1 000 unités par référence. Pour une gamme de 4 produits, cela représente 2 000 à 4 000 unités dès le départ, soit un investissement de <strong className="text-foreground">15 000 à 20 000€</strong> — rien que pour le stock.</p>
                <p>Bien sûr, certains créateurs trouvent des laboratoires qui acceptent de petites quantités. Mais très souvent, cela n'est possible qu'avec des produits qui ne répondent pas aux standards de qualité qu'exige le marché actuel.</p>
                <p>Car un bon produit cosmétique, c'est un produit :</p>
                <div className="grid grid-cols-2 gap-2 my-4">
                  {["Sans parabènes", "Sans silicones", "Sans PEG", "Sans filtres UV chimiques", "Sans microplastiques", "Sans colorants artificiels", "Sans phosphates", "Sans conservateurs synthétiques"].map((item) => (
                    <span key={item} className="flex items-center gap-2 text-sm">
                      <span className="text-destructive font-bold">✕</span> {item}
                    </span>
                  ))}
                </div>
                <p>C'est aussi un produit à base d'ingrédients 100% naturels, aux parfums véganes, certifié Bio & Végan avec des formulations validées par des organismes indépendants (ECOCERT / COSMOS), enregistré au CPNP pour la conformité européenne, conforme aux bonnes pratiques de fabrication ISO 22716 et FDA, non testé sur les animaux et conditionné dans un packaging 100% recyclable.</p>
                <p>Le consommateur d'aujourd'hui vérifie les certifications, lit les compositions, compare les labels. Arriver sur le marché sans cocher ces cases, c'est partir avec un désavantage majeur face à des marques qui les cochent toutes.</p>
              </div>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <h4 className="font-semibold text-foreground mb-3">Le déséquilibre budgétaire</h4>
              <div className="space-y-4 text-foreground/80 leading-relaxed text-[15px]">
                <p>La majorité des créateurs investissent jusqu'à <strong className="text-foreground">90% de leur budget</strong> dans l'achat de stock. Une fois la marque lancée, il ne reste plus rien pour se faire connaître. Sans budget marketing, sans visibilité, pas de ventes. Le stock dort, la trésorerie fond, et le projet s'arrête.</p>
                <p>C'est un cercle vicieux : plus le créateur veut un produit premium, plus le stock coûte cher, et moins il lui reste pour le commercialiser. Or, dans le marché cosmétique actuel, le meilleur produit du monde ne se vend pas tout seul.</p>
              </div>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <h4 className="font-semibold text-foreground mb-3">Le risque de stock invendu</h4>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Se retrouver avec 2 000 à 4 000 produits qu'on n'est pas sûr d'écouler représente un risque financier considérable, surtout pour un premier lancement. Beaucoup de projets meurent avec des cartons entiers de produits invendus, non pas parce que le produit est mauvais, mais parce que le créateur n'a jamais eu les moyens de le faire connaître.
              </p>
            </div>
          </motion.div>
        </SectionBlock>

        {/* Catégorie 2 — Opérationnels */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Catégorie 2 — Les blocages opérationnels</h3>
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="space-y-6">
            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <h4 className="font-semibold text-foreground mb-3">La fabrication interminable</h4>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Trouver la bonne formule, le bon dosage, le bon équilibre entre efficacité et stabilité. Certains de nos prospects avaient passé huit mois, un an, parfois des années en allers-retours avec des laboratoires, sans jamais réussir à finaliser un seul produit. Chaque itération demande des tests de stabilité, des ajustements, des validations. Le produit parfait n'arrive jamais, et pendant ce temps, le projet n'avance pas.
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <h4 className="font-semibold text-foreground mb-3">La chaîne de prestataires</h4>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Il ne suffit pas de trouver un bon laboratoire. Il faut aussi le bon designer pour le packaging, le bon photographe pour les visuels, le bon développeur pour le site e-commerce, le bon logisticien pour les expéditions. Si un seul maillon est faible, c'est toute l'image de marque qui en souffre. Chaque prestataire impose ses propres contraintes : minimums de commande, délais, tarifs, allers-retours. Le parcours devient un véritable parcours du combattant.
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <h4 className="font-semibold text-foreground mb-3">Les certifications</h4>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                COSMOS, ECOCERT, FDA, CPNP, ISO 22716, packaging recyclable, sans parabènes, sans silicones, sans microplastiques. Cocher toutes ces cases par soi-même, ça prend des années. Et plus on est exigeant sur la qualité — ce qui devrait être le cas de tout créateur sérieux — plus c'est long et coûteux. La réglementation cosmétique européenne (Règlement CE n°1223/2009) est rigoureuse, et c'est une bonne chose pour le consommateur, mais c'est un obstacle de taille pour un entrepreneur isolé.
              </p>
            </div>
          </motion.div>
        </SectionBlock>

        {/* Catégorie 3 — Comportementaux */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Brain className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Catégorie 3 — Les blocages comportementaux</h3>
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="space-y-6">
            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <h4 className="font-semibold text-foreground mb-3">La procrastination</h4>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Des projets qui restent à l'état d'idée pendant des mois, parce que la complexité du parcours pousse à toujours remettre à demain. Face à l'accumulation des tâches — trouver un labo, valider une formule, choisir un packaging, créer un site, obtenir des certifications — la motivation initiale s'érode et l'inertie s'installe.
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <h4 className="font-semibold text-foreground mb-3">Le biais de l'actif : quand l'ingrédient devient plus important que le résultat</h4>
              <div className="space-y-4 text-foreground/80 leading-relaxed text-[15px]">
                <p>C'est sans doute la découverte la plus marquante de notre étude.</p>
                <p>Lorsque nous demandions à ces entrepreneurs s'ils lançaient leur marque pour proposer des actifs spécifiques ou pour traiter un problème de peau, la réponse était quasi systématiquement centrée sur l'actif, pas sur le résultat.</p>
                <div className="bg-background rounded-xl p-4 border border-border space-y-2 italic text-foreground/70">
                  <p>« Je veux absolument de l'huile de marula. »</p>
                  <p>« Il me faut du rétinol dans ma formule. »</p>
                  <p>« Je ne lancerai rien sans cet actif précis. »</p>
                </div>
                <p>Or, quand on veut traiter un problème — l'anti-âge, l'hydratation, l'hyperpigmentation, le soin des cheveux — il existe de nombreux actifs qui permettent d'obtenir des résultats. Personne n'a le monopole d'un ingrédient que les autres n'auraient pas.</p>
                <p>Pour le client final, le plus important, c'est que <strong className="text-foreground">le produit fonctionne</strong>. Pas la liste des actifs sur l'étiquette.</p>
                <p>Un sérum anti-âge avec du bakuchiol (alternative naturelle au rétinol) peut être tout aussi efficace qu'une formulation sur mesure au rétinol. La différence ? Le premier peut être lancé en 15 jours sans stock. Le second prendra 12 mois et 20 000€ avant de voir le jour — s'il voit le jour.</p>
              </div>
            </div>
          </motion.div>
        </SectionBlock>

        {/* Tableau synthèse */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-6">Synthèse des facteurs d'échec</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-foreground text-primary-foreground">
                  <th className="text-left p-4 font-semibold">Catégorie</th>
                  <th className="text-left p-4 font-semibold">Facteur</th>
                  <th className="text-left p-4 font-semibold">Impact</th>
                </tr>
              </thead>
              <tbody>
                {failureFactors.map((f, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-secondary"}>
                    <td className="p-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[f.category]}`}>
                        {f.category}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-foreground">{f.factor}</td>
                    <td className="p-4 text-foreground/70">{f.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </SectionBlock>

        {/* Conclusion */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-6">Conclusion</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-6 text-foreground/80 leading-relaxed text-[15px]">
            <p>Notre étude montre que le choix de la formulation sur mesure dès le lancement est, dans la grande majorité des cas, un choix qui bloque le projet plutôt que de le servir. Non pas parce que le sur-mesure est mauvais en soi, mais parce qu'il exige des moyens financiers, du temps et un niveau de maturité que la plupart des porteurs de projets n'ont pas au moment du lancement.</p>
            <p>Les blocages financiers empêchent de se faire connaître. Les blocages opérationnels retardent indéfiniment la mise sur le marché. Et les blocages comportementaux, notamment le biais de l'actif, poussent les créateurs à prendre des décisions irrationnelles qui condamnent leur projet avant même qu'il ne naisse.</p>
            <p>Même parmi les rares projets qui ont vu le jour, les signaux ne sont pas encourageants : des produits fabriqués en Chine qui souffrent d'un déficit de confiance auprès du consommateur européen, des images de marque qui ne sont pas au niveau, ou des créateurs piégés par leur stock sans budget pour communiquer.</p>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="bg-secondary rounded-2xl p-6 md:p-8 mt-8 border-l-4 border-foreground/20">
            <p className="text-foreground/80 leading-relaxed text-[15px]">
              Bien entendu, nous ne disons pas qu'il est impossible de réussir avec une formulation unique. Il y a des projets qui ont réussi avec cette approche, et nous vous le souhaitons sincèrement, même si vous ne passez pas par nous. Cet article n'a pas pour but de promouvoir nos services, mais de vous alerter sur des difficultés réelles que nous avons observées. Si la formulation sur mesure est ce qui vous intéresse le plus, nous vous souhaitons le meilleur dans cette démarche. Vous pouvez réussir avec cette approche. Mais il y a des pièges propres à ce parcours, dans lesquels beaucoup tombent. L'objectif de cette étude est simplement que vous en soyez conscient pour pouvoir les éviter.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={3} className="mt-8 text-foreground/80 leading-relaxed text-[15px]">
            <p>Pour ceux qui souhaitent une approche plus progressive, la stratégie la plus rationnelle reste de <strong className="text-foreground">commencer par lancer avec des produits existants, certifiés et de qualité</strong>, qui traitent la même problématique que celle que vous visez. Se constituer une clientèle, valider le marché, générer des ventes. Et compléter ensuite sa gamme avec du sur-mesure, quand les moyens et le recul le permettent.</p>
            <p className="mt-4">C'est cette conviction, née de l'observation de dizaines de projets avortés, qui est à l'origine de Biolystes.</p>
          </motion.div>
        </SectionBlock>

        {/* CTA */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="bg-foreground text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <p className="text-lg md:text-xl font-light mb-6 opacity-90" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Lancez votre marque cosmétique bio et végane en 15 jours, clé en main.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={CTA_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary-foreground text-foreground font-medium text-sm hover:opacity-90 transition-opacity">
                Prendre rendez-vous <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/chat"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-primary-foreground/30 text-primary-foreground font-medium text-sm hover:bg-primary-foreground/10 transition-colors">
                Poser vos questions <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </SectionBlock>

        {/* Methodology note */}
        <SectionBlock>
          <motion.p variants={fadeUp} custom={0} className="text-xs text-muted-foreground leading-relaxed text-center max-w-xl mx-auto">
            Méthodologie : Étude interne réalisée par Biolystes sur un échantillon de 30 porteurs de projets ayant souhaité lancer une marque cosmétique avec formulation sur mesure, sans faire appel à nos services. Suivi réalisé sur une période de 7 mois après la prise de contact initiale. Critère de lancement : mise en vente effective d'au moins un produit.
          </motion.p>
        </SectionBlock>
      </div>
    </div>
  );
}
