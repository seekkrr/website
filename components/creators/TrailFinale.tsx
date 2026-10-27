"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { GoogleIcon } from "@/components/collabs/GoogleHandoffLink";
import { StoreBadges } from "@/components/collabs/StoreBadges";
import { trackEvent } from "@/lib/analytics";
import { CloudinaryIcons } from "@/lib/config/assets";
import { portalLinks } from "@/lib/config/site";
import { Cloud, PrayerFlags, Windsock } from "./TrailArt";
import { PlacesRail, TownStrip, type TrailPlace } from "./PlacesTown";

/*
 * The end of the collab trail, in Bir: the sun comes up over the mountains,
 * the trip develops as polaroids (each "paid with" content), the seven stamps
 * thump in, and the page's paraglider lands on the landing site at the bottom
 * (#landing-site, see ParagliderFlight).
 */

const POLAROIDS = [
  { icon: CloudinaryIcons.coffee, bg: "bg-theme-yellow", caption: "Lunch with a view", paid: "Paid with 1 Reel", rotate: -8 },
  { icon: CloudinaryIcons.sleepingBag, bg: "bg-theme-blue", caption: "Two nights in Bir", paid: "Paid with 2 Stories", rotate: 3 },
  { icon: CloudinaryIcons.balloon, bg: "bg-theme-orange", caption: "Up in the sky", paid: "Paid with 1 Reel", rotate: 10 },
];

const STAMPS = ["Profile", "Found", "Checked in", "Redeemed", "Code", "Created", "Posted"];
const STAMP_TONES = ["#FF5B25", "#003634", "#8398FF", "#FF5B25", "#003634", "#8398FF", "#FF5B25"];

function Burst({ go }: { go: boolean }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const cols = ["#FECD36", "#FF5B25", "#8398FF", "#003634", "#A2548E"];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[300px] z-30">
      {Array.from({ length: 44 }, (_, i) => {
        const ang = (i / 44) * Math.PI * 2;
        const dist = 170 + (i % 6) * 50;
        return (
          <motion.span
            key={i}
            className="absolute block h-[10px] w-[18px] rounded-[2px] border-2 border-black"
            style={{ background: cols[i % cols.length] }}
            initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
            animate={go ? { x: Math.cos(ang) * dist, y: [0, Math.sin(ang) * dist, Math.sin(ang) * dist + 160], opacity: [0, 1, 1, 0], rotate: 360 + i * 25 } : {}}
            transition={{ duration: 2.4, ease: "easeOut", times: [0, 0.15, 0.75, 1], delay: 0.2 }}
          />
        );
      })}
    </div>
  );
}

function Sun({ go }: { go: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="absolute left-1/2 top-[110px] -translate-x-1/2">
      <motion.div initial={reduce ? false : { y: 260 }} animate={go ? { y: 0 } : {}} transition={{ duration: 1.8, ease: "easeOut" }} className="relative h-[240px] w-[240px] sm:h-[320px] sm:w-[320px]">
        <div className="trail-turn absolute -inset-[30%]">
          <svg viewBox="-100 -100 200 200" className="h-full w-full">
            {Array.from({ length: 16 }, (_, i) => (
              <path key={i} d="M-5 -66 L0 -98 L5 -66 Z" fill="#FECD36" stroke="#000" strokeWidth="1.6" strokeLinejoin="round" transform={`rotate(${i * 22.5})`} opacity={0.85} />
            ))}
          </svg>
        </div>
        <span className="absolute inset-0 rounded-full border-[3px] border-black bg-theme-yellow" />
      </motion.div>
    </div>
  );
}

