import { AuthorizationError } from "./errors";

import type {
  Permission,
  SystemRole,
} from "./permissions";

export type AuthorizationSubject = {
  roles: readonly string[];
  permissions: readonly string[];
};

export function hasPermission(
  subject:
    | AuthorizationSubject
    | null
    | undefined,
  permission: Permission,
): boolean {
  return (
    subject?.permissions.includes(
      permission,
    ) ?? false
  );
}

export function hasAnyPermission(
  subject:
    | AuthorizationSubject
    | null
    | undefined,
  permissions: readonly Permission[],
): boolean {
  if (!subject) {
    return false;
  }

  return permissions.some(
    (permission) =>
      subject.permissions.includes(
        permission,
      ),
  );
}

export function hasAllPermissions(
  subject:
    | AuthorizationSubject
    | null
    | undefined,
  permissions: readonly Permission[],
): boolean {
  if (!subject) {
    return false;
  }

  return permissions.every(
    (permission) =>
      subject.permissions.includes(
        permission,
      ),
  );
}

export function hasRole(
  subject:
    | AuthorizationSubject
    | null
    | undefined,
  role: SystemRole,
): boolean {
  return (
    subject?.roles.includes(role) ??
    false
  );
}

export function hasAnyRole(
  subject:
    | AuthorizationSubject
    | null
    | undefined,
  roles: readonly SystemRole[],
): boolean {
  if (!subject) {
    return false;
  }

  return roles.some(
    (role) =>
      subject.roles.includes(role),
  );
}

export function assertPermission(
  subject:
    | AuthorizationSubject
    | null
    | undefined,
  permission: Permission,
): void {
  if (
    !hasPermission(
      subject,
      permission,
    )
  ) {
    throw new AuthorizationError();
  }
}

export function assertAllPermissions(
  subject:
    | AuthorizationSubject
    | null
    | undefined,
  permissions: readonly Permission[],
): void {
  if (
    !hasAllPermissions(
      subject,
      permissions,
    )
  ) {
    throw new AuthorizationError();
  }
}
