import type { Metadata } from "next";
import CreatePromotionClientView from "@/components/dashboard/promotions/create/CreatePromotionClientView";

export const metadata: Metadata = {
  title: "Create New Promotion | TechNova POS",
  description: "Create discounts, coupon campaigns, and promotional pricing strategies.",
};

export default function CreatePromotionPage() {
  return <CreatePromotionClientView />;
}
