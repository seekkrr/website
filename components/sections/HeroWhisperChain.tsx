"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./HeroWhisperChain.module.css";

// The telephone game, played the good way round: one creator visit starts a message
// that gets more enthusiastic with every person it reaches, and ends in a booking.
const PEOPLE = [
    { name: "The creator", color: "var(--color-yellow-accent)" },
    { name: "A follower", color: "var(--color-blue-accent)" },
    { name: "Her friend", color: "var(--color-orange-accent)" },
    { name: "His brother", color: "var(--color-green-dark)" },
    { name: "Their team", color: "var(--color-yellow-accent)" },
    { name: "A new guest", color: "var(--color-blue-accent)" },
] as const;

const MESSAGES = [
    "Nice café.",
    "Lovely café, actually.",
    "You have to try this café.",
    "Everyone is going to this café.",
    "Their terrace is in every reel.",
    "Booked a table for Saturday!",
] as const;

const BUBBLE_BG = [
    "#FDFDFD",
    "#FDFDFD",
    "#FFF1C2",
    "var(--color-yellow-accent)",
    "var(--color-yellow-accent)",
    "var(--color-orange-accent)",
] as const;

const LAST = MESSAGES.length - 1;
const START_DELAY_MS = 800;
const STEP_MS = 1300;

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const subscribeReducedMotion = (onChange: () => void) => {
    const query = window.matchMedia(REDUCED_MOTION);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
};
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

export function HeroWhisperChain() {
    // The chain starts on its own once, then plays again whenever the visitor asks.
    const [current, setCurrent] = useState(0);
    const [playing, setPlaying] = useState(false);
    const canAnimate = useRef(false);
    const figureRefs = useRef<(SVGSVGElement | null)[]>([]);
    const bubbleRef = useRef<HTMLDivElement>(null);
    const reduceMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);

    // With reduced motion the finished chain is shown at rest; Pass it along still plays it.
    const step = reduceMotion && !playing ? LAST : current;

    useEffect(() => {
        if (reduceMotion) return;
        const t = window.setTimeout(() => {
            canAnimate.current = true;
            setPlaying(true);
        }, START_DELAY_MS);
        return () => window.clearTimeout(t);
    }, [reduceMotion]);

    useEffect(() => {
        if (!playing || current >= LAST) return;
        const t = window.setTimeout(() => setCurrent((s) => s + 1), STEP_MS);
        return () => window.clearTimeout(t);
    }, [playing, current]);

    // The person who just heard it hops, and so does the bubble.
    useEffect(() => {
        if (!canAnimate.current || reduceMotion) return;
        figureRefs.current[step]?.animate(
            [
                { transform: "none" },
                { transform: "translateY(-18px) scale(1.04, 0.97)", offset: 0.35 },
                { transform: "scale(1.07, 0.92)", offset: 0.7 },
                { transform: "none" },
            ],
            { duration: 600, easing: "cubic-bezier(.3,1.4,.5,1)" },
        );
        bubbleRef.current?.animate(
            [
                { transform: "none" },
                { transform: "translateY(-14px) rotate(-2deg)", offset: 0.4 },
                { transform: "none" },
            ],
            { duration: 600, easing: "cubic-bezier(.3,1.4,.5,1)" },
        );
    }, [step, reduceMotion]);

    const passItAlong = useCallback(() => {
        canAnimate.current = true;
        setCurrent(0);
        setPlaying(true);
    }, []);

    const done = step === LAST;
    const stageVars = { "--i": step, "--a": step / LAST } as CSSProperties;

    return (
        <section
            aria-labelledby="home-hero-title"
            className={cn(styles.root, "relative flex w-full justify-center bg-theme-beige px-6 pb-8 pt-32 md:px-12 lg:px-24")}
        >
            <div className={styles.box}>
                <div className={styles.text}>
                    <h1 id="home-hero-title" className={styles.headline}>
                        <span className={styles.k}>
                            Word of Mouth
                            <br />
                            for Businesses
                        </span>
                        <span className={styles.h}>Powered by Creators</span>
                    </h1>

                    <p className={styles.sub}>
                        The telephone game, except the message gets better with every person. One creator visit starts the chain.
                    </p>

                    <div className={styles.cta}>
                        <Link href="/business" className={cn(styles.btn, styles.btnYellow)}>
                            For Business
                            <ArrowUpRight className={styles.btnIcon} aria-hidden />
                        </Link>
                        <Link href="/app" className={cn(styles.btn, styles.btnGreen)}>
                            Get the app
                        </Link>
                    </div>
                </div>

                <div className={styles.card}>
                    <p className={styles.label}>Good news travels</p>

                    <div className={styles.row}>
                        <div className={styles.stage} style={stageVars} data-done={done}>
                            <div className={styles.bubble} style={{ "--bg": BUBBLE_BG[step] } as CSSProperties}>
                                <div ref={bubbleRef} className={styles.bubbleInner} aria-hidden>
                                    <span>{MESSAGES[step]}</span>
                                    <i className={styles.tail} />
                                </div>
                            </div>

                            {PEOPLE.map((person, i) => (
                                <button
                                    key={person.name}
                                    type="button"
                                    className={styles.fig}
                                    data-on={i <= step}
                                    style={{ "--c": person.color } as CSSProperties}
                                    onClick={passItAlong}
                                    aria-label={`${person.name}. Pass it along again`}
                                >
                                    <svg
                                        ref={(el) => {
                                            figureRefs.current[i] = el;
                                        }}
                                        viewBox="0 0 80 124"
                                        aria-hidden
                                    >
                                        <ellipse cx="40" cy="119" rx="26" ry="4" fill="rgba(0,0,0,.12)" />
                                        <path className={styles.body} d="M12 117V84a28 28 0 0 1 56 0v33z" />
                                        {i === 0 && (
                                            <>
                                                <rect x="50" y="76" width="15" height="24" rx="3" fill="#000" />
                                                <circle cx="57.5" cy="82" r="3" fill="#FECD36" />
                                            </>
                                        )}
                                        <circle className={styles.head} cx="40" cy="34" r="20" />
                                        <g className={styles.face}>
                                            <circle cx="33" cy="33" r="2.6" />
                                            <circle cx="47" cy="33" r="2.6" />
                                            <path d="M33 42q7 6 14 0" fill="none" stroke="#000" strokeWidth="2.6" strokeLinecap="round" />
                                        </g>
                                    </svg>
                                    <span className={styles.name}>{person.name}</span>
                                </button>
                            ))}

                            <span className={styles.stamp} aria-hidden>
                                Booked
                            </span>
                        </div>
                    </div>

                    <div className={styles.foot}>
                        <button type="button" className={styles.go} onClick={passItAlong}>
                            <Play className={styles.btnIcon} aria-hidden />
                            Pass it along
                        </button>
                        <p className={styles.note}>
                            {done
                                ? "That is word of mouth. SeekKrr starts it with one creator visit."
                                : `Passing it along… ${step + 1} of ${MESSAGES.length}`}
                        </p>
                    </div>

                    {/* The bubble is decorative to the eye; this announces what was said. */}
                    <p className="sr-only" aria-live="polite">
                        {MESSAGES[step]}
                    </p>
                </div>
            </div>
        </section>
    );
}
