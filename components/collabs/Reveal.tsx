"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Lift the element on hover, like the creator step cards. */
  lift?: boolean;
  /** Entrance offset in px. */
  y?: number;
  as?: "div" | "li" | "section" | "article";
}

/**
 * The site's standard entrance: fade up once when scrolled into view.
 * Renders statically (no movement) when the user prefers reduced motion.
 */
export function Reveal({ children, className, delay = 0, lift = false, y = 30, as = "div" }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];
  return (
    <Component
      initial={reduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={
        lift && !reduceMotion
          ? { y: -8, transition: { type: "spring", stiffness: 350, damping: 25 } }
          : undefined
      }
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </Component>
  );
}
