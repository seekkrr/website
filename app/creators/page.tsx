import type { Metadata } from "next";
import { HeroCreator, CreatorRegister, CreatorSteps, CreatorFeatures, CreatorCollabs } from "@/components/sections";
import { siteConfig } from "@/lib/config/site";

import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
    title: `Creators | Collab with local businesses on ${siteConfig.name}`,
    description:
        `Get listed as a ${siteConfig.name} creator, then check in at local cafés, stays and experiences, redeem collabs with the staff's code and post your content. You can build quests and earn too.`,
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
            <CreatorRegister />
            <CreatorCollabs />
            <CreatorSteps />
            <CreatorFeatures />
        </div>
    );
}
