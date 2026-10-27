import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BusinessCard } from "@/components/collabs/BusinessCard";
import { Reveal } from "@/components/collabs/Reveal";
import { SectionTitle } from "@/components/places/PlaceSections";
import type { PublicBusiness } from "@/lib/collabs";

interface MorePlacesProps {
  region: string | null;
  regionId: string | null;
  businesses: PublicBusiness[];
}

/** Up to three other directory places, from the same region when we know it. */
export function MorePlaces({ region, regionId, businesses }: MorePlacesProps) {
  if (businesses.length === 0) return null;
  const allHref = regionId ? `/places?region=${encodeURIComponent(regionId)}` : "/places";
  return (
    <section aria-labelledby="more-places-title" className="mt-16 sm:mt-20">
      <div className="mb-1 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <SectionTitle id="more-places-title" kicker="keep exploring" className="mb-0">
          {region ? `More places in ${region}` : "More places to explore"}
        </SectionTitle>
        <Link
          href={allHref}
          className="group inline-flex items-center gap-1.5 rounded-full pb-1 font-jakarta text-[15px] font-bold text-black underline decoration-2 underline-offset-4 hover:decoration-theme-yellow focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
        >
          {region ? `See all in ${region}` : "See all places"}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
        </Link>
      </div>
      <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6">
        {businesses.map((business, i) => (
          <Reveal as="li" key={business.id} delay={i * 0.08} y={24}>
            <BusinessCard business={business} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
