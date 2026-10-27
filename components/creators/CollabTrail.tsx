"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { GoogleIcon } from "@/components/collabs/GoogleHandoffLink";
import { trackEvent } from "@/lib/analytics";
import { CloudinaryIcons } from "@/lib/config/assets";
import { portalLinks } from "@/lib/config/site";
import { Cloud, Motorbike, Pines, PrayerFlags } from "./TrailArt";
import { TrailScene, type SceneKey } from "./TrailScenes";
import { trailBike } from "./trailBike";

/*
 * "Your collab trail": a creator's journey after getting listed. On desktop
 * it's a mountain road of hairpin switchbacks; on phones, a road down the side.
 * A bike (two riders) rides it as you scroll, each of the seven stops (the
 * same steps and names as the "Creator 1–7" videos) bursts as the bike
 * arrives, and the cards act the step out on a little phone.
 */

type Phase = { name: string; tone: string; shadow: string };
const PHASES: Record<"before" | "at" | "after", Phase> = {
  before: { name: "Before you go", tone: "bg-theme-yellow", shadow: "[box-shadow:7px_7px_0_var(--color-yellow-accent)]" },
  at: { name: "At the place", tone: "bg-theme-blue", shadow: "[box-shadow:7px_7px_0_var(--color-blue-accent)]" },
  after: { name: "After your visit", tone: "bg-theme-orange", shadow: "[box-shadow:7px_7px_0_var(--color-orange-accent)]" },
};

type Stop = { title: string; body: ReactNode; scene: SceneKey; phase: keyof typeof PHASES; note: string; decor: string };

export const STOPS: Stop[] = [
  {
    title: "Fill your creator profile",
    body: <>In the app&apos;s <b>Collabs</b> tab, add your handle, travel style and a short bio. It&apos;s the first thing businesses see.</>,
    scene: "profile", phase: "before", note: "first impressions!", decor: CloudinaryIcons.camera,
  },
  {
    title: "Find places open for collabs",
    body: <>Tap <b>Search Collabs</b>. The map shows only the places open for collabs. Tap one to see what it offers.</>,
    scene: "find", phase: "before", note: "ooh, a café with a view", decor: CloudinaryIcons.compass,
  },
  {
    title: "Check in at the place",
    body: <>When you get there, slide <b>Check-In</b> on the place&apos;s page. Its collabs open up: what they want and what you get.</>,
    scene: "checkin", phase: "at", note: "made it to Bir!", decor: CloudinaryIcons.coffee,
  },
  {
    title: "Redeem or Avail",
    body: <><b>Redeem</b> a walk-in collab right away. <b>Avail</b> sends your profile to the business, and they approve you.</>,
    scene: "pick", phase: "at", note: "walk in, or ask first", decor: CloudinaryIcons.balloon,
  },
  {
    title: "Staff enter their code",
    body: <>Hand your phone to the staff. They type their <b>4-digit code</b> and it&apos;s redeemed. No network? Show your <b>QR</b>.</>,
    scene: "code", phase: "at", note: "the staff do the magic", decor: CloudinaryIcons.lamp,
  },
  {
    title: "Enjoy, then create",
    body: <>Enjoy the meal, stay or experience. Your brief in <b>My Collabs</b> says what to post, who to tag and by when.</>,
    scene: "create", phase: "after", note: "golden hour = best reel", decor: CloudinaryIcons.sun,
  },
  {
    title: "Send your post link",
    body: <>Paste the link in the <b>chat</b> by the due date. Then you both review the collab. Reviews are private.</>,
    scene: "link", phase: "after", note: "posted. now, chai.", decor: CloudinaryIcons.drink,
  },
];

const LISTING = [
  { title: "Continue with Google", body: "Tap Register." },
  { title: "Two quick details", body: "Phone number and a social link." },
  { title: "Approval email", body: "We review by hand, usually within 2 working days." },
];

/* ── Geometry ────────────────────────────────────────────────────────── */

type Pt = { x: number; y: number };
type Sample = Pt & { l: number };
type Seg = { l0: number; l1: number; dir: 1 | -1 };
type Chunk = { d: string; l0: number; len: number };
type Geo = {
  d: string;
  /** the yellow "ridden" line, in short pieces */
  chunks: Chunk[];
  w: number;
  h: number;
  len: number;
  wide: boolean;
  samples: Sample[];
  pins: (Pt & { l: number })[];
  /** scroll line height → road length, piecewise linear */
  anchors: { y: number; l: number }[];
  segs: Seg[];
  start: Pt;
  finish: Pt;
  /** the road's container, in page coordinates */
  pageLeft: number;
  pageTop: number;
};

