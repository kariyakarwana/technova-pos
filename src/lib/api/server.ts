import "server-only";

import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function serverApi<T>(path: string): Promise<T> {
  const token = (await cookies()).get("technova_access")?.value;
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      accept: "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const body = (await response.json()) as { message?: string | string[] };
      message = Array.isArray(body.message)
        ? body.message.join(" ")
        : body.message ?? message;
    } catch {}
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
