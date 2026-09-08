import type { OrganizationSettings } from "./settings.types";

export function buildOrganizationUpdatePayload(
  organization: OrganizationSettings,
) {
  const { branding } = organization;
  return {
    name: organization.name,
    registrationNumber: organization.registrationNumber,
    phone: organization.phone,
    email: organization.email,
    address: organization.address,
    timezone: organization.timezone,
    currencyCode: organization.currencyCode,
    supplierPortalEnabled: organization.supplierPortalEnabled,
    supplierOrderChangesEnabled: organization.supplierOrderChangesEnabled,
    supplierEmailNotificationsEnabled:
      organization.supplierEmailNotificationsEnabled,
    supplierInAppNotificationsEnabled:
      organization.supplierInAppNotificationsEnabled,
    branding: branding
      ? {
          logoUrl: branding.logoUrl,
          receiptLogoUrl: branding.receiptLogoUrl,
          primaryColor: branding.primaryColor,
          secondaryColor: branding.secondaryColor,
        }
      : undefined,
  };
}
