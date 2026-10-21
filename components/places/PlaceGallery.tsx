"use client";

import { useCallback, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Expand, LayoutGrid } from "lucide-react";
import { SafeImage } from "@/components/collabs/SafeImage";
import { PhotoLightbox } from "@/components/places/PhotoLightbox";
import { cn } from "@/lib/utils";

interface PlaceGalleryProps {
  photos: string[];
  name: string;
}

// Same `sizes` for the desktop cover and the first phone slide, so the browser
// picks the same candidate for both and downloads the hero image only once.
const COVER_SIZES = "(max-width: 767px) 100vw, (max-width: 1280px) 60vw, 720px";

/** Grid placement for each tile of the desktop mosaic, by photo count. */
function mosaicLayout(count: number): { grid: string; tiles: string[] } {
  switch (count) {
    case 1:
      return { grid: "grid-cols-1 grid-rows-1", tiles: [""] };
    case 2:
      return { grid: "grid-cols-3 grid-rows-1", tiles: ["col-span-2", ""] };
    case 3:
      return { grid: "grid-cols-3 grid-rows-2", tiles: ["col-span-2 row-span-2", "", ""] };
    case 4:
      return { grid: "grid-cols-4 grid-rows-2", tiles: ["col-span-2 row-span-2", "col-span-2", "", ""] };
    default:
      return { grid: "grid-cols-4 grid-rows-2", tiles: ["col-span-2 row-span-2", "", "", "", ""] };
  }
}

/**
 * The hero: a photo mosaic on desktop and a swipeable snap carousel on
 * phones; any photo (or "Show all") opens the full-screen lightbox.
 */
export function PlaceGallery({ photos, name }: PlaceGalleryProps) {
  const [open, setOpen] = useState<number | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const openAt = (index: number, el: HTMLElement) => {
    trigger.current = el;
    setOpen(index);
  };

  const close = useCallback(() => {
    setOpen(null);
    // Return focus to whatever opened the viewer.
    requestAnimationFrame(() => trigger.current?.focus());
  }, []);

  if (photos.length === 0) return null;

  return (
    <>
      <DesktopMosaic photos={photos} name={name} onOpen={openAt} />
      <PhoneCarousel photos={photos} name={name} onOpen={openAt} />
      {open !== null && (
        <PhotoLightbox photos={photos} name={name} index={open} onIndexChange={setOpen} onClose={close} />
      )}
    </>
  );
}

interface ViewProps {
  photos: string[];
  name: string;
  onOpen: (index: number, el: HTMLElement) => void;
}

function DesktopMosaic({ photos, name, onOpen }: ViewProps) {
  const visible = photos.slice(0, 5);
  const { grid, tiles } = mosaicLayout(visible.length);
  return (
    <div
      className={cn(
        "relative hidden h-[400px] gap-[3px] overflow-hidden rounded-[32px] border-[3px] border-black bg-black [box-shadow:8px_8px_0_var(--color-yellow-accent)] md:grid lg:h-[460px] xl:h-[520px]",
        grid
      )}
    >
      {visible.map((src, i) => (
        <button
          key={src}
          type="button"
          onClick={(e) => onOpen(i, e.currentTarget)}
          className={cn(
            "group relative overflow-hidden bg-theme-green focus-visible:z-10 focus-visible:outline-none focus-visible:ring-[4px] focus-visible:ring-inset focus-visible:ring-theme-yellow",
            tiles[i]
          )}
        >
          <SafeImage
            src={src}
            alt={`Photo ${i + 1} of ${name}`}
            sizes={i === 0 ? COVER_SIZES : "(max-width: 1280px) 25vw, 320px"}
            priority={i === 0}
            className="transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"
          />
          <span className="sr-only">, open the photo viewer</span>
        </button>
      ))}

      <button
        type="button"
        onClick={(e) => onOpen(0, e.currentTarget)}
        className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-full border-2 border-black bg-black px-4 py-2.5 font-jakarta text-[14px] font-bold text-white [box-shadow:3px_3px_0_var(--color-yellow-accent)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:bottom-5 lg:right-5"
      >
        {photos.length > 1 ? (
          <>
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            Show all {photos.length} photos
          </>
        ) : (
          <>
            <Expand className="h-4 w-4" aria-hidden="true" />
            View photo
          </>
        )}
      </button>
    </div>
  );
}

function PhoneCarousel({ photos, name, onOpen }: ViewProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const count = photos.length;

  const onScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const next = Math.round(track.scrollLeft / track.clientWidth);
    if (next !== index) setIndex(Math.max(0, Math.min(count - 1, next)));
  };

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: i * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`Photos of ${name}`}
      className="relative overflow-hidden rounded-[24px] border-[3px] border-black bg-black [box-shadow:6px_6px_0_var(--color-yellow-accent)] md:hidden"
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        data-lenis-prevent
        className="no-scrollbar flex aspect-[4/3] snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {photos.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={(e) => onOpen(i, e.currentTarget)}
            aria-roledescription="slide"
            className="relative h-full w-full shrink-0 snap-center snap-always bg-theme-green focus-visible:outline-none focus-visible:ring-[4px] focus-visible:ring-inset focus-visible:ring-theme-yellow"
          >
            <SafeImage
              src={src}
              alt={`Photo ${i + 1} of ${name}`}
              sizes={i === 0 ? COVER_SIZES : "100vw"}
              priority={i === 0}
            />
            <span className="sr-only">, open the photo viewer</span>
          </button>
        ))}
      </div>

      {count > 1 && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-3 rounded-full border-2 border-black bg-white px-2.5 py-1 font-jakarta text-[12px] font-extrabold tabular-nums text-black"
          >
            {index + 1} / {count}
          </span>
          <div className="absolute bottom-3 left-1/2 flex max-w-[calc(100%-24px)] -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-2 backdrop-blur-sm">
            {photos.map((src, i) => (
              <button
                key={`dot-${src}`}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to photo ${i + 1} of ${count}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-theme-yellow motion-reduce:transition-none",
                  i === index ? "w-5 bg-theme-yellow" : "w-2 bg-white/70"
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
