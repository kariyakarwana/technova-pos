import type { Metadata } from "next";
import PromotionDetailsClientView from "@/components/dashboard/promotions/details/PromotionDetailsClientView";

export const metadata: Metadata = { title: "Promotion Details | TechNova POS" };

export default function PromotionDetailsPage() {
  return <PromotionDetailsClientView />;
}
