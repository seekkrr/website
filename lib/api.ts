// ─── API Client ────────────────────────────────────────────────────────────
// Centralised API helper. Every backend call goes through this module so
// the base URL, headers, and error handling live in one place.
// ────────────────────────────────────────────────────────────────────────────

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.seekkrr.com";

// ── Types ──────────────────────────────────────────────────────────────────

export interface RegisterInterestPayload {
    name: string;
    email: string;
    phone?: string;
}

export interface ApiSuccessResponse {
    success: true;
    message: string;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// ── Helpers ────────────────────────────────────────────────────────────────

async function request<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    // Attempt to parse JSON regardless of status to capture server error messages
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message =
            (data as ApiErrorResponse)?.message ??
            `Request failed with status ${res.status}`;
        throw new Error(message);
    }

    return data as T;
}

// ── Endpoints ──────────────────────────────────────────────────────────────

/**
 * Register user interest (early access sign-up).
 * POST /api/interest
 */
export function registerInterest(
    payload: RegisterInterestPayload,
): Promise<ApiResponse> {
    return request<ApiResponse>("/api/interest", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
