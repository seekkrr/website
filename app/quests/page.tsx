import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animations/AnimatedSection";

export const metadata: Metadata = {
    title: "Quests",
    description:
        "Explore curated quests and adventures. From hidden trails to cultural expeditions — find your next unforgettable experience.",
};

export default function QuestsPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
                <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Quests
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                    Extraordinary adventures await. Browse curated quests from hidden
                    trails to cultural expeditions — each one a story waiting to unfold.
                </p>
            </AnimatedSection>
        </div>
    );
}
