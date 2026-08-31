export type SupplierPOStatus =
  | "Draft"
  | "Pending"
  | "Approved"
  | "Sent"
  | "Received"
  | "Completed";

export interface SupplierPurchaseOrderItem {
  id: string;
  poNumber: string;
  supplier: string;
  hasLogoBadge?: boolean;
  date: string;
  totalAmount: string;
  status: SupplierPOStatus;
}

export interface SupplierOrderStatusSummary {
  draft: number;
  pending: number;
  approved: number;
  sent: number;
  received: number;
  completed: number;
}

export const MOCK_SUPPLIER_PO_STATUS_COUNTS: SupplierOrderStatusSummary = {
  draft: 12,
  pending: 8,
  approved: 24,
  sent: 15,
  received: 9,
  completed: 142,
};

export const MOCK_SUPPLIER_PURCHASE_ORDERS: SupplierPurchaseOrderItem[] = [
  {
    id: "1",
    poNumber: "PO-2023-1042",
    supplier: "TechZone",
    date: "Oct 24, 2023",
    totalAmount: "$12,450.00",
    status: "Pending",
  },
  {
    id: "2",
    poNumber: "PO-2023-1041",
    supplier: "Alpha Electronics",
    date: "Oct 23, 2023",
    totalAmount: "$3,200.50",
    status: "Approved",
  },
  {
    id: "3",
    poNumber: "PO-2023-1040",
    supplier: "TechZone",
    hasLogoBadge: true,
    date: "Oct 21, 2023",
    totalAmount: "$8,900.00",
    status: "Completed",
  },
  {
    id: "4",
    poNumber: "PO-2023-1039",
    supplier: "Global Components",
    date: "Oct 20, 2023",
    totalAmount: "$1,150.00",
    status: "Draft",
  },
  {
    id: "5",
    poNumber: "PO-2023-1038",
    supplier: "Alpha Electronics",
    date: "Oct 18, 2023",
    totalAmount: "$45,000.00",
    status: "Sent",
  },
];
