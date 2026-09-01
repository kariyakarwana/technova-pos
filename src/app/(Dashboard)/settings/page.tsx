import type { Metadata } from "next";
import AdminSettingsClientView from "@/components/settings/AdminSettingsClientView";

export const metadata: Metadata = {
  title: "Admin Settings & Role Permissions | TechNova POS",
  description:
    "Manage organization details, system preferences, roles, and granular permission access controls.",
};

export default function SettingsPage() {
  return <AdminSettingsClientView />;
}
