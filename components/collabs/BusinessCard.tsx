import Link from "next/link";
import { BadgeCheck, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { SafeImage } from "@/components/collabs/SafeImage";
import type { PublicBusiness } from "@/lib/collabs";
import { cn } from "@/lib/utils";

export function VerifiedTick({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex shrink-0 items-center", className)}>
      <BadgeCheck className="h-5 w-5 fill-theme-blue text-white" aria-hidden="true" />
      <span className="sr-only">Verified business</span>
    </span>
  );
}

function Initials({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-theme-yellow">
      <span className="font-handwriting text-[64px] font-bold text-theme-green [text-shadow:3px_3px_0_#fff]">
        {initials || "S"}
      </span>
    </div>
  );
}

interface BusinessCardProps {
  business: PublicBusiness;
  priority?: boolean;
  className?: string;
}

/** Directory card: photo, name, region chip, categories, collab badge, verified tick. */
export function BusinessCard({ business, priority, className }: BusinessCardProps) {
  const cover = business.photos[0] ?? business.logo_url;
  return (
    <Link
      href={`/places/${business.slug}`}
      className={cn(
        "group block h-full rounded-[24px] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue focus-visible:ring-offset-4 focus-visible:ring-offset-theme-beige",
        className
      )}
    >
      <article className="flex h-full flex-col overflow-hidden rounded-[24px] border-[3px] border-black bg-white transition-all duration-300 group-hover:-translate-y-1 group-hover:[box-shadow:8px_8px_0_var(--color-yellow-accent)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <div className="relative aspect-[4/3] overflow-hidden border-b-[3px] border-black bg-theme-yellow">
          {cover ? (
            <SafeImage
              src={cover}
              alt={`${business.name}${business.region_name ? `, ${business.region_name}` : ""}`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <Initials name={business.name} />
          )}
          {business.open_collab_count > 0 && (
            <Badge variant="green" className="absolute left-3 top-3 shadow-[2px_2px_0_#000]">
              Open for collabs
            </Badge>
          )}
          {business.featured && (
            <Badge variant="yellow" className="absolute right-3 top-3">
              Featured
            </Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
          <h3 className="flex items-start gap-1.5 font-jakarta text-[18px] font-bold leading-tight text-black">
            <span className="min-w-0 break-words">{business.name}</span>
            {business.verified && <VerifiedTick className="mt-px" />}
          </h3>
          {business.tagline && (
            <p className="line-clamp-2 text-[14px] leading-snug text-black/70">{business.tagline}</p>
          )}
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {business.region_name && (
              <Badge variant="yellow" size="sm">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {business.region_name}
              </Badge>
            )}
            {business.categories.slice(0, 3).map((category) => (
              <Badge key={category} variant="outline" size="sm">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
