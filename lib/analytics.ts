import { track } from "@vercel/analytics";

/** Funnel events (Vercel Web Analytics custom events). */
export type FunnelEvent =
  | "business_builder_used"
  | "pricing_toggle"
  // Hand-offs to the Partner Portal, where sign-in and the sign-up forms live.
  | "business_signup_handoff"
  | "creator_signup_handoff";

type EventProps = Record<string, string | number | boolean | null>;

/** Fire-and-forget: analytics must never break the page. */
export function trackEvent(name: FunnelEvent, props?: EventProps) {
  try {
    track(name, props);
  } catch {
    // Ad blockers or a missing analytics script are not user-facing errors.
  }
}
