export type AlertSeverity = "CRITICAL" | "WARNING";

export interface AlertItem {
  id: string;
  name: string;
  sku: string;
  severity: AlertSeverity;
  currentStock: number;
  velocityPerWeek: string;
  suggestedReorder: string;
  transferNote?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
}

export interface BranchAlertGroup {
  id: string;
  branchName: string;
  totalItemsCount: number;
  alerts: AlertItem[];
}

export const MOCK_BRANCH_ALERTS: BranchAlertGroup[] = [
  {
    id: "downtown",
    branchName: "Downtown Branch",
    totalItemsCount: 5,
    alerts: [
      {
        id: "1",
        name: "Apple AirPods Pro (2nd Gen)",
        sku: "EL-A-092",
        severity: "CRITICAL",
        currentStock: 1,
        velocityPerWeek: "14 units",
        suggestedReorder: "+20 units",
        primaryActionLabel: "Review Order →",
      },
      {
        id: "2",
        name: "Anker USB-C Fast Charger",
        sku: "AC-C-341",
        severity: "WARNING",
        currentStock: 12,
        velocityPerWeek: "28 units",
        suggestedReorder: "+50 units",
        primaryActionLabel: "Review Order →",
      },
    ],
  },
  {
    id: "uptown",
    branchName: "Uptown Mall Kiosk",
    totalItemsCount: 2,
    alerts: [
      {
        id: "3",
        name: "Screen Protector (iPhone 15)",
        sku: "SG-P-112",
        severity: "CRITICAL",
        currentStock: 0,
        velocityPerWeek: "45 units",
        suggestedReorder: "+100 units",
        transferNote: "Transfer available from Downtown (30 units).",
        primaryActionLabel: "Order Supplier →",
        secondaryActionLabel: "Initiate Transfer",
      },
    ],
  },
];
