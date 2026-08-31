"use client";

import Link from "next/link";
import { UserCog } from "lucide-react";

interface AdminSettingsHeaderProps {
  onProfileSettingsClick?: () => void;
}

export default function AdminSettingsHeader({
  onProfileSettingsClick,
}: AdminSettingsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-xs text-[var(--brand-muted-font)] font-medium mt-0.5">
          Manage organization details, roles, and system preferences.
        </p>
      </div>

      {/* Top Right Actions */}
      <div>
        <Link
          href="/settings/profile"
          onClick={onProfileSettingsClick}
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-[var(--brand-green)] text-[var(--brand-green)] bg-white hover:bg-emerald-50/40 text-xs font-semibold shadow-2xs transition-colors"
        >
          <UserCog className="h-3.5 w-3.5" />
          <span>Profile Settings</span>
        </Link>
      </div>
    </div>
  );
}
