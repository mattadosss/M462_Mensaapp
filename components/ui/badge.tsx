import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-0.5 text-xs font-bold font-sans transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-[#EAF8E2] text-[#6CA12B]",
        discount:
          "bg-[#EAF8E2] text-[#6CA12B]",
        blue:
          "bg-[#E6F0FF] text-[#3B82F6]",
        destructive:
          "bg-destructive text-destructive-foreground",
        outline: "bg-transparent text-foreground border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
