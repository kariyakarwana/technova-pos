"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LayoutDashboard } from "lucide-react";

export default function SupplierPortalSidebar() {
  const pathname = usePathname();
  const links = [
    { href: "/supplier-dashboard", label: "Purchase orders", icon: LayoutDashboard, active: pathname === "/supplier-dashboard" || pathname.startsWith("/supplier-dashboard/orders") },
    { href: "/supplier-dashboard/notifications", label: "Notifications", icon: Bell, active: pathname.startsWith("/supplier-dashboard/notifications") },
  ];

  return (
    <nav
      aria-label="Supplier Portal Navigation"
      className="flex flex-col space-y-2 px-4 py-3 w-full"
    >
      {links.map(({ href, label, icon: Icon, active }) => <Link
        key={href}
        href={href}
        aria-current={active ? "page" : undefined}
        className={[
          "relative flex items-center h-11 w-full rounded-[16px]",
          "text-xs font-bold tracking-wide transition-all duration-200",
          "px-4 cursor-pointer select-none",
          active
            ? "bg-[#004532] text-white shadow-md"
            : "text-[#004532] border border-[#004532] bg-white hover:bg-slate-50",
        ].join(" ")}
      >
        <div className="flex items-center gap-3 w-full">
          <Icon className="h-5 w-5 shrink-0" />
          <span className="truncate flex-1 text-center font-bold text-sm">
            {label}
          </span>
        </div>
      </Link>)}
    </nav>
  );
}
