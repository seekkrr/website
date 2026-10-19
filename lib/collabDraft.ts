// A collab idea sketched in the /business builder, carried into /business/apply
// through query params (so the link is shareable and survives a refresh).

export type DeliverableType = "reel" | "post" | "story" | "video" | "review";
export type Disclosure = "#ad" | "#collab" | "#gifted";
export type CollabMode = "open" | "approval";

export interface Deliverable {
  type: DeliverableType;
  count: number;
}

export interface CollabDraft {
  want: string;
  offer: string;
  description: string;
  mode: CollabMode;
  deliverables: Deliverable[];
  disclosure: Disclosure;
}

export const DELIVERABLE_TYPES: DeliverableType[] = ["reel", "story", "post", "video", "review"];
export const DISCLOSURES: Disclosure[] = ["#collab", "#ad", "#gifted"];
export const MAX_DELIVERABLE_COUNT = 5;

export const LIMITS = { want: 80, offer: 80, description: 300 } as const;

const DELIVERABLE_LABELS: Record<DeliverableType, [string, string]> = {
  reel: ["reel", "reels"],
  post: ["post", "posts"],
  story: ["story", "stories"],
  video: ["video", "videos"],
  review: ["review", "reviews"],
};

export function formatDeliverable({ type, count }: Deliverable) {
  const [one, many] = DELIVERABLE_LABELS[type];
  return `${count} ${count === 1 ? one : many}`;
}

export function formatBrief(deliverables: Deliverable[], disclosure?: string | null) {
  return [...deliverables.filter((d) => d.count > 0).map(formatDeliverable), disclosure]
    .filter(Boolean)
    .join(" · ");
}

const clean = (v: string | null, max: number) =>
  (v ?? "").replace(/[<>]/g, "").replace(/\s+/g, " ").trim().slice(0, max);

/** Builder → `/business/apply?want=…&offer=…` */
export function draftToSearchParams(draft: CollabDraft): URLSearchParams {
  const params = new URLSearchParams();
  if (draft.want.trim()) params.set("want", clean(draft.want, LIMITS.want));
  if (draft.offer.trim()) params.set("offer", clean(draft.offer, LIMITS.offer));
  if (draft.description.trim()) params.set("desc", clean(draft.description, LIMITS.description));
  params.set("mode", draft.mode);
  const d = draft.deliverables
    .filter((x) => x.count > 0)
    .map((x) => `${x.type}:${x.count}`)
    .join(",");
  if (d) params.set("brief", d);
  // Stored without "#" so the value never reads as a URL fragment.
  params.set("disclosure", draft.disclosure.slice(1));
  return params;
}

/** `/business/apply` query params → draft, or null when no collab was sketched. */
export function draftFromSearchParams(params: URLSearchParams): CollabDraft | null {
  const want = clean(params.get("want"), LIMITS.want);
  const offer = clean(params.get("offer"), LIMITS.offer);
  if (!want && !offer) return null;
  const deliverables: Deliverable[] = (params.get("brief") ?? "")
    .split(",")
    .map((pair) => {
      const [type, count] = pair.split(":");
      const n = Number.parseInt(count ?? "", 10);
      return DELIVERABLE_TYPES.includes(type as DeliverableType) && n > 0
        ? { type: type as DeliverableType, count: Math.min(n, MAX_DELIVERABLE_COUNT) }
        : null;
    })
    .filter((x): x is Deliverable => !!x);
  const disclosureParam = `#${params.get("disclosure") ?? "collab"}` as Disclosure;
  return {
    want,
    offer,
    description: clean(params.get("desc"), LIMITS.description),
    mode: params.get("mode") === "approval" ? "approval" : "open",
    deliverables,
    disclosure: DISCLOSURES.includes(disclosureParam) ? disclosureParam : "#collab",
  };
}

/** Plain-text summary appended to the application message for the onboarding team. */
export function draftSummary(draft: CollabDraft): string {
  const lines = [
    "First collab idea (from the website builder):",
    `Want: ${draft.want || "-"}`,
    `For: ${draft.offer || "-"}`,
    draft.description ? `Description: ${draft.description}` : null,
    `Mode: ${draft.mode === "open" ? "Open (walk-in redeem)" : "Approval"}`,
    `Brief: ${formatBrief(draft.deliverables, draft.disclosure) || draft.disclosure}`,
  ];
  return lines.filter(Boolean).join("\n");
}
