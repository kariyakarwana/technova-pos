"use client";

import BackButton from "@/components/ui/back-button";

export default function ProfileSettingsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-xl font-bold text-[var(--brand-black-font)] tracking-tight">
          Security & Profile Settings
        </h1>
        <p className="text-xs text-[var(--brand-muted-font)] font-medium mt-0.5">
          Manage your account security, notifications, and preferences.
        </p>
      </div>

      <div>
        <BackButton href="/settings" label="Back to Settings" />
      </div>
    </div>
  );
}
