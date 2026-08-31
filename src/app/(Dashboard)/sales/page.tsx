import type { Metadata } from "next";
import SalesClientView from "@/components/dashboard/sales/SalesClientView";

export const metadata: Metadata = {
  title: "Sales Report | TechNova POS",
  description: "Comprehensive sales report and product performance analytics.",
};

export default function SalesPage() {
  return <SalesClientView />;
}
