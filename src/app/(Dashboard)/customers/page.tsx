import type { Metadata } from "next";
import CustomerManagementClientView from "@/components/dashboard/customers/management/CustomerManagementClientView";

export const metadata: Metadata = {
  title: "Customer Management | TechNova POS",
  description: "View, manage, and search registered customers, contact information, addresses, and account statuses.",
};

export default function CustomersPage() {
  return <CustomerManagementClientView />;
}
