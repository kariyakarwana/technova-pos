"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ProfileSettingsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Security & Profile Settings
        </h1>
        <p className="text-xs text-[var(--brand-muted-font)] font-medium mt-0.5">
          Manage your account security, notifications, and preferences.
        </p>
      </div>

      {/* Top Right Action Button */}
      <div>
        <Link
          href="/settings"
          className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl border border-[var(--brand-green)] text-[var(--brand-green)] bg-white hover:bg-emerald-50/40 text-xs font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Settings</span>
        </Link>
      </div>
    </div>
  );
}
