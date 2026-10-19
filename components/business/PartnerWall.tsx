import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/collabs/SafeImage";
import { VerifiedTick } from "@/components/collabs/BusinessCard";
import { getPublicBusinesses } from "@/lib/collabs";

/**
 * "Trusted by local businesses in Bir": featured partners from the public
 * directory. Renders nothing when there are none or the API is unreachable.
 */
export async function PartnerWall() {
  const result = await getPublicBusinesses({ featured: true, page_size: 12 });
  const businesses = result?.items ?? [];
  if (businesses.length === 0) return null;

  return (
    <section
      aria-labelledby="partners-title"
      className="relative w-full bg-theme-beige px-4 py-12 sm:px-6 md:px-12 lg:px-24"
    >
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2
            id="partners-title"
            className="font-handwriting text-[36px] font-bold leading-none text-black sm:text-[44px] md:text-[52px]"
          >
            Trusted by local businesses in Bir
          </h2>
          <Link
            href="/places"
            className="inline-flex items-center gap-1.5 rounded-full font-jakarta text-[15px] font-bold text-black underline decoration-theme-yellow decoration-[3px] underline-offset-4 hover:decoration-black focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
          >
            See all places <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ul
          data-lenis-prevent
          className="no-scrollbar relative -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 pt-1 sm:mx-0 sm:px-1"
        >
          {businesses.map((business) => {
            const image = business.logo_url ?? business.photos[0];
            return (
              <li key={business.id} className="w-[200px] shrink-0 snap-start sm:w-[220px]">
                <Link
                  href={`/places/${business.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[18px] border-[3px] border-black bg-white transition-all duration-300 hover:-translate-y-1 hover:[box-shadow:6px_6px_0_var(--color-yellow-accent)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <div className="relative aspect-[4/3] border-b-[3px] border-black bg-theme-yellow">
                    {image && <SafeImage src={image} alt="" sizes="220px" />}
                  </div>
                  <p className="flex items-center gap-1 px-3 py-2.5 font-jakarta text-[15px] font-bold leading-tight text-black">
                    <span className="truncate">{business.name}</span>
                    {business.verified && <VerifiedTick />}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
