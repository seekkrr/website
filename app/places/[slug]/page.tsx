import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FindIt } from "@/components/places/FindIt";
import { MorePlaces } from "@/components/places/MorePlaces";
import { OwnerCtaBand } from "@/components/places/OwnerCtaBand";
import { PlaceGallery } from "@/components/places/PlaceGallery";
import { PlaceBreadcrumb, PlaceHeroFallback, PlaceIdentity } from "@/components/places/PlaceHeader";
import { PlaceMobileBar } from "@/components/places/PlaceMobileBar";
import {
  PlaceAbout,
  PlaceCollabs,
  PlaceFirstVisit,
  PlaceHighlights,
  PlaceReviews,
} from "@/components/places/PlaceSections";
import { PlaceStats } from "@/components/places/PlaceStats";
import { VisitCard } from "@/components/places/VisitCard";
import {
  aggregateStats,
  categoryIcon,
  collectCategories,
  collectPhotos,
  collectTags,
  directionsUrl,
  latestReviews,
  priceRange,
} from "@/components/places/placeData";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  getPublicBusiness,
  getPublicBusinesses,
  getPublicBusinessSlugs,
  getPublicCollabs,
  markerDeepLink,
  type PublicBusiness,
  type PublicBusinessDetail,
} from "@/lib/collabs";
import { siteConfig } from "@/lib/config/site";

export const revalidate = 600;

type Params = Promise<{ slug: string }>;

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,119}$/i;
const HERO_ID = "place-hero";

export async function generateStaticParams() {
  const slugs = await getPublicBusinessSlugs();
  return slugs.slice(0, 200).map(({ slug }) => ({ slug }));
}

async function load(slug: string) {
  if (!SLUG_RE.test(slug)) return null;
  return getPublicBusiness(slug);
}

/** The business's region, falling back to its first place's region. */
function regionOf(business: PublicBusinessDetail) {
  return business.region_name ?? business.places.find((p) => p.region_name)?.region_name ?? null;
}

