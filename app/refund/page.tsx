import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
    title: "Refund and Cancellation Policy",
    description:
        `Refund and Cancellation Policy for ${siteConfig.name}. Learn about our policies regarding cancellations and refunds for products and services.`,
};

export default function RefundPolicyPage() {
    return (
        <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-4xl mx-auto">
                <AnimatedSection className="text-center mb-12">
                    <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                        Refund and Cancellation Policy
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Last updated: {siteConfig.refundLastUpdated || "April 2026"}
                    </p>
                </AnimatedSection>

                <AnimatedSection amount={0} delay={0.1} className="bg-card shadow-sm border rounded-3xl overflow-hidden">
                    <div className="p-8 sm:p-12 space-y-10 text-card-foreground leading-relaxed">
                        <section className="space-y-4">
                            <p className="text-lg">
                                This refund and cancellation policy outlines how you can cancel or seek a refund for a product or service that you have purchased through the Platform. Under this policy:
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                                Cancellation Policy
                            </h2>
                            <p className="text-muted-foreground">
                                Cancellations will only be considered if the request is made within 7 days of placing the order.
                            </p>
                            <p className="text-muted-foreground">
                                Cancellation requests or complaints can be registered by sending an email to{" "}
                                <a href="mailto:support@seekkrr.com" className="text-primary hover:underline font-medium">
                                    support@seekkrr.com
                                </a>
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                                Refund Processing
                            </h2>
                            <p className="text-muted-foreground">
                                In case of any refunds approved by {siteConfig.name}, it will take 7 days for the refund to be processed to your account.
                            </p>
                        </section>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}
