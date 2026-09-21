"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import Sidebar from "./slidebar";

interface DashboardShellProps {
  children: ReactNode;
  permissions: string[];
  roles: string[];
  userEmail?: string | null;
  organizationName?: string | null;
  logoUrl?: string | null;
  offlineBanner: ReactNode;
}

const STORAGE_KEY = "technova-dashboard-sidebar-collapsed";

export default function DashboardShell({
  children,
  permissions,
  roles,
  userEmail,
  organizationName,
  logoUrl,
  offlineBanner,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const isPosWorkspace = pathname === "/pos" || pathname.startsWith("/pos/");
  const isViewportLocked =
    isPosWorkspace ||
    pathname === "/ai-intelligence" ||
    pathname.startsWith("/ai-intelligence/");

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  useEffect(() => {
    if (!isViewportLocked) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isViewportLocked]);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <div
      className={`flex overflow-hidden bg-[#F9F9FF] font-sans text-[#151C27] ${
        isViewportLocked ? "fixed inset-0" : "h-dvh w-full"
      }`}
    >
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {offlineBanner}
        <Navbar
          userEmail={userEmail}
          organizationName={organizationName}
          logoUrl={logoUrl}
          sidebarCollapsed={collapsed}
          onSidebarToggle={toggleSidebar}
        />
        <div className="flex min-h-0 flex-1">
          <aside
            className={`hidden shrink-0 overflow-y-auto overscroll-contain border-r border-[rgba(190,201,194,0.4)] bg-white py-3 transition-[width] duration-200 ease-out md:block ${collapsed ? "w-20" : "w-72"}`}
          >
            <Sidebar permissions={permissions} roles={roles} collapsed={collapsed} />
          </aside>
          <main
            className={`min-h-0 min-w-0 flex-1 bg-gray-50/30 ${
              isPosWorkspace
                ? "overflow-hidden"
                : "overflow-y-auto overscroll-contain"
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
