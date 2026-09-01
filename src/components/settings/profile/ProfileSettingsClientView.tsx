"use client";

import { useState } from "react";
import {
  MOCK_PROFILE_DATA,
  type DeviceSession,
  type SettingsTabId,
} from "./profile-settings.mock";
import ProfileSettingsHeader from "./ProfileSettingsHeader";
import ProfileInfoSidebarCard from "./ProfileInfoSidebarCard";
import SettingsNavigationTabs from "./SettingsNavigationTabs";
import TwoFactorAuthSection from "./TwoFactorAuthSection";
import ChangePasswordForm from "./ChangePasswordForm";
import RecentDevicesTable from "./RecentDevicesTable";

export default function ProfileSettingsClientView() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("security");
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(
    MOCK_PROFILE_DATA.isTwoFactorEnabled
  );
  const [devices, setDevices] = useState<DeviceSession[]>(
    MOCK_PROFILE_DATA.devices
  );

  function handleSignOutDevice(id: string) {
    if (confirm("Are you sure you want to sign out this device?")) {
      setDevices((prev) => prev.filter((d) => d.id !== id));
    }
  }

  return (
    <main className="min-h-screen bg-[var(--brand-app-bg)] p-6 space-y-6">
      {/* 1. Header */}
      <ProfileSettingsHeader />

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar (Profile Info + Navigation Tabs) */}
        <div className="lg:col-span-4 space-y-4">
          <ProfileInfoSidebarCard
            user={MOCK_PROFILE_DATA.user}
            onEditProfile={() => alert("Opening Edit Profile dialog...")}
          />

          <SettingsNavigationTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === "security" && (
            <>
              {/* Two-Step Verification Section */}
              <TwoFactorAuthSection
                isEnabled={isTwoFactorEnabled}
                onToggle={setIsTwoFactorEnabled}
                onManageAuthenticator={() =>
                  alert("Opening Authenticator App configuration...")
                }
              />

              {/* Password Change Form */}
              <ChangePasswordForm />

              {/* Recent Devices Table */}
              <RecentDevicesTable
                devices={devices}
                onSignOutDevice={handleSignOutDevice}
              />
            </>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white border border-[var(--brand-stroke)] rounded-2xl p-8 shadow-xs text-center space-y-2">
              <h3 className="text-base font-bold text-[var(--brand-black-font)]">
                Notification Preferences
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Configure email alerts, push notifications, and daily summaries for POS activities and purchase orders.
              </p>
            </div>
          )}

          {activeTab === "language_region" && (
            <div className="bg-white border border-[var(--brand-stroke)] rounded-2xl p-8 shadow-xs text-center space-y-2">
              <h3 className="text-base font-bold text-[var(--brand-black-font)]">
                Language & Regional Settings
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Select your default language, currency format, and regional timezone preferences.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
