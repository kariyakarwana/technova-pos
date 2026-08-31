import type { Metadata } from "next";
import AddOrderClientView from "@/components/dashboard/suppliers/add-order/AddOrderClientView";

export const metadata: Metadata = {
  title: "Create Purchase Order to Inventory | TechNova POS",
  description: "Draft and create new supplier purchase orders with live item tax and discount calculations.",
};

export default function CreateSupplierPurchaseOrderPage() {
  return <AddOrderClientView />;
}
