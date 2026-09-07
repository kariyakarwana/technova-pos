export type PromotionLifecycleStatus = "ACTIVE" | "UPCOMING" | "EXPIRED" | "PAUSED" | "ARCHIVED";
export type PromotionType = "PERCENTAGE" | "FIXED_AMOUNT" | "PRICE_OVERRIDE";

export type PromotionItem = {
  id: string; code: string | null; name: string; description: string | null;
  type: PromotionType; value: number; minimumQuantity: number; maximumQuantity: number | null;
  startsAt: string | null; endsAt: string | null; priority: number; stackable: boolean;
  notifyEmail: boolean; notifyWhatsapp: boolean; promotionNotifiedAt: string | null;
  recordStatus: "ACTIVE" | "INACTIVE" | "ARCHIVED"; lifecycleStatus: PromotionLifecycleStatus;
  product: { id: string; sku: string; name: string } | null;
  usageCount: number; salesCount: number; unitsSold: number; totalDiscount: number; revenue: number;
};

export type PromotionActivity = {
  id: string; promotionId: string; promotionName: string; promotionCode: string | null; amount: number;
  sale: { id: string; invoiceNumber: string; status: string; createdAt: string; customer: { firstName: string; lastName: string } | null };
};

export type PromotionDashboard = {
  stats: { activePromotions: number; upcomingPromotions: number; totalDiscounts: number; revenueFromPromotions: number; redemptions: number };
  promotions: PromotionItem[];
  recentActivity: PromotionActivity[];
};

export type PromotionDetail = PromotionItem & { recentActivity: PromotionActivity[] };

export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 2 }).format(value);
}

export function formatPromotionOffer(promotion: PromotionItem) {
  if (promotion.type === "PERCENTAGE") return `${promotion.value}% off`;
  if (promotion.type === "FIXED_AMOUNT") return `${formatMoney(promotion.value)} off`;
  return `Special price ${formatMoney(promotion.value)}`;
}
