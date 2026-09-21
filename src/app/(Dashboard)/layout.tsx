import React from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getCurrentUser } from "@/lib/auth/session";
import { OfflineProvider } from "@/components/dashboard/pos/OfflineContext";
import OfflineBannerController from "@/components/dashboard/pos/OfflineBannerController";
import {
  BranchProvider,
  type BranchOption,
} from "@/components/dashboard/BranchContext";
import { serverApi } from "@/lib/api/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (user?.roles.includes("SUPPLIER")) redirect("/supplier-dashboard");
  if (user?.mustChangePassword) redirect("/change-temporary-password");
  const branches = user
    ? await serverApi<{
        data: Array<{ id: string; code: string; name: string; status: string }>;
      }>("/branches?pageSize=100")
        .then((result): BranchOption[] =>
          result.data.map((branch) => ({
            id: branch.id,
            code: branch.code,
            name: branch.name,
            isActive: branch.status === "ACTIVE",
          })),
        )
        .catch(() => [])
    : [];
  const organization = user
    ? await serverApi<{
        name: string;
        branding: { logoUrl: string | null; updatedAt: string } | null;
      }>("/organization").catch(() => null)
    : null;

  return (
    <BranchProvider branches={branches}>
      <OfflineProvider>
        <DashboardShell
          permissions={user?.permissions ?? []}
          roles={user?.roles ?? []}
          userEmail={user?.email}
          organizationName={organization?.name}
          logoUrl={`/api/backend/organization/logo/content?v=${encodeURIComponent(organization?.branding?.updatedAt ?? "current")}`}
          offlineBanner={<OfflineBannerController />}
        >
          {children}
        </DashboardShell>
      </OfflineProvider>
    </BranchProvider>
  );
}
