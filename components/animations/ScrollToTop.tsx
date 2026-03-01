"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "./LenisProvider";

/**
 * Automatically scrolls to the top when route changes.
 * Works seamlessly with Lenis smooth scroll.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const { scrollToTop } = useLenis();

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready
    const frameId = requestAnimationFrame(() => {
      setTimeout(() => {
        scrollToTop();
      }, 0);
    });

    return () => cancelAnimationFrame(frameId);
  }, [pathname, scrollToTop]);

  return null;
}
