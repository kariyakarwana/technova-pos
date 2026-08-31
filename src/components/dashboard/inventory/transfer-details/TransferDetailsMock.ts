export interface TransferLifecycleStep {
  id: string;
  label: string;
  timestamp: string;
  status: "completed" | "current" | "upcoming";
}

export interface TransferItemDetail {
  id: string;
  index: number;
  name: string;
  category: string;
  sku: string;
  expectedQty: number;
  receivedQtyStatus: "Pending" | "Verified" | "Discrepancy";
  status: "IN TRANSIT" | "RECEIVED" | "REJECTED";
}

export interface AuditLogEntry {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  author: string;
  type: "dispatched" | "approved" | "updated" | "created";
}

export interface TransferDetails {
  transferId: string;
  status: "Dispatched" | "Pending" | "Completed" | "Approved" | "Rejected";
  sourceName: string;
  sourceCode: string;
  sourceAuth: string;
  destinationName: string;
  destinationCode: string;
  destinationAttn: string;
  logisticsCarrier: string;
  logisticsTrackingNumber: string;
  totalExpectedUnits: number;
  lifecycle: TransferLifecycleStep[];
  items: TransferItemDetail[];
  auditLogs: AuditLogEntry[];
}

export const MOCK_TRANSFER_DETAILS: TransferDetails = {
  transferId: "TRF-2023-0891",
  status: "Dispatched",
  sourceName: "Main Warehouse",
  sourceCode: "WH-01",
  sourceAuth: "Sarah Jenkins",
  destinationName: "Downtown Retail",
  destinationCode: "BR-04",
  destinationAttn: "Mike Ross",
  logisticsCarrier: "Nova Logistics Co.",
  logisticsTrackingNumber: "TRK-99824A",
  totalExpectedUnits: 85,
  lifecycle: [
    {
      id: "1",
      label: "Created",
      timestamp: "Oct 12, 09:41 AM",
      status: "completed",
    },
    {
      id: "2",
      label: "Approved",
      timestamp: "Oct 12, 11:20 AM",
      status: "completed",
    },
    {
      id: "3",
      label: "Dispatched",
      timestamp: "Oct 13, 08:05 AM",
      status: "current",
    },
    {
      id: "4",
      label: "Received",
      timestamp: "Pending Verification",
      status: "upcoming",
    },
  ],
  items: [
    {
      id: "1",
      index: 1,
      name: "ThinkPad X1 Carbon Gen 10",
      category: "Electronics > Laptops",
      sku: "LP-TPX1-G10-001",
      expectedQty: 15,
      receivedQtyStatus: "Pending",
      status: "IN TRANSIT",
    },
    {
      id: "2",
      index: 2,
      name: 'Dell UltraSharp 27" 4K Monitor',
      category: "Peripherals > Monitors",
      sku: "MO-DELL-U2723QE",
      expectedQty: 20,
      receivedQtyStatus: "Pending",
      status: "IN TRANSIT",
    },
    {
      id: "3",
      index: 3,
      name: "Logitech MX Master 3S Mouse",
      category: "Peripherals > Mice",
      sku: "MS-LOGI-MX3S",
      expectedQty: 50,
      receivedQtyStatus: "Pending",
      status: "IN TRANSIT",
    },
  ],
  auditLogs: [
    {
      id: "1",
      title: "Marked as Dispatched",
      description: "Carrier picked up shipment. Tracking ID generated.",
      timestamp: "Oct 13, 08:05 AM",
      author: "System (Automated)",
      type: "dispatched",
    },
    {
      id: "2",
      title: "Transfer Approved",
      description: "Approved by Regional Manager.",
      timestamp: "Oct 12, 11:20 AM",
      author: "David Chen",
      type: "approved",
    },
    {
      id: "3",
      title: "Draft Updated",
      description: "Added item: Logitech MX Master 3S Mouse (Qty: 50)",
      timestamp: "Oct 12, 10:15 AM",
      author: "Sarah Jenkins",
      type: "updated",
    },
    {
      id: "4",
      title: "Transfer Request Created",
      description: "Initial draft created with 2 items.",
      timestamp: "Oct 12, 09:41 AM",
      author: "Sarah Jenkins",
      type: "created",
    },
  ],
};
