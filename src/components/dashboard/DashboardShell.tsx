"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { hasPageAccess } from "@/lib/auth/permissions";
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
  const canAccessCurrentPage = hasPageAccess(pathname, permissions, roles);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    // The sidebar and main pane scroll independently; the document must not
    // introduce a third scrollbar around the viewport-sized dashboard shell.
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }

  return (
    <div
      className="fixed inset-0 flex overflow-hidden bg-[#F9F9FF] font-sans text-[#151C27] print:relative print:inset-auto print:overflow-visible"
    >
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden print:overflow-visible">
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
            className={`min-h-0 min-w-0 flex-1 bg-gray-50/30 print:overflow-visible ${
              isPosWorkspace
                ? "overflow-hidden"
                : "overflow-y-auto overscroll-contain"
            }`}
          >
            {canAccessCurrentPage ? (
              children
            ) : (
              <section className="m-6 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
                <ShieldAlert className="h-10 w-10 text-amber-600" />
                <h1 className="mt-4 text-lg font-bold text-slate-900">
                  Access not assigned
                </h1>
                <p className="mt-2 max-w-md text-sm text-slate-600">
                  Your role does not include permission for this feature. Ask an
                  administrator to enable it in Settings → Edit Permissions.
                </p>
                <Link
                  href="/dashboard"
                  className="mt-5 rounded-xl bg-[var(--brand-green)] px-4 py-2 text-sm font-bold text-white"
                >
                  Return to dashboard
                </Link>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
