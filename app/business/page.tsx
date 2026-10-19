import type { Metadata } from "next";
import { BusinessHero } from "@/components/business/BusinessHero";
import { CollabBuilder } from "@/components/business/CollabBuilder";
import { HowItWorks } from "@/components/business/HowItWorks";
import { MatchExplainer } from "@/components/business/MatchExplainer";
import { TrustSafety } from "@/components/business/TrustSafety";
import { PricingTeaser } from "@/components/business/PricingTeaser";
import { BusinessFaq, BUSINESS_FAQ, faqJsonLd } from "@/components/business/BusinessFaq";
import { PartnerWall } from "@/components/business/PartnerWall";
import { CtaStrip } from "@/components/business/CtaStrip";
import { StructuredData } from "@/components/seo/StructuredData";
import { getPlans } from "@/lib/collabs";
import { siteConfig } from "@/lib/config/site";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "SeekKrr for Business | Creator collabs for cafés, stays & adventures",
  description:
    "Post a collab, let travel creators check in and redeem it with your staff code, and get disclosed content that brings travellers to your door. Free to start, piloting in Bir.",
  alternates: { canonical: "/business" },
  openGraph: {
    title: "SeekKrr for Business",
    description:
      "Swap a stay, a meal or an experience for content from travel creators who are already in town.",
    url: `${siteConfig.url}/business`,
  },
};

export default async function BusinessPage() {
  const { plans } = await getPlans();

  return (
    <div className="relative min-h-screen bg-theme-beige">
      <StructuredData
        data={[
          { name: "Home", item: "/" },
          { name: "For Business", item: "/business" },
        ]}
      />
      <StructuredData type="FAQPage" data={faqJsonLd(BUSINESS_FAQ)} />
      <BusinessHero />
      <PartnerWall />
      <CollabBuilder />
      <HowItWorks />
      <MatchExplainer />
      <TrustSafety />
      <PricingTeaser plans={plans} />
      <BusinessFaq />
      <CtaStrip />
    </div>
  );
}
