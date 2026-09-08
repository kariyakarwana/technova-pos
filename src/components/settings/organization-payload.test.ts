import { describe, expect, it } from "vitest";
import { buildOrganizationUpdatePayload } from "./organization-payload";
import type { OrganizationSettings } from "./settings.types";

describe("buildOrganizationUpdatePayload", () => {
  it("does not send API-managed organization or branding fields", () => {
    const organization = {
      id: "org-1",
      name: "TechNova POS",
      registrationNumber: "PV-TEST-001",
      phone: "+94715573709",
      email: "contact@example.com",
      address: { city: "Colombo" },
      timezone: "Asia/Colombo",
      currencyCode: "LKR",
      status: "ACTIVE",
      createdAt: "2026-09-08T00:00:00.000Z",
      updatedAt: "2026-09-08T00:00:00.000Z",
      supplierPortalEnabled: true,
      supplierOrderChangesEnabled: true,
      supplierEmailNotificationsEnabled: true,
      supplierInAppNotificationsEnabled: true,
      branding: {
        logoUrl: "http://localhost:9000/logo.png",
        receiptLogoUrl: null,
        primaryColor: "#0E9384",
        secondaryColor: null,
        logoObjectKey: "organizations/org-1/branding/logo.png",
        logoBucket: "technova-public",
        createdAt: "2026-09-08T00:00:00.000Z",
      },
    } as OrganizationSettings;

    const payload = buildOrganizationUpdatePayload(organization);

    expect(payload).not.toHaveProperty("id");
    expect(payload).not.toHaveProperty("status");
    expect(payload).not.toHaveProperty("createdAt");
    expect(payload).not.toHaveProperty("updatedAt");
    expect(payload.branding).toEqual({
      logoUrl: "http://localhost:9000/logo.png",
      receiptLogoUrl: null,
      primaryColor: "#0E9384",
      secondaryColor: null,
    });
  });
});
