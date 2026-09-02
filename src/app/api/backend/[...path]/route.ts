import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
const ACCESS_COOKIE = "technova_access";
const REFRESH_COOKIE = "technova_refresh";

async function forward(request: NextRequest, path: string[], token?: string) {
  const url = new URL(`${API_URL}/${path.map(encodeURIComponent).join("/")}`);
  request.nextUrl.searchParams.forEach((value, key) => url.searchParams.append(key, value));
  const headers = new Headers({ accept: request.headers.get("accept") ?? "application/json" });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (token) headers.set("authorization", `Bearer ${token}`);
  const idempotencyKey = request.headers.get("idempotency-key");
  if (idempotencyKey) headers.set("idempotency-key", idempotencyKey);
  return fetch(url, {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
    cache: "no-store",
  });
}

async function handler(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const store = await cookies();
  let token = store.get(ACCESS_COOKIE)?.value;
  let backend = await forward(request, path, token);
  let rotatedRefresh: string | undefined;

  if (backend.status === 401) {
    const refresh = store.get(REFRESH_COOKIE)?.value;
    if (refresh) {
      const refreshed = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { cookie: `${REFRESH_COOKIE}=${refresh}` },
        cache: "no-store",
      });
      if (refreshed.ok) {
        const result = (await refreshed.json()) as { accessToken: string; expiresIn: number };
        token = result.accessToken;
        rotatedRefresh = refreshed.headers.get("set-cookie")?.match(/technova_refresh=([^;]+)/)?.[1];
        store.set(ACCESS_COOKIE, token, {
          httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: result.expiresIn,
        });
        backend = await forward(request, path, token);
      }
    }
  }

  const headers = new Headers();
  headers.set("content-type", backend.headers.get("content-type") ?? "application/json");
  const disposition = backend.headers.get("content-disposition");
  if (disposition) headers.set("content-disposition", disposition);
  const response = new NextResponse(backend.body, { status: backend.status, headers });
  if (rotatedRefresh) {
    response.cookies.set(REFRESH_COOKIE, rotatedRefresh, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 8 * 60 * 60,
    });
  }
  if (backend.status === 401) {
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
  }
  return response;
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const DELETE = handler;
