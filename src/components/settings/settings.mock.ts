export interface RoleItem {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface PermissionOption {
  id: string;
  label: string;
  description: string;
  group: "Core Operations" | "Administration & Finance" | "System Controls";
  locked?: boolean;
}

export const PERMISSION_GROUPS = [
  "Core Operations",
  "Administration & Finance",
  "System Controls",
] as const;

export const ALL_PERMISSIONS: PermissionOption[] = [
  // Group 1: Core Operations
  {
    id: "manage_inventory",
    label: "Manage Inventory",
    description: "Add, edit, or remove products and stock levels.",
    group: "Core Operations",
  },
  {
    id: "process_sales",
    label: "Process Sales",
    description: "Access POS and complete customer transactions.",
    group: "Core Operations",
  },

  // Group 2: Administration & Finance
  {
    id: "approve_pos",
    label: "Approve POs",
    description: "Authorize Purchase Orders over $1,000 limit.",
    group: "Administration & Finance",
  },
  {
    id: "view_reports",
    label: "View Reports",
    description: "Access financial, sales, and AI intelligence dashboards.",
    group: "Administration & Finance",
  },
  {
    id: "manage_users",
    label: "Manage Users",
    description: "Create accounts and assign role permissions.",
    group: "Administration & Finance",
  },

  // Group 3: System Controls
  {
    id: "access_settings",
    label: "Access Settings",
    description: "Required base permission. Cannot be removed.",
    group: "System Controls",
    locked: true,
  },
];

export const MOCK_ROLES: RoleItem[] = [
  {
    id: "super_admin",
    name: "Super Admin",
    description: "Full system access",
    permissions: [
      "manage_inventory",
      "process_sales",
      "approve_pos",
      "view_reports",
      "manage_users",
      "access_settings",
    ],
  },
  {
    id: "inventory_manager",
    name: "Inventory Manager",
    description: "Full system access",
    permissions: [
      "manage_inventory",
      "approve_pos",
      "view_reports",
      "access_settings",
    ],
  },
  {
    id: "branch_manager",
    name: "Branch Manager",
    description: "Full system access",
    permissions: [
      "manage_inventory",
      "process_sales",
      "approve_pos",
      "view_reports",
      "access_settings",
    ],
  },
  {
    id: "cashier",
    name: "Cashier",
    description: "Full system access",
    permissions: ["process_sales", "access_settings"],
  },
  {
    id: "supplier",
    name: "Supplier",
    description: "Full system access",
    permissions: ["view_reports", "access_settings"],
  },
];
