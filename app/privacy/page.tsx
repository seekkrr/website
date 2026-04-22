import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { siteConfig } from "@/lib/config/site";
import { MarkdownPolicy } from "@/components/legal/MarkdownPolicy";

export const metadata: Metadata = {
    title: "Privacy Policy",
    description: `Privacy Policy for ${siteConfig.name}. Learn about our policies regarding the collection, use, and disclosure of personal data.`,
};

export default async function PrivacyPolicyPage() {
    const res = await fetch("https://cdn.jsdelivr.net/gh/seekkrr/policies@main/en/privacy-policy.md", { next: { revalidate: 60 } });
    const content = res.ok ? await res.text() : "Failed to load policy. Please try again later.";

    return (
        <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-4xl mx-auto">
                <AnimatedSection amount={0} delay={0.1} className="bg-card shadow-sm border rounded-3xl overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <MarkdownPolicy content={content} />
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}
