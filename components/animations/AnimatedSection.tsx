"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp } from "@/lib/animations/variants";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    variants?: Variants;
    /** Trigger animation only once when in view */
    once?: boolean;
    /** Viewport threshold (0-1) for triggering animation */
    amount?: number;
    /** Delay in seconds before animation starts */
    delay?: number;
    /** HTML tag to render as */
    as?: "div" | "section" | "article" | "main" | "header" | "footer";
}

/**
 * Scroll-triggered animation wrapper.
 * Animates children when they enter the viewport.
 * Uses only transform and opacity for 60fps GPU-accelerated animations.
 */
export function AnimatedSection({
    children,
    className,
    variants = fadeUp,
    once = true,
    amount = 0.2,
    delay = 0,
    as = "div",
}: AnimatedSectionProps) {
    const Component = motion[as];

    return (
        <Component
            initial="hidden"
            whileInView="visible"
            viewport={{ once, amount }}
            variants={variants}
            transition={{ delay }}
            className={cn("gpu-accelerated", className)}
        >
            {children}
        </Component>
    );
}
