// ─── API Client ────────────────────────────────────────────────────────────
// Centralised API helper. Every backend call goes through this module so
// the base URL, headers, and error handling live in one place.
// ────────────────────────────────────────────────────────────────────────────

export const API_BASE_URL =
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
  name?: string;
  email?: string;
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
  public data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

/**
 * Pull a human-readable message out of an error body. AppError responses carry
 * `message`; FastAPI body validation (422) carries `detail` (string or array).
 */
function errorMessageFrom(data: unknown, status: number): string {
  if (data && typeof data === "object") {
    const body = data as { message?: unknown; detail?: unknown };
    if (typeof body.message === "string" && body.message) return body.message;
    if (typeof body.detail === "string" && body.detail) return body.detail;
    if (Array.isArray(body.detail) && body.detail.length > 0) {
      const first = body.detail[0] as { msg?: unknown };
      if (typeof first?.msg === "string") return first.msg;
    }
  }
  return `Request failed with status ${status}`;
}

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Merge headers explicitly and pass them last: spreading `options` after a
  // merged `headers` object would let a caller's `options.headers` replace the
  // merged set and silently drop Content-Type.
  const headers = new Headers(options.headers);
  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  const res = await fetch(url, { ...options, headers });

  // Attempt to parse JSON regardless of status to capture server error messages
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(errorMessageFrom(data, res.status), res.status, data);
  }

  return data as T;
}

// ── Endpoints ──────────────────────────────────────────────────────────────

/**
 * Register user interest (early access sign-up).
 * POST /api/interest
 */
export function registerInterest(
  payload: RegisterInterestPayload
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
  payload: SubmitQueryPayload
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
  payload: RegisterCreatorPayload
): Promise<ApiResponse> {
  return request<ApiResponse>("/api/v2/creator-applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
