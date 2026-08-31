import type { Metadata } from "next";
import CreateAdjustmentClientView from "@/components/dashboard/inventory/create-adjustment/CreateAdjustmentClientView";

export const metadata: Metadata = {
  title: "Create Stock Adjustment | TechNova POS",
  description: "Create stock in and stock out adjustments with approval workflow and live impact balance preview.",
};

export default function CreateAdjustmentPage() {
  return <CreateAdjustmentClientView />;
}
