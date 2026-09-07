import type { Metadata } from "next";
import ProfileSettingsClientView from "@/components/settings/profile/ProfileSettingsClientView";
import { serverApi } from "@/lib/api/server";
import { requireAuthenticatedUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Security & Profile Settings | TechNova POS",
  description:
    "Manage your account security, two-factor authentication (2FA), password credentials, and active device sessions.",
};

export default async function ProfileSettingsPage() {
  const user = await requireAuthenticatedUser("/settings/profile");
  const sessions = await serverApi<Array<{ id: string; userAgent: string | null; createdAt: string; lastUsedAt: string | null }>>("/auth/sessions");
  return <ProfileSettingsClientView user={user} sessions={sessions} />;
}
