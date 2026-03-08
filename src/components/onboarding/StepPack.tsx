import { useOnboardingStore, PackType, PACKS } from "@/stores/onboardingStore";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const FEATURES: Record<PackType, string[]> = {
  decouverte: [
    "4 produits minimum",
    "Formulation bio & végan",
    "Packaging standard",
    "Support email",
  ],
  agence: [
    "Tout Découverte +",
    "Branding complet (logo, charte)",
    "Site e-commerce clé en main",
    "Abonnement PRO : 99€/mois",
    "Support prioritaire",
  ],
  ia: [
    "Tout Agence +",
    "Agent IA personnalisé",
    "SEO & contenu automatisé",
    "Analytics avancés",
    "Abonnement PRO IA : 199€/mois",
    "Support dédié 24/7",
  ],
};

export default function StepPack() {
  const { pack, setPack, setStep } = useOnboardingStore();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-foreground">Votre pack</h1>
      <p className="text-muted-foreground mb-8">Choisissez la formule adaptée à votre projet.</p>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {(["decouverte", "agence", "ia"] as PackType[]).map((key) => {
          const p = PACKS[key];
          const selected = pack === key;
          return (
            <button
              key={key}
              onClick={() => setPack(key)}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                selected
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/30"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{p.label}</div>
              <div className="text-2xl font-bold text-foreground mb-1">{p.setup_price.toLocaleString("fr-FR")} €</div>
              {p.monthly_price > 0 && (
                <div className="text-sm text-muted-foreground mb-4">+ {p.monthly_price} €/mois</div>
              )}
              <div className="space-y-2 mt-4">
                {FEATURES[key].map((f) => (
                  <div key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-foreground shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(2)} size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </Button>
        <Button onClick={() => setStep(4)} className="flex-1" size="lg">
          Continuer <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
