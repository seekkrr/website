import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full border-2 font-jakarta font-bold leading-none",
  {
    variants: {
      variant: {
        yellow: "bg-theme-yellow text-black border-black",
        green: "bg-theme-green text-theme-beige border-theme-green",
        blue: "bg-theme-blue text-white border-black",
        orange: "bg-theme-orange text-white border-black",
        outline: "bg-white text-black border-black",
        dark: "bg-black text-white border-black",
        soft: "bg-black/5 text-black border-transparent",
      },
      size: {
        sm: "text-[11px] px-2 py-1",
        md: "text-[12px] px-2.5 py-1.5",
        lg: "text-[14px] px-3.5 py-2",
      },
    },
    defaultVariants: { variant: "yellow", size: "md" },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
