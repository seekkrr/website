import type { ReactNode } from "react";
import { MapPinCheck, MessageSquareHeart, ScanLine, Camera, Star, Ticket, Unlock } from "lucide-react";
import { CollabTeaserCard } from "@/components/collabs/CollabCard";
import { Reveal } from "@/components/collabs/Reveal";
import { sanchez } from "@/components/places/fonts";
import { monthYear, plural } from "@/components/places/placeData";
import { formatDate, type PlaceReview, type PublicCollab } from "@/lib/collabs";
import { cn } from "@/lib/utils";

// ── Shared section title ──────────────────────────────────────────────────

export function SectionTitle({
  id,
  kicker,
  children,
  className,
  tone = "light",
}: {
  id: string;
  kicker?: string;
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("mb-5", className)}>
      {kicker && (
        <p
          className={cn(
            "font-handwriting text-[24px] leading-none sm:text-[26px]",
            tone === "dark" ? "text-theme-yellow" : "text-theme-orange"
          )}
        >
          {kicker}
        </p>
      )}
      <h2
        id={id}
        className={cn(
          "mt-1 font-jakarta text-[28px] font-extrabold leading-tight tracking-tight sm:text-[32px]",
          tone === "dark" ? "text-theme-beige" : "text-black"
        )}
      >
        {children}
      </h2>
    </div>
  );
}

// ── About ─────────────────────────────────────────────────────────────────

/** Business story, plus the place's own write-up when it adds something new. */
export function PlaceAbout({
  name,
  story,
  placeStory,
}: {
  name: string;
  story: string | null;
  placeStory: { title: string; text: string } | null;
}) {
  if (!story && !placeStory) return null;
  const lead = story ?? placeStory?.text ?? "";
  const extra = story ? placeStory : null;
  return (
    <Reveal y={20}>
      <section aria-labelledby="about-title">
        <SectionTitle id="about-title" kicker="the story">
          About {name}
        </SectionTitle>
        <p
          className={cn(
            "whitespace-pre-line text-[17px] leading-[1.75] text-black/80 sm:text-[18px]",
            lead.length > 160 &&
              "first-letter:float-left first-letter:mr-2.5 first-letter:mt-1 first-letter:font-jakarta first-letter:text-[64px] first-letter:font-extrabold first-letter:leading-[0.8] first-letter:text-theme-green"
          )}
        >
          {lead}
        </p>
        {extra && (
          <div className="mt-6 rounded-[24px] border-[3px] border-black bg-white p-5 sm:p-6">
            <h3 className="font-jakarta text-[13px] font-bold uppercase tracking-[0.14em] text-black/50">
              About {extra.title}
            </h3>
            <p className="mt-2 whitespace-pre-line text-[16px] leading-[1.75] text-black/80 sm:text-[17px]">
              {extra.text}
            </p>
          </div>
        )}
      </section>
    </Reveal>
  );
}

// ── Highlights (tags) ─────────────────────────────────────────────────────

const TAG_TONES = [
  "bg-theme-yellow",
  "bg-white",
  "bg-[#DDE3FF]",
  "bg-white",
  "bg-[#FFE1D6]",
  "bg-white",
];

