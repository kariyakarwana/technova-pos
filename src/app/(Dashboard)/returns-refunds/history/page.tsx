import type { Metadata } from "next";
import ReturnsHistoryClientView from "@/components/dashboard/returns/history/ReturnsHistoryClientView";

export const metadata: Metadata = {
  title: "Returns History | TechNova POS",
  description: "Complete log and history of processed returns, damaged inventory, refunds, and operator details.",
};

export default function ReturnsHistoryPage() {
  return <ReturnsHistoryClientView />;
}
