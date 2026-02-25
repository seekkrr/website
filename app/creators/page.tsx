import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animations/AnimatedSection";

export const metadata: Metadata = {
    title: "Creators",
    description:
        "Meet the creators behind SeekKrr quests — local experts, adventurers, and storytellers crafting unforgettable experiences.",
};

export default function CreatorsPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
                <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    Creators
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                    The passionate people behind every quest. Local experts, seasoned
                    adventurers, and storytellers crafting experiences that matter.
                </p>
            </AnimatedSection>
        </div>
    );
}
