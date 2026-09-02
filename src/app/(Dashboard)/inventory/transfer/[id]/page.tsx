import type { Metadata } from "next";
import TransferDetail, { type TransferDetailData } from "@/components/operations/TransferDetail";
import { serverApi } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Transfer Details & Lifecycle | TechNova POS",
  description: "Monitor transfer lifecycle status, verify received items, and review audit trail history.",
};

interface TransferDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function TransferDetailsPage({
  params,
}: TransferDetailsPageProps) {
  const { id } = await params;
  const transfer = await serverApi<TransferDetailData>(`/inventory/transfers/${id}`);
  return <TransferDetail initial={transfer} />;
}
