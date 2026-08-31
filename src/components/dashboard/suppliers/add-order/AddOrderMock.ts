export interface AddOrderLineItem {
  id: string;
  productName: string;
  sku: string;
  hasSparkle?: boolean;
  qty: number;
  unitCost: number;
  taxPercent: number;
  discountPercent: number;
}

export const INITIAL_ADD_ORDER_LINE_ITEMS: AddOrderLineItem[] = [
  {
    id: "1",
    productName: "Dell UltraSharp 27\" Monitor",
    sku: "HW-MON-27",
    qty: 5,
    unitCost: 350.0,
    taxPercent: 8,
    discountPercent: 0,
  },
  {
    id: "2",
    productName: "Logitech MX Master 3S",
    sku: "HW-MSE-MX",
    hasSparkle: true,
    qty: 5,
    unitCost: 99.0,
    taxPercent: 8,
    discountPercent: 5,
  },
];