export function TrailFinale({ places }: { places: TrailPlace[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = useInView(ref, { once: true, amount: 0.25 });
  const reduce = useReducedMotion();

  return (
    <section aria-labelledby="trail-finale-title" className="relative w-full overflow-x-clip bg-theme-beige px-4 pb-12 sm:px-6 md:px-12 lg:px-16">
      <div ref={ref} className="relative mx-auto w-full max-w-[1240px] overflow-hidden rounded-[32px] border-[3px] border-black [box-shadow:9px_9px_0_#000]" style={{ background: "linear-gradient(180deg,#FFF6DC 0%,#FFE9C2 55%,#FFDDB0 100%)" }}>
        {/* sky and land */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <Sun go={go} />
          {[{ top: 70, left: "8%", w: 130, d: 20 }, { top: 190, left: "72%", w: 160, d: 26 }, { top: 420, left: "2%", w: 110, d: 22 }].map((c, i) => (
            <div key={i} className="trail-drift absolute" style={{ top: c.top, left: c.left, width: c.w, animationDuration: `${c.d}s`, ["--drift" as string]: i % 2 ? "-60px" : "60px" }}>
              <Cloud className="h-auto w-full" />
            </div>
          ))}
          <svg className="absolute bottom-[236px] left-0 h-[300px] w-full sm:h-[360px]" viewBox="0 0 1240 360" preserveAspectRatio="none">
            <path d="M0 360V190l120-90 110 70 150-130 140 110 110-60 170 130 130-90 120 60 190-120V360Z" fill="#8398FF" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
            <path d="M330 110l50-40 50 34M760 150l40-30 40 26M1060 110l38-34 38 30" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0 360V250l160-60 130 50 170-90 160 90 140-40 190 70 150-60 140 50V360Z" fill="#003634" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
          </svg>
          {/* the landing site, with Bir town: our places */}
          <div className="absolute inset-x-0 bottom-0 h-[250px] border-t-[3px] border-black bg-[#7CC36E]">
            <div className="absolute inset-x-0 top-[22px] h-[3px] bg-black/10" />
            <div className="absolute inset-x-0 top-[150px] h-[3px] bg-black/10" />
            <PrayerFlags className="absolute -top-[40px] left-[40%] w-[220px] sm:left-[46%] sm:w-[340px]" count={9} />
            <Windsock className="absolute -top-[70px] left-[3%] w-[64px] sm:left-[5%] sm:w-[84px]" />
            <div id="landing-site" className="absolute left-[18%] top-[64px] h-[34px] w-[104px] -translate-x-1/2 sm:left-[16%]">
              <span className="absolute inset-0 rounded-[50%] border-[3px] border-dashed border-white" />
              <span className="absolute inset-[9px] rounded-[50%] border-[3px] border-white" />
            </div>
            <div className="absolute left-[4%] top-[150px] -rotate-2 rounded-[10px] border-[3px] border-black bg-white px-3 py-1 text-center font-jakarta text-[11px] font-black uppercase leading-tight tracking-widest text-black [box-shadow:3px_3px_0_#000] sm:left-[9%] sm:text-[13px]">
              Landing site
              <br />
              <span className="text-theme-orange">Bir</span>
            </div>
            <div className="pointer-events-auto absolute bottom-[26px] right-[3%]">
              <TownStrip places={places} go={go} />
            </div>
          </div>
        </div>

        <Burst go={go} />

        <div className="relative z-10 flex flex-col items-center px-5 pb-[330px] pt-12 text-center sm:px-10 sm:pt-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={go ? { opacity: 1, y: 0 } : {}}
            className="rounded-full border-[3px] border-black bg-white px-4 py-1 font-jakarta text-[13px] font-extrabold uppercase tracking-[0.16em] text-black"
          >
            Trail complete
          </motion.p>
          <h2 id="trail-finale-title" className="mt-4 font-handwriting text-[64px] font-bold leading-none text-black [text-shadow:4px_4px_0_var(--color-orange-accent)] sm:text-[90px] lg:text-[108px]">
            <span className="sr-only">You made it!</span>
            <span aria-hidden="true">
              {[..."You made it!"].map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={reduce ? false : { opacity: 0, y: -80, rotate: (i % 2 ? 1 : -1) * 30, scale: 0.4 }}
                  animate={go ? { opacity: 1, y: 0, rotate: 0, scale: 1 } : {}}
                  transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.15 + i * 0.05 }}
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={go ? { opacity: 1 } : {}}
            transition={{ delay: 0.9 }}
            className="mt-3 max-w-[540px] text-[16px] leading-relaxed text-black/80 md:text-[18px]"
          >
            You enjoyed a meal, a bed or an adventure, and the business got honest content. That&apos;s a collab.
          </motion.p>

          {/* the trip develops, like instant film */}
          <div className="mt-10 flex flex-wrap items-end justify-center gap-4 sm:gap-6">
            {POLAROIDS.map((p, i) => (
              <motion.figure
                key={p.caption}
                initial={reduce ? false : { opacity: 0, y: 120, rotate: -20, scale: 0.8 }}
                animate={go ? { opacity: 1, y: 0, rotate: p.rotate, scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 110, damping: 12, delay: 0.8 + i * 0.22 }}
                whileHover={{ rotate: 0, scale: 1.07, y: -10 }}
                className="w-[150px] rounded-[6px] border-[3px] border-black bg-white p-2 pb-3 [box-shadow:5px_5px_0_rgba(0,0,0,0.9)] sm:w-[220px] sm:p-3 sm:pb-4"
              >
                <div className={`relative flex h-[120px] items-center justify-center overflow-hidden rounded-[3px] border-2 border-black sm:h-[190px] ${p.bg}`}>
                  <span aria-hidden="true" className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/40" />
                  <div className="relative h-[76px] w-[76px] sm:h-[110px] sm:w-[110px]">
                    <Image src={p.icon} alt="" fill className="object-contain" sizes="110px" />
                  </div>
                  {!reduce && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 bg-[#3B3329]"
                      initial={{ opacity: 1 }}
                      animate={go ? { opacity: [1, 0.85, 0] } : {}}
                      transition={{ duration: 2.2, delay: 1.2 + i * 0.25, ease: "easeInOut" }}
                    />
                  )}
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
                initial={reduce ? false : { opacity: 0, scale: 2.4, rotate: 0 }}
                animate={go ? { opacity: 1, scale: 1, rotate: ((i * 37) % 30) - 15 } : {}}
                transition={{ type: "spring", stiffness: 420, damping: 15, delay: 1.6 + i * 0.12 }}
                className="flex h-[84px] w-[84px] items-center justify-center rounded-full border-[3px] border-dashed bg-white/85 px-2 text-center font-jakarta text-[10px] font-extrabold uppercase leading-tight"
                style={{ borderColor: STAMP_TONES[i], color: STAMP_TONES[i] }}
              >
                {s}
              </motion.span>
            ))}
          </div>

          {/* start yours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={go ? { opacity: 1, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 120, damping: 14, delay: 2.3 }}
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
      <PlacesRail places={places} />
    </section>
  );
}
