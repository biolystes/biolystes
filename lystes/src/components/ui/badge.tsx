import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@lystes/lib/utils";

const badgeVariants = cva(
  // Aucune bordure : chaque variante se lit par son fond.
  "inline-flex items-center rounded-tag px-3 py-1 text-xs font-medium whitespace-nowrap transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-80",
        secondary: "bg-secondary text-secondary-foreground hover:opacity-80",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-80",
        // « outline » n'a plus de contour. Texte estompé sur voile de fond,
        // pour qu'il ne se confonde pas avec « secondary », qui garde un
        // texte franc sur un gris de même intensité.
        outline: "text-muted-foreground surface-field",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
