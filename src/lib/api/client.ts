export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function errorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body) {
    const message = (body as { message?: string | string[] }).message;
    return Array.isArray(message) ? message.join(" ") : message ?? fallback;
  }
  return fallback;
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("accept", "application/json");
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("content-type", "application/json");
  }

  const response = await fetch(`/api/backend${path}`, {
    ...options,
    headers,
    credentials: "same-origin",
    cache: "no-store",
  });
  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.location.href = `/login?reason=session-expired&callbackUrl=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new ApiError(
      errorMessage(body, `Request failed (${response.status}).`),
      response.status,
      body,
    );
  }
  return body as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return apiClient<T>(path);
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiClient<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return apiClient<T>(path, { method: "PATCH", body: JSON.stringify(body) });
}
