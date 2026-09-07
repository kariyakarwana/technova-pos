import type { Metadata } from "next";
import PurchaseOrderDetail, { type PurchaseDetail } from "@/components/operations/PurchaseOrderDetail";
import { serverApi } from "@/lib/api/server";

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
  const order = await serverApi<PurchaseDetail>(`/purchasing/orders/${id}`);
  return <PurchaseOrderDetail initial={order} />;
}
