"use client";

import { Info, Plus } from "lucide-react";
import type { RoleItem } from "./settings.mock";

interface RoleListCardProps {
  roles: RoleItem[];
  selectedRoleId: string;
  onSelectRole: (id: string) => void;
  onAddRole?: () => void;
}

export default function RoleListCard({
  roles,
  selectedRoleId,
  onSelectRole,
  onAddRole,
}: RoleListCardProps) {
  return (
    <div className="bg-white border border-[var(--brand-stroke)] rounded-2xl shadow-xs overflow-hidden flex flex-col h-full">
      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--brand-stroke)] bg-white">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center text-[var(--brand-green)]">
            <Info className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-bold text-[var(--brand-black-font)]">
            Roles
          </h2>
        </div>

        <button
          type="button"
          onClick={onAddRole}
          title="Add New Role"
          className="h-7 w-7 rounded-lg border border-[var(--brand-stroke)] hover:border-[var(--brand-green)] text-slate-500 hover:text-[var(--brand-green)] flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Role Items */}
      <div className="divide-y divide-[var(--brand-stroke)] flex-1 overflow-y-auto">
        {roles.map((role) => {
          const isSelected = role.id === selectedRoleId;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={[
                "w-full text-left px-5 py-4 transition-all flex flex-col gap-0.5 cursor-pointer relative",
                isSelected
                  ? "bg-[#E6F4F2] border-l-4 border-[var(--brand-green)]"
                  : "hover:bg-slate-50 border-l-4 border-transparent",
              ].join(" ")}
            >
              <span
                className={[
                  "text-xs font-bold transition-colors",
                  isSelected
                    ? "text-[var(--brand-black-font)]"
                    : "text-slate-700",
                ].join(" ")}
              >
                {role.name}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {role.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
