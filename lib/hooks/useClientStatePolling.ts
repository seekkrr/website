import { useState, useEffect, useCallback } from "react";
import { clientState } from "@/lib/clientState";

/**
 * Custom hook that keeps a clientState key in sync.
 * - Runs an initial check on mount.
 * - Listens for same-tab `clientstate-changed` events → instant update the moment
 *   clientState.set / clientState.remove is called anywhere in the app.
 * - Falls back to a 10-second polling interval for expiry detection.
 *
 * @param key   The clientState key to watch (e.g. "contactSubmitted")
 */
export function useClientStatePolling(key: string) {
    const [hasState, setHasState] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const check = useCallback(() => {
        const value = clientState.get(key);
        setHasState(value === "true");
        setIsChecking(false);
    }, [key]);

    useEffect(() => {
        // Initial sync
        check();

        // Instant update whenever clientState.set/remove fires for this key
        const onStateChanged = (e: Event) => {
            if ((e as CustomEvent<{ key: string }>).detail?.key === key) {
                check();
            }
        };
        window.addEventListener("clientstate-changed", onStateChanged);

        // Background polling catches natural expiry (every 10s is fine here)
        const interval = setInterval(check, 10000);

        return () => {
            window.removeEventListener("clientstate-changed", onStateChanged);
            clearInterval(interval);
        };
    }, [check, key]);

    return { hasState, isChecking, forceCheck: check };
}
