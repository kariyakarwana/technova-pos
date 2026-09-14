import type { Metadata } from "next";
import BranchOperations from "@/components/operations/BranchOperations";

export const metadata: Metadata = {
  title: "Add Branch | TechNova POS",
  description: "Create and register a new organization branch.",
};

export default function SettingsAddBranchPage() {
  return <BranchOperations initialShowForm={true} />;
}