export function PlaceHighlights({ tags }: { tags: string[] }) {
  if (tags.length === 0) return null;
  return (
    <Reveal y={20}>
      <section aria-labelledby="highlights-title">
        <SectionTitle id="highlights-title" kicker="known for">
          Highlights
        </SectionTitle>
        <ul className="flex flex-wrap gap-2.5">
          {tags.map((tag, i) => (
            <li
              key={tag}
              className={cn(
                sanchez.className,
                "rounded-full border-2 border-black px-4 py-2 text-[16px] leading-none text-black sm:text-[17px]",
                TAG_TONES[i % TAG_TONES.length]
              )}
            >
              <span aria-hidden="true" className="mr-0.5 text-black/45">
                #
              </span>
              {tag}
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}

// ── Collabs ───────────────────────────────────────────────────────────────

const COLLAB_STEPS = [
  { Icon: MapPinCheck, text: "Check in at the place" },
  { Icon: Unlock, text: "See the full brief" },
  { Icon: Ticket, text: "Redeem in the app" },
];

export function PlaceCollabs({ name, collabs }: { name: string; collabs: PublicCollab[] }) {
  if (collabs.length === 0) return null;
  return (
    <Reveal y={20}>
      <section
        aria-labelledby="collabs-title"
        className="relative overflow-hidden rounded-[24px] border-[3px] border-black bg-theme-green p-5 text-theme-beige [box-shadow:6px_6px_0_var(--color-yellow-accent)] sm:p-7 xl:rounded-[32px]"
      >
        <SectionTitle id="collabs-title" kicker="for creators" tone="dark" className="mb-2">
          Open for collabs
        </SectionTitle>
        <p className="max-w-[560px] text-[15px] leading-relaxed text-[rgba(255,255,243,0.8)] sm:text-[16px]">
          Make content at {name} and get something back. Check in at the place in the SeekKrr app to see what they
          want and redeem your collab right there.
        </p>
        <ol className="mt-4 flex flex-wrap gap-2" aria-label="How it works">
          {COLLAB_STEPS.map(({ Icon, text }, i) => (
            <li
              key={text}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[rgba(255,255,243,0.4)] px-3 py-1.5 font-jakarta text-[13px] font-bold text-theme-beige"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-theme-yellow text-[11px] font-extrabold text-black">
                {i + 1}
              </span>
              <Icon className="h-4 w-4" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ol>
        <ul className={cn("mt-6 grid grid-cols-1 gap-4 sm:gap-5", collabs.length > 1 && "sm:grid-cols-2")}>
          {collabs.map((c) => (
            <li key={c.id} className="text-black">
              <CollabTeaserCard
                offer={c.offer}
                mode={c.mode}
                allowAdvanceRequests={c.allow_advance_requests}
                slotsLeft={c.slots_left}
                validUntil={formatDate(c.valid_until)}
                className="[box-shadow:5px_5px_0_var(--color-yellow-accent)]"
              />
            </li>
          ))}
        </ul>
      </section>
    </Reveal>
  );
}

// ── Reviews ───────────────────────────────────────────────────────────────

function Stars({
  value,
  size = "h-4 w-4",
  filled = "fill-theme-yellow text-black",
  empty = "fill-transparent text-black/25",
}: {
  value: number;
  size?: string;
  filled?: string;
  empty?: string;
}) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={cn(size, i < Math.round(value) ? filled : empty)} strokeWidth={2} />
      ))}
    </span>
  );
}

export function PlaceReviews({
  reviews,
  rating,
  reviewCount,
}: {
  reviews: PlaceReview[];
  rating: number | null;
  reviewCount: number;
}) {
  if (reviews.length === 0) return null;
  return (
    <Reveal y={20}>
      <section aria-labelledby="reviews-title">
        <SectionTitle id="reviews-title" kicker="from the community">
          What travellers say
        </SectionTitle>
        <div className="flex flex-col gap-5">
          {rating !== null && reviewCount > 0 && (
            <div className="flex items-center gap-4 rounded-[24px] border-[3px] border-black bg-theme-yellow px-5 py-4 [box-shadow:5px_5px_0_#000] sm:gap-6 sm:px-7">
              <p className="font-jakarta text-[56px] font-extrabold leading-none tracking-tight text-black sm:text-[68px]">
                {rating.toFixed(1)}
                <span className="sr-only"> out of 5 stars</span>
              </p>
              <div>
                <Stars value={rating} size="h-5 w-5" filled="fill-black text-black" empty="fill-transparent text-black/40" />
                <p className="mt-1 font-jakarta text-[14px] font-bold text-black/70">
                  {plural(reviewCount, "review")} on SeekKrr
                </p>
              </div>
            </div>
          )}
          <ul className={cn("grid grid-cols-1 gap-4", reviews.length > 1 && "md:grid-cols-2")}>
            {reviews.map((review, i) => {
              const date = monthYear(review.created_at);
              const short = review.comment.length <= 90;
              return (
                <li
                  key={`${review.created_at ?? i}-${i}`}
                  className={cn(
                    "relative flex flex-col gap-4 rounded-[24px] border-[3px] border-black bg-white p-5 sm:p-6",
                    reviews.length === 3 && i === 2 && "md:col-span-2"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-1 font-jakarta text-[72px] font-extrabold leading-none text-theme-yellow"
                  >
                    &rdquo;
                  </span>
                  <Stars value={review.rating} />
                  <span className="sr-only">Rated {review.rating} out of 5.</span>
                  <blockquote
                    className={cn(
                      "break-words pr-6 font-jakarta font-bold text-black",
                      short ? "text-[22px] sm:text-[24px]" : "text-[16px] sm:text-[17px]",
                      "leading-snug"
                    )}
                  >
                    &ldquo;{review.comment}&rdquo;
                  </blockquote>
                  <p className="mt-auto flex items-center gap-2.5 text-[14px] text-black/60">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-theme-blue font-jakarta text-[13px] font-extrabold text-white"
                    >
                      {(review.author ?? "T").trim().charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block truncate font-jakarta font-bold text-black">
                        {review.author ?? "SeekKrr traveller"}
                      </span>
                      {date && <span className="block text-[13px]">{date}</span>}
                    </span>
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </Reveal>
  );
}

// ── Empty story (a place with almost nothing to show yet) ─────────────────

const FIRST_STEPS = [
  { Icon: ScanLine, title: "Check in", text: "Open SeekKrr when you get there." },
  { Icon: MessageSquareHeart, title: "Leave a review", text: "Tell other travellers what to expect." },
  { Icon: Camera, title: "Share photos", text: "Your shots help the next visitor." },
];

export function PlaceFirstVisit({ name }: { name: string }) {
  return (
    <Reveal y={20}>
      <section
        aria-labelledby="first-visit-title"
        className="rounded-[24px] border-[3px] border-dashed border-black bg-white p-5 sm:p-7 xl:rounded-[32px]"
      >
        <SectionTitle id="first-visit-title" kicker="fresh on SeekKrr" className="mb-2">
          Be one of the first to explore {name}
        </SectionTitle>
        <p className="max-w-[560px] text-[15px] leading-relaxed text-black/70 sm:text-[16px]">
          This page is just getting started. Photos, reviews and check-ins from travellers will show up here.
        </p>
        <ol className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {FIRST_STEPS.map(({ Icon, title, text }, i) => (
            <li key={title} className="flex items-start gap-3 rounded-[18px] bg-theme-beige p-4 sm:flex-col">
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black",
                  ["bg-theme-yellow", "bg-theme-blue text-white", "bg-theme-orange text-white"][i]
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-jakarta text-[16px] font-extrabold text-black">{title}</span>
                <span className="block text-[14px] leading-snug text-black/65">{text}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </Reveal>
  );
}
