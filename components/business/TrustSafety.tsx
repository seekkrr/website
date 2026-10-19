import { Ban, Hash, KeyRound, MapPinned, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/collabs/Reveal";
import { SectionHeading } from "@/components/collabs/SectionHeading";

const ITEMS: { icon: LucideIcon; title: string; body: string; tone: string }[] = [
  {
    icon: MapPinned,
    title: "Check-in verified visits",
    body: "A collab's details and Redeem button unlock only after a same-day check-in at your place, so every redemption is a real visit.",
    tone: "bg-white [box-shadow:6px_6px_0_var(--color-yellow-accent)]",
  },
  {
    icon: KeyRound,
    title: "Your staff, your code",
    body: "Set a 4-digit redeem code for each location and change it any time. Wrong guesses are rate-limited, and staff can scan a QR when the creator has no signal.",
    tone: "bg-theme-blue [box-shadow:6px_6px_0_var(--color-orange-accent)]",
  },
  {
    icon: Ban,
    title: "Report & block",
    body: "Block a creator in one tap and they can no longer see or request your collabs. Reports go to a moderation queue run by people, not bots.",
    tone: "bg-white [box-shadow:6px_6px_0_var(--color-blue-accent)]",
  },
  {
    icon: Hash,
    title: "Disclosure built in",
    body: "Every brief carries an #ad, #collab or #gifted label that creators tick off before posting, following ASCI influencer guidelines.",
    tone: "bg-theme-yellow [box-shadow:6px_6px_0_#000]",
  },
];

export function TrustSafety() {
  return (
    <section
      aria-labelledby="trust-title"
      className="relative w-full bg-theme-beige px-4 py-16 sm:px-6 md:px-12 lg:px-24 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1240px]">
        <SectionHeading
          id="trust-title"
          eyebrow="Built for real places and real people"
          title="Trust & safety"
        />
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, body, tone }, index) => (
            <Reveal key={title} as="li" delay={index * 0.1} lift className="h-full">
              <div className={`flex h-full flex-col gap-3 rounded-[24px] border-[3px] border-black p-6 xl:rounded-[32px] ${tone}`}>
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-black bg-theme-beige"
                >
                  <Icon className="h-6 w-6 text-theme-green" />
                </span>
                <h3 className="font-jakarta text-[19px] font-bold leading-tight text-black">{title}</h3>
                <p className="text-[15px] leading-relaxed text-black/80">{body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
