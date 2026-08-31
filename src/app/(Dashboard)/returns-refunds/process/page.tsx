import type { Metadata } from "next";
import ProcessReturnClientView from "@/components/dashboard/returns/process/ProcessReturnClientView";

export const metadata: Metadata = {
  title: "Process Return | TechNova POS",
  description: "Interactive step-by-step wizard to lookup customer transactions, select return items, conditions, reasons, and authorize refunds.",
};

export default function ProcessReturnPage() {
  return <ProcessReturnClientView />;
}
