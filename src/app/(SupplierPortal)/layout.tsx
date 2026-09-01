import React from "react";
import Navbar from "@/components/dashboard/navbar";
import SupplierPortalSidebar from "@/components/supplier-portal/layout/SupplierPortalSidebar";
import { getCurrentUser } from "@/lib/auth/session";

export default async function SupplierPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#151C27] font-sans flex flex-col">
      <Navbar userEmail={user?.email} />

      <div className="flex flex-1">
        <aside className="w-72 shrink-0 border-r border-[rgba(190,201,194,0.4)] bg-white py-3 hidden md:block">
          <SupplierPortalSidebar />
        </aside>

        <main className="flex-1 bg-gray-50/30 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
