"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Phones only: a bottom CTA bar that shows once the hero (#business-hero) has
 * scrolled away, and hides again as the final CTA strip or the footer comes
 * into view, so it never sits over the page's own closing call to action.
 */
export function StickyBusinessCta() {
  const reduceMotion = useReducedMotion();
  const [pastHero, setPastHero] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("business-hero");
    const stops = Array.from(document.querySelectorAll("[data-sticky-cta-stop], footer"));
    if (!hero) return;

    const heroObserver = new IntersectionObserver(([entry]) => {
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    heroObserver.observe(hero);

    const visible = new Set<Element>();
    const stopObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setNearEnd(visible.size > 0);
      },
      // Start hiding a little before the stop reaches the bar.
      { rootMargin: "0px 0px 96px 0px" }
    );
    stops.forEach((el) => stopObserver.observe(el));

    return () => {
      heroObserver.disconnect();
      stopObserver.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {pastHero && !nearEnd && (
        <motion.div
          key="sticky-cta"
          initial={reduceMotion ? { opacity: 0 } : { y: "130%" }}
          animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "130%" }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),12px)] md:hidden"
        >
          <Link
            href="/business/apply"
            className="pointer-events-auto flex min-h-[52px] items-center justify-between gap-3 rounded-full border-[3px] border-black bg-black py-2 pl-5 pr-2 text-white shadow-[4px_4px_0_0_var(--color-yellow-accent)] active:scale-[0.98] motion-reduce:active:scale-100"
          >
            <span className="font-jakarta text-[16px] font-bold">List your business</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-theme-yellow px-3 py-1.5 font-jakarta text-[13px] font-extrabold text-black">
              ₹0 to start
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
