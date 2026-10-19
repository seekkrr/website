"use client";

import dynamic from "next/dynamic";
import type { Plan } from "@/lib/collabs";

function ApplyFormSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite" className="flex flex-col gap-6">
      <span className="sr-only">Loading the application form…</span>
      <div className="h-4 w-full rounded-full border-[3px] border-black bg-white" />
      <div className="rounded-[24px] border-[3px] border-black bg-white p-5 sm:p-8 xl:rounded-[32px]">
        <div className="mb-6 h-7 w-56 rounded-lg bg-black/10 motion-safe:animate-pulse" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-4 w-28 rounded bg-black/10 motion-safe:animate-pulse" />
              <div className="h-12 rounded-xl border-2 border-black/15 bg-theme-beige motion-safe:animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// The form reads localStorage (draft) and the query string (builder prefill)
// during its first render, so it only renders in the browser.
const ApplyForm = dynamic(() => import("./ApplyForm"), {
  ssr: false,
  loading: () => <ApplyFormSkeleton />,
});

export function ApplyFormLoader({ plans }: { plans: Plan[] }) {
  return <ApplyForm plans={plans} />;
}
