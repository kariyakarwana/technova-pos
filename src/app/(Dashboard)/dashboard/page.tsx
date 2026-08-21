import type {
  Metadata,
} from "next";

import {
  logoutAction,
} from "@/modules/auth/auth.actions";

import {
  PERMISSIONS,
} from "@/lib/auth/permissions";

import {
  requirePermission,
} from "@/lib/auth/session";


import Slidebar from "@/components/Dashboard/slidebar"

export const metadata: Metadata = {
  title: "Dashboard | TechNova POS",
};

export default async function DashboardPage() {
  const user =
    await requirePermission(
      PERMISSIONS.DASHBOARD_VIEW,
      "/dashboard",
    );

  return (
    <main className="min-h-screen bg-slate-50">

    </main>
  );
}
