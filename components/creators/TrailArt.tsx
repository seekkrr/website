"use client";

import type { CSSProperties } from "react";
import { motion, type MotionValue } from "framer-motion";

/*
 * Hand-drawn pieces for the creators page, in the site's illustration style:
 * flat fills, thick black outlines, blue / orange / yellow.
 *
 * Their idle loops (smoke, hair, flags, swaying) are CSS animations from
 * globals.css (.trail-*), so they don't cost any JavaScript per frame and
 * stop when the visitor prefers reduced motion.
 */

const INK = "#000";
const SKIN = "#F2B98B";
const BLUE = "#8398FF";
const ORANGE = "#FF5B25";
const YELLOW = "#FECD36";
const GREEN = "#003634";

type Vars = CSSProperties & Record<`--${string}`, string>;

/** Smoke or exhaust: little puffs that drift away from (x, y) and fade, on a loop. */
function Puffs({ x, y, dx, dy, r = 4, count = 3, period = 1.4, color = "#fff" }: {
  x: number; y: number; dx: number; dy: number; r?: number; count?: number; period?: number; color?: string;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          className="trail-puff"
          cx={x}
          cy={y}
          r={r}
          fill={color}
          stroke={INK}
          strokeWidth={1.4}
          style={{ "--dx": `${dx}px`, "--dy": `${dy}px`, animationDuration: `${period}s`, animationDelay: `${(i * period) / count}s` } as Vars}
        />
      ))}
    </>
  );
}

