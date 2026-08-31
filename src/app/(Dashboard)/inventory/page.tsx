import type { Metadata } from "next";
import InventoryClientView from "@/components/dashboard/inventory/InventoryClientView";

export const metadata: Metadata = {
  title: "Inventory Management | TechNova POS",
  description: "Monitor stock levels, inventory valuation, and stock alerts.",
};

export default function InventoryPage() {
  return <InventoryClientView />;
}
