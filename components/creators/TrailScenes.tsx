"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/*
 * Tiny animated app screens for the collab trail: one per stop, acting out
 * that step in the SeekKrr app (same flow as the "Creator 1–7" videos).
 * Each scene is a function of time `t` (seconds into its loop), so it only
 * ticks while its card is on screen, and shows its finished state when
 * motion is reduced.
 */

const APP = {
  bg: "#FDFDFD",
  teal: "#003634",
  mauve: "#A2548E",
  chip: "#00A49E",
  chipSoft: "#E0F4F3",
  plum: "#340036",
  grey: "#7A7A7A",
  yellow: "#FECD36",
};

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const eOut = (p: number) => 1 - Math.pow(1 - p, 3);
const eInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const eBack = (p: number) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * seg(t, a, b)));
const blink = (t: number) => Math.floor(t * 2.4) % 2 === 0;

/** Seconds into a looping animation while `play` is true; `still` when motion is reduced. */
function useLoop(play: boolean, duration: number, still: number) {
  const reduce = useReducedMotion();
  const [t, setT] = useState(still);
  useEffect(() => {
    if (reduce || !play) return;
    let raf = 0;
    let last = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (now - last > 33) {
        last = now;
        setT(((now - start) / 1000) % duration);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, duration, reduce]);
  return reduce ? still : t;
}

/* ── Building blocks ─────────────────────────────────────────────────── */

export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`relative h-[300px] w-[156px] shrink-0 rounded-[30px] border-[3px] border-black bg-black p-[5px] ${className}`}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[24px]" style={{ background: APP.bg }}>
        <div className="absolute left-1/2 top-[6px] z-20 h-[14px] w-[52px] -translate-x-1/2 rounded-full bg-black" />
        <div className="absolute inset-0 px-[10px] pt-[30px] font-sans text-[9px] leading-tight text-neutral-900">
          {children}
        </div>
      </div>
    </div>
  );
}

function Heading({ children, size = 11 }: { children: ReactNode; size?: number }) {
  return (
    <p className="font-jakarta font-extrabold" style={{ color: APP.teal, fontSize: size, textShadow: `1px 1px 0 ${APP.yellow}` }}>
      {children}
    </p>
  );
}

function Pill({ label, bg = APP.mauve, fg = "#fff", outline = false, check = false, style }: {
  label: string; bg?: string; fg?: string; outline?: boolean; check?: boolean; style?: CSSProperties;
}) {
  return (
    <div
      className="flex h-[22px] items-center justify-center gap-1 rounded-full text-[9px] font-bold"
      style={{ background: outline ? "#fff" : bg, color: outline ? bg : fg, border: outline ? `1.5px solid ${bg}` : undefined, ...style }}
    >
      {check && <Check color={outline ? bg : fg} />}
      {label}
    </div>
  );
}

