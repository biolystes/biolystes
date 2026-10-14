import { motion } from "framer-motion";

/* L'en-tête commun des blocs de /bio (JP, 14/10/2026) : le sur-titre de
   « Retour client », le titre de « Pourquoi c'est sans risque… » (graisse
   légère, la fin en gris, coupure « pretty » sur deux lignes, centré), la
   description de « Tous nos produits sont formulés… ». La largeur en em
   garde deux lignes à toutes les tailles ; « !font-light » parce que
   index.css force tous les h2 à 400 en !important. */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

export default function EnteteSection({ surtitre, noir, gris, texte, className = "" }: {
  surtitre: string;
  /* Le début du titre, en noir, puis la fin, en gris. */
  noir: string;
  gris: string;
  texte: string;
  className?: string;
}) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className={"space-y-4 text-center " + className}>
      <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">
        {surtitre}
      </motion.p>
      <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl !font-light tracking-tight mx-auto text-foreground leading-relaxed"
        style={{ maxWidth: "min(640px, 22em)", textWrap: "pretty" }}>
        {noir} <span className="text-muted-foreground">{gris}</span>
      </motion.h2>
      <motion.p variants={fadeUp} custom={2} className="text-foreground max-w-xl mx-auto leading-relaxed">
        {texte}
      </motion.p>
    </motion.div>
  );
}
