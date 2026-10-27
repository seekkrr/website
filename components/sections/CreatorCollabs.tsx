"use client";

import Link from "next/link";
import { BadgeCheck, ToggleRight } from "lucide-react";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/collabs/Reveal";
import { CollabTrail } from "@/components/creators/CollabTrail";
import { TrailFinale } from "@/components/creators/TrailFinale";
import type { TrailPlace } from "@/components/creators/PlacesTown";
import { siteConfig, siteFeatures } from "@/lib/config/site";

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

/** Collabs on the /creators page: the trail you walk, how it ends, and the small print. */
export function CreatorCollabs({ places = [] }: { places?: TrailPlace[] }) {
  return (
    <>
      <CollabTrail />
      <TrailFinale places={places} />

      <section
        aria-labelledby="creator-collabs-faq"
        className="relative flex w-full flex-col items-center overflow-x-clip bg-theme-beige px-4 pb-12 pt-6 sm:px-6 md:px-12 md:pb-16 lg:px-24"
      >
        <h2 className="mb-8 text-center font-handwriting text-[44px] font-bold leading-none text-black sm:text-[56px]">
          Before your first stop
        </h2>
        <div className="mb-12 grid w-full max-w-[1240px] grid-cols-1 gap-5 lg:grid-cols-2">
          <Reveal lift className="h-full">
            <div className="flex h-full flex-col gap-2.5 rounded-[28px] border-[3px] border-black bg-[#8398FF] p-6 [box-shadow:6px_6px_0_#FECD36] sm:p-7">
              <ToggleRight className="h-10 w-10 text-white" aria-hidden="true" />
              <h3 className="font-jakarta text-[24px] font-extrabold text-black">Switch on Open to collabs</h3>
              <p className="text-[16px] leading-relaxed text-black/85">
                It&apos;s in your creator profile{" "}
                {siteFeatures.matchmaking ? "and lets businesses near you find you through SeekKrr Match." : "and unlocks collabs from businesses near you."}{" "}
                You&apos;ll need to be 18+, accept the{" "}
                <Link href={siteConfig.creatorTermsLink} className="font-semibold underline underline-offset-2">
                  creator collab terms
                </Link>{" "}
                and add at least one handle. Your phone number and email stay hidden until a business approves you.
              </p>
            </div>
          </Reveal>
          <Reveal lift delay={0.1} className="h-full">
            <div className="flex h-full flex-col gap-2.5 rounded-[28px] border-[3px] border-black bg-theme-yellow p-6 [box-shadow:6px_6px_0_#000] sm:p-7">
              <BadgeCheck className="h-10 w-10 fill-white text-black" aria-hidden="true" />
              <h3 className="font-jakarta text-[24px] font-extrabold text-black">Verify your handle</h3>
              <p className="text-[16px] leading-relaxed text-black/85">
                Tap <strong>Verify handle</strong> in your creator profile. We&apos;ll give you a short code like{" "}
                <span className="rounded bg-white px-1.5 py-0.5 font-jakarta font-bold">SK-4821</span>. Add it to your bio,
                tap <strong>Check</strong>, and the verified badge is yours (you can remove the code afterwards). Verified
                handles unlock collabs that ask for them.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="w-full max-w-[860px]">
          <h3 id="creator-collabs-faq" className="mb-5 text-center font-handwriting text-[36px] font-bold leading-none text-black sm:text-[46px]">
            Creator questions
          </h3>
          <Accordion
            headingLevel={4}
            defaultOpen={[FAQ[0].id]}
            items={FAQ.map((item) => ({ id: item.id, title: item.q, content: <p>{item.a}</p> }))}
          />
        </div>
      </section>
    </>
  );
}
