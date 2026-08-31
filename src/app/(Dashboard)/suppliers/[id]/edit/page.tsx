import type { Metadata } from "next";
import UpdateSupplierClientView from "@/components/dashboard/suppliers/edit/UpdateSupplierClientView";

export const metadata: Metadata = {
  title: "Update Supplier | TechNova POS",
  description: "Modify supplier credentials, contact details, payment terms, and credit limits.",
};

interface UpdateSupplierPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateSupplierPage({
  params,
}: UpdateSupplierPageProps) {
  const { id } = await params;
  return <UpdateSupplierClientView id={id} />;
}
