import type { Metadata } from "next";
import CustomerDetailsClientView from "@/components/dashboard/customers/details/CustomerDetailsClientView";

export const metadata: Metadata = {
  title: "Customer Profile & Details | TechNova POS",
  description: "View customer profile, personal details, loyalty point balance, purchase history, and reward logs.",
};

interface CustomerProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerProfilePage({
  params,
}: CustomerProfilePageProps) {
  const { id } = await params;
  return <CustomerDetailsClientView id={id} />;
}
