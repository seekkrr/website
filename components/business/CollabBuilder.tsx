"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { SegmentedToggle } from "@/components/ui/SegmentedToggle";
import { CollabCard } from "@/components/collabs/CollabCard";
import { Reveal } from "@/components/collabs/Reveal";
import { SectionHeading } from "@/components/collabs/SectionHeading";
import { trackEvent } from "@/lib/analytics";
import { siteFeatures } from "@/lib/config/site";
import {
  DELIVERABLE_TYPES,
  DISCLOSURES,
  LIMITS,
  MAX_DELIVERABLE_COUNT,
  type CollabDraft,
  type DeliverableType,
  type Disclosure,
} from "@/lib/collabDraft";
import { cn } from "@/lib/utils";
import { COLLAB_EXAMPLES } from "./collabExamples";

const DELIVERABLE_NAMES: Record<DeliverableType, string> = {
  reel: "Reels",
  story: "Stories",
  post: "Posts",
  video: "YouTube Shorts",
  review: "Reviews",
};

export function CollabBuilder() {
  const [draft, setDraft] = useState<CollabDraft>(COLLAB_EXAMPLES[0].draft);
  const used = useRef(false);
  const id = useId();

  const markUsed = (field: string) => {
    if (used.current) return;
    used.current = true;
    trackEvent("business_builder_used", { field });
  };

  const update = <K extends keyof CollabDraft>(key: K, value: CollabDraft[K]) => {
    markUsed(key);
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const countOf = (type: DeliverableType) =>
    draft.deliverables.find((d) => d.type === type)?.count ?? 0;

  const changeCount = (type: DeliverableType, delta: number) => {
    markUsed("deliverables");
    setDraft((prev) => {
      const current = prev.deliverables.find((d) => d.type === type)?.count ?? 0;
      const next = Math.max(0, Math.min(MAX_DELIVERABLE_COUNT, current + delta));
      const deliverables = DELIVERABLE_TYPES.map((t) => ({
        type: t,
        count: t === type ? next : prev.deliverables.find((d) => d.type === t)?.count ?? 0,
      })).filter((d) => d.count > 0);
      return { ...prev, deliverables };
    });
  };

  return (
    <section
      id="builder"
      aria-labelledby={`${id}-title`}
      className="relative w-full scroll-mt-24 bg-theme-beige px-4 py-10 sm:px-6 md:px-12 md:py-14 lg:px-24 lg:py-16"
    >
      <div className="mx-auto w-full max-w-[1240px]">
        <SectionHeading
          id={`${id}-title`}
          eyebrow="Try it before you sign up"
          title="Build your first UGC brief"
          intro="This is the card creators see in the app when they check in at your place. Play with it here, then post the real thing once your listing is live."
          stars
        />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <Reveal className="min-w-0 rounded-[24px] border-[3px] border-black bg-white p-5 sm:p-7">
            <div className="mb-5">
              <p className="mb-2 font-jakarta text-[14px] font-semibold text-black/70" id={`${id}-templates`}>
                Start from an example
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-labelledby={`${id}-templates`}>
                {COLLAB_EXAMPLES.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => {
                      markUsed("template");
                      setDraft(t.draft);
                    }}
                    className="rounded-full border-2 border-black bg-theme-beige px-4 py-1.5 font-jakarta text-[14px] font-bold text-black transition-colors hover:bg-theme-yellow focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Field
                id={`${id}-want`}
                label="Want: what should creators make?"
                hint={`${draft.want.length}/${LIMITS.want}`}
              >
                <Input
                  value={draft.want}
                  maxLength={LIMITS.want}
                  placeholder="1 reel + 2 stories of your sunset deck"
                  onChange={(e) => update("want", e.target.value)}
                />
              </Field>
              <fieldset className="flex flex-col gap-3">
                <legend className="mb-2 font-jakarta text-[15px] font-semibold text-black">
                  Brief <span className="font-normal text-black/55">(optional)</span>
                </legend>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {DELIVERABLE_TYPES.map((type) => {
                    const count = countOf(type);
                    return (
                      <div
                        key={type}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-xl border-2 px-3 py-2 transition-colors",
                          count > 0 ? "border-black bg-theme-yellow/40" : "border-black/20 bg-theme-beige"
                        )}
                      >
                        <span className="font-jakarta text-[14px] font-bold text-black">
                          {DELIVERABLE_NAMES[type]}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => changeCount(type, -1)}
                            disabled={count === 0}
                            aria-label={`Fewer ${DELIVERABLE_NAMES[type].toLowerCase()}`}
                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white disabled:opacity-30 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
                          >
                            <Minus className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <output
                            aria-live="polite"
                            aria-label={`${count} ${DELIVERABLE_NAMES[type].toLowerCase()}`}
                            className="w-5 text-center font-jakarta text-[16px] font-bold tabular-nums"
                          >
                            {count}
                          </output>
                          <button
                            type="button"
                            onClick={() => changeCount(type, 1)}
                            disabled={count === MAX_DELIVERABLE_COUNT}
                            aria-label={`More ${DELIVERABLE_NAMES[type].toLowerCase()}`}
                            className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white disabled:opacity-30 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-theme-blue"
                          >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </fieldset>
              <Field
                id={`${id}-offer`}
                label="For: what do you offer in return?"
                hint={`${draft.offer.length}/${LIMITS.offer}`}
              >
                <Input
                  value={draft.offer}
                  maxLength={LIMITS.offer}
                  placeholder="A free dorm night for one"
                  onChange={(e) => update("offer", e.target.value)}
                />
              </Field>
              <Field
                id={`${id}-desc`}
                label="Description"
                optional
                hint={`${draft.description.length}/${LIMITS.description}`}
              >
                <Textarea
                  value={draft.description}
                  maxLength={LIMITS.description}
                  rows={3}
                  placeholder="What makes a visit worth filming?"
                  onChange={(e) => update("description", e.target.value)}
                />
              </Field>

              <div className="flex flex-col gap-2">
                <p className="font-jakarta text-[15px] font-semibold text-black" id={`${id}-mode`}>
                  How creators get it
                </p>
                <SegmentedToggle
                  ariaLabel="UGC brief mode"
                  value={draft.mode}
                  onChange={(v) => update("mode", v)}
                  options={[
                    { value: "open", label: "Open" },
                    { value: "approval", label: "Approval" },
                  ]}
                  className="self-start"
                />
                <p className="text-[13px] leading-snug text-black/65">
                  {draft.mode === "open"
                    ? "Creators walk in directly to redeem the UGC brief"
                    : "Business reviews and approves the creator to confirm the UGC brief"}
                </p>
              </div>

              {siteFeatures.disclosureLabel && (
                <div className="flex flex-col gap-2">
                  <p className="font-jakarta text-[15px] font-semibold text-black">Disclosure label</p>
                  <SegmentedToggle<Disclosure>
                    ariaLabel="Disclosure label"
                    size="sm"
                    value={draft.disclosure}
                    onChange={(v) => update("disclosure", v)}
                    options={DISCLOSURES.map((d) => ({ value: d, label: d }))}
                    className="self-start"
                  />
                  <p className="text-[13px] leading-snug text-black/65">
                    Always on. Creators see it as a checklist item, in line with ASCI influencer
                    guidelines.
                  </p>
                </div>
              )}
            </div>
          </Reveal>

          <div className="min-w-0 lg:sticky lg:top-24">
            <Reveal delay={0.15}>
              <p className="mb-3 flex items-center gap-2 font-jakarta text-[14px] font-bold uppercase tracking-[0.12em] text-black/60">
                <span className="h-2.5 w-2.5 rounded-full bg-theme-orange" aria-hidden="true" />
                Live preview
              </p>
              <CollabCard
                businessName="Your place"
                want={draft.want}
                offer={draft.offer}
                description={draft.description}
                mode={draft.mode}
                deliverables={draft.deliverables}
                disclosure={draft.disclosure}
              />
              <div className="mt-6 flex flex-col items-start gap-2.5">
                <Link
                  href="/business/apply"
                  onClick={() => markUsed("apply_cta")}
                  className={buttonVariants({ variant: "primary", size: "lg" })}
                >
                  List your business
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
                <p className="text-[14px] text-black/60">
                  {siteFeatures.plans ? "Free to start and about 2 minutes to sign up." : "About 2 minutes to sign up."}{" "}
                  Once your listing is verified, post your UGC brief from the Partner Portal.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
