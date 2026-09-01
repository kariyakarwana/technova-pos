import type { Metadata } from "next";
import AddCustomerClientView from "@/components/dashboard/customers/add/AddCustomerClientView";

export const metadata: Metadata = {
  title: "Add Customer Management | TechNova POS",
  description: "Create and register a new customer profile in TechNova POS.",
};

export default function CreateCustomerPage() {
  return <AddCustomerClientView />;
}
