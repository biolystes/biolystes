import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Camera, Clock, Users, Brain, Megaphone, MessageCircle, Sparkles, Shield, Target, TrendingUp, Headphones } from "lucide-react";

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

const problematics = [
  {
    icon: Camera,
    title: "Le coût des photographes",
    desc: "Faire appel à un photographe professionnel pour chaque produit représente un budget considérable. Beaucoup de créateurs se retrouvent avec des visuels médiocres faits au smartphone, ce qui tue la crédibilité de leur marque face à des concurrents qui investissent massivement dans leur image.",
    solution: "Nos offres intègrent la photographie IA hyperréaliste et le contenu UGC IA, vous offrant des visuels de qualité studio sans le coût d'un photographe.",
    solutionPack: "Pack Agence & Pack IA",
  },
  {
    icon: Clock,
    title: "Le manque de temps",
    desc: "Gérer une marque cosmétique demande un investissement temps considérable : création de contenu, gestion des réseaux sociaux, réponse aux clients, suivi des commandes, optimisation du site. La plupart des créateurs ont un emploi à côté et ne peuvent tout simplement pas tout faire.",
    solution: "L'offre Agence prend en charge la gestion complète de votre communication, et l'offre IA automatise les tâches chronophages comme le diagnostic client et les recommandations produits.",
    solutionPack: "Pack Agence & Offre Communication",
  },
  {
    icon: Brain,
    title: "Le manque de compétences techniques",
    desc: "Savoir formuler un produit ne signifie pas savoir le vendre. La majorité des créateurs ne maîtrisent ni le marketing digital, ni le SEO, ni la publicité en ligne, ni la création de contenu engageant. Et apprendre tout cela prend des années.",
    solution: "Nous prenons en charge l'intégralité de la partie technique et marketing : du site e-commerce optimisé à la stratégie SEO, en passant par la gestion des campagnes publicitaires.",
    solutionPack: "Pack Agence, Pack IA & Abonnements",
  },
  {
    icon: MessageCircle,
    title: "L'incapacité à conseiller les clients",
    desc: "Les clients posent des questions techniques sur les produits : quel soin pour ma peau, quelle routine adopter, quels ingrédients éviter. Sans expertise dermocosmétique ou sans temps pour répondre, les créateurs perdent des ventes et de la crédibilité.",
    solution: "Notre technologie IA déploie des agents conversationnels sur chaque fiche produit, capables de conseiller les clients 24h/24 dans plus de 100 langues, avec une connaissance approfondie de vos produits.",
    solutionPack: "Pack IA & Biolystes AI",
  },
  {
    icon: Megaphone,
    title: "La gestion des réseaux sociaux",
    desc: "Publier régulièrement du contenu de qualité sur Instagram, TikTok, Facebook et Pinterest demande une constance et une créativité que peu de créateurs isolés peuvent maintenir. Résultat : des comptes fantômes qui nuisent à l'image de la marque.",
    solution: "Nos offres communication et nos abonnements Community Manager prennent en charge la création de contenu, le calendrier éditorial et la gestion quotidienne de vos réseaux sociaux.",
    solutionPack: "Offre Communication & Abonnements",
  },
  {
    icon: Target,
    title: "Le diagnostic client",
    desc: "Proposer un diagnostic de peau ou de cheveux personnalisé est un levier de conversion puissant, mais techniquement complexe à mettre en place. La plupart des marques ne proposent rien de tel, perdant ainsi une opportunité majeure de différenciation.",
    solution: "Notre diagnostic intelligent par IA analyse le profil du client et recommande les produits adaptés, augmentant considérablement le taux de conversion.",
    solutionPack: "Pack IA & Biolystes AI",
  },
];

