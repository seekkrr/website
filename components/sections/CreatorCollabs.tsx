import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Camera, Hash, KeyRound, MapPin, Star, ToggleRight, type LucideIcon } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/collabs/Reveal";
import { StoreBadges } from "@/components/collabs/StoreBadges";
import { siteConfig, siteFeatures } from "@/lib/config/site";

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: MapPin,
    title: "Check in",
    body: "Spot an “Open for collabs” pin and check in when you arrive. The brief unlocks there.",
  },
  {
    icon: KeyRound,
    title: "Redeem with the staff code",
    body: "Open: staff type their 4-digit code on your phone. Approval: tap Avail and the business reviews and approves you to confirm the collab.",
  },
  siteFeatures.disclosureLabel
    ? {
        icon: Hash,
        title: "Post with disclosure",
        body: "Follow the brief, tag the place, add #ad, #collab or #gifted, then drop your links in My Collabs.",
      }
    : {
        icon: Camera,
        title: "Post your content",
        body: "Follow the brief, tag the place, then drop your links in My Collabs.",
      },
  {
    icon: Star,
    title: "Get rated",
    body: siteFeatures.matchmaking
      ? "Businesses rate you after each collab. Good ratings and on-time posts lift you in SeekKrr Match."
      : "Businesses rate you after each collab. Good ratings and on-time posts build your track record.",
  },
];

const SHADOWS = [
  "[box-shadow:6px_6px_0_#FECD36]",
  "[box-shadow:6px_6px_0_var(--color-blue-accent)]",
  "[box-shadow:6px_6px_0_var(--color-orange-accent)]",
  "[box-shadow:6px_6px_0_#FECD36]",
];

const FAQ = [
  {
    id: "followers",
    q: "Do I need a big following?",
    a: siteFeatures.matchmaking
      ? "No. Most collabs are open to every creator who has opted in. Some businesses ask for verified handles, and in SeekKrr Match your reliability and ratings count for more than follower numbers."
      : "No. Most collabs are open to every creator who has opted in. Some businesses ask for verified handles, and your reliability and ratings count for more than follower numbers.",
  },
  {
    id: "paid",
    q: "Are collabs paid?",
    a: "Collabs are exchanges: a stay, a meal or an experience for content. What you earn from quests works exactly as before.",
  },
  {
    id: "late",
    q: "What if I can't post in time?",
    a: "Every brief says how many days you have to post. If plans change, cancel from My Collabs before your visit. Missed deadlines count against your reliability.",
  },
  {
    id: "safety",
    q: "What if something feels off at a visit?",
    a: "Leave, then report the business from the app. Reports go to our moderation team, and you can block a business so it never shows up for you again. Your phone number is only shared if you choose to share it.",
  },
  {
    id: "where",
    q: "Where can I collab?",
    a: "We're starting in Bir, Himachal Pradesh, and opening more regions soon. Collab pins only appear on the map where collabs are live.",
  },
];

