import type { Metadata } from "next";
import InventoryAlertsClientView from "@/components/dashboard/inventory/alerts/InventoryAlertsClientView";

export const metadata: Metadata = {
  title: "Stock Alerts | TechNova POS",
  description: "Monitor critical low stock thresholds, demand surges, and inter-branch transfers.",
};

export default function InventoryAlertsPage() {
  return <InventoryAlertsClientView />;
}
