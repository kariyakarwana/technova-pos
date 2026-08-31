export interface PurchaseOrderItemEntry {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export const INITIAL_PO_ITEMS: PurchaseOrderItemEntry[] = [
  {
    id: "1",
    productName: "Galle",
    sku: "#001",
    quantity: 10,
    unitPrice: 1000.0,
    subtotal: 3400.0,
  },
  {
    id: "2",
    productName: "Colombo",
    sku: "#002",
    quantity: 20,
    unitPrice: 1000.0,
    subtotal: 8700.0,
  },
  {
    id: "3",
    productName: "Kaluthara",
    sku: "#003",
    quantity: 5,
    unitPrice: 1000.0,
    subtotal: 3400.0,
  },
];
