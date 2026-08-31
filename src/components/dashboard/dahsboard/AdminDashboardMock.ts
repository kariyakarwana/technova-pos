export interface TopBannerMetric {
  title: string;
  amount: string;
  change: string;
  isPositive: boolean;
  bgGradient: string;
  iconName: "sales" | "sales_return" | "purchase" | "purchase_return";
}

export interface KpiCardItem {
  title: string;
  amount: string;
  changeText: string;
  isPositive: boolean;
  iconBg: string;
  iconColor: string;
  iconType: "profit" | "due" | "expense" | "payment_return";
}

export interface MonthlySalesPurchase {
  month: string;
  purchase: number;
  sales: number;
}

export interface TopProductItem {
  id: string;
  name: string;
  price: string;
  salesCount: string;
  trend: string;
  isPositive: boolean;
  imageUrl: string;
}

export interface LowStockItem {
  id: string;
  name: string;
  skuId: string;
  inStock: number;
  imageUrl: string;
}

export interface RecentSaleItem {
  id: string;
  name: string;
  category: string;
  price: string;
  date: string;
  status: "Processing" | "Cancelled" | "OnHold" | "Completed";
  imageUrl: string;
}

export interface TopCustomerItem {
  id: string;
  name: string;
  country: string;
  orderCount: string;
  spentAmount: string;
  avatarUrl: string;
}

export interface CategoryMetric {
  name: string;
  percentage: number;
  salesCount: number;
  color: string;
}

export interface HeatmapCell {
  day: string;
  time: string;
  value: number; // 0 to 4 intensity
  ordersCount: number;
}

