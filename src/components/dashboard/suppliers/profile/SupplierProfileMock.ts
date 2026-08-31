export interface SupplierProfileData {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  location: string;
  category: string;
  partnerSince: string;
  reliabilityScore: number;
  reliabilityTrend: string;
  totalPurchasesYTD: string;
  avgLeadTime: string;
  avgLeadTimeTrend: string;
  aiInsightText: string;
  primaryContact: {
    name: string;
    role: string;
    email: string;
    phone: string;
    avatarUrl?: string;
  };
  recentActivities: Array<{
    id: string;
    title: string;
    timestamp: string;
    statusColor: "blue" | "gray" | "green";
  }>;
  reliabilityMonthlyTrend: Array<{
    month: string;
    rate: number;
  }>;
}

export const MOCK_SUPPLIER_PROFILE: SupplierProfileData = {
  id: "SUP-1001",
  name: "Global IT Traders",
  status: "Active",
  location: "Shenzhen, CN",
  category: "Enterprise Hardware",
  partnerSince: "2018",
  reliabilityScore: 94,
  reliabilityTrend: "↑ 2%",
  totalPurchasesYTD: "$1.2M",
  avgLeadTime: "3.5 Days",
  avgLeadTimeTrend: "+0.5",
  aiInsightText:
    "Global IT Traders has maintained a 98% on-time delivery rate over the last quarter. Based on upcoming seasonal demand patterns, we recommend increasing safety stock for SKU-8821 (Server Racks) by 15% before Q3 to mitigate potential regional shipping delays.",
  primaryContact: {
    name: "Sarah Chen",
    role: "Key Account Manager",
    email: "schen@globalit.cn",
    phone: "+86 (123) 456-7890",
    avatarUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  },
  recentActivities: [
    {
      id: "1",
      title: "PO-2023-089 Delivered",
      timestamp: "Today, 10:42 AM",
      statusColor: "blue",
    },
    {
      id: "2",
      title: "Invoice #INV-441 Paid",
      timestamp: "Oct 12, 2023",
      statusColor: "gray",
    },
    {
      id: "3",
      title: "Contract Renewed (1 Yr)",
      timestamp: "Sep 01, 2023",
      statusColor: "gray",
    },
  ],
  reliabilityMonthlyTrend: [
    { month: "May", rate: 91 },
    { month: "Jun", rate: 93 },
    { month: "Jul", rate: 90 },
    { month: "Aug", rate: 95 },
    { month: "Sep", rate: 92 },
    { month: "Oct", rate: 94 },
  ],
};
