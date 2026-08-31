import type { Metadata } from "next";
import SupplierPortalClientView from "@/components/supplier-portal/dashboard/SupplierPortalClientView";

export const metadata: Metadata = {
  title: "Supplier Dashboard | TechNova POS",
  description: "Supplier Portal for tracking active purchase orders, delivery statuses, and shipment fulfillment metrics.",
};

export default function SupplierDashboardPage() {
  return <SupplierPortalClientView />;
}