export const MOCK_ADMIN_DASHBOARD = {
  bannerMetrics: [
    {
      title: "Total Sales",
      amount: "$48,988,078",
      change: "+22%",
      isPositive: true,
      bgGradient: "bg-gradient-to-r from-orange-400 to-amber-500",
      iconName: "sales" as const,
    },
    {
      title: "Total Sales Return",
      amount: "$16,478,145",
      change: "-22%",
      isPositive: false,
      bgGradient: "bg-[#092C4C]",
      iconName: "sales_return" as const,
    },
    {
      title: "Total Purchase",
      amount: "$24,145,789",
      change: "-22%",
      isPositive: true,
      bgGradient: "bg-[var(--brand-green)]",
      iconName: "purchase" as const,
    },
    {
      title: "Total Purchase Return",
      amount: "$18,458,747",
      change: "-22%",
      isPositive: true,
      bgGradient: "bg-blue-600",
      iconName: "purchase_return" as const,
    },
  ],
  kpiCards: [
    {
      title: "Profit",
      amount: "$8,458,798",
      changeText: "+35% vs Last Month",
      isPositive: true,
      iconBg: "bg-sky-50",
      iconColor: "text-sky-500",
      iconType: "profit" as const,
    },
    {
      title: "Invoice Due",
      amount: "$48,988,78",
      changeText: "-19% vs Last Month",
      isPositive: false,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      iconType: "due" as const,
    },
    {
      title: "Total Expenses",
      amount: "$8,980,097",
      changeText: "+41% vs Last Month",
      isPositive: true,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
      iconType: "expense" as const,
    },
    {
      title: "Total Payment Returns",
      amount: "$78,458,798",
      changeText: "-20% vs Last Month",
      isPositive: false,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
      iconType: "payment_return" as const,
    },
  ],
  monthlyTrends: [
    { month: "Jan", purchase: 48, sales: 15 },
    { month: "Feb", purchase: 35, sales: 22 },
    { month: "Mar", purchase: 23, sales: 13 },
    { month: "Apr", purchase: 47, sales: 15 },
    { month: "May", purchase: 42, sales: 24 },
    { month: "Jun", purchase: 47, sales: 15 },
    { month: "July", purchase: 23, sales: 13 },
    { month: "Aug", purchase: 28, sales: 19 },
    { month: "Sep", purchase: 46, sales: 42 },
    { month: "Oct", purchase: 32, sales: 12 },
    { month: "Nov", purchase: 44, sales: 28 },
    { month: "Dec", purchase: 30, sales: 18 },
  ],
  overallInformation: {
    suppliersCount: 6987,
    customersCount: 4896,
    ordersCount: 487,
    firstTimeAmount: "5.5K",
    firstTimeRate: "25%",
    returnAmount: "3.5K",
    returnRate: "21%",
  },
  topSellingProducts: [
    {
      id: "prod-1",
      name: "Charger Cable - Lighting",
      price: "$187",
      salesCount: "247+ Sales",
      trend: "25%",
      isPositive: true,
      imageUrl:
        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-2",
      name: "Yves Saint Eau De Parfum",
      price: "$145",
      salesCount: "289+ Sales",
      trend: "25%",
      isPositive: true,
      imageUrl:
        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-3",
      name: "Apple Airpods 2",
      price: "$458",
      salesCount: "300+ Sales",
      trend: "25%",
      isPositive: true,
      imageUrl:
        "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-4",
      name: "Vacuum Cleaner",
      price: "$139",
      salesCount: "225+ Sales",
      trend: "21%",
      isPositive: false,
      imageUrl:
        "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-5",
      name: "Samsung Galaxy S21 Fe 5g",
      price: "$898",
      salesCount: "365+ Sales",
      trend: "25%",
      isPositive: true,
      imageUrl:
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&auto=format&fit=crop&q=80",
    },
  ],
  lowStockProducts: [
    {
      id: "low-1",
      name: "Vacuum Cleaner Robot",
      skuId: "ID : #940004",
      inStock: 21,
      imageUrl:
        "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "low-2",
      name: "Dell XPS 13",
      skuId: "ID : #665814",
      inStock: 8,
      imageUrl:
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "low-3",
      name: "KitchenAid Stand Mixer",
      skuId: "ID : #325569",
      inStock: 14,
      imageUrl:
        "https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "low-4",
      name: "Levi's Trucker Jacket",
      skuId: "ID : #124588",
      inStock: 12,
      imageUrl:
        "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "low-5",
      name: "Lay's Classic",
      skuId: "ID : #365586",
      inStock: 10,
      imageUrl:
        "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=100&auto=format&fit=crop&q=80",
    },
  ],
  recentSales: [
    {
      id: "sale-1",
      name: "Apple Watch Series 9",
      category: "Electronics",
      price: "$640",
      date: "Today",
      status: "Processing" as const,
      imageUrl:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "sale-2",
      name: "Gold Bracelet",
      category: "Fashion",
      price: "$126",
      date: "Today",
      status: "Cancelled" as const,
      imageUrl:
        "https://images.unsplash.com/photo-1611591475817-f584e03d463b?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "sale-3",
      name: "Parachute Down Duvet",
      category: "Health",
      price: "$89",
      date: "15 Jan 2025",
      status: "OnHold" as const,
      imageUrl:
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "sale-4",
      name: "YETI Rambler Tumbler",
      category: "Sports",
      price: "$65",
      date: "12 Jan 2025",
      status: "Processing" as const,
      imageUrl:
        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "sale-5",
      name: "Osmo Genius Starter Kit",
      category: "Lifestyles",
      price: "$87.56",
      date: "11 Jan 2025",
      status: "Completed" as const,
      imageUrl:
        "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=100&auto=format&fit=crop&q=80",
    },
  ],
  topCustomers: [
    {
      id: "cust-1",
      name: "Carlos Curran",
      country: "USA",
      orderCount: "24 Orders",
      spentAmount: "$8965",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "cust-2",
      name: "Stan Gaunter",
      country: "UAE",
      orderCount: "22 Orders",
      spentAmount: "$6985",
      avatarUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "cust-3",
      name: "Richard Wilson",
      country: "Germany",
      orderCount: "14 Orders",
      spentAmount: "$5366",
      avatarUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "cust-4",
      name: "Mary Bronson",
      country: "Belgium",
      orderCount: "08 Orders",
      spentAmount: "$4569",
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "cust-5",
      name: "Annie Tremblay",
      country: "Greenland",
      orderCount: "14 Orders",
      spentAmount: "$35,698",
      avatarUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80",
    },
  ],
  topCategories: [
    { name: "Lifestyles", percentage: 50, salesCount: 456, color: "#F97316" },
    { name: "Sports", percentage: 24, salesCount: 545, color: "#991B1B" },
    { name: "Electronics", percentage: 16, salesCount: 698, color: "#0E9384" },
  ],
  categorySummary: {
    totalCategories: 698,
    totalProducts: 7899,
  },
  heatmapTimes: ["12 mp", "12 pm", "02 pm", "12 am", "10 am", "8 am", "6 am", "4 am", "2 am"],
  heatmapDays: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
};
