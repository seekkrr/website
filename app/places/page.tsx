import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { BusinessCard } from "@/components/collabs/BusinessCard";
import { SectionHeading } from "@/components/collabs/SectionHeading";
import { CtaStrip } from "@/components/business/CtaStrip";
import { PlacesFilters } from "@/components/places/PlacesFilters";
import { StructuredData } from "@/components/seo/StructuredData";
import { getPublicBusinesses, type PublicBusiness } from "@/lib/collabs";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";

export const revalidate = 600;

const PAGE_SIZE = 24;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

interface Filters {
  region?: string;
  category?: string;
  q?: string;
  page: number;
}

function first(v: string | string[] | undefined) {
  return Array.isArray(v) ? v[0] : v;
}

function parseFilters(sp: Record<string, string | string[] | undefined>): Filters {
  const region = first(sp.region)?.trim();
  const category = first(sp.category)?.trim();
  const q = first(sp.q)?.trim();
  const page = Number.parseInt(first(sp.page) ?? "1", 10);
  return {
    region: region && /^[a-f0-9]{24}$/i.test(region) ? region : undefined,
    category: category ? category.slice(0, 50) : undefined,
    q: q ? q.slice(0, 100) : undefined,
    page: Number.isFinite(page) && page > 0 ? Math.min(page, 500) : 1,
  };
}

function hrefFor(filters: Filters, overrides: Partial<Filters> = {}) {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();
  if (next.q) params.set("q", next.q);
  if (next.region) params.set("region", next.region);
  if (next.category) params.set("category", next.category);
  if (next.page > 1) params.set("page", String(next.page));
  const s = params.toString();
  return s ? `/places?${s}` : "/places";
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const canonicalParams = new URLSearchParams();
  if (filters.region) canonicalParams.set("region", filters.region);
  if (filters.category) canonicalParams.set("category", filters.category);
  const canonical = canonicalParams.toString() ? `/places?${canonicalParams}` : "/places";
  return {
    title: filters.category
      ? `${filters.category} on SeekKrr | Places to explore`
      : "Places to explore | Cafés, stays & adventures on SeekKrr",
    description:
      "Discover verified cafés, stays and adventures in Bir and beyond on SeekKrr. Spot places open for creator collabs and open them straight in the app.",
    alternates: { canonical },
    // Free-text search result pages shouldn't be indexed; region/category views can be.
    robots: filters.q ? { index: false, follow: true } : undefined,
  };
}

