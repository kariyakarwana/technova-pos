import type { Metadata } from "next";
import PurchaseOrderClientView from "@/components/dashboard/purchases/order-management/PurchaseOrderClientView";

export const metadata: Metadata = {
  title: "Purchase Order Management | TechNova POS",
  description: "Manage purchase orders, suppliers, in-transit shipments, and approval workflows.",
};

export default function PurchaseOrderManagementPage() {
  return <PurchaseOrderClientView />;
}
