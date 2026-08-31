import type { Metadata } from "next";
import SupplierProfileClientView from "@/components/dashboard/suppliers/profile/SupplierProfileClientView";

export const metadata: Metadata = {
  title: "Supplier Profile & Details | TechNova POS",
  description: "View supplier performance metrics, lead times, reliability score, and AI inventory insights.",
};

interface SupplierProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function SupplierProfilePage({
  params,
}: SupplierProfilePageProps) {
  const { id } = await params;
  return <SupplierProfileClientView id={id} />;
}
