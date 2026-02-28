import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
    title: "Terms of Service",
    description:
        `Terms of Service for ${siteConfig.name}. Rules and guidelines for using our platform.`,
};

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 mt-16">
            <div className="max-w-4xl mx-auto">
                <AnimatedSection className="text-center mb-12">
                    <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                        {siteConfig.name} Terms of Service
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Last Updated: {siteConfig.termsLastUpdated}
                    </p>
                </AnimatedSection>

                <AnimatedSection amount={0} delay={0.1} className="bg-card shadow-sm border rounded-3xl overflow-hidden">
                    <div className="p-8 sm:p-12 space-y-10 text-card-foreground leading-relaxed">
                        <section className="space-y-4">
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">1. Introduction</h2>
                            <p className="text-lg">
                                Welcome to {siteConfig.name} (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;). These Terms of Service (&quot;Terms&quot;) govern your access to and use of the {siteConfig.name} mobile application and website (collectively, the &quot;Service&quot;).
                            </p>
                            <p className="text-lg">
                                By creating an account or using the Service, you agree to these Terms and our Privacy Policy. If you do not agree to these Terms, you may not use {siteConfig.name}.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">2. The {siteConfig.name} Ecosystem</h2>
                            <p className="text-muted-foreground">To keep things clear, we use the following definitions:</p>
                            <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                                <li><strong>The Platform:</strong> The {siteConfig.name} app, website, and all associated software.</li>
                                <li><strong>Explorers:</strong> Users who utilize the platform to discover, plan, and embark on independent travel experiences.</li>
                                <li><strong>Creators:</strong> Users who design, upload, and monetize travel guides, itineraries, or experiences on the platform.</li>
                                <li><strong>Content:</strong> Any text, photos, routes, itineraries, or data uploaded by users.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">3. Account Eligibility & Responsibilities</h2>
                            <p className="text-muted-foreground">
                                You must be at least 18 years old to create an account, make purchases, or publish content on {siteConfig.name}. By registering, you warrant that your information is accurate. You are solely responsible for maintaining the confidentiality of your account credentials.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">4. Creator Content, Licensing, and The Creator Economy</h2>
                            <p className="text-muted-foreground">
                                {siteConfig.name} empowers individuals to share their world. When you upload Content, you are responsible for its accuracy, legality, and originality.
                            </p>
                            <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                                <li><strong>Your Ownership:</strong> You retain all ownership rights to the Content you create and upload on the {siteConfig.name} Platform.</li>
                                <li><strong>Our License:</strong> By posting Content, you grant {siteConfig.name} a worldwide, non-exclusive, royalty-free, transferable license to use, reproduce, distribute, display, and modify your Content to operate, promote, and improve the Service.</li>
                                <li><strong>Content Moderation:</strong> We reserve the right (but not the obligation) to review, refuse, or remove any Content—especially Creator submissions—that violates our quality guidelines or contains objectionable, inaccurate, or unsafe material.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">5. Independent Travel & Physical Safety Disclaimer</h2>
                            <p className="text-muted-foreground">
                                {siteConfig.name} provides digital tools and community-generated recommendations for independent exploration. You acknowledge that traveling, especially independently, carries inherent physical and financial risks.
                            </p>
                            <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                                <li><strong>At Your Own Risk:</strong> {siteConfig.name} is not a tour operator, travel agent, or security service. Any reliance on routes, itineraries, or location data provided by the Service or its Creators is strictly at your own risk.</li>
                                <li><strong>Real-World Conditions:</strong> Real-world conditions (weather, road closures, safety hazards) always supersede digital data. We do not guarantee the accuracy, safety, or current viability of any user-generated or platform-provided itinerary.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">6. Payments, Subscriptions, and Creator Payouts</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p><strong>Purchases & Subscriptions:</strong> Certain features or Creator Content may require payment or a recurring subscription. You authorize us (and our third-party payment processors) to charge your designated payment method.</p>
                                <p><strong>Auto-Renewal:</strong> Subscriptions automatically renew unless canceled prior to the end of the current billing cycle.</p>
                                <p><strong>Refunds:</strong> Except where required by applicable law, all purchases and subscription fees are strictly non-refundable.</p>
                                <p><strong>Creator Monetization:</strong> If you operate as a Creator, payouts and revenue sharing are governed by our separate <a href={siteConfig.creatorPayoutLink} className="text-primary hover:underline font-medium">Creator Payout Agreement</a>, which outlines commission structures and disbursement schedules.</p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">7. Intellectual Property Rights</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse border border-border">
                                    <thead>
                                        <tr className="bg-muted/50 text-foreground">
                                            <th className="p-4 border border-border font-bold">Asset Type</th>
                                            <th className="p-4 border border-border font-bold">Who Owns It?</th>
                                            <th className="p-4 border border-border font-bold">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-muted-foreground">
                                        <tr>
                                            <td className="p-4 border border-border font-medium text-foreground">User-Generated Content</td>
                                            <td className="p-4 border border-border whitespace-nowrap">The User / Creator</td>
                                            <td className="p-4 border border-border">Photos, text, and specific itineraries uploaded by the individual.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 border border-border font-medium text-foreground">The {siteConfig.name} Platform</td>
                                            <td className="p-4 border border-border">{siteConfig.name}</td>
                                            <td className="p-4 border border-border">App code, UI/UX design, logos, trademarks, and proprietary algorithms.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 border border-border font-medium text-foreground">Aggregated Data</td>
                                            <td className="p-4 border border-border">{siteConfig.name}</td>
                                            <td className="p-4 border border-border">Anonymized, platform-wide data trends used to improve the Service.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-muted-foreground mt-4">
                                You may not copy, reverse-engineer, or commercially exploit any part of the {siteConfig.name} Platform without our express written consent.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">8. Prohibited Conduct</h2>
                            <p className="text-muted-foreground">You agree not to use the Service to:</p>
                            <ul className="list-disc pl-6 space-y-3 text-muted-foreground">
                                <li>Upload illegal, defamatory, hateful, or explicit content.</li>
                                <li>Post intentionally false or dangerously misleading travel information.</li>
                                <li>Scrape, crawl, or deploy bots to extract data from the platform.</li>
                                <li>Harass other users or impersonate {siteConfig.name} staff.</li>
                            </ul>
                        </section>

                        <section className="space-y-4 text-muted-foreground">
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">9. Disclaimer of Warranties</h2>
                            <p>
                                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE.&quot; {siteConfig.name.toUpperCase()} DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR PERFECTLY ACCURATE.
                            </p>
                        </section>

                        <section className="space-y-4 text-muted-foreground">
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">10. Limitation of Liability</h2>
                            <p>
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, {siteConfig.name.toUpperCase()}, ITS DIRECTORS, EMPLOYEES, AND CREATORS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, NOR FOR ANY PHYSICAL INJURY, PROPERTY DAMAGE, OR FINANCIAL LOSS RESULTING FROM YOUR USE OF THE APP OR YOUR REAL-WORLD TRAVELS BASED ON APP CONTENT. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE PAST 12 MONTHS.
                            </p>
                        </section>

                        <section className="space-y-4 text-muted-foreground">
                            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">11. Governing Law & Dispute Resolution</h2>
                            <p>
                                These Terms shall be governed by the laws of {siteConfig.jurisdiction}, without regard to its conflict of law provisions. Any disputes arising from these Terms will be resolved through binding arbitration in {siteConfig.disputeLocation}.
                            </p>
                        </section>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}
