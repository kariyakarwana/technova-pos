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
} as const;

export type Permission =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const SYSTEM_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  CASHIER: "CASHIER",
} as const;

export type SystemRole =
  (typeof SYSTEM_ROLES)[keyof typeof SYSTEM_ROLES];