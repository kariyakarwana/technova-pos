import type { Metadata } from "next";
import AdminSettingsClientView from "@/components/settings/AdminSettingsClientView";
import type { ApiPermission, ApiRole, OrganizationSettings } from "@/components/settings/settings.types";
import { serverApi } from "@/lib/api/server";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Admin Settings & Role Permissions | TechNova POS",
  description:
    "Manage organization details, system preferences, roles, and granular permission access controls.",
};

export default async function SettingsPage() {
  const user = await requireAuthenticatedUser("/settings");
  const isSuperAdmin = user.roles.includes("SUPER_ADMIN");
  const canManageRoles = isSuperAdmin || user.permissions.includes("roles:manage");
  const canManageOrganization = isSuperAdmin || user.permissions.includes("settings:manage");
  const [organization, roles, permissions] = await Promise.all([
    serverApi<OrganizationSettings>("/organization"),
    canManageRoles ? serverApi<ApiRole[]>("/roles") : Promise.resolve([]),
    canManageRoles ? serverApi<ApiPermission[]>("/roles/permissions") : Promise.resolve([]),
  ]);
  return <AdminSettingsClientView initialOrganization={organization} initialRoles={roles} permissions={permissions} canManageOrganization={canManageOrganization} canManageRoles={canManageRoles} />;
}
