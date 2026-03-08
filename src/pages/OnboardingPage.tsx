import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import StepProfile from "@/components/onboarding/StepProfile";
import StepBrand from "@/components/onboarding/StepBrand";
import StepProducts from "@/components/onboarding/StepProducts";
import StepPack from "@/components/onboarding/StepPack";
import StepContract from "@/components/onboarding/StepContract";
import StepPayment from "@/components/onboarding/StepPayment";

const STEPS = [
  { label: "Profil", component: StepProfile },
  { label: "Marque", component: StepBrand },
  { label: "Produits", component: StepProducts },
  { label: "Pack", component: StepPack },
  { label: "Contrat", component: StepContract },
  { label: "Paiement", component: StepPayment },
];

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { currentStep, setStep } = useOnboardingStore();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-muted-foreground">Chargement...</div>;

  const StepComponent = STEPS[currentStep].component;

  return (
    <div className="min-h-screen bg-background">
      {/* Stepper */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => (
              <button
                key={i}
                onClick={() => {
                  if (i < currentStep) setStep(i);
                }}
                className="flex items-center gap-2 group"
                disabled={i > currentStep}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < currentStep
                    ? "bg-foreground text-background"
                    : i === currentStep
                    ? "bg-foreground text-background ring-2 ring-foreground ring-offset-2 ring-offset-background"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  i <= currentStep ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={`hidden sm:block w-8 h-px mx-2 ${
                    i < currentStep ? "bg-foreground" : "bg-border"
                  }`} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
