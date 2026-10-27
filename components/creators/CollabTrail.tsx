"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { GoogleIcon } from "@/components/collabs/GoogleHandoffLink";
import { trackEvent } from "@/lib/analytics";
import { CloudinaryIcons } from "@/lib/config/assets";
import { portalLinks } from "@/lib/config/site";
import { TrailScene, type SceneKey } from "./TrailScenes";

/*
 * "Your collab trail": a creator's journey after getting listed, as a road
 * that draws itself while you scroll. A backpack token rides it, each of the
 * seven stops (the same steps and names as the "Creator 1–7" videos) gets
 * stamped as you pass, and the cards act the step out on a little phone.
 */

type Phase = { name: string; tone: string; shadow: string };
const PHASES: Record<"before" | "at" | "after", Phase> = {
  before: { name: "Before you go", tone: "bg-theme-yellow", shadow: "[box-shadow:6px_6px_0_var(--color-yellow-accent)]" },
  at: { name: "At the place", tone: "bg-theme-blue", shadow: "[box-shadow:6px_6px_0_var(--color-blue-accent)]" },
  after: { name: "After your visit", tone: "bg-theme-orange", shadow: "[box-shadow:6px_6px_0_var(--color-orange-accent)]" },
};

type Stop = {
  title: string;
  body: ReactNode;
  scene: SceneKey;
  phase: keyof typeof PHASES;
  note: string;
  decor: string;
};

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

/* ── Geometry: a smooth road through the stop pins ───────────────────── */

type Pt = { x: number; y: number };
type Sample = Pt & { l: number };
type Geo = { d: string; w: number; h: number; len: number; samples: Sample[]; stopLens: number[] };

/** Catmull-Rom through the points, as cubic Béziers. */
function roadPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function pointAt(samples: Sample[], l: number): Pt {
  if (!samples.length) return { x: 0, y: 0 };
  if (l <= 0) return samples[0];
  const last = samples[samples.length - 1];
  if (l >= last.l) return last;
  let lo = 0, hi = samples.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (samples[mid].l < l) lo = mid; else hi = mid; }
  const a = samples[lo], b = samples[hi], k = (l - a.l) / (b.l - a.l || 1);
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
}

/** The road length whose point sits at height y (the road always heads down). */
function lengthAtY(samples: Sample[], y: number): number {
  if (!samples.length) return 0;
  if (y <= samples[0].y) return 0;
  const last = samples[samples.length - 1];
  if (y >= last.y) return last.l;
  let lo = 0, hi = samples.length - 1;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (samples[mid].y < y) lo = mid; else hi = mid; }
  const a = samples[lo], b = samples[hi], k = (y - a.y) / (b.y - a.y || 1);
  return a.l + (b.l - a.l) * k;
}

/* ── Pieces ──────────────────────────────────────────────────────────── */

