"use client";

import { Bell, Globe, Shield } from "lucide-react";
import type { SettingsTabId } from "./profile-settings.mock";

interface SettingsNavigationTabsProps {
  activeTab: SettingsTabId;
  onTabChange: (tab: SettingsTabId) => void;
}

export default function SettingsNavigationTabs({
  activeTab,
  onTabChange,
}: SettingsNavigationTabsProps) {
  const tabs = [
    {
      id: "security" as SettingsTabId,
      label: "Security",
      icon: Shield,
    },
    {
      id: "notifications" as SettingsTabId,
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "language_region" as SettingsTabId,
      label: "Language & Region",
      icon: Globe,
    },
  ];

  return (
    <div className="bg-white border border-[var(--brand-stroke)] rounded-2xl shadow-xs overflow-hidden divide-y divide-[var(--brand-stroke)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={[
              "w-full flex items-center gap-3 px-5 py-4 text-xs font-bold transition-all cursor-pointer select-none text-left relative",
              isActive
                ? "bg-emerald-50/70 text-[var(--brand-green)] border-l-4 border-[var(--brand-green)]"
                : "text-slate-700 hover:bg-slate-50 border-l-4 border-transparent",
            ].join(" ")}
          >
            <Icon
              className={[
                "h-4 w-4 shrink-0 transition-colors",
                isActive ? "text-[var(--brand-green)]" : "text-slate-500",
              ].join(" ")}
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
