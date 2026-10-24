import type { Plan, PlanEntitlements } from "@/lib/collabs";

/** `label` replaces the dash when a feature is missing; `note` sits beside the tick when it's included. */
export type Cell =
  | { kind: "text"; value: string }
  | { kind: "bool"; value: boolean; label?: string; note?: string };

export interface FeatureRow {
  key: keyof PlanEntitlements;
  label: string;
  /** Small badge beside the row label (e.g. the Pro headline feature). */
  badge?: string;
  render: (plan: Plan) => Cell;
}

/**
 * Full AI creator matching (SeekKrr Match AI): more reveals, creator invites
 * and the score breakdown. Plans without it get a top-N preview.
 */
export function hasFullMatching(plan: Plan) {
  return plan.entitlements.match_breakdown;
}

function matchingCell(plan: Plan): Cell {
  const reveals = plan.entitlements.match_reveals_per_month;
  if (reveals === 0) return { kind: "bool", value: false };
  if (!hasFullMatching(plan)) return { kind: "text", value: reveals === null ? "Preview" : `Top ${reveals} preview` };
  return {
    kind: "bool",
    value: true,
    note: reveals === null ? "Full · unlimited" : `Full · ${reveals.toLocaleString("en-IN")}/mo`,
  };
}

const limit = (plan: Plan, value: number | null, zero = "—"): Cell => {
  if (value === null) return { kind: "text", value: plan.custom ? "Custom" : "Unlimited" };
  if (value === 0) return { kind: "text", value: zero };
  return { kind: "text", value: value.toLocaleString("en-IN") };
};

export const FEATURE_ROWS: FeatureRow[] = [
  { key: "active_collabs", label: "Active UGC briefs", render: (p) => limit(p, p.entitlements.active_collabs) },
  {
    key: "redemptions_per_month",
    label: "Redemptions / month",
    render: (p) => limit(p, p.entitlements.redemptions_per_month),
  },
  {
    key: "approval_mode",
    label: "Approval mode + advance visit requests",
    render: (p) => ({ kind: "bool", value: p.entitlements.approval_mode }),
  },
  { key: "team_members", label: "Team members", render: (p) => limit(p, p.entitlements.team_members) },
  { key: "locations", label: "Locations", render: (p) => limit(p, p.entitlements.locations) },
  {
    key: "match_reveals_per_month",
    label: "AI creator matching",
    badge: "Pro",
    render: matchingCell,
  },
  {
    key: "invites_per_month",
    label: "Creator invites / month",
    render: (p) => limit(p, p.entitlements.invites_per_month),
  },
  {
    key: "match_breakdown",
    label: "Match score breakdown",
    render: (p) => ({ kind: "bool", value: p.entitlements.match_breakdown }),
  },
  {
    key: "attribution",
    label: "Attribution (clicks → app opens → check-ins)",
    render: (p) =>
      p.entitlements.attribution
        ? { kind: "bool", value: true }
        : { kind: "bool", value: false, label: "Counts only" },
  },
  {
    key: "content_library",
    label: "Content library",
    render: (p) =>
      p.entitlements.content_library
        ? { kind: "bool", value: true }
        : { kind: "bool", value: false, label: "Counts only" },
  },
  {
    key: "featured",
    label: "Featured map pin + priority listing",
    render: (p) => ({ kind: "bool", value: p.entitlements.featured }),
  },
];

const plural = (n: number, one: string, many: string) => `${n.toLocaleString("en-IN")} ${n === 1 ? one : many}`;

/** Short highlight bullets for a plan card, derived from live entitlements. */
export function planHighlights(plan: Plan): string[] {
  const e = plan.entitlements;
  if (plan.custom) {
    return [
      "Everything in Pro",
      ...(e.match_reveals_per_month === null && e.invites_per_month === null
        ? ["Unlimited AI creator matching and invites"]
        : []),
      "Custom limits for every location",
      "Group billing with GST invoices",
      "Hands-on onboarding for your team",
    ];
  }
  const out: string[] = [];
  out.push(e.active_collabs === null ? "Unlimited active UGC briefs" : plural(e.active_collabs, "active UGC brief", "active UGC briefs"));
  out.push(
    e.redemptions_per_month === null
      ? "Unlimited redemptions"
      : `${plural(e.redemptions_per_month, "redemption", "redemptions")} / month`
  );
  if (e.approval_mode) out.push("Approval mode + advance requests");
  if (hasFullMatching(plan)) {
    out.push(
      e.match_reveals_per_month === null
        ? "Unlimited AI match reveals and invites"
        : `${e.match_reveals_per_month} AI match reveals${e.invites_per_month ? ` + ${e.invites_per_month} invites` : ""} / month`
    );
  } else if (e.match_reveals_per_month !== null && e.match_reveals_per_month > 0) {
    out.push(`Top ${e.match_reveals_per_month} AI creator match preview each month`);
  }
  if (e.featured) out.push("Featured map pin + priority listing");
  else if (e.attribution) out.push("Attribution + content library");
  out.push(
    `${e.locations === null ? "Unlimited locations" : plural(e.locations, "location", "locations")}, ${
      e.team_members === null ? "unlimited team" : plural(e.team_members, "team seat", "team seats")
    }`
  );
  return out;
}
