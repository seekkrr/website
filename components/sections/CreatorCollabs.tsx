"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Camera,
  Compass,
  KeyRound,
  Link2,
  MapPin,
  Search,
  Sparkles,
  Store,
  Ticket,
  ToggleRight,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { GoogleIcon } from "@/components/collabs/GoogleHandoffLink";
import { Reveal } from "@/components/collabs/Reveal";
import { StoreBadges } from "@/components/collabs/StoreBadges";
import { trackEvent } from "@/lib/analytics";
import { portalLinks, siteConfig, siteFeatures } from "@/lib/config/site";

type Step = { icon: LucideIcon; title: string; body: React.ReactNode };
type Phase = { icon: LucideIcon; name: string; shadow: string; steps: Step[] };

/** Getting listed happens once, on the Partner Portal. */
const LISTING = [
  { title: "Continue with Google", body: "Use the Register button on this page." },
  { title: "Two quick details", body: "Your phone number and your Instagram, YouTube or blog link." },
  { title: "Approval email", body: "We review every creator by hand, usually within 2 working days." },
];

/**
 * A collab after you're listed, in the same seven steps (and names) as the
 * "Creator 1–7" how-it-works videos, grouped by where you are.
 */
const PHASES: Phase[] = [
  {
    icon: Compass,
    name: "Before you go",
    shadow: "[box-shadow:6px_6px_0_#FECD36]",
    steps: [
      {
        icon: UserRound,
        title: "Fill your creator profile",
        body: (
          <>
            In the app&apos;s <strong>Collabs</strong> tab, add your handle, travel style and a short bio. Businesses
            see this first.
          </>
        ),
      },
      {
        icon: Search,
        title: "Find places open for collabs",
        body: (
          <>
            Tap <strong>Search Collabs</strong>. The map shows only the places open for collabs. Tap one to see what
            it offers.
          </>
        ),
      },
    ],
  },
  {
    icon: Store,
    name: "At the place",
    shadow: "[box-shadow:6px_6px_0_var(--color-blue-accent)]",
    steps: [
      {
        icon: MapPin,
        title: "Check in at the place",
        body: (
          <>
            When you get there, slide <strong>Check-In</strong> on the place&apos;s page. Its collabs open up: what
            they want and what you get.
          </>
        ),
      },
      {
        icon: Ticket,
        title: "Redeem or Avail",
        body: (
          <>
            <strong>Redeem</strong> a walk-in collab right away. <strong>Avail</strong> sends your profile to the
            business, and they approve you.
          </>
        ),
      },
      {
        icon: KeyRound,
        title: "Staff enter their code",
        body: (
          <>
            Hand your phone to the staff. They type their <strong>4-digit code</strong> and the collab is redeemed.
            No network? Show your <strong>QR</strong> and they scan it.
          </>
        ),
      },
    ],
  },
  {
    icon: Sparkles,
    name: "After your visit",
    shadow: "[box-shadow:6px_6px_0_var(--color-orange-accent)]",
    steps: [
      {
        icon: Camera,
        title: "Enjoy, then create",
        body: siteFeatures.disclosureLabel ? (
          <>
            Enjoy the meal, stay or experience. Your brief in <strong>My Collabs</strong> says what to post, who to
            tag and by when. Always add the disclosure tag, like <strong>#collab</strong>.
          </>
        ) : (
          <>
            Enjoy the meal, stay or experience. Your brief in <strong>My Collabs</strong> says what to post, who to
            tag and by when.
          </>
        ),
      },
      {
        icon: Link2,
        title: "Send your post link",
        body: (
          <>
            Paste the link in the <strong>chat</strong> with the business by the due date. Then you both review the
            collab. Reviews are private: only SeekKrr sees them.
          </>
        ),
      },
    ],
  },
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
    id: "ahead",
    q: "Can I plan a visit before I get there?",
    a: "Yes. Some collabs show Request visit: pick your dates and the business approves. On the day, check in and redeem as usual.",
  },
  {
    id: "late",
    q: "What if I can't post in time?",
    a: "Every brief says how many days you have to post. If plans change, cancel the collab from My Collabs before your visit. Missed deadlines count against your reliability.",
  },
  {
    id: "safety",
    q: "What if something feels off at a visit?",
    a: "Leave, then report the business from the app. Reports go to our moderation team, and you can block a business so it never shows up for you again. Your phone number and email are only shared once a business approves your request.",
  },
  {
    id: "where",
    q: "Where can I collab?",
    a: "We're starting in Bir, Himachal Pradesh, and opening more regions soon. Collab pins only appear on the map where collabs are live.",
  },
];

