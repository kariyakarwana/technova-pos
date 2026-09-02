import type { Metadata } from "next";
import ProductForm, { type EditableProduct } from "@/components/operations/ProductForm";
import { serverApi } from "@/lib/api/server";

export const metadata: Metadata = {
  title: "Update Product | TechNova POS",
  description: "Modify product pricing, category mappings, barcode information, and custom warranty fields.",
};

export default async function UpdateProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await serverApi<EditableProduct>(`/catalog/products/${id}`);
  return <ProductForm product={product} />;
}
