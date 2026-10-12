import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Camera, ShoppingCart, Loader2, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Button } from "@lystes/components/ui/button";
import { cn } from "@lystes/lib/utils";
import { useDecartTryOn, TryOnState } from "@lystes/hooks/useDecartTryOn";
import type { SectorCapability } from "@lystes/config/sector-capabilities";

interface RealtimeTryOnProduct {
  id: string;
  name: string;
  description?: string;
  image_url: string;
  price?: string | number;
  add_to_cart_url?: string;
}

interface RealtimeTryOnProps {
  agentId: string;
  accountId: string;
  product: RealtimeTryOnProduct;
  sectorCapability: SectorCapability;
  onAddToCart?: (productId: string) => void;
  onClose: () => void;
  onFallbackPhoto?: () => void;
}

function StatusDot({ state }: { state: TryOnState }) {
  const color =
    state === "active"
      ? "bg-green-500"
      : state === "connecting" || state === "requesting"
        ? "bg-orange-400 animate-pulse"
        : state === "error"
          ? "bg-red-500"
          : "bg-muted-foreground/30";

  return <span className={cn("w-2.5 h-2.5 rounded-full inline-block", color)} />;
}

export function RealtimeTryOn({
  agentId,
  accountId,
  product,
  sectorCapability,
  onAddToCart,
  onClose,
  onFallbackPhoto,
}: RealtimeTryOnProps) {
  const { t } = useTranslation();

  const promptTemplate =
    sectorCapability.tryonConfig?.promptTemplate ||
    "Show the person wearing {product_name}. {product_description}";

  const {
    state,
    errorMessage,
    isMobile,
    localVideoRef,
    remoteVideoRef,
    start,
    stop,
    markAddedToCart,
  } = useDecartTryOn({
    accountId,
    agentId,
    product: {
      id: product.id,
      name: product.name,
      description: product.description,
      image_url: product.image_url,
    },
    promptTemplate,
    idealResolution: sectorCapability.tryonConfig?.idealResolution,
    fallbackToPhoto: sectorCapability.tryonConfig?.fallbackToPhoto ?? true,
    onStateChange: (newState) => {
      if (newState === "fallback_photo" && onFallbackPhoto) {
        onFallbackPhoto();
      }
    },
  });

  const handleAddToCart = () => {
    markAddedToCart();
    onAddToCart?.(product.id);
  };

  const handleClose = async () => {
    if (state === "active" || state === "connecting") {
      await stop();
    }
    onClose();
  };

  return (
    <div className="bg-background rounded-xl overflow-hidden border border-border shadow-lg max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-foreground" />
          <span className="text-sm font-medium text-foreground">
            Essayage Virtuel
          </span>
          <StatusDot state={state} />
        </div>
        <button
          onClick={handleClose}
          className="p-1 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* IDLE state */}
        {state === "idle" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Camera className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                {sectorCapability.description}
              </p>
              <p className="text-xs text-muted-foreground">
                Votre caméra sera utilisée pour l'essayage en temps réel
              </p>
            </div>
            <Button onClick={start} className="gap-2">
              <Camera className="w-4 h-4" />
              Activer la caméra
            </Button>
          </div>
        )}

        {/* REQUESTING / CONNECTING */}
        {(state === "requesting" || state === "connecting") && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {state === "requesting"
                ? "Accès à la caméra..."
                : "Connexion au serveur d'essayage..."}
            </p>
          </div>
        )}

        {/* ACTIVE — video streams */}
        {state === "active" && (
          <div className="space-y-4">
            <div
              className={cn(
                "gap-3",
                isMobile ? "flex flex-col" : "grid grid-cols-2"
              )}
            >
              {/* Local webcam (hidden on mobile) */}
              {!isMobile && (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium text-center">
                    Vous
                  </p>
                  <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Transformed video */}
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <Wifi className="w-3 h-3 text-primary" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Essayage
                  </p>
                </div>
                <div
                  className={cn(
                    "rounded-xl overflow-hidden bg-muted",
                    isMobile ? "aspect-[9/16]" : "aspect-video"
                  )}
                >
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Product info + CTA */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {product.name}
                </p>
                {product.price && (
                  <p className="text-xs text-muted-foreground">
                    {typeof product.price === "number"
                      ? `${product.price} €`
                      : product.price}
                  </p>
                )}
              </div>
              {onAddToCart && (
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className="gap-1.5 whitespace-nowrap"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Ajouter au panier
                </Button>
              )}
            </div>
          </div>
        )}

        {/* ERROR state */}
        {state === "error" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                Erreur d'essayage
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                {errorMessage || "Une erreur est survenue. Veuillez réessayer."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Fermer
              </Button>
              <Button size="sm" onClick={start} className="gap-1.5">
                <Camera className="w-3.5 h-3.5" />
                Réessayer
              </Button>
            </div>
          </div>
        )}

        {/* FALLBACK PHOTO */}
        {state === "fallback_photo" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <WifiOff className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">
                Caméra non disponible
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                L'accès à la caméra a été refusé. Vous pouvez utiliser
                l'essayage par photo à la place.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClose}>
                Fermer
              </Button>
              {onFallbackPhoto && (
                <Button size="sm" onClick={onFallbackPhoto} className="gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  Essayer par photo
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
