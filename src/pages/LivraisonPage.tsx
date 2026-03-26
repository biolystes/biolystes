import { motion } from "framer-motion";
import {
  Clock, Zap, ShoppingBag, FlaskConical, Package, Truck, Check, Shield,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

export default function LivraisonPage() {
  return (
    <div className="min-h-screen bg-secondary py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="space-y-4 mb-16">
          <motion.p variants={fadeUp} custom={0} className="text-xs tracking-[0.3em] uppercase text-foreground">La livraison</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl text-foreground leading-relaxed">
            Comment fonctionne l'expédition de vos commandes ?
          </motion.h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="p-8 rounded-2xl border-2 border-foreground">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
                <Clock className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Mode Standard</h3>
                <p className="text-xs text-foreground">Livraison en 6-7 jours</p>
              </div>
            </div>
            <div className="space-y-4 text-sm text-foreground leading-relaxed">
              <p>Votre client passe commande sur votre boutique en ligne.</p>
              <p>Le laboratoire fabrique le produit à la demande, sous votre nom, avec votre packaging.</p>
              <p>Le colis est expédié directement chez votre client. <strong className="text-foreground">Aucun stock nécessaire.</strong></p>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="p-8 rounded-2xl border-2 border-foreground">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
                <Zap className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Mode Express</h3>
                <p className="text-xs text-foreground">Livraison en 24-48h</p>
              </div>
            </div>
            <div className="space-y-4 text-sm text-foreground leading-relaxed">
              <p>Achetez uniquement le stock nécessaire, sans minimum de quantité ni MOQ, et placez-le chez notre logisticien.</p>
              <p>Réapprovisionnement en une semaine au rythme de vos ventes — commandez juste ce qu'il faut, sans risque de surstock.</p>
              <p>Vos clients reçoivent leur commande <strong className="text-foreground">en 24 à 48 heures,</strong> expédiée directement par le logisticien.</p>
            </div>
          </motion.div>
        </div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
          className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          {[
            { icon: ShoppingBag, label: "Commande client" },
            { icon: FlaskConical, label: "Fabrication" },
            { icon: Package, label: "Emballage" },
            { icon: Truck, label: "Expédition" },
            { icon: Check, label: "Livré" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 md:flex-col md:gap-2">
              <div className="w-12 h-12 rounded-full bg-foreground text-primary-foreground flex items-center justify-center">
                <item.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-semibold text-foreground">{item.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
          className="mt-12 p-6 rounded-xl bg-background border border-border text-center">
          <Shield className="h-5 w-5 text-foreground mx-auto mb-3" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Chaque commande est expédiée <strong className="text-foreground">sous votre nom de marque</strong>. Votre client ne voit que votre marque, de l'emballage au bon de livraison.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
