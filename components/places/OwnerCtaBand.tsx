import Link from "next/link";
import { ArrowRight, Camera, MapPinCheck, Sparkles, Star } from "lucide-react";
import { Reveal } from "@/components/collabs/Reveal";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const FEATURES = [
  { Icon: Camera, label: "Photo gallery", tone: "bg-white", rotate: "-rotate-2" },
  { Icon: Star, label: "Traveller reviews", tone: "bg-theme-blue text-white", rotate: "rotate-1" },
  { Icon: MapPinCheck, label: "Check-ins on the map", tone: "bg-theme-green text-theme-beige", rotate: "-rotate-1" },
  { Icon: Sparkles, label: "Creators who post about you", tone: "bg-theme-orange text-white", rotate: "rotate-2" },
];

/** A miniature business page, so owners can picture their own. */
function PagePreview() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[420px]">
      <div className="rotate-[2deg] overflow-hidden rounded-[24px] border-[3px] border-black bg-theme-beige [box-shadow:10px_10px_0_#000]">
        <div className="flex items-center gap-2 border-b-[3px] border-black bg-white px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-theme-orange" />
          <span className="h-2.5 w-2.5 rounded-full bg-theme-yellow" />
          <span className="h-2.5 w-2.5 rounded-full bg-theme-blue" />
          <span className="ml-2 truncate rounded-full bg-black/5 px-3 py-0.5 font-mono text-[11px] text-black/60">
            seekkrr.com/places/your-place
          </span>
        </div>
        <div className="grid h-[150px] grid-cols-3 grid-rows-2 gap-[3px] bg-black sm:h-[170px]">
          <div className="relative col-span-2 row-span-2 overflow-hidden bg-theme-green">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice">
              <circle cx="150" cy="34" r="16" fill="#FECD36" />
              <path d="M0 120 L 55 52 L 92 92 L 128 60 L 200 120 Z" fill="#FFFFF3" opacity="0.9" />
              <path d="M0 120 L 40 86 L 80 120 Z" fill="#8398FF" />
            </svg>
          </div>
          <div className="bg-theme-yellow" />
          <div className="bg-theme-blue" />
        </div>
        <div className="space-y-2.5 p-4">
          <div className="flex items-center gap-2">
            <span className="h-5 w-16 rounded-full border-2 border-black bg-theme-yellow" />
            <span className="h-5 w-24 rounded-full bg-theme-green" />
          </div>
          <p className="font-jakarta text-[24px] font-extrabold leading-none text-theme-green [text-shadow:2px_2px_0_var(--color-yellow-accent)]">
            Your place
          </p>
          <div className="flex gap-2">
            <span className="h-7 w-20 rounded-full border-2 border-black bg-white" />
            <span className="h-7 w-24 rounded-full border-2 border-black bg-white" />
            <span className="h-7 w-14 rounded-full border-2 border-black bg-white" />
          </div>
          <span className="block h-2 w-full rounded-full bg-black/10" />
          <span className="block h-2 w-4/5 rounded-full bg-black/10" />
        </div>
      </div>
      <p className="absolute -left-2 -top-9 -rotate-6 font-handwriting text-[28px] leading-none text-black sm:-left-8 sm:text-[32px]">
        this could be yours!
      </p>
    </div>
  );
}

/** The sales hook: every business page doubles as a demo for the next owner. */
export function OwnerCtaBand() {
  return (
    // data-sticky-cta-stop: the phone bottom bar steps aside while this band is on screen.
    <section
      data-sticky-cta-stop
      aria-labelledby="owner-cta-title"
      className="relative mt-16 overflow-hidden border-y-[3px] border-black bg-theme-yellow px-4 sm:mt-24 sm:px-6 md:px-10 xl:px-24"
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full text-black/[0.06]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={`M-40 ${60 + i * 60} C 260 ${-20 + i * 60}, 520 ${160 + i * 60}, 820 ${50 + i * 60} S 1140 ${10 + i * 60}, 1260 ${80 + i * 60}`} />
        ))}
      </svg>
      <div className="relative mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-14 py-14 md:py-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        <Reveal y={24}>
          <p className="font-handwriting text-[28px] leading-none text-black sm:text-[32px]">For owners</p>
          <h2
            id="owner-cta-title"
            className="mt-2 font-jakarta text-[36px] font-extrabold leading-[1.05] tracking-tight text-black text-balance sm:text-[48px] lg:text-[56px]"
          >
            Own a café, stay or experience?
          </h2>
          <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-black/80 sm:text-[19px]">
            Get a page like this on SeekKrr — photos, reviews, check-ins and creators who make content for you.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2.5" aria-label="What your page includes">
            {FEATURES.map(({ Icon, label, tone, rotate }) => (
              <li
                key={label}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border-2 border-black px-3.5 py-2 font-jakarta text-[14px] font-bold shadow-[2px_2px_0_#000]",
                  tone,
                  rotate
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Link href="/business/apply" className={cn(buttonVariants({ variant: "primary", size: "lg" }), "shadow-[4px_4px_0_#fff]")}>
              List your business
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              href="/business"
              className="rounded-sm font-jakarta text-[16px] font-bold text-black underline decoration-2 underline-offset-4 hover:decoration-white focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
            >
              See how it works
            </Link>
          </div>
        </Reveal>
        <Reveal y={24} delay={0.1} className="pt-6 lg:pt-0">
          <PagePreview />
        </Reveal>
      </div>
    </section>
  );
}
