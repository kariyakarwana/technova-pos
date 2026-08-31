export interface ReturnHistoryItem {
  id: string;
  returnId: string;
  date: string;
  time: string;
  invoiceId: string;
  customer: string;
  reason: string;
  condition: "DAMAGED" | "RESALABLE";
  refundAmount: string;
  product: string;
  processedBy: string;
}

export const MOCK_RETURNS_HISTORY: ReturnHistoryItem[] = [
  {
    id: "1",
    returnId: "RET-8842",
    date: "Oct 28, 2023",
    time: "14:32",
    invoiceId: "INV-10923",
    customer: "Sarah Jenkins",
    reason: "Defective Product",
    condition: "DAMAGED",
    refundAmount: "$129.99",
    product: "Laptop",
    processedBy: "Mike T.",
  },
  {
    id: "2",
    returnId: "RET-8841",
    date: "Oct 28, 2023",
    time: "11:15",
    invoiceId: "INV-10899",
    customer: "David Chen",
    reason: "Wrong Size",
    condition: "RESALABLE",
    refundAmount: "$45.00",
    product: "Phone",
    processedBy: "Amanda R.",
  },
  {
    id: "3",
    returnId: "RET-8840",
    date: "Oct 27, 2023",
    time: "16:45",
    invoiceId: "INV-10755",
    customer: "Elena Rodriguez",
    reason: "Changed Mind",
    condition: "RESALABLE",
    refundAmount: "$89.50",
    product: "Mouse",
    processedBy: "Mike T.",
  },
  {
    id: "4",
    returnId: "RET-8839",
    date: "Oct 26, 2023",
    time: "09:30",
    invoiceId: "INV-10620",
    customer: "Guest Customer",
    reason: "Item Missing Parts",
    condition: "DAMAGED",
    refundAmount: "$210.00",
    product: "Speaker",
    processedBy: "Sarah L.",
  },
];
