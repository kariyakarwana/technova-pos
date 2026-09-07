"use client";

import {
  Check,
  Info,
  Layers,
  RotateCcw,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import type { ApiPermission, ApiRole } from "./settings.types";

interface RolePermissionsCardProps {
  currentRole: ApiRole;
  permissions: ApiPermission[];
  selectedPermissionIds: string[];
  onTogglePermission: (permissionId: string) => void;
  onReset: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function RolePermissionsCard({
  currentRole,
  permissions,
  selectedPermissionIds,
  onTogglePermission,
  onReset,
  onSave,
  isSaving = false,
}: RolePermissionsCardProps) {
  function getGroupIcon(group: string) {
    if (group === "Core Operations") {
      return <SlidersHorizontal className="h-4 w-4 text-slate-500" />;
    }
    if (group === "Administration & Finance") {
      return <Users className="h-4 w-4 text-slate-500" />;
    }
    return <Layers className="h-4 w-4 text-slate-500" />;
  }

  return (
    <div className="bg-white border border-[var(--brand-stroke)] rounded-2xl shadow-xs overflow-hidden flex flex-col h-full">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-[var(--brand-stroke)] bg-white">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center text-[var(--brand-green)]">
            <Info className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
            Edit Permissions ({currentRole.name})
          </h2>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            disabled={currentRole.isSystem}
            className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-[var(--brand-green)] text-[var(--brand-green)] bg-white hover:bg-emerald-50/40 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={isSaving || currentRole.isSystem}
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-[#0E7A6E] hover:bg-[#0C6A60] active:scale-[0.98] text-white text-xs font-bold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{currentRole.isSystem ? "System role" : isSaving ? "Saving..." : "Save Rules"}</span>
          </button>
        </div>
      </div>

      {/* Permission Groups Body */}
      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        {Array.from(new Set(permissions.map((permission) => permission.key.split(":")[0]))).map((group) => {
          const groupPermissions = permissions.filter((permission) => permission.key.startsWith(`${group}:`));

          return (
            <div key={group} className="space-y-3">
              {/* Group Title */}
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--brand-stroke)]">
                {getGroupIcon(group)}
                <h3 className="text-xs font-bold text-[var(--brand-black-font)] tracking-tight">
                  {group.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())}
                </h3>
              </div>

              {/* Group Checkbox Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupPermissions.map((perm) => {
                  const isChecked =
                    selectedPermissionIds.includes(perm.id);

                  return (
                    <div
                      key={perm.id}
                      onClick={() => {
                        if (!currentRole.isSystem) {
                          onTogglePermission(perm.id);
                        }
                      }}
                      className={[
                        "flex items-start gap-3 p-2.5 rounded-xl transition-all select-none",
                        currentRole.isSystem
                          ? "cursor-not-allowed opacity-80"
                          : "cursor-pointer hover:bg-slate-50",
                      ].join(" ")}
                    >
                      {/* Styled Checkbox */}
                      <div
                        className={[
                          "h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors border",
                          isChecked && !currentRole.isSystem
                            ? "bg-[#0E7A6E] border-[#0E7A6E] text-white"
                            : isChecked && currentRole.isSystem
                            ? "bg-slate-400 border-slate-400 text-white"
                            : "border-slate-300 bg-white",
                        ].join(" ")}
                      >
                        {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>

                      {/* Label & Description */}
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-[var(--brand-black-font)] block">
                          {perm.key.replaceAll(":", " · ").replaceAll("_", " ")}
                        </span>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                          {perm.description ?? "Allows this operation."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
