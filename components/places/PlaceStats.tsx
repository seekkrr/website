import { Clock, Heart, MapPinCheck, Star, Wallet, type LucideIcon } from "lucide-react";
import { plural, type PlaceStats as Stats } from "@/components/places/placeData";
import { cn } from "@/lib/utils";

interface StatItem {
  key: string;
  Icon: LucideIcon;
  /** Icon disc colour. */
  tone: string;
  value: string;
  label?: string;
}

function items(stats: Stats): StatItem[] {
  const out: StatItem[] = [];
  if (stats.rating !== null && stats.reviewCount > 0) {
    out.push({
      key: "rating",
      Icon: Star,
      tone: "bg-theme-yellow text-black [&_svg]:fill-black",
      value: stats.rating.toFixed(1),
      label: plural(stats.reviewCount, "review"),
    });
  }
  if (stats.checkins > 0) {
    out.push({
      key: "checkins",
      Icon: MapPinCheck,
      tone: "bg-theme-green text-theme-beige",
      value: plural(stats.checkins, "check-in"),
      label: "on SeekKrr",
    });
  }
  if (stats.likes > 0) {
    out.push({
      key: "likes",
      Icon: Heart,
      tone: "bg-theme-orange text-white [&_svg]:fill-white",
      value: plural(stats.likes, "like"),
    });
  }
  if (stats.spend) {
    out.push({ key: "spend", Icon: Wallet, tone: "bg-theme-blue text-white", value: stats.spend });
  }
  if (stats.hours) {
    out.push({ key: "hours", Icon: Clock, tone: "bg-white text-black", value: "Open today", label: stats.hours });
  }
  return out;
}

/** Trust badges: only the numbers we actually have. */
export function PlaceStats({ stats, className }: { stats: Stats; className?: string }) {
  const list = items(stats);
  if (list.length === 0) return null;
  return (
    // Phones: a 2-up grid of compact tiles; from sm up: a row of pill badges.
    <ul className={cn("grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:gap-3", className)} aria-label="At a glance">
      {list.map(({ key, Icon, tone, value, label }) => (
        <li
          key={key}
          className="flex min-h-[48px] min-w-0 items-center gap-2.5 rounded-[18px] border-[3px] border-black bg-white py-2 pl-2 pr-3 [box-shadow:3px_3px_0_#000] sm:inline-flex sm:rounded-full sm:py-1.5 sm:pl-1.5 sm:pr-4"
        >
          <span
            aria-hidden="true"
            className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-black", tone)}
          >
            <Icon className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="flex min-w-0 flex-col font-jakarta text-[14px] leading-tight text-black sm:block sm:text-[15px]">
            <strong className="font-extrabold">{value}</strong>
            {key === "rating" && <span className="sr-only"> out of 5 stars,</span>}
            {label && (
              <>
                <span aria-hidden="true" className="hidden sm:inline">
                  {key === "rating" ? " · " : " "}
                </span>
                <span className="text-[13px] font-semibold text-black/65 sm:text-[15px]">{label}</span>
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
