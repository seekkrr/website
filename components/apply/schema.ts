import { z } from "zod";
import type { PlanCode } from "@/lib/collabs";
import { stripTags } from "@/lib/utils";

// ── Form shape ─────────────────────────────────────────────────────────────

export type LocationMode = "claim" | "maps";

export interface ApplyFormValues {
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  location_mode: LocationMode;
  claimed_marker_id: string;
  claimed_marker_title: string;
  claimed_marker_address: string;
  region_id: string;
  maps_url: string;
  social_links: { url: string }[];
  categories: string[];
  requested_plan: PlanCode;
  gstin: string;
  message: string;
  agree_terms: boolean;
}

export const PLAN_CODES: PlanCode[] = ["free", "growth", "pro", "multi_location"];

export const DEFAULT_VALUES: ApplyFormValues = {
  business_name: "",
  contact_name: "",
  email: "",
  phone: "",
  location_mode: "claim",
  claimed_marker_id: "",
  claimed_marker_title: "",
  claimed_marker_address: "",
  region_id: "",
  maps_url: "",
  social_links: [{ url: "" }],
  categories: [],
  requested_plan: "growth",
  gstin: "",
  message: "",
  agree_terms: false,
};

export const CATEGORY_OPTIONS = [
  "Café",
  "Restaurant",
  "Bakery",
  "Hostel",
  "Homestay",
  "Hotel",
  "Camping",
  "Paragliding",
  "Trekking & tours",
  "Adventure sports",
  "Wellness & yoga",
  "Workshops & classes",
  "Coworking",
  "Shop & crafts",
];

export const STEPS = [
  { key: "details", title: "Business details", short: "Details" },
  { key: "location", title: "Where are you?", short: "Location" },
  { key: "socials", title: "Socials & categories", short: "Socials" },
  { key: "plan", title: "Plan & billing", short: "Plan" },
  { key: "review", title: "Review & submit", short: "Review" },
] as const;

// The API caps `message` at 1000 characters; the rest is left for the
// builder's collab summary, which is appended on submit.
export const MESSAGE_MAX = 500;
export const API_MESSAGE_MAX = 1000;

// ── Validators ─────────────────────────────────────────────────────────────

const clean = (v: string) => stripTags(v).trim();

export const GSTIN_RE = /^[0-9]{2}[A-Z0-9]{10}[0-9A-Z]{3}$/;
const EMAIL_RE = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PHONE_RE = /^[+]?[\d\s\-()]{7,20}$/;

/** Google Maps share links: maps.app.goo.gl, goo.gl/maps, google.*\/maps, maps.google.*, g.co/kgs. */
export function isGoogleMapsUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  const host = url.hostname.toLowerCase();
  const path = url.pathname.toLowerCase();
  if (host === "maps.app.goo.gl") return true;
  if (host === "goo.gl" && path.startsWith("/maps")) return true;
  if (host === "g.co" && path.startsWith("/kgs")) return true;
  if (/^maps\.google\.[a-z.]+$/.test(host)) return true;
  if (/^(www\.)?google\.[a-z.]+$/.test(host) && path.startsWith("/maps")) return true;
  return false;
}

const detailsSchema = z.object({
  business_name: z
    .string()
    .transform(clean)
    .pipe(z.string().min(1, "Enter your business name").max(150, "Keep it under 150 characters")),
  contact_name: z
    .string()
    .transform(clean)
    .pipe(
      z
        .string()
        .min(2, "Enter your name")
        .max(100, "Keep it under 100 characters")
        .regex(/^[\p{L}\p{M}'\-\s.]+$/u, "Use letters, spaces, hyphens and apostrophes only")
    ),
  email: z
    .string()
    .transform((v) => clean(v).toLowerCase())
    .pipe(
      z
        .string()
        .min(1, "Enter an email address")
        .max(254, "That email is too long")
        .regex(EMAIL_RE, "Enter a valid email address")
    ),
  phone: z
    .string()
    .transform(clean)
    .pipe(
      z
        .string()
        .min(1, "Enter a phone number we can call")
        .regex(PHONE_RE, "Enter a valid phone number, e.g. +91 98765 43210")
        .refine((v) => {
          const digits = v.replace(/\D/g, "").length;
          return digits >= 7 && digits <= 15;
        }, "Enter a valid phone number, e.g. +91 98765 43210")
    ),
});

const locationSchema = z
  .object({
    location_mode: z.enum(["claim", "maps"]),
    claimed_marker_id: z.string(),
    maps_url: z.string().transform(clean),
  })
  .superRefine((v, ctx) => {
    if (v.location_mode === "claim" && !v.claimed_marker_id) {
      ctx.addIssue({
        code: "custom",
        path: ["claimed_marker_id"],
        message: "Pick your place from the search results, or paste a Google Maps link instead.",
      });
    }
    if (v.location_mode === "maps") {
      if (!v.maps_url) {
        ctx.addIssue({ code: "custom", path: ["maps_url"], message: "Paste your Google Maps link" });
      } else if (v.maps_url.length > 500 || !isGoogleMapsUrl(v.maps_url)) {
        ctx.addIssue({
          code: "custom",
          path: ["maps_url"],
          message: "That doesn't look like a Google Maps link. It should start with https://maps.app.goo.gl/ or https://www.google.com/maps",
        });
      }
    }
  });

const socialsSchema = z.object({
  social_links: z
    .array(
      z.object({
        url: z
          .string()
          .transform(clean)
          .pipe(
            z
              .string()
              .max(500, "That link is too long")
              .refine((v) => !v || /^https:\/\/[^\s/]+\.[^\s]+/.test(v), "Links must start with https://")
          ),
      })
    )
    .max(10, "Add up to 10 links"),
  categories: z.array(z.string()).min(1, "Pick at least one category").max(10, "Pick up to 10 categories"),
});

const planSchema = z.object({
  requested_plan: z.enum(["free", "growth", "pro", "multi_location"]),
  gstin: z
    .string()
    .transform((v) => v.replace(/\s/g, "").toUpperCase())
    .refine((v) => !v || GSTIN_RE.test(v), "A GSTIN has 15 characters, like 03ABCDE1234F1Z5"),
  message: z
    .string()
    .transform(clean)
    .pipe(z.string().max(MESSAGE_MAX, `Keep it under ${MESSAGE_MAX} characters`)),
});

const reviewSchema = z.object({
  agree_terms: z.boolean().refine((v) => v === true, "Please accept the Business Terms to continue"),
});

export const STEP_SCHEMAS = [detailsSchema, locationSchema, socialsSchema, planSchema, reviewSchema] as const;

/** Which step owns a field (used to jump back when the API rejects a value). */
export const FIELD_STEP: Record<string, number> = {
  business_name: 0,
  contact_name: 0,
  email: 0,
  phone: 0,
  claimed_marker_id: 1,
  maps_url: 1,
  region_id: 1,
  social_links: 2,
  categories: 2,
  requested_plan: 3,
  gstin: 3,
  message: 3,
};
