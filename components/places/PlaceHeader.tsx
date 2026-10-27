import Link from "next/link";
import { Camera, ChevronRight, MapPin, Sparkles, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VerifiedTick } from "@/components/collabs/BusinessCard";
import { cn } from "@/lib/utils";

export function PlaceBreadcrumb({ name }: { name: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-5">
      <ol className="flex min-w-0 items-center gap-1 text-[14px] font-medium text-black/60">
        <li className="shrink-0">
          <Link
            href="/places"
            className="rounded-sm underline-offset-4 hover:text-black hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
          >
            Places
          </Link>
        </li>
        <li aria-hidden="true" className="shrink-0">
          <ChevronRight className="h-4 w-4" />
        </li>
        <li aria-current="page" className="min-w-0 truncate font-semibold text-black">
          {name}
        </li>
      </ol>
    </nav>
  );
}

interface IdentityProps {
  name: string;
  tagline: string | null;
  region: string | null;
  categories: string[];
  openForCollabs: boolean;
  verified: boolean;
  /** "light" on the cream page; "dark" inside the green no-photo hero. */
  tone?: "light" | "dark";
}

/** Chips, the big name (+ verified tick) and the handwritten tagline. */
export function PlaceIdentity({
  name,
  tagline,
  region,
  categories,
  openForCollabs,
  verified,
  tone = "light",
}: IdentityProps) {
  const dark = tone === "dark";
  const cut = name.trimEnd().lastIndexOf(" ");
  const head = cut > 0 ? name.slice(0, cut + 1) : "";
  const last = cut > 0 ? name.slice(cut + 1).trimEnd() : name;
  const hasChips = !!region || openForCollabs || categories.length > 0;
  return (
    <header className="flex flex-col gap-3">
      {hasChips && (
        <ul className="flex flex-wrap items-center gap-2" aria-label="About this place">
          {region && (
            <li>
              <Badge variant="yellow" size="lg" className="shadow-[2px_2px_0_#000]">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {region}
              </Badge>
            </li>
          )}
          {openForCollabs && (
            <li>
              <Badge
                variant="green"
                size="lg"
                className={dark ? "border-theme-beige bg-theme-beige text-theme-green" : undefined}
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Open for collabs
              </Badge>
            </li>
          )}
          {categories.map((c) => (
            <li key={c}>
              <Badge
                variant="outline"
                size="lg"
                className={dark ? "border-[rgba(255,255,243,0.7)] bg-transparent text-theme-beige" : undefined}
              >
                {c}
              </Badge>
            </li>
          ))}
        </ul>
      )}
      <h1
        className={cn(
          "font-jakarta font-extrabold tracking-tight [overflow-wrap:anywhere]",
          // Line-height after the font sizes: tailwind-merge drops a leading-* that precedes a text-[size].
          dark
            ? "text-[42px] text-theme-beige [text-shadow:4px_4px_0_var(--color-yellow-accent)] sm:text-[60px] lg:text-[76px]"
            : "text-[34px] text-theme-green [text-shadow:3px_3px_0_var(--color-yellow-accent)] sm:text-[50px] lg:text-[58px]",
          "leading-[1.05]"
        )}
      >
        {verified ? (
          <>
            {head}
            {/* Keep the tick on the same line as the last word. */}
            <span className={last.length <= 14 ? "whitespace-nowrap" : undefined}>
              {last}
              <span className="ml-2 inline-block align-[0.12em]" title="Verified by SeekKrr">
                <VerifiedTick
                  className={cn(
                    "[&_svg]:h-7 [&_svg]:w-7 sm:[&_svg]:h-9 sm:[&_svg]:w-9",
                    dark && "[&_svg]:fill-theme-yellow [&_svg]:text-theme-green"
                  )}
                />
              </span>
            </span>
          </>
        ) : (
          name
        )}
      </h1>
      {tagline && (
        <p
          className={cn(
            "font-handwriting text-[28px] sm:text-[36px]",
            "leading-[1.1]",
            dark ? "text-theme-yellow" : "text-black"
          )}
        >
          {tagline}
        </p>
      )}
    </header>
  );
}

/**
 * The hero when a place has no photos yet: a designed green panel that
 * carries the identity, a large category glyph and a quiet "Photos coming soon".
 */
export function PlaceHeroFallback({ Icon, children }: { Icon: LucideIcon; children: React.ReactNode }) {
  return (
    <section
      aria-label="Place overview"
      className="relative isolate overflow-hidden rounded-[24px] border-[3px] border-black bg-theme-green px-5 pb-16 pt-8 [box-shadow:6px_6px_0_var(--color-yellow-accent)] sm:px-10 sm:pb-20 sm:pt-12 md:rounded-[32px] md:[box-shadow:8px_8px_0_var(--color-yellow-accent)] lg:flex lg:min-h-[400px] lg:flex-col lg:justify-center lg:px-14 lg:pb-20 lg:pt-14"
    >
      {/* Contour-line pattern */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 h-full w-full text-[rgba(255,255,243,0.07)]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 400"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {Array.from({ length: 9 }, (_, i) => (
          <path
            key={i}
            d={`M-40 ${70 + i * 42} C 120 ${20 + i * 42}, 260 ${150 + i * 40}, 420 ${80 + i * 42} S 700 ${10 + i * 44}, 860 ${90 + i * 40}`}
          />
        ))}
      </svg>
      {/* Big category glyph */}
      <div
        aria-hidden="true"
        className="absolute -bottom-10 -right-8 -z-10 flex h-[220px] w-[220px] rotate-[-10deg] items-center justify-center rounded-[48px] border-[3px] border-[rgba(255,255,243,0.25)] sm:h-[300px] sm:w-[300px] lg:-bottom-6 lg:right-10 lg:h-[340px] lg:w-[340px]"
      >
        <Icon className="h-[60%] w-[60%] text-[rgba(254,205,54,0.25)]" strokeWidth={1.25} />
      </div>
      <div className="relative max-w-[820px]">{children}</div>
      <p className="absolute bottom-4 left-5 inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,243,0.3)] px-3 py-1.5 font-jakarta text-[12px] font-semibold text-[rgba(255,255,243,0.75)] sm:bottom-6 sm:left-10 lg:left-14">
        <Camera className="h-3.5 w-3.5" aria-hidden="true" />
        Photos coming soon
      </p>
    </section>
  );
}
