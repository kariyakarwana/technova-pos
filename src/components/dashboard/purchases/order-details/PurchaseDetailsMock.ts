export interface LineItem {
  id: string;
  productName: string;
  sku: string;
  quantity: string;
  unitPrice: string;
  total: string;
}

export interface AuditLogItem {
  id: string;
  title: string;
  author: string;
  timestamp: string;
  statusColor: "yellow" | "gray" | "green" | "red";
}

export interface PurchaseOrderDetails {
  poNumber: string;
  supplierName: string;
  vendorId: string;
  contactName: string;
  contactEmail: string;
  shippingWarehouse: string;
  shippingAddress1: string;
  shippingAddress2: string;
  dateCreated: string;
  expectedDelivery: string;
  paymentTerms: string;
  department: string;
  lineItems: LineItem[];
  subtotal: string;
  tax: string;
  shipping: string;
  total: string;
  auditLogs: AuditLogItem[];
}

export const MOCK_PO_DETAILS: PurchaseOrderDetails = {
  poNumber: "#PO-2023-110",
  supplierName: "Global Electronics Ltd.",
  vendorId: "VEN-8842",
  contactName: "Sarah Jenkins",
  contactEmail: "sarah.j@globalelec.com",
  shippingWarehouse: "TechNova Main Warehouse",
  shippingAddress1: "124 Industrial Pkwy, Suite 100",
  shippingAddress2: "San Jose, CA 95134",
  dateCreated: "Oct 24, 2023",
  expectedDelivery: "Nov 05, 2023",
  paymentTerms: "Net 30",
  department: "IT Infrastructure",
  lineItems: [
    {
      id: "1",
      productName: "Quintom P",
      sku: "#001",
      quantity: "Cashier A",
      unitPrice: "08.9.2027",
      total: "3400.00",
    },
    {
      id: "2",
      productName: "NVMe",
      sku: "#002",
      quantity: "Cashier B",
      unitPrice: "08.3.2027",
      total: "8700.00",
    },
    {
      id: "3",
      productName: "Gigabit Switch",
      sku: "#003",
      quantity: "Cachier C",
      unitPrice: "08.5.2027",
      total: "3400.00",
    },
  ],
  subtotal: "$45,250.00",
  tax: "$3,846.25",
  shipping: "$150.00",
  total: "$49,246.25",
  auditLogs: [
    {
      id: "1",
      title: "Submitted for Approval",
      author: "By David Chen (Procurement)",
      timestamp: "Oct 24, 2023 • 14:32",
      statusColor: "yellow",
    },
    {
      id: "2",
      title: "Draft Created",
      author: "By David Chen (Procurement)",
      timestamp: "Oct 24, 2023 • 10:15",
      statusColor: "gray",
    },
  ],
};
