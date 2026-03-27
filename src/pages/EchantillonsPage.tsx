import { motion } from "framer-motion";
import { Check, CircleHelp } from "lucide-react";
import SafeVideo from "@/components/SafeVideo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const features = [
  "4 produits certifiés bio chez vous en 7 jours",
  "Création de votre logo",
  "Design packaging",
  "Shooting photo IA de vos produits",
  "Accompagnement dans la sélection des produits",
  "Certifié Bio & Végan / COSMOS / ECOCERT / FDA",
  "Livraison incluse sous 7 à 8 jours",
];

export default function EchantillonsPage() {
  return (
    <div className="min-h-screen bg-secondary pt-[120px]">
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-4 mb-12 text-center">
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
              className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
              Pas besoin de tout décider maintenant
            </motion.p>
            <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground leading-relaxed">
              Votre meilleure réflexion, testez nos produits <br className="hidden md:block" />
              avec votre branding pour 147€, montant déduit si vous passez à l'étape suivante
            </motion.h2>
            <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
              className="text-sm text-foreground leading-relaxed">
              4 produits certifiés bio chez vous en 7 jours. Création de votre logo, design packaging et shooting photo IA de vos produits.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
              className="mb-8">
              <div className="relative rounded-2xl p-7 md:p-9 flex flex-col border-2 border-foreground">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-foreground text-background">
                  Pack découverte
                </div>
                <h3 className="text-lg md:text-xl font-extrabold uppercase tracking-tight mb-1 mt-2 text-foreground">
                  Testez nos produits — 147€
                </h3>
                <p className="text-sm mb-8 text-foreground leading-relaxed">
                  ou 3× 49€ — Validez la qualité avant de vous lancer
                </p>

                <div className="flex flex-col mb-8">
                  {features.map((feat) => (
                    <div key={feat} className="flex items-start gap-3 py-1.5">
                      <Check className="flex-shrink-0 mt-0.5 text-foreground" size={14} />
                      <span className="text-[13px] leading-relaxed text-foreground">{feat}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://biolystes.pro/rdv" target="_blank" rel="noopener noreferrer"
                  className="block w-full py-4 text-center no-underline text-[11px] font-extrabold tracking-[1.5px] uppercase rounded-xl bg-foreground text-background border-2 border-foreground hover:opacity-90 transition-opacity mt-auto"
                >
                  Commander mes échantillons
                </a>
              </div>

              <div className="rounded-2xl px-6 py-5 text-center bg-foreground/[0.02] mt-5">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <CircleHelp className="text-foreground" size={14} strokeWidth={1.8} />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-foreground">Bon à savoir</span>
                </div>
                <p className="text-[13px] leading-relaxed text-foreground">
                  147€ déduits de toute Offre Avec Site souscrite dans les 30 jours. Votre test devient un acompte, pas une dépense.
                </p>
              </div>
            </motion.div>

            <SafeVideo src="/videos/hero-kaniwa.mp4" className="rounded-xl object-cover w-full h-auto hidden md:block" lazy />
          </div>
        </div>
      </section>
    </div>
  );
}
