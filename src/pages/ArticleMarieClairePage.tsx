import { motion } from "framer-motion";
import { ArrowRight, Newspaper, Globe, Users, TrendingUp, Eye } from "lucide-react";
import marieClaireLogo from "@/assets/marie-claire-logo.jpg";

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

export default function ArticleMarieClairePage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionBlock>
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-foreground text-primary-foreground text-[11px] font-semibold mb-8">
              <Newspaper className="w-4 h-4" />
              Réseau presse
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.1] mb-6"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Accédez à notre réseau presse <span className="font-bold">Marie Claire.</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-sm text-muted-foreground max-w-xl mx-auto">
              Faites connaître votre marque grâce à des articles sponsorisés dans l'un des plus grands magazines féminins au monde.
            </motion.p>
          </SectionBlock>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 space-y-16">
        {/* Logo Marie Claire */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="rounded-2xl overflow-hidden bg-secondary flex items-center justify-center p-12">
            <img src={marieClaireLogo} alt="Marie Claire" className="max-h-[200px] object-contain" />
          </motion.div>
        </SectionBlock>

        {/* Le problème */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">Le défi de la visibilité</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-4 text-foreground/80 leading-relaxed text-[15px]">
            <p>
              Quand on lance une marque cosmétique, le plus grand défi n'est pas le produit. C'est la visibilité. Avoir un excellent produit ne sert à rien si personne ne le connaît. Et les canaux classiques — réseaux sociaux, publicité payante — prennent du temps à produire des résultats.
            </p>
            <p>
              La presse reste l'un des leviers les plus puissants pour installer la crédibilité d'une marque. Un article dans un magazine reconnu crée une légitimité immédiate que des mois de publications Instagram ne peuvent pas égaler.
            </p>
          </motion.div>
        </SectionBlock>

        {/* Marie Claire en chiffres */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="bg-foreground text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <p className="text-6xl md:text-8xl font-bold mb-4">3M+</p>
            <p className="text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto opacity-80">
              de lectrices mensuelles, une audience qualifiée, passionnée par la beauté et le bien-être.
            </p>
            <p className="mt-6 text-sm opacity-60 max-w-md mx-auto">
              Marie Claire est une référence incontournable de la presse féminine depuis plus de 80 ans. Être mentionné dans ses pages, c'est un signal de confiance fort pour vos futurs clients.
            </p>
          </motion.div>
        </SectionBlock>

        {/* Ce que ça change */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-6">Ce que ça change pour votre marque</motion.h2>

          <motion.div variants={fadeUp} custom={1} className="space-y-6">
            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-5 h-5 text-foreground" />
                <h4 className="font-semibold text-foreground">Crédibilité instantanée</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Un article sponsorisé dans Marie Claire positionne votre marque aux côtés des plus grands noms de la beauté. Pour une jeune marque, c'est un accélérateur de confiance considérable. Vos clients potentiels voient votre marque dans un contexte premium, ce qui facilite la conversion.
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-foreground" />
                <h4 className="font-semibold text-foreground">Visibilité SEO durable</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Un article en ligne sur marieclaire.fr reste indexé par Google. Contrairement à une story Instagram qui disparaît en 24h ou une pub Meta qui s'arrête quand le budget est épuisé, un article de presse continue de générer du trafic et de la crédibilité pendant des mois, voire des années.
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-5 h-5 text-foreground" />
                <h4 className="font-semibold text-foreground">Audience ultra-qualifiée</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Les lectrices de Marie Claire sont exactement le profil type de consommatrices de cosmétiques bio et premium : femmes actives, attentives à leur bien-être, avec un pouvoir d'achat moyen à élevé. C'est une audience qu'il serait très coûteux de cibler aussi précisément via la publicité classique.
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="w-5 h-5 text-foreground" />
                <h4 className="font-semibold text-foreground">Levier de vente directe</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                L'article inclut un lien direct vers votre boutique en ligne. Chaque lectrice intéressée peut accéder à vos produits en un clic. C'est un canal d'acquisition direct, mesurable, et qui renforce simultanément votre notoriété de marque.
              </p>
            </div>
          </motion.div>
        </SectionBlock>

        {/* Comment ça marche */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">Comment ça marche</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="bg-secondary rounded-2xl p-6 md:p-8">
            <ol className="space-y-4 text-foreground/80 leading-relaxed text-[15px]">
              {[
                "Vous lancez votre marque avec Biolystes (Pack Agence ou Pack IA)",
                "Vous accédez automatiquement à notre réseau presse partenaire",
                "Nous rédigeons un article sponsorisé mettant en valeur votre marque et vos produits",
                "L'article est publié sur marieclaire.fr avec un lien vers votre boutique",
                "Vous bénéficiez d'une visibilité durable auprès de millions de lectrices",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-foreground text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>
        </SectionBlock>

        {/* Note */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="bg-secondary rounded-2xl p-6 md:p-8 border-l-4 border-foreground/20">
            <p className="text-foreground/80 leading-relaxed text-[15px]">
              L'accès au réseau presse Marie Claire est un avantage exclusif réservé aux clients Biolystes. C'est un service que nous avons négocié directement pour offrir à nos marques un levier de visibilité que la plupart des jeunes marques ne peuvent pas se permettre individuellement. Ce partenariat fait partie de notre engagement à vous donner toutes les armes pour réussir.
            </p>
          </motion.div>
        </SectionBlock>

        {/* CTA */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="bg-foreground text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <p className="text-lg md:text-xl font-light mb-6 opacity-90" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Lancez votre marque et bénéficiez d'une visibilité presse immédiate.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={CTA_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary-foreground text-foreground font-medium text-sm hover:opacity-90 transition-opacity">
                Prendre rendez-vous <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/tarifs"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-primary-foreground/30 text-primary-foreground font-medium text-sm hover:bg-primary-foreground/10 transition-colors">
                Voir les offres <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </SectionBlock>
      </div>
    </div>
  );
}
