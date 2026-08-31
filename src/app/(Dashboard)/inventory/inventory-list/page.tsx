import type { Metadata } from "next";
import InventoryProductListView from "@/components/dashboard/inventory/list/InventoryProductListView";

export const metadata: Metadata = {
  title: "Inventory Product List | TechNova POS",
  description: "Browse inventory items, reorder levels, stock counts, and branch availability.",
};

export default function InventoryProductListPage() {
  return <InventoryProductListView />;
}
