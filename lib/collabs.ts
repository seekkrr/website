// ─── Collabs API (website) ─────────────────────────────────────────────────
// Typed wrappers for the public SeekKrr for Business / Collabs endpoints.
// Server fetchers never let an unreachable API break the build: list-style
// calls fall back to empty data or static defaults; detail calls return null
// on 404 and throw on other failures (so ISR keeps serving the last good page).
// ────────────────────────────────────────────────────────────────────────────

import { ApiError, request } from "@/lib/api";

const DEFAULT_TIMEOUT_MS = 8_000;

// ── Types ──────────────────────────────────────────────────────────────────

export type PlanCode = "free" | "growth" | "pro" | "multi_location";

export interface PlanEntitlements {
  active_collabs: number | null;
  redemptions_per_month: number | null;
  approval_mode: boolean;
  team_members: number | null;
  match_reveals_per_month: number | null;
  invites_per_month: number | null;
  match_breakdown: boolean;
  attribution: boolean;
  content_library: boolean;
  featured: boolean;
  locations: number | null;
}

export interface Plan {
  code: string;
  name: string;
  custom: boolean;
  price_monthly_inr: number | null;
  price_annual_inr: number | null;
  price_monthly_inr_incl_gst: number | null;
  price_annual_inr_incl_gst: number | null;
  gst_rate: number;
  trial_days: number;
  entitlements: PlanEntitlements;
}

export interface SocialLink {
  platform?: string | null;
  url: string;
}

export interface PublicBusiness {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  categories: string[];
  region_id: string | null;
  region_name: string | null;
  socials: SocialLink[];
  photos: string[];
  logo_url: string | null;
  verified: boolean;
  featured: boolean;
  marker_ids: string[];
  open_collab_count: number;
}

export interface BusinessPlace {
  id: string;
  title: string;
  address: string | null;
  /** GeoJSON order: [lng, lat] */
  coordinates: [number, number] | null;
  categories: string[];
  region_name: string | null;
  image: string | null;
}

export interface PublicBusinessDetail extends PublicBusiness {
  places: BusinessPlace[];
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PublicCollab {
  id: string;
  business_id: string;
  marker_id: string;
  offer: string;
  mode: "open" | "approval";
  allow_advance_requests: boolean;
  slots_left: number | null;
  valid_until: string | null;
  created_at: string | null;
  business_name: string | null;
  business_slug: string | null;
}

export interface ClaimPreview {
  business: {
    name: string;
    tagline: string | null;
    photos: string[];
    logo_url: string | null;
    region_name: string | null;
    categories: string[];
  };
  already_claimed: boolean;
  requires_phone_verification: boolean;
  phone_hint: string | null;
  expires_at: string | null;
}

export interface CreatorPortfolio {
  slug: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  travel_styles: string[];
  niches: string[];
  languages: string[];
  portfolio: { url: string; caption: string | null }[];
  tier: "community" | "verified" | string;
  socials: { platform: string; handle: string }[];
  stats: { completed: number; avg_rating: number | null; rating_count: number };
  collab_history: {
    business_name: string;
    business_slug: string | null;
    completed_at: string | null;
  }[];
}

export interface MarkerSearchResult {
  id: string;
  title: string;
  address: string | null;
  region_id: string | null;
  region_name: string | null;
  categories: string[];
  image: string | null;
}

export interface BusinessApplicationPayload {
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  claimed_marker_id?: string | null;
  maps_url?: string | null;
  region_id?: string | null;
  categories: string[];
  social_links: string[];
  requested_plan?: PlanCode | null;
  gstin?: string | null;
  message?: string | null;
  source: "website";
}

export interface BusinessApplicationResult {
  application: {
    id: string;
    business_name: string;
    status: string;
    applied_at: string;
  };
}

export interface TrackingClickResult {
  marker_id: string;
  business_id: string;
  deep_link: string;
  web_url: string;
}

// ── Static plan fallback (mirrors backend DEFAULT_PLANS) ──────────────────

const GST_RATE = 0.18;
const withGst = (v: number | null) =>
  v === null ? null : Math.round(v * (1 + GST_RATE));

function plan(
  code: PlanCode,
  name: string,
  monthly: number | null,
  annual: number | null,
  trialDays: number,
  entitlements: PlanEntitlements,
  custom = false
): Plan {
  return {
    code,
    name,
    custom,
    price_monthly_inr: monthly,
    price_annual_inr: annual,
    price_monthly_inr_incl_gst: withGst(monthly),
    price_annual_inr_incl_gst: withGst(annual),
    gst_rate: GST_RATE,
    trial_days: trialDays,
    entitlements,
  };
}

export const FALLBACK_PLANS: Plan[] = [
  plan("free", "Free", 0, 0, 0, {
    active_collabs: 1,
    redemptions_per_month: 5,
    approval_mode: false,
    team_members: 1,
    match_reveals_per_month: 3,
    invites_per_month: 0,
    match_breakdown: false,
    attribution: false,
    content_library: false,
    featured: false,
    locations: 1,
  }),
  plan("growth", "Growth", 1499, 14990, 14, {
    active_collabs: 3,
    redemptions_per_month: 30,
    approval_mode: true,
    team_members: 3,
    match_reveals_per_month: 25,
    invites_per_month: 10,
    match_breakdown: true,
    attribution: true,
    content_library: true,
    featured: false,
    locations: 1,
  }),
  plan("pro", "Pro", 3999, 39990, 0, {
    active_collabs: 10,
    redemptions_per_month: null,
    approval_mode: true,
    team_members: 10,
    match_reveals_per_month: 100,
    invites_per_month: 50,
    match_breakdown: true,
    attribution: true,
    content_library: true,
    featured: true,
    locations: 3,
  }),
  plan(
    "multi_location",
    "Multi-location",
    null,
    null,
    0,
    {
      active_collabs: null,
      redemptions_per_month: null,
      approval_mode: true,
      team_members: null,
      match_reveals_per_month: null,
      invites_per_month: null,
      match_breakdown: true,
      attribution: true,
      content_library: true,
      featured: true,
      locations: null,
    },
    true
  ),
];

// ── Normalisers (the API is new; never trust a field to be present) ───────

type Raw = Record<string, unknown>;

const str = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v : null;
const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;
const strArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && !!x) : [];
const asObj = (v: unknown): Raw =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : {};

