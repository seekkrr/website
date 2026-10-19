"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { CollabCard } from "@/components/collabs/CollabCard";

const TRUST_POINTS = ["Check-in verified visits", "Your own 4-digit redeem code", "₹0 to start"];

export function BusinessHero() {
  const reduceMotion = useReducedMotion();
  const enter = (delay: number, from: { x?: number; y?: number; scale?: number }) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, ...from },
          animate: { opacity: 1, x: 0, y: 0, scale: 1 },
          transition: { duration: 0.8, delay, ease: "easeOut" as const },
        };

  return (
    <section className="relative flex w-full justify-center overflow-x-clip bg-theme-beige px-4 pb-8 pt-32 sm:px-6 md:px-12 lg:px-24">
      <div className="relative mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 rounded-[32px] border-[3px] border-black bg-theme-beige px-5 pb-10 pt-8 sm:px-10 sm:pb-14 sm:pt-12 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:px-14 lg:py-16">
        <div className="flex min-w-0 flex-col items-start text-left">
          <motion.div {...enter(0, { y: 20 })}>
            <Badge variant="outline" size="lg" className="mb-6">
              <span className="h-2 w-2 rounded-full bg-theme-orange" aria-hidden="true" />
              SeekKrr for Business · piloting in Bir
            </Badge>
          </motion.div>

          <motion.h1
            {...enter(0.1, { y: 20 })}
            className="font-jakarta text-[32px] font-bold leading-[1.15] tracking-tight text-black sm:text-[40px] lg:text-[46px] xl:text-[52px]"
          >
            Turn your café, hostel or adventure into a{" "}
            <span className="relative inline-block whitespace-nowrap pb-[10px] text-theme-green [text-shadow:3px_3px_0_var(--color-yellow-accent)] sm:[text-shadow:4px_4px_0_var(--color-yellow-accent)]">
              creator hotspot
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
            {...enter(0.25, { y: 20 })}
            className="mt-6 max-w-[560px] text-[16px] leading-relaxed text-black/75 sm:text-[18px]"
          >
            Post a collab, let travel creators who are already in town check in and redeem it with
            your staff code, and get content with disclosure built in. No agencies, no DMs, no
            cash changing hands.
          </motion.p>

          <motion.div {...enter(0.35, { y: 20 })} className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/business/apply" className={buttonVariants({ variant: "primary", size: "lg" })}>
              List your business
            </Link>
            <a href="#builder" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Build a collab
            </a>
          </motion.div>

          <motion.ul {...enter(0.45, { y: 10 })} className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-1.5 font-jakarta text-[14px] font-semibold text-black/80">
                <Check className="h-4 w-4 text-theme-green" strokeWidth={3} aria-hidden="true" />
                {point}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div {...enter(0.3, { scale: 0.94, y: 30 })} className="relative mx-auto w-full max-w-[400px] lg:mr-0">
          <div className="absolute -left-2 -top-5 z-10 -rotate-6 sm:-left-6">
            <Badge variant="blue" size="lg" className="shadow-[3px_3px_0_#000]">
              What creators see
            </Badge>
          </div>
          <div className="rotate-[1.5deg]">
            <CollabCard
              businessName="Garden Café, Bir"
              want="1 reel + 3 stories at golden hour"
              offer="Breakfast for two"
              description="Film our terrace with the Dhauladhars behind you. Tag @gardencafebir."
              mode="open"
              disclosure="#collab"
            />
          </div>
          <div className="absolute -bottom-5 right-2 z-10 rotate-6 rounded-full border-[3px] border-black bg-theme-green px-4 py-2 font-jakarta text-[14px] font-bold text-theme-beige shadow-[3px_3px_0_var(--color-yellow-accent)]">
            Redeemed ✓ 10:42 am
          </div>
        </motion.div>
      </div>
    </section>
  );
}
