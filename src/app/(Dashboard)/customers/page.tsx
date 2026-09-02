import type { Metadata } from "next";
import CustomerOperations from "@/components/operations/CustomerOperations";

export const metadata: Metadata = {
  title: "Customer Management | TechNova POS",
  description: "View, manage, and search registered customers, contact information, addresses, and account statuses.",
};

export default function CustomersPage() {
  return <CustomerOperations />;
}
