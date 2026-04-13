import { useOnboardingStore, PackType, PACKS } from "@/stores/onboardingStore";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";

const FEATURES: Record<PackType, string[]> = {
  decouverte: [
    "4 échantillons personnalisés",
    "Logo + packaging (3 propositions)",
    "Photos IA professionnelles",
    "Support email",
  ],
  solo: [
    "1 design de produit personnalisé",
    "Boutique en ligne à votre nom",
    "Logo et identité visuelle",
    "Abonnement : 49€/mois",
    "Sans engagement",
  ],
  duo: [
    "2 designs de produits personnalisés",
    "Boutique en ligne à votre nom",
    "Logo et identité visuelle",
    "Abonnement : 79€/mois",
    "Sans engagement",
  ],
  standard: [
    "Tout Solo/Duo +",
    "4 designs de produits",
    "Contenu marketing clé en main",
    "Site e-commerce + SEO",
    "Expert dédié",
    "Abonnement : 99€/mois",
    "Sans engagement",
  ],
  ia: [
    "Tout Standard +",
    "8 designs de produits",
    "Diagnostic IA Skin & Hair",
    "Agent conseil produit IA 24h/24",
    "UGC IA + photos studio",
    "Gestion réseaux sociaux 1 mois",
    "Abonnement : 149€/mois",
    "Sans engagement",
  ],
};

export default function StepPack() {
  const { pack, setPack, setStep } = useOnboardingStore();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-foreground">Votre pack</h1>
      <p className="text-muted-foreground mb-8">Choisissez la formule adaptée à votre projet.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {(["decouverte", "solo", "duo", "standard", "ia"] as PackType[]).map((key) => {
          const p = PACKS[key];
          const selected = pack === key;
          return (
            <button
              key={key}
              onClick={() => setPack(key)}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                selected
                  ? "border-foreground bg-foreground/5"
                  : "border-border hover:border-foreground/30"
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{p.label}</div>
              <div className="text-xl font-bold text-foreground mb-1">{p.setup_price.toLocaleString("fr-FR")} €</div>
              {p.monthly_price > 0 && (
                <div className="text-sm text-muted-foreground mb-3">+ {p.monthly_price} €/mois</div>
              )}
              <div className="space-y-1.5 mt-3">
                {FEATURES[key].map((f) => (
                  <div key={f} className="flex items-start gap-1.5 text-xs">
                    <Check className="w-3.5 h-3.5 mt-0.5 text-foreground shrink-0" />
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
