import type { Metadata } from "next";
import SupplierPurchaseOrdersClientView from "@/components/dashboard/suppliers/purchase-orders/SupplierPurchaseOrdersClientView";

export const metadata: Metadata = {
  title: "Supplier Purchase Orders | TechNova POS",
  description: "Manage and monitor supplier purchase orders, filter statuses, and track fulfillment lifecycles.",
};

export default function SupplierPurchaseOrdersPage() {
  return <SupplierPurchaseOrdersClientView />;
}
