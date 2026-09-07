import type { Metadata } from "next";
import ProductForm from "@/components/operations/ProductForm";

export const metadata: Metadata = {
  title: "Create Product | TechNova POS",
  description: "Create and register a new product with pricing, SKU, barcodes, and inventory alerts.",
};

export default function AddProductPage() {
  return <ProductForm />;
}
