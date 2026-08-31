export type POStatus =
  | "Delivered"
  | "Pending Approval"
  | "Cancelled"
  | "Completed"
  | "Approved"
  | "In Transit";

export interface PurchaseOrderItem {
  id: string;
  poNumber: string;
  supplier: string;
  date: string;
  totalAmount: string;
  status: POStatus;
}

export const MOCK_PURCHASE_ORDERS: PurchaseOrderItem[] = [
  {
    id: "1",
    poNumber: "#PO-2401-089",
    supplier: "Acme Corp Ltd.",
    date: "Oct 12, 2024",
    totalAmount: "$12,450.00",
    status: "Delivered",
  },
  {
    id: "2",
    poNumber: "#PO-2401-088",
    supplier: "Global Tech Supplies",
    date: "Sep 28, 2024",
    totalAmount: "$8,300.00",
    status: "Delivered",
  },
  {
    id: "3",
    poNumber: "#PO-2401-09",
    supplier: "Nexus Industries",
    date: "Oct 02, 2024",
    totalAmount: "$45,200.50",
    status: "Pending Approval",
  },
  {
    id: "4",
    poNumber: "#PO-2401-085",
    supplier: "Acme Corp Ltd.",
    date: "Oct 02, 2024",
    totalAmount: "$45,200.50",
    status: "Cancelled",
  },
  {
    id: "5",
    poNumber: "#PO-2401-084",
    supplier: "Omega Resources",
    date: "Oct 02, 2024",
    totalAmount: "$45,200.50",
    status: "Completed",
  },
  {
    id: "6",
    poNumber: "#PO-2401-085",
    supplier: "Acme Corp Ltd.",
    date: "Oct 02, 2024",
    totalAmount: "$45,200.50",
    status: "Approved",
  },
  {
    id: "7",
    poNumber: "#PO-2401-345",
    supplier: "Omega Resources",
    date: "Oct 09, 2024",
    totalAmount: "$45,204.50",
    status: "Approved",
  },
  {
    id: "8",
    poNumber: "#PO-2401-085",
    supplier: "Nexus Industries",
    date: "Oct 09, 2024",
    totalAmount: "$45,200.50",
    status: "Approved",
  },
  {
    id: "9",
    poNumber: "#PO-2601-087",
    supplier: "Acme Corp Ltd.",
    date: "Oct 02, 2024",
    totalAmount: "$45,056.70",
    status: "In Transit",
  },
  {
    id: "10",
    poNumber: "#PO-2401-056",
    supplier: "Acme Corp Ltd.",
    date: "Oct 02, 2024",
    totalAmount: "$45,450.50",
    status: "Approved",
  },
];
