import type { Metadata } from "next";
import CustomerPurchasesClientView from "@/components/dashboard/purchases/customer-purchases/CustomerPurchasesClientView";

export const metadata: Metadata = {
  title: "Customer Purchases | TechNova POS",
  description: "View customer purchases history, transaction details, tax breakdowns, and discounts.",
};

export default function CustomerPurchasesPage() {
  return <CustomerPurchasesClientView />;
}
