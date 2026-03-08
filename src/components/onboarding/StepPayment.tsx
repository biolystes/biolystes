import { useOnboardingStore, PACKS } from "@/stores/onboardingStore";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, CheckCircle2 } from "lucide-react";

export default function StepPayment() {
  const { pack, setStep, contractSigned } = useOnboardingStore();
  const packInfo = PACKS[pack];

  if (!contractSigned) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <p className="text-muted-foreground mb-4">Vous devez signer le contrat avant de procéder au paiement.</p>
        <Button onClick={() => setStep(4)} variant="outline">
          Retour au contrat
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-foreground">Paiement</h1>
      <p className="text-muted-foreground mb-8">Finalisez votre inscription en réglant votre pack.</p>

      <div className="border border-border rounded-2xl p-6 mb-6 bg-secondary/20">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-muted-foreground">Pack {packInfo.label}</span>
          <span className="text-2xl font-bold text-foreground">{packInfo.setup_price.toLocaleString("fr-FR")} €</span>
        </div>
        {packInfo.monthly_price > 0 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">Abonnement {packInfo.monthly_name}</span>
            <span className="text-sm font-medium text-foreground">{packInfo.monthly_price} €/mois</span>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(4)} size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </Button>
        <Button
          className="flex-1"
          size="lg"
          onClick={() => {
            // Stripe integration will be added here
            window.open("https://app.iclosed.io/e/paylystes/r2", "_blank");
          }}
        >
          <CreditCard className="w-4 h-4 mr-2" /> Payer {packInfo.setup_price.toLocaleString("fr-FR")} €
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Paiement sécurisé. Vous serez redirigé vers notre plateforme de paiement.
      </p>
    </div>
  );
}
