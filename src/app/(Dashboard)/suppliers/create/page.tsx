import type { Metadata } from "next";
import AddSupplierClientView from "@/components/dashboard/suppliers/create/AddSupplierClientView";

export const metadata: Metadata = {
  title: "Add New Supplier | TechNova POS",
  description: "Create and register a new vendor or supplier with contact and financial terms.",
};

export default function AddSupplierPage() {
  return <AddSupplierClientView />;
}
