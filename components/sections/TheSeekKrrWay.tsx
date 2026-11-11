"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config/site";

/*
 * "How SeekKrr works", chalked on a blackboard: businesses provide
 * requirements, creators find clear UGC briefs, they travel and shoot, and
 * the content is approved. The board and its words are built in code (not
 * one image) so the words can change; the three step drawings are the
 * original board's chalk art. One board, laid out across on md+ and down on
 * phones.
 */

const CHALK = "#F3F1E7";

/** Chalk lines: round, slightly rough strokes. */
function ChalkArt({ viewBox, className, children }: { viewBox: string; className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      className={className}
      fill="none"
      stroke={CHALK}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g filter="url(#seekkrr-chalk)">{children}</g>
    </svg>
  );
}

function SpecialArt({ className }: { className?: string }) {
  return (
    <ChalkArt viewBox="0 0 80 112" className={className}>
      <path d="M14 4h52a8 8 0 0 1 8 8v88a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8V12a8 8 0 0 1 8-8Z" />
      <path d="M74 26v12M74 44v8" />
      <path d="M33 10h14" />
      <text x="40" y="36" textAnchor="middle" fill={CHALK} stroke="none" className="font-handwriting" fontSize="14" fontWeight="700">
        Approved
      </text>
      <path d="M22 46q18 8 36 0" strokeWidth="1.6" />
      {/* a pin on the map */}
      <path d="M40 76c-6-7-7-10-7-13a7 7 0 0 1 14 0c0 3-1 6-7 13Z" strokeWidth="1.8" />
      <circle cx="40" cy="63" r="2" />
      <path d="M20 86h40a6 6 0 0 1 0 12H20a6 6 0 0 1 0-12Z" strokeWidth="1.8" />
      <text x="40" y="95.5" textAnchor="middle" fill={CHALK} stroke="none" className="font-handwriting" fontSize="9" fontWeight="700">
        Explore
      </text>
    </ChalkArt>
  );
}

function Arrow({ down, className }: { down?: boolean; className?: string }) {
  return down ? (
    <ChalkArt viewBox="0 0 24 50" className={className}>
      <path d="M12 3v42M4 36l8 9 8-9" />
    </ChalkArt>
  ) : (
    <ChalkArt viewBox="0 0 58 24" className={className}>
      <path d="M3 12h50M43 4l10 8-10 8" />
    </ChalkArt>
  );
}

const U = ({ children }: { children: ReactNode }) => (
  <span className="whitespace-nowrap underline decoration-[1.5px] underline-offset-[5px]">{children}</span>
);

/*
 * The three drawings are the original board's chalk art, cut out onto
 * transparent backgrounds. Each keeps its size relative to the others (the
 * bus is shorter than the beach), so the heights differ per step.
 */
const STEPS: { text: ReactNode; src: string; alt: string; width: number; height: number; size: string }[] = [
  {
    text: <><U>Businesses</U> provide <U>requirements</U></>,
    src: "/assets/images/how-it-works/step-1.png",
    alt: "Chalk drawing of mountains, a beach umbrella and a lounger",
    width: 171,
    height: 106,
    size: "h-[80px] md:h-[66px] lg:h-[90px] xl:h-[106px]",
  },
  {
    text: <><U>Creators</U> find clear <U>UGC briefs</U></>,
    src: "/assets/images/how-it-works/step-2.png",
    alt: "Chalk drawing of a cyclist and people chatting under a tree",
    width: 146,
    height: 109,
    size: "h-[82px] md:h-[68px] lg:h-[93px] xl:h-[109px]",
  },
  {
    text: <><U>Travel</U> and <U>Shoot</U></>,
    src: "/assets/images/how-it-works/step-3.png",
    alt: "Chalk drawing of a bus and a little shop",
    width: 169,
    height: 77,
    size: "h-[58px] md:h-[48px] lg:h-[65px] xl:h-[77px]",
  },
];

