import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Pill buttons in the site's flat, bordered style. Use `buttonVariants()` to
 * style a `<Link>` or `<a>` the same way (there is no Slot/asChild here).
 */
export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-full font-jakarta font-bold",
    "transition-all duration-200 select-none text-center",
    "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue focus-visible:ring-offset-2 focus-visible:ring-offset-theme-beige",
    "disabled:pointer-events-none disabled:opacity-60",
    "active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100",
  ],
  {
    variants: {
      variant: {
        primary: "bg-black text-white border-2 border-black hover:bg-black/85",
        outline:
          "bg-white text-black border-[3px] border-black [box-shadow:4px_4px_0_var(--color-blue-accent)] hover:-translate-y-0.5 hover:[box-shadow:6px_6px_0_var(--color-blue-accent)] motion-reduce:hover:translate-y-0",
        yellow:
          "bg-theme-yellow text-black border-[3px] border-black [box-shadow:4px_4px_0_#000] hover:-translate-y-0.5 hover:[box-shadow:6px_6px_0_#000] motion-reduce:hover:translate-y-0",
        light: "bg-white text-black border-2 border-white hover:bg-theme-beige",
        ghost: "bg-transparent text-black border-2 border-transparent hover:bg-black/5",
      },
      size: {
        sm: "text-[14px] px-5 py-2",
        md: "text-[16px] px-7 py-3 sm:px-8 sm:py-3.5",
        lg: "text-[17px] sm:text-[18px] px-8 py-3.5 sm:px-10 sm:py-4",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
