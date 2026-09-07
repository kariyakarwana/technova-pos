import React from "react";
import SupplierPortalNavbar from "@/components/supplier-portal/layout/SupplierPortalNavbar";
import SupplierPortalSidebar from "@/components/supplier-portal/layout/SupplierPortalSidebar";
import { requireAuthenticatedUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function SupplierPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuthenticatedUser("/supplier-dashboard");
  if (!user.roles.includes("SUPPLIER")) redirect("/forbidden");
  if (user.mustChangePassword) redirect("/change-temporary-password");

  return (
    <div className="min-h-screen bg-[#F9F9FF] text-[#151C27] font-sans flex flex-col">
      <SupplierPortalNavbar userEmail={user.email} />

      <div className="flex flex-1">
        <aside className="w-72 shrink-0 border-r border-[rgba(190,201,194,0.4)] bg-white py-3 hidden md:block">
          <SupplierPortalSidebar />
        </aside>

        <main className="flex-1 bg-gray-50/30 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
