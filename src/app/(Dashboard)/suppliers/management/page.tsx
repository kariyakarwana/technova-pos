import type { Metadata } from "next";
import SupplierManagementClientView from "@/components/dashboard/suppliers/management/SupplierManagementClientView";

export const metadata: Metadata = {
  title: "Supplier Management | TechNova POS",
  description: "Browse supplier directory, filter by status and category, and manage vendor contacts.",
};

export default function SupplierManagementPage() {
  return <SupplierManagementClientView />;
}
