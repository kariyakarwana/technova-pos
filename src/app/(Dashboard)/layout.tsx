import React from "react";
import Sidebar from "@/components/dashboard/slidebar";
import Navbar from "@/components/dashboard/navbar";
import { getCurrentUser } from "@/lib/auth/session";
import { OfflineProvider } from "@/components/dashboard/pos/OfflineContext";
import OfflineBannerController from "@/components/dashboard/pos/OfflineBannerController";
import { BranchProvider, type BranchOption } from "@/components/dashboard/BranchContext";
import { serverApi } from "@/lib/api/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
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
      <div className="min-h-screen bg-[#F9F9FF] text-[#151C27] font-sans flex flex-col">
        {/* Offline banner sits above the sticky Navbar when isOffline === true */}
        <OfflineBannerController />

        <Navbar userEmail={user?.email} />

        <div className="flex flex-1">
          <aside className="w-72 shrink-0 border-r border-[rgba(190,201,194,0.4)] bg-white py-3 hidden md:block">
            <Sidebar permissions={user?.permissions ?? []} roles={user?.roles ?? []} />
          </aside>

          <main className="flex-1 bg-gray-50/30 overflow-y-auto">{children}</main>
        </div>
      </div>
    </OfflineProvider>
    </BranchProvider>
  );
}

