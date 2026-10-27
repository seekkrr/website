"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { GoogleIcon } from "@/components/collabs/GoogleHandoffLink";
import { StoreBadges } from "@/components/collabs/StoreBadges";
import { trackEvent } from "@/lib/analytics";
import { CloudinaryIcons } from "@/lib/config/assets";
import { portalLinks } from "@/lib/config/site";

/*
 * The end of the collab trail: the sun comes up over the mountains, a
 * paraglider drifts past, and the creator's trip comes back as polaroids,
 * each "paid with" content, plus the seven stamps they collected.
 */

const POLAROIDS = [
  { icon: CloudinaryIcons.coffee, bg: "bg-theme-yellow", caption: "Lunch with a view", paid: "Paid with 1 Reel", rotate: -8 },
  { icon: CloudinaryIcons.sleepingBag, bg: "bg-theme-blue", caption: "Two nights in Bir", paid: "Paid with 2 Stories", rotate: 3 },
  { icon: CloudinaryIcons.balloon, bg: "bg-theme-orange", caption: "Up in the sky", paid: "Paid with 1 Reel", rotate: 10 },
];

const STAMPS = ["Profile", "Found", "Checked in", "Redeemed", "Code", "Created", "Posted"];
const STAMP_TONES = ["#FF5B25", "#003634", "#8398FF", "#FF5B25", "#003634", "#8398FF", "#FF5B25"];

