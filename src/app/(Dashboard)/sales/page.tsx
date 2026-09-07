import type { Metadata } from "next";
import SalesOperations from "@/components/operations/SalesOperations";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Sales Report | TechNova POS",
  description: "Comprehensive sales report and product performance analytics.",
};

export default async function SalesPage() {
  const user = await getCurrentUser();
  return <SalesOperations isSuperAdmin={user?.roles.includes("SUPER_ADMIN") ?? false} />;
}