function Wheel({ cx, cy, spin }: { cx: number; cy: number; spin: MotionValue<number> }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={19} fill="#222" stroke={INK} strokeWidth={2.5} />
      <circle cx={cx} cy={cy} r={12} fill="#C9CED6" stroke={INK} strokeWidth={2} />
      <motion.g style={{ rotate: spin, transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx={cx} cy={cy} r={12} fill="none" />
        {[0, 45, 90, 135].map((a) => (
          <line
            key={a}
            x1={cx + Math.cos((a * Math.PI) / 180) * 11}
            y1={cy + Math.sin((a * Math.PI) / 180) * 11}
            x2={cx - Math.cos((a * Math.PI) / 180) * 11}
            y2={cy - Math.sin((a * Math.PI) / 180) * 11}
            stroke={INK}
            strokeWidth={1.6}
          />
        ))}
      </motion.g>
      <circle cx={cx} cy={cy} r={3.5} fill={YELLOW} stroke={INK} strokeWidth={1.6} />
    </g>
  );
}

/**
 * A Royal Enfield-style bike, facing right: the rider (smoking) and a girl
 * riding pillion, her hair and scarf in the wind. `spin` turns the wheels.
 */
export function Motorbike({ spin, speed, className = "" }: { spin: MotionValue<number>; speed?: MotionValue<number>; className?: string }) {
  return (
    <svg viewBox="0 0 170 128" className={className} aria-hidden="true" overflow="visible">
      {/* road shadow */}
      <ellipse cx={84} cy={118} rx={70} ry={6} fill="#000" opacity={0.18} />
      {/* speed lines, only while it's really moving */}
      {speed && (
        <motion.g style={{ opacity: speed }}>
          {[[52, 0], [74, 0.15], [94, 0.3]].map(([y, delay]) => (
            <path key={y} className="trail-speed" d={`M-6 ${y}h-26`} stroke={INK} strokeWidth={3} strokeLinecap="round" style={{ animationDelay: `${delay}s` }} />
          ))}
        </motion.g>
      )}
      {/* exhaust */}
      <Puffs x={14} y={104} dx={-34} dy={-10} r={5} color="#EDEDED" period={1.1} />
      <g className="trail-rumble">
        {/* scarf, flying back */}
        <path
          className="trail-wave"
          d="M60 44c-10 2-20 0-30 6 8 1 14 3 22-1-6 5-12 7-18 12 9-2 18-6 26-12Z"
          fill="#E8467C"
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
          style={{ transformOrigin: "100% 20%" }}
        />
        {/* her hair, streaming back */}
        <path
          className="trail-wave"
          d="M58 24c-8-3-18 1-24 9 6-1 10 0 14 2-6 2-10 6-12 11 7-4 13-5 19-4l6-6Z"
          fill="#4A2A1A"
          stroke={INK}
          strokeWidth={2}
          strokeLinejoin="round"
          style={{ transformOrigin: "100% 30%", animationDuration: "0.45s", animationDelay: "0.1s" }}
        />
        {/* rear fender + body */}
        <path d="M18 92a22 22 0 0 1 40-8" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <path d="M18 92a22 22 0 0 1 40-8" fill="none" stroke={ORANGE} strokeWidth={3.5} strokeLinecap="round" />
        {/* exhaust pipe */}
        <path d="M12 104h54" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <path d="M12 104h54" stroke="#D7DBE0" strokeWidth={3.5} strokeLinecap="round" />
        {/* engine */}
        <path d="M62 84h34l6 18H66Z" fill="#9AA0A6" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M70 88v10M78 88v10M86 88v10" stroke={INK} strokeWidth={1.6} />
        {/* frame */}
        <path d="M40 94 62 76h44l20 18M106 76l-4 26" fill="none" stroke={INK} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
        {/* seat */}
        <path d="M38 70c10-6 34-6 46-2v6H40Z" fill="#1E1E1E" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        {/* tank */}
        <path d="M82 66c4-8 22-10 30-2l-2 12H84Z" fill={ORANGE} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M90 68h14" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        {/* fork + bars + light */}
        <path d="M128 94 114 52" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <path d="M108 48l10-2 6 4" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={124} cy={62} r={7} fill={YELLOW} stroke={INK} strokeWidth={2.5} />
        <path d="M128 94a22 22 0 0 0-20-22" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />

        {/* her: legs, jacket, arm round him, head */}
        <path d="M54 72l12 6-2 16" fill="none" stroke="#2F3E7A" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M48 72c-2-14 4-28 14-32l8 4c2 10 0 20-4 28Z" fill={YELLOW} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <circle cx={62} cy={30} r={9.5} fill={SKIN} stroke={INK} strokeWidth={2.5} />
        <path d="M54 26c2-8 14-10 18-2-4-1-10 0-12 4Z" fill="#4A2A1A" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
        <circle cx={67} cy={30} r={1.2} fill={INK} />

        {/* him: legs, jacket, arms to the bars, head */}
        <path d="M76 70l20 4-4 20" fill="none" stroke="#2F3E7A" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M90 96h10" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <path d="M70 70c-2-16 2-30 12-36h10c6 10 6 24 2 36Z" fill={BLUE} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M88 42l20 6" stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <path d="M88 42l20 6" stroke={BLUE} strokeWidth={4} strokeLinecap="round" />
        <path d="M66 50c6 4 14 6 22 4" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <path d="M66 50c6 4 14 6 22 4" fill="none" stroke={YELLOW} strokeWidth={3} strokeLinecap="round" />
        <circle cx={88} cy={22} r={10.5} fill={SKIN} stroke={INK} strokeWidth={2.5} />
        {/* beanie + shades + stubble */}
        <path d="M77 20c0-10 22-12 22 0Z" fill={ORANGE} stroke={INK} strokeWidth={2.2} strokeLinejoin="round" />
        <path d="M86 23h12" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <path d="M84 30c4 3 10 3 12 0" fill="none" stroke="#3B2A20" strokeWidth={2} strokeLinecap="round" />
        {/* the cigarette and its smoke */}
        <path d="M96 29h9" stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <path d="M96 29h7" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" />
        <circle cx={105.5} cy={29} r={1.8} fill={ORANGE} />
        <Puffs x={106} y={26} dx={-14} dy={-20} r={2.6} count={3} period={1.6} color="#F4F4F4" />
      </g>
      <Wheel cx={38} cy={98} spin={spin} />
      <Wheel cx={128} cy={98} spin={spin} />
    </svg>
  );
}

/** A paraglider: canopy, lines and a pilot whose legs swing. `landed` drops the wing behind them. */
export function Paraglider({ landed = false, className = "" }: { landed?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 150 160" className={className} aria-hidden="true" overflow="visible">
      <motion.g
        animate={{ opacity: landed ? 0 : 1, y: landed ? 40 : 0, scaleY: landed ? 0.2 : 1 }}
        transition={{ duration: 0.6, ease: "easeIn" }}
        style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
      >
        <g className={landed ? undefined : "trail-breathe"}>
          <path d="M8 44C20 12 130 12 142 44c-14-6-34-9-67-9S22 38 8 44Z" fill={ORANGE} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <path d="M30 22c10-5 22-7 22-7l-1 21c-8 0-15 1-21 2Z" fill={YELLOW} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d="M98 15s12 2 22 7l0 21c-6-1-13-2-21-2Z" fill={YELLOW} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d="M66 13h18l1 22H65Z" fill={BLUE} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        </g>
        <path d="M12 44 70 112M138 44 80 112M40 38l30 74M110 38l-30 74M75 35v77" stroke={INK} strokeWidth={1.1} />
      </motion.g>
      {landed && (
        <motion.path
          d="M30 150c10-14 80-16 96-2 4 4-2 8-6 8H36c-6 0-8-3-6-6Z"
          fill={ORANGE}
          stroke={INK}
          strokeWidth={2.5}
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ transformBox: "fill-box", transformOrigin: "30% 100%" }}
        />
      )}
      {/* pilot: drops onto their feet when landed, sways and swings their legs while flying */}
      <motion.g animate={{ y: landed ? 26 : 0 }} transition={{ duration: 0.5 }}>
        <g className={landed ? undefined : "trail-sway"}>
          <circle cx={75} cy={108} r={7.5} fill={YELLOW} stroke={INK} strokeWidth={2.5} />
          <path d="M66 116h18l2 14H64Z" fill={BLUE} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          <path className={landed ? undefined : "trail-swing"} d="M70 130l-4 14M80 130l4 14" stroke="#2F3E7A" strokeWidth={4.5} strokeLinecap="round" />
        </g>
      </motion.g>
    </svg>
  );
}

