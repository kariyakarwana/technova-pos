import type { Metadata } from "next";
import ReturnsManagementClientView from "@/components/dashboard/returns/ReturnsManagementClientView";

export const metadata: Metadata = {
  title: "Returns & Refunds Management | TechNova POS",
  description: "Monitor customer return requests, refund totals, return reasons distribution, and damaged inventory.",
};

export default function ReturnsRefundsPage() {
  return <ReturnsManagementClientView />;
}
