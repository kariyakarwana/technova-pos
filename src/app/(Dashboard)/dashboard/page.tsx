import type { Metadata } from "next";
import AdminDashboardClientView from "@/components/dashboard/dahsboard/AdminDashboardClientView";

export const metadata: Metadata = {
  title: "Admin Overview Dashboard | TechNova POS",
  description: "Comprehensive store analytics, sales and purchase metrics, inventory alerts, top customers, and order heatmap.",
};

export default function DashboardPage() {
  return <AdminDashboardClientView />;
}
