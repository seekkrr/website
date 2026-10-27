"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { CollabCard } from "@/components/collabs/CollabCard";
import { siteFeatures } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import { COLLAB_EXAMPLES } from "./collabExamples";

const ROTATE_MS = 4500;

/**
 * "What creators see": cycles through the builder's examples. Every card sits
 * in the same grid cell, so the box is always as tall as the tallest example
 * (no layout shift). Pauses on hover/focus; never auto-rotates with reduced motion.
 */
function RotatingCollabCard() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = hovered || focused;

  useEffect(() => {
    if (reduceMotion || paused) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % COLLAB_EXAMPLES.length), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [reduceMotion, paused]);

  return (
    <div
      className="relative"
      role="group"
      aria-roledescription="carousel"
      aria-label="Example UGC briefs"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className="absolute -left-2 -top-5 z-10 -rotate-6 sm:-left-6">
        <Badge variant="blue" size="lg" className="shadow-[3px_3px_0_#000]">
          What creators see
        </Badge>
      </div>

      <div className="grid">
        {COLLAB_EXAMPLES.map((example, i) => {
          const active = i === index;
          return (
            <motion.div
              key={example.label}
              className="[grid-area:1/1]"
              aria-hidden={!active}
              initial={false}
              animate={active ? { opacity: 1, y: 0, rotate: 1.5 } : { opacity: 0, y: 14, rotate: 1.5 }}
              transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
              style={{ pointerEvents: active ? "auto" : "none" }}
            >
              <CollabCard
                businessName={example.place}
                want={example.draft.want}
                offer={example.draft.offer}
                description={example.draft.description}
                mode={example.draft.mode}
                deliverables={example.draft.deliverables}
                disclosure={example.draft.disclosure}
                className="h-full pb-9 sm:pb-10"
              />
            </motion.div>
          );
        })}
      </div>

      <motion.div
        key={index}
        aria-hidden="true"
        initial={reduceMotion ? false : { scale: 0.4, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 6 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 16, delay: 0.35 }}
        className="absolute -bottom-5 right-2 z-10 rounded-full border-[3px] border-black bg-theme-green px-4 py-2 font-jakarta text-[14px] font-bold text-theme-beige shadow-[3px_3px_0_var(--color-yellow-accent)]"
      >
        Redeemed ✓
      </motion.div>

      {/* Manual picker: 44px hit areas around small dots. */}
      <div role="group" className="mt-6 flex items-center justify-center" aria-label="Choose an example">
        {COLLAB_EXAMPLES.map((example, i) => (
          <button
            key={example.label}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show the ${example.label} example`}
            aria-current={i === index ? "true" : undefined}
            className="group flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
          >
            <span
              className={cn(
                "block h-2.5 rounded-full border-2 border-black transition-all duration-300 motion-reduce:transition-none",
                i === index ? "w-7 bg-theme-yellow" : "w-2.5 bg-white group-hover:bg-black/20"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function BusinessHero() {
  const reduceMotion = useReducedMotion();
  const enter = (delay: number, from: { x?: number; y?: number; scale?: number }) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, ...from },
          animate: { opacity: 1, x: 0, y: 0, scale: 1 },
          transition: { duration: 0.7, delay, ease: "easeOut" as const },
        };

  return (
    <section
      id="business-hero"
      className="relative flex w-full justify-center overflow-x-clip bg-theme-beige px-4 pb-6 pt-24 sm:px-6 sm:pt-28 md:px-12 lg:px-24"
    >
      <div className="relative mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-8 rounded-[32px] border-[3px] border-black bg-theme-beige px-5 pb-6 pt-6 sm:px-8 sm:pb-8 sm:pt-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:px-12 lg:py-10">
        <div className="flex min-w-0 flex-col items-start text-left">
          <motion.div {...enter(0, { y: 20 })}>
            <Badge variant="outline" size="lg" className="mb-4">
              <span className="h-2 w-2 rounded-full bg-theme-orange" aria-hidden="true" />
              SeekKrr for Business · Piloting in Bir
            </Badge>
          </motion.div>

          <motion.h1
            {...enter(0.1, { y: 20 })}
            className="font-jakarta text-[32px] font-bold leading-[1.15] tracking-tight text-black sm:text-[40px] lg:text-[46px] xl:text-[52px]"
          >
            Turn your Business into a{" "}
            <span className="relative inline-block whitespace-nowrap pb-[10px] text-theme-green [text-shadow:3px_3px_0_var(--color-yellow-accent)] sm:[text-shadow:4px_4px_0_var(--color-yellow-accent)]">
              Creator Hotspot
              <span className="absolute bottom-0 left-0 flex w-full flex-col" aria-hidden="true">
                <span className="h-[2px] w-full bg-theme-green" />
                <span className="mt-[1px] h-[4px] w-full bg-theme-yellow" />
              </span>
              <Image
                src="/assets/images/Stars.svg"
                alt=""
                aria-hidden="true"
                width={40}
                height={48}
                className="pointer-events-none absolute -right-7 -top-6 h-auto w-8 sm:-right-9 sm:w-10"
              />
            </span>
          </motion.h1>

          <motion.p
            {...enter(0.2, { y: 20 })}
            className="mt-4 max-w-[560px] text-[16px] leading-relaxed text-black/75 sm:text-[18px]"
          >
            Cafes, Properties, Adventures, Workshops or Experiences — find Creators that fit your
            business requirements and manage leads in one app.
          </motion.p>

          {/* Sticker: the tilt lives on the inner element so framer's inline transform can't reset it.
              The row only renders while plans and/or AI matching are switched on. */}
          {(siteFeatures.plans || siteFeatures.matchmaking) && (
            <motion.div {...enter(0.3, { y: 10 })} className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
              {siteFeatures.plans && (
                <p className="inline-flex -rotate-3 items-center gap-2 rounded-[14px] border-[3px] border-black bg-theme-yellow px-4 py-2 font-jakarta text-[20px] font-extrabold leading-none tracking-tight text-black shadow-[4px_4px_0_0_#000] sm:text-[24px]">
                  <Sparkles className="h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2.5} aria-hidden="true" />
                  ₹0 to start
                </p>
              )}
              {/* Hidden on phones: there's no room beside the sticker, and wrapped under it the pair looks cramped. */}
              {siteFeatures.matchmaking && (
                <a
                  href="#ai-matching"
                  className="hidden rotate-2 items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-black bg-black px-3 py-1.5 font-jakarta text-[13px] font-bold leading-none text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:inline-flex sm:text-[14px]"
                >
                  AI Match
                  {siteFeatures.plans && (
                    <span className="rounded-full bg-theme-yellow px-1.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-black">
                      Pro
                    </span>
                  )}
                </a>
              )}
            </motion.div>
          )}

          <motion.div
            {...enter(0.35, { y: 20 })}
            className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap"
          >
            <Link href="/business/apply" className={buttonVariants({ variant: "primary", size: "lg" })}>
              List your business
            </Link>
            <a href="#builder" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Build a UGC brief
            </a>
          </motion.div>
        </div>

        <motion.div {...enter(0.3, { scale: 0.94, y: 30 })} className="relative mx-auto w-full max-w-[400px] pt-3 lg:mr-0">
          <RotatingCollabCard />
        </motion.div>
      </div>
    </section>
  );
}
