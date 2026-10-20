import { Lock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatBrief, type Deliverable } from "@/lib/collabDraft";
import { cn } from "@/lib/utils";

interface CollabCardProps {
  want: string;
  offer: string;
  description?: string;
  mode: "open" | "approval";
  deliverables?: Deliverable[];
  disclosure?: string | null;
  businessName?: string;
  isNew?: boolean;
  className?: string;
}

/**
 * Mirrors the app's "Available Collaborations" card on the business check-in
 * page: Want / For / Description, a "New" badge, the mode pill and the brief.
 * Purely presentational. The in-app Redeem/Avail action is left out on the
 * website on purpose.
 */
export function CollabCard({
  want,
  offer,
  description,
  mode,
  deliverables = [],
  disclosure,
  businessName,
  isNew = true,
  className,
}: CollabCardProps) {
  const brief = formatBrief(deliverables, disclosure);
  return (
    <article
      className={cn(
        "relative flex flex-col gap-4 rounded-[24px] border-[3px] border-black bg-white p-5 sm:p-6 [box-shadow:6px_6px_0_var(--color-yellow-accent)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          {isNew && (
            <Badge variant="yellow" size="sm">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              New
            </Badge>
          )}
          {businessName && (
            <span className="truncate font-jakarta text-[13px] font-semibold text-black/60">
              {businessName}
            </span>
          )}
        </div>
        <Badge variant={mode === "open" ? "green" : "blue"} size="sm">
          {mode === "open" ? "Open · walk in" : "Approval"}
        </Badge>
      </div>

      <dl className="flex flex-col gap-3">
        <div>
          <dt className="font-jakarta text-[12px] font-bold uppercase tracking-[0.12em] text-black/50">
            Want
          </dt>
          <dd className="mt-0.5 break-words font-jakarta text-[18px] font-bold leading-snug text-theme-green">
            {want || "What you'd like creators to make"}
          </dd>
        </div>
        <div>
          <dt className="font-jakarta text-[12px] font-bold uppercase tracking-[0.12em] text-black/50">
            For
          </dt>
          <dd className="mt-0.5 break-words font-jakarta text-[18px] font-bold leading-snug text-theme-green">
            <span className="bg-theme-yellow/70 px-1 box-decoration-clone">
              {offer || "What you'll offer in return"}
            </span>
          </dd>
        </div>
        {description !== undefined && (
          <div>
            <dt className="font-jakarta text-[12px] font-bold uppercase tracking-[0.12em] text-black/50">
              Description
            </dt>
            <dd className="mt-0.5 break-words text-[15px] leading-relaxed text-black/75">
              {description || "A line or two on what makes the visit worth filming."}
            </dd>
          </div>
        )}
      </dl>

      {brief && (
        <p className="rounded-xl border-2 border-dashed border-black/30 bg-theme-beige px-3 py-2 font-jakarta text-[13px] font-semibold text-black/80">
          Brief: {brief}
        </p>
      )}
    </article>
  );
}

interface CollabTeaserCardProps {
  offer: string;
  mode: "open" | "approval";
  allowAdvanceRequests?: boolean;
  slotsLeft?: number | null;
  validUntil?: string | null;
  className?: string;
}

/** Public teaser: the offer headline only; the rest unlocks in the app after check-in. */
export function CollabTeaserCard({
  offer,
  mode,
  allowAdvanceRequests,
  slotsLeft,
  validUntil,
  className,
}: CollabTeaserCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col gap-4 rounded-[24px] border-[3px] border-black bg-white p-5 [box-shadow:6px_6px_0_var(--color-yellow-accent)]",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={mode === "open" ? "green" : "blue"} size="sm">
          {mode === "open" ? "Open · walk in" : "Approval"}
        </Badge>
        {allowAdvanceRequests && (
          <Badge variant="outline" size="sm">
            Advance requests
          </Badge>
        )}
        {typeof slotsLeft === "number" && slotsLeft > 0 && (
          <Badge variant="soft" size="sm">
            {slotsLeft} {slotsLeft === 1 ? "spot" : "spots"} left
          </Badge>
        )}
      </div>
      <div>
        <p className="font-jakarta text-[12px] font-bold uppercase tracking-[0.12em] text-black/50">
          For
        </p>
        <p className="mt-0.5 break-words font-jakarta text-[20px] font-bold leading-snug text-theme-green">
          {offer}
        </p>
        {validUntil && <p className="mt-1 text-[13px] text-black/55">Open until {validUntil}</p>}
      </div>
      <p className="mt-auto flex items-start gap-2 rounded-xl bg-theme-beige px-3 py-2.5 text-[13px] font-medium leading-snug text-black/75">
        <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        What they want and the full brief unlock in the app after you check in.
      </p>
    </article>
  );
}
