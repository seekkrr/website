import type { Metadata } from "next";
import { BusinessHero } from "@/components/business/BusinessHero";
import { CategoryMarquee } from "@/components/business/CategoryMarquee";
import { StickyBusinessCta } from "@/components/business/StickyBusinessCta";
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
import { siteConfig, siteFeatures } from "@/lib/config/site";

export const revalidate = 600;

const description = [
  siteFeatures.matchmaking
    ? "Post a UGC brief, let travel creators check in and redeem it with your staff code, and find creators who fit your place with AI creator matching."
    : "Post a UGC brief, let travel creators check in and redeem it with your staff code, and get content from creators who are already in town.",
  siteFeatures.plans ? "Free to start, piloting in Bir." : "Piloting in Bir.",
].join(" ");

export const metadata: Metadata = {
  title: "For Business | UGC from travel creators for cafés & stays",
  description,
  alternates: { canonical: "/business" },
  openGraph: {
    title: "SeekKrr for Business",
    description:
      "Swap a stay, a meal or an experience for content from travel creators who are already in town.",
    url: `${siteConfig.url}/business`,
  },
};

export default async function BusinessPage() {
  // GET /plans only feeds the pricing teaser and the matching section's plan row.
  const plans = siteFeatures.plans ? (await getPlans()).plans : undefined;

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
      <CategoryMarquee />
      <PartnerWall />
      <CollabBuilder />
      <HowItWorks />
      {siteFeatures.matchmaking && <MatchExplainer plans={plans} />}
      <TrustSafety />
      {plans && <PricingTeaser plans={plans} />}
      <BusinessFaq />
      <CtaStrip />
      <StickyBusinessCta />
    </div>
  );
}