function FloatingTile({ src, className = "", delay = 0 }: { src: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`relative shrink-0 ${className}`}
      animate={reduce ? undefined : { y: [0, -12, 0], rotate: [0, -3, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <Image src={src} alt="" fill className="object-contain" sizes="96px" />
    </motion.div>
  );
}

function Ticket() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      className="relative mx-auto w-full max-w-[860px]"
    >
      <div className="relative flex flex-col overflow-hidden rounded-[24px] border-[3px] border-black bg-white [box-shadow:8px_8px_0_#000] md:flex-row">
        <div className="flex-1 p-5 sm:p-7">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-black px-3 py-1 font-jakarta text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">
              Boarding pass
            </span>
            <span className="font-jakarta text-[11px] font-bold uppercase tracking-[0.18em] text-black/50">Creator · once</span>
          </div>
          <h3 className="mt-3 font-handwriting text-[38px] font-bold leading-none text-black sm:text-[44px]">Get listed first</h3>
          <ol className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {LISTING.map((item, i) => (
              <li key={item.title} className="flex items-start gap-2.5">
                <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[2.5px] border-black bg-theme-yellow font-jakarta text-[13px] font-extrabold">
                  {String.fromCharCode(65 + i)}
                </span>
                <div>
                  <p className="font-jakarta text-[15px] font-bold leading-tight text-black">{item.title}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-black/65">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        {/* stub */}
        <div className="relative flex flex-col items-center justify-center gap-3 border-t-[3px] border-dashed border-black bg-theme-beige px-6 py-5 md:w-[230px] md:border-l-[3px] md:border-t-0">
          <span aria-hidden="true" className="absolute -left-[15px] -top-[15px] hidden h-[28px] w-[28px] rounded-full border-[3px] border-black bg-theme-beige md:block" />
          <span aria-hidden="true" className="absolute -bottom-[15px] -left-[15px] hidden h-[28px] w-[28px] rounded-full border-[3px] border-black bg-theme-beige md:block" />
          <div className="flex w-full items-center justify-between font-jakarta text-black">
            <div><p className="text-[10px] font-bold uppercase tracking-widest text-black/50">From</p><p className="text-[22px] font-extrabold leading-none">YOU</p></div>
            <svg width="34" height="16" viewBox="0 0 34 16" aria-hidden="true"><path d="M2 8h26m-6-6 6 6-6 6" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div className="text-right"><p className="text-[10px] font-bold uppercase tracking-widest text-black/50">To</p><p className="text-[22px] font-extrabold leading-none">BIR</p></div>
          </div>
          <span aria-hidden="true" className="h-8 w-full" style={{ background: "repeating-linear-gradient(90deg,#000 0 2px,transparent 2px 4px,#000 4px 7px,transparent 7px 9px)" }} />
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

function Signpost({ phase, side }: { phase: Phase; side: "left" | "right" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -24, rotate: side === "left" ? -10 : 10 }}
      whileInView={{ opacity: 1, y: 0, rotate: side === "left" ? -4 : 4 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 180, damping: 12 }}
      className="relative z-20 flex flex-col items-center"
    >
      <span className={`whitespace-nowrap rounded-[12px] border-[3px] border-black px-5 py-1.5 font-handwriting text-[28px] font-bold leading-none text-black [box-shadow:4px_4px_0_#000] sm:text-[32px] ${phase.tone}`}>
        {phase.name}
      </span>
      <span aria-hidden="true" className="h-5 w-[6px] rounded-b bg-black" />
    </motion.div>
  );
}

function Pin({ n, reached, setRef }: { n: number; reached: boolean; setRef: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={setRef} className="relative z-20 flex items-center justify-center">
      <motion.div
        animate={reached ? { scale: [1, 1.35, 1], rotate: [0, -12, 0] } : { scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-black font-jakarta text-[17px] font-extrabold lg:h-14 lg:w-14 lg:text-[20px] ${reached ? "bg-theme-green text-white" : "bg-white text-black"}`}
      >
        {reached ? (
          <svg width="20" height="20" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.5 4.8 9 10 3" stroke="#FECD36" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        ) : (
          n
        )}
      </motion.div>
    </div>
  );
}

function StopCard({ stop, n, side }: { stop: Stop; n: number; side: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const phase = PHASES[stop.phase];
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, x: side === "left" ? -50 : 50, rotate: side === "left" ? -3 : 3 }}
      whileInView={{ opacity: 1, x: 0, rotate: side === "left" ? -1 : 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      whileHover={{ rotate: 0, y: -6 }}
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
      <div className="flex h-[220px] shrink-0 justify-center overflow-hidden sm:h-auto sm:w-[180px] sm:items-start sm:pt-5">
        <div className="translate-y-4 sm:translate-y-0">
          <TrailScene scene={stop.scene} play={inView} />
        </div>
      </div>
    </motion.article>
  );
}

function DiaryNote({ text, side, decor, index }: { text: string; side: "left" | "right"; decor: string; index: number }) {
  return (
    <div className={`hidden items-center gap-4 lg:flex ${side === "left" ? "flex-row-reverse justify-start pr-6" : "justify-start pl-6"}`} aria-hidden="true">
      <FloatingTile src={decor} className="h-[84px] w-[84px] xl:h-[96px] xl:w-[96px]" delay={index * 0.4} />
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className={`font-handwriting text-[28px] font-bold leading-tight text-black/80 ${index % 2 ? "rotate-3" : "-rotate-3"}`}
      >
        {text}
      </motion.p>
    </div>
  );
}

/* ── The trail ───────────────────────────────────────────────────────── */

export function CollabTrail() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);
  const measureRef = useRef<SVGPathElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [reached, setReached] = useState(0);

  // Lay the road through the pins (again whenever the layout changes size).
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    let raf = 0;
    const layout = () => {
      const box = wrap.getBoundingClientRect();
      const centre = (el: HTMLElement | null): Pt | null => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      };
      const pts = [startRef.current, ...pinRefs.current, endRef.current].map(centre).filter((p): p is Pt => !!p);
      const path = measureRef.current;
      if (pts.length < 3 || !path) return;
      const d = roadPath(pts);
      path.setAttribute("d", d);
      const len = path.getTotalLength();
      const samples: Sample[] = [];
      const N = 600;
      for (let i = 0; i <= N; i++) {
        const l = (len * i) / N;
        const p = path.getPointAtLength(l);
        samples.push({ x: p.x, y: p.y, l });
      }
      const stopLens = pts.slice(1, -1).map((p) => {
        let best = 0, bestD = Infinity;
        for (const s of samples) { const dd = (s.x - p.x) ** 2 + (s.y - p.y) ** 2; if (dd < bestD) { bestD = dd; best = s.l; } }
        return best;
      });
      setGeo({ d, w: box.width, h: box.height, len, samples, stopLens });
    };
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(layout); };
    const ro = new ResizeObserver(schedule);
    ro.observe(wrap);
    schedule();
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  // The traveller stays level with a line just below the middle of the screen.
  const travelled = useMotionValue(0);
  const smooth = useSpring(travelled, { stiffness: 140, damping: 26, mass: 0.6 });
  const { scrollY } = useScroll();
  const follow = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap || !geo) return;
    const top = wrap.getBoundingClientRect().top;
    const l = reduce ? geo.len : lengthAtY(geo.samples, window.innerHeight * 0.58 - top);
    travelled.set(l);
    const count = geo.stopLens.filter((s) => s <= l + 4).length;
    setReached((r) => (r === count ? r : count));
  }, [geo, reduce, travelled]);
  useMotionValueEvent(scrollY, "change", follow);
  useEffect(() => {
    const raf = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(raf);
  }, [follow]);

  const drawn = useTransform(smooth, (l) => (geo ? Math.min(1, l / geo.len) : 0));
  const tokenX = useTransform(smooth, (l) => (geo ? pointAt(geo.samples, l).x : 0));
  const tokenY = useTransform(smooth, (l) => (geo ? pointAt(geo.samples, l).y : 0));

  const current = reached === 0 ? null : STOPS[reached - 1];

  return (
    <section aria-labelledby="collab-trail-title" className="relative w-full overflow-x-clip bg-theme-beige px-4 pb-6 pt-4 sm:px-6 md:px-12 lg:px-16">
      {/* Heading, with the home page's floating tiles either side */}
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <div className="hidden items-center justify-end gap-5 lg:flex">
          <FloatingTile src={CloudinaryIcons.backpack} className="h-[84px] w-[84px] translate-y-6" />
          <FloatingTile src={CloudinaryIcons.camera} className="h-[96px] w-[96px] -translate-y-4" delay={0.6} />
        </div>
        <div className="text-center">
          <p className="font-jakarta text-[16px] font-semibold text-black md:text-[20px]">New on SeekKrr · starting in Bir</p>
          <h2 id="collab-trail-title" className="mt-1 font-handwriting text-[48px] font-bold leading-[0.95] text-black sm:text-[60px] lg:text-[76px]">
            Your collab trail
          </h2>
          <p className="mx-auto mt-3 max-w-[520px] text-[15px] leading-relaxed text-black/75 md:text-[17px]">
            Cafés, stays and adventure spots trade a meal, a bed or an experience for honest content. Scroll to walk the trail.
          </p>
        </div>
        <div className="hidden items-center justify-start gap-5 lg:flex">
          <FloatingTile src={CloudinaryIcons.coffee} className="h-[96px] w-[96px] -translate-y-4" delay={0.3} />
          <FloatingTile src={CloudinaryIcons.sleepingBag} className="h-[84px] w-[84px] translate-y-6" delay={0.9} />
        </div>
      </div>

      <div className="mt-10 md:mt-14">
        <Ticket />
      </div>

      {/* The road */}
      <div ref={wrapRef} className="relative mx-auto mt-4 w-full max-w-[1240px]">
        {/* where you are, pinned to the bottom of the screen while you walk */}
        <div className={`pointer-events-none sticky top-[calc(100dvh-76px)] z-40 h-14 items-start justify-center ${reduce ? "hidden" : "flex"}`}>
          <motion.div
            initial={false}
            animate={{ opacity: reached > 0 ? 1 : 0, y: reached > 0 ? 0 : 20 }}
            className="flex items-center gap-3 rounded-full border-[3px] border-black bg-white py-1.5 pl-1.5 pr-4 [box-shadow:4px_4px_0_#000]"
            aria-live="polite"
          >
            <span className="relative h-9 w-9 shrink-0"><Image src={CloudinaryIcons.backpack} alt="" fill className="object-contain" sizes="36px" /></span>
            <span className="font-jakarta text-[13px] font-extrabold text-black sm:text-[14px]">
              {reached >= STOPS.length ? "Trail complete!" : current ? `Stop ${reached} of ${STOPS.length} · ${current.title}` : ""}
            </span>
            <span className="hidden gap-1 sm:flex" aria-hidden="true">
              {STOPS.map((_, i) => (
                <span key={i} className={`h-2.5 w-2.5 rounded-full border-2 border-black ${i < reached ? "bg-theme-orange" : "bg-white"}`} />
              ))}
            </span>
          </motion.div>
        </div>

        <svg aria-hidden="true" className="pointer-events-none absolute left-0 top-0 overflow-visible" width={geo?.w ?? 0} height={geo?.h ?? 0}>
          <path ref={measureRef} d={geo?.d ?? ""} fill="none" stroke="none" />
          {geo && (
            <>
              <path d={geo.d} fill="none" stroke="#000" strokeOpacity="0.14" strokeWidth="26" strokeLinecap="round" />
              <path d={geo.d} fill="none" stroke="#000" strokeOpacity="0.55" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" />
              <motion.path d={geo.d} fill="none" stroke="var(--color-orange-accent)" strokeWidth="7" strokeLinecap="round" style={{ pathLength: drawn }} />
            </>
          )}
        </svg>

        {geo && !reduce && (
          <motion.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-30" style={{ x: tokenX, y: tokenY }}>
            <motion.div
              className="relative -ml-8 -mt-8 h-16 w-16 drop-shadow-[3px_4px_0_rgba(0,0,0,0.85)] lg:-ml-10 lg:-mt-10 lg:h-20 lg:w-20"
              animate={{ y: [0, -6, 0], rotate: [-4, 4, -4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image src={CloudinaryIcons.backpack} alt="" fill className="object-contain" sizes="80px" />
            </motion.div>
          </motion.div>
        )}

        {/* start */}
        <div className="grid grid-cols-[48px_minmax(0,1fr)] lg:grid-cols-[1fr_140px_1fr]">
          <div ref={startRef} className="col-start-1 flex justify-center pt-2 lg:col-start-2">
            <span className="h-4 w-4 rounded-full border-[3px] border-black bg-theme-orange" />
          </div>
        </div>

        <ol className="relative">
          {STOPS.map((stop, i) => {
            const side = i % 2 === 0 ? "left" : "right";
            const firstOfPhase = i === 0 || STOPS[i - 1].phase !== stop.phase;
            return (
              <Fragment key={stop.title}>
                {firstOfPhase && (
                  <li aria-hidden="true" className="grid grid-cols-[48px_minmax(0,1fr)] pt-10 lg:grid-cols-[1fr_140px_1fr] lg:pt-14">
                    <div className="col-start-2 flex justify-start lg:col-span-3 lg:col-start-1 lg:justify-center">
                      <Signpost phase={PHASES[stop.phase]} side={i % 4 === 0 ? "left" : "right"} />
                    </div>
                  </li>
                )}
                <li className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-x-3 py-6 lg:grid-cols-[1fr_140px_1fr] lg:gap-x-0 lg:py-9">
                  <div className={`col-start-1 row-start-1 lg:col-start-2 ${side === "left" ? "lg:translate-x-[30px]" : "lg:-translate-x-[30px]"}`}>
                    <Pin n={i + 1} reached={reached > i} setRef={(el) => { pinRefs.current[i] = el; }} />
                  </div>
                  <div className={`col-start-2 row-start-1 ${side === "left" ? "lg:col-start-1 lg:pr-8" : "lg:col-start-3 lg:pl-8"}`}>
                    <StopCard stop={stop} n={i + 1} side={side} />
                  </div>
                  <div className={`row-start-1 ${side === "left" ? "lg:col-start-3" : "lg:col-start-1"}`}>
                    <DiaryNote text={stop.note} side={side === "left" ? "right" : "left"} decor={stop.decor} index={i} />
                  </div>
                </li>
              </Fragment>
            );
          })}
        </ol>

        {/* end */}
        <div className="grid grid-cols-[48px_minmax(0,1fr)] pb-2 pt-8 lg:grid-cols-[1fr_140px_1fr]">
          <div ref={endRef} className="col-start-1 flex justify-center lg:col-start-2">
            <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-theme-yellow text-[22px]">
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4m0 0h11l-2 4 2 4H5" stroke="#000" strokeWidth="2.4" fill="#FF5B25" strokeLinejoin="round" /></svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
