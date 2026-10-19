import {
  Activity,
  BadgeCheck,
  Compass,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/collabs/Reveal";
import { SectionHeading } from "@/components/collabs/SectionHeading";

const SIGNALS: { icon: LucideIcon; label: string; body: string }[] = [
  {
    icon: Compass,
    label: "Themes",
    body: "What they create (food, adventure, culture) against what your place is about.",
  },
  {
    icon: MapPin,
    label: "Local presence",
    body: "Recent check-ins near you, with a boost if they're in town right now.",
  },
  {
    icon: BadgeCheck,
    label: "Content fit",
    body: "Platforms they've proven they own, against your brief (reels, reviews, videos).",
  },
  {
    icon: Star,
    label: "Quality",
    body: "Ratings from other businesses and a verified audience size.",
  },
  {
    icon: ShieldCheck,
    label: "Reliability",
    body: "How often they post after redeeming. New creators start neutral, not last.",
  },
  {
    icon: Activity,
    label: "Activity",
    body: "Whether they've been active on SeekKrr lately.",
  },
  {
    icon: Users,
    label: "Peer signal",
    body: "Businesses like yours rated them well.",
  },
];

const REASONS = ["In Bir this week", "Café & food content", "Posted for 9 of 10 collabs"];

export function MatchExplainer() {
  return (
    <section
      aria-labelledby="match-title"
      className="relative w-full bg-theme-beige px-4 py-16 sm:px-6 md:px-12 lg:px-24 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1240px]">
        <SectionHeading
          id="match-title"
          eyebrow="Find the right creators with"
          title="SeekKrr Match"
          intro="We rank creators who have opted in to collabs using signals you can read, not a mystery score. Every match shows its top three reasons."
        />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <Reveal className="mx-auto w-full max-w-[420px]">
            <article
              aria-label="Example creator match"
              className="relative rounded-[24px] border-[3px] border-black bg-white p-6 [box-shadow:8px_8px_0_var(--color-blue-accent)] xl:rounded-[32px]"
            >
              <div className="flex items-start gap-4">
                <div
                  aria-hidden="true"
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] border-black bg-theme-orange font-jakarta text-[22px] font-extrabold text-white"
                >
                  AK
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 font-jakarta text-[18px] font-bold text-black">
                    Aanya K.
                    <BadgeCheck className="h-5 w-5 fill-theme-blue text-white" aria-hidden="true" />
                    <span className="sr-only">(verified creator)</span>
                  </p>
                  <p className="text-[14px] text-black/65">Travel &amp; food creator · Delhi</p>
                  <p className="mt-1 text-[13px] font-medium text-black/60">
                    Instagram (verified) · YouTube
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-center rounded-2xl border-[3px] border-black bg-theme-yellow px-3 py-2 text-center">
                  <span className="font-jakarta text-[24px] font-extrabold leading-none">87%</span>
                  <span className="font-jakarta text-[11px] font-bold uppercase tracking-wide">match</span>
                </div>
              </div>

              <p className="mb-2 mt-6 font-jakarta text-[12px] font-bold uppercase tracking-[0.12em] text-black/50">
                Why this match
              </p>
              <ul className="flex flex-wrap gap-2">
                {REASONS.map((reason) => (
                  <li key={reason}>
                    <Badge variant="green" size="md">
                      {reason}
                    </Badge>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between gap-3 border-t-2 border-dashed border-black/20 pt-4">
                <p className="text-[13px] text-black/60">Example profile for illustration</p>
                <span
                  aria-hidden="true"
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-black px-4 py-1.5 font-jakarta text-[13px] font-bold text-white"
                >
                  <Heart className="h-3.5 w-3.5" /> Invite
                </span>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <ol className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              {SIGNALS.map(({ icon: Icon, label, body }) => (
                <li key={label} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white"
                  >
                    <Icon className="h-5 w-5 text-theme-green" />
                  </span>
                  <div>
                    <h3 className="font-jakarta text-[16px] font-bold text-black">{label}</h3>
                    <p className="text-[15px] leading-snug text-black/70">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 rounded-2xl border-2 border-black bg-theme-yellow/50 px-5 py-4 text-[15px] leading-relaxed text-black/85">
              <strong className="font-jakarta">You stay in charge.</strong> Creators only appear if
              they&apos;ve opted in, their contact details stay hidden until they agree, and you choose
              who to invite. Free plans see the top 3 matches each month; Growth and Pro reveal more.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
