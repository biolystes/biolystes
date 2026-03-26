import { motion } from "framer-motion";
import { BadgeCheck, Leaf, FileCheck2, Award, Rabbit, Package, Check } from "lucide-react";
import InstaFeedSection from "@/components/InstaFeedSection";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const certifications = [
  { icon: BadgeCheck, title: "Certifié Bio & Végan", desc: "Formulations naturelles certifiées par des organismes indépendants." },
  { icon: Leaf, title: "ECOCERT / COSMOS", desc: "Standards écologiques européens et internationaux respectés." },
  { icon: FileCheck2, title: "Enregistré CPNP", desc: "Conformité totale aux normes européennes et britanniques." },
  { icon: Award, title: "ISO 22716 / FDA", desc: "Bonnes pratiques de fabrication, marché US inclus." },
  { icon: Rabbit, title: "Non testé sur animaux", desc: "Aucune expérimentation animale à aucun stade." },
  { icon: Package, title: "Packaging recyclable", desc: "Emballages conçus pour être 100% recyclables." },
];

const exclusions = [
  "Parabènes", "Silicones", "PEG", "Filtres UV chimiques",
  "Microplastiques", "Colorants artificiels", "Phosphates", "Conservateurs synthétiques",
];

const garanties = [
  "Ingrédients d'origine naturelle", "Parfums véganes", "Production à la demande",
  "Traçabilité complète", "Laboratoires certifiés", "Échantillons disponibles",
  "Aucun minimum de commande", "Expédition sous votre marque",
];

export default function QualitePage() {
  return (
    <div className="min-h-screen bg-secondary pt-[120px]">
      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-4 mb-16 text-center">
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="text-xs tracking-[0.3em] uppercase text-foreground">Nos engagements</motion.p>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground leading-relaxed">
              <b>Sans achat de stock</b>, des cosmétiques d'excellence, certifiés et responsables
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
              className="text-foreground max-w-xl mx-auto leading-relaxed">
              Tous nos produits sont formulés sans parabènes, sans silicones, sans PEG, sans filtres UV chimiques, sans microplastiques et sans colorants artificiels.
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {certifications.map((cert, i) => (
              <motion.div key={cert.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                className="bg-secondary p-5 rounded-xl">
                <div className="w-10 h-10 mb-3 rounded-full bg-background flex items-center justify-center">
                  <cert.icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                </div>
                <h4 className="text-xs font-semibold text-foreground mb-1">{cert.title}</h4>
                <p className="text-foreground text-xs leading-relaxed">{cert.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Retour client / InstaFeed */}
          <div className="mt-8 mb-8">
            <InstaFeedSection />
          </div>

          {/* Exclusions & Garanties */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="mt-16 grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-foreground mb-6">Nos formulations excluent</p>
              <div className="space-y-3">
                {exclusions.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center">
                      <span className="text-destructive text-xs font-bold">✕</span>
                    </div>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-foreground mb-6">Ce que nous garantissons</p>
              <div className="space-y-3">
                {garanties.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-foreground shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
