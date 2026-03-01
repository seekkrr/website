import type { Metadata } from "next";
import { HeroCreator, CreatorSteps, CreatorFeatures } from "@/components/sections";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
    title: "Creators",
    description:
        `Meet the creators behind ${siteConfig.name} quests — local experts, adventurers, and storytellers crafting unforgettable experiences.`,
};

export default function CreatorsPage() {
    return (
        <div className="relative min-h-screen bg-theme-beige flex flex-col">
            <HeroCreator />
            <CreatorSteps />
            <CreatorFeatures />
        </div>
    );
}
