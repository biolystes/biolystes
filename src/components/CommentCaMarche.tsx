import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    label: "ÉTAPE 1",
    title: "Sélection de Produits",
    text: "Choisissez parmi notre catalogue de produits certifiés bio, végans, conformes UE/FDA, prêts à être étiquetés avec votre marque.",
    image: "https://biolystes.com/wp-content/uploads/2025/03/aW1hZ2U9L2dhbGxlcnktcGhvdG9zL0tXSHhFMnBBQVltR0lCZTJpNHFwejNXM2RUdnlLZTZOLmpwZWcmd2lkdGg9ODk2-1-1.jpg",
    alt: "Sélection de produits",
  },
  {
    label: "ÉTAPE 2",
    title: "Design Packaging Personnalisé",
    text: "Vous nous fournissez votre logo et inspirations. Nous créons une identité visuelle unique avec des étiquettes et packagings professionnels pour votre marque.",
    image: "https://biolystes.com/wp-content/uploads/2025/05/FRONT-WITH-BOX_high_res-2-scaled.jpg",
    alt: "Design Packaging Personnalisé",
  },
  {
    label: "ÉTAPE 3",
    title: "Envoi des échantillons",
    text: "Commandez vos échantillons pour découvrir et valider nos produits. C'est le moyen idéal de tester sans risque avant de lancer votre marque en toute confiance.",
    image: "https://biolystes.com/wp-content/uploads/2025/05/IMG_1846-2.png",
    alt: "Envoi des échantillons",
  },
  {
    label: "ÉTAPE 4",
    title: "Photos Packshots et Ambiance",
    text: "Nous réalisons un set complet de photos haute qualité (packshots produits, images d'ambiance) pour sublimer votre site et vos campagnes marketing.",
    image: "https://biolystes.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-09-at-18.08.33-3-1.jpeg",
    alt: "Photos Packshots et Ambiance",
  },
  {
    label: "ÉTAPE 5",
    title: "Création du Site Ecommerce",
    text: "Nous créons et configurons votre boutique en ligne prête à vendre, sans nécessiter d'investissement technique de votre part.",
    image: "https://biolystes.com/wp-content/uploads/2025/04/FireShot-Capture-044-Nairoba-Cosmetics-Sublimez-votre-beaute-relevez-votre-excellence_-lystes.pro_-1.png",
    alt: "Création du Site Ecommerce",
  },
  {
    label: "ÉTAPE 6",
    title: "Logistique & Expédition Simplifiées",
    text: "De la production à la demande à l'expédition sous votre marque, nous nous occupons de tout. Vous vous concentrez sur la croissance.",
    image: "https://biolystes.com/wp-content/uploads/2025/05/IMG_1896.png",
    alt: "Logistique et Expédition",
  },
  {
    label: "ÉTAPE 7 (Optionnel)",
    title: "Coaching ou accompagnement",
    text: "Optimisez vos chances de réussite en vous faisant accompagner par des experts disposant de 18 ans d'expérience dans ce secteur d'activité.",
    image: "https://biolystes.com/wp-content/uploads/2025/05/pexels-linkedin-3867836-scaled-copie-1-1.jpeg",
    alt: "Coaching ou accompagnement",
  },
];

export default function CommentCaMarche() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(steps.length - 1, c + 1));

  const step = steps[current];

  return (
    <section className="bg-secondary">
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-foreground max-w-3xl mx-auto">
            Comment fonctionne la mise en place de votre marque en 10-15 jours ?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Suivez notre processus simplifié, de la conception à l'automatisation.
          </p>
        </div>

        {/* Stepper indicators */}
        <div className="flex justify-center items-center gap-2 md:gap-3 mb-10">
          {steps.map((_, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setCurrent(i)}
                className={`w-8 h-8 rounded-full text-xs font-semibold border transition-colors ${
                  i === current
                    ? "bg-foreground text-background border-foreground"
                    : "bg-foreground text-background border-foreground opacity-40 hover:opacity-70"
                }`}
              >
                {i + 1}
              </button>
              {i < steps.length - 1 && (
                <div className="w-4 md:w-6 h-px bg-border" />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="max-w-2xl mx-auto bg-background rounded-2xl p-6 md:p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div className="order-2 md:order-1">
                  <span className="text-xs font-semibold text-muted-foreground block mb-2 uppercase tracking-wider">
                    {step.label}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                </div>
                <img
                  src={step.image}
                  alt={step.alt}
                  className="rounded-lg w-full object-cover order-1 md:order-2"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prev}
              disabled={current === 0}
              className="rounded-full"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Précédent
            </Button>
            <Button
              size="sm"
              onClick={next}
              disabled={current === steps.length - 1}
              className="rounded-full"
            >
              Suivant
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
