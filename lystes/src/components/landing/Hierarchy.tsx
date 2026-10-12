import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getJsxT } from "@lystes/i18n/jsx-locale";
import { Slider } from "@lystes/components/ui/slider";
import { computeAgentCounts } from "@lystes/hooks/useAgentCounts";
import Organigramme from "@lystes/components/team/Organigramme";

export function Hierarchy({ className }: { className?: string }) {
  const { i18n } = useTranslation();
  const t = getJsxT("home-blocks", i18n.language || "fr");
  const [productCount, setProductCount] = useState(180);

  // Compute agent total dynamically (ugc=140, hasDiagnostic=true for landing demo)
  const counts = computeAgentCounts(productCount, 140, true);

  return (
    <section id="equipe" className={`py-[80px] md:py-[120px] bg-background pt-10 md:pt-14 ${className ?? ""}`} style={{ paddingTop: 0, paddingBottom: 0 }}>
      <style>{`
        .hierarchy-slider [role="slider"] {
          position: relative;
          box-shadow: 0 0 0 0 hsl(var(--primary) / 0.6);
          animation: hierarchy-thumb-pulse 1.6s cubic-bezier(0.4,0,0.6,1) infinite;
        }
        @keyframes hierarchy-thumb-pulse {
          0% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.55), 0 0 0 0 hsl(var(--primary) / 0.35); }
          70% { box-shadow: 0 0 0 14px hsl(var(--primary) / 0), 0 0 0 22px hsl(var(--primary) / 0); }
          100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0), 0 0 0 0 hsl(var(--primary) / 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hierarchy-slider [role="slider"] { animation: none; }
        }
      `}</style>
      <div className="max-w-[1280px] mx-auto px-5 md:px-[clamp(20px,5vw,80px)]">
        <div className="text-center max-w-5xl mx-auto px-3 sm:px-6 pt-24 md:pt-40 pb-4 md:pb-6" style={{ paddingBottom: 0 }}>
          <video
            className="cost-loop"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{ margin: "0 auto", position: "relative", width: 100, height: "100%", objectFit: "contain", background: "transparent" }}
          >
            <source src="https://lystes.ai/__l5e/assets-v1/8d11cd50-0ca9-455b-819a-60177d01ff1e/cost-loop-optimized.webm" type="video/webm" />
            <source src="https://lystes.ai/__l5e/assets-v1/9ef01efe-a334-4b75-8b29-c32ed4ca1e3f/cost-loop-optimized.mp4" type="video/mp4" />
          </video>
          <p className="text-[10px] font-bold tracking-[2.5px] text-neutral-500 mb-5">
            {t("UNE ÉQUIPE POUR CHAQUE PRODUIT")}
          </p>
          <h2 className="font-['Inter'] font-thin text-[28px] sm:text-[40px] md:text-[51px] leading-[1.1] tracking-tight max-w-[780px] mx-auto mb-6 text-neutral-900">
            {t("Combien d'agents IA composeront vos futures équipes ?")}
          </h2>
          <p className="text-[14px] md:text-[17px] text-neutral-600 leading-[1.7] mx-auto whitespace-pre-line" style={{ maxWidth: 446 }}>
            {t("Chaque produit de votre catalogue génère automatiquement des agents spécialisés en conversion, création de contenu et marketing.")}
          </p>
        </div>

        <h3 className="text-[28px] font-thin tracking-tight mb-4 leading-[1.1] text-center mt-8">
          <span className="font-['Inter'] italic">
            {productCount} {t("produits")}
          </span>{" "}
          <span className="font-['Inter'] italic text-muted-foreground">
            {counts.grandTotal} {t("agents dédiés")}
          </span>
        </h3>


        {/* Slider — déplacé juste avant l'organigramme pour guider l'oeil vers Cléa */}
        <div className="hierarchy-slider w-full max-w-[400px] mx-auto mt-10 mb-8">
          <div className="flex items-center justify-between text-[12px] text-muted-foreground mb-2">
            <span>{`10 ${t("produits")}`}</span>
            <span>{`1000 ${t("produits")}`}</span>
          </div>
          <Slider
            value={[productCount]}
            onValueChange={(v) => setProductCount(v[0])}
            min={10}
            max={1000}
            step={1}
            className="w-full"
          />
        </div>

        {/* Organigramme */}
        <Organigramme variant="landing" fixedProductCount={productCount} />
      </div>

    </section>
  );
}
