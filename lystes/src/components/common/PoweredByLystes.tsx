import { cn } from "@lystes/lib/utils";

const LYSTES_LOGO_URL = "https://sjvxyiqiacpwskglgxkf.supabase.co/storage/v1/object/public/logo/lystes.PNG";

interface PoweredByLystesProps {
  className?: string;
  variant?: "light" | "dark";
}

/**
 * PoweredByLystes - Branding component linking to lystes.ai
 * 
 * Use this component to add "Powered by Lystes.ai" branding
 * in modals, widgets, and expert cards.
 */
export function PoweredByLystes({ className, variant = "light" }: PoweredByLystesProps) {
  // Hide on the particuliers site — branding stamp is only meant for embedded widgets / demos.
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    const isParticuliers =
      path === "/p" ||
      path.startsWith("/p/") ||
      path === "/fashion" ||
      path.startsWith("/fashion/");
    if (isParticuliers) return null;
  }

  return (
    <a
      href="https://lystes.ai"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ouvrir lystes.ai"
      className={cn(
        "inline-flex flex-col items-center justify-center gap-1 text-[10px] transition-opacity hover:opacity-80",
        variant === "light" ? "text-muted-foreground" : "text-muted-foreground",
        className
      )}
    >
      <span className="font-semibold underline underline-offset-2">lystes.ai</span>
      <img 
        src={LYSTES_LOGO_URL} 
        alt="Lystes" 
        className="animate-spin-slow"
        style={{ 
          animationDuration: "5s",
          minWidth: "62px",
          minHeight: "62px",
          marginTop: "11px",
          marginBottom: "13px"
        }}
      />
    </a>
  );
}
