import type { Metadata } from "next";
import PurchaseDetailsClientView from "@/components/dashboard/purchases/order-details/PurchaseDetailsClientView";

export const metadata: Metadata = {
  title: "Purchase Order Details | TechNova POS",
  description: "View and verify purchase order line items, supplier contacts, shipping warehouse, and audit trail.",
};

interface PurchaseOrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PurchaseOrderDetailsPage({
  params,
}: PurchaseOrderDetailsPageProps) {
  const { id } = await params;
  return <PurchaseDetailsClientView id={id} />;
}
