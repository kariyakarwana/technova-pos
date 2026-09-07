import type { Metadata } from "next";
import InventoryOperations from "@/components/operations/InventoryOperations";

export const metadata: Metadata = {
  title: "Inventory Management | TechNova POS",
  description: "Monitor stock levels, inventory valuation, and stock alerts.",
};

export default function InventoryPage() {
  return <InventoryOperations />;
}
