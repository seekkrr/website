import type { Metadata } from "next";
import { HeroCreator, CreatorRegister, CreatorSteps, CreatorFeatures, CreatorCollabs } from "@/components/sections";
import { siteConfig } from "@/lib/config/site";

import { StructuredData } from "@/components/seo/StructuredData";
import { ParagliderFlight } from "@/components/creators/ParagliderFlight";
import type { TrailPlace } from "@/components/creators/PlacesTown";
import { getPublicBusinesses } from "@/lib/collabs";

export const metadata: Metadata = {
    title: `Creators | Collab with local businesses on ${siteConfig.name}`,
    description:
        `Get listed as a ${siteConfig.name} creator, then check in at local cafés, stays and experiences, redeem collabs with the staff's code and post your content. You can build quests and earn too.`,
    alternates: {
        canonical: "/creators",
    },
};

export default async function CreatorsPage() {
    // Our places, for the landing site at the end of the collab trail (none if the directory is unreachable).
    const listed = await getPublicBusinesses({ page_size: 12 });
    const places: TrailPlace[] = (listed?.items ?? []).map((b) => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        tagline: b.tagline,
        categories: b.categories,
        photo: b.logo_url ?? b.photos[0] ?? null,
        openCollabs: b.open_collab_count,
        verified: b.verified,
    }));

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
            <CreatorCollabs places={places} />
            <CreatorSteps />
            <CreatorFeatures />
            {/* takes off at the top, lands in the collab finale */}
            <ParagliderFlight />
        </div>
    );
}
