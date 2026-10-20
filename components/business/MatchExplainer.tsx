"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Compass,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { FALLBACK_PLANS, type Plan } from "@/lib/collabs";
import { cn } from "@/lib/utils";

// Mirrors the scorers in the backend's SeekKrr Match pipeline (theme, local,
// content, quality, reliability, peer, activity). Keep claims to what it does.
const SIGNALS: { icon: LucideIcon; label: string; body: string }[] = [
  { icon: Compass, label: "Interest & category fit", body: "Their content themes vs. what your place is about" },
  { icon: MapPin, label: "In town now", body: "Recent check-ins near you" },
  { icon: BadgeCheck, label: "Content-format fit", body: "Formats they've proven vs. your brief" },
  { icon: Star, label: "Ratings", body: "How businesses rated them on past UGC briefs" },
  { icon: ShieldCheck, label: "Reliability", body: "How often they post after redeeming" },
  { icon: Users, label: "Similar businesses", body: "Who places like yours rated well" },
  { icon: Activity, label: "Activity", body: "Recently active on SeekKrr" },
];

// Illustration only: no names, scores or counts.
const MATCHES: { fit: string; who: string; reasons: string[]; ring: number; tone: string }[] = [
  {
    fit: "Best fit",
    who: "Food & travel creator",
    reasons: ["In Bir this week", "Café & food content", "Posts on time"],
    ring: 0.88,
    tone: "bg-theme-orange",
  },
  { fit: "Great fit", who: "Adventure creator", reasons: ["Reels match your brief"], ring: 0.74, tone: "bg-theme-blue" },
  { fit: "Good fit", who: "Culture creator", reasons: ["Rated well by similar places"], ring: 0.62, tone: "bg-theme-yellow" },
];

function ScoreRing({ value, size, reduceMotion, label }: { value: number; size: number; reduceMotion: boolean; label?: string }) {
  const stroke = size > 60 ? 7 : 5;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const end = c * (1 - value);
  return (
    <span className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-green-dark)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: reduceMotion ? end : c }}
          whileInView={{ strokeDashoffset: end }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: reduceMotion ? 0 : 1.1, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      {label ? (
        <span className="absolute text-center font-jakarta text-[10px] font-extrabold leading-tight text-black">{label}</span>
      ) : (
        <Sparkles className="absolute h-3.5 w-3.5 text-theme-green" />
      )}
    </span>
  );
}

function MatchVisual({ reduceMotion }: { reduceMotion: boolean }) {
  const [top, ...rest] = MATCHES;
  const appear = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-40px" },
          transition: { duration: 0.45, delay, ease: "easeOut" as const },
        };

  return (
    <figure className="relative mx-auto flex w-full max-w-[420px] flex-col gap-3">
      <motion.article
        {...appear(0)}
        className="rounded-[22px] border-[3px] border-black bg-white p-4 text-black shadow-[6px_6px_0_0_var(--color-yellow-accent)] sm:p-5"
      >
        <div className="flex items-center gap-3">
          <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[3px] border-black", top.tone)}>
            <UserRound className="h-6 w-6 text-white" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.12em] text-theme-green">{top.fit}</p>
            <p className="font-jakarta text-[16px] font-bold leading-tight">{top.who}</p>
          </div>
          <ScoreRing value={top.ring} size={64} reduceMotion={reduceMotion} label="Top fit" />
        </div>
        <p className="mb-2 mt-4 font-jakarta text-[11px] font-bold uppercase tracking-[0.12em] text-black/50">
          Why this match
        </p>
        <ul className="flex flex-wrap gap-1.5">
          {top.reasons.map((reason, i) => (
            <motion.li
              key={reason}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 18, delay: 0.5 + i * 0.18 }}
              className="rounded-full border-2 border-theme-green bg-theme-green px-2.5 py-1 font-jakarta text-[12px] font-bold text-theme-beige"
            >
              {reason}
            </motion.li>
          ))}
        </ul>
      </motion.article>

      {rest.map((match, i) => (
        <motion.div
          key={match.fit}
          {...appear(0.2 + i * 0.15)}
          className="flex items-center gap-3 rounded-[18px] border-[3px] border-black bg-white px-3 py-2.5 text-black"
        >
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black", match.tone)}>
            <UserRound className={cn("h-4 w-4", match.tone === "bg-theme-yellow" ? "text-black" : "text-white")} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.1em] text-theme-green">{match.fit}</p>
            <p className="font-jakarta text-[14px] font-bold leading-tight">{match.who}</p>
            <p className="truncate text-[12px] text-black/60">{match.reasons[0]}</p>
          </div>
          <ScoreRing value={match.ring} size={36} reduceMotion={reduceMotion} />
        </motion.div>
      ))}
      <figcaption className="text-center text-[12px] text-theme-beige/60">Illustration of how matches appear</figcaption>
    </figure>
  );
}

