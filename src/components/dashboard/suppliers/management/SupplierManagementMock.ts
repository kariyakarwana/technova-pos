export type SupplierStatus = "Active" | "Inactive";

export interface SupplierManagementItem {
  id: string;
  supplierName: string;
  category: string;
  contactPerson: string;
  email: string;
  status: SupplierStatus;
}

export const MOCK_SUPPLIERS: SupplierManagementItem[] = [
  {
    id: "SUP-1001",
    supplierName: "Global Tech Supply Co.",
    category: "Electronics",
    contactPerson: "Sarah Jenkins",
    email: "s.jenkins@globaltech.com",
    status: "Active",
  },
  {
    id: "SUP-1002",
    supplierName: "Apex Materials Ltd.",
    category: "Raw Materials",
    contactPerson: "Marcus Chen",
    email: "mchen@apexmaterials.net",
    status: "Active",
  },
  {
    id: "SUP-1003",
    supplierName: "Nexus Logistics",
    category: "Logistics",
    contactPerson: "David Torres",
    email: "dtorres@nexuslogistics.com",
    status: "Inactive",
  },
  {
    id: "SUP-1004",
    supplierName: "Prime Apparel Group",
    category: "Apparel",
    contactPerson: "Elena Rostova",
    email: "elena@primeapparel.co",
    status: "Active",
  },
  {
    id: "SUP-1005",
    supplierName: "Quantum Electronics",
    category: "Electronics",
    contactPerson: "James Wilson",
    email: "j.wilson@quantumelec.com",
    status: "Active",
  },
];
