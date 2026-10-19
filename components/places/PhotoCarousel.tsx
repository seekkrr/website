"use client";

import { useId, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SafeImage } from "@/components/collabs/SafeImage";
import { cn } from "@/lib/utils";

interface PhotoCarouselProps {
  photos: string[];
  name: string;
}

/** Scroll-snap photo carousel with prev/next controls and slide dots. */
export function PhotoCarousel({ photos, name }: PhotoCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const id = useId();
  const count = photos.length;

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(count - 1, i));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const next = Math.round(track.scrollLeft / track.clientWidth);
    if (next !== index) setIndex(next);
  };

  if (count === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`Photos of ${name}`}
      className="relative overflow-hidden rounded-[24px] border-[3px] border-black bg-theme-yellow [box-shadow:8px_8px_0_var(--color-yellow-accent)] xl:rounded-[32px]"
    >
      <div
        ref={trackRef}
        id={`${id}-track`}
        data-lenis-prevent
        tabIndex={0}
        role="group"
        aria-label="Photo strip, scroll sideways"
        onScroll={onScroll}
        className="no-scrollbar flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto overscroll-x-contain focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-theme-blue sm:aspect-[16/9]"
      >
        {photos.map((src, i) => (
          <div
            key={`${src}-${i}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className="relative h-full w-full shrink-0 snap-start"
          >
            <SafeImage
              src={src}
              alt={i === 0 ? name : `${name}, photo ${i + 1}`}
              sizes="(max-width: 1024px) 100vw, 760px"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => scrollTo(index - 1)}
            disabled={index === 0}
            aria-controls={`${id}-track`}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-black bg-white transition-opacity disabled:opacity-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollTo(index + 1)}
            disabled={index === count - 1}
            aria-controls={`${id}-track`}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-black bg-white transition-opacity disabled:opacity-0 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full border-2 border-black bg-white/90 px-2.5 py-1.5">
            {photos.map((src, i) => (
              <button
                key={`${src}-dot-${i}`}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "h-2.5 rounded-full transition-all motion-reduce:transition-none",
                  i === index ? "w-6 bg-black" : "w-2.5 bg-black/30 hover:bg-black/60"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
