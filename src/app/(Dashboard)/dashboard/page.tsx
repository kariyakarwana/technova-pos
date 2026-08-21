import type {
  Metadata,
} from "next";



// import {
//   PERMISSIONS,
// } from "@/lib/auth/permissions";

// import {
//   requirePermission,
// } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Dashboard | TechNova POS",
};

export default async function DashboardPage() {
  // const user =
  //   await requirePermission(
  //     PERMISSIONS.DASHBOARD_VIEW,
  //     "/dashboard",
  //   );

  return (
    <main className="min-h-screen bg-slate-50">
      
    </main>
  );
}

