// ─── Business page helpers ─────────────────────────────────────────────────
// Pure formatting / aggregation used by /places/[slug] and its components.
// Safe to import from server and client components.
// ────────────────────────────────────────────────────────────────────────────

import {
  BedDouble,
  Bike,
  Coffee,
  Compass,
  Landmark,
  Mountain,
  ShoppingBag,
  Tent,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { BusinessPlace, PlaceReview, PublicBusinessDetail } from "@/lib/collabs";

const isHttps = (url: string) => /^https:\/\//i.test(url);

/** Place photos first (cover first), then business photos; https only, de-duplicated. */
export function collectPhotos(business: PublicBusinessDetail): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (url: string | null | undefined) => {
    if (!url || !isHttps(url) || seen.has(url)) return;
    seen.add(url);
    out.push(url);
  };
  for (const place of business.places) {
    add(place.image);
    place.photos.forEach(add);
  }
  business.photos.forEach(add);
  return out;
}

/** "09:30" -> "9:30 AM", "21:00" -> "9:00 PM", "00:00" / "24:00" -> "12:00 AM". */
export function formatClock(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const hour = h % 24;
  const suffix = hour < 12 ? "AM" : "PM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Opening hours line, e.g. "9:30 AM – 9:00 PM"; null when neither time is known. */
export function formatHours(opens: string | null, closes: string | null): string | null {
  if (opens && closes) return `${formatClock(opens)} – ${formatClock(closes)}`;
  if (opens) return `From ${formatClock(opens)}`;
  if (closes) return `Until ${formatClock(closes)}`;
  return null;
}

const amount = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** "₹200–600 per person", "From ₹200", "Up to ₹600", or null. */
export function formatSpend(min: number | null, max: number | null): string | null {
  if (min && max && max > min) return `₹${amount.format(min)}–${amount.format(max)} per person`;
  if (min && max && max === min) return `About ₹${amount.format(min)} per person`;
  if (min) return `From ₹${amount.format(min)} per person`;
  if (max) return `Up to ₹${amount.format(max)} per person`;
  return null;
}

/** schema.org priceRange, e.g. "₹200–₹600". */
export function priceRange(min: number | null, max: number | null): string | null {
  if (min && max && max > min) return `₹${amount.format(min)}–₹${amount.format(max)}`;
  if (min || max) return `₹${amount.format((min || max) as number)}`;
  return null;
}

/** Google Maps directions (coordinates preferred, else the address). */
export function directionsUrl(place: Pick<BusinessPlace, "coordinates" | "address" | "region_name" | "title">) {
  if (place.coordinates) {
    const [lng, lat] = place.coordinates;
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  const query = [place.title, place.address, place.region_name].filter(Boolean).join(", ");
  return place.address ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}` : null;
}

/** "32.0367° N, 76.7119° E" */
export function formatCoordinates([lng, lat]: [number, number]) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${ns}, ${Math.abs(lng).toFixed(4)}° ${ew}`;
}

/** tel: href from a display number ("+91 98765 43210" -> "tel:+919876543210"). */
export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.replace(/\D/g, "").length >= 6 ? `tel:${digits}` : null;
}

export function hostLabel(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** "Sep 2026" */
export function monthYear(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

export interface PlaceStats {
  rating: number | null;
  reviewCount: number;
  checkins: number;
  likes: number;
  hours: string | null;
  spend: string | null;
}

/** Totals across all of a business's places; hours and spend come from the main place. */
export function aggregateStats(places: BusinessPlace[]): PlaceStats {
  const reviewCount = places.reduce((n, p) => n + p.review_count, 0);
  const weighted = places.reduce((n, p) => n + p.rating * p.review_count, 0);
  const main = places[0];
  return {
    rating: reviewCount > 0 ? Math.round((weighted / reviewCount) * 10) / 10 : null,
    reviewCount,
    checkins: places.reduce((n, p) => n + p.checkins_count, 0),
    likes: places.reduce((n, p) => n + p.likes_count, 0),
    hours: main ? formatHours(main.opens_at, main.closes_at) : null,
    spend: main ? formatSpend(main.min_expense, main.max_expense) : null,
  };
}

/** Latest reviews across places, newest first. */
export function latestReviews(places: BusinessPlace[], limit = 3): PlaceReview[] {
  return places
    .flatMap((p) => p.reviews)
    .sort((a, b) => (Date.parse(b.created_at ?? "") || 0) - (Date.parse(a.created_at ?? "") || 0))
    .slice(0, limit);
}

/** Hashtag-style highlights from place tags (case-insensitive de-dupe). */
export function collectTags(places: BusinessPlace[], limit = 16): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of places.flatMap((p) => p.tags)) {
    const clean = tag.trim().replace(/^#+/, "").replace(/\s+/g, " ").toLowerCase();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    out.push(clean);
  }
  return out.slice(0, limit);
}

/** Categories then sub-categories (business first, then its places), de-duplicated. */
export function collectCategories(business: PublicBusinessDetail): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const all = [
    ...business.categories,
    ...business.sub_categories,
    ...business.places.flatMap((p) => [...p.categories, ...p.sub_categories]),
  ];
  for (const c of all) {
    const key = c.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(c.trim());
  }
  return out.slice(0, 6);
}

const ICONS: [RegExp, LucideIcon][] = [
  [/caf|coffee|bakery|tea/i, Coffee],
  [/food|restaurant|dhaba|kitchen|eat/i, UtensilsCrossed],
  [/stay|hostel|homestay|hotel|lodg|guest/i, BedDouble],
  [/camp/i, Tent],
  [/trek|hike|adventure|paraglid|experience|workshop/i, Mountain],
  [/shop|store|market/i, ShoppingBag],
  [/rental|bike|scooter/i, Bike],
  [/spot|monaster|temple|spiritual|heritage|museum|landmark/i, Landmark],
];

/** A representative icon for the business's main category. */
export function categoryIcon(categories: string[]): LucideIcon {
  for (const c of categories) {
    const hit = ICONS.find(([re]) => re.test(c));
    if (hit) return hit[1];
  }
  return Compass;
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n.toLocaleString("en-IN")} ${n === 1 ? one : many}`;
}
