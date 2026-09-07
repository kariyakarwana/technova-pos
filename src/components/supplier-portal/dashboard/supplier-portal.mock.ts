export interface SupplierPortalStats {
  pendingOrdersCount: number;
  pendingOrdersTrend: string;
  inTransitCount: number;
  inTransitSubtitle: string;
  completedMtdCount: number;
  completedMtdRate: string;
}

export type DeliveryStatus = "Pending response" | "Accepted" | "Changes proposed" | "Rejected" | "Dispatched" | "Received";

export interface SupplierPurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  totalAmount: string;
  deliveryStatus: DeliveryStatus;
  branchName?: string;
}

export const MOCK_SUPPLIER_PORTAL_DATA: {
  stats: SupplierPortalStats;
  orders: SupplierPurchaseOrder[];
} = {
  stats: {
    pendingOrdersCount: 14,
    pendingOrdersTrend: "-12% vs last month",
    inTransitCount: 8,
    inTransitSubtitle: "Active shipments",
    completedMtdCount: 142,
    completedMtdRate: "98% fulfillment rate",
  },
  orders: [
    {
      id: "po-1",
      poNumber: "#PO-2023-8841",
      date: "Oct 24, 2023",
      totalAmount: "$12,450.00",
      deliveryStatus: "Pending response",
    },
    {
      id: "po-2",
      poNumber: "#PO-2023-8839",
      date: "Oct 22, 2023",
      totalAmount: "$4,120.50",
      deliveryStatus: "Dispatched",
    },
    {
      id: "po-3",
      poNumber: "#PO-2023-8820",
      date: "Oct 18, 2023",
      totalAmount: "$28,900.00",
      deliveryStatus: "Received",
    },
    {
      id: "po-4",
      poNumber: "#PO-2023-8815",
      date: "Oct 15, 2023",
      totalAmount: "$1,250.00",
      deliveryStatus: "Pending response",
    },
    {
      id: "po-5",
      poNumber: "#PO-2023-8810",
      date: "Oct 12, 2023",
      totalAmount: "$8,340.00",
      deliveryStatus: "Received",
    },
    {
      id: "po-6",
      poNumber: "#PO-2023-8802",
      date: "Oct 10, 2023",
      totalAmount: "$15,750.00",
      deliveryStatus: "Dispatched",
    },
  ],
};
