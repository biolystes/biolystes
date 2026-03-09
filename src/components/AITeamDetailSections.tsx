import { motion } from "framer-motion";
import SafeVideo from "@/components/SafeVideo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const teams = [
  {
    badge: "Équipe Diagnostics AI",
    title: "Diagnostic peau ou cheveux intelligent",
    desc: "Nous mettons en place une équipe Diagnostics AI, qui scanne le visage de vos visiteurs via un simple selfie, analyse leur peau en détail, et recommande automatiquement les produits les plus adaptés de votre boutique.",
    media: { type: "video" as const, src: "/videos/lystesai-demo.mov" },
  },
  {
    badge: "Équipe Expert Produit AI",
    title: "Un expert dédié sur chaque fiche produit",
    desc: "Chaque produit de votre catalogue dispose de son propre expert IA, capable de répondre instantanément aux questions de vos clients : composition, utilisation, compatibilité, avis — le tout avec une connaissance approfondie de votre gamme.",
    media: { type: "video" as const, src: "/videos/ai-hero.mp4" },
  },
  {
    badge: "Équipe Photographe AI",
    title: "Photos produit professionnelles générées par IA",
    desc: "Notre équipe Photographe AI génère des visuels produits haute qualité — packshots, mises en scène lifestyle, ambiances — sans studio, sans photographe, et en quelques minutes.",
    media: { type: "video" as const, src: "/videos/contenu-ugc.mp4" },
  },
  {
    badge: "Équipe Marketing AI",
    title: "Campagnes email & relances automatisées",
    desc: "Notre équipe Marketing AI conçoit et envoie des campagnes email personnalisées, des séquences de relance panier abandonné, et des newsletters ciblées — le tout basé sur le comportement réel de vos visiteurs.",
    media: { type: "video" as const, src: "/videos/event-beauty.mp4" },
  },
  {
    badge: "Équipe SEO AI",
    title: "Optimisation SEO automatique de vos contenus",
    desc: "Notre équipe SEO AI optimise automatiquement vos fiches produits, vos descriptions et vos métadonnées pour maximiser votre visibilité sur Google et générer du trafic organique qualifié.",
    media: { type: "video" as const, src: "/videos/salon-235th.mp4" },
  },
  {
    badge: "Équipe Créateur de contenu AI",
    title: "Contenu UGC & réseaux sociaux à la demande",
    desc: "Notre équipe de Créateurs de contenu AI produit des visuels UGC réalistes, des posts Instagram, des stories et du contenu TikTok — adaptés à votre marque et prêts à publier.",
    media: { type: "video" as const, src: "/videos/fralene-ugc.mp4" },
  },
  {
    badge: "Équipe Analytics AI",
    title: "Dashboards & insights en temps réel",
    desc: "Notre équipe Analytics AI surveille en continu les performances de votre boutique : taux de conversion, parcours client, produits performants, points de friction — et vous livre des recommandations actionnables.",
    media: { type: "video" as const, src: "/videos/ecommerce-demo.mov" },
  },
];

export default function AITeamDetailSections() {
  return (
    <div className="space-y-6">
      {teams.map((team, idx) => (
        <motion.div
          key={team.badge}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="bg-background py-14 md:py-20 rounded-2xl"
        >
          <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
            {/* Text */}
            <div className={`flex-1 min-w-[260px] ${idx % 2 === 1 ? "md:order-2" : ""}`}>
              <span className="inline-block bg-foreground text-primary-foreground text-[10px] font-bold tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-5">
                {team.badge}
              </span>
              <h3 className="text-[30px] font-light leading-[1.25] text-foreground mb-3.5">
                {team.title}
              </h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                {team.desc}
              </p>
            </div>

            {/* Media */}
            <div className={`flex-[1.5] min-w-[300px] w-full ${idx % 2 === 1 ? "md:order-1" : ""}`}>
              <SafeVideo
                src={team.media.src}
                className="w-full h-[400px] object-cover rounded-2xl"
                lazy
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
