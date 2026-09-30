"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BellRing,
  Bot,
  Boxes,
  GitFork,
  HandCoins,
  LayoutDashboard,
  Megaphone,
  Package,
  QrCode,
  ReceiptText,
  RotateCcw,
  ShoppingCart,
  Tag,
  Truck,
  UserCog,
  Users,
  BarChart3,
  History,
  Settings,
  WifiOff,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard", permission: "dashboard:view" },
  { name: "Point of Sale", icon: Tag, href: "/pos", permission: "sales:manage" },
  { name: "Sales", icon: ReceiptText, href: "/sales", permission: "sales:view" },
  { name: "Products", icon: Package, href: "/products", permission: "products:view" },
  { name: "Inventory", icon: Boxes, href: "/inventory", permission: "inventory:view" },
  { name: "Warranty & QR", icon: QrCode, href: "/warranties", permission: "warranties:manage" },
  { name: "Purchases", icon: ShoppingCart, href: "/purchases", permission: "purchases:view" },
  { name: "Suppliers", icon: Truck, href: "/suppliers", permission: "suppliers:view" },
  { name: "Customers", icon: Users, href: "/customers", permission: "customers:view" },
  { name: "Credit Management", icon: HandCoins, href: "/credit", permission: "credit:manage" },
  { name: "Returns & Refunds", icon: RotateCcw, href: "/returns-refunds", permission: "returns:manage" },
  { name: "AI Intelligence", icon: Bot, href: "/ai-intelligence", permission: "dashboard:view" },
  { name: "Employees", icon: UserCog, href: "/employees", permission: "users:manage" },
  { name: "Branches", icon: GitFork, href: "/branches", permission: "branches:view" },
  { name: "Promotions", icon: Megaphone, href: "/promotions", permission: "discounts:manage" },
  { name: "Bulk Discounts", icon: Tag, href: "/discounts", permission: "discounts:manage" },
  { name: "Notification Admin", icon: BellRing, href: "/notifications", permission: "notifications:manage" },
  { name: "Reports", icon: BarChart3, href: "/reports", permission: "reports:view" },
  { name: "Offline Sync", icon: WifiOff, href: "/offline-sync", permission: "sales:manage" },
  { name: "Audit Log", icon: History, href: "/audit-log", permission: "audit:view" },
  { name: "Settings", icon: Settings, href: "/settings", permission: "settings:view" },
] as const;

export default function Sidebar({
  permissions = [],
  roles = [],
  collapsed = false,
}: {
  permissions?: string[];
  roles?: string[];
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const isSuperAdmin = roles.includes("SUPER_ADMIN");

  return (
    <nav
      aria-label="Dashboard navigation"
      className={`flex w-full flex-col gap-2 py-3 transition-[padding] duration-200 ${collapsed ? "px-2" : "px-4"}`}
    >
      {navItems.filter((item) => !("permission" in item) || isSuperAdmin || permissions.includes(item.permission)).map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/dashboard" || ("exact" in item && item.exact)
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.name}
            title={collapsed ? item.name : undefined}
            className={`grid h-11 items-center rounded-2xl border-[1.5px] font-medium transition-all duration-200 ${
              collapsed
                ? "mx-auto w-12 grid-cols-1 place-items-center px-0"
                : "w-full grid-cols-[1.25rem_minmax(0,1fr)_1.25rem] gap-3 px-4"
            } ${
              isActive
                ? "border-[#004532] bg-[#004532] font-semibold shadow-md shadow-[#004532]/25"
                : "border-[#0E9384] bg-white hover:bg-[#EEFFFD]"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center">
              <Icon
                className={`h-5 w-5 shrink-0 ${
                  isActive ? "text-white" : "text-[#0E9384]"
                }`}
                aria-hidden="true"
              />
            </span>
            <span
              className={`${collapsed ? "sr-only" : "min-w-0 whitespace-nowrap text-center text-sm leading-none"} ${
                isActive ? "font-semibold text-white" : "text-[#0E9384]"
              }`}
            >
              {item.name}
            </span>
            {!collapsed && <span aria-hidden="true" className="h-5 w-5" />}
          </Link>
        );
      })}
    </nav>
  );
}
