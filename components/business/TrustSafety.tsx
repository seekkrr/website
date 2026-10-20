import { Ban, Hash, KeyRound, MapPinned, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/collabs/Reveal";
import { SectionHeading } from "@/components/collabs/SectionHeading";

const ITEMS: { icon: LucideIcon; title: string; body: string; tone: string }[] = [
  {
    icon: MapPinned,
    title: "Check-in verified visits",
    body: "UGC brief details unlock only after a same-day check-in at your place.",
    tone: "bg-white [box-shadow:5px_5px_0_var(--color-yellow-accent)]",
  },
  {
    icon: KeyRound,
    title: "Your staff, your code",
    body: "A 4-digit code per location, rate-limited, with a QR fallback.",
    tone: "bg-theme-blue [box-shadow:5px_5px_0_var(--color-orange-accent)]",
  },
  {
    icon: Ban,
    title: "Report & block",
    body: "Block a creator in one tap. Reports go to a human moderation team.",
    tone: "bg-white [box-shadow:5px_5px_0_var(--color-blue-accent)]",
  },
  {
    icon: Hash,
    title: "Disclosure built in",
    body: "Every brief carries #ad, #collab or #gifted, in line with ASCI guidelines.",
    tone: "bg-theme-yellow [box-shadow:5px_5px_0_#000]",
  },
];

export function TrustSafety() {
  return (
    <section
      aria-labelledby="trust-title"
      className="relative w-full bg-theme-beige px-4 py-10 sm:px-6 md:px-12 md:py-14 lg:px-24 lg:py-16"
    >
      <div className="mx-auto w-full max-w-[1240px]">
        <SectionHeading id="trust-title" eyebrow="Built for real places and real people" title="Trust & safety" />
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {ITEMS.map(({ icon: Icon, title, body, tone }, index) => (
            <Reveal key={title} as="li" delay={index * 0.08} lift className="h-full">
              <div className={`flex h-full items-start gap-3 rounded-[20px] border-[3px] border-black p-4 sm:flex-col sm:p-5 xl:rounded-[24px] ${tone}`}>
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[3px] border-black bg-theme-beige"
                >
                  <Icon className="h-5 w-5 text-theme-green" />
                </span>
                <div className="min-w-0">
                  <h3 className="font-jakarta text-[17px] font-bold leading-tight text-black">{title}</h3>
                  <p className="mt-1 text-[14px] leading-snug text-black/80">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
