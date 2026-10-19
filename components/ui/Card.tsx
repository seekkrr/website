import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Thick-bordered, big-radius card with the site's flat offset shadows. */
export const cardVariants = cva("relative border-black", {
  variants: {
    tone: {
      beige: "bg-theme-beige text-black",
      white: "bg-white text-black",
      yellow: "bg-theme-yellow text-black",
      blue: "bg-theme-blue text-black",
      orange: "bg-theme-orange text-black",
      green: "bg-theme-green text-theme-beige",
      black: "bg-black text-white",
    },
    border: {
      thick: "border-[3px]",
      regular: "border-2",
      thin: "border-[1.5px]",
    },
    radius: {
      md: "rounded-[18px]",
      lg: "rounded-[24px]",
      xl: "rounded-[24px] xl:rounded-[32px]",
    },
    shadow: {
      none: "",
      yellow: "[box-shadow:6px_6px_0_var(--color-yellow-accent)]",
      orange: "[box-shadow:6px_6px_0_var(--color-orange-accent)]",
      blue: "[box-shadow:6px_6px_0_var(--color-blue-accent)]",
      black: "[box-shadow:6px_6px_0_#000]",
    },
    hoverShadow: {
      none: "",
      yellow:
        "transition-all duration-300 hover:-translate-y-1 hover:[box-shadow:8px_8px_0_var(--color-yellow-accent)] focus-within:[box-shadow:8px_8px_0_var(--color-yellow-accent)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      orange:
        "transition-all duration-300 hover:-translate-y-1 hover:[box-shadow:8px_8px_0_var(--color-orange-accent)] focus-within:[box-shadow:8px_8px_0_var(--color-orange-accent)] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
    },
  },
  defaultVariants: {
    tone: "beige",
    border: "thick",
    radius: "lg",
    shadow: "none",
    hoverShadow: "none",
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, tone, border, radius, shadow, hoverShadow, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ tone, border, radius, shadow, hoverShadow }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";
