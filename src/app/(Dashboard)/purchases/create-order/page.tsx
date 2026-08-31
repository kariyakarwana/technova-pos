import type { Metadata } from "next";
import CreatePurchaseOrderClientView from "@/components/dashboard/purchases/create-order/CreatePurchaseOrderClientView";

export const metadata: Metadata = {
  title: "Create Purchases Order | TechNova POS",
  description: "Create and submit new purchase orders to suppliers with dynamic calculations and approval workflow.",
};

export default function CreatePurchaseOrderPage() {
  return <CreatePurchaseOrderClientView />;
}
