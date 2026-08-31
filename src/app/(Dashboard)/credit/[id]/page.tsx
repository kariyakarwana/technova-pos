import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CreditAgreementDetailsClientView, { type CreditAgreementDetails } from "@/components/dashboard/credit/CreditAgreementDetailsClientView";
import { serverApi } from "@/lib/api/server";

export const metadata: Metadata = { title: "Credit Agreement | TechNova POS" };
export default async function CreditAgreementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let agreement: CreditAgreementDetails;
  try {
    agreement = await serverApi<CreditAgreementDetails>(
      `/credit/agreements/${encodeURIComponent(id)}`,
    );
  } catch {
    notFound();
  }
  return <CreditAgreementDetailsClientView agreement={agreement} />;
}
