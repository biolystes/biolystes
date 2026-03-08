import { useOnboardingStore } from "@/stores/onboardingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function StepBrand() {
  const { brand, setBrand, setStep } = useOnboardingStore();

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-foreground">Votre marque</h1>
      <p className="text-muted-foreground mb-8">Décrivez la marque cosmétique que vous souhaitez créer.</p>

      <div className="space-y-6">
        <div>
          <Label>Nom de marque souhaité *</Label>
          <Input
            value={brand.brand_name}
            onChange={(e) => setBrand({ brand_name: e.target.value })}
            placeholder="Ex: Kaniwa Botanique"
            className="mt-1"
          />
        </div>

        <div>
          <Label>Description de votre univers de marque</Label>
          <Textarea
            value={brand.brand_description}
            onChange={(e) => setBrand({ brand_description: e.target.value })}
            placeholder="Décrivez votre vision, vos valeurs, votre positionnement..."
            className="mt-1 min-h-[120px]"
          />
        </div>

        <div>
          <Label>Marques d'inspiration</Label>
          <Input
            value={brand.inspiration_brands || ""}
            onChange={(e) => setBrand({ inspiration_brands: e.target.value })}
            placeholder="Ex: Typology, Patyka, Ilia..."
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <Button variant="outline" onClick={() => setStep(0)} size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </Button>
        <Button onClick={() => setStep(2)} className="flex-1" size="lg" disabled={!brand.brand_name}>
          Continuer <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
