import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const WORDS = ["Cafés", "Homestays", "Hostels", "Paragliding", "Treks", "Workshops", "Local food", "Experiences"];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {WORDS.map((word, i) => (
        <li key={word} className="flex items-center">
          <span
            className={cn(
              "whitespace-nowrap px-4 font-jakarta text-[18px] font-extrabold uppercase tracking-tight sm:px-6 sm:text-[22px]",
              i % 2 === 0 ? "text-theme-yellow" : "text-white"
            )}
          >
            {word}
          </span>
          <Sparkles className="h-4 w-4 shrink-0 text-theme-blue sm:h-5 sm:w-5" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Scrolling band of the kinds of places on SeekKrr. Pure CSS: pauses on hover,
 * and stays still when the visitor prefers reduced motion.
 */
export function CategoryMarquee() {
  return (
    <section aria-label="Kinds of places on SeekKrr for Business" className="relative w-full overflow-x-clip bg-theme-beige py-3">
      {/* Slightly wider than the viewport so the tilted band's ends never show a gap. */}
      <div className="group relative -mx-[2%] w-[104%] -rotate-1 overflow-hidden border-y-[3px] border-black bg-black py-3 shadow-[0_6px_0_0_var(--color-yellow-accent)]">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