const ROAD_Y = 46; // road centre below the top of each desktop band
const PARK = 74; // the bike waits this far along, just past the start sign
const EDGE = 40; // vertical runs of the hairpins sit this far in from the sides
const BEND = 70; // hairpin corner radius

/** Catmull-Rom through the points, as cubic Béziers. */
function smoothPath(pts: Pt[]): string {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function interp<T extends { l: number }>(list: T[], key: (v: T) => number, value: number, out: (v: T) => number): number {
  if (!list.length) return 0;
  if (value <= key(list[0])) return out(list[0]);
  const last = list[list.length - 1];
  if (value >= key(last)) return out(last);
  let lo = 0, hi = list.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (key(list[mid]) < value) lo = mid; else hi = mid; }
  const a = list[lo], b = list[hi], k = (value - key(a)) / (key(b) - key(a) || 1);
  return out(a) + (out(b) - out(a)) * k;
}
const pointAt = (s: Sample[], l: number): Pt => ({ x: interp(s, (v) => v.l, l, (v) => v.x), y: interp(s, (v) => v.l, l, (v) => v.y) });

/** Desktop: hairpin switchbacks across the full width, one pass along the top of each stop's band. */
function switchbacks(w: number, bands: { top: number; bottom: number; cardX: number }[]) {
  const ys = bands.map((b) => b.top + ROAD_Y);
  ys.push(bands[bands.length - 1].bottom - 34);
  const xL = EDGE + BEND, xR = w - EDGE - BEND;
  const start: Pt = { x: 22, y: ys[0] };
  let d = `M ${start.x} ${start.y}`;
  let l = 0;
  const segs: Seg[] = [];
  const passStart: number[] = [];
  const passEnd: number[] = [];
  const pins: (Pt & { l: number })[] = [];
  for (let i = 0; i < ys.length; i++) {
    const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
    const s = i === 0 ? start.x : dir > 0 ? xL : xR;
    const last = i === ys.length - 1;
    const e = last ? w / 2 : dir > 0 ? xR : xL;
    passStart.push(l);
    if (i < bands.length) pins.push({ x: bands[i].cardX, y: ys[i], l: l + Math.abs(bands[i].cardX - s) });
    d += ` L ${e} ${ys[i]}`;
    segs.push({ l0: l, l1: l + Math.abs(e - s), dir });
    l += Math.abs(e - s);
    passEnd.push(l);
    if (last) break;
    // hairpin down to the next pass, bulging out towards the edge
    const out = e + dir * BEND, sweep = dir > 0 ? 1 : 0, y0 = ys[i], y1 = ys[i + 1];
    const run = Math.max(0, y1 - y0 - 2 * BEND);
    const turn = Math.PI * BEND;
    d += ` A ${BEND} ${BEND} 0 0 ${sweep} ${out} ${y0 + BEND} L ${out} ${y1 - BEND} A ${BEND} ${BEND} 0 0 ${sweep} ${e} ${y1}`;
    const mid = l + turn / 2 + run / 2;
    segs.push({ l0: l, l1: mid, dir });
    segs.push({ l0: mid, l1: l + turn + run, dir: dir > 0 ? -1 : 1 });
    l += turn + run;
  }
  // Each pass is ridden while the scroll line is near it, each hairpin while the line runs down
  // to the next pass, so the bike stays close to the middle of the screen.
  const anchors: { y: number; l: number }[] = [{ y: ys[0] - 400, l: PARK }];
  ys.forEach((y, i) => {
    const gapUp = i ? y - ys[i - 1] : 400, gapDown = i < ys.length - 1 ? ys[i + 1] - y : 400;
    const a = Math.max(40, Math.min(110, gapUp / 2 - 20, gapDown / 2 - 20));
    anchors.push({ y: y - a, l: i === 0 ? PARK : passStart[i] }, { y: y + a, l: passEnd[i] });
  });
  return { d, len: l, pins, anchors, segs, start, finish: { x: w / 2, y: ys[ys.length - 1] } };
}

/* ── Pieces ──────────────────────────────────────────────────────────── */

function FloatingTile({ src, className = "", delay = 0 }: { src: string; className?: string; delay?: number }) {
  return (
    <div aria-hidden="true" className={`trail-bob relative shrink-0 ${className}`} style={{ animationDelay: `${delay}s` }}>
      <Image src={src} alt="" fill className="object-contain" sizes="110px" />
    </div>
  );
}

