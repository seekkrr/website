"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Navigation } from "lucide-react";
import { OpenInAppButton } from "@/components/collabs/OpenInAppButton";

interface PlaceMobileBarProps {
  name: string;
  deepLink: string | null;
  directions: string | null;
  /** id of the hero element; the bar appears once it has scrolled away. */
  heroId: string;
}

/**
 * Phones only: "Open in SeekKrr" + "Directions" pinned to the bottom once the
 * hero has scrolled away; it steps aside for the owner CTA band and the footer.
 */
export function PlaceMobileBar({ name, deepLink, directions, heroId }: PlaceMobileBarProps) {
  const reduceMotion = useReducedMotion();
  const [pastHero, setPastHero] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
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
      { rootMargin: "0px 0px 96px 0px" }
    );
    document.querySelectorAll("[data-sticky-cta-stop], footer").forEach((el) => stopObserver.observe(el));

    return () => {
      heroObserver.disconnect();
      stopObserver.disconnect();
    };
  }, [heroId]);

  return (
    <AnimatePresence>
      {pastHero && !nearEnd && (
        <motion.div
          key="place-bar"
          initial={reduceMotion ? { opacity: 0 } : { y: "130%" }}
          animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "130%" }}
          transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(env(safe-area-inset-bottom),12px)] lg:hidden"
        >
          <div className="pointer-events-auto mx-auto flex max-w-[560px] items-center gap-2 rounded-full border-[3px] border-black bg-white p-1.5 shadow-[4px_4px_0_0_var(--color-yellow-accent)]">
            <OpenInAppButton
              deepLink={deepLink ?? "seekkrr://"}
              size="sm"
              className="min-h-[44px] flex-1 px-4 text-[15px]"
            >
              {deepLink ? "Open in SeekKrr" : "Get the app"}
            </OpenInAppButton>
            {directions && (
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-full border-2 border-black bg-theme-yellow px-4 font-jakarta text-[15px] font-bold text-black focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue active:scale-[0.98] motion-reduce:active:scale-100"
              >
                <Navigation className="h-4 w-4" aria-hidden="true" />
                Directions
                <span className="sr-only"> to {name} (opens in a new tab)</span>
              </a>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
