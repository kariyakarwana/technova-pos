import type { Metadata } from "next";
import TransferDetailsClientView from "@/components/dashboard/inventory/transfer-details/TransferDetailsClientView";

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
  return <TransferDetailsClientView id={id} />;
}
