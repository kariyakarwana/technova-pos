import {
  redirect,
} from "next/navigation";

import {
  auth,
} from "@/auth";

import {
  authService,
} from "@/modules/auth/auth.service";

import {
  getSecurityRequestContext,
} from "@/lib/security/request";

import {
  hasPermission,
  hasRole,
} from "./authorization";

import type {
  Permission,
  SystemRole,
} from "./permissions";

import type {
  Session,
} from "next-auth";

function getSafeCallbackPath(
  value: string,
): string {
  /*
   * Allow internal paths only.
   * Reject protocol-relative values such as //evil.example.
   */
  if (
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return "/dashboard";
}

function createLoginUrl(
  callbackPath: string,
  reason?: string,
): string {
  const params =
    new URLSearchParams({
      callbackUrl:
        getSafeCallbackPath(
          callbackPath,
        ),
    });

  if (reason) {
    params.set("reason", reason);
  }

  return `/login?${params.toString()}`;
}

/**
 * Returns the current valid session or null.
 *
 * auth() already triggers the JWT callback, which revalidates
 * account status and sessionVersion through PostgreSQL.
 */
export async function getCurrentSession(): Promise<Session | null> {
  const session = await auth();

  if (
    !session?.user?.id ||
    session.invalid
  ) {
    return null;
  }

  return session;
}

export async function getCurrentUser(): Promise<Session["user"] | null> {
  const session =
    await getCurrentSession();

  return session?.user ?? null;
}

/**
 * Requires an authenticated, active and non-revoked session.
 */
export async function requireAuthenticatedUser(
  callbackPath = "/dashboard",
): Promise<Session["user"]> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(
      createLoginUrl(
        callbackPath,
      ),
    );
  }

  if (session.invalid) {
    redirect(
      createLoginUrl(
        callbackPath,
        "session-expired",
      ),
    );
  }

  return session.user;
}

/**
 * Requires an authenticated user with one specific permission.
 */
export async function requirePermission(
  permission: Permission,
  callbackPath = "/dashboard",
): Promise<Session["user"]> {
  const user =
    await requireAuthenticatedUser(
      callbackPath,
    );

  if (
    hasPermission(
      user,
      permission,
    )
  ) {
    return user;
  }

  /*
   * Authorization denial must not be weakened if audit logging fails.
   */
  try {
    const context =
      await getSecurityRequestContext();

    await authService
      .recordPermissionDenied({
        userId: user.id,
        permission,
        context,
      });
  } catch (error) {
    console.error(
      "Permission-denied audit failed.",
      error,
    );
  }

  const params =
    new URLSearchParams({
      permission,
    });

  redirect(
    `/forbidden?${params.toString()}`,
  );
}

/**
 * Requires every permission in the supplied collection.
 */
export async function requireAllPermissions(
  permissions: readonly Permission[],
  callbackPath = "/dashboard",
): Promise<Session["user"]> {
  const user =
    await requireAuthenticatedUser(
      callbackPath,
    );

  const allowed =
    permissions.every(
      (permission) =>
        hasPermission(
          user,
          permission,
        ),
    );

  if (allowed) {
    return user;
  }

  redirect("/forbidden");
}

/**
 * Role checks are useful for coarse UI behavior.
 *
 * Prefer permission checks for business operations.
 */
export async function requireRole(
  role: SystemRole,
  callbackPath = "/dashboard",
): Promise<Session["user"]> {
  const user =
    await requireAuthenticatedUser(
      callbackPath,
    );

  if (!hasRole(user, role)) {
    redirect("/forbidden");
  }

  return user;
}