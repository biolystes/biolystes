import { motion } from "framer-motion";
import { ArrowRight, Package, TrendingUp, ShoppingBag, Gift, Star } from "lucide-react";
import coffretsImg from "@/assets/coffrets-article.png";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const CTA_URL = "https://app.iclosed.io/e/paylystes/r2";

const coffrets = [
  { name: "Boîte de collection pour le teint clair", products: "Gel clarifiant + Crème anti-âge + Sérum huile rétinol", benefit: "Anti-acné et anti-âge" },
  { name: "Boîte de collection Éclat intemporel", products: "Démaquillant biphasé + Gel double boost + Crème anti-âge 15ml", benefit: "Hydratation et fermeté" },
  { name: "Boîte de collection Éclat rajeunissant", products: "Mousse purifiante + Sérum huile rétinol + Crème yeux", benefit: "Nettoyage et éclat" },
  { name: "Boîte de collection du trio anti-âge", products: "Crème anti-âge + Sérum peptides + Crème yeux 3-en-1", benefit: "Routine anti-âge complète" },
  { name: "Boîte de la collection Luminous Skin", products: "Démaquillant biphasé + Sérum collagène + Crème yeux", benefit: "Éclat et jeunesse" },
  { name: "Boîte de collection Trio Glowy Skin", products: "Lait démaquillant + Crème hydratante + Huile nourrissante", benefit: "Routine glow quotidienne" },
  { name: "Boîte de collection Hydratation profonde", products: "Gel double boost + Sérum hydratant", benefit: "Hydratation intense" },
  { name: "Boîte de collection Routine soin de la peau", products: "Mousse nettoyante + Sérum vitamine C + Crème anti-âge + Crème yeux", benefit: "Routine complète 4 produits" },
];

function SectionBlock({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} className={className}>
      {children}
    </motion.div>
  );
}

export default function ArticleCoffretsPage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionBlock>
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-foreground text-primary-foreground text-[11px] font-semibold mb-8">
              <Gift className="w-4 h-4" />
              Nouveauté catalogue
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.1] mb-6"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Désormais Biolystes propose des <span className="font-bold">coffrets clés en main.</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-sm text-muted-foreground max-w-xl mx-auto">
              Augmentez votre panier moyen et fidélisez vos clients avec des collections prêtes à vendre.
            </motion.p>
          </SectionBlock>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 space-y-16">
        {/* Image produit */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="rounded-2xl overflow-hidden bg-secondary flex items-center justify-center p-8">
            <img src={coffretsImg} alt="Coffrets Biolystes" className="max-h-[400px] object-contain" />
          </motion.div>
        </SectionBlock>

        {/* Le constat */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">Le constat</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-4 text-foreground/80 leading-relaxed text-[15px]">
            <p>
              Le panier moyen est l'un des leviers les plus puissants pour augmenter le chiffre d'affaires d'une marque cosmétique. Pourtant, la majorité des jeunes marques ne proposent que des produits à l'unité, sans offre structurée pour encourager l'achat multiple.
            </p>
            <p>
              Les coffrets cadeaux et les routines complètes répondent à un besoin concret du consommateur : ne pas avoir à choisir, bénéficier d'un ensemble cohérent, et offrir un produit qui a de l'allure.
            </p>
          </motion.div>
        </SectionBlock>

        {/* Pourquoi les coffrets */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-6">Pourquoi intégrer des coffrets à votre gamme</motion.h2>

          <motion.div variants={fadeUp} custom={1} className="space-y-6">
            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-foreground" />
                <h4 className="font-semibold text-foreground">Augmenter le panier moyen</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Un coffret de 3 produits se vend entre 80€ et 120€ en prix public, contre 25€ à 40€ pour un produit à l'unité. La valeur perçue est supérieure car le client a l'impression de faire une bonne affaire en achetant un ensemble plutôt que des produits séparés. Le panier moyen augmente mécaniquement de 2 à 3x.
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-5 h-5 text-foreground" />
                <h4 className="font-semibold text-foreground">Renforcer l'image de marque</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Un coffret bien présenté, avec un packaging soigné et une cohérence produit, positionne immédiatement votre marque comme premium. C'est aussi un excellent outil pour les périodes de fêtes, la Saint-Valentin, la fête des mères, ou comme cadeau d'entreprise.
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <ShoppingBag className="w-5 h-5 text-foreground" />
                <h4 className="font-semibold text-foreground">Fidéliser les clients</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Quand un client découvre 3 ou 4 produits d'un coup, il est beaucoup plus susceptible de racheter ses préférés à l'unité ensuite. Le coffret agit comme un échantillonnage premium qui crée de la fidélisation naturelle.
              </p>
            </div>
          </motion.div>
        </SectionBlock>

        {/* Les 8 coffrets */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-6">Nos 8 coffrets disponibles</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-4">
            {coffrets.map((c, i) => (
              <div key={i} className={`rounded-2xl p-6 ${i % 2 === 0 ? "bg-[hsl(60_30%_89%_/_0.44)]" : "bg-secondary"}`}>
                <h4 className="font-semibold text-foreground mb-2">{c.name}</h4>
                <p className="text-foreground/80 text-[15px] leading-relaxed mb-1">
                  <strong className="text-foreground">Contenu :</strong> {c.products}
                </p>
                <p className="text-foreground/60 text-sm">{c.benefit}</p>
              </div>
            ))}
          </motion.div>
        </SectionBlock>

        {/* Avantage Biolystes */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="bg-foreground text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <p className="text-6xl md:text-8xl font-bold mb-4">0</p>
            <p className="text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto opacity-80">
              minimum de commande. Commandez un seul coffret ou cent, sans stock à gérer.
            </p>
            <p className="mt-6 text-sm opacity-60 max-w-md mx-auto">
              Tous les coffrets sont certifiés Bio & Végan, COSMOS, ECOCERT. Packaging 100% recyclable, personnalisable à votre marque.
            </p>
          </motion.div>
        </SectionBlock>

        {/* Comment ça marche */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">Comment ça marche</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="bg-secondary rounded-2xl p-6 md:p-8">
            <ol className="space-y-4 text-foreground/80 leading-relaxed text-[15px]">
              {[
                "Vous choisissez les coffrets qui correspondent à votre positionnement",
                "Nos designers personnalisent le packaging à votre marque (logo, couleurs, identité)",
                "Votre client commande → nous fabriquons → nous livrons directement chez lui",
                "Vous n'avez aucun stock à gérer, aucune logistique à organiser",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-foreground text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </SectionBlock>

        {/* CTA */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="bg-foreground text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <p className="text-lg md:text-xl font-light mb-6 opacity-90" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Intégrez des coffrets à votre gamme dès aujourd'hui.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={CTA_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary-foreground text-foreground font-medium text-sm hover:opacity-90 transition-opacity">
                Prendre rendez-vous <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/catalogue"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-primary-foreground/30 text-primary-foreground font-medium text-sm hover:bg-primary-foreground/10 transition-colors">
                Voir le catalogue <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </SectionBlock>
      </div>
    </div>
  );
}