/** "Your collab trail", written in letter by letter, then underlined with a scribble. */
function TrailHeading() {
  const reduce = useReducedMotion();
  const words = ["Your", "collab", "trail"];
  let k = 0;
  return (
    <h2 id="collab-trail-title" className="relative inline-block font-handwriting text-[54px] font-bold leading-[0.95] text-black sm:text-[68px] lg:text-[84px]">
      <span className="sr-only">Your collab trail</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={w} className="inline-block whitespace-nowrap">
            {[...w].map((ch) => {
              const i = k++;
              return (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={reduce ? false : { opacity: 0, y: 46, rotate: -18, scale: 0.6 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 + i * 0.045 }}
                >
                  {ch}
                </motion.span>
              );
            })}
            {wi < words.length - 1 && <span className="inline-block w-[0.28em]" />}
          </span>
        ))}
      </span>
      <svg viewBox="0 0 420 30" preserveAspectRatio="none" className="absolute -bottom-3 left-[4%] h-[18px] w-[92%]" aria-hidden="true">
        <motion.path
          d="M4 18C70 6 150 26 220 14S350 8 416 16"
          fill="none"
          stroke="var(--color-orange-accent)"
          strokeWidth="7"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.8, ease: "easeInOut" }}
        />
      </svg>
    </h2>
  );
}

function Ticket() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -4, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 110, damping: 14 }}
      className="relative mx-auto w-full max-w-[880px]"
    >
      <div className="relative flex flex-col overflow-hidden rounded-[24px] border-[3px] border-black bg-white [box-shadow:9px_9px_0_#000] md:flex-row">
        <div className="relative flex-1 p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-black px-3 py-1 font-jakarta text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">Boarding pass</span>
            <span className="font-jakarta text-[11px] font-bold uppercase tracking-[0.18em] text-black/50">Creator · once</span>
          </div>
          <h3 className="mt-3 font-handwriting text-[40px] font-bold leading-none text-black sm:text-[46px]">Get listed first</h3>
          <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {LISTING.map((item, i) => (
              <motion.li
                key={item.title}
                className="flex items-start gap-2.5"
                initial={reduce ? false : { opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.15 }}
              >
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[2.5px] border-black bg-theme-yellow font-jakarta text-[13px] font-extrabold">
                  {String.fromCharCode(65 + i)}
                </span>
                <div>
                  <p className="font-jakarta text-[15px] font-bold leading-tight text-black">{item.title}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-black/65">{item.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
          {/* rubber stamp */}
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-4 hidden rounded-[10px] border-[3px] border-theme-orange px-3 py-1 font-jakarta text-[13px] font-black uppercase leading-tight tracking-widest text-theme-orange sm:block"
            initial={reduce ? false : { opacity: 0, scale: 3, rotate: -30 }}
            whileInView={{ opacity: 0.9, scale: 1, rotate: -12 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 420, damping: 18, delay: 1 }}
          >
            Cleared
            <br />
            for Bir
          </motion.span>
        </div>
        <div className="relative flex flex-col items-center justify-center gap-3 border-t-[3px] border-dashed border-black bg-theme-beige px-6 py-5 md:w-[240px] md:border-l-[3px] md:border-t-0">
          <span aria-hidden="true" className="absolute -left-[15px] -top-[15px] hidden h-[28px] w-[28px] rounded-full border-[3px] border-black bg-theme-beige md:block" />
          <span aria-hidden="true" className="absolute -bottom-[15px] -left-[15px] hidden h-[28px] w-[28px] rounded-full border-[3px] border-black bg-theme-beige md:block" />
          <div className="flex w-full items-center justify-between font-jakarta text-black">
            <div><p className="text-[10px] font-bold uppercase tracking-widest text-black/50">From</p><p className="text-[22px] font-extrabold leading-none">YOU</p></div>
            <svg width="38" height="18" viewBox="0 0 38 18" aria-hidden="true" className="trail-nudge">
              <path d="M2 9h30m-7-7 7 7-7 7" stroke="#000" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="text-right"><p className="text-[10px] font-bold uppercase tracking-widest text-black/50">To</p><p className="text-[22px] font-extrabold leading-none">BIR</p></div>
          </div>
          <span aria-hidden="true" className="relative h-9 w-full overflow-hidden" style={{ background: "repeating-linear-gradient(90deg,#000 0 2px,transparent 2px 4px,#000 4px 7px,transparent 7px 9px)" }}>
            <span className="trail-scan absolute inset-y-0 left-0 w-[3px] bg-theme-orange shadow-[0_0_8px_#FF5B25]" style={{ ["--scan" as string]: "min(186px, 80vw)" }} />
          </span>
          <a
            href={portalLinks.creatorApply}
            onClick={() => trackEvent("creator_signup_handoff", { source: "creators_ticket" })}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] border-[3px] border-black bg-white py-2.5 font-jakarta text-[16px] font-bold text-black [box-shadow:3px_3px_0_var(--color-blue-accent)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-yellow focus-visible:ring-offset-2"
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            Register
          </a>
        </div>
      </div>
    </motion.div>
  );
}

/** A sign on a post that swings into place like it's hanging in the wind. */
function Signpost({ phase, align }: { phase: Phase; align: "left" | "right" | "center" }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, rotate: -40, y: -30 }}
      whileInView={{ opacity: 1, rotate: [-40, 14, -8, 4, -3], y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1.4, ease: "easeOut" }}
      style={{ transformOrigin: "50% 0%" }}
      className={`relative z-20 flex flex-col items-center ${align === "left" ? "mr-auto" : align === "right" ? "ml-auto" : "mx-auto"}`}
    >
      <span className={`whitespace-nowrap rounded-[12px] border-[3px] border-black px-5 py-1.5 font-handwriting text-[28px] font-bold leading-none text-black [box-shadow:4px_4px_0_#000] sm:text-[34px] ${phase.tone}`}>
        {phase.name}
      </span>
      <span aria-hidden="true" className="h-6 w-[6px] rounded-b bg-black" />
    </motion.div>
  );
}

