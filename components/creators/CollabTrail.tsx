"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
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

/*
 * "Your collab trail" as a quest map: the section pins to the screen and a
 * treasure map of mountain switchbacks glides along behind a bike (two
 * riders) as you scroll. It's one stop at a time: the bike rides to a stop,
 * the stop's card slides in, and scrolling on sends the bike to the next one.
 * The seven stops have the same steps and names as the "Creator 1–7" videos.
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

/* ── Scroll pacing ───────────────────────────────────────────────────── */

const STOP_VH = 95; // scroll length per stop
const FINISH_SHARE = 0.7; // the last ride to the finish, as a share of a stop
const TRAVEL = 0.42; // share of each stop's scroll spent riding; the rest the bike waits with the card
const PARK = 70; // the bike waits this far along, just past the start sign

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/* ── Geometry: the map ───────────────────────────────────────────────── */

type Pt = { x: number; y: number };
type Sample = Pt & { l: number };
type Seg = { l0: number; l1: number; dir: 1 | -1 };
type Chunk = { d: string; l0: number; len: number };
type MapGeo = {
  wide: boolean;
  w: number;
  h: number;
  /** the sticky viewport's height */
  vh: number;
  d: string;
  len: number;
  samples: Sample[];
  chunks: Chunk[];
  pins: (Pt & { l: number })[];
  segs: Seg[];
  ys: number[];
  start: Pt;
  finish: Pt;
  bend: number;
  edge: number;
  /** where the bike sits on screen while the map moves */
  anchorY: number;
};

function buildRoad(w: number, vh: number, wide: boolean) {
  const edge = wide ? 112 : 14, bend = wide ? 72 : 30;
  const gap = wide ? Math.min(620, Math.max(380, vh * 0.6)) : Math.min(300, Math.max(210, vh * 0.32));
  const ys = Array.from({ length: STOPS.length + 1 }, (_, i) => 180 + i * gap);
  const xL = edge + bend, xR = w - edge - bend;
  const start: Pt = { x: wide ? 40 : 20, y: ys[0] };
  let d = `M ${start.x} ${start.y}`, l = 0;
  const segs: Seg[] = [];
  const pins: (Pt & { l: number })[] = [];
  for (let i = 0; i < ys.length; i++) {
    const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
    const s = i === 0 ? start.x : dir > 0 ? xL : xR;
    const last = i === ys.length - 1;
    const e = last ? w / 2 : dir > 0 ? xR : xL;
    if (!last) {
      const px = i % 2 === 0 ? w * (wide ? 0.27 : 0.3) : w * (wide ? 0.73 : 0.7);
      pins.push({ x: px, y: ys[i], l: l + Math.abs(px - s) });
    }
    d += ` L ${e} ${ys[i]}`;
    segs.push({ l0: l, l1: l + Math.abs(e - s), dir });
    l += Math.abs(e - s);
    if (last) break;
    const out = e + dir * bend, sweep = dir > 0 ? 1 : 0, y0 = ys[i], y1 = ys[i + 1];
    const run = Math.max(0, y1 - y0 - 2 * bend), turn = Math.PI * bend;
    d += ` A ${bend} ${bend} 0 0 ${sweep} ${out} ${y0 + bend} L ${out} ${y1 - bend} A ${bend} ${bend} 0 0 ${sweep} ${e} ${y1}`;
    const mid = l + turn / 2 + run / 2;
    segs.push({ l0: l, l1: mid, dir });
    segs.push({ l0: mid, l1: l + turn + run, dir: dir > 0 ? -1 : 1 });
    l += turn + run;
  }
  return { d, len: l, pins, segs, ys, start, finish: { x: w / 2, y: ys[ys.length - 1] }, edge, bend, h: ys[ys.length - 1] + 260 };
}