/** "Collab with local businesses" block for the /creators page. */
export function CreatorCollabs() {
  return (
    <section
      aria-labelledby="creator-collabs-title"
      className="relative flex w-full flex-col items-center overflow-x-clip bg-theme-beige px-4 pb-10 pt-2 sm:px-6 md:px-12 md:pb-14 lg:px-24 lg:pb-16"
    >
      <div className="mb-6 text-center md:mb-8">
        <h3 className="font-jakarta text-[18px] font-medium text-black md:text-[22px] lg:text-[24px]">
          New on SeekKrr · starting in Bir
        </h3>
        <div className="mt-2 flex items-start justify-center gap-2">
          <h2
            id="creator-collabs-title"
            className="font-handwriting text-[40px] font-bold leading-none text-black drop-shadow-sm sm:text-[48px] md:text-[56px] lg:text-[64px]"
          >
            Collab with local businesses
          </h2>
          <Image
            src="/assets/images/Stars.svg"
            alt=""
            aria-hidden="true"
            width={36}
            height={44}
            className="hidden h-auto w-8 shrink-0 sm:block"
          />
        </div>
        <p className="mx-auto mt-2 max-w-[600px] text-[15px] leading-relaxed text-black/75 md:text-[17px]">
          Cafés, hostels and adventure outfits trade a meal, a bed or a flight for honest content.
        </p>
      </div>

      <ol className="mb-8 grid w-full max-w-[1240px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {STEPS.map(({ icon: Icon, title, body }, index) => (
          <Reveal key={title} as="li" delay={index * 0.12} lift className="h-full">
            <div
              className={`flex h-full flex-col gap-2.5 rounded-[24px] border-[2px] border-black bg-white p-5 xl:rounded-[28px] ${SHADOWS[index]}`}
            >
              <div className="flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-black bg-theme-yellow font-jakarta text-[18px] font-extrabold"
                >
                  {index + 1}
                </span>
                <Icon className="h-7 w-7 text-theme-green" aria-hidden="true" />
              </div>
              <h4 className="font-jakarta text-[18px] font-bold leading-tight text-black">{title}</h4>
              <p className="text-[14px] leading-snug text-black/75">{body}</p>
            </div>
          </Reveal>
        ))}
      </ol>

      <div className="mb-10 grid w-full max-w-[1240px] grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
        <Reveal className="h-full">
          <div className="flex h-full flex-col gap-2.5 rounded-[24px] border-[2px] border-black bg-[#8398FF] p-5 sm:p-6 [box-shadow:6px_6px_0_#FECD36] xl:rounded-[32px]">
            <ToggleRight className="h-9 w-9 text-white" aria-hidden="true" />
            <h4 className="font-jakarta text-[22px] font-extrabold text-black">Open to collabs</h4>
            <p className="text-[16px] leading-relaxed text-black/85">
              Switch on <strong>Open to collabs</strong> in your creator profile{" "}
              {siteFeatures.matchmaking
                ? "and businesses near you can find you through SeekKrr Match."
                : "to unlock collabs from businesses near you."}{" "}
              You&apos;ll need to be 18+, accept the{" "}
              <Link href={siteConfig.creatorTermsLink} className="font-semibold underline underline-offset-2">
                creator collab terms
              </Link>{" "}
              and add at least one handle. Your contact details stay hidden until you say yes.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="h-full">
          <div className="flex h-full flex-col gap-2.5 rounded-[24px] border-[2px] border-black bg-theme-yellow p-5 sm:p-6 [box-shadow:6px_6px_0_#000] xl:rounded-[32px]">
            <BadgeCheck className="h-9 w-9 fill-white text-black" aria-hidden="true" />
            <h4 className="font-jakarta text-[22px] font-extrabold text-black">Verify your handle</h4>
            <p className="text-[16px] leading-relaxed text-black/85">
              Tap <strong>Verify</strong> next to a handle in the app. We&apos;ll give you a short code like{" "}
              <span className="rounded bg-white px-1.5 py-0.5 font-jakarta font-bold">SK-4821</span>. Add it to
              your bio, tap <strong>Check</strong>, and the verified badge is yours (you can remove the code
              afterwards). Verified handles unlock collabs that ask for them.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="w-full max-w-[860px]">
        <h3 className="mb-5 text-center font-handwriting text-[36px] font-bold leading-none text-black sm:text-[46px]">
          Creator questions
        </h3>
        <Accordion
          headingLevel={4}
          defaultOpen={[FAQ[0].id]}
          items={FAQ.map((item) => ({ id: item.id, title: item.q, content: <p>{item.a}</p> }))}
        />
      </div>

      <Reveal className="mt-10 flex w-full max-w-[860px] flex-col items-center gap-3 text-center">
        <p className="font-jakarta text-[18px] font-bold text-black">Collabs live in the SeekKrr app</p>
        <StoreBadges align="center" />
      </Reveal>
    </section>
  );
}