/** A stop on the road: bursts and turns into a check as the bike arrives. */
function RoadPin({ n, reached, x, y }: { n: number; reached: boolean; x: number; y: number }) {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute z-20" style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}>
      <AnimatePresence>
        {reached && !reduce && (
          <motion.span key="burst" className="absolute left-1/2 top-1/2 -ml-[1px] -mt-[1px]" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
            <motion.span
              className="absolute -left-8 -top-8 h-16 w-16 rounded-full border-[4px] border-theme-orange"
              initial={{ scale: 0.4, opacity: 1 }}
              animate={{ scale: 2.4, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {Array.from({ length: 10 }, (_, i) => (
              <motion.span
                key={i}
                className="absolute h-[5px] w-[14px] rounded-full border border-black"
                style={{ background: ["#FECD36", "#FF5B25", "#8398FF"][i % 3], rotate: `${i * 36}deg`, transformOrigin: "0 50%" }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: Math.cos((i * 36 * Math.PI) / 180) * 56, y: Math.sin((i * 36 * Math.PI) / 180) * 56, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            ))}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.div
        animate={reached ? { scale: [1, 1.5, 1], rotateY: [0, 180, 360] } : { scale: 1 }}
        transition={{ duration: 0.6 }}
        className={`relative flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-black font-jakarta text-[17px] font-extrabold [box-shadow:3px_3px_0_#000] lg:h-14 lg:w-14 lg:text-[21px] ${reached ? "bg-theme-green text-theme-yellow" : "bg-white text-black"}`}
      >
        {reached ? (
          <svg width="22" height="22" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.5 4.8 9 10 3" stroke="#FECD36" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : (
          n
        )}
      </motion.div>
    </div>
  );
}

/** Flips up in 3D as it arrives, then leans towards the pointer. */
function StopCard({ stop, n, side, arrived }: { stop: Stop; n: number; side: "left" | "right"; arrived: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 200, damping: 18 });
  const ry = useSpring(0, { stiffness: 200, damping: 18 });
  const phase = PHASES[stop.phase];
  const lean = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
  };
  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, rotateX: 32, y: 80, scale: 0.92, rotate: side === "left" ? -4 : 4 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1, rotate: side === "left" ? -1 : 1 }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ type: "spring", stiffness: 80, damping: 14 }}
      style={{ transformPerspective: 1200 }}
    >
      <motion.div
        animate={arrived && !reduce ? { scale: [1, 1.045, 0.99, 1], y: [0, -10, 2, 0] } : { scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
      <motion.article
        onPointerMove={lean}
        onPointerLeave={() => { rx.set(0); ry.set(0); }}
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        className={`relative flex flex-col overflow-hidden rounded-[28px] border-[3px] border-black bg-white sm:flex-row ${phase.shadow}`}
      >
        <div className="flex-1 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <span className={`rounded-full border-2 border-black px-2.5 py-0.5 font-jakarta text-[11px] font-extrabold uppercase tracking-[0.12em] text-black ${phase.tone}`}>
              Stop {n}
            </span>
            <span className="font-jakarta text-[12px] font-semibold text-black/50">{phase.name}</span>
          </div>
          <h3 className="mt-3 break-words font-jakarta text-[21px] font-extrabold leading-[1.15] text-black sm:text-[24px]">
            <span className="sr-only">Step {n}: </span>
            {stop.title}
          </h3>
          <p className="mt-2 text-[15px] leading-relaxed text-black/75">{stop.body}</p>
        </div>
        <motion.div
          className="flex h-[220px] shrink-0 justify-center overflow-hidden sm:h-auto sm:w-[180px] sm:items-start sm:pt-5"
          initial={reduce ? false : { y: 60 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 90, damping: 13, delay: 0.25 }}
        >
          <div className="translate-y-4 sm:translate-y-0">
            <TrailScene scene={stop.scene} play={inView} />
          </div>
        </motion.div>
      </motion.article>
      </motion.div>
    </motion.div>
  );
}

