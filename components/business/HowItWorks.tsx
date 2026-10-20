"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Camera,
  Check,
  KeyRound,
  MapPin,
  PenLine,
  Play,
  Ticket,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { SectionHeading } from "@/components/collabs/SectionHeading";
import { cn } from "@/lib/utils";

type View = "business" | "creator";
type Visual = "collab" | "pin" | "code" | "content";

interface Step {
  title: string;
  body: string;
  icon: LucideIcon;
  visual: Visual;
}

const STEPS: Record<View, Step[]> = {
  business: [
    {
      title: "Post a collab",
      body: "Say what you want to create (a reel, stories or posts) and what you offer for it.",
      icon: PenLine,
      visual: "collab",
    },
    {
      title: "Creators check in and redeem",
      body: "A creator checks in at your place on SeekKrr. Your staff type your 4-digit code on their phone.",
      icon: KeyRound,
      visual: "code",
    },
    {
      title: "Get Content, Repeat, Scale",
      body: "Match with creators that fit your brand and grow your business.",
      icon: TrendingUp,
      visual: "content",
    },
  ],
  creator: [
    {
      title: "Check in nearby",
      body: "Spot an “Open for collabs” pin on the map and check in when you arrive.",
      icon: MapPin,
      visual: "pin",
    },
    {
      title: "Redeem or avail",
      body: "Open: walk in directly to redeem the collab. Approval: the business reviews and approves you to confirm it.",
      icon: Ticket,
      visual: "code",
    },
    {
      title: "Post with disclosure, get rated",
      body: "Follow the brief, add #ad, #collab or #gifted, and drop your links in the app.",
      icon: Camera,
      visual: "content",
    },
  ],
};

const STEP_SHADOWS = [
  "shadow-[5px_5px_0_0_var(--color-yellow-accent)]",
  "shadow-[5px_5px_0_0_var(--color-blue-accent)]",
  "shadow-[5px_5px_0_0_var(--color-orange-accent)]",
];

/** Small "done" chip that pops in on each screen. */
function DoneChip({ label, delay, reduceMotion }: { label: string; delay: number; reduceMotion: boolean }) {
  return (
    <motion.span
      initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 18, delay }}
      className="inline-flex items-center gap-1 rounded-full border-2 border-black bg-theme-green px-2.5 py-1 font-jakarta text-[11px] font-bold text-theme-beige"
    >
      <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
      {label}
    </motion.span>
  );
}

const Bar = ({ className }: { className?: string }) => <span className={cn("block h-2 rounded-full bg-black/15", className)} />;

function Screen({ visual, reduceMotion }: { visual: Visual; reduceMotion: boolean }) {
  if (visual === "collab") {
    return (
      <div className="flex h-full flex-col gap-3 p-3">
        <p className="font-jakarta text-[12px] font-extrabold text-black">New collab</p>
        <div className="flex flex-col gap-2 rounded-xl border-2 border-black bg-white p-2.5">
          <span className="font-jakarta text-[9px] font-bold uppercase tracking-wider text-black/50">Want</span>
          <Bar className="w-11/12 bg-theme-green/40" />
          <Bar className="w-2/3 bg-theme-green/40" />
          <span className="mt-1 font-jakarta text-[9px] font-bold uppercase tracking-wider text-black/50">For</span>
          <Bar className="w-3/4 bg-theme-yellow" />
        </div>
        <div className="flex gap-1.5">
          {["Reel", "Story", "Post"].map((t) => (
            <span key={t} className="rounded-full border-2 border-black bg-theme-beige px-2 py-0.5 font-jakarta text-[10px] font-bold">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex flex-col items-center gap-2">
          <span className="w-full rounded-full bg-black py-2 text-center font-jakarta text-[11px] font-bold text-white">
            Post collab
          </span>
          <DoneChip label="Posted" delay={0.5} reduceMotion={reduceMotion} />
        </div>
      </div>
    );
  }

  if (visual === "pin") {
    return (
      <div className="relative h-full overflow-hidden bg-[radial-gradient(circle,rgba(0,0,0,0.12)_1px,transparent_1px)] [background-size:14px_14px]">
        <span className="absolute left-0 top-[38%] h-3 w-full -rotate-6 bg-white/90" aria-hidden="true" />
        <span className="absolute left-[55%] top-0 h-full w-3 rotate-6 bg-white/90" aria-hidden="true" />
        <motion.div
          className="absolute left-1/2 top-[30%] -translate-x-1/2"
          initial={reduceMotion ? false : { y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 12 }}
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-black bg-theme-orange shadow-[3px_3px_0_0_#000]">
            <MapPin className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
        </motion.div>
        <div className="absolute inset-x-3 bottom-3 flex flex-col items-start gap-2 rounded-xl border-2 border-black bg-white p-2.5">
          <span className="font-jakarta text-[11px] font-extrabold">Open for collabs</span>
          <Bar className="w-3/4" />
          <DoneChip label="Checked in" delay={0.6} reduceMotion={reduceMotion} />
        </div>
      </div>
    );
  }

  if (visual === "code") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-3">
        <p className="font-jakarta text-[12px] font-extrabold text-black">Staff code</p>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="flex h-10 w-8 items-center justify-center rounded-lg border-[3px] border-black bg-white"
            >
              <motion.span
                className="block h-2.5 w-2.5 rounded-full bg-black"
                initial={reduceMotion ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={reduceMotion ? { duration: 0 } : { delay: 0.25 + i * 0.22, type: "spring", stiffness: 500, damping: 20 }}
              />
            </span>
          ))}
        </div>
        <DoneChip label="Redeemed" delay={1.25} reduceMotion={reduceMotion} />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-2.5 p-3">
      <div className="relative flex aspect-[4/5] w-full items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-theme-yellow via-theme-orange to-theme-blue">
        <motion.span
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.4 }}
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-white"
        >
          <Play className="h-4 w-4 fill-black" aria-hidden="true" />
        </motion.span>
        <span className="absolute left-2 top-2 rounded-full border-2 border-black bg-white px-2 py-0.5 font-jakarta text-[10px] font-bold">
          #collab
        </span>
      </div>
      <Bar className="w-5/6" />
      <DoneChip label="Link added" delay={0.5} reduceMotion={reduceMotion} />
    </div>
  );
}

