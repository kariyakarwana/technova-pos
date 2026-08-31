export interface SupplierKPIData {
  totalSuppliers: number;
  totalSuppliersTrend: string;
  pendingPOs: number;
  pendingPOsStatus: string;
  overduePayments: string;
  overduePaymentsStatus: string;
  aiInsightText: string;
}

export interface PurchaseTrendDataPoint {
  month: string;
  value: number; // in Millions e.g. 1.2, 4.5
}

export interface PaymentStatusData {
  paidPercent: number;
  pendingPercent: number;
  overduePercent: number;
}

export const MOCK_SUPPLIER_DASHBOARD: {
  kpis: SupplierKPIData;
  purchaseTrends: PurchaseTrendDataPoint[];
  paymentStatus: PaymentStatusData;
} = {
  kpis: {
    totalSuppliers: 1248,
    totalSuppliersTrend: "+12%",
    pendingPOs: 342,
    pendingPOsStatus: "Requires Action",
    overduePayments: "$45.2k",
    overduePaymentsStatus: "Urgent",
    aiInsightText:
      "TechZone Distributors' lead times have increased by 15% this quarter. Consider diversifying microprocessor orders.",
  },
  purchaseTrends: [
    { month: "Jan", value: 1.2 },
    { month: "Feb", value: 1.9 },
    { month: "Mar", value: 1.5 },
    { month: "Apr", value: 2.2 },
    { month: "May", value: 2.8 },
    { month: "Jun", value: 2.5 },
    { month: "Jul", value: 3.1 },
    { month: "Aug", value: 2.9 },
    { month: "Sep", value: 3.5 },
    { month: "Oct", value: 3.2 },
    { month: "Nov", value: 4.1 },
    { month: "Dec", value: 4.5 },
  ],
  paymentStatus: {
    paidPercent: 65,
    pendingPercent: 25,
    overduePercent: 10,
  },
};
