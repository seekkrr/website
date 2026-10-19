"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

interface RouteErrorProps {
  reset: () => void;
  title?: string;
  message?: string;
}

/** Friendly fallback for data pages when the SeekKrr API can't be reached. */
export function RouteError({
  reset,
  title = "We lost the trail for a moment",
  message = "We couldn't load this page from SeekKrr just now. Give it another go in a few seconds.",
}: RouteErrorProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-theme-beige px-4 pb-16 pt-32 sm:px-6">
      <div className="w-full max-w-[600px] rounded-[24px] border-[3px] border-black bg-white px-6 py-10 text-center shadow-[8px_8px_0_var(--color-orange-accent)] sm:px-12">
        <h1 className="mb-4 font-jakarta text-[26px] font-extrabold tracking-tight text-black sm:text-[32px]">
          {title}
        </h1>
        <p className="mb-8 text-[16px] leading-relaxed text-black/75">{message}</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className={buttonVariants({ variant: "primary" })}>
            Try again
          </button>
          <Link href="/places" className={buttonVariants({ variant: "outline" })}>
            Browse places
          </Link>
        </div>
      </div>
    </div>
  );
}
