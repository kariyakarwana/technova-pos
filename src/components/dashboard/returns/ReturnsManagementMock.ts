export interface ReturnStats {
  totalRefunds: string;
  pendingReturns: number;
  returnRate: string;
  damagedStock: number;
}

export type ReturnStatus = "Pending" | "Approved" | "Rejected";

export interface ReturnRequestItem {
  id: string;
  returnId: string;
  date: string;
  customerName: string;
  avatarInitials: string;
  amount: string;
  status: ReturnStatus;
}

export interface ReturnReasonItem {
  label: string;
  percentage: number;
  color: string;
}

export const MOCK_RETURNS_DATA: {
  stats: ReturnStats;
  recentReturns: ReturnRequestItem[];
  reasons: {
    totalReturns: number;
    breakdown: ReturnReasonItem[];
  };
} = {
  stats: {
    totalRefunds: "$12,450.00",
    pendingReturns: 42,
    returnRate: "38%",
    damagedStock: 15,
  },
  recentReturns: [
    {
      id: "1",
      returnId: "#RET-8902",
      date: "Oct 24, 2023",
      customerName: "John Doe",
      avatarInitials: "JD",
      amount: "$129.99",
      status: "Pending",
    },
    {
      id: "2",
      returnId: "#RET-8901",
      date: "Oct 24, 2023",
      customerName: "Alice Smith",
      avatarInitials: "AS",
      amount: "$45.50",
      status: "Approved",
    },
    {
      id: "3",
      returnId: "#RET-8899",
      date: "Oct 23, 2023",
      customerName: "Robert Jones",
      avatarInitials: "RJ",
      amount: "$899.00",
      status: "Rejected",
    },
    {
      id: "4",
      returnId: "#RET-8898",
      date: "Oct 23, 2023",
      customerName: "Emma Williams",
      avatarInitials: "EW",
      amount: "$12.99",
      status: "Pending",
    },
    {
      id: "5",
      returnId: "#RET-8895",
      date: "Oct 22, 2023",
      customerName: "Michael Brown",
      avatarInitials: "MB",
      amount: "$245.00",
      status: "Approved",
    },
  ],
  reasons: {
    totalReturns: 142,
    breakdown: [
      {
        label: "Defective/Damaged",
        percentage: 45,
        color: "#0E9384",
      },
      {
        label: "Wrong Size/Item",
        percentage: 30,
        color: "#5EEAD4",
      },
      {
        label: "Changed Mind",
        percentage: 25,
        color: "#94A3B8",
      },
    ],
  },
};
