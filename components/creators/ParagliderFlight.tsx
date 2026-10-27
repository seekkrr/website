"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Paraglider } from "./TrailArt";

/*
 * The paraglider's flight from Billing to Bir: one fixed line down the whole
 * creators page (drawn faintly, like a route on a map), and the glider's place
 * on it is a direct function of the scroll position. No easing, no catching
 * up: it moves exactly as fast as the page does.
 *
 * It flies in its own lane, in the top part of the screen under the navbar,
 * so it never meets the bike (which rides lower down) or the stop cards; it
 * keeps to the side as the trail's finish scrolls past. Once the landing site
 * (#landing-site) comes into view it comes down onto the target on a spring:
 * it swoops in, dips just past the target and bounces back to touch down.
 */

type Flight = {
  w: number;
  /** this layer's page offsets */
  offX: number;
  offY: number;
  vh: number;
  narrow: boolean;
  /** how far down the screen the pilot's feet sit while flying */
  lane: number;
  startX: number;
  landX: number;
  landY: number;
  /** scroll positions: the quest map's end, and where the landing begins */
  trackEnd: number;
  landFrom: number;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Where the glider is on its line (layer coordinates) when the page is scrolled to s. */
function place(f: Flight, s: number) {
  const { w, narrow, lane, startX, trackEnd, offY } = f;
  const amp = w * (narrow ? 0.3 : 0.34), period = narrow ? 1500 : 2100;
  const phase = Math.asin(Math.max(-1, Math.min(1, (startX - w / 2) / amp)));
  // wide S-turns across the page…
  let x = w / 2 + amp * Math.sin((s / period) * Math.PI * 2 + phase);
  // …then off to the side as the trail's finish scrolls by…
  const side = w * (narrow ? 0.8 : 0.84);
  x = lerp(x, side, smooth(trackEnd - 500, trackEnd - 100, s));
  return { x, y: s + lane - offY };
}

export function ParagliderFlight() {
  const layerRef = useRef<HTMLDivElement>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [landed, setLanded] = useState(false);

  // Measure the page once laid out (and again whenever it changes size).
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let raf = 0;
    const measure = () => {
      const target = document.getElementById("landing-site");
      const track = document.querySelector<HTMLElement>("[data-quest-track]");
      if (!target) return;
      const sy = window.scrollY, vh = window.innerHeight;
      const lb = layer.getBoundingClientRect(), tb = target.getBoundingClientRect();
      const w = lb.width, narrow = w < 768;
      const landY = tb.top + sy + tb.height / 2;
      const trackEnd = track ? track.getBoundingClientRect().bottom + sy - vh : landY - vh * 2;
      setFlight({
        w, vh, narrow,
        offX: lb.left + window.scrollX,
        offY: lb.top + sy,
        lane: narrow ? Math.max(vh * 0.22, 184) : Math.max(vh * 0.22, 238),
        startX: w * (narrow ? 0.76 : 0.85),
        landX: tb.left + tb.width / 2 - lb.left,
        landY,
        trackEnd,
        // the landing site is near the bottom of the screen
        landFrom: landY - vh * 0.86,
      });
    };
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    const ro = new ResizeObserver(schedule);
    ro.observe(layer);
    window.addEventListener("resize", schedule);
    schedule();
    return () => { ro.disconnect(); window.removeEventListener("resize", schedule); cancelAnimationFrame(raf); };
  }, []);

  // Flying: straight from the scroll position, so it never lags behind.
  // Landing: a spring from its place on the line down to the target.
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const landing = useMotionValue(0);
  const descent = useSpring(landing, { stiffness: 75, damping: 9, mass: 1 });
  const k = reduce ? landing : descent;
  const x = useTransform([scrollY, k], ([s, d]: number[]) => (flight ? lerp(place(flight, s).x, flight.landX, d) : -300));
  const y = useTransform([scrollY, k], ([s, d]: number[]) => (flight ? lerp(place(flight, s).y, flight.landY - flight.offY, d) : -300));
  const bank = useTransform([scrollY, k], ([s, d]: number[]) => {
    if (!flight || d > 0.02) return 0;
    const a = place(flight, s - 12).x, b = place(flight, s + 12).x;
    return Math.max(-24, Math.min(24, (b - a) * 1.1));
  });
  const takeoff = useTransform(scrollY, [0, 160], [1, 0]);
  useMotionValueEvent(scrollY, "change", (s) => { if (flight) landing.set(s >= flight.landFrom ? 1 : 0); });
  useEffect(() => {
    if (!flight) return;
    const raf = requestAnimationFrame(() => landing.set(window.scrollY >= flight.landFrom ? 1 : 0));
    return () => cancelAnimationFrame(raf);
  }, [flight, landing]);
  // touched down once the spring has (nearly) arrived; airborne again as soon as it heads back up
  useMotionValueEvent(k, "change", (d) => {
    const down = landing.get() === 1 && d > 0.96;
    if (landing.get() === 0 || down) setLanded((v) => (v === down ? v : down));
  });

  // The whole route, drawn once as a faint dashed line.
  const route = useMemo(() => {
    if (!flight) return "";
    let d = "";
    const lift = flight.narrow ? 40 : 52;
    for (let s = 0; s <= flight.landFrom; s += 24) {
      const p = place(flight, s);
      d += `${d ? " L" : "M"} ${p.x.toFixed(1)} ${(p.y - lift).toFixed(1)}`;
    }
    // the final glide down to the landing site
    const from = place(flight, flight.landFrom), toY = flight.landY - flight.offY - lift;
    d += ` Q ${from.x.toFixed(1)} ${toY.toFixed(1)} ${flight.landX.toFixed(1)} ${toY.toFixed(1)}`;
    return d;
  }, [flight]);

  return (
    <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[45] overflow-hidden">
      {flight && (
        <>
          <svg className="absolute left-0 top-0 overflow-visible" width={flight.w} height={1}>
            <path d={route} fill="none" stroke="#000" strokeOpacity="0.22" strokeWidth="2.5" strokeDasharray="2 12" strokeLinecap="round" />
          </svg>

          <motion.div className="absolute" style={{ left: flight.startX, top: flight.lane + 40, opacity: takeoff }}>
            <span className="absolute -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-black bg-white px-2.5 py-0.5 font-jakarta text-[11px] font-extrabold uppercase tracking-widest text-black">
              Take-off · Billing
            </span>
          </motion.div>

          <motion.div className="absolute left-0 top-0 will-change-transform" style={{ x, y }}>
            <motion.div style={{ rotate: landed ? 0 : bank }} className="-ml-[46px] -mt-[104px] w-[92px] sm:-ml-[60px] sm:-mt-[136px] sm:w-[120px]">
              <div className={landed ? undefined : "trail-hover"}>
                <Paraglider landed={landed} className="h-auto w-full" />
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {landed && (
              <motion.p
                key="landed"
                className="absolute -translate-x-1/2 whitespace-nowrap rounded-[12px] border-[3px] border-black bg-white px-3 py-0.5 font-handwriting text-[26px] font-bold text-black [box-shadow:3px_3px_0_#000] sm:text-[32px]"
                style={{ left: flight.landX, top: flight.landY - flight.offY - (flight.narrow ? 132 : 200) }}
                initial={{ opacity: 0, y: 10, scale: 0.6, rotate: -8 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: -4 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 12, delay: 0.3 }}
              >
                Landed in Bir!
              </motion.p>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
