import type { Metadata } from "next";
import SupplierDashboardClientView from "@/components/dashboard/suppliers/dashboard/SupplierDashboardClientView";

export const metadata: Metadata = {
  title: "Supplier Dashboard | TechNova POS",
  description: "Monitor supplier KPIs, purchase trends, payment statuses, and AI vendor insights.",
};

export default function SupplierDashboardPage() {
  return <SupplierDashboardClientView />;
}
