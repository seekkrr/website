"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** "single" closes the open item when another opens. */
  type?: "single" | "multiple";
  defaultOpen?: string[];
  className?: string;
  itemClassName?: string;
  /** Heading level for the item titles (keeps the document outline valid). */
  headingLevel?: 2 | 3 | 4;
}

export function Accordion({
  items,
  type = "single",
  defaultOpen = [],
  className,
  itemClassName,
  headingLevel = 3,
}: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const Heading = `h${headingLevel}` as const;

  const toggle = (id: string) =>
    setOpen((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return type === "single" ? [id] : [...prev, id];
    });

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div
            key={item.id}
            className={cn(
              "rounded-[20px] border-[3px] border-black bg-white transition-shadow duration-300",
              isOpen && "[box-shadow:5px_5px_0_var(--color-yellow-accent)]",
              itemClassName
            )}
          >
            <Heading className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 rounded-[17px] px-5 py-4 text-left font-jakarta text-[16px] font-bold text-black sm:px-6 sm:py-5 sm:text-[18px] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-theme-blue"
              >
                <span>{item.title}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-black transition-transform duration-300 motion-reduce:transition-none",
                    isOpen ? "rotate-45 bg-theme-yellow" : "bg-white"
                  )}
                >
                  <Plus className="h-4 w-4" strokeWidth={3} />
                </span>
              </button>
            </Heading>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  key="panel"
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-[15px] leading-relaxed text-black/75 sm:px-6 sm:text-[16px]">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