/** "Collab with local businesses" for the /creators page: get listed, then the seven steps of a collab. */
export function CreatorCollabs() {
  return (
    <section
      aria-labelledby="creator-collabs-title"
      className="relative flex w-full flex-col items-center overflow-x-clip bg-theme-beige px-4 pb-10 pt-2 sm:px-6 md:px-12 md:pb-14 lg:px-24 lg:pb-16"
    >
      <div className="mb-8 text-center md:mb-10">
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
        <p className="mx-auto mt-2 max-w-[640px] text-[15px] leading-relaxed text-black/75 md:text-[17px]">
          Cafés, stays and adventure spots trade a meal, a bed or an experience for honest content. Here&apos;s the
          whole thing, start to finish.
        </p>
      </div>

      {/* Once: get listed */}
      <Reveal className="mb-10 w-full max-w-[1240px] md:mb-12">
        <div className="flex flex-col gap-5 rounded-[24px] border-[2px] border-black bg-white p-5 sm:p-6 [box-shadow:6px_6px_0_#000] lg:flex-row lg:items-center lg:gap-8 xl:rounded-[32px]">
          <div className="shrink-0 lg:w-[220px]">
            <p className="font-jakarta text-[13px] font-bold uppercase tracking-[0.12em] text-black/60">First, once</p>
            <h3 className="font-jakarta text-[24px] font-extrabold leading-tight text-black">Get listed</h3>
          </div>
          <ol className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
            {LISTING.map((item, index) => (
              <li key={item.title} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[2px] border-black bg-white font-jakarta text-[14px] font-extrabold"
                >
                  {String.fromCharCode(65 + index)}
                </span>
                <div>
                  <p className="font-jakarta text-[16px] font-bold leading-tight text-black">{item.title}</p>
                  <p className="mt-0.5 text-[14px] leading-snug text-black/70">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <a
            href={portalLinks.creatorApply}
            onClick={() => trackEvent("creator_signup_handoff", { source: "creators_get_listed" })}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-[12px] border-[3px] border-black bg-white py-2.5 pl-3 pr-5 font-jakarta text-[16px] font-bold text-black [box-shadow:3px_3px_0_var(--color-blue-accent)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-yellow focus-visible:ring-offset-2 lg:self-center"
          >
            <GoogleIcon className="h-5 w-5 shrink-0" />
            Register
          </a>
        </div>
      </Reveal>

      {/* Every collab: seven steps in three places */}
      <h3 className="mb-6 text-center font-jakarta text-[20px] font-bold text-black md:text-[24px]">
        Once you&apos;re listed, every collab goes like this
      </h3>
      <div className="mb-12 grid w-full max-w-[1240px] grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-6">
        {PHASES.map((phase, p) => {
          const first = PHASES.slice(0, p).reduce((n, earlier) => n + earlier.steps.length, 1);
          return (
          <Reveal key={phase.name} delay={p * 0.12} className="flex flex-col gap-4">
            <div className="flex items-center gap-2 self-start rounded-full border-[2px] border-black bg-white px-4 py-1.5">
              <phase.icon className="h-5 w-5 text-theme-green" aria-hidden="true" />
              <span className="font-jakarta text-[15px] font-bold text-black">{phase.name}</span>
            </div>
            <ol className="flex flex-col gap-4">
              {phase.steps.map(({ icon: Icon, title, body }, i) => {
                const number = first + i;
                return (
                  <li
                    key={title}
                    className={`flex flex-col gap-2.5 rounded-[24px] border-[2px] border-black bg-white p-5 xl:rounded-[28px] ${phase.shadow}`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        aria-hidden="true"
                        className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-black bg-theme-yellow font-jakarta text-[18px] font-extrabold"
                      >
                        {number}
                      </span>
                      <Icon className="h-7 w-7 text-theme-green" aria-hidden="true" />
                    </div>
                    <h4 className="font-jakarta text-[18px] font-bold leading-tight text-black">
                      <span className="sr-only">Step {number}: </span>
                      {title}
                    </h4>
                    <p className="text-[14px] leading-snug text-black/75">{body}</p>
                  </li>
                );
              })}
            </ol>
          </Reveal>
          );
        })}
      </div>

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
              and add at least one handle. Your phone number and email stay hidden until a business approves you.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="h-full">
          <div className="flex h-full flex-col gap-2.5 rounded-[24px] border-[2px] border-black bg-theme-yellow p-5 sm:p-6 [box-shadow:6px_6px_0_#000] xl:rounded-[32px]">
            <BadgeCheck className="h-9 w-9 fill-white text-black" aria-hidden="true" />
            <h4 className="font-jakarta text-[22px] font-extrabold text-black">Verify your handle</h4>
            <p className="text-[16px] leading-relaxed text-black/85">
              Tap <strong>Verify handle</strong> in your creator profile. We&apos;ll give you a short code like{" "}
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
