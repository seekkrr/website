"use client";

import { RouteError } from "@/components/collabs/RouteError";

export default function CreatorError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      reset={reset}
      message="We couldn't load this creator's profile just now. Give it another go in a few seconds."
    />
  );
}
