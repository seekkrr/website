import type { Metadata } from "next";
import { PricingPlans } from "@/components/pricing/PricingPlans";
import { AI_MATCHING_FAQ, BusinessFaq, faqJsonLd } from "@/components/business/BusinessFaq";
import { CtaStrip } from "@/components/business/CtaStrip";
import { hasFullMatching } from "@/components/pricing/planFeatures";
import { SectionHeading } from "@/components/collabs/SectionHeading";
import { StructuredData } from "@/components/seo/StructuredData";
import { getPlans, type Plan } from "@/lib/collabs";
import { siteConfig } from "@/lib/config/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pricing | SeekKrr for Business",
  description:
    "Simple INR plans for cafés, stays and adventures. Start free, try Growth free for 14 days, and unlock AI creator matching on Pro. Annual billing gets 2 months free. Prices + GST.",
  alternates: { canonical: "/business/pricing" },
};

const PRICING_FAQ = [
  {
    id: "gst",
    q: "Are prices inclusive of GST?",
    a: "No. Prices are shown before 18% GST, which is added at checkout. Every payment comes with a GST invoice; add your GSTIN to claim input credit.",
  },
  {
    id: "trial",
    q: "What happens when the Growth trial ends?",
    a: "Your trial runs for 14 days with no card needed. If you don't subscribe, you move to the Free plan automatically. Extra collabs are paused, never deleted.",
  },
  {
    id: "annual",
    q: "How does annual billing work?",
    a: "Pay for 10 months and get 12. Annual plans renew yearly, and you can switch from monthly to annual at any time from Billing in the Partner Portal.",
  },
  {
    id: "cancel",
    q: "Can I cancel any time?",
    a: "Yes. Cancel from Billing and your plan stays active until the end of the period you've paid for, then moves to Free.",
  },
  {
    id: "payment",
    q: "How do I pay?",
    a: "Through Razorpay: UPI, cards and netbanking all work. Plans are managed in the Partner Portal on the web; the SeekKrr app shows your plan and usage but doesn't take payments.",
  },
  AI_MATCHING_FAQ,
  {
    id: "limits",
    q: "What counts as a redemption?",
    a: "Each time a creator redeems one of your collabs with your staff code or a staff QR scan. Counters reset on the 1st of every month (IST). We email you at 80% and 100% of your limit.",
  },
];

function productJsonLd(plans: Plan[]) {
  const offers = plans.flatMap((plan) => {
    if (plan.custom || plan.price_monthly_inr === null) return [];
    const reveals = plan.entitlements.match_reveals_per_month;
    const base = {
      "@type": "Offer",
      description: hasFullMatching(plan)
        ? "Includes AI creator matching (SeekKrr Match AI) with creator invites and the match score breakdown."
        : reveals
          ? `Includes a top-${reveals} AI creator match preview each month.`
          : undefined,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/business/apply?plan=${plan.code}`,
    };
    const monthly = {
      ...base,
      name: `${plan.name} (monthly)`,
      price: String(plan.price_monthly_inr),
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: plan.price_monthly_inr,
        priceCurrency: "INR",
        valueAddedTaxIncluded: false,
        billingDuration: "P1M",
        unitCode: "MON",
      },
    };
    if (!plan.price_annual_inr) return [monthly];
    return [
      monthly,
      {
        ...base,
        name: `${plan.name} (annual)`,
        price: String(plan.price_annual_inr),
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: plan.price_annual_inr,
          priceCurrency: "INR",
          valueAddedTaxIncluded: false,
          billingDuration: "P1Y",
          unitCode: "ANN",
        },
      },
    ];
  });

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "SeekKrr for Business",
    description:
      "Creator collaboration plans for local businesses: post collabs, verify visits with a staff redeem code, and find creators who fit your place with AI creator matching (SeekKrr Match AI) on Pro.",
    brand: { "@type": "Brand", name: siteConfig.name },
    url: `${siteConfig.url}/business/pricing`,
    offers,
  };
}

export default async function PricingPage() {
  const { plans } = await getPlans();

  return (
    <div className="relative min-h-screen bg-theme-beige">
      <StructuredData
        data={[
          { name: "Home", item: "/" },
          { name: "For Business", item: "/business" },
          { name: "Pricing", item: "/business/pricing" },
        ]}
      />
      <StructuredData type="Product" data={productJsonLd(plans)} />
      <StructuredData type="FAQPage" data={faqJsonLd(PRICING_FAQ)} />

      <section className="relative w-full overflow-x-clip px-4 pb-6 pt-24 sm:px-6 sm:pt-28 md:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <SectionHeading
            as="h1"
            eyebrow="SeekKrr for Business"
            title="Plans that grow with your footfall"
            intro="Start free with one collab. Move up when creators are bringing people through your door."
            stars
          />
          <PricingPlans plans={plans} />
        </div>
      </section>

      <BusinessFaq title="Pricing questions" items={PRICING_FAQ} />
      <CtaStrip title="Not sure which plan fits?" cta="Start free" href="/business/apply?plan=free" />
    </div>
  );
}