/** CSS-only phone that illustrates the active step. */
function Phone({ view, step, reduceMotion }: { view: View; step: Step; reduceMotion: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-[320px] w-[180px] shrink-0 rounded-[32px] border-[3px] border-black bg-black p-[7px] shadow-[8px_8px_0_0_var(--color-blue-accent)] sm:h-[360px] sm:w-[200px]"
    >
      <span className="absolute left-1/2 top-[11px] z-10 h-[6px] w-12 -translate-x-1/2 rounded-full bg-white/25" />
      <div className="relative h-full w-full overflow-hidden rounded-[25px] bg-theme-beige pt-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${view}-${step.visual}`}
            className="h-full"
            initial={reduceMotion ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: -24 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
          >
            <Screen visual={step.visual} reduceMotion={reduceMotion} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const [view, setView] = useState<View>("business");
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion() ?? false;
  const id = useId();
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  // The highlight follows the scroll: a step becomes active as it crosses the
  // middle of the viewport. A click (or tap) picks a step directly.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = stepRefs.current.indexOf(entry.target as HTMLLIElement);
          if (index >= 0) setActive(index);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [view]);

  const steps = STEPS[view];

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="relative w-full bg-theme-beige px-4 py-10 sm:px-6 md:px-12 md:py-14 lg:px-24 lg:py-16"
    >
      <div className="mx-auto w-full max-w-[1080px]">
        <div className="flex flex-col items-center">
          <SectionHeading id={`${id}-title`} eyebrow="Three steps, both sides" title="How it works" className="mb-4 md:mb-5" />
          <SegmentedToggle<View>
            ariaLabel="Show steps for"
            value={view}
            onChange={setView}
            options={[
              { value: "business", label: "For businesses" },
              { value: "creator", label: "For creators" },
            ]}
            className="mb-6 md:mb-8"
          />
        </div>

        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_auto] md:gap-10 lg:gap-16">
          <ol className="flex flex-col gap-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === active;
              return (
                <li
                  key={`${view}-${step.title}`}
                  ref={(el) => {
                    stepRefs.current[index] = el;
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "flex w-full items-start gap-4 rounded-[20px] border-[3px] p-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue motion-reduce:transition-none sm:p-5",
                      isActive
                        ? cn("border-black bg-white md:-translate-y-0.5", STEP_SHADOWS[index])
                        : "border-black/15 bg-transparent hover:border-black/40"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[3px] font-jakarta text-[18px] font-extrabold transition-colors duration-300",
                        isActive ? "border-black bg-theme-yellow text-black" : "border-black/25 bg-white text-black/45"
                      )}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span
                          className={cn(
                            "font-jakarta text-[17px] font-bold leading-tight sm:text-[19px]",
                            isActive ? "text-black" : "text-black/60"
                          )}
                        >
                          <span className="sr-only">Step {index + 1}: </span>
                          {step.title}
                        </span>
                        <Icon
                          className={cn("ml-auto h-5 w-5 shrink-0", isActive ? "text-theme-green" : "text-black/30")}
                          aria-hidden="true"
                        />
                      </span>
                      <span
                        className={cn(
                          "mt-1 block text-[14px] leading-snug sm:text-[15px]",
                          isActive ? "text-black/75" : "text-black/50"
                        )}
                      >
                        {step.body}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <Phone view={view} step={steps[active]} reduceMotion={reduceMotion} />
        </div>
      </div>
    </section>
  );
}
