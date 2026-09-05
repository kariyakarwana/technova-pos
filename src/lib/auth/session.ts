import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasPermission, hasRole } from "./authorization";
import type { Permission, SystemRole } from "./permissions";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
export type CurrentUser = { id: string; email: string; name: string | null; roles: string[]; permissions: string[]; mustChangePassword?: boolean };

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get("technova_access")?.value;
  if (!token) return null;
  const response = await fetch(`${API_URL}/auth/me`, { headers: { authorization: `Bearer ${token}` }, cache: "no-store" });
  return response.ok ? ((await response.json()) as CurrentUser) : null;
}

export async function requireAuthenticatedUser(callbackPath = "/dashboard"): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
  return user;
}

export async function requirePermission(permission: Permission, callbackPath = "/dashboard"): Promise<CurrentUser> {
  const user = await requireAuthenticatedUser(callbackPath);
  if (!hasPermission(user, permission)) redirect(`/forbidden?permission=${encodeURIComponent(permission)}`);
  return user;
}

export async function requireAllPermissions(permissions: readonly Permission[], callbackPath = "/dashboard"): Promise<CurrentUser> {
  const user = await requireAuthenticatedUser(callbackPath);
  if (!permissions.every((permission) => hasPermission(user, permission))) redirect("/forbidden");
  return user;
}

export async function requireRole(role: SystemRole, callbackPath = "/dashboard"): Promise<CurrentUser> {
  const user = await requireAuthenticatedUser(callbackPath);
  if (!hasRole(user, role)) redirect("/forbidden");
  return user;
}
