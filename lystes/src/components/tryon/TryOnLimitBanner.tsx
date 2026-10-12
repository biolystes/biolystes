import { AlertCircle } from "lucide-react";

interface TryOnLimitBannerProps {
  tryonsUsed: number;
  tryonsMax: number;
  /** Show the full "limit reached" block instead of just a counter */
  limitReached?: boolean;
  /** Custom message when limit is reached */
  limitMessage?: string;
}

/**
 * Shows a discrete counter "Essai 2/5" or a full limit-reached message
 */
export function TryOnLimitBanner({
  tryonsUsed,
  tryonsMax,
  limitReached,
  limitMessage,
}: TryOnLimitBannerProps) {
  if (limitReached) {
    return (
      <div className="w-full max-w-md mx-auto animate-[biolystes-fadeInUp_0.5s_ease-out]">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-[#E8E8E8] p-6 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#F5F5F7] flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7 text-[#86868B]" />
          </div>
          <h3 className="text-lg font-semibold text-[#1D1D1F]">
            Limite atteinte
          </h3>
          <p className="text-sm text-[#86868B] max-w-xs mx-auto">
            {limitMessage || `Vous avez utilisé vos ${tryonsMax} essayage${tryonsMax > 1 ? "s" : ""} du jour. Revenez demain ! 😊`}
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="flex gap-1">
              {Array.from({ length: tryonsMax }).map((_, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-[#1D1D1F]"
                />
              ))}
            </div>
            <span className="text-xs font-medium text-[#86868B]">
              {tryonsUsed}/{tryonsMax}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Counter badge — shown on product selector / results
  const remaining = tryonsMax - tryonsUsed;
  const isLow = remaining <= 1;

  return (
    <div className="flex items-center justify-center gap-1.5 py-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: tryonsMax }).map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i < tryonsUsed ? "bg-[#1D1D1F]" : "bg-[#E8E8E8]"
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${isLow ? "text-orange-500" : "text-[#86868B]"}`}>
        Essai {tryonsUsed}/{tryonsMax}
        {isLow && remaining > 0 && " · Dernier essai !"}
      </span>
    </div>
  );
}
