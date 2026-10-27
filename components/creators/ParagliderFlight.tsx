"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Paraglider } from "./TrailArt";
import { trailBike } from "./trailBike";

/*
 * A paraglider that flies the creators page from Billing to Bir, with the bike:
 * it takes off at the top, comes down to meet the bike where the road starts,
 * flies just above and ahead of it through every stop, then leaves it at the
 * finish flag and lands on the landing site in the finale (#landing-site).
 *
 * Its height follows the scroll directly (no lag), so scrolling down only
 * ever brings it down; only the landing approach is eased.
 */

type Flight = { w: number; offX: number; offY: number; startX: number; startY: number; landX: number; landY: number };

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (a: number, b: number, x: number) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export function ParagliderFlight() {
  const reduce = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const [landed, setLanded] = useState(false);
  const landedRef = useRef(false);
  const lastX = useRef<number | null>(null);
  const last = useRef({ sy: 0, y: -Infinity });

  // Page coordinates of the take-off, the landing spot and this layer.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    let raf = 0;
    const measure = () => {
      const target = document.getElementById("landing-site");
      if (!target) return;
      const lb = layer.getBoundingClientRect(), tb = target.getBoundingClientRect();
      const offX = lb.left + window.scrollX, offY = lb.top + window.scrollY, w = lb.width;
      setFlight({
        w, offX, offY,
        startX: offX + w * (w < 768 ? 0.76 : 0.85),
        startY: offY + (w < 768 ? 210 : 250),
        landX: tb.left + window.scrollX + tb.width / 2,
        landY: tb.top + window.scrollY + tb.height / 2,
      });
    };
    const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure); };
    const ro = new ResizeObserver(schedule);
    ro.observe(layer);
    window.addEventListener("resize", schedule);
    schedule();
    return () => { ro.disconnect(); window.removeEventListener("resize", schedule); cancelAnimationFrame(raf); };
  }, []);

  const gx = useMotionValue(-200);
  const gy = useMotionValue(-200);
  const takeoff = useMotionValue(1);
  const bankTarget = useMotionValue(0);
  const bank = useSpring(bankTarget, { stiffness: 110, damping: 20 });
  const sideTarget = useMotionValue(0);
  const side = useSpring(sideTarget, { stiffness: 260, damping: 30 });
  const approachTarget = useMotionValue(0);
  const approach = useSpring(approachTarget, { stiffness: 55, damping: 17 });

  useAnimationFrame(() => {
    if (!flight) return;
    const { w, offX, offY, startX, startY, landX, landY } = flight;
    const sy = window.scrollY, vh = window.innerHeight;
    const narrow = w < 768;
    // highest the glider's feet may sit on screen: low enough that the whole wing clears the navbar
    const ceiling = sy + (narrow ? 182 : 228);
    const line = Math.max(ceiling, sy + vh * (narrow ? 0.28 : 0.3)); // where it sits when it isn't with the bike
    const ready = trailBike.ready.get() > 0;
    const roadStartY = ready ? trailBike.startY.get() : landY;
    const roadEndY = ready ? trailBike.endY.get() : landY;

    // free flight: Billing down to the road, then the finish down to the landing site
    let x: number, y: number;
    if (line < roadStartY) {
      y = Math.max(startY, line);
      const k = smoothstep(startY, roadStartY - 200, y);
      const meet = ready ? trailBike.startX.get() + 160 : offX + w * 0.5;
      x = lerp(startX, meet, k) + Math.sin((y - startY) / 420) * w * 0.07 * (1 - k);
    } else {
      y = Math.min(landY, line);
      x = lerp(ready ? trailBike.endX.get() : offX + w * 0.5, landX, smoothstep(roadEndY, landY - 250, y));
    }

    // with the bike: just above and a little ahead of it
    if (ready) {
      const withBike = smoothstep(roadStartY - 420, roadStartY - 80, line) * (1 - smoothstep(roadEndY - 40, roadEndY + 320, line));
      // above the riders' heads with a gap; if there's no room above (short screens), move out ahead
      const bikeY = trailBike.y.get();
      const by = Math.max(bikeY - (narrow ? 120 : 190), ceiling);
      const clash = (by - (narrow ? 16 : 21) + 26) - (bikeY - (narrow ? 57 : 130));
      const push = clamp01((clash + 30) / 40);
      // give way towards the middle of the screen (ahead of the bike would be off the edge at a hairpin)
      const towardsMiddle = trailBike.x.get() > offX + w / 2 ? -1 : 1;
      sideTarget.set(lerp(trailBike.dir.get() * (narrow ? 20 : 40), towardsMiddle * (narrow ? 130 : 230), push));
      const bx = trailBike.x.get() + side.get();
      x = lerp(x, bx, withBike);
      y = lerp(y, by, withBike);
    }

    // landing: as soon as the landing site is on screen, come in
    approachTarget.set(reduce || landY <= sy + vh * 0.9 ? 1 : 0);
    const a = approach.get();
    x = lerp(x, landX, a);
    y = lerp(y, landY, a);

    // scrolling down never lifts it (the road only goes downhill, so neither does the glider)
    if (sy >= last.current.sy - 0.5) y = Math.max(y, last.current.y);
    last.current = { sy, y };

    x = Math.min(offX + w - 56, Math.max(offX + 56, x));
    gx.set(x - offX);
    gy.set(y - offY);
    takeoff.set(1 - smoothstep(startY, startY + 140, line));
    const dx = lastX.current == null ? 0 : x - lastX.current;
    lastX.current = x;
    bankTarget.set(Math.max(-26, Math.min(26, dx * 2.4)));
    const down = approachTarget.get() === 1 && a > 0.97;
    if (down !== landedRef.current) {
      landedRef.current = down;
      setLanded(down);
    }
  });

  return (
    <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[45] overflow-hidden">
      {flight && (
        <>
          <motion.div className="absolute" style={{ left: flight.startX - flight.offX, top: flight.startY - flight.offY + 40, opacity: takeoff }}>
            <span className="absolute -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-black bg-white px-2.5 py-0.5 font-jakarta text-[11px] font-extrabold uppercase tracking-widest text-black">
              Take-off · Billing
            </span>
          </motion.div>

          <motion.div className="absolute left-0 top-0" style={{ x: gx, y: gy }}>
            <motion.div style={{ rotate: landed ? 0 : bank }} className="-ml-[46px] -mt-[104px] w-[92px] sm:-ml-[60px] sm:-mt-[136px] sm:w-[120px]">
              <motion.div
                animate={landed || reduce ? { y: 0 } : { y: [0, -5, 0] }}
                transition={{ duration: 2.6, repeat: landed ? 0 : Infinity, ease: "easeInOut" }}
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
                style={{ left: flight.landX - flight.offX, top: flight.landY - flight.offY - 200 }}
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
