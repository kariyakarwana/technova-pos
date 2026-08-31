import type { Metadata } from "next";
import StockReceiveClientView from "@/components/dashboard/inventory/receive/StockReceiveClientView";

export const metadata: Metadata = {
  title: "Stock Receive From Supplier | TechNova POS",
  description: "Receive, scan, and confirm stock inventory from suppliers and purchase orders.",
};

export default function StockReceivePage() {
  return <StockReceiveClientView />;
}
