import { track } from "@vercel/analytics";

/** Funnel events for SeekKrr for Business (Vercel Web Analytics custom events). */
export type FunnelEvent =
  | "business_builder_used"
  | `apply_step_${number}`
  | "apply_submitted"
  | "pricing_toggle";

type EventProps = Record<string, string | number | boolean | null>;

/** Fire-and-forget: analytics must never break the page. */
export function trackEvent(name: FunnelEvent, props?: EventProps) {
  try {
    track(name, props);
  } catch {
    // Ad blockers or a missing analytics script are not user-facing errors.
  }
}
