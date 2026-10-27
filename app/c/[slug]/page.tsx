import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BadgeCheck, Languages, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";
import { SafeImage } from "@/components/collabs/SafeImage";
import { StructuredData } from "@/components/seo/StructuredData";
import { formatDate, getCreatorPortfolio, type CreatorPortfolio } from "@/lib/collabs";
import { siteConfig, siteFeatures } from "@/lib/config/site";

export const revalidate = 600;

type Params = Promise<{ slug: string }>;

const SLUG_RE = /^[a-z0-9][a-z0-9_-]{0,119}$/i;

export function generateStaticParams() {
  // Portfolios are opt-in and change often; render each on first visit, then cache.
  return [];
}

async function load(slug: string) {
  if (!SLUG_RE.test(slug)) return null;
  return getCreatorPortfolio(slug);
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  x: "X",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  website: "Website",
};

function handleUrl(platform: string, handle: string): string | null {
  const h = encodeURIComponent(handle.trim().replace(/^@/, ""));
  if (!h) return null;
  switch (platform) {
    case "instagram":
      return `https://www.instagram.com/${h}`;
    case "youtube":
      return `https://www.youtube.com/@${h}`;
    case "x":
      return `https://x.com/${h}`;
    case "facebook":
      return `https://www.facebook.com/${h}`;
    case "linkedin":
      return `https://www.linkedin.com/in/${h}`;
    case "website":
      return /^https:\/\//i.test(handle) ? handle : null;
    default:
      return null;
  }
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "S"
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  let creator: CreatorPortfolio | null = null;
  try {
    creator = await load(slug);
  } catch {
    return { title: "Creator on SeekKrr" };
  }
  if (!creator) return { title: "Creator not found", robots: { index: false } };
  const description =
    creator.bio?.slice(0, 157) ??
    `${creator.display_name} is a travel creator on ${siteConfig.name}${
      creator.travel_styles.length ? ` sharing ${creator.travel_styles.join(", ").toLowerCase()} travel` : ""
    }.`;
  return {
    title: `${creator.display_name} | Creator on ${siteConfig.name}`,
    description,
    alternates: { canonical: `/c/${creator.slug}` },
    openGraph: {
      type: "profile",
      title: `${creator.display_name} | Creator on ${siteConfig.name}`,
      description,
      url: `${siteConfig.url}/c/${creator.slug}`,
      ...(creator.avatar_url ? { images: [{ url: creator.avatar_url, alt: creator.display_name }] } : {}),
    },
  };
}

