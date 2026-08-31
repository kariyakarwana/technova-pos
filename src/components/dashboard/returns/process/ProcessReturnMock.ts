export interface ReturnLookupResult {
  invoiceNumber: string;
  purchaseDate: string;
  customerName: string;
  isVerified: boolean;
}

export interface ReturnableItem {
  id: string;
  name: string;
  sku: string;
  qty: number;
  price: number;
  condition: string;
  reason: string;
  isSelected: boolean;
}

export type ResolutionType = "original_method" | "store_credit" | "exchange";

export const MOCK_LOOKUP_DEFAULT: ReturnLookupResult = {
  invoiceNumber: "TXN-9982-A4",
  purchaseDate: "Oct 24, 2023",
  customerName: "Walk-in",
  isVerified: true,
};

export const MOCK_RETURNABLE_ITEMS: ReturnableItem[] = [
  {
    id: "item-1",
    name: "Ergonomic Desk Chair V2",
    sku: "CHR-882-BLK",
    qty: 1,
    price: 149.99,
    condition: "Resalable",
    reason: "Changed Mind",
    isSelected: true,
  },
  {
    id: "item-2",
    name: "Wireless Mechanical Keyboard",
    sku: "KBD-104-WHT",
    qty: 1,
    price: 89.5,
    condition: "Resalable",
    reason: "Changed Mind",
    isSelected: false,
  },
];
