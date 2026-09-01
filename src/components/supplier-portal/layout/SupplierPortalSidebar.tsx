"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";

export default function SupplierPortalSidebar() {
  const pathname = usePathname();
  const isActive =
    pathname === "/supplier-dashboard" || pathname.startsWith("/supplier-dashboard/");

  return (
    <nav
      aria-label="Supplier Portal Navigation"
      className="flex flex-col space-y-2 px-4 py-3 w-full"
    >
      <Link
        href="/supplier-dashboard"
        aria-current={isActive ? "page" : undefined}
        className={[
          "relative flex items-center h-11 w-full rounded-[16px]",
          "text-xs font-bold tracking-wide transition-all duration-200",
          "px-4 cursor-pointer select-none",
          isActive
            ? "bg-[#004532] text-white shadow-md"
            : "text-[#004532] border border-[#004532] bg-white hover:bg-slate-50",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 w-full">
          <LayoutDashboard className="h-5 w-5 shrink-0" />
          <span className="truncate flex-1 text-center font-bold text-sm">
            Dashboard
          </span>
        </div>
      </Link>
    </nav>
  );
}
