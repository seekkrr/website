"use client";

import { RouteError } from "@/components/collabs/RouteError";

export default function ClaimError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <RouteError
      reset={reset}
      message="We couldn't check this claim link just now. Try again in a few seconds, or open it in the SeekKrr app."
    />
  );
}
