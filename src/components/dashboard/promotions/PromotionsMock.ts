export interface PromotionStats {
  activePromotions: number;
  activeTrend: string;
  totalDiscounts: string;
  redemptionRate: string;
  redemptionTrend: string;
  revenueFromPromos: string;
  revenueTrend: string;
}

export type PromotionStatus = "Active" | "Upcoming" | "Expired" | "Paused";

export interface PromotionItem {
  id: string;
  name: string;
  code: string;
  status: PromotionStatus;
  type: string;
  validity: string;
  usageText: string;
  usagePercent?: number;
}

export interface PromotionActivityLogItem {
  id: string;
  title: string;
  highlightCode?: string;
  highlightUser?: string;
  subtitle: string;
  type: "success" | "warning" | "info";
  timeAgo: string;
}

export const MOCK_PROMOTIONS_DATA: {
  stats: PromotionStats;
  promotions: PromotionItem[];
  recentActivity: PromotionActivityLogItem[];
} = {
  stats: {
    activePromotions: 12,
    activeTrend: "+2",
    totalDiscounts: "$4,250",
    redemptionRate: "24.5%",
    redemptionTrend: "-1.2%",
    revenueFromPromos: "$18,400",
    revenueTrend: "+15%",
  },
  promotions: [
    {
      id: "promo-1",
      name: "Summer Sale 2024",
      code: "SUMMER24",
      status: "Active",
      type: "Percentage (15%)",
      validity: "Jun 1 - Aug 31",
      usageText: "450/1k",
      usagePercent: 45,
    },
    {
      id: "promo-2",
      name: "New User Welcome",
      code: "WELCOME10",
      status: "Active",
      type: "Fixed Amount ($10)",
      validity: "Ongoing",
      usageText: "1,240 used",
    },
    {
      id: "promo-3",
      name: "Black Friday Flash",
      code: "BF50",
      status: "Upcoming",
      type: "Percentage (50%)",
      validity: "Nov 24 - Nov 26",
      usageText: "0/5000",
      usagePercent: 0,
    },
    {
      id: "promo-4",
      name: "Free Shipping Weekend",
      code: "Auto-applied",
      status: "Active",
      type: "Free Shipping",
      validity: "Oct 14 - Oct 15",
      usageText: "89 orders",
    },
  ],
  recentActivity: [
    {
      id: "act-1",
      title: "SUMMER24 used by john.doe@email.com",
      highlightCode: "SUMMER24",
      highlightUser: "john.doe@email.com",
      subtitle: "Order #8921 • 2 mins ago",
      type: "success",
      timeAgo: "2 mins ago",
    },
    {
      id: "act-2",
      title: "WELCOME10 used by sarah.m@email.com",
      highlightCode: "WELCOME10",
      highlightUser: "sarah.m@email.com",
      subtitle: "Order #8920 • 15 mins ago",
      type: "success",
      timeAgo: "15 mins ago",
    },
    {
      id: "act-3",
      title: "Failed attempt: EXPIRED20",
      highlightCode: "EXPIRED20",
      highlightUser: "Guest User",
      subtitle: "Guest User • 1 hr ago",
      type: "warning",
      timeAgo: "1 hr ago",
    },
    {
      id: "act-4",
      title: "Free Shipping applied to cart",
      highlightCode: "Free Shipping",
      subtitle: "Order #8919 • 2 hrs ago",
      type: "info",
      timeAgo: "2 hrs ago",
    },
  ],
};