/** "AI creator matching" feature section for /business (SeekKrr Match AI, a Pro feature). */
export function MatchExplainer({ plans = FALLBACK_PLANS }: { plans?: Plan[] }) {
  const reduceMotion = useReducedMotion() ?? false;
  const pro = plans.find((p) => p.code === "pro")?.entitlements;
  const preview = plans.find((p) => p.code === "free")?.entitlements.match_reveals_per_month ?? 3;
  const proReveals = pro?.match_reveals_per_month ?? 100;
  const proInvites = pro?.invites_per_month ?? 50;

  return (
    <section
      id="ai-matching"
      aria-labelledby="match-title"
      className="relative w-full scroll-mt-24 bg-theme-beige px-4 py-10 sm:px-6 md:px-12 md:py-14 lg:px-24 lg:py-16"
    >
      <div className="relative mx-auto w-full max-w-[1240px] rounded-[24px] border-[3px] border-black bg-theme-green px-5 pb-8 pt-10 text-theme-beige shadow-[8px_8px_0_0_var(--color-yellow-accent)] sm:px-8 lg:px-12 lg:pb-10 lg:pt-12 xl:rounded-[32px]">
        {/* Pro sticker: the tilt sits on a wrapper so framer's scale animation can't reset it. */}
        <div className="absolute -top-5 left-5 -rotate-6 sm:left-8">
          <motion.span
            initial={reduceMotion ? false : { scale: 0.3, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 14 }}
            className="inline-flex items-center gap-1.5 rounded-[14px] border-[3px] border-black bg-theme-yellow px-4 py-1.5 font-jakarta text-[18px] font-extrabold uppercase tracking-wide text-black shadow-[4px_4px_0_0_#000] sm:text-[20px]"
          >
            <Sparkles className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            Pro feature
          </motion.span>
        </div>

        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <div className="min-w-0">
            <p className="font-jakarta text-[16px] font-medium text-theme-yellow md:text-[20px]">
              Find the right creators with
            </p>
            <h2
              id="match-title"
              className="mt-1 font-handwriting text-[44px] font-bold leading-[0.95] text-theme-beige [text-shadow:3px_3px_0_rgba(0,0,0,0.35)] sm:text-[52px] lg:text-[64px]"
            >
              AI creator matching
            </h2>
            <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-theme-beige/85 md:text-[17px]">
              SeekKrr Match AI ranks the opted-in creators who fit your place for every UGC brief, and tells you why.
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {SIGNALS.map(({ icon: Icon, label, body }) => (
                <li key={label} className="flex items-start gap-3">
                  <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black bg-theme-yellow">
                    <Icon className="h-4 w-4 text-black" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-jakarta text-[15px] font-bold leading-tight text-theme-beige">{label}</h3>
                    <p className="text-[13px] leading-snug text-theme-beige/70">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[13px] leading-relaxed text-theme-beige/70">
              Only opted-in creators appear, contact details stay hidden until they agree, and newer creators get a fair shot.
            </p>
          </div>

          <MatchVisual reduceMotion={reduceMotion} />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 border-t-2 border-dashed border-theme-beige/25 pt-6 md:grid-cols-[1fr_1fr_auto] md:items-center md:gap-5">
          <div className="rounded-[18px] border-2 border-theme-beige/40 px-4 py-3">
            <p className="font-jakarta text-[15px] font-extrabold">Free &amp; Growth</p>
            <p className="text-[14px] text-theme-beige/80">Top-{preview} match preview each month</p>
          </div>
          <div className="rounded-[18px] border-[3px] border-black bg-theme-yellow px-4 py-3 text-black shadow-[4px_4px_0_0_#000]">
            <p className="flex items-center gap-2 font-jakarta text-[15px] font-extrabold">
              Pro
              <span className="rounded-full bg-black px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-theme-yellow">
                Full AI matching
              </span>
            </p>
            <p className="text-[14px] text-black/80">
              {proReveals === null ? "Unlimited" : proReveals} reveals · {proInvites === null ? "unlimited" : proInvites} invites a
              month · score breakdown
            </p>
          </div>
          <Link
            href="/business/pricing"
            className={cn(buttonVariants({ variant: "yellow", size: "lg" }), "w-full md:w-auto")}
          >
            See Pro plans
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
