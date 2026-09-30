/**
 * Central permission catalogue.
 *
 * Use these constants instead of repeating permission strings
 * throughout the application.
 */
export const PERMISSIONS = {
  DASHBOARD_VIEW:
    "dashboard:view",

  USERS_MANAGE:
    "users:manage",

  ROLES_MANAGE:
    "roles:manage",

  AUDIT_VIEW:
    "audit:view",

  SALES_MANAGE:
    "sales:manage",

  INVENTORY_MANAGE:
    "inventory:manage",

  PURCHASES_MANAGE:
    "purchases:manage",

  SETTINGS_MANAGE:
    "settings:manage",
  SETTINGS_VIEW: "settings:view",
  REPORTS_VIEW: "reports:view",
  BRANCHES_VIEW: "branches:view",
  BRANCHES_MANAGE: "branches:manage",
  PRODUCTS_VIEW: "products:view",
  PRODUCTS_MANAGE: "products:manage",
  INVENTORY_VIEW: "inventory:view",
  PURCHASES_VIEW: "purchases:view",
  SUPPLIERS_VIEW: "suppliers:view",
  SUPPLIERS_MANAGE: "suppliers:manage",
  CUSTOMERS_VIEW: "customers:view",
  CUSTOMERS_MANAGE: "customers:manage",
  SALES_VIEW: "sales:view",
  CREDIT_MANAGE: "credit:manage",
  DISCOUNTS_MANAGE: "discounts:manage",
  RETURNS_MANAGE: "returns:manage",
  WARRANTIES_MANAGE: "warranties:manage",
  NOTIFICATIONS_MANAGE: "notifications:manage",
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type PermissionPresentation = {
  label: string;
  group: string;
  description?: string;
};

/**
 * Human-friendly permission names used by the role editor. The API keys stay
 * stable while administrators see the page or feature that each key unlocks.
 */
export const PERMISSION_PRESENTATION: Record<string, PermissionPresentation> = {
  "dashboard:view": { label: "Dashboard", group: "Workspace" },
  "dashboard:customize": { label: "Dashboard Customization", group: "Workspace" },
  "dashboard:manage_templates": { label: "Dashboard Templates", group: "Workspace" },
  "dashboard:manage_themes": { label: "Dashboard Themes", group: "Workspace" },
  "sales:manage": {
    label: "Point of Sale (POS)",
    group: "Sales & Customers",
    description: "Open the POS, prepare quotes, and complete sales.",
  },
  "sales:view": { label: "Sales", group: "Sales & Customers" },
  "customers:view": { label: "Customers", group: "Sales & Customers" },
  "customers:manage": { label: "Customer Management & Loyalty", group: "Sales & Customers" },
  "credit:manage": { label: "Credit Management", group: "Sales & Customers" },
  "returns:manage": { label: "Returns & Refunds", group: "Sales & Customers" },
  "discounts:manage": { label: "Promotions & Bulk Discounts", group: "Sales & Customers" },
  "products:view": { label: "Products", group: "Catalog & Inventory" },
  "products:manage": { label: "Product Management", group: "Catalog & Inventory" },
  "inventory:view": { label: "Inventory", group: "Catalog & Inventory" },
  "inventory:manage": { label: "Inventory Management", group: "Catalog & Inventory" },
  "warranties:manage": { label: "Warranty & QR", group: "Catalog & Inventory" },
  "purchases:view": { label: "Purchases", group: "Purchasing" },
  "purchases:manage": { label: "Purchase Management", group: "Purchasing" },
  "suppliers:view": { label: "Suppliers", group: "Purchasing" },
  "suppliers:manage": { label: "Supplier Management", group: "Purchasing" },
  "users:manage": { label: "Employees", group: "Administration" },
  "roles:manage": { label: "Roles & Permissions", group: "Administration" },
  "branches:view": { label: "Branches", group: "Administration" },
  "branches:manage": { label: "Branch Management", group: "Administration" },
  "notifications:manage": { label: "Notification Admin", group: "Administration" },
  "reports:view": { label: "Reports", group: "Administration" },
  "audit:view": { label: "Audit Log", group: "Administration" },
  "settings:view": { label: "Settings", group: "Administration" },
  "settings:manage": { label: "Organization Settings", group: "Administration" },
  "supplier-portal:access": { label: "Supplier Portal", group: "External Applications" },
  "customer-app:access": { label: "Customer Mobile App", group: "External Applications" },
};

export function getPermissionPresentation(
  key: string,
  description?: string | null,
): PermissionPresentation {
  const configured = PERMISSION_PRESENTATION[key];
  if (configured) {
    return { ...configured, description: configured.description ?? description ?? undefined };
  }

  const [scope, action] = key.split(":");
  const title = (value: string) =>
    value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  return {
    label: [scope, action].filter(Boolean).map(title).join(" · "),
    group: "Other Features",
    description: description ?? undefined,
  };
}

export function canEditRolePermissions(roleName: string): boolean {
  return roleName !== SYSTEM_ROLES.SUPER_ADMIN;
}

const PAGE_PERMISSION_RULES: ReadonlyArray<readonly [string, Permission]> = [
  ["/ai-intelligence", PERMISSIONS.DASHBOARD_VIEW],
  ["/returns-refunds", PERMISSIONS.RETURNS_MANAGE],
  ["/notification", PERMISSIONS.NOTIFICATIONS_MANAGE],
  ["/notifications", PERMISSIONS.NOTIFICATIONS_MANAGE],
  ["/offline-sync", PERMISSIONS.SALES_MANAGE],
  ["/warranties", PERMISSIONS.WARRANTIES_MANAGE],
  ["/qr-scanner", PERMISSIONS.WARRANTIES_MANAGE],
  ["/promotions", PERMISSIONS.DISCOUNTS_MANAGE],
  ["/discounts", PERMISSIONS.DISCOUNTS_MANAGE],
  ["/employees", PERMISSIONS.USERS_MANAGE],
  ["/customers", PERMISSIONS.CUSTOMERS_VIEW],
  ["/suppliers", PERMISSIONS.SUPPLIERS_VIEW],
  ["/purchases", PERMISSIONS.PURCHASES_VIEW],
  ["/inventory", PERMISSIONS.INVENTORY_VIEW],
  ["/products", PERMISSIONS.PRODUCTS_VIEW],
  ["/branches", PERMISSIONS.BRANCHES_VIEW],
  ["/audit-log", PERMISSIONS.AUDIT_VIEW],
  ["/reports", PERMISSIONS.REPORTS_VIEW],
  ["/settings", PERMISSIONS.SETTINGS_VIEW],
  ["/credit", PERMISSIONS.CREDIT_MANAGE],
  ["/sales", PERMISSIONS.SALES_VIEW],
  ["/pos", PERMISSIONS.SALES_MANAGE],
  ["/dashboard", PERMISSIONS.DASHBOARD_VIEW],
];

export function getRequiredPagePermission(pathname: string): Permission | null {
  return (
    PAGE_PERMISSION_RULES.find(
      ([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )?.[1] ?? null
  );
}

export function hasPageAccess(
  pathname: string,
  permissions: readonly string[],
  roles: readonly string[],
): boolean {
  if (roles.includes(SYSTEM_ROLES.SUPER_ADMIN)) return true;
  const requiredPermission = getRequiredPagePermission(pathname);
  return requiredPermission === null || permissions.includes(requiredPermission);
}

export const SYSTEM_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  CASHIER: "CASHIER",
  SUPPLIER: "SUPPLIER",
} as const;

export type SystemRole =
  (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];
