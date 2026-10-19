import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { CollabTermsNotice } from "@/components/legal/CollabTermsNotice";
import { MarkdownPolicy } from "@/components/legal/MarkdownPolicy";
import { getTermsVersions } from "@/lib/collabs";
import { siteConfig } from "@/lib/config/site";
import { getMarkdownPolicyOrNull } from "@/lib/utils/policy";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Creator Terms",
  description: `Creator Terms and Conditions for ${siteConfig.name}, including how creator collabs with local businesses work.`,
  alternates: { canonical: "/creator-terms" },
};

const COLLAB_POINTS = [
  "You must be 18 or older, and the handles you add must be yours. We may ask you to prove it with a code in your bio.",
  "Redeem a collab only when you are at the place, and let staff enter their own code or scan your QR.",
  "Follow the brief, post within the time it gives, and always include the disclosure label (#ad, #collab or #gifted).",
  "Collabs are personal: don't sell, swap or hand them to someone else.",
  "Businesses may reuse your posts only as the brief's usage rights say; you keep ownership of your content.",
  "Your contact details are shared with a business only after you agree. Report or block anyone who makes you uncomfortable.",
  "No-shows and missed deadlines lower your reliability, and repeated or serious breaches can pause your access to collabs.",
];

export default async function CreatorTermsPage() {
  const [content, versions] = await Promise.all([getMarkdownPolicyOrNull("creator-terms"), getTermsVersions()]);

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-4xl mx-auto">
        <CollabTermsNotice
          title="Creator collabs at a glance"
          version={versions.creator}
          intro="Taking part in collabs with local businesses also means agreeing to the Creator Collab Terms in the SeekKrr app. In short:"
          points={COLLAB_POINTS}
        />
        <AnimatedSection amount={0} delay={0.1} className="bg-card shadow-sm border rounded-3xl overflow-hidden">
          <div className="p-8 sm:p-12">
            {content ? (
              <MarkdownPolicy content={content} />
            ) : (
              <div className="w-full font-sans">
                <h1 className="font-heading text-3xl font-extrabold mb-6">Creator Terms and Conditions</h1>
                <p className="text-muted-foreground leading-relaxed mb-4 text-lg">
                  We couldn&apos;t load the full Creator Terms just now. Please refresh in a minute, or email{" "}
                  <a href={`mailto:${siteConfig.email}`} className="text-primary font-medium hover:underline">
                    {siteConfig.email}
                  </a>{" "}
                  for a copy.
                </p>
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
}
