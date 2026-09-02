"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { BellRing, GitFork, History, Users, WifiOff } from "lucide-react";
import { apiPatch, apiPost } from "@/lib/api/client";
import AdminSettingsHeader from "./AdminSettingsHeader";
import OrganizationProfileCard from "./OrganizationProfileCard";
import RoleListCard from "./RoleListCard";
import RolePermissionsCard from "./RolePermissionsCard";
import type { ApiPermission, ApiRole, OrganizationSettings } from "./settings.types";

type Props = { initialOrganization: OrganizationSettings; initialRoles: ApiRole[]; permissions: ApiPermission[]; canManageOrganization: boolean; canManageRoles: boolean };

export default function AdminSettingsClientView({ initialOrganization, initialRoles, permissions, canManageOrganization, canManageRoles }: Props) {
  const router = useRouter();
  const [organization, setOrganization] = useState(initialOrganization);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [roles, setRoles] = useState(initialRoles);
  const [selectedRoleId, setSelectedRoleId] = useState(initialRoles[0]?.id ?? "");
  const [permissionState, setPermissionState] = useState<Record<string, string[]>>(Object.fromEntries(initialRoles.map((role) => [role.id, role.permissions.map((item) => item.permission.id)])));
  const [isSavingRules, setIsSavingRules] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const currentRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) || roles[0],
    [roles, selectedRoleId]
  );
  const selectedPermissionIds = currentRole ? permissionState[currentRole.id] ?? [] : [];

  function handleTogglePermission(permissionId: string) {
    if (!currentRole || currentRole.isSystem) return;
    setPermissionState((state) => ({ ...state, [currentRole.id]: selectedPermissionIds.includes(permissionId) ? selectedPermissionIds.filter((id) => id !== permissionId) : [...selectedPermissionIds, permissionId] }));
  }

  function handleResetPermissions() {
    if (currentRole) setPermissionState((state) => ({ ...state, [currentRole.id]: currentRole.permissions.map((item) => item.permission.id) }));
  }

  async function handleSaveRules() {
    if (!currentRole) return;
    setIsSavingRules(true);
    setNotice(null);
    try { await apiPatch(`/roles/${currentRole.id}`, { permissionIds: selectedPermissionIds }); setNotice("Role permissions saved successfully."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Unable to save permissions."); }
    finally { setIsSavingRules(false); }
  }

  async function handleSaveProfile() {
    if (!canManageOrganization) return setNotice("You have view-only access to organization settings.");
    if (!organization.name.trim()) return setNotice("Organization name is required.");
    setIsSavingProfile(true);
    setNotice(null);
    try { const updated = await apiPatch<OrganizationSettings>("/organization", organization); setOrganization(updated); setNotice("Organization profile saved successfully."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Unable to save organization."); }
    finally { setIsSavingProfile(false); }
  }

  async function handleAddRole() {
    if (!canManageRoles) return setNotice("Role-management permission is required.");
    const roleName = prompt("Enter new role name:");
    if (roleName && roleName.trim()) {
      try { const role = await apiPost<ApiRole>("/roles", { name: roleName.trim(), description: "Custom role", permissionIds: [] }); setRoles((prev) => [...prev, role]); setPermissionState((state) => ({ ...state, [role.id]: [] })); setSelectedRoleId(role.id); }
      catch (error) { setNotice(error instanceof Error ? error.message : "Unable to add role."); }
    }
  }

  async function handleEditRole(role: ApiRole) {
    if (role.isSystem) return setNotice("System role names cannot be changed.");
    const name = prompt("Edit role name:", role.name);
    if (name === null || !name.trim()) return;
    const description = prompt("Edit role description:", role.description ?? "") ?? role.description ?? "";
    setNotice(null);
    try {
      await apiPatch(`/roles/${role.id}`, { name: name.trim(), description: description.trim() });
      const normalizedName = name.trim().toUpperCase().replace(/\s+/g, "_");
      setRoles((current) => current.map((item) => item.id === role.id ? { ...item, name: normalizedName, description: description.trim() || null } : item));
      setNotice("Role details updated successfully.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to update role.");
    }
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <AdminSettingsHeader
        onProfileSettingsClick={() => router.push("/settings/profile")}
      />

      <div className="flex justify-end gap-2"><Link href="/settings/profile" className="rounded-lg border border-[#0E9384] px-4 py-2 text-xs font-semibold text-[#0E9384]">Profile & Security</Link><Link href="/audit-log" className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600">Audit Log</Link></div>
      {notice && <div role="status" className="rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">{notice}</div>}

      <section className="rounded-2xl border border-[var(--brand-stroke)] bg-white p-5">
        <div className="mb-4"><h2 className="text-sm font-bold">Admin Operations</h2><p className="text-xs text-slate-500">Open the administrative dashboards connected to the backend.</p></div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { href: "/employees", label: "Users & Access", icon: Users },
            { href: "/branches", label: "Branches", icon: GitFork },
            { href: "/audit-log", label: "Audit Log", icon: History },
            { href: "/notifications", label: "Notifications", icon: BellRing },
            { href: "/offline-sync", label: "Offline Sync", icon: WifiOff },
          ].map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-xs font-bold text-slate-700 transition hover:border-[#0E9384] hover:bg-teal-50"><Icon className="h-5 w-5 text-[#0E9384]" />{label}</Link>)}
        </div>
      </section>

      {/* 2. Organization Profile Card */}
      <OrganizationProfileCard
        organization={organization}
        onChange={setOrganization}
        onSave={handleSaveProfile}
        isSaving={isSavingProfile}
        readOnly={!canManageOrganization}
      />

      {/* 3. Roles & Permissions 2-Column Panel */}
      {canManageRoles ? <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[460px]">
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
      </div> : <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800"><h2 className="font-bold">Roles and permissions</h2><p className="mt-1">Your account can view organization settings but cannot manage roles.</p></section>}
    </main>
  );
}
