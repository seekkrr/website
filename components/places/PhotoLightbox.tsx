"use client";

import { useCallback, useEffect, useRef, type TouchEvent } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SafeImage } from "@/components/collabs/SafeImage";
import { cn } from "@/lib/utils";

interface PhotoLightboxProps {
  photos: string[];
  name: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const SWIPE_PX = 50;

/**
 * Full-screen photo viewer: arrows, swipe, ←/→ keys, Esc to close, a
 * thumbnail strip and a focus trap. Rendered into <body> so no transformed
 * ancestor can clip it; the page behind stops scrolling while it is open.
 */
export function PhotoLightbox({ photos, name, index, onIndexChange, onClose }: PhotoLightboxProps) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const count = photos.length;

  const go = useCallback(
    (delta: number) => onIndexChange((index + delta + count) % count),
    [count, index, onIndexChange]
  );

  // Lock page scroll and move focus into the dialog.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  // Keep the active thumbnail in view.
  useEffect(() => {
    const thumb = thumbsRef.current?.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
    thumb?.scrollIntoView({ block: "nearest", inline: "center", behavior: reduceMotion ? "auto" : "smooth" });
  }, [index, reduceMotion]);

  // Keyboard: Esc closes, arrows navigate, Tab stays inside the dialog.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowRight" && count > 1) {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" && count > 1) {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Tab") {
        const dialog = dialogRef.current;
        const focusable = dialog?.querySelectorAll<HTMLElement>("button:not([disabled]), [href]");
        if (!dialog || !focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;
        const inside = !!active && active !== dialog && dialog.contains(active);
        if (e.shiftKey && (active === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [count, go, onClose]);

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = t ? { x: t.clientX, y: t.clientY } : null;
  };

  const onTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current;
    const t = e.changedTouches[0];
    touchStart.current = null;
    if (!start || !t || count < 2) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  };

  const controlClass =
    "flex items-center justify-center rounded-full border-2 border-white/80 bg-black/60 text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-yellow";

  return createPortal(
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photos of ${name}`}
      tabIndex={-1}
      data-lenis-prevent
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex flex-col bg-[#0a0a0a] text-white outline-none"
    >
      <div className="flex items-center justify-between gap-4 px-4 pb-2 pt-[max(env(safe-area-inset-top),16px)] sm:px-6">
        <p className="min-w-0 truncate font-jakarta text-[15px] font-bold sm:text-[16px]">
          <span className="mr-3 inline-flex rounded-full bg-white px-3 py-1 font-jakarta text-[13px] font-extrabold tabular-nums text-black" aria-live="polite">
            {index + 1} / {count}
          </span>
          <span className="hidden sm:inline">{name}</span>
        </p>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close photo viewer" className={cn(controlClass, "h-11 w-11 shrink-0")}>
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 sm:px-20"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          key={photos[index]}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative h-full max-h-[calc(100dvh-180px)] w-full max-w-[1400px]"
        >
          <SafeImage src={photos[index]} alt={`Photo ${index + 1} of ${name}`} sizes="100vw" priority className="object-contain" />
        </motion.div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className={cn(controlClass, "absolute left-2 top-1/2 h-11 w-11 -translate-y-1/2 sm:left-5 sm:h-12 sm:w-12")}
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className={cn(controlClass, "absolute right-2 top-1/2 h-11 w-11 -translate-y-1/2 sm:right-5 sm:h-12 sm:w-12")}
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div
          ref={thumbsRef}
          className="no-scrollbar flex justify-start gap-2 overflow-x-auto px-4 pb-[max(env(safe-area-inset-bottom),16px)] pt-3 sm:justify-center sm:px-6"
        >
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              data-thumb={i}
              onClick={() => onIndexChange(i)}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === index ? "true" : undefined}
              className={cn(
                "relative h-14 w-20 shrink-0 overflow-hidden rounded-[10px] border-2 transition-opacity focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-yellow sm:h-16 sm:w-24",
                i === index ? "border-theme-yellow opacity-100" : "border-transparent opacity-50 hover:opacity-90"
              )}
            >
              <SafeImage src={src} alt="" sizes="96px" />
            </button>
          ))}
        </div>
      )}
    </motion.div>,
    document.body
  );
}
