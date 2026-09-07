import SupplierOrderDetailClient, { type SupplierOrderDetail } from "@/components/supplier-portal/orders/SupplierOrderDetailClient";
import { serverApi } from "@/lib/api/server";

export default async function SupplierOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await serverApi<SupplierOrderDetail>(`/supplier-portal/orders/${id}`);
  return <SupplierOrderDetailClient initial={order} />;
}
