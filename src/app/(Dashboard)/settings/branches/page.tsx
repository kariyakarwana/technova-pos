import type { Metadata } from "next";
import BranchOperations from "@/components/operations/BranchOperations";

export const metadata: Metadata = {
  title: "Branches | TechNova POS",
  description: "Organization branch management and configuration.",
};

export default function SettingsBranchesPage() {
  return <BranchOperations />;
}
