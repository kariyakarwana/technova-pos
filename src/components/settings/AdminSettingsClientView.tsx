"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BellRing, GitFork, History, Users, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { apiDelete, apiPatch, apiPost, apiUpload } from "@/lib/api/client";
import AdminSettingsHeader from "./AdminSettingsHeader";
import { buildOrganizationUpdatePayload } from "./organization-payload";
import OrganizationProfileCard from "./OrganizationProfileCard";
import RoleListCard from "./RoleListCard";
import RolePermissionsCard from "./RolePermissionsCard";
import type {
  ApiPermission,
  ApiRole,
  OrganizationSettings,
} from "./settings.types";
import { canEditRolePermissions } from "@/lib/auth/permissions";

type Props = {
  initialOrganization: OrganizationSettings;
  initialRoles: ApiRole[];
  permissions: ApiPermission[];
  canManageOrganization: boolean;
  canManageRoles: boolean;
};

export default function AdminSettingsClientView({
  initialOrganization,
  initialRoles,
  permissions,
  canManageOrganization,
  canManageRoles,
}: Props) {
  const router = useRouter();
  const [organization, setOrganization] = useState(initialOrganization);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoRemoveRequested, setLogoRemoveRequested] = useState(false);
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState(
    initialRoles[0]?.id ?? "",
  );
  const [permissionState, setPermissionState] = useState<
    Record<string, string[]>
  >(
    Object.fromEntries(
      initialRoles.map((role) => [
        role.id,
        role.permissions.map((item) => item.permission.id),
      ]),
    ),
  );
  const [isSavingRules, setIsSavingRules] = useState(false);
  const currentRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) || roles[0],
    [roles, selectedRoleId],
  );
  const selectedPermissionIds = currentRole
    ? (permissionState[currentRole.id] ?? [])
    : [];

  function handleTogglePermission(permissionId: string) {
    if (!currentRole || !canEditRolePermissions(currentRole.name)) return;
    setPermissionState((state) => ({
      ...state,
      [currentRole.id]: selectedPermissionIds.includes(permissionId)
        ? selectedPermissionIds.filter((id) => id !== permissionId)
        : [...selectedPermissionIds, permissionId],
    }));
  }

  function handleResetPermissions() {
    if (currentRole)
      setPermissionState((state) => ({
        ...state,
        [currentRole.id]: currentRole.permissions.map(
          (item) => item.permission.id,
        ),
      }));
  }

  async function handleSaveRules() {
    if (!currentRole || !canEditRolePermissions(currentRole.name)) return;
    setIsSavingRules(true);
    try {
      await apiPatch(`/roles/${currentRole.id}`, {
        permissionIds: selectedPermissionIds,
      });
      toast.success("Role permissions saved successfully.", { duration: 5000 });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save permissions.",
        { duration: 8000 },
      );
    } finally {
      setIsSavingRules(false);
    }
  }

  async function handleSaveProfile() {
    if (!canManageOrganization) {
      toast.error("You have view-only access to organization settings.", {
        duration: 8000,
      });
      return;
    }
    if (!organization.name.trim()) {
      toast.error("Organization name is required.", { duration: 8000 });
      return;
    }
    setIsSavingProfile(true);
    try {
      const updatedProfile = await apiPatch<OrganizationSettings>(
        "/organization",
        buildOrganizationUpdatePayload(organization),
      );
      let updated = updatedProfile;
      if (logoFile)
        updated = await apiUpload<OrganizationSettings>(
          "/organization/logo",
          logoFile,
        );
      else if (logoRemoveRequested)
        updated = await apiDelete<OrganizationSettings>("/organization/logo");
      setOrganization(updated);
      setLogoFile(null);
      setLogoRemoveRequested(false);
      toast.success(
        logoFile
          ? "Organization profile and company logo saved successfully."
          : logoRemoveRequested
            ? "Organization profile saved and company logo removed."
            : "Organization profile saved successfully.",
        { duration: 5000 },
      );
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save organization.",
        { duration: 8000 },
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleAddRole() {
    if (!canManageRoles) {
      toast.error("Role-management permission is required.", {
        duration: 8000,
      });
      return;
    }
    const roleName = prompt("Enter new role name:");
    if (roleName && roleName.trim()) {
      try {
        const role = await apiPost<ApiRole>("/roles", {
          name: roleName.trim(),
          description: "Custom role",
          permissionIds: [],
        });
        setRoles((prev) => [...prev, role]);
        setPermissionState((state) => ({ ...state, [role.id]: [] }));
        setSelectedRoleId(role.id);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to add role.",
          { duration: 8000 },
        );
      }
    }
  }

  async function handleEditRole(role: ApiRole) {
    if (role.isSystem) {
      toast.error("System role names cannot be changed.", { duration: 8000 });
      return;
    }
    const name = prompt("Edit role name:", role.name);
    if (name === null || !name.trim()) return;
    const description =
      prompt("Edit role description:", role.description ?? "") ??
      role.description ??
      "";
    try {
      await apiPatch(`/roles/${role.id}`, {
        name: name.trim(),
        description: description.trim(),
      });
      const normalizedName = name.trim().toUpperCase().replace(/\s+/g, "_");
      setRoles((current) =>
        current.map((item) =>
          item.id === role.id
            ? {
                ...item,
                name: normalizedName,
                description: description.trim() || null,
              }
            : item,
        ),
      );
      toast.success("Role details updated successfully.", { duration: 5000 });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update role.",
        { duration: 8000 },
      );
    }
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <AdminSettingsHeader
        onProfileSettingsClick={() => router.push("/settings/profile")}
      />

      <div className="flex justify-end gap-2">
        <Link
          href="/settings/profile"
          className="rounded-lg border border-[#0E9384] px-4 py-2 text-xs font-semibold text-[#0E9384]"
        >
          Profile & Security
        </Link>
        <Link
          href="/audit-log"
          className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600"
        >
          Audit Log
        </Link>
      </div>

      <section className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-5">
        <div className="mb-4">
          <h2 className="text-sm font-bold">Admin Operations</h2>
          <p className="text-xs text-slate-500">
            Open the administrative dashboards connected to the backend.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { href: "/employees", label: "Users & Access", icon: Users },
            { href: "/branches", label: "Branches", icon: GitFork },
            { href: "/audit-log", label: "Audit Log", icon: History },
            { href: "/notifications", label: "Notifications", icon: BellRing },
            { href: "/offline-sync", label: "Offline Sync", icon: WifiOff },
          ].map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-xs font-bold text-slate-700 transition hover:border-[#0E9384] hover:bg-teal-50"
            >
              <Icon className="h-5 w-5 text-[#0E9384]" />
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Organization Profile Card */}
      <OrganizationProfileCard
        organization={organization}
        onChange={setOrganization}
        onSave={handleSaveProfile}
        isSaving={isSavingProfile}
        readOnly={!canManageOrganization}
        logoFile={logoFile}
        logoRemoveRequested={logoRemoveRequested}
        onLogoFileChange={(file) => {
          setLogoFile(file);
          setLogoRemoveRequested(false);
        }}
        onLogoRemove={() => {
          setLogoFile(null);
          setLogoRemoveRequested(true);
        }}
      />

      {/* 3. Roles & Permissions 2-Column Panel */}
      {canManageRoles ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[460px]">
          {/* Left Roles List Panel */}
          <div className="lg:col-span-4">
            <RoleListCard
              roles={roles}
              selectedRoleId={selectedRoleId}
              onSelectRole={setSelectedRoleId}
              onAddRole={handleAddRole}
              onEditRole={handleEditRole}
            />
          </div>

          {/* Right Role Permissions Panel */}
          <div className="lg:col-span-8">
            <RolePermissionsCard
              currentRole={currentRole}
              permissions={permissions}
              selectedPermissionIds={selectedPermissionIds}
              onTogglePermission={handleTogglePermission}
              onReset={handleResetPermissions}
              onSave={handleSaveRules}
              isSaving={isSavingRules}
            />
          </div>
        </div>
      ) : (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          <h2 className="font-bold">Roles and permissions</h2>
          <p className="mt-1">
            Your account can view organization settings but cannot manage roles.
          </p>
        </section>
      )}
    </main>
  );
}