function normaliseSocials(v: unknown): SocialLink[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((s) => {
      if (typeof s === "string") return { url: s };
      const o = asObj(s);
      const url = str(o.url);
      return url ? { url, platform: str(o.platform) } : null;
    })
    .filter((s): s is SocialLink => !!s && /^https?:\/\//i.test(s.url));
}

function normaliseBusiness(v: unknown): PublicBusiness | null {
  const o = asObj(v);
  const id = str(o.id);
  const slug = str(o.slug);
  const name = str(o.name);
  if (!id || !slug || !name) return null;
  return {
    id,
    slug,
    name,
    tagline: str(o.tagline),
    description: str(o.description),
    categories: strArr(o.categories),
    region_id: str(o.region_id),
    region_name: str(o.region_name),
    socials: normaliseSocials(o.socials),
    photos: strArr(o.photos),
    logo_url: str(o.logo_url),
    verified: o.verified === true,
    featured: o.featured === true,
    marker_ids: strArr(o.marker_ids),
    open_collab_count: num(o.open_collab_count) ?? 0,
  };
}

function normalisePlace(v: unknown): BusinessPlace | null {
  const o = asObj(v);
  const id = str(o.id);
  if (!id) return null;
  const c = Array.isArray(o.coordinates) ? o.coordinates : null;
  const coordinates =
    c && c.length >= 2 && typeof c[0] === "number" && typeof c[1] === "number"
      ? ([c[0], c[1]] as [number, number])
      : null;
  return {
    id,
    title: str(o.title) ?? "Untitled place",
    address: str(o.address),
    coordinates,
    categories: strArr(o.categories),
    region_name: str(o.region_name),
    image: str(o.image),
  };
}

function normalisePlan(v: unknown): Plan | null {
  const o = asObj(v);
  const code = str(o.code);
  if (!code) return null;
  const fallback = FALLBACK_PLANS.find((p) => p.code === code);
  const e = asObj(o.entitlements);
  const base = fallback?.entitlements ?? FALLBACK_PLANS[0].entitlements;
  const limit = (key: keyof PlanEntitlements): number | null =>
    key in e ? num(e[key]) : (base[key] as number | null);
  const flag = (key: keyof PlanEntitlements): boolean =>
    key in e ? e[key] === true : (base[key] as boolean);
  return {
    code,
    name: str(o.name) ?? fallback?.name ?? code,
    custom: o.custom === true,
    price_monthly_inr: num(o.price_monthly_inr),
    price_annual_inr: num(o.price_annual_inr),
    price_monthly_inr_incl_gst: num(o.price_monthly_inr_incl_gst),
    price_annual_inr_incl_gst: num(o.price_annual_inr_incl_gst),
    gst_rate: num(o.gst_rate) ?? GST_RATE,
    trial_days: num(o.trial_days) ?? 0,
    entitlements: {
      active_collabs: limit("active_collabs"),
      redemptions_per_month: limit("redemptions_per_month"),
      approval_mode: flag("approval_mode"),
      team_members: limit("team_members"),
      match_reveals_per_month: limit("match_reveals_per_month"),
      invites_per_month: limit("invites_per_month"),
      match_breakdown: flag("match_breakdown"),
      attribution: flag("attribution"),
      content_library: flag("content_library"),
      featured: flag("featured"),
      locations: limit("locations"),
    },
  };
}

function normaliseCollab(v: unknown): PublicCollab | null {
  const o = asObj(v);
  const id = str(o.id);
  const offer = str(o.offer);
  if (!id || !offer) return null;
  return {
    id,
    business_id: str(o.business_id) ?? "",
    marker_id: str(o.marker_id) ?? "",
    offer,
    mode: o.mode === "approval" ? "approval" : "open",
    allow_advance_requests: o.allow_advance_requests === true,
    slots_left: num(o.slots_left),
    valid_until: str(o.valid_until),
    created_at: str(o.created_at),
    business_name: str(o.business_name),
    business_slug: str(o.business_slug),
  };
}

function normaliseCreator(v: unknown): CreatorPortfolio | null {
  const o = asObj(v);
  const slug = str(o.slug);
  const name = str(o.display_name);
  if (!slug || !name) return null;
  const stats = asObj(o.stats);
  return {
    slug,
    display_name: name,
    avatar_url: str(o.avatar_url),
    bio: str(o.bio),
    travel_styles: strArr(o.travel_styles),
    niches: strArr(o.niches),
    languages: strArr(o.languages),
    portfolio: (Array.isArray(o.portfolio) ? o.portfolio : [])
      .map((p) => {
        const po = asObj(p);
        const url = str(po.url);
        return url && /^https?:\/\//i.test(url)
          ? { url, caption: str(po.caption) }
          : null;
      })
      .filter((p): p is { url: string; caption: string | null } => !!p),
    tier: str(o.tier) ?? "community",
    socials: (Array.isArray(o.socials) ? o.socials : [])
      .map((s) => {
        const so = asObj(s);
        const platform = str(so.platform);
        const handle = str(so.handle);
        return platform && handle ? { platform, handle } : null;
      })
      .filter((s): s is { platform: string; handle: string } => !!s),
    stats: {
      completed: num(stats.completed) ?? 0,
      avg_rating: num(stats.avg_rating),
      rating_count: num(stats.rating_count) ?? 0,
    },
    collab_history: (Array.isArray(o.collab_history) ? o.collab_history : [])
      .map((h) => {
        const ho = asObj(h);
        const businessName = str(ho.business_name);
        return businessName
          ? {
              business_name: businessName,
              business_slug: str(ho.business_slug),
              completed_at: str(ho.completed_at),
            }
          : null;
      })
      .filter(
        (h): h is CreatorPortfolio["collab_history"][number] => !!h
      ),
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function qs(params: Record<string, string | number | boolean | null | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "" || value === false)
      continue;
    search.set(key, String(value));
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}

function isNotFound(err: unknown) {
  return err instanceof ApiError && err.status === 404;
}

function logServerError(label: string, err: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[collabs] ${label} failed:`, err instanceof Error ? err.message : err);
  }
}

// ── Server fetchers (ISR) ──────────────────────────────────────────────────

/** GET /api/v2/plans — falls back to the defaults if the API is unreachable. */
export async function getPlans(revalidate = 3600): Promise<{ plans: Plan[]; live: boolean }> {
  try {
    const data = await request<{ plans?: unknown[] }>("/api/v2/plans", {
      next: { revalidate },
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
    const plans = (data.plans ?? [])
      .map(normalisePlan)
      .filter((p): p is Plan => !!p);
    if (plans.length === 0) return { plans: FALLBACK_PLANS, live: false };
    return { plans, live: true };
  } catch (err) {
    logServerError("getPlans", err);
    return { plans: FALLBACK_PLANS, live: false };
  }
}

export interface BusinessListParams {
  region_id?: string;
  category?: string;
  q?: string;
  featured?: boolean;
  page?: number;
  page_size?: number;
}

/**
 * GET /api/v2/businesses/public — returns null when the API failed, so the
 * caller can tell "no businesses yet" apart from "directory unavailable".
 */
export async function getPublicBusinesses(
  params: BusinessListParams = {},
  revalidate = 600
): Promise<Paginated<PublicBusiness> | null> {
  try {
    const data = await request<Raw>(
      `/api/v2/businesses/public${qs({ ...params })}`,
      {
        next: { revalidate },
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      }
    );
    const items = (Array.isArray(data.businesses) ? data.businesses : [])
      .map(normaliseBusiness)
      .filter((b): b is PublicBusiness => !!b);
    return {
      items,
      total: num(data.total) ?? items.length,
      page: num(data.page) ?? params.page ?? 1,
      page_size: num(data.page_size) ?? params.page_size ?? 24,
      total_pages: num(data.total_pages) ?? 1,
    };
  } catch (err) {
    logServerError("getPublicBusinesses", err);
    return null;
  }
}

/** GET /api/v2/businesses/public/{slug} — null on 404, throws otherwise. */
export async function getPublicBusiness(
  slug: string,
  revalidate = 600
): Promise<PublicBusinessDetail | null> {
  try {
    const data = await request<Raw>(
      `/api/v2/businesses/public/${encodeURIComponent(slug)}`,
      {
        next: { revalidate },
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      }
    );
    const raw = asObj(data.business);
    const business = normaliseBusiness(raw);
    if (!business) return null;
    return {
      ...business,
      places: (Array.isArray(raw.places) ? raw.places : [])
        .map(normalisePlace)
        .filter((p): p is BusinessPlace => !!p),
    };
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

/** GET /api/v2/businesses/public/slugs — empty list on failure (sitemap). */
export async function getPublicBusinessSlugs(
  revalidate = 3600
): Promise<{ slug: string; updated_at: string | null }[]> {
  try {
    const data = await request<Raw>("/api/v2/businesses/public/slugs", {
      next: { revalidate },
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
    return (Array.isArray(data.slugs) ? data.slugs : [])
      .map((s) => {
        const o = asObj(s);
        const slug = str(o.slug);
        return slug ? { slug, updated_at: str(o.updated_at) } : null;
      })
      .filter((s): s is { slug: string; updated_at: string | null } => !!s);
  } catch (err) {
    logServerError("getPublicBusinessSlugs", err);
    return [];
  }
}

/** GET /api/v2/collabs/public — empty list on failure. */
export async function getPublicCollabs(
  params: { region_id?: string | null; limit?: number } = {},
  revalidate = 600
): Promise<PublicCollab[]> {
  try {
    const data = await request<Raw>(
      `/api/v2/collabs/public${qs({ region_id: params.region_id, limit: params.limit ?? 120 })}`,
      {
        next: { revalidate },
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      }
    );
    return (Array.isArray(data.collabs) ? data.collabs : [])
      .map(normaliseCollab)
      .filter((c): c is PublicCollab => !!c);
  } catch (err) {
    logServerError("getPublicCollabs", err);
    return [];
  }
}

export interface TermsVersion {
  doc: string;
  version: string;
  url: string | null;
}

/** GET /api/v2/terms — current collab terms versions; null entries on failure. */
export async function getTermsVersions(
  revalidate = 600
): Promise<{ creator: TermsVersion | null; business: TermsVersion | null }> {
  const parse = (v: unknown): TermsVersion | null => {
    const o = asObj(v);
    const version = str(o.version) ?? (num(o.version) !== null ? String(o.version) : null);
    return version ? { doc: str(o.doc) ?? "", version, url: str(o.url) } : null;
  };
  try {
    const data = await request<Raw>("/api/v2/terms", {
      next: { revalidate },
      signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
    const terms = asObj(data.terms);
    return { creator: parse(terms.creator_collab_terms), business: parse(terms.business_terms) };
  } catch (err) {
    logServerError("getTermsVersions", err);
    return { creator: null, business: null };
  }
}

/**
 * GET /api/v2/businesses/claim/{token} — never cached (one-time links).
 * Returns null when the link is expired, used or unknown (404).
 */
export async function getClaimPreview(token: string): Promise<ClaimPreview | null> {
  try {
    const data = await request<Raw>(
      `/api/v2/businesses/claim/${encodeURIComponent(token)}`,
      { cache: "no-store", signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS) }
    );
    const b = asObj(data.business);
    return {
      business: {
        name: str(b.name) ?? "Your business",
        tagline: str(b.tagline),
        photos: strArr(b.photos),
        logo_url: str(b.logo_url),
        region_name: str(b.region_name),
        categories: strArr(b.categories),
      },
      already_claimed: data.already_claimed === true,
      requires_phone_verification: data.requires_phone_verification === true,
      phone_hint: str(data.phone_hint),
      expires_at: str(data.expires_at),
    };
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

/** GET /api/v2/collab-profile/public/{slug} — null on 404, throws otherwise. */
export async function getCreatorPortfolio(
  slug: string,
  revalidate = 600
): Promise<CreatorPortfolio | null> {
  try {
    const data = await request<Raw>(
      `/api/v2/collab-profile/public/${encodeURIComponent(slug)}`,
      {
        next: { revalidate },
        signal: AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
      }
    );
    return normaliseCreator(data.creator);
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

/**
 * POST /api/v2/tracking/{code}/click (server-side, from the /t/[code] route).
 * Returns null for unknown codes (404); throws on other failures.
 */
export async function recordTrackingClick(
  code: string,
  body: { client_ip?: string | null; user_agent?: string | null }
): Promise<TrackingClickResult | null> {
  try {
    const data = await request<Raw>(
      `/api/v2/tracking/${encodeURIComponent(code)}/click`,
      {
        method: "POST",
        body: JSON.stringify(body),
        cache: "no-store",
        signal: AbortSignal.timeout(4_000),
      }
    );
    return {
      marker_id: str(data.marker_id) ?? "",
      business_id: str(data.business_id) ?? "",
      deep_link: str(data.deep_link) ?? "",
      web_url: str(data.web_url) ?? "",
    };
  } catch (err) {
    if (isNotFound(err)) return null;
    throw err;
  }
}

// ── Client calls ───────────────────────────────────────────────────────────

/**
 * Search existing SeekKrr places to claim. Uses the unauthenticated public
 * explore feed (`/api/v2/markers/public`): the plain `/api/v2/markers` list
 * requires a signed-in user, and the website has no auth.
 */
export async function searchPlaces(
  query: string,
  signal?: AbortSignal
): Promise<MarkerSearchResult[]> {
  const data = await request<Raw>(
    `/api/v2/markers/public${qs({ search: query, page_size: 8, lean: true })}`,
    { signal }
  );
  return (Array.isArray(data.markers) ? data.markers : [])
    .map((m): MarkerSearchResult | null => {
      const o = asObj(m);
      const id = str(o.id);
      const title = str(o.title);
      if (!id || !title) return null;
      return {
        id,
        title,
        address: str(o.address),
        region_id: str(o.region_id),
        region_name: str(o.region_name),
        categories: strArr(o.categories),
        image: strArr(o.media)[0] ?? null,
      };
    })
    .filter((m): m is MarkerSearchResult => !!m);
}

/** POST /api/v2/business-applications (3 per 5 min per IP). */
export function submitBusinessApplication(
  payload: BusinessApplicationPayload
): Promise<BusinessApplicationResult> {
  return request<BusinessApplicationResult>("/api/v2/business-applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Formatting helpers shared by pages ─────────────────────────────────────

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatInr(value: number): string {
  return inr.format(value);
}

/** Deep link into the app for a marker (optionally with a tracking ref). */
export function markerDeepLink(markerId: string, ref?: string) {
  const base = `seekkrr://markers/${encodeURIComponent(markerId)}`;
  return ref ? `${base}?ref=${encodeURIComponent(ref)}` : base;
}

export function formatDate(iso: string | null, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
    ...opts,
  });
}
