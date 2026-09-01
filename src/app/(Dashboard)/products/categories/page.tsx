import type { Metadata } from "next";
import CategoriesClientView from "@/components/dashboard/products/categories/CategoriesClientView";

export const metadata: Metadata = {
  title: "Category List | TechNova POS",
  description: "Manage product categories, subcategories, slugs, and taxonomy.",
};

export default function CategoriesPage() {
  return <CategoriesClientView />;
}
