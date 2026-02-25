"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    /** Delay in seconds */
    delay?: number;
    /** Duration in seconds */
    duration?: number;
    /** Direction to fade from */
    direction?: "up" | "down" | "left" | "right" | "none";
    /** Distance in pixels for directional fade */
    distance?: number;
}

/**
 * Simple opacity fade wrapper with optional direction.
 * Supports staggered children animation.
 * Uses only transform and opacity for GPU acceleration.
 */
export function FadeIn({
    children,
    className,
    delay = 0,
    duration = 0.5,
    direction = "none",
    distance = 24,
}: FadeInProps) {
    const directionMap = {
        up: { y: distance },
        down: { y: -distance },
        left: { x: distance },
        right: { x: -distance },
        none: {},
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...directionMap[direction],
            }}
            animate={{
                opacity: 1,
                x: 0,
                y: 0,
            }}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.4, 0.25, 1],
            }}
            className={cn("gpu-accelerated", className)}
        >
            {children}
        </motion.div>
    );
}

interface StaggerChildrenProps {
    children: React.ReactNode;
    className?: string;
    /** Delay between each child animation */
    staggerDelay?: number;
}

/**
 * Container that staggers the animation of its children.
 * Wrap individual FadeIn components inside this for cascading effects.
 */
export function StaggerChildren({
    children,
    className,
    staggerDelay = 0.1,
}: StaggerChildrenProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
