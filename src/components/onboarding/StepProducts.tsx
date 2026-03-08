import { useState } from "react";
import { useOnboardingStore, ProductItem } from "@/stores/onboardingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft, Plus, X, Package } from "lucide-react";

const SUGGESTED_PRODUCTS: ProductItem[] = [
  { id: 1, name: "Crème de jour anti-âge", price: 49.90 },
  { id: 2, name: "Sérum vitamine C", price: 39.90 },
  { id: 3, name: "Huile démaquillante", price: 29.90 },
  { id: 4, name: "Brume hydratante", price: 24.90 },
  { id: 5, name: "Baume à lèvres", price: 12.90 },
  { id: 6, name: "Masque purifiant", price: 34.90 },
  { id: 7, name: "Crème contour des yeux", price: 44.90 },
  { id: 8, name: "Gel nettoyant", price: 22.90 },
  { id: 9, name: "Lotion tonique", price: 19.90 },
  { id: 10, name: "Crème de nuit réparatrice", price: 54.90 },
];

export default function StepProducts() {
  const { products, setProducts, setStep, pack } = useOnboardingStore();
  const [customName, setCustomName] = useState("");
  const minProducts = pack === "decouverte" ? 4 : 1;

  const toggleProduct = (p: ProductItem) => {
    if (products.find((x) => x.id === p.id)) {
      setProducts(products.filter((x) => x.id !== p.id));
    } else {
      setProducts([...products, p]);
    }
  };

  const addCustom = () => {
    if (!customName.trim()) return;
    const id = Date.now();
    setProducts([...products, { id, name: customName.trim() }]);
    setCustomName("");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-foreground">Vos produits</h1>
      <p className="text-muted-foreground mb-8">
        Sélectionnez au moins {minProducts} produit{minProducts > 1 ? "s" : ""} pour votre gamme.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {SUGGESTED_PRODUCTS.map((p) => {
          const selected = !!products.find((x) => x.id === p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggleProduct(p)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selected
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:border-foreground/30"
              }`}
            >
              <Package className="w-5 h-5 mb-2 opacity-60" />
              <div className="text-sm font-medium">{p.name}</div>
              {p.price && <div className="text-xs opacity-70 mt-1">{p.price.toFixed(2)} €</div>}
            </button>
          );
        })}
      </div>

      {/* Custom product */}
      <div className="flex gap-2 mb-6">
        <Input
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Ajouter un produit personnalisé..."
          onKeyDown={(e) => e.key === "Enter" && addCustom()}
        />
        <Button variant="outline" onClick={addCustom} disabled={!customName.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Selected list */}
      {products.length > 0 && (
        <div className="mb-8 p-4 rounded-xl border border-border bg-secondary/30">
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
            {products.length} produit{products.length > 1 ? "s" : ""} sélectionné{products.length > 1 ? "s" : ""}
          </div>
          <div className="flex flex-wrap gap-2">
            {products.map((p) => (
              <span key={p.id} className="flex items-center gap-1.5 bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-medium">
                {p.name}
                <button onClick={() => setProducts(products.filter((x) => x.id !== p.id))} className="opacity-70 hover:opacity-100">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => setStep(1)} size="lg">
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour
        </Button>
        <Button onClick={() => setStep(3)} className="flex-1" size="lg" disabled={products.length < minProducts}>
          Continuer <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
