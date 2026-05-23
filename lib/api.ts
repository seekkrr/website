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

export interface RegisterCreatorPayload {
    name: string;
    email: string;
    phone?: string;
    social_links: string[];
}


export interface SubmitQueryPayload {
    name: string;
    email: string;
    phone?: string;
    message: string;
}

export interface SubmitQueryResponse {
    message: string;
    queries_id?: string;
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

export class ApiError extends Error {
    public status: number;
    public data: any;

    constructor(message: string, status: number, data: any) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = "ApiError";
    }
}

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
        throw new ApiError(message, res.status, data);
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

/**
 * Submit user queries from the contact us page.
 * POST /api/v2/queries
 */
export function submitQuery(
    payload: SubmitQueryPayload,
): Promise<SubmitQueryResponse> {
    return request<SubmitQueryResponse>("/api/v2/queries", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}


/**
 * Register creator interest (Application).
 * POST /api/v2/creator-applications
 */
export async function registerCreator(
    payload: RegisterCreatorPayload,
): Promise<ApiResponse> {
    return request<ApiResponse>("/api/v2/creator-applications", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
