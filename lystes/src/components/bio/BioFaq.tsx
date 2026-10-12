import { motion } from "framer-motion";
import { Warehouse, PackageOpen, CalendarClock, Truck, BadgeCheck, FlaskConical } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Questions fréquentes de /bio (12/10/2026). Tout à plat, sans repliable
 * (règle de JP). Chaque réponse reprend un fait déjà écrit sur la page ou
 * dans les conditions de Biolystes ; rien n’est ajouté. La question de la
 * Personne Responsable est laissée de côté tant que JP ne l’a pas validée :
 * le règlement CE 1223/2009 en fait par défaut la marque (article 4).
 */
type Question = { icone: LucideIcon; q: string; r: string };

const QUESTIONS: Question[] = [
  {
    icone: Warehouse,
    q: "Faut-il acheter du stock ?",
    r: "Non. Le laboratoire fabrique chaque produit à la demande, sous votre nom et avec votre packaging, puis l’expédie chez votre client.",
  },
  {
    icone: PackageOpen,
    q: "Y a-t-il une quantité minimale ?",
    r: "Aucune. Commandez 1, 10 ou 1 000 produits selon vos besoins réels, y compris pour vos points de vente.",
  },
  {
    icone: CalendarClock,
    q: "Combien de temps pour lancer ma marque ?",
    r: "Comptez 10 à 15 jours : sélection des produits, design du packaging, réception des produits, photos, boutique en ligne et logistique.",
  },
  {
    icone: Truck,
    q: "En combien de temps mes clients sont-ils livrés ?",
    r: "En 6 à 7 jours en mode standard, fabriqué à la demande. En 24 à 48 heures en mode express, depuis le stock placé chez notre logisticien.",
  },
  {
    icone: BadgeCheck,
    q: "Quelles certifications ont les produits ?",
    r: "La plupart de nos formules sont certifiées Ecocert COSMOS, en Natural ou en Organic. La certification de chaque référence figure sur sa fiche, et la fabrication suit la norme ISO 22716.",
  },
  {
    icone: FlaskConical,
    q: "Puis-je essayer les produits avant de me lancer ?",
    r: "Oui. Vous commandez les produits choisis pour les découvrir et les valider avant de lancer votre marque.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

export default function BioFaq() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="space-y-4 mb-12 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-foreground">Questions fréquentes</p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-tight max-w-3xl mx-auto text-foreground leading-relaxed text-balance">
          Ce que l’on nous demande avant de se lancer
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {QUESTIONS.map((item, i) => (
          <motion.div key={item.q} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
            className="bg-secondary p-6 rounded-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0">
              <item.icone className="h-5 w-5 text-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1.5 text-balance">{item.q}</h3>
              <p className="text-sm text-foreground leading-relaxed text-pretty">{item.r}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
