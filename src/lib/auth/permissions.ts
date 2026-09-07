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

export const SYSTEM_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  CASHIER: "CASHIER",
  SUPPLIER: "SUPPLIER",
} as const;

export type SystemRole =
  (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];
