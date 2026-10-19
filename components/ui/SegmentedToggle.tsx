"use client";

import { useId, useRef, type KeyboardEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: ReactNode;
  /** Small extra label rendered after the option text (e.g. "2 months free"). */
  badge?: ReactNode;
}

export interface SegmentedToggleProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  size?: "sm" | "md";
  className?: string;
}

/** Radio-group pill toggle with a sliding black thumb. Arrow keys move the selection. */
export function SegmentedToggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
  className,
}: SegmentedToggleProps<T>) {
  const layoutId = useId();
  const reduceMotion = useReducedMotion();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % options.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (index - 1 + options.length) % options.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = options.length - 1;
    else return;
    e.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full border-[3px] border-black bg-white p-1",
        className
      )}
    >
      {options.map((option, index) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={cn(
              "relative flex min-w-0 items-center justify-center gap-2 rounded-full font-jakarta font-bold transition-colors duration-200",
              "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue focus-visible:ring-offset-2",
              size === "sm" ? "px-4 py-1.5 text-[14px]" : "px-5 py-2.5 text-[15px] sm:px-6 sm:text-[16px]",
              selected ? "text-white" : "text-black hover:bg-black/5"
            )}
          >
            {selected && (
              <motion.span
                layoutId={layoutId}
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-black"
                transition={
                  reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }
                }
              />
            )}
            <span className="relative z-10 truncate">{option.label}</span>
            {option.badge && <span className="relative z-10 shrink-0">{option.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