function describe(business: PublicBusinessDetail) {
  const region = regionOf(business);
  const text =
    business.tagline ??
    business.description ??
    business.places.find((p) => p.description)?.description ??
    `${business.name}${region ? ` in ${region}` : ""} on SeekKrr.`;
  return text.length > 160 ? `${text.slice(0, 157)}…` : text;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  let business: PublicBusinessDetail | null = null;
  try {
    business = await load(slug);
  } catch {
    return { title: "Places to explore" };
  }
  if (!business) return { title: "Place not found", robots: { index: false } };
  const region = regionOf(business);
  const title = region ? `${business.name}, ${region}` : business.name;
  const cover = collectPhotos(business)[0] ?? business.logo_url ?? undefined;
  return {
    title,
    description: describe(business),
    alternates: { canonical: `/places/${business.slug}` },
    openGraph: {
      type: "website",
      title: `${title} | ${siteConfig.name}`,
      description: describe(business),
      url: `${siteConfig.url}/places/${business.slug}`,
      ...(cover ? { images: [{ url: cover, alt: business.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description: describe(business),
      ...(cover ? { images: [cover] } : {}),
    },
  };
}

function localBusinessJsonLd(business: PublicBusinessDetail) {
  const place = business.places.find((p) => p.coordinates) ?? business.places[0];
  const main = business.places[0];
  const region = regionOf(business);
  const url = `${siteConfig.url}/places/${business.slug}`;
  const photos = collectPhotos(business);
  const stats = aggregateStats(business.places);
  const reviews = latestReviews(business.places);
  const price = main ? priceRange(main.min_expense, main.max_expense) : null;
  const description = business.description ?? business.tagline ?? main?.description ?? null;
  const phone = business.places.find((p) => p.phone)?.phone;
  const website = business.places.find((p) => p.website_url)?.website_url;
  const sameAs = [...business.socials.map((s) => s.url), ...(website ? [website] : [])];
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#business`,
    name: business.name,
    url,
    ...(description ? { description } : {}),
    ...(photos.length ? { image: photos.slice(0, 10) } : {}),
    ...(business.logo_url ? { logo: business.logo_url } : {}),
    ...(place?.address || region
      ? {
          address: {
            "@type": "PostalAddress",
            ...(place?.address ? { streetAddress: place.address } : {}),
            ...(place?.region_name || region ? { addressLocality: place?.region_name ?? region } : {}),
            addressCountry: "IN",
          },
        }
      : {}),
    ...(place?.coordinates
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: place.coordinates[1],
            longitude: place.coordinates[0],
          },
          hasMap: `https://www.google.com/maps/search/?api=1&query=${place.coordinates[1]},${place.coordinates[0]}`,
        }
      : {}),
    ...(main?.opens_at && main.closes_at ? { openingHours: `Mo-Su ${main.opens_at}-${main.closes_at}` } : {}),
    ...(price ? { priceRange: price } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(stats.rating !== null && stats.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: stats.rating,
            reviewCount: stats.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
          ...(reviews.length
            ? {
                review: reviews.map((r) => ({
                  "@type": "Review",
                  reviewBody: r.comment,
                  reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
                  author: { "@type": "Person", name: r.author ?? "SeekKrr traveller" },
                  ...(r.created_at ? { datePublished: r.created_at.slice(0, 10) } : {}),
                })),
              }
            : {}),
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** Rank directory cards: photos, then open collabs, then featured. */
function rank(list: PublicBusiness[]) {
  const score = (b: PublicBusiness) =>
    (b.photos.length > 0 || b.logo_url ? 4 : 0) + (b.open_collab_count > 0 ? 2 : 0) + (b.featured ? 1 : 0);
  return [...list].sort((a, b) => score(b) - score(a));
}

/** Up to three other places: same region when known, else anything in the directory. */
async function loadMorePlaces(business: PublicBusinessDetail, region: string | null) {
  const others = (items: PublicBusiness[] | undefined) =>
    (items ?? []).filter((b) => b.id !== business.id && b.slug !== business.slug);
  if (business.region_id) {
    const list = await getPublicBusinesses({ region_id: business.region_id, page_size: 12 });
    return rank(others(list?.items)).slice(0, 3);
  }
  const list = await getPublicBusinesses({ page_size: 60 });
  const all = others(list?.items);
  if (region) {
    const wanted = region.toLowerCase();
    return rank(all.filter((b) => b.region_name?.toLowerCase() === wanted)).slice(0, 3);
  }
  return rank(all).slice(0, 3);
}

export default async function PlacePage({ params }: { params: Params }) {
  const { slug } = await params;
  const business = await load(slug);
  if (!business) notFound();

  const places = business.places;
  const main = places[0] ?? null;
  const region = regionOf(business);

  const [allCollabs, morePlaces] = await Promise.all([
    getPublicCollabs({ region_id: business.region_id }),
    loadMorePlaces(business, region),
  ]);
  const collabs = allCollabs.filter(
    (c) => c.business_id === business.id || (c.business_slug && c.business_slug === business.slug)
  );

  const photos = collectPhotos(business);
  const categories = collectCategories(business);
  const Icon = categoryIcon([
    ...business.sub_categories,
    ...places.flatMap((p) => p.sub_categories),
    ...business.categories,
    ...places.flatMap((p) => p.categories),
  ]);
  const stats = aggregateStats(places);
  const reviews = latestReviews(places);
  const tags = collectTags(places);

  const story = business.description;
  const placeText = main?.description?.trim();
  const placeStory =
    main && placeText && placeText !== story?.trim() && placeText !== business.tagline?.trim()
      ? { title: main.title, text: placeText }
      : null;
  const thin = !story && !placeStory && tags.length === 0 && collabs.length === 0 && reviews.length === 0;

  const primaryMarker = main?.id ?? business.marker_ids[0];
  const deepLink = primaryMarker ? markerDeepLink(primaryMarker) : null;
  const directions = main ? directionsUrl(main) : null;
  const phone = places.find((p) => p.phone)?.phone ?? null;
  const website = places.find((p) => p.website_url)?.website_url ?? null;

  const identity = {
    name: business.name,
    tagline: business.tagline,
    region,
    categories,
    openForCollabs: business.open_collab_count > 0 || collabs.length > 0,
    verified: business.verified,
  };

  return (
    <div className="relative min-h-screen bg-theme-beige">
      <StructuredData
        data={[
          { name: "Home", item: "/" },
          { name: "Places", item: "/places" },
          { name: business.name, item: `/places/${business.slug}` },
        ]}
      />
      <StructuredData type="LocalBusiness" data={localBusinessJsonLd(business)} />

      <div className="px-4 pt-24 sm:px-6 sm:pt-28 md:px-10 xl:px-24">
        <div className="mx-auto w-full max-w-[1240px]">
          <PlaceBreadcrumb name={business.name} />

          <div id={HERO_ID}>
            {photos.length > 0 ? (
              <PlaceGallery photos={photos} name={main?.title ?? business.name} />
            ) : (
              <PlaceHeroFallback Icon={Icon}>
                <PlaceIdentity {...identity} tone="dark" />
              </PlaceHeroFallback>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 items-start gap-12 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_400px] xl:gap-12">
            <div className="flex min-w-0 flex-col gap-12 sm:gap-14">
              {photos.length > 0 ? (
                <div className="flex flex-col gap-6">
                  <PlaceIdentity {...identity} />
                  <PlaceStats stats={stats} />
                </div>
              ) : (
                <PlaceStats stats={stats} className="-mb-4" />
              )}
              <PlaceAbout name={business.name} story={story} placeStory={placeStory} />
              <PlaceHighlights tags={tags} />
              <PlaceCollabs name={business.name} collabs={collabs} />
              <PlaceReviews reviews={reviews} rating={stats.rating} reviewCount={stats.reviewCount} />
              {thin && <PlaceFirstVisit name={business.name} />}
              <FindIt places={places} />
            </div>

            <aside className="lg:sticky lg:top-28" aria-label={`Visit ${business.name}`}>
              <VisitCard
                name={business.name}
                deepLink={deepLink}
                directions={directions}
                phone={phone}
                website={website}
                socials={business.socials}
              />
            </aside>
          </div>

          <MorePlaces region={region} regionId={business.region_id} businesses={morePlaces} />
        </div>
      </div>

      <OwnerCtaBand />
      <PlaceMobileBar name={business.name} deepLink={deepLink} directions={directions} heroId={HERO_ID} />
    </div>
  );
}
