import { ArrowUpRight, Globe, Navigation, Phone, type LucideIcon } from "lucide-react";
import { OpenInAppButton } from "@/components/collabs/OpenInAppButton";
import { StoreBadges } from "@/components/collabs/StoreBadges";
import { isWebLink, SocialLinks } from "@/components/places/SocialLinks";
import { hostLabel, telHref } from "@/components/places/placeData";
import type { SocialLink } from "@/lib/collabs";

interface VisitCardProps {
  name: string;
  deepLink: string | null;
  directions: string | null;
  phone: string | null;
  website: string | null;
  socials: SocialLink[];
}

function ActionRow({
  href,
  Icon,
  title,
  detail,
  srSuffix,
  external = true,
}: {
  href: string;
  Icon: LucideIcon;
  title: string;
  detail: string;
  srSuffix?: string;
  external?: boolean;
}) {
  return (
    <li>
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer nofollow" } : {})}
        className="group flex items-center gap-3 rounded-[16px] border-2 border-black bg-white px-3 py-2.5 transition-colors hover:bg-theme-yellow focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
      >
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black bg-theme-beige group-hover:bg-white"
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-jakarta text-[15px] font-bold leading-tight text-black">{title}</span>
          <span className="block truncate text-[13px] text-black/60">{detail}</span>
        </span>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-black/50 group-hover:text-black" aria-hidden="true" />
        {srSuffix && <span className="sr-only">{srSuffix}</span>}
      </a>
    </li>
  );
}

/** The sticky "Visit with SeekKrr" card: app, stores, directions, call, website, socials. */
export function VisitCard({ name, deepLink, directions, phone, website, socials }: VisitCardProps) {
  const tel = phone ? telHref(phone) : null;
  const hasActions = !!(directions || tel || website);
  const links = socials.filter((s) => isWebLink(s.url));
  return (
    <div className="rounded-[24px] border-[3px] border-black bg-white p-5 [box-shadow:8px_8px_0_var(--color-blue-accent)] sm:p-6 xl:rounded-[32px]">
      <p className="font-handwriting text-[24px] leading-none text-black/70">Plan your visit</p>
      <h2 className="mt-1 font-jakarta text-[24px] font-extrabold leading-tight tracking-tight text-black">
        Visit with SeekKrr
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-black/70">
        Find {name} on the map, check in when you arrive and unlock offers made for travellers.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        <OpenInAppButton deepLink={deepLink ?? "seekkrr://"} size="lg" fullWidth>
          {deepLink ? "Open in SeekKrr" : "Get the SeekKrr app"}
        </OpenInAppButton>
        <StoreBadges align="center" />
      </div>

      {hasActions && (
        <ul className="mt-5 flex flex-col gap-2.5 border-t-2 border-dashed border-black/20 pt-5">
          {directions && (
            <ActionRow
              href={directions}
              Icon={Navigation}
              title="Directions"
              detail="Open in Google Maps"
              srSuffix={` to ${name} (opens in a new tab)`}
            />
          )}
          {tel && phone && (
            <ActionRow href={tel} Icon={Phone} title="Call" detail={phone} srSuffix={` ${name}`} external={false} />
          )}
          {website && (
            <ActionRow
              href={website}
              Icon={Globe}
              title="Website"
              detail={hostLabel(website)}
              srSuffix=" (opens in a new tab)"
            />
          )}
        </ul>
      )}

      {links.length > 0 && (
        <div className="mt-5 border-t-2 border-dashed border-black/20 pt-5">
          <p className="mb-3 font-jakarta text-[13px] font-bold uppercase tracking-[0.12em] text-black/50">Follow along</p>
          <SocialLinks links={links} name={name} />
        </div>
      )}
    </div>
  );
}