function interpL(s: Sample[], l: number): Pt {
  if (!s.length) return { x: 0, y: 0 };
  if (l <= s[0].l) return s[0];
  const last = s[s.length - 1];
  if (l >= last.l) return last;
  let lo = 0, hi = s.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (s[m].l < l) lo = m; else hi = m; }
  const a = s[lo], b = s[hi], k = (l - a.l) / (b.l - a.l || 1);
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
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
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
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

/** A stop on the map: bursts and turns into a check as the bike arrives. */
function MapPin({ n, reached, x, y }: { n: number; reached: boolean; x: number; y: number }) {
  return (
    <div className="pointer-events-none absolute z-20" style={{ left: x, top: y, transform: "translate(-50%,-50%)" }}>
      <AnimatePresence>
        {reached && (
          <motion.span key="burst" className="absolute left-1/2 top-1/2" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.9, delay: 0.3 }}>
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

/** One stop's card: straight, with its little phone acting the step out. */
function StopCard({ stop, n, compact }: { stop: Stop; n: number; compact: boolean }) {
  const phase = PHASES[stop.phase];
  return (
    <article className={`relative flex overflow-hidden rounded-[28px] border-[3px] border-black bg-white ${phase.shadow} ${compact ? "flex-row" : "flex-col sm:flex-row"}`}>
      <div className={compact ? "min-w-0 flex-1 p-4" : "flex-1 p-6"}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border-2 border-black px-2.5 py-0.5 font-jakarta text-[11px] font-extrabold uppercase tracking-[0.12em] text-black ${phase.tone}`}>
            Stop {n} of {STOPS.length}
          </span>
          {!compact && <span className="font-jakarta text-[12px] font-semibold text-black/50">{phase.name}</span>}
        </div>
        <h3 className={`mt-3 break-words font-jakarta font-extrabold leading-[1.15] text-black ${compact ? "text-[18px]" : "text-[26px]"}`}>
          <span className="sr-only">Step {n}: </span>
          {stop.title}
        </h3>
        <p className={`mt-2 leading-relaxed text-black/75 ${compact ? "text-[13.5px]" : "text-[16px]"}`}>{stop.body}</p>
      </div>
      <div className={`flex shrink-0 justify-center overflow-hidden ${compact ? "w-[118px] items-start pt-3" : "w-[190px] items-start pt-6"}`}>
        <div className={compact ? "origin-top scale-[0.72]" : ""}>
          <TrailScene scene={stop.scene} play />
        </div>
      </div>
    </article>
  );
}

/** Static list for visitors who prefer reduced motion. */
function TrailList() {
  return (
    <ol className="mx-auto mt-10 flex w-full max-w-[860px] flex-col gap-6">
      {STOPS.map((stop, i) => (
        <li key={stop.title}>
          <StopCard stop={stop} n={i + 1} compact={false} />
        </li>
      ))}
    </ol>
  );
}

/* ── The quest map ───────────────────────────────────────────────────── */

function QuestMap() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<MapGeo | null>(null);
  const [active, setActive] = useState(-1);
  const [reached, setReached] = useState(0);

  // Draw the map for this screen (again on resize).
  useEffect(() => {
    const stage = stageRef.current, track = trackRef.current;
    if (!stage || !track) return;
    let raf = 0;
    const layout = () => {
      const path = measureRef.current;
      if (!path) return;
      const w = stage.clientWidth, vh = stage.clientHeight, wide = w >= 1024;
      const road = buildRoad(w, vh, wide);
      path.setAttribute("d", road.d);
      const len = path.getTotalLength();
      const samples: Sample[] = [];
      const N = 1000;
      for (let i = 0; i <= N; i++) { const l = (len * i) / N, p = path.getPointAtLength(l); samples.push({ x: p.x, y: p.y, l }); }
      const chunks: Chunk[] = [];
      for (let i = 0; i < samples.length - 1; ) {
        let j = i, d = `M ${samples[i].x.toFixed(1)} ${samples[i].y.toFixed(1)}`;
        while (j < samples.length - 1 && samples[j].l - samples[i].l < 140) { j++; d += ` L ${samples[j].x.toFixed(1)} ${samples[j].y.toFixed(1)}`; }
        chunks.push({ d, l0: samples[i].l, len: samples[j].l - samples[i].l });
        i = j;
      }
      setGeo({ ...road, len, samples, chunks, wide, w, vh, anchorY: vh * (wide ? 0.56 : 0.4) });
    };
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(layout); };
    const ro = new ResizeObserver(schedule);
    ro.observe(stage);
    ro.observe(document.body);
    schedule();
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  // Scroll through the pinned track → where the bike is and which card shows.
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start start", "end end"] });
  const travelled = useMotionValue(PARK);
  const ridden = useSpring(travelled, { stiffness: 160, damping: 30, mass: 0.8 });
  const pace = useCallback((p: number) => {
    if (!geo) return;
    const n = STOPS.length, u = clamp01(p) * (n + FINISH_SHARE), k = Math.floor(u), f = u - k;
    let l: number, card: number;
    if (k >= n) {
      l = lerp(geo.pins[n - 1].l, geo.len, ease(clamp01((u - n) / FINISH_SHARE)));
      card = u - n < 0.12 ? n - 1 : -1;
    } else {
      const from = k === 0 ? PARK : geo.pins[k - 1].l;
      l = f < TRAVEL ? lerp(from, geo.pins[k].l, ease(f / TRAVEL)) : geo.pins[k].l;
      card = f >= TRAVEL * 0.86 ? k : k > 0 && f < TRAVEL * 0.22 ? k - 1 : -1;
    }
    travelled.set(l);
    setActive((a) => (a === card ? a : card));
  }, [geo, travelled]);
  useMotionValueEvent(scrollYProgress, "change", pace);
  useEffect(() => {
    const raf = requestAnimationFrame(() => pace(scrollYProgress.get()));
    return () => cancelAnimationFrame(raf);
  }, [pace, scrollYProgress]);
  useMotionValueEvent(ridden, "change", (l) => {
    if (!geo) return;
    const count = geo.pins.filter((p) => p.l <= l + 3).length;
    setReached((r) => (r === count ? r : count));
  });

  // The bike, and a camera that keeps it in view.
  const bikeX = useTransform(ridden, (l) => (geo ? interpL(geo.samples, l).x : 0));
  const bikeY = useTransform(ridden, (l) => (geo ? interpL(geo.samples, l).y : 0));
  const camTarget = useTransform(bikeY, (y) => (geo ? y - geo.anchorY : 0));
  const cam = useSpring(camTarget, { stiffness: 70, damping: 20, mass: 1 });
  const mapY = useTransform(cam, (c) => -c);
  const farY = useTransform(cam, (c) => -c * 0.08);
  const facing = useTransform(ridden, (l): number => {
    if (!geo) return 1;
    const s = geo.segs.find((g) => l >= g.l0 && l < g.l1) ?? geo.segs[geo.segs.length - 1];
    return s?.dir ?? 1;
  });
  const flip = useSpring(facing, { stiffness: 300, damping: 26 });
  const lean = useTransform(ridden, (l) => {
    if (!geo) return 0;
    const a = interpL(geo.samples, l - 6), b = interpL(geo.samples, l + 6);
    const th = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    const rot = facing.get() > 0 ? th : th > 0 ? th - 180 : th + 180;
    return Math.max(-38, Math.min(38, rot));
  });
  const spin = useTransform(ridden, (l) => l * 3.4);
  const speed = useTransform(useVelocity(ridden), (v) => Math.min(1, Math.max(0, (Math.abs(v) - 250) / 900)));

  // The ridden line, painted piece by piece.
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
      el.style.strokeDashoffset = String(c.len + 2 - shown + (shown < 0.5 ? 3 : 0));
    });
  }, [geo]);
  useMotionValueEvent(ridden, "change", paintRidden);
  useEffect(() => { chunkShown.current = []; paintRidden(ridden.get()); }, [paintRidden, ridden]);

  const stop = active >= 0 ? STOPS[active] : null;
  const pinLeft = active >= 0 && geo ? geo.pins[active].x < geo.w / 2 : true;
  const wide = geo?.wide ?? true;

  return (
    <div ref={trackRef} data-quest-track className="relative" style={{ height: `calc(100svh + ${STOPS.length * STOP_VH + FINISH_SHARE * STOP_VH}svh)` }}>
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
        style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.035) 1px, transparent 1px)", backgroundSize: "64px 64px" }}
      >
        {/* far mountains, barely moving: depth */}
        <motion.svg aria-hidden="true" style={{ y: farY }} className="pointer-events-none absolute bottom-0 left-0 h-[22%] w-full opacity-[0.18]" viewBox="0 0 1240 300" preserveAspectRatio="none">
          <path d="M0 300V170l140-90 120 70 170-120 150 110 120-60 180 120 140-80 130 50 190-110V300Z" fill="#8398FF" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
        </motion.svg>

        {/* the map, moved by the camera */}
        {geo && (
          <motion.div className="absolute left-0 top-0 will-change-transform" style={{ y: mapY, width: geo.w, height: geo.h }}>
            {[[0.06, 0.12, 150, 18], [0.7, 0.3, 120, 22], [0.1, 0.48, 110, 20], [0.78, 0.62, 150, 24], [0.3, 0.8, 120, 19]].map(([x, y, w, d], i) => (
              <div key={i} aria-hidden="true" className="trail-drift absolute opacity-80" style={{ left: `${x * 100}%`, top: y * geo.h, width: wide ? w : w * 0.6, animationDuration: `${d}s`, ["--drift" as string]: i % 2 ? "-60px" : "60px" }}>
                <Cloud className="h-auto w-full" />
              </div>
            ))}
            <svg aria-hidden="true" className="pointer-events-none absolute left-0 top-0 overflow-visible" width={geo.w} height={geo.h}>
              <path d={geo.d} fill="none" stroke="#000" strokeWidth={wide ? 44 : 26} strokeLinecap="round" strokeLinejoin="round" />
              <path d={geo.d} fill="none" stroke="#575C66" strokeWidth={wide ? 37 : 20} strokeLinecap="round" strokeLinejoin="round" />
              <path d={geo.d} fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth={wide ? 3 : 2} strokeDasharray={wide ? "16 16" : "8 10"} />
              {geo.chunks.map((c, i) => (
                <path
                  key={i}
                  ref={(el) => { chunkEls.current[i] = el; }}
                  d={c.d}
                  fill="none"
                  stroke="var(--color-yellow-accent)"
                  strokeWidth={wide ? 5 : 3.5}
                  strokeDasharray={`${c.len + 2} ${c.len + 40}`}
                  strokeDashoffset={c.len + 5}
                />
              ))}
            </svg>
            {/* landmarks below each stop: its tile and a handwritten note */}
            {geo.pins.map((p, i) => (
              <div key={i} aria-hidden="true" className="absolute flex items-center gap-3" style={{ left: p.x, top: p.y + (wide ? 70 : 40), transform: "translateX(-50%)" }}>
                <FloatingTile src={STOPS[i].decor} className={wide ? "h-[84px] w-[84px]" : "h-[46px] w-[46px]"} delay={i * 0.4} />
                {wide && <p className={`max-w-[190px] font-handwriting text-[28px] font-bold leading-tight text-black/80 ${i % 2 ? "rotate-3" : "-rotate-3"}`}>{STOPS[i].note}</p>}
              </div>
            ))}
            {/* trees in the hairpins, prayer flags across some */}
            {geo.ys.slice(0, -1).map((y, i) => {
              const right = i % 2 === 0;
              const x = right ? geo.w - geo.edge - geo.bend - (wide ? 150 : 70) : geo.edge + geo.bend + (wide ? 20 : 6);
              return i % 2 === 0 ? (
                <Pines key={i} className="absolute" style={{ left: x, top: y + (geo.ys[i + 1] - y) / 2 - 30, width: wide ? 130 : 64 }} />
              ) : (
                <PrayerFlags key={i} className="absolute" style={{ left: wide ? geo.w * 0.38 : geo.w * 0.3, top: y + (geo.ys[i + 1] - y) * 0.42, width: wide ? 260 : 150 }} />
              );
            })}
            {/* start, finish */}
            <div className="pointer-events-none absolute z-20" style={{ left: geo.start.x, top: geo.start.y }} aria-hidden="true">
              <div className="absolute -left-4 -top-[78px] flex flex-col items-center">
                <span className="rounded-[8px] border-[3px] border-black bg-theme-orange px-2 py-0.5 font-jakarta text-[12px] font-black uppercase tracking-widest text-white">Start</span>
                <span className="h-6 w-1 bg-black" />
              </div>
            </div>
            <div className="pointer-events-none absolute z-20" style={{ left: geo.finish.x, top: geo.finish.y }} aria-hidden="true">
              <svg width="70" height="70" viewBox="0 0 70 70" className="absolute -left-[35px] -top-[35px]">
                <path d="M14 14 56 56M56 14 14 56" stroke="#000" strokeWidth="14" strokeLinecap="round" />
                <path d="M14 14 56 56M56 14 14 56" stroke="#FF5B25" strokeWidth="8" strokeLinecap="round" />
              </svg>
              <span className="absolute left-[30px] top-[-62px] -rotate-6 rounded-[10px] border-[3px] border-black bg-white px-2.5 py-0.5 font-handwriting text-[26px] font-bold text-black [box-shadow:3px_3px_0_#000]">Bir!</span>
            </div>
            {geo.pins.map((p, i) => <MapPin key={i} n={i + 1} reached={reached > i} x={p.x} y={p.y} />)}

            {/* the bike */}
            <motion.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-30 will-change-transform" style={{ x: bikeX, y: bikeY }}>
              <motion.div style={{ rotate: lean, scaleX: flip }} className={wide ? "-ml-[95px] -mt-[130px] w-[190px]" : "-ml-[42px] -mt-[57px] w-[84px]"}>
                <Motorbike spin={spin} speed={speed} className="h-auto w-full" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* one stop at a time */}
        <div className="pointer-events-none absolute inset-0 z-40 mx-auto w-full max-w-[1240px]">
          <AnimatePresence mode="wait">
            {stop && (
              <motion.div
                key={active}
                className={`pointer-events-none absolute ${
                  wide
                    ? `inset-y-0 flex w-[min(520px,42vw)] items-center pt-16 ${pinLeft ? "right-8" : "left-8"}`
                    : "inset-x-3 bottom-4"
                }`}
                initial={wide ? { opacity: 0, x: pinLeft ? 90 : -90, scale: 0.96 } : { opacity: 0, y: 70 }}
                animate={wide ? { opacity: 1, x: 0, scale: 1 } : { opacity: 1, y: 0 }}
                exit={wide ? { opacity: 0, x: pinLeft ? 50 : -50, scale: 0.97, transition: { duration: 0.22 } } : { opacity: 0, y: 40, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 170, damping: 22 }}
              >
                <div className="pointer-events-auto w-full">
                  <StopCard stop={stop} n={active + 1} compact={!wide} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* invisible but measurable: the road path, for lengths and points */}
      <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden"><path ref={measureRef} d="" /></svg>
    </div>
  );
}

/* ── The section ─────────────────────────────────────────────────────── */

export function CollabTrail() {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="collab-trail-title" className="relative w-full overflow-x-clip bg-theme-beige pb-6 pt-6">
      <div className="px-4 sm:px-6 md:px-12 lg:px-16">
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
              Cafés, stays and adventure spots in Bir trade a meal, a bed or an adventure for honest content. Hop on, and scroll to ride the trail, one stop at a time.
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
      </div>
      {reduce ? <div className="px-4"><TrailList /></div> : <QuestMap />}
    </section>
  );
}
