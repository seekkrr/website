import type { CollabDraft } from "@/lib/collabDraft";

export interface CollabExample {
  /** Chip label in the builder. */
  label: string;
  /** Generic place line for the hero card (no invented business names). */
  place: string;
  draft: CollabDraft;
}

/**
 * Realistic Bir examples, shared by the builder's "Start from an example"
 * chips and the rotating hero card. Order and wording are owner-approved.
 */
export const COLLAB_EXAMPLES: CollabExample[] = [
  {
    label: "Café",
    place: "Café · Bir",
    draft: {
      want: "1 reel + 2 stories on our terrace",
      offer: "Breakfast for two",
      description:
        "Catch the morning light over the tea gardens and our wood-fired bakes. Tag our page and the location.",
      mode: "open",
      deliverables: [
        { type: "reel", count: 1 },
        { type: "story", count: 2 },
      ],
      disclosure: "#collab",
    },
  },
  {
    label: "Properties",
    place: "Homestay · Bir",
    draft: {
      want: "1 room-tour reel + a Google review",
      offer: "1 night for two in our valley-view room",
      description:
        "Show the room at sunrise, the rooftop at sunset and a night by the bonfire. Request your dates in the app first.",
      mode: "approval",
      deliverables: [
        { type: "reel", count: 1 },
        { type: "review", count: 1 },
      ],
      disclosure: "#collab",
    },
  },
  {
    label: "Adventures",
    place: "Paragliding · Bir",
    draft: {
      want: "1 reel from take-off to landing",
      offer: "A tandem flight from Billing",
      description:
        "Film the take-off at Billing, the glide over Bir and the landing field. We'll mount the GoPro for you.",
      mode: "approval",
      deliverables: [
        { type: "reel", count: 1 },
        { type: "story", count: 3 },
      ],
      disclosure: "#ad",
    },
  },
  {
    label: "Experiences",
    place: "Guided walk · Bir",
    draft: {
      want: "1 reel + 2 stories from the walk",
      offer: "A guided monastery walk for two",
      description:
        "Walk with our local guide through the Tibetan colony to Chokling Monastery, then butter tea and momos at the end. Mornings only.",
      mode: "approval",
      deliverables: [
        { type: "reel", count: 1 },
        { type: "story", count: 2 },
      ],
      disclosure: "#collab",
    },
  },
];
