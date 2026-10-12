import { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2, Sparkles, RotateCcw, Download, User, ArrowRight, Camera, Video } from "lucide-react";
import { PoweredByLystes } from "@lystes/components/common/PoweredByLystes";
import { Dialog, DialogContent } from "@lystes/components/ui/dialog";
import { Button } from "@lystes/components/ui/button";
import { Input } from "@lystes/components/ui/input";
import { supabase } from "@lystes/integrations/supabase/client";
import { toast } from "sonner";
import { prepareImageForTryOn } from "@lystes/utils/imageHelpers";
import { RealtimeTryOn } from "@lystes/components/capabilities/RealtimeTryOn";
import { TryOnLimitBanner } from "@lystes/components/tryon/TryOnLimitBanner";
import type { SectorCapability } from "@lystes/config/sector-capabilities";
import { useAccount } from "@lystes/contexts/AccountContext";

interface QuickTryOnProduct {
  name: string;
  imageUrl: string;
  price?: string;
  productId?: string;
}

interface QuickTryOnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: QuickTryOnProduct;
  agentId?: string;
  agentType?: string;
  sectorCapability?: SectorCapability;
}

type TryOnMode = "photo" | "realtime";
type Step = "firstName" | "modeSelect" | "upload" | "generating" | "result" | "realtime" | "limit_reached";

