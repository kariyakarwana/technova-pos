import type { Metadata } from "next";
import SalesOperations from "@/components/operations/SalesOperations";

export const metadata: Metadata = {
  title: "Sales Report | TechNova POS",
  description: "Comprehensive sales report and product performance analytics.",
};

export default function SalesPage() {
  return <SalesOperations />;
}
