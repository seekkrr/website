// A collab idea as sketched in the /business builder demo and shown on the
// collab card. Purely presentational: sign-up happens in the Partner Portal.

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

// "video" is always a YouTube Short: businesses can't ask for long videos.
const DELIVERABLE_LABELS: Record<DeliverableType, [string, string]> = {
  reel: ["reel", "reels"],
  post: ["post", "posts"],
  story: ["story", "stories"],
  video: ["YouTube Short", "YouTube Shorts"],
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