export function QuickTryOnModal({ open, onOpenChange, product, agentId, agentType, sectorCapability }: QuickTryOnModalProps) {
  const { selectedAccountId } = useAccount();
  const [step, setStep] = useState<Step>("firstName");
  const [tryOnMode, setTryOnMode] = useState<TryOnMode>("photo");
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [limitInfo, setLimitInfo] = useState<{ used: number; max: number; message?: string } | null>(null);

  // Check if realtime try-on is available
  const hasRealtimeTryOn = sectorCapability?.tryonConfig?.enabled && sectorCapability?.tryonConfig?.mode === 'realtime';

  // Determine if this is a wig try-on (uses wig-tryon function) or generic (uses virtual-tryon)
  const isWigTryon = !agentType || agentType === 'wig_tryon';
  
  // Sector-adaptive labels
  const TRYON_LABELS: Record<string, { action: string; productLabel: string; productType: string }> = {
    wig_tryon: { action: 'Essayez cette perruque', productLabel: 'perruque', productType: 'wig' },
    glasses_tryon: { action: 'Essayez ces lunettes', productLabel: 'lunettes', productType: 'glasses' },
    clothing_tryon: { action: 'Essayez ce vêtement', productLabel: 'vêtement', productType: 'clothing' },
    makeup_tryon: { action: 'Essayez ce maquillage', productLabel: 'maquillage', productType: 'makeup' },
    shoes_tryon: { action: 'Essayez ces chaussures', productLabel: 'chaussures', productType: 'shoes' },
    jewelry_tryon: { action: 'Essayez ce bijou', productLabel: 'bijou', productType: 'jewelry' },
    watch_tryon: { action: 'Essayez cette montre', productLabel: 'montre', productType: 'watch' },
    decor_tryon: { action: 'Visualisez ce meuble', productLabel: 'meuble', productType: 'decor' },
  };
  const labels = TRYON_LABELS[agentType || 'wig_tryon'] || TRYON_LABELS.wig_tryon;

  const isFirstNameValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(firstName.trim());

  const handleFirstNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirstNameValid) {
      setFirstNameError("Veuillez entrer un email valide");
      return;
    }
    setFirstNameError("");
    // If realtime is available, show mode selection; otherwise go to upload
    if (hasRealtimeTryOn) {
      setStep("modeSelect");
    } else {
      setStep("upload");
    }
  };

  const handleSelectMode = (mode: TryOnMode) => {
    setTryOnMode(mode);
    if (mode === "realtime") {
      setStep("realtime");
    } else {
      setStep("upload");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("L'image est trop volumineuse (max 10MB)");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserPhoto(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleGenerate = async () => {
    if (!userPhoto) return;
    
    setIsGenerating(true);
    setStep("generating");
    
    try {
      const productImage = await prepareImageForTryOn(product.imageUrl);
      
      if (isWigTryon) {
        const { data, error } = await supabase.functions.invoke("wig-tryon", {
          body: {
            agent_id: agentId || null,
            user_photo_base64: userPhoto,
            product_id: product.productId || null,
            product_image_url: productImage,
            product_name: product.name,
            first_name: firstName.trim() || 'Visiteur',
            email: null,
            visitor_id: `quick_${Date.now()}`,
            source: "quick-tryon",
          },
        });
        
        if (error) {
          // Check for limit reached
          if (data?.error === 'tryon_limit_reached') {
            setLimitInfo({ used: data.tryons_used, max: data.tryons_max, message: data.message });
            setStep("limit_reached");
            return;
          }
          console.warn("[QuickTryOn] wig-tryon failed, trying virtual-tryon:", error);
        } else if (data?.result_photo_url) {
          setGeneratedImage(data.result_photo_url);
          if (data.tryons_max) {
            setLimitInfo({ used: data.tryons_used, max: data.tryons_max });
          }
          if (data.persistError) {
            console.error("wig-tryon persist error:", data.persistError);
            toast.warning("Votre essayage a bien été généré, mais n'a pas pu être enregistré dans votre historique.");
          }
          setStep("result");
          return;
        }
      }
      
      const { data: vtData, error: vtError } = await supabase.functions.invoke("virtual-tryon", {
        body: {
          userPhoto,
          productPhoto: await prepareImageForTryOn(product.imageUrl),
          productType: labels.productType,
          productName: product.name,
          agentId: agentId,
          productId: product.productId,
          productPrice: product.price,
          productImageUrl: product.imageUrl,
          source: "quick-tryon",
        },
      });
      
      if (vtError) throw vtError;
      
      if (vtData?.generatedImage) {
        setGeneratedImage(vtData.generatedImage);
        if (vtData.persistError) {
          console.error("virtual-tryon persist error:", vtData.persistError);
          toast.warning("Votre essayage a bien été généré, mais n'a pas pu être enregistré dans votre historique.");
        }
        setStep("result");
      } else {
        throw new Error("No image generated");
      }
    } catch (error) {
      console.error("Try-on error:", error);
      toast.error("Erreur lors de la génération. Veuillez réessayer.");
      setStep("upload");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setUserPhoto(null);
    setGeneratedImage(null);
    setStep("upload");
  };

  const handleFullReset = () => {
    setFirstName("");
    setFirstNameError("");
    setUserPhoto(null);
    setGeneratedImage(null);
    setTryOnMode("photo");
    setStep("firstName");
  };

  const handleClose = () => {
    handleFullReset();
    onOpenChange(false);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `essayage-${product.name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image téléchargée !");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={`p-0 overflow-hidden bg-background rounded-2xl border-0 shadow-2xl ${step === 'realtime' ? 'sm:max-w-2xl' : 'sm:max-w-md'}`}>
        {/* Header avec produit */}
        {step !== "realtime" && (
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center gap-3">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-14 h-14 rounded-xl object-cover ring-1 ring-border"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">{product.name}</h3>
                {product.price && (
                  <p className="text-sm text-muted-foreground">{product.price}</p>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-primary mt-0.5">
                  <Sparkles className="w-3 h-3" />
                  Essayage virtuel
                </span>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className={step === "realtime" ? "" : "p-5"}>
          {/* Step 1: Email Capture */}
          {step === "firstName" && (
            <form onSubmit={handleFirstNameSubmit} className="space-y-4">
              <div className="text-center">
                <h4 className="font-medium text-foreground mb-1">
                  {labels.action}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Votre email pour personnaliser l'essayage
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground text-left block">
                  Votre email <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    inputMode="email"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setFirstNameError("");
                    }}
                    placeholder="Votre email"
                    autoFocus
                    className="pl-10 h-11 rounded-xl"
                    required
                    autoComplete="email"
                    autoCapitalize="off"
                  />
                </div>
                {firstNameError && (
                  <p className="text-xs text-destructive">{firstNameError}</p>
                )}
              </div>

              <Button 
                type="submit"
                disabled={!isFirstNameValid}
                className="w-full h-11 rounded-full"
              >
                Continuer
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          )}

          {/* Step: Mode Selection (photo vs realtime) */}
          {step === "modeSelect" && (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="font-medium text-foreground mb-1">
                  Choisissez votre mode d'essayage
                </h4>
                <p className="text-sm text-muted-foreground">
                  Essayez en temps réel ou uploadez une photo
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSelectMode("realtime")}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-border hover:border-primary hover:bg-accent/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Temps réel</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Via votre caméra</p>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectMode("photo")}
                  className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-border hover:border-primary hover:bg-accent/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Camera className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">Par photo</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Uploadez une image</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Realtime try-on mode */}
          {step === "realtime" && sectorCapability && selectedAccountId && (
            <RealtimeTryOn
              agentId={agentId || ''}
              accountId={selectedAccountId}
              product={{
                id: product.productId || '',
                name: product.name,
                image_url: product.imageUrl,
                price: product.price,
              }}
              sectorCapability={sectorCapability}
              onClose={handleClose}
              onFallbackPhoto={() => {
                setTryOnMode("photo");
                setStep("upload");
              }}
            />
          )}

          {/* Step 2: Upload */}
          {step === "upload" && (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="font-medium text-foreground mb-1">
                  Uploadez votre photo
                </h4>
                <p className="text-sm text-muted-foreground">
                  Voyez comment {labels.productLabel === 'perruque' ? 'cette perruque' : `ce ${labels.productLabel}`} vous irait
                </p>
              </div>
              
              {!userPhoto ? (
                <label 
                  className="block"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center hover:border-muted-foreground/50 hover:bg-muted/50 cursor-pointer transition-all">
                    <div className="w-14 h-14 mx-auto bg-muted rounded-2xl flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Cliquez pour uploader
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      ou glissez-déposez une image
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-3">
                      JPG, PNG • Max 10MB
                    </p>
                  </div>
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden bg-muted">
                    <img 
                      src={userPhoto} 
                      alt="Votre photo"
                      className="w-full aspect-[3/4] object-cover"
                    />
                    <button
                      onClick={() => setUserPhoto(null)}
                      className="absolute top-3 right-3 p-2 bg-background/70 hover:bg-background rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-foreground" />
                    </button>
                  </div>
                  
                  <Button 
                    onClick={handleGenerate}
                    className="w-full h-12 text-base rounded-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {labels.action}
                  </Button>
                </div>
              )}

              {/* Back to mode select if realtime available */}
              {hasRealtimeTryOn && (
                <button
                  onClick={() => setStep("modeSelect")}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Changer de mode d'essayage
                </button>
              )}
            </div>
          )}
          
          {/* Step 3: Generating — rich loading with progress & tips */}
          {step === "generating" && (
            <GeneratingStep userPhoto={userPhoto!} />
          )}
          
          {/* Step 4: Result */}
          {step === "result" && generatedImage && (
            <div className="space-y-4">
              {limitInfo && (
                <TryOnLimitBanner tryonsUsed={limitInfo.used} tryonsMax={limitInfo.max} />
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-2 text-center font-medium">Avant</p>
                  <div className="rounded-xl overflow-hidden bg-muted ring-1 ring-border">
                    <img 
                      src={userPhoto!} 
                      alt="Avant"
                      className="w-full aspect-[3/4] object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2 text-center font-medium">Après</p>
                  <div className="rounded-xl overflow-hidden bg-muted ring-1 ring-primary/30">
                    <img 
                      src={generatedImage} 
                      alt="Après"
                      className="w-full aspect-[3/4] object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="flex-1 rounded-full"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleDownload}
                  className="rounded-full px-4"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground">
                Vous aimez le résultat ? Ajoutez ce produit au panier !
              </p>
            </div>
          )}

          {/* Step: Limit Reached */}
          {step === "limit_reached" && limitInfo && (
            <div className="py-4">
              <TryOnLimitBanner
                tryonsUsed={limitInfo.used}
                tryonsMax={limitInfo.max}
                limitReached
                limitMessage={limitInfo.message}
              />
            </div>
          )}
          
          {/* Powered by Lystes.ai */}
          {step !== "realtime" && (
            <div className="pt-4 text-center">
              <PoweredByLystes />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const TRYON_TIPS = [
  "Analyse de votre photo en cours…",
  "Ajustement de la lumière et des couleurs…",
  "Superposition du produit sur votre image…",
  "Harmonisation des tons et contrastes…",
  "Renforcement de la netteté…",
  "Vérification du rendu final…",
  "Finalisation de l'image haute qualité…",
  ];

function GeneratingStep({ userPhoto }: { userPhoto: string }) {
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * TRYON_TIPS.length));
  const [progress, setProgress] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TRYON_TIPS.length);
    }, 3000);
    return () => clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      // Ease-out curve: fast start, gradually slows, caps at 92%
      const ratio = Math.min(elapsed / (60 * 1000), 1);
      const eased = 1 - Math.pow(1 - ratio, 2.5);
      setProgress(eased * 92);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-6 text-center space-y-5">
      <div className="relative w-20 h-20 mx-auto">
        <img
          src={userPhoto}
          alt="Votre photo"
          className="w-full h-full object-cover rounded-full ring-4 ring-muted"
        />
        <div className="absolute inset-0 bg-background/40 rounded-full flex items-center justify-center backdrop-blur-[1px]">
          <Sparkles className="w-7 h-7 text-primary animate-pulse" />
        </div>
      </div>

      <div>
        <h4 className="font-medium text-foreground mb-1">Génération en cours...</h4>
        <p className="text-xs text-muted-foreground">Environ 15–30 secondes</p>
      </div>

      {/* Progress bar */}
      <div className="mx-auto max-w-[220px] space-y-1.5">
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground">{Math.round(progress)}%</p>
      </div>

      {/* Rotating tip */}
      <p
        key={tipIndex}
        className="text-xs text-muted-foreground animate-fade-in min-h-[1.25rem]"
      >
        {TRYON_TIPS[tipIndex]}
      </p>
    </div>
  );
}

export default QuickTryOnModal;
