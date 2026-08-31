import type { Metadata } from "next";
import PromotionsDashboardClientView from "@/components/dashboard/promotions/PromotionsDashboardClientView";

export const metadata: Metadata = {
  title: "Promotions & Discounts Dashboard | TechNova POS",
  description: "Monitor active campaigns, coupon redemption rates, total discounts given, and recent promotional activity.",
};

export default function PromotionsPage() {
  return <PromotionsDashboardClientView />;
}
