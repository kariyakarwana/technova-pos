import type { Metadata } from "next";
import PromotionPerformanceClientView from "@/components/dashboard/promotions/performance/PromotionPerformanceClientView";

export const metadata: Metadata = {
  title: "Promotion Performance & Analytics | TechNova POS",
  description: "Evaluate promotional campaign ROI, discount redemption rates, conversion metrics, and revenue attribution.",
};

export default function PromotionPerformancePage() {
  return <PromotionPerformanceClientView />;
}
