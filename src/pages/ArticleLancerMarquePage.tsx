import { motion } from "framer-motion";
import { ArrowRight, Rocket, Clock, ShieldCheck, Zap, Globe } from "lucide-react";

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

export default function ArticleLancerMarquePage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionBlock>
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-foreground text-primary-foreground text-[11px] font-semibold mb-8">
              <Rocket className="w-4 h-4" />
              Guide de lancement
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.1] mb-6"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Comment lancer sa marque cosmétique bio en <span className="font-bold">15 jours.</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-sm text-muted-foreground max-w-xl mx-auto">
              Zéro stock, zéro logistique, certifié COSMOS & ECOCERT. Le guide complet.
            </motion.p>
          </SectionBlock>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 space-y-16">
        {/* Contexte */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">Le marché cosmétique bio en 2026</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-4 text-foreground/80 leading-relaxed text-[15px]">
            <p>
              Le marché mondial de la cosmétique bio et naturelle dépasse désormais les 50 milliards d'euros. La demande ne cesse de croître, portée par des consommateurs de plus en plus exigeants sur la composition de leurs produits.
            </p>
            <p>
              Pourtant, lancer une marque cosmétique reste un parcours semé d'embûches. Entre les laboratoires, les certifications, le packaging, le site e-commerce, la logistique et le marketing, un entrepreneur isolé peut facilement passer plus d'un an avant de vendre son premier produit.
            </p>
            <p>
              <strong className="text-foreground">Biolystes a compressé ce processus en 15 jours.</strong> Voici comment.
            </p>
          </motion.div>
        </SectionBlock>

        {/* Étape 1 */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-6">Étape 1 — Mise en place de votre marque</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-6">
            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-foreground" />
                <h4 className="font-semibold text-foreground">Sélection des produits</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Plus de 130 formulations certifiées Bio & Végan, COSMOS, ECOCERT, FDA. Vous choisissez les produits qui correspondent à votre positionnement avec l'aide d'un expert produit dédié. Soins visage, corps, capillaires, hommes, bébé, aromathérapie — chaque niche est couverte.
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-foreground" />
                <h4 className="font-semibold text-foreground">Création de l'identité visuelle</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Un chef de projet pilote l'ensemble : logo, identité visuelle, design packaging recyclable, photos IA hyperréalistes, contenu du site rédigé et optimisé. Un seul interlocuteur, pas de va-et-vient entre prestataires.
              </p>
            </div>

            <div className="bg-secondary rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-foreground" />
                <h4 className="font-semibold text-foreground">Boutique en ligne prête à vendre</h4>
              </div>
              <p className="text-foreground/80 leading-relaxed text-[15px]">
                Site e-commerce complet avec SEO avancé, indexation Google, certificat SSL, hébergement, nom de domaine. Tout est configuré pour que vous puissiez commencer à vendre dès le premier jour.
              </p>
            </div>
          </motion.div>
        </SectionBlock>

        {/* Étape 2 */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-6">Étape 2 — Gestion au quotidien</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="bg-secondary rounded-2xl p-6 md:p-8">
            <p className="text-foreground/80 leading-relaxed text-[15px] mb-4">
              Une fois votre marque lancée, tout devient automatique :
            </p>
            <ul className="space-y-3 text-foreground/80 text-[15px]">
              {[
                "Votre client commande sur votre site",
                "Nos laboratoires fabriquent le produit à la demande",
                "Le produit est expédié directement chez votre client, sous votre nom de marque",
                "Vous n'avez aucun stock à gérer, aucune logistique",
                "Biolystes AI travaille jour et nuit : diagnostic IA, recommandation produits, contenu automatisé",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </SectionBlock>

        {/* Chiffre clé */}
        <SectionBlock>
          <motion.div variants={fadeUp} custom={0} className="bg-foreground text-primary-foreground rounded-2xl p-8 md:p-12 text-center">
            <p className="text-6xl md:text-8xl font-bold mb-4">15j</p>
            <p className="text-lg md:text-xl font-light leading-relaxed max-w-lg mx-auto opacity-80">
              de la sélection produits à la mise en ligne de votre boutique.
            </p>
            <p className="mt-6 text-sm opacity-60 max-w-md mx-auto">
              Plus de 100 marques ont déjà été lancées avec Biolystes. Zéro stock, certifications incluses, site e-commerce complet.
            </p>
          </motion.div>
        </SectionBlock>

        {/* Combien ça coûte */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">Combien ça coûte</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-4 text-foreground/80 leading-relaxed text-[15px]">
            <p>
              Le Pack Agence démarre à <strong className="text-foreground">1 499€ de frais de lancement</strong> + <strong className="text-foreground">99€/mois d'abonnement Pro</strong> (obligatoire, inclut hébergement, gestion livraisons, support, SEO, nom de domaine, chat IA…).
            </p>
            <p>
              Pour tester avant de s'engager, le <strong className="text-foreground">Pack Découverte</strong> permet de recevoir 4 produits personnalisés à votre marque dès 147€ (ou 3x 49€). Le montant est intégralement déduit si vous passez à une offre avec site web.
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
              <a href="/tarifs"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-primary-foreground/30 text-primary-foreground font-medium text-sm hover:bg-primary-foreground/10 transition-colors">
                Voir les tarifs <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </SectionBlock>
      </div>
    </div>
  );
}
