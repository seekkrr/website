import type { Metadata } from "next";
import { AnimatedSection } from "@/components/animations/AnimatedSection";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn about SeekKrr — the platform connecting explorers with extraordinary quests and unforgettable experiences.",
};

export default function AboutPage() {
    return (
        <div className="flex min-h-screen items-center justify-center px-6">
            <AnimatedSection className="mx-auto max-w-2xl text-center">
                <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                    About SeekKrr
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                    We&apos;re building the future of adventure. SeekKrr connects
                    passionate explorers with extraordinary quests created by local
                    experts and seasoned adventurers.
                </p>
            </AnimatedSection>
        </div>
    );
}
