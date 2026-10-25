"use client";

import { useEffect } from "react";

/** Phones the server didn't recognise by their user agent still go to their store. */
export function StoreRedirect({ appStoreUrl, playStoreUrl }: { appStoreUrl: string; playStoreUrl: string }) {
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
    if (/iphone|ipad|ipod/i.test(ua) || iPadOS) window.location.replace(appStoreUrl);
    else if (/android/i.test(ua)) window.location.replace(playStoreUrl);
  }, [appStoreUrl, playStoreUrl]);
  return null;
}
