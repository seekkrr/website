"use client";

import type { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { trackEvent, type FunnelEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/** Google's four-colour "G" (sign-in branding). Decorative: the label says "Google". */
export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" className={className}>
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export interface GoogleHandoffLinkProps {
  /** Absolute Partner Portal URL (see `portalLinks`). */
  href: string;
  /** Analytics event fired on click. */
  event: FunnelEvent;
  /** Where on the site the click came from (analytics prop). */
  source: string;
  children?: ReactNode;
  size?: "md" | "lg";
  className?: string;
}

/**
 * Primary "Continue with Google" pill. Sign-in and the sign-up forms live in
 * the Partner Portal, so this is a plain link (same tab) into it.
 */
export function GoogleHandoffLink({
  href,
  event,
  source,
  children = "Continue with Google",
  size = "lg",
  className,
}: GoogleHandoffLinkProps) {
  return (
    <a
      href={href}
      onClick={() => trackEvent(event, { source })}
      className={cn(
        buttonVariants({ variant: "primary", size }),
        "group pl-3 sm:pl-3.5",
        className
      )}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
        <GoogleIcon className="h-4 w-4" />
      </span>
      {children}
      <ArrowRight
        className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        aria-hidden="true"
      />
    </a>
  );
}

/** Copy allow-listed query params (referral code, plan, UTM tags) onto an absolute URL. */
function withForwardedParams(href: string, from: URLSearchParams, keys: readonly string[]) {
  try {
    const url = new URL(href);
    for (const key of keys) {
      const value = from.get(key)?.trim();
      if (value && !url.searchParams.has(key)) url.searchParams.set(key, value.slice(0, 100));
    }
    return url.toString();
  } catch {
    return href;
  }
}

/**
 * GoogleHandoffLink that carries the current page's allow-listed query params
 * (e.g. `?ref=` from a partner referral link) into the portal. Uses
 * `useSearchParams`, so render it inside <Suspense> with a plain
 * GoogleHandoffLink as the fallback.
 */
export function ForwardingGoogleHandoffLink({
  forwardParams,
  href,
  ...props
}: GoogleHandoffLinkProps & { forwardParams: readonly string[] }) {
  const searchParams = useSearchParams();
  return <GoogleHandoffLink href={withForwardedParams(href, searchParams, forwardParams)} {...props} />;
}