function Blackboard() {
  return (
    <div className="relative w-full rounded-[22px] border-[3px] border-black bg-[#2E1B10] p-[10px] [box-shadow:9px_9px_0_var(--color-yellow-accent)] sm:p-[12px] md:rounded-[26px]">
      {/* the chalk's roughness, shared by every drawing on the board */}
      <svg aria-hidden="true" className="absolute h-0 w-0">
        <filter id="seekkrr-chalk" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div
        className="relative overflow-hidden rounded-[14px] border-[3px] border-black px-6 py-9 font-handwriting text-[#F3F1E7] [text-shadow:0_0_1px_rgba(255,255,255,0.45)] md:rounded-[16px] md:px-7 md:py-10 lg:px-10"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.05), transparent 55%), radial-gradient(ellipse at 80% 75%, rgba(255,255,255,0.04), transparent 50%), #0D3B33",
        }}
      >
        <div className="flex flex-col items-center md:flex-row md:items-start">
          {/* the steps; on md+ each arrow sits in the gap before its step, so the steps share the width evenly */}
          <ol className="flex w-full flex-col items-center gap-2 md:min-w-0 md:flex-1 md:flex-row md:items-start md:gap-[64px] lg:gap-[80px]">
            {STEPS.map(({ text, src, alt, width, height, size }, i) => (
              <li key={i} className="relative flex w-full min-w-0 max-w-[250px] flex-col items-center md:max-w-none md:flex-1 md:items-start">
                {i > 0 && <Arrow down className="mb-2 h-[44px] w-[20px] md:hidden" />}
                {i > 0 && <Arrow className="absolute right-[calc(100%+6px)] top-[24px] hidden h-[22px] w-[52px] md:block lg:right-[calc(100%+8px)] lg:top-[37px] lg:w-[64px] xl:top-[45px]" />}
                {/* drawings sit on a shared baseline, as on the original board */}
                <div className="flex h-[84px] max-w-full items-end md:h-[70px] lg:h-[96px] xl:h-[112px]">
                  <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className={`${size} w-auto max-w-full object-contain object-bottom`}
                  />
                </div>
                <p className="mt-3 text-[22px] leading-[1.35] md:text-[19px] lg:text-[24px]">
                  {i + 1}. {text}
                </p>
              </li>
            ))}
          </ol>

          {/* and the content is approved */}
          <div className="my-2 flex w-full shrink-0 justify-center md:mx-3 md:my-0 md:mt-[24px] md:w-auto lg:mx-4 lg:mt-[37px] xl:mt-[45px]">
            <Arrow down className="h-[44px] w-[20px] md:hidden" />
            <Arrow className="hidden h-[22px] w-[52px] md:block lg:w-[64px]" />
          </div>
          <div className="flex shrink-0 flex-col items-center md:w-[140px] lg:w-[170px]">
            <SpecialArt className="h-[112px] w-[80px] lg:h-[124px] lg:w-[88px]" />
            <p className="mt-3 text-center text-[22px] leading-tight md:text-[20px] lg:text-[26px]">It&apos;s that Easy</p>
            <p className="text-center text-[40px] font-bold leading-none md:text-[34px] lg:text-[40px]">Approved</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TheSeekKrrWay() {
  return (
    <section className="w-full bg-theme-beige overflow-hidden flex flex-col items-center justify-center -mt-12 sm:-mt-20 lg:-mt-32 mb-0 lg:mb-4 relative z-20 pointer-events-none text-center">
      {/* pointer-events-none added to section so it doesn't block scroll but we'll enable it on inner contents if needed */}
      <div className="w-full max-w-[1240px] mx-auto px-2 lg:px-4 flex flex-col items-center gap-0 pointer-events-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center justify-center text-center mx-auto w-full mb-1 sm:mb-2 lg:mb-4"
          style={{ willChange: "transform, opacity" }}
        >
          <h2
            className="font-jakarta text-[36px] sm:text-[42px] lg:text-[48px] leading-[1.1] font-semibold tracking-wide whitespace-pre-line text-theme-green [-webkit-text-stroke:1px_black] [text-shadow:4px_4px_0_var(--color-yellow-accent)]"
          >
            {`How ${siteConfig.name} works`}
          </h2>
        </motion.div>

        {/* The recipe, chalked on the board */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="w-full flex justify-center pb-3 pr-3 pt-2 text-left"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="w-full max-w-[500px] md:max-w-[1140px]">
            <Blackboard />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
