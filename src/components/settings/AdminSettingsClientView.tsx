"use client";

import { useMemo, useState } from "react";
import { MOCK_ROLES, type RoleItem } from "./settings.mock";
import AdminSettingsHeader from "./AdminSettingsHeader";
import OrganizationProfileCard from "./OrganizationProfileCard";
import RoleListCard from "./RoleListCard";
import RolePermissionsCard from "./RolePermissionsCard";

export default function AdminSettingsClientView() {
  // Organization profile state
  const [orgName, setOrgName] = useState("TechNova Smart POS Solutions");
  const [email, setEmail] = useState("contact@technova.com");
  const [phone, setPhone] = useState("+1 (555) 019-2834");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Roles state
  const [roles, setRoles] = useState<RoleItem[]>(MOCK_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("inventory_manager");
  const [isSavingRules, setIsSavingRules] = useState(false);

  // Active Role Object
  const currentRole = useMemo(
    () => roles.find((r) => r.id === selectedRoleId) || roles[0],
    [roles, selectedRoleId]
  );

  // Active Role Permissions
  const selectedPermissionIds = currentRole.permissions;

  function handleTogglePermission(permissionId: string) {
    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id !== selectedRoleId) return role;

        const exists = role.permissions.includes(permissionId);
        const updatedPermissions = exists
          ? role.permissions.filter((p) => p !== permissionId)
          : [...role.permissions, permissionId];

        return {
          ...role,
          permissions: updatedPermissions,
        };
      })
    );
  }

  function handleResetPermissions() {
    const originalRole = MOCK_ROLES.find((r) => r.id === selectedRoleId);
    if (originalRole) {
      setRoles((prevRoles) =>
        prevRoles.map((r) =>
          r.id === selectedRoleId
            ? { ...r, permissions: [...originalRole.permissions] }
            : r
        )
      );
    }
  }

  function handleSaveRules() {
    setIsSavingRules(true);
    setTimeout(() => {
      setIsSavingRules(false);
      alert(`Permissions for "${currentRole.name}" saved successfully!`);
    }, 500);
  }

  function handleSaveProfile() {
    if (!orgName.trim()) {
      alert("Please enter an Organization Name.");
      return;
    }
    if (!email.trim()) {
      alert("Please enter a Primary Contact Email.");
      return;
    }

    setIsSavingProfile(true);
    setTimeout(() => {
      setIsSavingProfile(false);
      alert("Organization profile changes saved successfully!");
    }, 500);
  }

  function handleAddRole() {
    const roleName = prompt("Enter new role name:");
    if (roleName && roleName.trim()) {
      const newId = roleName.toLowerCase().replace(/\s+/g, "_");
      const newRole: RoleItem = {
        id: newId,
        name: roleName.trim(),
        description: "Custom role",
        permissions: ["access_settings"],
      };
      setRoles((prev) => [...prev, newRole]);
      setSelectedRoleId(newId);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <AdminSettingsHeader
        onProfileSettingsClick={() =>
          alert("Opening Profile Settings dialog...")
        }
      />

      {/* 2. Organization Profile Card */}
      <OrganizationProfileCard
        orgName={orgName}
        onOrgNameChange={setOrgName}
        email={email}
        onEmailChange={setEmail}
        phone={phone}
        onPhoneChange={setPhone}
        onSave={handleSaveProfile}
        isSaving={isSavingProfile}
      />

      {/* 3. Roles & Permissions 2-Column Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[460px]">
        {/* Left Roles List Panel */}
        <div className="lg:col-span-4">
          <RoleListCard
            roles={roles}
            selectedRoleId={selectedRoleId}
            onSelectRole={setSelectedRoleId}
            onAddRole={handleAddRole}
          />
        </div>

        {/* Right Role Permissions Panel */}
        <div className="lg:col-span-8">
          <RolePermissionsCard
            currentRole={currentRole}
            selectedPermissionIds={selectedPermissionIds}
            onTogglePermission={handleTogglePermission}
            onReset={handleResetPermissions}
            onSave={handleSaveRules}
            isSaving={isSavingRules}
          />
        </div>
      </div>
    </main>
  );
}
