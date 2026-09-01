import type { Metadata } from "next";
import AddProductClientView from "@/components/dashboard/products/add/AddProductClientView";

export const metadata: Metadata = {
  title: "Create Product | TechNova POS",
  description: "Create and register a new product with pricing, SKU, barcodes, and inventory alerts.",
};

export default function AddProductPage() {
  return <AddProductClientView />;
}