/** The roadside on desktop: a tile drifting with the scroll, a handwritten note, trees or prayer flags. */
function Roadside({ stop, index, side }: { stop: Stop; index: number; side: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const reduce = useReducedMotion();
  return (
    <div ref={ref} aria-hidden="true" className={`relative hidden h-full min-h-[300px] flex-col justify-center lg:flex ${side === "left" ? "items-end pr-10" : "items-start pl-10"}`}>
      {index % 2 === 1 && <PrayerFlags className={`absolute top-6 w-[230px] ${side === "left" ? "right-6" : "left-6"}`} />}
      <motion.div style={reduce ? undefined : { y: drift }} className={`flex items-center gap-4 ${side === "left" ? "flex-row-reverse" : ""}`}>
        <FloatingTile src={stop.decor} className="h-[92px] w-[92px] xl:h-[104px] xl:w-[104px]" delay={index * 0.4} />
        <motion.p
          initial={reduce ? false : { opacity: 0, scale: 0.6, rotate: 0 }}
          whileInView={{ opacity: 1, scale: 1, rotate: index % 2 ? 4 : -4 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.3 }}
          className="max-w-[200px] font-handwriting text-[30px] font-bold leading-tight text-black/85"
        >
          {stop.note}
        </motion.p>
      </motion.div>
      {index % 2 === 0 && <Pines className={`absolute bottom-2 w-[130px] ${side === "left" ? "right-4" : "left-4"}`} />}
    </div>
  );
}

function Clouds() {
  const spots = [
    { top: "6%", left: "4%", w: 150, d: 18 },
    { top: "22%", left: "70%", w: 120, d: 22 },
    { top: "41%", left: "12%", w: 110, d: 20 },
    { top: "58%", left: "78%", w: 150, d: 24 },
    { top: "76%", left: "30%", w: 120, d: 19 },
    { top: "90%", left: "62%", w: 100, d: 21 },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {spots.map((c, i) => (
        <div
          key={i}
          className="trail-drift absolute opacity-80"
          style={{ top: c.top, left: c.left, width: c.w, animationDuration: `${c.d}s`, ["--drift" as string]: i % 2 ? "-70px" : "70px" }}
        >
          <Cloud className="h-auto w-full" />
        </div>
      ))}
    </div>
  );
}

/* ── The trail ───────────────────────────────────────────────────────── */

export function CollabTrail() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const bandRefs = useRef<(HTMLLIElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [reached, setReached] = useState(0);

  // Lay the road (again whenever the layout changes size).
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const layout = () => {
      const box = wrap.getBoundingClientRect();
      const rel = (el: Element) => { const r = el.getBoundingClientRect(); return { left: r.left - box.left, top: r.top - box.top, width: r.width, height: r.height }; };
      const path = measureRef.current;
      const bands = bandRefs.current.filter((b): b is HTMLLIElement => !!b);
      const cards = cardRefs.current.filter((c): c is HTMLDivElement => !!c);
      if (!path || bands.length !== STOPS.length || cards.length !== STOPS.length) return;
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      let built: Omit<Geo, "w" | "h" | "samples" | "wide" | "pageLeft" | "pageTop" | "chunks">;
      if (wide) {
        built = switchbacks(box.width, bands.map((b, i) => {
          const r = rel(b), c = rel(cards[i]);
          return { top: r.top, bottom: r.top + r.height, cardX: c.left + c.width / 2 };
        }));
      } else {
        const s = startRef.current ? rel(startRef.current) : { left: 0, top: 0, width: 48, height: 0 };
        const e = endRef.current ? rel(endRef.current) : { left: 0, top: box.height, width: 48, height: 0 };
        const x = 24;
        const pinPts = cards.map((c, i) => ({ x: x + (i % 2 ? 3 : -3), y: rel(c).top + rel(c).height / 2 }));
        const pts = [{ x, y: s.top + s.height / 2 }, ...pinPts, { x, y: e.top + e.height / 2 }];
        built = { d: smoothPath(pts), len: 0, pins: pinPts.map((p) => ({ ...p, l: 0 })), anchors: [], segs: [], start: pts[0], finish: pts[pts.length - 1] };
      }
      path.setAttribute("d", built.d);
      const len = path.getTotalLength();
      const samples: Sample[] = [];
      const N = 900;
      for (let i = 0; i <= N; i++) { const l = (len * i) / N, p = path.getPointAtLength(l); samples.push({ x: p.x, y: p.y, l }); }
      if (!wide) {
        built.len = len;
        built.anchors = samples.map((s) => ({ y: s.y, l: s.l }));
        built.pins = built.pins.map((p) => {
          let best = 0, bestD = Infinity;
          for (const s of samples) { const dd = (s.x - p.x) ** 2 + (s.y - p.y) ** 2; if (dd < bestD) { bestD = dd; best = s.l; } }
          return { ...p, l: best };
        });
      }
      const chunks: Chunk[] = [];
      for (let i = 0; i < samples.length - 1; ) {
        let j = i, d = `M ${samples[i].x.toFixed(1)} ${samples[i].y.toFixed(1)}`;
        while (j < samples.length - 1 && samples[j].l - samples[i].l < 140) { j++; d += ` L ${samples[j].x.toFixed(1)} ${samples[j].y.toFixed(1)}`; }
        chunks.push({ d, l0: samples[i].l, len: samples[j].l - samples[i].l });
        i = j;
      }
      setGeo({ ...built, chunks, len: wide ? built.len : len, w: box.width, h: box.height, samples, wide, pageLeft: box.left + window.scrollX, pageTop: box.top + window.scrollY });
    };
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(layout); };
    const ro = new ResizeObserver(schedule);
    ro.observe(wrap);
    ro.observe(document.body);
    schedule();
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  // Scroll moves the bike along the road.
  const travelled = useMotionValue(0);
  const smooth = useSpring(travelled, { stiffness: 170, damping: 32, mass: 0.7 });
  // never let the bike fall more than a little behind the scroll, so it stays on screen
  const keepUp = useMotionValue(0);
  const ridden = useTransform([smooth, keepUp], ([a, b]: number[]) => Math.max(a, b));
  const { scrollY } = useScroll();
  const follow = useCallback(() => {
    if (!geo) return;
    // the bike rides in the lower part of the screen, leaving sky above it for the paraglider
    // (page offsets are cached in the layout, so scrolling never forces a layout)
    const line = window.scrollY + window.innerHeight * (geo.wide ? 0.66 : 0.62) - geo.pageTop;
    const l = reduce ? geo.len : interp(geo.anchors, (a) => a.y, line, (a) => a.l);
    travelled.set(l);
    keepUp.set(reduce ? geo.len : interp(geo.anchors, (a) => a.y, line - 60, (a) => a.l));
    const count = geo.pins.filter((p) => p.l <= l + 4).length;
    setReached((r) => (r === count ? r : count));
  }, [geo, reduce, travelled, keepUp]);
  useMotionValueEvent(scrollY, "change", follow);
  useEffect(() => {
    const raf = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(raf);
  }, [follow]);

  const chunkEls = useRef<(SVGPathElement | null)[]>([]);
  const chunkShown = useRef<number[]>([]);
  const paintRidden = useCallback((l: number) => {
    if (!geo) return;
    geo.chunks.forEach((c, i) => {
      const el = chunkEls.current[i];
      if (!el) return;
      const shown = Math.max(0, Math.min(c.len, l - c.l0));
      if (Math.abs((chunkShown.current[i] ?? -1) - shown) < 0.5) return;
      chunkShown.current[i] = shown;
      el.style.strokeDashoffset = String(c.len - shown);
    });
  }, [geo]);
  useMotionValueEvent(ridden, "change", paintRidden);
  useEffect(() => {
    chunkShown.current = [];
    paintRidden(ridden.get());
  }, [paintRidden, ridden]);
  const bikeX = useTransform(ridden, (l) => (geo ? pointAt(geo.samples, l).x : 0));
  const bikeY = useTransform(ridden, (l) => (geo ? pointAt(geo.samples, l).y : 0));
  const facing = useTransform(ridden, (l): number => {
    if (!geo || !geo.wide) return 1;
    const s = geo.segs.find((g) => l >= g.l0 && l < g.l1) ?? geo.segs[geo.segs.length - 1];
    return s?.dir ?? 1;
  });
  const flip = useSpring(facing, { stiffness: 300, damping: 26 });
  const lean = useTransform(ridden, (l) => {
    if (!geo) return 0;
    const a = pointAt(geo.samples, l - 6), b = pointAt(geo.samples, l + 6);
    const dx = b.x - a.x, dy = b.y - a.y;
    if (!geo.wide) return Math.max(-8, Math.min(8, dx * 2));
    const dir = facing.get();
    const th = (Math.atan2(dy, dx) * 180) / Math.PI;
    const rot = dir > 0 ? th : th > 0 ? th - 180 : th + 180;
    return Math.max(-38, Math.min(38, rot));
  });
  const spin = useTransform(ridden, (l) => l * 3.4);
  const speed = useTransform(useVelocity(ridden), (v) => Math.min(1, Math.max(0, (Math.abs(v) - 250) / 900)));

  // Tell the paraglider where the bike is (page coordinates).
  useEffect(() => {
    if (!geo) return;
    trailBike.startX.set(geo.pageLeft + geo.start.x);
    trailBike.startY.set(geo.pageTop + geo.start.y);
    trailBike.endX.set(geo.pageLeft + geo.finish.x);
    trailBike.endY.set(geo.pageTop + geo.finish.y);
    trailBike.x.set(geo.pageLeft + bikeX.get());
    trailBike.y.set(geo.pageTop + bikeY.get());
    trailBike.ready.set(1);
    return () => trailBike.ready.set(0);
  }, [geo, bikeX, bikeY]);
  useMotionValueEvent(bikeX, "change", (v) => { if (geo) trailBike.x.set(geo.pageLeft + v); });
  useMotionValueEvent(bikeY, "change", (v) => { if (geo) trailBike.y.set(geo.pageTop + v); });
  useMotionValueEvent(facing, "change", (v) => trailBike.dir.set(v));

  return (
    <section aria-labelledby="collab-trail-title" className="relative w-full overflow-x-clip bg-theme-beige px-4 pb-6 pt-6 sm:px-6 md:px-12 lg:px-16">
      {/* Heading, with the home page's floating tiles either side */}
      <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <div className="hidden items-center justify-end gap-5 lg:flex">
          <FloatingTile src={CloudinaryIcons.backpack} className="h-[88px] w-[88px] translate-y-6" />
          <FloatingTile src={CloudinaryIcons.camera} className="h-[100px] w-[100px] -translate-y-4" delay={0.6} />
        </div>
        <div className="text-center">
          <TrailHeading />
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="mx-auto mt-6 max-w-[540px] text-[16px] leading-relaxed text-black/75 md:text-[18px]"
          >
            Cafés, stays and adventure spots in Bir trade a meal, a bed or an adventure for honest content. Hop on, and scroll to ride the trail.
          </motion.p>
        </div>
        <div className="hidden items-center justify-start gap-5 lg:flex">
          <FloatingTile src={CloudinaryIcons.coffee} className="h-[100px] w-[100px] -translate-y-4" delay={0.3} />
          <FloatingTile src={CloudinaryIcons.sleepingBag} className="h-[88px] w-[88px] translate-y-6" delay={0.9} />
        </div>
      </div>

      <div className="relative z-10 mt-10 md:mt-14">
        <Ticket />
      </div>

      {/* The road */}
      <div ref={wrapRef} className="relative mx-auto mt-10 w-full max-w-[1240px]">
        <Clouds />

        <svg aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-[1] overflow-visible" width={geo?.w ?? 0} height={geo?.h ?? 0}>
          <path ref={measureRef} d={geo?.d ?? ""} fill="none" stroke="none" />
          {geo && (
            <>
              <path d={geo.d} fill="none" stroke="#000" strokeWidth={geo.wide ? 44 : 26} strokeLinecap="round" strokeLinejoin="round" />
              <path d={geo.d} fill="none" stroke="#575C66" strokeWidth={geo.wide ? 37 : 20} strokeLinecap="round" strokeLinejoin="round" />
              <path d={geo.d} fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth={geo.wide ? 3 : 2} strokeDasharray={geo.wide ? "16 16" : "8 10"} />
              {geo.chunks.map((c, i) => (
                <path
                  key={i}
                  ref={(el) => { chunkEls.current[i] = el; }}
                  d={c.d}
                  fill="none"
                  stroke="var(--color-yellow-accent)"
                  strokeWidth={geo.wide ? 5 : 3.5}
                  strokeDasharray={`${c.len + 1} ${c.len + 1}`}
                  strokeDashoffset={c.len + 1}
                />
              ))}
            </>
          )}
        </svg>

        {geo && (
          <>
            {/* start sign */}
            <div className="pointer-events-none absolute z-20" style={{ left: geo.start.x, top: geo.start.y }} aria-hidden="true">
              <div className={`absolute flex flex-col items-center ${geo.wide ? "-left-5 -top-[78px]" : "-left-[22px] -top-[70px]"}`}>
                <span className="rounded-[8px] border-[3px] border-black bg-theme-orange px-2 py-0.5 font-jakarta text-[12px] font-black uppercase tracking-widest text-white">Start</span>
                <span className="h-6 w-1 bg-black" />
              </div>
            </div>
            {/* finish flag */}
            <div className="pointer-events-none absolute z-20" style={{ left: geo.finish.x, top: geo.finish.y }} aria-hidden="true">
              <motion.div
                className="absolute -left-2 -top-[78px] origin-bottom-left"
                animate={reduce ? undefined : { rotate: [0, 4, -2, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              >
                <svg width="60" height="80" viewBox="0 0 60 80" aria-hidden="true">
                  <path d="M6 78V4" stroke="#000" strokeWidth="4" strokeLinecap="round" />
                  <path d="M8 6h44l-8 12 8 12H8Z" fill="#fff" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
                  <path d="M8 6h11v12H8ZM30 6h11v12H30ZM19 18h11v12H19ZM41 18h11l-8 0" fill="#000" />
                </svg>
              </motion.div>
            </div>
            {geo.pins.map((p, i) => <RoadPin key={i} n={i + 1} reached={reached > i} x={p.x} y={p.y} />)}
          </>
        )}

        {/* the bike */}
        {geo && (
          <motion.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-30 will-change-transform" style={{ x: bikeX, y: bikeY }}>
            <motion.div style={{ rotate: lean, scaleX: flip }} className={geo.wide ? "-ml-[95px] -mt-[130px] w-[190px]" : "-ml-[34px] -mt-[57px] w-[84px]"}>
              <Motorbike spin={spin} speed={speed} className="h-auto w-full" />
            </motion.div>
          </motion.div>
        )}

        {/* mobile start */}
        <div className="grid grid-cols-[48px_minmax(0,1fr)] lg:hidden">
          <div ref={startRef} className="h-16" />
        </div>

        <ol className="relative z-10">
          {STOPS.map((stop, i) => {
            const side = i % 2 === 0 ? "left" : "right";
            const firstOfPhase = i === 0 || STOPS[i - 1].phase !== stop.phase;
            return (
              <Fragment key={stop.title}>
                <li
                  ref={(el) => { bandRefs.current[i] = el; }}
                  className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-x-3 py-5 lg:grid-cols-2 lg:gap-x-10 lg:px-[104px] lg:pb-[70px] lg:pt-[118px]"
                >
                  <div className={`col-start-2 row-start-1 ${side === "left" ? "lg:col-start-1" : "lg:col-start-2"}`}>
                    {firstOfPhase && (
                      <div className="mb-4 lg:hidden">
                        <Signpost phase={PHASES[stop.phase]} align="left" />
                      </div>
                    )}
                    <div ref={(el) => { cardRefs.current[i] = el; }}>
                      <StopCard stop={stop} n={i + 1} side={side} arrived={reached > i} />
                    </div>
                  </div>
                  <div className={`row-start-1 hidden h-full lg:block ${side === "left" ? "lg:col-start-2" : "lg:col-start-1"}`}>
                    <div className="flex h-full flex-col">
                      {firstOfPhase && (
                        <div className="pt-2">
                          <Signpost phase={PHASES[stop.phase]} align={side === "left" ? "right" : "left"} />
                        </div>
                      )}
                      <div className="flex-1">
                        <Roadside stop={stop} index={i} side={side === "left" ? "right" : "left"} />
                      </div>
                    </div>
                  </div>
                </li>
              </Fragment>
            );
          })}
        </ol>

        {/* mobile finish */}
        <div className="grid grid-cols-[48px_minmax(0,1fr)] pb-6 lg:hidden">
          <div ref={endRef} className="h-24" />
        </div>
      </div>
    </section>
  );
}
