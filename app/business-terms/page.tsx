import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { CollabTermsNotice } from "@/components/legal/CollabTermsNotice";
import { MarkdownPolicy } from "@/components/legal/MarkdownPolicy";
import { getTermsVersions } from "@/lib/collabs";
import { siteConfig } from "@/lib/config/site";
import { getMarkdownPolicyOrNull } from "@/lib/utils/policy";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Business Terms",
  description: `Business Terms for ${siteConfig.name} for Business: listing, collabs, redeem codes, plans and billing.`,
  alternates: { canonical: "/business-terms" },
};

const BUSINESS_POINTS = [
  "Only owners or authorised representatives may list a business, and every listing is verified by SeekKrr before it goes live.",
  "Honour your collabs: when a creator redeems within a collab's dates and limits, provide the offer as described.",
  "Your 4-digit redeem code is your responsibility. Share it only with staff and change it if you think it has leaked.",
  "Collab text must be honest and lawful: no prohibited offers (such as alcohol or tobacco promotion) and no contact details. Collabs are screened and may be held for review.",
  "Every collab carries a disclosure label (#ad, #collab or #gifted). Never ask a creator to hide or remove it.",
  "Treat creators with respect. Their contact details are shared only after approval and with their consent, and either side can report or block.",
  "Use creator content only within the usage rights you set in the brief; creators keep ownership of what they make.",
  "Paid plans are billed in INR through Razorpay with GST invoices. You can cancel any time; access continues until the end of the paid period, then moves to Free.",
  `We may pause collabs or suspend a listing for breaches or verified reports. Questions or disputes: ${siteConfig.email}.`,
];

export default async function BusinessTermsPage() {
  const [content, versions] = await Promise.all([getMarkdownPolicyOrNull("business-terms"), getTermsVersions()]);

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-4xl mx-auto">
        {content ? (
          <>
            <CollabTermsNotice
              title="Business Terms at a glance"
              version={versions.business}
              intro="A plain-language summary. The full Business Terms below are what you accept in the app or the Partner Portal."
              points={BUSINESS_POINTS}
            />
            <AnimatedSection amount={0} delay={0.1} className="bg-card shadow-sm border rounded-3xl overflow-hidden">
              <div className="p-8 sm:p-12">
                <MarkdownPolicy content={content} />
              </div>
            </AnimatedSection>
          </>
        ) : (
          <AnimatedSection amount={0} delay={0.1} className="bg-card shadow-sm border rounded-3xl overflow-hidden">
            <div className="p-8 sm:p-12 font-sans">
              <h1 className="font-heading text-3xl font-extrabold mb-4">Business Terms</h1>
              <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
                These terms apply to businesses that list on {siteConfig.name} and run creator collabs. They sit
                alongside our general{" "}
                <Link href="/terms" className="text-primary font-medium hover:underline">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary font-medium hover:underline">
                  Privacy Policy
                </Link>
                . The full document is being published on this page; the key points are below, and the version
                you accept in the app or Partner Portal is the one that applies. For a copy, email{" "}
                <a href={`mailto:${siteConfig.email}`} className="text-primary font-medium hover:underline">
                  {siteConfig.email}
                </a>
                .
              </p>
              <CollabTermsNotice
                title="Key points"
                version={versions.business}
                intro="What you agree to when you list your business and post collabs:"
                points={BUSINESS_POINTS}
              />
              <p className="text-muted-foreground leading-relaxed text-base">
                {siteConfig.company}, {siteConfig.address}, {siteConfig.postalCode}, {siteConfig.jurisdiction}.
                Disputes are subject to the courts of {siteConfig.disputeLocation}.
              </p>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}
