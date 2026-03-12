import { motion } from "framer-motion";
import { ArrowRight, Brain, Lightbulb, Target, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const CTA_URL = "https://app.iclosed.io/e/paylystes/r2";

function SectionBlock({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className={className}>
      {children}
    </motion.div>
  );
}

export default function ArticleBiaisActifPage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionBlock>
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-foreground text-primary-foreground text-[11px] font-semibold mb-8">
              <Brain className="w-4 h-4" />
              Réflexion
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.1] mb-6"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Le biais de l'actif : pourquoi l'ingrédient <span className="font-bold">ne fait pas le produit.</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-sm text-muted-foreground max-w-xl mx-auto">
              Pour le client final, le plus important c'est que le produit fonctionne. Pas la liste des actifs sur l'étiquette.
            </motion.p>
          </SectionBlock>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 space-y-16">
        {/* Observation */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">L'observation qui a tout changé</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-4 text-foreground/80 leading-relaxed text-[15px]">
            <p>
              En accompagnant des dizaines de porteurs de projets cosmétiques, nous avons observé un schéma récurrent : la majorité des entrepreneurs sont obsédés par un ingrédient spécifique, au point de bloquer tout leur projet dessus.
            </p>
            <p>
              « Je veux absolument de l'huile de marula. » « Il me faut du rétinol dans ma formule. » « Je ne lancerai rien sans cet actif précis. »
            </p>
            <p>
              Cette obsession pour l'ingrédient est ce que nous appelons le <strong className="text-foreground">biais de l'actif</strong>. Et c'est l'une des principales raisons pour lesquelles tant de projets cosmétiques n'aboutissent jamais.
            </p>
          </motion.div>
        </SectionBlock>

        {/* Le biais expliqué */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-6">Le piège de l'ingrédient miracle</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-6">
            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <Lightbulb className="w-5 h-5 text-foreground" />
                <h4 className="font-semibold text-foreground">L'ingrédient n'est pas le produit</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Un ingrédient, aussi noble soit-il, ne fait pas un produit cosmétique. Un bon produit, c'est une formulation complète, équilibrée, stable, testée, certifiée, et présentée dans un packaging qui inspire confiance. L'ingrédient n'est qu'un des nombreux éléments qui contribuent au résultat final.
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-foreground" />
                <h4 className="font-semibold text-foreground">Le client ne raisonne pas comme le créateur</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Quand une cliente cherche un sérum anti-âge, elle ne pense pas « je veux du rétinol ». Elle pense « je veux moins de rides ». Le résultat est ce qui compte. Si un sérum au bakuchiol (alternative naturelle au rétinol) donne le même résultat, la cliente sera tout aussi satisfaite. Elle ne vérifie pas la liste INCI — elle vérifie si le produit fonctionne.
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-5 h-5 text-foreground" />
                <h4 className="font-semibold text-foreground">Le vrai différenciateur, c'est la marque</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Personne n'a le monopole d'un ingrédient. L'huile de marula, le rétinol, la vitamine C, l'acide hyaluronique — tous ces actifs sont disponibles pour tout le monde. Ce qui fait la différence entre une marque qui réussit et une qui échoue, ce n'est pas la formule. C'est le positionnement, l'image de marque, la capacité à se faire connaître et à créer une relation avec ses clients.
              </p>
            </div>
          </motion.div>
        </SectionBlock>

        {/* Comparaison */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="bg-foreground text-primary-foreground rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-3">Approche « ingrédient »</p>
                <ul className="space-y-2 text-sm opacity-80">
                  <li>✕ 12+ mois de développement</li>
                  <li>✕ 15 000 à 20 000€ de stock minimum</li>
                  <li>✕ Aucun budget restant pour le marketing</li>
                  <li>✕ 92% d'échec en 7 mois</li>
                </ul>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-3">Approche « résultat »</p>
                <ul className="space-y-2 text-sm opacity-80">
                  <li>✓ 15 jours pour lancer</li>
                  <li>✓ Zéro stock, zéro risque</li>
                  <li>✓ Budget libre pour le marketing</li>
                  <li>✓ 100+ marques lancées avec succès</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </SectionBlock>

        {/* Conclusion */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">L'approche rationnelle</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-4 text-foreground/80 leading-relaxed text-[15px]">
            <p>
              La stratégie la plus intelligente est de commencer par lancer avec des produits existants, certifiés et de qualité, qui traitent la même problématique que celle que vous visez. Se constituer une clientèle, valider le marché, générer des ventes.
            </p>
            <p>
              Et compléter ensuite sa gamme avec du sur-mesure, quand les moyens et le recul le permettent. C'est une approche progressive, pragmatique, qui maximise les chances de succès.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="bg-secondary rounded-2xl p-6 md:p-8 mt-8 border-l-4 border-foreground/20">
            <p className="text-foreground/80 leading-relaxed text-[15px]">
              Cet article n'a pas pour but de décourager la formulation sur mesure. Il a pour but de vous alerter sur un biais cognitif qui bloque de nombreux projets. Si vous êtes conscient de ce biais, vous serez mieux armé pour prendre des décisions rationnelles.
            </p>
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
                Trouver des produits <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </SectionBlock>
      </div>
    </div>
  );
}
