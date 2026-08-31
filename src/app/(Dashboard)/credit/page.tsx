import type { Metadata } from "next";
import CreditManagementClientView, { type CreditAgreement } from "@/components/dashboard/credit/CreditManagementClientView";
import { serverApi } from "@/lib/api/server";

export const metadata: Metadata = { title: "Credit Management | TechNova POS" };
type Paginated<T> = { data: T[] };
export default async function CreditPage() {
  let agreements: CreditAgreement[] = [];
  let loadError: string | undefined;
  try { agreements = (await serverApi<Paginated<CreditAgreement>>("/credit/agreements?page=1&pageSize=50")).data; }
  catch (error) { loadError = error instanceof Error ? error.message : "Unable to load credit agreements."; }
  return <CreditManagementClientView agreements={agreements} loadError={loadError} />;
}
