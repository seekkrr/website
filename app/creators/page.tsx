import type { Metadata } from "next";
import { HeroCreator, CreatorSteps, CreatorFeatures } from "@/components/sections";
import { siteConfig } from "@/lib/config/site";

import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
    title: `Experts & Creators | Crafting Quests for ${siteConfig.name}`,
    description:
        `Meet the local experts and adventurers behind ${siteConfig.name} quests. Learn how creators are crafting unforgettable experiences and gamified travel stories.`,
    alternates: {
        canonical: "/creators",
    },
};

export default function CreatorsPage() {
    return (
        <div className="relative min-h-screen bg-theme-beige flex flex-col">
            <StructuredData
                data={[
                    { name: "Home", item: "/" },
                    { name: "Creators", item: "/creators" },
                ]}
            />
            <HeroCreator />
            <CreatorSteps />
            <CreatorFeatures />
        </div>
    );
}
