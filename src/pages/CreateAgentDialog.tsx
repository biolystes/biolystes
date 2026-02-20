import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Bot,
  Sparkles,
  FlaskConical,
  Scissors,
  Wand2,
  Rocket,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const agentTypes = [
  {
    id: "COACH_SKINCARE",
    category: "Skincare",
    title: "Coach Skincare",
    description: "Accompagne les clients vers une routine skincare personnalisée.",
    icon: Sparkles,
  },
  {
    id: "DIAGNOSTIQUEUR_HAIRCARE",
    category: "Haircare",
    title: "Diagnostiqueur Haircare",
    description: "Analyse capillaire et routine sur-mesure pour cheveux texturés.",
    icon: Scissors,
  },
  {
    id: "MULTI_PRODUCT_DIAGNOSTIC_PRO",
    category: "Skincare",
    title: "Diagnostiqueur IA Pro",
    description: "Analyse experte avec recommandations produits de votre catalogue.",
    icon: FlaskConical,
  },
  {
    id: "MIX_DIAGNOSTIC",
    category: "Multi",
    title: "Diagnostiqueur Mix",
    description: "Détecte visage ou cheveux et applique le bon diagnostic automatiquement.",
    icon: Wand2,
  },
  {
    id: "BRAND_LAUNCH",
    category: "Stratégie",
    title: "Conseiller Lancement Marque",
    description: "Guide pour lancer une marque bio avec sélection de produits.",
    icon: Rocket,
  },
];

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAgentDialog({ open, onOpenChange }: CreateAgentDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    expertName: "",
    description: "",
  });
  const { toast } = useToast();

  const handleCreate = () => {
    toast({
      title: "Agent créé avec succès",
      description: `L'agent "${formData.name}" a été créé.`,
    });
    onOpenChange(false);
    setStep(1);
    setSelectedType("");
    setFormData({ name: "", expertName: "", description: "" });
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep(1);
    setSelectedType("");
    setFormData({ name: "", expertName: "", description: "" });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="krona text-lg">
            {step === 1 ? "Choisir un type d'agent" : "Configurer l'agent"}
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 1 ? "bg-primary" : "bg-border"}`} />
          <div className={`h-1.5 flex-1 rounded-full transition-all ${step >= 2 ? "bg-primary" : "bg-border"}`} />
        </div>

        {step === 1 && (
          <div className="space-y-3">
            {agentTypes.map((type) => (
              <motion.div
                key={type.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedType(type.id)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  selectedType === type.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-muted-foreground/30 hover:bg-accent"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <type.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">{type.category}</Badge>
                      <h3 className="font-semibold text-sm">{type.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedType}
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de l'agent *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Coach Skincare Pro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expertName">Nom de l'expert IA *</Label>
              <Input
                id="expertName"
                value={formData.expertName}
                onChange={(e) => setFormData({ ...formData, expertName: e.target.value })}
                placeholder="Ex: Dr. Sarah Martin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnel)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez l'expertise et la spécialité de cet agent..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Retour
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!formData.name || !formData.expertName}
              >
                <Bot className="h-4 w-4 mr-2" />
                Créer l'agent
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
