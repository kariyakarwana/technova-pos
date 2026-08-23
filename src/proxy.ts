import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

function isUsable(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))) as { exp?: number };
    return typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000) + 30;
  } catch { return false; }
}

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("technova_access")?.value;
  if (isUsable(accessToken)) return NextResponse.next();

  const refreshToken = request.cookies.get("technova_refresh")?.value;
  if (!refreshToken) return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(request.nextUrl.pathname)}`, request.url));

  const refreshed = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { cookie: `technova_refresh=${refreshToken}` },
    cache: "no-store",
  }).catch(() => null);

  if (!refreshed?.ok) {
    const response = NextResponse.redirect(new URL("/login?reason=session-expired", request.url));
    response.cookies.delete("technova_access");
    response.cookies.delete("technova_refresh");
    return response;
  }

  const result = (await refreshed.json()) as { accessToken: string; expiresIn: number };
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set("technova_access", result.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: result.expiresIn });
  const rotated = refreshed.headers.get("set-cookie")?.match(/technova_refresh=([^;]+)/)?.[1];
  if (rotated) response.cookies.set("technova_refresh", rotated, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 8 * 60 * 60 });
  return response;
}

export const config = { matcher: ["/dashboard/:path*"] };
