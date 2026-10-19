"use client";

import {
  createContext,
  forwardRef,
  useContext,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cva } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Field: label + hint + error, wired to the control through context ─────

interface FieldContextValue {
  id: string;
  describedBy?: string;
  invalid: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export interface FieldProps {
  id: string;
  label: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
}

export function Field({
  id,
  label,
  children,
  hint,
  error,
  required,
  optional,
  className,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <FieldContext.Provider value={{ id, describedBy, invalid: !!error }}>
      <div className={cn("flex flex-col gap-1.5", className)}>
        <label htmlFor={id} className="font-jakarta text-[15px] font-semibold text-black">
          {label}
          {required && (
            <span className="text-red-700" aria-hidden="true">
              *
            </span>
          )}
          {optional && <span className="font-normal text-black/55"> (optional)</span>}
        </label>
        {children}
        {hint && !error && (
          <p id={hintId} className="text-[13px] text-black/60 leading-snug">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-[13px] font-medium text-red-700 leading-snug">
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}

function useFieldProps(props: { id?: string; "aria-describedby"?: string; "aria-invalid"?: unknown }) {
  const ctx = useContext(FieldContext);
  return {
    id: props.id ?? ctx?.id,
    "aria-describedby": props["aria-describedby"] ?? ctx?.describedBy,
    "aria-invalid": (props["aria-invalid"] as boolean | undefined) ?? (ctx?.invalid || undefined),
  };
}

// ── Controls ───────────────────────────────────────────────────────────────

export const controlVariants = cva(
  [
    "w-full rounded-xl border-2 border-black/80 bg-theme-beige px-4 text-[16px] text-black",
    "placeholder:text-black/40 outline-none transition-[border-color,box-shadow] duration-200",
    "focus:border-black focus-visible:ring-[3px] focus-visible:ring-theme-yellow",
    "aria-[invalid=true]:border-red-600 aria-[invalid=true]:focus-visible:ring-red-200",
    "disabled:cursor-not-allowed disabled:opacity-60",
  ]
);

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    const field = useFieldProps(props);
    return (
      <input
        ref={ref}
        {...props}
        {...field}
        className={cn(controlVariants(), "h-12", className)}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 4, ...props }, ref) => {
  const field = useFieldProps(props);
  return (
    <textarea
      ref={ref}
      rows={rows}
      {...props}
      {...field}
      className={cn(controlVariants(), "resize-none py-3 leading-relaxed", className)}
    />
  );
});
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    const field = useFieldProps(props);
    return (
      <div className="relative">
        <select
          ref={ref}
          {...props}
          {...field}
          className={cn(controlVariants(), "h-12 appearance-none pr-10", className)}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-black/70"
        />
      </div>
    );
  }
);
Select.displayName = "Select";
