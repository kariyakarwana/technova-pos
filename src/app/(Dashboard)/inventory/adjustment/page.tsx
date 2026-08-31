import type { Metadata } from "next";
import StockAdjustmentClientView from "@/components/dashboard/inventory/adjustment/StockAdjustmentClientView";

export const metadata: Metadata = {
  title: "Stock Adjustment | TechNova POS",
  description: "Track inventory adjustments, audit write-offs, stock increments, and approval workflows.",
};

export default function StockAdjustmentPage() {
  return <StockAdjustmentClientView />;
}