export default async function CreatorPage({ params }: { params: Params }) {
  const { slug } = await params;
  const creator = await load(slug);
  if (!creator) notFound();

  const verified = creator.tier === "verified";
  const handles = creator.socials
    .map((s) => ({ ...s, url: handleUrl(s.platform, s.handle) }))
    .filter((s): s is typeof s & { url: string } => !!s.url);
  const rating = creator.stats.avg_rating;

  return (
    <div className="relative min-h-screen bg-theme-beige px-4 pb-20 pt-32 sm:px-6 md:px-12 lg:px-24">
      <StructuredData
        type="ProfilePage"
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: `${siteConfig.url}/c/${creator.slug}`,
          mainEntity: {
            "@type": "Person",
            name: creator.display_name,
            ...(creator.bio ? { description: creator.bio } : {}),
            ...(creator.avatar_url ? { image: creator.avatar_url } : {}),
            ...(handles.length ? { sameAs: handles.map((h) => h.url) } : {}),
          },
        }}
      />

      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8">
        <header className="rounded-[24px] border-[3px] border-black bg-white p-6 [box-shadow:8px_8px_0_var(--color-yellow-accent)] sm:p-8 xl:rounded-[32px]">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-[3px] border-black bg-theme-orange sm:h-28 sm:w-28">
              {creator.avatar_url ? (
                <SafeImage src={creator.avatar_url} alt={creator.display_name} sizes="112px" priority />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center font-jakarta text-[32px] font-extrabold text-white">
                  {initials(creator.display_name)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Badge variant={verified ? "blue" : "outline"} size="md" className="mb-2">
                {verified && <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />}
                {verified ? "Verified creator" : "Community creator"}
              </Badge>
              <h1 className="break-words font-jakarta text-[32px] font-extrabold leading-tight tracking-tight text-theme-green [text-shadow:3px_3px_0_var(--color-yellow-accent)] sm:text-[42px]">
                {creator.display_name}
              </h1>
              {creator.languages.length > 0 && (
                <p className="mt-1 flex items-center gap-1.5 text-[14px] text-black/60">
                  <Languages className="h-4 w-4" aria-hidden="true" />
                  Speaks {creator.languages.join(", ")}
                </p>
              )}
            </div>
          </div>
          {creator.bio && (
            <p className="mt-6 whitespace-pre-line text-[16px] leading-relaxed text-black/80 sm:text-[17px]">
              {creator.bio}
            </p>
          )}
          {(creator.travel_styles.length > 0 || creator.niches.length > 0) && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Travel styles and niches">
              {creator.travel_styles.map((s) => (
                <li key={`style-${s}`}>
                  <Badge variant="yellow">{s}</Badge>
                </li>
              ))}
              {creator.niches.map((n) => (
                <li key={`niche-${n}`}>
                  <Badge variant="outline">{n}</Badge>
                </li>
              ))}
            </ul>
          )}
        </header>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border-[3px] border-black bg-theme-blue p-5">
            <dt className="font-jakarta text-[14px] font-bold text-black/75">Collabs completed</dt>
            <dd className="font-jakarta text-[36px] font-extrabold leading-tight text-black">
              {creator.stats.completed}
            </dd>
          </div>
          <div className="rounded-[24px] border-[3px] border-black bg-theme-yellow p-5">
            <dt className="font-jakarta text-[14px] font-bold text-black/75">Rating from businesses</dt>
            <dd className="flex flex-wrap items-baseline gap-x-2 font-jakarta text-[36px] font-extrabold leading-tight text-black">
              {rating !== null && creator.stats.rating_count > 0 ? (
                <>
                  <Star className="h-7 w-7 self-center fill-black" aria-hidden="true" />
                  {rating.toFixed(1)}
                  <span className="text-[15px] font-bold text-black/65">
                    from {creator.stats.rating_count} {creator.stats.rating_count === 1 ? "rating" : "ratings"}
                  </span>
                </>
              ) : (
                <span className="text-[20px] font-bold text-black/70">No ratings yet</span>
              )}
            </dd>
          </div>
        </dl>

        {handles.length > 0 && (
          <section aria-labelledby="handles-title">
            <h2 id="handles-title" className="mb-4 font-jakarta text-[22px] font-extrabold text-black">
              Verified handles
            </h2>
            <ul className="flex flex-wrap gap-3">
              {handles.map((h) => (
                <li key={`${h.platform}-${h.handle}`} className="max-w-full">
                  <a
                    href={h.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex max-w-full items-center gap-2 rounded-full border-[3px] border-black bg-white px-4 py-2 font-jakarta text-[15px] font-bold text-black transition-colors hover:bg-theme-yellow focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
                  >
                    <BadgeCheck className="h-4 w-4 shrink-0 fill-theme-blue text-white" aria-hidden="true" />
                    <span className="text-black/60">{PLATFORM_LABELS[h.platform] ?? h.platform}</span>
                    <span className="truncate">
                      {h.platform === "website" ? hostOf(h.handle) : `@${h.handle.replace(/^@/, "")}`}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[13px] text-black/55">
              Ownership confirmed by SeekKrr with a code in the profile bio.
            </p>
          </section>
        )}

        {creator.portfolio.length > 0 && (
          <section aria-labelledby="portfolio-title">
            <h2 id="portfolio-title" className="mb-4 font-jakarta text-[22px] font-extrabold text-black">
              Portfolio
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {creator.portfolio.map((item) => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="group flex h-full items-start justify-between gap-3 rounded-[20px] border-[3px] border-black bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:[box-shadow:6px_6px_0_var(--color-orange-accent)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  >
                    <span className="min-w-0">
                      <span className="block break-words font-jakarta text-[16px] font-bold text-black">
                        {item.caption ?? hostOf(item.url)}
                      </span>
                      <span className="block truncate text-[13px] text-black/55">{hostOf(item.url)}</span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {creator.collab_history.length > 0 && (
          <section aria-labelledby="history-title">
            <h2 id="history-title" className="mb-4 font-jakarta text-[22px] font-extrabold text-black">
              Collab history
            </h2>
            <ul className="divide-y-2 divide-dashed divide-black/15 rounded-[24px] border-[3px] border-black bg-white px-5">
              {creator.collab_history.map((h, i) => {
                const completed = formatDate(h.completed_at);
                return (
                  <li key={`${h.business_name}-${i}`} className="flex flex-wrap items-center justify-between gap-2 py-4">
                    {h.business_slug ? (
                      <Link
                        href={`/places/${h.business_slug}`}
                        className="font-jakarta text-[16px] font-bold text-black underline decoration-theme-yellow decoration-[3px] underline-offset-4 hover:decoration-black"
                      >
                        {h.business_name}
                      </Link>
                    ) : (
                      <span className="font-jakarta text-[16px] font-bold text-black">{h.business_name}</span>
                    )}
                    {completed && <span className="text-[14px] text-black/55">Completed {completed}</span>}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className="flex flex-col items-start gap-4 rounded-[24px] border-[3px] border-black bg-theme-green p-6 text-theme-beige sm:flex-row sm:items-center sm:justify-between sm:p-8 xl:rounded-[32px]">
          <p className="max-w-[520px] text-[16px] leading-relaxed">
            <span className="font-jakarta font-bold">Run a café, stay or adventure?</span>{" "}
            {siteFeatures.matchmaking ? (
              <>
                Businesses on SeekKrr{siteFeatures.plans ? " Pro" : ""} can find and invite creators like{" "}
                {creator.display_name} with AI creator matching.
              </>
            ) : (
              <>
                Post a UGC brief on SeekKrr and creators like {creator.display_name} can check in and make content
                for your place.
              </>
            )}
          </p>
          <Link href="/business" className={buttonVariants({ variant: "light", size: "md" })}>
            SeekKrr for Business
          </Link>
        </div>
      </div>
    </div>
  );
}
