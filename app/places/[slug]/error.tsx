"use client";

import { RouteError } from "@/components/collabs/RouteError";

export default function PlaceError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteError reset={reset} />;
}
