import { motion } from "framer-motion";
import { Check } from "lucide-react";
import produitEndommage from "@/assets/produit-endommage.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

const items = [
  { title: "Conformité des formulations", desc: "Garantie par le laboratoire fabricant" },
  { title: "DIP — Dossier d'Information Produit", desc: "Établi et conservé par le laboratoire" },
  { title: "Notification CPNP", desc: "Enregistrement au portail européen inclus" },
  { title: "Cosmétovigilance & allégations", desc: "Surveillance et vérification gérées par le labo" },
  { title: "Certifications COSMOS / ECOCERT / FDA", desc: "Maintenues et renouvelées par le fabricant" },
];

export default function ResponsabiliteSection() {
  return (
    <>
      {/* Header */}
      <div className="text-center max-w-5xl mx-auto px-6 pt-24 pb-12">
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          className="text-[10px] font-bold tracking-[2.5px] uppercase text-cream/50 mb-5">
          ASSURANCE
        </motion.p>
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-3xl md:text-4xl font-light tracking-tight max-w-[780px] mx-auto mb-6 text-cream">
          Comment se passe le partage des responsabilités <em className="italic">en cas de litige ?</em>
        </motion.h2>
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="text-[17px] text-cream/50 leading-[1.7] max-w-[600px] mx-auto">
          Vous êtes protégé pour restez focus, sur ce qui compte le plus développer votre marque et vos ventes.
        </motion.p>
      </div>

      {/* Responsabilité */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
        className="bg-background py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Texte */}
          <div className="flex-1 min-w-[260px]">
            <span className="inline-block bg-foreground text-primary-foreground text-[10px] font-bold tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-5">
              Conformité & Responsabilité
            </span>
            <h3 className="text-[30px] font-light leading-[1.25] text-foreground mb-3.5">
              Vous vendez. Le laboratoire assume le risque produit
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.7]">
              En marque blanche, c'est le laboratoire fabricant qui est la Personne Responsable au sens du Règlement européen CE n°1223/2009. Vous distribuez, vous ne fabriquez pas. Le risque produit ne repose jamais sur vous.
              Contrairement aux produits fait sur mesure avec votre formulation.
            </p>
          </div>

          {/* Card visuelle */}
          <div className="flex-[1.5] min-w-[300px] w-full">
            <div className="w-full max-w-2xl mx-auto">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-3 h-3 rounded-full bg-[#34d399]" />
                <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-muted-foreground">Protection réglementaire</span>
                <span className="ml-auto text-[26px] font-black text-foreground">100<span className="text-[13px] text-[#10b981]">%</span></span>
              </div>

              <div className="space-y-2">
                {items.map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl flex items-start gap-3 border border-foreground">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-[#e6f6ef]">
                      <Check className="w-3.5 h-3.5 text-[#22c55e]" strokeWidth={3} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[12px] font-bold text-foreground">{item.title}</p>
                      <p className="text-[13px] font-medium text-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Litige */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
        className="bg-secondary py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 min-w-[260px]">
            <span className="inline-block bg-foreground text-primary-foreground text-[10px] font-bold tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-5">
              Litige
            </span>
            <h3 className="text-[30px] font-light leading-[1.25] text-foreground mb-3.5">
              Produit endommagé ou défectueux ?
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.7]">
              Votre client vous contacte, vous nous transmettez la réclamation avec photo. Remplacement pris en charge sous 30 jours après livraison. Bien entendu dans le cas ou c'est notre laboratoire qui gère la livraison.
            </p>
          </div>
          <div className="flex-[1.5] min-w-[300px] w-full">
            <div className="flex gap-3.5 flex-wrap">
              <div className="flex-1 min-w-[140px] rounded-2xl overflow-hidden relative">
                <img src={produitEndommage} alt="Produit endommagé" className="w-full h-[480px] object-cover block" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
