export type TransferStatus =
  | "In Transit"
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Completed";

export type TransferDirection = "outgoing" | "incoming";

export interface TransferItem {
  id: string;
  transferId: string;
  source: string;
  destination: string;
  items: number;
  value: string;
  status: TransferStatus;
  lastUpdated: string;
  direction: TransferDirection;
}

export const MOCK_TRANSFER_ITEMS: TransferItem[] = [
  {
    id: "1",
    transferId: "TRN-8823",
    source: "HQ Warehouse",
    destination: "Downtown Retail",
    items: 142,
    value: "$12,450.00",
    status: "In Transit",
    lastUpdated: "2 hrs ago",
    direction: "outgoing",
  },
  {
    id: "2",
    transferId: "TRN-8822",
    source: "HQ Warehouse",
    destination: "Uptown Outlet",
    items: 45,
    value: "$3,100.50",
    status: "Pending",
    lastUpdated: "5 hrs ago",
    direction: "outgoing",
  },
  {
    id: "3",
    transferId: "TRN-8821",
    source: "Northside Depot",
    destination: "HQ Warehouse",
    items: 8,
    value: "$850.00",
    status: "Approved",
    lastUpdated: "Yesterday",
    direction: "outgoing",
  },
  {
    id: "4",
    transferId: "TRN-8819",
    source: "Eastside Mall",
    destination: "HQ Warehouse",
    items: 12,
    value: "$1,200.00",
    status: "Rejected",
    lastUpdated: "Yesterday",
    direction: "outgoing",
  },
  {
    id: "5",
    transferId: "TRN-8810",
    source: "HQ Warehouse",
    destination: "Westend Store",
    items: 560,
    value: "$45,000.00",
    status: "Completed",
    lastUpdated: "Oct 24, 2023",
    direction: "outgoing",
  },
  {
    id: "6",
    transferId: "TRN-8790",
    source: "Central Distribution",
    destination: "HQ Warehouse",
    items: 85,
    value: "$9,200.00",
    status: "In Transit",
    lastUpdated: "3 hrs ago",
    direction: "incoming",
  },
  {
    id: "7",
    transferId: "TRN-8785",
    source: "Westside Mall",
    destination: "HQ Warehouse",
    items: 20,
    value: "$1,850.00",
    status: "Completed",
    lastUpdated: "Yesterday",
    direction: "incoming",
  },
];