function facets(businesses: PublicBusiness[], filters: Filters, current: PublicBusiness[]) {
  const regions = new Map<string, string>();
  const categories = new Set<string>();
  for (const b of [...businesses, ...current]) {
    if (b.region_id && b.region_name) regions.set(b.region_id, b.region_name);
    b.categories.forEach((c) => categories.add(c));
  }
  if (filters.category) categories.add(filters.category);
  return {
    regions: [...regions.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    categories: [...categories].sort((a, b) => a.localeCompare(b)).map((c) => ({ value: c, label: c })),
  };
}

export default async function PlacesPage({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseFilters(await searchParams);
  const filtered = !!(filters.region || filters.category || filters.q);

  const [list, facetSource, featured] = await Promise.all([
    getPublicBusinesses({
      region_id: filters.region,
      category: filters.category,
      q: filters.q,
      page: filters.page,
      page_size: PAGE_SIZE,
    }),
    getPublicBusinesses({ page_size: 60 }),
    filtered || filters.page > 1 ? Promise.resolve(null) : getPublicBusinesses({ featured: true, page_size: 6 }),
  ]);

  const businesses = list?.items ?? [];
  const featuredItems = (featured?.items ?? []).slice(0, 3);
  // Don't repeat the featured band in the grid below it (unless that would empty the grid).
  const featuredIds = new Set(featuredItems.map((b) => b.id));
  const gridItems = businesses.some((b) => !featuredIds.has(b.id))
    ? businesses.filter((b) => !featuredIds.has(b.id))
    : businesses;
  const { regions, categories } = facets(facetSource?.items ?? [], filters, businesses);
  const regionName = filters.region ? regions.find((r) => r.value === filters.region)?.label : undefined;
  const totalPages = list?.total_pages ?? 1;

  return (
    <div className="relative min-h-screen bg-theme-beige">
      <StructuredData
        data={[
          { name: "Home", item: "/" },
          { name: "Places", item: "/places" },
        ]}
      />
      {businesses.length > 0 && (
        <StructuredData
          type="ItemList"
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: businesses.map((b, i) => ({
              "@type": "ListItem",
              position: (filters.page - 1) * PAGE_SIZE + i + 1,
              url: `${siteConfig.url}/places/${b.slug}`,
              name: b.name,
            })),
          }}
        />
      )}

      <section className="relative w-full px-4 pb-10 pt-32 sm:px-6 md:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <SectionHeading
            as="h1"
            eyebrow="Local favourites on SeekKrr"
            title="Places to explore"
            intro="Cafés, stays and adventures in Bir and beyond, every one verified by SeekKrr. A green badge means the place is open for creator collabs."
            stars
          />

          {featuredItems.length > 0 && (
            <div className="mb-12 rounded-[24px] border-[3px] border-black bg-theme-yellow p-5 [box-shadow:8px_8px_0_#000] sm:p-8 xl:rounded-[32px]">
              <h2 className="mb-6 font-handwriting text-[36px] font-bold leading-none text-black sm:text-[44px]">
                Featured this month
              </h2>
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredItems.map((business, i) => (
                  <li key={business.id}>
                    <BusinessCard business={business} priority={i === 0} />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <PlacesFilters
            key={`${filters.q ?? ""}|${filters.region ?? ""}|${filters.category ?? ""}`}
            regions={regions}
            categories={categories}
            current={filters}
          />

          {filtered && (
            <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
              {filters.q && <FilterChip label={`“${filters.q}”`} href={hrefFor(filters, { q: undefined, page: 1 })} />}
              {filters.region && (
                <FilterChip label={regionName ?? "Selected region"} href={hrefFor(filters, { region: undefined, page: 1 })} />
              )}
              {filters.category && (
                <FilterChip label={filters.category} href={hrefFor(filters, { category: undefined, page: 1 })} />
              )}
              <Link href="/places" className="px-2 text-[14px] font-semibold text-black/70 underline underline-offset-4 hover:text-black">
                Clear all
              </Link>
            </div>
          )}

          <div className="mt-8">
            {list === null ? (
              <EmptyState
                title="The directory is taking a breather"
                body="We couldn't load places from SeekKrr just now. Check back in a few minutes, or open the app to explore the map."
                showClear={false}
              />
            ) : businesses.length === 0 ? (
              <EmptyState
                title={filtered ? "No places match those filters yet" : "Places are on their way"}
                body={
                  filtered
                    ? "Try another region or category. Or, if you run a place that belongs here, list it."
                    : "We're verifying the first businesses in Bir right now. Run a café, stay or adventure? Be one of the first."
                }
                showClear={filtered}
              />
            ) : (
              <>
                <p className="mb-5 font-jakarta text-[15px] font-semibold text-black/70" aria-live="polite">
                  {list.total} {list.total === 1 ? "place" : "places"}
                  {regionName ? ` in ${regionName}` : ""}
                </p>
                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                  {gridItems.map((business, i) => (
                    <li key={business.id}>
                      <BusinessCard business={business} priority={i < 3 && featuredItems.length === 0} />
                    </li>
                  ))}
                </ul>
                {totalPages > 1 && (
                  <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-3">
                    <PageLink
                      href={hrefFor(filters, { page: filters.page - 1 })}
                      disabled={filters.page <= 1}
                      rel="prev"
                      label="Previous"
                      icon="prev"
                    />
                    <span className="font-jakarta text-[15px] font-bold">
                      Page {filters.page} of {totalPages}
                    </span>
                    <PageLink
                      href={hrefFor(filters, { page: filters.page + 1 })}
                      disabled={filters.page >= totalPages}
                      rel="next"
                      label="More places"
                      icon="next"
                    />
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <CtaStrip title="Run a place travellers love?" />
    </div>
  );
}

function FilterChip({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-white px-3 py-1.5 font-jakarta text-[13px] font-bold text-black hover:bg-theme-yellow focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
    >
      {label}
      <X className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">(remove filter)</span>
    </Link>
  );
}

function PageLink({
  href,
  disabled,
  rel,
  label,
  icon,
}: {
  href: string;
  disabled: boolean;
  rel: "prev" | "next";
  label: string;
  icon: "prev" | "next";
}) {
  const content = (
    <>
      {icon === "prev" && <ArrowLeft className="h-4 w-4" aria-hidden="true" />}
      {label}
      {icon === "next" && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
    </>
  );
  if (disabled) {
    return (
      <span aria-disabled="true" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none opacity-40")}>
        {content}
      </span>
    );
  }
  return (
    <Link href={href} rel={rel} className={buttonVariants({ variant: "outline", size: "sm" })}>
      {content}
    </Link>
  );
}

function EmptyState({ title, body, showClear }: { title: string; body: string; showClear: boolean }) {
  return (
    <div className="mx-auto max-w-[640px] rounded-[24px] border-[3px] border-black bg-white px-6 py-10 text-center shadow-[8px_8px_0_var(--color-orange-accent)] sm:px-10">
      <h2 className="font-jakarta text-[24px] font-extrabold tracking-tight text-black sm:text-[28px]">{title}</h2>
      <p className="mx-auto mt-3 max-w-[480px] text-[16px] leading-relaxed text-black/75">{body}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/business/apply" className={buttonVariants({ variant: "primary" })}>
          List your business
        </Link>
        {showClear && (
          <Link href="/places" className={buttonVariants({ variant: "outline" })}>
            Clear filters
          </Link>
        )}
      </div>
    </div>
  );
}
