import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VerifiedTick } from "@/components/collabs/BusinessCard";
import { CollabTeaserCard } from "@/components/collabs/CollabCard";
import { OpenInAppButton } from "@/components/collabs/OpenInAppButton";
import { SafeImage } from "@/components/collabs/SafeImage";
import { StoreBadges } from "@/components/collabs/StoreBadges";
import { PhotoCarousel } from "@/components/places/PhotoCarousel";
import { SocialLinks } from "@/components/places/SocialLinks";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  formatDate,
  getPublicBusiness,
  getPublicBusinessSlugs,
  getPublicCollabs,
  markerDeepLink,
  type PublicBusinessDetail,
} from "@/lib/collabs";
import { siteConfig } from "@/lib/config/site";

export const revalidate = 600;

type Params = Promise<{ slug: string }>;

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,119}$/i;

export async function generateStaticParams() {
  const slugs = await getPublicBusinessSlugs();
  return slugs.slice(0, 200).map(({ slug }) => ({ slug }));
}

async function load(slug: string) {
  if (!SLUG_RE.test(slug)) return null;
  return getPublicBusiness(slug);
}

function describe(business: PublicBusinessDetail) {
  const text =
    business.tagline ??
    business.description ??
    `${business.name}${business.region_name ? ` in ${business.region_name}` : ""} on SeekKrr.`;
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
  const title = business.region_name ? `${business.name}, ${business.region_name}` : business.name;
  const cover = business.photos[0] ?? business.logo_url ?? undefined;
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
  const url = `${siteConfig.url}/places/${business.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#business`,
    name: business.name,
    url,
    ...(business.tagline || business.description ? { description: business.description ?? business.tagline } : {}),
    ...(business.photos.length ? { image: business.photos.slice(0, 6) } : {}),
    ...(business.logo_url ? { logo: business.logo_url } : {}),
    ...(place?.address || business.region_name
      ? {
          address: {
            "@type": "PostalAddress",
            ...(place?.address ? { streetAddress: place.address } : {}),
            ...(place?.region_name || business.region_name
              ? { addressLocality: place?.region_name ?? business.region_name }
              : {}),
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
    ...(business.socials.length ? { sameAs: business.socials.map((s) => s.url) } : {}),
  };
}

export default async function PlacePage({ params }: { params: Params }) {
  const { slug } = await params;
  const business = await load(slug);
  if (!business) notFound();

  const allCollabs = await getPublicCollabs({ region_id: business.region_id });
  const collabs = allCollabs.filter(
    (c) => c.business_id === business.id || (c.business_slug && c.business_slug === business.slug)
  );
  const primaryMarker = business.places[0]?.id ?? business.marker_ids[0];
  const photos = business.photos.length ? business.photos : business.places.map((p) => p.image).filter((x): x is string => !!x);

  return (
    <div className="relative min-h-screen bg-theme-beige px-4 pb-12 pt-24 sm:px-6 sm:pt-28 md:px-12 md:pb-16 lg:px-24">
      <StructuredData
        data={[
          { name: "Home", item: "/" },
          { name: "Places", item: "/places" },
          { name: business.name, item: `/places/${business.slug}` },
        ]}
      />
      <StructuredData type="LocalBusiness" data={localBusinessJsonLd(business)} />

      <div className="mx-auto w-full max-w-[1240px]">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1 text-[14px] font-medium text-black/60">
            <li>
              <Link href="/places" className="underline-offset-4 hover:text-black hover:underline">
                Places
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-4 w-4" />
            </li>
            <li aria-current="page" className="truncate text-black">
              {business.name}
            </li>
          </ol>
        </nav>

        <header className="mb-6 flex flex-col gap-2.5">
          <div className="flex flex-wrap gap-2">
            {business.region_name && (
              <Badge variant="yellow" size="lg">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {business.region_name}
              </Badge>
            )}
            {business.open_collab_count > 0 && (
              <Badge variant="green" size="lg">
                Open for collabs
              </Badge>
            )}
          </div>
          <h1 className="flex items-start gap-2 font-jakarta text-[34px] font-extrabold leading-[1.1] tracking-tight text-theme-green [text-shadow:3px_3px_0_var(--color-yellow-accent)] sm:text-[46px] lg:text-[54px]">
            <span className="min-w-0 break-words">{business.name}</span>
            {business.verified && <VerifiedTick className="mt-2 [&_svg]:h-7 [&_svg]:w-7" />}
          </h1>
          {business.tagline && (
            <p className="font-handwriting text-[28px] leading-tight text-black sm:text-[34px]">{business.tagline}</p>
          )}
          {business.categories.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Categories">
              {business.categories.map((c) => (
                <li key={c}>
                  <Badge variant="outline">{c}</Badge>
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-10">
          <div className="flex min-w-0 flex-col gap-8">
            {photos.length > 0 && <PhotoCarousel photos={photos} name={business.name} />}

            {business.description && (
              <section aria-labelledby="about-title">
                <h2 id="about-title" className="mb-3 font-jakarta text-[24px] font-extrabold text-black">
                  About
                </h2>
                <p className="whitespace-pre-line text-[16px] leading-relaxed text-black/80 sm:text-[17px]">
                  {business.description}
                </p>
              </section>
            )}

            {collabs.length > 0 && (
              <section aria-labelledby="collabs-title">
                <h2 id="collabs-title" className="font-handwriting text-[40px] font-bold leading-none text-black sm:text-[48px]">
                  Open for collabs
                </h2>
                <p className="mb-4 mt-1.5 text-[15px] leading-relaxed text-black/70">
                  Creators: check in at {business.name} in the SeekKrr app to see the full brief and redeem.
                </p>
                <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {collabs.map((c) => (
                    <li key={c.id}>
                      <CollabTeaserCard
                        offer={c.offer}
                        mode={c.mode}
                        allowAdvanceRequests={c.allow_advance_requests}
                        slotsLeft={c.slots_left}
                        validUntil={formatDate(c.valid_until)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {business.places.length > 0 && (
              <section aria-labelledby="places-title">
                <h2 id="places-title" className="mb-4 font-jakarta text-[24px] font-extrabold text-black">
                  {business.places.length === 1 ? "Find it" : "Locations"}
                </h2>
                <ul className="flex flex-col gap-4">
                  {business.places.map((place) => {
                    const directions = place.coordinates
                      ? `https://www.google.com/maps/dir/?api=1&destination=${place.coordinates[1]},${place.coordinates[0]}`
                      : null;
                    return (
                      <li
                        key={place.id}
                        className="flex flex-col gap-4 rounded-[24px] border-[3px] border-black bg-white p-4 sm:flex-row sm:items-center sm:p-5"
                      >
                        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[16px] border-2 border-black bg-theme-yellow sm:aspect-square sm:w-24">
                          {place.image ? (
                            <SafeImage src={place.image} alt="" sizes="(max-width: 640px) 100vw, 96px" />
                          ) : (
                            <MapPin className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-jakarta text-[18px] font-bold text-black">{place.title}</h3>
                          {(place.address || place.region_name) && (
                            <p className="mt-0.5 text-[14px] text-black/65">
                              {[place.address, place.region_name].filter(Boolean).join(" · ")}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 sm:flex-col">
                          {directions && (
                            <a
                              href={directions}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-black bg-white px-4 py-2 font-jakarta text-[14px] font-bold hover:bg-theme-yellow focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
                            >
                              <Navigation className="h-4 w-4" aria-hidden="true" /> Directions
                              <span className="sr-only"> to {place.title} (Google Maps)</span>
                            </a>
                          )}
                          <OpenInAppButton deepLink={markerDeepLink(place.id)} size="sm" variant="primary">
                            Open in app
                          </OpenInAppButton>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </div>

          <aside className="flex flex-col gap-5 lg:sticky lg:top-24" aria-label={`Visit ${business.name}`}>
            <div className="rounded-[24px] border-[3px] border-black bg-white p-6 [box-shadow:8px_8px_0_var(--color-blue-accent)] xl:rounded-[32px]">
              <h2 className="font-jakarta text-[22px] font-extrabold leading-tight text-black">
                Visit with SeekKrr
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-black/70">
                See {business.name} on the map, check in when you arrive and unlock offers made for
                travellers.
              </p>
              <div className="mt-5 flex flex-col gap-4">
                {primaryMarker && (
                  <OpenInAppButton deepLink={markerDeepLink(primaryMarker)} size="lg" fullWidth>
                    Open in SeekKrr
                  </OpenInAppButton>
                )}
                <StoreBadges />
              </div>
            </div>
            {business.socials.length > 0 && (
              <div className="rounded-[24px] border-[3px] border-black bg-theme-beige p-6 xl:rounded-[32px]">
                <h2 className="mb-3 font-jakarta text-[18px] font-bold text-black">Follow along</h2>
                <SocialLinks links={business.socials} name={business.name} />
              </div>
            )}
            <p className="px-1 text-[13px] leading-relaxed text-black/55">
              Own this place?{" "}
              <Link href="/business" className="font-semibold underline underline-offset-2 hover:text-black">
                SeekKrr for Business
              </Link>{" "}
              helps you host travel creators.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
