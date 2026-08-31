export type AdjustmentType = "Inc" | "Dec";
export type AdjustmentStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export interface AdjustmentItem {
  id: string;
  date: string;
  productName: string;
  sku: string;
  type: AdjustmentType;
  qty: number;
  reason: string;
  adjustedBy: string;
  status: AdjustmentStatus;
}

export const MOCK_ADJUSTMENT_ITEMS: AdjustmentItem[] = [
  {
    id: "1",
    date: "Oct 24, 2023",
    productName: "Wireless Earbuds Pro",
    sku: "WE-PRO-BLK",
    type: "Dec",
    qty: -15,
    reason: "Damaged during transit from supplier",
    adjustedBy: "Sarah Jenkins",
    status: "Pending",
  },
  {
    id: "2",
    date: "Oct 24, 2023",
    productName: "Smart Watch Series 5",
    sku: "SW-S5-SLV",
    type: "Inc",
    qty: 5,
    reason: "Found in stockroom back corner",
    adjustedBy: "Mike Ross",
    status: "Approved",
  },
  {
    id: "3",
    date: "Oct 23, 2023",
    productName: "Ergonomic Office Chair",
    sku: "CH-ERGO-01",
    type: "Dec",
    qty: -2,
    reason: "Display models written off",
    adjustedBy: "David Chen",
    status: "Pending",
  },
  {
    id: "4",
    date: "Oct 22, 2023",
    productName: "Mechanical Keyboard v2",
    sku: "KB-MECH-V2",
    type: "Inc",
    qty: 10,
    reason: "Inventory recount adjustment",
    adjustedBy: "Sarah Jenkins",
    status: "Rejected",
  },
  {
    id: "5",
    date: "Oct 20, 2023",
    productName: "USB-C Hub Multiport",
    sku: "HUB-USBC-8IN1",
    type: "Dec",
    qty: -3,
    reason: "Theft/Lost",
    adjustedBy: "System Admin",
    status: "Cancelled",
  },
];