function Paraglider() {
  return (
    <svg width="74" height="70" viewBox="0 0 74 70" aria-hidden="true">
      <path d="M4 22C14 6 60 6 70 22c-8-4-16-6-33-6S12 18 4 22Z" fill="#FF5B25" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M22 13v9M37 10v12M52 13v9" stroke="#000" strokeWidth="1.5" />
      <path d="M6 22 35 52M68 22 39 52M24 20l11 32M50 20 39 52" stroke="#000" strokeWidth="1" />
      <circle cx="37" cy="53" r="4" fill="#FECD36" stroke="#000" strokeWidth="2" />
      <path d="M33 58h8l-2 9h-4Z" fill="#8398FF" stroke="#000" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function Burst({ go }: { go: boolean }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const cols = ["#FECD36", "#FF5B25", "#8398FF", "#003634", "#A2548E"];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[38%] z-30">
      {Array.from({ length: 36 }, (_, i) => {
        const ang = (i / 36) * Math.PI * 2;
        const dist = 160 + (i % 6) * 45;
        return (
          <motion.span
            key={i}
            className="absolute block h-[10px] w-[18px] rounded-[2px] border-2 border-black"
            style={{ background: cols[i % cols.length] }}
            initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
            animate={go ? { x: Math.cos(ang) * dist, y: [0, Math.sin(ang) * dist, Math.sin(ang) * dist + 140], opacity: [0, 1, 1, 0], rotate: 360 + i * 25 } : {}}
            transition={{ duration: 2.2, ease: "easeOut", times: [0, 0.15, 0.75, 1], delay: 0.15 }}
          />
        );
      })}
    </div>
  );
}

export function TrailFinale() {
  const ref = useRef<HTMLDivElement>(null);
  const go = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="trail-finale-title" className="relative w-full overflow-x-clip bg-theme-beige px-4 pb-12 sm:px-6 md:px-12 lg:px-16">
      <div ref={ref} className="relative mx-auto w-full max-w-[1240px] overflow-hidden rounded-[32px] border-[3px] border-black bg-[#FFF6DC] [box-shadow:8px_8px_0_#000]">
        {/* sky */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[120px] -translate-x-1/2">
            <motion.span
              className="block h-[220px] w-[220px] rounded-full border-[3px] border-black bg-theme-yellow sm:h-[300px] sm:w-[300px]"
              initial={reduce ? false : { y: 220 }}
              animate={go ? { y: 0 } : {}}
              transition={{ duration: 1.6, ease: "easeOut" }}
            />
          </div>
          {!reduce && (
            <motion.div
              className="absolute top-[70px]"
              initial={{ x: "-15vw", y: 0 }}
              animate={go ? { x: ["-15vw", "110vw"], y: [0, -30, 10, -20] } : {}}
              transition={{ duration: 16, ease: "linear", repeat: Infinity, delay: 0.8 }}
            >
              <Paraglider />
            </motion.div>
          )}
          <svg className="absolute bottom-0 left-0 h-[260px] w-full sm:h-[320px]" viewBox="0 0 1240 320" preserveAspectRatio="none">
            <path d="M0 320V170l120-90 110 70 150-120 140 110 110-60 170 130 130-90 120 60 190-110V320Z" fill="#8398FF" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
            <path d="M0 320V230l160-60 130 50 170-90 160 90 140-40 190 70 150-60 140 50V320Z" fill="#003634" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
            <path d="M330 120l50-40 50 34M760 150l40-30 40 26" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <Burst go={go} />

        <div className="relative z-10 flex flex-col items-center px-5 pb-10 pt-12 text-center sm:px-10 sm:pt-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={go ? { opacity: 1, y: 0 } : {}}
            className="rounded-full border-[3px] border-black bg-white px-4 py-1 font-jakarta text-[13px] font-extrabold uppercase tracking-[0.16em] text-black"
          >
            Trail complete
          </motion.p>
          <motion.h2
            id="trail-finale-title"
            initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
            animate={go ? { opacity: 1, scale: 1, rotate: -2 } : {}}
            transition={{ type: "spring", stiffness: 160, damping: 11, delay: 0.1 }}
            className="mt-4 font-handwriting text-[64px] font-bold leading-none text-black [text-shadow:4px_4px_0_var(--color-orange-accent)] sm:text-[88px] lg:text-[104px]"
          >
            You made it!
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={go ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mt-3 max-w-[540px] text-[16px] leading-relaxed text-black/80 md:text-[18px]"
          >
            You enjoyed a meal, a bed or an adventure, and the business got honest content. That&apos;s a collab.
          </motion.p>

          {/* the trip, as polaroids */}
          <div className="mt-10 flex flex-wrap items-end justify-center gap-4 sm:gap-6">
            {POLAROIDS.map((p, i) => (
              <motion.figure
                key={p.caption}
                initial={{ opacity: 0, y: 80, rotate: 0 }}
                animate={go ? { opacity: 1, y: 0, rotate: p.rotate } : {}}
                transition={{ type: "spring", stiffness: 110, damping: 13, delay: 0.6 + i * 0.18 }}
                whileHover={{ rotate: 0, scale: 1.05, y: -8 }}
                className="w-[150px] rounded-[6px] border-[3px] border-black bg-white p-2 pb-3 [box-shadow:5px_5px_0_rgba(0,0,0,0.9)] sm:w-[220px] sm:p-3 sm:pb-4"
              >
                <div className={`relative flex h-[120px] items-center justify-center overflow-hidden rounded-[3px] border-2 border-black sm:h-[190px] ${p.bg}`}>
                  <span aria-hidden="true" className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/40" />
                  <div className="relative h-[76px] w-[76px] sm:h-[110px] sm:w-[110px]">
                    <Image src={p.icon} alt="" fill className="object-contain" sizes="110px" />
                  </div>
                </div>
                <figcaption className="mt-3 text-left">
                  <p className="font-handwriting text-[20px] font-bold leading-none text-black sm:text-[26px]">{p.caption}</p>
                  <p className="mt-1 font-jakarta text-[10px] font-bold uppercase tracking-wider text-black/55 sm:text-[12px]">{p.paid}</p>
                </figcaption>
              </motion.figure>
            ))}
          </div>

          {/* the stamps from the trail */}
          <div className="mt-10 flex max-w-[760px] flex-wrap justify-center gap-3" aria-label="Stamps collected on the trail">
            {STAMPS.map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, scale: 1.8 }}
                animate={go ? { opacity: 1, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 14, delay: 1.2 + i * 0.12 }}
                className="flex h-[84px] w-[84px] items-center justify-center rounded-full border-[3px] border-dashed bg-white/85 px-2 text-center font-jakarta text-[10px] font-extrabold uppercase leading-tight"
                style={{ borderColor: STAMP_TONES[i], color: STAMP_TONES[i], rotate: `${((i * 37) % 30) - 15}deg` }}
              >
                {s}
              </motion.span>
            ))}
          </div>

          {/* start yours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={go ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 2 }}
            className="mt-12 flex w-full max-w-[640px] flex-col items-center gap-4 rounded-[24px] border-[3px] border-black bg-white p-6 [box-shadow:6px_6px_0_var(--color-yellow-accent)] sm:p-8"
          >
            <p className="font-handwriting text-[40px] font-bold leading-none text-black sm:text-[48px]">Your trail starts here</p>
            <a
              href={portalLinks.creatorApply}
              onClick={() => trackEvent("creator_signup_handoff", { source: "creators_finale" })}
              className="inline-flex items-center gap-2.5 rounded-[12px] border-[3px] border-black bg-black py-3 pl-4 pr-7 font-jakarta text-[18px] font-bold text-white [box-shadow:4px_4px_0_var(--color-orange-accent)] transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-yellow focus-visible:ring-offset-2"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white"><GoogleIcon className="h-5 w-5" /></span>
              Register with Google
            </a>
            <p className="text-[14px] text-black/65">Then get the app. Collabs live there.</p>
            <StoreBadges align="center" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
