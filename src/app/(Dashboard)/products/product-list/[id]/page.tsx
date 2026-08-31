import type { Metadata } from "next";
import UpdateProductClientView from "@/components/dashboard/products/edit/UpdateProductClientView";

export const metadata: Metadata = {
  title: "Update Product | TechNova POS",
  description: "Modify product pricing, category mappings, barcode information, and custom warranty fields.",
};

export default function UpdateProductPage() {
  return <UpdateProductClientView />;
}