function Check({ color = "#fff", size = 9 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2 6.5 4.8 9 10 3" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Tap({ x, y, t, at }: { x: number; y: number; t: number; at: number }) {
  const d = t - at;
  if (d < -0.25 || d > 0.4) return null;
  const a = d < 0 ? seg(d, -0.25, -0.12) : 1 - seg(d, 0.15, 0.4);
  const ring = d >= 0 ? seg(d, 0, 0.35) : 0;
  return (
    <>
      <span
        className="pointer-events-none absolute z-30 rounded-full border-2 border-white"
        style={{ left: x - 8, top: y - 8, width: 16, height: 16, background: "rgba(20,20,20,0.28)", opacity: a }}
      />
      {d >= 0 && (
        <span
          className="pointer-events-none absolute z-30 rounded-full border-2"
          style={{
            left: x - 8 - ring * 12, top: y - 8 - ring * 12, width: 16 + ring * 24, height: 16 + ring * 24,
            borderColor: "var(--color-orange-accent)", opacity: (1 - ring) * 0.9,
          }}
        />
      )}
    </>
  );
}

function Field({ label, value, focus, caret, placeholder }: {
  label: string; value: string; focus?: boolean; caret?: boolean; placeholder?: string;
}) {
  return (
    <div className="mt-[6px]">
      <p className="mb-[3px] text-[8px] font-semibold" style={{ color: APP.grey }}>{label}</p>
      <div
        className="flex h-[22px] items-center rounded-[7px] bg-white px-[7px] text-[9.5px] font-medium"
        style={{ border: `${focus ? 1.6 : 1}px solid ${focus ? APP.teal : "#CFCFCF"}` }}
      >
        {value || <span className="text-neutral-400">{placeholder}</span>}
        {focus && caret && <span className="ml-px inline-block h-[11px] w-px" style={{ background: APP.teal }} />}
      </div>
    </div>
  );
}

function Chip({ label, on, scale = 1 }: { label: string; on?: boolean; scale?: number }) {
  return (
    <span
      className="inline-flex h-[18px] items-center rounded-full px-[7px] text-[8px] font-semibold"
      style={{
        background: on ? APP.chip : "#fff", color: on ? "#fff" : "#444",
        border: on ? "none" : "1px solid #CFCFCF", transform: `scale(${scale})`,
      }}
    >
      {label}
    </span>
  );
}

function CollabMini({ want, give, mode, button, isNew }: { want: string; give: string; mode: string; button: ReactNode; isNew?: boolean }) {
  return (
    <div className="relative mt-[7px] rounded-[10px] border border-neutral-300 bg-white p-[7px] shadow-sm">
      {isNew && (
        <span className="absolute right-[6px] top-[6px] rounded-full px-[5px] py-px text-[7px] font-bold text-white" style={{ background: APP.chip }}>
          New
        </span>
      )}
      <p className="text-[8.5px]"><b style={{ color: APP.plum }}>Want</b>&nbsp;&nbsp;{want}</p>
      <p className="mt-[2px] text-[8.5px]"><b style={{ color: APP.plum }}>For</b>&nbsp;&nbsp;&nbsp;&nbsp;{give}</p>
      <span className="mt-[4px] inline-block rounded-full bg-neutral-100 px-[6px] py-px text-[7.5px] text-neutral-600">{mode}</span>
      <div className="mt-[5px] w-[64px]">{button}</div>
    </div>
  );
}

function Toast({ title, body, p }: { title: string; body: string; p: number }) {
  if (p <= 0) return null;
  return (
    <div
      className="absolute inset-x-[6px] z-30 rounded-[10px] border border-neutral-200 bg-white px-[8px] py-[6px] shadow-md"
      style={{ top: -40 + 70 * eOut(p) }}
    >
      <p className="text-[8.5px] font-bold">{title}</p>
      <p className="text-[8px]" style={{ color: APP.grey }}>{body}</p>
    </div>
  );
}

function Confetti({ t, at }: { t: number; at: number }) {
  const d = t - at;
  if (d < 0 || d > 1.4) return null;
  const cols = [APP.mauve, APP.chip, APP.yellow, "#FF5B25", "#8398FF"];
  return (
    <>
      {Array.from({ length: 22 }, (_, i) => {
        const ang = (i / 22) * Math.PI * 2 + (i % 3) * 0.4;
        const sp = 40 + (i % 5) * 14;
        const k = eOut(Math.min(1, d / 0.7));
        return (
          <span
            key={i}
            className="absolute h-[3px] w-[6px]"
            style={{
              left: 63 + Math.cos(ang) * sp * k, top: 70 + Math.sin(ang) * sp * k + 50 * d * d,
              background: cols[i % cols.length], opacity: 1 - seg(d, 1, 1.4), transform: `rotate(${d * 400 + i * 30}deg)`,
            }}
          />
        );
      })}
    </>
  );
}

function BigCheck({ p }: { p: number }) {
  return (
    <div
      className="mx-auto flex h-[42px] w-[42px] items-center justify-center rounded-full"
      style={{ background: APP.chip, transform: `scale(${eBack(Math.min(1, p * 1.5))})` }}
    >
      <Check size={22} />
    </div>
  );
}

/* ── The seven scenes ────────────────────────────────────────────────── */

function ProfileScene({ play }: { play: boolean }) {
  const t = useLoop(play, 4.6, 3.6);
  const sel = [1.6, 1.9, -1, 2.2];
  const saved = t >= 2.9;
  return (
    <PhoneFrame>
      <Heading size={12}>Know Your Creator</Heading>
      <p className="mt-[2px] text-[7.5px]" style={{ color: APP.grey }}>Businesses see this first.</p>
      <Field label="Name" value="Aarav" />
      <Field label="Instagram" value={typed("@yourhandle", t, 0.3, 1.3)} focus={t > 0.2 && t < 1.45} caret={blink(t)} placeholder="@handle" />
      <p className="mb-[3px] mt-[7px] text-[8px] font-semibold" style={{ color: APP.grey }}>Travel style</p>
      <div className="flex flex-wrap gap-[4px]">
        {["Backpacker", "Foodie", "Treks", "Cafés"].map((s, i) => {
          const at = sel[i];
          const on = at > 0 && t >= at;
          return <Chip key={s} label={s} on={on} scale={on ? 0.88 + 0.12 * eBack(seg(t, at, at + 0.2)) : 1} />;
        })}
      </div>
      <p className="mb-[3px] mt-[7px] text-[8px] font-semibold" style={{ color: APP.grey }}>Bio</p>
      <div className="h-[30px] rounded-[7px] border border-neutral-300 bg-white px-[7px] py-[5px] text-[8.5px]">
        {typed("Mountains, cafés, slow mornings.", t, 2.3, 2.7)}
      </div>
      <Pill label={saved ? "Profile saved" : "Save profile"} bg={saved ? APP.chip : APP.mauve} check={saved} style={{ marginTop: 9 }} />
      <Tap x={73} y={226} t={t} at={2.8} />
    </PhoneFrame>
  );
}

function FindScene({ play }: { play: boolean }) {
  const t = useLoop(play, 4.6, 3.4);
  const pins: [number, number][] = [[30, 92], [96, 76], [64, 128], [110, 120], [26, 160], [94, 168]];
  const up = eOut(seg(t, 1.9, 2.3));
  return (
    <PhoneFrame>
      <div className="absolute inset-0" style={{ background: "#E8EEE3" }}>
        <span className="absolute -left-4 top-[110px] h-[9px] w-[200px] rotate-[8deg] rounded-full" style={{ background: "#BCDCEF" }} />
        <span className="absolute left-[50px] top-0 h-[300px] w-[6px] rotate-[6deg] bg-white" />
        <span className="absolute left-0 top-[64px] h-[6px] w-[160px] rotate-[5deg] bg-white" />
        <span className="absolute left-0 top-[188px] h-[6px] w-[160px] -rotate-[4deg] bg-white" />
        <span className="absolute left-[112px] top-0 h-[300px] w-[6px] rotate-[4deg] bg-white" />
        <span className="absolute left-[-20px] top-[196px] h-[60px] w-[80px] rounded-full" style={{ background: "#D2E5C6" }} />
      </div>
      <div className="relative z-10 flex h-[22px] items-center gap-1 rounded-full border border-neutral-200 bg-white px-[8px] text-[8.5px] text-neutral-600 shadow-sm">
        <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden="true"><circle cx="5" cy="5" r="3.5" stroke="#777" strokeWidth="1.6" fill="none" /><path d="m8 8 3 3" stroke="#777" strokeWidth="1.6" strokeLinecap="round" /></svg>
        Places open for collabs
      </div>
      <div className="relative z-10 mt-[5px] flex gap-[4px]">
        <span className="rounded-full px-[7px] py-[2px] text-[8px] font-semibold text-white" style={{ background: APP.mauve }}>Collabs</span>
        <span className="rounded-full border border-neutral-300 bg-white px-[7px] py-[2px] text-[8px]">Food</span>
        <span className="rounded-full border border-neutral-300 bg-white px-[7px] py-[2px] text-[8px]">Stays</span>
      </div>
      {pins.map(([x, y], i) => {
        const p = seg(t, 0.3 + i * 0.12, 0.6 + i * 0.12);
        const picked = i === 2 && t >= 1.6;
        const s = (picked ? 1.25 : 1) * eBack(p);
        return (
          <span key={i} className="absolute z-10" style={{ left: x, top: y, transform: `translate(-50%,-100%) scale(${s})`, transformOrigin: "50% 100%" }}>
            <svg width="18" height="24" viewBox="0 0 18 24" aria-hidden="true">
              <path d="M9 23C9 23 1 13.5 1 8.5a8 8 0 0 1 16 0C17 13.5 9 23 9 23Z" fill={picked ? APP.mauve : APP.teal} />
              <circle cx="9" cy="8.5" r="3" fill="#fff" />
            </svg>
          </span>
        );
      })}
      <Tap x={64} y={118} t={t} at={1.6} />
      {up > 0 && (
        <div className="absolute inset-x-[6px] z-20 rounded-[12px] border border-neutral-200 bg-white p-[7px] shadow-lg" style={{ top: 300 - 128 * up }}>
          <div className="flex gap-[6px]">
            <div className="h-[34px] w-[34px] shrink-0 rounded-[7px]" style={{ background: "linear-gradient(180deg,#9ED3F0,#FCE3BF)" }} />
            <div>
              <p className="text-[9.5px] font-bold" style={{ color: APP.teal }}>Hilltop Café</p>
              <span className="mt-[2px] inline-block rounded-full px-[5px] py-px text-[7.5px] font-semibold" style={{ background: APP.chipSoft, color: APP.chip }}>
                Open for Collabs
              </span>
            </div>
          </div>
          <Pill label="See collaborations" style={{ marginTop: 6 }} />
        </div>
      )}
    </PhoneFrame>
  );
}

function CheckinScene({ play }: { play: boolean }) {
  const t = useLoop(play, 4.4, 3.6);
  const p = eInOut(seg(t, 0.6, 1.5));
  const done = t >= 1.6;
  const swap = seg(t, 2.0, 2.3);
  return (
    <PhoneFrame>
      <div className="absolute inset-x-0 top-0 h-[84px]" style={{ background: "linear-gradient(180deg,#9ED3F0,#FCE3BF)" }}>
        <span className="absolute right-[26px] top-[30px] h-[14px] w-[14px] rounded-full" style={{ background: "#FFD27A" }} />
        <span className="absolute bottom-0 left-0 h-[46px] w-full" style={{ background: "#86A79C", clipPath: "polygon(0 100%,22% 20%,42% 70%,66% 0,100% 60%,100% 100%)" }} />
      </div>
      <div className="absolute inset-x-0 top-[72px] h-full rounded-t-[16px] px-[10px] pt-[12px]" style={{ background: APP.bg }}>
        <Heading size={12}>Hilltop Café</Heading>
        <span className="mt-[3px] inline-block rounded-full px-[6px] py-px text-[7.5px] font-semibold" style={{ background: APP.chipSoft, color: APP.chip }}>
          Open for Collabs
        </span>
        {swap < 1 && (
          <div style={{ opacity: 1 - swap }}>
            <p className="mt-[10px] text-[9px] font-bold" style={{ color: APP.plum }}>Open For Collaborations</p>
            <div className="relative mt-[7px] h-[30px] rounded-full" style={{ background: done ? APP.chip : APP.teal }}>
              {done ? (
                <div className="flex h-full items-center justify-center gap-1 text-[9.5px] font-bold text-white"><Check /> Checked in</div>
              ) : (
                <>
                  <span className="absolute inset-0 flex items-center justify-center pl-6 text-[9px] font-semibold text-white" style={{ opacity: 1 - seg(p, 0, 0.3) }}>
                    Slide to Check-In
                  </span>
                  <span className="absolute top-[3px] flex h-[24px] w-[24px] items-center justify-center rounded-full" style={{ left: 3 + p * 102, background: APP.yellow }}>
                    <svg width="8" height="10" viewBox="0 0 8 10" aria-hidden="true"><path d="M2 1.5 6 5 2 8.5" stroke={APP.teal} strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>
                  </span>
                </>
              )}
            </div>
            <p className="mt-[6px] text-center text-[7.5px]" style={{ color: APP.grey }}>Check-in to see collaborations</p>
          </div>
        )}
        {swap > 0 && (
          <div style={{ opacity: swap, transform: `translateY(${(1 - eOut(swap)) * 14}px)` }} className="mt-[8px]">
            <p className="text-[9px] font-bold" style={{ color: APP.plum }}>Available Collaborations</p>
            <CollabMini want="1 Reel" give="Lunch for 2" mode="Walk-in" isNew button={<Pill label="Redeem" />} />
          </div>
        )}
      </div>
      {t > 0.4 && t < 1.7 && (
        <span
          className="absolute z-30 h-4 w-4 rounded-full border-2 border-white"
          style={{ left: 25 + p * 102 - 8, top: 72 + 12 + 34 + 26, background: "rgba(20,20,20,0.28)" }}
        />
      )}
    </PhoneFrame>
  );
}

function PickScene({ play }: { play: boolean }) {
  const t = useLoop(play, 4.6, 3.8);
  const state = t >= 3.0 ? "ok" : t >= 2.35 ? "wait" : "avail";
  const ring = (a: number, b: number) =>
    t >= a && t <= b ? { boxShadow: `0 0 0 ${2 + ((t - a) % 0.7) * 5}px rgba(255,91,37,${0.7 - ((t - a) % 0.7)})` } : {};
  return (
    <PhoneFrame>
      <Toast title="Hilltop Café approved you" body="Visit on 28–29 Oct" p={seg(t, 3.1, 3.4)} />
      <Heading size={11}>Available Collaborations</Heading>
      <p className="text-[7.5px]" style={{ color: APP.grey }}>Hilltop Café</p>
      <CollabMini want="1 Reel" give="Lunch for 2" mode="Walk-in" isNew button={<Pill label="Redeem" style={ring(0.3, 1.4)} />} />
      <CollabMini
        want="2 Stories"
        give="1 night stay"
        mode="Needs approval"
        button={
          state === "avail" ? <Pill label="Avail" style={ring(1.5, 2.3)} />
            : state === "wait" ? <Pill label="Requested" bg="#9A9A9A" outline />
              : <Pill label="Approved" bg={APP.chip} check />
        }
      />
      <Tap x={44} y={238} t={t} at={2.35} />
    </PhoneFrame>
  );
}

function CodeScene({ play }: { play: boolean }) {
  const t = useLoop(play, 4.4, 3.4);
  const presses: [number, string][] = [[0.5, "4"], [0.8, "7"], [1.1, "2"], [1.4, "9"]];
  const n = presses.filter(([a]) => t >= a).length;
  const ok = seg(t, 1.75, 1.95);
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];
  return (
    <PhoneFrame>
      {ok < 1 && (
        <div style={{ opacity: 1 - ok }}>
          <div className="text-center"><Heading size={11}>Ask the Staff to enter the Code</Heading></div>
          <p className="mt-[2px] text-center text-[7.5px]" style={{ color: APP.grey }}>Hilltop Café · Lunch for 2</p>
          <div className="mt-[8px] flex justify-center gap-[6px]">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex h-[30px] w-[24px] items-center justify-center rounded-[6px] bg-white"
                style={{ border: `${i === n ? 1.8 : 1}px solid ${i === n ? APP.teal : "#CFCFCF"}` }}
              >
                {i < n && <span className="h-[6px] w-[6px] rounded-full" style={{ background: APP.teal }} />}
              </div>
            ))}
          </div>
          <div className="mt-[10px] grid grid-cols-3 gap-[4px]">
            {keys.map((k, i) => {
              const down = presses.some(([a, key]) => key === k && t >= a && t < a + 0.15);
              return (
                <div key={i} className="flex h-[24px] items-center justify-center rounded-[6px] text-[11px] font-semibold" style={{ background: k ? (down ? "#D5DCDC" : "#F1F3F3") : "transparent" }}>
                  {k}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {presses.map(([a, k]) => {
        const i = keys.indexOf(k);
        return <Tap key={a} x={10 + (i % 3) * 46 + 21} y={30 + 82 + Math.floor(i / 3) * 28 + 12} t={t} at={a} />;
      })}
      {ok > 0 && (
        <div className="absolute inset-0 pt-[56px] text-center" style={{ opacity: ok, background: APP.bg }}>
          <Confetti t={t} at={1.8} />
          <BigCheck p={seg(t, 1.8, 2.2)} />
          <div className="mt-[10px]"><Heading size={13}>Collaboration Redeemed</Heading></div>
          <p className="mt-[4px] text-[8px]" style={{ color: APP.grey }}>Lunch for 2 at Hilltop Café</p>
          <div className="mx-[10px] mt-[12px] rounded-[9px] border border-neutral-200 bg-white px-[7px] py-[6px] text-left shadow-sm" style={{ opacity: seg(t, 2.4, 2.7) }}>
            <p className="text-[8.5px] font-bold" style={{ color: APP.teal }}>No network? Show your QR</p>
            <p className="text-[7.5px]" style={{ color: APP.grey }}>Staff can scan it instead</p>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}

function CreateScene({ play }: { play: boolean }) {
  const t = useLoop(play, 4.6, 3.6);
  const items = ["1 Reel", "Tag @hilltopcafe", "Add #collab", "Post by 30 Oct"];
  const rec = eOut(seg(t, 2.4, 2.7));
  return (
    <PhoneFrame>
      <Heading size={13}>Your brief</Heading>
      <p className="text-[7.5px]" style={{ color: APP.grey }}>Hilltop Café · Lunch for 2</p>
      <span className="mt-[5px] inline-block rounded-full px-[6px] py-[2px] text-[7.5px] font-semibold" style={{ background: APP.chipSoft, color: APP.chip }}>
        Redeemed — post your content
      </span>
      <div className="mt-[7px] rounded-[10px] border border-neutral-300 bg-white px-[8px] py-[2px] shadow-sm">
        {items.map((s, i) => {
          const at = 0.5 + i * 0.5;
          const on = t >= at;
          return (
            <div key={s} className={`relative flex items-center gap-[6px] py-[7px] ${i ? "border-t border-neutral-100" : ""}`}>
              <span
                className="flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-[4px]"
                style={{ background: on ? APP.chip : "#fff", border: on ? "none" : `1.5px solid ${APP.chip}`, transform: `scale(${on ? eBack(seg(t, at, at + 0.2)) : 1})` }}
              >
                {on && <Check size={8} />}
              </span>
              <span className={`text-[9px] ${on ? "font-semibold" : ""}`}>{s}</span>
            </div>
          );
        })}
      </div>
      {[0, 1, 2, 3].map((i) => <Tap key={i} x={16} y={30 + 52 + 20 + i * 27} t={t} at={0.5 + i * 0.5} />)}
      {rec > 0 && (
        <div className="mt-[8px] flex items-center gap-[6px] rounded-[9px] bg-neutral-900 px-[8px] py-[7px] text-white" style={{ opacity: rec, transform: `translateY(${(1 - rec) * 10}px)` }}>
          <span className="h-[7px] w-[7px] rounded-full bg-red-500" style={{ opacity: blink(t) ? 1 : 0.2 }} />
          <span className="text-[9px] font-bold">REC 00:{String(9 + Math.floor((t - 2.4) * 3)).padStart(2, "0")}</span>
          <span className="ml-auto text-[7.5px] text-white/70">Shooting your reel</span>
        </div>
      )}
    </PhoneFrame>
  );
}

function LinkScene({ play }: { play: boolean }) {
  const t = useLoop(play, 4.8, 3.9);
  const done = 1 + (t >= 1.6 ? 1 : 0) + (t >= 3.4 ? 1 : 0);
  const sent = seg(t, 1.35, 1.6);
  const rate = seg(t, 2.0, 2.2);
  const stars = Math.floor(seg(t, 2.2, 2.9) * 5 + 0.001);
  const link = typed("instagram.com/reel/C8x…", t, 0.3, 1.1);
  return (
    <PhoneFrame>
      <div className="flex items-center gap-[5px]">
        <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ background: APP.teal }}>H</span>
        <span className="text-[10px] font-bold" style={{ color: APP.teal }}>Hilltop Café</span>
      </div>
      <div className="-mx-[10px] mt-[6px] border-b border-neutral-200 bg-white px-[10px] pb-[6px] pt-[4px]">
        <div className="relative flex justify-between px-[6px]">
          <span className="absolute left-[12px] right-[12px] top-[5px] h-[2px] bg-neutral-200" />
          <span className="absolute left-[12px] top-[5px] h-[2px]" style={{ background: APP.chip, width: `${((done - 1) / 2) * 100}%`, maxWidth: "calc(100% - 24px)" }} />
          {["Visited", "Content", "Done"].map((s, i) => (
            <div key={s} className="relative flex flex-col items-center">
              <span className="flex h-[12px] w-[12px] items-center justify-center rounded-full" style={{ background: done > i ? APP.chip : "#fff", border: done > i ? "none" : "1.5px solid #C9C9C9" }}>
                {done > i && <Check size={7} />}
              </span>
              <span className="mt-[2px] text-[7px]" style={{ color: done > i ? APP.teal : APP.grey, fontWeight: done > i ? 700 : 500 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="-mx-[10px] h-full bg-neutral-100 px-[8px] pt-[8px]">
        <div className="w-[110px] rounded-[10px] border border-neutral-200 bg-white px-[7px] py-[5px] text-[8.5px]">Loved having you! Share your reel here.</div>
        {sent > 0 && (
          <div className="ml-auto mt-[6px] w-[104px] origin-bottom-right rounded-[10px] p-[4px]" style={{ background: APP.mauve, transform: `scale(${eBack(sent)})` }}>
            <div className="flex h-[40px] items-center justify-center rounded-[7px]" style={{ background: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.5v9L10.5 6Z" fill="#fff" /></svg>
            </div>
            <p className="mt-[3px] px-[2px] text-[8px] font-bold text-white">Instagram Reel</p>
          </div>
        )}
        {rate > 0 && (
          <div className="mx-auto mt-[8px] w-[112px] rounded-[9px] border border-neutral-200 bg-white px-[7px] py-[5px]" style={{ opacity: rate }}>
            <p className="text-[8px] font-bold" style={{ color: APP.teal }}>Rate your visit</p>
            <div className="mt-[2px] flex gap-[3px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} width="11" height="11" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m12 2 3 6.5 7 .9-5.2 4.8 1.4 7L12 17.8 5.8 21.2l1.4-7L2 9.4l7-.9Z" fill={i < stars ? APP.yellow : "#E4E4E4"} />
                </svg>
              ))}
            </div>
          </div>
        )}
      </div>
      {t < 1.9 && (
        <div className="absolute inset-x-[6px] top-[256px] flex h-[24px] items-center rounded-full border border-neutral-200 bg-white pl-[8px] pr-[3px] text-[8px] shadow-sm">
          <span className="truncate">{link || <span className="text-neutral-400">Message</span>}</span>
          <span className="ml-auto flex h-[18px] w-[18px] items-center justify-center rounded-full" style={{ background: APP.mauve }}>
            <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 1.5 9 5 1 8.5 2.5 5Z" fill="#fff" /></svg>
          </span>
        </div>
      )}
      <Tap x={130} y={268} t={t} at={1.3} />
    </PhoneFrame>
  );
}

export type SceneKey = "profile" | "find" | "checkin" | "pick" | "code" | "create" | "link";

export function TrailScene({ scene, play }: { scene: SceneKey; play: boolean }) {
  switch (scene) {
    case "profile": return <ProfileScene play={play} />;
    case "find": return <FindScene play={play} />;
    case "checkin": return <CheckinScene play={play} />;
    case "pick": return <PickScene play={play} />;
    case "code": return <CodeScene play={play} />;
    case "create": return <CreateScene play={play} />;
    case "link": return <LinkScene play={play} />;
  }
}
