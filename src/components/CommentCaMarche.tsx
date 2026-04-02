import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import selectionProduitsStep from "@/assets/selection-produits-step.png";
import designPackagingStep from "@/assets/design-packaging-step.jpg";
import envoiEchantillonsStep from "@/assets/envoi-echantillons-step.png";
import photosPackshotsStep from "@/assets/sevmylook-20.jpg";
import ecommerceStep from "@/assets/ecommerce-step.png";
import logistiqueStep from "@/assets/logistique-step.jpg";
import coachingStep from "@/assets/coaching-step.png";

const steps = [
  {
    label: "ÉTAPE 1",
    title: "Sélection de Produits",
    text: "Choisissez parmi notre catalogue de produits certifiés bio, végans, conformes UE/FDA, prêts à être étiquetés avec votre marque.",
    image: selectionProduitsStep,
    alt: "Sélection de produits",
  },
  {
    label: "ÉTAPE 2",
    title: "Design Packaging Personnalisé",
    text: "Vous nous fournissez votre logo et inspirations. Nous créons une identité visuelle unique avec des étiquettes et packagings professionnels pour votre marque.",
    image: designPackagingStep,
    alt: "Design Packaging Personnalisé",
  },
  {
    label: "ÉTAPE 3",
    title: "Envoi des échantillons",
    text: "Commandez vos échantillons pour découvrir et valider nos produits. C'est le moyen idéal de tester sans risque avant de lancer votre marque en toute confiance.",
    image: envoiEchantillonsStep,
    alt: "Envoi des échantillons",
  },
  {
    label: "ÉTAPE 4",
    title: "Photos Packshots et Ambiance",
    text: "Nous réalisons un set complet de photos haute qualité (packshots produits, images d'ambiance) pour sublimer votre site et vos campagnes marketing.",
    image: photosPackshotsStep,
    alt: "Photos Packshots et Ambiance",
  },
  {
    label: "ÉTAPE 5",
    title: "Création du Site E-commerce",
    text: "Nous créons et configurons votre boutique en ligne prête à vendre, sans nécessiter d'investissement technique de votre part.",
    image: ecommerceStep,
    alt: "Création du Site E-commerce",
  },
  {
    label: "ÉTAPE 6",
    title: "Logistique & Expédition Simplifiées",
    text: "De la production à la demande à l'expédition sous votre marque, nous nous occupons de tout. Vous vous concentrez sur la croissance.",
    image: logistiqueStep,
    alt: "Logistique et Expédition",
  },
  {
    label: "ÉTAPE 7 (Optionnel)",
    title: "Coaching ou accompagnement",
    text: "Optimisez vos chances de réussite en vous faisant accompagner par des experts disposant de 18 ans d'expérience dans ce secteur d'activité.",
    image: coachingStep,
    alt: "Coaching ou accompagnement",
  },
];

export default function CommentCaMarche() {
  const [current, setCurrent] = useState(0);

  // Preload all step images on mount
  useEffect(() => {
    steps.forEach((step) => {
      const img = new Image();
      img.src = step.image;
    });
  }, []);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(steps.length - 1, c + 1));

  const step = steps[current];

  return (
    <section className="bg-foreground">
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32 pt-[120px]">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light tracking-tight max-w-3xl mx-auto text-balance" style={{ color: "#f5f4df" }}>
            Comment fonctionne la mise en place de votre marque en 10-15 jours ?
          </h2>
          <p className="mt-4 max-w-xl mx-auto" style={{ color: "#f5f4dfaa" }}>
            Suivez notre processus simplifié, de la conception à l'automatisation.
          </p>
        </div>

        {/* Stepper indicators */}
        <div className="flex justify-center items-center gap-2 md:gap-3 mb-10">
          {steps.map((_, i) => (
            <div key={i} className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setCurrent(i)}
                className="w-8 h-8 rounded-full text-xs font-semibold border transition-colors"
                style={{
                  backgroundColor: i === current ? "#f5f4df" : "transparent",
                  color: i === current ? "#121212" : "#f5f4df88",
                  borderColor: i === current ? "#f5f4df" : "#f5f4df4d",
                }}
              >
                {i + 1}
              </button>
              {i < steps.length - 1 && (
                <div className="w-4 md:w-6 h-px" style={{ backgroundColor: "#f5f4df33" }} />
              )}
            </div>
          ))}
        </div>

        {/* Step content card */}
        <div className="max-w-2xl mx-auto rounded-2xl p-6 md:p-10" style={{ backgroundColor: "#f5f4df" }}>
          <div className="relative">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ opacity: i === current ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className={i === current ? "relative" : "absolute inset-0 pointer-events-none"}
                aria-hidden={i !== current}
              >
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="order-2 md:order-1">
                    <span className="text-xs font-semibold text-muted-foreground block mb-2 uppercase tracking-wider">
                      {s.label}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mb-3">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                  </div>
                  <img
                    src={s.image}
                    alt={s.alt}
                    className="rounded-lg w-full object-cover order-1 md:order-2"
                  />
                </div>
              </motion.div>
            ))}
          </div>

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
