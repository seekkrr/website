"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { Paraglider } from "./TrailArt";

/*
 * A paraglider that takes off at the top of the creators page (Billing) and
 * glides down it in wide swoops as you scroll, then lands on the landing site
 * in the finale (#landing-site, Bir). Scrolling back up takes it off again.
 */

type Flight = { w: number; startX: number; startY: number; landX: number; landY: number };

const smoothstep = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export function ParagliderFlight() {
  const reduce = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [landed, setLanded] = useState(false);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let raf = 0;
    const measure = () => {
      const target = document.getElementById("landing-site");
      if (!target) return;
      const lb = layer.getBoundingClientRect(), tb = target.getBoundingClientRect();
      const w = lb.width;
      setFlight({
        w,
        startX: w * (w < 768 ? 0.78 : 0.86),
        startY: w < 768 ? 200 : 236,
        landX: tb.left + tb.width / 2 - lb.left,
        landY: tb.top + tb.height / 2 - lb.top,
      });
    };
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    const ro = new ResizeObserver(schedule);
    ro.observe(layer);
    window.addEventListener("resize", schedule);
    schedule();
    return () => { ro.disconnect(); window.removeEventListener("resize", schedule); cancelAnimationFrame(raf); };
  }, []);

  const altitude = useMotionValue(0);
  const y = useSpring(altitude, { stiffness: 45, damping: 18, mass: 1 });
  const { scrollY } = useScroll();
  const follow = useCallback(() => {
    if (!flight) return;
    const docY = window.scrollY + window.innerHeight * 0.3;
    // once the landing site is on screen, come in to land
    const approach = flight.landY <= window.scrollY + window.innerHeight * 0.92;
    const target = reduce || approach ? flight.landY : Math.min(flight.landY, Math.max(flight.startY, docY));
    altitude.set(target);
    const down = target >= flight.landY - 2;
    setLanded((v) => (v === down ? v : down));
  }, [flight, reduce, altitude]);
  useMotionValueEvent(scrollY, "change", follow);
  useEffect(() => {
    const raf = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(raf);
  }, [follow]);

  // Wide S-turns across the page, settling onto the landing spot.
  const xAt = useCallback((yy: number) => {
    if (!flight) return 0;
    const { w, startX, startY, landX, landY } = flight;
    const amp = w * (w < 768 ? 0.3 : 0.36);
    const t = (yy - startY) / 1700;
    const wander = w * 0.5 + amp * Math.sin(t * Math.PI * 2 + Math.asin(Math.max(-1, Math.min(1, (startX - w * 0.5) / amp))));
    return wander + (landX - wander) * smoothstep(landY - 900, landY - 60, yy);
  }, [flight]);
  const x = useTransform(y, xAt);
  const bank = useTransform(y, (yy) => Math.max(-24, Math.min(24, (xAt(yy + 8) - xAt(yy - 8)) * 0.9)));
  const sinkY = useTransform(y, (yy) => yy);
  const takeoffFade = useTransform(y, (yy) => (flight ? 1 - smoothstep(flight.startY, flight.startY + 160, yy) : 1));

  return (
    <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[45] overflow-hidden">
      {flight && (
        <>
          {/* take-off */}
          <motion.div
            className="absolute"
            style={{ left: flight.startX, top: flight.startY + 40, opacity: takeoffFade }}
          >
            <span className="absolute -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-black bg-white px-2.5 py-0.5 font-jakarta text-[11px] font-extrabold uppercase tracking-widest text-black">
              Take-off · Billing
            </span>
          </motion.div>

          <motion.div className="absolute left-0 top-0" style={{ x, y: sinkY }}>
            <motion.div
              style={{ rotate: landed ? 0 : bank }}
              className="-ml-[46px] -mt-[104px] w-[92px] sm:-ml-[60px] sm:-mt-[136px] sm:w-[120px]"
            >
              <motion.div
                animate={landed || reduce ? { y: 0 } : { y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: landed ? 0 : Infinity, ease: "easeInOut" }}
              >
                <Paraglider landed={landed} className="h-auto w-full drop-shadow-[3px_4px_0_rgba(0,0,0,0.2)]" />
              </motion.div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {landed && (
              <motion.p
                key="landed"
                className="absolute -translate-x-1/2 whitespace-nowrap rounded-[12px] border-[3px] border-black bg-white px-3 py-0.5 font-handwriting text-[26px] font-bold text-black [box-shadow:3px_3px_0_#000] sm:text-[32px]"
                style={{ left: flight.landX, top: flight.landY - 200 }}
                initial={{ opacity: 0, y: 10, scale: 0.6, rotate: -8 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: -4 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 12, delay: 0.5 }}
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