/** Tibetan prayer flags on a string, each one fluttering. */
export function PrayerFlags({ className = "", count = 7 }: { className?: string; count?: number }) {
  const cols = ["#3B6FD8", "#FFFFFF", "#E5484D", "#2E9E5B", YELLOW];
  const w = 200, step = w / (count + 1);
  return (
    <svg viewBox={`0 0 ${w} 70`} className={className} aria-hidden="true" overflow="visible">
      <path d={`M0 10 Q${w / 2} 34 ${w} 10`} fill="none" stroke={INK} strokeWidth={2} />
      {Array.from({ length: count }, (_, i) => {
        const x = step * (i + 1), t = x / w, y = 10 + 48 * t * (1 - t) - 1;
        return (
          <path
            key={i}
            className="trail-flutter"
            d={`M${x - 9} ${y} h18 v20 l-9 -5 l-9 5 Z`}
            fill={cols[i % cols.length]}
            stroke={INK}
            strokeWidth={1.8}
            strokeLinejoin="round"
            style={{ animationDuration: `${1.3 + (i % 3) * 0.2}s`, animationDelay: `${i * 0.12}s` }}
          />
        );
      })}
    </svg>
  );
}

export function Pines({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden="true">
      {[[20, 1], [56, 1.35], [92, 1.1]].map(([x, s], i) => (
        <g key={i} transform={`translate(${x} ${90}) scale(${s})`}>
          <path d="M0-60 18-24H8L22 0H-22l14-24H-18Z" fill={i === 1 ? GREEN : "#2E5A43"} stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
          <path d="M-3 0h6v6h-6Z" fill="#6B4A33" stroke={INK} strokeWidth={1.6} />
        </g>
      ))}
    </svg>
  );
}

export function Cloud({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 64" className={className} aria-hidden="true">
      <path d="M22 56c-14 0-18-18-4-22 0-14 18-20 28-10 6-16 32-18 38-2 14-8 32 2 28 18 14 2 14 16 0 16Z" fill="#fff" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />
    </svg>
  );
}

/** Striped windsock on a pole, flapping. */
export function Windsock({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 110" className={className} aria-hidden="true" overflow="visible">
      <path d="M12 108V8" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      <g className="trail-sock">
        <path d="M12 10l70 10v14l-70 8Z" fill="#fff" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M30 12.6v26.4M48 15.2v22.4M66 17.8v18" stroke={INK} strokeWidth={1.4} />
        <path d="M12 10l18 2.6v26.4L12 42Z" fill={ORANGE} />
        <path d="M48 15.2l18 2.6v18l-18 1.8Z" fill={ORANGE} />
        <path d="M12 10l70 10v14l-70 8Z" fill="none" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      </g>
    </svg>
  );
}
