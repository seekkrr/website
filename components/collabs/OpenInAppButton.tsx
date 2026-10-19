"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { Smartphone } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { siteConfig } from "@/lib/config/site";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

interface OpenInAppButtonProps extends VariantProps<typeof buttonVariants> {
  /** Custom-scheme deep link, e.g. seekkrr://markers/<id>. */
  deepLink: string;
  children?: ReactNode;
  className?: string;
  /** Where to send people who don't have the app (defaults to the store smart link). */
  fallbackUrl?: string;
}

const FALLBACK_DELAY_MS = 1600;

/**
 * Tries to open the app; if the page is still visible shortly after (the app
 * isn't installed), falls back to the store smart link.
 */
export function OpenInAppButton({
  deepLink,
  children = "Open in SeekKrr",
  className,
  fallbackUrl = siteConfig.appDownloadUrl,
  variant = "primary",
  size = "md",
  fullWidth,
}: OpenInAppButtonProps) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const cancel = () => {
      if (document.visibilityState === "hidden" && timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
    document.addEventListener("visibilitychange", cancel);
    window.addEventListener("pagehide", cancel);
    return () => {
      document.removeEventListener("visibilitychange", cancel);
      window.removeEventListener("pagehide", cancel);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
      if (!isMobile) {
        // Desktop browsers can't open the app; go straight to the download chooser.
        e.preventDefault();
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
        return;
      }
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        if (document.visibilityState === "visible") window.location.href = fallbackUrl;
      }, FALLBACK_DELAY_MS);
    },
    [fallbackUrl]
  );

  return (
    <a
      href={deepLink}
      onClick={onClick}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
    >
      <Smartphone className="h-5 w-5" aria-hidden="true" />
      {children}
    </a>
  );
}
