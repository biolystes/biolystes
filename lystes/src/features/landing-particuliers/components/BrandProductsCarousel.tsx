import { useRef } from "react";
import { Link } from "@lystes/lib/lien-lystes";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@lystes/components/ui/carousel";
import { Star } from "lucide-react";
import type { BrandProductCard } from "@lystes/hooks/useBrandLanding";

interface Props {
  brandSlug: string;
  brandName: string;
  products: BrandProductCard[];
  hideSubtitle?: boolean;
}

import { TrustpilotStars } from "@lystes/components/reviews/TrustpilotStars";

function StarsRow({ rating }: { rating: number }) {
  return <TrustpilotStars rating={rating} size={12} />;
}

export default function BrandProductsCarousel({ brandSlug, brandName, products, hideSubtitle }: Props) {
  const autoplay = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  if (!products || products.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 pt-2 pb-12 md:pt-4 md:pb-16" style={{ background: "transparent" }}>
      <div className="mx-auto max-w-7xl">
        {!hideSubtitle && (
          <div className="mb-6 flex flex-col items-center gap-2">
            <p className="text-center text-xs" style={{ color: "hsl(var(--p-muted-foreground))" }}>
              {products.length} produits {brandName} notés par la communauté
            </p>
          </div>
        )}
        <Carousel opts={{ align: "start", loop: true }} plugins={[autoplay.current]} className="w-full">
          <CarouselContent className="-ml-4">
            {products.map((p) => (
              <CarouselItem
                key={p.slug}
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <Link
                  to={`/${brandSlug}/${p.slug}`}
                  className="group flex h-full flex-col bg-white transition-colors"
                  style={{ padding: 11, borderRadius: 11 }}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-white">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 flex-1 px-1">
                    <h3 className="text-sm font-medium leading-snug text-black line-clamp-2">
                      {p.name}
                    </h3>
                    {p.tagline && (
                      <p
                        className="mt-0.5 text-xs line-clamp-1"
                        style={{ color: "hsl(var(--p-muted-foreground))" }}
                      >
                        {p.tagline}
                      </p>
                    )}
                  </div>
                  {/* Sans avis réel, aucune notation n'est affichée : cinq
                      étoiles vides ou « 0 avis » se lisent comme une mauvaise
                      note, alors qu'il n'y a simplement rien à montrer. */}
                  {p.reviewsCount > 0 && (
                    <div className="mt-3 mb-2 flex items-center justify-between px-1">
                      <div className="flex items-center gap-1.5">
                        <StarsRow rating={p.rating} />
                        <span className="text-xs font-medium tabular-nums">{p.rating}</span>
                      </div>
                      <span
                        className="text-[11px]"
                        style={{ color: "hsl(var(--p-muted-foreground))" }}
                      >
                        {p.reviewsCount} avis
                      </span>
                    </div>
                  )}
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </div>
    </section>
  );
}
