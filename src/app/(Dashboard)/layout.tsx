import React from "react";
import Sidebar from "@/components/dashboard/slidebar";
import Navbar from "@/components/dashboard/navbar";
import { getCurrentUser } from "@/lib/auth/session";
import { OfflineProvider } from "@/components/dashboard/pos/OfflineContext";
import OfflineBannerController from "@/components/dashboard/pos/OfflineBannerController";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <OfflineProvider>
      <div className="min-h-screen bg-[#F9F9FF] text-[#151C27] font-sans flex flex-col">
        {/* Offline banner sits above the sticky Navbar when isOffline === true */}
        <OfflineBannerController />

        <Navbar userEmail={user?.email} />

        <div className="flex flex-1">
          <aside className="w-72 shrink-0 border-r border-[rgba(190,201,194,0.4)] bg-white py-3 hidden md:block">
            <Sidebar />
          </aside>

          <main className="flex-1 bg-gray-50/30 overflow-y-auto">{children}</main>
        </div>
      </div>
    </OfflineProvider>
  );
}

