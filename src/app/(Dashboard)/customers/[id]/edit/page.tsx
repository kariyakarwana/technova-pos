import type { Metadata } from "next";
import UpdateCustomerClientView from "@/components/dashboard/customers/edit/UpdateCustomerClientView";

export const metadata: Metadata = {
  title: "Update Customer Information | TechNova POS",
  description: "Update customer personal records, contact information, addresses, and registration dates.",
};

interface UpdateCustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function UpdateCustomerPage({
  params,
}: UpdateCustomerPageProps) {
  const { id } = await params;
  return <UpdateCustomerClientView id={id} />;
}
