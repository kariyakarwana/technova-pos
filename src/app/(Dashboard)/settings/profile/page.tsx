import type { Metadata } from "next";
import ProfileSettingsClientView from "@/components/settings/profile/ProfileSettingsClientView";

export const metadata: Metadata = {
  title: "Security & Profile Settings | TechNova POS",
  description:
    "Manage your account security, two-factor authentication (2FA), password credentials, and active device sessions.",
};

export default function ProfileSettingsPage() {
  return <ProfileSettingsClientView />;
}
