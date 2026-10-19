"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Camera,
  KeyRound,
  MapPin,
  PenLine,
  Star,
  Ticket,
  type LucideIcon,
} from "lucide-react";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { SectionHeading } from "@/components/collabs/SectionHeading";

type View = "business" | "creator";

interface Step {
  title: string;
  body: string;
  icon: LucideIcon;
}

const STEPS: Record<View, Step[]> = {
  business: [
    {
      title: "Post a collab",
      body: "Say what you want (a reel, stories, a Google review) and what you offer. Choose Open for walk-ins or Approval to see creators first.",
      icon: PenLine,
    },
    {
      title: "Creators check in and redeem",
      body: "A creator checks in at your place on SeekKrr. Your staff type your 4-digit code on their phone, and the visit is logged.",
      icon: KeyRound,
    },
    {
      title: "Get content, rate, repeat",
      body: "Links arrive with the disclosure label in your dashboard. Rate the creator, and see the visits their posts send your way.",
      icon: Star,
    },
  ],
  creator: [
    {
      title: "Check in nearby",
      body: "Spot an “Open for collabs” pin on the SeekKrr map, check in when you arrive, and see what the place is offering.",
      icon: MapPin,
    },
    {
      title: "Redeem or avail",
      body: "Open collabs redeem on the spot when staff enter their code. Approval collabs share your creator profile first.",
      icon: Ticket,
    },
    {
      title: "Post with disclosure, get rated",
      body: "Follow the brief, tag the place, add #ad, #collab or #gifted, and drop your links in the app. Good ratings unlock better collabs.",
      icon: Camera,
    },
  ],
};

const CARD_TONES = [
  "bg-white [box-shadow:6px_6px_0_var(--color-yellow-accent)]",
  "bg-white [box-shadow:6px_6px_0_var(--color-blue-accent)]",
  "bg-white [box-shadow:6px_6px_0_var(--color-orange-accent)]",
];

export function HowItWorks() {
  const [view, setView] = useState<View>("business");
  const reduceMotion = useReducedMotion();
  const id = useId();

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="relative w-full bg-theme-beige px-4 py-16 sm:px-6 md:px-12 lg:px-24 lg:py-20"
    >
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center">
        <SectionHeading id={`${id}-title`} eyebrow="Three steps, both sides" title="How it works" className="mb-6" />
        <SegmentedToggle<View>
          ariaLabel="Show steps for"
          value={view}
          onChange={setView}
          options={[
            { value: "business", label: "For businesses" },
            { value: "creator", label: "For creators" },
          ]}
          className="mb-10"
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.ol
            key={view}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
            className="grid w-full grid-cols-1 gap-6 md:grid-cols-3 xl:gap-8"
          >
            {STEPS[view].map((step, index) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.title}
                  className={`flex flex-col gap-4 rounded-[24px] border-[3px] border-black p-6 transition-transform duration-300 hover:-translate-y-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 xl:rounded-[32px] xl:p-8 ${CARD_TONES[index]}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-theme-yellow font-jakarta text-[20px] font-extrabold"
                    >
                      {index + 1}
                    </span>
                    <Icon className="h-8 w-8 text-theme-green" aria-hidden="true" />
                  </div>
                  <h3 className="font-jakarta text-[20px] font-bold leading-tight text-black lg:text-[22px]">
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-black/75 lg:text-[16px]">{step.body}</p>
                </li>
              );
            })}
          </motion.ol>
        </AnimatePresence>
      </div>
    </section>
  );
}
