import type { Metadata } from "next";
import TransferOperations from "@/components/operations/TransferOperations";

export const metadata: Metadata = {
  title: "Stock Transfer Management | TechNova POS",
  description: "Track outgoing and incoming branch transfers, in-transit shipments, and transfer discrepancies.",
};

export default function StockTransferPage() {
  return <TransferOperations />;
}
