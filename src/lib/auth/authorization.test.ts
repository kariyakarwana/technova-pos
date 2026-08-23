import {
  describe,
  expect,
  it,
} from "vitest";

import {
  assertPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  hasRole,
} from "./authorization";

import {
  PERMISSIONS,
  SYSTEM_ROLES,
} from "./permissions";

import { AuthorizationError } from "./errors";

const subject = {
  roles: [
    SYSTEM_ROLES.CASHIER,
  ],

  permissions: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SALES_MANAGE,
  ],
};

describe("authorization helpers", () => {
  it("recognizes an assigned permission", () => {
    expect(
      hasPermission(
        subject,
        PERMISSIONS.DASHBOARD_VIEW,
      ),
    ).toBe(true);
  });

  it("rejects an unassigned permission", () => {
    expect(
      hasPermission(
        subject,
        PERMISSIONS.USERS_MANAGE,
      ),
    ).toBe(false);
  });

  it("supports any-permission checks", () => {
    expect(
      hasAnyPermission(
        subject,
        [
          PERMISSIONS.USERS_MANAGE,
          PERMISSIONS.SALES_MANAGE,
        ],
      ),
    ).toBe(true);
  });

  it("supports all-permission checks", () => {
    expect(
      hasAllPermissions(
        subject,
        [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.SALES_MANAGE,
        ],
      ),
    ).toBe(true);

    expect(
      hasAllPermissions(
        subject,
        [
          PERMISSIONS.DASHBOARD_VIEW,
          PERMISSIONS.USERS_MANAGE,
        ],
      ),
    ).toBe(false);
  });

  it("recognizes assigned roles", () => {
    expect(
      hasRole(
        subject,
        SYSTEM_ROLES.CASHIER,
      ),
    ).toBe(true);
  });

  it("throws a domain error when permission is missing", () => {
    expect(() =>
      assertPermission(
        subject,
        PERMISSIONS.USERS_MANAGE,
      ),
    ).toThrow(
      AuthorizationError,
    );
  });
});
