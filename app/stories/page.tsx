import Link from "next/link";
import { Metadata } from "next";
import { AnimatedSection } from "@/components/animations/AnimatedSection";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
    title: "Travel Stories - Coming Soon",
    description: `Travel Stories is coming soon to ${siteConfig.name}. Get ready for amazing adventures!`,
};

export default function ComingSoonPage() {
    return (
        <div className="min-h-screen bg-theme-beige flex items-center justify-center p-6 overflow-hidden mt-16">
            <AnimatedSection className="w-full max-w-[860px] mx-auto flex flex-col items-center justify-center text-center">

                {/* Coming Soon Heading */}
                <h1 className="font-handwriting text-[80px] sm:text-[120px] md:text-[160px] font-bold leading-none text-theme-green [text-shadow:6px_6px_0_var(--color-yellow-accent)] mb-4">
                    Coming Soon
                </h1>

                {/* Main Text Container */}
                <div className="border-[3px] border-black rounded-[24px] bg-white py-10 px-6 sm:px-12 shadow-[8px_8px_0_var(--color-orange-accent)] w-full max-w-[600px] mb-10">
                    <h2 className="font-jakarta text-[28px] sm:text-[34px] font-extrabold text-black mb-4 tracking-tight">
                        Travel Stories Coming Soon!
                    </h2>

                    <p className="font-sans text-[16px] sm:text-[18px] text-black/80 leading-relaxed mb-8">
                        We're crafting incredible travel stories curated by local experts. Get ready to dive into authentic adventures and discover hidden gems from around the world!
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/"
                            className="w-full sm:w-auto px-8 py-3.5 bg-black text-white font-jakarta font-bold text-[16px] rounded-full border-2 border-black hover:bg-black/90 active:scale-[0.98] transition-all flex items-center justify-center"
                        >
                            Return Home
                        </Link>
                    </div>
                </div>

            </AnimatedSection>
        </div>
    );
}
