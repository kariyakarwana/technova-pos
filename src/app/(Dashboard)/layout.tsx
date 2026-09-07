import React from "react";
import Sidebar from "@/components/dashboard/slidebar";
import Navbar from "@/components/dashboard/navbar";
import { getCurrentUser } from "@/lib/auth/session";
import { OfflineProvider } from "@/components/dashboard/pos/OfflineContext";
import OfflineBannerController from "@/components/dashboard/pos/OfflineBannerController";
import { BranchProvider, type BranchOption } from "@/components/dashboard/BranchContext";
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
    ? await serverApi<{ data: Array<{ id: string; code: string; name: string; status: string }> }>("/branches?pageSize=100")
        .then((result): BranchOption[] => result.data.map((branch) => ({
          id: branch.id,
          code: branch.code,
          name: branch.name,
          isActive: branch.status === "ACTIVE",
        })))
        .catch(() => [])
    : [];

  return (
    <BranchProvider branches={branches}>
    <OfflineProvider>
      <div className="flex h-screen overflow-hidden bg-[#F9F9FF] font-sans text-[#151C27]">
        {/* Offline banner sits above the sticky Navbar when isOffline === true */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <OfflineBannerController />
          <Navbar userEmail={user?.email} />
          <div className="flex min-h-0 flex-1">
          <aside className="hidden w-72 shrink-0 overflow-y-auto overscroll-contain border-r border-[rgba(190,201,194,0.4)] bg-white py-3 md:block">
            <Sidebar permissions={user?.permissions ?? []} roles={user?.roles ?? []} />
          </aside>

          <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain bg-gray-50/30">{children}</main>
          </div>
        </div>
      </div>
    </OfflineProvider>
    </BranchProvider>
  );
}

