import Cookies from "js-cookie";

/**
 * Utility to manage client-side state using cookies with a fallback
 * to sessionStorage if cookies are blocked or unavailable.
 * This is useful for preventing spam, tracking client interactions, and optimizations.
 */

export const clientState = {
    /**
     * Set a state value.
     * @param key The key to store
     * @param value The value to store
     * @param expiresDays Optional expiration in days. (e.g. 1/1440 for 1 minute)
     */
    set: (key: string, value: string, expiresDays: number = 1): void => {
        const expiresMs = expiresDays * 24 * 60 * 60 * 1000;
        const expiryTime = Date.now() + expiresMs;

        try {
            // Attempt to set a cookie first
            Cookies.set(key, value, { expires: expiresDays, path: "/" });
        } catch (error) {
            console.warn("Cookies are not available, falling back to sessionStorage", error);
        }

        try {
            // Always write to sessionStorage as a fallback/sync for the current tab
            if (typeof window !== "undefined") {
                sessionStorage.setItem(key, value);
                // Store matching expiry timestamp for sessionStorage
                sessionStorage.setItem(`${key}_expires`, expiryTime.toString());
            }
        } catch (error) {
            console.warn("sessionStorage is not available", error);
        }
    },

    /**
     * Get a state value.
     * @param key The key to retrieve
     * @returns The value, or null if not found/expired
     */
    get: (key: string): string | null => {
        let value: string | null = null;

        try {
            // Check cookies first
            value = Cookies.get(key) || null;
        } catch (error) {
            console.warn("Could not read cookies", error);
        }

        // Check sessionStorage to validate sync and session freshness
        try {
            if (typeof window !== "undefined") {
                const sessionValue = sessionStorage.getItem(key);
                const expiryStr = sessionStorage.getItem(`${key}_expires`);

                // If it's in a cookie but NOT in this session's storage, it's stale
                if (value && !sessionValue) {
                    clientState.remove(key);
                    return null;
                }

                if (sessionValue) {
                    // Validations
                    const isExpired = expiryStr && Date.now() > parseInt(expiryStr);
                    const isOldStyle = !expiryStr; // No expiry key means it's from the old implementation

                    if (isExpired || isOldStyle) {
                        // Clear if expired or old format
                        clientState.remove(key);
                        return null;
                    } else if (!value) {
                        // Not expired in session but cookie missing (maybe cleared by browser)
                        value = sessionValue;
                    }
                }
            }
        } catch (error) {
            console.warn("Could not read/validate sessionStorage", error);
        }

        return value;
    },

    /**
     * Remove a state value.
     * @param key The key to remove
     */
    remove: (key: string): void => {
        try {
            Cookies.remove(key, { path: "/" });
        } catch (error) {
            console.warn("Failed to remove cookie", error);
        }

        try {
            if (typeof window !== "undefined") {
                sessionStorage.removeItem(key);
                sessionStorage.removeItem(`${key}_expires`);
            }
        } catch (error) {
            console.warn("Failed to remove sessionStorage item", error);
        }
    },
};
