import { describe, expect, it } from "vitest";
import {
  canEditRolePermissions,
  getPermissionPresentation,
  getRequiredPagePermission,
  hasPageAccess,
  PERMISSIONS,
} from "./permissions";

describe("page permission catalogue", () => {
  it("maps the POS workspace to the sales management permission", () => {
    expect(getRequiredPagePermission("/pos")).toBe(PERMISSIONS.SALES_MANAGE);
    expect(getRequiredPagePermission("/pos/checkout")).toBe(
      PERMISSIONS.SALES_MANAGE,
    );
    expect(getPermissionPresentation(PERMISSIONS.SALES_MANAGE).label).toBe(
      "Point of Sale (POS)",
    );
  });

  it("allows a cashier to use only explicitly assigned pages", () => {
    const permissions = [PERMISSIONS.SALES_MANAGE];
    expect(hasPageAccess("/pos", permissions, ["CASHIER"])).toBe(true);
    expect(hasPageAccess("/employees", permissions, ["CASHIER"])).toBe(false);
  });

  it("keeps super administrators unrestricted and protected", () => {
    expect(hasPageAccess("/settings", [], ["SUPER_ADMIN"])).toBe(true);
    expect(canEditRolePermissions("SUPER_ADMIN")).toBe(false);
    expect(canEditRolePermissions("CASHIER")).toBe(true);
  });
});