const offerResponses = [
  {
    problem: "Pas de photographe → Pas de beaux visuels",
    offer: "Pack Agence",
    response: "Photographie IA hyperréaliste incluse",
  },
  {
    problem: "Pas de temps → Site inactif",
    offer: "Pack Agence + Abonnement",
    response: "Gestion 360° déléguée",
  },
  {
    problem: "Pas de compétences marketing → 0 vente",
    offer: "Offre Communication",
    response: "Stratégie marketing complète",
  },
  {
    problem: "Pas de conseil client → Perte de crédibilité",
    offer: "Pack IA / Biolystes AI",
    response: "Agents IA sur chaque fiche produit",
  },
  {
    problem: "Pas de réseaux sociaux → Marque invisible",
    offer: "Abonnement Community Manager",
    response: "Gestion quotidienne des réseaux",
  },
  {
    problem: "Pas de diagnostic → Faible conversion",
    offer: "Pack IA / Biolystes AI",
    response: "Diagnostic intelligent par IA",
  },
  {
    problem: "Tout déléguer → Besoin d'un partenaire",
    offer: "Pack IA complet",
    response: "Solution clés en main de A à Z",
  },
];

export default function PourquoiCetteOffrePage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <SectionBlock>
            <motion.div variants={fadeUp} custom={0}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-foreground text-primary-foreground text-[11px] font-semibold mb-8">
              <Shield className="w-4 h-4" />
              Notre engagement
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1}
              className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-[1.1] mb-6"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
              Pourquoi une offre <span className="font-bold">aussi complète ?</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Parce que créer un site ne suffit pas. Nous avons constaté que trop de marques restent inactives après leur lancement. Voici pourquoi nous avons fait évoluer notre offre.
            </motion.p>
          </SectionBlock>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 space-y-16">

        {/* Le constat */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">Le constat qui a tout changé</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="bg-foreground text-primary-foreground rounded-2xl p-8 md:p-12">
            <p className="text-lg md:text-xl font-light leading-relaxed opacity-90 mb-6">
              Malgré tous nos efforts pour créer des sites e-commerce de qualité, nous avons constaté un problème récurrent :
            </p>
            <p className="text-3xl md:text-4xl font-bold mb-4">
              Des sites livrés. Zéro activité.
            </p>
            <p className="text-sm opacity-70 leading-relaxed max-w-lg">
              4 mois après la mise en ligne, aucune publication sur les réseaux sociaux, aucun contenu ajouté, aucune stratégie mise en place. Des projets qui avaient tout pour réussir, mais qui restaient figés.
            </p>
          </motion.div>
        </SectionBlock>

        {/* Pourquoi */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">Pourquoi ces sites restent inactifs ?</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-foreground/80 leading-relaxed mb-8">
            En nous rapprochant de ces créateurs pour comprendre leur inactivité, les raisons étaient toujours les mêmes. Ce n'est pas un manque de motivation — c'est un manque de moyens, de temps ou de compétences.
          </motion.p>
        </SectionBlock>

        {/* Les 6 problématiques */}
        {problematics.map((item, idx) => (
          <SectionBlock key={item.title}>
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <item.icon className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
            </motion.div>
            <motion.div variants={fadeUp} custom={1} className="space-y-4">
              <div className="bg-secondary rounded-2xl p-6 md:p-8">
                <h4 className="font-semibold text-foreground mb-3">Le problème</h4>
                <p className="text-foreground/80 leading-relaxed text-[15px]">{item.desc}</p>
              </div>
              <div className="bg-secondary rounded-2xl p-6 md:p-8 border-l-4 border-foreground/20">
                <h4 className="font-semibold text-foreground mb-1">Notre réponse</h4>
                <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-muted-foreground mb-3">{item.solutionPack}</span>
                <p className="text-foreground/80 leading-relaxed text-[15px]">{item.solution}</p>
              </div>
            </motion.div>
          </SectionBlock>
        ))}

        {/* Tableau synthèse */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-6">Comment notre offre répond à chaque problème</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="overflow-x-auto rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-foreground text-primary-foreground">
                  <th className="text-left p-4 font-semibold">Problème constaté</th>
                  <th className="text-left p-4 font-semibold">Offre</th>
                  <th className="text-left p-4 font-semibold">Réponse</th>
                </tr>
              </thead>
              <tbody>
                {offerResponses.map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-[hsl(60_30%_89%_/_0.44)]" : "bg-secondary"}>
                    <td className="p-4 font-medium text-foreground">{r.problem}</td>
                    <td className="p-4">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-background text-foreground/80">{r.offer}</span>
                    </td>
                    <td className="p-4 text-foreground/70">{r.response}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </SectionBlock>

        {/* L'évolution */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-4">Une offre qui a évolué avec nos constatations</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-6 text-foreground/80 leading-relaxed text-[15px]">
            <p>
              Notre offre n'a pas toujours été aussi complète. Au départ, nous nous concentrions uniquement sur la création de la marque et du site e-commerce. Mais au fil des mois, nous avons constaté que cela ne suffisait pas.
            </p>
            <p>
              Des créateurs motivés, avec de bons produits et un beau site, n'arrivaient pas à faire décoller leur projet. Non pas parce que le produit était mauvais, mais parce qu'ils étaient seuls face à des défis qu'ils ne pouvaient pas relever : la photographie, le marketing, les réseaux sociaux, le conseil client, la publicité.
            </p>
            <p>
              C'est pour répondre à ces besoins, <strong className="text-foreground">en fonction des moyens de chacun</strong>, que nous avons progressivement enrichi notre offre :
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="grid gap-4 mt-8">
            {[
              {
                icon: Shield,
                title: "L'offre Agence",
                desc: "Pour ceux qui veulent une gestion 360° sans se soucier de la technique. Logo, packaging, site, SEO, livraison — tout est pris en charge.",
                link: "/",
              },
              {
                icon: Sparkles,
                title: "L'offre IA",
                desc: "Pour ceux qui veulent aller plus loin avec l'intelligence artificielle : UGC IA, diagnostic client, agents conversationnels, recommandations produits.",
                link: "/ai",
              },
              {
                icon: Megaphone,
                title: "L'offre Communication",
                desc: "Pour ceux qui ne peuvent pas faire appel à des photographes ou des marketeurs. Réseaux sociaux, contenu, publicité — on s'occupe de tout.",
                link: "/agence",
              },
              {
                icon: Headphones,
                title: "Les abonnements",
                desc: "Pour ceux qui veulent tout déléguer : marketing, CRO, community management. Un accompagnement continu pour faire grandir votre marque.",
                link: "/tarifs",
              },
            ].map((item) => (
              <Link key={item.title} to={item.link} className="no-underline">
                <div className="bg-secondary rounded-2xl p-6 md:p-8 hover:bg-secondary/80 transition-colors group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                        {item.title}
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <p className="text-foreground/70 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </SectionBlock>

        {/* Conclusion */}
        <SectionBlock>
          <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-semibold text-foreground mb-6">Notre objectif</motion.h2>
          <motion.div variants={fadeUp} custom={1} className="space-y-6 text-foreground/80 leading-relaxed text-[15px]">
            <p>
              Notre objectif n'est pas de créer un beau site pour les conversations avec les amis. C'est de faire en sorte que votre projet <strong className="text-foreground">aboutisse réellement</strong>.
            </p>
            <p>
              C'est pour cela que nous avons une offre aussi complète, qui a évolué au fur et à mesure de nos constatations. Chaque ajout — l'IA, la communication, les abonnements — est né d'un problème réel que nous avons observé chez nos clients.
            </p>
            <p>
              Parce qu'un site sans contenu est un site mort. Une marque sans visibilité est une marque invisible. Et un entrepreneur sans accompagnement est un entrepreneur seul face à des défis qui dépassent souvent ses compétences ou son temps disponible.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="bg-foreground text-primary-foreground rounded-2xl p-8 md:p-12 text-center mt-8">
            <p className="text-lg md:text-xl font-light leading-relaxed opacity-90 mb-6">
              Nous voulons que le maximum d'entre vous puisse réussir avec nous. C'est aussi simple que ça.
            </p>
            <a href={CTA_URL} target="_blank" rel="noopener noreferrer"
              className="inline-block px-8 py-4 no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase rounded-xl bg-background text-foreground hover:opacity-90 transition-opacity">
              Prendre RDV — Discutons de votre projet
            </a>
          </motion.div>
        </SectionBlock>
      </div>
    </div>
  );
}
