export interface MonthlySalesData {
  month: string;
  promoSales: number;
  totalSales: number;
}

export interface TopPromoMetric {
  id: string;
  name: string;
  conversionRate: string;
  percentageWidth: number;
  barColor: string;
}

export interface PromotionPerformanceItem {
  id: string;
  name: string;
  code: string;
  type: string;
  uses: string;
  conversionRate: string;
  isConversionPositive: boolean;
  totalDiscount: string;
  generatedRevenue: string;
  roi: string;
  isRoiPositive: boolean;
  status: "Active" | "Ended" | "Upcoming";
}

export const MOCK_PERFORMANCE_DATA: {
  monthlySales: MonthlySalesData[];
  topPromos: TopPromoMetric[];
  tableData: PromotionPerformanceItem[];
} = {
  monthlySales: [
    { month: "Jan", promoSales: 45, totalSales: 75 },
    { month: "Feb", promoSales: 38, totalSales: 75 },
    { month: "Mar", promoSales: 48, totalSales: 75 },
    { month: "Apr", promoSales: 34, totalSales: 75 },
    { month: "May", promoSales: 68, totalSales: 78 },
    { month: "Jun", promoSales: 72, totalSales: 78 },
    { month: "Jul", promoSales: 65, totalSales: 75 },
    { month: "Aug", promoSales: 76, totalSales: 80 },
    { month: "Sep", promoSales: 76, totalSales: 80 },
    { month: "Oct", promoSales: 79, totalSales: 80 },
    { month: "Nov", promoSales: 28, totalSales: 75 },
    { month: "Dec", promoSales: 79, totalSales: 80 },
  ],
  topPromos: [
    {
      id: "top-1",
      name: "Summer Flash Sale",
      conversionRate: "24.5% CR",
      percentageWidth: 92,
      barColor: "#0E9384",
    },
    {
      id: "top-2",
      name: "BOGO Weekend",
      conversionRate: "18.2% CR",
      percentageWidth: 74,
      barColor: "#0E9384",
    },
    {
      id: "top-3",
      name: "Welcome 10% Off",
      conversionRate: "12.1% CR",
      percentageWidth: 52,
      barColor: "#5EEAD4",
    },
    {
      id: "top-4",
      name: "Clearance 50%",
      conversionRate: "9.8% CR",
      percentageWidth: 40,
      barColor: "#93C5FD",
    },
    {
      id: "top-5",
      name: "VIP Early Access",
      conversionRate: "7.4% CR",
      percentageWidth: 26,
      barColor: "#BFDBFE",
    },
  ],
  tableData: [
    {
      id: "perf-1",
      name: "Summer Flash Sale",
      code: "SUMMER25",
      type: "25% Off",
      uses: "1,245",
      conversionRate: "24.5%",
      isConversionPositive: true,
      totalDiscount: "$12,450",
      generatedRevenue: "$84,200",
      roi: "576%",
      isRoiPositive: true,
      status: "Active",
    },
    {
      id: "perf-2",
      name: "BOGO Weekend",
      code: "BOGOFree",
      type: "Buy 1 Get 1",
      uses: "890",
      conversionRate: "18.2%",
      isConversionPositive: true,
      totalDiscount: "$8,900",
      generatedRevenue: "$42,100",
      roi: "373%",
      isRoiPositive: true,
      status: "Ended",
    },
    {
      id: "perf-3",
      name: "Welcome 10% Off",
      code: "WELCOME10",
      type: "10% Off",
      uses: "3,421",
      conversionRate: "12.1%",
      isConversionPositive: true,
      totalDiscount: "$15,200",
      generatedRevenue: "$152,000",
      roi: "900%",
      isRoiPositive: true,
      status: "Active",
    },
    {
      id: "perf-4",
      name: "Clearance 50%",
      code: "CLEAR50",
      type: "50% Off",
      uses: "412",
      conversionRate: "9.8%",
      isConversionPositive: false,
      totalDiscount: "$18,500",
      generatedRevenue: "$18,500",
      roi: "0%",
      isRoiPositive: false,
      status: "Active",
    },
  ],
};
