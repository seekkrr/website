import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowUpRight, Clock, Phone, Store, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/collabs/SectionHeading";
import {
  ForwardingGoogleHandoffLink,
  GoogleHandoffLink,
  GoogleIcon,
} from "@/components/collabs/GoogleHandoffLink";
import { StructuredData } from "@/components/seo/StructuredData";
import { portalLinks, siteConfig, siteFeatures } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "List your business | SeekKrr for Business",
  description: `List your café, stay or adventure on SeekKrr and start hosting travel creators. Continue with Google, add your phone number and tell us about your place: about 2 minutes${siteFeatures.plans ? ", free to start" : ""}.`,
  alternates: { canonical: "/business/apply" },
};

const STEPS: { title: string; body: string; icon: LucideIcon | "google" }[] = [
  {
    title: "Continue with Google",
    body: "Sign in with the Google account you'll use to manage your listing.",
    icon: "google",
  },
  {
    title: "Add your phone number",
    body: "So we can call to confirm your listing. It's never shown publicly.",
    icon: Phone,
  },
  {
    title: "Tell us about your place",
    body: "Name, location and category. Photos and socials can wait.",
    icon: Store,
  },
];

// Partner referral links (`?ref=`), pricing CTAs (`?plan=`, only while plans are shown) and
// campaign tags ride along to the portal.
const FORWARDED_PARAMS = [
  "ref",
  ...(siteFeatures.plans ? ["plan"] : []),
  "utm_source",
  "utm_medium",
  "utm_campaign",
] as const;

const CHIPS = ["About 2 minutes", ...(siteFeatures.plans ? ["Free to start"] : []), "We review every listing"];

function portalHost() {
  try {
    return new URL(siteConfig.partnerPortalUrl).host;
  } catch {
    return null;
  }
}

export default function BusinessApplyPage() {
  const host = portalHost();
  const cta = {
    href: portalLinks.businessApply,
    event: "business_signup_handoff",
    source: "business_apply",
    className: "w-full sm:w-auto",
  } as const;

  return (
    <div className="relative min-h-screen bg-theme-beige px-4 pb-12 pt-24 sm:px-6 sm:pt-28 md:px-12 md:pb-16 lg:px-24">
      <StructuredData
        data={[
          { name: "Home", item: "/" },
          { name: "For Business", item: "/business" },
          { name: "List your business", item: "/business/apply" },
        ]}
      />
      {/* Phones: heading → steps → CTA. From lg: heading + CTA on the left, steps on the right. */}
      <div className="mx-auto grid w-full max-w-[1120px] grid-cols-1 gap-6 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-x-12 lg:gap-y-6">
        <SectionHeading
          as="h1"
          align="left"
          eyebrow="SeekKrr for Business"
          title="List your business on SeekKrr"
          intro="Three quick steps in the SeekKrr Partner Portal, then start hosting travel creators."
          stars
          className="mb-0 md:mb-0 lg:self-end"
        />

        <ol className="relative flex flex-col gap-3 rounded-[24px] border-[3px] border-black bg-white p-4 shadow-[6px_6px_0_0_#FECD36] sm:p-6 lg:row-span-2 xl:rounded-[28px]">
          {STEPS.map(({ title, body, icon: Icon }, index) => (
            <li
              key={title}
              className="flex items-start gap-4 rounded-[18px] border-[3px] border-black bg-theme-beige p-4 transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0"
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-[3px] border-black bg-theme-yellow font-jakarta text-[17px] font-extrabold text-black"
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-jakarta text-[17px] font-bold leading-tight text-black">
                  <span className="sr-only">Step {index + 1}: </span>
                  {title}
                </h2>
                <p className="mt-1 text-[14px] leading-snug text-black/70">{body}</p>
              </div>
              <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white sm:flex">
                {Icon === "google" ? (
                  <GoogleIcon className="h-[18px] w-[18px]" />
                ) : (
                  <Icon className="h-[18px] w-[18px] text-theme-green" aria-hidden="true" />
                )}
              </span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-4 lg:self-start">
          <ul className="flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
              <li
                key={chip}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1 font-jakarta text-[13px] font-bold text-black"
              >
                <Clock className="h-3.5 w-3.5 text-theme-green" aria-hidden="true" />
                {chip}
              </li>
            ))}
          </ul>
          <Suspense fallback={<GoogleHandoffLink {...cta} />}>
            <ForwardingGoogleHandoffLink {...cta} forwardParams={FORWARDED_PARAMS} />
          </Suspense>
          <p className="text-[13px] leading-snug text-black/60">
            You&apos;ll finish in the Partner Portal{host ? <> ({host})</> : null}.
          </p>
          <div className="flex flex-col gap-2 border-t-2 border-dashed border-black/15 pt-4">
            <a
              href={portalLinks.business}
              className="inline-flex min-h-[44px] items-center gap-1.5 self-start rounded-full font-jakarta text-[16px] font-bold text-black underline decoration-theme-yellow decoration-[3px] underline-offset-4 transition-colors hover:decoration-black focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
            >
              Already listed? Open the Partner Portal
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <p className="text-[14px] text-black/60">
              Questions? Write to{" "}
              <a href={`mailto:${siteConfig.email}`} className="font-semibold underline underline-offset-2">
                {siteConfig.email}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
