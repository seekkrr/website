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
     * @param expires Optional expiration in days (applies to cookies only)
     */
    set: (key: string, value: string, expires: number = 1): void => {
        try {
            // Attempt to set a cookie first
            Cookies.set(key, value, { expires });
        } catch (error) {
            console.warn("Cookies are not available, falling back to sessionStorage", error);
        }

        try {
            // Always write to sessionStorage as a fallback/sync for the current tab
            if (typeof window !== "undefined") {
                sessionStorage.setItem(key, value);
            }
        } catch (error) {
            console.warn("sessionStorage is not available", error);
        }
    },

    /**
     * Get a state value.
     * @param key The key to retrieve
     * @returns The value, or null if not found
     */
    get: (key: string): string | null => {
        let value = null;

        try {
            // Check cookies first
            value = Cookies.get(key) || null;
        } catch (error) {
            console.warn("Could not read cookies", error);
        }

        // Fall back to sessionStorage if cookie wasn't found
        if (!value) {
            try {
                if (typeof window !== "undefined") {
                    value = sessionStorage.getItem(key);
                }
            } catch (error) {
                console.warn("Could not read sessionStorage", error);
            }
        }

        return value;
    },

    /**
     * Remove a state value.
     * @param key The key to remove
     */
    remove: (key: string): void => {
        try {
            Cookies.remove(key);
        } catch (error) {
            console.warn("Failed to remove cookie", error);
        }

        try {
            if (typeof window !== "undefined") {
                sessionStorage.removeItem(key);
            }
        } catch (error) {
            console.warn("Failed to remove sessionStorage item", error);
        }
    },
};
